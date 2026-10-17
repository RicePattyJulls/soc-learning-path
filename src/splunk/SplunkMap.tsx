import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, Flag, LockKeyhole, Play, ShieldCheck, Trophy, Zap } from 'lucide-react';
import { Robot } from '../components/adventure/Artwork';
import { ProgressBar } from '../components/Primitives';
import { catalog, lessonUrl, regionUrl } from './data';
import { isAvailable, recordFor, splunkStats } from './progress';
import type { SplunkStore } from './types';
import PremiumWorld from './PremiumWorld';

export default function SplunkMap({ store, regionId }: { store: SplunkStore; regionId?: string }) {
  const stats = splunkStats(store, catalog);
  const region = catalog.regions.find(r => r.id === regionId);
  const lessons = region ? catalog.lessons.filter(l => region.lessonIds.includes(l.id)) : catalog.lessons;
  const last = lessons.find(l => l.id === store.lastLesson?.id && isAvailable(store,l,catalog));
  const next = last || lessons.find(l => isAvailable(store,l,catalog) && !recordFor(store,l).theoryPassed) || lessons.find(l => isAvailable(store,l,catalog));
  const passed = lessons.filter(l => recordFor(store,l).theoryPassed).length;
  const percent = Math.round(passed / lessons.length * 100);
  const position = catalog.regions.find(r => r.lessonIds.includes(next?.id || '')) || catalog.regions[0];
  const index = region ? catalog.regions.indexOf(region) : -1;
  const availableRegion = catalog.regions.find(r=>r.lessonIds.some(id=>isAvailable(store,catalog.lessons.find(l=>l.id===id)!,catalog))) || catalog.regions[0];
  const meter = <div className="region-meter"><span><Flag size={17} aria-hidden="true"/>{region?'Tu progreso en la región':'Tu progreso general'}</span><div><ProgressBar value={percent} label="Progreso teórico Splunk"/><b>{percent}%</b></div><small>{passed} de {lessons.length} teorías aprobadas · Práctica no evaluada</small></div>;
  return <div className={`sp-map-page ${region?'page-shell chapter-page':'adventure-home'} sp-theme-${region?.theme || 'harbor'}`}>
    {region ? <><a className="back-link" href={`#/splunk/ruta?nodo=${region.id}`}><ArrowLeft size={17} aria-hidden="true"/>Volver al mapa del mundo Splunk</a><section className="chapter-intro"><span className="chapter-symbol"><Compass size={36} aria-hidden="true"/></span><div><p>Etapa {index+1} de {catalog.regions.length} · Splunk SOC</p><h1 id="sp-map-title">{region.title}</h1><p>{lessons.length} lecciones · Teoría piloto · Práctica no evaluada</p></div></section></> : <h1 id="sp-map-title" className="sr-only">Tu mundo Splunk</h1>}
    <nav className={region?'region-navigation':'atlas-tools'} aria-label="Regiones Splunk">
      {!region && <p><Compass size={17} aria-hidden="true"/>{catalog.regions.length} regiones · {catalog.lessons.length} lecciones · Tu aventura Splunk</p>}
      <div className="atlas-orientation sp-region-tabs">
        {!region && <a className="current-position" href={regionUrl(position.id)}><Compass size={16} aria-hidden="true"/>Tu posición</a>}
        <label>{region&&<BookOpen size={17} aria-hidden="true"/>}{region?'Explorar regiones':'Ir a una región'}<select value={region?.id || ''} onChange={event=>{if(event.target.value)location.hash=regionUrl(event.target.value);}}><option value="">Elige una región…</option>{catalog.regions.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
      </div>
      {region && <div className="region-navigation-arrows">{catalog.regions[index-1] && <a href={regionUrl(catalog.regions[index-1].id)} aria-label="Región anterior"><ArrowLeft size={16} aria-hidden="true"/></a>}<span className="region-position">{index+1} / {catalog.regions.length}</span>{catalog.regions[index+1] && <a href={regionUrl(catalog.regions[index+1].id)} aria-label="Región siguiente"><ArrowRight size={16} aria-hidden="true"/></a>}</div>}
      <ul className="map-legend" aria-label="Leyenda del mapa Splunk"><li><Play size={13} aria-hidden="true"/>Disponible</li><li><LockKeyhole size={13} aria-hidden="true"/>Bloqueada</li><li><BookOpen size={13} aria-hidden="true"/>En curso</li><li><Check size={13} aria-hidden="true"/>Teoría aprobada</li></ul>
    </nav>
    {region && !next && <div className="notice"><LockKeyhole size={20} aria-hidden="true"/><div><b>Estudia y aprueba la teoría de las regiones anteriores para continuar.</b><p>Puedes explorar el mapa y consultar los requisitos de cada nodo.</p></div></div>}
    <PremiumWorld key={region?.id || 'atlas'} store={store} region={region}>
      <div className={`region-welcome ${region?'':'atlas-welcome'}`}><Robot/><div><span className="map-eyebrow"><Compass size={14} aria-hidden="true"/>Splunk SOC · Piloto experimental</span><h2>{region?.title || 'Tu próxima aventura empieza aquí'}</h2><p>{region?.description || 'Once regiones de aprendizaje SOC. Sigue tu propio camino, sin mezclar tu progreso SC-200.'}</p>{next ? <a className="button primary" href={lessonUrl(next.id)}>{last?'Continuar mi lectura':'Empezar en Splunk'}<ArrowRight size={17} aria-hidden="true"/></a> : <a className="button primary" href={regionUrl(availableRegion.id)}>Volver a la región disponible<ArrowRight size={17} aria-hidden="true"/></a>}</div></div>
      {region?meter:<div className="atlas-progress">{meter}<div className="atlas-stats"><div><Zap size={25} aria-hidden="true"/><span><b>{stats.provisionalXP}</b><small>XP provisionales</small></span></div><div><BookOpen size={25} aria-hidden="true"/><span><b>{stats.studied}</b><small>Lecciones estudiadas</small></span></div><div><Trophy size={25} aria-hidden="true"/><span><b>{store.regionAwards.length}</b><small>Bonus registrados</small></span></div></div></div>}
    </PremiumWorld>
    {!region ? <section className="adventure-camp sp-world-status" aria-label="Estado independiente de Splunk">
      <article className="camp-level"><h2>Tu nivel provisional</h2><div><span className="level-badge large">{stats.level}</span><div><h3>Nivel {stats.level}</h3><p>Explorador Splunk</p></div></div><ProgressBar value={stats.levelXP/250*100} label="XP provisionales hacia el siguiente nivel Splunk"/><p>{stats.levelXP}/250 XP · {250-stats.levelXP} para subir de nivel</p><a href="#/splunk/progreso">Ver mi bitácora<ArrowRight size={15} aria-hidden="true"/></a></article>
      <article className="camp-rewards"><div className="camp-heading"><h2>Recompensas en el camino</h2><a href="#/splunk/progreso">Ver bonus<ArrowRight size={14} aria-hidden="true"/></a></div><div className="camp-badges">{catalog.regions.map(r=><a key={r.id} href="#/splunk/progreso" className={store.regionAwards.includes(r.id)?'earned':''}><span><Trophy size={29} aria-hidden="true"/></span><b>{r.title}</b><small>100 XP provisionales tras estudio y teoría</small><i>{store.regionAwards.includes(r.id)?'Registrado':'Pendiente'}</i></a>)}</div></article>
      <article className="camp-guide"><h2>Aprender con evidencia</h2><ul><li><ShieldCheck size={19} aria-hidden="true"/>0 XP definitivos. Revisión humana independiente pendiente.</li><li><BookOpen size={19} aria-hidden="true"/>Hasta 30 XP provisionales por lección.</li><li><Check size={19} aria-hidden="true"/>Prácticas formativas, sin nota ni XP automático. No acredita dominio práctico.</li></ul><a href="#/splunk/recursos">Laboratorios y recursos<ArrowRight size={15} aria-hidden="true"/></a></article>
    </section> : <details className="region-original-index"><summary>Índice de lecciones y recursos de la región</summary><ol className="lesson-list">{lessons.map(lesson=><li key={lesson.id}>{isAvailable(store,lesson,catalog)?<a className="lesson-row" href={lessonUrl(lesson.id)}><BookOpen size={20} aria-hidden="true"/><span className="lesson-list-main"><strong>{lesson.title}</strong><span className="station-detail">{recordFor(store,lesson).theoryPassed?'Teoría aprobada · práctica no evaluada':recordFor(store,lesson).seen.length?'En curso':'Disponible'}</span></span><ArrowRight size={17} aria-hidden="true"/></a>:<div className="lesson-row locked"><LockKeyhole size={20} aria-hidden="true"/><span>{lesson.title} · Bloqueada</span></div>}</li>)}</ol><a className="button secondary" href={`#/splunk/recursos/${region.id}`}>Laboratorios y recursos<ArrowRight size={17} aria-hidden="true"/></a></details>}
  </div>;
}
