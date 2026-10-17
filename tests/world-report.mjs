import assert from 'node:assert/strict';
import { readFile,writeFile,readdir,mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/playwright/v24-premium-world');await mkdir(out,{recursive:true});
if(process.argv.includes('--probe')){
 const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/',browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[],result={base,date:new Date().toISOString(),gallery:false,reportResponsive:false,liveRegion:false,errors};
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1080}});page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text()+' '+e.location().url);});page.on('response',r=>{if(r.status()>=400)console.log('REPORT HTTP',r.status(),r.url());});
  const response=await page.goto(base+'output/playwright/v24-premium-world/index.html');assert.equal(response.status(),200);assert.equal(await page.locator('#desktop-board article').count(),13);
  await page.locator('#region').selectOption('13');await page.locator('#width').selectOption('390');await page.locator('#slider').fill('65');await page.waitForFunction(()=>document.getElementById('after').complete&&document.getElementById('after').naturalWidth>0);assert.ok((await page.locator('#after').getAttribute('src')).includes('scene-13-390'));result.gallery=true;
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));result.reportResponsive=true;
  await page.goto(base+'#/capitulo/capitulo-13-mapa-de-tablas-y-relaciones-kql');await page.locator('[data-region-visual="capitulo-13-mapa-de-tablas-y-relaciones-kql"]').waitFor();assert.equal(await page.locator('.map-legend').count(),1);result.liveRegion=true;assert.deepEqual(errors,[]);
  await writeFile(path.join(out,'installed-report.json'),JSON.stringify(result,null,2));console.log('INSTALLATION gallery controls, mobile report and live region: PASS');
 }finally{await browser.close();}
 process.exit(0);
}
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const load=p=>json(path.join(out,p));
const catalog=await json(path.join(root,'src/generated/catalog.json')),coverage=await json(path.join(root,'docs/education-coverage.json'));
const world=await load('final/world-results.json'),v23=await load('v23/world-results.json'),layout=await load('full-width/despues-results.json'),ux=await load('experience/experience-results.json');
const educational=await load('education/v15-full-results.json'),visual=await load('visual/v2-visual-results.json'),a11y=await load('accessibility/accessibility.json');
const performance=await load('final-performance/performance.json'),performance23=await load('v23-performance/performance.json');
for(const result of [world,v23,layout,ux])assert.equal(result.failure,undefined);
assert.equal(world.geometry.length,84);assert.equal(ux.checks.length,13);assert.equal(a11y.results.length,60);assert.ok(a11y.results.every(r=>!r.violations.length));
const names=new Map([...((await readFile(path.join(root,'src/lib/region-visuals.ts'),'utf8')).matchAll(/region\('([^']+)','([^']+)'/g))].map(m=>[m[1],m[2]]));
const regions=catalog.modules.map((c,i)=>({number:i+1,id:c.id,title:c.title,name:names.get(c.id),landmark:world.scenery.find(s=>s.label===`region-${i+1}-1440`)?.landmark||'pilot',status:'IMPLEMENTADO Y VALIDADO',widths:6,readings:c.lessonIds.length}));
assert.equal(regions.length,13);assert.ok(regions.every(r=>r.name));
await writeFile(path.join(out,'regions.json'),JSON.stringify(regions,null,2));

const baseline=await load('baseline-hashes.json'),hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const educationalFiles=Object.keys(baseline).filter(n=>n.startsWith('/')||n.startsWith('public/content/')||n.startsWith('src/generated/')||n.startsWith('scripts/')||['src/lib/learning.ts','src/lib/learning-storage.ts','src/lib/useProgress.ts','src/lib/progress.ts','src/education.ts','src/types.ts','docs/CONTENIDO.md','docs/education-coverage.json','docs/content-audit.json'].includes(n));
const geometryFiles=['src/lib/adventure.ts','src/components/adventure/useAdventureLayout.ts','src/lib/original-map-geometry.ts'];
const protectedFiles=await Promise.all([...educationalFiles,...geometryFiles].map(async file=>({file,sha256:baseline[file],unchanged:hash(await readFile(path.isAbsolute(file)?file:path.join(root,file)))===baseline[file]})));
assert.ok(protectedFiles.every(f=>f.unchanged),'Contenido o geometría funcional alterados');
const protectedReport={date:new Date().toISOString(),educationalFiles:educationalFiles.length,geometryFiles:geometryFiles.length,allProtectedUnchanged:true,counts:{chapters:catalog.modules.length,readings:catalog.lessons.length,steps:coverage.lessons.reduce((sum,l)=>sum+l.steps,0),activities:coverage.activities,pending:coverage.guidedLessons-coverage.reviewedLessons},protected:protectedFiles};
assert.deepEqual(protectedReport.counts,{chapters:13,readings:76,steps:719,activities:35,pending:67});
await writeFile(path.join(out,'integridad.json'),JSON.stringify(protectedReport,null,2));
const oldPackage=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
async function walk(folder){const entries=await readdir(folder,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(folder,e.name)):e.isFile()?[path.join(folder,e.name)]:[]))).flat();}
const sources=[...(await Promise.all(['src','tests','scripts','docs','public'].map(folder=>walk(path.join(root,folder))))).flat(),...['README.md','package.json','package-lock.json'].map(f=>path.join(root,f))];
const modifications=[];
for(const file of sources){const relative=path.relative(root,file),digest=hash(await readFile(file));if(!baseline[relative]||baseline[relative]!==digest)modifications.push({file:relative,type:baseline[relative]?'modified':'added',sha256:digest});}
await writeFile(path.join(out,'archivos-modificados.json'),JSON.stringify(modifications,null,2));

