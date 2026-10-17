import { useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { fitMapLabels, mapLayout } from '../../lib/adventure';

const queries=['(max-width: 680px)','(max-width: 1100px)'];
const subscribe=(notify:()=>void)=>{const media=queries.map(q=>matchMedia(q));media.forEach(m=>m.addEventListener('change',notify));return()=>media.forEach(m=>m.removeEventListener('change',notify));};
const snapshot=()=>matchMedia(queries[0]).matches?'compact':matchMedia(queries[1]).matches?'medium':'wide';
export function useAdventureLayout(count: number, atlas: boolean) {
  const screen=useSyncExternalStore(subscribe,snapshot),compact=screen==='compact';
  const scene=useRef<HTMLDivElement>(null),list=useRef<HTMLOListElement>(null);
  const [measurement,setMeasurement]=useState<{key:string;width:number;heights:number[];overlayFloor:number}|null>(null);
  const sceneWidth=measurement?.key.startsWith(screen+':')?measurement.width:undefined;
  const base=useMemo(()=>mapLayout(count,compact,screen==='medium',atlas,sceneWidth),[count,screen,compact,atlas,sceneWidth]);
  useLayoutEffect(()=>{
    const measure=()=>{
      const width=scene.current?.getBoundingClientRect().width||0;
      const heights=Array.from(list.current?.querySelectorAll<HTMLElement>('.station-action')||[]).map(node=>Math.ceil(node.getBoundingClientRect().height));
      const sceneTop=scene.current?.getBoundingClientRect().top||0;
      const overlayBottom=scene.current?.querySelector('.map-overlay')?.getBoundingClientRect().bottom||sceneTop;
      const overlayFloor=Math.ceil(overlayBottom-sceneTop+85);
      const key=`${screen}:${width.toFixed(1)}:${overlayFloor}:${heights.join(',')}`;
      setMeasurement(old=>old?.key===key?old:{key,width,heights,overlayFloor});
    };
    measure();
    if(typeof ResizeObserver==='undefined')return;
    const observer=new ResizeObserver(measure);
    if(scene.current)observer.observe(scene.current);
    const overlay=scene.current?.querySelector('.map-overlay');
    if(overlay)observer.observe(overlay);
    list.current?.querySelectorAll('.station-action').forEach(node=>observer.observe(node));
    return()=>observer.disconnect();
  },[count,screen]);
  const layout=useMemo(()=>{
    if(!measurement||!measurement.key.startsWith(screen+':'))return base;
    const scale=measurement.width/base.width;
    if(!(scale>0))return base;
    if(compact){
      let cursor=measurement.overlayFloor/scale;
      const points=base.points.map((point,index)=>{
        const placed={...point,y:cursor};
        cursor+=(measurement.heights[index]+35)/scale;
        return placed;
      });
      const chest={...base.chest,y:cursor+105/scale};
      return {...base,points,chest,height:chest.y+120/scale};
    }
    const headroom=Math.max(0,measurement.overlayFloor/scale-Math.min(...base.points.map(point=>point.y)));
    const adjusted={...base,points:base.points.map(point=>({...point,y:point.y+headroom})),chest:{...base.chest,y:base.chest.y+headroom},height:base.height+headroom};
    return fitMapLabels(adjusted,measurement.heights,scale,compact?1:screen==='medium'?3:4);
  },[base,measurement,compact,screen]);
  return {layout,compact,scene,list};
}
