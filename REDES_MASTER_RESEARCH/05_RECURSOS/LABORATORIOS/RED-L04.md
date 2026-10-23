# RED-L04 — Switching, VLAN, trunks 802.1Q, STP y LACP

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible switching, vlan, trunks 802.1q, stp y lacp en un entorno docente controlado.

Módulos: RED-M08, RED-M09, RED-M10. Previos del diseño: RED-M01, RED-M02.

- Reconstruir conectividad capa 2 e interpretar MAC table y LLDP
- Diseñar y verificar segmentación L2/L3 básica
- Diagnosticar redundancia de campus sin bucles ni blackholes

## Topología y preparación

SW-ACC1 ↔ SW-DIST ↔ SW-ACC2; PC-FIN y PC-HR en VLAN separadas; 3 enlaces redundantes en topología virtual

Direccionamiento del diseño: VLAN10 10.60.30.0/24; VLAN20 10.60.31.0/24; VLAN99 gestión 10.60.39.0/24

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Packet Tracer donde aplique, CML-Free versión reducida ≤5 nodos. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Documentar tabla MAC y tags
- Configurar VLAN, trunk y root STP previsto
- Verificar agregación LACP disponible y forzar un fallo de enlace

## Pruebas positivas

- VLAN correcta y convergencia tras pérdida de enlace

## Controles negativos y fallos para ensayar

- Un cliente de VLAN10 no atraviesa L2 hacia VLAN20 sin routing

- VLAN nativa discordante
- Raíz STP errónea
- Puerto LACP suspendido

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

- [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html)
- [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html)
- [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html)
- [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html)
- [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html)

## Procedencia

Adaptación de la ficha RED-L04 de T5 conservada en investigación. Estimación original: 12 h, incluidas en el recorrido total, no medidas en una ejecución.
