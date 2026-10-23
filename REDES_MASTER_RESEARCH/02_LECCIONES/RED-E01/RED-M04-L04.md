# RED-M04-L04 — MTU/MSS, fragmentación IPv4 y PMTUD

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M04-L04","moduleId":"RED-M04","stageId":"RED-E01","objective":"Calcular un MSS orientativo y diagnosticar un agujero de PMTU.","prerequisites":["RED-M04-L03"],"referenceIds":["RFC9293","RFC1191","RFC8201","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M04-L04-Q01","RED-M04-L04-Q02"],"practiceId":"RED-M04-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M04-L04.md"} -->

## 1. Objetivo

Calcular un MSS orientativo y diagnosticar un agujero de PMTU.

Prerrequisitos: [RED-M04-L03](../RED-E01/RED-M04-L03.md).

## 2. Comprende el mecanismo

MTU limita el tamaño del paquete que admite un enlace; MSS anuncia una cantidad máxima de datos TCP que el extremo está dispuesto a recibir en un segmento, sin contar cabeceras IP/TCP. Con IPv4 sin opciones y MTU 1500, la referencia habitual es MSS 1460. Opciones y encapsulaciones cambian el presupuesto real. En IPv4 el bit DF y los mensajes ICMP pertinentes participan en PMTUD; en IPv6 los routers no fragmentan en tránsito y Packet Too Big es esencial. Que un ping pequeño funcione no prueba el paso de paquetes grandes.

### Vocabulario de apoyo

- **Handshake**: Intercambio inicial que establece el estado de una conexión.
- **5-tupla**: IP origen, IP destino, puerto origen, puerto destino y protocolo de transporte.
- **MTU, MSS y PMTU**: Máximo paquete de un enlace, máximo dato TCP anunciado y menor MTU del camino, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Camino docente: MTU inicial=1500; túnel reduce PMTU a 1400; handshake funciona; paquetes grandes con DF no avanzan; ICMP necesario filtrado.

El patrón es compatible con un agujero de PMTUD. Revisar MTU efectiva y mensajes de error antes de reducir MSS indiscriminadamente para todas las aplicaciones.

## 4. Práctica individual

Sin opciones ni túneles adicionales, calcula el presupuesto TCP sobre IPv4 para MTU 1400 y explica qué dato real falta.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué excluye el MSS?

- A. Solo la dirección destino
- B. Los datos de aplicación
- C. Todos los bytes del transporte
- D. Las cabeceras IP y TCP

### Pregunta 2

¿Por qué falla la inferencia ping pequeño igual a PMTU correcta?

- A. IPv6 fragmenta en todos los routers
- B. ICMP siempre usa TCP
- C. No prueba el tránsito de paquetes grandes
- D. Los túneles no añaden cabeceras

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
