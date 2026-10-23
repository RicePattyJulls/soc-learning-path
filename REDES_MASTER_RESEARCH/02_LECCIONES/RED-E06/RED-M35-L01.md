# RED-M35-L01 — Plan compartido Blue/Red

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M35-L01","moduleId":"RED-M35","stageId":"RED-E06","objective":"Alinear objetivos Blue/Red y resultados esperados antes del ensayo.","prerequisites":["RED-M30-L04","RED-M31-L04","RED-M34-L04"],"referenceIds":["NIST-TEST","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M35-L01-Q01","RED-M35-L01-Q02"],"practiceId":"RED-M35-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M35-L01.md"} -->

## 1. Objetivo

Alinear objetivos Blue/Red y resultados esperados antes del ensayo.

Prerrequisitos: [RED-M30-L04](../RED-E05/RED-M30-L04.md), [RED-M31-L04](../RED-E05/RED-M31-L04.md), [RED-M34-L04](../RED-E06/RED-M34-L04.md).

## 2. Comprende el mecanismo

Un plan conjunto relaciona objetivo de control, actividad autorizada, telemetría prevista, detección y decisión del analista. Define qué se comparte antes y qué permanece como variación de evaluación, sin ocultar condiciones de seguridad. El éxito preventivo y detectivo se mide por separado: bloquear tráfico no demuestra que haya una alerta y alertar no implica impedirlo. Una actividad descrita en un documento todavía no genera eventos. Mantén responsables, ventana, IDs de prueba y criterio de cierre.

### Vocabulario de apoyo

- **Ground truth**: Referencia de actividad y resultado conocidos que permite contrastar la cadena de observación.
- **Retest y regresión**: Repetición tras corregir y efecto secundario que rompe una función antes válida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Plan docente: prueba P1 intenta un flujo excluido; firewall debe denegar; sensor debe emitir registro; analista debe localizarlo por ID.

Cada eslabón tiene evidencia propia. El registro de planificación no sustituye decisión del firewall, recepción del sensor ni análisis.

## 4. Práctica individual

La prueba se bloquea y no hay evento recibido. Clasifica prevención y detección por separado.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué separa un plan Blue/Red?

- A. Prevención, observación, detección y respuesta
- B. Todos los resultados como un único éxito
- C. Captura y autenticación como equivalentes
- D. Autorización y prueba como lo mismo

### Pregunta 2

¿Qué acredita un bloqueo comprobado sin evento recibido?

- A. Prevención respaldada para ese flujo, sin detección demostrada
- B. Que el parser y la regla funcionan correctamente sin datos
- C. Cadena completa de bloqueo, ingestión y detección verificada
- D. Ausencia de actividad generada por la prueba

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
