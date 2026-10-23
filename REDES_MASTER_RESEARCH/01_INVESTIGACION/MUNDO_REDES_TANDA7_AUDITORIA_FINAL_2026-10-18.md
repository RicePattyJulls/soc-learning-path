# MUNDO DE REDES — TANDA 7/7
## Auditoría final de consistencia, trazabilidad, licencias y readiness curricular

**Fecha de auditoría:** 2026-10-18 · **Estado:** investigación documental consolidada; NO implementación ni currículo plenamente validado.
**Fuente de encargo:** `redes.txt`. **Material auditado:** T1.md, T2–T6 .md/.json (sin editar los originales).
**Método:** lectura de artefactos → verificaciones programáticas → contrastes selectivos de fuentes oficiales → objeciones CRITIC → consolidación. Un ciclo específico en T7; no es equivalencia de cinco ciclos ni validación técnica completa.

> Los términos «comprobado», «referenciado», «propuesto», «ejecutado» y «validado» tienen significados diferentes. La validación estructural no demuestra el funcionamiento del software.

## 1. Dictamen ejecutivo

**Dictamen:** **APTO COMO PROPUESTA CURRICULAR PARA REVISIÓN HUMANA, NO APTO PARA IMPLEMENTACIÓN COMO ACADEMIA LISTA PARA IMPARTIRSE.**

El baseline **8 etapas / 42 módulos / 168 títulos de lección / 592 h estimadas** es internamente consistente. Los **20 laboratorios troncales (275 h estimadas, incluidas en las 592 h)** son diseños; **0 ejecutados / 0 validados técnicamente**. Las **109 correspondencias** del mapa Cisco se limitan a objetivos principales x.y de tres programas; no acreditan todos los subobjetivos ni especializaciones CCNP. Los **29 cruces entre mundos** son conceptuales, no integración runtime.

La investigación detectó dos bloqueos de licencia de mayor impacto: **Packet Tracer no está libremente habilitado para crear contenidos/cursos ajenos a NetAcad**, y **CML-Free/Personal tienen restricciones específicas de uso comercial y distribución de imágenes**.

### 1.1 Tabla de control

| Métrica | Auditoría T7 | Validez |
|---|---:|---|
| Etapas | 8 | Conteo en artefactos |
| Módulos | 42 | Conteo en artefactos |
| Títulos de lección propuestos | 168 | Conteo en artefactos |
| Horas globales estimadas | 592 | Estimación, no carga medida |
| Laboratorios diseñados | 20 | Conteo en artefactos |
| Horas de laboratorios DENTRO de las 592 | 275 | Estimación, no carga medida |
| Extensiones opcionales | 2 | Conteo en artefactos |
| Casos SOC/Red diseñados | 12 | Conteo en artefactos |
| Fuentes de telemetría analizadas | 16 | Conteo en artefactos |
| Filas de objetivos principales (3 exámenes) | 109 | Referencias documentales, no pruebas de ejecución |
| Cruces curriculares propuestos | 29 | Referencias documentales, no pruebas de ejecución |
| Módulos con cruces directos | 25 | Conteo en artefactos |
| Laboratorios con cruces directos | 13 | Conteo en artefactos |
| Comprobaciones estructurales correctas | 32/32 | Comprobación estructural |

## 2. Auditoría de fuentes: hechos, inferencias y decisiones

### 2.1 Cisco y referencias de ingeniería

- **Documentado:** CCNA 200-301 v1.1 sigue siendo vigente a 18/10/2026; v2.0 inicia el **03/02/2027**. No asignar v2.0 como versión actual del examen. [Fuente C-CNA].
- **Documentado:** ENCOR 350-401 **v1.2** tiene contenido oficial publicado; la matriz actual debe seguir ampliándose por subobjetivos y concentraciones relevantes. [C-ENCOR].
- **Documentado:** IEEE 802.1Q-2022 aparece como **Active Standard** en IEEE; sus enmiendas y revisiones requieren fecha y estado por separado. [C-IEEE].
- **Inferencia pedagógica:** ser competente en SOC/Red Team NO presupone capacidad avanzada para configurar routing; el diagnóstico por competencia debe ser independiente.
- **Decisión propuesta:** Cisco es baseline de comparación, no único proveedor, ni requisito de que el estudiante compre la certificación.

### 2.2 Licencias — bloqueo de cualquier despliegue educativo comercial no cubierto por derechos

**Packet Tracer.** El acuerdo de Cisco (`Cisco Packet Tracer Software`, versión 2.0, 10/09/2025, cláusula 4.1) limita su uso a Cisco Networking Academy u otros fines **aprobados por escrito** por Cisco. Expresamente incluye entre los usos no permitidos sin aprobación impartir cursos no vinculados a NetAcad y crear materiales, vídeos o libros incluso no comerciales. Por tanto, «descarga gratis» **no equivale** a derecho de crear courseware comercial. Si la academia no reúne los requisitos contractuales, usar otra herramienta o pedir autorización. [C-PT]

