# MUNDO DE REDES — TANDA 3/7
## Auditoría técnica profunda de ingeniería de redes: CCNA/CCNP, estándares, evidencias y correcciones

**Fecha de consulta y propuesta:** 18-10-2026. **Estado:** análisis documental y propuesta de corrección, SIN contenido desarrollado ni laboratorios ejecutados. **Entrada:** archivos `redes.txt`, informe T1 y currículo T2 que existen en el entorno de trabajo. **No se han modificado sus originales.**

### Alcance y definición de los estados
- **T — Trazado:** el área se identifica razonablemente en módulos/lecciones T2, aunque **NO demuestra cobertura implementada ni superación de un examen**.
- **P — Parcial:** mapeado pero no lo bastante explícito para validar el verbo/evidencia del blueprint.
- **H — Hueco:** el subtema o la evidencia no aparece de forma explícita en el diseño T2.
- **O — Omisión deliberada propuesta:** componente centrado en marca u ocupación que debe quedar como complemento explicado, no como competencia troncal universal.
- Un estatus T **no es aprobado**: todas las prácticas y evaluaciones siguen sin ejecutar ni validar. Esta auditoría mapea objetivos principales **x.y**, no afirma mapeo exhaustivo de subobjetivos x.y.a, x.y.b, etc.; no hay porcentajes defensables de preparación para certificación.
- Las matrices T1/T2 contienen 34 áreas temáticas y 42 módulos; esta T3 las contrasta contra 53 objetivos principales de CCNA v1.1, 27 de ENCOR v1.2 y 29 del CCNA v2.0 publicado pero futuro.

## 1. Dictamen curricular
**Mantener provisionalmente 8 etapas, 42 IDs estables y 168 títulos de lecciones solo como estructura.** No ratificar las 592 horas sin validar la carga real. Varias unidades necesitan más precisión técnica, por lo que tanto la descomposición en lecciones como las horas deberán revisarse antes de aprobación. Conservar las ramas SOC/Red Team definidas en T2, reservando su auditoría profunda para T4.

**Hallazgos de ingeniería prioritarios:** OSPF multiárea y BGP routing-policy (M13-15); VXLAN/LISP y virtual switching (M20/M25); RA guard/storm control y security IPv6 L2 (M23); PTP, IP SLA, NetFlow real vs IPFIX y SPAN (M26/M27/M39); evidencia de API/YANG/Ansible y rollback (M36-38).
**Corrección al informe T1:** un PDF Cisco alternativo de ENARSI localizado en búsqueda muestra título v1.1 pero descripción v1.2; se ha elegido explícitamente el documento `300-410-ENARSI-v1.1.7-2025.pdf` cuya portada y descripción coinciden en v1.1 (CO4). No se infiere actualización de examen a v1.2 solo por esa discrepancia editorial.

## 2. Matriz por objetivo principal
### CCNA 200-301 v1.1 (vigente 18-10-2026)
**Recuento de filas auditadas:** 53; T 24, P 26, H 2, O 1. **Estos recuentos miden la calidad de especificación documental, NO % de programa cubierto ni competencias logradas.**
| ID | Tema oficial resumido en español | Módulos T2 | Estado de diseño | Brecha/evidencia pendiente |
|---|---|---|:---:|---|
| 1.1 | Componentes de red y PoE | M01, M08, M11, M20 | **P** | PoE y controladoras solo implícitos: definir identificación, capacidad y fallos |
| 1.2 | Topologías 2/3 niveles, spine-leaf, WAN, SOHO, cloud | M20, M25 | **P** | Falta escenario spine-leaf y comparación con 3-tier/SOHO |
| 1.3 | Medios físicos, cobre y fibra | M01 | **P** | Falta fibra monomodo/multimodo, transceptores y alcance |
| 1.4 | Errores interfaz, velocidad y dúplex | M01 | **T** | Exigir salidas y causa raíz, no solo definición |
| 1.5 | Comparar TCP y UDP | M04 | **T** | Añadir casos que distingan fiabilidad y latencia |
| 1.6 | Configurar y verificar IPv4/subnetting | M02 | **T** | Medir configuración y conflicto real de prefijos |
| 1.7 | Direcciones IPv4 privadas | M02 | **T** | Incluir límites RFC1918 |
| 1.8 | Configurar y verificar IPv6 | M03 | **T** | Evidencias ND, DAD y rutas de retorno |
| 1.9 | Tipos IPv6 (link-local/ULA/global/anycast/multicast/EUI-64) | M03 | **P** | Anycast y EUI-64 no son títulos explícitos |
| 1.10 | Verificar parámetros IP de cliente Windows/Mac/Linux | M02, M03, M07 | **P** | Faltan procedimientos comparados para tres sistemas operativos |
| 1.11 | Principios RF y Wi-Fi | M11 | **T** | Confirmar discriminación entre RF, IP y autenticación |
| 1.12 | Virtualización de servidores, contenedores y VRF | M15, M25 | **P** | Hipervisor, switching virtual y contenedores carecen de práctica transversal explícita |
| 1.13 | MAC learning, switching y flooding | M08 | **T** | Exigir lectura de tablas y pérdida de aprendizaje |
| 2.1 | VLANs access/default/data/voice e inter-VLAN | M09 | **P** | VLAN de voz y asignación a teléfono no explícita |
| 2.2 | Trunk 802.1Q y native VLAN | M09 | **T** | Fallos de mismatch y seguridad de VLAN nativa |
| 2.3 | CDP y LLDP | M08 | **T** | Mapa de vecinos y validación documental |
| 2.4 | EtherChannel L2/L3 con LACP | M10 | **P** | Distinción L2 vs L3 port-channel no explícita |
| 2.5 | Rapid PVST+, root/roles/guards | M10 | **P** | Específico Cisco Rapid PVST+ y BPDU filter requieren acotación |
| 2.6 | Arquitecturas Wi-Fi de Cisco y modos AP | M11, M24 | **P** | WLC/AP modos requieren equivalencia genérica y muestra de marca opcional |
| 2.7 | Cableado/puertos AP-WLC-LAG | M11, M24 | **P** | No aparecen explícitos puertos controladora ni LAG |
| 2.8 | Acceso de administración SSH, consola, AAA, cloud | M22 | **P** | Comparativa de consola y protocolos inseguros requiere evidencia |
| 2.9 | Interpretación de GUI WLAN | M24 | **P** | Demostración de GUI requiere entorno concreto no verificado |
| 3.1 | Componentes tabla rutas | M12 | **T** | Evidencia next hop, AD, métrica, default |
| 3.2 | Decisión forwarding LPM, AD y métrica | M12 | **T** | Caso con rutas solapadas y selección |
| 3.3 | Rutas estáticas IPv4/IPv6 default/host/floating | M12 | **P** | Floating static no es título explícito |
| 3.4 | OSPFv2 área única | M13 | **T** | Requiere DR/BDR y Router ID en prueba |
| 3.5 | Conceptos de redundancia first-hop | M16 | **T** | Exigir secuencia de failover |
| 4.1 | NAT inside source estático y pools | M17 | **P** | SNAT/DNAT listados, falta ejercicio de pool específico |
| 4.2 | Configurar NTP cliente y servidor | M07, M26 | **P** | Falta configuración cliente/servidor explícita |
| 4.3 | Rol DHCP y DNS | M07 | **T** | Comprobar dependencia y trazas |
| 4.4 | Función SNMP | M26 | **T** | Definir semántica de traps, polling y MIB |
| 4.5 | Syslog facility y severity | M26 | **P** | Facility/severity no explícitos en lecciones propuestas |
| 4.6 | DHCP cliente y relay | M07 | **P** | Relay es requisito expreso, pero falta título/evidencia |
| 4.7 | QoS clasificación, marcado, colas, policing/shaping | M19 | **P** | Separar policing vs shaping en evidencia |
| 4.8 | Administración remota mediante SSH | M22 | **T** | Verificar controles de acceso y claves |
| 4.9 | TFTP/FTP en operaciones | M22, M38 | **H** | No hay contenido explícito sobre legado inseguro y transferencia segura |
| 5.1 | Conceptos de amenaza/vulnerabilidad/exploit/mitigación | M21, M22 | **P** | Vocabulario transversal sin unidad medible |
| 5.2 | Awareness, seguridad física y programa de seguridad | M22 | **O** | Referencia contextual, no competencia troncal de ingeniería |
| 5.3 | Control de acceso local | M22 | **T** | Verificar acceso autorizado y denegado |
| 5.4 | Política de contraseñas, MFA, certificados | M22 | **P** | MFA y certificados explícitos faltantes |
| 5.5 | VPN IPsec remota/site-to-site | M18 | **T** | Falta comparación de modos y diagnóstico de SA |
| 5.6 | ACLs: configurar y verificar | M21 | **T** | Matriz permit/deny y no regresión |
| 5.7 | DHCP snooping, DAI, port security | M23 | **T** | Incluir eventos de falsas denegaciones |
| 5.8 | Comparar AAA | M22, M23 | **T** | Aplicar roles y registros de autenticación |
| 5.9 | WPA/WPA2/WPA3 | M24 | **T** | Incluir compatibilidad y PMF |
| 5.10 | Verificación GUI WLAN WPA2-PSK | M24 | **P** | GUI concreta y licencia/herramienta pendiente |
| 6.1 | Efectos de automatización en operaciones | M36, M37 | **T** | Distinguir reducción de errores y riesgo de escala |
| 6.2 | Red convencional vs controlador | M20, M37 | **P** | No está explicitada comparación de arquitectura |
| 6.3 | SDN, overlay/underlay, APIS norte/sur | M18, M25, M37 | **P** | Punto de control y APIs norte/sur no están representados como lección |
| 6.4 | IA/ML en operaciones de red | M39 | **H** | Falta ejercicio de verificación crítica de salidas IA |
| 6.5 | REST APIs, CRUD, HTTP, encoding | M37 | **P** | Faltan errores/CRUD de forma explícita |
| 6.6 | Ansible y Terraform capacidades | M37, M38 | **P** | Terraform no aparece explícito y no se ha probado aplicación |
| 6.7 | Componentes JSON | M36 | **T** | Exigir leer y escribir JSON válido |

