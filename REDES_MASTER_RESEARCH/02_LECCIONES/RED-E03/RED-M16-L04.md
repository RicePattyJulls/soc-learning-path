# RED-M16-L04 — Pruebas de fallo y recuperación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M16-L04","moduleId":"RED-M16","stageId":"RED-E03","objective":"Diseñar un ensayo de redundancia reversible y verificable.","prerequisites":["RED-M16-L03"],"referenceIds":["RFC9568","RFC5880","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M16-L04-Q01","RED-M16-L04-Q02"],"practiceId":"RED-M16-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M16-L04.md"} -->

## 1. Objetivo

Diseñar un ensayo de redundancia reversible y verificable.

Prerrequisitos: [RED-M16-L03](../RED-E03/RED-M16-L03.md).

## 2. Comprende el mecanismo

Un ensayo de fallo necesita un estado inicial, un fallo definido, observadores y una restauración comprobable. Probar una pérdida de enlace no equivale a probar pérdida de energía, caída de proceso o fallo del proveedor. Registra alcance e impacto admitido y conserva un camino de gestión cuando proceda. Además del resultado positivo, incluye un control negativo para demostrar que el método detecta una avería real. La recuperación del servicio y la restitución de redundancia son hitos distintos: funcionar por una única vía deja riesgo residual.

### Vocabulario de apoyo

- **FHRP**: Familia de protocolos de redundancia del gateway de primer salto, como VRRP o HSRP.
- **BFD**: Mecanismo de detección de continuidad integrado con otras funciones de routing.
- **Preemption**: Recuperación del rol preferido cuando vuelve un candidato mejor, según protocolo y configuración.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Plan docente: retirar enlace A; mantener B; medir servicio; restaurar A; comprobar ambos enlaces y política original.

La prueba no termina al recibir tráfico por B. Deben verificarse restauración, redundancia y ausencia de estados persistentes no deseados.

## 4. Práctica individual

Tras restaurar A, el servicio funciona pero B queda administrativamente apagado. Clasifica el resultado.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué distingue recuperación y restauración?

- A. Restaurar significa borrar evidencias
- B. Recuperar servicio no implica restituir toda la redundancia
- C. Son siempre el mismo evento
- D. Recuperar exige cambiar de protocolo

### Pregunta 2

¿Qué falta en el resultado propuesto?

- A. Abrir todos los puertos
- B. Restituir B y comprobar redundancia
- C. Un nuevo nombre DNS para A
- D. Eliminar el registro del cambio

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
