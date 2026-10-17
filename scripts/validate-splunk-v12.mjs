import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { platform, release, arch } from 'node:os';
import path from 'node:path';
import { ROOT, sha256, filesUnder, hashes } from './splunk-integrity.mjs';
import { checkV12Protected } from './splunk-v12-integrity.mjs';

const browserMode = process.argv.includes('--browser');
const baseAt = process.argv.indexOf('--base-url');
const base = baseAt < 0 ? 'http://127.0.0.1:5187/' : process.argv[baseAt+1];
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(base || '')) throw new Error('Solo un origen HTTP local terminado en /');
const stamp = new Date().toISOString().replaceAll(/[:.]/g,'-');
const relative = `${browserMode ? 'output/playwright/splunk-v12-premium' : 'output/splunk-v12/validacion'}/${stamp}`;
const out = path.join(ROOT,relative);
await mkdir(out,{recursive:true});
const report = { date:new Date().toISOString(),mode:browserMode?'browser':'offline',base:browserMode?base:null,environment:{node:process.version,platform:platform(),release:release(),arch:arch()},commands:[],status:'running' };
const record = async (name, executable, args, extraEnv={}) => {
  const started=Date.now();let stdout='',stderr='';
  const result=await new Promise(resolve=>{
    const child=spawn(executable,args,{cwd:ROOT,env:{...process.env,...extraEnv},stdio:['ignore','pipe','pipe']});
    child.stdout.on('data',data=>{stdout+=data;});child.stderr.on('data',data=>{stderr+=data;});
    child.on('error',error=>resolve({exitCode:null,signal:null,error:error.message}));
    child.on('close',(exitCode,signal)=>resolve({exitCode,signal}));
  });
  await writeFile(path.join(out,name+'.stdout.log'),stdout);await writeFile(path.join(out,name+'.stderr.log'),stderr);
  const item={name,command:[executable,...args],...result,durationMs:Date.now()-started,stdout:name+'.stdout.log',stderr:name+'.stderr.log'};
  report.commands.push(item);console.log(JSON.stringify(item));
  await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');
  return result.exitCode===0;
};
try {
  report.integrityBefore=await checkV12Protected();
  report.sourceHashes=await hashes([...(await filesUnder('src')).filter(f=>!f.startsWith('src/generated/')||f.startsWith('src/generated/splunk/')), ...(await filesUnder('scripts')).filter(f=>f.includes('splunk')), ...(await filesUnder('tests')).filter(f=>f.includes('splunk'))]);
  report.catalogHash=sha256(await readFile(path.join(ROOT,'src/generated/splunk/catalog.json')));
  const packages=JSON.parse(await readFile(path.join(ROOT,'package.json'),'utf8'));
  report.dependencies={...packages.dependencies,...packages.devDependencies};
  if(browserMode) {
    await record('chromium-version',process.env.CHROMIUM_PATH||'/usr/bin/chromium',['--version']);
    // Stop after a failed Splunk browser suite; never repeat an identical blocked launch.
    if(!await record('splunk-browser',process.execPath,['tests/splunk-v12-browser.mjs','--base-url',base,'--output-dir',relative+'/splunk'])) throw new Error('Navegador Splunk no aprobado; pruebas SC-200 dependientes pendientes');
    const axe='output/v25/reanudacion/axe.min.js';
    for(const [name,args] of [
      ['sc200-completa',[]],
      ['sc200-v25',['--v25-compatibility','--axe-path',axe]],
      ['sc200-a11y',['--a11y','--all-regions','--axe-path',axe]],
    ]) if(!await record(name,process.execPath,['tests/e2e.mjs','--base-url',base,'--output-dir',relative+'/'+name,...args])) throw new Error(`Regresión ${name}: detener aceptación`);
  } else {
    for(const file of ['scripts/splunk-v12-integrity.mjs','scripts/validate-splunk-v12.mjs','tests/splunk-v12-browser.mjs','tests/splunk-premium-checks.mjs']) if(!await record('sintaxis-'+path.basename(file,'.mjs'),process.execPath,['--check',file])) throw new Error(`Sintaxis no aprobada ${file}`);
    // Visual-only phase: no editorial/content regeneration, even if deterministic.
    if(!await record('diagnostico',process.execPath,['scripts/splunk-v12-diagnostic.mjs',relative])) throw new Error('Diagnóstico no aprobado');
    const tests=(await filesUnder('tests')).filter(f=>f.endsWith('.test.ts'));
    if(!await record('unit',process.execPath,['--import','tsx','--experimental-test-isolation=none','--test','--test-reporter=tap','--test-reporter-destination='+path.join(out,'unit.tap'),...tests])) throw new Error('Unitarias no aprobadas');
    const tap=await readFile(path.join(out,'unit.tap'),'utf8');
    const counts=Object.fromEntries([...tap.matchAll(/^# (tests|pass|fail|skipped) (\d+)$/gm)].map(m=>[m[1],Number(m[2])]));
    if(counts.tests<75||counts.fail!==0||counts.pass!==counts.tests)throw new Error('TAP incompleto o con fallos');
    report.unit=counts;
    if(!await record('typescript',process.execPath,['node_modules/typescript/bin/tsc','--noEmit','--incremental','false'])) throw new Error('Tipos no aprobados');
    if(!await record('build',process.execPath,['node_modules/vite/bin/vite.js','build'])) throw new Error('Build no aprobado');
    for(const pkg of ['R01_R03','R04_R05','R06_R07','R08_R09','R10_R11']) if(!await record('editorial-'+pkg,'python3',['-B',`SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_${pkg}/VALIDACION/comprobar_paquete.py`],{PYTHONDONTWRITEBYTECODE:'1'})) throw new Error(`Paquete ${pkg} no aprobado`);
    if(!await record('regresiones-editoriales','python3',['-B','scripts/splunk-v11-editorial-tests.py'],{PYTHONDONTWRITEBYTECODE:'1'})) throw new Error('Regresiones editoriales no aprobadas');
    if(!await record('artefactos',process.execPath,['scripts/splunk-v12-artifacts.mjs',relative])) throw new Error('Artefactos no aprobados');
  }
  report.integrityAfter=await checkV12Protected();report.status='passed';
} catch(error) { report.status='not_passed';report.failure=error.message;process.exitCode=1;console.error(error.message); }
finally {
  report.finishedAt=new Date().toISOString();
  await writeFile(path.join(out,'ejecucion.json'),JSON.stringify(report,null,2)+'\n');
  await writeFile(path.join(ROOT,browserMode?'output/playwright/splunk-v12-premium/ultima-ejecucion.json':'output/splunk-v12/validacion/ultima-ejecucion.json'),JSON.stringify({report:relative+'/ejecucion.json',status:report.status},null,2)+'\n');
  console.log(`Evidencia: ${relative}/ejecucion.json`);
}
