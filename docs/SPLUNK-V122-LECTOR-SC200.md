# Splunk V1.2.2 · Lector con la estructura SC-200

17/10/2026. Alcance: interfaz del lector, pruebas y diagnóstico. **Implementado y validado offline. Comparación visual nueva, Playwright y axe pendientes del entorno Parrot.** El fallo real del atlas a 320 px continúa abierto: no se ha alterado un mapa para hacer pasar la prueba.

## A. Fallo de paridad V1.2.1: diagnóstico separado del lector

Evidencia original, protegida e intacta:

- [Ejecución Parrot](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/ejecucion.json).
- [Resultado detallado](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/paridad/resultados.json), [matriz DOM](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/paridad/matriz.md) y [stdout](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/paridad-dom.stdout.log).
- Capturas reales a 320: [Splunk](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/paridad/splunk-atlas-320-viewport.png), [SC-200](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/paridad/sc200-atlas-320-viewport.png).
- [Diagnóstico reproducible V1.2.2](../output/splunk-v122/diagnostico-paridad-v121.json), generado mediante `scripts/splunk-v122-diagnostic.mjs`.

`paridad-dom` terminó con **código 1**, tras 82.707 ms. **Chromium 148.0.7778.178 sí arrancó**. La excepción exacta fue:

```text
AssertionError [ERR_ASSERTION]: Panel: SC-200=282.59375, Splunk=295.203125
near, tests/splunk-v121-parity.mjs:15:44
llamada original, tests/splunk-v121-parity.mjs:67:178
```

La aserción compara `master.progress.width` con `adapted.progress.width`, tolerancia **1 px**, en el **atlas general a 320 px**. La diferencia es **12,609375 px**. No evalúa el lector; esa suite no contiene vistas de lección comparadas.

| Medida DOM registrada a 320 | SC-200 | Splunk |
| --- | ---: | ---: |
| Atlas exterior | 304 | 304 |
| Escena interior | 302 | 302 |
| Bienvenida / anchura disponible entre márgenes del overlay | 278 | 278 |
| Medidor y estadísticas | 282,59375 | 295,203125 |
| Exceso sobre esos 278 px | 4,59375 | 17,203125 |
| Nodo | 86 × 80 | 86 × 80 |

Las capturas muestran el panel Splunk recortado a la derecha. `scrollWidth=320` no lo detectó porque la escena recorta contenido; por eso no se elimina la comparación estricta. El problema está en la anchura del conjunto de estadísticas/medidor, no en el tamaño del atlas ni de sus nodos.

La inspección del CSS identifica la cadena `.atlas-progress` (grid con mínimo automático) y `.atlas-stats` (estadísticas con textos distintos), sin `min-width:0` que limite ese mínimo. El resultado concuerda con expansión por contenido intrínseco: medidor y estadísticas toman juntos 295,20 px en Splunk. **No había registro de `min-width` computado de cada descendiente en esa ejecución**; no se inventa esa medición. Se añade lectura de estilos computados y rectángulos de esa cadena para confirmar el mecanismo al repetir.

Antes del fallo se registraron seis comparaciones de atlas a 390/768/1024/1440/1920/2560 y **50 vistas axe sin violaciones** (48 en esos anchos, más los dos atlas a 320). Son resultados parciales de V1.2.1, no un PASS de V1.2.2 ni de toda la suite. Las regresiones posteriores no llegaron a ejecutarse.

**Decisión de alcance:** la aserción detecta una diferencia real; no es un falso fallo del lector ni EPERM. Se conserva exactamente `near(master.progress.width,adapted.progress.width,'Panel')`, la tolerancia y todas las aserciones de axe/overflow/interacción. Solo se amplía el diagnóstico de lectura y se registra el intento de comparación fallido. La instrucción final de esta fase prohíbe modificar mapas, fondos, río, puentes, caminos y nodos: no se cambia su código ni CSS. La corrección visual del panel del atlas requiere otra fase autorizada. La repetición preparada debe seguir fallando si esa diferencia persiste.

