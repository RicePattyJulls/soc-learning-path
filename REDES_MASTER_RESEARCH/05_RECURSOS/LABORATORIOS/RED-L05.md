# RED-L05 — Servicios DNS/DHCP/NTP y dependencias AAA

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible servicios dns/dhcp/ntp y dependencias aaa en un entorno docente controlado.

Módulos: RED-M07, RED-M22. Previos del diseño: RED-M02, RED-M03, RED-M05, RED-M06, RED-M09, RED-M12.

- Configurar/diagnosticar servicios de nombres, dirección y tiempo en topología docente
- Separar gestión/control/datos y proteger administración

## Topología y preparación

Clientes ↔ gateway ↔ DNS-DHCP ↔ syslog/servidor horario lógico

Direccionamiento del diseño: 10.60.40.0/24; servicio .53; gateway .1; clientes .100–.150

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Packet Tracer, Linux/servicios de prueba, logs sintéticos. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Identificar cadena DHCP DORA y leases
- Resolver nombre interno y sincronía UTC
- Observar intento administrativo ficticio AAA en registro simulado

## Pruebas positivas

- DHCP asigna dirección y DNS resuelve hostname previsto

## Controles negativos y fallos para ensayar

- DNS en error impide nombre pero no prueba pérdida de IP

- DNS forwarder falla
- Lease agotado
- Reloj fuera de tolerancia

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

- [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html)
- [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html)
- [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html)
- [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html)
- [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html)
- [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html)
- [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)
- [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html)

## Procedencia

Adaptación de la ficha RED-L05 de T5 conservada en investigación. Estimación original: 10 h, incluidas en el recorrido total, no medidas en una ejecución.
