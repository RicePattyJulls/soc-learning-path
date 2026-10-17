import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,process.env.BROWSER_OUTPUT || 'output/playwright/v24-premium-world/premium');
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(path.join(root,'src/generated/catalog.json'),'utf8'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
const server=createServer(async(req,res)=>{const target=path.resolve(root,'dist','.'+decodeURIComponent(new URL(req.url,'http://local').pathname).replace(/\/$/,'/index.html'));if(!target.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403).end();return;}try{res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'}).end(await readFile(target));}catch{res.writeHead(404).end();}});
if(!process.env.BROWSER_BASE_URL)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=process.env.BROWSER_BASE_URL||`http://127.0.0.1:${server.address().port}/`;
const report={date:new Date().toISOString(),root,base,checks:[],metrics:[],motion:[],pageErrors:[],consoleErrors:[],external:[]};
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
async function context(width,reducedMotion='no-preference'){
 const c=await b.newContext({viewport:{width,height:width<681?844:1000},deviceScaleFactor:1,isMobile:width<681,hasTouch:width<681,reducedMotion});
 await c.addInitScript(()=>{window.__perf={cls:0,longTasks:[]};for(const type of ['layout-shift','longtask'])if(PerformanceObserver.supportedEntryTypes.includes(type))new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='layout-shift'&&!e.hadRecentInput)window.__perf.cls+=e.value;if(type==='longtask')window.__perf.longTasks.push(Math.round(e.duration));}}).observe({type,buffered:true});});
 c.on('page',p=>{p.on('pageerror',e=>report.pageErrors.push(e.message));p.on('console',e=>{if(e.type()==='error')report.consoleErrors.push(e.text());});});
 await c.route('**/*',r=>{if(r.request().url().startsWith(base)||/^(data|blob):/.test(r.request().url()))return r.continue();report.external.push(r.request().url());return r.abort();});return c;
}
async function open(p,hash,selector='.adventure-map'){await p.goto(base+hash);await p.locator(selector).first().waitFor();await p.waitForTimeout(250);}
async function shot(p,name){await p.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
async function geometry(p,label){
 const result=await p.evaluate(()=>{
  const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height};};
  const scene=document.querySelector('.adventure-scene'),overlay=rect(document.querySelector('.map-overlay')),bounds=rect(scene);
  const nodes=[...document.querySelectorAll('.station-action')].map(rect),overlaps=[];
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)overlaps.push([i,j]);}
  const escaped=[...document.querySelectorAll('.station-plaque')].flatMap(n=>{const a=rect(n);return [...n.querySelectorAll('strong,.station-detail,.station-state,.station-xp')].filter(e=>{const r=rect(e);return r.x<a.x-1||r.x+r.w>a.x+a.w+1||r.y+r.h>a.y+a.h+1;}).map(e=>e.textContent);});
  const chest=rect(document.querySelector('.map-treasure'));
  return {width:innerWidth,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,overlaps,escaped,overlayCollisions:nodes.filter(n=>n.y<overlay.y+overlay.h+4).length,chestClipped:chest.x<bounds.x||chest.x+chest.w>bounds.x+bounds.w+1||chest.y+chest.h>bounds.y+bounds.h+1,nodesOutside:nodes.filter(n=>n.x<0||n.x+n.w>innerWidth+1).length,selectorTop:document.querySelector('.atlas-tools select')?rect(document.querySelector('.atlas-tools select')).y:null,art:document.querySelector('.adventure-map').dataset.illustration};
 });report.checks.push({label,...result});
 assert.equal(result.overflow,false,label+' page overflow');assert.deepEqual(result.overlaps,[],label+' overlapping nodes');assert.deepEqual(result.escaped,[],label+' plaque content overflow');assert.equal(result.overlayCollisions,0,label+' welcome overlaps nodes');assert.equal(result.chestClipped,false,label+' chest clipped');assert.equal(result.nodesOutside,0,label+' node outside viewport');return result;
}
async function metrics(p,label){report.metrics.push({label,...await p.evaluate(()=>({width:innerWidth,...window.__perf,fcp:Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0),dom:document.querySelectorAll('*').length,svgUses:document.querySelectorAll('.landscape-art use').length,animations:document.getAnimations().filter(a=>a.playState==='running').length,resources:performance.getEntriesByType('resource').map(r=>({file:r.name.split('/').pop(),bytes:r.decodedBodySize}))}))});}
try{
 for(const width of [320,390,680,681,768,900,1024,1100,1101,1440]){
  const c=await context(width),p=await c.newPage();
  await open(p,'#/ruta');const atlas=await geometry(p,'atlas-'+width);assert.ok(atlas.selectorTop<500,'Region selector before map');assert.equal(atlas.art,'original');
  if([390,768,1024,1440].includes(width)){await shot(p,'atlas-'+width);await metrics(p,'atlas-'+width);}
  for(const index of [0,9]){await open(p,'#/capitulo/'+encodeURIComponent(catalog.modules[index].id));const info=await geometry(p,`region-${index+1}-${width}`);assert.equal(info.art,index===0?'premium-pilot':'premium-world');
   if(index===0&&[320,390,768,1024,1440].includes(width)){await shot(p,'piloto-'+width);await metrics(p,'piloto-'+width);await p.screenshot({path:path.join(out,'piloto-'+width+'-inicio.png'),fullPage:false});}
  }
  await c.close();console.log('PASS responsive',width);
 }
 for(const width of [390,1440]){
  const c=await context(width),p=await c.newPage();
  for(const [index,chapter] of catalog.modules.entries()){await open(p,'#/capitulo/'+encodeURIComponent(chapter.id));const info=await geometry(p,'all-regions-'+width+'-'+(index+1));assert.equal(info.art,index===0?'premium-pilot':'premium-world');}
  await open(p,'#/capitulo/'+encodeURIComponent(catalog.modules[0].id));
  await p.getByRole('combobox').selectOption(catalog.modules[1].id);await p.locator('.notice').waitFor();assert.equal(await p.locator('.map-station a').count(),0);
  await p.getByRole('link',{name:'Región anterior: '+catalog.modules[0].title,exact:true}).click();await p.locator('.pilot-region').waitFor();
  for(const id of catalog.modules[0].lessonIds){await p.locator(`[data-station="${id}"] a`).click();await p.locator('.activity-surface').waitFor();assert.equal(await p.locator('h1').innerText(),catalog.lessons.find(l=>l.id===id).title);await p.locator('.academy-lesson>.back-link').click();await p.locator('.pilot-region').waitFor();await p.waitForFunction(id=>document.activeElement?.closest('[data-station]')?.dataset.station===id,id);}
  await p.locator('.map-station a').first().click();await p.locator('.activity-surface').waitFor();await shot(p,'leccion-'+width);await p.getByRole('button',{name:'Empezar a aprender',exact:true}).click();await shot(p,'tarjeta-'+width);
  for(const [hash,selector,name] of [['biblioteca','.library-page','biblioteca'],['progreso','.statistics-page','progreso'],['repaso','.review-page','repaso']]){await open(p,'#/'+hash,selector);await shot(p,name+'-'+width);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  assert.ok((await p.locator('.profile').getAttribute('aria-label')).includes('0 XP'));
  await c.close();console.log('PASS all regions and navigation',width);
 }
 for(const reduced of ['no-preference','reduce']){
  const c=await context(1440,reduced),p=await c.newPage();await open(p,'#/capitulo/'+encodeURIComponent(catalog.modules[0].id));
  const first=p.locator('.station-action').first();await first.focus();assert.equal(await first.evaluate(n=>getComputedStyle(n).outlineStyle),'solid');const before=await first.locator('.station-platform').evaluate(n=>getComputedStyle(n).transform);await first.hover();await p.waitForTimeout(180);const after=await first.locator('.station-platform').evaluate(n=>getComputedStyle(n).transform);if(reduced==='reduce')assert.equal(before,after);
  const riverResult=await p.evaluate(()=>{
   const svg=document.querySelector('.pilot-landscape-art'),water=svg.querySelector('[data-river]');if(!water)return {missing:true};
   const point=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p;};
   const bridges=[...document.querySelectorAll('.pilot-bridge')].map(n=>({x:Number(n.dataset.crossingX),y:Number(n.dataset.crossingY)}));
   const roads=[...document.querySelectorAll('.map-path')];
   return {missing:false,bridges:bridges.length,allCrossWater:bridges.every(b=>water.isPointInStroke(point(b.x,b.y))),allOnRoad:bridges.every(b=>roads.some(r=>r.isPointInStroke(point(b.x,b.y)))),treesInWater:[...svg.querySelectorAll('[data-scenery="trees"] use')].filter(n=>{const m=n.transform.baseVal.consolidate().matrix;return water.isPointInStroke(point(m.e,m.f));}).length};
  });assert.equal(riverResult.missing,false);assert.ok(riverResult.bridges>0);assert.equal(riverResult.allCrossWater,true);assert.equal(riverResult.allOnRoad,true);assert.equal(riverResult.treesInWater,0);report.checks.push({label:'coherent-scenery-'+reduced,...riverResult});
  report.motion.push({reduced,before,after,active:await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)});await shot(p,'foco-'+reduced);
  const session=await c.newCDPSession(p);const tree=await session.send('Accessibility.getFullAXTree');assert.ok(tree.nodes.some(n=>n.role?.value==='navigation'));assert.ok(tree.nodes.some(n=>n.role?.value==='main'));await c.close();
 }
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.external,[]);
 console.log('PASS',report.checks.length,'premium checks');
}catch(error){report.failure=error.stack;console.error(error);process.exitCode=1;}finally{await writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2));await b.close();if(server.listening)await new Promise(resolve=>server.close(resolve));}
