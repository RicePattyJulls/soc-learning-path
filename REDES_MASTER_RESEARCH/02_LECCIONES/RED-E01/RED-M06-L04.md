# RED-M06-L04 — Qué revela u oculta el cifrado

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M06-L04","moduleId":"RED-M06","stageId":"RED-E01","objective":"Describir la visibilidad de una sesión cifrada con precisión.","prerequisites":["RED-M06-L03"],"referenceIds":["RFC8446","RFC9110","RFC4253","RFC4120","SMB","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M06-L04-Q01","RED-M06-L04-Q02"],"practiceId":"RED-M06-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M06-L04.md"} -->

## 1. Objetivo

Describir la visibilidad de una sesión cifrada con precisión.

Prerrequisitos: [RED-M06-L03](../RED-E01/RED-M06-L03.md).

## 2. Comprende el mecanismo

Cifrar el payload no elimina necesariamente metadatos como extremos, volumen, duración y algunas propiedades de negociación. Esos datos pueden apoyar hipótesis, no demostrar la acción de un usuario. TLS 1.3, QUIC y mecanismos de protección de nombres reducen visibilidad de maneras diferentes. Un proxy con terminación TLS ve otro contexto que un sensor pasivo antes del proxy; además, proxy y backend pueden tener conexiones distintas. No tratar el payload ausente como vacío ni la IP de un CDN como atribución exclusiva.

### Vocabulario de apoyo

- **TLS**: Protocolo de protección del intercambio que incluye negociación y autenticación según configuración.
- **SSH y RDP**: Protocolos utilizados para acceso y administración remota.
- **SMB, LDAP y Kerberos**: Servicios de recursos compartidos, directorio y autenticación mediante tickets, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Registro docente: IP compartida, 2 MB enviados, conexión TLS, sin contenido de aplicación ni eventos de endpoint.

El volumen está observado, pero su significado sigue abierto: actualización, copia autorizada u otra actividad. No hay base para afirmar exfiltración solo con ese registro.

## 4. Práctica individual

Define dos evidencias complementarias para contrastar transferencia legítima frente a salida de datos no autorizada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué puede seguir siendo visible con TLS?

- A. La identidad física del usuario obligatoriamente
- B. Todas las contraseñas en claro
- C. Extremos, tiempos y tamaños según el punto de observación
- D. La URL completa siempre

### Pregunta 2

¿Qué demuestra por sí solo el volumen del caso?

- A. Un proceso malicioso identificado
- B. La cantidad observada de tráfico, no su intención
- C. Una copia autorizada confirmada
- D. Exfiltración confirmada

## 6. Aplicación profesional

- SOC: Comprender contexto de conexiones en investigación.
- Red Team autorizado: Reconocer servicios expuestos sin explotarlos.
- Evidencia del módulo: Diagrama de dependencias y hechos/hipótesis etiquetados.
- Criterio del módulo: Distingue negociación visible de contenido inaccesible.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L03](../../05_RECURSOS/LABORATORIOS/RED-L03.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC8446**: [RFC 8446: Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html). Protección TLS y límites de observación pasiva.
- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
