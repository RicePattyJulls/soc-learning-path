# SOC Learning Path — Splunk Master Research
## Fase 2 · Bloque 1: arquitectura, ingesta y SPL fundamental (R01–R03)

**Investigación realizada:** 16 de octubre de 2026  
**Base documental del alumno:** `SC-200.md` (aportado a ChatGPT, 2.811 líneas)  
**Referencia de producto principal:** Splunk Enterprise **10.6**; contrastes con documentación vigente de la plataforma.  
**Propósito:** transformar las regiones **SP-R01, SP-R02 y SP-R03** de la Fase 1 en un currículo técnico y práctico revisable, preparado para que Codex lo integre **después de su aprobación**.  
**Estado:** fuentes oficiales consultadas y ejemplos razonados; **ninguna consulta ejecutada en la instancia Splunk del usuario**. No se ha accedido a su Parrot OS, al laboratorio ni a la academia local.  
**Compatibilidad curricular:** IDs de Splunk *propuestos*, no verificados contra el esquema de IDs de la aplicación.

> **Separación fundamental de estados**: [DOC] avalado por documentación oficial; [SC] consta en los apuntes SC-200; [PROP] diseño pedagógico; [SPL-NP] ejemplo SPL propuesto, **no probado** en el laboratorio; [PEND] necesita verificar dataset/configuración o ejecución.

---

## 1. Decisiones técnicas verificadas

### 1.1 Arquitectura: Splunk no es un único proceso fijo

[DOC] En una instalación pequeña, una instancia completa de Splunk Enterprise puede recibir datos, indexarlos, buscar y mostrar resultados. En despliegues distribuidos se separan las funciones:

```text
Servidor Windows ── Universal Forwarder ──┐
Servidor Linux   ── Universal Forwarder ──┼─> Indexer(s) ──> almacenamiento indexado
Cliente/API      ── HEC (si se habilita) ──┘           ↑
                                                     │ búsqueda local
Analista ── Search Head ── distribuye SPL ────────────┘
                  └── consolida y presenta resultados
```

- **Universal Forwarder (UF)**: obtiene/reenvía datos con pequeña huella y procesamiento limitado. **No** indexa, busca ni genera alertas.
- **Heavy Forwarder (HF)**: instancia completa configurada para reenviar; puede ejecutar parsing, filtrado y routing antes de la indexación final. **No es obligatorio** usarlo.
- **Indexer**: indexa/almacena eventos y busca en los datos locales.
- **Search Head**: acepta consultas, las distribuye cuando corresponde y consolida resultados. En modo *single instance* comparte funciones con el indexer.
- **Deployment Server**: distribuye configuraciones/apps a componentes compatibles; **no es** el motor que indexa o investiga.
- **Indexer Cluster y Search Head Cluster**: temas posteriores de ingeniería, no prerrequisitos de N1 para escribir SPL.

**Fuente:** [A1], [A2], [A3], [A4].

### 1.2 Ciclo del evento: cinco capas que no se deben confundir

[DOC] Modelo formativo:

```text
FUENTE ──> INPUT ──> PARSING ──> INDEXING ──> SEARCH
            |           |            |           |
         qué entra   timestamp,   índices      búsquedas,
         y de dónde  límites,      y archivos   campos extraídos,
                     tratamiento                informes
```

La configuración se coloca en el **primer componente que procesa esa fase**: si el UF recibe y un HF parsea, el parser se configura en el HF; si el UF reenvía directo al indexer, suele parsear el indexer. Existen excepciones técnicas, por ejemplo algunas extracciones estructuradas del UF. No instalar configuraciones de parsing indiscriminadamente en todos los nodos. [A3][A5]

**Comparación SC-200:** el capítulo 4 describe `origen → conector/ruta → método → configuración/DCR → transformación → tabla` (líneas 1125–1368). Ese modelo mental se aprovecha, pero **DCR/AMA ≠ props.conf/UF** como equivalencia exacta. [SC]

### 1.3 Campos que determinan dónde está un evento

| Campo Splunk | Pregunta que responde | Precaución |
|---|---|---|
| `index` | ¿En qué índice lógico busco? | No es una tabla XDR ni un `Log Analytics workspace`. |
| `sourcetype` | ¿Qué tipo/formato de evento es? | Condiciona parsing y extracciones; depende del origen/TA. |
| `source` | ¿Qué origen de datos concreto lo generó? | Puede ser ruta, canal o identificador configurado. |
| `host` | ¿A qué origen/host se atribuye? | No siempre equivale al dispositivo de destino del evento. |
| `_raw` | ¿Cuál es el contenido original almacenado del evento? | Puede contener información sensible. |
| `_time` | ¿Qué hora de evento se asignó durante parsing? | Si se extrajo mal, investigar alertas por tiempo falla. |
| `_indextime` | ¿Cuándo se indexó el evento? | Diferenciar retraso de ingesta de actividad real. |

