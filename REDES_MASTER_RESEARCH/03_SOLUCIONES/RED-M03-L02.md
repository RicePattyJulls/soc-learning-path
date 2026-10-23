# Soluciones — RED-M03-L02

Material de revisión: consultar después de resolver.

## Práctica individual

No. El lifetime del router igual a cero indica que ese anunciante no debe usarse como router por defecto; otros datos del RA pueden seguir siendo relevantes.

### Criterios observables

- Interpreta lifetime 0 como no utilizar ese anunciante de router por defecto.
- Distingue ese lifetime de otros datos o prefijos presentes en el RA.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. RA de ICMPv6**

RA es un anuncio ICMPv6 de router; ARP pertenece a IPv4 y los otros mensajes no cumplen esa función.

## Pregunta 2

**Respuesta: B. Una ruta adecuada, incluida la ruta por defecto si procede**

Resolver un vecino no instala por sí mismo una salida a otras redes; falta una ruta aplicable.

## Referencias

- **RFC4291**: [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html). Formato, ámbitos y tipos de direcciones IPv6.
- **RFC8200**: [RFC 8200: Internet Protocol, Version 6](https://www.rfc-editor.org/rfc/rfc8200.html). Cabecera IPv6 y fragmentación por origen.
- **RFC4861**: [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861.html). Vecinos, routers y mensajes ICMPv6.
- **RFC4862**: [RFC 4862: IPv6 Stateless Address Autoconfiguration](https://www.rfc-editor.org/rfc/rfc4862.html). SLAAC y detección de direcciones duplicadas.
