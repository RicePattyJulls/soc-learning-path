import type { Schedule } from './schedule';

export interface Level { id: string; title: string; subtitle: string }
export interface Block { id: string; nivel: string; title: string; caseIds: string[] }
export interface CaseEntry {
  id: string; nivel: string; bloque: string; blockId: string; titulo: string;
  revision: string; sourceHash: string;
  file: string; hash: string; answersFile: string; answersHash: string;
  rubricSize: number; stepCount: number; queryCount: number;
}
export interface Source { url: string; global: boolean; caseIds: string[] }
export interface EducationalReview {
  kind: string; independent: boolean; status: string;
  reviewedAt?: string; result?: string; record?: string;
}
export interface Catalog {
  courseId: 'soc'; schemaVersion: number; revision: string; title: string; description: string;
  editorialStatus: string; levels: Level[]; blocks: Block[]; cases: CaseEntry[]; sources: Source[];
  practicalStatus: string; commandsExecuted: boolean; educationalReview: EducationalReview;
}
export interface CaseContent {
  schemaVersion: 1; courseId: 'soc'; id: string; sourceHash: string; revision: string;
  nivel: string; bloque: string; blockId: string;
  titulo: string; pregunta: string; escenario: string; objetivo: string;
}
export interface Query { nombre: string; entorno: string; consulta: string; interpretacion: string; limitaciones: string }
export interface Answers {
  schemaVersion: 1; courseId: 'soc'; id: string; sourceHash: string; revision: string;
  hipotesis: string[];
  pasos: { fase: string; accion: string }[];
  evidencias: { dato: string; lectura: string }[];
  kql: Query[];
  spl: Query[];
  comandos: { entorno: string; proposito: string; comando: string }[];
  contencion: string;
  escalation: string[];
  falsos_positivos: string[];
  errores: string[];
  perspectiva_red_team: string;
  respuesta_entrevista: string;
  criterios_evaluacion: string[];
  mitre: string[];
  fuentes: string[];
}
export interface CaseRecord {
  id: string; revision: string;
  answer: string; answerUpdated: number;
  revealed: boolean; revealedAt: number | null;
  selfCheck: Record<string, number>; selfCheckUpdated: number;
  review: Schedule;
  resetAt: number;
  visits: number; updated: number;
}
export interface Store {
  schemaVersion: 1; courseId: 'soc';
  records: Record<string, CaseRecord>;
  lastCase: string | null;
}
export type CaseStatus = 'pendiente' | 'en-curso' | 'repasar' | 'casi' | 'dominado';
