# SOC-RESPONSES — Tanda 08 | SOC N2: Cloud, identidad y ataques avanzados

**Escenarios:** N2-16 a N2-20 · **Revisión documental:** 18/10/2026 · **Última tanda: 40/40 del banco inicial**.

> **Nota:** Material educativo y defensivo basado en documentación oficial. Las 10 consultas KQL y 10 SPL son **ejemplos pendientes de validación en un tenant/Splunk real**. Los índices, umbrales, permisos, auditoría, período de retención y nombres ficticios deben adaptarse. Contención solo por personal autorizado y playbook vigente.

## Índice

- [N2-16 — MFA activado y sesión anómala en Entra ID: ¿robo de token, AiTM o sesión legítima?](#n2-16)
- [N2-17 — AWS access key expuesta: reconstruir CloudTrail y contener todas las credenciales derivadas](#n2-17)
- [N2-18 — Reenvío externo no autorizado en Microsoft 365: ¿configuración legítima o fuga?](#n2-18)
- [N2-19 — Ransomware y tráfico SMB: detener la propagación sin perder el mapa de afectados](#n2-19)
- [N2-20 — Persistencia tras contención: investigación sistemática antes de restaurar](#n2-20)

## Cinco distinciones que cambian el resultado

- **MFA satisfecho ≠ un desafío nuevo en cada acceso.** Una sesión/token anterior puede satisfacer requisitos; reconstruir contexto y actividad.
- **Clave desactivada ≠ credenciales STS revocadas.** Investigar AssumeRole y permisos cruzados; el lookup regional cubre solo gestión/Insights recientes.
- **Regla de reenvío ≠ correo exfiltrado.** Usar message trace, reportes y políticas outbound para comprobar entrega.
- **SMB/445 ≠ cifrado o ransomware demostrado.** Buscar cambios de archivos, proceso responsable y otros endpoints.
- **No encontrar persistencia ≠ erradicar.** Revisar Windows, Linux, identidades y criterios de reconstrucción limpia.

## Matriz de decisión inicial

| ID | Señal | Riesgo dominante | Comprobación crítica |
|---|---|---|---|
| N2-16 | MFA OK + geografía anómala | Sesión/token reutilizado | Señal de sesión + datos accedidos |
| N2-17 | Clave filtrada + API calls | Cuenta/región/STS cruzados | CloudTrail + identidades derivadas |
| N2-18 | Forwarding externo en Exchange | Acceso a mensajes futuros | Message trace / política de reenvío |
| N2-19 | Ráfaga de archivos + TCP/445 | Cifrado lateral y daño activo | Correlación SMB ↔ archivos ↔ procesos |
| N2-20 | Host aislado con artefactos | Acceso residual y recaída | Enumeración integral + reconstrucción |

---

<a id="n2-16"></a>
## N2-16 — MFA activado y sesión anómala en Entra ID: ¿robo de token, AiTM o sesión legítima?

**Nivel:** SOC N2 · **Bloque:** Cloud, identidad y ataques avanzados

> **Pregunta de entrevista:** Microsoft Entra ID registra un inicio de sesión exitoso desde una ubicación anómala, pero el usuario tiene MFA activado. ¿Cómo investigarías una posible sustracción de sesión?

### Escenario y objetivo

Son las 08:42 y el usuario ana.finance@empresa.example informa que trabaja desde Sevilla. Un inicio de sesión de Microsoft 365 aparece a las 08:40 desde un proveedor residencial de otro país. En el panel consta MFA como requisito satisfecho. En ese mismo intervalo la cuenta consultó SharePoint y Exchange. El usuario utilizó una VPN corporativa el día anterior, pero no reconoce el navegador ni el equipo del evento. Se desconoce si fue phishing de intermediario (AiTM), reutilización de cookie/token, abuso de refresh token, dispositivo legítimo remoto o geolocalización imprecisa.

**Objetivo operativo:** Determinar si hay uso no autorizado de una sesión ya autenticada; separar autenticación inicial, emisión/canje de tokens y acceso al recurso, evaluar alcance del acceso a datos y activar contención de identidad proporcional sin asumir que MFA equivale a sesión segura.

### Hipótesis y alternativas

- Robo/reutilización de cookie o token de sesión tras autenticación legítima; posible AiTM (hipótesis ATT&CK T1550.004).
- Inicio de sesión legítimo por VPN, proxy SASE, red móvil o escritorio remoto, con geolocalización del punto de salida.
- Token emitido previamente y reutilizado por una aplicación: el evento no indica necesariamente un desafío MFA nuevo.
- Inscripción o consentimiento OAuth malicioso, dispositivo desconocido, manipulación de registro MFA o compromiso adicional.
- Error de clasificación por agregación de logs, UPN compartido, direcciones NAT/CDN, reloj o datos incompletos.

### Procedimiento paso a paso

**1 · Declarar y proteger** — Identificar UPN, ObjectId, tenant, período en UTC, ID/correlación del evento, impacto de la cuenta y aplicaciones; preservar exports y evidencias del portal. Si hay actividad no reconocida activa o acceso privilegiado, elevar incidencia de identidad con prioridad alta.

**2 · Leer detalles, no solo icono MFA** — Abrir SigninLogs y su AuthenticationDetails, AuthenticationRequirement, Status, ConditionalAccessStatus, ClientAppUsed, ResourceDisplayName, UserAgent, DeviceDetail e IP. No interpretar «MFA satisfied» como «el usuario acaba de aprobar una notificación»; puede ser una sesión/claim previa.

**3 · Comparar contexto del evento** — Revisar ubicación, ASN, IP/ISP, agente de usuario, dispositivo/compliance, sesión y cambios respecto a la línea base. Comprobar túnel VPN, nodos proxy de la empresa, itinerancia y dispositivo registrado. La geolocalización, por sí sola, no atribuye malicia.

**4 · Construir timeline de inicios y tokens** — Correlacionar SigninLogs y registros no interactivos cuando estén habilitados; comparar AuthenticationDetails, CorrelationId, Session/ClientSessionId, UniqueTokenIdentifier cuando poblado y controles de token protection. No asumir que estos identificadores siempre estarán disponibles o significan la misma cosa.

**5 · Buscar consecuencias** — Investigar auditoría Exchange, SharePoint, OneDrive, cambios de reglas, permisos, OAuth consents, descargas inusuales y envío de correos. Un inicio de sesión exitoso no demuestra acceso a información sensible.

**6 · Analizar endpoint del usuario** — Con autorización, inspeccionar MDE para navegador, extensiones, eventos de phishing, URL, descarga sospechosa y señales de robo de cookies, sin extraer tokens reales a portales externos. Un endpoint sano no descarta robo de sesión por otra vía.

**7 · Contener con equipo de identidad** — Si hay compromiso probable, bloquear inicio o elevar controles condicionales, revocar sesiones/refresh tokens mediante procedimiento, restablecer credenciales si procede, revisar métodos MFA y sesiones de aplicaciones. Confirmar límites: algunas sesiones y aplicaciones pueden mantenerse activas hasta expiración o nueva evaluación.

**8 · Confirmar eficacia** — Revisar nuevos inicios/canje de tokens y actividad M365 tras revocación, cortar accesos no autorizados y comprobar que el usuario recuperó acceso desde dispositivo confiable. Si hay sensibilidad de datos, informar a privacidad/IR.

**9 · Clasificar y documentar** — Documentar evidencia a favor/en contra de AiTM y token theft, usuario/activos/recurso, ventana, acciones ejecutadas, efectividad, brechas de ingesta y necesidad de CA resistente a phishing/token binding según compatibilidad.

### Evidencias e interpretación

| Origen de telemetría | Significado y limitaciones |
|---|---|
| SigninLogs: UserPrincipalName, IPAddress, AppDisplayName, ResultType, AuthenticationDetails | Explican contexto y resultado; AuthenticationDetails puede incluir cómo se cumplió MFA, no prueban por sí solos robo de token. |
| SigninLogs: DeviceDetail, UserAgent, ConditionalAccessStatus, AuthenticationRequirement | Ayudan a comparar dispositivos y políticas. CA=success no excluye token reutilizado ni sesión robada. |
| SigninLogs: ClientSessionId, UniqueTokenIdentifier, TokenProtectionStatusDetails | Señales adicionales cuando se encuentran pobladas; no todas las apps/tokens exponen la misma trazabilidad. |
| Entra audit logs: métodos MFA, registro de dispositivos, aplicaciones/consentimientos | Detectan modificaciones de identidad y persistencia potencial, no necesariamente relacionadas causalmente. |
| OfficeActivity / Purview / SharePoint / Exchange | Acceso, configuración y envío observados tras el inicio; comprobar si las operaciones realmente ocurrieron. |
| EDR, proxy, VPN, CASB e inventario | Correlación de equipo real, VPN/proxy de salida y enlace con phishing; un resultado negativo no descarta el incidente. |

### KQL — consultas de investigación

#### Sentinel · contexto de inicio y MFA en SigninLogs

**Entorno y requisitos:** Log Analytics con conector de Microsoft Entra sign-in logs; tabla SigninLogs, no consulta directa de Defender XDR. Reemplazar UPN ficticio.

```kql
let usuario = "ana.finance@empresa.example";
SigninLogs
| where TimeGenerated >= ago(7d)
| where UserPrincipalName =~ usuario
| extend D = todynamic(DeviceDetail), A = todynamic(AuthenticationDetails)
| project TimeGenerated, UserPrincipalName, IPAddress, Location,
          AppDisplayName, ClientAppUsed, UserAgent, ResultType,
          AuthenticationRequirement, ConditionalAccessStatus,
          DeviceId=tostring(D.deviceId), Browser=tostring(D.browser),
          DeviceOS=tostring(D.operatingSystem), AuthSteps=A,
          CorrelationId, ClientSessionId, UniqueTokenIdentifier
| order by TimeGenerated desc
```

**Interpretación:** Revisar la secuencia de accesos, detalles de método y discrepancias de dispositivo/IP. La salida no es un detector concluyente de robo de sesión.

**Limitaciones:** Requiere ingestion específica y permisos. Alguns campos son opcionales o pueden venir vacíos; normalizar fechas UTC. Las señales de tokens y revalidación dependen de aplicación.

#### Sentinel · nuevas IP y aplicaciones por usuario

**Entorno y requisitos:** SigninLogs y baseline de 14 días; definir umbrales/ASNs corporativos antes de clasificar anomalías.

```kql
SigninLogs
| where TimeGenerated >= ago(14d)
| where ResultType == "0"
| summarize Inicios=count(), Primera=min(TimeGenerated), Ultima=max(TimeGenerated),
            Recursos=make_set(AppDisplayName, 8), Agentes=make_set(UserAgent, 5)
    by UserPrincipalName, IPAddress
| where Inicios > 0
| order by Ultima desc
```

**Interpretación:** Da pivotes por usuario/IP y servicios, útil para comparar patrones con un activo y evitar aislar exclusivamente por país.

**Limitaciones:** Puede mezclar IP dinámica, VPN y proxies. `ResultType=="0"` modela éxito usual en SigninLogs; no presupone desafío MFA nuevo.

### SPL — consultas de investigación

#### Splunk · timeline de autenticaciones Entra

**Entorno y requisitos:** index=entra ejemplo con eventos exportados de Entra y extracciones propias (userPrincipalName, ipAddress, status.errorCode). Adaptar fuentes.

```spl
index=entra earliest=-7d userPrincipalName="ana.finance@empresa.example"
| eval status_code=coalesce('status.errorCode',errorCode)
| table _time userPrincipalName ipAddress appDisplayName clientAppUsed
        userAgent conditionalAccessStatus authenticationRequirement status_code
| sort 0 _time
```

**Interpretación:** Mostrar autenticaciones exitosas/fallidas, aplicaciones y diferencias de clientes.

**Limitaciones:** Los campos JSON pueden requerir `spath`; `status.errorCode` es ejemplo de extracción. Correlacionar con registros no interactivos.

#### Splunk · cambios de IP y agentes para una identidad

**Entorno y requisitos:** index=entra con ipAddress, userAgent, appDisplayName y registros de todos los métodos.

```spl
index=entra earliest=-14d userPrincipalName="ana.finance@empresa.example"
| stats count as eventos earliest(_time) as primero latest(_time) as ultimo
        values(appDisplayName) as recursos values(userAgent) as agentes
  by ipAddress
| convert ctime(primero) ctime(ultimo)
| sort - eventos
```

**Interpretación:** Resume cambios de red y navegador para priorizar pivotes.

**Limitaciones:** No detecta tokens robados por sí solo. Hay valores ausentes, NAT y sesgo de logging de sesión.

### Comandos de observación / referencia

**PowerShell de Entra / solo lectura** — Consultar sesiones/inicios vía API Graph con permisos apropiados: no exponer tokens API ni datos personales.

```powershell
# Ejemplo ilustrativo; requiere Microsoft.Graph, permisos AuditLog.Read.All
Get-MgAuditLogSignIn -Filter "userPrincipalName eq 'ana.finance@empresa.example'" -Top 25 |
  Select-Object CreatedDateTime, UserPrincipalName, IpAddress, AppDisplayName, ConditionalAccessStatus
```

**PowerShell de Microsoft 365 / solo lectura** — Revisar si la cuenta tiene métodos registrados y auditoría disponible, sin revelar datos de autenticación.

```powershell
# Requiere privilegios y conexión Graph; no recopilar secretos
Get-MgUserAuthenticationMethod -UserId 'ana.finance@empresa.example' |
  Select-Object Id, AdditionalProperties
```

**Procedimiento de contención, NO ejecutar sin autorización** — Acción de revocación de sesión que puede interrumpir servicios; incluir rollback y validación.

```bash
# CAMBIO DE ESTADO - solo durante incidente autorizado
# Revoke-MgUserSignInSession -UserId 'ID-DEL-USUARIO'
```

### Contención y recuperación

Si hay accesos no autorizados confirmados o muy probables, reducir exposición inmediatamente mediante Conditional Access, bloqueo selectivo, revocación de sesiones/refresh tokens y revisión de métodos MFA/OAuth, con propietario de identidad y preservación de evidencias. Restablecer contraseña no asegura invalidación instantánea de todas las sesiones y token lifetimes; comprobar nuevas solicitudes y accesos a datos. Priorizar cuentas privilegiadas o con información sensible.

### Cuándo escalar

- Accesos a recursos sensibles desde dispositivos/IP no confiables con efectos demostrables.
- Cambios inesperados de métodos MFA, consentimientos o contraseñas.
- Actividad sospechosa continua después de revocar sesiones.
- Cuenta privilegiada o múltiples cuentas afectadas en patrón correlacionado.
- Potencial fuga de datos o cambios de configuración M365.

### Falsos positivos que debes considerar

- Salida VPN/SASE desde otro país, geolocalización IP imprecisa.
- Acceso remoto legítimo, delegación o cliente móvil.
- MFA satisfecha por claim previo o sesión existente.
- Usuarios que viajan o comparten NAT corporativo.
- Cambios normales de UserAgent tras actualizaciones o renovación de navegador.

### Errores típicos que debes evitar

- MFA activado = acceso imposible de comprometer.
- Bloquear país/IP como única contención.
- Asumir que el icono de MFA refleja un desafío nuevo.
- Concluir AiTM solo por IP extraña sin evidencias complementarias.
- Obtener o compartir tokens/cookies reales como parte de la investigación.
- No verificar sesiones persistentes después de la revocación.

### Perspectiva Red Team y Blue Team

AiTM y otros métodos de sustracción de material de sesión apuntan a usar autorización ya concedida; no necesitan necesariamente conocer el segundo factor para cada acceso. Blue Team investiga disonancia entre sesión, dispositivo, fuente y acciones sobre datos. Un origen anómalo exige correlación; una política resistente a phishing y, donde aplique, token protection reducen superficies pero no dan invulnerabilidad.

### Respuesta modelo de entrevista

> No trataría MFA como garantía absoluta. Primero validaría en SigninLogs el resultado, los detalles de autenticación, el dispositivo, la IP, el agente y las políticas. Buscaría accesos no interactivos y acciones posteriores sobre correo/archivos, comprobaría VPN y dispositivo corporativo e investigaría posibles cambios de métodos MFA. Si hay indicios consistentes de sesión robada, escalaría a IR, revocaría sesiones y restringiría accesos bajo procedimiento; después verificaría que no quedan sesiones activas no autorizadas y evaluaría la exposición de datos.

### Checklist de autoevaluación

- [ ] Diferencia MFA registrada de desafío MFA nuevo.
- [ ] Usa tabla SigninLogs real y describe limitaciones.
- [ ] Correlaciona IP, dispositivo, sesión, aplicación y actividad posterior.
- [ ] Comprende token replay vs phishing AiTM vs VPN.
- [ ] Revoca/restringe y valida eficacia, no solo contraseña.
- [ ] Menciona privacidad y acceso a archivos/correo.

**MITRE ATT&CK (hipótesis, salvo evidencia confirmatoria):** T1550.004 — Use Alternate Authentication Material: Web Session Cookie (hipótesis), T1539 — Steal Web Session Cookie (hipótesis)

### Fuentes oficiales y documentación de referencia

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-entraidsigninevents-table
- https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-in-log-activity-details
- https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-token-protection
- https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/officeactivity
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-17"></a>
## N2-17 — AWS access key expuesta: reconstruir CloudTrail y contener todas las credenciales derivadas

**Nivel:** SOC N2 · **Bloque:** Cloud, identidad y ataques avanzados

> **Pregunta de entrevista:** Un atacante obtiene una access key de AWS y comienza a enumerar recursos. ¿Cómo identificarías el alcance de la actividad utilizando CloudTrail y qué medidas aplicarías?

### Escenario y objetivo

Una alerta GuardDuty y una publicación accidental en repositorio sugieren que una clave de larga duración de una cuenta IAM de automatización fue filtrada. Minutos después aparecen ListBuckets, DescribeInstances, GetCallerIdentity y actividad de IAM desde una IP distinta de los runners habituales. El entorno tiene varias cuentas AWS y un trail organizativo, pero no se sabe si los eventos de datos S3 están habilitados o si la clave pudo usar STS para obtener otras credenciales.

**Objetivo operativo:** Detener inmediatamente el uso de una credencial sospechosa sin perder evidencia, reconstruir su línea temporal por cuenta/región/API, determinar qué identidades y recursos pudo afectar, identificar sesiones o claves derivadas, y restablecer servicio con credenciales limpias y permisos mínimos.

### Hipótesis y alternativas

- La clave expuesta se utilizó para reconocimiento de cuenta y preparación de extracción o persistencia (T1078.004).
- El origen externo pertenece a un runner legítimo o a un proveedor de automatización con IP no actualizada.
- El principal hizo AssumeRole y generó sesiones temporales que deben seguirse por ARN, SessionIssuer y sourceIdentity.
- La actividad afecta varias regiones/cuentas pero la consulta se limita al historial regional.
- No existe visibilidad de lecturas de objetos S3 porque la ingesta de data events no estaba habilitada para ese recurso.

### Procedimiento paso a paso

**1 · Confirmar credencial y autoridad** — Clasificar incidencia cloud, recoger ID de key (no secreto), propietario, tipo IAM/STS, cuenta, regiones, rol, inventario y dependencia productiva. Notificar a cloud/security y dueño de automatización. Preservar alerta y ruta de exposición con acceso restringido.

**2 · Contener antes de hunting exhaustivo** — Ante uso anómalo de alta confianza desactivar la access key afectada o imponer denegación de emergencia aprobada; si es credencial productiva preparar reemplazo seguro. No volver a publicar el secreto, ni esperar horas para reunir logs si el actor continúa.

**3 · Extraer timeline de CloudTrail** — Buscar por AccessKeyId con `lookup-events` en las regiones pertinentes durante ≤90 días para management events, y consultar CloudTrail Lake/S3/Athena/SIEM si la retención/volumen exige más. CloudTrail Event History no sustituye data events ni es global para todas las consultas.

**4 · Atribuir a identidad efectiva** — En cada evento revisar eventTime, recipientAccountId, awsRegion, eventSource, eventName, sourceIPAddress, userAgent, userIdentity.type/arn/accessKeyId, requestParameters, responseElements y errorCode. Diferenciar errores de permisos de acciones exitosas.

**5 · Buscar expansión de privilegios** — Inspeccionar IAM CreateAccessKey, AttachUserPolicy, PutUserPolicy, UpdateAssumeRolePolicy, CreatePolicyVersion, cambios en roles y AssumeRole; rastrear credenciales STS derivadas por sesión/ARN, sin asumir que revocar la clave original invalida todo lo previamente emitido.

**6 · Buscar acceso/extracción de datos** — Comprobar CloudTrail data events para S3, Lambda y otros servicios si fueron habilitados, más S3 server access logs, VPC Flow, GuardDuty, Security Hub y AWS Config según cobertura. ListBuckets/GetObject no son equivalentes; no declarar datos extraídos solo por listar buckets.

**7 · Determinar radio de impacto** — Recorrer cuentas AWS Organizations, roles confiados, regiones y recursos tocados; documentar acciones de lectura/escritura y posibles costos/infra creados. Separar recursos accesibles por permisos de recursos efectivamente consultados o cambiados.

**8 · Recuperación segura** — Rotar/reemplazar credenciales desde canal seguro, eliminar usuarios/keys/roles no autorizados según procedimiento, corregir permisos, forzar sesiones STS si aplica por controles aprobados y comprobar runners; adoptar roles temporales y evitar secretos de larga duración.

**9 · Validar y reportar** — Confirmar que la clave no funciona, que STS y rutas alternativas están contenidas, que no quedan cambios persistentes, que alertas desaparecen y que reanudan tareas legítimas. Registrar brechas de Data Events, costos y notificaciones pertinentes.

### Evidencias e interpretación

| Origen de telemetría | Significado y limitaciones |
|---|---|
| CloudTrail management events: AccessKeyId, arn, eventName, eventSource | Actividad de API y contexto de principal; llamadas de solo lectura no equivalen a alteración. |
| CloudTrail: errorCode, requestParameters, responseElements | Intentos fallidos, operaciones y objetos: ciertos campos pueden estar omitidos, redactados o incompletos. |
| AWS STS AssumeRole + SessionIssuer + sessionContext | Posibles credenciales derivadas y cadena de confianza; hay que seguirlas por eventos y timestamps. |
| CloudTrail data events (si están configurados) | Posibles operaciones de objetos S3; sin estas fuentes no se puede excluir acceso a objetos. |
| GuardDuty / Security Hub / IAM credential report | Detecciones, postura, edad de credenciales y posible mal uso; hallazgo no siempre implica compromiso confirmado. |
| Organizational trail + cuentas/regiones + VPC Flow/S3 access logs | Ámbito multidominio, tráfico y acceso adicional; cobertura varía por servicio e implementación. |

### KQL — consultas de investigación

#### Sentinel · CloudTrail por identidad y origen

**Entorno y requisitos:** AWSCloudTrail existe solo con conector/ingesta apropiada y esquema del workspace; usar usuario/ARN de ejemplo y no secretes.

```kql
let usuario = "svc-automation";
AWSCloudTrail
| where TimeGenerated >= ago(7d)
| where UserIdentityUserName =~ usuario or SessionIssuerUserName =~ usuario
| project TimeGenerated, UserIdentityAccountId, UserIdentityUserName,
          UserIdentityPrincipalid, SessionIssuerUserName,
          EventName, EventSource, SourceIpAddress, UserAgent, AWSRegion,
          ErrorCode, RequestParameters, ResponseElements
| order by TimeGenerated asc
```

**Interpretación:** Genera timeline del usuario/rol para hallar IP, APIs y cuentas; pivotar después a sesión y eventos CloudTrail crudos.

**Limitaciones:** La asociación por username puede perder sesiones temporales, y las columnas opcionales dependen del conector. No supone cobertura de CloudTrail data events.

#### Sentinel · agregación de APIs por cuenta, región e IP

**Entorno y requisitos:** AWSCloudTrail con campos documentados UserIdentityAccountId, EventName, SourceIpAddress, AWSRegion.

```kql
AWSCloudTrail
| where TimeGenerated >= ago(7d)
| summarize Llamadas=count(), Primera=min(TimeGenerated), Ultima=max(TimeGenerated),
            APIs=make_set(EventName, 30)
    by UserIdentityAccountId, AWSRegion, SourceIpAddress
| where Llamadas >= 5
| order by Llamadas desc
```

**Interpretación:** Ayuda a detectar un origen desconocido y cambios de patrón de API/Región; correlacionar con inventario de automatizaciones.

**Limitaciones:** El umbral >=5 es solo ilustrativo. El resultado mezcla múltiples identidades desde NAT; refinar primero la clave/ARN real.

### SPL — consultas de investigación

#### Splunk · tracking de access key en eventos CloudTrail

**Entorno y requisitos:** index=aws_cloudtrail ejemplo; eventos JSON con userIdentity.accessKeyId y extracciones spath; usar identificador ficticio.

```spl
index=aws_cloudtrail earliest=-7d
| spath path=userIdentity.accessKeyId output=key_id
| spath path=userIdentity.arn output=principal_arn
| search key_id="AKIAIOSFODNN7EXAMPLE"
| table _time recipientAccountId awsRegion eventName eventSource
        sourceIPAddress userAgent errorCode principal_arn
| sort 0 _time
```

**Interpretación:** Reconstruye acciones exactas de una clave de acceso cuando está registrada; guardar eventos crudos con eventID.

**Limitaciones:** No cubre todas las credenciales temporales obtenidas posteriormente; algunas ingestas usan nombres de campo distintos.

#### Splunk · cambios IAM y STS de alto interés

**Entorno y requisitos:** index=aws_cloudtrail con CloudTrail management events de todas las cuentas, regiones y read-only/writes.

```spl
index=aws_cloudtrail earliest=-7d
(eventName=AssumeRole OR eventName=CreateAccessKey OR eventName=AttachUserPolicy
 OR eventName=PutUserPolicy OR eventName=UpdateAssumeRolePolicy
 OR eventName=CreatePolicyVersion)
| spath path=userIdentity.arn output=principal_arn
| stats count as eventos values(eventName) as acciones
        values(errorCode) as errores by recipientAccountId sourceIPAddress principal_arn
| sort - eventos
```

**Interpretación:** Localiza rutas de privilegios/credenciales que requieren análisis individual de parámetros.

**Limitaciones:** Acciones pueden ser legítimas. `userIdentity.arn` y otros campos requieren extracción; eventos regionales incompletos introducen falsos negativos.

### Comandos de observación / referencia

**AWS CLI / lectura** — Ver eventos de gestión del access key identificado en una región (historial regional 90 días).

```bash
aws cloudtrail lookup-events \
  --region eu-west-1 \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAIOSFODNN7EXAMPLE \
  --max-items 50
```

**AWS CLI / lectura** — Consultar último uso conocido de una clave IAM; no reemplaza CloudTrail.

```bash
aws iam get-access-key-last-used \
  --access-key-id AKIAIOSFODNN7EXAMPLE
```

**AWS CLI / lectura** — Enumerar claves de usuario propietario para evaluar rotación sin publicarlas.

```bash
aws iam list-access-keys --user-name svc-automation
```

**Contención / solo previa autorización** — Ejemplo de desactivación de clave IAM de larga duración; NO aplicar automáticamente en producción.

```bash
# CAMBIO DE ESTADO: ejecución bajo playbook y aprobación
# aws iam update-access-key --user-name svc-automation \
#   --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive
```

### Contención y recuperación

Ante evidencia de uso malicioso activo, desactivar/restringir la credencial y bloquear el camino de abuso respetando dependencias operativas. Investigar AssumeRole y credenciales STS temporales separadamente: bloquear la clave de origen no garantiza invalidar todos los tokens ya emitidos. Hacer rotación segura, revisar políticas y confianza cross-account y restaurar la automatización con roles de corta duración.

### Cuándo escalar

- Origen remoto no atribuido con lecturas o cambios exitosos.
- Creación de nuevas claves, políticas, roles o sesiones STS.
- Operaciones sobre S3, secretos, instantáneas, snapshots o cargas sensibles.
- Acceso a varias cuentas y regiones o hallazgos GuardDuty correlacionados.
- Falta de CloudTrail data events cuando se necesita determinar exposición de información.

### Falsos positivos que debes considerar

- Rotación o despliegue de CI/CD desde un nuevo runner.
- Proveedor legítimo con IP variable y permisos amplios.
- AssumeRole por herramientas autorizadas de inventario.
- Enumeración habitual de AWS Config, CSPM o auditoría.
- CloudTrail entregado con retraso, orden de eventos no causal.

### Errores típicos que debes evitar

- Pegar secretos completos en SIEM o documentación.
- Investigar solo una región o una cuenta.
- Tratar `lookup-events` como cobertura de objetos S3.
- Desactivar la clave y asumir que todos los tokens STS quedan revocados.
- Asumir extracción de S3 a partir de ListBuckets.
- Rotar sin coordinar servicio productivo o sin revisar nuevas claves persistentes.

### Perspectiva Red Team y Blue Team

Con una clave válida, el adversario puede consultar APIs dentro del permiso efectivo y, si existen relaciones de confianza amplias, acceder mediante STS a otros roles. La cadena de evidencia requiere enlazar la identidad usada inicialmente con sesiones derivadas y cambios de recursos. Blue Team debe analizar success/errorCode, CloudTrail management vs data events, múltiples regiones/cuentas y persistencia IAM, no únicamente el hallazgo inicial.

### Respuesta modelo de entrevista

> Primero contendría la access key comprometida sin divulgar el secreto, coordinando la continuidad del servicio. Buscaría el ID en CloudTrail y recopilaría eventName, IP, cuenta, región, usuario, resultados y parámetros, ampliando a CloudTrail Lake/SIEM y otras cuentas. Investigaría IAM/STS para localizar roles asumidos, claves y permisos añadidos; separaría eventos de gestión de data events para evaluar acceso a objetos. Finalmente rotaría credenciales, eliminaría persistencia, validaría el bloqueo de sesiones alternativas y documentaría los vacíos de visibilidad.

### Checklist de autoevaluación

- [ ] Contiene la credencial sin esperar análisis exhaustivo.
- [ ] Reconoce límite regional/90 días de lookup-events.
- [ ] Conoce diferencia management/data events S3.
- [ ] Investiga AWS STS y cross-account.
- [ ] Distingue enumeración de extracción y eventos fallidos de exitosos.
- [ ] Valida recuperación productiva y rotación segura.

**MITRE ATT&CK (hipótesis, salvo evidencia confirmatoria):** T1078.004 — Valid Accounts: Cloud Accounts (hipótesis), T1098.001 — Account Manipulation: Additional Cloud Credentials (según evidencia)

### Fuentes oficiales y documentación de referencia

- https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html
- https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-user-identity.html
- https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/lookup-events.html
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/awscloudtrail
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/awscloudtrail
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-18"></a>
## N2-18 — Reenvío externo no autorizado en Microsoft 365: ¿configuración legítima o fuga?

**Nivel:** SOC N2 · **Bloque:** Cloud, identidad y ataques avanzados

> **Pregunta de entrevista:** Detectas que una cuenta comprometida ha creado nuevas reglas de reenvío de correo en Microsoft 365. ¿Cómo investigarías una posible exfiltración de información?

### Escenario y objetivo

A las 11:24 el equipo de seguridad recibe una alerta de creación de regla Inbox para la cuenta de facturación. El destino parece externo, pero el nombre de regla es «Invoices Sync». El día anterior existió un inicio de sesión desde una IP no conocida. El responsable de negocio señala que contabilidad a veces reenvía mensajes a un asesor autorizado. Necesitas comprobar si la regla realmente reenvía, desde cuándo, qué mensajes salieron y si el cambio proviene de la cuenta, un delegado, aplicación o administrador.

**Objetivo operativo:** Determinar mecanismo de reenvío, actor que creó/modificó la configuración, mensajes afectados y exposición real; evitar confundir configuración maliciosa con envío efectivo y contener cuentas, reglas o accesos abusivos preservando el registro de auditoría.

### Hipótesis y alternativas

- Un atacante con acceso al buzón crea New-InboxRule/Set-InboxRule para auto-reenviar o redirigir datos (T1114.003).
- Un administrador usa Set-Mailbox con ForwardingSmtpAddress/ForwardingAddress o cambia DeliverToMailboxAndForward.
- Una regla legítima fue aprobada por facturación y el dominio de destino pertenece a un proveedor conocido.
- La política outbound anti-spam bloquea reenvío externo: regla existente no demuestra mensajes entregados.
- Acceso delegado, API o app OAuth comprometida explica el cambio, no necesariamente un inicio interactivo del propietario.

### Procedimiento paso a paso

**1 · Delimitar correo y riesgo** — Abrir incidente, identificar buzón, UPN, tipo (compartido/individual), criticidad y fecha UTC de alerta. Preservar audit record y alert evidence; no reenviar correos afectados a investigadores por email.

**2 · Examinar estado actual** — Consultar Get-InboxRule -Mailbox para acciones ForwardTo, RedirectTo, ForwardAsAttachmentTo y condiciones; Get-Mailbox para ForwardingSmtpAddress/ForwardingAddress y DeliverToMailboxAndForward. Diferenciar reglas Inbox de reenvío del buzón y transport rules organizativas.

**3 · Reconstruir cambios** — Consultar OfficeActivity/Purview por New-InboxRule, Set-InboxRule, Remove-InboxRule, Set-Mailbox; extraer Parameters, UserId, ClientIP y Resource/MailboxOwnerUPN cuando disponibles. Registrar cambios posteriores a creación.

**4 · Identificar actor efectivo** — Correlacionar SigninLogs, roles del usuario, delegados, aplicaciones/consentimientos OAuth y audit activity del admin. Un cambio hecho por «SYSTEM» o servicio requiere validación adicional; no asumir que el propietario del buzón lo hizo.

**5 · Validar entrega y alcance** — Usar Message Trace/Extended Message Trace (según ventana y permisos), reportes Auto forwarded messages y políticas outbound para comprobar mensajes realmente enviados o bloqueados. La mera creación de regla no demuestra exfiltración.

**6 · Clasificar información** — Con privacidad/DLP, determinar remitentes, fechas, volumen y clasificación de los mensajes potencialmente reenviados. Evitar descargar contenido innecesario. Revisar reglas que oculten, borren o muevan respuestas y otras bandejas impactadas.

**7 · Buscar escalamiento y extensión** — Comparar reglas similares en otros buzones y cambios de permisos, consentimientos, delegaciones y modificaciones de políticas de reenvío externo. Buscar mailboxes compartidos y cuentas de alta sensibilidad.

**8 · Contener y recuperar** — Si se confirma abuso, bloquear reenvío externo por políticas adecuadas, desactivar reglas no autorizadas, cerrar accesos de cuenta/aplicaciones y revocar sesiones. Hacer cambios con evidencia preservada, aprobación y plan de restauración para destinos legítimos.

**9 · Verificar y reportar** — Comprobar configuración actual, entregas posteriores y nuevas creaciones; documentar correo afectado, actor probable, destinatario externo, mensajes confirmados/posibles y obligaciones legales/contractuales.

### Evidencias e interpretación

| Origen de telemetría | Significado y limitaciones |
|---|---|
| OfficeActivity: Operation, UserId, ClientIP, Parameters, ResultStatus | Cambios auditados en InboxRule o buzón; no implica necesariamente que el reenvío haya tenido éxito. |
| Get-InboxRule, Get-Mailbox (estado actual) | Identifica acciones y destinos actuales; el estado puede haberse alterado desde el momento del incidente. |
| Exchange message trace / Extended Message Trace | Prueba transmisión y rechazo de mensajes según retención/visibilidad, sin garantizar lectura por destino. |
| Auto forwarded messages report y outbound spam policies | Distingue reenvío configurado, permitido y efectivamente enviado; controles pueden bloquearlo. |
| SigninLogs / auditoría de delegación y consentimientos | Atribución contextual de quien cambió configuración, incluyendo posibles cuentas/apps con permisos. |
| Purview DLP / etiquetas y clasificación | Permite evaluar sensibilidad e impacto; no compartir muestras de correo sin autorización. |

### KQL — consultas de investigación

#### Sentinel · cambios de reglas Inbox y forwarding

**Entorno y requisitos:** OfficeActivity de Microsoft 365 audit connector; Operation y Parameters son columnas documentadas. No confundir con Defender XDR.

```kql
OfficeActivity
| where TimeGenerated >= ago(14d)
| where Operation in~ ("New-InboxRule", "Set-InboxRule", "Remove-InboxRule", "Set-Mailbox")
| project TimeGenerated, OfficeWorkload, Operation, UserId,
          MailboxOwnerUPN, ClientIP, ResultStatus,
          Parameters, OfficeObjectId
| order by TimeGenerated desc
```

**Interpretación:** Permite localizar quién modificó reglas/configuración, cuándo y con qué parámetros. Profundizar en Set-Mailbox para discriminar cambios de reenvío de otros cambios.

**Limitaciones:** El conector y auditoría deben estar habilitados; Parameters es un campo de texto variable; permisos y retención varían por licencia.

#### Sentinel · indicios de forwarding en parámetros

**Entorno y requisitos:** OfficeActivity con parámetros completos auditados. Búsqueda de cadena para triage, no detector definitivo.

```kql
OfficeActivity
| where TimeGenerated >= ago(30d)
| where Operation in~ ("New-InboxRule", "Set-InboxRule", "Set-Mailbox")
| where Parameters has_any ("ForwardTo", "RedirectTo", "ForwardingSmtpAddress",
                             "ForwardingAddress", "ForwardAsAttachmentTo")
| project TimeGenerated, UserId, MailboxOwnerUPN, Operation,
          ClientIP, Parameters, ResultStatus
| order by TimeGenerated desc
```

**Interpretación:** Reduce ruido de operaciones no relacionadas con reenvío; revisar parámetros literales y configuración de reglas.

**Limitaciones:** `has_any` tokeniza texto; puede omitir representaciones fragmentadas/JSON o cambios de parámetros no expuestos. No indica emails entregados.

### SPL — consultas de investigación

#### Splunk · altas y cambios de reglas Exchange

**Entorno y requisitos:** index=o365_audit ejemplo, Operation y Parameters extraídos de Unified Audit Log; adaptar TA Microsoft 365.

```spl
index=o365_audit earliest=-14d
(Operation="New-InboxRule" OR Operation="Set-InboxRule"
 OR Operation="Remove-InboxRule" OR Operation="Set-Mailbox")
| table _time UserId MailboxOwnerUPN Operation ClientIP ResultStatus Parameters
| sort 0 -_time
```

**Interpretación:** Identifica actores, correos y configuraciones alteradas; pivotar a usuario y sesión.

**Limitaciones:** Campos pueden estar anidados en AuditData y requerir `spath`; falta de resultados no demuestra ausencia de regla.

#### Splunk · parámetros de reenvío

**Entorno y requisitos:** index=o365_audit con operación/parametrización extraídas y eventos completos.

```spl
index=o365_audit earliest=-30d
(Operation="New-InboxRule" OR Operation="Set-InboxRule" OR Operation="Set-Mailbox")
| eval parametros=coalesce(Parameters,AuditData)
| where match(parametros,"(?i)(ForwardTo|RedirectTo|ForwardingSmtpAddress|ForwardingAddress|ForwardAsAttachmentTo)")
| table _time UserId Operation ClientIP parametros
| sort 0 -_time
```

**Interpretación:** Detecta cambios que mencionan acciones de forwarding para posterior inspección.

**Limitaciones:** No garantiza que el dato aparezca exactamente así en tu export. Debe verificarse contra estado actual y mail trace.

### Comandos de observación / referencia

**Exchange Online PowerShell / lectura** — Consultar reglas y acciones por buzón antes de cambiar configuración.

```powershell
Get-InboxRule -Mailbox 'billing@empresa.example' |
  Select-Object Name,Enabled,Priority,ForwardTo,RedirectTo,
                ForwardAsAttachmentTo,MoveToFolder,DeleteMessage
```

**Exchange Online PowerShell / lectura** — Revisar reenvío a nivel buzón (distinto de reglas Inbox).

```powershell
Get-Mailbox -Identity 'billing@empresa.example' |
  Select-Object DisplayName,ForwardingSmtpAddress,
                ForwardingAddress,DeliverToMailboxAndForward
```

**Microsoft Purview PowerShell / lectura** — Consultar cambios de reglas en Audit Log, si la sesión y licencia lo permiten.

```powershell
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-7) `
  -EndDate (Get-Date) -Operations New-InboxRule,Set-InboxRule,Set-Mailbox `
  -ResultSize 200
```

**Control de cambio / NO ejecutar sin aprobación** — Quitar o desactivar una regla maliciosa solo después de preservar evidencia y verificar el nombre.

```bash
# CAMBIO DE ESTADO, NO ejecutarlo durante triage exploratorio
# Disable-InboxRule -Mailbox 'billing@empresa.example' -Identity 'Invoices Sync'
```

### Contención y recuperación

Preservar primero la regla y evidencia de auditoría; si el reenvío no autorizado está activo, desactivarlo y aplicar política de bloqueo de reenvío externo coordinada con Exchange, sin destruir pruebas. Revocar sesiones y revisar apps/roles/delegados si hay acceso comprometido. Confirmar por trazas que no continúan entregas no autorizadas. Informar a DPO/Legal de posible exposición según sensibilidad y mensajes efectivamente afectados.

### Cuándo escalar

- Regla encaminada a tercero desconocido y entregas confirmadas.
- Cuenta financiera, ejecutiva o buzón compartido de alta sensibilidad.
- Múltiples buzones con reglas iguales o consentimientos sospechosos.
- Persisten envíos tras neutralización de regla.
- El usuario niega la actividad y hay inicios anómalos correlacionados.

### Falsos positivos que debes considerar

- Reenvío a despacho contable autorizado y contrato vigente.
- Automatización de helpdesk/CRM que usa reglas legítimas.
- Migración de buzones o delegación temporal aprobada.
- Regla creada pero política outbound la bloquea y no hubo entregas.
- Modificación inocua Set-Mailbox sin parámetro de reenvío.

### Errores típicos que debes evitar

- Cerrar solo porque la regla fue eliminada, sin revisar mensajes previos.
- Confundir InboxRule, mailbox forwarding y transport rules.
- Confundir regla creada con exfiltración confirmada.
- Olvidar reglas similares en otros buzones o acceso delegado.
- Ignorar política de reenvío externo y message trace.
- Compartir correos potencialmente confidenciales durante investigación.

### Perspectiva Red Team y Blue Team

El control de un buzón permite crear mecanismos de recolección de correo para persistir acceso a mensajes futuros. La técnica puede incluir reglas de redirección, reenvío de adjuntos o manipulación para ocultar correspondencia. Blue Team debe demostrar causalidad entre compromiso, configuración, entrega y contenido afectado: la simple existencia de una regla no es prueba de fuga efectiva.

### Respuesta modelo de entrevista

> Primero identificaría la regla, destinatario y configuración actual mediante Get-InboxRule y Get-Mailbox. Consultaría OfficeActivity/Purview para New-InboxRule, Set-InboxRule y Set-Mailbox, sus parámetros, autor y IP. Correlacionaría identidad/delegados y sign-ins, y usaría Message Trace y el reporte de auto forwarding para comprobar si los correos salieron realmente. Preservaría evidencias; si es no autorizado, detendría reenvío, revocaría accesos y revisaría otros buzones. Informaría del alcance real, diferenciando intentos, configuración y entrega.

### Checklist de autoevaluación

- [ ] Identifica tres vías de reenvío: Inbox, mailbox y transport.
- [ ] Usa OfficeActivity con Operation/Parameters reales.
- [ ] Verifica envío en Message Trace, no infiere exfiltración.
- [ ] Correlaciona delegados, app OAuth y sesiones.
- [ ] Preserva regla/auditoría antes de neutralizarla.
- [ ] Evalúa impacto de datos y privacidad.

**MITRE ATT&CK (hipótesis, salvo evidencia confirmatoria):** T1114.003 — Email Collection: Email Forwarding Rule (hipótesis)

### Fuentes oficiales y documentación de referencia

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/officeactivity
- https://learn.microsoft.com/en-us/purview/audit-log-activities
- https://learn.microsoft.com/en-us/defender-xdr/alert-grading-playbook-inbox-forwarding-rules
- https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-policies-external-email-forwarding
- https://learn.microsoft.com/en-us/purview/audit-log-identify-mailboxes
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-19"></a>
## N2-19 — Ransomware y tráfico SMB: detener la propagación sin perder el mapa de afectados

**Nivel:** SOC N2 · **Bloque:** Cloud, identidad y ataques avanzados

> **Pregunta de entrevista:** Un servidor presenta indicios de ransomware y observas conexiones SMB hacia otros equipos de la red. ¿Cómo identificarías el alcance y evitarías la propagación?

### Escenario y objetivo

A las 02:57 una estación de trabajo en el departamento legal registra creación acelerada de archivos con extensión desconocida. El servicio de archivos FS-02 informa fallos de acceso a carpetas compartidas y conexiones TCP/445 desde la estación y otros dos hosts. El EDR lanza una alerta de posible ransomware, pero la administración también ejecuta un backup incremental nocturno por SMB. La empresa necesita mantener activos los sistemas de facturación, pero existe riesgo de cifrado lateral.

**Objetivo operativo:** Detener cifrado o movimiento lateral activo, delimitar equipos y shares afectados mediante identidad, red, procesos y operaciones de fichero; preservar forense y preparar recuperación desde copias limpias, distinguiendo tráfico SMB legítimo de escritura/cifrado no autorizado.

### Hipótesis y alternativas

- Ransomware ejecutándose en estación y cifrando recursos locales/remotos por SMB.
- Herramientas administrativas o backup están haciendo operaciones SMB intensivas y generando anomalías no maliciosas.
- Credenciales comprometidas están usándose contra shares; el proceso responsable podría ejecutarse en otro endpoint.
- Existen varios focos de infección, lateral movement o despliegue simultáneo en servidores distintos.
- Los cambios en archivos pertenecen a mantenimiento legítimo y alertas coinciden con tareas programadas.

### Procedimiento paso a paso

**1 · Prioridad: contener daño activo** — Con confirmación razonable de cifrado activo, activar IR ransomware, coordinar aislamiento EDR de equipos de origen y restricción temporal SMB por segmentos en red; no esperar a un indicador de firma perfecta. Evaluar servicios críticos y mecanismos seguros de recuperación.

**2 · Preservar instantánea de situación** — Registrar hora UTC, alertas MDE, equipos, sesiones SMB, IP, credenciales, procesos, unidades montadas y ubicación de notas de rescate; preservar copias de logs independientes. No negociar o pagar desde consola SOC.

**3 · Distinguir conexión de escritura** — Usar DeviceNetworkEvents para conexiones hacia puerto 445 y orígenes; correlacionar con DeviceFileEvents en equipos protegidos, FileServer audit, Sysmon 11, Security 5140/5145 si auditadas. La conexión 445 no demuestra cifrado.

**4 · Identificar procesos y usuarios** — Cruzar InitiatingProcessId + CreationTime + DeviceId, línea de comandos, hash, ruta y cuenta; DeviceLogonEvents/Windows 4624 tipo 3 y 4672 cuando corresponda. Preguntar por backup y herramientas de despliegue aprobadas.

**5 · Expandir perímetro** — Construir grafo host origen → destino SMB, shares, cuenta y momento. Buscar patrón idéntico de cambios de archivo, procesos o inicios de sesión en otros segmentos, incluidos sistemas sin EDR. Comprobar DC y servidores de backup.

**6 · Revisar posible sabotaje** — Investigar intentos de borrar shadow copies, cambios de backup, detenciones de servicios y manipulación de Defender mediante telemetría. Un comando por sí solo es indicador, no prueba que se ejecutó correctamente.

**7 · Proteger backups y claves** — Segregar cuentas privilegiadas, apagar rutas de escritura no autorizadas a repositorios de backup e identificar copias inmutables/offline. No conectar respaldos a red comprometida hasta verificación de integridad.

**8 · Coordinar erradicación y restauración** — Con IR/forense eliminar acceso atacante y persistencia, definir equipos limpios, recuperar desde backup verificado, rotar credenciales afectadas con secuencia y probar servicios por fases en redes controladas.

**9 · Verificar y cerrar** — Confirmar que no hay nuevas modificaciones masivas ni SMB sospechoso, validar EDR, autenticaciones y backups, cuantificar carpetas/cuentas/datos, registrar tiempos y lecciones de segmentación/ransomware.

### Evidencias e interpretación

| Origen de telemetría | Significado y limitaciones |
|---|---|
| MDE DeviceNetworkEvents: RemotePort 445, InitiatingProcess* | Conexión a SMB y proceso iniciador cuando recogido; no verifica operación de escritura/cifrado. |
| MDE DeviceFileEvents: ActionType, FolderPath, FileName, InitiatingProcess* | Actividad de ficheros en endpoints instrumentados; debe correlacionarse con proceso, fuente y volumen. |
| Windows Security 5140/5145 y 4624 tipo 3 si auditados | Acceso a shares y autenticaciones; su disponibilidad requiere políticas de auditoría y permisos. |
| Windows Sysmon ID 1/3/11 según configuración | Creación de procesos, conexiones y ficheros; ID3 no siempre se recolecta por coste. |
| Controlador de dominio, NAS, firewall/NetFlow y backup | Amplía a hosts sin EDR, directorios, accesos y posibles sabotajes de backup. |
| EDR alerts, hashes, notas de rescate, extensiones y sombra de volumen | Conjunto de señales para distinguir cifrado malicioso de operaciones legítimas. No abrir muestras en producción. |

### KQL — consultas de investigación

#### Defender XDR · detectar orígenes que contactan SMB 445

**Entorno y requisitos:** DeviceNetworkEvents en Defender XDR Advanced Hunting con MDE. RemotePort es puerto del extremo remoto, no transferencia confirmada.

```kql
DeviceNetworkEvents
| where Timestamp >= ago(24h)
| where RemotePort == 445
| summarize Conexiones=count(), Destinos=dcount(RemoteIP),
            ListaDestinos=make_set(RemoteIP, 20),
            Procesos=make_set(InitiatingProcessFileName, 12),
            Primera=min(Timestamp), Ultima=max(Timestamp)
    by DeviceId, DeviceName, InitiatingProcessAccountName
| where Conexiones >= 10
| order by Destinos desc, Conexiones desc
```

**Interpretación:** Prioriza equipos con fan-out SMB anómalo para correlacionar con creación/modificación de archivos y autenticaciones.

**Limitaciones:** El umbral 10 es ilustrativo y puede captar backup/administración. DeviceNetworkEvents no mide bytes transferidos ni prueba cifrado.

#### Defender XDR · movimientos de archivos en un host afectado

**Entorno y requisitos:** DeviceFileEvents MDE del host confirmado (ficticio WS-LEGAL-01); usar telemetría de archivo disponible.

```kql
DeviceFileEvents
| where Timestamp >= ago(24h)
| where DeviceName startswith "WS-LEGAL-01"
| summarize Cambios=count(), Rutas=dcount(FolderPath),
            Ejemplos=make_set(FileName, 10),
            Tipos=make_set(ActionType, 10)
    by bin(Timestamp, 5m), InitiatingProcessFileName,
       InitiatingProcessAccountName
| where Cambios >= 30
| order by Timestamp asc
```

**Interpretación:** Expone ráfagas de eventos de fichero por proceso/cuenta; correlacionar con 445 y extensiones.

**Limitaciones:** No todos los cambios de red quedan reportados en el endpoint origen; ActionType puede variar y los umbrales dependen de volumen. Los eventos no demuestran cifrado de contenido.

### SPL — consultas de investigación

#### Splunk · posibles orígenes con fan-out SMB

**Entorno y requisitos:** index=firewall ejemplo con src_ip, dest_ip, dest_port y action; extraer columnas correctamente.

```spl
index=firewall earliest=-24h dest_port=445
| stats count as sesiones dc(dest_ip) as destinos values(dest_ip) as destinos_muestra
        by src_ip
| where sesiones >= 10 AND destinos >= 3
| sort - destinos - sesiones
```

**Interpretación:** Identifica hosts con muchas conexiones a múltiples destinos SMB para investigar progresión.

**Limitaciones:** No afirma éxito SMB ni cifrado: firewall puede registrar bloqueos, retransmisiones y conexiones legítimas de backup.

#### Splunk · picos de operaciones de archivo por proceso

**Entorno y requisitos:** index=edr_file ejemplo con host, process_name, file_path, action (normalizados del EDR).

```spl
index=edr_file earliest=-24h
| bin _time span=5m
| stats count as operaciones dc(file_path) as archivos
        values(action) as acciones by _time host process_name
| where operaciones > 30
| sort 0 _time
```

**Interpretación:** Detecta ráfagas con muchos archivos afectados para cruzar con proceso, host y SMB.

**Limitaciones:** La instrumentación EDR es heterogénea y el umbral 30 no es universal; depende de baseline y tipo de acción.

### Comandos de observación / referencia

**Windows PowerShell / solo lectura** — Consultar conexiones SMB en host donde se investiga, sin cerrar sesiones.

```powershell
Get-NetTCPConnection -RemotePort 445 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess
```

**Windows PowerShell / solo lectura** — Consultar sesiones/conexiones SMB del cliente cuando existan.

```powershell
Get-SmbConnection |
  Select-Object ServerName,ShareName,Dialect,NumOpens,UserName
```

**Windows PowerShell / solo lectura** — Consultar sesiones del servidor de archivos si se tiene autorización.

```powershell
Get-SmbSession | Select-Object ClientComputerName,ClientUserName,NumOpens
```

**Procedimiento de emergencia / NO ejecutar sin autoridad** — Ejemplo de control temporal en firewall/EDR, no instrucción ejecutable genérica.

```bash
# CAMBIO DE RED: aislar SOLO hosts afectados bajo playbook.
# No bloquear globalmente TCP/445 sin plan de continuidad.
# Registrar regla, owner, timestamp, alcance y criterio de rollback.
```

### Contención y recuperación

Si hay cifrado activo de alta confianza, el daño avanza más rápido que una investigación completa. Aislar endpoints de origen mediante EDR cuando sea viable y/o cortar rutas SMB hacia shares críticos a nivel de red, limitar credenciales y proteger backup. Evitar apagar masivamente DC/NAS o cortar todo 445 sin analizar dependencia. Verificar ausencia de nuevas escrituras sospechosas y coordinar con negocio restauración secuenciada desde respaldos verificados.

### Cuándo escalar

- Cifrado/renombre masivo en hosts y shares de producción.
- Muchos destinos SMB desde una cuenta o equipo sin justificación.
- Backups, DC o NAS atacados o sin aislamiento efectivo.
- Credenciales privilegiadas o indicios de múltiples puntos de ejecución.
- Exfiltración previa o extorsión con datos: activar equipos legales y privacidad.

### Falsos positivos que debes considerar

- Backup incremental por SMB con acceso masivo a archivos.
- Antivirus/EDR que escanea shares o indexadores de búsqueda.
- Migración NAS, restauración masiva y sincronización de carpetas.
- Despliegue de software vía recursos compartidos.
- Actividad de carpetas de archivos de alto volumen en cierre contable.

### Errores típicos que debes evitar

- Suponer que 445 demuestra ransomware.
- Esperar horas al IoC perfecto mientras hay cifrado activo.
- Bloquear SMB en toda la empresa sin evaluar servicios críticos.
- Matar proceso sin preservar evidencia ni buscar otros hosts.
- Reconectar backups a red comprometida antes de validar limpieza.
- Olvidar shares, cuentas, servidores sin EDR y posible exfiltración previa.

### Perspectiva Red Team y Blue Team

Los grupos de ransomware pueden aprovechar credenciales y permisos preexistentes para acceder a shares y host remotos; la propagación lateral no requiere necesariamente el mismo binario cifrador en cada host. En Blue Team hay que separar conexión al servicio SMB, autenticación, operaciones sobre archivos y evidencia de cifrado real. La correlación por grafo, cuentas y ventana temporal permite conocer el alcance sin atribuir a un único proceso todos los cambios de la red.

### Respuesta modelo de entrevista

> Si confirmo indicios de cifrado activo, activaría IR y contendría de inmediato los endpoints de origen y sus rutas SMB, de forma proporcionada y coordinada con infraestructura. Usaría DeviceNetworkEvents para identificar origen y destinos 445, y DeviceFileEvents, auditoría 5140/5145, EDR, sesiones y backups para confirmar qué archivos/cuentas se afectaron. Compararía con el backup nocturno para descartar actividad legítima, ampliaría alcance a hosts sin EDR y protegería backups. Restauraría únicamente con red limpia, credenciales saneadas y verificación de ausencia de nuevas escrituras maliciosas.

### Checklist de autoevaluación

- [ ] Prioriza detener cifrado activo con contención proporcionada.
- [ ] No confunde 445 con ransomware demostrado.
- [ ] Distingue red, autenticación y escrituras de ficheros.
- [ ] Conoce 5140/5145 según auditoría y EDR MDE.
- [ ] Protege backups, DC y servicios críticos.
- [ ] Verifica ausencia de actividad antes de recuperación.

**MITRE ATT&CK (hipótesis, salvo evidencia confirmatoria):** T1486 — Data Encrypted for Impact (hipótesis), T1021.002 — Remote Services: SMB/Windows Admin Shares (según evidencia)

### Fuentes oficiales y documentación de referencia

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicefileevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-20"></a>
## N2-20 — Persistencia tras contención: investigación sistemática antes de restaurar

**Nivel:** SOC N2 · **Bloque:** Cloud, identidad y ataques avanzados

> **Pregunta de entrevista:** Has contenido un incidente, pero sospechas que el atacante mantiene persistencia mediante tareas programadas, servicios y mecanismos alternativos. ¿Cómo realizarías una investigación sistemática antes de restaurar el servicio?

### Escenario y objetivo

Un servidor Windows y un Linux fueron aislados tras acceso administrativo no autorizado. Se detectó un proceso extraño ya finalizado, pero hay señales de tareas nuevas, una cuenta local inesperada y un servicio de inicio automático. El equipo de aplicaciones presiona para restaurarlos. El EDR parece saludable, aunque se desconoce si la telemetría comenzó antes del ataque. El objetivo no es buscar un único cron: debes revisar superficies de persistencia y validar una restauración confiable.

**Objetivo operativo:** Determinar mecanismos de persistencia activos o latentes y alcance de accesos residuales, reconstruir línea temporal sin asumir que una búsqueda negativa prueba limpieza; escoger erradicación o reconstrucción limpia y verificar identidad, configuración, red y registros antes del retorno a producción.

### Hipótesis y alternativas

- Una tarea, servicio o unidad systemd/cron ejecuta código o conexión de acceso persistente.
- Cuentas/roles, SSH authorized_keys, tokens OAuth, claves de nube o delegaciones proporcionan persistencia sin proceso local.
- Run keys, WMI, Winlogon, autoruns, launch agents (si aplica) o DLL side loading permanecen fuera de la búsqueda inicial.
- Hay mecanismos legítimos de backup, mantenimiento, EDR o MDM con apariencia sospechosa.
- La persistencia reside en otro equipo y este servidor volverá a ser comprometido tras reconectarlo.

### Procedimiento paso a paso

**1 · Fijar criterios de retorno** — Definir quién autoriza volver a producción, servicios críticos, indicadores previos, alcance temporal, dependencia de identidades y criterio verificable de limpieza. Mantener aislamiento hasta decisión del responsable IR.

**2 · Preservar y adquirir** — Guardar timeline EDR, hashes, copia forense y artefactos volátiles cuando sea viable, logs centralizados y snapshots coherentes; documentar cadena de custodia. Evitar reinicio/remoción impulsiva que afecte evidencia.

**3 · Enumerar Windows** — Comparar Scheduled Tasks, servicios, Autoruns, Run/RunOnce, WMI subscription, cuentas locales/grupos, RDP y cambios de ACL con baseline/cambios aprobados. Registrar ruta, firma, fecha, autor y comando real. La sola presencia de tarea no demuestra malicia.

**4 · Enumerar Linux** — Revisar cron de usuarios y sistema, /etc/cron.*, systemd units/timers usuario y sistema, rutas de ejecución, SSH authorized_keys, /etc/passwd/sudoers y modificaciones de shell profiles. `crontab -e` no es instrumento de auditoría; usar listados y lectura.

**5 · Explorar persistencia externa** — Investigar IAM/Entra/AD, nuevas cuentas/roles, consentimientos OAuth, cambios de claves, certificados, service principals y credenciales de automatización; verificar que no quedan rutas por VPN y otras máquinas comprometidas.

**6 · Reconstruir causalidad** — Correlacionar creación de servicios/tareas con 4697, 4698, 4702, 7045 cuando estén auditados, Sysmon, Windows 4688/EDR; en Linux journal/auditd/EDR y hash de binarios. Distinguir la creación del artefacto y su ejecución posterior.

**7 · Verificar control de red y malware** — Buscar conexiones persistentes C2, backdoors, inicios no autorizados, cambios de políticas y exclusiones EDR; verificar integridad, kernel/firmware según riesgo y posibles alteraciones de logs. Reconocer límites de ausencia de hallazgos.

**8 · Erradicar o reconstruir** — En compromiso privilegiado de raíz o sistema, preferir reconstrucción desde imagen y artefactos confiables donde se requiera alta garantía. Rotar credenciales afectadas desde sistemas limpios, revisar roles de confianza y restaurar únicamente datos verificados.

**9 · Prueba de aceptación en red controlada** — Comprobar servicios limpios, hashes/firmas, control EDR, cuentas, timers, accesos no autorizados, conexiones salientes, reglas de red y backups. Reintroducir por fases y monitorizar con umbrales y rollback definidos.

**10 · Documentar cobertura residual** — Anotar fuentes no disponibles, tiempo de retención insuficiente, dispositivos no instrumentados, supuestos pendientes, propietarios que aceptan riesgo y medidas preventivas. «No encontramos nada» no equivale a «host limpio».

### Evidencias e interpretación

| Origen de telemetría | Significado y limitaciones |
|---|---|
| Windows Security 4698/4702 (si auditoría), System 7045, 4697 (si auditado) | Creación/modificación de tareas/servicios, con diferencias de canal/versión. Ausencia no garantiza que no existen. |
| DeviceProcessEvents y DeviceRegistryEvents | Correlacionan ejecuciones y cambios de Run/servicios; algunos artefactos no generan eventos si sensor estaba apagado. |
| Autoruns, Scheduled Tasks, services, WMI, ACLs, cuentas | Estado actual y artefactos comparables contra baseline/CMDB, no equivalen a historial completo. |
| Linux: systemctl list-unit-files/list-timers, crontab -l, /etc/cron*, auditd, journalctl | Enumeración de persistencia posible en Linux; sistemas con contenedores y rootless users necesitan fuentes adicionales. |
| SSH authorized_keys, sudoers, identidad cloud/AD, consentimientos OAuth | Persistencia no limitada al host; investigar confianza y permisos. |
| EDR red, DNS, IAM, firewall y snapshots de configuración | Valida comunicación anómala y estado tras remediación, sujeto a cobertura y retención. |

### KQL — consultas de investigación

#### Defender XDR · procesos relacionados con tareas y servicios

**Entorno y requisitos:** DeviceProcessEvents MDE; nombres de proceso y argumentos de ejemplo para hunting, no detección definitiva.

```kql
DeviceProcessEvents
| where Timestamp >= ago(14d)
| where FileName in~ ("schtasks.exe", "sc.exe", "powershell.exe",
                      "pwsh.exe", "wmic.exe")
| where ProcessCommandLine has_any ("/create", "create", "Register-ScheduledTask",
                                     "New-Service", "Set-Service", "__EventFilter")
| project Timestamp, DeviceName, AccountName, FileName,
          ProcessCommandLine, ProcessId, ProcessCreationTime,
          InitiatingProcessFileName, InitiatingProcessCommandLine
| order by Timestamp desc
```

**Interpretación:** Encuentra comandos de administración relevantes a contrastar con inventario y eventos; ampliar a técnicas distintas.

**Limitaciones:** Es hunting por cadena, no exhaustivo: APIs directas, WMI, tareas GUI, ofuscación o binarios alternativos pueden no detectarse; evitar declarar limpio si no hay resultados.

#### Defender XDR · cambios de claves de inicio automático

**Entorno y requisitos:** DeviceRegistryEvents MDE y claves típicas Run/RunOnce. Investigar solo si se dispone de telemetría.

```kql
DeviceRegistryEvents
| where Timestamp >= ago(14d)
| where RegistryKey contains @"\CurrentVersion\Run"
| project Timestamp, DeviceName, ActionType, RegistryKey,
          RegistryValueName, RegistryValueData,
          InitiatingProcessFileName, InitiatingProcessCommandLine
| order by Timestamp desc
```

**Interpretación:** Recupera cambios de Run keys, procesos responsables y valores para verificación.

**Limitaciones:** No cubre servicios, WMI, COM, controladores, bootkits ni persistencia fuera de registro. `has_any` no siempre representa bien rutas; ajustar `contains` por cadena real y datos.

### SPL — consultas de investigación

#### Splunk · tareas, servicios y cuentas creados/modificados

**Entorno y requisitos:** index=wineventlog con eventos Security/System y EventCode extraído; 4698/4702 pueden faltar por auditoría.

```spl
index=wineventlog earliest=-14d (EventCode=4698 OR EventCode=4702
 OR EventCode=7045 OR EventCode=4697 OR EventCode=4720 OR EventCode=4732)
| table _time host EventCode SubjectUserName ServiceName
        TaskName AccountName MemberName Message
| sort 0 _time
```

**Interpretación:** Da línea temporal de cambios persistentes y cuentas a correlacionar con comandos.

**Limitaciones:** Campos varían según EventCode y TA; 7045 es del canal System. La auditoría no captura todas las vías.

#### Splunk · procesos de administración sospechosos

**Entorno y requisitos:** index=edr ejemplo con process_name, process y user normalizados; revisar fuente antes de producción.

```spl
index=edr earliest=-14d
(process_name="schtasks.exe" OR process_name="sc.exe"
 OR process_name="powershell.exe" OR process_name="wmic.exe")
| search ("/create" OR "New-Service" OR "Register-ScheduledTask" OR "__EventFilter")
| table _time host user process_name parent_process process
| sort 0 _time
```

**Interpretación:** Encuentra candidatos para pivote hacia procesos padres y artefactos en disco.

**Limitaciones:** No detecta uso de APIs directas, persistencia exclusiva de Linux ni todas las formas de ejecución legítima. Es triage.

### Comandos de observación / referencia

**Windows PowerShell / solo lectura** — Enumerar tareas y acciones para comparar con baseline aprobado.

```powershell
Get-ScheduledTask |
  Select-Object TaskPath, TaskName, State, Actions, Principal |
  Format-List
```

**Windows PowerShell / solo lectura** — Enumerar servicios y sus rutas/identidades.

```powershell
Get-CimInstance Win32_Service |
  Select-Object Name, StartMode, State, PathName, StartName |
  Sort-Object Name
```

**Linux / solo lectura** — Revisar timers y unidades de arranque del sistema sin editar.

```bash
systemctl list-unit-files --type=service --state=enabled
systemctl list-timers --all
sudo crontab -l
ls -la /etc/cron.* /etc/crontab 2>/dev/null
```

**Linux / solo lectura** — Revisar cron y timers de usuario y logs relevantes. Puede haber varias cuentas.

```bash
crontab -l
systemctl --user list-timers --all
sudo journalctl --since '24 hours ago' --no-pager | tail -n 120
```

### Contención y recuperación

Mantener aislamiento hasta contar con un plan de retorno aprobado y cobertura suficiente de hosts, identidades y red. En compromiso de alto privilegio o integridad del sistema dudosa, no confiar en eliminar una tarea y devolver producción: reconstruir sobre base confiable y rotar credenciales desde estación limpia. Validar ausencia de nuevas ejecuciones, autenticaciones y conexiones sospechosas durante ventana de observación y tener rollback/monitorización intensificada.

### Cuándo escalar

- Persistencia con privilegios SYSTEM/root, DC, IAM o servidor de backups.
- Servicios/tareas extraños reaparecen tras neutralización.
- EDR estuvo deshabilitado o carecen de logs clave para garantizar integridad.
- Compromiso de tokens, cuentas, claves SSH o accesos fuera del host.
- Presión de restauración sin evidencia de contención efectiva ni criterios de aceptación.

### Falsos positivos que debes considerar

- Herramienta RMM, backup o inventario corporativo con servicios/autostart.
- Actualizadores firmados y tareas de sistema operativo.
- Tareas cron legítimas de mantenimiento con nombres poco documentados.
- Service principals y SSH keys de automatización autorizada.
- Cambios ejecutados por playbooks IR o herramientas de gestión durante contención.

### Errores típicos que debes evitar

- Buscar solo crontab -e y declarar host limpio.
- Eliminar archivos/tareas antes de capturar pruebas.
- Confundir servicios autorun legítimos con persistencia sin validación.
- Olvidar servicios de usuario, systemd rootless, IAM y OAuth.
- Reinstalar aplicación sobre SO posiblemente manipulado y reconectar sin control.
- Rotar únicamente contraseña del usuario y olvidar tokens/keys/sesiones.

### Perspectiva Red Team y Blue Team

La persistencia puede ser local (autoruns, scheduled tasks, servicios, systemd, SSH) o de identidad/control plane (roles, claves, OAuth). El actor puede tolerar la eliminación de un proceso si conserva otra ruta de acceso. Blue Team necesita hipótesis múltiples, baseline confiable, correlación temporal y controles de retorno. Ausencia de eventos puede significar simplemente ausencia de telemetría.

### Respuesta modelo de entrevista

> No restauraría basándome solo en haber matado el proceso inicial. Preservaría evidencia y enumeraría tareas, servicios, Run keys, WMI y cuentas en Windows; cron, systemd, SSH y sudoers en Linux. Correlacionaría artefactos con procesos, eventos 4698/4702/7045, EDR y registros centralizados. Buscaría persistencia de identidad en AD/Entra/IAM y otros hosts. Si hubo privilegios elevados o integridad incierta, reconstruiría desde origen confiable, rotaría credenciales y validaría en red controlada con monitorización antes de producción. El criterio de cierre debe ser verificable, no ausencia de un solo IOC.

### Checklist de autoevaluación

- [ ] No confunde contención con erradicación.
- [ ] Enumera múltiples persistencias Windows y Linux.
- [ ] Considera identidades, tokens y otras máquinas.
- [ ] Evita editar/borrar antes de preservar y verificar.
- [ ] Propone reconstrucción limpia en casos de alto riesgo.
- [ ] Define criterios de aceptación para restauración y monitoreo.

**MITRE ATT&CK (hipótesis, salvo evidencia confirmatoria):** T1053 — Scheduled Task/Job (hipótesis), T1543 — Create or Modify System Process (hipótesis), T1098 — Account Manipulation (según evidencia)

### Fuentes oficiales y documentación de referencia

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceregistryevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

## Guía transversal para responder incidentes SOC N2 en una entrevista

1. Identificar qué se observó y cuál es el riesgo activo para personas, datos y servicios.
2. Declarar hipótesis competitivas: malicioso, administración legítima, falla de sensor e interpretación errónea.
3. Validar la fuente concreta: esquema, campo, timestamp UTC, política de auditoría, permisos, retención y sesgo de ingesta.
4. Correlacionar identidad, proceso, dispositivo, recurso y acciones posteriores; distinguir intento, éxito, impacto y alcance.
5. Acordar contención proporcional, preservar evidencia y verificar que el daño se detuvo (no solo que se aplicó una regla).
6. Erradicar accesos residuales (tokens, STS, reglas, cuentas o persistencia), recuperar y documentar puntos ciegos.

## Diferencias de telemetría que no deben confundirse

| Fuente | Plataforma | Fecha base | Cuidado con |
|---|---|---|---|
| SigninLogs / OfficeActivity / AWSCloudTrail | Sentinel/Log Analytics | TimeGenerated | Conector/licencia/esquema variable |
| DeviceNetworkEvents / DeviceFileEvents | Defender XDR Advanced Hunting | Timestamp | Requiere sensor MDE |
| Audit Purview + Message Trace | Microsoft 365 / Exchange | UTC del servicio | Cambio de regla ≠ entrega |
| CloudTrail Event History | AWS / por región | eventTime | 90 días y management/Insights, no S3 data events por defecto |
| Windows Security / Sysmon / Linux journal | Endpoint / SIEM | Hora original + UTC | Requiere auditoría previa y retención |

## Integración del JSON en la web SOC-RESPONSES

- Los objetos `preguntas` conservan el esquema exacto de las tandas anteriores; IDs N2-16 a N2-20 son únicos.
- La interfaz puede separar pregunta, investigación, KQL, SPL, comandos, decisiones, entrevista y checklist.
- KQL y SPL incluyen por consulta nombre, entorno, texto, interpretación y límites; nunca ejecutar desde la web sin control de acceso.
- La web pública no debe contener datos de incidentes reales, secretos, credenciales ni muestras originales potencialmente privadas.
- Validación sintáctica de JSON y de cantidades ≠ ejecución de consultas ni validación de todas las fuentes en un entorno de producción.

**Estado de revisión:** 5 preguntas · 10 KQL · 10 SPL · compatibilidad con las tandas 01–07 verificada a nivel estructural.

