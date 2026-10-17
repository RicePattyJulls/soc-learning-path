import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright-core';
import {runReaderIsolationMatrix} from './splunk-v122-isolation.mjs';
const arg=(n,f)=>{const at=process.argv.indexOf(n);return at<0?f:process.argv[at+1];};
const base=arg('--base-url','http://127.0.0.1:5187/');assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/);
const out=arg('--output-dir','output/playwright/splunk-v122/'+new Date().toISOString().replaceAll(/[:.]/g,'-'));
assert.ok(/^output\/playwright\/splunk-v122\/[\w/-]+$/.test(out)&&!out.includes('..'));await mkdir(out,{recursive:true});
const read=async f=>JSON.parse(await readFile(f));
const catalog=await read('src/generated/splunk/catalog.json'),sc=await read('src/generated/catalog.json');
const lessons=await Promise.all(catalog.lessons.map(l=>read('public/'+l.file)));
const first=catalog.lessons[0],scFirst=sc.modules[0].lessonIds[0];
const spKey='soc-learning-path:splunk:learning:v1',scKey='soc-learning-path:learning:v2',legacyKey='soc-learning-path:progress:v1';
const report={date:new Date().toISOString(),base,status:'not_started',checks:[],errors:[],external:[],accessibility:[],measurements:[],comparisons:[],visualVerdict:'pending_human_comparison',zoom:'manual_browser_zoom_pending'};
let browser;
const url=(id,phase='mision',step)=>base+`#/splunk/leccion/${id}?fase=${phase}${step?'&paso='+step:''}`;
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<=1,`${label}: SC-200 ${a}, Splunk ${b}`);
async function settle(page){await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function axe(page,name,width){
  await page.addScriptTag({path:'output/v25/reanudacion/axe.min.js'});
  const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});const summarize=v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))});return {violations:r.violations.map(summarize),incomplete:r.incomplete.map(summarize)};});
  report.accessibility.push({name,width,...result});assert.deepEqual(result.violations,[],`axe ${name}/${width}`);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${name}/${width}`);
  assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
}
async function measure(page,name,width){
  await settle(page);await page.evaluate(()=>scrollTo(0,0));
  const result=await page.evaluate(()=>{
    const box=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return {x:r.x,y:r.y,width:r.width,height:r.height,padding:c.padding,fontSize:c.fontSize,lineHeight:c.lineHeight,borderRadius:c.borderRadius,borderTopWidth:c.borderTopWidth,boxShadow:c.boxShadow};};
    return {shell:box('.academy-lesson'),left:box('.lesson-phases'),surface:box('.activity-surface'),right:box('.academy-splunk'),title:box('.lesson-title-row h1'),heading:box('.activity-surface h2'),button:box('.lesson-phases nav button'),primary:box('.activity-surface .button.primary'),grid:getComputedStyle(document.querySelector('.academy-grid')).gridTemplateColumns};
  });
  report.measurements.push({name,width,...result});await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true});await page.screenshot({path:path.join(out,`${name}-${width}-viewport.png`),fullPage:false});return result;
}
try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:!process.argv.includes('--headed'),args:['--no-sandbox']});report.browser=browser.version();report.status='running';
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
  context.on('page',page=>page.on('pageerror',e=>report.errors.push(e.message)));
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():(report.external.push(route.request().url()),route.abort()));
  const page=await context.newPage();
  for(const width of [320,390,768,1440,1920]){
    await page.setViewportSize({width,height:1000});
    await page.goto(base+'#/leccion/'+scFirst+'?fase=introduccion');await page.locator('.activity-surface').waitFor();
    const master=await measure(page,'sc200-mision',width);await axe(page,'sc200-mision',width);
    await page.goto(url(first.id));await page.locator('.sp-reader .activity-surface').waitFor();
    const target=await measure(page,'splunk-mision',width);await axe(page,'splunk-mision',width);
    for(const part of ['shell','left','surface','right']){near(master[part].x,target[part].x,part+' posición');near(master[part].width,target[part].width,part+' anchura');}
    near(master.button.height,target.button.height,'Botón de etapa');assert.equal(master.grid,target.grid);
    for(const part of ['title','heading','surface','button','primary'])for(const key of ['padding','fontSize','lineHeight','borderRadius','borderTopWidth','boxShadow'])assert.equal(target[part][key],master[part][key],`${part} ${key}/${width}`);
    assert.equal(await page.locator('.lesson-phases nav button').count(),5);assert.equal(await page.locator('.sp-phases').count(),0);
    report.comparisons.push({width,container:target.shell.width,left:target.left.width,center:target.surface.width,right:target.right.width,grid:target.grid});
    const learn=page.getByRole('button',{name:'Aprende',exact:true});await learn.focus();await page.keyboard.press('Space');await page.locator('[data-editorial-section]').waitFor();
    await page.waitForFunction(()=>document.activeElement?.matches('.activity-surface h2'));
    const focus=await page.locator('.activity-surface h2').evaluate(el=>getComputedStyle(el).outlineStyle);assert.notEqual(focus,'none');
    for(const phase of ['estudio','practica','resumen','teoria','repaso','soluciones','referencias','original']){
      await page.goto(url(first.id,phase,phase==='estudio'?1:undefined));await page.locator('.sp-reader').waitFor();await settle(page);await axe(page,'splunk-'+phase,width);
    }
    await page.goto(base+'#/splunk/recursos/SP-R03');await page.locator('.splunk-markdown pre').first().waitFor();await axe(page,'recursos-r03',width);
    const code=page.locator('.splunk-markdown pre').first();await code.focus();assert.ok(await code.evaluate(el=>document.activeElement===el));
    assert.equal(await code.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(23, 45, 78)');
    assert.equal(await code.locator('code').evaluate(el=>getComputedStyle(el).color),'rgb(224, 233, 247)');
  }
  report.checks.push('Misión SC-200/Splunk: cinco anchos, mismas columnas, tipografía, card/botones/sombras; teclado/foco; nueve fases y R03 con axe estricto/reduced motion');
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'#/ruta');await page.locator('.world-atlas').waitFor();await settle(page);
  const original=await page.evaluate(({scKey,legacyKey})=>({sc:localStorage.getItem(scKey),legacy:localStorage.getItem(legacyKey)}),{scKey,legacyKey});
  const scProfile=await page.locator('.profile').getAttribute('aria-label');
  await page.addInitScript(({scKey,legacyKey})=>{window.__readerScCalls=[];for(const name of ['getItem','setItem','removeItem']){const original=Storage.prototype[name];Storage.prototype[name]=function(key,...args){if([scKey,legacyKey].includes(key))window.__readerScCalls.push([name,key]);return original.call(this,key,...args);};}},{scKey,legacyKey});
  const assertIsolated=async()=>assert.deepEqual(await page.evaluate(()=>window.__readerScCalls),[]);
  const study=async data=>{
    await page.goto(url(data.id,'estudio',1));await page.locator('[data-editorial-section]').waitFor();
    for(let i=0;i<5;i++)await page.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click();
    await page.locator('[data-formative]').waitFor();
    const profile=await page.locator('.sp-profile').getAttribute('aria-label');
    await page.locator('textarea').fill('Reflexión sintética de prueba; no se guarda.');await page.getByRole('button',{name:'Registrar práctica consultada (sin nota ni XP)',exact:true}).click();
    assert.equal(await page.locator('.sp-profile').getAttribute('aria-label'),profile);
    await page.getByRole('button',{name:'Conecta ideas',exact:true}).click();await page.getByRole('button',{name:'Confirmar resumen estudiado',exact:true}).click();await page.getByRole('link',{name:'Ir a teoría piloto',exact:true}).click();
  };
  const exam=async(data,fail=false)=>{
    await page.getByRole('button',{name:/Comenzar evaluación piloto|Iniciar nuevo intento/}).click();await page.locator('[data-active-exam]').waitFor();
    assert.equal(await page.locator('.lesson-phases nav button').count(),5);assert.equal(await page.locator('.lesson-phases nav button:disabled').count(),4);
    for(const [i,q] of data.questions.entries()){
      await page.locator(`input[value="${fail&&i===0?q.options.find(o=>o.id!==q.solution).id:q.solution}"]`).check();assert.equal(await page.getByText(q.explanation,{exact:true}).count(),0);assert.equal(await page.locator(`[data-question="${q.id}"] input:enabled`).count(),0);
    }
    const record=await page.evaluate(({key,id,revision})=>JSON.parse(localStorage.getItem(key)).records[id][revision],{key:spKey,id:data.id,revision:data.revision});
    const attempt=record.attempts[record.activeAttempt];await page.reload();await page.locator('[data-active-exam]').waitFor();
    for(const [id,answer] of Object.entries(attempt.answers))assert.ok(await page.locator(`input[value="${answer.optionId}"]`).isChecked(),id);
    for(const phase of ['mision','estudio','practica','resumen','repaso','soluciones','referencias','original']){
      await page.goto(url(data.id,phase));await page.getByRole('heading',{name:'Evaluación en curso',exact:true}).waitFor();for(const q of data.questions)assert.equal(await page.getByText(q.explanation,{exact:true}).count(),0);assert.equal(await page.locator('[data-formative]').count(),0);
    }
    const other=catalog.lessons.find(l=>l.id!==data.id);await page.goto(url(other.id,'original'));await page.getByRole('heading',{name:'Tienes una evaluación en curso',exact:true}).waitFor();
    await page.goto(base+'#/splunk/recursos/SP-R03');await page.getByRole('heading',{name:'Recursos pausados durante la evaluación',exact:true}).waitFor();
    await page.goto(url(data.id,'teoria'));await page.locator('[data-active-exam]').waitFor();await page.getByRole('button',{name:'Finalizar evaluación y ver resultado',exact:true}).click();
    await page.getByRole('heading',{name:fail?'Necesitas repasar la teoría':'Teoría aprobada en piloto',exact:true}).waitFor();
    await assertIsolated();
  };
  await study(lessons[0]);await exam(lessons[0],true);assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('10 XP provisionales'));
  await exam(lessons[0]);
  const review=async()=>{await page.getByRole('link',{name:'Repaso',exact:true}).click();await page.getByRole('button',{name:/Confirmar repaso/}).click();};
  await review();assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('30 XP provisionales'));
  for(const [i,data] of lessons.slice(1).entries()){await study(data);await exam(data);await review();if(i===16){assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('840 XP provisionales'));report.checks.push('Primeras 18 lecciones conservadas: 840 XP provisionales antes de R04');}}
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('3500 XP provisionales'));await page.reload();await page.locator('.sp-reader').waitFor();
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),spKey);
  assert.deepEqual(saved.regionAwards,catalog.regions.map(r=>r.id));assert.equal(Object.keys(saved.records).length,80);assert.equal(Object.keys(saved.records[first.id][first.revision].attempts).length,2);
  for(const revisions of Object.values(saved.records))for(const record of Object.values(revisions)){assert.equal(record.practicalStatus,'not_assessed');assert.equal(record.theoryPassed,true);}
  await page.getByRole('button',{name:'Repaso registrado',exact:true}).click();assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('3500 XP provisionales'));
  await assertIsolated();
  await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.id==='sp-node-SP-R11-L07');
  await page.goBack();await page.locator('.sp-reader').waitFor();await page.goForward();await page.locator('.sp-map-page').waitFor();
  const unchanged=await page.evaluate(({scKey,legacyKey})=>({sc:localStorage.getItem(scKey),legacy:localStorage.getItem(legacyKey)}),{scKey,legacyKey});assert.deepEqual(unchanged,original);
  await page.locator('.academy-selector a[href="#/ruta"]').click();await page.locator('.world-atlas').waitFor();assert.equal(await page.locator('.profile').getAttribute('aria-label'),scProfile);
  report.checks.push('80 lecciones: 400 pasos, Q01/Q02/P01, 1/2 falla y 2/2 aprueba, intentos/primeras respuestas tras recarga, rutas de soluciones bloqueadas, 3500 XP únicos y SC-200 intacto');
  await context.close();
  await runReaderIsolationMatrix({browser,base,sc,catalog,lessons,report});
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);report.status='passed_automated_visual_review_pending';
}catch(error){report.status=browser?'failed':'blocked_browser_launch';report.failure=error.stack;process.exitCode=1;}
finally{
  await browser?.close();report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'resultados.json'),JSON.stringify(report,null,2)+'\n');
  await writeFile(path.join(out,'matriz.md'),'# Comparación DOM del lector\n\nEstado: '+report.status+'\n\n| Ancho | Contenedor | Izquierda | Centro | Derecha | Grid |\n| --- | --- | --- | --- | --- | --- |\n'+report.comparisons.map(r=>`| ${r.width} | ${r.container} | ${r.left} | ${r.center} | ${r.right} | ${r.grid} |`).join('\n')+'\n');
  await writeFile(path.join(out,'index.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><title>Lector SC-200 / Splunk</title><style>body{font:16px sans-serif;margin:20px;background:#f1f6ff}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{min-width:0;margin:0}img{width:100%}</style><h1>Lector SC-200 / Splunk</h1><p>${report.status}. Comparación humana pendiente.</p><main>${report.measurements.map(m=>`<figure><figcaption>${m.name} · ${m.width}px</figcaption><a href="${m.name}-${m.width}.png"><img alt="${m.name} a ${m.width} px" src="${m.name}-${m.width}-viewport.png"></a></figure>`).join('')}</main></html>`);
  console.log(path.join(out,'resultados.json'));
}
