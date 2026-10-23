import raw from './generated/catalog.json';
import type { Answers, Block, CaseContent, CaseEntry, Catalog, Level, Source } from './types';

export const catalog = raw as Catalog;
export const caseById = new Map(catalog.cases.map(item => [item.id, item]));
export const blockById = new Map(catalog.blocks.map(block => [block.id, block]));
export const levelById = new Map(catalog.levels.map(level => [level.id, level]));
export const ordered = {
  levels: catalog.levels as Level[],
  blocks: catalog.blocks as Block[],
  sources: catalog.sources as Source[],
};
export const boardUrl = (estado = '') => `#/soc/ruta${estado ? `?estado=${encodeURIComponent(estado)}` : ''}`;
export const caseUrl = (id: string) => `#/soc/caso/${encodeURIComponent(id)}`;
export const sourcesUrl = (id = '') => `#/soc/fuentes${id ? `/${encodeURIComponent(id)}` : ''}`;
export const progressUrl = () => '#/soc/progreso';
export const reviewUrl = () => '#/soc/repaso';
export const siblingsOf = (entry: CaseEntry) => {
  const block = blockById.get(entry.blockId);
  return block ? block.caseIds.map(id => caseById.get(id)!).filter(Boolean) : [entry];
};
export const neighboursOf = (entry: CaseEntry) => {
  const index = catalog.cases.findIndex(item => item.id === entry.id);
  return {
    previous: index > 0 ? catalog.cases[index - 1] : undefined,
    next: index >= 0 && index < catalog.cases.length - 1 ? catalog.cases[index + 1] : undefined,
  };
};
export const mitreUrl = (technique: string) => {
  const [base, sub] = technique.split('.');
  return `https://attack.mitre.org/techniques/${base}/${sub ? `${sub}/` : ''}`;
};

async function verifiedJSON<T>(file: string, expected: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}${file}`, { signal });
  if (!response.ok) throw new Error('No se pudo cargar el archivo');
  const text = await response.text();
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  const actual = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  if (actual !== expected) throw new Error('El archivo no coincide con la versión de este caso');
  return JSON.parse(text) as T;
}

export async function fetchCase(entry: CaseEntry, signal?: AbortSignal) {
  const data = await verifiedJSON<CaseContent>(entry.file, entry.hash, signal);
  if (data.courseId !== 'soc' || data.schemaVersion !== 1 || data.id !== entry.id || data.revision !== entry.revision
    || data.sourceHash !== entry.sourceHash || data.blockId !== entry.blockId) {
    throw new Error('Contrato de caso incorrecto');
  }
  return data;
}

export async function fetchAnswers(entry: CaseEntry, signal?: AbortSignal) {
  const data = await verifiedJSON<Answers>(entry.answersFile, entry.answersHash, signal);
  if (data.courseId !== 'soc' || data.schemaVersion !== 1 || data.id !== entry.id || data.revision !== entry.revision
    || data.sourceHash !== entry.sourceHash || data.criterios_evaluacion.length !== entry.rubricSize
    || data.pasos.length !== entry.stepCount || data.kql.length + data.spl.length !== entry.queryCount) {
    throw new Error('Solución de otra versión');
  }
  return data;
}
