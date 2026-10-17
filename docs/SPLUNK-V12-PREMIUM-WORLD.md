# Splunk V1.2 — Premium World

Fecha: 16/10/2026. Alcance: presentación de R01–R03 y corrección de los defectos de accesibilidad demostrados en V1.1. **Tres regiones, 18 lecciones, 54 actividades; R04–R11 no incorporadas.**

## Dictamen

**IMPLEMENTADO:** atlas panorámico con tres destinos, paisajes premium reutilizables, caminos curvos y puentes calculados, nodos HTML volumétricos, candados consultables, cofres informativos, estados y microinteracciones breves. Puerto conserva su identidad; Río conserva el río como protagonista; Bosque incorpora relieve, árboles en capas y observatorio. No se reconstruyó la academia ni se cambiaron reglas educativas.

**CORREGIDO EN CÓDIGO:** contraste del SPL en Recursos R03 y acceso por teclado al bloque desplazable. El `aria-label` del perfil Splunk tiene ahora `role="group"`, atendiendo el incomplete concreto registrado. No se relajaron las aserciones axe.

**VALIDADO OFFLINE:** 75/75 unitarias, TypeScript, compilación, cinco paquetes y 47 regresiones editoriales seleccionadas. Guardias históricas y V1.1 pasan; la guardia V1.2 conserva 257 archivos/metadatos de referencia. Las 251 copias del respaldo son verificables por SHA-256.

**PENDIENTE:** repetición axe en navegador tras la corrección, capturas V1.2, interacción/responsive real y comparación visual final con SC-200. Chromium y Vite están bloqueados en el entorno del agente, no en el Parrot del usuario. No se declara aprobado visualmente el resultado ni cerrada la regresión de navegador.

## 1. Diagnóstico exacto de la ejecución Parrot V1.1

Evidencia original, conservada sin modificaciones:

- [ejecucion.json](../output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z/ejecucion.json).
- [resultados Splunk](../output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z/splunk/resultados.json).
- [stdout](../output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z/splunk-browser.stdout.log) y [stderr](../output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z/splunk-browser.stderr.log).

El proceso `splunk-browser` devolvió **exitCode 1**, sin señal, tras **27.327 ms**. Chromium **148.0.7778.178 sí se ejecutó**. El JSON declara `status:failed`, no `blocked_browser_launch`; stdout informa tres comprobaciones completadas. La excepción procede de `tests/splunk-r01-r03-browser.mjs:161`, al comparar las violaciones axe con un array vacío:

| Vista | Regla axe | Objetivo |
| --- | --- | --- |
| recursos-spl, 320 px | `color-contrast`, serious | `.language-spl` |
| recursos-spl, 320 px | `scrollable-region-focusable`, serious | `.markdown > pre` |

**Clasificación: defectos reales de presentación/accesibilidad, no EPERM, timeout, datos de prueba incorrectos ni aserción que deba eliminarse.** `errors:[]` y `external:[]` indican ausencia de errores JavaScript/peticiones externas registradas en ese recorrido; no invalidan el fallo axe.

Antes del fallo se completaron tres grupos:

1. SC-200 con legacy sintético: 3200 XP, mapa histórico y carga Splunk diferida.
2. L01: estudio/resumen, formativa 0 XP, 1/2 fallido, reintento 2/2, soluciones ocultas y máximo 30 XP.
3. Las 18 lecciones: 840 XP provisionales/nivel 4, bonus únicos, recarga, historial/exportación, Atrás/Adelante/Escape/foco según el runner, retorno SC-200 conservado.

Hay nueve registros responsive aprobados a 320 px y diez comprobaciones axe: nueve sin violaciones y la décima fallida. **No se aprobaron el resto de anchuras, la matriz posterior, ni las suites SC-200 dependientes**, que el orquestador no llegó a ejecutar. Se inspeccionó la captura R02 recibida y las referencias premium SC-200; las capturas V1.1 no muestran el diseño V1.2.

### Causa y corrección mínima

En `splunk.css`, `.sp-resources pre` cambiaba el fondo a claro `#edf3f2`, mientras el código Markdown conservaba texto claro `#e0e9f7`. La combinación incumplía contraste. Además, el `<pre>` generado por Markdown podía desbordarse horizontalmente a 320 px sin ser enfocable.

