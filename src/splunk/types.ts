export interface SplunkLesson {
  id: string; title: string; regionId: string; objective: string; prerequisites: string[];
  revision: string; sourceVersion: string; payloadHash: string; file: string; humanReview: string;
  stepIds: string[]; questionIds: string[]; formativeIds: string[];
}
export interface SplunkCatalog {
  schemaVersion: number; courseId: string; pilot: boolean; curriculumHash: string;
  editorialRevision: string; humanReview: string; rewardMode: string; resourcesHash: string;
  regions: SplunkRegion[]; lessons: SplunkLesson[];
}
export interface SplunkRegion {
  id: string; title: string; lessonIds: string[]; theme: string; description: string;
  resourceFile: string; resourcesHash: string;
}
export interface SplunkResources {
  courseId: 'splunk'; regionId: string; lab: string; note: string; datasets: unknown;
  fixture?: { file: string; sha256: string; text: string; synthetic: true };
  fixtures?: { file:string; sha256:string; text:string; synthetic:true; rowCount:number }[];
  documents?: { file:string; markdown:string }[];
}
export interface SourceAnchor { file: string; sourceHash: string; line: number; endLine: number; quote: string }
export interface SplunkQuestion {
  id: string; lessonId: string; prompt: string; type: 'choice'; autoGradable: true;
  options: { id: string; text: string }[]; solution: string; explanation: string;
  humanReview: string; sourceRefs: string[]; anchors: SourceAnchor[];
}
export interface FormativeActivity {
  id: string; lessonId: string; prompt: string; type: 'formative'; autoGradable: false;
  rubric: string[]; referenceAnswer: string; humanReview: string; sourceRefs: string[];
}
export interface SplunkSection { id: string; title: string; markdown: string; line: number; endLine: number }
export interface SplunkPayload {
  schemaVersion: 1; courseId: 'splunk'; id: string; title: string; revision: string;
  sourceVersion: string; sanitizedHash: string; sourceFile: string; editorialRevision: string;
  humanReview: string; splunkExecuted: false; practicalStatus: 'not_assessed'; objective: string;
  preamble: string; sections: SplunkSection[]; questions: SplunkQuestion[]; formative: FormativeActivity[];
  solutionsMarkdown: string; referencesMarkdown: string; originalMarkdown: string;
  reconstruction: { verified: boolean; sections: number; redactions: { kind: string; line: number }[] };
  references: { id: string; key: string; url: string }[];
}
export interface SplunkAttempt {
  id: string; startedAt: number; questionIds: string[];
  answers: Record<string, { optionId: string; correct: boolean; answeredAt: number }>;
  finishedAt: number | null;
}
export interface SplunkRecord {
  seen: string[]; studyCompleted: boolean; summary: boolean; theoryPassed: boolean;
  formativeSeen: boolean; reviewed: boolean; practicalStatus: 'not_assessed'; updated: number;
  attempts: Record<string, SplunkAttempt>; activeAttempt: string | null;
}
export type SplunkReward = 'study' | 'summary' | 'theory' | 'review';
export interface SplunkStore {
  schemaVersion: 1; courseId: 'splunk'; rewardMode: 'provisional_only';
  records: Record<string, Record<string, SplunkRecord>>;
  provisionalAwards: Record<string, SplunkReward[]>; regionAwards: string[];
  lastLesson: { id: string; updated: number } | null;
}
