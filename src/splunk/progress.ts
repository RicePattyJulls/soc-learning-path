import type { SplunkAttempt, SplunkCatalog, SplunkLesson, SplunkPayload, SplunkRecord, SplunkReward, SplunkStore } from './types';

export const SPLUNK_KEY = 'soc-learning-path:splunk:learning:v1';
export const SPLUNK_XP: Readonly<Record<SplunkReward, number>> = { study: 5, summary: 5, theory: 15, review: 5 };
export const emptySplunk = (): SplunkStore => ({ schemaVersion: 1, courseId: 'splunk', rewardMode: 'provisional_only', records: {}, provisionalAwards: {}, regionAwards: [], lastLesson: null });
export const blankRecord = (): SplunkRecord => ({ seen: [], studyCompleted: false, summary: false, theoryPassed: false, formativeSeen: false, reviewed: false, practicalStatus: 'not_assessed', updated: 0, attempts: {}, activeAttempt: null });
export const recordFor = (store: SplunkStore, lesson: SplunkLesson): SplunkRecord => store.records[lesson.id]?.[lesson.revision] || blankRecord();
export const theoryPass = (correct: number, total: number) => Number.isInteger(total) && total > 0 && Number.isInteger(correct) && correct >= Math.ceil(total * .8) && correct <= total;
export const resultFor = (attempt: SplunkAttempt) => {
  const total = attempt.questionIds.length;
  const correct = attempt.questionIds.filter(id => attempt.answers[id]?.correct === true).length;
  const complete = total > 0 && attempt.questionIds.every(id => !!attempt.answers[id]);
  return { total, correct, complete, passed: attempt.finishedAt !== null && complete && theoryPass(correct, total) };
};
export const isAvailable = (store: SplunkStore, lesson: SplunkLesson, catalog: SplunkCatalog) => lesson.prerequisites.every(id => {
  const prerequisite = catalog.lessons.find(l => l.id === id);
  return !!prerequisite && recordFor(store, prerequisite).studyCompleted && recordFor(store, prerequisite).theoryPassed;
});
export function splunkStats(store: SplunkStore, catalog: SplunkCatalog) {
  const provisionalXP = Object.values(store.provisionalAwards).reduce((n, rewards) => n + [...new Set(rewards)].reduce((sum, reward) => sum + SPLUNK_XP[reward], 0), 0) + new Set(store.regionAwards).size * 100;
  return { provisionalXP, definitiveXP: 0, level: Math.floor(provisionalXP / 250) + 1, levelXP: provisionalXP % 250, studied: catalog.lessons.filter(l => recordFor(store, l).studyCompleted).length, passed: catalog.lessons.filter(l => recordFor(store, l).theoryPassed).length, practicalStatus: 'not_assessed' as const };
}
export type SplunkAction = { type: 'visit' } | { type: 'seen'; stepId: string } | { type: 'summary' } | { type: 'formative' } | { type: 'review' } | { type: 'start'; attemptId: string } | { type: 'answer'; questionId: string; optionId: string } | { type: 'finish' };
export function applySplunk(store: SplunkStore, catalog: SplunkCatalog, lesson: SplunkLesson, payload: SplunkPayload, action: SplunkAction, now = Date.now()): SplunkStore {
  if (!catalog.lessons.some(item => item.id === lesson.id && item.revision === lesson.revision) || payload.id !== lesson.id || payload.courseId !== 'splunk' || payload.revision !== lesson.revision || !isAvailable(store, lesson, catalog)) return store;
  const next: SplunkStore = structuredClone(store), record = structuredClone(recordFor(store, lesson));
  let accepted = false;
  const award = (reward: SplunkReward) => { next.provisionalAwards[lesson.id] = [...new Set([...(next.provisionalAwards[lesson.id] || []), reward])]; };
  const active = record.activeAttempt ? record.attempts[record.activeAttempt] : undefined;
  if (action.type === 'visit') {
    next.lastLesson = { id: lesson.id, updated: now }; accepted = true;
  } else if (action.type === 'seen' && lesson.stepIds.includes(action.stepId) && !active) {
    record.seen = [...new Set([...record.seen, action.stepId])];
    record.studyCompleted = lesson.stepIds.length > 0 && lesson.stepIds.every(id => record.seen.includes(id));
    if (record.studyCompleted) award('study'); accepted = true;
  } else if (action.type === 'summary' && record.studyCompleted && !active) {
    record.summary = true; award('summary'); accepted = true;
  } else if (action.type === 'formative' && !active) {
    record.formativeSeen = true; accepted = true;
  } else if (action.type === 'review' && record.theoryPassed && !active) {
    record.reviewed = true; award('review'); accepted = true;
  } else if (action.type === 'start' && record.studyCompleted && record.summary && !active && !catalog.lessons.some(item => !!recordFor(store,item).activeAttempt) && payload.questions.length > 0 && /^[\w-]{1,100}$/.test(action.attemptId) && !record.attempts[action.attemptId]) {
    record.attempts[action.attemptId] = { id: action.attemptId, startedAt: now, questionIds: payload.questions.map(q => q.id), answers: {}, finishedAt: null };
    record.activeAttempt = action.attemptId; accepted = true;
  } else if (action.type === 'answer' && active && active.finishedAt === null && !active.answers[action.questionId]) {
    const question = payload.questions.find(q => q.id === action.questionId);
    if (question?.options.some(o => o.id === action.optionId)) {
      active.answers[action.questionId] = { optionId: action.optionId, correct: question.solution === action.optionId, answeredAt: now }; accepted = true;
    }
  } else if (action.type === 'finish' && active && active.finishedAt === null && resultFor(active).complete) {
    active.finishedAt = now; record.activeAttempt = null;
    record.theoryPassed ||= resultFor(active).passed;
    if (record.theoryPassed) award('theory'); accepted = true;
  }
  if (!accepted) return store;
  record.updated = now;
  next.records[lesson.id] = { ...next.records[lesson.id], [lesson.revision]: record };
  for (const region of catalog.regions) if (region.lessonIds.length > 0 && region.lessonIds.every(id => {
    const item = catalog.lessons.find(l => l.id === id);
    return !!item && recordFor(next, item).studyCompleted && recordFor(next, item).theoryPassed;
  })) next.regionAwards = [...new Set([...next.regionAwards, region.id])];
  return next;
}

