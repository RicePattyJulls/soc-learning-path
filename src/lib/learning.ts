import type { Award, Education, LearningStatus, LearningStore, LessonRecord, Question, Response } from '../education';
import type { Chapter, Lesson, Progress } from '../types';

export const LEARNING_KEY = 'soc-learning-path:learning:v2';
export const REWARDS: Record<Award, number> = { study: 5, practice: 5, summary: 5, assessment: 15, mastery: 15, review: 5 };
export const PASS_PERCENT = 80;
const unique = <T,>(values: T[]) => [...new Set(values)];
export const emptyRecord = (): LessonRecord => ({ started: false, seen: [], solved: [], cursor: 0, updated: 0, summary: false, completed: false, mastered: false, practice: {}, attempts: {}, activeAttempt: null, mistakes: {} });
export const emptyLearning = (): LearningStore => ({ schemaVersion: 2, legacy: {}, lastLesson: null, records: {}, awards: {}, chapterAwards: [] });
// Only the generator can declare this V2.4 predecessor, after checking identical
// Markdown/step IDs and no former questions. Read without deleting old history.
export const currentRecord = (store: LearningStore, lesson: Lesson) => store.records[lesson.id]?.[lesson.learning?.revision || lesson.version]
  || (lesson.learning?.previousRevision ? store.records[lesson.id]?.[lesson.learning.previousRevision] : undefined) || emptyRecord();

export function completedIds(store: LearningStore): Set<string> {
  return new Set([...Object.keys(store.legacy), ...Object.entries(store.records).filter(([, versions]) => Object.values(versions).some(r => r.completed)).map(([id]) => id)]);
}
export function facade(store: LearningStore, lessons: Lesson[]): Progress {
  const done = completedIds(store);
  return { schemaVersion: 1, completed: Object.fromEntries(lessons.filter(l => done.has(l.id)).map(l => [l.id, l.version])), lastLesson: store.lastLesson, learning: store };
}
export function learningStatus(lesson: Lesson, progress: Progress): LearningStatus {
  if (!progress.learning) return progress.completed[lesson.id] ? 'completed' : 'not-started';
  const record = currentRecord(progress.learning, lesson);
  return record.mastered ? 'mastered' : completedIds(progress.learning).has(lesson.id) ? 'completed' : record.started || record.seen.length ? 'in-progress' : 'not-started';
}
export const learningStatusText = { 'not-started': 'No iniciada', 'in-progress': 'En curso', completed: 'Completada', mastered: 'Dominada' };
export function totalXP(store: LearningStore) {
  const ids = unique([...Object.keys(store.legacy), ...Object.keys(store.awards)]);
  const lessonXp = ids.reduce((sum, id) => sum + Math.max(store.legacy[id] ? 25 : 0, unique(store.awards[id] || []).reduce((n, award) => n + REWARDS[award], 0)), 0);
  return lessonXp + unique(store.chapterAwards).length * 100;
}
export function migrateLegacy(value: unknown, store: LearningStore, chapters: Chapter[]): LearningStore {
  if (!value || typeof value !== 'object') return store;
  const data = value as Partial<Progress>;
  if (data.schemaVersion !== 1 || !data.completed || typeof data.completed !== 'object' || Array.isArray(data.completed)) return store;
  const legacy = Object.fromEntries(Object.entries(data.completed).filter(([, version]) => typeof version === 'string'));
  const result = { ...store, legacy: { ...store.legacy, ...legacy }, lastLesson: store.lastLesson || (typeof data.lastLesson === 'string' ? data.lastLesson : null) };
  return grantChapters(result, chapters);
}
function grantChapters(store: LearningStore, chapters: Chapter[]) {
  const done = completedIds(store);
  return { ...store, chapterAwards: unique([...store.chapterAwards, ...chapters.filter(c => c.lessonIds.every(id => done.has(id))).map(c => c.id)]) };
}
export function grade(question: Question, answer: string[]) {
  if (answer.length !== question.solution.length || answer.some(id => !question.options.some(o => o.id === id))) return false;
  return question.type === 'multi' ? unique(answer).length === answer.length && question.solution.every(id => answer.includes(id)) : question.solution.every((id, i) => answer[i] === id);
}
export function attemptScore(record: LessonRecord, attemptId: string, assessmentIds: string[]) {
  const attempt = record.attempts[attemptId];
  const answered = assessmentIds.filter(id => attempt?.answers[id]).length;
  const right = assessmentIds.filter(id => attempt?.answers[id]?.correct).length;
  const percent = assessmentIds.length ? Math.round(right / assessmentIds.length * 100) : 0;
  return { answered, right, total: assessmentIds.length, percent, passed: assessmentIds.length > 0 && answered === assessmentIds.length && percent >= PASS_PERCENT };
}
export type LearningAction = { type: 'visit' } | { type: 'step'; stepId: string; cursor: number } | { type: 'summary' } |
  { type: 'practice' | 'review'; question: Question; answer: string[] } | { type: 'exam-start'; attemptId: string } |
  { type: 'exam-answer'; attemptId: string; question: Question; answer: string[] };

