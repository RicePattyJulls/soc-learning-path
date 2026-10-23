# Retomar SOC Learning Path · SOC Simulator V1.0 / Splunk V2.0 / SC-200 V2.5

## Traspaso documental para futuras IA · 17/10/2026

Entrada: [CLAUDE.md](../CLAUDE.md). Arquitectura y estado vigente: [HANDOFF-IA.md](HANDOFF-IA.md). Procedimientos: [GUIA-CAMBIOS-FUTUROS.md](GUIA-CAMBIOS-FUTUROS.md). Este traspaso conserva el código funcional y todo el historial siguiente.

El simulador ya superó [Parrot 2026-10-17T06-59-48-681Z](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/simulator/resultados.json): `passed_automated_human_review_pending`. El maestro distingue ese resultado de la revisión manual pendiente y de la paridad histórica Splunk a 320 px, que sigue abierta. Los checkpoints siguientes reflejan su fecha; sus frases «navegador pendiente» del simulador quedan actualizadas por esta evidencia posterior, sin borrar los intentos anteriores.

Para continuar dentro de meses o años, leer primero esos tres documentos y contrastar el código/evidencias presentes; no reconstruir ni repetir fases terminadas. La nueva [conciliación documental exacta](HANDOFF-CONCILIACION-SIMULATOR.json) conserva los inventarios previos. No se autoriza otra fase, commit ni publicación.

---

## Checkpoint cierre de revisión Linux y Windows + AD, y limpieza · 19/10/2026

**Guardia de revisión del propietario montada en Linux y Windows + AD (sin declarar).** Mismo patrón que el Mundo SOC: registro + declaración + guardia. Ambos siguen en `draft_pending_owner_review` y **no existe** su `REVISION-PROPIETARIO.json`: la revisión humana de las 96 + 84 lecciones sigue siendo del propietario.

- **Guardia:** `scripts/prepare-linux.mjs` y `scripts/prepare-windows-ad.mjs` fallan si el catálogo declara `owner_review_complete` sin registro, si el registro no coincide con el catálogo o con sus cambios, o si `evidence.lessonsDigest` (SHA-256 de `«<id>=<sha256 de la lección>»` unidos por `:`, ordenados por id) no cuadra con las lecciones. Probado en una copia aislada (cierre válido, lección alterada, declaración sin registro y registro falseado).
- **Herramienta:** `scripts/owner-review.mjs <linux|windows-ad>` diagnostica sin escribir; con `--close --date AAAA-MM-DD [--changes <ids de lección>]` escribe registro y declaración. Hoja de trabajo: `docs/CHECKLIST-REVISION-PROPIETARIO.md`. Prueba: `tests/owner-review.test.ts`.
- **Limpieza:** capturas históricas (607 ficheros de `output/playwright/`) archivadas en `output/archivo-capturas-historicas.tar.zst` (verificado con `tar -d`; ver `output/archivo-capturas-historicas.md`). Borrados `dist/`, la caché `tsconfig.tsbuildinfo` y `.aws/.codex/.git` vacíos. Los 27 archivos únicos de la carpeta de trabajo del Desktop (herramientas de autoría, especificaciones, prompts) están en `references/origen-mundos-3-6/`; las 422 notas fuente siguen en `~/Documentos/HACKING`.
- **Respaldo previo:** `output/owner-review-guard-2026-10-19/respaldo/` (incluye RETOMAR, manifiesto de conciliación y `simulator-reconciliation.mjs` anteriores).
- **Verificación:** 14/14 guardias, `tsc -b`, `npm test` **129/129**, build.
- **Pendiente:** revisión del propietario de Linux y Windows + AD; revisión educativa independiente de todos los mundos; ejecución real de consultas KQL/SPL y laboratorios (`practicalStatus: not_assessed`).

---

## Checkpoint Mundo SOC y los seis mundos · 19/10/2026

