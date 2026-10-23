# MUNDO DE REDES — TANDA 1/7
## Investigación de referencia, versiones, competencias y matriz curricular preliminar

**Fecha de consulta:** 18 de octubre de 2026. **Estado:** investigación documental y propuesta para revisión; sin implementación, instalaciones ni pruebas de laboratorio. **Base de encargo:** `redes.txt` (209 líneas), secciones 1–13.

> **Clave metodológica:** **D** = hecho documentado en referencia identificada; **R** = recomendación curricular derivada del encargo; **P** = pendiente de verificación o diseño. Las matrices son de **cobertura objetivo propuesta**, no de cobertura implementada ni de preparación certificable.

## 1. Resultado ejecutivo

- **D** Cisco CCNA 200-301 **v1.1** es la versión de examen vigente al 18/10/2026. El cambio a CCNA **v2.0** será el 03/02/2027 (último día de v1.1: 02/02/2027). La v2.0 ya tiene objetivos oficiales públicos. Fuente C01–C03.
- **D** CCNP Enterprise **350-401 ENCOR v1.2** entró en vigor el 19/03/2026. Un sitio de examen de Cisco aún puede describir v1.1, pero el PDF de cambios y el PDF de objetivos v1.2 confirman la revisión. Fuente C04–C05.
- **D** La concentración **300-435 ENAUTO v2.0** sustituye el uso de v1.1 como referencia vigente. Fuente C08.
- **D** Las antiguas concentraciones wireless 300-425 ENWLSD y 300-430 ENWLSI tuvieron su último día el 18/03/2026; el área posee una certificación separada **CCNP Wireless** (350-101, 300-110, 300-120). Fuente C12–C13.
- **R** Mundo Redes debe ser una formación de ingeniería aplicada no dependiente de Cisco: CCNA actual + objetivos seleccionados y justificables de CCNP Enterprise, con **profundidad propia adicional** en PCAP, registros, flujos, investigación SOC, segmentación y pruebas autorizadas.
- **P** No se ha auditado la academia existente, no se ha elaborado una matriz exhaustiva *objetivo por subobjetivo* de todas las concentraciones, ni se han validado laboratorios/licencias. Ninguna equivalencia o preparación para examen está demostrada.

## 2. Programas oficiales examinados

### CCNA 200-301 v1.1, vigente en consulta (C01)

| Dominio oficial | Peso |
|---|---:|
| 1. Network Fundamentals | 20 % |
| 2. Network Access | 20 % |
| 3. IP Connectivity | 25 % |
| 4. IP Services | 10 % |
| 5. Security Fundamentals | 15 % |
| 6. Automation and Programmability | 10 % |

**Notas verificadas:** incluye IPv4/IPv6, VLAN/802.1Q/LACP, Rapid PVST+, OSPFv2 de área única, NAT/NTP/DHCP/DNS, ACL y seguridad L2, wireless, JSON y principios de automatización. El objetivo **6.4** menciona IA predictiva/generativa en operaciones. Los verbos del blueprint no son intercambiables: *describe, interpret, configure and verify* exigen pruebas distintas.

### CCNA 200-301 v2.0, futura en consulta (C02–C03)

| Dominio publicado | Peso |
|---|---:|
| 1. Network Infrastructure and Connectivity | 25 % |
| 2. Switching and Network Access | 25 % |
| 3. IP Routing | 20 % |
| 4. Network Services and Security | 20 % |
| 5. AI, and Network Operations and Management | 10 % |

**Cambio pedagógico importante (R, basado en C03):** más tareas explícitas de **diagnóstico** con evidencia de comandos/capturas, DNS, conectividad de clientes y OSPFv3 IPv6. Se suman requisitos de valorar resultados de asistentes de IA: enseñar a *verificar*, no delegar la toma de decisiones técnicas en respuestas generadas. La v2 no sustituye a v1.1 como examen vigente hasta febrero 2027.

### CCNP Enterprise, núcleo y concentraciones de referencia

