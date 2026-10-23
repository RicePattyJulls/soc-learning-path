# RED-L15 — Investigación SOC de PCAP con hipótesis y atribución

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible investigación soc de pcap con hipótesis y atribución en un entorno docente controlado.

Módulos: RED-M28, RED-M29. Previos del diseño: RED-M05, RED-M06, RED-M07, RED-M17, RED-M26, RED-M27.

- Interpretar sesiones y artefactos de red sin sobreafirmar
- Investigar hipótesis alternativas y escalar con grado de confianza

## Topología y preparación

PCAP + DNS + DHCP + NAT + endpoint sintéticos de dos intervalos

Direccionamiento del diseño: IPs 10.60.140.10/24, 10.60.140.11/24; NAT a 198.51.100.10 con puertos y UTC

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Wireshark, Zeek offline, dataset sintético propio por crear. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Crear línea temporal UTC y atribución NAT con lease
- Diferenciar DNS anómalo, backup y transferencia no confirmada
- Documentar hipótesis benigna alternativa y evidencia desfavorable

## Pruebas positivas

- Asigna IP interna con puerto+tiempo o declara insuficiencia sin suplantar certeza

## Controles negativos y fallos para ensayar

- No acusa exfiltración solo por bytes elevados

- Falta puerto NAT
- Lease solapado
- Sensor en lugar equivocado

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

- [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/)
- [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html)
- [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html)
- [4769: A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security)
- [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [dns.log](https://docs.zeek.org/en/current/reference/logs/dns.html)
- [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html)

## Procedencia

Adaptación de la ficha RED-L15 de T5 conservada en investigación. Estimación original: 14 h, incluidas en el recorrido total, no medidas en una ejecución.
