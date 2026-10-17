import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,process.env.BROWSER_OUTPUT || 'output/playwright/v24-premium-world/accessibility');
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(path.join(root,'src/generated/catalog.json'),'utf8'));
const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/';
const at=process.argv.indexOf('--axe-path'),axe=at>=0?process.argv[at+1]:path.join(root,'output/axe.min.js');
await readFile(axe);
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const report={testedAt:new Date().toISOString(),engine:'axe-core 4.10.3',base,results:[]};
try{
 for(const width of [390,768,1440]){
  const c=await b.newContext({viewport:{width,height:1000}}),p=await c.newPage();
  for(const [name,hash,selector] of [['atlas','#/ruta','.world-atlas'],['piloto','#/capitulo/'+encodeURIComponent(catalog.modules[0].id),'.pilot-region'],['lector','#/leccion/'+encodeURIComponent(catalog.modules[0].lessonIds[0]),'.activity-surface'],['estudio','#/leccion/'+encodeURIComponent(catalog.modules[0].lessonIds[0])+'?fase=aprende','.source-fragment-label'],['biblioteca','#/biblioteca?capitulo='+catalog.modules[0].id,'.library-result'],['progreso','#/progreso','.statistics-page'],['repaso','#/repaso','.review-page']]){
   await p.goto(base+hash);await p.locator(selector).first().waitFor();await p.waitForTimeout(250);await p.addScriptTag({path:axe});
   const result=await p.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))})),passes:r.passes.length,incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))};});
   report.results.push({name,width,...result});console.log('A11Y',width,name,result.violations.length,'violations');
  }
  if(process.argv.includes('--all-regions'))for(const [index,chapter] of catalog.modules.slice(1).entries()){
   await p.goto(base+'#/capitulo/'+encodeURIComponent(chapter.id));await p.locator('.premium-region').waitFor();await p.waitForTimeout(250);await p.addScriptTag({path:axe});
   const result=await p.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))})),passes:r.passes.length,incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))};});
   report.results.push({name:'region-'+(index+2),width,...result});console.log('A11Y',width,'region-'+(index+2),result.violations.length,'violations');
  }
  await c.close();
  const legacyContext=await b.newContext({viewport:{width,height:1000}});
  await legacyContext.addInitScript(lessons=>{if(location.protocol==='http:')localStorage.setItem('soc-learning-path:progress:v1',JSON.stringify({schemaVersion:1,completed:Object.fromEntries(lessons.map(l=>[l.id,l.version])),lastLesson:null}));},catalog.lessons);
  const q=await legacyContext.newPage();await q.goto(base+'#/leccion/'+encodeURIComponent(catalog.modules[0].lessonIds[0])+'?fase=practica');await q.locator('.question-card').waitFor();await q.addScriptTag({path:axe});
  const quiz=await q.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))})),passes:r.passes.length,incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))};});
  report.results.push({name:'cuestionario',width,...quiz});await q.screenshot({path:path.join(out,'cuestionario-'+width+'.png'),fullPage:true});console.log('A11Y',width,'cuestionario',quiz.violations.length,'violations');await legacyContext.close();

 }
}finally{await b.close();await writeFile(path.join(out,'accessibility.json'),JSON.stringify(report,null,2));}
if(report.results.some(r=>r.violations.length))process.exitCode=1;
