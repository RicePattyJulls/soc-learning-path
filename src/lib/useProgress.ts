import { useCallback, useEffect, useMemo, useState } from 'react';
import { chapters, lessonMap, lessons } from './catalog';
import { applyLearning, emptyLearning, facade, LEARNING_KEY, mergeLearning, type LearningAction } from './learning';
import { LEGACY_KEY, loadLearning, saveLearning } from './learning-storage';

const load = () => {
  try { return loadLearning(localStorage, chapters); }
  catch { return { store: emptyLearning(), warning: 'El almacenamiento no está disponible. Puedes estudiar y exportar el avance de esta sesión; no se modifica ningún guardado anterior.', blocked: true }; }
};
export function useProgress() {
  const [state, setState] = useState(load);
  useEffect(() => {
    if (state.blocked) return;
    try {
      const saved = saveLearning(localStorage, state.store, chapters);
      if (JSON.stringify(saved.store) !== JSON.stringify(state.store) || saved.blocked) setState(saved);
    } catch {
      setState(s => s.warning.includes('guardar') ? s : { ...s, warning: 'No se puede guardar el progreso. Permite el almacenamiento local o exporta una copia; tu avance sigue disponible en esta sesión.' });
    }
  }, [state.store, state.blocked]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === LEARNING_KEY || event.key === LEGACY_KEY || event.key === null) {
        const saved = load();
        setState(s => ({ ...saved, store: mergeLearning(s.store, saved.store) }));
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const send = useCallback((id: string, action: LearningAction) => {
    const lesson = lessonMap.get(id);
    if (lesson) setState(s => ({ ...s, store: applyLearning(s.store, lesson, action, chapters) }));
  }, []);
  const visit = useCallback((id: string) => send(id, { type: 'visit' }), [send]);
  const complete = useCallback((id: string) => send(id, { type: 'summary' }), [send]);
  const progress = useMemo(() => facade(state.store, lessons), [state.store]);
  const exportProgress = useCallback(() => {
    let legacyRaw: string | null = null, interactiveRaw: string | null = null;
    try { legacyRaw = localStorage.getItem(LEGACY_KEY); interactiveRaw = localStorage.getItem(LEARNING_KEY); } catch { /* export memory regardless */ }
    const blob = new Blob([JSON.stringify({ format: 'soc-learning-path-v1.5', exportedAt: new Date().toISOString(), progress: state.store, legacyRaw, interactiveRaw }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'soc-learning-path-progreso.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [state.store]);
  return { progress, warning: state.warning, complete, visit, send, exportProgress };
}
