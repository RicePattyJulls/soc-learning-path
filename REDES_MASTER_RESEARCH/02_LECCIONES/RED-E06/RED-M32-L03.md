# RED-M32-L03 — Riesgo de disponibilidad y datos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M32-L03","moduleId":"RED-M32","stageId":"RED-E06","objective":"Evaluar impacto de disponibilidad y tratamiento de datos antes del ensayo.","prerequisites":["RED-M32-L02"],"referenceIds":["NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M32-L03-Q01","RED-M32-L03-Q02"],"practiceId":"RED-M32-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M32-L03.md"} -->

## 1. Objetivo

Evaluar impacto de disponibilidad y tratamiento de datos antes del ensayo.

Prerrequisitos: [RED-M32-L02](../RED-E06/RED-M32-L02.md).

## 2. Comprende el mecanismo

Una actividad limitada puede afectar dispositivos frágiles, controles de acceso o registros de producción. Evalúa qué observación es necesaria para responder la pregunta y elige el método menos intrusivo que aporte evidencia suficiente. Evitar fuerza bruta, denegación de servicio y cambios persistentes no autorizados forma parte del alcance técnico. Define datos a recoger, minimización, custodios y eliminación acordada. La lectura de un banner puede seguir implicando una interacción; una captura pasiva puede contener información sensible.

### Vocabulario de apoyo

- **Scope**: Activos, operaciones y condiciones incluidos expresamente en el alcance de una evaluación.
- **Reglas de actuación**: Condiciones de ventana, tasas, datos, contactos y parada acordadas para la prueba.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: se quiere verificar segmentación; plan inicial propone saturar el enlace en vez de probar flujos específicos.

La saturación no es necesaria para comprobar una matriz de acceso y añade riesgo de disponibilidad. Un ensayo acotado puede responder la pregunta con menos impacto.

## 4. Práctica individual

El dataset contiene credenciales accidentales de laboratorio. ¿Qué incluirías en el informe compartido?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué orienta el método de menor impacto?

- A. Conservar todos los secretos por comodidad
- B. La evidencia necesaria para responder la pregunta autorizada
- C. Maximizar tráfico por defecto
- D. La herramienta más agresiva disponible

### Pregunta 2

¿Qué defecto tiene saturar el enlace en el caso?

- A. Sustituye autorización escrita
- B. Siempre demuestra mejor aislamiento
- C. Añade impacto innecesario para verificar flujos de segmentación
- D. Permite atribuir identidad sin logs

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
