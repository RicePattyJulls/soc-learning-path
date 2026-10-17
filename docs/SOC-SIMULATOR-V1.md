# SOC Simulator V1.0 · Centro de operaciones N1/N2

17/10/2026. **Cuatro simulaciones funcionales implementadas, comprobadas offline y aprobadas en automatización de navegador en Parrot. Revisión humana pendiente; no se declara aprobación visual/manual completa.** No hay conexiones Microsoft/Splunk, ataques, backend, publicación ni commits.

## Estado vigente en el traspaso IA · Parrot aprobado

Arquitectura y estado transversal: [HANDOFF-IA.md](HANDOFF-IA.md). Procedimientos futuros: [GUIA-CAMBIOS-FUTUROS.md](GUIA-CAMBIOS-FUTUROS.md).

La ejecución [2026-10-17T06-59-48-681Z](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/ejecucion.json) terminó `passed`, con guardias antes/después y fuentes finales coincidentes. Su [resultado del simulador](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/simulator/resultados.json) es **`passed_automated_human_review_pending`** en Chromium 148.0.7778.178.

- Nueve recorridos completados: cuatro casos a 390 y 1440 px con 100/100; negativo a 1440 con 59/100. Recuperación de borrador, reintento e historial conservados.
- Bandeja/mesa de ambas plataformas a 320/390/768/1440/1920, foco/teclado, movimiento reducido, overflow, aislamiento y seis comprobaciones de montaje de rutas educativas aprobadas por el runner.
- **19 capturas reales** en la [galería de esa ejecución](../output/playwright/soc-simulator-v1/2026-10-17T06-59-48-681Z/simulator/index.html). Cero errores de página y cero solicitudes externas registradas.
- **29 vistas axe, cero violaciones automáticas; las 29 conservan `incomplete` de contraste.** Gradientes y algunos elementos parcialmente cubiertos necesitan revisión humana. Capturas disponibles no significan revisión visual aprobada, ni una nota estructurada demuestra calidad semántica del informe.

Los timeouts de Categoría inicial y Resumen ejecutivo descritos abajo quedaron superados por esta ejecución posterior, sin borrar sus informes. **La paridad histórica del atlas Splunk a 320 px sigue abierta**: esta suite no compara ambos atlas ni valida todas las 80 lecciones. Revisión educativa humana, zoom, lector de pantalla, contraste manual y validación en producto real siguen pendientes.

Los checkpoints que siguen conservan el estado y los comandos de sus fechas. Sus afirmaciones de «confirmación Parrot pendiente», «cero capturas» o «bloqueado antes de abrir páginas» describen esos intentos anteriores; no sustituyen el resultado aprobado de este apartado. El handoff no ejecutó Playwright de nuevo ni modificó la aplicación.

## Checkpoint anterior: auditoría completa de selectores Playwright · 17/10/2026

**Corregido el selector del informe; confirmación UI en Parrot pendiente.** El [nuevo fallo real](../output/playwright/soc-simulator-v1/2026-10-17T06-45-42-489Z/simulator/resultados.json) abrió Chromium y llegó a `tests/simulator-browser.mjs:45`: timeout de `getByLabel('Resumen ejecutivo', { exact: true }).isDisabled()`. La corrección anterior de los selects dejó fuera los textarea con contenido. Este checkpoint amplía la revisión a **todas las 54 consultas del runner**, sin cambiar la aplicación ni las academias.

La ejecución ya había esperado la región «Evaluación de entrenamiento», recuperado el intento entregado y comprobado su nota 100/100 y revisión humana pendiente. No hay navegación entre esas comprobaciones y `isDisabled()`. En `CaseWorkspace`, entregar mantiene los campos y activa `disabled` en el fieldset «Expediente de investigación MS-AL-101». El foco pasa a la evaluación, pero el informe permanece en el documento.

La causa es el selector: `Field` envuelve el textarea en su label. React actualiza tanto `value` como `defaultValue` del textarea controlado; su contenido queda como texto descendiente del label. El HTML generado por el componente real después de llenar y entregar conserva esta estructura:

