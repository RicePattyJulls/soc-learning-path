# Mundo de Redes — Tanda 4/7: especialización SOC + Red Team

**Fecha de consulta:** 2026-10-18 · **Estado:** diseño documental (no aprobado; sin ejecución de prácticas).
**Alineación:** investigación y diseño curricular conforme a `redes.txt`; no implementación de academia ni modificación de repositorios.

## A. Alcance, método y punto de partida

Se investigaron fuentes primarias (RFC/IETF, NIST, MITRE ATT&CK, documentación oficial de Wireshark/Zeek/Suricata, Microsoft y Splunk). Se empleó **un ciclo RESEARCHER → CRITIC → integración**: (1) contrastar documentación, (2) detectar inferencias, cambios de esquema, ausencia de pruebas y riesgo pedagógico, (3) incorporar correcciones. Hasta cinco ciclos se permitirían, pero no se han simulado revisiones adicionales.

- **Documentado:** hechos atribuidos a documentos oficiales y enumerados en el registro F01–F24.
- **Inferido:** conclusiones justificadas sobre cómo medir visibilidad, corroboración y atribución; no equivalen a resultados experimentales.
- **Propuesto:** objetivos, rúbricas, casos y pruebas educativas; falta aprobación y ejecución.
- **Fuera de alcance:** ataques reales, DoS, persistencia, evasión, extracción de datos, escaneo de terceros, ejecución de herramientas, instalación y código de SIEM no validado.

- Arquitectura de la Tanda 2 conservada: **42 módulos**, 8 etapas, **592 h estimadas** para el conjunto. La auditoría de la Tanda 3 también permanece sin modificar.
- El foco curricular profundo es **RED-M26 a RED-M35**. Son diez módulos ya existentes: no se inventan RED-M43 ni cambios en desbloqueos.
- Integridad de referencia Tanda 2 JSON: `32e677fc52531e31a21da9e71222e9296abdd02fb02c286a9e689fb74d69ef3e` (SHA-256).
- Integridad de referencia Tanda 3 JSON: `891cfcce7d09d7c90e6ae09d109eab6e7b1c86a981c68fd624ba5796b4ac3367` (SHA-256).

## B. Conclusiones importantes respaldadas

1. **La detección y respuesta siguen una gestión continua del riesgo**: NIST SP 800-61 Rev. 3 (abril 2025) sustituye a Rev. 2. La secuencia didáctica abarca evidencias, autorización, contención proporcional, recuperación y mejora, no solo cerrar alertas. [F01]
2. **ATT&CK no constituye prueba de compromiso**: las páginas de *Data Sources* están deprecadas desde la versión 18 (octubre 2025); revisar los *Data Components* y *Detection Strategies* vigentes, por ejemplo DET0376 para descubrimiento. Los IDs ATT&CK describen técnicas/comportamientos, no un veredicto automático. [F11–F15]
3. **IPFIX es un protocolo de exportación de información de flujos**, no PCAP ni un conjunto fijo de atributos; la ubicación de observación, templates, muestreo y sentido condicionan lo que se puede afirmar. [F03]
4. **Zeek conn.log registra tanto TCP como UDP**; no interpretar `conn_state` como equivalente a un handshake TCP en tráfico UDP. [F08]
5. **Suricata 8.0.0 EVE DNS utiliza por defecto formato v3**. El mapeo tiene que declarar versión; no asumir compatibilidad semántica entre versiones. [F10]
6. **Wireshark/TShark distingue filtros de captura y de visualización** (`-f`/`-Y` en TShark). Un filtro restrictivo o pérdida de captura puede eliminar evidencia antes de su análisis. [F06–F07]
7. **Syslog/CEF mediante AMA no implica timestamps idénticos**: en Microsoft Sentinel, `TimeGenerated` y `EventTime` tienen distinto origen y pueden diferir por husos/forwarders; hay posibilidad de duplicados entre `CommonSecurityLog` y `Syslog` por configuración. [F18]
8. **ASIM, CIM, CEF y MDE no son mapeos 1:1**: los campos documentados y los parsers necesitan fuente, habilitación y comprobación. Splunk CIM 6.1 define Network Traffic y Microsoft describe ASIM Network Session/DNS y DeviceNetworkEvents. [F19–F24]

## C. Modelo de cadena de evidencia y telemetría

Para cada hallazgo, exigir: **evento original → emisor/sensor → punto de observación → colector → parser/transformaciones → sistema de consulta → informe**, con identidad de dataset, hora UTC, desfase conocido, pérdida/muestreo, hash cuando corresponda, retención, incertidumbre y autorización de acceso. No confundir ausencia de logs con ausencia del evento.

