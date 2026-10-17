import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import SplunkReader,{LessonBody} from '../src/splunk/SplunkReader';
import SplunkMarkdown from '../src/splunk/SplunkMarkdown';
import {catalog} from '../src/splunk/data';
import {applySplunk,emptySplunk,recordFor,splunkStats,loadSplunk,saveSplunk,SPLUNK_KEY} from '../src/splunk/progress';
import {readerPresentation,READER_STAGES} from '../src/splunk/reader-presentation';
import {checkV122Protected} from '../scripts/splunk-v122-integrity.mjs';
const payloads=await Promise.all(catalog.lessons.map(async l=>JSON.parse(await readFile(new URL('../public/'+l.file,import.meta.url),'utf8'))));
const html=(i:number,phase:string,store=emptySplunk())=>renderToStaticMarkup(createElement(LessonBody,{lesson:catalog.lessons[i],data:payloads[i],params:new URLSearchParams('fase='+phase),store,send:()=>{}}));
let now=1;
const event=(store:ReturnType<typeof emptySplunk>,i:number,action:Parameters<typeof applySplunk>[4])=>applySplunk(store,catalog,catalog.lessons[i],payloads[i],action,++now);
const prepare=(store:ReturnType<typeof emptySplunk>,i:number)=>{for(const section of payloads[i].sections)store=event(store,i,{type:'seen',stepId:section.id});return event(store,i,{type:'summary'});};
const pass=(store:ReturnType<typeof emptySplunk>,i:number)=>{store=event(prepare(store,i),i,{type:'start',attemptId:'v122-'+i});for(const q of payloads[i].questions)store=event(store,i,{type:'answer',questionId:q.id,optionId:q.solution});return event(store,i,{type:'finish'});};

