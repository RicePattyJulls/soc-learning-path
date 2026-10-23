# RED-M36-L03 — Git y pruebas

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M36-L03","moduleId":"RED-M36","stageId":"RED-E07","objective":"Versionar decisiones y evaluar funciones con casos conocidos.","prerequisites":["RED-M36-L02"],"referenceIds":["PY-IP","PY-JSON","RFC8259","YAML","GIT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M36-L03-Q01","RED-M36-L03-Q02"],"practiceId":"RED-M36-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M36-L03.md"} -->

## 1. Objetivo

Versionar decisiones y evaluar funciones con casos conocidos.

Prerrequisitos: [RED-M36-L02](../RED-E07/RED-M36-L02.md).

## 2. Comprende el mecanismo

Git permite conservar cambios y comparar versiones; una diferencia textual no demuestra corrección de red. Separa datos de laboratorio, código, configuración y secretos. Una prueba útil compara comportamiento contra resultados conocidos, incluidos límites y entradas inválidas, no solo vuelve a ejecutar la misma lógica sin un oráculo. Para una función de subredes usa ejemplos calculados independientemente, solapamientos y prefijos fronterizos. Revisar un diff debe conectar cada cambio con su objetivo y efecto, no solo con su tamaño.

### Vocabulario de apoyo

- **Tipo y esquema**: Clase de valor en un lenguaje y contrato de campos/tipos/rangos de un documento.
- **Fixture y oráculo**: Datos preparados para evaluación y resultado esperado obtenido de manera independiente.
- **Diff**: Comparación de cambios entre versiones, que todavía requiere interpretar su efecto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cambio docente: función pasa de aceptar cualquier texto con puntos a usar un parser IP; fixture incluye 192.0.2.1 y 999.0.2.1.

El caso válido y el inválido comprueban decisiones diferentes. Verificar solo que la función devuelve algo ocultaría la mejora o un falso aprobado.

## 4. Práctica individual

Añade dos casos límite para una función que detecta solapamiento de redes.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta un diff por sí solo?

- A. Una comparación de cambios, no garantía de corrección
- B. Una ejecución del cambio en todos los equipos
- C. Cifrado de cualquier secreto guardado
- D. Dominio práctico certificado

### Pregunta 2

¿Qué prueba 999.0.2.1 en el fixture?

- A. El rendimiento de DNS
- B. Una dirección válida fuera del segmento
- C. Accesibilidad de un servidor público
- D. Rechazo de una entrada IPv4 inválida

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
