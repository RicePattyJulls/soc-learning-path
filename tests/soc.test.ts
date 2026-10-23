import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateSoc } from '../scripts/prepare-soc.mjs';
import { catalog, caseById, mitreUrl } from '../src/soc/data';
import {
  applyAction, emptyStore, loadStore, mergeStores, MIN_ANSWER, recordFor, scoreFor, SOC_KEY, statusFor, validateStore, type Action,
} from '../src/soc/progress';
import { dueItems, reviewOverview, upcomingItems } from '../src/soc/review';
import { emptySchedule, INTERVALS } from '../src/soc/schedule';
import type { Answers, CaseContent, CaseEntry, Store } from '../src/soc/types';
import CaseBoard from '../src/soc/CaseBoard';
import Journal from '../src/soc/Journal';
import Review from '../src/soc/Review';
import Sources from '../src/soc/Sources';

const read = (file: string) => readFile(new URL('../' + file, import.meta.url), 'utf8');
const sha = (text: string) => createHash('sha256').update(text).digest('hex');
const payloads: CaseContent[] = await Promise.all(catalog.cases.map(item => read('public/' + item.file).then(JSON.parse)));
const answers: Answers[] = await Promise.all(catalog.cases.map(item => read('public/' + item.answersFile).then(JSON.parse)));
let clock = 100;
const send = (store: Store, index: number, action: Action) => applyAction(store, catalog.cases[index], action, ++clock);

test('Mundo SOC: cuarenta casos en ocho bloques y dos niveles, sin desbloqueos', () => {
  assert.equal(catalog.courseId, 'soc');
  assert.equal(catalog.cases.length, 40);
  assert.equal(catalog.blocks.length, 8);
  assert.deepEqual(catalog.levels.map(level => level.id), ['N1', 'N2']);
  assert.deepEqual(catalog.blocks.map(block => block.caseIds.length), Array(8).fill(5));
  assert.equal(new Set(catalog.cases.map(item => item.id)).size, 40);
  for (const item of catalog.cases) {
    assert.match(item.revision, /^[a-f0-9]{24}$/);
    assert.equal(item.file, `soc-content/${item.id}-${item.revision}.json`);
    assert.equal(item.answersFile, `soc-content/${item.id}-${item.revision}.answers.json`);
    assert.equal(item.blockId, catalog.blocks.find(block => block.caseIds.includes(item.id))!.id);
    assert.ok(item.rubricSize >= 3 && item.stepCount >= 5 && item.queryCount >= 3);
  }
});

test('Mundo SOC: contenido servido, hashes verificables y respuesta modelo separada', async () => {
  const files = new Set<string>();
  for (const [index, item] of catalog.cases.entries()) {
    const payloadText = await read('public/' + item.file);
    const answersText = await read('public/' + item.answersFile);
    files.add(item.file).add(item.answersFile);
    assert.equal(sha(payloadText), item.hash, item.id);
    assert.equal(sha(answersText), item.answersHash, item.id);
    const payload = JSON.parse(payloadText) as CaseContent;
    const solution = JSON.parse(answersText) as Answers;
    assert.equal(payload.courseId, 'soc');
    assert.equal(payload.revision, item.revision);
    assert.equal(solution.revision, item.revision);
    assert.equal(solution.sourceHash, item.sourceHash);
    assert.deepEqual(payload, payloads[index]);
    assert.deepEqual(solution, answers[index]);
    assert.match(payloadText, /"pregunta":/);
    assert.doesNotMatch(payloadText, /"(?:respuesta_entrevista|criterios_evaluacion|contencion|escalation|hipotesis|pasos|evidencias|kql|spl|comandos|falsos_positivos|errores|perspectiva_red_team|mitre|fuentes)":/);
    assert.equal(solution.criterios_evaluacion.length, item.rubricSize);
    assert.equal(solution.pasos.length, item.stepCount);
    assert.equal(solution.kql.length + solution.spl.length, item.queryCount);
    assert.ok(solution.respuesta_entrevista.length > 120);
    for (const query of [...solution.kql, ...solution.spl]) {
      assert.deepEqual(Object.keys(query).sort(), ['consulta', 'entorno', 'interpretacion', 'limitaciones', 'nombre']);
      assert.ok(query.consulta.trim() && query.limitaciones.trim());
    }
  }
  assert.equal(files.size, 80);
  assert.equal(catalog.sources.length > 60, true);
});

test('Mundo SOC: el generador reconstruye exactamente lo servido y no filtra soluciones', async () => {
  const { outputs, report } = await generateSoc();
  assert.equal(report.cases, 40);
  assert.equal(report.verifications.length, 40);
  assert.equal(report.answersSeparated, true);
  for (const [file, text] of outputs) assert.equal(await read(file), text, file);
  assert.equal(outputs.size, 81);
});

