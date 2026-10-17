import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(await readFile(path.join(root, 'src/generated/catalog.json'), 'utf8'));
const output = path.join(root, process.env.BROWSER_OUTPUT || 'output/playwright/v24-premium-world/education');
await mkdir(output, { recursive: true });
const dist = path.join(root, 'dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  const target = path.resolve(dist, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/\/$/, '/index.html'));
  if (!target.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
  try { res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' }).end(await readFile(target)); }
  catch { res.writeHead(404).end(); }
});
if (!process.env.BROWSER_BASE_URL) await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const url = process.env.BROWSER_BASE_URL || `http://127.0.0.1:${server.address().port}/`;
const errors = [], outsideRequests = [], results = [];
let browser;
const key = 'soc-learning-path:progress:v1';
const lessonUrl = id => url + '#/leccion/' + encodeURIComponent(id);
const chapterUrl = id => url + '#/capitulo/' + encodeURIComponent(id);
const test = async (name, fn) => { await fn(); results.push(name); console.log('PASS', name); };
const withinViewport = async page => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No debe existir desbordamiento horizontal de página');
async function createContext(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1050 }, ...options });
  await ctx.route('**/*', route => {
    const request = route.request().url();
    if (request.startsWith(url) || request.startsWith('data:')) return route.continue();
    outsideRequests.push(request); return route.abort();
  });
  ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  return ctx;
}