| ID | Fuente | Observa principalmente | Límite que debe verbalizarse | Módulo |
|---|---|---|---|---|
| T01 | PCAP / pcapng | 5-tupla visible, secuencia de paquetes, TCP flags, DNS en claro, handshake TLS observable e… | Cifrado, SPAN sobresuscrito, captura truncada, offloading, ruta asimétrica, retención | RED-M05, RED-M28 |
| T02 | IPFIX/NetFlow | Punto/dominio de observación, inicio/fin flujo, 5-tupla si exportada, bytes/paquetes si exp… | Muestreo, templates, bidireccionalidad variable, delay, NAT, ausencia de payload | RED-M27 |
| T03 | Syslog (RFC 5424 y variantes) | facility, severity, timestamp, hostname, mensaje, structured data si existe | Reloj emisor, zona, transporte, truncamiento, pérdidas, formatos heterogéneos | RED-M26 |
| T04 | Firewall/ACL | Regla, interfaz/zona, src/dst y puertos, allow/deny si emitidos, información de sesión | Logs no habilitados, estado/NAT pre/post no equivalente, tráfico fuera de sensor | RED-M21, RED-M27 |
| T05 | DNS resolver | consultas/respuestas, nombre, tipo, rcode si existe, cliente observado | Cache, DoH/DoT, split horizon, resolvers externos, ausencia de resolución en PCAP | RED-M07, RED-M28 |
| T06 | DHCP | lease IP-MAC y duración, identificador de cliente si existe | Rotación, datos incompletos, DHCPv6/SLAAC fuera de DHCPv4, hora de consulta | RED-M07, RED-M29 |
| T07 | Zeek conn/dns/ssl/http (según configuración) | uid, originator/responder, duración, servicio inferido, logs aplicables por protocolo | Servicio inferido no prueba proceso, flow UDP no significa handshake, pérdida de paquetes | RED-M27, RED-M28 |
| T08 | Suricata EVE | event_type, flow_id y datos específicos DNS/TLS/alerta según versión/config | Regla firma no demuestra incidente, diferencias v7/v8 de DNS, reglas ausentes, pérdida | RED-M27, RED-M30 |
| T09 | Proxy / web gateway | host, URL/path en ciertos modelos, HTTP status, acción de política | HTTPS y privacy, bypass, caché, cuentas compartidas, encadenamiento proxy | RED-M28, RED-M29 |
| T10 | VPN/ZTNA | identidad, inicio/fin, túnel, asignación IP, geografía aproximada si reportada | NAT, sesión compartida, MFA/contexto externo, reloj, evidencia de uso posterior | RED-M29, RED-M31 |
| T11 | MDE DeviceNetworkEvents | proceso iniciador y conexión/evento conforme a esquema e instrumentación | No equivale a PCAP íntegro, depende de despliegue/licencias/telemetría, cobertura de endpoints | RED-M29, RED-M30 |
| T12 | Sentinel Syslog/CEF/ASIM | Syslog/CommonSecurityLog; ASIM Network Session/DNS cuando los parsers y fuentes existen | Duplicados, TimeGenerated vs EventTime, parsing, mapeo incompleto, DCR filtrante | RED-M26, RED-M30 |
| T13 | Splunk CIM Network Traffic | All_Traffic: src,dest,action,puertos,bytes, NAT si configurados y poblados | CIM es contrato de campo, no origen ni prueba de recepción; dependencias add-on/sourcetype | RED-M30 |
| T14 | Autenticación Windows/Linux/AD/Entra | eventos de logon, método, resultado, identidad y host donde disponible | No demuestran por sí solos transmisión de payload; correlación con red requiere tiempo/host | RED-M29, RED-M30 |
| T15 | Wi-Fi controladora / RADIUS / NAC | asociación, autenticación, autorización, asignación VLAN cuando se registra | Problemas RF sin log, roaming, relojes, identidad incompleta, dispositivo cambiante | RED-M24, RED-M34 |
| T16 | SNMP / telemetría de equipo | contadores, estado de interfaces, traps, condiciones de pérdida | Polling intervalo, wraps, agentes no fiables, ausencia de detalle del paquete | RED-M26, RED-M39 |

### Contrato mínimo por evento docente

```json
{
  "event_id": "string estable del dataset",
  "scenario_id": "S07",
  "is_synthetic": true,
  "ground_truth_visibility": "visible_en_respuesta_del_docente",
  "source_kind": "ipfix | pcap | zeek | suricata | firewall | endpoint | auth",
  "sensor_id": "nombre no identificador personal",
  "observation_point": "interfaz/zona/dirección",
  "event_time_utc": "ISO 8601 + precisión e incertidumbre",
  "ingest_time_utc": "ISO 8601 o null",
  "src_observed": "IP/host tal como lo declara la fuente",
  "dst_observed": "IP/host tal como lo declara la fuente",
  "pre_nat_post_nat": "explícito/desconocido",
  "raw_pointer": "ruta local ficticia / hash si existe",
  "parser_version": "versión o null",
  "missing_fields": "lista de ausencias",
  "coverage_notes": "sensor unilateral, cifrado, muestreo, etc."
}
```
**Este JSON es una propuesta de contrato pedagógico**; no es un estándar, producto, evento recibido ni un registro extraído de producción.

## D. Ajustes específicos a los diez módulos

### RED-M26 — Syslog, SNMP, NTP y observabilidad de equipos (12 h estimadas originalmente)
**Brecha observada:** No existe contrato explícito de procedencia y calidad para cada registro ni ensayo de hora de evento frente a hora de ingesta.
**Dependencias vigentes:** RED-M05, RED-M07, RED-M22.
**Objetivos medibles propuestos:**
- Distinguir emisor, colector, transformaciones, hora de evento y hora de ingesta en ≥3 fuentes.
- Identificar al menos dos causas de huecos o duplicados e impedir que se conviertan en cronología falsamente precisa.
**Prácticas a diseñar (no ejecutadas):**
- Ordenar una cronología con tres relojes y registros repetidos; documentar la incertidumbre por fuente.
- Auditar una cadena hipotética dispositivo → forwarder → AMA/DCR → SIEM sin afirmar ingestión real.
**Aceptación y fallos críticos:**
- Cronología UTC reproducible, dejando explícita la incertidumbre.
- Ficha de procedencia y calidad por fuente; no equiparar TimeGenerated a hora original.
- Fallo crítico original a conservar: **Tratar hora de ingesta como evento**.
**Referencias:** [F01], [F04], [F18].

### RED-M27 — IPFIX/NetFlow, IDS/IPS y NDR (16 h estimadas originalmente)
**Brecha observada:** No distingue suficientemente observación de paquetes, flujos IPFIX, sesiones Zeek, alertas Suricata y decisiones de firewall.
**Dependencias vigentes:** RED-M17, RED-M21, RED-M26.
**Objetivos medibles propuestos:**
- Interpretar al menos 4 tipos de registros con límites propios.
- Corroborar o refutar una hipótesis usando ≥2 sensores independientes, incluyendo casos negativos.
**Prácticas a diseñar (no ejecutadas):**
- Conciliar IPFIX, Zeek conn, EVE alert y denegación de firewall; explicar por qué las cuentas de bytes divergen.
- Ejecutar revisión documental de sesgos por muestreo, NAT y sensor unilateral.
**Aceptación y fallos críticos:**
- Matriz campo-fuente-semántica; al menos una explicación causal de discrepancia.
- Nunca afirmar volumen exacto o intrusión solo por un flujo/alerta.
- Fallo crítico original a conservar: **Inferir volumen exacto de muestreo sin factor**.
**Referencias:** [F03], [F08], [F10], [F05].

### RED-M28 — Análisis PCAP avanzado y protocolos (16 h estimadas originalmente)
**Brecha observada:** Falta un umbral observable de comprensión de protocolos y práctica con PCAP parcial/cifrado.
**Dependencias vigentes:** RED-M05, RED-M06, RED-M07, RED-M17.
**Objetivos medibles propuestos:**
- Aplicar correctamente filtros de captura y visualización en ejemplos documentados.
- Reconstruir una conversación observable y señalar explícitamente los campos ocultos por TLS.
**Prácticas a diseñar (no ejecutadas):**
- Analizar PCAP sintético con retransmisión TCP, DNS y TLS; anotar paquetes que sostienen cada conclusión.
- Comparar dos ubicaciones de sensor: antes/después de NAT o en un único extremo.
**Aceptación y fallos críticos:**
- Captura/paquetes citados por índice o tiempo y límites del sensor.
- No extraer contenidos cifrados que no se ven; comprobar falsos checksums por offload.
- Fallo crítico original a conservar: **Leer contenido cifrado sin claves/evidencia**.
**Referencias:** [F06], [F07], [F08].

