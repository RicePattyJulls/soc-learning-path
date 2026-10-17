# Guía práctica de cambios futuros

17/10/2026. Procedimientos para una **tarea nueva autorizada**, no una lista de cambios pendientes que deban implementarse automáticamente. Leer primero [CLAUDE.md](../CLAUDE.md), [AGENTS.md](../AGENTS.md), [HANDOFF-IA.md](HANDOFF-IA.md) y el checkpoint pertinente de [RETOMAR.md](RETOMAR.md).

Los diseños actuales son la referencia de continuidad. **El usuario puede autorizar su evolución o un rediseño completo.** Por defecto se conservan paisajes y especialmente el río R02. Un permiso de rediseño no implica permiso para cambiar el currículo, las claves de almacenamiento, los premios o el motor educativo.

## Preparación común

1. Define el resultado solicitado y los módulos afectados. Inspecciona el JSX/CSS/generador real antes de proponer una sustitución. No rehagas investigaciones o módulos funcionales sin motivo.
2. Comprueba catálogo, estado de pruebas y origen/perfil que usa el estudiante. No consultes el contenido de su LocalStorage ni lo uses como fixture. Si el cambio puede afectarlo, pide que conserve sus exportaciones privadas mediante las acciones ya existentes.
3. Crea un respaldo **nuevo y fechado** de archivos afectados, configuración, lockfile, generadores, catálogos/derivados y manifiestos de guardias. Registra SHA-256, alcance y comando de recuperación. No sobrescribas `output/` histórico ni uses una carpeta de destino dentro de sí misma al copiar. Un backup de código no es un backup del progreso del navegador.
4. Ejecuta `node scripts/simulator-integrity.mjs` y conserva su salida previa. Su cadena incluye las guardias anteriores. Si falla, identifica el archivo/diferencia exacta; no actualices hashes para ocultar una modificación desconocida.
5. Lee las skills locales pertinentes si están disponibles; son un enlace externo y no deben editarse como parte de la academia. La autorización actual del usuario determina el alcance.
6. Realiza el cambio mínimo que cumpla la tarea. Para UI, toca presentación y adaptadores de presentación; conserva los contratos que no hayan sido autorizados.
7. Ejecuta las pruebas aplicables, compara hashes/diferencias y documenta resultado, limitaciones y siguiente checkpoint. No inventes resultados ni capturas, no añadas funciones no pedidas y no publiques ni hagas commits sin una instrucción nueva.

### Guardias y cambios autorizados

Las guardias tienen supuestos de fases concretas: hashes de código, conjuntos cerrados de lecciones y comparaciones literales. **No basta editar una allowlist para cualquier cambio**: algunas guardias prohíben expresamente cambiar motores/renderizadores originales y reconstruyen el dispatcher exacto.

Si una nueva autorización afecta a esos archivos, preserva los inventarios originales y registra el alcance y hashes antes/después en una conciliación versionada. Adapta únicamente las comprobaciones que la autorización vuelve históricas, conserva las demás y añade comprobación negativa para cambios ajenos. No elimines aserciones, tolerancias o saneado para lograr un PASS. No regeneres retrospectivamente un inventario de respaldo con los archivos nuevos.

El handoff actual tiene una excepción documental concreta: [HANDOFF-CONCILIACION-SIMULATOR.json](HANDOFF-CONCILIACION-SIMULATOR.json), fijada desde `scripts/simulator-reconciliation.mjs`. No autoriza rediseños ni cambios de contenido. Para otra edición de RETOMAR, crear una revisión verificable de esa conciliación; conservar la anterior y validar que solo cambió el documento autorizado. Los detalles de la cadena de guardias están en el maestro.

## 1. Cambiar la interfaz visual

**Archivos.** `src/main.tsx` define las capas CSS; `src/styles.css`, `tokens.css`, `adventure.css`, `premium.css`, `full-width.css`, `world.css`, `experience.css` y `academies.css` definen la base. Vistas SC-200 en `src/components/`; ajustes Splunk en `src/splunk/`; consola en `src/simulator/SimulatorApp.tsx` y `simulator.css`.