**CML.** El acuerdo (`Cisco Modeling Labs`, v4.0, 14/04/2026) separa CML-Free, Personal, Education y Enterprise: CML-Free es no comercial; instituciones educativas acreditadas, ONG y miembros NetAcad pueden cumplir una **excepción explícita de instalación multiusuario** con fines docentes. CML-Personal/Plus es no comercial para un usuario identificado. CML-Education contempla ONG y Cisco Learning Partners verificados; no puede asumirse que una academia privada independiente sea elegible. El uso de imágenes virtualizadas Cisco fuera de CML está restringido (cláusula 4.1). [C-CML]

**Decisión:** para estudiantes individuales, usar herramientas de manera separada y según licencia; para una academia comercial, no recomendar ninguna plataforma propietaria como obligatoria hasta comprobar su uso permitido por entidad, curso, modalidad y distribución de material.

**Límites técnicos confirmados:** CML-Free permite **5 nodos contabilizados simultáneos**, y su VM 2.9 recomienda como mínimo **8 GB de RAM asignados**, 4 núcleos y 32 GB de disco, además del host. Security Onion Standalone 2.4 tiene **24 GB RAM** como mínimo. No prometer laboratorios completos en un portátil de 16 GB sin medir alternativas. [C-CML-FREE, C-CML-REQ, C-SO]

### 2.3 Detección y respuesta

- **Documentado:** NIST SP 800-61 Rev.3 sustituye a Rev.2 (publicación final en abril 2025). [C-NIST].
- **Documentado:** MITRE ATT&CK v18 deprecó Data Sources; la docencia debe discriminar estrategia, componente y telemetría real. [C-MITRE].
- **Documentado:** Splunk CIM 6.1 distingue Network Traffic e Intrusion Detection; no son sinónimos por etiquetar allow/deny. [C-CIM].
- **Decisión:** falta de logs ≠ ausencia de actividad. Una IP no equivale automáticamente a un usuario. Se exigirá cronología UTC, corroboración y caso benigno alternativo.

## 3. Integridad de artefactos y grafo de dependencias

- **32/32** controles programáticos superados: unicidad de IDs, prerequisitos resueltos, DAG acíclico, módulos/casos/labs enlazados, fuentes y competencias de cruces, índice bidireccional módulo↔laboratorio, hashes de procedencia y sumas.
- El inventario `T2` y los documentos `T3–T6` permanecen sin cambios. Los hashes SHA-256 de los JSON de base coinciden con los campos de procedencia registrados en las siguientes tandas.
- **Limitación:** un grafo acíclico garantiza consistencia referencial, no pertinencia pedagógica ni calidad de un ejercicio.

### 3.1 Comprobaciones replicadas

| Validación | Resultado |
|---|---|
| `module_ids_unique` | PASS (0 errores) |
| `lab_ids_unique` | PASS (0 errores) |
| `link_ids_unique` | PASS (0 errores) |
| `module_prerequisites_resolved` | PASS (0 errores) |
| `mapping_t3_targets_resolved` | PASS (0 errores) |
| `t4_case_targets_resolved` | PASS (0 errores) |
| `lab_module_targets_resolved` | PASS (0 errores) |
| `lab_case_targets_resolved` | PASS (0 errores) |
| `module_lab_index_resolved` | PASS (0 errores) |
| `module_lab_index_bidirectional` | PASS (0 errores) |
| `link_module_targets_resolved` | PASS (0 errores) |
| `link_lab_targets_resolved` | PASS (0 errores) |
| `link_case_targets_resolved` | PASS (0 errores) |
| `link_source_targets_resolved` | PASS (0 errores) |
| `link_competency_targets_resolved` | PASS (0 errores) |
| `link_world_targets_resolved` | PASS (0 errores) |
| `lab_hooks_targets_resolved` | PASS (0 errores) |
| `case_hooks_targets_resolved` | PASS (0 errores) |
| `module_hooks_targets_resolved` | PASS (0 errores) |
| `t3_module_audit_exhaustive` | PASS (0 errores) |
| `lab_module_coverage` | PASS (0 errores) |
| `core_inventory_counts` | PASS (0 errores) |
| `prerequisite_DAG` | PASS (0 errores) |
| `stage_hour_sums` | PASS (0 errores) |
| `t3_baseline_hash` | PASS (0 errores) |
| `file_provenance_2_32e677fc` | PASS (0 errores) |
| `file_provenance_3_891cfcce` | PASS (0 errores) |
| `file_provenance_4_25a81f11` | PASS (0 errores) |
| `file_provenance_5_51ed03dc` | PASS (0 errores) |
| `t5_hash_MUNDO_REDES_TANDA2_ARQUITECTURA_2026-10-18.json` | PASS (0 errores) |
| `t5_hash_MUNDO_REDES_TANDA3_AUDITORIA_TECNICA_2026-10-18.json` | PASS (0 errores) |
| `t5_hash_MUNDO_REDES_TANDA4_SOC_REDTEAM_2026-10-18.json` | PASS (0 errores) |

