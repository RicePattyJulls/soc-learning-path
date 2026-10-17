import { memo, useId } from 'react';
import type { LandscapeTheme, MapLayout } from '../../lib/adventure';

const palettes: Record<LandscapeTheme, { grass: string; light: string; shade: string; pine: string; rock: string; sky: string }> = {
  valley: { grass:'#a5c666',light:'#c8dc83',shade:'#5f9658',pine:'#357952',rock:'#8c9ab4',sky:'#c0e6ff' },
  water: { grass:'#83c69c',light:'#bee7b5',shade:'#4a9e83',pine:'#297e73',rock:'#819dbb',sky:'#c1e9f7' },
  highland: { grass:'#a6ba7a',light:'#d5dca0',shade:'#65876d',pine:'#39726a',rock:'#77859e',sky:'#cbdcf6' },
  canyon: { grass:'#c7b573',light:'#e9d799',shade:'#a58c54',pine:'#718653',rock:'#bc8972',sky:'#f5ddba' },
  forest: { grass:'#85b96a',light:'#c2d78d',shade:'#4e8d61',pine:'#276d53',rock:'#879c9a',sky:'#c1e2e5' },
  snow: { grass:'#bad6cd',light:'#e9f3e6',shade:'#7daba8',pine:'#387c7b',rock:'#8f9eb9',sky:'#ccdef8' },
};

