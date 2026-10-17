# Splunk SOC · Piloto local V1 — R01

Fecha: 16/10/2026. Cierre documental tras revisar la ejecución del usuario en Parrot OS, origen `http://127.0.0.1:5187/`. Alcance: **SP-R01-L01 a SP-R01-L05, exclusivamente**.

## Dictamen y punto de parada

**IMPLEMENTADO:** selector de academias, catálogo/importador independiente, Puerto de Splunk con cinco nodos, lector, diez MCQ, cinco abiertas formativas, laboratorio documental R01, historial y persistencia Splunk propios, XP y niveles provisionales.

**VALIDADO OFFLINE:** 61/61 pruebas (42 anteriores y 19 nuevas), TypeScript estricto, compilación, importación determinista, reglas de XP, aislamiento del adaptador de almacenamiento con datos sintéticos y 400 hashes protegidos sin cambios. Los cinco paquetes editoriales vuelven a pasar sus verificadores: 80 IDs de lección y 240 de actividad conservados.

**VALIDADO EN NAVEGADOR, con evidencia aportada por el usuario:** `resultados.json` declara `status:passed` y 16 comprobaciones; SC-200 declara `passed:true` y 7 grupos de regresión. Ambos tienen `errors:[]` y `external:[]`. Se revisaron las 13 capturas reales. Hay 24 comprobaciones axe en la suite Splunk, otras 24 vistas en la suite SC-200 de accesibilidad y 18 comprobaciones de actividades en compatibilidad V2.5, todas con cero violaciones detectadas.

**DICTAMEN: favorable para el piloto local experimental R01 dentro del alcance comprobado, sin regresiones críticas detectadas.** El bloqueo anterior del entorno del agente no invalida las ejecuciones posteriores realizadas en Parrot OS. La convivencia de catálogos, progreso y XP tiene ahora evidencia funcional, además de las pruebas offline.

**PENDIENTE / reservas:** revisión manual de resultados axe `incomplete`, lector de pantalla y otros navegadores; trazabilidad explícita de códigos de salida y versión del navegador/build; benchmark de producción; revisión educativa humana independiente y práctica real en producto. Cero violaciones automáticas no significa certificación WCAG. Los XP continúan provisionales y las cinco fichas no están aprobadas por una persona independiente. **No se declara terminada la ruta de 80 lecciones ni se autoriza/incorpora R02–R11.**

## 1. Recuperación del estado y respaldo

Se leyeron AGENTS.md, RETOMAR.md, la auditoría, correcciones, plan de integración, currículo completo y material R01 (cinco lecciones, banco, manifiesto, fuentes y laboratorio). Se inspeccionaron App, router, catálogos, persistencia, recompensas, lector, generación, scripts npm y pruebas existentes antes de integrar.

Referencia confirmada: SC-200 V2.5, 13 capítulos, 76 lecturas, 719 pasos y 272 actividades. Las dos introducciones históricas sin actividades no recibieron preguntas ni dominio inventado.

Respaldo autoritativo: [archivos anteriores](../output/splunk-pilot-r01/respaldo/archivos/) e [inventario](../output/splunk-pilot-r01/respaldo/inventario.json). **199 copias verificadas individualmente por SHA-256 antes de modificar App/package.** Incluye código, pruebas, configuración, documentación y derivados saneados; excluye perfiles, LocalStorage, archivos de entorno, secretos y fuentes crudas externas. El directorio de copias es el respaldo verificado; no es necesario usar el tar del primer intento, cuya operación devolvió error del entorno.

Huella del mapa original de hashes: `0b01b31d3a481750cdfaef4dc181c82aa01b7a34e9b80aa845dbaaa524ad0b81`. Se conserva además una compilación de referencia previa bajo `output/splunk-pilot-r01/baseline/`; no es una captura de navegador.

Solo se cambiaron dos archivos preexistentes de aplicación: `src/App.tsx` y `package.json`. El cuerpo original de App permanece literal dentro de `Sc200App`; una prueba contrasta esa igualdad con el respaldo. Los demás cambios son módulos, pruebas, herramientas y salidas nuevas de Splunk. No se modificaron las fuentes editoriales Splunk, currículo, SC-200.md, generador SC-200 ni sus derivados canónicos.

## 2. Arquitectura implementada — C01/C02

