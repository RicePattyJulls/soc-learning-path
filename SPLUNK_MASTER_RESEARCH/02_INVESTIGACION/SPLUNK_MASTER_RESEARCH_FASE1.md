# SOC Learning Path — Splunk Master Research
## Fase 1 — Inventario, correspondencias y mapa curricular preliminar

**Fecha de revisión:** 16 de octubre de 2026  
**Estado:** investigación documental inicial / propuesta pedagógica; no implementado ni probado en Splunk.  
**Insumo principal:** `SC-200.md` aportado por el usuario (2811 líneas aprox.).  
**Alcance:** leer el material de SC-200, comprobar fundamentos con documentación oficial de Splunk y proponer una ruta de enseñanza.  
**Sin cambios:** no se ha accedido a `localhost`, al sistema Parrot OS, al repositorio local de la academia ni al laboratorio Splunk; no se han ejecutado consultas SPL.

## 1. Hallazgo central

SC-200 se organiza por un ecosistema de productos de Microsoft (Sentinel, Defender XDR, Entra, Purview, etc.). Splunk tiene su propia progresión técnica: arquitectura → obtención de datos → índices/sourcetypes → SPL → normalización/CIM → investigaciones/detecciones → administración. Por tanto, **no se debe replicar 1:1 el índice de SC-200**. Se propone una aventura Splunk autónoma, con puentes de conceptos y ejemplos KQL ↔ SPL verificables.

Se distinguen siempre cuatro contextos:

- **Splunk Enterprise / Splunk Cloud Platform:** plataforma de recopilación, indexación, búsqueda, informes y alertas, según características/versión.
- **Splunk Enterprise Security (ES):** solución específica de SecOps; las experiencias de *findings*, *investigations*, RBA y *Mission Control* documentadas para ES no se atribuyen automáticamente a la plataforma base.
- **Splunk SOAR:** automatización y respuesta mediante aplicaciones y playbooks, diferenciada de alert actions y otras funciones nativas de plataforma.
- **SPL y SPL2:** variantes con sintaxis, compatibilidad y disponibilidad que deben enseñarse en contextos separados. Verificar soporte por versión, SO y producto; evitar asumir SPL2 en todos los entornos.

## 2. Inventario de SC-200 y referencias de línea

El documento base contiene los siguientes encabezados principales (números de línea del archivo aportado):

| Capítulo | Línea | Competencia previa reutilizable |
|---|---:|---|
| 01 Licencia y onboarding | 56 | distinguir licencia de incorporación/configuración |
| 02 Permisos y RBAC | 214 | mínimo privilegio y scopes |
| 03 Protección y configuración de workloads | 542 | qué produce telemetría vs qué impide un ataque |
| 04 Ingesta | 1125 | flujo de origen → conector → normalización → destino |
| 05 Almacenamiento y retención | 1369 | coste, retención y búsqueda |
| 06 Threat Intelligence | 1547 | indicadores y enriquecimiento |
| 07 Detección y alertas | 1601 | lógica de reglas, alertas y calidad |
| 08 Correlación e incidentes | 1880 | agrupar señales y crear un caso investigable |
| 09 Investigación | 1987 | pivotes, entidades, evidencias |
| 10 Hunting | 2105 | hipótesis, búsqueda y conservación de hallazgos |
| 11 Respuesta y remediación | 2236 | contención, verificación y trazabilidad |
| 12 Automatización | 2390 | reglas, playbooks y ejecución |
| 13 Mapa de tablas y relaciones KQL | 2517 | esquemas, uniones, operadores y consultas |

**Criterio:** estos encabezados y sus líneas están verificados en el archivo aportado; la cantidad de 76 lecturas y 719 pasos proviene del informe de implementación de la academia compartido por el usuario, **no** de la inspección del repositorio desde esta sesión.

## 3. Correspondencias iniciales SC-200 ↔ Splunk

Clasificación: **CF** cercana funcional; **PAR** parcial; **DIF** mismo objetivo pero otra arquitectura; **NE** sin equivalente directo. Corresponden a finalidades educativas, no prometen paridad de licencias/productos.