```html
<fieldset disabled="" class="sim-case-fields">
  <legend class="sr-only">Expediente de investigación MS-AL-101</legend>
  <!-- Dentro del panel del informe: -->
  <label class="sim-field"><span>Resumen ejecutivo</span><textarea maxLength="10000" rows="3">Informe sintético: hechos con sus IDs, ventana UTC y corte de disponibilidad. La conclusión queda limitada al soporte observado; solicitar revisión del responsable.</textarea></label>
</fieldset>
```

El texto completo que compara `internal:label` es `Resumen ejecutivoInforme sintético: …`; no coincide exactamente con `Resumen ejecutivo`. El nombre accesible del textarea sigue siendo «Resumen ejecutivo»: el cálculo del nombre del control excluye el propio textarea al recorrer su label. **Corrección:** `getByRole('textbox', { name: 'Resumen ejecutivo', exact: true }).isDisabled()`. Se conserva la aserción de deshabilitación heredada del fieldset, sin cambiarla por `readonly`, sin omitirla y sin aumentar el timeout.

### Auditoría de todas las familias de selectores

| Elemento o consulta | HTML y nombre revisados | Resolución en el runner |
| --- | --- | --- |
| Siete selects | Categoría, afirmación, postura, clasificación, prioridad, escalado e impacto; opciones dentro del label | `combobox` con el mismo nombre exacto; se conserva la corrección anterior |
| Nueve textarea | Hipótesis, razonamiento de relación, justificación y seis campos del informe; texto vacío, rellenado, entregado y recuperado | `textbox` con nombre exacto en todas sus consultas, incluida la espera tras recarga y `isDisabled()` |
| Input de entidad | `<input>` de texto y label «Entidad investigada» | `textbox` con nombre exacto |
| Cinco filtros de búsqueda | `<input type="search">`; el runner consulta «Texto literal en eventos» | `searchbox` con nombre exacto, también en foco y comprobación del elemento activo |
| Cuatro fechas | `<input type="datetime-local">`; triage y filtros UTC | No tienen rol implícito. Las dos consultas del runner conservan `getByLabel` exacto; el input no aporta texto descendiente al label |
| Checkboxes | Seleccionar evidencia, vincular, acciones, citas e indicadores; nombres completos con sus IDs/IP | `checkbox` con nombre exacto, incluida la ausencia/presencia de A021 antes/después del corte |
| Botones | Iniciar investigación, Examinar ID, Guardar relación de evidencias, Finalizar y evaluar investigación, Iniciar nuevo intento y Revisar llegadas hasta UTC | `button` con nombre exacto. El botón de llegadas usa el UTC completo del escenario en lugar de una expresión regular parcial |
| Formularios y fieldsets | No existe `<form>` ni navegación por submit nativo. Hay fieldsets con legend; el principal deshabilita todos sus controles al entregar | No se inventa un rol `form`. Se conserva el clic del botón y la comprobación de `isDisabled()` sobre el control |
| Regiones y títulos | Campos del evento ID (`pre` con rol/aria-label), evaluación (`section` con aria-label), encabezados educativos y bandeja | Roles `region` y `heading` con los nombres exactos existentes; sin cambios |
| Entrada desde academia | `nav` «Elegir academia», enlace «Centro SOC · Simulador», href específico de la plataforma | `navigation` → `link` con nombres exactos. Se comprueba además el href que antes seleccionaba implícitamente el CSS |
| Consultas estructurales | `.sim-relations>li`, `.sim-evaluation`, `.sim-score` y marcadores de rutas educativas `.world-atlas`, `.sp-world-control`, `.chapter-page`, `.academy-lesson`, `.sp-reader` | Revisadas y conservadas para contar relaciones/evaluaciones, leer la nota o esperar el montaje. Los dos `.first()` existentes solo esperan contenedores educativos; no seleccionan controles ambiguos |

