# Handoff maestro de SOC Learning Path

Fecha de inspección: **17/10/2026**. Raíz local: `/home/tommy/Documentos/SOC_LEARNING_PATH`. Este documento explica el proyecto instalado mediante inspección del código, catálogos, generadores y evidencias locales. No autoriza una siguiente fase de desarrollo.

## Actualización 19/10/2026 · seis mundos y Mundo SOC

Este documento se inspeccionó el 17/10/2026, cuando el proyecto tenía **tres áreas** (SC-200, Splunk y el simulador). Desde entonces se integraron **Redes, Windows + AD, Linux y el Mundo SOC**, y se cerró la revisión editorial del propietario del Mundo SOC. El inventario vigente, mundo por mundo, es [MAPA-MUNDOS.md](MAPA-MUNDOS.md); las secciones siguientes describen el estado del 17/10 y se conservan como historia.

- **Seis cursos + simulador**, cada uno con ruta, payloads y clave de progreso propios. Conteos verificados el 19/10 en el mapa.
- **Mundo SOC** (`#/soc/...`): 40 casos de entrevista, respuesta libre + respuesta modelo + rúbrica, y repaso espaciado. Plan y cierre en `docs/soc/`.
- **Revisión del propietario del Mundo SOC** cerrada el 19/10/2026 sin cambios en la fuente, atada a los hashes de los 40 casos. Siguen pendientes la revisión **independiente** y la **ejecución real** de las consultas (todo el contenido es sintético).
- Los otros mundos mantienen su revisión pendiente como declaran sus catálogos (`draft_pending_owner_review` / `pending_independent_review`).

## Autoridad documental y cómo retomar

| Pregunta | Fuente de verdad |
| --- | --- |
| Qué está permitido hacer ahora | Instrucción actual del usuario y [AGENTS.md](../AGENTS.md), dentro de las instrucciones del entorno |
| Cómo entrar al proyecto | [CLAUDE.md](../CLAUDE.md) |
| Cómo está construido y cuál era el estado de este traspaso | Este documento, contrastado con código/configuración/catálogos actuales |
| Cómo ejecutar un cambio autorizado | [GUIA-CAMBIOS-FUTUROS.md](GUIA-CAMBIOS-FUTUROS.md) |
| Qué ocurrió en cada fase | [RETOMAR.md](RETOMAR.md) y entregas fechadas; conservar su historia |
| Qué se comprobó realmente | JSON/log/captura de la ejecución concreta y hashes de sus fuentes; un puntero `ultima-*.json` puede cambiar |
| Qué contiene una lección | Fuentes canónicas y manifiestos; los JSON de publicación son derivados |

Si hay contradicción, inspecciona implementación y evidencia antes de actuar. Una previsión CSS no es una medida DOM; una prueba preparada no es una prueba ejecutada. Los informes de versiones anteriores mantienen validez para esas versiones. Este handoff no vuelve actuales sus prohibiciones de fase ni sus cifras antiguas.

El [README](../README.md), [ARQUITECTURA.md](ARQUITECTURA.md) y documentos V1 describen parte del origen del proyecto. Textos como «Splunk sigue sin implementar» son históricos. En el código aún hay mensajes «Splunk llegará» en `Roadmap.tsx` y un panel reservado dentro del lector original SC-200 `Reader.tsx`; **no describen la academia independiente Splunk ya implementada**. Se conservan porque este traspaso no modifica UI. Tampoco son una orden para añadir equivalencias KQL/SPL.

## Identidad, propósito y estado

Academia local gamificada para aprendizaje SOC N1/N2. Dos rutas educativas independientes, **Microsoft SC-200** y **Splunk SOC**, y un **simulador compartido de investigaciones** con almacenes separados por plataforma. Es una SPA estática: no hay backend, autenticación, base de datos de servidor, cloud, tenant Microsoft, instancia Splunk ni ejecución de ataques.

| Área | Implementado e inspeccionado | Verificado | Pendiente real |
| --- | --- | --- | --- |
| SC-200 V2.5; paquete global 0.2.5 | 13 regiones, 76 lecturas —una apertura y 75 dentro de capítulos—, 719 pasos, 272 actividades; 74 lecturas con actividades | Validación integral histórica V2.5, regresiones offline actuales y hashes de preservación | Dos introducciones sin evaluación técnica propia; revisión educativa humana, accesibilidad manual y otros navegadores/dispositivos |
| Splunk V2.0 experimental | 11 regiones, 80 lecciones, 400 pasos, 160 MCQ + 80 prácticas formativas = 240 actividades; 22 labs, 20 CSV/152 filas editoriales | Integración determinista, cinco paquetes y regresiones offline; las primeras 18 lecciones mantienen compatibilidad | Paridad del atlas a 320 px, validación completa UI de 80 lecciones, revisión humana de contenido/grafo y de los ocho paisajes nuevos |
| SOC Simulator V1 | Cuatro casos, 50 eventos, filtros, evidencias, relaciones, decisión, informe, nota y reintentos | Offline y ejecución automatizada Parrot aprobadas, detalladas abajo | Revisión humana de investigación/prosa, capturas y accesibilidad; no acredita competencia operativa real |

Las cantidades anteriores se recalcularon desde los catálogos locales. La revisión humana no se deduce del número de tests. SC-200 usa completado/dominio y premios educativos; Splunk usa teoría y **XP provisionales**, con práctica no evaluada; el simulador usa una nota estructurada y **cero XP educativos**.

## Evidencias y pendientes separados

### SOC Simulator: ejecución aprobada en Parrot

[Orquestador fechado](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/ejecucion.json): `passed`, guardias antes/después y `testedSourcesMatchFinal:true`. [Resultado de la suite](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/simulator/resultados.json): **`passed_automated_human_review_pending`**, Chromium **148.0.7778.178**.

