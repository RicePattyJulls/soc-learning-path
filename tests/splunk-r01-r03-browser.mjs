import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { runIsolationMatrix } from './splunk-browser-matrix.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const at = process.argv.indexOf('--base-url');
const base = at >= 0 ? process.argv[at + 1] : 'http://127.0.0.1:5173/';
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(base || '')) throw new Error('Solo un origen local terminado en /');
const outputAt = process.argv.indexOf('--output-dir');
const relativeOutput = outputAt < 0 ? 'output/playwright/splunk-r01-r03/directo' : process.argv[outputAt+1];
if (!/^output\/playwright\/splunk-r01-r03\/[\w/-]+$/.test(relativeOutput || '') || relativeOutput.includes('..')) throw new Error('Destino V1.1 no permitido');
const out = path.join(root, relativeOutput);
await mkdir(out, { recursive: true });
const report = { date: new Date().toISOString(), base, checks: [], errors: [], external: [], accessibility: [], responsive: [], measurements: [], status: 'not_started' };
const scKey = 'soc-learning-path:learning:v2', legacyKey = 'soc-learning-path:progress:v1', spKey = 'soc-learning-path:splunk:learning:v1';
const catalog = await read('src/generated/splunk/catalog.json'), sc = await read('src/generated/catalog.json');
const lessons = await Promise.all(catalog.lessons.map(l => read('public/' + l.file)));
const axePath = path.join(root, 'output/v25/reanudacion/axe.min.js');
await readFile(axePath);
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  report.browserVersion = browser.version();
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(base)) return route.continue();
    report.external.push(url); return route.abort();
  });
  // A brand-new temporary profile; these are synthetic V1 fixtures, never the
  // user's browser or stored progress. Instrumentation runs on every document.
  await context.addInitScript(({ legacyKey, sc, scKey, spKey }) => {
    if (location.protocol !== 'http:') return;
    if (!localStorage.getItem('test-only:splunk-seeded')) {
      localStorage.setItem(legacyKey, JSON.stringify({ schemaVersion: 1, completed: Object.fromEntries(sc.lessons.map(l => [l.id, l.version])), lastLesson: sc.lessons[0].id }));
      localStorage.setItem('test-only:splunk-seeded', '1');
    }
    const originalGet = Storage.prototype.getItem, originalSet = Storage.prototype.setItem, originalRemove = Storage.prototype.removeItem;
    window.__storageCalls = [];
    Storage.prototype.getItem = function(key) { if ([legacyKey,scKey,spKey].includes(key)) window.__storageCalls.push(['get',key]); return originalGet.call(this,key); };
    Storage.prototype.setItem = function(key,value) { if ([legacyKey,scKey,spKey].includes(key)) window.__storageCalls.push(['set',key]); return originalSet.call(this,key,value); };
    Storage.prototype.removeItem = function(key) { if ([legacyKey,scKey,spKey].includes(key)) window.__storageCalls.push(['remove',key]); return originalRemove.call(this,key); };
    window.__longTasks=[];
    new PerformanceObserver(list => window.__longTasks.push(...list.getEntries().map(e=>({duration:e.duration,startTime:e.startTime})))).observe({type:'longtask',buffered:true});
  }, { legacyKey, sc, scKey, spKey });
  const page = await context.newPage(); page.on('pageerror', error => report.errors.push(error.message));
  await page.goto(base + '#/ruta'); await page.locator('.world-atlas').waitFor();
  await page.waitForFunction(key => !!localStorage.getItem(key), scKey);
  const scProfile = await page.locator('.profile').getAttribute('aria-label'); assert.ok(scProfile.includes('3200 XP'));
  const original = await page.evaluate(({scKey,legacyKey})=>({interactive:localStorage.getItem(scKey),legacy:localStorage.getItem(legacyKey)}),{scKey,legacyKey});
  const scResources = await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
  assert.ok(!scResources.some(url=>url.includes('SplunkApp')||url.includes('splunk-content')));
  report.checks.push('SC-200 legacy sintético: 3200 XP, mapa histórico y sin carga anticipada de Splunk');
  await page.screenshot({path:path.join(out,'selector-sc200-1440.png'),fullPage:false});
  await page.evaluate(()=>{window.__storageCalls=[];});
  await page.getByRole('link',{name:'Splunk SOC R01–R03',exact:false}).click();
  await page.locator('.sp-map-page').waitFor();
  const assertIsolated = async () => {
    const calls = await page.evaluate(()=>window.__storageCalls);
    assert.deepEqual(calls.filter(([,key])=>key===scKey||key===legacyKey),[]);
  };
  await assertIsolated();
  assert.equal(await page.locator('.sp-region-card').count(),3);
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('0 XP provisionales'));
  await page.locator('.sp-region-tabs a[href="#/splunk/region/SP-R01"]').click();
  assert.equal(await page.locator('.sp-node').count(),5); assert.equal(await page.locator('.sp-node.locked').count(),4);
  for(const id of ['SP-R02-L01','SP-R03-L01']) {
    await page.goto(base+'#/splunk/leccion/'+id);
    await page.getByRole('heading',{name:'Esta lección está bloqueada'}).waitFor();
  }
  await page.screenshot({path:path.join(out,'selector-mapa-splunk-1440.png'),fullPage:true});
  await page.goto(base+'#/splunk/leccion/SP-R01-L02');
  await page.getByRole('heading',{name:'Esta lección está bloqueada'}).waitFor(); await assertIsolated();
  const navigate = async (id,phase='estudio') => {
    await page.goto(base+`#/splunk/leccion/${id}?fase=${phase}`);
    await page.locator(`[data-lesson="${id}"]`).waitFor();
  };
  const study = async id => {
    await navigate(id);
    for(let i=0;i<5;i++) await page.getByRole('button',{name:/Marcar estudiado y continuar/}).click();
    await page.getByRole('button',{name:'Confirmar resumen estudiado',exact:true}).click();
    await page.getByRole('link',{name:'Ir a teoría piloto',exact:true}).click();
  };
  const exam = async (payload,fail=false) => {
    await page.getByRole('button',{name:/Comenzar evaluación piloto|Iniciar nuevo intento/}).click();
    await page.locator('[data-active-exam]').waitFor();
    for(const [i,q] of payload.questions.entries()) {
      const option=fail&&i===0?q.options.find(o=>o.id!==q.solution).id:q.solution;
      await page.locator(`input[value="${option}"]`).check();
      assert.equal(await page.getByText(q.explanation,{exact:true}).count(),0);
      assert.equal(await page.locator('.sp-phases a').count(),1);
      assert.equal(await page.locator(`[data-question="${q.id}"] input:enabled`).count(),0);
    }
    await page.getByRole('button',{name:'Finalizar evaluación y ver resultado',exact:true}).click();
    await page.getByRole('heading',{name:fail?'Necesitas repasar la teoría':'Teoría aprobada en piloto',exact:true}).waitFor();
  };
  await study('SP-R01-L01');
  await page.getByRole('link',{name:'Práctica formativa',exact:true}).click();
  await page.locator('textarea').fill('Reflexión sintética de prueba, sin datos personales.');
  await page.getByRole('button',{name:'Registrar práctica consultada (sin nota ni XP)',exact:true}).click();
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('10 XP provisionales'));
  await page.getByRole('link',{name:'Teoría piloto',exact:true}).click();
  await exam(lessons[0],true);
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('10 XP provisionales'));
  await exam(lessons[0]);
  await page.getByRole('link',{name:'Repaso',exact:true}).click();
  await page.getByRole('button',{name:/Confirmar repaso/}).click();
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('30 XP provisionales'));
  report.checks.push('L01: cinco pasos, resumen, formativa 0 XP, fallo 1/2, reintento 2/2, sin soluciones durante examen, repaso y máximo 30 XP');
  for(const payload of lessons.slice(1)) {
    await study(payload.id); await exam(payload);
    await page.getByRole('link',{name:'Repaso',exact:true}).click();
    await page.getByRole('button',{name:/Confirmar repaso/}).click();
  }
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('nivel provisional 4, 840 XP provisionales, 0 XP definitivos'));
  await page.reload(); await page.locator('.sp-reader').waitFor();
  assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('840 XP provisionales'));
  await assertIsolated();
  const persisted = await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),spKey);
  assert.equal(persisted.lastLesson.id,'SP-R03-L07'); assert.deepEqual(persisted.regionAwards,['SP-R01','SP-R02','SP-R03']);
  assert.equal(Object.keys(persisted.records['SP-R01-L01'][catalog.lessons[0].revision].attempts).length,2);
  await page.getByRole('link',{name:'Volver a Bosque SPL',exact:true}).click();
  await page.waitForFunction(()=>document.activeElement?.id==='sp-node-SP-R03-L07');
  await page.getByRole('link',{name:'Bitácora',exact:true}).click(); await page.locator('.sp-journal').waitFor();
  const download=page.waitForEvent('download'); await page.getByRole('button',{name:'Exportar progreso Splunk',exact:true}).click();
  const exported=JSON.parse(await readFile(await(await download).path(),'utf8'));
  assert.equal(exported.courseId,'splunk'); assert.ok(!JSON.stringify(exported).includes(sc.lessons[0].id));
  await page.goBack(); await page.locator('.sp-map-page').waitFor();
  await page.goForward(); await page.locator('.sp-journal').waitFor();
  await page.goBack(); await page.locator('.sp-map-page').waitFor();
  await navigate('SP-R03-L07'); await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.activeElement?.id==='sp-node-SP-R03-L07');
  await assertIsolated();
  const unchanged=await page.evaluate(({scKey,legacyKey})=>({interactive:localStorage.getItem(scKey),legacy:localStorage.getItem(legacyKey)}),{scKey,legacyKey});
  assert.deepEqual(unchanged,original);
  await page.locator('.academy-selector a[href="#/ruta"]').focus(); await page.keyboard.press('Enter');
  await page.locator('.world-atlas').waitFor(); assert.equal(await page.locator('.profile').getAttribute('aria-label'),scProfile);
  const historical=sc.modules[0].lessonIds[0];
  await page.goto(base+'#/leccion/'+encodeURIComponent(historical)); await page.locator('.activity-surface').waitFor();
  assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('3200 XP'));
  report.checks.push('18 lecciones, 840 XP provisionales/nivel 4, bonus único, recarga, historial, exportación propia, Atrás/Escape/foco y SC-200 íntegro al volver');
  for(const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const [name,hash,selector] of [['atlas','#/splunk/ruta','.sp-region-card'],
      ...catalog.regions.map(r=>['mapa-'+r.id,'#/splunk/region/'+r.id,'.sp-node']),
      ['lector-ingesta','#/splunk/leccion/SP-R02-L03','.sp-reader'],
      ['lector-spl','#/splunk/leccion/SP-R03-L07','.sp-reader'],
      ['practica','#/splunk/leccion/SP-R03-L07?fase=practica','[data-formative]'],
      ['solucionario','#/splunk/leccion/SP-R03-L07?fase=soluciones','.sp-learning-surface details'],
      ['recursos-ingesta','#/splunk/recursos/SP-R02','.splunk-markdown'],
      ['recursos-spl','#/splunk/recursos/SP-R03','.splunk-markdown'],
      ['sc200','#/ruta','.world-atlas']]) {
      await page.goto(base+hash); await page.locator(selector).first().waitFor();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name} ${width}px`);
      await page.addScriptTag({path:axePath});
      const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))}))};});
      report.accessibility.push({name,width,...result}); assert.deepEqual(result.violations,[],`axe ${name} ${width}px`);
      const running=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length); assert.equal(running,0);
      report.responsive.push({name,width,overflow:false,reducedMotion:true});
      if(name==='atlas'||name.startsWith('mapa-')) await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true});
    }
    await navigate('SP-R01-L01','teoria'); await page.getByRole('button',{name:'Iniciar nuevo intento',exact:true}).click();
    await page.locator('[data-active-exam]').waitFor(); await page.addScriptTag({path:axePath});
    const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))}))};});
    report.accessibility.push({name:'evaluacion',width,...result}); assert.deepEqual(result.violations,[]);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    for(const q of lessons[0].questions) await page.locator(`input[value="${q.solution}"]`).check();
    await page.getByRole('button',{name:'Finalizar evaluación y ver resultado',exact:true}).click();
    assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('840 XP provisionales'));
  }
  // Every new lesson exposes references/solutions/formative resources outside exams.
  for(const payload of lessons.slice(5)) {
    await navigate(payload.id,'soluciones');
    await page.getByRole('heading',{name:'Solucionario · fuera de evaluación',exact:true}).waitFor();
    assert.ok((await page.locator('.sp-learning-surface').innerText()).includes(payload.questions[0].explanation));
    await navigate(payload.id,'referencias'); await page.getByRole('heading',{name:'Referencias y evidencia'}).waitFor();
    assert.equal(await page.locator('.splunk-markdown a[target="_blank"]').count(),payload.references.length);
    await navigate(payload.id,'practica');
    await page.getByRole('button',{name:'Registrar práctica consultada (sin nota ni XP)',exact:true}).click();
    assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('840 XP provisionales'));
  }
  report.checks.push('13 nuevas lecciones: solucionarios, referencias oficiales, rúbricas y formativas 0 XP accesibles fuera del examen');
  await context.close();
  // Start directly on Splunk in another empty profile: no SC-200 migration,
  // initialization or storage read, and no lesson payload before a node opens.
  const fresh=await browser.newContext({viewport:{width:390,height:900}});
  await fresh.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await fresh.addInitScript(()=>{window.__scCalls=[];const get=Storage.prototype.getItem,set=Storage.prototype.setItem;Storage.prototype.getItem=function(k){if(k==='soc-learning-path:learning:v2'||k==='soc-learning-path:progress:v1')window.__scCalls.push(['get',k]);return get.call(this,k);};Storage.prototype.setItem=function(k,v){if(k==='soc-learning-path:learning:v2'||k==='soc-learning-path:progress:v1')window.__scCalls.push(['set',k]);return set.call(this,k,v);};});
  const direct=await fresh.newPage();await direct.goto(base+'#/splunk/ruta');await direct.locator('.sp-map-page').waitFor();
  assert.deepEqual(await direct.evaluate(()=>window.__scCalls),[]);
  const resources=await direct.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration})));
  assert.ok(!resources.some(r=>r.name.includes('splunk-content/')));
  report.measurements.push({scenario:'entrada directa Splunk vacía (Vite desarrollo si se sirve Vite)',resources});
  await fresh.close();
  await verifyR01SavedCompatibility({browser,base,catalog,lessons,report});
  await runIsolationMatrix({browser,base,sc,catalog,lessons,report});
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);report.status='passed';
} catch(error) {
  report.status = browser ? 'failed' : 'blocked_browser_launch';
  report.failure = error.stack; process.exitCode=1; console.error(error.message);
} finally {
  if(browser) await browser.close();
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(out,'resultados.json'),JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({status:report.status,checks:report.checks.length,report:path.relative(root,path.join(out,'resultados.json'))}));

async function verifyR01SavedCompatibility({browser,base,catalog,lessons,report}) {
  const scKey='soc-learning-path:learning:v2',legacyKey='soc-learning-path:progress:v1',spKey='soc-learning-path:splunk:learning:v1';
  const saved={schemaVersion:1,courseId:'splunk',rewardMode:'provisional_only',records:{},provisionalAwards:{},regionAwards:['SP-R01'],lastLesson:{id:'SP-R01-L05',updated:20}};
  for(const l of catalog.lessons.slice(0,5)) {
    const data=lessons.find(p=>p.id===l.id);
    const attempt={id:'historic-'+l.id,startedAt:10,questionIds:l.questionIds,answers:Object.fromEntries(data.questions.map(q=>[q.id,{optionId:q.solution,correct:true,answeredAt:11}])),finishedAt:12};
    saved.records[l.id]={[l.revision]:{seen:l.stepIds,studyCompleted:true,summary:true,theoryPassed:true,formativeSeen:true,reviewed:true,practicalStatus:'not_assessed',updated:20,attempts:{[attempt.id]:attempt},activeAttempt:null}};
    saved.provisionalAwards[l.id]=['review','study','summary','theory'];
  }
  // A previous revision survives alongside the current one: no recalculation.
  saved.records[catalog.lessons[0].id]['a'.repeat(24)]=structuredClone(saved.records[catalog.lessons[0].id][catalog.lessons[0].revision]);
  const context=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'});
  await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));
  await context.addInitScript(({saved,scKey,legacyKey,spKey})=>{
    if(location.protocol!=='http:')return;
    const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
    if(get.call(localStorage,'test-only:v11-r01')===null) {set.call(localStorage,spKey,JSON.stringify(saved));set.call(localStorage,'test-only:v11-r01','1');}
    window.__scCalls=[];
    Storage.prototype.getItem=function(k){if([scKey,legacyKey].includes(k))window.__scCalls.push(['get',k]);return get.call(this,k);};
    Storage.prototype.setItem=function(k,v){if([scKey,legacyKey].includes(k))window.__scCalls.push(['set',k]);return set.call(this,k,v);};
  },{saved,scKey,legacyKey,spKey});
  try {
    const p=await context.newPage();await p.goto(base+'#/splunk/ruta');await p.locator('.sp-region-card').first().waitFor();
    const loaded=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),spKey);assert.deepEqual(loaded,saved);
    assert.ok((await p.locator('.sp-profile').getAttribute('aria-label')).includes('250 XP provisionales'));
    await p.goto(base+'#/splunk/region/SP-R02');await p.locator('.sp-node').first().waitFor();
    assert.equal(await p.locator('.sp-node.available').count(),1);
    await p.goto(base+'#/splunk/leccion/SP-R03-L01');await p.getByRole('heading',{name:'Esta lección está bloqueada'}).waitFor();
    const l=catalog.lessons.find(l=>l.id==='SP-R02-L01'),data=lessons.find(item=>item.id===l.id);
    await p.goto(base+'#/splunk/leccion/'+l.id);await p.locator('.sp-reader').waitFor();
    for(let i=0;i<5;i++)await p.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click();
    await p.getByRole('button',{name:'Confirmar resumen estudiado',exact:true}).click();
    await p.getByRole('link',{name:'Ir a teoría piloto',exact:true}).click();
    await p.getByRole('button',{name:'Comenzar evaluación piloto',exact:true}).click();await p.locator('[data-active-exam]').waitFor();
    // Direct phases, other lessons and resources cannot leak solutions mid-attempt.
    await p.goto(base+'#/splunk/leccion/'+l.id+'?fase=soluciones');await p.getByRole('heading',{name:'Evaluación en curso',exact:true}).waitFor();
    await p.goto(base+'#/splunk/recursos/SP-R03');await p.getByRole('heading',{name:'Recursos pausados durante la evaluación'}).waitFor();
    await p.goto(base+'#/splunk/leccion/SP-R01-L01?fase=original');await p.getByRole('heading',{name:'Tienes una evaluación en curso'}).waitFor();
    await p.goto(base+'#/splunk/leccion/'+l.id+'?fase=teoria');await p.locator('[data-active-exam]').waitFor();
    for(const q of data.questions)await p.locator('input[value="'+q.solution+'"]').check();
    await p.getByRole('button',{name:'Finalizar evaluación y ver resultado',exact:true}).click();
    await p.getByRole('heading',{name:'Teoría aprobada en piloto',exact:true}).waitFor();await p.reload();await p.locator('.sp-reader').waitFor();
    const after=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),spKey);
    for(const id of Object.keys(saved.records))assert.deepEqual(after.records[id],saved.records[id]);
    for(const id of Object.keys(saved.provisionalAwards))assert.deepEqual(after.provisionalAwards[id],saved.provisionalAwards[id]);
    assert.deepEqual(after.regionAwards,['SP-R01']);assert.equal(after.lastLesson.id,'SP-R02-L01');
    assert.ok((await p.locator('.sp-profile').getAttribute('aria-label')).includes('275 XP provisionales'));
    assert.deepEqual(await p.evaluate(()=>window.__scCalls),[]);
    report.checks.push('Guardado R01 250 XP + historial previo: sin migración, R02 disponible/R03 bloqueada, 275 tras teoría R02L01, recarga y registros R01 intactos');
    report.checks.push('Evaluación R02 bloquea URLs de soluciones, otras lecciones y recursos; primeras respuestas e intento persisten');
  } finally {await context.close();}
}
