import { useSyncExternalStore } from 'react';

const subscribe = (notify: () => void) => { window.addEventListener('hashchange', notify); return () => window.removeEventListener('hashchange', notify); };
const snapshot = () => location.hash || '#/ruta';
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, snapshot);
  const [path, query = ''] = hash.slice(1).split('?');
  const parts = path.split('/').filter(Boolean);
  let id = '';
  try { id = decodeURIComponent(parts.slice(1).join('/')); } catch { /* malformed URL becomes a not-found page */ }
  return { page: parts[0] || 'ruta', id, params: new URLSearchParams(query), key: hash };
}
export function replaceQuery(key: string, value: string) {
  const [path, query = ''] = (location.hash || '#/biblioteca').split('?');
  const params = new URLSearchParams(query);
  if (value) params.set(key, value); else params.delete(key);
  history.replaceState(null, '', `${path}${params.size ? '?' + params : ''}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