- Ocho recorridos correctos: cuatro escenarios a 390 y 1440 px, 100/100. Noveno recorrido negativo: actividad legítima acusada sin soporte, 59/100 y no aprobado.
- Recuperación de borrador, entrega, recarga y reintento con historial conservado; aislamiento frente a claves educativas.
- Bandeja/mesa de ambas plataformas a 320/390/768/1440/1920 px; foco, teclado, movimiento reducido y overflow comprobados por el runner.
- 29 vistas axe, **0 violaciones automáticas**, pero **las 29 tienen `incomplete` de contraste** —gradientes y algunos elementos parcialmente cubiertos—. No se declara contraste manual aprobado ni conformidad WCAG completa.
- 19 capturas reales en la [galería](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/simulator/index.html), seis comprobaciones de montaje de rutas educativas, cero errores de página y cero solicitudes externas registradas. Comprobar montaje no equivale a validar toda una academia.

Antes de este handoff, todos los hashes `src/`, `scripts/` y `tests/` del informe Parrot coincidían con los archivos instalados. Este traspaso solo añade documentación y cambia la referencia/huella del manifiesto documental de una guardia; conserva componentes, motores, tests y datasets.

Los fallos anteriores de selectores permanecen archivados: `2026-10-16T23-35-17-771Z` fallaba en Categoría inicial; `2026-10-17T06-45-42-489Z`, en Resumen ejecutivo. `Field` envuelve controles en labels: `getByLabel` exacto incluía opciones de select y texto de textarea rellenado. El runner actual usa `combobox`/`textbox`/`searchbox`/`checkbox` y nombres accesibles exactos; las fechas nativas conservan label exacto. Ver [SOC-SIMULATOR-V1.md](SOC-SIMULATOR-V1.md). Esos timeouts quedaron superados por la ejecución posterior; no son pendientes actuales.

### SC-200: validación histórica con cobertura parcial

[final-validation.json](../output/playwright/v25-final/final-validation.json) declara `VALIDADA_CON_COBERTURA_PARCIAL`, 42 unitarias en esa fase, 11 grupos educativos, 84 escenarios de geometría, 98 controles de layout, 13 grupos UX, 78 vistas de accesibilidad y 72 muestras de rendimiento. Los resultados detallados y galerías se enlazan desde [V2.5-ACADEMIA.md](V2.5-ACADEMIA.md) y [V25-ESTADO.md](V25-ESTADO.md). Las 111 unitarias posteriores son el total combinado actual, no 111 nuevas pruebas SC-200.

Pendientes educativas: introducción de **Protección y configuración de workloads** y de **Mapa de tablas y relaciones KQL**. La fuente no aporta material técnico suficiente para evaluarlas por sí mismas. Permiten estudiar/completar/desbloquear, pero no dominio fabricado. Decisiones: `scripts/v25/review-decisions.json`; detalle por lectura: [V25-COBERTURA.json](V25-COBERTURA.json). No repetir los doce lotes completos para cubrirlas.

Persisten límites históricos: revisión semántica del agente, no humana/independiente; sin KQL real, Safari/Firefox, teléfono físico ni lector de pantalla manual; tareas largas de carga inicial. Las métricas históricas de bundle/FCP no describen necesariamente el bundle combinado posterior ni prueban FPS.

### Splunk: paridad histórica aún abierta

[Paridad real de Parrot](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/paridad/resultados.json): a **320 px**, `near(master.progress.width,adapted.progress.width,'Panel')` falló con tolerancia 1 px; **282.59375 / 295.203125**, delta **12.609375**. El panel del atlas crecía por el ancho intrínseco de textos/estadísticas. No era el lector ni un fallo de arranque de Chromium.

El [intento V2.0 posterior](../output/playwright/splunk-v20/2026-10-16T23-02-20-114Z/ejecucion.json) se bloqueó antes de medir. No se encontró una ejecución posterior que cierre esa aserción. El éxito del simulador a 320 px no prueba paridad entre atlas. Conservar la aserción y sus evidencias.

Recursos R03 tuvieron fallos históricos de contraste de código y foco en un `pre` desplazable; sus correcciones están implementadas y las aserciones axe se conservan. Eso no equivale a aprobación integral V2.0. Falta validación humana de preguntas, anclas, prácticas y grafo; R08/R09 usan rangos conservadores de prerrequisitos «según tema», no un grafo granular canónico. Véase [SPLUNK-V20-INTEGRACION-COMPLETA.md](SPLUNK-V20-INTEGRACION-COMPLETA.md).

## Stack y configuración inspeccionados

| Elemento | Versión/configuración local |
| --- | --- |
| Node | `engines >=22.12.0`; inspección con **22.22.2** |
| React / React DOM | **19.2.4** |
| TypeScript | **5.9.3**, estricto, `noEmit`, módulos ESNext/Bundler, target ES2023 |
| Vite | **7.3.2**, `base:'./'`; dev 127.0.0.1:5173 y preview 4174, strictPort |
| Tailwind / plugin Vite | **4.3.3**; la presentación también usa extensamente CSS propia |
| Iconos | `lucide-react` **1.54.0** |
| Markdown | `react-markdown` **9.1.0**, `remark-gfm` **4.0.1**, `remark-parse` **11.0.0**, `unified` **11.0.5** |
| AST de contenido | `mdast-util-to-string` **4.0.0**, `unist-util-visit` **5.1.0** |
| Pruebas | `tsx` **4.23.15**, `node:test`, `playwright-core` **1.62.0** y Chromium del sistema |
| Bundle | Override Rollup **4.60.1**; dependencias fijadas en `package-lock.json` |

`package.json` es privado, tipo módulo y versión 0.2.5; no confundir esa versión global con «Splunk V2.0» o «Simulator V1». No hay React Router, Framer Motion, GSAP ni cliente de backend. No hay script de lint definido. `tsconfig.json` incluye `src`; ejecutar tests mediante tsx no implica un typecheck completo de todos los tests. Axe se carga desde un archivo local, no desde una dependencia npm de la aplicación.

