# Solucionario editorial sincronizado — SPLUNK_LECCIONES_R06_R07

**Política educativa aprobada:** teoría autocorregible con umbral del 80 %; práctica abierta formativa, sin calificación automática ni premio de dominio práctico. Aprobar teoría no acredita dominio práctico de Splunk. La revisión humana independiente del contenido y la ejecución real siguen pendientes.

Respuestas orientativas; sin ejecución de Splunk/ES/SOAR.

## SP-R06-L01-Q01

**B — Que la condición coincidió con los datos disponibles en esa ejecución; su significado requiere triage**. Una alerta registra coincidencia de condiciones, no una conclusión forense.

## SP-R06-L01-Q02

**C — La consulta y su revisión, el rango temporal y los IDs de eventos permiten reconstruir la observación**. La reproducibilidad necesita evidencia y parámetros verificables.

## SP-R06-L01-P01

Al snapshot anterior a 09:16 UTC, A001–A006 son seis fallos para seis cuentas y A007 es éxito de bob a 09:08. El evento tardío A021 ocurrió a 09:04 pero llegó a 09:24: retrospectivamente son siete fallos y seis cuentas. Estado: anomalía a investigar, sin compromiso demostrado. Registrar ambos tiempos y pedir identidad del cliente, contexto de IP y corroboración.

## SP-R06-L02-Q01

**B — Una clave de agrupación compartida que necesita contexto de traducción e identidad para atribuir actividad**. IP compartida agrega tráfico de múltiples orígenes.

## SP-R06-L02-Q02

**A — Un metadato cuyo significado depende de la fuente y configuración**. host es un metadato de evento, no una atribución forense universal.

## SP-R06-L02-P01

Tabla bob: buscar 4625/4624 por user+src+ventana; comprobar host origen, VPN/proxy, dispositivo administrado y segundo factor. La relación temporal no demuestra control de cuenta.

## SP-R06-L03-Q01

**C — En el controlador de dominio que actúa como KDC, bajo las condiciones de auditoría correspondientes**. 4769 surge en KDC ante solicitudes de ticket de servicio y depende de auditoría.

## SP-R06-L03-Q02

**A — Una operación registrada sobre un objeto auditado que requiere más contexto**. 4662 por sí solo no clasifica replicación maliciosa.

## SP-R06-L03-P01

4625 intento fallido; 4624 logon exitoso, no atribución; 4769 solicitud TGS en DC, no offline cracking; 4662 operación de objeto auditada, no DCSync confirmado. Cada uno requiere auditoría habilitada y contexto.

## SP-R06-L04-Q01

**D — _indextime - _time: diferencia entre indexación y tiempo de evento, que aún requiere contexto**. La diferencia mide retraso observado, con posibles desajustes de timestamp.

## SP-R06-L04-Q02

**A — Sí, si el evento ha sido indexado y se consulta su _time adecuado**. El evento llega tarde pero puede ser consultable con su timestamp de ocurrencia.

## SP-R06-L04-P01

A001 09:01 → index 09:01:10 (10s); A007 09:08 → 09:08:12 (12s); A021 09:04 → 09:24 (1200s). Evento tardío: controlar solapamiento ventanas, deduplicación y cobertura.

## SP-R06-L05-Q01

**D — Alcance exacto, propietario, justificación y expiración**. Limitar excepciones ayuda a evitar puntos ciegos permanentes.

## SP-R06-L05-Q02

**C — No, es otra distribución y puede tener otras causas**. Spraying se refiere a intentos sobre numerosas cuentas; se requiere considerar ventana y baseline.

## SP-R06-L05-P01

A008–A012: cinco fallos de svc-batch desde 203.0.113.15; inventario confirma mantenimiento programado, que necesita correlación documental. Excepción solo para esa cuenta/host/franja temporal, con dueño, ticket y revisión.

## SP-R06-L06-Q01

**A — Un inicio exitoso posterior necesita corroboración**. Hecho y atribución requieren niveles distintos de evidencia.

## SP-R06-L06-Q02

**D — Referencias de eventos, ventana, consulta y limitaciones**. Sin trazabilidad otro analista no puede reproducir.

## SP-R06-L06-P01

Informe: alerta/búsqueda; 09:01–09:08Z; A001–A007; 6 fallos de 6 usuarios y éxito de bob; hipótesis spraying; alternativas compartición IP y pruebas legítimas; no hay prueba de control de bob; solicitar segundo factor, host cliente y actividad posterior; decisión investigar/escalar según criticidad.

## SP-R06-L07-Q01

**B — Inconclusa por visibilidad insuficiente**. La falta de telemetría limita la conclusión.

## SP-R06-L07-Q02

**C — Documentar y recomendar escalado autorizado**. Separación de roles y autorización protege la operación.

## SP-R06-L07-P01

Escalar si privilegios/impacto alto, éxito extraño corroborado u otras señales independientes; continuar si faltan pivotes disponibles sin urgencia; inconcluso si cobertura imposibilita descartar/confirmar. Siempre conservar evidencia.

## SP-R06-L08-Q01

**D — Entró un evento tardío tras la primera ejecución**. El registro A021 tiene _time temprano e ingesta tardía.

## SP-R06-L08-Q02

**B — Cálculos sobre la fixture y razonamiento documentado**. La evidencia offline no demuestra una intrusión real.

## SP-R06-L08-P01

Seis fallos distintos al corte temprano (A001–A006), éxito A007 para bob; A021 es un séptimo fallo que ocurrió 09:04 pero llegó 09:24. Al leer el dataset completo hay 7 fallos de 6 cuentas. Separar ambos cortes es esencial. El contexto svc-batch favorece mantenimiento, pero no cierra sin corroboración.

