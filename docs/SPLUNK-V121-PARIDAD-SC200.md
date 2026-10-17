# Splunk V1.2.1 · Paridad con la plantilla SC-200

17/10/2026. Continuación del checkpoint, exclusivamente presentación de R01–R03. **Implementación adaptada; equivalencia visual pendiente de observación en Parrot.** No se presenta una matriz de CSS como mediciones DOM ejecutadas.

## Referencia y diagnóstico antes de editar

Se leyeron AGENTS, RETOMAR y SPLUNK-V12-PREMIUM-WORLD completos, así como las implementaciones instaladas `Roadmap`, `Header`, `Chapter`, `RegionMap`, `AdventureMap`, `useAdventureLayout`, paisajes, geometría, tokens y hojas premium. Se inspeccionaron las capturas reales [atlas SC-200 a 1440](../output/playwright/v25-final/full-width/despues-atlas-1440.png), [región SC-200 a 390](../output/playwright/v25-final/world/region-10-390.png) y [R02 V1.1 a 320](../output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z/splunk/mapa-SP-R02-320.png). Esta última es histórica, **no una captura V1.2 ni un antes/después de esta fase**. No se usaron imágenes de Internet.

Diferencias concretas de V1.2 respecto al maestro:

- `.sp-shell` limitaba el conjunto a 1380 px, con 56 px de padding interior. A 2560, el mapa quedaba en unos 1324 px exteriores según CSS, frente a 2496 px en el atlas SC-200. El paisaje ocupaba aproximadamente media pantalla.
- Cabecera Splunk propia: bloque de marca, tipografía, padding, perfil sin avatar/barra y reglas responsive a 1000/600 en lugar de las de SC-200.
- Título y CTA externos grandes, después pestañas, después otra leyenda/barra: tres bandas consumían espacio anterior al atlas. SC-200 integra bienvenida y progreso en el paisaje, precedidos de una sola barra de orientación.
- Atlas con miniaturas de destino en lugar del sistema de botones premium; plataformas 112×96 propias frente a 106×94 del maestro en escritorio. Placas de 174 px, textos de 9–13 px y sombras independientes, frente a estaciones de 210 px y tipografía premium.
- `useWorldLayout/worldLayout` imponían otro encabezado, coordenadas y altura. No medían los paneles del maestro. Cambiaban antes a vertical según ancho de escena, frente a los breakpoints de ventana de SC-200.
- Información secundaria en tres tarjetas distintas al campamento, sin sus mismas proporciones ni sistema de estadísticas.

Estas diferencias explicaban otra aplicación aun compartiendo vectores o colores. El diagnóstico de dimensiones anterior procede del código, pues el navegador actual está bloqueado.

## Adaptación y componentes reutilizados

**Los archivos de presentación y los motores SC-200 no se editaron.** La adaptación se limita a Splunk; dos guardias históricas reciben la conciliación documental explícita descrita abajo.

| Maestro existente, utilizado directamente | Adaptación Splunk |
| --- | --- |
| `adventure-home`, `chapter-page`, `--academy-gutter`, `full-width.css` | El shell de mapa deja de tener máximo y padding propios. Lectores/recursos conservan sus anchos de lectura. |
| `site-header`, `header-inner`, `brand`, `primary-nav`, `profile`, `avatar` | Marca Splunk, tres enlaces reales y nivel/XP provisionales. Selector de academias existente intacto. No se inventa una cuarta función para igualar el número de pestañas. |
| `ProgressBar` | Perfil, teoría y nivel alimentados exclusivamente por `splunkStats`. |
| `atlas-tools`, `atlas-orientation`, `current-position`, `region-navigation`, `map-legend` | Selector de las tres regiones, retorno al nodo del atlas, flechas entre regiones y estados teóricos reales. |
| `map-overlay`, `region-welcome`, `Robot`, `region-meter`, `atlas-progress`, `atlas-stats` | Bienvenida y CTA dentro del paisaje. Atlas con progreso + estadísticas de XP provisional, estudio y bonus; regiones con medidor único, igual que SC-200. |
| **`useAdventureLayout` sin modificar** | Medición real de escena, placas y suelo del overlay con ResizeObserver; mismo grid/serpenteo, expansión por texto y recorrido vertical. |
| `Landscape` | Atlas general, igual que el atlas SC-200 instalado. |
| `PremiumLandscape`, `LandscapeSymbols`, `LandscapeLandmark` | Tres regiones con terreno/relieve/vegetación del renderizador premium. |
| `mapLayout`, `fitMapLabels`, `routeSegment`, `originalMapBridges`, `pilotLandscape`, `PilotBridges` | Coordenadas únicas para paisaje, camino, puentes, estaciones y cofre; geometría de agua apropiada a cada renderizador. |
| `map-station`, `station-action`, `station-platform`, `station-glyph/number/badge/plaque/footer` | Mismo botón elevado, borde, sombra, numeración, escala y placa. Cinco botones en R01; seis en R02; siete en R03. |
| `Treasure`, `map-treasure`, `treasure-lift`, `treasure-caption` | Cofre informativo hacia la bitácora Splunk; pulsarlo no concede premios. |
| `adventure-camp`, `camp-level/rewards/guide`, `camp-badges` | En el atlas, mismas tres superficies auxiliares y responsive. Las regiones conservan el índice plegable del maestro con sus lecciones y recursos independientes. |
| `rememberMapPosition`, `animatePresentation`, CSS de pulsación/hover/foco | Retorno contextual, estados y feedback breve; tiempos 120/150/200 ms y curva existente. |

