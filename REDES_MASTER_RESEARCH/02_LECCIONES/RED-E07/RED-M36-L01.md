# RED-M36-L01 — Python básico y parsing

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M36-L01","moduleId":"RED-M36","stageId":"RED-E07","objective":"Leer datos de red con tipos y validaciones explícitas en Python.","prerequisites":["RED-M05-L04","RED-M07-L04","RED-M12-L04"],"referenceIds":["PY-IP","PY-JSON","RFC8259","YAML","GIT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M36-L01-Q01","RED-M36-L01-Q02"],"practiceId":"RED-M36-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M36-L01.md"} -->

## 1. Objetivo

Leer datos de red con tipos y validaciones explícitas en Python.

Prerrequisitos: [RED-M05-L04](../RED-E01/RED-M05-L04.md), [RED-M07-L04](../RED-E02/RED-M07-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md).

## 2. Comprende el mecanismo

Un script de inventario debe diferenciar cadenas, números, direcciones y valores ausentes. Comparar una IP como texto no equivale a comprobar pertenencia a una red. La biblioteca ipaddress interpreta prefijos y direcciones con reglas definidas; decidir si se toleran bits de host forma parte del contrato. Validar entrada evita producir resultados aparentemente precisos con datos inválidos. Esta lección trabaja con archivos y valores sintéticos offline; no necesita abrir conexiones ni recorrer hosts del sistema.

### Vocabulario de apoyo

- **Tipo y esquema**: Clase de valor en un lenguaje y contrato de campos/tipos/rangos de un documento.
- **Fixture y oráculo**: Datos preparados para evaluación y resultado esperado obtenido de manera independiente.
- **Diff**: Comparación de cambios entre versiones, que todavía requiere interpretar su efecto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Python docente: import ipaddress; red = ipaddress.ip_network("192.0.2.0/24"); resultado = ipaddress.ip_address("192.0.2.70") in red; resultado es True.

La pertenencia se calcula con la dirección y el prefijo interpretados, no buscando la cadena 192.0.2 dentro del texto.

## 4. Práctica individual

Explica cómo tratarías una fila con dirección 999.0.2.70 sin descartarla silenciosamente.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué comprueba ipaddress con el operador in del ejemplo?

- A. Estado de un puerto remoto
- B. Autorización de usuario
- C. Pertenencia de una dirección a un prefijo
- D. Presencia de una subcadena únicamente

### Pregunta 2

¿Qué resultado corresponde a 192.0.2.70 en /24?

- A. False por ser mayor que 24
- B. Un sondeo de red ejecutado
- C. True
- D. Un error por usar una dirección docente

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
