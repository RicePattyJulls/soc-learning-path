import assert from 'node:assert/strict';
import path from 'node:path';

export async function runPremiumChecks({browser,base,catalog,lessons,report,out,axePath}) {
  const key='soc-learning-path:splunk:learning:v1';
  const full={schemaVersion:1,courseId:'splunk',rewardMode:'provisional_only',records:{},provisionalAwards:{},regionAwards:catalog.regions.map(r=>r.id),lastLesson:null};
  for(const l of catalog.lessons) {
    const payload=lessons.find(p=>p.id===l.id),attempt={id:'premium-synthetic',startedAt:1,questionIds:l.questionIds,answers:Object.fromEntries(payload.questions.map(q=>[q.id,{optionId:q.solution,correct:true,answeredAt:2}])),finishedAt:3};
    full.records[l.id]={[l.revision]:{seen:l.stepIds,studyCompleted:true,summary:true,theoryPassed:true,formativeSeen:true,reviewed:true,practicalStatus:'not_assessed',updated:4,attempts:{[attempt.id]:attempt},activeAttempt:null}};
    full.provisionalAwards[l.id]=['review','study','summary','theory'];
  }
  const make=async(reducedMotion='reduce',seed=full)=>{
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion});
    context.on('page',p=>p.on('pageerror',e=>report.errors.push(e.message)));
    await context.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();report.external.push(r.request().url());return r.abort();});
    await context.addInitScript(({key,seed})=>{if(location.protocol==='http:'&&!localStorage.getItem('premium-test:seeded')){if(seed)localStorage.setItem(key,JSON.stringify(seed));localStorage.setItem('premium-test:seeded','1');}},{key,seed});
    return context;
  };
  const context=await make();
  try {
    const page=await context.newPage();
    for(const width of [320,390,768,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      for(const region of [null,...catalog.regions]) {
        const name=region?.id||'atlas',hash=region?'#/splunk/region/'+region.id:'#/splunk/ruta';
        await page.goto(base+hash);await page.locator('.sp-world-control').first().waitFor();
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const controls=page.locator('.sp-world-control');assert.equal(await controls.count(),region?region.lessonIds.length:catalog.regions.length);
        const bounds=await page.locator('.sp-world-station-body').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};}));
        for(const r of bounds)assert.ok(r.left>=0&&r.right<=width+1,`${name}/${width}: placa dentro de pantalla`);
        for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++) {
          const a=bounds[i],b=bounds[j];assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,`${name}/${width}: nodos sin solapamiento ${i}/${j}`);
        }
        for(const control of await controls.all()) {
          await control.scrollIntoViewIfNeeded();
          assert.ok(await control.evaluate(el=>{const r=el.getBoundingClientRect(),top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !!top&&el.contains(top);}),`${name}: río/puente no cubre el botón`);
        }
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
        await page.addScriptTag({path:axePath});
        const axe=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,failureSummary:n.failureSummary}))}))};});
        report.accessibility.push({name:'premium-'+name,width,...axe});assert.deepEqual(axe.violations,[]);
        report.responsive.push({name:'premium-'+name,width,overlap:false,overflow:false,hitTargets:true,reducedMotion:true});
        await page.screenshot({path:path.join(out,`premium-${name}-${width}.png`),fullPage:true});
      }
    }
    // The demonstrated failure is checked with computed colors AND keyboard focus.
    await page.setViewportSize({width:320,height:1000});await page.goto(base+'#/splunk/recursos/SP-R03');
    const pre=page.locator('.splunk-markdown pre').first();await pre.waitFor();await pre.focus();
    assert.equal(await pre.evaluate(el=>document.activeElement===el),true);
    const colors=await pre.evaluate(el=>({foreground:getComputedStyle(el.querySelector('code')).color,background:getComputedStyle(el).backgroundColor,tabIndex:el.tabIndex}));
    assert.equal(colors.foreground,'rgb(224, 233, 247)');assert.equal(colors.background,'rgb(23, 45, 78)');
    report.premium={...(report.premium||{}),resourceCode:colors};
    report.checks.push('Premium: 16 mapas/atlas a 320/390/768/1440, hit targets, placas sin solapamiento, axe con incomplete y movimiento reducido');
  } finally {await context.close();}
  const motion=await make('no-preference',null);
  try {
    const p=await motion.newPage();await p.goto(base+'#/splunk/region/SP-R01');await p.locator('#sp-node-SP-R01-L02').waitFor();
    const locked=p.locator('#sp-node-SP-R01-L02');await locked.focus();await p.keyboard.press('Enter');
    assert.equal(await locked.getAttribute('aria-expanded'),'true');assert.equal(await locked.evaluate(el=>document.activeElement===el),true);
    await p.keyboard.press('Escape');assert.equal(await locked.getAttribute('aria-expanded'),'false');
    const point=await locked.boundingBox();await p.mouse.move(point.x+point.width/2,point.y+point.height/2);await p.mouse.down();
    await p.waitForFunction(()=>getComputedStyle(document.querySelector('#sp-node-SP-R01-L02 .sp-world-platform')).transform!=='none');await p.mouse.up();
    const profile=await p.locator('.sp-profile').getAttribute('aria-label');assert.ok(profile.includes('0 XP provisionales'));
    // Synthetic second tab changes only its isolated Splunk key: real storage event.
    const tab=await motion.newPage();await tab.goto(base+'#/splunk/ruta');await tab.locator('.sp-world-map').waitFor();
    await tab.evaluate(({key,full})=>localStorage.setItem(key,JSON.stringify(full)),{key,full});
    await p.waitForFunction(()=>document.querySelectorAll('.sp-node[data-state="passed"]').length===5);
    await p.screenshot({path:path.join(out,'premium-estados-completados-1440.png'),fullPage:true});
    const first=p.locator('#sp-node-SP-R01-L01');await first.focus();await p.keyboard.press('Space');await p.locator('[data-lesson="SP-R01-L01"]').waitFor();
    await p.keyboard.press('Escape');await p.waitForFunction(()=>document.activeElement?.id==='sp-node-SP-R01-L01');
    assert.equal(await p.locator('#sp-node-SP-R01-L01 .sp-world-platform').evaluate(el=>getComputedStyle(el).transform),'none');
    report.checks.push('Premium: Enter/Escape en candado, pulsación de puntero, actualización de estados entre pestañas, Space para abrir y Escape/foco al volver; 0 XP por pulsar');
  } finally {await motion.close();}
}