### RED-M29 — Investigación SOC de hipótesis y cronologías (16 h estimadas originalmente)
**Brecha observada:** La investigación carece de plantilla exigible para hipótesis alternativas, grado de confianza y atribución tras NAT.
**Dependencias vigentes:** RED-M26, RED-M27, RED-M28.
**Objetivos medibles propuestos:**
- Formular ≥2 hipótesis plausibles para una alerta y obtener evidencia a favor/en contra.
- Reconstruir cronología con incertidumbres y determinar la necesidad de logs DHCP/NAT/VPN.
**Prácticas a diseñar (no ejecutadas):**
- Caso periódico tipo beacon vs monitor legítimo y caso movimiento lateral vs administración aprobada.
- Establecer plan de pivotes red ↔ endpoint ↔ identidad sin suponer que la correlación existe.
**Aceptación y fallos críticos:**
- Informe diferencia observaciones, hipótesis y conclusiones; justifica confianza.
- Escala con petición concreta de evidencia faltante cuando no hay base para cierre.
- Fallo crítico original a conservar: **Afirmar C2/exfiltración por indicador aislado**.
**Referencias:** [F01], [F13], [F16], [F17].

### RED-M30 — Correlación, normalización y detección (18 h estimadas originalmente)
**Brecha observada:** Riesgo de equiparar CIM, ASIM, CEF y MDE y de usar ATT&CK Data Sources como taxonomía activa.
**Dependencias vigentes:** RED-M26, RED-M27, RED-M29.
**Objetivos medibles propuestos:**
- Construir contrato de datos canónico propio con campo original, parser y pérdida semántica documentada.
- Probar una detección con positivos, benignos parecidos, negativos y una degradación de telemetría.
**Prácticas a diseñar (no ejecutadas):**
- Diseñar una especificación de detección neutral a SIEM, luego dos mapeos documentales ASIM/CIM sin inventar query funcional.
- Auditar FPR/FNR sobre dataset sintético etiquetado y registrar ATT&CK como contexto.
**Aceptación y fallos críticos:**
- Resultados con TP/FP/TN/FN y explicación de cobertura del dataset sin extrapolar a producción.
- Ninguna consulta KQL/SPL se declara validada sin ejecutarla en una fase posterior.
- Fallo crítico original a conservar: **Presentar consulta no probada como compatible**.
**Referencias:** [F11], [F12], [F18], [F19], [F20], [F21], [F22], [F23], [F24].

### RED-M31 — Respuesta a incidentes y recuperación de red (12 h estimadas originalmente)
**Brecha observada:** Falta comparar mitigaciones de conectividad con continuidad del servicio y la autorización concreta.
**Dependencias vigentes:** RED-M22, RED-M29, RED-M30.
**Objetivos medibles propuestos:**
- Elegir y justificar contención reversible y proporcional a disponibilidad/criticidad.
- Separar el acto recomendado del efectivamente autorizado, ejecutado y verificado.
**Prácticas a diseñar (no ejecutadas):**
- Tabletop: bloqueo de IP, segmentación temporal, aislamiento host, recogida de evidencia, restauración.
- Describir plan de rollback, comunicaciones, evidencias conservadas y criterios de no acción.
**Aceptación y fallos críticos:**
- Matriz riesgo-impacto-autorización y plan de recuperación; ninguna acción sobre sistemas reales.
- Fallo crítico original a conservar: **Aplicar contención real sin aprobación**.
**Referencias:** [F01], [F05].

### RED-M32 — Autorización, alcance y reglas de actuación (8 h estimadas originalmente)
**Brecha observada:** ROE exige reglas de parada y gestión de datos verificables, no solo un documento genérico.
**Dependencias vigentes:** RED-M01.
**Objetivos medibles propuestos:**
- Redactar autorización, CIDR propios, servicios, ventanas, límites, responsables, detención, datos y limpieza.
- Detectar cuatro casos de fuera de alcance mediante escenarios escritos.
**Prácticas a diseñar (no ejecutadas):**
- Crear ficha de ensayo contra direcciones/documentos ficticios; revisión cruzada CRITIC.
**Aceptación y fallos críticos:**
- Sin alcance aprobado no hay acciones de sondeo; STOP prevalece sobre logro técnico.
- Fallo crítico original a conservar: **Cualquier acción fuera de alcance**.
**Referencias:** [F02].

### RED-M33 — Descubrimiento y enumeración seguros (12 h estimadas originalmente)
**Brecha observada:** Falta conexión causal entre tipo de actividad controlada, volumen/ritmo seguro y detectabilidad por sensor.
**Dependencias vigentes:** RED-M07, RED-M12, RED-M32.
**Objetivos medibles propuestos:**
- Inventariar solamente hosts y puertos de un laboratorio definido, minimizando tráfico.
- Relacionar al menos dos tipos de sondeo con trazas de endpoint, flow y firewall hipotéticas.
**Prácticas a diseñar (no ejecutadas):**
- Comparar datos de sondeo de baja intensidad previamente diseñados y registros esperados, sin escaneos externos.
**Aceptación y fallos críticos:**
- Evidencia acotada a objetivo, hora, herramienta aprobada, resultado, cobertura del sensor.
- Se evita convertir una falta de alerta en afirmación de invisibilidad.
- Fallo crítico original a conservar: **Escaneo hacia redes públicas o producción**.
**Referencias:** [F02], [F13], [F14].

### RED-M34 — Evaluación autorizada de controles de red (18 h estimadas originalmente)
**Brecha observada:** Pruebas de segmentación solo son válidas si hay oráculos de allow/deny y rutas de retorno.
**Dependencias vigentes:** RED-M23, RED-M24, RED-M33.
**Objetivos medibles propuestos:**
- Definir matriz de flujos esperados y observados con origen, destino, puerto, regla, tiempo y evidencia.
- Diferenciar ACL, firewall stateful, routing, DNS y autenticación como causas alternativas.
**Prácticas a diseñar (no ejecutadas):**
- Caso lab de dos zonas: comprobar conexiones de un servicio docente permitido y otro denegado.
- Wi-Fi/NAC únicamente sobre infraestructura propia aislada; usar registros ficticios cuando falte hardware.
**Aceptación y fallos críticos:**
- Prueba positiva y negativa + evidencia del camino y retorno; ningún flooding/DoS ni red de terceros.
- Fallo crítico original a conservar: **Hacer flooding/DoS o usar red de terceros**.
**Referencias:** [F02], [F05], [F20].

