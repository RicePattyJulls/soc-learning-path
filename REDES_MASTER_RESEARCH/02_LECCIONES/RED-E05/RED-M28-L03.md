# RED-M28-L03 — SMB/Kerberos visibles

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M28-L03","moduleId":"RED-M28","stageId":"RED-E05","objective":"Interpretar señales SMB/Kerberos sin equiparar red e identidad.","prerequisites":["RED-M28-L02"],"referenceIds":["WIRESHARK","CHECKSUM","RFC4120","EV4769","SMB"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M28-L03-Q01","RED-M28-L03-Q02"],"practiceId":"RED-M28-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M28-L03.md"} -->

## 1. Objetivo

Interpretar señales SMB/Kerberos sin equiparar red e identidad.

Prerrequisitos: [RED-M28-L02](../RED-E05/RED-M28-L02.md).

## 2. Comprende el mecanismo

El puerto y patrón de un protocolo pueden orientar investigación, pero no equivalen a un evento de autenticación del directorio. Kerberos protege partes de sus intercambios y SMB puede tener firma o cifrado; la visibilidad depende de configuración y punto. Para corroborar actividad de identidad, relaciona eventos del DC o endpoint con tiempos, servicios y activos. Un evento 4769 trata una solicitud de ticket de servicio según su semántica; no es idéntico a un flujo a un puerto ni prueba que el ticket se usara con éxito.

### Vocabulario de apoyo

- **Stream y request ID**: Conversación en un archivo analizado e identificador de petición en un contexto de aplicación.
- **Offload**: Trabajo delegado a la interfaz de red que puede completarse después del punto de captura local.
- **DC y ticket de servicio**: Controlador de dominio y credencial Kerberos para un servicio; no equivalen a autorización final del recurso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: tráfico hacia Kerberos, un evento 4769 de solicitud de ticket de servicio con Status=0x0 (éxito) y un flujo SMB posterior; no hay registro del resultado del acceso al recurso.

El resultado de éxito respalda la emisión del ticket en este caso; el ID 4769 sin su resultado también puede representar un fallo. Ni ticket ni flujo SMB prueban por sí solos que el recurso aceptara la operación. Corroborar autorización y resultado en el recurso antes de afirmar éxito.

## 4. Práctica individual

El recurso registra denegación de permisos. ¿Cómo debe cambiar el informe de la secuencia?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no demuestra emitir un ticket por sí solo?

- A. Una etapa del proceso de autenticación
- B. Necesidad de analizar su contexto
- C. Acceso exitoso al recurso final
- D. Una actividad de ticket según el evento

### Pregunta 2

¿Qué estado falta confirmar en el caso?

- A. La existencia del flujo observado
- B. El orden propuesto de la hipótesis
- C. Resultado del acceso al recurso
- D. La presencia del registro de ticket

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