| Ámbito | Microsoft SC-200 preservado | Splunk SOC R01 |
| --- | --- | --- |
| Catálogo | `src/generated/catalog.json` | `src/generated/splunk/catalog.json` |
| Búsqueda derivada | Índice actual intacto | Índice independiente de cinco entradas; UI de búsqueda no incluida |
| Payloads | `public/content/` intacto | `public/splunk-content/`, cinco JSON bajo demanda y un recurso R01 |
| Generador | `scripts/prepare-content.mjs`, sin cambios | `scripts/prepare-splunk.mjs`, sin overrides de fuente/destino/IDs |
| Almacén | `soc-learning-path:learning:v2` | `soc-learning-path:splunk:learning:v1` |
| Legacy | `soc-learning-path:progress:v1`, misma compatibilidad | No leído, migrado ni escrito por Splunk |
| XP/nivel/premios | Motor y valores originales | Ledger provisional propio; cero XP definitivos |
| Historial/posición | Originales | Registros por ID/revisión, intentos y lastLesson propios |
| Prerrequisitos | Catálogo/secuencia originales | L01 sin requisitos; L02–L05 dependen de L01 según sus fuentes |
| Exportación | Formato anterior intacto | `soc-learning-path-splunk-v1`, courseId splunk; sin contenido/progreso SC-200 |

`App` selecciona el subárbol por el hash de navegación. **Solo se monta el hook de persistencia del curso activo.** El selector no registra aprendizaje, no concede XP ni guarda preferencias dentro del progreso de otro curso. Los eventos storage de Splunk filtran exclusivamente su clave; un borrado general se fusiona con el avance de su propia sesión.

Se comparten React, iconos, Markdown/dependencias y la pieza vectorial pura LandscapeLandmark; no el catálogo educativo, adaptador, hook ni ledger SC-200. Splunk se carga con import dinámico, incluido su CSS. Un límite de error permite volver a SC-200 si falla el chunk Splunk. La caché de payloads es acotada a ocho, identifica curso/ID/revisión, comprueba SHA-256/revisión/contrato y cancela peticiones al salir.

Rutas implementadas:

- `#/ruta`, `#/capitulo/:id`, `#/leccion/:id`, biblioteca/progreso/repaso: siguen siendo SC-200, sin cambio de URLs.
- `#/splunk/ruta` y `#/splunk/region/SP-R01`: mapa del piloto.
- `#/splunk/leccion/SP-R01-L01` … `SP-R01-L05`: lector; query `fase` y `paso` para fases/pasos.
- `#/splunk/progreso`: bitácora/exportación propia; `#/splunk/recursos`: laboratorio documental.

Un ID fuera del piloto da una página explícita, no otra lectura. El acceso por URL comprueba prerrequisitos; no basta con pintar un candado. La suite aprobada comprueba bloqueo directo de L02, retorno/foco al nodo, Atrás y Escape, enlaces históricos SC-200 y selección por teclado. **Adelante no tiene una aserción dedicada en estas evidencias**; no se presenta como un caso ejecutado explícitamente.

## 3. Importador seguro y contrato educativo

El preparador nuevo lee explícitamente los cinco manifiestos, comprueba el SHA canónico y la correspondencia de 80 IDs/títulos/objetivos. Verifica los hashes de entradas y SHA256SUMS, incluido cada manifiesto. Importa solamente la lista fija de cinco IDs; rechaza otros lotes, rutas ascendentes, enlaces simbólicos y destinos fuera de su allowlist.

No llama al preparador SC-200, no cambia SC200_SOURCE y **no borra directorios**. Valida todas las salidas antes de escribir y usa staging/rename por archivo dentro del destino permitido; el catálogo se publica al final. Una interrupción entre archivos puede requerir regenerar: el lote completo no es una transacción entre directorios. Un staging residual provoca error, no limpieza recursiva automática.

Destinos exclusivos: cinco payloads y `resources.json` bajo `public/splunk-content/`; catálogo/índice bajo `src/generated/splunk/`; `docs/SPLUNK-CONTENIDO.md`. Comparación protegida antes y después: **400/400, cero cambios**. Ante discrepancia aborta; una prueba negativa altera solo una copia temporal y confirma el rechazo antes de generar.

Cada Markdown completo se sanea y reconstruye exactamente a partir de preámbulo y ocho secciones. Se conservan fuente original, hash, versión saneada, revisión educativa, rangos y citas. Enseñanza (secciones 1–5), actividades, soluciones y referencias tienen representaciones separadas; el texto completo saneado queda consultable fuera de evaluación. No se expone el Markdown crudo de SC-200 mediante enlaces locales.

La adaptación no hace un cast al contrato Education de SC-200: MCQ→choice de teoría, opciones con los IDs editoriales existentes y solución por ID; P01→formativa sin función de nota. Las referencias se resuelven por namespace del paquete. Las anclas locales proceden de desarrollo/caso guiado, anteriores al banco de preguntas: la coincidencia literal está probada, **no su suficiencia pedagógica independiente**.

