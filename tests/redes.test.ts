import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateRedes } from '../scripts/prepare-redes.mjs';
import { catalog } from '../src/redes/data';
import { applyAction, available, emptyStore, loadStore, mergeStores, passed, recordFor, REDES_KEY, statsFor, validateStore, type Action } from '../src/redes/progress';
import type { Lesson, LessonContent, Solutions, Store } from '../src/redes/types';
import Markdown from '../src/redes/Markdown';
import RedesMap from '../src/redes/Map';

const read = (file: string) => readFile(new URL('../' + file, import.meta.url), 'utf8');
const contents: LessonContent[] = await Promise.all(catalog.lessons.map(l => read('public/' + l.file).then(JSON.parse)));
const solutions: Solutions[] = await Promise.all(catalog.lessons.map(l => read('public/' + l.answersFile).then(JSON.parse)));
let time = 100;
function send(store: Store, index: number, action: Action) { return applyAction(store, catalog.lessons[index], contents[index], action, ++time); }
function prepare(store: Store, index = 0) {
  for (const stepId of catalog.lessons[index].stepIds) store = send(store, index, { type: 'seen', stepId });
  store = send(store, index, { type: 'practice', text: 'Relaciono los datos y mantengo explícitos los límites de la conclusión.' });
  return send(store, index, { type: 'submitPractice' });
}
function evaluate(store: Store, index = 0, correct = true, attemptId = `attempt-${time}`) {
  store = send(store, index, { type: 'start', attemptId });
  for (const [position, q] of solutions[index].questions.entries()) {
    const optionId = correct || position === 0 ? q.correctOptionId : contents[index].questions.find(p => p.id === q.id)!.options.find(o => o.id !== q.correctOptionId)!.id;
    store = send(store, index, { type: 'choose', attemptId, questionId: q.id, optionId });
  }
  return send(store, index, { type: 'finish', attemptId, solutions: solutions[index] });
}
test('Redes: las 168 fuentes se reconstruyen y los derivados son reproducibles, con soluciones separadas', async () => {
  const generated = await generateRedes();
  assert.equal(generated.report.lessons, 168); assert.equal(generated.report.stages, 8);
  assert.equal(generated.report.resources, 23); assert.equal(generated.report.files, 360);
  assert.equal(generated.report.reconstructions.filter(r => r.verified).length, 168);
  for (const [file, text] of generated.outputs) assert.equal(await read(file), text, file);
  for (const [i, content] of contents.entries()) {
    assert.equal(content.questions.length, 2); assert.equal(content.study.length, 3);
    assert.ok(!/"(?:correctOptionId|referenceAnswer|rubric)":/.test(JSON.stringify(content)));
    assert.equal(content.practicalStatus, 'not_assessed'); assert.equal(content.revision, solutions[i].revision);
  }
});
test('Redes: estudio, respuesta y evaluación tienen requisitos; 1/2 no desbloquea, 2/2 sí y no repite XP', () => {
  let store = emptyStore(); const lesson = catalog.lessons[0];
  assert.equal(available(store, catalog.lessons[1]), false);
  assert.deepEqual(send(store, 0, { type: 'start', attemptId: 'early' }), store);
  assert.deepEqual(send(store, 0, { type: 'seen', stepId: 'future-step' }), store);
  assert.deepEqual(send(store, 0, { type: 'submitPractice' }), store);
  store = prepare(store); assert.equal(statsFor(store).xp, 5);
  store = evaluate(store, 0, false, 'failed'); assert.equal(recordFor(store, lesson).attempts.failed.score, 1); assert.equal(passed(recordFor(store, lesson), lesson), false);
  assert.equal(available(store, catalog.lessons[1]), false);
  const failed = structuredClone(recordFor(store, lesson).attempts.failed);
  store = evaluate(store, 0, true, 'passed'); assert.equal(statsFor(store).xp, 20);
  assert.equal(available(store, catalog.lessons[1]), true);
  store = evaluate(store, 0, true, 'retry'); assert.equal(statsFor(store).xp, 20);
  assert.equal(Object.keys(recordFor(store, lesson).attempts).length, 3);
  assert.deepEqual(recordFor(store, lesson).attempts.failed, failed);
  assert.equal(validateStore(store)?.courseId, 'redes');
});
test('Redes: completar las 168 lecciones respeta todas las dependencias y suma exactamente 3360 XP de teoría/estudio', () => {
  let store = emptyStore();
  for (const [index, lesson] of catalog.lessons.entries()) {
    assert.ok(available(store, lesson), lesson.id); store = evaluate(prepare(store, index), index);
  }
  assert.deepEqual(statsFor(store), { studied: 168, passed: 168, practiced: 168, xp: 3360, level: 14 });
  assert.ok(validateStore(store));
});
test('Redes: no admite soluciones de otra revisión, respuestas inválidas ni otra evaluación simultánea', () => {
  let store = prepare(emptyStore()); store = send(store, 0, { type: 'start', attemptId: 'exam' });
  assert.deepEqual(send(store, 0, { type: 'choose', attemptId: 'exam', questionId: catalog.lessons[0].questionIds[0], optionId: 'Z' }), store);
  assert.deepEqual(send(store, 0, { type: 'finish', attemptId: 'exam', solutions: solutions[0] }), store);
  assert.deepEqual(send(store, 0, { type: 'start', attemptId: 'second' }), store);
  assert.deepEqual(send(store, 0, { type: 'practice', text: 'Cambiar durante examen' }), store);
  for (const q of solutions[0].questions) store = send(store, 0, { type: 'choose', attemptId: 'exam', questionId: q.id, optionId: q.correctOptionId });
  assert.deepEqual(send(store, 0, { type: 'finish', attemptId: 'exam', solutions: { ...solutions[0], revision: 'a'.repeat(24) } }), store);
  assert.deepEqual(applyAction(store, catalog.lessons[0], { ...contents[0], revision: 'b'.repeat(24) }, { type: 'visit' }), store);
});
test('Redes: sincroniza progreso e intentos sin alterar un intento cerrado; conserva un almacén desconocido', () => {
  const first = evaluate(prepare(emptyStore()), 0, true, 'complete');
  const stale = prepare(emptyStore());
  assert.ok(passed(recordFor(mergeStores(first, stale), catalog.lessons[0]), catalog.lessons[0]));
  assert.deepEqual(mergeStores(first, first), first);
  const accesses: string[] = [];
  const loaded = loadStore({ getItem: key => { accesses.push(key); return JSON.stringify({ schemaVersion: 99, courseId: 'redes' }); } });
  assert.deepEqual(accesses, [REDES_KEY]); assert.equal(loaded.blocked, true);
  assert.equal(validateStore({ ...first, courseId: 'splunk' }), null);
  const changed: Lesson = { ...catalog.lessons[0], revision: 'f'.repeat(24) };
  assert.equal(recordFor(first, changed).seen.length, 0);
});
test('Redes: el Markdown conserva enlaces del mundo sin HTML activo, imágenes remotas o URLs ejecutables', () => {
  const html = renderToStaticMarkup(createElement(Markdown, { children: '<script>alert(1)</script>\n\n[x](javascript:alert(1))\n\n![foto](https://example.invalid/a.png)\n\n[previo](../RED-E01/RED-M01-L01.md)\n\n[glosario](../../05_RECURSOS/GLOSARIO.md)' }));
  assert.ok(!html.includes('<script')); assert.ok(!html.includes('href="javascript:')); assert.ok(!html.includes('<img'));
  assert.ok(html.includes('#/redes/leccion/RED-M01-L01')); assert.ok(html.includes('#/redes/recursos/glosario'));
});
test('Redes: atlas con ocho etapas y etapa más larga con 32 nodos, accesibles incluso para consultar bloqueos', () => {
  const atlas = renderToStaticMarkup(createElement(RedesMap, { store: emptyStore() }));
  const longest = renderToStaticMarkup(createElement(RedesMap, { store: emptyStore(), stage: catalog.stages[2] }));
  assert.equal((atlas.match(/data-station="RED-E/g) ?? []).length, 8);
  assert.equal((longest.match(/data-station="RED-M/g) ?? []).length, 32);
  assert.ok(longest.includes('aria-haspopup="dialog"')); assert.ok(longest.includes('Consultar requisitos'));
  assert.ok(!atlas.includes('Splunk')); assert.ok(!longest.includes('Hasta 30 XP'));
});
