# Soluciones — RED-M21-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Permitir su función de negocio y denegar administración de DB, registrando identidad, servicio y control aplicado. Autenticación correcta y autorización denegada son compatibles.

### Criterios observables

- Permite la función de negocio al usuario válido.
- Deniega administración y registra identidad, servicio y control.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Autorización de la identidad para esa operación sobre el recurso**

Pertenecer al segmento no concede permiso al recurso: rol y operación deben verificarse en su punto de control.

## Pregunta 2

**Respuesta: D. Separar acceso al recurso según rol y operación**

Autenticar al equipo para entrar en la red no concede administración de DB a todas las cuentas.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
