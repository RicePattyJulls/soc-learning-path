# RED-M16-L01 — FHRP y elección

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M16-L01","moduleId":"RED-M16","stageId":"RED-E03","objective":"Explicar qué protege una dirección de gateway virtual.","prerequisites":["RED-M09-L04","RED-M10-L04","RED-M12-L04"],"referenceIds":["RFC9568","RFC5880","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M16-L01-Q01","RED-M16-L01-Q02"],"practiceId":"RED-M16-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M16-L01.md"} -->

## 1. Objetivo

Explicar qué protege una dirección de gateway virtual.

Prerrequisitos: [RED-M09-L04](../RED-E02/RED-M09-L04.md), [RED-M10-L04](../RED-E02/RED-M10-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md).

## 2. Comprende el mecanismo

Un protocolo de redundancia de primer salto permite mantener una dirección de gateway para hosts mientras cambia el equipo que la atiende. VRRP y HSRP tienen mecanismos y soporte diferentes; no son nombres intercambiables de una misma implementación. Prioridades, temporizadores, preemption y seguimiento de recursos influyen en elección y recuperación. Tener dos routers no garantiza que la salida funcione si ambos dependen de un único enlace aguas arriba. La propiedad virtual debe comprobarse junto con forwarding y retorno.

### Vocabulario de apoyo

- **FHRP**: Familia de protocolos de redundancia del gateway de primer salto, como VRRP o HSRP.
- **BFD**: Mecanismo de detección de continuidad integrado con otras funciones de routing.
- **Preemption**: Recuperación del rol preferido cuando vuelve un candidato mejor, según protocolo y configuración.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: gateway virtual=192.0.2.1; R1 atiende; R2 espera; falla solo la WAN de R1 y su LAN permanece activa.

Si la elección solo observa la LAN, R1 puede seguir atendiendo el gateway sin salida útil. Hace falta relacionar la decisión con el recurso que se desea proteger.

## 4. Práctica individual

Diseña una prueba que distinga fallo del router de fallo de su enlace aguas arriba.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué preserva un FHRP para los hosts?

- A. Todas las sesiones de aplicación necesariamente
- B. Cifrado de todos los datos
- C. Un gateway lógico mientras cambia quien lo atiende
- D. Una dirección MAC única mundial

### Pregunta 2

¿Qué riesgo demuestra el caso?

- A. Un conflicto DNS probado
- B. Ausencia obligatoria de VLAN
- C. Un puerto TCP demasiado bajo
- D. Gateway activo sin salida WAN funcional

## 6. Aplicación profesional

- SOC: Separar fallo previsto de anomalía.
- Red Team autorizado: Evaluar rutas alternativas bajo fallo autorizado.
- Evidencia del módulo: Cronología de reconvergencia, tablas y reporte.
- Criterio del módulo: Recuperación funcional y medida; no ocultar fallos.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L08](../../05_RECURSOS/LABORATORIOS/RED-L08.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC9568**: [RFC 9568: Virtual Router Redundancy Protocol Version 3](https://www.rfc-editor.org/rfc/rfc9568.html). Gateway virtual y redundancia IPv4/IPv6.
- **RFC5880**: [RFC 5880: Bidirectional Forwarding Detection](https://www.rfc-editor.org/rfc/rfc5880.html). Detección de continuidad; no cálculo de ruta.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
