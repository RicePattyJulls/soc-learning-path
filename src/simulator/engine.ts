import type {Attempt,SimulatorStore,Scenario,SimEvent,Filters,Triage,Decision,Report,Correlation,Evaluation} from './types';
import {emptyFilters,utc,submissionIssues} from './investigation';
export const emptySimulator=(platform:SimulatorStore['platform']):SimulatorStore=>({schemaVersion:1,platform,attempts:{}});
export function startAttempt(store:SimulatorStore,scenario:Scenario,id:string,now:number){
 if(store.platform!==scenario.platform||!/^[-\w]{1,100}$/.test(id)||Object.values(store.attempts).flat().some(a=>a.id===id)||store.attempts[scenario.id]?.some(a=>a.completedAt===null&&a.revision===scenario.revision))return store;
 const attempt:Attempt={id,scenarioId:scenario.id,revision:scenario.revision,platform:scenario.platform,competencies:[...scenario.competencies],startedAt:now,updatedAt:now,completedAt:null,viewed:[],selected:[],hypothesis:'',correlations:[],triage:{category:'',entity:'',start:'',end:''},decision:{verdict:'',priority:'',escalate:'',reason:'',actions:[]},report:{summary:'',scope:'',indicators:'',impactText:'',recommendations:'',conclusion:'',evidenceIds:[],indicatorValues:[],impact:''},filters:emptyFilters(),snapshot:scenario.initialSnapshot,journal:[{at:now,action:'start',detail:scenario.alert.id}]};
 return {...store,attempts:{...store.attempts,[scenario.id]:[...(store.attempts[scenario.id]||[]),attempt]}};
}
export type DraftAction={type:'view';id:string}|{type:'select';id:string}|{type:'filters';value:Filters}|{type:'hypothesis';value:string}|{type:'triage';value:Triage}|{type:'decision';value:Decision}|{type:'report';value:Report}|{type:'correlate';value:Correlation}|{type:'remove-correlation';id:string}|{type:'extend-snapshot'};
export function updateAttempt(store:SimulatorStore,scenario:Scenario,events:readonly SimEvent[],id:string,action:DraftAction,now:number){
 const old=store.attempts[scenario.id]?.find(a=>a.id===id);
 if(!old||old.completedAt!==null||old.revision!==scenario.revision||store.platform!==scenario.platform)return store;
 const next=structuredClone(old),available=new Set(events.filter(e=>utc(e.availableAt)<utc(next.snapshot)).map(e=>e.id));
 let detail='';
 switch(action.type){
  case 'view':if(!available.has(action.id)||next.viewed.includes(action.id))return store;next.viewed.push(action.id);detail=action.id;break;
  case 'select':if(!available.has(action.id))return store;next.selected=next.selected.includes(action.id)?next.selected.filter(e=>e!==action.id):[...next.selected,action.id];next.report.evidenceIds=next.report.evidenceIds.filter(e=>next.selected.includes(e));next.correlations=next.correlations.map(c=>({...c,eventIds:c.eventIds.filter(e=>next.selected.includes(e))})).filter(c=>c.eventIds.length);detail=action.id;break;
  case 'filters':next.filters=Object.fromEntries(Object.entries(action.value).map(([key,value])=>[key,value.slice(0,1000)])) as unknown as Filters;detail=JSON.stringify(action.value);break;
  case 'hypothesis':next.hypothesis=action.value.slice(0,5000);break;
  case 'triage':if(action.value.category&&!scenario.categories.includes(action.value.category))return store;next.triage=structuredClone(action.value);next.triage.entity=next.triage.entity.slice(0,1000);break;
  case 'decision':if(action.value.actions.some(a=>!scenario.actions.some(s=>s.id===a)))return store;next.decision=structuredClone(action.value);next.decision.reason=next.decision.reason.slice(0,10000);break;
  case 'report':if(action.value.evidenceIds.some(e=>!next.selected.includes(e)))return store;next.report=structuredClone(action.value);for(const key of ['summary','scope','indicators','impactText','recommendations','conclusion'] as const)next.report[key]=next.report[key].slice(0,10000);break;
  case 'correlate':if(!scenario.claims.some(c=>c.id===action.value.claimId)||!action.value.reason.trim()||!action.value.eventIds.length||new Set(action.value.eventIds).size!==action.value.eventIds.length||action.value.eventIds.some(e=>!next.selected.includes(e))||next.correlations.some(c=>c.id===action.value.id))return store;next.correlations.push({...structuredClone(action.value),reason:action.value.reason.slice(0,10000)});detail=action.value.claimId;break;
  case 'remove-correlation':next.correlations=next.correlations.filter(c=>c.id!==action.id);break;
  case 'extend-snapshot':if(!scenario.extendedSnapshot||next.snapshot===scenario.extendedSnapshot)return store;next.snapshot=scenario.extendedSnapshot;detail=next.snapshot;break;
 }
 next.updatedAt=now;next.journal.push({at:now,action:action.type,detail});next.journal=next.journal.slice(-1000);
 return {...store,attempts:{...store.attempts,[scenario.id]:store.attempts[scenario.id].map(a=>a.id===id?next:a)}};
}
export function finishAttempt(store:SimulatorStore,scenario:Scenario,id:string,evaluation:Evaluation,now:number){
 const old=store.attempts[scenario.id]?.find(a=>a.id===id);if(!old||old.completedAt!==null||old.revision!==scenario.revision||store.platform!==scenario.platform||submissionIssues(old,scenario).length)return store;
 const attempt={...structuredClone(old),updatedAt:now,completedAt:now,evaluation:structuredClone(evaluation),journal:[...old.journal,{at:now,action:'submit',detail:'Evaluación estructurada de entrenamiento'}]};
 return {...store,attempts:{...store.attempts,[scenario.id]:store.attempts[scenario.id].map(a=>a.id===id?attempt:a)}};
}
