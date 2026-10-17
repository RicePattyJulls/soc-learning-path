#!/usr/bin/env python3
"""Validación de lectura offline. Nunca modifica contenido, hashes ni progreso."""
from collections import Counter
from pathlib import Path
import argparse
import csv
import hashlib
import json
import math
import re
import subprocess
import sys

from offline_core import (action_decision, api_decision, auth_groups, bucket,
                          confusion_label, epoch, network_totals, replay_ledger,
                          ti_matches, valid_indicators, normalize_fixture)

ROOT = Path(__file__).resolve().parents[1]
REVISION = '2026-10-16-r1'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read_json(file):
    return json.loads(file.read_text(encoding='utf-8'))


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def csv_rows(file):
    with file.open(newline='', encoding='utf-8') as handle:
        return list(csv.DictReader(handle))


def safe_file(base, relative):
    file = (base/relative).resolve()
    require(file.is_relative_to(base.resolve()) and file.is_file(), 'Ruta fuera de ámbito: ' + relative)
    return file


def verify_hashes(package, manifest):
    expected = manifest['sha256_by_path']
    actual = {p.relative_to(package).as_posix() for p in package.rglob('*') if p.is_file()
              and p.name not in {'SHA256SUMS.txt', 'MANIFIESTO.json'} and '__pycache__' not in p.parts}
    require(set(expected) == actual, 'Cobertura incompleta de hashes en ' + package.name)
    for relative, digest in expected.items():
        require(sha(safe_file(package, relative)) == digest, 'SHA256 incorrecto: ' + relative)
    listed = {}
    for row in (package/'VALIDACION/SHA256SUMS.txt').read_text().splitlines():
        digest, relative = row.split('  ', 1)
        require(relative not in listed, 'Entrada SHA duplicada: ' + relative)
        listed[relative] = digest
        require(sha(safe_file(package, relative)) == digest, 'Lista SHA incorrecta: ' + relative)
    require(set(listed) == actual | {'VALIDACION/MANIFIESTO.json'}, 'Lista SHA incompleta')
    shared = manifest['shared_validation_sha256']
    shared_files = {p.name for p in (ROOT/'VALIDACION').iterdir() if p.is_file() and
                    p.suffix in {'.py', '.json', '.tsv', '.md'}}
    require(set(shared) == shared_files, 'Dependencias de validación compartida no inventariadas')
    for relative, digest in shared.items():
        require(sha(safe_file(ROOT/'VALIDACION', relative)) == digest, 'Validador compartido cambiado: '+relative)
    return len(listed)


def verify_bank(bank, texts, solutions, sources):
    acts = bank['activities']
    require(len({a['id'] for a in acts}) == len(acts), 'IDs de actividad duplicados')
    policy = bank['assessment_policy']
    require(policy['theory_pass_percent'] == 80 and
            policy['open_practice'] == 'formative_not_auto_graded' and
            policy['theory_pass_implies_practical_mastery'] is False, 'Política educativa incorrecta')
    require('grading_policy' not in bank and bank['graded_policy'], 'Política ambigua o antigua')
    for a in acts:
        require(a['lesson_id'] in texts, 'Actividad fuera de lección: '+a['id'])
        text = texts[a['lesson_id']]
        require(a['splunk_executed'] is False and a['practical_mastery_eligible'] is False,
                'Estado práctico inventado: '+a['id'])
        require(a['source_namespace'] == bank['source_namespace'] and a['source_refs'], 'Fuentes sin ámbito')
        for reference in a['source_refs']:
            require(reference in sources, 'Referencia desconocida: '+reference)
        require(text.count('### '+a['id']+' — ') == 1 and a['question'] in text, 'Prompt desincronizado: '+a['id'])
        block = solutions.split('## '+a['id']+'\n', 1)
        require(len(block) == 2, 'Actividad sin solucionario: '+a['id'])
        block = block[1].split('\n## ', 1)[0]
        if a['type'] == 'multiple_choice':
            require(len(a['options']) == 4 and len(set(a['options'])) == 4, 'Opciones no únicas')
            require(type(a['correct_index']) is int and 0 <= a['correct_index'] < 4, 'Índice incorrecto')
            require(a['options'][a['correct_index']] == a['correct_answer'], 'Respuesta incorrecta')
            require(len(set(a['option_ids'])) == 4 and a['solution_option_id'] ==
                    a['option_ids'][a['correct_index']], 'ID de opción incorrecto')
            require(a['auto_gradable'] is True, 'MCQ sin política teórica')
            for i, option in enumerate(a['options']):
                require(f'{chr(65+i)}. {option}\n' in text, 'Opción MD desincronizada: '+a['id'])
            answer = chr(65+a['correct_index'])
            require(f'**{a["id"]}: {answer}** — {a["explanation"]}' in text, 'Clave MD desincronizada')
            require(f'**{answer} — {a["correct_answer"]}**. {a["explanation"]}' in block,
                    'Clave de solucionario desincronizada')
        else:
            require(a['type'] == 'open_practice' and a['auto_gradable'] is False and
                    a['assessment_role'] == 'formative_only', 'Abierta autocorregida')
            require(a['reference_answer'] in text and a['reference_answer'] in block and a['rubric'],
                    'Respuesta formativa desincronizada')
    for lid in texts:
        require({a['id'] for a in acts if a['lesson_id'] == lid} ==
                {lid+'-Q01', lid+'-Q02', lid+'-P01'}, 'Actividades cambiadas: '+lid)
    for region in {a['region_id'] for a in acts}:
        mcq = [a for a in acts if a['region_id'] == region and a['type'] == 'multiple_choice']
        counts = Counter(a['correct_index'] for a in mcq)
        require(set(counts) == {0,1,2,3} and max(counts.values()) - min(counts.values()) <= 1,
                'Sesgo de respuesta en '+region)
        for shortest in (True,False):
            guessed = 0
            for a in mcq:
                lengths = [len(o) for o in a['options']]
                candidate = (min if shortest else max)(range(4),key=lambda i:lengths[i])
                guessed += candidate == a['correct_index']
            require(guessed <= len(mcq)/2, 'Pista de longitud dominante en '+region)


