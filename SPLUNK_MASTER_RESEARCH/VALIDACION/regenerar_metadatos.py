#!/usr/bin/env python3
"""Regenera contratos de fixtures/manifiestos/hashes solo en investigación Splunk.

No importa contenidos en React ni usa scripts/prepare-content.mjs. --apply escribe
únicamente metadatos y notas de los cinco paquetes; requiere respaldo previo.
"""
from pathlib import Path
import argparse
import csv
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
REVISION = '2026-10-16-r1'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dump(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'


def contract_for(package):
    datasets = []
    for file in sorted((package/'PRACTICAS/fixtures').glob('*.csv')):
        with file.open(newline='', encoding='utf-8') as handle:
            reader = csv.DictReader(handle)
            columns, rows = reader.fieldnames, list(reader)
        maps = {name: name for name in columns}
        for name in ('event_time_utc', 'timestamp_utc', '_time'):
            if name in maps:
                maps[name] = '_time'
        if 'indexed_at_utc' in maps:
            maps['indexed_at_utc'] = 'fixture_index_epoch'
        if file.name == 'tgs_requests.csv':
            maps.update(event_id='EventCode', service='ServiceName',
                        encryption='TicketEncryptionType', id='fixture_id')
        if file.name == 'replication_events.csv':
            maps.update(event_id='EventCode', id='fixture_id')
        if file.name == 'ti_indicators.csv':
            # La lookup utiliza las columnas originales, sin convertir notas en scores.
            maps = {name: name for name in columns}
        key = next((name for name in ('id', 'finding_id', 'indicator_id', 'event_id',
                   'case_id', 'attempt_id', 'action_id', 'variant', 'index', 'bucket_utc')
                   if name in columns), None)
        datasets.append({
            'file': file.relative_to(package).as_posix(),
            'sha256': digest(file), 'row_count': len(rows), 'columns': columns,
            'row_id': key, 'field_mapping_for_design': maps,
            'timezone': 'UTC where a time/date column exists',
            'time_bounds': '[start,end)', 'snapshot_cutoff': 'synthetic_index_time < cutoff',
            'mapping_executed_in_splunk': False,
        })
    return {
        'schema_version': '1.0', 'revision': REVISION, 'package': package.name,
        'scope': 'synthetic_csv_contract_offline_only',
        'splunk_execution': False, 'datasets': datasets,
        'notes': [
            'Cada dataset conserva su escenario; una IP coincidente no une escenarios.',
            'Las asignaciones son diseño; no instalan extracciones, inputs ni lookups.',
            '_time en el modelo offline es epoch sintético; no es metadata creada en una instancia.',
            'fixture_index_epoch nunca sustituye al metadato _indextime real.',
            'TI: inicio inclusivo y expiración exclusiva a medianoche UTC; referencia 2026-10-16T12:00:00Z.',
            'ServiceName sintético no certifica un SPN nativo; operation_kind no es campo nativo 4662.',
        ],
    }


def regenerate():
    canonical = ROOT/'03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json'
    curriculum = json.loads(canonical.read_text())
    by_id = {l['id']: l for r in curriculum['regions'] for l in r['lessons']}
    for package in sorted(ROOT.glob('SPLUNK_LECCIONES_*')):
        contracts = contract_for(package)
        (package/'VALIDACION/DATASETS.json').write_text(dump(contracts))
        readme = package/'README.md'
        text = readme.read_text().split('\n## Corrección editorial r1\n')[0].rstrip()
        text += ('\n\n## Corrección editorial r1\n\n'
                 '16/10/2026: IDs originales conservados; MCQ con distractores revisados y opciones '
                 'con identidad estable, distribuidas sin posición dominante por región. '
                 'Teoría: umbral 80 %. Abiertas: formativas, sin calificación automática. '
                 'Aprobar teoría no acredita dominio práctico. Revisión humana independiente pendiente.\n\n'
                 'VALIDACION/DATASETS.json fija archivos, columnas, horas y mapeos de diseño; '
                 'no importa CSV ni configura Splunk. Los verificadores requieren conservar el '
                 'directorio padre con currículo y VALIDACION compartida. Ejecutar con python3 -B. '
                 'El comprobador llama al test de fixtures local y comprueba sincronización/hashes.\n\n'
                 'La nueva política sustituye umbrales de dominio práctico editoriales anteriores: '
                 'no existe autocorrección de P01. Ver ../CORRECCIONES_FINALES.md y ../PLAN_INTEGRACION.md. '
                 'No se ha integrado React ni ejecutado Splunk/ES/SOAR.\n')
        readme.write_text(text)
        manifest_path = package/'VALIDACION/MANIFIESTO.json'
        manifest = json.loads(manifest_path.read_text())
        catalog = []
        bank = json.loads(next((package/'ACTIVIDADES').glob('BANCO*.json')).read_text())
        for file in sorted(package.glob('R*/SP-R*-L*.md')):
            lesson_id = file.stem
            catalog.append({
                'id': lesson_id, 'title': by_id[lesson_id]['title'],
                'file': file.relative_to(package).as_posix(),
                'learning_outcome': by_id[lesson_id]['learning_outcome'],
                'activity_ids': sorted(a['id'] for a in bank['activities'] if a['lesson_id'] == lesson_id),
                'source_refs': sorted({ref for a in bank['activities'] if a['lesson_id'] == lesson_id
                                       for ref in a['source_refs']}),
                'splunk_executed': False, 'human_review': 'pending_independent_review',
            })
        # Actualizar también referencias de las fichas anteriores, si estaban presentes.
        for old in manifest.get('lessons', []):
            item = next(x for x in catalog if x['id'] == old.get('id', old.get('lesson_id')))
            if 'doc_sources' in old:
                old['doc_sources'] = item['source_refs']
        shared = {p.name: digest(p) for p in sorted((ROOT/'VALIDACION').iterdir()) if
                  p.is_file() and p.suffix in {'.py', '.json', '.tsv', '.md'}}
        manifest.update({
            'editorial_revision': REVISION, 'editorial_schema_version': '1.1',
            'canonical_curriculum': '../03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json',
            'canonical_curriculum_sha256': digest(canonical), 'lesson_catalog': catalog,
            'assessment_policy': bank['assessment_policy'],
            'source_namespace': package.name, 'shared_validation_sha256': shared,
            'validation_scope': 'offline_structure_dataset_arithmetic_and_regression_only',
            'human_review': 'pending_independent_review', 'react_integrated': False,
            'splunk_executed': False, 'es_tested': False, 'soar_tested': False,
        })
        if 'canonical_lesson_ids' in manifest:
            manifest['canonical_lesson_ids'] = 'SP-Rxx-Lxx; canonical curriculum IDs preserved; not integrated'
        files = sorted(p for p in package.rglob('*') if p.is_file() and p.name != 'SHA256SUMS.txt'
                       and p != manifest_path and '__pycache__' not in p.parts)
        manifest['sha256_by_path'] = {p.relative_to(package).as_posix(): digest(p) for p in files}
        manifest_path.write_text(dump(manifest))
        (package/'VALIDACION/SHA256SUMS.txt').write_text(''.join(
            f'{digest(p)}  {p.relative_to(package).as_posix()}\n' for p in sorted(files + [manifest_path])))
        print(package.name + ': metadatos y ' + str(len(files)+1) + ' hashes regenerados')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if not args.apply:
        raise SystemExit('Añade --apply para regenerar metadatos editoriales; nunca React.')
    if not (ROOT/'RESPALDOS/editorial_2026-10-16/paquetes_antes.tar.gz').is_file():
        raise SystemExit('Falta respaldo previo')
    regenerate()