- `src/splunk/splunk.css`: regla acotada a `.splunk-academy .sp-resources .splunk-markdown pre`, fondo `#172d4e` / texto `#e0e9f7`; el `<code>` hereda color con fondo transparente.
- `src/splunk/SplunkMarkdown.tsx`: `<pre tabIndex={0} role="region" aria-label="Código ilustrativo, desplazamiento horizontal con teclado">`.
- `src/splunk/SplunkApp.tsx`: perfil con `role="group"`, sin cambiar su texto/XP ni el cálculo de estadísticas.

Dos pruebas nuevas reproducen la combinación de colores anterior como contraejemplo, calculan contraste ≥4,5 para la nueva y verifican el HTML enfocable sin alterar su código educativo. Las 28 regresiones Splunk previas pasaron antes de continuar el trabajo visual. Esto respalda la corrección implementada, **no equivale al PASS axe posterior**, aún pendiente.

El diagnóstico reproducible se archiva como `diagnostico-v11.json` en cada corrida offline V1.2, con hashes de los cuatro registros originales, clasificación y alcance parcial.

## 2. Respaldo y protección total

Antes de editar archivos preexistentes: [inventario del respaldo](../output/splunk-v12/respaldo/inventario.json), **251 copias verificadas**, bajo `output/splunk-v12/respaldo/archivos/`. Huella del mapa de copias: `9474abf9c147a0207bcfdc764b3dde6d5d121181b1917411e5b5457561263c57`. Solo código/configuración/pruebas/documentación/derivados saneados; sin perfiles, LocalStorage, secretos o archivos de entorno.

| Guardia / invariante | Resultado |
| --- | --- |
| Histórica | 400 archivos sin discrepancias; SC-200 13/76/719/272 conservado |
| V1.1 | 29 comprobaciones adicionales y cinco metadatos R01 idénticos |
| V1.2 | 257 archivos protegidos iguales; conjuntos exactos `public/splunk-content/` y `src/generated/splunk/` |
| Splunk | Catálogo completo, 18 payloads, tres recursos, IDs/opciones/revisiones/prerrequisitos idénticos |
| Catálogo Splunk SHA-256 | `6a8241d476580296eb195e0bd00c8752be3e060ca9b31d4b88a382cdddd3aedf` |
| SC-200 fuente | `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89` |
| Currículo | `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933` |
| Progreso, XP y desbloqueos | Motores/hooks/datos originales intactos; no migración ni cambio de clave/esquema |

Las capas se solapan: no se suman como archivos distintos. La guardia V1.2 comprueba también que no aparezcan archivos adicionales de contenido. Ante discrepancia falla y detiene aceptación. Las evidencias originales de Parrot quedan protegidas; no se cambió su JSON para aparentar éxito.

La reverificación final de las 251 copias, cuatro archivos de aplicación modificados e invariantes está registrada en [cierre.json](../output/splunk-v12/cierre.json), con código de salida 0 del diagnóstico de solo lectura.

Solo cuatro archivos preexistentes de la aplicación cambiaron: `SplunkMap.tsx`, `SplunkMarkdown.tsx`, `SplunkApp.tsx` y `splunk.css`. Lo demás son componentes/modelo/CSS/herramientas/pruebas/documento nuevos. No se editaron los tests anteriores, generadores, manifiestos, currículo ni paquetes. `RegionScene.tsx` se conserva, incluida la miniatura del río que gustó al usuario.

La suite unitaria existente prueba la generación determinista; sus escrituras de contenido idéntico se omiten. La fase visual no modifica el importador ni requiere regenerar contenido. No se ejecutaron predev/pretest/prebuild, servicios Splunk, ataques, contenedores, commits o publicación; no se consultó progreso personal.

## 3. Referencia premium SC-200 y reutilización

Referencias reales inspeccionadas: [atlas SC-200 1440](../output/playwright/v25-final/full-width/despues-atlas-1440.png), [bosque SC-200 390](../output/playwright/v25-final/world/region-10-390.png), y [Río V1.1 320](../output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z/splunk/mapa-SP-R02-320.png).

