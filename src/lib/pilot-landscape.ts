import type { MapLayout, Point } from './adventure';
import type { RegionVisual } from './region-visuals';

export interface Curve { a: Point; b: Point; c: Point; d: Point }
export interface Bridge extends Point { angle: number; length: number }
export function curvePoint(curve: Curve, t: number): Point {
  const u = 1 - t;
  return { x: u ** 3 * curve.a.x + 3 * u ** 2 * t * curve.b.x + 3 * u * t ** 2 * curve.c.x + t ** 3 * curve.d.x,
    y: u ** 3 * curve.a.y + 3 * u ** 2 * t * curve.b.y + 3 * u * t ** 2 * curve.c.y + t ** 3 * curve.d.y };
}
export function roadCurve(a: Point, d: Point): Curve {
  const horizontal = Math.abs(d.x - a.x) > Math.abs(d.y - a.y);
  return { a, d, b: horizontal ? { x: (a.x + d.x) / 2, y: a.y - 110 } : { x: a.x + 100, y: (a.y + d.y) / 2 },
    c: horizontal ? { x: (a.x + d.x) / 2, y: d.y + 110 } : { x: d.x - 100, y: (a.y + d.y) / 2 } };
}
export function curvePath(curve: Curve) {
  const { a, b, c, d } = curve;
  return `M${a.x} ${a.y} C${b.x} ${b.y},${c.x} ${c.y},${d.x} ${d.y}`;
}
function sample(curve: Curve, count = 64): Point[] {
  return Array.from({ length: count + 1 }, (_, index) => curvePoint(curve, index / count));
}
function crossing(a: Point, b: Point, c: Point, d: Point): Point | null {
  const rx = b.x - a.x, ry = b.y - a.y, sx = d.x - c.x, sy = d.y - c.y;
  const denominator = rx * sy - ry * sx;
  if (Math.abs(denominator) < .001) return null;
  const t = ((c.x - a.x) * sy - (c.y - a.y) * sx) / denominator;
  const u = ((c.x - a.x) * ry - (c.y - a.y) * rx) / denominator;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? { x: a.x + t * rx, y: a.y + t * ry } : null;
}
function distance(point: Point, line: Point[]) {
  let nearest = Infinity;
  for (let index = 1; index < line.length; index++) {
    const a = line[index - 1], b = line[index], dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
    nearest = Math.min(nearest, Math.hypot(point.x - a.x - t * dx, point.y - a.y - t * dy));
  }
  return nearest;
}

// One shared geometry for water, road crossings and scenery exclusion zones.
export function pilotLandscape(layout: MapLayout, visual?: RegionVisual) {
  const { width: w, height: h } = layout, compact = w < 600;
  const [start,first,second,end]=visual?.river||[.79,.91,.25,.47];
  const river: Curve = { a: { x: w * start, y: 235 }, b: { x: w * first, y: h * .42 }, c: { x: w * second, y: h * .5 }, d: { x: w * end, y: h + 80 } };
  const riverWidth = compact ? visual?Math.min(46,visual.riverWidth*.51):34 : visual?.riverWidth||67, water = sample(river, 96);
  const links = [...layout.points, layout.chest];
  const roads = links.slice(1).map((point, index) => sample(roadCurve(links[index], point)));
  const bridges: Bridge[] = [];
  for (const road of roads) for (let i = 1; i < road.length; i++) for (let j = 1; j < water.length; j++) {
    const at = crossing(road[i - 1], road[i], water[j - 1], water[j]);
    if (!at || bridges.some(bridge => Math.hypot(bridge.x - at.x, bridge.y - at.y) < 35)) continue;
    const angle = Math.atan2(road[i].y - road[i - 1].y, road[i].x - road[i - 1].x);
    const waterAngle = Math.atan2(water[j].y - water[j - 1].y, water[j].x - water[j - 1].x);
    bridges.push({ ...at, angle: angle * 180 / Math.PI, length: Math.min(visual?280:190, (riverWidth + 25) / Math.max(visual?.25:.35, Math.abs(Math.sin(angle - waterAngle)))) });
  }
  const trees: (Point & { scale: number; kind: string })[] = [];
  const columns = compact ? 4 : 9;
  for (let row = 0; row < Math.ceil((h - 330) / 160); row++) for (let col = 0; col < columns; col++) {
    const point = { x: 20 + (col + (row % 2) * .4) * w / columns, y: 360 + row * 160 + ((col * 47 + row * 13) % 80) };
    const scale = compact ? .65 + (col % 2) * .12 : .85 + (col % 3) * .13;
    if (point.y > h - 50 || point.x > w - 15 || distance(point, water) < riverWidth / 2 + 35 * scale || roads.some(road => distance(point, road) < 45 * scale)) continue;
    if (links.some(node => Math.abs(node.x - point.x) < (compact ? 90 : 130) && point.y > node.y - 75 && point.y < node.y + (compact ? 300 : 220))) continue;
    trees.push({ ...point, scale, kind: visual?.vegetation[(row+col)%visual.vegetation.length]||((row + col) % 3 === 0 ? 'round' : (row + col) % 3 === 1 ? 'pine' : 'slender') });
  }
  return { riverPath: curvePath(river), riverWidth, water, roads, bridges, trees };
}