### RED-M35 — Validación conjunta, remediación y retest (16 h estimadas originalmente)
**Brecha observada:** La validación conjunta carece de criterios de aprobación independiente de Red Team y SOC.
**Dependencias vigentes:** RED-M30, RED-M31, RED-M34.
**Objetivos medibles propuestos:**
- Realizar cadena planeada objetivo→evento→ingesta→normalización→detección→triage→corrección→retest.
- Distinguir eficacia del control preventivo y detectivo, y medir cobertura observable.
**Prácticas a diseñar (no ejecutadas):**
- Diseñar dos iteraciones: estado previo y corregido, con verificación del control y de la alerta.
**Aceptación y fallos críticos:**
- Evidencias separadas Blue/Red, límites y retest tras remediación; ninguna acción se marca ejecutada.
- Fallo crítico original a conservar: **Declarar mitigación sin retest o fuera de alcance**.
**Referencias:** [F01], [F02], [F13], [F20], [F23].

## E. Matriz de 12 situaciones SOC y pruebas Blue↔Red

Cada situación es **hipotética o sintética**. Actividades ofensivas solo podrán generarse en laboratorios aislados propios, con alcance y ROE aprobados en fases posteriores. Un patrón parecido a C2, movimiento lateral o exfiltración no demuestra la técnica.

| ID | Tipo | Situación | Alternativa benigna obligatoria | Corroboración |
|---|---|---|---|---|
| S01 | SOC | DNS anómalo vs aplicación legítima | Actualizador empresarial o prueba DNS/monitor legítimo | DNS resolver + endpoint + inventario; DNS en PCAP si visible |
| S02 | SOC | Periodicidad de conexiones vs monitorización | Health check, backup o cron autorizado | IPFIX/Zeek conn + calendario de jobs + endpoint |
| S03 | SOC | Acceso remoto nuevo vs administración aprobada | Mantenimiento planificado | Firewall + autenticación + proceso de origen + cambios |
| S04 | SOC | Transferencia elevada vs copia de seguridad | Backup, patching o réplica | IPFIX/Zeek + inventario + horario de backup + endpoint |
| S05 | SOC | Atribución tras NAT y DHCP | Tráfico de usuario legítimo y reasignación DHCP | NAT translation + DHCP lease + DNS + VPN con UTC |
| S06 | SOC | Sensor parcial o pérdida de captura | Capture loss, SPAN saturado, ruta asimétrica | PCAP punto A/B + sensores + contadores de interfaz |
| S07 | Blue↔Red | Descubrimiento de servicios autorizado | Escaneo de inventario del equipo de IT | Flujos + firewall + proceso + cambio aprobado |
| S08 | Blue↔Red | Prueba de segmentación allow/deny | ACL mal aplicada, DNS erróneo, falta de ruta de retorno | Matriz de políticas + firewall + PCAP + rutas |
| S09 | Blue↔Red | Autenticaciones fallidas limitadas | Error humano por contraseña expirada | AAA/RADIUS o sistema, VPN, firewall |
| S10 | Blue↔Red | VPN de administración legítima | Salida de red compartida, IP variable | VPN gateway + identidad + control de acceso + logs de actividad |
| S11 | Blue↔Red | 802.1X / WLAN corporativa | Error de certificado o configuración RADIUS | RADIUS/AAA + AP controlador + DHCP + segmentos |
| S12 | Blue↔Red | Corrección y retest integrador | Fallo operacional no malicioso | Config diff + logs pre/post + pcaps sintéticos + detector tests |

### Fichas y criterios por situación

**S01 — DNS anómalo vs aplicación legítima.** Consultas de nombres con longitud/frecuencia inusual en un dataset sintético.
- **Hipótesis alternativa:** Actualizador empresarial o prueba DNS/monitor legítimo.
- **Fuentes que habría que obtener:** DNS resolver + endpoint + inventario; DNS en PCAP si visible.
- **ATT&CK:** T1071.004 como hipótesis, no confirmación.
- **Resultado observable propuesto:** Analista clasifica con evidencia y límites; no afirma túnel DNS sin payload/contexto.
- **Módulos:** RED-M07, RED-M28, RED-M29, RED-M30. **Fuentes:** [F15], [F21]. **Estado:** diseñado, no ejecutado.

**S02 — Periodicidad de conexiones vs monitorización.** Conexiones HTTPS regulares a servidor de laboratorio.
- **Hipótesis alternativa:** Health check, backup o cron autorizado.
- **Fuentes que habría que obtener:** IPFIX/Zeek conn + calendario de jobs + endpoint.
- **ATT&CK:** No asignar T1071 sin corroboración.
- **Resultado observable propuesto:** Compara intervalos, dispersión, destino y proceso iniciador; dos hipótesis.
- **Módulos:** RED-M27, RED-M29, RED-M30. **Fuentes:** [F03], [F08]. **Estado:** diseñado, no ejecutado.

**S03 — Acceso remoto nuevo vs administración aprobada.** RDP/SSH/SMB entre dos segmentos docentes.
- **Hipótesis alternativa:** Mantenimiento planificado.
- **Fuentes que habría que obtener:** Firewall + autenticación + proceso de origen + cambios.
- **ATT&CK:** T1021 contexto condicionado a actividad de movimiento.
- **Resultado observable propuesto:** Distingue permiso de conexión de autenticación exitosa y uso interactivo.
- **Módulos:** RED-M06, RED-M29, RED-M30. **Fuentes:** [F16], [F22]. **Estado:** diseñado, no ejecutado.

**S04 — Transferencia elevada vs copia de seguridad.** Volumen de tráfico atípico en flow sintético.
- **Hipótesis alternativa:** Backup, patching o réplica.
- **Fuentes que habría que obtener:** IPFIX/Zeek + inventario + horario de backup + endpoint.
- **ATT&CK:** T1041 solo si se acredita canal C2 y exfil.
- **Resultado observable propuesto:** No interpreta bytes de flujo como datos exfiltrados confirmados.
- **Módulos:** RED-M27, RED-M29. **Fuentes:** [F03], [F17]. **Estado:** diseñado, no ejecutado.

