# Solucionario editorial sincronizado — SPLUNK_LECCIONES_R08_R09

**Política educativa aprobada:** teoría autocorregible con umbral del 80 %; práctica abierta formativa, sin calificación automática ni premio de dominio práctico. Aprobar teoría no acredita dominio práctico de Splunk. La revisión humana independiente del contenido y la ejecución real siguen pendientes.

Respuestas orientativas; sin ejecución de Splunk/ES/SOAR.

## SP-R08-L01-Q01

**A — Definir qué se observará y qué condiciones refutarían la hipótesis, incluyendo una alternativa benigna**. La hipótesis especifica qué evidencia podría apoyarla o contradecirla.

## SP-R08-L01-Q02

**C — No es posible descartar la actividad con esa fuente ausente**. Ausencia de datos no equivale a ausencia de actividad.

## SP-R08-L01-P01

Hipótesis: aumento atípico de servicios por solicitante en DC con datos 4769; definir período UTC, campo equivalente al solicitante, normalidad por cuenta y mantenimiento. Si no hay datos de DC o se ignora el esquema, clasificar indeterminado; escalar solo con corroboración.

## SP-R08-L02-Q01

**A — Petición observada de ticket de servicio**. No prueba que el ticket se haya roto offline.

## SP-R08-L02-Q02

**C — La diversidad de servicio por solicitante, verificando qué significa ese campo en la fuente observada**. Se necesita cardinalidad de servicios, no solo número de filas.

## SP-R08-L02-P01

K01–K06: 6 TGS y 6 nombres de servicio, RC4; priorizar indagación. K07–K11: 5 TGS y 1 servicio, cuenta de backup documentada; priorizar control benigno. K12–K15: 4 servicios con AES, evaluar baseline; no clasificar malicioso solo por variedad.

## SP-R08-L03-Q01

**D — Auditoría de Directory Service Access y SACL adecuada**. El evento depende de política de auditoría y acceso a objetos auditados.

## SP-R08-L03-Q02

**A — Origen no autorizado + derechos de replicación + corroboración**. Se requieren origen, permiso, contexto y señales convergentes.

## SP-R08-L03-P01

Se observa origen WKST-17, cuenta temporal y replicación normalizada en el fixture; no figura en inventario autorizado. Verificar GUID, auditoría/SACL, red RPC al DC, origen técnico y permisos. Estado: sospecha priorizada, no extracción confirmada.

## SP-R08-L04-Q01

**C — La distribución entre identidades frente a intentos concentrados en una cuenta, dentro de una ventana**. Spraying distribuye intentos entre varias cuentas.

## SP-R08-L04-Q02

**B — Hipótesis que requiere MFA, origen y contexto**. La sucesión temporal no prueba relación causal ni abuso.

## SP-R08-L04-P01

S01–S06: seis fallos y seis cuentas desde 198.51.100.33 en el bucket 11:00 UTC; candidato no confirmado. B01–B05: cinco fallos globales de una cuenta; por buckets son cuatro/una a 11:00 y uno/una a 11:15. Ninguna regla >=5 fallos por bucket selecciona esa segunda cohorte. No inferir benignidad de no coincidencia; corroborar IdP, MFA y contexto.

## SP-R08-L05-Q01

**D — Relación temporal entre acceso remoto y acciones verificadas en nuevo host**. El análisis multifuente reduce falsas asociaciones.

## SP-R08-L05-Q02

**B — Que el movimiento sea malicioso**. El acceso legítimo también cambia entre equipos.

## SP-R08-L05-P01

Usar identidad canónica dominio\usuario, tiempos normalizados, tipo de logon, origen, host destino, inventario, agentes EDR y aprobaciones; evitar un join incondicional por username.

## SP-R08-L06-Q01

**A — Rol de activo, destinatario, baseline y cambio autorizado**. Volumen sin contexto produce falsos positivos.

## SP-R08-L06-Q02

**B — Exfiltración de datos confidenciales**. El contenido y propósito no se desprenden del volumen.

## SP-R08-L06-P01

backup-01: 865 MB decimales al destino aprobado 203.0.113.10 (850+15). finance-07: 210 MB totales; 190 MB al destino desconocido 203.0.113.99 y 20 MB al portal aprobado 203.0.113.20. Priorizar la salida desconocida de finance-07 por contexto, sin afirmar exfiltración. Ver proceso, identidad, DLP, baseline y cambios aprobados.

## SP-R08-L07-Q01

**D — Hipótesis, fuentes, pruebas y limitaciones**. La cobertura exige requisitos verificables y una evidencia.

## SP-R08-L07-Q02

**B — Diseño/documentación, sin ejecución real**. La revisión documental no equivale a ejecutar la analítica.

## SP-R08-L07-P01

T1558.003: 4769 + baseline; no observa cracking offline. T1003.006: auditoría 4662/SACL y red RPC; faltan eventos si no hay SACL. T1110.003: logs IdP/DC + diversidad usuarios por origen; evasión low-and-slow y NAT.

## SP-R08-L08-Q01

**D — Con fuente, ejemplos, contraejemplos, propietario y respuesta especificados**. La operacionalización exige evaluación y ciclo de vida.

## SP-R08-L08-Q02