**Integrados Redes, Windows + AD, Linux y el Mundo SOC; revisión del propietario del Mundo SOC cerrada.** El inventario vigente es [MAPA-MUNDOS.md](MAPA-MUNDOS.md): seis cursos y el simulador, con conteos y estado de revisión verificados contra el disco. Los tramos anteriores de este traspaso son del 17/10 y describen solo tres áreas.

- **Mundo SOC** (`#/soc/...`): 40 casos de entrevista/triaje N1/N2 en 8 bloques. Se responde en texto libre, se revela la respuesta modelo (KQL/SPL) y se autoevalúa con rúbrica. Tablero filtrable sin bloqueos, progreso propio (`soc-learning-path:soc:learning:v1`) y cola de repaso espaciado (`#/soc/repaso`). Rutas: `#/soc/ruta`, `#/soc/caso/<id>`, `#/soc/repaso`, `#/soc/fuentes`, `#/soc/progreso`.
- **Aislamiento:** ruta, payloads (`public/soc-content`: 40 casos + 40 respuestas), clave de progreso y generadores propios; no comparte nada con los otros mundos. Las respuestas modelo viven solo en los `.answers.json`, separadas del payload del estudiante.
- **Contrato de integridad:** carpeta maestra `SOC_MASTER_RESEARCH/`, manifiesto de 60 hashes y verificación SHA-256 en el cliente. El generador (`scripts/prepare-soc.mjs`) rechaza la revisión si su `casesDigest` no coincide con los 40 casos publicados; el registro vive en `SOC_MASTER_RESEARCH/VALIDACION/REVISION-PROPIETARIO.json`.
- **Revisión:** propietario **aprobada sin cambios** el 19/10/2026 (59/59 hashes de fuente intactos). Pendientes declarados: revisión **independiente** (`independent: false`) y **ejecución real** de comandos/consultas (`practicalStatus: not_assessed`, `commandsExecuted: false`). Contenido 100 % sintético de laboratorio.
- **Reinicio corregido:** el corte duro (`resetAt`) descarta al fusionar cualquier dato escrito en o antes del reinicio; antes resucitaba lo borrado al unir con la copia en disco.
- **Verificación del cierre:** `npm run prepare:soc` (40 casos, 0 redacciones), `npx tsc -b`, `npm test` **127/127**, **14/14** guardias y **52/52** comprobaciones de navegador. Docs: `docs/soc/PLAN-INTEGRACION.md`, `docs/soc/REPASO-ESPACIADO.md` y `docs/soc/REVISION-PROPIETARIO.md`.
- **No repetir:** Redes, Windows + AD, Linux y el Mundo SOC están integrados y verificados; no reconstruir esas fases. Los otros mundos conservan su revisión pendiente (`draft_pending_owner_review` / `pending_independent_review`).

---

## SOC Simulator V1.0 · 17/10/2026

**Implementado y validado offline; fase pendiente de navegador, no cerrada.** Leer [SOC-SIMULATOR-V1.md](SOC-SIMULATOR-V1.md). Cuatro simulaciones funcionales: Microsoft acceso sospechoso y actividad legítima (N1), Splunk identidades (N1) y escalado con evidencia incompleta/ingesta tardía (N2). Un motor, 50 eventos sintéticos; CSV originales reutilizados sin cambios.

