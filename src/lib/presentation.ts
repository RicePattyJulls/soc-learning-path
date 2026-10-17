// Presentation helpers never dispatch learning actions or persist state.
export function animatePresentation(element:Element|null,frames:Keyframe[],kind:'press'|'feedback'|'region'='feedback') {
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  if(!element?.animate||document.documentElement.dataset.presentationInput!=='pointer'||media.matches)return null;
  const tokens=getComputedStyle(document.documentElement);
  const duration=parseFloat(tokens.getPropertyValue(`--motion-${kind}`))||150;
  const animation=element.animate(frames,{duration,easing:tokens.getPropertyValue('--ease-out').trim()||'cubic-bezier(0.23, 1, 0.32, 1)'});
  const stop=()=>animation.cancel();
  const clean=()=>{media.removeEventListener('change',stop);window.removeEventListener('keydown',stop);};
  media.addEventListener('change',stop);window.addEventListener('keydown',stop,{once:true});
  animation.addEventListener('finish',clean,{once:true});animation.addEventListener('cancel',clean,{once:true});
  return animation;
}

export function focusLearningElement(element:HTMLElement|null) {
  if(!element)return;
  element.focus({preventScroll:true});
  const rect=element.getBoundingClientRect();
  const clearance=document.querySelector('.academy-lesson,.reader-page')?80:16;
  if(rect.top<clearance||rect.bottom>innerHeight-16)element.scrollIntoView({block:'start',behavior:'instant'});
}

export function focusMapStation(root:Element|null,id:string) {
  const node=Array.from(root?.querySelectorAll<HTMLElement>('[data-station]')||[]).find(n=>n.dataset.station===id);
  if(!node)return false;
  node.querySelector<HTMLElement>('a,button')?.focus({preventScroll:true});
  node.scrollIntoView({block:'center',behavior:'instant'});
  return true;
}

// Reuse the existing node URL parameter so browser Back and touch back gestures
// restore the same context as the explicit return link. No new progress store.
export function rememberMapPosition(id:string,event?:{button:number;ctrlKey:boolean;metaKey:boolean;shiftKey:boolean;altKey:boolean}) {
  if(event&&(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey))return;
  const [path,query='']=location.hash.split('?'),params=new URLSearchParams(query);
  params.set('nodo',id);
  history.replaceState(history.state,'',`${path}?${params}`);
}
