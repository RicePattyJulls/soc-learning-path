# Mundo de Redes — Tanda 5/7: Laboratorios y evaluación
**Fecha de consulta:** 2026-10-18 · **Estado:** diseño documental, ningún laboratorio ejecutado ni validado. · **Ámbito:** 42 módulos de Tanda 2 y correcciones T3/T4.

## 0. Alcance y método
Se ha leído la arquitectura original (42 módulos/168 lecciones/592 horas estimadas), la auditoría técnica T3 y los 12 escenarios SOC/Red Team de T4. Se proponen 20 laboratorios troncales y dos extensiones opcionales. La selección prioriza capacidades demostrables, mínima inversión, control de riesgos, evidencia y recuperación. **No se instala, configura, escanea o captura nada durante esta investigación.**

**Convenciones:** T = troncal; X = extensión; rutas M = módulos precedentes. 10.60.0.0/16 es espacio privado para prácticas aisladas. 198.51.100.0/24 (TEST-NET-2, RFC 5737) y 2001:db8::/32 (RFC 3849) se usan *solo en ejemplos y datasets*; para ejecutar se sustituyen por direcciones privadas/ULA apropiadas y verificadas; no se presupone capacidad de Internet ni infraestructura desplegada. Versión precisa del SO, simulador y sensores se fijará en implementación futura; sin esa versión no se afirma compatibilidad.

