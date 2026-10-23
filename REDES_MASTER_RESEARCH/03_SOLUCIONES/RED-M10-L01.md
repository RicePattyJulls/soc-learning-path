# Soluciones — RED-M10-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Configuración de región y mapeo de VLAN a instancia, además de enlaces y roles. No suponer que cualquier combinación de variantes produce idéntica topología.

### Criterios observables

- Coordina región y mapeo de VLAN a instancia MST.
- Comprueba roles y compatibilidad en lugar de asumir equivalencia de variantes.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Bucles de capa 2 en la topología de forwarding**

STP evita bucles de forwarding L2; no resuelve errores de aplicación o autenticación.

## Pregunta 2

**Respuesta: D. Un bloqueo lógico previsto para evitar un bucle**

En una topología redundante, discarding puede ser el estado previsto que mantiene una topología sin bucles.

## Referencias

- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **BONDING**: [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html). Agregación y modos de reparto; verificar soporte por implementación.