### ENCOR 350-401 v1.2 (troncal CCNP vigente)
**Recuento de filas auditadas:** 27; T 5, P 14, H 5, O 3. **Estos recuentos miden la calidad de especificación documental, NO % de programa cubierto ni competencias logradas.**
| ID | Tema oficial resumido en español | Módulos T2 | Estado de diseño | Brecha/evidencia pendiente |
|---|---|---|:---:|---|
| 1.1 | Diseño 2/3 tier, fabric, cloud, HA/FHRP/SSO | M16, M20, M25 | **P** | Falta SSO y comparación formal de fabric |
| 1.2 | Catalyst SD-WAN: planos, beneficios y limitaciones | M18 | **P** | Vendor opcional; exigir overlay, underlay y planos genéricos |
| 1.3 | Catalyst SD-Access e interoperabilidad campus | M20, M25 | **H** | LISP/VXLAN y coexistencia campus tradicional no explícitos |
| 1.4 | Interpretar configuración QoS | M19 | **P** | Actualmente lecciones conceptos; añadir lectura de colas/políticas |
| 2.1 | Hipervisor tipo 1/2, VM, virtual switching | M25 | **H** | No figura con evidencia de red virtual explícita |
| 2.2 | Configurar/verificar VRF y túneles GRE/IPsec | M15, M18 | **P** | Necesarios túnel + underlay + cifrado verificados |
| 2.3 | Conceptos LISP/VXLAN | M20, M25 | **H** | No figuran en lecciones: agregar como arquitectura delimitada |
| 3.1 | Troubleshoot trunk/EtherChannel; STP RSTP/MST | M09, M10 | **P** | Añadir comparación static/dynamic trunks y guards |
| 3.2 | Comparar EIGRP/OSPF, OSPF multiárea, eBGP, PBR | M13, M14, M15 | **P** | EIGRP queda nominal, multiárea/sumarización y PBR requieren casos |
| 3.3 | NTP/PTP, NAT/PAT, FHRP, multicast | M07, M16, M17, M19 | **P** | PTP e IGMP/PIM/SSM no especificados |
| 4.1 | Diagnóstico debug, SNMP, syslog, ping, traceroute | M26, M39 | **T** | Evidencia de causa raíz con observabilidad multi-fuente |
| 4.2 | Flexible NetFlow configurar/verificar | M27 | **P** | No basta IPFIX conceptual; plataforma/variante aún no verificada |
| 4.3 | Configurar SPAN/RSPAN/ERSPAN | M05, M27 | **H** | Puntos de captura sí, replicación SPAN remota sin objetivos explícitos |
| 4.4 | Configurar/verificar IP SLA | M39 | **H** | No hay lección IP SLA |
| 4.5 | Catalyst Center: IA y assurance | M39 | **O** | Producto específico: explicar función, sin reclamar implementación |
| 4.6 | Configurar NETCONF/RESTCONF | M37 | **P** | Falta prueba de consulta, cambio, validación y rollback |
| 5.1 | AAA y acceso a equipos | M22 | **T** | Evidencia de roles, denegación y auditoría |
| 5.2 | ACL y CoPP | M21, M22 | **T** | Exigir observación de impacto en control-plane |
| 5.3 | Seguridad REST API | M37 | **P** | Secretos/autenticación incluidos, añadir permisos mínimos y logging |
| 5.4 | Diseño seguridad NGFW, endpoint, TrustSec/MACsec | M21, M22, M23 | **P** | TrustSec/MACsec ausentes y diferenciación de productos incompleta |
| 6.1 | Interpretar Python | M36 | **T** | Script legible, manejo de errores y casos límite |
| 6.2 | Construir JSON válido | M36 | **P** | Título solo JSON/YAML, agregar validación de esquema |
| 6.3 | Principios YANG | M37 | **T** | Relacionar modelos y datos operativos |
| 6.4 | APIs Catalyst Center y SD-WAN Manager | M37 | **O** | APIs Cisco propietarias especialización no obligatoria |
| 6.5 | Interpretar respuestas REST/RESTCONF y códigos | M37 | **P** | No está explicitado ejercicio de códigos HTTP y payload |
| 6.6 | Crear EEM applet Cisco | M37 | **O** | Implementación de proveedor opcional; automatización transferible obligatoria |
| 6.7 | Orquestación agent vs agentless | M37, M38 | **P** | Comparación de agentes, credenciales y rollback pendiente |

