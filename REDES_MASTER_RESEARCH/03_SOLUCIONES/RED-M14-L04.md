# Soluciones — RED-M14-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Comparar políticas y anuncios efectivos por vecino/familia antes y después, incluyendo una prueba negativa para 0.0.0.0/0 o ::/0 según el alcance.

### Criterios observables

- Compara política y anuncios efectivos por vecino y familia.
- Incluye ausencia de default como prueba negativa antes y después.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Comprobar instalación y forwarding con next hop válido**

Seleccionar no basta: se necesita instalar y resolver el next hop en la tabla correcta para reenviar.

## Pregunta 2

**Respuesta: C. Evidencia de que los anuncios prohibidos quedan excluidos**

Un ping permitido no muestra qué prefijos se anuncian al vecino ni si los prohibidos quedaron excluidos.

## Referencias

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.
