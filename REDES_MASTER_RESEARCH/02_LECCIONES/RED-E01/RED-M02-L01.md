# RED-M02-L01 — Direcciones, máscaras y CIDR

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M02-L01","moduleId":"RED-M02","stageId":"RED-E01","objective":"Calcular red, rango y pertenencia mediante un prefijo IPv4.","prerequisites":["RED-M01-L04"],"referenceIds":["RFC4632","RFC3021","PY-IP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M02-L01-Q01","RED-M02-L01-Q02"],"practiceId":"RED-M02-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M02-L01.md"} -->

## 1. Objetivo

Calcular red, rango y pertenencia mediante un prefijo IPv4.

Prerrequisitos: [RED-M01-L04](../RED-E01/RED-M01-L04.md).

## 2. Comprende el mecanismo

IPv4 tiene 32 bits. Un prefijo /n fija n bits de red; los restantes distinguen direcciones dentro del bloque. En una subred convencional /26 hay 64 direcciones, normalmente 62 asignables a hosts porque red y broadcast tienen funciones reservadas. No extrapoles esa resta a todos los prefijos: /31 puede emplearse en enlaces punto a punto compatibles y /32 identifica una dirección individual. Las redes privadas RFC 1918 no son rutas públicas globales; una dirección de documentación tampoco debe usarse como objetivo real.

### Vocabulario de apoyo

- **CIDR**: Notación /n que expresa cuántos bits del bloque son prefijo de red.
- **VLSM**: Asignación de subredes de tamaños distintos dentro de un bloque padre.
- **Broadcast IPv4**: Dirección para todos los hosts del dominio correspondiente; se reserva en las subredes convencionales del ejercicio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Ejercicio sintético: 192.0.2.70/26. Bloques del último octeto: 0, 64, 128, 192.

70 pertenece al bloque 64–127: red 192.0.2.64, broadcast .127 y hosts convencionales .65–.126. El prefijo determina el rango, no una clase histórica A/B/C.

## 4. Práctica individual

Calcula red y broadcast de 192.0.2.130/26 y comprueba si .126 pertenece a esa subred.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuántas direcciones contiene un /26?

- A. 64
- B. 26
- C. 256
- D. 62 en total

### Pregunta 2

¿Cuál es la red de 192.0.2.70/26?

- A. 192.0.2.64/26
- B. 192.0.2.0/24
- C. 192.0.2.128/26
- D. 192.0.2.70/26

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