| SC-200 | Concepto Splunk a enseñar | Clase | Advertencia indispensable |
|---|---|---|---|
| 01 Licencia y onboarding | Splunk Enterprise / Cloud / ES, instalación, incorporación de fuentes y recopilación | PAR | Un *forwarder* no es una licencia; ES es producto distinto |
| 02 Permisos y RBAC | Roles, capabilities, permisos sobre índices, objetos y apps | DIF | Azure/Unified RBAC no equivalen a Splunk RBAC |
| 03 MDE / MDI / MDO / MDCA / Purview | Ingesta y análisis de señales generadas por esos productos y otros controles | NE | Splunk no reemplaza EDR/XDR/antimalware/DLP solo por recibir sus logs |
| 04 Ingesta | Inputs, Universal/Heavy Forwarder, HEC, sourcetype, parsing, props/transforms | CF | La arquitectura de DCR/AMA difiere |
| 05 Retención | Índices, buckets, hot/warm/cold/frozen, políticas y coste de plataforma | PAR | No asumir equivalencia de tiers con Sentinel Data Lake |
| 06 TI | IOC, lookups, enriquecimiento y TI integrada en ES cuando disponible | PAR | Las capacidades varían con producto |
| 07 Detección | Alertas/saved searches de plataforma; detecciones ES basadas en eventos/findings | PAR | Saved search en Enterprise no implica el flujo completo ES |
| 08 Incidentes | Findings, finding groups, investigaciones/Mission Control en ES | PAR | No adjudicar Mission Control a Splunk Enterprise base |
| 09 Investigación | Búsqueda SPL, pivotes de entidades, cronologías y evidencia | CF | La correlación depende de campos y datos disponibles |
| 10 Hunting | Hipótesis, secuencias y búsquedas SPL, MITRE/ES opcional | CF | No se necesita una alerta previa |
| 11 Respuesta | Alert actions, integraciones, SOAR y respuesta manual | PAR | Splunk no proporciona automáticamente todas las acciones de Defender |
| 12 Automatización | Scheduled searches, alert actions, APIs, Splunk SOAR playbooks | PAR | SOAR requiere integración/producto/entorno apropiado |
| 13 Relaciones KQL | SPL/SPL2, eventos/índices/sourcetypes, CIM, lookups, stats, join, tstats | DIF | Splunk no comparte nativamente el esquema de tablas XDR |

### Puentes prioritarios para el aprendizaje

1. **Cap. 04 → Ingesta Splunk:** partir del flujo DCR/AMA hacia Windows Security Events; explicar el equivalente funcional de recibir Windows Event Logs mediante forwarders, definir sourcetype, parsear y almacenar en un índice.
2. **Cap. 13 → Exploración SPL:** partir de `SigninLogs`, `DeviceLogonEvents` y `SecurityEvent`; enseñar campos efectivamente presentes en cada origen (`_time`, `host`, `source`, `sourcetype`, `index` y campos extraídos).
3. **Cap. 07 → Detección:** comparar KQL Analytics Rule con saved searches/alertas de plataforma, y de manera separada detecciones Enterprise Security.
4. **Cap. 08–10 → SOC N1/N2:** utilizar una hipótesis y correlación por usuario/IP/tiempo. No inferir causalidad de mera coincidencia temporal.
5. **Cap. 02, 05, 12 → Gobierno:** privilegios de lectura, retención y automatización con separación clara entre Splunk Enterprise, ES y SOAR.

## 4. Propuesta curricular — una aventura Splunk independiente

**Etiquetas**: P0 esencial para SOC N1/N2; P1 profundización profesional; P2 especialización avanzada. Los ID se proponen nuevos, aún no están vinculados a la academia actual.

| Región ID | Mundo/tema | Lecciones o módulos propuestos (sin fijar número final) | Prioridad | Dependencia |
|---|---|---|---|---|
| SP-R01 | Puerto de Splunk: mapa de la plataforma | familias de producto; interfaz; indexer/search head; eventos y campos; índices | P0 | ninguna |
| SP-R02 | Río de Telemetría | fuentes, input, forwarders, HEC, sourcetype, timestamps, troubleshooting | P0 | R01 |
| SP-R03 | Bosque SPL I | búsquedas, `index`, tiempo, campos, `table`, `sort`, `where`, `eval`, `rex` | P0 | R01–R02 |
| SP-R04 | Laboratorio de SPL II | `stats`, `timechart`, `bin`, `eventstats`, `streamstats`, joins/subsearches, optimización | P0 | R03 |
| SP-R05 | Valle de Normalización | extracción, alias, tags/eventtypes, lookups, CIM, modelos de datos, `tstats` | P0/P1 | R02–R04 |
| SP-R06 | Centro SOC: triage e investigación | analizar alertas, pivotar por entidades, timelines, evidencias, informe N1 | P0 | R03–R05 |
| SP-R07 | Fábrica de Detecciones | saved searches y alertas de Enterprise; ingeniería de detección, validación, MITRE, tuning | P0/P1 | R04–R06 |
| SP-R08 | Cordillera de Threat Hunting | hipótesis, correlaciones, Kerberoasting/DCSync defensivo, pruebas y cobertura | P1 | R06–R07 |
| SP-R09 | Torre Enterprise Security | findings, Mission Control, investigations, RBA, amenazas/analista; **solo si ES** | P1/P2 | R06–R08 |
| SP-R10 | Fortaleza Administradora | configuración, RBAC, TLS, retención, rendimiento, despliegues distribuidos, clustering | P2 | R02–R05 |
| SP-R11 | Cumbre de Automatización | APIs, integraciones, alert actions y Splunk SOAR/playbooks cuando proceda | P2 | R07–R10 |