## Directorios y responsabilidades

```text
SOC_LEARNING_PATH/
  AGENTS.md, CLAUDE.md       entrada e instrucciones
  package.json, package-lock.json, tsconfig.json, vite.config.ts
  index.html                documento de arranque, root y main.tsx
  src/
    main.tsx, App.tsx        CSS global, dispatcher y aplicación SC-200
    components/             vistas SC-200 y primitivas visuales
      adventure/            mapas, paisajes, símbolos y medición compartida
      learning/LessonFrame.tsx  marco de presentación consumido por Splunk
    lib/                    catálogo/adaptadores, router, progreso SC-200 y geometría
    education.ts, types.ts  contratos educativos SC-200
    generated/              catálogo e índice SC-200; subcarpeta splunk/
    splunk/                 aplicación, contenido, progreso y presentación Splunk
    simulator/              motor, persistencia y consola de investigaciones
    *.css                   capas globales y visuales compartidas
  public/
    content/                payloads SC-200 saneados
    splunk-content/         payloads y recursos Splunk
    simulator-data/         cuatro datasets y manifiesto
    illustrations/LICENSE.md  licencia de ilustraciones locales
  scripts/                  generación, guardias y orquestación
    v25/                    doce lotes, compatibilidad y decisiones educativas
    simulator/              fixtures Microsoft sintéticos
  tests/                    unitarias, fixtures y suites reales de navegador
  SPLUNK_MASTER_RESEARCH/   investigación, currículo, cinco paquetes y validación editorial
  docs/                     arquitectura/estado vigente e informes históricos
  output/                   resultados fechados, capturas, inventarios y respaldos
  dist/                     build regenerable; no es fuente canónica
  .agents/skills            enlace a skills del proyecto original externo
```

El árbol omite dependencias y artefactos de caché. `.gitignore` excluye `node_modules/`, `dist/`, `output/`, `src/generated/`, `public/content/`, archivos de entorno y tsbuildinfo. **Preservar únicamente lo que Git incluya no basta** para conservar evidencia y guardias. No se asume que haya repositorio Git operativo, remoto o commits recuperables. Verifica eso antes de usar Git como estrategia de recuperación.

## Entradas, rutas y límites entre módulos

`index.html` carga `src/main.tsx`, que monta `StrictMode` y `App`. `src/lib/router.ts` observa `hashchange` mediante `useSyncExternalStore`, decodifica el ID y devuelve `URLSearchParams`; no hay rutas de servidor. `replaceQuery` cambia query/hash conservando el historial que corresponda.

`src/App.tsx` muestra `AcademySelector` y decide qué subárbol montar. Splunk y simulador usan `lazy`, `Suspense` y fronteras de error propias. `Sc200App` contiene su hook de progreso; entrar al simulador no monta los hooks educativos. Hay importaciones estáticas de utilidades/metadatos SC-200 en el dispatcher: aislamiento de almacenamiento no significa ausencia de todo código compartido en el bundle.

| Ruta hash | Vista / responsable |
| --- | --- |
| `#/ruta` | Atlas SC-200, `Roadmap.tsx` |
| `#/capitulo/capitulo-1-licencia-y-onboarding` | Región e índice, `Chapter.tsx` y `RegionMap.tsx` |
| `#/leccion/documento/apertura-del-documento-1?fase=introduccion` | Lector educativo, `LearningReader.tsx`; el ID puede contener barras y los helpers lo codifican |
| `#/biblioteca`, `#/progreso`, `#/repaso` | `Library.tsx`, `Statistics.tsx`, `Review.tsx` |
| `#/splunk/ruta`, `#/splunk/region/SP-R02` | `SplunkApp.tsx` → `SplunkMap.tsx` → `PremiumWorld.tsx` |
| `#/splunk/leccion/SP-R01-L01?fase=mision` | `SplunkReader.tsx` |
| `#/splunk/recursos`, `#/splunk/recursos/SP-R11` | Índice o recurso regional, `Resources.tsx` |
| `#/splunk/progreso` | Bitácora y exportación dentro de `SplunkApp.tsx` |
| `#/simulador/microsoft`, `#/simulador/splunk` | Bandeja `SimulatorApp.tsx` |
| `#/simulador/microsoft/microsoft-access` | Caso; los otros tres IDs están en la tabla del simulador |

SC-200: fases `introduccion`, `aprende`, `practica`, `resumen`, `evaluacion`, `repaso`; `modo=apuntes` o `seccion` abren `Reader.tsx`. `paso` en este lector usa índice desde **0**. Splunk: `mision`, `estudio`, `practica`, `resumen`, `teoria`, más `repaso`, `soluciones`, `referencias`, `original`; su `paso` es **1–5**. No intercambiar los parámetros de ambos lectores. `nodo` conserva retorno/foco al mapa; no es una clave nueva de progreso.

### Componentes, hooks y carga de contenido

SC-200: `Header`, `Roadmap`, `Chapter`, `Library`, `Statistics`, `LearningReader`, `QuestionCard`, `Review` y `Reader`. `src/lib/catalog.ts` importa el catálogo ligero; `Reader.tsx` exporta `useContent`, con fetch local y caché de ocho payloads. El lector educativo reutiliza ese hook y `MarkdownContent`. Biblioteca/correctores no inventan equivalencias Splunk. `useProgress` conecta las funciones puras educativas al almacenamiento y exportación.

Splunk: `data.ts` expone catálogo/helpers, SHA-256 y validación del contrato; `useSplunkContent` en `useSplunk.ts` carga payloads por ID/revisión y guarda ocho en caché. Hash/contrato incorrectos producen error, no contenido de otra ruta. `SplunkReader` combina motor propio, `reader-presentation.ts`, `SplunkMarkdown` y `LessonFrame`. `Resources` carga solo la región solicitada y valida su hash. Durante un examen se ocultan soluciones y recursos; no es un sistema antitrampa criptográfico.

