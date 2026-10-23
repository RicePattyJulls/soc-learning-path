# RED-M25-L01 — VNet/VPC, subredes y tablas

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M25-L01","moduleId":"RED-M25","stageId":"RED-E04","objective":"Seguir routing de una red cloud sin suponer conectividad por proximidad.","prerequisites":["RED-M18-L04","RED-M20-L04","RED-M21-L04","RED-M22-L04"],"referenceIds":["AWS-ACL","AZ-NSG","AWS-FLOW","AZ-FLOW"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M25-L01-Q01","RED-M25-L01-Q02"],"practiceId":"RED-M25-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M25-L01.md"} -->

## 1. Objetivo

Seguir routing de una red cloud sin suponer conectividad por proximidad.

Prerrequisitos: [RED-M18-L04](../RED-E03/RED-M18-L04.md), [RED-M20-L04](../RED-E04/RED-M20-L04.md), [RED-M21-L04](../RED-E04/RED-M21-L04.md), [RED-M22-L04](../RED-E04/RED-M22-L04.md).

## 2. Comprende el mecanismo

VPC y VNet delimitan recursos de red de proveedores concretos, con tablas, subredes y servicios que no son idénticos entre plataformas. Una subred privada se caracteriza por sus rutas y exposición, no solo por una IP de rango privado. Asociar una tabla equivocada puede desviar tráfico hacia una appliance o dejarlo sin salida. Switching virtual y overlays como VXLAN añaden encapsulación, pero la experiencia del usuario depende del routing y de controles efectivos. Revisa también prefijos solapados entre cloud y sede.

### Vocabulario de apoyo

- **VPC y VNet**: Recursos de red virtual de AWS y Azure con contratos y controles propios.
- **Security group, NACL y NSG**: Controles concretos de AWS o Azure; no se presume que compartan evaluación o estado.
- **Peering y flow logs**: Interconexión de redes y registros de metadatos de tráfico con cobertura definida por producto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: dos subredes usan tablas diferentes; solo la tabla A apunta al gateway híbrido para el prefijo de la sede.

La conectividad desde A no demuestra conectividad desde B. Las asociaciones de tablas son parte del camino que debe verificarse.

## 4. Práctica individual

Una sede y la cloud usan el mismo prefijo interno. Explica el problema antes de crear una VPN.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué define que una subred tenga determinada salida?

- A. Sus rutas y asociaciones efectivas
- B. Solo que su prefijo tenga formato de dirección privada
- C. Solo el nombre asignado a la subred en el portal
- D. Que otra subred de la misma red virtual tenga una ruta funcional

### Pregunta 2

¿Qué explica la diferencia A/B?

- A. Asociación con tablas de routing diferentes
- B. Todas las subredes cloud son aisladas siempre
- C. El tráfico no utiliza IP
- D. La VPN elimina tablas automáticamente

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
