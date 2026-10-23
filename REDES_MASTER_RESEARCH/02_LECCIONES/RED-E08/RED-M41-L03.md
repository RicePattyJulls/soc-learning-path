# RED-M41-L03 — Investigación e informe

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M41-L03","moduleId":"RED-M41","stageId":"RED-E08","objective":"Escribir una investigación que sostenga la causa y sus límites.","prerequisites":["RED-M41-L02"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M41-L03-Q01","RED-M41-L03-Q02"],"practiceId":"RED-M41-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M41-L03.md"} -->

## 1. Objetivo

Escribir una investigación que sostenga la causa y sus límites.

Prerrequisitos: [RED-M41-L02](../RED-E08/RED-M41-L02.md).

## 2. Comprende el mecanismo

La misión debe reconstruir la política incumplida, los eventos, su procedencia, el camino y las hipótesis alternativas. En Empresa-Lab, una regla general R10 antecede a una denegación específica R20; con primera coincidencia puede permitir el flujo no deseado. El informe debe identificar esa causa de configuración y distinguirla de pérdida del sensor o error de autenticación. El acceso a un puerto no acredita ejecución administrativa ni lectura de archivos; limita impacto a la observación disponible.

### Vocabulario de apoyo

- **Verdad docente**: Expectativa y hechos sintéticos elegidos para evaluar razonamiento, sin atribuirlos a ejecución real.
- **Offset y lag corregido**: Desfase del reloj emisor y demora respecto a la hora interpretada tras aplicar esa corrección.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Evidencia Empresa-Lab: R10 permite invitados→cualquier destino; R20 deniega invitados→gestión:22; P1-FW registra action=allow y ruleId=R10. El fixture no incluye respuesta del servicio ni resultado de autenticación.

La regla general anterior explica el permiso registrado contrario a la matriz. Los datos no demuestran que el servidor respondiera, que el cliente autenticara ni que ejecutara administración. Esas conclusiones requieren evidencia adicional y no deben añadirse al informe.

## 4. Práctica individual

Redacta una conclusión y una hipótesis alternativa que todavía tendría sentido comprobar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué causa está respaldada en la misión?

- A. Una autenticación administrativa exitosa
- B. Falta total de logs
- C. El DNS necesariamente manipulado
- D. El permiso general se evalúa antes de la denegación específica

### Pregunta 2

¿Qué afirmación excede la evidencia de allow en el firewall y el orden de reglas?

- A. Que el firewall registró un permiso contrario a la política
- B. Que R10 precede a la denegación específica R20
- C. Que hace falta verificar la corrección mediante retest
- D. Control administrativo del equipo sin evidencia de autenticación

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
