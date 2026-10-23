# RED-M26-L01 — Syslog y facility/severity

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M26-L01","moduleId":"RED-M26","stageId":"RED-E05","objective":"Interpretar prioridad Syslog y conservar el origen del evento.","prerequisites":["RED-M05-L04","RED-M07-L04","RED-M22-L04"],"referenceIds":["RFC5424","RFC3414","RFC3416","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M26-L01-Q01","RED-M26-L01-Q02"],"practiceId":"RED-M26-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M26-L01.md"} -->

## 1. Objetivo

Interpretar prioridad Syslog y conservar el origen del evento.

Prerrequisitos: [RED-M05-L04](../RED-E01/RED-M05-L04.md), [RED-M07-L04](../RED-E02/RED-M07-L04.md), [RED-M22-L04](../RED-E04/RED-M22-L04.md).

## 2. Comprende el mecanismo

Syslog transporta mensajes con elementos de cabecera y contenido según formato. En RFC 5424, PRI combina facility y severity: PRI = facility × 8 + severity. Severity 0 es más urgente que 7 en esa escala; no es un nivel automático de malicia. El emisor, forwarder y colector pueden ser entidades diferentes. Guarda mensaje original, parser y transformaciones para distinguir el dato emitido de lo añadido durante ingestión. No presentar cada registro como si hubiera nacido directamente en el SIEM.

### Vocabulario de apoyo

- **Facility, severity y PRI**: Categoría Syslog, urgencia del mensaje y valor que las combina mediante facility × 8 + severity.
- **Polling, trap e inform**: Consulta periódica, notificación sin confirmación equivalente y notificación con confirmación SNMP.
- **Pipeline y lag**: Cadena de adquisición/transformación y demora de entrega o ingestión que debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Mensaje docente RFC5424: <134>1 2026-10-18T10:00:00Z fw-a app 12 ID47 - session denied.

134 dividido entre 8 da facility 16 y resto severity 6. El texto denied describe una decisión; esa prioridad informativa no prueba ni refuta un ataque.

## 4. Práctica individual

Un forwarder sustituye hostname por su propio nombre. ¿Qué contrato de procedencia necesitas para no perder el emisor?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuál es la severity de PRI 134?

- A. 134
- B. 6
- C. 16
- D. 2

### Pregunta 2

¿Qué implica denied con severity informativa?

- A. Actividad maliciosa descartada por tener nivel 6
- B. Autorización de la sesión porque no es severity 0
- C. Compromiso confirmado del emisor
- D. Una decisión registrada cuyo contexto aún debe investigarse

## 6. Aplicación profesional

- SOC: Triar logs de red en SIEM.
- Red Team autorizado: Comprobar alertas derivadas de control de acceso.
- Evidencia del módulo: Registro con fuente, hora evento/ingesta y cobertura.
- Criterio del módulo: Orden correcto y limitaciones cuantificadas.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L13](../../05_RECURSOS/LABORATORIOS/RED-L13.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC5424**: [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424.html). Cabecera y fórmula facility/severity de PRI.
- **RFC3414**: [RFC 3414: User-based Security Model for SNMPv3](https://www.rfc-editor.org/rfc/rfc3414.html). Niveles de seguridad; suites del RFC histórico no se recomiendan automáticamente.
- **RFC3416**: [RFC 3416: Protocol Operations for SNMP](https://www.rfc-editor.org/rfc/rfc3416.html). Polling y operaciones de notificación.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
