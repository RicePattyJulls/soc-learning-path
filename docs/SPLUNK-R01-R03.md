# Splunk SOC V1.1 — R01–R03

Fecha: 16/10/2026. Ampliación local autorizada: **R02 y R03 exclusivamente**. La aplicación incorpora tres regiones, 18 lecciones y 54 actividades. No incorpora R04–R11 ni declara terminada la academia de 80 lecciones.

## Dictamen y punto de parada

**IMPLEMENTADO:** ampliación del importador independiente, atlas de tres regiones y sus mapas, 13 lecturas nuevas completas, 26 MCQ adicionales y 13 prácticas abiertas adicionales, laboratorios R02/R03, CSV sintético consultable y recursos bajo demanda. Se reutilizan el lector, la persistencia y el motor de recompensas del piloto.

**VALIDADO OFFLINE:** 70/70 pruebas unitarias (42 SC-200 + 19 Splunk adaptadas + 9 V1.1), TypeScript estricto, compilación, 18 IDs/54 actividades, cinco paquetes editoriales, 47 regresiones editoriales seleccionadas, reconstrucción/citas/hashes, conservación del guardado R01 sintético y cálculo de XP/bonus/desbloqueos. Códigos de salida archivados: 0 para esas comprobaciones.

**BLOQUEADO POR EL ENTORNO:** Vite devuelve `listen EPERM` en 127.0.0.1:5187; Chromium falla con `setsockopt: Operation not permitted`. Ambos intentos devuelven código 1. No se usaron sudo, cambios globales de permisos ni reintentos equivalentes.

**PENDIENTE:** ejecución funcional V1.1 en Parrot OS, regresión de navegador SC-200, responsive, axe, capturas e inspección visual. El runner está preparado y pasa comprobación de sintaxis; eso **no equivale a haber ejecutado sus escenarios**. La revisión educativa humana independiente y la validación real en Splunk continúan pendientes.

**Dictamen: implementación y validación offline favorables; aceptación funcional de la ampliación todavía pendiente.** El PASS anterior del piloto R01 no se reutiliza como PASS V1.1. Esperar resultados del usuario antes de declarar aprobada la ampliación. No continuar con R04–R11.

## 1. Recuperación, respaldo e invariantes

Se revisaron AGENTS.md, RETOMAR.md, el cierre del piloto, PLAN_INTEGRACION.md, CORRECCIONES_FINALES.md, currículo canónico y paquete R01–R03: índices, lecciones, banco, soluciones, rúbrica, manifiesto, contratos y laboratorios. Las notas históricas «no integrado» describen sus fechas originales; no se reescribieron esos documentos para cambiar el estado del proyecto.

Antes de modificar archivos preexistentes se creó el [respaldo verificable](../output/splunk-v11/respaldo/inventario.json): **227 copias**, comprobadas individualmente por SHA-256, bajo `output/splunk-v11/respaldo/archivos/`. Huella del mapa de copias: `1adf94688b2e93c9dd6c59599f4db9c8d362d2211aa1379f8f06f7288014fb3b`. Incluye código, configuración, pruebas, documentación y derivados saneados. Excluye secretos, archivos de entorno, perfiles de navegador y LocalStorage.

Guardias combinadas:

- `scripts/splunk-integrity.mjs`: conserva el inventario histórico de **400 archivos** sin modificarlo para aceptar cambios nuevos. Incluye contenido/derivados SC-200, currículo, paquetes editoriales e investigación protegida; contrasta también el conjunto de archivos SC-200.
- `scripts/splunk-v11-integrity.mjs`: **29 comprobaciones adicionales** de archivos: payloads/recurso R01, App/estilos del dispatcher, cierre/fichas/evidencias R01 y motor Splunk de progreso, hook y acceso a datos. Compara además los cinco objetos de metadatos R01 completos contra el respaldo.
- Antes de escribir, el importador comprueba también que los payloads y metadatos R01 que pretende generar son idénticos a la referencia. Si hay una discrepancia, aborta antes de publicar. Una prueba negativa altera solamente un payload en un directorio temporal y confirma el bloqueo sin generar nuevas lecturas.

