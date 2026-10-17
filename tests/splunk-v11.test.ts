import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildSplunk, generateSplunk, IMPORT_IDS, sanitizeSplunk } from '../scripts/prepare-splunk.mjs';
import { ROOT, sha256 } from '../scripts/splunk-integrity.mjs';
import { checkV11Protected, V11_BACKUP } from '../scripts/splunk-v11-integrity.mjs';
import { catalog, decodePayload } from '../src/splunk/data';
import { applySplunk, emptySplunk, isAvailable, loadSplunk, recordFor, saveSplunk, SPLUNK_KEY, splunkStats, validateSplunk } from '../src/splunk/progress';
import type { SplunkAction } from '../src/splunk/progress';
import type { SplunkLesson, SplunkPayload, SplunkStore } from '../src/splunk/types';
import SplunkMap from '../src/splunk/SplunkMap';
import { LessonBody } from '../src/splunk/SplunkReader';

const payloads: SplunkPayload[] = await Promise.all(catalog.lessons.map(async l => JSON.parse(await readFile(path.join(ROOT,'public',l.file),'utf8'))));
const baseline = JSON.parse(await readFile(path.join(ROOT,V11_BACKUP,'inventario.json'),'utf8'));
let clock = 1000;
function act(state: SplunkStore, lesson: SplunkLesson, event: SplunkAction) {
  return applySplunk(state,catalog,lesson,payloads.find(p=>p.id===lesson.id)!,event,++clock);
}
function complete(state: SplunkStore, lesson: SplunkLesson, attemptId = 'complete') {
  for(const stepId of lesson.stepIds) state=act(state,lesson,{type:'seen',stepId});
  state=act(state,lesson,{type:'summary'});
  state=act(state,lesson,{type:'start',attemptId});
  for(const q of payloads.find(p=>p.id===lesson.id)!.questions) state=act(state,lesson,{type:'answer',questionId:q.id,optionId:q.solution});
  state=act(state,lesson,{type:'finish'});
  state=act(state,lesson,{type:'formative'});
  return act(state,lesson,{type:'review'});
}
function originalR01() {
  // Create with the OLD catalogue, not V1.1: no personal storage or migration.
  const oldCatalog=JSON.parse(requireText('src/generated/splunk/catalog.json'));
  let state=emptySplunk();
  for(const l of oldCatalog.lessons) {
    const data=payloads.find(p=>p.id===l.id)!;
    const send=(event:SplunkAction)=>{state=applySplunk(state,oldCatalog,l,data,event,++clock);};
    send({type:'visit'});
    for(const stepId of l.stepIds)send({type:'seen',stepId});
    send({type:'summary'});send({type:'start',attemptId:'historic-'+l.id});
    for(const q of data.questions)send({type:'answer',questionId:q.id,optionId:q.solution});
    send({type:'finish'});send({type:'formative'});send({type:'review'});
  }
  // The old hook persists through mergeSplunk/saveSplunk, including ledger sorting.
  return saveSplunk({getItem:()=>null,setItem:()=>{}},state,oldCatalog).store;
}
// Read only the verified source backup synchronously for the old application fixture.
import { readFileSync } from 'node:fs';
const requireText=(file:string)=>readFileSync(path.join(ROOT,V11_BACKUP,'archivos',file),'utf8');

