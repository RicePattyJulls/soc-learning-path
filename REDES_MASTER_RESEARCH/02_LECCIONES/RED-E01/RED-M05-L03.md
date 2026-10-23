# RED-M05-L03 — PCAP y metadatos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M05-L03","moduleId":"RED-M05","stageId":"RED-E01","objective":"Preservar un archivo de captura y sus metadatos de adquisición.","prerequisites":["RED-M05-L02"],"referenceIds":["WIRESHARK","CHECKSUM","RFC8484"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M05-L03-Q01","RED-M05-L03-Q02"],"practiceId":"RED-M05-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M05-L03.md"} -->

## 1. Objetivo

Preservar un archivo de captura y sus metadatos de adquisición.

Prerrequisitos: [RED-M05-L02](../RED-E01/RED-M05-L02.md).

## 2. Comprende el mecanismo

Un PCAP o PCAPNG contiene paquetes y metadatos según formato y herramientas. Conservar su hash permite detectar cambios de bytes; no demuestra autenticidad del origen, precisión del reloj o captura completa. Registra interfaz, sensor, zona horaria, filtro, snaplen, inicio/fin y pérdidas informadas. Un snaplen pequeño puede truncar payload incluso cuando el paquete se guardó. Trabaja sobre una copia, conserva el original y documenta transformaciones; los datos capturados pueden ser sensibles aunque el ejercicio sea técnico.

### Vocabulario de apoyo

- **PCAP/PCAPNG**: Formatos de almacenamiento de paquetes capturados y metadatos.
- **SPAN y TAP**: Espejo de tráfico configurado en un equipo y punto de acceso de observación del enlace, con propiedades diferentes.
- **Snaplen**: Límite de bytes conservados de cada paquete por la captura.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Ficha docente: sensor=S1; snaplen=96; longitud original=1514; longitud capturada=96; SHA-256 calculado al recibir.

El archivo puede estar íntegro desde la recepción y contener paquetes truncados. Hash correcto y cobertura completa son propiedades diferentes.

## 4. Práctica individual

Otro analista exporta solo un stream a un archivo nuevo. Define la trazabilidad mínima de esa derivación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué acredita un hash coincidente?

- A. Que el reloj era exacto
- B. Que coinciden los bytes comparados
- C. Que el origen es auténtico por sí solo
- D. Que todos los paquetes de la red están presentes

### Pregunta 2

¿Qué indica longitud capturada menor que original?

- A. Truncamiento de lo conservado
- B. Cifrado roto
- C. Ausencia de tráfico
- D. Un handshake completo necesariamente

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