test('V1.2.2: lector usa las tres columnas y cinco etapas del maestro; no existen ocho pestañas',()=>{
  const result=html(0,'mision');
  for(const cls of ['page-shell academy-lesson sp-reader','lesson-title-row','lesson-progress','academy-grid','lesson-phases','activity-surface sp-reader-content','splunk-pane academy-splunk'])assert.ok(result.includes(cls),cls);
  const navigation=result.split('aria-label="Cinco etapas de la lección Splunk"')[1].split('</nav>')[0];
  assert.equal((navigation.match(/<button /g)||[]).length,5);
  for(const stage of READER_STAGES)assert.ok(navigation.includes('<b>'+stage.title+'</b>'));
  assert.ok(!result.includes('sp-phases'));assert.match(result,/Tu misión en esta lección/);
  assert.ok(!result.includes('Próximamente'));
});
test('V1.2.2: las 400 secciones guiadas y los 240 IDs permanecen íntegros',()=>{
  let sections=0,questions=0,formative=0;
  for(const [i,data] of payloads.entries()){
    assert.equal(data.sections.length,5);assert.equal(data.questions.length,2);assert.equal(data.formative.length,1);
    for(const [j,section] of data.sections.entries()){
      const rendered=renderToStaticMarkup(createElement(SplunkMarkdown,{children:section.markdown,omitLeadingHeading:true}));
      assert.ok(html(i,'estudio&paso='+(j+1)).includes(rendered),section.id);sections++;
    }
    assert.deepEqual(data.questions.map((q:{id:string})=>q.id),catalog.lessons[i].questionIds);questions+=data.questions.length;
    const practice=html(i,'practica');
    assert.ok(practice.includes('data-formative="'+data.formative[0].id+'"'));assert.ok(practice.includes(renderToStaticMarkup(createElement('p',null,data.formative[0].prompt))));formative++;
    for(const phase of ['resumen','referencias','soluciones','original','repaso'])assert.ok(!html(i,phase).includes('Fase no encontrada'));
  }
  assert.deepEqual({sections,questions,formative},{sections:400,questions:160,formative:80});
});
test('V1.2.2: intento restringe las cinco etapas y oculta fuentes, P01 y explicaciones en todas las rutas',()=>{
  let state=emptySplunk();
  for(let i=0;i<catalog.lessons.length;i++){
    const active=event(prepare(state,i),i,{type:'start',attemptId:'guard-'+i});
    for(const phase of ['mision','estudio&paso=1','practica','resumen','repaso','soluciones','referencias','original','teoria']){
      const markup=html(i,phase,active);
      const nav=markup.split('aria-label="Cinco etapas de la lección Splunk"')[1].split('</nav>')[0];
      assert.equal((nav.match(/ disabled=""/g)||[]).length,4);
      for(const q of payloads[i].questions)assert.ok(!markup.includes(q.explanation));
      assert.ok(!markup.includes(payloads[i].formative[0].referenceAnswer));
      assert.ok(!markup.includes('Enseñanza que respalda'));assert.ok(!markup.includes('Fuente editorial completa saneada'));
      if(phase==='teoria')for(const id of catalog.lessons[i].questionIds)assert.ok(markup.includes('data-question="'+id+'"'));
      else assert.ok(markup.includes('Evaluación en curso'));
    }
    state=pass(state,i);
  }
});
test('V1.2.2: progreso anterior, 840 XP únicos, teoría 2/2 y formativa sin dominio permanecen separados',()=>{
  let state=emptySplunk();for(let i=0;i<18;i++){state=pass(state,i);state=event(state,i,{type:'review'});}
  const before=JSON.stringify(state);
  assert.equal(splunkStats(state,catalog).provisionalXP,840);
  for(let i=0;i<18;i++){
    assert.equal(readerPresentation(new URLSearchParams('fase=estudio'),recordFor(state,catalog.lessons[i])).phase,'estudio');
    const snapshot=JSON.stringify(state);html(i,'mision',state);html(i,'resumen',state);assert.equal(JSON.stringify(state),snapshot);
    assert.equal(readerPresentation(new URLSearchParams('fase=practica'),recordFor(state,catalog.lessons[i])).stages.find(s=>s.id==='practica')?.done,undefined);
    state=prepare(state,i);state=event(state,i,{type:'review'});state=event(state,i,{type:'formative'});
    assert.equal(recordFor(state,catalog.lessons[i]).practicalStatus,'not_assessed');
  }
  assert.equal(splunkStats(state,catalog).provisionalXP,840);
  const storage={values:new Map([['soc-learning-path:learning:v2','SC200-KEEP']]),calls:[] as string[],getItem(k:string){this.calls.push(k);return this.values.get(k)||null;},setItem(k:string,v:string){this.calls.push(k);this.values.set(k,v);}};
  saveSplunk(storage,state,catalog);const restored=loadSplunk(storage,catalog).store;assert.deepEqual(restored.records,state.records);assert.equal(splunkStats(restored,catalog).provisionalXP,840);
  assert.equal(storage.values.get('soc-learning-path:learning:v2'),'SC200-KEEP');assert.ok(storage.calls.every(k=>k===SPLUNK_KEY));
  assert.equal(Object.keys(JSON.parse(before).records).length,18);
});
test('V1.2.2: misión nueva, pasos explícitos, rutas secundarias y prerrequisitos conservados',()=>{
  const r=recordFor(emptySplunk(),catalog.lessons[0]);
  assert.equal(readerPresentation(new URLSearchParams('fase=estudio'),r).phase,'mision');
  assert.equal(readerPresentation(new URLSearchParams('fase=estudio&paso=1'),r).phase,'estudio');
  for(const phase of ['repaso','referencias','soluciones','original'])assert.equal(readerPresentation(new URLSearchParams('fase='+phase),r).selected,'resumen');
  const blocked=renderToStaticMarkup(createElement(SplunkReader,{id:'SP-R02-L01',params:new URLSearchParams('fase=original'),store:emptySplunk(),send:()=>{}}));
  assert.ok(blocked.includes('Esta lección está bloqueada'));assert.ok(!blocked.includes(payloads[5].originalMarkdown));
});
test('V1.2.2: mapas, SC-200, motores, catálogos y evidencias Parrot continúan protegidos',async()=>{
  const result=await checkV122Protected();assert.deepEqual(result.changed,[]);assert.equal(result.verifiedCopies,268);
});