R01 no necesita ingerir CSV: los ejemplos temporales son ilustrativos, sin resultados de producto inventados. El recurso conserva el contrato documental del paquete, claramente identificado, pero no copia CSV ni lecciones de R02/R03.

## 4. Cobertura incorporada y ficha para revisión humana

| Lección | Título | Actividades preservadas | Revisión educativa |
| --- | --- | --- | --- |
| SP-R01-L01 | Ecosistema Splunk y límites de producto | Q01/Q02/P01 de ese ID | `7f1943ad8e96ef796cd78810` |
| SP-R01-L02 | Anatomía de una instancia | Q01/Q02/P01 de ese ID | `cff642050a1104e1a277d54b` |
| SP-R01-L03 | UF, HF, indexer y search head | Q01/Q02/P01 de ese ID | `f5a8b76c50b283d908758c3f` |
| SP-R01-L04 | Anatomía de evento y metadatos | Q01/Q02/P01 de ese ID | `dae22a82444ea447af9ea057` |
| SP-R01-L05 | Primer razonamiento de búsqueda | Q01/Q02/P01 de ese ID | `c25f6cf6be1d5e03ae30cf38` |

Cobertura de aplicación: **5/80 lecciones, 10 MCQ y 5 abiertas; 1/11 regiones**. Cada ID de actividad completo conserva el prefijo de su lección, por ejemplo `SP-R01-L01-Q01`. No se crearon preguntas adicionales ni se duplicó el banco en dos supuestas evaluaciones distintas.

Ficha completa preparada: [revision-educativa.json](../output/splunk-pilot-r01/revision-educativa.json). Contiene, por lección, hash/revisión, preguntas, opciones con IDs, solución, explicación, citas exactas de enseñanza, fuentes bibliográficas, P01/respuesta orientativa y rúbrica. **reviewer=null, reviewedAt=null, approved=false** en las cinco. Es un derivado de consulta, no un mecanismo de aprobación; una revisión humana debe registrarse en acta independiente con los hashes revisados. No editar esta ficha generada para habilitar premios.

| Ficha | Anclas de enseñanza de Q01/Q02 | Punto técnico a comprobar por persona independiente | Aprobación |
| --- | --- | --- | --- |
| L01 | SP-R01-L01.md:15–18 y 28–40 | Enterprise/Cloud frente a ES/Mission Control y SOAR; licencia/versión, ingesta ≠ prevención | Pendiente; revisor/fecha sin asignar |
| L02 | SP-R01-L02.md:15–18 y 28–41 | Indexers/buckets, coordinación del search head y coexistencia de roles | Pendiente; revisor/fecha sin asignar |
| L03 | SP-R01-L03.md:15–18 y 28–40 | UF sin indexación local, HF opcional y límites por input/topología | Pendiente; revisor/fecha sin asignar |
| L04 | SP-R01-L04.md:15–18 y 28–41 | _time/_indextime, filtros temporales y causas no concluyentes | Pendiente; revisor/fecha sin asignar |
| L05 | SP-R01-L05.md:15–18 y 28–41 | Población/campos/ventana antes de agregar; count por sourcetype no prueba ataque | Pendiente; revisor/fecha sin asignar |

En este cierre se leyeron las cinco fichas completas y se contrastaron con catálogo, payloads, banco y Markdown: **5/5 fichas coherentes; 10 MCQ, 5 P01 y 20 anclas comprobadas literalmente** (las dos anclas por lección se repiten para Q01/Q02). Coinciden IDs, textos/opciones, solución por ID, explicaciones, rúbricas, hashes y revisiones. Las cinco conservan `pending_independent_review`, sin revisor, fecha o aprobación humana; no se modificó el JSON de fichas.

En cada ficha deben revisarse también distractores, pistas por longitud, claridad del enunciado, soporte de las fuentes y suficiencia de la rúbrica P01. En particular, respuestas cortas como L02-Q02, L03-Q01 y L04-Q01 y la rúbrica genérica compartida merecen revisión pedagógica; no constituyen por sí solas un error técnico demostrado. Las citas son relativamente amplias: requieren confirmar humanamente la afirmación concreta, no aprobarlas solo porque el hash coincide. Esta comprobación del agente no sustituye la revisión independiente.

Todas las pantallas educativas mantienen revisión independiente pendiente y SPL no ejecutado. Las MCQ se habilitan **solo como evaluación experimental del piloto autorizado**, no como preguntas certificadas. La práctica permanece not_assessed aunque el usuario consulte la rúbrica o apruebe teoría.

## 5. XP, evaluación, desbloqueos y persistencia

