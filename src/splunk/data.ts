import raw from '../generated/splunk/catalog.json';
import type { SplunkCatalog, SplunkLesson, SplunkPayload } from './types';

export const catalog: SplunkCatalog = raw;
export const lessonUrl = (id: string, phase = 'estudio') => `#/splunk/leccion/${encodeURIComponent(id)}?fase=${encodeURIComponent(phase)}`;
export const regionUrl = (id = 'SP-R01', node?: string) => `#/splunk/region/${encodeURIComponent(id)}${node ? `?nodo=${encodeURIComponent(node)}` : ''}`;
export async function digest(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
export async function decodePayload(text: string, lesson: SplunkLesson): Promise<SplunkPayload> {
  if (await digest(text) !== lesson.payloadHash) throw new Error('Hash de contenido incorrecto');
  const data: SplunkPayload = JSON.parse(text);
  if (data.courseId !== 'splunk' || data.schemaVersion !== 1 || data.id !== lesson.id || data.revision !== lesson.revision || data.sourceVersion !== lesson.sourceVersion || data.splunkExecuted !== false || data.practicalStatus !== 'not_assessed' || data.humanReview !== 'pending_independent_review' || !data.reconstruction?.verified || !Array.isArray(data.questions) || !Array.isArray(data.formative) || !Array.isArray(data.sections) || JSON.stringify(data.sections.map(s => s.id)) !== JSON.stringify(lesson.stepIds) || JSON.stringify(data.questions.map(q => q.id)) !== JSON.stringify(lesson.questionIds) || JSON.stringify(data.formative.map(q => q.id)) !== JSON.stringify(lesson.formativeIds)) throw new Error('Contrato de contenido incorrecto');
  return data;
}
