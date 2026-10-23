# RED-L14 — NetFlow/IPFIX, Zeek, Suricata e IDS/NDR

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible netflow/ipfix, zeek, suricata e ids/ndr en un entorno docente controlado.

Módulos: RED-M27. Previos del diseño: RED-M17, RED-M21, RED-M26.

- Distinguir flujos, alertas y paquetes y reconocer sesgos

## Topología y preparación

PCAP offline → sensor Zeek/Suricata → colector de eventos; exporter IPFIX sintético etiquetado

Direccionamiento del diseño: Origen 10.60.130.10; destino 10.60.130.80; sensor lógico .20

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Zeek, Suricata, Wireshark. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Relacionar 5-tupla y ventanas de tiempo entre flujos y PCAP
- Leer Zeek conn.log y Suricata EVE con campos documentados
- Detectar evento con evidencia independiente y medir silencio por captura parcial

## Pruebas positivas

- Caso conocido genera evento en dataset preparado, campos comprobables

## Controles negativos y fallos para ensayar

- Caso benigno no se clasifica automáticamente como intrusión

- Muestreo incompleto
- No observación TLS contenido
- Diferencia de esquema EVE

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

- [RFC 7011: IP Flow Information Export Protocol](https://www.rfc-editor.org/rfc/rfc7011.html)
- [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html)
- [EVE JSON Output](https://docs.suricata.io/en/latest/output/eve/eve-json-output.html)

## Procedencia

Adaptación de la ficha RED-L14 de T5 conservada en investigación. Estimación original: 14 h, incluidas en el recorrido total, no medidas en una ejecución.