**Procedimiento.** Identifica la vista y su ruta. Lee el orden de CSS y las reglas que realmente ganan en DevTools; toma una captura/medida con viewport y estado conocidos. Elige tokens o un selector acotado al módulo. Para un rediseño amplio, registra qué referencias actuales deja de exigir el usuario y prepara nuevas capturas de aceptación; conserva una referencia anterior accesible. Mantén accesibilidad, contenido y eventos existentes salvo autorización contraria.

**Dependencias y riesgos.** Compartir `.site-header`, `.station-*`, `.academy-grid` y `.activity-surface` puede afectar a las dos academias. Las hojas de módulos cargadas no deben considerarse una frontera de aislamiento perfecta. Cambiar solo el texto para cuadrar el layout puede modificar nombres accesibles; recortar títulos o usar `overflow:hidden` puede ocultar un defecto. No alteres Markdown para corregir CSS.

**Pruebas y límites.** `npm test`, `npm run build`, guardia antes/después y suites visuales del módulo. Para cambios compartidos, prueba las tres áreas, 320 px, breakpoints, zoom, teclado/foco y reduced motion; usa capturas reales a igual resolución. La nota aprobada del simulador no valida la paridad de los atlas. Conserva por defecto los paisajes actuales; solicita alcance si el rediseño los incluye y no está claro en la nueva tarea.

## 2. Añadir componentes

**Archivos.** Reutiliza `src/components/Primitives.tsx` para botones de estado/barras/iconos y los marcos existentes. `src/components/learning/LessonFrame.tsx` es presentación sin almacenamiento, consumida actualmente por Splunk. El JSX maestro SC-200 sigue en `LearningReader.tsx`. Para componentes exclusivos, usa el directorio del módulo. Entradas/error boundaries: `src/App.tsx`, `CourseBoundary.tsx`, `src/simulator/SimulatorBoundary.tsx`.

**Procedimiento.** Busca primero una implementación equivalente. Define props tipadas y separa eventos de presentación de las funciones que cambian progreso. Mantén el componente independiente del catálogo/LocalStorage si se pretende reutilizarlo. Integra en la ruta autorizada, con carga diferida solo si aporta utilidad; no montes un segundo hook de progreso para dibujar una tarjeta.

**Riesgos.** Una importación de `src/lib/catalog.ts` introduce datos SC-200; una importación de `src/splunk/progress.ts` introduce otro motor. Reutilizar una vista completa puede llevar URLs, cofre o etiquetas del curso equivocado. Un nuevo punto de entrada no debe ejecutar los hooks de las otras academias.

**Pruebas y límites.** TypeScript/build, tests de comportamiento para lógica nueva significativa y recorrido UI del componente. Comprueba nombres accesibles, HTML nativo, foco, estados de error y 320 px. No añadas backend, auth, dependencias o pantallas nuevas como efecto secundario de extraer un componente.

## 3. Modificar mapas y paisajes

**Archivos.** `src/components/Roadmap.tsx`, `Chapter.tsx`, `src/components/adventure/RegionMap.tsx`, `AdventureMap.tsx`, `useAdventureLayout.ts`; `src/lib/adventure-catalog.ts`, `adventure.ts`, `pilot-landscape.ts`, `original-map-geometry.ts`, `region-visuals.ts`. Arte: `Artwork.tsx`, `PilotLandscape.tsx`, `PremiumLandscape.tsx`, `LandscapeSymbols.tsx`, `LandscapeLandmark.tsx`, bajo `src/components/adventure/`. Splunk: `SplunkMap.tsx`, `PremiumWorld.tsx`, `world-model.ts`, `premium-world.css` bajo `src/splunk/`.

**Procedimiento.** Distingue geometría compartida, metadatos de un paisaje y componentes de curso. Comprueba consumidores con `rg` antes de tocar un helper. Usa el layout medido para camino/nodos/cofre y la misma curva de agua para cruces/puentes. Para retocar una región, cambia sus metadatos antes que el renderizador completo cuando baste. Si hay rediseño autorizado, versiona las nuevas referencias visuales y adapta las guardias de esa fase de forma explícita.

