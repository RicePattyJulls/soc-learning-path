# Soluciones — RED-M25-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Los rangos solapados dificultan decidir qué destino es local o remoto y pueden requerir renumeración o traducción diseñada. La VPN no corrige el solapamiento por sí sola.

### Criterios observables

- Identifica ambigüedad local/remota por solapamiento.
- Considera renumeración o traducción diseñada sin atribuir solución automática a VPN.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Sus rutas y asociaciones efectivas**

La tabla asociada y sus rutas definen la salida efectiva; el nombre privado no crea encaminamiento.

## Pregunta 2

**Respuesta: A. Asociación con tablas de routing diferentes**

Solo la tabla A contiene la ruta híbrida: probar A no acredita el recorrido de B.

## Referencias

- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
- **AWS-FLOW**: [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html). Cobertura y límites de registros de flujo; no PCAP.
- **AZ-FLOW**: [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview). Producto de registro de flujo y alcance por servicio.