| Invariante | Antes → después |
| --- | --- |
| SC-200 | 13 capítulos / 76 lecturas / 719 pasos / 272 actividades, idénticos |
| Fuente SC-200 | `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`, idéntica |
| Currículo Splunk | `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933`, idéntico |
| Guardia histórica | 400/400 archivos iguales |
| Guardia adicional | 29/29 archivos iguales; cinco metadatos R01 iguales |
| Motor de progreso Splunk | `progress.ts`, `useSplunk.ts` y `data.ts` sin cambios |
| Originales editoriales / SC-200.md | Sin cambios |
| Progreso personal | No leído, exportado, borrado ni sobrescrito |

Los cinco payloads R01 conservan exactamente sus bytes, versiones, preguntas, opciones y revisiones:

| ID | Revisión educativa conservada | SHA-256 del payload conservado |
| --- | --- | --- |
| SP-R01-L01 | `7f1943ad8e96ef796cd78810` | `6595b9a1fe319245b43e0b5905d80a36158a1fd9881543f85fc5f33bd9c68c9b` |
| SP-R01-L02 | `cff642050a1104e1a277d54b` | `b6f6b251e98b123debee0d990aaa8aad9836bd4fa25954ccc23d5e8e29fa1a7f` |
| SP-R01-L03 | `f5a8b76c50b283d908758c3f` | `94233d2b1f187651de92a06bfae51ec42b94b387281b17462ba5a6a06b83e4d3` |
| SP-R01-L04 | `dae22a82444ea447af9ea057` | `f0da664be9bff9441223c6f5d9e8b6e989497d232b3f73235c7a1961d460e898` |
| SP-R01-L05 | `c25f6cf6be1d5e03ae30cf38` | `735b38e3aec26a36db28334948dd8d6503c0a06acbbc3fed0cc925982758e7a9` |

Se preservan los informes y capturas originales de `output/playwright/splunk-piloto-r01/` y sus cinco fichas anteriores. No se sustituyen por resultados de esta fase.

## 2. Arquitectura y cambios

No se reconstruyó la aplicación. Se mantienen el dispatcher y la carga dinámica de `SplunkApp`, el subárbol SC-200 literal, sus componentes/mapas, router histórico, generador, progreso y recompensas. Las skills de diseño y React guiaron la reutilización del lenguaje visual y la conservación del catálogo diferido y almacenamiento versionado; no se añadieron dependencias ni servicios.

| Ámbito | Implementación V1.1 |
| --- | --- |
| Importación | `scripts/prepare-splunk.mjs`, lista exacta de 18 IDs; cinco manifiestos comprobados, solo paquete R01–R03 publicado |
| Catálogo / índice | `src/generated/splunk/`, separados de SC-200 |
| Lecturas | 18 JSON en `public/splunk-content/`, pedidos por ID al abrir el lector |
| Recursos | R01 `resources.json` conservado; R02/R03 `resources-SP-R02.json` / `resources-SP-R03.json`, descarga por región |
| Presentación | `SplunkMap`, nueva `RegionScene`, nuevo `Resources`; lector/app generalizados por región |
| Persistencia | Misma clave `soc-learning-path:splunk:learning:v1`, mismo esquema 1; sin migración |
| Guardias / evidencias | Nuevos scripts V1.1; resultados separados, fechados y con códigos de salida |

La generación valida SHA canónico, 80 IDs/títulos/objetivos en los manifiestos, hashes de entradas y SHA256SUMS, 18 IDs autorizados, sus 54 actividades/opciones, referencias oficiales acotadas al paquete y reconstrucción saneada de ocho secciones por fuente. Las cinco secciones de enseñanza siguen siendo los pasos guiados. Actividades, soluciones y bibliografía se conservan en representaciones separadas.

Destinos exclusivos: 18 payloads + tres recursos, catálogo, índice e informe derivado `docs/SPLUNK-CONTENIDO.md`: **24 archivos**. Se validan rutas y symlinks antes de escribir; no hay overrides de fuente/IDs/destino, invocación del generador SC-200 ni borrado de directorios. Se omiten escrituras de contenido idéntico. Staging/rename es por archivo, con catálogo al final; el lote completo no es una transacción entre directorios. Ante interrupción se debe verificar y regenerar; no limpiar directorios indiscriminadamente.

La excepción de saneado para la fixture se limita a su hash completo aprobado (`f9674d6c79e8d027034e75e398801ccddda369fd4fe817e4c54520fc8b9a79ab`), sus IPs RFC 5737 y cuentas example.test. Las menciones didácticas correspondientes se conservan solo en los documentos R03 comprobados. Otros datos personales/secretos siguen saneándose; SC-200 no cambia. No se añadió un ejecutor SPL ni envío HEC.

