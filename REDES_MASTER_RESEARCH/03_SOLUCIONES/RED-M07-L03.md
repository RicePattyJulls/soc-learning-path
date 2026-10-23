# Soluciones — RED-M07-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Cola o retraso de transporte, o reloj incorrecto del emisor. Revisar métricas de cola y estado de sincronización, conservando ambas horas originales.

### Criterios observables

- Plantea retraso de cola/transporte y reloj incorrecto como alternativas.
- Solicita métricas de cola y sincronización, preservando hora original y recepción.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Un reloj adelantado respecto a la referencia**

Una conversión de zona cambia representación temporal, no corrige el adelanto físico del reloj.

## Pregunta 2

**Respuesta: D. 10:00:00Z**

Se resta el adelanto estimado: 10:00:05 menos cinco segundos es aproximadamente 10:00:00Z.

## Referencias

- **RFC1034**: [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html). Resolver, autoridad, caché y funciones DNS.
- **RFC2131**: [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html). Concesiones, cliente/servidor/relay DHCPv4.
- **RFC8415**: [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html). Funciones DHCPv6; no reemplazo de Router Discovery.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