| Acción Splunk | XP provisional, único por lección | Requisito |
| --- | ---: | --- |
| Estudio | 5 | Marcar los cinco pasos de la fuente |
| Resumen | 5 | Estudio completo y confirmación explícita |
| Teoría | 15 | Estudio/resumen y evaluación terminada con ≥80 % |
| Repaso | 5 | Teoría piloto aprobada y confirmación explícita |
| Abierta P01 | 0 | Registrar consulta no evalúa su calidad |
| Región R01 | 100 | Estudio y teoría de sus cinco lecciones |

Máximo: 30 por lección y 250 en el piloto completo con bonus. Nivel provisional 1 a 0 XP y 2 a 250 XP. **Definitivos: 0 siempre.** No hay promoción automática de XP provisionales, ni modificación de valores SC-200. Una futura política definitiva exige aprobación y migración explícita, conservando el historial sin cobrar dos veces ni convertir intentos antiguos en preguntas revisadas.

Fórmula: `correct >= ceil(total * 0.8)`, total positivo. Con dos preguntas **1/2 falla y 2/2 aprueba**. No se redondea 79 % a aprobado. La primera opción registrada queda fija por pregunta/intento; terminar exige ambas respuestas. No hay feedback de corrección hasta finalizar. El reintento es explícito y conserva los intentos anteriores.

Durante un intento se ocultan soluciones, referencias, fuente completa y prácticas con respuesta. Otras lecciones y el laboratorio con solución quedan pausados; se puede volver al mapa, cambiar de academia y retomar después. No se inicia simultáneamente otro examen desde la lógica de acciones. Esto es una regla de presentación educativa, **no un sistema antitrampa**: las soluciones existen en los archivos de una aplicación offline y no están cifradas.

El guardado verifica curso/esquema, conserva revisiones e intentos, fusiona avances de su ruta y no sobrescribe JSON corrupto/futuro/otro curso. Permite estudiar/exportar en memoria ante errores. La revisión nueva exige estudio/teoría propios; los premios siguen siendo únicos por lección/tipo. Las respuestas libres son borradores en memoria del lector, no datos persistidos.

Resultados sintéticos offline: estudio=5, resumen acumulado=10, teoría=25, repaso=30; veinticinco repeticiones no aumentan ese máximo; cinco lecciones+bonus=250, nivel 2, práctica no evaluada. **Confirmación funcional en navegador:** L01 registra 10→30 XP al fallar 1/2, reintentar 2/2 y repasar; las cinco lecciones alcanzan 250 XP provisionales/nivel 2 y mantienen 0 definitivos tras recarga y nuevos intentos. P01 no concede XP ni nota automática. Las capturas reflejan estos estados de prueba, no progreso personal.

La matriz aprobada cubre SC-200 vacío, parcial, legacy, V2.4, V2.5 y corrupto: estudio Splunk, recarga y retorno conservan las cadenas de almacenamiento SC-200 y el perfil XP/nivel, sin lecturas ni escrituras SC-200 durante Splunk. Se prueban asimismo cuota/exportación en memoria, guardado Splunk corrupto/futuro/de otro curso, payload ausente/alterado y sincronización secuencial entre dos pestañas. El caso legacy completo conserva 3200 XP SC-200; Splunk funciona desde cero sin completarlo. Esto no es una prueba de todas las carreras simultáneas posibles entre pestañas.

## 6. Pruebas y evidencia

