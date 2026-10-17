# SOC Learning Path — Splunk Master Research
## Fase 3 · Bloque final: SPL avanzado, CIM, SOC, detecciones, Threat Hunting, ES, administración y SOAR (R04–R11)

**Fecha de investigación:** 16 de octubre de 2026.  
**Fuente primaria del conocimiento previo:** `SC-200.md` adjuntado (2.810 líneas físicas en la copia montada).  
**Fuentes externas:** Splunk Help / Splunk Security Content, listadas con referencias [S##] al final.  
**Ámbito:** diseño curricular DOCUMENTAL; ni Splunk ni la app SOC Learning Path han sido ejecutados, alterados o inspeccionados desde esta sesión.  
**Interpretación de "completado":** se cierra el **mapa de investigación curricular** para 11 regiones. NO significa que las lecciones estén implementadas, que SPL se haya ejecutado o que existan resultados medidos de laboratorio.

### Convenciones de calidad

- `[SC]` dato o estructura derivada de los apuntes del usuario. No constituye validación externa vigente de Microsoft.
- `[DOC:S##]` sustentado por documentación oficial enlazada en las fuentes.
- `[DISEÑO]` propuesta pedagógica, rúbrica, ejercicio o decisión nueva. No ha sido probada experimentalmente.
- `[PENDIENTE]` depende del estado real de un Splunk, índice, add-on, producto o fuente no disponible.
- `P0` esencial para SOC N1/N2, `P1` especialización SOC, `P2` administración/ingeniería avanzada.
- Los identificadores `SP-R##-L##` son **estables propuestos**; su compatibilidad con las rutas actuales de React y LocalStorage debe comprobarse antes de integrarlos.

## I. Dictamen arquitectónico previo a las regiones

**No existe paridad producto-por-producto con Microsoft SC-200.** El curso Microsoft combina SIEM con XDR, EDR, correo, identidad, postura, prevención y Purview; Splunk Enterprise concentra colección/búsqueda/alerting, Splunk Enterprise Security proporciona funciones SecOps adicionales y Splunk SOAR automatiza mediante conectores y playbooks. Que un evento MDE se busque en Splunk no significa que Splunk implemente el motor preventivo de MDE. [SC cap. 1/3/4/7/8/11/12] [DOC:S08,S11,S22]

**Regla de práctica:** usar SPL clásico y fuentes verificadas antes de introducir SPL2. Los índices, sourcetypes y campos (`user`, `src`, `Account_Name`, `EventCode`, `EventID`) deben descubrirse: no los declares existentes en la instancia por su mera aparición en documentación. La organización pedagógica no reescribe el esquema de Microsoft.

**Regla de seguridad:** los laboratorios son de lectura hasta aprobación expresa; un usuario con permisos para buscar también podría tener comandos mutantes o de ejecución externa en su rol. Existen comandos que Splunk Cloud clasifica como riesgosos, por ejemplo `collect`, `delete`, `map`, `outputlookup` o `script`; una política segura exige roles/capabilities y consultas controladas, no solo una advertencia verbal. [DOC:S19,S20,S25]

## II. Currículo detallado — ocho regiones restantes

Para no inflar artificiosamente el curso, se define **una competencia observable y una evidencia evaluable por lección**. El conjunto R01–R03 anterior conserva sus 18 lecciones; aquí se añaden lecciones de R04–R11. Las duraciones todavía no están medidas; una estimación por lección sería un supuesto, no un resultado de la investigación.

### SP-R04 — Laboratorio SPL II

**Prioridad:** P0. **Prerrequisitos:** R03. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 8.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R04-L01` | Agregaciones con stats frente a eventstats | Elegir la agregación adecuada preservando o no eventos originales | Construir tabla de conteos y comprobar que eventstats retiene filas | Cap. 13,9 |
| `SP-R04-L02` | Secuencias con streamstats | Calcular acumulados y secuencias controlando orden temporal | Detectar diferencia entre agregación global y running count | Cap. 13,10 |
| `SP-R04-L03` | Ventanas, timechart y bin | Comparar ventanas discretas y series temporales | Reproducir agrupación de fallos en 15 minutos | Cap. 13,7 |
| `SP-R04-L04` | Identidades únicas, valores y nulos | Comprender dc, values, list, coalesce y datos incompletos | Mostrar efecto de identidades vacías y cardinalidad | Cap. 13,9 |
| `SP-R04-L05` | Correlación sin join innecesario | Contrastar stats, eventstats, lookup, join y transaction | Elegir estrategia por cardinalidad y relaciones disponibles | Cap. 8,9,13 |
| `SP-R04-L06` | Subbúsquedas, límites y búsqueda eficiente | Reconocer límites, evitar searches explosivas, Job Inspector | Detectar riesgo de subsearch y reescribir una consulta | Cap. 13,5 |
| `SP-R04-L07` | Expresiones, multivalor y patrones | Usar rex, mvexpand, eval con supuestos explícitos | Extraer y comprobar valores de ejemplo | Cap. 13 |
| `SP-R04-L08` | Proyecto: investigación cruzada SPL | Crear una línea de tiempo y separar hipótesis de evidencia | Entregar consultas, cronología, limitaciones | Cap. 8,9,13 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R05 — Valle de Normalización

**Prioridad:** P0/P1. **Prerrequisitos:** R02,R04. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 7.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R05-L01` | De campo crudo a conocimiento | Distinguir extracción, field alias, calculated field, tags y eventtypes | Normalizar dos campos equivalentes sin modificar origen | Cap. 4,13 |
| `SP-R05-L02` | Lookups y enriquecimiento | Diseñar lookups para inventario o amenazas sin confundir enriquecimiento con evidencia | Resolver campos IP/activo con lookup de fixture | Cap. 6,9 |
| `SP-R05-L03` | CIM: vocabulario común | Aplicar conceptos src, dest, user, action, signature y dataset | Identificar qué datos encajan en Authentication y cuáles no | Cap. 4,13 |
| `SP-R05-L04` | Data models y datasets | Entender jerarquías, constraints y requisitos de tags | Dibujar un data model conceptual con campos | Cap. 4,13 |
| `SP-R05-L05` | Validación de CIM | Comprobar cobertura de fuentes, nulos, tipos y mapeos incorrectos | Auditar fixture con campos deliberadamente erróneos | Cap. 4,7 |
| `SP-R05-L06` | tstats y aceleración | Diferenciar estadísticas sobre índice y summaries de data models | Explicar efecto de summariesonly y pérdida de cobertura | Cap. 5,13 |
| `SP-R05-L07` | Rendimiento del modelado | Evaluar coste de aceleración, constraints e índices allowlist | Justificar presupuesto de datos y recursos | Cap. 4,5 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R06 — Centro SOC

**Prioridad:** P0. **Prerrequisitos:** R03,R04,R05-basico. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 8.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R06-L01` | Triage: del aviso a la pregunta | Identificar origen de alerta, regla, ventana y entidad | Clasificar alerta con supuestos explícitos | Cap. 7,8,9 |
| `SP-R06-L02` | Primer pivote por identidad | Relacionar user, src, host, dest sin aceptar equivalencias falsas | Buscar actividad antes y después de evento de inicio | Cap. 9,13 |
| `SP-R06-L03` | Windows y autenticación | Analizar 4625,4624,4769,4662 con condiciones de auditoría | Distinguir telemetría presente y ausente | Cap. 4,9,13 |
| `SP-R06-L04` | Cronología reproducible | Reconciliar _time, _indextime, zonas horarias y evidencias | Documentar secuencia con incertidumbres temporales | Cap. 8,9 |
| `SP-R06-L05` | Triage de falsos positivos | Evaluar baseline, NAT, servicios, tareas y activos autorizados | Construir hipótesis benigna alternativa | Cap. 7,8,9 |
| `SP-R06-L06` | Informe SOC N1 | Escribir hechos, hipótesis, severidad, MITRE y escalado | Producir informe con referencias a entradas | Cap. 9,11 |
| `SP-R06-L07` | Decidir cuándo escalar | Definir condiciones de evidencia suficiente y de inconcluso | Elegir siguiente paso defendible | Cap. 8,9,11 |
| `SP-R06-L08` | Caso completo de SOC | Investigar caso de múltiples señales con revisión humana | Evaluación ciega frente a verdad de fixture | Cap. 7,8,9,13 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R07 — Fábrica de Detecciones

**Prioridad:** P0/P1. **Prerrequisitos:** R04,R05,R06. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 8.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R07-L01` | De hipótesis a detección | Traducir comportamiento a fuentes, filtros, exclusiones y umbral | Documento de requisitos para detección | Cap. 7,10 |
| `SP-R07-L02` | Saved searches y alertas básicas | Distinguir programación, tiempo de búsqueda, trigger, throttling | Diseñar alerta sin habilitarla en laboratorio | Cap. 7,12 |
| `SP-R07-L03` | Cobertura MITRE y amenazas | Identificar táctica y técnica con precisión, sin sobreclasificar | Mapear regla a evidencia requerida | Cap. 6,7 |
| `SP-R07-L04` | Evaluación positiva, negativa e inconclusa | Definir fixtures y tasas de ruido con casos controlados | Matriz de pruebas reproducibles | Cap. 7,8 |
| `SP-R07-L05` | Tuning y calidad operativa | Investigar umbrales, excepciones, ventanas, data delay | Documentar riesgo de subdetección y alert fatigue | Cap. 7,9 |
| `SP-R07-L06` | Detecciones multi-etapa y riesgo | Correlacionar señales y distinguir RBA de ES vs heurística propia | Justificar score sin atribuirlo a ES si no está | Cap. 7,8 |
| `SP-R07-L07` | Mantenimiento de detecciones | Versionado, cambios de campos, drift de ingestión | Plan de regresión y actualización | Cap. 4,7 |
| `SP-R07-L08` | Laboratorio de revisión por pares | Auditar detección de servicio Kerberos bajo supuestos de schema | Encontrar FP, FN y telemetría ausente | Cap. 7,9,10 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R08 — Cordillera Threat Hunting

**Prioridad:** P1. **Prerrequisitos:** R06,R07. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 8.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R08-L01` | Hipótesis, alcance y ética | Plantear hunting sin depender de alerta y acotar datos | Formular pregunta falsable | Cap. 10 |
| `SP-R08-L02` | Kerberos y señales 4769 | Interpretar TGS RC4 y contexto normal/anómalo | Diferenciar petición RC4 de compromiso probado | Cap. 9,10,13 |
| `SP-R08-L03` | DCSync: replicación y derechos | Entender señales 4662, DC autorizados y configuración de auditoría | Elegir evidencia que apoyaría replicación indebida | Cap. 9,10 |
| `SP-R08-L04` | Acceso inicial y password spraying | Distinguir cuenta única vs múltiples identidades y éxito posterior | Buscar patrón con ventanas y distribución IP | Cap. 7,10,13 |
| `SP-R08-L05` | Movimiento lateral y persistencia | Relacionar host/identidad/tiempo y cambios de privilegios | Construir grafo de actividad temporal sin causalidad inventada | Cap. 9,10 |
| `SP-R08-L06` | Exfiltración y baseline | Buscar volumen, destinos raros y desviación de perfil | Contrastar con flujos autorizados | Cap. 9,10 |
| `SP-R08-L07` | MITRE y cobertura | Mantener hipótesis, fuentes necesarias, detección, límites | Matriz de cobertura sustentada por telemetría | Cap. 6,10 |
| `SP-R08-L08` | Hunting-to-detection | Convertir hallazgo confirmado en prueba y regla gestionable | Entregar backlog priorizado y limitaciones | Cap. 7,10 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R09 — Torre Enterprise Security

**Prioridad:** P1/P2. **Prerrequisitos:** R06,R07. **Contexto de producto:** ES. **Lecciones:** 8.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R09-L01` | Qué añade ES a Splunk Enterprise | Distinguir producto base, ES y herramientas complementarias | Clasificar capacidades y licencias | Cap. 1,8 |
| `SP-R09-L02` | Detecciones basadas en eventos | Comprender eventos→findings/intermediate findings | Dibujar flujo ES 8.7 | Cap. 7 |
| `SP-R09-L03` | Finding-based detections | Entender agregación sobre findings y grupos | Distinguir findings de eventos crudos | Cap. 7,8 |
| `SP-R09-L04` | RBA y entidades | Interpretar risk score por entidad y umbrales | Comparar con regla propia de riesgo del laboratorio | Cap. 7,8 |
| `SP-R09-L05` | Mission Control y analista | Comprender analyst queue y triage ES | Ruta de caso conceptual, no afirmar ES instalado | Cap. 8,9 |
| `SP-R09-L06` | Investigations y evidencias | Escalar, registrar, resolver y revisar hallazgos | Simular decisiones sobre fixture separada | Cap. 8,9,11 |
| `SP-R09-L07` | TI y enriquecimiento de ES | Interpretar indicadores, reputación y contexto | Diferenciar match IOC de compromiso | Cap. 6,9 |
| `SP-R09-L08` | Integración con SOAR | Distinguir disparadores y pasos con aprobación | Clasificar acciones con riesgo alto | Cap. 11,12 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R10 — Fortaleza Administradora

**Prioridad:** P2. **Prerrequisitos:** R02,R05. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 8.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R10-L01` | Configuración por archivos y precedence | Conocer apps/system local y btool sin aplicar cambios | Identificar dónde está configuración efectiva | Cap. 2,4 |
| `SP-R10-L02` | RBAC y capabilities | Aplicar índices permitidos, roles, inheritance y deny risks | Definir rol analista lectura | Cap. 2 |
| `SP-R10-L03` | Seguridad TLS y secretos | Separar certificados demo de certs de producción | Diseñar validación TLS sin desactivarla | Cap. 1,2 |
| `SP-R10-L04` | Buckets, índice y retención | Comprender hot/warm/cold/frozen, límites de espacio | Calcular escenarios de retención sin asumir defaults del lab | Cap. 5 |
| `SP-R10-L05` | Troubleshooting de licencias e ingesta | Observar cola, timestamps, duplicados y pérdidas | Checklist de fallo reproductible | Cap. 1,4,5 |
| `SP-R10-L06` | Búsquedas y rendimiento | Usar Job Inspector y explicar trabajo distribuido | Comparar dos consultas por plan y costo observado | Cap. 5,13 |
| `SP-R10-L07` | Topologías, HA y clusters | Distinguir search head cluster, indexer cluster, deploy server | Proponer arquitectura tolerante a fallos | Cap. 1,5 |
| `SP-R10-L08` | Backup, upgrades y operación | Planificar restores, checks, acceso de mantenimiento | Documento de operación con rollback | Cap. 5,11 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

### SP-R11 — Cumbre de Automatización

**Prioridad:** P2. **Prerrequisitos:** R07,R09-conceptual,R10. **Contexto de producto:** Enterprise (base); ES/SOAR only if indicated. **Lecciones:** 7.

| ID | Lección | Competencia observable | Evaluación / prueba diseñada | Puente SC-200 |
|---|---|---|---|---|
| `SP-R11-L01` | Alerta, acción y automatización | Distinguir búsqueda programada de workflow de respuesta | Clasificar acciones de lectura/escritura | Cap. 11,12 |
| `SP-R11-L02` | REST API para búsquedas | Identificar búsqueda, job SID, results y permisos | Diseñar cliente de solo lectura conceptual | Cap. 2,9,12 |
| `SP-R11-L03` | Webhooks y alert actions | Reconocer integraciones y riesgos de datos | Diseñar flujo solo de notificación | Cap. 11,12 |
| `SP-R11-L04` | Splunk SOAR y playbooks | Comprender apps, assets, acciones y dependencias | Modelar playbook teórico de enriquecimiento | Cap. 11,12 |
| `SP-R11-L05` | Controles de respuesta | Mínimos privilegios, aprobación humana, logs y rollback | Definir compuerta de aprobación para contención | Cap. 2,11,12 |
| `SP-R11-L06` | Escenarios de error | Diseñar idempotencia, retries y manejo de timeout | Prueba de errores en fixture conceptual | Cap. 12 |
| `SP-R11-L07` | Proyecto final transversal | Diseñar ingesta→detección→investigación→respuesta aprobada | Documento integral auditable sin ejecutar | Cap. 4,7,8,9,11,12 |

**Puerta de dominio (diseño):** al menos 80 % de la evaluación de conceptos **más** desempeño suficiente en el ejercicio integrador. El alumno debe documentar dependencias de esquema, errores, evidencia y límites; aprobar quizzes aislados no garantiza habilidad operativa.

## III. Nueve hallazgos técnicos que deben convertirse en lecciones explícitas

### H1 · `stats` no conserva eventos como `eventstats`; `streamstats` procesa secuencias

Al pasar de `stats` a `eventstats` se mantienen las filas del flujo y se añaden estadísticas de grupo, mientras `streamstats` permite acumulados/funciones sobre la secuencia procesada. El **orden** de entrada importa en análisis de secuencias. El alumno deberá comparar salidas sobre **una misma fixture**, nunca memorizar solo la sintaxis. `[DISEÑO]`. Contrastar comandos en la Search Reference de la versión específica antes de publicar solución.

### H2 · Los JOINs caros no deben ser reflejo automático del KQL

Splunk documenta subbúsquedas con límites por defecto (en el manual consultado de 10.0, 10.000 resultados/60s para subbúsquedas generales); `join` tiene límites propios (50.000 filas y 60s para el lado derecho, según la referencia consultada). Esto no prueba que **todos** los joins fallen al límite; sí obliga a comprender truncamiento y tiempo. Buscar alternativas como `stats`, `eventstats`, `lookup` o colecciones cuando el caso lo permita. [DOC:S02,S03]

### H3 · CIM no es un índice, un conector ni ASIM

El CIM es un modelo semántico común, implementado por un add-on que define datos/campos/tags y ayuda a normalizar. Un índice crudo no adquiere `src`, `dest`, `user`, `action` correctamente por el mero hecho de instalar CIM. Hay que comprobar add-on, field aliases, props/transforms, etiquetas y mapeos. [DOC:S04,S05]

### H4 · `tstats` lee estructuras indexadas; `summariesonly=true` NO garantiza cobertura total

Con `summariesonly=true` se restringe al resumen acelerado. Si no hay resumen para parte del intervalo, se puede perder cobertura de esa ventana. Acelerar modelos de datos implica CPU/espacio y la documentación indica que el CIM add-on los tiene deshabilitados por defecto salvo configuración/aplicaciones que lo impongan. No convertir un resultado vacío en «no hubo ataque». [DOC:S01,S06,S07]

### H5 · Las alertas base y los findings de ES son cosas diferentes

En Splunk Enterprise, una alerta parte de una saved search ejecutada según programación o en tiempo real, con trigger/alert action. Splunk Enterprise Security 8.7 añade tipos de detección, findings, intermediate findings, finding groups, cola del analista e investigaciones en Mission Control. Los umbrales y capacidades ES son **producto/versionado**, no estándar de Splunk base. [DOC:S08,S09,S11,S12,S13]

### H6 · Kerberoasting: `4769` + RC4 no equivale a intrusión confirmada

El Security Content oficial incluye una detección sobre solicitudes TGS Event ID 4769 con parámetros de RC4 y determinados TicketOptions. El laboratorio educativo debe exigir: fuente realmente activa, normalización de campos, SPN de cuenta de servicio, ventana, baseline, exclusiones y contexto; cifrado RC4 por sí solo no demuestra ataque. La detección oficial está publicada con contexto Enterprise Security; una adaptación educativa a Enterprise base debe indicarse como propuesta y probarse. [DOC:S14,S15]

### H7 · DCSync: `4662` no basta sin auditoría, permisos y exclusión de DC legítimos

Splunk Security Content incluye la detección de peticiones de replicación desde ubicaciones no autorizadas, basada en 4662 y otros datos. Para evaluar su fiabilidad hay que comprobar configuración de auditoría en AD, interpretación de Properties/GUID, controladores conocidos y cuentas con replicación legítima. Sin datos, la salida correcta es inconcluso. [DOC:S16]

### H8 · Retención en Splunk tiene ejes temporales y de espacio

Para índices locales, `indexes.conf` incluye `frozenTimePeriodInSecs` y límites de tamaño como `maxTotalDataSizeMB`; alcanzar límite de espacio antes que el temporal puede congelar/borrar datos. Por ello `frozen` no es equivalente directo al Data Lake ni al tier Archive de Sentinel. No citar una retención predeterminada como garantía del entorno real. [DOC:S18]

### H9 · TLS y automatización requieren control de riesgo real

La documentación 10.6 advierte de limitaciones de los certificados predeterminados en producción. Para proyectos empresariales deben usarse certificados propios apropiados y comprobación de identidad. Los playbooks SOAR pueden ejecutar acciones de terceros mediante apps; su capacidad de respuesta no existe en la plataforma base por defecto. Autorización humana antes de cambios con impacto. [DOC:S21,S22,S23]

---

## IV. Casos de estudio y laboratorio con rúbricas

**Estado común de TODOS los casos de esta sección:** `[DISEÑO / NO EJECUTADO]`. Las consultas SPL son **ejemplos didácticos SPL clásico**, no son búsquedas verificadas sobre el entorno del usuario; el nombre de índice, campos, tiempo y sourcetype debe ajustarse al laboratorio. Cada práctica conserva una solución de referencia conceptual y criterios auditables.

### LAB04-A — `stats` vs `eventstats` con usuarios (R04)

**Fixture sintética (contenido inventado expresamente para enseñar, no telemetría):**

| `_time` | `src` | `user` | `action` |
|---|---|---|---|
| 10:01 | A | alice | failure |
| 10:02 | A | bob | failure |
| 10:03 | A | alice | failure |
| 10:04 | B | carol | success |

**Preguntas evaluables:** con `action=failure`, `stats count, dc(user) by src` produce una fila para A (3 intentos, 2 identidades). `eventstats count by src` **añade** el total a cada evento filtrado sin colapsarlo. `streamstats count` da un acumulado sobre el orden de eventos, **no** sobre un grupo salvo que se programe así. **Rúbrica:** explica pérdida/conservación de filas, nulos y diferencia entre anomalía y ataque.

**SPL propuesto (solo si los campos existen en la fixture):**

```spl
index=<INDEX_DE_FIABLE_AUTENTICACION> action=failure earliest=-24h
| bin _time span=15m
| stats count as intentos dc(user) as cuentas by src _time
| where cuentas>=5
| sort - intentos
```

**Nota:** `<INDEX_DE_FIABLE_AUTENTICACION>` es placeholder; el evaluador debe obligar a indicar índice real o fixture sintética identificada. La sintaxis usa una ventana de tiempo de evento de 15 minutos; no una ventana deslizante sin solapamiento.

### LAB04-B — Ejercicio de correlación sin `join` innecesario (R04)

Dadas dos categorías de evento por `user`, `src`, `_time`, diseñar consultas que agreguen por identidad antes de unir, distinguir un join de una asociación temporal y justificar por qué no se puede deducir causalidad. **Criterio de éxito:** explicar empates, eventos duplicados, cuentas compartidas, retrasos de ingesta y límites de consultas. **Fallos penalizados:** atribuir causalidad por misma IP o misma cuenta sin más evidencia.

### LAB05-A — Normalizar un inicio de sesión (R05)

**Datos sintéticos:** fuente Windows `Account_Name`, `Source_Network_Address`, `EventCode`; fuente Linux `user`, `src_ip`, `action`. Propón un `user` común, `src` común, `action` correctamente normalizado y conserva evento crudo. La tabla `Authentication` del CIM utiliza campos como `src` y `user` y tags del dominio; no confundir `src` CIM con `source` (metadato original Splunk). [DOC:S05]

**Rúbrica:** no declarar equivalencia semántica entre un evento 4625, un logon Linux y un resultado de Entra sin explicar origen y tipo de fallo. Comprobar opcionales, nulos y mapeos incorrectos.

### LAB05-B — `tstats` con aceleración y pérdida de cobertura (R05)

**Escenario:** el índice tiene seis horas de eventos pero el modelo acelerado solo resume cuatro. Una consulta `tstats summariesonly=true` puede devolver menos resultados que la búsqueda cruda, incluso si es más rápida. **Criterio de éxito:** detectar el problema, buscar rangos de resumen y evitar la conclusión «no existe evento» al faltar cobertura. [DOC:S01,S06]

Ejemplo de sintaxis **ilustrativa**, condicionado a modelo, dataset y campos reales:

```spl
| tstats summariesonly=true count FROM datamodel=Authentication.Authentication
  BY Authentication.user _time span=1h
```

No se ejecutó; el dataset exacto y permisos se comprobarán en la instancia correspondiente.

### LAB06-A — Triage SOC N1: alerta sin pruebas suficientes (R06)

**Observación:** 8 fallos autenticación para 5 usuarios en 15 min desde IP compartida. **Tareas:** preguntar quién generó alerta, inventariar fuentes, ventana, host, IP, usuario, eventos antes/después, éxitos, patrón histórico y pertenencia VPN/NAT. **Salida correcta de referencia:** `actividad sospechosa no confirmada`; si no hay evidencia adicional, `inconcluso`. **Rechazar:** `ataque confirmado` sin corroboración.

**Informe mínimo:** investigación ID, ventana UTC, consultas reproducibles, observados vs inferidos, evidencia e identificadores, clasificación provisional, severidad justificada, escalado y humano revisor.

### LAB07-A — Diseñar una regla sin activarla (R07)

**Objetivo:** redactar hipótesis, prerequisitos y definición de éxito para una regla de 4769. Diseñar fixtures con evento benigno RC4, evento compatible con técnicas de Kerberoasting y ausencia de campo. **Criterio de éxito:** identificar falsos positivos y falsos negativos razonables, no confundir «disparó la regla» con «el ataque ocurrió». [DOC:S08,S15]

### LAB08-A — Kerberoasting (R08)

**Fuentes:** Splunk Security Content (S15) y eventos de seguridad compatibles. **Trabajo:** identificar solicitud TGS, SPN, tipo de cifrado, opciones, cliente y excepciones; revisar que `ServiceName` o equivalentes existan; registrar razón por la que comportamiento puede ser legítimo. **Sin reproducir ataque ni acceder a secretos.** Resultado: triage y plan de validación.

### LAB08-B — DCSync (R08)

**Fuentes:** Splunk Security Content (S16). **Trabajo:** buscar evidencia de replicación AD y corroboración desde origen no autorizado; examinar si está activo el registro 4662, permisos replicación, DCs conocidos, host y usuario. **Evaluación:** rechazar hipótesis si los datos no sostienen el salto lógico; indicar ausencias y posible FP.

### LAB09-A — Enterprise Security: eventos → findings → grupos (R09)

**Solo modelo conceptual si ES no está licenciado.** Dar al alumno cuatro señales con score inventado didácticamente, vincularlas a `user`, explicar agregación e investigación. No usar etiquetas «alertas ES reales» ni enseñar interfaces ES simuladas como capturas auténticas. **Criterio:** conoce límites de producto, distingue evento crudo, finding, intermediate finding y finding group. [DOC:S11,S12,S13]

### LAB10-A — Retención y pérdida de cobertura (R10)

**Supuesto sintético:** almacenamiento llega a tope antes que la antigüedad configurada. Calcular si `maxTotalDataSizeMB` puede precipitar paso a frozen; explicar que la política habitual sin archivo puede borrar datos. No se toca `indexes.conf`. [DOC:S18]

### LAB10-B — Troubleshooting de una búsqueda lenta (R10)

Proponer dos consultas equivalentes bajo fixture estable, medir Job Inspector, `scan count`, tiempo y fases cuando se autorice en sandbox. Comparar selección temprana por `index`, `sourcetype`, `earliest`, extracción y join. **No inventar cifras de ejecución**. [DOC:S17]

### LAB11-A — Automatización con aprobaciones (R11)

**Escenario:** detección → enriquecimiento IP → notificación → posible bloqueo de usuario. Diferenciar pasos de lectura de acciones mutantes; exigir aprobación humana, autorización auditada, control de errores y revisión. **Solo diagrama**, sin integraciones activas. [DOC:S22,S23]

### LAB11-B — REST read-only y comandos peligrosos (R11)

**Objetivo:** identificar que `search/jobs` y `search/jobs/{search_id}/results` existen para gestionar y recuperar resultados, y que gestionar un job no equivale a permiso de respuesta. El diseño de interfaz futura debe permitir únicamente consultas preaprobadas/parametrizadas para alumnos sin privilegios. **Demostración offline:** reconocer que `outputlookup`, `delete`, `map`, `script` u otros comandos con efectos sensibles NO deben ejecutarse por un agente de ejercicios. [DOC:S24,S25]

---

## V. Comparaciones KQL ↔ SPL que sí merecen convertirse en lecciones

A diferencia de un traductor literal de lenguaje, cada tarjeta comparará **objetivo analítico**, **fuentes requeridas**, **campos**, **semántica** y **resultado esperado**.

| Objetivo del cap. 13 SC-200 | KQL del documento / patrón | Splunk propuesto | Alerta pedagógica |
|---|---|---|---|
| Filtrar fallos Windows | `SecurityEvent | where EventID==4625` | `index=<WIN> EventCode=4625` | Depende de TA/extracción real; campo puede diferir |
| Contar por entidad | `summarize count() by ...` | `stats count by user` | Ignora nulos según función/agrupación |
| Contar usuarios únicos | `dcount(UserPrincipalName)` | `dc(user)` | No asumir idéntica semántica de aproximación |
| Agregar por tiempo | `bin(TimeGenerated,15m)` | `bin _time span=15m` | Ventanas y campos temporales no idénticos |
| Proyectar columnas | `project A,B` | `table A B` o `fields A B` | Tabla salida vs campos del pipeline |
| Añadir campo derivado | `extend X=...` | `eval X=...` | Funciones y tipos varían |
| Relacionar alertas-evidencias | `join on AlertId` | `stats`/`lookup`/`join` según estructura | No existe tabla `AlertInfo` genérica en Splunk |
| Ordenar por más reciente | `sort by Timestamp desc` | `sort - _time` | `sort` de Splunk puede introducir límites/ejecución costosa |
| Estado más reciente por equipo | `arg_max(Timestamp,*) by DeviceId` | `sort 0 - _time | dedup host` (solo con condiciones) | Empates, escala, nombres de host, cardinalidad |
| Ingestión vs evento | `ingestion_time()`, `TimeGenerated` | `_indextime`, `_time` | No equivalencia exacta entre pipelines |
| Normalización | ASIM parser y esquema | CIM field aliases/tags/data models | Semántica y ubicación de normalización distintas |
| Umbral de alerta | Analytics Rule KQL | Saved search/alert o ES detection | Productos y licencias distintos |

**Ejemplo KQL REAL presente en SC-200 cap. 13 (derivado de sus apuntes):**

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == "50126"
| summarize Cuentas = dcount(UserPrincipalName), Intentos = count()
    by IPAddress, Ventana = bin(TimeGenerated, 15m)
| where Cuentas >= 5
| sort by Cuentas desc
```

**SPL propuesto con eventos de login YA NORMALIZADOS, no consulta ejecutada:**

```spl
index=<AUTH_INDEX> action=failure earliest=-24h
| bin _time span=15m
| stats dc(user) as Cuentas count as Intentos by src _time
| where Cuentas>=5
| sort - Cuentas
```

**Por qué no son traducción automática exacta:** `ResultType=50126` corresponde a un motivo concreto de autenticación Entra; `action=failure` podría recoger múltiples motivos/fuentes. Para una comparación cuantitativa hay que alinear conjuntos de eventos, identidad, IP y semántica de fallo. La coincidencia numérica de dos consultas no es suficiente si los universos de eventos difieren.

**Ejemplo de correlación entre clic y proceso en SC-200:** tu documento vincula temporalmente `UrlClickEvents` y `DeviceProcessEvents` por `AccountUpn` y 10 minutos; ya advierte que esta asociación NO demuestra causalidad. Para Splunk, antes de escribir SPL hay que confirmar que ambas clases de eventos se ingieren, que comparten identidad normalizada, y que los timestamps son comparables. Si no existen las fuentes, debe ofrecerse una simulación educativa inequívocamente marcada, no resultados fabricados.

---

## VI. Dependencias y rutas profesionales

**Tronco SOC N1/N2 (P0):** `R01 → R02 → R03 → R04 → R05 (fundamentos) → R06 → R07 (fundamentos)`. Corresponde a arquitectura, origen del dato, búsquedas, agregaciones, normalización, triage y detección.

**Rama Detection Engineer (P1):** `R07 completo → R08 parcial → R09 opcional según ES`. Requiere técnicas de calidad, regresión, baseline y contenido de seguridad.

**Rama Threat Hunting (P1):** `R06 → R07 → R08`, con investigación por hipótesis y validación de telemetría.

**Rama Splunk admin/arquitecto (P2):** `R02 → R05 → R10` y opcional `R11` para APIs/integraciones.

**Rama automatización (P2):** `R07 → R11`, con conceptos de R09 cuando se use ES/SOAR.

**Ruta alternativa sin ES:** todas las lecciones del tronco y detecciones de plataforma deben poder estudiarse sin ES. Las lecciones de la Torre ES deben mostrar «requiere Enterprise Security para práctica real» y permitir conceptual/offline. Lo mismo para SOAR.

### Rúbricas de éxito por tipo

| Tipo | Éxito comprobable | Error descalificante |
|---|---|---|
| Fundamentos | Explica componentes y flujo correcto | Confunde UF con indexador |
| SPL | Consulta acotada, resultado interpretado, dependencias anotadas | Inventa campos o resultados |
| CIM | Demuestra cobertura y campos normalizados | Da por normalizados datos por tener CIM instalado |
| Investigación | Separa evento, indicio, hipótesis, conclusión | Confirma incidente solo por alerta |
| Detecciones | Pruebas positivas, negativas y ausencia de datos | Reporta 100 % de precisión sin base |
| Hunting | Hipótesis falsable, fuentes y pivotes reproducibles | Causalidad por coincidencia temporal |
| ES | Distingue ES del producto base | Atribuye ES a todos los Splunk |
| Administración | Minimiza riesgo, justifica capacidad/coste | Cambia configuración productiva para hacer un ejercicio |
| SOAR | Previene mutaciones sin permisos/aprobación | Ejecuta contención automática sobre usuario real |

---

## VII. Revisión adversarial: 14 vacíos, sus soluciones y pendientes honestos

| ID | Riesgo o vacío | Mitigación curricular | Estado |
|---|---|---|---|
| V01 | Asumir `EventCode` o `Account_Name` universales | Exigir descubrimiento de campos | Resuelto en diseño; prueba pendiente |
| V02 | Confundir KQL table con índice Splunk | Usar matriz fuente→TA→sourcetype→index→fields | Resuelto en diseño |
| V03 | Equiparar Sentinel XDR con Enterprise Security | Diferenciar explícitamente productos y funciones | Resuelto documental |
| V04 | Tratar 4769 RC4 como prueba concluyente | Casos benignos, contexto SPN, auditoría | Resuelto en diseño; prueba pendiente |
| V05 | Tratar DCSync como sinónimo de 4662 | Exigir contexto de replicación, origen y derechos | Resuelto en diseño; prueba pendiente |
| V06 | Perder datos por `tstats summariesonly` | Evaluación obligatoria de summary range | Resuelto documental |
| V07 | Explotar recursos por búsquedas amplias | Índice/tiempo acotados, Job Inspector | Resuelto en diseño; medidas pendientes |
| V08 | Conclusiones por joins truncados | Enseñar límites y alternativas | Resuelto documental |
| V09 | ID nuevos rompen XP/LocalStorage | Congelar ID y verificar integraciones con V1.5 | [PENDIENTE] hasta inspección del código local |
| V10 | El laboratorio carece de la telemetría propuesta | Fixtures offline + matriz de cobertura | [PENDIENTE] hasta inspección local |
| V11 | Confundir lección diseñada con validada | Etiquetas DOC/DISEÑO/VALIDADA | Resuelto en diseño; pruebas pendientes |
| V12 | Desactualización de Microsoft/Splunk | Producto, versión, URL y fecha por lección | Resuelto documental; mantenimiento recurrente |
| V13 | Credenciales o datos sensibles en repositorio educativo | Sin secretos ni datos reales; fixtures desidentificadas | Resuelto en política; prueba pendiente |
| V14 | Sesgo por priorizar el catálogo de detecciones | Enseñar benignos, FN, cobertura y casos inconclusos | Resuelto en diseño; pruebas pendientes |

### Mantenimiento futuro recomendado

Cada lección debe conservar `{id, region, prerequisite_ids, sc200_refs, topics, product, min_version/context, documentation_urls, verified_at, curriculum_status, query_test_status, exercise_status, estimated_effort}`. **La presencia de una URL no implica que se haya confirmado cada oración de la lección**. Revisar especialmente licencias, clasificación de findings, disponibilidad SPL2, cambios CIM y nombres de campos después de actualizaciones de producto.

---

## VIII. Lista de verificación para el siguiente equipo constructor

1. Leer fase 1, fase 2 y este bloque, además de SC-200.md; no convertir títulos provisionales en contenidos definitivos sin revisión humana.
2. Examinar la estructura real de V1.5 y su persistencia; definir compatibilidad/migración antes de escribir IDs.
3. Crear la ruta Splunk con progreso aislado pero motor educativo compartido; preservar SC-200.
4. Incorporar primero 3–5 lecciones completas (una con KQL/SPL y otra con validación de fuentes) y probar UX/móvil/accesibilidad.
5. Construir fixtures sintéticas versionadas y pruebas de respuestas; no alucinar datos.
6. No usar índices reales de laboratorio sin consentimiento; cuando corresponda, solo consultas permitidas, lectura y tiempos acotados.
7. Mantener etiquetas visibles: `Diseño teórico`, `Ejercicio offline comprobado`, `Probado en Splunk real`.
8. No mostrar módulos ES/SOAR como disponibles si no hay licencias/integración real.

---

## IX. Inventario de fuentes externas consultadas

Fecha común de consulta y selección: **2026-10-16**. Algunas páginas históricas (9.3/10.0/CIM 5.1) se usan para fundamentos o comportamiento documentado; no suponen compatibilidad demostrada con la versión 10.6 del laboratorio. Antes de ejecutar un ejemplo, prevalece la documentación de la versión instalada y el comportamiento observado.

- **[S01]** Splunk 10.6 tstats — 10.6. https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/tstats
- **[S02]** Splunk 10.0 subsearches — 10.0. https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.0/subsearches/about-subsearches
- **[S03]** Splunk 9.3 join — 9.3 (límite; confirmar 10.6 antes de probar). https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/9.3/search-commands/join
- **[S04]** CIM overview — CIM 5.1. https://help.splunk.com/en/data-management/common-information-model/5.1/introduction/overview-of-the-splunk-common-information-model
- **[S05]** CIM Authentication schema — CIM 8.5. https://help.splunk.com/en/splunk-cloud-platform/common-information-model/8.5/data-models/authentication
- **[S06]** CIM 8.7 acceleration — CIM 8.7. https://help.splunk.com/en/splunk-cloud-platform/common-information-model/8.7/using-the-common-information-model/accelerate-cim-data-models
- **[S07]** CIM 8.7 setup and index constraints — CIM 8.7. https://help.splunk.com/en/splunk-cloud-platform/common-information-model/8.7/introduction/set-up-the-splunk-common-information-model-add-on
- **[S08]** Saved searches alerts 10.0 — 10.0. https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.0/alerting-overview/getting-started-with-alerts
- **[S09]** Scheduled and real-time alerts 10.0 — 10.0. https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.0/choose-an-alert-type/alert-types
- **[S10]** savedsearches.conf — 10.0. https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.0/configuration-file-reference/10.0.0-configuration-file-reference/savedsearches.conf
- **[S11]** Splunk ES 8.7 overview — ES 8.7. https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/introduction/about-splunk-enterprise-security
- **[S12]** Splunk ES 8.7 detections — ES 8.7. https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/use-detections-to-search-for-threats-in-splunk-enterprise-security
- **[S13]** Splunk ES 8.7 start and definitions — ES 8.7. https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/introduction/get-started-with-splunk-enterprise-security
- **[S14]** Security Content analytic story AD Kerberos — catalogo security content. https://research.splunk.com/stories/active_directory_kerberos_attacks/
- **[S15]** Detection Kerberoasting RC4 — security content 2026. https://research.splunk.com/endpoint/5cc67381-44fa-4111-8a37-7a230943f027/
- **[S16]** Detection DCSync unsanctioned location — security content 2026. https://research.splunk.com/endpoint/50998483-bb15-457b-a870-965080d9e3d3/
- **[S17]** Search tuning guidance 10.6 — 10.6. https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.6/optimize-searches/write-better-searches
- **[S18]** indexes.conf 10.6 — 10.6. https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/configuration-file-reference/10.6.0-configuration-file-reference/indexes.conf
- **[S19]** Capabilities and roles 10.0 — 10.0. https://help.splunk.com/en/splunk-enterprise/administer/manage-users-and-security/10.0/manage-splunk-platform-users-and-roles/define-roles-on-the-splunk-platform-with-capabilities
- **[S20]** authorize.conf version 10 — 10.0. https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.0/configuration-file-reference/10.0.11-configuration-file-reference/authorize.conf
- **[S21]** TLS and default certificate caution 10.6 — 10.6. https://help.splunk.com/en/splunk-enterprise/administer/manage-users-and-security/10.6/secure-splunk-platform-communications-with-transport-layer-security-certificates/introduction-to-securing-the-splunk-platform-with-tls
- **[S22]** Splunk SOAR playbooks — SOAR Cloud. https://help.splunk.com/en/splunk-soar/soar-cloud/build-playbooks/introduction-to-splunk-soar-playbooks/use-playbooks-to-automate-analyst-workflows-in-splunk-soar-cloud
- **[S23]** Splunk SOAR approval controls — SOAR Cloud. https://help.splunk.com/en/splunk-soar/soar-cloud/develop-apps/python-playbook-api-reference/automation-api/playbook-automation-api
- **[S24]** Splunk REST API 10.6 endpoint list — 10.6. https://help.splunk.com/en/splunk-enterprise/leverage-rest-apis/rest-api-reference/10.6/introduction/endpoints-reference-list
- **[S25]** SPL safeguards list of risky commands — Cloud 10.6; contextual. https://help.splunk.com/en/splunk-cloud-platform/administer/manage-users-and-security/10.6/best-practices-for-splunk-platform-security/spl-safeguards-for-risky-commands/commands-that-trigger-spl-safeguards
- **[S26]** Security Content — windows detections — catalogo. https://research.splunk.com/detections/platforms/windows/
- **[S27]** SPL2 join command — SPL2; distinto de SPL clasico. https://help.splunk.com/en/splunk-enterprise/search/spl2-search-reference/join-command/join-command-overview-syntax-and-usage
- **[S28]** Splunk SOAR platform and variants — SOAR. https://help.splunk.com/en/splunk-soar
- **[S29]** Web HTTPS config 10.6 — 10.6. https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/configuration-file-reference/10.6.0-configuration-file-reference/web.conf

---

## X. Conclusión de esta investigación

**Diseño curricular documental: COMPLETO EN COBERTURA DE REGIONES R01–R11** (las tres primeras en Fase 2, las ocho últimas en esta Fase 3). El tamaño y el nivel de precisión permiten revisar competencias y diseñar una implementación gradual.

**Dominio profesional y consultas ejecutadas: NO VALIDADOS.** Son objetivos del estudiante, no una certificación concedida por el documento. Las fuentes respaldan capacidades documentales específicas, no resultados en su máquina.

**Pendientes que no se resuelven navegando documentación:** ids/datos del proyecto React; esquema y eventos reales de Splunk; disponibilidad/licencias ES/SOAR; ejecución de consultas; benchmark de rendimiento; evaluación con escenarios reales benignos y sospechosos. No modificar ninguna de esas fuentes sin autorización.