**C — Splunk Enterprise Security en configuración soportada**. Los findings son del flujo ES, no de toda búsqueda base.

## SP-R08-L08-P01

Entrada 4769 validada, agregación por identidad/servicio/ventana, caso K01–K06 positivo provisional, backup caso benigno, cifrado faltante indeterminado; runbook incluye cobertura DC, identidad, baseline, mantenimiento y aprobación de despliegue.

## SP-R09-L01-Q01

**B — A la plataforma Enterprise o Cloud: buscar índices es una función de plataforma y no exige ES por sí sola**. La plataforma soporta búsqueda aunque ES no esté instalado.

## SP-R09-L01-Q02

**C — Que Mission Control y analyst queue estén disponibles**. Mission Control forma parte del flujo ES, no del producto base sin comprobación.

## SP-R09-L01-P01

Forwarder/HEC e indexer/search head: plataforma; detección/findings/Mission Control: ES; acción playbook e integración con terceros: SOAR, con app, permiso, pairing y human-in-loop cuando sea disruptivo.

## SP-R09-L02-Q01

**C — Eventos o datos de entrada que satisfacen una condición analítica y pueden producir la salida configurada**. La entrada es evidencia de evento según el caso.

## SP-R09-L02-Q02

**A — Se cumplió condición analítica y se creó un objeto investigable**. El finding requiere triage y contexto adicional.

## SP-R09-L02-P01

Origen IdP/auth, 5 cuentas/15m ejemplo; resultado finding/intermediate según diseño, keys src/usuarios/tiempo, evidencia y excepciones NAT. Revisión N1 antes de cualquier respuesta automática.

## SP-R09-L03-Q01

**B — Findings o intermediate findings previos y su contexto, para relacionarlos mediante criterios explícitos**. Se construye sobre hallazgos analíticos previos.

## SP-R09-L03-Q02

**A — NAT y proxy pueden fusionar sujetos diferentes bajo la misma IP; la clave no identifica por sí sola al actor**. Una clave de agrupación no siempre identifica persona o activo.

## SP-R09-L03-P01

entity canónica + tenant/domain es más robusta que src aislado; añadir ventana e identificación de fuente. Separar casos de distintos activos y evitar umbrales de riesgo como prueba de culpabilidad.

## SP-R09-L04-Q01

**D — 75 % de probabilidad validada de ataque**. El score no está calibrado como probabilidad.

## SP-R09-L04-Q02

**C — Ventana, deduplicación y peso por detección**. El diseño de agregación determina la puntuación.

## SP-R09-L04-P01

alice=75 (3 registros), svc-backup=36 (2), bob=22 (1), charlie=15 (1), sys-rproxy=20 (1). Solo alice supera 60; eso demuestra la matemática del CSV, no el cálculo interno de ES ni compromiso.

## SP-R09-L05-Q01

**D — Priorizar y gestionar hallazgos/investigaciones**. Es un espacio de operación SOC sobre findings.

## SP-R09-L05-Q02

**B — Evidencia, razonamiento y decisión reproducible**. La trazabilidad es esencial para auditoría y relevo.

## SP-R09-L05-P01

Entidad alice y señales heterogéneas; revisar identidad/tiempo, autenticación, endpoint y excepciones, propietario N1 y posible escalado N2. El CSV no demuestra ataque.

## SP-R09-L06-Q01

**B — IDs de evidencia, consultas, ventana y decisiones**. La trazabilidad permite revalidar cada paso.

## SP-R09-L06-Q02

**A — Indeterminado por datos insuficientes con acciones de mejora**. La ausencia de información puede impedir una conclusión categórica.

## SP-R09-L06-P01

IDs F01/F02/F03 y tiempos UTC; hipótesis de sesión inusual, fuentes auth/endpoint, limitación proxy y baseline. Cierres: benigno corroborado por cambio, o indeterminado sin auditoría; agregar acciones y responsable.

## SP-R09-L07-Q01

**D — Fecha de expiración pasada**. La vigencia del indicador es relevante para interpretar el match.

## SP-R09-L07-Q02

**A — Toda lista CSV muestra automáticamente TI Cloud en Intelligence**. La vista Intelligence tiene requisitos de TIM Cloud específicos.

## SP-R09-L07-P01

A referencia fija 2026-10-16T12:00:00Z, usar inicio inclusivo y expiración exclusiva a medianoche UTC. I01 e I03 son vigentes; I02 está caducado. Con igualdad value=dest, N01/N04 coinciden con I03 y N02 con I01; N03 no tiene match. confidence_note describe datos inventados, no confianza numérica. Revisar contexto sin bloquear nada ni afirmar TI real.

## SP-R09-L08-Q01

**D — Aprobación humana de operador autorizado y evidencias**. El riesgo operativo exige autorización y protección contra falsos positivos.

## SP-R09-L08-Q02

**C — Compatibilidad de versión, roles, apps y configuración real**. No es una integración implícita ni universal.

## SP-R09-L08-P01

Trigger finding; step 1 recopilar eventos read-only; step 2 TI y validación de identidad; decision caso y aprobación expresa para cambios; step 3 acción opcional por operador; step 4 auditoría/rollback; si falla contexto o autorizaciones no cambiar nada.

