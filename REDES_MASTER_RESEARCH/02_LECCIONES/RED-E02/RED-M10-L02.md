# RED-M10-L02 — Root bridge y convergencia

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M10-L02","moduleId":"RED-M10","stageId":"RED-E02","objective":"Predecir elección del root y límites de una reconvergencia.","prerequisites":["RED-M10-L01"],"referenceIds":["STP","BRIDGE","BONDING"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M10-L02-Q01","RED-M10-L02-Q02"],"practiceId":"RED-M10-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M10-L02.md"} -->

## 1. Objetivo

Predecir elección del root y límites de una reconvergencia.

Prerrequisitos: [RED-M10-L01](../RED-E02/RED-M10-L01.md).

## 2. Comprende el mecanismo

La elección del root considera el identificador de bridge, donde prioridad e identificadores adicionales según variante preceden a la MAC como desempate. No depende directamente de que un switch tenga más CPU o puertos. Costes y desempates de puerto determinan caminos hacia el root. Una modificación planificada debe revisar root esperado por instancia y efectos sobre uplinks. Medir convergencia exige observar la recuperación del servicio: que el control declare un nuevo rol no prueba que la aplicación ya esté operativa.

### Vocabulario de apoyo

- **STP, root y BPDU**: Protocolo para evitar bucles L2, puente de referencia y mensajes usados por ese control.
- **LACP**: Protocolo que negocia qué enlaces pertenecen a una agregación.
- **Convergencia**: Adaptación del estado de red tras un cambio; la recuperación de servicio también debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Instancia docente: A prioridad 4096; B prioridad 32768; resto de parámetros comparables. A es candidato preferido.

La prioridad menor favorece A en la comparación del identificador. No es una decisión basada en velocidad de CPU.

## 4. Práctica individual

Se desconecta un uplink y la aplicación tarda 4 s en recuperarse. ¿Qué mediciones separarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué candidato se prefiere con los datos del ejemplo?

- A. B por tener número mayor
- B. A con prioridad 4096
- C. El de CPU más rápida necesariamente
- D. El que responde primero a DNS

### Pregunta 2

¿Qué valida mejor la recuperación percibida?

- A. Un contador histórico sin intervalo
- B. Un intercambio de aplicación además del estado de control
- C. Ver un LED encendido
- D. Solo cambiar el nombre del root

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
