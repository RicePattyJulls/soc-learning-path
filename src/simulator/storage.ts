import type {Attempt,Evaluation,Platform,SimulatorStore} from './types';import {emptySimulator} from './engine';import {scenarios} from './scenarios';
export const simulatorKey=(platform:Platform)=>`soc-learning-path:simulator:${platform}:v1`;
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(s=>typeof s==='string'&&s.length<=1000)&&new Set(v).size===v.length;
const time=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
const text=(v:unknown)=>typeof v==='string'&&v.length<=10000;
export function validateSimulator(value:unknown,platform:Platform):SimulatorStore|null {
 if(!object(value)||value.schemaVersion!==1||value.platform!==platform||!object(value.attempts))return null;
 const used=new Set<string>();
 for(const [id,list] of Object.entries(value.attempts)){
  const scenario=scenarios.find(s=>s.id===id&&s.platform===platform);if(!scenario||!Array.isArray(list))return null;
  for(const a of list){
   if(!object(a)||typeof a.id!=='string'||!/^[-\w]{1,100}$/.test(a.id)||used.has(a.id)||a.scenarioId!==id||a.platform!==platform||typeof a.revision!=='string'||!a.revision.startsWith('sim-v1-')||!time(a.startedAt)||!time(a.updatedAt)||a.updatedAt<a.startedAt||!(a.completedAt===null||time(a.completedAt)&&a.completedAt>=a.startedAt))return null;used.add(a.id);
   if(!strings(a.competencies)||!a.competencies.length)return null;
   if(!strings(a.selected)||!strings(a.viewed)||!text(a.hypothesis)||!object(a.filters)||!['user','ip','host','code','start','end','search'].every(k=>text((a.filters as Record<string,unknown>)[k]))||typeof a.snapshot!=='string'||!Number.isFinite(Date.parse(a.snapshot)))return null;
   if(a.revision===scenario.revision&&![scenario.initialSnapshot,scenario.extendedSnapshot].includes(a.snapshot))return null;
   if(!object(a.triage)||!['category','entity','start','end'].every(k=>text((a.triage as Record<string,unknown>)[k]))||!object(a.decision)||!['verdict','priority','escalate','reason'].every(k=>text((a.decision as Record<string,unknown>)[k]))||!strings(a.decision.actions))return null;
   if(!['','incident','false_positive','inconclusive','signal'].includes(String(a.decision.verdict))||!['','low','medium','high'].includes(String(a.decision.priority))||!['','yes','no'].includes(String(a.decision.escalate))||a.decision.actions.some(id=>!scenario.actions.some(action=>action.id===id)))return null;
   if(!object(a.report)||!['summary','scope','indicators','impactText','recommendations','conclusion','impact'].every(k=>text((a.report as Record<string,unknown>)[k]))||!strings(a.report.evidenceIds)||!strings(a.report.indicatorValues)||a.report.evidenceIds.some(id=>!(a.selected as string[]).includes(id))||!['','unknown','legitimate','unauthorized_access','exfiltration'].includes(String(a.report.impact)))return null;
   if(!Array.isArray(a.correlations)||a.correlations.some(c=>!object(c)||!text(c.id)||!scenario.claims.some(cl=>cl.id===c.claimId)||!['supports','limits','contradicts'].includes(String(c.stance))||!strings(c.eventIds)||!c.eventIds.length||c.eventIds.some(id=>!(a.selected as string[]).includes(id))||!text(c.reason)))return null;
   if(!Array.isArray(a.journal)||a.journal.length>1001||a.journal.some(j=>!object(j)||!time(j.at)||!text(j.action)||!text(j.detail)))return null;
   if(a.completedAt!==null){if(!validEvaluation(a.evaluation))return null;}else if(a.evaluation!==undefined)return null;
  }
 }
 return structuredClone(value) as unknown as SimulatorStore;
}
function validEvaluation(v:unknown):v is Evaluation {
 if(!object(v)||!Number.isInteger(v.score)||Number(v.score)<0||Number(v.score)>100||v.passed!==(Number(v.score)>=80)||v.humanReview!=='pending'||!time(v.evaluatedAt)||typeof v.rubricVersion!=='string'||!Array.isArray(v.dimensions)||v.dimensions.length!==5||!Array.isArray(v.penalties)||!strings(v.omitted)||!text(v.explanation))return false;
 const max=[20,25,20,20,15];
 if(v.dimensions.some((d,i)=>!object(d)||typeof d.id!=='string'||typeof d.label!=='string'||d.max!==max[i]||!Number.isInteger(d.points)||Number(d.points)<0||Number(d.points)>max[i]||!Array.isArray(d.feedback)||d.feedback.some(x=>!text(x))))return false;
 if(v.penalties.some(p=>!object(p)||!Number.isInteger(p.points)||Number(p.points)<0||!text(p.reason)))return false;
 return v.dimensions.reduce((n,d)=>n+d.points,0)-v.penalties.reduce((n,p)=>n+p.points,0)===v.score;
}
export function loadSimulator(storage:Pick<Storage,'getItem'>,platform:Platform){
 try{const raw=storage.getItem(simulatorKey(platform));if(raw===null)return {store:emptySimulator(platform),blocked:false,warning:''};const store=validateSimulator(JSON.parse(raw),platform);if(!store)throw Error('invalid');return {store,blocked:false,warning:''};}
 catch{return {store:emptySimulator(platform),blocked:true,warning:'El guardado del simulador no se puede interpretar. Se conserva sin sobrescribir. Puedes investigar en memoria y exportar esta sesión.'};}
}
// Finished attempts are immutable. Drafts use the latest timestamp; the hook
// announces storage changes. Cross-tab draft editing is not a collaborative editor.
export function mergeSimulator(a:SimulatorStore,b:SimulatorStore):SimulatorStore {
 if(a.platform!==b.platform)throw Error('No se mezclan plataformas');const result=structuredClone(a);
 for(const [scenarioId,list] of Object.entries(b.attempts)){
  result.attempts[scenarioId]||=[];
  for(const incoming of list){const index=result.attempts[scenarioId].findIndex(v=>v.id===incoming.id);if(index<0){result.attempts[scenarioId].push(structuredClone(incoming));continue;}
   const old=result.attempts[scenarioId][index];if(old.completedAt!==null)continue;
   if(incoming.completedAt!==null||incoming.updatedAt>old.updatedAt)result.attempts[scenarioId][index]=structuredClone(incoming);
  }
 }
 return result;
}
export function saveSimulator(storage:Pick<Storage,'getItem'|'setItem'>,store:SimulatorStore){
 const current=loadSimulator(storage,store.platform);if(current.blocked)return current;
 const merged=mergeSimulator(current.store,store);if(!validateSimulator(merged,store.platform))throw Error('Sesión no válida');
 storage.setItem(simulatorKey(store.platform),JSON.stringify(merged));return {store:merged,blocked:false,warning:''};
}
export const activeAttempt=(store:SimulatorStore,id:string,revision:string):Attempt|undefined=>store.attempts[id]?.findLast(a=>a.completedAt===null&&a.revision===revision);
