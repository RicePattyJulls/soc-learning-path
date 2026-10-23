# RED-M02-L04 — Diagnóstico de direcciones

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M02-L04","moduleId":"RED-M02","stageId":"RED-E01","objective":"Diagnosticar máscara, gateway y direcciones duplicadas con evidencia.","prerequisites":["RED-M02-L03"],"referenceIds":["RFC4632","RFC3021","PY-IP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M02-L04-Q01","RED-M02-L04-Q02"],"practiceId":"RED-M02-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M02-L04.md"} -->

## 1. Objetivo

Diagnosticar máscara, gateway y direcciones duplicadas con evidencia.

Prerrequisitos: [RED-M02-L03](../RED-E01/RED-M02-L03.md).

## 2. Comprende el mecanismo

El host decide si un destino está en su enlace usando su prefijo y su tabla de rutas. Una máscara equivocada puede hacerle intentar ARP para una dirección que debería alcanzar por gateway. Un gateway debe ser alcanzable según la configuración del enlace; que su dirección parezca cercana no lo demuestra. Una dirección duplicada se investiga contrastando asignación, respuestas de vecinos y tiempo; cambios de MAC también pueden ser legítimos en alta disponibilidad. Documenta IP, prefijo, gateway, ruta seleccionada y origen de la asignación.

### Vocabulario de apoyo

- **CIDR**: Notación /n que expresa cuántos bits del bloque son prefijo de red.
- **VLSM**: Asignación de subredes de tamaños distintos dentro de un bloque padre.
- **Broadcast IPv4**: Dirección para todos los hosts del dominio correspondiente; se reserva en las subredes convencionales del ejercicio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Host A=192.0.2.10/24; diseño aprobado=/25; destino=192.0.2.200; captura docente muestra solicitudes ARP por el destino sin respuesta.

La máscara /24 hace que A trate el destino como local. El diseño /25 esperaba enviarlo al router; corregir el prefijo es una hipótesis verificable antes de culpar al DNS.

## 4. Práctica individual

A usa ya /25 y no alcanza ni a su gateway. Propón dos comprobaciones que distingan dirección duplicada de VLAN incorrecta.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué explica el ARP del ejemplo hacia 192.0.2.200?

- A. El DNS está necesariamente caído
- B. El host considera local el destino por su /24 en vez del /25 previsto
- C. ARP resuelve siempre todas las redes
- D. El destino ha autenticado al usuario

### Pregunta 2

¿Qué dato falta para afirmar una duplicidad?

- A. Corroboración de asignaciones y respuestas IP/MAC en el tiempo
- B. Un cambio aislado de MAC en un gateway redundante
- C. La discrepancia de máscara del diseño, sin contrastar vecinos
- D. Solo la configuración IP de uno de los hosts

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
