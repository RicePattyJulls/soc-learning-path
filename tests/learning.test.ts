import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { applyLearning, attemptScore, currentRecord, emptyLearning, facade, learningStatus, LEARNING_KEY, mergeLearning, migrateLegacy, totalXP, validateLearning } from '../src/lib/learning';
import { LEGACY_KEY, loadLearning, saveLearning } from '../src/lib/learning-storage';
import type { Lesson, Chapter } from '../src/types';
import type { Education, LearningStore, Question } from '../src/education';
const catalog = JSON.parse(await readFile(new URL('../src/generated/catalog.json', import.meta.url), 'utf8'));
const lessons: Lesson[] = catalog.lessons, chapters: Chapter[] = catalog.modules;
const lesson = lessons.find(l => l.id.includes('/1-licencia-y-onboarding-'))!;
const edu: Education = JSON.parse(await readFile(new URL('../public/' + lesson.file, import.meta.url), 'utf8')).education;
const practice = edu.questions.filter(q => q.phase === 'practice'), exam = edu.questions.filter(q => q.phase === 'assessment');
const action = (store: LearningStore, event: Parameters<typeof applyLearning>[2]) => applyLearning(store, lesson, event, chapters, 100);
const studied = (store = emptyLearning()) => edu.steps.reduce((state, step, cursor) => action(state, { type: 'step', stepId: step.id, cursor }), store);
const practiced = () => practice.reduce((state, question) => action(state, { type: 'practice', question, answer: question.solution }), studied());
const summarized = () => action(practiced(), { type: 'summary' });
function wrong(q: Question) { return q.type === 'match' || q.type === 'order' ? [...q.solution].reverse() : [q.options.find(o => !q.solution.includes(o.id))!.id]; }
function pass(store = summarized(), id = 'exam-ok') {
  return exam.reduce((state, question) => action(state, { type: 'exam-answer', attemptId: id, question, answer: question.solution }), action(store, { type: 'exam-start', attemptId: id }));
}
class MemoryStorage {
  values = new Map<string, string>(); writes: string[] = [];
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); this.writes.push(key); }
}
test('abrir una lección no concede XP ni finalización; los pasos y respuestas tienen requisitos', () => {
  const opened = action(emptyLearning(), { type: 'visit' });
  assert.equal(totalXP(opened), 0);
  assert.equal(learningStatus(lesson, facade(opened, lessons)), 'in-progress');
  assert.equal(action(opened, { type: 'summary' }), opened);
  assert.equal(action(opened, { type: 'practice', question: practice[0], answer: practice[0].solution }), opened);
  assert.equal(action(opened, { type: 'step', stepId: 'falso', cursor: 0 }), opened);
  assert.equal(totalXP(studied()), 5);
});
test('completar y dominar son estados distintos y se requiere evaluación para la recompensa completa', () => {
  const done = summarized();
  assert.equal(learningStatus(lesson, facade(done, lessons)), 'completed');
  assert.equal(totalXP(done), 15);
  const mastered = pass(done);
  assert.equal(learningStatus(lesson, facade(mastered, lessons)), 'mastered');
  assert.equal(totalXP(mastered), 45);
  assert.equal(totalXP(action(mastered, { type: 'review', question: exam[0], answer: exam[0].solution })), 50);
});
test('la primera respuesta cuenta por intento; fallar explica un error y requiere otro intento para aprobar', () => {
  let state = action(summarized(), { type: 'exam-start', attemptId: 'fail' });
  state = action(state, { type: 'exam-answer', attemptId: 'fail', question: exam[0], answer: wrong(exam[0]) });
  const immutable = action(state, { type: 'exam-answer', attemptId: 'fail', question: exam[0], answer: exam[0].solution });
  assert.equal(immutable, state);
  for (const q of exam.slice(1)) state = action(state, { type: 'exam-answer', attemptId: 'fail', question: q, answer: q.solution });
  assert.equal(attemptScore(currentRecord(state, lesson), 'fail', exam.map(q => q.id)).passed, false);
  assert.equal(learningStatus(lesson, facade(state, lessons)), 'completed');
  assert.equal(totalXP(state), 15);
  const corrected = pass(state, 'retry');
  assert.equal(currentRecord(corrected, lesson).attempts.fail.answers[exam[0].id].correct, false);
  assert.ok(currentRecord(corrected, lesson).mistakes[exam[0].id].count > 0);
  assert.equal(learningStatus(lesson, facade(corrected, lessons)), 'mastered');
});
test('repetir pasos, actividades, evaluaciones y repasos no permite XP ilimitado', () => {
  let state = pass();
  for (let n = 0; n < 100; n++) {
    state = action(state, { type: 'step', stepId: edu.steps[0].id, cursor: 0 });
    state = action(state, { type: 'practice', question: practice[0], answer: practice[0].solution });
    state = action(state, { type: 'summary' });
    state = pass(state, 'repeat-' + n);
    state = action(state, { type: 'review', question: exam[0], answer: exam[0].solution });
  }
  assert.equal(totalXP(state), 50);
});
test('la migración de toda la V1 conserva 76 finalizaciones, 3200 XP y cero dominios inventados', () => {
  const legacy = { schemaVersion: 1, completed: Object.fromEntries(lessons.map(l => [l.id, l.version])), lastLesson: lesson.id };
  const original = JSON.stringify(legacy);
  const store = migrateLegacy(legacy, emptyLearning(), chapters);
  assert.equal(totalXP(store), 3200);
  assert.equal(Object.keys(facade(store, lessons).completed).length, 76);
  assert.equal(lessons.filter(l => learningStatus(l, facade(store, lessons)) === 'mastered').length, 0);
  assert.equal(JSON.stringify(legacy), original);
  assert.equal(store.lastLesson, lesson.id);
});
test('los XP históricos son un suelo y no se suman dos veces al practicar en V1.5', () => {
  let state = migrateLegacy({ schemaVersion: 1, completed: { [lesson.id]: lesson.version } }, emptyLearning(), chapters);
  assert.equal(totalXP(state), 25);
  state = studied(state); assert.equal(totalXP(state), 25);
  for (const q of practice) state = action(state, { type: 'practice', question: q, answer: q.solution });
  state = action(state, { type: 'summary' }); assert.equal(totalXP(state), 25);
  state = pass(state); assert.equal(totalXP(state), 45);
});
test('otra revisión conserva el historial y los XP; la nueva evaluación no hereda dominio sin probarse', () => {
  const store = pass();
  const changed = { ...lesson, learning: { ...lesson.learning!, revision: 'revision-nueva' } };
  assert.equal(learningStatus(changed, facade(store, [changed])), 'completed');
  assert.equal(totalXP(store), 45);
  assert.equal(Object.keys(store.records[lesson.id]).length, 1);
});
test('los bloqueos se respetan también desde la lógica de aprendizaje', () => {
  const blocked = lessons.find(l => l.moduleId === chapters[1].id)!;
  const store = emptyLearning();
  assert.equal(applyLearning(store, blocked, { type: 'visit' }, chapters), store);
});
test('fusionar dos pestañas conserva pasos, respuestas e intentos independientes sin duplicar XP', () => {
  const a = action(emptyLearning(), { type: 'step', stepId: edu.steps[0].id, cursor: 0 });
  const b = action(emptyLearning(), { type: 'step', stepId: edu.steps.at(-1)!.id, cursor: 0 });
  const merged = mergeLearning(a, b);
  assert.ok(currentRecord(merged, lesson).seen.includes(edu.steps[0].id));
  assert.ok(currentRecord(merged, lesson).seen.includes(edu.steps.at(-1)!.id));
  assert.equal(totalXP(mergeLearning(pass(), pass(undefined, 'other'))), 45);
});
test('guardar V1.5 nunca escribe ni borra la clave original; datos corruptos V2 no se sobrescriben', () => {
  const storage = new MemoryStorage();
  const legacy = JSON.stringify({ schemaVersion: 1, completed: { [lesson.id]: lesson.version, 'id-historico': 'version-historica' }, lastLesson: lesson.id });
  storage.values.set(LEGACY_KEY, legacy);
  const loaded = loadLearning(storage, chapters);
  saveLearning(storage, studied(loaded.store), chapters);
  assert.equal(storage.getItem(LEGACY_KEY), legacy);
  assert.ok(storage.writes.every(key => key === LEARNING_KEY));
  assert.equal(loadLearning(storage, chapters).store.legacy['id-historico'], 'version-historica');
  storage.values.set(LEARNING_KEY, '{corrupto');
  const count = storage.writes.length;
  assert.equal(saveLearning(storage, pass(), chapters).blocked, true);
  assert.equal(storage.getItem(LEARNING_KEY), '{corrupto');
  assert.equal(storage.writes.length, count);
  assert.equal(storage.getItem(LEGACY_KEY), legacy);
});
test('el formato versionado se valida y la serialización conserva intentos, errores y estado', () => {
  assert.equal(validateLearning({ schemaVersion: 3 }), null);
  assert.equal(validateLearning({ ...emptyLearning(), records: [] }), null);
  const state = pass();
  assert.deepEqual(validateLearning(JSON.parse(JSON.stringify(state))), state);
});