| Programa oficial | Versión identificada | Relevancia para Redes | Decisión propuesta |
|---|---|---|---|
| **350-401 ENCOR** | **v1.2** | Arquitectura, virtualización/VRF/GRE/IPsec, L2/L3, OSPF, eBGP, assurance, controles, automatización | **Troncal avanzado** |
| **300-410 ENARSI** | **v1.1** | Diagnóstico OSPF/BGP/EIGRP, filtrado, redistribución, VPN, CoPP, AAA, NetFlow | **Troncal avanzado selectivo** |
| **300-420 ENSLD** | **v1.1** | Diseño escalable IPv4/IPv6, campus, resiliencia, WAN, QoS, cloud | **Diseño avanzado selectivo** |
| **300-445 ENNA** | **v1.0** | Assurance, medición, baselines, rendimiento, alertas, diagnóstico con datos | **Troncal SOC/operaciones selectivo** |
| **300-435 ENAUTO** | **v2.0** | YANG/NETCONF/RESTCONF, Ansible/Python, automatización, validación, riesgos de IA | **Troncal moderna selectiva** |
| **300-440 ENCC** | **v1.0 (PDF revisado 2025)** | VPN híbridas, multicloud, enrutamiento y políticas de conectividad | **Extensión cloud/híbrida** |
| **300-415 ENSDWI** | **v1.2** | SD-WAN overlay/policies/segmentación/operación, componentes Catalyst | **Conceptos núcleo, configuración de fabricante opcional** |
| **CCNP Wireless (separado)** | Familia vigente 2026 | RF, 802.11, WLAN empresarial, movilidad, seguridad y diagnóstico | **Referencia complementaria Wi-Fi** |

**ENCOR v1.2 dominios/pesos:** Arquitectura 15 %, Virtualización 10 %, Infraestructura 30 %, Network Assurance 10 %, Seguridad 20 %, Automatización e IA 15 % (C05). Se retiraron objetivos de wireless, entre otros, del núcleo ENCOR (C04); **no** es razón suficiente para omitir Wi-Fi de la academia.

**Corrección de versión importante:** ENAUTO v2.0 (C08) ya incluye automatización Day 0, controles, telemetría basada en modelos, webhooks y riesgos de IA. No usar como base exclusiva el antiguo ENAUTO v1.1.

## 3. Matriz temática de cobertura objetivo, de alcance curricular

**Leyenda de profundidad:** **F** fundamentos; **C** configuración verificable; **T** troubleshooting por hipótesis y causa raíz; **D** diseño; **I** investigación de evidencias SOC; **V** validación autorizada/controlada de controles de seguridad. Una combinación indica metas, no dominio acreditado.

**Clave de referencias oficiales:** `A x.y` = CCNA v1.1; `A2 x.y` = CCNA v2.0 futura; `E x.y` = ENCOR v1.2; `R x.y` = ENARSI v1.1; `D x.y` = ENSLD v1.1; `N x.y` = ENNA v1.0; `U x.y` = ENAUTO v2.0; `K x.y` = ENCC v1.0. `—` significa que el concepto excede los temas explícitos de esos blueprints o no se comprobó un objetivo específico; **no significa que el contenido sea innecesario**.

