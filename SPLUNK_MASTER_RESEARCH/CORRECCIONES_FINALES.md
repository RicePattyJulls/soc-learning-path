# Correcciones finales de los paquetes Splunk

Fecha: 16/10/2026. Revisión editorial: `2026-10-16-r1`. Alcance autorizado: corregir material, ampliar comprobaciones offline y diseñar la futura integración. **Sin integración React ni ejecución de Splunk.**

## Resultado

Se han tratado I01–I10 y M01–M06. Los cambios editoriales y las comprobaciones offline están aplicados; la adaptación React de I05 y los riesgos C01/C02 están especificados, no implementados. La revisión humana independiente y las pruebas reales de producto siguen pendientes y no se sustituyen por el aprobado de esta auditoría.

Se conservan **80/80 IDs de lección y 240/240 IDs de actividad**, los títulos y objetivos del currículo, y los **20 CSV originales (152 filas)**. Los cinco paquetes pasan su comprobador actualizado. Pasan **48 regresiones offline**, las **42 pruebas unitarias SC-200**, TypeScript y empaquetado Vite en memoria.

El currículo canónico, SC-200, documentos históricos de investigación, auditoría original, React, generador actual y derivados SC-200 permanecen intactos: **203 archivos protegidos sin cambios**. Se modificaron 126 archivos originales, todos dentro de los paquetes autorizados salvo la actualización de estado de README_PRIMERO.md. Se añadieron contratos y herramientas de validación únicamente bajo la investigación Splunk, además de esta entrega y su especificación.

## Respaldo anterior a las modificaciones

- Archivo: [paquetes_antes.tar.gz](RESPALDOS/editorial_2026-10-16/paquetes_antes.tar.gz).
- SHA-256: `7566bf9ae23526e25d0167efb17c85fb0ca92b0a3bf6ca453d5b0b3d8c054066`.
- Contiene los cinco paquetes, la portada y la auditoría: **180 archivos originales**, verificados individualmente contra el inventario previo, sin extraer ni restaurar.
- Inventario de hashes e IDs previos: [INVENTARIO_ANTES.json](RESPALDOS/editorial_2026-10-16/INVENTARIO_ANTES.json).

El respaldo se creó y verificó antes de editar los paquetes. No incluye perfiles del navegador ni progreso personal; no se ha leído ese almacenamiento. Una eventual restauración debe seleccionar archivos y conservar avances recientes, sin extraer indiscriminadamente sobre la aplicación.

## Decisiones educativas aplicadas

Los cinco bancos y rúbricas declaran la misma política: teoría autocorregible con umbral **80 %**, abiertas **formativas y no autocorregibles**, y aprobado teórico **sin dominio práctico automático**. Las 80 prácticas conservan respuesta orientativa y criterios de feedback, pero no una nota automática, requisito de aprobación práctica o premio por supuesta competencia.

Los bancos siguen siendo editoriales; `auto_gradable:true` identifica el tipo de pregunta teórica, no una evaluación habilitada en la aplicación. Todas las actividades mantienen `human_review_status:pending_independent_review`, `splunk_executed:false` y `practical_mastery_eligible:false`. Las fases de aplicación aún no están asignadas. No se han creado claves LocalStorage ni concedido XP.

## Matriz de correcciones y evidencia

En la tabla, P1…P5 designan los directorios `SPLUNK_LECCIONES_R01_R03`, `SPLUNK_LECCIONES_R04_R05`, `SPLUNK_LECCIONES_R06_R07`, `SPLUNK_LECCIONES_R08_R09` y `SPLUNK_LECCIONES_R10_R11`. T corresponde a `VALIDACION/test_regresiones.py`; C a `VALIDACION/comprobar_corpus.py`. Son comprobaciones de archivos/cálculos locales, no ensayos del motor SPL.

