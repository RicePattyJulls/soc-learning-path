# Soluciones — RED-M16-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Servicio disponible, redundancia no restituida. Registrar fallo de restauración y corregirlo; no marcar el ensayo plenamente cerrado solo porque un ping responde.

### Criterios observables

- Declara servicio disponible y redundancia no restituida.
- Exige habilitar y comprobar B para cerrar la restauración.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Recuperar servicio no implica restituir toda la redundancia**

Puede volver el servicio por una vía y seguir perdida la redundancia; son hitos que se verifican aparte.

## Pregunta 2

**Respuesta: B. Restituir B y comprobar redundancia**

B apagado deja una sola vía: hay disponibilidad, pero todavía no restauración completa.

## Referencias

- **RFC9568**: [RFC 9568: Virtual Router Redundancy Protocol Version 3](https://www.rfc-editor.org/rfc/rfc9568.html). Gateway virtual y redundancia IPv4/IPv6.
- **RFC5880**: [RFC 5880: Bidirectional Forwarding Detection](https://www.rfc-editor.org/rfc/rfc5880.html). Detección de continuidad; no cálculo de ruta.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
