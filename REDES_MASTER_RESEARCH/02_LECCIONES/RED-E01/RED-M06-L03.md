# RED-M06-L03 — SMB y directorio LDAP/Kerberos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M06-L03","moduleId":"RED-M06","stageId":"RED-E01","objective":"Reconocer dependencias SMB/LDAP/Kerberos desde la red.","prerequisites":["RED-M06-L02"],"referenceIds":["RFC8446","RFC9110","RFC4253","RFC4120","SMB","RFC9000"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M06-L03-Q01","RED-M06-L03-Q02"],"practiceId":"RED-M06-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M06-L03.md"} -->

## 1. Objetivo

Reconocer dependencias SMB/LDAP/Kerberos desde la red.

Prerrequisitos: [RED-M06-L02](../RED-E01/RED-M06-L02.md).

## 2. Comprende el mecanismo

SMB sirve recursos y otras funciones; LDAP consulta y modifica directorios; Kerberos utiliza tickets dentro de un modelo de autenticación. Los puertos convencionales ayudan al inventario, pero los servicios pueden usar otras rutas y protecciones. Directorios y Kerberos dependen de resolución de nombres, descubrimiento de servicios y tiempo coherente. LDAP no cifra automáticamente toda consulta por existir el protocolo: distinguir TLS, mecanismos de autenticación y políticas. SMB signing aporta integridad y autenticidad de mensajes, no equivale al cifrado de su contenido.

### Vocabulario de apoyo

- **TLS**: Protocolo de protección del intercambio que incluye negociación y autenticación según configuración.
- **SSH y RDP**: Protocolos utilizados para acceso y administración remota.
- **SMB, LDAP y Kerberos**: Servicios de recursos compartidos, directorio y autenticación mediante tickets, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso sintético: DNS local devuelve DC-A; cliente llega a su puerto; autenticación indica desfase de reloj; hora del cliente=+12 min.

El dato temporal ofrece una causa a investigar en autenticación. Cambiar permisos del recurso SMB no corrige necesariamente el problema de tiempo.

## 4. Práctica individual

El recurso exige confidencialidad y solo se ha comprobado SMB signing. ¿Qué condición falta verificar?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué diferencia signing de cifrado?

- A. Signing no implica confidencialidad del contenido
- B. Son nombres equivalentes de ARP
- C. El cifrado siempre permite leer el payload
- D. Signing elimina la autenticación

### Pregunta 2

¿Qué evidencia debe investigarse primero en el caso?

- A. La lista de recursos publicados como explicación suficiente del desfase
- B. Los permisos del recurso SMB antes de contrastar el error temporal
- C. La política de firma SMB como causa del adelanto del reloj
- D. El desfase temporal y su relación con la autenticación

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