Las **27 aserciones originales se conservan**, con localizadores equivalentes; se añade una comprobación del href de entrada para mantener la restricción de destino que tenía el selector CSS. Se mantienen valores esperados, nota, negativo, almacenamiento aislado, reintento, historial, axe, foco y overflow. No cambian URLs, recargas ni lógica de navegación. Solo cambia `tests/simulator-browser.mjs` y este documento entre fuentes, pruebas y documentación.

Evidencia nueva: [inventario de las 54 consultas y comprobación de aserciones por AST](../output/soc-simulator-v1/correccion-selectores-completa/selectores-auditados.json), [HTML de 20 estados y controles inventariados](../output/soc-simulator-v1/correccion-selectores-completa/html-auditado.json), [HTML entregado del primer caso](../output/soc-simulator-v1/correccion-selectores-completa/microsoft-access-submitted.html), [actualización de textarea en React instalado](../output/soc-simulator-v1/correccion-selectores-completa/react-textarea-source.txt) y [alcance final por hashes](../output/soc-simulator-v1/correccion-selectores-completa/alcance-final.json). Se renderizaron los cuatro casos antes de iniciar, con borrador rellenado, entregados, recuperados y con reintento, usando componentes/motor/fixtures reales. El HTML confirma siete selects, nueve textarea, un input de texto, cinco search y cuatro fechas por expediente, y la deshabilitación heredada al entregar. Se revisaron también ambos enlaces de entrada; los campos de evento abiertos se contrastaron con su JSX, pues requieren estado interactivo.

**Límite de la evidencia:** son renders estáticos y análisis de fuentes; no son un DOM vivo ni un árbol AX observado. La consulta a Chrome DevTools no pudo conectar por ausencia de `DevToolsActivePort`; no se repitieron los lanzamientos Vite/Chromium bloqueados del checkpoint anterior. El informe histórico se conserva intacto y no se afirma que esta corrección haya superado Playwright, axe o responsive.

Validación offline ejecutada: guardia inicial y `node scripts/validate-simulator.mjs`, **PASS**; `npm test` **111/111**, cero fallos/omisiones, TypeScript, `npm run build`, sintaxis, datasets reproducibles, integridad antes/después y fuentes finales coincidentes. [Informe fechado con comandos y códigos](../output/soc-simulator-v1/validacion/2026-10-17T06-53-21-574Z/ejecucion.json).

Repetir desde el proyecto en Parrot, con perfiles sintéticos aislados:

```sh
# Terminal A
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

```sh
# Terminal B
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-simulator.mjs --browser --base-url http://127.0.0.1:5187/
```

**Parada:** corrección y auditoría completa del runner documentadas, offline aprobado. No ampliar funcionalidades ni modificar academias; confirmación de navegador pendiente en Parrot.

## Checkpoint anterior: corrección del selector de select · 17/10/2026

**Defecto en la prueba, corregido; confirmación en Parrot pendiente.** Este checkpoint continúa el de RETOMAR y actualiza el estado de navegador de la entrega original descrita más abajo. La ejecución [2026-10-16T23-35-17-771Z](../output/playwright/soc-simulator-v1/2026-10-16T23-35-17-771Z/simulator/resultados.json) sí abrió Chromium 148.0.7778.178. Falló en el primer recorrido, al esperar `getByLabel('Categoría inicial', { exact: true })` después del clic en «Iniciar investigación» (`tests/simulator-browser.mjs:20`, llamada desde la antigua línea 53). No fue un bloqueo de arranque. El informe no contiene capturas, recorridos completados ni errores de página.

Se revisó el flujo: `CaseLoader` carga y verifica los eventos antes de mostrar el botón; el clic llama a `session.start(scenario)`; `useSimulator` aplica `startAttempt`, guarda el intento y actualiza el estado; `CaseWorkspace` encuentra el borrador y renderiza el triage. Se comprobó offline el render antes/después de `startAttempt` en los cuatro casos: antes aparece el botón sin selects; después hay un intento y siete selects. No se cambió este flujo.

La causa exacta es la semántica del selector sobre el marcado de `Field` (`src/simulator/SimulatorApp.tsx:67`):

```html
<label class="sim-field"><span>Categoría inicial</span><select>…</select></label>
```

Playwright 1.62.0 obtiene las etiquetas nativas mediante `element.labels`; su selector `internal:label` usa `elementText` sobre el label completo. Este recorre también los descendientes `<option>`. En los cuatro casos el texto resultante es `Categoría inicialSelecciona…AutenticaciónEjecución de procesosTráfico de red`, que nunca es igual a `Categoría inicial`. Aumentar el timeout no lo resuelve. La asociación nativa del label con el select es válida. El cálculo de nombre accesible usado por el selector de rol excluye el propio control al recorrer su label (ya está en `visitedElements`), por lo que el combobox se llama `Categoría inicial`.

**Único cambio de código:** `tests/simulator-browser.mjs` usa `getByRole('combobox', { name: 'Categoría inicial', exact: true })` para la espera y selección. Se aplica la misma corrección a los otros seis selects envueltos por `Field`: afirmación, postura, clasificación, prioridad, escalado e impacto, además de la espera responsive. Son nueve sustituciones de localizador debidas al mismo defecto. Se mantienen nombres, coincidencia exacta, aserciones, esperas y timeout. No se añadieron selectores por posición, reintentos ni alternativas permisivas. La aplicación, sus etiquetas y sus estilos quedan idénticos, al igual que SC-200, Splunk, mapas, contenidos, XP y progreso.

Evidencia de diagnóstico: [render estático de los cuatro casos](../output/soc-simulator-v1/correccion-selector-playwright/render-estatico.json), [código instalado del selector](../output/soc-simulator-v1/correccion-selector-playwright/playwright-selector-source.txt) y [runner anterior](../output/soc-simulator-v1/correccion-selector-playwright/simulator-browser-antes.mjs). El render estático y la inspección del motor de selectores son comprobaciones offline; **no son una captura del DOM vivo ni del árbol de accesibilidad del navegador**. El informe histórico tampoco los contiene. En este entorno el intento de Vite terminó con `listen EPERM` en 127.0.0.1:5187 y el único intento nuevo de Chromium terminó antes de crear página con `setsockopt: Operation not permitted` / SIGTRAP. No se repitieron lanzamientos ni se elevaron permisos. La corrección aún requiere ejecución real en Parrot; no se declara PASS UI, axe ni responsive.

Validación offline ejecutada tras la corrección: `node scripts/simulator-integrity.mjs` y `node scripts/validate-simulator.mjs`, **PASS**. `npm test`: **111/111**, cero fallos/omisiones; TypeScript, `npm run build`, sintaxis del runner, datasets reproducibles y guardias antes/después aprobados. Fuentes comprobadas iguales al terminar la validación. [Informe fechado con comandos y códigos de salida](../output/soc-simulator-v1/validacion/2026-10-17T06-38-04-365Z/ejecucion.json). Esto no ejecuta las interacciones de Playwright.

Repetición en Parrot, con los mismos perfiles sintéticos aislados del runner:

```sh
# Terminal A
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

```sh
# Terminal B
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-simulator.mjs --browser --base-url http://127.0.0.1:5187/
```

Conservar el informe fechado nuevo y revisar `simulator/resultados.json`. El informe del timeout se conserva intacto. **Parada: corregir este defecto y comprobar offline; sin ampliar alcance ni resolver otros pendientes de navegador.**

## Punto de partida y alcance

Se leyeron AGENTS, RETOMAR y la entrega Splunk V2.0. Se verificó su cierre y sus guardias antes de editar: SC-200 **13 regiones / 76 lecturas / 719 pasos / 272 actividades**; Splunk **11 regiones / 80 lecciones / 240 actividades**. Solo figuraba `/root` como agente y no se observaron procesos de integración en curso. V2.0 había terminado en código/datos, con 98 pruebas offline; **no estaba completamente validada en navegador**.

El fallo histórico `paridad-dom` a 320 px sigue abierto: panel SC-200 282.59375 / Splunk 295.203125, delta 12.609375, en una ejecución Parrot que sí abrió Chromium. No es un defecto del lector ni una regresión del simulador. Esta fase no vuelve a modificar atlas, lectores, mapas, paisajes, río R02 o sus puentes. Tampoco cambia currículos, contenidos educativos, IDs, revisiones, XP, prerrequisitos o motores de progreso de las academias.

