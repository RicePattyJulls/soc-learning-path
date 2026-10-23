# Soluciones — RED-M14-L02

Material de revisión: consultar después de resolver.

## Práctica individual

B pasa a ser preferida si los otros requisitos y políticas siguen siendo iguales. Revisar decisión real y next hop, no solo el valor editado.

### Criterios observables

- Predice preferencia de B con valor 250 bajo los mismos supuestos.
- Confirma selección real y next hop tras editar la política.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Una preferencia de política dentro del AS**

Local preference representa política dentro del AS; no mide latencia ni capacidad de puertos.

## Pregunta 2

**Respuesta: D. A por local-pref 200 frente a 100**

Bajo el orden dado, local-pref 200 gana a 100 antes de comparar la longitud de AS_PATH.

## Referencias

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.
