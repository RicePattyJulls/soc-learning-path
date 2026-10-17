import { useEffect, useRef } from 'react';
import { Anchor, BookOpen, Download, Map, Trophy } from 'lucide-react';
import { useRoute } from '../lib/router';
import { catalog, lessonUrl, regionUrl } from './data';
import { recordFor, splunkStats } from './progress';
import { useSplunkProgress } from './useSplunk';
import SplunkMap from './SplunkMap';
import SplunkReader from './SplunkReader';
import Resources from './Resources';
import { ProgressBar } from '../components/Primitives';
import './splunk.css';
import './reader.css';
import './premium-world.css';

export default function SplunkApp() {
  const route = useRoute(), { store, warning, send, exportProgress } = useSplunkProgress();
  const stats = splunkStats(store, catalog), [page, id] = route.id.split('/');
  const previous = useRef('');
  const activeLesson = catalog.lessons.find(l => l.id === id);
  useEffect(() => {
    const pointer = () => { document.documentElement.dataset.presentationInput = 'pointer'; };
    const keyboard = () => { document.documentElement.dataset.presentationInput = 'keyboard'; };
    document.documentElement.dataset.presentationInput = 'keyboard';
    window.addEventListener('pointerdown', pointer, { passive: true });
    window.addEventListener('keydown', keyboard);
    return () => { window.removeEventListener('pointerdown', pointer); window.removeEventListener('keydown', keyboard); };
  }, []);
  useEffect(() => {
    document.title = `${activeLesson?.title || catalog.regions.find(r => r.id === id)?.title || (page === 'progreso' ? 'Bitácora' : 'Atlas')} · Splunk SOC · V2.0 experimental`;
    const node = route.params.get('nodo');
    const frame = requestAnimationFrame(() => {
      const target = node ? document.getElementById(`sp-node-${node}`) : document.getElementById('main-content');
      if (previous.current !== route.key) {
        target?.focus({ preventScroll: true });
        if (node && target) target.scrollIntoView({ block: 'center', behavior: 'instant' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      }
      previous.current = route.key;
    });
    return () => cancelAnimationFrame(frame);
  }, [route.key, activeLesson?.title, page, id]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && page === 'leccion' && activeLesson) location.hash = regionUrl(activeLesson.regionId, id); };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, [page, id, activeLesson]);
  const examActive = catalog.lessons.some(l => !!recordFor(store, l).activeAttempt);
  return <div className="splunk-academy"><a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Saltar al contenido</a>
    <header className="site-header"><div className="header-inner"><a className="brand" href="#/splunk/ruta"><span className="brand-shield"><Anchor size={30} aria-hidden="true"/></span><span><strong>Splunk <span>SOC</span></strong><small>Tu conocimiento. Tu propia bitácora.</small></span></a><nav className="primary-nav" aria-label="Navegación Splunk"><a href="#/splunk/ruta" aria-current={page === 'ruta' || page === 'region' || page === 'leccion' ? 'page' : undefined}><Map size={17} aria-hidden="true"/><span>Ruta</span></a><a href="#/splunk/recursos" aria-current={page === 'recursos' ? 'page' : undefined}><BookOpen size={17} aria-hidden="true"/><span>Recursos</span></a><a href="#/splunk/progreso" aria-current={page === 'progreso' ? 'page' : undefined}><Trophy size={17} aria-hidden="true"/><span>Bitácora</span></a></nav><a href="#/splunk/progreso" className="profile sp-profile" aria-label={`Splunk: nivel provisional ${stats.level}, ${stats.provisionalXP} XP provisionales, 0 XP definitivos`}><span className="avatar">{stats.level}</span><span className="profile-summary"><b>Nivel {stats.level} · piloto</b><ProgressBar value={stats.levelXP/250*100} label="XP provisionales del perfil Splunk" small/><small>{stats.provisionalXP} XP provisionales</small></span></a></div></header>
    {warning && <p className="storage-warning" role="alert">{warning}</p>}
    <main id="main-content" tabIndex={-1} className={`sp-shell ${page === 'ruta' || page === 'region' ? 'sp-panorama' : ''}`}>{page === 'ruta' || (page === 'region' && catalog.regions.some(r => r.id === id)) ? <SplunkMap store={store} regionId={page === 'region' ? id : undefined}/> : page === 'leccion' ? <SplunkReader id={id || ''} params={route.params} store={store} send={send}/> : page === 'progreso' ? <section className="sp-card sp-journal"><p className="sp-eyebrow">SOLO SPLUNK · R01–R11 EXPERIMENTAL</p><h1>Tu bitácora independiente</h1><p>{stats.provisionalXP} XP provisionales · Nivel provisional {stats.level} · <strong>0 XP definitivos</strong></p><p>Estudio {stats.studied}/{catalog.lessons.length} · Teoría {stats.passed}/{catalog.lessons.length} · Práctica no evaluada.</p><p>No se fusiona con XP, niveles, premios ni historial SC-200. La revisión independiente sigue pendiente; no hay promoción automática a recompensas definitivas.</p><ul>{catalog.lessons.map(l => { const r = recordFor(store,l); return <li key={l.id}><a href={lessonUrl(l.id)}>{l.id} · {l.title}</a><span>{r.seen.length}/{l.stepIds.length} pasos · {Object.keys(r.attempts).length} intentos conservados · {r.formativeSeen ? 'formativa consultada' : 'formativa por consultar'}</span></li>; })}</ul><button className="button sp-primary" onClick={exportProgress}><Download size={17} aria-hidden="true"/>Exportar progreso Splunk</button></section> : page === 'recursos' ? <Resources examActive={examActive} regionId={id}/> : <section className="sp-card"><h1>Este camino Splunk no existe</h1><p>Comprueba el enlace. Las once regiones están disponibles en el atlas.</p><a href="#/splunk/ruta">Volver al atlas Splunk</a></section>}</main>
    <footer className="sp-footer"><span>Splunk SOC · V2.0 experimental · {catalog.lessons.length}/80 lecciones</span><span>Revisión humana y validación real en producto pendientes</span></footer>
  </div>;
}
