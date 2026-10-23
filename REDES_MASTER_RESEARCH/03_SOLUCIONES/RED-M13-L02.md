# Soluciones — RED-M13-L02

Material de revisión: consultar después de resolver.

## Práctica individual

LSA/LSDB relevante, decisión de instalación en la RIB y forwarding en la FIB. Tener adyacencia completa no implica anunciar todos los prefijos esperados.

### Criterios observables

- Revisa anuncio/LSDB, selección en RIB y forwarding FIB.
- Explica por qué Full no implica anunciar o instalar todo prefijo.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Caminos de menor coste según el modelo OSPF**

SPF deriva caminos de menor coste de la información de enlace, sin producir claves ni traducciones NAT.

## Pregunta 2

**Respuesta: C. La MTU**

1500 y 1400 son MTU diferentes; el caso plantea ese contraste en ExStart/Exchange.

## Referencias

- **FRR-OSPF**: [OSPFv2](https://docs.frrouting.org/en/latest/ospfd.html). Vecinos, LSDB, áreas, roles y operación OSPFv2.
- **FRR-OSPF6**: [OSPFv3](https://docs.frrouting.org/en/latest/ospf6d.html). Implementación OSPFv3 y familias soportadas según versión.
