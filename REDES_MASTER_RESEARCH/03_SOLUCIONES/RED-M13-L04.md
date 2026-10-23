# Soluciones — RED-M13-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Revisar requisitos, compatibilidad de todos los routers y si un diseño NSSA u otra topología cumple el objetivo. El cambio debe contrastarse con alcance de anuncios y políticas.

### Criterios observables

- Contrasta necesidad de rutas externas y tipo de área.
- Considera NSSA o rediseño con compatibilidad y alcance de anuncios antes del cambio.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Que filtra cualquier LSA arbitrariamente dentro de un área**

La sumarización tiene puntos y alcances definidos; no es un filtro arbitrario de LSAs dentro de cualquier área.

## Pregunta 2

**Respuesta: A. Atraer tráfico hacia un componente que ya no es alcanzable**

El /24 sigue cubriendo la mitad perdida y puede atraer tráfico hacia ella.

## Referencias

- **FRR-OSPF**: [OSPFv2](https://docs.frrouting.org/en/latest/ospfd.html). Vecinos, LSDB, áreas, roles y operación OSPFv2.
- **FRR-OSPF6**: [OSPFv3](https://docs.frrouting.org/en/latest/ospf6d.html). Implementación OSPFv3 y familias soportadas según versión.
