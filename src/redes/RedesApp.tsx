import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BookOpen, Download, Map, Network, Trophy } from 'lucide-react';
import { useRoute } from '../lib/router';
import { ProgressBar } from '../components/Primitives';
import { catalog, lessonById, lessonUrl, stageById, stageUrl } from './data';
import { available, passed, recordFor, statsFor, studied } from './progress';
import { useRedesProgress } from './hooks';
import RedesMap from './Map';
import type { Store } from './types';
import './redes.css';
import './reader.css';

const Reader = lazy(() => import('./Reader'));
const Resources = lazy(() => import('./Resources'));
class RedesBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main id="main-content" tabIndex={-1} className="page-shell"><h1>No se pudo abrir Redes</h1><p role="alert">Recarga la página para volver a intentarlo. Tu progreso guardado se conserva.</p><a href="#/ruta">Volver a la academia</a></main> : this.props.children; }
}
export default function RedesApp() { return <RedesBoundary><World/></RedesBoundary>; }
function World() {
  const route = useRoute(), progress = useRedesProgress(), stats = statsFor(progress.store);
  const parts = route.id.split('/'), page = parts.length <= 2 ? parts[0] || 'ruta' : 'missing', id = parts[1] ?? '';
  const stage = stageById.get(id), lesson = lessonById.get(id);
  useEffect(() => {
    document.title = `${lesson?.title ?? stage?.title ?? (page === 'recursos' ? 'Recursos' : page === 'progreso' ? 'Mi progreso' : 'Tu mundo')} · Redes · SOC Learning Path`;
    const frame = requestAnimationFrame(() => {
      const node = route.params.get('nodo');
      const target = node ? document.getElementById(`red-node-${node}`) : document.getElementById('rd-reading-title') ?? document.getElementById('main-content');
      target?.focus({ preventScroll: true });
      if (node && target) target.scrollIntoView({ block: 'center', behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [route.key]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && page === 'leccion' && lesson) location.hash = stageUrl(lesson.stageId, lesson.id); };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, [page, lesson]);
  return <div className="redes-academy"><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Saltar al contenido</a>
    <header className="site-header rd-header"><div className="rd-header-inner"><a className="rd-brand" href="#/redes/ruta"><span><Network size={29} aria-hidden="true"/></span><div><strong>Mundo Redes</strong><small>Cada conexión cuenta</small></div></a><nav className="rd-primary-nav" aria-label="Navegación de Redes"><a href="#/redes/ruta" aria-current={['ruta', 'etapa', 'leccion'].includes(page) ? 'page' : undefined}><Map size={18} aria-hidden="true"/>Ruta</a><a href="#/redes/recursos" aria-current={page === 'recursos' ? 'page' : undefined}><BookOpen size={18} aria-hidden="true"/>Recursos</a><a href="#/redes/progreso" aria-current={page === 'progreso' ? 'page' : undefined}><Trophy size={18} aria-hidden="true"/>Mi progreso</a></nav><a className="rd-profile" href="#/redes/progreso"><span>{stats.level}</span><div><b>Nivel {stats.level}</b><small>{stats.xp} XP de aprendizaje</small></div></a></div></header>
    {progress.warning ? <p className="storage-warning" role="alert">{progress.warning}</p> : null}
    <main id="main-content" tabIndex={-1} className={`rd-shell ${page === 'ruta' || page === 'etapa' ? 'rd-panorama' : ''}`}>
      {page === 'ruta' && !id ? <RedesMap key="atlas" store={progress.store}/> : page === 'etapa' && stage ? <RedesMap key={stage.id} store={progress.store} stage={stage}/> : page === 'leccion' ? <Suspense fallback={<p role="status" className="rd-panel">Abriendo la lección…</p>}><Reader id={id} params={route.params} store={progress.store} send={progress.send}/></Suspense> : page === 'recursos' ? <Suspense fallback={<p role="status" className="rd-panel">Abriendo recursos…</p>}><Resources id={id} store={progress.store}/></Suspense> : page === 'progreso' && !id ? <Journal store={progress.store} exportProgress={progress.exportProgress}/> : <section className="rd-panel"><h1>Este camino de Redes no existe</h1><a href="#/redes/ruta">Volver al mapa</a></section>}
    </main><footer className="rd-footer"><a href="#/redes/ruta">Mundo Redes</a><span>Aprende protocolos. Investiga con evidencia.</span><span>Progreso guardado en este navegador</span></footer>
  </div>;
}
function Journal({ store, exportProgress }: { store: Store; exportProgress: () => void }) {
  const stats = statsFor(store);
  return <section className="rd-journal"><div className="rd-page-title"><div><p>Tu recorrido, a tu ritmo</p><h1>Mi progreso en Redes</h1><p>{stats.studied} estudiadas · {stats.passed} teorías aprobadas · {stats.practiced} respuestas de práctica</p></div><Trophy size={40} aria-hidden="true"/></div><div className="rd-journal-summary"><b>Nivel {stats.level} · {stats.xp} XP</b><p>5 XP al completar el estudio y 15 XP al aprobar la teoría. Los reintentos conservan el historial y no repiten XP. Las respuestas documentales no acreditan ejecución de laboratorios.</p><button className="button primary" onClick={exportProgress}><Download size={17} aria-hidden="true"/>Exportar mi progreso de Redes</button></div>{catalog.stages.map(stage => {
    const lessons = stage.lessonIds.map(id => lessonById.get(id)!);
    const done = lessons.filter(l => passed(recordFor(store, l), l)).length;
    return <details key={stage.id} className="rd-journal-stage"><summary><span>{stage.title}</span><b>{done}/{lessons.length}</b></summary><ProgressBar value={done / lessons.length * 100} label={`Teoría aprobada: ${stage.title}`}/><a href={stageUrl(stage.id)}>Ver mapa de etapa</a><ol>{lessons.map(l => { const r = recordFor(store, l); return <li key={l.id}><span>{available(store, l) ? <a href={lessonUrl(l.id)}>{l.title}</a> : l.title}<small>{r.seen.length}/3 pasos · {studied(r, l) ? 'estudio completado' : 'estudio pendiente'} · {passed(r, l) ? 'teoría aprobada' : 'teoría pendiente'}</small></span><details><summary>{Object.keys(r.attempts).length} intentos</summary><ul>{Object.values(r.attempts).sort((a, b) => a.started - b.started).map(a => <li key={a.id}>{new Date(a.started).toLocaleString('es-ES')} · {a.finished === null ? <a href={lessonUrl(l.id, 'evalua')}>Evaluación en curso</a> : `${a.score}/2 respuestas correctas`}</li>)}</ul></details></li>; })}</ol></details>;
  })}</section>;
}
