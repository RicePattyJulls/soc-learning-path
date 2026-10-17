import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url)), out = path.join(root, process.env.BROWSER_OUTPUT || 'output/playwright/v24-premium-world/full-width');
await mkdir(out, { recursive: true });
const before = process.argv.includes('--before'), installed = process.argv.includes('--installed'), phase = before ? 'antes' : installed ? 'instalado' : 'despues';
const catalog = JSON.parse(await readFile(path.join(root, 'src/generated/catalog.json'), 'utf8'));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const target = path.resolve(root, 'dist', '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname).replace(/\/$/, '/index.html'));
  if (!target.startsWith(path.join(root, 'dist') + path.sep)) { res.writeHead(403).end(); return; }
  try { res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' }).end(await readFile(target)); }
  catch { res.writeHead(404).end(); }
});
if (!process.env.BROWSER_BASE_URL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = process.env.BROWSER_BASE_URL || `http://127.0.0.1:${server.address().port}/`;
const report = { date: new Date().toISOString(), phase, base, geometry: [], navigation: [], scenery: [], motion: [], errors: [], external: [] };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const region = c => '#/capitulo/' + encodeURIComponent(c.id);
async function open(page, hash, selector = '.adventure-map') {
  await page.goto(base + hash); await page.locator(selector).first().waitFor(); await page.waitForTimeout(260);
}
async function geometry(page, label) {
  const data = await page.evaluate(() => {
    const rect = n => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; };
    const bounds = rect(document.querySelector('.adventure-scene')), overlay = rect(document.querySelector('.map-overlay'));
    const nodes = [...document.querySelectorAll('.station-action')].map(rect), chest = rect(document.querySelector('.map-treasure')), overlaps = [];
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]; if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) overlaps.push([i, j]);
    }
    const escaped = [...document.querySelectorAll('.station-plaque')].flatMap(n => {
      const a = rect(n); return [...n.querySelectorAll('strong,.station-detail,.station-state,.station-xp')].filter(e => {
        const r = rect(e); return r.x < a.x - 1 || r.x + r.w > a.x + a.w + 1 || r.y + r.h > a.y + a.h + 1;
      }).map(e => e.textContent);
    });
    const svg = document.querySelector('.adventure-road'), matrix = svg.getScreenCTM();
    const aligned = [...document.querySelectorAll('.map-station')].every((node, i) => {
      const point = svg.createSVGPoint(), at = svg.querySelectorAll('.map-path')[i].getPointAtLength(0);
      point.x = at.x; point.y = at.y;
      const actual = point.matrixTransform(matrix), r = node.getBoundingClientRect();
      return Math.abs(actual.x - r.x - r.width / 2) < 1 && Math.abs(actual.y - r.y - (innerWidth <= 680 ? 40 : 47)) < 1;
    });
    const landscape=document.querySelector('.landscape-art'),water=landscape.querySelector('[data-river],path[stroke-width="68"],path[stroke-width="34"]');
    const crossingPoint=(x,y)=>{const p=landscape.createSVGPoint();p.x=x;p.y=y;return p;};
    const misplacedBridges=[...document.querySelectorAll('.map-bridge[data-crossing-x]')].filter(n=>{
      const point=crossingPoint(Number(n.dataset.crossingX),Number(n.dataset.crossingY));
      return !water.isPointInStroke(point)||![...svg.querySelectorAll('.map-path')].some(r=>r.isPointInStroke(point));
    }).length;
    const header = ['.brand','.primary-nav','.profile'].map(selector => rect(document.querySelector(selector)));
    const headerOverlaps = header.some((a,i) => header.slice(i+1).some(b => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y));
    return { width: innerWidth, viewport: document.documentElement.clientWidth, scene: bounds, usedPercent: bounds.w / document.documentElement.clientWidth * 100,
      viewBox: svg.getAttribute('viewBox'), scaleX: matrix.a, scaleY: matrix.d, aligned, misplacedBridges,
      overflow: document.documentElement.scrollWidth > innerWidth + 1, overlaps, escaped,
      overlayCollisions: nodes.filter(n => n.y < overlay.y + overlay.h + 4).length,
      nodesOutside: nodes.filter(n => n.x < bounds.x || n.x + n.w > bounds.x + bounds.w + 1 || n.y + n.h > bounds.y + bounds.h).length,
      chestClipped: chest.x < bounds.x || chest.x + chest.w > bounds.x + bounds.w + 1 || chest.y + chest.h > bounds.y + bounds.h + 1,
      maxNodeWidth: Math.max(...nodes.map(n => n.w)), illustration: document.querySelector('.adventure-map').dataset.illustration,visual:document.querySelector('.adventure-map').dataset.regionVisual,
      selectorTop: document.querySelector('.atlas-tools select') ? rect(document.querySelector('.atlas-tools select')).y : null,
      headerOverlaps, dom: document.querySelectorAll('*').length, svgUses: document.querySelectorAll('.landscape-art use').length,
      runningAnimations: document.getAnimations().filter(a => a.playState === 'running').length };
  });
  report.geometry.push({ label, ...data });
  assert.equal(data.overflow, false, label + ' horizontal overflow'); assert.deepEqual(data.overlaps, [], label + ' overlapping nodes');
  assert.deepEqual(data.escaped, [], label + ' escaped text'); assert.equal(data.nodesOutside, 0, label + ' nodes outside');
  assert.equal(data.overlayCollisions, 0, label + ' overlay collision'); assert.equal(data.chestClipped, false, label + ' chest clipped');
  assert.equal(data.aligned, true, label + ' roads meet nodes'); assert.ok(Math.abs(data.scaleX - data.scaleY) < .001, label + ' isotropic SVG');
  assert.equal(data.headerOverlaps, false, label + ' header overlap');
  assert.equal(data.misplacedBridges, 0, label + ' bridges meet water and road');
  if (!before) {
    assert.ok(data.usedPercent >= (data.width === 320 ? 91 : 93), label + ' near full-width viewport'); assert.ok(data.maxNodeWidth <= 240);
    if (data.width > 680) assert.ok(Math.abs(data.scaleX - 1) < .01, label + ' native viewport geometry');
  }
  return data;
}
async function shot(page, name) {
  if(installed)return;
  await page.screenshot({ path: path.join(out, `${phase}-${name}.png`), fullPage: true });
  await page.screenshot({ path: path.join(out, `${phase}-${name}-inicio.png`) });
}
try {
  for (const width of installed ? [390, 1440, 2560] : [390, 768, 1024, 1440, 1920, 2560]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1080 }, deviceScaleFactor: 1, isMobile: width === 390, hasTouch: width <= 1024 });
    context.on('page', p => { p.on('pageerror', e => report.errors.push(e.message)); p.on('console', e => { if (e.type() === 'error') report.errors.push(e.text()); }); });
    await context.route('**/*', route => { if (route.request().url().startsWith(base) || /^(data|blob):/.test(route.request().url())) return route.continue(); report.external.push(route.request().url()); return route.abort(); });
    const page = await context.newPage();
    await open(page, '#/ruta'); const atlas = await geometry(page, 'atlas-' + width);
    assert.equal(atlas.illustration, 'original'); assert.ok(atlas.selectorTop < 500); await shot(page, 'atlas-' + width);
    if (!before) {
      const crossings=await page.evaluate(()=>{
        const svg=document.querySelector('.landscape-art'),water=svg.querySelector('path[stroke-width="68"],path[stroke-width="34"]');
        const point=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p;};
        const roads=[...document.querySelectorAll('.map-path')];
        const bridges=[...document.querySelectorAll('.map-bridge')].map(n=>({x:Number(n.dataset.crossingX),y:Number(n.dataset.crossingY)}));
        return {bridges:bridges.length,water:bridges.every(b=>water.isPointInStroke(point(b.x,b.y))),road:bridges.every(b=>roads.some(r=>r.isPointInStroke(point(b.x,b.y))))};
      });
      assert.ok(crossings.bridges>0);assert.equal(crossings.water,true);assert.equal(crossings.road,true);
      report.scenery.push({label:'atlas-crossings',width,...crossings});
    }
    for (const [i, chapter] of catalog.modules.entries()) {
      if(installed&&![0,2,6,12].includes(i))continue;
      if (before && i !== 0 && i !== 9) continue;
      await open(page, region(chapter)); const info = await geometry(page, `region-${i + 1}-${width}`);
      assert.equal(info.illustration, i === 0 ? 'premium-pilot' : 'premium-world');
      if(installed){assert.equal(info.visual,chapter.id);assert.equal(await page.locator('.map-legend').count(),1);}
      if (i === 0) {
        await shot(page, 'piloto-' + width);
        const scenery = await page.evaluate(() => {
          const svg=document.querySelector('.pilot-landscape-art'),water=svg.querySelector('[data-river]');
          const point=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p;};
          const bridges=[...document.querySelectorAll('.pilot-bridge')].map(n=>({x:Number(n.dataset.crossingX),y:Number(n.dataset.crossingY)}));
          const roads=[...document.querySelectorAll('.map-path')];
          return {bridges:bridges.length,allCrossWater:bridges.every(b=>water.isPointInStroke(point(b.x,b.y))),allOnRoad:bridges.every(b=>roads.some(r=>r.isPointInStroke(point(b.x,b.y)))),treesInWater:[...svg.querySelectorAll('[data-scenery="trees"] use')].filter(n=>{const m=n.transform.baseVal.consolidate().matrix;return water.isPointInStroke(point(m.e,m.f));}).length};
        });
        assert.ok(scenery.bridges>0);assert.equal(scenery.allCrossWater,true);assert.equal(scenery.allOnRoad,true);assert.equal(scenery.treesInWater,0);
        report.scenery.push({width,...scenery});
      }
    }
    if (!before) {
      await open(page, '#/ruta'); await page.getByRole('combobox').selectOption(catalog.modules[0].id); await page.locator('.pilot-region').waitFor();
      for (const id of catalog.modules[0].lessonIds) {
        await page.locator(`[data-station="${id}"] a`).click(); await page.locator('.activity-surface').waitFor();
        assert.equal(await page.locator('h1').innerText(), catalog.lessons.find(l => l.id === id).title);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        // V2.1 already bounds this reading surface (1440px shell, two sidebars).
        assert.ok(await page.locator('.activity-surface').evaluate(n => n.getBoundingClientRect().width <= 950));
        await page.locator('.academy-lesson>.back-link').click();
        await page.waitForFunction(id => document.activeElement?.closest('[data-station]')?.dataset.station === id, id);
        assert.ok(await page.locator(`[data-station="${id}"]`).evaluate(n => { const r = n.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }));
      }
      await page.locator('.map-station a').first().click(); await page.locator('.activity-surface').waitFor(); await shot(page, 'leccion-' + width);
      for (const [hash, selector] of [['biblioteca', '.library-page'], ['progreso', '.statistics-page'], ['repaso', '.review-page']]) {
        await open(page, '#/' + hash, selector); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      }
      report.navigation.push({ width, openedAndReturned: catalog.modules[0].lessonIds.length, directSelector: true, ancillaryViews: true });
    }
    await context.close(); console.log('PASS', phase, width);
  }
  if (!before&&!installed) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } }), page = await context.newPage();
    await open(page, region(catalog.modules[9]));
    for (const width of [2560, 1920, 1440, 1101, 1100, 1024, 900, 768, 681, 680, 390, 320, 1440, 2560]) {
      await page.setViewportSize({ width, height: 1080 }); await page.waitForTimeout(250); await geometry(page, 'resize-' + width);
    }
    for (const reducedMotion of ['no-preference', 'reduce']) {
      await page.emulateMedia({ reducedMotion }); await open(page, region(catalog.modules[0]));
      const node = page.locator('.station-action').first(); await node.focus(); assert.equal(await node.evaluate(n => getComputedStyle(n).outlineStyle), 'solid');
      const beforeHover = await node.locator('.station-platform').evaluate(n => getComputedStyle(n).transform);
      await node.hover(); await page.waitForTimeout(200); const afterHover = await node.locator('.station-platform').evaluate(n => getComputedStyle(n).transform);
      if (reducedMotion === 'reduce') assert.equal(afterHover, beforeHover); else assert.notEqual(afterHover, beforeHover);
      await page.keyboard.press('Enter'); await page.locator('.activity-surface').waitFor();
      report.motion.push({ reducedMotion, beforeHover, afterHover, keyboardOpen: true });
    }
    await context.close();
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.external, []);
} catch (error) { report.failure = error.stack; console.error(error); process.exitCode = 1; }
finally {
  await writeFile(path.join(out, `${phase}-results.json`), JSON.stringify(report, null, 2)); await browser.close();
  if (server.listening) await new Promise(resolve => server.close(resolve));
}
