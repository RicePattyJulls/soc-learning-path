import { useCallback, useEffect, useState } from 'react';
import { catalog, decodePayload } from './data';
import { applySplunk, emptySplunk, loadSplunk, mergeSplunk, saveSplunk, SPLUNK_KEY, type SplunkAction } from './progress';
import type { SplunkLesson, SplunkPayload } from './types';

const load = () => {
  try { return loadSplunk(localStorage, catalog); }
  catch { return { store: emptySplunk(), warning: 'Almacenamiento Splunk no disponible; sesión en memoria.', blocked: true }; }
};
export function useSplunkProgress() {
  const [state, setState] = useState(load);
  useEffect(() => {
    if (state.blocked) return;
    try {
      const saved = saveSplunk(localStorage, state.store, catalog);
      if (saved.blocked || JSON.stringify(saved.store) !== JSON.stringify(state.store)) setState(saved);
    } catch { setState(s => s.warning ? s : { ...s, warning: 'No se puede guardar Splunk. Puedes seguir en memoria y exportar esta sesión.' }); }
  }, [state.store, state.blocked]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== SPLUNK_KEY && event.key !== null) return;
      try { if (event.storageArea !== localStorage) return; } catch { return; }
      const saved = load();
      setState(s => ({ ...saved, store: mergeSplunk(s.store, saved.store) }));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const send = useCallback((lesson: SplunkLesson, payload: SplunkPayload, action: SplunkAction) => setState(s => ({ ...s, store: applySplunk(s.store, catalog, lesson, payload, action) })), []);
  const exportProgress = useCallback(() => {
    const blob = new Blob([JSON.stringify({ format: 'soc-learning-path-splunk-v1', courseId: 'splunk', pilot: true, rewardMode: 'provisional_only', exportedAt: new Date().toISOString(), progress: state.store }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'splunk-piloto-progreso.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [state.store]);
  return { ...state, send, exportProgress };
}

const cache = new Map<string, SplunkPayload>();
export function useSplunkContent(lesson?: SplunkLesson) {
  const [state, setState] = useState<{ key: string; data?: SplunkPayload; error?: string }>({ key: '' });
  const [retry, setRetry] = useState(0);
  const key = lesson ? `splunk:${lesson.id}:${lesson.revision}` : '';
  useEffect(() => {
    if (!lesson) return;
    const controller = new AbortController();
    if (cache.has(key)) { setState({ key, data: cache.get(key) }); return; }
    setState({ key });
    fetch(`${import.meta.env.BASE_URL}${lesson.file}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('missing'); return response.text(); })
      .then(text => decodePayload(text, lesson))
      .then(data => {
        if (controller.signal.aborted) return;
        cache.set(key, data); if (cache.size > 8) cache.delete(cache.keys().next().value!);
        setState({ key, data });
      })
      .catch(() => { if (!controller.signal.aborted) setState({ key, error: 'No se pudo verificar esta lección Splunk. Reintenta o ejecuta npm run prepare:splunk; no se abrirá contenido de otra ruta.' }); });
    return () => controller.abort();
  }, [key, retry]);
  return { ...(state.key === key ? state : {}), retry: () => setRetry(n => n + 1) };
}
