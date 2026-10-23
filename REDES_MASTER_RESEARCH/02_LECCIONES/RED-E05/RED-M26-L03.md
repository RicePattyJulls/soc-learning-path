# RED-M26-L03 — UTC/NTP y delay

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M26-L03","moduleId":"RED-M26","stageId":"RED-E05","objective":"Diferenciar demora de ingestión y error de reloj.","prerequisites":["RED-M26-L02"],"referenceIds":["RFC5424","RFC3414","RFC3416","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M26-L03-Q01","RED-M26-L03-Q02"],"practiceId":"RED-M26-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M26-L03.md"} -->

## 1. Objetivo

Diferenciar demora de ingestión y error de reloj.

Prerrequisitos: [RED-M26-L02](../RED-E05/RED-M26-L02.md).

## 2. Comprende el mecanismo

El tiempo original del evento y el de recepción responden a preguntas diferentes. Un timestamp normalizado a UTC puede seguir procediendo de un reloj equivocado. Mide offset, incertidumbre y lag de transporte por fuente; conservar el dato original permite corregir una interpretación sin falsear el historial. PTP y NTP no son etiquetas intercambiables de precisión garantizada. No ordenar eventos con resolución de un segundo como si permitieran demostrar el orden de dos acciones separadas por milisegundos.

### Vocabulario de apoyo

- **Facility, severity y PRI**: Categoría Syslog, urgencia del mensaje y valor que las combina mediante facility × 8 + severity.
- **Polling, trap e inform**: Consulta periódica, notificación sin confirmación equivalente y notificación con confirmación SNMP.
- **Pipeline y lag**: Cadena de adquisición/transformación y demora de entrega o ingestión que debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Evento docente: emisor 10:00:00Z; colector 10:04:00Z; estado NTP del emisor fiable ±1 s; cola del forwarder=240 s.

La cola respalda demora de entrega de cuatro minutos. La diferencia no debe corregirse alterando el reloj del emisor que ya tiene referencia coherente.

## 4. Práctica individual

La cola está vacía y se mide offset del emisor de -240 s. Reinterpreta la misma diferencia.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no garantiza la representación UTC?

- A. Una zona de referencia explícita
- B. Que el reloj original sea exacto
- C. Posibilidad de comparar formatos
- D. Una fecha representada

### Pregunta 2

¿Qué apoya el lag del caso?

- A. Un desfase supuesto sin medir
- B. La posición de una columna
- C. La cola medida de 240 segundos con reloj coherente
- D. La severity del mensaje por sí sola

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