[DOC] `earliest` y `latest` acotan **tiempo de evento** (`_time`). Los modificadores `_index_earliest` y `_index_latest` permiten filtrar por hora de indexación, con limitaciones importantes: los filtros de tiempo de evento también pueden excluir resultados. [A6]

### 1.4 Index-time no es search-time

[DOC] `host`, `source`, `sourcetype` y timestamps se fijan durante indexación; la mayoría de extracciones personalizadas conviene realizarlas al buscar. Un error al asignar sourcetype o tiempo de evento **no se corrige retroactivamente** por editar `props.conf`; puede exigir reprocesar datos o una mitigación de presentación. [A7]

- `inputs.conf`: define inputs en el componente que recibe.
- `outputs.conf`: controla forwarding y destinos.
- `indexes.conf`: define índices y parámetros de almacenamiento en los componentes apropiados.
- `props.conf`: interviene en reglas de parsing y knowledge objects según claves y fase.
- `transforms.conf`: permite transformaciones/extracciones referenciadas por otras configuraciones.

**Matiz crucial:** `props.conf` puede contener configuraciones de **index-time** y de **search-time**; no es correcto decir que todo `props.conf` se aplica en index-time, ni que `transforms.conf` siempre cambia los bytes almacenados. La fase depende de cómo se referencie la transformación. [A5][A7][A8]

### 1.5 HEC es una vía de ingesta, no de búsqueda

[DOC] HTTP Event Collector acepta eventos enviados por clientes autenticados con **token HEC**, tras habilitar el servicio y configurar la entrada. El token tiene una fuente, un sourcetype y uno o más índices permitidos/configurados según la configuración. Las opciones de TLS, puertos y acknowledgement dependen del despliegue. Un token HEC **no** sustituye los permisos de un usuario para ejecutar SPL. [A9]

**Comparación SC-200:** HEC se parece funcionalmente a una API de ingestión, pero no equivale exactamente a AMA ni a todos los conectores administrados de Sentinel. [SC]

### 1.6 SQL/KQL/SPL: la pregunta define la consulta

[DOC] SPL clásico trabaja sobre eventos recuperados de índices y comandos encadenados con `|`. `stats` agrega, `eval` calcula campos, `where` filtra usando expresiones, `bin` agrupa intervalos, `fieldsummary` permite revisar cobertura de campos. El comportamiento de SPL2 **no debe mezclarse automáticamente** con SPL clásico. [A10][A11][A12][A13]

**No hacer:** sustituir mecánicamente `SecurityEvent` por `WinEventLog`. En Splunk se buscan eventos en índices y sourcetypes determinados por su ingestión; los campos disponibles dependen del origen, del TA y de las extracciones activas.

---

## 2. Contraste profundo con SC-200.md (evidencias de origen)

| Punto del archivo SC-200 | Saber previo ya desarrollado | Qué aprenderás en Splunk | Categoría |
|---|---|---|---|
| Cap. 1, líneas 56–213 | Licencia ≠ incorporación; distinción por usuario, recurso y consumo | Splunk Enterprise vs Cloud, ingesta/indexadores/forwarders, componentes y derechos de uso | Parcial |
| Cap. 2, líneas 214–541 | Azure RBAC, Unified RBAC, scopes y mínimos privilegios | Roles/capabilities de Splunk, acceso a índices y permisos de objetos (ruta admin futura) | Diferente arquitectura |
| Cap. 4, líneas 1125–1368 | Origen, conector/ruta, agente/API, transformaciones, tabla destino | Input, UF/HF/HEC, index/sourcetype, parsing, indexación | Funcional cercana |
| Cap. 5, líneas 1369–1546 | Analytics/Basic/Auxiliary/Data Lake y retención en Microsoft | Índices y retención de Splunk; NO tienen la misma estructura de tiers | Parcial |
| Cap. 7, líneas 1601–1879 | Detección/alerta y condiciones sobre datos XDR/Sentinel | Búsquedas SPL, saved searches, alertas; ES después | Parcial |
| Cap. 8, líneas 1880–1986 | Correlación de alertas e incidentes | Correlación por campos en SPL; workflow ES se estudia aparte | Parcial |
| Cap. 10, líneas 2105–2235 | Hunting por hipótesis | Definir pregunta, acotar fuentes/tiempo, buscar/pivotar y conservar evidencia | Funcional cercana |
| Cap. 13, líneas 2517–2811 | `Timestamp` vs `TimeGenerated`, familias de tablas, `where`, `summarize`, `join`, ejemplos | `_time` vs `_indextime`, `index/sourcetype`, `search/where`, `stats`, `bin`, `eval`, SPL de investigación | Técnicas comparables, esquemas diferentes |

