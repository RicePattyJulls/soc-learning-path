import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './splunk-integrity.mjs';
import { PremiumLandscape } from '../src/components/adventure/PremiumLandscape';
import { PilotBridges } from '../src/components/adventure/PilotLandscape';
import { pilotLandscape } from '../src/lib/pilot-landscape';
import { routeSegment } from '../src/lib/adventure';
import { splunkWorlds,worldLayout } from '../src/splunk/world-model';

// Offline vector render, explicitly NOT a browser/UI screenshot. Coordinates,
// terrain and bridges are the same components used by the app; labels here are
// diagnostic markers, not a replacement rendering of interactive HTML buttons.
const relative=process.argv[2]||'output/splunk-v12/previsualizaciones';
if(!/^output\/splunk-v12(?:\/[\w.-]+)*$/.test(relative)||relative.includes('..'))throw new Error('Destino no permitido');
await mkdir(path.join(ROOT,relative),{recursive:true});
for(const [i,theme] of ['harbor','river','forest'].entries()) {
  const layout=worldLayout(i+5,1100,Array(i+5).fill(220));
  const landscape=pilotLandscape(layout,splunkWorlds[theme]);
  const art=renderToStaticMarkup(createElement(PremiumLandscape,{layout,landscape,visual:splunkWorlds[theme]})).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  const svg=art.replace(/<\/svg>$/,renderToStaticMarkup(<g fill="none">{[...layout.points,layout.chest].slice(1).map((p,i)=>{const d=routeSegment(layout.points[i],p);return <g key={i}><path d={d} stroke="#fff0cd" strokeWidth="34"/><path d={d} stroke="#b8ad87" strokeWidth="25"/><path d={d} stroke="#fff8e5" strokeWidth="3" strokeDasharray="5 12"/></g>;})}<PilotBridges bridges={landscape.bridges}/>{layout.points.map((p,i)=><g key={i} transform={`translate(${p.x} ${p.y})`}><ellipse cy="16" rx="48" ry="21" fill="#244d69"/><ellipse cy="7" rx="48" ry="21" fill="#317568" stroke="#fff0cd" strokeWidth="4"/><rect x="-26" y="-49" width="52" height="55" rx="15" fill="#317568" stroke="#b7e5ce" strokeWidth="3"/><text y="-14" textAnchor="middle" fontFamily="DejaVu Sans" fontSize="20" fill="white">{i+1}</text></g>)}<rect x="22" y="23" width="480" height="62" rx="12" fill="#244d69"/><text x="42" y="50" fill="#fff0cd" fontFamily="DejaVu Sans" fontSize="17">{splunkWorlds[theme].name} · previsualización vectorial</text><text x="42" y="72" fill="#fff0cd" fontFamily="DejaVu Sans" fontSize="12">Offline: no es una captura ni una prueba de interacción.</text></g>)+'</svg>');
  await writeFile(path.join(ROOT,relative,theme+'.svg'),svg);
}
console.log(relative);