Antes de editar: [respaldo verificable](../output/soc-simulator-v1/respaldo/inventario.json), **358 copias**, SHA del mapa de copias `3aa4bbcbd73ab01ab0c12f0f3ad2c62e1bb9a04fb60c2571da4cb135dd8ec51d`. Otros **416 archivos** de originales/evidencia se protegen por hash. Sin perfiles de navegador, LocalStorage personal, secretos ni archivos de entorno.

## Escenarios y fuentes

| Escenario | Producto y nivel | Datos | Trabajo y desenlace evaluable |
| --- | --- | ---: | --- |
| `microsoft-access` | Sentinel, N1 | 9 eventos | Fallos/acceso de una cuenta, operación posterior y corroboración contextual. Incidente corroborado o escalado conservador justificado; no inferir exfiltración. |
| `microsoft-legitimate` | Defender/Sentinel, N1 | 7 eventos | Proceso PowerShell, cuenta/equipo, ticket, ventana y archivo. Actividad legítima en alcance acotado; no generalizar la autorización a otros equipos. |
| `splunk-identities` | Enterprise/Cloud, N1; ES no requerido | 10 eventos | Cinco identidades/seis fallos en la primera ventana; el éxito pertenece a otra IP. Señal válida o sospecha inconclusa, sin compromiso inventado. |
| `splunk-incomplete` | Enterprise/Cloud, N2; ES no requerido | 24 eventos | Seis cuentas, éxito, NAT/contexto y A021 tardío. Comparar corte 09:16 y retrospectivo 09:30; escalar con incertidumbre documentada. |
| **Total** | **Dos plataformas, cuatro casos** | **50** | **Todos completables en el motor offline** |

Splunk reutiliza literalmente los CSV originales R03 `auth_sintetico.csv` y R06/R07 `auth_activity.csv` / `authorized_context.csv`, junto con LAB06-A/B para los objetivos y límites. No se altera ningún original. Los IDs A001–A021 se conservan; S301–S310 son identificadores del adaptador para filas del CSV R03, que no tiene ID propio. C001–C003 identifican sus filas de contexto.

Los derivados excluyen las columnas docentes `scenario` y `fixture_label`: no revelan etiquetas como `benign_documented` al investigar. El mapeo conserva usuario/src/host/resultado, tiempo del evento y disponibilidad sintética, con procedencia por archivo/fila/ID. El campo `fixture_indexed_at` **no es `_indextime` real**. Un 4624 no identifica al atacante; `host` es emisor, no cliente deducido por IP.

Microsoft incorpora fixtures nuevos expresamente sintéticos en `scripts/simulator/microsoft-events.json`. Reutiliza la terminología/tablas de la academia instalada: SigninLogs, AuditLogs, DeviceProcessEvents y DeviceNetworkEvents. `TrainingContext` y los campos `Training*` son contexto del ejercicio, **no tablas o capacidades comerciales inventadas**. Los hashes son de entrenamiento; el hash del ejecutable PowerShell se distingue del hash validado del script. No se anuncia compatibilidad ejecutada contra un tenant.

## Arquitectura y experiencia

Un motor común, sin importar motores educativos. Cada escenario declara plataforma, producto, nivel, alerta/contexto, objetivos, competencias, acciones propuestas y fuentes/dataset por hash. Las decisiones aceptables, evidencias y rúbrica viven en material docente separado, cargado al entregar.

