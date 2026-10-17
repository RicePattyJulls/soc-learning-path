import raw from '../generated/catalog.json';
import type { Chapter, Lesson } from '../types';

export const catalog = { ...raw, report: { ...raw.report, unresolved: raw.report.unresolved as { line: number; kind: string; reason: string }[] } };
export const chapters: Chapter[] = raw.modules;
export const lessons: Lesson[] = raw.lessons;
export const lessonMap = new Map(lessons.map(lesson => [lesson.id, lesson]));
export const chapterMap = new Map(chapters.map(chapter => [chapter.id, chapter]));
export const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const lessonUrl = (id: string, section?: string) => `#/leccion/${encodeURIComponent(id)}${section ? `?seccion=${encodeURIComponent(section)}` : ''}`;
export const chapterUrl = (id: string) => `#/capitulo/${encodeURIComponent(id)}`;
