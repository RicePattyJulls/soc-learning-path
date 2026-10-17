import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapterStatus, completeLesson, emptyProgress, lessonStatus, statistics, validateProgress } from '../src/lib/progress';
import type { Chapter, Lesson } from '../src/types';

const lesson = (id: string, moduleId: string | null): Lesson => ({ id, moduleId, title: id, version: 'version-' + id, line: 1, endLine: 5, syntheticTitle: false, file: id + '.json', sections: [] });
const lessons = [lesson('apertura', null), lesson('a', 'c1'), lesson('b', 'c1'), lesson('c', 'c2'), lesson('d', 'c3')];
const chapters: Chapter[] = [
  { id: 'c1', title: 'Primero', line: 1, lessonIds: ['a', 'b'] },
  { id: 'c2', title: 'Segundo', line: 8, lessonIds: ['c'] },
  { id: 'c3', title: 'Tercero', line: 12, lessonIds: ['d'] },
];
const byId = new Map(lessons.map(l => [l.id, l]));

test('la ruta parte de cero, permite apertura y primer capítulo, bloquea los posteriores', () => {
  const state = emptyProgress();
  assert.equal(statistics(state, lessons, chapters).xp, 0);
  assert.equal(statistics(state, lessons, chapters).level, 1);
  assert.equal(lessonStatus(lessons[0], chapters, state, byId), 'available');
  assert.equal(chapterStatus(chapters[0], chapters, state, byId), 'available');
  assert.equal(chapterStatus(chapters[1], chapters, state, byId), 'locked');
  assert.equal(completeLesson('c', state, lessons, chapters), state);
});

test('completar desbloquea el siguiente capítulo; XP y bonus se cuentan una sola vez', () => {
  let state = completeLesson('a', emptyProgress(), lessons, chapters);
  assert.equal(statistics(state, lessons, chapters).xp, 25);
  assert.equal(chapterStatus(chapters[1], chapters, state, byId), 'locked');
  state = completeLesson('b', state, lessons, chapters);
  assert.equal(chapterStatus(chapters[0], chapters, state, byId), 'completed');
  assert.equal(chapterStatus(chapters[1], chapters, state, byId), 'available');
  assert.equal(statistics(state, lessons, chapters).xp, 150);
  state = completeLesson('b', state, lessons, chapters);
  assert.equal(statistics(state, lessons, chapters).xp, 150);
  state = completeLesson('c', state, lessons, chapters);
  assert.equal(statistics(state, lessons, chapters).xp, 275);
  assert.equal(statistics(state, lessons, chapters).level, 2);
});

test('un hueco previo bloquea todos los capítulos posteriores, aunque existan avances futuros', () => {
  const state = { ...emptyProgress(), completed: { c: 'version-c' } };
  assert.equal(chapterStatus(chapters[2], chapters, state, byId), 'locked');
});

test('JSON incorrecto, IDs desconocidos y versiones obsoletas no inventan progreso', () => {
  assert.deepEqual(validateProgress(null, lessons), emptyProgress());
  assert.deepEqual(validateProgress({ schemaVersion: 2, completed: {} }, lessons), emptyProgress());
  assert.deepEqual(validateProgress({ schemaVersion: 1, completed: [] }, lessons), emptyProgress());
  const state = validateProgress({ schemaVersion: 1, completed: { a: 'old', b: 'version-b', evil: 'x' }, lastLesson: 'missing' }, lessons);
  assert.deepEqual(state.completed, { b: 'version-b' });
  assert.equal(state.lastLesson, null);
});

test('serializar y restaurar conserva avance y puntuación sin guardar el documento', () => {
  const state = completeLesson('a', emptyProgress(), lessons, chapters);
  const restored = validateProgress(JSON.parse(JSON.stringify(state)), lessons);
  assert.deepEqual(restored, state);
  assert.equal(statistics(restored, lessons, chapters).xp, 25);
  assert.ok(!JSON.stringify(state).includes('markdown'));
  assert.equal(completeLesson('desconocida', state, lessons, chapters), state);
});
