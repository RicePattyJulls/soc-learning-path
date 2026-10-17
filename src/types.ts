export interface Section { title: string; depth: number; line: number; anchor: string }
export interface Lesson {
  id: string; moduleId: string | null; title: string; syntheticTitle: boolean;
  line: number; endLine: number; version: string; file: string; sections: Section[];
  learning?: { revision: string; previousRevision?: string; coverage: string; stepIds: string[]; practiceIds: string[]; assessmentIds: string[] };
}
export interface Chapter { id: string; title: string; line: number; lessonIds: string[] }
export type Status = 'completed' | 'available' | 'locked';
export interface Progress { schemaVersion: 1; completed: Record<string, string>; lastLesson: string | null; learning?: import('./education').LearningStore }
