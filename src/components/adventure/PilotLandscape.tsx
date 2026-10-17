import { LandscapeSymbols } from './LandscapeSymbols';
import { memo, useId } from 'react';
import type { MapLayout } from '../../lib/adventure';
import type { Bridge, pilotLandscape } from '../../lib/pilot-landscape';

export const PilotLandscape = memo(function PilotLandscape({ layout, landscape }: { layout: MapLayout; landscape: ReturnType<typeof pilotLandscape> }) {
  const uid = useId().replace(/:/g, ''), id = (name: string) => `${uid}-${name}`, paint = (name: string) => `url(#${id(name)})`;
  const { width: w, height: h } = layout, compact = w < 600;
  return <svg className="landscape-art pilot-landscape-art" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" focusable="false" data-landscape="premium-pilot">
    <defs>
      <linearGradient id={id('sky')} x2="0" y2="1"><stop stopColor="var(--sky-deep)"/><stop offset=".42" stopColor="var(--sky)"/><stop offset="1" stopColor="#f3fbdf"/></linearGradient>
      <linearGradient id={id('meadow')} x1="0" y1="0" x2=".4" y2="1"><stop stopColor="#c5e58b"/><stop offset=".45" stopColor="var(--grass)"/><stop offset="1" stopColor="#72b67d"/></linearGradient>
      <linearGradient id={id('cliff')} x2="0" y2="1"><stop stopColor="#ac9470"/><stop offset=".32" stopColor="#8d7d66"/><stop offset="1" stopColor="#586b63"/></linearGradient>
      <linearGradient id={id('ledge')} x2=".6" y2="1"><stop stopColor="#e3eeac"/><stop offset=".45" stopColor="#b8d880"/><stop offset="1" stopColor="#83b563"/></linearGradient>
      <linearGradient id={id('water')} x1="0" x2=".7" y2="1"><stop stopColor="#56c7f1"/><stop offset=".45" stopColor="var(--river)"/><stop offset="1" stopColor="#26b8ce"/></linearGradient>
      <linearGradient id={id('crown')} x2=".8" y2="1"><stop stopColor="#91cb69"/><stop offset=".45" stopColor="#4c9e5c"/><stop offset="1" stopColor="#24694c"/></linearGradient>
      <LandscapeSymbols id={id} paint={paint}/>
    </defs>
    <path d={`M0 0H${w}V${h}H0Z`} fill={paint('sky')}/>
    <g fill="#fff" opacity=".47"><ellipse cx={w*.18} cy="105" rx={w*.14} ry="15"/><ellipse cx={w*.15} cy="94" rx={w*.065} ry="21"/><ellipse cx={w*.73} cy="70" rx={w*.15} ry="16"/><ellipse cx={w*.77} cy="59" rx={w*.065} ry="20"/></g>
    <path d={`M0 290 ${w*.13} 201 ${w*.25} 252 ${w*.39} 111 ${w*.54} 240 ${w*.67} 155 ${w*.79} 235 ${w*.91} 138 ${w} 227V420H0Z`} fill="#94afd0"/>
    <path d={`M${w*.18} 310 ${w*.39} 111 ${w*.35} 254 ${w*.56} 280Z M${w*.66} 320 ${w*.91} 138 ${w*.87} 265 ${w} 291Z`} fill="#728ead"/>
    <path d={`M${w*.39} 111 ${w*.422} 262 ${w*.49} 286 ${w*.36} 257Z M${w*.91} 138 ${w*.936} 278 ${w*.99} 303 ${w*.88} 269Z`} fill="#4f7194" opacity=".6"/>
    <path d={`M${w*.3} 207 ${w*.39} 111 ${w*.48} 205 ${w*.416} 181 ${w*.39} 210 ${w*.368} 178Z M${w*.842} 209 ${w*.91} 138 ${w*.974} 204 ${w*.931} 187 ${w*.906} 213 ${w*.887} 186Z`} fill="#f4faff"/>
    <path d={`M0 347 ${w*.12} 262 ${w*.29} 345 ${w*.53} 234 ${w*.73} 350 ${w*.89} 268 ${w} 335V500H0Z`} fill="#73a295"/>
    <path d={`M0 355Q${w*.17} 305 ${w*.4} 363T${w} 344V${h}H0Z`} fill={paint('meadow')}/>
    <path d={`M0 360Q${w*.23} 280 ${w*.43} 369L${w*.65} 429Q${w*.21} 342 0 447Z`} fill="#daed9f" opacity=".7"/>
    {Array.from({length:Math.ceil((h-390)/370)},(_,index)=>{
      const y=430+index*370;
      return <g key={index}><path d={`M0 ${y}Q${w*.3} ${y-50} ${w*.57} ${y+20}T${w} ${y-3}V${y+88}Q${w*.7} ${y+148} ${w*.44} ${y+72}T0 ${y+90}Z`} fill={paint('cliff')}/><path d={`M0 ${y}Q${w*.3} ${y-50} ${w*.57} ${y+20}T${w} ${y-3}L${w} ${y+16}Q${w*.77} ${y+92} ${w*.47} ${y+26}T0 ${y+22}Z`} fill={paint('ledge')}/><path d={`M0 ${y+22}Q${w*.25} ${y-17} ${w*.47} ${y+26}T${w} ${y+16}`} stroke="#eef6c4" strokeWidth="4" fill="none"/><path d={`M${w*.12} ${y+34}l-8 35m${w*.32} -38 10 39m${w*.28} -34-4 28`} stroke="#d2c1a0" opacity=".4" strokeWidth="4"/></g>;
    })}
    <path d={landscape.riverPath} stroke="#275a6154" strokeWidth={landscape.riverWidth+28} fill="none"/>
    <path d={landscape.riverPath} stroke="#e6ddae" strokeWidth={landscape.riverWidth+15} fill="none"/>
    <path data-river="true" d={landscape.riverPath} stroke={paint('water')} strokeWidth={landscape.riverWidth} fill="none"/>
    <path d={landscape.riverPath} stroke="#a9edff" strokeWidth="2.5" strokeDasharray="22 65" fill="none" opacity=".7"/>
    {layout.points.map((point,index)=>{
      const rx=compact?92:135,y=point.y+85,x=point.x;
      return <g key={index}>
        <path d={`M${x-rx} ${y} ${x-rx+7} ${y+35} ${x-rx*.52} ${y+54} ${x+rx*.23} ${y+59} ${x+rx*.86} ${y+37} ${x+rx} ${y-2}Z`} fill={paint('cliff')}/>
        <path d={`M${x-rx+7} ${y+3} ${x-rx*.52} ${y+19} ${x-rx*.52} ${y+54} ${x-rx+7} ${y+35}Z M${x+rx*.23} ${y+21} ${x+rx*.62} ${y+7} ${x+rx*.55} ${y+46} ${x+rx*.23} ${y+59}Z`} fill="#b4ac8e" opacity=".5"/>
        <path d={`M${x-rx} ${y} ${x-rx*.61} ${y-23} ${x+rx*.19} ${y-30} ${x+rx*.8} ${y-17} ${x+rx} ${y-2} ${x+rx*.23} ${y+21} ${x-rx*.52} ${y+19}Z`} fill={paint('ledge')} stroke="#e3efb3" strokeWidth="3"/>
        <path d={`M${x-rx*.86} ${y+1}l15-7m${rx*.29} 13 15 2m${rx*.35} -7 14-6`} fill="none" stroke="#e8f5bf" strokeWidth="3" strokeLinecap="round"/>
      </g>;
    })}
    {!compact?<g transform={`translate(${w*.08} 318)`}><ellipse cx="35" cy="35" rx="65" ry="20" fill="#365b6a26"/><path d="M-8-50 20-64 44-50V35L20 48-8 34Z" fill="#d8edff" stroke="#f5fbff" strokeWidth="3"/><path d="m20-64 24 14v85L20 48Z" fill="#87b5d0"/><path d="M43-20 65-32 85-18V40L65 50 43 37Z" fill="#b5d5e8" stroke="#ecf8ff" strokeWidth="3"/><path d="M1-38V22m12-64v68m18-64v65m23-34v26m12-32v31" stroke="#5887af" strokeWidth="5"/></g>:null}
    <g data-scenery="trees">{landscape.trees.map((tree,index)=><use key={index} href={`#${id(tree.kind)}`} transform={`translate(${Math.round(tree.x)} ${Math.round(tree.y)}) scale(${tree.scale})`}/>)}</g>
    <g data-scenery="rocks">{landscape.trees.filter((_,index)=>index%4===0).map((tree,index)=><use key={index} href={`#${id(index%2?'bush':'rock')}`} transform={`translate(${Math.round(tree.x-25)} ${Math.round(tree.y+36)}) scale(${compact?.5:.7})`}/>)}</g>
    <g data-scenery="meadow-details">{landscape.trees.filter((_,index)=>index%3===0).map((tree,index)=><g key={index} transform={`translate(${Math.round(tree.x+12)} ${Math.round(tree.y+14)}) scale(${compact?.7:1})`}><path d="M-10 3-14-6m4 9 3-12m10 9 2-8" stroke="#4f9753" strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="-7" cy="-10" r="3" fill="#fff4c3"/><circle cx="6" cy="-7" r="3" fill="#ffdc91"/></g>)}</g>
    {!compact?<g transform={`translate(${w*.16} ${h-135})`}><use href={`#${id('rock')}`} transform="translate(0 0) scale(1.3)"/><use href={`#${id('rock')}`} transform="translate(32 12) scale(.8)"/><use href={`#${id('bush')}`} transform="translate(-25 17) scale(.8)"/></g>:null}
    <path d={`M0 ${h-24}Q${w*.22} ${h-80} ${w*.5} ${h-25}T${w} ${h-50}V${h}H0Z`} fill="#327954" opacity=".5"/>
  </svg>;
});