| Hallazgo | Corrección aplicada y archivos principales | Pruebas ejecutadas | Pendiente / alcance del cierre |
| --- | --- | --- | --- |
| I01 · REST v2 | P5/R11_AUTOMATIZACION_SOAR/SP-R11-L02.md y P01: creación/estado sin prefijo v2; resultados con endpoint v2 específico. Banco/solucionario sincronizados. | C valida las rutas documentales; T rechaza en memoria la reintroducción del POST v2 incorrecto. | Corregido documentalmente. API y soporte de instalación/Cloud no ejecutados. |
| I02 · Tráfico omitido | P4/R08_THREAT_HUNTING/SP-R08-L06.md, banco y solucionario: backup=865 MB; finance=210 MB, separados en 190 desconocidos y 20 aprobados. CSV intacto. | Totales por src/dest; T incluye el flujo adicional y rechaza una respuesta restaurada a 850 MB. | Corregido y contrastado con CSV. No demuestra exfiltración ni telemetría real. |
| I03 · NAT como TN | P3/R07_DETECTION_ENGINEERING/SP-R07-L04.md, P01 y LAB07_A_REGLA_SPRAYING.md: no coincidencia distinta de benignidad. NAT y candidata no confirmada se excluyen de TP/FN/TN de ataque cuando falta verdad. | T prueba ambas salidas con etiquetas inconclusas; C contrasta el texto y etiquetas reales. | No se fabrican tasas de precisión/recall; siguen no determinables para las cohortes sin verdad de ataque. |
| I04 · MCQ predecibles | Los cinco bancos, 80 lecciones y cinco solucionarios: 160 MCQ revisadas, 474 alternativas incorrectas distintas de las originales; se conservaron seis alternativas pertinentes. Se precisaron 50 respuestas correctas. Opciones con IDs estables y posición equilibrada. | C comprueba cuotas por región, sincronización y claves. T controla heurísticas de posición y longitud y detecta opciones/claves desincronizadas. | Revisión editorial del agente; revisión pedagógica independiente y prueba con alumnos pendientes. |
| I05 · Contrato educativo | Bancos 1.1: option_ids/solution_option_id, ámbito de fuentes, revisión, estado humano y política explícita. Se reescribieron cinco rúbricas; abiertas formativas. Adaptación de fases/citas/modelo definida en PLAN_INTEGRACION.md. | C valida políticas y opciones por ID; T rechaza abiertas autocorregibles y prueba umbral exacto; 240 IDs originales comprobados. | Política y diseño resueltos. Adaptador, citas locales y UI pendientes del piloto por restricción expresa de no implementar. No hay compatibilidad React ejecutada. |
| I06 · Mapeo CSV/SPL | DATASETS.json en los cinco paquetes, con todos los archivos/columnas/mapeos y semántica UTC. normalize_fixture modela campos en memoria. P4/R09-L07 usa columnas TI originales y vigencia explícita; no inventa confidence. | C verifica los 20 contratos y cada fila. T prueba TGS, TI, fecha inválida/futura/expirada, alias y separación de fixture_index_epoch frente a _indextime. | Diseño/aritmética verificados offline; importación, extracciones, lookup y parser SPL reales pendientes. |
| I07 · Verificadores débiles | Cinco comprobadores usan C con currículo canónico, correspondencia completa, contratos y hashes exhaustivos. Se corrigen buckets por fecha/hora y acumulados por entidad; API y ledger derivan decisiones de entradas. | 48 tests: horas/días/bordes, nulos, duplicados, mutaciones negativas, permisos sintéticos, replay y unknown. Cinco verificadores de fixtures ejecutados desde los comprobadores. | No emulan Splunk/SOAR, ni prueban idempotencia transaccional o RBAC real. |
| I08 · Fuentes amplias | P1/R01-L01 referencia ES_MC y SOAR; dc recibe referencia DC; lookup recibe LOOKUP. source_namespace impide tratar todos los D01 como una única fuente. Registro oficial puntual en VALIDACION/FUENTES_REVISADAS.json. | C verifica existencia y ámbito de referencias; páginas oficiales consultadas para las dudas concretas. | Revisión afirmación por afirmación de toda la bibliografía y revisión humana independientes pendientes; no se fingió un rastreo exhaustivo. |
| I09 · Caso final | P5/R11-L05/L07 y LAB11_C_PROYECTO_FINAL.md reutilizan exactamente datos R06: candidata .23, mantenimiento .15, proxy inconcluso .44. EventCode=4625 y umbral 5/5. | C valida consulta documental y snapshots R06; se comprueban rutas cruzadas a los dos CSV originales. | No se une una intención SOAR con una observación de autenticación por compartir IP. No hay acciones ejecutadas. |
| I10 · Ventanas y snapshots | P4/R08-L04/P01 y LAB08-C separan global 5/1 de buckets 4/1 y 1/1. P3/R06-L01/P01 fija corte anterior a 09:16, frente al retrospectivo. P2/R04-L01/L02 acota el primer bucket de sus siete fallos. | T prueba 11:15 exclusivo, 6/6→7/6, corte exacto, UTC/offset y acumulados por entidad; verificadores locales de P2/P3/P4 pasan. | Los literales SPL requieren contexto UTC documentado; no se recrea _indextime histórico mediante una importación actual. |
| M01 · dc/estdc | P1/R03_SPL_BASICO/SP-R03-L05.md y fuentes: dc cuenta distintos; estdc estima. | Contraste oficial y comprobación de contenido/referencias/hash. | No implica equivalencia numérica con dcount de KQL ni prueba en motor. |
| M02 · Siete más vacío | P2/R04_SPL_AVANZADO/SP-R04-L04.md: siete totales, seis con identidad, uno vacío, cinco identidades distintas. | Verificador P2 cuenta total/cardinalidad/vacío; banco/solucionario coinciden. | Corregido con datos existentes, sin añadir una fila. |
| M03 · Rutas internas | P3/VALIDACION/FUENTES_Y_LIMITES.md usa dos niveles de subida para los tres documentos del corpus. | C resuelve las referencias relativas ascendentes de los paquetes. | No se alteraron los documentos históricos destino. |
| M04 · Nota «473?» | Respuesta P3/SP-R07-L03-P01 reemplazada por verificación de versión/parche/auditoría/esquema, sin inventar un nuevo Event ID. Lección/banco/solucionario sincronizados. | C compara literalmente las tres representaciones y sus hashes. | Campos nativos y versión del DC requieren revisión de entorno autorizado. |
| M05 · Portada/IDs históricos | README_PRIMERO.md distingue inventario actual de portada histórica y fija SP-Rxx como convención canónica. | Preservación comprueba currículo y documentos de 02_INVESTIGACION intactos; C verifica 80 IDs. | No se reescribió la investigación ni se migraron IDs antiguos propuestos. |
| M06 · grading_policy | Cinco bancos normalizados a graded_policy y assessment_policy estructurada. | C rechaza el campo alternativo antiguo o una política incompatible. | La futura aplicación necesita adaptador; no leer estos bancos con un cast. |
| C01 · Generación | PLAN_INTEGRACION.md: catálogo por manifiesto/ID, preparador separado y public/splunk-content fuera del destino que borra SC-200. | Revisión del diseño contra el preparador actual; hashes del código actual intactos. | Resuelto como diseño; aislamiento efectivo se debe probar al implementar el piloto. |
| C02 · Progreso/XP | PLAN_INTEGRACION.md: clave, esquema, historial, última posición, premios, nivel y grafo Splunk independientes; hooks montados por ruta. | Revisión del diseño contra persistencia/estadísticas actuales; 203 archivos protegidos sin cambios y 42 tests SC-200 pasan. | Resuelto como diseño; cero escrituras cruzadas debe demostrarse en navegador en el piloto. |

