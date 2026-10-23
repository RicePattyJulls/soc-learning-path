# Glosario de apoyo del Mundo Redes

Consulta por módulo, sin obligación de memorizar todo el listado. Las definiciones se limitan al contexto docente; los contratos técnicos completos están en las referencias de cada módulo.

## RED-M01 — Modelo de comunicaciones y diagnóstico físico

- **Host**: Equipo conectado que origina o recibe comunicaciones.
- **Gateway**: Router que el host utiliza como siguiente salto hacia otras redes.
- **IP y MAC**: IP identifica un extremo en el encaminamiento; MAC se utiliza en el enlace local.
- **DNS y HTTP**: DNS consulta información de nombres; HTTP intercambia peticiones y respuestas de aplicación.
- **Puerto y servicio**: El puerto identifica un extremo de transporte; el servicio es la función ofrecida por una aplicación.
- **CRC y PoE**: CRC permite detectar corrupción en tramas; PoE suministra energía por un enlace Ethernet compatible.

[RFC1122](https://www.rfc-editor.org/rfc/rfc1122.html), [BRIDGE](https://docs.kernel.org/networking/bridge.html), [PHY](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html), [POE](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html).

## RED-M02 — IPv4, CIDR, VLSM y plan de direccionamiento

- **CIDR**: Notación /n que expresa cuántos bits del bloque son prefijo de red.
- **VLSM**: Asignación de subredes de tamaños distintos dentro de un bloque padre.
- **Broadcast IPv4**: Dirección para todos los hosts del dominio correspondiente; se reserva en las subredes convencionales del ejercicio.

[RFC4632](https://www.rfc-editor.org/rfc/rfc4632.html), [RFC3021](https://www.rfc-editor.org/rfc/rfc3021.html), [PY-IP](https://docs.python.org/3/library/ipaddress.html).

## RED-M03 — IPv6, ND y autoconfiguración

- **Link-local**: Dirección IPv6 válida dentro del enlace, que requiere identificar ese ámbito.
- **ND, RA y DAD**: Neighbor Discovery agrupa funciones de vecindad; RA anuncia routers y DAD busca duplicidad de direcciones.
- **SLAAC**: Autoconfiguración de direcciones mediante información anunciada en el enlace.

[RFC4291](https://www.rfc-editor.org/rfc/rfc4291.html), [RFC8200](https://www.rfc-editor.org/rfc/rfc8200.html), [RFC4861](https://www.rfc-editor.org/rfc/rfc4861.html), [RFC4862](https://www.rfc-editor.org/rfc/rfc4862.html).

## RED-M04 — TCP, UDP, MTU/MSS y transporte

- **Handshake**: Intercambio inicial que establece el estado de una conexión.
- **5-tupla**: IP origen, IP destino, puerto origen, puerto destino y protocolo de transporte.
- **MTU, MSS y PMTU**: Máximo paquete de un enlace, máximo dato TCP anunciado y menor MTU del camino, respectivamente.

[RFC9293](https://www.rfc-editor.org/rfc/rfc9293.html), [RFC1191](https://www.rfc-editor.org/rfc/rfc1191.html), [RFC8201](https://www.rfc-editor.org/rfc/rfc8201.html), [RFC9000](https://www.rfc-editor.org/rfc/rfc9000.html).

## RED-M05 — Captura y evidencia de red inicial

- **PCAP/PCAPNG**: Formatos de almacenamiento de paquetes capturados y metadatos.
- **SPAN y TAP**: Espejo de tráfico configurado en un equipo y punto de acceso de observación del enlace, con propiedades diferentes.
- **Snaplen**: Límite de bytes conservados de cada paquete por la captura.

[WIRESHARK](https://www.wireshark.org/docs/wsug_html_chunked/), [CHECKSUM](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html), [RFC8484](https://www.rfc-editor.org/rfc/rfc8484.html).

## RED-M06 — Servicios y protocolos empresariales observables

- **TLS**: Protocolo de protección del intercambio que incluye negociación y autenticación según configuración.
- **SSH y RDP**: Protocolos utilizados para acceso y administración remota.
- **SMB, LDAP y Kerberos**: Servicios de recursos compartidos, directorio y autenticación mediante tickets, respectivamente.

[RFC8446](https://www.rfc-editor.org/rfc/rfc8446.html), [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html), [RFC4253](https://www.rfc-editor.org/rfc/rfc4253.html), [RFC4120](https://www.rfc-editor.org/rfc/rfc4120.html), [SMB](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security), [RFC9000](https://www.rfc-editor.org/rfc/rfc9000.html).

## RED-M07 — DNS, DHCP, NTP y resolución de fallos

- **Resolver y autoridad DNS**: El resolver consulta por el cliente; la autoridad responde por las zonas a su cargo.
- **DHCP y relay**: DHCP entrega configuración de red; el relay comunica la red cliente con un servidor en otra red.
- **TTL y offset**: TTL limita vigencia o recorrido según protocolo; offset es el desfase de un reloj frente a una referencia.

[RFC1034](https://www.rfc-editor.org/rfc/rfc1034.html), [RFC2131](https://www.rfc-editor.org/rfc/rfc2131.html), [RFC8415](https://www.rfc-editor.org/rfc/rfc8415.html), [RFC5905](https://www.rfc-editor.org/rfc/rfc5905.html).

## RED-M08 — Switching Ethernet, tablas MAC y descubrimiento

- **Tabla MAC**: Relación aprendida entre direcciones MAC, puertos y VLAN para conmutar tramas.
- **LLDP/CDP**: Protocolos que anuncian información de vecinos del enlace; CDP corresponde a Cisco.
- **Contador acumulativo**: Total desde su inicio o reinicio; para medir actividad reciente se comparan muestras.

[BRIDGE](https://docs.kernel.org/networking/bridge.html), [PHY](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html), [POE](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html).

## RED-M09 — VLAN, 802.1Q, trunks e inter-VLAN

- **Access y trunk**: Puerto de acceso para una VLAN de datos y enlace que transporta varias VLAN, según configuración.
- **802.1Q y VLAN nativa**: Etiquetado de VLAN y tratamiento configurado para tráfico sin etiqueta en ciertos trunks.
- **SVI**: Interfaz de capa 3 asociada a una VLAN para funciones IP.

[BRIDGE](https://docs.kernel.org/networking/bridge.html), [STP](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html).

## RED-M10 — STP/RSTP/MSTP y LACP

- **STP, root y BPDU**: Protocolo para evitar bucles L2, puente de referencia y mensajes usados por ese control.
- **LACP**: Protocolo que negocia qué enlaces pertenecen a una agregación.
- **Convergencia**: Adaptación del estado de red tras un cambio; la recuperación de servicio también debe medirse.

[STP](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html), [BRIDGE](https://docs.kernel.org/networking/bridge.html), [BONDING](https://docs.kernel.org/networking/bonding.html).

## RED-M11 — Fundamentos Wi-Fi, RF y conectividad

- **SSID y BSSID**: Nombre de red WLAN y identificador de una instancia del servicio de radio.
- **RF, RSSI y SNR**: Radiofrecuencia, medida de señal recibida y relación entre señal y ruido.
- **Airtime y roaming**: Tiempo de uso del medio radio y transición de asociación entre BSSID.

[WLAN](https://www.ieee802.org/11/), [WPA3](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html).

## RED-M12 — Tablas de rutas y enrutamiento estático

- **RIB y FIB**: Tabla de decisiones de routing y estado utilizado para reenviar paquetes, respectivamente.
- **Next hop y LPM**: Siguiente salto y selección del prefijo coincidente más largo entre rutas instaladas.

[FRR-STATIC](https://docs.frrouting.org/en/latest/static.html), [RFC4632](https://www.rfc-editor.org/rfc/rfc4632.html).

## RED-M13 — OSPFv2/v3 empresarial

- **LSA, LSDB y SPF**: Anuncio de estado de enlace, base de esos anuncios y cálculo de caminos de OSPF.
- **DR/BDR y DROther**: Roles de router designado, respaldo y otros routers en ciertos medios OSPF.
- **ABR y ASBR**: Router entre áreas y router que introduce rutas externas, respectivamente.

[FRR-OSPF](https://docs.frrouting.org/en/latest/ospfd.html), [FRR-OSPF6](https://docs.frrouting.org/en/latest/ospf6d.html).

## RED-M14 — BGP y políticas de rutas

- **AS y BGP**: Sistema autónomo de routing y protocolo que intercambia alcanzabilidad y atributos entre sistemas.
- **Local preference y AS_PATH**: Preferencia de política interna y secuencia de AS del camino anunciado.
- **Comunidad y ROV**: Etiqueta interpretada por políticas y validación del origen mediante autorizaciones RPKI.

[RFC4271](https://www.rfc-editor.org/rfc/rfc4271.html), [FRR-BGP](https://docs.frrouting.org/en/latest/bgp.html), [RFC7454](https://www.rfc-editor.org/rfc/rfc7454.html).

## RED-M15 — Routing avanzado, VRF y redistribución

- **Redistribución**: Importación de rutas entre fuentes o protocolos con políticas de conversión.
- **VRF y PBR**: Contexto independiente de routing y encaminamiento de paquetes mediante política.
- **uRPF**: Validación de origen basada en rutas, con modos que toleran de forma distinta la asimetría.

[FRR-MAP](https://docs.frrouting.org/en/latest/routemap.html), [RFC3704](https://www.rfc-editor.org/rfc/rfc3704.html), [FRR-BGP](https://docs.frrouting.org/en/latest/bgp.html).

## RED-M16 — Gateway redundante y convergencia

- **FHRP**: Familia de protocolos de redundancia del gateway de primer salto, como VRRP o HSRP.
- **BFD**: Mecanismo de detección de continuidad integrado con otras funciones de routing.
- **Preemption**: Recuperación del rol preferido cuando vuelve un candidato mejor, según protocolo y configuración.

[RFC9568](https://www.rfc-editor.org/rfc/rfc9568.html), [RFC5880](https://www.rfc-editor.org/rfc/rfc5880.html), [STP](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html).

## RED-M17 — NAT, PAT, proxies y asimetría

- **SNAT, DNAT y PAT**: Traducción del origen, del destino y de direcciones con distinción de puertos.
- **Proxy y backend**: Intermediario que atiende o reenvía peticiones y servicio situado detrás de él.
- **Asimetría**: Uso de caminos diferentes para los sentidos de una comunicación.

[RFC3022](https://www.rfc-editor.org/rfc/rfc3022.html), [RFC3704](https://www.rfc-editor.org/rfc/rfc3704.html).

## RED-M18 — WAN, VPN, IPsec, GRE, MPLS y SD-WAN

- **Underlay y overlay**: Transporte base y conectividad lógica construida sobre él.
- **GRE, IKE y ESP**: Encapsulación de túnel, negociación de asociaciones y transporte protegido de IPsec.
- **SLA y jitter**: Condiciones contractuales de servicio y variación de demora según el método de medida.

[RFC4301](https://www.rfc-editor.org/rfc/rfc4301.html), [RFC3031](https://www.rfc-editor.org/rfc/rfc3031.html).

## RED-M19 — QoS, multicast y calidad de experiencia

- **RTT y percentil**: Tiempo de ida y vuelta y valor bajo el que cae una proporción de las muestras.
- **DSCP, policing y shaping**: Marcado de clase, tratamiento del excedente y ajuste de perfil mediante cola.
- **IGMP/MLD y PIM**: Señalización de pertenencia multicast IPv4/IPv6 y familia de protocolos de routing multicast.

[RFC4594](https://www.rfc-editor.org/rfc/rfc4594.html), [RFC3376](https://www.rfc-editor.org/rfc/rfc3376.html).

## RED-M20 — Diseño de campus, zonas y resiliencia

- **Campus y núcleo colapsado**: Red de una sede y diseño que combina responsabilidades de distribución y núcleo.
- **DMZ y dominio de fallo**: Zona de funciones expuestas con política explícita y conjunto afectado por una dependencia común.
- **PDU**: Unidad que distribuye alimentación eléctrica a equipos.

[NIST-ZT](https://csrc.nist.gov/pubs/sp/800/207/final), [RFC7348](https://www.rfc-editor.org/rfc/rfc7348.html).

## RED-M21 — ACL, firewall stateful y segmentación

- **ACL y primera coincidencia**: Reglas de control cuya evaluación puede terminar al encontrar la primera aplicable.
- **Stateful y stateless**: Decisión con contexto de conversación y decisión sin ese seguimiento, respectivamente.
- **Egress y enforcement**: Tráfico de salida y punto donde se aplica efectivamente una decisión de acceso.

[NIST-ZT](https://csrc.nist.gov/pubs/sp/800/207/final), [AWS-ACL](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html), [AZ-NSG](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview).

## RED-M22 — Planos, AAA y hardening de infraestructura

- **AAA**: Autenticación de identidad, autorización de acciones y registro de uso o accounting.
- **CoPP**: Protección del tráfico dirigido al plano de control según capacidades de la plataforma.
- **Fuera de banda y rollback**: Camino de gestión independiente del fallo previsto y reversión comprobable de un cambio.

[RFC8907](https://www.rfc-editor.org/rfc/rfc8907.html), [RFC4253](https://www.rfc-editor.org/rfc/rfc4253.html), [NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final), [COPP](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html).

## RED-M23 — Controles L2, 802.1X y NAC

- **Binding y DAI**: Relación autorizada de IP/MAC/puerto y validación de ARP contra información de confianza.
- **Supplicant y authenticator**: Extremo que solicita admisión 802.1X y equipo que controla el acceso.
- **NAC y MAB**: Política de admisión contextual y reconocimiento de una MAC declarada, con garantías distintas.

[DAI](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html), [RFC3580](https://www.rfc-editor.org/rfc/rfc3580.html), [RFC8907](https://www.rfc-editor.org/rfc/rfc8907.html), [RFC9190](https://www.rfc-editor.org/rfc/rfc9190.html).

## RED-M24 — WLAN empresarial y seguridad inalámbrica

- **PMF**: Protección de determinadas tramas de gestión cuando está negociada y soportada.
- **EAP-TLS y RADIUS**: Método de autenticación basado en TLS y protocolo de comunicación con el backend AAA.
- **Modo de transición**: Perfil que permite combinaciones de compatibilidad; se verifica la negociación de cada cliente.

[WLAN](https://www.ieee802.org/11/), [WPA3](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html), [RFC9190](https://www.rfc-editor.org/rfc/rfc9190.html).

## RED-M25 — Cloud networking e interconexión híbrida

- **VPC y VNet**: Recursos de red virtual de AWS y Azure con contratos y controles propios.
- **Security group, NACL y NSG**: Controles concretos de AWS o Azure; no se presume que compartan evaluación o estado.
- **Peering y flow logs**: Interconexión de redes y registros de metadatos de tráfico con cobertura definida por producto.

[AWS-ACL](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html), [AZ-NSG](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview), [AWS-FLOW](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html), [AZ-FLOW](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview).

## RED-M26 — Syslog, SNMP, NTP y observabilidad de equipos

- **Facility, severity y PRI**: Categoría Syslog, urgencia del mensaje y valor que las combina mediante facility × 8 + severity.
- **Polling, trap e inform**: Consulta periódica, notificación sin confirmación equivalente y notificación con confirmación SNMP.
- **Pipeline y lag**: Cadena de adquisición/transformación y demora de entrega o ingestión que debe medirse.

[RFC5424](https://www.rfc-editor.org/rfc/rfc5424.html), [RFC3414](https://www.rfc-editor.org/rfc/rfc3414.html), [RFC3416](https://www.rfc-editor.org/rfc/rfc3416.html), [RFC5905](https://www.rfc-editor.org/rfc/rfc5905.html).

## RED-M27 — IPFIX/NetFlow, IDS/IPS y NDR

- **IPFIX y plantilla**: Exportación de información de flujos y esquema de campos válido en un contexto de observación.
- **IDS, IPS y NDR**: Detección, prevención y análisis de comportamientos de red, con funciones dependientes del despliegue.
- **Muestreo**: Selección de parte de las observaciones; requiere declarar método y límites de estimación.

[RFC7011](https://www.rfc-editor.org/rfc/rfc7011.html), [ZEEK-CONN](https://docs.zeek.org/en/current/reference/logs/conn.html), [SURICATA](https://docs.suricata.io/en/latest/output/eve/eve-json-output.html).

## RED-M28 — Análisis PCAP avanzado y protocolos

- **Stream y request ID**: Conversación en un archivo analizado e identificador de petición en un contexto de aplicación.
- **Offload**: Trabajo delegado a la interfaz de red que puede completarse después del punto de captura local.
- **DC y ticket de servicio**: Controlador de dominio y credencial Kerberos para un servicio; no equivalen a autorización final del recurso.

[WIRESHARK](https://www.wireshark.org/docs/wsug_html_chunked/), [CHECKSUM](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html), [RFC4120](https://www.rfc-editor.org/rfc/rfc4120.html), [EV4769](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769), [SMB](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security).

## RED-M29 — Investigación SOC de hipótesis y cronologías

- **Hipótesis discriminante**: Explicación con una observación prevista que la distingue de otras alternativas.
- **Pivote y cardinalidad**: Clave para relacionar fuentes y número de correspondencias que produce esa relación.
- **Incertidumbre temporal**: Intervalo admisible de la hora real según resolución y precisión del reloj.

[NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final), [ZEEK-DNS](https://docs.zeek.org/en/current/reference/logs/dns.html), [RFC3022](https://www.rfc-editor.org/rfc/rfc3022.html).

## RED-M30 — Correlación, normalización y detección

- **Normalización y null**: Mapeo con semántica preservada y representación explícita de dato desconocido.
- **CIM, CEF y DCR**: Modelo de información de Splunk, formato de eventos y reglas Azure de recolección/transformación.
- **TP, FP, FN y TN**: Positivos correctos, alertas sobre benignos, positivos omitidos y benignos sin alerta respecto a etiquetas conocidas.

[CIM](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model), [DCR](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview), [NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

## RED-M31 — Respuesta a incidentes y recuperación de red

- **Triage y contención**: Priorización de investigación y medida para limitar riesgo con impacto y autoridad definidos.
- **Derivado**: Subconjunto o transformación trazable a una fuente original preservada.
- **Recuperación**: Restablecimiento verificado del servicio y de las condiciones de seguridad acordadas.

[NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final), [NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final).

## RED-M32 — Autorización, alcance y reglas de actuación

- **Scope**: Activos, operaciones y condiciones incluidos expresamente en el alcance de una evaluación.
- **Reglas de actuación**: Condiciones de ventana, tasas, datos, contactos y parada acordadas para la prueba.

[NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final).

## RED-M33 — Descubrimiento y enumeración seguros

- **Enumeración y banner**: Obtención acotada de información de activos/servicios y dato que declara un servicio en una interacción.
- **Parche retroportado**: Corrección incorporada a una versión mantenida sin adoptar necesariamente el número de una versión posterior.

[NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final), [ZEEK-CONN](https://docs.zeek.org/en/current/reference/logs/conn.html).

## RED-M34 — Evaluación autorizada de controles de red

- **Control positivo y negativo**: Prueba que debe pasar y prueba que debe denegarse para contrastar el método y la política.
- **Incumplimiento e impacto**: Observación contraria a un requisito y consecuencia demostrada, limitada a la evidencia del ensayo.

[NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final), [NIST-ZT](https://csrc.nist.gov/pubs/sp/800/207/final).

## RED-M35 — Validación conjunta, remediación y retest

- **Ground truth**: Referencia de actividad y resultado conocidos que permite contrastar la cadena de observación.
- **Retest y regresión**: Repetición tras corregir y efecto secundario que rompe una función antes válida.

[NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final), [NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

## RED-M36 — Python, datos y Git para operaciones de red

- **Tipo y esquema**: Clase de valor en un lenguaje y contrato de campos/tipos/rangos de un documento.
- **Fixture y oráculo**: Datos preparados para evaluación y resultado esperado obtenido de manera independiente.
- **Diff**: Comparación de cambios entre versiones, que todavía requiere interpretar su efecto.

[PY-IP](https://docs.python.org/3/library/ipaddress.html), [PY-JSON](https://docs.python.org/3/library/json.html), [RFC8259](https://www.rfc-editor.org/rfc/rfc8259.html), [YAML](https://yaml.org/spec/1.2.2/), [GIT](https://git-scm.com/docs/git-diff).

## RED-M37 — APIs, YANG y automatización de dispositivos

- **API REST y HTTP 202**: Interfaz de recursos con contrato propio y aceptación que puede dejar procesamiento pendiente.
- **YANG, NETCONF y RESTCONF**: Modelado de datos y protocolos de operación sobre datos modelados, con capacidades específicas.
- **Idempotencia**: Propiedad de repetir una operación sin producir efectos adicionales respecto al estado previsto.

[RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html), [RFC6241](https://www.rfc-editor.org/rfc/rfc6241.html), [RFC7950](https://www.rfc-editor.org/rfc/rfc7950.html), [RFC8040](https://www.rfc-editor.org/rfc/rfc8040.html), [ANSIBLE](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html).

## RED-M38 — Cambios controlados, idempotencia y rollback

- **Precheck y canary**: Comprobación previa y despliegue inicial limitado que debe representar los riesgos relevantes.
- **Rollback**: Retorno controlado con disparador, alcance real, acceso y pruebas de recuperación definidos.

[ANSIBLE](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html), [GIT](https://git-scm.com/docs/git-diff), [RFC6241](https://www.rfc-editor.org/rfc/rfc6241.html).

## RED-M39 — Troubleshooting avanzado, capacidad y assurance

- **SLI, SLO y SLA**: Indicador de servicio, objetivo operativo y compromiso contractual con términos específicos.
- **Assurance**: Contraste de intención, estado y experiencia de servicio mediante observaciones con cobertura conocida.

[NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final), [WIRESHARK](https://www.wireshark.org/docs/wsug_html_chunked/), [RFC4594](https://www.rfc-editor.org/rfc/rfc4594.html).

## RED-M40 — Proyecto final: diseño de red empresarial

- **Requisito y supuesto**: Condición que debe satisfacerse y dato provisional que necesita comprobación.
- **RTO**: Objetivo de tiempo de recuperación para un servicio y fallo definidos, diferente de un resultado ya medido.

[RFC4632](https://www.rfc-editor.org/rfc/rfc4632.html), [NIST-ZT](https://csrc.nist.gov/pubs/sp/800/207/final), [FRR-BGP](https://docs.frrouting.org/en/latest/bgp.html).

## RED-M41 — Proyecto final: operación SOC ↔ Red Team

- **Verdad docente**: Expectativa y hechos sintéticos elegidos para evaluar razonamiento, sin atribuirlos a ejecución real.
- **Offset y lag corregido**: Desfase del reloj emisor y demora respecto a la hora interpretada tras aplicar esa corrección.

[NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final), [NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final).

## RED-M42 — Defensa técnica, diagnóstico de egreso y plan de retención

- **Transferencia**: Aplicación razonada de conocimientos a un caso diferente del ejemplo memorizado.
- **Recuperación activa**: Intento de recordar o resolver antes de consultar apuntes o solucionario.

[NIST-TEST](https://csrc.nist.gov/pubs/sp/800/115/final), [NIST-IR](https://csrc.nist.gov/pubs/sp/800/61/r3/final).
