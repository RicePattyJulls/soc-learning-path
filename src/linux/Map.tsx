import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, Flag, LockKeyhole, Network, Play, X } from 'lucide-react';
import { PremiumLandscape } from '../components/adventure/PremiumLandscape';
import { PilotBridges } from '../components/adventure/PilotLandscape';
import { Robot, Treasure } from '../components/adventure/Artwork';
import { useAdventureLayout } from '../components/adventure/useAdventureLayout';
import { pilotLandscape } from '../lib/pilot-landscape';
import { regionVisuals } from '../lib/region-visuals';
import { mapLayout, routeSegment } from '../lib/adventure';
import { ProgressBar } from '../components/Primitives';
import { catalog, lessonById, lessonUrl, stageUrl } from './data';
import { available, passed, recordFor, statsFor, studied } from './progress';
import type { Lesson, Stage, Store } from './types';

const scenery = [0, 1, 3, 2, 5, 8, 11, 4];
type MapProps = { store: Store; stage?: Stage };
export default function LinuxMap(props: MapProps) {
  if (typeof window === 'undefined') return <MapPresentation {...props} geometry={{ layout: mapLayout(props.stage?.lessonIds.length ?? catalog.stages.length, false, false, !props.stage), compact: false, scene: { current: null }, list: { current: null } }}/>;
  return <MeasuredMap {...props}/>;
}
function MeasuredMap(props: MapProps) {
  const geometry = useAdventureLayout(props.stage?.lessonIds.length ?? catalog.stages.length, !props.stage);
  return <MapPresentation {...props} geometry={geometry}/>;
}
function MapPresentation({ store, stage, geometry }: MapProps & { geometry: ReturnType<typeof useAdventureLayout> }) {
  const items = stage ? stage.lessonIds.map(id => lessonById.get(id)!) : catalog.lessons;
  const stats = statsFor(store), done = items.filter(l => passed(recordFor(store, l), l)).length;
  const last = items.find(l => l.id === store.lastLesson?.id && available(store, l));
  const next = last && !passed(recordFor(store, last), last) ? last : items.find(l => available(store, l) && !passed(recordFor(store, l), l)) ?? items.find(l => available(store, l));
  const { layout, compact, scene, list } = geometry;
  const index = stage ? catalog.stages.findIndex(s => s.id === stage.id) : 0;
  const visual = regionVisuals[scenery[index % scenery.length]];
  const landscape = useMemo(() => pilotLandscape(layout, visual), [layout, visual]);
  const [locked, setLocked] = useState<Lesson | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { if (locked) dialog.current?.showModal(); }, [locked]);
  const stations = stage ? items.map(lesson => {
    const record = recordFor(store, lesson), open = available(store, lesson);
    return { id: lesson.id, title: lesson.title, href: open ? lessonUrl(lesson.id) : '',
      state: !open ? 'locked' : passed(record, lesson) ? 'passed' : record.seen.length ? 'progress' : 'available',
      detail: `${record.seen.length}/3 pasos estudiados`, lesson };
  }) : catalog.stages.map(s => {
    const lessons = s.lessonIds.map(id => lessonById.get(id)!);
    const completed = lessons.filter(l => passed(recordFor(store, l), l)).length;
    return { id: s.id, title: s.title, href: stageUrl(s.id), state: completed === lessons.length ? 'passed' : lessons.some(l => available(store, l)) ? 'available' : 'locked', detail: `${completed}/${lessons.length} lecciones · Explorar etapa`, lesson: undefined };
  });
  const currentStage = next?.stageId ?? catalog.stages[0].id;
  return <div className="rd-map-page">
    {stage ? <a className="back-link" href={`#/linux/ruta?nodo=${stage.id}`}><ArrowLeft size={17} aria-hidden="true"/>Volver al mundo Linux</a> : null}
    <div className="rd-page-title"><div><p>{stage ? `Etapa ${index + 1} de ${catalog.stages.length}` : 'Tu mundo Linux'}</p><h1>{stage?.title ?? 'Del kernel al sistema'}</h1><p>{stage ? `${items.length} lecciones para avanzar paso a paso` : 'De la shell al kernel: administración, seguridad, SOC y recuperación.'}</p></div><Network size={42} aria-hidden="true"/></div>
    <nav className="rd-map-nav" aria-label="Explorar etapas de Linux">
      <label><Compass size={19} aria-hidden="true"/><span>Explorar etapas</span><select value={stage?.id ?? ''} onChange={event => { if (event.target.value) location.hash = stageUrl(event.target.value); }}><option value="">Elige una etapa…</option>{catalog.stages.map((s, i) => <option key={s.id} value={s.id}>{i + 1}. {s.title}</option>)}</select></label>
      <div className="rd-stage-arrows">{stage && index > 0 ? <a href={stageUrl(catalog.stages[index - 1].id)} aria-label="Etapa anterior"><ArrowLeft size={17} aria-hidden="true"/>Anterior</a> : null}{stage ? <span>{index + 1} / {catalog.stages.length}</span> : <a href={stageUrl(currentStage)}>Mi posición<ArrowRight size={17} aria-hidden="true"/></a>}{stage && index < catalog.stages.length - 1 ? <a href={stageUrl(catalog.stages[index + 1].id)} aria-label="Etapa siguiente">Siguiente<ArrowRight size={17} aria-hidden="true"/></a> : null}</div>
      <ul className="map-legend"><li><Play size={13} aria-hidden="true"/>Disponible</li><li><LockKeyhole size={13} aria-hidden="true"/>Bloqueada</li><li><BookOpen size={13} aria-hidden="true"/>En curso</li><li><Check size={13} aria-hidden="true"/>Teoría aprobada</li></ul>
    </nav>
    <section className={`adventure-map rd-world ${stage ? 'rd-stage' : 'rd-atlas'}`} aria-label={stage ? `Mapa de la etapa ${index + 1}` : 'Mapa del mundo Linux'}>
      <div ref={scene} className="adventure-scene" style={{ aspectRatio: `${layout.width}/${layout.height}` }}>
        <PremiumLandscape layout={layout} landscape={landscape} visual={visual}/>
        <svg className="adventure-road" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" focusable="false">
          {[...layout.points, layout.chest].slice(1).map((point, i) => <g key={i}><path d={routeSegment(layout.points[i], point)} fill="none" stroke="#627d60" strokeWidth={compact ? 29 : 43} opacity=".35" transform="translate(0 5)"/><path d={routeSegment(layout.points[i], point)} fill="none" stroke="#fff9e3" strokeWidth={compact ? 25 : 37}/><path d={routeSegment(layout.points[i], point)} fill="none" stroke={stations[i].state === 'passed' ? '#459c79' : '#aab9a0'} strokeWidth={compact ? 17 : 27}/><path d={routeSegment(layout.points[i], point)} fill="none" stroke="#fff9e3" strokeWidth="4" strokeDasharray="3 12" strokeLinecap="round"/></g>)}
          <PilotBridges bridges={landscape.bridges}/>
        </svg>
        <div className="map-overlay">
          <div className="region-welcome"><Robot/><div><span className="map-eyebrow">Mundo Linux · SOC · Administración y seguridad</span><h2>{stage ? 'Sigue el recorrido' : catalog.stages.length > 1 ? 'Tu mundo Linux' : 'Tu primera etapa ya está lista'}</h2><p>{stage ? next ? 'Comprende el mecanismo, resuelve el caso y demuestra lo que aprendiste.' : 'Explora esta etapa y consulta los requisitos de cada lección.' : `${catalog.stages.length} etapas y ${catalog.lessons.length} lecciones para avanzar paso a paso, con evidencia.`}</p><a className="button primary" href={next ? lessonUrl(next.id) : stageUrl(catalog.stages.find(s => s.lessonIds.some(id => available(store, lessonById.get(id)!)))?.id ?? catalog.stages[0].id)}>{next ? last?.id === next.id ? 'Continuar mi lección' : 'Empezar a aprender' : 'Ir a la etapa disponible'}<ArrowRight size={17} aria-hidden="true"/></a></div></div>
          <div className="region-meter"><span><Flag size={17} aria-hidden="true"/>{stage ? 'Tu progreso en la etapa' : 'Tu progreso en Linux'}</span><div><ProgressBar value={done / items.length * 100} label="Lecciones de Linux con teoría aprobada"/><b>{Math.round(done / items.length * 100)}%</b></div><small>{done} de {items.length} teorías aprobadas{stage ? '' : ` · ${stats.xp} XP`}</small><small>Prácticas de análisis; laboratorios por ejecutar.</small></div>
        </div>
        <ol ref={list} className="map-stations" aria-label={stage ? 'Lecciones de la etapa' : 'Las etapas de Linux'}>{stations.map((station, i) => {
          const point = layout.points[i], Icon = stage ? BookOpen : Network;
          const state = station.state === 'locked' ? 'Bloqueada' : station.state === 'passed' ? 'Teoría aprobada' : station.state === 'progress' ? 'En curso' : 'Disponible';
          return <li key={station.id} className={`map-station rd-station ${station.state}`} data-station={station.id} data-state={station.state} style={{ left: `${point.x / layout.width * 100}%`, top: `${point.y / layout.height * 100}%`, '--station-color': station.state === 'locked' ? '#849d9e' : station.state === 'passed' ? '#26886e' : '#367d9c' } as CSSProperties}>
            <button id={`lnx-node-${station.id}`} className="station-action" aria-label={`${stage ? 'Lección' : 'Etapa'} ${i + 1}: ${station.title}. ${state}${!stage ? '. Explorar etapa' : ''}`} aria-haspopup={stage && !station.href ? 'dialog' : undefined} onClick={event => { if (station.href) location.hash = station.href; else if (station.lesson) { trigger.current = event.currentTarget; setLocked(station.lesson); } }}>
              <span className="station-platform"><span className="station-number">{i + 1}</span><span className="station-glyph"><Icon size={compact ? 29 : 36} aria-hidden="true"/></span><span className="station-badge">{station.state === 'locked' ? <LockKeyhole size={14} aria-hidden="true"/> : station.state === 'passed' ? <Check size={16} aria-hidden="true"/> : <Play size={13} aria-hidden="true"/>}</span></span>
              <span className="station-plaque"><strong>{station.title}</strong><span className="station-detail">{station.detail}</span><span className="station-footer"><span className="station-state">{state}</span><span className="station-xp">{stage ? 'Hasta 20 XP' : 'Ver etapa'}</span></span>{stage && !station.href ? <span className="rd-require-hint">Consultar requisitos</span> : null}</span>
            </button>
          </li>;
        })}</ol>
        <a className="map-treasure" href="#/linux/progreso" style={{ left: `${layout.chest.x / layout.width * 100}%`, top: `${layout.chest.y / layout.height * 100}%` }}><div className="treasure-lift"><Treasure open={items.every(l => passed(recordFor(store, l), l))}/></div><span className="treasure-caption">Cada lección cuenta · Mi progreso</span></a>
      </div>
    </section>
    {stage ? <details className="rd-index"><summary>Ver el índice de esta etapa</summary><ol>{items.map(l => <li key={l.id}>{available(store, l) ? <a href={lessonUrl(l.id)}>{l.title}</a> : <span>{l.title} · Bloqueada</span>}<small>{studied(recordFor(store, l), l) ? 'Estudio completado' : 'Estudio pendiente'}</small></li>)}</ol></details> : <section className="rd-intro-notes"><article><Network size={25} aria-hidden="true"/><h2>Entiende el recorrido</h2><p>De la plataforma y el arranque a la identidad, Active Directory, seguridad y recuperación, en una misma ruta.</p></article><article><BookOpen size={25} aria-hidden="true"/><h2>Aprende con evidencia</h2><p>Cada lección combina explicación, caso resuelto, práctica individual y dos preguntas razonadas.</p></article><article><Flag size={25} aria-hidden="true"/><h2>Avanza a tu ritmo</h2><p>Tu estudio y teoría se guardan en este navegador. Cinco XP por estudiar y quince al aprobar la teoría.</p></article></section>}
    {locked ? <dialog ref={dialog} className="rd-dialog" aria-labelledby="rd-require-title" onClose={() => { setLocked(null); trigger.current?.focus(); }}><button className="rd-close" aria-label="Cerrar requisitos" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true"/></button><LockKeyhole size={28} aria-hidden="true"/><h2 id="rd-require-title">Antes de {locked.title}</h2><p>Completa el estudio y aprueba la teoría de estas lecciones:</p><ul>{locked.prerequisites.map(id => <li key={id}><a href={lessonUrl(id)}>{lessonById.get(id)?.title ?? id}</a></li>)}</ul><button className="button secondary" onClick={() => dialog.current?.close()}>Volver al mapa</button></dialog> : null}
  </div>;
}
