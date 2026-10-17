import type { Chapter } from '../types';
import { emptyLearning, LEARNING_KEY, mergeLearning, migrateLegacy, validateLearning } from './learning';
import type { LearningStore } from '../education';

export const LEGACY_KEY = 'soc-learning-path:progress:v1';
export function loadLearning(storage: Pick<Storage, 'getItem'>, chapters: Chapter[]) {
  let store = emptyLearning(), warning = '', blocked = false;
  try {
    const raw = storage.getItem(LEARNING_KEY);
    if (raw !== null) {
      const parsed = validateLearning(JSON.parse(raw));
      if (!parsed) throw new Error('invalid');
      store = parsed;
    }
  } catch { warning = 'No se puede interpretar el progreso interactivo guardado. Se conserva sin sobrescribir; puedes estudiar en esta sesión y exportar una copia.'; blocked = true; }
  try {
    const raw = storage.getItem(LEGACY_KEY);
    if (raw !== null) {
      const legacy = JSON.parse(raw);
      if (legacy?.schemaVersion !== 1 || !legacy.completed || typeof legacy.completed !== 'object' || Array.isArray(legacy.completed)) throw new Error('invalid');
      store = migrateLegacy(legacy, store, chapters);
    }
  } catch { warning ||= 'No se pudo interpretar el guardado anterior. El original se conserva sin modificar; puedes exportarlo junto al avance de esta sesión.'; }
  return { store, warning, blocked };
}
export function saveLearning(storage: Pick<Storage, 'getItem' | 'setItem'>, store: LearningStore, chapters: Chapter[]) {
  const persisted = loadLearning(storage, chapters);
  if (persisted.blocked) return { ...persisted, store: mergeLearning(persisted.store, store) };
  const merged = mergeLearning(persisted.store, store);
  const serialized = JSON.stringify(merged);
  if (storage.getItem(LEARNING_KEY) !== serialized) storage.setItem(LEARNING_KEY, serialized);
  // LEGACY_KEY is intentionally never written or removed.
  return { store: merged, warning: persisted.warning, blocked: false };
}
