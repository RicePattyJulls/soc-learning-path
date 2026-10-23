# SOC-RESPONSES — Tanda 01 | SOC N1: monitorización y triaje

**Escenarios:** N1-01 a N1-05 · **Revisión documental:** 18/10/2026 · **Contenido:** procedimientos operativos, hipótesis, KQL, SPL, evidencia, escalado, errores y respuestas de entrevista.

> **Uso técnico:** los comandos y consultas son plantillas didácticas contrastadas con documentación de esquema, no probadas contra tu tenant Sentinel/Defender ni contra una instancia real de Splunk. Comprueba datos ingeridos, campos, permisos, retención, fuentes, umbrales y autorización de contención antes de usarlos en producción.

> **Diferencia crucial:** `SigninLogs` y `SecurityAlert` son ejemplos para **Sentinel / Log Analytics**; `EmailEvents`, `UrlClickEvents`, `AlertInfo`, `Device*` son ejemplos para **Defender XDR Advanced Hunting**. No copies indistintamente entre consolas. Splunk presupone mapeo CIM.

## Índice

- [N1-01 — 150 inicios de sesión fallidos contra una cuenta](#n1-01)
- [N1-02 — Inicio exitoso desde Rusia con usuario en Madrid](#n1-02)
- [N1-03 — Defender detecta malware y lo pone en cuarentena](#n1-03)
- [N1-04 — Correo sospechoso reportado sin clic](#n1-04)
- [N1-05 — 300 alertas en 10 minutos: priorización bajo presión](#n1-05)

---

<a id="n1-01"></a>
## N1-01 — 150 inicios de sesión fallidos contra una cuenta

**Nivel:** N1 · **Bloque:** Monitorización y triaje

> **Pregunta de entrevista:** Son las 03:00 y Microsoft Sentinel genera una alerta de 150 intentos de inicio de sesión fallidos contra una misma cuenta. ¿Qué revisarías primero y cómo determinarías si es un ataque real?

### Escenario y objetivo

Alerta simulada: alice@empresa.example acumula 150 fallos en 10 minutos. El servicio afectado usa Microsoft Entra ID, pero aún no conoces la IP de origen, si existió un inicio exitoso ni si el usuario estaba trabajando. La cifra aislada no demuestra intrusión: es un indicador que requiere contexto.

**Objetivo:** Distinguir fallos benignos, fuerza bruta concentrada y password spraying, y descubrir si el atacante consiguió autenticarse o está causando denegación de servicio por bloqueo.

### Hipótesis a contrastar

- Fuerza bruta o adivinación repetida contra una cuenta, desde una o más IP.
- Contraseña guardada desactualizada en móvil, aplicación, servicio o cliente legacy: muchos fallos con origen y patrón estables.
- Password spraying si al ampliar la búsqueda se observan muchas cuentas con pocos intentos por cada una, desde una IP o red común.
- Actividad de un proxy corporativo o VPN: una IP compartida no identifica por sí sola a un atacante.

### Procedimiento operativo, paso a paso

**0. Verificar alerta** — Confirmar hora UTC, regla, ventana de agregación, cuenta/tenant, severidad, origen de datos, duplicados y estado de ingestión. 150 eventos pueden ser 150 intentos, no 150 contraseñas diferentes.

**1. Medir patrón** — Agrupar por intervalos y por IP; inspeccionar ResultType/Status, aplicación, user agent, device, ubicación y protocolo. Distinguir una ráfaga de un flujo sostenido.

**2. Buscar éxito asociado** — Ampliar 30–60 min antes/después e identificar autenticaciones exitosas de la cuenta, especialmente desde IP/dispositivo desconocidos. Un éxito eleva considerablemente la prioridad, pero no prueba por sí solo que el actor sea adversario.

**3. Evaluar alcance** — Buscar otras cuentas impactadas por IP/ASN y determinar si hay bloqueos, riesgos de identidad, MFA anómala o cambios posteriores en credenciales/registro de métodos.

**4. Contactar y escalar** — Confirmar de forma segura con usuario o mesa de ayuda (canal independiente), documentar evidencia y escalar según criterios de compromiso o spray distribuido.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| UserPrincipalName + ResultType | Qué cuenta y qué resultado; revisar motivo real de fallo en Status y no asumir que todos son contraseña incorrecta. |
| IPAddress + AppDisplayName + bin(TimeGenerated,5m) | Origen lógico, servicio y frecuencia; IP de NAT/VPN puede representar múltiples personas. |
| DeviceDetail, UserAgent, LocationDetails | Contexto adicional de cliente y ubicación, no identificación fehaciente. |
| ConditionalAccessStatus, AuthenticationRequirement, AuthenticationDetails | Aplicación de controles; MFA exigida no equivale necesariamente a sesión segura. |
| Eventos exitosos y auditoría posterior | Determinar si hubo acceso y actividad anómala después de los fallos. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics: intentos por IP y franja

**Requisito:** Microsoft Sentinel — SigninLogs con registros de inicio de sesión interactivo de Entra ID ingeridos.

```kql
let usuario = "alice@empresa.example";
SigninLogs
| where TimeGenerated > ago(2h)
| where UserPrincipalName =~ usuario
| summarize Fallidos=countif(ResultType != "0"),
            Exitosos=countif(ResultType == "0"),
            Codigos=make_set(ResultType, 10),
            Apps=make_set(AppDisplayName, 10)
    by bin(TimeGenerated, 5m), IPAddress
| order by TimeGenerated asc, Fallidos desc
```

**Interpretación:** Ráfagas por IP y ventana; si existen éxitos, revisar eventos originales con detalles de autenticación y secuencia temporal.

**Límites:** ResultType no necesariamente representa un password erróneo: consultar Status. SigninLogs suele registrar inicios interactivos; los no interactivos y cuentas de servicio pueden estar en otras tablas.


#### Sentinel / Log Analytics: ampliar a varias cuentas

**Requisito:** Microsoft Sentinel — SigninLogs.

```kql
SigninLogs
| where TimeGenerated > ago(1h)
| where ResultType != "0"
| summarize Fallos=count(), Usuarios=dcount(UserPrincipalName),
            MuestraUsuarios=make_set(UserPrincipalName, 15)
    by IPAddress
| where Fallos >= 20 or Usuarios >= 5
| order by Usuarios desc, Fallos desc
```

**Interpretación:** Una IP contra muchas cuentas sugiere spraying, aunque servicios compartidos pueden imitar este patrón. Los umbrales son ejemplos para triaje, no reglas universales.

**Límites:** Las técnicas distribuidas usan varias IP y podrían pasar inadvertidas; NAT corporativo puede generar falsos positivos.


### SPL: consultas de investigación

#### Splunk CIM Authentication: secuencia de fallos y éxitos

**Requisito:** Splunk con autenticaciones normalizadas al CIM (campos user, src, action).

```spl
tag=authentication earliest=-2h user="alice@empresa.example"
| bin _time span=5m
| stats count(eval(action="failure")) AS fallidos
        count(eval(action="success")) AS exitosos
        values(signature) AS motivos
  BY _time user src
| sort _time - fallidos
```

**Interpretación:** Comparar distribuciones y localizar éxitos asociados a fallos.

**Límites:** La búsqueda supone field mapping CIM correcto. signature puede no contener el código de error original; consultar raw events.


#### Splunk CIM Authentication: posible spray

**Requisito:** Splunk con CIM Authentication.

```spl
tag=authentication earliest=-1h action=failure
| stats count AS fallos dc(user) AS usuarios values(user) AS muestra_usuarios BY src
| where fallos>=20 OR usuarios>=5
| sort - usuarios - fallos
```

**Interpretación:** Identifica IP/host origen con múltiples cuentas afectadas.

**Límites:** Si src representa un proxy, ampliar con telemetría del proxy y cabeceras confiables.


### Comandos y notas operativas

**Windows/Entra:** No tocar el equipo inicialmente: recopilar Entra sign-in logs y ticket del usuario, con tiempo UTC. Los comandos de host no sustituyen los registros de autenticación en la nube.

```text
# Sin acción intrusiva inicial: preservar ID de alerta, IP, UPN y correlación.
```

### Contención y escalado

Si solo hay fallos y existe protección eficaz, no bloquear la cuenta a ciegas; valorar bloqueo temporal de IP/Conditional Access según política. Si hay sesión sospechosa o riesgo alto: escalado urgente para revocación de sesiones, restablecimiento seguro de credenciales, revisión de MFA y restricción de acceso. Las acciones requieren autorización y atención al impacto.

**Escalar cuando:**

- Inicio exitoso sospechoso después de la ráfaga.
- Cuenta privilegiada o identidad de alto valor afectada.
- Múltiples cuentas y/orígenes coordinados o señales de evasión MFA.
- Eventos posteriores de cambios de privilegios o accesos a información sensible.

### Falsos positivos / explicaciones alternativas

- Credencial caducada en aplicación automática.
- Cliente móvil reintentando con password antiguo.
- NAT corporativo, proxy o herramienta de pruebas aprobada.

### Errores frecuentes

- Concluir compromiso solo por 150 fallos.
- Confundir ataque de fuerza bruta contra una cuenta con password spraying contra muchas cuentas.
- Bloquear IP compartida o usuario crítico sin evaluar impacto.
- Cerrar sin buscar éxitos o sin comprobar ventana posterior.

### Perspectiva Red Team (defensiva)

La fuerza bruta concentrada intenta múltiples secretos para un usuario; el password spraying utiliza pocos secretos contra múltiples usuarios para reducir bloqueos. Ambos dejan patrones que deben correlacionarse con resultados exitosos y telemetría de identidad.

### Respuesta modelo en entrevista

> Primero validaría la regla y el resultado de autenticación, después agruparía los 150 fallos por IP, tiempo, aplicación y error. Buscaría éxitos posteriores y ampliaría a otras cuentas para diferenciar fuerza bruta, spraying o credenciales obsoletas. Confirmaría el contexto con el usuario y escalaría de inmediato si aparece un éxito anómalo, cuenta privilegiada o MFA sospechosa; solo aplicaría contención autorizada y documentada.

### Criterios de evaluación

- [ ] No equiparar fallos con acceso logrado.
- [ ] Saber separar fuerza bruta de spraying.
- [ ] Correlacionar éxitos, MFA y alcance.
- [ ] Evitar bloqueos disruptivos injustificados.

**MITRE ATT&CK contextual:** T1110.001, T1110.003

**Fuentes oficiales:**

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication

---

<a id="n1-02"></a>
## N1-02 — Inicio exitoso desde Rusia con usuario en Madrid

**Nivel:** N1 · **Bloque:** Monitorización y triaje

> **Pregunta de entrevista:** Recibes una alerta de inicio de sesión exitoso desde Rusia, pero el empleado asegura estar trabajando desde Madrid. ¿Qué evidencias buscarías antes de escalar?

### Escenario y objetivo

Entra ID informa de un inicio satisfactorio para bob@empresa.example desde una IP geolocalizada en Rusia. El empleado está en Madrid y afirma que no inició sesión mediante una VPN. No hay aún evidencia de cambio de contraseña ni de robo de sesión.

**Objetivo:** Determinar si la ubicación aparente se explica por VPN, geolocalización errónea, intermediarios legítimos o por uso no autorizado de credenciales/sesión.

### Hipótesis a contrastar

- IP de VPN/proxy/ZTNA empresarial o salida de proveedor cloud.
- Error o desactualización en la base geográfica de IP; ubicación no es prueba definitiva.
- Credenciales comprometidas, adversario usando una sesión válida o aprobación indebida de MFA.
- Inicio legítimo asociado a una aplicación o flujo de autenticación distinto al navegador habitual.

### Procedimiento operativo, paso a paso

**0. Validar identidad del evento** — Registrar UPN, Id/CorrelationId, IP, fecha UTC, app/recurso, ResultType, método de autenticación y Conditional Access. Un inicio satisfactorio en Entra implica que se satisfizo el flujo registrado, no necesariamente que el legítimo titular actuara.

**1. Contextualizar IP** — Consultar propietario/ASN, políticas de proxy y VPN/ZTNA, rangos corporativos y reputación. No adjudicar procedencia física a una persona por GeoIP.

**2. Comparar comportamiento** — Revisar otras sesiones del usuario (ventanas antes/después), DeviceDetail (deviceId, navegador, SO), user agent, apps accedidas, método/MFA, riesgo de identidad, patrones imposibles pero también viajes plausibles.

**3. Correlacionar actividad posterior** — Buscar cambios de métodos MFA, registro de nuevo dispositivo, consentimiento OAuth, creación de reglas de correo, archivos descargados, accesos a datos o actividad en endpoints.

**4. Confirmación independiente** — Contactar al usuario por canal conocido y al equipo de red, sin solicitar contraseñas ni códigos MFA. Si no se explica el evento, escalar para contención de sesión y credenciales.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| IPAddress + proveedor/ASN/VPN | Distingue punto de salida de ubicación física; una IP residencial o hosting no basta por sí sola. |
| ResultType, AppDisplayName y CorrelationId | Permite localizar la operación y qué aplicación recibió el inicio. |
| AuthenticationRequirement, AuthenticationDetails, ConditionalAccessStatus | Si se requirió MFA y qué ocurrió en cada paso; métodos y logs pueden tener limitaciones. |
| DeviceDetail, UserAgent, RiskLevelAggregated | Compara el cliente con el histórico; los campos de riesgo requieren licencias y pueden quedar ocultos. |
| Auditoría posterior | Indicadores de uso malicioso posterior al inicio: ajustes de seguridad, datos accedidos o tokens. |

### KQL: consultas de investigación

#### Sentinel: contexto completo de la cuenta

**Requisito:** Microsoft Sentinel — SigninLogs.

```kql
SigninLogs
| where TimeGenerated > ago(48h)
| where UserPrincipalName =~ "bob@empresa.example"
| extend Pais=tostring(LocationDetails.countryOrRegion),
         Ciudad=tostring(LocationDetails.city),
         SO=tostring(DeviceDetail.operatingSystem),
         Navegador=tostring(DeviceDetail.browser)
| project TimeGenerated, UserPrincipalName, IPAddress, Pais, Ciudad,
          ResultType, AppDisplayName, ConditionalAccessStatus,
          AuthenticationRequirement, RiskLevelAggregated,
          SO, Navegador, UserAgent, CorrelationId
| order by TimeGenerated desc
```

**Interpretación:** Contrastar IP, dispositivo, MFA y app con historial cercano; el campo país puede ser aproximado.

**Límites:** Los campos de riesgo podrían no estar disponibles sin Entra P2; detalle MFA puede estar en AuthenticationDetails (cadena JSON).


#### Sentinel: otras cuentas que usan la misma IP

**Requisito:** Microsoft Sentinel — SigninLogs.

```kql
let ip_a_revisar = "203.0.113.88";  // Sustituir por IP real
SigninLogs
| where TimeGenerated > ago(24h)
| where IPAddress == ip_a_revisar
| summarize Eventos=count(), Exitosos=countif(ResultType == "0"),
            Aplicaciones=make_set(AppDisplayName, 10)
  by UserPrincipalName
| order by Eventos desc
```

**Interpretación:** Si hay varios usuarios, valorar VPN/proxy empresarial o abuso de infraestructura común.

**Límites:** 203.0.113.88 es IP reservada de ejemplo, no un IOC.


### SPL: consultas de investigación

#### Splunk CIM: historial de sesiones de la cuenta

**Requisito:** Splunk CIM Authentication; src como dirección de origen.

```spl
tag=authentication earliest=-48h user="bob@empresa.example"
| stats count AS eventos
        values(action) AS resultados
        values(app) AS aplicaciones
        values(user_agent) AS user_agents
        min(_time) AS primera max(_time) AS ultima
  BY user src
| convert ctime(primera) ctime(ultima)
| sort - eventos
```

**Interpretación:** Correlacionar orígenes, aplicaciones y desviaciones históricas.

**Límites:** La geografía no forma parte obligatoria de CIM Authentication; depende de enrichment.


#### Splunk: GeoIP aproximada de éxitos recientes

**Requisito:** Splunk CIM Authentication con src como IP pública; iplocation habilitado.

```spl
tag=authentication earliest=-24h user="bob@empresa.example" action=success
| iplocation src
| table _time user src Country City app
| sort - _time
```

**Interpretación:** La geolocalización es una pista y no sustituye corroboración de VPN, identidad y dispositivo.

**Límites:** iplocation puede no devolver resultados para hostnames o IP internas; calidad variable.


### Comandos y notas operativas

**Operaciones:** La primera medida es conservar identificadores de la sesión y comprobar la ruta de red; no ejecutar comandos remotos ni solicitar códigos MFA al empleado.

```text
# Verificar con el equipo de red los rangos de egress VPN/ZTNA.
```

### Contención y escalado

Ante sospecha razonable de toma de cuenta, activar escalado: revocar sesiones/tokens según plataforma, forzar cambio de credenciales por canal seguro, revisar métodos MFA y restringir temporalmente acceso con controles aprobados. Si hay un impacto alto e indicadores sólidos, actuar con urgencia; si es VPN legítima, documentar el falso positivo y considerar ajuste de detección.

**Escalar cuando:**

- IP desconocida sin justificación de VPN y dispositivo nuevo.
- MFA inesperada, registro de nuevo método o anomalía de token.
- Cambios o acceso a recursos sensibles después de la sesión.
- Cuenta privilegiada o varios usuarios afectados.

### Falsos positivos / explicaciones alternativas

- VPN o SASE con salida en otro país.
- Proxies corporativos/CDN en ruta de identidad.
- GeoIP inexacta y uso de aplicaciones móviles.

### Errores frecuentes

- Tratar GeoIP como GPS.
- Asumir que MFA activada impide phishing o robo de sesión.
- Concluir compromiso sin comparar dispositivo, app y rutas de red.
- Contactar al usuario usando la sesión o canal sospechoso como único medio.

### Perspectiva Red Team (defensiva)

El uso de credenciales válidas o de tokens de sesión robados puede originar eventos de autenticación desde infraestructuras distintas. El atacante también puede usar proxies próximos a la víctima para reducir anomalías geográficas.

### Respuesta modelo en entrevista

> No concluiría compromiso basándome solo en Rusia. Confirmaría el registro exitoso y sus IDs, identificaría ASN/VPN, compararía IP, dispositivo, aplicación, MFA y riesgo con el histórico del empleado y buscaría actividad posterior. Contactaría al usuario por un canal independiente. Si la sesión no está explicada o hay señales de abuso, escalaría para revocar sesiones y proteger la cuenta bajo el procedimiento autorizado.

### Criterios de evaluación

- [ ] Distinguir GeoIP de ubicación física.
- [ ] Revisar MFA/CA y telemetría posterior.
- [ ] Confirmación por canal independiente.
- [ ] Escalado por evidencia e impacto, no por país en exclusiva.

**MITRE ATT&CK contextual:** T1078

**Fuentes oficiales:**

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/signinlogs
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication

---

<a id="n1-03"></a>
## N1-03 — Defender detecta malware y lo pone en cuarentena

**Nivel:** N1 · **Bloque:** Monitorización y triaje

> **Pregunta de entrevista:** Microsoft Defender detecta un archivo malicioso, pero indica que la amenaza fue puesta en cuarentena. ¿Cerrarías la alerta o continuarías investigando?

### Escenario y objetivo

Defender genera un aviso de malware en el equipo FIN-07. La interfaz presenta un estado de cuarentena, pero el analista desconoce si el fichero se ejecutó antes de quedar aislado, si existió otro archivo similar o si la respuesta finalizó correctamente.

**Objetivo:** Diferenciar detección, bloqueo, cuarentena y remediación completa; decidir el cierre con evidencia del alcance, la actividad y el estado del endpoint.

### Hipótesis a contrastar

- El antivirus identificó el fichero antes de ejecutarse y lo cuarentenó correctamente.
- El archivo se ejecutó antes de la detección; se aisló el artefacto, pero existen efectos secundarios o persistencia.
- El objeto en cuarentena es una copia, mientras otros componentes siguen activos.
- Falso positivo confirmado tras análisis y validación del proveedor/contexto.

### Procedimiento operativo, paso a paso

**0. Verificar la acción** — Revisar alerta original, hora, DeviceId, hash, ruta, nombre de amenaza, acción y resultado concreto. Diferenciar acción solicitada, completada y fallida; cuarentena no equivale automáticamente a “equipo limpio”.

**1. Reconstruir línea temporal** — Investigar creación/descarga, usuario, proceso iniciador, ejecución del archivo, procesos hijos, conexiones de red y cambios relevantes antes y después de la detección. Ajustar ventana a ±30–60 minutos inicialmente.

**2. Buscar extensión** — Buscar el hash/archivo en otros dispositivos, correo y rutas de almacenamiento. Investigar si hay alertas adicionales en el mismo host/usuario y si el sensor EDR está saludable.

**3. Evaluar impacto** — Si nunca se ejecutó y no hay indicios laterales, documentar contención exitosa. Si hubo ejecución o persistencia, escalar a N2 para alcance y medidas de respuesta.

**4. Cerrar con evidencia** — Cerrar únicamente cuando haya evidencia de remediación y de que no quedan señales razonables de compromiso dentro del alcance revisado, conforme al playbook del SOC.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| AlertId, Severity, estado, acción/respuesta | Confirma qué detectó el producto y qué hizo efectivamente. |
| SHA1/SHA256, FileName, FolderPath | Permiten pivotar entre alertas, archivos y hosts; SHA256 no siempre está poblado en DeviceFileEvents. |
| DeviceProcessEvents: proceso padre/hijo | Distingue archivo presente de archivo ejecutado; ejecución sospechosa exige ampliar investigación. |
| DeviceNetworkEvents y nuevas alertas | Evalúa comunicaciones posteriores o actividad relacionada. |
| Salud del sensor y estado final de remedios | Sin telemetría suficiente, el cierre puede quedar condicionado. |

### KQL: consultas de investigación

#### Defender XDR Advanced Hunting: evidencia de una alerta

**Requisito:** Defender XDR Advanced Hunting (no la tabla SecurityAlert de Log Analytics).

```kql
let alerta = "SUSTITUIR_POR_ALERT_ID";
AlertInfo
| where AlertId == alerta
| join kind=leftouter (
    AlertEvidence
    | project AlertId, EntityType, DeviceName, FileName, SHA1
  ) on AlertId
| project Timestamp, AlertId, Title, Severity, ServiceSource,
          EntityType, DeviceName, FileName, SHA1
| order by Timestamp desc
```

**Interpretación:** Recuperar título, severidad y entidades asociadas. El estado exacto de remediación se valida en la consola/historial de acciones del producto.

**Límites:** Requiere Defender XDR y permisos; los campos de evidencia dependen de entidad y sensor.


#### Defender XDR: comprobar aparición y ejecución de archivo

**Requisito:** Defender XDR Advanced Hunting + Microsoft Defender for Endpoint.

```kql
let hash_sospechoso = "SUSTITUIR_POR_SHA1";
DeviceFileEvents
| where Timestamp > ago(7d)
| where SHA1 == hash_sospechoso
| project Timestamp, DeviceName, ActionType, FileName, FolderPath,
          SHA1, InitiatingProcessFileName
| order by Timestamp desc
```

**Interpretación:** Eventos sobre el artefacto y otros equipos. Para confirmar ejecución, buscar el mismo SHA1 en DeviceProcessEvents; la mera creación no acredita ejecución.

**Límites:** No confirma por sí sola cuarentena ni proceso ejecutado. Cobertura y retención según licencias; SHA1 recomendado cuando SHA256 falta.


#### Defender XDR: buscar ejecuciones del binario

**Requisito:** Defender XDR Advanced Hunting + Defender for Endpoint.

```kql
let hash_sospechoso = "SUSTITUIR_POR_SHA1";
DeviceProcessEvents
| where Timestamp > ago(7d)
| where SHA1 == hash_sospechoso
| project Timestamp, DeviceName, FileName, ProcessCommandLine,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          AccountName
| order by Timestamp desc
```

**Interpretación:** Una coincidencia de SHA1 en DeviceProcessEvents es evidencia de creación/inicio del proceso registrado; investigar lo anterior y posterior.

**Límites:** El hash puede faltar; validar coincidencias por DeviceId, ruta y otros IOC. Los valores vienen de EDR, no de todos los hosts.


### SPL: consultas de investigación

#### Splunk CIM Malware: acciones contra detecciones

**Requisito:** Splunk con datos antivirus normalizados a CIM Malware_Attacks.

```spl
tag=malware tag=attack earliest=-24h dest="FIN-07"
| stats count AS eventos values(action) AS acciones
        values(file_name) AS archivos values(file_hash) AS hashes
        values(file_path) AS rutas BY dest signature
| sort - eventos
```

**Interpretación:** Revisar nombres de amenaza y acción normalizada.

**Límites:** En CIM, action puede ser allowed/blocked/deferred; cuarentena detallada puede requerir campo específico del proveedor y logs raw.


#### Splunk: búsqueda de alcance por hash normalizado

**Requisito:** Splunk CIM Malware_Attacks; reemplazar hash.

```spl
tag=malware tag=attack earliest=-7d file_hash="SUSTITUIR_POR_HASH"
| stats dc(dest) AS equipos values(dest) AS lista_equipos
        values(action) AS acciones BY file_hash signature
```

**Interpretación:** Contabilizar endpoints afectados por el mismo IOC.

**Límites:** El hash depende del add-on y algoritmo; ausencia de registros no equivale a ausencia de compromiso.


### Comandos y notas operativas

**Windows PowerShell (solo consulta; Microsoft Defender local):** Consultar detecciones y estado desde el endpoint cuando se cuenta con autorización de soporte. No restaurar ni ejecutar ficheros sospechosos.

```powershell
Get-MpThreatDetection | Select-Object -First 20
Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled
```

### Contención y escalado

Si hay ejecución sospechosa, comunicación externa, persistencia, otras máquinas afectadas o remediación fallida, solicitar aislamiento EDR del endpoint y respuesta N2 según impacto. Para un fichero bloqueado antes de ejecutarse con verificación completa, documentar y cerrar conforme a criterio de cierre del SOC.

**Escalar cuando:**

- Ejecución del fichero o de procesos hijos.
- Remediación fallida, repetida o sensor deshabilitado.
- Mismo IOC en varios equipos.
- Actividad de red/persistencia ligada a la detección o afectación de activos críticos.

### Falsos positivos / explicaciones alternativas

- Herramienta empresarial clasificada como PUA.
- Artefacto de laboratorio de seguridad autorizado.
- Firma genérica con detección finalmente revocada por el proveedor.

### Errores frecuentes

- Cerrar automáticamente por etiqueta “Quarantined”.
- Confundir archivo creado con proceso ejecutado.
- Usar solo un hash sin contemplar cambios de fichero.
- Restaurar el fichero para “probar” si es malware.

### Perspectiva Red Team (defensiva)

Un atacante puede probar cargas, reemplazar archivos y utilizar herramientas legítimas. El bloqueo de un binario no invalida necesariamente una ejecución anterior ni otros mecanismos de persistencia.

### Respuesta modelo en entrevista

> No cerraría la alerta por el simple estado de cuarentena. Verificaría acción y resultado, hash, ruta, usuario y hora; reconstruiría si se ejecutó, qué procesos o conexiones generó y si el IOC aparece en otros equipos. Si se bloqueó preventivamente sin actividad adicional y la remediación está verificada, documentaría cierre. Con ejecución, persistencia o remediación fallida escalaría a N2.

### Criterios de evaluación

- [ ] No equiparar cuarentena con ausencia de compromiso.
- [ ] Verificar ejecución, persistencia y alcance.
- [ ] Comprobar remediación final.
- [ ] Cerrar con evidencias y trazabilidad.

**MITRE ATT&CK contextual:** T1204

**Fuentes oficiales:**

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-alertinfo-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-alertevidence-table
- https://learn.microsoft.com/es-es/defender-xdr/advanced-hunting-devicefileevents-table
- https://learn.microsoft.com/es-es/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/malware

---

<a id="n1-04"></a>
## N1-04 — Correo sospechoso reportado sin clic

**Nivel:** N1 · **Bloque:** Monitorización y triaje

> **Pregunta de entrevista:** Un usuario informa que ha recibido un correo sospechoso con un enlace. No ha hecho clic. ¿Qué procedimiento seguirías?

### Escenario y objetivo

Una empleada reporta un correo que aparenta venir de Recursos Humanos con “actualización urgente de nómina” y un enlace. Asegura no haberlo abierto en el navegador. El mensaje sigue en el buzón. Otros empleados podrían haber recibido el mismo correo.

**Objetivo:** Registrar el reporte, validar phishing de forma segura, medir distribución de la campaña y evitar clics/acciones de otros destinatarios; no asumir que el reporte demuestra ausencia de interacción.

### Hipótesis a contrastar

- Phishing de credenciales con enlace a clon de portal corporativo.
- Mensaje de proveedor legítimo con dominio inusual o plataforma externalizada.
- Spoofing o suplantación del remitente visible.
- Correo con enlace que redirige a dominio legítimo comprometido o cadena de redirección.

### Procedimiento operativo, paso a paso

**0. Proteger a la persona y evidencia** — Pedir que no pulse el enlace, no reenvíe fuera del canal de reporte y no introduzca credenciales. Solicitar el reporte mediante botón de phishing o adjunto .eml/.msg aprobado preservando cabeceras.

**1. Trazabilidad del correo** — Registrar NetworkMessageId / InternetMessageId, remitente visible y sobre SMTP, destinatario, asunto, fecha, autenticación SPF/DKIM/DMARC (teniendo en cuenta alineación) y resultado de filtrado.

**2. Analizar URL sin visitarla** — Revisar URL, dominio, redirecciones, antigüedad y reputación con herramientas seguras; extraer y analizar en sandbox aprobada si corresponde. Nunca abrir el enlace con navegador personal/corporativo del analista.

**3. Buscar alcance y clics** — Buscar otros destinatarios del mismo mensaje o similares; analizar eventos de Safe Links, proxy, DNS y endpoints, sabiendo que la ausencia de evento de clic no prueba que nadie lo hiciera si la cobertura no es completa.

**4. Responder y comunicar** — Si se confirma phishing, solicitar purga/quarantine masiva, bloqueo de URL/dominio/IOC conforme al playbook, informar a usuarios afectados y escalar si hubo clic, envío de credenciales, descarga o ejecución.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Cabeceras y autenticación | Remitente visible, Return-Path, Received, SPF/DKIM/DMARC y alineación; SPF/DKIM pass no garantiza benignidad. |
| NetworkMessageId, InternetMessageId | Correlacionan mensaje entre tablas de correo (IDs distintos con propósitos distintos). |
| EmailUrlInfo.Url / UrlDomain | Qué direcciones estaban presentes; no demuestra que se visitaran. |
| UrlClickEvents.AccountUpn + Timestamp + ActionType | Evidencia disponible de interacción bajo cobertura de Safe Links. |
| RecipientEmailAddress + DeliveryLocation | Distribución y localización del mensaje para tratamiento masivo. |

### KQL: consultas de investigación

#### Defender XDR: buscar mensaje y enlace

**Requisito:** Defender XDR Advanced Hunting + Defender for Office 365.

```kql
let remitente = "nominas@ejemplo.example";
EmailEvents
| where Timestamp > ago(7d)
| where SenderFromAddress =~ remitente
| project Timestamp, NetworkMessageId, RecipientEmailAddress,
          SenderFromAddress, Subject, DeliveryAction, DeliveryLocation,
          ThreatTypes
| join kind=leftouter (
    EmailUrlInfo
    | project NetworkMessageId, Url, UrlDomain
  ) on NetworkMessageId
| order by Timestamp desc
```

**Interpretación:** Identifica destinatarios, estado de entrega y URLs observadas.

**Límites:** Requiere Defender for Office 365; múltiples URLs producen más de una fila por mensaje. El remitente del ejemplo es ficticio.


#### Defender XDR: comprobar clics registrados

**Requisito:** Defender XDR Advanced Hunting + Safe Links / UrlClickEvents.

```kql
let mensaje = "SUSTITUIR_POR_NETWORK_MESSAGE_ID";
UrlClickEvents
| where Timestamp > ago(7d)
| where NetworkMessageId == mensaje
| project Timestamp, AccountUpn, Url, ActionType, IsClickedThrough,
          ThreatTypes, IPAddress
| order by Timestamp asc
```

**Interpretación:** Revisar clic permitido/bloqueado y usuarios que interactuaron.

**Límites:** Sin Safe Links, con determinadas rutas o sin cobertura completa, un resultado vacío no demuestra cero clics; contrastar con proxy/DNS/endpoint.


### SPL: consultas de investigación

#### Splunk CIM Email: distribución de campaña

**Requisito:** Splunk con mail gateway normalizado a CIM Email.

```spl
tag=email earliest=-7d src_user="nominas@ejemplo.example"
| stats count AS mensajes values(subject) AS asuntos
        values(recipient) AS destinatarios
        values(url) AS urls BY src_user message_id
| sort - mensajes
```

**Interpretación:** Localiza correos del remitente y destinatarios, aprovechando mapeo CIM.

**Límites:** Campos url o message_id pueden no mapearse en todos los dispositivos; ampliar con asunto, Return-Path y encabezados.


#### Splunk CIM Email: receptores y volumen

**Requisito:** Splunk CIM Email; subject como campo extraído.

```spl
tag=email earliest=-48h subject="*actualización*nomina*"
| stats count AS mensajes values(src_user) AS remitentes
        values(message_id) AS ids BY recipient
| sort - mensajes
```

**Interpretación:** Expone posible distribución de mensaje similar.

**Límites:** La coincidencia por asunto no equivale a IOC robusto; depende de idioma, codificación y normalización; usar filtros de dominio/URL cuando exista.


### Comandos y notas operativas

**Flujo de correo:** Recopilar original conservando cabeceras por la herramienta oficial de reporte y analizar URLs en entorno seguro, no en sesión de producción.

```text
# No ejecutar curl ni abrir URL sospechosa desde la estación de análisis.
```

### Contención y escalado

El correo sin clic conocido no exige aislar el endpoint automáticamente. Ante phishing confirmado, activar bloqueo/purga coordinada de mensajes y IOC. Si existen clics o introducción de credenciales, activar playbook de compromiso de identidad, revocación de sesiones y búsqueda de actividad posterior; requerirá verificación del alcance.

**Escalar cuando:**

- Usuario hizo clic y proporcionó credenciales o aprobó MFA inesperada.
- URL sirvió descarga o ejecución de contenido.
- Campaña extensa contra numerosos usuarios o cuentas de alto privilegio.
- Indicios de cuentas comprometidas o reenvío de correo malicioso desde interno.

### Falsos positivos / explicaciones alternativas

- Plataforma de nóminas externalizada real.
- Enlace de seguimiento/marketing poco familiar.
- Ejercicio interno de phishing debidamente autorizado.

### Errores frecuentes

- Abrir el enlace “para comprobarlo” en el navegador personal.
- Asumir que “no hice clic” o ausencia de UrlClickEvents garantiza ausencia de riesgo.
- Reenviar el mensaje a compañeros para preguntar si lo reconocen.
- Bloquear todo el dominio sin evaluar servicios empresariales compartidos.

### Perspectiva Red Team (defensiva)

El phishing puede utilizar remitentes parecidos, dominios recién creados, servicios legítimos comprometidos y redirecciones. El objetivo habitual es inducir un clic, acceso a credenciales o ejecución de payload; la detección debe seguir la cadena completa.

### Respuesta modelo en entrevista

> Pediría al empleado no interactuar y que use el canal de reporte para conservar el mensaje original. Revisaría cabeceras, autenticación de correo y URL sin visitarla directamente; después buscaría destinatarios adicionales y posibles clics o descargas en las fuentes disponibles. Si se confirma phishing, pediría la purga y bloqueo aprobados; con evidencia de interacción o credenciales comprometidas, escalaría para respuesta sobre identidad/endpoints. Documentaría el alcance y los límites de visibilidad.

### Criterios de evaluación

- [ ] Preservar mensaje y proteger a usuario/analista.
- [ ] Buscar alcance organizativo.
- [ ] Distinguir URL presente de URL visitada.
- [ ] Escalar ante credenciales, ejecución o campaña extensa.

**MITRE ATT&CK contextual:** T1566.002

**Fuentes oficiales:**

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-emailevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-emailurlinfo-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-urlclickevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/email

---

<a id="n1-05"></a>
## N1-05 — 300 alertas en 10 minutos: priorización bajo presión

**Nivel:** N1 · **Bloque:** Monitorización y triaje

> **Pregunta de entrevista:** Tu SIEM genera 300 alertas en diez minutos. Algunas son críticas y otras de severidad media. ¿Cómo priorizarías la investigación?

### Escenario y objetivo

Un turno nocturno registra 300 alertas. Varias están vinculadas a un controlador de dominio y un servidor que almacena datos personales; otras son cientos de repeticiones de un bloqueo de firewall. Se desconoce si existe un incidente único, una campaña o un fallo de ingestión/regla.

**Objetivo:** Priorizar por riesgo e impacto, agrupar eventos relacionados, no dejar que el volumen desplace señales urgentes y usar escalado cuando se supera la capacidad operativa.

### Hipótesis a contrastar

- Incidente real que provoca múltiples alertas correlacionadas en la misma cadena de ataque.
- Tormenta por regla mal calibrada, duplicación o cambio de ingesta.
- Actividad legítima como parcheo, escaneo autorizado o despliegue.
- Ataques paralelos independientes que compiten por atención.

### Procedimiento operativo, paso a paso

**0. Seguridad inmediata** — Identificar alertas de impacto en curso: ransomware propagándose, exfiltración confirmada, cuentas privilegiadas comprometidas, controlador de dominio y sistemas vitales. Activar procedimiento crítico y segunda línea si aplica.

**1. Crear grupos** — Correlacionar por host, usuario, IP, hash, regla y ventanas de tiempo. Separar 300 señales de un único incidente de múltiples incidentes reales; deduplicar sin eliminar la traza original.

**2. Puntuar riesgo** — Aplicar una matriz: impacto del activo, evidencia de explotación/éxito, confianza de detección, actividad en curso, exposición, criticidad de datos y controles activos. Severidad del proveedor es solo un componente.

**3. Asignar y escalar** — Abrir incidentes enlazados, asignar propietarios, distribuir cola entre analistas y activar guardia N2/IR si hay actividad crítica o desborde operacional; registrar tiempos de SLA.

**4. Gestionar ruido** — Revisar duplicados y salud del pipeline; solicitar ajuste temporal autorizado de reglas ruidosas si procede, sin deshabilitar visibilidad crítica. Comunicar estado a líder de turno.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Severity + confianza y producto | Severidad no equivale automáticamente a prioridad operativa. |
| CompromisedEntity / host / usuario | Permite agrupar múltiples señales de un mismo activo. |
| Regla + ventana + SystemAlertId | Sirve para detectar duplicaciones y alert storm. |
| Inventario/CMDB + sensibilidad de datos | Permite ajustar prioridad según valor y rol del activo. |
| Telemetría de continuación | Indica ataque activo (cifrado, exfiltración, lateralidad), no solo intento bloqueado. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics: volumen por severidad y fuente

**Requisito:** Microsoft Sentinel — SecurityAlert; alertas de productos conectados.

```kql
SecurityAlert
| where TimeGenerated > ago(15m)
| extend prioridad=case(AlertSeverity == "High", 3,
                        AlertSeverity == "Medium", 2,
                        AlertSeverity == "Low", 1, 0)
| summarize Alertas=count(), Activos=dcount(CompromisedEntity),
            Ejemplos=make_set(AlertName, 5)
    by AlertSeverity, ProductName, prioridad
| order by prioridad desc, Alertas desc
```

**Interpretación:** Primer panorama de qué fuente y severidad produce más alertas. Verificar cobertura de SecurityAlert, que no es lo mismo que listar todos los incidentes.

**Límites:** La clasificación de severidad está normalizada por fuente/analítica; no se infiere impacto del negocio ni identidad de incidentes.


#### Sentinel: agrupar picos repetidos por activo y regla

**Requisito:** Microsoft Sentinel — SecurityAlert.

```kql
SecurityAlert
| where TimeGenerated > ago(30m)
| summarize Eventos=count(), Primer=min(TimeGenerated),
            Ultimo=max(TimeGenerated), IDs=dcount(SystemAlertId)
    by CompromisedEntity, AlertName, AlertSeverity
| where Eventos >= 3
| order by Eventos desc
```

**Interpretación:** Da candidatos a consolidación. Duplicados de misma alerta o eventos distintos requieren comprobación individual; correlacionar con CMDB y técnicas relacionadas.

**Límites:** CompromisedEntity puede venir vacío y SystemAlertId no sirve como ID del incidente general. El umbral 3 es solo didáctico.


### SPL: consultas de investigación

#### Splunk CIM Alerts: panorama por severidad

**Requisito:** Splunk con alertas normalizadas a CIM Alerts (tag=alert).

```spl
tag=alert earliest=-15m
| stats count AS alertas dc(dest) AS activos
        values(signature) AS reglas BY severity app
| eval prioridad=case(severity="critical",4,
                      severity="high",3,
                      severity="medium",2,
                      severity="low",1,true(),0)
| sort - prioridad - alertas
```

**Interpretación:** Priorizar señales críticas y agrupar por producto.

**Límites:** El tag alert y campos CIM deben estar poblados; los episodios/notables de Splunk ES pueden residir en fuentes con campos específicos.


#### Splunk CIM Alerts: candidatos a agrupación

**Requisito:** Splunk con CIM Alerts.

```spl
tag=alert earliest=-30m
| stats count AS alertas values(severity) AS niveles
        min(_time) AS primera max(_time) AS ultima
  BY dest signature
| where alertas>=3
| sort - alertas
```

**Interpretación:** Alertas que comparten activo y firma pueden ser repetitivas o representar actividad persistente.

**Límites:** Correlacionar también usuario/IP/tiempo; agrupar no significa descartar evidencia.


### Comandos y notas operativas

**Operaciones SOC:** Ejemplo de matriz de riesgo conceptual para discusión del equipo, no un algoritmo aprobado ni una fórmula universal.

```text
# Prioridad ≈ impacto del activo + ataque en curso + confianza + alcance - contención efectiva
# Ajustar a SLAs, casos de uso y apetito de riesgo de la organización.
```

### Contención y escalado

No ejecutar bloqueos masivos basados solo en cantidad. Para actividad crítica confirmada solicitar contención específica bajo playbook (host, cuenta o salida de red). Para ruido o defectos de regla, abrir tarea de ingeniería con evidencia y aprobación; mantener trazabilidad y compensar alertas suprimidas con monitoreo alternativo.

**Escalar cuando:**

- Exfiltración/cifrado/propagación en curso.
- Cuentas privilegiadas o activos de misión crítica con indicios fuertes.
- 300 alertas superan capacidad del turno o incumplen SLA.
- Múltiples equipos comprometidos o correlación entre productos.

### Falsos positivos / explicaciones alternativas

- Reglas duplicadas tras despliegue.
- Herramientas autorizadas de evaluación.
- Fallos de parser/ingesta o alerta reiterativa de firewall que ya bloqueó la acción.

### Errores frecuentes

- Tratar 300 alertas como 300 incidentes.
- Ordenar solo por High/Medium sin impacto ni evidencia de explotación.
- Silenciar reglas críticas para “limpiar el dashboard”.
- Intentar resolver todo en solitario y no llamar N2/IR.

### Perspectiva Red Team (defensiva)

Un ataque puede generar múltiples detecciones en cadena, y el volumen de eventos legítimos o maliciosos puede ocultar señales decisivas. La correlación temporal y por entidades ayuda a reconocer una campaña frente al ruido.

### Respuesta modelo en entrevista

> Primero localizaría actividad con impacto en curso y activos críticos, no solo alertas de mayor severidad. Correlacionaría por entidad, técnica, regla y ventana para distinguir duplicados de incidentes distintos. Aplicaría criticidad, confianza, alcance y estado de contención; abriría incidentes con responsables y escalaría a N2/IR si hay exfiltración, ransomware o una cola que excede nuestra capacidad. Ajustaría ruido únicamente mediante el proceso de cambios autorizado.

### Criterios de evaluación

- [ ] Prioridad por riesgo, no volumen o severidad a secas.
- [ ] Correlacionar y deduplicar sin perder evidencia.
- [ ] Escalar por capacidad y SLAs.
- [ ] No desactivar detecciones sin control.

**MITRE ATT&CK contextual:** no se asigna técnica específica a la gestión de alertas.

**Fuentes oficiales:**

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityalert
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/alerts

---

## Checklist para integrar en una futura web

- ID único y estable (`N1-01` … `N1-05`); campos completos en el JSON.
- Mostrar primero escenario/pregunta y revelar respuesta progresivamente.
- Permitir pestañas para KQL vs. SPL y distinguir consola y fuentes de datos.
- Incluir “probado en laboratorio” solo después de ejecutar y comprobar cada consulta.
- Nunca ejecutar acciones destructivas de manera automática desde una página educativa.
- Mantener fuentes/documentación asociadas a cada caso y control de versiones.

**Siguiente tanda (pendiente de GO):** N1-06 a N1-10 — Redes y tráfico sospechoso.
