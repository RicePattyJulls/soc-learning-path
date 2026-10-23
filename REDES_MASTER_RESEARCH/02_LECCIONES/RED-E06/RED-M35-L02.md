# RED-M35-L02 — Telemetría por actividad

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M35-L02","moduleId":"RED-M35","stageId":"RED-E06","objective":"Comprobar cada eslabón entre actividad y alerta.","prerequisites":["RED-M35-L01"],"referenceIds":["NIST-TEST","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M35-L02-Q01","RED-M35-L02-Q02"],"practiceId":"RED-M35-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M35-L02.md"} -->

## 1. Objetivo

Comprobar cada eslabón entre actividad y alerta.

Prerrequisitos: [RED-M35-L01](../RED-E06/RED-M35-L01.md).

## 2. Comprende el mecanismo

Para cada actividad conserva ground truth docente: qué se intentó, desde dónde, cuándo y con qué resultado. Después compara generación de evento, exportación, ingestión, normalización y evaluación. Una alerta ausente puede deberse a una regla correcta sin datos, no necesariamente a lógica defectuosa. Un registro recibido pero mal normalizado puede romper condiciones y atribución. No contar dos índices derivados del mismo evento como sensores independientes. La cadena debe incluir un caso negativo conocido para evaluar ruido.

### Vocabulario de apoyo

- **Ground truth**: Referencia de actividad y resultado conocidos que permite contrastar la cadena de observación.
- **Retest y regresión**: Repetición tras corregir y efecto secundario que rompe una función antes válida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Fixture docente: actividad P2 ocurre; emisor guarda evento; colector lo recibe; parser deja destination_port vacío; regla necesita ese campo.

La pérdida semántica del parser puede explicar que la lógica no coincida. Cambiar el umbral de detección no recupera el campo perdido.

## 4. Práctica individual

Propón una prueba de aceptación para el parser corregido.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta ground truth del ensayo?

- A. Una alerta maliciosa por definición
- B. Una licencia de ejecución universal
- C. Una referencia de actividad y resultado conocido para contrastar observación
- D. Un parser correcto automáticamente

### Pregunta 2

¿Dónde está el defecto localizado del caso?

- A. En el campo perdido durante normalización
- B. Solo en el umbral de la regla, ignorando el puerto perdido
- C. En el emisor, que supuestamente nunca generó el evento
- D. En el transporte, que supuestamente nunca entregó el registro

## 6. Aplicación profesional

- SOC: Validar detecciones y respuesta.
- Red Team autorizado: Demostrar impacto mínimo y corrección.
- Evidencia del módulo: Informe con evidencia ofensiva/defensiva y validación.
- Criterio del módulo: Control corregido y detectabilidad medida por pruebas.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L20](../../05_RECURSOS/LABORATORIOS/RED-L20.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