Se revisaron RegionMap/AdventureMap, PremiumLandscape, símbolos/landmarks, geometría, puentes, Treasure y estilos/tokens de estaciones, caminos y movimiento. La diferencia principal del diseño anterior: el paisaje era una ilustración de cabecera y las lecciones una lista de tarjetas. Ahora el paisaje contiene el recorrido y sus estaciones.

| Reutilizado sin modificar SC-200 | Uso Splunk |
| --- | --- |
| `PremiumLandscape` | Capas de horizonte, terreno, islas/terrazas, relieve y vegetación; paletas/configuración Splunk propias |
| `LandscapeSymbols`, `LandscapeLandmark` | Árboles/rocas/arquitectura; estaciones de ingesta y observatorio |
| `mapLayout`, `fitMapLabels`, `routeSegment` | Coordenadas compartidas, serpenteo y espacio para placas |
| `pilotLandscape`, `PilotBridges` | Detección geométrica de cruces reales río/camino y puentes en esos cruces |
| `Treasure` | Cofre enlazado a la bitácora Splunk, sin conceder recompensas al pulsarlo |
| `animatePresentation`, `rememberMapPosition` | Feedback/foco/contexto, sin acciones educativas ni almacenamiento |

No se reutiliza AdventureMap completo: enlaza al catálogo, progreso y URLs SC-200. `PremiumWorld` conserva una frontera de datos Splunk propia y solo utiliza piezas visuales/helpers puros.

La skill frontend-design orientó la sustitución de tarjetas principales por estaciones sobre paisaje y la conservación de la identidad del río. React guio la carga diferida, memoización de geometría y medición con ResizeObserver. Las skills animate/motion-design limitaron las microinteracciones: propósito de feedback/estado, CSS/WAAPI, tokens existentes y sin dependencias ni bucles.

## 4. Mundo visual implementado

### R01 — Puerto de Splunk

Horizonte portuario, islotes con caras laterales, agua azul, instalaciones de entrada, barcos y muelles. Las cinco lecciones ocupan estaciones volumétricas sobre el camino; los enlaces sobre agua usan puentes/muelles. La ilustración portuaria existente se conserva en el destino del atlas.

### R02 — Río de Telemetría

Se conservan el azul del agua, los verdes del valle, el acento dorado y la miniatura original del río. El cauce recorre ahora todo el paisaje. El sendero sinuoso cruza el agua mediante puentes calculados, con árboles, rocas, relieve e instalaciones de telemetría. Las seis estaciones comparten las coordenadas de ese camino; los controles están por encima de las capas decorativas, que no reciben eventos de puntero.

### R03 — Bosque SPL

Horizonte de copas, vegetación en capas, terrazas, arroyo, caminos curvos, puentes, rocas y observatorio. Siete estaciones con icono de exploración. Paleta más profunda, sin convertirlo en un paisaje Azure ni modificar sus fuentes educativas.

### Atlas y nodos

El atlas distribuye tres destinos sobre un paisaje panorámico en escritorio; en móvil se vuelve un recorrido vertical. No presenta 18 tarjetas grandes como mapa. Cada región se explora desde su miniatura/estación; las lecciones se representan mediante discos elevados y placas auxiliares compactas.

- **Botones HTML reales** para las 18 estaciones. Activación nativa con Enter/Espacio; navegación a las mismas URLs de lección, con retorno/foco al ID estable del nodo.
- Candado pulsable: despliega requisitos por ID mediante `aria-expanded`/`aria-controls`, sin desbloquear ni conceder XP. Escape lo cierra conservando foco.
- Disponible, en curso, bloqueada y teoría aprobada tienen texto y distintivos, no solo color. No existe estado visual de dominio práctico inventado.
- Discos elípticos, base sombreada, glifo elevado, borde, numeración y medallón; placas de fondo sólido y títulos legibles.
- El cofre solo consulta la bitácora: el bonus sigue dependiendo del motor original. Texto explícito de provisionalidad y práctica no evaluada.
- Medición de placas y expansión del recorrido para textos largos/requisitos, con geometría única para terreno/camino/nodos.

## 5. Movimiento y rendimiento