### CCNA 200-301 v2.0 (referencia FUTURA, no reemplaza v1.1 aún)
**Recuento de filas auditadas:** 29; T 10, P 14, H 5, O 0. **Estos recuentos miden la calidad de especificación documental, NO % de programa cubierto ni competencias logradas.**
| ID | Tema oficial resumido en español | Módulos T2 | Estado de diseño | Brecha/evidencia pendiente |
|---|---|---|:---:|---|
| 1.1 | Diagnosticar interfaz y cable incl señal/distancia | M01 | **P** | Añadir lectura de ópticas, señal y distancia |
| 1.2 | Virtualización hypervisor, VM, contenedor | M25 | **H** | Infraestructura virtual no detallada |
| 1.3 | Troubleshoot IPv4, asignación y subnetting | M02, M07 | **T** | Ampliar diagnóstico DHCP vs manual |
| 1.4 | Troubleshoot IPv6 y prefijos | M03 | **T** | Prueba RA, ND, DAD y alcance |
| 1.5 | RF bandas, interferencia, seguridad Wi-Fi | M11, M24 | **T** | Exigir diagnóstico RF vs autenticación |
| 1.6 | Troubleshoot conectividad cliente Windows/Mac/Linux | M03, M07, M11 | **P** | Falta evidencia multiplataforma |
| 1.7 | Troubleshoot DHCPv4 cliente/servidor/relay IOS | M07 | **P** | Relay/troubleshooting concreto |
| 2.1 | Configurar interfaces L2/L3, trunk, LACP y SVI | M09, M10 | **P** | SVI y voice/PoE no explícitos |
| 2.2 | Configurar puertos de borde para IoT, AP, voz, virt | M08, M09, M11 | **H** | Faltan casos de equipos distintos (edge profiles) |
| 2.3 | Validar documentación con CDP/LLDP | M08 | **T** | Prueba contra diagrama inconsistente |
| 2.4 | Troubleshoot usando show/logs/ping/traceroute/captura | M05, M12, M39 | **T** | Exigir método jerárquico con evidencias |
| 2.5 | Configurar Rapid PVST+ guards/roles | M10 | **P** | Plataforma propia pendiente |
| 3.1 | Interpretar routing table, siguiente salto | M12 | **T** | Prueba con rutas competidoras |
| 3.2 | Troubleshoot IPv4/v6 rutas estáticas | M12 | **T** | Error de retorno y floating static |
| 3.3 | OSPFv2 IPv4 y OSPFv3 IPv6 una área | M13 | **T** | Incluir ambos AF en práctica y evidencias |
| 3.4 | Interpretar HSRP/VRRP | M16 | **T** | Verificar active/standby y failover |
| 4.1 | Configurar AAA TACACS+/RADIUS | M22 | **P** | Comparar y evidenciar fallos de servidor y fallback |
| 4.2 | SFTP/SCP gestión de software y archivos | M22, M38 | **H** | No figura paso de transferencia segura verificable |
| 4.3 | Configurar NAT/PAT en IOS XE | M17 | **P** | Demostración Cisco pendiente; concepto genérico sí |
| 4.4 | Diagnosticar registros DNS A/AAAA/CNAME/MX/NS/PTR | M07 | **P** | Faltan tipos DNS y fallos por registro |
| 4.5 | IPsec modos y protocolos | M18 | **P** | Prueba SA y rutas/encapsulación |
| 4.6 | ACL IPv4 standard/extended/named/numbered | M21 | **P** | Tipos de ACL no desglosados y vendor específico |
| 4.7 | DHCP snooping, DAI, storm, RA guard y port security | M23 | **P** | Storm control, RA guard requieren ejemplos explícitos |
| 5.1 | Rol IA agentic en operaciones | M39 | **H** | Definir límites/fallos, no promesas de autonomía |
| 5.2 | Seleccionar prompt IA con clasificación de datos | M39 | **H** | Caso de protección de datos y verificación de resultados |
| 5.3 | Gestión dispositivo, cloud, controller, IaC | M20, M25, M37 | **P** | Comparación operacional faltante |
| 5.4 | SNMP | M26 | **T** | SNMPv3, polling/traps y seguridad |
| 5.5 | Ejecutar comandos con Ansible | M37 | **P** | Falta demo verificada |
| 5.6 | Interpretar syslog severity/facility | M26 | **P** | Léxico y prueba de parsing necesaria |

**Límite de auditabilidad:** las 3 matrices anteriores cubren todos los IDs principales x.y de esos 3 PDFs (53/27/29) contrastados manualmente, pero no todos sus hijos x.y.a y x.y.a.i de forma independiente. ENARSI, ENSLD, ENAUTO, ENNA, ENCC, ENSDWI y Wireless aún NO cuentan con matriz exhaustiva x.y/a/b; la selección de esos programas sigue siendo temática. No sumar filas entre exámenes para hablar de un porcentaje curricular.

