# RED-L03 — TCP/UDP, DNS, HTTP, TLS y captura inicial

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible tcp/udp, dns, http, tls y captura inicial en un entorno docente controlado.

Módulos: RED-M04, RED-M05, RED-M06, RED-M07. Previos del diseño: RED-M01, RED-M02, RED-M03.

- Separar fallo de red, transporte y aplicación con trazas observables
- Obtener e interpretar una captura de laboratorio preservando procedencia
- Describir dependencias y evidencias de TLS, HTTP, SSH, SMB, RDP, LDAP y Kerberos
- Configurar/diagnosticar servicios de nombres, dirección y tiempo en topología docente

## Topología y preparación

Client ↔ DNS interno ↔ servidor web de prueba; segmento docente

Direccionamiento del diseño: 10.60.20.0/24; DNS 10.60.20.53; web 10.60.20.80; cliente .10

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Wireshark, tshark, Packet Tracer en modo simulación. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Recoger PCAP propia o revisar dataset sintético etiquetado
- Interpretar consultas y respuestas DNS, SYN/ACK, retransmisión
- Comparar HTTP en claro con TLS sin asumir contenido visible

## Pruebas positivas

- Distingue handshake exitoso y solicitud DNS resuelta

## Controles negativos y fallos para ensayar

- Fallo DNS controlado no se confunde con caída de red

- NXDOMAIN sintético
- Timeout de DNS
- RST TCP

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

- [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html)
- [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html)
- [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html)
- [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html)
- [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/)
- [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html)
- [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html)
- [RFC 8446: Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html)
- [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html)
- [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security)
- [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html)
- [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html)
- [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html)
- [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html)

## Procedencia

Adaptación de la ficha RED-L03 de T5 conservada en investigación. Estimación original: 10 h, incluidas en el recorrido total, no medidas en una ejecución.