async function bundle(folder){
 const html=await readFile(path.join(folder,'index.html'),'utf8');
 const files=[...html.matchAll(/(?:src|href)="((?:\.\/|\/)assets\/[^" ]+\.(?:js|css))"/g)].map(m=>m[1].replace(/^\.?\//,''));assert.ok(files.length>=2);
 let bytes=0,gzip=0;for(const file of files){const data=await readFile(path.join(folder,file));bytes+=data.length;gzip+=gzipSync(data).length;}return {files,bytes,gzip};
}
const argument=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
let savedBundle;try{savedBundle=await load('bundle.json');}catch{/* initial report requires local reference builds */}
const beforeBundle=argument('--before-dist')?await bundle(argument('--before-dist')):savedBundle?.before;
const v23Bundle=argument('--v23-dist')?await bundle(argument('--v23-dist')):savedBundle?.v23;
assert.ok(beforeBundle?.bytes&&v23Bundle?.bytes,'Indica --before-dist y --v23-dist para la primera medición');
const finalBundle=await bundle(path.join(root,'dist'));
const bundleReport={scope:'Only JS/CSS referenced directly by index.html, gzip per file; excludes lazy chunks and lesson payloads.',before:beforeBundle,v23:v23Bundle,final:finalBundle,deltaBytes:finalBundle.bytes-beforeBundle.bytes,deltaGzip:finalBundle.gzip-beforeBundle.gzip};
await writeFile(path.join(out,'bundle.json'),JSON.stringify(bundleReport,null,2));
const widthRows=[390,768,1024,1440,1920,2560].map(width=>world.geometry.find(r=>r.label==='atlas-'+width));
const regionTable=regions.map(r=>`| ${r.number} | ${r.title.replace(/^\d+ · /,'')} | ${r.name} | Implementado y validado |`).join('\n');
const performanceRows=performance.summary.filter(r=>r.build==='after').map(after=>({after,before:performance.summary.find(r=>r.build==='before'&&r.width===after.width&&r.region===after.region)}));
const performanceTable=performanceRows.map(({before:b,after:a})=>`| ${a.region||'Atlas'} | ${a.width} | ${b.fcpMedian} → ${a.fcpMedian} | ${b.dom} → ${a.dom} | ${b.longTaskMax} → ${a.longTaskMax} | ${a.clsMax} |`).join('\n');
const domRows=regions.map(r=>{const b=world.geometry.find(g=>g.label===`region-${r.number}-1440`),previous=performance23.summary.find(g=>g.region===r.number&&g.width===1440&&g.build==='before');return {...r,dom:b.dom,svg:b.svg,uses:b.uses,reference:previous?.dom};});
const snapshot={date:new Date().toISOString(),version:oldPackage.version,implemented:{v23:true,v24:true,regions:13},validated:{unit:38,world:84,layout:98,ux:13,educational:educational.results.length,visual:visual.results.length,axeViews:60,axeViolations:0},pending:['Manual screen reader','Safari/Firefox','Physical phone','Manual gradient contrast'],blocked:[],newDependencies:0,regionComplexity:domRows};
await writeFile(path.join(out,'resumen.json'),JSON.stringify(snapshot,null,2));
await writeFile(path.join(out,'ENTREGA.md'),`# SOC Learning Path · V2.3 + V2.4

Versión final **0.2.4**. V2.3 se implementó y validó antes de comenzar V2.4. Se mantiene la aplicación existente, su layout panorámico y su aprendizaje. Sin commits, publicación, backend, autenticación, motores 3D ni nuevas dependencias. **V2.5 fuera de alcance.**

## Estado

- **IMPLEMENTADO:** trece paisajes premium diferenciados y el pulido de navegación, foco, accesibilidad y microinteracciones.
- **VALIDADO:** build de producción con las suites y resoluciones siguientes. La verificación de la instalación definitiva se registra en instalacion-verificada.json e instalado-results.json.
- **PENDIENTE:** lector de pantalla manual, Safari/Firefox, teléfono físico y contraste manual sobre gradientes. Las 67 lecturas por enriquecer, importación de progreso y Splunk permanecen fuera de alcance.
- **BLOQUEADO:** ninguna tarea de V2.3/V2.4.

## Las trece regiones

| # | Capítulo real | Identidad artística | Estado |
| --- | --- | --- | --- |
${regionTable}

Las diferencias incluyen cuatro familias de horizonte, seis relieves, siete tipos de vegetación, doce piezas arquitectónicas y recorridos de agua/configuraciones diferentes. La piloto conserva su dibujo de referencia; las otras doce regiones comparten renderizador, símbolos y piezas configurables, sin copias completas de escenas. El atlas mantiene su ilustración general y recibe la misma navegación/estados. El material artístico no añade contenido educativo.

## Capturas y comparación

Abrir [galería interactiva](index.html), [las trece regiones de escritorio](13-regiones-escritorio.png), [detalles móviles](13-regiones-movil.png) y [comparación V2.2/V2.4](antes-despues-escritorio.png). La galería enlaza los PNG completos de cada región a 390/1440 px y permite comparar cada paisaje con V2.2.

before/ contiene las capturas V2.2 tomadas durante esta ejecución. v23/ conserva el punto aprobado por las pruebas antes de V2.4. final/ contiene las capturas de la versión final; sus archivos region-* muestran la página completa con navegación real. scene-* son detalles del paisaje: se oculta temporalmente la barra persistente solo al capturar ese recorte para que no tape la ilustración; no cambia la aplicación. La comparación usa el mismo encuadre en ambas versiones.

Las capturas de desbloqueo/cofre de experience/ usan un fixture histórico aislado de 200→310 XP y nivel 2. **No muestran ni modifican el progreso personal.**

## Navegación, animaciones y accesibilidad

- Selector y leyenda disponibles durante scroll, opciones con disponibilidad real, anterior/siguiente y acción repetible Tu posición.
- Atrás del navegador y retorno explícito restauran el nodo/foco mediante el parámetro nodo existente; sin progreso paralelo. Teclado, Ctrl/Cmd-clic y contextos táctiles conservados.
- Retorno al mapa disponible durante la lectura; foco visible de pasos/feedback, sin saltos innecesarios ni robo del foco de respuestas. Aviso bloqueado con requisitos, Escape y devolución del foco.
- Pulsación/liberación 120 ms; feedback 150 ms; entrada/regreso/desbloqueo/cofre 200 ms. Transform/opacity, misma curva/tokens. Sin bucles ni bloqueo de interacción. Se cancelan las animaciones al navegar, usar teclado o cambiar a movimiento reducido. No hay celebración repetida al revisitar un cofre ganado.
- Nuevos XP/niveles y estados se observan desde los cálculos existentes; los efectos no conceden premios. Estados reconocibles por icono/texto además de color. Caminos bloqueados/completados diferenciados. Los lectores comparten un acento discreto del bioma; el texto mantiene su ancho cómodo.

## Pruebas ejecutadas

| Comprobación | Resultado |
| --- | --- |
| Unitarias | 38 aprobadas: 36 existentes y 2 nuevas de biomas/geometría |
| TypeScript / build | Correctos; v24-build.log es la última compilación |
| V2.3 antes de V2.4 | 84 escenarios y 13 aperturas/retornos aprobados |
| Mundo final | 84 escenarios: atlas + 13 regiones a 390/768/1024/1440/1920/2560 px |
| Layout | 98 controles: seis anchuras, 320 px, breakpoints, resize, nodos/cofre/caminos y movimiento reducido |
| UX | 13 grupos: historial, selector a 3 anchuras, teclado/Escape, pulsación/reducido, feedback y recompensas reales sincronizadas |
| Educación | 11 grupos; 76 originales/guías, 35 actividades, 80%, dominio, XP acotados, desbloqueos, V1, persistencia, exportación y datos corruptos/no disponibles |
| Visual heredada | 10 grupos; 75 lecturas de los 13 capítulos con apertura/retorno y foco |
| Axe-core 4.10.3 | 0 violaciones automáticas en 60 vistas a 390/768/1440 px, incluidas las 13 regiones |

Sin desbordamientos, solapamientos indebidos, etiquetas/cofre fuera de escena, decoraciones que intercepten clics, puentes fuera del agua/camino ni errores nuevos de página/consola en las suites. Sin peticiones externas. Axe no es una certificación de accesibilidad; se añaden pruebas reales de teclado/foco y quedan las revisiones manuales señaladas.

Ancho interior del atlas: ${widthRows.map(r=>r.width+' px: '+r.usedPercent.toFixed(1)+' %').join('; ')}. Escala SVG 1:1 en escritorio/tableta; el móvil conserva su viewport vertical V2.2. La geometría funcional de nodos/caminos/etiquetas no se sustituye.

## Rendimiento medido

Se comparan V2.2/V2.3 y V2.2/V2.4 en dos tandas de 72 muestras cada una: tres muestras alternadas por vista/anchura, Chromium con contextos nuevos, localhost, CPU 4× a 390 px y 1× en escritorio, sin otras suites de navegador simultáneas. Cachés del sistema no controladas. Los valores describen esta prueba local, no un teléfono físico ni FPS.

JS/CSS inicial referenciado por index.html (sin chunks diferidos ni payloads): V2.2 ${(beforeBundle.bytes/1024).toFixed(1)} KiB / ${(beforeBundle.gzip/1024).toFixed(1)} KiB gzip; V2.3 ${(v23Bundle.bytes/1024).toFixed(1)} / ${(v23Bundle.gzip/1024).toFixed(1)}; V2.4 ${(finalBundle.bytes/1024).toFixed(1)} / ${(finalBundle.gzip/1024).toFixed(1)}. Incremento final: **${(bundleReport.deltaGzip/1024).toFixed(1)} KiB gzip**, sin dependencias nuevas. bundle.json registra archivos y bytes exactos.

FCP: mediana; tarea larga y CLS: máximo de tres muestras. Región 0 significa atlas.

| Región | Viewport | FCP ms V2.2→V2.4 | DOM V2.2→V2.4 | Tarea larga máx. ms | CLS V2.4 |
| --- | --- | --- | --- | --- | --- |
${performanceTable}

Las regiones usan menos decoración repetida y más piezas/relieve propias; resumen.json contiene la complejidad de las trece escenas a 1440 px. El atlas conserva su densidad anterior y añade controles de orientación. Persisten tareas largas de carga inicial: no se presentan como resueltas. No se declara mejora de FPS ni fluidez de hardware real.

## Conservación y archivos

${educationalFiles.length} archivos educativos y ${geometryFiles.length} archivos de geometría funcional mantienen su SHA-256. Conservados SC-200.md, **13 capítulos, 76 lecturas, 719 pasos, 35 actividades y 67 lecturas pendientes**, IDs/revisiones, 80%, XP/niveles/recompensas, completado/dominado, prerrequisitos, LocalStorage V1/V2, exportación, repaso y estructura reservada para Splunk. No hay cambio de esquema ni migración nueva. integridad.json contiene el detalle.

Archivos modificados/añadidos: archivos-modificados.json. Los cambios principales están en region-visuals.ts, PremiumLandscape/LandscapeSymbols/LandscapeLandmark, AdventureMap/RegionMap/RegionNavigation/MapLegend, presentation/usePresentationMotion, Header/Roadmap y los tres lectores/cuestionarios para foco/presentación; world.css y experience.css. El contenido de preguntas/respuestas/explicaciones procede de los mismos payloads intactos. README, RETOMAR y los documentos V2.3/V2.4 quedan actualizados.

Respaldo local previo: respaldo-v22.zip, sin secretos ni datos del navegador. v23-build-validado.zip conserva el build intermedio. El proyecto definitivo contiene código/build/evidencias sin requerir /tmp.

## Problemas encontrados y corregidos

Se completó la extensión pendiente de las doce regiones; se corrigieron el contexto de Atrás nativo, foco tardío del lector/feedback, acceso a controles durante scroll y especificidad de la pulsación con movimiento reducido. Los efectos usan cambios reales y no repiten recompensas al revisitar. El fixture con finalizaciones V1 en la región siguiente se comprueba como En curso al desbloquearse, conservando esas finalizaciones.

El entorno limita la edición directa de la carpeta definitiva y el bind de Node. Se trabajó en una copia temporal, se sirvieron builds con Python y se instaló mediante copia autorizada. Se reutilizaron Playwright Core/Chromium ya instalados; el CLI sin caché/red no es un bloqueo de las pruebas. No quedan fallos funcionales confirmados de V2.3/V2.4; las limitaciones manuales figuran como pendientes.

## Abrir

Usar **http://127.0.0.1:5173/** en el mismo navegador/perfil. Si ya está la instancia del proyecto, reutilizarla. Si no:

~~~sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev
# Alternativa de producción:
python3 -m http.server 5173 --bind 127.0.0.1 --directory dist
~~~

No usar file:// ni otro origen para recuperar el progreso personal. Instrucciones de comprobación futura: docs/V2.4-PREMIUM-EXPERIENCE.md. No repetir suites aprobadas sin cambios o incidencia.
`);

