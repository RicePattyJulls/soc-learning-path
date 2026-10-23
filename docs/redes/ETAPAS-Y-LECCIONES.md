# Redes: catálogo propuesto

Generado por `node scripts/prepare-redes-plan.mjs`. Arquitectura; no lecciones listas para estudiar.

| Etapa | Título | Módulos | Títulos de lección | Horas estimadas |
| --- | --- | ---: | ---: | ---: |
| RED-E01 | Fundamentos, direccionamiento y lectura de tráfico | 6 | 24 | 64 |
| RED-E02 | Servicios, campus básico y redes inalámbricas | 5 | 20 | 58 |
| RED-E03 | Routing empresarial, WAN y rendimiento | 8 | 32 | 120 |
| RED-E04 | Arquitectura y seguridad de la red | 6 | 24 | 88 |
| RED-E05 | Observabilidad e investigación SOC | 6 | 24 | 90 |
| RED-E06 | Red Team de redes autorizado | 4 | 16 | 54 |
| RED-E07 | Automatización, cambio y operaciones | 4 | 16 | 62 |
| RED-E08 | Proyectos finales y defensa técnica | 3 | 12 | 56 |

Las 275 horas de laboratorio diseñadas están incluidas en las 592 horas totales estimadas; no se suman dos veces.

## Recorridos calculados

| Recorrido | Módulos incluidos por dependencias | Horas estimadas |
| --- | ---: | ---: |
| Diseño e ingeniería de red | 18 | 224 |
| Investigación y respuesta SOC | 22 | 282 |
| Validación Red Team y retest | 29 | 374 |
| Automatización y operación | 25 | 324 |
| Recorrido integral y defensa final | 42 | 592 |

El recorrido de automatización incorpora M36–M38, ausentes del recorrido así denominado en T2. El origen se conserva intacto y el cambio figura en la validación. Las estimaciones no han sido medidas en estudiantes ni en laboratorios.

## Inventario de nodos

### RED-E01: Fundamentos, direccionamiento y lectura de tráfico

**RED-M01: Modelo de comunicaciones y diagnóstico físico**

- RED-M01-L01: OSI frente a TCP/IP
- RED-M01-L02: Medios, interfaces y velocidad/dúplex
- RED-M01-L03: Encapsulación y Ethernet
- RED-M01-L04: Errores y límites del modelo

Requisitos de módulo: ninguno. Laboratorios diseñados: RED-L01.

**RED-M02: IPv4, CIDR, VLSM y plan de direccionamiento**

- RED-M02-L01: Direcciones, máscaras y CIDR
- RED-M02-L02: Subredes y VLSM
- RED-M02-L03: Sumarización y asignación
- RED-M02-L04: Diagnóstico de direcciones

Requisitos de módulo: RED-M01. Laboratorios diseñados: RED-L01.

**RED-M03: IPv6, ND y autoconfiguración**

- RED-M03-L01: Formato IPv6 y tipos
- RED-M03-L02: ICMPv6, ND y RA
- RED-M03-L03: SLAAC, DAD y DHCPv6
- RED-M03-L04: IPv6 y control de acceso

Requisitos de módulo: RED-M01, RED-M02. Laboratorios diseñados: RED-L02.

**RED-M04: TCP, UDP, MTU/MSS y transporte**

- RED-M04-L01: TCP y UDP
- RED-M04-L02: Handshake, estados y ventanas
- RED-M04-L03: Retransmisiones y resets
- RED-M04-L04: MTU/MSS, fragmentación IPv4 y PMTUD

Requisitos de módulo: RED-M01, RED-M02. Laboratorios diseñados: RED-L02, RED-L03.

**RED-M05: Captura y evidencia de red inicial**

- RED-M05-L01: Captura frente a filtro visual
- RED-M05-L02: Interfaces y puntos de observación
- RED-M05-L03: PCAP y metadatos
- RED-M05-L04: Primeras consultas DNS/TCP/TLS

