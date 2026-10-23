# RED-M16-L03 — Convergencia L2/L3

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M16-L03","moduleId":"RED-M16","stageId":"RED-E03","objective":"Medir componentes de convergencia sin sumar tiempos incompatibles.","prerequisites":["RED-M16-L02"],"referenceIds":["RFC9568","RFC5880","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M16-L03-Q01","RED-M16-L03-Q02"],"practiceId":"RED-M16-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M16-L03.md"} -->

## 1. Objetivo

Medir componentes de convergencia sin sumar tiempos incompatibles.

Prerrequisitos: [RED-M16-L02](../RED-E03/RED-M16-L02.md).

## 2. Comprende el mecanismo

La recuperación puede requerir detección, decisión del protocolo, actualización de RIB/FIB y adaptación de sesiones. Parte de estos procesos puede solaparse; no sumar temporizadores nominales como si todos se ejecutaran siempre en serie. Una topología L2 y una L3 pueden converger con mecanismos distintos y afectar rutas asimétricas. Define el servicio y criterio de éxito: primer ping, flujo continuo o transacción completa no tienen el mismo significado. Compara el mismo método antes y después de optimizar.

### Vocabulario de apoyo

- **FHRP**: Familia de protocolos de redundancia del gateway de primer salto, como VRRP o HSRP.
- **BFD**: Mecanismo de detección de continuidad integrado con otras funciones de routing.
- **Preemption**: Recuperación del rol preferido cuando vuelve un candidato mejor, según protocolo y configuración.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Ensayo docente: primer ping recuperado en 0,8 s; transacción de aplicación en 3,2 s; mediciones con relojes sincronizados.

Ambos números pueden ser correctos y medir propiedades diferentes. Declarar recuperación del servicio a 0,8 s ocultaría su dependencia de aplicación.

## 4. Práctica individual

Un informe compara ping de un cambio con HTTP de otro y afirma que el segundo empeoró. Identifica el defecto del método.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué exige comparar dos medidas de convergencia?

- A. Usar solo el mejor resultado
- B. Un criterio de éxito y método comparables
- C. Ignorar la aplicación
- D. Sumar cualquier temporizador disponible

### Pregunta 2

¿Qué acredita el ping a 0,8 s?

- A. Ausencia futura de fallos
- B. Recuperación de esa prueba ICMP en ese instante
- C. Todas las sesiones preservadas
- D. Éxito de la transacción a 0,8 s

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
