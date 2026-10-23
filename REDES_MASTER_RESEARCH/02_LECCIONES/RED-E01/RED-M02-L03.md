# RED-M02-L03 — Sumarización y asignación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M02-L03","moduleId":"RED-M02","stageId":"RED-E01","objective":"Evaluar una sumarización por cobertura exacta y destinos ausentes.","prerequisites":["RED-M02-L02"],"referenceIds":["RFC4632","RFC3021","PY-IP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M02-L03-Q01","RED-M02-L03-Q02"],"practiceId":"RED-M02-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M02-L03.md"} -->

## 1. Objetivo

Evaluar una sumarización por cobertura exacta y destinos ausentes.

Prerrequisitos: [RED-M02-L02](../RED-E01/RED-M02-L02.md).

## 2. Comprende el mecanismo

Una ruta agregada representa un bloque alineado que puede contener varias rutas más específicas. Compartir algunos octetos no basta: compara los bits del prefijo y los límites. Anunciar un resumen que incluye redes inexistentes puede atraer tráfico sin destino válido. Mantener rutas específicas o una ruta de descarte del agregado puede formar parte de un diseño controlado, pero debe justificarse para evitar bucles. Un resumen reduce entradas; no convierte las subredes incluidas en un único dominio de broadcast.

### Vocabulario de apoyo

- **CIDR**: Notación /n que expresa cuántos bits del bloque son prefijo de red.
- **VLSM**: Asignación de subredes de tamaños distintos dentro de un bloque padre.
- **Broadcast IPv4**: Dirección para todos los hosts del dominio correspondiente; se reserva en las subredes convencionales del ejercicio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Rutas docentes: 192.0.2.0/25 y 192.0.2.128/25. Agregado propuesto: 192.0.2.0/24.

Los dos /25 cubren exactamente el /24. En cambio, resumir solo .0/26 y .64/26 como /24 añadiría .128–.255 sin que esas rutas estén presentes.

## 4. Práctica individual

Propón el agregado exacto para 198.51.100.0/26 y 198.51.100.64/26 e identifica su final.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe comprobarse al anunciar un agregado?

- A. Que BGP siempre lo prefiera
- B. Su alineación y las rutas que realmente cubre
- C. Que todas las VLAN usen el mismo nombre
- D. Que desaparezca el broadcast

### Pregunta 2

¿Qué resumen exacto une los dos /25 del ejemplo?

- A. 192.0.2.0/24
- B. 192.0.2.128/24
- C. 192.0.2.0/26
- D. 198.51.100.0/24

## 6. Aplicación profesional

- SOC: Interpretar subredes y saltos de origen.
- Red Team autorizado: Delimitar rangos autorizados de laboratorio.
- Evidencia del módulo: Tabla de prefijos, asignación y pruebas de no solapamiento.
- Criterio del módulo: Cumple capacidad, agregación y ausencia de conflictos.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L01](../../05_RECURSOS/LABORATORIOS/RED-L01.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **RFC3021**: [RFC 3021: 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021.html). Excepción de capacidad para /31 en enlaces apropiados.
- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