**S05 — Atribución tras NAT y DHCP.** Múltiples endpoints comparten IP pública observada.
- **Hipótesis alternativa:** Tráfico de usuario legítimo y reasignación DHCP.
- **Fuentes que habría que obtener:** NAT translation + DHCP lease + DNS + VPN con UTC.
- **ATT&CK:** Sin etiqueta ATT&CK.
- **Resultado observable propuesto:** Ofrece atribución provisional; explicita cuándo faltan puertos y tiempo.
- **Módulos:** RED-M17, RED-M26, RED-M29. **Fuentes:** [F03], [F18]. **Estado:** diseñado, no ejecutado.

**S06 — Sensor parcial o pérdida de captura.** Paquetes ausentes y flujos discordantes.
- **Hipótesis alternativa:** Capture loss, SPAN saturado, ruta asimétrica.
- **Fuentes que habría que obtener:** PCAP punto A/B + sensores + contadores de interfaz.
- **ATT&CK:** Sin etiqueta ATT&CK.
- **Resultado observable propuesto:** Concluye visibilidad insuficiente, no ausencia de evento.
- **Módulos:** RED-M27, RED-M28. **Fuentes:** [F05], [F07]. **Estado:** diseñado, no ejecutado.

**S07 — Descubrimiento de servicios autorizado.** Probes de baja intensidad de hosts propios y rango acotado del laboratorio.
- **Hipótesis alternativa:** Escaneo de inventario del equipo de IT.
- **Fuentes que habría que obtener:** Flujos + firewall + proceso + cambio aprobado.
- **ATT&CK:** T1046 / DET0376 como referencia de conducta.
- **Resultado observable propuesto:** ROE completo, cobertura de detectores y lista de paquetes/servicios esperados.
- **Módulos:** RED-M32, RED-M33, RED-M30. **Fuentes:** [F13], [F14]. **Estado:** diseñado, no ejecutado.

**S08 — Prueba de segmentación allow/deny.** Un flujo permitido y otro bloqueado en dos zonas de laboratorio.
- **Hipótesis alternativa:** ACL mal aplicada, DNS erróneo, falta de ruta de retorno.
- **Fuentes que habría que obtener:** Matriz de políticas + firewall + PCAP + rutas.
- **ATT&CK:** Sin etiqueta ATT&CK.
- **Resultado observable propuesto:** Correlaciona 2 resultados opuestos, conoce error de falso negativo.
- **Módulos:** RED-M21, RED-M32, RED-M34. **Fuentes:** [F02], [F20]. **Estado:** diseñado, no ejecutado.

**S09 — Autenticaciones fallidas limitadas.** Tres eventos de fallo de credenciales ficticias/preparadas.
- **Hipótesis alternativa:** Error humano por contraseña expirada.
- **Fuentes que habría que obtener:** AAA/RADIUS o sistema, VPN, firewall.
- **ATT&CK:** No asignar fuerza bruta por tres fallos.
- **Resultado observable propuesto:** Sin intentos masivos; distingue autenticación fallida de red inaccesible.
- **Módulos:** RED-M24, RED-M29, RED-M34. **Fuentes:** [F01], [F02]. **Estado:** diseñado, no ejecutado.

**S10 — VPN de administración legítima.** Sesión VPN de identidad docente previamente aprobada.
- **Hipótesis alternativa:** Salida de red compartida, IP variable.
- **Fuentes que habría que obtener:** VPN gateway + identidad + control de acceso + logs de actividad.
- **ATT&CK:** No asignar ATT&CK sin evidencia.
- **Resultado observable propuesto:** Identidad, túnel e IP mapeados con hora; privacidad y límite declarados.
- **Módulos:** RED-M18, RED-M29, RED-M31. **Fuentes:** [F01], [F18]. **Estado:** diseñado, no ejecutado.

**S11 — 802.1X / WLAN corporativa.** Conexión permitida de dispositivo del laboratorio y autenticación rechazada.
- **Hipótesis alternativa:** Error de certificado o configuración RADIUS.
- **Fuentes que habría que obtener:** RADIUS/AAA + AP controlador + DHCP + segmentos.
- **ATT&CK:** Sin etiqueta ATT&CK.
- **Resultado observable propuesto:** Evidencia de autenticación, asignación VLAN y causa de fallo; sin tocar redes ajenas.
- **Módulos:** RED-M24, RED-M32, RED-M34. **Fuentes:** [F02], [F05]. **Estado:** diseñado, no ejecutado.

**S12 — Corrección y retest integrador.** Control mal configurado, prueba mínima, alerta e intervención aprobada.
- **Hipótesis alternativa:** Fallo operacional no malicioso.
- **Fuentes que habría que obtener:** Config diff + logs pre/post + pcaps sintéticos + detector tests.
- **ATT&CK:** ATT&CK solo si conducta queda respaldada.
- **Resultado observable propuesto:** Dos iteraciones reproducibles, rollback, efecto secundario y separación acción/recomendación.
- **Módulos:** RED-M30, RED-M31, RED-M35, RED-M41. **Fuentes:** [F01], [F02], [F13]. **Estado:** diseñado, no ejecutado.

## F. Cruces con mundos existentes y futuros sin duplicidad

| Mundo | Qué se aprende en Redes | Qué se deja al otro mundo | Evidencia integradora futura |
|---|---|---|---|
| Microsoft Sentinel | Procedencia, Syslog/CEF, ASIM Network Session/DNS; AMA+DCR y posibles duplicados | Se referencia al Mundo Microsoft para KQL y conectores desplegados; no replicar curso KQL | Tabla Syslog/CEF y eventos DNS con timestamp y fuente |
| Defender XDR | Enriquecimiento con proceso/endpoint desde DeviceNetworkEvents cuando disponible | Se referencia hunting, esquemas y licenciamiento al Mundo Microsoft; cobertura por endpoint | Evento endpoint+conexión de red con proceso y cobertura |
| Splunk SOC | Modelo CIM Network Traffic y validación del mapping de campos | Se referencia SPL, datamodels y pipelines al Mundo Splunk; no prometer equivalente 1:1 ASIM | Contrato de campos de dataset de red normalizado |
| Windows / Active Directory | SMB/RDP/Kerberos/DNS observables y logs de logon para contexto | Lecciones de administración AD se reservan a futuro Mundo Windows/AD | RDP/SMB con log de inicio de sesión y red |
| Linux | tcpdump/TShark, syslog/journald, interfaces, nftables y SSH como contexto | Administración detallada y comandos al futuro Mundo Linux | Captura y estado nftables con traza |
| Simulador SOC | Casos docentes con evidencia sintética y anotación de procedencia | Se referencia a casos, veredictos y cronologías, sin alterar el simulador | Caso sintético con evaluación SOC y rúbrica |

