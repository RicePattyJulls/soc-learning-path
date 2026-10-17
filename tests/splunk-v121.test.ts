import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import SplunkMap from '../src/splunk/SplunkMap';
import { emptySplunk, recordFor } from '../src/splunk/progress';
import { catalog } from '../src/splunk/data';
import { checkpointDocumentChange, authorizedHistoricalChange } from '../scripts/splunk-checkpoint-reconciliation.mjs';
import { checkV121Protected } from '../scripts/splunk-v121-integrity.mjs';

test('V1.2.1: presentación compartida mantiene URLs Splunk, estados reales y almacén sin mutación',()=>{
  const store=emptySplunk();
  const lesson=catalog.lessons[0];
  const record=recordFor(store,lesson);
  record.seen=[lesson.stepIds[0]];
  store.records[lesson.id]={[lesson.revision]:record};
  const before=JSON.stringify(store);
  const html=renderToStaticMarkup(createElement(SplunkMap,{store,regionId:'SP-R01'}));
  assert.equal(JSON.stringify(store),before);
  assert.match(html,/data-state="progress"/);
  assert.equal((html.match(/data-state="locked"/g)||[]).length,4);
  for(const match of html.matchAll(/<a[^>]+href="(#[^"]+)"/g))assert.ok(match[1].startsWith('#/splunk/'),match[1]);
  assert.ok(!html.includes('Dominada'));
  assert.match(html,/Práctica no evaluada/);
});
test('V1.2.1: una conciliación documental no admite otras versiones ni cambios de contenido',()=>{
  const expected='8f7a2fd30583e0ee0651901097f82a6df78ba2b968846a5ea329d50fc4f9da4c';
  const actual='a26bd328a11f4e5733fc298d369188a7c1a4edc9eae8254bbd989e2867614d95';
  assert.ok(checkpointDocumentChange('docs/RETOMAR.md',expected,actual));
  assert.ok(!checkpointDocumentChange('docs/RETOMAR.md',expected,'0'.repeat(64)));
  assert.ok(!authorizedHistoricalChange('src/generated/catalog.json',expected,actual));
  assert.ok(!authorizedHistoricalChange('scripts/splunk-integrity.mjs',expected,actual));
});
test('V1.2.1: SC-200, motores, paquetes, evidencia axe y respaldo no cambian',async()=>{
  const result=await checkV121Protected();
  assert.equal(result.verifiedCopies,262);assert.deepEqual(result.changed,[]);
  const source=await readFile(new URL('../src/splunk/PremiumWorld.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('useAdventureLayout(count,!props.region)'));
  assert.ok(!source.includes('useWorldLayout'));
  assert.ok(!source.includes("from '../lib/catalog'"));
});
