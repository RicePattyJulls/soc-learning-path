# RED-M31-L02 — Preservación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M31-L02","moduleId":"RED-M31","stageId":"RED-E05","objective":"Preservar evidencia y documentar transformaciones.","prerequisites":["RED-M31-L01"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M31-L02-Q01","RED-M31-L02-Q02"],"practiceId":"RED-M31-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M31-L02.md"} -->

## 1. Objetivo

Preservar evidencia y documentar transformaciones.

Prerrequisitos: [RED-M31-L01](../RED-E05/RED-M31-L01.md).

## 2. Comprende el mecanismo

Preservar requiere adquirir lo pertinente, conservar origen y hashes, registrar responsables y trabajar sobre copias. Un hash no autentica por sí solo un emisor ni corrige cobertura o reloj. La retención del sensor puede expirar antes que la del colector y los datos volátiles necesitan decisiones oportunas. Filtrar o exportar crea derivados que deben relacionarse con el original. Minimiza datos ajenos a la pregunta y controla acceso, sin borrar evidencia porque parezca irrelevante antes de documentar la decisión.

### Vocabulario de apoyo

- **Triage y contención**: Priorización de investigación y medida para limitar riesgo con impacto y autoridad definidos.
- **Derivado**: Subconjunto o transformación trazable a una fuente original preservada.
- **Recuperación**: Restablecimiento verificado del servicio y de las condiciones de seguridad acordadas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: analista exporta 50 filas de un conjunto de 5000 y sobrescribe el único original.

La selección pierde el contexto restante y no permite repetir otro filtro. El derivado debía conservarse separado con su criterio y origen.

## 4. Práctica individual

Diseña la trazabilidad mínima para una nueva exportación sin reproducir datos sensibles en el informe.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe vincular un derivado?

- A. Original, selección aplicada y huellas de ambos
- B. La eliminación del original
- C. Una fecha que encaje con la hipótesis
- D. Solo un nombre de archivo nuevo

### Pregunta 2

¿Qué defecto tiene sobrescribir el original?

- A. Demuestra que el resto era benigno
- B. Garantiza autenticidad del sensor
- C. Aumenta automáticamente la cobertura
- D. Impide repetir análisis fuera del subconjunto conservado

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