// Original local vector artwork. No raster assets, filters or runtime downloads.
export const Landscape = memo(function Landscape({ layout, theme, atlas=false }: { layout: MapLayout; theme: LandscapeTheme; atlas?: boolean }) {
  const uid = useId().replace(/:/g, ''), p = palettes[theme], w=layout.width, h=layout.height, small=w<600;
  const ref=(id:string)=>`#${uid}-${id}`;
  const nearNode=(x:number,y:number)=>layout.points.some(n=>Math.abs(n.x-x)<(small?70:105)&&Math.abs(n.y-y)<100);
  const trees = Array.from({length:small?Math.ceil(h/16):Math.ceil(h/7)},(_,i)=> {
    const x=((i*167+43)%997)/997*w, y=260+((i*211+127)%991)/991*(h-275);
    const scale=(small?.52:.64)+(y/h)*.42+((i*31)%7)/20;
    return !nearNode(x,y) ? <use key={i} href={ref(i%4===0?'oak':'pine')} transform={`translate(${Math.round(x)} ${Math.round(y)}) scale(${scale.toFixed(2)})`} /> : null;
  });
  const terraces=Array.from({length:Math.ceil(h/240)},(_,i)=> {
    const y=300+i*245, flip=i%2;
    return <g key={i}><path d={`M${flip?w*.52:-w*.1} ${y} Q${w*.25} ${y-100} ${w*.65} ${y+20} T${w*1.1} ${y+90} L${w*1.1} ${y+220} Q${w*.6} ${y+90} 0 ${y+170} Z`} fill={atlas?[p.light,'#a8d5b1','#dbbf8b','#b9cbdc'][i%4]:i%3===0?p.light:p.shade} opacity={atlas?.72:i%3===0?.5:.16}/><path d={`M0 ${y+170} Q${w*.4} ${y+75} ${w} ${y+145}`} stroke={p.light} strokeWidth="6" opacity=".35" fill="none" /></g>;
  });
  const river=`M${w*.84} 245 C${w*.98} 335 ${w*.45} 360 ${w*.57} 535 S${w*.2} 705 ${w*.37} 875 S${w*.8} 1120 ${w*.49} ${h+130}`;
  return <svg className="landscape-art" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" focusable="false" data-landscape={theme}>
    <defs>
      <linearGradient id={`${uid}-sky`} x2="0" y2="1"><stop stopColor={p.sky}/><stop offset="1" stopColor="#f0f8ed"/></linearGradient>
      <linearGradient id={`${uid}-river`} x2=".8" y2="1"><stop stopColor="#92e2f2"/><stop offset=".6" stopColor="#47b7d9"/><stop offset="1" stopColor="#91e9e6"/></linearGradient>
      <g id={`${uid}-pine`}><ellipse cy="8" rx="17" ry="7" fill="#274b4529"/><path d="M-3-5 3-5 4 9-3 9Z" fill="#725940"/><path d="M0-65-22-18-13-20-26 0Q0 12 25 0L12-23 21-20Z" fill={p.pine}/><path d="M0-65-2-13 13-5 25 0 12-23 21-20Z" fill="#183f493b"/><path d="M0-65-17-27-6-30 0-16Z" fill="#a4cf784d"/></g>
      <g id={`${uid}-oak`}><ellipse cy="10" rx="25" ry="8" fill="#274b4528"/><path d="M-3-27 5-27 6 11-4 11Z" fill="#80674c"/><path d="M2-16-14-30 2-23 17-35 7-17Z" fill="#80674c"/><path d="M-26-19Q-40-41-19-49Q-14-70 5-57Q26-68 30-47Q47-38 31-21Q17-9 4-15Q-11-4-26-19Z" fill={p.shade}/><path d="M-26-24Q-36-43-17-46Q-10-64 5-53Q19-62 26-46Q9-48 1-32Q-12-39-26-24Z" fill={p.light} opacity=".8"/></g>
      <g id={`${uid}-rock`}><path d="M-23 5-19-17 1-28 25-11 30 9 8 18Z" fill={p.rock}/><path d="M-19-17 1-28 10-7-23 5Z" fill="#fff" opacity=".25"/><path d="M10-7 25-11 30 9 8 18Z" fill="#263c62" opacity=".24"/></g>
      <g id={`${uid}-flower`}><path d="M0 2V-8" stroke="#4e8a57" strokeWidth="2"/><circle cy="-10" r="4" fill="#fff5bb"/><circle cy="-10" r="1.5" fill="#e5ad41"/></g>
      <g id={`${uid}-cloud`} fill="#fff" opacity=".64"><ellipse rx="53" ry="15"/><ellipse cx="-17" cy="-10" rx="26" ry="17"/><ellipse cx="16" cy="-6" rx="30" ry="18"/></g>
    </defs>
    <path fill={`url(${ref('sky')})`} d={`M0 0H${w}V${h}H0Z`}/>
    <use href={ref('cloud')} transform={`translate(${w*.16} 115) scale(${small?.65:1.2})`} /><use href={ref('cloud')} transform={`translate(${w*.8} 75) scale(${small?.8:1.4})`} />
    <path d={`M0 310 ${w*.08} 216 ${w*.2} 260 ${w*.34} 150 ${w*.46} 245 ${w*.58} 195 ${w*.72} 270 ${w*.85} 126 ${w} 248V390H0Z`} fill="#a9bddd"/>
    <path d={`M${w*.15} 310 ${w*.34} 150 ${w*.3} 255 ${w*.43} 245Z M${w*.64} 310 ${w*.85} 126 ${w*.81} 248 ${w*.94} 217Z`} fill="#c8d5ee"/>
    <path d={`M${w*.265} 213 ${w*.34} 150 ${w*.404} 216 ${w*.36} 200 ${w*.34} 226 ${w*.32} 197Z M${w*.795} 185 ${w*.85} 126 ${w*.918} 190 ${w*.871} 174 ${w*.849} 200 ${w*.831} 169Z`} fill="#f5f9ff"/>
    <path d={`M0 343 ${w*.09} 267 ${w*.16} 311 ${w*.27} 241 ${w*.42} 327 ${w*.56} 266 ${w*.72} 318 ${w*.91} 227 ${w} 303V${h}H0Z`} fill={p.grass}/>
    <path d={`M0 343 ${w*.09} 267 ${w*.07} 327 ${w*.18} 350 ${w*.27} 241 ${w*.25} 345 ${w*.42} 327 ${w*.56} 266 ${w*.55} 333 ${w*.74} 361 ${w*.91} 227 ${w*.87} 351 ${w} 303V460Q${w*.5} 355 0 480Z`} fill={p.light}/>
    {terraces}
    <path d={river} fill="none" stroke={p.shade} strokeWidth={small?52:100} opacity=".3"/>
    <path d={river} fill="none" stroke="#e4d7ae" strokeWidth={small?43:84}/>
    <path d={river} fill="none" stroke={`url(${ref('river')})`} strokeWidth={small?34:68}/>
    <path d={river} fill="none" stroke="#d1faff" strokeWidth="3" strokeDasharray="22 80" opacity=".8"/>
    <g opacity=".8">{Array.from({length:small?6:15},(_,i)=><use key={i} href={ref('pine')} transform={`translate(${Math.round(w*.02+i*w/(small?7:17))} ${280+(i%3)*17}) scale(.58)`}/>)}</g>
    {!small ? <g transform="translate(48 285)"><path d="M-30 53 85 26 137 58 25 86Z" fill="#779da6" opacity=".35"/><g stroke="#e6f3ff" strokeWidth="2"><path d="M-15 0 6-9 25 0V53L6 62-15 52Z" fill="#83b7d6"/><path d="M17-24 40-34 61-24V54L40 64 17 54Z" fill="#b8d9f0"/><path d="M55 8 81-2 100 8V58L81 68 55 58Z" fill="#9db8d9"/></g><path d="M-5 10V44M8 4V44M29-13V44M43-17V44M66 17V50M81 12V50" stroke="#6491bb" strokeWidth="5"/></g> : null}
    {trees}
    {Array.from({length:small?Math.ceil(h/190):25},(_,i)=><use key={i} href={ref('rock')} transform={`translate(${Math.round(((i*173+107)%997)/997*w)} ${320+Math.round(((i*263+69)%991)/991*(h-350))}) scale(${small?.55:.85})`}/>)}
    {Array.from({length:small?Math.ceil(h/60):60},(_,i)=><use key={i} href={ref('flower')} transform={`translate(${Math.round(((i*193+331)%997)/997*w)} ${340+Math.round(((i*227+39)%991)/991*(h-365))}) scale(${small?.65:1})`}/>)}
    <path d={`M0 ${h-48} Q${w*.18} ${h-100} ${w*.36} ${h-30} T${w*.7} ${h-42} T${w} ${h-70}V${h}H0Z`} fill={p.shade} opacity=".75"/>
    {Array.from({length:small?8:23},(_,i)=><use key={i} href={ref(i%3===0?'oak':'pine')} transform={`translate(${i*w/(small?7:22)} ${h-8+(i%3)*9}) scale(${small?.85:1.3})`}/>)}
  </svg>;
});

