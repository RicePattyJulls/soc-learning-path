# RED-M05-L04 — Primeras consultas DNS/TCP/TLS

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M05-L04","moduleId":"RED-M05","stageId":"RED-E01","objective":"Construir una primera secuencia observable sin atribuir más de lo capturado.","prerequisites":["RED-M05-L03"],"referenceIds":["WIRESHARK","CHECKSUM","RFC8484"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M05-L04-Q01","RED-M05-L04-Q02"],"practiceId":"RED-M05-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M05-L04.md"} -->

## 1. Objetivo

Construir una primera secuencia observable sin atribuir más de lo capturado.

Prerrequisitos: [RED-M05-L03](../RED-E01/RED-M05-L03.md).

## 2. Comprende el mecanismo

Correlaciona consulta/respuesta DNS, establecimiento TCP y negociación TLS por tiempo y extremos. Una respuesta DNS devuelve información, no prueba que el cliente la haya usado. Una conexión a una IP compartida tampoco identifica por sí sola el sitio servido. En TLS algunos metadatos dependen de versión y configuración; el contenido de aplicación permanece cifrado sin material apropiado. El nombre del servidor puede no estar disponible, por ejemplo con mecanismos que protegen el ClientHello. Registra cada inferencia y la evidencia que falta.

### Vocabulario de apoyo

- **PCAP/PCAPNG**: Formatos de almacenamiento de paquetes capturados y metadatos.
- **SPAN y TAP**: Espejo de tráfico configurado en un equipo y punto de acceso de observación del enlace, con propiedades diferentes.
- **Snaplen**: Límite de bytes conservados de cada paquete por la captura.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cronología sintética: 10:00:00 A app.example.test→192.0.2.20; 10:00:01 TCP a .20:443; 10:00:02 intercambio TLS; sin claves.

La secuencia es compatible con acceso al servicio resuelto, pero no revela la URL ni el contenido HTTP cifrado. Para atribuir una acción concreta hace falta corroboración.

## 4. Práctica individual

Añade otra aplicación del mismo host que contacte la misma IP. ¿Qué fuente pedirías para distinguir los procesos?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta la respuesta DNS por sí sola?

- A. Una respuesta a una consulta, no prueba de uso posterior
- B. Un permiso de autenticación
- C. La identidad del proceso remoto
- D. La URL completa visitada

### Pregunta 2

¿Qué falta para conocer la URL del caso?

- A. Evidencia adicional del contenido de aplicación
- B. Una tabla MAC distinta
- C. Una máscara IPv4 más corta
- D. El TTL del switch

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