| # | Tema | Cisco confirmado | Profundidad objetivo (R) | Evidencia evaluable prevista (R) |
|---:|---|---|---|---|
| 01 | OSI/TCP-IP, encapsulación, medios, Ethernet, errores físicos | A 1.1–1.5; A2 1.1 | F,T | Diagnóstico de problema de interfaz y explicación de capas |
| 02 | IPv4, CIDR/VLSM, sumarización y plan de subredes | A 1.6–1.7; A2 1.3; D 1.1 | F,C,T,D | Plano de direccionamiento sin solapamiento y ruta de resolución |
| 03 | IPv6, prefijos, ND, ICMPv6, SLAAC/DAD | A 1.8–1.10; A2 1.4; D 1.1, 1.6 | F,C,T,D | Diagnóstico de vecindad y direccionamiento IPv6 |
| 04 | TCP/UDP: estados, retransmisión, ventanas, MTU/MSS | A 1.5 (comparación); adicional IETF | F,T,I | Explicar handshake/retransmisiones/PMTUD en PCAP |
| 05 | Servicios DNS/DHCP/NTP y troubleshooting | A 4.2–4.3, 4.6; A2 1.7,4.4; R 4.4 | F,C,T,I | Detectar causa de fallo DNS, DHCP o tiempo incoherente |
| 06 | Protocolos enterprise (TLS/HTTP, SSH, SMB, RDP, LDAP/Kerberos) | A 4.8,5.5 y parcial de servicios; adicional IETF/Microsoft | F,T,I | Interpretación prudente de trazas y dependencias AD |
| 07 | Switching, tablas MAC, VLAN, inter-VLAN, 802.1Q | A 1.13, 2.1–2.2; E 3.1; A2 2.1–2.2 | F,C,T,D,V | Dos VLAN, inter-VLAN, fallo de trunk y comprobación de segmentación |
| 08 | CDP/LLDP, descubrimiento L2, documentación | A 2.3; A2 2.3 | F,C,T | Reconstruir diagrama real a partir de evidencias |
| 09 | STP/RSTP/MSTP, protecciones, lazos | A 2.5; E 3.1.c; D 2.2 | F,C,T,D | Diagnóstico de root equivocado/bloqueo/convergencia |
| 10 | LACP/EtherChannel y redundancia de enlaces | A 2.4; E 3.1.b; A2 2.1.c | F,C,T,D | Corregir mismatch y medir continuidad |
| 11 | L2 security, DHCP snooping, DAI, port security | A 5.7; A2 4.7; R 3.4 IPv6; D 2.2.e | F,C,T,V | Bloquear escenario controlado sin cortar tráfico legítimo |
| 12 | 802.1X/NAC/RADIUS/TACACS+, AAA | A 2.8, 5.8; A2 4.1; E 5.1; R 3.1 | F,C,T,D,V | Política y trazabilidad de rechazo/concesión de acceso |
| 13 | Tablas de rutas, longest prefix, estáticas/default | A 3.1–3.3; A2 3.1–3.2 | F,C,T | Diagnóstico de ruta escogida y ausencia de retorno |
| 14 | OSPFv2/v3, múltiples áreas y diagnóstico | A 3.4; A2 3.3; E 3.2.b; R 1.10; D 1.4 | F,C,T,D | Resolver adyacencias, sumarización y fallo de alcance |
| 15 | BGP eBGP/iBGP, políticas, filtros, best-path | E 3.2.c; R 1.11; D 1.5 | F,C,T,D,V | Corregir política y justificar preferencia de rutas |
| 16 | EIGRP / IS-IS, reconocimiento y transferencia de conceptos | E 3.2.a; R 1.9; D 1.2–1.3 | F,T (+C opcional) | Diagnóstico comparado de métrica/convergencia |
| 17 | Redistribución, filtrado, PBR, VRF-Lite, uRPF | E 2.2.a,3.2.d; R 1.2–1.7,3.2 | F,C,T,D,V | Evitar bucle y probar filtrado de rutas |
| 18 | FHRP, BFD, resiliencia y convergencia | A 3.5; A2 3.4; E 1.1.b,3.3.c; D 2.1 | F,C,T,D | Simular fallo de enlace/gateway con criterio de recuperación |
| 19 | NAT/PAT, asimetría, IP/identidad y atribución | A 4.1; A2 4.3; E 3.3.b | F,C,T,I | Correlacionar traducción, tiempo y flow sin atribución indebida |
| 20 | QoS, multicast y servicios WAN | A 4.7; E 1.4,3.3.d; D 4.1–4.5 | F,T,D (+C selectiva) | Explicar pérdida/jitter y priorización medida |
| 21 | WAN, IPsec/GRE, VPN remota/site-to-site, MPLS | A 5.5; E 2.2.b; R 2.1–2.3; D 3; K 1–5 | F,C,T,D | Conectividad segura y diagnóstico de ruta/túnel |
| 22 | SD-WAN y SDN: overlay/underlay, segmentación | A 6.2–6.3; E 1.2–1.3; D 2.4–2.5,3.4–3.5 | F,T,D (+C opcional) | Diagrama de planos y fallas de política |
| 23 | Wi-Fi 802.11, RF, roaming, WPA2/WPA3, WPA-Enterprise | A 1.11,2.6–2.9,5.9–5.10; A2 1.5–1.6; CCNP Wireless | F,C,T,D,V | Diagnóstico de RF vs autenticación vs IP |
| 24 | ACL, firewalls de estado, DMZ y segmentación | A 5.6; A2 4.6; E 5.2; D 4.3; N 3.4 | F,C,T,D,V,I | Matriz de flujos permitidos/denegados y pruebas mínimas |
| 25 | Gestión: SSH, AAA, hardening, CoPP, cambios | A 2.8,4.8; E 5.1–5.2; R 3.1,3.3,4.1 | F,C,T,D,V | Recuperación de configuración y restricción de management plane |
| 26 | SNMP, Syslog, sincronía y calidad de registros | A 4.2,4.4–4.5; A2 5.4,5.6; E 4.1; R 4.2–4.3 | F,C,T,I | Diagnosticar pérdida, UTC/desfase y duplicidad de logs |
| 27 | SPAN, PCAP, Wireshark/tcpdump, TCP/DNS/TLS | E 4.3; A2 2.4; adicional Wireshark | F,C,T,I | PCAP preservado + filtros + hechos observables y límites |
| 28 | Flow (NetFlow v9 / IPFIX), muestreo, NDR/IDS | E 4.2; R 4.6; N 4.1 | F,C,T,I | Distinguir una conexión observada de una inferencia de exfiltración |
| 29 | SOC: anomalías, hipótesis, línea temporal, endpoints/identidad | N 3–4; adicional NIST/ENISA/Microsoft/Splunk | F,T,I | Investigación con fuente, reloj, hipótesis alternativa y escalado |
| 30 | Red Team autorizado: inventario, escaneo lab, probar ACL | —; complementaria ENISA/NIST/ATT&CK | F,V,I | Alcance escrito, evidencia mínima, informe, corrección y retest |
| 31 | Ingeniería y automatización Python/Git/Ansible/API/YANG | A 6.5–6.7; A2 5.3,5.5; E 4.6,6; U 1–4 | F,C,T,D | Cambio idempotente, validación previa, diffs y rollback |
| 32 | Cloud networking e híbridas: VNet/VPC, rutas, VPN | E 1,2; D 3,5; K 1–5 | F,C,T,D,I | Diseñar conectividad, seguridad y telemetría con costes identificados |
| 33 | Disponibilidad, baselines, pérdida/jitter, assurance | E 4; R 4.5; N 1–4 | F,T,D,I | Informe de fallo con baseline, causa y verificación posterior |
| 34 | Evaluación competencial y retención | adicional NICE/ENISA | transv. | Demostración reproducible, rúbrica, diagnóstico y reevaluación |

