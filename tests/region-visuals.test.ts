import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapters } from '../src/lib/catalog';
import { regionVisuals, regionVisual } from '../src/lib/region-visuals';
import { fitMapLabels, mapLayout } from '../src/lib/adventure';
import { pilotLandscape } from '../src/lib/pilot-landscape';

test('las 13 regiones reales tienen una configuración visual propia sin cambiar sus IDs',()=>{
  assert.deepEqual(regionVisuals.map(v=>v.id),chapters.map(c=>c.id));
  assert.equal(new Set(regionVisuals.map(v=>v.name)).size,13);
  assert.equal(new Set(regionVisuals.map(v=>[v.horizon,v.terrain,v.landmark,v.ridge.join(','),v.vegetation.join(',')].join(':'))).size,13);
  assert.equal(regionVisual('ruta-futura-sin-ilustracion'),undefined);
});

test('todos los biomas conservan nodos y generan agua, cruces y decoración finitos y deterministas',()=>{
  for(const [index,visual] of regionVisuals.entries())for(const width of [400,734,1402,2494]) {
    const compact=width===400;
    const layout=fitMapLabels(mapLayout(chapters[index].lessonIds.length,compact,width===734,false,width),Array(chapters[index].lessonIds.length).fill(300),compact?.91:1,compact?1:width===734?3:4);
    const snapshot=JSON.stringify(layout),scene=pilotLandscape(layout,index===0?undefined:visual);
    assert.equal(JSON.stringify(layout),snapshot,'La ilustración no mueve los nodos');
    assert.ok(!scene.riverPath.includes('NaN'));
    assert.ok(scene.trees.length<160,'Decoración acotada incluso en mapas móviles largos');
    assert.ok(scene.bridges.every(b=>Number.isFinite(b.x+b.y+b.angle+b.length)&&b.x>0&&b.x<width&&b.length>=scene.riverWidth));
    assert.deepEqual(scene,pilotLandscape(layout,index===0?undefined:visual));
  }
});
