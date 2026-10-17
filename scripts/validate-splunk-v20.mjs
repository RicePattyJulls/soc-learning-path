import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,open} from 'node:fs/promises';
import path from 'node:path';
import {ROOT,filesUnder,hashes,sha256} from './splunk-integrity.mjs';
import {checkV20Protected} from './splunk-v20-integrity.mjs';
const browserMode=process.argv.includes('--browser');
const at=process.argv.indexOf('--base-url'),base=at<0?'http://127.0.0.1:5187/':process.argv[at+1];
if(!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(base||''))throw Error('Solo origen local HTTP terminado en /');
const stamp=new Date().toISOString().replaceAll(/[:.]/g,'-');
const relative=`${browserMode?'output/playwright/splunk-v20':'output/splunk-v20/validacion'}/${stamp}`;
const out=path.join(ROOT,relative);await mkdir(out,{recursive:true});
const report={date:new Date().toISOString(),mode:browserMode?'browser':'offline',base:browserMode?base:null,node:process.version,status:'running',commands:[],visualVerdict:'not_observed',knownAtlasFailure:'Parrot V1.2.1: Panel a 320 px, SC=282.59375 / Splunk=295.203125; aserción estricta conservada. No se alteran los mapas originales.'};
async function record(name,command,args){
 const started=Date.now(),stdout=await open(path.join(out,name+'.stdout.log'),'w'),stderr=await open(path.join(out,name+'.stderr.log'),'w');
 const result=await new Promise(resolve=>{let error;const child=spawn(command,args,{cwd:ROOT,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'},stdio:['ignore',stdout.fd,stderr.fd]});child.on('error',e=>{error=e.message;});child.on('close',(exitCode,signal)=>resolve({exitCode:error?null:exitCode,signal,...(error?{error}:{})}));});
 await stdout.close();await stderr.close();report.commands.push({name,command:[command,...args],...result,durationMs:Date.now()-started,stdout:name+'.stdout.log',stderr:name+'.stderr.log'});
 await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');console.log(`${name}: ${result.exitCode}`);return result.exitCode===0;
}
async function required(name,command,args){if(!await record(name,command,args))throw Error(`${name}: no aprobado`);}
try{
 report.integrityBefore=await checkV20Protected();
 report.sourceHashes=await hashes([...(await filesUnder('src')),...(await filesUnder('scripts')),...(await filesUnder('tests'))]);
 report.catalogHash=sha256(await readFile('src/generated/splunk/catalog.json'));
 if(browserMode){
  // Independent suites: a known atlas assertion must not mask reader checks.
  const parityDir=`output/playwright/splunk-v121/v20-${stamp}`;
  const parity=await record('paridad-dom',process.execPath,['tests/splunk-v121-parity.mjs','--base-url',base,'--output-dir',parityDir]);
  report.parityReport=parityDir+'/resultados.json';const result=JSON.parse(await readFile(report.parityReport));report.parityStatus=result.status;
  if(result.status==='blocked_browser_launch'){report.readerStatus='not_executed_browser_unavailable';report.status='blocked_browser_launch';throw Error('Chromium bloqueado antes de abrir páginas. Lector/mapas/regresión SC-200 pendientes; no repetir lanzamientos idénticos.');}
  const reader=await record('integracion-80-lector-mapas',process.execPath,['tests/splunk-v20-browser.mjs','--base-url',base,'--output-dir',relative+'/academia']);
  report.readerStatus=JSON.parse(await readFile(path.join(out,'academia/resultados.json'))).status;
  const fixes=await record('lector-cinco-pasos',process.execPath,['tests/splunk-reader-fixes-browser.mjs','--base-url',base]);
  let scPassed=true;
  for(const [name,args] of [['sc200-completa',[]],['sc200-v25',['--v25-compatibility','--axe-path','output/v25/reanudacion/axe.min.js']],['sc200-a11y',['--a11y','--all-regions','--axe-path','output/v25/reanudacion/axe.min.js']]])scPassed=await record(name,process.execPath,['tests/e2e.mjs','--base-url',base,'--output-dir',relative+'/'+name,...args])&&scPassed;
  if(!parity||!reader||!fixes||!scPassed)throw Error('Navegador no aprobado: revisar cada informe independiente. No omitir el fallo de paridad.');
  report.visualVerdict='automated_checks_passed_human_review_pending';
 }else{
  for(const file of ['scripts/prepare-splunk.mjs','scripts/splunk-v20-sources.mjs','scripts/splunk-v20-integrity.mjs','scripts/splunk-v20-reconciliation.mjs','scripts/validate-splunk-v20.mjs','tests/splunk-v20-browser.mjs','tests/splunk-v122-browser.mjs','tests/splunk-v122-isolation.mjs','tests/splunk-premium-checks.mjs','tests/splunk-v121-parity.mjs','tests/splunk-reader-fixes-browser.mjs'])await required('sintaxis-'+path.basename(file),process.execPath,['--check',file]);
  await required('diagnostico-parrot',process.execPath,['scripts/splunk-v122-diagnostic.mjs','output/splunk-v122/v20-diagnostico']);
  await required('importacion-determinista',process.execPath,['scripts/prepare-splunk.mjs']);
  await required('typescript',process.execPath,['node_modules/typescript/bin/tsc','--noEmit','--incremental','false']);
  await required('npm-test','npm',['test']);
  const tap=await readFile(path.join(out,'npm-test.stdout.log'),'utf8');report.unit=Object.fromEntries([...tap.matchAll(/^# (tests|pass|fail|skipped) (\d+)$/gm)].map(m=>[m[1],Number(m[2])]));
  if(report.unit.tests<98||report.unit.pass!==report.unit.tests||report.unit.fail!==0||report.unit.skipped!==0)throw Error('TAP incompleto, omitido o con fallos');
  await required('npm-build','npm',['run','build']);
  for(const suffix of ['R01_R03','R04_R05','R06_R07','R08_R09','R10_R11'])await required('editorial-'+suffix,'python3',['-B',`SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_${suffix}/VALIDACION/comprobar_paquete.py`]);
  await required('regresiones-editoriales','python3',['-B','scripts/splunk-v11-editorial-tests.py']);
 }
 report.integrityAfter=await checkV20Protected();
 const current=await hashes(Object.keys(report.sourceHashes));report.testedSourcesMatchFinal=JSON.stringify(current)===JSON.stringify(report.sourceHashes);
 if(!report.testedSourcesMatchFinal)throw Error('Fuentes cambiadas durante la validación');
 report.status='passed';
}catch(error){if(report.status==='running')report.status='not_passed';report.failure=error.stack;process.exitCode=1;console.error(error.message);}
finally{report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');await writeFile('output/splunk-v20/'+(browserMode?'ultima-browser.json':'ultima-offline.json'),JSON.stringify({report:relative+'/ejecucion.json',status:report.status},null,2)+'\n');console.log(relative+'/ejecucion.json');}
