import { useCallback, useEffect, useState } from 'react';
import { fetchAnswers, fetchCase } from './data';
import { applyAction, emptyStore, loadStore, mergeStores, SOC_KEY, type Action } from './progress';
import type { Answers, CaseContent, CaseEntry } from './types';

function load() {
  try { return loadStore(localStorage); }
  catch {
    return { store: emptyStore(), blocked: true, warning: 'No se puede guardar el Mundo SOC en este navegador. Puedes continuar y exportar la sesión.' };
  }
}

export function useSocProgress() {
  const [state, setState] = useState(load);
  useEffect(() => {
    if (state.blocked) return;
    try {
      const saved = loadStore(localStorage);
      if (saved.blocked) { setState(current => ({ ...current, blocked: true, warning: saved.warning })); return; }
      const store = mergeStores(saved.store, state.store), text = JSON.stringify(store);
      if (localStorage.getItem(SOC_KEY) !== text) localStorage.setItem(SOC_KEY, text);
      if (text !== JSON.stringify(state.store)) setState(current => ({ ...current, store }));
    } catch {
      setState(current => ({ ...current, blocked: true, warning: 'No se pudo guardar el Mundo SOC. Continúa en memoria y exporta tu progreso al terminar.' }));
    }
  }, [state.store, state.blocked]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== SOC_KEY && event.key !== null) return;
      try { if (event.storageArea !== localStorage) return; } catch { return; }
      const saved = load();
      setState(current => ({ ...saved, store: mergeStores(current.store, saved.store) }));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const send = useCallback((entry: CaseEntry, action: Action) => {
    setState(current => ({ ...current, store: applyAction(current.store, entry, action) }));
  }, []);
  const exportProgress = () => {
    const blob = new Blob([JSON.stringify({ format: 'soc-learning-path-soc-v1', exportedAt: new Date().toISOString(), progress: state.store }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mundo-soc-progreso.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return { ...state, send, exportProgress };
}

const contentCache = new Map<string, CaseContent>();
export function useCaseContent(entry?: CaseEntry) {
  const key = entry ? `${entry.id}:${entry.revision}` : '';
  const [state, setState] = useState<{ key: string; data?: CaseContent; error?: string }>({ key: '' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!entry) return;
    const controller = new AbortController();
    if (contentCache.has(key)) { setState({ key, data: contentCache.get(key) }); return; }
    setState({ key });
    fetchCase(entry, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      contentCache.set(key, data);
      if (contentCache.size > 16) contentCache.delete(contentCache.keys().next().value!);
      setState({ key, data });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ key, error: 'No se pudo cargar o verificar este caso. Reintenta para recuperar su versión actual.' });
    });
    return () => controller.abort();
  }, [key, retry]);
  return { ...(state.key === key ? state : {}), retry: () => setRetry(value => value + 1) };
}

const answersCache = new Map<string, Answers>();
export function useCaseAnswers(entry?: CaseEntry, enabled = false) {
  const key = entry ? `${entry.id}:${entry.revision}` : '';
  const [state, setState] = useState<{ key: string; data?: Answers; error?: string }>({ key: '' });
  useEffect(() => {
    if (!entry || !enabled) return;
    const controller = new AbortController();
    if (answersCache.has(key)) { setState({ key, data: answersCache.get(key) }); return; }
    fetchAnswers(entry, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      answersCache.set(key, data);
      if (answersCache.size > 16) answersCache.delete(answersCache.keys().next().value!);
      setState({ key, data });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ key, error: 'No se pudo verificar la respuesta modelo. Tu respuesta sigue guardada; reintenta.' });
    });
    return () => controller.abort();
  }, [key, enabled]);
  return state.key === key ? state : { key };
}
