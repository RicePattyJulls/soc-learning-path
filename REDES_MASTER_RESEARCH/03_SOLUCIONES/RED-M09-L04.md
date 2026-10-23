# Soluciones — RED-M09-L04

Material de revisión: consultar después de resolver.

## Práctica individual

La política bloquea ese flujo según el registro corroborado; debe contrastarse con la matriz autorizada, no abrirse por defecto por existir routing entre VLAN.

### Criterios observables

- Relaciona el deny TCP/445 con la decisión efectiva de política.
- Contrasta con la matriz autorizada antes de proponer un permiso.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Una interfaz L3 asociada a una VLAN**

La SVI aporta una interfaz IP de la VLAN; no sustituye autenticación ni cifra tramas automáticamente.

## Pregunta 2

**Respuesta: A. Existe camino de ida hasta el servidor y retorno mal configurado**

Recibir SYN demuestra ida hasta el servidor; su gateway antiguo explica investigar el retorno.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
