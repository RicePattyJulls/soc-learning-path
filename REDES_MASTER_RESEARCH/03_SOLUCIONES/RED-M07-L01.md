# Soluciones — RED-M07-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Comprobar diseño split-DNS, resolver utilizado, autoridad y respuesta esperada por ubicación. Una diferencia prevista de vistas no demuestra un ataque.

### Criterios observables

- Contrasta vista prevista, resolver y autoridad consultados.
- Explica por qué split-DNS previsto no acredita manipulación.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Un alias de otro nombre**

CNAME relaciona un nombre alias con otro nombre; no asigna máscara, hora o router.

## Pregunta 2

**Respuesta: C. La caché conserva una entrada cuyo TTL no ha vencido**

La entrada antigua conserva 120 segundos válidos: el cambio de autoridad no invalida instantáneamente todas las cachés.

## Referencias

- **RFC1034**: [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html). Resolver, autoridad, caché y funciones DNS.
- **RFC2131**: [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html). Concesiones, cliente/servidor/relay DHCPv4.
- **RFC8415**: [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html). Funciones DHCPv6; no reemplazo de Router Discovery.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
