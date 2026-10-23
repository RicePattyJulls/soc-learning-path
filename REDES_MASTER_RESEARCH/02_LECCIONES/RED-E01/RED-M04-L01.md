# RED-M04-L01 — TCP y UDP

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M04-L01","moduleId":"RED-M04","stageId":"RED-E01","objective":"Elegir transporte según sus garantías y sus límites.","prerequisites":["RED-M01-L04","RED-M02-L04"],"referenceIds":["RFC9293","RFC1191","RFC8201","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M04-L01-Q01","RED-M04-L01-Q02"],"practiceId":"RED-M04-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M04-L01.md"} -->

## 1. Objetivo

Elegir transporte según sus garantías y sus límites.

Prerrequisitos: [RED-M01-L04](../RED-E01/RED-M01-L04.md), [RED-M02-L04](../RED-E01/RED-M02-L04.md).

## 2. Comprende el mecanismo

TCP ofrece a la aplicación un flujo ordenado de bytes con mecanismos de retransmisión y control de flujo; no conserva los límites de mensajes que la aplicación escribe. UDP conserva datagramas pero no incorpora por sí mismo establecimiento fiable, reordenación o retransmisión. Las aplicaciones pueden construir esas funciones encima: QUIC emplea UDP y no por eso carece de fiabilidad. Los puertos ayudan a identificar extremos de transporte, pero un número conocido no prueba qué aplicación o usuario está actuando.

### Vocabulario de apoyo

- **Handshake**: Intercambio inicial que establece el estado de una conexión.
- **5-tupla**: IP origen, IP destino, puerto origen, puerto destino y protocolo de transporte.
- **MTU, MSS y PMTU**: Máximo paquete de un enlace, máximo dato TCP anunciado y menor MTU del camino, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Traza docente: cliente envía UDP/53; no hay respuesta observada. Otra sesión TCP/443 completa handshake y recibe datos.

El silencio UDP no demuestra puerto cerrado ni servicio inexistente. La sesión TCP confirma intercambio en ese camino, sin probar el éxito funcional de la aplicación.

## 4. Práctica individual

¿Qué evidencia adicional pedirías para distinguir pérdida de respuesta DNS de una solicitud que nunca llegó al resolver?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué unidad conserva UDP?

- A. Datagramas
- B. Paquetes siempre retransmitidos
- C. Sesiones autenticadas de usuario
- D. Un flujo de bytes necesariamente ordenado

### Pregunta 2

¿Qué permite concluir el silencio UDP observado?

- A. El puerto está cerrado con certeza
- B. No se observó una respuesta en ese punto e intervalo
- C. TCP está bloqueado en toda la red
- D. El resolver fue eliminado

## 6. Aplicación profesional

- SOC: Discriminar anomalías y degradación.
- Red Team autorizado: Estimar alcance real de comunicaciones.
- Evidencia del módulo: Filtros, secuencia TCP, hipótesis y límites.
- Criterio del módulo: Distingue pérdida, reset, bloqueo y no observabilidad.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L02](../../05_RECURSOS/LABORATORIOS/RED-L02.md)
- [Guía de laboratorio RED-L03](../../05_RECURSOS/LABORATORIOS/RED-L03.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC9293**: [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html). Bytes, handshake, secuencias, ventanas y estados TCP.
- **RFC1191**: [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html). PMTUD IPv4 y mensajes de error.
- **RFC8201**: [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html). PMTU e ICMPv6 Packet Too Big.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