**Nota de fidelidad:** las referencias de línea son al Markdown recibido, no IDs de lección definitivos de SOC Learning Path. La academia local no está accesible desde ChatGPT para comprobar sus IDs.

### Matriz de traducción conceptual segura

| Microsoft (tu material) | Splunk: concepto comparable | ¿Es equivalencia exacta? | Qué comprobar |
|---|---|---|---|
| AMA sobre Windows → `SecurityEvent`/`WindowsEvent` | Universal Forwarder u otra ruta compatible → índice de eventos Windows | No | TA, canal, EventCode/EventID, index y sourcetype |
| KQL `SigninLogs` | Eventos de autenticación de Entra ingeridos en un índice Splunk | No | ¿existe ingesta Entra? ¿cómo se extrajeron usuario/IP/resultado? |
| Tabla Log Analytics | Índice + sourcetype + campos extraídos | No | No hay esquema tabular único universal |
| `TimeGenerated` | `_time` como **hora del evento asignada por parsing** | Parcial | Zona horaria, formatos, latencia, semántica del origen |
| `ingestion_time()` | `_indextime` como **hora de indexación** | Parcial | Etapas y relojes diferentes |
| KQL `where` | Condiciones en búsqueda SPL o `| where` | Parcial | Semántica de comparación, tipos, optimización |
| KQL `project` | `| table` / `| fields` según el objetivo | Parcial | `table` cambia presentación; `fields` delimita campos |
| KQL `extend` | `| eval` | Cercana | Operadores/funciones SPL y tipos |
| KQL `summarize count() by X` | `| stats count by X` | Cercana | Campos faltantes y cardinalidad |
| KQL `dcount(X)` | `stats dc(X)` (y `estdc(X)` cuando procede) | Parcial | No asumir mismas garantías/algoritmos de estimación |
| KQL `bin(TimeGenerated,15m)` | `| bin _time span=15m` | Funcional cercana | Alineación temporal, UTC/huso/ventana |
| KQL `arg_max(Timestamp, *) by DeviceId` | Ordenar por `_time` y `dedup` por entidad, con cautelas | Parcial | Empates, escala, estabilidad del evento completo |
| KQL `join` | `stats`/`lookup`/`join` según tipos de datos y cardinalidad | No | `join` de Splunk tiene límites/opciones diferentes |

---

## 3. Currículo listo para revisar: 3 regiones y 18 lecciones

Se proponen **18 lecciones**. No se afirma que se hayan creado en React. La duración es estimación para enseñanza y práctica, no tiempo medido.

### Región SP-R01 — Puerto de Splunk (5 lecciones)

| ID provisional | Lección | Resultado verificable | Previos | Tiempo orientativo |
|---|---|---|---|---|
| `SP-R01-L01` | Ecosistema Splunk y límites de producto | Distinguir Enterprise/Cloud/ES/SOAR en cinco casos | Ninguno | 35–50 min |
| `SP-R01-L02` | Anatomía de una instancia | Explicar dónde entra, se almacena y se busca un evento | L01 | 40–60 min |
| `SP-R01-L03` | UF, HF, indexer y search head | Diseñar sin contradicciones una topología pequeña y otra distribuida | L02 | 45–65 min |
| `SP-R01-L04` | Anatomía de evento y metadatos | Distinguir `index`, `source`, `sourcetype`, `host`, `_time`, `_indextime`, `_raw` | L02 | 50–70 min |
| `SP-R01-L05` | Primer razonamiento de búsqueda | Traducir una pregunta del analista a índice, fuente, campos y ventana | L04 | 40–60 min |

**Actividad integradora R01:** dados tres orígenes —Windows, syslog de firewall y API cloud—, dibujar arquitectura; señalar qué componente puede o no parsear; proponer dónde se buscarán los eventos; detectar dos afirmaciones falsas como «UF indexa» o «Search Head almacena todos los logs remotos». [DOC][PROP]

### Región SP-R02 — Río de Telemetría (6 lecciones)

| ID provisional | Lección | Resultado verificable | Previos | Tiempo orientativo |
|---|---|---|---|---|
| `SP-R02-L01` | Seleccionar fuentes y rutas de entrada | Elegir UF, HEC u otro método y justificarlo | R01 | 45–65 min |
| `SP-R02-L02` | Logs Windows y Linux | Diseñar un recorrido de evento sin asumir nombres de campos | L01 | 45–75 min |
| `SP-R02-L03` | HTTP Event Collector | Distinguir endpoint/token/input/index y controles TLS | L01 | 45–60 min |
| `SP-R02-L04` | `inputs`, `props`, `transforms`, `outputs` | Asignar configuraciones a su fase y ubicación responsable | L01–L03 | 60–90 min |
| `SP-R02-L05` | Timestamps, parsing y latencia | Diagnosticar eventos con hora incorrecta o llegada tardía | L04 | 50–75 min |
| `SP-R02-L06` | Troubleshooting de cobertura | Elaborar checklist de ausencia de eventos/campos sin cambios destructivos | L02–L05 | 60–90 min |