- Consola: bandeja, filtros locales por entidad/código/UTC, examen y pivotes, cronología, selección y relaciones de evidencias, hipótesis/explicación rival, decisión/prioridad/escalado, informe y evaluación desglosada 20/25/20/20/15. Sin intérprete KQL/SPL, productos reales ni acciones externas.
- Guardado independiente por plataforma: soc-learning-path:simulator:microsoft:v1 / soc-learning-path:simulator:splunk:v1. Registra competencias, borradores, evidencias, relaciones, decisiones, informes, intentos y resultados. Entregas inmutables, reintentos sin duplicados. No lee ni escribe claves educativas; no otorga XP o dominio práctico.
- La nota verifica relaciones/IDs/decisiones y trazabilidad del informe. No se juzga semánticamente la prosa; revisión humana pendiente incluso con 100/100. Abrir eventos no puntúa y afirmaciones estructuradas sin soporte penalizan.
- Las academias conservan SC-200 13/76/719/272 y Splunk 11/80/240. Lectores, atlas, mapas, río R02, contenidos, revisiones, motores de progreso, XP y prerrequisitos intactos. Solo se extienden el dispatcher y un enlace en el selector; Sc200App permanece literal.
- Respaldo previo: output/soc-simulator-v1/respaldo/inventario.json, 358 copias; SHA del mapa 3aa4bbcbd73ab01ab0c12f0f3ad2c62e1bb9a04fb60c2571da4cb135dd8ec51d; 416 fuentes/evidencias protegidas adicionales. No sobrescribir inventarios anteriores. Guardias concilian exclusivamente rutas/hashes exactos y verifican las dos extensiones de navegación.
- Validación offline: 111/111 pruebas, TypeScript/build, datasets deterministas e integridad antes/después. 13 pruebas nuevas cubren cuatro recorridos del motor, negativos, recuperación, reintentos, ocultación de respuestas y separación de almacenamiento. Informe actual: output/soc-simulator-v1/ultima-offline.json.
- Navegador: intento nuevo bloqueado antes de abrir páginas, Chromium setsockopt/SIGTRAP; Vite listen EPERM. output/soc-simulator-v1/ultima-browser.json y logs Vite. Cero capturas, medidas DOM o recorridos UI aprobados. No sudo/permisos globales/reintentos equivalentes. Responsive/axe/foco/zoom y cuatro recorridos reales pendientes en Parrot.
- V2.0 conserva su pendiente de navegador y el fallo histórico de paridad-dom a 320 px. No confundirlos con una regresión del simulador ni declarar V2.0 completamente validada.

Verificar offline:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/simulator-integrity.mjs
node scripts/validate-simulator.mjs
```

Terminal A:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-simulator.mjs --browser --base-url http://127.0.0.1:5187/
```

Abrir #/simulador/microsoft o #/simulador/splunk, o Centro SOC desde cada academia. Los runners usan perfiles/contextos sintéticos aislados, sin progreso personal. Revisar informes, capturas y todos los axe incomplete. No aceptar solo sintaxis del runner como prueba ejecutada.

**Parada:** implementación de cuatro casos y pruebas offline completas; aceptación de navegador pendiente. No ampliar funcionalidades ni modificar lectores/mapas/XP para cerrar pendientes ajenos. Sin commits, publicación, ataques, backend ni servicios reales.

## Checkpoint Splunk V2.0 · 17/10/2026

La autorización expresa R04–R11 de esta fase sustituye las restricciones históricas de ampliación. **Integradas las 62 lecciones restantes en una sola fase: 11 regiones, 80 lecciones, 160 MCQ y 80 prácticas formativas, 240 actividades.** Leer [entrega completa V2.0](SPLUNK-V20-INTEGRACION-COMPLETA.md). No repetir la investigación ni el trabajo de importación terminado.

