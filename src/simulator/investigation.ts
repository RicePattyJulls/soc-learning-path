import type {Attempt,Filters,SimEvent,Scenario} from './types';
export const emptyFilters=():Filters=>({user:'',ip:'',host:'',code:'',start:'',end:'',search:''});
export function utc(value:string){return value?Date.parse(value.endsWith('Z')?value:value+':00Z'):NaN;}
export function filterEvents(events:readonly SimEvent[],filters:Filters,snapshot:string):{events:SimEvent[];error?:string}{
 const start=filters.start?utc(filters.start):-Infinity,end=filters.end?utc(filters.end):Infinity;
 if(Number.isNaN(start)||Number.isNaN(end)||start>=end)return {events:[],error:'Rango UTC inválido: el inicio debe ser anterior al final. El final es exclusivo.'};
 const contains=(text:string,value:string)=>text.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase());
 return {events:events.filter(e=>utc(e.availableAt)<utc(snapshot)&&utc(e.time)>=start&&utc(e.time)<end&&['user','ip','host','code'].every(k=>contains(e[k as keyof SimEvent] as string,filters[k as keyof Filters]))&&contains([e.id,e.source,e.summary,...Object.values(e.fields)].join(' '),filters.search)).sort((a,b)=>utc(a.time)-utc(b.time)||a.id.localeCompare(b.id))};
}
export function submissionIssues(attempt:Attempt,scenario:Scenario){
 const issues:string[]=[];
 if(!attempt.triage.category||!attempt.triage.entity||!attempt.triage.start||!attempt.triage.end)issues.push('Completa categoría, entidad y ventana UTC del triage.');
 if(!Number.isFinite(utc(attempt.triage.start))||!Number.isFinite(utc(attempt.triage.end))||utc(attempt.triage.start)>=utc(attempt.triage.end))issues.push('Revisa la ventana UTC del triage.');
 if(!attempt.selected.length)issues.push('Selecciona al menos una evidencia.');
 if(!attempt.hypothesis.trim()||!attempt.correlations.length)issues.push('Formula una hipótesis y vincula al menos una afirmación a evidencias.');
 if(!attempt.decision.verdict||!attempt.decision.priority||!attempt.decision.escalate||!attempt.decision.reason.trim()||!attempt.decision.actions.length)issues.push('Completa decisión, prioridad, escalado, justificación y acciones propuestas.');
 for(const [key,label] of Object.entries({summary:'resumen',scope:'alcance',indicators:'indicadores',impactText:'impacto',recommendations:'acciones recomendadas',conclusion:'conclusión'}))if(!attempt.report[key as keyof typeof attempt.report]?.toString().trim())issues.push('Completa el campo de informe: '+label+'.');
 if(!attempt.report.impact||!attempt.report.evidenceIds.length)issues.push('Indica impacto y cita evidencias en el informe.');
 if(attempt.platform!==scenario.platform||attempt.revision!==scenario.revision)issues.push('La revisión no corresponde a este escenario. Conserva el historial e inicia un intento nuevo.');
 return issues;
}
