import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {catalog,lessonUrl,regionUrl,decodePayload} from '../src/splunk/data';
import {emptySplunk,applySplunk,recordFor,isAvailable,saveSplunk,loadSplunk,splunkStats,SPLUNK_KEY,validateSplunk} from '../src/splunk/progress';
import type {SplunkStore,SplunkCatalog,SplunkPayload} from '../src/splunk/types';
import {buildSplunk,splitLesson,IMPORT_IDS,LEGACY_IDS,allowedDestination} from '../scripts/prepare-splunk.mjs';
import {newPrerequisites,documentationIPs} from '../scripts/splunk-v20-sources.mjs';
import {checkV20Protected} from '../scripts/splunk-v20-integrity.mjs';
import {v20Change,v20FileSet} from '../scripts/splunk-v20-reconciliation.mjs';
import {sha256} from '../scripts/splunk-integrity.mjs';
import {splunkWorlds} from '../src/splunk/world-model';
import SplunkReader from '../src/splunk/SplunkReader';
import {studyPosition} from '../src/splunk/reader-presentation';
const read=(file:string)=>readFile(new URL('../'+file,import.meta.url),'utf8');
const old=JSON.parse(await read('output/splunk-v20/respaldo/archivos/src/generated/splunk/catalog.json')) as SplunkCatalog;
const payloads:SplunkPayload[]=await Promise.all(catalog.lessons.map(async l=>JSON.parse(await read('public/'+l.file))));
let clock=100;
function complete(state:SplunkStore,i:number,course=catalog,attempt='complete'){
 const lesson=course.lessons[i],data=payloads.find(p=>p.id===lesson.id)!;
 const send=(event:Parameters<typeof applySplunk>[4])=>{state=applySplunk(state,course,lesson,data,event,++clock);};
 send({type:'visit'});for(const stepId of lesson.stepIds)send({type:'seen',stepId});send({type:'summary'});send({type:'start',attemptId:attempt});
 for(const q of data.questions)send({type:'answer',questionId:q.id,optionId:q.solution});send({type:'finish'});send({type:'review'});return state;
}
test('V2.0: exactamente los 80 IDs canónicos, 160 MCQ y 80 P01 originales en sus namespaces',async()=>{
 const canonical=JSON.parse(await read('SPLUNK_MASTER_RESEARCH/03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json'));
 assert.deepEqual(catalog.lessons.map(l=>l.id),canonical.regions.flatMap((r:{lessons:{id:string}[]})=>r.lessons.map(l=>l.id)));
 assert.deepEqual(catalog.lessons.map(l=>l.id),IMPORT_IDS);assert.equal(LEGACY_IDS.length,18);
 assert.deepEqual(catalog.regions.map(r=>r.lessonIds.length),[5,6,7,8,7,8,8,8,8,8,7]);
 const activityIds:string[]=[];
 for(const suffix of ['R01_R03','R04_R05','R06_R07','R08_R09','R10_R11']){
  const bank=JSON.parse(await read(`SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_${suffix}/ACTIVIDADES/BANCO_ACTIVIDADES_${suffix}.json`));
  for(const a of bank.activities){activityIds.push(a.id);const p=payloads.find(p=>p.id===a.lesson_id)!;
   const adapted=[...p.questions,...p.formative].find(q=>q.id===a.id)!;assert.ok(adapted,a.id);assert.equal(adapted.humanReview,'pending_independent_review');
   assert.ok(adapted.sourceRefs.every(ref=>ref.startsWith(`SPLUNK_LECCIONES_${suffix}:`)));
   if(adapted.type==='choice'){assert.deepEqual(adapted.options.map(o=>o.id),a.option_ids);assert.equal(adapted.solution,a.solution_option_id);}else{assert.equal(adapted.autoGradable,false);assert.equal(adapted.rubric.length,a.rubric.length);}
  }
 }
 assert.equal(new Set(activityIds).size,240);assert.equal(payloads.flatMap(p=>p.questions).length,160);assert.equal(payloads.flatMap(p=>p.formative).length,80);
});
test('V2.0: ocho/nueve secciones fuente reconstruidas; cinco pasos completos, errores y solucionarios conservados',async()=>{
 for(const payload of payloads){
  const original=await read(payload.sourceFile),source=splitLesson(original,payload.id);
  assert.equal(source.preamble+source.sections.map(s=>s.markdown).join(''),payload.originalMarkdown);
  assert.equal(payload.sections.map(s=>s.markdown).join(''),source.sections.slice(0,source.sections.indexOf(source.activitySection)).map(s=>s.markdown).join(''));
  assert.equal(payload.solutionsMarkdown,source.solutionsMarkdown);assert.equal(payload.referencesMarkdown,source.referencesSection.markdown);
  assert.equal(payload.reconstruction.sections,source.sections.length);assert.equal(payload.sections.length,5);
  if(!LEGACY_IDS.includes(payload.id))for(const ip of documentationIPs(original))assert.ok(payload.originalMarkdown.includes(ip),`${payload.id}: IP RFC5737 conservada`);
  assert.equal(sha256(original),payload.sourceVersion);await decodePayload(await read('public/'+catalog.lessons.find(l=>l.id===payload.id)!.file),catalog.lessons.find(l=>l.id===payload.id)!);
 }
});
test('V2.0: primeras 18 revisiones, requisitos, payloads y recursos idénticos al respaldo',async()=>{
 for(const lesson of old.lessons){assert.deepEqual(catalog.lessons.find(l=>l.id===lesson.id),lesson);assert.equal(await read('public/'+lesson.file),await read('output/splunk-v20/respaldo/archivos/public/'+lesson.file));}
 for(const region of old.regions){assert.deepEqual(catalog.regions.find(r=>r.id===region.id),region);assert.equal(await read('public/'+region.resourceFile),await read('output/splunk-v20/respaldo/archivos/public/'+region.resourceFile));}
});
test('V2.0: guardado V1.2.2 con 840 XP e historial carga sin migración, escritura cruzada ni recompensas por ampliar catálogo',()=>{
 let state=emptySplunk();for(let i=0;i<18;i++)state=complete(state,i,old,'historic');
 state=saveSplunk({getItem:()=>null,setItem:()=>{}},state,old).store;
 const raw=JSON.stringify(state),values=new Map([[SPLUNK_KEY,raw],['soc-learning-path:learning:v2','SC-KEEP'],['soc-learning-path:progress:v1','LEGACY-KEEP']]);
 const writes:string[]=[];const storage={getItem:(k:string)=>{assert.equal(k,SPLUNK_KEY);return values.get(k)||null;},setItem:(k:string,v:string)=>{writes.push(k);values.set(k,v);}};
 const loaded=loadSplunk(storage,catalog);assert.equal(loaded.blocked,false);assert.deepEqual(loaded.store,state);assert.deepEqual(writes,[]);
 assert.equal(splunkStats(loaded.store,catalog).provisionalXP,840);assert.equal(splunkStats(loaded.store,catalog).definitiveXP,0);
 assert.deepEqual(saveSplunk(storage,loaded.store,catalog).store,state);assert.ok(writes.every(k=>k===SPLUNK_KEY));assert.equal(values.get('soc-learning-path:learning:v2'),'SC-KEEP');
 let advanced=loaded.store;for(let i=18;i<80;i++)advanced=complete(advanced,i);
 for(const id of LEGACY_IDS)assert.deepEqual(advanced.records[id],state.records[id],id);
 assert.equal(splunkStats(advanced,catalog).provisionalXP,3500);assert.equal(advanced.lastLesson?.id,'SP-R11-L07');
});
test('V2.0: once regiones con requisitos documentales reales, ramas R10 y R11 sin secuencia oculta ni licencia',()=>{
 const expected:Record<string,number[]>={'SP-R04':[3],'SP-R05':[2,4],'SP-R06':[1,2,3,4,5],'SP-R07':[1,2,3,4,5,6],'SP-R08':[1,2,3,4,5,6,7],'SP-R09':[1,2,3,4,5,6,7,8],'SP-R10':[1,2,3,4,5],'SP-R11':[7,9,10]};
 for(const lesson of catalog.lessons.slice(18))assert.deepEqual(lesson.prerequisites,IMPORT_IDS.filter(id=>expected[lesson.regionId].includes(Number(id.slice(4,6)))));
 let state=emptySplunk();for(let i=0;i<33;i++)state=complete(state,i);
 assert.equal(isAvailable(state,catalog.lessons.find(l=>l.id==='SP-R10-L01')!,catalog),true);assert.equal(isAvailable(state,catalog.lessons.find(l=>l.id==='SP-R11-L01')!,catalog),false);
 assert.throws(()=>newPrerequisites('**Prerrequisitos:** desconocido','SP-R04-L01',IMPORT_IDS),/desconocidos/);
 for(const lesson of catalog.lessons)assert.ok(lesson.prerequisites.every(id=>IMPORT_IDS.indexOf(id)<IMPORT_IDS.indexOf(lesson.id)));
});
test('V2.0: 80 teorías 2/2, 3500 XP provisionales únicos, 11 bonus; práctica jamás superada automáticamente',()=>{
 let state=emptySplunk();for(let i=0;i<80;i++){assert.equal(isAvailable(state,catalog.lessons[i],catalog),true);state=complete(state,i);}
 assert.equal(splunkStats(state,catalog).provisionalXP,3500);assert.equal(state.regionAwards.length,11);
 for(const lesson of catalog.lessons){const r=recordFor(state,lesson);assert.equal(r.theoryPassed,true);assert.equal(r.formativeSeen,false);assert.equal(r.practicalStatus,'not_assessed');}
 const stored=validateSplunk(JSON.parse(JSON.stringify(state)),catalog)!;assert.ok(stored);
 for(let i=0;i<80;i++)state=complete(state,i,catalog,'repeat');
 assert.equal(splunkStats(state,catalog).provisionalXP,3500);assert.equal(splunkStats(state,catalog).definitiveXP,0);
});
test('V2.0: todas las URLs y cinco pasos explícitos; lector bloquea acceso directo sin prerrequisitos',()=>{
 for(const lesson of catalog.lessons){assert.ok(lessonUrl(lesson.id).includes(lesson.id));assert.ok(regionUrl(lesson.regionId).includes(lesson.regionId));
  for(let step=1;step<=5;step++)assert.equal(studyPosition(new URLSearchParams('paso='+step),lesson.stepIds,lesson.stepIds.slice(0,3)).index,step-1);
  if(lesson.prerequisites.length){const html=renderToStaticMarkup(createElement(SplunkReader,{id:lesson.id,params:new URLSearchParams('fase=original'),store:emptySplunk(),send:()=>{}}));assert.ok(html.includes('Esta lección está bloqueada'));assert.ok(!html.includes('Fuente editorial completa saneada'));}
 }
});
test('V2.0: recursos contienen todos los laboratorios, 20 CSV originales y namespace transversal R11 correcto',async()=>{
 const unique=new Set<string>();let labs=3;
 for(const region of catalog.regions.slice(3)){
  const text=await read('public/'+region.resourceFile),resource=JSON.parse(text);assert.equal(sha256(text),region.resourcesHash);
  assert.ok(resource.lab.includes('# LAB'));labs+=(resource.lab.match(/^# LAB/gm)||[]).length;
  assert.equal(resource.documents.length,3);
  for(const fixture of resource.fixtures){assert.equal(fixture.text,await read(fixture.file));assert.equal(sha256(fixture.text),fixture.sha256);unique.add(fixture.file);}
  if(region.id==='SP-R11'){assert.ok(resource.fixtures.some((f:{file:string})=>f.file.includes('R06_R07/PRACTICAS/fixtures/auth_activity.csv')));assert.ok(!resource.fixtures.some((f:{file:string})=>f.file.includes('R08_R09')));}
 }
 unique.add('SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R01_R03/PRACTICAS/fixtures/auth_sintetico.csv');assert.equal(unique.size,20);assert.equal(labs,22);
});
test('V2.0: ocho paisajes nuevos con el mismo motor y tres configuraciones antiguas literales intactas',async()=>{
 assert.equal(Object.keys(splunkWorlds).length,11);for(const region of catalog.regions)assert.equal(splunkWorlds[region.theme].name,region.title);
 const original=await read('output/splunk-v20/respaldo/archivos/src/splunk/world-model.ts'),current=await read('src/splunk/world-model.ts');
 for(const prefix of ['const palette =','  harbor:','  river:','  forest:'])assert.equal(current.split('\n').find(s=>s.startsWith(prefix)),original.split('\n').find(s=>s.startsWith(prefix)));
});
test('V2.0: guardias estrictas, conjuntos cerrados y generación determinista de 94 derivados',async()=>{
 const first=await buildSplunk(),second=await buildSplunk();assert.deepEqual(first,second);assert.equal(first.outputs.length,94);
 assert.ok(allowedDestination('public/splunk-content/SP-R11-L07.json'));assert.ok(!allowedDestination('public/splunk-content/SP-R11-L08.json'));
 assert.ok(!v20Change('src/splunk/progress.ts','a'.repeat(64),'b'.repeat(64)));assert.ok(!v20Change('src/generated/catalog.json','a'.repeat(64),'b'.repeat(64)));
 assert.ok(!v20FileSet('public/splunk-content',[],['public/splunk-content/extra.json']));
 const report=await checkV20Protected();assert.equal(report.verifiedCopies,281);assert.equal(report.splunk.activities,240);
});