**Itinerario rápido SOC N1/N2:** R01 → R02 → R03 → R04 → R05 básico → R06 → R07 básico. La especialización posterior puede ramificarse hacia hunting, ES, administración o automatización.

No dar por terminada una región solo con lectura: cada una debe incorporar preguntas de comprensión, consultas SPL y una prueba práctica relevante; en temas de producto premium debe existir alternativa conceptual/offline honesta.

## 5. Cuatro prácticas iniciales derivadas del capítulo 13

| Caso | Patrón ya existente en SC-200 | Ejercicio Splunk propuesto | Estado |
|---|---|---|---|
| Detección de spray | `SigninLogs` + `dcount(UserPrincipalName)` por IP y ventana de 15 minutos | Contar usuarios distintos con autenticaciones fallidas, agrupados por IP/tiempo, tras verificar campos/normalización | Diseño, NO ejecutado |
| Alerta → evidencias | `AlertInfo` unido a `AlertEvidence` mediante `AlertId` | Investigar alertas y sus registros originales usando identificadores reales disponibles en los índices | Diseño, NO ejecutado |
| Clic → proceso | `UrlClickEvents` + `DeviceProcessEvents` y correlación temporal de 10 minutos | Buscar asociación temporal entre evento de correo y proceso, sin afirmar causalidad | Diseño, NO ejecutado |
| Inventario reciente | `DeviceInfo` + `arg_max(Timestamp,*)` | Identificar el evento más reciente por dispositivo a través de SPL (`stats`/`eventstats`, según semántica real) | Diseño, NO ejecutado |

### Ejemplo ilustrativo (no validado con el laboratorio)

Patrón del archivo SC-200: `SigninLogs | where ResultType == "50126" | summarize Cuentas=dcount(UserPrincipalName), Intentos=count() by IPAddress, bin(TimeGenerated, 15m) | where Cuentas>=5`, con ventana de 24 h.

Una posible aproximación **SPL clásico** usando campos genéricos ya normalizados podría ser:

```spl
index=<INDICE_DE_AUTENTICACION> earliest=-24h action=failure
| bin _time span=15m
| stats dc(user) AS Cuentas count AS Intentos by src _time
| where Cuentas>=5
| sort - Cuentas
```

**ATENCIÓN:** `<INDICE_DE_AUTENTICACION>` es un marcador; `action`, `user` y `src` solo funcionarán si la fuente realmente tiene esos campos normalizados, por ejemplo según el modelo `Authentication` de CIM. El criterio de fracaso no equivale automáticamente al código `50126` de Entra: hay que definir la semántica de cada fuente. La agrupación puede diferir por huso horario, ventanas y tiempo de evento; no está comprobada la equivalencia numérica. No presentar resultados hipotéticos como datos reales.

## 6. Identificadores y modelo de trazabilidad propuesto

**NO tocar ID de SC-200.** Mantener las claves ya utilizadas por la app. Asignar IDs permanentes específicos de Splunk:

- `splunk:r01` (región), `splunk:r01:m01` (módulo), `splunk:r01:m01:l01` (lección), `splunk:r01:m01:l01:a01` (actividad).
- Una tabla de enlaces SC-200 ↔ Splunk, separada del progreso: `{sourceRef, targetId, relationType, evidenceLinks, reviewedAt, confidence, productScope}`.
- `sourceRef` debería conservar un ID de lectura de la academia; mientras no se inspeccione su código, utilizar `SC-200.md#...` o referencia a líneas de documento como soporte provisional, **sin atribuirse IDs de app no observados**.
- Para contenido técnico: `{product, versionContext, officialUrl, verifiedAt, validationStatus, environmentRequirements}`.
- No cargar el progreso de Splunk sobre las claves LocalStorage de SC-200 sin migración explícita y pruebas.

## 7. Riesgos y lagunas detectadas

1. **Dependencia ES:** la academia no debe prometer acceso al flujo de *Mission Control* si el entorno disponible solo tiene Splunk Enterprise.
2. **SPL2:** no enseñarlo como si fuese un alias intercambiable de SPL clásico; controlar versión/producto/sistema operativo y sintaxis.
3. **CIM:** CIM sirve para normalización mediante conocimientos/modelos, pero no transforma por arte de magia una tabla Microsoft en un índice Splunk.
4. **Datos y tiempo:** `_time` corresponde al tiempo del evento (según parsing); `_indextime` mide llegada al índice. No equiparar ambos automáticamente con `TimeGenerated`/`Timestamp`/`ingestion_time()`.
5. **Detección vs protección:** ingesta de telemetría de MDE/MDO/MDI/Entra ≠ capacidades preventivas o de remediación equivalentes a esos productos.
6. **Acceso al laboratorio:** no inspeccionado desde esta conversación. Versiones, datasets, sourcetypes e índices reales necesitan confirmación desde un entorno autorizado, pero NO son un requisito para diseñar el currículo.
7. **Evaluación:** no se puede certificar capacidad profesional por XP o número de páginas; diseñar rúbricas de hipótesis, consulta, evidencia, falsos positivos y reproducibilidad.
8. **Calidad futura:** los ejemplos derivados de archivos personales necesitan revisión con documentación oficial si dependen de interfaces y licencias cambiantes.