Las herramientas de un mundo no se presuponen instaladas en otro. Tampoco se declara equivalencia de ASIM, CIM, CEF, Zeek, Suricata y MDE. Se exige documento de correspondencia con campos ausentes y transformación explícita.

## G. Rúbricas de dominio y criterios de fracaso

### SOC — 100 puntos (propuesta)
| Criterio | Puntos |
|---|---:|
| Inventario y procedencia de evidencia | 20 |
| Interpretación correcta de red y visibilidad | 20 |
| Cronología UTC y atribución sin excesos | 15 |
| Hipótesis, alternativas y corroboración | 20 |
| Decisión de triage, contención propuesta y escalado | 15 |
| Comunicación reproducible y preservación | 10 |
**Fallos inaceptables, independientemente de la suma:** Atribución maliciosa sin evidencia; Presentar datos sintéticos como reales; Alterar evidencia sin dejar traza.

### Red Team autorizado — 100 puntos (propuesta)
| Criterio | Puntos |
|---|---:|
| Autorización y cumplimiento del ROE | 25 |
| Diseño de prueba mínima y reversible | 15 |
| Resultados y evidencia reproducibles | 20 |
| Validación de controles y límites | 20 |
| Remediación, comunicación y retest | 20 |
**Fallos inaceptables, independientemente de la suma:** Cualquier prueba fuera del alcance; DoS o interrupción intencional; Manipulación o extracción de datos reales.

### Validación conjunta Blue↔Red — 100 puntos (propuesta)
| Criterio | Puntos |
|---|---:|
| Objetivo y permiso documentados | 15 |
| Ground truth de la acción aprobada | 15 |
| Visibilidad/telemetría efectiva | 20 |
| Análisis SOC con hipótesis alternativas | 20 |
| Control reparado y retest | 20 |
| Rollback y lecciones documentadas | 10 |
**Fallos inaceptables, independientemente de la suma:** Reclamar detección exitosa sin eventos; Falta de evidencia del retest; Uso de sistemas externos o de producción.

No se establece todavía nota de corte ni política de reintentos: requieren la Tanda 5 y pruebas piloto. La selección de pesos es propuesta pedagógica, no métrica validada.

## H. Prototipos de práctica para transferir a la Tanda 5

### P4-01 — Investigación multi-sensor de supuesto descubrimiento
- **Módulos:** RED-M27, RED-M29, RED-M30, RED-M33. **Prerrequisitos:** RED-M05, RED-M17, RED-M26, RED-M32. **Duración:** 4 h estimadas no medidas.
- **Entorno/base:** Dataset sintético etiquetado con flows + firewall + proceso e inventario; no se genera tráfico real en investigación.
- **Tarea:** Separar enumeración autorizada, herramienta IT y patrón desconocido; producir cronología y recomendaciones.
- **Evidencia:** traza de fuentes, matriz observación/hipótesis, TP/FP/TN/FN de criterio docente, alcance ROE.
- **Evaluación:** Sin atribución maliciosa gratuita; detector informado con hard negatives.
- **Restauración/limpieza:** Ningún sistema modificado; limpieza no aplicable. **Estado:** diseñado_no_ejecutado.

### P4-02 — Zona ciega de visibilidad y reloj
- **Módulos:** RED-M26, RED-M27, RED-M28, RED-M29. **Prerrequisitos:** RED-M05, RED-M07, RED-M17. **Duración:** 3 h estimadas no medidas.
- **Entorno/base:** PCAP parcial y eventos sintéticos con desfase de NTP y campos de ingestión distintos.
- **Tarea:** Reordenar hechos; medir incertidumbre; distinguir ausencias de paquetes y de logs.
- **Evidencia:** timeline UTC, matriz cobertura, anotación diferencia timestamp, hipótesis no descartables.
- **Evaluación:** No inventa paquetes ni atribución exacta.
- **Restauración/limpieza:** Ningún sistema modificado; limpieza no aplicable. **Estado:** diseñado_no_ejecutado.

### P4-03 — Contrato ASIM/CIM de eventos de red
- **Módulos:** RED-M26, RED-M30. **Prerrequisitos:** RED-M26, RED-M27. **Duración:** 4 h estimadas no medidas.
- **Entorno/base:** Eventos de ejemplo sintéticos tipo firewall, CEF, Zeek y flow; documentación oficial de schemas.
- **Tarea:** Mapear src/dest/action/bytes, zona y NAT a esquema canónico con supuestos y campos perdidos.
- **Evidencia:** tabla mapeo, test de consistencia, source registry, campo nulo en ausencia de dato.
- **Evaluación:** No inventa mapeos directos ni ejecuta KQL/SPL ficticio.
- **Restauración/limpieza:** Ningún sistema modificado; limpieza no aplicable. **Estado:** diseñado_no_ejecutado.

### P4-04 — Matriz de segmentación ofensiva/defensiva
- **Módulos:** RED-M21, RED-M32, RED-M34, RED-M35. **Prerrequisitos:** RED-M21, RED-M32, RED-M33. **Duración:** 5 h estimadas no medidas.
- **Entorno/base:** Topología de laboratorio hipotética, aislada con zonas CLIENT/APP/DB; IPs RFC5737 de documentación.
- **Tarea:** Diseñar conexiones permitidas/denegadas y controles observables, incluyendo ruta retorno.
- **Evidencia:** ROE, política esperada, evidencia sintética pre/post, matriz accesos, rollback.
- **Evaluación:** Verifica control y cobertura de logs en dos sentidos, sin sondear nada real.
- **Restauración/limpieza:** Restauración propuesta para tanda 5; no aplicada. **Estado:** diseñado_no_ejecutado.

### P4-05 — Ciclo de remediación y retest
- **Módulos:** RED-M29, RED-M30, RED-M31, RED-M35. **Prerrequisitos:** RED-M30, RED-M31, RED-M34. **Duración:** 6 h estimadas no medidas.
- **Entorno/base:** Escenario documental + logs sintéticos antes/después de regla de firewall.
- **Tarea:** Evaluar dos decisiones de contención, seleccionar reversibilidad, retest y impacto.
- **Evidencia:** plan de cambio, notificación y autorización, prueba red, prueba detector, retorno al servicio.
- **Evaluación:** No declara ejecutado cambio o retest sin ejecución.
- **Restauración/limpieza:** Rollback documental; aplicación real pendiente de la fase permitida. **Estado:** diseñado_no_ejecutado.

## I. Auditoría CRITIC: 14 brechas priorizadas

