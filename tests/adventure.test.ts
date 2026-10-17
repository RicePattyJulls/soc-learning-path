import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapters, lessons } from '../src/lib/catalog';
import { fitMapLabels, mapLayout, routeSegment } from '../src/lib/adventure';
import { regionStations, sc200Adventure, worldStations } from '../src/lib/adventure-catalog';
import { emptyLearning, emptyRecord, facade, migrateLegacy, totalXP } from '../src/lib/learning';

test('el atlas conserva 13 regiones y cada lectura tiene un nodo, sin exponer los pasos en el mapa',()=>{
  const progress=facade(emptyLearning(),lessons);
  assert.deepEqual(sc200Adventure.regionIds,chapters.map(c=>c.id));
  assert.equal(worldStations(progress).length,13);
  const nodes=chapters.flatMap(c=>regionStations(c,progress));
  assert.deepEqual(nodes.map(n=>n.id),lessons.filter(l=>l.moduleId).map(l=>l.id));
  assert.equal(new Set([...nodes.map(n=>n.id),lessons[0].id]).size,76);
  assert.ok(nodes.every(n=>!n.id.startsWith('paso-')));
});
test('el mapa proyecta dominio, avance, bloqueos y cobertura desde V1.5 sin mutar el progreso ni conceder XP',()=>{
  const first=lessons.find(l=>l.id===chapters[0].lessonIds[0])!;
  const store=migrateLegacy({schemaVersion:1,completed:{[first.id]:first.version}},emptyLearning(),chapters);
  store.records[first.id]={[first.learning!.revision]:{...emptyRecord(),started:true,completed:true,mastered:true}};
  const before=JSON.stringify(store),xp=totalXP(store),progress=facade(store,lessons);
  assert.equal(regionStations(chapters[0],progress)[0].state,'mastered');
  assert.ok(regionStations(chapters[0],progress).slice(1).every(n=>n.state==='not-started'));
  assert.ok(regionStations(chapters[1],progress).every(n=>n.state==='locked'&&!n.href));
  assert.ok(worldStations(progress).every(n=>n.href)); // Locked worlds allow preview of their index.
  const pending=regionStations(chapters[0],progress).find(n=>n.id===chapters[0].lessonIds[1])!;
  const meta=lessons.find(l=>l.id===pending.id)!.learning!;
  if(meta.coverage==='reviewed')assert.equal(pending.detail,`${meta.practiceIds.length+meta.assessmentIds.length} actividades revisadas`);
  else assert.match(pending.detail,/pendientes/);
  assert.equal(pending.state,'not-started');
  assert.equal(totalXP(store),xp);assert.equal(JSON.stringify(store),before);
});
test('la geometría es reutilizable para otras rutas y cantidades, en teléfono, tableta y escritorio',()=>{
  for(const count of [1,4,6,9,13,17])for(const mode of ['phone','tablet','desktop']) {
    const layout=mapLayout(count,mode==='phone',mode==='tablet',count===13);
    assert.equal(layout.points.length,count);
    assert.ok(layout.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>60&&p.x<layout.width-60&&p.y>240&&p.y<layout.height-120));
    assert.ok(layout.chest.y>layout.points.at(-1)!.y);
    for(let i=1;i<count;i++)assert.ok(!routeSegment(layout.points[i-1],layout.points[i]).includes('NaN'));
  }
});

test('los rótulos extensos hacen crecer el camino sin solaparse ni recortar el cofre',()=>{
  for(const compact of [false,true]){const base=mapLayout(9,compact,true),heights=[210,260,320,240,350,220,270,240,300],scale=.735,columns=compact?1:3;const fitted=fitMapLabels(base,heights,scale,columns);for(let i=columns;i<9;i+=columns){const floor=Math.max(...fitted.points.slice(i-columns,i).map((p,n)=>p.y+heights[i-columns+n]/scale));assert.ok(Math.min(...fitted.points.slice(i,i+columns).map(p=>p.y))>floor);}assert.ok(fitted.chest.y>Math.max(...fitted.points.map((p,i)=>p.y+heights[i]/scale)));}
});

test('el viewport panorámico mantiene coordenadas comunes, orden serpenteante y margen para las placas',()=>{
  for(const width of [720,992,1404,1872,2494]) {
    const medium=width<1100,columns=medium?3:4;
    const layout=mapLayout(13,false,medium,true,width);
    assert.equal(layout.width,width);
    assert.ok(layout.points.every(p=>p.x>=120&&p.x<=width-120));
    for(let i=1;i<layout.points.length;i++)if(Math.floor(i/columns)===Math.floor((i-1)/columns)) {
      assert.equal(layout.points[i].x>layout.points[i-1].x,Math.floor(i/columns)%2===0);
    }
    const fitted=fitMapLabels(layout,Array(13).fill(310),1,columns);
    assert.ok(fitted.chest.y>Math.max(...fitted.points.map(p=>p.y+310)));
    assert.ok(fitted.chest.y+120<=fitted.height);
  }
  assert.deepEqual(mapLayout(13,true,false,true,2494),mapLayout(13,true,false,true));
});
