import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,open} from 'node:fs/promises';
import path from 'node:path';
import {ROOT,hashes,filesUnder} from './splunk-integrity.mjs';
import {checkV122Protected} from './splunk-v122-integrity.mjs';
const browser=process.argv.includes('--browser');
const at=process.argv.indexOf('--base-url'),base=at<0?'http://127.0.0.1:5187/':process.argv[at+1];
if(!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(base||''))throw Error('Solo origen HTTP local terminado en /');
const stamp=new Date().toISOString().replaceAll(/[:.]/g,'-');
const relative=browser?'output/playwright/splunk-v122/'+stamp:'output/splunk-v122/validacion/'+stamp;
const out=path.join(ROOT,relative);await mkdir(out,{recursive:true});
const report={date:new Date().toISOString(),mode:browser?'browser':'offline',base:browser?base:null,node:process.version,commands:[],status:'running',visualVerdict:'not_observed',atlasKnownFailure:'Panel a 320 px: 282.59375 vs 295.203125; no corregido por prohibición de modificar mapas'};
async function record(name,command,args){
  const started=Date.now(),stdout=await open(path.join(out,name+'.stdout.log'),'w'),stderr=await open(path.join(out,name+'.stderr.log'),'w');
  const result=await new Promise(resolve=>{let error;const child=spawn(command,args,{cwd:ROOT,env:process.env,stdio:['ignore',stdout.fd,stderr.fd]});child.on('error',e=>{error=e.message;});child.on('close',(exitCode,signal)=>resolve({exitCode:error?null:exitCode,signal,...(error?{error}:{})}));});
  await stdout.close();await stderr.close();
  report.commands.push({name,command:[command,...args],...result,durationMs:Date.now()-started});
  await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');console.log(name+': '+result.exitCode);return result.exitCode===0;
}
async function required(name,command,args){if(!await record(name,command,args))throw Error(name+': no aprobado');}
try{
  report.integrityBefore=await checkV122Protected();
  report.sourceHashes=await hashes([...(await filesUnder('src')),...(await filesUnder('scripts')),...(await filesUnder('tests'))]);
  if(browser){
    const reader=await record('lector-v122',process.execPath,['tests/splunk-v122-browser.mjs','--base-url',base,'--output-dir',relative+'/lector']);
    const result=JSON.parse(await readFile(path.join(out,'lector/resultados.json')));
    report.readerStatus=result.status;
    if(result.status==='blocked_browser_launch'){report.parityStatus='not_executed_browser_unavailable';throw Error('Chromium bloqueado; no repetir lanzamiento idéntico');}
    // Independent A/B suites: a reader failure does not hide the existing atlas
    // defect. Both results are required; no tolerance or axe assertion changes.
    const atlasDir='output/playwright/splunk-v121/v122-'+stamp;
    const atlas=await record('paridad-dom-v121',process.execPath,['tests/splunk-v121-parity.mjs','--base-url',base,'--output-dir',atlasDir]);
    report.parityReport=atlasDir+'/resultados.json';report.parityStatus=JSON.parse(await readFile(path.join(ROOT,report.parityReport))).status;
    if(!reader||!atlas)throw Error('Aceptación de navegador incompleta: consultar lector y atlas por separado');
    report.visualVerdict='automated_checks_passed_human_review_pending';
  }else{
    for(const file of ['scripts/splunk-v122-integrity.mjs','scripts/splunk-v122-diagnostic.mjs','scripts/validate-splunk-v122.mjs','tests/splunk-v122-browser.mjs','tests/splunk-v122-isolation.mjs','tests/splunk-v121-parity.mjs'])await required('sintaxis-'+path.basename(file),process.execPath,['--check',file]);
    await required('diagnostico-parrot',process.execPath,['scripts/splunk-v122-diagnostic.mjs',relative]);
    await required('typescript',process.execPath,['node_modules/typescript/bin/tsc','--noEmit','--incremental','false']);
    await required('npm-test','npm',['test']);
    const tap=await readFile(path.join(out,'npm-test.stdout.log'),'utf8');report.unit=Object.fromEntries([...tap.matchAll(/^# (tests|pass|fail|skipped) (\d+)$/gm)].map(m=>[m[1],Number(m[2])]));
    if(report.unit.tests<84||report.unit.pass!==report.unit.tests||report.unit.fail!==0)throw Error('TAP incompleto o con fallos');
    await required('npm-build','npm',['run','build']);
  }
  const actual=await hashes(Object.keys(report.sourceHashes));const changed=Object.keys(actual).filter(f=>actual[f]!==report.sourceHashes[f]);
  if(changed.length)throw Error('Código cambiado durante validación: '+changed.join(', '));
  report.testedSourcesMatchFinal=true;report.integrityAfter=await checkV122Protected();report.status='passed';
}catch(error){report.status='not_passed';report.failure=error.stack;process.exitCode=1;console.error(error.message);}
finally{report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');await writeFile(path.join(ROOT,'output/splunk-v122',browser?'ultima-browser.json':'ultima-offline.json'),JSON.stringify({report:relative+'/ejecucion.json',status:report.status},null,2)+'\n');console.log(relative+'/ejecucion.json');}
