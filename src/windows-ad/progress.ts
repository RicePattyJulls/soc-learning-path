import { catalog, lessonById } from './data';
import type { Attempt, Lesson, LessonContent, LessonRecord, Solutions, Store } from './types';

export const WINDOWS_AD_KEY = 'soc-learning-path:windows-ad:learning:v1';
export const emptyStore = (): Store => ({ schemaVersion: 1, courseId: 'windows-ad', records: {}, lastLesson: null });
export const emptyRecord = (): LessonRecord => ({ seen: [], practice: '', practiceUpdated: 0, practiceSubmitted: false, attempts: {}, active: null, updated: 0 });
export const recordFor = (store: Store, lesson: Lesson) => store.records[lesson.id]?.[lesson.revision] ?? emptyRecord();
export const studied = (record: LessonRecord, lesson: Lesson) => lesson.stepIds.every(id => record.seen.includes(id));
export const passed = (record: LessonRecord, lesson: Lesson) => Object.values(record.attempts).some(a => a.finished !== null && a.score !== null && a.score >= Math.ceil(lesson.questionIds.length * .8));
export const available = (store: Store, lesson: Lesson) => lesson.prerequisites.every(id => {
  const previous = lessonById.get(id);
  return !!previous && studied(recordFor(store, previous), previous) && passed(recordFor(store, previous), previous);
});
export const activeLesson = (store: Store) => catalog.lessons.find(l => recordFor(store, l).active);
export function statsFor(store: Store) {
  const counts = catalog.lessons.reduce((r, lesson) => {
    const record = recordFor(store, lesson);
    r.studied += Number(studied(record, lesson)); r.passed += Number(passed(record, lesson));
    r.practiced += Number(record.practiceSubmitted); return r;
  }, { studied: 0, passed: 0, practiced: 0 });
  const xp = counts.studied * 5 + counts.passed * 15;
  return { ...counts, xp, level: Math.floor(xp / 250) + 1 };
}
export type Action = { type: 'visit' } | { type: 'seen'; stepId: string }
  | { type: 'practice'; text: string } | { type: 'submitPractice' }
  | { type: 'start'; attemptId: string } | { type: 'choose'; attemptId: string; questionId: string; optionId: string }
  | { type: 'finish'; attemptId: string; solutions: Solutions };
