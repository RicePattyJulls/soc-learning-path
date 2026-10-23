# RED-M36-L02 — JSON/YAML

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M36-L02","moduleId":"RED-M36","stageId":"RED-E07","objective":"Distinguir serialización válida y cumplimiento del esquema.","prerequisites":["RED-M36-L01"],"referenceIds":["PY-IP","PY-JSON","RFC8259","YAML","GIT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M36-L02-Q01","RED-M36-L02-Q02"],"practiceId":"RED-M36-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M36-L02.md"} -->

## 1. Objetivo

Distinguir serialización válida y cumplimiento del esquema.

Prerrequisitos: [RED-M36-L01](../RED-E07/RED-M36-L01.md).

## 2. Comprende el mecanismo

JSON representa objetos, arrays y valores con reglas sintácticas; sus claves de objeto son cadenas entre comillas dobles y no admite comentarios del lenguaje estándar. YAML tiene otras reglas y tipos, con diferencias de versión y parser. Que un archivo se pueda parsear no demuestra que tenga campos, tipos y rangos requeridos. Define esquema y rechaza claves inesperadas cuando convenga. Usar un loader seguro para YAML evita tratar contenido como instrucciones de objetos arbitrarios; nunca usar eval para interpretar datos de inventario.

### Vocabulario de apoyo

- **Tipo y esquema**: Clase de valor en un lenguaje y contrato de campos/tipos/rangos de un documento.
- **Fixture y oráculo**: Datos preparados para evaluación y resultado esperado obtenido de manera independiente.
- **Diff**: Comparación de cambios entre versiones, que todavía requiere interpretar su efecto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> JSON docente: {"vlan": "20", "enabled": true}. El esquema pide vlan como entero de rango admitido, no una cadena.

El documento es JSON válido, pero no cumple ese tipo del contrato. Sintaxis y semántica del esquema son verificaciones distintas.

## 4. Práctica individual

Diseña validaciones para un objeto con nombre de interfaz, MTU y lista de redes sin ejecutar su contenido.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no demuestra parsear JSON correctamente?

- A. Cumplimiento de todos los requisitos del esquema
- B. Sintaxis aceptada por el parser
- C. Posibilidad de leer sus valores
- D. Un documento estructurado

### Pregunta 2

¿Qué falla en vlan del ejemplo?

- A. La clave está entre comillas dobles
- B. true invalida todo objeto
- C. Es una cadena y el esquema exige entero
- D. JSON prohíbe los números

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