Simulador: `entry.tsx` incorpora su CSS y exporta la app. `SimulatorPlatform` usa `useSimulator`; `CaseLoader` verifica el dataset; `CaseWorkspace` presenta y entrega. La corrección (`grading.ts`/`rubrics.ts`) se importa al finalizar. Nada debe llamar a `applyLearning` o `applySplunk` para puntuar una investigación.

## Persistencia y progreso

**LocalStorage está separado por origen, navegador y perfil.** Mantener esquema/host/puerto: 5173 y 5187 son almacenes distintos; `localhost` y `127.0.0.1` también. No abrir por `file://` para recuperar avance. Los tests usan contextos nuevos y fixtures sintéticos. No leer ni publicar el contenido del perfil personal como evidencia.

| Clave exacta | Esquema y contenido | Código |
| --- | --- | --- |
| `soc-learning-path:progress:v1` | Legado SC-200, esquema 1: `completed:{id:version}`, `lastLesson`. Se lee para migrar; el hook actual nunca la elimina ni escribe | `src/lib/progress.ts`, `learning-storage.ts` |
| `soc-learning-path:learning:v2` | Esquema 2: `legacy`, `records[id][revision]`, `awards[id]`, `chapterAwards`, `lastLesson` | `src/lib/learning.ts`, `learning-storage.ts`, `useProgress.ts`; tipos en `src/education.ts` |
| `soc-learning-path:splunk:learning:v1` | Esquema 1, `courseId:splunk`, `rewardMode:provisional_only`; `records[id][revision]`, `provisionalAwards`, `regionAwards`, `lastLesson:{id,updated}` | `src/splunk/progress.ts`, `useSplunk.ts`, `types.ts` |
| `soc-learning-path:simulator:microsoft:v1` | Esquema 1, `platform:microsoft`, `attempts[scenarioId]:Attempt[]` | `src/simulator/storage.ts`, `types.ts`, `useSimulator.ts` |
| `soc-learning-path:simulator:splunk:v1` | Mismo contrato, `platform:splunk`; no se fusiona con Microsoft | Mismos módulos del simulador |

**SC-200.** Cada revisión conserva pasos vistos, cursor, práctica, errores, intentos y primeras respuestas; distingue completado de dominado. Resumen requiere estudio y prácticas respondidas; dominio requiere evaluación ≥80 %, resumen y práctica resuelta. Premios únicos por ID: estudio 5, práctica 5, resumen 5, evaluación 15, dominio 15, repaso 5; 100 por capítulo, nivel cada 250. El legado aporta un suelo de 25 XP por lectura, no un segundo premio acumulable. `facade` conserva completado histórico aunque cambie revisión; `currentRecord` selecciona revisión vigente o el predecesor permitido. No calcular premios desde JSX.

La compatibilidad V2.4→V2.5 se declara exclusivamente si el generador confirma misma fuente/pasos y ausencia de actividades previas. `scripts/v25/compatibility.json` y `previousRevision` permiten leer el registro anterior sin borrarlo ni regalar dominio. Cambiar títulos puede cambiar IDs derivados; cambiar fuente/actividades puede cambiar revisión. Revisar esas consecuencias antes de generar.

**Splunk.** Guarda pasos, estudio/resumen, teoría, consulta formativa, repaso e intentos; no guarda como progreso el texto libre de P01, que es estado de sesión del lector. Prerrequisitos exigen estudio y teoría de los IDs declarados en el catálogo. Dos preguntas al 80 % exigen 2/2. Estudio 5 + resumen 5 + teoría 15 + repaso 5 = 30 XP provisionales/lectura, más 100 por región: máximo aritmético 3500 en 80/11. Cero XP definitivos, `practicalStatus:not_assessed`. Sin migración automática hacia SC-200 ni hacia premios definitivos. Borrar una lección del catálogo puede volver desconocidos sus registros y bloquear la carga para preservar el original.

**Simulador.** Cada intento conserva revisión, competencias, filtros/corte, eventos vistos/seleccionados, relaciones, decisión, informe, diario y evaluación. Entregas inmutables; reintentar crea otro ID sin borrar el anterior. Los borradores de varias pestañas se resuelven por actualización más reciente, no mediante edición colaborativa semántica. Revisiones antiguas son de consulta. Cambiar IDs de escenarios, afirmaciones o acciones puede invalidar guardados por su validación estricta; la revisión del escenario actual deriva del hash del dataset, por lo que cambiar solo reglas/objetivos exige planificar explícitamente revisión y compatibilidad.

Los módulos fusionan/persisten mediante sus funciones propias y escuchan eventos `storage`; no hacen una fusión universal. Guardados corruptos/futuros se preservan sin sobrescribir, con advertencia y sesión en memoria. Ante falta de cuota/acceso, exportar antes de cerrar. No prometer que las fusiones resuelvan todas las ediciones concurrentes.

Exportaciones actuales: SC-200, `soc-learning-path-progreso.json`, con estado y copias raw del legado/interactivo; Splunk, `splunk-piloto-progreso.json`; simulador, `soc-simulator-microsoft-v1.json` o `soc-simulator-splunk-v1.json`. Los nombres «piloto» son históricos. **No hay importador general en la UI**. Restaurar a mano exige copia original, validadores, mismo origen y autorización; nunca usar `localStorage.clear()` como reparación.

## Sistema visual y puntos reales de modificación

Referencia SC-200: [V2.3](V2.3-PREMIUM-WORLD.md), [V2.4](V2.4-PREMIUM-EXPERIENCE.md) y capturas V2.5. Los diseños actuales conservan continuidad; **pueden evolucionar o rediseñarse con autorización explícita del usuario**, incluso íntegramente. Por defecto conservar paisajes, especialmente el río Splunk R02. La protección por hash es una barrera de revisión y trazabilidad, no una prohibición eterna.