| Prueba | Estado y alcance real |
| --- | --- |
| Referencia SC-200 previa | 42/42 PASS sin pretest regenerador |
| Suite integrada | **61/61 PASS**, 0 fallos: 42 existentes + 19 nuevas; registro [unit.tap](../output/splunk-pilot-r01/unit.tap) |
| Importador | PASS: cinco IDs/15 actividades, hashes/contratos, reconstrucción, citas, determinismo, rutas/symlinks, entradas alteradas y guardia SC-200 |
| Persistencia/XP/prerrequisitos | PASS en funciones puras y StorageSpy: aislamiento de claves, umbral 2/2, historial/revisiones, premios únicos, bonus/nivel, corrupción/cuota y acceso por dependencias |
| Presentación estática | PASS de renderToStaticMarkup: selector/nodos, Markdown sin ejecución HTML/imágenes remotas y ausencia de soluciones en intento. No sustituye interacción ni axe |
| TypeScript | PASS: `tsc --noEmit --incremental false` |
| Compilación | PASS: `npm run build:pilot`, guardia antes/después, sin prebuild SC-200. Avisos no fatales de “use client” de lucide, ya existentes |
| Cinco paquetes | 5/5 PASS_OFFLINE; fixtures incluidos; 80/240 IDs, 20 CSV/152 filas, 178 entradas SHA256SUMS |
| Regresiones editoriales | 47/47 PASS seleccionadas explícitamente. Se excluyó una prueba que exige la instantánea React anterior al piloto; su cometido se reemplaza por la nueva guardia de 400 hashes y la prueba del cuerpo SC-200. No se modificó el test histórico ni se declaró 48/48 |
| Suite Playwright Splunk, ejecutada por el usuario | **PASS**, `status:passed`, 16 comprobaciones, cero errores/external; [resultado real](../output/playwright/splunk-piloto-r01/resultados.json), fecha 18:04:58 UTC |
| Navegación/foco/descargas | PASS en los casos ejecutados: cinco lecturas, bloqueo por URL, selector, Atrás/Escape/foco y exportaciones propias; sin afirmar un caso específico de Adelante |
| Responsive 320/390/768/1440 y movimiento reducido | PASS: 20 registros sin overflow y con movimiento reducido, más comprobaciones de ancho del examen en las cuatro medidas. Capturas del mapa inspeccionadas |
| Axe de suite Splunk | 24 comprobaciones, 0 violaciones; 16 entradas con `aria-prohibited-attr` incomplete y 12 con `color-contrast` incomplete (se solapan). Los cuatro exámenes no guardan el campo incomplete |
| Regresión SC-200 V2.5 | **PASS**, `passed:true`, 7 grupos, 76 registros V2.4/65 revisiones, XP e historial conservados, lectura breve y exportación; cero errores/external; [informe](../output/playwright/splunk-piloto-r01/sc200-v25/compatibility-results.json), 18:07:11 UTC |
| Actividades SC-200 en compatibilidad | 18 comprobaciones axe sin violaciones, cinco formatos más la lectura breve a 320/390/768; no se registran incomplete en esta suite |
| Axe SC-200 dedicado | 24 vistas (8 por 390/768/1440), **0 violaciones detectadas**, axe-core 4.10.3; [informe](../output/playwright/splunk-piloto-r01/sc200-a11y/accessibility.json), 18:08:00 UTC. Contraste incomplete en las 24 |
| Splunk/ES/SOAR real | NO ejecutado; ninguna promesa de sintaxis, extracciones, permisos o resultados reales |

Las horas de los informes corresponden al campo de inicio de cada ejecución del 16/10/2026, no a una duración total. Los 7 elementos SC-200 son grupos de comprobaciones, no solo siete lecturas; las cifras de axe son comprobaciones/vistas, no preguntas certificadas ni necesariamente pantallas distintas entre suites.

### Códigos de salida y límites de trazabilidad

No hay log de terminal, campo `exitCode` ni captura de `$?` en los 16 archivos recibidos (3 JSON y 13 PNG). No es posible acreditar retrospectivamente el número exacto devuelto por cada proceso solo con esos archivos. Sí se verificaron las condiciones de éxito contra los runners:

- Splunk: `status:passed` solo se asigna después de las aserciones y de la matriz; el catch asigna salida 1 y estado failed/blocked. El resultado aportado corresponde a la ruta de éxito, compatible con salida normal **0**, sin failure.
- SC-200 V2.5: `passed:true`, siete grupos completos y arrays de errores vacíos; el catch marca false/salida 1. Compatible con salida normal **0**.
- Axe SC-200: están las 24 vistas esperadas, sin violaciones; el runner asigna salida 1 si las hay. Compatible con salida normal **0**, no constancia directa del código del shell.
- En esta revisión, el verificador protegido y el contraste de las cinco fichas sí se ejecutaron como diagnósticos de solo lectura y devolvieron **0**. No se relanzaron suites de navegador ni generadores, para conservar las evidencias aportadas y respetar el alcance documental.

Por tanto: PASS de los resultados comprobado; códigos 0 de las tres ejecuciones del usuario **inferidos del flujo de éxito, no archivados explícitamente**. Los informes tampoco fijan versión exacta de Chromium ni huella del build/código ejecutado. Para lotes posteriores conviene conservar esos datos junto a cada corrida; no se inventan ahora.

El [informe offline anterior](../output/splunk-pilot-r01/resultados-offline.json) y su campo browser bloqueado son evidencia **histórica** del entorno del agente. El bloqueo se superó para esta validación mediante la ejecución del usuario en Parrot OS. La matriz `tests/splunk-browser-matrix.mjs`, antes solo preparada, aparece ahora completada en los 16 checks. No se alteraron los JSON para aparentar un nuevo resultado.

No se ejecutaron aquí predev/pretest/prebuild, instaladores, servicios Splunk, contenedores, ataques, backend, autenticación, publicaciones ni commits. No se abrió ni exportó progreso personal. Los runners inspeccionados crean contextos nuevos y fixtures sintéticos; los informes revisados no son un volcado de LocalStorage personal.

