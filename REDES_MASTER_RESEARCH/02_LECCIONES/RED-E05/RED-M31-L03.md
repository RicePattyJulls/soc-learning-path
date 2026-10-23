# RED-M31-L03 — Contención y disponibilidad

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M31-L03","moduleId":"RED-M31","stageId":"RED-E05","objective":"Elegir contención proporcional y distinguir propuesta de ejecución.","prerequisites":["RED-M31-L02"],"referenceIds":["NIST-IR","NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M31-L03-Q01","RED-M31-L03-Q02"],"practiceId":"RED-M31-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M31-L03.md"} -->

## 1. Objetivo

Elegir contención proporcional y distinguir propuesta de ejecución.

Prerrequisitos: [RED-M31-L02](../RED-E05/RED-M31-L02.md).

## 2. Comprende el mecanismo

Una contención debe limitar el riesgo con un impacto de negocio aceptado y una forma de retorno. Bloquear una IP compartida puede afectar servicios legítimos; aislar un equipo crítico puede detener funciones esenciales. Comparar opciones requiere evidencia, autoridad, duración, responsable y criterio de levantamiento. Registrar recomendada, autorizada, ejecutada y verificada como estados distintos. No describir una regla propuesta como un bloqueo efectivo ni usar una simulación documental como evidencia de que el tráfico real quedó detenido.

### Vocabulario de apoyo

- **Triage y contención**: Priorización de investigación y medida para limitar riesgo con impacto y autoridad definidos.
- **Derivado**: Subconjunto o transformación trazable a una fuente original preservada.
- **Recuperación**: Restablecimiento verificado del servicio y de las condiciones de seguridad acordadas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: destino sospechoso comparte IP con un servicio esencial; solo se conoce la IP, sin dominio/proceso corroborado.

Un bloqueo global podría causar daño colateral. Hace falta contrastar atribución y valorar una contención más específica, con decisión documentada.

## 4. Práctica individual

El responsable autoriza una regla temporal, pero todavía no se aplicó. ¿Qué puede afirmar el informe?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe acompañar una contención?

- A. Autoridad, impacto, alcance y reversión
- B. Una regla irreversible por defecto
- C. Solo urgencia
- D. Ausencia de pruebas para ahorrar tiempo

### Pregunta 2

¿Qué estado describe la regla del ejercicio?

- A. Autorizada y pendiente de ejecutar
- B. Ataque confirmado por la firma
- C. Bloqueo efectivo demostrado
- D. Recuperación terminada

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