| Parte visual | Archivos donde se implementa |
| --- | --- |
| Atlas SC-200 y sus paneles | `src/components/Roadmap.tsx`; adaptación catálogo/progreso en `src/lib/adventure-catalog.ts` |
| Región SC-200 y navegación | `src/components/Chapter.tsx`, `src/components/adventure/RegionMap.tsx`, `RegionNavigation.tsx`, `MapLegend.tsx` dentro de `src/components/` |
| Nodos HTML, placas, candados, camino y cofre | `src/components/adventure/AdventureMap.tsx`; `Artwork.tsx` exporta `Robot`, `Landscape`, `Treasure` |
| Geometría y distribución | `src/lib/adventure.ts`: `mapLayout`, `fitMapLabels`, `routeSegment`; `src/components/adventure/useAdventureLayout.ts`: medición real mediante ResizeObserver |
| Río, cruces, puentes y exclusión de vegetación | `src/lib/pilot-landscape.ts`, `src/lib/original-map-geometry.ts`, `src/components/adventure/PilotLandscape.tsx` y `PremiumLandscape.tsx` |
| Metadatos y dibujo de paisajes | `src/lib/region-visuals.ts`; `PremiumLandscape.tsx`, `LandscapeSymbols.tsx`, `LandscapeLandmark.tsx` en `src/components/adventure/` |
| Atlas/regiones Splunk | `src/splunk/SplunkMap.tsx`, `PremiumWorld.tsx`, `world-model.ts`, `premium-world.css` |
| Lectores SC-200 | `src/components/LearningReader.tsx`, `Reader.tsx`, `QuestionCard.tsx`; CSS de `.academy-grid`, `.activity-surface`, `.markdown` y capas globales |
| Lector Splunk | `src/splunk/SplunkReader.tsx`, `reader-presentation.ts`, `SplunkMarkdown.tsx`, `reader.css`, y `src/components/learning/LessonFrame.tsx` |
| Consola del simulador | `src/simulator/SimulatorApp.tsx`, `simulator.css`; no hay atlas propio |
| Cabecera, selector y primitivas | `src/components/Header.tsx`, `AcademySelector.tsx`, `Primitives.tsx`; cabecera Splunk dentro de `SplunkApp.tsx` |

Las ilustraciones son **SVG definidos en TSX**, sin fondos raster descargados. `public/illustrations/` contiene la licencia, no una colección de PNG que sustituya al renderizador. El mapa representa capítulos/lecturas, no los 719 pasos. La geometría coloca paisaje, camino, estaciones y cofre en el mismo espacio; no mover un puente solo por CSS para ocultar una incoherencia de cruces.

`main.tsx` importa, en orden, `styles.css`, `adventure.css`, `premium.css`, `full-width.css`, `world.css`, `experience.css`; `premium.css` importa `tokens.css`. `App.tsx` añade `academies.css`. Splunk incorpora `splunk.css`, `reader.css`, `premium-world.css`; el simulador carga `simulator.css` por su entrada diferida. Las hojas compartidas y las colisiones con CSS Splunk antigua importan: no asumir aislamiento total al cambiar un selector global.

Tokens: colores de tinta/papel, agua, vegetación, estaciones y recompensas en `tokens.css`; base tipográfica y Tailwind en `styles.css`. Movimiento breve: 120 ms pulsación, 150 feedback, 200 navegación; `src/lib/presentation.ts`, `usePresentationMotion.ts` y `experience.css` manejan foco, historial y animación. WAAPI/CSS, sin biblioteca de movimiento; se cancelan animaciones al navegar/teclado/reduced motion y no conceden XP.

El layout compartido de mapas usa ventanas ≤680, ≤1100 y escritorio, mide placas/overlay y adapta filas/altura sin recortar títulos. `full-width.css` extiende el panorama y paneles desde 1600 px; lectores apilan columnas a sus propios breakpoints. El simulador tiene reglas 1500/1199/800/520. Comprobar siempre 320 px, bordes de breakpoint, zoom, foco y títulos extensos; no extrapolar desde un render estático.

**Adaptación Splunk:** reutiliza `useAdventureLayout`, geometría, arte compartido, primitivas y clases del maestro, con sus propios datos/estados/rutas. No monta `AdventureMap` íntegro porque todavía contiene acoplamientos SC-200, incluida la URL del cofre. `PremiumWorld` adapta `available/locked/progress/passed`; «teoría aprobada» no es dominio práctico. `LessonFrame` replica slots/clases de `LearningReader`, pero actualmente lo consume Splunk; SC-200 conserva su JSX original. El helper `worldLayout` y `RegionScene.tsx` siguen en el árbol histórico, **no son el layout cliente actual**. Para río R02, la configuración efectiva está en `splunkWorlds.river` de `world-model.ts`, consumida por `pilotLandscape`/`PremiumLandscape`/`PilotBridges`.

## Contenido, fuentes canónicas y generación

### SC-200

Origen externo predeterminado: `/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md`, o `SC200_SOURCE` explícito. No está copiado como Markdown canónico dentro de esta academia. En otra máquina hay que recuperar ese original bajo custodia del usuario o suministrar su ruta; no reconstruirlo desde recuerdos o fuentes web. La fuente inspeccionada tiene SHA-256 `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`.

Flujo: `scripts/prepare-content.mjs` lee el origen completo → `content.mjs` analiza/sanea y verifica reconstrucción sin pérdidas/duplicados → `education.mjs` crea pasos y añade actividades respaldadas por `activities.mjs` y `v25/batch-*.json` mediante `v25/index.mjs` → catálogo/índice en `src/generated/`, payloads en `public/content/`, e informes `docs/CONTENIDO.md`, `content-audit.json`, `education-coverage.json`.