def verify_dataset_contracts(package):
    contract = read_json(package/'VALIDACION/DATASETS.json')
    entries = contract['datasets']
    require({d['file'] for d in entries} ==
            {p.relative_to(package).as_posix() for p in (package/'PRACTICAS/fixtures').glob('*.csv')},
            'Contrato de datasets incompleto')
    count = 0
    for entry in entries:
        file = safe_file(package, entry['file'])
        rows = csv_rows(file)
        require(len(rows) == entry['row_count'] and sha(file) == entry['sha256'], 'Fixture modificada sin contrato')
        require(set(entry['field_mapping_for_design']) == set(entry['columns']), 'Mapeo incompleto')
        require(entry['mapping_executed_in_splunk'] is False, 'Mapeo declarado ejecutado')
        for row in rows:
            require(list(row) == entry['columns'] and None not in row and
                    all(v is not None for v in row.values()), 'Columnas CSV inválidas')
            for key, value in row.items():
                if value and ('time_utc' in key or key in {'timestamp_utc', '_time', 'indexed_at_utc'}):
                    epoch(value)
            modeled = normalize_fixture(row, entry)
            require('_indextime' not in modeled, 'Metadata de indexación fabricada')
        if entry['row_id']:
            ids = [r[entry['row_id']] for r in rows]
            require(all(ids) and len(set(ids)) == len(ids), 'ID de fila no único')
        count += len(rows)
    return len(entries), count