| Módulo | Responsabilidad |
| --- | --- |
| `types.ts`, `scenarios.ts` | Contratos y catálogo ligero de cuatro casos, con revisión independiente de las revisiones educativas |
| `investigation.ts` | Filtros locales, orden temporal, corte de disponibilidad y requisitos del expediente |
| `engine.ts` | Inicio, acciones, selección, relaciones, entrega inmutable y reintentos |
| `rubrics.ts`, `grading.ts` | Reglas docentes y evaluación determinista; importación dinámica al finalizar |
| `storage.ts`, `useSimulator.ts` | Guardado versionado por plataforma, recuperación, errores, exportación e historial |
| `SimulatorApp.tsx`, `entry.tsx`, `simulator.css` | Consola SOC y carga diferida; estilos separados del render estático de pruebas |
| `SimulatorBoundary.tsx` | Error recuperable del módulo sin activar motores educativos |
| `scripts/prepare-simulator.mjs` | Adaptación reproducible a cuatro datasets y manifiesto, exclusivamente `public/simulator-data/` |

La interfaz incluye bandeja con severidad/hora/origen/entidad/estado/ID; triage; filtros por usuario/IP/equipo/código/tiempo y texto literal; examen de campos; paginación; pivote usuario/IP; cronología de eventos examinados o seleccionados; expediente de evidencias; hipótesis y explicación rival; afirmaciones respaldadas/limitadas/contradichas con IDs; decisión/prioridad/escalado/acciones; informe y evaluación desglosada. Estos controles de investigación no son un cuestionario MCQ: el alumno debe construir el expediente con eventos concretos, relaciones y citas.

**No hay intérprete KQL/SPL.** Los filtros buscan subcadenas locales; el rango UTC es `[inicio, fin)`, y el corte de disponibilidad también es exclusivo. Pegar una consulta solo busca ese texto literal; no ejecuta operadores ni conexiones. Las vistas lo indican expresamente. La ausencia de coincidencias no acredita ausencia de actividad.

En N2, A021 no se puede seleccionar ni examinar antes de ampliar el corte. Su hora sigue siendo 09:04 aunque se hace disponible a 09:24. La cronología ordena por evento y desempata por ID; muestra también disponibilidad. Las acciones recomendadas son propuestas documentales: ni contención, ni cierre, ni MFA ejecutan nada sobre sistemas.

La consola usa tokens, tipografía, cabecera, navegación, botones elevados, `ProgressBar`, superficies y convenciones premium existentes. Añade un layout de mesa SOC propio, aislado bajo clases del módulo. No modifica CSS compartida. Controles nativos, etiquetas, foco, regiones de código enfocables, estados textuales y reglas de movimiento reducido. Los cinco anchos preparados son 320/390/768/1440/1920; su DOM y aspecto todavía requieren navegador.

## Rúbrica y límites de la nota

| Criterio | Máximo | Comprobación automática |
| --- | ---: | --- |
| Triage inicial | 20 | Categoría 8, entidad 6 y ventana UTC acotada 6 |
| Evidencias relevantes | 25 | Grupos de eventos requeridos, cobertura parcial y penalización por selección ajena al caso |
| Correlación/razonamiento técnico estructurado | 20 | Dos relaciones distintas con postura e IDs suficientes; relaciones inválidas restan y duplicarlas no suma |
| Decisión, prioridad y escalado | 20 | Clasificación respaldada 8, prioridad 4, escalado 4 y acciones proporcionales 4 |
| Informe: trazabilidad verificable | 15 | Citas válidas 5, alcance estructurado 3, indicadores observados 3, impacto respaldado 2 y acciones coherentes 2 |
| **Total** | **100** | **Umbral estructurado orientativo 80/100** |

Abrir todos los eventos obtiene cero puntos. Seleccionar todo no demuestra correlación ni decisión; el ruido reduce evidencia y una relación con eventos ajenos no se considera respaldada. Declarar exfiltración sin fuente o incidente confirmado en los casos no confirmados limita el resultado a un máximo de 59. Omitir una comprobación crítica impide superar el umbral. Se muestran puntos por dimensión, ajustes, evidencias omitidas y explicación educativa tras finalizar.

Hay alternativas aceptables explícitas. Los dos casos Splunk admiten sospecha inconclusa o señal válida sin incidente confirmado, con soporte/escalado. Microsoft acceso admite una conclusión conservadora que reconozca la corroboración y limite el impacto. El caso legítimo requiere contrastar autorización/archivo y no admite acusación automática por usar PowerShell.

