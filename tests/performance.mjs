import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,process.env.BROWSER_OUTPUT || 'output/playwright/v24-premium-world/performance-pilot');
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(path.join(root,'src/generated/catalog.json'),'utf8'));
const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/';
const beforeAt=process.argv.indexOf('--before-url'),before=beforeAt>=0?process.argv[beforeAt+1]:'http://127.0.0.1:5174/';
const report={date:new Date().toISOString(),before,after:base,conditions:'Same Chromium, separate empty contexts; three samples per build/width; CPU 4x at 390px, CPU 1x otherwise; localhost; no FPS claim.',samples:[],summary:[]};
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 for(const width of [390,768,1024,1440])for(let repeat=0;repeat<3;repeat++)for(const build of repeat%2?['after','before']:['before','after']){
  const c=await b.newContext({viewport:{width,height:1000},isMobile:width===390,hasTouch:width===390});
  await c.addInitScript(()=>{window.__measure={cls:0,longTasks:[],lcp:0};for(const type of ['layout-shift','longtask','largest-contentful-paint'])if(PerformanceObserver.supportedEntryTypes.includes(type))new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='layout-shift'&&!e.hadRecentInput)window.__measure.cls+=e.value;if(type==='longtask')window.__measure.longTasks.push(Math.round(e.duration));if(type==='largest-contentful-paint')window.__measure.lcp=Math.round(e.startTime);}}).observe({type,buffered:true});});
  const p=await c.newPage();if(width===390){const session=await c.newCDPSession(p);await session.send('Emulation.setCPUThrottlingRate',{rate:4});}
  await p.goto((build==='before'?before:base)+'#/capitulo/'+encodeURIComponent(catalog.modules[0].id));await p.locator('.region-landscape').waitFor();await p.waitForTimeout(650);
  report.samples.push({width,repeat,build,...await p.evaluate(()=>({...window.__measure,fcp:Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0),dom:document.querySelectorAll('*').length,svgUses:document.querySelectorAll('.landscape-art use').length,activeAnimations:document.getAnimations().filter(a=>a.playState==='running').length,resourceBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.decodedBodySize,0)}))});
  await c.close();console.log('PERF',width,repeat+1,build);
 }
 for(const width of [390,768,1024,1440])for(const build of ['before','after']){
  const samples=report.samples.filter(s=>s.width===width&&s.build===build),median=key=>samples.map(s=>s[key]).sort((a,b)=>a-b)[1];
  report.summary.push({width,build,fcpMedian:median('fcp'),lcpMedian:median('lcp'),clsMax:Math.max(...samples.map(s=>s.cls)),longTaskMax:Math.max(0,...samples.flatMap(s=>s.longTasks)),dom:median('dom'),svgUses:median('svgUses'),resourceBytes:median('resourceBytes')});
 }
}finally{await b.close();await writeFile(path.join(out,'performance.json'),JSON.stringify(report,null,2));}
