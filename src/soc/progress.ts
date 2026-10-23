import { caseById, catalog } from './data';
import { emptySchedule, scheduleFrom } from './schedule';
import type { CaseEntry, CaseRecord, CaseStatus, Store } from './types';

export type { CaseStatus };

export const SOC_KEY = 'soc-learning-path:soc:learning:v1';
export const MAX_ANSWER = 12000;
export const MIN_ANSWER = 20;

export const emptyStore = (): Store => ({ schemaVersion: 1, courseId: 'soc', records: {}, lastCase: null });
export const emptyRecord = (entry: CaseEntry): CaseRecord => ({
  id: entry.id, revision: entry.revision, answer: '', answerUpdated: 0,
  revealed: false, revealedAt: null, selfCheck: {}, selfCheckUpdated: 0,
  review: emptySchedule(), resetAt: 0, visits: 0, updated: 0,
});
export const recordFor = (store: Store, entry: CaseEntry): CaseRecord => {
  const record = store.records[entry.id];
  return record && record.revision === entry.revision ? record : emptyRecord(entry);
};
export const scoreFor = (record: CaseRecord, entry: CaseEntry) => {
  const values = Object.values(record.selfCheck);
  if (!values.length || !entry.rubricSize) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  const ratio = total / (entry.rubricSize * 2);
  return { total, max: entry.rubricSize * 2, ratio, checked: values.length };
};
export const statusFor = (entry: CaseEntry, record: CaseRecord): CaseStatus => {
  if (!record.answer.trim()) return 'pendiente';
  if (!record.revealed) return 'en-curso';
  const score = scoreFor(record, entry);
  if (!score || !score.checked) return 'en-curso';
  if (score.ratio >= 0.75) return 'dominado';
  if (score.ratio >= 0.5) return 'casi';
  return 'repasar';
};
export const STATUS_LABEL: Record<CaseStatus, string> = {
  pendiente: 'Pendiente', 'en-curso': 'En curso', repasar: 'Repasar', casi: 'Casi dominado', dominado: 'Dominado',
};

export type Action =
  | { type: 'visit' }
  | { type: 'answer'; text: string }
  | { type: 'reveal' }
  | { type: 'selfCheck'; criterion: number; value: number }
  | { type: 'reset' };

// Programar el repaso solo cuando la autoevaluación está completa: así la cola
// refleja un veredicto entero y no una marca suelta.
function scheduleReview(record: CaseRecord, entry: CaseEntry, now: number) {
  const values = Object.values(record.selfCheck);
  if (!entry.rubricSize || values.length !== entry.rubricSize) return;
  const ratio = values.reduce((sum, value) => sum + value, 0) / (entry.rubricSize * 2);
  record.review = scheduleFrom(record.review, ratio, now);
}

export function applyAction(store: Store, entry: CaseEntry, action: Action, now = Date.now()): Store {
  const known = caseById.get(entry.id);
  if (!known || known.revision !== entry.revision) return store;
  const record = structuredClone(recordFor(store, entry));
  if (action.type === 'visit') {
    record.visits += 1;
  } else if (action.type === 'answer') {
    if (record.revealed || action.text.length > MAX_ANSWER) return store;
    record.answer = action.text;
    record.answerUpdated = now;
  } else if (action.type === 'reveal') {
    if (record.revealed || record.answer.trim().length < MIN_ANSWER) return store;
    record.revealed = true;
    record.revealedAt = now;
  } else if (action.type === 'selfCheck') {
    if (!record.revealed) return store;
    if (!Number.isInteger(action.criterion) || action.criterion < 0 || action.criterion >= entry.rubricSize) return store;
    if (![0, 1, 2].includes(action.value)) return store;
    record.selfCheck[String(action.criterion)] = action.value;
    record.selfCheckUpdated = now;
    scheduleReview(record, entry, now);
  } else if (action.type === 'reset') {
    record.answer = '';
    record.answerUpdated = now;
    record.revealed = false;
    record.revealedAt = null;
    record.selfCheck = {};
    record.selfCheckUpdated = now;
    record.review = emptySchedule();
    record.resetAt = now;
  } else return store;
  record.updated = now;
  const next = structuredClone(store);
  next.records[entry.id] = record;
  next.lastCase = entry.id;
  return next;
}

export function statsFor(store: Store) {
  const counts: Record<CaseStatus, number> = { pendiente: 0, 'en-curso': 0, repasar: 0, casi: 0, dominado: 0 };
  let answered = 0, revealed = 0, checks = 0;
  for (const entry of catalog.cases) {
    const record = recordFor(store, entry);
    counts[statusFor(entry, record)] += 1;
    if (record.answer.trim()) answered += 1;
    if (record.revealed) revealed += 1;
    checks += Object.keys(record.selfCheck).length;
  }
  return { counts, answered, revealed, checks, total: catalog.cases.length, closed: counts.dominado + counts.casi + counts.repasar };
}

