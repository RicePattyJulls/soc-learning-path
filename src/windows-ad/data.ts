import raw from './generated/catalog.json';
import type { Catalog, Lesson, LessonContent, Resource, ResourceContent, Solutions } from './types';

export const catalog = raw as Catalog;
export const lessonById = new Map(catalog.lessons.map(lesson => [lesson.id, lesson]));
export const stageById = new Map(catalog.stages.map(stage => [stage.id, stage]));
export const resourceById = new Map(catalog.resources.map(resource => [resource.id, resource]));
export const lessonUrl = (id: string, phase = 'mision', step = 0) => `#/windows-ad/leccion/${encodeURIComponent(id)}?fase=${encodeURIComponent(phase)}&paso=${step}`;
export const stageUrl = (id: string, node?: string) => `#/windows-ad/etapa/${encodeURIComponent(id)}${node ? `?nodo=${encodeURIComponent(node)}` : ''}`;
export const resourceUrl = (id = '') => `#/windows-ad/recursos${id ? `/${encodeURIComponent(id)}` : ''}`;
async function verifiedJSON<T>(file: string, expected: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}${file}`, { signal });
  if (!response.ok) throw new Error('No se pudo cargar el archivo');
  const text = await response.text();
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  const actual = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  if (actual !== expected) throw new Error('El archivo no coincide con la versión de esta lección');
  return JSON.parse(text) as T;
}
export async function fetchLesson(lesson: Lesson, signal?: AbortSignal) {
  const data = await verifiedJSON<LessonContent>(lesson.file, lesson.hash, signal);
  if (data.courseId !== 'windows-ad' || data.schemaVersion !== 1 || data.id !== lesson.id || data.revision !== lesson.revision || data.sourceHash !== lesson.sourceHash || data.practicalStatus !== 'not_assessed'
    || JSON.stringify(data.study.map(s => s.id)) !== JSON.stringify(lesson.stepIds)
    || JSON.stringify(data.questions.map(q => q.id)) !== JSON.stringify(lesson.questionIds)) throw new Error('Contrato de lección incorrecto');
  return data;
}
export async function fetchSolutions(lesson: Lesson, signal?: AbortSignal) {
  const data = await verifiedJSON<Solutions>(lesson.answersFile, lesson.answersHash, signal);
  if (data.courseId !== 'windows-ad' || data.id !== lesson.id || data.revision !== lesson.revision || data.sourceHash !== lesson.sourceHash
    || JSON.stringify(data.questions.map(q => q.id)) !== JSON.stringify(lesson.questionIds)) throw new Error('Solucionario de otra versión');
  return data;
}
export async function fetchResource(resource: Resource, signal?: AbortSignal) {
  const data = await verifiedJSON<ResourceContent>(resource.file, resource.hash, signal);
  if (data.courseId !== 'windows-ad' || data.id !== resource.id) throw new Error('Recurso de otro mundo');
  return data;
}
