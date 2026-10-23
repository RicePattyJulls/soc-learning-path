# RED-M31-L04 — Restauración y lessons learned

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M31-L04","moduleId":"RED-M31","stageId":"RED-E05","objective":"Comprobar recuperación y convertir hallazgos en mejoras.","prerequisites":["RED-M31-L03"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M31-L04-Q01","RED-M31-L04-Q02"],"practiceId":"RED-M31-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M31-L04.md"} -->

## 1. Objetivo

Comprobar recuperación y convertir hallazgos en mejoras.

Prerrequisitos: [RED-M31-L03](../RED-E05/RED-M31-L03.md).

## 2. Comprende el mecanismo

Recuperar exige validar el servicio y las condiciones de seguridad acordadas, no solo retirar una alerta. Compara configuración con un estado aprobado, verifica acceso legítimo y límites de tráfico, y observa recurrencia durante un período justificado. Restaurar puede reintroducir una causa o eliminar evidencias si no se planifica. Las lecciones aprendidas deben asignar responsable, acción verificable y plazo; cambiar un indicador en un tablero no corrige un problema de cobertura o proceso. Conserva lo ejecutado y lo que sigue pendiente.

### Vocabulario de apoyo

- **Triage y contención**: Priorización de investigación y medida para limitar riesgo con impacto y autoridad definidos.
- **Derivado**: Subconjunto o transformación trazable a una fuente original preservada.
- **Recuperación**: Restablecimiento verificado del servicio y de las condiciones de seguridad acordadas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: tras restauración HTTP responde, pero la regla temporal bloquea aún a usuarios válidos y falta el sensor.

Hay una recuperación parcial del servicio. No se han restituido acceso esperado ni observabilidad, y el cierre debe reflejar esas dependencias.

## 4. Práctica individual

Propón tres condiciones de cierre para completar esa recuperación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué conjunto de evidencias permite evaluar la recuperación de servicio y seguridad?

- A. Pruebas de servicio, acceso legítimo, controles y observabilidad requeridos
- B. Solo que una petición HTTP aislada reciba respuesta
- C. Solo que exista un archivo con la configuración anterior
- D. Solo que desaparezca una alerta del panel

### Pregunta 2

¿Qué falta en el caso?

- A. Un nombre nuevo para el incidente
- B. Una respuesta HTTP cualquiera
- C. Acceso legítimo y observabilidad restaurados
- D. Más certeza escrita sin evidencia

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