Los comandos antiguos `predev`, `pretest` y `prebuild` regeneran SC-200: no se ejecutaron. La validación nueva llama directamente a herramientas seguras. `test:splunk:browser` ahora apunta a la suite V1.1; las dos herramientas históricas de informes/navegador R01 rechazan el catálogo ampliado antes de sobrescribir sus evidencias.

## 3. Atlas, cobertura y navegación

El atlas muestra tres regiones explorables, incluso cuando sus lecciones están bloqueadas. Cada región tiene su propia escena SVG local y sus nodos/estado/progreso/bonus. Puerto mantiene el motivo portuario; Río añade cauce, estaciones de entrada y puente; Bosque añade arbolado, sendero y observatorio. Se reutilizan CSS/componentes y la pieza vectorial pura `LandscapeLandmark`, sin cambiar los paisajes SC-200 ni dibujar R04–R11. Los contadores y recompensas dependen del catálogo, no de cinco lecciones fijas.

| Región | Lecciones | MCQ | Abiertas | Recursos |
| --- | ---: | ---: | ---: | --- |
| R01 — Puerto de Splunk | 5 | 10 | 5 | Laboratorio de arquitectura conservado |
| R02 — Río de Telemetría | 6 | 12 | 6 | Laboratorio de diagnóstico de ingesta |
| R03 — Bosque SPL | 7 | 14 | 7 | Mini-hunting offline, CSV y contrato UTC |
| **Total** | **18** | **36** | **18** | **3 laboratorios** |

Lecciones presentes (cada una conserva Q01, Q02 y P01 originales):

| ID | Título |
| --- | --- |
| SP-R01-L01 | Ecosistema Splunk y límites de producto |
| SP-R01-L02 | Anatomía de una instancia |
| SP-R01-L03 | UF, HF, indexer y search head |
| SP-R01-L04 | Anatomía de evento y metadatos |
| SP-R01-L05 | Primer razonamiento de búsqueda |
| SP-R02-L01 | Seleccionar fuentes y rutas de entrada |
| SP-R02-L02 | Logs Windows y Linux |
| SP-R02-L03 | HTTP Event Collector |
| SP-R02-L04 | `inputs`, `props`, `transforms`, `outputs` |
| SP-R02-L05 | Timestamps, parsing y latencia |
| SP-R02-L06 | Troubleshooting de cobertura |
| SP-R03-L01 | Estrategia de búsqueda y ventanas |
| SP-R03-L02 | Filtros de búsqueda y `where` |
| SP-R03-L03 | Tablas, campos y exploración |
| SP-R03-L04 | Campos calculados con `eval` |
| SP-R03-L05 | Agrupar con `stats` |
| SP-R03-L06 | Ventanas con `bin` y `timechart` |
| SP-R03-L07 | Primer mini-hunting guiado |

Rutas SC-200 conservadas: `#/ruta`, `#/capitulo/:id`, `#/leccion/:id`, biblioteca, progreso y repaso. Rutas Splunk:

- `#/splunk/ruta`: atlas y continuación de la última lectura propia.
- `#/splunk/region/SP-R01`, `SP-R02`, `SP-R03`: mapas; `?nodo=ID` para retorno con foco.
- `#/splunk/leccion/:id?fase=estudio&paso=1`: lector y fases existentes.
- `#/splunk/recursos`: índice; `/SP-R01`, `/SP-R02`, `/SP-R03`: recurso de región.
- `#/splunk/progreso`: bitácora/exportación propias.

Escape y retorno al nodo derivan la región de la lección. El runner nuevo comprueba Atrás **y Adelante**, enlaces directos y foco, pero esas aserciones siguen pendientes de ejecución real V1.1. Un ID fuera del lote no carga otra lectura. El acceso por URL y las acciones comprueban requisitos, no solo el candado visual.

### Prerrequisitos explícitos

Se expanden las dependencias editoriales por ID; no se cambia el currículo:

| Lecciones destino | IDs requeridos, estudio y teoría aprobada |
| --- | --- |
| SP-R01-L01 | Ninguno |
| SP-R01-L02…L05 | SP-R01-L01 (rama original conservada) |
| SP-R02-L01 | SP-R01-L01, SP-R01-L02, SP-R01-L03, SP-R01-L04, SP-R01-L05 |
| SP-R02-L02…L06 | Los cinco IDs R01 anteriores + SP-R02-L01 |
| SP-R03-L01 | Los cinco IDs R01 anteriores + SP-R02-L01, SP-R02-L02, SP-R02-L03, SP-R02-L04, SP-R02-L05, SP-R02-L06 |
| SP-R03-L02…L07 | SP-R03-L01 |

Cada array efectivo está publicado en el catálogo/informe derivado. No hay dependencia de SC-200, de práctica calificada, ni de producto/licencia real. No se introduce una secuencia adicional entre L02–L06 o L02–L07 que sus fuentes no exijan.

## 4. Actividades y revisión educativa

**18/18 fichas: `pending_independent_review`, `approved:false`, `reviewer:null`, `reviewedAt:null`.** Sus MCQ son experimentales. Las fichas nuevas contienen preguntas/opciones/soluciones, anclas locales, fuente/revisión, prácticas, rúbricas y lista de revisión. Se conservan las cinco fichas R01 históricas sin atribuirles una aprobación inexistente. Véase `revision-educativa.json` en la última ejecución offline enlazada abajo.

Las 36 MCQ mantienen IDs de actividad/opción y primera respuesta inmutable por intento. Con dos preguntas, el 80 % exige **2/2**; 1/2 falla. No se inventaron preguntas para inflar cobertura. P01 conserva rúbrica y respuesta orientativa, sin autocorrección, nota, requisito práctico ni XP automático.

Durante un intento se bloquean soluciones, referencias, fuente completa y prácticas con respuesta; también otros lectores y laboratorios. Los razonamientos se consultan fuera de evaluación. Esto no constituye un sistema antitrampa: una app local contiene sus soluciones en los archivos, sin cifrado. Las pruebas estáticas verifican ocultación para las 18 lecciones; falta confirmar interacción en navegador V1.1.

Pendientes concretos de revisión:

- Exactitud técnica y versión/producto de cada afirmación; Enterprise, Enterprise Security y SOAR permanecen distintos.
- Anclas amplias en enseñanza/caso: verificar que respaldan la respuesta concreta, no solo que sus hashes coinciden.
- Calidad de distractores y pistas por longitud. `SP-R02-L06-Q01` conserva una alternativa sobre colores de severidad posiblemente demasiado fácil; se registra sin alterar el banco protegido.
- Rúbrica genérica de tres criterios: suficiencia para cada práctica y dificultad real con estudiantes.
- R03: nulos, NAT/VPN, cobertura y ventanas; un patrón sospechoso no confirma intrusión, y no superar el umbral no demuestra benignidad.

No se repitió investigación general ni se necesitó resolver una duda técnica nueva mediante navegación externa. Las referencias originales se conservan; su integridad y trazabilidad no constituyen validación práctica ni un nuevo rastreo exhaustivo de enlaces.

## 5. Persistencia, XP y datos sintéticos

Se conserva `soc-learning-path:splunk:learning:v1` con esquema 1, courseId splunk y rewardMode provisional_only. No se reinicia R01, no se migra SC-200 ni se crea nivel global. El motor y hook anteriores están intactos. Historial por ID/revisión, intentos, formativas, ledger de premios únicos y última lección conservan su contrato. Las respuestas libres siguen siendo borradores en memoria, no progreso persistido.

| Acción | XP provisional único |
| --- | ---: |
| Estudio completo | 5 |
| Resumen confirmado tras estudio | 5 |
| Teoría aprobada ≥80 % | 15 |
| Repaso tras teoría | 5 |
| Práctica abierta | 0 |
| Bonus de cada región tras estudio/teoría de todas sus lecciones | 100 |

Máximo de lección: 30; nivel cada 250. Resultados **en memoria/almacenamiento simulado**, no progreso personal:

- Guardado construido con el catálogo **anterior** R01: conserva cinco registros, intentos, premios, formativas y posición SP-R01-L05; 250 XP/nivel 2. V1.1 lo carga sin migración ni premio nuevo por cambiar de curso.
- R01 completa desbloquea únicamente R02-L01; R03 permanece bloqueada. Completar estudio/teoría R02 abre R03-L01. Las ramas interiores mantienen sus dependencias documentales.
- R01: hasta 250 XP; R02: 280 adicionales; R03: 310 adicionales. Total **840 XP provisionales / nivel 4 / 90 XP de nivel / tres bonus únicos**. Repetir y recargar no duplica recompensas.
- **0 XP definitivos**, práctica `not_assessed` incluso con teoría aprobada. No hay promoción automática de premios mientras la revisión educativa esté pendiente.
- StorageSpy conserva las claves SC-200 y legacy, incluido el fixture histórico de 3200 XP. Casos corruptos/futuros/otro curso no se sobrescriben; cuota permite sesión en memoria/exportación. No se afirma haber probado todas las carreras simultáneas entre pestañas.

### CSV y resultados offline

La fixture de R03 tiene 10 filas fechadas el 16/10/2026 UTC; nueve fallos y un éxito. El verificador local confirma:

| IP de documentación / bucket UTC | Fallos | Identidades no vacías |
| --- | ---: | ---: |
| 203.0.113.9 / 09:00 | 6 | 5 |
| 198.51.100.20 / 09:00 | 1 | 1 |
| 192.0.2.25 / 09:00 | 1 | 0 |
| 203.0.113.9 / 09:15 | 1 | 1 |

Son bloques de 15 minutos, no ventanas móviles. Solo el primero alcanza cinco identidades; sigue siendo sospecha sintética, no ataque confirmado. El SPL con `earliest=-24h` es ilustrativo: sus cifras solo se atribuyen a esta fixture/rango UTC, no a una ejecución actual. `timestamp_utc` necesita mapeo real a `_time`; el contrato no lo configura ni recrea `_indextime`. La app muestra el CSV/contrato, no ejecuta Python o SPL.

## 6. Pruebas, códigos y evidencia

El enlace [última ejecución offline](../output/splunk-v11/validacion/ultima-ejecucion.json) apunta a una corrida fechada con `ejecucion.json`, versiones, hashes de código/catálogo, comandos, códigos, stdout/stderr, `unit.tap`, fichas y `resultados-offline.json`. Cada corrida usa un directorio nuevo: no sobrescribe la anterior. Los stdout de algunos procesos Node están vacíos en este entorno; el TAP se escribe directamente mediante el reporter, y se comprueban su total/PASS/fallos antes de aceptar la suite.

El [cierre verificable](../output/splunk-v11/cierre.json) registra la reverificación de las 227 copias y guardias. Las dos herramientas históricas se probaron también: rechazan correctamente con código 1 antes de generar informes o lanzar Chromium; es un bloqueo protector esperado, distinto del fallo ambiental de la suite nueva.

| Comprobación | Resultado real |
| --- | --- |
| Sintaxis de importador/guardia/orquestador/runner nuevo | VALIDADO, código 0; no implica ejecución del navegador |
| Generación | VALIDADO, 18/54, 24 salidas, determinista, destinos aislados, R01 idéntica |
| Unitarias integradas | VALIDADO, **70/70**, 0 fallos, 0 omitidas; incluye 42 SC-200 |
| TypeScript / Vite build | VALIDADO, códigos 0, sin pre-hooks regeneradores SC-200 |
| Cinco paquetes originales | VALIDADO OFFLINE, 80 IDs / 240 actividades; 20 CSV / 152 filas; originales intactos |
| Regresiones editoriales | VALIDADO, **47/47 seleccionadas**, código 0 |
| Guardia histórica anterior a React | Una prueba histórica excluida explícitamente: exige snapshot previo al piloto; no se alteró ni se declaró 48/48. La protección actual se demuestra con las guardias 400+29 |
| Integridad SC-200 / R01 antes-después | VALIDADO por hashes, conjuntos y metadatos; no equivale a regresión visual ejecutada |
| Persistencia / XP / desbloqueos | VALIDADO en funciones puras y almacenamiento sintético, incluida carga R01 anterior |
| Markdown / soluciones | VALIDADO en reconstrucción, IDs, citas y render estático; interacción pendiente |
| Vite local del agente | BLOQUEADO, `listen EPERM`, código 1; [registro](../output/splunk-v11/entorno-servidor.json) |
| Playwright V1.1 del agente | BLOQUEADO al lanzar Chromium, código 1; **0 escenarios aprobados, 0 capturas** |
| Navegación / persistencia real / multiventana V1.1 | PENDIENTE; preparados escenarios y fixtures aislados |
| Responsive 320/390/768/1440, teclado/foco/historial/movimiento reducido | PENDIENTE en navegador V1.1 |
| Axe Splunk / SC-200 y regresión completa SC-200 en navegador | PENDIENTE en este build |
| Splunk / HEC / ES / SOAR real | NO EJECUTADO; sin autorización operacional |

