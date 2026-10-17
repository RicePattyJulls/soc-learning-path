import { memo, useId, type CSSProperties } from 'react';
import type { MapLayout } from '../../lib/adventure';
import type { pilotLandscape } from '../../lib/pilot-landscape';
import type { RegionVisual } from '../../lib/region-visuals';
import { LandscapeSymbols } from './LandscapeSymbols';
import { LandscapeLandmark } from './LandscapeLandmark';

function Horizon({visual,w}:{visual:RegionVisual;w:number}) {
  const p=visual.palette,ridge=visual.ridge;
  const line=(offset:number)=>ridge.map((y,i)=>`${i/(ridge.length-1)*w},${y+offset}`).join(' ');
  return <g data-horizon={visual.horizon}>
    <polygon points={`0,370 ${line(0)} ${w},390`} fill={p.far}/>
    <polygon points={`0,390 ${line(54)} ${w},430`} fill={p.ridge}/>
    {visual.horizon==='peaks'?ridge.map((y,i)=>i%2&&y<235?<g key={i}><path d={`M${(i-.8)/(ridge.length-1)*w} ${y+95} ${i/(ridge.length-1)*w} ${y} ${(i+.8)/(ridge.length-1)*w} ${y+92} ${(i+.24)/(ridge.length-1)*w} ${y+72} ${i/(ridge.length-1)*w} ${y+98}Z`} fill="#f1f8f9" opacity=".85"/><path d={`M${i/(ridge.length-1)*w} ${y} ${(i+.24)/(ridge.length-1)*w} ${y+145} ${(i+.8)/(ridge.length-1)*w} ${y+160} ${(i-.2)/(ridge.length-1)*w} ${y+140}Z`} fill={p.shade} opacity=".35"/></g>:null):null}
    {visual.horizon==='mesas'?Array.from({length:4},(_,i)=>{const x=w*(.08+i*.25),y=ridge[i*2]+25;return <g key={i}><path d={`M${x-w*.06} 390V${y}l${w*.05}-22h${w*.08}l${w*.04} 22V390Z`} fill={p.ridge}/><path d={`M${x+w*.07} ${y-22}l${w*.04} 22V390h${-w*.04}Z`} fill={p.shade} opacity=".5"/><path d={`M${x-w*.06} ${y+15}h${w*.17}m${-w*.17} 24h${w*.17}`} stroke={p.light} strokeWidth="4" opacity=".35"/></g>;}):null}
    {visual.horizon==='canopy'?<g fill={p.ridge}>{Array.from({length:11},(_,i)=><g key={i}><path d={`M${i*w/10} 390v-72`} stroke={p.shade} strokeWidth="12"/><ellipse cx={i*w/10} cy={280+(i%3)*18} rx={w/13} ry={43+(i%3)*12}/><ellipse cx={i*w/10-w/40} cy={263+(i%3)*18} rx={w/22} ry="28" fill={p.far}/></g>)}</g>:null}
    {visual.horizon==='skyline'?<g fill={p.ridge} stroke={p.far} strokeWidth="2">{Array.from({length:8},(_,i)=>{const x=w*(.05+i*.13),y=ridge[i]+20,height=360-y;return <g key={i}><path d={`M${x} 365V${y}l22-13 28 12v${height}l-28 12Z`}/><path d={`M${x+22} ${y-13}v${height+25}l28-12V${y-1}Z`} fill={p.shade} stroke="none"/><path d={`M${x+8} ${y+15}v${height-20}m10 ${20-height}v${height-20}`} stroke={p.light} strokeWidth="4" opacity=".65"/></g>;})}</g>:null}
  </g>;
}