## B. Referencia real y estructura del lector

Se inspeccionaron `LearningReader.tsx`, `QuestionCard.tsx`, `Reader.tsx`, `Primitives`, rutas, estado educativo, `styles.css`, `premium.css`, `experience.css` y los contratos Splunk. Se observó la referencia real [Tu misión SC-200 a 1440](../output/playwright/v25-final/full-width/despues-leccion-1440-inicio.png). Es una captura histórica del componente instalado, cuyo código permanece protegido; no se presenta como una captura nueva de esta fase.

La diferencia del lector anterior era estructural: shell de 1380 px más lector interior de 1000 px, ocho enlaces horizontales, otra tarjeta y ausencia de las columnas lateral izquierda y contextual. Compartir el atlas no resolvía esa diferencia.

Ahora `LessonFrame` es un marco de presentación puro con el **mismo orden de slots y las clases estructurales de LearningReader**. No importa catálogos, motores, almacenamiento ni estados SC-200. SC-200 no se modifica para extraerlo: Splunk recibe el marco y utiliza directamente los estilos del maestro existentes.

| Presentación SC-200 reutilizada directamente | Aplicación Splunk |
| --- | --- |
| `page-shell academy-lesson`, `back-link` | Mismo ancho educativo máximo de 1440 px y regreso al nodo real de la región. No se aplica el ancho panorámico del atlas al lector. |
| `lesson-title-row`, `lesson-tags`, `learning-status` | Región, título original, teoría piloto, tres actividades y práctica no evaluada. Sin estado de dominio práctico. |
| `lesson-progress`, `ProgressBar` | Los cinco pasos reales y el progreso teórico propio, sin conversión al motor Microsoft. |
| `academy-grid` | Tres columnas en escritorio; mismos breakpoints de dos y una columna. |
| `lesson-phases nav button` | Exactamente cinco botones principales, misma numeración, estados, relieve, foco y grid móvil. |
| `activity-surface`, `activity-symbol`, `educational-label`, `lesson-introduction`, `learning-goals` | Tarjeta principal del maestro, con borde superior y acento verde discreto. Tu misión presenta contexto y objetivo originales. |
| `button primary/secondary`, `activity-actions`, `Xp` | Acciones elevadas y navegación entre etapas; la etiqueta XP recibe exclusivamente el valor Splunk. |
| `question-card`, `answer-options`, `assessment-result`, `assessment-score` | Apariencia de preguntas/resultados compartida. No se importa `QuestionCard` ni su evaluador SC-200: Splunk conserva selección, corrección e intentos propios. |
| `splunk-pane academy-splunk`, `pane-heading` | Panel contextual con región, ID, objetivo, progreso de teoría, estado de revisión y enlaces reales. Se sustituye el placeholder por información Splunk. |
| `reader-navigation academy-navigation` | Regreso y siguiente lección solo cuando los prerrequisitos Splunk lo permiten. |
| `focusLearningElement` y movimiento del maestro | Foco de encabezado al cambiar etapa/paso; feedback de puntero con tokens existentes, teclado/reduced motion sin desplazamiento animado. |

`reader.css` solo adapta contenido y colisiones del lector. No redefine el grid, los cinco botones, las sombras de la tarjeta o los breakpoints. El shell exterior se libera **solo cuando contiene el lector o sus estados de carga/error**. La CSS se carga con una única importación nueva en `SplunkApp.tsx`; el resto de ese archivo es idéntico al respaldo. No se cambian cabeceras, mapas ni persistencia.

## C. Adaptador de cinco etapas y contratos