**Río R02.** La configuración efectiva es `splunkWorlds.river` en `src/splunk/world-model.ts`; la dibujan `PremiumLandscape` y `pilotLandscape`, con `PilotBridges`. Conserva por defecto su paleta, curva, anchura, terreno y cruces. `RegionScene.tsx` y `worldLayout` son implementaciones históricas conservadas, no el layout cliente actual. Una autorización explícita puede permitir cambiarlos/rediseñar R02, pero debe identificar el nuevo alcance y las nuevas referencias; no deducir ese permiso de un arreglo de lector.

**Riesgos.** Medición de placas, requisitos expandidos, overlay y fuentes alteran alturas. No ajustar un puente por una coordenada aislada ni mover el río para hacer pasar una prueba de ancho. No obtener desbloqueos de la posición gráfica: los estados deben seguir viniendo de los motores.

**Pruebas.** `tests/adventure.test.ts`, `pilot-landscape.test.ts`, `region-visuals.test.ts`, `splunk-v121.test.ts` y demás unitarias mediante `npm test`; build/guardias. Navegador SC-200 con `--world`, `--full-width`, `--experience`; Splunk con `validate-splunk-v20.mjs --browser`. Compara nodos, puentes, cofre, overlay y foco de retorno en 320/390/768/1024/1440/1920/2560 cuando corresponda. La aserción histórica del panel a 320 no se elimina ni relaja para aprobar otro cambio.

## 4. Cambiar estilos de lecciones

**Archivos.** SC-200: `src/components/LearningReader.tsx`, `Reader.tsx`, `QuestionCard.tsx`, `Review.tsx`, CSS global/experience. Splunk: `src/splunk/SplunkReader.tsx`, `SplunkMarkdown.tsx`, `reader-presentation.ts`, `reader.css`, `src/components/learning/LessonFrame.tsx`. Tipos educativos: `src/education.ts` y `src/splunk/types.ts`, solo si el alcance incluye cambiar contratos.

**Procedimiento.** Mantén índice/fases, superficie principal y contexto. Para encabezados duplicados, comprueba el renderizador y el heading inicial; no recortes el Markdown original. Usa los componentes de código/tabla con región enfocables y scroll interno. Conserva los handlers de respuesta y el bloqueo de soluciones durante intentos.

**Dependencias y riesgos.** SC-200 interpreta `paso` desde 0; Splunk, desde 1. En Splunk, «reanudar primer pendiente» y «selección explícita/Aprende/Continuar» son intenciones diferentes ya corregidas. No vuelvas a mezclarlas. El borrador formativo Splunk no es un informe persistido del simulador. Cambios en labels envolventes pueden romper `getByLabel` exacto con selects/textarea: elegir roles y nombres accesibles conforme al DOM, no aflojar aserciones.

**Pruebas.** `npm test`, build y suites educativas/compatibilidad; prueba dirigida `node tests/splunk-reader-fixes-browser.mjs --base-url http://127.0.0.1:5187/` para los cinco pasos. Ese runner crea salida fechada. Prueba leer atrás/adelante, recargar URL explícita, reanudar en 4 con 1–3 vistos, un título por sección, original íntegro, foco del feedback, teclado y 320 px. No cambiar premios, contenido o revisiones por un arreglo de estilo.

## 5. Ampliar el simulador

**Archivos.** Contratos `src/simulator/types.ts`; reglas/acciones `engine.ts`, `investigation.ts`; guardado `storage.ts`, `useSimulator.ts`; consola `SimulatorApp.tsx`, `simulator.css`; puntuación `grading.ts`, `rubrics.ts`. Navegación externa solo si se necesita: `src/App.tsx`, `src/components/AcademySelector.tsx`.

**Procedimiento.** Clasifica la ampliación: presentación, filtro, acción de expediente o contrato persistido. Define comportamiento y límites offline antes de escribir UI. Mantén funciones puras del motor y eventos documentales; no importes motores educativos. Si cambia el esquema, prepara validación/migración con copias y fixtures antiguos antes de habilitar escritura.

**Riesgos.** El guardado actual rechaza escenarios, acciones o afirmaciones desconocidos para no sobrescribir información no interpretable. Cambiar IDs puede bloquear toda la clave de una plataforma. Un filtro local nunca debe presentarse como KQL/SPL real. No conceder XP ni realizar contención/envíos externos como extensión implícita.