`SplunkWorldPresentation` recibe geometría a través de una interfaz; su envoltura cliente utiliza el hook SC-200. El render estático de pruebas recibe una geometría inicial del mismo `mapLayout`, sin necesitar globals del navegador. No se introduce otro hook de medición. El helper histórico `worldLayout` se conserva para las regresiones V1.2, pero **ya no participa en el render cliente**; sus tests antiguos no se atribuyen al layout nuevo.

No se emplea `AdventureMap` completo: enlaza directamente a catálogo, estados, prerrequisitos y URLs SC-200. Se reutilizan su hook, componentes puros y clases visuales, manteniendo el adaptador Splunk. La CSS nueva sustituye el dibujo paralelo por correcciones acotadas de colisiones con selectores antiguos y estilos para `passed/progress`. No existe estado `mastered` en los nodos Splunk.

## Temática conservada

R01 mantiene puerto, barcos y muelles discretos sobre su paisaje de islotes. R02 conserva **íntegros los parámetros visuales de su río** y la telemetría, con puentes en cruces calculados; no se usa el río para cambiar la composición. R03 conserva terrazas, vegetación y observatorio. `RegionScene.tsx` y sus miniaturas históricas permanecen intactos; las miniaturas dejan de sustituir a los botones del atlas. No cambian contenido, laboratorios ni prácticas.

Los botones siguen siendo HTML nativo, Enter/Espacio, candados con requisitos y Escape. Los estados se expresan por texto e icono: disponible, bloqueada, en curso y teoría aprobada. Hay anuncios live de cambios, foco visible y retorno a IDs `sp-node-*`. La geometría mide también el texto de requisitos expandido. El teclado cancela feedback de puntero; reduced motion elimina transiciones y transformaciones de interacción. Esta descripción corresponde al código; la comprobación interactiva nueva está pendiente.

## Matriz de comparación

| Aspecto | SC-200 maestro | Splunk V1.2.1 implementado | Evidencia pendiente |
| --- | --- | --- | --- |
| 1. Ancho útil | Gutter panorámico sin máximo | Mismo contenedor/gutter | DOM a los seis anchos |
| 2. Alto visible | Paneles superpuestos al paisaje | Mismo overlay y escala por fila | Alto total/visible y posición del atlas |
| 3. Nodos | 106×94 escritorio; 85×79 intermedio; 86×80 móvil | Mismas clases, sin dibujo propio | Bounding boxes, pseudoelementos y hit targets |
| 4. Densidad | 13 destinos en atlas; 4 columnas/3/vertical | 3 destinos; mismas columnas, tamaño y terreno | Capturas y elementos por superficie |
| 5. Hero | Robot, tarjeta oscura, CTA elevado | Misma estructura dentro del mapa | Anchura/altura, texto y composición |
| 6. Paneles | Atlas: progreso + tres estadísticas/campamento. Región: medidor/índice plegable | Misma distribución con datos Splunk | Rectángulos DOM y legibilidad |
| 7. Márgenes | 8 px móvil; clamp 16–32 escritorio | Mismas reglas, región con 12 px móvil | Coordenadas x/y, safe area |
| 8. Camino | Serpenteo, 4 capas, puentes calculados | Mismo recorrido/helper/grosor y estados | Cruces visibles y continuidad |
| 9. Relieve | Plataforma, borde, glifo y sombras premium | Mismas clases/pseudoelementos | Estilos computados y capturas |
| 10. Responsive | 680/1100 y paneles a 1600 | Mismas reglas y hook | 390/768/1024/1440/1920/2560, además 320 |