| Etapa visible | Fase / contenido real | Acciones educativas |
| --- | --- | --- |
| 1. Tu misión | `mision`: contexto del primer apartado y objetivo editorial | Abrir o continuar no concede XP ni marca estudio. |
| 2. Aprende | `estudio&paso=1…5`: los cinco apartados completos | Cada botón envía el mismo `seen` con su ID original. Tras el quinto se continúa a Practica. |
| 3. Practica | `practica`: P01, borrador de sesión, rúbrica y respuesta orientativa | Formativa, no autocorregida, no obligatoria para aprobar teoría, 0 XP automático. El check significa «consultada, no evaluada». |
| 4. Conecta ideas | `resumen`: primer y quinto apartados, como antes. `repaso` es acceso secundario de esta etapa | Confirmar resumen exige estudio completo. Repaso conserva el requisito de teoría aprobada y +5 XP únicos. |
| 5. Demuestra | `teoria`: Q01/Q02 y los intentos originales | Estudio y resumen antes de iniciar; 80 % exige 2/2. Sin corrección ni soluciones hasta finalizar. |

Se conservan las rutas `resumen`, `teoria`, `practica`, `repaso`, `soluciones`, `referencias`, `original` y todos los pasos explícitos. Para una lección todavía sin pasos vistos, el antiguo enlace de entrada `fase=estudio` **sin `paso`** abre ahora Tu misión; su CTA y el botón Aprende llevan al primer paso explícito. Un guardado anterior con estudio conserva el destino Aprende. Una URL explícita `fase=estudio&paso=1` sigue abriendo el contenido directamente. No hay migración, marca de misión persistida ni campo nuevo en LocalStorage.

Solucionario y referencias quedan en la navegación secundaria del panel; la fuente completa tiene el acceso superior equivalente a los apuntes originales. Los recursos regionales y repaso siguen accesibles. No se pierden funciones para reducir ocho pestañas a cinco etapas.

Durante un intento siguen visibles cinco botones principales, pero solo Demuestra está habilitado. Las URLs de otras fases muestran «Evaluación en curso», sin sus contenidos. También se conserva el bloqueo de otras lecciones y de recursos, y se retira el contenido secundario del panel. No se muestran rúbricas/respuestas P01, fuentes, explicaciones Q01/Q02 ni corrección anticipada. Se puede salir y retomar el mismo intento; no existe un reinicio implícito al navegar.

Protecciones conservadas:

- 18 lecciones, 90 secciones, 36 MCQ y 18 prácticas: 54 actividades; IDs, revisiones, opciones y payloads originales.
- XP por lección: estudio 5, resumen 5, teoría 15, repaso 5, máximo 30; bonus regional de 100 existente, máximo total **840 XP provisionales**. Cero XP definitivos.
- Aprobar teoría no marca P01 consultada ni práctica superada; `practicalStatus` sigue siendo `not_assessed`.
- Mismos `progress.ts`, `useSplunk.ts`, datos, esquemas, claves, carga/guardado, historial y desbloqueos. Sin equivalencias técnicas inventadas.
- SC-200 conserva 13 regiones, 76 lecturas, 719 pasos y 272 actividades, sus contenidos, lógica y presentación originales.
- Sin R04–R11, dependencias nuevas, Splunk real, backend, commits ni publicación. No se consultó progreso personal.

## D. Dimensiones, capturas y accesibilidad

**No hay capturas ni medidas DOM nuevas de V1.2.2.** La matriz siguiente es la geometría CSS heredada prevista, no una observación del navegador:

| Ventana | Contenedor máximo previsto | Menú | Tarjeta central prevista | Contexto |
| --- | ---: | ---: | ---: | --- |
| 320 | 320 | 286, arriba | 286 | 286, debajo |
| 390 | 390 | 356, arriba | 356 | 356, debajo |
| 768 | 768 | 145 | 555 | 555, debajo en columna 2 |
| 1440 | 1440 | 170 | 945 | 205, derecha |
| 1920 | 1440 centrado | 170 | 945 | 205, derecha |