La [ejecución de navegador bloqueada](../output/playwright/splunk-r01-r03/2026-10-16T18-33-21-276Z/ejecucion.json) conserva comando, código y versiones; su [resultado Splunk](../output/playwright/splunk-r01-r03/2026-10-16T18-33-21-276Z/splunk/resultados.json) registra `blocked_browser_launch`, arrays vacíos y el error real. La suite se detiene antes de las pruebas dependientes SC-200. No interpretar `errors:[]` con cero escenarios como ausencia demostrada de regresiones.

Entorno observado: Node v22.22.2, Linux x64 `7.0.7+parrot7-amd64`, Chromium 148.0.7778.178 Debian 13; React 19.2.4, TypeScript 5.9.3, Vite 7.3.2, playwright-core 1.62.0. Axe local ya disponible: 4.10.3. No se instalaron herramientas ni se conectaron servicios externos.

### Capturas y accesibilidad

**PENDIENTE: no hay capturas V1.1 reales.** No se fabricaron ni se usaron las capturas R01 como si mostraran tres regiones. El runner prepara atlas y mapas SP-R01/SP-R02/SP-R03 a 320, 390, 768 y 1440 px, además del selector; se guardarán dentro de la corrida `output/playwright/splunk-r01-r03/<fecha>/splunk/`.

La suite prepara 44 vistas responsive (atlas, tres mapas, lectores de ingesta/SPL, formativa, solucionario, dos laboratorios y SC-200) y cuatro exámenes con axe. Guarda `incomplete` con nodos, también en los exámenes. Se debe inspeccionar manualmente contraste, nombres/roles, teclado, foco, zoom y lector de pantalla. Cero violaciones automáticas, si se obtiene, no equivale a conformidad WCAG completa. Los incomplete históricos del piloto siguen abiertos hasta revisión dirigida; no se declaran resueltos por el código nuevo.

### Rendimiento de artefactos, no benchmark

| Medida | Piloto R01 documentado | V1.1 compilado |
| --- | ---: | ---: |
| JS/CSS inicial sin comprimir | 487.272 bytes | 487.271 bytes |
| Gzip inicial calculado localmente | 145.508 bytes | 145.513 bytes |
| Chunk Splunk JS diferido | 38.533 bytes | 54.644 bytes |
| CSS Splunk diferido | 11.838 bytes | 14.640 bytes |

El aumento queda en el chunk diferido y metadatos de las regiones; las 18 fuentes completas están en payloads independientes, no en el JS inicial. No hay IDs de lección R04–R11 en los chunks. La comparación inicial es de artefactos locales (−1 byte bruto / +5 gzip), no una mejora de rendimiento percibido. El catálogo SC-200 sigue eager como antes; no se reestructuró por esta fase.

LCP/INP/TTI, tiempos interactivos, tareas largas y FPS V1.1 siguen sin medir. La muestra de red que prepare el runner sobre Vite será desarrollo, no benchmark de producción.

## 7. Ejecución y continuación desde Parrot OS

No usar el origen/perfil personal para pruebas sintéticas. Los runners crean contextos temporales propios, nunca conectan al navegador personal y no borran LocalStorage. No detener ni reutilizar un servidor ajeno al proyecto. El servidor de pruebas debe ejecutar este árbol actualizado.

Desde la raíz del proyecto, comprobaciones offline sin pre-hooks SC-200:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run check:splunk:v11
npm run validate:splunk:v11
```

En una terminal, para el origen aislado de pruebas:

```sh
npm run dev:pilot -- --port 5187 --strictPort
```

En otra terminal:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run test:splunk:v11:browser -- --base-url http://127.0.0.1:5187/
```

También `npm run test:splunk:browser -- --base-url http://127.0.0.1:5187/` es ahora un alias seguro a esta validación ampliada, no al informe histórico R01.

El orquestador conserva cada código real y stdout/stderr, versión de Chromium y hashes; primero Splunk V1.1 y después:

1. Regresión educativa completa SC-200 (`tests/e2e.mjs` por defecto): 76 lecturas y 272 actividades en su contrato vigente.
2. Compatibilidad V2.5 con perfiles V2.4, revisiones, XP, exportación y formatos de actividad.
3. Axe SC-200 con `--all-regions` y copia local de axe, sin descargas.

Si falla una suite se detiene la aceptación de las dependientes. No declarar «todo PASS» porque la última orden aislada tenga código 0. Inspeccionar `output/playwright/splunk-r01-r03/ultima-ejecucion.json`, abrir el `ejecucion.json` que indica y los informes/capturas de sus subdirectorios. Los informes SC-200 históricos pueden incluir campos literales como `productionBuild:true`: con Vite 5187 la corrida es desarrollo; manda el origen/comando archivado, no ese literal heredado.

El runner preparado comprueba los 18 lectores y sus MCQ, 1/2 frente a 2/2, máximo 840 XP, bonus únicos, recarga/exportación, R01 previo con historial adicional, bloqueo entre regiones y durante evaluación, cargas bajo demanda, selector sin XP, SC-200 vacío/parcial/legacy/V2.4/V2.5/corrupto, cuota, payload ausente/alterado y dos pestañas. Estas son **pruebas preparadas, no aprobadas en este entorno**.

No ejecutar directamente `scripts/splunk-report.mjs` ni `tests/splunk-browser.mjs`: son herramientas históricas R01 y ahora rechazan el lote ampliado. No usar `prepare:content` para importar Splunk, ni borrar claves para «arreglar» datos.

Para uso local, después de las pruebas, abrir `#/splunk/ruta` desde el origen habitual de la academia conserva sus almacenes por origen. Cambiar puerto/protocolo/perfil no migra progreso; no copiar automáticamente datos de prueba al perfil personal.

## 8. Problemas pendientes y ampliación futura

No se ha detectado una regresión crítica **en las comprobaciones ejecutadas**. La equivalencia visual/funcional en navegador de este build aún no está demostrada. Permanecen:

- Ejecución Parrot y revisión real de capturas; corregir cualquier regresión antes de aceptar el lote.
- Revisión de `axe incomplete`, contraste y accesibilidad manual; otros navegadores y dispositivo físico.
- Revisión humana de las 18 fichas (incluidas las cinco R01), rúbricas/distractores y soporte semántico de citas.
- Validación real de SPL, timestamps, campos, ingestión, RBAC/licencias y rendimiento: fuera de esta autorización. Los ejercicios son lectura/diseño/offline.
- Posibles carreras concurrentes de almacenamiento más allá de las interacciones secuenciales preparadas; no se presenta el ledger local como transacción distribuida.
- Escritura de derivados por archivo, no lote transaccional; conservar el respaldo y verificar antes de cualquier recuperación. Un rollback de código no debe sobrescribir progreso posterior.
- Falta aprobación para R04–R11. El grafo avanzado aún requiere granularidad por IDs y revisión, especialmente las dependencias descritas como «fundamentos» o «conceptos».

Plan **no ejecutado** para R04–R05, condicionado a nueva autorización:

1. Cerrar evidencia V1.1 en Parrot y pendientes educativos/a11y relevantes; nuevo respaldo e invariantes de las 18 lecciones y sus guardados.
2. Autorizar lista exacta de 15 IDs / 45 actividades de R04–R05; expandir manifiestos/allowlist y recursos, sin publicar otras regiones ni alterar fuentes.
3. Definir requisitos por ID desde R03 y R02 según fuentes; fixtures de progreso parcial/completo R01–R03 para demostrar continuidad sin migración ni duplicar premios.
4. Añadir dos escenas mediante el registro de regiones y componentes existentes, conservando URL/IDs/revisiones y payloads previos.
5. Verificar contratos CSV/ventanas y mantener teoría experimental, formativas 0 XP y dominio práctico no evaluado; revisión humana sigue siendo una puerta independiente.
6. Repetir guardias, generación determinista, unitarias, build, perfiles aislados, navegador, responsive/axe y regresión completa SC-200. Detener ante contenido protegido modificado, pérdida de progreso o regresión crítica.

**Punto de parada: V1.1 implementada y validada offline; esperar los resultados reales de Parrot antes de cerrar aceptación. R04–R11 no integradas.**