test('Mundo SOC: responder, revelar y autoevaluar mueve el estado sin bloquear nada', () => {
  let store = emptyStore();
  const entry = catalog.cases[0];
  assert.equal(statusFor(entry, recordFor(store, entry)), 'pendiente');
  store = send(store, 0, { type: 'answer', text: 'corto' });
  store = send(store, 0, { type: 'reveal' });
  assert.equal(recordFor(store, entry).revealed, false, 'una respuesta vacía de contenido no revela');
  store = send(store, 0, { type: 'answer', text: 'Empiezo validando la regla, agrupo por IP y busco éxitos asociados antes de escalar.' });
  assert.ok(recordFor(store, entry).answer.length > MIN_ANSWER);
  assert.equal(statusFor(entry, recordFor(store, entry)), 'en-curso');
  store = send(store, 0, { type: 'reveal' });
  assert.equal(recordFor(store, entry).revealed, true);
  assert.equal(statusFor(entry, recordFor(store, entry)), 'en-curso', 'revelar sin marcar criterios sigue en curso');
  for (let index = 0; index < entry.rubricSize; index += 1) store = send(store, 0, { type: 'selfCheck', criterion: index, value: 2 });
  assert.equal(scoreFor(recordFor(store, entry), entry)?.ratio, 1);
  assert.equal(statusFor(entry, recordFor(store, entry)), 'dominado');
  store = send(store, 0, { type: 'selfCheck', criterion: 0, value: 0 });
  assert.equal(statusFor(entry, recordFor(store, entry)), 'dominado', 'tres cuartos sigue siendo dominio');
  store = send(store, 0, { type: 'selfCheck', criterion: 1, value: 0 });
  assert.equal(statusFor(entry, recordFor(store, entry)), 'casi');
  store = send(store, 0, { type: 'selfCheck', criterion: 2, value: 0 });
  assert.equal(statusFor(entry, recordFor(store, entry)), 'repasar');
  store = send(store, 0, { type: 'reset' });
  assert.equal(statusFor(entry, recordFor(store, entry)), 'pendiente');
  const untouched = emptyStore();
  assert.equal(applyAction(untouched, { ...entry, revision: 'f'.repeat(24) }, { type: 'answer', text: 'texto suficientemente largo para pasar' }), untouched);
});

test('Mundo SOC: el progreso validado rechaza datos ajenos y se fusiona entre pestañas', () => {
  const entry = catalog.cases[1];
  let first = send(emptyStore(), 1, { type: 'answer', text: 'Respuesta suficientemente larga para guardarse en el almacén local.' });
  first = send(first, 1, { type: 'reveal' });
  first = send(first, 1, { type: 'selfCheck', criterion: 0, value: 2 });
  assert.ok(validateStore(first));
  assert.equal(validateStore({ ...first, courseId: 'linux' }), null);
  assert.equal(validateStore({ ...first, records: { [entry.id]: { ...first.records[entry.id], revision: 'a'.repeat(24) } } }), null);
  assert.equal(validateStore({ ...first, records: { [entry.id]: { ...first.records[entry.id], selfCheck: { 0: 7 } } } }), null);
  const second = (() => {
    let store = send(emptyStore(), 1, { type: 'answer', text: 'Comparo el patrón en ventanas de cinco minutos antes de concluir nada.' });
    store = send(store, 1, { type: 'reveal' });
    return send(store, 1, { type: 'selfCheck', criterion: 1, value: 1 });
  })();
  const merged = mergeStores(first, second);
  assert.equal(recordFor(merged, entry).revealed, true);
  assert.deepEqual(Object.keys(recordFor(merged, entry).selfCheck).sort(), ['0', '1']);
  const storage = { getItem: (key: string) => (key === SOC_KEY ? JSON.stringify(first) : null) };
  assert.equal(loadStore(storage).store.courseId, 'soc');
  assert.equal(loadStore({ getItem: () => '{' }).blocked, true);
  assert.notEqual(SOC_KEY, 'soc-learning-path:linux:learning:v1');

  const cleared = send(first, 1, { type: 'reset' });
  assert.equal(statusFor(entry, recordFor(cleared, entry)), 'pendiente');
  for (const mergedClear of [mergeStores(cleared, first), mergeStores(first, cleared)]) {
    const record = recordFor(mergedClear, entry);
    assert.equal(record.answer, '', 'la fusión no puede resucitar lo reiniciado');
    assert.equal(record.revealed, false);
    assert.deepEqual(record.selfCheck, {});
    assert.equal(record.review.due, null);
  }
  assert.equal(validateStore({ ...first, records: { [entry.id]: { ...first.records[entry.id], resetAt: 'ayer' } } }), null);
  const withoutReset = structuredClone(first) as Store & { records: Record<string, { resetAt?: unknown }> };
  delete withoutReset.records[entry.id].resetAt;
  assert.equal(validateStore(withoutReset)!.records[entry.id].resetAt, 0);
});