Mismos márgenes: 17 px móvil, 25 px intermedio y 38 px escritorio. Grid de etapas móvil en dos filas de tres/dos botones; no se reintroducen ocho pestañas. El contenido largo mantiene su longitud y desplazamiento vertical, con tablas/código desplazables dentro de la tarjeta. La fuente completa no se recorta para igualar alturas con otra lección.

El runner `tests/splunk-v122-browser.mjs` prepara pares **SC-200/Splunk a igual ancho y 1000 px de alto**: misión, tarjeta, columnas, tipografía, padding, botones, bordes y sombras. Guarda capturas completas y de viewport, `resultados.json`, `matriz.md` e `index.html`. Las alturas de texto distintas no se igualan mediante recortes. El resultado automático deja la comparación artística humana pendiente.

También prepara axe estricto en los cinco anchos, las fases y Recursos R03, overflow, teclado/Espacio, foco visible, movimiento reducido, 18 recorridos educativos completos, 1/2 fallido, 2/2 aprobado, recarga de primeras respuestas, bloqueo de fuentes/otras lecciones/recursos, Escape y Atrás/Adelante, máximo 840 XP y aislamiento. La matriz adicional conserva los escenarios originales de SC-200 vacío/parcial/legacy/V2.4/V2.5/corrupto, cuota, datos Splunk corruptos, payload ausente/alterado y dos pestañas; solo adapta controles al lector nuevo.

Las correcciones anteriores de Recursos R03 permanecen intactas: `.language-spl` hereda texto claro sobre fondo `#172d4e` y `pre` sigue enfocable/etiquetado. El fallo axe V1.1 de Parrot no se reclasifica como EPERM. Los `incomplete` se registran con sus nodos; quedan pendientes revisión humana de contraste sobre fondos, tacto, lectura de pantalla y zoom real. El runner no presenta cambio de viewport o DPR como un zoom real del navegador.

## E. Respaldo, integridad y pruebas ejecutadas

Antes de cambios: **268 copias verificadas** en [inventario V1.2.2](../output/splunk-v122/respaldo/inventario.json), con hash del mapa original `5aa2107f76176b9983744b340b765ac3609031e302ddbc624da598eec67c71a6`. La guardia V1.2.2 protege **588 archivos previos** y los conjuntos exactos de contenidos/paquetes, además de verificar todas las copias. Incluye las dos evidencias Parrot y todos los archivos de mapas/paisajes/CSS y SC-200. Las capas históricas se solapan; no se suman.

La sustitución autorizada del lector se concilia con un par exacto de hashes anterior/nuevo en las guardias históricas, sin aceptar otros cambios. La única excepción de carga de estilos verifica que `SplunkApp.tsx` sea exactamente el respaldo más `import './reader.css';`: cualquier otro cambio falla. No se reescriben inventarios antiguos ni se relaja su control de motores, datos o mapas. RETOMAR permanece intacto.

Ejecutado offline:

| Comprobación | Resultado |
| --- | --- |
| Diagnóstico de evidencia Parrot | PASS de reproducción del diagnóstico: código 1 original, Chromium real, aserción exacta a 320, diferencia 12,609375 px y 50 axe parciales confirmados. No equivale a un nuevo PASS de paridad. |
| TypeScript estricto | PASS |
| `npm test` | **84/84 PASS**, 0 fallos, 0 omitidas; 78 previas y seis dirigidas nuevas |
| `npm run build` | PASS |
| Guardias antes/después y copias | PASS; mapas, río R02 y SC-200 idénticos |
| Nuevas pruebas dirigidas | Estructura de tres columnas/cinco etapas; render íntegro de las 90 secciones; Q01/Q02/P01; rutas secundarias; nueve rutas durante intento sin soluciones; 840 XP sin duplicar; guardado/historial separado; teoría sin check de práctica; prerrequisitos |
| Navegador actual del agente | Vite `listen EPERM`; Chromium `setsockopt Operation not permitted`/SIGTRAP antes de abrir página |
| Playwright/DOM/capturas V1.2.2 | **PENDIENTE**, suites preparadas y sintaxis comprobada, sin PASS visual atribuido |
| Repetición estricta del atlas | **PENDIENTE DE EJECUCIÓN**; defecto original abierto y aserción preservada |

