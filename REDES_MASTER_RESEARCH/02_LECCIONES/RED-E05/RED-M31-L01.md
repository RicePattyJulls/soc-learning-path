# RED-M31-L01 — Triage y escalado

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M31-L01","moduleId":"RED-M31","stageId":"RED-E05","objective":"Priorizar una investigación y definir un escalado útil.","prerequisites":["RED-M22-L04","RED-M29-L04","RED-M30-L04"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M31-L01-Q01","RED-M31-L01-Q02"],"practiceId":"RED-M31-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M31-L01.md"} -->

## 1. Objetivo

Priorizar una investigación y definir un escalado útil.

Prerrequisitos: [RED-M22-L04](../RED-E04/RED-M22-L04.md), [RED-M29-L04](../RED-E05/RED-M29-L04.md), [RED-M30-L04](../RED-E05/RED-M30-L04.md).

## 2. Comprende el mecanismo

Triage organiza el trabajo según evidencia, impacto, exposición y criticidad, manteniendo hipótesis abiertas. Una prioridad alta no confirma malicia y una confianza baja puede requerir atención urgente si el impacto potencial es importante. Identifica quién decide, qué pregunta falta y qué acción está autorizada. El escalado debe incluir hechos, ventana, activos, fuentes, contradicciones y solicitud concreta; enviar una captura de la alerta sin contexto obliga a repetir el análisis y puede perder tiempo de retención.

### Vocabulario de apoyo

- **Triage y contención**: Priorización de investigación y medida para limitar riesgo con impacto y autoridad definidos.
- **Derivado**: Subconjunto o transformación trazable a una fuente original preservada.
- **Recuperación**: Restablecimiento verificado del servicio y de las condiciones de seguridad acordadas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: transferencia inusual desde un servidor crítico; no se conoce proceso; hay ventana de mantenimiento registrada.

El activo merece atención y la ventana ofrece una alternativa a comprobar. No cerrar solo por el calendario ni declarar incidente confirmado por el volumen.

## 4. Práctica individual

Redacta tres elementos imprescindibles para escalar el caso al responsable del servidor.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué combina un triage razonado?

- A. Solo la severidad de un producto
- B. Solo el volumen de bytes
- C. Impacto potencial y calidad de evidencia
- D. La certeza obligatoria antes de preguntar

### Pregunta 2

¿Cómo se interpreta la ventana de mantenimiento?

- A. Prueba suficiente de benignidad
- B. Evidencia de exfiltración
- C. Una explicación alternativa a verificar
- D. Autorización de cualquier actividad sin límites

## 6. Aplicación profesional

- SOC: Gestionar escalado y comunicación SOC.
- Red Team autorizado: Verificar remediación sin generar daño.
- Evidencia del módulo: Plan de acción, impacto, autorización y verificación.
- Criterio del módulo: Diferencia recomendación de acción ejecutada.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L16](../../05_RECURSOS/LABORATORIOS/RED-L16.md)
- [Guía de laboratorio RED-L20](../../05_RECURSOS/LABORATORIOS/RED-L20.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
