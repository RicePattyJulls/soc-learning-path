# Soluciones — RED-M10-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Impedir que se acepte un root superior por ese camino, objetivo asociado a Root Guard. Revisar soporte y diseño sin copiar configuración de puerto de usuario.

### Criterios observables

- Identifica impedir un root no deseado como objetivo.
- Selecciona Root Guard con revisión de soporte y función del enlace.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Impedir un root no deseado por el puerto protegido**

Root Guard atiende la aceptación de un root no deseado por ese puerto; no autentica SSH ni cifra Ethernet.

## Pregunta 2

**Respuesta: A. Resolver la conexión o diseño que provocó la condición**

Reactivar sin corregir la conexión repite la condición que disparó la protección.

## Referencias

- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **BONDING**: [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html). Agregación y modos de reparto; verificar soporte por implementación.
