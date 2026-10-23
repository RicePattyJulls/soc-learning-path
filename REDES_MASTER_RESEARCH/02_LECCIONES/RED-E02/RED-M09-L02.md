# RED-M09-L02 — Etiquetado 802.1Q/nativa

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M09-L02","moduleId":"RED-M09","stageId":"RED-E02","objective":"Razonar sobre etiquetas 802.1Q y discrepancias de VLAN nativa.","prerequisites":["RED-M09-L01"],"referenceIds":["BRIDGE","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M09-L02-Q01","RED-M09-L02-Q02"],"practiceId":"RED-M09-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M09-L02.md"} -->

## 1. Objetivo

Razonar sobre etiquetas 802.1Q y discrepancias de VLAN nativa.

Prerrequisitos: [RED-M09-L01](../RED-E02/RED-M09-L01.md).

## 2. Comprende el mecanismo

802.1Q permite identificar VLAN en tramas Ethernet etiquetadas. En ciertos trunks, una VLAN nativa recibe tratamiento sin etiqueta, pero algunos equipos pueden etiquetarla por configuración; no asumas una regla universal para toda plataforma. Si los extremos asignan tramas sin etiqueta a VLAN diferentes, aparece una discrepancia peligrosa y difícil de diagnosticar. La VLAN nativa, las permitidas y el modo de puerto son parámetros distintos. No arreglar un mismatch dejando todo el tráfico permitido sin entender sus efectos.

### Vocabulario de apoyo

- **Access y trunk**: Puerto de acceso para una VLAN de datos y enlace que transporta varias VLAN, según configuración.
- **802.1Q y VLAN nativa**: Etiquetado de VLAN y tratamiento configurado para tráfico sin etiqueta en ciertos trunks.
- **SVI**: Interfaz de capa 3 asociada a una VLAN para funciones IP.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Trunk docente: extremo A interpreta sin etiqueta como VLAN10; extremo B como VLAN20.

Una trama sin etiqueta puede clasificarse en dominios distintos según el extremo. Comparar ambos lados explica el fallo mejor que mirar solo una tabla de direcciones.

## 4. Práctica individual

Ambos extremos coinciden en la nativa, pero VLAN30 no pasa. ¿Qué otra condición revisarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué identifica una etiqueta 802.1Q?

- A. El nombre DNS del destino
- B. La VLAN de la trama etiquetada
- C. La identidad humana del emisor
- D. El certificado TLS

### Pregunta 2

¿Qué riesgo presenta el ejemplo?

- A. Un cambio automático de IPv4 a IPv6
- B. Interpretación diferente de tramas sin etiqueta
- C. Fragmentación TCP obligatoria
- D. Una clave SSH demasiado larga

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
