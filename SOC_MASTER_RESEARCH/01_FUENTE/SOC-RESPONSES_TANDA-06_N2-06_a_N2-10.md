# SOC-RESPONSES — Tanda 06 | SOC N2: Active Directory y movimiento lateral

**Escenarios:** N2-06 a N2-10 · **Revisión:** 18/10/2026 · **Temas:** Kerberoasting, DCSync, NTLM lateral, Pass-the-Hash, cuentas de servicio y DC.

> **Alcance:** Material educativo para defensa/SOC, validado estructuralmente y revisado frente a documentación oficial de eventos y esquemas. **No** se ha ejecutado contra un entorno Microsoft Sentinel, Microsoft Defender XDR o Splunk real. Antes de producción, ajustar tablas, nombres y tipos de columnas, ingesta de DC, parsers Windows, normalización CIM, fuentes EDR y umbrales. El uso de cualquier control disruptivo requiere autorización, playbook y evaluación de impacto.

## Índice

- [N2-06 — Kerberoasting: ráfaga de eventos 4769 y tickets de servicio](#n2-06)
- [N2-07 — DCSync: solicitudes de replicación y derechos críticos en AD](#n2-07)
- [N2-08 — NTLM desde un equipo hacia múltiples servidores](#n2-08)
- [N2-09 — Pass-the-Hash: investigar la alerta sin falsos positivos](#n2-09)
- [N2-10 — Cuenta de servicio con sesión interactiva sobre DC a las 02:00](#n2-10)

## Fundamentos que hay que dominar antes de responder

1. **4769 = solicitud de ticket de servicio (TGS)** en un DC. Su número y cifrado se evalúan por identidad, SPN y origen. **0x17 (RC4-HMAC) no prueba cracking**.
2. **4662 = operación auditada sobre un objeto de AD**, no «evento DCSync». Sin *Audit Directory Service Access* y SACL no tienes cobertura completa. Un derecho replicador invocado sobre un objeto de dominio es una señal para verificar.
3. **4624 tipo 3 = logon de red**, no RDP. Los tipos 2 (Interactive) y 10 (RemoteInteractive) son relevantes para una cuenta de servicio que nunca debería usarlos; 4 = Batch y 5 = Service.
4. **4776 = validación de credenciales NTLM** en el equipo autoritativo, por ejemplo DC para cuentas de dominio. **No informa del servidor destino final**.
5. **Pass-the-Hash es una técnica, no un valor especial de 4624**. Debes correlacionar alertas de identidad, endpoint, actividad posterior y contexto de credenciales.
6. **LogonId se correlaciona en el mismo host y periodo**. No unirlo entre máquinas ni asumir persistencia sin proceso/artefacto atribuido.
7. **Servicios críticos:** bloquear cuentas, rotar secretos o revocar delegaciones sin coordinación puede dejar inoperativos backups, SQL, ERP o sincronización de identidades.
8. **KQL tiene al menos dos familias aquí:** Sentinel/Log Analytics con `TimeGenerated` y XDR Advanced Hunting con `Timestamp`. WindowsEvent (`EventData` dinámico) y SecurityEvent (`EventData` string) no tienen el mismo esquema.

## Matriz de triaje N2

| ID | Hipótesis principal | Dato que cambia la decisión | Contención orientativa |
|---|---|---|---|
| N2-06 | Kerberoasting | 4769 + múltiples SPN/RC4 + host anómalo + señales EDR | Contener estación y rotar cuentas de servicio coordinadamente |
| N2-07 | DCSync | MDI + 4662 con GUID de replicación + origen no-DC | IR de dominio y restricción de delegaciones/host |
| N2-08 | Lateral NTLM | 4624 tipo 3 en múltiples destinos + ejecución + ausencia PAM | Restringir origen, sesiones y acceso lateral |
| N2-09 | Pass-the-Hash | Alerta MDI + proceso/cadena de credenciales + acceso posterior | IR credenciales y endpoints, no solo reset |
| N2-10 | Uso abusivo de cuenta de servicio | 4624 tipo 2/10 en DC + origen extraño + acciones posteriores | Contener origen y preservar continuidad de backup |

---

<a id="n2-06"></a>
## N2-06 — Kerberoasting: ráfaga de eventos 4769 y tickets de servicio

**Nivel:** SOC N2 · **Bloque:** Active Directory y movimiento lateral

> **Pregunta de entrevista:** Detectas numerosos eventos Kerberos 4769 solicitando tickets para cuentas de servicio. ¿Cómo investigarías un posible Kerberoasting?

### Escenario y objetivo

DC01 de novashop.local envía al SIEM 720 eventos 4769 en ocho minutos. Una cuenta de usuario interactivo (alice.finance) solicita tickets para numerosos SPN, incluidos MSSQLSvc/sql01.novashop.local:1433 y HTTP/intranet.novashop.local. Algunos tickets muestran tipo de cifrado 0x17 y el origen es una estación que normalmente no administra servicios. El equipo de IAM informa de un despliegue de ERP esa noche, por lo que aún no sabes si es actividad esperada. Nombres y volúmenes son didácticos.

**Objetivo operativo:** Discriminar un uso intenso y legítimo de Kerberos de una posible adquisición masiva de TGS para ataque offline; priorizar cuentas con SPN, contraseñas débiles o privilegios elevados y evaluar exposición sin afirmar que hubo descifrado de contraseñas.

### Hipótesis que debes contrastar

- Posible Kerberoasting T1558.003: un principal autenticado solicita muchos TGS para SPN cuya clave protege el ticket; posteriormente podría intentar adivinar la contraseña offline.
- Escenario legítimo: aplicación o administrador ejecuta una prueba de conectividad o despliegue que solicita numerosos servicios en poco tiempo.
- Una ráfaga de autenticaciones delegadas de un proxy o servicio puede generar muchos 4769 desde el mismo cliente sin ser atacante.
- El ticket 0x17 (RC4-HMAC) puede reflejar compatibilidad heredada o configuración criptográfica; no equivale a explotación confirmada.
- Eventos 4769 no garantizan que el adversario haya obtenido texto claro de una contraseña de servicio; esa fase no suele verse directamente en el DC.

### Procedimiento operativo paso a paso

**1 · Verificar alarma y cobertura** — Confirmar que los eventos proceden de DC y pertenecen a auditoría de Kerberos Service Ticket Operations (éxito); comprobar plazo de retención, retraso de ingesta, zona horaria, DC cubiertos, versiones y formato de los campos.

**2 · Extraer sujeto y línea base** — Agrupar 4769 por solicitante, ClientAddress, DC, SPN y TicketEncryptionType. Comparar con el mismo turno durante 7–30 días y con estaciones del mismo rol; no imponer umbral universal.

**3 · Enriquecer SPN y riesgo de cuentas** — Resolver el SPN a identidad propietaria en un DC/estación administrada; recopilar grupos privilegiados, tipo cuenta (gMSA vs usuario), fecha de rotación, AES/RC4 admitido, dependencias y usos aprobados. La cuenta que solicita TGS no es necesariamente la cuenta que ejecuta el servicio.

**4 · Evaluar señales combinadas** — Priorizar fuente nunca vista, muchos SPN únicos, muchas cuentas servicio, ventanas cortas, RC4 atípico, actividad fuera de despliegue, secuencia de reconocimiento LDAP y procesos/PowerShell sospechosos en el origen.

**5 · Examinar 4769 a nivel de campo** — Relacionar AccountName/TargetUserName, ServiceName, ClientAddress, Status y TicketEncryptionType conforme al esquema real. 0x17=RC4, 0x11=AES128, 0x12=AES256; validar que se trate del campo del cifrado del ticket (no clave de sesión).

**6 · Pivotar a endpoint y AD** — Revisar procesos hijos, consultas LDAP/AD, logons 4624, tickets asociados, posible creación de archivos de salida, herramientas sin autorizar, historial de ejecución y alertas de identidad. No ejecutar muestras sospechosas.

**7 · Estimar impacto** — Clasificar cuentas de servicio expuestas: privilegios, acceso a SQL o backups, reutilización de secretos, antigüedad de contraseña y control de logon interactivo. Verificar uso posterior de esas cuentas desde equipos no habituales.

**8 · Contener y erradicar coordinadamente** — Si las evidencias apoyan ataque: aislar estación origen y cortar acceso no autorizado mediante playbook, preservar evidencia y coordinar con propietarios rotación segura de secretos de servicio, revisión de SPN y retirada de RC4 cuando sea compatible.

**9 · Cerrar con criterio** — Confirmar si hubo solicitud masiva anómala, pero documentar explícitamente como desconocido el éxito de un descifrado offline; cerrar como benigno solo tras contrastar despliegue, propietario y trazabilidad.

### Evidencias y cómo interpretarlas

| Fuente / campo | Lectura técnica |
|---|---|
| 4769 en DC: AccountName/TargetUserName, ServiceName, ClientAddress, TicketEncryptionType, Status | Número y diversidad de servicios por origen. Comprobar roles y estado de éxito; muchos tickets ≠ ataque por sí solo. |
| SPN → servicio → cuenta de directorio | Determina exposición real y permisos; no confundir SPN mostrado con identidad de la cuenta que solicitó el ticket. |
| Cifrado de ticket 0x17 frente a 0x11/0x12 | RC4 puede aumentar preocupación por ataque offline según política y entornos heredados; no certifica cracking. |
| LDAP y actividad del endpoint fuente | Inventario de SPN seguido de numerosos 4769 más herramientas desconocidas incrementa confianza. |
| Historial de autenticaciones de cuentas servicio | Uso nuevo de la credencial de servicio después de la ráfaga eleva prioridad; revisar cronología y host. |
| CMDB, cambios autorizados, rotaciones | Permite resolver falsos positivos por despliegue, pruebas o aplicaciones Kerberos de alto volumen. |

### KQL — consultas

#### Sentinel / WindowsEvent · diversidad SPN y RC4 por solicitante

**Entorno y prerequisitos:** Log Analytics con WindowsEvent y eventos 4769 recolectados de TODOS los DC pertinentes. EventData debe incluir claves TargetUserName, ServiceName, IpAddress, TicketEncryptionType, Status (ajustar tras inspeccionar 1 evento).

```kql
WindowsEvent
| where TimeGenerated > ago(24h) and EventID == 4769
| extend User=tostring(EventData.TargetUserName),
         SPN=tostring(EventData.ServiceName),
         Origen=tostring(EventData.IpAddress),
         Enc=toupper(tostring(EventData.TicketEncryptionType)),
         Estado=tostring(EventData.Status)
| where isnotempty(User) and isnotempty(SPN)
| summarize tickets=count(), spn_unicos=dcount(SPN),
            rc4=countif(Enc == "0X17"),
            muestra_spn=make_set(SPN, 15), dcs=make_set(Computer, 10)
  by bin(TimeGenerated, 10m), User, Origen
| where tickets >= 20 or spn_unicos >= 10
| order by spn_unicos desc, tickets desc
```

**Interpretación:** Identifica clientes/usuarios con numerosas solicitudes y diversidad de servicios, destacando RC4 para revisión.

**Limitaciones:** Los umbrales (20/10) son didácticos y requieren baseline. Los campos de EventData y representación de Status/Enc varían; algunos DC generan nuevos campos y otros conectores los normalizan diferente.

#### Sentinel / WindowsEvent · cronología de un origen

**Entorno y prerequisitos:** Misma fuente WindowsEvent; sustituir IP por origen confirmado. Valida que el campo IpAddress represente origen, posiblemente IPv6 ::ffff:IPv4.

```kql
let origen = "10.20.10.25";
WindowsEvent
| where TimeGenerated > ago(12h) and EventID == 4769
| extend Origen=tostring(EventData.IpAddress),
         Usuario=tostring(EventData.TargetUserName),
         Servicio=tostring(EventData.ServiceName),
         Cifrado=tostring(EventData.TicketEncryptionType),
         Estado=tostring(EventData.Status)
| where Origen contains origen
| project TimeGenerated, Computer, Origen, Usuario, Servicio, Cifrado, Estado, EventRecordId
| order by TimeGenerated asc
```

**Interpretación:** Reconstruye orden de los TGS e identifica SPN llamativos o secuencias automatizadas.

**Limitaciones:** No busca por ejecutable; agregar EDR para atribución de proceso. Estado exitoso depende del código real de la versión.

### SPL — consultas

#### Splunk Windows Security 4769 · diversidad y RC4

**Entorno y prerequisitos:** Índice `wineventlog`, sourcetype `XmlWinEventLog:Security` o equivalente. Exige normalizar a los alias `user`, `spn`, `src`, `ticket_etype`, `status`; revisar extracción real del TA de Windows.

```spl
index=wineventlog earliest=-24h (EventCode=4769 OR EventID=4769)
| eval usuario=coalesce(TargetUserName,Account_Name,AccountName),
       spn=coalesce(ServiceName,Service_Name),
       origen=coalesce(IpAddress,Client_Address,ClientAddress),
       cifrado=upper(coalesce(TicketEncryptionType,Ticket_Encryption_Type,""))
| where isnotnull(usuario) AND isnotnull(spn)
| bin _time span=10m
| stats count as tickets dc(spn) as spn_unicos
        count(eval(cifrado="0X17")) as rc4
        values(spn) as spn_ejemplo by _time usuario origen
| where tickets>=20 OR spn_unicos>=10
| sort - spn_unicos - tickets
```

**Interpretación:** Agregación equivalente a KQL para hunting e investigación de ráfagas.

**Limitaciones:** EventCode, EventID y alias son dependientes del TA; count(eval()) calcula solo RC4 reconocido. Para alto volumen limitar values().

#### Splunk Windows Security 4769 · SPN y horas con RC4

**Entorno y prerequisitos:** Mismo índice con eventos 4769 y extracción de tipo de cifrado disponible.

```spl
index=wineventlog earliest=-7d (EventCode=4769 OR EventID=4769)
| eval cuenta=coalesce(TargetUserName,Account_Name,AccountName),
       servicio=coalesce(ServiceName,Service_Name),
       origen=coalesce(IpAddress,Client_Address,ClientAddress),
       enc=upper(coalesce(TicketEncryptionType,Ticket_Encryption_Type,""))
| where enc="0X17" AND isnotnull(servicio)
| timechart span=1h count by origen limit=12 useother=t
```

**Interpretación:** Busca periodos e IP de origen con tickets RC4, contextualizados contra la línea base.

**Limitaciones:** Tener RC4 no significa compromiso; timechart oculta detalle SPN. Enriquecer con CMDB y correlacionar origen.

### Comandos prácticos de observación (no destructivos)

**Windows PowerShell — solo lectura / AD:** Consultar SPN, tipo de cuenta y flags criptográficos sobre una cuenta identificada; requiere RSAT y permisos de consulta.

```powershell
Get-ADUser -Identity 'svc-sql' -Properties ServicePrincipalName,PasswordLastSet,MemberOf,msDS-SupportedEncryptionTypes |
  Select-Object SamAccountName,ServicePrincipalName,PasswordLastSet,msDS-SupportedEncryptionTypes,MemberOf
```

**Windows PowerShell — solo lectura / DC:** Extraer los últimos 4769 del DC afectado sin modificar auditoría.

```powershell
Get-WinEvent -ComputerName DC01 -FilterHashtable @{LogName='Security'; Id=4769; StartTime=(Get-Date).AddHours(-2)} -MaxEvents 30 |
  Select-Object TimeCreated,MachineName,Id,Message
```

**Windows CMD — solo lectura:** Comprobar tickets almacenados en la sesión actual autorizada; no extrae claves.

```powershell
klist tickets
```

### Contención: decisión, alcance y límites de autoridad

Priorizar preservar registros de DC y telemetría del host, bloquear ejecución/actividad maliciosa en origen y restringir su acceso si existe confianza suficiente. No eliminar el SPN ni cambiar la contraseña de una cuenta SQL crítica sin conocer dependencias: puede provocar indisponibilidad. Coordinar rotación a credenciales largas o gMSA, restringir privilegios y retirar RC4 por política tras evaluar compatibilidad. No confundir el usuario solicitante con servicio atacado.

### Criterios de escalado

- Origen usuario/host anómalo con numerosos SPN y RC4 fuera de línea base.
- Cuentas de servicio privilegiadas con contraseñas antiguas o de alto impacto.
- Evidencia EDR de enumeración SPN + herramientas no autorizadas y uso posterior de servicio.
- Cambios de privilegio, persistencia o conexiones laterales después del TGS.
- Ausencia de cobertura de DC impide determinar alcance.

### Falsos positivos y contexto legítimo

- Despliegue de ERP o migración autenticada contra múltiples servicios.
- Aplicación con Kerberos constrained delegation o proxy que solicita muchos TGS.
- Escáner de inventario/monitorización aprobado y documentado.
- SPN mal configurados o cliente heredado sin AES.
- Tráfico replicado de varias herramientas de colección que duplica eventos.

### Errores que penalizan en una entrevista SOC N2

- Decir que cada evento 4769 implica Kerberoasting.
- Interpretar 0x17 como prueba de contraseña descifrada.
- Confundir TGS 4769 con TGT 4768 o pedir únicamente logs de estaciones.
- Aplicar bloqueo global de RC4 o reset masivo sin analizar dependencias.
- No comprobar diversidad de SPN ni comportamiento del solicitante frente a baseline.
- Tratar éxito de login con cuenta de servicio como hecho derivado de 4769.

### Perspectiva Red Team / Blue Team

Kerberoasting abusa de una funcionalidad normal de Kerberos: solicitudes TGS para SPN. La fase de cracking posterior puede producirse fuera de los sistemas monitorizados; por eso el DC aporta intención posible, no prueba del resultado. Una defensa madura combina identidades con credenciales resistentes, tipo de cifrado, SPN y monitoreo de cambios de comportamiento sin bloquear ticketing legítimo.

### Respuesta modelo de entrevista

> Validaría en los DC el evento 4769 y agruparía por usuario, IP origen, número de SPN distintos, intervalo y cifrado del ticket. Compararía con línea base y despliegues autorizados, y resolvería SPN a cuentas de servicio y sus privilegios. Un ticket RC4 o muchos 4769 solos no confirman Kerberoasting. Correlacionaría los endpoints, LDAP, autenticaciones posteriores y EDR; si hay indicios sólidos, escalaría, contendría la estación, preservaría pruebas y planificaría rotación segura de credenciales con los dueños del servicio.

### Lista de autoevaluación

- [ ] Distingue TGS de TGT y 4769 de 4768.
- [ ] Sabe interpretar 0x17, 0x11, 0x12 sin sobreatribuir.
- [ ] Agrupa por origen, sujeto, diversidad SPN y baseline.
- [ ] Investiga riesgo y propietario real de la cuenta de servicio.
- [ ] Busca actividad posterior y evidencia de endpoint.
- [ ] Coordina credenciales y disponibilidad antes de rotar.

**MITRE ATT&CK (hipótesis salvo evidencia):** T1558.003 — Kerberoasting (hipótesis), T1087.002 — Domain Account Discovery (si evidencia LDAP/AD), T1078 — Valid Accounts (si uso posterior acreditado)

### Fuentes verificables

- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/windowsevent
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://attack.mitre.org/techniques/T1558/003/
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-07"></a>
## N2-07 — DCSync: solicitudes de replicación y derechos críticos en AD

**Nivel:** SOC N2 · **Bloque:** Active Directory y movimiento lateral

> **Pregunta de entrevista:** Un controlador de dominio registra un incremento inesperado de solicitudes de replicación. ¿Cómo investigarías un posible DCSync?

### Escenario y objetivo

Durante una ventana de 15 minutos, DC01 muestra acciones de replicación originadas aparentemente desde APP01 (10.20.15.40), un equipo que no es controlador de dominio. Sentinel registra eventos 4662 de acceso a objetos de directorio para un usuario de servicio `svc-backup` y Defender for Identity genera una alerta de posible DCSync. El propietario indica que una herramienta de backup de AD pudo haber sido actualizada recientemente.

**Objetivo operativo:** Determinar si se produjo una operación de replicación legítima o no autorizada, quién la originó, si la identidad tenía permisos de replicar secretos y cuál es el radio de impacto, sin equiparar cualquier evento 4662 o tráfico RPC con una extracción de hashes confirmada.

### Hipótesis que debes contrastar

- DCSync T1003.006: cuenta no-DC con privilegios de replicación invoca operaciones DRSUAPI para recuperar información sensible del dominio.
- Herramienta autorizada de backup/identidad/sincronización con permisos de replicación y nuevo host origen.
- Cambios legítimos de topología de replicación entre DC después de mantenimiento.
- Evento 4662 de lectura/operación AD sin GUID de replicación: no indica por sí solo DCSync.
- Alerta de sensor MDI con contexto incompleto, latencia de ingesta o IP atribuido a un proxy/NAT/host compartido.

### Procedimiento operativo paso a paso

**1 · Priorizar como posible compromiso de dominio** — Registrar alerta MDI/Defender, DC, identidad, equipo/IP no DC y hora UTC; activar IR e IAM. No esperar al final de un turno porque la posible obtención de credenciales afecta a todo el dominio.

**2 · Validar que hay detección y cobertura** — Comprobar estado de sensores MDI, auditoría Directory Service Access, SACL del objeto de dominio y procedencia de 4662. Sin SACL apropiada no ver 4662 no descarta actividad.

**3 · Analizar las operaciones 4662** — Inspeccionar SubjectUserName, SubjectLogonId, ObjectServer=DS, AccessMask (0x100=Control Access), Properties y GUID de replication extended rights, además de DC. La presencia de esos campos señala derechos invocados, no volumen ni lista de secretos recuperados.

**4 · Identificar derechos exactos** — Buscar DS-Replication-Get-Changes (1131f6aa-9c07-11d1-f79f-00c04fc2dcd2), DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2) y DS-Replication-Get-Changes-In-Filtered-Set (89e95b76-444d-4c62-991a-0facbeda640c). Distinguir derechos de replicación de permisos equivalentes concedidos por membresía/ACL.

**5 · Correlacionar red e identidad** — Resolver origen no-DC a host real, propietario, segmento y procesos. Revisar 4624 en DC y 4776/Kerberos donde aplique, SubjectLogonId por el MISMO DC, y telemetría RPC DRSUAPI de sensores. Puerto 135 solo no prueba DCSync.

**6 · Corroborar y explicar cambios** — Consultar calendario de backup AD, MIM, Entra Connect y replicación autorizada, ticket de cambio, cuentas delegadas y configuración de la herramienta. Establecer si APP01 debería poseer esos derechos.

**7 · Acotar exposición** — Revisar qué cuentas privilegiadas pueden haber estado expuestas, si existió lectura anómala del dominio o uso de credenciales tras el evento; tratar el detalle real de secretos obtenidos como indeterminado hasta disponer de datos suficientes.

**8 · Contención de alta criticidad** — Si hay evidencias suficientes, contener host origen, limitar capacidades de la identidad y revisar/revocar delegaciones de replicación con un plan de continuidad y responsables AD/IR. Evitar reiniciar DC o ejecutar cambios masivos sin estrategia.

**9 · Recuperación y lecciones** — Planificar rotación por fases de secretos potencialmente expuestos y cuentas críticas. Una operación sobre krbtgt requiere procedimiento coordinado de recuperación de dominio, no un doble cambio apresurado por defecto.

### Evidencias y cómo interpretarlas

| Fuente / campo | Lectura técnica |
|---|---|
| Alerta MDI DCSync + origen/usuario/objeto | Detección de DRS; requiere confirmar entidad y actividad, no solo severidad. |
| 4662 de DC: Properties y AccessMask=0x100 | Derechos extendidos de replicación; depende de SACL y auditoría. |
| SubjectLogonId + 4624 EN EL MISMO DC | Ayuda a enlazar el contexto de inicio de sesión; no reutilizar LogonId entre dispositivos. |
| GUID de derechos DS-Replication-Get-Changes y -All | Especial atención al acceso a secretos/replicación de dominio; correlacionar ACL efectiva. |
| Proceso/red del host origen y DRSUAPI | Conecta host y proceso; RPC genérico por sí solo no demuestra replicación maliciosa. |
| ACL del dominio y CMDB/ticket de cambio | Distingue backup/sincronización legítimos de delegaciones recién concedidas. |

### KQL — consultas

#### Sentinel / SecurityEvent · 4662 con derechos de replicación

**Entorno y prerequisitos:** Ingerir SecurityEvent 4662 con Audit Directory Service Access, SACL apropiada y columnas Properties, AccessMask, SubjectUserName pobladas. Reemplazar inventario de DC: exclusión aquí solo revisa, no confirma.

```kql
SecurityEvent
| where TimeGenerated > ago(24h) and EventID == 4662
| extend props=tolower(tostring(Properties)), mask=tolower(tostring(AccessMask))
| where mask == "0x100" and (
    props contains "1131f6aa-9c07-11d1-f79f-00c04fc2dcd2" or
    props contains "1131f6ad-9c07-11d1-f79f-00c04fc2dcd2" or
    props contains "89e95b76-444d-4c62-991a-0facbeda640c")
| summarize operaciones=count(), primera=min(TimeGenerated), ultima=max(TimeGenerated),
            derechos=make_set(props, 12), sesiones=make_set(SubjectLogonId, 20)
  by Computer, SubjectUserName, SubjectUserSid
| order by operaciones desc
```

**Interpretación:** Prioriza identidades que invocaron derechos de replicación en el objeto AD auditado.

**Limitaciones:** Si `Properties` no contiene GUID en texto o AccessMask tiene representación distinta, habrá falsos negativos. Se usa contains sobre cada GUID para evitar depender de tokenización en búsquedas de GUID. La cuenta DC o de sincronización puede estar autorizada.

#### Sentinel / SecurityEvent · sesiones vinculadas a 4662 por DC y LogonId

**Entorno y prerequisitos:** Mismas SecurityEvent 4662 y 4624. Join por Computer + LogonId en la misma máquina, no por ID global. Ajustar según columnas de 4624 (TargetLogonId/LogonID) en tu conector.

```kql
let operaciones = SecurityEvent
| where TimeGenerated > ago(6h) and EventID == 4662
| where tolower(tostring(AccessMask)) == "0x100"
| project op_hora=TimeGenerated, DC=Computer, sesion=tostring(SubjectLogonId),
          actor=SubjectUserName, propiedades=Properties;
let sesiones = SecurityEvent
| where TimeGenerated > ago(8h) and EventID == 4624
| project login_hora=TimeGenerated, DC=Computer, sesion=tostring(TargetLogonId),
          origen=IpAddress, logon_tipo=LogonType, auth=AuthenticationPackageName;
operaciones
| join kind=leftouter sesiones on DC, sesion
| where isnull(login_hora) or login_hora <= op_hora
| project op_hora, DC, actor, propiedades, origen, logon_tipo, auth, login_hora
| order by op_hora desc
```

**Interpretación:** Puede revelar desde qué origen y sesión se ejecutaron las operaciones de replicación; investigar relaciones inciertas.

**Limitaciones:** TargetLogonId debe estar presente; si el esquema usa otra columna, corregir previamente. LogonId puede reutilizarse tras reinicio; correlación requiere cercanía temporal y unirse por DC.

### SPL — consultas

#### Splunk Security 4662 · accesos con GUID de replicación

**Entorno y prerequisitos:** Eventos XML de DC con campos Properties, AccessMask y SubjectUserName extraídos; índice/sourcetype adaptables.

```spl
index=wineventlog earliest=-24h (EventCode=4662 OR EventID=4662)
| eval p=lower(coalesce(Properties,"")), mask=lower(coalesce(AccessMask,"")),
       sujeto=coalesce(SubjectUserName,Account_Name,AccountName)
| where mask="0x100" AND (
       like(p,"%1131f6aa-9c07-11d1-f79f-00c04fc2dcd2%") OR
       like(p,"%1131f6ad-9c07-11d1-f79f-00c04fc2dcd2%") OR
       like(p,"%89e95b76-444d-4c62-991a-0facbeda640c%"))
| stats count as operaciones min(_time) as primera max(_time) as ultima
        values(p) as derechos by host sujeto
| convert ctime(primera) ctime(ultima)
| sort - operaciones
```

**Interpretación:** Identifica operaciones 4662 con derechos críticos observadas en los DC.

**Limitaciones:** Requiere SACL y extracciones XML; `like` puede ser costoso, limitar ventanas e índice. El evento indica operación de acceso auditada, no extracción de un hash concreto.

#### Splunk Windows Security · logons 4624 sobre controlador de dominio

**Entorno y prerequisitos:** Eventos 4624 de hosts DC con campos TargetLogonId, IpAddress y LogonType. Ajustar DCs por inventario y alias.

```spl
index=wineventlog earliest=-4h (EventCode=4624 OR EventID=4624)
(host=DC01 OR host=DC02)
| eval identidad=coalesce(TargetUserName,Account_Name,AccountName),
       origen=coalesce(IpAddress,Source_Network_Address,src_ip),
       sesion=coalesce(TargetLogonId,Logon_ID)
| stats count min(_time) as primera max(_time) as ultima
        values(LogonType) as tipos values(AuthenticationPackageName) as auth
        by host identidad origen sesion
| convert ctime(primera) ctime(ultima)
| sort - ultima
```

**Interpretación:** Coteja identidad y origen con sesiones 4662. Útil para rastrear host que no debería replicar.

**Limitaciones:** Los logons 4624 por sí solos no prueban DCSync; no aplicar join solo por hora o LogonId cruzando hosts.

### Comandos prácticos de observación (no destructivos)

**Windows PowerShell — solo lectura / AD:** Verificar si un equipo es controlador de dominio en inventario real.

```powershell
Get-ADDomainController -Filter * | Select-Object HostName,IPv4Address,Site,IsGlobalCatalog
```

**Windows PowerShell — solo lectura / DC:** Inspeccionar mensajes originales 4662 sin editar SACL ni reglas.

```powershell
Get-WinEvent -ComputerName DC01 -FilterHashtable @{LogName='Security';Id=4662;StartTime=(Get-Date).AddHours(-4)} -MaxEvents 25 |
  Select-Object TimeCreated,Id,MachineName,Message
```

**Windows CMD — solo lectura:** Consultar estado resumido de replicación legítima entre DC.

```powershell
repadmin /replsummary
```

**Windows PowerShell — solo lectura / AD:** Examinar ACL del objeto raíz del dominio (requiere permisos de lectura), bajo procedimiento.

```powershell
$dn = (Get-ADDomain).DistinguishedName
(Get-Acl -Path "AD:\$dn").Access |
  Where-Object { $_.ActiveDirectoryRights -match 'ExtendedRight' } |
  Select-Object IdentityReference,ActiveDirectoryRights,ObjectType,AccessControlType
```

### Contención: decisión, alcance y límites de autoridad

El potencial impacto afecta credenciales de todo el dominio. Requiere equipo IR y administradores de AD. Si se confirma uso anómalo, contener host no-DC y credenciales implicadas con autorización; evaluar derechos de replicación indebidamente delegados y restaurar mínimo privilegio. La rotación de secretos privilegiados y de krbtgt es una operación planificada: no ejecutar reset de krbtgt, borrar cuentas sincronizadoras o reiniciar DC de manera refleja.

### Criterios de escalado

- Alerta DCSync con origen no DC sin razón de negocio.
- 4662 + derechos de replicación y cuenta fuera de listado autorizado.
- Privilegios recién delegados o múltiples DC afectados.
- Uso posterior no esperado de cuentas privilegiadas o de servicios.
- Ausencia de auditoría/SACL hace imposible excluir DCSync; solicitar telemetría de red/MDI.

### Falsos positivos y contexto legítimo

- Entra Connect, herramienta de sincronización de directorios o backup de AD autorizado.
- Replicación entre DC normales tras un cambio de topología.
- Prueba de continuidad o migración IAM documentada.
- Servicios que necesitan derechos de replicación pero ejecutan desde IP nueva.
- Registros 4662 generales sin derechos de replicación en Properties.

### Errores que penalizan en una entrevista SOC N2

- Decir que cualquier 4662 es un DCSync.
- Concluir ausencia de DCSync porque no hay 4662 sin comprobar SACL.
- Suponer que 135/TCP o RPC genérico prueba replicación maliciosa.
- Olvidar que los derechos de replicación pueden delegarse a cuentas no admin.
- Correlacionar SubjectLogonId con un login de otro ordenador.
- Ejecutar un reset de krbtgt sin equipo, secuencia ni validación.

### Perspectiva Red Team / Blue Team

DCSync usa interfaces de replicación que los DC necesitan para operar; el diferenciador no es una herramienta concreta sino la identidad, los derechos de replicación y la procedencia de la solicitud. Un adversario con derechos delegados no tiene que iniciar sesión interactiva en un DC. La defensa se centra en sensores de identidad, monitoreo de ACL, SACL de dominio y restricción de permisos.

### Respuesta modelo de entrevista

> Trataría una posible replicación no autorizada como incidente de alto impacto. Confirmaría el contexto de la alerta MDI y buscaría 4662 con AccessMask 0x100 y GUID de derechos de replicación, sabiendo que exige SACL y auditoría. Identificaría cuenta, sesión, DC y host origen, contrastando si es un DC o herramienta autorizada de backup/sync. Si hay evidencia de abuso, escalaría a IR e IAM para contener el origen y retirar delegaciones indebidas, preservando evidencia y planificando rotación de secretos. No asumiría que cada 4662 contiene hashes robados.

### Lista de autoevaluación

- [ ] Reconoce T1003.006 y daño potencial de replicar secretos.
- [ ] Conoce 4662, SACL y AccessMask 0x100.
- [ ] Identifica GUID de DS-Replication-Get-Changes/-All/-In-Filtered-Set.
- [ ] Correlaciona host e identidad con alerta MDI y acceso AD.
- [ ] No confunde RPC legítimo con DCSync probado.
- [ ] Coordina AD/IR y cambios de credenciales de alto riesgo.

**MITRE ATT&CK (hipótesis salvo evidencia):** T1003.006 — DCSync (sospecha), T1098 — Account Manipulation (si delegación maliciosa), T1078.002 — Domain Accounts (si se acredita uso)

### Fuentes verificables

- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4662
- https://learn.microsoft.com/windows/security/threat-protection/auditing/event-4624
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://learn.microsoft.com/en-us/defender-for-identity/alerts-xdr
- https://attack.mitre.org/techniques/T1003/006/
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-08"></a>
## N2-08 — NTLM desde un equipo hacia múltiples servidores

**Nivel:** SOC N2 · **Bloque:** Active Directory y movimiento lateral

> **Pregunta de entrevista:** Observas autenticaciones NTLM desde un equipo de usuario hacia múltiples servidores en pocos segundos. ¿Cómo distinguirías actividad administrativa legítima de movimiento lateral?

### Escenario y objetivo

En 90 segundos la estación WS-23 abre sesiones NTLM contra FS01, APP02, WEB01 y SQL01. Las credenciales pertenecen a it.admin, pero el inventario indica que WS-23 es un portátil comercial, no un jump host autorizado. Hay 4624 de tipo 3 en los destinos, 4776 en DC01 y un servicio recién registrado en APP02. El área de parches ejecutaba una campaña de despliegue ese mismo día.

**Objetivo operativo:** Reconstruir qué identidad inició qué autenticaciones, hacia qué hosts, si obtuvo acceso útil o ejecutó procesos remotos, y si el patrón encaja con una operación autorizada o con expansión lateral de un adversario. Priorizar contención según impacto y confianza.

### Hipótesis que debes contrastar

- Movimiento lateral mediante credenciales válidas a SMB/RPC, servicios remotos, tareas o herramientas de administración no autorizadas.
- Despliegue corporativo, escaneo con credenciales, inventario o backup ejecutado con cuenta privilegiada aprobada.
- NTLM fallback por SPN/DNS/time sync u otra incidencia de Kerberos, sin intención maliciosa.
- Un 4776 en DC refleja validación NTLM para cuenta de dominio, pero NO documenta por sí solo el servidor destino; es necesario correlacionar 4624 del destino.
- Una ráfaga 4624 LogonType=3 desde un mismo origen no implica ejecución remota: puede tratarse de acceso a recursos compartidos o autenticación sin acciones posteriores.

### Procedimiento operativo paso a paso

**1 · Alcance en segundos** — Poner en una línea temporal los servidores afectados y el usuario; confirmar ventanas UTC, NAT, terminal real y CMDB. Si hay admin fuera de salto autorizado, elevar prioridad y avisar a N2/IR.

**2 · Correlación correcta de los eventos** — Buscar 4624 en CADA servidor destino: LogonType=3, AuthenticationPackageName=NTLM, IpAddress, TargetUserName, WorkstationName, LogonId, privilegios. Buscar 4776 en DC para estado NTLM del dominio; no inferir destino desde 4776.

**3 · Verificar éxito frente a intento** — Contabilizar éxitos 4624, fallos 4625/4776 y uso de recursos. Identificar hosts efectivamente accesibles, no equiparar una contraseña validada con código ejecutado.

**4 · Reconstruir host origen** — Consultar en WS-23 EDR, usuario activo, proceso iniciador, proceso padre, hash y firma, herramientas de inventario, comandos de red, tareas y accesos administrados. Verificar si se abrió sesión legítima en el portátil.

**5 · Evaluar acciones posteriores** — En hosts destino relacionar LogonId con 4672 (privilegios especiales), eventos 4688 con auditoría de proceso, 7045/4697 creación de servicio, 4698 tarea, 5140/5145 compartidos, telemetría EDR de procesos y archivos. Correlación temporal, host y cuenta; ninguna pieza sola es definitiva.

**6 · Confrontar con administración real** — Cruzar inventario de jump hosts, PAM, tickets de cambios, ventanas SCCM/Intune, agentes autorizados, códigos de ejecutables, firmas y responsable. No aceptar una explicación oral como única evidencia.

**7 · Decidir contención proporcional** — Si hay ejecución remota no autorizada o cuentas privilegiadas desde WS-23: preservar evidencia, aislar origen si está autorizado, restringir credenciales y accesos laterales, comprobar otros hosts alcanzados; evitar matar servicios de despliegue legítimo sin coordinación.

**8 · Determinar causa raíz** — Investigar cómo se obtuvo la cuenta, si había secretos expuestos, uso indebido de NTLM y malas segmentaciones; planificar endurecimiento: jump hosts, control de logon, reducción NTLM, mínimo privilegio y alertas basadas en baseline.

### Evidencias y cómo interpretarlas

| Fuente / campo | Lectura técnica |
|---|---|
| 4624 LogonType=3 en destino | Demuestra sesión de red autenticada si es éxito; AuthenticationPackageName y SourceNetworkAddress permiten atribuir protocolo/origen cuando están disponibles. |
| 4776 en DC | Valida credenciales NTLM de cuentas de dominio; campo workstation informa origen reportado, no el recurso final al que se accedió. |
| 4625/4776 fallidos | Muestran intentos y fallos; tasas anómalas refuerzan credenciales adivinadas o automatización. |
| 4672 + LogonId, 4688, 7045, 4698 | Elevación de contexto, ejecución y mecanismos persistentes/remotos; exigir correlación temporal y relación fuerte con la sesión. |
| 5140/5145 SMB + EDR network/process | Pistas de copias a ADMIN$/IPC$ o ejecución; acceso SMB puede ser legítimo. |
| Ticket de cambios, CMDB, jump hosts y PAM | Valida o contradice administración esperada, identidad asignada y ventana aprobada. |

### KQL — consultas

#### Sentinel / SecurityEvent · NTLM tipo 3 y destinos múltiples

**Entorno y prerequisitos:** Ingesta SecurityEvent de SERVIDORES destino. Schema usa LogonType:int, AuthenticationPackageName:string, IpAddress y TargetUserName. Normalizar FQDN y cuentas.

```kql
SecurityEvent
| where TimeGenerated > ago(6h) and EventID == 4624
| where LogonType == 3 and AuthenticationPackageName =~ "NTLM"
| extend origen=IpAddress, usuario=TargetUserName, destino=Computer
| where isnotempty(origen) and origen !in ("-", "127.0.0.1", "::1")
| summarize logons=count(), servidores=dcount(destino),
            destinos=make_set(destino, 30),
            primera=min(TimeGenerated), ultima=max(TimeGenerated)
  by bin(TimeGenerated, 5m), origen, usuario
| where servidores >= 3
| order by servidores desc, logons desc
```

**Interpretación:** Señala cuentas y orígenes que acceden a muchos servidores en pocos minutos; útil para hunting de expansión lateral.

**Limitaciones:** 3 servidores/5 minutos es umbral didáctico. 4624 es éxito, no ejecución. IpAddress puede estar vacío, NAT u oculto; comparar con proceso/logon origen.

#### Defender XDR · accesos NTLM observados en endpoints de destino

**Entorno y prerequisitos:** Advanced Hunting DeviceLogonEvents con MDE en los servidores. No usar LogonType numérico de SecurityEvent: aquí se expresa con etiquetas como Network.

```kql
DeviceLogonEvents
| where Timestamp > ago(6h)
| where LogonType =~ "Network" and Protocol contains "NTLM"
| summarize accesos=count(), servidores=dcount(DeviceName),
            destinos=make_set(DeviceName, 30),
            primera=min(Timestamp), ultima=max(Timestamp)
  by bin(Timestamp, 5m), RemoteIP, AccountDomain, AccountName
| where servidores >= 3
| order by servidores desc, accesos desc
```

**Interpretación:** Visualiza propagación por IP origen y cuenta según telemetría MDE.

**Limitaciones:** Los valores de Protocol/ActionType dependen del producto y pueden variar; verificar en portal. La presencia de evento MDE no asegura éxito: comprobar ActionType del dato devuelto.

### SPL — consultas

#### Splunk CIM Authentication · fan-out de identidades

**Entorno y prerequisitos:** El modelo Authentication.Authentication debe estar poblado con src, dest, user, action y authentication_method o método equivalente. Ajustar el filtro NTLM al mapeo de tu TA.

```spl
| tstats count from datamodel=Authentication.Authentication
  where earliest=-6h latest=now Authentication.action="success"
  by _time span=5m Authentication.src Authentication.user Authentication.dest
| rename Authentication.* as *
| stats sum(count) as autenticaciones dc(dest) as servidores
        values(dest) as destinos by _time src user
| where servidores>=3
| sort - servidores - autenticaciones
```

**Interpretación:** Detecta fan-out de autenticaciones exitosas, aunque por defecto no restringe NTLM.

**Limitaciones:** CIM Authentication puede no llevar campo fiable de protocolo. Para afirmar NTLM, filtrar eventos Windows brutos con AuthenticationPackageName. El data model puede incluir autenticaciones no Windows.

#### Splunk Windows Security 4624 · origen, destinos y NTLM

**Entorno y prerequisitos:** Índice con 4624 de los hosts destino; extracciones IpAddress, LogonType, AuthenticationPackageName.

```spl
index=wineventlog earliest=-6h (EventCode=4624 OR EventID=4624)
| eval tipo=coalesce(LogonType,Logon_Type),
       metodo=coalesce(AuthenticationPackageName,Authentication_Package),
       origen=coalesce(IpAddress,Source_Network_Address,src_ip),
       cuenta=coalesce(TargetUserName,Account_Name,AccountName)
| where tostring(tipo)="3" AND upper(metodo)="NTLM" AND isnotnull(origen)
| bin _time span=5m
| stats count as logons dc(host) as servidores values(host) as destinos by _time origen cuenta
| where servidores>=3
| sort - servidores - logons
```

**Interpretación:** Relaciona cliente NTLM y amplitud de destino usando logs crudos.

**Limitaciones:** EventCode y nombres de campos dependen de la ingesta; si hay etiquetas FQDN y NetBIOS mixtas, normalizar para el dc(host).

### Comandos prácticos de observación (no destructivos)

**Windows PowerShell — solo lectura / servidor destino:** Inspeccionar 4624 del servidor concreto y los campos originales.

```powershell
Get-WinEvent -ComputerName APP02 -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddHours(-3)} -MaxEvents 100 |
  Select-Object TimeCreated,Message
```

**Windows PowerShell — solo lectura / DC:** Revisar 4776 y validar la cuenta y workstation reportada.

```powershell
Get-WinEvent -ComputerName DC01 -FilterHashtable @{LogName='Security';Id=4776;StartTime=(Get-Date).AddHours(-3)} -MaxEvents 70 |
  Select-Object TimeCreated,Message
```

**Windows PowerShell — solo lectura / servidor:** Verificar creación de servicios por Event ID 7045 en System (si está disponible).

```powershell
Get-WinEvent -ComputerName APP02 -FilterHashtable @{LogName='System';Id=7045;StartTime=(Get-Date).AddHours(-3)} |
  Select-Object TimeCreated,Message
```

### Contención: decisión, alcance y límites de autoridad

No bloquear toda autenticación NTLM por impulso en un dominio con sistemas heredados. Si los indicios incluyen múltiples destinos y ejecución o abuso privilegiado, activar contención del endpoint fuente, salvaguardar evidencia y coordinar limitación de la cuenta, sesiones y hosts comprometidos. Mantener canal de administración fuera de banda y coordinar corte con operación de negocio. El inventario de sistemas y la política NTLM condicionan acciones duraderas.

### Criterios de escalado

- Privilegiado se autentica en varios servidores desde origen no inventariado.
- Existen servicios nuevos, tareas remotas o cambios de grupo posteriores a 4624.
- PAM/jump host no coincide con el origen registrado.
- Hay alertas de credenciales comprometidas o acciones en DC.
- Ráfaga continúa o afecta activos críticos sin dueño claro.

### Falsos positivos y contexto legítimo

- Sistema de despliegue de parches o software autorizado.
- Monitorización e inventario con cuenta de servicio.
- Backup/antivirus que accede a compartidos de muchos hosts.
- NTLM fallback porque Kerberos no está disponible o SPN erróneo.
- IP NAT, proxy o gateway común que concentra accesos de varias estaciones.

### Errores que penalizan en una entrevista SOC N2

- Inferir servidor de destino directamente desde 4776 del DC.
- Equiparar 4624 tipo 3 con RDP; RDP suele registrar tipo 10.
- Considerar NTLM inherentemente malicioso en redes con legado.
- No investigar ejecutables/servicios/tareas posteriores a la autenticación.
- Omitir verificación de ticket PAM o inventario de jump hosts.
- Correlacionar por minutos sin conservar user, host y LogonId adecuados.

### Perspectiva Red Team / Blue Team

Un operador ofensivo puede reutilizar credenciales válidas para acceder a recursos distribuidos; autenticarse y ejecutar comandos son fases distintas. La huella permite correlacionar 4624/4776 con recursos SMB y servicios creados. La defensa minimiza credenciales reutilizables, limita conexiones laterales y usa jump hosts y baseline de cuentas.

### Respuesta modelo de entrevista

> Agruparía los 4624 exitosos tipo 3 con NTLM por origen, usuario, destinos y ventana, y contrastaría 4776 en DC sabiendo que no revela el servidor destino. Haría pivote al equipo fuente y a los servidores para determinar si solo hubo acceso a recursos o ejecución remota mediante procesos, servicios, tareas y SMB. Compararía contra jump hosts, PAM y cambios. Si una cuenta privilegiada llega a servidores críticos desde una estación comercial y deja indicios de ejecución no autorizada, escalaría, contendría el origen y revisaría credenciales con IR.

### Lista de autoevaluación

- [ ] Diferencia 4624 logon type 3 de 10 y 4776.
- [ ] No confunde autenticación NTLM con ejecución remota.
- [ ] Comprueba fan-out por origen y host destino.
- [ ] Une telemetría del origen con servicios/procesos/SMB en destino.
- [ ] Conoce valor de PAM, jump hosts y baseline.
- [ ] Contiene proporcionalmente sin indisponibilizar todo NTLM.

**MITRE ATT&CK (hipótesis salvo evidencia):** T1021.002 — SMB/Windows Admin Shares (si se acredita), T1078.002 — Valid Domain Accounts (si se acredita), T1550.002 — Pass the Hash (solo si evidencias adicionales)

### Fuentes verificables

- https://learn.microsoft.com/windows/security/threat-protection/auditing/event-4624
- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4776
- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4648
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicelogonevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-09"></a>
## N2-09 — Pass-the-Hash: investigar la alerta sin falsos positivos

**Nivel:** SOC N2 · **Bloque:** Active Directory y movimiento lateral

> **Pregunta de entrevista:** Defender for Identity alerta de una posible técnica Pass-the-Hash. ¿Qué evidencias correlacionarías para confirmar o descartar el ataque?

### Escenario y objetivo

Microsoft Defender for Identity eleva una alerta de sospecha Pass-the-Hash, asociada al usuario novashop\it.admin, origen WS-23 y servidor FS01. MDE detecta autenticación tipo Network por NTLM en FS01 a las 11:07. Un analista N1 interpreta el evento como robo de hash demostrado. Sin embargo, el propietario de IT informa de una tarea programada de mantenimiento que también usa NTLM.

**Objetivo operativo:** Investigar abuso de material de autenticación NTLM sin afirmar que un evento estándar pruebe por sí solo la extracción o inyección de hash. Separar detección de anomalía, evidencia de uso de credenciales y atribución de origen y alcance.

### Hipótesis que debes contrastar

- Pass-the-Hash T1550.002: acceso a otros equipos autenticándose con material NTLM sin necesidad de conocer contraseña de texto claro.
- Inicio de sesión NTLM legítimo de herramienta corporativa o servicio con credenciales proporcionadas por un usuario o almacén aprobado.
- Cuenta administradora ha sido comprometida mediante contraseña en texto claro, robo de sesión o credenciales delegadas, pero no necesariamente mediante un hash.
- La alerta de identidad posee algoritmos/correlaciones adicionales no representados en un solo Event ID: se debe preservar detalle de evidencia del producto.
- El origen visible podría ser un salto administrativo, proxy o NAT y no la estación donde comenzó el compromiso.

### Procedimiento operativo paso a paso

**1 · Preservar el contexto de la detección** — Abrir incidente XDR/MDI, registrar alert ID, entidad usuario, host origen y destino, timestamps UTC, Confidence/Severity cuando existan, evidencias relacionadas y técnica MITRE. No etiquetar confirmado solo por el título.

**2 · Validar acceso real al destino** — En FS01 correlacionar 4624 LogonType 3 + NTLM (autenticación) con 4672 si privilegios, 5140/5145 SMB, 7045/4697, 4698 y telemetría de procesos. 4776 en DC puede mostrar validación del dominio, no prueba directa del hash utilizado.

**3 · Analizar estación origen** — Revisar EDR de WS-23: procesos, cuentas, acceso a LSASS, alertas de credential dumping, modificaciones de seguridad, conexiones SMB/RPC, inicio de sesión activo y uso de herramientas administrativas. Solo evidencia autorizada; evitar analizar volcados de credenciales fuera de procedimiento.

**4 · Diferenciar evidencias fuertes y débiles** — Pruebas fuertes: alerta correlacionada de abuso de credenciales, process tree anómalo, host fuente incompatible con su cuenta, múltiples hosts alcanzados, acceso privilegiado injustificado y señales de robo de material secreto. Débiles: NTLM, 4624 tipo 3 o 4648 aislados.

**5 · Construir línea temporal de identidad** — Observar dónde y cuándo se usó la identidad antes, durante y después: logons, sesiones administradas, cambios de grupo, acciones de servicios y registros PAM; investigar si se filtró contraseña además de un posible hash.

**6 · Validar cambios de administración** — Contrastar ticket de cambios, jump host y origen real, herramienta firmada y horario de mantenimiento; exigir confirmación independiente para cerrar, no solo «lo hice yo». No exponer a un administrador en un análisis acusatorio sin evidencia.

**7 · Contención si riesgo suficiente** — Seguir playbook para aislamiento del origen sospechoso, restricción de sesiones, eventual restablecimiento de credenciales y búsqueda de extensión; reset de contraseña sin cortar sesiones o eliminar acceso a hash de LSASS no garantiza limpieza.

**8 · Cierre y retroalimentación de detección** — Clasificar confirmado/probable/no concluyente/benigno según evidencia; documentar falsos positivos, brechas EDR y consultas de hunting. Priorizar LAPS, Credential Guard, tiering y bloqueo de logons privilegiados en puestos de usuario.

### Evidencias y cómo interpretarlas

| Fuente / campo | Lectura técnica |
|---|---|
| Alerta Defender for Identity: alert ID, título, entidades y evidencia | Punto de partida; no sustituye examen de logon y procesos. |
| DeviceLogonEvents en FS01: LogonType Network, Protocol NTLM, RemoteIP | Aporta contexto de logons del endpoint; revisar ActionType para distinguir éxito y fallo. |
| 4624 tipo 3, 4776 y 4648 (si existen) | 4624: sesión red; 4776: NTLM validado; 4648: credenciales explícitas, no necesariamente presente en PtH. |
| Defender for Endpoint, procesos origen/destino | Procesos no esperados, movimiento lateral, acceso a LSASS y herramientas con indicadores adicionales. |
| Servicios/tareas remotas y recursos compartidos | Permiten confirmar acciones después de autenticación; importante para impacto. |
| Fuente autorizada: PAM, cambios, inventario de jump hosts | Explicaciones benignas y trayectoria esperada de administradores. |

### KQL — consultas

#### Defender XDR Advanced Hunting · alertas de identidad por hash

**Entorno y prerequisitos:** Defender XDR con AlertInfo. Buscar texto/techniques solo sirve como hunting inicial; nombres de títulos localizados y técnicas varían. Filtrar incidentes posteriormente.

```kql
AlertInfo
| where Timestamp > ago(7d)
| where Title has_any ("hash", "lateral", "credential")
       or tostring(AttackTechniques) contains "T1550.002"
| project Timestamp, AlertId, Title, Severity, Category, ServiceSource, AttackTechniques
| order by Timestamp desc
```

**Interpretación:** Localiza alertas relacionadas y permite pivotar por AlertId a la evidencia del incidente.

**Limitaciones:** Títulos localizados, versiones y nombres pueden cambiar. AlertInfo no prueba PtH; correlacionar AlertEvidence y portal. AttackTechniques puede aparecer en otro formato según el producto.

#### Defender XDR Advanced Hunting · NTLM en el servidor afectado

**Entorno y prerequisitos:** MDE habilitado en hosts destino. DeviceLogonEvents contiene AccountName, Protocol, RemoteIP, LogonType (etiquetas) y ActionType.

```kql
let equipo = "FS01";
DeviceLogonEvents
| where Timestamp > ago(24h)
| where DeviceName startswith strcat(equipo, ".") or DeviceName =~ equipo
| where AccountName =~ "it.admin" or RemoteIP == "10.20.10.23"
| project Timestamp, DeviceName, AccountDomain, AccountName,
          RemoteIP, RemoteDeviceName, LogonType, Protocol,
          ActionType, IsLocalAdmin, LogonId, ReportId
| order by Timestamp asc
```

**Interpretación:** Reconstruye el uso de la identidad y protocolos observados en el equipo destino.

**Limitaciones:** No asumir que todos los eventos son exitosos: inspeccionar ActionType. No deducir uso de hash vs contraseña desde Protocol=NTLM.

### SPL — consultas

#### Splunk Windows Security · 4624, 4648 y 4776 para una identidad

**Entorno y prerequisitos:** Índice con logs DC y endpoints; búsquedas iniciales por cuenta y ventana. Los alias de identidad varían por versión.

```spl
index=wineventlog earliest=-24h (EventCode=4624 OR EventCode=4648 OR EventCode=4776 OR EventID=4624 OR EventID=4648 OR EventID=4776)
| eval cuenta=coalesce(TargetUserName,Account_Name,AccountName),
       origen=coalesce(IpAddress,Source_Network_Address,Workstation,WorkstationName),
       metodo=coalesce(AuthenticationPackageName,Authentication_Package)
| search cuenta="it.admin"
| table _time host EventCode EventID cuenta origen metodo LogonType TargetLogonId
| sort _time
```

**Interpretación:** Muestra secuencia temporal de logons, credenciales explícitas y validaciones NTLM para la cuenta.

**Limitaciones:** El 4776 puede usar campos de usuario diferentes; esta búsqueda puede omitirlo. Inspeccionar raws y normalizar. 4648 no es necesario ni suficiente para PtH.

#### Splunk CIM Authentication · origen y destinos de la cuenta

**Entorno y prerequisitos:** Modelo CIM Authentication mapeado y poblado. Evitar afirmar PtH por esta consulta: analiza comportamiento de autenticación.

```spl
| tstats count from datamodel=Authentication.Authentication
  where earliest=-24h latest=now Authentication.user="it.admin"
  by Authentication.src Authentication.dest Authentication.action
| rename Authentication.* as *
| sort - count
```

**Interpretación:** Consolida entornos y destinos de una identidad, útil para estimar alcance.

**Limitaciones:** CIM Authentication no permite saber qué secreto (hash o contraseña) se aportó. Puede mezclar endpoints, servicios cloud o SSO.

### Comandos prácticos de observación (no destructivos)

**Windows PowerShell — solo lectura / endpoint destino:** Observar autenticaciones recientes (con permisos y auditoría habilitada).

```powershell
Get-WinEvent -ComputerName FS01 -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddHours(-4)} -MaxEvents 120 |
  Select-Object TimeCreated,Message
```

**Windows PowerShell — solo lectura / endpoint destino:** Revisar creación de servicios en host involucrado.

```powershell
Get-WinEvent -ComputerName FS01 -FilterHashtable @{LogName='System';Id=7045;StartTime=(Get-Date).AddHours(-4)} |
  Select-Object TimeCreated,Message
```

**Windows PowerShell — solo lectura / máquina de análisis:** Consultar ID de evento 4648 y contexto, si existe habilitación de auditoría.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security';Id=4648;StartTime=(Get-Date).AddHours(-4)} -MaxEvents 50 |
  Select-Object TimeCreated,Message
```

### Contención: decisión, alcance y límites de autoridad

Si la alerta es corroborada por contexto de ejecución lateral y uso privilegiado inexplicable, aislar estaciones afectadas y restringir credenciales/sesiones según IR. Preservar telemetría y evitar obtener secretos durante un análisis exploratorio. Planificar cambios de contraseña, delegación e invalidación de sesiones según plataforma, sin asegurar que un simple reset invalida todos los tokens ni que elimina persistencia.

### Criterios de escalado

- Alerta MDI de alta confianza respaldada por comportamiento no autorizado.
- Cuenta privilegiada desde host incompatible con PAM y salto autorizado.
- Posible robo de credenciales en el origen, acceso a LSASS y múltiples destinos.
- Nueva ejecución remota, creación de servicios/tareas o alteración de identidad.
- No se dispone de evidencia suficiente para atribuir PtH con seguridad; clasificar como sospechoso e investigar.

### Falsos positivos y contexto legítimo

- Administración legítima usando NTLM en entornos sin Kerberos.
- Tareas programadas con credenciales y acceso remoto autorizado.
- Estación jump host compartida o registrada erróneamente.
- Agentes de gestión con fan-out e instalación de servicios.
- Cambio de comportamiento por migración de PAM o infraestructura de red.

### Errores que penalizan en una entrevista SOC N2

- Decir que 4624 tipo 3 + NTLM confirma Pass-the-Hash.
- Confundir hash usado en autenticación NTLM con evidencia observada de robo de hash.
- Exigir 4648 como condición necesaria de PtH.
- Omitir las entidades y el detalle de la propia alerta de identidad.
- Resetear contraseña y declarar erradicación sin revisar origen y sesiones.
- No correlacionar los procesos ni las acciones posteriores en el host destino.

### Perspectiva Red Team / Blue Team

Pass-the-Hash reutiliza material autenticador NTLM obtenido por distintas vías sin tener que conocer la contraseña en claro. La red y el DC suelen mostrar autenticaciones NTLM ordinarias, de modo que el análisis necesita contexto de identidad, endpoint y anomalías. La defensa reduce la presencia de hashes en estaciones expuestas y la reutilización de cuentas administrativas, además de auditar saltos no autorizados.

### Respuesta modelo de entrevista

> Comenzaría conservando el detalle de la alerta de Defender for Identity: usuario, origen, destino, hora y evidencias. Correlacionaría 4624 tipo 3, 4776 y telemetría DeviceLogonEvents; NTLM no confirma PtH. Investigaré árbol de procesos y posibles accesos a LSASS en origen, así como servicios, tareas o SMB en destino. Compararía con PAM y mantenimiento autorizado. Si el conjunto apunta a abuso de credenciales, escalaría y contendría los equipos y sesiones; si falta evidencia, clasificaría la atribución como posible, no confirmada.

### Lista de autoevaluación

- [ ] Entiende qué distingue hash reutilizado de contraseña conocida.
- [ ] No diagnostica PtH con un solo evento NTLM.
- [ ] Conoce 4624/4776/4648 y sus límites.
- [ ] Incluye alerta MDI y procesos del origen y destino.
- [ ] Busca ejecuciones remotas/alcance y planes de sesión/credenciales.
- [ ] Propone controles preventivos como jump hosts, Credential Guard y tiering.

**MITRE ATT&CK (hipótesis salvo evidencia):** T1550.002 — Pass the Hash (hipótesis), T1003.001 — LSASS Memory (solo si evidencia de acceso), T1021.002 — SMB/Windows Admin Shares (si uso posterior confirmado)

### Fuentes verificables

- https://learn.microsoft.com/windows/security/threat-protection/auditing/event-4624
- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4776
- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4648
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicelogonevents-table
- https://learn.microsoft.com/en-us/defender-for-identity/alerts-xdr
- https://attack.mitre.org/techniques/T1550/002/
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-alertinfo-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication

---

<a id="n2-10"></a>
## N2-10 — Cuenta de servicio con sesión interactiva sobre DC a las 02:00

**Nivel:** SOC N2 · **Bloque:** Active Directory y movimiento lateral

> **Pregunta de entrevista:** Una cuenta de servicio realiza un inicio de sesión interactivo en un controlador de dominio a las 02:00. ¿Cómo determinarías si existe un compromiso?

### Escenario y objetivo

DC01 emite un Security Event 4624 a las 02:04 de la cuenta novashop\svc-backup, con LogonType 10 (RemoteInteractive) y origen 10.20.10.77, un equipo que no figura en la CMDB. A las 02:06 aparece 4672 y a las 02:09 una tarea programada nueva. El responsable de backups dice que el servicio normalmente solo ejecuta tareas automáticas desde BCK01. Queda por comprobar si el evento fue correctamente parseado y quién autorizó el acceso.

**Objetivo operativo:** Distinguir inicios de sesión esperados de cuenta servicio —servicio 5, batch 4 o red 3— de logon interactivo 2 o RDP 10 no autorizado, evaluar el privilegio real, la cadena de actividad y posible persistencia, y coordinar contención preservando continuidad de backups.

### Hipótesis que debes contrastar

- Credenciales de servicio expuestas usadas por un adversario para iniciar una sesión interactiva y realizar operaciones sobre DC.
- Mantenimiento excepcional autorizado a través de RDP por técnico (aun así puede violar la política de cuentas de servicio).
- Error de normalización: evento tipo 3 clasificado como interactive por una regla externa o nombre de logon incoherente.
- Identidad administrada gMSA o cuenta tradicional con políticas distintas; no asumir que toda cuenta con prefijo svc- tiene los mismos permisos.
- 4624 exitoso + 4672 no demuestra por sí solo persistencia; la nueva tarea debe asociarse a identidad, LogonId, host, proceso y ventana real.

### Procedimiento operativo paso a paso

**1 · Confirmar el evento bruto y la clase de acceso** — Revisar 4624 del DC con TargetUserName, LogonType, IpAddress, WorkstationName, AuthenticationPackageName, LogonId y hora UTC; 2=Interactive, 10=RemoteInteractive, 3=Network, 4=Batch y 5=Service. No depender de etiqueta de alerta.

**2 · Comparar con la política del principal** — Consultar AD: tipo de cuenta, SPN, host autorizados, flags de delegación, restricciones logon hours, membresías y políticas deny log on locally / deny log on through RDP. Confirmar propietario y finalidad del servicio.

**3 · Investigar fuente y ruta de conexión** — Resolver 10.20.10.77 con DHCP, VPN, CMDB, NAC y EDR; confirmar si es jump server aprobado. Analizar sesiones RDP y uso PAM/MFA donde sea aplicable.

**4 · Unir eventos por sesión en el mismo DC** — Correlacionar 4624 TargetLogonId con 4672 SubjectLogonId, 4688, 4698 y, si aplica, 4720/4728/4732, GPO/registro y eventos de Directory Service; validar timestamps y otros usuarios concurrentes.

**5 · Investigar tarea nueva y procesos** — Extraer 4698 XML, autor, ubicación, acción programada, binario firmado, comando y árbol EDR. Una tarea que aparece luego del logon no se atribuye automáticamente a la cuenta sin unión de sesión o proceso.

**6 · Medir radio de daño** — Determinar privilegios efectivos de svc-backup, si tiene backup privileges o acceso a secretos, si se ha usado en otros DC, SQL, archivos o repositorios, y si se observa alteración de grupos o auditoría.

**7 · Contener sin romper backups** — Si hay acceso no autorizado: contener equipo de origen/terminal, coordinar revocación de sesiones y cambios de credenciales, restringir logon interactivo de servicio y revisar tareas nuevas. Plan de sustitución o rotación de cuenta con equipo de backup.

**8 · Validar recuperación** — Comprobar cese de nuevas sesiones, integridad de backup, eliminación/revisión forense de persistencia, privilegios reducidos, pruebas funcionales y documentación de la incidencia. Mantener seguimiento por si recurre.

### Evidencias y cómo interpretarlas

| Fuente / campo | Lectura técnica |
|---|---|
| 4624 en DC: tipo 2 o 10, usuario y origen | Es la distinción principal respecto a 3/4/5; comprobar evento real antes de decidir. |
| 4672 unido por LogonId/host | Indica privilegios especiales asignados a sesión; no prueba por sí solo actividad maliciosa. |
| 4698 y detalles de tarea | Puede demostrar persistencia u operación autorizada; comparar cuenta y proceso responsable. |
| AD: privilegios y restricciones del principal | Diferencia cuenta servicio limitada, gMSA y servicio con permisos innecesarios. |
| Eventos RDP, PAM, CMDB/VPN/DHCP | Atribuye estación y justificación; cambios autorizados deben estar registrados. |
| EDR: procesos e inicio remoto sobre DC | Prueba acciones reales durante la sesión, necesaria para evaluar impacto. |

### KQL — consultas

#### Sentinel / SecurityEvent · logons interactivos de cuentas servicio en DC

**Entorno y prerequisitos:** SecurityEvent ingerido de los DC. Lista estática de DC solo demostrativa; sustituir por inventario/watchlist. LogonType es entero.

```kql
let dcs = dynamic(["DC01", "DC02", "DC01.novashop.local", "DC02.novashop.local"]);
SecurityEvent
| where TimeGenerated > ago(7d) and EventID == 4624
| where LogonType in (2, 10)
| where Computer in~ (dcs)
| where TargetUserName startswith "svc-"
| project TimeGenerated, Computer, TargetUserName, TargetDomainName,
          LogonType, IpAddress, WorkstationName, AuthenticationPackageName,
          TargetLogonId, SubjectUserName
| order by TimeGenerated desc
```

**Interpretación:** Permite hallar sesiones interactivas de identidades clasificadas como servicio en DC.

**Limitaciones:** No todos los servicios empiezan svc-. La clasificación correcta usa inventario AD; la lista DC debe contener el mismo formato FQDN/NetBIOS que Computer y refrescarse. No confundir LogonType 3 con interactivo.

#### Sentinel / SecurityEvent · sesión específica y actividades posteriores

**Entorno y prerequisitos:** DC tiene logs 4624/4672/4698/4688; TargetLogonId y SubjectLogonId poblados según evento. Reemplazar sesión y host tras observar 4624; posible falta de join directo en 4698.

```kql
let equipo = "DC01";
let sesion = "0x123abc";
SecurityEvent
| where TimeGenerated > ago(12h)
| where Computer startswith equipo
| where EventID in (4624, 4672, 4688, 4698)
| extend LoginSesion=iff(EventID == 4624,
                          tostring(TargetLogonId), tostring(SubjectLogonId))
| where LoginSesion =~ sesion or (EventID == 4698 and SubjectUserName =~ "svc-backup")
| project TimeGenerated, EventID, Computer, SubjectUserName,
          TargetUserName, LoginSesion, IpAddress, ProcessName, CommandLine, EventData
| order by TimeGenerated asc
```

**Interpretación:** Reúne eventos de sesión conocidos y tareas creadas por principal de interés para inspección manual.

**Limitaciones:** EventData en SecurityEvent es STRING, no estructura dinámica; 4698 puede no incluir LogonId. Esta búsqueda no prueba que todos los eventos pertenezcan a una misma sesión: validar EventRecordId, timestamps y entidad.

### SPL — consultas

#### Splunk Windows Security 4624 · cuenta de servicio en DC y horario

**Entorno y prerequisitos:** Ingesta 4624 de todos los DC y extracción LogonType, TargetUserName, IpAddress; lista de DC de ejemplo.

```spl
index=wineventlog earliest=-7d (EventCode=4624 OR EventID=4624)
(host=DC01 OR host=DC02)
| eval tipo=coalesce(LogonType,Logon_Type),
       usuario=coalesce(TargetUserName,Account_Name,AccountName),
       origen=coalesce(IpAddress,Source_Network_Address,src_ip),
       sesion=coalesce(TargetLogonId,Logon_ID)
| where tostring(tipo) IN ("2","10") AND like(lower(usuario),"svc-%")
| table _time host usuario tipo origen sesion AuthenticationPackageName
| sort _time
```

**Interpretación:** Detecta sesiones interactivo/RDP de cuentas con prefijo de servicio.

**Limitaciones:** No sustituye inventario de cuentas. Los nombres de campo dependen del TA Windows y el evento no prueba por sí solo compromiso.

#### Splunk Security eventos del DC · actividad posterior a 4624

**Entorno y prerequisitos:** Logs Windows 4624/4672/4698/4688/4728 de DC; ajustar nombre de cuenta por inventario y ventana de alerta.

```spl
index=wineventlog earliest=-4h latest=now host=DC01
(EventCode=4624 OR EventCode=4672 OR EventCode=4698 OR EventCode=4688 OR EventCode=4728
 OR EventID=4624 OR EventID=4672 OR EventID=4698 OR EventID=4688 OR EventID=4728)
| eval actor=coalesce(SubjectUserName,TargetUserName,Account_Name,AccountName)
| search actor="svc-backup"
| table _time host EventCode EventID actor LogonType IpAddress
        SubjectLogonId TargetLogonId TaskName NewProcessName CommandLine
| sort _time
```

**Interpretación:** Construye línea temporal inicial de la identidad y eventos próximos sobre DC.

**Limitaciones:** Otros eventos podrían tener el actor como campo diferente o proceso cuenta SYSTEM: ampliar búsqueda por LogonId y telemetría EDR. Un mismo actor no asegura relación causal.

### Comandos prácticos de observación (no destructivos)

**Windows PowerShell — solo lectura / AD:** Examinar cuenta sin mostrar secretos; RSAT requerido.

```powershell
Get-ADUser -Identity 'svc-backup' -Properties Enabled,MemberOf,LastLogonDate,
  ServicePrincipalName,PasswordLastSet,AccountNotDelegated,LogonWorkstations |
  Select-Object SamAccountName,Enabled,MemberOf,LastLogonDate,ServicePrincipalName,
    PasswordLastSet,AccountNotDelegated,LogonWorkstations
```

**Windows PowerShell — solo lectura / DC:** Leer 4624 y revisar event XML para la sesión en cuestión.

```powershell
Get-WinEvent -ComputerName DC01 -FilterHashtable @{LogName='Security';Id=4624;StartTime=(Get-Date).AddHours(-8)} -MaxEvents 150 |
  Where-Object { $_.Message -match 'svc-backup' } |
  Select-Object TimeCreated,Id,RecordId,Message
```

**Windows PowerShell — solo lectura / DC:** Leer creaciones de tareas 4698 antes de decidir erradicación.

```powershell
Get-WinEvent -ComputerName DC01 -FilterHashtable @{LogName='Security';Id=4698;StartTime=(Get-Date).AddHours(-8)} -MaxEvents 40 |
  Select-Object TimeCreated,Id,RecordId,Message
```

### Contención: decisión, alcance y límites de autoridad

No deshabilitar `svc-backup` sin coordinar respaldos, consistencia de backups y dependencia en otros sistemas. Si se confirma uso ilegítimo en DC, aplicar el plan de incidentes: contención del origen, restricción de acceso al DC, revisión de cuenta/credenciales con su propietario y preservación de evidencia, mientras se establecen sustitución y pruebas de recuperabilidad. Para cuentas de servicio, imponer denegación de logon interactivo/RDP cuando sea compatible y validado; usar gMSA/identidades administradas donde proceda.

### Criterios de escalado

- Cuenta de servicio tiene inicio 4624 tipo 2 o 10 en un DC fuera de política.
- Origen desconocido, sin PAM o fuera de jump host autorizado.
- 4672, 4698 u otro cambio sensible asociado por sesión y proceso.
- Cuenta puede acceder a backups, secretos o privilegios altos.
- Se observan otros DC, reautenticaciones o persistencia.

### Falsos positivos y contexto legítimo

- Soporte de emergencia y sesión RDP por administrador autorizado, pero en infracción de políticas de cuentas.
- Script de mantenimiento que usa runas o cuenta mal inventariada.
- La regla interpretó 4624 tipo 3 de red como inicio interactivo.
- CMDB y nombre de equipo incompletos; origen conocido tras resolver VPN/PAM.
- Cuenta de servicio nombrada svc- pero usada formalmente como cuenta de usuario (riesgo organizativo).

### Errores que penalizan en una entrevista SOC N2

- Tratar LogonType=3 como inicio de sesión interactivo en el DC.
- Afirmar que 4672 es compromiso confirmado.
- Relacionar 4698 posterior con la sesión sin LogonId y proceso.
- Deshabilitar cuenta crítica antes de coordinar recuperación de backups.
- No revisar otros DC ni las restricciones de logon de cuenta.
- Cerrar porque el dueño dice que es una cuenta servicio, sin investigar el origen RDP.

### Perspectiva Red Team / Blue Team

Las cuentas técnicas tradicionales pueden tener contraseñas de larga vida, permisos amplios y pocas restricciones de logon. Un adversario que obtiene la credencial puede intentar usarla interactiva o remotamente, aunque nunca sea necesario para ejecutar el servicio original. Un control sólido separa identidades de ejecución, restringe logons, elimina privilegios innecesarios y detecta desviaciones de host/horario.

### Respuesta modelo de entrevista

> Confirmaría primero que el 4624 del DC sea realmente tipo 2 o 10 y no tipo 3, y consultaría origen, cuenta y LogonId. Contrastaré la política de la cuenta de servicio, los equipos autorizados y PAM. Correlacionaría 4672 y tareas 4698 con esa sesión, la actividad EDR y otras sesiones en DC. Si no existe justificación técnica ni ticket y hay persistencia, activaría IR, contendría el origen y coordinaría la restricción/rotación de la cuenta sin romper los backups. El criterio no es solo la hora, sino la identidad, equipo y acciones.

### Lista de autoevaluación

- [ ] Distingue Windows LogonType 2/10 vs 3/4/5.
- [ ] Comprueba 4624 y eventos de privilegios 4672 de forma correlacionada.
- [ ] Reconstruye tarea nueva 4698 y prueba atribución.
- [ ] Verifica origen con PAM, ticket y CMDB.
- [ ] Investiga privilegios efectivos y otros DC.
- [ ] Contiene sin invalidar backups de forma irreflexiva.

**MITRE ATT&CK (hipótesis salvo evidencia):** T1078.002 — Domain Accounts (si uso ilegítimo), T1053.005 — Scheduled Task (si tarea maliciosa), T1021.001 — Remote Desktop Protocol (si logon tipo 10 corroborado)

### Fuentes verificables

- https://learn.microsoft.com/windows/security/threat-protection/auditing/event-4624
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/windowsevent
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicelogonevents-table
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

## Plantilla de respuesta rápida en entrevista (guía, no memorizar)

**1. Confirmo cobertura:** ¿qué evento, qué equipo lo emitió, qué política de auditoría/sensor tengo y qué ventana UTC?

**2. Diferencio hecho de hipótesis:** «Se registraron 4769 RC4» es observación; «se descifró una clave» NO es inferencia válida sin evidencia adicional.

**3. Correlaciono identidades:** usuario, SID, DC, estación origen, servicios/host destino, tickets, proceso y eventos posteriores.

**4. Consulto cambios y baseline:** PAM, saltos autorizados, backup, ERP, despliegues, SPN y SACL.

**5. Decido acciones con IR:** gravedad, tipo de cuenta, control de credenciales, aislamiento y continuidad de negocio; verifico efectividad.

**6. Documento y explico incertidumbres:** qué confirmo, qué no puedo descartar, cobertura ausente, acciones pedidas/aplicadas y quién aprobó.

## Matriz de eventos Windows para la web

| Event ID | Interpretación principal | Fuente típica | Precaución |
|---|---|---|---|
| 4769 | TGS Kerberos solicitado | Controlador de dominio | RC4 + volumen ≠ contraseña descifrada |
| 4662 | Operación sobre objeto AD | DC con SACL y auditoría | No todos los 4662 son replicación |
| 4624 | Inicio de sesión exitoso | Host donde ocurrió | Tipo 3 red, tipo 10 RDP |
| 4776 | Validación de credenciales NTLM | DC para cuenta de dominio | No aporta servidor destino final |
| 4648 | Credenciales explícitas utilizadas | Host donde ocurre | No es requisito para Pass-the-Hash |
| 4672 | Asignación de privilegios especiales | Host de sesión | No prueba intención maliciosa |
| 4698 | Creación de tarea programada | Host de la tarea | Vincular con autor/proceso/sesión |
| 7045 | Servicio nuevo | Log System de host | Puede ser despliegue legítimo |

## Notas para integrar el JSON en SOC-RESPONSES

- Las claves y estructura `preguntas[]`, `kql[]`, `spl[]`, `pasos[]`, `evidencias[]`, `respuesta_entrevista` y `criterios_evaluacion` son compatibles con las tandas 01–05.
- La interfaz puede mostrar primero la pregunta y un temporizador; revelar después hipótesis, pasos, consultas y criterios de evaluación para autoevaluación.
- Incluir campos de cobertura: `entorno`, `limites`, `fuentes`, `estado_validacion` y `fecha_revision` visibles en cada respuesta.
- Nunca ejecutar automáticamente comandos PowerShell desde una web didáctica; son ejemplos para laboratorios administrados.
- Crear un filtro por técnica, MITRE, EventID, herramienta, dificultad y preguntas pendientes de repasar.
- Diferenciar visiblemente «sospecha», «corroboración» y «confirmación». Las alertas por sí mismas no representan compromiso confirmado.

**Estado:** Tanda 06 terminada; N2-06 a N2-10. Pausa hasta el siguiente GO para N2-11 a N2-15.
