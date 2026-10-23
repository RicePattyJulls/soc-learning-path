# RED-M04-L03 — Retransmisiones y resets

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M04-L03","moduleId":"RED-M04","stageId":"RED-E01","objective":"Investigar retransmisiones y resets usando el contexto de la captura.","prerequisites":["RED-M04-L02"],"referenceIds":["RFC9293","RFC1191","RFC8201","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M04-L03-Q01","RED-M04-L03-Q02"],"practiceId":"RED-M04-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M04-L03.md"} -->

## 1. Objetivo

Investigar retransmisiones y resets usando el contexto de la captura.

Prerrequisitos: [RED-M04-L02](../RED-E01/RED-M04-L02.md).

## 2. Comprende el mecanismo

Una retransmisión es compatible con pérdida de datos o de confirmaciones, pero una etiqueta del analizador también depende de qué paquetes vio. Capturar solo una dirección o empezar tarde puede producir diagnósticos incompletos. RST aborta o rechaza una conexión según su estado; puede originarse en un extremo o en un intermediario. La IP de origen del RST no basta para demostrar qué proceso lo generó. Comparar números de secuencia, dirección, instante y registros del extremo reduce hipótesis.

### Vocabulario de apoyo

- **Handshake**: Intercambio inicial que establece el estado de una conexión.
- **5-tupla**: IP origen, IP destino, puerto origen, puerto destino y protocolo de transporte.
- **MTU, MSS y PMTU**: Máximo paquete de un enlace, máximo dato TCP anunciado y menor MTU del camino, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Traza sintética: SYN al servidor; RST/ACK inmediato; no existe SYN/ACK observado. Firewall registra reject para esa misma 5-tupla.

El reject corroborado apoya la actuación del firewall como explicación de ese intento. Sin ese registro, también cabría un destino sin servicio escuchando.

## 4. Práctica individual

Una captura empieza después del handshake y marca segmentos como fuera de orden. Indica una limitación y una nueva medida.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué se necesita antes de atribuir un RST a un proceso concreto?

- A. Leer solo su IP de origen
- B. Cambiar todos los puertos a UDP
- C. Corroborar con estado y registros del extremo o intermediario
- D. Ignorar números de secuencia

### Pregunta 2

¿Qué fortalece la hipótesis de rechazo del firewall?

- A. El uso de HTTP en otro host
- B. El nombre comercial del servidor
- C. Una captura de otra semana
- D. Un registro reject coincidente en tiempo y 5-tupla

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