## Calidad de las preguntas

Distribución anterior: A=19, B=113, C=28, D=0. Distribución corregida: **40/40/40/40**. En cada región las cuotas por posición difieren como máximo en una pregunta y las dos MCQ de una lección no comparten posición correcta por construcción.

Se retiraron distractores como colores, logos, emojis o productos sin relación con el concepto. Se usan confusiones concretas: ventana de evento frente a indexación; agregado frente a evento; alias frente a semántica; correlación frente a causalidad; campos del CSV frente al producto; creación de job frente a permiso de resultados. Las respuestas correctas también se precisaron cuando quedaban excesivamente breves.

La revisión detectó además una nueva pista por longitud: no bastaba con cambiar letras. Tras precisarla, la regla «elige la opción más corta» acierta **74/160** y «elige la más larga» **58/160**, con desempate por primera posición. Ninguna de las dos supera el 50 % en una región. Son controles contra atajos conocidos, no una garantía de ausencia de sesgos o de calidad psicométrica. No se ha medido aprendizaje humano.

Los IDs de opción son nuevos metadatos, derivados del ID de actividad y texto. Se conservaron los 240 IDs que ya existían. El adaptador persistirá respuestas por esos IDs, nunca por las letras impresas. Una futura edición semántica de una opción debe cambiar revisión y conservar el historial previo, no recalificar intentos antiguos.

