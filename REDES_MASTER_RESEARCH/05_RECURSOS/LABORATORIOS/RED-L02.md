# RED-L02 — IPv6, Neighbor Discovery y MTU de extremo a extremo

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible ipv6, neighbor discovery y mtu de extremo a extremo en un entorno docente controlado.

Módulos: RED-M03, RED-M04. Previos del diseño: RED-M01, RED-M02.

- Planificar prefijos IPv6 y resolver fallos de vecindad/autoconfiguración
- Separar fallo de red, transporte y aplicación con trazas observables

## Topología y preparación

Host-v6 A ↔ router ↔ Host-v6 B; único dominio docente

Direccionamiento del diseño: 2001:db8:60:10::/64 y 2001:db8:60:11::/64; MTU declarada 1500 B, variación de MTU en un salto

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Packet Tracer, Wireshark. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Configurar GUA, link-local y ruta IPv6
- Describir SLAAC, RA, DAD y ND con observación
- Comparar tamaño de paquetes, PMTUD e ICMPv6

## Pruebas positivas

- Conectividad IPv6 y explicación comprobable de RA/ND

## Controles negativos y fallos para ensayar

- RA ausente o filtrado con diagnóstico; el host no obtiene el prefijo previsto

- RA inaccesible
- ICMPv6 esencial bloqueado
- MTU incorrecta

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

- [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html)
- [RFC 8200: Internet Protocol, Version 6](https://www.rfc-editor.org/rfc/rfc8200.html)
- [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861.html)
- [RFC 4862: IPv6 Stateless Address Autoconfiguration](https://www.rfc-editor.org/rfc/rfc4862.html)
- [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html)
- [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html)
- [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html)
- [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html)

## Procedencia

Adaptación de la ficha RED-L02 de T5 conservada en investigación. Estimación original: 8 h, incluidas en el recorrido total, no medidas en una ejecución.
