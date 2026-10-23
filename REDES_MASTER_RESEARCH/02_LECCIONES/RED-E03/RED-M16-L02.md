# RED-M16-L02 — BFD y monitoreo

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M16-L02","moduleId":"RED-M16","stageId":"RED-E03","objective":"Distinguir detección rápida de fallo y recuperación efectiva.","prerequisites":["RED-M16-L01"],"referenceIds":["RFC9568","RFC5880","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M16-L02-Q01","RED-M16-L02-Q02"],"practiceId":"RED-M16-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M16-L02.md"} -->

## 1. Objetivo

Distinguir detección rápida de fallo y recuperación efectiva.

Prerrequisitos: [RED-M16-L01](../RED-E03/RED-M16-L01.md).

## 2. Comprende el mecanismo

BFD comprueba continuidad bidireccional de un camino de forwarding según su modo e integración. Puede notificar a protocolos que usan esa señal, pero no calcula por sí solo una ruta alternativa. Temporizadores muy agresivos pueden producir falsos cambios si el equipo no los soporta bajo carga. Una prueba de disponibilidad debe distinguir caída física, pérdida de Hellos, caída BFD, retirada de ruta y recuperación de aplicación. El temporizador configurado no equivale a un tiempo de recuperación medido de extremo a extremo.

### Vocabulario de apoyo

- **FHRP**: Familia de protocolos de redundancia del gateway de primer salto, como VRRP o HSRP.
- **BFD**: Mecanismo de detección de continuidad integrado con otras funciones de routing.
- **Preemption**: Recuperación del rol preferido cuando vuelve un candidato mejor, según protocolo y configuración.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cronología docente: BFD down a 10:00:00.100; FIB alternativa a .400; aplicación responde a 10:00:02.000.

La detección ocurrió antes que la recuperación. El servicio tardó más que BFD porque intervienen routing, forwarding y estado de aplicación.

## 4. Práctica individual

BFD oscila solo durante picos de CPU y no hay pérdida de enlace demostrada. ¿Qué contraste harías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no hace BFD por sí solo?

- A. Producir un cambio de estado
- B. Detectar un fallo de continuidad según su sesión
- C. Informar a protocolos integrados
- D. Calcular la ruta alternativa completa

### Pregunta 2

¿Cuándo se recuperó la aplicación del caso?

- A. Antes de que hubiera cualquier prueba
- B. Al configurar BFD
- C. A las 10:00:02.000
- D. Necesariamente a las 10:00:00.100

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
