import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

// Run from a terminal with the local Vite server already running. The browser
// uses an isolated profile; it never reads or modifies the owner's progress.
const base = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:5173/';
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(base)) throw new Error('Indica un origen HTTP local terminado en /');
const output = 'output/playwright/redes-local';
await mkdir(output, { recursive: true });
const catalog = JSON.parse(await readFile('src/redes/generated/catalog.json', 'utf8'));
const first = catalog.lessons[0];
const solutions = JSON.parse(await readFile('public/' + first.answersFile, 'utf8'));
const report = { base, executed: false, checks: [], screenshots: [], errors: [] };
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  const check = async (name, action) => { await action(); report.checks.push(name); };
  const settle = () => page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
  const go = async route => { await page.goto(base + route); await page.locator('.redes-academy').waitFor(); await settle(); };
  await check('Atlas: ocho etapas y acceso desde el selector', async () => {
    await go('#/redes/ruta'); assert.equal(await page.locator('.rd-station').count(), 8);
    await page.locator('.academy-selector a[href="#/redes/ruta"][aria-current]').waitFor();
    await page.screenshot({ path: output + '/atlas-desktop.png' }); report.screenshots.push('atlas-desktop.png');
  });
  await check('Etapas: 24 y 32 nodos; requisitos y foco al cerrar', async () => {
    await go('#/redes/etapa/RED-E01'); assert.equal(await page.locator('.rd-station').count(), 24);
    await page.locator('#red-node-RED-M01-L02').click(); await page.locator('dialog[open]').waitFor();
    await page.getByRole('button', { name: 'Cerrar requisitos' }).click();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'red-node-RED-M01-L02');
    await go('#/redes/etapa/RED-E03'); assert.equal(await page.locator('.rd-station').count(), 32);
  });
  await check('Diseño a 320, 768 y 1440 px sin desbordamiento o tarjetas superpuestas', async () => {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 }); await go('#/redes/etapa/RED-E03'); await settle();
      const geometry = await page.evaluate(() => {
        const boxes = [...document.querySelectorAll('.rd-station .station-action')].map(node => { const r = node.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; });
        const overlaps = boxes.flatMap((a, i) => boxes.slice(i + 1).filter(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1));
        return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, overlaps: overlaps.length };
      });
      assert.ok(geometry.scrollWidth <= geometry.viewport + 1, JSON.stringify(geometry)); assert.equal(geometry.overlaps, 0);
      await page.screenshot({ path: `${output}/etapa-32-${width}.png` }); report.screenshots.push(`etapa-32-${width}.png`);
    }
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await check('Estudio y práctica guardados; soluciones después de responder', async () => {
    await go('#/redes/leccion/RED-M01-L01'); await page.locator('.rd-reader').waitFor();
    await page.getByRole('button', { name: 'Empezar a aprender' }).click();
    for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Entendido, continuar' }).click();
    await page.getByRole('button', { name: 'Completar estudio' }).click();
    await page.getByLabel('Tu respuesta razonada').fill('La aplicación responde: comprobaría autorización y registros de la operación, sin atribuir toda causa a conectividad.');
    await page.getByRole('button', { name: 'Guardar mi respuesta' }).click();
    await page.reload(); await page.getByRole('button', { name: 'Respuesta guardada' }).waitFor();
    assert.equal(await page.locator('.rd-feedback').count(), 0);
    await page.getByRole('button', { name: 'Contrastar con la solución' }).click(); await page.getByRole('heading', { name: 'Compara tu razonamiento' }).waitFor();
    await page.screenshot({ path: output + '/practica.png' }); report.screenshots.push('practica.png');
  });
  await check('Evaluación recuperable: 1/2 falla, 2/2 desbloquea y no repite XP', async () => {
    await page.getByRole('button', { name: 'Conectar ideas', exact: true }).click();
    await page.getByRole('button', { name: 'Ir a Demuestra' }).click();
    await page.getByRole('button', { name: 'Empezar evaluación' }).click();
    const choose = async correct => {
      for (const [i, answer] of solutions.questions.entries()) {
        const option = correct || i === 0 ? answer.correctOptionId : ['A', 'B', 'C', 'D'].find(id => id !== answer.correctOptionId);
        await page.locator(`input[name="${answer.id}"][value="${option}"]`).check();
      }
    };
    await choose(false); await page.reload(); await page.locator('.rd-question').first().waitFor();
    assert.equal(await page.locator('.rd-question input:checked').count(), 2);
    await page.locator('.rd-primary-nav a[href="#/redes/recursos"]').click(); await page.getByRole('heading', { name: 'Termina tu evaluación' }).waitFor();
    await page.getByRole('link', { name: 'Volver a la evaluación' }).click();
    await page.getByRole('button', { name: 'Entregar evaluación' }).click(); await page.getByText('1 / 2 respuestas correctas', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Nuevo intento' }).click(); await choose(true);
    await page.getByRole('button', { name: 'Entregar evaluación' }).click(); await page.getByText('2 / 2 respuestas correctas', { exact: true }).waitFor();
    await page.locator('.rd-learning-surface a[href^="#/redes/leccion/RED-M01-L02"]').waitFor();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('soc-learning-path:redes:learning:v1')));
    assert.equal(Object.keys(saved.records[first.id][first.revision].attempts).length, 2);
    assert.ok((await page.locator('.rd-profile').textContent()).includes('20 XP'));
    await page.screenshot({ path: output + '/resultado.png' }); report.screenshots.push('resultado.png');
  });
  await check('Volver al nodo, recursos y curso anterior', async () => {
    await page.getByRole('link', { name: 'Volver a la etapa', exact: true }).click(); await page.locator('#red-node-RED-M01-L01').waitFor();
    await settle(); assert.equal(await page.evaluate(() => document.activeElement?.id), 'red-node-RED-M01-L01');
    await go('#/redes/recursos/glosario'); await page.getByRole('heading', { name: 'Glosario de apoyo del Mundo Redes' }).waitFor();
    await go('#/redes/recursos/RED-L01'); await page.getByText('Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.', { exact: true }).waitFor();
    await page.locator('.academy-selector a[href="#/splunk/ruta"]').click(); await page.locator('.splunk-academy').waitFor();
    await page.locator('.academy-selector a[href="#/redes/ruta"]').click(); await page.locator('.rd-profile').waitFor();
    assert.ok((await page.locator('.rd-profile').textContent()).includes('20 XP'));
  });
  assert.deepEqual(report.errors, []); report.executed = true; await context.close();
} catch (error) { report.failure = String(error); process.exitCode = 1; }
finally { if (browser) await browser.close(); await writeFile(output + '/informe.json', JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify(report, null, 2));
