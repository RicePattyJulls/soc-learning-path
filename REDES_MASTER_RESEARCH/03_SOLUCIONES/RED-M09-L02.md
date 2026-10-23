# Soluciones — RED-M09-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Lista de VLAN permitidas y existencia/estado de VLAN30 en ambos extremos; también estado del enlace y de STP. Coincidir en nativa no habilita todas las VLAN.

### Criterios observables

- Comprueba VLAN30 en listas permitidas y estado en ambos lados.
- Considera forwarding y enlace aunque coincida la VLAN nativa.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. La VLAN de la trama etiquetada**

La etiqueta identifica VLAN de la trama; no contiene una identidad humana ni un certificado.

## Pregunta 2

**Respuesta: B. Interpretación diferente de tramas sin etiqueta**

Los extremos clasifican una misma trama sin etiqueta en VLAN distintas, creando una discrepancia de segmentación.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