**No se califica automáticamente la calidad semántica de la prosa.** Hipótesis, justificaciones y seis campos narrativos se guardan y son obligatorios, pero no se puntúan por palabras clave, longitud o frases esperadas. Los 15 puntos del informe cubren completitud/trazabilidad formal, no calidad de redacción ni suficiencia forense del relato. Las relaciones y el impacto estructurados sin soporte sí penalizan; una contradicción escrita únicamente en texto libre requiere revisión humana. El resultado indica `humanReview:pending`, incluso con 100/100. Un caso no equivale a certificación ni dominio práctico, y no concede XP.

Esta es una evaluación local de entrenamiento, no un sistema antitrampa: los recursos docentes pueden inspeccionarse en los archivos del cliente. Las respuestas no se muestran en el DOM del borrador ni se solicita el módulo docente antes de entregar; no se promete secreto criptográfico.

## Persistencia y aislamiento

Claves nuevas, esquema 1:

```text
soc-learning-path:simulator:microsoft:v1
soc-learning-path:simulator:splunk:v1
```

Cada intento conserva escenario/revisión/plataforma, competencias practicadas, tiempos, eventos examinados/seleccionados, filtros/corte, hipótesis, relaciones y justificaciones, triage, decisión, informe, diario de acciones y evaluación. Un intento entregado permanece inmutable; volver a entregar no duplica registro, y reintentar crea un borrador nuevo manteniendo el historial. Las revisiones anteriores permanecen en solo lectura. Exportación JSON exclusiva de la plataforma actual; no hay importación o borrado de progreso educativo.

El hook solo lee/escribe su clave de simulador. El dispatcher evita montar SC-200 o Splunk al abrir `#/simulador/...`. Volver a una academia restaura sus rutas normales y su propio motor. Los datos corruptos/futuros se conservan sin sobrescribir; cuota/acceso fallidos permiten trabajar en memoria y exportar. Exportar antes de abandonar una sesión que no se puede guardar. Los eventos `storage` notifican cambios; borradores del mismo intento en varias pestañas usan la actualización más reciente, **no edición colaborativa ni resolución semántica de conflictos**. Los intentos terminados no se sustituyen por borradores tardíos. Para investigar simultáneamente, usar escenarios/intentos distintos.

## Cambios autorizados e integridad

Fuera del módulo nuevo solo cambian:

- `src/App.tsx`: rama y carga diferida del simulador y frontera de error. El cuerpo completo `Sc200App` se conserva literalmente.
- `src/components/AcademySelector.tsx`: un enlace al Centro SOC de la academia actual.
- `docs/RETOMAR.md`: nuevo checkpoint, manteniendo la historia V2.0 y sus pendientes.
- Cuatro guardias/conciliaciones históricas: aceptan exclusivamente hashes exactos de esta extensión; no se eliminan aserciones ni se rehacen inventarios anteriores.

La nueva guardia `scripts/simulator-integrity.mjs` compara los 358 archivos originales y las 416 fuentes/evidencias; comprueba respaldos, datasets reproducibles y conjuntos exactos. Además reconstruye las dos extensiones de navegación desde el respaldo para exigir igualdad exacta, sin una excepción genérica para archivos SC-200. Las pruebas educativas existentes permanecen sin cambios. Los paquetes, currículos, motores de progreso, XP, lectores, atlas, geometría, CSS y río R02 conservan sus hashes.

Nuevos archivos de herramientas/pruebas: `prepare-simulator.mjs`, `simulator-integrity.mjs`, `simulator-reconciliation.mjs`, `validate-simulator.mjs`, fixtures Microsoft, `tests/simulator.test.ts`, `tests/simulator-fixtures.ts`, `tests/simulator-browser.mjs`. Derivados: cuatro JSON de eventos y manifiesto bajo `public/simulator-data/`. Las diferencias completas y hashes quedan en `output/soc-simulator-v1/cierre.json` y su manifiesto de cambios autorizado, separado de las evidencias V2.0.

## Pruebas reales y pendientes