- **Contenido implementado:** cinco paquetes corregidos existentes, 400 pasos guiados, 22 laboratorios, 20 CSV/152 filas; 94 derivados generados y recursos/payloads diferidos. Nombres de las ocho regiones nuevos tomados de la investigación curricular existente.
- **Protegido:** SC-200 13/76/719/272, sus fuentes/componentes/estilos/motores y las primeras 18 lecciones Splunk con sus 54 actividades, revisiones, requisitos y payloads idénticos. Los originales editoriales y currículo permanecen intactos. Puerto/Río/Bosque conservan configuración y renderizadores; **río R02, puentes y fondo sin cambios**.
- **Progreso:** misma clave/esquema/motores; ninguna migración ni lectura del perfil personal. Guardado sintético anterior conserva 840 XP, registros, intentos y posición sin premios nuevos al ampliar catálogo. Completar 80/11 permite hasta 3500 XP provisionales con los mismos 30 por lección y 100 por región, únicos; cero XP definitivos y práctica no evaluada.
- **Lector:** conserva tres columnas/cinco etapas SC-200. Se mantienen las correcciones de títulos únicos y navegación ordenada: reanudar puede ir a 4 si 1–3 están estudiados; selección explícita, volver atrás y Continuar no pierden progreso. Markdown original intacto. Documentación previa: SPLUNK-V122-LECTOR-SC200.md y SPLUNK-LECTOR-CORRECCIONES.md.
- **Prerrequisitos:** resueltos a IDs reales de los preámbulos, no de la posición del mapa. R10 abre desde R01–R05; R11 requiere R07/R09/R10. R08/R09 aplican conservadoramente sus rangos documentales completos; la granularidad «según tema» necesita revisión humana, no se presenta como un grafo machine-readable ya existente en el currículo. Tabla y arrays en entrega/catálogo/informe derivado.
- **Validado offline:** 98/98 unitarias sin fallos/omisiones, TypeScript y build; importación determinista 80/240; cinco paquetes y 47 regresiones editoriales seleccionadas. El test histórico de snapshot pre-piloto continúa excluido explícitamente, sin afirmar 48/48. Guardias y copias verificadas antes/después. Resultado/códigos y hashes: output/splunk-v20/ultima-offline.json.
- **Respaldo previo:** output/splunk-v20/respaldo/inventario.json, 281 copias verificadas; SHA del mapa c2ab7acdf5b5e45cb4de95c0a5ca4769514a7010699b974ca17f84f33ec756b8; 324 archivos de investigación/evidencia protegidos adicionales. No sobrescribir respaldos históricos. La conciliación V2.0 acepta solo ruta/hashes antiguos/finales exactos y conjuntos cerrados; el RETOMAR nuevo es un cambio documental expresamente autorizado.

### Pendientes verificables

- **Sin PASS visual V2.0:** nuevo intento paridad-dom bloqueado antes de abrir páginas por Chromium/setsockopt/SIGTRAP; Vite devuelve listen EPERM en 127.0.0.1:5187. output/splunk-v20/ultima-browser.json y logs Vite. Cero capturas/mediciones DOM nuevas. No usar sudo ni permisos globales ni repetir lanzamientos idénticos en el agente.
- **Fallo real anterior del atlas sin cerrar:** Parrot 2026-10-16T22-21-56-027Z sí ejecutó Chromium. near(master.progress.width,adapted.progress.width,'Panel') falló a 320 px: 282.59375/295.203125, delta12.609375, por expansión intrínseca del panel/estadísticas. No era el lector ni EPERM. Se conserva evidencia y aserción estricta; no se cambian mapas anteriores para ocultarlo.
- **Accesibilidad:** Recursos R03 V1.1 fallaron contraste de código y pre desplazable sin foco. Sus correcciones y aserciones axe siguen intactas. Confirmación V2.0, incomplete/manual, teclado/zoom/reduced motion y responsive real pendientes de navegador.
- **Educación:** revisión técnica/pedagógica independiente pendiente para las 80. Teoría 80%=2/2; P01 formativa sin autocorrección/dominio automático. No se ejecutó Splunk/ES/SOAR real.

### Continuación exacta en Parrot

No integrar más contenidos ni rediseñar. Ejecutar con perfiles sintéticos aislados, manteniendo el perfil/progreso personal intacto.

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/splunk-v20-integrity.mjs
node scripts/validate-splunk-v20.mjs
```

Terminal A:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-splunk-v20.mjs --browser --base-url http://127.0.0.1:5187/
```

El runner prepara paridad 390/768/1024/1440/1920/2560 y 320, lector/mapas/recursos a 320/390/768/1440/1920, recorrido UI de 80 lecciones, cinco etapas/pasos, reanudación, aislamiento e historial, y regresiones SC-200 completas/compatibilidad/axe. Si Chromium arranca, un fallo de atlas no oculta los informes del lector; cualquier fallo mantiene la aceptación global pendiente. Revisar capturas/matrices a igual resolución y todos los incomplete antes de afirmar equivalencia visual. No basta con sintaxis de runners.

