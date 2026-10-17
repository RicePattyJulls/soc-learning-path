import {useCallback,useEffect,useRef,useState} from 'react';
import type {Platform,SimulatorStore,Scenario,SimEvent,Evaluation} from './types';
import {loadSimulator,saveSimulator,simulatorKey,validateSimulator} from './storage';import {startAttempt,updateAttempt,finishAttempt,type DraftAction} from './engine';
export function useSimulator(platform:Platform){
 const [state,setState]=useState(()=>loadSimulator(localStorage,platform));const current=useRef(state);current.current=state;
 const commit=useCallback((transform:(store:SimulatorStore)=>SimulatorStore)=>{
  const before=current.current,next=transform(before.store);if(next===before.store)return;
  let result={...before,store:next};if(!before.blocked){try{result=saveSimulator(localStorage,next);}catch{result={store:next,blocked:true,warning:'No se pudo guardar el simulador (cuota o acceso). La sesión sigue en memoria; expórtala para conservarla.'};}}
  current.current=result;setState(result);
 },[]);
 useEffect(()=>{const listener=(event:StorageEvent)=>{if(event.key!==simulatorKey(platform))return;const incoming=loadSimulator(localStorage,platform);if(current.current.blocked)return;
  if(incoming.blocked){setState(previous=>({...previous,blocked:true,warning:incoming.warning}));return;}if(JSON.stringify(incoming.store)!==JSON.stringify(current.current.store)){setState({store:incoming.store,blocked:false,warning:'El guardado cambió en otra pestaña. Se ha cargado la versión guardada; revisa el intento antes de continuar.'});}};window.addEventListener('storage',listener);return()=>window.removeEventListener('storage',listener);},[platform]);
 const start=(scenario:Scenario)=>commit(store=>startAttempt(store,scenario,crypto.randomUUID(),Date.now()));
 const update=(scenario:Scenario,events:readonly SimEvent[],id:string,action:DraftAction)=>commit(store=>updateAttempt(store,scenario,events,id,action,Date.now()));
 const finish=(scenario:Scenario,id:string,evaluation:Evaluation)=>commit(store=>finishAttempt(store,scenario,id,evaluation,Date.now()));
 const exportSession=()=>{const value=current.current.store;if(!validateSimulator(value,platform))return;const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`soc-simulator-${platform}-v1.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 return {...state,start,update,finish,exportSession};
}