### Capturas del selector y mapa

**13/13 PNG recibidos e inspeccionados visualmente**, sin imágenes generadas ni sustitución por capturas antiguas:

- [Selector SC-200, 1440](../output/playwright/splunk-piloto-r01/selector-sc200-1440.png) y [selector/mapa Splunk inicial, 1440](../output/playwright/splunk-piloto-r01/selector-mapa-splunk-1440.png).
- Mapas con progreso sintético completo: [320](../output/playwright/splunk-piloto-r01/mapa-320.png), [390](../output/playwright/splunk-piloto-r01/mapa-390.png), [768](../output/playwright/splunk-piloto-r01/mapa-768.png) y [1440](../output/playwright/splunk-piloto-r01/mapa-1440.png). Se ven cinco nodos, 250 XP provisionales/nivel 2, 0 definitivos y aviso editorial; no se mezclan las cabeceras de XP.
- SC-200: resultado de lectura breve a 1440, feedback a 320/390/768 y cuestionario a 390/768/1440, en los subdirectorios `sc200-v25/` y `sc200-a11y/` enlazados arriba.

No se observan solapamientos impeditivos en el mapa Splunk; el selector, leyenda y paneles se adaptan a las anchuras recibidas. En SC-200, el rótulo compacto «Demuestra» queda recortado a 320 px; ya ocurre en la [captura V2.5 anterior](../output/playwright/v25-final/compatibility/short-reading-feedback-320.png), contrastada en este cierre. Es una limitación visual preexistente, no una regresión atribuida al piloto; no se modificó SC-200 para corregirla. También permanece el puente histórico «Splunk · Próximamente» de sus lectores, que no equivale a un enlace de equivalencia ya implementado.

Las capturas no prueban contraste normativo, lectura de pantalla o toda interacción. En particular, los dos conjuntos de axe con incomplete requieren revisión manual: 24/24 vistas SC-200 dejan `color-contrast` pendiente (457 referencias a nodos, con repeticiones entre vistas). La suite Splunk guarda solo los IDs de incomplete, sin nodos; sería necesaria evidencia más detallada o inspección dirigida para resolverlos. No se contabilizan como violaciones confirmadas ni como controles aprobados.

### Comparación de hashes protegidos

| Invariante | Antes → después |
| --- | --- |
| Conjunto protegido de esta fase | 400 archivos → 400 iguales; cero discrepancias |
| Catálogo/payloads/revisiones/actividades SC-200 | Bytes e IDs idénticos |
| Fuente SC-200 según catálogo y pruebas de reconstrucción | `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`, igual |
| Currículo Splunk | `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933`, igual |
| Cinco paquetes e investigación histórica | Archivos originales protegidos iguales; no alterados para adaptar la UI |

La guardia compara también el conjunto de archivos SC-200 en `public/content/` y `src/generated/`, excluyendo solo el destino nuevo `src/generated/splunk/`. No modifica inventarios históricos para hacerlos pasar. El check de preservación editorial anterior al piloto ya no es el baseline de código React autorizado para esta fase.

En el cierre se repitió la guardia con salida 0 y se compararon además **424 archivos** de código, pruebas, contenido, paquetes y evidencias antes/después de la revisión: cero cambios en ese conjunto. Las 13 capturas, tres informes de navegador, fichas y registro unitario se conservaron byte a byte.

### Rendimiento medido, sin benchmark de navegador

Se compiló una referencia previa y la versión integrada con las mismas herramientas. Tamaños de las entradas JS/CSS referenciadas por el HTML, sin HTML ni payloads:

| Medida | Referencia | Integrada | Diferencia |
| --- | ---: | ---: | ---: |
| Bytes sin comprimir | 484.547 | 487.272 | +2.725 |
| Bytes gzip calculados localmente | 144.800 | 145.508 | +708 |

Splunk genera un chunk JS separado de 38.533 bytes y CSS de 11.838; el Markdown usa además un chunk compartido diferido. Los cinco payloads se solicitan al abrir su lección. No hay IDs de las otras 75 lecciones en el JavaScript compilado; no se empaquetaron sus Markdown ni bancos completos. La entrada inicial no contiene el texto de las lecciones Splunk.

Estas son medidas de artefactos, **no** TTI/LCP/INP, transferencia real, FPS o tareas largas. El catálogo SC-200 existente sigue en la entrada inicial incluso al abrir directamente Splunk; se conserva ese comportamiento y no se reestructura SC-200 por este piloto. La muestra de red posterior se describe a continuación y no sustituye un benchmark de rendimiento interactivo.

