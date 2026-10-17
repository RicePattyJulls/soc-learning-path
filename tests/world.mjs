import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,process.env.BROWSER_OUTPUT||'output/playwright/v24-premium-world/world');await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(path.join(root,'src/generated/catalog.json'),'utf8'));
const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/';
const before=process.argv.includes('--before');
const report={date:new Date().toISOString(),before,base,geometry:[],scenery:[],navigation:[],errors:[],consoleErrors:[],external:[]};
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
async function open(page,hash){await page.goto(base+hash);await page.locator('.adventure-map').waitFor();await page.waitForTimeout(240);}
async function geometry(page,label){
 const data=await page.evaluate(()=>{
  const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,w:r.width,h:r.height};};
  const scene=document.querySelector('.adventure-scene'),bounds=rect(scene),overlay=rect(document.querySelector('.map-overlay'));
  const nodes=[...document.querySelectorAll('.station-action')].map(rect),chest=rect(document.querySelector('.map-treasure')),overlaps=[];
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y)overlaps.push([i,j]);}
  const escaped=[...document.querySelectorAll('.station-plaque')].flatMap(n=>{const a=rect(n);return [...n.querySelectorAll('strong,.station-detail,.station-state,.station-xp')].filter(e=>{const r=rect(e);return r.x<a.x-1||r.x+r.w>a.x+a.w+1||r.y+r.h>a.y+a.h+1;}).map(e=>e.textContent);});
  const road=document.querySelector('.adventure-road'),matrix=road.getScreenCTM();
  const aligned=[...document.querySelectorAll('.map-station')].every((n,i)=>{const point=road.createSVGPoint(),at=road.querySelectorAll('.map-path')[i].getPointAtLength(0);point.x=at.x;point.y=at.y;const actual=point.matrixTransform(matrix),r=n.getBoundingClientRect();return Math.abs(actual.x-r.x-r.width/2)<1&&Math.abs(actual.y-r.y-(innerWidth<=680?40:47))<1;});
  return {width:innerWidth,scene:bounds,usedPercent:bounds.w/innerWidth*100,overflow:document.documentElement.scrollWidth>innerWidth+1,overlaps,escaped,aligned,
   overlayCollisions:nodes.filter(n=>n.y<overlay.y+overlay.h+4).length,nodesOutside:nodes.filter(n=>n.x<bounds.x||n.x+n.w>bounds.x+bounds.w+1||n.y+n.h>bounds.y+bounds.h).length,
   chestClipped:chest.x<bounds.x||chest.x+chest.w>bounds.x+bounds.w+1||chest.y+chest.h>bounds.y+bounds.h+1,
   scaleX:matrix.a,scaleY:matrix.d,illustration:document.querySelector('.adventure-map').dataset.illustration,visual:document.querySelector('.adventure-map').dataset.regionVisual,
   dom:document.querySelectorAll('*').length,svg:document.querySelectorAll('.landscape-art *').length,uses:document.querySelectorAll('.landscape-art use').length,filters:document.querySelectorAll('.landscape-art filter').length,
   intercepted:[...document.querySelectorAll('.landscape-art,.adventure-road')].some(n=>getComputedStyle(n).pointerEvents!=='none'),activeAnimations:document.getAnimations().filter(a=>a.playState==='running').length};
 });
 report.geometry.push({label,...data});
 assert.equal(data.overflow,false,label+' overflow');assert.deepEqual(data.overlaps,[],label+' overlap');assert.deepEqual(data.escaped,[],label+' escaped labels');
 assert.equal(data.overlayCollisions,0,label+' welcome collision');assert.equal(data.nodesOutside,0,label+' nodes outside');assert.equal(data.chestClipped,false,label+' chest clipped');assert.equal(data.aligned,true,label+' road endpoints');
 assert.ok(Math.abs(data.scaleX-data.scaleY)<.001,label+' SVG axis distortion');assert.equal(data.intercepted,false,label+' scenery intercepts pointer');assert.equal(data.filters,0);assert.equal(data.activeAnimations,0,label+' ambient loop');
 assert.ok(data.usedPercent>93,label+' panoramic width');
 if(data.width>680)assert.ok(Math.abs(data.scaleX-1)<.01);
 return data;
}
async function scenery(page,label){
 const result=await page.evaluate(()=>{
  const svg=document.querySelector('.landscape-art'),water=svg.querySelector('[data-river]');
  if(!water)return {premium:false};
  const point=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p;};
  const roads=[...document.querySelectorAll('.map-path')],bridges=[...document.querySelectorAll('.map-bridge')].map(n=>({x:Number(n.dataset.crossingX),y:Number(n.dataset.crossingY)}));
  const glyphs=[...svg.querySelectorAll('[data-scenery="trees"] use')];
  return {premium:true,bridges:bridges.length,waterCrossings:bridges.every(b=>water.isPointInStroke(point(b.x,b.y))),roadCrossings:bridges.every(b=>roads.some(r=>r.isPointInStroke(point(b.x,b.y)))),treesInWater:glyphs.filter(n=>{const m=n.transform.baseVal.consolidate().matrix;return water.isPointInStroke(point(m.e,m.f));}).length,
   horizon:svg.querySelector('[data-horizon]')?.getAttribute('data-horizon'),terrain:svg.querySelector('[data-terrain]')?.getAttribute('data-terrain'),landmark:svg.querySelector('[data-landmark]')?.getAttribute('data-landmark'),firstHorizon:svg.querySelector('[data-horizon] polygon')?.getAttribute('points')};
 });
 report.scenery.push({label,...result});
 if(result.premium){assert.equal(result.waterCrossings,true,label+' bridge misses water');assert.equal(result.roadCrossings,true,label+' bridge misses road');assert.equal(result.treesInWater,0,label+' vegetation in water');}
 return result;
}
try{
 for(const width of [390,768,1024,1440,1920,2560]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1080},isMobile:width===390,hasTouch:width<=1024,deviceScaleFactor:1});
  context.on('page',p=>{p.on('pageerror',e=>report.errors.push(e.message));p.on('console',e=>{if(e.type()==='error')report.consoleErrors.push(e.text());});});
  await context.route('**/*',r=>{if(r.request().url().startsWith(base)||/^(data|blob):/.test(r.request().url()))return r.continue();report.external.push(r.request().url());return r.abort();});
  const page=await context.newPage();await open(page,'#/ruta');await geometry(page,'atlas-'+width);assert.equal(await page.locator('.map-station').count(),13);
  if([390,1440,2560].includes(width))await page.screenshot({path:path.join(out,`atlas-${width}.png`),fullPage:true});
  for(const [i,chapter] of catalog.modules.entries()){
   await open(page,'#/capitulo/'+encodeURIComponent(chapter.id));const info=await geometry(page,`region-${i+1}-${width}`);const art=await scenery(page,`region-${i+1}-${width}`);
   assert.equal(await page.locator('h1').innerText(),chapter.title);assert.equal(await page.locator('.map-station').count(),chapter.lessonIds.length);
   if(!before){assert.equal(info.visual,chapter.id);assert.equal(info.illustration,i===0?'premium-pilot':'premium-world');assert.equal(art.premium,true);assert.ok(info.dom<1800,'Budget DOM per region');if(i>0)assert.ok(art.horizon&&art.terrain&&art.landmark);}
   if([390,1440].includes(width)){
    await page.screenshot({path:path.join(out,`region-${i+1}-${width}.png`),fullPage:true});
    const style=await page.addStyleTag({content:'.region-navigation,.atlas-tools{visibility:hidden!important}'});
    await page.locator('.adventure-map').screenshot({path:path.join(out,`scene-${i+1}-${width}.png`)});await style.evaluate(n=>n.remove());
   }
   if(i>0){await page.locator('.map-station button').first().click();await page.locator('.map-lock-notice').waitFor();await page.getByRole('button',{name:'Entendido',exact:true}).click();}
  }
  await context.close();console.log('PASS WORLD',before?'baseline':'premium',width);
 }
 if(!before){
  const c=await browser.newContext({viewport:{width:1440,height:1080}});
  await c.addInitScript(lessons=>{if(location.protocol==='http:'&&!localStorage.getItem('world-seeded')){localStorage.setItem('soc-learning-path:progress:v1',JSON.stringify({schemaVersion:1,completed:Object.fromEntries(lessons.map(l=>[l.id,l.version])),lastLesson:null}));localStorage.setItem('world-seeded','1');}},catalog.lessons);
  const p=await c.newPage();for(const chapter of catalog.modules){await open(p,'#/capitulo/'+encodeURIComponent(chapter.id));await p.locator('.map-station a').first().click();await p.locator('.activity-surface').waitFor();assert.equal(await p.locator('h1').innerText(),catalog.lessons.find(l=>l.id===chapter.lessonIds[0]).title);await p.locator('.academy-lesson>.back-link').click();await p.waitForFunction(id=>document.activeElement?.closest('[data-station]')?.dataset.station===id,chapter.lessonIds[0]);report.navigation.push({chapter:chapter.id,openedAndReturned:true});}
  await c.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.external,[]);
}catch(error){report.failure=error.stack;console.error(error);process.exitCode=1;}finally{await browser.close();await writeFile(path.join(out,'world-results.json'),JSON.stringify(report,null,2));}
