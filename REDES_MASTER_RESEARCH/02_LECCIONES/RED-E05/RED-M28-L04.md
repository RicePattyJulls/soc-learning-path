# RED-M28-L04 — Captura parcial, checksum/offload

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M28-L04","moduleId":"RED-M28","stageId":"RED-E05","objective":"Distinguir artefactos de captura y errores del tráfico real.","prerequisites":["RED-M28-L03"],"referenceIds":["WIRESHARK","CHECKSUM","RFC4120","EV4769","SMB"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M28-L04-Q01","RED-M28-L04-Q02"],"practiceId":"RED-M28-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M28-L04.md"} -->

## 1. Objetivo

Distinguir artefactos de captura y errores del tráfico real.

Prerrequisitos: [RED-M28-L03](../RED-E05/RED-M28-L03.md).

## 2. Comprende el mecanismo

Checksum offload puede hacer que una captura local vea cabeceras antes de que la NIC complete su cálculo, produciendo apariencias de checksum incorrecto. Captura truncada, inicio tardío, segmentación/offload y pérdida del sensor alteran reconstrucción. Estas posibilidades no autorizan ignorar todos los errores: deben contrastarse con otra ubicación y contadores pertinentes. No equiparar pérdida de adquisición con pérdida de red. El archivo y su hash preservan los datos recibidos, no garantizan que reflejen todos los bytes del medio físico.

### Vocabulario de apoyo

- **Stream y request ID**: Conversación en un archivo analizado e identificador de petición en un contexto de aplicación.
- **Offload**: Trabajo delegado a la interfaz de red que puede completarse después del punto de captura local.
- **DC y ticket de servicio**: Controlador de dominio y credencial Kerberos para un servicio; no equivalen a autorización final del recurso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Captura docente local marca checksum saliente inválido; captura en otro punto ve checksum válido para el paquete correlacionado.

La comparación es compatible con offload antes de la transmisión. No evidencia corrupción del paquete en el enlace para ese caso.

## 4. Práctica individual

Ahora ambos puntos muestran errores y aumentan CRC físicos. ¿Qué hipótesis gana relevancia?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué puede provocar checksum aparente inválido en captura local?

- A. El uso de una máscara /24
- B. Siempre un ataque de red
- C. Offload que completa el cálculo después del punto de captura
- D. Todo mensaje TLS

### Pregunta 2

¿Qué favorece la comparación de dos puntos del caso?

- A. Ausencia del paquete transmitido
- B. Un intento de autenticación fallido
- C. Corrupción física demostrada en tránsito
- D. Un artefacto de observación local compatible con offload

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
