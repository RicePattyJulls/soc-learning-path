export interface SourceReference { lessonId: string; sourceVersion: string; line: number; endLine: number; quote: string }
export interface StudyStep {
  id: string; title: string; kind: string; markdown?: string; teaching?: string;
  cards?: { title: string; fields: { label: string; markdown: string }[] }[];
  source: SourceReference; context: string;
}
export interface Question {
  id: string; phase: 'practice' | 'assessment'; type: 'choice' | 'true-false' | 'multi' | 'match' | 'order';
  prompt: string; options: { id: string; text: string; why?: string }[]; rows?: { id: string; label: string }[];
  solution: string[]; explanation: string; references: SourceReference[]; didactic?: boolean;
  objective?: string; difficulty?: 'basica' | 'intermedia' | 'avanzada';
}
export interface Education {
  schemaVersion: 1; lessonId: string; sourceVersion: string; revision: string; coverage: string; pilot: boolean;
  introduction: string; goals: string[]; steps: StudyStep[]; questions: Question[]; summary: string[]; reviewRequired: boolean;
}
export type Award = 'study' | 'practice' | 'summary' | 'assessment' | 'mastery' | 'review';
export interface Response { answer: string[]; correct: boolean; at: number }
export interface Attempt { id: string; answers: Record<string, Response>; finished: boolean; at: number }
export interface LessonRecord {
  started: boolean; seen: string[]; cursor: number; updated: number; summary: boolean; completed: boolean; mastered: boolean;
  practice: Record<string, Response>; solved: string[]; attempts: Record<string, Attempt>; activeAttempt: string | null;
  mistakes: Record<string, { count: number; lastWrong: number; lastCorrect: number }>;
}
export interface LearningStore {
  schemaVersion: 2; legacy: Record<string, string>; lastLesson: string | null;
  records: Record<string, Record<string, LessonRecord>>; awards: Record<string, Award[]>; chapterAwards: string[];
}
export type LearningStatus = 'not-started' | 'in-progress' | 'completed' | 'mastered';
