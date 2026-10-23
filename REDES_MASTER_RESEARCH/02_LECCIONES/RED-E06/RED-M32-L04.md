# RED-M32-L04 — Criterios de parada y reporte

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M32-L04","moduleId":"RED-M32","stageId":"RED-E06","objective":"Definir criterios de parada y entrega antes de ejecutar.","prerequisites":["RED-M32-L03"],"referenceIds":["NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M32-L04-Q01","RED-M32-L04-Q02"],"practiceId":"RED-M32-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M32-L04.md"} -->

## 1. Objetivo

Definir criterios de parada y entrega antes de ejecutar.

Prerrequisitos: [RED-M32-L03](../RED-E06/RED-M32-L03.md).

## 2. Comprende el mecanismo

Un criterio de parada debe ser observable y accionable: activo fuera de alcance, pérdida de aislamiento, impacto inesperado o superación de un límite acordado. Establece quién detiene, a quién avisa y qué evidencia preserva. Parar no significa borrar rastros ni improvisar correcciones que excedan permiso. Un reporte útil distingue acciones previstas, realizadas, no realizadas y pendientes, además de resultados y limitaciones. El retest necesita alcance propio o estar expresamente incluido en el acuerdo inicial.

### Vocabulario de apoyo

- **Scope**: Activos, operaciones y condiciones incluidos expresamente en el alcance de una evaluación.
- **Reglas de actuación**: Condiciones de ventana, tasas, datos, contactos y parada acordadas para la prueba.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Ensayo docente: una ruta inesperada alcanza la LAN real en una simulación que debía permanecer aislada.

Se activa la condición de parada por pérdida de aislamiento. Debe preservarse lo observado y corregirse el entorno antes de considerar una reanudación autorizada.

## 4. Práctica individual

El propietario pide continuar inmediatamente sin entender la ruta. Define qué información técnica necesita para decidir.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cómo debe ser un criterio de parada?

- A. Aplicable después de terminar siempre
- B. Solo una advertencia genérica
- C. Observable, definido y con responsable
- D. Equivalente a borrar logs

### Pregunta 2

¿Qué activa el evento del caso?

- A. Parada por pérdida de aislamiento
- B. Una prueba de que toda segmentación funciona
- C. Un cierre exitoso del ensayo
- D. Autorización automática para la LAN real

## 6. Aplicación profesional

- SOC: Determinar logs que deberían registrarse.
- Red Team autorizado: Competencia central de seguridad profesional.
- Evidencia del módulo: Documento de alcance y responsabilidades.
- Criterio del módulo: Todos los activos, límites y paradas explícitos.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L17](../../05_RECURSOS/LABORATORIOS/RED-L17.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
