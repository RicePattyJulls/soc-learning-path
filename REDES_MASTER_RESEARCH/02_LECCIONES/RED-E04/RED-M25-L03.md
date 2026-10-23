# RED-M25-L03 — DNS, VPN y peering

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M25-L03","moduleId":"RED-M25","stageId":"RED-E04","objective":"Comprobar conectividad híbrida y resolución por separado.","prerequisites":["RED-M25-L02"],"referenceIds":["AWS-ACL","AZ-NSG","AWS-FLOW","AZ-FLOW"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M25-L03-Q01","RED-M25-L03-Q02"],"practiceId":"RED-M25-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M25-L03.md"} -->

## 1. Objetivo

Comprobar conectividad híbrida y resolución por separado.

Prerrequisitos: [RED-M25-L02](../RED-E04/RED-M25-L02.md).

## 2. Comprende el mecanismo

Una VPN o peering requiere rutas, políticas y tratamiento de DNS para los servicios que se quieren consumir. La transitividad no debe suponerse: tener A conectado a B y B a C no garantiza A-C en un producto o diseño concreto. Resolvers, zonas privadas y forwarding de nombres pueden diferir de conectividad por IP. Compara prefijos anunciados, rangos solapados, next hop y retorno antes de cambiar autenticación. Define responsabilidad de sede y cloud para registrar y recuperar el servicio.

### Vocabulario de apoyo

- **VPC y VNet**: Recursos de red virtual de AWS y Azure con contratos y controles propios.
- **Security group, NACL y NSG**: Controles concretos de AWS o Azure; no se presume que compartan evaluación o estado.
- **Peering y flow logs**: Interconexión de redes y registros de metadatos de tráfico con cobertura definida por producto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: sede alcanza IP privada del servicio cloud; el nombre resuelve a una dirección pública desde el resolver de sede.

La VPN tiene un camino que puede funcionar, pero la resolución dirige al cliente por otro destino. DNS y routing deben integrarse explícitamente.

## 4. Práctica individual

A y C tienen peerings separados con B. ¿Qué evidencia pedirías antes de declarar tránsito entre A y C?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no garantiza una VPN funcional por IP?

- A. Resolución del nombre hacia la dirección apropiada
- B. Posibilidad de medir tráfico
- C. Un extremo de túnel configurado
- D. Un camino observado para esa IP

### Pregunta 2

¿Qué dependencia falla en el caso?

- A. La negociación LACP necesariamente
- B. La existencia de todos los paquetes IP
- C. La potencia PoE del servicio cloud
- D. La resolución desde sede hacia el destino privado esperado

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