**No hay medidas DOM nuevas todavía.** Previsión estática para atlas general (px), útil para detectar un runner que siga mostrando el contenedor anterior:

| Ventana | Mapa exterior V1.2, calculado | Exterior esperado V1.2.1 y SC-200 | Escena interior esperada |
| --- | ---: | ---: | ---: |
| 390 | 366 | 374 | 372 |
| 768 | 712 | 736 | 734 |
| 1024 | 968 | 992 | 990 |
| 1440 | 1324 | 1404 | 1402 |
| 1920 | 1324 | 1872 | 1870 |
| 2560 | 1324 | 2496 | 2494 |

2494/2560 equivale al **97,42 % interior** de la referencia; 2496/2560 al 97,5 % exterior. Son cálculos CSS, **no observaciones del DOM**. En regiones, se preserva el margen de 12 px de SC-200 en móvil.

La longitud total del atlas de tres destinos no se estira artificialmente para simular trece. El tamaño de cada nodo, fila, paisaje visible y panel mantiene la plantilla. El runner registra altura total y visible y compara además regiones SC-200 con **igual número de nodos** (5/6/7), para distinguir longitud educativa de escala gráfica. No se ocultan diferencias de texto, número de pestañas o longitud del recorrido.

## Capturas antes/después y navegador

**Pendientes de producir.** No se generaron capturas sintéticas ni se reutilizaron imágenes antiguas como un resultado nuevo. El respaldo conserva exactamente la aplicación V1.2 para capturar un antes real.

`tests/splunk-v121-parity.mjs` prepara por ancho: SC-200, Splunk, y cada región junto a una SC-200 de igual número de nodos; captura completa y viewport de 1000 px de alto, JSON de dimensiones, matriz Markdown y galería HTML. Con `--before-url` añade el atlas SC-200/Splunk y las tres regiones originales del respaldo. La galería muestra pares de referencias y adaptaciones a igual ancho. Se requiere revisar también las capturas completas y móvil; una aserción de tamaño no demuestra calidad artística.

El runner comprueba overflow, placas dentro de pantalla/sin solapamientos, botones sobre paisaje, separación del overlay, animaciones en movimiento reducido, axe sin relajar `violations=[]`, base/borde/glifo/sombras computados, y retorno de foco por teclado. El orquestador ejecuta después la suite V1.2 intacta de interacción, estados entre pestañas, 18 lecciones, 840 XP, persistencia y regresiones SC-200. Un fallo detiene la aceptación. No están ejecutadas en esta fase.

Restricciones observadas: Vite devuelve `listen EPERM`; Chromium falla con `setsockopt Operation not permitted`/SIGTRAP antes de abrir navegador. [Registro del entorno](../output/splunk-v121/entorno.json). No se usaron sudo, permisos globales ni intentos idénticos repetidos. Las tuberías de procesos hijos también están restringidas: el primer orquestador rechazó el TAP vacío; se corrigió usando descriptores de archivos, sin interpretar un código cero vacío como pruebas aprobadas.

## Respaldo, integridad y estado educativo

Antes de editar se crearon **262 copias verificadas por SHA-256**: [inventario](../output/splunk-v121/respaldo/inventario.json), copias bajo `output/splunk-v121/respaldo/archivos/`. Hash del mapa original: `86480c686bfad3451d388155b5a9fb94b11eb707bbd0c0661939bb9835ed3df4`. La guardia nueva protege 473 archivos previos, incluyendo todos los paquetes editoriales y la evidencia Parrot, además de verificar las copias y conjuntos exactos de contenido.

`RETOMAR.md` ya difería de los inventarios antiguos al comenzar, como advertía el checkpoint: antiguo `8f7a2fd3…` → actual `a26bd328…`. **No se editaron RETOMAR ni los inventarios históricos.** Se reconoce exclusivamente ese par completo de hashes/ruta en `splunk-checkpoint-reconciliation.mjs`. La guardia V1.2 reconoce también los hashes exactos de las dos modificaciones mínimas de guardias necesarias para esa conciliación. Cualquier otro cambio sigue fallando; no hay exclusión genérica de documentación, de scripts ni aceptación automática de nuevos hashes. Hay regresión negativa para el rechazo de otros documentos/contenidos. El guard nuevo conserva además el checkpoint actual como archivo protegido.

