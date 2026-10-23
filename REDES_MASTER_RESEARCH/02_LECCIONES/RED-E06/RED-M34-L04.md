# RED-M34-L04 — Indicios versus vulnerabilidad confirmada

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M34-L04","moduleId":"RED-M34","stageId":"RED-E06","objective":"Clasificar un indicio y un incumplimiento confirmado con precisión.","prerequisites":["RED-M34-L03"],"referenceIds":["NIST-TEST","NIST-ZT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M34-L04-Q01","RED-M34-L04-Q02"],"practiceId":"RED-M34-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M34-L04.md"} -->

## 1. Objetivo

Clasificar un indicio y un incumplimiento confirmado con precisión.

Prerrequisitos: [RED-M34-L03](../RED-E06/RED-M34-L03.md).

## 2. Comprende el mecanismo

Un indicio justifica investigar; un incumplimiento de política requiere demostrar una expectativa y una observación contradictoria. Una condición técnicamente vulnerable necesita además sus prerrequisitos aplicables; el impacto demostrado debe limitarse a lo ensayado. Un puerto abierto no implica explotación, y una regla amplia no demuestra que el camino sea alcanzable desde cualquier lugar. Presenta evidencia mínima, límites, riesgo y remediación sin exagerar. Si la prueba no está autorizada para demostrar impacto, conservarlo como pendiente es correcto.

### Vocabulario de apoyo

- **Control positivo y negativo**: Prueba que debe pasar y prueba que debe denegarse para contrastar el método y la política.
- **Incumplimiento e impacto**: Observación contraria a un requisito y consecuencia demostrada, limitada a la evidencia del ensayo.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: configuración permite invitados→gestión; no se probó el camino. Segundo dato: ensayo autorizado conecta desde invitado al servicio de gestión.

El primer dato revela una condición de configuración; el segundo corrobora acceso contrario a la matriz. Ninguno demuestra por sí solo control administrativo completo.

## 4. Práctica individual

Redacta una conclusión que no convierta acceso al puerto en toma del equipo.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué confirma un incumplimiento de acceso?

- A. Un nombre de equipo sensible
- B. Resultado observado contrario a una política definida
- C. Solo una intuición del evaluador
- D. Cualquier banner

### Pregunta 2

¿Qué impacto no está demostrado en el caso?

- A. Necesidad de remediar el acceso
- B. Una contradicción con la matriz
- C. Control administrativo del equipo
- D. Conectividad al servicio desde invitado

## 6. Aplicación profesional

- SOC: Observar los eventos generados por las pruebas.
- Red Team autorizado: Competencia central de validación de controles.
- Evidencia del módulo: Matriz expected/observed y corroboración de logs.
- Criterio del módulo: Valida al menos dos controles con pruebas reversibles.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L17](../../05_RECURSOS/LABORATORIOS/RED-L17.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
