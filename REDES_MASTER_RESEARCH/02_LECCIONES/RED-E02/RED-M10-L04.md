# RED-M10-L04 — LACP/port channels

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M10-L04","moduleId":"RED-M10","stageId":"RED-E02","objective":"Interpretar agregación LACP y sus límites por flujo.","prerequisites":["RED-M10-L03"],"referenceIds":["STP","BRIDGE","BONDING"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M10-L04-Q01","RED-M10-L04-Q02"],"practiceId":"RED-M10-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M10-L04.md"} -->

## 1. Objetivo

Interpretar agregación LACP y sus límites por flujo.

Prerrequisitos: [RED-M10-L03](../RED-E02/RED-M10-L03.md).

## 2. Comprende el mecanismo

LACP negocia pertenencia de enlaces a una agregación; modos y parámetros deben ser compatibles. La distribución habitual usa un hash de campos del flujo para mantener orden, por lo que un único flujo no obtiene necesariamente la suma de velocidades de todos los miembros. VLAN, MTU y modo L2/L3 del agregado deben ser coherentes según plataforma. Un miembro suspendido puede reflejar incompatibilidad, no cable roto. Para validar, comprueba membresía, capacidad agregada con varios flujos y comportamiento al perder un enlace.

### Vocabulario de apoyo

- **STP, root y BPDU**: Protocolo para evitar bucles L2, puente de referencia y mensajes usados por ese control.
- **LACP**: Protocolo que negocia qué enlaces pertenecen a una agregación.
- **Convergencia**: Adaptación del estado de red tras un cambio; la recuperación de servicio también debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Agregado docente: 2 enlaces de 1 Gb/s; un flujo TCP usa uno y mide 900 Mb/s; varios flujos se distribuyen.

El resultado es compatible con balanceo por flujo. No demuestra que LACP haya fallado ni que un único flujo deba alcanzar 2 Gb/s.

## 4. Práctica individual

Uno de los miembros tiene otra MTU y queda excluido. Describe la evidencia que conservarías.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué limita normalmente el ancho de banda de un único flujo?

- A. Su asignación a un miembro mediante el hash
- B. La prioridad del root únicamente
- C. El número de registros DNS
- D. La suma obligatoria de todos los miembros

### Pregunta 2

¿Qué demuestra medir 900 Mb/s en el caso?

- A. Que ambos cables están rotos
- B. Fracaso seguro de LACP
- C. Un resultado compatible con un flujo sobre un miembro de 1 Gb/s
- D. Una capacidad de 2 Gb/s para cualquier flujo

## 6. Aplicación profesional

- SOC: Reconocer pérdida/duplicación por convergencia.
- Red Team autorizado: Ensayar controles solo en switches simulados.
- Evidencia del módulo: Estados de puerto, cambios y pruebas de recuperación.
- Criterio del módulo: Restaurar la topología y justificar árbol activo.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L04](../../05_RECURSOS/LABORATORIOS/RED-L04.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **BONDING**: [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html). Agregación y modos de reparto; verificar soporte por implementación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
