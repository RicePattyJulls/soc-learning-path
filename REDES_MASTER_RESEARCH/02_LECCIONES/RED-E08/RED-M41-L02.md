# RED-M41-L02 — Generación controlada y fuentes

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M41-L02","moduleId":"RED-M41","stageId":"RED-E08","objective":"Seguir generación y observación con correcciones de tiempo.","prerequisites":["RED-M41-L01"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M41-L02-Q01","RED-M41-L02-Q02"],"practiceId":"RED-M41-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M41-L02.md"} -->

## 1. Objetivo

Seguir generación y observación con correcciones de tiempo.

Prerrequisitos: [RED-M41-L01](../RED-E08/RED-M41-L01.md).

## 2. Comprende el mecanismo

La misión usa eventos de intento, firewall y colector con semántica explícita. Un formato docente neutral no equivale a EVE, CIM o ASIM; para integrarlo con productos haría falta un mapeo específico. Corrige solo la interpretación temporal, conservando fecha original y offset. Relaciona IDs y flujos, sin atribuir independencia a copias del mismo evento. Si el parser pierde acción o puerto, la detección puede fallar aunque el firewall haya registrado el hecho.

### Vocabulario de apoyo

- **Verdad docente**: Expectativa y hechos sintéticos elegidos para evaluar razonamiento, sin atribuirlos a ejecución real.
- **Offset y lag corregido**: Desfase del reloj emisor y demora respecto a la hora interpretada tras aplicar esa corrección.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Fixture: firewall emite a 10:00:02Z con offset +2 s; colector recibe a 10:00:05Z; ID=P1-FW; actividad real docente=10:00:00Z.

Hora corregida del evento=10:00:00Z; recepción ocurre 5 s después. Restar recepción menos hora cruda daría 3 s y mezclaría offset con transporte.

## 4. Práctica individual

El offset era desconocido en otro evento. Explica cómo representarías el retraso sin inventar precisión.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuál es la hora corregida del firewall?

- A. 10:00:05Z
- B. 10:00:00Z
- C. 10:00:04Z
- D. 09:59:58Z

### Pregunta 2

¿Cuál es el retraso respecto a la hora corregida?

- A. 5 segundos
- B. 3 segundos
- C. 2 segundos
- D. 7 segundos

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