**Actividad integradora R02:** explicar por qué un evento puede estar correctamente indexado pero no aparecer en «Last 24 hours» (hora de evento fuera de ventana, parseo, zona, filtros RBAC, índice equivocado). Justificar cómo discriminar hipótesis sin borrar/reingerir. [DOC][PROP]

### Región SP-R03 — Bosque SPL I (7 lecciones)

| ID provisional | Lección | Resultado verificable | Previos | Tiempo orientativo |
|---|---|---|---|---|
| `SP-R03-L01` | Estrategia de búsqueda y ventanas | Escribir consultas acotadas por índice, tiempo y tipo | R01–R02 | 40–60 min |
| `SP-R03-L02` | Filtros de búsqueda y `where` | Elegir base search o expresión `where` y explicar diferencias | L01 | 45–60 min |
| `SP-R03-L03` | Tablas, campos y exploración | Identificar campos reales; utilizar `table`, `fields`, `fieldsummary` | L01–L02 | 50–75 min |
| `SP-R03-L04` | Campos calculados con `eval` | Calcular una etiqueta o diferencia de tiempo sin tocar eventos almacenados | L03 | 45–65 min |
| `SP-R03-L05` | Agrupar con `stats` | Distinguir `count`, `dc`, `values`, `latest`; detectar problemas con nulos | L03–L04 | 60–85 min |
| `SP-R03-L06` | Ventanas con `bin` y `timechart` | Agrupar autenticaciones por IP/usuario en 15 minutos | L05 | 60–90 min |
| `SP-R03-L07` | Primer mini-hunting guiado | Investigar fallos repetidos, explicar evidencias y límites | L01–L06 | 75–110 min |

**Actividad integradora R03:** formular una hipótesis de password spraying y comprobar qué **demuestran** los datos, no solo qué devuelve el filtro. Si la fuente no distingue fallo de autenticación, la clasificación debe ser «información insuficiente». [SC][DOC][PROP]

### Carga de estudio inicial estimada

- R01: ~3,5–5 h; R02: ~5–7,5 h; R03: ~6–9 h de actividad directa.
- **Total aproximado:** **14,5–21,5 h**, sin contar repeticiones, diagnóstico prolongado ni laboratorios externos.
- Duraciones propuestas, no cronometraje ni garantía de dominio.

---

## 4. Lecciones técnicas de muestra (contenido enseñable)

### Lección SP-R01-L03 — ¿Quién hace qué?

**Pregunta inicial:** «Tengo 80 servidores Windows y quiero investigar logons fallidos. ¿Debo instalar 80 instancias completas de Splunk Enterprise?»

**Respuesta:** no. Una arquitectura habitual usa UF en fuentes Windows y una o varias instancias centrales para recibir/indexar y buscar. Una instancia central pequeña puede combinar indexer + search head. A medida que crece la carga pueden separarse componentes. [A1][A2]

**Errores que debe detectar el alumno:**

1. Llamar indexador al UF.
2. Pensar que Heavy Forwarder es obligatorio para logs Windows.
3. Confundir Search Head con almacenamiento remoto de todos los buckets.
4. Omitir el coste de redes, retención, recursos y permisos.

**Evaluación (dominio):** elegir topología compatible, explicar dos motivos y detectar al menos tres errores.

### Lección SP-R02-L04 — ¿Dónde se corrige un sourcetype?

**Situación:** eventos Windows llegan a un índice, pero el sourcetype es incorrecto y ciertas extracciones no aparecen.

**Conceptos:**

- Los datos se etiquetan con metadatos al indexar.
- Una corrección de parsing para eventos futuros debe situarse en el primer componente que ejecute esa fase.
- Los eventos ya indexados no cambian automáticamente su etiqueta original.
- Una extracción search-time puede resolver determinados problemas de lectura sin reindexar; **no equivale a corregir el dato original**. [A5][A7][A8]

**Rúbrica:** identificar fase responsable, efecto retroactivo y prueba no destructiva para confirmar. No pedir modificación real de `props.conf`.

### Lección SP-R03-L02 — KQL `where` frente a SPL

**SC-200:**

```kql
SecurityEvent
| where TimeGenerated > ago(24h)
| where EventID == 4625
| project TimeGenerated, Computer, Account, EventID
```

**SPL clásico ilustrativo, NO ejecutado:**