SC-200: 13 regiones, 76 lecturas, 719 pasos, 272 actividades. Splunk: 3 regiones, 18 lecciones, 54 actividades, catálogo SHA-256 `6a8241d476580296eb195e0bd00c8752be3e060ca9b31d4b88a382cdddd3aedf`. Motores, hooks de progreso, claves, revisiones, IDs, prerrequisitos, XP y payloads no cambian. Las pruebas offline comprueban almacenes independientes; la verificación multiventana/navegador nueva está preparada, pendiente. No se leyó progreso personal. Sin R04–R11, Splunk real, backend, dependencias nuevas, commits ni publicación.

## Pruebas y accesibilidad

Resultado final ejecutado: **78/78 unitarias PASS, 0 fallos, 0 omitidas; TypeScript y `npm run build` con código 0**. Diagnóstico histórico y guardias antes/después PASS: 400 históricos, 29 adicionales V1.1, 257 V1.2 y 473 V1.2.1 (capas solapadas; no sumarlas). Las 262 copias también se verifican de nuevo. Navegador, medidas DOM y axe posterior: pendientes, sin PASS atribuido.

Ejecución final: [informe y códigos](../output/splunk-v121/validacion/2026-10-16T22-16-48-857Z/ejecucion.json), [78 pruebas](../output/splunk-v121/validacion/2026-10-16T22-16-48-857Z/npm-test.stdout.log), [build](../output/splunk-v121/validacion/2026-10-16T22-16-48-857Z/npm-build.stdout.log), [integridad final](../output/splunk-v121/integridad-final.json). El puntero [ultima-offline.json](../output/splunk-v121/ultima-offline.json): conserva comandos, versiones, hashes, códigos, stdout/stderr, TypeScript, `npm test`, `npm run build` y diagnóstico histórico. Los prehooks exigidos leyeron/reconstruyeron SC-200 con saneado y comprobación de partición; los hashes posteriores deben confirmar derivados idénticos. No se editaron derivados a mano.

El fallo real de V1.1 se conserva: Recursos R03 a 320 tenía contraste de `.language-spl` y un `pre` desplazable sin foco. Chromium sí arrancó en Parrot; **no fue EPERM**. Se mantienen las correcciones V1.2 de color oscuro/texto heredado y `pre` enfocable, su evidencia y todas las aserciones axe. El perfil ahora es un enlace nativo con nombre accesible, avatar y barra; no necesita `aria-label` sobre un `div` sin rol. No se atribuye un nuevo PASS axe a esta fase. Los `incomplete` siguen archivándose y requieren revisión.

Riesgos pendientes: medidas/solapamientos con fuentes reales y zoom, títulos largos, requisitos expandidos, foco detrás de barra sticky, densidad del atlas con tres destinos, continuidad visual de puentes/relieve, tacto, lectores de pantalla y sensación de movimiento. No se afirman FPS/LCP/INP ni conformidad WCAG completa. Revisión educativa humana independiente y práctica real siguen fuera de esta fase.

## Continuación exacta en Parrot OS

No instalar dependencias ni modificar permisos. Terminal A, versión actual:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B, respaldo anterior de solo referencia (no modificar sus archivos):

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node node_modules/vite/bin/vite.js output/splunk-v121/respaldo/archivos --config "$PWD/vite.config.ts" --host 127.0.0.1 --port 5186 --strictPort
```

Terminal C:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/splunk-v121-integrity.mjs
node scripts/validate-splunk-v121.mjs --browser --base-url http://127.0.0.1:5187/ --before-url http://127.0.0.1:5186/
```

Repetición offline solo si se cambia código:

```sh
node scripts/validate-splunk-v121.mjs
```

Consultar `output/splunk-v121/ultima-browser.json`, informe de ejecución y `paridad/resultados.json`, `matriz.md`, `index.html`; después los informes de regresión V1.2 enlazados por stdout. El éxito automático mantiene `visualVerdict` pendiente de revisión humana. Abrir `http://127.0.0.1:5187/#/ruta`, después `#/splunk/ruta` y las tres regiones con perfiles de prueba; no copiar datos sintéticos al perfil personal. Comparar pares a la misma resolución y revisar todos los `incomplete`.

**Parada de esta fase:** presentación alineada en código, pruebas offline e integridad documentadas; comprobación visual/DOM y navegador pendiente del entorno Parrot. No ampliar lecciones ni avanzar R04–R11.
