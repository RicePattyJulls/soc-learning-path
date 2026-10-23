# RED-M28-L02 — TCP/DNS/HTTP/TLS

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M28-L02","moduleId":"RED-M28","stageId":"RED-E05","objective":"Reconstruir una conversación visible y señalar lo cifrado.","prerequisites":["RED-M28-L01"],"referenceIds":["WIRESHARK","CHECKSUM","RFC4120","EV4769","SMB"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M28-L02-Q01","RED-M28-L02-Q02"],"practiceId":"RED-M28-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M28-L02.md"} -->

## 1. Objetivo

Reconstruir una conversación visible y señalar lo cifrado.

Prerrequisitos: [RED-M28-L01](../RED-E05/RED-M28-L01.md).

## 2. Comprende el mecanismo

Compara secuencia TCP, consultas DNS, respuestas HTTP visibles y negociación TLS sin mezclar las garantías de cada protocolo. Una resolución previa no demuestra uso exclusivo de esa IP; una respuesta HTTP no revela por sí sola todo lo que hizo el usuario. Follow stream reúne los datos disponibles, no recupera lo que faltó ni descifra TLS sin material pertinente. En TLS 1.3 y mecanismos de privacidad actuales, el punto pasivo puede perder metadatos que eran visibles en otros contextos. Documenta versión, evidencia y límites.

### Vocabulario de apoyo

- **Stream y request ID**: Conversación en un archivo analizado e identificador de petición en un contexto de aplicación.
- **Offload**: Trabajo delegado a la interfaz de red que puede completarse después del punto de captura local.
- **DC y ticket de servicio**: Controlador de dominio y credencial Kerberos para un servicio; no equivalen a autorización final del recurso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso sintético: DNS positivo; TLS establecido; stream cifrado de 30 KB; no existe registro HTTP descifrado.

Se observa intercambio cifrado con el extremo, pero no el método ni la URL completa. El tamaño no permite reconstruirlos.

## 4. Práctica individual

Añade un proxy autorizado con registro de URL y request ID. ¿Cómo lo relacionarías con la captura?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no recupera Follow stream?

- A. Una selección de esa conversación
- B. Datos que no están disponibles en la captura
- C. La secuencia observada que sí se conserva
- D. Bytes presentes en una sesión sin cifrar

### Pregunta 2

¿Qué queda sin conocer en el caso?

- A. El volumen observado
- B. Que existe un intercambio TLS observado
- C. La presencia de una respuesta DNS
- D. El contenido HTTP y la URL completa

## 6. Aplicación profesional

- SOC: Análisis en profundidad de sesión sospechosa.
- Red Team autorizado: Confirmar visibilidad de ensayo mínimo.
- Evidencia del módulo: Flujos reconstruidos, hechos y límites de visibilidad.
- Criterio del módulo: Localiza evidencia favorable y contraria.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L15](../../05_RECURSOS/LABORATORIOS/RED-L15.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **EV4769**: [4769: A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769). Solicitud de ticket y resultado; nota de actualización de evento desde enero 2025.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
