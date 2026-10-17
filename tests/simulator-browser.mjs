import assert from 'node:assert/strict';import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {chromium} from 'playwright-core';
import {scenarios,simulatorUrl} from '../src/simulator/scenarios.ts';import {solutions} from './simulator-fixtures.ts';
const arg=(name,fallback)=>{const at=process.argv.indexOf(name);return at<0?fallback:process.argv[at+1];};
const base=arg('--base-url','http://127.0.0.1:5187/');assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/);
const out=arg('--output-dir','output/playwright/soc-simulator-v1/'+new Date().toISOString().replaceAll(/[:.]/g,'-'));assert.ok(/^output\/playwright\/soc-simulator-v1\/[\w/-]+$/.test(out)&&!out.includes('..'));await mkdir(out,{recursive:true});
const report={date:new Date().toISOString(),base,status:'not_started',checks:[],journeys:[],accessibility:[],screenshots:[],errors:[],external:[],historicalAtlas:'V2.0 pendiente de navegador; paridad-dom 320 px sigue abierta, no evaluada por esta suite',visualVerdict:'not_observed'};let browser;
const keys=['soc-learning-path:learning:v2','soc-learning-path:progress:v1','soc-learning-path:splunk:learning:v1'];
async function axe(page,name,width){await page.addScriptTag({path:'output/v25/reanudacion/axe.min.js'});const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});const summarize=v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))});return {violations:r.violations.map(summarize),incomplete:r.incomplete.map(summarize)};});report.accessibility.push({name,width,...result});assert.deepEqual(result.violations,[],`axe ${name}/${width}`);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Sin overflow horizontal');}
async function context(width){const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',acceptDownloads:true});context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():(report.external.push(r.request().url()),r.abort()));return context;}
async function educationalBaseline(page){
 await page.goto(base+'#/ruta');await page.locator('.world-atlas').waitFor();await page.goto(base+'#/splunk/ruta');await page.locator('.sp-world-control').first().waitFor();
 const before=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),keys);
 await page.addInitScript(keys=>{window.__simStorageCalls=[];window.__simGet=Storage.prototype.getItem;for(const name of ['getItem','setItem','removeItem']){const original=Storage.prototype[name];Storage.prototype[name]=function(k,...args){if(keys.includes(k))window.__simStorageCalls.push([name,k]);return original.call(this,k,...args);};}},keys);
 return before;
}
async function nativeValues(page){return page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,window.__simGet.call(localStorage,k)])),keys);}
// Field wraps controls: exact label text includes select options and populated textarea text.
// Use native roles and exact accessible names, stable across edits, submission and reload.
// datetime-local has no implicit role; its input contributes no label text, so getByLabel is exact.
async function complete(page,s,width,wrong=false){
 const answer=solutions[s.id];await page.goto(base+simulatorUrl(s.platform,s.id));await page.getByRole('button',{name:'Iniciar investigación',exact:true}).waitFor();
 const requested=[];const listener=request=>requested.push(request.url());page.on('request',listener);
 await page.getByRole('button',{name:'Iniciar investigación',exact:true}).click();await page.getByRole('combobox',{name:'Categoría inicial',exact:true}).waitFor();
 assert.equal(await page.locator('.sim-evaluation').count(),0);assert.equal(await page.getByRole('heading',{name:'Explicación educativa',exact:true}).count(),0);
 await page.getByRole('combobox',{name:'Categoría inicial',exact:true}).selectOption(answer.category);await page.getByRole('textbox',{name:'Entidad investigada',exact:true}).fill(answer.entity);
 await page.getByLabel('Inicio del alcance (UTC)',{exact:true}).fill(answer.start.slice(0,16));await page.getByLabel('Fin del alcance (UTC, exclusivo)',{exact:true}).fill(answer.end.slice(0,16));
 if(s.extendedSnapshot){await page.getByRole('searchbox',{name:'Texto literal en eventos',exact:true}).fill('A021');assert.equal(await page.getByRole('checkbox',{name:'Seleccionar evidencia A021',exact:true}).count(),0);await page.getByRole('button',{name:'Revisar llegadas hasta '+s.extendedSnapshot.replace('T',' ').replace('Z',' UTC'),exact:true}).click();await page.getByRole('checkbox',{name:'Seleccionar evidencia A021',exact:true}).waitFor();}
 for(const id of answer.selected){await page.getByRole('searchbox',{name:'Texto literal en eventos',exact:true}).fill(id);await page.getByRole('button',{name:'Examinar '+id,exact:true}).click();await page.getByRole('region',{name:'Campos del evento '+id,exact:true}).waitFor();await page.getByRole('checkbox',{name:'Seleccionar evidencia '+id,exact:true}).check();}
 // A saved draft survives reload with its evidence and snapshot intact.
 await page.reload();await page.getByRole('textbox',{name:'Hipótesis de trabajo y explicación rival',exact:true}).waitFor();
 const ownKey=`soc-learning-path:simulator:${s.platform}:v1`;
 let saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),ownKey);assert.deepEqual(saved.attempts[s.id][0].selected,answer.selected);
 await page.getByRole('textbox',{name:'Hipótesis de trabajo y explicación rival',exact:true}).fill('Contrastar hechos, autorización y límites de cobertura. Una coincidencia temporal no basta para atribuir actividad adversaria.');
 for(const [i,link] of answer.links.entries()){
  await page.getByRole('combobox',{name:'Afirmación a contrastar',exact:true}).selectOption(link[0]);await page.getByRole('combobox',{name:'Postura ante la afirmación',exact:true}).selectOption('supports');
  for(const id of link.slice(1))await page.getByRole('checkbox',{name:'Vincular '+id,exact:true}).check();
  await page.getByRole('textbox',{name:'Razonamiento de la relación',exact:true}).fill('Estos IDs documentan la relación entre entidades, tiempo y fuente; no se extrapolan hechos ausentes.');await page.getByRole('button',{name:'Guardar relación de evidencias',exact:true}).click();await page.waitForFunction(n=>document.querySelectorAll('.sim-relations>li').length===n,i+1);
 }
 await page.getByRole('combobox',{name:'Clasificación final',exact:true}).selectOption(wrong?'incident':answer.verdict);await page.getByRole('combobox',{name:'Prioridad propuesta',exact:true}).selectOption(answer.priority);await page.getByRole('combobox',{name:'Escalar a otro analista',exact:true}).selectOption(answer.escalate);await page.getByRole('textbox',{name:'Justificación y alternativa considerada',exact:true}).fill('La clasificación se limita a los hechos y relaciones registrados. Se reconoce incertidumbre y se propone revisión proporcional.');
 for(const action of answer.actions){const label=s.actions.find(a=>a.id===action).label;await page.getByRole('checkbox',{name:label,exact:true}).check();}
 for(const field of ['Resumen ejecutivo','Alcance y cobertura','Interpretación de indicadores','Impacto y limitaciones','Acciones recomendadas y responsable','Conclusión del informe'])await page.getByRole('textbox',{name:field,exact:true}).fill('Informe sintético: hechos con sus IDs, ventana UTC y corte de disponibilidad. La conclusión queda limitada al soporte observado; solicitar revisión del responsable.');
 await page.getByRole('combobox',{name:'Impacto acreditado',exact:true}).selectOption(wrong?'exfiltration':answer.impact);for(const id of answer.selected)await page.getByRole('checkbox',{name:'Citar '+id,exact:true}).check();await page.getByRole('checkbox',{name:'Indicador '+answer.indicator,exact:true}).check();
 assert.ok(!requested.some(url=>/\/grading\.|\/rubrics\./.test(url)),'Solucionario no solicitado durante el borrador');
 await page.getByRole('button',{name:'Finalizar y evaluar investigación',exact:true}).click();await page.getByRole('region',{name:'Evaluación de entrenamiento',exact:true}).waitFor();
 saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),ownKey);const finished=saved.attempts[s.id][0];assert.equal(finished.evaluation.humanReview,'pending');if(wrong){assert.ok(finished.evaluation.score<=59);assert.equal(finished.evaluation.passed,false);}else assert.equal(finished.evaluation.score,100);
 assert.ok(await page.getByRole('textbox',{name:'Resumen ejecutivo',exact:true}).isDisabled());await axe(page,s.id+(wrong?'-negative':'-finished'),width);
 const screenshot=`${s.id}-${width}${wrong?'-negative':''}.png`;await page.screenshot({path:path.join(out,screenshot),fullPage:true});report.screenshots.push(screenshot);
 await page.reload();await page.getByRole('region',{name:'Evaluación de entrenamiento',exact:true}).waitFor();assert.ok((await page.locator('.sim-score').textContent()).includes(String(finished.evaluation.score)));
 await page.getByRole('button',{name:'Iniciar nuevo intento',exact:true}).click();await page.getByRole('button',{name:'Finalizar y evaluar investigación',exact:true}).waitFor();assert.equal(await page.locator('.sim-evaluation').count(),0);
 saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),ownKey);assert.equal(saved.attempts[s.id].length,2);assert.deepEqual(saved.attempts[s.id][0],finished);assert.deepEqual(saved.attempts[s.id][1].selected,[]);
 assert.deepEqual(await page.evaluate(()=>window.__simStorageCalls),[],'Simulador no toca claves educativas');page.off('request',listener);
 report.journeys.push({scenario:s.id,width,wrong,score:finished.evaluation.score,completed:true,draftRecovered:true,retryKeptHistory:true});
}
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:!process.argv.includes('--headed'),args:['--no-sandbox']});report.browser=browser.version();report.status='running';
 for(const width of [390,1440])for(const s of scenarios){const ctx=await context(width),page=await ctx.newPage();const before=await educationalBaseline(page);await complete(page,s,width);assert.deepEqual(await nativeValues(page),before);await ctx.close();}
 const negative=await context(1440),np=await negative.newPage();const original=await educationalBaseline(np);await complete(np,scenarios[1],1440,true);assert.deepEqual(await nativeValues(np),original);await negative.close();
 for(const width of [320,390,768,1440,1920]){
  const ctx=await context(width),page=await ctx.newPage();
  for(const platform of ['microsoft','splunk']){
   await page.goto(base+(platform==='splunk'?'#/splunk/ruta':'#/ruta'));const entry=page.getByRole('navigation',{name:'Elegir academia',exact:true}).getByRole('link',{name:'Centro SOC · Simulador',exact:true});await entry.waitFor();assert.equal(await entry.getAttribute('href'),'#/simulador/'+platform);await entry.click();await page.getByRole('heading',{name:'Tu turno en el SOC',exact:true}).waitFor();await axe(page,platform+'-inbox',width);
   const s=scenarios.find(s=>s.platform===platform);await page.goto(base+simulatorUrl(platform,s.id));await page.getByRole('button',{name:'Iniciar investigación',exact:true}).click();await page.getByRole('combobox',{name:'Categoría inicial',exact:true}).waitFor();await page.getByRole('searchbox',{name:'Texto literal en eventos',exact:true}).focus();assert.ok(await page.getByRole('searchbox',{name:'Texto literal en eventos',exact:true}).evaluate(e=>document.activeElement===e));await axe(page,platform+'-desk',width);assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
   await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement&&document.activeElement!==document.body));
   const screenshot=`${platform}-desk-${width}.png`;await page.screenshot({path:path.join(out,screenshot),fullPage:true});report.screenshots.push(screenshot);
  }
  await ctx.close();
 }
 // Educational routes still resolve after adding the independent dispatcher.
 const ctx=await context(1440),page=await ctx.newPage();const sc=JSON.parse(await readFile('src/generated/catalog.json')),sp=JSON.parse(await readFile('src/generated/splunk/catalog.json'));
 for(const [hash,selector] of [['#/ruta','.world-atlas'],['#/capitulo/'+sc.modules[0].id,'.chapter-page'],['#/leccion/'+sc.lessons[0].id+'?fase=introduccion','.academy-lesson'],['#/splunk/ruta','.sp-world-control'],['#/splunk/region/SP-R02','.sp-world-control'],['#/splunk/leccion/'+sp.lessons[0].id+'?fase=mision','.sp-reader']]){await page.goto(base+hash);await page.locator(selector).first().waitFor();report.checks.push('Ruta educativa: '+hash);}
 await ctx.close();assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);report.status='passed_automated_human_review_pending';report.visualVerdict='screenshots_available_for_human_review';
}catch(error){report.status=browser?'failed':'blocked_browser_launch';report.failure=error.stack;process.exitCode=1;}
finally{await browser?.close();report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'resultados.json'),JSON.stringify(report,null,2)+'\n');await writeFile(path.join(out,'index.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><title>SOC Simulator V1</title><h1>SOC Simulator V1</h1><p>${report.status}</p>${report.screenshots.map(file=>`<figure><figcaption>${file}</figcaption><a href="${file}"><img src="${file}" alt="${file}" style="max-width:100%"></a></figure>`).join('')}</html>`);console.log(path.join(out,'resultados.json'));}