Requisitos de módulo: RED-M01, RED-M02, RED-M04. Laboratorios diseñados: RED-L03.

**RED-M06: Servicios y protocolos empresariales observables**

- RED-M06-L01: HTTP/HTTPS y TLS
- RED-M06-L02: Administración SSH/RDP
- RED-M06-L03: SMB y directorio LDAP/Kerberos
- RED-M06-L04: Qué revela u oculta el cifrado

Requisitos de módulo: RED-M04, RED-M05. Laboratorios diseñados: RED-L03.

### RED-E02: Servicios, campus básico y redes inalámbricas

**RED-M07: DNS, DHCP, NTP y resolución de fallos**

- RED-M07-L01: Resolución recursiva y caches
- RED-M07-L02: DHCPv4 y DHCPv6/SLAAC
- RED-M07-L03: Sincronía y UTC
- RED-M07-L04: Fallos de servicio y dependencia

Requisitos de módulo: RED-M02, RED-M03, RED-M05. Laboratorios diseñados: RED-L03, RED-L05.

**RED-M08: Switching Ethernet, tablas MAC y descubrimiento**

- RED-M08-L01: Aprendizaje MAC y ARP
- RED-M08-L02: Dominios de broadcast
- RED-M08-L03: LLDP y CDP
- RED-M08-L04: Errores de puertos y documentación

Requisitos de módulo: RED-M01, RED-M02. Laboratorios diseñados: RED-L04.

**RED-M09: VLAN, 802.1Q, trunks e inter-VLAN**

- RED-M09-L01: VLAN y access ports
- RED-M09-L02: Etiquetado 802.1Q/nativa
- RED-M09-L03: Trunks y propagación
- RED-M09-L04: Inter-VLAN y troubleshooting

Requisitos de módulo: RED-M02, RED-M08. Laboratorios diseñados: RED-L04.

**RED-M10: STP/RSTP/MSTP y LACP**

- RED-M10-L01: STP/RSTP/MSTP
- RED-M10-L02: Root bridge y convergencia
- RED-M10-L03: Guardias y protecciones
- RED-M10-L04: LACP/port channels

Requisitos de módulo: RED-M08, RED-M09. Laboratorios diseñados: RED-L04.

**RED-M11: Fundamentos Wi-Fi, RF y conectividad**

- RED-M11-L01: 802.11, bandas y canales
- RED-M11-L02: Interferencia y capacidad
- RED-M11-L03: Roaming
- RED-M11-L04: Diagnóstico de cliente inalámbrico

Requisitos de módulo: RED-M02, RED-M03, RED-M07. Laboratorios diseñados: RED-L11.

### RED-E03: Routing empresarial, WAN y rendimiento

**RED-M12: Tablas de rutas y enrutamiento estático**

- RED-M12-L01: Conectadas y estáticas
- RED-M12-L02: Default route
- RED-M12-L03: Longest-prefix match y AD
- RED-M12-L04: Diagnóstico de camino ida/vuelta

Requisitos de módulo: RED-M02, RED-M03, RED-M09. Laboratorios diseñados: RED-L06.

**RED-M13: OSPFv2/v3 empresarial**

- RED-M13-L01: Vecinos y áreas
- RED-M13-L02: Estados, LSDB y SPF
- RED-M13-L03: OSPFv2/v3 y autenticación aplicable
- RED-M13-L04: Sumarización y averías

Requisitos de módulo: RED-M12. Laboratorios diseñados: RED-L06.

**RED-M14: BGP y políticas de rutas**

- RED-M14-L01: Sesiones eBGP/iBGP
- RED-M14-L02: Atributos y best-path
- RED-M14-L03: Políticas, filtros y comunidades
- RED-M14-L04: Diagnóstico y controles operativos

Requisitos de módulo: RED-M12, RED-M13. Laboratorios diseñados: RED-L07.

**RED-M15: Routing avanzado, VRF y redistribución**

