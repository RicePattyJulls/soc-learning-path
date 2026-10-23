# RED-M42-L01 — Defensa de arquitectura

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M42-L01","moduleId":"RED-M42","stageId":"RED-E08","objective":"Defender decisiones técnicas frente a alternativas razonables.","prerequisites":["RED-M40-L04","RED-M41-L04"],"referenceIds":["NIST-TEST","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M42-L01-Q01","RED-M42-L01-Q02"],"practiceId":"RED-M42-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M42-L01.md"} -->

## 1. Objetivo

Defender decisiones técnicas frente a alternativas razonables.

Prerrequisitos: [RED-M40-L04](../RED-E08/RED-M40-L04.md), [RED-M41-L04](../RED-E08/RED-M41-L04.md).

## 2. Comprende el mecanismo

Una defensa de arquitectura explica por qué una decisión cumple requisitos y qué compromisos acepta. Presenta alternativas descartadas, evidencia, costes/recursos conocidos y supuestos pendientes. No convertir preferencia de fabricante en ley técnica ni ocultar capacidades no soportadas del laboratorio. La revisión debe permitir cambiar de opinión cuando aparece una restricción nueva. La calidad de la defensa se mide por relación entre requisitos, diseño, prueba y recuperación, no por cantidad de siglas.

### Vocabulario de apoyo

- **Transferencia**: Aplicación razonada de conocimientos a un caso diferente del ejemplo memorizado.
- **Recuperación activa**: Intento de recordar o resolver antes de consultar apuntes o solucionario.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: se elige routing simple para una sede pequeña; una revisión exige BGP solo porque se estudió en el curso.

Conocer BGP no lo convierte en requisito de todo campus. Deben justificarse políticas, interconexión o escala que hagan pertinente esa complejidad.

## 4. Práctica individual

Propón dos preguntas que permitirían decidir si BGP aporta valor en ese diseño.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué hace defendible una decisión?

- A. Una preferencia sin criterio
- B. Su vínculo con requisitos, evidencia y compromisos
- C. La omisión de límites
- D. El mayor número de protocolos

### Pregunta 2

¿Qué defecto tiene exigir BGP en el caso?

- A. Aprender un protocolo obliga a desplegarlo
- B. No se ha identificado un requisito que lo justifique
- C. BGP nunca sirve en empresas
- D. Todo campus necesita route reflectors

## 6. Aplicación profesional

- SOC: Argumentar decisiones bajo incertidumbre.
- Red Team autorizado: Justificar límites técnicos y de autorización.
- Evidencia del módulo: Presentación, pruebas y mapa de fortalezas/debilidades.
- Criterio del módulo: No depende de memoria del caso original; demuestra transferencia.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L20](../../05_RECURSOS/LABORATORIOS/RED-L20.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