export function applyAction(store: Store, lesson: Lesson, content: LessonContent, action: Action, now = Date.now()): Store {
  if (lessonById.get(lesson.id)?.revision !== lesson.revision || content.id !== lesson.id || content.courseId !== 'windows-ad' || content.revision !== lesson.revision || !available(store, lesson)) return store;
  const next = structuredClone(store), record = structuredClone(recordFor(store, lesson));
  const active = record.active ? record.attempts[record.active] : undefined;
  if (action.type === 'visit') next.lastLesson = { id: lesson.id, updated: now };
  else if (action.type === 'seen' && !active && lesson.stepIds.includes(action.stepId)) record.seen = [...new Set([...record.seen, action.stepId])];
  else if (action.type === 'practice' && !active && action.text.length <= 12000) { record.practice = action.text; record.practiceUpdated = now; record.practiceSubmitted = false; }
  else if (action.type === 'submitPractice' && !active && record.practice.trim().length > 0 && studied(record, lesson)) { record.practiceSubmitted = true; record.practiceUpdated = now; }
  else if (action.type === 'start' && !activeLesson(store) && studied(record, lesson) && record.practiceSubmitted && /^[\w-]{1,100}$/.test(action.attemptId) && !record.attempts[action.attemptId]) {
    record.attempts[action.attemptId] = { id: action.attemptId, started: now, updated: now, finished: null, answers: {}, score: null }; record.active = action.attemptId;
  } else if (action.type === 'choose' && active?.id === action.attemptId && content.questions.some(q => q.id === action.questionId && q.options.some(o => o.id === action.optionId))) {
    active.answers[action.questionId] = action.optionId; active.updated = now;
  } else if (action.type === 'finish' && active?.id === action.attemptId && lesson.questionIds.every(id => active.answers[id])
    && action.solutions.courseId === 'windows-ad' && action.solutions.id === lesson.id && action.solutions.revision === lesson.revision
    && action.solutions.sourceHash === lesson.sourceHash && action.solutions.questions.length === lesson.questionIds.length
    && lesson.questionIds.every(id => action.solutions.questions.some(q => q.id === id && content.questions.find(p => p.id === id)?.options.some(o => o.id === q.correctOptionId)))) {
    active.score = action.solutions.questions.filter(q => active.answers[q.id] === q.correctOptionId).length;
    active.finished = now; active.updated = now; record.active = null;
  } else return store;
  record.updated = now; next.records[lesson.id] = { ...next.records[lesson.id], [lesson.revision]: record };
  return next;
}
function mergeAttempt(a: Attempt, b: Attempt): Attempt {
  if (a.finished !== null || b.finished !== null) return structuredClone([a, b].filter(v => v.finished !== null).sort((x, y) => x.finished! - y.finished! || JSON.stringify(x).localeCompare(JSON.stringify(y)))[0]);
  return structuredClone(a.updated > b.updated || a.updated === b.updated && JSON.stringify(a) < JSON.stringify(b) ? a : b);
}
export function mergeStores(a: Store, b: Store): Store {
  const next = structuredClone(a);
  for (const [id, revisions] of Object.entries(b.records)) {
    next.records[id] ||= {};
    for (const [revision, incoming] of Object.entries(revisions)) {
      const old = next.records[id][revision];
      if (!old) { next.records[id][revision] = structuredClone(incoming); continue; }
      const recent = old.updated > incoming.updated ? old : incoming;
      const practice = old.practiceUpdated > incoming.practiceUpdated ? old : incoming;
      const attempts = { ...old.attempts };
      for (const [aid, attempt] of Object.entries(incoming.attempts)) attempts[aid] = attempts[aid] ? mergeAttempt(attempts[aid], attempt) : structuredClone(attempt);
      next.records[id][revision] = { ...recent, seen: [...new Set([...old.seen, ...incoming.seen])].sort(),
        practice: practice.practice, practiceUpdated: practice.practiceUpdated, practiceSubmitted: practice.practiceSubmitted,
        attempts, active: recent.active && attempts[recent.active]?.finished === null ? recent.active : null };
    }
  }
  if (b.lastLesson && (!a.lastLesson || b.lastLesson.updated > a.lastLesson.updated)) next.lastLesson = b.lastLesson;
  return next;
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const time = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
export function validateStore(value: unknown): Store | null {
  if (!object(value) || value.schemaVersion !== 1 || value.courseId !== 'windows-ad' || !object(value.records)) return null;
  if (value.lastLesson !== null && (!object(value.lastLesson) || !lessonById.has(String(value.lastLesson.id)) || !time(value.lastLesson.updated))) return null;
  for (const [id, revisions] of Object.entries(value.records)) {
    const lesson = lessonById.get(id);
    if (!lesson || !object(revisions)) return null;
    for (const [revision, record] of Object.entries(revisions)) {
      if (!/^[a-f0-9]{24}$/.test(revision) || !object(record) || !Array.isArray(record.seen) || new Set(record.seen).size !== record.seen.length || !record.seen.every(s => typeof s === 'string' && new RegExp(`^${id}-S0[1-3]$`).test(s))
        || typeof record.practice !== 'string' || record.practice.length > 12000 || typeof record.practiceSubmitted !== 'boolean' || !time(record.practiceUpdated) || !time(record.updated) || !object(record.attempts)) return null;
      if (record.practiceSubmitted && !record.practice.trim()) return null;
      for (const [aid, attempt] of Object.entries(record.attempts)) {
        if (!/^[\w-]{1,100}$/.test(aid) || !object(attempt) || attempt.id !== aid || !time(attempt.started) || !time(attempt.updated) || !(attempt.finished === null || time(attempt.finished)) || !object(attempt.answers)) return null;
        for (const [qid, option] of Object.entries(attempt.answers)) if (!lesson.questionIds.includes(qid) || typeof option !== 'string' || !/^[A-D]$/.test(option)) return null;
        if (attempt.finished === null ? attempt.score !== null : !Number.isInteger(attempt.score) || Number(attempt.score) < 0 || Number(attempt.score) > lesson.questionIds.length || !lesson.questionIds.every(q => Object.hasOwn(attempt.answers as object, q))) return null;
      }
      if (record.active !== null) {
        if (typeof record.active !== 'string') return null;
        const current = record.attempts[record.active];
        if (!object(current) || current.finished !== null) return null;
      }
    }
  }
  return structuredClone(value) as unknown as Store;
}
export function loadStore(storage: Pick<Storage, 'getItem'>) {
  try {
    const raw = storage.getItem(WINDOWS_AD_KEY);
    if (raw === null) return { store: emptyStore(), blocked: false, warning: '' };
    const store = validateStore(JSON.parse(raw));
    if (!store) throw new Error('unknown');
    return { store, blocked: false, warning: '' };
  } catch { return { store: emptyStore(), blocked: true, warning: 'No se pudo leer el progreso de Windows + AD. El original se conserva; puedes continuar en memoria y exportar esta sesión.' }; }
}