| ID | Prioridad | Brecha | Acción verificable |
|---|---|---|---|
| C01 | crítico | Confundir alerta, comportamiento sospechoso e incidente confirmado | Evaluación con alternativas y corroboración obligatoria |
| C02 | crítico | Presentar KQL/SPL no probados o datasets sintéticos como producción | Etiqueta sintético/no ejecutado y requiere ambiente en tanda posterior |
| C03 | alto | Falta caracterizar pérdida/sampling y zonas ciegas | Incluir prueba de visibilidad y mapa de sensores |
| C04 | alto | NAT/DHCP/VPN insuficientes para atribución de usuario | Cadena de asignación con timestamp, NAT puertos y confianza |
| C05 | alto | Uso obsoleto de MITRE ATT&CK Data Sources como taxonomía central | Actualizar a Detection Strategies / Data Components y revisar vigencia |
| C06 | alto | Campos ASIM/CIM/CEF/MDE no equivalentes por defecto | Contrato de normalización con pérdidas y pruebas de parser |
| C07 | alto | Confundir timestamps de emisor, colector e ingesta | Dos o más relojes y diferencia UTC ± incertidumbre |
| C08 | alto | Modelo ROE débil sin STOP, daños y datos | Documento ROE obligatorio y rechazo automático de casos fuera alcance |
| C09 | alto | Seguridad L2/Wi-Fi fuera de hardware propio | Lab aislado o datasets, prohibidas redes ajenas |
| C10 | medio | Escaneo benigno indistinguible de descubrimiento malicioso | Control de mantenimiento/asset inventory como hard negative |
| C11 | medio | Retest evalúa solo bloqueo o solo alerta | Valida prevención, detección, disponibilidad y rollback |
| C12 | medio | Cambio de EVE DNS Suricata v8 ignorado | Pruebas de compatibilidad y esquema por versión |
| C13 | medio | Zeek conn UDP interpretado como estado TCP | Evaluar semántica conn_state por protocolo |
| C14 | medio | Ausencia de dato interpretada como ausencia de evento | Estado indeterminado por cobertura incompleta |

### Decisiones derivadas de la crítica

- **Conservar** los 42 módulos y su grafo como propuesta. Las brechas identificadas justifican profundizaciones, no necesariamente módulos adicionales.
- **No asegurar** que las 90 h originales de E5 ni las 54 h de E6 basten. Los prototipos de práctica tienen 22 h nominales, pero pueden solaparse con horas actuales: no se suman sin un estudio de carga posterior.
- **Proponer** instrumento de calificación con prueba positiva, negativa/benigna y fuente degradada, además de revisión humana de hipótesis.
- **Solicitar** revisión específica de privacidad y licencias antes de capturar datos reales o usar appliances externos.
- **Mantener** el resultado no determinado cuando falta telemetría y advertir al estudiante cuándo una prueba no demostraría lo solicitado.

## J. Registro de fuentes verificadas / consultadas

URLs oficiales directas. Las fechas de actualización o versiones se indican solo si la fuente las declara o el programa contiene versión; cuando no, se registra documentación viva. Fecha de consulta documental: 2026-10-18. Confianza basada en autoridad para la afirmación específica; no es validación empírica.

| ID | Organización | Documento/versión | Confianza | URL directa |
|---|---|---|---|---|
| F01 | NIST | SP 800-61 Rev. 3 — Incident Response Recommendations and Considerations for Cybersecurity Risk Management — 2025-04; final; sustituye Rev. 2 | alta | https://csrc.nist.gov/pubs/sp/800/61/r3/final |
| F02 | NIST | SP 800-115 — Technical Guide to Information Security Testing and Assessment — 2008-09; antigua, no sustituye ROE vigente ni asesoría legal | alta para contenido histórico/documentado; media para vigencia operativa | https://www.nist.gov/publications/technical-guide-information-security-testing-and-assessment |
| F03 | IETF / RFC Editor | RFC 7011 / STD 77 — Specification of the IPFIX Protocol — 2013-09; estándar de Internet | alta | https://www.rfc-editor.org/info/rfc7011/ |
| F04 | IETF / RFC Editor | RFC 5424 — The Syslog Protocol — 2009-03; Proposed Standard | alta | https://www.rfc-editor.org/info/rfc5424/ |
| F05 | IETF / RFC Editor | RFC 9232 — Network Telemetry Framework — 2022; RFC informativo | alta | https://www.rfc-editor.org/info/rfc9232/ |
| F06 | Wireshark Foundation | Wireshark filter manual — Documentación viva; versión exacta del ejecutable no comprobada | alta | https://www.wireshark.org/docs/man-pages/wireshark-filter |
| F07 | Wireshark Foundation | TShark manual — Documentación viva; versión exacta del ejecutable no comprobada | alta | https://www.wireshark.org/docs/man-pages/tshark.html |
| F08 | Zeek Project | Book of Zeek, conn.log — Documentación 9.0.0 consultada; no instalación ni validación | alta | https://docs.zeek.org/en/current/reference/logs/conn.html |
| F09 | Zeek Project | Book of Zeek, core logs — Documentación 9.0.0 consultada; no instalación ni validación | alta | https://docs.zeek.org/en/current/tutorial/logs.html |
| F10 | OISF / Suricata | Suricata 8.0.0 — EVE JSON Format — v8.0.0, DNS EVE v3 por defecto; no asumir continuidad para 9.x | alta | https://docs.suricata.io/en/suricata-8.0.0/output/eve/eve-json-format.html |
| F11 | MITRE ATT&CK | Enterprise data sources, aviso de deprecación — Data Sources deprecadas desde ATT&CK v18 (2025-10) | alta | https://attack.mitre.org/datasources/ |
| F12 | MITRE ATT&CK | Data Components — Página dinámica, consultada 2026-10-18 | alta | https://attack.mitre.org/datacomponents/ |
| F13 | MITRE ATT&CK | DET0376 — Behavioral Detection Strategy for Network Service Discovery — v1.0, modificada 2026-05-12 | alta | https://attack.mitre.org/detectionstrategies/DET0376/ |
| F14 | MITRE ATT&CK | T1046 — Network Service Discovery — v3.2, modificado 2026-05-12 | alta | https://attack.mitre.org/techniques/T1046/ |
| F15 | MITRE ATT&CK | T1071.004 — Application Layer Protocol: DNS — v1.4, modificado 2026-09-03 | alta | https://attack.mitre.org/techniques/T1071/004/ |
| F16 | MITRE ATT&CK | T1021 — Remote Services — v1.6, modificado 2025-10-24 | alta | https://attack.mitre.org/techniques/T1021/ |
| F17 | MITRE ATT&CK | T1041 — Exfiltration Over C2 Channel — v2.3, modificado 2026-05-12 | alta | https://attack.mitre.org/techniques/T1041/ |
| F18 | Microsoft Learn | Microsoft Sentinel — Syslog and CEF connectors with AMA — Documentación viva, consultada 2026-10-18 | alta | https://learn.microsoft.com/azure/sentinel/cef-syslog-ama-overview |
| F19 | Microsoft Learn | Microsoft Sentinel — CEF key and CommonSecurityLog field mapping — Documentación viva, consultada 2026-10-18 | alta | https://learn.microsoft.com/azure/sentinel/cef-name-mapping |
| F20 | Microsoft Learn | Microsoft Sentinel — ASIM Network Session normalization schema — Página actualizada 2026-09-16 | alta | https://learn.microsoft.com/en-us/azure/sentinel/normalization-schema-network |
| F21 | Microsoft Learn | Microsoft Sentinel — ASIM DNS normalization schema — Documentación viva, consultada 2026-10-18 | alta | https://learn.microsoft.com/en-us/azure/sentinel/normalization-schema-dns |
| F22 | Microsoft Learn | Microsoft Defender XDR — DeviceNetworkEvents advanced hunting schema — Página con fecha 2026-06-22 | alta | https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-devicenetworkevents-table |
| F23 | Splunk | Common Information Model 6.1 — Network Traffic — CIM 6.1; documento actualizado 2025-07-10 | alta | https://help.splunk.com/en/splunk-cloud-platform/common-information-model/6.1/data-models/network-traffic |
| F24 | Microsoft Learn | ASIM parser list for Microsoft Sentinel — Documentación viva, consultada 2026-10-18 | alta | https://learn.microsoft.com/azure/sentinel/normalization-parsers-list |