## 4. Auditoría de cobertura contra CCNA y CCNP

Las 109 correspondencias se refieren a **identificadores principales x.y**. No son 109 competencias certificadas ni 109 pruebas completas.

| Examen oficial considerado | Referenciados (T) | Parciales (P) | Huecos (H) | Omitidos (O) | Filas |
|---|---:|---:|---:|---:|---:|
| CCNA 200-301 v1.1 (vigente 18-10-2026) | 24 | 26 | 2 | 1 | 53 |
| CCNA 200-301 v2.0 (referencia FUTURA, no reemplaza v1.1 aún) | 10 | 14 | 5 | 0 | 29 |
| ENCOR 350-401 v1.2 (troncal CCNP vigente) | 5 | 14 | 5 | 3 | 27 |

**Calificación del mapa:** útil para diagnóstico de diseño; **no exhaustivo por subobjetivo**, y las concentraciones ENARSI, ENSLD, ENNA, ENAUTO, ENCC, ENSDWI y Wireless aún están mapeadas de forma parcial/temática. Ninguna equivalencia oficial o preparación para un examen se afirma.

### 4.1 Profundidad exigida por disciplina

| Dominio | Profundidad mínima futura exigible | Control esperado |
|---|---|---|
| IPv4/IPv6, DNS, TCP, MTU/MSS | configurar, capturar, explicar y diagnosticar | Pruebas de ruta y retorno, ND/DAD, ICMPv6 y error de resolución |
| Switching y campus | configurar y aislar fallos | VLAN, STP, trunk, LACP, ACL L2 y recuperación |
| OSPF/BGP | diagnóstico avanzado; políticas y diseño empresarial | Adyacencias, áreas, filtros, route leak, routing asimétrico, rollback |
| WAN/VPN/Wi-Fi/seguridad | decisiones de arquitectura y pruebas de plataforma | IPsec, AAA/802.1X, controles stateful y fallos autenticación |
| SOC | investigar con niveles de confianza | PCAP/flows/eventos, incertidumbre, correlación, evidencia positiva y contraria |
| Red Team autorizado | validación mínima y alcance delimitado | Permiso, matriz allow/deny, prueba reproducible, corrección y retest |
| Automatización | idempotencia y gestión de cambios | Diff, test, rechazo, despliegue gradual y rollback |

## 5. Catálogo de 42 módulos — vista de auditoría final

> Los títulos, lecciones y dependencias proceden de T2; las correcciones documentales de T3/T4 NO se han aplicado automáticamente sobre T2. Este es un índice de revisión, no la ficha de enseñanza terminada.

