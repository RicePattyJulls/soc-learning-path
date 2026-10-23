# RED-M09-L03 — Trunks y propagación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M09-L03","moduleId":"RED-M09","stageId":"RED-E02","objective":"Comprobar el recorrido de una VLAN por un trunk.","prerequisites":["RED-M09-L02"],"referenceIds":["BRIDGE","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M09-L03-Q01","RED-M09-L03-Q02"],"practiceId":"RED-M09-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M09-L03.md"} -->

## 1. Objetivo

Comprobar el recorrido de una VLAN por un trunk.

Prerrequisitos: [RED-M09-L02](../RED-E02/RED-M09-L02.md).

## 2. Comprende el mecanismo

Un trunk transporta varias VLAN según configuración, capacidades y políticas. Su existencia no garantiza que una VLAN concreta esté permitida ni activa de extremo a extremo. Los mecanismos de negociación o propagación de fabricantes no son obligatorios para todos los diseños; definir explícitamente modos y listas evita depender de supuestos. Para diagnosticar, sigue la misma VLAN por cada enlace y comprueba estado de forwarding, etiquetado y registros. Una VLAN puede existir en ambos switches y aun así quedar excluida en el enlace intermedio.

### Vocabulario de apoyo

- **Access y trunk**: Puerto de acceso para una VLAN de datos y enlace que transporta varias VLAN, según configuración.
- **802.1Q y VLAN nativa**: Etiquetado de VLAN y tratamiento configurado para tráfico sin etiqueta en ciertos trunks.
- **SVI**: Interfaz de capa 3 asociada a una VLAN para funciones IP.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Camino docente A—B—C. VLAN30 permitida A-B; enlace B-C permite solo 10,20. Hosts VLAN30 en A y C.

La lista B-C interrumpe la conectividad de esa VLAN. La existencia de VLAN30 en A y C no supera la exclusión intermedia.

## 4. Práctica individual

VLAN30 ya está permitida en todos los trunks y sigue fallando. Propón dos estados adicionales a revisar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debes seguir al diagnosticar un trunk?

- A. Solo la existencia de la VLAN en los dos switches extremos
- B. Solo que los extremos coincidan en la VLAN nativa
- C. Solo que los puertos físicos de todos los enlaces estén up
- D. La misma VLAN a lo largo de todos los enlaces

### Pregunta 2

¿Dónde está el bloqueo demostrado del ejemplo?

- A. En la lista permitida de B-C
- B. En el DNS público
- C. En la sintaxis del nombre del host
- D. En todos los puertos A-B

## 6. Aplicación profesional

- SOC: Correlacionar VLAN con zonas y rutas.
- Red Team autorizado: Comprobar de forma mínima el aislamiento entre segmentos.
- Evidencia del módulo: Matriz VLAN, config/estado y flujos permitidos.
- Criterio del módulo: Aislamiento y conectividad autorizada comprobados.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L04](../../05_RECURSOS/LABORATORIOS/RED-L04.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
