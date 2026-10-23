# Soluciones — RED-M09-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Puertos de acceso correctos y estado STP/forwarding de VLAN30; también aprendizaje MAC y etiquetado efectivo. Mantener cada prueba ligada a un enlace y VLAN.

### Criterios observables

- Comprueba puertos de acceso y forwarding de VLAN30.
- Relaciona aprendizaje MAC y etiquetas con enlaces concretos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. La misma VLAN a lo largo de todos los enlaces**

Cada enlace del recorrido debe admitir la misma VLAN; revisar solo extremos deja huecos intermedios.

## Pregunta 2

**Respuesta: A. En la lista permitida de B-C**

B-C excluye VLAN30 de su lista, aunque la VLAN exista en A y C.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