| ID | Etapa | Título | h estimadas | Previos | Laboratorios |
|---|:---:|---|---:|---|---|
| RED-M01 | E1 | Modelo de comunicaciones y diagnóstico físico | 8 | — | L01 |
| RED-M02 | E1 | IPv4, CIDR, VLSM y plan de direccionamiento | 12 | M01 | L01 |
| RED-M03 | E1 | IPv6, ND y autoconfiguración | 12 | M01, M02 | L02 |
| RED-M04 | E1 | TCP, UDP, MTU/MSS y transporte | 10 | M01, M02 | L02, L03 |
| RED-M05 | E1 | Captura y evidencia de red inicial | 10 | M01, M02, M04 | L03 |
| RED-M06 | E1 | Servicios y protocolos empresariales observables | 12 | M04, M05 | L03 |
| RED-M07 | E2 | DNS, DHCP, NTP y resolución de fallos | 12 | M02, M03, M05 | L03, L05 |
| RED-M08 | E2 | Switching Ethernet, tablas MAC y descubrimiento | 8 | M01, M02 | L04 |
| RED-M09 | E2 | VLAN, 802.1Q, trunks e inter-VLAN | 14 | M02, M08 | L04 |
| RED-M10 | E2 | STP/RSTP/MSTP y LACP | 12 | M08, M09 | L04 |
| RED-M11 | E2 | Fundamentos Wi-Fi, RF y conectividad | 12 | M02, M03, M07 | L11 |
| RED-M12 | E3 | Tablas de rutas y enrutamiento estático | 12 | M02, M03, M09 | L06 |
| RED-M13 | E3 | OSPFv2/v3 empresarial | 18 | M12 | L06 |
| RED-M14 | E3 | BGP y políticas de rutas | 22 | M12, M13 | L07 |
| RED-M15 | E3 | Routing avanzado, VRF y redistribución | 18 | M12, M13, M14 | L07, L19 |
| RED-M16 | E3 | Gateway redundante y convergencia | 12 | M09, M10, M12 | L08 |
| RED-M17 | E3 | NAT, PAT, proxies y asimetría | 12 | M04, M07, M12 | L09 |
| RED-M18 | E3 | WAN, VPN, IPsec, GRE, MPLS y SD-WAN | 16 | M12, M17 | L09, L12 |
| RED-M19 | E3 | QoS, multicast y calidad de experiencia | 10 | M04, M12, M18 | L08 |
| RED-M20 | E4 | Diseño de campus, zonas y resiliencia | 16 | M09, M10, M12, M16 | L10, L12, L19 |
| RED-M21 | E4 | ACL, firewall stateful y segmentación | 18 | M09, M12, M17, M20 | L10, L12, L19 |
| RED-M22 | E4 | Planos, AAA y hardening de infraestructura | 12 | M06, M09, M12 | L05, L10 |
| RED-M23 | E4 | Controles L2, 802.1X y NAC | 14 | M07, M09, M22 | L10, L11, L19 |
| RED-M24 | E4 | WLAN empresarial y seguridad inalámbrica | 12 | M11, M21, M23 | L11 |
| RED-M25 | E4 | Cloud networking e interconexión híbrida | 16 | M18, M20, M21, M22 | L12, L19 |
| RED-M26 | E5 | Syslog, SNMP, NTP y observabilidad de equipos | 12 | M05, M07, M22 | L13 |
| RED-M27 | E5 | IPFIX/NetFlow, IDS/IPS y NDR | 16 | M17, M21, M26 | L14 |
| RED-M28 | E5 | Análisis PCAP avanzado y protocolos | 16 | M05, M06, M07, M17 | L15 |
| RED-M29 | E5 | Investigación SOC de hipótesis y cronologías | 16 | M26, M27, M28 | L15 |
| RED-M30 | E5 | Correlación, normalización y detección | 18 | M26, M27, M29 | L16, L20 |
| RED-M31 | E5 | Respuesta a incidentes y recuperación de red | 12 | M22, M29, M30 | L16, L20 |
| RED-M32 | E6 | Autorización, alcance y reglas de actuación | 8 | M01 | L17 |
| RED-M33 | E6 | Descubrimiento y enumeración seguros | 12 | M07, M12, M32 | L17 |
| RED-M34 | E6 | Evaluación autorizada de controles de red | 18 | M23, M24, M33 | L17 |
| RED-M35 | E6 | Validación conjunta, remediación y retest | 16 | M30, M31, M34 | L20 |
| RED-M36 | E7 | Python, datos y Git para operaciones de red | 16 | M05, M07, M12 | L18 |
| RED-M37 | E7 | APIs, YANG y automatización de dispositivos | 18 | M22, M26, M36 | L18 |
| RED-M38 | E7 | Cambios controlados, idempotencia y rollback | 16 | M21, M25, M36, M37 | L18, L19 |
| RED-M39 | E7 | Troubleshooting avanzado, capacidad y assurance | 12 | M16, M19, M26, M27 | L08, L18, L19 |
| RED-M40 | E8 | Proyecto final: diseño de red empresarial | 22 | M14, M15, M20, M21, M23, M25, M38, M39 | L19 |
| RED-M41 | E8 | Proyecto final: operación SOC ↔ Red Team | 24 | M31, M35, M40 | L20 |
| RED-M42 | E8 | Defensa técnica, diagnóstico de egreso y plan de retención | 10 | M40, M41 | L20 |

### 5.1 Lecciones

El currículo T2 propone cuatro títulos de lección por módulo, 168 en total. T3 y T4 son **adendas de calidad**, no sustituciones silenciosas. Los nombres y correcciones se preservan en el JSON adjunto; deberán reconciliarse formalmente ANTES de fijar la versión 1.0 curricular.

## 6. Plan de laboratorios y evaluación — validación documental

| Lab | Título abreviado | Horas dentro del plan | Estado |
|---|---|---:|---|
| RED-L01 | Modelo OSI/TCP-IP, enlace y direccionamiento IPv4 | 7 | diseñado, no ejecutado |
| RED-L02 | IPv6, Neighbor Discovery y MTU de extremo a extremo | 8 | diseñado, no ejecutado |
| RED-L03 | TCP/UDP, DNS, HTTP, TLS y captura inicial | 10 | diseñado, no ejecutado |
| RED-L04 | Switching, VLAN, trunks 802.1Q, STP y LACP | 12 | diseñado, no ejecutado |
| RED-L05 | Servicios DNS/DHCP/NTP y dependencias AAA | 10 | diseñado, no ejecutado |
| RED-L06 | Enrutamiento estático y OSPFv2/OSPFv3 | 14 | diseñado, no ejecutado |
| RED-L07 | BGP, filtros, políticas y redistribución segura | 16 | diseñado, no ejecutado |
| RED-L08 | Gateway redundante, QoS y diagnóstico de convergencia | 10 | diseñado, no ejecutado |
| RED-L09 | NAT/PAT, VPN y WAN híbrida sin salida externa | 12 | diseñado, no ejecutado |
| RED-L10 | Campus segmentado: ACL, firewall, hardening y controles L2 | 16 | diseñado, no ejecutado |
| RED-L11 | Wi-Fi corporativo, 802.1X/RADIUS y autenticación | 12 | diseñado, no ejecutado |
| RED-L12 | Diseño de red cloud/híbrida y verificación offline | 10 | diseñado, no ejecutado |
| RED-L13 | Telemetría Syslog/SNMP, UTC y calidad de observación | 10 | diseñado, no ejecutado |
| RED-L14 | NetFlow/IPFIX, Zeek, Suricata e IDS/NDR | 14 | diseñado, no ejecutado |
| RED-L15 | Investigación SOC de PCAP con hipótesis y atribución | 14 | diseñado, no ejecutado |
| RED-L16 | Reglas de detección, normalización y respuesta SOC | 16 | diseñado, no ejecutado |
| RED-L17 | Alcance, descubrimiento mínimo y prueba de segmentación Red Team | 16 | diseñado, no ejecutado |
| RED-L18 | Automatización de inventario, YANG/APIs y rollback | 18 | diseñado, no ejecutado |
| RED-L19 | Proyecto empresarial integrado: diseño, resiliencia y operación | 24 | diseñado, no ejecutado |
| RED-L20 | Misión final Purple: actividad autorizada, SOC y retest | 26 | diseñado, no ejecutado |

