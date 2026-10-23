# Soluciones — RED-M10-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Detección del fallo, cambio de roles/rutas y primer intercambio útil de aplicación. Ese desglose muestra dónde se consume el tiempo de recuperación.

### Criterios observables

- Separa detección de fallo, cambio de estado y primer intercambio útil.
- Relaciona esas fases con los cuatro segundos observados.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. A con prioridad 4096**

Con el resto comparable, la prioridad numéricamente menor favorece A; CPU y DNS no deciden el root.

## Pregunta 2

**Respuesta: B. Un intercambio de aplicación además del estado de control**

El usuario necesita recuperar intercambios útiles; el estado del control por sí solo no mide ese resultado.

## Referencias

- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **BONDING**: [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html). Agregación y modos de reparto; verificar soporte por implementación.