def verify_package(package, run_fixtures=True):
    manifest = read_json(package/'VALIDACION/MANIFIESTO.json')
    curriculum_file = ROOT/'03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json'
    require(manifest['canonical_curriculum_sha256'] == sha(curriculum_file), 'Currículo canónico cambiado')
    canonical = {l['id']: l for r in read_json(curriculum_file)['regions'] for l in r['lessons']}
    lessons = {p.stem: p for p in package.glob('R*/SP-R*-L*.md')}
    manifest_ids = [entry['id'] for entry in manifest['lesson_catalog']]
    require(len(set(manifest_ids)) == len(manifest_ids) and set(manifest_ids) == set(lessons), 'Manifiesto desincronizado')
    regions = {lid[:6] for lid in lessons}
    require(set(lessons) == {lid for lid in canonical if lid[:6] in regions}, 'Región incompleta')
    texts = {lid: p.read_text() for lid, p in lessons.items()}
    for entry in manifest['lesson_catalog']:
        lid = entry['id']
        require(entry['title'] == canonical[lid]['title'] and
                entry['learning_outcome'] == canonical[lid]['learning_outcome'], 'Currículo divergente: '+lid)
        require(texts[lid].startswith('# '+lid+' — '+canonical[lid]['title']+'\n') and
                canonical[lid]['learning_outcome'] in texts[lid], 'Lección divergente: '+lid)
        require(safe_file(package, entry['file']) == lessons[lid].resolve(), 'Archivo erróneo en catálogo')
        require(entry['activity_ids'] == sorted(lid+suffix for suffix in ('-Q01','-Q02','-P01')), 'IDs nuevos en manifiesto')
        require('práctica abierta formativa' in texts[lid].lower(), 'Política ausente en lección')
    bank = read_json(next((package/'ACTIVIDADES').glob('BANCO*.json')))
    verify_bank(bank, texts, (package/'ACTIVIDADES/SOLUCIONARIO.md').read_text(),
                (package/'VALIDACION/FUENTES_Y_LIMITES.md').read_text())
    for file in package.rglob('*.md'):
        for match in re.finditer(r'`((?:\.\./)+[^`\s]+)`', file.read_text()):
            require((file.parent/match[1]).resolve().is_file(), 'Referencia local rota: '+str(file)+': '+match[1])
    hashes = verify_hashes(package, manifest)
    datasets, rows = verify_dataset_contracts(package)
    if run_fixtures:
        scripts = list((package/'PRACTICAS/scripts').glob('verificar_fixture*.py'))
        require(len(scripts) == 1, 'Se requiere un verificador local de fixtures')
        result = subprocess.run([sys.executable, '-B', str(scripts[0])], capture_output=True, text=True)
        require(result.returncode == 0, result.stdout + result.stderr)
    return {'package': package.name, 'lessons': len(lessons), 'activities': len(bank['activities']),
            'mcq': sum(a['type']=='multiple_choice' for a in bank['activities']),
            'open': sum(a['type']=='open_practice' for a in bank['activities']),
            'hashes': hashes, 'datasets': datasets, 'rows': rows, 'status': 'PASS_OFFLINE'}


def semantic_regressions():
    r6 = ROOT/'SPLUNK_LECCIONES_R06_R07'
    a6 = csv_rows(r6/'PRACTICAS/fixtures/auth_activity.csv')
    early = auth_groups(a6, 'event_time_utc', 'EventCode', '4625', 'indexed_at_utc', '2026-10-15T09:16:00Z')
    late = auth_groups(a6, 'event_time_utc', 'EventCode', '4625')
    key = ('198.51.100.23', bucket('2026-10-15T09:00:00Z'))
    require(early[key][:2] == (6,6) and late[key][:2] == (7,6), 'Snapshot 6/6 -> 7/6 incorrecto')
    require(all(confusion_label(r['fixture_label'], False) == 'not_evaluable'
                for r in a6 if r['src']=='192.0.2.44'), 'NAT clasificado como TN')
    text = (r6/'R07_DETECTION_ENGINEERING/SP-R07-L04.md').read_text()
    require('negativo NAT compartido' not in text and 'tampoco acredita TN' in text, 'Regresión del caso inconcluso')
    r8 = ROOT/'SPLUNK_LECCIONES_R08_R09'
    a8 = csv_rows(r8/'PRACTICAS/fixtures/auth_activity.csv')
    groups = auth_groups(a8, 'event_time_utc', 'status', 'failure')
    require(groups[('198.51.100.44',bucket('2026-10-16T11:00:00Z'))][:2] == (4,1) and
            groups[('198.51.100.44',bucket('2026-10-16T11:15:00Z'))][:2] == (1,1), 'Frontera 11:15 incorrecta')
    flows = csv_rows(r8/'PRACTICAS/fixtures/net_egress.csv')
    totals = network_totals(flows)
    require(totals == {('backup-01','203.0.113.10'):865000000,
                       ('finance-07','203.0.113.99'):190000000,
                       ('finance-07','203.0.113.20'):20000000}, 'Red por destino incorrecta')
    bank8 = read_json(next((r8/'ACTIVIDADES').glob('BANCO*.json')))['activities']
    answer = next(a['reference_answer'] for a in bank8 if a['id']=='SP-R08-L06-P01')
    require(all(str(n) in answer for n in (865,210,190,20)), 'Solución P01 no refleja el tráfico completo')
    indicators = csv_rows(r8/'PRACTICAS/fixtures/ti_indicators.csv')
    require([r['indicator_id'] for r in valid_indicators(indicators, '2026-10-16T12:00:00Z')]==['I01','I03'], 'Vigencia TI incorrecta')
    require(ti_matches(flows,indicators,'2026-10-16T12:00:00Z') ==
            [('N01','I03'),('N02','I01'),('N04','I03')], 'Matches TI incorrectos')
    r10 = ROOT/'SPLUNK_LECCIONES_R10_R11'
    api = csv_rows(r10/'PRACTICAS/fixtures/api_job_lifecycle.csv')
    require(all(api_decision(r)==r['expected_decision'] for r in api), 'Política API no coincide')
    actions = csv_rows(r10/'PRACTICAS/fixtures/soar_actions.csv')
    require(all(action_decision(r)==r['decision'] for r in actions), 'Política de intenciones no coincide')
    runs = csv_rows(r10/'PRACTICAS/fixtures/automation_runs.csv')
    ledger, effects = replay_ledger(runs)
    require(len(ledger)==6 and len(effects)==1, 'Ledger sintético inconsistente')
    api_text = (r10/'R11_AUTOMATIZACION_SOAR/SP-R11-L02.md').read_text()
    require('POST https://splunk.example.test:8089/services/search/jobs\n' in api_text and
            'GET  https://splunk.example.test:8089/services/search/jobs/{sid}\n' in api_text and
            'POST https://splunk.example.test:8089/services/search/v2/jobs' not in api_text,
            'Endpoints documentales REST incorrectos')
    final = (r10/'R11_AUTOMATIZACION_SOAR/SP-R11-L07.md').read_text()
    require('EventCode=4625' in final and 'usuarios>=5' in final and 'status=failure' not in final and
            'proxy 203.0.113.15' not in final, 'Caso final sin contrato de R06')
    return 'PASS: snapshots, fronteras, incertidumbre, red/P01, TI, REST, intenciones y ledger sintéticos'


