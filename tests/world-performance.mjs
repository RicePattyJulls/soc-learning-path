import { chromium } from 'playwright-core';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,process.env.BROWSER_OUTPUT||'output/playwright/v24-premium-world/performance');await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(path.join(root,'src/generated/catalog.json'),'utf8'));
const at=process.argv.indexOf('--before-url'),before=at>=0?process.argv[at+1]:'http://127.0.0.1:5182/',after=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/';
const report={date:new Date().toISOString(),before,after,conditions:'Three alternating samples; isolated Chromium contexts; localhost; CPU 4x at 390px, 1x otherwise; no concurrent browser suites; OS caches uncontrolled; no physical device or FPS measurement.',samples:[],summary:[]};
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 for(const width of [390,1440,2560])for(const region of [-1,2,5,12])for(let repeat=0;repeat<3;repeat++)for(const build of repeat%2?['after','before']:['before','after']){
  const c=await browser.newContext({viewport:{width,height:1080},isMobile:width===390,hasTouch:width===390});
  await c.addInitScript(()=>{window.__performance={cls:0,lcp:0,longTasks:[]};for(const type of ['layout-shift','largest-contentful-paint','longtask'])if(PerformanceObserver.supportedEntryTypes.includes(type))new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='layout-shift'&&!e.hadRecentInput)window.__performance.cls+=e.value;if(type==='largest-contentful-paint')window.__performance.lcp=e.startTime;if(type==='longtask')window.__performance.longTasks.push(e.duration);}}).observe({type,buffered:true});});
  const p=await c.newPage();if(width===390)await(await c.newCDPSession(p)).send('Emulation.setCPUThrottlingRate',{rate:4});
  const hash=region<0?'#/ruta':'#/capitulo/'+encodeURIComponent(catalog.modules[region].id);
  await p.goto((build==='before'?before:after)+hash);await p.locator('.adventure-map').waitFor();await p.waitForTimeout(550);
  report.samples.push({width,region:region+1,repeat,build,...await p.evaluate(()=>({...window.__performance,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0,dom:document.querySelectorAll('*').length,svg:document.querySelectorAll('.landscape-art *').length,uses:document.querySelectorAll('.landscape-art use').length,activeAnimations:document.getAnimations().filter(a=>a.playState==='running').length,resourceBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.decodedBodySize,0)}))});await c.close();
 }
 for(const width of [390,1440,2560])for(const region of [0,3,6,13])for(const build of ['before','after']){
  const samples=report.samples.filter(s=>s.width===width&&s.region===region&&s.build===build),median=key=>Math.round(samples.map(s=>s[key]).sort((a,b)=>a-b)[1]);
  report.summary.push({width,region,build,fcpMedian:median('fcp'),lcpMedian:median('lcp'),clsMax:Math.max(...samples.map(s=>s.cls)),longTaskMax:Math.round(Math.max(0,...samples.flatMap(s=>s.longTasks))),dom:median('dom'),svg:median('svg'),uses:median('uses'),resourceBytes:median('resourceBytes')});
 }
 console.log('PERFORMANCE',report.samples.length,'samples;',report.summary.length,'summaries');
}finally{await browser.close();await writeFile(path.join(out,'performance.json'),JSON.stringify(report,null,2));}
