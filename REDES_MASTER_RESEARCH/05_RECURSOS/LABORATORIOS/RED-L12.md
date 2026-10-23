# RED-L12 — Diseño de red cloud/híbrida y verificación offline

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible diseño de red cloud/híbrida y verificación offline en un entorno docente controlado.

Módulos: RED-M18, RED-M20, RED-M21, RED-M25. Previos del diseño: RED-M09, RED-M10, RED-M12, RED-M16, RED-M17, RED-M22.

- Diseñar conectividad remota y diagnosticar overlay/underlay
- Diseñar red empresarial escalable con documentación y riesgos
- Aplicar política de mínimos privilegios y validar flujos
- Diseñar conectividad VNet/VPC híbrida y sus fuentes de evidencia

## Topología y preparación

VNet/VPC A ↔ túnel conceptual ↔ LAN B; subnets privadas y pública simulado en diagrama

Direccionamiento del diseño: Cloud 10.60.110.0/24; on-prem 10.60.111.0/24; destino denegado 10.60.112.0/24

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Diagramas versionados, JSON políticas docentes, Cloud opcional solo con permiso de gasto. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Comparar tablas de rutas, firewall/NSG/SG por semántica, sin equivalencias automáticas
- Definir flujos permitidos/denegados y pruebas que exigiríamos
- Registrar cuotas, ruta retorno, registro y modelo de costes como pendientes

## Pruebas positivas

- Rutas/políticas coherentes en modelo revisado con casos trazados

## Controles negativos y fallos para ensayar

- Diseño rechaza movimiento entre segmentos no autorizado

- Ruta por defecto excesiva
- Exposición amplia
- Confusión entre SG/ACL

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

- [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html)
- [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html)
- [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html)
- [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview)
- [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview)

## Procedencia

Adaptación de la ficha RED-L12 de T5 conservada en investigación. Estimación original: 10 h, incluidas en el recorrido total, no medidas en una ejecución.
