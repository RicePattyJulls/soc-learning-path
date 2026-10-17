import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {chromium} from 'playwright-core';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=async file=>JSON.parse(await readFile(path.join(root,file),'utf8'));
const catalog=await read('src/generated/catalog.json'),baseline=await read('scripts/v25/compatibility.json');
const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/';
const out=path.join(root,process.env.BROWSER_OUTPUT||'output/playwright/v25-final/compatibility');
await mkdir(out,{recursive:true});
const key='soc-learning-path:learning:v2',report={date:new Date().toISOString(),checks:[],errors:[],external:[]};
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const blank=()=>({started:true,seen:[],solved:[],cursor:0,updated:10,summary:true,completed:true,mastered:false,practice:{},attempts:{},activeAttempt:null,mistakes:{}});
const fixture={schemaVersion:2,legacy:{},lastLesson:null,records:{},awards:{},chapterAwards:catalog.modules.map(c=>c.id)};
for(const l of catalog.lessons){const old=baseline[l.id],r={...blank(),seen:old.stepIds,cursor:old.stepIds.length-1,mastered:old.questions.length>0};fixture.records[l.id]={[old.revision]:r};fixture.awards[l.id]=old.questions.length?['study','practice','summary','assessment','mastery']:['study','summary'];}
const expectedXP=Object.values(fixture.awards).reduce((n,a)=>n+(a.length===5?45:10),1300);
const url=(l,phase='introduccion')=>base+'#/leccion/'+encodeURIComponent(l.id)+'?fase='+phase;
try{
 const fresh=await browser.newContext({viewport:{width:320,height:900}}),atlas=await fresh.newPage();
 await atlas.goto(base+'#/ruta');await atlas.locator('.current-position').waitFor();
 assert.equal(await atlas.getByRole('link',{name:'Empezar mi aventura',exact:true}).getAttribute('href'),'#/leccion/'+encodeURIComponent(catalog.modules[0].lessonIds[0]));
 await atlas.locator('.prologue-station').click();await atlas.locator('.activity-surface').waitFor();
 await atlas.goto(base+'#/ruta');await atlas.locator('.current-position').waitFor();assert.equal(await atlas.locator('.current-position').getAttribute('href'),'#/ruta?nodo='+encodeURIComponent(catalog.modules[0].id));
 assert.ok(await atlas.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));report.checks.push('Apertura enriquecida: la aventura comienza en la primera región y Tu posición permanece disponible al volver de la apertura');await fresh.close();
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
 await ctx.route('**/*',r=>{const u=r.request().url();if(u.startsWith(base)||u.startsWith('blob:')||u.startsWith('data:'))return r.continue();report.external.push(u);return r.abort();});
 await ctx.addInitScript(({key,fixture})=>{if(location.protocol==='http:'&&!localStorage.getItem('v25-seeded')){localStorage.setItem(key,JSON.stringify(fixture));localStorage.setItem('v25-seeded','1');}},{key,fixture});
 const p=await ctx.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 const enriched=catalog.lessons.filter(l=>l.learning.previousRevision);
 for(const l of catalog.lessons){
  await p.goto(url(l));await p.locator('.activity-surface').waitFor();
  assert.ok((await p.locator('.profile').getAttribute('aria-label')).includes(`${expectedXP} XP`),l.id+' XP');
  assert.equal(await p.locator('.lesson-tags .learning-status').innerText(),baseline[l.id].questions.length?'Dominada':'Completada');
  assert.ok((await p.locator('.lesson-progress').innerText()).includes(`${l.learning.stepIds.length} / ${l.learning.stepIds.length}`),l.id+' pasos');
 }
 let stored=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 for(const l of catalog.lessons){
  const previous=stored.records[l.id][baseline[l.id].revision];
  // Visiting an unchanged revision updates its timestamp normally. Migrated
  // V2.4 revisions remain byte-for-byte intact beside the new revision.
  if(l.learning.previousRevision){assert.deepEqual(previous,fixture.records[l.id][baseline[l.id].revision]);assert.deepEqual(stored.records[l.id][l.learning.revision].seen,l.learning.stepIds);}
  else{assert.ok(previous.updated>=fixture.records[l.id][baseline[l.id].revision].updated);assert.deepEqual({...previous,updated:10},fixture.records[l.id][baseline[l.id].revision]);}
 }
 report.checks.push(`${catalog.lessons.length} registros V2.4, ${enriched.length} revisiones enriquecidas: pasos, completado, dominio original, XP e historial preservados al abrir`);
 const short=catalog.lessons.find(l=>l.id==='capitulo-5-almacenamiento-y-retencion/5-almacenamiento-y-retencion-1');
 const edu=(await read('public/'+short.file)).education,practice=edu.questions.find(q=>q.phase==='practice'),exam=edu.questions.find(q=>q.phase==='assessment');
 await p.goto(url(short,'practica'));await p.locator('.question-card').waitFor();
 for(const [i,id] of practice.solution.entries())await p.locator('.question-card select').nth(i).selectOption(id);
 await p.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await p.locator('.answer-feedback.correct').waitFor();
 await p.goto(url(short,'evaluacion'));await p.getByRole('button',{name:'Comenzar evaluación',exact:true}).click();await p.locator(`input[value="${exam.solution[0]}"]`).check();
 await p.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await p.getByRole('button',{name:'Ver resultados',exact:true}).click();await p.getByRole('heading',{name:'¡Dominio demostrado!',exact:true}).waitFor();
 assert.ok((await p.locator('.profile').getAttribute('aria-label')).includes(`${expectedXP+35} XP`));
 await p.screenshot({path:path.join(out,'short-reading-mastered-1440.png'),fullPage:true});
 await p.reload();await p.locator('.activity-surface').waitFor();assert.ok((await p.locator('.profile').getAttribute('aria-label')).includes(`${expectedXP+35} XP`));
 stored=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.equal(stored.records[short.id][short.learning.revision].mastered,true);
 assert.deepEqual(stored.records[short.id][baseline[short.id].revision],fixture.records[short.id][baseline[short.id].revision]);
 report.checks.push('Lectura breve: dominio real tras práctica y evaluación, +35 XP acotados sobre estudio previo, recarga e historial V2.4 conservados');
 await p.goto(base+'#/progreso');const download=p.waitForEvent('download');await p.getByRole('button',{name:'Exportar progreso',exact:true}).click();const backup=JSON.parse(await readFile(await(await download).path(),'utf8'));
 assert.deepEqual(backup.progress.records,stored.records);assert.deepEqual(backup.progress.awards,stored.awards);report.checks.push('Exportación contiene íntegramente revisiones V2.4 y V2.5');
 await ctx.close();
 // Exercise the longest real activity of each format at narrow widths, rather
 // than only the short pilot questions from V2.4.
 const allQuestions=[];
 for(const l of catalog.lessons)for(const q of (await read('public/'+l.file)).education.questions)allQuestions.push({l,q});
 const longest=[...new Set(allQuestions.map(({q})=>q.type))].map(type=>allQuestions.filter(({q})=>q.type===type).sort((a,b)=>JSON.stringify(b.q).length-JSON.stringify(a.q).length)[0]);
 report.activityAccessibility=[];
 for(const width of [320,390,768]){
  const mobile=await browser.newContext({viewport:{width,height:1000},isMobile:width<680,hasTouch:true,reducedMotion:'reduce'});
  await mobile.addInitScript(({key,fixture})=>{if(location.protocol==='http:'&&!localStorage.getItem('v25-mobile')){localStorage.setItem(key,JSON.stringify(fixture));localStorage.setItem('v25-mobile','1');}},{key,fixture});
  const m=await mobile.newPage();m.on('pageerror',e=>report.errors.push(e.message));
  for(const {l,q} of [...longest,{l:short,q:practice}]){
   await m.goto(url(l,'repaso')+'&actividad='+q.id);const card=m.locator(`[data-question="${q.id}"]`);await card.waitFor();
   assert.ok(await m.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),q.id+' ancho '+width);
   const axeAt=process.argv.indexOf('--axe-path');
   if(axeAt>=0){await m.addScriptTag({path:process.argv[axeAt+1]});const violations=await m.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})));report.activityAccessibility.push({width,id:q.id,type:q.type,violations});assert.deepEqual(violations,[],q.id+' axe '+width);}
   if(q.type==='match')for(const [i,id] of q.solution.entries())await card.locator('select').nth(i).selectOption(id);
   else if(q.type==='order')for(let i=0;i<q.solution.length;i++){
    const text=q.options.find(o=>o.id===q.solution[i]).text;
    let at=await card.locator('.ordering-rows li').evaluateAll((ns,text)=>ns.findIndex(n=>n.textContent.includes(text)),text);
    while(at>i){await card.getByRole('button',{name:'Subir paso: '+text,exact:true}).click();at--;}
   }
   else for(const id of q.solution)await card.locator(`input[value="${id}"]`).check();
   await card.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await card.locator('.answer-feedback.correct').waitFor();
   assert.ok(await m.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.equal(await m.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
   if(q.id===practice.id){await m.evaluate(()=>scrollTo(0,0));await m.screenshot({path:path.join(out,`short-reading-feedback-${width}.png`),fullPage:true});}
  }
  report.checks.push(`${width}px: cinco formatos reales extensos y la lectura breve; respuesta, feedback, sin desbordamiento y movimiento reducido`);await mobile.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);report.passed=true;
}catch(error){report.passed=false;report.failure=error.stack;process.exitCode=1;console.error(error);}
finally{await browser.close();await writeFile(path.join(out,'compatibility-results.json'),JSON.stringify(report,null,2)+'\n');}
console.log(report.checks);