**Pruebas.** `tests/simulator.test.ts`, fixtures antiguos/nuevos/corruptos, entrega inmutable, reintento, merge entre pestañas y cero consultas a claves educativas; ejecutar `node scripts/validate-simulator.mjs`. Luego Playwright del simulador, revisar `incomplete`, negativos y capturas. Backend/integraciones reales requieren una tarea separada que reconsidere la V1 local.

## 6. Añadir escenarios SOC

**Archivos.** `src/simulator/scenarios.ts`, `rubrics.ts`, `types.ts` si procede; `scripts/prepare-simulator.mjs`; fixtures `scripts/simulator/microsoft-events.json` o una nueva fuente sintética autorizada; `tests/simulator-fixtures.ts`, `simulator.test.ts`, `simulator-browser.mjs`; guardias/orquestador `scripts/simulator-integrity.mjs`, `validate-simulator.mjs`.

**Procedimiento.** Define un ID estable, plataforma/N1–N2, alerta, objetivos, fuentes con procedencia, entidades, ventanas UTC, corte de disponibilidad, afirmaciones y alternativas válidas. Prepara evidencia suficiente para cada decisión defendible y límites explícitos. Conserva eventos/IDs originales reutilizados; usa datos de entrenamiento, no registros personales. Añade la adaptación al generador y su rúbrica, después las soluciones de test. Regenera solo con `node scripts/prepare-simulator.mjs` y revisa el manifiesto y hashes resultantes.

**Dependencias.** El generador actual enumera cuatro datasets y fuentes concretas; no es un importador abierto de cualquier archivo. Actualiza expresamente los conjuntos/cantidades y revisión para el escenario nuevo. El orquestador de navegador espera **nueve recorridos** actuales: cuatro casos × dos anchos + negativo; los tests/guardias también tienen expectativas 4/50. Ampliarlos coherentemente conserva la exigencia de completitud; no suprimirla. No editar `public/simulator-data/` a mano ni modificar los CSV canónicos para adaptarlos al test.

**Revisiones.** La revisión del escenario se deriva actualmente del hash del dataset. Cambiar objetivos, acciones o rúbrica sin cambiar eventos no la incrementa automáticamente: planificar una revisión explícita del contrato y conservar resultados entregados. La rúbrica también tiene versión propia; no recalificar silenciosamente intentos históricos.

**Pruebas y límites.** Añade recorrido correcto, alternativa conservadora, negativo de atribución/impacto, ruido, falta de evidencia crítica, rango UTC y llegada tardía si existe. Valida entrega/recarga/reintento en ambos anchos, persistencia de escenarios anteriores y nombres accesibles. Los materiales docentes diferidos no deben mostrarse antes de entregar. Los escenarios siguen siendo entrenamiento, no ejecución SIEM ni certificación.

## 7. Mejorar evaluaciones o contenido

**SC-200.** Fuente externa `SC-200.md` bajo protección; actividades existentes en `scripts/activities.mjs`, lotes nuevos V2.5 en `scripts/v25/batch-*.json`, composición en `education.mjs`/`v25/index.mjs`; motor en `src/lib/learning.ts`, tipos en `src/education.ts`. Las dos introducciones pendientes necesitan autorización y material técnico suficiente; no inventar decisiones a partir del título. Para revisar una actividad, comprueba cita, línea, versión, alternativas y explicación; determina impacto en revisión y compatibilidad antes de regenerar.

**Splunk.** Canon, Markdown y bancos/manifiestos de los cinco paquetes en `SPLUNK_MASTER_RESEARCH/`; adaptador `scripts/prepare-splunk.mjs`, fuentes/prerrequisitos `splunk-v20-sources.mjs`; autocorrección en `src/splunk/progress.ts`. Localiza la entrada real en el manifiesto antes de editar. Cambiar el corpus canónico es un alcance editorial, no un arreglo visual. La ruta de importación actual conserva un conjunto cerrado de 80; añadir contenido exige revisar currículo/IDs/namespaces/hashes y todas las guardias relacionadas. P01 continúa formativa y sin XP automático hasta que otra tarea autorice y sustente una evaluación distinta.