La ejecución del usuario añade una muestra real de entrada directa a Splunk: **62 recursos, 4.116.231 bytes transferSize sumados y duración máxima individual de petición de 75,5 ms**. No hay solicitudes `splunk-content/` antes de abrir una lección ni IDs R02–R11 en esa lista; respalda la carga bajo demanda. Es **Vite en desarrollo**, con HMR, dependencias y módulos SC-200 compartidos/eager, no el bundle de producción de la tabla. No se suma la duración de peticiones paralelas para inventar un tiempo de carga. El runner instala un observador de tareas largas, pero no exporta sus muestras: no hay evidencia archivada para LCP/INP/TTI, tareas largas o FPS. La carga bajo demanda tiene evidencia; el benchmark de producción sigue pendiente.

## 7. Ejecución segura y reproducción de la validación

Desde la raíz, sin instalar dependencias ni ejecutar los pre-hooks SC-200:

```sh
npm run check:protected
npm run prepare:splunk
npm run test:pilot
npm run build:pilot
npm run dev:pilot
```

El último comando requiere un entorno que permita un servidor local. Mantén para uso personal el origen habitual de SC-200; cambiar puerto/origen crea otro almacenamiento y no migra el progreso. El selector está en la misma aplicación. No usar `prepare:content` para importar Splunk ni cambiarle la fuente.

Para pruebas automatizadas, **otro origen y perfiles sintéticos**, sin cerrar servidores existentes:

```sh
npm run dev:pilot -- --port 5187
```

En otra terminal:

```sh
npm run test:splunk:browser -- --base-url http://127.0.0.1:5187/
node tests/e2e.mjs --base-url http://127.0.0.1:5187/ --output-dir output/playwright/splunk-piloto-r01/sc200-v25 --v25-compatibility --axe-path output/v25/reanudacion/axe.min.js
node tests/e2e.mjs --base-url http://127.0.0.1:5187/ --output-dir output/playwright/splunk-piloto-r01/sc200-a11y --a11y --axe-path output/v25/reanudacion/axe.min.js
```

Estos son los runners contrastados con los **resultados aprobados aportados por el usuario**; no se relanzaron en este cierre. Playwright usa el Chromium local y contextos nuevos, bloquea solicitudes externas en la suite Splunk y no toma el perfil personal. Se siguió el patrón playwright-core ya instalado en el proyecto; no se descargó una CLI o navegador. La skill React orientó separación por curso, carga diferida y esquema de almacenamiento; la de diseño mantuvo la paleta premium existente sin rediseñar SC-200.

Para regenerar únicamente los informes JSON de evidencia/ficha, tras disponer del registro unitario y build actuales:

```sh
node --import tsx --experimental-test-isolation=none --test --test-reporter=tap --test-reporter-destination=output/splunk-pilot-r01/unit.tap tests/*.test.ts
node --import tsx scripts/splunk-report.mjs
```

**Advertencia documental:** el programa `scripts/splunk-report.mjs` todavía escribe literalmente el estado histórico browser blocked/pending. No se ejecutó ni corrigió aquí. Ejecutarlo ahora no sirve para regenerar este dictamen de cierre; conservar los resultados Parrot y este informe como evidencia actual. Los JSON offline y las fichas se dejaron intactos.

Huellas SHA-256 de las evidencias revisadas, para identificar esta entrega sin modificar los originales:

| Evidencia | SHA-256 |
| --- | --- |
| `resultados.json` | `670f7aac6aa31267dbe814aade5a740c4e7300e4e0bd5d6b258af06f65dba884` |
| `sc200-v25/compatibility-results.json` | `4d94928a690b477ccf87518f7b41ec896d8431fb070e1f65d0ef136ac0808515` |
| `sc200-a11y/accessibility.json` | `49a3f2220766115b1eec4880f63399d9fa5fb7323ac3b42222546a58f7305f93` |
| Fichas `revision-educativa.json` | `1b135a95576e3c0f3ca6d8f287bd9038145815def529ebd9aafdbc64f9e5d794` |

Antes de actualizar este documento se respaldó y verificó la versión anterior en `output/splunk-pilot-r01/respaldo-cierre-20261016/SPLUNK-PILOTO-R01.md` (SHA-256 `0f7a59540474f832393f380f5070a6c1d0a6530c9e4555c09670ae658159899a`). En este cierre solo se actualiza el informe y se conserva ese respaldo: no se cambian aplicación, XP, progreso, catálogo, contenido educativo, fichas ni paquetes.

## 8. Pendientes, aceptación y ampliación