const v2 = 'soc-learning-path:learning:v2';
const payloads = new Map(await Promise.all(catalog.lessons.map(async l => [l.id, JSON.parse(await readFile(path.join(root, 'public', l.file), 'utf8'))])));
const reviewed = catalog.lessons.filter(l => l.learning.coverage === 'reviewed');
const legacy = JSON.stringify({schemaVersion: 1, completed: Object.fromEntries(catalog.lessons.map(l => [l.id,l.version])),lastLesson:null});
const coverage = JSON.parse(await readFile(path.join(root,'docs/education-coverage.json'),'utf8'));
const activityIds = [];
const surface = p => p.locator('.activity-surface');
async function phase(p, value) { await p.goto(lessonUrl(currentLesson) + '?fase=' + value); await surface(p).waitFor(); }
let currentLesson;
async function seed(ctx) { await ctx.addInitScript(({key,legacy}) => { if (location.protocol === 'http:' && !localStorage.getItem('test-seeded')) { localStorage.setItem(key,legacy); localStorage.setItem('test-seeded','1'); } }, {key,legacy}); }
async function answer(p, q, correct) {
  const card=p.locator(`[data-question="${q.id}"]`); await card.waitFor();
  const target = correct ? q.solution : ['match','order'].includes(q.type) ? [...q.solution].reverse() : q.type==='multi' ? [q.options.find(o=>!q.solution.includes(o.id)).id] : [q.options.find(o=>!q.solution.includes(o.id)).id];
  if(q.type==='match') { for(let i=0;i<target.length;i++) await card.locator('select').nth(i).selectOption(target[i]); }
  else if(q.type==='order') {
    for(let i=0;i<target.length;i++) {
      const text=q.options.find(o=>o.id===target[i]).text;
      let at=await card.locator('.ordering-rows li').evaluateAll((nodes,text)=>nodes.findIndex(n=>n.textContent.includes(text)),text);
      while(at>i) { await card.getByRole('button',{name:'Subir paso: '+text,exact:true}).click();at--; }
    }
  } else { for(const value of target) await card.locator(`input[value="${value}"]`).check(); }
  await card.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();
  await card.locator('.answer-feedback.'+(correct?'correct':'incorrect')).waitFor();
  assert.ok((await card.locator('.answer-feedback').innerText()).includes(q.explanation));
  await card.locator('.answer-source summary').click();
  assert.ok((await card.locator('.answer-source').innerText()).includes(q.references[0].quote));
  await withinViewport(p);
}
async function practiceAll(p, edu) {
  await phase(p,'practica');
  const questions=edu.questions.filter(q=>q.phase==='practice');
  for(let i=0;i<questions.length;i++) {
    await p.getByRole('button',{name:`Actividad ${i+1}`,exact:true}).click();
    const q=questions[i]; await answer(p,q,false);
    await p.getByRole('button',{name:'Volver a intentarlo',exact:true}).click();
    await answer(p,q,true); activityIds.push(q.id);
  }
}
async function exam(p,edu,correct) {
  await phase(p,'evaluacion');
  const start=p.getByRole('button',{name:'Comenzar evaluación',exact:true});
  if(await start.count()) await start.click(); else await p.getByRole('button',{name:'Repetir evaluación',exact:true}).click();
  const questions=edu.questions.filter(q=>q.phase==='assessment');
  for(let i=0;i<questions.length;i++) {
    await answer(p,questions[i],correct);
    assert.equal(await p.getByRole('button',{name:'Volver a intentarlo',exact:true}).count(),0);
    if(correct) activityIds.push(questions[i].id);
    await p.getByRole('button',{name:i===questions.length-1?'Ver resultados':'Siguiente pregunta',exact:true}).click();
  }
  await p.getByRole('heading',{name:'Tu resultado',exact:true}).waitFor();
  assert.equal(await p.locator('.assessment-score').innerText(),`${correct?questions.length:0} / ${questions.length}`);
}
try {
  browser = process.env.BROWSER_CDP_URL ? await chromium.connectOverCDP(process.env.BROWSER_CDP_URL) : await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const context=await createContext(),page=await context.newPage();
  const first=reviewed.find(l=>payloads.get(l.id).education.pilot);
  await test('producción: 13 capítulos, bloqueos y cero XP al abrir',async()=>{
    await page.goto(url);await page.locator('.stage').first().waitFor();
    assert.equal(await page.locator('.stage').count(),13);assert.equal(await page.locator('.stage.locked').count(),12);
    await page.getByRole('link',{name:'Empezar mi aventura',exact:true}).click();await surface(page).waitFor();
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('0 XP'));
    await withinViewport(page);await page.screenshot({path:path.join(output,'v15-introduction.png'),fullPage:true});
    await page.goto(lessonUrl(catalog.modules[1].lessonIds[0]));await page.getByRole('heading',{name:'Esta lectura aún está bloqueada'}).waitFor();
  });
  await test('piloto teórico: pasos, errores explicados, reintento, evaluación y XP acotados',async()=>{
    currentLesson=first.id;const edu=payloads.get(first.id).education;
    await phase(page,'introduccion');await page.getByRole('link',{name:'Ver mis apuntes originales',exact:true}).click();await page.locator('.markdown').waitFor();
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('0 XP'));
    await phase(page,'aprende');
    for(let i=0;i<edu.steps.length;i++) await page.getByRole('button',{name:'Lo entiendo · continuar',exact:true}).click();
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('5 XP'));
    await practiceAll(page,edu);await phase(page,'resumen');await page.getByRole('button',{name:'Marcar como completada',exact:true}).click();
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('15 XP'));
    await exam(page,edu,false);await exam(page,edu,true);
    await page.getByRole('heading',{name:'¡Dominio demostrado!',exact:true}).waitFor();
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('45 XP'));
    await page.screenshot({path:path.join(output,'v15-results.png'),fullPage:true});
    await page.goto(lessonUrl(first.id)+'?fase=repaso&actividad='+edu.questions[0].id);await answer(page,edu.questions[0],true);
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('50 XP'));
    await page.getByRole('button',{name:'Practicar de nuevo',exact:true}).click();await answer(page,edu.questions[0],true);
    await page.reload();await surface(page).waitFor();assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes('50 XP'));
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
  });
  const migrated=await createContext();await seed(migrated);const p=await migrated.newPage();
  await test('migración conserva literalmente V1: 76 completadas, 3200 XP, cero dominios inventados',async()=>{
    await p.goto(url);await p.locator('.profile').waitFor();
    assert.ok((await p.locator('.profile').getAttribute('aria-label')).includes('3200 XP'));
    assert.equal(await p.locator('.stage.completed').count(),13);
    const stored=await p.evaluate(v2=>JSON.parse(localStorage.getItem(v2)),v2);assert.equal(Object.keys(stored.legacy).length,76);
    assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),legacy);
  });
  await test(`${reviewed.length} lecciones revisadas: todas las actividades se responden mal y bien con fundamento`,async()=>{
    for(const lesson of reviewed) {
      currentLesson=lesson.id;const edu=payloads.get(lesson.id).education;
      await practiceAll(p,edu);await phase(p,'resumen');
      await p.getByRole('button',{name:'Marcar como completada',exact:true}).click();
      await exam(p,edu,false);await exam(p,edu,true);
      await p.getByRole('heading',{name:'¡Dominio demostrado!',exact:true}).waitFor();
      await p.reload();await surface(p).waitFor();
      assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),legacy);
    }
  });
  await test('76 originales conservados, tablas, 29 códigos, y 76 guías disponibles',async()=>{
    let tables=0,code=0;
    for(const lesson of catalog.lessons) {
      await p.goto(lessonUrl(lesson.id)+'?modo=apuntes');await p.locator('.markdown').waitFor();
      assert.ok((await p.locator('.markdown').innerText()).trim().length>0,lesson.id);
      tables+=await p.locator('.markdown table').count();code+=await p.locator('.markdown pre').count();await withinViewport(p);
      await p.goto(lessonUrl(lesson.id)+'?fase=aprende&paso=0');await surface(p).waitFor();
      await p.locator('.source-fragment-label').waitFor();await withinViewport(p);
    }
    assert.ok(tables>40);assert.equal(code,29);
  });
  await test('estudio pendiente de enriquecimiento: termina sin simular examen ni dominio',async()=>{
    const ctx=await createContext();await seed(ctx);const pending=await ctx.newPage();
    for(const guided of catalog.lessons.filter(l=>l.learning.coverage==='guided')) {
      currentLesson=guided.id;await phase(pending,'aprende');
      for(let i=0;i<payloads.get(guided.id).education.steps.length;i++) await pending.getByRole('button',{name:'Lo entiendo · continuar',exact:true}).click();
      await pending.getByRole('button',{name:'Marcar como completada',exact:true}).click();
      assert.ok((await pending.locator('.profile').getAttribute('aria-label')).includes('3200 XP'));
      await phase(pending,'evaluacion');assert.ok((await surface(pending).innerText()).includes('Evaluación pendiente de revisión'));
      assert.equal(await pending.getByRole('button',{name:'Comenzar evaluación',exact:true}).count(),0);
      const record=await pending.evaluate(({v2,id,revision})=>JSON.parse(localStorage.getItem(v2)).records[id][revision],{v2,id:guided.id,revision:guided.learning.revision});
      assert.equal(record.completed,true);assert.equal(record.mastered,false);
    }
    await ctx.close();
  });
  await test('completar la etapa desbloquea la siguiente, bonus único y exportación real',async()=>{
    for(const id of catalog.modules[0].lessonIds.filter(id=>id!==first.id)) {
      currentLesson=id;await phase(page,'resumen');
      if(await page.getByRole('button',{name:'Lección completada',exact:true}).count())continue;
      await phase(page,'aprende');const edu=payloads.get(id).education;
      for(let i=0;i<edu.steps.length;i++)await page.getByRole('button',{name:'Lo entiendo · continuar',exact:true}).click();
      if(edu.questions.some(q=>q.phase==='practice'))await practiceAll(page,edu);
      await phase(page,'resumen');
      await page.getByRole('button',{name:'Marcar como completada',exact:true}).click();
    }
    await page.goto(url+'#/ruta');await page.locator('.stage.completed').waitFor();
    assert.equal(await page.locator('.stage.completed').count(),1);assert.equal(await page.locator('.stage.available').count(),1);assert.equal(await page.locator('.stage.locked').count(),11);
    const chapterXP=50+catalog.modules[0].lessonIds.filter(id=>id!==first.id).reduce((n,id)=>n+10+(payloads.get(id).education.questions.some(q=>q.phase==='practice')?5:0),0)+100;
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes(`${chapterXP} XP`));
    await page.goto(lessonUrl(catalog.modules[1].lessonIds[0]));await surface(page).waitFor();await page.reload();await surface(page).waitFor();
    assert.ok((await page.locator('.profile').getAttribute('aria-label')).includes(`${chapterXP} XP`));
    await page.goto(url+'#/progreso');await page.getByRole('heading',{name:'Cada paso cuenta'}).waitFor();
    const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar progreso',exact:true}).click();
    const file=await download;assert.equal(file.suggestedFilename(),'soc-learning-path-progreso.json');
    const backup=JSON.parse(await readFile(await file.path(),'utf8'));assert.equal(backup.format,'soc-learning-path-v1.5');assert.equal(backup.legacyRaw,null);assert.equal(backup.progress.schemaVersion,2);
  });
  await test('búsqueda, filtros y repaso conservan navegación real',async()=>{
    await p.goto(url+'#/biblioteca');await p.getByRole('searchbox').fill('automAtizacion');
    await p.locator('.search-snippet').first().waitFor();assert.ok(await p.locator('.library-result').count()>0);
    await p.getByRole('searchbox').fill('termino-imposible-zzz');await p.getByRole('heading',{name:'No aparece en estas lecturas'}).waitFor();
    await p.getByRole('button',{name:'Ver todo el contenido'}).click();await p.waitForFunction(()=>document.querySelectorAll('.library-result').length===76);
    await p.getByRole('combobox').selectOption(catalog.modules[0].id);await p.reload();assert.equal(await p.getByRole('combobox').inputValue(),catalog.modules[0].id);
    await p.goto(url+'#/repaso');await p.locator('h1').waitFor();assert.ok(await p.locator('a[href*="fase=repaso"]').count()>0);
    await p.screenshot({path:path.join(output,'v15-review.png'),fullPage:true});
  });
  await test('móvil 320/390: fases, comparación, procedimientos, ejercicios y navegación',async()=>{
    for(const width of [320,390]) {
      const ctx=await createContext({viewport:{width,height:844},isMobile:true,hasTouch:true});await seed(ctx);const m=await ctx.newPage();
      await m.goto(url);await m.locator('.stage').first().waitFor();await withinViewport(m);assert.equal(await m.locator('.skip-link').evaluate(n=>getComputedStyle(n).opacity),'0');
      for(const lesson of reviewed.filter(l=>payloads.get(l.id).education.pilot)) {
        const edu=payloads.get(lesson.id).education;
        await m.goto(lessonUrl(lesson.id)+'?fase=aprende&paso=0');await m.locator('.source-fragment-label').waitFor();await withinViewport(m);
        await m.goto(lessonUrl(lesson.id)+'?fase=practica');await answer(m,edu.questions.find(q=>q.phase==='practice'),true);
      }
      await m.screenshot({path:path.join(output,`v15-mobile-${width}.png`),fullPage:true});
      await m.getByRole('link',{name:'Repaso',exact:true}).click();await m.locator('h1').waitFor();await withinViewport(m);
      await ctx.close();
    }
  });
  await test('teclado, foco y movimiento reducido',async()=>{
    const ctx=await createContext({reducedMotion:'reduce'}),m=await ctx.newPage();await m.goto(url);await m.locator('h1').waitFor();
    await m.keyboard.press('Tab');assert.equal(await m.evaluate(()=>document.activeElement?.textContent),'Saltar al contenido');assert.equal(await m.locator('.skip-link').evaluate(n=>getComputedStyle(n).opacity),'1');await m.keyboard.press('Enter');assert.equal(await m.evaluate(()=>document.activeElement?.id),'main-content');
    await m.getByRole('link',{name:'Empezar mi aventura',exact:true}).click();await surface(m).waitFor();await m.getByRole('button',{name:'Empezar a aprender',exact:true}).click();
    const motion=await surface(m).evaluate(n=>({transform:getComputedStyle(n).transform,duration:getComputedStyle(n).animationDuration}));assert.equal(motion.transform,'none');
    assert.equal(await m.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);await ctx.close();
  });
  await test('datos corruptos y almacenamiento no disponible no se sobrescriben ni impiden estudiar',async()=>{
    const broken=await createContext();await broken.addInitScript(v2=>{if(location.protocol==='http:')localStorage.setItem(v2,'{malformed');},v2);const b=await broken.newPage();await b.goto(url);await b.getByRole('alert').waitFor();
    await b.getByRole('link',{name:'Empezar mi aventura',exact:true}).click();await surface(b).waitFor();assert.equal(await b.evaluate(v2=>localStorage.getItem(v2),v2),'{malformed');
    const unavailable=await createContext();await unavailable.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Denied','QuotaExceededError');};});
    const q=await unavailable.newPage();await q.goto(url);await q.getByRole('alert').waitFor();await q.getByRole('link',{name:'Empezar mi aventura',exact:true}).click();await surface(q).waitFor();
    await broken.close();await unavailable.close();
  });
  assert.deepEqual(errors,[]);assert.deepEqual(outsideRequests,[]);
  assert.equal(new Set(activityIds).size,coverage.activities);
  await writeFile(path.join(output,`v15-${coverage.phase}-results.json`),JSON.stringify({testedAt:new Date().toISOString(),productionBuild:true,testedDirectory:root,testedUrl:url,phase:coverage.phase,results,pageErrors:errors,outsideRequests,inspectedLessons:76,reviewedLessons:reviewed.length,verifiedActivities:[...new Set(activityIds)],sourceHash:catalog.sourceHash},null,2));
  console.log(`\n${results.length} grupos; 76 originales y guías; ${new Set(activityIds).size} actividades verificadas en navegador.`);
} finally { await browser?.close();if(server.listening) await new Promise(resolve=>server.close(resolve)); }