## Datasets, tiempo y resultados

No se modificó ninguno de los 20 CSV. Se resolvieron las discrepancias corrigiendo explicaciones, contratos y lógica offline. Cada archivo conserva su escenario; la presencia de la misma IP en dos paquetes no constituye un enlace de evidencia.

- R04: siete fallos del primer bucket incluyen el vacío; al ampliar a todo el archivo, .9 tiene nueve fallos y seis identidades no vacías. Las consultas que ilustran los siete ahora acotan la primera ventana en UTC.
- R06: rango de evento [09:00,09:15) UTC; corte de disponibilidad anterior a 09:16 da 6/6. A021 llega a 09:24 y la vista retrospectiva da 7/6. Un campo sintético modela disponibilidad; no se altera el metadato real _indextime.
- R08: cinco fallos globales de paula son 4/1 a 11:00 y 1/1 a 11:15. Backup envía 865 MB; finance envía 210 MB, de los que 190 van al destino desconocido.
- TI: inicio inclusivo y expiración exclusiva a medianoche UTC, referencia fija 2026-10-16T12:00:00Z. I01/I03 vigentes; N01/N04→I03, N02→I01, N03 sin match. confidence_note sigue siendo una nota sintética.
- R11: se usa auth_activity.csv de R06, no el homónimo de R08. Mantenimiento .15 no es proxy y no supera cinco cuentas. El candidato .23 no se convierte en ataque confirmado; el proxy .44 no se convierte en benigno.

El resto de cálculos previos (19/12/7 de summaries, cohortes Kerberos, ocho operaciones de replicación, scores sintéticos 75/36/22/20/15, retención y métricas ficticias de búsquedas) sigue pasando los verificadores locales. Ninguno se declara resultado real de Splunk.

## Resultados ejecutados

Evidencia legible por máquina: [RESULTADOS_OFFLINE.json](RESULTADOS_OFFLINE.json). Contiene los resultados del corpus, códigos de salida de los cinco CLI, resúmenes de tests y límites de ejecución.

| Paquete | Lecciones | Actividades MCQ / abiertas | CSV / filas | Entradas SHA256SUMS | Resultado |
| --- | ---: | ---: | ---: | ---: | --- |
| R01–R03 | 18 | 36 / 18 | 1 / 10 | 34 | PASS offline |
| R04–R05 | 15 | 30 / 15 | 4 / 23 | 34 | PASS offline |
| R06–R07 | 16 | 32 / 16 | 3 / 40 | 34 | PASS offline |
| R08–R09 | 16 | 32 / 16 | 6 / 51 | 38 | PASS offline |
| R10–R11 | 15 | 30 / 15 | 6 / 28 | 38 | PASS offline |
| **Total** | **80** | **160 / 80** | **20 / 152** | **178** | **5/5 paquetes y 5/5 fixtures** |

