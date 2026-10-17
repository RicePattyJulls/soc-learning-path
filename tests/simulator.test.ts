import {test} from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {scenarios,simulatorUrl} from '../src/simulator/scenarios';import {filterEvents,emptyFilters,submissionIssues} from '../src/simulator/investigation';import {startAttempt,emptySimulator,updateAttempt,finishAttempt} from '../src/simulator/engine';import {gradeAttempt} from '../src/simulator/grading';import {rubrics} from '../src/simulator/rubrics';import {loadSimulator,saveSimulator,validateSimulator,simulatorKey,mergeSimulator} from '../src/simulator/storage';
import {CaseWorkspace,EvaluationPanel} from '../src/simulator/SimulatorApp';import {goodInvestigation,eventsFor} from './simulator-fixtures';
import {buildSimulator,parseCsv} from '../scripts/prepare-simulator.mjs';import {checkSimulatorIntegrity} from '../scripts/simulator-integrity.mjs';import {simulatorChange} from '../scripts/simulator-reconciliation.mjs';import {sha256} from '../scripts/splunk-integrity.mjs';
import type {Platform,Attempt} from '../src/simulator/types';

test('Simulator: cuatro escenarios completos, dos plataformas, N1/N2 y 50 eventos sintéticos reproducibles',async()=>{
 assert.equal(scenarios.length,4);assert.deepEqual(scenarios.map(s=>[s.platform,s.level]),[['microsoft','N1'],['microsoft','N1'],['splunk','N1'],['splunk','N2']]);
 assert.equal(scenarios.flatMap(eventsFor).length,50);
 const built=await buildSimulator();assert.deepEqual(built,await buildSimulator());assert.equal(built.outputs.length,5);
 for(const [file,text] of built.outputs)assert.equal(await readFile(new URL('../'+file,import.meta.url),'utf8'),text);
 for(const s of scenarios){assert.ok(s.objectives.length>=3);assert.ok(s.competencies.length);assert.equal(sha256(await readFile(new URL('../public/'+s.dataset.file,import.meta.url))),s.dataset.sha256);assert.ok(simulatorUrl(s.platform,s.id).includes(s.id));}
 assert.deepEqual(parseCsv('a,b\r\n"x,y","comilla ""q"""\r\n'),[{a:'x,y',b:'comilla "q"'}]);assert.throws(()=>parseCsv('a,b\n"x'),/no terminado/);
});
test('Simulator: fuentes CSV conservadas, mapeo explícito y sin etiquetas docentes antes de evaluar',async()=>{
 for(const s of scenarios){const raw=await readFile(new URL('../public/'+s.dataset.file,import.meta.url),'utf8');assert.ok(!raw.includes('fixture_label'));assert.ok(!raw.includes('benign_documented'));assert.ok(!raw.includes('suspicious_unconfirmed'));for(const source of s.sources)assert.equal(sha256(await readFile(new URL('../'+source.file,import.meta.url))),source.sha256);}
 const n2=eventsFor(scenarios[3]);assert.equal(n2.find(e=>e.id==='A021')!.availableAt,'2026-10-15T09:24:00Z');assert.equal(n2.find(e=>e.id==='A021')!.time,'2026-10-15T09:04:00Z');assert.ok(n2.find(e=>e.id==='C003')!.summary.includes('NAT'));
 const ms=eventsFor(scenarios[1]);assert.notEqual(ms.find(e=>e.id==='D201')!.fields.SHA256,ms.find(e=>e.id==='D203')!.fields.ObservedSHA256,'Hash del proceso distinto del hash del script');
});
test('Simulator: filtros de usuario/IP/equipo/código/UTC y corte de ingesta, no intérprete KQL/SPL',()=>{
 const s=scenarios[3],events=eventsFor(s),initial=filterEvents(events,emptyFilters(),s.initialSnapshot).events;
 assert.ok(!initial.some(e=>e.id==='A021'));assert.ok(filterEvents(events,emptyFilters(),s.extendedSnapshot!).events.some(e=>e.id==='A021'));
 const found=filterEvents(events,{...emptyFilters(),user:'bob',ip:'198.51.100.23',host:'app01',code:'4624',start:'2026-10-15T09:00:00Z',end:'2026-10-15T09:15:00Z'},s.initialSnapshot);assert.deepEqual(found.events.map(e=>e.id),['A007']);
 const sameTime=filterEvents(events,{...emptyFilters(),start:'2026-10-15T09:04:00Z',end:'2026-10-15T09:04:01Z'},s.extendedSnapshot!).events;assert.deepEqual(sameTime.map(e=>e.id),['A004','A021']);
 assert.ok(filterEvents(events,{...emptyFilters(),start:'2026-10-16T10:00:00Z',end:'2026-10-15T10:00:00Z'},s.initialSnapshot).error);
 assert.equal(filterEvents(events,{...emptyFilters(),search:'index=* | stats count'},s.initialSnapshot).events.length,0);
});
test('Simulator: los cuatro recorridos investigan, relacionan, informan y alcanzan 100 sin IA ni XP',()=>{
 for(const s of scenarios){const {store,attempt,events,clock}=goodInvestigation(s);assert.deepEqual(submissionIssues(attempt,s),[]);assert.deepEqual(attempt.competencies,s.competencies);const grade=gradeAttempt(attempt,s,events,100);assert.equal(grade.score,100,s.id);assert.equal(grade.passed,true);assert.deepEqual(grade.dimensions.map(d=>d.max),[20,25,20,20,15]);assert.equal(grade.humanReview,'pending');
  const done=finishAttempt(store,s,attempt.id,grade,clock+1),record=done.attempts[s.id][0];assert.ok(record.completedAt);assert.equal(record.evaluation!.score,100);assert.ok(!JSON.stringify(done).includes('XP'));assert.ok(validateSimulator(done,s.platform));
 }
});
test('Simulator: abrir todos los eventos no concede puntos; ruido y relaciones sin soporte reducen nota',()=>{
 for(const s of scenarios){const data=eventsFor(s);let store=startAttempt(emptySimulator(s.platform),s,'open-all',1);if(s.extendedSnapshot)store=updateAttempt(store,s,data,'open-all',{type:'extend-snapshot'},2);
  for(const e of data)store=updateAttempt(store,s,data,'open-all',{type:'view',id:e.id},3);
  assert.equal(gradeAttempt(store.attempts[s.id][0],s,data,5).score,0);
  const good=goodInvestigation(s),bad=structuredClone(good.attempt);const noise=data.find(e=>!rubrics[s.id].evidence.flatMap(g=>g.ids).includes(e.id)&&!rubrics[s.id].useful.includes(e.id));if(noise){bad.selected.push(noise.id);assert.ok(gradeAttempt(bad,s,data,5).score<100);}
  bad.correlations.push({id:'invented',claimId:'exfil',stance:'supports',eventIds:[bad.selected[0]],reason:'Afirmación sin una fuente que la respalde.'});assert.ok(gradeAttempt(bad,s,data,5).score<100);
 }
});
test('Simulator: verdadero positivo, falso positivo e inconcluso se distinguen; acusar sin evidencia no supera',()=>{
 const legitimate=goodInvestigation(scenarios[1]);assert.equal(gradeAttempt(legitimate.attempt,scenarios[1],legitimate.events,1).score,100);
 for(const s of scenarios.slice(1)){const good=goodInvestigation(s),bad=structuredClone(good.attempt);bad.decision.verdict='incident';bad.report.impact='exfiltration';const evaluation=gradeAttempt(bad,s,good.events,1);assert.ok(evaluation.score<=59);assert.equal(evaluation.passed,false);assert.ok(evaluation.penalties.length);}
 for(const s of scenarios.slice(2)){const good=goodInvestigation(s);good.attempt.decision.verdict='signal';assert.equal(gradeAttempt(good.attempt,s,good.events,1).score,100,'Alternativa respaldada: señal válida sin incidente confirmado');}
});
test('Simulator: evidencia tardía no seleccionable antes del corte; omitir evidencia crítica impide superar',()=>{
 const s=scenarios[3],data=eventsFor(s),store=startAttempt(emptySimulator('splunk'),s,'late',1);
 assert.equal(updateAttempt(store,s,data,'late',{type:'select',id:'A021'},2),store);
 const good=goodInvestigation(s);good.attempt.selected=good.attempt.selected.filter(id=>id!=='A021');good.attempt.report.evidenceIds=good.attempt.report.evidenceIds.filter(id=>id!=='A021');const grade=gradeAttempt(good.attempt,s,data,3);assert.ok(grade.score<=79);assert.ok(grade.omitted.includes('A021'));
});
test('Simulator: la nota depende de relaciones/IDs, no de palabras clave, longitud o repetir la afirmación',()=>{
 for(const s of scenarios){const good=goodInvestigation(s),other=structuredClone(good.attempt);other.hypothesis='Texto libre a revisar por una persona.';other.decision.reason='Otra redacción.';for(const key of ['summary','scope','indicators','impactText','recommendations','conclusion'] as const)other.report[key]='Redacción diferente pendiente de revisión.';other.correlations.forEach(c=>c.reason='Revisión humana pendiente.');
  assert.equal(gradeAttempt(other,s,good.events,1).score,gradeAttempt(good.attempt,s,good.events,1).score);
  other.correlations.push({...other.correlations[0],id:'duplicate'});assert.equal(gradeAttempt(other,s,good.events,1).score,100,'Duplicar relación no suma puntos');
  other.selected=[];assert.ok(gradeAttempt(other,s,good.events,1).score<80);
 }
});
test('Simulator: expedientes incompletos no se finalizan; intentos entregados no cambian y reintento no duplica',()=>{
 for(const s of scenarios){const data=goodInvestigation(s),grade=gradeAttempt(data.attempt,s,data.events,10),done=finishAttempt(data.store,s,data.attempt.id,grade,200);
  assert.equal(finishAttempt(done,s,data.attempt.id,grade,201),done);assert.equal(updateAttempt(done,s,data.events,data.attempt.id,{type:'hypothesis',value:'modificar'},202),done);
  const next=startAttempt(done,s,'retry',203);assert.equal(next.attempts[s.id].length,2);assert.deepEqual(next.attempts[s.id][0],done.attempts[s.id][0]);assert.equal(startAttempt(next,s,'retry-again',204),next);
  const blank=startAttempt(emptySimulator(s.platform),s,'blank',1);assert.equal(finishAttempt(blank,s,'blank',grade,2),blank);
 }
});
test('Simulator: sesiones se recuperan por plataforma sin leer/escribir progreso educativo o el otro simulador',()=>{
 const values=new Map([['soc-learning-path:learning:v2','SC-UNCHANGED'],['soc-learning-path:splunk:learning:v1','SPLUNK-UNCHANGED']]);const calls:string[]=[];
 const storage={getItem:(key:string)=>{calls.push('read:'+key);return values.get(key)||null;},setItem:(key:string,value:string)=>{calls.push('write:'+key);values.set(key,value);}};
 for(const platform of ['microsoft','splunk'] as Platform[]){const s=scenarios.find(s=>s.platform===platform)!,good=goodInvestigation(s);const saved=saveSimulator(storage,good.store);assert.equal(saved.blocked,false);assert.deepEqual(loadSimulator(storage,platform).store,good.store);}
 assert.ok(calls.every(c=>c.includes(':simulator:')));assert.equal(values.get('soc-learning-path:learning:v2'),'SC-UNCHANGED');assert.equal(values.get('soc-learning-path:splunk:learning:v1'),'SPLUNK-UNCHANGED');assert.notEqual(values.get(simulatorKey('microsoft')),values.get(simulatorKey('splunk')));
 assert.throws(()=>mergeSimulator(emptySimulator('microsoft'),emptySimulator('splunk')),/No se mezclan/);
});
test('Simulator: guardados corruptos/futuros no se sobrescriben; cuota permite conservar sesión en memoria',()=>{
 for(const raw of ['{','null',JSON.stringify({schemaVersion:2,platform:'microsoft',attempts:{}}),JSON.stringify({schemaVersion:1,platform:'splunk',attempts:{}})]){let writes=0;const storage={getItem:()=>raw,setItem:()=>{writes++;}};assert.equal(loadSimulator(storage,'microsoft').blocked,true);assert.equal(saveSimulator(storage,emptySimulator('microsoft')).blocked,true);assert.equal(writes,0);}
 assert.throws(()=>saveSimulator({getItem:()=>null,setItem:()=>{throw Error('quota');}},goodInvestigation(scenarios[0]).store),/quota/);
 const good=goodInvestigation(scenarios[0]);const done=finishAttempt(good.store,scenarios[0],good.attempt.id,gradeAttempt(good.attempt,scenarios[0],good.events,10),20);const bad=structuredClone(done);bad.attempts[scenarios[0].id][0].evaluation!.score=999;assert.equal(validateSimulator(bad,'microsoft'),null);assert.deepEqual(mergeSimulator(done,good.store),done);
});
test('Simulator: respuestas y evaluación ocultas antes de entregar, feedback y omisiones accesibles después',()=>{
 for(const s of scenarios){const good=goodInvestigation(s);const session={store:good.store,warning:'',blocked:false,start:()=>{},update:()=>{},finish:()=>{},exportSession:()=>{}};
  const html=renderToStaticMarkup(createElement(CaseWorkspace,{scenario:s,events:good.events,session}));assert.ok(!html.includes(rubrics[s.id].explanation));assert.ok(!html.includes('Explicación educativa'));assert.ok(!html.includes('100/100'));assert.ok(html.includes('Filtros locales sobre eventos sintéticos.'));assert.ok(html.includes('Línea temporal de lo investigado'));
  const done={...good.attempt,completedAt:50,evaluation:gradeAttempt(good.attempt,s,good.events,50)};const result=renderToStaticMarkup(createElement(EvaluationPanel,{attempt:done}));assert.ok(result.includes('100/100'));assert.ok(result.includes('Explicación educativa'));assert.ok(result.includes('Revisión humana'));
 }
});
test('Simulator: rutas anteriores, subárbol SC-200, atlas/lectores/río y motores intactos',async()=>{
 const checked=await checkSimulatorIntegrity();assert.equal(checked.verifiedCopies,358);assert.deepEqual(checked.educationalCounts,{sc200:[13,76,719,272],splunk:[11,80,240]});
 assert.ok(!simulatorChange('src/splunk/progress.ts','a'.repeat(64),'b'.repeat(64)));assert.ok(!simulatorChange('src/components/LearningReader.tsx','a'.repeat(64),'b'.repeat(64)));
 const app=await readFile(new URL('../src/App.tsx',import.meta.url),'utf8');assert.ok(app.includes("route.page === 'simulador' ? <SimulatorBoundary>"));const source=await readFile(new URL('../src/simulator/SimulatorApp.tsx',import.meta.url),'utf8');assert.ok(source.includes("await import('./grading')"));assert.ok(!source.includes("from './rubrics'"));
});