**Simulador.** `src/simulator/rubrics.ts`, `grading.ts`, `investigation.ts`; cinco dimensiones 20/25/20/20/15, umbral 80 y límites 59/79. Mejorar trazabilidad/soporte requiere evidencias concretas y alternativas válidas, no frases esperadas. Un cambio semántico de evaluación debe versionarse y no alterar entregas previas.

**Pruebas y riesgos.** `npm test`, TypeScript/build, generador de la ruta, guardias y tests de respuestas correctas/incorrectas/revisión/reintento. Para Splunk, cinco `VALIDACION/comprobar_paquete.py` y `python3 -B scripts/splunk-v11-editorial-tests.py`. Para SC-200, verificar datos/citas/reconstrucción y compatibilidad de registros antiguos. Mantener 80 %, IDs y premios salvo autorización explícita; no confundir `completed`, `mastered`, `theoryPassed` y `humanReview:pending`. La revisión humana sigue siendo independiente de una suite automática aprobada.

## 8. Corregir errores

**Procedimiento.** Conserva el informe/captura/log exacto y su código de salida. Identifica versión, fuentes probadas, ruta, viewport, origen y estado sintético. Reproduce lo mínimo con un contexto aislado cuando el entorno lo permita. Comprueba flujo, DOM, árbol accesible y selector antes de decidir si el defecto es de aplicación, datos o test. Formula la causa demostrada y corrige esa causa.

**Ejemplo conocido.** Un textarea con valor dentro de un label hace que el texto que usa `getByLabel` exacto incluya su contenido. Se resolvió con `getByRole('textbox', { name: 'Resumen ejecutivo', exact: true })`, conservando `.isDisabled()` y el fieldset. Los selects tienen el mismo problema por sus opciones; el runner fue auditado completo. No resolverlo con timeout mayor, `.first()` sobre un control ambiguo, label cambiado, aserción eliminada o navegación artificial.

**Distinguir pendientes.** El fallo Parrot del panel Splunk a 320 px es real e independiente del simulador; los bloqueos `listen EPERM` o `setsockopt`/SIGTRAP antes de abrir una página son del entorno de esa ejecución. No atribuir uno al otro, repetir lanzamientos equivalentes ni solicitar permisos globales para aparentar validación.

**Pruebas.** Tests del comportamiento afectado, suite offline del módulo, build/guardias y navegador dirigido cuando sea posible. Ampliar solo si surge una preocupación nueva o hay dependencia compartida. Documenta qué se ejecutó, qué quedó preparado y qué evidencia cierra el fallo. Nunca reemplazar un informe fallido por otro JSON con PASS.

## 9. Actualizar dependencias

**Archivos.** `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`; depuración de integración en Markdown, iconos, Tailwind/CSS y tests de navegador. El estado de versiones inspeccionado está en el maestro; no es una recomendación de versiones futuras.

**Procedimiento.** Requiere una tarea de actualización con alcance. Respaldar lockfile y código; consultar changelogs/documentación oficial de las versiones elegidas, engines Node y cambios de API/seguridad. Cambiar el conjunto mínimo y conservar un lockfile reproducible. No ejecutar `npm update` o un autofix masivo como reparación de un selector. No migrar React/Vite/TS/Tailwind juntos por conveniencia si no se solicitó.

**Riesgos.** Markdown/sanitización pueden alterar HTML y hashes; Tailwind/orden de CSS, dimensiones y contraste; iconos, tamaño del bundle y build; Playwright/Chromium, nombres accesibles o resultados visuales. `playwright-core` no instala automáticamente el binario que esperan estos runners. No ignorar un engine incompatible ni asumir que el Chromium del sistema tiene la misma versión de una evidencia antigua.

**Pruebas.** En una instalación preparada, `npm ci` verifica instalación conforme al lockfile. Después `npm test`, TypeScript/build, guardias e importación determinista; comparar derivados/bundle, UI de las tres áreas, regresión educativa/persistencia, axe e `incomplete`. Si solo cambia documentación, no hay razón para actualizar paquetes. Este traspaso no instaló ni actualizó dependencias.

## 10. Ejecutar pruebas y recuperar una versión anterior

### Secuencia de validación

Comprobar primero la fuente SC-200 y que el entorno educativo sea el esperado: `pretest` y `prebuild` la regeneran. Desde la raíz:

