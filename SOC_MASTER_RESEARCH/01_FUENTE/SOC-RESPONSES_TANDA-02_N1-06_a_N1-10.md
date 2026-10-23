# SOC-RESPONSES — Tanda 02 | SOC N1: redes y tráfico sospechoso

**Escenarios:** N1-06 a N1-10 · **Revisión de documentación:** 18/10/2026 · **Enfoque:** incident response, triaje SOC, Red Team contextual, telemetría, KQL, SPL, comandos y decisiones.

> **Uso responsable:** contenido defensivo para formación e investigación autorizada. No se han ejecutado estas consultas en una instancia real de Sentinel, Defender XDR ni Splunk. Ajustar ingesta, permisos, retención, fuente, umbrales, índices, campos, parser y autorizaciones antes de producción.

> **Aclaración técnica:** en Defender XDR Advanced Hunting se usa `Timestamp` y tablas como `DeviceNetworkEvents`/`DeviceProcessEvents`; en Microsoft Sentinel/Log Analytics se usa `TimeGenerated`, `CommonSecurityLog` o el parser unificador `_Im_Dns` cuando esté configurado. Splunk CIM exige datos normalizados; no basta con tener Splunk instalado.

**Reglas de oro:** puerto anómalo ≠ ataque confirmado; regularidad ≠ C2 confirmado; DNS TXT ≠ exfiltración confirmada; TCP/443 ≠ benignidad; firewall bloqueado ≠ sesión interactiva completada. La evidencia técnica debe cruzarse con proceso, activo, contexto de negocio y acción real de red.

## Índice