## 8. Plan de investigación por bloques (antes de implementar)

**Bloque 1 — Prioridad inmediata:** R01–R03 (arquitectura, ingesta, SPL básico). Entregar mapa de lecciones, glosario, bibliografía y ejemplos auditados.

**Bloque 2:** R04–R05 (agregación, normalización, CIM). Definir esquemas, comparaciones KQL/SPL y pruebas offline basadas en datasets controlados.

**Bloque 3:** R06–R07 (SOC N1/N2, detecciones). Definir rúbricas de triage, investigación, generación de informes y validación de búsquedas.

**Bloque 4:** R08–R09 (hunting y ES). Distinguir funciones premium, diseñar prácticas conceptuales cuando no haya ES.

**Bloque 5:** R10–R11 (administración, SOAR y arquitectura). Ampliar después de completar el itinerario SOC prioritario.

Cada bloque debe pasar por una revisión técnica adversarial: documentación → propuesta → detectar errores/omisiones → nuevas fuentes → corrección → decisión. No más de cinco ciclos por bloque inicialmente; detener si no aparece nueva evidencia útil.

## 9. Fuentes oficiales consultadas (selección)

Revisadas el **16/10/2026**, sin pruebas de ejecución local:

1. Splunk, *Splunk Enterprise Security 8.7 — Get started*, detecciones y Mission Control: https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/introduction/get-started-with-splunk-enterprise-security
2. Splunk, *Splunk Enterprise Security 8.7 — Detections*: https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/use-detections-to-search-for-threats-in-splunk-enterprise-security
3. Splunk, *Splunk Enterprise Security 8.7 — RBA*: https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/mission-control/analyze-risk-with-risk-based-alerting-in-splunk-enterprise-security
4. Splunk, *Common Information Model — overview*: https://help.splunk.com/en/data-management/common-information-model/5.1/introduction/overview-of-the-splunk-common-information-model
5. Splunk, *SPL2 — introduction*: https://help.splunk.com/en/splunk-enterprise/search/spl2-search-reference/introduction/introduction
6. Splunk, *SPL/SPL2 — diferencias*: https://help.splunk.com/en/splunk-enterprise/search/spl2-overview/specific-differences-between-spl-and-spl2
7. Splunk, *SPL2 — productos/superficies compatibles*: https://help.splunk.com/en/splunk-enterprise/search/spl2-overview/where-can-i-use-spl2
8. Splunk, *10.6 data pipeline/configuración*: https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/administer-splunk-enterprise-with-configuration-files/configuration-parameters-and-the-data-pipeline
9. Splunk, *10.6 tiempo de evento y tiempo de indexación*: https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.6/time-format-variables-and-modifiers/time-modifiers
10. Splunk, *Certificaciones vigentes*: https://www.splunk.com/en_us/training/certification.html
11. Splunk, *Rutas de formación*: https://www.splunk.com/en_us/training/learning-paths-certifications.html
12. Splunk, *Optimización de búsquedas*: https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.6/optimize-searches/quick-tips-for-optimization
13. Splunk, *ES 8.x limitaciones*: https://help.splunk.com/en/splunk-enterprise-security-8/release-notes-and-resources/8.4/splunk-enterprise-security-release-notes/limitations

## 10. Siguientes decisiones

- **Aprobar o cambiar la macroestructura** de 11 regiones propuestas antes de diseñar cientos de lecciones.
- **Inspeccionar la estructura final de la academia** cuando se solicite integración; no hay acceso a `/home/tommy/Documentos/...` desde este ChatGPT.
- **Profundizar en el Bloque 1** y producir guías técnicas, actividades evaluables y ejercicios con estado de verificación explícito.
- **Validar consultas en Splunk real después**, cuando el usuario autorice una fase práctica; evitar fingir datos observados.

**Conclusión:** fase 1 proporciona un mapa curricular y puentes SC-200 ↔ Splunk sustentados inicialmente en fuentes oficiales. No proporciona todavía las 76 correspondencias lectura-a-lectura ni una validación de laboratorios; esas tareas requieren más trabajo y/o acceso a la representación real de la academia.
