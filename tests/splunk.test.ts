import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, cp, mkdir, writeFile, symlink } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildSplunk, generateSplunk, allowedDestination, safePath, splitLesson, IMPORT_IDS } from '../scripts/prepare-splunk.mjs';
import { ROOT, BACKUP, checkProtected, sha256 } from '../scripts/splunk-integrity.mjs';
import { catalog, decodePayload } from '../src/splunk/data';
import { applySplunk, blankRecord, emptySplunk, isAvailable, loadSplunk, mergeSplunk, recordFor, resultFor, saveSplunk, SPLUNK_KEY, splunkStats, theoryPass, validateSplunk } from '../src/splunk/progress';
import type { SplunkLesson, SplunkPayload, SplunkStore } from '../src/splunk/types';
import { LessonBody } from '../src/splunk/SplunkReader';
import SplunkMap from '../src/splunk/SplunkMap';
import SplunkMarkdown from '../src/splunk/SplunkMarkdown';
import AcademySelector from '../src/components/AcademySelector';
import { LEARNING_KEY, totalXP } from '../src/lib/learning';
import { LEGACY_KEY, loadLearning } from '../src/lib/learning-storage';
import type { Chapter } from '../src/types';

const payloads: SplunkPayload[] = await Promise.all(catalog.lessons.map(async l => JSON.parse(await readFile(new URL('../public/' + l.file, import.meta.url), 'utf8'))));
const lesson = catalog.lessons[0], payload = payloads[0];
let clock = 100;
const action = (store: SplunkStore, event: Parameters<typeof applySplunk>[4], item = lesson, data = payload) => applySplunk(store, catalog, item, data, event, ++clock);
const study = (store = emptySplunk(), item = lesson, data = payload) => item.stepIds.reduce((s,stepId) => action(s, { type:'seen', stepId }, item, data), store);
const summarize = (store = emptySplunk(), item = lesson, data = payload) => action(study(store, item, data), { type:'summary' }, item, data);
function pass(store = summarize(), attemptId = 'pass', item = lesson, data = payload) {
  let next = action(store, { type:'start', attemptId }, item, data);
  for (const q of data.questions) next = action(next, { type:'answer', questionId:q.id, optionId:q.solution }, item, data);
  return action(next, { type:'finish' }, item, data);
}
class StorageSpy {
  values = new Map<string,string>(); reads: string[] = []; writes: string[] = [];
  getItem(key: string) { this.reads.push(key); return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.writes.push(key); this.values.set(key,value); }
}