- [N1-06 — Conexiones cada 30 segundos hacia una IP desconocida](#n1-06)
- [N1-07 — Conexiones al puerto TCP 4444: ¿reverse shell?](#n1-07)
- [N1-08 — Escaneo de puertos contra varios servidores internos](#n1-08)
- [N1-09 — Miles de consultas DNS a subdominios aparentemente aleatorios](#n1-09)
- [N1-10 — Equipo lento con numerosas conexiones HTTPS externas](#n1-10)

## Matriz de decisión rápida

| Incidente | Evidencia para elevar prioridad | Explicación legítima que debes descartar |
|---|---|---|
| N1-06 | Proceso sospechoso + destino raro + repetición y/o actividad adicional | Agente de monitorización, health-check o retry |
| N1-07 | Conexión permitida + intérprete/ejecución remota no autorizada | Laboratorio o herramienta de desarrollo aprobada |
| N1-08 | Fuente fuera del alcance + actividad lateral posterior | Scanner de vulnerabilidades con ticket y ventana |
| N1-09 | Nombres anómalos + proceso no autorizado + pruebas complementarias | CDN/SaaS, resolver, fallos de DNS |
| N1-10 | Salida masiva/atípica + proceso/identidad + datos sensibles | Backup, sincronización y actualización |

---

<a id="n1-06"></a>
## N1-06 — Conexiones cada 30 segundos hacia una IP desconocida

**Nivel:** SOC N1 · **Bloque:** Redes y tráfico sospechoso

> **Pregunta de entrevista:** Un servidor establece conexiones salientes cada 30 segundos hacia una IP desconocida. ¿Qué indicadores revisarías para detectar un posible beaconing?

### Escenario y objetivo

A las 03:10 un NDR observa conexiones del servidor SRV-APP-02 a 203.0.113.46:443 cada ~30 segundos desde hace dos horas. La IP es de documentación (no un IOC real); el destino no aparece en el inventario. El servidor contiene una aplicación crítica. Existe telemetría MDE y algunos logs de firewall, pero aún no se sabe si son 120 sesiones distintas o eventos de una misma sesión.

**Objetivo:** Distinguir un latido legítimo de aplicación, agente de monitorización o llamada API periódica de una comunicación de comando y control (C2), identificando host, proceso, destino, duración, volumen y efecto sobre el riesgo sin detener un servicio crítico a ciegas.

### Hipótesis a contrastar

- Beaconing C2: un implante consulta regularmente a un controlador, a veces con variación intencionada (jitter).
- Health-check, agente EDR, monitorización, sincronización, NTP sobre protocolo no habitual o tarea de aplicación programada.
- Reintento automático tras error HTTP/TLS o problema de conectividad; no implica control remoto.
- Proxy, NAT o registros por flujo: aparentan periodicidad que no pertenece a un único proceso.
- Telemetría duplicada o muestreada: la regularidad puede reflejar cómo registra el sensor, no el tráfico real.

### Procedimiento operativo, paso a paso

**0. Identificar alcance y fiabilidad de alerta** — Confirmar activos, criticidad, zona de red, primer/último evento, UTC, si el registro procede de conexión/sesión/paquete y la tasa de pérdida o muestreo. No equiparar 30 s entre logs a 30 s entre paquetes.

**1. Validar dirección y exposición** — Verificar IP local/remota, puerto, protocolo, estado permitido/bloqueado, NAT, red del proxy y si el destino es efectivamente externo. Una IP de un balanceador puede no identificar al servicio final.

**2. Caracterizar el tiempo** — Extraer marcas temporales exactas y calcular intervalos medios, dispersión y ventanas sin tráfico; comparar con otros equipos y con el comportamiento histórico del host. Buscar jitter y variaciones de frecuencia.

**3. Atribuir conexión a proceso** — Correlacionar MDE/EDR con InitiatingProcessFileName, hash, ruta, línea de comandos, padre, usuario, firma y hora de creación. Un nombre legítimo no es garantía de legitimidad.

**4. Revisar destino e identidad de aplicación** — Consultar inventario y contratos SaaS, DNS, SNI/certificado TLS si se capturan legalmente, reputación contextual de dominio/IP, antigüedad de uso en tu empresa y rareza entre hosts. La ausencia de reputación no demuestra benignidad.

**5. Evaluar datos y actividad asociada** — Revisar tamaños de flujo en firewall/NetFlow, errores/respuestas si existen proxies, persistencia, tareas programadas, cambios de archivos y procesos vinculados. Diferenciar beaconing de exfiltración: son hipótesis distintas.

**6. Validar legitimidad con área propietaria** — Consultar al administrador de la aplicación con ticket/canal interno, sin enviar archivos ni ejecutar muestras. Si el patrón coincide con un job esperado, documentar cambio y evidencia.

**7. Escalar y contener según riesgo** — Si hay proceso no autorizado, reputación confirmada, ejecución sospechosa o destino C2 conocido, escalar N2/IR y solicitar aislamiento o bloqueo de egreso autorizado. Preservar telemetría y verificar que el flujo cesa.

**8. Documentar resultado** — Registrar UTC, host/usuario, IP/domino, puerto, intervalo, período, PID/hash, evidencia a favor/en contra, falsos positivos, medida tomada, propietario y siguientes pasos.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Marcas de tiempo reales + jitter | Periodicidad baja y estable es un indicador; servicios legítimos también envían latidos y C2 puede aleatorizar los intervalos. |
| IP/dominio/ASN/proxy | Establecer qué sistema se contacta realmente; CDN, NAT y IP compartidas dificultan atribución. |
| MDE DeviceNetworkEvents | Atribuir conexión saliente al proceso y a la cuenta si el sensor y el campo están disponibles. |
| Árbol de procesos, hash, firma y ruta | Priorizar cuando existe padre anómalo, binario recién escrito, intérprete no esperado o ejecución bajo cuenta privilegiada. |
| Volumen y duración de sesión | Detectar intercambios de baja tasa, descargas posteriores o transferencia relevante; MDE DeviceNetworkEvents no sustituye NetFlow para contadores de bytes. |
| Inventario y cambio aprobado | Ver si hay servicio autorizado o despliegue que explica el patrón. |
| Otros hosts afectados | Una IP rara común a estaciones distintas puede ser SaaS legítimo, actualización corporativa o una campaña; requiere contexto. |

### KQL: consultas de investigación

#### Defender XDR: candidatos con conexiones repetidas

**Requisito:** Microsoft Defender XDR Advanced Hunting — DeviceNetworkEvents (MDE desplegado)

```kql
DeviceNetworkEvents
| where Timestamp > ago(2h)
| where isnotempty(RemoteIP)
| summarize Eventos=count(), Primer=min(Timestamp), Ultimo=max(Timestamp),
            Puertos=make_set(RemotePort, 10),
            Procesos=make_set(InitiatingProcessFileName, 10)
    by DeviceName, RemoteIP, bin(Timestamp, 10m)
| where Eventos >= 8
| order by Eventos desc
```

**Interpretación:** Busca pares dispositivo/destino recurrentes y qué proceso los inicia. El umbral de ocho eventos/10 min es ilustrativo; partir de un IOC o host alertado es más eficiente.

**Límites:** Un registro no equivale necesariamente a una conexión nueva. Puede haber censura de telemetría y destinos internos o proxies; la consulta no demuestra C2 ni intervalos exactos.

#### Defender XDR: medir intervalos entre eventos

**Requisito:** Microsoft Defender XDR Advanced Hunting — DeviceNetworkEvents; adaptar host e IP

```kql
DeviceNetworkEvents
| where Timestamp > ago(3h)
| where DeviceName =~ "SRV-APP-02"
| where RemoteIP == "203.0.113.46"  // IP de ejemplo, sustituir
| project Timestamp, DeviceName, RemoteIP, RemotePort,
          InitiatingProcessFileName, InitiatingProcessId
| sort by DeviceName asc, RemoteIP asc, Timestamp asc
| serialize PrevTime=prev(Timestamp), PrevDevice=prev(DeviceName),
            PrevIP=prev(RemoteIP)
| extend GapSec=iff(DeviceName == PrevDevice and RemoteIP == PrevIP,
                    datetime_diff("second", Timestamp, PrevTime), int(null))
| summarize Intervalos=countif(isnotnull(GapSec)),
            MediaSeg=round(avg(GapSec), 1),
            DesvSeg=round(stdev(GapSec), 1),
            IntervalosEjemplo=make_set(GapSec, 15)
    by DeviceName, RemoteIP
| where Intervalos >= 5
```

**Interpretación:** Una media cercana a 30 segundos, con dispersión pequeña, aumenta la hipótesis de automatismo; interpretar después procesos y contenido/contexto.

**Límites:** Los espacios entre EVENTOS no garantizan intervalos entre conexiones reales. Si se quiere medir cada PID/puerto, hay que separar correctamente las series y evitar mezclar procesos.

### SPL: consultas de investigación

#### Splunk CIM: actividad recurrente por destino y ventana

**Requisito:** Splunk — datamodel Network_Traffic.All_Traffic normalizado; aceleración recomendable pero no imprescindible

```spl
| tstats count as Eventos from datamodel=Network_Traffic.All_Traffic
    by _time span=10m All_Traffic.src All_Traffic.dest All_Traffic.dest_port
| rename All_Traffic.* AS *
| where Eventos >= 8
| sort - Eventos
```

**Interpretación:** Identifica patrones repetidos agrupados por origen/destino; buscar la evolución de cada par y luego proceso en EDR.

**Límites:** El agregado a 10 minutos NO calcula periodicidad de 30 segundos. Revisar si la fuente representa paquetes, sesiones o flujos y si hay logs duplicados.

#### Splunk CIM: intervalo aproximado entre registros

**Requisito:** Splunk — eventos normalizados al CIM Network Traffic con tags network/communicate y tiempos por evento

```spl
tag=network tag=communicate earliest=-3h
| where isnotnull(src) AND isnotnull(dest) AND isnotnull(dest_port)
| sort 0 src dest dest_port _time
| streamstats current=f last(_time) as TiempoAnterior by src dest dest_port
| eval GapSeg=_time-TiempoAnterior
| stats count(GapSeg) as Intervalos avg(GapSeg) as MediaSeg
        stdev(GapSeg) as DesvSeg values(app) as Apps by src dest dest_port
| where Intervalos >= 5
| eval MediaSeg=round(MediaSeg,1), DesvSeg=round(DesvSeg,1)
| sort MediaSeg
```

**Interpretación:** Cuantifica la separación temporal entre registros del mismo flujo lógico (origen/destino/puerto) y permite estudiar regularidad.

**Límites:** Requiere campos CIM correctamente mapeados. Si el firewall emite múltiples eventos por la misma sesión, la media puede ser engañosa. En alto volumen acotar por host/destino antes del sort.

### Comandos de observación y comprobación

**Linux — observar conexiones actuales:** Inspeccionar sockets, incluyendo conexiones salientes; no usar solo -l, que limita a escuchas.

```bash
sudo ss -tunap
```

**Linux — detalle por proceso conocido:** Ver sockets abiertos por PID investigado; sustituir el número tras correlación.

```bash
sudo lsof -nP -a -p 1234 -i
```

**Linux — proceso y creación:** Inspeccionar argumentos y árbol de ejecución actual, sin asumir que conservará evidencia tras finalizar.

```bash
ps -fp 1234
ps -ef --forest | less
```

**Windows — conexiones TCP observadas:** Consultar conexiones salientes y sus PID, sin atribuir automáticamente un puerto a malware.

```powershell
Get-NetTCPConnection | Where-Object {$_.State -eq "Established"} | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess
```

### Contención y límites de autoridad

Como N1: no matar procesos ni bloquear por periodicidad aislada. Si la evidencia sugiere C2 activo, seguir playbook, solicitar al responsable respuesta de IR/EDR aislar el host o restringir salida a destinos autorizados, verificar el efecto y preservar trazas. En servicio crítico evaluar dependencia con Infra; no reiniciar por defecto.

### Cuándo escalar a N2 / Incident Response

- Proceso desconocido o sospechoso que realiza el tráfico, especialmente desde servidor crítico.
- Destino relacionado de forma fiable con un incidente o infraestructura de C2 confirmado.
- Evidencia de ejecución/persistencia maliciosa, descargas posteriores o comunicación con múltiples hosts afectados.
- Aumento significativo de bytes salientes, fuga probable o conexiones hacia destinos no autorizados.
- Imposibilidad de atribuir actividad con suficiente rapidez y riesgo alto para el activo.

### Falsos positivos que debes evaluar

- Agente de monitorización que consulta API cada 30 segundos.
- Heartbeat de clúster/gestor de configuración o watchdog de aplicación.
- Reintentos por indisponibilidad de un servicio legítimo.
- Logs de flujo resumidos a una cadencia constante por el sensor.

### Errores frecuentes que penalizan en entrevista

- Declarar C2 confirmado solo por intervalo regular.
- Aplicar un bloqueo masivo de 443 o matar procesos en producción sin autorización.
- Tomar RemoteIP como actor único sin evaluar proxy, NAT o CDN.
- Considerar ausencia de reputación como evidencia de inocuidad.
- Olvidar que un beacon puede realizarse por DNS, web o técnicas sin periodicidad fija.

### Perspectiva Red Team y Blue Team

El adversario puede usar comunicaciones de latido para recibir órdenes; algunos implantes introducen jitter o usan protocolos aparentemente normales. Eso crea señales útiles de regularidad, rareza del destino o del proceso, pero ninguna es suficiente por sí sola. Desde Blue Team interesa vincular proceso, sesión, DNS y actividad previa/posterior. ATT&CK T1071.001 aplica si se demuestra abuso de protocolos web, no por cualquier conexión a 443.

### Respuesta modelo de entrevista

> Primero confirmaría que la alerta describe conexiones salientes reales y revisaría la hora y el activo. Analizaría frecuencia, dispersión, destino, puertos y comportamiento histórico. Con Defender correlacionaría el tráfico con el proceso, su ruta, padre y usuario; con firewall verificaría volumen, dirección y si la salida está permitida. Comprobaría si existe un agente, monitorización o job legítimo. Si veo un proceso anómalo o más indicadores de compromiso, escalaría a N2 y solicitaría contención autorizada, preservando evidencias. La periodicidad sola no prueba C2.

### Criterios de evaluación del candidato

- [ ] Diferencia correlación temporal de confirmación de malware.
- [ ] Sabe que ss -tulnp solo muestra listening al incluir -l.
- [ ] Relaciona red + proceso + entorno + histórico.
- [ ] No confunde número de eventos con número real de conexiones.
- [ ] Escala con documentación y propone contención proporcionada.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1071.001, T1095

### Fuentes de documentación

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic
- https://attack.mitre.org/techniques/T1071/001/

---

<a id="n1-07"></a>
## N1-07 — Conexiones al puerto TCP 4444: ¿reverse shell?

**Nivel:** SOC N1 · **Bloque:** Redes y tráfico sospechoso

> **Pregunta de entrevista:** Detectas conexiones TCP hacia el puerto 4444 desde un equipo corporativo. ¿Es suficiente para confirmar una reverse shell? ¿Qué investigarías?

### Escenario y objetivo

El firewall avisa de estaciones con tráfico saliente TCP a 198.51.100.77:4444. Una empleada tiene una herramienta de desarrollo y también existe un laboratorio Red Team autorizado. No hay alerta EDR asociada. La IP es de documentación, no infraestructura atacante real.

**Objetivo:** Determinar si se trata de comunicación legítima, herramienta de administración/pruebas autorizadas o sesión interactiva maliciosa sin confundir el número de puerto con la técnica. Identificar quién inicia la conexión, hacia dónde, con qué proceso, cuánto dura y qué eventos la precedieron.

### Hipótesis a contrastar

- Reverse shell: proceso local inicia conexión saliente al sistema controlado por otro actor y redirige entrada/salida de un intérprete de comandos.
- Prueba de laboratorio o herramienta autorizada que casualmente emplea 4444.
- Aplicación empresarial que escucha o conecta por un puerto propio no estándar.
- Reconocimiento o prueba fallida: se ven SYN/denegaciones, no una sesión interactiva establecida.
- Túnel o servicio C2 que utiliza 4444, pero sin shell interactiva demostrada.

### Procedimiento operativo, paso a paso

**0. Verificar dirección y estado** — Distinguir destino 4444 (saliente) de puerto local 4444 (escucha). Verificar `allowed/blocked`, conexión establecida frente a intentos y TCP frente a UDP.

**1. Identificar origen** — Localizar hostname/IP real tras NAT, usuario, severidad del activo, hora y sesión de usuario. Si el evento es de proxy/firewall, correlacionar con endpoint.

**2. Correlacionar proceso** — En Defender XDR buscar `DeviceNetworkEvents` con RemotePort=4444; recopilar `InitiatingProcessFileName`, PID, ruta, cmdline, padre y hash. El nombre `nc.exe` no prueba por sí solo ejecución maliciosa.

**3. Reconstruir árbol de ejecución** — Buscar creación de proceso cerca de la conexión (por DeviceId, tiempo y PID/creation time), particularmente intérpretes `cmd.exe`, `powershell.exe`, `bash`, `sh`, o scripts inusuales iniciados por Office/web server; un shell interactivo puede estar vinculado a otro proceso.

**4. Identificar servicio remoto** — Validar destino, dominio asociado, reputación, propietario, exposición y si está autorizado para pruebas. La IP sola no identifica intención ni contenido.

**5. Analizar comportamiento de sesión** — Revisar duración, ida/vuelta de bytes y procesos posteriores. El flujo de datos bidireccional prolongado puede ser compatible con terminal remota, pero también con apps legítimas. Contenido TLS quizá no sea visible.

**6. Comparar con laboratorio y cambios** — Consultar mantenimiento, operaciones de Red Team, aprobación de ejercicios y activos específicos, sin asumir que toda coincidencia es actividad de pruebas.

**7. Escalar cuando hay cadena sólida** — Si conexión de equipo no autorizado + proceso sospechoso + actividad interactiva/ejecución anómala, escalar a IR. Contención aprobada desde EDR/firewall; preservar evidencias.

**8. Registrar certeza** — Clasificar como benigno, sospechoso o confirmado según evidencia; detallar hechos e hipótesis pendientes.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| RemotePort vs LocalPort | `RemotePort=4444` es destino TCP remoto; `LocalPort=4444` sería un servicio local/escucha. No confundir. |
| Acción y handshake | Un firewall que bloquea SYN no prueba que haya existido shell ni sesión establecida. |
| InitiatingProcess* en MDE | Atribuye originador y cmdline del proceso que inició la conexión. |
| DeviceProcessEvents | Proceso hijo/padre, hora y usuario; correlacionar por DeviceId + PID/instante evitando falsos enlaces cuando se reutiliza PID. |
| Volumen/duración/dirección | Compatible o incompatible con intercambio interactivo; no permite leer contenido cifrado. |
| Autorización de pentest o job | Permite diferenciar pruebas de seguridad aprobadas de actividad no autorizada. |

### KQL: consultas de investigación

#### Defender XDR: conexiones salientes al destino 4444

**Requisito:** Microsoft Defender XDR Advanced Hunting — DeviceNetworkEvents

```kql
DeviceNetworkEvents
| where Timestamp > ago(24h)
| where RemotePort == 4444
| project Timestamp, DeviceName, DeviceId, LocalIP, LocalPort,
          RemoteIP, RemotePort, Protocol, ActionType,
          InitiatingProcessFileName, InitiatingProcessId,
          InitiatingProcessCreationTime, InitiatingProcessCommandLine,
          InitiatingProcessParentFileName, InitiatingProcessAccountName
| order by Timestamp desc
```

**Interpretación:** Permite saber quién inicia una conexión a puerto remoto 4444 y qué proceso aparece asociado a ese evento.

**Límites:** No captura todos los SYN del firewall ni prueba sesión establecida o reverse shell; `ActionType` debe interpretarse según el portal. Si el puerto 4444 es local, consulta `LocalPort` y otra perspectiva de red.

#### Defender XDR: procesos creados cerca del hallazgo

**Requisito:** Microsoft Defender XDR Advanced Hunting — DeviceProcessEvents; sustituir dispositivo y tiempo

```kql
let Inicio = datetime(2026-10-18T02:50:00Z);
let Fin = datetime(2026-10-18T03:30:00Z);
DeviceProcessEvents
| where Timestamp between (Inicio .. Fin)
| where DeviceName =~ "PC-VENTAS-07"
| project Timestamp, DeviceName, AccountName, FileName,
          ProcessCommandLine, ProcessId, ProcessCreationTime,
          InitiatingProcessFileName, InitiatingProcessCommandLine,
          InitiatingProcessId, SHA1
| order by Timestamp asc
```

**Interpretación:** Reconstruye ejecución antes y después del tráfico. Examina intérpretes, padres inusuales, scripts y herramientas autorizadas.

**Límites:** Consulta temporal amplia; correlación estricta necesita DeviceId, PID y hora de creación. El filtro por hora/hostname no prueba relación causal.

### SPL: consultas de investigación

#### Splunk CIM: destino TCP/4444

**Requisito:** Splunk con CIM Network Traffic; adaptar origen e interpretación de acciones

```spl
| tstats count as Eventos min(_time) as Primera max(_time) as Ultima
    from datamodel=Network_Traffic.All_Traffic
    where All_Traffic.dest_port=4444
    by All_Traffic.src All_Traffic.dest All_Traffic.action All_Traffic.transport
| rename All_Traffic.* AS *
| convert ctime(Primera) ctime(Ultima)
| sort - Eventos
```

**Interpretación:** Resume equipos que se comunican hacia puerto 4444 y si el firewall permitió, bloqueó o registró el flujo.

**Límites:** El campo transport puede no estar poblado o variar con el add-on; validar mapeo CIM. No equiparar `count` con sesiones únicas.

#### Splunk CIM: localizar nuevos destinos o equipos afectados

**Requisito:** Splunk con CIM Network Traffic

```spl
| tstats count as Eventos dc(All_Traffic.src) as EquiposOrigen
    from datamodel=Network_Traffic.All_Traffic
    where All_Traffic.dest_port=4444
    by All_Traffic.dest _time span=1h
| rename All_Traffic.* AS *
| where EquiposOrigen >= 2
| sort - EquiposOrigen
```

**Interpretación:** Busca concentraciones del mismo destino usadas por varias estaciones. Puede indicar infraestructura compartida o prueba autorizada.

**Límites:** Un solo host infectado no aparecerá por el umbral `>=2`. Revisar también historial de un único activo.

### Comandos de observación y comprobación

**Linux — conexiones activas:** Mostrar todas las conexiones con procesos y puertos numéricos.

```bash
sudo ss -tunap
```

**Linux — puerto remoto 4444:** Ver procesos locales asociados a conexiones TCP con puerto remoto 4444; lsof requiere permisos.

```bash
sudo lsof -nP -iTCP@198.51.100.77:4444
```

**Windows PowerShell — puerto remoto:** Localizar conexión y el PID responsable en Windows.

```powershell
Get-NetTCPConnection -RemotePort 4444 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess
```

**Windows PowerShell — PID concreto:** Relacionar PID a proceso, verificando su vida útil; sustituir 1234.

```powershell
Get-CimInstance Win32_Process -Filter "ProcessId=1234" | Select-Object ProcessId,ParentProcessId,Name,CommandLine,ExecutablePath
```

### Contención y límites de autoridad

Si solo existe una conexión al puerto 4444 sin otras evidencias, se investiga y documenta, no se aísla masivamente. Si se prueba actividad interactiva no autorizada o proceso malicioso, elevar prioridad, solicitar aislamiento EDR, bloqueo de destino si procede, controles sobre cuentas y preservación. Bloquear 4444 no impide que C2 use 443 u otro puerto.

### Cuándo escalar a N2 / Incident Response

- Proceso no autorizado con comunicaciones permitidas y actividad sospechosa posterior.
- Conexión desde equipo sensible más ejecución de shell/herramienta remota no esperada.
- Evidencia de entrada/salida controlada, persistencia o robo de credenciales.
- Destino repetido en varios endpoints sin justificación.
- Confirmación de actividad fuera de la ventana de ejercicio autorizado.

### Falsos positivos que debes evaluar

- Laboratorio de pentest o pruebas Red Team aprobadas.
- Aplicación propietaria en puerto no estándar.
- Sondas de monitorización o pruebas de conectividad.
- Intentos bloqueados sin establecimiento TCP.

### Errores frecuentes que penalizan en entrevista

- Afirmar que 4444 siempre es Metasploit o una reverse shell.
- Confundir puerto local con puerto remoto.
- Tratar un SYN denegado como terminal interactiva activa.
- Unir procesos por PID sin controlar reutilización y tiempo de creación.
- Matar a ciegas un proceso o bloquear redes sin evaluar impacto.

### Perspectiva Red Team y Blue Team

Una reverse shell requiere que la víctima origine una conexión y que exista redirección/interacción con un proceso de comandos. El puerto elegido es arbitrario: 4444 es frecuente en laboratorios, pero no constituye firma exclusiva; un atacante también puede utilizar 443. La defensa necesita correlación de proceso, eventos de ejecución y dirección del flujo. Si solo vemos el puerto, solo hay indicio de comunicación a un servicio no estándar, no una técnica confirmada.

### Respuesta modelo de entrevista

> No confirmaría una reverse shell por ver TCP/4444. Primero revisaría si el destino o el puerto local es 4444, si el firewall permitió la conexión y su duración. Correlacionaría el evento con DeviceNetworkEvents para conocer el proceso iniciador y con DeviceProcessEvents para estudiar padres, hijos y comandos ejecutados. Consultaría cambios y ejercicios Red Team autorizados. Si la cadena evidencia una shell no autorizada o persistencia, escalaría a IR y solicitaría contención aprobada. En el informe distinguiría hechos, hipótesis y nivel de confianza.

### Criterios de evaluación del candidato

- [ ] No confunde puertos con pruebas de TTP.
- [ ] Distingue LocalPort/RemotePort, allow/block y estado real.
- [ ] Hace correlación proceso/red/tiempo.
- [ ] Incluye control de falsos positivos del Red Team autorizado.
- [ ] Considera contención y evidencia con criterio de impacto.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1571, T1071.001

### Fuentes de documentación

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic
- https://attack.mitre.org/techniques/T1571/

---

<a id="n1-08"></a>
## N1-08 — Escaneo de puertos contra varios servidores internos

**Nivel:** SOC N1 · **Bloque:** Redes y tráfico sospechoso

> **Pregunta de entrevista:** Tu IDS detecta un posible escaneo de puertos contra varios servidores internos. ¿Cómo diferenciarías una actividad administrativa autorizada de un reconocimiento malicioso?

### Escenario y objetivo

Entre 02:00 y 02:05 una IP de la red interna, 10.20.5.42, intenta alcanzar 18 puertos en SRV-DC-01 y SRV-DB-03 y otros 14 hosts. El IDS emite “port scan”, pero la organización dispone de scanner de vulnerabilidades semanal. No se ha confirmado propietario ni ventana de cambios.

**Objetivo:** Diferenciar reconocimiento vertical (muchos puertos en un host) y horizontal (mismo puerto en muchos hosts), evaluar intención, origen, alcance, autorización y efectos, y escalar cuando no sea una actividad aprobada.

### Hipótesis a contrastar

- Escáner de vulnerabilidades corporativo durante una ventana autorizada, con credenciales y direcciones conocidas.
- Administrador inventariando servicios tras una migración o actualización; puede estar autorizado pero mal comunicado.
- Actor malicioso o host comprometido recorriendo puertos y servicios para movimientos laterales.
- Software de descubrimiento, inventario o configuración que usa sondeos periódicos.
- Alerta IDS sobredimensionada: repetición de reintentos o un falso patrón causado por NAT, load balancer o resolución de IP.

### Procedimiento operativo, paso a paso

**0. Confirmar calidad y severidad** — Recuperar el evento IDS exacto, firma, frecuencia y confianza; comprobar SourceIP y DestinationIP antes/después del NAT, zona de red, fechas UTC, protocolos y si hubo tráfico permitido.

**1. Clasificar patrón** — Comparar cantidad de puertos distintos por destino (vertical) y hosts distintos por puerto (horizontal), duración, tasa, orden secuencial o aleatorio y acciones del firewall.

**2. Atribuir origen** — Identificar activo, propietario, usuario/proceso si EDR existe, inventario CMDB, red de scanners y asignación de DHCP en el momento del evento. Una IP actual puede pertenecer a otro host en otra fecha.

**3. Confirmar autorización independiente** — Buscar ticket de cambio, ventana, alcance de redes/hosts y credenciales, responsable de vulnerabilidades y plan aprobado. Validar por canal independiente; el rótulo “scanner” en hostname no garantiza aprobación.

**4. Contrastar comportamiento esperado** — Un escáner aprobado puede alcanzar muchos hosts/puertos, pero su IP, horario y alcance deben coincidir con el cambio. Acceso a DC fuera del alcance, madrugada no prevista o autenticaciones fallidas aumentan sospecha.

**5. Buscar actividad adyacente** — Correlacionar autenticaciones SMB/RDP/WinRM/SSH, intentos contra servicios, detecciones EDR, creación de procesos y modificación de cuentas en la siguiente ventana. Un escaneo puede preceder explotación.

**6. Decidir prioridad** — Si coincide íntegramente con actividad documentada y no hay anomalías, cerrar justificando. Si es no autorizado, host de usuario, activos críticos o se observa explotación, escalar N2/IR.

**7. Contención medida** — Con autorización, limitar tráfico lateral de ese host, aislar mediante EDR si el riesgo lo exige, y evitar un bloqueo general de escaneo que interrumpa la solución de vulnerabilidades legítima.

**8. Elaborar cierre** — Documentar mapa origen→destinos/puertos/acciones, ticket de cambio, responsable, event IDs, controles afectados, decisión y seguimiento.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Origen/NAT/DHCP | Atribución del activo en el instante del incidente, no solo la IP hoy. |
| Puertos únicos por destino | Muchos puertos en pocos hosts sugiere escaneo vertical; no confirma intención. |
| Hosts únicos por puerto | Mismo puerto en múltiples destinos sugiere escaneo horizontal. |
| Action=allow/deny y flags | Permite diferenciar tráfico permitido, bloqueos o reintentos; no deducir explotación solo de intentos. |
| Ticket y ventana | Prueba administrativa de autorización y alcance real, no solo explicación oral. |
| Telemetría EDR/AD | Identifica herramienta que origina el sondeo y posible progresión a autenticación o ejecución. |
| Contexto de criticidad | Controladores de dominio, respaldos y bases de datos justifican mayor prioridad al investigar. |

### KQL: consultas de investigación

#### Sentinel: escaneo vertical, múltiples puertos por destino

**Requisito:** Microsoft Sentinel/Log Analytics — CommonSecurityLog (firewalls CEF que mapean IP y puerto)

```kql
CommonSecurityLog
| where TimeGenerated > ago(2h)
| where isnotempty(SourceIP) and isnotempty(DestinationIP)
| where DestinationPort between (1 .. 65535)
| summarize Eventos=count(), Puertos=dcount(DestinationPort),
            MuestraPuertos=make_set(DestinationPort, 25),
            Acciones=make_set(DeviceAction, 10)
    by SourceIP, DestinationIP, bin(TimeGenerated, 5m)
| where Puertos >= 10
| order by Puertos desc, Eventos desc
```

**Interpretación:** Encuentra una fuente que ha tocado numerosos puertos distintos de un destino en cinco minutos. Ajustar umbral por red; comprobar fuente real y si son permitidos o rechazados.

**Límites:** CEF depende del appliance/normalización; DestinationPort no poblado implica ausencia de resultados. Contar eventos puede duplicar intentos/reintentos. Umbral >=10 solo ejemplo.

#### Sentinel: escaneo horizontal, muchos destinos mismo puerto

**Requisito:** Microsoft Sentinel/Log Analytics — CommonSecurityLog

```kql
CommonSecurityLog
| where TimeGenerated > ago(2h)
| where isnotempty(SourceIP) and isnotempty(DestinationIP)
| where DestinationPort between (1 .. 65535)
| summarize Eventos=count(), HostsDestino=dcount(DestinationIP),
            MuestraDestinos=make_set(DestinationIP, 20),
            Acciones=make_set(DeviceAction, 10)
    by SourceIP, DestinationPort, bin(TimeGenerated, 5m)
| where HostsDestino >= 10
| order by HostsDestino desc, Eventos desc
```

**Interpretación:** Identifica intentos a un mismo puerto sobre muchos hosts, p. ej. 445/TCP en la red interna; puede ser scanner o servicio legítimo.

**Límites:** La tabla no garantiza que tráfico sea interno ni que se haya completado un handshake. Restringir a rangos propios y comparar con DHCP, CMDB y plan de cambios.

### SPL: consultas de investigación

#### Splunk CIM: escaneo vertical por número de puertos

**Requisito:** Splunk CIM Network_Traffic.All_Traffic

```spl
| tstats count as Eventos dc(All_Traffic.dest_port) as Puertos
    from datamodel=Network_Traffic.All_Traffic
    by All_Traffic.src All_Traffic.dest _time span=5m
| rename All_Traffic.* AS *
| where Puertos >= 10
| sort - Puertos, - Eventos
```

**Interpretación:** Cuenta puertos de destino distintos de una misma pareja origen/host; ampliar con evento IDS y acciones.

**Límites:** Es una regla de cribado; falsos positivos normales en escáneres y poca cobertura si no hay flujos denegados/permitidos completos.

#### Splunk CIM: escaneo horizontal por número de hosts

**Requisito:** Splunk CIM Network_Traffic.All_Traffic

```spl
| tstats count as Eventos dc(All_Traffic.dest) as HostsDestino
    from datamodel=Network_Traffic.All_Traffic
    by All_Traffic.src All_Traffic.dest_port _time span=5m
| rename All_Traffic.* AS *
| where HostsDestino >= 10
| sort - HostsDestino, - Eventos
```

**Interpretación:** Busca origen que contacta múltiples hosts en un puerto concreto y en poco tiempo.

**Límites:** Si dest son nombres no normalizados o proxies, el recuento será incorrecto. Confirmar que los campos representan endpoints finales y tráfico comparable.

### Comandos de observación y comprobación

**Windows — proceso/red del origen:** Revisar procesos que mantienen conexiones si el equipo sigue activo.

```powershell
Get-NetTCPConnection | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess
```

**Linux — conexiones y sockets:** Observación de actividad actual, sin lanzar escaneos adicionales contra la red.

```bash
sudo ss -tunap
```

**Linux — detalles por PID identificado:** Observar ruta y argumentos actuales, sin confundir el proceso presente con el que existía a las 02:00.

```bash
ps -fp 1234
```

**Operación SOC — correlación:** Consultar ticket/CMDB/DHCP del momento; evitar improvisar una prueba activa contra los mismos servidores.

*(Acción documental; no se requiere lanzar nmap para confirmar el evento histórico.)*

### Contención y límites de autoridad

Una detección IDS aislada se investiga primero. Si el origen es un escáner corporativo aprobado dentro de su alcance, se documenta y se ajusta la detección sin perder visibilidad. Si es un equipo comprometido, se notifica a IR y se evalúa segmentación/bloqueo lateral o aislamiento EDR aprobado. Proteger DC/bases de datos frente a propagación es prioritario sin bloquear indiscriminadamente la red.

### Cuándo escalar a N2 / Incident Response

- La IP no corresponde al scanner aprobado y no hay cambio documentado.
- Patrón contra controladores de dominio, sistemas de backups o muchos segmentos.
- Evidencia posterior de autenticaciones, ejecución remota o intentos de explotación.
- Origen es una estación de usuario o servidor no diseñado para inventario.
- Hay indicios de múltiples fuentes coordinadas, movimiento lateral o persistencia.

### Falsos positivos que debes evaluar

- Escaneo de vulnerabilidades programado con ticket formal.
- Inventario de activos/red y monitorización de servicios.
- Mantenimiento de sistemas/migración con sondeo de conectividad.
- Reintentos o agregación de NAT que simulan un escaneo.

### Errores frecuentes que penalizan en entrevista

- Bloquear un scanner crítico sin verificar autorización.
- Concluir explotación por ver puertos consultados.
- Confundir muchos puertos a un host con mismo puerto a muchos hosts.
- Ignorar NAT/DHCP y la hora de asignación IP.
- Descartar alerta solo porque el hostname parece ser un scanner.

### Perspectiva Red Team y Blue Team

El reconocimiento interno ayuda a descubrir servicios accesibles y posibles rutas de movimiento lateral. Herramientas legítimas y ofensivas pueden producir patrones similares, de ahí que el control más importante sea la autorización y los eventos posteriores. Una campaña puede ser lenta o distribuida para reducir contadores en 5 minutos; umbrales basados solo en volumen no son suficientes. MITRE T1046 describe el descubrimiento de servicios y no demuestra explotación.

### Respuesta modelo de entrevista

> Confirmaría la fuente IDS y mapearía el patrón: puertos distintos por host y hosts distintos por puerto. Identificaría el activo origen usando NAT/DHCP, consultaría el inventario de escáneres y la ventana de cambios. No daría por buena una explicación sin ticket y alcance verificables. Correlacionaría con EDR, autenticaciones y eventuales intentos de explotación. Si es un escaneo legítimo lo documentaría y ajustaría la regla; si es ajeno al alcance autorizado o afecta a infraestructura crítica, escalaría y propondría contención según playbook.

### Criterios de evaluación del candidato

- [ ] Distingue escaneo horizontal y vertical.
- [ ] Corrobora autorización, ventana y alcance.
- [ ] Analiza dirección/acción y atribución tras NAT/DHCP.
- [ ] No llama explotación a un mero reconocimiento.
- [ ] Considera impacto del aislamiento sobre la operación.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1046

### Fuentes de documentación

- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic
- https://attack.mitre.org/techniques/T1046/

---

<a id="n1-09"></a>
## N1-09 — Miles de consultas DNS a subdominios aparentemente aleatorios

**Nivel:** SOC N1 · **Bloque:** Redes y tráfico sospechoso

> **Pregunta de entrevista:** Un equipo comienza a generar miles de consultas DNS a subdominios aparentemente aleatorios. ¿Qué hipótesis considerarías?

### Escenario y objetivo

En 15 minutos PC-FIN-04 genera miles de consultas a nombres largos y únicos bajo un aparente dominio externo: <cadena>.ejemplo.test. El resolvedor registra muchos NXDOMAIN y consultas TXT; un producto SaaS también ha sido actualizado esa mañana. El dominio y nombres son ilustrativos y no deben consultarse como indicadores reales.

**Objetivo:** Plantear y contrastar DGA, DNS tunneling, beaconing, misconfiguración y telemetría legítima de CDN/SaaS, preservando evidencias y determinando si hay comunicación C2 o fuga de datos, sin tratar todas las cadenas largas como ataque.

### Hipótesis a contrastar

- Algoritmo de generación de dominios (DGA): nombres dinámicos, muchos fallos NXDOMAIN y diferentes dominios raíz.
- DNS tunneling/exfiltración: subdominios largos, únicos, con cadenas que podrían codificar datos y consultas repetidas a una zona controlada por el atacante.
- Beaconing DNS: consultas periódicas a un dominio de control; puede existir tanto con pocos nombres como con nombres variables.
- CDN, analítica, telemetría o tracking legítimos: subdominios de alta cardinalidad e identificadores efímeros.
- Sufijo de búsqueda DNS mal configurado, malware no relacionado, caché expirada o software que reintenta nombres inexistentes.
- Resolvedor compartido o falta de IP original en el servidor DNS que hace aparecer un solo origen con tráfico de muchos clientes.

### Procedimiento operativo, paso a paso

**0. Precisar fuente y cardinalidad** — Distinguir consultas de respuestas, campos de origen real, DNS interno/externo, si se guardan subdominios completos y volumen basal del usuario/segmento.

**1. Construir serie temporal** — Agrupar por equipo, tiempo, dominio raíz, tipo A/AAAA/TXT/CNAME, respuesta NXDOMAIN/NOERROR y cantidad de nombres únicos. Comparar antes/después del update SaaS.

**2. Separar patrones DGA/túnel** — DGA suele explorar múltiples dominios candidatos; tunneling a menudo utiliza muchísimos subdominios únicos bajo una zona, aunque ambos pueden variar. Medir longitud, diversidad y distribución de caracteres es apoyo, no prueba criptográfica.

**3. Analizar registros TXT y resultado** — Investigar TXT inusuales, respuestas o tamaño de las consultas cuando exista telemetría; TXT no significa exfiltración por sí solo. Las etiquetas DNS tienen límites técnicos y algunos productos legítimos usan identificadores largos.

**4. Resolver atribución de endpoint** — Correlacionar SrcIpAddr con DHCP/DNS resolver; buscar proceso que origina consultas mediante EDR, Sysmon DNS (evento 22) si está habilitado o telemetría de navegador. Evitar atribuir a la IP del resolvedor sin comprobarla.

**5. Revisar reputación y propiedad** — Evaluar dominio registrado, edad/certificado/hosting cuando sea aplicable, actividad histórica en la organización y pertenencia a proveedor legítimo. No visitar dominios sospechosos desde un puesto normal.

**6. Buscar conexiones relacionadas** — Relacionar DNS con conexiones posteriores hacia IP resueltas, procesos/scripts, persistencia, archivos o cargas de datos. DNS por DoH puede no aparecer en logs de resolvedor tradicional.

**7. Evaluar gravedad y escalar** — Ante posible exfiltración, patrón con proceso desconocido, consultas a dominios de ataque o actividad en varios equipos, escalar a N2/IR con evidencias. Valorar bloqueo DNS controlado/aislamiento según procedimiento.

**8. Fijar conclusión** — Distinguir indicador estadístico, sospecha fundada y compromiso confirmado; documentar muestra de consultas, medidas, fuente de datos y límites de visibilidad.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| DnsQuery y cantidad de subdominios | Número de FQDN únicos y concentración por dominio base; revisar TLD multicapa (.co.uk) con librería Public Suffix List antes de atribución. |
| SrcIpAddr / src | Cliente originador real o resolvedor intermediario según punto de captura; requiere NAT/DHCP. |
| NXDOMAIN / ResponseCodeName | Muchos dominios inexistentes pueden sugerir DGA o fallos de configuración. Revisar respuestas además de consultas. |
| Tipo de registro (TXT, A, AAAA) | TXT puede transportar información, pero su sola presencia es normal para SPF, DKIM, validaciones, etc. |
| Longitud/entropía/periodicidad | Apoyo al triaje; nombres aleatorios en CDN/SaaS y hash internos crean falsos positivos. |
| Proceso EDR / Sysmon DNS ID 22 | Relaciona una consulta con programa/usuario si se recopila esa telemetría. |
| Conexiones posteriores | Distinguir resolución fallida, resolución exitosa y comunicación hacia destino relacionado. |
| Cifrado DNS y cobertura | DoH/DoT pueden eludir la visibilidad del resolvedor tradicional; la ausencia de consultas en él no niega tráfico DNS externo. |

### KQL: consultas de investigación

#### Sentinel ASIM: nombres largos y únicos por origen

**Requisito:** Microsoft Sentinel / Log Analytics — parser unificador _Im_Dns (fuentes DNS configuradas)

```kql
_Im_Dns
| where TimeGenerated > ago(1h)
| where isnotempty(DnsQuery) and isnotempty(SrcIpAddr)
| extend Q=tolower(DnsQuery), Largo=strlen(DnsQuery)
| extend BaseAprox=extract(@"([^.]+\.[^.]+)\.?$", 1, Q)
| summarize Consultas=count(), NombresUnicos=dcount(Q),
            LongitudMedia=round(avg(Largo),1),
            Largos=countif(Largo >= 65),
            Muestra=make_set(Q,5)
    by SrcIpAddr, BaseAprox, bin(TimeGenerated,10m)
| where Consultas >= 100 and NombresUnicos >= 80
| order by NombresUnicos desc
```

**Interpretación:** Agrupa alta frecuencia y variedad de nombres por origen y dominio base estimado. Útil para investigar patrones compatibles con túnel DNS y telemetría legítima.

**Límites:** BaseAprox = últimas dos etiquetas: ES UNA APROXIMACIÓN INCORRECTA para co.uk y otros sufijos públicos; integrar Public Suffix List en producción. SrcIpAddr puede ser un resolvedor. Ajustar umbrales a baseline; el texto largo solo es señal.

#### Sentinel ASIM: NXDOMAIN y tipos de consulta

**Requisito:** Microsoft Sentinel / Log Analytics — _Im_Dns con ResponseCodeName (según parser/fuente)

```kql
_Im_Dns
| where TimeGenerated > ago(1h)
| where isnotempty(SrcIpAddr)
| summarize Eventos=count(), NX=countif(ResponseCodeName =~ "NXDOMAIN"),
            TXT=countif(DnsQueryTypeName =~ "TXT"),
            Nombres=dcount(DnsQuery), Muestra=make_set(DnsQuery, 5)
    by SrcIpAddr, bin(TimeGenerated,15m)
| extend PorcNX=round(100.0*NX/iff(Eventos == 0, 1, Eventos),1)
| where Eventos >= 100 and (PorcNX >= 70 or TXT >= 50)
| order by Eventos desc
```

**Interpretación:** Resalta orígenes con alta tasa de respuestas NXDOMAIN o volumen TXT; validar si el esquema registra respuestas completas.

**Límites:** Dependiendo del parser ResponseCodeName/DnsQueryTypeName pueden faltar o representarse distinto; proporción sobre eventos no necesariamente sobre consultas únicas. NXDOMAIN depende de que la fuente informe respuesta.

### SPL: consultas de investigación

#### Splunk CIM DNS: alto volumen de consultas únicas

**Requisito:** Splunk con CIM Network Resolution (DNS); tags y campos normalizados

```spl
tag=network tag=resolution tag=dns earliest=-1h
| where isnotnull(query) AND isnotnull(src)
| eval q=lower(query), largo=len(query)
| eval base_aprox=replace(q,"^.*?([^.]+\.[^.]+)\.?$","\1")
| bin _time span=10m
| stats count as Consultas dc(q) as NombresUnicos
        avg(largo) as LongitudMedia count(eval(largo>=65)) as Largos
        values(record_type) as Tipos by src base_aprox _time
| where Consultas>=100 AND NombresUnicos>=80
| eval LongitudMedia=round(LongitudMedia,1)
| sort - NombresUnicos
```

**Interpretación:** Marca un origen con muchos FQDN diferentes y largos. El agrupamiento del dominio raíz es aproximado y se debe contrastar.

**Límites:** Las etiquetas y campos requieren la app CIM y TA correctamente mapeados. Un resolvedor o registros de consultas+respuestas duplicados sesga métricas. Calcular eTLD+1 de modo robusto fuera de esta aproximación.

#### Splunk CIM DNS: ratio de NXDOMAIN y consultas TXT

**Requisito:** Splunk CIM Network Resolution (DNS); reply_code puede estar ausente en eventos tipo Query

```spl
tag=network tag=resolution tag=dns earliest=-1h
| where isnotnull(src)
| bin _time span=15m
| stats count as Eventos
        count(eval(match(lower(reply_code),"^(nxdomain|non-existent domain)$"))) as NX
        count(eval(upper(record_type)=="TXT")) as TXT
        dc(query) as Nombres by src _time
| eval PorcNX=round(100*NX/max(Eventos,1),1)
| where Eventos>=100 AND (PorcNX>=70 OR TXT>=50)
| sort - Eventos
```

**Interpretación:** Permite comparar fallos NXDOMAIN y consultas TXT en ventanas; correlacionar con destinos y procesos.

**Límites:** Los reply_code del CIM varían (NXDomain / Non-Existent Domain) y pueden venir solo en respuestas; agrupar eventos mixtos altera el denominador. También pueden llegar respuestas sin query.

### Comandos de observación y comprobación

**Windows — caché DNS local:** Ver entradas de resolución presentes en memoria; NO refleja consultas históricas completas.

```powershell
Get-DnsClientCache | Select-Object Entry,RecordName,RecordType,Status
```

**Windows — Sysmon si ya habilitado:** Consultar fuente operativa existente, sin instalar sensores durante un incidente sin cambio aprobado.

```powershell
Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-Sysmon/Operational";Id=22;StartTime=(Get-Date).AddHours(-1)} -ErrorAction SilentlyContinue | Select-Object -First 20
```

**Linux — resolvedor:** Identificar configuración DNS y fuentes de logs; sin activar depuración de forma disruptiva.

```bash
resolvectl status
```

**Operación SOC — validación segura:** Evitar resolver o navegar activamente los dominios desconocidos desde un puesto corporativo.

*(Acción documental: pivotar sobre logs existentes y fuentes de inteligencia aprobadas.)*

### Contención y límites de autoridad

N1 documenta y eleva cuando la evidencia sustenta C2 o posible exfiltración. El bloqueo selectivo de un FQDN/zona en resolvedor corporativo puede contener parte del tráfico, pero debe analizar dependencias y resolutores alternativos/DoH. Si el proceso sigue activo o hay riesgo de fuga, solicitar aislamiento de endpoint/egreso por IR. No alterar registros DNS ni visitar dominios sospechosos desde equipos de trabajo normales.

### Cuándo escalar a N2 / Incident Response

- Subdominios largos, únicos y periódicos bajo un dominio no aprobado más proceso sospechoso.
- Bytes o contenido indicativo de fuga en telemetría autorizada, consultas TXT inusuales junto con otras evidencias.
- Muchos NXDOMAIN en numerosos dominios sin explicación operativa y posterior C2 exitoso.
- Múltiples equipos o datos sensibles afectados.
- No hay visibilidad de cliente real por DNS recursivo y activo de alto valor está implicado.

### Falsos positivos que debes evaluar

- Servicios CDN o SaaS con IDs aleatorios en subdominios.
- Validaciones de correo SPF/DKIM/DMARC y otros TXT legítimos.
- Errores de configuración DNS/sufijos de búsqueda y reintentos.
- Telemetría de navegadores, resolutores compartidos o software de inventario.

### Errores frecuentes que penalizan en entrevista

- Etiquetar cualquier subdominio largo o TXT como exfiltración.
- Contar consultas y respuestas como si todas fuesen solicitudes únicas.
- Aplicar extracción de “dominio base” de dos etiquetas a todos los TLD sin PSL.
- Atribuir IP del resolvedor corporativo al endpoint sin verificar su origen.
- Omitir DoH/DoT y concluir que DNS no ocurrió al no verlo en un servidor.

### Perspectiva Red Team y Blue Team

DNS puede actuar como transporte de mando y control, y en algunos casos de datos, aprovechando que suele permitirse. DGA y tunneling no son equivalentes: uno ayuda a localizar dominios dinámicos; el otro encapsula información en consultas o respuestas, aunque pueden coexistir. Buscar longitud, cardinalidad, NXDOMAIN, registros TXT y continuidad temporal sirve para formular hipótesis; confirmar demanda correlacionar proceso, consultas, respuestas y conducta posterior. ATT&CK T1071.004 solo procede si la evidencia apunta a abuso de DNS como C2.

### Respuesta modelo de entrevista

> Primero verificaría si veo consultas reales y si la IP de origen corresponde al endpoint o a un resolver. Mediría volumen de FQDN únicos, longitud, tipos y proporción de NXDOMAIN por dominio y por intervalo. Consideraría DGA, tunneling, beaconing y explicaciones legítimas como CDN, SaaS o una configuración rota. Correlacionaría con proceso EDR/Sysmon y conexiones posteriores. Una cantidad alta de subdominios no confirma exfiltración. Si existen indicadores coherentes y activo sensible, escalaría a N2/IR para decidir bloqueo DNS o aislamiento autorizado y preservación de pruebas.

### Criterios de evaluación del candidato

- [ ] Diferencia DGA, tunneling y beaconing.
- [ ] Valora respuesta NXDOMAIN y TXT con límites de normalización.
- [ ] Reconoce impacto de resolver compartido/DoH.
- [ ] No basa veredicto solo en longitud/entropía.
- [ ] Conecta DNS con ejecución y flujos de red.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1071.004, T1568.002

### Fuentes de documentación

- https://learn.microsoft.com/en-us/azure/sentinel/normalization-about-parsers
- https://learn.microsoft.com/en-us/azure/sentinel/normalization-schema-dns
- https://help.splunk.com/en/data-management/common-information-model/6.3/data-models/network-resolution-dns
- https://attack.mitre.org/techniques/T1071/004/

---

<a id="n1-10"></a>
## N1-10 — Equipo lento con numerosas conexiones HTTPS externas

**Nivel:** SOC N1 · **Bloque:** Redes y tráfico sospechoso

> **Pregunta de entrevista:** Un usuario reporta lentitud y encuentras numerosas conexiones HTTPS hacia servidores externos. ¿Cómo distinguirías tráfico legítimo de tráfico sospechoso?

### Escenario y objetivo

PC-RRHH-03 funciona lentamente desde las 09:15. El firewall registra numerosos flujos TCP/443 hacia servicios de nube y el endpoint indica alta CPU y disco. No se conoce si coinciden una actualización de Teams/navegador, sincronización de backup, subida no autorizada o C2. Algunos registros reflejan cantidades de bytes; el EDR refleja procesos y destinos, pero no necesariamente tamaño de cada transferencia.

**Objetivo:** Determinar si el problema es de rendimiento legítimo, sincronización intensa, posible malware o exfiltración mediante TLS sin tratar “443” como prueba de seguridad ni intentar descifrar contenido sin autorización.

### Hipótesis a contrastar

- Actualización legítima de Windows, navegador, EDR, software corporativo, sincronización OneDrive/backup u otro SaaS.
- Navegador con muchas pestañas/extensiones, streaming o descarga/upload intenso por aplicación aprobada.
- Exfiltración por HTTPS: grandes salidas hacia almacenamiento o API no aprobados.
- Beaconing C2 sobre HTTPS: conexiones de bajo volumen, posiblemente periódicas, iniciadas por proceso anómalo.
- Malware/cryptojacking que causa CPU elevada; la actividad HTTPS puede ser asociada o incidental.
- Problema local de rendimiento (disco, antivirus, memoria, DNS, proxy) sin relación causal con el tráfico externo.

### Procedimiento operativo, paso a paso

**0. Separar hechos y síntomas** — Recoger hora UTC del reporte, activo, criticidad, si la lentitud es CPU/RAM/disco/red, síntomas observados, usuario y afectación a más equipos. Evitar asumir causalidad del tráfico.

**1. Medir flujos reales** — En firewall/NetFlow, separar entradas y salidas con datos de bytes, duración, tasa y estado, NAT y posibles retransmisiones. Verificar si los contadores están disponibles y qué significan para cada dispositivo.

**2. Identificar destinos y normalidad** — Agrupar dominio/SNI/URL/remote IP, ASN o categoría de destino si son fiables; cruzar con inventario de SaaS, proxy y línea base histórica del mismo host. CDNs y direcciones compartidas no identifican una aplicación por sí solas.

**3. Identificar proceso de red** — Con EDR correlacionar DeviceNetworkEvents con iniciador, cmdline, hash, firma y padre. La relación proceso↔conexión es más fuerte que puerto 443 aislado.

**4. Correlacionar rendimiento y actividad** — Usar herramienta de rendimiento local o telemetría EDR para CPU/disco/memoria. Ver si el período de lentitud coincide con procesos y transferencia; un `chrome.exe` con alto tráfico podría ser legítimo o contener extensión peligrosa.

**5. Buscar indicadores adicionales** — Examinar procesos nuevos o fuera de ruta, scripts, cambios de archivos, alertas DLP, accesos a datos sensibles, cambios de permisos, login anómalo, conexiones a storage personal, tasas de bytes no habituales y persistencia.

**6. Evaluar cifrado y política** — TCP/443 NO confirma que el protocolo sea HTTPS ni que el destino sea confiable. TLS protege contenido frente a observadores; proxy corporativo autorizado puede aportar URL/método, pero sin inspección no se infiere contenido del payload.

**7. Preguntar al usuario y administrador** — Confirmar si se ejecutó backup, videollamada, subida legítima, actualización o transferencia empresarial sin entregar datos de investigación al posible actor.

**8. Priorizar y escalar** — Si hay salida alta no justificada desde un activo sensible, proceso malicioso, indicios de robo o destino no autorizado, escalar N2/IR y activar contención aprobada. Si es actualización legítima, documentar medidas de rendimiento.

**9. Verificar cierre y métricas** — Confirmar reducción de síntomas y del tráfico tras medida autorizada, sin borrar la evidencia ni destruir procesos preventivamente. Documentar UTC, comparación con base y propietario.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| TCP 443 vs HTTPS/TLS | Un puerto no identifica necesariamente un protocolo; HTTPS no equivale a seguridad de la actividad. |
| SentBytes/ReceivedBytes o bytes_out/in | Volumen útil para analizar posible fuga; validar perspectiva del appliance/firewall y si hay contadores por sesión o duplicación. |
| DeviceNetworkEvents proceso/RemoteUrl | Contexto de proceso, URL/FQDN cuando está disponible; no extraer bytes inexistentes de este evento. |
| Proxy/SNI/TLS metadata | Dominio/host, resultado y otros metadatos si se capturan; SNI puede ocultarse mediante ECH y no debe darse por disponible. |
| Tiempo, duración y patrones | Relación entre pico, duración, proceso y ventana de usuario, junto con línea base. |
| DLP, nube aprobada, contenido de archivos | La posible fuga exige evidencias de destino, sensibilidad y movimientos de datos; el total de bytes por sí solo no prueba exfiltración. |
| CPU/RAM/disco y errores locales | Permite explicar lentitud no causada por red o coexistente con tráfico normal. |
| Riesgo de endpoint e identidad | Alertas EDR, sesión de usuario anómala, padre/proceso poco habitual o actividad fuera de horario. |

### KQL: consultas de investigación

#### Defender XDR: proceso que inicia conexiones al puerto remoto 443

**Requisito:** Microsoft Defender XDR Advanced Hunting — DeviceNetworkEvents (no es fuente de bytes)

```kql
DeviceNetworkEvents
| where Timestamp > ago(3h)
| where DeviceName =~ "PC-RRHH-03"
| where RemotePort == 443
| summarize Eventos=count(), Destinos=dcount(RemoteIP),
            IPs=make_set(RemoteIP, 15),
            Dominios=make_set(RemoteUrl, 15),
            Primera=min(Timestamp), Ultima=max(Timestamp)
    by InitiatingProcessFileName, InitiatingProcessCommandLine,
       InitiatingProcessParentFileName, InitiatingProcessAccountName
| order by Eventos desc
```

**Interpretación:** Prioriza el proceso/usuario y muestra qué destinos contacta; investigar intérpretes o procesos nuevos y compararlos con software instalado.

**Límites:** Requiere Defender for Endpoint. No hay bytes salientes en este esquema; `RemoteUrl` puede faltar. Agrupar por línea de comandos produce mucha cardinalidad y no equivale a número de sesiones únicas.

#### Sentinel: salidas HTTPS/443 y volumen por IP

**Requisito:** Microsoft Sentinel/Log Analytics — CommonSecurityLog con campos de bytes mapeados por firewall CEF

```kql
CommonSecurityLog
| where TimeGenerated > ago(3h)
| where DestinationPort == 443
| where isnotempty(SourceIP) and isnotempty(DestinationIP)
| summarize Registros=count(), BytesSalientes=sum(SentBytes),
            BytesEntrantes=sum(ReceivedBytes),
            Acciones=make_set(DeviceAction, 10)
    by SourceIP, DestinationIP, bin(TimeGenerated, 15m)
| extend MiBSalientes=round(BytesSalientes/1024.0/1024.0,2)
| order by MiBSalientes desc
```

**Interpretación:** Identifica comunicaciones con mayor carga saliente según firewall, para investigar si están justificadas por transferencias legítimas.

**Límites:** SentBytes/ReceivedBytes dependen de cómo el sensor orienta src/dst, NAT y el registro del flujo. No sumar indiscriminadamente logs duplicados o de conexión no finalizada. Un valor 0 puede significar campo no poblado. Puerto 443 no confirma HTTPS.

### SPL: consultas de investigación

#### Splunk CIM: flujos 443 ordenados por salida

**Requisito:** Splunk — CIM Network Traffic; requiere All_Traffic.bytes_out correctamente mapeado

```spl
| tstats sum(All_Traffic.bytes_out) as BytesSalientes
    sum(All_Traffic.bytes_in) as BytesEntrantes
    count as Registros
    from datamodel=Network_Traffic.All_Traffic
    where All_Traffic.dest_port=443
    by All_Traffic.src All_Traffic.dest _time span=15m
| rename All_Traffic.* AS *
| eval MiBSalientes=round(BytesSalientes/1024/1024,2)
| sort - MiBSalientes
```

**Interpretación:** Prioriza los flujos TCP/443 con mayor transmisión desde la perspectiva del sensor; cruzar con dueño, programa, categoría del destino y DLP.

**Límites:** La orientación bytes_out/bytes_in depende del origen y del mapeo. Puede faltar volumen o haber contadores acumulativos/duplicados; se deben filtrar tipos de evento antes de sumar.

#### Splunk CIM: comparar un host por franjas horarias

**Requisito:** Splunk — CIM Network Traffic; sustituir la IP por equipo real observado

```spl
| tstats sum(All_Traffic.bytes_out) as BytesOut
    dc(All_Traffic.dest) as Destinos count as Registros
    from datamodel=Network_Traffic.All_Traffic
    where All_Traffic.src="10.20.5.77" AND All_Traffic.dest_port=443
    by _time span=1h
| eval MiBOut=round(BytesOut/1024/1024,2)
| timechart span=1h sum(MiBOut) as MiBOut max(Destinos) as Destinos
```

**Interpretación:** Muestra tendencia horaria para diferenciar picos aislados de transferencias sostenidas, comparando con historial real.

**Límites:** La ventana predeterminada del buscador debe cubrir días suficientes para línea base; el `timechart` suma los bins de tstats y no mide velocidad de forma continua. No se infiere exfiltración solo por pico.

### Comandos de observación y comprobación

**Windows — conexiones activas:** Mostrar propietario PID y destinos sin depender de nombre de puerto.

```powershell
Get-NetTCPConnection -State Established | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess
```

**Windows — procesos costosos:** Encontrar procesos con CPU acumulada; completar con monitor actual de rendimiento.

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 ProcessName,Id,CPU,WorkingSet64
```

**Linux — sockets actuales:** Ver IP, puerto y programa en caso de un servidor Linux implicado.

```bash
sudo ss -tunap
```

**Linux — carga general:** Comparar hipótesis de cuello de botella de CPU/ram/IO.

```bash
top -b -n 1 | head -35
```

### Contención y límites de autoridad

No bloquear globalmente 443 ni matar navegador, servicio de nube o agente corporativo por número de conexiones. Si la correlación sugiere compromiso o fuga activa, solicitar aislamiento EDR o restricción de egreso por aplicaciones/destinos aprobados; evaluar DLP, credenciales y protección de datos con IR. Si la causa es legítima (sync/actualización), trabajar con soporte y usuario para resolver rendimiento sin alterar evidencia de un incidente descartado.

### Cuándo escalar a N2 / Incident Response

- Transferencia saliente elevada hacia destino no aprobado asociada a datos sensibles.
- Proceso malicioso/atípico que abre conexiones 443, padres sospechosos o persistencia.
- DLP activa, datos confidenciales fuera de dominio empresarial o señales de acceso no autorizado.
- Tráfico inexplicable desde una identidad privilegiada, servidor de alto valor o varios hosts.
- Posible exfiltración en curso que exige contención urgente y alcance de datos.

### Falsos positivos que debes evaluar

- Sincronización OneDrive, backups y archivos multimedia de trabajo.
- Actualizaciones de Windows, MDE, navegador u otras aplicaciones.
- Videollamadas, streaming empresarial y numerosas pestañas del navegador.
- Cifrado TLS, retransmisiones y CDN/proxy concentrando conexiones.

### Errores frecuentes que penalizan en entrevista

- Asumir que todo 443 es seguro, o que todo 443 frecuente es malicioso.
- Pretender calcular bytes de exfiltración en DeviceNetworkEvents cuando esos campos no existen.
- Interpretar bytes_out/bytes_in sin revisar perspectiva del firewall.
- Suponer que TLS expone el contenido, URL completa o SNI en todos los casos.
- Bloquear HTTPS para toda la organización o interrumpir servicios sin autorización.

### Perspectiva Red Team y Blue Team

HTTPS y otros protocolos web son canales atractivos para C2 y transferencia de archivos porque el tráfico ordinario es abundante. Un atacante podría usar infraestructura de nube o dominios aparentemente legítimos; la defensa no se limita a listas de IP. Importa el comportamiento de procesos, los destinos no habituales, volumen saliente, horarios, identidad y acciones sobre archivos. La hipótesis de exfiltración corresponde a técnicas de salida de datos solo cuando existe evidencia concreta; ver 443 no basta.

### Respuesta modelo de entrevista

> Verificaría primero si la lentitud coincide con CPU/disco/red y revisaría la ventana temporal. Con registros firewall o NetFlow mediría bytes salientes y entrantes, destinos y duración; con Defender enlazaría conexiones a procesos, usuarios y árboles de ejecución. Comprobaría actualizaciones, sincronización, SaaS autorizado y baseline del equipo. El puerto 443 no implica que el tráfico sea benigno ni asegura que sea HTTPS, y sin visibilidad adicional no sabría el contenido cifrado. Si hay salida de datos sospechosa o un proceso comprometido, escalaría a IR para contención autorizada y preservación de evidencia; si es legítimo, documentaría la causa de rendimiento.

### Criterios de evaluación del candidato

- [ ] Relaciona síntomas de rendimiento con evidencias, sin asumir causalidad.
- [ ] Distingue telemetría EDR de contadores de flujo de red.
- [ ] Comprende limitaciones del cifrado y SNI.
- [ ] Evalúa volumen real, proceso, activo, nube/servicio y baseline.
- [ ] No bloquea 443 indiscriminadamente.

**MITRE ATT&CK (hipótesis, no atribución confirmada):** T1071.001, T1041

### Fuentes de documentación

- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic
- https://attack.mitre.org/techniques/T1071/001/
- https://attack.mitre.org/techniques/T1041/

---

## Notas de implementación para SOC-RESPONSES (web)

- Cada objeto de `preguntas[]` mantiene las mismas claves de Tanda 01: `id`, `pregunta`, `escenario`, `objetivo`, `hipotesis`, `pasos`, `evidencias`, `kql`, `spl`, `comandos`, `contencion`, `escalation`, `falsos_positivos`, `errores`, `perspectiva_red_team`, `respuesta_entrevista`, `criterios_evaluacion`, `mitre`, `fuentes`.
- Para interfaz web, presentar primero el escenario y solicitar al estudiante decisiones; revelar gradualmente evidencias, consultas, escalado y modelo. No ejecutar fragmentos directamente desde la web sin autorización y revisión del entorno.
- Las IP de TEST-NET de los escenarios son ilustrativas: `203.0.113.46` y `198.51.100.77` no son IOCs de amenazas reales. Las IP privadas 10.20.x.x se utilizan como ejemplo de topología.
- Los umbrales estadísticos son de laboratorio: calibrar con frecuencias, volúmenes, falsos positivos y cobertura real de cada fuente. Registrar resultados de pruebas sobre datos sintéticos antes de activar alertas.
- Lectura progresiva sugerida: entender hipótesis → observar en logs → atribuir a proceso → evaluar contexto de negocio → decidir escalado y contención proporcional → documentar.

**Estado:** contenido revisado con documentación de esquema; consultas no ejecutadas en SIEM/EDR real. Este lote se detiene en N1-10 y no incluye preguntas de la tercera tanda.