## 3. Auditoría crítica, impacto y acciones recomendadas
| ID | Prioridad | Evidencia primaria | Incidencia detectada en T2 | Acción para revisión |
|---|---|---|---|---|
| CRIT-01 | **ALTA** | CCNA v1.1 4.9 / CCNA v2.0 4.2 | Transferencia de archivos TFTP/FTP vs SFTP/SCP no está explícita | RED-M22, RED-M38: Añadir objetivos para transferencia segura y comparación con protocolos legados |
| CRIT-02 | **ALTA** | ENCOR 2.3 / ENSLD 2.4, 2.5 | VXLAN/LISP y virtual switching ausentes como unidad demostrable | RED-M20, RED-M25: Incluir concepto + overlay/underlay + caso de trazabilidad, sin sobredimensionar proveedor |
| CRIT-03 | **ALTA** | ENCOR 3.2 / ENARSI 1.10-1.11 | OSPF y BGP complejos sin criterios granulares de diagnósticos/route policy | RED-M13, RED-M14, RED-M15: Fijar casos de vecinos, áreas, rutas filtradas, seguridad y recuperación |
| CRIT-04 | **ALTA** | CCNA v2.0 4.7 / ENARSI 3.4 | IPv6 first-hop security, storm control y MACsec no claramente evaluados | RED-M03, RED-M23: Añadir RA guard/storm, inspección IPv6 por soporte de plataforma; MACsec conceptual |
| CRIT-05 | **ALTA** | ENCOR 4.2-4.4 | Flexible NetFlow, SPAN/RSPAN/ERSPAN e IP SLA mezclados con observabilidad genérica | RED-M05, RED-M27, RED-M39: Exigir puntos de captura y configurar donde hardware/software lo permita; alternativa si no |
| CRIT-06 | **MEDIA** | CCNA 1.1-1.3 / v2.0 2.2 | PoE, interfaces ópticas, clientes IoT/voz/virtualización insuficientes | RED-M01, RED-M08, RED-M09: Introducir casos pequeños y verificables, sin requerir AP físico |
| CRIT-07 | **MEDIA** | ENCOR 3.3.d / ENCOR 1.4 | QoS y multicast están compridos en un único módulo de 10-? horas | RED-M19: Separar profundidad de diagnóstico vs especialidad de operador y ajustar horas |
| CRIT-08 | **ALTA** | CCNA v1.1 6.4 / CCNA v2.0 5.1-5.2 | Evaluación crítica de asistencia IA y clasificación de datos ausente | RED-M39: Añadir revisión con salida IA deliberadamente errónea y documentación de corrección |
| CRIT-09 | **MEDIA** | CCNA v1.1 1.12 / ENCOR 2.1 | VM, hipervisor tipo 1/2, switching virtual y contenedores implícitos | RED-M25: Hacer mini laboratorio redes virtuales/bridge/NAT si T5 valida herramientas |
| CRIT-10 | **MEDIA** | ENCOR 6.2 / CCNA v2.0 5.5 | JSON/Ansible aparecen en títulos, sin evidencia observable de competencia | RED-M36, RED-M37: Probar validez de JSON y ejecución Ansible en entorno controlado |
| CRIT-11 | **MEDIA** | IEEE 802.1Q/802.1X | Drafts en progreso podrían citarse erróneamente como normas publicadas | RED-M09, RED-M23: Referenciar 802.1Q-2022 y 802.1X-2020 publicados; drafts separados |
| CRIT-12 | **ALTA** | T1/T2 alcance | No existe aún correspondencia verificada de subapartados a/b/c/i de todos los blueprints | Matriz global: No afirmar cobertura porcentual, equivalencia ni preparación de examen |