def preservation():
    baseline = read_json(ROOT/'RESPALDOS/editorial_2026-10-16/INVENTARIO_ANTES.json')
    project = ROOT.parent
    protected = {name: digest for name,digest in baseline['files'].items() if not
                 name.startswith('SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_') and
                 name != 'SPLUNK_MASTER_RESEARCH/README_PRIMERO.md'}
    for name,digest in protected.items():
        require(sha(project/name)==digest, 'Archivo protegido alterado: '+name)
    current = sorted(a['id'] for p in ROOT.glob('SPLUNK_LECCIONES_*')
                     for a in read_json(next((p/'ACTIVIDADES').glob('BANCO*.json')))['activities'])
    require(current==baseline['activity_ids'], 'IDs originales de actividad cambiados')
    return {'protected_files_unchanged': len(protected), 'original_activity_ids_preserved': len(current)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    results = [verify_package(p) for p in sorted(ROOT.glob('SPLUNK_LECCIONES_*'))]
    acts = [a for p in ROOT.glob('SPLUNK_LECCIONES_*') for a in
            read_json(next((p/'ACTIVIDADES').glob('BANCO*.json')))['activities']]
    ids = [a['id'] for a in acts]
    require(len(ids)==240 and len(set(ids))==240, '240 IDs únicos no conservados')
    require(Counter(a['correct_index'] for a in acts if a['type']=='multiple_choice')=={0:40,1:40,2:40,3:40}, 'Balance global cambiado')
    canonical = {l['id'] for r in read_json(ROOT/'03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json')['regions'] for l in r['lessons']}
    actual = [p.stem for package in ROOT.glob('SPLUNK_LECCIONES_*') for p in package.glob('R*/SP-R*-L*.md')]
    require(len(actual)==80 and set(actual)==canonical, '80 IDs canónicos no conservados')
    output = {'status':'PASS_OFFLINE', 'packages':results, 'semantic_regressions':semantic_regressions(),
              'preservation':preservation(), 'correct_positions':dict(Counter(a['correct_index'] for a in acts if a['type']=='multiple_choice')),
              'splunk_executed':False, 'human_review':'pending_independent_review', 'react_integrated':False}
    print(json.dumps(output, ensure_ascii=False, indent=2) if args.json else
          '\n'.join(str(r) for r in results)+'\n'+output['semantic_regressions']+'\n'+str(output['preservation']))


if __name__ == '__main__':
    main()