## 1. Herramientas, licencias, requisitos y costes — evidencia frente a estimación
| Herramienta | Estado de licencia/coste constatado (18-10-2026) | Límite operativo o jurídico | Aplicación propuesta |
|---|---|---|---|
| Packet Tracer | Sin coste para learners/educadores NetAcad con cuenta y curso introductorio | No asumir redistribución ni soporte Parrot OS; simulación distinta a captura física | L01–L05, L10–L11 · [PT](https://www.netacad.com/cisco-packet-tracer) |
| CML-Free | 0 USD de suscripción, 1 usuario | 5 nodos; las imágenes Cisco suministradas son solo para CML; telemetría uso anónima obligatoria | L04/L06/L08/L10 reducidos · [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/) |
| CML Personal/Plus | Precio publicado: 199/349 USD (no €; no incluir impuestos) | 20/40 nodos según página comercial; uso comercial pendiente | Solo extensión X02 · [CML-PRICES](https://www.cisco.com/site/us/en/learn/training-certifications/training/modeling-labs/index.html) |
| FRRouting+Containerlab | FRR libre GPLv2; Containerlab ofrece integración con imágenes FRR | No trasladar capacidades vendor Cisco 1:1; contenedores necesitan permisos y aislamiento | L06–L07, L18–L20 · [CLAB](https://containerlab.dev/manual/kinds/frr/) |
| Wireshark/tshark | Sin coste de licencia; GPLv2 | PCAP puede omitir contadores de drops; privacidad de payload | L01–L03, L13–L15 · [WS](https://www.wireshark.org/faq) |
| Zeek/Suricata | Ejecución offline con software abierto (condiciones de cada versión a verificar) | Logs y esquemas dependen de versión y visibilidad | L14–L16, L20 · [SUR](https://docs.suricata.io/en/suricata-8.0.3/output/eve/eve-json-output.html) |
| Security Onion 2.4 Standalone | No se propone como requisito | Mínimos oficiales 24 GB RAM, 4 cores, 200 GB disco, 2 NIC; más carga si ingesta alta | Solo ruta avanzada opcional · [SO](https://docs.securityonion.net/en/2.4/hardware.html) |
| OPNsense community | Descarga comunitaria sin precio de licencia en página oficial | VM añade consumo; confirmar licencia exacta en distribución | L09, opcional L10 · [OPN](https://opnsense.org/download/) |
| Microsoft Sentinel | No necesario para núcleo de Labs; trial limitado 31 días/10GB/día | El free trial puede implicar cargos adicionales; no afirmar coste 0 total | Solo cruces con mundo Microsoft; T6 · [SENTINEL](https://learn.microsoft.com/en-us/azure/sentinel/billing) |

**Actualización relevante:** para CML 2.10 el mínimo oficial de la máquina CML es **8 GB RAM, 4+ núcleos físicos Intel y 32 GB de disco** asignados a la VM/servidor, no al ordenador completo. CML 2.10.1 consta como versión de mantenimiento del 01-10-2026. CML-Free es para usuario individual; la documentación especifica límites y licencia de imágenes. Fuente: [Cisco CML requisitos](https://developer.cisco.com/docs/modeling-labs/system-requirements/), [CML-Free](https://developer.cisco.com/docs/modeling-labs/cml-free/), [Release notes](https://developer.cisco.com/docs/modeling-labs/cml-release-notes/).

**Estimación pedagógica de recursos (no umbrales garantizados):** 8 GB: Packet Tracer/PCAP pequeño y casos JSON; 16 GB: FRR/Containerlab secuencial y sensores offline; 24–32 GB: más de un sensor y VMs simultáneas. Deben medir RAM, disco, CPU y rendimiento real en pilotos. El coste de software principal puede ser 0 €, pero **equipo, electricidad, Internet, tiempo y licencias comerciales** no están presupuestados. Los valores Cisco Personal son **USD, no EUR**.

**Precisión sobre direcciones:** [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737.html) reserva TEST-NET-2 para documentación y [RFC 3849](https://www.rfc-editor.org/rfc/rfc3849.html) reserva 2001:db8::/32 para documentación; no deben convertirse automáticamente en redes operativas. En pruebas IPv6 reales, elegir ULA en el laboratorio y documentar la asignación.

## 2. Catálogo de 20 laboratorios troncales
| ID | Fase | Laboratorio | Módulos | Horas* | Recurso |
|---|---|---|---|---:|---|
| RED-L01 | Direccionamiento y captura | Modelo OSI/TCP-IP, enlace y direccionamiento IPv4 | M01, M02 | 7 | ligera |
| RED-L02 | Direccionamiento y captura | IPv6, Neighbor Discovery y MTU de extremo a extremo | M03, M04 | 8 | ligera |
| RED-L03 | Direccionamiento y captura | TCP/UDP, DNS, HTTP, TLS y captura inicial | M04, M05, M06, M07 | 10 | ligera |
| RED-L04 | Switching y servicios | Switching, VLAN, trunks 802.1Q, STP y LACP | M08, M09, M10 | 12 | intermedia |
| RED-L05 | Switching y servicios | Servicios DNS/DHCP/NTP y dependencias AAA | M07, M22 | 10 | ligera |
| RED-L06 | Routing, resiliencia y WAN | Enrutamiento estático y OSPFv2/OSPFv3 | M12, M13 | 14 | intermedia |
| RED-L07 | Routing, resiliencia y WAN | BGP, filtros, políticas y redistribución segura | M14, M15 | 16 | intermedia |
| RED-L08 | Routing, resiliencia y WAN | Gateway redundante, QoS y diagnóstico de convergencia | M16, M19, M39 | 10 | intermedia |
| RED-L09 | Routing, resiliencia y WAN | NAT/PAT, VPN y WAN híbrida sin salida externa | M17, M18 | 12 | avanzada |
| RED-L10 | Seguridad empresarial y cloud | Campus segmentado: ACL, firewall, hardening y controles L2 | M20, M21, M22, M23 | 16 | intermedia |
| RED-L11 | Seguridad empresarial y cloud | Wi-Fi corporativo, 802.1X/RADIUS y autenticación | M11, M23, M24 | 12 | ligera |
| RED-L12 | Seguridad empresarial y cloud | Diseño de red cloud/híbrida y verificación offline | M18, M20, M21, M25 | 10 | ligera |
| RED-L13 | SOC: telemetría y respuesta | Telemetría Syslog/SNMP, UTC y calidad de observación | M26 | 10 | ligera |
| RED-L14 | SOC: telemetría y respuesta | NetFlow/IPFIX, Zeek, Suricata e IDS/NDR | M27 | 14 | intermedia |
| RED-L15 | SOC: telemetría y respuesta | Investigación SOC de PCAP con hipótesis y atribución | M28, M29 | 14 | ligera |
| RED-L16 | SOC: telemetría y respuesta | Reglas de detección, normalización y respuesta SOC | M30, M31 | 16 | ligera |
| RED-L17 | Red Team autorizado | Alcance, descubrimiento mínimo y prueba de segmentación Red Team | M32, M33, M34 | 16 | intermedia |
| RED-L18 | Automatización y rollback | Automatización de inventario, YANG/APIs y rollback | M36, M37, M38, M39 | 18 | intermedia |
| RED-L19 | Integración y evaluación final | Proyecto empresarial integrado: diseño, resiliencia y operación | M15, M20, M21, M23, M25, M38, M39, M40 | 24 | avanzada |
| RED-L20 | Integración y evaluación final | Misión final Purple: actividad autorizada, SOC y retest | M30, M31, M35, M41, M42 | 26 | avanzada |

**Total propuesto de prácticas troncales: 275 horas**, como **subconjunto** de las 592 horas preliminares de Tanda 2, **no adicionales**. El total de la fase de diseño no valida duración real.

## 3. Fichas detalladas de laboratorio

### RED-L01 — Modelo OSI/TCP-IP, enlace y direccionamiento IPv4 [diseñado_no_ejecutado_no_validado]
**Etapa:** 1 (Direccionamiento y captura); **Nivel:** Inicial; **Duración estimada:** 7 h; **Módulos:** RED-M01, RED-M02; **Prerrequisitos externos:** ninguno.

- **Objetivo y competencia:** Demostrar de forma reproducible modelo osi/tcp-ip, enlace y direccionamiento ipv4 en un entorno docente controlado. Competencia medible: Explicar una comunicación extremo a extremo y aislar un fallo físico/L1-L2.
- **Topología:** PC-A ↔ SW-A ↔ PC-B; interfaz administrativa separada; comprobar cable/duplex lógico. **Direccionamiento:** VLAN10: 10.60.10.0/24; enlace fallido: gateway intencionadamente incorrecto.
- **Herramientas/ruta:** Packet Tracer, Wireshark. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8 GB RAM orientativos (no requisito del fabricante); licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Dibujar encapsulación y asignar IP/máscara/gateway; Predecir ARP/ICMP y demostrar ping permitido; Aislar defecto físico o de máscara.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** PC-A alcanza PC-B por ICMP y explica ARP. **Controles negativos:** Máscara incompatible impide conectividad prevista.
- **Fallos/variantes sembradas:** Dúplex incompatible simulado; Máscara incorrecta; Cable virtual desconectado.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [WS](https://www.wireshark.org/faq).

### RED-L02 — IPv6, Neighbor Discovery y MTU de extremo a extremo [diseñado_no_ejecutado_no_validado]
**Etapa:** 1 (Direccionamiento y captura); **Nivel:** Inicial; **Duración estimada:** 8 h; **Módulos:** RED-M03, RED-M04; **Prerrequisitos externos:** RED-M01, RED-M02.

- **Objetivo y competencia:** Demostrar de forma reproducible ipv6, neighbor discovery y mtu de extremo a extremo en un entorno docente controlado. Competencia medible: Planificar prefijos IPv6 y resolver fallos de vecindad/autoconfiguración.
- **Topología:** Host-v6 A ↔ router ↔ Host-v6 B; único dominio docente. **Direccionamiento:** 2001:db8:60:10::/64 y 2001:db8:60:11::/64; MTU declarada 1500 B, variación de MTU en un salto.
- **Herramientas/ruta:** Packet Tracer, Wireshark. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8–12 GB orientación; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Configurar GUA, link-local y ruta IPv6; Describir SLAAC, RA, DAD y ND con observación; Comparar tamaño de paquetes, PMTUD e ICMPv6.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Conectividad IPv6 y explicación comprobable de RA/ND. **Controles negativos:** RA ausente o filtrado con diagnóstico; el host no obtiene el prefijo previsto.
- **Fallos/variantes sembradas:** RA inaccesible; ICMPv6 esencial bloqueado; MTU incorrecta.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [WS](https://www.wireshark.org/faq), [WSCAP](https://www.wireshark.org/docs/wsug_html_chunked/ChIOSaveSection.html).

### RED-L03 — TCP/UDP, DNS, HTTP, TLS y captura inicial [diseñado_no_ejecutado_no_validado]
**Etapa:** 1 (Direccionamiento y captura); **Nivel:** Inicial; **Duración estimada:** 10 h; **Módulos:** RED-M04, RED-M05, RED-M06, RED-M07; **Prerrequisitos externos:** RED-M01, RED-M02, RED-M03.

- **Objetivo y competencia:** Demostrar de forma reproducible tcp/udp, dns, http, tls y captura inicial en un entorno docente controlado. Competencia medible: Separar fallo de red, transporte y aplicación con trazas observables.
- **Topología:** Client ↔ DNS interno ↔ servidor web de prueba; segmento docente. **Direccionamiento:** 10.60.20.0/24; DNS 10.60.20.53; web 10.60.20.80; cliente .10.
- **Herramientas/ruta:** Wireshark, tshark, Packet Tracer en modo simulación. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8–12 GB orientación; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Recoger PCAP propia o revisar dataset sintético etiquetado; Interpretar consultas y respuestas DNS, SYN/ACK, retransmisión; Comparar HTTP en claro con TLS sin asumir contenido visible.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Distingue handshake exitoso y solicitud DNS resuelta. **Controles negativos:** Fallo DNS controlado no se confunde con caída de red.
- **Fallos/variantes sembradas:** NXDOMAIN sintético; Timeout de DNS; RST TCP.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [WS](https://www.wireshark.org/faq), [WSCAP](https://www.wireshark.org/docs/wsug_html_chunked/ChIOSaveSection.html), [PT](https://www.netacad.com/cisco-packet-tracer).

### RED-L04 — Switching, VLAN, trunks 802.1Q, STP y LACP [diseñado_no_ejecutado_no_validado]
**Etapa:** 2 (Switching y servicios); **Nivel:** Inicial; **Duración estimada:** 12 h; **Módulos:** RED-M08, RED-M09, RED-M10; **Prerrequisitos externos:** RED-M01, RED-M02.

- **Objetivo y competencia:** Demostrar de forma reproducible switching, vlan, trunks 802.1q, stp y lacp en un entorno docente controlado. Competencia medible: Reconstruir conectividad capa 2 e interpretar MAC table y LLDP.
- **Topología:** SW-ACC1 ↔ SW-DIST ↔ SW-ACC2; PC-FIN y PC-HR en VLAN separadas; 3 enlaces redundantes en topología virtual. **Direccionamiento:** VLAN10 10.60.30.0/24; VLAN20 10.60.31.0/24; VLAN99 gestión 10.60.39.0/24.
- **Herramientas/ruta:** Packet Tracer donde aplique, CML-Free versión reducida ≤5 nodos. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 8–16 GB; CML necesita mínimo 8 GB propios; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Documentar tabla MAC y tags; Configurar VLAN, trunk y root STP previsto; Verificar agregación LACP disponible y forzar un fallo de enlace.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** VLAN correcta y convergencia tras pérdida de enlace. **Controles negativos:** Un cliente de VLAN10 no atraviesa L2 hacia VLAN20 sin routing.
- **Fallos/variantes sembradas:** VLAN nativa discordante; Raíz STP errónea; Puerto LACP suspendido.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/), [CML-REQ](https://developer.cisco.com/docs/modeling-labs/system-requirements/).

### RED-L05 — Servicios DNS/DHCP/NTP y dependencias AAA [diseñado_no_ejecutado_no_validado]
**Etapa:** 2 (Switching y servicios); **Nivel:** Inicial; **Duración estimada:** 10 h; **Módulos:** RED-M07, RED-M22; **Prerrequisitos externos:** RED-M02, RED-M03, RED-M05, RED-M06, RED-M09, RED-M12.

- **Objetivo y competencia:** Demostrar de forma reproducible servicios dns/dhcp/ntp y dependencias aaa en un entorno docente controlado. Competencia medible: Configurar/diagnosticar servicios de nombres, dirección y tiempo en topología docente.
- **Topología:** Clientes ↔ gateway ↔ DNS-DHCP ↔ syslog/servidor horario lógico. **Direccionamiento:** 10.60.40.0/24; servicio .53; gateway .1; clientes .100–.150.
- **Herramientas/ruta:** Packet Tracer, Linux/servicios de prueba, logs sintéticos. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8–12 GB orientación; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Identificar cadena DHCP DORA y leases; Resolver nombre interno y sincronía UTC; Observar intento administrativo ficticio AAA en registro simulado.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** DHCP asigna dirección y DNS resuelve hostname previsto. **Controles negativos:** DNS en error impide nombre pero no prueba pérdida de IP.
- **Fallos/variantes sembradas:** DNS forwarder falla; Lease agotado; Reloj fuera de tolerancia.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [WSCAP](https://www.wireshark.org/docs/wsug_html_chunked/ChIOSaveSection.html).

### RED-L06 — Enrutamiento estático y OSPFv2/OSPFv3 [diseñado_no_ejecutado_no_validado]
**Etapa:** 3 (Routing, resiliencia y WAN); **Nivel:** Intermedio; **Duración estimada:** 14 h; **Módulos:** RED-M12, RED-M13; **Prerrequisitos externos:** RED-M02, RED-M03, RED-M09.

- **Objetivo y competencia:** Demostrar de forma reproducible enrutamiento estático y ospfv2/ospfv3 en un entorno docente controlado. Competencia medible: Predecir la ruta seleccionada y reparar ausencia de ruta de retorno.
- **Topología:** R1—R2—R3; dos LAN de extremos; versiones IPv4 e IPv6. **Direccionamiento:** Tránsitos 10.60.50.0/30 y 10.60.50.4/30; LAN 10.60.51.0/24 y 10.60.52.0/24; IPv6 2001:db8:60:50::/64 etc..
- **Herramientas/ruta:** FRRouting, Containerlab, CML-Free max 5 nodos. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 16 GB recomendable para pequeña topología; 8 GB posible FRR ligero, no verificado; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Comparar ruta estática, LPM y adyacencias OSPF; Demostrar LSDB, ruta, vecino, coste y red de retorno; Cambiar área/coste controlado y diagnosticar convergencia.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** R1 llega LAN R3 con ruta esperada para IPv4/v6. **Controles negativos:** Area mismatch provoca ausencia de vecino y se diagnostica.
- **Fallos/variantes sembradas:** Area mismatch; ID duplicado; MTU inconsistente; Route feedback.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [FRR](https://docs.frrouting.org/en/latest/), [CLAB](https://containerlab.dev/manual/kinds/frr/), [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/).

### RED-L07 — BGP, filtros, políticas y redistribución segura [diseñado_no_ejecutado_no_validado]
**Etapa:** 3 (Routing, resiliencia y WAN); **Nivel:** Intermedio; **Duración estimada:** 16 h; **Módulos:** RED-M14, RED-M15; **Prerrequisitos externos:** RED-M12, RED-M13.

- **Objetivo y competencia:** Demostrar de forma reproducible bgp, filtros, políticas y redistribución segura en un entorno docente controlado. Competencia medible: Justificar selección de rutas y aplicar filtros BGP en dos AS simulados.
- **Topología:** AS65010 R1—AS65020 R2—AS65030 R3; prefix origination en R1, consumidor R3. **Direccionamiento:** Tránsitos 10.60.60.0/30 y 10.60.60.4/30; prefijo anunciado 10.60.61.0/24; anuncio no permitido 10.60.62.0/24.
- **Herramientas/ruta:** FRRouting, Containerlab. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 12–16 GB orientación; contenedores reducen sobrecarga; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Configurar pares eBGP e interpretar AS_PATH, next-hop, rutas aceptadas; Probar route-map/prefix-list para permitido/no permitido; Sembrar mala redistribución y verificar ruta de retorno.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Se anuncia 10.60.61.0/24 y se rechaza 10.60.62.0/24. **Controles negativos:** Anuncio prohibido no entra en tabla, con log o estado que lo demuestre.
- **Fallos/variantes sembradas:** Prefix-list al revés; Next-hop no alcanzable; Redistribución en bucle.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [FRR](https://docs.frrouting.org/en/latest/), [CLAB](https://containerlab.dev/manual/kinds/frr/).

### RED-L08 — Gateway redundante, QoS y diagnóstico de convergencia [diseñado_no_ejecutado_no_validado]
**Etapa:** 3 (Routing, resiliencia y WAN); **Nivel:** Intermedio; **Duración estimada:** 10 h; **Módulos:** RED-M16, RED-M19, RED-M39; **Prerrequisitos externos:** RED-M04, RED-M09, RED-M10, RED-M12, RED-M18, RED-M26, RED-M27.

- **Objetivo y competencia:** Demostrar de forma reproducible gateway redundante, qos y diagnóstico de convergencia en un entorno docente controlado. Competencia medible: Diseñar recuperación cuando falla enlace o gateway.
- **Topología:** GW-A y GW-B ↔ LAN cliente, enlace WAN con limitación controlada. **Direccionamiento:** LAN 10.60.70.0/24; gateway virtual previsto .1; WAN 10.60.71.0/30.
- **Herramientas/ruta:** CML-Free ≤5 nodos si compatible, FRRouting/Linux para alternativa funcional y no equivalencia. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 12–16 GB orientación; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Establecer baseline RTT/pérdida/jitter internos; Cambiar gateway activo y medir convergencia; Comparar política QoS propuesta con latencia y colas observadas.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Tras fallo simulado se restablece tráfico y se documenta intervalo medido, sin umbral fingido. **Controles negativos:** Gateway mal anunciado causa fallo que el estudiante detecta.
- **Fallos/variantes sembradas:** FHRP mal configurado; WAN congestionada; Ruta asimétrica.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/), [FRR](https://docs.frrouting.org/en/latest/).

### RED-L09 — NAT/PAT, VPN y WAN híbrida sin salida externa [diseñado_no_ejecutado_no_validado]
**Etapa:** 3 (Routing, resiliencia y WAN); **Nivel:** Intermedio; **Duración estimada:** 12 h; **Módulos:** RED-M17, RED-M18; **Prerrequisitos externos:** RED-M04, RED-M07, RED-M12.

- **Objetivo y competencia:** Demostrar de forma reproducible nat/pat, vpn y wan híbrida sin salida externa en un entorno docente controlado. Competencia medible: Explicar traducciones y las limitaciones para atribuir clientes.
- **Topología:** LAN-A ↔ FW-A ↔ red tránsito virtual ↔ FW-B ↔ LAN-B. **Direccionamiento:** LAN-A 10.60.80.0/24; LAN-B 10.60.81.0/24; tránsito 198.51.100.0/30 (TEST-NET-2: ejemplo documental; sustituir por RFC1918 si se ejecuta).
- **Herramientas/ruta:** OPNsense VM si hay recursos, FRR y registros IPsec sintéticos para perfil reducido. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 16–24 GB recomendados en VM; alternativa documental para 8–16 GB; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Construir mapa NAT antes/después con puertos; Diseñar y verificar IPsec site-to-site si la plataforma lo permite; Medir tráfico con y sin túnel y distinguir cifrado de atribución.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Tráfico permitido por túnel, evidenciado en extremos. **Controles negativos:** Regla denegada rechaza servicio concreto, sin romper túnel.
- **Fallos/variantes sembradas:** Regla NAT incorrecta; Selector de túnel equivocado; Rutas de retorno faltantes.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [OPN](https://opnsense.org/download/), [FRR](https://docs.frrouting.org/en/latest/).

### RED-L10 — Campus segmentado: ACL, firewall, hardening y controles L2 [diseñado_no_ejecutado_no_validado]
**Etapa:** 4 (Seguridad empresarial y cloud); **Nivel:** Intermedio; **Duración estimada:** 16 h; **Módulos:** RED-M20, RED-M21, RED-M22, RED-M23; **Prerrequisitos externos:** RED-M06, RED-M07, RED-M09, RED-M10, RED-M12, RED-M16, RED-M17.

- **Objetivo y competencia:** Demostrar de forma reproducible campus segmentado: acl, firewall, hardening y controles l2 en un entorno docente controlado. Competencia medible: Diseñar red empresarial escalable con documentación y riesgos.
- **Topología:** Usuarios VLAN10 ↔ FW/RTR ↔ servidores VLAN20 ↔ administración VLAN99. **Direccionamiento:** Usuarios 10.60.90.0/24; servidores 10.60.91.0/24; gestión 10.60.99.0/24.
- **Herramientas/ruta:** Packet Tracer para switching, CML-Free por fases, Linux nftables para filtrado real. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 16 GB perfil modular; CML 5 nodos no sustituye escenario completo; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Diseñar matriz de flujos por zona; Permitir DNS/HTTPS y denegar gestión desde usuarios; Probar acceso admin seguro y revisar DHCP snooping/DAI según plataforma.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Flujos explícitos permitidos y documentados. **Controles negativos:** Gestión desde usuarios y salto lateral quedan rechazados.
- **Fallos/variantes sembradas:** ACL dirección invertida; Regla sombra; DHCP rogue simulado sin cruzar LAN física.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/), [CML-REQ](https://developer.cisco.com/docs/modeling-labs/system-requirements/).

### RED-L11 — Wi-Fi corporativo, 802.1X/RADIUS y autenticación [diseñado_no_ejecutado_no_validado]
**Etapa:** 4 (Seguridad empresarial y cloud); **Nivel:** Intermedio; **Duración estimada:** 12 h; **Módulos:** RED-M11, RED-M23, RED-M24; **Prerrequisitos externos:** RED-M02, RED-M03, RED-M07, RED-M09, RED-M21, RED-M22.

- **Objetivo y competencia:** Demostrar de forma reproducible wi-fi corporativo, 802.1x/radius y autenticación en un entorno docente controlado. Competencia medible: Distinguir problemas RF, autenticación y direccionamiento WLAN.
- **Topología:** Cliente Wi-Fi simulado ↔ AP/controladora simulados ↔ RADIUS ↔ VLAN usuarios/invitados. **Direccionamiento:** Corp 10.60.100.0/24; Invitados 10.60.101.0/24; AAA 10.60.109.10.
- **Herramientas/ruta:** Packet Tracer: solo lo soportado y etiquetado, registros sintéticos RADIUS/WLAN, hardware propio opcional como ampliación. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8–12 GB perfil de logs/simulación; radio real requiere equipo autorizado; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Dibujar flujo EAP/802.1X y dependencias RADIUS; Contrastar aceptación y rechazo de identidad ficticia; Evaluar fallos de certificado, VLAN asignada y WPA2/3 en distintas capas.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Acceso de usuario autorizado a VLAN prevista según evidencia de simulación o logs sintéticos. **Controles negativos:** Credenciales/certificado no autorizado no obtiene acceso.
- **Fallos/variantes sembradas:** RADIUS inaccesible; Certificado expirado sintético; VLAN asignada incorrecta.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S11.
- **Límites particulares:** RF real, roaming físico y WPA3/802.1X real NO se dan por verificados mediante simulador; requieren hardware propio y pruebas separadas.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [CML-REL](https://developer.cisco.com/docs/modeling-labs/cml-release-notes/).

### RED-L12 — Diseño de red cloud/híbrida y verificación offline [diseñado_no_ejecutado_no_validado]
**Etapa:** 4 (Seguridad empresarial y cloud); **Nivel:** Intermedio; **Duración estimada:** 10 h; **Módulos:** RED-M18, RED-M20, RED-M21, RED-M25; **Prerrequisitos externos:** RED-M09, RED-M10, RED-M12, RED-M16, RED-M17, RED-M22.

- **Objetivo y competencia:** Demostrar de forma reproducible diseño de red cloud/híbrida y verificación offline en un entorno docente controlado. Competencia medible: Diseñar conectividad remota y diagnosticar overlay/underlay.
- **Topología:** VNet/VPC A ↔ túnel conceptual ↔ LAN B; subnets privadas y pública simulado en diagrama. **Direccionamiento:** Cloud 10.60.110.0/24; on-prem 10.60.111.0/24; destino denegado 10.60.112.0/24.
- **Herramientas/ruta:** Diagramas versionados, JSON políticas docentes, Cloud opcional solo con permiso de gasto. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8 GB suficiente para revisión offline; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Comparar tablas de rutas, firewall/NSG/SG por semántica, sin equivalencias automáticas; Definir flujos permitidos/denegados y pruebas que exigiríamos; Registrar cuotas, ruta retorno, registro y modelo de costes como pendientes.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Rutas/políticas coherentes en modelo revisado con casos trazados. **Controles negativos:** Diseño rechaza movimiento entre segmentos no autorizado.
- **Fallos/variantes sembradas:** Ruta por defecto excesiva; Exposición amplia; Confusión entre SG/ACL.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Límites particulares:** Nunca afirmar que los controles Azure/AWS fueron desplegados o probados; no generar gastos en este proyecto.
- **Fuentes oficiales:** [SENTINEL](https://learn.microsoft.com/en-us/azure/sentinel/billing), [FRR](https://docs.frrouting.org/en/latest/).

### RED-L13 — Telemetría Syslog/SNMP, UTC y calidad de observación [diseñado_no_ejecutado_no_validado]
**Etapa:** 5 (SOC: telemetría y respuesta); **Nivel:** Intermedio; **Duración estimada:** 10 h; **Módulos:** RED-M26; **Prerrequisitos externos:** RED-M05, RED-M07, RED-M22.

- **Objetivo y competencia:** Demostrar de forma reproducible telemetría syslog/snmp, utc y calidad de observación en un entorno docente controlado. Competencia medible: Explicar producción y calidad de logs y métricas de red.
- **Topología:** RTR1/SW1 → colector Syslog + fuente SNMP; reloj lógico compartido. **Direccionamiento:** Gestión 10.60.120.0/24; collector 10.60.120.10; router .1.
- **Herramientas/ruta:** Linux syslog, tshark, logs sintéticos versionados. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8–12 GB para procesamiento offline; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Comparar timestamps evento/ingesta y normalizar a UTC; Registrar origen, severidad, pérdida y duplicados; Contrastar SNMP polling frente a traps y límites de autenticación.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Se correlaciona un cambio de estado de interfaz con dos fuentes. **Controles negativos:** Se elimina falso duplicado sin borrar evento único.
- **Fallos/variantes sembradas:** Desfase reloj; Campos ausentes; Duplicación por reenvío.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Fuentes oficiales:** [WS](https://www.wireshark.org/faq), [WSCAP](https://www.wireshark.org/docs/wsug_html_chunked/ChIOSaveSection.html).

### RED-L14 — NetFlow/IPFIX, Zeek, Suricata e IDS/NDR [diseñado_no_ejecutado_no_validado]
**Etapa:** 5 (SOC: telemetría y respuesta); **Nivel:** Intermedio; **Duración estimada:** 14 h; **Módulos:** RED-M27; **Prerrequisitos externos:** RED-M17, RED-M21, RED-M26.

- **Objetivo y competencia:** Demostrar de forma reproducible netflow/ipfix, zeek, suricata e ids/ndr en un entorno docente controlado. Competencia medible: Distinguir flujos, alertas y paquetes y reconocer sesgos.
- **Topología:** PCAP offline → sensor Zeek/Suricata → colector de eventos; exporter IPFIX sintético etiquetado. **Direccionamiento:** Origen 10.60.130.10; destino 10.60.130.80; sensor lógico .20.
- **Herramientas/ruta:** Zeek, Suricata, Wireshark. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 8–16 GB según tamaño de PCAP; procesamiento secuencial; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Relacionar 5-tupla y ventanas de tiempo entre flujos y PCAP; Leer Zeek conn.log y Suricata EVE con campos documentados; Detectar evento con evidencia independiente y medir silencio por captura parcial.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Caso conocido genera evento en dataset preparado, campos comprobables. **Controles negativos:** Caso benigno no se clasifica automáticamente como intrusión.
- **Fallos/variantes sembradas:** Muestreo incompleto; No observación TLS contenido; Diferencia de esquema EVE.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S02, S04, S06.
- **Fuentes oficiales:** [ZEEK](https://docs.zeek.org/en/current/reference/logs/conn.html), [SUR](https://docs.suricata.io/en/suricata-8.0.3/output/eve/eve-json-output.html), [SUR-SCHEMA](https://docs.suricata.io/en/suricata-8.0.0/appendix/eve-schema.html), [WS](https://www.wireshark.org/faq).

### RED-L15 — Investigación SOC de PCAP con hipótesis y atribución [diseñado_no_ejecutado_no_validado]
**Etapa:** 5 (SOC: telemetría y respuesta); **Nivel:** Intermedio; **Duración estimada:** 14 h; **Módulos:** RED-M28, RED-M29; **Prerrequisitos externos:** RED-M05, RED-M06, RED-M07, RED-M17, RED-M26, RED-M27.

- **Objetivo y competencia:** Demostrar de forma reproducible investigación soc de pcap con hipótesis y atribución en un entorno docente controlado. Competencia medible: Interpretar sesiones y artefactos de red sin sobreafirmar.
- **Topología:** PCAP + DNS + DHCP + NAT + endpoint sintéticos de dos intervalos. **Direccionamiento:** IPs 10.60.140.10/24, 10.60.140.11/24; NAT a 198.51.100.10 con puertos y UTC.
- **Herramientas/ruta:** Wireshark, Zeek offline, dataset sintético propio por crear. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8 GB viable lectura PCAP pequeña; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Crear línea temporal UTC y atribución NAT con lease; Diferenciar DNS anómalo, backup y transferencia no confirmada; Documentar hipótesis benigna alternativa y evidencia desfavorable.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Asigna IP interna con puerto+tiempo o declara insuficiencia sin suplantar certeza. **Controles negativos:** No acusa exfiltración solo por bytes elevados.
- **Fallos/variantes sembradas:** Falta puerto NAT; Lease solapado; Sensor en lugar equivocado.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S01, S03, S04, S05.
- **Fuentes oficiales:** [ZEEK](https://docs.zeek.org/en/current/reference/logs/conn.html), [WS](https://www.wireshark.org/faq), [WSCAP](https://www.wireshark.org/docs/wsug_html_chunked/ChIOSaveSection.html).

### RED-L16 — Reglas de detección, normalización y respuesta SOC [diseñado_no_ejecutado_no_validado]
**Etapa:** 5 (SOC: telemetría y respuesta); **Nivel:** Intermedio; **Duración estimada:** 16 h; **Módulos:** RED-M30, RED-M31; **Prerrequisitos externos:** RED-M22, RED-M26, RED-M27, RED-M29.

- **Objetivo y competencia:** Demostrar de forma reproducible reglas de detección, normalización y respuesta soc en un entorno docente controlado. Competencia medible: Diseñar y evaluar una detección docente multiplataforma.
- **Topología:** Dataset multi-fuente → motor de reglas docentes → incidente de muestra; sin acceso real a SIEM. **Direccionamiento:** Orígenes de eventos 10.60.150.0/24; fechas UTC sintéticas sin direcciones externas reales.
- **Herramientas/ruta:** Python local, JSONL, matriz de reglas independiente SIEM. **Alternativa:** Captura/evidencia sintética y diagrama revisables sin levantar servicios.
- **Recursos y coste:** 8 GB para datos pequeños; sistemas SIEM externos no requeridos; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Definir campos de contrato + regla conceptual y casos de prueba; Comparar dataset positivo, benigno y ambiguo; Proponer contención y comprobar efecto en mesa; nunca aplicarla a producción.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Detecta variante positiva y justifica falsos positivos/negativos. **Controles negativos:** Caso benigno no desencadena afirmación de incidente confirmado.
- **Fallos/variantes sembradas:** Parser descarta puerto; Timezone desalineado; Regla sobreajustada.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S01, S02, S03, S04, S10.
- **Fuentes oficiales:** [ZEEK](https://docs.zeek.org/en/current/reference/logs/conn.html), [SUR-SCHEMA](https://docs.suricata.io/en/suricata-8.0.0/appendix/eve-schema.html), [SENTINEL](https://learn.microsoft.com/en-us/azure/sentinel/billing).

### RED-L17 — Alcance, descubrimiento mínimo y prueba de segmentación Red Team [diseñado_no_ejecutado_no_validado]
**Etapa:** 6 (Red Team autorizado); **Nivel:** Avanzado; **Duración estimada:** 16 h; **Módulos:** RED-M32, RED-M33, RED-M34; **Prerrequisitos externos:** RED-M01, RED-M07, RED-M12, RED-M23, RED-M24.

- **Objetivo y competencia:** Demostrar de forma reproducible alcance, descubrimiento mínimo y prueba de segmentación red team en un entorno docente controlado. Competencia medible: Definir límites y condiciones de parada de una prueba de red.
- **Topología:** Host-auditor → gateway lab → activo WEB 10.60.160.80 y activo ADMIN 10.60.161.50. **Direccionamiento:** Rango autorizado 10.60.160.80/32 y 10.60.161.50/32; un máximo de 2 hosts; rangos adicionales prohibidos.
- **Herramientas/ruta:** Host Linux de laboratorio, nftables, capturas offline. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 8–16 GB según topología; tráfico limitado sin DoS; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Redactar autorización con objetivos, puertos, volumen y parada; Enumerar de forma mínima sólo destinos autorizados; Comparar política allow/deny y verificar firewall y PCAP.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Servicio permitido confirma conexión al único destino autorizado. **Controles negativos:** Puerto o zona prohibida no es accesible y hay evento corroborado.
- **Fallos/variantes sembradas:** ROE incompletas; ACL sombra; Falta ruta retorno confundida con filtrado.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S07, S08, S09.
- **Límites particulares:** No se incluyen técnicas de acceso no autorizado, denegación de servicio, persistencia ni evasión. No se recomienda tráfico contra infraestructuras reales.
- **Fuentes oficiales:** [WS](https://www.wireshark.org/faq), [FRR](https://docs.frrouting.org/en/latest/).

### RED-L18 — Automatización de inventario, YANG/APIs y rollback [diseñado_no_ejecutado_no_validado]
**Etapa:** 7 (Automatización y rollback); **Nivel:** Avanzado; **Duración estimada:** 18 h; **Módulos:** RED-M36, RED-M37, RED-M38, RED-M39; **Prerrequisitos externos:** RED-M05, RED-M07, RED-M12, RED-M16, RED-M19, RED-M21, RED-M22, RED-M25, RED-M26, RED-M27.

- **Objetivo y competencia:** Demostrar de forma reproducible automatización de inventario, yang/apis y rollback en un entorno docente controlado. Competencia medible: Analizar logs/redes mediante scripts probados y versionados.
- **Topología:** Repositorio local → dispositivo FRR/endpoint de prueba → verificador de estado → snapshot. **Direccionamiento:** Mgmt 10.60.170.0/24; router .1; controlador de automatización .10.
- **Herramientas/ruta:** Python, Git, Ansible opcional, FRR, API/YANG docs. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 8–16 GB y necesidad de compatibilidad real por plataforma; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Leer JSON/YAML y mantener Git con pruebas unitarias; Calcular diff, cambio idempotente y validación de pre/post; Demostrar rollback tras pérdida esperada de conectividad; Comparar API soportada frente a ejemplo de NETCONF/RESTCONF en simulador o dataset.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Dos ejecuciones consecutivas producen mismo estado final (idempotencia). **Controles negativos:** Fallo de cambio activa rollback y restaura baseline.
- **Fallos/variantes sembradas:** Configuración inválida; Falta permisos; Esquema YANG ausente en plataforma elegida.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Límites particulares:** NETCONF/RESTCONF no se infieren disponibles en FRR; la plataforma concreta debe acreditar soporte o usarse una API de laboratorio independiente claramente distinguida.
- **Fuentes oficiales:** [FRR](https://docs.frrouting.org/en/latest/), [CLAB](https://containerlab.dev/manual/kinds/frr/).

### RED-L19 — Proyecto empresarial integrado: diseño, resiliencia y operación [diseñado_no_ejecutado_no_validado]
**Etapa:** 8 (Integración y evaluación final); **Nivel:** Avanzado; **Duración estimada:** 24 h; **Módulos:** RED-M15, RED-M20, RED-M21, RED-M23, RED-M25, RED-M38, RED-M39, RED-M40; **Prerrequisitos externos:** RED-M07, RED-M09, RED-M10, RED-M12, RED-M13, RED-M14, RED-M16, RED-M17, RED-M18, RED-M19, RED-M22, RED-M26, RED-M27, RED-M36, RED-M37.

- **Objetivo y competencia:** Demostrar de forma reproducible proyecto empresarial integrado: diseño, resiliencia y operación en un entorno docente controlado. Competencia medible: Evitar bucles y fugas mediante redistribución y separación de planos.
- **Topología:** Campus de 3 zonas + 2 gateways lógicos + servicio DNS + firewall + sensor; división modular del escenario si sólo hay 5 nodos. **Direccionamiento:** Usuarios 10.60.180.0/24; apps 10.60.181.0/24; gestión 10.60.189.0/24; WAN enlace 10.60.190.0/30.
- **Herramientas/ruta:** Packet Tracer / Linux / FRR por segmentos, documentación no dependiente de proveedor. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 16–32 GB si se pretende ejecutar parcialmente; alternativa de diseño controlado en 8–16 GB; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Definir requisitos y threat model del cliente ficticio; Presentar diseño, rutas, segmentación, continuidad, backups y rollback; Resolver tres fallos sembrados y justificar decisiones de coste/observabilidad.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Matriz de conectividad, rutas y cambios cumple requisitos documentados. **Controles negativos:** Intenta un flujo no autorizado y demuestra rechazo en variante reducida.
- **Fallos/variantes sembradas:** Fallo de enrutamiento asimétrico; Gestión expuesta; Conflicto de dirección.
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S08, S12.
- **Límites particulares:** Proyecto no puede probarse completo en CML-Free de cinco nodos simultáneos. Se exige dividirlo en escenas verificables o usar plataforma permitida con recursos suficientes.
- **Fuentes oficiales:** [PT](https://www.netacad.com/cisco-packet-tracer), [FRR](https://docs.frrouting.org/en/latest/), [CLAB](https://containerlab.dev/manual/kinds/frr/), [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/).

### RED-L20 — Misión final Purple: actividad autorizada, SOC y retest [diseñado_no_ejecutado_no_validado]
**Etapa:** 8 (Integración y evaluación final); **Nivel:** Avanzado; **Duración estimada:** 26 h; **Módulos:** RED-M30, RED-M31, RED-M35, RED-M41, RED-M42; **Prerrequisitos externos:** RED-M22, RED-M26, RED-M27, RED-M29, RED-M34, RED-M40.

- **Objetivo y competencia:** Demostrar de forma reproducible misión final purple: actividad autorizada, soc y retest en un entorno docente controlado. Competencia medible: Diseñar y evaluar una detección docente multiplataforma.
- **Topología:** Zona usuarios → firewall → zona servidor; generador de tráfico + sensor PCAP/EVE + colector; entorno aislado, módulos en turnos. **Direccionamiento:** Usuarios 10.60.200.0/24; servidor 10.60.201.0/24; gestión/sensor 10.60.209.0/24.
- **Herramientas/ruta:** Zeek/Suricata offline, nftables, FRR/Linux, dataset sintético de entrenamiento. **Alternativa:** Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero.
- **Recursos y coste:** 16 GB por fases, 24–32 GB para varios sensores simultáneos; sin Security Onion Standalone obligatorio; licencia principal estimada sin coste monetario cumpliendo condiciones del proveedor. Hardware/consumo excluidos. **Versión:** fijar y hash al preparar, no existe entorno probado.
- **Preparación, aislamiento y autorización:** Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales. Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio). Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.
- **Tareas previstas:** Red Team propone ROE y genera sólo actividad controlada con archivos ficticios; SOC registra alerta y hipótesis alternativas, crea cronología y alcance; Equipo diseña contención, ejecuta solo en entorno autorizado, valida revertibilidad y repite prueba; Defensa final incluye demostración, diferencia pre/post y límites de prueba.
- **Evidencia esperada:** Topología numerada y tabla de interfaces/direcciones; Configuración inicial/final o captura de resultados y comandos usados; Resultado de prueba positiva y control negativo; Diagnóstico causal más limitaciones y evidencia contradictoria; Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica.
- **Pruebas positivas:** Flujo autorizado genera evidencia y detector positivo documentado. **Controles negativos:** Tráfico benigno o prueba bloqueada no se sobredimensionan; regla no debe marcar ambos por defecto.
- **Fallos/variantes sembradas:** Pérdida de visibilidad; Alerta falsa; Rollback falla (se evalúa plan, no se expone sistema externo).
- **Aprobación verificable:** Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento. **Errores críticos:** Infringir alcance o enviar actividad fuera del laboratorio; Declarar ejecución/validación sin evidencia; Confundir simulación, logs sintéticos y producción; No aportar prueba negativa o no controlar estado inicial.
- **Evaluación:** rúbrica común 100 puntos y criterios específicos; fallo crítico de aislamiento impide aprobar **Restauración/limpieza:** Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.
- **Escenarios T4 vinculados:** S07, S08, S12.
- **Límites particulares:** No se califica éxito por comprometer un objetivo. Se califica evidencia del control, respeto de ROE y corrección/retest.
- **Fuentes oficiales:** [ZEEK](https://docs.zeek.org/en/current/reference/logs/conn.html), [SUR](https://docs.suricata.io/en/suricata-8.0.3/output/eve/eve-json-output.html), [FRR](https://docs.frrouting.org/en/latest/), [SO](https://docs.securityonion.net/en/2.4/hardware.html).

## 4. Extensiones opcionales no necesarias para aprobar
### RED-X01 — Wi-Fi real controlado: RF, roaming, WPA3-Enterprise
- **Estado:** opcional_diseñado_no_validado. **Horas adicionales voluntarias:** 8 h. **Módulos:** RED-M11, RED-M23, RED-M24, RED-M34.
- **Requisitos:** AP propio configurable y dispositivos bajo control legal; radiofrecuencia sin interferir redes ajenas; herramientas con permiso. **Resultado:** Contrastar simulación/registro con 802.11 en radio real, interferencia y RADIUS.
- **Coste:** No hay importe verificado; dependerá de hardware propio; no es prerrequisito. **Licencia:** Verificar equipo y firmware; no incluir capturas de terceros. **Seguridad:** Únicamente SSID y clientes propios; sin deauth ajeno ni captura de terceros. **Fuentes:** [CML-REL](https://developer.cisco.com/docs/modeling-labs/cml-release-notes/), [PT](https://www.netacad.com/cisco-packet-tracer).

### RED-X02 — Alternativa empresarial con CML Personal y más nodos
- **Estado:** opcional_diseñado_no_validado. **Horas adicionales voluntarias:** 10 h. **Módulos:** RED-M13, RED-M14, RED-M20, RED-M40.
- **Requisitos:** VM CML con recursos y suscripción autorizada, sin exportar IOS hacia GNS3. **Resultado:** Montar topología ampliada si el titular adquiere y cumple la licencia.
- **Coste:** Cisco publica Personal USD 199 y Plus USD 349 (precio web consultado 2026-10-18); sin conversión EUR ni impuestos. **Licencia:** Uso y distribución en academia por validar con titular/licenciante. **Seguridad:** Topología aislada y sin puentes a producción. **Fuentes:** [CML-PRICES](https://www.cisco.com/site/us/en/learn/training-certifications/training/modeling-labs/index.html), [CML-FREE](https://developer.cisco.com/docs/modeling-labs/cml-free/), [CML-REQ](https://developer.cisco.com/docs/modeling-labs/system-requirements/).

## 5. Rúbricas: calidad de evidencia antes que XP
Propuesta de aprobación: ≥75/100 en laboratorio, ≥80/100 en misión final; **un fallo crítico de autorización, privacidad o aislamiento impide aprobar aunque la suma sea suficiente**. No confundir nota propuesta con umbral ya validado. Cada tarea exige una prueba positiva, un control negativo, fuentes con UTC, revisión del motivo y restauración. Repetir evaluación tras remediar.
### Ingenieria (100 puntos)
| Criterio | Puntos |
|---|---:|
| Diseno y exp | 20 |
| Configuracion y verificacion | 25 |
| Diagnostico causal | 25 |
| Prueba negativa | 15 |
| Evidencia y restauracion | 15 |
**Errores que invalidan**: ejecución sobre activos ajenos, cambios no autorizados o reportar pruebas no ejecutadas. Trazabilidad mediante artefactos y revisor independiente.

### Soc (100 puntos)
| Criterio | Puntos |
|---|---:|
| Integridad y fuentes | 25 |
| Cronologia utc y atribucion | 20 |
| Hipotesis alternativas | 20 |
| Alcance y correlacion | 20 |
| Comunicacion y escalado | 15 |
**Errores que invalidan**: ejecución sobre activos ajenos, cambios no autorizados o reportar pruebas no ejecutadas. Trazabilidad mediante artefactos y revisor independiente.

### Redteam (100 puntos)
| Criterio | Puntos |
|---|---:|
| Autorizacion roe y parada | 30 |
| Minimizacion y prueba de control | 25 |
| Telemetria y prueba negativa | 20 |
| Informe y limitaciones | 15 |
| Retest y restauracion | 10 |
**Errores que invalidan**: ejecución sobre activos ajenos, cambios no autorizados o reportar pruebas no ejecutadas. Trazabilidad mediante artefactos y revisor independiente.

### Integral (100 puntos)
| Criterio | Puntos |
|---|---:|
| Arquitectura y operacion | 20 |
| Actividad controlada roe | 20 |
| Deteccion y razonamiento soc | 25 |
| Correccion retest y rollback | 25 |
| Defensa y limitaciones | 10 |
**Errores que invalidan**: ejecución sobre activos ajenos, cambios no autorizados o reportar pruebas no ejecutadas. Trazabilidad mediante artefactos y revisor independiente.

## 6. Cobertura comprobable de los 42 módulos
| Módulo | Laboratorios enlazados | Resultado esperado (resumen) |
|---|---|---|
| RED-M01 — Modelo de comunicaciones y diagnóstico físico | RED-L01 | Explicar una comunicación extremo a extremo y aislar un fallo físico/L1-L2 |
| RED-M02 — IPv4, CIDR, VLSM y plan de direccionamiento | RED-L01 | Diseñar y justificar un esquema IPv4 sin solapamientos |
| RED-M03 — IPv6, ND y autoconfiguración | RED-L02 | Planificar prefijos IPv6 y resolver fallos de vecindad/autoconfiguración |
| RED-M04 — TCP, UDP, MTU/MSS y transporte | RED-L02, RED-L03 | Separar fallo de red, transporte y aplicación con trazas observables |
| RED-M05 — Captura y evidencia de red inicial | RED-L03 | Obtener e interpretar una captura de laboratorio preservando procedencia |
| RED-M06 — Servicios y protocolos empresariales observables | RED-L03 | Describir dependencias y evidencias de TLS, HTTP, SSH, SMB, RDP, LDAP y Kerberos |
| RED-M07 — DNS, DHCP, NTP y resolución de fallos | RED-L03, RED-L05 | Configurar/diagnosticar servicios de nombres, dirección y tiempo en topología docente |
| RED-M08 — Switching Ethernet, tablas MAC y descubrimiento | RED-L04 | Reconstruir conectividad capa 2 e interpretar MAC table y LLDP |
| RED-M09 — VLAN, 802.1Q, trunks e inter-VLAN | RED-L04 | Diseñar y verificar segmentación L2/L3 básica |
| RED-M10 — STP/RSTP/MSTP y LACP | RED-L04 | Diagnosticar redundancia de campus sin bucles ni blackholes |
| RED-M11 — Fundamentos Wi-Fi, RF y conectividad | RED-L11 | Distinguir problemas RF, autenticación y direccionamiento WLAN |
| RED-M12 — Tablas de rutas y enrutamiento estático | RED-L06 | Predecir la ruta seleccionada y reparar ausencia de ruta de retorno |
| RED-M13 — OSPFv2/v3 empresarial | RED-L06 | Configurar y diagnosticar OSPF y justificar uso de áreas |
| RED-M14 — BGP y políticas de rutas | RED-L07 | Justificar selección de rutas y aplicar filtros BGP en dos AS simulados |
| RED-M15 — Routing avanzado, VRF y redistribución | RED-L07, RED-L19 | Evitar bucles y fugas mediante redistribución y separación de planos |
| RED-M16 — Gateway redundante y convergencia | RED-L08 | Diseñar recuperación cuando falla enlace o gateway |
| RED-M17 — NAT, PAT, proxies y asimetría | RED-L09 | Explicar traducciones y las limitaciones para atribuir clientes |
| RED-M18 — WAN, VPN, IPsec, GRE, MPLS y SD-WAN | RED-L09, RED-L12 | Diseñar conectividad remota y diagnosticar overlay/underlay |
| RED-M19 — QoS, multicast y calidad de experiencia | RED-L08 | Justificar decisiones de rendimiento con mediciones |
| RED-M20 — Diseño de campus, zonas y resiliencia | RED-L10, RED-L12, RED-L19 | Diseñar red empresarial escalable con documentación y riesgos |
| RED-M21 — ACL, firewall stateful y segmentación | RED-L10, RED-L12, RED-L19 | Aplicar política de mínimos privilegios y validar flujos |
| RED-M22 — Planos, AAA y hardening de infraestructura | RED-L05, RED-L10 | Separar gestión/control/datos y proteger administración |
| RED-M23 — Controles L2, 802.1X y NAC | RED-L10, RED-L11, RED-L19 | Defender acceso de red y demostrar límites por plataforma |
| RED-M24 — WLAN empresarial y seguridad inalámbrica | RED-L11 | Diagnosticar WPA2/WPA3-Enterprise y segmentación Wi-Fi |
| RED-M25 — Cloud networking e interconexión híbrida | RED-L12, RED-L19 | Diseñar conectividad VNet/VPC híbrida y sus fuentes de evidencia |
| RED-M26 — Syslog, SNMP, NTP y observabilidad de equipos | RED-L13 | Explicar producción y calidad de logs y métricas de red |
| RED-M27 — IPFIX/NetFlow, IDS/IPS y NDR | RED-L14 | Distinguir flujos, alertas y paquetes y reconocer sesgos |
| RED-M28 — Análisis PCAP avanzado y protocolos | RED-L15 | Interpretar sesiones y artefactos de red sin sobreafirmar |
| RED-M29 — Investigación SOC de hipótesis y cronologías | RED-L15 | Investigar hipótesis alternativas y escalar con grado de confianza |
| RED-M30 — Correlación, normalización y detección | RED-L16, RED-L20 | Diseñar y evaluar una detección docente multiplataforma |
| RED-M31 — Respuesta a incidentes y recuperación de red | RED-L16, RED-L20 | Proponer contención proporcionada, preservación y verificación |
| RED-M32 — Autorización, alcance y reglas de actuación | RED-L17 | Definir límites y condiciones de parada de una prueba de red |
| RED-M33 — Descubrimiento y enumeración seguros | RED-L17 | Crear inventario de activos y verificar servicios únicamente en lab |
| RED-M34 — Evaluación autorizada de controles de red | RED-L17 | Demostrar el comportamiento de ACL, NAC, Wi-Fi y rutas en lab |
| RED-M35 — Validación conjunta, remediación y retest | RED-L20 | Coordinar ensayo controlado, investigación SOC y corrección |
| RED-M36 — Python, datos y Git para operaciones de red | RED-L18 | Analizar logs/redes mediante scripts probados y versionados |
| RED-M37 — APIs, YANG y automatización de dispositivos | RED-L18 | Diseñar tareas de inventario/configuración con API y modelo de datos |
| RED-M38 — Cambios controlados, idempotencia y rollback | RED-L18, RED-L19 | Planear cambios reproducibles y recuperación ante fallos |
| RED-M39 — Troubleshooting avanzado, capacidad y assurance | RED-L08, RED-L18, RED-L19 | Encontrar causa raíz con hipótesis y métricas de red |
| RED-M40 — Proyecto final: diseño de red empresarial | RED-L19 | Entregar arquitectura de red empresarial defendible y recuperable |
| RED-M41 — Proyecto final: operación SOC ↔ Red Team | RED-L20 | Unir actividad autorizada, observación, investigación y corrección |
| RED-M42 — Defensa técnica, diagnóstico de egreso y plan de retención | RED-L20 | Defender decisiones ante revisión y mostrar retención de competencias |

**Regla:** un vínculo en esta tabla no demuestra ejecución ni que todos los subobjetivos oficiales estén cubiertos. Solo representa un lugar explícito donde evaluar la competencia.

## 7. Mapeo de escenarios T4 a actividades
| Escenario T4 | Laboratorios con actividad/evidencia proyectada |
|---|---|
| S01 — DNS anómalo vs aplicación legítima | RED-L15, RED-L16 |
| S02 — Periodicidad de conexiones vs monitorización | RED-L14, RED-L16 |
| S03 — Acceso remoto nuevo vs administración aprobada | RED-L15, RED-L16 |
| S04 — Transferencia elevada vs copia de seguridad | RED-L14, RED-L15, RED-L16 |
| S05 — Atribución tras NAT y DHCP | RED-L15 |
| S06 — Sensor parcial o pérdida de captura | RED-L14 |
| S07 — Descubrimiento de servicios autorizado | RED-L17, RED-L20 |
| S08 — Prueba de segmentación allow/deny | RED-L17, RED-L19, RED-L20 |
| S09 — Autenticaciones fallidas limitadas | RED-L17 |
| S10 — VPN de administración legítima | RED-L16 |
| S11 — 802.1X / WLAN corporativa | RED-L11 |
| S12 — Corrección y retest integrador | RED-L19, RED-L20 |

## 8. Protocolo de evidencia, etiquetado y publicación posterior
**Estructura mínima por entrega:** `manifest.json` (lab_id, módulo, versión, licencia, UTC, clase `SIMULATED | GENERATED | LIVE_AUTHORIZED`, semilla, hash), `topology.md`, `baseline/`, `configuration-diff/`, `positive/`, `negative/`, `incident-analysis.md` y `cleanup-checklist.md`. Valores/salidas de ejemplo deben etiquetarse `sintético` y no fingir logs de sensores ejecutados.

**Verdad terreno:** crear por separado en fase de implementación un escenario controlado que documente resultado esperado sin exponerlo previamente al alumno; registrar qué campos y sensores deberían observar cada evento y qué observaciones son imposibles con cifrado/visibilidad parcial. Capturas y eventos no deben incluir datos reales o personales.

## 9. Puertas de calidad para pasar de diseñado a validado
- **T — Trazabilidad: módulos y competencias:** Cada módulo tiene al menos un laboratorio con evidencia y criterio concreto.
- **R — Recursos reales y licencias:** SO soportado, RAM/cpu/disco medidos, derecho de uso y redistribución acreditados.
- **I — Aislamiento y seguridad:** No hay conectividad a LAN/Internet salvo necesidad expresamente autorizada y controlada.
- **D — Datos y sensores:** Datasets con verdad terreno, fuentes, campos y artefactos SHA-256 reproducibles.
- **F — Fallos y restauración:** Semillas, snapshot previo, fallo reproducible y reversión demostrados.
- **G — Evaluación:** Pruebas positivas/negativas, rúbrica, puntuación interevaluador y feedback.
- **V — Validez técnica:** Cada feature contrastada en la versión exacta de la imagen/plataforma.
- **C — Coste y coste temporal:** Tiempo ejecutado, consumo, costes y condiciones verificados por alumno.

Los estados son `diseñado` → `prototipo_ejecutado` (evidencia de una primera prueba) → `validado` (repetible por tercero con versión/coste/hardware registrados). **En esta tanda todo permanece `diseñado`.**

## 10. Riesgos y brechas restantes (CRITIC)
| ID | Prioridad | Brecha | Investigación siguiente |
|---|---|---|---|
| O01 | critica | No se ha ejecutado ningún laboratorio, ni medido hardware/tiempo | Reproducir 3 pilotos en PC de 8,16 y 32 GB (al menos uno real/simulado y uno offline) |
| O02 | critica | Licencia de distribución y uso comercial de CML-Free/Packet Tracer e imágenes | Revisar licencias/ToS de cada proveedor y pedir permiso cuando corresponda; ofrecer alternativa libre |
| O03 | alta | Accesibilidad de Packet Tracer en Parrot OS sin soporte explícito | Probar en distro soportada o ofrecer ruta GNS3/LX namespaces y lectura offline |
| O04 | alta | 802.1X/WPA3 y RF real no verificables solo con simulación | Laboratorio opcional con AP propio bajo autorización o prueba con dataset sin afirmar configuración real |
| O05 | alta | CML-Free 5 nodos y escenarios enterprise/sensores que requieren más | Dividir prácticas por escenas reproducibles y validar topologías reducidas, sin afirmar ejecución simultánea |
| O06 | alta | No hay datasets ni golden answers publicables/licenciadas | Crear datos sintéticos propios con hashes/verdad terreno y licencia clara en fase posterior |
| O07 | alta | VPN IPsec, QoS, FHRP, NETCONF/RESTCONF por plataforma | Matriz de compatibilidad de versión/imagen, capacidades soportadas y rutas alternativas |
| O08 | media | Cronometraje de tarea, capacidad de RAM y almacenamiento real | Benchmark de secuencias y piloto con rúbrica en estudiantes diversos |
| O09 | media | Rúbricas sin confiabilidad interevaluador | Dos revisores califican mismos 5 informes, documentan diferencias y actualizan anclajes |
| O10 | media | Costes de cloud opcional o licencia paid y tributación región | Cotizar al momento de decidir incorporar actividad pagada, con presupuesto y borrado |

## 11. Restricciones vinculantes y alcance posterior
- Aislar por defecto; prohibir bridges a LAN/internet para escenarios ofensivos.
- Uso exclusivamente en activos propios del laboratorio con alcance escrito y criterio de parada.
- No usar cuentas personales, datos de producción ni extracciones de datos reales.
- Nunca confundir un diseño o fixture sintético con ejecución real ni validación.
- Capturas sólo propias/autorizadas; hash y UTC; no publicar credenciales, PCAP con datos personales o binarios de Cisco.
- Toda instancia cloud necesita presupuesto separado aprobado y controles de borrado.

En Tanda 6 se diseñarán las conexiones conceptuales con Sentinel/Defender XDR, Splunk, Windows/AD, Linux y el simulador, sin asumir modificaciones del motor de progreso ni permisos de redistribución de software. En Tanda 7 se consolidará auditoría crítica y matriz de cumplimiento; los pilotos técnicos y la implementación exigen autorización posterior.

## 12. Registro de fuentes verificadas
| Ref | Organización | Fuente y URL directa | Versión/fecha | Afirma |
|---|---|---|---|---|
| CML-FREE | Cisco | [Cisco Modeling Labs – Free](https://developer.cisco.com/docs/modeling-labs/cml-free/) | 2.10; consulta 2026-10-18 | 5 nodos, solo un usuario, imágenes licenciadas solo dentro de CML; telemetría anonimizada no desactivable |
| CML-REQ | Cisco | [CML – System Requirements](https://developer.cisco.com/docs/modeling-labs/system-requirements/) | 2.10; consulta 2026-10-18 | Mínimo VM: 8 GB, 4+ cores Intel, 32 GB disco; recursos consumidos por nodos aparte |
| CML-REL | Cisco | [CML 2.10 Release Notes](https://developer.cisco.com/docs/modeling-labs/cml-release-notes/) | 2.10.1 mantenim. 2026-10-01; consulta 2026-10-18 | Existe release 2.10.1; modelos wireless experimentales; no asegurar su presencia en Free |
| CML-PRICES | Cisco | [Cisco Modeling Labs, Personal](https://www.cisco.com/site/us/en/learn/training-certifications/training/modeling-labs/index.html) | consulta 2026-10-18 | Personal 199 USD, Personal Plus 349 USD publicados (moneda USD); ver condiciones y precios al comprar |
| PT | Cisco Networking Academy | [Cisco Packet Tracer](https://www.netacad.com/cisco-packet-tracer) | consulta 2026-10-18 | Curso gratuito y descarga por cuenta académica; simulación limitada no genera PCAP física |
| PT-DOC | Cisco Networking Academy | [Packet Tracer Download and Installation Instructions](https://www.netacad.com/skillsforall/files/Cisco_Packet_Tracer_Download_and_Installation_Instructions.pdf) | ©2025; consulta 2026-10-18 | Windows, Linux, macOS; no se valida Parrot OS como plataforma soportada |
| GNS3 | GNS3 | [Where do I get IOS images?](https://docs.gns3.com/docs/troubleshooting-faq/where-do-i-get-ios-images) | consulta 2026-10-18 | GNS3 no distribuye IOS; los derechos de cada imagen requieren verificación |
| CLAB | Containerlab | [FRRouting Kind](https://containerlab.dev/manual/kinds/frr/) | consulta 2026-10-18 | FRR en topologías reproducibles; cuidado con permisos de contenedores y limpieza |
| FRR | FRRouting | [FRRouting User Guide](https://docs.frrouting.org/en/latest/) | consulta 2026-10-18 | Suite de routing GPLv2; funciones y soporte por plataforma varían |
| WS | Wireshark | [Wireshark FAQ](https://www.wireshark.org/faq) | consulta 2026-10-18 | Sin coste de licencia, GPLv2 |
| WSCAP | Wireshark | [Saving Captured Packets](https://www.wireshark.org/docs/wsug_html_chunked/ChIOSaveSection.html) | consulta 2026-10-18 | PCAP no siempre incluye contadores de paquetes descartados |
| ZEEK | Zeek | [conn.log – Book of Zeek](https://docs.zeek.org/en/current/reference/logs/conn.html) | documentación 9.0.0 actual al consultar | Interpretación de flujos TCP/UDP; significado de estado y bytes |
| SUR | OISF | [Suricata 8.0.3 EVE JSON Output](https://docs.suricata.io/en/suricata-8.0.3/output/eve/eve-json-output.html) | 8.0.3 (documentación consultada) | EVE registra alertas, flujos/metadatos y protocolos; esquema depende de versión |
| SUR-SCHEMA | OISF | [Suricata 8.0 EVE JSON Schema](https://docs.suricata.io/en/suricata-8.0.0/appendix/eve-schema.html) | 8.0.0 ejemplo; consulta 2026-10-18 | Esquema versionado; campos no universales |
| SO | Security Onion | [Hardware Requirements](https://docs.securityonion.net/en/2.4/hardware.html) | Security Onion 2.4 doc; consulta 2026-10-18 | Standalone 24 GB RAM y 200 GB almacenamiento como mínimo; eval/import diferentes |
| OPN | OPNsense | [Download OPNsense](https://opnsense.org/download/) | consulta 2026-10-18 | Firewall comunitario descargable sin coste de licencia; consumir recursos de VM |
| SENTINEL | Microsoft | [Plan costs and understand Microsoft Sentinel pricing and billing](https://learn.microsoft.com/en-us/azure/sentinel/billing) | consulta 2026-10-18 | Prueba 31 días 10 GB/día con exclusiones; costes de complementos y de otros recursos posibles |
| RFC5737 | IETF/RFC Editor | [RFC 5737 – IPv4 Address Blocks Reserved for Documentation](https://www.rfc-editor.org/rfc/rfc5737.html) | 2010-01, consulta 2026-10-18 | 198.51.100.0/24 TEST-NET-2 es solo para documentación, no direccionamiento privado de producción |
| RFC3849 | IETF/RFC Editor | [RFC 3849 – IPv6 Address Prefix Reserved for Documentation](https://www.rfc-editor.org/rfc/rfc3849.html) | 2004-07, consulta 2026-10-18 | 2001:db8::/32 reservado para ejemplos, no uso operativo |
| CCNA | Cisco | [CCNA exam topics](https://learningnetwork.cisco.com/s/ccna-exam-topics) | consulta inicial T1-T3 | Programas: conservar matriz de T3, no afirmar correspondencia 1:1 |

_Consulta realizada el 2026-10-18; los costes y licencias pueden cambiar. Enlaces oficiales que requieren JS o cuenta pueden impedir comprobar condiciones adicionales._