```sh
node scripts/simulator-integrity.mjs
npm test
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
node scripts/simulator-integrity.mjs
```

Alternativa con logs y salida fechada para el alcance del simulador: `node scripts/validate-simulator.mjs`. Para integración Splunk, `node scripts/validate-splunk-v20.mjs`; inspecciona sus salidas auxiliares fijas antes de reutilizarlo para no sobrescribir diagnósticos anteriores. No hace falta ejecutar las dos baterías completas si una ya cubre el cambio y no hay incertidumbre adicional.

Para navegador en Parrot, terminal A:

```sh
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B, según alcance:

```sh
node scripts/validate-simulator.mjs --browser --base-url http://127.0.0.1:5187/
node scripts/validate-splunk-v20.mjs --browser --base-url http://127.0.0.1:5187/
```

Ejecuta únicamente la suite que corresponda; para cambios compartidos, ambas y las regresiones SC-200 necesarias. El [maestro](HANDOFF-IA.md#ejecutar-y-verificar) enumera comandos SC-200 y argumentos reales de `tests/e2e.mjs`. Usa siempre una carpeta de resultados nueva: los defaults de algunos runners educativos apuntan a carpetas históricas. Evita suites simultáneas al comparar rendimiento o capturas.

El informe debe registrar comando, código de salida, TAP, hashes y fechas. Diferencia pruebas nuevas de informes anteriores. Syntax-check no es recorrido UI, `axe violations=[]` no resuelve `incomplete`, captura disponible no significa revisión artística humana aprobada. Un resultado del simulador no cierra la academia Splunk ni el pendiente del panel de 320 px.

### Recuperación

1. Detén solo el proceso de trabajo que estés usando y guarda por separado las evidencias fallidas y el estado nuevo antes de restaurar. No borres carpetas ni uses `git reset --hard`/`git clean` sobre un trabajo desconocido.
2. Identifica el respaldo fechado y verifica su inventario SHA-256 antes de usarlo. Restaurar una fase antigua completa puede retirar Splunk/simulador o dejar código/catálogos incompatibles. Para un cambio puntual, restaura únicamente el conjunto relacionado que conoces.
3. Recupera juntos código/generadores/lockfile y derivados correspondientes; conserva las evidencias originales. Si se decide regenerar, usar la fuente de la revisión restaurada y comprobar hashes. No mezclar un `dist` antiguo con payloads/revisiones nuevas.
4. Restaura también la **referencia de conciliación compatible** si el rollback afectó a documentos protegidos. No reconstruir inventarios antiguos para que coincidan con el nuevo estado. Si el backup anterior al handoff carece de los documentos nuevos, preserva primero una copia de este contexto.
5. Valida con guardias, unitarias/build y la suite dirigida. Revisa con fixtures la continuidad de registros/revisiones, premios únicos, intentos y última posición. Si existe Git operativo, compara cambios selectivamente; esta inspección no encontró un repositorio Git utilizable, así que no se asume un commit de rescate.
6. El progreso personal **no se restaura al copiar código**. Mantén el origen/perfil y las exportaciones privadas. No hay importación general en la UI; cualquier restauración manual de claves debe estar autorizada, validar formatos y respaldar los valores anteriores. Nunca limpiar LocalStorage como primer paso.

Respaldos históricos conocidos: `output/v25/respaldo-v24.zip`, `output/v25/reanudacion/respaldo-inicio.zip`, `output/splunk-v121/respaldo/inventario.json`, `output/splunk-v20/respaldo/inventario.json`, `output/soc-simulator-v1/respaldo/inventario.json`. Son referencias de sus propias fases, no sustitutos automáticos del respaldo previo a tu cambio.

### Cierre del siguiente traspaso

Actualiza el estado vigente en el maestro o enlaza su sucesor; añade un checkpoint breve a RETOMAR conservando el cuerpo histórico. Registra archivos cambiados, causa/decisión, autorización que amplió alcance, pruebas ejecutadas, pendientes y rutas de evidencia. Concilia únicamente los cambios documentales exactos que las guardias protejan. Verifica enlaces y hashes y detente cuando se cumpla la tarea; no avances a otra fase por iniciativa propia.
