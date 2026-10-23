# Soluciones — RED-M25-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Separar contratos de producto, estado, prioridades y asociaciones; comprobar documentación y política efectiva del recurso concreto.

### Criterios observables

- Separa proveedor y producto, estado, prioridades y asociaciones.
- Comprueba política efectiva con documentación específica.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. La network ACL de subred de AWS**

La NACL de AWS es stateless; SG de AWS y NSG de Azure mantienen contexto según su contrato.

## Pregunta 2

**Respuesta: D. La NACL del camino de retorno**

El permiso SG no anula otro control: la NACL deniega el puerto de retorno del cliente.

## Referencias

- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
- **AWS-FLOW**: [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html). Cobertura y límites de registros de flujo; no PCAP.
- **AZ-FLOW**: [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview). Producto de registro de flujo y alcance por servicio.
