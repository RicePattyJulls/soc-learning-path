# RED-M14-L03 — Políticas, filtros y comunidades

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M14-L03","moduleId":"RED-M14","stageId":"RED-E03","objective":"Definir filtros de importación/exportación y comprender comunidades.","prerequisites":["RED-M14-L02"],"referenceIds":["RFC4271","FRR-BGP","RFC7454"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M14-L03-Q01","RED-M14-L03-Q02"],"practiceId":"RED-M14-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M14-L03.md"} -->

## 1. Objetivo

Definir filtros de importación/exportación y comprender comunidades.

Prerrequisitos: [RED-M14-L02](../RED-E03/RED-M14-L02.md).

## 2. Comprende el mecanismo

Una política BGP debe declarar qué prefijos se reciben y anuncian, con longitudes permitidas y origen esperado. Una comunidad etiqueta rutas para decisiones de política, pero no impone una acción por sí sola si nadie la interpreta. Max-prefix limita cantidades; no verifica por sí mismo que cada prefijo sea legítimo. RPKI/ROV valida aspectos del origen frente a autorizaciones publicadas; no demuestra toda la legitimidad del camino ni elimina route leaks. Distingue anuncio accidental, filtrado y estado de validación.

### Vocabulario de apoyo

- **AS y BGP**: Sistema autónomo de routing y protocolo que intercambia alcanzabilidad y atributos entre sistemas.
- **Local preference y AS_PATH**: Preferencia de política interna y secuencia de AS del camino anunciado.
- **Comunidad y ROV**: Etiqueta interpretada por políticas y validación del origen mediante autorizaciones RPKI.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Contrato docente: exportar solo 192.0.2.0/24. Cambio propuesto añade exportación de default y rutas de otro vecino.

La política excede el contrato e introduce riesgo de fuga. Revisar exportación explícita y prueba negativa antes del cambio.

## 4. Práctica individual

Se recibe una ruta con comunidad no-export. ¿Qué debes comprobar antes de asegurar que jamás saldrá del AS?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no valida max-prefix por sí solo?

- A. La legitimidad de cada prefijo
- B. Que existe un límite de cantidad
- C. El número de prefijos contado
- D. Un posible exceso de entradas

### Pregunta 2

¿Qué viola la propuesta del ejemplo?

- A. Mantener un filtro explícito
- B. Registrar la política de salida
- C. Probar un anuncio permitido
- D. Exportar rutas fuera del prefijo autorizado

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
