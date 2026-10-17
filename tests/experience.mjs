import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,process.env.BROWSER_OUTPUT||'output/playwright/v24-premium-world/experience');await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(path.join(root,'src/generated/catalog.json'),'utf8')),first=catalog.modules[0];
const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/',legacyKey='soc-learning-path:progress:v1';
const report={date:new Date().toISOString(),base,checks:[],motion:[],errors:[],consoleErrors:[],external:[]};
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
async function context(width=1440,reducedMotion='no-preference',legacyIds=[]){
 const c=await browser.newContext({viewport:{width,height:width===390?844:1080},isMobile:width===390,hasTouch:width===390,reducedMotion});
 c.on('page',p=>{p.on('pageerror',e=>report.errors.push(e.message));p.on('console',e=>{if(e.type()==='error')report.consoleErrors.push(e.text());});});
 await c.route('**/*',r=>{if(r.request().url().startsWith(base)||/^(data|blob):/.test(r.request().url()))return r.continue();report.external.push(r.request().url());return r.abort();});
 await c.addInitScript(({ids,lessons,key})=>{
  window.__motions=[];const original=Element.prototype.animate;
  Element.prototype.animate=function(frames,options){window.__motions.push({target:typeof this.className==='string'?this.className:this.tagName,frames,options});return original.call(this,frames,options);};
  if(ids.length&&location.protocol==='http:'&&!localStorage.getItem('experience-fixture')){localStorage.setItem(key,JSON.stringify({schemaVersion:1,completed:Object.fromEntries(ids.map(id=>[id,lessons.find(l=>l.id===id).version])),lastLesson:null}));localStorage.setItem('experience-fixture','1');}
 },{ids:legacyIds,lessons:catalog.lessons,key:legacyKey});return c;
}
const check=async(name,fn)=>{await fn();report.checks.push(name);console.log('PASS UX',name);};
const frames=p=>p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
async function open(p,hash,selector='.adventure-map'){await p.goto(base+hash);await p.locator(selector).first().waitFor();await frames(p);}
async function nodeContext(p,id){
 await p.waitForFunction(id=>document.activeElement?.closest('[data-station]')?.dataset.station===id,id);
 const data=await p.locator(`[data-station="${id}"] .station-action`).evaluate(n=>{const r=n.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {top:r.top,bottom:r.bottom,viewport:innerHeight,hit:hit?.closest('.station-action')===n};});
 assert.ok(data.top>=0&&data.bottom<=data.viewport,'Nodo visible al regresar: '+JSON.stringify(data));assert.equal(data.hit,true,'La navegación sticky no intercepta el nodo');
}
try{
 for(const width of [390,1440,2560]){
  const c=await context(width),p=await c.newPage();
  await check(`posición real y pulsación/liberación ${width}`,async()=>{
   await open(p,'#/ruta');const position=p.locator('.current-position');await position.hover();await p.mouse.down();await p.waitForTimeout(70);const pressed=await position.evaluate(n=>getComputedStyle(n).transform);assert.notEqual(pressed,'none');await p.mouse.up();await p.waitForTimeout(180);assert.equal(await position.evaluate(n=>getComputedStyle(n).transform),'none');await nodeContext(p,first.id);
   await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await position.click();await nodeContext(p,first.id);
  });
  await check(`entrada, historial y regreso al nodo ${width}`,async()=>{
   await p.locator(`[data-station="${first.id}"] a`).click();await p.locator('.pilot-region').waitFor();await frames(p);
   assert.ok(await p.evaluate(()=>window.__motions.some(m=>m.target.includes('region-welcome'))));
   await p.goBack();await nodeContext(p,first.id);await p.goForward();await p.locator('.pilot-region').waitFor();
   const id=first.lessonIds[0];await p.locator(`[data-station="${id}"] a`).click();await p.locator('.activity-surface').waitFor();await frames(p);
   assert.ok(await p.evaluate(()=>window.__motions.some(m=>m.target.includes('activity-surface'))));
   await p.goBack();await nodeContext(p,id);
   const prior=await p.evaluate(()=>window.__motions.length);await p.locator(`[data-station="${id}"] a`).press('Enter');await p.locator('.activity-surface').waitFor();await frames(p);assert.equal(await p.evaluate(()=>window.__motions.length),prior,'Teclado sin llegada animada');
   await p.locator('.academy-lesson>.back-link').press('Enter');await nodeContext(p,id);
  });
  await check(`selector persistente, 13 destinos y requisitos con Escape ${width}`,async()=>{
   for(const chapter of catalog.modules){await p.getByRole('combobox').selectOption(chapter.id);await p.waitForFunction(title=>document.querySelector('h1')?.textContent===title,chapter.title);assert.equal(await p.getByRole('combobox').inputValue(),chapter.id);}
   await p.getByRole('combobox').selectOption(catalog.modules[1].id);await p.locator('.notice').waitFor();await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight*.7));
   const sticky=await p.locator('.region-navigation').evaluate(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom};});assert.ok(sticky.top>=0&&sticky.top<15&&sticky.bottom<(width===390?844:1080));
   assert.ok((await p.getByRole('combobox').locator('option:checked').innerText()).includes('Bloqueada'));
   const button=p.locator('.map-station button').first();await button.scrollIntoViewIfNeeded();await button.press('Enter');await p.locator('.map-lock-notice').waitFor();assert.equal(await p.evaluate(()=>document.activeElement.className),'map-lock-notice');await p.keyboard.press('Escape');assert.equal(await p.locator('.map-lock-notice').count(),0);assert.ok(await button.evaluate(n=>document.activeElement===n));
   assert.ok((await p.locator('.profile').getAttribute('aria-label')).includes('0 XP'));
  });
  await p.screenshot({path:path.join(out,`orientation-${width}.png`),fullPage:true});
  report.motion.push({width,events:await p.evaluate(()=>window.__motions)});await c.close();
 }
 for(const width of [390,1440]){
  const c=await context(width,'reduce'),p=await c.newPage();
  await check(`movimiento reducido también al pulsar y navegar ${width}`,async()=>{
   await open(p,'#/ruta');await p.locator(`[data-station="${first.id}"] a`).click();await p.locator('.pilot-region').waitFor();await p.locator('.map-station a').first().click();await p.locator('.activity-surface').waitFor();
   const button=p.getByRole('button',{name:'Empezar a aprender',exact:true});await button.hover();await p.mouse.down();await p.waitForTimeout(60);assert.equal(await button.evaluate(n=>getComputedStyle(n).transform),'none');await p.mouse.up();await p.locator('[data-phase="aprende"]').waitFor();await frames(p);
   assert.equal(await p.evaluate(()=>window.__motions.length),0,'Sin transformaciones WAAPI con movimiento reducido');
   await p.locator('.academy-lesson>.back-link').click();await nodeContext(p,first.lessonIds[0]);await p.waitForTimeout(250);assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
  });await c.close();
 }
 await check('feedback de actividad visible y enfocado con fundamento intacto',async()=>{
  const c=await context(390,'no-preference',[first.lessonIds[0]]),p=await c.newPage(),lesson=catalog.lessons.find(l=>l.id===first.lessonIds[0]);
  const edu=JSON.parse(await readFile(path.join(root,'public',lesson.file),'utf8')).education;
  await open(p,'#/leccion/'+encodeURIComponent(lesson.id)+'?fase=practica','.question-card');const q=edu.questions.find(q=>q.phase==='practice');
  await p.locator(`.question-card input[value="${q.solution[0]}"]`).check();await p.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await p.locator('.answer-feedback.correct').waitFor();await frames(p);
  assert.ok(await p.locator('.answer-feedback').evaluate(n=>document.activeElement===n));assert.ok((await p.locator('.answer-feedback').innerText()).includes(q.explanation));
  const r=await p.locator('.answer-feedback').boundingBox();assert.ok(r.y>=70&&r.y<844);assert.ok(await p.evaluate(()=>window.__motions.some(m=>m.target.includes('answer-feedback'))));
  const back=await p.locator('.academy-lesson>.back-link').boundingBox();assert.ok(back.y>=0&&back.y<15);await p.screenshot({path:path.join(out,'activity-feedback-390.png'),fullPage:true});await c.close();
 });
 await check('completar capítulo: nivel, XP únicos, desbloqueo real, nodo y cofre sincronizados',async()=>{
  const ids=[...first.lessonIds.slice(0,-1),...catalog.modules[1].lessonIds.slice(0,5)],c=await context(1440,'no-preference',ids);
  const atlas=await c.newPage();await open(atlas,'#/ruta');await atlas.locator('.atlas-tools>p').click();
  const region=await c.newPage();await open(region,'#/capitulo/'+encodeURIComponent(first.id));await region.locator('.region-welcome h2').click();
  const study=await c.newPage(),lesson=catalog.lessons.find(l=>l.id===first.lessonIds.at(-1));await open(study,'#/leccion/'+encodeURIComponent(lesson.id),'.activity-surface');
  const legacy=await study.evaluate(key=>localStorage.getItem(key),legacyKey);assert.ok((await study.locator('.profile').getAttribute('aria-label')).includes('200 XP'));
  await study.getByRole('button',{name:'Empezar a aprender',exact:true}).click();for(const step of lesson.learning.stepIds)await study.getByRole('button',{name:'Lo entiendo · continuar',exact:true}).click();
  const education=JSON.parse(await readFile(path.join(root,'public',lesson.file),'utf8')).education;
  for(const [index,q] of education.questions.filter(q=>q.phase==='practice').entries()){
   await study.getByRole('button',{name:`Actividad ${index+1}`,exact:true}).click();
   const card=study.locator(`[data-question="${q.id}"]`);
   if(q.type==='match'){for(const [i,id] of q.solution.entries())await card.locator('select').nth(i).selectOption(id);}
   else {for(const id of q.solution)await card.locator(`input[value="${id}"]`).check();}
   await card.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();await card.locator('.answer-feedback.correct').waitFor();
  }
  if(education.questions.some(q=>q.phase==='practice'))await study.getByRole('button',{name:'Ir al resumen',exact:true}).click();
  const expectedXP=310+(education.questions.some(q=>q.phase==='practice')?5:0);
  await study.getByRole('button',{name:'Marcar como completada',exact:true}).click();await study.locator('.completion-feedback.visible').waitFor();assert.ok((await study.locator('.profile').getAttribute('aria-label')).includes(`${expectedXP} XP`));
  // This fixture already completed five readings there in V1; unlocking it must
  // preserve those readings and show En curso, rather than reset the region.
  await atlas.waitForFunction(id=>document.querySelector(`[data-station="${id}"]`)?.dataset.state==='in-progress',catalog.modules[1].id);
  await region.locator('.map-treasure.earned').waitFor();await region.waitForFunction(()=>window.__motions.some(m=>m.target.includes('treasure-lift')));
  assert.ok(await atlas.evaluate(()=>window.__motions.some(m=>m.target.includes('station-platform'))));assert.ok(await study.evaluate(()=>window.__motions.some(m=>m.target.includes('avatar'))));
  assert.ok((await study.locator('.site-header [role="status"]').innerText()).includes('Nuevo nivel: 2'));assert.ok((await study.locator('.completion-feedback').innerText()).includes('Etapa completada'));
  await study.reload();await study.locator('.activity-surface').waitFor();assert.ok((await study.locator('.profile').getAttribute('aria-label')).includes(`${expectedXP} XP`));assert.equal(await study.evaluate(key=>localStorage.getItem(key),legacyKey),legacy);
  await region.reload();await region.locator('.map-treasure.earned').waitFor();await frames(region);assert.equal(await region.evaluate(()=>window.__motions.filter(m=>m.target.includes('treasure-lift')).length),0,'No repite celebración al revisitar');
  report.motion.push({rewardEvents:await atlas.evaluate(()=>window.__motions),chapterEvents:await study.evaluate(()=>window.__motions)});
  await atlas.screenshot({path:path.join(out,'unlocked-region-1440.png'),fullPage:true});await region.screenshot({path:path.join(out,'earned-chest-1440.png'),fullPage:true});await c.close();
 });
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.external,[]);
}catch(error){report.failure=error.stack;console.error(error);process.exitCode=1;}finally{await browser.close();await writeFile(path.join(out,'experience-results.json'),JSON.stringify(report,null,2));}
