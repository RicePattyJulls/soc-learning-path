# RED-M26-L04 — Pérdidas, retención y duplicados

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M26-L04","moduleId":"RED-M26","stageId":"RED-E05","objective":"Distinguir pérdida, duplicado y política de conservación.","prerequisites":["RED-M26-L03"],"referenceIds":["RFC5424","RFC3414","RFC3416","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M26-L04-Q01","RED-M26-L04-Q02"],"practiceId":"RED-M26-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M26-L04.md"} -->

## 1. Objetivo

Distinguir pérdida, duplicado y política de conservación.

Prerrequisitos: [RED-M26-L03](../RED-E05/RED-M26-L03.md).

## 2. Comprende el mecanismo

Un pipeline puede perder mensajes por transporte, buffers, filtros o límites de almacenamiento. Los duplicados pueden surgir de reintentos, varios forwarders o copia de eventos; no eliminarlos solo por igualdad de texto, porque pueden ser sucesos legítimos repetidos. Diseña una clave con origen, identificador y tiempo cuando exista, documentando colisiones y límites. Retención define cuánto se conserva; no acredita cobertura del intervalo anterior. Diferencia silencio del sensor, ausencia de actividad y ausencia de datos disponibles.

### Vocabulario de apoyo

- **Facility, severity y PRI**: Categoría Syslog, urgencia del mensaje y valor que las combina mediante facility × 8 + severity.
- **Polling, trap e inform**: Consulta periódica, notificación sin confirmación equivalente y notificación con confirmación SNMP.
- **Pipeline y lag**: Cadena de adquisición/transformación y demora de entrega o ingestión que debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Lote docente: evento ID47 de fw-a llega por dos forwarders con igual secuencia y hora; otro ID48 tiene texto idéntico un segundo después.

Los dos ID47 son candidatos a duplicación de transporte. ID48 no debe eliminarse únicamente porque el mensaje sea igual.

## 4. Práctica individual

El sensor no entrega datos durante 30 min y no hay otra fuente. Redacta la conclusión de cobertura.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué criterio de deduplicación es insuficiente por sí solo?

- A. Identificador más origen y tiempo evaluados
- B. Procedencia documentada
- C. Texto del mensaje idéntico
- D. Una política explícita de colisiones

### Pregunta 2

¿Qué hacer con ID48 en el ejemplo?

- A. Cambiar su hora a la de ID47
- B. Atribuirlo al otro forwarder como usuario
- C. Conservarlo como evento distinto salvo evidencia contraria
- D. Borrarlo por tener el mismo texto

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
