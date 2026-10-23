import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BLOCKS, CARDS } from '../src/repaso-soc/cards';
import { parseStore, REPASO_SOC_KEY, toggleKnown } from '../src/repaso-soc/progress';
import { withRepasoSocDispatcher, withRepasoSocSelector } from '../scripts/repaso-soc-reconciliation.mjs';

const read = (file: string) => readFile(new URL('../' + file, import.meta.url), 'utf8');

test('Repaso SOC: cuatro bloques con fichas de concepto y uso, ids únicos', () => {
  assert.deepEqual(BLOCKS.map(block => block.id), ['sentinel', 'xdr', 'splunk', 'metodo']);
  assert.equal(new Set(CARDS.map(card => card.id)).size, CARDS.length);
  for (const block of BLOCKS) assert.ok(CARDS.filter(card => card.bloque === block.id).length >= 10, `bloque ${block.id} con contenido`);
  for (const card of CARDS) {
    assert.ok(card.titulo && card.concepto && card.uso && card.tema, `ficha completa ${card.id}`);
    assert.ok(!/licencia|precio|sku/i.test(`${card.concepto} ${card.uso}`), `sin licencias: ${card.id}`);
  }
});

test('Repaso SOC: progreso propio, tolerante a datos ajenos o corruptos', () => {
  assert.equal(REPASO_SOC_KEY, 'soc-learning-path:repaso-soc:v1');
  assert.deepEqual(parseStore(null).known, []);
  assert.deepEqual(parseStore('{roto').known, []);
  assert.deepEqual(parseStore(JSON.stringify({ schemaVersion: 2, known: ['S-01'] })).known, []);
  assert.deepEqual(parseStore(JSON.stringify({ schemaVersion: 1, known: ['S-01', 'S-01', 'NO-EXISTE', 7] })).known, ['S-01']);
  const marked = toggleKnown(parseStore(null), 'X-02');
  assert.deepEqual(marked.known, ['X-02']);
  assert.deepEqual(toggleKnown(marked, 'X-02').known, []);
});

test('Repaso SOC: el enrutador y el selector son exactamente la extensión conciliada', async () => {
  const app = await read('src/App.tsx');
  const selector = await read('src/components/AcademySelector.tsx');
  const backup = 'output/repaso-soc-2026-10-23/respaldo/';
  assert.equal(app, withRepasoSocDispatcher(await read(backup + 'src/App.tsx')));
  assert.equal(selector, withRepasoSocSelector(await read(backup + 'src/components/AcademySelector.tsx')));
  assert.ok(selector.includes('href="#/soc/repaso_soc"'));
  assert.ok(selector.indexOf('Mundo SOC</a>') < selector.indexOf('Repaso SOC</a>'), 'pestaña justo después del Mundo SOC');
});
