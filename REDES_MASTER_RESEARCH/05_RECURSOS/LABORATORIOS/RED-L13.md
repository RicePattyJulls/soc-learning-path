# RED-L13 — Telemetría Syslog/SNMP, UTC y calidad de observación

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible telemetría syslog/snmp, utc y calidad de observación en un entorno docente controlado.

Módulos: RED-M26. Previos del diseño: RED-M05, RED-M07, RED-M22.

- Explicar producción y calidad de logs y métricas de red

## Topología y preparación

RTR1/SW1 → colector Syslog + fuente SNMP; reloj lógico compartido

Direccionamiento del diseño: Gestión 10.60.120.0/24; collector 10.60.120.10; router .1

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Linux syslog, tshark, logs sintéticos versionados. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Comparar timestamps evento/ingesta y normalizar a UTC
- Registrar origen, severidad, pérdida y duplicados
- Contrastar SNMP polling frente a traps y límites de autenticación

## Pruebas positivas

- Se correlaciona un cambio de estado de interfaz con dos fuentes

## Controles negativos y fallos para ensayar

- Se elimina falso duplicado sin borrar evento único

- Desfase reloj
- Campos ausentes
- Duplicación por reenvío

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

- [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424.html)
- [RFC 3414: User-based Security Model for SNMPv3](https://www.rfc-editor.org/rfc/rfc3414.html)
- [RFC 3416: Protocol Operations for SNMP](https://www.rfc-editor.org/rfc/rfc3416.html)
- [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html)

## Procedencia

Adaptación de la ficha RED-L13 de T5 conservada en investigación. Estimación original: 10 h, incluidas en el recorrido total, no medidas en una ejecución.