**Advertencia:** la columna Cisco usa objetivos concretos seleccionados; **NO es una correspondencia exhaustiva de todos los subobjetivos oficiales**. Por tanto, no proporciona porcentajes válidos de cobertura por examen. La auditoría de cada subobjetivo vendrá después de fijar la arquitectura modular y las especializaciones. El uso de “configurar” para técnicas sin entorno gratuito demostrado queda sujeto a los laboratorios de la Tanda 5.

## 4. Referencias tecnológicas no Cisco (D)

| Familia | Fuente oficial | Aporta al currículo | Estado |
|---|---|---|---|
| TCP | IETF RFC 9293 (2022) | Estados, fiabilidad, retransmisión y puertos | Texto verificado |
| IPv6 | IETF RFC 8200 (2017; actualizado posteriormente) | Encabezados, fragmentación y límites | Texto verificado; revisar documentos que lo actualizan |
| BGP | IETF RFC 4271 (2006) | Máquina de estados, anuncios y selección | Texto verificado; revisar RFC posteriores |
| TLS 1.3 | IETF RFC 8446 (2018) | Lo que se observa y lo que no se ve en cifrado | Texto verificado |
| Syslog | IETF RFC 5424 (2009) | Formato/semántica y transporte | Texto verificado |
| IPFIX | IETF RFC 7011 (2013) | Información de flujos y sesgos de exportación | Texto verificado |
| NETCONF | IETF RFC 6241 (2011) | Automatización inter-operable | Texto verificado |
| Wi-Fi 802.11 | IEEE 802.11-2024 y 802.11be-2024; 802.11bf/bk-2025 | Arquitectura, RF y Wi-Fi contemporáneo | Página oficial de WG verificada; no se analizó normativo completo |
| VLAN, 802.1X, LACP | IEEE 802.1Q, 802.1X, 802.1AX | Separar estándares de comandos de marca | Enlace de trabajo IEEE encontrado; versiones/texto completos P |
| Seguridad, gestión y respuesta | NIST SP 800-207 (2020), SP 800-61 Rev. 3 (2025) | Zero Trust y respuesta a incidentes | Versiones y propósito verificados |
| Competencias laborales | ENISA ECSF Roles (2022), NIST NICE componentes 2.2.0 (2026) | SOC/incident responder y penetration tester, tareas medibles | Evidencia oficial verificada |
| Detección | MITRE ATT&CK T1046 | Taxonomía de descubrimiento de servicios | Evidencia oficial verificada; técnica ≠ incidente probado |
| Microsoft | Microsoft Learn, Syslog/CEF via AMA | Tablas Syslog y CommonSecurityLog, DCR/AMA y problemas de tiempo | Documento oficial consultado |
| Splunk | Splunk CIM 6.4 y docs de Network Traffic | Normalización y semántica de campos de tráfico | Documento oficial consultado |
| PCAP | Manual Wireshark | Diferencia captura/display y análisis de paquetes | Documento oficial consultado |
| Otro fabricante | Juniper JNCIA-Junos | IP/routing y políticas como contraste de vendor | Página oficial de objetivos; uso transversal, no equivalencia |

