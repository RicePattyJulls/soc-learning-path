export interface Stage { id: string; title: string; lessonIds: string[] }
export interface Lesson {
  id: string; title: string; objective: string; moduleId: string; stageId: string;
  prerequisites: string[]; revision: string; sourceHash: string; file: string; hash: string;
  answersFile: string; answersHash: string; stepIds: string[]; questionIds: string[]; labIds: string[];
}
export interface Resource { id: string; title: string; kind: string; file: string; hash: string }
export interface Catalog { courseId: 'linux'; schemaVersion: number; revision: string; stages: Stage[]; lessons: Lesson[]; resources: Resource[] }
export interface Question { id: string; prompt: string; options: { id: string; text: string }[] }
export interface LessonContent {
  schemaVersion: 1; courseId: 'linux'; id: string; title: string; revision: string; sourceHash: string;
  practicalStatus: 'not_assessed'; study: { id: string; title: string; markdown: string }[];
  practice: { id: string; prompt: string; markdown: string }; questions: Question[]; referencesMarkdown: string;
}
export interface Solutions {
  courseId: 'linux'; id: string; revision: string; sourceHash: string;
  questions: { id: string; correctOptionId: string; explanation: string }[];
  practice: { referenceAnswer: string; rubric: { criterion: string; evidence: string }[] };
}
export interface ResourceContent { courseId: 'linux'; id: string; title: string; markdown: string; synthetic: boolean }
export interface Attempt {
  id: string; started: number; updated: number; finished: number | null;
  answers: Record<string, string>; score: number | null;
}
export interface LessonRecord {
  seen: string[]; practice: string; practiceUpdated: number; practiceSubmitted: boolean;
  attempts: Record<string, Attempt>; active: string | null; updated: number;
}
export interface Store {
  schemaVersion: 1; courseId: 'linux'; records: Record<string, Record<string, LessonRecord>>;
  lastLesson: { id: string; updated: number } | null;
}