test('Mundo SOC: tablero y diario se renderizan sin depender de otras academias', () => {
  const board = renderToStaticMarkup(createElement(CaseBoard));
  assert.ok(board.includes('preguntas de entrevista y triaje'));
  assert.equal((board.match(/soc-case-card/g) || []).length, 40);
  for (const removed of ['Estado', 'Pendiente', 'soc-status', 'criterios']) assert.ok(!board.includes(removed), `tablero sin estados: ${removed}`);
  const journal = renderToStaticMarkup(createElement(Journal, { store: emptyStore(), exportProgress: () => {} }));
  assert.ok(journal.includes('Mi progreso en el Mundo SOC'));
  assert.ok(journal.includes('40'));
  const sources = renderToStaticMarkup(createElement(Sources));
  assert.equal((sources.match(/soc-source-list/g) || []).length, 1);
  assert.ok(sources.includes('revisado editorialmente por el propietario'));
  assert.ok(sources.includes('19/10/2026'));
  assert.equal(mitreUrl('T1110.001'), 'https://attack.mitre.org/techniques/T1110/001/');
  assert.equal(caseById.get('N1-01')?.nivel, 'N1');
});

test('Mundo SOC: el catálogo declara la revisión editorial del propietario y la ata a su fuente', async () => {
  const master = JSON.parse(await read('SOC_MASTER_RESEARCH/VALIDACION/CATALOGO-EDITORIAL.json'));
  const record = JSON.parse(await read('SOC_MASTER_RESEARCH/VALIDACION/REVISION-PROPIETARIO.json'));
  assert.equal(catalog.editorialStatus, master.editorialStatus);
  assert.deepEqual(catalog.educationalReview, master.educationalReview);
  assert.equal(catalog.educationalReview.kind, 'owner_editorial_review');
  assert.equal(catalog.educationalReview.independent, false);
  assert.equal(catalog.educationalReview.status, 'owner_review_complete');
  assert.equal(record.reviewedAt, catalog.educationalReview.reviewedAt);
  assert.equal(record.result, 'aprobado_sin_cambios_en_la_fuente');
  assert.deepEqual(record.changes, []);
  assert.equal(record.evidence.sourceFilesUnchanged, true);
  assert.equal(record.stillOpen.length >= 3, true);
  assert.equal(catalog.commandsExecuted, false, 'la revisión de lectura no ejecuta los comandos');
  assert.equal(catalog.practicalStatus, 'not_assessed');
  // La declaración señala exactamente estos casos: si el contenido cambia, hay que volver a revisarlo.
  const casesDigest = sha([...catalog.cases].sort((a, b) => a.id.localeCompare(b.id)).map(item => `${item.id}=${item.sourceHash}`).join(':'));
  assert.equal(record.evidence.casesDigest, casesDigest);
  const { catalog: generated } = await generateSoc();
  assert.equal(generated.editorialStatus, catalog.editorialStatus);
  assert.deepEqual(generated.educationalReview, catalog.educationalReview);
});

const DAY = 86_400_000;

// Reproduce el recorrido completo de un caso: responder, revelar y marcar toda la rúbrica.
function fullCheck(store: Store, entry: CaseEntry, value: number, at: number): Store {
  let next = applyAction(store, entry, { type: 'answer', text: 'Respuesta suficientemente larga para poder revelar la solución modelo del caso.' }, at);
  next = applyAction(next, entry, { type: 'reveal' }, at + 1);
  for (let index = 0; index < entry.rubricSize; index += 1) next = applyAction(next, entry, { type: 'selfCheck', criterion: index, value }, at + 2 + index);
  return next;
}

