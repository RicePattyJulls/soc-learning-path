# RED-M05-L02 — Interfaces y puntos de observación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M05-L02","moduleId":"RED-M05","stageId":"RED-E01","objective":"Evaluar qué tráfico es visible desde cada punto de observación.","prerequisites":["RED-M05-L01"],"referenceIds":["WIRESHARK","CHECKSUM","RFC8484"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M05-L02-Q01","RED-M05-L02-Q02"],"practiceId":"RED-M05-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M05-L02.md"} -->

## 1. Objetivo

Evaluar qué tráfico es visible desde cada punto de observación.

Prerrequisitos: [RED-M05-L01](../RED-E01/RED-M05-L01.md).

## 2. Comprende el mecanismo

Una captura local ve lo que atraviesa la interfaz capturada, con efectos del sistema y del offload. En un switch, conectar un analizador a cualquier puerto no permite ver automáticamente conversaciones entre otros puertos. SPAN replica tráfico seleccionado; puede perder paquetes por sobresuscripción y no sustituye una garantía de captura completa. RSPAN transporta el espejo en una VLAN y ERSPAN usa encapsulación IP/GRE, según implementación. Un TAP y un espejo tienen propiedades operativas diferentes; documentar ubicación y direcciones observadas importa tanto como el filtro.

### Vocabulario de apoyo

- **PCAP/PCAPNG**: Formatos de almacenamiento de paquetes capturados y metadatos.
- **SPAN y TAP**: Espejo de tráfico configurado en un equipo y punto de acceso de observación del enlace, con propiedades diferentes.
- **Snaplen**: Límite de bytes conservados de cada paquete por la captura.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Enlace observado=10 Gb/s; puerto de espejo=1 Gb/s; captura registra huecos durante picos.

La capacidad del espejo puede explicar pérdida de visibilidad. Es incorrecto contar esos huecos como paquetes necesariamente perdidos en el enlace de producción.

## 4. Práctica individual

Necesitas comprobar tráfico entre dos VMs del mismo hipervisor. Explica por qué un espejo del uplink físico puede ser insuficiente.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué permite ver un puerto normal de switch?

- A. La memoria de otras máquinas
- B. Todas las conversaciones del campus siempre
- C. El contenido TLS descifrado
- D. El tráfico que recibe o envía según el funcionamiento del switch

### Pregunta 2

¿Qué limita el espejo 10 Gb/s hacia 1 Gb/s?

- A. La desaparición del routing
- B. La resolución de direcciones IPv6
- C. Posible sobresuscripción y pérdida en la observación
- D. La autenticación de usuarios

## 6. Aplicación profesional

- SOC: Preparar base de investigación PCAP.
- Red Team autorizado: Comprobar telemetría generada por actividad autorizada.
- Evidencia del módulo: Archivo origen, hash, filtros y hallazgos observables.
- Criterio del módulo: Reproduce filtros, conserva original y declara límites.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L03](../../05_RECURSOS/LABORATORIOS/RED-L03.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC8484**: [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html). DNS sobre HTTPS; evita asumir que toda resolución DNS usa UDP/TCP 53.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