```spl
index=<WINDOWS_INDEX> sourcetype="WinEventLog:Security" EventCode=4625 earliest=-24h
| table _time host EventCode Account_Name
```

**Advertencias:**

- Sustituir `<WINDOWS_INDEX>` por un índice conocido; el valor no puede deducirse del Markdown.
- `WinEventLog:Security`, `EventCode`, `Account_Name` son ejemplos frecuentes, **no esquema universal**. Otro TA/formato puede producir nombres diferentes.
- `SecurityEvent.EventID=4625` y `EventCode=4625` pueden expresar el mismo tipo de evento Windows, pero **solo si la ingesta y los campos lo permiten**.
- `TimeGenerated` y `_time` dependen de sistemas distintos; validar marca temporal antes de comparar recuentos.

**Por qué no es mera traducción:** el KQL consulta una tabla con esquema; la búsqueda Splunk combina índices, metadatos y campos extraídos. [SC: capítulos 4 y 13][A7][A14]

**Verificación sin inventar campos:** en un índice autorizado y con ventana acotada:

```spl
index=<WINDOWS_INDEX> earliest=-24h
| stats count by sourcetype
```

Y, tras seleccionar uno realmente presente:

```spl
index=<WINDOWS_INDEX> sourcetype=<SOURCETYPE_OBSERVADO> earliest=-24h
| head 20
| fieldsummary
```

`fieldsummary` permite revisar nombres/cobertura en la muestra. La muestra no prueba que todos los eventos tengan ese campo. Los marcadores deben reemplazarse antes de ejecutar y limitarse a índices permitidos. [A13]

### Lección SP-R03-L04 — Campo calculado: latencia

**KQL conceptual de tu capítulo 4:** latencia de ingesta comparando momento del registro con `ingestion_time()`.

**SPL conceptual (NO ejecutado):**

```spl
index=<INDICE_PERMITIDO> earliest=-24h
| eval latencia_seg=_indextime-_time
| where latencia_seg>=0
| stats count AS eventos avg(latencia_seg) AS media_seg perc95(latencia_seg) AS p95_seg by sourcetype
| sort - p95_seg
```

**Matiz:** `_indextime - _time` mide desde la hora atribuida al evento hasta indexarse en Splunk, no la misma trayectoria técnica de AMA/DCR/Log Analytics. Si se parsea mal `_time`, la métrica puede ser engañosa. `where latencia_seg>=0` excluye valores negativos, no corrige un reloj desincronizado. [A6]

**Rúbrica:** explicar diferencia entre 95.º percentil y promedio; señalar al menos dos causas de retraso o timestamp erróneo.

### Lección SP-R03-L05 — KQL `summarize` frente a `stats`

**KQL en `SC-200.md` (cap. 13, patrón de spray):**

```kql
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType == "50126"
| summarize Cuentas = dcount(UserPrincipalName), Intentos = count()
    by IPAddress, Ventana = bin(TimeGenerated, 15m)
| where Cuentas >= 5
| sort by Cuentas desc
```

**SPL clásico propuesto para una fuente normalizada de autenticación:**

```spl
index=<AUTH_INDEX> action=failure earliest=-24h
| bin _time span=15m
| stats dc(user) AS Cuentas count AS Intentos by src _time
| where Cuentas>=5
| sort - Cuentas
```

**Condiciones previas no negociables:**

- `action`, `user` y `src` deben existir y representar exactamente lo que buscamos.
- `action=failure` **no tiene por qué significar** el mismo subconjunto de fallos que `ResultType="50126"`. No comparar recuentos como equivalentes hasta definir el filtro por fuente.
- Se debe decidir si las identidades de servicio, IP compartidas, VPN y NAT necesitan lógica distinta.
- Una única IP con cinco usuarios fallidos sugiere una hipótesis; **no confirma automáticamente un ataque**.
- Los resultados también dependen de ventanas, cobertura temporal y eventos tardíos.

**Fuente de comandos:** [A10][A11][A12]. **Fuente del patrón KQL:** [SC: capítulo 13]. **Estado:** [SPL-NP].

---

## 5. Banco de ejercicios verificables (diseñados, todavía no ejecutados)

### Ejercicio B1-E01 — Elegir la arquitectura

**Entrada:** 15 Windows Server, 8 Linux y un appliance de red que envía syslog; un único analista SOC necesita búsquedas.

**Tarea:** proponer flujo de recopilación, parsing, indexado y búsqueda; especificar dónde no se puede instalar UF.

**Solución esperada (principios):** UF puede instalarse en Windows/Linux compatibles; un appliance puede enviar syslog a un colector/entrada compatible; Splunk central indexa y la función search head consulta. El diseño definitivo exige datos sobre volumen, fiabilidad, permisos y soporte de fuentes. **No** afirmar que el appliance soporta UF sin verificarlo.

