import {spawn} from 'node:child_process';
import {mkdir,writeFile,readFile,open} from 'node:fs/promises';
import path from 'node:path';
import {ROOT,filesUnder,hashes} from './splunk-integrity.mjs';
import {checkV121Protected} from './splunk-v121-integrity.mjs';
const browser=process.argv.includes('--browser');
const arg=(name,fallback)=>{const at=process.argv.indexOf(name);return at<0?fallback:process.argv[at+1];};
const base=arg('--base-url','http://127.0.0.1:5187/'),before=arg('--before-url',null);
for(const url of [base,before].filter(Boolean))if(!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(url))throw Error('Solo orígenes HTTP locales terminados en /');
const stamp=new Date().toISOString().replaceAll(/[:.]/g,'-');
const relative=browser?`output/playwright/splunk-v121/${stamp}`:`output/splunk-v121/validacion/${stamp}`;
const out=path.join(ROOT,relative);await mkdir(out,{recursive:true});
const report={date:new Date().toISOString(),mode:browser?'browser':'offline',commands:[],status:'running',visualVerdict:'pending_observation',node:process.version};
async function run(name,command,args){
  const start=Date.now();
  // File descriptors avoid restricted socket-based child stdio in the agent.
  const stdout=await open(path.join(out,name+'.stdout.log'),'w');
  const stderr=await open(path.join(out,name+'.stderr.log'),'w');
  const result=await new Promise(resolve=>{const child=spawn(command,args,{cwd:ROOT,env:process.env,stdio:['ignore',stdout.fd,stderr.fd]});let spawnError;child.on('error',e=>{spawnError=e.message;});child.on('close',(exitCode,signal)=>resolve({exitCode:spawnError?null:exitCode,signal,...(spawnError?{error:spawnError}:{})}));});
  await stdout.close();await stderr.close();
  report.commands.push({name,command:[command,...args],...result,durationMs:Date.now()-start});await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');
  console.log(name+': '+result.exitCode);if(result.exitCode!==0)throw Error(name+': no aprobado');
}
try{
  report.integrityBefore=await checkV121Protected();
  report.sourceHashes=await hashes([...(await filesUnder('src')),...(await filesUnder('scripts')),...(await filesUnder('tests'))]);
  if(browser){
    await run('paridad-dom',process.execPath,['tests/splunk-v121-parity.mjs','--base-url',base,'--output-dir',relative+'/paridad',...(before?['--before-url',before]:[])]);
    // Previous functional, isolated persistence, axe and SC-200 suites are kept
    // intact; a failed assertion still stops acceptance.
    await run('regresion-v12-sc200',process.execPath,['scripts/validate-splunk-v12.mjs','--browser','--base-url',base]);
    report.visualVerdict='automated_checks_passed_human_comparison_pending';
  }else{
    for(const f of ['scripts/splunk-v121-integrity.mjs','scripts/splunk-checkpoint-reconciliation.mjs','tests/splunk-v121-parity.mjs','scripts/validate-splunk-v121.mjs'])await run('syntax-'+path.basename(f),process.execPath,['--check',f]);
    await run('typescript',process.execPath,['node_modules/typescript/bin/tsc','--noEmit','--incremental','false']);
    await run('npm-test','npm',['test']);
    const tap=await readFile(path.join(out,'npm-test.stdout.log'),'utf8');
    report.unit=Object.fromEntries([...tap.matchAll(/^# (tests|pass|fail|skipped) (\d+)$/gm)].map(m=>[m[1],Number(m[2])]));
    if(report.unit.tests<78||report.unit.fail!==0||report.unit.pass!==report.unit.tests)throw Error('TAP incompleto o con fallos');
    await run('npm-build','npm',['run','build']);
    const diagnostic='output/splunk-v12/validacion/v121-'+stamp;
    await mkdir(path.join(ROOT,diagnostic),{recursive:true});
    await run('diagnostico-v11',process.execPath,['scripts/splunk-v12-diagnostic.mjs',diagnostic]);
    await writeFile(path.join(out,'diagnostico-v11.json'),await readFile(path.join(ROOT,diagnostic,'diagnostico-v11.json')));
  }
  report.integrityAfter=await checkV121Protected();report.status='passed';
}catch(error){report.status='not_passed';report.failure=error.stack;process.exitCode=1;console.error(error.message);}
finally{report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');await writeFile(path.join(ROOT,'output/splunk-v121',browser?'ultima-browser.json':'ultima-offline.json'),JSON.stringify({report:relative+'/ejecucion.json',status:report.status},null,2)+'\n');console.log(relative+'/ejecucion.json');}
