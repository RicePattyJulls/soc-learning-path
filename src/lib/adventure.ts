// Visual coordinates only: educational IDs, rewards and unlocks remain in the existing engine.
export type LandscapeTheme = 'valley' | 'water' | 'highland' | 'canyon' | 'forest' | 'snow';
export type MapState = 'not-started' | 'in-progress' | 'completed' | 'mastered' | 'locked';
export interface MapStation {
  id: string; title: string; href?: string; state: MapState; detail: string;
  reward: string; iconIndex: number; current?: boolean;
}
export interface Point { x: number; y: number }
export interface MapLayout { width: number; height: number; points: Point[]; chest: Point }
export interface AdventureRoute { id: string; title: string; regionIds: string[] }
export const themes: LandscapeTheme[] = ['valley', 'forest', 'highland', 'water', 'snow', 'forest', 'canyon', 'water', 'highland', 'forest', 'canyon', 'water', 'snow'];
export function mapLayout(count: number, compact: boolean, medium = false, atlas = false, viewportWidth?: number): MapLayout {
  if (compact) {
    const start=atlas?660:530;
    const points = Array.from({ length: count }, (_, i) => ({ x: i % 2 ? 270 : 130, y: start + i * 260 }));
    const height = start + count * 260 + 150;
    return { width: 400, height, points, chest: { x: 200, y: height - 110 } };
  }
  const columns = medium ? 3 : 4, width = viewportWidth && viewportWidth > 0 ? viewportWidth : medium ? 900 : 1200;
  // Desktop uses scene pixels: scenery symbols and labels keep their size as the
  // landscape widens. Every layer shares these coordinates and the same viewBox.
  const inset = Math.min(180, Math.max(120, width * .1)), stride = (width - inset * 2) / (columns - 1);
  const rows = Math.ceil(count / columns);
  const points = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / columns), column = i % columns;
    return { x: row % 2 ? width - inset - column * stride : inset + column * stride, y: 430 + row * 325 + [40, -35, 45, -25][column] };
  });
  const height = 410 + rows * 325 + 230;
  return { width, height, points, chest: { x: rows % 2 ? width-inset : inset, y: height - 160 } };
}
export function routeSegment(a: Point, b: Point) {
  const dy = Math.abs(b.y - a.y), horizontal = Math.abs(b.x - a.x) > dy;
  return horizontal ? `M${a.x} ${a.y} C${(a.x+b.x)/2} ${a.y-110},${(a.x+b.x)/2} ${b.y+110},${b.x} ${b.y}` : `M${a.x} ${a.y} C${a.x+100} ${(a.y+b.y)/2},${b.x-100} ${(a.y+b.y)/2},${b.x} ${b.y}`;
}
export const mapStateText: Record<MapState, string> = { 'not-started': 'Disponible', 'in-progress': 'En curso', completed: 'Completada', mastered: 'Dominada', locked: 'Bloqueada' };

// Labels stay in CSS pixels. Expand the path only where measured labels need more room.
export function fitMapLabels(base: MapLayout, heights: number[], scale: number, columns: number): MapLayout {
  if (!(scale>0) || heights.length!==base.points.length) return base;
  const points=base.points.map(p=>({...p}));
  let previousFloor=0;
  for(let start=0;start<points.length;start+=columns) {
    const row=points.slice(start,start+columns), minimum=Math.min(...row.map(p=>p.y));
    const shift=start ? Math.max(0,previousFloor+35/scale-minimum) : 0;
    row.forEach(p=>{p.y+=shift;});
    previousFloor=Math.max(...row.map((p,i)=>p.y+heights[start+i]/scale));
  }
  const floor=Math.max(...points.map((p,i)=>p.y+heights[i]/scale));
  const chest={...base.chest,y:Math.max(base.chest.y,floor+140/scale)};
  return {...base,points,chest,height:Math.max(base.height,chest.y+120/scale)};
}
