# RED-L09 — NAT/PAT, VPN y WAN híbrida sin salida externa

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible nat/pat, vpn y wan híbrida sin salida externa en un entorno docente controlado.

Módulos: RED-M17, RED-M18. Previos del diseño: RED-M04, RED-M07, RED-M12.

- Explicar traducciones y las limitaciones para atribuir clientes
- Diseñar conectividad remota y diagnosticar overlay/underlay

## Topología y preparación

LAN-A ↔ FW-A ↔ red tránsito virtual ↔ FW-B ↔ LAN-B

Direccionamiento del diseño: LAN-A 10.60.80.0/24; LAN-B 10.60.81.0/24; tránsito 198.51.100.0/30 (TEST-NET-2: ejemplo documental; sustituir por RFC1918 si se ejecuta)

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: OPNsense VM si hay recursos, FRR y registros IPsec sintéticos para perfil reducido. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Construir mapa NAT antes/después con puertos
- Diseñar y verificar IPsec site-to-site si la plataforma lo permite
- Medir tráfico con y sin túnel y distinguir cifrado de atribución

## Pruebas positivas

- Tráfico permitido por túnel, evidenciado en extremos

## Controles negativos y fallos para ensayar

- Regla denegada rechaza servicio concreto, sin romper túnel

- Regla NAT incorrecta
- Selector de túnel equivocado
- Rutas de retorno faltantes

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

- [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html)
- [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html)
- [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html)
- [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html)

## Procedencia

Adaptación de la ficha RED-L09 de T5 conservada en investigación. Estimación original: 12 h, incluidas en el recorrido total, no medidas en una ejecución.
