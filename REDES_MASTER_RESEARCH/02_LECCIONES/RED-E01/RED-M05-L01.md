# RED-M05-L01 — Captura frente a filtro visual

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M05-L01","moduleId":"RED-M05","stageId":"RED-E01","objective":"Elegir filtros sin eliminar evidencia necesaria antes de guardarla.","prerequisites":["RED-M01-L04","RED-M02-L04","RED-M04-L04"],"referenceIds":["WIRESHARK","CHECKSUM","RFC8484"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M05-L01-Q01","RED-M05-L01-Q02"],"practiceId":"RED-M05-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M05-L01.md"} -->

## 1. Objetivo

Elegir filtros sin eliminar evidencia necesaria antes de guardarla.

Prerrequisitos: [RED-M01-L04](../RED-E01/RED-M01-L04.md), [RED-M02-L04](../RED-E01/RED-M02-L04.md), [RED-M04-L04](../RED-E01/RED-M04-L04.md).

## 2. Comprende el mecanismo

Un filtro de captura decide qué se conserva; un filtro de visualización decide qué se muestra de lo conservado. Sus lenguajes no son intercambiables: una expresión de captura como tcp port 443 no es equivalente sintácticamente a tcp.port == 443 en Wireshark. Aplicar después un filtro visual más amplio no recupera paquetes excluidos durante la captura. Define la pregunta y la privacidad requerida antes de capturar y conserva una copia original del archivo para poder repetir interpretaciones.

### Vocabulario de apoyo

- **PCAP/PCAPNG**: Formatos de almacenamiento de paquetes capturados y metadatos.
- **SPAN y TAP**: Espejo de tráfico configurado en un equipo y punto de acceso de observación del enlace, con propiedades diferentes.
- **Snaplen**: Límite de bytes conservados de cada paquete por la captura.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Escenario docente: el host realiza consultas DNS convencionales por UDP/TCP 53. La captura usa tcp port 443; después se intenta buscar dns en ese archivo.

El filtro excluye las consultas del escenario y un filtro visual posterior no puede recuperarlas. Esto no significa que toda resolución use el puerto 53: DNS cifrado puede utilizar otros transportes. La ausencia del archivo describe el alcance de adquisición, no ausencia de resolución en la red.

## 4. Práctica individual

Diseña una adquisición que permita estudiar DNS y TCP del host autorizado sin capturar todo el segmento.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué filtro puede excluir paquetes del archivo definitivamente?

- A. El de captura
- B. El de visualización sin modificar el archivo guardado
- C. Una selección de stream sin exportar ni sobrescribir el original
- D. Ordenar la lista de paquetes por fecha

### Pregunta 2

¿Por qué no aparecen las consultas DNS convencionales UDP/TCP 53 del escenario?

- A. La ausencia en el archivo demuestra que nunca se consultó DNS
- B. Un filtro visual dns puede recuperar paquetes que no se guardaron
- C. Toda resolución DNS viaja dentro de TCP/443
- D. El filtro de captura tcp port 443 las excluyó

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
