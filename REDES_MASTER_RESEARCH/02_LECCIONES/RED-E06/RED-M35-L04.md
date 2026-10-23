# RED-M35-L04 — Retest y efectos secundarios

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M35-L04","moduleId":"RED-M35","stageId":"RED-E06","objective":"Hacer retest con pruebas de regresión y límites de conclusión.","prerequisites":["RED-M35-L03"],"referenceIds":["NIST-TEST","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M35-L04-Q01","RED-M35-L04-Q02"],"practiceId":"RED-M35-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M35-L04.md"} -->

## 1. Objetivo

Hacer retest con pruebas de regresión y límites de conclusión.

Prerrequisitos: [RED-M35-L03](../RED-E06/RED-M35-L03.md).

## 2. Comprende el mecanismo

El retest repite condiciones relevantes tras la corrección y añade flujos legítimos para detectar efectos secundarios. Conserva versión, cambio aplicado, ventana y evidencia comparable. Un resultado distinto puede venir de una ruta, identidad o carga diferente; documenta esas variaciones. El cierre de un hallazgo no certifica todos los controles de la organización ni confirma cobertura permanente. Si la corrección bloquea el ataque docente pero rompe servicios necesarios, el resultado sigue requiriendo trabajo.

### Vocabulario de apoyo

- **Ground truth**: Referencia de actividad y resultado conocidos que permite contrastar la cadena de observación.
- **Retest y regresión**: Repetición tras corregir y efecto secundario que rompe una función antes válida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Retest docente: invitados ya no alcanzan gestión, pero administradores tampoco por una regla demasiado amplia.

Se corrigió una exposición con una regresión de disponibilidad/autorización legítima. No corresponde declarar cierre satisfactorio sin ajustar y volver a probar.

## 4. Práctica individual

Define una matriz mínima para la segunda repetición.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué añade un retest frente a repetir solo el intento prohibido?

- A. Confianza permanente sin más revisión
- B. Eliminación de evidencias anteriores
- C. Permiso para cualquier técnica nueva
- D. Pruebas de servicios legítimos y efectos secundarios

### Pregunta 2

¿Cómo clasificar el resultado del caso?

- A. Fracaso de toda la red con certeza
- B. Corrección parcial con regresión de acceso legítimo
- C. Cierre total por existir un deny
- D. Falso positivo sin impacto

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