test('V1.1 regression: original 18/54 identities, 36 MCQ/18 formative retained within 80/240', async()=>{
  assert.deepEqual(catalog.lessons.map(l=>l.id),IMPORT_IDS);
  assert.deepEqual(catalog.regions.slice(0,3).map(r=>r.lessonIds.length),[5,6,7]);
  const ids=payloads.slice(0,18).flatMap(p=>[...p.questions,...p.formative].map(a=>a.id));
  assert.equal(ids.length,54);assert.equal(new Set(ids).size,54);
  assert.equal(payloads.slice(0,18).flatMap(p=>p.questions).length,36);
  assert.equal(payloads.slice(0,18).flatMap(p=>p.formative).length,18);
  const files=await readdir(path.join(ROOT,'public/splunk-content'));
  assert.equal(files.filter(f=>/^SP-R0[123]-/.test(f)).length,18);
  assert.equal(files.filter(f=>/^SP-R(?:0[4-9]|1[01])-/.test(f)).length,62);
  for(const l of catalog.lessons)await decodePayload(await readFile(path.join(ROOT,'public',l.file),'utf8'),l);
});
test('V1.1: SC-200 and original R01 payloads/metadata/revisions/evidence unchanged',async()=>{
  const checked=await checkV11Protected();assert.equal(checked.sc200.checked,400);assert.equal(checked.additionalChecked,29);
  for(const l of baseline.r01.lessons) {
    assert.deepEqual(catalog.lessons.find(item=>item.id===l.id),l);
    assert.equal(sha256(await readFile(path.join(ROOT,'public',l.file))),baseline.protected['public/'+l.file]);
  }
});
test('V1.1: guard rejects tampered R01 evidence before accepting generation',async()=>{
  const temporary=await mkdtemp(path.join(tmpdir(),'splunk-v11-guard-'));
  await mkdir(path.join(temporary,'output/splunk-pilot-r01/respaldo'),{recursive:true});
  await mkdir(path.join(temporary,'public/content'),{recursive:true});
  await mkdir(path.join(temporary,'public/splunk-content'),{recursive:true});
  await mkdir(path.join(temporary,'src/generated/splunk'),{recursive:true});
  await mkdir(path.join(temporary,'src/splunk'),{recursive:true});
  await mkdir(path.join(temporary,V11_BACKUP),{recursive:true});
  await writeFile(path.join(temporary,'output/splunk-pilot-r01/respaldo/inventario.json'),JSON.stringify({protected:{},sc200:{}}));
  const engines=['src/splunk/progress.ts','src/splunk/useSplunk.ts','src/splunk/data.ts'];
  for(const file of engines)await writeFile(path.join(temporary,file),requireText(file));
  const file='public/splunk-content/SP-R01-L01.json';
  await writeFile(path.join(temporary,file),'tampered synthetic copy');
  await writeFile(path.join(temporary,'src/generated/splunk/catalog.json'),JSON.stringify({lessons:[]}));
  await writeFile(path.join(temporary,V11_BACKUP,'inventario.json'),JSON.stringify({protected:{[file]:baseline.protected[file]},original:baseline.original,r01:{lessons:[]}}));
  await assert.rejects(generateSplunk(temporary),/DETENER V1.1.*SP-R01-L01/);
  assert.deepEqual(await readdir(path.join(temporary,'public/splunk-content')),['SP-R01-L01.json']);
});
test('V1.1: original R01 save loads without migration; records, history, last position and 250 XP retained',()=>{
  const old=originalR01(),serialized=JSON.stringify(old);
  const writes:string[]=[];
  let stored=serialized;
  const storage={getItem:(key:string)=>{assert.equal(key,SPLUNK_KEY);return stored;},setItem:(key:string,value:string)=>{writes.push(key);stored=value;}};
  const loaded=loadSplunk(storage,catalog);
  assert.equal(loaded.blocked,false);assert.deepEqual(loaded.store,old);assert.deepEqual(writes,[]);
  const saved=saveSplunk(storage,loaded.store,catalog);
  assert.deepEqual(saved.store,old);assert.equal(splunkStats(saved.store,catalog).provisionalXP,250);
  assert.deepEqual(saved.store.regionAwards,['SP-R01']);assert.equal(saved.store.lastLesson!.id,'SP-R01-L05');
  assert.deepEqual(validateSplunk(JSON.parse(stored),catalog),old);
});
test('V1.1: explicit ID prerequisites enforce region gates and preserve R01 branching',()=>{
  let state=emptySplunk();
  const r02=catalog.lessons.find(l=>l.id==='SP-R02-L01')!,r03=catalog.lessons.find(l=>l.id==='SP-R03-L01')!;
  assert.deepEqual(r02.prerequisites,baseline.r01.lessons.map(l=>l.id));
  assert.deepEqual(r03.prerequisites,IMPORT_IDS.slice(0,11));
  assert.equal(isAvailable(state,r02,catalog),false);assert.equal(isAvailable(state,r03,catalog),false);
  state=complete(state,catalog.lessons[0]);
  assert.equal(isAvailable(state,r02,catalog),false);
  for(const l of catalog.lessons.slice(1,5))assert.equal(isAvailable(state,l,catalog),true);
  for(const l of catalog.lessons.slice(1,5))state=complete(state,l);
  assert.equal(isAvailable(state,r02,catalog),true);assert.equal(isAvailable(state,catalog.lessons[6],catalog),false);
  state=complete(state,r02);assert.equal(isAvailable(state,catalog.lessons[6],catalog),true);
  assert.equal(isAvailable(state,r03,catalog),false);
  for(const l of catalog.lessons.slice(6,11))state=complete(state,l);
  assert.equal(isAvailable(state,r03,catalog),true);assert.equal(isAvailable(state,catalog.lessons[12],catalog),false);
  state=complete(state,r03);assert.equal(isAvailable(state,catalog.lessons[12],catalog),true);
  for(const l of catalog.lessons)assert.ok(l.prerequisites.every(id=>IMPORT_IDS.indexOf(id)<IMPORT_IDS.indexOf(l.id)));
});
test('V1.1: 840 provisional XP, three unique bonuses; repeats/reload never duplicate or modify R01 history',()=>{
  let state=originalR01();const original=structuredClone(state);
  for(const l of catalog.lessons.slice(5,18))state=complete(state,l);
  assert.deepEqual(state.regionAwards,['SP-R01','SP-R02','SP-R03']);
  assert.equal(splunkStats(state,catalog).provisionalXP,840);assert.equal(splunkStats(state,catalog).level,4);assert.equal(splunkStats(state,catalog).levelXP,90);
  for(const id of Object.keys(original.records))assert.deepEqual(state.records[id],original.records[id]);
  const stored=validateSplunk(JSON.parse(JSON.stringify(state)),catalog)!;assert.ok(stored);
  for(const l of catalog.lessons.slice(0,18))state=complete(state,l,'repeat');
  assert.equal(splunkStats(state,catalog).provisionalXP,840);assert.equal(splunkStats(state,catalog).definitiveXP,0);
  assert.equal(splunkStats(state,catalog).practicalStatus,'not_assessed');
});
test('V1.1: per-region resources integrity and synthetic CSV reconstruct exactly, no global sanitizer exception',async()=>{
  for(const region of catalog.regions.slice(0,3)) {
    const text=await readFile(path.join(ROOT,'public',region.resourceFile),'utf8');
    assert.equal(sha256(text),region.resourcesHash);
    const resource=JSON.parse(text);assert.equal(resource.regionId,region.id);
    const original=await readFile(path.join(ROOT,'SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R01_R03/PRACTICAS',region.id==='SP-R01'?'LAB_R01_ARQUITECTURA.md':region.id==='SP-R02'?'LAB_R02_INGESTA.md':'LAB_R03_SPRAY_OFFLINE.md'),'utf8');
    if(region.id==='SP-R03') {
      assert.equal(resource.lab,original);
      const fixture=await readFile(path.join(ROOT,'SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R01_R03/PRACTICAS/fixtures/auth_sintetico.csv'),'utf8');
      assert.equal(resource.fixture.text,fixture);assert.equal(sha256(fixture),resource.fixture.sha256);
      assert.ok(payloads[17].originalMarkdown.includes('203.0.113.9'));
      assert.ok(payloads[17].formative[0].referenceAnswer.includes('203.0.113.9'));
    } else assert.equal(resource.lab,original);
  }
  const source='203.0.113.9 10.0.0.1 user@real.invalid password=synthetic-secret';
  const result=sanitizeSplunk(source,['203.0.113.9']).text;
  assert.ok(result.includes('203.0.113.9'));for(const value of ['10.0.0.1','user@real.invalid','synthetic-secret'])assert.ok(!result.includes(value));
});
test('V1.1: atlas and 3 unique scenes, 5/6/7 nodes, no solution during any active theoretical evaluation',()=>{
  const atlas=renderToStaticMarkup(createElement(SplunkMap,{store:emptySplunk()}));
  assert.equal((atlas.match(/data-region="SP-R/g)||[]).length,11);
  for(const region of catalog.regions) {
    const map=renderToStaticMarkup(createElement(SplunkMap,{store:emptySplunk(),regionId:region.id}));
    assert.equal((map.match(/class="sp-node /g)||[]).length,region.lessonIds.length);
    assert.ok(map.includes(`data-scene="${region.theme}"`));assert.ok(map.includes(region.title));
  }
  let state=emptySplunk();
  for(const lesson of catalog.lessons) {
    const data=payloads.find(p=>p.id===lesson.id)!;
    for(const stepId of lesson.stepIds)state=act(state,lesson,{type:'seen',stepId});
    state=act(state,lesson,{type:'summary'});state=act(state,lesson,{type:'start',attemptId:'hidden'});
    for(const phase of ['soluciones','referencias','original','practica','teoria']) {
      const html=renderToStaticMarkup(createElement(LessonBody,{lesson,data,params:new URLSearchParams('fase='+phase),store:state,send:()=>{}}));
      assert.ok(!html.includes(data.formative[0].referenceAnswer));
      assert.ok(!html.includes('Enseñanza que respalda'));assert.ok(!html.includes('SHA-256:'));
      if(phase!=='teoria')assert.ok(html.includes('Evaluación en curso'));
    }
    for(const q of data.questions)state=act(state,lesson,{type:'answer',questionId:q.id,optionId:q.solution});
    state=act(state,lesson,{type:'finish'});
  }
});
test('V1.1: each theoretical and formative activity retains editorial IDs and independent-review pending',async()=>{
  const bank=JSON.parse(await readFile(path.join(ROOT,'SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R01_R03/ACTIVIDADES/BANCO_ACTIVIDADES_R01_R03.json'),'utf8'));
  for(const payload of payloads.slice(0,18))for(const adapted of [...payload.questions,...payload.formative]) {
    const original=bank.activities.find(a=>a.id===adapted.id);
    assert.ok(original);assert.equal(adapted.humanReview,'pending_independent_review');
    if(adapted.type==='choice')assert.equal(adapted.solution,original.solution_option_id);
    else {assert.equal(adapted.autoGradable,false);assert.deepEqual(adapted.rubric,original.rubric);}
  }
  assert.equal((await buildSplunk()).outputs.length,94);
});