// Un reinicio es un corte duro: cualquier dato escrito en o antes de `resetAt`
// no puede volver al fusionar con la copia guardada en disco o con otra pestaña.
function mergeRecord(a: CaseRecord, b: CaseRecord): CaseRecord {
  const resetAt = Math.max(a.resetAt, b.resetAt);
  const after = (stamp: number) => stamp > resetAt;
  const answerSource = a.answerUpdated >= b.answerUpdated ? a : b;
  const revealSource = (a.revealedAt ?? 0) >= (b.revealedAt ?? 0) ? a : b;
  const revealed = revealSource.revealed && after(revealSource.revealedAt ?? 0);
  const locked = revealed ? revealSource : answerSource;
  const checkSource = a.selfCheckUpdated >= b.selfCheckUpdated ? a : b;
  const reviewSource = a.review.updated >= b.review.updated ? a : b;
  return {
    id: a.id, revision: a.revision,
    answer: after(locked.answerUpdated) ? locked.answer : '',
    answerUpdated: Math.max(a.answerUpdated, b.answerUpdated),
    revealed,
    revealedAt: revealed ? revealSource.revealedAt : null,
    selfCheck: after(checkSource.selfCheckUpdated) ? { ...a.selfCheck, ...checkSource.selfCheck } : {},
    selfCheckUpdated: Math.max(a.selfCheckUpdated, b.selfCheckUpdated),
    review: after(reviewSource.review.updated) ? { ...reviewSource.review } : emptySchedule(),
    resetAt,
    visits: Math.max(a.visits, b.visits),
    updated: Math.max(a.updated, b.updated),
  };
}

export function mergeStores(a: Store, b: Store): Store {
  const next = structuredClone(a);
  for (const [id, incoming] of Object.entries(b.records)) {
    const entry = caseById.get(id);
    if (!entry || incoming.revision !== entry.revision) continue;
    const current = next.records[id];
    next.records[id] = current && current.revision === incoming.revision ? mergeRecord(current, incoming) : structuredClone(incoming);
  }
  if (b.lastCase && caseById.has(b.lastCase)) next.lastCase = b.lastCase;
  return next;
}

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const time = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const BANDS = ['good', 'partial', 'weak'];

// Un registro anterior al modo Repaso no trae `review`: se acepta y se normaliza
// al valor por defecto, para no invalidar progreso ya guardado.
function validReview(value: unknown): boolean {
  if (!object(value)) return false;
  if (!(value.due === null || time(value.due))) return false;
  if (!Number.isInteger(value.interval) || Number(value.interval) < 0 || Number(value.interval) > 400) return false;
  if (!Number.isInteger(value.streak) || Number(value.streak) < 0 || Number(value.streak) > 999) return false;
  if (!Number.isInteger(value.lapses) || Number(value.lapses) < 0) return false;
  if (!(value.band === null || (typeof value.band === 'string' && BANDS.includes(value.band)))) return false;
  return time(value.updated);
}

export function validateStore(value: unknown): Store | null {
  if (!object(value) || value.schemaVersion !== 1 || value.courseId !== 'soc' || !object(value.records)) return null;
  if (value.lastCase !== null && typeof value.lastCase !== 'string') return null;
  if (typeof value.lastCase === 'string' && !caseById.has(value.lastCase)) return null;
  for (const [id, record] of Object.entries(value.records)) {
    const entry = caseById.get(id);
    if (!entry || !object(record) || record.id !== id || record.revision !== entry.revision) return null;
    if (typeof record.answer !== 'string' || record.answer.length > MAX_ANSWER) return null;
    if (!time(record.answerUpdated) || !time(record.updated) || !time(record.selfCheckUpdated)) return null;
    if (typeof record.revealed !== 'boolean' || !(record.revealedAt === null || time(record.revealedAt))) return null;
    if (!Number.isInteger(record.visits) || Number(record.visits) < 0) return null;
    if (!object(record.selfCheck)) return null;
    for (const [key, score] of Object.entries(record.selfCheck)) {
      if (!/^\d+$/.test(key) || Number(key) >= entry.rubricSize || ![0, 1, 2].includes(Number(score))) return null;
    }
    if (record.review === undefined) record.review = emptySchedule();
    else if (!validReview(record.review)) return null;
    if (record.resetAt === undefined) record.resetAt = 0;
    else if (!time(record.resetAt)) return null;
  }
  return structuredClone(value) as unknown as Store;
}

export function loadStore(storage: Pick<Storage, 'getItem'>) {
  try {
    const raw = storage.getItem(SOC_KEY);
    if (raw === null) return { store: emptyStore(), blocked: false, warning: '' };
    const store = validateStore(JSON.parse(raw));
    if (!store) throw new Error('unknown');
    return { store, blocked: false, warning: '' };
  } catch {
    return { store: emptyStore(), blocked: true, warning: 'No se pudo leer el progreso del Mundo SOC. El original se conserva; puedes continuar en memoria y exportar esta sesión.' };
  }
}
