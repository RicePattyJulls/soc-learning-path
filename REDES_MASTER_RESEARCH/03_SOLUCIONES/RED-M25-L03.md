# Soluciones — RED-M25-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Soporte y configuración de transitividad/rutas del proveedor y pruebas de ida/retorno; no inferirlo por dibujar dos enlaces en el diagrama.

### Criterios observables

- Pide soporte y configuración de tránsito del proveedor.
- Verifica rutas y pruebas de ida/retorno sin deducir A-C de dos peerings.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Resolución del nombre hacia la dirección apropiada**

La VPN por IP no configura por sí sola el resolver ni garantiza que el nombre elija esa IP.

## Pregunta 2

**Respuesta: D. La resolución desde sede hacia el destino privado esperado**

Desde sede se resuelve una dirección pública, distinta del destino privado esperado para el servicio híbrido.

## Referencias

- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
- **AWS-FLOW**: [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html). Cobertura y límites de registros de flujo; no PCAP.
- **AZ-FLOW**: [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview). Producto de registro de flujo y alcance por servicio.
