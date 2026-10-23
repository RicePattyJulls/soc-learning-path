# Soluciones — RED-M21-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Identificar destino, protocolo, resolución y registro de deny; contrastar la dependencia con la política y añadir solo la excepción justificada, con prueba y caducidad cuando proceda.

### Criterios observables

- Obtiene destino, protocolo, resolución y deny de la actualización.
- Propone solo la excepción justificada, con prueba y revisión.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Comunicación de salida según una política**

Egress define salidas autorizadas: filtrar entrada no limita automáticamente lo que origina un servidor.

## Pregunta 2

**Respuesta: B. Un alcance de salida mayor que el requisito descrito**

El permiso global es mayor que las dependencias indicadas; no prueba por sí mismo compromiso.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
