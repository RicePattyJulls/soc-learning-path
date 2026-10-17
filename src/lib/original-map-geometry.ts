import type { MapLayout, Point } from './adventure';
import { curvePoint, roadCurve, type Bridge, type Curve } from './pilot-landscape';

// Geometry of the existing Artwork river, including the reflected controls of S.
// The artwork stays unchanged; browser checks compare crossings to its real stroke.
export function originalMapBridges(layout: MapLayout): Bridge[] {
  const w=layout.width,h=layout.height;
  const curves: Curve[]=[
    {a:{x:w*.84,y:245},b:{x:w*.98,y:335},c:{x:w*.45,y:360},d:{x:w*.57,y:535}},
    {a:{x:w*.57,y:535},b:{x:w*.69,y:710},c:{x:w*.2,y:705},d:{x:w*.37,y:875}},
    {a:{x:w*.37,y:875},b:{x:w*.54,y:1045},c:{x:w*.8,y:1120},d:{x:w*.49,y:h+130}},
  ];
  const sample=(curve:Curve)=>Array.from({length:97},(_,i)=>curvePoint(curve,i/96));
  const water=curves.flatMap((curve,i)=>sample(curve).slice(i?1:0));
  const links=[...layout.points,layout.chest],bridges:Bridge[]=[],riverWidth=w<600?34:68;
  for(let k=1;k<links.length;k++) {
    const road=sample(roadCurve(links[k-1],links[k]));
    for(let i=1;i<road.length;i++)for(let j=1;j<water.length;j++) {
      const a=road[i-1],b=road[i],c=water[j-1],d=water[j];
      const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,denominator=rx*sy-ry*sx;
      if(Math.abs(denominator)<.001)continue;
      const t=((c.x-a.x)*sy-(c.y-a.y)*sx)/denominator,u=((c.x-a.x)*ry-(c.y-a.y)*rx)/denominator;
      if(t<0||t>1||u<0||u>1)continue;
      const point:Point={x:a.x+t*rx,y:a.y+t*ry};
      if(bridges.some(bridge=>Math.hypot(bridge.x-point.x,bridge.y-point.y)<35))continue;
      const angle=Math.atan2(ry,rx),waterAngle=Math.atan2(sy,sx);
      bridges.push({...point,angle:angle*180/Math.PI,length:Math.min(260,(riverWidth+25)/Math.max(.25,Math.abs(Math.sin(angle-waterAngle))))});
    }
  }
  return bridges;
}
