# RED-M41-L04 — Corrección, retest y conclusiones

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M41-L04","moduleId":"RED-M41","stageId":"RED-E08","objective":"Corregir, repetir y defender un cierre acotado.","prerequisites":["RED-M41-L03"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M41-L04-Q01","RED-M41-L04-Q02"],"practiceId":"RED-M41-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M41-L04.md"} -->

## 1. Objetivo

Corregir, repetir y defender un cierre acotado.

Prerrequisitos: [RED-M41-L03](../RED-E08/RED-M41-L03.md).

## 2. Comprende el mecanismo

La corrección debe aplicar mínimos permisos y conservar acceso de quienes lo necesitan. El caso final compara P1 antes y después, un administrador válido y un servicio de negocio permitido. También se comprueba que observación y detección sigan funcionando con el nuevo resultado. Un deny posterior no demuestra que desaparezcan todos los caminos, por lo que el cierre debe especificar qué matriz y condiciones se probaron. El reporte conserva incertidumbres y tareas restantes con responsable.

### Vocabulario de apoyo

- **Verdad docente**: Expectativa y hechos sintéticos elegidos para evaluar razonamiento, sin atribuirlos a ejecución real.
- **Offset y lag corregido**: Desfase del reloj emisor y demora respecto a la hora interpretada tras aplicar esa corrección.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Retest docente: P1 invitado→gestión deny; P2 administrador→gestión allow; P3 empleado→web allow; todas las filas tienen ID y tiempo.

Las tres condiciones apoyan la corrección del objetivo acotado sin la regresión administrativa. La conclusión no se extiende automáticamente a todos los servicios o IPv6 no probado.

## 4. Práctica individual

Añade una prueba que amplíe cobertura sin afirmar que ya fue ejecutada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta P2 al retest?

- A. Comprobar que el acceso administrativo legítimo se conserva
- B. Autorizar a invitados
- C. Confirmar toda familia IP
- D. Eliminar la prueba de denegación

### Pregunta 2

¿Cuál es un cierre defendible?

- A. Objetivo corregido para la matriz y condiciones probadas
- B. Toda red segura para siempre
- C. Todos los usuarios autenticados sin evidencia
- D. IPv6 validado por un caso IPv4

## 6. Aplicación profesional

- SOC: Demostrar investigación multifuente.
- Red Team autorizado: Demostrar verificación mínima y comunicación.
- Evidencia del módulo: Paquete de trazas/flows/registros, cronología y retest.
- Criterio del módulo: Hipótesis sustentadas, cero salidas de alcance, retest.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L20](../../05_RECURSOS/LABORATORIOS/RED-L20.md)
- [Caso integrador Empresa-Lab](../../05_RECURSOS/EMPRESA-LAB.json)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