- RED-M15-L01: Rutas y filtrado
- RED-M15-L02: Redistribución y route maps
- RED-M15-L03: VRF-Lite y PBR
- RED-M15-L04: uRPF, EIGRP/IS-IS comparados

Requisitos de módulo: RED-M12, RED-M13, RED-M14. Laboratorios diseñados: RED-L07, RED-L19.

**RED-M16: Gateway redundante y convergencia**

- RED-M16-L01: FHRP y elección
- RED-M16-L02: BFD y monitoreo
- RED-M16-L03: Convergencia L2/L3
- RED-M16-L04: Pruebas de fallo y recuperación

Requisitos de módulo: RED-M09, RED-M10, RED-M12. Laboratorios diseñados: RED-L08.

**RED-M17: NAT, PAT, proxies y asimetría**

- RED-M17-L01: SNAT/DNAT/PAT
- RED-M17-L02: Tablas de estado
- RED-M17-L03: Proxies y balanceadores
- RED-M17-L04: Rutas asimétricas y atribución

Requisitos de módulo: RED-M04, RED-M07, RED-M12. Laboratorios diseñados: RED-L09.

**RED-M18: WAN, VPN, IPsec, GRE, MPLS y SD-WAN**

- RED-M18-L01: WAN y proveedores
- RED-M18-L02: IPsec/TLS y GRE
- RED-M18-L03: MPLS como servicio
- RED-M18-L04: SD-WAN y políticas

Requisitos de módulo: RED-M12, RED-M17. Laboratorios diseñados: RED-L09, RED-L12.

**RED-M19: QoS, multicast y calidad de experiencia**

- RED-M19-L01: Latencia/jitter/pérdida
- RED-M19-L02: Colas y marking
- RED-M19-L03: Multicast conceptos
- RED-M19-L04: Baselines de voz/vídeo

Requisitos de módulo: RED-M04, RED-M12, RED-M18. Laboratorios diseñados: RED-L08.

### RED-E04: Arquitectura y seguridad de la red

**RED-M20: Diseño de campus, zonas y resiliencia**

- RED-M20-L01: Modelo jerárquico
- RED-M20-L02: Dominios de fallo
- RED-M20-L03: Zonas y DMZ
- RED-M20-L04: Alta disponibilidad y crecimiento

Requisitos de módulo: RED-M09, RED-M10, RED-M12, RED-M16. Laboratorios diseñados: RED-L10, RED-L12, RED-L19.

**RED-M21: ACL, firewall stateful y segmentación**

- RED-M21-L01: ACL y orden
- RED-M21-L02: Stateful vs stateless
- RED-M21-L03: DMZ y egress
- RED-M21-L04: Microsegmentación/Zero Trust

Requisitos de módulo: RED-M09, RED-M12, RED-M17, RED-M20. Laboratorios diseñados: RED-L10, RED-L12, RED-L19.

**RED-M22: Planos, AAA y hardening de infraestructura**

- RED-M22-L01: Planos de red
- RED-M22-L02: AAA, SSH y roles
- RED-M22-L03: NTP, backup y control de cambios
- RED-M22-L04: CoPP y administración fuera de banda

Requisitos de módulo: RED-M06, RED-M09, RED-M12. Laboratorios diseñados: RED-L05, RED-L10.

**RED-M23: Controles L2, 802.1X y NAC**

- RED-M23-L01: Port security y DHCP snooping
- RED-M23-L02: DAI/IP Source Guard
- RED-M23-L03: 802.1X y RADIUS/TACACS+
- RED-M23-L04: Políticas NAC y excepciones

Requisitos de módulo: RED-M07, RED-M09, RED-M22. Laboratorios diseñados: RED-L10, RED-L11, RED-L19.

**RED-M24: WLAN empresarial y seguridad inalámbrica**

- RED-M24-L01: WPA2/WPA3 y PMF
- RED-M24-L02: RADIUS/802.1X
- RED-M24-L03: SSID-VLAN y roaming
- RED-M24-L04: Visibilidad defensiva y errores RF