| Pendiente | Efecto en el dictamen |
| --- | --- |
| A11y manual: contrastes y ARIA incomplete; lector de pantalla y otros navegadores/dispositivo físico | No hay violaciones confirmadas en los resultados automáticos, pero no se declara conformidad WCAG completa ni acceso universal validado |
| Cinco fichas educativas, sin revisor independiente ni aprobación | Solo uso experimental/editorial, sin preguntas certificadas, dominio práctico o recompensas definitivas |
| Códigos de salida crudos y versión/huella de ejecución no archivados | Los PASS están documentados; no se inventan `$?`, versión Chromium ni vinculación criptográfica de los informes a un build |
| Casos dedicados de Adelante, cancelación de fetch y fallo de chunk/catálogo; inspección exhaustiva de las 13 regiones SC-200 | Implementación/conservación observables en código, pero no se etiquetan como nuevos casos E2E ejecutados por estos informes |
| Medición de rendimiento de producción y tareas largas | Los tamaños y la muestra de red en desarrollo no acreditan fluidez, FPS o tiempos de producción |
| Generador del informe offline conserva estado browser bloqueado literal | Limitación del informe histórico, no fallo demostrado de la aplicación; pendiente actualizar esa herramienta en otro alcance autorizado |
| Rótulos compactos y puente «Próximamente» de SC-200 | Observaciones visuales preexistentes, no corregidas por restricción del usuario |
| Splunk/ES/SOAR real | Fuera de alcance; no se validaron SPL, ingesta, extracciones, permisos, rendimiento ni topologías en producto |

La validación técnica del **piloto experimental** queda cerrada favorablemente en los escenarios aportados: datos protegidos intactos, pruebas offline aprobadas y evidencia real de convivencia/navegador/regresión, con las reservas anteriores. No se transforma en aprobación educativa independiente ni en aceptación incondicional de toda la plataforma. No hay regresiones críticas detectadas en este alcance; no es una demostración de ausencia de cualquier fallo posible.

### Preparación para ampliar R02–R03 — diseño, no autorización

**Sí, la arquitectura es una base preparada para una ampliación por lote; no está preparada para importar R02–R03 sin trabajo adicional.** Ya separa generación, catálogos, IDs/revisiones, almacenamiento, niveles, desbloqueos, exportación y carga de payloads; las pruebas de convivencia respaldan esa separación. R02/R03 comparten el paquete editorial actual: el lote añadiría 6+7=13 lecciones y 39 actividades, para un total R01–R03 de 18/54, no las 80 completas.

Antes de otro lote autorizado será necesario:

1. Ampliar de forma explícita la lista de IDs y allowlist de destinos del importador, hoy fijadas a R01 (`scripts/prepare-splunk.mjs:7`, `:13`, `:39`, `:57`, `:109`). Mantener comprobación protegida antes/después; no usar el preparador SC-200.
2. Parametrizar región, mapa, denominadores y recursos: `SplunkApp` y `SplunkMap` aún contienen SP-R01, textos de cinco lecciones, vuelta/Escape a R01 y bonus R01. No basta con añadir JSON al catálogo; las URLs R02/R03 no están habilitadas hoy.
3. Fijar prerrequisitos por ID desde las fuentes y aprobar el grafo; nunca arrastrar requisitos SC-200. Revisar los mapeos, UTC, consultas y resultados de fixtures R02/R03 como comprobaciones offline, sin presentarlos como Splunk ejecutado.
4. Definir saneado acotado de fixtures sintéticos y referencias locales seguras sin cambiar el saneador SC-200. Añadir citas/payloads de cada lectura y fichas educativas; conservar IDs/revisiones e historial R01 existente.
5. Mantener el almacén Splunk y su ledger separados, premios únicos y estado provisional hasta la decisión educativa correspondiente; probar progreso R01 ya existente, no solo un almacén vacío.
6. Ejecutar la matriz completa y regresiones SC-200, además de desbloqueos interregión, recursos, responsive/a11y y carga diferida del lote nuevo; archivar códigos de salida y huellas de versión. Resolver o mantener explícitamente las reservas manuales, sin declarar aprobados controles incomplete.

Solo después de autorización expresa corresponde implementar ese lote. Los lotes posteriores seguirían R04–R05, R06–R07, R08–R09 y R10–R11, con sus propias puertas. No concatenar 80 Markdown en el bundle ni mezclar catálogos en el motor SC-200.

Rollback: detener únicamente el servidor de pruebas propio y volver al código respaldado de App/package mediante restauración selectiva; regenerar el build compatible si procede. No extraer todo un respaldo sobre cambios futuros ni borrar claves de ningún curso. Los almacenes independientes se conservan aunque se retire el selector/piloto.

**Parada: revisión documental de las ejecuciones reales terminada; piloto R01 favorable técnicamente para uso local experimental, con reservas y revisión humana pendiente. No se integra ni se autoriza R02–R11 en este cierre.**