function mergeAttempt(a: SplunkAttempt, b: SplunkAttempt): SplunkAttempt {
  // A finished attempt is immutable. For simultaneous answers the earliest
  // timestamp wins, with deterministic ID tie-break; never substitute a retry.
  if (a.finishedAt !== null || b.finishedAt !== null) return structuredClone([a, b].filter(x => x.finishedAt !== null).sort((x,y) => x.finishedAt! - y.finishedAt! || JSON.stringify(x).localeCompare(JSON.stringify(y)))[0]);
  const answers = { ...a.answers };
  for (const [id, answer] of Object.entries(b.answers)) if (!answers[id] || answer.answeredAt < answers[id].answeredAt || (answer.answeredAt === answers[id].answeredAt && answer.optionId < answers[id].optionId)) answers[id] = answer;
  return { ...a, answers };
}
export function mergeSplunk(a: SplunkStore, b: SplunkStore): SplunkStore {
  const merged = structuredClone(a);
  for (const [id, revisions] of Object.entries(b.records)) {
    merged.records[id] ||= {};
    for (const [revision, incoming] of Object.entries(revisions)) {
      const old = merged.records[id][revision];
      if (!old) { merged.records[id][revision] = structuredClone(incoming); continue; }
      const attempts = { ...old.attempts };
      for (const [attemptId, attempt] of Object.entries(incoming.attempts)) attempts[attemptId] = attempts[attemptId] ? mergeAttempt(attempts[attemptId], attempt) : structuredClone(attempt);
      const latest = incoming.updated > old.updated ? incoming : old;
      const activeId = latest.activeAttempt;
      merged.records[id][revision] = { seen: [...new Set([...old.seen, ...incoming.seen])].sort(), studyCompleted: old.studyCompleted || incoming.studyCompleted, summary: old.summary || incoming.summary, theoryPassed: Object.values(attempts).some(attempt => resultFor(attempt).passed), formativeSeen: old.formativeSeen || incoming.formativeSeen, reviewed: old.reviewed || incoming.reviewed, practicalStatus: 'not_assessed', updated: Math.max(old.updated, incoming.updated), attempts, activeAttempt: activeId && attempts[activeId]?.finishedAt === null ? activeId : null };
    }
  }
  for (const [id, rewards] of Object.entries(b.provisionalAwards)) merged.provisionalAwards[id] = [...new Set([...(merged.provisionalAwards[id] || []), ...rewards])].sort();
  merged.regionAwards = [...new Set([...a.regionAwards, ...b.regionAwards])].sort();
  if (b.lastLesson && (!a.lastLesson || b.lastLesson.updated > a.lastLesson.updated)) merged.lastLesson = b.lastLesson;
  return merged;
}

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(v => typeof v === 'string');
export function validateSplunk(value: unknown, catalog: SplunkCatalog): SplunkStore | null {
  if (!object(value) || value.schemaVersion !== 1 || value.courseId !== 'splunk' || value.rewardMode !== 'provisional_only' || !object(value.records) || !object(value.provisionalAwards) || !strings(value.regionAwards)) return null;
  const known = new Set(catalog.lessons.map(l => l.id));
  if (!value.regionAwards.every(id => catalog.regions.some(r => r.id === id))) return null;
  if (value.lastLesson !== null && (!object(value.lastLesson) || !known.has(String(value.lastLesson.id)) || !finite(value.lastLesson.updated))) return null;
  for (const [id, rewards] of Object.entries(value.provisionalAwards)) if (!known.has(id) || !strings(rewards) || !rewards.every(r => Object.hasOwn(SPLUNK_XP, r))) return null;
  for (const [id, revisions] of Object.entries(value.records)) {
    if (!known.has(id) || !object(revisions)) return null; // preserve unknown/future data without overwriting it
    for (const [revision, record] of Object.entries(revisions)) {
      if (!/^[a-f0-9]{24}$/.test(revision) || !object(record) || !strings(record.seen) || !record.seen.every(step => step.startsWith(id + '-S')) || !finite(record.updated) || !object(record.attempts) || record.practicalStatus !== 'not_assessed' || !['studyCompleted','summary','theoryPassed','formativeSeen','reviewed'].every(key => typeof record[key] === 'boolean')) return null;
      for (const [attemptId, attempt] of Object.entries(record.attempts)) {
        if (!object(attempt) || attempt.id !== attemptId || !finite(attempt.startedAt) || !(attempt.finishedAt === null || finite(attempt.finishedAt)) || !strings(attempt.questionIds) || !attempt.questionIds.length || new Set(attempt.questionIds).size !== attempt.questionIds.length || !attempt.questionIds.every(q => q.startsWith(id + '-Q')) || !object(attempt.answers)) return null;
        for (const [qid, answer] of Object.entries(attempt.answers)) if (!attempt.questionIds.includes(qid) || !object(answer) || typeof answer.optionId !== 'string' || !answer.optionId.startsWith(qid + '-O-') || typeof answer.correct !== 'boolean' || !finite(answer.answeredAt)) return null;
        if (attempt.finishedAt !== null && !attempt.questionIds.every(q => Object.hasOwn(attempt.answers as object, q))) return null;
      }
      if (record.activeAttempt !== null) {
        if (typeof record.activeAttempt !== 'string') return null;
        const active = record.attempts[record.activeAttempt];
        if (!object(active) || active.finishedAt !== null) return null;
      }
      if (record.theoryPassed && !Object.values(record.attempts).some(a => resultFor(a as unknown as SplunkAttempt).passed)) return null;
    }
  }
  return structuredClone(value) as unknown as SplunkStore;
}
export function loadSplunk(storage: Pick<Storage, 'getItem'>, catalog: SplunkCatalog) {
  try {
    const raw = storage.getItem(SPLUNK_KEY);
    if (raw === null) return { store: emptySplunk(), warning: '', blocked: false };
    const store = validateSplunk(JSON.parse(raw), catalog);
    if (!store) throw new Error('invalid');
    return { store, warning: '', blocked: false };
  } catch { return { store: emptySplunk(), warning: 'No se puede interpretar el progreso Splunk. Se conserva el original sin sobrescribir; puedes estudiar en memoria y exportar esta sesión.', blocked: true }; }
}
export function saveSplunk(storage: Pick<Storage, 'getItem' | 'setItem'>, store: SplunkStore, catalog: SplunkCatalog) {
  const persisted = loadSplunk(storage, catalog);
  if (persisted.blocked) return { ...persisted, store: mergeSplunk(persisted.store, store) };
  const merged = mergeSplunk(persisted.store, store);
  const serialized = JSON.stringify(merged);
  if (storage.getItem(SPLUNK_KEY) !== serialized) storage.setItem(SPLUNK_KEY, serialized);
  return { store: merged, warning: '', blocked: false };
}
