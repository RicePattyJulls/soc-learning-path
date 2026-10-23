# RED-M36-L04 — Manejo de errores

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M36-L04","moduleId":"RED-M36","stageId":"RED-E07","objective":"Manejar errores y resultados parciales sin inventar éxito.","prerequisites":["RED-M36-L03"],"referenceIds":["PY-IP","PY-JSON","RFC8259","YAML","GIT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M36-L04-Q01","RED-M36-L04-Q02"],"practiceId":"RED-M36-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M36-L04.md"} -->

## 1. Objetivo

Manejar errores y resultados parciales sin inventar éxito.

Prerrequisitos: [RED-M36-L03](../RED-E07/RED-M36-L03.md).

## 2. Comprende el mecanismo

Un proceso de automatización puede fallar al leer, validar, consultar o aplicar. Distingue cada etapa y conserva códigos/errores sin secretos. Un timeout no equivale a lista vacía ni a estado correcto. Los reintentos necesitan límites y cuidado con operaciones no idempotentes: repetir una creación puede duplicar recursos. Devuelve resultados por activo y estado global que no oculte fallos parciales. La bitácora debe permitir reproducir el método sin exponer credenciales ni imprimir todo el entorno.

### Vocabulario de apoyo

- **Tipo y esquema**: Clase de valor en un lenguaje y contrato de campos/tipos/rangos de un documento.
- **Fixture y oráculo**: Datos preparados para evaluación y resultado esperado obtenido de manera independiente.
- **Diff**: Comparación de cambios entre versiones, que todavía requiere interpretar su efecto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Lote docente: A validado; B timeout; C dato inválido. Resumen actual muestra 3/3 correctos porque el proceso no se detuvo.

No abortar no implica éxito de cada activo. El resumen debe distinguir un resultado correcto, uno no obtenido y uno rechazado por validación.

## 4. Práctica individual

Una API de creación da timeout después de recibir la petición. Define el riesgo de reintentar a ciegas.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿A qué equivale un timeout de consulta?

- A. Configuración correcta demostrada
- B. Recurso inexistente confirmado
- C. Resultado no obtenido dentro del plazo
- D. Inventario vacío demostrado

### Pregunta 2

¿Cómo debe resumirse el lote?

- A. Tres éxitos por no abortar
- B. Tres configuraciones vacías correctas
- C. Un éxito, un resultado no obtenido y un inválido
- D. Una única identidad para todos los activos

## 6. Aplicación profesional

- SOC: Preparar datos y normalización.
- Red Team autorizado: Automatizar validación mínima de resultados.
- Evidencia del módulo: Contrato de entrada/salida, tests y control de versión.
- Criterio del módulo: No pierde registros ni interpreta mal marcas de tiempo.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L18](../../05_RECURSOS/LABORATORIOS/RED-L18.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
- **PY-JSON**: [json — JSON encoder and decoder](https://docs.python.org/3/library/json.html). Parsing y errores; no evaluación de instrucciones.
- **RFC8259**: [RFC 8259: JavaScript Object Notation Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html). Sintaxis de JSON; distinta de un esquema de aplicación.
- **YAML**: [YAML specification 1.2.2](https://yaml.org/spec/1.2.2/). Sintaxis y diferencia de modelos de datos.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