## 4. Auditoría de los 42 módulos, sin crear unidades nuevas aún
**La etiqueta "propuesta de refuerzo" es trabajo curricular pendiente, no contenido implementado.**
### RED-M01 — Modelo de comunicaciones y diagnóstico físico (8 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: OSI frente a TCP/IP / Medios, interfaces y velocidad/dúplex / Encapsulación y Ethernet / Errores y límites del modelo.
- **Propuesta de refuerzo:** cobre/fibra/transceptores, PoE, OSI vs camino observado; observación PHY.
- **Evidencia mínima a diseñar:** Informe de transceiver + counters + causa raíz en caso docente.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M02 — IPv4, CIDR, VLSM y plan de direccionamiento (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Direcciones, máscaras y CIDR / Subredes y VLSM / Sumarización y asignación / Diagnóstico de direcciones.
- **Propuesta de refuerzo:** IPv4 público/privado, /31-/32 cuando corresponda, VLSM, sumarización y solapamientos.
- **Evidencia mínima a diseñar:** Plan de prefijos, pruebas de no solapamiento y revisión cruzada.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M03 — IPv6, ND y autoconfiguración (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Formato IPv6 y tipos / ICMPv6, ND y RA / SLAAC, DAD y DHCPv6 / IPv6 y control de acceso.
- **Propuesta de refuerzo:** ND/RA/SLAAC/DAD, ICMPv6 esencial, ULA/anycast/EUI-64, doble pila/transición; diferenciar fragmentación IPv6.
- **Evidencia mínima a diseñar:** Capturas ICMPv6 y diagnóstico de dos causas alternativas.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M04 — TCP, UDP, MTU/MSS y transporte (10 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: TCP y UDP / Handshake, estados y ventanas / Retransmisiones y resets / MTU/MSS, fragmentación IPv4 y PMTUD.
- **Propuesta de refuerzo:** SYN/ACK/RST, ventanas, retransmisión, MSS/PMTU e ICMP PTB; QUIC como observabilidad adicional opcional.
- **Evidencia mínima a diseñar:** Secuencia TCP/UDP con marca de hecho frente a hipótesis.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M05 — Captura y evidencia de red inicial (10 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Captura frente a filtro visual / Interfaces y puntos de observación / PCAP y metadatos / Primeras consultas DNS/TCP/TLS.
- **Propuesta de refuerzo:** SPAN vs captura local; RSPAN/ERSPAN explicados y práctica futura a verificar; timestamps/captura truncada.
- **Evidencia mínima a diseñar:** PCAP con hash, punto de observación y limitaciones de captura.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M06 — Servicios y protocolos empresariales observables (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: HTTP/HTTPS y TLS / Administración SSH/RDP / SMB y directorio LDAP/Kerberos / Qué revela u oculta el cifrado.
- **Propuesta de refuerzo:** TLS 1.3 visibilidad, DNS/HTTP, HTTP2/3 solo contexto, SSH, SMB, Kerberos, LDAP sin duplicar AD.
- **Evidencia mínima a diseñar:** Mapa dependencia de servicios y qué dato no se observa por cifrado.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M07 — DNS, DHCP, NTP y resolución de fallos (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Resolución recursiva y caches / DHCPv4 y DHCPv6/SLAAC / Sincronía y UTC / Fallos de servicio y dependencia.
- **Propuesta de refuerzo:** A/AAAA/CNAME/MX/NS/PTR, split-DNS, caches y TTL; DHCP client/server/relay, NTP y reloj.
- **Evidencia mínima a diseñar:** Resolver incidente compuesto DNS+DHCP relay+UTC.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M08 — Switching Ethernet, tablas MAC y descubrimiento (8 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Aprendizaje MAC y ARP / Dominios de broadcast / LLDP y CDP / Errores de puertos y documentación.
- **Propuesta de refuerzo:** PoE presupuestos, tipos de puertos de borde IoT/voz/AP, hipervisores, CDP/LLDP.
- **Evidencia mínima a diseñar:** Reconstrucción del diagrama físico/L2 desde evidencia.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M09 — VLAN, 802.1Q, trunks e inter-VLAN (14 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: VLAN y access ports / Etiquetado 802.1Q/nativa / Trunks y propagación / Inter-VLAN y troubleshooting.
- **Propuesta de refuerzo:** Access/trunk/nativa, VLAN voz, SVI L3 e inter-VLAN y mismatch.
- **Evidencia mínima a diseñar:** Matriz VLAN↔puertos y captura/tag verificados.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M10 — STP/RSTP/MSTP y LACP (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: STP/RSTP/MSTP / Root bridge y convergencia / Guardias y protecciones / LACP/port channels.
- **Propuesta de refuerzo:** R(STP)/MSTP/Rapid PVST+ distinguidos; edge/guard, LACP L2 y L3.
- **Evidencia mínima a diseñar:** Diagnóstico loop/root o LACP mismatch, sin causar bucle real.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M11 — Fundamentos Wi-Fi, RF y conectividad (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: 802.11, bandas y canales / Interferencia y capacidad / Roaming / Diagnóstico de cliente inalámbrico.
- **Propuesta de refuerzo:** Bandas, roaming, interferencia, 802.11, capacidad y puntos de medición RF.
- **Evidencia mínima a diseñar:** Explicar evidencia que diferencia RF/auth/DHCP.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M12 — Tablas de rutas y enrutamiento estático (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Conectadas y estáticas / Default route / Longest-prefix match y AD / Diagnóstico de camino ida/vuelta.
- **Propuesta de refuerzo:** LPM, AD, métricas, rutas conectada/default/host/floating, lookup IPv4/IPv6.
- **Evidencia mínima a diseñar:** Ruta elegida y retorno/ausencia de retorno justificados.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M13 — OSPFv2/v3 empresarial (18 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Vecinos y áreas / Estados, LSDB y SPF / OSPFv2/v3 y autenticación aplicable / Sumarización y averías.
- **Propuesta de refuerzo:** OSPFv2/v3 AF, DR/BDR, LSA/LSDB, áreas stub/NSSA/ABR/ASBR, autenticación por modo, sumario y filtros.
- **Evidencia mínima a diseñar:** Corregir adyacencia fallida + áreas/LSDB documentadas.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M14 — BGP y políticas de rutas (22 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Sesiones eBGP/iBGP / Atributos y best-path / Políticas, filtros y comunidades / Diagnóstico y controles operativos.
- **Propuesta de refuerzo:** eBGP/iBGP, reflector, atributos, comunidades, filtros import/export, max-prefix, RPKI/ROV contextual, route leaks.
- **Evidencia mínima a diseñar:** Política antes/después + ruta filtrada y razón; todo en topología privada.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M15 — Routing avanzado, VRF y redistribución (18 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Rutas y filtrado / Redistribución y route maps / VRF-Lite y PBR / uRPF, EIGRP/IS-IS comparados.
- **Propuesta de refuerzo:** Redistribución/route maps, prevención bucles, VRF/PBR/uRPF; EIGRP/IS-IS conscientemente acotados.
- **Evidencia mínima a diseñar:** Corregir redistribución circular o filtrado de rutas.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M16 — Gateway redundante y convergencia (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: FHRP y elección / BFD y monitoreo / Convergencia L2/L3 / Pruebas de fallo y recuperación.
- **Propuesta de refuerzo:** HSRP/VRRP, failover, BFD, SSO/HA conceptual; reconvergencia y tiempo.
- **Evidencia mínima a diseñar:** Plan de conmutación; medir pérdida y retorno del servicio.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M17 — NAT, PAT, proxies y asimetría (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: SNAT/DNAT/PAT / Tablas de estado / Proxies y balanceadores / Rutas asimétricas y atribución.
- **Propuesta de refuerzo:** SNAT/DNAT/PAT, pool, asimetría, tabla y logs de traducción.
- **Evidencia mínima a diseñar:** Reconstruir 5-tupla antes/después sin atribución excesiva.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M18 — WAN, VPN, IPsec, GRE, MPLS y SD-WAN (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: WAN y proveedores / IPsec/TLS y GRE / MPLS como servicio / SD-WAN y políticas.
- **Propuesta de refuerzo:** IKEv2, IPsec ESP y SAs, ruta/túnel, GRE, MPLS servicio, SD-WAN planos; DMVPN opcional.
- **Evidencia mínima a diseñar:** Distinguir fallo de IKE, ruta, MTU y política en escenario simulado.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M19 — QoS, multicast y calidad de experiencia (10 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Latencia/jitter/pérdida / Colas y marking / Multicast conceptos / Baselines de voz/vídeo.
- **Propuesta de refuerzo:** Policing vs shaping, jitter, delay, DSCP, IGMP/PIM/RPF/SSM conceptual, interpretación QoS.
- **Evidencia mínima a diseñar:** Diagnóstico pérdida+jitter y cola con baseline.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M20 — Diseño de campus, zonas y resiliencia (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Modelo jerárquico / Dominios de fallo / Zonas y DMZ / Alta disponibilidad y crecimiento.
- **Propuesta de refuerzo:** Campus 2/3-tier, spine-leaf, fabric, VXLAN/LISP conceptual, dominios de fallo, capex de complejidad.
- **Evidencia mínima a diseñar:** Diagrama con decisiones HA, segmentos y límites de alcance.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M21 — ACL, firewall stateful y segmentación (18 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: ACL y orden / Stateful vs stateless / DMZ y egress / Microsegmentación/Zero Trust.
- **Propuesta de refuerzo:** ACL IPv4/IPv6, object groups según plataforma, firewall stateful, ruta retorno, east-west/egress.
- **Evidencia mínima a diseñar:** Prueba permit/deny dual stack con matriz de cobertura.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M22 — Planos, AAA y hardening de infraestructura (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Planos de red / AAA, SSH y roles / NTP, backup y control de cambios / CoPP y administración fuera de banda.
- **Propuesta de refuerzo:** AAA management, CoPP, planos, SSH, certificados/MFA aplicables, SFTP/SCP, backup/restauración.
- **Evidencia mínima a diseñar:** Administración de mínimo privilegio + recuperación tras cambio autorizado.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M23 — Controles L2, 802.1X y NAC (14 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Port security y DHCP snooping / DAI/IP Source Guard / 802.1X y RADIUS/TACACS+ / Políticas NAC y excepciones.
- **Propuesta de refuerzo:** DHCP snooping, DAI, IP source guard, RA guard, storm control, 802.1X, NAC; MACsec conceptual.
- **Evidencia mínima a diseñar:** Dos pruebas: tráfico legítimo preservado y tráfico indebido rechazado.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M24 — WLAN empresarial y seguridad inalámbrica (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: WPA2/WPA3 y PMF / RADIUS/802.1X / SSID-VLAN y roaming / Visibilidad defensiva y errores RF.
- **Propuesta de refuerzo:** WPA2/WPA3/PMF/802.1X, WLC/AP, roaming, RADIUS y fallo por certificado.
- **Evidencia mínima a diseñar:** Diferenciar error RF, EAP, IP/DNS mediante evidencia separada.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M25 — Cloud networking e interconexión híbrida (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: VNet/VPC, subredes y tablas / SG/NSG/NACL conceptuales / DNS, VPN y peering / Telemetría y costes estimados pendientes.
- **Propuesta de refuerzo:** VPC/VNet, route tables y SG/NSG, subnet privada, hybrid VPN; switching virtual y VXLAN conceptual.
- **Evidencia mínima a diseñar:** Arquitectura híbrida con rutas y políticas de retorno documentadas.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M26 — Syslog, SNMP, NTP y observabilidad de equipos (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Syslog y facility/severity / SNMP y polling/traps / UTC/NTP y delay / Pérdidas, retención y duplicados.
- **Propuesta de refuerzo:** Syslog facility/severity, NTP/PTP, SNMPv3, traps/polling, timestamp de evento vs ingesta.
- **Evidencia mínima a diseñar:** Análisis de sesgo horario, missing logs y formato/parsing.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M27 — IPFIX/NetFlow, IDS/IPS y NDR (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: 5-tupla y plantillas IPFIX / Muestreo y asimetría / IDS/IPS firmas y anomalías / NDR y falsos positivos.
- **Propuesta de refuerzo:** IPFIX/Flexible NetFlow, template, muestreo, límites, IDS/NDR y SPAN/RSPAN/ERSPAN fuente.
- **Evidencia mínima a diseñar:** Correlación flow + PCAP con explicación de no equivalencia.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M28 — Análisis PCAP avanzado y protocolos (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Filtros avanzados / TCP/DNS/HTTP/TLS / SMB/Kerberos visibles / Captura parcial, checksum/offload.
- **Propuesta de refuerzo:** TCP stream, DNS, TLS metadata y pérdida de visibilidad/capture point.
- **Evidencia mínima a diseñar:** Hipótesis A/B justificadas con paquetes y límites.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M29 — Investigación SOC de hipótesis y cronologías (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Hipótesis versus hecho / Cronología UTC / Pivotes DNS/flow/identidad / Alcance y niveles de certeza.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; conservar cronología, atribución prudente.
- **Evidencia mínima a diseñar:** Caso SOC con hechos, hipótesis y evidencias.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M30 — Correlación, normalización y detección (18 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Campos y procedencia / Normalización CIM/CEF/DCR / Correlación con endpoint/identidad / Ruido, FPR/FNR y ATT&CK.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; campos y cardinalidad de ingesta.
- **Evidencia mínima a diseñar:** Validación de campos y alertas con dataset sintético declarado.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M31 — Respuesta a incidentes y recuperación de red (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Triage y escalado / Preservación / Contención y disponibilidad / Restauración y lessons learned.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; decisiones de contención y recuperación.
- **Evidencia mínima a diseñar:** Playbook con aprobación, alcance y prueba de recuperación.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M32 — Autorización, alcance y reglas de actuación (8 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Autorización escrita / Scope, ventanas y activos / Riesgo de disponibilidad y datos / Criterios de parada y reporte.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; autorización escrita y reversibilidad.
- **Evidencia mínima a diseñar:** ROE y criterio de parada para prueba aislada.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M33 — Descubrimiento y enumeración seguros (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Inventario y descubrimiento / Enumeración limitada / Verificación manual / Registro de comandos y resultados.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; descubrimiento dentro del segmento propio.
- **Evidencia mínima a diseñar:** Inventario + trazas defensivas en simulación.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M34 — Evaluación autorizada de controles de red (18 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Casos permitidos/negados / Pruebas L2 y L3 / Wi-Fi y policy / Indicios versus vulnerabilidad confirmada.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; límites de ensayo L2/routing/Wi-Fi.
- **Evidencia mínima a diseñar:** Retest limitado de ACL o segmentación.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M35 — Validación conjunta, remediación y retest (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Plan compartido Blue/Red / Telemetría por actividad / Informe y mitigación / Retest y efectos secundarios.
- **Propuesta de refuerzo:** No se audita exhaustivamente hasta T4; evidencia SOC+Red Team.
- **Evidencia mínima a diseñar:** Informe correlativo con compensación de ruido.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M36 — Python, datos y Git para operaciones de red (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Python básico y parsing / JSON/YAML / Git y pruebas / Manejo de errores.
- **Propuesta de refuerzo:** Python robusto, JSON/YAML válido, Git, tests unitarios, datos sensibles.
- **Evidencia mínima a diseñar:** Parser docente con tests y salidas deterministas.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M37 — APIs, YANG y automatización de dispositivos (18 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: REST y autenticación / YANG/NETCONF/RESTCONF / Ansible y estados deseados / Errores, secretos y logging.
- **Propuesta de refuerzo:** NETCONF/RESTCONF, YANG, CRUD, HTTP codes, Ansible, agente vs sin agente, API security.
- **Evidencia mínima a diseñar:** GET estado, cambio idempotente y pruebas previas/posteriores.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M38 — Cambios controlados, idempotencia y rollback (16 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Pre-checks y diffs / Idempotencia / Canary/despliegue gradual / Rollback y auditoría.
- **Propuesta de refuerzo:** SFTP/SCP en cambios, prechecks, diff, idempotencia, rollback, audit trail e IaC conceptual.
- **Evidencia mínima a diseñar:** Diff + precheck + rollback + postcheck.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M39 — Troubleshooting avanzado, capacidad y assurance (12 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Baselines / SLA, pérdida y jitter / Telemetría comparativa / Diagnóstico transversal.
- **Propuesta de refuerzo:** IP SLA/IPSLA, SLO/baselines, capacidad, fallos multi-capa, revisión crítica de sugerencias IA.
- **Evidencia mínima a diseñar:** Hipótesis causal reproducible, series y falsabilidad.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M40 — Proyecto final: diseño de red empresarial (22 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Requisitos y restricciones / Diseño L2/L3 y acceso / Seguridad/observabilidad / Pruebas y documentación.
- **Propuesta de refuerzo:** Demostrar campus con HA, VRF, BGP e IPv6; no exigir laboratorio fuera de capacidad.
- **Evidencia mínima a diseñar:** Revisión de arquitectura + criterios no funcionales.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M41 — Proyecto final: operación SOC ↔ Red Team (24 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Plan de ensayo / Generación controlada y fuentes / Investigación e informe / Corrección, retest y conclusiones.
- **Propuesta de refuerzo:** Sin cambios técnicos hasta T4/T5; correlación observada frente a inferida.
- **Evidencia mínima a diseñar:** Reproducir actividad propia, detección y reparación.
- **Estado de validación:** solo diseño; no ejecutado.

### RED-M42 — Defensa técnica, diagnóstico de egreso y plan de retención (10 h anteriores; ESTIMACIÓN sin revalidar)
- Lecciones T2: Defensa de arquitectura / Incidente alternativo / Fallos sembrados nuevos / Plan de repaso espaciado.
- **Propuesta de refuerzo:** Cerrar brechas según pruebas y demostrar retención.
- **Evidencia mínima a diseñar:** Defensa oral/técnica, prueba sorpresa y plan de refuerzo.
- **Estado de validación:** solo diseño; no ejecutado.

## 5. Jerarquía de profundidad y decisiones de alcance
- **Configurar + verificar + diagnosticar (núcleo práctico):** dual-stack, VLAN/trunk/STP/LACP, static/OSPFv2/v3, BGP básico+políticas, NAT/PAT, ACL, VPN, AAA, seguridad L2, SPAN/captura, flujos/telemetría, automatización NETCONF/RESTCONF donde entorno sea viable. Si no puede probarse con herramienta accesible, se conserva como objetivo propuesto condicionado a T5.
- **Diseño y diagnóstico avanzado selectivo:** BGP iBGP/reflection y rutas indebidamente anunciadas, redistribución, VRF/PBR, IPsec IKEv2, resiliencia, WAN/SD-WAN, QoS/PIM/IGMP, IPv6 transición, redes virtuales y cloud/híbridas.
- **Comprender sin exigir operar equipamiento propietario específico:** Cisco Catalyst Center, TrustSec, EEM, DMVPN full, ISE avanzado, proveedor MPLS profundo, survey RF físico de alta complejidad. Mantener entrada en matriz para transparencia.
- **Temas fuera de eje principal:** EIGRP/IS-IS avanzada de operador, diseño multicontroladora inalámbrica complejo, simulación de proveedor MPLS, arquitectura fabric Cisco propietaria completa, AI agents propietarios. Pueden permanecer como enriquecimiento opcional sin declararse homologados a CCNP.

### Semántica de estándares vs plataforma
- IEEE 802.1Q-2022 es **norma publicada**; la página IEEE de revisión muestra un **borrador** y no sustituye automáticamente al documento publicado (IE1/IE2).
- IEEE 802.1X-2020 es **norma publicada** para control de acceso por puerto; existen revisiones en proceso (IE3).
- RFC 7348 describe VXLAN como **RFC informativo del Independent Stream**, no un estándar IETF Standards Track (ST11).
- RFC base 4271 para BGP NO basta para práctica de seguridad operativa: revisar RFC 7454 y RFC 8212, y RPKI origin validation en RFC 6811 (no equivale a validar la ruta completa). Para route leak documentar RFC 9234. La adopción exacta depende de plataforma/software.
- IPv6 no debe tratar la fragmentación como IPv4: en IPv6 los routers intermedios no fragmentan; documentar RFC 8200 y Path MTU RFC 8201. ICMPv6 es parte funcional de la red, no bloquearlo indiscriminadamente.

## 6. Pruebas de aceptación técnicas por disciplina (propuestas, no ejecutadas)
| Competencia | Evidencia observable requerida | Módulos | Error crítico a impedir |
|---|---|---|---|
| Direccionamiento dual stack | Plan IPv4/IPv6 + casos ND/RA/DHCP/PMTUD + no solapamiento | M02,M03,M07 | No inferir error DHCP desde fallo DNS aislado |
| Switching campus | VLAN+LACP+STP+SVI, cambiar fallo sembrado y verificar recuperación | M08-M10 | No provocar bucles reales; topología desconectada |
| Routing OSPF | Vecindad multiárea y sumarización/LSDB, elegir corrección según evidencia | M12,M13 | No asumir que ping fallido implica ausencia de ruta |
| BGP policy | Comparar anuncios esperados y efectivos + filtro de prefijos y max-prefix | M14,M15 | Nunca conectar a AS real ni anunciar rutas públicas |
| Infraestructura segura | ACL / AAA / 802.1X / RA guard / NAT / IPsec; no regresión | M17,M18,M21-M24 | No cortar tráfico legítimo fuera de laboratorio |
| Observabilidad | SPAN/flow/syslog/PCAP, normalizar tiempo y reconocer pérdida/muestreo | M05,M26-M28,M39 | Un flow ≠ PCAP, no atribuir identidad sin logs |
| Automatización | API/YANG+Ansible, verificación, cambios graduales y rollback | M36-M38 | No ejecutar cambios de red real; no exponer secretos |
| Diseño empresarial | Comparar 2/3-tier, virtualización, HA, overlay/underlay y coste | M20,M25,M40 | Una arquitectura conceptual no valida comportamiento real |

## 7. Auditoría de diseño: disciplina de prerrequisitos y tiempo
- Se verificaron `42` módulos en catálogo T2; cada referencia de objetivo de matriz apunta a un ID existente.
- La matriz de prerequisitos de T2 es un DAG según su validación previa: **no se modificó el grafo**. Para activar cambios de T3, habrá que reanalizar necesidades de virtualización previo a cloud, IPv6 previo a RA guard, L2/AAA previo a NAC, y observabilidad antes de validar detecciones.
- Horas **592 = suma de estimaciones T2**, NO esfuerzo después de añadir contenidos. Recomendar presupuesto de revisión separado de la implementación y piloto inicial con medición de tiempos.
- Cambios de horas sin piloto serían especulativos; por eso T3 no ofrece una falsa precisión de horas corregidas.

## 8. Registro de fuentes primarias y límites de consulta
**Consulta reportada:** 18-10-2026. URLs completas; confianza alta para texto oficial directamente revisado, limitada a lo que soporta cada fuente. IEEE estándares íntegros y compatibilidades de plataformas concretas no se han inspeccionado. No afirmar licencia ni disponibilidad de laboratorios (T5).
| ID | Entidad y fuente | Fecha/versión | Qué respalda | URL directa | Confianza |
|---|---|---|---|---|---|
| CO1 | Cisco — CCNA 200-301 v1.1 Exam Topics | 2024 | Vigente en 18-10-2026; verbos y subtemas; documentos publicados | https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf | alta: texto oficial |
| CO2 | Cisco — CCNA 200-301 v2.0 Exam Topics | 2026; futuro al consultar | Objetivos futuros, énfasis troubleshooting, IA, RA guard | https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf | alta: texto oficial |
| CO3 | Cisco — ENCOR 350-401 v1.2 | ©2025; vigente 2026 | Objetivos 1.1-6.7, routing, assurance, seguridad y automatización | https://learningcontent.cisco.com/documents/marketing/exam-topics/350-401-ENCORE-v1.2.pdf | alta: texto oficial |
| CO4 | Cisco — ENARSI 300-410 v1.1 (edición 07/2025) | 2025 | Áreas de troubleshooting OSPF/BGP/EIGRP, VPN y seguridad | https://learningcontent.cisco.com/documents/300-410-ENARSI-v1.1.7-2025.pdf | alta: PDF oficial; otro PDF tiene inconsistencia de portada |
| CO5 | Cisco — ENSLD 300-420 v1.1 | 2025 | Diseño HA, IPv6, BGP, campus y WAN | https://learningcontent.cisco.com/documents/marketing/exam-topics/300-420-ENSLD-v1.1-7-2025.pdf | alta: texto oficial |
| ST1 | IETF — RFC 2328 OSPFv2 | 1998 | LSDB, SPF, áreas y vecino; revisar actualizaciones | https://www.rfc-editor.org/info/rfc2328/ | alta: RFC base |
| ST2 | IETF — RFC 5340 OSPFv3 | 2008 | OSPFv3 y sus diferencias | https://www.rfc-editor.org/info/rfc5340/ | alta: RFC base, actualizaciones existentes |
| ST3 | IETF — RFC 4861 Neighbor Discovery IPv6 | 2007 | ND, RA, vecindad y autoconfiguración en IPv6 | https://www.rfc-editor.org/info/rfc4861/ | alta: RFC base, actualizaciones existentes |
| ST4 | IETF — RFC 8200 IPv6 | 2017 | IPv6 y fragmentación solo por el origen | https://www.rfc-editor.org/info/rfc8200/ | alta: RFC base |
| ST5 | IETF — RFC 8201 PMTUD IPv6 | 2017 | ICMPv6 PTB y PMTU | https://www.rfc-editor.org/info/rfc8201/ | alta: estándar |
| ST6 | IETF — RFC 4271 BGP-4 | 2006 | Sesiones y atributos BGP | https://www.rfc-editor.org/info/rfc4271/ | alta: RFC base, hay updates |
| ST7 | IETF — RFC 7454/BCP194 BGP Operations and Security | 2015 | Filtrado, seguridad operativa, max-prefix | https://www.rfc-editor.org/info/rfc7454/ | alta: BCP |
| ST8 | IETF — RFC 8212 eBGP sin políticas | 2017 | Actualización a comportamiento base de políticas de BGP | https://www.rfc-editor.org/info/rfc8212/ | alta: RFC |
| ST9 | IETF — RFC 6811 BGP Origin Validation | 2013 | RPKI ROA / validación origen, no prueba ruta completa | https://www.rfc-editor.org/info/rfc6811/ | alta: RFC |
| ST10 | IETF — RFC 9234 BGP Roles and OTC | 2022 | Prevención de route leaks con roles/OTC | https://www.rfc-editor.org/info/rfc9234/ | alta: RFC |
| ST11 | IETF — RFC 7348 VXLAN informational | 2014 | Overlay L2 sobre L3: estándar informativo no norma IETF de estándares | https://www.rfc-editor.org/info/rfc7348/ | alta: texto RFC, categoría informational |
| ST12 | IETF — RFC 4301 IPsec Architecture | 2005 | Arquitectura IPsec e IP layer | https://www.rfc-editor.org/info/rfc4301/ | alta: RFC |
| ST13 | IETF — RFC 7296 IKEv2 | 2014 | Protocolo IKEv2 y negociación | https://www.rfc-editor.org/info/rfc7296/ | alta: RFC |
| ST14 | IETF — RFC 8899 DPLPMTUD | 2020 | MTU datagramas y black holes | https://www.rfc-editor.org/info/rfc8899/ | alta: RFC |
| IE1 | IEEE 802.1 — 802.1Q-2022 (publicado) | 2022 | VLAN y bridges con estado publicado | https://1.ieee802.org/maintenance/p802-1q-rev/ | alta: página WG; texto íntegro no revisado |
| IE2 | IEEE 802.1 — Revisión de 802.1Q-2022 (draft) | 2025 borrador | Diferenciar norma vigente de borrador | https://1.ieee802.org/maintenance/802-1q-2022-rev/ | alta: página WG; no atribuir estado de estándar publicado a draft |
| IE3 | IEEE 802.1 — 802.1X-2020 (publicado) | 2020 | EAPOL, control port-based y MKA, revisión en progreso | https://1.ieee802.org/security/802-1x/ | alta: página WG |
| IE4 | IEEE 802.11 — Wireless LAN Working Group | estado consulta 2026 | 802.11 como área independiente de ENCOR | https://www.ieee802.org/11/ | media: índice oficial, texto completo no inspeccionado |

## 9. Informe CRITIC — pendientes no resueltos
1. **Falta matriz de subobjetivos leaf** de CCNA v1.1/v2.0 y ENCOR, además de ENARSI/ENSLD y demás concentraciones seleccionadas: T3 ya tiene matriz principal pero no equivalencia de examen. Antes de publicar, desglosar ramas a/b/c y cada verbo con evidencia y módulos, indicando explícitamente objetivos excluidos por especialización.
2. **Falta software real** para afirmar que todos los temas marcados como "configurar" son viables gratis: T5 deberá comprobar disponibilidad, licencias, prestaciones de VLAN/STP/802.1X/NetFlow, RAM, imágenes, seguridad y restore; alternativa por limitación.
3. **No se ha validado el hardware** del propietario/alumnado, ni se ha ejecutado laboratorio, ni se ha inspeccionado repositorio de la academia; integraciones pendientes hasta T6.
4. **Tratamiento de SOC y Red Team:** solo puntos de contacto en esta tanda; investigación profunda prevista T4. No presentar esos módulos como auditados a la misma profundidad que redes.
5. **IEEE 802.1AX:** fuente indexada parcialmente en documentación oficial, falta confirmar la página/edición final íntegra antes de redactar material LACP; no inferir compatibilidad de un equipo Cisco u otro fabricante.
6. **Incertidumbre sobre ENARSI:** PDF alternativo con inconsistencia editorial en el número v1.2; en T3 se usa CO4 (v1.1 portada y descripción). Verificar el estado oficial de examen de nuevo antes de eventual publicación.

## 10. Criterio de cierre de T3 y enlace con T4
- [x] Auditar ingeniería por 42 módulos, sin editar los originales.
- [x] Construir matrices de objetivos principales de CCNA v1.1, ENCOR v1.2 y CCNA futura v2.0 con trazabilidad hacia módulos.
- [x] Documentar ejemplos medibles de pruebas de diagnóstico/operación y cambios curriculares.
- [x] Registrar fuentes primarias y brechas no resueltas.
- [ ] NO afirmar equivalencia CCNA/CCNP ni cobertura total leaf; pendiente trabajo de matriz granular.
- [ ] NO afirmar licencias/labs/horas validadas.
- [ ] Profundizar en análisis SOC/Red Team (T4).

**Dictamen:** Tanda 3 cerrada como auditoría técnica de diseño con brechas señaladas; NO cerrada como acreditación técnica ni laboratorio validado. Tanda 4 deberá revisar SOC/Red Team y conectar a esas brechas de red antes de T5.