**Comprobación:** señalar UF ≠ Indexer y que la ingesta de syslog requiere planificación específica. [PROP]

### Ejercicio B1-E02 — Desambiguación de metadatos

**Entrada sintética, solo para teoría:**

| index | sourcetype | host | source | event-code |
|---|---|---|---|---|
| win_security | WinEventLog:Security | dc01 | WinEventLog:Security | 4625 |
| firewall | vendor:fw | fw01 | udp:5514 | deny |

**Tarea:** identificar qué columna responde a dónde buscar, tipo de datos, origen atribuido y origen técnico. Explicar por qué `4625` no puede utilizarse como filtro de un evento firewall.

**Solución:** index→destino lógico; sourcetype→tipo de fuente; host→origen atribuido; source→identificador de fuente; event-code es solo un ejemplo de campo semántico por fuente. [DOC][PROP]

### Ejercicio B1-E03 — Diagnosticar huecos de ingesta

**Problema:** «El servidor produce eventos hoy, Splunk solo los muestra con `All Time`, y un dashboard no encuentra `EventCode`».

**Hipótesis obligatorias:** reloj/zona y parsing de `_time`; ventana del picker; índice o sourcetype distinto; ausencia de extracción; permisos, retraso de indexación, reenvío. No inferir una causa única.

**Producto a entregar:** checklist diagnóstico ordenado, evidencias necesarias y cambios **no realizados**.

### Ejercicio B1-E04 — SPL básico de fallos Windows

**Objetivo:** explicar qué significa y cómo depurar la consulta ilustrativa de la lección R03-L02. Sustituir parámetros por valores **verificados** en un entorno autorizado.

**Criterio de éxito:** identifica los filtros, explica cualquier campo ausente y sabe cuándo `EventCode` no será el nombre correcto. No basta con que Splunk devuelva «0».

### Ejercicio B1-E05 — Autenticaciones por ventana

**Datos sintéticos de referencia — no son eventos de tu laboratorio:**

```csv
time_utc,src,user,action
2026-10-15T10:01:00Z,203.0.113.9,alice,failure
2026-10-15T10:02:00Z,203.0.113.9,bob,failure
2026-10-15T10:03:00Z,203.0.113.9,carla,failure
2026-10-15T10:04:00Z,203.0.113.9,david,failure
2026-10-15T10:05:00Z,203.0.113.9,eva,failure
2026-10-15T10:06:00Z,203.0.113.9,bob,failure
2026-10-15T10:07:00Z,198.51.100.20,frank,failure
2026-10-15T10:08:00Z,198.51.100.20,frank,success
```

**Pregunta:** filtrando `action=failure` y agrupando en bloques de 15 minutos por IP, ¿qué retorna `dc(user)` y `count`?

**Respuesta de referencia (derivación manual de la tabla):**

- `203.0.113.9` → 5 cuentas distintas, 6 intentos fallidos.
- `198.51.100.20` → 1 cuenta distinta, 1 intento fallido.
- Umbral `Cuentas>=5` identifica solo la primera IP.
- **No puede concluirse ataque confirmado** sin contexto sobre origen y patrón de la autenticación.

**Forma de comprobarlo después:** importar esta fixture expresamente a una fuente sintética autorizada o utilizar un mecanismo local de simulación en un entorno aislado; **no se ha realizado esta importación ni ejecución**. Para una evaluación offline, contar a mano o con un procesador CSV independiente y comparar a la solución de referencia.

### Ejercicio B1-E06 — Diferenciar `search` de `where`

**Pregunta:** ¿qué cambia entre aplicar condiciones sobre un campo disponible desde la búsqueda inicial y filtrar con `where` después de `stats`?

**Respuesta:** la ubicación puede afectar eficiencia y semántica. Después de `stats`, solo quedan los campos calculados y los agrupadores. `where` sirve para expresiones y comparaciones que requieren lógica de evaluación. Cuando se conocen índices, fuente, tipo y ventana, conviene acotar temprano. [A10][A15]

### Ejercicio B1-E07 — ¿Qué demuestra el resultado?

**Entrada:** alerta con cinco usuarios fallidos desde una misma IP en un cuarto de hora.

**Tarea:** elegir entre «ataque confirmado», «actividad sospechosa que requiere contexto» y «falso positivo demostrado». Justificar con evidencia adicional necesaria.

**Solución:** actividad sospechosa/hipótesis de spraying; comprobar si hay NAT/VPN compartida, éxitos tras fallos, identidades de servicio, horarios y volumen histórico. [PROP]

---

## 6. Cuestionario por competencias (12 preguntas con soluciones)

