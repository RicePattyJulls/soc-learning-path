# Soluciones — RED-M21-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Probar conexiones nuevas y estado existente por separado, con versión y semántica documentadas. Un cambio de regla no implica idéntico efecto inmediato sobre todas las sesiones.

### Criterios observables

- Prueba conexiones nuevas y ya existentes por separado.
- Documenta semántica y versión para interpretar el efecto de editar reglas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Contexto de conversaciones según su implementación**

El seguimiento relaciona paquetes con estado previo; no confía en todo ACK ni cifra necesariamente el tráfico.

## Pregunta 2

**Respuesta: A. Su regla stateless no permite el puerto de respuesta del cliente**

La respuesta va al puerto efímero del cliente y el filtro stateless lo deniega.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
