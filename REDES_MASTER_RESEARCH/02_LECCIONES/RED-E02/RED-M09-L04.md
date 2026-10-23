# RED-M09-L04 — Inter-VLAN y troubleshooting

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M09-L04","moduleId":"RED-M09","stageId":"RED-E02","objective":"Distinguir routing inter-VLAN, gateway y política de acceso.","prerequisites":["RED-M09-L03"],"referenceIds":["BRIDGE","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M09-L04-Q01","RED-M09-L04-Q02"],"practiceId":"RED-M09-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M09-L04.md"} -->

## 1. Objetivo

Distinguir routing inter-VLAN, gateway y política de acceso.

Prerrequisitos: [RED-M09-L03](../RED-E02/RED-M09-L03.md).

## 2. Comprende el mecanismo

Dos VLAN necesitan una función L3, como SVI o subinterfaces, para intercambiar tráfico encaminado. Cada host debe usar dirección, prefijo y gateway coherentes con su segmento. La SVI puede depender de que su VLAN tenga puertos activos según plataforma; revisar estado real importa. Una vez existe ruta, ACL o firewall pueden permitir solo ciertos servicios. El diagnóstico debe recorrer ida y retorno y separar fallo de VLAN, ausencia de ruta y denegación de política; ninguna etiqueta VLAN verifica por sí sola una autorización.

### Vocabulario de apoyo

- **Access y trunk**: Puerto de acceso para una VLAN de datos y enlace que transporta varias VLAN, según configuración.
- **802.1Q y VLAN nativa**: Etiquetado de VLAN y tratamiento configurado para tráfico sin etiqueta en ciertos trunks.
- **SVI**: Interfaz de capa 3 asociada a una VLAN para funciones IP.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cliente VLAN10 llega a su gateway. Servidor VLAN20 recibe SYN, pero envía la respuesta a un gateway antiguo.

El tráfico de ida alcanza al servidor; el retorno usa una salida incorrecta. Cambiar el trunk que ya transportó el SYN no explica esa evidencia.

## 4. Práctica individual

El retorno es correcto y el firewall registra deny para TCP/445. Explica el nuevo diagnóstico.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta una SVI?

- A. Una respuesta DNS autoritativa
- B. Una interfaz L3 asociada a una VLAN
- C. Cifrado obligatorio de todas las tramas
- D. Un reemplazo universal de 802.1X

### Pregunta 2

¿Qué está demostrado en el ejemplo?

- A. Existe camino de ida hasta el servidor y retorno mal configurado
- B. Todos los trunks están caídos
- C. El SYN nunca salió del cliente
- D. La VLAN20 no existe

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
