# Solucionario editorial sincronizado — SPLUNK_LECCIONES_R10_R11

**Política educativa aprobada:** teoría autocorregible con umbral del 80 %; práctica abierta formativa, sin calificación automática ni premio de dominio práctico. Aprobar teoría no acredita dominio práctico de Splunk. La revisión humana independiente del contenido y la ejecución real siguen pendientes.

Respuestas orientativas; sin ejecución de Splunk/ES/SOAR.

## SP-R10-L01-Q01

**D — La configuración fusionada de la instancia consultada y el archivo de procedencia de sus parámetros**. Permite inspeccionar el valor efectivo de ficheros .conf y su procedencia; no sustituye pruebas del pipeline.

## SP-R10-L01-Q02

**B — Pueden sobrescribirse al actualizar una app o el producto**. La personalización en `local/` evita perder cambios al actualizar distribuciones.

## SP-R10-L01-P01

Registrar instancia, responsabilidad de parsing, fichero, contexto, ruta ganadora btool, versión de app y prueba de campo después de aprobación. No se puede concluir por inspeccionar un nodo distinto.

## SP-R10-L02-Q01

**C — Se mantienen privilegios agregados, por lo que hay que revisar todos los roles**. La herencia/roles múltiples pueden ampliar permisos; verificar acceso efectivo.

## SP-R10-L02-Q02

**B — Que no pueda modificar los objetos administrativos no autorizados**. Una prueba negativa verifica explícitamente una operación que el rol debe denegar.

## SP-R10-L02-P01

Permitir índices del ejercicio y búsquedas acotadas; negar delete/collect/outputlookup no autorizado, administración, cambios alert actions y acceso a índices sensibles; comprobar herencia/PII y audit logs.

## SP-R10-L03-Q01

**A — Validar hostname y cadena de confianza**. La validación de confianza e identidad del servidor previene aceptar extremos no autorizados.

## SP-R10-L03-Q02

**C — Usar -k como solución permanente a problemas de certificados**. -k omite comprobaciones de identidad y facilita ataques de intermediario.

## SP-R10-L03-P01

Certificados y CA apropiados, SAN/hostname, ciclo de rotación, auditoría, gestión de claves y tokens acotados. Ninguna prueba debe requerir exponer secretos ni desactivar la validación.

## SP-R10-L04-Q01

**C — El límite de tamaño del índice puede provocar congelación antes del plazo temporal previsto**. El límite de tamaño puede actuar antes del plazo cronológico.

## SP-R10-L04-Q02

**B — Estimación de capacidad bajo un modelo simplificado**. El cálculo aproxima la capacidad, pero no modela rotación completa, compresión ni replicación.

## SP-R10-L04-P01

Calcular `estimated_days=capacity_gib/daily_gib`; comparar con target_days; verificar archivado. Distinguir estimación y retención comprobada, mencionar dependencia de buckets, arquitectura y costes.

## SP-R10-L05-Q01

**A — Para estimar diferencia entre indexación y tiempo de evento**. Una diferencia temporal puede indicar retraso; debe contextualizarse con reloj, parsing y buffering.

## SP-R10-L05-Q02

**D — Permisos, índice, intervalo, fuente y estado de ingesta**. No ver datos también puede deberse a permisos o filtros.

## SP-R10-L05-P01

Separar origen, forwarder, red, parsing, índice, RBAC y búsqueda. Para DC02 priorizar latencia; para DC03 comprobar permiso sin solicitar ampliación irrestricta; para duplicados revisar inputs. Diagnóstico provisional.

## SP-R10-L06-Q01

**A — Mismo dataset/ventana/semántica, con métricas del Job Inspector**. Una optimización exige conservar el objetivo y entorno comparables.

## SP-R10-L06-Q02

**D — Eventos examinados frente a resultados devueltos, según fase/job**. Pocos resultados no implican bajo volumen examinado.

## SP-R10-L06-P01

A y B tienen mismo output_hash; B reduce scanCount 88% y tiempo simulado 83,33%. C parece rápida pero output_hash distinto, no comparable. Nada de estos valores proviene de Splunk real.

## SP-R10-L07-Q01

**D — Distribuir determinadas configuraciones/apps del search head cluster**. El SHC utiliza un deployer para coordinar el despliegue de determinados contenidos.

## SP-R10-L07-Q02

**C — Tres miembros, con otros requisitos**. La documentación cita tres miembros como mínimo para disponibilidad de búsqueda.

## SP-R10-L07-P01

Pyme: standalone y backup explícito; SOC HA: indexers/search heads escalados con RF/SF, SHC miembros adecuados, cluster manager y deployer diferenciados, costes y RTO/RPO con pruebas futuras.

## SP-R10-L08-Q01

**B — Una restauración de ensayo con validación y evidencias**. La recuperación debe comprobarse con restore, integridad y criterios de aceptación.

## SP-R10-L08-Q02

**A — Intentar sobrescribir con una versión antigua como downgrade directo**. El producto no admite un downgrade in-place de ese modo.

