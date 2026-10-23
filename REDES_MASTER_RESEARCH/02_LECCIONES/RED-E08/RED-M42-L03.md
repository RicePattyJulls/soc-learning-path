# RED-M42-L03 — Fallos sembrados nuevos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M42-L03","moduleId":"RED-M42","stageId":"RED-E08","objective":"Resolver fallos sembrados sin depender de una receta única.","prerequisites":["RED-M42-L02"],"referenceIds":["NIST-TEST","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M42-L03-Q01","RED-M42-L03-Q02"],"practiceId":"RED-M42-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M42-L03.md"} -->

## 1. Objetivo

Resolver fallos sembrados sin depender de una receta única.

Prerrequisitos: [RED-M42-L02](../RED-E08/RED-M42-L02.md).

## 2. Comprende el mecanismo

Un examen de egreso debe variar la causa manteniendo síntomas comparables. Puede sembrar máscara incorrecta, retorno ausente, regla previa, reloj desviado o captura parcial. El estudiante entrega hipótesis, pruebas, resultados y corrección justificada, no una secuencia de comandos aplicada a ciegas. Un fallo de evaluación aparece si modifica controles sin evidencia o declara éxito sin comprobar servicio y regresión. Define qué datos son suficientes para resolver y cuáles obligan a pedir información adicional.

### Vocabulario de apoyo

- **Transferencia**: Aplicación razonada de conocimientos a un caso diferente del ejemplo memorizado.
- **Recuperación activa**: Intento de recordar o resolver antes de consultar apuntes o solucionario.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso nuevo docente: DNS correcto; SYN llega al servidor; SYN/ACK sale por gateway equivocado; no hay deny observado en el firewall previsto.

La evidencia respalda investigar retorno, no desactivar el firewall por repetir una receta. La causa cambia aunque el usuario solo diga que no conecta.

## 4. Práctica individual

Propón una prueba tras corregir el gateway y una condición que todavía impediría cerrar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué demuestra mejor transferencia de competencia?

- A. Resolver una causa nueva con pruebas justificadas
- B. Repetir siempre el mismo comando
- C. Recordar un título
- D. Aumentar XP sin evaluación

### Pregunta 2

¿Qué hipótesis apoya el caso?

- A. Bloqueo confirmado en un firewall sin deny
- B. Un certificado rechazado observado
- C. DNS incorrecto demostrado
- D. Retorno por gateway incorrecto

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