**Total:** 275 horas de laboratorio son **parte** de las 592 totales, dejando 317 horas previstas para contenido, preparación, repaso y otras evaluaciones (distribución todavía no verificada). No sumar 592 + 275.
**Evaluación:** rúbricas de 100 puntos e identificación de fallos críticos propuestas; el mínimo 75/100 y 80/100 no ha sido calibrado. Requiere casos patrón, pruebas positivas/negativas, reconciliación de errores humanos y ejercicios piloto independientes.

## 7. Cruces con otros mundos

| Mundo | Cruces documentados | Estado |
|---|---:|---|
| MS | 6 | referencia curricular NO integración técnica |
| SPL | 5 | referencia curricular NO integración técnica |
| AD | 5 | referencia curricular NO integración técnica |
| LX | 5 | referencia curricular NO integración técnica |
| SIM | 4 | referencia curricular NO integración técnica |
| PUR | 4 | referencia curricular NO integración técnica |

- Cruces directos: 25/42 módulos y 13/20 laboratorios. No obligar enlaces artificiales en el resto.
- Las responsabilidades del Mundo de Redes son protocolos, dispositivos, segmentación, telemetría y diagnóstico. El mundo Sentinel/Defender, Splunk, Windows/AD, Linux o simulador se ocupa de su interfaz, consulta, actuación y feedback específicos.
- No se ha inspeccionado el código fuente de la academia: ninguna referencia curricular demuestra compatibilidad de importación, progreso, hooks o API.

## 8. CRITIC — Registro consolidado de brechas

**23 problemas abiertos:** 4 bloqueantes, 10 altos y 9 medios. No son un porcentaje de errores sino condiciones de calidad pendientes.

