# RED-M28-L01 — Filtros avanzados

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M28-L01","moduleId":"RED-M28","stageId":"RED-E05","objective":"Construir filtros avanzados preservando alcance y reproducibilidad.","prerequisites":["RED-M05-L04","RED-M06-L04","RED-M07-L04","RED-M17-L04"],"referenceIds":["WIRESHARK","CHECKSUM","RFC4120","EV4769","SMB"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M28-L01-Q01","RED-M28-L01-Q02"],"practiceId":"RED-M28-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M28-L01.md"} -->

## 1. Objetivo

Construir filtros avanzados preservando alcance y reproducibilidad.

Prerrequisitos: [RED-M05-L04](../RED-E01/RED-M05-L04.md), [RED-M06-L04](../RED-E01/RED-M06-L04.md), [RED-M07-L04](../RED-E02/RED-M07-L04.md), [RED-M17-L04](../RED-E03/RED-M17-L04.md).

## 2. Comprende el mecanismo

Un filtro visual combina campos y operadores de su lenguaje; paréntesis y tipos importan. En Wireshark, tcp.port == 443 compara cualquier extremo TCP de ese puerto; especificar origen o destino reduce el conjunto. Un tcp.stream identifica una conversación dentro del archivo y análisis, no un identificador universal entre sensores. Guardar filtro, archivo y versión permite reproducir selecciones. Un filtro puede esconder evidencia contraria si se aplica solo a la IP sospechosa sin estudiar respuestas y contexto.

### Vocabulario de apoyo

- **Stream y request ID**: Conversación en un archivo analizado e identificador de petición en un contexto de aplicación.
- **Offload**: Trabajo delegado a la interfaz de red que puede completarse después del punto de captura local.
- **DC y ticket de servicio**: Controlador de dominio y credencial Kerberos para un servicio; no equivalen a autorización final del recurso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Selección docente: ip.addr == 192.0.2.10 && tcp.port == 443. Incluye tráfico del host con ese puerto en cualquiera de los extremos.

No equivale a seleccionar exclusivamente peticiones cuyo destino es 443. La semántica del campo debe corresponder a la pregunta analítica.

## 4. Práctica individual

Quieres estudiar solo TCP con destino 443 del cliente .10. Escribe la intención del filtro sin usar sintaxis de captura.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué significa tcp.port == 443?

- A. Solo destino 443
- B. Solo origen 443
- C. Coincidencia del puerto TCP en cualquiera de los extremos
- D. Todo UDP cifrado

### Pregunta 2

¿Qué identifica tcp.stream con mayor precisión?

- A. Una firma global de malware
- B. Un ID de dispositivo permanente
- C. El mismo usuario en todas las fuentes
- D. Una conversación en el contexto del archivo analizado

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