Se reutilizan `--motion-press:120ms`, `--motion-feedback:150ms`, `--motion-region:200ms` y la curva fuerte existente. Pulsación con traslación breve y escala 0,97; hover solo en puntero fino. Feedback de estado/retorno mediante helper existente, limitado a puntero y a una ejecución. Teclado y `prefers-reduced-motion` suprimen movimiento. No hay animaciones infinitas, motor 3D, nuevas dependencias ni ejecución de SPL.

Los listeners de intención de entrada se montan únicamente en Splunk y se limpian al salir. Solo actualizan un atributo de presentación, nunca LocalStorage. Cambiar de academia/pulsar nodos no modifica las reglas de XP.

Medidas de compilación local final, **no benchmark interactivo**:

| Artefacto | V1.1 | V1.2 |
| --- | ---: | ---: |
| JS/CSS inicial bruto | 487.271 B | 487.464 B |
| Gzip inicial calculado | 145.513 B | 145.563 B |
| Chunk Splunk JS diferido | 54.644 B | 61.732 B |
| CSS Splunk diferido | 14.640 B | 23.465 B |

Incremento inicial: +193 B brutos / +50 B gzip. El CSS inicial compilado incorpora utilidades detectadas en fuentes nuevas y los hashes de chunks cambian; **no se promete identidad byte a byte del bundle compilado**, sí preservación de los archivos fuente/datos/diseño SC-200 protegidos. Los contenidos Splunk siguen en payloads bajo demanda, no dentro del JS inicial. No hay IDs R04–R11 en los chunks.

LCP, INP, FPS, tareas largas y rendimiento en dispositivo real siguen pendientes. No se deducen de los tamaños anteriores.

## 6. Pruebas ejecutadas y pendientes

Evidencia final: [ejecución offline](../output/splunk-v12/validacion/2026-10-16T19-04-02-038Z/ejecucion.json), [TAP](../output/splunk-v12/validacion/2026-10-16T19-04-02-038Z/unit.tap), [diagnóstico V1.1](../output/splunk-v12/validacion/2026-10-16T19-04-02-038Z/diagnostico-v11.json), [artefactos](../output/splunk-v12/validacion/2026-10-16T19-04-02-038Z/artefactos.json). Cada corrida conserva fecha, versiones, hashes de código, comandos, códigos y stdout/stderr.

| Prueba | Estado / alcance |
| --- | --- |
| Diagnóstico de registros Parrot | VALIDADO; código 0; fallo axe exacto identificado y evidencia original íntegra |
| Nuevas regresiones de presentación | VALIDADO offline: foco/HTML del pre, colores/contraste, geometría y controles reales |
| Unitarias completas | **75/75 PASS**, código 0; 42 SC-200, 28 Splunk anteriores y 5 V1.2 |
| TypeScript / compilación | PASS, códigos 0; sin pre-hooks SC-200 |
| Integridad | PASS, guardias 400 / 29 / 257; conjuntos/IDs/revisiones/contenido intactos |
| Cinco paquetes | PASS OFFLINE, códigos 0; 80 IDs / 240 actividades originales |
| Regresiones editoriales | 47/47 seleccionadas PASS; una prueba histórica de snapshot pre-React sigue excluida explícitamente, sin afirmar 48/48 |
| Geometría a cuatro anchuras | PASS de funciones puras; cruces con puentes y espacio para placas largas. No sustituye layout del navegador |
| Navegación / XP / persistencia | Regresión lógica anterior PASS; nuevos eventos de botones y render interactivo pendientes |
| Vite local del agente | BLOQUEADO, `listen EPERM`, código 1 |
| Chromium V1.2 del agente | BLOQUEADO al arrancar, `setsockopt Operation not permitted`, código 1; 0 escenarios V1.2 aprobados |
| Axe posterior / responsive real / movimiento / estados | PENDIENTE en navegador |
| Regresión SC-200 completa en navegador V1.2 | PENDIENTE; se detuvo antes de ejecutar suites dependientes |
| Comparación visual final y capturas | PENDIENTE, sin afirmar equivalencia visual ya comprobada |

El [intento V1.2](../output/playwright/splunk-v12-premium/2026-10-16T19-02-46-267Z/ejecucion.json) y su [resultado Splunk](../output/playwright/splunk-v12-premium/2026-10-16T19-02-46-267Z/splunk/resultados.json) distinguen el bloqueo del agente del fallo axe de Parrot. [Registro del servidor/alternativa aislada](../output/splunk-v12/entorno-servidor.json). No se usaron sudo, cambios globales de permisos o reintentos idénticos indefinidos.