**Nota técnica de SOC:** Microsoft reconoce diferencias potenciales entre `TimeGenerated` y `EventTime` al reenviar syslog; este punto debe convertirse en una competencia investigativa, no en una nota superficial. Splunk CIM exige verificar campos/valores normalizados; que un evento esté indexado no significa que sea apto para correlación.

## 5. Competencias del mercado a partir de marcos oficiales

**D:** ENISA ECSF incluye el perfil **Cyber Incident Responder** (también SOC Analyst) y **Penetration Tester**. NICE define trabajos a través de tareas, conocimientos y habilidades; los componentes de NICE publicados en abril de 2026 son v2.2.0 (fuentes P01–P03).

**R — Pruebas de aprendizaje orientadas al trabajo:**

1. **Ingeniería/redes:** producir topología, configurar dispositivos, diagnosticar de extremo a extremo y conservar evidencia de recuperación.
2. **SOC:** conectar lo observado (PCAP/flow/firewall/DNS/endpoint) con una hipótesis, alternativa, línea temporal, alcance y escalado; declarar limitaciones de NAT, tiempos, cifrado y fuentes faltantes.
3. **Red Team:** demostrar segmentación o exposición únicamente con autorización en laboratorio, criterio de parada, alcance, mínima actividad necesaria, informe, remediación y retest.
4. **Automatización:** comprobar validez de cambios, control de versiones, idempotencia y rollback, además de verificar resultados derivados de IA.

No hay evidencia proporcionada de qué conocimientos de redes domina ya la persona: diseñar un diagnóstico en Tanda 2 sin inferirlos desde el CV.

## 6. Informe CRITIC: brechas y recomendaciones