| ID | Pregunta | Respuesta esperada |
|---|---|---|
| Q01 | ¿Puede Universal Forwarder indexar datos? | No, reenvía con procesamiento mínimo. |
| Q02 | ¿El Heavy Forwarder es obligatorio en todas las arquitecturas? | No; depende de parsing, routing e inputs necesarios. |
| Q03 | ¿Quién ejecuta búsquedas contra datos almacenados en cada índice distribuido? | Los indexers sobre sus índices; el Search Head coordina. |
| Q04 | ¿`sourcetype` equivale a una tabla XDR? | No; es metadato/clasificación de fuente de Splunk. |
| Q05 | ¿Qué significa `_time`? | Hora de evento asignada por parsing. |
| Q06 | ¿Qué significa `_indextime`? | Hora de indexación; no es automáticamente hora real del ataque. |
| Q07 | ¿Editar `props.conf` hoy reetiqueta automáticamente datos históricos? | No, no cambia por sí solo metadatos indexados. |
| Q08 | ¿HEC ejecuta SPL? | No; es mecanismo de entrada autenticada de eventos. |
| Q09 | ¿Por qué no podemos buscar `index=SigninLogs` por defecto? | Porque tabla Sentinel ≠ índice Splunk; debemos confirmar fuente y mapeo. |
| Q10 | ¿Qué hace `stats dc(user)`? | Cuenta valores distintos no nulos del campo de usuario según agrupación. |
| Q11 | ¿Qué precaución exige un umbral de fallos por IP? | NAT/VPN, cuentas de servicio, tipo de fallo y contexto; no confirma intrusión. |
| Q12 | ¿Es correcto equiparar `ingestion_time()` de Azure con `_indextime` sin matices? | No; hay pipelines, marcas temporales y trayectos distintos. |

**Evaluación:** exigir ≥80 % de aciertos **más** la superación del ejercicio integrador de la región. Responder de memoria los 12 ítems no demuestra dominio de SPL. [PROP]

---

## 7. Rúbrica y progreso de la academia

| Competencia | No alcanzada (0) | Parcial (1) | Satisfactoria (2) |
|---|---|---|---|
| Arquitectura | Confunde UF/indexer/search | Identifica elementos, pero no el flujo | Dibuja componentes y explica responsabilidades |
| Ingesta | No distingue input, parsing e indexado | Flujo correcto con huecos de ubicación | Traza ruta y sitúa configuraciones |
| Campos | Asume esquema XDR en Splunk | Identifica metadatos básicos | Verifica campos y rechaza supuestos no probados |
| SPL básico | Usa consultas sin filtros ni explicación | Consulta plausible con dependencias pendientes | Consulta acotada, explica comandos/campos |
| Interpretación | Confirma ataque por recuento | Reconoce alguna incertidumbre | Distingue evidencia, hipótesis y datos faltantes |
| Seguridad | Propone tocar producción sin autorización | Identifica riesgos básicos | Diseña pruebas de lectura y ejercicios aislados |

**Criterio de dominio propuesto:** mínimo 10/12 puntos, ninguno de los ejes Arquitectura, SPL básico o Interpretación en 0, y evaluación teórica ≥80 %. Esta rúbrica no ha sido incorporada a la aplicación.

**Progreso y IDs:** la academia V1.5 ya diferencia completada vs dominada. No duplicar motor de progreso para Splunk; integrar estas rúbricas cuando conozcamos su esquema definitivo y exista autorización.

---

## 8. Auditoría crítica: lagunas y contradicciones por resolver

1. **Esquema real del laboratorio:** no se han observado índices/sourcetypes/campos de los eventos Windows/Linux. Los ejemplos usan placeholders.
2. **Esquema de la academia:** los IDs `SP-R..` son provisionales, no necesariamente compatibles con la clave de persistencia existente.
3. **Clases de ingestión:** para explicar Windows correctamente se debe verificar después la compatibilidad de UF, Windows add-on y formato concreto de eventos. No presumir `EventCode` en todas las fuentes.
4. **SPL clásico/SPL2:** ejemplos de este bloque usan SPL clásico; no prometer igualdad de comportamiento con SPL2.
5. **Cardinalidad temporal:** agrupaciones de 15 minutos pueden diferir si hay relojes desincronizados, zonas horarias o interpretaciones distintas de registros.
6. **Comparabilidad de errores:** `SigninLogs.ResultType=50126` no equivale siempre a `action=failure`; documentar los filtros de normalización antes de validar sprays.
7. **Rendimiento:** enseñar consultas por índice y tiempo; impedir que ejercicios de iniciación se conviertan en búsquedas ilimitadas sobre un entorno productivo.
8. **Licenciamiento:** Splunk Enterprise Security/SOAR no se deducen de disponer de Splunk Enterprise; estos capítulos posteriores requieren ruta conceptual opcional.
9. **Fuente Microsoft:** SC-200.md es una referencia histórica del estudiante, no garantía de que los menús/licencias Microsoft sigan vigentes. Verificar afirmaciones sensibles al tiempo antes de publicar una equivalencia.
10. **Evaluación:** no declararemos «35 actividades verificadas en la academia» como pruebas de las nuevas actividades Splunk; estas son propuestas educativas distintas.

