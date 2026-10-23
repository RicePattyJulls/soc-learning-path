# Soluciones — RED-M21-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Situar la denegación específica antes del permiso más general o reemplazarlo por permisos acotados; probar coincidencias y contadores en el sentido correcto.

### Criterios observables

- Sitúa deny específico antes del permiso general o acota permisos.
- Verifica coincidencias y contadores en familia y sentido correctos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Una coincidencia más general anterior con acción definitiva**

Una regla general definitiva anterior resuelve el paquete antes de alcanzar la específica posterior.

## Pregunta 2

**Respuesta: C. Lo permite por la regla 10**

La regla 10 permite el flujo y termina la evaluación de la lista docente.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
