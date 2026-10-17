import { useEffect, useRef } from 'react';
import { animatePresentation } from './presentation';

// Presentation only: no timers, storage, content or learning actions.
export function usePresentationMotion(page: string, id: string, station?: string) {
  const pointer = useRef(false);
  useEffect(() => {
    const onPointer = () => { pointer.current = true; document.documentElement.dataset.presentationInput = 'pointer'; };
    const onKey = () => { pointer.current = false; document.documentElement.dataset.presentationInput = 'keyboard'; };
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('pointerdown', onPointer); window.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => {
    if(!pointer.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let observer:MutationObserver|undefined,frame=0,animation:Animation|null=null;
    const arrive=()=>{
      const root=document.getElementById('main-content');
      const target=station?Array.from(root?.querySelectorAll<HTMLElement>('[data-station]')||[]).find(n=>n.dataset.station===station)?.querySelector('.station-plaque'):
        root?.querySelector(page==='leccion'?'.activity-surface,.source-pane':page==='ruta'||page==='capitulo'?'.region-welcome':'.page-heading,.review-empty');
      if(!target)return false;
      observer?.disconnect();
      frame=requestAnimationFrame(()=>{animation=animatePresentation(target,station?[{opacity:.65,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}]:[{opacity:.78,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],'region');});
      return true;
    };
    if(!arrive()){
      observer=new MutationObserver(arrive);
      const root=document.getElementById('main-content');
      if(root)observer.observe(root,{childList:true,subtree:true});
    }
    return()=>{observer?.disconnect();cancelAnimationFrame(frame);animation?.cancel();};
  }, [page, id, station]);
}
