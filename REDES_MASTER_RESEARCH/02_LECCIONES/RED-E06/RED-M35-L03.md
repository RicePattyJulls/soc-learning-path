# RED-M35-L03 — Informe y mitigación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M35-L03","moduleId":"RED-M35","stageId":"RED-E06","objective":"Redactar un hallazgo que permita corregir la causa.","prerequisites":["RED-M35-L02"],"referenceIds":["NIST-TEST","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M35-L03-Q01","RED-M35-L03-Q02"],"practiceId":"RED-M35-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M35-L03.md"} -->

## 1. Objetivo

Redactar un hallazgo que permita corregir la causa.

Prerrequisitos: [RED-M35-L02](../RED-E06/RED-M35-L02.md).

## 2. Comprende el mecanismo

Un hallazgo útil relaciona requisito, condición, evidencia, impacto observado, límites y recomendación. Separa la debilidad preventiva de una carencia de logging o respuesta. La remediación debe tener responsable, alcance y forma de verificar, incluyendo impacto en flujos legítimos. No sustituir causa raíz por añadir una alerta si el control preventivo sigue fuera de política. Un informe ejecutivo puede resumir riesgo sin revelar secretos ni exagerar lo demostrado. La evidencia técnica debe permitir repetir la interpretación.

### Vocabulario de apoyo

- **Ground truth**: Referencia de actividad y resultado conocidos que permite contrastar la cadena de observación.
- **Retest y regresión**: Repetición tras corregir y efecto secundario que rompe una función antes válida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Hallazgo docente: invitados alcanzan gestión por una regla general anterior; el sensor registra el flujo pero no alerta.

Hay al menos un problema de política de acceso y otro de evaluación detectiva. Corregir solo la alerta deja abierta la ruta no autorizada.

## 4. Práctica individual

Escribe dos acciones de remediación independientes con su comprobación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe conectar una recomendación?

- A. La causa identificada y una verificación de su corrección
- B. Un cambio no medible
- C. Un producto nuevo sin requisito
- D. Solo la severidad de la alerta

### Pregunta 2

¿Qué queda abierto si solo se añade la alerta?

- A. Toda visibilidad del sensor
- B. El inventario de invitados necesariamente
- C. El acceso no autorizado por la regla general
- D. La existencia del registro

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