**Afirmaciones amparadas por cada fuente (lista auditable):**
- **F01**: Gestión de respuesta, preparación, detección, respuesta, recuperación y mejora.
- **F02**: Planificación, alcance, técnicas y límites de pruebas de seguridad.
- **F03**: Exportación de registros de flujo, puntos de observación, templates y procesos de medida.
- **F04**: Estructura del mensaje syslog y transporte independiente.
- **F05**: Arquitectura de generación, recolección, correlación y consumo de telemetría.
- **F06**: Diferencia entre filtros de visualización y captura.
- **F07**: Filtrado de captura -f vs visualización -Y; precauciones por pérdida en captura.
- **F08**: conn.log abarca flujos TCP/UDP y el significado de id.orig_h, id.resp_h, proto, uid, etc.
- **F09**: Conexiones, semántica de metadatos y procedencia en análisis de logs Zeek.
- **F10**: EVE para alertas y metadatos; cambios de esquema DNS entre versiones.
- **F11**: No diseñar el currículo sobre listado DS como taxonomía vigente central.
- **F12**: Propiedades observables vinculadas a detección.
- **F13**: Detección de descubrimiento mediante proceso + conexiones y conducta de sondeo.
- **F14**: Contexto ATT&CK para descubrimiento de servicios; no prueba del ataque.
- **F15**: Abuso potencial de DNS como C2; indicador no confirma técnica.
- **F16**: Acceso remoto legítimo/ilegítimo; requiere evidencia de contexto y autenticación.
- **F17**: Contexto de exfiltración vía C2; volumen transmitido aislado no lo demuestra.
- **F18**: DCR, AMA, Syslog/CommonSecurityLog y discrepancias TimeGenerated/EventTime; duplicados.
- **F19**: Relación publicada entre claves CEF y campos CommonSecurityLog.
- **F20**: Semántica del esquema de sesiones; no implica que todas las fuentes estén presentes.
- **F21**: Semántica de campos DNS normalizados y aliases.
- **F22**: Eventos de conexiones relacionados con el endpoint; depende de producto/habilitación.
- **F23**: Modelo de red All_Traffic, tipos y campos src/dest/puertos/NAT.
- **F24**: Parsers de múltiples fuentes de Network Session; disponibilidad condicionada a implementación.

### Limitaciones de la consulta

- IEEE 802.1/802.11 y licencias/hardware por fabricante quedan pendientes de Tanda 5, donde se contrastarán topologías y equipos concretos.
- No se han descargado ni inspeccionado exhaustivamente códigos fuente, releases completos ni tablas de ejemplo de todos los proveedores. Se han contrastado páginas de documentación oficial citadas, no una ejecución en motores reales.
- No se adjudica cobertura o fidelidad de sensores según producto sin despliegue/versiones definidas.
- NIST SP 800-115 es de 2008; se emplea como referencia documental de planificación de pruebas, no como especificación moderna exhaustiva ni autorización legal.

## K. Criterios de aceptación de la Tanda 4 y traspaso a la Tanda 5

**Alcanzado a nivel documental:** diez fichas complementarias de módulo con objetivos medibles y evidencias, dieciséis fuentes de observación identificadas, doce escenarios con hipótesis benignas, tres rúbricas diferenciadas, cinco muestras de práctica y catorce brechas sometidas a revisión.

**Pendiente de validación:** topologías reales, versiones/licencias de software, recursos, datasets y hashes, medición de tiempos, ensayos de detección, control de pérdidas, verificación KQL/SPL, legalidad operacional por jurisdicción, comprobación de hardware y evaluación piloto.

**Tanda 5:**
- Especificar topologías, direcciones, versiones y herramientas en inventario reproducible.
- Revisar licencias y coste con fecha y ubicación antes de declarar reproducibilidad.
- Definir datasets PCAP/JSON con ground truth, usos permitidos y hashes.
- Verificar cada regla/sintaxis en motor real o marcarla como pseudocódigo.
- Ejecutar laboratorios solo después de aprobación explícita; marcar diseñado/ejecutado/validado por separado.

### No se ha efectuado ninguna de estas acciones

- Los ejemplos docentes están diseñados, no ejecutados.
- No se afirma ingestión Sentinel/Splunk ni compatibilidad de consultas de búsqueda.
- No se afirma que las 592 horas sean suficientes tras ampliar el diseño.
- No se afirma que ATT&CK identifique una intrusión por sí solo.
- No se infiere equivalencia entre EVE, Zeek, IPFIX, ASIM, CIM, CEF y MDE.
- No se proporcionan instrucciones de sondeo contra objetivos externos.

**Veredicto CRITIC:** lista para revisión como propuesta curricular de especialización SOC/Red Team, **no lista** para afirmar dominio, ejecución de laboratorios o implementación. Se mantienen las brechas trazables hasta que se demuestre su resolución.
