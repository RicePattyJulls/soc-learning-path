# Soluciones — RED-M09-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Renovación de configuración del cliente, dirección/gateway y conectividad autorizada. Cambiar el switch no actualiza mágicamente todo estado del host.

### Criterios observables

- Revisa renovación y dirección/gateway del cliente tras el cambio.
- Comprueba conectividad autorizada sin suponer actualización automática de la concesión.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. La VLAN de acceso configurada en p5**

p5 está configurado en VLAN10: la pertenencia efectiva resulta del puerto, aunque el diseño indique VLAN20.

## Pregunta 2

**Respuesta: B. El cliente está conectado efectivamente a VLAN10**

La concesión de VLAN10 coincide con la VLAN efectiva; no la modifica una consulta DNS.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
