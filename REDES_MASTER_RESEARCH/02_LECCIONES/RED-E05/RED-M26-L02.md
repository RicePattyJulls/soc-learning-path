# RED-M26-L02 — SNMP y polling/traps

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M26-L02","moduleId":"RED-M26","stageId":"RED-E05","objective":"Diferenciar polling, traps e información de seguridad SNMP.","prerequisites":["RED-M26-L01"],"referenceIds":["RFC5424","RFC3414","RFC3416","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M26-L02-Q01","RED-M26-L02-Q02"],"practiceId":"RED-M26-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M26-L02.md"} -->

## 1. Objetivo

Diferenciar polling, traps e información de seguridad SNMP.

Prerrequisitos: [RED-M26-L01](../RED-E05/RED-M26-L01.md).

## 2. Comprende el mecanismo

Polling consulta valores periódicamente; una trap notifica sin el mismo intercambio de confirmación que un inform. Ninguno garantiza por sí solo observar todas las transiciones entre consultas. SNMPv3 permite niveles de seguridad distintos: decir v3 no implica que se hayan activado autenticación y privacidad. Usa algoritmos y configuración vigentes de la plataforma sin copiar suites históricas por aparecer en el RFC original. Para interpretar contadores conserva tipo, reinicio, intervalo y wrap cuando sea relevante.

### Vocabulario de apoyo

- **Facility, severity y PRI**: Categoría Syslog, urgencia del mensaje y valor que las combina mediante facility × 8 + severity.
- **Polling, trap e inform**: Consulta periódica, notificación sin confirmación equivalente y notificación con confirmación SNMP.
- **Pipeline y lag**: Cadena de adquisición/transformación y demora de entrega o ingestión que debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Sondeos docentes a 10:00 y 10:05 muestran puerto up; registro del equipo indica down/up entre 10:02 y 10:03.

Las dos consultas no capturan la transición intermedia. Combinar eventos y métricas evita declarar disponibilidad continua basándose solo en muestras.

## 4. Práctica individual

Un inventario dice SNMPv3 noAuthNoPriv. ¿Qué garantía no puedes afirmar y qué dato pedirías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué limitación tiene el polling periódico?

- A. Puede omitir cambios ocurridos entre muestras
- B. Sustituye el reloj del emisor
- C. No puede leer contadores nunca
- D. Garantiza todos los eventos en tiempo real

### Pregunta 2

¿Qué refuta continuidad durante todo el intervalo?

- A. Las dos muestras up por sí solas
- B. El registro down/up intermedio
- C. El uso de cinco minutos
- D. Una etiqueta SNMPv3 sin nivel

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
