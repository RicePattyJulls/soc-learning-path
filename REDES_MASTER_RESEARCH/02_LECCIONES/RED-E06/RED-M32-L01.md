# RED-M32-L01 — Autorización escrita

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M32-L01","moduleId":"RED-M32","stageId":"RED-E06","objective":"Redactar una autorización que identifique quién permite qué.","prerequisites":["RED-M01-L04"],"referenceIds":["NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M32-L01-Q01","RED-M32-L01-Q02"],"practiceId":"RED-M32-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M32-L01.md"} -->

## 1. Objetivo

Redactar una autorización que identifique quién permite qué.

Prerrequisitos: [RED-M01-L04](../RED-E01/RED-M01-L04.md).

## 2. Comprende el mecanismo

Una prueba autorizada requiere que el responsable competente apruebe activos, actividades y condiciones concretas. Tener una cuenta o conocer una dirección no concede permiso general. La autorización debe distinguir propietario, operador, evaluador y contacto de emergencia, incluidos terceros cuando sus activos estén implicados. En esta lección se trabaja con escenarios documentales y redes de laboratorio declaradas; las direcciones de documentación del material no son objetivos públicos a probar. Cualquier cambio de alcance se registra antes de realizarlo.

### Vocabulario de apoyo

- **Scope**: Activos, operaciones y condiciones incluidos expresamente en el alcance de una evaluación.
- **Reglas de actuación**: Condiciones de ventana, tasas, datos, contactos y parada acordadas para la prueba.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Documento docente: propietario autoriza revisar configuración offline del firewall A; un evaluador propone escanear toda la red del proveedor.

La actividad propuesta excede tanto el tipo de prueba como los activos aprobados. El permiso sobre A no se extiende al proveedor.

## 4. Práctica individual

Redacta una autorización breve para analizar solo archivos sintéticos de esta academia.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuál de estas situaciones carece de autorización de prueba?

- A. Una prueba expresamente incluida en la autorización vigente del propietario competente
- B. Una revisión offline aprobada para los archivos concretos que se van a analizar
- C. Un encargo competente que incluye esa actividad y activo en su alcance
- D. Disponer únicamente de una cuenta, sin encargo ni permiso de evaluación

### Pregunta 2

¿Está incluido el proveedor en el caso?

- A. No, la autorización solo cubre revisión offline de A
- B. Sí por no haberse opuesto expresamente
- C. Sí por compartir conectividad
- D. Sí porque existe una IP

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
