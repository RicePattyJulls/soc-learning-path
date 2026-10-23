# RED-M06-L01 — HTTP/HTTPS y TLS

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M06-L01","moduleId":"RED-M06","stageId":"RED-E01","objective":"Separar semántica HTTP, protección TLS y éxito de aplicación.","prerequisites":["RED-M04-L04","RED-M05-L04"],"referenceIds":["RFC8446","RFC9110","RFC4253","RFC4120","SMB","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M06-L01-Q01","RED-M06-L01-Q02"],"practiceId":"RED-M06-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M06-L01.md"} -->

## 1. Objetivo

Separar semántica HTTP, protección TLS y éxito de aplicación.

Prerrequisitos: [RED-M04-L04](../RED-E01/RED-M04-L04.md), [RED-M05-L04](../RED-E01/RED-M05-L04.md).

## 2. Comprende el mecanismo

HTTP define métodos, recursos y respuestas. HTTPS protege su intercambio mediante TLS; la negociación debe considerar identidad del servidor y confianza, no solo presencia de cifrado. TLS 1.3 cambia qué mensajes son visibles frente a versiones anteriores; no se debe prometer observar todos los certificados en cualquier captura pasiva. HTTP/2 puede multiplexar streams y HTTP/3 funciona sobre QUIC, habitualmente UDP: filtrar solo TCP/443 no cubre toda la navegación moderna. Un código de estado informa sobre una petición, no sobre la integridad de todo el servicio.

### Vocabulario de apoyo

- **TLS**: Protocolo de protección del intercambio que incluye negociación y autenticación según configuración.
- **SSH y RDP**: Protocolos utilizados para acceso y administración remota.
- **SMB, LDAP y Kerberos**: Servicios de recursos compartidos, directorio y autenticación mediante tickets, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: DNS correcto; TCP establecido; cliente rechaza certificado por nombre distinto al solicitado.

Hay conectividad de transporte, pero falla la comprobación de identidad del servidor. Desactivar validación ocultaría el problema y debilitaría la seguridad.

## 4. Práctica individual

El mismo nombre funciona en un cliente y falla por certificado en otro. Propón evidencia que discrimine configuración de confianza y conectividad.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué comprueba el nombre del certificado?

- A. El ancho de banda del enlace
- B. La MAC del gateway
- C. Su correspondencia con la identidad de servidor solicitada
- D. La contraseña del usuario

### Pregunta 2

¿Qué tráfico puede quedar fuera al capturar solo TCP/443?

- A. ARP incluido en TCP
- B. HTTP/3 sobre QUIC/UDP
- C. Todo HTTP/1.1 sobre TCP
- D. Las ventanas de recepción TCP

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