## SP-R07-L01-Q01

**A — Hipótesis, telemetría, ventana y criterio con resultado esperado, antes de escoger operadores o umbrales**. El contrato de detección comienza por el comportamiento y sus fuentes.

## SP-R07-L01-Q02

**B — Pueden separar ráfagas próximas al borde**. Las ventanas discretas no equivalen a un sliding window.

## SP-R07-L01-P01

Fuente 4625, user/src verificables, ventana 15m, mínimo 5 fallos/5 cuentas por IP, salida con IDs, baseline y excluidos documentados; positivos A001–A006, negativo svc-batch; inconcluso si no hay user o cobertura del sensor.

## SP-R07-L02-Q01

**C — Reducir notificaciones repetidas según clave y duración; no cambia qué eventos cumplen la búsqueda**. Supresión no modifica la calidad de datos.

## SP-R07-L02-Q02

**D — Trigger evalúa resultados y schedule define ejecución**. Configuración de ejecución y de activación son controles separados.

## SP-R07-L02-P01

Ejemplo: cada 5m, ventana 20m, trigger por fila, clave src+bucket (si campos existen), revisar impacto de delay y no suprimir agravamiento; no basta con throttle global por IP durante un día.

## SP-R07-L03-Q01

**C — Un patrón anómalo de solicitudes TGS y servicios, corroborado con contexto Kerberos y baseline**. Kerberoasting requiere evidencias vinculadas a solicitudes TGS y contexto de servicios.

## SP-R07-L03-Q02

**D — Comparar el comportamiento observable y sus evidencias con la definición de la técnica, sin sobreclasificar**. Un código ATT&CK clasifica conducta observada bajo supuestos.

## SP-R07-L03-P01

Spraying: múltiples usuarios y fallos desde un origen en ventana definida, como hipótesis T1110.003. Kerberoasting: solicitudes TGS 4769, diversidad observable de servicios y contexto, como hipótesis T1558.003. ServiceName no acredita un SPN completo; RC4 no prueba ataque y AES no lo descarta. Revisar versión/parches, auditoría del DC y esquema de eventos. No añadir identificadores de evento no documentados.

## SP-R07-L04-Q01

**C — Inconcluso / no evaluable para esa regla**. No se puede determinar ausencia de conducta con visibilidad insuficiente.

## SP-R07-L04-Q02

**A — TP/(TP+FN)**. Recall caracteriza proporción de positivos verdaderos detectados.

## SP-R07-L04-P01

Separar salida analítica de verdad del caso. 198.51.100.23 coincide con ambas reglas, pero suspicious_unconfirmed no acredita TP ni permite calcular recall. svc-batch tiene contexto benigno: count>=5 produce FP didáctico; al exigir cinco cuentas no coincide y sirve de TN respecto a ese contexto simulado. NAT 192.0.2.44 no coincide, pero su etiqueta inconclusive impide contarlo como TN. Casos sin datos quedan no evaluables. TP/FN y métricas con denominador desconocido permanecen pendientes; las fórmulas pueden estudiarse con verdad teórica explícita separada.

## SP-R07-L05-Q01

**A — Reducción de ruido manteniendo detección positiva en set independiente**. Calidad exige controlar FN y cobertura, no solo volumen.

## SP-R07-L05-Q02

**B — El detector deja de contar usuarios, bajando resultados**. Un campo ausente puede ocultar actividad y producir FN.

## SP-R07-L05-P01

Nuevo detector cardinalidad cuentas>=5; comparar cohorte sospechosa y mantenimiento antes/después; vigilar por ingestión/campos nulos; mantener rollback y revisión a dos semanas; no suprimir toda IP.

## SP-R07-L06-Q01

**D — No, es un indicador didáctico del search pipeline**. RBA es un conjunto de capacidades y entidades específico de Enterprise Security.

## SP-R07-L06-Q02

**B — Fusionar señales de sujetos diferentes**. Entidad compartida no identifica necesariamente a una sola persona o dispositivo.

## SP-R07-L06-P01

Ejemplo: cohorte spraying=30; éxito posterior por misma IP=20; score 50, no probabilidad; la entidad IP tiene riesgo de agregación NAT. RBA auténtico exige ES instalado/configurado, normalización de entidades y detecciones/finding-based correspondientes.

## SP-R07-L07-Q01

**A — Campos user ausentes tras cambio de extracción**. Una regresión de datos puede inutilizar el umbral.

## SP-R07-L07-Q02

**C — SPL, configuración, excepciones, dependencias y pruebas por versión**. Rollback reproducible incluye lógica y configuración asociada.

## SP-R07-L07-P01

Checklist: motivo/version/owner, SPL, índices/sourcetypes, campos, muestras, TP/TN/FN, nulos, latencia, permisos, supresión, seguimiento y rollback; drift: tasa null, volumen anormal y cambios en parser.

## SP-R07-L08-Q01

**B — Marcar todo RC4 como ataque**. RC4 existe también en operaciones legítimas; necesita contexto.

## SP-R07-L08-Q02

**D — Solicitud de ticket de servicio con ese cifrado si campo correcto; no cracking confirmado**. El ticket solicitado no prueba fuerza bruta offline ni control de credenciales.

## SP-R07-L08-P01

Solo RC4: marcaría también svc-backup (FP); TGS>=5: marcaría mantenimiento de un SPN (FP); diversidad>=5: identifica cohorte K001–K006, pero no cubre K012–K015 (4 SPNs AES, categoría “sospecha didáctica sin confirmación”, no etiquetar automáticamente FN si no existe ground truth de ataque). K016 no evaluable para filtro cifrado. Combinar volumen, baseline, cifrado y evidencia independiente.

