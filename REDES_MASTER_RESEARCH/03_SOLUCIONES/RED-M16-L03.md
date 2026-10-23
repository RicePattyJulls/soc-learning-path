# Soluciones — RED-M16-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Los criterios no son equivalentes. Repetir con mismo origen, destino, protocolo, carga e intervalo; conservar distribución de resultados, no solo un valor conveniente.

### Criterios observables

- Repite con mismo origen, destino, protocolo y carga.
- Conserva distribución e intervalo y evita comparar ping con HTTP como si fueran iguales.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Un criterio de éxito y método comparables**

Comparar exige igual criterio y método; ping y transacción miden recuperaciones diferentes.

## Pregunta 2

**Respuesta: B. Recuperación de esa prueba ICMP en ese instante**

El ping recuperado solo demuestra respuesta ICMP en esa prueba, no éxito de aplicación o preservación de sesiones.

## Referencias

- **RFC9568**: [RFC 9568: Virtual Router Redundancy Protocol Version 3](https://www.rfc-editor.org/rfc/rfc9568.html). Gateway virtual y redundancia IPv4/IPv6.
- **RFC5880**: [RFC 5880: Bidirectional Forwarding Detection](https://www.rfc-editor.org/rfc/rfc5880.html). Detección de continuidad; no cálculo de ruta.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
