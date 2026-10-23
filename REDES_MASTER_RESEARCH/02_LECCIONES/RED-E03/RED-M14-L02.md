# RED-M14-L02 — Atributos y best-path

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M14-L02","moduleId":"RED-M14","stageId":"RED-E03","objective":"Justificar una selección BGP sin inventar un orden universal de atributos.","prerequisites":["RED-M14-L01"],"referenceIds":["RFC4271","FRR-BGP","RFC7454"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M14-L02-Q01","RED-M14-L02-Q02"],"practiceId":"RED-M14-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M14-L02.md"} -->

## 1. Objetivo

Justificar una selección BGP sin inventar un orden universal de atributos.

Prerrequisitos: [RED-M14-L01](../RED-E03/RED-M14-L01.md).

## 2. Comprende el mecanismo

BGP selecciona caminos mediante atributos y decisiones locales; detalles y prioridades adicionales dependen de la implementación. Local preference expresa una preferencia dentro del AS; un valor mayor suele favorecerse. AS_PATH informa de AS atravesados y ayuda a prevenir bucles, pero el camino más corto no gana siempre frente a una política local previa. MED tiene reglas y alcance de comparación específicos. No aplicar una lista de best-path de un fabricante como si fuera normativa idéntica de todas las plataformas.

### Vocabulario de apoyo

- **AS y BGP**: Sistema autónomo de routing y protocolo que intercambia alcanzabilidad y atributos entre sistemas.
- **Local preference y AS_PATH**: Preferencia de política interna y secuencia de AS del camino anunciado.
- **Comunidad y ROV**: Etiqueta interpretada por políticas y validación del origen mediante autorizaciones RPKI.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Dos rutas docentes al mismo prefijo: A local-pref=200 AS_PATH de 3 AS; B local-pref=100 AS_PATH de 1 AS; resto compatible.

Una política que compara local-pref antes que longitud de AS_PATH favorece A. Menos AS no equivale necesariamente a ruta seleccionada.

## 4. Práctica individual

El operador cambia local-pref de B a 250. Predice el resultado bajo esa misma regla y qué debe verificarse.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué refleja local preference?

- A. Una medida exacta de latencia
- B. El número de puertos del switch
- C. Una preferencia de política dentro del AS
- D. Una MAC de origen

### Pregunta 2

¿Qué ruta favorece el criterio del ejemplo?

- A. Las dos necesariamente sin política
- B. B siempre por AS_PATH más corto
- C. Ninguna por usar AS privados docentes
- D. A por local-pref 200 frente a 100

## 6. Aplicación profesional

- SOC: Leer decisiones de camino que afectan visibilidad.
- Red Team autorizado: Validar filtrado de prefijos en entorno aislado.
- Evidencia del módulo: RIB, anuncios, políticas y prueba antes/después.
- Criterio del módulo: No hay anuncios no autorizados; selección explicada.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L07](../../05_RECURSOS/LABORATORIOS/RED-L07.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