export function applyLearning(store: LearningStore, lesson: Lesson, action: LearningAction, chapters: Chapter[], now = Date.now()): LearningStore {
  const meta = lesson.learning;
  if (!meta) return store;
  const chapterIndex = chapters.findIndex(c => c.id === lesson.moduleId), done = completedIds(store);
  if (chapterIndex >= 0 && !chapters.slice(0, chapterIndex).every(c => c.lessonIds.every(id => done.has(id)))) return store;
  const old = currentRecord(store, lesson), record: LessonRecord = structuredClone(old);
  const at = Math.max(now, old.updated + 1);
  record.started = true; record.updated = at;
  const studyDone = () => !!store.legacy[lesson.id] || meta.stepIds.every(id => record.seen.includes(id));
  if (action.type === 'step') {
    const index = meta.stepIds.indexOf(action.stepId);
    if (index < 0) return store;
    record.seen = unique([...record.seen, action.stepId]); record.cursor = Math.min(Math.max(0, action.cursor), meta.stepIds.length - 1);
  }
  if (action.type === 'summary') {
    if (!studyDone() || meta.practiceIds.some(id => !record.practice[id])) return store;
    record.summary = true; record.completed = true;
  }
  if (action.type === 'exam-start') {
    if (!record.summary || !meta.assessmentIds.length || !action.attemptId) return store;
    if (record.attempts[action.attemptId]) return store;
    record.attempts[action.attemptId] = { id: action.attemptId, answers: {}, finished: false, at }; record.activeAttempt = action.attemptId;
  }
  if ('question' in action) {
    const { question, answer } = action;
    const expected = action.type === 'exam-answer' ? meta.assessmentIds : action.type === 'review' ? [...meta.practiceIds, ...meta.assessmentIds] : meta.practiceIds;
    if (!studyDone() || !expected.includes(question.id) || !question.references.length || question.references.some(r => r.lessonId !== lesson.id || r.sourceVersion !== lesson.version)) return store;
    if (!answer.length || answer.some(id => !question.options.some(o => o.id === id))) return store;
    const response: Response = { answer: [...answer], correct: grade(question, answer), at };
    if (action.type === 'exam-answer') {
      const attempt = record.attempts[action.attemptId];
      if (!attempt || attempt.finished || attempt.answers[question.id]) return store;
      attempt.answers[question.id] = response;
      attempt.finished = meta.assessmentIds.every(id => attempt.answers[id]);
    } else if (action.type === 'practice' || action.type === 'review' && meta.practiceIds.includes(question.id)) {
      record.practice[question.id] = response;
      if (response.correct) record.solved = unique([...record.solved, question.id]);
    }
    const mistake = record.mistakes[question.id] || { count: 0, lastWrong: 0, lastCorrect: 0 };
    record.mistakes[question.id] = response.correct ? { ...mistake, lastCorrect: at } : { ...mistake, count: mistake.count + 1, lastWrong: at };
  }
  const earned = new Set(store.awards[lesson.id] || []);
  if (meta.stepIds.every(id => record.seen.includes(id))) earned.add('study');
  if (meta.practiceIds.length && meta.practiceIds.every(id => record.solved.includes(id))) earned.add('practice');
  if (record.summary) earned.add('summary');
  const passed = Object.keys(record.attempts).some(id => attemptScore(record, id, meta.assessmentIds).passed);
  if (passed) earned.add('assessment');
  if (passed && record.summary && studyDone() && meta.practiceIds.every(id => record.solved.includes(id))) { record.mastered = true; earned.add('mastery'); }
  if (action.type === 'review' && record.completed && grade(action.question, action.answer)) earned.add('review');
  const result: LearningStore = { ...store, lastLesson: lesson.id,
    records: { ...store.records, [lesson.id]: { ...store.records[lesson.id], [meta.revision]: record } },
    awards: { ...store.awards, [lesson.id]: [...earned] } };
  return grantChapters(result, chapters);
}

