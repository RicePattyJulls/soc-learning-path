#!/usr/bin/env python3
"""Reescritura mecánica de bancos/representaciones editoriales; no genera React.

Entrada semántica revisable: ajustes_editoriales.json + distractores_revisados.tsv.
Solo --apply escribe. La escritura exige el respaldo local previo.
"""
from pathlib import Path
import argparse
import hashlib
import json
import random
import re

ROOT = Path(__file__).resolve().parents[1]
REVISION = '2026-10-16-r1'
POLICY = {
    'theory_pass_percent': 80,
    'open_practice': 'formative_not_auto_graded',
    'theory_pass_implies_practical_mastery': False,
    'practical_mastery': 'not_certified',
    'human_content_review': 'pending_independent_review',
    'react_integration': 'not_implemented',
}
POLICY_TEXT = ('**Política educativa aprobada:** teoría autocorregible con umbral del 80 %; '
               'práctica abierta formativa, sin calificación automática ni premio de dominio práctico. '
               'Aprobar teoría no acredita dominio práctico de Splunk. '
               'La revisión humana independiente del contenido y la ejecución real siguen pendientes.')


def serialize(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'


def balanced_positions(activities):
    """Cuotas por región; orden no cíclico, pares distintos, sin opción dominante."""
    result = {}
    offset = 0
    for region in sorted({a['region_id'] for a in activities}):
        questions = sorted((a for a in activities if a['region_id'] == region and
                            a['type'] == 'multiple_choice'), key=lambda a: a['id'])
        positions = [(offset + i) % 4 for i in range(len(questions))]
        rng = random.Random('splunk-editorial-r1:' + region)
        for _ in range(10000):
            rng.shuffle(positions)
            if all(positions[i] != positions[i+1] for i in range(0, len(positions), 2)):
                break
        else:
            raise ValueError('No se pudo distribuir la región ' + region)
        result.update(zip((a['id'] for a in questions), positions))
        offset += len(questions)
    return result


def render_activities(lesson_id, acts, first_section):
    lines = [f'## {first_section}. Actividades', '']
    for a in acts:
        kind = 'Opción múltiple' if a['type'] == 'multiple_choice' else 'Práctica abierta formativa'
        lines += [f'### {a["id"]} — {kind}', '', a['question'], '']
        if a['type'] == 'multiple_choice':
            lines += [f'{chr(65+i)}. {o}' for i, o in enumerate(a['options'])] + ['']
    lines += [f'## {first_section+1}. Solucionario con razonamiento' if first_section == 6 or
              lesson_id.startswith(('SP-R08', 'SP-R09', 'SP-R10', 'SP-R11')) else
              '### Solucionario con razonamiento', '']
    for a in acts:
        if a['type'] == 'multiple_choice':
            lines += [f'- **{a["id"]}: {chr(65+a["correct_index"])}** — {a["explanation"]}', '']
        else:
            lines += [f'- **{a["id"]}:** {a["reference_answer"]}', '',
                      '**Guía de retroalimentación formativa:** ' + '; '.join(a['rubric']) + '.', '']
    lines += [POLICY_TEXT, '']
    return '\n'.join(lines) + '\n'


def prepare():
    edits = json.loads((ROOT/'VALIDACION/ajustes_editoriales.json').read_text())['activities']
    answers = {}
    for line in (ROOT/'VALIDACION/respuestas_revisadas.tsv').read_text().splitlines():
        if line and not line.startswith('#'):
            qid, answer = line.split('\t')
            answers['SP-' + qid] = answer
    alternatives = {}
    for line in (ROOT/'VALIDACION/distractores_revisados.tsv').read_text().splitlines():
        if not line or line.startswith('#'):
            continue
        qid, *values = line.split('\t')
        if len(values) != 3 or qid in alternatives:
            raise ValueError('Distractores inválidos: ' + qid)
        alternatives['SP-' + qid] = values
    packages = sorted(ROOT.glob('SPLUNK_LECCIONES_*'))
    banks = [(p, next((p/'ACTIVIDADES').glob('BANCO*.json'))) for p in packages]
    all_activities = [a for _, p in banks for a in json.loads(p.read_text())['activities']]
    positions = balanced_positions(all_activities)
    if set(positions) != set(alternatives) or len(positions) != 160:
        raise ValueError('Se requieren exactamente 160 grupos de distractores')
    changes = {}
    for package, bank_file in banks:
        bank = json.loads(bank_file.read_text())
        bank.pop('grading_policy', None)
        bank['graded_policy'] = 'theory >=80%; open formative, no auto grading; no practical mastery'
        bank['assessment_policy'] = POLICY
        bank['schema_version'] = '1.1'
        bank['editorial_revision'] = REVISION
        bank['source_namespace'] = package.name
        for a in bank['activities']:
            a.update(edits.get(a['id'], {}))
            a['editorial_revision'] = REVISION
            a['human_review_status'] = 'pending_independent_review'
            a['practical_mastery_eligible'] = False
            a['source_namespace'] = package.name
            if a['type'] == 'multiple_choice':
                a['correct_answer'] = answers.get(a['id'], a['correct_answer'])
                correct = a['correct_answer']
                options = alternatives[a['id']][:]
                random.Random('options:' + a['id']).shuffle(options)
                options.insert(positions[a['id']], correct)
                if len(set(options)) != 4:
                    raise ValueError('Opciones duplicadas: ' + a['id'])
                a['options'], a['correct_index'] = options, positions[a['id']]
                a['option_ids'] = [a['id']+'-O-'+hashlib.sha256(o.encode()).hexdigest()[:12]
                                   for o in options]
                a['solution_option_id'] = a['option_ids'][a['correct_index']]
                a['assessment_role'] = 'theory_candidate_not_yet_assigned_to_app_phase'
                a['auto_gradable'] = True
            else:
                a['auto_gradable'] = False
                a['assessment_role'] = 'formative_only'
        changes[bank_file] = serialize(bank)
        sol = ['# Solucionario editorial sincronizado — ' + package.name, '',
               POLICY_TEXT, '', 'Respuestas orientativas; sin ejecución de Splunk/ES/SOAR.', '']
        for lesson in sorted(package.glob('R*/SP-R*-L*.md')):
            lid, text = lesson.stem, lesson.read_text()
            acts = sorted((a for a in bank['activities'] if a['lesson_id'] == lid),
                          key=lambda a: (a['type'] != 'multiple_choice', a['id']))
            region = int(lid[4:6])
            first = 6 if region <= 5 else 7
            end = 8 if region <= 7 else 9
            prefix, tail = text.split(f'\n## {first}.', 1)[0], text.split(f'\n## {end}.', 1)[1]
            if '**Contrato de fixture:**' not in prefix:
                prefix += ('\n\n**Contrato de fixture:** [Columnas, mapeos y UTC](../VALIDACION/DATASETS.json). '
                           'Los periodos relativos de ejemplos generales son estructurales; '
                           'solo atribuir cifras a un CSV con su rango, población y snapshot explícitos. '
                           'El modelo offline no configura Splunk ni recrea _indextime.\n')
            changes[lesson] = prefix.rstrip() + '\n\n' + render_activities(lid, acts, first) + f'## {end}.' + tail
            for a in acts:
                sol += ['## ' + a['id'], '']
                if a['type'] == 'multiple_choice':
                    sol += [f'**{chr(65+a["correct_index"])} — {a["correct_answer"]}**. {a["explanation"]}', '']
                else:
                    sol += [a['reference_answer'], '']
        changes[package/'ACTIVIDADES/SOLUCIONARIO.md'] = '\n'.join(sol) + '\n'
        rubric = ['# Evaluación teórica y retroalimentación formativa', '', POLICY_TEXT, '',
                  '## Teoría', '',
                  'Las MCQ son candidatas a evaluación teórica: necesitan revisión humana independiente '
                  'y asignación de fases antes del piloto. Para N preguntas, se requieren '
                  'ceil(0,8 × N) aciertos. Dos preguntas exigen dos aciertos; esto no acredita práctica.', '',
                  '## Prácticas abiertas', '',
                  'Cada P01 conserva sus criterios específicos en el banco y la lección. '
                  'Se usan para autoexplicación y feedback humano, sin coincidencia literal, nota automática, '
                  'desbloqueo o XP por una supuesta calificación práctica.', '',
                  'Separar observaciones, hipótesis, cobertura y siguiente paso autorizado. '
                  'Una atribución sin evidencia necesita corrección, no un porcentaje automático de dominio.', '',
                  '## Incertidumbre y estado', '',
                  'No coincidencia de regla no implica benignidad. TP/FP/FN/TN requieren verdad de referencia; '
                  'suspicious_unconfirmed e inconclusive no acreditan ataque. '
                  'Una prueba CSV solo comprueba cálculos offline, nunca sintaxis SPL o producto real.', '']
        changes[package/'ACTIVIDADES/RUBRICA.md'] = '\n'.join(rubric)
    return changes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    changes = prepare()
    if args.apply:
        backup = ROOT/'RESPALDOS/editorial_2026-10-16/paquetes_antes.tar.gz'
        if not backup.is_file():
            raise SystemExit('Falta respaldo previo; no se escribe')
        for p, text in changes.items():
            p.write_text(text, encoding='utf-8')
    print(('APLICADO' if args.apply else 'PREVISUALIZADO') +
          f': {len(changes)} representaciones editoriales; 80 lecciones, 240 actividades, sin React.')


if __name__ == '__main__':
    main()