[Última validación offline](../output/soc-simulator-v1/ultima-offline.json), con comandos/códigos/TAP y guardias antes/después. [Intento de navegador](../output/soc-simulator-v1/ultima-browser.json).

| Prueba | Resultado |
| --- | --- |
| TypeScript estricto y `npm run build` | PASS offline |
| `npm test` | **111/111 PASS**, cero fallos/omisiones: 98 anteriores y 13 del simulador |
| Cuatro recorridos completos del motor | PASS: selección/relaciones/informe/entrega, 100/100 con fixtures correctos |
| Falso positivo, señal válida e inconcluso | PASS; acusaciones/exfiltración sin soporte no superan |
| Filtros/UTC/corte tardío/reconstrucción | PASS; cuatro datasets/50 eventos deterministas y originales íntegros |
| Persistencia/recuperación/reintentos | PASS con almacenamiento sintético, historial inmutable y cero claves educativas consultadas |
| Soluciones ocultas y feedback posterior | PASS de render estático; interacción/render real pendiente |
| Integridad de las dos academias | PASS por hashes, conteos, conjuntos y regresiones unitarias |
| Playwright del simulador | **BLOQUEADO antes de abrir páginas**, `setsockopt: Operation not permitted` / SIGTRAP; código 1 |
| Vite del agente | **BLOQUEADO `listen EPERM`** en 127.0.0.1:5187; código 1 |
| Cuatro recorridos UI, responsive, axe, foco y capturas | **Preparados, no ejecutados**; cero recorridos/capturas de navegador aprobados |
| Regresión visual de academias y paridad 320 | Pendientes previos de V2.0; no se declaran resueltos por el simulador |

El orquestador exige TAP con al menos 111 pruebas y todos los resultados, no un código cero vacío ni un proceso de test contado como una única prueba. Usa descriptores de archivo ante las restricciones de tuberías del agente. No se usaron sudo ni permisos globales, ni lanzamientos equivalentes repetidos para sortear el bloqueo.

La suite de navegador prepara los cuatro recorridos a 390 y 1440 px, un recorrido negativo, recuperación y reintento, aislamiento frente a ambas claves educativas, entradas desde las academias, teclado, movimiento reducido, axe estricto y responsive de ambas plataformas a cinco anchos, más rutas SC-200/Splunk. `axe violations=[]` se conserva; se registran `incomplete`. No se ejecuta ni se relaja la prueba histórica de paridad para ocultar su fallo. Revisiones manuales pendientes: zoom, contraste real, lectura de pantalla, foco/scroll y comparación visual premium. No se fabricaron capturas ni datos DOM.

## Comandos exactos para Parrot OS

Comprobación offline:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/simulator-integrity.mjs
node scripts/validate-simulator.mjs
```

Si se cambia un fixture del simulador, regenerar exclusivamente sus derivados y revisar su nueva revisión; no tocar los CSV editoriales:

```sh
node scripts/prepare-simulator.mjs
```

Terminal A:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B, con perfiles sintéticos aislados:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-simulator.mjs --browser --base-url http://127.0.0.1:5187/
```

Alternativa directa a la suite:

```sh
node --import tsx tests/simulator-browser.mjs --base-url http://127.0.0.1:5187/
```

Entradas: `http://127.0.0.1:5187/#/simulador/microsoft` y `http://127.0.0.1:5187/#/simulador/splunk`. Cada academia muestra su enlace **Centro SOC · Simulador**. El lector/atlas sigue en sus rutas originales.

Consultar el informe fechado enlazado desde `ultima-browser.json`, `simulator/resultados.json`, galería y capturas. No usar el perfil personal ni copiar fixtures de test a su origen. La prueba histórica independiente sigue disponible mediante `validate-splunk-v20.mjs --browser`; sus resultados no se convierten en aceptación del simulador ni viceversa.

**Estado de parada:** motor y cuatro escenarios implementados, validación offline aprobada. Falta ejecutar/observar navegador en Parrot y revisar calidad pedagógica/semántica independiente. La fase no se declara completamente validada ni cerrada. No se implementan funcionalidades adicionales.