### Capturas y comparación visual

**No hay capturas reales V1.2 todavía.** Se conservan las referencias SC-200 y las seis capturas parciales de la ejecución V1.1 recibida, con su fecha/versión, sin usarlas como evidencia del mundo nuevo.

El runner nuevo prepara `premium-atlas-320/390/768/1440.png` y `premium-SP-R01/02/03-<ancho>.png`, más estados completados y capturas de las suites anteriores, en el subdirectorio `splunk/` de cada corrida V1.2. La comprobación visual pendiente debe verificar río protagonista, controles despejados, continuidad de puentes, profundidad, títulos legibles y paridad de calidad con las referencias SC-200.

Se generaron SVG diagnósticos offline en `output/splunk-v12/previsualizaciones/`; **no incluyen controles HTML ni equivalen a capturas UI**. El intento PNG con ImageMagick omitió gradientes/trazos; se conserva como diagnóstico no válido para juzgar el diseño, expresamente etiquetado en su LEEME. No sustituye la inspección en navegador.

La suite automática guarda `axe incomplete` con nodos. Siguen necesitando revisión humana contraste sobre escenas/gradientes, iconos, foco, zoom, lectura de pantalla y tacto. Cero violaciones automáticas no certifica WCAG ni resuelve por sí solo los incomplete anteriores.

## 7. Comandos exactos para Parrot OS

Desde la raíz, sin instalar dependencias ni regenerar SC-200:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/splunk-v12-integrity.mjs
node scripts/validate-splunk-v12.mjs
```

Terminal A, servidor de prueba del proyecto actualizado, sin cerrar otros servicios:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-splunk-v12.mjs --browser --base-url http://127.0.0.1:5187/
```

El runner usa contextos temporales y datos sintéticos, nunca el perfil/progreso personal. No conecta con Splunk ni servicios externos. Consulta la copia axe existente; no la descarga.

Orden preparado:

1. Regresión funcional de las 18 lecciones, 840 XP, historial, exportación, teoría/prácticas, aislamiento y persistencia; mismo fallo de Recursos R03 mantenido como control axe.
2. Ampliación premium: 16 vistas de atlas/regiones a cuatro anchuras, placas sin solaparse, áreas pulsables no cubiertas por paisaje, teclado, candados, puntero, estados por evento storage y movimiento reducido. También colores calculados/foco del código R03.
3. Regresión educativa completa SC-200 (76 lecturas/272 actividades), compatibilidad V2.5 y axe con todas las regiones SC-200.

Los comandos y códigos reales se archivan por corrida. `output/playwright/splunk-v12-premium/ultima-ejecucion.json` indica el informe actual. Un fallo detiene las suites dependientes; no considerar aprobadas las que no figuren ejecutadas. Sobre Vite, el origen es desarrollo aunque un runner SC-200 heredado tenga un campo literal `productionBuild:true`.

Para ver la interfaz: `http://127.0.0.1:5187/#/splunk/ruta`, luego cada región. Reservar ese origen/perfiles sintéticos para pruebas; no copiar sus datos al perfil personal ni cambiar/borrar claves para arreglar resultados.

## 8. Pendientes y parada

- Confirmar en Parrot la desaparición de las dos violaciones axe demostradas y revisar cualquier fallo nuevo sin relajar pruebas.
- Revisar capturas reales y microinteracciones a velocidad normal: especialmente río/puentes, móvil 320 px, expansión de requisitos y retorno con foco.
- Revisar incomplete/manual y otros navegadores; las pruebas geométricas no garantizan toda combinación de zoom/fuentes/dispositivo.
- Revisión humana independiente de las 18 fichas sigue pendiente; preguntas experimentales, XP provisionales y dominio práctico no evaluado. No se alteran fichas ni se atribuye una aprobación nueva.
- Validación real de SPL, ingesta, campos, permisos/licencias y producto sigue fuera de alcance.

**Punto de parada: Premium World implementado, regresión offline aprobada; validación visual/funcional de navegador V1.2 pendiente de resultados Parrot. No avanzar a R04–R11.**
