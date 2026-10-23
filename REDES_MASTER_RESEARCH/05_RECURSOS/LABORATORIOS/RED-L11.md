# RED-L11 — Wi-Fi corporativo, 802.1X/RADIUS y autenticación

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible wi-fi corporativo, 802.1x/radius y autenticación en un entorno docente controlado.

Módulos: RED-M11, RED-M23, RED-M24. Previos del diseño: RED-M02, RED-M03, RED-M07, RED-M09, RED-M21, RED-M22.

- Distinguir problemas RF, autenticación y direccionamiento WLAN
- Defender acceso de red y demostrar límites por plataforma
- Diagnosticar WPA2/WPA3-Enterprise y segmentación Wi-Fi

## Topología y preparación

Cliente Wi-Fi simulado ↔ AP/controladora simulados ↔ RADIUS ↔ VLAN usuarios/invitados

Direccionamiento del diseño: Corp 10.60.100.0/24; Invitados 10.60.101.0/24; AAA 10.60.109.10

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Packet Tracer: solo lo soportado y etiquetado, registros sintéticos RADIUS/WLAN, hardware propio opcional como ampliación. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Dibujar flujo EAP/802.1X y dependencias RADIUS
- Contrastar aceptación y rechazo de identidad ficticia
- Evaluar fallos de certificado, VLAN asignada y WPA2/3 en distintas capas

## Pruebas positivas

- Acceso de usuario autorizado a VLAN prevista según evidencia de simulación o logs sintéticos

## Controles negativos y fallos para ensayar

- Credenciales/certificado no autorizado no obtiene acceso

- RADIUS inaccesible
- Certificado expirado sintético
- VLAN asignada incorrecta

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

- [IEEE 802.11 Working Group](https://www.ieee802.org/11/)
- [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html)
- [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html)
- [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html)
- [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html)
- [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html)

## Procedencia

Adaptación de la ficha RED-L11 de T5 conservada en investigación. Estimación original: 12 h, incluidas en el recorrido total, no medidas en una ejecución.