const regionRows=regions.map(r=>`<tr><th>${r.number}</th><td>${r.title.replace(/^\d+ · /,'')}</td><td>${r.name}</td><td>Implementado y validado</td><td><a href="final/region-${r.number}-1440.png">Escritorio</a> · <a href="final/region-${r.number}-390.png">Móvil</a></td></tr>`).join('');
const cards=(width)=>regions.map(r=>`<article><a href="final/region-${r.number}-${width}.png"><div class="picture ${width===390?'mobile':''}"><img src="final/scene-${r.number}-${width}.png" alt="${r.name}, paisaje a ${width} píxeles" loading="lazy"></div><h3>${r.number}. ${r.name}</h3><p>${r.title.replace(/^\d+ · /,'')}</p></a></article>`).join('');
const html=`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOC Learning Path V2.4 · Trece mundos</title><link rel="icon" href="data:,"><style>*{box-sizing:border-box}body{margin:0;background:#f1f6ff;color:#17365c;font:16px/1.6 'Trebuchet MS',sans-serif}header{padding:28px 3vw;background:#102d54;color:white}header a{color:#d6c7ff}h1,h2,h3,p{margin:0 0 12px}main{padding:24px 3vw}section{margin-bottom:38px}a{color:#57338f;text-underline-offset:3px}label{display:inline-flex;gap:10px;align-items:center;margin:0 20px 14px 0}select,input{font:inherit;min-height:44px}select{padding:8px 12px;border:1px solid #aec3d5;background:white;color:#17365c;border-radius:9px;max-width:100%}.board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.board article{min-width:0;border:1px solid #cddde9;border-bottom:4px solid #bdcfdc;background:white;border-radius:16px;overflow:hidden}.board a{display:block;text-decoration:none}.picture{aspect-ratio:1.45;overflow:hidden;background:#b4d4d1}.picture img{display:block;width:100%;height:auto}.picture.mobile img{margin-top:-100%}.board h3{font-size:17px;padding:14px 15px 0;margin:0}.board p{font-size:13px;padding:6px 15px 14px;margin:0;color:#425d79}.compare{position:relative;overflow:hidden;border:1px solid #a9bfcf;border-radius:15px;height:clamp(500px,56vw,1000px);background:#cce1e7}.compare img{position:absolute;inset:0;width:100%;height:auto}.compare .after{clip-path:inset(0 0 0 var(--split,50%))}.divider{position:absolute;left:var(--split,50%);top:0;bottom:0;border-left:3px solid #7948df}.labels{display:flex;justify-content:space-between;margin:8px 0}#slider{width:100%;accent-color:#7948df}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:18px;background:white;border:1px solid #d3e0ef;border-radius:16px}.pair img{display:block;width:100%;height:auto}.pair .crop{max-height:1050px;overflow:hidden}.pair h3{font-size:20px}.table-scroll{overflow:auto}table{border-collapse:collapse;background:white;font-variant-numeric:tabular-nums;min-width:600px;width:100%}th,td{text-align:left;padding:10px 13px;border-bottom:1px solid #d3e0ef;font-size:14px}table a{white-space:nowrap}.links{display:flex;flex-wrap:wrap;gap:10px 20px}.status{display:flex;flex-wrap:wrap;gap:10px 24px;padding:14px 18px;background:white;border:1px solid #d3e0ef;border-radius:12px}.note{color:#425d79;font-size:14px}a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #7948df;outline-offset:4px}@media(max-width:1000px){.board{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){main{padding:16px}.board{grid-template-columns:1fr}.pair{gap:8px;padding:8px}.pair h3{font-size:14px}label{display:flex;flex-wrap:wrap}select{width:100%}.compare{height:750px}.status{display:block}.status span{display:block}}</style>
<header><h1>SOC Learning Path · Trece mundos</h1><p>V2.3 construye el mundo. V2.4 acompaña cada paso.</p><div class="links"><a href="/#/ruta">Abrir la academia</a><a href="ENTREGA.md">Entrega completa</a><a href="archivos-modificados.json">Archivos modificados</a></div></header><main>
<section><div class="status"><span><b>Implementado:</b> 13 regiones + UX</span><span><b>Validado:</b> seis resoluciones</span><span><b>Pendiente:</b> revisión manual externa</span><span><b>Bloqueado:</b> nada</span></div><p class="note">Contextos de prueba aislados. Las capturas no muestran el progreso personal. Los detalles de paisaje ocultan solo en la captura la barra sticky; los enlaces abren páginas completas con toda su navegación.</p></section>
<section><h2>Las 13 regiones · Escritorio</h2><div class="board" id="desktop-board">${cards(1440)}</div></section>
<section><h2>Las 13 regiones · Detalles móviles</h2><div class="board" id="mobile-board">${cards(390)}</div><p class="note">Recorte próximo al primer nodo; pulsa para abrir la captura móvil completa de 390 px.</p></section>
<section><h2>V2.2 / V2.4 · Compara el paisaje</h2><label>Región<select id="region">${regions.map(r=>`<option value="${r.number}" ${r.number===3?'selected':''}>${r.number}. ${r.name}</option>`).join('')}</select></label><label>Resolución<select id="width"><option selected>1440</option><option>390</option></select></label><label for="slider">Mueve la división</label><input id="slider" type="range" min="0" max="100" value="50"><div class="labels"><b>V2.2 · Antes</b><b>V2.4 · Después</b></div><div class="compare" id="compare"><img id="before" alt="Paisaje anterior V2.2"><img id="after" class="after" alt="Paisaje premium V2.4"><span class="divider"></span></div><div class="links"><a id="old-full">Página anterior completa</a><a id="new-full">Página nueva completa</a><a id="live">Abrir esta región</a></div></section>
<section><h2>Ejemplo de escritorio · Workloads</h2><div class="pair" id="desktop-pair"><article><h3>Antes · V2.2</h3><div class="crop"><img src="before/scene-3-1440.png" alt="Cordillera anterior"></div></article><article><h3>Después · V2.4</h3><div class="crop"><img src="final/scene-3-1440.png" alt="Bastión de cristal"></div></article></div></section>
<section><h2>Ejemplo móvil · Detección y alertas</h2><div class="pair" id="mobile-pair"><article><h3>Antes · V2.2</h3><div class="crop"><img src="before/region-7-390.png" alt="Región móvil anterior"></div></article><article><h3>Después · V2.4</h3><div class="crop"><img src="final/region-7-390.png" alt="Cañón de las señales con selector y leyenda"></div></article></div></section>
<section><h2>Estado de las regiones</h2><div class="table-scroll"><table><thead><tr><th>#</th><th>Capítulo</th><th>Paisaje</th><th>Estado</th><th>Capturas completas</th></tr></thead><tbody>${regionRows}</tbody></table></div></section>
<section><h2>Validación y medidas</h2><p>38 unitarias · TypeScript/build correctos · 84 escenarios del mundo · 98 controles de layout · 13 grupos UX · 11 educativos · 10 visuales · Axe: 0 violaciones en 60 vistas.</p><p>94 archivos educativos y tres de geometría funcional intactos; 13 capítulos, 76 lecturas, 719 pasos y 35 actividades conservados. Mismos XP, 80%, progreso y LocalStorage.</p><p>JS/CSS inicial: +${(bundleReport.deltaGzip/1024).toFixed(1)} KiB gzip respecto a V2.2. 72 muestras por comparación; CLS 0 en la tanda final. Las regiones reducen decoración repetida; persisten tareas largas iniciales. Sin afirmación de FPS o teléfono físico.</p><div class="links">${['integridad.json','resumen.json','bundle.json','final/world-results.json','full-width/despues-results.json','experience/experience-results.json','education/v15-full-results.json','accessibility/accessibility.json','final-performance/performance.json','v23-performance/performance.json'].map(f=>`<a href="${f}">${f}</a>`).join('')}</div></section></main>
<script>const regions=${JSON.stringify(regions)};const region=document.getElementById('region'),width=document.getElementById('width'),slider=document.getElementById('slider'),compare=document.getElementById('compare');function update(){const n=region.value,w=width.value;document.getElementById('before').src='before/scene-'+n+'-'+w+'.png';document.getElementById('after').src='final/scene-'+n+'-'+w+'.png';document.getElementById('old-full').href='before/region-'+n+'-'+w+'.png';document.getElementById('new-full').href='final/region-'+n+'-'+w+'.png';document.getElementById('live').href='/#/capitulo/'+encodeURIComponent(regions.find(r=>r.number===Number(n)).id);}region.addEventListener('change',update);width.addEventListener('change',update);slider.addEventListener('input',()=>compare.style.setProperty('--split',slider.value+'%'));update();</script></html>`;
await writeFile(path.join(out,'index.html'),html);

