import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BookOpen, Compass, GraduationCap, Repeat } from 'lucide-react';
import { useRoute } from '../lib/router';
import { boardUrl, caseById, catalog, reviewUrl, sourcesUrl } from './data';
import { useSocProgress } from './hooks';
import CaseBoard from './CaseBoard';
import './soc.css';

const CaseReader = lazy(() => import('./CaseReader'));
const Journal = lazy(() => import('./Journal'));
const Review = lazy(() => import('./Review'));
const Sources = lazy(() => import('./Sources'));

class SocBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <main id="main-content" tabIndex={-1} className="page-shell"><h1>No se pudo abrir el Mundo SOC</h1><p role="alert">Recarga la página para volver a intentarlo. Tu progreso guardado se conserva.</p><a href="#/ruta">Volver a la academia</a></main>
      : this.props.children;
  }
}

export default function SocApp() {
  return <SocBoundary><World /></SocBoundary>;
}

function World() {
  const route = useRoute();
  const progress = useSocProgress();
  const parts = route.id.split('/');
  const page = parts.length <= 2 ? parts[0] || 'ruta' : 'missing';
  const id = parts[1] ?? '';
  const entry = caseById.get(id);

  useEffect(() => {
    const titles: Record<string, string> = { ruta: 'Casos', fuentes: 'Fuentes', progreso: 'Mi progreso', repaso: 'Repaso de respuestas' };
    document.title = `${entry?.titulo ?? titles[page] ?? 'Mundo SOC'} · Mundo SOC · SOC Learning Path`;
    const frame = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, [route.key]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && page === 'caso') location.hash = boardUrl(); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [page]);

  return <div className="soc-academy">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Saltar al contenido</a>
    <header className="site-header soc-header">
      <div className="soc-header-inner">
        <a className="soc-brand" href={boardUrl()}>
          <span><GraduationCap size={28} aria-hidden="true" /></span>
          <div><strong>Mundo SOC</strong><small>Preguntas de entrevista y triaje</small></div>
        </a>
        <nav className="soc-primary-nav" aria-label="Navegación del Mundo SOC">
          <a href={boardUrl()} aria-current={['ruta', 'caso'].includes(page) ? 'page' : undefined}><Compass size={18} aria-hidden="true" />Casos</a>
          <a href={reviewUrl()} aria-current={page === 'repaso' ? 'page' : undefined}><Repeat size={18} aria-hidden="true" />Repaso</a>
          <a href={sourcesUrl()} aria-current={page === 'fuentes' ? 'page' : undefined}><BookOpen size={18} aria-hidden="true" />Fuentes</a>
        </nav>
        <span className="soc-profile" aria-hidden="true" />
      </div>
    </header>

    {progress.warning ? <p className="storage-warning" role="alert">{progress.warning}</p> : null}

    <main id="main-content" tabIndex={-1} className="soc-shell">
      {page === 'ruta' && !id ? <CaseBoard />
        : page === 'caso' ? <Suspense fallback={<p role="status" className="soc-panel">Abriendo el caso…</p>}><CaseReader id={id} store={progress.store} send={progress.send} /></Suspense>
        : page === 'repaso' && !id ? <Suspense fallback={<p role="status" className="soc-panel">Abriendo el repaso…</p>}><Review /></Suspense>
        : page === 'fuentes' && !id ? <Suspense fallback={<p role="status" className="soc-panel">Abriendo las fuentes…</p>}><Sources /></Suspense>
        : page === 'progreso' && !id ? <Suspense fallback={<p role="status" className="soc-panel">Preparando tu progreso…</p>}><Journal store={progress.store} exportProgress={progress.exportProgress} /></Suspense>
        : <section className="soc-panel"><h1>Este camino del Mundo SOC no existe</h1><a className="button secondary" href={boardUrl()}>Volver al tablero de casos</a></section>}
    </main>

    <footer className="soc-footer">
      <a href={boardUrl()}>Mundo SOC</a>
      <span>{catalog.description}</span>
      <span>Progreso guardado en este navegador</span>
    </footer>
  </div>;
}
