# SOC-RESPONSES — Tanda 03 | SOC N1: Windows, Linux y Active Directory

**Escenarios:** N1-11 a N1-15 · **Revisión de documentación:** 18/10/2026 · **Enfoque:** triaje SOC, técnica Windows/Linux, telemetría realista, KQL, SPL, IR y perspectiva adversaria.

> **Nota de alcance:** Estas son plantillas educativas y defensivas; no se han ejecutado las consultas en un tenant real de Sentinel/Defender XDR ni en una instancia real de Splunk. Ajusta DCR, tipos de eventos, permisos, retención, índices, extracción XML, modelos CIM, sistemas y versiones antes de producción. Un evento aislado rara vez confirma un ataque. Los nombres y hosts del dossier son ficticios.

## Índice

- [N1-11 — Avalancha de eventos Windows 4625: interpretar fallos de autenticación](#n1-11)
- [N1-12 — Cuenta de Active Directory bloqueada repetidamente](#n1-12)
- [N1-13 — Proceso kworker al 95 % de CPU: ¿kernel o suplantación?](#n1-13)
- [N1-14 — PowerShell cada cinco minutos mediante una tarea programada](#n1-14)
- [N1-15 — Usuario ejecuta un EXE recibido por correo sin alerta del antivirus](#n1-15)

## Matriz de decisión rápida

| Escenario | Señal que cambia prioridad | Explicación legítima que descartar |
|---|---|---|
| N1-11 | Éxito tras fallos + privilegios + origen no autorizado | Password de servicio, VPN, fallo DNS/DC |
| N1-12 | Cuentas privilegiadas, muchos usuarios, orígenes anómalos | Contraseña guardada en móvil/servicio/tarea |
| N1-13 | Binario userland disfrazado + red/persistencia | Kernel worker real por I/O/driver |
| N1-14 | Tarea nueva o modificada sin cambio + script dañino | Mantenimiento periódico aprobado |
| N1-15 | Ejecución confirmada + hijos, C2 o persistencia | Instalador legítimo o telemetría incompleta |

---

<a id="n1-11"></a>
## N1-11 — Avalancha de eventos Windows 4625: interpretar fallos de autenticación

**Nivel:** SOC N1 · **Bloque:** Windows, Linux y Active Directory

> **Pregunta de entrevista:** En Windows aparece un evento 4625 repetido cientos de veces. ¿Qué campos analizarías para identificar el origen y el tipo de fallo?

### Escenario y objetivo

Son las 02:14 y un controlador de dominio registra 420 eventos Security 4625 en 12 minutos. El origen visible es 10.30.7.21, pero la alerta no indica si los intentos corresponden a un usuario o a decenas. Hay un servidor de aplicaciones que utiliza cuentas de servicio y una pasarela VPN corporativa. No se ha confirmado autenticación exitosa ni compromiso.

**Objetivo:** Determinar qué identidad y activo son afectados, qué sistema origina los intentos, cuál es el mecanismo de autenticación y si el patrón encaja con contraseña desactualizada, fallo de configuración, fuerza bruta, password spraying o actividad legítima anómala; priorizar impacto y escalar con evidencias.

### Hipótesis a contrastar

- Contraseña caducada o antigua guardada en un servicio, tarea, aplicación, unidad de red o Credential Manager.
- Fuerza bruta contra una identidad concreta; posible bloqueo posterior o inicio de sesión exitoso.
- Password spraying contra numerosas identidades; un mismo origen puede corresponder a NAT, VPN o proxy de autenticación.
- Nombre de usuario inválido, cuenta deshabilitada, horario no autorizado o fallo de infraestructura (no equivale a un ataque).
- Registros duplicados, distintos servidores que reflejan el mismo origen o errores de sincronización temporal.

### Procedimiento operativo, paso a paso

**0. Confirmar integridad de la alerta** — Identificar sensor, equipo que emitió cada 4625, rango temporal UTC y número de eventos únicos. Verificar si el DC o miembro recibe la solicitud: un 4625 se registra en el equipo donde falla el inicio de sesión, no necesariamente en el equipo del usuario.

**1. Extraer campos clave** — Recuperar TargetUserName/TargetDomainName, IpAddress, IpPort, WorkstationName, LogonType, AuthenticationPackageName, LogonProcessName, Status y SubStatus. Revisar Account/SID y ProcessName si el evento los expone.

**2. Interpretar el tipo de logon** — LogonType=2 es interactivo; 3, red; 4, batch; 5, servicio; 7, desbloqueo; 10, RemoteInteractive/RDP; 11, cached interactive. Es un contexto de autenticación, no una atribución automática de ataque.

**3. Interpretar códigos NTSTATUS** — Distinguir 0xC000006A (contraseña incorrecta), 0xC0000064 (usuario inexistente), 0xC0000234 (bloqueo), 0xC0000072 (deshabilitada) y 0xC000005E (servidor de logon no disponible). Considerar pareja Status/SubStatus y versión del sistema.

**4. Medir distribución** — Calcular fallos por usuario, origen, destino, tipo, código y ventana. Un usuario/muchos intentos sugiere una hipótesis distinta de muchos usuarios/pocos intentos cada uno.

**5. Correlacionar desenlace** — Buscar 4624 en destino y usuario en la misma ventana, 4740 para bloqueos y 4771/4776 cuando la cobertura lo permita; 4624 aislado no prueba que el mismo actor accediera sin correlación suficiente.

**6. Resolver origen real** — Validar inventario de 10.30.7.21, NAT/VPN, procesos/servicios asociados, usuario final, hostname, controladores implicados y ventana de cambios. IpAddress o WorkstationName pueden aparecer vacíos o no representar la IP final del cliente.

**7. Priorizar y escalar** — Elevar si cuenta privilegiada, origen no autorizado, múltiples usuarios, éxitos tras fallos, bloqueos masivos o lateralidad; solicitar contención proporcional y autorizada al equipo responsable.

**8. Documentar** — Anotar período, valoraciones verificadas, códigos, volumen, cuentas, fuentes, lagunas de telemetría, ticket, propietario y acciones de seguimiento.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| EventID 4625 y equipo emisor | Confirma intento fallido registrado en ese equipo; no demuestra por sí mismo quién está detrás ni que una contraseña fue adivinada. |
| TargetUserName y TargetDomainName | Identidad destino; normalizar mayúsculas/dominio antes de agregar y no tratar cuentas de máquina como usuarios humanos. |
| IpAddress, IpPort, WorkstationName | Posible origen técnico; revisar IPv4 mapeada a IPv6, vacío/"-", NAT, saltos de autenticación y registros del concentrador. |
| LogonType | Explica clase de sesión solicitada; 3 no equivale siempre a SMB y 10 sugiere RDP/RemoteInteractive, sujeto a contexto. |
| Status, SubStatus | Códigos de fallo diferencian error de credenciales, cuenta deshabilitada, bloqueo o disponibilidad del dominio. |
| 4624, 4740, 4771, 4776 | Cruce para éxito, bloqueo y autenticaciones Kerberos/NTLM; la presencia y ubicación dependen de auditoría y protocolo. |
| Cambios/servicios/tareas | Corrobora job legítimo y contraseñas guardadas; comprobar autorizaciones sin modificar una cuenta en producción por intuición. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics: 4625 agrupados por identidad, origen y código

**Requisito:** Tabla WindowsEvent con eventos Security colectados mediante AMA/DCR; comprobar que EventData se haya parseado

```kql
WindowsEvent
| where TimeGenerated > ago(2h) and EventID == 4625
| extend D = EventData
| extend Usuario=tostring(D.TargetUserName), IPOrigen=tostring(D.IpAddress),
         LogonType=tostring(D.LogonType), Status=tostring(D.Status),
         SubStatus=tostring(D.SubStatus), Estacion=tostring(D.WorkstationName)
| summarize Fallos=count(), Primer=min(TimeGenerated), Ultimo=max(TimeGenerated),
            Equipos=make_set(Computer, 10), Estaciones=make_set(Estacion, 10)
  by Usuario, IPOrigen, LogonType, Status, SubStatus, bin(TimeGenerated, 15m)
| where Fallos >= 5
| order by Fallos desc
```

**Interpretación:** Muestra concentraciones por cuenta/IP/tipo/motivo para formular hipótesis; el umbral 5/15 min solo es didáctico.

**Límites:** WindowsEvent no equivale a SecurityEvent; EventData dinámico puede ser nulo o variar por proveedor. La IP registrada puede ser un intermediario.

#### Sentinel / Log Analytics: contrastar 4625 con 4624 y 4740

**Requisito:** WindowsEvent; requiere ingestión de eventos Security 4624, 4625 y 4740 en los equipos relevantes

```kql
WindowsEvent
| where TimeGenerated > ago(4h) and EventID in (4624, 4625, 4740)
| extend D=EventData
| extend Usuario=tostring(D.TargetUserName), Origen=tostring(D.IpAddress),
         EquipoLlamante=tostring(D.CallerComputerName)
| summarize Fallos=countif(EventID == 4625),
            Exitos=countif(EventID == 4624), Bloqueos=countif(EventID == 4740),
            Origenes=make_set(Origen, 20), EquiposLlamantes=make_set(EquipoLlamante, 20)
    by Usuario, bin(TimeGenerated, 30m)
| where Fallos > 0 or Bloqueos > 0
| order by Bloqueos desc, Fallos desc
```

**Interpretación:** Genera una visión por identidad para investigar éxitos próximos a muchos fallos y bloqueos.

**Límites:** No vincula causalmente un 4624 con un 4625. Agrupación temporal puede mezclar orígenes y equipos; validar SID, origen, hora y contexto antes de afirmar compromiso.

### SPL: consultas de investigación

#### Splunk CIM Authentication: fallos por origen y usuario

**Requisito:** Modelo de datos CIM Authentication.Authentication correctamente mapeado (action=failure); sustituir ventana y umbral

```spl
| tstats count as Fallos min(_time) as Primer max(_time) as Ultimo
  from datamodel=Authentication.Authentication
  where Authentication.action="failure" earliest=-2h
  by Authentication.user Authentication.src Authentication.dest _time span=15m
| rename Authentication.* AS *
| where Fallos >= 5
| convert ctime(Primer) ctime(Ultimo)
| sort - Fallos
```

**Interpretación:** Busca anomalías de autenticación independientes del proveedor si el CIM está normalizado.

**Límites:** Sin firma/ID de Windows filtrado, incluye otros sistemas de autenticación. Para aislar 4625 usar evento bruto normalizado o signature_id si está mapeado.

#### Splunk Windows Security: códigos y LogonType de 4625

**Requisito:** Índice ilustrativo windows con TA Windows y extracción de campos XML; adaptar a EventCode/EventID y sourcetype reales

```spl
index=windows earliest=-2h (sourcetype="XmlWinEventLog:Security" OR sourcetype="WinEventLog:Security") EventCode=4625
| eval Usuario=coalesce(TargetUserName, Account_Name),
       Origen=coalesce(IpAddress, Source_Network_Address, WorkstationName),
       Codigo=coalesce(SubStatus, Status)
| stats count as Fallos values(Status) as Status
        values(SubStatus) as SubStatus by Usuario Origen LogonType Codigo
| sort - Fallos
```

**Interpretación:** Muestra códigos y tipo de logon; útil para separar password incorrecta, usuario inválido y cuenta bloqueada.

**Límites:** Los nombres Account_Name/Source_Network_Address son dependientes de TA; comprobar extracción real. En algunos despliegues el campo es EventID, no EventCode.

### Comandos de observación y comprobación

**Windows — revisar 4625 recientes:** Consulta solo lectura en equipo autorizado; requiere privilegios para Security log.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-2)} -MaxEvents 20 | Select-Object TimeCreated, Id, MachineName, Message
```

**Windows — revisar bloqueos 4740:** Consulta de eventos disponibles en ese equipo; para AD consultar DCs relevantes.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4740; StartTime=(Get-Date).AddHours(-4)} -MaxEvents 30
```

**Linux — revisar autenticaciones locales si el origen resulta Linux:** Los nombres de unidad/archivo varían según distro; no sustituye registros Windows.

```bash
sudo journalctl --since '2 hours ago' | grep -Ei 'authentication failure|failed password|pam_' | head -n 40
```

### Contención y límites de autoridad

En N1, no bloquear una dirección que podría pertenecer al proxy corporativo ni deshabilitar cuentas de servicio sin autorización. Si hay una cuenta privilegiada comprometida o éxitos tras intentos sospechosos, escalar urgente a IR/IAM para suspensión o revocación de sesión, controles condicionales o bloqueo del origen real según playbook. Verificar antes/después y evitar que un bloqueo masivo provoque una denegación de servicio.

### Cuándo escalar a N2 / Incident Response

- Éxito 4624 coherente en origen/identidad/ventana tras fallos maliciosos (requiere validar causalidad).
- Cuentas privilegiadas/servicios críticos implicados, múltiples objetivos o velocidad propia de automatización.
- Bloqueos sucesivos 4740 o impacto de disponibilidad sobre área de negocio.
- Evidencia externa corroborada por VPN, VPN logs, EDR, WAF o telemetría de identidad.
- Origen que no corresponde a infraestructura aprobada, o actividad fuera de ventana y usuario que desconoce el acceso.

### Falsos positivos que debes evaluar

- Servicio Windows con contraseña almacenada antigua tras rotación.
- Outlook, móvil o recurso compartido intentando credenciales caducadas.
- Tarea programada o pool de aplicaciones que usa cuenta de dominio.
- Firewall/VPN que concentra diferentes usuarios bajo una IP compartida.
- Error de dominio, DNS o controlador disponible causando fallos repetidos.

### Errores frecuentes que penalizan en entrevista

- Decir que 4625 confirma fuerza bruta; indica fallo de logon, no causa.
- Confundir cuenta que genera el evento (Subject) con cuenta atacada (Target).
- Clasificar LogonType 3 como ataque SMB por defecto.
- Bloquear la IP sin identificar NAT/VPN y sin confirmar autorización.
- No buscar 4624/4740 ni valorar contexto, NTSTATUS y múltiples equipos.
- Hacer reset de credenciales administrativas inmediatamente sin coordinación.

### Perspectiva Red Team y Blue Team

Un atacante puede generar fuerza bruta sobre una sola cuenta o password spraying disperso sobre muchas. Ambas generan fallos, pero las distribuciones usuario/origen/tiempo difieren y pueden mezclarse con tráfico legítimo. Desde Blue Team interesa responder a ¿quién?, ¿desde dónde realmente?, ¿qué tipo de logon?, ¿por qué falla? y ¿hubo éxito posterior? MITRE T1110 representa una hipótesis, no evidencia de intrusión por el evento 4625.

### Respuesta modelo de entrevista

> Comprobaría si los 4625 proceden de un DC o un equipo miembro y extraería TargetUserName, IpAddress, WorkstationName, LogonType, Status y SubStatus. Agruparía los eventos por usuario, origen y ventana para distinguir fallos de un servicio de fuerza bruta o spraying. Contrastaría 4624 y 4740, revisar 4771/4776 cuando aplique y validaría el origen a través de VPN/NAT y el inventario. Si observo accesos exitosos sospechosos, cuentas privilegiadas o bloqueo masivo, escalaría inmediatamente con evidencia; no bloquearía a ciegas.

### Criterios de evaluación del candidato

- [ ] Identifica 4625 como fallo, 4624 como éxito y 4740 como bloqueo.
- [ ] Diferencia TargetUserName de Subject, y LogonType de protocolo.
- [ ] Interpreta códigos relevantes y no concluye fuerza bruta solo por volumen.
- [ ] Correlaciona secuencia temporal, origen real e impacto empresarial.
- [ ] Ofrece escalado, registro y contención autorizada.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1110, T1110.003, T1078

### Fuentes de documentación

- https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/windowsevent
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication
- https://attack.mitre.org/techniques/T1110/

---

<a id="n1-12"></a>
## N1-12 — Cuenta de Active Directory bloqueada repetidamente

**Nivel:** SOC N1 · **Bloque:** Windows, Linux y Active Directory

> **Pregunta de entrevista:** Un empleado reporta que su cuenta de Active Directory se bloquea continuamente. ¿Cómo investigarías la causa?

### Escenario y objetivo

La usuaria ana.martin informa de seis bloqueos entre las 09:10 y 10:05. El Service Desk ya desbloqueó dos veces la cuenta, pero vuelve a bloquearse. Trabaja con portátil corporativo, teléfono con correo, sesión RDP ocasional y una aplicación legacy. En los DC aparece Security 4740, pero aún no se ha identificado dónde se guardó una contraseña antigua.

**Objetivo:** Encontrar la fuente que provoca el bloqueo sin introducir un ciclo de desbloqueos, diferenciar credenciales guardadas y servicios frente a abuso malicioso, evaluar impacto y corregir con el equipo dueño.

### Hipótesis a contrastar

- Credenciales antiguas guardadas en teléfono, Outlook, VPN, cliente RDP, share o aplicación legacy.
- Servicio, cuenta de aplicación, tarea programada o pool web corriendo con credenciales obsoletas.
- Un atacante prueba repetidamente la cuenta; potencial guessing y denial-of-service de identidad.
- Cuenta similar usada por distintos usuarios, problema de sincronización de contraseñas o identidad federada.
- Varios controladores de dominio registran parte de la historia; CallerComputerName es vacío, genérico o ambiguo.

### Procedimiento operativo, paso a paso

**0. Confirmar impacto y frecuencia** — Recuperar hora exacta, SID y nombre canónico, número de bloqueos, si es cuenta privilegiada y si existe interrupción de operaciones o dependencia crítica.

**1. Revisar eventos 4740** — Buscar en controladores de dominio que procesaron el bloqueo: TargetUserName, TargetSid, CallerComputerName, Computer y TimeGenerated. El host que muestra el 4740 no tiene por qué ser el host origen de los intentos.

**2. Verificar políticas y directorio** — Con apoyo IAM revisar duración del bloqueo, umbral, si hay DCs fuera de sincronización y datos de cuenta. Evitar modificar la política global como respuesta improvisada.

**3. Buscar intentos previos** — Correlacionar 4625 en equipos miembros/DC, 4771 si Kerberos pre-auth falla y 4776 si NTLM (según despliegue). Separar event_id de origen; los eventos no se generan todos en el mismo equipo.

**4. Identificar fuente real** — Resolver CallerComputerName a activo actual en inventario/DNS/DHCP; comprobar IP, propietario y aplicaciones. Si CallerComputerName está ausente, apoyarse en logs del gateway/VPN/aplicación y telemetría de autenticación.

**5. Diferenciar error de credenciales y abuso** — Si el mismo proceso/host falla inmediatamente después del unlock, sospechar contraseña guardada. Muchos orígenes no confiables, usuarios afectados y errores de autenticación progresivos elevan hipótesis de ataque.

**6. Corregir causa de raíz** — Coordinar actualización de credenciales en cliente/servicio o revocación si compromiso; planificar cambio de contraseña de forma segura con IAM, especialmente en cuentas de servicio.

**7. Verificar control y seguridad** — Tras medida aprobada, comprobar que no haya más 4740 ni nuevos fallos durante varias ventanas, que aplicaciones sigan operativas y que accesos sospechosos se contengan.

**8. Cerrar y documentar** — Registrar fuente, host, servicio, credencial sustituida por el propietario, últimos 4740/4625, posible atacante, responsables, validación y acciones preventivas; no registrar secretos.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| 4740 TargetUserName / TargetSid | Identifica cuenta bloqueada (no confundir con SubjectUserName, que puede ser SYSTEM). |
| 4740 CallerComputerName | Pista del equipo que emitió la solicitud que desembocó en bloqueo; puede estar en blanco, representar intermediario o no resolver el origen definitivo. |
| 4625 / 4771 / 4776 | Logon fallido en miembro/DC, Kerberos preauth fallida y validación NTLM respectivamente, cuando se auditan. |
| Orden de eventos por DC y UTC | Distingue secuencia real de duplicados/desfase de reloj y permite relacionar desbloqueos con nuevos fallos. |
| Inventario: teléfono, servicios, tareas, shares, RDP | Identifica aplicaciones y activos que almacenan credenciales; no asumir que CallerComputerName identifica un humano. |
| SID, objeto AD y privilegios | Asegura que la identidad analizada es la correcta y prioriza cuentas de alto impacto. |
| Validación posterior | Ausencia de bloqueos más funcionamiento del servicio y revisión de ataques asociados; ausencia de un 4740 en un DC no garantiza que todos estén limpios. |

### KQL: consultas de investigación

#### Sentinel WindowsEvent: bloqueos 4740 por usuario y equipo llamante

**Requisito:** WindowsEvent: eventos Security de los DC habilitados con auditoría de administración de cuentas

```kql
WindowsEvent
| where TimeGenerated > ago(24h) and EventID == 4740
| extend Cuenta=tostring(EventData.TargetUserName),
         SID=tostring(EventData.TargetSid),
         Caller=tostring(EventData.CallerComputerName)
| where Cuenta =~ "ana.martin"  // Usuario de ejemplo; sustituir
| project TimeGenerated, DC=Computer, Cuenta, SID, Caller, EventID, EventRecordId
| order by TimeGenerated asc
```

**Interpretación:** Construye línea temporal de bloqueos en los DC e identifica CallerComputerName para investigar.

**Límites:** CallerComputerName puede ser vacío/intermediario; 4740 no revela aplicación que envió la contraseña incorrecta.

#### Sentinel WindowsEvent: fallos 4625 próximos a la cuenta

**Requisito:** WindowsEvent en DC, equipos miembros, RDS y/o aplicación; eventos 4625 ingestados

```kql
WindowsEvent
| where TimeGenerated > ago(24h) and EventID == 4625
| extend Cuenta=tostring(EventData.TargetUserName),
         IP=tostring(EventData.IpAddress),
         Estacion=tostring(EventData.WorkstationName),
         Tipo=tostring(EventData.LogonType),
         Status=tostring(EventData.Status), SubStatus=tostring(EventData.SubStatus)
| where Cuenta =~ "ana.martin"
| summarize Fallos=count(), Primer=min(TimeGenerated), Ultimo=max(TimeGenerated),
            Motivos=make_set(strcat(Status,"/",SubStatus), 12),
            Tipos=make_set(Tipo, 10)
    by Computer, IP, Estacion, bin(TimeGenerated, 15m)
| order by Primer asc
```

**Interpretación:** Localiza equipos fuente/destino y códigos de error cercanos al bloqueo.

**Límites:** No todos los fallos de Kerberos/NTLM producen 4625 en el DC. Complementar con 4771/4776 cuando sean relevantes.

### SPL: consultas de investigación

#### Splunk Windows raw: línea temporal de 4740

**Requisito:** Índice ilustrativo windows con EventCode extraído y XML Security en DCs

```spl
index=windows earliest=-24h (sourcetype="XmlWinEventLog:Security" OR sourcetype="WinEventLog:Security") EventCode=4740
| eval Cuenta=coalesce(TargetUserName, Account_Name), Caller=coalesce(CallerComputerName, Caller_Computer_Name)
| search Cuenta="ana.martin"
| table _time host Cuenta Caller TargetSid SubjectUserName
| sort 0 _time
```

**Interpretación:** Muestra qué DC registró el bloqueo y el CallerComputerName informado.

**Límites:** Las extracciones dependen del TA. Account_Name podría estar multivaluado o incluir Subject; verificar que se refiere al objetivo.

#### Splunk CIM Authentication: fallos de la cuenta

**Requisito:** Modelo CIM Authentication; action=failure correctamente mapeado; abarca apps y sistemas que se hayan integrado

```spl
| tstats count as Fallos min(_time) as Primer max(_time) as Ultimo
  from datamodel=Authentication.Authentication
  where Authentication.action="failure" Authentication.user="ana.martin" earliest=-24h
  by Authentication.src Authentication.dest Authentication.app _time span=15m
| rename Authentication.* AS *
| sort 0 Primer
```

**Interpretación:** Compara fuentes y destinos de logins fallidos, incluso si origen no es Windows.

**Límites:** Un mismo usuario puede tener formatos DOMINIO\usuario/UPN distintos; normalizar o adaptar filtro antes de concluir que faltan eventos.

### Comandos de observación y comprobación

**Windows — revisar 4740 en DC autorizado:** Ejecutar por rol delegado o administración; consulta lectura, no desbloquea la cuenta.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4740; StartTime=(Get-Date).AddDays(-1)} | Select-Object TimeCreated, MachineName, Message -First 30
```

**Windows — estado de cuenta AD (si existe RSAT y permisos):** No recupera credenciales, permite comprobar estado y contexto.

```powershell
Get-ADUser -Identity 'ana.martin' -Properties LockedOut,LastBadPasswordAttempt,BadPwdCount | Select-Object SamAccountName,LockedOut,LastBadPasswordAttempt,BadPwdCount
```

**Windows — tareas y procesos de la máquina identificada:** Consulta sólo lectura; confirmar propietario antes de tocar tareas.

```powershell
Get-ScheduledTask | Select-Object TaskName,TaskPath,State,Actions,Principal
```

**Windows — sesiones de credenciales:** Lista destinos de credenciales guardadas; no obtiene contraseñas.

```powershell
cmdkey /list
```

### Contención y límites de autoridad

Evitar ciclos de desbloqueo sin corregir causa; pueden agravar el problema y ocultar un ataque. No reiniciar todos los DC ni cambiar contraseñas de cuentas de servicio sin coordinación. Si hay ataque activo o actividad privilegiada, elevar a IAM/IR para bloqueo de origen legítimamente identificado, políticas de riesgo y revocación autorizada de credenciales/sesiones. Documentar las medidas y verificar que el acceso empresarial funciona.

### Cuándo escalar a N2 / Incident Response

- Bloqueos simultáneos de múltiples usuarios o de administradores/servicios críticos.
- Los intentos proceden de IP/hosts no inventariados o de varias ubicaciones inexplicables.
- Existen éxitos anómalos correlacionados, movimientos laterales o señales adicionales de compromiso.
- La misma fuente sigue atacando tras la corrección de credenciales.
- Hay continuidad de negocio afectada, potencial DoS o repetición pese a acciones del Service Desk.

### Falsos positivos que debes evaluar

- Cliente de correo móvil conserva contraseña anterior.
- Conexión RDP guardada, drive de red reconectado o credencial de Office antigua.
- Servicio Windows o aplicación IIS utilizando identidad desactualizada.
- Herramienta de backup o agente de monitorización con contraseña antigua.
- Nombre de equipo de 4740 asociado a un gateway, no a estación atacante.

### Errores frecuentes que penalizan en entrevista

- Desbloquear repetidamente sin localizar origen.
- Tratar SubjectUserName del 4740 como la cuenta víctima.
- Buscar 4740 solo en el PC del empleado y no en DCs.
- Decidir que CallerComputerName es fuente irrefutable del ataque.
- Rotar una cuenta de servicio sin inventariar dependencias y dueño.
- Asegurar que no hay ataque solo porque el usuario cambió su contraseña.

### Perspectiva Red Team y Blue Team

Un adversario puede causar bloqueos con contraseñas erróneas para degradar el servicio o encubrir intentos de acceso. La observación defensiva compara el patrón de usuarios/fuentes y el motivo de los fallos con los dispositivos y procesos del usuario. MITRE T1110 se usa como posibilidad a contrastar; el bloqueo repetido por sí solo no demuestra fuerza bruta.

### Respuesta modelo de entrevista

> Buscaría eventos 4740 en los controladores de dominio, identificando TargetUserName, SID, CallerComputerName y hora. A continuación correlacionaría 4625, 4771 y 4776 según el método de autenticación y revisar credenciales guardadas en teléfono, VPN, RDP, servicios y tareas. Distinguiría si es el mismo host fallando tras cada desbloqueo o varios orígenes no autorizados. Coordinaría con IAM la solución de raíz y solo después comprobaría que cesan los bloqueos y que los servicios funcionan.

### Criterios de evaluación del candidato

- [ ] Conoce evento 4740 y sus principales campos.
- [ ] Sabe dónde buscarlo: DCs; no asume que CallerComputerName sea IP final.
- [ ] Relaciona Kerberos, NTLM, contraseñas guardadas y servicios.
- [ ] No propone desbloqueos repetitivos ni rotaciones destructivas.
- [ ] Verifica solución, escalado y evidencia.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1110, T1078

### Fuentes de documentación

- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740
- https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication

---

<a id="n1-13"></a>
## N1-13 — Proceso kworker al 95 % de CPU: ¿kernel o suplantación?

**Nivel:** SOC N1 · **Bloque:** Windows, Linux y Active Directory

> **Pregunta de entrevista:** En un servidor Linux encuentras un proceso llamado kworker consumiendo el 95 % de la CPU. ¿Cómo comprobarías si es legítimo o malicioso?

### Escenario y objetivo

El sistema de monitorización alerta de uso del 95 % de un núcleo en un servidor Ubuntu. En `top` aparece una entrada de nombre kworker. El equipo de infraestructura afirma que empezó tras una actualización de controladores; a la vez se instaló un servicio externo de mantenimiento. No tienes prueba de malware. Se dispone de SSH de solo lectura, registros syslog/journald y MDE para Linux en un subconjunto de los hosts.

**Objetivo:** Diferenciar un hilo de trabajo real del kernel que consume CPU debido a I/O/hardware de un ejecutable de espacio de usuario que imita el nombre, sin matar hilos de kernel ni degradar el servidor. Correlacionar identidad del proceso, padre, ejecutable, recursos, conexiones y cambios.

### Hipótesis a contrastar

- Un auténtico kernel worker thread está procesando colas del kernel, debido a driver, hardware, interrupciones, filesystem, I/O o una regresión.
- Proceso de usuario malicioso usa nombre parecido a kworker para camuflar minería, persistencia o comunicaciones.
- Un proceso legítimo de usuario tiene nombre engañosamente parecido; debe confirmarse con inventario, ruta y empaquetado.
- Un servicio de infraestructura creó carga real que activa trabajos del kernel; el trabajador afectado no es el origen del problema.
- Interpretación errónea del porcentaje de CPU por hilo/núcleo, contenedor o muestreo; valor alto no demuestra malware.

### Procedimiento operativo, paso a paso

**0. Validar alerta y alcance** — Confirmar host, distribución/kernel, uptime, 95 % de qué métrica (núcleo, total, hilo), carga histórica, fecha de parches y efectos sobre disponibilidad.

**1. Identificar PID/TID y representación** — Ejecutar `ps` y `top -H` para observar PID, PPID, STAT, comm y args. Los hilos auténticos suelen presentarse entre corchetes, por ejemplo `[kworker/2:1-events]`; la grafía sola es falsificable.

**2. Diferenciar kernel thread de proceso usuario** — Inspeccionar `/proc/<PID>/exe`, `cmdline`, `status` y `maps` en lectura. Un kernel thread auténtico generalmente carece de ejecutable de espacio de usuario y de línea de comandos; un ejecutable sospechoso podría mostrar ruta real o estar borrado. Ausencia de exe no es prueba definitiva.

**3. Revisar parentage** — Mirar PPID y genealogía. Kernel threads suelen estar asociados a `kthreadd` (PID 2) o gestionados por kernel; un padre tipo `bash`, `python`, `systemd` o un shell de webapp justifica atención si el nombre aparenta un worker de kernel. PPID por sí solo no prueba compromiso.

**4. Observar red y archivos sin alterar** — Consultar sockets de procesos de usuario con `ss -tunap` y `lsof -p PID` cuando corresponda; kernel threads no son ejecutables de usuario normales. Revisar archivos temporales, permisos y cambios de servicios autorizados, sin descargar/ejecutar muestras.

**5. Revisar kernel y rendimiento** — Consultar `journalctl -k`, errores de I/O, driver, interrupciones y cambios recientes de kernel. Si es worker auténtico, escalar a SRE/Linux y evitar kill -9, reinicio o cambios de módulo sin evaluación.

**6. Correlacionar EDR y logs** — Buscar creación de procesos de usuario que coincidan con `kworker` en DeviceProcessEvents o CIM Endpoint.Processes. La ausencia de un registro para un hilo de kernel genuino es esperable; no equivale a host limpio.

**7. Determinar riesgo** — Si hay binario de usuario con ruta temporal, hash desconocido, conexión externa, persistencia o cadena padre anómala, registrar evidencia y elevar a N2/IR; si es kernel legítimo con señales de driver, transferir a Infra/SRE con datos.

**8. Verificar y documentar** — Medir carga tras intervención aprobada; preservar hora, PID/TID, PPID, ejecutable si existe, hash si procede, red, logs de kernel, cambios y responsable.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| PID, TID, PPID, STAT, cmd/comm | Permiten saber qué se está midiendo y si parece un hilo del kernel o proceso de usuario. El nombre es editable por adversario. |
| `/proc/<PID>/exe`, `cmdline`, `maps` | Un hilo kernel genuino normalmente carece de exe/cmdline de usuario; proceso de usuario suele ofrecer ruta y argumentos, con excepciones y permisos. |
| PPID 2 (kthreadd) y corchetes | Orientan a kernel thread, no constituyen verificación criptográfica ni descartan anomalías más profundas. |
| Conexiones y ficheros abiertos | Proceso de usuario sospechoso podría comunicarse o leer archivos; no atribuir conexiones a un kernel thread solo por coincidencia de nombre. |
| Logs del kernel, driver, I/O, IRQ | Ayudan a investigar actividad normal de kworker y regresiones; no confundir carga con compromiso. |
| EDR DeviceProcessEvents / auditd | Captura ejecución de binarios de usuario; un verdadero kworker no tiene por qué generar evento de creación de proceso como un ejecutable. |
| Cambio de kernel, servicio, update | Correlación temporal con mantenimiento puede orientar, pero no certifica benignidad. |

### KQL: consultas de investigación

#### Defender XDR: ejecutables de usuario con nombre kworker

**Requisito:** DeviceProcessEvents desde Defender for Endpoint para Linux correctamente incorporado

```kql
DeviceProcessEvents
| where Timestamp > ago(7d)
| where FileName startswith "kworker" or ProcessCommandLine contains "kworker"
| project Timestamp, DeviceName, DeviceId, FileName, FolderPath,
          ProcessCommandLine, AccountName, ProcessId,
          InitiatingProcessFileName, InitiatingProcessCommandLine, SHA1
| order by Timestamp desc
```

**Interpretación:** Identifica programas de usuario cuyo nombre o comando simula procesos del kernel; revisar ruta, padre y hash.

**Límites:** No representa la actividad interna de hilos kernel ni mide su porcentaje de CPU. La visibilidad depende de sensor y retención.

#### Defender XDR: actividad de red atribuida a ejecutable llamado kworker

**Requisito:** DeviceNetworkEvents de endpoints Linux con MDE; puede ser vacío en worker kernel genuino

```kql
DeviceNetworkEvents
| where Timestamp > ago(7d)
| where InitiatingProcessFileName startswith "kworker"
| project Timestamp, DeviceName, InitiatingProcessFileName,
          InitiatingProcessFolderPath, InitiatingProcessCommandLine,
          RemoteIP, RemotePort, ActionType, InitiatingProcessSHA1
| order by Timestamp desc
```

**Interpretación:** Si aparece actividad de red originada por un proceso de usuario llamado kworker, investigar posible suplantación.

**Límites:** La ausencia de eventos no demuestra inocuidad; muchos hosts Linux no están incorporados a MDE, y el sensor no instrumenta todo el kernel.

### SPL: consultas de investigación

#### Splunk CIM Endpoint: procesos con nombres semejantes a kworker

**Requisito:** CIM Endpoint.Processes mapeado desde auditd, Sysmon for Linux o EDR; requiere campo process_name

```spl
| tstats count as Ejecuciones values(Processes.process) as Lineas
         values(Processes.process_path) as Rutas
         values(Processes.parent_process_name) as Padres
  from datamodel=Endpoint.Processes earliest=-7d
  where Processes.process_name="kworker*"
  by Processes.dest Processes.process_name
| rename Processes.* AS *
| sort - Ejecuciones
```

**Interpretación:** Agrupa ejecutables de usuario con nombre sospechosamente parecido a kworker para comparar rutas y padres.

**Límites:** No mide CPU ni incluye necesariamente hilos kernel. `tstats` requiere que campos estén presentes en el datamodel y en fuentes mapeadas.

#### Splunk auditd: búsquedas de ejecución de binarios kworker

**Requisito:** Ejemplo de búsqueda sobre logs auditd con crudos completos ingestados en índice linux; adaptar sourcetype y registros EXECVE/PATH

```spl
index=linux earliest=-7d (sourcetype="linux:audit" OR sourcetype="auditd")
("kworker" OR "kworker/")
| table _time host type msg exe comm proctitle _raw
| sort 0 -_time
```

**Interpretación:** Busca pistas de ejecución usuario/auditd y deja contexto del mensaje crudo para validar.

**Límites:** La simple aparición de la palabra kworker en mensajes no demuestra malware. auditd puede no estar instalado, ni registrar hilos del kernel ni todos los argumentos.

### Comandos de observación y comprobación

**Linux — listar procesos e hilos por CPU:** Lectura; la utilidad `ps` puede truncar args según terminal.

```bash
ps -eLo pid,tid,ppid,stat,comm,pcpu,args --sort=-pcpu | head -n 25
```

**Linux — metadatos de un PID:** Cambiar PID solo después de identificarlo. readlink puede fallar de forma esperable para hilos kernel.

```bash
PID=1234  # Sustituir por el PID observado
ps -p "$PID" -o pid,ppid,user,stat,comm,args
sudo readlink "/proc/$PID/exe" || true
sudo cat "/proc/$PID/status" | head -n 20
```

**Linux — línea de comandos de un proceso de usuario:** En worker kernel puede venir vacía; mostrar byte nulo como separador legible.

```bash
PID=1234
sudo tr '\0' ' ' < "/proc/$PID/cmdline"; echo
```

**Linux — mensajes recientes del kernel:** Revisión de hardware/driver/I/O y correlación temporal.

```bash
sudo journalctl -k --since "2 hours ago" --no-pager | tail -n 100
```

**Linux — conexiones salientes:** Ver conexiones y procesos disponibles; evita matar PID por nombre.

```bash
sudo ss -tunap
```

### Contención y límites de autoridad

No ejecutar `kill -9` sobre un supuesto kworker: si es kernel thread, además de no ser una solución fiable, la operación puede desestabilizar el sistema; si es malware, perderías contexto de investigación. Para proceso de usuario claramente malicioso, pedir contención aprobada vía EDR o restricción de red, recoger evidencia antes cuando sea viable, y coordinar con Infra si la carga afecta producción. Para kernel thread genuino, derivar al equipo del kernel/hardware y seguir diagnóstico seguro.

### Cuándo escalar a N2 / Incident Response

- Se confirma ejecutable de usuario haciéndose pasar por kworker, en ruta no autorizada o con persistencia.
- Existen comunicaciones externas, lectura de secretos, modificación de cuentas o escritura de archivos asociadas.
- CPU elevada produce caída de un sistema crítico o aumento sostenido de latencias.
- La creación del proceso no coincide con actividades de mantenimiento autorizadas.
- Se detectan alteraciones de herramientas de monitorización, EDR u ocultación de procesos.

### Falsos positivos que debes evaluar

- Kernel worker real después de actualizar un controlador o módulo.
- Eventos intensos de I/O, filesystem, discos o interrupciones de red.
- Aplicaciones legítimas que usan etiquetas internas kworker (no habituales, pero posibles).
- Top presenta 95 % de un núcleo, no del sistema completo.
- Una cadena de texto kworker aparece en logs sin proceso ejecutable correspondiente.

### Errores frecuentes que penalizan en entrevista

- Asumir que 95 % de CPU equivale a cryptominer.
- Matar todos los procesos de nombre parecido a kworker.
- Creer que corchetes y PPID 2 hacen imposible el engaño.
- Afirmar que MDE `DeviceProcessEvents` captura todos los kthreads de kernel.
- No verificar ruta, parentage, `/proc`, drivers, kernel logs y conexiones.
- Reiniciar producción sin recopilar indicadores y sin permiso.

### Perspectiva Red Team y Blue Team

El masquerading T1036 puede utilizar nombres cercanos a servicios legítimos o kernel workers. Un ejecutable de usuario puede cambiar su nombre visible o lanzar procesos con ruta/argv engañosos, lo que exige contrastar /proc, procesos, origen de creación y archivos. En paralelo un kworker real alto puede ser síntoma de hardware, no de atacante. El Blue Team distingue identidad real de un proceso frente a su etiqueta.

### Respuesta modelo de entrevista

> Primero verificaría qué significa el 95 % de CPU y si `kworker` es un hilo real del kernel. Haría `ps` para PID/PPID/STAT, luego comprobaría `/proc/PID/exe` y `cmdline`, sabiendo que un kernel thread suele carecer de ejecutable de usuario. Revisaría logs del kernel, actualización de drivers y el servicio nuevo, además de EDR, conexiones y ruta si existe un proceso de usuario. No lo mataría por el nombre: si es carga legítima derivaría a Infra; si aparece un binario camuflado con actividad no autorizada escalaría a IR.

### Criterios de evaluación del candidato

- [ ] Distingue hilo kernel de ejecutable de usuario y límites de top/ps.
- [ ] Sabe interpretar PPID/comm/cmdline y /proc con cautela.
- [ ] Usa evidencia de cambios, I/O, kernel, EDR y red.
- [ ] No propone kill indiscriminado ni atribución solo por CPU.
- [ ] Escala por compromiso o disponibilidad y documenta.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1036, T1036.004

### Fuentes de documentación

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.4/data-models/endpoint
- https://attack.mitre.org/techniques/T1036/

---

<a id="n1-14"></a>
## N1-14 — PowerShell cada cinco minutos mediante una tarea programada

**Nivel:** SOC N1 · **Bloque:** Windows, Linux y Active Directory

> **Pregunta de entrevista:** Detectas una tarea programada en Windows que ejecuta PowerShell cada cinco minutos. ¿Qué revisarías antes de clasificarla como maliciosa?

### Escenario y objetivo

Defender señala que el equipo FIN-WS-17 ejecuta PowerShell cada cinco minutos desde las 08:00. Existe una tarea llamada `UpdaterCheck` cuyo XML apunta a `powershell.exe -NoProfile -File C:\ProgramData\Ops\maintenance.ps1`. El nombre puede pertenecer a un despliegue autorizado o a persistencia. No hay prueba de que el script sea malicioso.

**Objetivo:** Atribuir la tarea a su creador, identificar exactamente qué ejecuta, cuándo se creó o modificó, permisos y cuenta de ejecución, impacto del código, proceso y red; decidir si es administración legítima o persistencia ofensiva sin borrarla prematuramente.

### Hipótesis a contrastar

- Tarea autorizada del área IT/SRE para inventario, monitorización o mantenimiento.
- Persistencia no autorizada: atacante crea o modifica tarea para ejecutar script periódico.
- Software legítimo con actualización o gestión mediante PowerShell e intervalos cortos.
- Script originalmente legítimo alterado tras compromiso (task hijacking).
- Tarea deshabilitada, nunca ejecutada o detección basada en existencia sin actividad real.

### Procedimiento operativo, paso a paso

**0. Diferenciar existencia de ejecución** — Verificar que Task Scheduler muestra tarea habilitada, trigger de cinco minutos, último resultado y ejecución real. Una tarea definida no prueba que se haya ejecutado.

**1. Recuperar XML íntegro** — Documentar TaskName/TaskPath, Actions (exe, argumentos, working directory), Triggers, Principal (cuenta), RunLevel, Hidden, fecha, autor y permisos. No ejecutar el script para probarlo.

**2. Buscar cambios en auditoría** — Correlacionar 4698 (creación), 4702 (modificación), 4699 (eliminación) cuando está habilitado Audit Other Object Access Events; consultar canal TaskScheduler/Operational 106/140 y 200/201 si se colectan.

**3. Reconstruir ejecución** — Con 4688 (si se audita creación de procesos con línea) y MDE DeviceProcessEvents observar powershell.exe/pwsh.exe, padre real, cuenta, línea de comandos, archivos abiertos y frecuencia. La relación con scheduler requiere contexto; el padre varía por versión.

**4. Investigar script** — Calcular hash, firma, procedencia, ACL, creador, fechas, control de versiones, modificaciones recientes y referencias a red. Buscar codificación inesperada, descargas, cambios de defensas o persistencia, sin ejecutar.

**5. Validar autorización y necesidad** — Verificar ticket de cambio, GPO/Intune/SCCM/RMM, firma de proveedor y dueño del sistema. Un nombre parecido a Update o Windows no certifica legitimidad.

**6. Correlacionar consecuencias** — Relacionar cada ejecución con acceso a archivos, red, nuevos procesos, modificación de registro/servicios, alertas y uso de privilegios. Una tarea legítima también puede estar comprometida.

**7. Decidir y escalar** — Si hay script no autorizado, ejecutado con SYSTEM y con descarga/ejecución sospechosa, escalar N2/IR. Solicitar deshabilitar con preservación y plan de rollback si autorizado; no eliminar sin copia.

**8. Registrar** — Guardar copia controlada del XML, hashes, cronología, dueño, comando, rutas, proceso asociado, destinos, permisos, impacto y resolución.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| EventID 4698, 4702 | Creación y actualización respectivamente cuando auditoría está activada. XML puede contener ruta, argumentos y cuenta de ejecución. |
| TaskScheduler/Operational 106/140, 200/201 | Pistas de registro/modificación/ejecución de acción según versión y configuración. No asumir que esos eventos están presentes. |
| Principal/RunLevel/Hidden | Permisos y visibilidad. SYSTEM o run highest requiere especial contexto, pero es frecuente en administración legítima. |
| Acción y argumentos PowerShell | Ruta, flags, script y directorio de trabajo. EncodedCommand y opciones de evasión son pistas, no veredicto por sí solas. |
| 4688 / DeviceProcessEvents | Prueba de creación y contexto del proceso, padre, usuario y hora. La línea de comandos 4688 requiere política explícita. |
| Hash, firma, ACL y cambios de script | Permite comparar integridad con despliegue esperado y priorizar cambios fuera de ventana. |
| Conexiones/red/registro | Determina efectos de ejecución como descarga, C2, alteración de defensas o comportamiento de administración esperado. |

### KQL: consultas de investigación

#### Sentinel WindowsEvent: creación/modificación de tareas 4698 y 4702

**Requisito:** WindowsEvent Security con Audit Other Object Access Events, extraer TaskContent/TaskNewContent como XML en string

```kql
WindowsEvent
| where TimeGenerated > ago(7d) and EventID in (4698, 4702)
| extend D=EventData
| extend Nombre=tostring(D.TaskName), Autor=tostring(D.SubjectUserName),
         Xml=coalesce(tostring(D.TaskContent), tostring(D.TaskNewContent))
| where Nombre has "UpdaterCheck" or Xml contains "powershell"
| project TimeGenerated, Computer, EventID, Nombre, Autor, Xml
| order by TimeGenerated desc
```

**Interpretación:** Detecta altas/actualizaciones de tareas cuyo contenido menciona PowerShell o el nombre investigado.

**Límites:** El nombre XML y los campos depende de versión y parseo; tareas existentes antes de la ventana no aparecerán. Consultar inventario local.

#### Defender XDR: ejecuciones PowerShell relacionadas con ruta de tarea

**Requisito:** DeviceProcessEvents con MDE en Windows; comparar el equipo, la ruta, usuario, proceso padre y repetición

```kql
DeviceProcessEvents
| where Timestamp > ago(3d)
| where FileName in~ ("powershell.exe", "pwsh.exe")
| where ProcessCommandLine contains "maintenance.ps1"
| project Timestamp, DeviceName, FileName, ProcessCommandLine,
          AccountName, InitiatingProcessFileName,
          InitiatingProcessCommandLine, ProcessId, SHA1
| order by Timestamp desc
```

**Interpretación:** Localiza ejecuciones efectivas del script y da contexto de padre y usuario.

**Límites:** No atribuye automáticamente la ejecución a la tarea: el script puede ejecutarse manualmente o desde otra plataforma; ajustar nombre del archivo.

### SPL: consultas de investigación

#### Splunk Windows Security: eventos de creación/edición de tareas

**Requisito:** Índice windows Security con EventCode y TaskName/TaskContent extraídos; revisar XML crudo

```spl
index=windows earliest=-7d (sourcetype="XmlWinEventLog:Security" OR sourcetype="WinEventLog:Security")
(EventCode=4698 OR EventCode=4702)
| eval Tarea=coalesce(TaskName, Task_Name), Contenido=coalesce(TaskContent, TaskNewContent)
| search Tarea="*UpdaterCheck*" OR Contenido="*powershell*"
| table _time host EventCode SubjectUserName Tarea Contenido
| sort 0 -_time
```

**Interpretación:** Localiza creación/modificación y conserva definición para revisar argumentos.

**Límites:** TaskContent puede requerir extracción XML específica; campos e índice son ilustrativos. Una tarea previa puede no generar 4698 en el período.

#### Splunk CIM Endpoint: creaciones de procesos PowerShell

**Requisito:** Datamodel CIM Endpoint.Processes con ruta y cmdline mapeadas, desde EDR o Sysmon/4688 normalizados

```spl
| tstats count as Ejecuciones values(Processes.process) as Comandos
         values(Processes.parent_process_name) as Padres
  from datamodel=Endpoint.Processes earliest=-3d
  where Processes.process_name="powershell.exe" OR Processes.process_name="pwsh.exe"
  by Processes.dest Processes.user _time span=5m
| rename Processes.* AS *
| where mvfind(Comandos, "maintenance\\.ps1") >= 0
| sort 0 -Ejecuciones
```

**Interpretación:** Resume ejecuciones del script en ventanas de cinco minutos para buscar coincidencia temporal con la tarea.

**Límites:** Requiere campo Processes.user mapeado y multivalue Comandos. La agrupación de cinco minutos no demuestra trigger exacto ni parentage.

### Comandos de observación y comprobación

**Windows — listar tarea y detalles:** Solo lectura en endpoint autorizado; nombre y ruta podrían no coincidir.

```powershell
Get-ScheduledTask -TaskName 'UpdaterCheck' | Format-List TaskName,TaskPath,State,Actions,Triggers,Principal,Settings
```

**Windows — exportar definición XML:** Guardar evidencia en ubicación segura siguiendo procedimiento; no copiar secretos indiscriminadamente.

```powershell
Export-ScheduledTask -TaskName 'UpdaterCheck' -TaskPath '\' | Out-File -FilePath 'C:\IR\UpdaterCheck.xml' -Encoding utf8
```

**Windows — consultar historial 4698 / 4702:** Requiere habilitación de auditoría y acceso al registro Security.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4698,4702; StartTime=(Get-Date).AddDays(-7)} -MaxEvents 50
```

**Windows — comprobar hash del script (si existe):** No ejecuta ni carga el script; hash puede usarse para correlación.

```powershell
Get-FileHash -Algorithm SHA256 'C:\ProgramData\Ops\maintenance.ps1'
```

### Contención y límites de autoridad

Como N1, no suprimir una tarea de mantenimiento crítica o eliminar el script sin preservar XML, hashes, cronología y dueño. Si hay ejecución maliciosa probable o activa, escalar y solicitar deshabilitación temporal/aplicación EDR según procedimiento autorizado, sin ejecutar el fichero. Asegurar continuidad del servicio, posibles dependencias y verificación posterior. No confundir contención con borrado de evidencia.

### Cuándo escalar a N2 / Incident Response

- Tarea creada/modificada fuera de cambio aprobado por usuario inesperado o cuenta privilegiada.
- Acción invoca PowerShell que descarga/ejecuta desde Internet, altera defensas o accede a datos sensibles.
- El script cambia de hash inesperadamente, se ejecuta desde ruta temporal o tiene ACL abiertas.
- La tarea se replica en múltiples equipos sin herramienta de despliegue identificada.
- Eventos de red, procesos o persistencia corroboran ejecución no autorizada.

### Falsos positivos que debes evaluar

- Script de monitorización aprobado cada cinco minutos.
- Despliegue Intune/RMM/SCCM/GPO con PowerShell legítimo.
- Mantenimiento de ERP/backup y procesos programados del área IT.
- Cuenta SYSTEM usada legítimamente para ejecutar tarea de infraestructura.
- Tarea existente no ejecutada por estar deshabilitada o por condición incumplida.

### Errores frecuentes que penalizan en entrevista

- Clasificar todo PowerShell en tareas como persistencia maliciosa.
- Ejecutar el script sospechoso para ver si funciona.
- Borrar o deshabilitar sin preservar definición y sin evaluar producción.
- Ignorar eventos 4698/4702, cuenta/RunLevel y verificación de cambios.
- Afirmar que 4688 siempre incluye línea de comandos (requiere política).
- Concluir que repetición temporal implica conexión C2 sin datos de red.

### Perspectiva Red Team y Blue Team

MITRE T1053.005 describe el abuso de tareas programadas para persistencia, ejecución o elevación cuando existen condiciones apropiadas; T1059.001 cubre ejecución con PowerShell. El adversario puede disfrazar tarea bajo nombre similar a actualizaciones o modificar una tarea legítima. La defensa debe revisar registro de creación, XML de acciones, integridad del script y efectos de ejecución; la existencia de una tarea no atribuye técnica por sí sola.

### Respuesta modelo de entrevista

> Primero verificaría la definición completa y el historial de la tarea: propietario, cuenta, privilegios, trigger, acción, ruta, argumentos, XML y si realmente se ejecuta cada cinco minutos. Revisaría Security 4698/4702 y TaskScheduler/Operational cuando estén disponibles, además de 4688/Defender XDR para procesos ejecutados. Validaría el hash y el ticket de cambio del script sin ejecutarlo, y correlacionaría red y modificaciones. No eliminaría nada solo por ver PowerShell: si aparece actividad no autorizada escalaría con evidencias para una contención controlada.

### Criterios de evaluación del candidato

- [ ] Diferencia existencia de tarea de ejecución real.
- [ ] Conoce 4698/4702, XML, triggers, Principal y RunLevel.
- [ ] Correlaciona proceso, archivo, padre, hash, red y cambio aprobado.
- [ ] No ejecuta ni elimina evidencia precipitadamente.
- [ ] Establece criterios y escalado según impacto.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1053.005, T1059.001

### Fuentes de documentación

- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698
- https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4702
- https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://attack.mitre.org/techniques/T1053/005/

---

<a id="n1-15"></a>
## N1-15 — Usuario ejecuta un EXE recibido por correo sin alerta del antivirus

**Nivel:** SOC N1 · **Bloque:** Windows, Linux y Active Directory

> **Pregunta de entrevista:** Un usuario ejecutó un archivo .exe recibido por correo y Defender no generó ninguna alerta. ¿Qué registros y evidencias consultarías?

### Escenario y objetivo

Un empleado de finanzas informa a las 11:30 que descargó y ejecutó `factura_octubre.exe` desde un mensaje con supuesto PDF convertido a instalador. El archivo mostró una pantalla en blanco y desapareció. Microsoft Defender no registra detección en la consola. El equipo FIN-WS-04 está incorporado a Defender for Endpoint; Security Events y proxy están parcialmente disponibles. Aún no hay prueba de infección ni exfiltración.

**Objetivo:** Reconstruir descarga, ejecución, procesos hijos, conexiones, efectos sobre archivos/persistencia y controles de seguridad aun en ausencia de alerta AV. Determinar nivel de certeza y riesgo para contener a tiempo, preservar evidencia y orientar la respuesta N2/IR.

### Hipótesis a contrastar

- Archivo ejecutable benigno no reconocido por el usuario, firmado y distribuido mediante proceso autorizado, aunque la entrega por correo es atípica.
- Ejecución maliciosa inicial no detectada (ausencia de firma, retraso, políticas, exclusiones, evasión o falta de telemetría).
- Archivo se ejecutó pero falló inmediatamente; puede haber creado procesos hijos, modificado claves o establecido persistencia antes de salir.
- El usuario abrió un enlace/acceso directo distinto de un EXE, o el correo adjunto fue renombrado: requiere confirmación de evidencia.
- La consola EDR no muestra alerta debido a salud del agente, alcance de retención, visibilidad o falta de reglas de detección.

### Procedimiento operativo, paso a paso

**0. Asegurar la respuesta temprana** — Confirmar hora, usuario, hostname, criticidad, ubicación del archivo y si el proceso sigue vivo. Si hay evidencia de actividad activa, coordinar aislamiento EDR aprobado; no esperar indefinidamente a una alerta automática.

**1. Preservar correo y contexto** — Conservar ID del mensaje, remitente, encabezados, URL/adjunto, hash de la muestra en repositorio seguro, hora de entrega y acciones del usuario; no reenviar el EXE a terceros ni ejecutarlo en máquinas de producción.

**2. Verificar ejecución real** — En Defender XDR DeviceProcessEvents buscar FileName, ruta, SHA1, ProcessCommandLine, InitiatingProcess*, AccountName, ProcessId y tiempo. En Windows buscar 4688 o Sysmon Event 1 si existen; no asumir que el archivo se ejecutó por haber sido descargado.

**3. Reconstruir árbol de procesos** — Correlacionar PID con hora de creación, DeviceId, padres e hijos, y comprobar si abrió PowerShell, cmd, rundll32, mshta, wscript, servicios o procesos inesperados. El PID se reutiliza y no debe emparejarse sin ventana de tiempo.

**4. Revisar operaciones de archivo** — Investigar DeviceFileEvents: origen de descarga (si está disponible), creación/escritura de nuevos binarios, ficheros en ProgramData/AppData/Temp y cambios de hash. Un SHA256 de MDE puede no estar poblado; usar SHA1 del sensor cuando exista, y SHA256 local para cadena de custodia.

**5. Correlacionar red e identidad** — Buscar DeviceNetworkEvents por proceso/hash, DNS/proxy/firewall y posteriores inicios de sesión o permisos. Tráfico HTTPS no es automáticamente malicioso ni seguro; inspeccionar destino y volumen donde esté autorizado.

**6. Revisar persistencia y evasión** — Comprobar tareas, Run keys, servicios, WMI, Defender DeviceEvents y salud del agente: estado de protección, alertas, exclusiones y modificaciones. No desactivar herramientas para testear el malware.

**7. Investigar alcance** — Buscar SHA1/nombre/ruta/indicadores en otros dispositivos, otros destinatarios de correo, URLs y dominios relacionados; identificar si varios empleados abrieron el adjunto.

**8. Escalar y contener de forma proporcionada** — Si hay proceso sospechoso, persistencia, detección TI fiable o conexiones de exfiltración, escalar urgente a N2/IR y solicitar aislamiento del equipo y bloqueo de indicadores validados. Preservar telemetría y garantizar medidas de recuperación.

**9. Validar remediación y cierre** — Mantener el caso abierto hasta comprobar proceso, mecanismos persistentes, otras estaciones, integridad del agente y acciones posteriores del atacante. Documentar alcance, confianza, qué se sabe y qué falta; ausencia de alertas no es cierre.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Mensaje original, cabeceras y URL | Origen de entrega y otros destinatarios; no fiarse solo de la dirección From visible. |
| DeviceProcessEvents / 4688 / Sysmon 1 | Confirma creación de proceso con tiempo, usuario, línea y padre si telemetría disponible; descargado ≠ ejecutado. |
| DeviceFileEvents y orígenes | Descargas, copias y cambios de archivos; FileOriginUrl puede faltar, no es garantía de atribución. |
| SHA1 de MDE y SHA256 local | Correlación e integridad; campos SHA256 de MDE pueden venir vacíos. La mera coincidencia de hash no dicta por sí sola intención. |
| DeviceNetworkEvents / DNS / proxy | Revela comunicaciones del proceso u otros relacionados; puertos normales no implican ausencia de C2. |
| Registro, servicios, tareas | Indicadores de persistencia o cambios posteriores a la ejecución; coordinar acciones con N2. |
| Defender salud y control | Estado de protección, sensores, exclusiones, alertas y cambios. Falta de alerta no prueba que el archivo sea inocuo. |
| Alcance por host/usuario | Otros archivos ejecutados con mismo hash, equipos, destinatarios del mensaje y cuentas con indicios relacionados. |

### KQL: consultas de investigación

#### Defender XDR: ejecución y cadena de origen del EXE

**Requisito:** DeviceProcessEvents de Defender for Endpoint en el endpoint; sustituir nombre/host y ventana temporal por datos del caso

```kql
DeviceProcessEvents
| where Timestamp > ago(3d)
| where DeviceName startswith "FIN-WS-04"
| where FileName =~ "factura_octubre.exe"
      or ProcessCommandLine contains "factura_octubre.exe"
| project Timestamp, DeviceId, DeviceName, FileName, FolderPath, SHA1,
          ProcessId, ProcessCreationTime, ProcessCommandLine, AccountName,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          InitiatingProcessId, InitiatingProcessCreationTime
| order by Timestamp asc
```

**Interpretación:** Confirma si el ejecutable se lanzó, con contexto de usuario, ruta, hash y proceso iniciador.

**Límites:** Nombre y ruta pueden cambiar. No reconstruye por sí solo toda la descendencia; correlacionar DeviceId + ProcessId + creación temporal y datos relacionados para evitar reutilización de PID.

#### Defender XDR: comunicaciones de un proceso sospechoso

**Requisito:** DeviceNetworkEvents con MDE; filtrar equipo y nombre de proceso ilustrativo; comparar con SHA1/tiempo cuando estén disponibles

```kql
DeviceNetworkEvents
| where Timestamp > ago(3d)
| where DeviceName startswith "FIN-WS-04"
| where InitiatingProcessFileName =~ "factura_octubre.exe"
| project Timestamp, DeviceName, RemoteIP, RemoteUrl, RemotePort,
          ActionType, InitiatingProcessFileName, InitiatingProcessFolderPath,
          InitiatingProcessCommandLine, InitiatingProcessSHA1,
          InitiatingProcessId, InitiatingProcessCreationTime
| order by Timestamp asc
```

**Interpretación:** Muestra conexiones que MDE atribuye al EXE; revisar reputación e inventario de cada destino y tiempo respecto a ejecución.

**Límites:** Un proceso hijo o inyección podría generar red bajo otro nombre; ausencia de resultados no confirma que no haya habido comunicación.

### SPL: consultas de investigación

#### Splunk CIM Endpoint: proceso EXE y padres observados

**Requisito:** CIM Endpoint.Processes mapeado de EDR o Sysmon; filtrar por nombre sin ejecutar la muestra

```spl
| tstats count as Ejecuciones values(Processes.process) as Comandos
         values(Processes.process_path) as Rutas
         values(Processes.parent_process_name) as Padres
         values(Processes.process_hash) as Hashes
  from datamodel=Endpoint.Processes earliest=-3d
  where Processes.process_name="factura_octubre.exe"
  by Processes.dest Processes.user _time span=1h
| rename Processes.* AS *
| sort 0 _time
```

**Interpretación:** Permite ver si proceso se creó, dónde y desde qué proceso padre en varios endpoints.

**Límites:** El modelo no conserva siempre parent-child individual tras agrupar; para reconstrucción exacta usar eventos originales y process_guid o PID + hora si no existe GUID.

#### Splunk Security 4688: creación de procesos próximos al incidente

**Requisito:** Índice windows con 4688 auditado; requiere política de Process Creation y extracción del campo CommandLine para capturar argumentos

```spl
index=windows earliest=-3d (sourcetype="XmlWinEventLog:Security" OR sourcetype="WinEventLog:Security") EventCode=4688
| search host="FIN-WS-04*"
| eval Imagen=coalesce(NewProcessName, New_Process_Name),
       Comando=coalesce(CommandLine, Process_Command_Line),
       Padre=coalesce(ParentProcessName, Creator_Process_Name)
| where like(lower(Imagen), "%factura_octubre.exe%")
       OR like(lower(Comando), "%factura_octubre.exe%")
| table _time host SubjectUserName Imagen Padre Comando NewProcessId
| sort 0 _time
```

**Interpretación:** Busca ejecuciones/llamadas relacionadas con el nombre de archivo en Security 4688; sirve como contraste de EDR.

**Límites:** La línea de comandos de 4688 viene vacía sin auditoría apropiada; en determinadas fuentes nombres de campo cambian y hay que normalizar hostname.

### Comandos de observación y comprobación

**Windows — comprobar hash del archivo en custodia:** Solo si existe copia preservada y autorización; calcular hash NO requiere ejecutar el binario.

```powershell
Get-FileHash -Algorithm SHA256 'C:\IR\muestras\factura_octubre.exe'
```

**Windows — buscar 4688 recientes:** Requiere permisos de lectura Security y auditoría de creación de procesos habilitada.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688; StartTime=(Get-Date).AddHours(-6)} -MaxEvents 50
```

**Windows — comprobar estado AV local sin alterar configuración:** Solo lectura; revisar si dispositivos consultados coinciden con host afectado.

```powershell
Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled,AntispywareEnabled,AMEngineVersion
```

**Windows — revisar exclusiones AV localmente (autorizado):** Evitar difundir rutas sensibles de toda la organización y no modificar exclusiones.

```powershell
Get-MpPreference | Select-Object ExclusionPath,ExclusionProcess,ExclusionExtension
```

**Windows — revisar tareas registradas:** Pista de persistencia; la ausencia de tarea no descarta otras técnicas.

```powershell
Get-ScheduledTask | Select-Object TaskName,TaskPath,State,Actions,Principal
```

### Contención y límites de autoridad

La ausencia de alerta Defender no autoriza cerrar el ticket. Si las primeras evidencias muestran actividad activa sospechosa o datos sensibles en riesgo, pedir aislamiento EDR o restricciones de salida aprobadas mientras se conserva telemetría. No ejecutar ni abrir la muestra fuera de sandbox autorizado, ni usar servicios públicos de análisis de muestras sin aprobación y valoración de datos sensibles. No borrar el EXE como primera acción ni confiar solo en escaneo antivirus: investigar procesos, persistencia, red, identidad y extensión.

### Cuándo escalar a N2 / Incident Response

- Hay ejecución confirmada de binario no autorizado más actividad secundaria sospechosa.
- Se detecta conexión de C2, exfiltración, descarga de componentes, persistencia o cambios de seguridad.
- Los procesos fueron lanzados con permisos elevados, tareas o servicios nuevos y acceso a secretos.
- Varios dispositivos recibieron/ejecutaron el mismo hash o remitente sospechoso.
- Defender deshabilitado, agentes con fallos de salud o políticas modificadas coincidentes con la ejecución.
- El activo tiene acceso a sistemas de alto impacto y faltan registros esenciales para descartar compromiso.

### Falsos positivos que debes evaluar

- Archivo legítimo de proveedor distribuido de forma irregular pero respaldado por ticket y firma válida.
- El usuario ejecutó instalador permitido y la consola no genera detecciones benignas.
- El ejecutable falló al iniciar sin efectos posteriores, pero debe verificarse.
- El fichero fue renombrado: el nombre no corresponde al payload real del correo.
- Telemetría tardía, retención insuficiente o endpoint desconectado de EDR.

### Errores frecuentes que penalizan en entrevista

- Cerrar como falso positivo porque Defender no alertó.
- Volver a ejecutar el EXE para comprobar qué hace.
- Borrar inmediatamente el archivo y perder contexto de hash/metadata.
- Buscar solo el nombre del EXE y no árbol de procesos, hashes o procesos hijos.
- Confundir detección/prevención AV con registro de cada ejecución: las tecnologías y coberturas difieren.
- Subir archivos internos a servicios públicos sin autorización.
- Emparejar procesos únicamente por PID sin DeviceId ni tiempo de creación.

### Perspectiva Red Team y Blue Team

La ejecución de un archivo entregado por ingeniería social puede encajar en T1204.002 (Malicious File) si se acredita acción del usuario y naturaleza maliciosa. Los adversarios pueden lanzar procesos hijos, usar intérpretes legítimos y cambiar nombre/ruta para eludir detección; sin embargo una ausencia de alerta no demuestra evasión efectiva. Para el Blue Team, la secuencia entrega → descarga → ejecución → comportamiento → alcance es el núcleo del caso.

### Respuesta modelo de entrevista

> No cerraría el incidente porque Defender no haya alertado. Confirmaría el mensaje original y la hora de ejecución, guardaría el hash y revisaría MDE DeviceProcessEvents y, si está auditado, Windows 4688 o Sysmon 1. Reconstruiría padre, hijos y ruta, revisaría DeviceFileEvents, red, servicios y tareas programadas; también el estado de protección y exclusiones. Si observo actividad maliciosa o riesgo activo, escalaría para aislamiento autorizado y búsqueda de otros equipos. Guardaría evidencia antes de remediar y verificaría la cobertura del EDR.

### Criterios de evaluación del candidato

- [ ] Comprende que ausencia de alertas no prueba inocuidad.
- [ ] Distingue correo recibido, archivo descargado y ejecución demostrada.
- [ ] Correlaciona procesos, padre/hijo, ficheros, red, identidad y persistencia.
- [ ] Preserva hashes y evidencia sin ejecutar muestra ni filtrarla públicamente.
- [ ] Propone contención autorizada y búsqueda de alcance.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1204.002, T1059, T1105

### Fuentes de documentación

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicefileevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceevents-table
- https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688
- https://attack.mitre.org/techniques/T1204/002/

---

## Notas de implementación para SOC-RESPONSES (web)

- Este JSON conserva `schema_version=1.0.0` y las claves originales de las preguntas para importación conjunta de Tandas 01–03.
- Presentar primero escenario y decisiones; mantener respuesta modelo oculta hasta que el alumno concluya. Revelar evidencias y consultas por fase.
- Guardar cada consulta como texto para resaltado, copia y revisión; no disparar consultas destructivas ni cambios de endpoint automáticamente en la web.
- Los ejemplos dependen de ingestión real. Los event IDs y significados fueron contrastados con documentación oficial; la sintaxis se revisó de forma estática, no contra un SIEM en vivo.
- Cada evaluación separa: hipótesis inicial, adquisición de logs, correlación, causa probable, certeza, decisión y escalado seguro.

**Estado:** Tanda 03 terminada. No incluye N1-16 a N1-20; siguiente lote solo cuando el usuario diga GO.