El generador **borra y reconstruye `public/content/`**. No usarlo como prueba inocua si falta la fuente o se han cambiado variables como `SOC_EDUCATION_PHASE`. Los prehooks de `npm test`, `npm run build` y `npm run dev` lo ejecutan. No editar derivados manualmente; preservar IDs, citas, saneado, revisión educativa y control de reconstrucción. Una corrección visual nunca exige cambiar el Markdown canónico.

### Splunk

Canon local: `SPLUNK_MASTER_RESEARCH/03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json`, SHA-256 `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933`. Investigación ya realizada en `SPLUNK_MASTER_RESEARCH/02_INVESTIGACION/`; no repetirla sin un motivo de revisión explícito.

Cinco paquetes `SPLUNK_LECCIONES_R01_R03`, `R04_R05`, `R06_R07`, `R08_R09`, `R10_R11`, todos bajo `SPLUNK_MASTER_RESEARCH/`. Cada uno conserva Markdown, actividades estructuradas, prácticas/fixtures, `VALIDACION/MANIFIESTO.json`, `SHA256SUMS.txt` y `DATASETS.json`. Los namespaces distinguen CSV con el mismo nombre.

`scripts/prepare-splunk.mjs` + `splunk-v20-sources.mjs` validan currículo/hashes/IDs/actividades, adaptan ocho o nueve secciones editoriales a cinco pasos sin perder bloques y generan **94 salidas**: 80 lecciones + 11 recursos + catálogo + índice + informe `docs/SPLUNK-CONTENIDO.md`. Conservan primeras 18, saneado, fuentes, soluciones y referencias. Las escrituras son staging/rename por archivo, **no transacción única**; no limpian carpetas. Destinos/IDs están cerrados y rechazan rutas ascendentes/symlinks. Añadir una lección requiere una ampliación autorizada del contrato/importador/guardias, no solo dejar un Markdown suelto.

Los prerrequisitos provienen de preámbulos editoriales y se expanden a IDs, no de la posición de nodos. R10 requiere R01–R05; R11, R07/R09/R10. R08/R09 mantienen su interpretación conservadora documentada. Las prácticas son formativas; no ejecutar SPL, ES ni SOAR al abrirlas. Enlaces oficiales de los paquetes no se volvieron a verificar en este handoff.

### Generadores y herramientas históricas que requieren atención

| Herramienta | Efecto / precaución |
| --- | --- |
| `scripts/prepare-content.mjs` | Reconstruye SC-200 y sus derivados; requiere fuente externa |
| `scripts/prepare-splunk.mjs` | Regenera solo Splunk tras guardias; es lo que llama `npm run prepare:splunk` |
| `scripts/prepare-simulator.mjs` | Regenera únicamente datasets/manifiesto del simulador, sin overrides de CLI |
| `scripts/v25-checkpoint.mjs`, `v25-delivery.mjs` | Escriben documentos, cobertura y resultados de fases antiguas; **pueden sobrescribir RETOMAR y este contexto con estados obsoletos**. No ejecutar como mantenimiento general |
| `scripts/v25-final-audit.mjs`, `v25-validate.mjs`, `v25-bundle-report.mjs` | Tienen destinos históricos fijos y supuestos/baselines de V2.5; inspeccionar y preparar una salida nueva antes de reutilizar |
| Scripts de `SPLUNK_MASTER_RESEARCH/VALIDACION/` | Algunos comprueban; otros sincronizan/regeneran metadatos/editorial. No ejecutar todos como si fueran solo lectura |
| `scripts/install-local.sh` | Copia la instalación a la ubicación fija si no existe; no es un actualizador ni se necesita en esta raíz |

## SOC Simulator: arquitectura y contratos

| Módulo | Responsabilidad |
| --- | --- |
| `src/simulator/types.ts`, `scenarios.ts` | Contratos y catálogo ligero; revisión `sim-v1-r1-` derivada del hash de eventos |
| `investigation.ts` | Filtros, UTC, corte de disponibilidad y expediente obligatorio |
| `engine.ts` | Inicio, acciones, selección, relaciones, entrega inmutable y reintento |
| `storage.ts`, `useSimulator.ts` | Validación/fusión por plataforma, errores, recuperación y exportación |
| `rubrics.ts`, `grading.ts` | Reglas docentes y nota determinista; carga al finalizar |
| `SimulatorApp.tsx`, `entry.tsx`, `SimulatorBoundary.tsx`, `simulator.css` | Bandeja/mesa, carga de eventos, formulario, evaluación y error recuperable |
| `scripts/prepare-simulator.mjs` | Adapta fuentes verificadas y produce `public/simulator-data/` |
| `tests/simulator-fixtures.ts` | Soluciones sintéticas para probar el motor/recorridos; no es la fuente de contenido editorial |

| ID | Plataforma / nivel | Eventos | Objeto de investigación |
| --- | --- | ---: | --- |
| `microsoft-access` | Microsoft N1 | 9 | Fallos/acceso y operación posterior con corroboración; sin inferir exfiltración |
| `microsoft-legitimate` | Microsoft N1 | 7 | PowerShell, equipo/cuenta, autorización, ventana y archivo; alcance legítimo acotado |
| `splunk-identities` | Splunk N1 | 10 | Cinco identidades/seis fallos en una ventana; éxito de otra IP |
| `splunk-incomplete` | Splunk N2 | 24 | Seis cuentas, éxito, contexto/NAT y A021 tardío; incertidumbre y escalado |

Fuentes: `scripts/simulator/microsoft-events.json`; CSV R03 `SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R01_R03/PRACTICAS/fixtures/auth_sintetico.csv`; CSV R06/R07 `SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/auth_activity.csv` y `authorized_context.csv`. Los últimos CSV se reutilizan sin cambiar originales; el generador comprueba manifiestos y elimina del modelo de investigación las etiquetas docentes. Los IDs A001–A021 se preservan; S301–S310 y C001–C003 proceden del adaptador.