test('Splunk: R01–R11, 80 IDs canónicos y 240 actividades/opciones editoriales sin casts SC-200', async () => {
  const result = await buildSplunk();
  assert.deepEqual(result.catalog.lessons.map(l => l.id), IMPORT_IDS);
  assert.equal(result.catalog.regions.length,11);
  assert.deepEqual(result.catalog,catalog);
  const banks=await Promise.all(['R01_R03','R04_R05','R06_R07','R08_R09','R10_R11'].map(async suffix=>JSON.parse(await readFile(new URL(`../SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_${suffix}/ACTIVIDADES/BANCO_ACTIVIDADES_${suffix}.json`,import.meta.url),'utf8'))));
  const bank={activities:banks.flatMap(b=>b.activities)};
  for(const data of payloads) {
    assert.equal(data.questions.length,2); assert.equal(data.formative.length,1);
    for(const q of data.questions) {
      const original=bank.activities.find(a=>a.id===q.id);
      assert.deepEqual(q.options.map(o=>o.id),original.option_ids); assert.equal(q.solution,original.solution_option_id);
      assert.equal(q.humanReview,'pending_independent_review');
      assert.ok(q.sourceRefs.every(ref=>ref.startsWith(data.sourceFile.split('/')[1]+':')));
      for(const a of q.anchors) {
        assert.equal(a.sourceHash,data.sanitizedHash);
        assert.equal(data.originalMarkdown.split('\n').slice(a.line-1,a.endLine).join('\n').trimEnd(),a.quote.trimEnd());
        assert.ok(a.endLine<data.originalMarkdown.split('\n').findIndex(l=>/^## [67]\. Actividades/.test(l))+1);
      }
    }
    assert.equal(data.formative[0].autoGradable,false);
  }
});
test('Splunk: generación determinista y hashes protegidos idénticos antes y después', async () => {
  const before=await checkProtected(), old=await Promise.all(catalog.lessons.map(l=>readFile(new URL('../public/'+l.file,import.meta.url),'utf8')));
  const generated=await generateSplunk();
  assert.equal(generated.changes,0); assert.equal(generated.outputFiles,94);
  assert.deepEqual(await checkProtected(),before);
  assert.deepEqual(await Promise.all(catalog.lessons.map(l=>readFile(new URL('../public/'+l.file,import.meta.url),'utf8'))),old);
});
test('Splunk: destinos exactos, sin borrados ni overrides ni rutas ascendentes o enlaces', async () => {
  for(const file of ['public/content/a.json','src/generated/catalog.json','public','/tmp/a','public/splunk-content/../content/a.json','public/splunk-content/SP-R12-L01.json','public/splunk-content/SP-R02-L07.json','public/splunk-content/resources-SP-R12.json']) assert.equal(allowedDestination(file),false);
  assert.ok(allowedDestination('public/splunk-content/SP-R01-L01.json'));
  await assert.rejects(buildSplunk(ROOT,['SP-R02-L01']),/lote exacto/);
  await assert.rejects(safePath(ROOT,'../secret'),/Ruta no permitida/);
  const temporary=await mkdtemp(path.join(tmpdir(),'splunk-safe-test-'));
  await symlink(ROOT,path.join(temporary,'linked'));
  await assert.rejects(safePath(temporary,'linked/package.json'),/Enlace no permitido/);
});
test('Splunk: entrada manipulada y cambio SC-200 se rechazan antes de escribir salidas', async () => {
  const temporary=await mkdtemp(path.join(tmpdir(),'splunk-import-test-'));
  const research='SPLUNK_MASTER_RESEARCH';
  for(const name of ['03_CURRICULO','SPLUNK_LECCIONES_R01_R03','SPLUNK_LECCIONES_R04_R05','SPLUNK_LECCIONES_R06_R07','SPLUNK_LECCIONES_R08_R09','SPLUNK_LECCIONES_R10_R11']) await cp(path.join(ROOT,research,name),path.join(temporary,research,name),{recursive:true});
  assert.equal((await buildSplunk(temporary)).catalog.lessons.length,80);
  const source=path.join(temporary,research,'SPLUNK_LECCIONES_R01_R03/R01_FUNDAMENTOS/SP-R01-L01.md');
  await writeFile(source,'# Fixture alterada (solo copia temporal)');
  await assert.rejects(buildSplunk(temporary),/hash incorrecto/);
  const snapshot=path.join(temporary,BACKUP); await mkdir(snapshot,{recursive:true});
  await writeFile(path.join(temporary,'sc-protected.json'),'cambio sintético');
  await writeFile(path.join(snapshot,'inventario.json'),JSON.stringify({protected:{'sc-protected.json':sha256('original sintético')},sc200:{}}));
  await assert.rejects(generateSplunk(temporary),/DETENER/);
});
test('Splunk: reconstrucción completa saneada sin pérdida; rechazo de secciones incompletas', async () => {
  for(const l of catalog.lessons) {
    const original=await readFile(new URL('../'+payloads.find(p=>p.id===l.id)!.sourceFile,import.meta.url),'utf8');
    const result=splitLesson(original,l.id);
    assert.equal(result.preamble+result.sections.map(s=>s.markdown).join(''),result.text);
    assert.equal(sha256(original),l.sourceVersion);
  }
  assert.throws(()=>splitLesson('# Sin contrato','SP-R01-L01'),/secciones/);
});
test('Splunk: payload vacío, hash/revisión/curso incorrectos se rechazan', async () => {
  const text=await readFile(new URL('../public/'+lesson.file,import.meta.url),'utf8');
  assert.equal((await decodePayload(text,lesson)).id,lesson.id);
  await assert.rejects(decodePayload('',lesson),/Hash/);
  await assert.rejects(decodePayload(text+' ',lesson),/Hash/);
  const altered=JSON.stringify({...payload,courseId:'sc200'});
  await assert.rejects(decodePayload(altered,{...lesson,payloadHash:sha256(altered)}),/Contrato/);
  await assert.rejects(decodePayload(text,{...lesson,revision:'bad'}),/Contrato/);
});
test('Splunk: abrir/visitar/selector y formativa no conceden XP; resumen/review requieren estudio', () => {
  const empty=emptySplunk(),opened=action(empty,{type:'visit'});
  assert.equal(splunkStats(opened,catalog).provisionalXP,0); assert.equal(opened.lastLesson!.id,lesson.id);
  assert.equal(action(opened,{type:'summary'}),opened); assert.equal(action(opened,{type:'review'}),opened);
  assert.equal(action(opened,{type:'seen',stepId:'SC-step'}),opened);
  const formative=action(opened,{type:'formative'});
  assert.equal(recordFor(formative,lesson).formativeSeen,true); assert.equal(splunkStats(formative,catalog).provisionalXP,0);
  assert.equal(recordFor(formative,lesson).practicalStatus,'not_assessed'); assert.deepEqual(empty,emptySplunk());
});
test('Splunk: 80% exacto; con dos MCQ solo 2/2 aprueba y un intento vacío no termina', () => {
  for(const [correct,total,expected] of [[0,0,false],[1,2,false],[2,2,true],[3,5,false],[4,5,true],[79,100,false],[80,100,true]] as const) assert.equal(theoryPass(correct,total),expected);
  const started=action(summarize(),{type:'start',attemptId:'empty'});
  assert.equal(action(started,{type:'finish'}),started);
  assert.equal(action(emptySplunk(),{type:'start',attemptId:'blocked'}).records[lesson.id],undefined);
});
test('Splunk: primera respuesta inmutable, sin feedback/soluciones durante intento; reintento guarda historial', () => {
  let state=action(summarize(),{type:'start',attemptId:'failed'});
  const [q1,q2]=payload.questions;
  state=action(state,{type:'answer',questionId:q1.id,optionId:q1.options.find(o=>o.id!==q1.solution)!.id});
  assert.equal(action(state,{type:'answer',questionId:q1.id,optionId:q1.solution}),state);
  state=action(state,{type:'answer',questionId:q2.id,optionId:q2.solution});
  const before=recordFor(state,lesson).attempts.failed;
  assert.equal(resultFor(before).passed,false);
  const markup=renderToStaticMarkup(createElement(LessonBody,{lesson,data:payload,params:new URLSearchParams('fase=teoria'),store:state,send:()=>{}}));
  for(const q of payload.questions) assert.ok(!markup.includes(q.explanation));
  assert.ok(!markup.includes(payload.formative[0].referenceAnswer));
  assert.ok(!markup.includes('Enseñanza que respalda'));
  for(const phase of ['soluciones','referencias','original','practica']) {
    const html=renderToStaticMarkup(createElement(LessonBody,{lesson,data:payload,params:new URLSearchParams('fase='+phase),store:state,send:()=>{}}));
    assert.ok(html.includes('Evaluación en curso')); assert.ok(!html.includes(q1.explanation));
  }
  state=action(state,{type:'finish'}); assert.equal(recordFor(state,lesson).theoryPassed,false);
  assert.equal(splunkStats(state,catalog).provisionalXP,10);
  const retried=pass(state,'retry');
  assert.equal(recordFor(retried,lesson).theoryPassed,true);
  assert.deepEqual(recordFor(retried,lesson).attempts.failed,recordFor(state,lesson).attempts.failed);
});
test('Splunk: XP 5/5/15/5, límite 30 por lección, región 100 y nivel cada 250; todo provisional', () => {
  let state=study(); assert.equal(splunkStats(state,catalog).provisionalXP,5);
  state=action(state,{type:'summary'}); assert.equal(splunkStats(state,catalog).provisionalXP,10);
  state=pass(state); assert.equal(splunkStats(state,catalog).provisionalXP,25);
  state=action(state,{type:'review'}); assert.equal(splunkStats(state,catalog).provisionalXP,30);
  for(let i=0;i<25;i++) { state=pass(state,'retry-'+i); state=action(state,{type:'review'}); state=action(state,{type:'formative'}); }
  assert.equal(splunkStats(state,catalog).provisionalXP,30);
  for(let i=1;i<5;i++) { state=pass(summarize(state,catalog.lessons[i],payloads[i]),'region-'+i,catalog.lessons[i],payloads[i]); state=action(state,{type:'review'},catalog.lessons[i],payloads[i]); }
  assert.deepEqual(state.regionAwards,['SP-R01']);
  assert.equal(splunkStats(state,catalog).provisionalXP,250); assert.equal(splunkStats(state,catalog).level,2);
  assert.equal(splunkStats(state,catalog).definitiveXP,0); assert.equal(splunkStats(state,catalog).practicalStatus,'not_assessed');
  assert.equal(splunkStats(pass(state,'again'),catalog).provisionalXP,250);
});
test('Splunk: grafo propio L01 → L02–L05; acceso directo bloqueado; ningún prerrequisito SC-200', () => {
  const empty=emptySplunk(); assert.ok(isAvailable(empty,lesson,catalog));
  for(let i=1;i<5;i++) {
    const l=catalog.lessons[i]; assert.equal(isAvailable(empty,l,catalog),false);
    assert.equal(action(empty,{type:'visit'},l,payloads[i]),empty);
    assert.equal(isAvailable(pass(),l,catalog),true);
  }
});
test('Splunk: persistencia/exportación sin lecturas ni escrituras de claves SC-200; legacy íntegro', async () => {
  const storage=new StorageSpy();
  const sc=JSON.parse(await readFile(new URL('../src/generated/catalog.json',import.meta.url),'utf8'));
  const legacy={schemaVersion:1,completed:Object.fromEntries(sc.lessons.map(l=>[l.id,l.version])),lastLesson:sc.lessons[0].id};
  storage.values.set(LEGACY_KEY,JSON.stringify(legacy));
  const native=loadLearning(storage,sc.modules as Chapter[]).store;
  assert.equal(totalXP(native),3200);
  storage.values.set(LEARNING_KEY,JSON.stringify(native));
  const original=new Map(storage.values); storage.reads=[]; storage.writes=[];
  assert.equal(loadSplunk(storage,catalog).store.courseId,'splunk');
  const own=pass(),saved=saveSplunk(storage,own,catalog);
  assert.equal(saved.blocked,false); assert.deepEqual(validateSplunk(JSON.parse(storage.getItem(SPLUNK_KEY)!),catalog),saved.store);
  assert.equal(storage.values.get(LEARNING_KEY),original.get(LEARNING_KEY)); assert.equal(storage.values.get(LEGACY_KEY),original.get(LEGACY_KEY));
  assert.ok(storage.reads.every(k=>k===SPLUNK_KEY)); assert.ok(storage.writes.every(k=>k===SPLUNK_KEY));
  assert.ok(!JSON.stringify(saved.store).includes(sc.lessons[0].id));
  assert.equal(totalXP(loadLearning(storage,sc.modules).store),3200);
});
test('Splunk: corrupto/futuro/otro curso no se sobrescribe; cuota falla sin tocar SC-200', () => {
  for(const value of ['{','null',JSON.stringify({...emptySplunk(),schemaVersion:2}),JSON.stringify({...emptySplunk(),courseId:'sc200'}),JSON.stringify({...emptySplunk(),records:{'SP-R12-L01':{}}})]) {
    const storage=new StorageSpy(); storage.values.set(SPLUNK_KEY,value);
    const result=saveSplunk(storage,pass(),catalog);
    assert.equal(result.blocked,true); assert.equal(storage.values.get(SPLUNK_KEY),value); assert.deepEqual(storage.writes,[]);
  }
  const quota={getItem:()=>null,setItem:()=>{throw new Error('quota');}};
  assert.throws(()=>saveSplunk(quota,pass(),catalog),/quota/);
});
test('Splunk: fusión monotónica entre pestañas y revisiones conserva intentos, ledger único y última posición', () => {
  const base=summarize(),a=action(base,{type:'start',attemptId:'shared'});
  const early=action(a,{type:'answer',questionId:payload.questions[0].id,optionId:payload.questions[0].options.find(o=>o.id!==payload.questions[0].solution)!.id});
  const later=action(a,{type:'answer',questionId:payload.questions[0].id,optionId:payload.questions[0].solution});
  const merged=mergeSplunk(early,later);
  assert.equal(recordFor(merged,lesson).attempts.shared.answers[payload.questions[0].id].correct,false);
  assert.deepEqual(mergeSplunk(merged,merged),merged);
  const finished=pass(),old=structuredClone(finished),oldRevision='a'.repeat(24);
  old.records[lesson.id]={[oldRevision]:recordFor(finished,lesson)};
  const updated=mergeSplunk(old,finished);
  assert.ok(updated.records[lesson.id][oldRevision]); assert.ok(updated.records[lesson.id][lesson.revision]);
  assert.equal(splunkStats(updated,catalog).provisionalXP,25); assert.equal(validateSplunk(updated,catalog)?.courseId,'splunk');
});
test('Splunk: selector accesible, mapa de cinco nodos y Markdown seguro, sin servicios ni scripts', () => {
  const selector=renderToStaticMarkup(createElement(AcademySelector,{course:'splunk'}));
  assert.ok(selector.includes('aria-label="Elegir academia"')); assert.ok(selector.includes('href="#/ruta"')); assert.ok(selector.includes('href="#/splunk/ruta" aria-current="true"'));
  const map=renderToStaticMarkup(createElement(SplunkMap,{store:emptySplunk(),regionId:'SP-R01'}));
  assert.equal((map.match(/class="sp-node /g)||[]).length,5); assert.ok(!map.includes('id="sp-node-SP-R02'));
  assert.equal((map.match(/class="sp-node locked/g)||[]).length,4);
  const markdown=renderToStaticMarkup(createElement(SplunkMarkdown,{children:'<script>alert(1)</script>\n\n[No](javascript:alert(1))\n\n![No](https://example.invalid/tracker.png)\n\n[Local](../../01_FUENTE_ORIGINAL/SC-200.md)'}));
  assert.ok(!markdown.includes('<script')); assert.ok(!markdown.includes('href="javascript')); assert.ok(!markdown.includes('<img')); assert.ok(!markdown.includes('href="../../'));
});
test('SC-200: el subárbol original conserva literalmente toda su lógica; solo se añade el selector/dispatcher externo', async () => {
  const before=await readFile(path.join(ROOT,BACKUP,'archivos/src/App.tsx'),'utf8');
  const after=await readFile(path.join(ROOT,'src/App.tsx'),'utf8');
  assert.equal(after.split('function Sc200App() {')[1],before.split('export default function App() {')[1]);
  assert.ok(after.includes("course === 'splunk' ? <CourseBoundary><Suspense"));
  assert.ok(after.includes(': <Sc200App />'));
});
test('Splunk: una nueva revisión no hereda estudio ni teoría; preserva historial y no repite premios', () => {
  const old=pass(),oldRecord=structuredClone(recordFor(old,lesson));
  const changed={...lesson,revision:'b'.repeat(24)},data={...payload,revision:changed.revision};
  const changedCatalog={...catalog,lessons:[changed,...catalog.lessons.slice(1)]};
  assert.equal(recordFor(old,changed).studyCompleted,false); assert.equal(recordFor(old,changed).theoryPassed,false);
  assert.equal(isAvailable(old,catalog.lessons[1],changedCatalog),false);
  let state=old;
  const act=(event: Parameters<typeof applySplunk>[4])=>{state=applySplunk(state,changedCatalog,changed,data,event,++clock);};
  act({type:'visit'}); assert.equal(splunkStats(state,changedCatalog).provisionalXP,25);
  for(const stepId of changed.stepIds)act({type:'seen',stepId});
  act({type:'summary'});act({type:'start',attemptId:'new-revision'});
  for(const q of data.questions)act({type:'answer',questionId:q.id,optionId:q.solution});
  act({type:'finish'});
  assert.equal(recordFor(state,changed).theoryPassed,true);
  assert.deepEqual(state.records[lesson.id][lesson.revision],oldRecord);
  assert.equal(splunkStats(state,changedCatalog).provisionalXP,25);
});
test('Splunk: no inicia otro examen mientras un intento de otra lección sigue activo', () => {
  let state=pass();
  state=summarize(state,catalog.lessons[1],payloads[1]);
  state=action(state,{type:'start',attemptId:'pending-first'});
  assert.equal(action(state,{type:'start',attemptId:'second'},catalog.lessons[1],payloads[1]),state);
});
test('Splunk: estudio y solvencias incompletas/IDs de otra ruta no se aceptan como acciones', () => {
  const state=action(summarize(),{type:'start',attemptId:'strict'});
  assert.equal(action(state,{type:'answer',questionId:'SC-200-Q01',optionId:'x'}),state);
  assert.equal(action(state,{type:'answer',questionId:payload.questions[0].id,optionId:'wrong-option'}),state);
  const alien={...lesson,id:'SC-200'};
  assert.equal(applySplunk(state,catalog,alien,{...payload,id:'SC-200'},{type:'visit'}),state);
});