Los manifiestos incluyen todos los archivos de cada paquete salvo su propia referencia circular, y SHA256SUMS incluye además el manifiesto. Se verifican también hashes de las herramientas editoriales compartidas. Las listas anteriores tenían 172 entradas; las actuales añaden cinco contratos DATASETS.json y cubren el comprobador R06 que antes no figuraba en su lista. Los hashes certifican integridad, no verdad técnica.

| Prueba | Ejecución y resultado |
| --- | --- |
| Corpus canónico y sincronización | `python3 -B VALIDACION/comprobar_corpus.py --json`: PASS; 80 IDs, 240 IDs únicos; títulos/objetivos exactos; bancos/Markdown/solucionarios coherentes. |
| Regresiones nuevas | `python3 -B VALIDACION/test_regresiones.py`: **48/48 PASS**. Incluye contraejemplos en memoria que deben ser rechazados, sin escribir fixtures de ataque ni arrancar servicios. |
| CLI de cada paquete | Los cinco `VALIDACION/comprobar_paquete.py` se ejecutaron individualmente: código 0. Cada uno ejecuta su verificador local de fixtures. |
| No regresión SC-200 | `npm --ignore-scripts test`: **42/42 PASS**. No ejecuta pretest ni regenera contenido. |
| TypeScript | `node_modules/.bin/tsc --noEmit --incremental false`: PASS, sin emitir archivos. |
| Empaquetado | Vite programático, base ./ y Tailwind, `configFile:false`, `write:false`, `emptyOutDir:false`: PASS, siete salidas en memoria, 1.005.076 bytes sin comprimir. Igual cifra que la referencia de auditoría. No es benchmark de navegación. |
| npm run build convencional | No ejecutado por su prebuild regenerador y escrituras de salida; sustituido por tipos y empaquetado en memoria. |
| Navegador / axe / piloto | No ejecutados ni implementados en esta fase. Están especificados para una fase autorizada posterior. |
| Splunk / REST / ES / SOAR / HEC | No ejecutados. Tampoco contenedores, ataques, commits o publicación. |

Los scripts Python se ejecutaron con `PYTHONDONTWRITEBYTECODE=1` y `-B`. La validación de política API o ledger es una función local sobre intenciones/estados sintéticos: no acredita permisos reales, transacciones o idempotencia distribuida de SOAR.

## Reproducción y mantenimiento

