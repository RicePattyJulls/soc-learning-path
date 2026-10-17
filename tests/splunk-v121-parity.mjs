import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright-core';
const arg=(name,fallback)=>{const at=process.argv.indexOf(name);return at<0?fallback:process.argv[at+1];};
const base=arg('--base-url','http://127.0.0.1:5187/'),before=arg('--before-url',null);
for(const url of [base,before].filter(Boolean))assert.match(url,/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/);
const out=arg('--output-dir','output/playwright/splunk-v121/'+new Date().toISOString().replaceAll(/[:.]/g,'-'));
assert.ok(/^output\/playwright\/splunk-v121\/[\w/-]+$/.test(out)&&!out.includes('..'));
await mkdir(out,{recursive:true});
const sc=JSON.parse(await readFile('src/generated/catalog.json')),sp=JSON.parse(await readFile('src/generated/splunk/catalog.json'));
const widths=[390,768,1024,1440,1920,2560,320];
const report={date:new Date().toISOString(),base,before,widths,viewportHeight:1000,status:'not_started',measurements:[],comparisons:[],accessibility:[],checks:[],errors:[],external:[],visualVerdict:'pending_human_review',beforeCaptures:before?'requested':'pending_before_server'};
let browser;
const near=(a,b,label,tolerance=1)=>assert.ok(Math.abs(a-b)<=tolerance,`${label}: SC-200=${a}, Splunk=${b}`);
async function inspect(page,url,name,width,validate=true){
  await page.goto(url);await page.locator('.adventure-map,.sp-world-map').first().waitFor();
  await page.evaluate(()=>document.fonts.ready);
  // Wait for ResizeObserver geometry to settle, rather than measuring the initial aspect ratio.
  await page.waitForFunction(()=>{const e=document.querySelector('.adventure-scene,.sp-world-scene');if(!e)return false;const stamp=e.getAttribute('style');const stable=e.dataset.testLast===stamp;e.dataset.testLast=stamp;return stable;},null,{polling:'raf'});
  await page.evaluate(()=>scrollTo(0,0));
  const measurement=await page.evaluate(()=>{
    const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const box=s=>rect(document.querySelector(s));
    const scene=document.querySelector('.adventure-scene,.sp-world-scene'),s=rect(scene);
    const stations=[...document.querySelectorAll('.map-station,.sp-world-station')];
    const node=box('.station-platform,.sp-world-platform');
    const style=(selector,pseudo=null)=>{const el=document.querySelector(selector);if(!el)return null;const c=getComputedStyle(el,pseudo);return {borderRadius:c.borderRadius,boxShadow:c.boxShadow,fontSize:c.fontSize,outline:c.outline,transform:c.transform};};
    return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,atlas:box('.adventure-map,.sp-world-map'),scene:s,visibleSceneHeight:Math.max(0,Math.min(s.bottom,innerHeight)-Math.max(0,s.y)),header:box('.site-header,.sp-header'),hero:box('.region-welcome,.sp-world-heading'),progress:box('.region-meter,.sp-world-toolbar'),stats:box('.atlas-stats'),camp:box('.adventure-camp,.sp-world-status'),node,control:box('.station-action,.sp-world-control'),plaque:box('.station-plaque,.sp-world-plaque'),stations:stations.map(rect),points:stations.map(el=>({x:parseFloat(el.style.left),y:parseFloat(el.style.top)})),road:box('.adventure-road,.sp-world-road'),terrainLayers:document.querySelectorAll('[data-terrain] path').length,scenery:document.querySelectorAll('[data-scenery] use').length,nodeStyle:style('.station-platform,.sp-world-platform'),nodeBaseStyle:style('.station-platform,.sp-world-platform','::before'),nodeRimStyle:style('.station-platform,.sp-world-platform','::after'),glyphStyle:style('.station-glyph,.sp-world-glyph'),plaqueStyle:style('.station-plaque,.sp-world-plaque'),heroStyle:style('.region-welcome,.sp-world-heading'),mapStyle:style('.adventure-map,.sp-world-map'),mapWidth:Number(scene.dataset.mapWidth),mapHeight:Number(scene.dataset.mapHeight)};
  });
  report.measurements.push({name,width,...measurement});
  // Read-only diagnostic for the demonstrated 320 px failure. The strict
  // near(...,'Panel') assertion and all axe/overflow checks remain unchanged.
  if(width===320&&name.endsWith('atlas')) {
    const intrinsic=await page.evaluate(()=>['.map-overlay','.atlas-progress','.region-meter','.atlas-stats',...Array.from({length:3},(_,i)=>`.atlas-stats>div:nth-child(${i+1})`)].map(selector=>{const el=document.querySelector(selector);if(!el)return {selector,missing:true};const r=el.getBoundingClientRect(),c=getComputedStyle(el);return {selector,text:el.textContent,rect:{x:r.x,width:r.width,right:r.right},minWidth:c.minWidth,maxWidth:c.maxWidth,display:c.display,gridTemplateColumns:c.gridTemplateColumns,flex:c.flex,overflow:c.overflow};}));
    (report.panelDiagnostics||=[]).push({name,width,intrinsic});
  }
  if(validate){
    assert.ok(measurement.scrollWidth<=width+1,`${name}/${width}: overflow`);
    const bounds=measurement.stations;
    for(const a of bounds)assert.ok(a.x>=0&&a.right<=width+1,`${name}: placa dentro de pantalla`);
    for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++){const a=bounds[i],b=bounds[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,`${name}/${width}: estaciones ${i}/${j} se pisan`);}
    if(name.startsWith('splunk')){
      const overlay=await page.locator('.map-overlay').boundingBox();
      for(const r of bounds)assert.ok(r.y>=overlay.y+overlay.height,`${name}/${width}: panel intercepta nodo`);
      for(const control of await page.locator('.sp-world-control').all()){
        await control.scrollIntoViewIfNeeded();
        assert.ok(await control.evaluate(el=>{const r=el.querySelector('.station-platform').getBoundingClientRect();const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return !!top&&el.contains(top);}),`${name}/${width}: paisaje intercepta nodo`);
      }
    }
    assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
    await page.addScriptTag({path:'output/v25/reanudacion/axe.min.js'});
    const axe=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});const summarize=v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))});return {violations:r.violations.map(summarize),incomplete:r.incomplete.map(summarize)};});
    report.accessibility.push({name,width,...axe});assert.deepEqual(axe.violations,[],`axe ${name}/${width}`);
  }
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(out,`${name}-${width}.png`),fullPage:true});
  await page.screenshot({path:path.join(out,`${name}-${width}-viewport.png`),fullPage:false});
  return measurement;
}
try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});report.browser=browser.version();report.status='running';
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));
  await context.route('**/*',route=>{if([base,before].filter(Boolean).some(origin=>route.request().url().startsWith(origin)))return route.continue();report.external.push(route.request().url());return route.abort();});
  const page=await context.newPage();
  for(const width of widths){
    await page.setViewportSize({width,height:1000});
    if(before)for(const [name,hash] of [['antes-sc200','#/ruta'],['antes-splunk','#/splunk/ruta'],...sp.regions.map(r=>['antes-'+r.id,'#/splunk/region/'+r.id])])await inspect(page,before+hash,name,width,false);
    const master=await inspect(page,base+'#/ruta','sc200-atlas',width);
    const adapted=await inspect(page,base+'#/splunk/ruta','splunk-atlas',width);
    (report.comparisonAttempts||=[]).push({width,masterPanel:master.progress,adaptedPanel:adapted.progress,panelWidthDelta:adapted.progress.width-master.progress.width});
    for(const [field,label] of [['atlas','Ancho útil'],['scene','Paisaje'],['node','Nodos'],['plaque','Placas']])near(master[field].width,adapted[field].width,label);
    near(master.node.height,adapted.node.height,'Altura del nodo');near(master.header.height,adapted.header.height,'Cabecera');near(master.hero.width,adapted.hero.width,'Hero');near(master.progress.width,adapted.progress.width,'Panel');near(master.atlas.x,adapted.atlas.x,'Margen');near(master.atlas.y,adapted.atlas.y,'Posición del atlas',4);
    assert.deepEqual(adapted.nodeStyle,master.nodeStyle,'Nodo');assert.deepEqual(adapted.nodeBaseStyle,master.nodeBaseStyle,'Base y sombra del nodo');assert.deepEqual(adapted.nodeRimStyle,master.nodeRimStyle,'Borde del nodo');assert.deepEqual(adapted.glyphStyle,master.glyphStyle,'Relieve del icono');assert.deepEqual(adapted.plaqueStyle,master.plaqueStyle,'Placa');
    if(width===2560){assert.ok(adapted.atlas.width/width>=.974);}
    report.comparisons.push({width,sc200Width:master.atlas.width,splunkWidth:adapted.atlas.width,sc200Height:master.scene.height,splunkHeight:adapted.scene.height,sc200VisibleHeight:master.visibleSceneHeight,splunkVisibleHeight:adapted.visibleSceneHeight,nodeDelta:adapted.node.width-master.node.width,heroWidthDelta:adapted.hero.width-master.hero.width,atlasTopDelta:adapted.atlas.y-master.atlas.y,heightNote:'13 destinos SC-200 / 11 Splunk: distinta longitud total, misma escala y geometría por fila.'});
    for(const region of sp.regions){
      const chapter=sc.modules.find(c=>c.lessonIds.length===region.lessonIds.length);assert.ok(chapter,'Referencia SC-200 con igual número de nodos');
      const reference=await inspect(page,base+'#/capitulo/'+chapter.id,'sc200-par-'+region.id,width);
      const target=await inspect(page,base+'#/splunk/region/'+region.id,'splunk-'+region.id,width);
      near(reference.atlas.width,target.atlas.width,'Ancho regional');near(reference.node.width,target.node.width,'Nodo regional');near(reference.node.height,target.node.height,'Altura nodo regional');
      assert.equal(target.stations.length,region.lessonIds.length);
      assert.equal(await page.locator('[data-river="true"]').count(),1);
    }
  }
  // Lock and return focus with keyboard, including measured expanded requirements.
  await page.setViewportSize({width:390,height:1000});await page.goto(base+'#/splunk/region/SP-R01');
  const locked=page.locator('#sp-node-SP-R01-L02');await locked.focus();await page.keyboard.press('Enter');assert.equal(await locked.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await locked.getAttribute('aria-expanded'),'false');
  const first=page.locator('#sp-node-SP-R01-L01');await first.focus();await page.keyboard.press('Space');await page.locator('[data-lesson="SP-R01-L01"]').waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.id==='sp-node-SP-R01-L01');
  assert.equal(await page.locator('#sp-node-SP-R01-L01 .station-platform').evaluate(el=>getComputedStyle(el).transform),'none');
  report.checks.push('Candado Enter/Escape; Space abre lección; Escape devuelve foco; movimiento reducido');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);
  report.status='passed_automated_visual_review_pending';await context.close();
}catch(error){report.status=browser?'failed':'blocked_browser_launch';report.failure=error.stack;process.exitCode=1;}
finally{
  await browser?.close();report.finishedAt=new Date().toISOString();await writeFile(path.join(out,'resultados.json'),JSON.stringify(report,null,2)+'\n');
  const rows=report.comparisons.map(r=>`| ${r.width} | ${r.sc200Width} | ${r.splunkWidth} | ${r.sc200Height} / ${r.splunkHeight} | ${r.sc200VisibleHeight} / ${r.splunkVisibleHeight} | ${r.nodeDelta} | ${r.heroWidthDelta} |`).join('\n');
  await writeFile(path.join(out,'matriz.md'),`# Mediciones DOM\n\nEstado: ${report.status}. Revisión visual humana pendiente.\n\n| Pantalla | Ancho SC-200 | Ancho Splunk | Alto SC / SP | Alto visible SC / SP | Δ nodo | Δ hero |\n| --- | --- | --- | --- | --- | --- | --- |\n${rows}\n\n${report.failure||''}\n`);
  const names=report.measurements.map(m=>`${m.name}-${m.width}`);
  await writeFile(path.join(out,'index.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><title>Comparación SC-200 / Splunk</title><style>body{font:16px sans-serif;margin:24px;background:#edf3fc}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}img{width:100%}figure{margin:0}a{display:block;padding:12px}</style><h1>Comparación con SC-200</h1><p>Estado: ${report.status}. Comparar cada par a igual ancho. Revisión humana pendiente.</p><main>${names.map(n=>`<figure><a href="${n}.png">${n} · captura completa<img src="${n}-viewport.png" alt="${n}"></a></figure>`).join('')}</main></html>`);
  console.log(path.join(out,'resultados.json'));
}
