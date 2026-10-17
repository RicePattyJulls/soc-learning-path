import { mapLayout, fitMapLabels, type MapLayout } from '../lib/adventure';
import { regionVisuals, type RegionVisual } from '../lib/region-visuals';

// Pure SC-200 landscape metadata; no educational state or course data.
const themed=(index:number,id:string,name:string):RegionVisual=>({...regionVisuals[index],id:id+'-world',name});

// Illustration metadata only: never content, progress, rewards or prerequisites.
const palette = { sky:'#e2f2ed',skyDeep:'#a0d1d8',ground:'#a7c79d',light:'#e4edc5',cliff:'#bba982',shade:'#547e78',ridge:'#7ca79e',far:'#b2d0ce',water:'#4396b4',foliage:'#317568',accent:'#ffc45f' };
export const splunkWorlds: Readonly<Record<string,RegionVisual>> = {
  harbor: {id:'SP-R01-world',name:'Puerto de Splunk',horizon:'skyline',terrain:'islets',ridge:[260,245,270,230,255,260,235,270,250],vegetation:['round','slender'],landmark:'intake',river:[.84,.9,.24,.48],riverWidth:110,palette:{...palette,sky:'#e3f2f4',skyDeep:'#add7e5',ground:'#b7d0a4',light:'#f0efcd',cliff:'#b6a585',water:'#4396b4'}},
  river: {id:'SP-R02-world',name:'Río de Telemetría',horizon:'peaks',terrain:'terraces',ridge:[270,185,260,115,265,175,235,145,250],vegetation:['round','slender','pine'],landmark:'intake',river:[.79,.91,.25,.47],riverWidth:98,palette},
  forest: {id:'SP-R03-world',name:'Bosque SPL',horizon:'canopy',terrain:'terraces',ridge:[260,210,275,180,255,200,270,220,265],vegetation:['pine','round','slender'],landmark:'observatory',river:[.77,.66,.21,.44],riverWidth:52,palette:{...palette,sky:'#ddeadd',skyDeep:'#a3c2b4',ground:'#8eb491',light:'#cee0b5',cliff:'#9a9e7c',shade:'#416c61',ridge:'#537f70',far:'#a1bba9',water:'#66aaa9',foliage:'#286752'}},
  laboratory:themed(2,'SP-R04','Laboratorio SPL II'),
  normalization:themed(1,'SP-R05','Valle de Normalización'),
  soc:themed(7,'SP-R06','Centro SOC'),
  detections:themed(6,'SP-R07','Fábrica de Detecciones'),
  hunting:themed(9,'SP-R08','Cordillera Threat Hunting'),
  security:themed(5,'SP-R09','Torre Enterprise Security'),
  administration:themed(4,'SP-R10','Fortaleza Administradora'),
  automation:themed(11,'SP-R11','Cumbre de Automatización'),
};
export function worldLayout(count:number,width:number,heights:number[]=[],atlas=false):MapLayout {
  const compact=width<600,medium=width<1100;
  const base=mapLayout(count,compact,medium,atlas,width);
  if(compact) {
    const scale=width/base.width;
    let y=410;
    const points=base.points.map((point,i)=>{const p={...point,y};y+=Math.max(atlas?390:295,((heights[i]||180)+60)/scale);return p;});
    const chest={x:200,y:y+60};
    return {...base,points,chest,height:chest.y+170};
  }
  if(atlas) {
    const points=base.points.map((_,i)=>({x:width*(.18+i*.32),y:440+(i%2)*75}));
    const floor=Math.max(...points.map((p,i)=>p.y+(heights[i]||260)));
    return {width,points,chest:{x:width*.81,y:floor+130},height:floor+280};
  }
  return fitMapLabels(base,heights.length===count?heights:Array(count).fill(210),1,medium?3:4);
}
