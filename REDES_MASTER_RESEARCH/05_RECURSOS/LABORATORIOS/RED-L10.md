# RED-L10 — Campus segmentado: ACL, firewall, hardening y controles L2

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible campus segmentado: acl, firewall, hardening y controles l2 en un entorno docente controlado.

Módulos: RED-M20, RED-M21, RED-M22, RED-M23. Previos del diseño: RED-M06, RED-M07, RED-M09, RED-M10, RED-M12, RED-M16, RED-M17.

- Diseñar red empresarial escalable con documentación y riesgos
- Aplicar política de mínimos privilegios y validar flujos
- Separar gestión/control/datos y proteger administración
- Defender acceso de red y demostrar límites por plataforma

## Topología y preparación

Usuarios VLAN10 ↔ FW/RTR ↔ servidores VLAN20 ↔ administración VLAN99

Direccionamiento del diseño: Usuarios 10.60.90.0/24; servidores 10.60.91.0/24; gestión 10.60.99.0/24

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Packet Tracer para switching, CML-Free por fases, Linux nftables para filtrado real. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Diseñar matriz de flujos por zona
- Permitir DNS/HTTPS y denegar gestión desde usuarios
- Probar acceso admin seguro y revisar DHCP snooping/DAI según plataforma

## Pruebas positivas

- Flujos explícitos permitidos y documentados

## Controles negativos y fallos para ensayar

- Gestión desde usuarios y salto lateral quedan rechazados

- ACL dirección invertida
- Regla sombra
- DHCP rogue simulado sin cruzar LAN física

## Evidencias y evaluación

- Topología numerada y tabla de interfaces/direcciones
- Configuración inicial/final o captura de resultados y comandos usados
- Resultado de prueba positiva y control negativo
- Diagnóstico causal más limitaciones y evidencia contradictoria
- Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica

Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento.

No presentar como ejecución real la resolución de una ficha documental. Evaluar dominio práctico solo con observaciones de la práctica correspondiente y revisión adecuada.

## Restauración

Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.

## Referencias

- [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html)
- [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html)
- [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html)
- [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)
- [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html)
- [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html)
- [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html)
- [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html)

## Procedencia

Adaptación de la ficha RED-L10 de T5 conservada en investigación. Estimación original: 16 h, incluidas en el recorrido total, no medidas en una ejecución.
