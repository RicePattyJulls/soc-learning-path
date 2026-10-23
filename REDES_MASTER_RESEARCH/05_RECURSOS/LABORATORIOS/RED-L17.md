# RED-L17 — Alcance, descubrimiento mínimo y prueba de segmentación Red Team

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible alcance, descubrimiento mínimo y prueba de segmentación red team en un entorno docente controlado.

Módulos: RED-M32, RED-M33, RED-M34. Previos del diseño: RED-M01, RED-M07, RED-M12, RED-M23, RED-M24.

- Definir límites y condiciones de parada de una prueba de red
- Crear inventario de activos y verificar servicios únicamente en lab
- Demostrar el comportamiento de ACL, NAC, Wi-Fi y rutas en lab

## Topología y preparación

Host-auditor → gateway lab → activo WEB 10.60.160.80 y activo ADMIN 10.60.161.50

Direccionamiento del diseño: Rango autorizado 10.60.160.80/32 y 10.60.161.50/32; un máximo de 2 hosts; rangos adicionales prohibidos

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Host Linux de laboratorio, nftables, capturas offline. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Redactar autorización con objetivos, puertos, volumen y parada
- Enumerar de forma mínima sólo destinos autorizados
- Comparar política allow/deny y verificar firewall y PCAP

## Pruebas positivas

- Servicio permitido confirma conexión al único destino autorizado

## Controles negativos y fallos para ensayar

- Puerto o zona prohibida no es accesible y hay evento corroborado

- ROE incompletas
- ACL sombra
- Falta ruta retorno confundida con filtrado

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

- [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)
- [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html)
- [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

## Procedencia

Adaptación de la ficha RED-L17 de T5 conservada en investigación. Estimación original: 16 h, incluidas en el recorrido total, no medidas en una ejecución.
