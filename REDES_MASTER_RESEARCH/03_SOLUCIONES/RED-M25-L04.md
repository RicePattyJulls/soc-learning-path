# Soluciones — RED-M25-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Tarifas/fecha de ingestión y almacenamiento, volumen esperado, retención y consultas/transferencias; añadir alcance y exclusiones de cobertura del producto elegido.

### Criterios observables

- Estima ingestión, almacenamiento y retención con tarifas fechadas.
- Incluye consultas, transferencias, volumen y límites de cobertura.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Una captura completa del payload de todos los paquetes**

Los flow logs aportan metadatos con exclusiones, no una copia íntegra del payload de cada paquete.

## Pregunta 2

**Respuesta: C. 300 GB**

10 × 30 = 300 GB brutos; volumen no permite inferir tarifa final sin precios ni transformación.

## Referencias

- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
- **AWS-FLOW**: [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html). Cobertura y límites de registros de flujo; no PCAP.
- **AZ-FLOW**: [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview). Producto de registro de flujo y alcance por servicio.