export const PilotBridges = memo(function PilotBridges({ bridges }: { bridges: Bridge[] }) {
  return <>{bridges.map((bridge,index)=><g key={index} className="map-bridge pilot-bridge" transform={`translate(${bridge.x.toFixed(1)} ${bridge.y.toFixed(1)}) rotate(${bridge.angle.toFixed(1)})`} data-crossing-x={bridge.x.toFixed(1)} data-crossing-y={bridge.y.toFixed(1)}>
    <rect x={-bridge.length/2-3} y="-26" width={bridge.length+6} height="56" rx="5" fill="#1b3a3f" opacity=".2" transform="translate(5 8)"/>
    <rect x={-bridge.length/2} y="-23" width={bridge.length} height="46" rx="3" fill="#87623b" stroke="#6c512f" strokeWidth="3"/>
    {Array.from({length:Math.ceil(bridge.length/10)},(_,i)=><path key={i} d={`M${-bridge.length/2+5+i*10} -21v42`} stroke={i%3?'#d5ad6b':'#ecc88a'} strokeWidth="7"/>)}
    <path d={`M${-bridge.length/2-4}-27H${bridge.length/2+4}M${-bridge.length/2-4} 27H${bridge.length/2+4}`} stroke="#6e4e2d" strokeWidth="5"/>
    <path d={`M${-bridge.length/2-4}-29H${bridge.length/2+4}`} stroke="#ffe2a2" strokeWidth="2"/>
    {[-bridge.length/2,0,bridge.length/2].map(x=><path key={x} d={`M${x}-33v13m0 0v-7M${x} 21v13`} stroke="#8c683e" strokeWidth="6"/>)}
  </g>)}</>;
});