**Dictamen de este bloque:** investigación documental de las tres primeras regiones suficientemente desarrollada para revisión curricular, pero **NO lista para declarar lecciones validadas en Splunk real**. La siguiente revisión útil es aprobar la secuencia y, con Codex, verificar los IDs/estructura antes de convertirlo a datos de app. Después vendrá el bloque R04–R05 sobre agregaciones avanzadas, CIM y modelos de datos.

---

## 9. Fuentes oficiales consultadas y estado de verificación

**Fecha de consulta: 2026-10-16.** Referencias [A#] de documentación Splunk; los nombres de fuentes son hipervínculos directos. Las páginas 10.6 son del manual de Splunk Enterprise; donde se utiliza una versión anterior queda claramente señalado.

- **[A1]** Splunk Enterprise 10.6, *Indexers in a distributed deployment*: https://help.splunk.com/en/data-management/manage-splunk-enterprise-indexers/10.6/indexing-overview/indexers-in-a-distributed-deployment
- **[A2]** Splunk Enterprise 10.6, *Scale your deployment with Splunk Enterprise components*: https://help.splunk.com/en/splunk-enterprise/administer/distributed-deployment-manual/10.6/overview-of-splunk-enterprise-distributed-deployments/scale-your-deployment-with-splunk-enterprise-components
- **[A3]** Splunk Enterprise 10.6, *How indexing works*: https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.6/indexing-overview/how-indexing-works
- **[A4]** Splunk Enterprise 10.6, *Deploy a heavy forwarder*: https://help.splunk.com/en/splunk-enterprise/forward-and-process-data/forwarding-and-receiving-data/10.6/deploy-heavy-and-light-forwarders/deploy-a-heavy-forwarder
- **[A5]** Splunk Enterprise 10.6, *Configuration parameters and the data pipeline*: https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/administer-splunk-enterprise-with-configuration-files/configuration-parameters-and-the-data-pipeline
- **[A6]** Splunk Enterprise 10.6, *Time modifiers*: https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/time-format-variables-and-modifiers/time-modifiers
- **[A7]** Splunk Enterprise 10.6, *Index time versus search time*: https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.6/indexing-overview/index-time-versus-search-time
- **[A8]** Splunk Enterprise 10.6, *props.conf*: https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/configuration-file-reference/10.6.0-configuration-file-reference/props.conf
- **[A9]** Splunk Enterprise 10.6, *Set up and use HTTP Event Collector in Splunk Web*: https://help.splunk.com/en/splunk-enterprise/get-started/get-data-in/10.6/get-data-with-http-event-collector/set-up-and-use-http-event-collector-in-splunk-web
- **[A10]** Splunk Enterprise 10.6, *stats*: https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/stats
- **[A11]** Splunk Enterprise 10.6, *bin*: https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/bin
- **[A12]** Splunk Enterprise 10.6, *where*: https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/where
- **[A13]** Splunk Enterprise 10.6, *fieldsummary*: https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/fieldsummary
- **[A14]** Splunk Enterprise 10.6, *Quick tips for optimization*: https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.6/optimize-searches/quick-tips-for-optimization
- **[A15]** Splunk Enterprise 10.6, *Commands by category*: https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/quick-reference/commands-by-category

**Fuente privada [SC]**: documento del usuario `SC-200.md`, líneas 56–213, 214–541, 1125–1368, 1369–1546, 1601–1986 y 2517–2811. No se ha modificado, ni trasladado a ningún servicio externo distinto de esta conversación.

---

## 10. Entrega y siguiente decisión

**Se entrega ahora**: el currículo en detalle de R01–R03 (18 lecciones), ejemplos comparativos KQL/SPL, 7 ejercicios propuestos, 12 preguntas evaluables, rúbrica, fuentes y auditoría crítica.

**Queda fuera por diseño**: comprobar la instancia Splunk; instalar/configurar UF o HEC; generar contenidos React; tocar archivos de la academia; certificar el resultado de los ejercicios en Splunk real.

**Próxima etapa recomendada**: después de revisar esta propuesta, profundizar en **R04–R05: SPL avanzado para correlación + Common Information Model**, porque prepara las investigaciones N1/N2 de la región R06. Mantener la investigación separada de la implementación hasta que se apruebe el currículo.
