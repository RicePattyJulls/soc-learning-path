# SOC-RESPONSES — Tanda 07 | SOC N2: Threat Hunting y SIEM

**Escenarios:** N2-11 a N2-15 · **Revisión documental:** 18/10/2026 · **Alcance:** Defender, PowerShell, inyección, forense, DNS tunneling.

> **Nota de uso:** Material defensivo y educativo, contrastado con esquemas documentados. El JSON se ha validado estructuralmente, pero **las consultas KQL y SPL NO están ejecutadas en tenant real ni en Splunk**. Comprobar cada tabla, campo, índice, permisos, retención, logging y umbral antes de producción. Los equipos y dominios son didácticos; no compartir material sensible. Aplicar contenciones solo conforme a autorización y plan IR.

## Índice

- [N2-11 — Defender deshabilitado en varios endpoints: ¿fallo de política o defensa evadida?](#n2-11)
- [N2-12 — PowerShell codificado: decodificar para analizar sin ejecutar](#n2-12)
- [N2-13 — explorer.exe con red inusual: investigar posible inyección sin sobreatribuir](#n2-13)
- [N2-14 — Logs borrados: reconstrucción de timeline con fuentes independientes](#n2-14)
- [N2-15 — DNS tunneling con Splunk: búsqueda, triage y reducción de falsos positivos](#n2-15)

## Cinco distinciones críticas antes de empezar

- **TamperingAttempt ≠ Defender desactivado.** Un intento bloqueado puede quedar registrado; 5001 señala desactivación de protección en tiempo real, 5007 es cambio de configuración y el modo pasivo puede ser legítimo.
- **`-EncodedCommand` ≠ malware.** Decodificar texto Base64 en UTF-16LE sobre una copia NO ejecuta el código; pegarlo como comando o evaluar su contenido sí es peligroso.
- **Red de `explorer.exe` ≠ inyección.** Correlacionar PID con ProcessCreationTime/DeviceId o ProcessUniqueId, y reunir otras señales. Sysmon 8/10 son pistas, no prueba universal.
- **1102 ≠ prueba de atacante.** Significa borrado del Security audit log; la copia central puede existir aunque el origen local haya sido limpiado.
- **NXDOMAIN/etiquetas largas ≠ DNS tunneling confirmado.** Atribuir origen real, dominio, tipos/respuestas, baseline y posibilidad de DoH antes de actuar.

## Matriz rápida de priorización

| ID | Evidencia inicial | Dato que cambia la decisión | Acción inicial razonable |
|---|---|---|---|
| N2-11 | TamperingAttempt / 5001, 5007 | Estado actual AV y cadena causal | Verificar alcance, estado y preservar |
| N2-12 | PowerShell encoded | Texto analizado sin ejecución + ejecución posterior | Preservar y reconstruir árbol |
| N2-13 | explorer.exe hace red | Sysmon 8/10, EDR, contexto de proceso | No concluir inyección prematuramente |
| N2-14 | Security 1102 | Logs remotos, cuenta, eventos de procesos | Preservar y reconstruir timeline |
| N2-15 | DNS repetitivo/anómalo | Cliente, QNAME, tipo, respuesta, baseline | Investigar sin bloquear a ciegas |

---

<a id="n2-11"></a>
## N2-11 — Defender deshabilitado en varios endpoints: ¿fallo de política o defensa evadida?

**Nivel:** SOC N2 · **Bloque:** Threat Hunting y SIEM

> **Pregunta de entrevista:** Sospechas que un atacante ha deshabilitado Microsoft Defender en varios endpoints. ¿Cómo construirías una investigación en KQL para identificar los equipos afectados?

### Escenario, riesgo y objetivo

A las 09:10 recibes indicios de reducción de protección antimalware en 11 portátiles Windows. Una regla MDE detecta intentos de manipulación en cinco equipos; una consola de gestión también registra un despliegue de políticas esa mañana. Algunos hosts tienen otro antivirus autorizado y podrían funcionar en modo pasivo. Debes evaluar estado real, intentos fallidos de tampering y posibles cambios efectivos, sin desactivar controles ni precipitar aislamiento masivo.

**Objetivo operativo:** Identificar qué equipos experimentaron intentos de manipulación, cuáles presentan protección degradada actualmente, por qué mecanismo, quién inició los cambios, qué ejecución precedió los eventos y cómo contener el riesgo sin confundir modo pasivo autorizado con compromiso.

### Hipótesis que debes distinguir

- Un adversario con privilegios intenta evadir defensas mediante cambios de configuración, exclusiones, servicio, políticas o alteración del sensor (T1562.001).
- GPO, Intune, herramienta RMM o migración de EDR aplicó una modificación aprobada que generó eventos.
- El antivirus Microsoft Defender está en modo pasivo porque otra solución antimalware corporativa está activa y gestionada.
- Una protección contra manipulación bloqueó el intento; la alerta de tampering no significa que el antivirus quedara apagado.
- Hay interrupción de telemetría/ingesta o un dispositivo offline: ausencia de eventos recientes no demuestra que esté desprotegido.

### Procedimiento paso a paso

**1 · Determinar impacto y tiempo** — Abrir incidente y anotar 09:10 UTC/local, población esperada, tenant, versión del sensor, activos de alta criticidad, política de protección y estado de conectividad de MDE. Separar «evento detectado» de «estado efectivo». Negociar medidas con responsable IR antes de aislar estaciones masivamente.

**2 · Hunting por ActionType oficial** — En Defender XDR ejecutar búsqueda de DeviceEvents con ActionType == "TamperingAttempt". Es el valor de ejemplo documentado por Microsoft; revisar los ActionType disponibles para otras clases de cambios; no inventar ActionTypes supuestos.

**3 · Correlación con logs de configuración** — En Sentinel WindowsEvent (si la fuente llega) analizar Microsoft-Windows-Windows Defender/Operational para 5001 (protección real-time deshabilitada), 5004 (cambio función), 5007 (cambio de configuración) y su contexto. 5007 no prueba desactivación y los eventos no indican necesariamente el actor.

**4 · Comprobar estado actual** — A través de administración autorizada/EDR o Get-MpComputerStatus en host, comprobar AMRunningMode, AntivirusEnabled, RealTimeProtectionEnabled y salud del sensor. Confirmar modo pasivo vs activo, exclusiones y servicios, sin aplicar comandos de alteración.

**5 · Buscar causalidad** — Usar árbol de procesos MDE y DeviceRegistryEvents para correlacionar cambios con usuario, PID/tiempo, script, tareas, instalador aprobado o agente de gestión; no atribuir el evento a una ejecución solo porque coincida en una ventana de 30 minutos.

**6 · Buscar compromiso paralelo** — Revisar inicios de sesión administrativos, creación de servicios/tareas, herramientas de administración no previstas, actividad de red y alertas en equipos que generaron eventos; inspeccionar alcance horizontal (otros equipos/OU/política).

**7 · Decidir contención y priorizar** — Si hay protección efectivamente degradada más indicios de ejecución maliciosa, solicitar aislamiento EDR o control de red conforme a playbook, preservando evidencia. Si es despliegue autorizado, documentar ticket, firma del agente y ventana.

**8 · Restaurar protección con propietario** — Restablecer protección y políticas a través de gestión corporativa aprobada, validar sensor, estado real, cobertura EDR y posibles exclusiones no deseadas. Evitar reinicio no coordinado si existe riesgo forense.

**9 · Verificar y cerrar** — Comprobar que no hay nuevos eventos sospechosos, que la protección está activa o pasiva de forma deliberada, y que las brechas de ingestión se resolvieron. Documentar alcance, mapeo de evidencias, ticket y seguimiento.

### Evidencias y su interpretación

| Evidencia / origen | Qué demuestra y qué NO demuestra |
|---|---|
| DeviceEvents: ActionType=TamperingAttempt, DeviceId, Timestamp, AdditionalFields | Intento detectado; consultar detalle de evento/alerta para saber si se bloqueó o tuvo efecto. No equivale a «Defender off». |
| Windows Defender/Operational: 5001, 5004, 5007 | 5001 indica desactivación de análisis en tiempo real; 5004/5007 registran cambios. Hay que validar contexto y modo antivirus. |
| Get-MpComputerStatus: AMRunningMode, RealTimeProtectionEnabled, AntivirusEnabled | Estado actual local. Puede ser diferente del estado en el minuto de la alerta; registrar fecha de comprobación. |
| DeviceProcessEvents: AccountName, InitiatingProcess*, ProcessCommandLine | Candidatos a actor y mecanismo; atribución requiere árbol de procesos y secuencia coherente. |
| DeviceRegistryEvents: RegistryKey, RegistryValueName, RegistryValueData | Cambios correlacionados de configuración, sin asumir que cualquier registro modifica efectivamente Defender. |
| Inventario Intune/GPO/CMDB + estado EDR | Despliegue planificado, antivirus alternativo, salud del sensor, usuarios y equipos afectados. |

### KQL — consultas de investigación

#### Defender XDR · intentos de manipulación documentados

**Prerequisitos y tabla/índice:** Defender XDR Advanced Hunting con licencia y telemetría MDE; tabla DeviceEvents. ActionType validado por Microsoft para TamperingAttempt.

```kql
DeviceEvents
| where Timestamp >= ago(7d)
| where ActionType == "TamperingAttempt"
| extend Details = parse_json(AdditionalFields)
| summarize Intentos=count(), Primer=min(Timestamp), Ultimo=max(Timestamp),
            Ejemplos=make_set(tostring(Details), 3)
    by DeviceId, DeviceName
| order by Intentos desc
```

**Interpretación:** Lista equipos y recuentos de intentos; pivotar a eventos sin resumir, portal de alertas y estado actual para verificar resultado.

**Limitaciones y adaptación:** Los intentos bloqueados también aparecen. AdditionalFields tiene JSON variable; no hay campo universal de éxito. Sin sensor MDE no existe cobertura.

#### Sentinel · eventos de Microsoft Defender Antivirus

**Prerequisitos y tabla/índice:** Microsoft Sentinel/Log Analytics con WindowsEvent recogiendo el canal Microsoft-Windows-Windows Defender/Operational. No confundir con Defender XDR.

```kql
WindowsEvent
| where TimeGenerated >= ago(7d)
| where Provider =~ "Microsoft-Windows-Windows Defender"
| where EventID in (5001, 5004, 5007)
| summarize Eventos=count(), Codigos=make_set(EventID, 5),
            Primera=min(TimeGenerated), Ultima=max(TimeGenerated)
    by Computer
| order by Eventos desc
```

**Interpretación:** Agrupa equipos con cambio de configuración o protección en tiempo real; filtrar EventID=5001 y examinar Message para revisar qué pasó.

**Limitaciones y adaptación:** El proveedor/canal puede variar con el conector; confirmar muestreo de datos primero. 5007 no es garantía de éxito adversario; ausencia de datos ≠ sano.

### SPL — consultas de investigación

#### Splunk · cambios de Defender en eventos Windows

**Prerequisitos y tabla/índice:** index=wineventlog contiene Windows Defender Operational y extracciones EventCode, host, Message; adaptar TA y sourcetype.

```spl
index=wineventlog earliest=-7d (EventCode=5001 OR EventCode=5004 OR EventCode=5007)
| eval evento=coalesce(EventCode,EventID)
| stats count as eventos values(evento) as ids min(_time) as primero max(_time) as ultimo by host
| convert ctime(primero) ctime(ultimo)
| sort - eventos
```

**Interpretación:** Detecta equipos con eventos de política o protección; correlacionar con proveedor y operaciones de mantenimiento.

**Limitaciones y adaptación:** index y aliases son supuestos locales; el evento 5001 no es obligatorio en todos los despliegues y no demuestra intención maliciosa.

#### Splunk · MDE exportado: eventos de tampering

**Prerequisitos y tabla/índice:** index=edr de ejemplo con ActionType, DeviceName o device_name normalizados desde exportador MDE.

```spl
index=edr earliest=-7d ActionType="TamperingAttempt"
| eval equipo=coalesce(DeviceName,device_name,host)
| stats count as intentos min(_time) as primero max(_time) as ultimo by equipo
| convert ctime(primero) ctime(ultimo)
| sort - intentos
```

**Interpretación:** Busca intentos de manipulación publicados por el EDR central; útil si ya se exporta esa telemetría a Splunk.

**Limitaciones y adaptación:** No existe index=edr por defecto. Requiere extracción de ActionType y no confirma desactivación efectiva.

### Comandos prácticos de observación

**PowerShell autorizado / solo lectura** — Consultar estado antimalware del host y modo activo/pasivo; no modificar su configuración.

```powershell
Get-MpComputerStatus |
  Select-Object AMRunningMode,AntivirusEnabled,RealTimeProtectionEnabled,
    AMServiceEnabled,AntispywareEnabled,QuickScanAge
```

**PowerShell autorizado / solo lectura** — Consultar cambios en canal Defender sin tocar servicio.

```powershell
Get-WinEvent -FilterHashtable @{
  LogName='Microsoft-Windows-Windows Defender/Operational'
  Id=5001,5004,5007
  StartTime=(Get-Date).AddDays(-7)
} -MaxEvents 200 | Select-Object TimeCreated,Id,RecordId,Message
```

**PowerShell autorizado / solo lectura** — Consultar proceso del servicio mediante CIM en el equipo afectado.

```powershell
Get-CimInstance Win32_Service -Filter "Name='WinDefend'" |
  Select-Object Name,State,StartMode,PathName,ProcessId
```

### Contención y toma de decisiones

Un intento de tampering bloqueado requiere investigación, no aislamiento automático. Si Defender quedó inactivo y hay evidencia de ejecución maliciosa, aplicar contención proporcional por EDR/red, priorizar equipos privilegiados, preservar alertas y telemetría y solicitar al equipo de endpoint que restaure cobertura mediante Intune/GPO u otro control corporativo. No proponer deshabilitar políticas ni servicios como paso de diagnóstico. Verificar después que el sensor reporta y que el antivirus está en el modo esperado.

### Criterios de escalado

- Varios equipos cambian protección a la vez sin ventana de cambio confirmada.
- Eventos de tampering con procesos o cuentas administrativas inesperadas.
- Defender efectivamente inactivo, exclusiones anómalas o fallo del sensor.
- Host crítico, cuentas privilegiadas o indicios de movimiento lateral.
- Ausencia anormal de telemetría que impide comprobar la protección.

### Falsos positivos probables

- Migración planificada entre productos EDR/AV que pone Defender en modo pasivo.
- Actualización de motor, políticas de seguridad o GPO documentada.
- Prueba aprobada de seguridad que genera tamper protegido, sin cambio efectivo.
- Sensor offline o retraso de ingesta que simula ausencia de controles.
- Operador legítimo cambió exclusión o parámetros conforme a procedimiento.

### Errores frecuentes

- Interpretar TamperingAttempt como deshabilitación exitosa de Defender.
- Confundir 5007 (cambio) con 5001 (RTP desactivada).
- Declarar comprometidos todos los dispositivos sin validar modo AV y agente alternativo.
- Asumir que cada ActionType arbitrario está documentado y disponible.
- Bloquear en masa equipos de producción sin coordinar contención.
- No comprobar que la política corregida se aplique realmente ni salud del sensor.

### Perspectiva Red Team / Blue Team

La defensa evadida puede buscar disminuir detección antes de ejecutar otras etapas. El actor necesita privilegios o vías de cambio; un intento puede ser bloqueado por Tamper Protection. El defensor debe buscar secuencia de privilegios, proceso, política y efecto sobre cobertura, no solo eventos individuales. La mejor detección une estado real, cambios, contexto operativo y otros comportamientos de intrusión.

### Respuesta modelo de entrevista

> Partiría de DeviceEvents y el ActionType oficial TamperingAttempt para identificar máquinas y horas. En paralelo consultaría 5001, 5004 y 5007 donde estén ingestados y comprobaría el estado efectivo con el inventario de Defender y Get-MpComputerStatus. Correlacionaría procesos, cuentas y despliegues Intune/GPO. Diferenciaría intento bloqueado, modo pasivo legítimo y desactivación real. Si existe protección degradada más señales maliciosas, elevaría IR, contendría bajo playbook y verificaría restauración de cobertura.

### Autoevaluación

- [ ] Usa DeviceEvents con ActionType=TamperingAttempt real.
- [ ] Diferencia intento de desactivación efectiva.
- [ ] Conoce eventos 5001/5004/5007 y sus límites.
- [ ] Distingue Defender XDR vs Sentinel en KQL.
- [ ] Correlaciona usuario/proceso/ticket de cambio.
- [ ] Valida salud y modo AV tras contención.

**MITRE ATT&CK (hipótesis hasta probarse):** T1562.001 — Impair Defenses: Disable or Modify Tools (hipótesis)

### Documentación oficial y recursos

- https://learn.microsoft.com/en-us/defender-endpoint/prevent-changes-to-security-settings-with-tamper-protection
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceevents-table
- https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-microsoft-defender-antivirus
- https://learn.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/windowsevent
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceregistryevents-table
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-12"></a>
## N2-12 — PowerShell codificado: decodificar para analizar sin ejecutar

**Nivel:** SOC N2 · **Bloque:** Threat Hunting y SIEM

> **Pregunta de entrevista:** Tu SIEM registra un proceso powershell.exe ejecutado con argumentos codificados. ¿Cómo investigarías su contenido y su cadena de ejecución sin ejecutar código sospechoso?

### Escenario, riesgo y objetivo

A las 02:18 un EDR detecta `powershell.exe` con `-EncodedCommand` lanzado desde una tarea programada en WS-42, equipo de finanzas. El parámetro codificado aparece truncado en el SIEM. Dos minutos después hay una conexión HTTPS hacia un destino no inventariado. El propietario indica que su organización usa scripts firmados de mantenimiento, pero no reconoce esa tarea.

**Objetivo operativo:** Determinar exactamente qué comando se intentó ejecutar y bajo qué identidad, con qué proceso padre y efectos observados; analizar el contenido en un canal seguro y aislado sin evaluarlo ni activar payloads, y documentar los límites de comandos truncados o logs inexistentes.

### Hipótesis que debes distinguir

- Script administrativo legítimo empaquetado como Base64 UTF-16LE para ejecución remota.
- Ejecución de PowerShell con carga ofuscada para evadir controles y/o descargar segunda etapa.
- Un instalador o RMM corporativo usa `-EncodedCommand` por compatibilidad de argumentos.
- El string Base64 ha sido truncado por colector/SIEM y decodificarlo parcialmente puede ser engañoso.
- La conexión a Internet pertenece a otro proceso, navegador o servicio: proximidad temporal no es atribución.

### Procedimiento paso a paso

**1 · Preservar y acotar** — Registrar DeviceId, host, cuenta, timestamp, ProcessId + ProcessCreationTime, ReportId y cadena original. Recuperar evento íntegro desde EDR antes de depender de un campo truncado de SIEM; preservar 4688/Sysmon 1, 4104 si estaba habilitado.

**2 · Investigar proceso padre** — Construir árbol: tarea, servicio, intérprete, script host, proceso final; vincular con tiempo de creación. Un PID solo no es identificador estable por su reutilización. Buscar propietario de la tarea y ticket de despliegue.

**3 · Interpretar sintaxis** — Identificar `-EncodedCommand` o abreviaturas dentro de la línea. El argumento de `powershell.exe -EncodedCommand` normalmente es Base64 de texto UTF-16LE; Base64 es codificación, no cifrado.

**4 · Decodificar en análisis sin ejecución** — Sobre copia forense, convertir Base64 a bytes y mostrar UTF-16LE en un entorno sin red y sin evaluación de contenido. No pegar el texto en consola PowerShell para ejecutarlo, no ejecutar Invoke-Expression, no importar módulos de la muestra y evitar analizadores online que filtren secretos.

**5 · Examinar intenciones y límites** — Buscar llamadas a red, manipulación de defensas, credenciales, persistencia, descargas, reflection o ejecución en memoria. No confundir una palabra sospechosa con ejecución real: valida 4104, procesos hijos y efectos observados.

**6 · Correlacionar actividad de red** — Vincular con DeviceNetworkEvents por DeviceId, PID y CreationTime del proceso iniciador, no solo por host y cinco minutos. Revisar HTTPS, DNS, volumen y reputación; si no hay telemetría, declarar atribución no confirmada.

**7 · Determinar alcance** — Buscar mismo SHA1/commandline, cuenta o tarea en otras estaciones, compararlo con scripts firmados aprobados y analizar origen de fichero/archivo/MOTW si aplica.

**8 · Aplicar medidas proporcionales** — Ante ejecución activa de carga dañina, solicitar aislamiento o restricción de la tarea/activo vía EDR/playbook, con preservación de evidencias y comunicación al equipo de operaciones. Evitar simplemente matar PowerShell y cerrar.

**9 · Concluir y mejorar cobertura** — Documentar decodificación sin ejecución, árbol, procesos, destino, cualquier telemetría perdida, responsable de scripts y oportunidades de Script Block Logging/AMSI y política de firma. Anotar datos sensibles en sistema restringido.

### Evidencias y su interpretación

| Evidencia / origen | Qué demuestra y qué NO demuestra |
|---|---|
| DeviceProcessEvents: ProcessCommandLine, FileName, ProcessId, ProcessCreationTime | Comando inicial y argumentos. Algunos sensores truncan o censuran parámetros. |
| DeviceProcessEvents: InitiatingProcess* y AccountName | Atribución de padre, usuario y contexto; validar por PID más hora de creación. |
| PowerShell/Operational 4104: ScriptBlockText, ScriptBlockId | Puede conservar contenido que el intérprete procesó, si Script Block Logging estaba habilitado y recolectado. Cuidado con secretos. |
| Windows Security 4688 / Sysmon ID 1 | Eventos de creación de procesos; línea de comandos en 4688 exige habilitar la opción de auditoría correspondiente. |
| DeviceNetworkEvents: InitiatingProcessId/CreationTime, RemoteUrl, RemoteIP | Permite asociar conexiones a un proceso (cuando sensor registra conexión); conexión no revela automáticamente contenido HTTPS. |
| Tarea/servicio que lo lanzó + firma/hash | Diferencia mantenimiento aprobado de actividad no autorizada; firma no implica inocuidad del script. |

### KQL — consultas de investigación

#### Defender XDR · buscar procesos con argumento codificado

**Prerequisitos y tabla/índice:** DeviceProcessEvents de Defender XDR con telemetría MDE; buscar variantes documentadas del argumento y revisar salida completa.

```kql
DeviceProcessEvents
| where Timestamp >= ago(7d)
| where FileName in~ ("powershell.exe", "pwsh.exe")
| where ProcessCommandLine contains "-EncodedCommand"
    or ProcessCommandLine contains " -enc "
    or ProcessCommandLine contains " -e "
| project Timestamp, DeviceName, DeviceId, AccountName,
          ProcessId, ProcessCreationTime, ProcessCommandLine,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          InitiatingProcessId, InitiatingProcessCreationTime
| order by Timestamp desc
```

**Interpretación:** Da punto de partida para reconstruir línea de ejecución y extraer el texto codificado preservando copia del comando.

**Limitaciones y adaptación:** Patrones no cubren todas las abreviaturas, sintaxis sin espacios, obfuscación, PowerShell embebido ni comandos truncados. `pwsh.exe` tiene versiones/comportamientos propios.

#### Defender XDR · correlación red-proceso por PID y creación

**Prerequisitos y tabla/índice:** MDE DeviceNetworkEvents y un host conocido; reemplazar WS-42 por nombre real tras validar. No usa tablas Sentinel ajenas.

```kql
DeviceNetworkEvents
| where Timestamp >= ago(7d)
| where DeviceName =~ "WS-42"
| where InitiatingProcessFileName in~ ("powershell.exe", "pwsh.exe")
| project Timestamp, DeviceName, InitiatingProcessFileName,
          InitiatingProcessId, InitiatingProcessCreationTime,
          InitiatingProcessCommandLine, RemoteIP, RemoteUrl,
          RemotePort, ActionType
| order by Timestamp desc
```

**Interpretación:** Identifica eventos de red atribuidos a PowerShell; correlacionar con la instancia exacta de proceso.

**Limitaciones y adaptación:** No prueba descarga/exfiltración. Nombre WS-42 didáctico y cobertura depende de sensor/licencia; acción de red puede fallar o estar bloqueada.

### SPL — consultas de investigación

#### Splunk · buscar PowerShell codificado

**Prerequisitos y tabla/índice:** index=edr supone exportación MDE/Sysmon normalizada con process_name, process y parent_process; adaptar extracción.

```spl
index=edr earliest=-7d (process_name="powershell.exe" OR process_name="pwsh.exe")
("-EncodedCommand" OR " -enc " OR " -e ")
| table _time host user process_name process parent_process process_id process_guid
| sort - _time
```

**Interpretación:** Devuelve líneas completas potencialmente codificadas y padres. Inspeccionar evento bruto si el comando está truncado.

**Limitaciones y adaptación:** No hay index ni normalización universales; un string textual no captura todas las variantes. El entorno debe aplicar controles para no exponer secretos de las líneas.

#### Splunk · evento 4104 PowerShell Script Block Logging

**Prerequisitos y tabla/índice:** index=wineventlog ingesta el canal Microsoft-Windows-PowerShell/Operational y campo Message/ScriptBlockText.

```spl
index=wineventlog earliest=-7d (EventCode=4104 OR EventID=4104)
| eval bloque=coalesce(ScriptBlockText,Message)
| table _time host user EventCode ScriptBlockId bloque
| sort - _time
```

**Interpretación:** Busca bloques procesados y los preserva para análisis estático, con restricciones de acceso.

**Limitaciones y adaptación:** 4104 no existe si logging no estaba activo o no se ingesta. Contiene potencialmente secretos; no exportar fuera del repositorio forense.

### Comandos prácticos de observación

**Python 3 en laboratorio sin red — decodificación estática** — Leer cadena Base64 de fichero autorizado y mostrar texto UTF-16LE sin ejecución. No usar servicios web.

```python
# Guardar SOLO la cadena Base64 en /ruta/segura/cadena.b64.
from pathlib import Path
import base64
raw = Path('/ruta/segura/cadena.b64').read_text(encoding='ascii').strip()
texto = base64.b64decode(raw, validate=True).decode('utf-16-le', errors='strict')
print(texto)  # Solo muestra texto; NO lo ejecuta.
```

**PowerShell autorizado — solo lectura** — Consulta de eventos 4104 en el endpoint para cotejar Script Block Logging.

```powershell
Get-WinEvent -FilterHashtable @{
  LogName='Microsoft-Windows-PowerShell/Operational'
  Id=4104
  StartTime=(Get-Date).AddDays(-2)
} -MaxEvents 100 | Select-Object TimeCreated,RecordId,Message
```

**PowerShell autorizado — solo lectura** — Verificar la tarea señalada sin ejecutarla.

```powershell
Get-ScheduledTask | Where-Object TaskName -match 'Update|Maintenance' |
  Select-Object TaskName,TaskPath,State,Actions,Principal
```

### Contención y toma de decisiones

No ejecutar ni «probar» el comando codificado, ni siquiera si parece benigno. Ante ejecución maliciosa comprobada o alta confianza, seguir playbook de aislamiento/contención de endpoint y control de tareas, registrando antes el objeto original y procesos. Determinar si hay credenciales comprometidas, reglas persistentes o tráfico C2; preservar la capacidad de restauración y compartir hallazgos de forma restringida.

### Criterios de escalado

- Comando decodificado contiene intención de descarga/ejecución no autorizada y la telemetría confirma consecuencias.
- Proceso lanzado desde tarea desconocida por identidad privilegiada.
- Secuencia proceso → red con destino sospechoso o actividad lateral.
- Manipulación de EDR, persistencia o otros endpoints con mismo patrón.
- Logs truncados impiden descartar compromiso en activo sensible.

### Falsos positivos probables

- Software de administración remota que pasa parámetros largos como Base64.
- Despliegue Intune/MECM o tarea de mantenimiento con firma y cambio aprobado.
- Scripts de automatización que evitan caracteres especiales por `-EncodedCommand`.
- Datos truncados provocan una decodificación incompleta que parece ofuscada.
- PowerShell usó una URL corporativa de actualización, no infraestructura C2.

### Errores frecuentes

- Copiar/pegar código sospechoso a una consola e introducirlo en Invoke-Expression.
- Tratar Base64 como cifrado o IOC de malware por sí solo.
- Decodificar UTF-8 por defecto en vez de UTF-16LE para `-EncodedCommand` clásico.
- Unir PID sin creation time y atribuir conexiones de otro proceso.
- Confundir 4104 con línea de comandos 4688.
- Subir comando con secretos a un decodificador web público.

### Perspectiva Red Team / Blue Team

La codificación cambia representación de argumentos, no concede privilegios ni invisibilidad automática. Permite transportar comandos complicados u ofuscar patrones simples; detección robusta pivota desde proceso/árbol a bloque de script, AMSI/EDR, cambios en host y red. Un análisis seguro inspecciona bytes/texto estáticamente y nunca valida el comportamiento ejecutándolo en producción.

### Respuesta modelo de entrevista

> Preservaría la línea de comandos completa y reconstruiría el árbol de procesos con DeviceProcessEvents, 4688 o Sysmon 1. Extraería el argumento Base64 y lo decodificaría como UTF-16LE sobre una copia en entorno aislado, sin evaluarlo. Revisaría 4104 si estaba habilitado y correlacionaría proceso por DeviceId, PID y CreationTime con DeviceNetworkEvents. Confirmaría si la tarea pertenece a un cambio autorizado y si hay efectos de red o persistencia. Si observo impacto malicioso, escalaría IR y contendría siguiendo playbook.

### Autoevaluación

- [ ] Distingue Base64 de cifrado y no ejecuta el contenido.
- [ ] Domina Windows PowerShell -EncodedCommand y UTF-16LE.
- [ ] Recupera proceso padre y posible tarea programada.
- [ ] Usa 4104 condicionado a cobertura real.
- [ ] No une eventos solo por PID sin CreationTime.
- [ ] Verifica ejecución/evidencias y clasifica falsos positivos.

**MITRE ATT&CK (hipótesis hasta probarse):** T1059.001 — PowerShell (si hubo ejecución), T1027 — Obfuscated Files or Information (si existe ofuscación real)

### Documentación oficial y recursos

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging?view=powershell-5.1
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-best-practices
- https://docs.splunk.com/Documentation/CIM/6.1.0/User/Endpoint
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-13"></a>
## N2-13 — explorer.exe con red inusual: investigar posible inyección sin sobreatribuir

**Nivel:** SOC N2 · **Bloque:** Threat Hunting y SIEM

> **Pregunta de entrevista:** Detectas que un proceso legítimo, como explorer.exe, realiza conexiones de red inusuales. ¿Cómo investigarías una posible inyección de procesos?

### Escenario, riesgo y objetivo

En WS-17 el EDR indica que `explorer.exe` inició una conexión TLS a una IP no habitual a las 04:22. El ejecutable se encuentra en `C:\Windows\explorer.exe` y está firmado; un minuto antes se detectó un proceso poco frecuente lanzado por el usuario. Existen registros MDE de red/procesos y Sysmon parcialmente implantado. También se usan complementos de Explorer, WebDAV y recursos compartidos, por lo que el tráfico por sí solo no demuestra inyección.

**Objetivo operativo:** Determinar si la instancia de explorer.exe es auténtica, si tuvo actividad de red legítima y si existe alguna evidencia adicional de acceso/escritura a memoria, hilos remotos, módulos no autorizados o comportamiento posterior compatible con una técnica de inyección. Diferenciar hipótesis, indicio y confirmación.

### Hipótesis que debes distinguir

- Inyección de código en un proceso legítimo (T1055), por ejemplo hilo remoto o alteración de memoria, con posteriores conexiones de red.
- Extensión de Explorer, vista previa de archivos, carpeta de red, WebDAV, sincronización o software DLP que comunica por Internet legítimamente.
- Ejecutable falso que usa el nombre explorer.exe desde directorio no estándar o con firma inválida.
- Conexión realmente iniciada por otro proceso al que se atribuyó de forma incorrecta por reutilización de PID o correlación solo temporal.
- Software EDR/administrativo legítimo realiza inspección o accesos cross-process que se parecen a técnicas de inyección.

### Procedimiento paso a paso

**1 · Confirmar telemetría y alcance** — Establecer equipo, usuario, conexión saliente, destino, ActionType, PID del proceso iniciador y creation time; verificar si evento indica intento/conexión permitida y si hay más dispositivos con el mismo patrón. Registrar hora exacta y zona horaria.

**2 · Identificar el binario** — Corroborar ruta, firma del ejecutable usando metadatos de certificado, hash SHA1/SHA256 (según sensor), versión y línea base corporativa. El nombre y una firma válida no prueban que la memoria del proceso no esté comprometida.

**3 · Construir árbol y vida del proceso** — Revisar DeviceProcessEvents y origen de explorer.exe, comandos, usuario, logon, proceso padre, integridad y hora de creación; correlacionar por DeviceId más PID y creation time (o ProcessUniqueId si disponible).

**4 · Analizar ventana anterior** — Pivotar a eventos de proceso del host justo antes del evento: instancias extrañas de PowerShell, script interpreters, archivos en directorios temporales, procesos inesperados y cambios de configuración. No asumir causalidad por coincidencia.

**5 · Buscar evidencias específicas de inyección** — Si Sysmon habilitado y configurado, consultar evento 8 CreateRemoteThread y 10 ProcessAccess contra la instancia sospechosa; revisar origen, destino, accesos, CallTrace/StartAddress cuando estén presentes. Sysmon 8/10 por sí solos tampoco demuestran ejecución maliciosa.

**6 · Inspección forense bajo autoridad** — Consultar timeline/árbol EDR y, si el caso justifica y el equipo IR lo autoriza, solicitar adquisición forense de memoria volátil siguiendo herramientas/hashes aprobados. Un volcado del proceso afecta privacidad y puede contener secretos: custodia estricta.

**7 · Correlación con red y alcance** — Investigar DNS/SNI, proxy, netflows, IP, puertos, bytes, periodicidad y otros hosts conectados; distinguir Microsoft/CDN legítimos de destinos anómalos. Relacionar únicamente conexiones verdaderamente iniciadas por la instancia señalada.

**8 · Contención informada** — Si se detecta técnica de inyección con comunicaciones C2 o un payload activo, activar IR, aislar/restringir el host si está autorizado, proteger credenciales y preservar artefactos. No matar explorer.exe como única solución ni reconstruir sin evidencias.

**9 · Conclusión y mitigación** — Documentar observaciones, nivel de confianza, huecos de Sysmon y pruebas de sistema. Reforzar reglas de ASR, control de aplicaciones, EDR y correlación proceso-red; definir falsos positivos de extensiones aprobadas.

### Evidencias y su interpretación

| Evidencia / origen | Qué demuestra y qué NO demuestra |
|---|---|
| DeviceNetworkEvents: InitiatingProcessFileName, InitiatingProcessId, InitiatingProcessCreationTime | Atribuye tráfico según sensor a la instancia concreta de proceso; evita unión solamente por PID. |
| DeviceProcessEvents: FileName, FolderPath, SHA1, ProcessCreationTime, InitiatingProcess* | Crea línea temporal de proceso y posible origen; la firma del binario no atestigua integridad de memoria. |
| Sysmon 8: SourceImage, TargetImage, StartAddress, StartModule | Creación observada de hilo remoto; depende de config/sensor y puede tener explicación legítima. |
| Sysmon 10: SourceImage, TargetImage, GrantedAccess | Apertura/acceso a otro proceso; no demuestra escritura/inyección ni ejecución de código por sí sola. |
| Sysmon 7: carga de módulos | En caso de habilitarlo, módulos inesperados pueden apoyar hipótesis; volumen alto y evento deshabilitado por defecto. |
| EDR alert/process tree + memoria adquirida con autorización | Puede aportar indicios fuertes de regiones ejecutables, hilos y módulos anómalos que una conexión sola no revela. |

### KQL — consultas de investigación

#### Defender XDR · red de explorer.exe por instancia real

**Prerequisitos y tabla/índice:** Defender XDR con MDE DeviceNetworkEvents; tabla documentada con iniciador y tiempo de creación.

```kql
DeviceNetworkEvents
| where Timestamp >= ago(7d)
| where InitiatingProcessFileName =~ "explorer.exe"
| summarize Eventos=count(), Destinos=dcount(RemoteIP),
            IPs=make_set(RemoteIP,20), Puertos=make_set(RemotePort,10),
            Primera=min(Timestamp), Ultima=max(Timestamp)
    by DeviceId, DeviceName, InitiatingProcessId,
       InitiatingProcessCreationTime, InitiatingProcessFolderPath
| order by Destinos desc
```

**Interpretación:** Prioriza instancias explorer.exe inusualmente comunicativas y sus destinos; ampliar con eventos crudos para profundizar.

**Limitaciones y adaptación:** No observa inyección de memoria ni interpreta SSL; destino remoto desconocido no implica C2. El ProcessId puede reciclarse: se añadió la hora.

#### Sentinel / Sysmon · acceso y thread a explorer.exe

**Prerequisitos y tabla/índice:** WindowsEvent recolecta Microsoft-Windows-Sysmon/Operational, Sysmon ID 8 y 10 habilitados por configuración.

```kql
WindowsEvent
| where TimeGenerated >= ago(7d)
| where Provider =~ "Microsoft-Windows-Sysmon"
| where EventID in (8, 10)
| extend SourceImage=tostring(EventData.SourceImage),
         TargetImage=tostring(EventData.TargetImage),
         SourceGuid=tostring(EventData.SourceProcessGUID),
         TargetGuid=tostring(EventData.TargetProcessGUID)
| where TargetImage endswith @"\explorer.exe"
| project TimeGenerated, Computer, EventID,
          SourceImage, TargetImage, SourceGuid, TargetGuid, EventData
| order by TimeGenerated desc
```

**Interpretación:** Busca indicios orientativos de interacción entre procesos con destino explorer.exe, con GUID cuando disponible.

**Limitaciones y adaptación:** Sysmon no está instalado/configurado por defecto; GUID de algunos campos puede variar. Eventos 8/10 no certifican inyección y hay herramientas legítimas que los disparan.

### SPL — consultas de investigación

#### Splunk · network telemetry atribuida a explorer.exe

**Prerequisitos y tabla/índice:** index=edr contiene network events con src_process_name, src_process_guid o src_process_id, dest_ip; ajustar normalización.

```spl
index=edr earliest=-7d src_process_name="explorer.exe"
| eval instancia=coalesce(src_process_guid,src_process_id)
| stats count as eventos dc(dest_ip) as destinos values(dest_ip) as ips
    by host instancia src_process_name
| sort - destinos
```

**Interpretación:** Identifica dispositivos e instancias con actividad de red atípica; pivotar al proceso exacto.

**Limitaciones y adaptación:** No existe index=edr universal ni campos estándar con estos nombres. Un src_process_id sin fecha es débil por reuso de PID.

#### Splunk · Sysmon 8/10 hacia explorer.exe

**Prerequisitos y tabla/índice:** index=sysmon con Sysmon Operational y campos EventCode, TargetImage, SourceImage.

```spl
index=sysmon earliest=-7d (EventCode=8 OR EventCode=10)
| search TargetImage="*\\explorer.exe"
| table _time host EventCode SourceImage TargetImage
        SourceProcessGUID TargetProcessGUID GrantedAccess StartAddress
| sort - _time
```

**Interpretación:** Lista interacciones entre procesos para revisar causalidad contra línea temporal de red.

**Limitaciones y adaptación:** Los GUID pueden extraerse con variantes de mayúsculas; Sysmon 8/10 requieren configuración. No prueba shellcode ejecutado.

### Comandos prácticos de observación

**PowerShell autorizado — solo lectura** — Verificar ruta y metadatos del ejecutable, sin inspección invasiva ni ejecución de muestra.

```powershell
$archivo = "$env:WINDIR\explorer.exe"
Get-Item -LiteralPath $archivo | Select-Object FullName,Length,LastWriteTime
Get-AuthenticodeSignature -LiteralPath $archivo |
  Select-Object Status,SignerCertificate
```

**PowerShell autorizado — solo lectura** — Corroborar las instancias explorer.exe y sus rutas.

```powershell
Get-CimInstance Win32_Process -Filter "Name='explorer.exe'" |
  Select-Object ProcessId,ParentProcessId,CreationDate,ExecutablePath,CommandLine
```

**PowerShell autorizado — solo lectura** — Consultar eventos Sysmon 8/10 relevantes en host habilitado.

```powershell
Get-WinEvent -FilterHashtable @{
  LogName='Microsoft-Windows-Sysmon/Operational'
  Id=8,10
  StartTime=(Get-Date).AddDays(-1)
} -MaxEvents 200 | Where-Object Message -match 'explorer.exe' |
  Select-Object TimeCreated,Id,RecordId,Message
```

### Contención y toma de decisiones

No terminar explorer.exe por una conexión sospechosa aislada. Si hay evidencia de inyección más acciones maliciosas, priorizar aislamiento del endpoint o bloqueo del flujo mediante respuesta EDR con consentimiento/autoridad según criticidad; preservar timeline, artefactos, muestras y memoria solo por equipo forense. Restablecer confianza mediante reparación/reimagen aprobada después del análisis de persistencia y credenciales. Una firma válida no legitima necesariamente código ejecutado dentro del proceso.

### Criterios de escalado

- Correlación entre Sysmon 8/10, árbol sospechoso y tráfico red con la misma instancia.
- Alertas EDR de inyección, memory tampering o ejecución de código en proceso legítimo.
- Procesos padres improbables, módulo extraño o binario que suplanta explorer.exe.
- Red a destino de alto riesgo con persistencia o repetición en varios hosts.
- Privilegios elevados/sesiones administrativas comprometidas.

### Falsos positivos probables

- Explorer accede a ubicaciones WebDAV, iconos o contenido remoto.
- Complementos de terceros firmados o sincronizadores autorizados.
- Software DLP, accesibilidad, EDR o inspección remota accede legítimamente a procesos.
- Proxy/CDE o infraestructura CDN no inventariada.
- Se atribuyó tráfico usando PID reciclado y no el inicio real del proceso.

### Errores frecuentes

- Dar por probada inyección únicamente por una conexión de explorer.exe.
- Confundir proceso firmado con memoria garantizada no manipulada.
- No confirmar PID+creation time y atribuir eventos de otro proceso.
- Interpretar Sysmon Event 10 como ejecución de shellcode por defecto.
- Volcar memoria de usuarios sin autorización/cadena de custodia.
- Matar explorer.exe o borrar binarios antes de preservar evidencia.

### Perspectiva Red Team / Blue Team

Las técnicas de inyección pueden usar un contenedor de procesos confiable para ejecutar código sin iniciar un binario sospechoso visible, pero dejan potenciales rastros en llamadas cross-process, hilos, memoria y conducta anómala. Detectar una sola señal no basta; correlación de origen, objetivo, memoria y red eleva confianza. Existen muchas APIs y herramientas legítimas de integración que generan eventos parecidos.

### Respuesta modelo de entrevista

> Primero confirmaría que el flujo salió de la instancia real de explorer.exe usando DeviceId, PID y ProcessCreationTime. Validaría ruta, firma, árbol y proceso padre. Consultaría Sysmon 8/10 si está habilitado para localizar acceso e hilos remotos, interpretando sus limitaciones, y pivotaría a eventos de red, DNS y módulos. Si apareciera una secuencia coherente de proceso sospechoso, interacción con explorer y comunicación externa, escalaría a IR, solicitaría contención y posible memoria forense bajo autorización. No concluiría inyección solo por la conexión.

### Autoevaluación

- [ ] Distingue un indicador de red de evidencia de inyección.
- [ ] Identifica proceso concreto con tiempo de creación.
- [ ] Conoce Sysmon 8/10 y su ambigüedad.
- [ ] Analiza firma, ruta y posibilidad de suplantación.
- [ ] Conecta causa sospechosa y efecto por timeline.
- [ ] Sabe cuándo solicitar memoria/forense y contener.

**MITRE ATT&CK (hipótesis hasta probarse):** T1055 — Process Injection (hipótesis, no conclusión), T1071.001 — Web Protocols (si se demuestra comunicación con C2)

### Documentación oficial y recursos

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-best-practices
- https://docs.splunk.com/Documentation/CIM/6.1.0/User/Endpoint
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-14"></a>
## N2-14 — Logs borrados: reconstrucción de timeline con fuentes independientes

**Nivel:** SOC N2 · **Bloque:** Threat Hunting y SIEM

> **Pregunta de entrevista:** Un atacante ha eliminado determinados logs de Windows. ¿Qué fuentes alternativas utilizarías para reconstruir la línea temporal?

### Escenario, riesgo y objetivo

A las 05:41 el SIEM recibe un evento Security 1102 procedente de DC02; faltan registros locales anteriores a esa hora. Los servicios de ingesta enviaban parte de los datos a Sentinel y un gestor de logs remoto. El EDR registró procesos en la ventana, y firewall, DNS y AD pueden tener copias parciales de la actividad. La hipótesis de que un intruso borró logs aún requiere atribución; el borrado pudo ser administrativo.

**Objetivo operativo:** Preservar las fuentes que sobrevivieron, atribuir correctamente el evento 1102, reconstruir una línea temporal multinivel y expresar con claridad los huecos que impiden confirmar o descartar actividades concretas; evitar crear nuevas escrituras destructivas en la máquina.

### Hipótesis que debes distinguir

- T1070.001: un actor borra registros para dificultar análisis tras obtener permisos suficientes.
- Administrador o herramienta de mantenimiento limpió Security log en una operación no debidamente coordinada.
- Fallo/retención/rotación, pérdida de eventos por ingestión o collector, que parece «borrado» sin confirmación de acción.
- El 1102 indica un borrado real de Security, pero no prueba qué sesiones/eventos existían antes ni que se borraron del SIEM remoto.
- El atacante manipula también cobertura EDR o pipeline, por lo que ausencia de datos debe analizarse como limitación, no como prueba negativa.

### Procedimiento paso a paso

**1 · Preservar evidencia disponible** — Congelar exportaciones de SIEM/EDR/Sysmon, tiempo de alerta, host, EventRecordId, cuenta SID y el evento 1102 completo. Iniciar cadena de custodia; pedir snapshot forense aprobado y evitar ejecutar herramientas que alteren datos innecesariamente.

**2 · Interpretar correctamente el evento** — Confirmar canal Security, proveedor Microsoft-Windows-Eventlog y campos del sujeto de 1102. Consultar al dueño del sistema, ticket y posible mantenimiento. Un 1102 no demuestra intrusión, pero debe investigarse.

**3 · Distinguir dónde falta la evidencia** — Separar ausencia en equipo local, ausencia en forwarder y ausencia en SIEM. Analizar latencia, retención, colas, permisos, disco, reenvío de Windows Event Forwarding e interrupciones del agente.

**4 · Recuperar telemetría ya enviada** — Consultar eventos históricos en Sentinel/Log Analytics y otro colector previo al borrado; la eliminación del log local no elimina automáticamente copias ya transferidas. Evaluar disponibilidad en backup y retención central.

**5 · Correlacionar red e identidad** — Traer VPN, proxy, DNS, firewall, DHCP, NetFlow, eventos de AD/DC alternativos, Kerberos, logons en los destinos, cambios de cuenta y movimientos laterales. Documentar la precisión temporal y NTP.

**6 · Pivotar a endpoint** — Investigar DeviceProcessEvents, DeviceFileEvents, DeviceRegistryEvents, EDR timeline, Sysmon en collector, tareas/servicios, y actividades del usuario. Prefetch, Amcache, USN, SRUM o Shimcache son fuentes forenses condicionadas a configuración/Windows y su interpretación requiere especialistas.

**7 · Construir timeline con trazabilidad** — Normalizar timestamps en UTC y mantener campo de origen, zona horaria, reloj de cada sensor, usuario/SID, correlación por DeviceId y EventRecordId cuando corresponda. Marcar «observado», «inferido» y «desconocido».

**8 · Contención y búsqueda de alcance** — Si hay actividad maliciosa confirmada, contener dispositivos/cuentas según IR, no solo «restaurar logging». Identificar otros hosts con 1102/104, fallas de EDR o gaps simultáneos, y comprobar si hay persistencia.

**9 · Recuperación y lecciones** — Restaurar políticas de auditoría/WEF/EDR, comprobar alertas de huecos de ingesta y retención suficiente; redactar alcance máximo sustentado, impacto e incertidumbres. No afirmar que se reconstruyó todo si existen huecos.

### Evidencias y su interpretación

| Evidencia / origen | Qué demuestra y qué NO demuestra |
|---|---|
| Windows Security ID 1102 | Se borró Security audit log y se registró sujeto (SID, nombre y LogonId); evento debe validarse en canal correcto. |
| System EventLog ID 104 | Indica limpieza de un log (especificar canal); no equipararlo automáticamente a 1102 de Security. |
| Sentinel/WEF/collector remoto | Copia central de eventos anteriores que puede permanecer tras borrado local, sujeto a retención y errores de envío. |
| Defender XDR: DeviceProcessEvents y otros artefactos EDR | Telemetría paralela a Event Log; puede tener pérdidas y ventanas de retención distintas. |
| Proxy, DNS, firewall, VPN, DHCP | Conexiones, destinos, sesiones, traducciones NAT y atribución de IP que ayudan a reconstruir acceso/movimiento. |
| Prefetch, Amcache, USN, SRUM, filesystem timestamps | Pistas de ejecución/artefactos que requieren colección e interpretación forense; ausencias no prueban que algo no se ejecutó. |

### KQL — consultas de investigación

#### Sentinel · borrado de Security 1102 y huecos cercanos

**Prerequisitos y tabla/índice:** WindowsEvent recoge Security 1102 y 4688. 4688 es opcional y puede carecer de command line; se busca contexto temporal.

```kql
let borrados = WindowsEvent
| where TimeGenerated >= ago(7d)
| where EventID == 1102
| project Host=Computer, HoraBorrado=TimeGenerated,
          Actor=tostring(EventData.SubjectUserName),
          Record=tostring(EventRecordId);
borrados
| order by HoraBorrado desc
```

**Interpretación:** Recupera host, hora y actor del borrado si EventData lo contiene. Usar esa hora para pivotar a otras tablas.

**Limitaciones y adaptación:** EventData puede no tener SubjectUserName según parseo; inspeccionar XML real. No atribuye intención y solo ve 1102 efectivamente ingestados.

#### Defender XDR · actividad de procesos alrededor del borrado

**Prerequisitos y tabla/índice:** Defender Advanced Hunting, reemplazar host/horas didácticos. Buscar eventos del sensor central, aunque Security local falte.

```kql
DeviceProcessEvents
| where Timestamp between (ago(2d) .. now())
| where DeviceName =~ "DC02"
| project Timestamp, DeviceName, AccountName, FileName,
          FolderPath, ProcessCommandLine, ProcessId, ProcessCreationTime,
          InitiatingProcessFileName, InitiatingProcessCommandLine
| order by Timestamp asc
```

**Interpretación:** Reconstruye secuencia de ejecución que puede correlacionarse con la ventana de borrado y demás fuentes.

**Limitaciones y adaptación:** La ventana y DC02 son didácticos. MDE puede no estar presente en DC o haber perdido cobertura; datos EDR no sustituyen todo Security.

### SPL — consultas de investigación

#### Splunk · eventos 1102/104 capturados remotamente

**Prerequisitos y tabla/índice:** index=wineventlog con WindowsEvent incluidas fuentes Security y System, EventCode normalizado.

```spl
index=wineventlog earliest=-7d (EventCode=1102 OR EventCode=104)
| eval registro=coalesce(Channel,LogName,source)
| table _time host EventCode registro SubjectUserName user Message
| sort - _time
```

**Interpretación:** Localiza borrados y permite diferenciar 1102/104 por canal/proveedor en el colector central.

**Limitaciones y adaptación:** Puede haber otros IDs=104 de proveedores ajenos: filtrar proveedor real. La ausencia de registro en Splunk no prueba ausencia de borrado.

#### Splunk · detectar huecos de ingesta por host

**Prerequisitos y tabla/índice:** index=wineventlog representa logs de seguridad Windows y hay baseline de eventos de cada host.

```spl
index=wineventlog earliest=-48h
| bin _time span=1h
| stats count as eventos by host _time
| eventstats avg(eventos) as media_por_host by host
| eval ratio=round(eventos/max(media_por_host,1),2)
| where ratio<0.15
| table _time host eventos media_por_host ratio
| sort _time
```

**Interpretación:** Detecta ventanas observadas con caída relativa de volumen por host; contrastar con uptime y calendario.

**Limitaciones y adaptación:** Sin registros en una hora no existe fila y esa hora no aparece: generar serie temporal completa por host para detectar huecos absolutos. Baseline de 48h es simplificada.

### Comandos prácticos de observación

**PowerShell autorizado — solo lectura** — Consultar y preservar metadata de 1102 local si todavía está disponible.

```powershell
Get-WinEvent -FilterHashtable @{
  LogName='Security'
  Id=1102
  StartTime=(Get-Date).AddDays(-7)
} -MaxEvents 100 | Select-Object TimeCreated,Id,RecordId,Message
```

**PowerShell autorizado — solo lectura** — Verificar estado actual de canal Security, tamaño máximo y política de retención.

```powershell
Get-WinEvent -ListLog Security |
  Select-Object LogName,IsEnabled,RecordCount,MaximumSizeInBytes,LogMode
```

**PowerShell autorizado — solo lectura** — Leer algunos eventos de System cercanos a vaciados de otros canales.

```powershell
Get-WinEvent -FilterHashtable @{
  LogName='System'
  Id=104
  StartTime=(Get-Date).AddDays(-7)
} -MaxEvents 100 | Select-Object TimeCreated,ProviderName,Id,Message
```

### Contención y toma de decisiones

La primera acción no es limpiar más registros ni reiniciar. Preservar telemetría central, imagen/artefactos autorizados y cadena de custodia; decidir aislamiento o control de identidades según indicios de ataque activo. Comprobar que la captación continúa y rotar/corregir accesos solo siguiendo plan de IR. El dueño del sistema debe aprobar cambios con impacto en autenticación y producción.

### Criterios de escalado

- Borrado 1102 no autorizado en DC, jump host, servidor privilegiado o endpoint crítico.
- Correlación con logons privilegiados, herramientas extrañas y movimiento lateral.
- Borrados simultáneos en varios hosts o caída deliberada de EDR/colector.
- Evidencia de persistencia/ransomware/exfiltración y pérdida de visibilidad.
- Retención central insuficiente o backup/logs manipulados que comprometen reconstrucción.

### Falsos positivos probables

- Actividad de troubleshooting/documentación que limpió un canal con aprobación.
- Recreación de VM, reinstalación o restauración de imagen sin preservar logs.
- Rotación del log por tamaño y retención confundida con borrado manual.
- Fallo de forwarding/red/SIEM que aparenta hueco local.
- Diferencia UTC/local o reloj inestable que parece salto cronológico.

### Errores frecuentes

- Decir que 1102 demuestra autoría maliciosa.
- Asumir que borrar local elimina la copia SIEM ya enviada.
- Confundir retención/fallo de ingesta con manipulación forense.
- Generar nueva actividad invasiva antes de preservar artefactos.
- Afirmar timeline completa sin advertir lagunas de telemetría.
- Ignorar correlación de hora, NAT, identidad y eventos de hosts destino.

### Perspectiva Red Team / Blue Team

El borrado de logs reduce visibilidad de un canal, no borra necesariamente las múltiples copias o las telemetrías independientes. Un atacante puede buscar eludir auditoría antes o después de otras acciones, mientras los defensores pueden reconstruir parte del recorrido con EDR, controladores de dominio, proxy, netflows y artefactos forenses. La prioridad del análisis es preservar y acotar qué puede afirmarse realmente.

### Respuesta modelo de entrevista

> Primero validaría el 1102, host, canal, sujeto y hora UTC, y comprobaría si existe mantenimiento aprobado. Preservaría los registros del SIEM/WEF que ya fueron enviados, porque borrar Security local no elimina esas copias. Después construiría una timeline cruzando EDR, Sysmon, firewall, DNS, proxy, identidad y hosts destino, etiquetando cada elemento como observado o inferido. Si detecto actividad activa de intrusión, contengo conforme a IR. Documentaría cualquier hueco y mejoraría monitorización de borrados y pérdida de ingesta.

### Autoevaluación

- [ ] Sabe interpretar Security 1102 y System 104.
- [ ] Entiende copias centrales y límites de retención.
- [ ] Recupera evidencia multi-fuente y cadena de custodia.
- [ ] Normaliza tiempos y correlaciona identidad/host.
- [ ] No equipara ausencia de logs con ausencia de ataque.
- [ ] Plantea cierre con incertidumbres explícitas.

**MITRE ATT&CK (hipótesis hasta probarse):** T1070.001 — Clear Windows Event Logs (si borrado intencionado)

### Documentación oficial y recursos

- https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-1102
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/windowsevent
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

<a id="n2-15"></a>
## N2-15 — DNS tunneling con Splunk: búsqueda, triage y reducción de falsos positivos

**Nivel:** SOC N2 · **Bloque:** Threat Hunting y SIEM

> **Pregunta de entrevista:** Quieres detectar posibles comunicaciones C2 mediante DNS tunneling utilizando Splunk. ¿Qué características buscarías y cómo reducirías los falsos positivos?

### Escenario, riesgo y objetivo

Un equipo de laboratorio informa de 1.900 consultas DNS en 15 minutos desde WS-58 a subdominios muy largos de `tunnel.example.com` (dominio de ejemplo no IOC real). La mitad generan NXDOMAIN, aparecen consultas TXT y existen solicitudes a un servidor recursivo corporativo. Hay un servicio de observabilidad que usa etiquetas largas y una actualización de software reciente. La misión es distinguir telemetría esperada de canal oculto, comprobar flujo real y definir una búsqueda SPL mantenible.

**Objetivo operativo:** Encontrar patrones compatibles con DNS tunneling —longitud/estructura de etiquetas, cardinalidad, ritmo, tipo de registro, respuestas, regularidad, servidores y volumen— mediante DNS logs normalizados; comparar con baseline, atribuir origen/proceso y confirmar posible salida de datos por dominios antes de aplicar bloqueos.

### Hipótesis que debes distinguir

- Datos codificados en labels DNS para comunicarse o extraer pequeños fragmentos vía dominio controlado (T1071.004).
- Telemetry/observability, verificación ACME, DKIM, CDNs, anti-tracking o servicios de actualización que usan subdominios largos o efímeros.
- DGA produce muchos nombres y NXDOMAIN, parecido al tunneling sin que necesariamente haya transferencia de datos.
- Error de configuración DNS (search suffix) crea gran cantidad de consultas fallidas con cadenas largas.
- La telemetría solo muestra el resolver, no cliente individual por NAT/caché, por lo que atribución requiere logs cliente o resolver con IP origen.

### Procedimiento paso a paso

**1 · Validar datasource DNS** — Verificar index/sourcetype, campos `src`, `query`, `query_type`, `reply_code` en Splunk, tiempo UTC, porcentaje de captura, recursión, caché y si hay visibilidad de IP cliente. Si solo existe firewall 53/UDP sin QNAME no puedes evaluar longitud de labels.

**2 · Construir línea base** — Agrupar por equipo y zona consultada: queries totales, nombres únicos, máximo/mediana de longitud, respuesta NXDOMAIN, proporción TXT y distribución horaria en 7–30 días. Los umbrales de ejemplo son didácticos.

**3 · Filtrar candidatos por etiquetas** — Extraer subdominios largos, altos recuentos de nombres únicos, una zona dominante, primeras etiquetas extensas y diversidad de cadenas. Comparar dominios registrados con listas de permitidos/tickets y servicios autorizados.

**4 · Analizar ritmo y volumen** — Observar si hay ráfagas programadas o comunicación bidireccional, consultas periódicas, picos al ejecutarse scripts, consultas TXT, respuestas con tamaños altos y payloads encadenados. Alta entropía es un indicador adicional, no prueba autónoma.

**5 · Verificar respuestas y fallos** — Correlacionar NXDOMAIN, respuestas positivas y tamaño de respuesta; NXDOMAIN alto puede indicar DGA o error de DNS, no asegura túnel. Comparar con tráfico DNS de hosts equivalentes.

**6 · Atribuir al endpoint** — Pivotar desde IP fuente a DHCP, VPN, host y proceso DNS cuando sensor lo ofrezca, aplicaciones instaladas, tareas y conexiones directas a resolvers externos. Una IP de recursor central no identifica por sí sola estación víctima.

**7 · Investigación de un dominio** — Para `tunnel.example.com` (placeholder), revisar registros crudos de subdominios, timestamps, autoritativos, reputación/historial y otros clientes; no enviar a herramientas públicas posibles datos sensibles codificados.

**8 · Decisión y contención** — Si se demuestra canal no autorizado o hay señales concurrentes de malware/exfiltración, priorizar contención host/resolver y bloqueo del dominio bajo playbook, verificando que no use DoH/DoT o un resolver alternativo para reanudar. No bloquear `*.example.com` en producción como demostración.

**9 · Afinar detección y documentación** — Definir baseline por perfil de endpoint, listas permitidas con caducidad, reglas por zona conocida, exclusiones de software legitimado y alertas de cobertura; registrar qué logs permiten atribuir bytes extraídos, que habitualmente DNS por sí solo no cuantifica.

### Evidencias y su interpretación

| Evidencia / origen | Qué demuestra y qué NO demuestra |
|---|---|
| Splunk CIM Network Resolution (DNS): src, query, query_type, reply_code | Necesita normalización; consultas que solo buscan query no ven trama codificada si no se ingesta QNAME. |
| Longitud de QNAME y primera etiqueta, nombres únicos por zona | Valores anómalos pueden expresar datos, DGA o CDN; combinar con baseline y otras señales. |
| Recuentos TXT, NXDOMAIN y respuestas | Características útiles pero inespecíficas; DGA/mala configuración suelen elevar NXDOMAIN. |
| Host + proceso EDR y registros de DNS client | Separa uso normal del navegador/agente y script/servicio desconocido. |
| Firewall/NDR/NetFlow a UDP/TCP 53, DoH/DoT | Relaciona fuente con resolver y posibles rutas alternativas; cifrado de DoH oculta QNAME a network-only. |
| Azure DNSQueryLogs: SourceIpAddress, QueryName, ResponseCode | Opción específica de Azure DNS Resolver Policies, no una tabla genérica disponible en todos los Sentinel. |

### KQL — consultas de investigación

#### Sentinel / Azure DNS Resolver · muchas consultas únicas y NXDOMAIN

**Prerequisitos y tabla/índice:** Azure Monitor DNSQueryLogs poblada por Azure DNS resolver policies. Usa columnas SourceIpAddress, QueryName y ResponseCode (entero).

```kql
DNSQueryLogs
| where TimeGenerated >= ago(1d)
| where isnotempty(QueryName)
| extend Nombre=tolower(trim_end(@"\.$", QueryName)),
         PrimeraEtiqueta=extract(@"^([^.]+)", 1, QueryName)
| summarize Consultas=count(), NombresUnicos=dcount(Nombre),
            NXDOMAIN=countif(ResponseCode == 3),
            LongitudMedia=round(avg(strlen(Nombre)),1),
            PrimeraEtiquetaMax=max(strlen(PrimeraEtiqueta))
    by SourceIpAddress, bin(TimeGenerated,15m)
| where Consultas >= 100 and NombresUnicos >= 60
| extend PorcentajeNX=round(100.0*NXDOMAIN/Consultas,1)
| order by NombresUnicos desc
```

**Interpretación:** Busca alto ritmo y diversidad por cliente; inspeccionar dominios/etiquetas y compararlos con baseline.

**Limitaciones y adaptación:** 100, 60 y 15m son ejemplos. El resolver puede agrupar origen y el caché suprimir consultas. DNSQueryLogs requiere recurso específico; no confundir con DnsEvents.

#### Sentinel / Azure DNS Resolver · foco zona sospechosa

**Prerequisitos y tabla/índice:** DNSQueryLogs disponible; reemplazar la zona didáctica por dominio observado y autorizado a investigar.

```kql
DNSQueryLogs
| where TimeGenerated >= ago(7d)
| extend Nombre=tolower(trim_end(@"\.$", QueryName))
| where Nombre endswith ".tunnel.example.com"
    or Nombre == "tunnel.example.com"
| summarize Total=count(), Unicos=dcount(Nombre),
            Codigos=make_set(ResponseCode,10),
            Tipos=make_set(QueryType,10),
            Muestras=make_set(Nombre,5)
    by SourceIpAddress, bin(TimeGenerated,1h)
| order by Total desc
```

**Interpretación:** Permite investigar clientes, tipos de registro y nombres contra una zona candidata.

**Limitaciones y adaptación:** tunnel.example.com es ejemplo RFC, no indicador real. La subzona no incluye subdominios con otra terminación y requiere validar fuente/resolver.

### SPL — consultas de investigación

#### Splunk · candidatos por longitud, unicidad y NXDOMAIN

**Prerequisitos y tabla/índice:** index=dns contiene logs de resolución con src, query, reply_code, query_type; estructura CIM o TA equivalente.

```spl
index=dns earliest=-24h
| eval q=lower(rtrim(query,"."))
| eval etiqueta=mvindex(split(q,"."),0)
| eval qlen=len(q), llen=len(etiqueta)
| bin _time span=15m
| stats count as consultas dc(q) as unicos max(llen) as max_label
    avg(qlen) as media_qname count(eval(reply_code="NXDOMAIN" OR reply_code="3")) as nxdomain
    by src _time
| eval pct_nxdomain=round(100*nxdomain/max(consultas,1),1)
| where consultas>=100 AND unicos>=60 AND max_label>=40
| sort - unicos
```

**Interpretación:** Busca grupos de alta cardinalidad, etiquetas largas y fracción de consultas inexistentes.

**Limitaciones y adaptación:** rtrim elimina caracteres del conjunto final: aquí solo punto. Valores/normalización de reply_code varían. No mide entropía ni demuestra exfiltración. Cambiar thresholds por baseline.

#### Splunk · secuencia cruda por una subzona concreta

**Prerequisitos y tabla/índice:** index=dns contiene QNAME de cliente y el dominio candidato ha sido contrastado; túnel ficticio para práctica.

```spl
index=dns earliest=-24h
| eval q=lower(rtrim(query,"."))
| where q="tunnel.example.com" OR like(q,"%.tunnel.example.com")
| stats count as consultas dc(q) as unicos values(query_type) as tipos
    values(reply_code) as respuestas min(_time) as primero max(_time) as ultimo
    by src
| convert ctime(primero) ctime(ultimo)
| sort - consultas
```

**Interpretación:** Evalúa volumen por origen y zona, diversidad de nombres y tipos/errores para investigar.

**Limitaciones y adaptación:** No reconstruye payload ni prueba extracción. No conviene volcar todos los QNAME potencialmente sensibles en informes fuera de la plataforma.

### Comandos prácticos de observación

**Windows PowerShell — observación local** — Listar servidores DNS configurados en host investigado para comprobar resolver esperado.

```powershell
Get-DnsClientServerAddress -AddressFamily IPv4 |
  Select-Object InterfaceAlias,ServerAddresses
```

**Windows PowerShell — observación local** — Consultar caché DNS si está disponible; la ausencia por expiración no descarta consultas anteriores.

```powershell
Get-DnsClientCache | Select-Object Entry,RecordType,Status,TimeToLive
```

**Linux — solo lectura** — En servidor Linux, observar configuración y caché/consultas cuando el resolvedor es systemd-resolved.

```bash
resolvectl status
resolvectl statistics
```

### Contención y toma de decisiones

Una detección basada en QNAME no autoriza bloquear miles de subdominios sin contexto. Si se verifica DNS como canal C2/exfiltración y hay riesgo activo, coordinar aislamiento del origen y restricciones en DNS/proxy/egress según arquitectura, mantener resolución esencial y observar alternativas DoH/DoT. Documentar cambios y confirmar descenso de consultas sospechosas. La estimación de «datos robados» debe basarse en evidencia de contenido o volumen confiable, no solo en cantidad de consultas.

### Criterios de escalado

- Consulta sostenida a subzona no reconocida desde host crítico con proceso desconocido.
- Patrones de etiquetas largas y diversidad anómala junto a tipo TXT/volumen de respuesta inusual.
- Evidencias concurrentes de ejecución, persistencia, credenciales o comunicaciones fuera del resolver corporativo.
- Múltiples endpoints afectados o dominio controlado por infraestructura maliciosa confirmada.
- Actividad anómala continúa tras intervención y hay ruta alternativa de salida DNS/DoH.

### Falsos positivos probables

- CDN, anti-tracking, protección contra fraude o rastreadores legítimos.
- ACME challenge, DKIM, SPF y validadores DNS.
- Agentes de monitorización/observabilidad que etiquetan recursos en subdominios.
- Servicios de actualización y paquetes con identificadores largos.
- Resolver mal configurado con search suffix y numerosos NXDOMAIN.
- DGA no equivale automáticamente a DNS tunneling y puede requerir un caso distinto.

### Errores frecuentes

- Confundir NXDOMAIN alto con prueba de exfiltración.
- Asumir que todas las etiquetas largas tienen payload malicioso.
- No diferenciar IP del resolver recursivo de IP de estación real.
- Usar `DNSQueryLogs` como si existiera por defecto en Sentinel.
- Bloquear solo una IP y declarar que el atacante no puede cambiar de resolver.
- No registrar cobertura DoH/DoT ni condiciones para disminuir falsos positivos.

### Perspectiva Red Team / Blue Team

DNS puede transportar etiquetas controladas por un cliente hacia una zona autoritativa; un defensor observa consultas y respuestas si su resolver/telemetría captura QNAME. Cifrado, caché y servicios legítimos con subdominios largos complican el análisis. La defensa eficaz agrupa por origen y dominio, revisa patrones temporales/tipos y confirma que existe actividad maliciosa antes de cuantificar exfiltración.

### Respuesta modelo de entrevista

> Empezaría por comprobar qué logs DNS existen y si contienen `src`, QNAME, tipo, respuesta y hora. En Splunk mediría consultas/15 minutos, nombres únicos, longitud de la etiqueta inicial, NXDOMAIN y TXT por cliente/zona, contrastados con baseline. Haría pivot desde IP al equipo/proceso y revisaría resolvers externos y posibles DoH. Distinguiría CDN, ACME, observabilidad y DNS mal configurado antes de concluir tunneling. Si hay evidencia de canal no autorizado, escalaría IR y coordinaría contención del origen y salida DNS, comprobando el resultado.

### Autoevaluación

- [ ] Comprueba fuente y campos CIM reales.
- [ ] Sabe combinar longitud, unicidad, tasa, NXDOMAIN y tipo DNS.
- [ ] Introduce baseline y falsos positivos antes de alertar.
- [ ] No equipara QNAME largo con datos exfiltrados.
- [ ] Identifica cliente real frente a resolver/NAT.
- [ ] Conoce límites DoH/DoT, contenido y umbrales.

**MITRE ATT&CK (hipótesis hasta probarse):** T1071.004 — Application Layer Protocol: DNS (si C2)

### Documentación oficial y recursos

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/dnsquerylogs
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/dnsevents
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.0/data-models/cim-fields-per-associated-data-model
- https://csrc.nist.gov/pubs/sp/800/61/r3/final

---

## Guía de entrevista: respuesta de 60–90 segundos

1. **Identifico el activo y el indicador:** evento, host, usuario, reloj y criticidad.
2. **Diferencio lo demostrado de la hipótesis:** 5007 ≠ apagado, `explorer`+HTTPS ≠ inyección y NXDOMAIN ≠ exfiltración.
3. **Verifico cobertura:** fuente exacta, sensor instalado, tablas realmente disponibles, truncamiento y retención.
4. **Construyo correlación:** proceso (PID+CreationTime), identidad, destino, actividad anterior/posterior y baseline.
5. **Decido con IR:** riesgo actual, impacto de contención, preservación de evidencia y comunicación al responsable.
6. **Cierro con un criterio verificable:** confirmación o descarte sustentado, efecto de medidas, huecos e investigación adicional.

## Matriz operativa: fuentes y límites

| Fuente | Sirve para | No sirve para afirmar sin correlación |
|---|---|---|
| DeviceEvents: TamperingAttempt | Intentos de manipulación reportados | Que Defender terminó apagado |
| Defender Operational 5001/5007 | Deshabilitación RTP vs cambio | Intención atacante y actor con certeza |
| DeviceProcessEvents + 4104 | Árbol, argumentos y script blocks (si habilitado) | Que todos los comandos codificados sean malware |
| DeviceNetworkEvents | Red y proceso iniciador | Que tráfico HTTPS exfiltró datos |
| Sysmon ID 8/10 | Thread remoto y acceso a proceso | Inyección maliciosa sin más pruebas |
| Windows Security 1102 | Security audit log borrado | Que se han eliminado copias remotas |
| DNSQueryLogs / Splunk DNS | QNAME, src y respuestas si ingesta completa | Túnel/exfiltración a partir de longitud solo |

## Integración JSON en SOC-RESPONSES

- Conservar claves `schema_version`, `proyecto`, `lote`, `preguntas`, `bibliografia_general`, y el mismo conjunto de campos por pregunta que en tandas anteriores.
- `kql` y `spl` contienen exactamente dos objetos cada uno con `nombre`, `entorno`, `consulta`, `interpretacion`, `limites`. Puede mostrarse cada consulta en pestañas sin modificar su contenido.
- `comandos` incluye `entorno`, `proposito`, `comando`. Ejecución directa desde un sitio público NO recomendada; hacer copiado deliberado y explicar privilegios.
- La web puede mostrar preguntas por defecto y ocultar solución, con secciones independientes y criterios de evaluación sin puntuar automáticamente acciones de contención peligrosas.
- Los enlaces oficiales son bibliografía, no garantía de validez directa de las consultas en todas las versiones. Documentar fecha de revisión y futuro test en laboratorio.

**Control de calidad:** validación de esquema/JSON, correspondencia de 5 IDs, 10 KQL + 10 SPL; validación de ejecución de consultas pendiente de tenant y Splunk reales.