| Hallazgo | Riesgo | Recomendación/evidencia a recabar | Estado |
|---|---|---|---|
| Referencias viejas CCNP ENCOR/ENAUTO y wireless | Construir currículo desde objetivos obsoletos | Basar la matriz en ENCOR v1.2, ENAUTO v2.0 y CCNP Wireless separado | Corregido en esta tanda |
| Usar únicamente CCNA como temario | BGP, múltiples áreas, diseño y assurance débiles | Anclar selección en ENARSI, ENSLD, ENNA y ENAUTO | Decisión propuesta |
| Copiar CCNP entero | Exceso de productos Cisco y coste alto | Diferenciar troncal transferible de especialidades opcionales | Decisión propuesta |
| Atribuir competencia por una explicación | Falso dominio de configuración/diagnóstico | Rúbricas con evidencias observables y fallos sembrados | Tandas 2 y 5 |
| Infra-representar Wi-Fi porque ENCOR cambió | Lagunas relevantes para redes empresariales | Mantener wireless y consultar 802.11/CCNP Wireless | Decisión propuesta |
| Reducir SOC a “usar Wireshark” | Evidencia parcial y conclusiones erróneas | Construir metodología PCAP+flow+logs+identidad+endpoint | Tanda 4 |
| Reducir Red Team a herramientas de escaneo | Falta de autorización, contención y retest | Límite de laboratorios, prueba mínima, verificación y informe | Tanda 4 |
| Asumir equivalencia de CSV/CEF/flows o campos SIEM | Consultas falsas o correlación defectuosa | Matriz de fuentes, campos reales, clocks y compatibilidad | Tandas 4 y 6 |
| Ausencia de contraste granular de todos los objetivos | No se puede afirmar cobertura CCNA→CCNP | Desglosar IDs de cada subobjetivo y asignar módulo/evidencia después de Tanda 2 | Pendiente expresamente |
| Falta de comprobación de versiones IEEE 802.1 | Riesgo de citar requisitos caducados | Consultar norma y actualizaciones oficiales antes de redactar lecciones | Pendiente |
| Falta de verificación de licencias/equipos | Laboratorios irreproducibles o costosos | En Tanda 5, fecha, licencia, requisitos y alternativa local | Pendiente |
| Posibles cambios desde octubre 2026 a publicación | Obsolescencia posterior | Congelar consulta en cada edición y verificar antes de publicar | Pendiente futuro |

## 7. Propuesta de prioridades de profundidad (R)

- **Obligatorios prácticos en profundidad:** IPv4/IPv6, subnetting, DNS/DHCP, switching/VLAN, STP/LACP, rutas, OSPF, BGP con políticas, NAT, ACL/firewall, 802.1X/conectividad Wi-Fi, administración segura, PCAP, Syslog, flows, diagnóstico, segmentación y cambio controlado.
- **Obligatorios conceptuales con práctica selectiva:** WAN, IPsec/GRE, QoS, multicast, VRF, SD-WAN, cloud híbrida, automatización YANG/RESTCONF, medición de capacidad/latencia.
- **Especialización adicional no obligatoria:** implementación muy específica de Cisco Catalyst Center, ISE/TrustSec, DMVPN concentradores, detalles internos profundos de MPLS proveedor, EIGRP avanzado en todo su alcance, IS-IS de operador, multicast de gran escala, high-end Wi-Fi surveys y controllers, APIs Cisco propietarias y programación de agentes de IA como objetivo aislado. Se mencionan para trazabilidad, no se eliminan del mapa de referencia.

## 8. Registro de fuentes primarias — acceso 18/10/2026

La fecha editorial indicada procede del documento o de la página cuando consta. Todas se consultaron en esta tanda. **Confianza Alta** para afirmaciones expresas de una fuente oficial; **Media** para recomendaciones de alcance; **Pendiente** para detalles no inspeccionados.

