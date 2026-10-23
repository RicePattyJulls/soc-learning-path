# RED-L19 — Proyecto empresarial integrado: diseño, resiliencia y operación

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible proyecto empresarial integrado: diseño, resiliencia y operación en un entorno docente controlado.

Módulos: RED-M15, RED-M20, RED-M21, RED-M23, RED-M25, RED-M38, RED-M39, RED-M40. Previos del diseño: RED-M07, RED-M09, RED-M10, RED-M12, RED-M13, RED-M14, RED-M16, RED-M17, RED-M18, RED-M19, RED-M22, RED-M26, RED-M27, RED-M36, RED-M37.

- Evitar bucles y fugas mediante redistribución y separación de planos
- Diseñar red empresarial escalable con documentación y riesgos
- Aplicar política de mínimos privilegios y validar flujos
- Defender acceso de red y demostrar límites por plataforma
- Diseñar conectividad VNet/VPC híbrida y sus fuentes de evidencia
- Planear cambios reproducibles y recuperación ante fallos
- Encontrar causa raíz con hipótesis y métricas de red
- Entregar arquitectura de red empresarial defendible y recuperable

## Topología y preparación

Campus de 3 zonas + 2 gateways lógicos + servicio DNS + firewall + sensor; división modular del escenario si sólo hay 5 nodos

Direccionamiento del diseño: Usuarios 10.60.180.0/24; apps 10.60.181.0/24; gestión 10.60.189.0/24; WAN enlace 10.60.190.0/30

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Packet Tracer / Linux / FRR por segmentos, documentación no dependiente de proveedor. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Definir requisitos y threat model del cliente ficticio
- Presentar diseño, rutas, segmentación, continuidad, backups y rollback
- Resolver tres fallos sembrados y justificar decisiones de coste/observabilidad

## Pruebas positivas

- Matriz de conectividad, rutas y cambios cumple requisitos documentados

## Controles negativos y fallos para ensayar

- Intenta un flujo no autorizado y demuestra rechazo en variante reducida

- Fallo de enrutamiento asimétrico
- Gestión expuesta
- Conflicto de dirección

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

- [Route Maps](https://docs.frrouting.org/en/latest/routemap.html)
- [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html)
- [BGP](https://docs.frrouting.org/en/latest/bgp.html)
- [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html)
- [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html)
- [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html)
- [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html)
- [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html)
- [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview)
- [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html)
- [git diff](https://git-scm.com/docs/git-diff)
- [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html)
- [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/)
- [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html)
- [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html)

## Procedencia

Adaptación de la ficha RED-L19 de T5 conservada en investigación. Estimación original: 24 h, incluidas en el recorrido total, no medidas en una ejecución.
