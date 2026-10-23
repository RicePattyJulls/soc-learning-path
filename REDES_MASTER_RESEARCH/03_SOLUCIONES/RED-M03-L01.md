# Soluciones — RED-M03-L01

Material de revisión: consultar después de resolver.

## Práctica individual

2001:0db8:0001:0000:0000:0000:0000:0005. Una link-local puede repetirse en enlaces distintos; la interfaz identifica el ámbito del vecino.

### Criterios observables

- Expande ocho grupos sin cambiar los 128 bits.
- Explica que fe80::1 necesita ámbito de interfaz en equipos con varios enlaces.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Una como máximo**

Dos compresiones :: no permiten saber cuántos grupos cero corresponden a cada posición.

## Pregunta 2

**Respuesta: A. Varios nodos pueden compartir la dirección y el routing elige destino**

Anycast comparte dirección entre nodos; el encaminamiento selecciona uno, sin imponer cifrado ni broadcast.

## Referencias

- **RFC4291**: [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html). Formato, ámbitos y tipos de direcciones IPv6.
- **RFC8200**: [RFC 8200: Internet Protocol, Version 6](https://www.rfc-editor.org/rfc/rfc8200.html). Cabecera IPv6 y fragmentación por origen.
- **RFC4861**: [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861.html). Vecinos, routers y mensajes ICMPv6.
- **RFC4862**: [RFC 4862: IPv6 Stateless Address Autoconfiguration](https://www.rfc-editor.org/rfc/rfc4862.html). SLAAC y detección de direcciones duplicadas.
