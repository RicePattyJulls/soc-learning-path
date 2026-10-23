# RED-M25-L02 — SG/NSG/NACL conceptuales

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M25-L02","moduleId":"RED-M25","stageId":"RED-E04","objective":"Comparar controles cloud sin inventar equivalencia entre proveedores.","prerequisites":["RED-M25-L01"],"referenceIds":["AWS-ACL","AZ-NSG","AWS-FLOW","AZ-FLOW"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M25-L02-Q01","RED-M25-L02-Q02"],"practiceId":"RED-M25-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M25-L02.md"} -->

## 1. Objetivo

Comparar controles cloud sin inventar equivalencia entre proveedores.

Prerrequisitos: [RED-M25-L01](../RED-E04/RED-M25-L01.md).

## 2. Comprende el mecanismo

AWS security groups mantienen estado de conexiones; las network ACL de subred son stateless y tienen reglas ordenadas. Azure NSG mantiene estado y aplica reglas con prioridades y reglas predeterminadas según su contrato. No trasladar sintaxis, evaluación o comportamiento de sesiones existentes de un producto a otro. La política efectiva combina asociaciones, rutas y servicios intermedios. Un control que permite ida no asegura retorno a través de otro control stateless. Registrar proveedor, recurso, dirección y familia IP evita hablar de una ACL cloud genérica inexistente.

### Vocabulario de apoyo

- **VPC y VNet**: Recursos de red virtual de AWS y Azure con contratos y controles propios.
- **Security group, NACL y NSG**: Controles concretos de AWS o Azure; no se presume que compartan evaluación o estado.
- **Peering y flow logs**: Interconexión de redes y registros de metadatos de tráfico con cobertura definida por producto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente AWS: security group permite TCP/443; NACL de subred deniega retorno a puertos de cliente.

El permiso del security group no anula la NACL. Debe satisfacerse el camino completo y las reglas stateless de retorno.

## 4. Práctica individual

Un informe afirma que NSG y NACL tienen exactamente las mismas garantías por sus nombres. ¿Qué corregirías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuál de los controles citados es stateless?

- A. El security group de AWS
- B. El NSG de Azure como afirmación general
- C. La network ACL de subred de AWS
- D. Todo control cloud siempre

### Pregunta 2

¿Qué bloquea el caso aunque el security group permita?

- A. El security group como única decisión efectiva de todo el camino
- B. Que NACL herede automáticamente el estado creado por el security group
- C. Una conexión DNS exitosa como prueba de retorno TCP permitido
- D. La NACL del camino de retorno

## 6. Aplicación profesional

- SOC: Analizar fuentes cloud con procedencia explícita.
- Red Team autorizado: Validar acceso remoto sin desplegar infraestructura real.
- Evidencia del módulo: Plano y controles por proveedor etiquetados; supuestos de coste.
- Criterio del módulo: Identifica rutas y puntos de inspección; no presupone equivalencias.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L12](../../05_RECURSOS/LABORATORIOS/RED-L12.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
- **AWS-FLOW**: [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html). Cobertura y límites de registros de flujo; no PCAP.
- **AZ-FLOW**: [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview). Producto de registro de flujo y alcance por servicio.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