Desde la raíz del proyecto, estas comprobaciones solo leen:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B SPLUNK_MASTER_RESEARCH/VALIDACION/comprobar_corpus.py --json
PYTHONDONTWRITEBYTECODE=1 python3 -B SPLUNK_MASTER_RESEARCH/VALIDACION/test_regresiones.py
```

También se puede ejecutar `SPLUNK_MASTER_RESEARCH/<paquete>/VALIDACION/comprobar_paquete.py`. Mantener juntos los paquetes, el currículo y VALIDACION compartida; no se promete que un paquete extraído aisladamente incluya el corpus que valida.

Los cambios semánticos se hacen en fuentes y ajustes revisables. `VALIDACION/ajustes_editoriales.json`, `distractores_revisados.tsv` y `respuestas_revisadas.tsv` conservan las decisiones de esta revisión. `sincronizar_editorial.py` aplica mecánicamente bancos/actividades/soluciones/rúbricas; su idempotencia se prueba. `regenerar_metadatos.py` actualiza contratos/manifiestos/hashes. Ambos requieren `--apply` y el respaldo local; **escriben material editorial, no aplicación**. No confundirlos con verificadores de lectura o con el generador actual SC-200.

## Referencias oficiales revisadas de forma puntual

Registro con fecha y alcance: [FUENTES_REVISADAS.json](VALIDACION/FUENTES_REVISADAS.json).

- [Search REST 10.2](https://help.splunk.com/en/splunk-enterprise/rest-api-reference/10.2/search-endpoints/search-endpoint-descriptions): selección de endpoints concretos, sin migración global de prefijos.
- [Mission Control ES 8.7](https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/mission-control/overview-of-mission-control-in-splunk-enterprise-security): referencia específica de producto para R01-L01.
- [Funciones agregadas SPL 10.2](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.2/statistical-and-charting-functions/aggregate-functions): distinción dc/estdc.
- [Lookup SPL 10.2](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.2/search-commands/lookup): campos de entrada/salida y alias explícitos.
- [Playbooks SOAR Cloud](https://help.splunk.com/en/splunk-soar/soar-cloud/build-playbooks/introduction-to-splunk-soar-playbooks/use-playbooks-to-automate-analyst-workflows-in-splunk-soar-cloud): contexto de producto separado.

No se repitió la investigación general ni se validó masivamente toda la bibliografía. Estas consultas documentales no inspeccionaron instalación, licencia, configuración o datos del usuario.

## Asuntos humanos y prácticos pendientes

| ID | Cuestión y razón | Consecuencia |
| --- | --- | --- |
| H01 | Revisión técnica/pedagógica independiente de las preguntas, distractores, explicaciones y rúbricas. La revisión del agente y tests de coherencia no la sustituyen. | Antes de habilitar una evaluación del piloto, revisar sus 3–5 lecciones. El resto mantiene su etiqueta pendiente. |
| H02 | Citas locales exactas y asignación de fases del adaptador aún sin implementar; propuestas de XP requieren aprobación del piloto. | I05/C01/C02 no se declaran implementados. La especificación define contratos y pruebas para hacerlo después. |
| H03 | La investigación usa «fundamentos R05» y «R09 conceptual» sin lista definitiva de IDs previos. | El grafo completo de desbloqueos necesita una tabla revisada. El piloto inicial R01 evita inventarla. |
| H04 | No hay inventario permitido de producto/versión/CIM/TA/roles ni búsquedas ejecutadas. Los ejemplos exigen UTC y mapeos explícitos. | Sintaxis, extracciones, metadatos reales, permisos, rendimiento y resultados en producto siguen sin validar. |
| H05 | suspicious_unconfirmed e inconclusive no aportan verdad de ataque. | No calcular TP/FN o recall de ataque para esas cohortes ni atribuir benignidad al NAT. No se fabricó una etiqueta para cerrar el asunto. |
| H06 | El CSV de movimiento lateral tiene un único éxito/host; otros ejercicios avanzados son diseños, no cobertura experimental de todas sus competencias. | Sigue pendiente decidir si hacen falta fixtures adicionales y revisión de dificultad; no se añadieron eventos presentados como observados. |
| H07 | Aprobación real, efecto unknown, compensación y consistencia distribuida requieren entorno y evidencia operacional. | El ledger offline solo verifica una política didáctica; no autoriza acciones SOAR ni demuestra prevención de duplicados reales. |

Ante varios indicadores vigentes para el mismo observable, el modelo offline se detiene en lugar de elegir una fuente silenciosamente. Una política de agregación futura requiere criterio explícito; los tres indicadores actuales no presentan ese conflicto.

## Estado de entrega y siguiente autorización

[PLAN_INTEGRACION.md](PLAN_INTEGRACION.md) resuelve C01/C02 a nivel de diseño: importación por manifiesto/ID, catálogo y salidas independientes, almacenamiento/XP/niveles/desbloqueos separados, carga diferida, selector y preservación de SC-200. No se ha implementado ninguno de esos cambios en la aplicación.

SHA-256 del currículo conservado: `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933`. SC-200 mantiene sourceHash `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`, confirmado por las pruebas existentes. No se ha alterado el progreso personal ni utilizado perfiles de navegador.

**Corrección editorial y preparación entregadas. Esperar autorización del usuario antes de implementar el piloto React de 3–5 lecciones.**