function Landforms({visual,layout,paint}:{visual:RegionVisual;layout:MapLayout;paint:(name:string)=>string}) {
  const w=layout.width,h=layout.height;
  return <g data-terrain={visual.terrain}>{Array.from({length:Math.max(1,Math.ceil((h-390)/370))},(_,i)=>{
    const y=430+i*370,shift=i%2?1:-1;
    if(visual.terrain==='islets')return <g key={i}><path d={`M${-w*.1} ${y}Q${w*.15} ${y-94} ${w*.42} ${y+7}T${w*1.1} ${y-10}V${y+75}Q${w*.71} ${y+158} ${w*.4} ${y+75}T${-w*.1} ${y+100}Z`} fill={paint('cliff')}/><path d={`M${-w*.1} ${y}Q${w*.15} ${y-94} ${w*.42} ${y+7}T${w*1.1} ${y-10}V${y+16}Q${w*.68} ${y+110} ${w*.39} ${y+30}T${-w*.1} ${y+24}Z`} fill={paint('ledge')} stroke={visual.palette.light} strokeWidth="5"/><path d={`M${w*.1} ${y+120}q${w*.1}-34 ${w*.2} 0m${w*.22} 10q${w*.12}-35 ${w*.23}-8`} fill="none" stroke={visual.palette.water} strokeWidth="6" opacity=".25"/></g>;
    if(visual.terrain==='slabs')return <g key={i}><path d={`M0 ${y+24} ${w*.19} ${y-29} ${w*.48} ${y+23} ${w*.71} ${y-21} ${w} ${y+7}V${y+115}L${w*.7} ${y+65} ${w*.46} ${y+115} ${w*.16} ${y+61} 0 ${y+106}Z`} fill={paint('cliff')}/><path d={`M0 ${y+24} ${w*.19} ${y-29} ${w*.48} ${y+23} ${w*.71} ${y-21} ${w} ${y+7}v18L${w*.7} ${y+4} ${w*.48} ${y+48} ${w*.19} ${y-4} 0 ${y+47}Z`} fill={paint('ledge')} stroke={visual.palette.light} strokeWidth="3"/><path d={`M${w*.19} ${y-4}v65m${w*.29}-13v67m${w*.22}-111v61`} stroke={visual.palette.light} opacity=".45" strokeWidth="3"/></g>;
    if(visual.terrain==='buttes')return <g key={i}><path d={`M0 ${y+10} ${w*.17} ${y-22}H${w*.43}L${w*.61} ${y+23}H${w*.84}L${w} ${y-3}V${y+110}L${w*.82} ${y+142}H${w*.59}L${w*.41} ${y+84}H${w*.16}L0 ${y+120}Z`} fill={paint('cliff')}/><path d={`M0 ${y+10} ${w*.17} ${y-22}H${w*.43}L${w*.61} ${y+23}H${w*.84}L${w} ${y-3}v20L${w*.84} ${y+45}H${w*.6}L${w*.42} ${y+2}H${w*.18}L0 ${y+34}Z`} fill={paint('ledge')} stroke={visual.palette.light} strokeWidth="3"/>{[54,75,98].map(offset=><path key={offset} d={`M0 ${y+offset}l${w*.17}-31h${w*.24}l${w*.18} 54h${w*.23}l${w*.18}-30`} stroke={visual.palette.light} opacity=".23" fill="none" strokeWidth="4"/>)}</g>;
    if(visual.terrain==='steps')return <g key={i}><path d={`M0 ${y+27}H${w*.16}v-38h${w*.33}v34h${w*.29}v-22H${w}v106H${w*.76}v22H${w*.47}V${y+95}H${w*.14}v38H0Z`} fill={paint('cliff')}/><path d={`M0 ${y+27}H${w*.16}v-38h${w*.33}v34h${w*.29}v-22H${w}v18H${w*.8}v23H${w*.47}V${y+8}H${w*.18}v39H0Z`} fill={paint('ledge')} stroke={visual.palette.light} strokeWidth="3"/><path d={`M${w*.2} ${y+12}h${w*.24}m${-w*.24} 12h${w*.24}m${w*.07} 24h${w*.24}`} stroke={visual.palette.shade} opacity=".25" strokeWidth="3"/></g>;
    return <g key={i}><path d={`M0 ${y}Q${w*.3} ${y-50*shift} ${w*.57} ${y+20}T${w} ${y-3}V${y+88}Q${w*.7} ${y+148} ${w*.44} ${y+72}T0 ${y+90}Z`} fill={paint('cliff')}/><path d={`M0 ${y}Q${w*.3} ${y-50*shift} ${w*.57} ${y+20}T${w} ${y-3}v19Q${w*.77} ${y+92} ${w*.47} ${y+26}T0 ${y+22}Z`} fill={paint('ledge')} stroke={visual.palette.light} strokeWidth="3"/>{visual.terrain==='beds'?<path d={`M0 ${y+35}Q${w*.3} ${y-20*shift} ${w*.6} ${y+54}T${w} ${y+40}m${-w} 18Q${w*.3} ${y-2*shift} ${w*.6} ${y+72}T${w} ${y+58}`} fill="none" stroke={visual.palette.foliage} strokeWidth="5" opacity=".35"/>:null}</g>;
  })}</g>;
}

