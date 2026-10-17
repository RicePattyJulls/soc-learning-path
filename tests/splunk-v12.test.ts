import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import SplunkMarkdown from '../src/splunk/SplunkMarkdown';
import PremiumWorld from '../src/splunk/PremiumWorld';
import { worldLayout, splunkWorlds } from '../src/splunk/world-model';
import { pilotLandscape } from '../src/lib/pilot-landscape';
import { catalog } from '../src/splunk/data';
import { emptySplunk } from '../src/splunk/progress';
import { checkV12Protected } from '../scripts/splunk-v12-integrity.mjs';

test('V1.2 diagnóstico: pre ilustrativo enfocable y etiquetado, sin cambiar el contenido',()=>{
  const html=renderToStaticMarkup(createElement(SplunkMarkdown,{children:'```spl\nindex=INDICE_AUTH | stats count\n```'}));
  assert.match(html,/<pre tabindex="0" role="region" aria-label="Código ilustrativo/);
  assert.ok(html.includes('index=INDICE_AUTH | stats count'));
});
test('V1.2: geometría compartida de nodos/camino/puentes a 320,390,768,1440; placas extensas no se pisan',()=>{
  for(const viewport of [320,390,768,1440])for(const count of [3,5,6,7]) {
    const width=viewport-(viewport<=600?24:56),atlas=count===3;
    const normal=worldLayout(count,width,Array(count).fill(230),atlas);
    const tall=worldLayout(count,width,Array(count).fill(420),atlas);
    assert.equal(normal.points.length,count);assert.ok(tall.height>=normal.height);
    const scale=width/normal.width;
    for(const p of normal.points) {
      assert.ok(p.x*scale>73 && p.x*scale<width-73);
      assert.ok(p.y>0&&p.y<normal.height);
    }
    assert.ok(tall.chest.y>Math.max(...tall.points.map(p=>p.y)));
    for(const visual of Object.values(splunkWorlds)) {
      const terrain=pilotLandscape(normal,visual);
      assert.ok(terrain.riverPath.startsWith('M'));
      assert.ok(terrain.bridges.length>0,`${viewport}/${count}/${visual.name}: cruces reales`);
      for(const bridge of terrain.bridges)assert.ok(Number.isFinite(bridge.angle)&&bridge.length>0);
    }
    if(width<600)for(let i=1;i<count;i++)assert.ok((tall.points[i].y-tall.points[i-1].y)*scale>=479);
  }
});
test('V1.2: 80 nodos premium son botones HTML con IDs estables; candados interactivos sin falsear desbloqueos',()=>{
  for(const region of catalog.regions) {
    const html=renderToStaticMarkup(createElement(PremiumWorld,{region,store:emptySplunk()}));
    assert.equal((html.match(/data-world-control="true"/g)||[]).length,region.lessonIds.length);
    assert.equal((html.match(/<button /g)||[]).length,region.lessonIds.length);
    for(const id of region.lessonIds)assert.ok(html.includes(`id="sp-node-${id}"`));
    assert.ok(html.includes('class="station-platform sp-world-platform"'));
    assert.ok(!html.includes('Dominada'));assert.ok(html.includes('XP provisionales'));
    assert.ok(html.includes('aria-expanded="false"'));
    assert.ok(html.includes('data-river="true"'));assert.ok(html.includes('pilot-bridge'));
  }
  const atlas=renderToStaticMarkup(createElement(PremiumWorld,{store:emptySplunk()}));
  assert.equal((atlas.match(/data-region="SP-R/g)||[]).length,11);
});
test('V1.2: estilos del mundo aislados, feedback breve y reducido; SC-200/contenidos/progreso intactos',async()=>{
  const css=await readFile(new URL('../src/splunk/premium-world.css',import.meta.url),'utf8');
  assert.ok(css.includes('prefers-reduced-motion:reduce'));assert.ok(css.includes('hover:hover'));
  assert.ok(css.includes('var(--motion-press)'));assert.ok(!css.includes('infinite'));
  assert.ok(!css.includes('transition:all'));assert.ok(css.includes('data-presentation-input="keyboard"'));
  const result=await checkV12Protected();assert.equal(result.splunk.lessons,18);assert.deepEqual(result.changed,[]);
});
test('V1.2 diagnóstico: recurso SPL conserva fondo oscuro y color heredado; contraste calculado >= 4.5',async()=>{
  const css=await readFile(new URL('../src/splunk/splunk.css',import.meta.url),'utf8');
  assert.ok(css.includes('.splunk-academy .sp-resources .splunk-markdown pre { background:#172d4e; color:#e0e9f7; }'));
  assert.ok(css.includes('.splunk-academy .splunk-markdown pre code { background:transparent; color:inherit; }'));
  const luminance=(hex:string)=>{const rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  const contrast=(a:string,b:string)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  assert.ok(contrast('e0e9f7','edf3f2')<4.5,'El fondo anterior demuestra el problema, no un fallo del navegador');
  assert.ok(contrast('e0e9f7','172d4e')>=4.5);
});
