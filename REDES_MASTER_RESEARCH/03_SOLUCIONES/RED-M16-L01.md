# Soluciones — RED-M16-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Comparar estado de gateway virtual, interfaces y prueba de destino de servicio. El seguimiento debe reflejar el fallo relevante y evitar conmutaciones por una sonda inadecuada.

### Criterios observables

- Compara gateway virtual, interfaces y servicio remoto.
- Diseña seguimiento del fallo relevante sin usar una sonda que provoque cambios injustificados.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Un gateway lógico mientras cambia quien lo atiende**

FHRP mantiene un gateway lógico, sin prometer conservar toda sesión ni proteger dependencias aguas arriba.

## Pregunta 2

**Respuesta: D. Gateway activo sin salida WAN funcional**

La LAN permanece activa y R1 puede conservar el rol aun sin WAN: falta seguimiento del recurso protegido.

## Referencias

- **RFC9568**: [RFC 9568: Virtual Router Redundancy Protocol Version 3](https://www.rfc-editor.org/rfc/rfc9568.html). Gateway virtual y redundancia IPv4/IPv6.
- **RFC5880**: [RFC 5880: Bidirectional Forwarding Detection](https://www.rfc-editor.org/rfc/rfc5880.html). Detección de continuidad; no cálculo de ruta.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