export const PremiumLandscape = memo(function PremiumLandscape({layout,landscape,visual}:{layout:MapLayout;landscape:ReturnType<typeof pilotLandscape>;visual:RegionVisual}) {
  const uid=useId().replace(/:/g,''),id=(name:string)=>`${uid}-${name}`,paint=(name:string)=>`url(#${id(name)})`;
  const w=layout.width,h=layout.height,compact=w<600,p=visual.palette;
  const symbols=new Set(visual.vegetation);
  const candidates=landscape.trees.filter(tree=>tree.x>75&&tree.x<w-75&&tree.y>layout.points[0].y+20&&tree.y<h-150);
  const landmark=candidates.reduce<typeof candidates[number]|undefined>((best,tree)=>!best||Math.abs(tree.y-layout.points[0].y-140)+Math.abs(tree.x-w*.75)<Math.abs(best.y-layout.points[0].y-140)+Math.abs(best.x-w*.75)?tree:best,undefined);
  return <svg className="landscape-art premium-landscape-art" style={{'--scene-foliage':p.foliage} as CSSProperties} viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" focusable="false" data-landscape={visual.id}>
    <defs>
      <linearGradient id={id('sky')} x2="0" y2="1"><stop stopColor={p.skyDeep}/><stop offset=".5" stopColor={p.sky}/><stop offset="1" stopColor={p.light}/></linearGradient>
      <linearGradient id={id('ground')} x2=".4" y2="1"><stop stopColor={p.light}/><stop offset=".5" stopColor={p.ground}/><stop offset="1" stopColor={p.foliage}/></linearGradient>
      <linearGradient id={id('cliff')} x2="0" y2="1"><stop stopColor={p.cliff}/><stop offset="1" stopColor={p.shade}/></linearGradient>
      <linearGradient id={id('ledge')} x2=".6" y2="1"><stop stopColor={p.light}/><stop offset="1" stopColor={p.ground}/></linearGradient>
      <linearGradient id={id('water')} x2=".7" y2="1"><stop stopColor="#a3e6e9"/><stop offset=".4" stopColor={p.water}/><stop offset="1" stopColor="#63c9cb"/></linearGradient>
      <linearGradient id={id('crown')} x2=".8" y2="1"><stop stopColor={p.light}/><stop offset=".5" stopColor={p.foliage}/><stop offset="1" stopColor={p.shade}/></linearGradient>
      <LandscapeSymbols id={id} paint={paint}/>
      {symbols.has('crystal')?<g id={id('crystal')}><ellipse cx="8" cy="8" rx="28" ry="9" fill="#194f6228"/><path d="M-24 0-29-37-19-53-7-36-2-2 7 8Z" fill="#89c9d7" stroke="#d9f7f4" strokeWidth="2"/><path d="M-7-2-12-69 4-96 24-69 20-3 5 11Z" fill={p.accent} stroke="#eefcfa" strokeWidth="2"/><path d="M4-96 9-65 5 11 20-3 24-69Z" fill={p.water} opacity=".55"/><path d="m27 5 1-41 12-16 12 19-8 35Z" fill="#a0d7df" stroke="#e6fffa" strokeWidth="2"/><path d="M4-96-1-64v46" fill="none" stroke="#ffffffb8" strokeWidth="3"/></g>:null}
      {symbols.has('reed')?<g id={id('reed')}><ellipse cx="4" cy="7" rx="25" ry="8" fill="#31665228"/><path d="M0 5V-70M-11 4-24-52M13 4 27-63M5 5 12-44" stroke={p.foliage} strokeWidth="5" fill="none"/><path d="M0-73v-16m-24 37-3-12m54 2 4-14" stroke="#b4945b" strokeWidth="8"/><path d="M-9-17Q-39-40-33-4M8-25Q39-45 37-6" stroke={p.ground} strokeWidth="9" fill="none"/></g>:null}
      {symbols.has('cactus')?<g id={id('cactus')}><ellipse cx="5" cy="8" rx="24" ry="7" fill="#525d3028"/><path d="M0 6V-71m0 42h-25v-29m26 16h24v-27" stroke={p.foliage} strokeWidth="16" fill="none"/><path d="M-3 0v-68m-25 11v25m49-34v22" stroke={p.light} strokeWidth="3" fill="none"/><circle cy="-80" r="6" fill={p.accent}/></g>:null}
      {symbols.has('mushroom')?<g id={id('mushroom')}><ellipse cx="5" cy="8" rx="24" ry="8" fill="#2b53402b"/><path d="M-8-30H7L12 6-11 7Z" fill="#e2d4b1"/><path d="M-37-25Q-27-73 1-68Q28-65 34-28Q4-9-37-25" fill={p.accent} stroke="#f3eac8" strokeWidth="2"/><path d="M-32-27Q2-14 30-29" stroke="#a68e75" strokeWidth="5" fill="none"/><circle cx="-7" cy="-53" r="5" fill="#fff6d3"/><circle cx="14" cy="-39" r="4" fill="#fff6d3"/></g>:null}
      <g id={id('landmark')}><LandscapeLandmark kind={visual.landmark} accent={p.accent}/></g>
    </defs>
    <path d={`M0 0H${w}V${h}H0Z`} fill={paint('sky')}/>
    <g fill="#fff" opacity=".4"><ellipse cx={w*.2} cy="80" rx={w*.15} ry="15"/><ellipse cx={w*.75} cy="110" rx={w*.13} ry="19"/></g>
    <Horizon visual={visual} w={w}/>
    <path d={`M0 355Q${w*.16} 308 ${w*.4} 363T${w} 344V${h}H0Z`} fill={paint('ground')}/>
    <path d={`M0 361Q${w*.23} 284 ${w*.46} 370L${w*.7} 423Q${w*.21} 341 0 449Z`} fill={p.light} opacity=".65"/>
    <Landforms visual={visual} layout={layout} paint={paint}/>
    <g data-scenery="architecture"><use href={`#${id('landmark')}`} transform={`translate(${w*.57} 335) scale(${compact?.58:1.13})`}/>{landmark?<use href={`#${id('landmark')}`} transform={`translate(${landmark.x} ${landmark.y}) scale(${compact?.55:.83})`}/>:null}</g>
    <path d={landscape.riverPath} stroke={p.shade} opacity=".35" strokeWidth={landscape.riverWidth+28} fill="none"/>
    <path d={landscape.riverPath} stroke={p.light} strokeWidth={landscape.riverWidth+15} fill="none"/>
    <path data-river="true" d={landscape.riverPath} stroke={paint('water')} strokeWidth={landscape.riverWidth} fill="none"/>
    <path d={landscape.riverPath} stroke="#ddffff" strokeWidth="2.5" strokeDasharray="22 65" opacity=".7" fill="none"/>
    {layout.points.map((point,i)=>{const rx=compact?92:135,y=point.y+85,x=point.x;return <g key={i}><path d={`M${x-rx} ${y}l7 35 ${rx*.5} 21 ${rx*.73} 3 ${rx*.63}-22 ${rx*.14}-39Z`} fill={paint('cliff')}/><path d={`M${x-rx} ${y}l${rx*.39}-23 ${rx*.8}-7 ${rx*.61} 13 ${rx*.2} 15-${rx*.77} 23-${rx*.75}-2Z`} fill={paint('ledge')} stroke={p.light} strokeWidth="3"/><path d={`M${x-rx*.53} ${y+21}v34m${rx*.76}-32v34`} stroke={p.light} opacity=".3" strokeWidth="3"/></g>;})}
    <g data-scenery="trees">{landscape.trees.filter(tree=>tree!==landmark).map((tree,i)=><use key={i} href={`#${id(tree.kind)}`} transform={`translate(${Math.round(tree.x)} ${Math.round(tree.y)}) scale(${tree.scale})`}/>)}</g>
    <g data-scenery="rocks">{landscape.trees.filter((tree,i)=>tree!==landmark&&i%4===0).map((tree,i)=><use key={i} href={`#${id(i%2?'bush':'rock')}`} transform={`translate(${Math.round(tree.x-20)} ${Math.round(tree.y+36)}) scale(${compact?.5:.7})`}/>)}</g>
    <path d={`M0 ${h-24}Q${w*.22} ${h-80} ${w*.5} ${h-25}T${w} ${h-50}V${h}H0Z`} fill={p.foliage} opacity=".55"/>
  </svg>;
});
