import type { Chapter, Lesson, Progress, Status } from '../types';
import { learningStatus, totalXP } from './learning';

export const STORAGE_KEY = 'soc-learning-path:progress:v1';
export const XP_PER_LESSON = 25;
export const XP_PER_CHAPTER = 100;
export const XP_PER_LEVEL = 250;
export const emptyProgress = (): Progress => ({ schemaVersion: 1, completed: {}, lastLesson: null });

export function validateProgress(value: unknown, lessons: Lesson[]): Progress {
  const result = emptyProgress();
  if (!value || typeof value !== 'object') return result;
  const data = value as Partial<Progress>;
  if (data.schemaVersion !== 1 || !data.completed || typeof data.completed !== 'object' || Array.isArray(data.completed)) return result;
  for (const lesson of lessons) if (Object.hasOwn(data.completed, lesson.id) && data.completed[lesson.id] === lesson.version) result.completed[lesson.id] = lesson.version;
  result.lastLesson = lessons.some(l => l.id === data.lastLesson) ? data.lastLesson! : null;
  return result;
}

export const isComplete = (lesson: Lesson, progress: Progress) => progress.completed[lesson.id] === lesson.version;
export const chapterComplete = (chapter: Chapter, progress: Progress, byId: Map<string, Lesson>) =>
  chapter.lessonIds.length > 0 && chapter.lessonIds.every(id => isComplete(byId.get(id)!, progress));

export function chapterStatus(chapter: Chapter, chapters: Chapter[], progress: Progress, byId: Map<string, Lesson>): Status {
  const index = chapters.findIndex(c => c.id === chapter.id);
  // Prerequisites are cumulative; forged or stale future completions never unlock a gap.
  if (!chapters.slice(0, index).every(c => chapterComplete(c, progress, byId))) return 'locked';
  return chapterComplete(chapter, progress, byId) ? 'completed' : 'available';
}

export function lessonStatus(lesson: Lesson, chapters: Chapter[], progress: Progress, byId: Map<string, Lesson>): Status {
  if (lesson.moduleId) {
    const chapter = chapters.find(c => c.id === lesson.moduleId)!;
    if (chapterStatus(chapter, chapters, progress, byId) === 'locked') return 'locked';
  }
  return isComplete(lesson, progress) ? 'completed' : 'available';
}

export function completeLesson(id: string, progress: Progress, lessons: Lesson[], chapters: Chapter[]): Progress {
  const byId = new Map(lessons.map(l => [l.id, l]));
  const lesson = byId.get(id);
  if (!lesson || lessonStatus(lesson, chapters, progress, byId) === 'locked') return progress;
  return { ...progress, completed: { ...progress.completed, [id]: lesson.version }, lastLesson: id };
}

export function statistics(progress: Progress, lessons: Lesson[], chapters: Chapter[]) {
  const byId = new Map(lessons.map(l => [l.id, l]));
  const completed = lessons.filter(l => isComplete(l, progress)).length;
  const modulesDone = chapters.filter(c => chapterStatus(c, chapters, progress, byId) === 'completed').length;
  const xp = progress.learning ? totalXP(progress.learning) : completed * XP_PER_LESSON + modulesDone * XP_PER_CHAPTER;
  return { completed, modulesDone, xp, level: Math.floor(xp / XP_PER_LEVEL) + 1,
    levelXp: xp % XP_PER_LEVEL, percent: Math.round(completed / lessons.length * 100),
    mastered: lessons.filter(l => learningStatus(l, progress) === 'mastered').length,
    inProgress: lessons.filter(l => learningStatus(l, progress) === 'in-progress').length };
}