export function Robot({ className = '' }: { className?: string }) {
  const uid=useId().replace(/:/g,'');
  return <svg className={`adventure-robot ${className}`} viewBox="0 0 160 180" width="160" height="180" aria-hidden="true" focusable="false">
    <defs><linearGradient id={uid}><stop stopColor="#fff"/><stop offset="1" stopColor="#c8d9ef"/></linearGradient></defs>
    <ellipse cx="75" cy="169" rx="45" ry="9" fill="#060f2a55"/>
    <g fill={`url(#${uid})`} stroke="#a8bedf" strokeWidth="2"><path d="M42 132Q30 147 43 160L57 159 60 137Z"/><path d="M86 134Q108 142 100 159L84 159 76 140Z"/><path d="M40 94Q19 98 23 123L36 130 46 114Z"/><path d="M105 96Q120 100 130 81L141 87Q132 116 109 115Z"/><rect x="40" y="91" width="65" height="57" rx="25"/></g>
    <path d="M66 32 69 16" stroke="#b7d3f4" strokeWidth="7"/><ellipse cx="69" cy="15" rx="16" ry="5" transform="rotate(-13 69 15)" fill="#a18bff"/><ellipse cx="72" cy="12" rx="10" ry="3" fill="#d6c6ff"/>
    <rect x="24" y="33" width="96" height="69" rx="31" transform="rotate(-5 70 67)" fill={`url(#${uid})`} stroke="#b7c9ec" strokeWidth="2"/>
    <path d="M34 59Q33 42 54 42L91 40Q108 40 111 55L110 77Q105 91 85 91L53 92Q33 89 34 74Z" fill="#152747"/>
    <path d="M43 53Q62 44 88 47" stroke="#5978a6" strokeWidth="3" strokeLinecap="round"/>
    <rect x="48" y="59" width="9" height="17" rx="4.5" fill="#6be0ff"/><rect x="86" y="56" width="9" height="17" rx="4.5" fill="#6be0ff"/><path d="M66 78Q73 84 80 77" fill="none" stroke="#ab8aff" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="23" cy="73" rx="12" ry="18" fill="#68c6ed"/><ellipse cx="23" cy="73" rx="7" ry="12" fill="#a6e9fc"/><ellipse cx="119" cy="65" rx="8" ry="15" fill="#9c8bea"/>
    <circle cx="74" cy="117" r="13" fill="#a492f4"/><path d="m74 106 9 4-2 12-7 6-7-6-2-12Z" fill="#7854d4"/><path d="m70 116 3 3 6-7" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <g className="robot-hand"><path d="M132 90 130 78 139 70 148 75 146 87Z" fill="#dcecf9" stroke="#a8bedf" strokeWidth="2"/><path d="m138 71 5-10" stroke="#c5dced" strokeWidth="6" strokeLinecap="round"/></g>
    <path d="m133 43 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z" fill="#b8a5ff"/>
  </svg>;
}
export function Treasure({ open = false }: { open?: boolean }) {
  return <svg className={`treasure-art ${open?'open':''}`} viewBox="0 0 140 130" width="140" height="130" aria-hidden="true" focusable="false">
    {open ? <g stroke="#ffe28b" strokeWidth="5" opacity=".8"><path d="m70 42V8M47 46 29 17M94 46l20-29M34 61 9 49M107 62l26-13"/></g> : null}
    <ellipse cx="70" cy="114" rx="55" ry="9" fill="#21375233"/>
    <path d="M18 68 29 58 123 65 122 105 112 117 18 106Z" fill="#a45e22"/><path d="M18 68 112 77 112 117 18 106Z" fill="#b47525"/>
    <path d={open?'M21 59 25 25Q75 3 119 31L122 66Z':'M18 69 21 45Q26 25 66 29L106 36Q123 40 123 65L112 80Z'} fill="#d3962b" stroke="#ffcf57" strokeWidth="4"/>
    <path d={open?'M29 47 32 30Q76 12 112 34L115 53Z':'M27 49Q35 33 66 37L104 44Q113 46 114 60L108 69 27 61Z'} fill={open?'#69462e':'#ffcc4c'}/>
    <path d="M19 72 112 82 122 68M42 33V110M91 35V115" fill="none" stroke="#ffce55" strokeWidth="8" strokeLinejoin="round"/>
    <path d="M18 102 113 113 122 104" fill="none" stroke="#efb136" strokeWidth="6"/><rect x="64" y="73" width="19" height="24" rx="5" fill="#ffe07c"/><circle cx="73" cy="82" r="3" fill="#985b22"/><path d="M73 83V90" stroke="#985b22" strokeWidth="3"/>
    <path d="M29 46Q40 34 63 36M24 82l15 2m64 6 5 1" stroke="#fff3bc" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".85"/>
    {open?<path d="m69 30 5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1Z" fill="#fff2b1" stroke="#f5c54d" strokeWidth="2"/>:null}
  </svg>;
}