| ID | Prioridad | Brecha | Impacto | Próxima validación concreta |
|---|---|---|---|---|
| B01 | bloqueante | licencia Packet Tracer | No puede asumirse su uso en cursos externos a NetAcad ni para crear courseware sin permiso. | Solicitar aprobación por escrito o sustituir PT por laboratorio libre sin dependencia propietaria. |
| B02 | bloqueante | licencia CML Free/Personal | La gratuidad no otorga uso comercial o multiusuario general. CML-Free permite excepciones institucionales expresas. | Obtener licencia apropiada o autorización Cisco y determinar si cumple excepciones CML-Free; no presumir CML-Education para cualquier entidad con ánimo de lucro. |
| B03 | bloqueante | propiedad intelectual de imágenes CML | Exportar imágenes Cisco de CML a GNS3/Containerlab sin derecho infringe restricción explícita. | Definir manifest de imágenes permitidas; evitar redistribuir IOS/IOL/ASAv y demás refplats. |
| B04 | bloqueante | laboratorios no ejecutados | No hay evidencia de funcionamiento, aislamiento ni criterios de aceptación medidos. | Seleccionar pilotos L02, L04, L07, L14, L17, L20 y ejecutar solo tras aprobación específica. |
| A01 | alta | matriz CCNA/CCNP incompleta | 109 filas x.y en tres programas no equivalen a todos los subobjetivos ni a las concentraciones. | Completar los subobjetivos de ENARSI, ENSLD, ENNA y ENAUTO seleccionados; marcar explícitamente omisiones. |
| A02 | alta | control de cambios de certificaciones | CCNA v2.0 es futuro al corte del 18/10/2026; la rama de IA/cambios requiere versión. | Mantener CCNA v1.1 como baseline actual y v2.0 como delta futuro. |
| A03 | alta | features de plataforma y simuladores | El soporte de VRF, OSPFv3, BGP, 802.1X, IPsec, MACsec, NETCONF y control L2 varía. | Verificar por documentación y laboratorio cada comando o feature incluida. |
| A04 | alta | coste/hardware medidos | La ruta universal de 16 GB y coste 0 € no está demostrada; hay instalaciones con mínimo superior. | Ofrecer rutas offline con PCAP/JSON y dispositivos virtuales de pocos recursos. |
| A05 | alta | datasets y ground truth | Sin dataset autoritativo y respuesta esperada no puede verificarse una investigación SOC. | Construir caso reducido y revisar con dos especialistas. |
| A06 | alta | cadena de atribución SOC | NAT, DHCP, asimetría y relojes pueden invalidar atribución de host/usuario. | Añadir umbral de confianza y evidencia contradictoria en rúbrica. |
| A07 | alta | equivalencia de esquemas | ASIM, CIM, CEF, Syslog y logs nativos no comparten contratos uno-a-uno. | Crear fixtures y tests de parsers documentados sin inventar tablas KQL/SPL. |
| A08 | alta | compatibilidad con academia real | 29 referencias curriculares NO prueban rutas web, IDs ni API implementadas. | Auditar contenidos y motores sin cambiar datos, XP ni progreso. |
| A09 | alta | desbloqueo y progreso | XP o finalización no es equivalencia de dominio; futuras migraciones pueden romper progreso. | Especificar evidencias por competencia y política de reconocimiento previa a cualquier migración. |
| A10 | alta | aislamiento/seguridad | Pruebas de red solo seguras si se demuestra que no alcanzan activos externos. | Definir checklist técnica y de permisos de cada lab antes de cualquier ejecución. |
| M01 | media | duración y carga curricular | 592 h y 275 h son estimaciones internas no medidas; no sumar laboratorios dos veces. | Pilotar al menos 6 laboratorios y ajustar tiempos con rango P50/P90. |
| M02 | media | diagnóstico/validación de previos | La valoración de 5 niveles no incluye fiabilidad probada o control de falsos aprobados. | Pilotar diagnóstico con nivel inicial y experiencia previa. |
| M03 | media | profundidad avanzada de routing | OSPF multiárea/BGP políticas/redistribución están propuestos, pero no ejecutados ni asegurados. | Añadir test positivo/negativo de cambio y rollback. |
| M04 | media | IEEE y acceso a documentos | Versiones completas de algunas normas pueden requerir acceso; documentación resumida no verifica todos sus detalles. | Atribuir IEEE 802.1Q-2022 como activo y revisar otra norma inalámbrica/802.1X del temario. |
| M05 | media | pruebas Wi-Fi y hardware | Radiofrecuencia, roaming y WPA3-Enterprise necesitan entorno o fixtures adecuados. | Separar simulación conceptual de práctica RF auténtica. |
| M06 | media | pruebas de correlación Windows/Linux y SIEM | No se ha validado producción real, acceso a conectores ni KQL/SPL sobre datasets de la academia. | Mantener cruce conceptual y proponer piloto offline por cada mundo. |
| M07 | media | invariantes de fuente/fecha | Registros de fuentes y confiabilidad no equivalen a verificación continua. | Crear registro de control de cambios trimestral antes de publicar un curso. |
| M08 | media | diseño de evaluación no pilotado | 75/100 y 80/100 son umbrales arbitrarios y no calibrados. | Ejecutar calibración por roles y redefinir umbrales mediante desempeño. |
| M09 | media | trabajo futuro y restricciones | Falta estimación de esfuerzo basada en el repositorio, y costes no documentados. | Reestimar implementación sólo después de aprobación y lectura del software existente. |

### 8.1 Puertas de salida y aceptación verificable

- **G0 revisión y aprobación curricular humana — PENDIENTE:** Propietario aprueba estructura, cambios y límites; no se desarrolla nada antes
- **G1 trazabilidad completa de referencias — PENDIENTE:** Todos los subobjetivos elegidos y concentraciones delimitadas incluyen inclusión/omisión y prueba
- **G2 validación legal de herramientas — PENDIENTE:** Derechos confirmados para la entidad/uso de Packet Tracer, CML y VM/images, o alternativas libres
- **G3 matriz de capacidades y viabilidad — PENDIENTE:** Tool/version/support, hardware medido y coste documentado
- **G4 pilotos técnicos reproducibles — PENDIENTE:** Muestras reales positivas/negativas, restauración y métricas en entorno aislado
- **G5 evaluación calibrada — PENDIENTE:** Rúbricas, dos evaluadores, pruebas de diagnóstico y fiabilidad
- **G6 auditoría académica solo lectura — PENDIENTE:** IDs de lecciones existentes, entidades progreso/XP revisadas sin cambio
- **G7 autorización explícita de implementación — PENDIENTE:** Solo entonces inicio fase de desarrollo, sin sobreescribir academia

## 9. Calificación crítica por dimensión — escala de preparación documental

Escala: **D** = coherencia documental revisada; **P** = propuesta incompleta/pendiente; **V** = validado técnicamente. Esta escala **no cuantifica dominio estudiantil**.