Requisitos de módulo: RED-M11, RED-M21, RED-M23. Laboratorios diseñados: RED-L11.

**RED-M25: Cloud networking e interconexión híbrida**

- RED-M25-L01: VNet/VPC, subredes y tablas
- RED-M25-L02: SG/NSG/NACL conceptuales
- RED-M25-L03: DNS, VPN y peering
- RED-M25-L04: Telemetría y costes estimados pendientes

Requisitos de módulo: RED-M18, RED-M20, RED-M21, RED-M22. Laboratorios diseñados: RED-L12, RED-L19.

### RED-E05: Observabilidad e investigación SOC

**RED-M26: Syslog, SNMP, NTP y observabilidad de equipos**

- RED-M26-L01: Syslog y facility/severity
- RED-M26-L02: SNMP y polling/traps
- RED-M26-L03: UTC/NTP y delay
- RED-M26-L04: Pérdidas, retención y duplicados

Requisitos de módulo: RED-M05, RED-M07, RED-M22. Laboratorios diseñados: RED-L13.

**RED-M27: IPFIX/NetFlow, IDS/IPS y NDR**

- RED-M27-L01: 5-tupla y plantillas IPFIX
- RED-M27-L02: Muestreo y asimetría
- RED-M27-L03: IDS/IPS firmas y anomalías
- RED-M27-L04: NDR y falsos positivos

Requisitos de módulo: RED-M17, RED-M21, RED-M26. Laboratorios diseñados: RED-L14.

**RED-M28: Análisis PCAP avanzado y protocolos**

- RED-M28-L01: Filtros avanzados
- RED-M28-L02: TCP/DNS/HTTP/TLS
- RED-M28-L03: SMB/Kerberos visibles
- RED-M28-L04: Captura parcial, checksum/offload

Requisitos de módulo: RED-M05, RED-M06, RED-M07, RED-M17. Laboratorios diseñados: RED-L15.

**RED-M29: Investigación SOC de hipótesis y cronologías**

- RED-M29-L01: Hipótesis versus hecho
- RED-M29-L02: Cronología UTC
- RED-M29-L03: Pivotes DNS/flow/identidad
- RED-M29-L04: Alcance y niveles de certeza

Requisitos de módulo: RED-M26, RED-M27, RED-M28. Laboratorios diseñados: RED-L15.

**RED-M30: Correlación, normalización y detección**

- RED-M30-L01: Campos y procedencia
- RED-M30-L02: Normalización CIM/CEF/DCR
- RED-M30-L03: Correlación con endpoint/identidad
- RED-M30-L04: Ruido, FPR/FNR y ATT&CK

Requisitos de módulo: RED-M26, RED-M27, RED-M29. Laboratorios diseñados: RED-L16, RED-L20.

**RED-M31: Respuesta a incidentes y recuperación de red**

- RED-M31-L01: Triage y escalado
- RED-M31-L02: Preservación
- RED-M31-L03: Contención y disponibilidad
- RED-M31-L04: Restauración y lessons learned

Requisitos de módulo: RED-M22, RED-M29, RED-M30. Laboratorios diseñados: RED-L16, RED-L20.

### RED-E06: Red Team de redes autorizado

**RED-M32: Autorización, alcance y reglas de actuación**

- RED-M32-L01: Autorización escrita
- RED-M32-L02: Scope, ventanas y activos
- RED-M32-L03: Riesgo de disponibilidad y datos
- RED-M32-L04: Criterios de parada y reporte

Requisitos de módulo: RED-M01. Laboratorios diseñados: RED-L17.

**RED-M33: Descubrimiento y enumeración seguros**

- RED-M33-L01: Inventario y descubrimiento
- RED-M33-L02: Enumeración limitada
- RED-M33-L03: Verificación manual
- RED-M33-L04: Registro de comandos y resultados

