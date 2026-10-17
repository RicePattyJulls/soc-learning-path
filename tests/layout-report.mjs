import { readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/playwright/v22-full-width');
const json=async file=>JSON.parse(await readFile(file,'utf8'));
const before=await json(path.join(out,'antes-results.json')),after=await json(path.join(out,'despues-results.json'));
if(after.failure)throw new Error(after.failure);
async function preserveResult(source,target) {
  try { await access(path.join(out,target)); }
  catch { await copyFile(path.join(root,source),path.join(out,target)); }
}
await preserveResult('output/playwright/v15-full-results.json','regresion-educativa.json');
await preserveResult('output/playwright/v2-visual-results.json','regresion-visual.json');
await preserveResult('output/playwright/v21-premium/accessibility.json','accessibility.json');
const baseline=await json(path.join(out,'baseline-hashes.json'));
const protectedNames=Object.keys(baseline).filter(n=>n.startsWith('/')||n.startsWith('public/content/')||n.startsWith('src/generated/')||n.startsWith('scripts/')||['src/lib/learning.ts','src/lib/learning-storage.ts','src/lib/useProgress.ts','src/lib/progress.ts','src/education.ts','src/types.ts','docs/CONTENIDO.md','docs/education-coverage.json','docs/content-audit.json','src/components/adventure/Artwork.tsx','src/components/adventure/PilotLandscape.tsx','src/lib/pilot-landscape.ts'].includes(n));
const protectedFiles=await Promise.all(protectedNames.map(async file=>({file,sha256:baseline[file],unchanged:createHash('sha256').update(await readFile(path.isAbsolute(file)?file:path.join(root,file))).digest('hex')===baseline[file]})));
if(protectedFiles.some(f=>!f.unchanged))throw new Error('Cambios inesperados en archivos protegidos');
await writeFile(path.join(out,'integridad.json'),JSON.stringify({date:new Date().toISOString(),allProtectedUnchanged:true,count:protectedFiles.length,protected:protectedFiles},null,2));
const get=(report,width)=>report.geometry.find(x=>x.label==='atlas-'+width);
const rows=[390,768,1024,1440,1920,2560].map(width=>({width,before:get(before,width),after:get(after,width)}));
const table=rows.map(r=>`| ${r.width} | ${r.before.scene.w.toFixed(0)} px · ${r.before.usedPercent.toFixed(1)} % | ${r.after.scene.w.toFixed(0)} px · ${r.after.usedPercent.toFixed(1)} % | ${((r.width-r.after.scene.w)/2).toFixed(0)} px |`).join('\n');
const htmlTable=rows.map(r=>`<tr><th>${r.width} px</th><td>${r.before.usedPercent.toFixed(1)} %</td><td>${r.after.usedPercent.toFixed(1)} %</td><td>${r.after.scene.w.toFixed(0)} px</td></tr>`).join('');
const bundle=async folder=>{
  const html=await readFile(path.join(folder,'index.html'),'utf8');
  const files=[...html.matchAll(/(?:src|href)="((?:\.\/|\/)assets\/[^" ]+\.(?:js|css))"/g)].map(m=>m[1].replace(/^\.?\//,''));
  if(files.length<2)throw new Error('No se han detectado los assets iniciales del build');
  let bytes=0,gzip=0;
  for(const file of files){const data=await readFile(path.join(folder,file));bytes+=data.length;gzip+=gzipSync(data).length;}
  return {files,bytes,gzip};
};
const beforeDistAt=process.argv.indexOf('--before-dist');
const bundleBefore=beforeDistAt>=0?await bundle(process.argv[beforeDistAt+1]):(await json(path.join(out,'bundle.json'))).before;
if(!bundleBefore.files.length||!bundleBefore.bytes)throw new Error('Indica --before-dist para medir la referencia inicial');
const bundleAfter=await bundle(path.join(root,'dist'));
await writeFile(path.join(out,'bundle.json'),JSON.stringify({scope:'JS/CSS referidos directamente por index.html; gzip por archivo. No es medida de carga, FPS ni rendimiento de red.',before:bundleBefore,after:bundleAfter,deltaBytes:bundleAfter.bytes-bundleBefore.bytes,deltaGzip:bundleAfter.gzip-bundleBefore.gzip},null,2));
await writeFile(path.join(out,'ENTREGA.md'),`# SOC Learning Path V2.2 · Layout panorámico

Versión 0.2.2, 16/10/2026. Continuación de V2.1, sin reconstrucción. El arte premium permanece solo en Licencia y onboarding; las otras doce regiones conservan su ilustración.

## Cambios

Atlas/regiones/cabecera sin topes de 1560/1600 px; márgenes de escritorio de 16–32 px y safe areas. Cabecera alineada, bienvenida y progreso de ancho acotado; estadísticas en paralelo en monitores amplios y campamento distribuido. Se conserva el ancho cómodo del lector y las placas.

El viewport SVG se recalcula con el ancho real: nodos, caminos, etiquetas, paisaje y cofre comparten coordenadas. Símbolos de tamaño estable, sin deformación de ejes. Cuatro columnas en escritorio, tres en tableta; recorrido vertical móvil V2.1. Los puentes heredados se ajustan a cruces reales del río sin activar arte premium en otras regiones. Animaciones existentes y movimiento reducido conservados.

## Aprovechamiento medido del atlas

Anchura interior del escenario, incluido el efecto de sus bordes de 1 px. Misma resolución, zoom 100%, Chromium y contextos vacíos para antes/después.

| Navegador | V2.1 | V2.2 | Margen por lado, con borde |
| --- | --- | --- | --- |
${table}

Las seis resoluciones pasan; ${after.geometry.length} controles de geometría comprueban todas las regiones y cambios de tamaño. ViewBox y pantalla usan escala 1:1 en escritorio/tableta. Ningún desbordamiento horizontal, tarjeta superpuesta/recortada, rótulo escapado, colisión con bienvenida ni cofre fuera. Se comprueban coordenadas de caminos/nodos y cruces con el trazo SVG real.

## Evidencia y pruebas ejecutadas

- Abrir [comparativa interactiva](index.html): selector de anchura, deslizador antes/después y originales completos. PNG: [escritorio](comparacion-escritorio.png), [móvil](comparacion-movil.png), [panorámica 2560](despues-atlas-2560.png), [piloto 2560](despues-piloto-2560.png), [móvil 390](despues-piloto-390.png).
- 36 pruebas unitarias, TypeScript estricto y build de producción aprobados: verificacion.log. Incluye una regresión nueva de geometría panorámica. Dos avisos de Vite sobre directivas use client de lucide-react se ignoran al empaquetar; el build termina correctamente.
- 11 grupos educativos: 76 originales/guías y 35 actividades, respuestas incorrectas/correctas, 80%, dominio, XP acotados, desbloqueos, V1 conservado, persistencia tras recarga y exportación real. Casos de almacenamiento corrupto/no disponible aprobados. regresion-educativa.json.
- 10 grupos visuales: 13 regiones y 75 nodos de lectura con apertura/retorno; foco, teclado, dominio visible, estados bloqueados y resize. regresion-visual.json.
- Suite V2.2: 6 tamaños, ${after.geometry.length} controles geométricos, 24 aperturas de lectura/retornos con foco y nodo visible; selector y biblioteca/progreso/repaso a cada anchura. Modos normal/reducido: hover de −4 px frente a ausencia de desplazamiento, teclado operativo y ninguna animación en bucle. despues-results.json.
- Axe-core 4.10.3: 0 violaciones automáticas en 24 vistas a 390/768/1440 px. accessibility.json. No equivale a certificación ni sustituye contraste manual sobre gradientes o lector de pantalla.
- ${protectedFiles.length} archivos protegidos conservan su SHA-256, incluidos SC-200.md, contenido/catálogo/generadores, motores educativos y los tres archivos de arte de V2.1. integridad.json. Se conservan 13 capítulos, 76 lecturas, 719 pasos, 35 actividades y 67 lecturas pendientes, IDs, XP/niveles/recompensas, 80%, estados, LocalStorage y exportación. Sin sistema de progreso paralelo.
- Las pruebas usan contextos temporales; no leen ni modifican el perfil personal. Las comprobaciones finales de copia están en instalacion-verificada.json. Respaldo previo: respaldo-v21.zip.

## Problemas encontrados y límites

Resueltos: límite de ancho en monitores amplios; escalado ligado al ancho anterior; puente heredado colocado aproximadamente sobre tierra. La carpeta definitiva está fuera de la edición directa permitida: se preparó una copia temporal para validar y se instaló mediante copia autorizada. Vite necesitaba dependencias escribibles para su caché; se copiaron las existentes, sin instalar paquetes. Node no puede abrir puertos en este entorno y el CLI de Playwright no pudo descargarse (DNS); se usaron el servidor Python local y playwright-core/Chromium ya instalados.

No se afirma mejora de velocidad ni FPS. Peso inicial JS/CSS medido: ${(bundleBefore.bytes/1024).toFixed(1)} → ${(bundleAfter.bytes/1024).toFixed(1)} KiB; gzip por archivo ${(bundleBefore.gzip/1024).toFixed(1)} → ${(bundleAfter.gzip/1024).toFixed(1)} KiB. Diferencia gzip: ${(bundleAfter.gzip-bundleBefore.gzip).toFixed(0)} bytes. Ver bundle.json; excluye payloads y chunks diferidos. No se midieron aquí tiempos de carga ni fluidez en dispositivo físico.

Pendientes: Safari/Firefox, teléfono físico, lector de pantalla y contraste manual. Las 67 lecturas por enriquecer, importación/restauración y Splunk continúan fuera de esta entrega. Sin commits, publicación, dependencias nuevas, motores 3D ni cambios en otros proyectos.

## Extensión premium propuesta · pendiente de autorización

Reutilizar AdventureMap, navegación, estados/placas, tokens y las piezas de terreno/cruces/vegetación de la piloto mediante defs y configuración común. Variar horizonte, roca/terrazas, paleta secundaria, vegetación y agua por bioma; mantener caminos y estado educativo coherentes. Empezar por dos regiones tras aprobación, revisar y ampliar por grupos. El atlas necesitaría aprobación específica para cambiar su arte.

Coste previsto: una región montada a la vez evita multiplicar por trece el DOM visible; nuevas formas aumentarán bundle y densidad. Mantener memoización/defs compartidos y valorar carga diferida. Comparar bytes, DOM, CLS, tareas largas y carga en tres muestras por versión (CPU 4× móvil), y medir scroll/interacción si se pretende afirmar FPS. La extensión artística no se ha implementado.
`);

const html=`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SOC Learning Path V2.2 · Comparativa</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f1f6ff;color:#17365c;font:16px/1.6 'Trebuchet MS',sans-serif}header{background:#102d54;color:white;padding:24px 3vw}h1,h2,p{margin:0 0 12px}main{padding:24px 3vw}section{margin-bottom:32px}button,select,input{font:inherit;min-height:44px}a{color:#5930a5}header a{color:#dacbff}label{display:inline-flex;align-items:center;gap:12px;margin:0 24px 16px 0}select{padding:8px 12px;background:white;border:1px solid #b1c7dd;border-radius:8px}.slider{display:block;width:100%;accent-color:#7948df}.frame{position:relative;width:100%;aspect-ratio:2560/1080;overflow:hidden;border:1px solid #a8bdce;border-radius:12px;background:#d3e0ef}.frame img{display:block;width:100%;height:100%;object-fit:contain;position:absolute;inset:0}.frame .after{clip-path:inset(0 0 0 var(--split,50%))}.divider{position:absolute;left:var(--split,50%);top:0;bottom:0;border-left:3px solid #7948df;pointer-events:none}.caption{display:flex;justify-content:space-between;margin:8px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:20px;background:white;border:1px solid #d3e0ef;border-radius:16px}.pair img{display:block;width:100%;height:auto;border:1px solid #d3e0ef;border-radius:10px}.pair h3{margin:0 0 12px}#mobile-pair{max-width:840px}.crop{max-height:1300px;overflow:hidden}table{border-collapse:collapse;background:white;width:min(100%,800px);font-variant-numeric:tabular-nums}th,td{text-align:left;padding:10px 16px;border-bottom:1px solid #d3e0ef}.links{display:flex;gap:16px;flex-wrap:wrap}small{display:block}details{margin:16px 0}summary{min-height:44px;cursor:pointer}input:focus-visible,select:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #7948df;outline-offset:4px}@media(max-width:700px){main{padding:16px}label{display:flex}.pair{gap:8px;padding:10px}table{font-size:13px}th,td{padding:8px}}
</style><header><h1>SOC Learning Path V2.2</h1><p>El mismo camino, un horizonte más amplio.</p><a href="ENTREGA.md">Entrega completa</a> · <a href="../../../..">Abrir la academia en este servidor</a><small>Capturas con perfiles temporales; no muestran el progreso personal.</small></header><main>
<section><h2>Antes / después</h2><label>Resolución<select id="width">${[390,768,1024,1440,1920,2560].map(w=>`<option ${w===2560?'selected':''}>${w}</option>`).join('')}</select></label><label>Vista<select id="view"><option value="atlas">Atlas</option><option value="piloto">Licencia y onboarding</option></select></label><label for="split">Comparar: desplaza la división</label><input class="slider" id="split" type="range" min="0" max="100" value="50"><div class="caption"><b>V2.1 · Antes</b><b>V2.2 · Después</b></div><div class="frame" id="frame"><img id="before" alt="Captura anterior V2.1"><img id="after" class="after" alt="Captura panorámica V2.2"><span class="divider"></span></div><p id="metric"></p><div class="links"><a id="before-link">Anterior completa</a><a id="after-link">Nueva completa</a></div></section>
<section><h2>Ancho interior del atlas medido</h2><table><thead><tr><th>Viewport</th><th>Antes</th><th>Después</th><th>Escena V2.2</th></tr></thead><tbody>${htmlTable}</tbody></table><p>Sin desbordamientos ni deformación de ejes; tarjetas acotadas. El recorrido vertical móvil se conserva.</p></section>
<section><h2>Escritorio · 2560 px</h2><div class="pair" id="desktop-pair"><article><h3>Antes · V2.1</h3><img src="antes-atlas-2560-inicio.png" alt="Atlas anterior limitado a 1600 px"></article><article><h3>Después · V2.2</h3><img src="despues-atlas-2560-inicio.png" alt="Atlas panorámico con márgenes de 32 px"></article></div></section>
<section><h2>Móvil · 390 px</h2><div class="pair" id="mobile-pair"><article><h3>Antes · V2.1</h3><div class="crop"><img src="antes-piloto-390.png" alt="Recorrido vertical anterior"></div></article><article><h3>Después · V2.2</h3><div class="crop"><img src="despues-piloto-390.png" alt="Recorrido vertical conservado"></div></article></div><p>La lámina muestra el comienzo. Los enlaces superiores abren las capturas completas.</p></section>
<section><h2>Resultados</h2><p>36 pruebas unitarias · TypeScript/build correctos · ${after.geometry.length} controles de geometría · 11 grupos educativos · 10 grupos visuales · axe: 0 violaciones en 24 vistas.</p><p>Contenido, XP, progreso y arte de las otras doce regiones conservados. La extensión artística espera autorización.</p><div class="links">${['despues-results.json','integridad.json','accessibility.json','regresion-educativa.json','regresion-visual.json','bundle.json'].map(f=>`<a href="${f}">${f}</a>`).join('')}</div></section></main>
<script>const rows=${JSON.stringify(rows.map(r=>({width:r.width,before:r.before.usedPercent,after:r.after.usedPercent})))};const width=document.getElementById('width'),view=document.getElementById('view'),split=document.getElementById('split'),frame=document.getElementById('frame');function update(){const w=Number(width.value),v=view.value;document.getElementById('before').src='antes-'+v+'-'+w+'-inicio.png';document.getElementById('after').src='despues-'+v+'-'+w+'-inicio.png';frame.style.aspectRatio=w+'/'+(w===390?844:1080);document.getElementById('before-link').href='antes-'+v+'-'+w+'.png';document.getElementById('after-link').href='despues-'+v+'-'+w+'.png';const r=rows.find(r=>r.width===w);document.getElementById('metric').textContent=v==='atlas'?'Ancho útil: '+r.before.toFixed(1)+' % → '+r.after.toFixed(1)+' %.':'Paisaje de la piloto; arte conservado y geometría ajustada al ancho.';}width.addEventListener('change',update);view.addEventListener('change',update);split.addEventListener('input',()=>frame.style.setProperty('--split',split.value+'%'));update();</script></html>`;
await writeFile(path.join(out,'index.html'),html);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
  const page=await browser.newPage({viewport:{width:2000,height:1200}});
  await page.goto((process.env.BROWSER_BASE_URL||'http://127.0.0.1:5173/')+'output/playwright/v22-full-width/index.html');
  await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode())));
  await page.locator('#desktop-pair').screenshot({path:path.join(out,'comparacion-escritorio.png')});
  await page.locator('#mobile-pair').screenshot({path:path.join(out,'comparacion-movil.png')});
  await page.locator('#width').selectOption('390');await page.locator('#view').selectOption('piloto');await page.locator('#split').fill('65');
  if(!(await page.locator('#after').getAttribute('src')).includes('piloto-390'))throw new Error('Comparativa no responde');
  console.log('Comparativa interactiva y PNG generados; integridad:',protectedFiles.length,'archivos; delta gzip:',bundleAfter.gzip-bundleBefore.gzip,'bytes.');
} finally {await browser.close();}