export function validateLearning(value: unknown): LearningStore | null {
  const object = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v);
  if (!value || typeof value !== 'object') return null;
  const s = value as LearningStore;
  if (s.schemaVersion !== 2 || !object(s.records) || !object(s.legacy) || !object(s.awards) || !Array.isArray(s.chapterAwards) || s.chapterAwards.some(id => typeof id !== 'string') || s.lastLesson !== null && typeof s.lastLesson !== 'string') return null;
  if (Object.values(s.legacy).some(v => typeof v !== 'string')) return null;
  if (Object.values(s.awards).some(list => !Array.isArray(list) || list.some(a => !Object.hasOwn(REWARDS, a)))) return null;
  for (const versions of Object.values(s.records)) {
    if (!versions || typeof versions !== 'object' || Array.isArray(versions)) return null;
    for (const r of Object.values(versions)) {
      if (!r || !Array.isArray(r.seen) || !Array.isArray(r.solved) || [...r.seen, ...r.solved].some(id => typeof id !== 'string') || !object(r.practice) || !object(r.attempts) || !object(r.mistakes) || !Number.isFinite(r.updated) || !Number.isInteger(r.cursor) || typeof r.started !== 'boolean' || typeof r.completed !== 'boolean' || typeof r.mastered !== 'boolean' || typeof r.summary !== 'boolean' || r.activeAttempt !== null && typeof r.activeAttempt !== 'string') return null;
      if (Object.values(r.attempts).some(a => !a || !object(a.answers) || typeof a.finished !== 'boolean' || typeof a.id !== 'string' || !Number.isFinite(a.at))) return null;
      if (Object.values(r.mistakes).some(m => !m || !Number.isFinite(m.count) || !Number.isFinite(m.lastWrong) || !Number.isFinite(m.lastCorrect))) return null;
      for (const response of [...Object.values(r.practice), ...Object.values(r.attempts).flatMap(a => Object.values(a.answers || {}))]) {
        if (!Array.isArray(response.answer) || response.answer.some(v => typeof v !== 'string') || typeof response.correct !== 'boolean' || !Number.isFinite(response.at)) return null;
      }
    }
  }
  return s;
}

// Monotonic merge prevents one tab from erasing achievements saved in another.
export function mergeLearning(a: LearningStore, b: LearningStore): LearningStore {
  const records = structuredClone(a.records);
  for (const [id, versions] of Object.entries(b.records)) for (const [revision, incoming] of Object.entries(versions)) {
    const existing = records[id]?.[revision];
    records[id] ||= {};
    if (!existing) { records[id][revision] = structuredClone(incoming); continue; }
    const latest = incoming.updated >= existing.updated ? incoming : existing;
    const practice = { ...existing.practice };
    for (const [qid, response] of Object.entries(incoming.practice)) if (!practice[qid] || response.at >= practice[qid].at) practice[qid] = response;
    const attempts = structuredClone(existing.attempts);
    for (const [aid, attempt] of Object.entries(incoming.attempts)) {
      if (!attempts[aid]) { attempts[aid] = structuredClone(attempt); continue; }
      for (const [qid, response] of Object.entries(attempt.answers)) if (!attempts[aid].answers[qid] || response.at < attempts[aid].answers[qid].at) attempts[aid].answers[qid] = response;
      attempts[aid].finished ||= attempt.finished;
    }
    const mistakes = { ...existing.mistakes };
    for (const [qid, item] of Object.entries(incoming.mistakes)) { const old = mistakes[qid]; mistakes[qid] = old ? { count: Math.max(old.count, item.count), lastWrong: Math.max(old.lastWrong, item.lastWrong), lastCorrect: Math.max(old.lastCorrect, item.lastCorrect) } : item; }
    records[id][revision] = { ...latest, seen: unique([...existing.seen, ...incoming.seen]), solved: unique([...existing.solved, ...incoming.solved]), summary: existing.summary || incoming.summary,
      completed: existing.completed || incoming.completed, mastered: existing.mastered || incoming.mastered, practice, attempts, mistakes };
  }
  return { schemaVersion: 2, legacy: { ...a.legacy, ...b.legacy }, lastLesson: b.lastLesson || a.lastLesson, records,
    awards: Object.fromEntries(unique([...Object.keys(a.awards), ...Object.keys(b.awards)]).map(id => [id, unique([...(a.awards[id] || []), ...(b.awards[id] || [])])])),
    chapterAwards: unique([...a.chapterAwards, ...b.chapterAwards]) };
}