| Dimensión | Estado | Razón |
|---|---|---|
| Fundamentos hasta ingeniería avanzada | D/P | Estructura definida, profundidad de rutas sin pilotos |
| Comparación Cisco actual | D/P | Versiones vigentes correctas; subobjetivos y concentraciones incompletos |
| SOC y Red Team simultáneamente | D/P | Casos y rúbricas definidos; datasets no producidos |
| Diagnóstico y prerrequisitos | D/P | DAG validado, diagnóstico sin calibración |
| IPv4/IPv6, switch, routing, Wi-Fi, cloud | D/P | Cobertura temática amplia; funciones y simuladores no verificados |
| Fuentes y vigencia | D/P | Fuentes primarias selectas verificadas, IEEE parcialmente accesible |
| Laboratorios y costes/licencias | P | Licencias bloqueantes y cero ejecuciones |
| Legalidad, aislamiento y reversibilidad | D/P | Reglas redactadas, aislamiento no ejecutado |
| Integración Microsoft/Splunk/AD/Linux/simulador | D/P | 29 enlaces documentales; sin código/telemetría ejecutados |
| Material listo para impartir/publicar | P | No existe y no estaba permitido generarlo |

## 10. Decisiones, secuencia sugerida y revisión humana

**Decisiones estables:** mantener como baseline documental 8 etapas, 42 módulos, 20 laboratorios, catálogo de 12 casos y 29 cruces; no inflar métricas como pruebas de calidad; preservar los archivos T1–T6 y tratar T3/T4 como adendas a incorporar mediante control de cambios.

**Secuencia sugerida (tras aprobación del propietario):**

1. Resolver derechos Packet Tracer/CML y definir stack libre alternativo. No implementar labs en plataforma sin permiso.
2. Completar la matriz Cisco por subobjetivos y alinear objetivos/pruebas a nivel de competencia.
3. Consolidar una versión propuesta del currículo incorporando de forma explícita correcciones T3/T4.
4. Pilotar topologías y datasets con hardware objetivo medido y controles positivos/negativos.
5. Calibrar evaluación, diagnóstico y retest con evaluadores humanos.
6. Solo con autorización: revisar el software de academia **en modo lectura**; diseñar integración reversible y plan de cambios.
7. Solicitar una autorización independiente para desarrollar/publicar; hasta entonces no se ejecuta ningún cambio.

**Revisión humana necesaria:** límites de alcance y presupuesto, destino comercial de la academia, público/alumnos, priorización empresarial frente a operador, si se requiere cumplimiento CCNA/CCNP completo, licencia de herramientas e infraestructura disponible.

## 11. Entregables A–F pedidos por el encargo

| Entregable | Archivo(s) base | Conclusión T7 |
|---|---|---|
| **A** | T1 and T3, final audit | partially evidenced; not certification equivalence |
| **B** | T2 + T3 + T4 | full module proposal; not completed lessons |
| **C** | T2 + T6 | DAG verified; conceptual cross-world only |
| **D** | T5 | 20 designs; zero actual executions or technical validations |
| **E** | T3+T4+T5+T6+T7 | critical analysis and gaps tracked; still pending remediation |
| **F** | T6 | data contracts conceptual; not mapped to academy software |

## 12. Fuentes oficiales revalidadas en T7 (referencias directas)

| Clave | Organización, título y versión | URL | Soporte y límites |
|---|---|---|---|
| LEGAL-PT | Cisco: Cisco Packet Tracer Software Offer Description (2.0, 2025-09-10) | https://www.cisco.com/c/dam/en_us/about/doing_business/legal/seula/cisco-packet-tracer-software.pdf | official primary; terms 4.1 verified; Use connected to Networking Academy or otherwise approved in writing; creating courseware requires permission. |
| LEGAL-CML | Cisco: Cisco Modeling Labs Offer Description (4.0, 2026-04-14) | https://www.cisco.com/c/dam/en_us/about/doing_business/legal/seula/Cisco-Modeling-Labs-SEULA.pdf | official primary; terms 4.1-4.4 verified; Free noncommercial; special multiple-user institutional exception; Personal noncommercial single named user; Education reserved to nonprofits and verified Cisco Learning Partners; Cisco VM images only within CML. |
| CML-FREE | Cisco DevNet: Cisco Modeling Labs Free v2.9 (2.9 docs) | https://developer.cisco.com/docs/modeling-labs/2-9/cml-free/ | official primary; 5 simultaneous counted nodes; not authority to redistribute VM images or license commercial use. |
| CML-REQ | Cisco DevNet: Cisco Modeling Labs 2.9 System Requirements (2.9 docs) | https://developer.cisco.com/docs/modeling-labs/2-9/system-requirements/ | official primary; VM minimum allocation 8 GB RAM, 4+ physical cores, at least 32 GB disk; does not include host overhead. |
| CISCO-CCNA20 | Cisco: CCNA Certification and Training; 200-301 versions (v1.1 before 2027-02-03; v2.0 from 2027-02-03) | https://www.cisco.com/web/go/ccna/ | official primary; Last v1.1 exam date 2027-02-02; first v2.0 2027-02-03. |
| CISCO-ENCOR | Cisco: ENCOR 350-401 v1.2 Official Exam Topics (v1.2) | https://learningcontent.cisco.com/documents/marketing/exam-topics/350-401-ENCORE-v1.2.pdf | official primary; Six areas and objective detail available; audit not covering all official sub-objective rows. |
| NIST-IR | NIST: NIST SP 800-61 Rev. 3 Final (final 2025-04-03) | https://csrc.nist.gov/pubs/sp/800/61/r3/final | official primary; Incident response guidance integrated with CSF 2.0; supersedes rev. 2. |
| MITRE-DS | MITRE: ATT&CK Data Sources deprecation (ATT&CK v18 2025-10) | https://attack.mitre.org/datasources/ | official primary; Data sources deprecated in v18; teaching detection requires current strategy/components and evidence. |
| SPL-CIM | Splunk: Splunk CIM Network Traffic and Intrusion Detection (6.1) | https://docs.splunk.com/Documentation/CIM/6.1.0/User/IntrusionDetection | official primary; IDS data model distinct from traffic model by reason and timing of allow/deny. |
| SO-HW | Security Onion: Hardware Requirements Security Onion 2.4 (2.4 docs) | https://docs.securityonion.net/en/2.4/hardware.html | official product docs; Standalone min 24 GB RAM and 200 GB disk; Import 4 GB RAM and 50 GB as per hardware table; alternatives vary by mode. |
| IEEE-8021Q | IEEE: 802.1Q-2022 Active Standard (802.1Q-2022) | https://standards.ieee.org/ieee/802.1Q/10323/ | official status page; not full text audited; 802.1Q-2022 is active and may have amendments. |

