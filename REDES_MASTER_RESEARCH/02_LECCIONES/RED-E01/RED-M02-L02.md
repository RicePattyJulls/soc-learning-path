# RED-M02-L02 — Subredes y VLSM

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M02-L02","moduleId":"RED-M02","stageId":"RED-E01","objective":"Asignar bloques VLSM sin solapamiento y justificar su capacidad.","prerequisites":["RED-M02-L01"],"referenceIds":["RFC4632","RFC3021","PY-IP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M02-L02-Q01","RED-M02-L02-Q02"],"practiceId":"RED-M02-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M02-L02.md"} -->

## 1. Objetivo

Asignar bloques VLSM sin solapamiento y justificar su capacidad.

Prerrequisitos: [RED-M02-L01](../RED-E01/RED-M02-L01.md).

## 2. Comprende el mecanismo

VLSM permite usar tamaños diferentes dentro de un bloque de direcciones. Ordenar necesidades de mayor a menor reduce fragmentación, pero cada asignación debe empezar en un límite válido para su prefijo. Primero calcula capacidad y reserva de crecimiento; después comprueba inclusión en el bloque padre y ausencia de solapamientos. Una asignación con muchas direcciones libres puede seguir siendo incorrecta si dos redes comparten direcciones. La cantidad de interfaces y reservas debe formar parte del requisito, no suponerse a partir del nombre de la VLAN.

### Vocabulario de apoyo

- **CIDR**: Notación /n que expresa cuántos bits del bloque son prefijo de red.
- **VLSM**: Asignación de subredes de tamaños distintos dentro de un bloque padre.
- **Broadcast IPv4**: Dirección para todos los hosts del dominio correspondiente; se reserva en las subredes convencionales del ejercicio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Bloque padre 192.0.2.0/24. Necesidades convencionales: A=50 hosts, B=25, C=10. Propuesta A=.0/26, B=.64/27, C=.96/28.

A dispone de 62 hosts, B de 30 y C de 14. Sus bloques terminan en .63, .95 y .111; no se solapan y quedan direcciones sin asignar.

## 4. Práctica individual

B crece a 40 hosts. Explica por qué no puedes ampliar su prefijo sin revisar C y ofrece un plan.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué evita un plan VLSM válido?

- A. Usar prefijos diferentes
- B. Asignar rangos solapados
- C. Reservar crecimiento
- D. Registrar interfaces de gateway

### Pregunta 2

¿Qué ocurre al ampliar B a .64/26?

- A. Se transforma en IPv6
- B. Elimina la necesidad de gateway
- C. Mantiene exactamente 30 hosts
- D. Incluye el rango asignado a C

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