Filtros locales por subcadena; tiempo del evento `[inicio, fin)` y disponibilidad `<corte`. No existe intérprete KQL/SPL ni red SIEM. Pegar una consulta busca ese texto literal. `fixture_indexed_at` no es `_indextime` real; `TrainingContext` no es un producto/tabla comercial. A021 ocurre a 09:04, llega a 09:24 y solo aparece al ampliar de 09:16 a 09:30. Un `host` emisor no identifica automáticamente al cliente; un 4624 no identifica al atacante.

Rúbrica: triage **20**, evidencia **25**, correlación **20**, decisión **20**, trazabilidad de informe **15**; umbral estructurado 80. Abrir todos los eventos no puntúa. Ruido y relaciones sin soporte restan; acusar incidente no confirmado o exfiltración no acreditada limita a 59, omitir evidencia crítica a 79. La completitud del texto es obligatoria, **su calidad semántica no se autocorrige**. Toda evaluación queda `humanReview:pending`, incluso con 100. Las acciones son propuestas documentales; no contienen ni cierran nada en sistemas externos. Soluciones diferidas en cliente no ofrecen secreto criptográfico.

## Integridad, preservación y traspaso

Las guardias históricas forman una cadena: `splunk-integrity.mjs` → V1.1 → V1.2 → V1.2.1 → V1.2.2 → V2.0 → `simulator-integrity.mjs`. Sus coberturas se solapan; no sumar sus cifras como si fueran archivos únicos. El guard del simulador verifica 358 copias y 416 fuentes/evidencias adicionales, reconstruye las dos extensiones de navegación y exige datasets deterministas. V2.0 verifica 281 copias, 324 fuentes/evidencias, 80 derivados y preservación de primeras 18. Todos necesitan sus carpetas de respaldo dentro de `output/`.

Las conciliaciones reconocen únicamente **ruta + hash anterior + hash final**. Para este handoff, [HANDOFF-CONCILIACION-SIMULATOR.json](HANDOFF-CONCILIACION-SIMULATOR.json) conserva las entradas anteriores y actualiza solo el hash final de `docs/RETOMAR.md`, añadiendo su predecesor inmediato. `scripts/simulator-reconciliation.mjs` cambia exclusivamente los dos literales de ruta/huella del manifiesto. No se cambia la lógica ni se aceptan archivos comodín. El manifiesto histórico `output/soc-simulator-v1/cambios-autorizados.json` permanece intacto. No copiar esta excepción a otro archivo o diseño sin una autorización nueva y comprobable.

Para conservar el proyecto durante años, respaldar fuentes/configuración/lockfile, derivados, investigación, documentos y `output/` con inventario SHA-256 y fecha. Conservar aparte la fuente SC-200 externa con permiso del usuario. Las skills son un symlink al directorio original y pueden no existir en otra máquina. No incluir perfiles de navegador, secretos, archivos de entorno ni exportaciones personales en documentación o repositorios públicos. Los respaldos de código no incluyen automáticamente el LocalStorage del estudiante.

## Ejecutar y verificar

Todos los comandos siguientes se ejecutan desde la raíz. No es necesario reinstalar un `node_modules` que ya funciona. En una instalación nueva, `npm ci` usa el lockfile y requiere disponibilidad de paquetes; no fue ejecutado en este handoff. `playwright-core` necesita un Chromium existente, por defecto `/usr/bin/chromium`, configurable con `CHROMIUM_PATH` en los runners que lo leen.

```sh
# Lectura/validación de invariantes; no inicia navegador
node scripts/simulator-integrity.mjs
node scripts/splunk-v20-integrity.mjs

# Servir datos ya preparados, incluyendo las tres áreas
npm run dev:pilot -- --port 5187 --strictPort

# Uso habitual: predev vuelve a preparar SC-200 antes de servir a 5173
npm run dev
```

No ejecutar dos servidores a la vez sobre el mismo puerto. Para servir un build ya existente: `python3 -m http.server 5173 --bind 127.0.0.1 --directory dist`; no reconstruye ni necesita abrir la fuente, pero `dist` podría estar desactualizado. `npm run preview` sirve `dist` a 4174.

| Validación | Comando y alcance |
| --- | --- |
| Unitarias combinadas | `npm test`; node:test/tsx; pretest regenera SC-200 |
| TypeScript sin build | `node node_modules/typescript/bin/tsc --noEmit --incremental false` |
| Producción | `npm run build`; prebuild regenera SC-200, tsc y Vite; comprobar código de salida, no solo avisos de `use client` |
| Offline registrado de simulador | `node scripts/validate-simulator.mjs`; guardias, sintaxis, datasets, TS, npm test y build, salida fechada |
| Offline registrado Splunk V2.0 | `node scripts/validate-splunk-v20.mjs`; añade importación y cinco validadores editoriales/regresiones; inspeccionar destinos auxiliares históricos antes de repetir |
| Pruebas editoriales | `python3 -B scripts/splunk-v11-editorial-tests.py`; 47 seleccionadas y exclusión explícita del snapshot anterior al piloto; no afirmar 48/48 |

`npm run test:splunk:browser` sigue apuntando al orquestador **V1.1**, no V2.0. Usa el comando V2.0 explícito cuando ese sea el alcance. No inferir un PASS nuevo de un alias antiguo o de `node --check`.

En otra terminal, con Vite a 5187 y una salida nueva por ejecución:

```sh
# Simulador: el orquestador crea automáticamente carpeta fechada
node scripts/validate-simulator.mjs --browser --base-url http://127.0.0.1:5187/

# Splunk V2.0: paridad + 80 lecciones + regresiones independientes
node scripts/validate-splunk-v20.mjs --browser --base-url http://127.0.0.1:5187/
```

Ejemplo SC-200 para una **futura ejecución con etiqueta nueva**; sustituir la carpeta de ejemplo si ya existe:

```sh
node tests/e2e.mjs --base-url http://127.0.0.1:5187/ --output-dir output/playwright/handoff-futuro-sc200/education
node tests/e2e.mjs --world --base-url http://127.0.0.1:5187/ --output-dir output/playwright/handoff-futuro-sc200/world
node tests/e2e.mjs --full-width --base-url http://127.0.0.1:5187/ --output-dir output/playwright/handoff-futuro-sc200/layout
node tests/e2e.mjs --experience --base-url http://127.0.0.1:5187/ --output-dir output/playwright/handoff-futuro-sc200/experience
node tests/e2e.mjs --v25-compatibility --base-url http://127.0.0.1:5187/ --output-dir output/playwright/handoff-futuro-sc200/compatibility --axe-path output/v25/reanudacion/axe.min.js
node tests/e2e.mjs --a11y --all-regions --base-url http://127.0.0.1:5187/ --output-dir output/playwright/handoff-futuro-sc200/accessibility --axe-path output/v25/reanudacion/axe.min.js
```

Los argumentos de esas suites están implementados en `tests/e2e.mjs`. Las carpetas del ejemplo son destinos futuros, no evidencia de ejecución. Los defaults de varios runners apuntan a directorios históricos: no omitir `--output-dir`. `validate-simulator` sí crea salida fechada y actualiza su puntero `ultima-*`; conservar el informe fechado que enlazaba el puntero anterior.

Interpretación: código cero + TAP con cantidades correctas + informe terminado + ausencia de fallos = evidencia del alcance ejecutado. Revisar `violations`, `incomplete`, imágenes, consola, origen y hashes. `passed_automated_human_review_pending` no significa revisión humana aprobada. `blocked_browser_launch`/EPERM no son regresiones demostradas de UI; un timeout de selector después de abrir Chromium sí exige investigar flujo/DOM/semántica. No repetir arranques equivalentes para sortear una restricción del entorno ni usar perfiles personales para desbloquearlos.

## Decisiones de diseño y límites para continuar

SC-200 nació de un Markdown real; se separaron fuente, educación/progreso y mapa para que un rediseño no reescriba lecciones o XP. La academia Splunk se construyó aparte porque tiene currículo, licencias/productos, evaluación formativa, revisión y recompensas provisionales propios. Unificar su motor con SC-200 habría inventado equivalencias o dominio no acreditado.

La primera presentación Splunk divergía del maestro: ancho limitado, cabecera/hero propios, miniaturas y nodos de otra escala. V1.2.1 adoptó la geometría, arte, medición, tokens y estructura SC-200; V1.2.2 alineó el lector. Se evitó reconstruir una UI funcional y se preservó su continuidad sin mezclar datos. La motivación y medidas históricas están en [SPLUNK-V121-PARIDAD-SC200.md](SPLUNK-V121-PARIDAD-SC200.md) y [SPLUNK-V122-LECTOR-SC200.md](SPLUNK-V122-LECTOR-SC200.md). Compartir renderizadores no acredita equivalencia visual completa: el panel de 320 px lo demuestra.

El simulador comparte motor entre plataformas porque ambas investigan un expediente, pero usa modelos/rúbricas y almacenes propios para no convertir una nota de entrenamiento en XP/dominio educativo. Se eligieron datos sintéticos locales para reproducibilidad y límites explícitos; no se integraron sistemas reales.

La siguiente IA debe leer contexto, inspeccionar código, respetar progreso y respaldos y pedir únicamente la información necesaria para el alcance solicitado. No repetir investigación ni fases terminadas sin motivo, no reconstruir módulos innecesariamente, no ampliar funciones por iniciativa propia, no efectuar cambios destructivos sin autorización y documentar toda modificación importante. Un permiso futuro de rediseño puede sustituir las restricciones visuales de fases anteriores; no autoriza por sí solo cambiar fuentes, IDs, motor, persistencia o premios. Seguir la guía por procedimiento y actualizar fecha, evidencia y pendientes del próximo checkpoint.

## Comprobaciones ejecutadas en este traspaso

La inspección registró versiones instaladas, cantidades de catálogo, guardia previa y coincidencia de las fuentes del informe Parrot con las instaladas antes del handoff. Se comprobaron las rutas enlazadas, los archivos de código mencionados con rutas de raíz, las anclas y los scripts/comandos documentados. Los destinos de ejemplo para futuras pruebas están identificados como tales; no son carpetas de evidencia ya producida.

La [validación offline del handoff](../output/soc-simulator-v1/validacion/2026-10-17T07-25-36-681Z/ejecucion.json) pasó: **111/111 unitarias, cero fallos/omisiones**, TypeScript, build, sintaxis de runners, generación determinista y guardias antes/después, con fuentes probadas coincidentes al finalizar. La preparación leyó la fuente SC-200 completa y sus derivados permanecieron idénticos. No se ejecutaron Playwright, instalaciones o actualizaciones de dependencias de nuevo.

El [registro verificable del traspaso](../output/handoff-ia/2026-10-17T07-17-14-791Z/verificacion.json) enlaza inventario previo/final, comprobación documental y límites. `src/`, tests, datasets, configuración y motores permanecen iguales. Fuera de documentación/artefactos nuevos, el único archivo ajustado es `scripts/simulator-reconciliation.mjs`, exclusivamente los literales de ubicación y SHA del nuevo manifiesto documental. Su cuerpo lógico es idéntico; las otras entradas del manifiesto son idénticas y el cuerpo histórico de RETOMAR se recupera literalmente retirando la inserción nueva. No se alteraron resultados anteriores, fuentes canónicas ni skills; no hubo commits ni publicación.

Incertidumbres conservadas: revisión humana educativa/visual/accesible pendiente, paridad Splunk 320 sin cierre posterior, vigencia futura de enlaces oficiales no verificada, ausencia de importación general de progreso y reconstrucción en otra máquina dependiente de la fuente externa/respaldos/skills. Este documento no promete autosuficiencia de un clon Git ni aprobación humana que no existe en los informes.