### Fuentes previas e incertidumbres

Las referencias adicionales de T1–T6 conservan sus registros de vigencia y procedencia. T7 contrastó **selectivamente** fuentes críticas, no verificó nuevamente una a una todas las URLs de las seis tandas. IEEE puede requerir acceso al texto completo. Las afirmaciones sobre features, licencias de otras herramientas, precios, timings y controles runtime permanecen pendientes donde conste expresamente.

## 13. Integridad y procedencia de archivos

SHA-256 de originales usados, calculados de nuevo sin modificación:

| Archivo | SHA-256 |
|---|---|
| `MUNDO_REDES_TANDA1_INVESTIGACION_2026-10-18.md` | `459709340fc8c5a508c79f44d3b2514da9d56209d7645ef768f8d0ee4ae69515` |
| `MUNDO_REDES_TANDA2_ARQUITECTURA_2026-10-18.json` | `32e677fc52531e31a21da9e71222e9296abdd02fb02c286a9e689fb74d69ef3e` |
| `MUNDO_REDES_TANDA2_ARQUITECTURA_2026-10-18.md` | `64bc8461fbe79d3101e49903f472bd7dd770a4672c6bec01333ebe5a67a8354f` |
| `MUNDO_REDES_TANDA3_AUDITORIA_TECNICA_2026-10-18.json` | `891cfcce7d09d7c90e6ae09d109eab6e7b1c86a981c68fd624ba5796b4ac3367` |
| `MUNDO_REDES_TANDA3_AUDITORIA_TECNICA_2026-10-18.md` | `18153c6a0857528cf1d3f955a47273e70722d8e86bdcbba6d1bac83862f85f6d` |
| `MUNDO_REDES_TANDA4_SOC_REDTEAM_2026-10-18.json` | `25a81f11182497ae9b30b1b9999aebbfcb0d09c0f0c3ba3b2f275a7ba591beb9` |
| `MUNDO_REDES_TANDA4_SOC_REDTEAM_2026-10-18.md` | `9448e41b8c6a525a6dfd66335565a5a49636ee5d212b5fe540183f34e314c26e` |
| `MUNDO_REDES_TANDA5_LABORATORIOS_2026-10-18.json` | `51ed03dc7358cb85ac65432ded261a149ff9ed6b3b583ee4a4aff89aaca8d913` |
| `MUNDO_REDES_TANDA5_LABORATORIOS_2026-10-18.md` | `3d49ea18c17d80463524bafb28dceb6b3b39dcce0d0f79f99713d48ef778deee` |
| `MUNDO_REDES_TANDA6_INTEGRACION_2026-10-18.json` | `72e5bca894acc054accdd16491af3673d6510b305626dd3ab3e6ebd82dff015e` |
| `MUNDO_REDES_TANDA6_INTEGRACION_2026-10-18.md` | `3c800eee8d72651c76a103c7f72e0ef1b0590a65d5c09383aa96f9b7edcae256` |

## 14. Conclusión vinculante

**No declarar «currículo terminado» o «lista para desplegar»**. El resultado es un proyecto completo a nivel de arquitectura documental, más un registro verificable de pendientes. La próxima fase requiere aprobación antes de crear lecciones, conectar herramientas, modificar la academia o publicar repositorios. Ninguna VM, aplicación, red ni consola del usuario ha sido tocada.

*Fin de la Tanda 7/7: cierra la fase de investigación documental prevista, no la validación técnica ni la aprobación del currículo.*
