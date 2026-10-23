# RED-M09-L01 — VLAN y access ports

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M09-L01","moduleId":"RED-M09","stageId":"RED-E02","objective":"Asignar un puerto de acceso y distinguir pertenencia de autorización.","prerequisites":["RED-M02-L04","RED-M08-L04"],"referenceIds":["BRIDGE","STP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M09-L01-Q01","RED-M09-L01-Q02"],"practiceId":"RED-M09-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M09-L01.md"} -->

## 1. Objetivo

Asignar un puerto de acceso y distinguir pertenencia de autorización.

Prerrequisitos: [RED-M02-L04](../RED-E01/RED-M02-L04.md), [RED-M08-L04](../RED-E02/RED-M08-L04.md).

## 2. Comprende el mecanismo

Un puerto de acceso suele asociar las tramas sin etiqueta de un equipo a una VLAN configurada. El nombre de la VLAN es administrativo; lo que importa para la pertenencia es su identificación y tratamiento efectivo. Una VLAN de voz puede introducir reglas adicionales en un puerto con teléfono y equipo, según plataforma. Asignar VLAN no equivale a autenticar al usuario ni a impedir todo acceso a otros segmentos. Documentar dirección del gateway y política L3 permite comprobar la función real de esa segmentación.

### Vocabulario de apoyo

- **Access y trunk**: Puerto de acceso para una VLAN de datos y enlace que transporta varias VLAN, según configuración.
- **802.1Q y VLAN nativa**: Etiquetado de VLAN y tratamiento configurado para tráfico sin etiqueta en ciertos trunks.
- **SVI**: Interfaz de capa 3 asociada a una VLAN para funciones IP.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Diseño: PC-A en VLAN20. Estado docente: p5 access VLAN10; DHCP devuelve ámbito de VLAN10.

El puerto introduce al cliente en otro dominio de broadcast. La dirección recibida es coherente con la configuración efectiva, aunque contradice el diseño.

## 4. Práctica individual

El puerto se corrige a VLAN20, pero el equipo conserva concesión de VLAN10. ¿Qué estado debe comprobarse después?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué determina la pertenencia efectiva del ejemplo?

- A. El nombre administrativo VLAN20 sin asignarlo al puerto
- B. La VLAN indicada en el diseño aunque p5 tenga otra configuración
- C. La subred que esperaba recibir el usuario antes de conectar
- D. La VLAN de acceso configurada en p5

### Pregunta 2

¿Qué explica recibir DHCP de VLAN10?

- A. VLAN20 no puede usar IPv4
- B. El cliente está conectado efectivamente a VLAN10
- C. El DNS modificó la etiqueta
- D. Todas las VLAN comparten siempre DHCP sin relay

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
