import { useCallback, useEffect, useState } from 'react';
import { CARDS } from './cards';

// Clave propia del mundo: no se comparte ni se fusiona con otros almacenes.
export const REPASO_SOC_KEY = 'soc-learning-path:repaso-soc:v1';
const ids = new Set(CARDS.map(card => card.id));

export interface RepasoStore { schemaVersion: 1; known: string[] }

export function parseStore(text: string | null): RepasoStore {
  try {
    const data = JSON.parse(text ?? '');
    if (data?.schemaVersion === 1 && Array.isArray(data.known)) {
      return { schemaVersion: 1, known: [...new Set(data.known.filter((id: unknown) => typeof id === 'string' && ids.has(id)))] as string[] };
    }
  } catch { /* vacío o corrupto: se empieza de cero */ }
  return { schemaVersion: 1, known: [] };
}

export function toggleKnown(store: RepasoStore, id: string): RepasoStore {
  return { schemaVersion: 1, known: store.known.includes(id) ? store.known.filter(item => item !== id) : [...store.known, id] };
}

function read() {
  try { return { store: parseStore(localStorage.getItem(REPASO_SOC_KEY)), warning: '' }; }
  catch { return { store: parseStore(null), warning: 'Este navegador no permite guardar: lo que marques se pierde al recargar.' }; }
}

export function useRepasoProgress() {
  const [state, setState] = useState(read);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === REPASO_SOC_KEY || event.key === null) setState(read()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggle = useCallback((id: string) => {
    setState(current => {
      const store = toggleKnown(current.store, id);
      try { localStorage.setItem(REPASO_SOC_KEY, JSON.stringify(store)); return { store, warning: current.warning }; }
      catch { return { store, warning: 'No se pudo guardar: lo que marques se pierde al recargar.' }; }
    });
  }, []);
  return { ...state, toggle };
}
