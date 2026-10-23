import { useCallback, useEffect, useState } from 'react';
import { fetchLesson } from './data';
import { applyAction, emptyStore, loadStore, mergeStores, REDES_KEY, type Action } from './progress';
import type { Lesson, LessonContent } from './types';

function load() {
  try { return loadStore(localStorage); }
  catch { return { store: emptyStore(), blocked: true, warning: 'No se puede guardar Redes en este navegador. Puedes continuar y exportar la sesión.' }; }
}
export function useRedesProgress() {
  const [state, setState] = useState(load);
  useEffect(() => {
    if (state.blocked) return;
    try {
      const saved = loadStore(localStorage);
      if (saved.blocked) { setState(s => ({ ...s, blocked: true, warning: saved.warning })); return; }
      const store = mergeStores(saved.store, state.store), text = JSON.stringify(store);
      if (localStorage.getItem(REDES_KEY) !== text) localStorage.setItem(REDES_KEY, text);
      if (text !== JSON.stringify(state.store)) setState(s => ({ ...s, store }));
    } catch { setState(s => ({ ...s, blocked: true, warning: 'No se pudo guardar Redes. Continúa en memoria y exporta tu progreso al terminar.' })); }
  }, [state.store, state.blocked]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== REDES_KEY && event.key !== null) return;
      try { if (event.storageArea !== localStorage) return; } catch { return; }
      const saved = load(); setState(s => ({ ...saved, store: mergeStores(s.store, saved.store) }));
    };
    window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync);
  }, []);
  const send = useCallback((lesson: Lesson, content: LessonContent, action: Action) => setState(s => ({ ...s, store: applyAction(s.store, lesson, content, action) })), []);
  const exportProgress = () => {
    const blob = new Blob([JSON.stringify({ format: 'soc-learning-path-redes-v1', exportedAt: new Date().toISOString(), progress: state.store }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'redes-progreso.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return { ...state, send, exportProgress };
}
const cache = new Map<string, LessonContent>();
export function useRedesContent(lesson?: Lesson) {
  const key = lesson ? `${lesson.id}:${lesson.revision}` : '';
  const [state, setState] = useState<{ key: string; data?: LessonContent; error?: string }>({ key: '' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!lesson) return;
    const controller = new AbortController();
    if (cache.has(key)) { setState({ key, data: cache.get(key) }); return; }
    setState({ key });
    fetchLesson(lesson, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      cache.set(key, data); if (cache.size > 8) cache.delete(cache.keys().next().value!);
      setState({ key, data });
    }).catch(() => { if (!controller.signal.aborted) setState({ key, error: 'No se pudo cargar o verificar esta lección. Reintenta para recuperar su versión actual.' }); });
    return () => controller.abort();
  }, [key, retry]);
  return { ...(state.key === key ? state : {}), retry: () => setRetry(n => n + 1) };
}
