import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright-core';
const at=process.argv.indexOf('--base-url'),base=at<0?'http://127.0.0.1:5187/':process.argv[at+1];
assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/);
const out='output/playwright/splunk-reader-fixes/'+new Date().toISOString().replaceAll(/[:.]/g,'-');await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile('src/generated/splunk/catalog.json'));
const lesson=catalog.lessons[0],data=JSON.parse(await readFile('public/'+lesson.file));
const key='soc-learning-path:splunk:learning:v1';
const stages=[['Tu misión','mision'],['Aprende','estudio'],['Practica','practica'],['Conecta ideas','resumen'],['Demuestra','teoria']];
const report={date:new Date().toISOString(),base,status:'not_started',checks:[],errors:[],external:[],scenarios:[],screenshots:[]};
let browser;
const url=(phase,step)=>base+`#/splunk/leccion/${lesson.id}?fase=${phase}${step?'&paso='+step:''}`;
async function scenario(width,partial){
  const name=(partial?'guardado-1-2-3':'nuevo')+'-'+width;
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  context.on('page',page=>page.on('pageerror',e=>report.errors.push(name+': '+e.message)));
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():(report.external.push(route.request().url()),route.abort()));
  if(partial){
    const record={seen:lesson.stepIds.slice(0,3),studyCompleted:false,summary:false,theoryPassed:false,formativeSeen:false,reviewed:false,practicalStatus:'not_assessed',updated:1,attempts:{},activeAttempt:null};
    const seed={schemaVersion:1,courseId:'splunk',rewardMode:'provisional_only',records:{[lesson.id]:{[lesson.revision]:record}},provisionalAwards:{},regionAwards:[],lastLesson:{id:lesson.id,updated:1}};
    await context.addInitScript(({key,seed})=>{if(location.protocol==='http:'&&!localStorage.getItem('test-reader-fix:seeded')){localStorage.setItem(key,JSON.stringify(seed));localStorage.setItem('test-reader-fix:seeded','1');}},{key,seed});
  }
  const page=await context.newPage();
  const stored=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  const nav=page.locator('.lesson-phases nav');
  const stage=async(title,phase)=>{await nav.getByRole('button',{name:new RegExp('^'+title+'(?: |$)')}).click();await page.locator(`.sp-reader-content[data-phase="${phase}"]`).waitFor();};
  const currentStep=async(number)=>{
    await page.locator(`[data-editorial-section="${lesson.stepIds[number-1]}"]`).waitFor();
    assert.equal(new URLSearchParams((await page.evaluate(()=>location.hash)).split('?')[1]).get('paso'),String(number));
    assert.equal(await page.locator('.sp-reader-content').getByRole('heading',{name:data.sections[number-1].title,exact:true}).count(),1,'Título de sección una sola vez');
    assert.equal(await page.locator('[data-editorial-section]').getByRole('heading',{name:data.sections[number-1].title,exact:true}).count(),0,'Sin copia del título dentro del Markdown');
    assert.ok(await page.locator('.sp-step-label').innerText().then(t=>t.includes(`Paso ${number} de 5`)));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  };
  const next=()=>page.getByRole('button',{name:/^(Marcar estudiado y continuar|Continuar)$/}).click();
  const count=async expected=>{
    await page.waitForFunction(({key,id,revision,expected})=>JSON.parse(localStorage.getItem(key))?.records[id]?.[revision]?.seen.length===expected,{key,id:lesson.id,revision:lesson.revision,expected});
  };
  const screenshot=async suffix=>{const f=name+'-'+suffix+'.png';await page.screenshot({path:path.join(out,f),fullPage:true});report.screenshots.push(f);};
  try{
    if(!partial){
      await page.goto(url('mision'));await page.locator('.sp-reader').waitFor();
      assert.equal(await nav.getByRole('button').count(),5);
      for(const [title,phase] of stages){await stage(title,phase);const s=await stored();assert.deepEqual(s.records[lesson.id][lesson.revision].seen,[]);assert.deepEqual(s.provisionalAwards,{});}
      await stage('Aprende','estudio');await currentStep(1);
      for(let step=1;step<=5;step++){
        await currentStep(step);await screenshot('paso-'+step);await next();await count(step);
        if(step===1){
          await currentStep(2);await page.getByRole('link',{name:'Paso anterior',exact:true}).click();await currentStep(1);
          await stage('Aprende','estudio');await currentStep(1);await count(1);await next();await currentStep(2);await count(1);
        }
      }
    }else{
      await page.goto(url('mision'));await page.getByText('Reanudarás en el paso 4 de 5.',{exact:false}).waitFor();
      await stage('Aprende','estudio');await currentStep(1);await count(3);
      await page.goto(url('estudio',1));await currentStep(1);await count(3);
      await stage('Aprende','estudio');await currentStep(1);
      await next();await currentStep(2);await count(3);await page.getByRole('link',{name:'Paso anterior',exact:true}).click();await currentStep(1);
      for(const [title,phase] of stages.slice(2)){await stage(title,phase);await stage('Aprende','estudio');await currentStep(1);await count(3);}
      await stage('Tu misión','mision');await page.getByText('Reanudarás en el paso 4 de 5.',{exact:false}).waitFor();
      await page.getByRole('button',{name:'Continuar aprendiendo',exact:true}).click();await currentStep(4);await count(3);await screenshot('reanudacion-explicita-4');
      for(let step=3;step>=1;step--){await page.getByRole('link',{name:'Paso anterior',exact:true}).click();await currentStep(step);await count(3);}
      for(let step=1;step<=5;step++){await currentStep(step);await next();await count(Math.max(3,step));}
    }
    await page.locator('.sp-reader-content[data-phase="practica"]').waitFor();
    const completed=await stored(),record=completed.records[lesson.id][lesson.revision];
    assert.deepEqual(record.seen,lesson.stepIds);assert.equal(record.summary,false);assert.equal(record.theoryPassed,false);assert.equal(record.formativeSeen,false);assert.equal(record.practicalStatus,'not_assessed');assert.deepEqual(completed.provisionalAwards[lesson.id],['study']);
    await stage('Aprende','estudio');await currentStep(5);
    await page.getByRole('link',{name:'2. '+data.sections[1].title.replace(/^\d\. /,''),exact:true}).click();await currentStep(2);await count(5);
    await page.reload();await currentStep(2);await count(5);await screenshot('volver-y-recargar-2');
    assert.deepEqual((await stored()).provisionalAwards,completed.provisionalAwards);
    assert.equal(await page.evaluate(()=>localStorage.getItem('soc-learning-path:learning:v2')),null);
    report.scenarios.push({name,width,partial,stages:5,steps:[1,2,3,4,5],resume:partial?4:null,previousAndReload:true,headingsUnique:true,progressPreserved:true,status:'passed'});
  }finally{await context.close();}
}
try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});report.browser=browser.version();report.status='running';
  for(const width of [390,1440]){await scenario(width,false);await scenario(width,true);}
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);
  report.checks.push('Cinco etapas y cinco pasos en orden; nuevo/guardado 1–3, selección manual vs reanudación, anterior/selector/recarga, título único y progreso/XP existentes conservados');report.status='passed';
}catch(error){report.status=browser?'failed':'blocked_browser_launch';report.failure=error.stack;process.exitCode=1;}
finally{await browser?.close();report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'resultados.json'),JSON.stringify(report,null,2)+'\n');console.log(out+'/resultados.json');}