Ejecución final: [informe](../output/splunk-v122/validacion/2026-10-16T22-38-44-577Z/ejecucion.json), [84 pruebas](../output/splunk-v122/validacion/2026-10-16T22-38-44-577Z/npm-test.stdout.log) y [build](../output/splunk-v122/validacion/2026-10-16T22-38-44-577Z/npm-build.stdout.log). El [puntero de la ejecución offline final](../output/splunk-v122/ultima-offline.json) enlaza comandos, versiones, hashes, stdout/stderr, códigos y resultados. [Registro de entorno](../output/splunk-v122/entorno.json). El primer ensayo de unitarias detectó una importación CSS no interpretable por Node; se trasladó la carga a la entrada Splunk, manteniendo el marco renderizable en las pruebas. Los ensayos fallidos no se presentan como pruebas aprobadas.

Los prehooks exigidos leyeron la fuente completa con `prepare-content.mjs`, manteniendo saneado y reconstrucción; los hashes finales confirman derivados idénticos. No se editaron generados a mano ni se repitieron lotes editoriales educativos ya válidos. No hay benchmark nuevo de LCP/INP/FPS.

## F. Comandos exactos para Parrot

Terminal A:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B, validación de ambas áreas con informes separados:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/splunk-v122-integrity.mjs
node scripts/validate-splunk-v122.mjs --browser --base-url http://127.0.0.1:5187/
```

El orquestador ejecuta primero el lector V1.2.2 y después `paridad-dom` V1.2.1 como áreas independientes. Un lector aprobado **no oculta** el atlas fallido: el resultado global seguirá `not_passed` si falla cualquiera. Si Chromium no puede arrancar, registra el bloqueo y no repite el lanzamiento.

Para repetirlos individualmente:

```sh
node tests/splunk-v122-browser.mjs --base-url http://127.0.0.1:5187/
node tests/splunk-v121-parity.mjs --base-url http://127.0.0.1:5187/
```

Tras cambios futuros de código, validación offline:

```sh
node scripts/validate-splunk-v122.mjs
```

Consultar `output/splunk-v122/ultima-browser.json`, el informe `ejecucion.json` y su carpeta `lector/`. El campo `parityReport` apunta al informe del atlas bajo `output/playwright/splunk-v121/`. No confundir errores de cada suite ni atribuir aprobación a pruebas que no llegaron a ejecutarse.

Para observar la entrada inicial:

- SC-200: abrir `#/ruta`, entrar en la primera lectura disponible y su etapa Tu misión.
- Splunk: `http://127.0.0.1:5187/#/splunk/leccion/SP-R01-L01?fase=mision`.
- En el mismo ancho, comparar los pares de la galería; después revisar las otras etapas, títulos largos y fuente completa.
- En un perfil de prueba, comprobar Ctrl+ + hasta 200 %, teclado/Shift+Tab/Espacio/Escape, foco, lector de pantalla y la preferencia de movimiento reducido del sistema. No copiar datos sintéticos al perfil personal.

## G. Pendientes y punto de parada

La estructura del lector está adaptada y sus contratos pasan las pruebas offline. Falta observarla en Chromium/Parrot y resolver cualquier fallo nuevo real sin relajar pruebas. La aceptación visual sigue pendiente; no se afirma que se haya visto un lector nuevo en navegador.

El defecto del panel del atlas a 320 px sigue abierto por la prohibición explícita de modificar mapas en esta fase. La instrumentación ampliada permitirá ver su cadena de mínimos intrínsecos, pero no se cambia una tolerancia para convertirlo en PASS. R01–R03, especialmente el río de R02, se conservan exactamente.

**Detener esta fase aquí: sin ampliar lecciones, integrar R04–R11, tocar mapas ni publicar.**
