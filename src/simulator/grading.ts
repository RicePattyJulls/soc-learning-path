import type {Attempt,Scenario,SimEvent,Evaluation,ScoreDimension} from './types';
import {rubrics} from './rubrics';import {utc,submissionIssues} from './investigation';
export function gradeAttempt(attempt:Attempt,scenario:Scenario,events:readonly SimEvent[],now:number):Evaluation {
 const rubric=rubrics[scenario.id];if(!rubric||attempt.scenarioId!==scenario.id||attempt.platform!==scenario.platform||attempt.revision!==scenario.revision)throw Error('Escenario/revisión no evaluables');
 const available=events.filter(e=>utc(e.availableAt)<utc(attempt.snapshot));
 const selected=new Set(attempt.selected.filter(id=>available.some(e=>e.id===id)));
 const dimensions:ScoreDimension[]=[],penalties:Evaluation['penalties']=[],omitted:string[]=[];
 const add=(id:string,label:string,points:number,max:number,feedback:string[])=>dimensions.push({id,label,points:Math.max(0,Math.min(max,points)),max,feedback});
 const triageFeedback:string[]=[];let triage=0;
 if(attempt.triage.category===rubric.category)triage+=8;else triageFeedback.push('La categoría inicial no corresponde al tipo de señal.');
 if(attempt.triage.entity.trim().toLowerCase()===rubric.entity.toLowerCase())triage+=6;else triageFeedback.push('La entidad del triage no corresponde a la alerta.');
 if(utc(attempt.triage.start)<=utc(rubric.start)&&utc(attempt.triage.end)>=utc(rubric.end)&&utc(attempt.triage.end)-utc(attempt.triage.start)<=3600000)triage+=6;else triageFeedback.push('Acota una ventana UTC reproducible que cubra los hechos relevantes, de hasta una hora.');
 add('triage','Triage y clasificación inicial',triage,20,triageFeedback);
 let evidence=0;const evidenceFeedback:string[]=[];
 for(const group of rubric.evidence){const count=group.ids.filter(id=>selected.has(id)).length;const points=Math.floor(group.points*Math.min(1,count/group.minimum));evidence+=points;if(count<group.minimum){evidenceFeedback.push(group.why);omitted.push(...group.ids.filter(id=>!selected.has(id)));}}
 const relevant=new Set([...rubric.evidence.flatMap(g=>g.ids),...rubric.useful]);const noise=[...selected].filter(id=>!relevant.has(id));
 if(noise.length){evidence-=2*noise.length;evidenceFeedback.push(`Selección sin relación con la alerta: ${noise.join(', ')}. Seleccionar todo no sustituye la priorización.`);}
 add('evidence','Identificación de evidencias relevantes',evidence,25,evidenceFeedback);
 const valid=new Set<string>(),correlationFeedback:string[]=[];let invalid=0;
 for(const link of attempt.correlations){const rule=rubric.claims.find(r=>r.id===link.claimId&&r.stance===link.stance);const allowed=rule?.groups.flatMap(g=>g.ids)||[];
  const ok=rule&&link.reason.trim()&&link.eventIds.length&&link.eventIds.every(id=>selected.has(id)&&allowed.includes(id))&&rule.groups.every(g=>g.ids.filter(id=>link.eventIds.includes(id)).length>=g.minimum);
  if(ok)valid.add(link.claimId);else {invalid++;correlationFeedback.push(`La relación ${scenario.claims.find(c=>c.id===link.claimId)?.label||link.claimId} carece de soporte suficiente, tiene evidencia ajena o usa una postura incompatible.`);}
 }
 if(valid.size<2)correlationFeedback.push('Vincula al menos dos relaciones distintas, cada una con sus eventos concretos; abrir registros no puntúa.');
 add('reasoning','Correlación y razonamiento técnico',Math.min(20,valid.size*10)-invalid*5,20,correlationFeedback);
 const branch=rubric.decisions.find(d=>d.verdict===attempt.decision.verdict&&d.requiredClaims.every(id=>valid.has(id)));
 let decision=0;const decisionFeedback:string[]=[];
 if(branch)decision+=8;else decisionFeedback.push('La clasificación no está respaldada por las relaciones documentadas.');
 if(branch&&branch.priorities.includes(attempt.decision.priority as 'low'))decision+=4;else decisionFeedback.push('Revisa prioridad y alcance de la evidencia.');
 if(branch&&branch.escalate===attempt.decision.escalate)decision+=4;else decisionFeedback.push('El cierre/escalado no corresponde a la evidencia y la incertidumbre.');
 if(attempt.decision.actions.length&&attempt.decision.actions.every(id=>rubric.actions.includes(id)))decision+=4;else decisionFeedback.push('Propón acciones seguras y proporcionales al caso; no se ejecuta ninguna.');
 add('decision','Decisión, severidad y escalado',decision,20,decisionFeedback);
 let report=0;const reportFeedback=['Se evalúan completitud y trazabilidad estructuradas. La precisión del texto libre requiere revisión humana, sin nota semántica automática.'];
 const citations=attempt.report.evidenceIds;
 if(citations.length>=2&&citations.every(id=>selected.has(id)))report+=5;else reportFeedback.push('Cita al menos dos evidencias seleccionadas y verificables en el informe.');
 if(attempt.triage.entity.trim().toLowerCase()===rubric.entity.toLowerCase()&&utc(attempt.triage.start)<=utc(rubric.start)&&utc(attempt.triage.end)>=utc(rubric.end))report+=3;else reportFeedback.push('El alcance estructurado del informe hereda entidad/ventana del triage: revísalos.');
 const ips=new Set(available.filter(e=>selected.has(e.id)).map(e=>e.ip).filter(Boolean));
 if(attempt.report.indicatorValues.length&&attempt.report.indicatorValues.every(ip=>ips.has(ip)))report+=3;else reportFeedback.push('Los indicadores estructurados deben aparecer en eventos seleccionados.');
 if(branch&&branch.impact===attempt.report.impact)report+=2;else reportFeedback.push('El impacto declarado excede o contradice lo acreditado.');
 if(attempt.decision.actions.length&&attempt.decision.actions.every(id=>rubric.actions.includes(id)))report+=2;
 add('report','Calidad del informe: trazabilidad verificable',report,15,reportFeedback);
 let total=dimensions.reduce((n,d)=>n+d.points,0);
 const cap=(limit:number,reason:string)=>{if(total>limit){penalties.push({points:total-limit,reason});total=limit;}};
 if(attempt.report.impact==='exfiltration')cap(59,'Exfiltración afirmada sin eventos que la acrediten.');
 if(attempt.decision.verdict==='incident'&&!rubric.decisions.some(d=>d.verdict==='incident'))cap(59,'Se declara incidente confirmado donde las fuentes solo permiten sospecha o actividad legítima.');
 if(rubric.criticalEvidence.some(id=>!selected.has(id)))cap(79,'Falta una comprobación crítica: '+rubric.criticalEvidence.filter(id=>!selected.has(id)).join(', ')+'.');
 if(submissionIssues(attempt,scenario).length)cap(79,'El expediente está incompleto; completa los campos obligatorios antes de entregarlo.');
 return {score:total,passed:total>=80,dimensions,penalties,omitted:[...new Set(omitted)],explanation:rubric.explanation,humanReview:'pending',evaluatedAt:now,rubricVersion:rubric.version};
}
