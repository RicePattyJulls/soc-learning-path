# RED-M41-L01 — Plan de ensayo

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M41-L01","moduleId":"RED-M41","stageId":"RED-E08","objective":"Preparar una misión conjunta con una verdad docente verificable.","prerequisites":["RED-M31-L04","RED-M35-L04","RED-M40-L04"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M41-L01-Q01","RED-M41-L01-Q02"],"practiceId":"RED-M41-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M41-L01.md"} -->

## 1. Objetivo

Preparar una misión conjunta con una verdad docente verificable.

Prerrequisitos: [RED-M31-L04](../RED-E05/RED-M31-L04.md), [RED-M35-L04](../RED-E06/RED-M35-L04.md), [RED-M40-L04](../RED-E08/RED-M40-L04.md).

## 2. Comprende el mecanismo

La misión SOC/Red Team debe definir política, alcance, actividad esperada y referencias de verdad conocidas. El caso común Empresa-Lab incluye evidencias sintéticas y no simula haber ejecutado herramientas reales. La cadena debe distinguir intento, acción preventiva, registro, ingestión, detección y decisión. El evaluador necesita saber qué hechos se generaron intencionadamente para interpretar falsos positivos y huecos. Separar el material del estudiante del solucionario permite evaluar razonamiento sin mostrar de entrada la explicación final.

### Vocabulario de apoyo

- **Verdad docente**: Expectativa y hechos sintéticos elegidos para evaluar razonamiento, sin atribuirlos a ejecución real.
- **Offset y lag corregido**: Desfase del reloj emisor y demora respecto a la hora interpretada tras aplicar esa corrección.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Misión docente P1: invitado .130 intenta TCP/22 a gestión .226; política exige deny; registro crudo conserva allow por regla R10.

La verdad docente define un flujo que contradice la política. La misión pide explicar y corregir ese incumplimiento, no descubrir un atacante real del host.

## 4. Práctica individual

Añade un control benigno autorizado y explica para qué se incluye.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta la verdad docente del caso?

- A. Una ejecución real de red declarada
- B. Permiso sobre el host personal
- C. Expectativa conocida contra la que contrastar evidencias
- D. Un compromiso confirmado fuera del lab

### Pregunta 2

¿Qué contradice la política en P1?

- A. La acción allow hacia gestión desde invitado
- B. El hecho de conservar la regla R10
- C. El uso de TCP por sí solo
- D. La presencia de un registro

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
