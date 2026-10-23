# SOC-RESPONSES — Tanda 04 | SOC N1: Procedimientos y gestión de incidentes

**Escenarios:** N1-16 a N1-20 · **Revisión de documentación:** 18/10/2026 · **Enfoque:** decisiones SOC N1, escalado y SLA, validación contextual, contención, KQL, SPL, IR y perspectiva Red Team.

> **Alcance y validación:** Material de aprendizaje para respuesta defensiva y entrevistas. Se contrastaron tablas y nombres de campos con documentación oficial de Microsoft, Splunk, NIST y CISA; NO se ha ejecutado ninguna consulta en un tenant Sentinel/Defender XDR ni en un Splunk real. Ajustar permisos, fuentes, índices, mappings CIM, acción firewall, ActionType, cobertura, retención, zonas horarias y procedimientos. Los nombres, horarios y direcciones del escenario son ejemplos ficticios; no son observables de amenaza reales.

## Índice

- [N1-16 — Alerta crítica sin evidencia suficiente: ¿investigar o escalar?](#n1-16)
- [N1-17 — Un administrador pide cerrar una alerta: verificar, no obedecer a ciegas](#n1-17)
- [N1-18 — IP maliciosa con conexiones bloqueadas: ¿incidente resuelto?](#n1-18)
- [N1-19 — Traspaso de turno con un incidente abierto y relevo en cinco minutos](#n1-19)
- [N1-20 — Sospecha de ransomware sin alertas SIEM: actuar sin esperar al panel](#n1-20)

## Principios transversales de actuación SOC N1

1. **Severidad ≠ certeza:** un evento crítico puede ser falso positivo, pero exige respuesta alineada a impacto y SLA.
2. **N1 investiga y escala:** no esperar una evidencia perfecta cuando el riesgo es alto; informar hechos, incertidumbres y limitaciones.
3. **Bloqueo ≠ compromiso descartado:** investigar rutas, sesiones anteriores y actividad relacionada.
4. **Turno no corta la respuesta:** continuidad de ticket, responsable, próximo paso y decisión de contención.
5. **Sin alerta SIEM ≠ sin ataque:** los síntomas observados por usuarios pueden activar una emergencia.

## Matriz operativa rápida

| ID | Decisión prioritaria | Riesgo de una mala respuesta |
|---|---|---|
| N1-16 | Escalar como sospecha con evidencia parcial y SLA | Esperar confirmación y perder tiempo de contención |
| N1-17 | Validar la solicitud con cambio + telemetría | Cerrar ataque real amparado en cuenta administrativa |
| N1-18 | Verificar bloqueo, rutas y actividad previa | Confundir intentos bloqueados con seguridad global |
| N1-19 | Entregar ticket, hechos, contención y responsables | Dejar incidente activo sin continuidad |
| N1-20 | Activar IR ante síntomas de cifrado aunque falte SIEM | Permitir propagación por esperar una alerta |

---

<a id="n1-16"></a>
## N1-16 — Alerta crítica sin evidencia suficiente: ¿investigar o escalar?

**Nivel:** SOC N1 · **Bloque:** Procedimientos SOC y gestión de incidentes

> **Pregunta de entrevista:** Tienes una alerta de severidad crítica, pero no encuentras suficiente evidencia para confirmar el compromiso. ¿La escalas o continúas investigando?

### Escenario y objetivo

A las 02:51, Sentinel muestra una alerta High de posible ejecución remota sobre un servidor de pagos etiquetado como activo crítico. El evento enlazado contiene host y marca de tiempo, pero el sensor EDR está retrasado y faltan eventos de proceso. Un analista N1 dispone de 10 minutos según el SLA de escalado crítico; no existe indicio corroborado de ejecución exitosa. El servicio sigue disponible.

**Objetivo:** Distinguir severidad, prioridad operacional y confianza de la evidencia; hacer triaje limitado en tiempo, preservar el estado «no confirmado» y escalar oportunamente sin afirmar que hay compromiso ni cerrar prematuramente.

### Hipótesis a contrastar

- Ataque real en fase temprana; el EDR aún no ha enviado la evidencia relevante.
- Detección verdadera de un intento bloqueado sin ejecución exitosa.
- Falso positivo por mantenimiento o scanner autorizado cuya firma se confunde con ejecución remota.
- Error de correlación: el evento corresponde a otro host o ventana por retraso/diferencia horaria.
- Falta de visibilidad por cobertura incompleta, retención, permisos, retraso de ingestión o agente offline.
- Alerta duplicada o parte de un incidente mayor que ya investiga N2.

### Procedimiento operativo, paso a paso

**0. Determinar riesgo inmediato** — Identificar criticidad del activo, posible impacto, propagación, credenciales privilegiadas y hora de inicio. Alta severidad no equivale por sí sola a compromiso confirmado, pero exige acción rápida.

**1. Registrar el reloj del SLA** — Anotar hora UTC en que la alerta fue vista, límite de escalado, ID estable del evento y quién está de guardia. Investigar y avisar pueden ocurrir en paralelo.

**2. Validar el origen de la alerta** — Revisar nombre/regla, proveedor, severidad, entidad, criterios disparadores, detección concreta, ventana de origen y estado del sensor. No confundir TimeGenerated con el instante de ejecución.

**3. Buscar prueba mínima independiente** — Consultar logs de autenticación, EDR, procesos, firewall o red del activo en ±15–30 minutos. Preguntar: ¿existe proceso/hijo, logon exitoso, flujo sospechoso, archivo creado o control preventivo aplicado?

**4. Medir lagunas de cobertura** — Confirmar último heartbeat EDR, ingestión, DCR/conector, permisos, filtros y retención; «cero resultados» de una tabla ausente no equivale a «cero actividad».

**5. Evaluar hipótesis alternativas** — Cruzar inventario/propietario y mantenimiento autorizado, proxy/VPN y detecciones previas. Si un scanner legítimo explica el patrón, pedir evidencias de aprobación, no basarse solo en declaraciones.

**6. Tomar la decisión según tiempo y riesgo** — Si el SLA vence, el activo es crítico, hay progresión o falta una fuente imprescindible, escalar como sospecha no confirmada. Un N1 no debería retrasar el escalado esperando certezas forenses.

**7. Comunicar de forma precisa** — Enviar ID alerta, timestamps UTC, host/identidad, hecho observado, hipótesis, fuentes consultadas, lagunas, impacto plausible y acciones realizadas/no realizadas.

**8. Coordinar contención autorizada** — Si el riesgo es inminente, activar playbook de respuesta y autorización correspondiente; no aislar producción, bloquear accesos o cerrar tickets arbitrariamente.

**9. Mantener seguimiento y actualización** — Indicar siguiente consulta, owner, hora de revisión y criterios de re-priorización; añadir nueva evidencia al mismo incidente para evitar duplicados.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| SystemAlertId, AlertName, AlertSeverity, ProviderName | Identifican alerta y proveedor; severidad es clasificación inicial, no veredicto. |
| TimeGenerated, StartTime, EndTime | Separan ingestión de actividad detectada: retraso temporal altera correlaciones. |
| CompromisedEntity, Entities | Permiten resolver host/cuenta/IP, pero entidades serializadas pueden estar incompletas. |
| Heartbeat, último evento EDR, conectores/DCR | Prueban visibilidad; ausencia de logs puede reflejar problema de cobertura. |
| Proceso, autenticación, conexión o creación de fichero | Corroboración independiente, con causalidad todavía por verificar. |
| Inventario/CMDB y cambios autorizados | Valor de negocio y explicación administrativa contrastable. |
| SLA, ticket, hora de notificación y responsable | Aseguran gestión diligente y trazabilidad incluso si la alerta resulta falsa. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics: ficha de alertas High con tiempos y entidades

**Requisito:** SecurityAlert presente en workspace Sentinel; TimeGenerated es hora de registro/ingesta de alerta, revisar StartTime/EndTime; ajustar ventana e ID.

```kql
SecurityAlert
| where TimeGenerated > ago(6h)
| where AlertSeverity =~ "High"
| project TimeGenerated, StartTime, EndTime, SystemAlertId, AlertName,
          AlertSeverity, CompromisedEntity, ProviderName, ProductName,
          Entities, Description, Status
| order by TimeGenerated desc
```

**Interpretación:** Identifica activo, proveedor, intervalo real y campos disponibles para abrir el incidente adecuado.

**Límites:** No concluye ejecución o compromiso. No todas las alertas contienen todas las entidades. El contenido de SecurityAlert varía según conectores.

#### Defender XDR Advanced Hunting: entidad afectada y fuentes de alerta

**Requisito:** Ejecutar en Microsoft Defender XDR Advanced Hunting (no asumir disponibilidad directa en el espacio Log Analytics). AlertInfo y AlertEvidence requieren servicios integrados.

```kql
AlertInfo
| where Timestamp > ago(6h)
| where Severity =~ "High"
| join kind=leftouter (
    AlertEvidence
    | where Timestamp > ago(6h)
    | project AlertId, DeviceName, EntityType, EvidenceRole,
              RemoteIP, FileName, ProcessCommandLine
) on AlertId
| project Timestamp, AlertId, Title, Severity, ServiceSource,
          DeviceName, EntityType, EvidenceRole, RemoteIP, FileName, ProcessCommandLine
| order by Timestamp desc
```

**Interpretación:** Une alertas con artefactos para guiar búsquedas complementarias; no convierte evidencia asociada en compromiso confirmado.

**Límites:** Los resultados pueden multiplicarse por número de evidencias por alerta. AlertInfo.Timest​​amp y AlertEvidence.Timestamp reflejan registros distintos; filtrar por una ventana amplia.

### SPL: consultas de investigación

#### Splunk: alerta crítica desde un índice normalizado de alertas

**Requisito:** Ejemplo con índice lógico index=security_alerts y campos mapeados severity, alert_id, dest, rule_name, status. NO es un índice ni esquema universal de Splunk ES.

```spl
index=security_alerts earliest=-6h (severity=critical OR severity=high)
| eval asset=coalesce(dest,host), alert=coalesce(rule_name,signature)
| stats min(_time) as primero max(_time) as ultimo
        values(status) as estados values(source) as fuentes
        count as eventos by alert_id, asset, alert, severity
| convert ctime(primero) ctime(ultimo)
| sort - eventos
```

**Interpretación:** Ayuda a reunir duplicados, conservar IDs y detectar si existe un incidente previo.

**Límites:** Sustituir índice, field aliases y normalización por los campos del entorno. No presupone notables de Enterprise Security.

#### Splunk CIM Endpoint: actividad de procesos en un activo afectado

**Requisito:** CIM Endpoint.Processes disponible con procesos realmente ingeridos; ejemplo dest=SRV-PAGOS-01, ajustar FQDN.

```spl
| tstats count min(_time) as primero max(_time) as ultimo
  from datamodel=Endpoint.Processes
  where earliest=-1h latest=now Endpoint.Processes.dest="SRV-PAGOS-01"
  by Endpoint.Processes.dest Endpoint.Processes.process_name
     Endpoint.Processes.parent_process_name Endpoint.Processes.user
| rename Endpoint.Processes.* as *
| convert ctime(primero) ctime(ultimo)
| sort - count
```

**Interpretación:** Puede evidenciar ejecución y proceso padre en el activo mientras la alerta original carece de detalles.

**Límites:** Un dataset vacío puede significar falta de Sysmon/EDR o mappings CIM; tstats no es prueba forense de ausencia.

### Comandos de observación y comprobación

**Windows — lectura de procesos recientes:** Equipo autorizado; Security 4688 exige habilitar auditoría de creación de procesos; una ventana vacía puede ser falta de auditoría.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688; StartTime=(Get-Date).AddMinutes(-45)} -MaxEvents 30 | Select-Object TimeCreated, MachineName, Id, Message
```

**Linux — proceso y sockets actuales:** Consulta puntual en el host autorizado; no ejecuta cambios; puede perder eventos históricos.

```bash
sudo ss -tunap | head -80
```

**Linux — servicio EDR/forwarder:** Sustituir el nombre por el agente realmente instalado; un servicio activo no demuestra ingesta.

```bash
systemctl --no-pager --type=service --state=running | grep -Ei "audit|sensor|agent|forwarder"
```

### Contención y límites de autoridad

No borrar ni silenciar detecciones, ni declarar falso positivo sin contraste. Si el activo es crítico o hay signos de continuidad del ataque, escalar antes de agotar el SLA; el SOC/IR determina aislamiento o revocaciones conforme al playbook. Registrar explícitamente evidencia ausente y justificación.

### Cuándo escalar a N2 / Incident Response

- Cualquier alerta High/Critical que alcance el umbral temporal del procedimiento sin posibilidad de confirmación o descarte fiable.
- Activo esencial, cuenta privilegiada, múltiples hosts o movimiento lateral probable.
- Indicadores independientes de ejecución, persistencia, exfiltración o controles desactivados.
- Fallo de telemetría durante una amenaza activa o aparente manipulación de logs.
- Evidencia contradictoria con incertidumbre de impacto alto; escalar como «sospecha» con nivel de confianza explícito.

### Falsos positivos que debes evaluar

- Escaneo de seguridad aprobado sin registro en la consola del SOC.
- Regla mal calibrada para una herramienta administrativa.
- Intento bloqueado confundido con ejecución exitosa.
- Evento duplicado por múltiples productos o integración SIEM/XDR.
- Diferencias de tiempo UTC y delay de ingestión que aparentan secuencia maliciosa.

### Errores frecuentes que penalizan en entrevista

- Confundir prioridad High con certeza de compromiso.
- Rebajar el incidente sin evaluar valor de negocio del activo.
- Retrasar escalado más allá del SLA por buscar una confirmación perfecta.
- Interpretar ausencia de eventos EDR como ausencia de actividad.
- Cerrar el caso solo porque una llamada telefónica lo declara legítimo.
- Omitir fuentes, horas UTC, hallazgos negativos y dudas en el ticket.

### Perspectiva Red Team y Blue Team

El adversario busca ventanas de visibilidad baja y puede operar cuando el sensor no registra todos los procesos o el SIEM retrasa la ingesta. En defensa, separar detección, ejecución confirmada y límites de observabilidad impide tanto falsas atribuciones como demoras peligrosas; no presupone técnica concreta sin artefactos verificables.

### Respuesta modelo de entrevista

> Realizaría triaje inmediato de la alerta y su activo, verificaría la regla, la línea temporal y al menos una fuente independiente. Si faltan logs o la criticidad y el SLA exigen decisión, escalaría como actividad sospechosa no confirmada, describiendo exactamente qué sé, qué no sé y qué comprobé. Mantendría el ticket y solicitaría contención solo a través del playbook; no la cerraría por ausencia de prueba.

### Criterios de evaluación del candidato

- [ ] Diferencia severidad, probabilidad/confianza, impacto de negocio y prioridad.
- [ ] Define comprobaciones rápidas con límite temporal y fuentes independientes.
- [ ] Reconoce que la ausencia de telemetría no descarta compromiso.
- [ ] Escala sin exagerar la certeza y con incident ID, hora y propietario.
- [ ] No ejecuta cambios disruptivos fuera de su autoridad.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1078 (si se detecta abuso de cuenta; no confirmado), T1059 (si evidencia muestra intérprete; no confirmado)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityalert
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-alertinfo-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-alertevidence-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.4/data-models/endpoint

---

<a id="n1-17"></a>
## N1-17 — Un administrador pide cerrar una alerta: verificar, no obedecer a ciegas

**Nivel:** SOC N1 · **Bloque:** Procedimientos SOC y gestión de incidentes

> **Pregunta de entrevista:** Un administrador solicita cerrar una alerta porque asegura que la actividad es legítima. ¿Qué harías antes de cerrarla?

### Escenario y objetivo

Son las 11:42. Una detección indica ejecución de PowerShell con privilegios elevados en el servidor de ficheros FS-01. El administrador de turno escribe «Soy yo, cierra la alerta» y aporta un cambio abierto de mantenimiento, pero no el ID exacto del procedimiento ejecutado. El host contiene documentos internos y el script hizo una conexión HTTPS externa.

**Objetivo:** Verificar identidad, autorización, correspondencia técnico-temporal y consecuencias de la actividad antes de clasificar como benigno; conservar una pista auditable sin tratar la autoridad del solicitante como evidencia suficiente.

### Hipótesis a contrastar

- Mantenimiento real debidamente autorizado y limitado al servidor indicado.
- Herramienta legítima usada de forma inesperada (dual use) por un administrador.
- Cuenta del administrador comprometida: el atacante intenta influir en el cierre.
- Cambio autorizado que se ejecutó fuera del alcance/hora o con binario no previsto.
- Conexión de actualización/telemetría del script versus envío externo no autorizado.
- La persona solicitante tiene permisos de infraestructura, pero no autoridad para aceptar riesgo SOC.

### Procedimiento operativo, paso a paso

**0. Mantener la alerta en estado investigable** — No suprimir, cerrar ni cambiar a falso positivo por petición informal. Registrar ticket y hora de solicitud.

**1. Autenticar la identidad por canal confiable** — Comprobar quién solicita cierre y su relación con la intervención (ticketing corporativo, callback a contacto verificado); una dirección de correo o chat no basta si existe posible compromiso.

**2. Revisar el cambio autorizado** — Validar identificador, ventana aprobada, sistemas, cuentas, comandos o herramientas permitidas y responsable; distinguir cambio aprobado de descripción genérica.

**3. Correlacionar actividad observada** — Comprobar PID, proceso padre, comando, usuario, token, hash/ruta/firma, tiempo, destino de red, volumen y origen de sesión. Atribución a cuenta no confirma qué humano pulsó Enter.

**4. Contrastar proceso y consecuencias** — Si el script administra backups esperados, contrastar logs de backup y destino permitido; si descarga o envía datos fuera de alcance, investigar antes de cerrar.

**5. Revisar otros indicadores** — Buscar mismo IOC/comando/host en otras máquinas, anomalías de autenticación, errores del EDR o ejecuciones fuera de ventana.

**6. Tomar decisión basada en política** — Con evidencia consistente: resolver como actividad benigna/esperada conforme a taxonomía del SOC. Si existen discrepancias, pedir revisión N2/IR y mantener caso abierto.

**7. Preservar trazabilidad** — Documentar quién pidió el cierre, cómo se validó, ticket/cambio y evidencias técnicas vinculadas a esa ejecución, no solo «admin confirmó».

**8. Afinar la detección sin agujeros** — Si genera ruido frecuente, proponer excepción muy concreta con aprobación, duración y reevaluación; no excluir globalmente PowerShell o el servidor.

**9. Informar y vigilar** — Comunicar el resultado y monitorizar recurrencia; evitar que la validación puntual se reutilice como autorización perpetua.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Solicitud verificada y rol de autorizador | Identidad fiable y facultad de aceptar riesgo; rol TI no implica permiso para resolver incidente de seguridad. |
| ID del cambio, alcance y ventana | Necesarios para contrastar la ejecución concreta, no únicamente la existencia de algún mantenimiento. |
| Proceso, padre, CommandLine, hash y firma | Permiten diferenciar herramienta autorizada de invocación anómala o hijacking. |
| Timestamp UTC, hostname y User SID | Evitan confundir una ejecución parecida en otro activo o momento. |
| Conexiones HTTPS salientes | Requieren destino, origen, reputación y propósito; HTTPS por sí solo no da legitimidad. |
| Logs de autenticación y elevación | Ayudan a confirmar patrón esperado; credenciales robadas mantienen nombre de cuenta legítimo. |
| Ticket SOC, decisión y aprobador | Soportan auditoría, reversión de clasificación y mejoras de detección. |

### KQL: consultas de investigación

#### Defender XDR Advanced Hunting: PowerShell observado en FS-01

**Requisito:** DeviceProcessEvents en Defender XDR con cobertura MDE del servidor. Sustituir el nombre de equipo, ampliar ventana si hay retención.

```kql
DeviceProcessEvents
| where Timestamp > ago(24h)
| where DeviceName startswith "FS-01"
| where FileName in~ ("powershell.exe", "pwsh.exe")
| project Timestamp, DeviceName, AccountName, FileName, ProcessCommandLine,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          SHA1, ProcessId, InitiatingProcessId
| order by Timestamp desc
```

**Interpretación:** Correlaciona ejecutable, cuenta, origen padre y comando con el cambio aprobado.

**Límites:** No interpreta seguridad del script ni autentica persona física. MDE puede truncar línea de comandos o no registrar todo.

#### Defender XDR Advanced Hunting: conexiones que iniciaron PowerShell

**Requisito:** DeviceNetworkEvents en Defender XDR; ajuste FS-01 y período; las conexiones registradas tienen contexto del proceso iniciador.

```kql
DeviceNetworkEvents
| where Timestamp > ago(24h)
| where DeviceName startswith "FS-01"
| where InitiatingProcessFileName in~ ("powershell.exe", "pwsh.exe")
| project Timestamp, DeviceName, InitiatingProcessFileName,
          InitiatingProcessCommandLine, RemoteIP, RemotePort, RemoteUrl,
          Protocol, ActionType
| order by Timestamp desc
```

**Interpretación:** Muestra destinos que requieren cotejo con lista permitida para el mantenimiento.

**Límites:** La existencia de un evento de conexión no garantiza que hubo transferencia ni cuantifica bytes; consultar proxy/firewall para volumen y decisiones efectivas.

### SPL: consultas de investigación

#### Splunk CIM Endpoint: procesos PowerShell y padres en FS-01

**Requisito:** CIM Endpoint.Processes normalizado desde Sysmon, EDR o Security 4688; campos de usuario pueden estar ausentes.

```spl
| tstats count min(_time) as primero max(_time) as ultimo
  from datamodel=Endpoint.Processes
  where earliest=-24h latest=now Endpoint.Processes.dest="FS-01"
  by Endpoint.Processes.process_name Endpoint.Processes.parent_process_name
     Endpoint.Processes.user Endpoint.Processes.process
| rename Endpoint.Processes.* as *
| search process_name="powershell.exe" OR process_name="pwsh.exe"
| convert ctime(primero) ctime(ultimo)
| sort - ultimo
```

**Interpretación:** Agrupa invocaciones para compararlas con script, ventana y cuenta documentados.

**Límites:** Las búsquedas sobre línea de comandos muy largas pueden estar truncadas. Ajustar dest al FQDN usado por el TA.

#### Splunk CIM Network Traffic: salidas del servidor durante el cambio

**Requisito:** CIM Network_Traffic.All_Traffic con src del servidor. Este flujo no liga por sí solo conexiones con un PID.

```spl
| tstats count sum(All_Traffic.bytes_out) as BytesSalida
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-24h latest=now All_Traffic.src="10.10.20.15"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - BytesSalida
```

**Interpretación:** Destaca destinos y volumen que deben coincidir con finalidad del cambio.

**Límites:** La IP 10.10.20.15 es ficticia; bytes_out depende del sentido/normalización y algunos firewalls no aportan bytes.

### Comandos de observación y comprobación

**Windows — revisar registro PowerShell:** Log operacional Windows PowerShell presente solo si la auditoría correspondiente está habilitada; no sustituye Script Block Logging.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 60 | Select-Object TimeCreated, Id, Message
```

**Windows — filtrar procesos creados:** Necesita evento 4688 habilitado y ejecutarse en el equipo donde se grabó la ejecución.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 70 | Select-Object TimeCreated, Message
```

**Linux — alternativa de validación de ejecutable:** Si el servidor investigado fuera Linux, comprobar ruta del proceso sin alterarlo; solo aplicable a sistema autorizado.

```bash
ps -eo user,pid,ppid,lstart,args --sort=-lstart | head -35
```

### Contención y límites de autoridad

En N1, no cerrar solo por estatus de quien solicita y no aplicar una exclusión amplia. Si se verifica uso de credenciales comprometidas, comandos ajenos al cambio o salida de datos, elevar a IR para contención con aprobaciones; evitar avisar al posible atacante a través de un canal sospechoso.

### Cuándo escalar a N2 / Incident Response

- La cuenta del administrador presenta inicios de sesión o MFA anómalos.
- Ejecución fuera de ventana, ruta/hash diferente, padre inesperado o destino de red desconocido.
- La persona solicitante no demuestra autorización o el equipo del cambio niega haberlo programado.
- Actividad se extiende a hosts no incluidos o hay indicios de exfiltración/persistencia.
- Duda significativa de suplantación de identidad o presión por desactivar controles de seguridad.

### Falsos positivos que debes evaluar

- Actualización de sistema mediante PowerShell en ventana autorizada.
- EDR o administrador de configuración ejecutando scripts firmados.
- PowerShell usado por un agente de backup o inventario.
- Conexion HTTPS a repositorio corporativo legítimo.
- Regla que compara rutas sin normalizar System32/SysWOW64 o alias del binario.

### Errores frecuentes que penalizan en entrevista

- Cerrar por obediencia a «soy administrador».
- No cotejar alcance de cambio y ventana exacta.
- Suponer que usuario autenticado = operador humano legítimo.
- Olvidar investigar conexiones externas y cadena de procesos.
- Introducir exclusión global que silencie futuras señales reales.
- Eliminar evidencia y no dejar referencia a la autorización de cierre.

### Perspectiva Red Team y Blue Team

Una identidad privilegiada legítima puede ser abusada para ejecutar herramientas administrativas (living-off-the-land) y para dar apariencia de actividad esperada. Defenderse implica comprobar el vínculo entre identidad, cambio aprobado, ejecución real y efectos observados, sin ofrecer al presunto atacante un canal para presionar el cierre.

### Respuesta modelo de entrevista

> No cerraría la alerta únicamente por la petición. Confirmaría identidad por canal confiable, validaría el cambio aprobado —horario, hosts, usuario y comandos— y contrastaría procesos, autenticación y conexiones reales. Si coincide y no hay evidencias contradictorias, documentaría el cierre según taxonomía; si difiere o hay riesgo de compromiso, mantendría abierto y escalaría.

### Criterios de evaluación del candidato

- [ ] Verifica identidad y autoridad del solicitante por canal confiable.
- [ ] Cruza ticket de cambio con evidencias técnicas y ventana.
- [ ] Reconoce riesgos de cuentas comprometidas y herramientas dual-use.
- [ ] Documenta decisión, aprobador y evidencias.
- [ ] Evita excepciones permanentes y cierre basado solo en reputación.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1078 (abuso de cuentas válidas, como hipótesis), T1059.001 (PowerShell, si actividad evidencia ejecución)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.4/data-models/endpoint
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic

---

<a id="n1-18"></a>
## N1-18 — IP maliciosa con conexiones bloqueadas: ¿incidente resuelto?

**Nivel:** SOC N1 · **Bloque:** Procedimientos SOC y gestión de incidentes

> **Pregunta de entrevista:** Detectas una IP maliciosa en los logs de firewall, pero todas las conexiones aparecen bloqueadas. ¿Considerarías el incidente resuelto?

### Escenario y objetivo

Un firewall perimetral registra 920 intentos bloqueados en 30 minutos desde 203.0.113.88 contra el puerto 3389 de un servidor público. El feed TI etiqueta la dirección como sospechosa. No hay sesiones permitidas en ese dispositivo durante la ventana consultada, pero la empresa tiene VPN, CDN y un segundo firewall y no se ha comprobado el histórico ni los equipos internos.

**Objetivo:** Diferenciar intento externo detenido por un control de compromiso de activo. Validar la eficacia de bloqueo, su cobertura, correlacionar accesos por otras rutas, reputación y contexto y cerrar o escalar conforme a evidencia y criterio de recurrencia.

### Hipótesis a contrastar

- Escaneo automatizado oportunista bloqueado correctamente; no hay efecto observable.
- Ataque repetitivo o dirigido con múltiples orígenes, no limitado a la IP del feed.
- La IP tuvo conexiones permitidas antes de activar la regla o por otra ruta de entrada.
- El «deny» corresponde a intento iniciado, no necesariamente a tráfico previo ya establecido.
- La IP tiene mala reputación histórica/compartida, pero el intento actual no es específico.
- Hay egress desde activos internos al mismo destino que no está cubierto por el firewall inspeccionado.

### Procedimiento operativo, paso a paso

**0. Identificar direccionalidad** — Determinar si 203.0.113.88 es origen que intenta entrar o destino al que un host interno trata de salir; cambia drásticamente la hipótesis. Identificar interfaz, zona y NAT.

**1. Validar acción realmente tomada** — Revisar campos DeviceAction/SimplifiedDeviceAction, motivo de denegación y estado del sensor. «Alert» no es «block»; distinguir deny, reset, drop, allowed y sesión terminada.

**2. Acotar y ampliar tiempo** — Observar primeros/últimos intentos, minutos previos y posteriores a la regla, cambios de configuración y disponibilidad del dispositivo. Buscar conexiones ya establecidas.

**3. Resolver exposición y destino** — Confirmar puerto/servicio, si está accesible públicamente, criticidad, WAF/proxy/CDN/VPN, host real tras DNAT y otras rutas de acceso.

**4. Correlacionar con autenticación y endpoints** — Buscar éxitos de RDP/VPN, fallos, nuevos servicios, EDR, conexiones salientes y otros indicadores desde la misma infraestructura o cuenta. No equiparar mismo IP a misma persona.

**5. Validar fuente de inteligencia** — Comprobar fecha, confianza, contexto y uso compartido del indicador TI. La reputación de una IP no equivale a ataque exitoso.

**6. Medir alcance y recurrencia** — Contar puertos, hosts, zonas, destinos y cambios de IP/ASN. Identificar si un host interno intenta conexiones persistentes aunque estén bloqueadas.

**7. Decidir estado** — Si hubo solo intentos no exitosos, control efectivo, sin evidencia de compromiso y cobertura suficiente, documentar evento bloqueado según SOP. Mantener alerta o escalado si hay indicios asociados.

**8. Verificar detección preventiva** — Pedir validación de regla y control complementario por equipos de red/IR cuando proceda; no bloquear rangos enteros sin evaluar impacto y propiedad.

**9. Documentar límites** — Guardar dirección, puertos, volumen, rango UTC, dispositivos consultados, reglas, resultado, fuentes no disponibles y criterio de cierre/escalado.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| DeviceAction y SimplifiedDeviceAction | Distinguen acción ejecutada; mapear variantes y verificar política del proveedor. |
| SourceIP, DestinationIP, puertos, SourceTranslatedAddress | Aclaran flujo real, NAT y destino; una IP de gateway puede ocultar al origen. |
| Rule, DeviceName, zona/interfaz | Relacionan bloqueo con firewall concreto, su cobertura y prioridad de política. |
| SentBytes / ReceivedBytes, estado de sesión | Ayudan a medir tráfico observado, pero sus valores y dirección dependen del fabricante. |
| Logs de VPN/RDP/IdP/EDR | Revelan accesos o ejecuciones posteriores que el firewall no ve. |
| Vigencia/confianza TI | Reduce bloqueo por reputación caducada o infraestructura multi-tenant. |
| Cambios de reglas y rutas alternativas | Detectan caminos que el filtro principal no cubre. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics: acciones de firewall por IP investigada

**Requisito:** Tabla CommonSecurityLog (CEF) con eventos relevantes ingeridos; IP TEST-NET 203.0.113.88 como ejemplo y acción normalizada por parser.

```kql
CommonSecurityLog
| where TimeGenerated > ago(24h)
| where SourceIP == "203.0.113.88" or DestinationIP == "203.0.113.88"
| extend Accion=tolower(iff(isempty(SimplifiedDeviceAction), DeviceAction, SimplifiedDeviceAction))
| summarize Eventos=count(), Primera=min(TimeGenerated), Ultima=max(TimeGenerated),
            Acciones=make_set(Accion, 15), Reglas=make_set(Activity, 15)
  by SourceIP, DestinationIP, DestinationPort, DeviceVendor, DeviceProduct
| order by Eventos desc
```

**Interpretación:** Expone intentos y tipos de acciones por origen/destino/puerto para contrastar «todo bloqueado».

**Límites:** SimplifiedDeviceAction puede ser vacío; Activity no equivale siempre a ID de regla. Revisar DeviceAction concreto para decidir bloqueos permitidos.

#### Sentinel / Log Analytics: búsquedas de actividad permitida o denegada en el mismo par

**Requisito:** CommonSecurityLog; adaptar mapeo de acciones vendor y relación NAT; la comparación es orientativa.

```kql
CommonSecurityLog
| where TimeGenerated > ago(7d)
| where SourceIP == "203.0.113.88" or DestinationIP == "203.0.113.88"
| extend Accion=tolower(iff(isempty(SimplifiedDeviceAction), DeviceAction, SimplifiedDeviceAction))
| summarize Eventos=count(), BytesEnviados=sum(SentBytes),
            Acciones=make_set(Accion, 20)
  by bin(TimeGenerated, 1h), SourceIP, DestinationIP, DestinationPort
| order by TimeGenerated asc
```

**Interpretación:** Revela historial, intervalos previos al bloqueo, intentos repetidos y posibles transferencias.

**Límites:** Bytes y acción dependen de registros de sesión/parsers; cero bytes no prueba cero tráfico ni ausencia de otra ruta.

### SPL: consultas de investigación

#### Splunk CIM Network Traffic: intentar confirmar que tráfico fue bloqueado

**Requisito:** CIM Network_Traffic.All_Traffic con action mapeado a allowed/blocked/teardown (varía por TA).

```spl
| tstats count sum(All_Traffic.bytes_out) as BytesSalida
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-24h latest=now
    (All_Traffic.src="203.0.113.88" OR All_Traffic.dest="203.0.113.88")
  by All_Traffic.src All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - count
```

**Interpretación:** Separa acciones permitidas y bloqueadas, direccionalidad y activos involucrados.

**Límites:** El modelo incluye reglas de red pero puede no incluir IDS, WAF ni todos los firewalls; campos normalizados requieren validación.

#### Splunk CIM Intrusion Detection: actividad IDS asociada a la IP

**Requisito:** CIM Intrusion_Detection.IDS_Attacks ingerido con signature/action; observar si IDS alertó o bloqueó.

```spl
| tstats count min(_time) as Primero max(_time) as Ultimo
  from datamodel=Intrusion_Detection.IDS_Attacks
  where earliest=-7d latest=now
    (IDS_Attacks.src="203.0.113.88" OR IDS_Attacks.dest="203.0.113.88")
  by IDS_Attacks.signature IDS_Attacks.action IDS_Attacks.src IDS_Attacks.dest
| rename IDS_Attacks.* as *
| convert ctime(Primero) ctime(Ultimo)
| sort - count
```

**Interpretación:** Corrobora detecciones de patrones, sin confundir intento IDS con éxito.

**Límites:** IDS observa firmas y acciones separadas de reglas de conectividad; ausencia de eventos depende del sensor y de visibilidad de tráfico.

### Comandos de observación y comprobación

**Linux — estado de sockets desde host protegido:** Solo si se tiene acceso autorizado al host; instantánea de conexiones actuales, sin prueba de tráfico histórico.

```bash
sudo ss -tunap | head -80
```

**Linux — reglas nftables:** Solo lectura; inspecciona reglas locales, no reglas del firewall perimetral/cloud.

```bash
sudo nft list ruleset | head -120
```

**Windows — sockets TCP existentes:** Listado puntual local; corroborar el PID en caso de sospecha.

```powershell
Get-NetTCPConnection | Select-Object -First 40 LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess
```

### Contención y límites de autoridad

Bloquear la IP puede ser protección complementaria, pero no asumir que cubre variantes, proxy, VPN, egress u otros orígenes. En N1 normalmente verificar regla y escalar si hay indicios de compromiso; modificaciones de firewall o aislamiento son acciones autorizadas y registradas.

### Cuándo escalar a N2 / Incident Response

- Cualquier sesión permitida previa/posterior con autenticación o ejecución asociada.
- Mismo IOC como destino de tráfico saliente desde un host interno.
- Origen alternativo, múltiples vectores, explotación dirigida o cuentas privilegiadas afectadas.
- Fallo de cobertura o evidencia de que el bloqueo no se aplicó a rutas de red completas.
- RDP/servicio crítico expuesto innecesariamente o consecuencias operacionales serias.

### Falsos positivos que debes evaluar

- Escaneo de Internet genérico totalmente detenido en un puerto expuesto.
- Proveedor NAT compartido incluido por reputación antigua.
- Escáner interno autorizado representado por IP pública de pasarela.
- Duplicación entre registros del mismo firewall y SIEM.
- Normalización errónea de `deny` como `allowed`, o sesión `teardown` mal interpretada.

### Errores frecuentes que penalizan en entrevista

- Decir «blocked = resuelto» sin comprobar otras rutas o actividad previa.
- Confundir IP atacante externa con IP destino de C2.
- Equiparar reputación TI con certeza de intrusión.
- Ignorar NAT, proxies, balanceadores y túneles.
- Creer que una regla nueva detiene todas las sesiones ya existentes sin validación.
- Atribuir bytes de un solo firewall a toda la transferencia del sistema.

### Perspectiva Red Team y Blue Team

Desde el lado adversario, una IP pública puede cambiar entre intentos o un intento puede progresar por un vector distinto. El defensor debe estudiar conducta, cuenta/activo, rutas de red e indicadores de efecto, y evitar depender exclusivamente de una lista estática de IPs. Una detección bloqueada es un resultado del control, no prueba de que no exista intrusión por otro camino.

### Respuesta modelo de entrevista

> Primero aclararía si la IP es origen de ataque o destino de salida y confirmaría con los campos del firewall que realmente hubo bloqueo. Ampliaría la ventana antes de la regla y correlacionaría con VPN, autenticación, EDR, IDS y otras rutas. Si solo constan intentos bloqueados, sin señales de ejecución ni accesos permitidos y la cobertura es suficiente, documentaría el bloqueo según SOP. Si hay éxitos, egress o dudas graves de cobertura, escalaría.

### Criterios de evaluación del candidato

- [ ] Distingue dirección de tráfico e intento frente a compromiso.
- [ ] Valida acción de control y período anterior a activación.
- [ ] Busca evidencia en controles distintos y rutas alternativas.
- [ ] Reconoce calidad/vigencia de TI y errores de NAT.
- [ ] Decide cierre condicionado con justificación, no absoluto.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1110 (si existen intentos de credenciales; no inferir del puerto), T1046 (si hay barrido de servicios; no confirmado)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/intrusion-detection

---

<a id="n1-19"></a>
## N1-19 — Traspaso de turno con un incidente abierto y relevo en cinco minutos

**Nivel:** SOC N1 · **Bloque:** Procedimientos SOC y gestión de incidentes

> **Pregunta de entrevista:** Durante tu turno detectas una posible infección y tu relevo llega en cinco minutos. ¿Qué información incluirías en el traspaso del incidente?

### Escenario y objetivo

Son las 06:55. La consola EDR muestra un proceso sospechoso en FIN-WS-07, y la búsqueda de red muestra un destino inusual. El último turno termina a las 07:00; no se sabe si el proceso ejecutó acciones dañinas. Hay ticket SOC-7421, EDR online y el equipo financiero trabaja a las 08:00. El relevo no participó en la investigación.

**Objetivo:** Garantizar continuidad de IR sin perder contexto, duplicar acciones ni dejar acciones pendientes sin responsable: transmitir hechos, incertidumbre, cronología, alcance, estado de contención, evidencias, riesgos, SLA y próximos pasos.

### Hipótesis a contrastar

- La actividad fue bloqueada y requiere confirmación de alcance.
- El equipo sigue comprometido o puede volver a comunicarse con un destino remoto.
- Se ejecutó una herramienta legítima de soporte con telemetría mal interpretada.
- Hay segunda máquina o identidad afectada aún sin investigar.
- El evento es parte de un incidente mayor gestionado por IR/N2.
- El relevo carece de permisos/visibilidad y necesita un punto de contacto.

### Procedimiento operativo, paso a paso

**0. Comunicar riesgo inmediatamente si está activo** — Si se confirma infección activa, propagación o exfiltración, avisar y escalar antes de esperar el relevo. El traspaso no sustituye una respuesta de emergencia.

**1. Entregar identificación exacta** — Ticket/incidente IDs, versión, prioridad, clasificación actual (sospecha/no confirmado), hora de primera detección UTC, quién investiga y canal de comunicaciones.

**2. Resumir impacto y alcance** — Hosts, identidades, unidad de negocio, criticidad, sistemas conectados, usuarios informados y posibles implicaciones de disponibilidad o datos sensibles.

**3. Exponer hechos e hipótesis separadas** — Hechos: nombre del proceso, PID/ProcessGuid si existe, hash, parent, ruta, IP, puertos y eventos. Hipótesis: infección/C2/mantenimiento. Confianza explícita.

**4. Construir la cronología mínima** — Evento inicial, autenticaciones, ejecución, comunicaciones, alertas, acciones, cambios y último indicador, siempre en UTC, con fuentes y vínculos.

**5. Estado de controles y decisiones** — ¿Host aislado? ¿Proceso detenido? ¿Conexión bloqueada? ¿Acción ejecutada, autorizada o solo sugerida? Confirmar resultados y señalar efectos secundarios.

**6. Indicar búsquedas hechas y ausencias** — Consultas y filtros utilizados, qué dio resultado, qué no, qué log faltaba o llevaba retraso; no presentar «sin resultados» como «sin riesgo».

**7. Ordenar próximos pasos accionables** — Ejemplo: comprobar 24h de proceso y red, validar hash y propietario, correlacionar otras máquinas, decisión de IR sobre aislamiento y revisar backups si procede.

**8. Precisar responsables, deadlines y contactos** — Asignar cada tarea al nuevo analista/N2/IT; incluir SLA, próxima revisión, aprobadores, dependencias y vías de escalado.

**9. Confirmar recepción y continuidad** — Hacer entrega verbal breve con ticket actualizado, solicitar read-back de 2–3 tareas críticas y traspasar titularidad del incidente.

**10. Dejar evidencia preservada** — Relacionar exportaciones, hashes de ficheros, capturas, eventos y cadena de custodia en repositorio autorizado; evitar adjuntar secretos o PII sin control.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Ticket SOC-7421, ID de alerta y estado | Permite al relevo retomar la investigación correcta y no crear incidentes duplicados. |
| Primera/última detección en UTC | Permite correlación temporal y manejo de SLA. |
| Host, IP, usuario, PID/ProcessGuid, parent, hash | Entidades para pivotar; PID puede reutilizarse, el timestamp distingue instancias. |
| Observables de red | IP/dominio/puertos y dirección; reputación y exfiltración aún pueden no estar confirmadas. |
| Acciones efectuadas y verificadas | No es lo mismo «orden de aislamiento emitida» que «aislamiento confirmado». Guardar aprobador. |
| Ausencias, limitaciones y decisiones pendientes | Evita suponer que una búsqueda incompleta exonera al activo. |
| Propietario, plazo, stakeholders y siguiente paso | Convierte la entrega en continuidad operativa verificable. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics: ficha breve para traspaso por activo

**Requisito:** SecurityAlert disponible. Buscar por CompromisedEntity o usar SystemAlertId del ticket si el host no aparece.

```kql
SecurityAlert
| where TimeGenerated > ago(24h)
| where CompromisedEntity contains "FIN-WS-07"
| project TimeGenerated, StartTime, EndTime, SystemAlertId, AlertName,
          AlertSeverity, Status, ProductName, CompromisedEntity,
          Entities, Description
| order by TimeGenerated desc
```

**Interpretación:** Recupera IDs/ventanas de alertas para incluir en la nota de relevo.

**Límites:** No es el estado completo del incidente ni confirma que el equipo esté aislado; consultar entidad/incidente y consola EDR.

#### Defender XDR: conexiones recientes del equipo para el relevo

**Requisito:** DeviceNetworkEvents en Defender XDR. Ajustar FQDN/alias del host; correlacionar con DeviceProcessEvents si hay iniciador sospechoso.

```kql
DeviceNetworkEvents
| where Timestamp > ago(4h)
| where DeviceName startswith "FIN-WS-07"
| summarize Eventos=count(), Primera=min(Timestamp), Ultima=max(Timestamp),
            Puertos=make_set(RemotePort, 15),
            Procesos=make_set(InitiatingProcessFileName, 15)
  by DeviceName, RemoteIP, RemoteUrl, ActionType
| order by Ultima desc
```

**Interpretación:** Produce una tabla compacta de destinos, volumen de eventos y procesos para que el relevo priorice.

**Límites:** Eventos no representan sesiones únicas ni bytes y no permiten declarar C2 sin contexto. Verificar que la conexión fue realmente permitida.

### SPL: consultas de investigación

#### Splunk CIM Endpoint: resumen de procesos observados durante el turno

**Requisito:** Modelo Endpoint.Processes poblado; el destino debe corresponder al hostname normalizado FIN-WS-07.

```spl
| tstats count min(_time) as Primero max(_time) as Ultimo
  from datamodel=Endpoint.Processes
  where earliest=-8h latest=now Endpoint.Processes.dest="FIN-WS-07"
  by Endpoint.Processes.process_name Endpoint.Processes.parent_process_name
     Endpoint.Processes.user
| rename Endpoint.Processes.* as *
| convert ctime(Primero) ctime(Ultimo)
| sort - Ultimo
```

**Interpretación:** Lista procesos y padres para priorizar pivotes y anotar búsquedas pendientes.

**Límites:** Es resumen de eventos de creación, no inventario de procesos vivos. Requiere normalización CIM.

#### Splunk CIM Network Traffic: conexiones salientes para el estado del relevo

**Requisito:** CIM Network_Traffic.All_Traffic y src como IP del host ficticio 10.20.5.7; no inferir causalidad con PID.

```spl
| tstats count sum(All_Traffic.bytes_out) as BytesSalida
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-8h latest=now All_Traffic.src="10.20.5.7"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - BytesSalida
```

**Interpretación:** Presenta destinos, acciones y bytes observados por sensores de red.

**Límites:** BytesSalida puede estar ausente; fuentes NAT/proxy pueden usar IP del gateway, no de la estación.

### Comandos de observación y comprobación

**Windows — ventana de últimos logs locales:** Lectura orientativa de eventos Security, requiere permisos; no cubre fuente EDR.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; StartTime=(Get-Date).AddHours(-2)} -MaxEvents 25 | Select-Object TimeCreated, Id, MachineName, Message
```

**Windows — datos del sistema para identificar correctamente el equipo:** Lectura de nombre, OS y dominio; no es un IOC de infección.

```powershell
Get-ComputerInfo | Select-Object CsName,CsDomain,WindowsProductName,OsVersion
```

**Linux — línea de tiempo de autenticación reciente:** En activo Linux autorizado con journald; no confundir hora local con UTC del ticket.

```bash
sudo journalctl --since "2 hours ago" --no-pager -n 60
```

### Contención y límites de autoridad

El traspaso no debe interrumpir una contención urgente. Si existe riesgo activo, mantener al N2/IR en conferencia y confirmar quién tiene autoridad sobre aislamiento, revocación de credenciales o bloqueo. No enviar dumps, credenciales o información sensible a canales no aprobados.

### Cuándo escalar a N2 / Incident Response

- Contención no verificada y señal de daño activo (encriptación, exfiltración, desplazamiento lateral).
- Infección potencial en servidor de alta criticidad o identidad privilegiada.
- Plazo de reporte/escalado vencido o sin propietario de guardia.
- Falta de cobertura crítica que impide valorar alcance y obliga a IR a decidir.
- Desacuerdo entre análisis de turno anterior y nuevas pruebas del relevo.

### Falsos positivos que debes evaluar

- Script de despliegue empresarial legítimo ejecutado a primera hora.
- Actualizador que conecta a infraestructura de proveedores.
- Reputación transitoria de IP cloud compartida.
- Eventos duplicados por sensores distintos.
- Proceso suspendido que ya no existe cuando llega el relevo.

### Errores frecuentes que penalizan en entrevista

- Decir «revisa el ticket» sin una prioridad ni próximo paso concreto.
- No comunicar si el host está aislado realmente.
- Omitir incertidumbres y presentar «posible malware» como infección confirmada.
- Registrar solo hora local sin zona horaria.
- Abandonar una emergencia esperando al turno siguiente.
- No asignar dueño/tiempo límite o perder evidencias al finalizar sesión.

### Perspectiva Red Team y Blue Team

La actividad adversaria no cambia de turno cuando lo hace el SOC. Los atacantes pueden prolongar sesiones o ejecutar acciones en horario de baja supervisión. La defensa eficaz exige continuidad de indicadores, entidades, evidencias y decisiones entre analistas, con objetivos y tiempos explícitos; un relevo deficiente crea brechas operativas.

### Respuesta modelo de entrevista

> Entregaría ticket, clasificación y certeza, cronología UTC, activos y cuentas afectados, IoCs/IoAs, evidencia y fuentes consultadas, medidas de contención realmente verificadas y riesgos abiertos. Definiría las tres próximas acciones con responsables y vencimientos, escalaría antes si hay actividad en curso y pediría confirmación verbal de recepción al relevo.

### Criterios de evaluación del candidato

- [ ] Incluye identificadores, horas, activos, hechos y dudas.
- [ ] Especifica estado real de contención y aprobaciones.
- [ ] No ignora escalado urgente durante cambio de turno.
- [ ] Asigna tareas con dueño y plazo.
- [ ] Demuestra disciplina de documentación y transferencia de evidencia.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1059 (si se verifica ejecución mediante intérprete), T1071 (si hay comunicación de protocolo de aplicación; no confirmado)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityalert
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.4/data-models/endpoint
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic

---

<a id="n1-20"></a>
## N1-20 — Sospecha de ransomware sin alertas SIEM: actuar sin esperar al panel

**Nivel:** SOC N1 · **Bloque:** Procedimientos SOC y gestión de incidentes

> **Pregunta de entrevista:** Un usuario informa de un posible ransomware, pero no existen alertas en el SIEM. ¿Cómo comenzarías la investigación?

### Escenario y objetivo

A las 09:18, el responsable de Contabilidad llama al SOC: «Mis documentos cambiaron de extensión y aparece una nota pidiendo pago». Ninguna alerta reciente aparece en el SIEM. Otros empleados comparten una unidad SMB con ese equipo; el EDR aparece con última comunicación hace 40 minutos. Todavía no se sabe si el cifrado sigue activo ni si el servidor de archivos también está afectado.

**Objetivo:** Tratar señales directas y verificables como posible incidente grave aunque falten alertas; activar respuesta rápida, comprobar alcance, preservar evidencia y coordinar aislamiento autorizado para reducir cifrado, movimiento lateral y exposición de copias.

### Hipótesis a contrastar

- Ransomware activo en endpoint con acceso a unidad compartida; la propagación o el cifrado podrían continuar.
- Cifrado ya terminado en el equipo pero credenciales y persistencia todavía en riesgo.
- Nota de rescate creada por campaña previa, prueba controlada o broma; requiere validar artefactos antes de descartar.
- Fallo de ingesta SIEM, cobertura endpoint, alerta suprimida, sensor offline o retraso.
- Otro host, servidor de ficheros o cuenta comprometida es el origen real del cifrado observado.
- También pudo existir exfiltración previa sin síntomas hasta el cifrado.

### Procedimiento operativo, paso a paso

**0. Abrir incidente mayor y activar playbook** — La modificación masiva de ficheros y nota de rescate son evidencia suficientemente grave para activar cadena de incidentes, aunque el SIEM esté silencioso; registrar hora y contacto.

**1. Protección inmediata, según autoridad** — Indicar al usuario que deje de interactuar con ficheros y desconecte la red del equipo cuando lo indique el playbook/IR. Coordinar aislamiento EDR si está disponible; si no, con equipo de operaciones. No pedir reinicio innecesario.

**2. Determinar alcance inicial** — Identificar equipo, usuario, directorios, discos locales, unidades mapeadas, servicios SMB y otros usuarios afectados; consultar servidores de ficheros y alertas de backup.

**3. Separar ausencia de detección de ausencia de ataque** — Comprobar integridad del agente, último heartbeat, ingestión, permisos, retención, reglas de supresión y diferencia entre Microsoft Defender portal y Sentinel/Splunk.

**4. Verificar artefactos sin ejecutarlos** — Pedir foto/copia segura de nombres de ficheros, nota de rescate y ejemplo de extensión; documentar rutas, hashes y marcas de tiempo. No abrir adjuntos ni ejecutar binarios sospechosos.

**5. Buscar precursores y cadena de procesos** — Investigar procesos y padres, tareas/servicios nuevos, ejecución de herramientas de backup/vssadmin, PowerShell, cambios de Defender y orígenes de acceso. Herramientas administrativas tienen uso legítimo.

**6. Buscar cifrado y rutas de propagación** — Con MDE/Sysmon/filesystem logs analizar ráfagas de modificaciones/renombrados, cuentas y extensiones; buscar conexiones SMB 445 y sesiones RDP/WinRM asociadas, sin equipararlos automáticamente a ataque.

**7. Proteger recuperación y evidencias** — IR/backup valida instantáneas, copias offline/inmutables, integridad y separación de credenciales. Captura forense/snapshot/memoria según plan antes de cualquier limpieza; no restaurar sobre host no confiable.

**8. Evaluar riesgo de filtración** — Cotejar tráfico egress, proxy, C2, accesos a datos sensibles y grandes transferencias anteriores. Cifrado no excluye robo de datos previo.

**9. Comunicar estado y escalado** — Escalar a N2/IR, infraestructura, backup y continuidad de negocio. Documentar activos, prioridades, posibles daños, acciones verificadas y lagunas.

**10. Recuperar solo con autorización** — No eliminar el software ni restaurar backups por iniciativa N1. IR decide erradicación, reseteo de credenciales, reconstrucción limpia, verificación de persistencia y criterios para volver a red.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Extensiones masivas y nota de rescate | Síntomas de cifrado o extorsión; validar autenticidad y temporalidad sin ejecutar archivos. |
| MDE DeviceFileEvents y filesystem/Sysmon | Escrituras, modificaciones y renombrados masivos; no todas las acciones están instrumentadas ni son iguales. |
| DeviceProcessEvents, Security 4688, Sysmon Event 1 | Procesos y padres, cuentas, línea de comandos, artefactos de ejecución; audit policies influyen en visibilidad. |
| Conexiones SMB/RDP/egress | Ayudan a delimitar propagación y posible exfiltración; correlacionar con origen de proceso y sesiones. |
| Heartbeats de agente y retraso de ingesta | Explican silencio del SIEM sin descartar host comprometido. |
| Logs de backups, integridad e inmutabilidad | Determinan capacidad de recuperación; no manipular copias antes de validación. |
| Snapshot/memoria/hash/reloj UTC/acta | Preservan evidencia para IR y eventual investigación legal. |
| Otros equipos con mismo patrón | Define alcance y prioridad de aislamiento coordinado. |

### KQL: consultas de investigación

#### Defender XDR Advanced Hunting: ráfagas de actividad de ficheros por dispositivo

**Requisito:** DeviceFileEvents en equipos protegidos por MDE; acciones admitidas dependen de plataforma/versión; validar nombres en referencia de ActionType del portal.

```kql
DeviceFileEvents
| where Timestamp > ago(4h)
| where ActionType in~ ("FileCreated", "FileModified", "FileRenamed")
| summarize Eventos=count(), Archivos=dcount(strcat(FolderPath, "/", FileName)),
            Ejemplos=make_set(FileName, 8),
            Procesos=make_set(InitiatingProcessFileName, 8)
  by DeviceName, bin(Timestamp, 5m)
| where Eventos >= 100
| order by Eventos desc
```

**Interpretación:** Señala equipos con modificación intensiva de archivos para evaluar, no prueba ransomware.

**Límites:** Umbral 100 es didáctico; los eventos pueden no captar todos los cambios. Copias de seguridad, compilaciones y sincronización también modifican muchos archivos; Archivos es el número aproximado de rutas/ficheros únicos observado por el sensor, no el número real de archivos cifrados.

#### Defender XDR Advanced Hunting: comandos y herramientas relacionadas con recuperación

**Requisito:** DeviceProcessEvents de Microsoft Defender XDR; confirmar cobertura de endpoints y correlacionar con el host realmente afectado.

```kql
DeviceProcessEvents
| where Timestamp > ago(24h)
| where FileName in~ ("vssadmin.exe", "wbadmin.exe", "bcdedit.exe", "wevtutil.exe")
   or ProcessCommandLine has_any ("shadowcopy", "delete shadows", "recoveryenabled")
| project Timestamp, DeviceName, AccountName, FileName, ProcessCommandLine,
          InitiatingProcessFileName, InitiatingProcessCommandLine, SHA1
| order by Timestamp desc
```

**Interpretación:** Ayuda a identificar herramientas usadas para alterar copias, registros o recuperación, y buscar contexto de padre/usuario.

**Límites:** Aparecer en resultados no significa uso malicioso. Varios comandos son administrativos normales y ProcessCommandLine puede omitirse o truncarse.

### SPL: consultas de investigación

#### Splunk CIM Endpoint Filesystem: avalancha de cambios por host

**Requisito:** CIM Endpoint.Filesystem con eventos de ficheros realmente ingeridos; algunos EDR no generan eventos para todas las escrituras.

```spl
| tstats count as Cambios dc(Endpoint.Filesystem.file_path) as Rutas
  from datamodel=Endpoint.Filesystem
  where earliest=-4h latest=now
    (Endpoint.Filesystem.action="modified" OR Endpoint.Filesystem.action="created")
  by _time span=5m Endpoint.Filesystem.dest
| rename Endpoint.Filesystem.* as *
| where Cambios>=100
| sort - Cambios
```

**Interpretación:** Identifica picos de actividad, priorizando los hosts con alteración masiva.

**Límites:** Umbrales y acciones didácticas, varían por TA/CIM; no sustituye comparación con baseline ni implica cifrado.

#### Splunk CIM Endpoint Processes: utilidades usadas frecuentemente durante incidentes

**Requisito:** CIM Endpoint.Processes alimentado desde logs de proceso; mirar destinos/usuarios reales antes de escalado.

```spl
| tstats count min(_time) as Primera max(_time) as Ultima
  from datamodel=Endpoint.Processes
  where earliest=-24h latest=now
  by Endpoint.Processes.dest Endpoint.Processes.user
     Endpoint.Processes.process_name Endpoint.Processes.parent_process_name
     Endpoint.Processes.process
| rename Endpoint.Processes.* as *
| search process_name IN ("vssadmin.exe", "wbadmin.exe", "bcdedit.exe", "wevtutil.exe")
| convert ctime(Primera) ctime(Ultima)
| sort - Ultima
```

**Interpretación:** Detecta actividad que merece revisión cuando coincide con señales de cifrado.

**Límites:** No demuestra borrado de copias o ataque; examinar command line, autorización y relación temporal. Si no hay event logging la búsqueda queda vacía.

### Comandos de observación y comprobación

**Windows — consultar el estado del antivirus:** Solo lectura; un endpoint comprometido podría mentir sobre su estado; no demuestra ausencia de infección.

```powershell
Get-MpComputerStatus | Select-Object AMServiceEnabled,AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureLastUpdated
```

**Windows — ver ficheros recientes en carpeta afectada:** Ejecutar solo por personal autorizado, sobre rutas conocidas y sin abrir los ficheros; no tocar grandes árboles comprometidos por curiosidad.

```powershell
Get-ChildItem -LiteralPath 'C:\Users\Public\Documents' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 20 Name,Length,LastWriteTime
```

**Windows — consultar procesos de backup/shadow sin modificar:** Solo lectura; las copias pueden estar ausentes o manipuladas. Debe confirmarlo equipo de backup/IR.

```powershell
vssadmin list shadows
```

**Windows — registros de seguridad de creación de procesos:** Requiere políticas de auditoría adecuadas y privilegios sobre Security.

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688; StartTime=(Get-Date).AddHours(-4)} -MaxEvents 100 | Select-Object TimeCreated, Id, Message
```

### Contención y límites de autoridad

Una sospecha con archivos cifrados y nota de rescate amerita tratarse como emergencia aun sin SIEM. El aislamiento de host/red debe seguir playbook y coordinación con IR/infraestructura; en caso de propagación priorizar contención frente a investigación exhaustiva. Apagar únicamente si no puede contenerse por red y siguiendo evaluación de pérdida de memoria/evidencia. No pagar, descifrar, limpiar, ejecutar binarios ni restaurar sin instrucciones autorizadas.

### Cuándo escalar a N2 / Incident Response

- Nota de rescate verosímil junto a modificaciones masivas o ficheros inaccesibles.
- Unidad compartida/servidor de ficheros con múltiples usuarios afectados.
- Evidencia de propagación, abuso privilegiado, borrado de copias o EDR deshabilitado.
- Posible exfiltración previa, información sensible afectada o acceso a datos regulados.
- Ingestión EDR/SIEM silenciosa en medio de síntomas de cifrado; notificación directa a IR y continuidad.

### Falsos positivos que debes evaluar

- Simulación autorizada de ransomware con nota de prueba.
- Cambio masivo de extensiones por migración/archivado o herramienta de sincronización.
- Cifrado legítimo por software corporativo, aunque no debería generar nota de rescate.
- Archivos dañados y mensaje falso no relacionado.
- Falta de telemetría por agente apagado/cambio de colector, no necesariamente evasión maliciosa.

### Errores frecuentes que penalizan en entrevista

- Descartar incidente porque el SIEM no alertó.
- Pedir a usuario abrir nota, reenviar malware o ejecutar una «herramienta de comprobación».
- Reiniciar o apagar de inmediato sin evaluar aislamiento/evidencia cuando la red puede desconectarse.
- Borrar archivos maliciosos o restaurar sobre máquina comprometida antes de forense/IR.
- Concluir ransomware solo por ejecutar vssadmin sin valorar el comando y contexto.
- Investigar una hora mientras cifrado activo se extiende por recursos SMB.
- No verificar protección de backups e identidad asociada.

### Perspectiva Red Team y Blue Team

Un operador de ransomware puede cifrar rápidamente, intentar inutilizar backups y usar cuentas válidas o comparticiones administrativas para expandirse. Además, algunos ataques logran inhibir sensores o alertas, por lo que el reporte humano y los cambios de archivos son señales de alta importancia. Desde Blue Team, la investigación se centra en limitar impacto y reconstruir la secuencia de acceso, preparación, cifrado y eventual exfiltración.

### Respuesta modelo de entrevista

> Consideraría el reporte un posible incidente crítico, activaría el playbook y escalaría inmediatamente. Con IR coordinaría aislamiento de equipo y recursos compartidos para limitar propagación, sin reiniciar ni manipular evidencia por iniciativa propia. Verificaría extensiones/notas, activos afectados, logs de ficheros y procesos, SMB, backups y última conexión de EDR. La falta de alertas del SIEM es una laguna a investigar, nunca una prueba de ausencia de ransomware.

### Criterios de evaluación del candidato

- [ ] Prioriza posible cifrado activo sobre investigar alertas ausentes.
- [ ] Activa escalado/aislamiento proporcional bajo autoridad y sin destruir evidencia.
- [ ] Comprueba alcance de SMB, identidades y copias de seguridad.
- [ ] Diferencia señales de daño de hipótesis no confirmadas.
- [ ] Usa KQL/SPL para corroborar y reconoce limitaciones de fuentes.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1486 (Data Encrypted for Impact), T1490 (Inhibit System Recovery), T1021.002 (SMB/Windows Admin Shares, si hay evidencia), T1562.001 (Impair Defenses, si se detecta)

### Fuentes de documentación

- https://www.cisa.gov/stopransomware/ransomware-guide
- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicefileevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.4/data-models/endpoint

---

## Ejemplo de nota mínima de traspaso: SOC-7421 (N1-19)

```text
Ticket: SOC-7421 | prioridad: alta (provisional) | UTC: 06:55 | Estado: sospecha, no confirmada
Activos: FIN-WS-07, usuario/owner por validar; posible dependencia de red a revisar
Hechos: alerta EDR + destino de red no habitual; consultar IDS del ticket
Hipótesis: ejecución maliciosa / mantenimiento legítimo; confianza baja-moderada
Medidas: ninguna medida disruptiva ejecutada; EDR en línea (verificar en consola)
Evidencias: IDs, timestamps, process tree, hashes, dominios/IP y enlaces en ticket
Faltan: historial de procesos y red, hashes, aprobaciones, revisión de hosts vecinos
Siguiente responsable: analista entrante + N2 de guardia
Siguientes 15 min: corroborar cadena de procesos, pivote de red y decidir aislamiento según playbook
Próxima actualización: 07:15 UTC. Recepción de relevo: pendiente de confirmar
```

> Este ejemplo es didáctico. **Nunca escribas que el host está aislado si solo solicitaste su aislamiento.** Evita incorporar datos privados o secretos en comentarios públicos de tickets.

## Notas de implementación para SOC-RESPONSES (web)

- Claves JSON de cada pregunta y esquema `schema_version=1.0.0` compatibles con Tandas 01, 02 y 03.
- Fichas separan escenario, hipótesis, observables, decisiones, condiciones de escalado, KQL, SPL, operaciones de solo lectura y errores.
- Modo didáctico recomendado: decisión inicial del alumno → pistas → consulta propuesta → validación del escenario → respuesta modelo → retroalimentación.
- El código KQL/SPL se entrega como texto de plantilla y necesita fuentes y parámetros reales. No conectarlo a SIEM en producción sin controles de acceso y autorización.
- Para cada pregunta, guardar: identificador, nivel, evidencia, alternativas, estado de confianza, decisión y justificante; permite reproducibilidad y auditoría.

**Estado:** Tanda 04 terminada. Las preguntas N1-01 a N1-20 están cubiertas en cuatro tandas; N2-01 a N2-05 solo se trabajará tras el próximo GO.
