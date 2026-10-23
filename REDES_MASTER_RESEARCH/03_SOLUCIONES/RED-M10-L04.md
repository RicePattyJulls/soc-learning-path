# Soluciones — RED-M10-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Estado de negociación, parámetros por miembro y del agregado, registros y contadores antes/después. Corregir coherencia y comprobar forwarding sin forzar la inclusión insegura.

### Criterios observables

- Conserva negociación, parámetros y contadores por miembro.
- Propone corregir coherencia y verificar forwarding antes de forzar inclusión.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Su asignación a un miembro mediante el hash**

El hash suele mantener un flujo en un miembro para preservar orden; la suma se aprovecha entre varios flujos.

## Pregunta 2

**Respuesta: C. Un resultado compatible con un flujo sobre un miembro de 1 Gb/s**

900 Mb/s es compatible con un miembro de 1 Gb/s y sobrecarga; no prueba un fallo de agregación.

## Referencias

- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **BONDING**: [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html). Agregación y modos de reparto; verificar soporte por implementación.
