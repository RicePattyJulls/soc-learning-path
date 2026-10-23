# RED-M04-L02 — Handshake, estados y ventanas

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M04-L02","moduleId":"RED-M04","stageId":"RED-E01","objective":"Interpretar handshake y ventanas sin confundir negociación con salud completa.","prerequisites":["RED-M04-L01"],"referenceIds":["RFC9293","RFC1191","RFC8201","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M04-L02-Q01","RED-M04-L02-Q02"],"practiceId":"RED-M04-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M04-L02.md"} -->

## 1. Objetivo

Interpretar handshake y ventanas sin confundir negociación con salud completa.

Prerrequisitos: [RED-M04-L01](../RED-E01/RED-M04-L01.md).

## 2. Comprende el mecanismo

SYN, SYN/ACK y ACK forman el establecimiento TCP habitual. Los números de secuencia y confirmación permiten ordenar bytes; el SYN consume un número de secuencia. La ventana anunciada limita cuánto puede recibir el extremo, mientras el control de congestión considera el camino; no son la misma ventana. Una ventana cero indica que el receptor no anuncia capacidad disponible en ese momento. Un handshake correcto no garantiza que el servidor complete una petición después ni que el camino soporte paquetes mayores.

### Vocabulario de apoyo

- **Handshake**: Intercambio inicial que establece el estado de una conexión.
- **5-tupla**: IP origen, IP destino, puerto origen, puerto destino y protocolo de transporte.
- **MTU, MSS y PMTU**: Máximo paquete de un enlace, máximo dato TCP anunciado y menor MTU del camino, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Secuencia docente: C SYN seq=100; S SYN/ACK seq=500 ack=101; C ACK ack=501; más tarde S anuncia win=0.

Las confirmaciones incluyen los SYN. La ventana cero apunta al extremo receptor y su capacidad de recibir; no demuestra por sí sola pérdida de enlace.

## 4. Práctica individual

El servidor vuelve a anunciar ventana positiva y la transferencia continúa. Explica qué hipótesis gana apoyo.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué confirma ack=101 frente a SYN seq=100?

- A. Cien bytes de HTTP obligatorios
- B. Una dirección IPv6
- C. El SYN, que consume un número de secuencia
- D. La autenticación del usuario

### Pregunta 2

¿Qué significa win=0 en el caso?

- A. El receptor no anuncia espacio disponible en ese momento
- B. El enlace físico está necesariamente caído
- C. El handshake nunca ocurrió
- D. El puerto cambió de UDP a TCP

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