**Parada de esta fase:** integración R04–R11 completada en código/datos y validada offline; navegador y aceptación visual pendientes. Sin commits, publicación, backend, ataques ni servicios Splunk. No avanzar automáticamente a otra fase.

## SC-200 V2.5 · estado conservado

Versión **0.2.5**. **V2.3 y V2.4 terminadas y validadas; V2.5 integrada y validada técnicamente con cobertura educativa parcial.** No se declara 76/76.

Leer [la entrega V2.5](V2.5-ACADEMIA.md), [estado verificable](V25-ESTADO.md) e [inventario por lectura](V25-COBERTURA.json). Último lote válido: **12**. Validación integral ejecutada; informe: output/playwright/v25-final/final-validation.json.

1. **Regiones:** 13 premium diferenciadas, desde Valle de acceso hasta Ciudad de las conexiones. Renderizador SVG/CSS compartido y panorama V2.2 conservados.
2. **Capturas:** [galería actual](../output/playwright/v25-final/index.html), [escritorio](../output/playwright/v25-final/full-width/despues-atlas-1440.png), [móvil](../output/playwright/v25-final/world/region-10-390.png), [actividad 320 px](../output/playwright/v25-final/compatibility/short-reading-feedback-320.png).
3. **UX y movimiento:** selector persistente, retorno/foco al nodo, historial Atrás, teclado/Escape, lector con acento de región, pulsación 120 ms, feedback 150 ms y navegación/recompensas 200 ms; movimiento reducido y ausencia de bucles.
4. **Educación:** 74/76 lecturas, 272 actividades (237 nuevas + 35 originales). 65/67 lecturas inicialmente pendientes enriquecidas. Conservados 13 capítulos/719 pasos/IDs/Markdown original saneado.
5. **Pendiente:** introducciones de workloads (cap. 3) y mapa KQL (cap. 13), por falta de contenido técnico propio evaluable. Conservan estudio y finalización, sin dominio. Decisiones detalladas: scripts/v25/review-decisions.json.
6. **Pruebas:** 42 unitarias, TypeScript/build; 11 grupos educativos con las 272 actividades bien/mal; 76 registros V2.4/65 revisiones; 84 escenarios de mundo, 98 de layout y 13 grupos UX; 0 violaciones axe en 78 vistas; perfiles aislados.
7. **Rendimiento:** 126.0→141.4 KiB gzip de JS/CSS inicial (+15.4); 72 muestras V2.2/V2.5 en performance/performance.json. Persisten tareas largas; sin afirmaciones de FPS. Tabla en la entrega.
8. **Límites:** dos pendientes educativas; revisión semántica del agente, no humana/independiente; sin tenant Kusto, Safari/Firefox, dispositivo físico ni lector de pantalla manual. No hay bloqueo técnico confirmado.
9. **Compatibilidad:** claves/esquema LocalStorage, 80%, XP/niveles/premios únicos, completado/dominado, repaso y exportación conservados. Revisión V2.4 anterior permitida solo con misma fuente/pasos y sin actividades previas; se preserva historial sin regalar dominio.
10. **Ejecución:** npm run dev desde el proyecto y abrir http://127.0.0.1:5173/ con el mismo perfil/origen. Alternativa: python3 -m http.server 5173 --bind 127.0.0.1 --directory dist.

No repetir lotes válidos. Regenerar derivados mediante scripts/prepare-content.mjs; no editar src/generated ni public/content a mano. Antes de nuevas actividades, revisar fuente, estado, hashes y compatibilidad de revisiones. No modificar SC-200.md, skills ni otros proyectos. Splunk: consultar el estado actual al principio de este documento; sin backend, autenticación, commits ni publicación.

Proyecto definitivo: /home/tommy/Documentos/SOC_LEARNING_PATH. No necesita copias de /tmp. Respaldos seguros: output/v25/respaldo-v24.zip y output/v25/reanudacion/respaldo-inicio.zip.