// These are artifact captures, separate from all runtime performance samples.
const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/';
const reportBase=argument('--report-url')||base;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 for(const width of [390,1440]){
  const c=await browser.newContext({viewport:{width,height:1080},isMobile:width===390,hasTouch:width===390}),p=await c.newPage();
  for(const r of regions){await p.goto(base+'#/capitulo/'+encodeURIComponent(r.id));await p.locator('.adventure-map').waitFor();await p.waitForTimeout(260);const style=await p.addStyleTag({content:'.region-navigation,.atlas-tools{visibility:hidden!important}'});await p.locator('.adventure-map').screenshot({path:path.join(out,`final/scene-${r.number}-${width}.png`)});await style.evaluate(n=>n.remove());}
  await c.close();
 }
 const page=await browser.newPage({viewport:{width:1880,height:1200}});
 await page.goto(reportBase+'output/playwright/v24-premium-world/index.html');
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode()));});
 await page.locator('#desktop-board').screenshot({path:path.join(out,'13-regiones-escritorio.png')});
 await page.locator('#mobile-board').screenshot({path:path.join(out,'13-regiones-movil.png')});
 await page.locator('#desktop-pair').screenshot({path:path.join(out,'antes-despues-escritorio.png')});
 await page.locator('#mobile-pair').screenshot({path:path.join(out,'antes-despues-movil.png')});
 await page.locator('#region').selectOption('13');await page.locator('#width').selectOption('390');await page.locator('#slider').fill('65');assert.ok((await page.locator('#after').getAttribute('src')).includes('scene-13-390'));
 await writeFile(path.join(out,'artifact-captures.json'),JSON.stringify({date:new Date().toISOString(),regionDetails:26,fullScreenshotsPreserved:true,sceneCapture:'Only the persistent toolbar is temporarily hidden in scene-* detail captures; normal region-* screenshots include the complete UI.',reportControlsTested:true},null,2));
 console.log('REPORT',regions.length,'regiones;',protectedFiles.length,'archivos protegidos;',modifications.length,'archivos modificados/añadidos; delta gzip',bundleReport.deltaGzip,'bytes.');
}finally{await browser.close();}
