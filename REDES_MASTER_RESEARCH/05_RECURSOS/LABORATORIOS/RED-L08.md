# RED-L08 — Gateway redundante, QoS y diagnóstico de convergencia

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible gateway redundante, qos y diagnóstico de convergencia en un entorno docente controlado.

Módulos: RED-M16, RED-M19, RED-M39. Previos del diseño: RED-M04, RED-M09, RED-M10, RED-M12, RED-M18, RED-M26, RED-M27.

- Diseñar recuperación cuando falla enlace o gateway
- Justificar decisiones de rendimiento con mediciones
- Encontrar causa raíz con hipótesis y métricas de red

## Topología y preparación

GW-A y GW-B ↔ LAN cliente, enlace WAN con limitación controlada

Direccionamiento del diseño: LAN 10.60.70.0/24; gateway virtual previsto .1; WAN 10.60.71.0/30

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: CML-Free ≤5 nodos si compatible, FRRouting/Linux para alternativa funcional y no equivalencia. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Establecer baseline RTT/pérdida/jitter internos
- Cambiar gateway activo y medir convergencia
- Comparar política QoS propuesta con latencia y colas observadas

## Pruebas positivas

- Tras fallo simulado se restablece tráfico y se documenta intervalo medido, sin umbral fingido

## Controles negativos y fallos para ensayar

- Gateway mal anunciado causa fallo que el estudiante detecta

- FHRP mal configurado
- WAN congestionada
- Ruta asimétrica

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

- [RFC 9568: Virtual Router Redundancy Protocol Version 3](https://www.rfc-editor.org/rfc/rfc9568.html)
- [RFC 5880: Bidirectional Forwarding Detection](https://www.rfc-editor.org/rfc/rfc5880.html)
- [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html)
- [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html)
- [RFC 3376: Internet Group Management Protocol Version 3](https://www.rfc-editor.org/rfc/rfc3376.html)
- [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/)

## Procedencia

Adaptación de la ficha RED-L08 de T5 conservada en investigación. Estimación original: 10 h, incluidas en el recorrido total, no medidas en una ejecución.
