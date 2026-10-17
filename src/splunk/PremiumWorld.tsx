import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Anchor, BookOpen, Check, ChevronDown, LockKeyhole, Play, RadioTower, Search } from 'lucide-react';
import { PremiumLandscape } from '../components/adventure/PremiumLandscape';
import { PilotBridges } from '../components/adventure/PilotLandscape';
import { LandscapeLandmark } from '../components/adventure/LandscapeLandmark';
import { Landscape, Treasure } from '../components/adventure/Artwork';
import { originalMapBridges } from '../lib/original-map-geometry';
import { pilotLandscape } from '../lib/pilot-landscape';
import { mapLayout, routeSegment } from '../lib/adventure';
import { animatePresentation, rememberMapPosition } from '../lib/presentation';
import { catalog, lessonUrl, regionUrl } from './data';
import { isAvailable, recordFor } from './progress';
import type { SplunkRegion, SplunkStore } from './types';
import { splunkWorlds } from './world-model';
import { useAdventureLayout } from '../components/adventure/useAdventureLayout';

const icons={harbor:Anchor,river:RadioTower,forest:Search};
type WorldProps = {store:SplunkStore;region?:SplunkRegion;children?:ReactNode};
export default function PremiumWorld(props:WorldProps) {
  // Static HTML remains inspectable without browser globals. Client measurement
  // is exclusively the unchanged SC-200 hook, mounted in its own component.
  if(typeof window==='undefined')return <SplunkWorldPresentation {...props} layoutState={{layout:mapLayout(props.region?.lessonIds.length||catalog.regions.length,false,false,!props.region),compact:false,scene:{current:null},list:{current:null}}}/>;
  return <MeasuredPremiumWorld {...props}/>;
}
function MeasuredPremiumWorld(props:WorldProps) {
  const count=props.region?.lessonIds.length || catalog.regions.length;
  const layoutState=useAdventureLayout(count,!props.region);
  return <SplunkWorldPresentation {...props} layoutState={layoutState}/>;
}
// Presentation accepts geometry only; the client wrapper owns DOM measurement.
export function SplunkWorldPresentation({store,region,children,layoutState}:WorldProps & {layoutState:ReturnType<typeof useAdventureLayout>}) {
  const atlas=!region;
  const lessons=catalog.lessons.filter(l=>region?.lessonIds.includes(l.id));
  const stations=useMemo(()=>region?lessons.map(l=>{
    const record=recordFor(store,l),available=isAvailable(store,l,catalog);
    return {id:l.id,title:l.title,theme:region.theme,href:available?lessonUrl(l.id):undefined,state:!available?'locked':record.theoryPassed?'passed':record.seen.length?'progress':'available',detail:`${record.seen.length}/${l.stepIds.length} pasos · teoría ${record.theoryPassed?'aprobada':'pendiente'}`,requirement:l.prerequisites.join(', ')};
  }):catalog.regions.map(r=>{
    const items=catalog.lessons.filter(l=>r.lessonIds.includes(l.id));
    const done=items.filter(l=>recordFor(store,l).theoryPassed).length;
    return {id:r.id,title:r.title,theme:r.theme,href:regionUrl(r.id),state:done===items.length?'passed':items.some(l=>isAvailable(store,l,catalog))?'available':'locked',detail:`${done}/${items.length} teorías · ${items.length} lecciones`,requirement:'Explora la región para consultar sus requisitos.'};
  }),[store,region]);
  const {scene,layout,compact,list}=layoutState;
  const visual=splunkWorlds[region?.theme||'harbor'];
  const landscape=useMemo(()=>pilotLandscape(layout,visual),[layout,visual]);
  const bridges=useMemo(()=>atlas?originalMapBridges(layout):landscape.bridges,[atlas,layout,landscape]);
  const [inspected,setInspected]=useState<string|null>(null),[announcement,setAnnouncement]=useState('');
  const previous=useRef(new Map(stations.map(s=>[s.id,s.state])));
  useEffect(()=>{
    const node=new URLSearchParams(location.hash.split('?')[1]||'').get('nodo');
    if(!node)return;
    const animation=animatePresentation(document.getElementById('sp-node-'+node)?.querySelector('.sp-world-platform')||null,[{opacity:.65,transform:'scale(.95)'},{opacity:1,transform:'scale(1)'}],'region');
    return()=>animation?.cancel();
  },[]);
  useEffect(()=>{
    const changed=stations.filter(s=>previous.current.has(s.id)&&previous.current.get(s.id)!==s.state);
    previous.current=new Map(stations.map(s=>[s.id,s.state]));
    if(!changed.length)return;
    setAnnouncement(changed.map(s=>`${s.title}: ${s.state==='locked'?'bloqueada':s.state==='passed'?'teoría aprobada, práctica no evaluada':'disponible'}.`).join(' '));
    const animations=changed.map(s=>animatePresentation(document.getElementById('sp-node-'+s.id)?.querySelector('.sp-world-platform')||null,[{opacity:.6,transform:'scale(.95)'},{opacity:1,transform:'scale(1)'}],'region'));
    return()=>animations.forEach(a=>a?.cancel());
  },[stations]);
  // Pointer intent is presentation-only; never selector preferences or learning.
  const pointer=()=>{document.documentElement.dataset.presentationInput='pointer';};
  const keyboard=()=>{document.documentElement.dataset.presentationInput='keyboard';};
  const complete=region?store.regionAwards.includes(region.id):catalog.regions.every(r=>store.regionAwards.includes(r.id));
  const links=[...layout.points,layout.chest];
  return <section className={`adventure-map sp-world-map ${atlas?'world-atlas sp-world-atlas':'region-landscape premium-region'} sp-theme-${region?.theme||'harbor'}`} data-premium-world={region?.id||'atlas'} data-scene={region?.theme||'harbor'} aria-label={region?`Mapa de lecciones: ${region.title}`:'Atlas de regiones Splunk'}>
    <div ref={scene} className="adventure-scene sp-world-scene" style={{aspectRatio:`${layout.width}/${layout.height}`}} data-map-width={layout.width} data-map-height={layout.height} onPointerDown={pointer} onKeyDown={keyboard}>
      {atlas?<Landscape layout={layout} theme="valley" atlas/>:<PremiumLandscape layout={layout} landscape={landscape} visual={visual}/>}
      <svg className="adventure-road" viewBox={`0 0 ${layout.width} ${layout.height}`} width={layout.width} height={layout.height} aria-hidden="true" focusable="false">
        {links.slice(1).map((b,i)=>{const d=routeSegment(links[i],b),done=stations[i]?.state==='passed'&&(i===stations.length-1?complete:stations[i+1]?.state==='passed'),locked=stations[i]?.state==='locked'||stations[i+1]?.state==='locked';return <g className="road-segment" key={i} data-route-state={done?'completed':locked?'locked':'available'}><path d={d} fill="none" stroke="#7e956b" strokeWidth={compact?26:40} opacity=".45" transform="translate(0 5)"/><path className="map-path" d={d} fill="none" stroke="#fff9df" strokeWidth={compact?24:37}/><path d={d} fill="none" stroke="#dac29a" strokeWidth={compact?16:27}/><path className={done?'map-path-completed':'map-path-center'} d={d} fill="none" stroke={done?'#359a73':'#fff8de'} strokeWidth={compact?3:4} strokeDasharray="6 12" strokeLinecap="round"/></g>;})}
        <PilotBridges bridges={bridges}/>
        {region?.theme==='harbor'?layout.points.filter((_,i)=>i%2===0).map((p,i)=><g key={i} data-splunk-scenery="harbor" transform={`translate(${p.x+90} ${p.y+90}) scale(.65)`}><path d="M-35 34h106l-24 28h-60Z" fill="#244d69"/><path d="M16-46v82m3-79 43 67H19Z" fill="#fff0cd" stroke="#244d69" strokeWidth="3"/><path d="M-33 93h108m-87-5V51m24 37V51m24 37V51m24 37V51" stroke="#8c7654" strokeWidth="8"/></g>):null}
        {region?.theme==='river'?<g data-splunk-scenery="telemetry" transform={`translate(${layout.width*.14} ${layout.height-170}) scale(.6)`}><LandscapeLandmark kind="beacon" accent="#ffc45f"/></g>:null}
      </svg>
      <div className="map-overlay">{children}</div>
      <ol ref={list} className="map-stations" aria-label={region?`Lecciones de ${region.title}`:'Atlas de regiones Splunk'}>{stations.map((station,i)=>{
        const point=layout.points[i],Icon=atlas?icons[station.theme as keyof typeof icons]||BookOpen:BookOpen;
        const stateText=station.state==='locked'?'Bloqueada':station.state==='passed'?'Teoría aprobada · piloto':station.state==='progress'?'En curso':'Disponible';
        return <li key={station.id} data-region={atlas?station.id:undefined} data-station={station.id} data-state={station.state} className={`${atlas?'sp-region-card':'sp-node'} ${station.state==='locked'?'locked':'available'} ${station.state==='passed'?'passed':''} map-station sp-world-station`} style={{left:`${point.x/layout.width*100}%`,top:`${point.y/layout.height*100}%`,'--station-color':`var(--station-${i%6+1})`} as CSSProperties}>
          <div className="sp-world-station-body">
            <button id={`sp-node-${station.id}`} type="button" className="station-action sp-world-control" data-world-control="true" aria-label={`${station.id}: ${station.title}. ${atlas?'Explorar región. ':''}${stateText}`} aria-describedby={`sp-label-${station.id}`} aria-expanded={!station.href?inspected===station.id:undefined} aria-controls={!station.href?`sp-requires-${station.id}`:undefined} onClick={event=>{
              if(station.href){rememberMapPosition(station.id,event);location.hash=station.href;}
              else setInspected(old=>old===station.id?null:station.id);
            }} onKeyDown={event=>{keyboard();if(event.key==='Escape')setInspected(null);}}>
              <span className="station-platform sp-world-platform"><span className="station-number">{i+1}</span><span className="station-glyph"><Icon size={compact?28:36} strokeWidth={1.8} aria-hidden="true"/></span><span className="station-badge">{station.state==='locked'?<LockKeyhole size={14} aria-hidden="true"/>:station.state==='passed'?<Check size={16} aria-hidden="true"/>:<Play size={13} fill="currentColor" aria-hidden="true"/>}</span></span>
              <span className="station-plaque" id={`sp-label-${station.id}`}><strong>{station.title}</strong><span className="station-detail">{station.detail}</span><span className="station-footer"><span className="station-state">{stateText}</span><span className="station-xp">{atlas?'Bonus provisional de región':'Hasta 30 XP provisionales'}</span></span>{!station.href?<><span className="sp-require-hint">Consultar requisitos <ChevronDown size={12} aria-hidden="true"/></span><span className="sp-requirements" id={`sp-requires-${station.id}`} hidden={inspected!==station.id}>Estudia y aprueba teoría: {station.requirement}. SC-200 no interviene.</span></>:null}</span>
            </button>
          </div>
        </li>;
      })}</ol>
      <a className={`map-treasure ${complete?'earned':''}`} href="#/splunk/progreso" style={{left:`${layout.chest.x/layout.width*100}%`,top:`${layout.chest.y/layout.height*100}%`}} aria-label={complete?'Bonus provisional registrado. Ver bitácora Splunk':'Ver bitácora y bonus provisionales pendientes de Splunk'}><div className="treasure-lift"><Treasure open={complete}/></div><span className="treasure-caption">{complete?'Travesía teórica registrada':'Cada etapa deja huella'}</span></a>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
  </section>;
}
