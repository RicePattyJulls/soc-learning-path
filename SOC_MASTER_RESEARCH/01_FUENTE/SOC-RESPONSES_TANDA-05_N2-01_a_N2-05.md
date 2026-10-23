# SOC-RESPONSES — Tanda 05 | SOC N2: Incident Response y contención avanzada

**Escenarios:** N2-01 a N2-05 · **Revisión de documentación:** 18/10/2026 · **Enfoque:** contención verificable, continuidad operativa, Active Directory, evidencia forense, KQL/SPL y Red Team.

> **Uso educativo y límites:** Las consultas se han preparado contrastando documentación oficial, pero **NO** se han probado en un tenant Microsoft Sentinel / Defender XDR ni en Splunk. Validar permisos, fuentes, campos, mapeos CIM, semántica de contadores, zona horaria, ActionType, NAT, alcance de agentes y particularidades de cada proveedor. No copiar medidas disruptivas a producción sin autorización, playbook y plan de recuperación. Todos los nombres e IP son ficticios; los IP externos son rangos de documentación.

## Índice

- [N2-01 — Exfiltración masiva en curso: 60 segundos para detener la salida](#n2-01)
- [N2-02 — El negocio exige reconectar la base de datos comprometida](#n2-02)
- [N2-03 — El atacante cambia de IP: pasar de bloqueo por IOC a control de egreso](#n2-03)
- [N2-04 — Cuenta Domain Admin comprometida: contención coordinada sin regalar tiempo](#n2-04)
- [N2-05 — Servidor crítico no aislable: contención compensatoria y controlada](#n2-05)

## Principios de contención para un SOC N2

1. **La contención es una acción verificable**, no una orden emitida: confirmar cambio real en el flujo/estado.
2. **Primero el riesgo que evoluciona:** exfiltración o cifrado activo exige decisión rápida; investigar PID, logs y persistencia sin detener la fuga sería un error.
3. **El impacto de negocio importa:** combinar reducción de daño con continuidad mediante failover, segmentación mínima, responsables y excepciones temporales.
4. **Preservar evidencia razonablemente:** registrar y capturar lo posible antes de cambios destructivos, pero no sacrificar contención urgente por una adquisición perfecta.
5. **Identidad ≠ contraseña:** las sesiones, tickets, tokens, hosts e identidades asociadas requieren planes paralelos de contención y validación.
6. **No inventar certezas:** tráfico de red no demuestra contenido exfiltrado; ausencia de logs, alertas o usuarios interactivos no descarta compromiso.
7. **Una IP bloqueada no equivale a erradicación:** impedir rutas de egreso y lateralidad desde origen y sus credenciales.

## Matriz ejecutiva rápida

| ID | Decisión N2 | Riesgo central | Evidencia decisiva |
|---|---|---|---|
| N2-01 | Contener egreso en segundos y medir caída real | Pérdida continua de datos | Bytes/s y rutas de egreso antes/después |
| N2-02 | No reabrir todo; evaluar DR/failover y mínimo flujo | Reincidencia vs coste de parada | Mapa dependencias + control aprobado + rollback |
| N2-03 | Aislar origen/identidad y aplicar egress allowlist | Cambio veloz de destinos C2 | Host-proceso-cuenta + todos los destinos |
| N2-04 | Contener cuenta/sesiones/endpoints coordinadamente | Pérdida de dominio y persistencia | Logons + grupos/GPO/ACL y uso posterior |
| N2-05 | Restringir red e identidad con riesgo aceptado | Persistencia en producción no aislada | Allowlist real + monitorización + umbral de corte |

---

<a id="n2-01"></a>
## N2-01 — Exfiltración masiva en curso: 60 segundos para detener la salida

**Nivel:** SOC N2 · **Bloque:** Incident Response y contención

> **Pregunta de entrevista:** Son las 03:00 y un servidor está enviando gigabytes de datos hacia una dirección desconocida. Tienes 60 segundos para actuar. ¿Cómo contendrías el incidente sin destruir evidencia?

### Escenario y objetivo

03:00:00 UTC. El sistema de monitorización de red observa tráfico saliente anómalo desde DB-PRD-01 (10.20.5.10) hacia 203.0.113.88:443. En la última ventana de un minuto se han transferido varios gigabytes según el firewall; el panel de usuarios interactivos muestra cero conexiones. El SOC tiene una acción de aislamiento EDR autorizada por playbook para casos de exfiltración crítica y acceso a un firewall perimetral gestionado por redes. DB-PRD-01 es crítico para producción. Hay un proceso potencialmente malicioso, pero todavía se desconoce su PID y si opera como cuenta de servicio, tarea programada o túnel. Todos los IP/hosts son didácticos; 203.0.113.88 pertenece a TEST-NET-3.

**Objetivo:** Detener o reducir de forma verificable la transferencia en curso antes de hacer análisis profundo; notificar al responsable; conservar evidencias disponibles; distinguir la medida aplicada, su confirmación y el volumen de datos potencialmente ya perdidos.

### Hipótesis a contrastar

- Exfiltración desde proceso comprometido, cuenta de servicio, aplicación o agente no interactivo; «cero usuarios conectados» no descarta procesos en segundo plano.
- Transferencia administrativa legítima de backup, replicación o copia a proveedor con destino no inventariado.
- Telemetría de firewall atribuida erróneamente por NAT, balanceadores o etiquetas de activo obsoletas.
- Transferencia por HTTPS/443, túnel saliente o conexión persistente, por lo que bloquear un puerto de escucha no detiene el flujo.
- El volumen del firewall representa bytes en un intervalo distinto o contador acumulado; hay que validar métrica y sentido de tráfico.
- El atacante puede tener otra sesión, token o proceso preparado para reiniciar la salida incluso si se mata el primer PID.

### Procedimiento operativo, paso a paso

**T+0–5 s · Declarar sospecha crítica** — Identificar el activo fuente y validar con el propio evento la dirección del tráfico. Accionar el canal de emergencia en paralelo; no esperar al inventario completo de procesos si el flujo continúa.

**T+5–15 s · Contención inmediata según playbook** — Si la telemetría permite alta confianza y ya existe autoridad: aislar por EDR cuando el modo sea compatible y seguro, o aplicar denegación de egreso por identidad/segmento de servidor en firewall/NSG/ACL. Si aislar el host destruye disponibilidad, coordinar una regla de egreso específica para detener el flujo mientras IR y operaciones deciden. Las excepciones son temporales y justificadas.

**T+15–25 s · Confirmar efectividad** — Revisar contadores de salida en la misma fuente y confirmar nuevos flujos permitidos/denegados. Distinguir «acción solicitada» de «confirmada»; un comando exitoso no prueba que cesó la fuga. Comprobar tráfico alternativo y otros destinos desde la misma fuente.

**T+25–35 s · Notificar a IR y responsables** — Comunicar host, impacto, hora UTC, origen/destino, medida aplicada, responsable y estado de confirmación. Informar que «datos exfiltrados» es hipótesis hasta tener evidencia de contenido y perímetro de confianza.

**T+35–45 s · Preservación rápida** — Guardar/exportar evento original, Flow Logs/firewall, EDR/alerta, consulta ejecutada, logs VPN/proxy, identificadores y hora UTC en repositorio autorizado. Si es posible, solicitar captura de memoria y snapshot coordinados una vez detenida la salida.

**T+45–60 s · Primer pivote técnico** — Desde consola separada y sin ejecutar código no confiable: revisar conexiones ESTABLISHED, destino, PID y padre; no depender de ss -tulnp, que filtra sockets de escucha. En caso de host no fiable, priorizar telemetría fuera de banda.

**T+60 s en adelante · Alcance y erradicación** — Investigar cuenta/proceso/inicio de sesión, credenciales usadas, artefactos, otros hosts con mismo destino y contenido accesible a la identidad comprometida. Decidir rotación de secretos, erradicación y restauración supervisadas; documentar impacto, comunicación legal y preservación.

**Criterio de éxito** — La métrica de bytes enviados a destinos no aprobados desciende a cero o al nivel explicado por un canal autorizado y verificado; el servidor no obtiene rutas alternativas de salida; las medidas se mantienen hasta decisión de IR.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Firewall/NetFlow: SourceIP, DestinationIP, SentBytes, Action y ventana | Mide tráfico visto por el dispositivo; confirma dirección, NAT y baseline; bytes no equivalen automáticamente a registros filtrados. |
| EDR: DeviceNetworkEvents, RemoteIP, InitiatingProcessId, InitiatingProcessCommandLine | Relaciona conexión con proceso y usuario; no aporta por sí solo volumen real de bytes transmitidos. |
| Estado de EDR «isolation requested/applied» + última comunicación | Acredita aplicación técnica; comprobar limitaciones y comunicaciones permitidas. |
| Capturas/Flow Logs antes y después del bloqueo | Demuestran tendencia del flujo, conexión alternativa y efectividad de contención. |
| Línea temporal de servicios, tareas, logons y transferencias autorizadas | Ayuda a descartar replicación, backup y alertas por cambio de configuración. |
| Registro de decisión y cadena de custodia | Quién autorizó, ejecutó, verificó, qué herramienta y timestamps UTC, sin exponer credenciales. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics · bytes de egreso en firewall CEF

**Requisito:** Workspace con CommonSecurityLog ingerido desde el firewall y contadores SentBytes realmente poblados; SourceIP es pre-NAT según proveedor. Modificar IP origen y periodo.

```kql
let src = "10.20.5.10";
CommonSecurityLog
| where TimeGenerated between (ago(30m) .. now())
| where SourceIP == src
| summarize out_bytes=sum(tolong(SentBytes)), eventos=count(),
            acciones=make_set(DeviceAction, 10)
  by bin(TimeGenerated, 1m), DestinationIP, DestinationPort
| extend out_mib=round(toreal(out_bytes)/1048576.0, 2)
| order by TimeGenerated desc, out_bytes desc
```

**Interpretación:** Permite observar picos por minuto/destino y estimar si la contención redujo la salida.

**Límites:** SentBytes depende de proveedor y puede contar al cierre de la sesión, no en tiempo real. No asumir que todos los firewalls usan la misma semántica ni que loguean conexiones permitidas.

#### Defender XDR Advanced Hunting · conexiones salientes y proceso originador

**Requisito:** MDE integrado; tabla DeviceNetworkEvents con eventos de red del servidor. Defender Advanced Hunting, no consulta directa de SecurityEvent de Sentinel.

```kql
let host = "DB-PRD-01";
DeviceNetworkEvents
| where Timestamp > ago(1h)
| where DeviceName startswith strcat(host, ".") or DeviceName =~ host
| summarize conexiones=count(), primera=min(Timestamp), ultima=max(Timestamp),
            destinos=make_set(RemoteIP, 30)
  by DeviceName, InitiatingProcessId, InitiatingProcessFileName,
     InitiatingProcessCommandLine, InitiatingProcessAccountName,
     RemotePort, ActionType
| order by ultima desc
```

**Interpretación:** Identifica procesos y cuentas que abrieron conexiones; sirve para pivotar a DeviceProcessEvents y procesos padres.

**Límites:** DeviceNetworkEvents NO es un medidor de bytes; count() mide eventos EDR, no volumen ni éxito de transferencia. Ajustar nombres FQDN y ActionType en el portal.

### SPL: consultas de investigación

#### Splunk CIM Network_Traffic · volumen de egreso por minuto

**Requisito:** Modelo Network_Traffic.All_Traffic con src, dest, bytes_out y action alimentados y mapeados; 10.20.5.10 IP didáctica.

```spl
| tstats sum(All_Traffic.bytes_out) as bytes_fuera count as eventos
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-30m latest=now All_Traffic.src="10.20.5.10"
  by _time span=1m All_Traffic.src All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| eval MiB=round(bytes_fuera/1048576, 2)
| sort - _time - bytes_fuera
```

**Interpretación:** Detecta picos por minuto, tráfico bloqueado/permitido y destino.

**Límites:** bytes_out puede faltar o representar contador por evento de cierre; comprobar sentido, mapeo CIM, NAT y límites de tstats.

#### Splunk CIM Network_Traffic · destinos alternativos tras contención

**Requisito:** Modelo CIM de tráfico para el host afectado; cambiar ventana a la hora exacta del incidente.

```spl
| tstats count sum(All_Traffic.bytes_out) as bytes_fuera
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-15m latest=now All_Traffic.src="10.20.5.10"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - bytes_fuera
```

**Interpretación:** Ayuda a detectar destinos de reemplazo mientras se verifica el bloqueo.

**Límites:** No demuestra finalización de toda exfiltración ni distingue tráfico autorizado sin inventario de egreso.

### Comandos de observación y comprobación

**Linux — solo lectura:** Conexiones activas, con PID cuando esté disponible. Ejecutar únicamente en host autorizado y si aporta valor; no se usa para contener el flujo.

```bash
sudo ss -tunap state established
```

**Linux — solo lectura:** Identifica procesos con sockets; comparar PID, fecha y comando de ejecución.

```bash
sudo lsof -nP -iTCP -sTCP:ESTABLISHED
```

**Linux — solo lectura:** Ver estructura y propietario de un PID concreto, no ejecutarlo.

```bash
ps -o pid,ppid,user,lstart,etime,args -p 1234
```

**Linux — solo lectura:** Revisar reglas actuales sin modificarlas; no ejecutar cambios de red por SSH sin consola alternativa.

```bash
sudo nft list ruleset
```

### Contención y límites de autoridad

Orden recomendado: contención remota con controles de red/EDR aprobados → verificación mediante telemetría independiente → preservación → análisis de proceso y credenciales. Evitar kill -9, apagado, reinicio, rm o borrado de cron de forma refleja: pueden destruir evidencia, provocar caída, reactivación o pérdida de trazabilidad. Si hay daño progresivo y no existe otra forma, el playbook puede contemplar medidas disruptivas con autorización. Aislamiento EDR completo suele preservar canal de gestión del propio agente, pero capacidades dependen de OS/versión; no asumir que una excepción mantiene base de datos operativa.

### Cuándo activar o escalar IR / liderazgo

- Salida alta sostenida hacia destino no autorizado desde un repositorio de datos sensibles.
- No es posible verificar la eficacia del bloqueo o aparecen nuevas IP/dominios.
- Credenciales privilegiadas, múltiples hosts o indicios de staging de datos.
- Se desconoce clasificación de datos/sistemas y podría requerirse notificación por brecha.
- Las decisiones de disponibilidad afectan a operaciones y requieren comandante de incidente y negocio.

### Explicaciones legítimas y falsos positivos

- Backup/restauración nocturna a proveedor legítimo con IP nueva o CDN.
- Replicación de base de datos/DR o transferencias de analytics autorizadas.
- Recuento duplicado en firewall por NAT o varios sensores del mismo trayecto.
- Campo de bytes invertido en normalización respecto al sentido real.
- Exportación legítima con destino no inventariado; confirmar autorización documental.

### Errores frecuentes que penalizan en entrevista

- Usar ss -tulnp y pensar que muestra conexiones salientes establecidas; -l solo muestra sockets en escucha.
- Matar el proceso antes de detener la salida y antes de preservar evidencia viable.
- Bloquear el puerto de escucha de un servidor cuando el flujo malicioso es outbound HTTPS/443.
- Afirmar «base de datos vaciada» con solo bytes de red, sin evidencia de contenido.
- Aplicar firewall local remoto por SSH sin canal de recuperación y perder control.
- Interpretar una orden de aislamiento enviada como aislamiento realmente efectivo.

### Perspectiva Red Team y Blue Team

Una intrusión no requiere sesión interactiva visible: servicios, procesos hijos, agentes y tokens pueden continuar operando. El tráfico de exfiltración puede mezclarse con 443, almacenamiento cloud o túneles; perseguir una IP o PID aislados deja rutas alternas. La prioridad defensiva es controlar egreso desde origen y reconstruir proceso, identidad, destino y contenido con evidencias independientes.

### Respuesta modelo de entrevista

> En 60 segundos priorizaría contener el egreso desde ese servidor mediante el mecanismo de aislamiento o regla de red ya autorizado, sin perder tiempo buscando primero un PID. Verificaría en firewall/telemetría que la transferencia cae y que no aparecen destinos alternativos. Avisaría a IR e infraestructura, registraría hora y evidencias, y después investigaría proceso, cuenta, persistencia y alcance. No confundiría usuarios conectados con procesos activos ni bytes de red con datos robados confirmados.

### Criterios de evaluación del candidato

- [ ] Detiene el flujo antes de invertir minutos en investigación detallada.
- [ ] Conoce diferencia ss -tulnp versus ss -tunap / ESTABLISHED.
- [ ] Exige prueba de contención aplicada y verificada.
- [ ] Preserva registros de red, EDR y cadena de custodia.
- [ ] No confunde bytes de red con contenido exfiltrado comprobado.
- [ ] Coordina autorización y recuperación del servicio crítico.

**MITRE ATT&CK (hipótesis salvo corroboración expresa):** T1041 (Exfiltration Over C2 Channel, hipótesis), T1567 (Exfiltration Over Web Service, hipótesis), T1071.001 (Web Protocols, si se acredita)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://www.cisa.gov/stopransomware/ransomware-guide
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-deviceprocessevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://learn.microsoft.com/en-us/defender-endpoint/network-isolation-exclusions
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/network-traffic

---

<a id="n2-02"></a>
## N2-02 — El negocio exige reconectar la base de datos comprometida

**Nivel:** SOC N2 · **Bloque:** Incident Response y contención

> **Pregunta de entrevista:** Has aislado un servidor comprometido, pero el responsable de infraestructura exige reconectarlo porque cada minuto de inactividad cuesta miles de euros. ¿Qué decisión tomarías y cómo la justificarías?

### Escenario y objetivo

03:06 UTC. DB-PRD-01 sigue aislado por EDR tras detectar transferencia no autorizada. Comercio electrónico presenta errores; el área de operaciones estima pérdidas elevadas. El responsable solicita reconectar de inmediato. IR aún no ha demostrado ausencia de persistencia ni credenciales robadas; la dependencia de bases de datos, API, monitorización y almacenamiento es compleja.

**Objetivo:** No confundir urgencia de negocio con autorización técnica para reintroducir riesgo. Proponer rutas de recuperación controlada que permitan servicio mínimo sin devolver conectividad peligrosa; escalar riesgo residual al decisor designado.

### Hipótesis a contrastar

- Reconectar íntegramente reabre la ruta de exfiltración y el ataque puede reanudarse.
- Hay una réplica limpia/failover seguro que puede recuperar funcionalidad sin usar el activo comprometido.
- Se requiere tráfico mínimo por determinadas dependencias para continuidad del negocio.
- El aislamiento actual desconectó la plataforma por una dependencia monolítica no prevista.
- La intrusión pudo extenderse a réplicas, credenciales o backups: no todo failover es automáticamente seguro.
- La cifra financiera presentada necesita validación por negocio; aun siendo real, no prueba que la reconexión sea la única alternativa.

### Procedimiento operativo, paso a paso

**0. Confirmar el hecho y autoridad** — Comprobar que el equipo está aislado efectivamente y qué servicios fallan. Solicitar presencia de Incident Commander, responsable de infraestructura, negocio y dueño de datos; documentar quién puede aceptar riesgos.

**1. Explicar impacto técnico sin absolutismos** — Comunicar que reconexión plena puede reactivar exfiltración, persistencia o lateralidad. Reconocer la pérdida operativa y presentar alternativas con riesgo y tiempo aproximado, sin inventar SLA.

**2. Revisar alternativas de continuidad** — Examinar failover a réplica validada, servicio de solo lectura si aplica y es realmente seguro, restauración desde backup verificado, activación de DR o cola de operaciones mientras se investiga.

**3. Diseñar mínimo egreso/ingreso** — Si se debe operar el activo: segmentarlo y permitir solo flujos esenciales identificados (fuentes, destinos, puertos, identidad de servicio); denegar salida a Internet y movimiento lateral no imprescindible. Lo implementa redes bajo gestión de cambios de emergencia.

**4. Comprobar identidad y secretos** — No reusar cuentas de servicio y secretos presuntamente comprometidos sin plan de rotación. Verificar controles de acceso, permisos, cuentas y endpoints dependientes antes de reabrir tráfico.

**5. Instalar controles compensatorios** — Telemetría independiente en firewall/DB/app, alertas de volumen, inspección de rutas y responsable con autoridad para volver a bloquear. No depender de que el EDR siga pudiendo detener el proceso malicioso.

**6. Obtener una decisión documentada** — El responsable de incidente coordina la decisión con el negocio y las funciones habilitadas; el analista ofrece recomendación, escenarios y nivel de incertidumbre. Si se acepta riesgo residual, registrar alcance, ventana y condiciones de reversión.

**7. Ejecutar restauración gradual si procede** — Primero pruebas controladas, monitorizar errores, conexiones y tasas de bytes; apertura progresiva únicamente después de verificación. Si vuelve el indicador crítico, reinstaurar contención sin debate prolongado.

**8. Mantener evidencia e investigar** — Antes de rehacer imágenes o reprovisionar, recopilar lo indispensable para investigación conforme al playbook. Documentar qué servicio fue alterado, cuándo, y si hubo contaminación de réplica/backup.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Acción EDR y reglas de firewall con versión/ID | Evidencia de control y límites; no basta capturar un botón marcado como aislado. |
| Inventario de dependencias y diagrama de flujo | Identifica servicios que realmente requieren acceso y evita excepciones globales. |
| Salud de réplica, backups y verificación de integridad | Evalúa failover; un backup existente no demuestra ser seguro o restaurable. |
| IP/destino y bytes durante ventana de pruebas | Determina si un egreso inesperado reaparece al restablecer servicio. |
| Estado de credenciales, roles y cuentas de servicio | Descarta rutas de autenticación innecesarias con identidades afectadas. |
| Acta de excepción: dueño del riesgo, duración y criterios | Traza la decisión de negocio y los controles compensatorios aprobados. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics · verificación de tráfico permitido durante contingencia

**Requisito:** CommonSecurityLog de firewall; los valores de DeviceAction varían por fabricante. No usar listados literales Allow/Deny como verdad global.

```kql
let src="10.20.5.10";
CommonSecurityLog
| where TimeGenerated > ago(2h)
| where SourceIP == src
| summarize volumen=sum(tolong(SentBytes)), eventos=count()
  by bin(TimeGenerated, 5m), DestinationIP, DestinationPort, DeviceAction
| order by TimeGenerated desc, volumen desc
```

**Interpretación:** Comprueba si aparecen destinos fuera de la lista permitida y si aumenta el volumen tras una excepción.

**Límites:** El campo SentBytes puede representarse a fin de sesión; no usar esta consulta como prueba única ni como monitor de latencia cero.

#### Defender XDR · conexiones por procesos durante pruebas de servicio

**Requisito:** DeviceNetworkEvents de MDE sobre equipo aislado o reintroducido en modo controlado; verificar que el agente siga reportando.

```kql
DeviceNetworkEvents
| where Timestamp > ago(2h)
| where DeviceName startswith "DB-PRD-01"
| summarize eventos=count(), primera=min(Timestamp), ultima=max(Timestamp)
  by RemoteIP, RemotePort, InitiatingProcessFileName,
     InitiatingProcessAccountName, ActionType
| order by ultima desc
```

**Interpretación:** Permite cruzar servicio esencial esperado con proceso originador y acceso a destinos nuevos.

**Límites:** No mide datos transmitidos ni garantiza visibilidad si el endpoint quedó offline o en aislamiento que restringe telemetría.

### SPL: consultas de investigación

#### Splunk CIM Network_Traffic · conexiones permitidas/bloqueadas de DB-PRD-01

**Requisito:** Modelo Network_Traffic CIM; src debe corresponder a IP/host real en dispositivo, NAT correctamente resuelto.

```spl
| tstats count sum(All_Traffic.bytes_out) as bytes_fuera
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-2h latest=now All_Traffic.src="10.20.5.10"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - bytes_fuera
```

**Interpretación:** Comparación de rutas usadas mientras se mantiene operación restringida.

**Límites:** Verificar normalización de action y contar solo fuentes adecuadas para no duplicar bytes.

#### Splunk CIM · evolución temporal de egreso tras cambio

**Requisito:** Igual fuente/índice normalizado durante todo el intervalo; ventana temporal que abarque apertura o cierre de reglas.

```spl
| tstats sum(All_Traffic.bytes_out) as bytes_fuera count
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-2h latest=now All_Traffic.src="10.20.5.10"
  by _time span=5m All_Traffic.dest
| rename All_Traffic.* as *
| timechart span=5m sum(bytes_fuera) as bytes_fuera
```

**Interpretación:** Correlaciona volumen a lo largo del tiempo con las marcas de cambio de políticas de red.

**Límites:** La agregación vuelve a sumar los destinos por intervalo; contrastar con métrica del firewall y reloj de cambio.

### Comandos de observación y comprobación

**Linux — solo lectura:** Consultar sockets actuales durante recuperación controlada; no establece seguridad ni identidad por sí solo.

```bash
sudo ss -tunap
```

**Linux — solo lectura:** Listar reglas nftables antes de aprobar excepciones. Nunca pegar una regla genérica de ACCEPT en producción.

```bash
sudo nft list ruleset
```

**Linux — solo lectura:** Estado de dependencia de aplicación a nivel servicio sin reiniciar nada.

```bash
systemctl --no-pager --failed
```

**Windows — solo lectura:** Enumerar conexiones TCP para correlación con PID; permisos suficientes requeridos.

```powershell
Get-NetTCPConnection -State Established | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess
```

### Contención y límites de autoridad

No reconectar por simple presión jerárquica sin revisión del responsable de incidente y aceptación de riesgo por autoridad designada. Devolver tráfico mínimo, no Internet en general; el mecanismo puede ser firewall perimetral/NSG/ACL cuando el aislamiento EDR es demasiado amplio. Selective isolation y exclusions dependen del producto y SO; una excepción puede debilitar el aislamiento y no equivale a «modo seguro». Se recomienda recuperación por activo alternativo verificado antes que usar la máquina comprometida.

### Cuándo activar o escalar IR / liderazgo

- El negocio exige un cambio contrario a contención vigente.
- La restauración afectará a sistemas regulados o datos personales con potencial brecha.
- Se necesita autorizar excepción temporal o aceptación formal de riesgo residual.
- No existe alternativa limpia de failover y la disponibilidad es crítica.
- En pruebas reaparecen destinos inusuales o identidades sospechosas.

### Explicaciones legítimas y falsos positivos

- Destino de monitoreo o backup etiquetado como no aprobado por CMDB desactualizada.
- Incremento esperado de transferencia por repoblación de cachés o replicación legítima.
- Fallos de app por DNS, certificados o dependencias ocultas, no por el EDR directamente.
- Error de configuración preexistente que parece consecuencia del aislamiento.
- Alarmas de egreso generadas por una validación de DR ya autorizada.

### Errores frecuentes que penalizan en entrevista

- Reconectar para “ver si pasa otra vez” con una ruta de egreso libre.
- Negarse sin elevar y presentar alternativas concretas de continuidad.
- Interpretar «miles de euros» como una autorización de seguridad.
- Usar una réplica sin comprobar indicios de compromiso y estado de secretos.
- Abrir excepciones indefinidas o de todo Internet para recuperar un único servicio.
- No definir criterios concretos de rollback ante reaparición de exfiltración.

### Perspectiva Red Team y Blue Team

Un atacante que ya consiguió persistencia puede beneficiarse de un restablecimiento apresurado: recupera salida hacia C2, rutas de lateralidad o credenciales válidas. Desde la defensa, la segmentación permite reducir la superficie expuesta mientras el negocio recupera una función concreta. La negociación no sustituye la aceptación formal del riesgo ni una validación técnica posterior.

### Respuesta modelo de entrevista

> No reconectaría plenamente ese servidor por una solicitud verbal: explicaría el riesgo de reiniciar la exfiltración y escalaría de inmediato al comandante de incidente, negocio e infraestructura. Evaluaría un failover o restauración de entorno limpio. Si fuera necesario operar el activo, plantearía conectividad mínima con controles de egreso, seguimiento estrecho, cambio documentado y reversión inmediata si reaparece un indicador. Mi objetivo es reducir la pérdida de negocio sin convertir la restauración en un segundo compromiso.

### Criterios de evaluación del candidato

- [ ] Diferencia decisión de disponibilidad y autoridad para aceptar riesgo.
- [ ] Propone failover/DR/backup verificados antes de reconexión completa.
- [ ] Recomienda excepción mínima y temporal, no acceso libre.
- [ ] Contempla secretos comprometidos y redes laterales.
- [ ] Define monitorización, rollback y responsable explícito.

**MITRE ATT&CK (hipótesis salvo corroboración expresa):** T1041 (Exfiltration Over C2 Channel, si hubo C2), T1567 (Exfiltration Over Web Service, hipótesis), T1078 (Valid Accounts, si hay prueba de credenciales)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/defender-endpoint/network-isolation-exclusions
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://www.cisa.gov/stopransomware/ransomware-guide
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/network-traffic

---

<a id="n2-03"></a>
## N2-03 — El atacante cambia de IP: pasar de bloqueo por IOC a control de egreso

**Nivel:** SOC N2 · **Bloque:** Incident Response y contención

> **Pregunta de entrevista:** Bloqueas la IP utilizada para exfiltración, pero cinco minutos después aparece una nueva conexión hacia otro destino. ¿Cómo impedirías que el atacante continuara cambiando de infraestructura?

### Escenario y objetivo

03:12 UTC. El firewall deja de observar conexiones de DB-PRD-01 hacia 203.0.113.88 tras el bloqueo, pero en menos de cinco minutos detecta conexiones HTTPS desde el mismo host hacia 198.51.100.47 y 192.0.2.20. La evidencia apunta a repetición del patrón de transferencia. Las IP pertenecen a rangos de documentación; no son IOC reales. Se sospecha que el host mantiene un proceso o una identidad capaz de seleccionar otros destinos.

**Objetivo:** Contener una amenaza adaptativa mediante controles centrados en el activo, su identidad y las rutas de salida, en lugar de una lista infinita de indicadores volátiles. Distinguir mitigación de IOC de erradicación de persistencia; verificar efectividad en múltiples capas.

### Hipótesis a contrastar

- Agente comprometido con lista de destinos C2 o infraestructura que rota por DNS/CDN.
- El atacante realiza nuevas conexiones manualmente desde el mismo host y conserva privilegios.
- Proxy corporativo, NAT o almacenamiento cloud hacen que varios destinos representen una sola aplicación legítima.
- Un segundo proceso usa HTTPS, DNS, túnel o servicio en la nube como canal alternativo.
- Varias reglas de firewall no se aplican al trayecto real; el tráfico pasa por otro egress/proxy.
- El origen real es un host vecino y una IP compartida/NAT está induciendo atribución equivocada.

### Procedimiento operativo, paso a paso

**0. Reafirmar la contención y confirmar el mismo activo** — Comparar SourceIP, identidad, proceso, flujo, timestamp y NAT antes de asumir que es el mismo atacante. A la vez, mantener escalado crítico.

**1. Aplicar aislamiento basado en origen** — Si hay autoridad y urgencia, aislar el host desde EDR o a nivel de red. Cuando el servidor deba seguir operando, denegar de manera predeterminada el egreso desde su segmento/identidad de host y crear una lista mínima de destinos corporativos aprobados.

**2. Evitar el «whack-a-mole» de IPs** — Una IP blocklist sirve como IOC inicial, pero no como único control. Controlar acceso a Internet, proxys, DNS externo, VPN, rutas alternativas e IPv6; validar que la política cubra NAT y recursos multihomed.

**3. Proteger las credenciales relevantes** — Identificar service principals, cuentas de servicio, access keys, tokens y credenciales de proxy usadas desde el host. Coordinar revocación/rotación en orden para que otros equipos no sean reutilizados y para no interrumpir indebidamente aplicaciones.

**4. Correlacionar con proceso e identidad** — En EDR buscar conexiones por PID/proceso, cuenta, parent process, ruta y hashes. Distinguir software legítimo comprometido de proceso malicioso; un nombre aparentemente correcto no valida un binario.

**5. Cazar el mismo patrón en otros activos** — Buscar otros hosts que contactaron destinos observados, nuevas conexiones periódicas, egreso inusual y las mismas identidades. No asumir que impedir un host detuvo toda la campaña.

**6. Verificar bloqueo multi-canal** — Observar tráfico permitido y denegado en firewall/proxy, eventos de EDR y rutas DNS. Comprobar si el volumen total desde el origen cae y que no surge nuevo egreso a través de un proxy autorizado.

**7. Investigar persistencia y acceso inicial** — Revisar procesos, servicios/timers, tareas, accesos, modificaciones, módulos y credenciales comprometidas. Preservar evidencia antes de erradicar; reinicio no es plan de erradicación.

**8. Recuperar con control** — Si se confirma compromiso de sistema, preparar reconstrucción desde imagen conocida y secretos rotados; ejecutar pruebas y seguimiento temporal para verificar que no reaparecen destinos o comportamientos.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Secuencia temporal de varias IP de destino | La rotación de destino con mismo host/volumen aumenta sospecha; hay que considerar CDN y balanceo. |
| EDR: mismo InitiatingProcessId + creación + cuenta | Permite vincular conexiones a un mismo proceso; PID solo no es identidad estable entre reinicios. |
| Proxy, DNS y SNI/HTTP host cuando legalmente disponible | Ayuda a atribuir dominios y servicios, pero TLS 1.3/ECH y proxies limitan visibilidad. |
| NAT y dirección IP real por segmento | Evita tratar traducciones o IP compartidas como actores distintos. |
| Control aplicado: egress ACL/firewall + auditoría de cambios | Prueba qué rutas eran alcanzables y qué excepciones se permitieron. |
| Cuenta/token y otros hosts que lo usan | Permite detectar reutilización de identidades comprometidas; no exponer secretos en SIEM. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics · pivote por origen y destinos cambiantes

**Requisito:** CommonSecurityLog ingerido desde firewall de egreso; campos SourceIP, DestinationIP, DestinationPort, SentBytes configurados.

```kql
CommonSecurityLog
| where TimeGenerated > ago(1h)
| where SourceIP == "10.20.5.10"
| summarize primera=min(TimeGenerated), ultima=max(TimeGenerated),
            eventos=count(), bytes_fuera=sum(tolong(SentBytes)),
            acciones=make_set(DeviceAction, 10)
  by DestinationIP, DestinationPort
| extend mib=round(toreal(bytes_fuera)/1048576.0,2)
| order by ultima desc
```

**Interpretación:** Da un listado de destinos observados y primer/último instante, para relacionarlo con el bloqueo inicial.

**Límites:** No identifica por sí mismo C2; destinos pueden corresponder a CDN, servicios y proxies. Ventana y campos NAT deben revisarse.

#### Defender XDR · una misma identidad/proceso hacia múltiples IP

**Requisito:** MDE y DeviceNetworkEvents; DeviceName puede ser FQDN; analizar ActionType en la consola.

```kql
DeviceNetworkEvents
| where Timestamp > ago(2h)
| where DeviceName startswith "DB-PRD-01"
| summarize destinos=dcount(RemoteIP), ips=make_set(RemoteIP, 50),
            puertos=make_set(RemotePort, 20),
            primera=min(Timestamp), ultima=max(Timestamp), eventos=count()
  by DeviceName, InitiatingProcessFileName,
     InitiatingProcessCommandLine, InitiatingProcessAccountName
| where destinos >= 2
| order by destinos desc
```

**Interpretación:** Agrupa conexiones que podrían compartir origen lógico; prioriza procesos que cambian frecuentemente de destino.

**Límites:** La agrupación por comando no garantiza que sea el mismo proceso; para eso agregar PID + ProcessCreationTime/ProcessUniqueId disponible y revisar cobertura.

### SPL: consultas de investigación

#### Splunk CIM Network_Traffic · mapa de destinos por servidor

**Requisito:** CIM All_Traffic mapeado; bytes_out no está presente en todos los firewalls; cambiar IP didáctica.

```spl
| tstats count sum(All_Traffic.bytes_out) as bytes_fuera
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-2h latest=now All_Traffic.src="10.20.5.10"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - bytes_fuera
```

**Interpretación:** Revela amplitud de destinos y el resultado de reglas por destino.

**Límites:** Al cambiar IPs de egreso/proxy puede requerirse una correlación por host, usuario o NAT que CIM por sí solo no ofrece.

#### Splunk CIM Network_Traffic · velocidad de aparición de nuevos destinos

**Requisito:** Requiere fuentes con eventos de conexiones representativos y All_Traffic.dest normalizado.

```spl
| tstats min(_time) as primer_contacto count as eventos
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-2h latest=now All_Traffic.src="10.20.5.10"
  by All_Traffic.dest
| rename All_Traffic.dest as dest
| eval primer_contacto=strftime(primer_contacto, "%Y-%m-%d %H:%M:%S %Z")
| sort primer_contacto
```

**Interpretación:** Ordena los nuevos destinos para cotejar con cada decisión de bloqueo.

**Límites:** La búsqueda mira solo la ventana seleccionada: «primer contacto» es primer registro visible, no primera vez histórica del destino.

### Comandos de observación y comprobación

**Linux — solo lectura:** Revisar sockets establecidos y proceso asociado; no es el método primario de contención.

```bash
sudo ss -tunap state established
```

**Linux — solo lectura:** Resolver contexto del PID seleccionado sin borrar ni detener.

```bash
sudo ps -o pid,ppid,user,lstart,args -p 1234
```

**Linux — solo lectura:** Listar timers y servicios activos para orientar búsqueda de persistencia.

```bash
systemctl list-timers --all --no-pager
```

**Linux — solo lectura:** Observar rutas IPv4 e IPv6 sin introducir cambios en red.

```bash
ip route show; ip -6 route show
```

### Contención y límites de autoridad

Preferir aislar el activo / reducir egreso mediante listas de destinos explícitamente autorizados y revisar acceso a proxies/DNS/IPv6. La salida 443 abierta a todo Internet equivale a permitir otra ruta para muchos tipos de exfiltración. Una regla temporal de bloqueo específica puede ser necesaria como primera medida, pero su cobertura se valida en el firewall que realmente ve el flujo. Se requieren aprobación, comprobación y rollback definidos; no borrar evidencias o procesos sin preservar el contexto.

### Cuándo activar o escalar IR / liderazgo

- Reaparición de flujos tras una regla de bloqueo.
- El mismo proceso/identidad contacta múltiples destinos no autorizados.
- Aparición de otros hosts con un patrón equivalente.
- Borrado de logs, evasión de proxy o saltos de seguridad.
- Necesidad de restringir egreso de segmentos completos o rotar credenciales de servicio.

### Explicaciones legítimas y falsos positivos

- CDN y DNS geo-distribuido con muchas IP de un mismo servicio autorizado.
- Proxy de seguridad con un origen aparente común por NAT.
- Balanceadores con rotación de IP y servicio legítimo respaldado por cambio aprobado.
- Actualización de agente de seguridad/proveedor de backups que usa varios endpoints.
- Picos al reconectar tras un corte, con contadores de bytes diferidos.

### Errores frecuentes que penalizan en entrevista

- Añadir IPs a una blocklist indefinidamente sin contener el origen.
- Ignorar IPv6, otro proxy o una interfaz secundaria.
- Confiar en que bloqueo de 443 externo no rompa una dependencia legítima; validar.
- Atribuir una IP de CDN compartida a un atacante sin evidencias adicionales.
- Asumir que matar PID es erradicación y no buscar servicio/tarea que lo recrea.
- No comprobar que la política alcanzó el punto de egreso correcto.

### Perspectiva Red Team y Blue Team

Infraestructura de mando y exfiltración puede cambiar de IP o servicio sin modificar el origen comprometido. Esta es una limitación defensiva del IOC aislado; el patrón comportamental, la identidad, el proceso y las restricciones de egreso son controles más estables. Desde Blue Team se investiga primero la continuidad del flujo, luego el mecanismo que le permitió persistir.

### Respuesta modelo de entrevista

> Dejaría de perseguir cada IP como defensa principal. Contendría el servidor o su identidad de red con una política de egreso restrictiva y solo excepciones empresariales necesarias. Correlacionaría en firewall, proxy, DNS y EDR los procesos, cuentas y destinos cambiantes, revisaría otros hosts y rotaría secretos afectados de manera coordinada. Verificaría que no queda ruta alternativa, incluyendo proxies e IPv6, antes de hablar de contención eficaz; después pasaría a erradicación y recuperación.

### Criterios de evaluación del candidato

- [ ] Diferencia un IOC efímero de un control eficaz basado en origen.
- [ ] Propone aislamiento/allowlist/egreso mínimo.
- [ ] Correlaciona proceso, identidad, proxy y DNS.
- [ ] Comprueba rutas y otras interfaces/hosts.
- [ ] Separa contención, erradicación y validación de recuperación.

**MITRE ATT&CK (hipótesis salvo corroboración expresa):** T1071 (Application Layer Protocol, hipótesis), T1567 (Exfiltration Over Web Service, hipótesis), T1090 (Proxy, si hay evidencia), T1041 (Exfiltration Over C2 Channel, hipótesis)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/network-traffic
- https://learn.microsoft.com/en-us/defender-endpoint/network-isolation-exclusions

---

<a id="n2-04"></a>
## N2-04 — Cuenta Domain Admin comprometida: contención coordinada sin regalar tiempo

**Nivel:** SOC N2 · **Bloque:** Incident Response y contención

> **Pregunta de entrevista:** Un atacante tiene acceso a una cuenta administrativa de dominio. Cambiar la contraseña podría alertarlo. ¿Cómo planificarías la contención?

### Escenario y objetivo

02:30 UTC. El equipo de identidad y el SOC encuentran actividad anómala desde la cuenta adm-ops, miembro de Domain Admins, en DC-01 y dos servidores de archivos. La cuenta se usó desde una estación no aprobada. No hay certeza sobre robo de contraseña, ticket Kerberos, token o ejecución por malware. El administrador legítimo indica no haber trabajado esa noche. Múltiples equipos dependen de recursos AD; desconectar los controladores de dominio sin plan podría interrumpir servicios esenciales.

**Objetivo:** Tratar el compromiso como exposición de alto privilegio, contener sesiones y puntos de acceso de forma coordinada, evitar que la alerta al adversario genere una segunda ola, y comprobar si se alteró el directorio. No retrasar indefinidamente acciones de contención para preservar sigilo.

### Hipótesis a contrastar

- Robo de credenciales y uso interactivo o remoto de cuenta privilegiada.
- Uso de ticket Kerberos, hash NTLM o sesión reutilizada; contraseña cambiada no invalida siempre artefactos existentes de inmediato.
- Host administrativo comprometido que recreará sesiones si solo se rota la contraseña.
- Actividad legítima fuera de ventana desde estación no registrada; confirmar por canal independiente.
- Alteración de grupos privilegiados, políticas, delegaciones o mecanismos de persistencia AD.
- Compromiso potencial del DC/krbtgt; esto cambia radicalmente alcance y estrategia de recuperación, pero NO se presume por un solo inicio de sesión.

### Procedimiento operativo, paso a paso

**0. Activa respuesta mayor y asegúrate de tener canal seguro** — Escalar a IR/identidad/CISO; usar cuentas y comunicaciones conocidas limpias, preferiblemente fuera de banda si existe riesgo de lectura de correo corporativo por el atacante.

**1. Establece alcance mínimo en paralelo** — Extraer horas/host/origen, LogonType, 4624/4672/4648, privilegios, Kerberos/NTLM y actividad de la cuenta. Validar con el titular de manera independiente; revisar otros endpoints usados.

**2. Asegura el punto de mando antes del cambio** — Preparar acceso administrativo limpio de emergencia, privilegios separados y canal de coordinación, verificando que existen administradores de respaldo; evitar que una rotación precipitada deje a la organización sin gestión.

**3. Contener simultáneamente cuenta y estaciones** — Con autoridad y plan previo: limitar/deshabilitar temporalmente la cuenta, restringir accesos VPN/PAW/RDP y aislar endpoints comprometidos. Sincronizar revocación de sesiones/tokens cloud cuando aplique, cambio de credenciales y bloqueo de puntos de entrada.

**4. Asumir persistencia hasta descartarla** — Buscar cambios en membresías privilegiadas, nuevas cuentas, GPO, permisos, delegación, servicios, tareas y acceso a DCs; revisar la línea temporal desde el primer evento sospechoso.

**5. Evaluar exposición de secretos y tickets** — La rotación de contraseña puede no invalidar inmediatamente ciertos tickets, sesiones o hashes capturados; establecer condiciones de expiración/revocación y comprobar nuevas autenticaciones con socios de identidad.

**6. Si hay indicios de krbtgt/DC afectado, cambiar de playbook** — Elevar a especialistas de recuperación AD: el doble reseteo de krbtgt es un procedimiento de alto impacto, y NO se realiza automáticamente por sospecha de una sola cuenta. Exige comprender replicación, política de lifetime de tickets, dependencias y secuencia de recuperación; en la guía de forest recovery Microsoft indica dos resets separados al menos por la vigencia de tickets configurada (10 h por defecto).

**7. Preservar antes de erradicar de forma destructiva** — Guardar eventos de DC, EDR, configuración y cambios, cronología y trazabilidad de acciones. Los operadores de IR deciden adquisición de memoria y disco según prioridad y estabilidad.

**8. Recuperación y seguimiento** — Restaurar privilegios usando identidad limpia, auditar persistencia, revisar credenciales y confianza, aplicar hardening (PAW/PIM, MFA resistente al phishing donde aplique, reducción de admin permanente) y monitorizar actividad por varios ciclos.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| SecurityEvent 4624, 4672, 4648 y 4625 | Vincula autenticación y privilegios; 4672 indica privilegios especiales en inicio de sesión, NO prueba exclusiva de Domain Admin. |
| SecurityEvent 4720, 4728/4732, 4738, 4739, 4670 y 5136 si auditados | Señales de altas, membresías, cambios de cuenta/directorio/permisos; hay que interpretar sujeto/objeto y qué se auditó. |
| IdentityLogonEvents / Defender for Identity | Complementa usuario, origen, destino y protocolos si la solución está desplegada. |
| Inventario de PAW, estaciones y conexiones VPN | Ayuda a determinar estación no autorizada y rutas de acceso privilegiado. |
| Cronología de cambios GPO/grupos/ACL y baselines | Identifica persistencia o escalada; cambios aprobados pueden parecer similares. |
| Hash/ticket/token/secretos sospechosos (sin copiarlos al ticket) | Distingue credencial comprometida de sesión viva; los secretos se preservan en repositorio seguro si resulta necesario. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics · eventos de seguridad relacionados con cuenta administrativa

**Requisito:** Tabla SecurityEvent ingerida desde DCs y estaciones; ajustar cuenta adm-ops y dominio; 4624/4672 no son universales en todos los destinos.

```kql
let cuenta="adm-ops";
SecurityEvent
| where TimeGenerated > ago(24h)
| where EventID in (4624, 4625, 4648, 4672, 4720, 4728, 4732, 4738, 5136)
| where Account has cuenta or SubjectAccount has cuenta or TargetAccount has cuenta
| project TimeGenerated, Computer, EventID, Activity, Account,
          SubjectAccount, TargetAccount, IpAddress, LogonType
| order by TimeGenerated asc
```

**Interpretación:** Construye línea temporal inicial de uso, privilegios y cambios potencialmente vinculados a la cuenta.

**Límites:** La auditoría de AD DS y el parser condicionan columnas y cobertura. Para cambios de terceros realizados POR adm-ops, el campo SubjectAccount puede diferir del TargetAccount.

#### Defender XDR Advanced Hunting · logons de identidad y destinos alcanzados

**Requisito:** IdentityLogonEvents requiere Defender for Identity/servicios que la rellenen; validar ActionType y campos en schema.

```kql
IdentityLogonEvents
| where Timestamp > ago(24h)
| where AccountName =~ "adm-ops"
| summarize eventos=count(), inicio=min(Timestamp), fin=max(Timestamp),
            destinos=make_set(DestinationDeviceName, 50),
            protocolos=make_set(Protocol, 20)
  by AccountUpn, IPAddress, DeviceName, ActionType, LogonType
| order by fin desc
```

**Interpretación:** Revela nuevos orígenes, protocolos y alcance de la cuenta y permite priorizar máquinas para contención.

**Límites:** No inferir desde ActionType por una sola cadena que todas las autenticaciones fueron exitosas; ver detalles. Cobertura varía; para sign-ins cloud complementar con logs de Entra.

### SPL: consultas de investigación

#### Splunk CIM Authentication · patrón de logon de cuenta privilegiada

**Requisito:** CIM Authentication con user, src, dest y action mapeados desde eventos Windows/AD; ajustar cuenta.

```spl
| tstats count min(_time) as primera max(_time) as ultima
  from datamodel=Authentication.Authentication
  where earliest=-24h latest=now Authentication.user="adm-ops"
  by Authentication.src Authentication.dest Authentication.action Authentication.app
| rename Authentication.* as *
| convert ctime(primera) ctime(ultima)
| sort - ultima
```

**Interpretación:** Compara orígenes, destino y éxito/fallo normalizados para revisar acceso fuera de baseline.

**Límites:** El CIM Authentication no registra por sí solo membresías AD; exige fuentes Windows específicas. Campos app/action pueden estar vacíos.

#### Splunk · Windows Security EventCode de cambios AD (sourcetype real)

**Requisito:** Ejemplo con sourcetype=WinEventLog:Security; confirmar si tu colector usa XmlWinEventLog:Security u otro, y nombres Account_Name/SubjectUserName según TA.

```spl
sourcetype="WinEventLog:Security" earliest=-24h latest=now
(EventCode=4720 OR EventCode=4728 OR EventCode=4732 OR EventCode=4738 OR EventCode=5136)
| table _time host EventCode SubjectUserName TargetUserName MemberName ObjectDN
| sort _time
```

**Interpretación:** Detecta ventanas con cambios privilegiados para correlación posterior por usuario, objeto y aprobación.

**Límites:** No todos los eventos generan los mismos campos ni están auditados. Esta consulta omite un filtro por cuenta porque los nombres de campo cambian entre TAs; añadirlo después de validar muestras.

### Comandos de observación y comprobación

**Windows — solo lectura:** Enumerar grupos del usuario sin introducir cambios. Requiere RSAT/módulo ActiveDirectory y permisos.

```powershell
Get-ADPrincipalGroupMembership -Identity "adm-ops" | Select-Object Name, DistinguishedName
```

**Windows — solo lectura:** Examinar logons y privilegios recientes en DC con derechos adecuados.

```powershell
Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4624,4672,4728,4732; StartTime=(Get-Date).AddHours(-6)} -MaxEvents 200 | Select-Object TimeCreated,Id,Message
```

**Windows — solo lectura:** Revisar estado y última modificación de cuenta en directorio autorizado.

```powershell
Get-ADUser -Identity "adm-ops" -Properties Enabled,LastLogonDate,PasswordLastSet,MemberOf | Select-Object SamAccountName,Enabled,LastLogonDate,PasswordLastSet,MemberOf
```

**Windows — solo lectura:** Ver grupos locales privilegiados de una estación autorizada; no implica privilegios de dominio.

```powershell
Get-LocalGroupMember -Group Administrators
```

### Contención y límites de autoridad

No basar la estrategia en mantener al atacante desinformado a costa de permitirle continuar. Planificar acciones paralelas, rápidas, por canales seguros: cierre de accesos, aislamiento de estaciones, suspensión o limitación de cuentas, rotación de secretos y validación de autenticación posterior. Deshabilitar una cuenta NO equivale a invalidar instantáneamente todas las sesiones/tickets. Para krbtgt, solo plan específico de especialistas de AD; la guía de forest recovery de Microsoft describe doble reset con espera apropiada, NO un comando rutinario tras cualquier incidente de administrador. Nunca apagar DCs indiscriminadamente.

### Cuándo activar o escalar IR / liderazgo

- Toda confirmación razonable de uso no autorizado de cuenta Domain Admin.
- Cambios no aprobados en AD, políticas, grupos privilegiados o delegaciones.
- Indicios de acceso a DC, DCSync, dumping de secretos o krbtgt afectado.
- Autenticaciones siguen después de contención/rotación planificada.
- Hay riesgo de pérdida de funciones AD o identidad de emergencia durante recuperación.

### Explicaciones legítimas y falsos positivos

- Mantenimiento fuera de horario realizado por PAW o salto de administración conocido.
- Integración legítima con PAM/bastion que origina IP no obvia.
- Evento 4672 habitual en servicios privilegiados, sin ataque confirmado.
- Inicio de sesión de servicio o tarea con nombre parecido a la cuenta investigada.
- Evento de grupo autorizado bajo cambio de seguridad registrado.

### Errores frecuentes que penalizan en entrevista

- Esperar días para «no alertar» al atacante con acceso Domain Admin.
- Rotar contraseña sin aislar estaciones comprometidas ni evaluar sesiones activas.
- Ejecutar doble reset de krbtgt de inmediato sin evidencia y sin coordinación de AD.
- Apagar controladores de dominio indiscriminadamente.
- Confundir 4672 con prueba definitiva de Domain Admin y de intrusión.
- Usar el portátil o cuenta supuestamente comprometidos para coordinar el incidente.
- Cerrar caso tras un cambio de contraseña sin revisar persistencia en GPO/ACL/grupos.

### Perspectiva Red Team y Blue Team

El acceso a privilegios de dominio permite al adversario mantener sesiones, pivotar y preparar persistencia en el directorio. El defensor debe suponer que la simple rotación de contraseña puede no cerrar todas las rutas, porque existe una diferencia entre credencial, ticket, sesión y control del endpoint. La colaboración con equipos de identidad y operaciones reduce ventanas de acceso y riesgos de caída por cambios de gran alcance.

### Respuesta modelo de entrevista

> Lo trataría como un incidente mayor. Primero aseguraría canales de coordinación y acceso administrativo limpio; después coordinaría contención casi simultánea de la cuenta, estaciones usadas y sesiones pertinentes, documentando los riesgos de alertar al atacante y de indisponibilidad. Buscaría autenticaciones, cambios en grupos/GPO/ACL y señales de exposición de secretos. No asumiría que resetear contraseña invalida todos los tickets ni tocaría krbtgt sin evidencia y un plan formal de recuperación de AD. Validaría el resultado con nuevos logs y hunting de persistencia.

### Criterios de evaluación del candidato

- [ ] Activa IR/identidad y coordina canales fuera de banda cuando corresponde.
- [ ] Contiene cuenta, sesión y endpoint; no solo contraseña.
- [ ] Conoce diferencias entre tickets, sesiones, secretos y rotación.
- [ ] No confunde 4672 con compromiso de Domain Admin.
- [ ] Evita procedimientos peligrosos de krbtgt/DC sin evidencia.
- [ ] Revisa persistencia en grupos, GPO, ACL y delegación.

**MITRE ATT&CK (hipótesis salvo corroboración expresa):** T1078.002 (Valid Accounts: Domain Accounts, hipótesis), T1098 (Account Manipulation, si hubo cambios), T1558 (Steal or Forge Kerberos Tickets, si hay pruebas), T1003.006 (DCSync, solo si corroborado)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://learn.microsoft.com/en-us/defender-for-identity/remediation-actions
- https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-reset-the-krbtgt-password
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/securityevent
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-identitylogonevents-table
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/authentication

---

<a id="n2-05"></a>
## N2-05 — Servidor crítico no aislable: contención compensatoria y controlada

**Nivel:** SOC N2 · **Bloque:** Incident Response y contención

> **Pregunta de entrevista:** Un servidor de producción presenta indicadores de compromiso, pero no puedes apagarlo ni aislarlo completamente. ¿Qué medidas compensatorias aplicarías?

### Escenario y objetivo

07:40 UTC. APP-PRD-02 aloja un servicio de facturación con obligaciones de disponibilidad y conexiones a DB-PRD-01, pasarela de pagos, DNS y monitorización. Un EDR indica ejecución anómala por la cuenta svc-billing, pero el equipo de operaciones declara que el aislamiento total detendría la facturación. La investigación todavía no confirma lateralidad ni fuga; sí existen comunicaciones no explicadas hacia 203.0.113.200:443. SOC, IR, negocio y redes acuerdan mantenerlo operando solo si se reduce el riesgo dentro de una ventana controlada.

**Objetivo:** Diseñar contención parcial proporcional y comprobable en un sistema no aislable: restringir egreso e ingreso, credenciales y privilegios, proteger dependencias, aumentar detección y preparar plan de fallo y recuperación. Declarar abiertamente el riesgo residual.

### Hipótesis a contrastar

- La aplicación o su cuenta de servicio está comprometida y genera tráfico saliente propio.
- Una dependencia autorizada (monitorización, pasarela o proveedor) explica actividad inesperada.
- El atacante usa canal saliente HTTPS en un proceso legítimo; un bloqueo de puerto único no basta.
- Un cambio precipitado de credenciales de servicio o reglas de red podría tumbar la aplicación.
- El servidor actúa como pivote interno a DB, SMB o puertos de administración.
- El EDR no cubre toda actividad o el host presenta telemetría incompleta.

### Procedimiento operativo, paso a paso

**0. Aceptación del contexto y mando** — Declarar que el activo no está «seguro», sino operando bajo control temporal. Validar decisión con IR, negocio y operaciones, y abrir registro formal con dueño y plazo del riesgo.

**1. Mapear flujos mínimos de negocio** — Identificar fuentes usuarias, destinos DB/pagos/DNS/monitorización, puertos, protocolos y secretos reales. Con inventario y logs distinguir indispensables de heredados.

**2. Contención de egreso** — Aplicar en firewall/NSG/ACL una política de denegación para Internet desde el servidor, salvo endpoints aprobados estrictamente necesarios. Verificar también tráfico IPv6, NAT y acceso a proxy; documentar excepciones justificadas.

**3. Contención de ingreso y lateralidad** — Limitar acceso de administración a bastion/PAW, restringir SMB/RDP/SSH no necesarios, reducir comunicaciones a otros servidores y limitar la DB a flujos de aplicación indispensables. No olvidar canal de monitoreo y recuperación.

**4. Controlar identidad y privilegios** — Evaluar si svc-billing tiene permisos excesivos; preparar reemplazo/rotación de secretos, revocación de tokens y reglas de autenticación con pruebas de dependencia. No hacer una rotación sin coordinación que corte facturación.

**5. Incrementar vigilancia** — Activar telemetría útil y aprobada: logs firewall/proxy/DNS, procesos/EDR, autenticación y actividad DB. Ajustar umbrales a baseline, emitir alertas de egreso nuevo o incremento anómalo y vigilar integridad de sensores.

**6. Preservar evidencia** — Crear snapshot consistente/imagen y adquirir logs de fuentes fuera de banda si es viable. Evitar instalar herramientas intrusivas o reiniciar antes de coordinar con forense y SRE.

**7. Preparar planes de contingencia** — Establecer quién puede cortar conectividad completamente si hay cifrado, exfiltración activa o movimiento lateral. Planificar failover a instancia limpia y recuperación si los indicadores crecen.

**8. Verificar por simulación segura** — Comprobar desde fuentes de telemetría que solo pasa tráfico previsto y que las reglas realmente bloquean destinos fuera de allowlist; no se necesita generar ataques reales ni exfiltrar datos para verificar la política.

**9. Salir del modo degradado** — Reconstruir o remediar desde estado limpio tras investigación, rotar secretos, auditar dependencias y volver a baseline progresivamente. No mantener indefinidas las reglas temporales ni dar por curado el host porque deje de emitir alertas.

### Evidencias y lectura

| Dato | Interpretación |
|---|---|
| Matriz de flujos mínima con puertos, orígenes y destinos | Base objetiva para política de segmentación; requiere validación de operaciones. |
| CommonSecurityLog/Network_Traffic: permitido versus denegado | Verifica controles; comparar por fuente, destino y tiempo antes/después. |
| EDR: proceso, SHA1, cuenta, ruta, hijos y conexiones | Cruzado con flujos, orienta si aplica a cuenta legítima o proceso ajeno. |
| Logs de identidad y permisos de svc-billing | Revela uso anómalo y servicios que se romperían con rotación. |
| Tráfico DNS/proxy, flujos IPv6 y NAT | Ayuda a encontrar rutas que el firewall inicial no cubría. |
| Snapshot consistente y logs forenses disponibles | Necesita política de custodia y verificación de respaldo sin romper producción. |
| Dueño del riesgo, hora de expiración y disparadores de aislamiento | Evita que la excepción temporal se convierta en exposición permanente. |

### KQL: consultas de investigación

#### Sentinel / Log Analytics · lista de flujos realmente observados

**Requisito:** CommonSecurityLog con acción, IP origen, destino y puerto; IP ficticia de APP-PRD-02=10.20.5.12.

```kql
let src = "10.20.5.12";
CommonSecurityLog
| where TimeGenerated > ago(24h)
| where SourceIP == src
| summarize eventos=count(), bytes_fuera=sum(tolong(SentBytes)),
            primera=min(TimeGenerated), ultima=max(TimeGenerated)
  by SourceIP, DestinationIP, DestinationPort, DeviceAction
| order by bytes_fuera desc
```

**Interpretación:** Construye flujos relevantes para validarlos con propietarios de servicios antes de permitirlos.

**Límites:** La observación no equivale a autorización; una actividad maliciosa puede formar parte del baseline reciente y contadores están sujetos a semántica de proveedor.

#### Defender XDR · proceso/cuenta asociada a conexiones inesperadas

**Requisito:** MDE integrado; la tabla permite eventos de conectividad, no bytes. Revisar nombres DNS e identidad antes de filtrar.

```kql
DeviceNetworkEvents
| where Timestamp > ago(24h)
| where DeviceName startswith "APP-PRD-02"
| summarize conexiones=count(), destinos=make_set(RemoteIP, 50),
            puertos=make_set(RemotePort, 20), ultima=max(Timestamp)
  by InitiatingProcessFileName, InitiatingProcessCommandLine,
     InitiatingProcessAccountName, ActionType
| order by ultima desc
```

**Interpretación:** Prioriza cuentas y procesos con conexiones fuera de la matriz de dependencias autorizadas.

**Límites:** Un proceso legítimo puede estar inyectado o abusado y un proceso malicioso puede imitar su nombre; requiere árbol de procesos, certificados y artefactos.

### SPL: consultas de investigación

#### Splunk CIM Network_Traffic · matriz de tráfico observada

**Requisito:** CIM Network_Traffic con src/dest/dest_port/action; el mapeo dependerá del fabricante y del TA.

```spl
| tstats count sum(All_Traffic.bytes_out) as bytes_fuera
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-24h latest=now All_Traffic.src="10.20.5.12"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| sort - bytes_fuera
```

**Interpretación:** Lista flujos para confrontar con matriz de dependencias de la aplicación y controles de egreso.

**Límites:** Si el tráfico es interno y no pasa por firewall de egreso, el dataset puede no mostrarlo; complementar con sensores este-oeste.

#### Splunk CIM Network_Traffic · nuevos flujos posteriores al cambio

**Requisito:** CIM Network_Traffic normalizado; ajustar earliest al instante de cambio real.

```spl
| tstats min(_time) as primera max(_time) as ultima count
  from datamodel=Network_Traffic.All_Traffic
  where earliest=-4h latest=now All_Traffic.src="10.20.5.12"
  by All_Traffic.dest All_Traffic.dest_port All_Traffic.action
| rename All_Traffic.* as *
| eval primera=strftime(primera,"%Y-%m-%d %H:%M:%S"),
       ultima=strftime(ultima,"%Y-%m-%d %H:%M:%S")
| sort primera
```

**Interpretación:** Permite comprobar nuevos destinos/puertos durante el periodo de contención compensatoria.

**Límites:** Ordenar strings de fecha funciona en formato fijo y zona horaria homogénea; preferir guardar epoch para correlación más rigurosa.

### Comandos de observación y comprobación

**Linux — solo lectura:** Ver rutas y gateways para comprobar redes previstas sin crear reglas.

```bash
ip route show; ip -6 route show
```

**Linux — solo lectura:** Inventario de puertos en escucha y sockets establecidos. El comando no contiene el incidente.

```bash
sudo ss -tunap
```

**Linux — solo lectura:** Inspeccionar reglas vigentes antes/después de un cambio aplicado por redes.

```bash
sudo nft list ruleset
```

**Linux — solo lectura:** Servicios fallidos o afectados para medir impacto operacional.

```bash
systemctl --no-pager --failed
```

**Windows — solo lectura:** Comprobar configuración de conexiones observadas desde host Windows sin desconectarlas.

```powershell
Get-NetTCPConnection | Select-Object LocalAddress,LocalPort,RemoteAddress,RemotePort,State,OwningProcess
```

### Contención y límites de autoridad

Las medidas compensatorias no equivalen a erradicación: son una reducción temporal y documentada del riesgo. Diseñar default-deny para egreso y lateralidad, canales de administración verificados, excepciones restringidas, secrets/PAM y alertas reforzadas. Si la solución de EDR soporta aislamiento selectivo en el SO correspondiente, estudiar sus exclusiones con máxima cautela: no aplican al aislamiento completo y cada excepción debilita el aislamiento. Preferir segmentación de red central cuando las dependencias y las capacidades EDR lo aconsejen. Si hay daño acelerado, el umbral de protección puede prevalecer sobre disponibilidad según el plan aprobado.

### Cuándo activar o escalar IR / liderazgo

- El servicio es regulado o el riesgo residual no tiene propietario que lo acepte.
- Aparece cifrado, nuevas conexiones de alto volumen, movimiento lateral o elevación de privilegios.
- La política de egreso no cubre proxy, NAT, IPv6 o interfaces alternas.
- No existe cobertura de logs suficiente para verificar controles temporales.
- Una restricción necesaria rompe una dependencia crítica y exige decisión de negocio.

### Explicaciones legítimas y falsos positivos

- Pasarela de pagos legítima con nuevas IPs documentadas.
- Monitoreo o CDN con endpoints rotatorios para una aplicación real.
- Tráfico de base de datos entre zonas que pasa por un proxy o balanceador.
- Agente corporativo firmado que actualiza destinos durante mantenimiento.
- Transferencia legítima generada por facturación de cierre de mes, fuera de baseline reciente.

### Errores frecuentes que penalizan en entrevista

- Confundir «no podemos aislar» con «no podemos contener nada».
- Permitir salida 0.0.0.0/0 a 443 y declararlo egreso restringido.
- Rotar secretos de producción sin verificar consumidores y dependencias.
- Creer que un EDR con pocas alertas equivale a un servidor limpio.
- No designar propietario de excepción, plazo ni umbral de aislamiento total.
- Ignorar tráfico lateral a DB/SMB e IPv6 mientras solo se bloquea Internet.
- Aplicar cambios remotos disruptivos sin rollback o consola alternativa.

### Perspectiva Red Team y Blue Team

Si el servidor permanece accesible, un adversario puede seguir aprovechando credenciales y flujos de negocio para pivotar o exfiltrar datos. Reducir derechos, rutas y destinos disminuye la libertad de movimiento, aunque no elimina la amenaza ya instalada. Desde defensa se mide cobertura real, se preserva telemetría y se establece un punto de corte si la situación empeora.

### Respuesta modelo de entrevista

> Si no puedo aislar completamente el servidor, aplicaría contención compensatoria acordada con IR y operaciones: egreso solo hacia destinos esenciales, restricción de administración y lateralidad, control de cuentas/secretos, EDR y monitorización de firewall/DNS/procesos reforzadas. Establecería un dueño y plazo del riesgo, un plan de failover y un criterio explícito para aislar completamente si aparece actividad destructiva o exfiltración. Tras contener, preservaría evidencia, investigaría y reconstruiría desde estado confiable; no declararía erradicación solo porque el servicio continúe funcionando.

### Criterios de evaluación del candidato

- [ ] Propone segmentación y egreso con mínimo privilegio.
- [ ] Contempla negocio y dependencia real de servicios.
- [ ] Protege identidad, administración y lateralidad.
- [ ] Incluye observabilidad fuera del host y prueba de eficacia.
- [ ] Declara riesgo residual y plazo de medidas temporales.
- [ ] Prepara fallback a aislamiento completo y recuperación limpia.

**MITRE ATT&CK (hipótesis salvo corroboración expresa):** T1041 (Exfiltration Over C2 Channel, hipótesis), T1021 (Remote Services, si hay movimiento lateral), T1078 (Valid Accounts, si hay uso indebido), T1562.001 (Impair Defenses, solo si observado)

### Fuentes de documentación

- https://csrc.nist.gov/pubs/sp/800/61/r3/final
- https://www.cisa.gov/stopransomware/ransomware-guide
- https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table
- https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/commonsecuritylog
- https://learn.microsoft.com/en-us/defender-endpoint/network-isolation-exclusions
- https://help.splunk.com/en/splunk-enterprise/common-information-model/6.1/data-models/network-traffic

---

## Mini-playbook de bolsillo: primeros 60 segundos (N2-01)

| Intervalo indicativo | Prioridad | Resultado exigible |
|---|---|---|
| 0–5 s | Confirmar origen/alarma crítica y activar incidente | ID de activo y urgencia documentados |
| 5–15 s | Aplicar contención aprobada en EDR/egreso | Estado de acción emitida, responsable |
| 15–25 s | Verificar tráfico permitido, volumen y rutas alternas | Prueba de contención efectiva o fallo explícito |
| 25–35 s | Coordinar IR, negocio, infraestructura | Decisor y comunicación de riesgo |
| 35–45 s | Preservar ID/logs/UTC en repositorio autorizado | Evidencia inicial identificable y custodiada |
| 45–60 s | Pivote controlado proceso/identidad/conexiones | Hipótesis de persistencia y próximos pasos |

> **Los intervalos son ilustrativos**. No garantizan que las acciones remotas se completen en 60 segundos. Priorización, permisos y respuesta del producto pueden exigir ejecución simultánea y escalado inmediato.

## Plantilla de registro de decisión del comandante de incidente

```text
INCIDENTE: IR-XXXX  |  UTC: ______________  |  RIESGO: ___________
ACTIVO/OWNER: _____________  |  IMPACTO DE NEGOCIO: ___________
HECHO OBSERVADO: ______________________________________________
FUENTE/EVIDENCIA ID: __________________________________________
HIPÓTESIS / CONFIANZA: ________________________________________
ACCIÓN SOLICITADA: ___________  HORA UTC: ____________________
ACCIÓN APLICADA (confirmación técnica): _______________________
EGRESO ANTES / DESPUÉS: ______________________________________
EXCEPCIONES TEMPORALES: __________________ EXPIRACIÓN: _________
RIESGO RESIDUAL: _______________  ACEPTADO POR: _____________
TRIGGER DE RE-AISLAMIENTO: __________________________________
EVIDENCIAS PRESERVADAS Y CUSTODIO: __________________________
PRÓXIMA REVISIÓN / RESPONSABLE: _____________________________
```

## Notas de implementación web SOC-RESPONSES

- Las claves JSON `schema_version`, `preguntas[]`, `kql[]`, `spl[]`, `pasos[]` y demás campos conservan el formato de las tandas 01–04.
- Propuesta didáctica: simulador con temporizador opcional → decisión inicial → resultado de contención → telemetría/KQL/SPL → red team → entrevista → autoevaluación.
- Mostrar siempre etiquetas `consulta demostrativa`, `requisitos de ingesta`, `no probada en entorno real` y un aviso antes de ejecutar cualquier comando disruptivo.
- Para una simulación, cargar JSON de forma local; no vincular directamente acciones EDR/firewall/AD de producción a una respuesta del alumno.
- Separar descubrimiento, contención, verificación, erradicación y recuperación en la UI, ya que son fases y responsables distintos.

**Estado:** Tanda 05 terminada; N2-01 a N2-05. La tanda 06 (N2-06 a N2-10) se trabajará solo tras el siguiente GO.
