# RED-M33-L02 — Enumeración limitada

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M33-L02","moduleId":"RED-M33","stageId":"RED-E06","objective":"Diseñar una enumeración mínima acorde con la pregunta.","prerequisites":["RED-M33-L01"],"referenceIds":["NIST-TEST","ZEEK-CONN"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M33-L02-Q01","RED-M33-L02-Q02"],"practiceId":"RED-M33-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M33-L02.md"} -->

## 1. Objetivo

Diseñar una enumeración mínima acorde con la pregunta.

Prerrequisitos: [RED-M33-L01](../RED-E06/RED-M33-L01.md).

## 2. Comprende el mecanismo

Una enumeración autorizada define hosts y servicios concretos, límites de interacción y resultado esperado. No es necesario probar todos los puertos para confirmar si una política permite un servicio específico. Timeout, rechazo y respuesta de servicio tienen significados distintos y requieren contexto del camino. En redes con sensores, la propia actividad de evaluación puede generar alertas que deben identificarse como ensayo. Este ejercicio diseña y analiza respuestas sintéticas; no ejecuta comandos contra destinos de Internet ni proporciona permiso sobre ellos.

### Vocabulario de apoyo

- **Enumeración y banner**: Obtención acotada de información de activos/servicios y dato que declara un servicio en una interacción.
- **Parche retroportado**: Corrección incorporada a una versión mantenida sin adoptar necesariamente el número de una versión posterior.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Matriz docente: LAB-A→LAB-B TCP/443 debe pasar; TCP/22 debe denegarse. Respuestas dadas: 443 responde; 22 timeout.

El 443 permite observar acceso. El timeout del 22 no demuestra qué control lo bloqueó; puede requerir contador o registro del punto de enforcement.

## 4. Práctica individual

Define una evidencia adicional que convertiría la hipótesis de bloqueo del 22 en una conclusión mejor respaldada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué enfoque minimiza interacción innecesaria?

- A. Aumentar tasa hasta obtener respuesta
- B. Ignorar exclusiones por ser lentas
- C. Explorar siempre toda red conectada
- D. Probar los flujos concretos autorizados para la pregunta

### Pregunta 2

¿Qué no identifica el timeout de TCP/22?

- A. Una necesidad de corroboración
- B. El flujo que se intentó según el registro docente
- C. Que no se observó respuesta en el plazo
- D. La causa exacta del silencio por sí solo

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
