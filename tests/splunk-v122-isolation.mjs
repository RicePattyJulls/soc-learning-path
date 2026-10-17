import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// V1.2.2 continuation of the original isolation cases. Only reader/header
// controls changed; fixtures, storage assertions, XP and corruption checks stay.
export async function runReaderIsolationMatrix({ browser, base, sc, catalog, lessons, report }) {
  const scKey = 'soc-learning-path:learning:v2', legacyKey = 'soc-learning-path:progress:v1', spKey = 'soc-learning-path:splunk:learning:v1';
  const first = catalog.lessons[0], payload = lessons[0];
  const lessonHash = (phase = 'estudio', step = 1) => `#/splunk/leccion/${first.id}?fase=${phase}&paso=${step}`;
  const scBlank = () => ({ schemaVersion: 2, legacy: {}, lastLesson: null, records: {}, awards: {}, chapterAwards: [] });
  const scRecord = () => ({ started: true, seen: [], solved: [], cursor: 0, updated: 10, summary: false, completed: false, mastered: false, practice: {}, attempts: {}, activeAttempt: null, mistakes: {} });
  const scLesson = sc.lessons.find(l => l.learning.previousRevision) || sc.lessons[0];
  const partial = scBlank();
  partial.records[scLesson.id] = { [scLesson.learning.revision]: { ...scRecord(), seen: scLesson.learning.stepIds.slice(0,1) } };
  partial.lastLesson = scLesson.id;
  const v24 = scBlank();
  v24.records[scLesson.id] = { [scLesson.learning.previousRevision || scLesson.learning.revision]: { ...scRecord(), seen: scLesson.learning.stepIds, summary: true, completed: true, cursor: scLesson.learning.stepIds.length - 1 } };
  v24.awards[scLesson.id] = ['study','summary']; v24.lastLesson = scLesson.id;
  const v25 = structuredClone(v24);
  v25.records[scLesson.id] = { [scLesson.learning.revision]: { ...scRecord(), seen: scLesson.learning.stepIds, summary: true, completed: true, cursor: scLesson.learning.stepIds.length - 1 } };
  const fixtures = [
    { name:'vacío', interactive:null, legacy:null },
    { name:'parcial', interactive:JSON.stringify(partial), legacy:null },
    { name:'legacy', interactive:null, legacy:JSON.stringify({schemaVersion:1,completed:Object.fromEntries(sc.lessons.slice(0,17).map(l=>[l.id,l.version])),lastLesson:sc.lessons[0].id}) },
    { name:'V2.4', interactive:JSON.stringify(v24), legacy:null },
    { name:'V2.5', interactive:JSON.stringify(v25), legacy:null },
    { name:'corrupto', interactive:'{fixture SC-200 ilegible', legacy:null },
  ];
  const makeContext = async (fixture = {name:'sin SC-200',interactive:null,legacy:null}, splunkRaw = null, quota = false) => {
    const context = await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'});
    await context.route('**/*', route => {
      if (route.request().url().startsWith(base)) return route.continue();
      report.external.push(route.request().url()); return route.abort();
    });
    await context.addInitScript(({fixture,splunkRaw,quota,scKey,legacyKey,spKey}) => {
      if(location.protocol!=='http:')return;
      const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
      if(get.call(localStorage,'test-only:matrix-seeded')===null) {
        if(fixture.interactive!==null)set.call(localStorage,scKey,fixture.interactive);
        if(fixture.legacy!==null)set.call(localStorage,legacyKey,fixture.legacy);
        if(splunkRaw!==null)set.call(localStorage,spKey,splunkRaw);
        set.call(localStorage,'test-only:matrix-seeded','1');
      }
      window.__courseCalls=[];
      window.__rawScSnapshot=()=>({interactive:get.call(localStorage,scKey),legacy:get.call(localStorage,legacyKey)});
      Storage.prototype.getItem=function(key){if([scKey,legacyKey,spKey].includes(key))window.__courseCalls.push(['get',key]);return get.call(this,key);};
      Storage.prototype.setItem=function(key,value){
        if([scKey,legacyKey,spKey].includes(key))window.__courseCalls.push(['set',key]);
        if(quota&&key===spKey)throw new DOMException('Cuota sintética de prueba','QuotaExceededError');
        return set.call(this,key,value);
      };
      const remove=Storage.prototype.removeItem,clear=Storage.prototype.clear;
      Storage.prototype.removeItem=function(key){if([scKey,legacyKey,spKey].includes(key))window.__courseCalls.push(['remove',key]);return remove.call(this,key);};
      Storage.prototype.clear=function(){window.__courseCalls.push(['clear','all']);return clear.call(this);};
    },{fixture,splunkRaw,quota,scKey,legacyKey,spKey});
    context.on('page',page=>page.on('pageerror',error=>report.errors.push(`matriz/${fixture.name}: ${error.message}`)));
    return context;
  };
  const assertNoScAccess = async page => assert.deepEqual(await page.evaluate(({scKey,legacyKey})=>window.__courseCalls.filter(([action,key])=>key===scKey||key===legacyKey||action==='clear'),{scKey,legacyKey}),[]);
  const waitStore = async (page, count) => page.waitForFunction(({spKey,id,revision,count})=>{
    const store=JSON.parse(localStorage.getItem(spKey));
    return store?.records[id]?.[revision]?.seen.length===count;
  },{spKey,id:first.id,revision:first.revision,count});
  for(const fixture of fixtures) {
    const context=await makeContext(fixture);
    try {
      const page=await context.newPage();
      await page.goto(base+'#/ruta'); await page.locator('.world-atlas').waitFor();
      // Wait for mount effects, not an arbitrary time delay.
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const initialSc=await page.evaluate(()=>window.__rawScSnapshot());
      const profile=await page.locator('.profile').getAttribute('aria-label');
      await page.evaluate(()=>{window.__courseCalls=[];});
      await page.locator('.academy-selector a[href="#/splunk/ruta"]').click(); await page.locator('.sp-map-page').waitFor();
      assert.ok((await page.locator('.sp-profile').getAttribute('aria-label')).includes('0 XP provisionales'));
      await page.goto(base+lessonHash()); await page.locator('.sp-reader').waitFor();
      await page.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click(); await waitStore(page,1);
      await page.reload(); await page.locator('.sp-reader').waitFor(); await waitStore(page,1);
      await assertNoScAccess(page);
      assert.deepEqual(await page.evaluate(()=>window.__rawScSnapshot()),initialSc,fixture.name+' durante Splunk');
      await page.locator('.academy-selector a[href="#/ruta"]').click(); await page.locator('.world-atlas').waitFor();
      assert.equal(await page.locator('.profile').getAttribute('aria-label'),profile,fixture.name+' XP/nivel');
      assert.deepEqual(await page.evaluate(()=>window.__rawScSnapshot()),initialSc,fixture.name+' al volver');
      report.checks.push(`Matriz SC-200 ${fixture.name}: estudio Splunk/recarga/selector, cero accesos SC durante Splunk y XP/guardado nativo conservados`);
    } finally { await context.close(); }
  }
  for(const raw of ['{fixture Splunk ilegible',JSON.stringify({schemaVersion:2,courseId:'splunk'}),JSON.stringify({schemaVersion:1,courseId:'sc200'})]) {
    const context=await makeContext(undefined,raw);
    try {
      const page=await context.newPage(); await page.goto(base+lessonHash()); await page.locator('.sp-reader').waitFor();
      await page.locator('.storage-warning').waitFor();
      await page.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click();
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),spKey),raw);
      await assertNoScAccess(page);
      report.checks.push('Splunk corrupto/futuro/otro curso: aviso visible y original conservado sin sobrescritura');
    } finally { await context.close(); }
  }
  const quotaContext=await makeContext(undefined,null,true);
  try {
    const page=await quotaContext.newPage(); await page.goto(base+lessonHash()); await page.locator('.sp-reader').waitFor();
    await page.locator('.storage-warning').waitFor();
    await page.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click();
    await page.locator('.site-header .primary-nav a[href="#/splunk/progreso"]').click(); await page.locator('.sp-journal').waitFor();
    const download=page.waitForEvent('download'); await page.getByRole('button',{name:'Exportar progreso Splunk',exact:true}).click();
    const exported=JSON.parse(await readFile(await(await download).path(),'utf8'));
    assert.equal(exported.progress.records[first.id][first.revision].seen.length,1);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),spKey),null); await assertNoScAccess(page);
    report.checks.push('Cuota Splunk: estudio en memoria, aviso y exportación recuperable sin tocar SC-200');
  } finally { await quotaContext.close(); }
  for(const fault of ['missing','tampered']) {
    const context=await makeContext();
    try {
      await context.route(base+first.file,route=>route.fulfill(fault==='missing'?{status:404,body:''}:{status:200,contentType:'application/json',body:JSON.stringify({...payload,courseId:'sc200'})}));
      const page=await context.newPage(); await page.goto(base+lessonHash());
      await page.getByRole('heading',{name:'No se pudo abrir la lección',exact:true}).waitFor();
      assert.equal(await page.locator('[data-active-exam]').count(),0); await assertNoScAccess(page);
      await page.getByRole('button',{name:'Reintentar',exact:true}).click();
      await page.getByRole('heading',{name:'No se pudo abrir la lección',exact:true}).waitFor();
      await page.getByRole('link',{name:'Volver al mapa',exact:true}).click(); await page.locator('.sp-map-page').waitFor();
      report.checks.push(`Payload ${fault}: error recuperable sin reemplazo por SC-200 ni evaluación del contenido incorrecto`);
    } finally { await context.close(); }
  }
  const tabs=await makeContext();
  try {
    const one=await tabs.newPage(),two=await tabs.newPage();
    await one.goto(base+lessonHash()); await one.locator('.sp-reader').waitFor();
    await one.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click(); await waitStore(one,1);
    await one.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click(); await waitStore(one,2);
    await two.goto(base+lessonHash('estudio',3)); await two.locator('.sp-reader').waitFor();
    for(let step=3;step<=5;step++) {
      await two.getByRole('button',{name:'Marcar estudiado y continuar',exact:true}).click(); await waitStore(two,step);
    }
    await one.getByText('Estudio completado',{exact:true}).waitFor();
    await two.getByRole('button',{name:'Conecta ideas',exact:true}).click();
    await two.getByRole('button',{name:'Confirmar resumen estudiado',exact:true}).click();
    await two.getByRole('link',{name:'Ir a teoría piloto',exact:true}).click();
    await two.getByRole('button',{name:'Comenzar evaluación piloto',exact:true}).click();
    const [q1,q2]=payload.questions,wrong=q1.options.find(o=>o.id!==q1.solution).id;
    await two.locator(`input[value="${wrong}"]`).check();
    await one.goto(base+lessonHash('teoria')); await one.locator('[data-active-exam]').waitFor();
    assert.equal(await one.locator(`[data-question="${q1.id}"] input:enabled`).count(),0);
    assert.ok(await one.locator(`input[value="${wrong}"]`).isChecked());
    await one.locator(`input[value="${q2.solution}"]`).check();
    await two.waitForFunction(id=>!!document.querySelector(`input[value="${id}"]:checked`),q2.solution);
    for(const q of payload.questions)assert.equal(await two.getByText(q.explanation,{exact:true}).count(),0);
    await one.getByRole('button',{name:'Demuestra',exact:true}).click();
    await one.getByRole('button',{name:'Finalizar evaluación y ver resultado',exact:true}).click();
    await two.getByRole('heading',{name:'Necesitas repasar la teoría',exact:true}).waitFor();
    assert.ok((await two.locator('.sp-profile').getAttribute('aria-label')).includes('10 XP provisionales'));
    await assertNoScAccess(one); await assertNoScAccess(two);
    report.checks.push('Dos pestañas: estudio/resumen e intento compartido, primeras respuestas conservadas, 1/2 falla y XP único sin escrituras SC-200');
  } finally { await tabs.close(); }
}
