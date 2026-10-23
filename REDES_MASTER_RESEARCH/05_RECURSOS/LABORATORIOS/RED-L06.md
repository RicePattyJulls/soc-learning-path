# RED-L06 — Enrutamiento estático y OSPFv2/OSPFv3

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible enrutamiento estático y ospfv2/ospfv3 en un entorno docente controlado.

Módulos: RED-M12, RED-M13. Previos del diseño: RED-M02, RED-M03, RED-M09.

- Predecir la ruta seleccionada y reparar ausencia de ruta de retorno
- Configurar y diagnosticar OSPF y justificar uso de áreas

## Topología y preparación

R1—R2—R3; dos LAN de extremos; versiones IPv4 e IPv6

Direccionamiento del diseño: Tránsitos 10.60.50.0/30 y 10.60.50.4/30; LAN 10.60.51.0/24 y 10.60.52.0/24; IPv6 2001:db8:60:50::/64 etc.

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: FRRouting, Containerlab, CML-Free max 5 nodos. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Comparar ruta estática, LPM y adyacencias OSPF
- Demostrar LSDB, ruta, vecino, coste y red de retorno
- Cambiar área/coste controlado y diagnosticar convergencia

## Pruebas positivas

- R1 llega LAN R3 con ruta esperada para IPv4/v6

## Controles negativos y fallos para ensayar

- Area mismatch provoca ausencia de vecino y se diagnostica

- Area mismatch
- ID duplicado
- MTU inconsistente
- Route feedback

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

- [STATIC](https://docs.frrouting.org/en/latest/static.html)
- [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html)
- [OSPFv2](https://docs.frrouting.org/en/latest/ospfd.html)
- [OSPFv3](https://docs.frrouting.org/en/latest/ospf6d.html)

## Procedencia

Adaptación de la ficha RED-L06 de T5 conservada en investigación. Estimación original: 14 h, incluidas en el recorrido total, no medidas en una ejecución.
