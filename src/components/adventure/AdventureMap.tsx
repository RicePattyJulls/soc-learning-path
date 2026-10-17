import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, BookOpen, Check, LockKeyhole, Play, Star } from 'lucide-react';
import { mapStateText, routeSegment, type LandscapeTheme, type MapStation } from '../../lib/adventure';
import { ChapterIcon } from '../Primitives';
import { Landscape, Treasure } from './Artwork';
import { useAdventureLayout } from './useAdventureLayout';
import { PilotLandscape, PilotBridges } from './PilotLandscape';
import { pilotLandscape } from '../../lib/pilot-landscape';
import { originalMapBridges } from '../../lib/original-map-geometry';
import { PremiumLandscape } from './PremiumLandscape';
import type { RegionVisual } from '../../lib/region-visuals';
import { animatePresentation,focusMapStation,rememberMapPosition } from '../../lib/presentation';

export default function AdventureMap({ stations, theme='valley', label, kind='lessons', premium=false, visual, complete=false, lockedHint, requiredHref, requiredTitle, focusStation, children }: {
  stations: MapStation[]; theme?: LandscapeTheme; label: string; kind?: 'regions'|'lessons'; premium?: boolean; complete?: boolean;
  lockedHint?: string; requiredHref?: string; requiredTitle?: string; focusStation?: string; children?: React.ReactNode;
  visual?: RegionVisual;
}) {
  const {layout,compact,scene,list:stationList}=useAdventureLayout(stations.length,kind==='regions');
  const isPilot=premium&&(!visual||visual.id==='capitulo-1-licencia-y-onboarding');
  const pilot=useMemo(()=>premium?pilotLandscape(layout,isPilot?undefined:visual):null,[premium,layout,isPilot,visual]);
  const originalBridges=useMemo(()=>premium?[]:originalMapBridges(layout),[premium,layout]);
  const [notice,setNotice]=useState('');
  const [announcement,setAnnouncement]=useState('');
  const noticePanel=useRef<HTMLDivElement>(null),lockOrigin=useRef<HTMLButtonElement|null>(null);
  const previousStations=useRef(new Map(stations.map(station=>[station.id,station.state])));
  const dismissNotice=()=>{setNotice('');lockOrigin.current?.focus({preventScroll:true});};
  useEffect(()=>{
    if(!notice)return;
    noticePanel.current?.focus({preventScroll:true});
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();dismissNotice();}};
    window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);
  },[notice]);
  useEffect(()=>{
    const changed=stations.filter(station=>{
      const before=previousStations.current.get(station.id);
      return before&&before!==station.state&&(before==='locked'||station.state==='completed'||station.state==='mastered');
    });
    previousStations.current=new Map(stations.map(station=>[station.id,station.state]));
    if(!changed.length)return;
    setAnnouncement(changed.map(station=>`${station.title}: ${mapStateText[station.state]}.`).join(' '));
    const nodes=Array.from(stationList.current?.querySelectorAll<HTMLElement>('[data-station]')||[]);
    const animations=changed.map(station=>animatePresentation(nodes.find(n=>n.dataset.station===station.id)?.querySelector('.station-platform')||null,[{opacity:.55,transform:'scale(.94)'},{opacity:1,transform:'scale(1)'}],'region'));
    return()=>animations.forEach(animation=>animation?.cancel());
  },[stations,stationList]);
  const previousComplete=useRef(complete);
  useEffect(()=>{
    const earnedNow=complete&&!previousComplete.current;
    previousComplete.current=complete;
    if(!earnedNow)return;
    const treasure=scene.current?.querySelector<HTMLElement>('.treasure-lift');
    const animation=animatePresentation(treasure||null,[{transform:'translateY(4px) scale(.97)',opacity:.7},{transform:'translateY(0) scale(1)',opacity:1}],'region');
    return()=>animation?.cancel();
  },[complete]);
  useEffect(()=>{if(focusStation)focusMapStation(stationList.current,focusStation);},[focusStation,layout.height,stationList]);
  const links=[...layout.points,layout.chest];
  return <section className={`adventure-map ${kind==='regions'?'world-atlas':'region-landscape'} theme-${theme} ${premium?'premium-region':''} ${isPilot?'pilot-region':''}`} data-illustration={premium?isPilot?'premium-pilot':'premium-world':'original'} data-region-visual={visual?.id} aria-label={label} style={visual?{'--region-accent':visual.palette.accent,'--region-water':visual.palette.water} as CSSProperties:undefined}>
    <div ref={scene} className="adventure-scene" style={{aspectRatio:`${layout.width}/${layout.height}`}} data-map-width={layout.width} data-map-height={layout.height}>
      {pilot?isPilot?<PilotLandscape layout={layout} landscape={pilot}/>:<PremiumLandscape layout={layout} landscape={pilot} visual={visual!}/>:<Landscape layout={layout} theme={theme} atlas={kind==='regions'}/>}
      <svg className="adventure-road" viewBox={`0 0 ${layout.width} ${layout.height}`} width={layout.width} height={layout.height} aria-hidden="true" focusable="false">
        {links.slice(1).map((b,i)=>{const a=links[i],d=routeSegment(a,b),done=['completed','mastered'].includes(stations[i]?.state)&&(i===stations.length-1?complete:['completed','mastered'].includes(stations[i+1]?.state||'')),locked=stations[i]?.state==='locked'||stations[i+1]?.state==='locked';return <g className="road-segment" data-route-state={done?'completed':locked?'locked':'available'} key={i}><path d={d} fill="none" stroke="#7e956b" strokeWidth={compact?26:40} opacity=".45" transform="translate(0 5)"/><path className="map-path" d={d} fill="none" stroke="#fff9df" strokeWidth={compact?24:37}/><path d={d} fill="none" stroke="#dac29a" strokeWidth={compact?16:27}/><path className={done?'map-path-completed':'map-path-center'} d={d} fill="none" stroke={done?'#359a73':'#fff8de'} strokeWidth={compact?3:4} strokeDasharray="6 12" strokeLinecap="round"/></g>;})}
        {pilot?<PilotBridges bridges={pilot.bridges}/>:originalBridges.map((bridge,index)=>{
          const half=bridge.length/2;
          return <g key={index} className="map-bridge" transform={`translate(${bridge.x} ${bridge.y}) rotate(${bridge.angle})`} data-crossing-x={bridge.x} data-crossing-y={bridge.y}>
            <path d={`M${-half}-20H${half}V20H${-half}Z`} fill="#a88351" stroke="#665637" strokeWidth="2"/>
            {Array.from({length:Math.ceil(bridge.length/10)},(_,i)=>-half+5+i*10).map(x=><path key={x} d={`M${x}-18V18`} stroke="#e3c18b" strokeWidth="7"/>)}
            <path d={`M${-half-2}-27H${half+2}M${-half-2} 27H${half+2}`} stroke="#846036" strokeWidth="6"/>
            {[-half,0,half].map(x=><path key={x} d={`M${x}-31V-21M${x} 21V31`} stroke="#5f4d33" strokeWidth="7"/>)}
          </g>;
        })}
      </svg>
      <div className="map-overlay">{children}</div>
      <ol ref={stationList} className="map-stations" aria-label={kind==='regions'?'Regiones del recorrido':'Lecturas de esta región'}>
        {stations.map((station,index)=>{
          const point=layout.points[index],locked=station.state==='locked';
          const body=<><span className="station-platform"><span className="station-number">{index+1}</span><span className="station-glyph">{kind==='regions'?<ChapterIcon index={station.iconIndex} size={compact?29:38}/>:<BookOpen size={compact?28:36} strokeWidth={1.8} aria-hidden="true"/>}</span><span className="station-badge">{locked?<LockKeyhole size={14} aria-hidden="true"/>:station.state==='mastered'?<Star size={15} fill="currentColor" aria-hidden="true"/>:station.state==='completed'?<Check size={16} aria-hidden="true"/>:<Play size={13} fill="currentColor" aria-hidden="true"/>}</span></span><span className="station-plaque"><strong>{station.title}</strong><span className="station-detail">{station.detail}</span><span className="station-footer"><span className="station-state">{mapStateText[station.state]}</span><span className="station-xp">{station.reward}</span></span>{station.current?<span className="station-current">Estás aquí</span>:null}</span></>;
          return <li key={station.id} className={`map-station ${kind==='regions'?`stage ${locked?'locked':station.state==='completed'?'completed':'available'}`:''}`} style={{left:`${point.x/layout.width*100}%`,top:`${point.y/layout.height*100}%`,'--station-color':['var(--station-1)','var(--station-2)','var(--station-3)','var(--station-4)','var(--station-5)','var(--station-6)'][index%6]} as CSSProperties} data-station={station.id} data-state={station.state}>
            {station.href ? <a className="station-action" href={station.href} onClick={event=>rememberMapPosition(station.id,event)} aria-label={`${kind==='regions'?'Región':'Lectura'} ${index+1}: ${station.title}. ${mapStateText[station.state]}. ${station.detail}`} aria-current={station.current?'location':undefined}>{body}</a> : <button className="station-action" type="button" aria-label={`${station.title}. Bloqueada: consultar requisitos`} onClick={event=>{lockOrigin.current=event.currentTarget;setNotice(`${station.title}: ${lockedHint||'completa las regiones anteriores para desbloquear esta lectura.'}`);}}>{body}</button>}
          </li>;
        })}
      </ol>
      <a className={`map-treasure ${complete?'earned':''}`} style={{left:`${layout.chest.x/layout.width*100}%`,top:`${layout.chest.y/layout.height*100}%`}} href="#/progreso" aria-label={complete?(kind==='regions'?'Regiones completadas. Ver mis logros':'Etapa completada. Ver mis logros'):'Ver mis logros y recompensas pendientes'}><div className="treasure-lift"><Treasure open={complete}/></div><span className="treasure-caption">{complete?(kind==='regions'?'¡Regiones completadas!':'¡Etapa conquistada!'):'Cada etapa deja huella'}<ArrowRight size={13} aria-hidden="true"/></span></a>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    {notice?<div ref={noticePanel} className="map-lock-notice" role="status" tabIndex={-1} aria-label="Requisitos para continuar"><LockKeyhole size={20} aria-hidden="true"/><div><p>{notice}</p>{requiredHref?<a href={requiredHref}>Continuar en {requiredTitle}<ArrowRight size={16} aria-hidden="true"/></a>:null}</div><button type="button" className="button secondary" onClick={dismissNotice}>Entendido</button></div>:null}
  </section>;
}