test('Mundo SOC: el repaso espaciado programa fechas y no infla el intervalo al repetir el veredicto', () => {
  const entry = catalog.cases[2];
  const base = Date.now() - 10 * DAY;
  let store = fullCheck(emptyStore(), entry, 2, base);
  const first = recordFor(store, entry).review;
  assert.equal(first.band, 'good');
  assert.equal(first.streak, 1);
  assert.equal(first.interval, INTERVALS[0]);
  assert.equal(first.due, base + 1 + entry.rubricSize + DAY, 'el primer dominio vuelve al día siguiente');

  store = applyAction(store, entry, { type: 'selfCheck', criterion: 0, value: 2 }, base + 3 + entry.rubricSize);
  assert.deepEqual(recordFor(store, entry).review, first, 'repetir la misma nota el mismo día no reprograma');

  const later = first.due + 60_000;
  store = applyAction(store, entry, { type: 'selfCheck', criterion: 0, value: 2 }, later);
  const second = recordFor(store, entry).review;
  assert.equal(second.streak, 2);
  assert.equal(second.interval, INTERVALS[1]);
  assert.equal(second.due, later + INTERVALS[1] * DAY);

  const weak = second.due + 60_000;
  for (let index = 0; index < entry.rubricSize; index += 1) store = applyAction(store, entry, { type: 'selfCheck', criterion: index, value: 0 }, weak);
  const third = recordFor(store, entry).review;
  assert.equal(third.band, 'weak');
  assert.equal(third.due, weak, 'un veredicto flojo devuelve el caso a hoy');
  assert.equal(third.streak, 0);
  assert.equal(third.lapses, 1);
  assert.equal(statusFor(entry, recordFor(store, entry)), 'repasar');

  const partial = weak + 60_000;
  for (let index = 0; index < entry.rubricSize; index += 1) store = applyAction(store, entry, { type: 'selfCheck', criterion: index, value: 1 }, partial);
  const fourth = recordFor(store, entry).review;
  assert.equal(fourth.band, 'partial');
  assert.equal(fourth.interval, 1);
  assert.equal(fourth.due, partial + DAY);
  assert.equal(fourth.lapses, 1, 'un veredicto parcial no cuenta como fallo');

  store = applyAction(store, entry, { type: 'reset' }, partial + 1);
  assert.deepEqual(recordFor(store, entry).review, emptySchedule(), 'reiniciar el caso lo saca de la cola');
});

test('Mundo SOC: la cola de repaso ordena vencidos y próximos, y la página de repaso es solo lectura', () => {
  const now = Date.now();
  const overdue = catalog.cases[3];
  const today = catalog.cases[4];
  const upcomingCase = catalog.cases[5];
  let store = emptyStore();
  store = fullCheck(store, overdue, 2, now - 5 * DAY);
  store = fullCheck(store, today, 1, now - 2 * DAY);
  store = fullCheck(store, upcomingCase, 2, now + DAY);

  const queue = dueItems(store, now);
  assert.deepEqual(queue.map(item => item.entry.id), [overdue.id, today.id], 'primero el más atrasado');
  assert.ok(queue[0].overdueDays >= 3);
  assert.ok(queue[1].overdueDays >= 0);

  const upcoming = upcomingItems(store, now);
  assert.deepEqual(upcoming.map(item => item.entry.id), [upcomingCase.id]);
  assert.equal(upcoming[0].days, 2);

  const overview = reviewOverview(store, now);
  assert.equal(overview.due.length, 2);
  assert.equal(overview.unscheduled, 37);
  assert.equal(overview.scheduled, 3);
  assert.equal(overview.nextDue?.entry.id, upcomingCase.id);

  const legacy = structuredClone(store) as Store & { records: Record<string, { review?: unknown; resetAt?: unknown }> };
  delete legacy.records[overdue.id].review;
  delete legacy.records[overdue.id].resetAt;
  const upgraded = validateStore(legacy);
  assert.ok(upgraded, 'un progreso anterior al modo repaso sigue siendo válido');
  assert.equal(recordFor(upgraded, overdue).review.due, null);
  assert.equal(upgraded.records[overdue.id].resetAt, 0);

  const broken = (patch: unknown) => validateStore({ ...store, records: { ...store.records, [overdue.id]: { ...store.records[overdue.id], review: patch } } });
  assert.equal(broken({ ...store.records[overdue.id].review, band: 'perfecto' }), null);
  assert.equal(broken({ ...store.records[overdue.id].review, interval: -1 }), null);
  assert.equal(broken({ ...store.records[overdue.id].review, due: 'mañana' }), null);

  const page = renderToStaticMarkup(createElement(Review));
  assert.ok(page.includes('Repaso de respuestas'));
  for (const entry of catalog.cases) assert.ok(page.includes(`<b>${entry.id}</b>`), `el repaso lista ${entry.id}`);
  for (const removed of ['Cola de hoy', 'Próximos repasos', 'Cómo se programa', 'Hoy no toca repaso']) assert.ok(!page.includes(removed), `sin fechas: ${removed}`);
  assert.ok(!page.includes('<textarea'), 'el repaso es solo lectura');
});