## SP-R10-L08-P01

Incluye backups por componente, test restore, compatibilidad, pausa/reanudación según change control, validación E2E de telemetría, ventanas, contingencia y responsables.

## SP-R11-L01-Q01

**D — Una alerta genera señal; respuesta requiere control y acciones con permisos**. Crear resultados/alertas no implica gestionar una acción de respuesta segura.

## SP-R11-L01-Q02

**C — Evaluar evidencia y autorización específicas para la acción, el asset y el objetivo antes de bloquear**. Los efectos mutantes requieren política y aprobación aplicable.

## SP-R11-L01-P01

Detección acotada; dedupe; notificación mínima; triage; evidencia, owner y SLA; aprobación para acción mutante y registro de auditoría. No integración real.

## SP-R11-L02-Q01

**C — El identificador de un trabajo de búsqueda, que no otorga por sí mismo permiso para leer sus resultados**. SID refiere al trabajo creado, no concede permisos por sí solo.

## SP-R11-L02-Q02

**D — Acotar resultados, tiempo e índices mediante un rol mínimo y un límite de extracción definido**. Los límites y RBAC restringen volumen y alcance.

## SP-R11-L02-P01

Contrato documental Enterprise 10.2: POST /services/search/jobs crea SID; GET /services/search/jobs/{sid} consulta estado; GET /services/search/v2/jobs/{sid}/results recupera resultados. Exigir consultas y parámetros permitidos, earliest/latest, count entre 1 y 100, rol mínimo, HTTPS verificado, ownership y límites de jobs. Job expirado y 401/403 no disparan efectos externos. Sin llamadas REST; soporte de versión/Cloud pendiente.

## SP-R11-L03-Q01

**D — Un identificador y contexto mínimo con enlace autenticado, evitando trasladar eventos crudos o secretos**. Minimizar datos reduce superficie de exposición.

## SP-R11-L03-Q02

**B — Dar por hecho que todo webhook nativo firma con HMAC**. La firma depende del mecanismo implementado y debe verificarse.

## SP-R11-L03-P01

Enviar IDs/severidad/ventana y enlace interno, no raw logs; destino allowlisted, credenciales en secret manager, dedupe id, retries/backoff y auditoría sin secretos.

## SP-R11-L04-Q01

**B — Las apps y conectores con assets compatibles, instalados y autorizados para la acción concreta**. El conjunto de acciones depende de las apps y assets configurados.

## SP-R11-L04-Q02

**A — Puede aplicarse a todos los assets compatibles**. La documentación advierte expansión de targets al no concretar asset.

## SP-R11-L04-P01

Usar asset lookup explícito RO, decisión basada en evidencia y confidence, ticket interno, aprobación humana del bloqueo, asset de firewall elegido, audit logs, verificación y compensación.

## SP-R11-L05-Q01

**C — Acción, asset, target, expiración y responsable**. La autorización debe ligarse al efecto concreto y su vigencia.

## SP-R11-L05-Q02

**B — Detener y requerir nueva revisión/validación**. El permiso previo ya no describe la operación propuesta.

## SP-R11-L05-P01

Todo cambio en firewall/directorio necesita permiso explícito con target/asset/scope, dueño, evidencia, expiración y reversión. Las tareas de lectura pueden requerir protección de datos; el fixture no autoriza ningún efecto.

## SP-R11-L06-Q01

**A — Conservar estado unknown y reconciliar el resultado antes de repetir una operación con posible efecto**. Timeout no informa con certeza si el servidor aplicó la mutación.

## SP-R11-L06-Q02

**C — Ante 401/403 o confirmación de target incorrecto**. Fallos permanentes/no autorizados no son transitorios.

## SP-R11-L06-P01

Clave BLOCK|203.0.113.15|APR-1 con replay: una sola aplicación confirmada; unknown de otra clave exige reconciliación. 403 detiene; consulta RO con 503 permite reintento limitado. No realizar acciones.

## SP-R11-L07-Q01

**A — Fuente, campos, ventana, consulta, resultados, control benigno y decisión trazable**. Las decisiones deben poder auditarse con datos y procedimientos reproducibles.

## SP-R11-L07-Q02

**D — Diseño + pruebas offline, pendiente de validación real**. Ningún CSV offline sustituye pruebas reales en producto y versiones específicas.

## SP-R11-L07-P01

Reutilizar auth_activity.csv y authorized_context.csv de R06–R07, no el archivo homónimo de R08. Eventos [09:00,09:15) UTC del 15/10/2026: snapshot retrospectivo .23=7/6, mantenimiento .15=5/1, proxy .44=4/3. Con >=5 fallos y >=5 cuentas solo .23 es candidata; a corte anterior a 09:16 era 6/6. No asignar verdad de ataque al candidato ni benignidad al proxy. Diseñar roles, aviso mínimo, triage, aprobación específica, ledger y rollback sin conectar Enterprise, ES o SOAR. Las abiertas son formativas; aprobar teoría no demuestra dominio práctico.