Requisitos de módulo: RED-M07, RED-M12, RED-M32. Laboratorios diseñados: RED-L17.

**RED-M34: Evaluación autorizada de controles de red**

- RED-M34-L01: Casos permitidos/negados
- RED-M34-L02: Pruebas L2 y L3
- RED-M34-L03: Wi-Fi y policy
- RED-M34-L04: Indicios versus vulnerabilidad confirmada

Requisitos de módulo: RED-M23, RED-M24, RED-M33. Laboratorios diseñados: RED-L17.

**RED-M35: Validación conjunta, remediación y retest**

- RED-M35-L01: Plan compartido Blue/Red
- RED-M35-L02: Telemetría por actividad
- RED-M35-L03: Informe y mitigación
- RED-M35-L04: Retest y efectos secundarios

Requisitos de módulo: RED-M30, RED-M31, RED-M34. Laboratorios diseñados: RED-L20.

### RED-E07: Automatización, cambio y operaciones

**RED-M36: Python, datos y Git para operaciones de red**

- RED-M36-L01: Python básico y parsing
- RED-M36-L02: JSON/YAML
- RED-M36-L03: Git y pruebas
- RED-M36-L04: Manejo de errores

Requisitos de módulo: RED-M05, RED-M07, RED-M12. Laboratorios diseñados: RED-L18.

**RED-M37: APIs, YANG y automatización de dispositivos**

- RED-M37-L01: REST y autenticación
- RED-M37-L02: YANG/NETCONF/RESTCONF
- RED-M37-L03: Ansible y estados deseados
- RED-M37-L04: Errores, secretos y logging

Requisitos de módulo: RED-M22, RED-M26, RED-M36. Laboratorios diseñados: RED-L18.

**RED-M38: Cambios controlados, idempotencia y rollback**

- RED-M38-L01: Pre-checks y diffs
- RED-M38-L02: Idempotencia
- RED-M38-L03: Canary/despliegue gradual
- RED-M38-L04: Rollback y auditoría

Requisitos de módulo: RED-M21, RED-M25, RED-M36, RED-M37. Laboratorios diseñados: RED-L18, RED-L19.

**RED-M39: Troubleshooting avanzado, capacidad y assurance**

- RED-M39-L01: Baselines
- RED-M39-L02: SLA, pérdida y jitter
- RED-M39-L03: Telemetría comparativa
- RED-M39-L04: Diagnóstico transversal

Requisitos de módulo: RED-M16, RED-M19, RED-M26, RED-M27. Laboratorios diseñados: RED-L08, RED-L18, RED-L19.

### RED-E08: Proyectos finales y defensa técnica

**RED-M40: Proyecto final: diseño de red empresarial**

- RED-M40-L01: Requisitos y restricciones
- RED-M40-L02: Diseño L2/L3 y acceso
- RED-M40-L03: Seguridad/observabilidad
- RED-M40-L04: Pruebas y documentación

Requisitos de módulo: RED-M14, RED-M15, RED-M20, RED-M21, RED-M23, RED-M25, RED-M38, RED-M39. Laboratorios diseñados: RED-L19.

**RED-M41: Proyecto final: operación SOC ↔ Red Team**

- RED-M41-L01: Plan de ensayo
- RED-M41-L02: Generación controlada y fuentes
- RED-M41-L03: Investigación e informe
- RED-M41-L04: Corrección, retest y conclusiones

Requisitos de módulo: RED-M31, RED-M35, RED-M40. Laboratorios diseñados: RED-L20.

**RED-M42: Defensa técnica, diagnóstico de egreso y plan de retención**

- RED-M42-L01: Defensa de arquitectura
- RED-M42-L02: Incidente alternativo
- RED-M42-L03: Fallos sembrados nuevos
- RED-M42-L04: Plan de repaso espaciado

Requisitos de módulo: RED-M40, RED-M41. Laboratorios diseñados: RED-L20.

