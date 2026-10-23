# RED-M33-L04 — Registro de comandos y resultados

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M33-L04","moduleId":"RED-M33","stageId":"RED-E06","objective":"Registrar acciones para poder reproducir y revisar un ensayo.","prerequisites":["RED-M33-L03"],"referenceIds":["NIST-TEST","ZEEK-CONN"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M33-L04-Q01","RED-M33-L04-Q02"],"practiceId":"RED-M33-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M33-L04.md"} -->

## 1. Objetivo

Registrar acciones para poder reproducir y revisar un ensayo.

Prerrequisitos: [RED-M33-L03](../RED-E06/RED-M33-L03.md).

## 2. Comprende el mecanismo

La bitácora relaciona objetivo, autorización, herramienta/versión, parámetros, hora, origen, destino y resultado. Preserva salida original y anotaciones separadas; registrar un comando no implica que se ejecutó ni que logró su objetivo. Incluye límites de tasa y condiciones inesperadas. Redacta secretos en informes compartidos sin perder ubicación y tipo. Al relacionar la prueba con logs del sensor, el evaluador debe distinguir tráfico generado, observado y detectado para no inventar cobertura.

### Vocabulario de apoyo

- **Enumeración y banner**: Obtención acotada de información de activos/servicios y dato que declara un servicio en una interacción.
- **Parche retroportado**: Corrección incorporada a una versión mantenida sin adoptar necesariamente el número de una versión posterior.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Bitácora docente: acción planeada a 10:00; estado no ejecutada; otro analista la incluye en la lista de pruebas satisfactorias.

La planificación no aporta resultado. El registro de estado evita convertir intención en evidencia de funcionamiento.

## 4. Práctica individual

Propón cómo documentar un comando ejecutado que produjo error antes de enviar tráfico.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe distinguir una bitácora?

- A. Solo comandos planeados
- B. Todos los secretos en texto claro
- C. Una salida reescrita como éxito
- D. Plan, ejecución y resultado verificado

### Pregunta 2

¿Qué defecto presenta el informe del caso?

- A. Cuenta una acción no ejecutada como prueba satisfactoria
- B. Conserva la hora planeada
- C. Identifica a dos analistas
- D. Tiene una anotación de estado

## 6. Aplicación profesional

- SOC: Identificar actividad detectable y ruido.
- Red Team autorizado: Competencia central de reconocimiento controlado.
- Evidencia del módulo: Tabla activo-puerto-evidencia-hora y límites.
- Criterio del módulo: Sin objetivos externos y con mínimo tráfico.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L17](../../05_RECURSOS/LABORATORIOS/RED-L17.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **ZEEK-CONN**: [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html). Registros de conexión y límites; los fixtures del curso usan otro esquema declarado.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