| ID | Organización / documento / fecha | URL directa | Afirmación que fundamenta | Confianza |
|---|---|---|---|---|
| C01 | Cisco, **CCNA 200-301 Exam Topics v1.1**, 2024 | https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf | Objetivos y seis dominios v1.1 | Alta |
| C02 | Cisco, aviso **CCNA Refresh**, 2026 | https://blogs.cisco.com/learning/stay-on-track-get-certified-before-the-ccna-refresh | Cambio de examen el 03/02/2027 | Alta |
| C03 | Cisco, **CCNA 200-301 Exam Topics v2.0**, ©2026 | https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf | Objetivos futuros y cinco dominios | Alta |
| C04 | Cisco, **CCNP Enterprise, Minor Update**, entrada 19/03/2026 | https://learningcontent.cisco.com/documents/marketing/exam-topics/CCNP_Enterprise_v1.1_and_1.2_Release_Notes.pdf | ENCOR v1.2 y cambios de portfolio | Alta |
| C05 | Cisco, **ENCOR 350-401 v1.2**, documento ©2025 | https://learningcontent.cisco.com/documents/marketing/exam-topics/350-401-ENCORE-v1.2.pdf | Contenido de núcleo y pesos | Alta |
| C06 | Cisco, **ENARSI 300-410 v1.1**, ©2025 | https://learningcontent.cisco.com/documents/300-410-ENARSI-v1.1.7-2025.pdf | Diagnóstico routing/VPN/seguridad/servicios | Alta |
| C07 | Cisco, **ENSLD 300-420 v1.1**, ©2025 | https://learningcontent.cisco.com/documents/marketing/exam-topics/300-420-ENSLD-v1.1-7-2025.pdf | Diseño campus/WAN/routing/servicios | Alta |
| C08 | Cisco, **ENAUTO 300-435 v2.0**, ©2025 | https://learningcontent.cisco.com/documents/marketing/exam-topics/300-435-ENAUTO-v2.0-7-9-2025.pdf | Automatización moderna, riesgos IA | Alta |
| C09 | Cisco, **ENNA 300-445 v1.0**, ©2023 | https://learningcontent.cisco.com/documents/marketing/exam-topics/300-445-ENNA-v1.0.pdf | Assurance, observabilidad y alertas | Alta |
| C10 | Cisco, **ENCC 300-440 v1.0**, ©2025 | https://learningcontent.cisco.com/documents/marketing/exam-topics/300-440-ENCC-v1.0-7-2025.pdf | VPN y conectividad cloud | Alta |
| C11 | Cisco, **CCNP Enterprise** página vigente | https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccnp-enterprise/index.html | Núcleo + concentraciones ofertadas | Alta |
| C12 | Cisco, **Retired Exams**, consulta 2026 | https://www.cisco.com/site/us/en/learn/training-certifications/exams/retired.html | Retiro antiguas wireless 18/03/2026 | Alta |
| C13 | Cisco, **CCNP Wireless**, consulta 2026 | https://www.cisco.com/site/us/en/learn/training-certifications/certifications/wireless/ccnp-wireless/index.html | Wireless en programa separado | Alta |
| I01 | IETF, **RFC 9293 TCP**, 2022 | https://www.rfc-editor.org/info/rfc9293 | Función y semántica TCP | Alta |
| I02 | IETF, **RFC 8200 IPv6**, 2017 | https://www.rfc-editor.org/info/rfc8200 | IPv6 (revisar actualizaciones) | Alta |
| I03 | IETF, **RFC 4271 BGP-4**, 2006 | https://www.rfc-editor.org/info/rfc4271 | Especificación base de BGP | Alta |
| I04 | IETF, **RFC 8446 TLS 1.3**, 2018 | https://www.rfc-editor.org/info/rfc8446 | Cifrado TLS 1.3 | Alta |
| I05 | IETF, **RFC 5424 Syslog**, 2009 | https://www.rfc-editor.org/info/rfc5424 | Formato y semántica syslog | Alta |
| I06 | IETF, **RFC 7011 IPFIX**, 2013 | https://www.rfc-editor.org/info/rfc7011 | Flujos y exportación | Alta |
| I07 | IETF, **RFC 6241 NETCONF**, 2011 | https://www.rfc-editor.org/info/rfc6241 | Automatización NETCONF | Alta |
| I08 | IEEE 802.11 WG, **Standards and approvals**, consulta 2026 | https://www.ieee802.org/11/ | Publicaciones 802.11 actuales | Alta para fecha; texto normativo pendiente |
| P01 | ENISA, **ECSF Role Profiles**, 2022 | https://www.enisa.europa.eu/publications/european-cybersecurity-skills-framework-role-profiles | Cyber Incident Responder / Penetration Tester | Alta |
| P02 | NIST, **NICE Components 2.2.0**, abril 2026 | https://www.nist.gov/news-events/news/2026/04/nice-releases-nice-framework-components-v220 | Versión actualizada de TKS/work roles | Alta |
| P03 | NIST, **NICE Work Roles**, consulta 2026 | https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/resources/occupations-jobs-and-work | Competencias observables frente a títulos | Alta |
| S01 | NIST, **SP 800-61 Rev.3**, abril 2025 | https://csrc.nist.gov/pubs/sp/800/61/r3/final | Marco de respuesta a incidentes | Alta |
| S02 | NIST, **SP 800-207**, 2020 | https://www.nist.gov/publications/zero-trust-architecture | Zero Trust, recursos/identidades/contexto | Alta |
| S03 | MITRE, **ATT&CK T1046**, consulta 2026 | https://attack.mitre.org/techniques/T1046/ | Descubrimiento de servicios y detección | Alta |
| T01 | Microsoft Learn, **Syslog/CEF via AMA**, consulta 2026 | https://learn.microsoft.com/azure/sentinel/cef-syslog-ama-overview | DCR, Syslog/CommonSecurityLog y sesgos UTC | Alta |
| T02 | Splunk, **CIM 6.4 release notes**, febrero 2026 | https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/release-notes-for-the-splunk-common-information-model-add-on | Versión CIM y Network Traffic/Sessions | Alta |
| T03 | Splunk, **Network Traffic Activity**, actualizado septiembre 2026 | https://help.splunk.com/en/splunk-enterprise-security-8/splunk-app-for-pci-compliance/installation-and-configuration-manual/8.7/configure-reports/network-traffic-activity | Campos/requisitos del modelo de tráfico | Alta |
| T04 | Wireshark, **User's Guide**, web consulta 2026 | https://www.wireshark.org/docs/wsug_html/ | Captura vs display filters y lectura PCAP | Alta |
| O01 | Juniper, **JNCIA-Junos exam objectives**, consulta 2026 | https://learningportal.juniper.net/juniper/user_activity_info.aspx?id=14354 | Contraste de fundamentos y comandos | Alta para áreas generales |

## 9. Criterios de aceptación para cerrar la Tanda 1

- [x] Identificar versiones de CCNA y tronco CCNP Enterprise vigentes.
- [x] Identificar objetivos futuros publicados y variaciones que afectan el diseño.
- [x] Examinar concentraciones CCNP relevantes, con correspondencia temática inicial.
- [x] Incorporar al menos un marco de competencias SOC y Red Team y estándares independientes.
- [x] Producir matriz temática, fuentes directas, incertidumbres y recomendaciones.
- [ ] Mapear **cada subobjetivo individual** de todos los exámenes de referencia a módulos evaluables (todavía no hay módulos acordados; requiere Tanda 2 + auditoría).
- [ ] Corroborar estándares IEEE 802.1 y versiones/documentos específicos por control.
- [ ] Cuantificar cobertura real tras construir y auditar currículo y prácticas.

**Cierre provisional:** Tanda 1 de investigación documental completada a nivel de áreas y fuentes priorizadas; no equivale a auditoría final objetivo-por-objetivo. Próxima etapa recomendada: **Tanda 2 — Arquitectura curricular y diagnóstico**, reutilizando esta matriz de trazabilidad sin implementar contenido.
