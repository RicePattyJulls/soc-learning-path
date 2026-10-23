# RED-M32-L02 — Scope, ventanas y activos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M32-L02","moduleId":"RED-M32","stageId":"RED-E06","objective":"Convertir alcance en una lista de activos y operaciones verificable.","prerequisites":["RED-M32-L01"],"referenceIds":["NIST-TEST"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M32-L02-Q01","RED-M32-L02-Q02"],"practiceId":"RED-M32-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M32-L02.md"} -->

## 1. Objetivo

Convertir alcance en una lista de activos y operaciones verificable.

Prerrequisitos: [RED-M32-L01](../RED-E06/RED-M32-L01.md).

## 2. Comprende el mecanismo

El scope debe ser operativo: redes, hosts, nombres y servicios permitidos, exclusiones, ventanas, tasas y acciones aceptadas. Un rango CIDR puede incluir más direcciones que las necesarias; comprueba pertenencia y propiedad antes de usarlo. Resoluciones DNS y servicios compartidos pueden dirigir a infraestructura no incluida. Define límites por destino efectivo, no solo por el nombre comercial. La ventana temporal necesita zona horaria y condición de finalización. Mantener un inventario de exclusiones evita que una ampliación técnica se convierta en una ampliación implícita del permiso.

### Vocabulario de apoyo

- **Scope**: Activos, operaciones y condiciones incluidos expresamente en el alcance de una evaluación.
- **Reglas de actuación**: Condiciones de ventana, tasas, datos, contactos y parada acordadas para la prueba.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Scope docente: solo hosts LAB-A y LAB-B en una red aislada; el CIDR de su segmento contiene además LAB-C excluido.

Un sondeo al segmento entero incluiría LAB-C. El prefijo es un contenedor de direcciones, no una prueba de que todas estén autorizadas.

## 4. Práctica individual

Un nombre aprobado resuelve después a una IP de un tercero no incluido. Define la respuesta antes de continuar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe incluir una ventana de prueba?

- A. Solo el inicio, dejando el fin a criterio implícito de la herramienta
- B. Inicio, fin y referencia temporal clara
- C. Un fin sin zona horaria, interpretado de forma diferente por cada parte
- D. Solo el día, sin horas ni zona temporal

### Pregunta 2

¿Por qué no se sondea el CIDR completo del caso?

- A. CIDR solo sirve para IPv6
- B. Dos hosts no pueden compartir segmento
- C. Contiene un activo expresamente excluido
- D. Un nombre permite cualquier operación

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
