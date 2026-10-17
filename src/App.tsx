import { lazy, Suspense, useEffect, useRef } from 'react';
import Header from './components/Header';
import { usePresentationMotion } from './lib/usePresentationMotion';
import Roadmap from './components/Roadmap';
import Chapter from './components/Chapter';
import Statistics from './components/Statistics';
import { lessons, chapters } from './lib/catalog';
import { statistics } from './lib/progress';
import { useProgress } from './lib/useProgress';
import { useRoute } from './lib/router';
import AcademySelector from './components/AcademySelector';
import CourseBoundary from './components/CourseBoundary';
import SimulatorBoundary from './simulator/SimulatorBoundary';
import './academies.css';

const Reader = lazy(() => import('./components/Reader'));
const Library = lazy(() => import('./components/Library'));
const LearningReader = lazy(() => import('./components/LearningReader'));
const Review = lazy(() => import('./components/Review'));
const SplunkApp = lazy(() => import('./splunk/SplunkApp'));
const SimulatorApp = lazy(() => import('./simulator/entry'));
export default function App() {
  const route = useRoute();
  const course = route.page === 'splunk' || route.page === 'simulador' && route.id.startsWith('splunk') ? 'splunk' : 'sc200';
  const previousCourse = useRef(course);
  useEffect(() => {
    const changed = previousCourse.current !== course;
    previousCourse.current = course;
    if (changed && course === 'sc200') {
      const frame = requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(frame);
    }
  }, [course]);
  return <><AcademySelector course={course} />{route.page === 'simulador' ? <SimulatorBoundary><Suspense fallback={<main id="main-content" tabIndex={-1} className="page-shell" role="status">Abriendo el centro SOC…</main>}><SimulatorApp routeId={route.id}/></Suspense></SimulatorBoundary> : course === 'splunk' ? <CourseBoundary><Suspense fallback={<main id="main-content" tabIndex={-1} className="page-shell" role="status">Abriendo Splunk SOC…</main>}><SplunkApp /></Suspense></CourseBoundary> : <Sc200App />}</>;
}
function Sc200App() {
  const route = useRoute();
  usePresentationMotion(route.page,route.id,route.params.get('nodo')||undefined);
  const { progress, warning, complete, visit, send, exportProgress } = useProgress();
  const stats = statistics(progress, lessons, chapters);
  const previousPage = useRef(`${route.page}/${route.id}`);
  useEffect(() => {
    const title = route.page === 'leccion' ? lessons.find(l => l.id === route.id)?.title : route.page === 'capitulo' ? chapters.find(c => c.id === route.id)?.title : ({ ruta: 'Tu ruta', biblioteca: 'Biblioteca', progreso: 'Mi progreso' } as Record<string, string>)[route.page];
    document.title = `${title || 'Academia'} · SOC Learning Path`;
    if (!route.params.has('nodo')) window.scrollTo({ top: 0, behavior: 'instant' });
    const current = `${route.page}/${route.id}`;
    if (previousPage.current === current) return;
    previousPage.current = current;
    if (!route.params.has('seccion') && !route.params.has('nodo')) document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [route.page, route.id]);
  return <><a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>Saltar al contenido</a><Header page={route.page} stats={stats} />{warning ? <div className="storage-warning" role="alert">{warning}</div> : null}<main id="main-content" tabIndex={-1}>
    {route.page === 'ruta' ? <Roadmap progress={progress} focusStation={route.params.get('nodo') || undefined} /> : route.page === 'capitulo' ? <Chapter id={route.id} progress={progress} focusStation={route.params.get('nodo') || undefined} /> : route.page === 'biblioteca' ? <Suspense fallback={<div className="page-shell" role="status">Abriendo la biblioteca…</div>}><Library progress={progress} query={route.params.get('q') || ''} module={route.params.get('capitulo') || ''} /></Suspense> : route.page === 'progreso' ? <Statistics progress={progress} exportProgress={exportProgress} /> : route.page === 'repaso' ? <Suspense fallback={<div className="page-shell" role="status">Preparando el repaso…</div>}><Review progress={progress} /></Suspense> : route.page === 'leccion' ? <Suspense fallback={<div className="page-shell" role="status">Preparando tu lectura…</div>}>{route.params.get('modo') === 'apuntes' || route.params.has('seccion') ? <Reader id={route.id} section={route.params.get('seccion')} progress={progress} complete={complete} visitLesson={visit} /> : <LearningReader id={route.id} params={route.params} progress={progress} send={send} visitLesson={visit} />}</Suspense> : <div className="page-shell empty-state"><h1>Este camino no existe</h1><a href="#/ruta">Volver a tu ruta</a></div>}
  </main><footer className="site-footer"><a href="#/ruta">SOC Learning Path</a><span>Hecho para aprender, paso a paso.</span><span>Progreso guardado en este navegador</span></footer></>;
}
