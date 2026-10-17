import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitMapLabels, mapLayout } from '../src/lib/adventure';
import { curvePoint, pilotLandscape, roadCurve } from '../src/lib/pilot-landscape';

test('los puentes de la piloto se recalculan al alargar el terreno por títulos y pantalla', () => {
  for (const [compact, medium, scale] of [[true, false, .755], [true, false, .93], [false, true, .79], [false, false, 1.15]] as const) {
    const base = mapLayout(4, compact, medium);
    const layout = fitMapLabels(base, [270, 310, 390, 285], scale, compact ? 1 : medium ? 3 : 4);
    const scene = pilotLandscape(layout);
    assert.ok(scene.bridges.length > 0);
    assert.ok(scene.bridges.every(bridge => Number.isFinite(bridge.angle) && bridge.length >= scene.riverWidth && bridge.x > 0 && bridge.x < layout.width && bridge.y > 235 && bridge.y < layout.height));
    assert.ok(scene.trees.length < 100, 'La decoración conserva un presupuesto acotado');
    assert.ok(!scene.riverPath.includes('NaN'));
  }
});

test('la decoración es determinista y no muta la geometría que comparte con los nodos', () => {
  const layout = mapLayout(4, false), before = JSON.stringify(layout);
  assert.deepEqual(pilotLandscape(layout), pilotLandscape(layout));
  assert.equal(JSON.stringify(layout), before);
});

test('el trazado que usan los cruces conserva los extremos de cada segmento del camino', () => {
  const layout = mapLayout(4, true);
  for (let index = 1; index < layout.points.length; index++) {
    const a = layout.points[index - 1], b = layout.points[index], curve = roadCurve(a, b);
    assert.deepEqual(curvePoint(curve, 0), a);
    assert.deepEqual(curvePoint(curve, 1), b);
  }
});
