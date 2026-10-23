# Soluciones — RED-M07-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Comparar relojes y error de autenticación de cliente/servidor. No cambiar rutas si la evidencia ya sitúa el rechazo en una etapa posterior.

### Criterios observables

- Sitúa la siguiente comparación en relojes y autenticación.
- Justifica conservar rutas cuando ya hay conexión y un rechazo posterior explícito.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Una prueba que distingue hipótesis concretas**

Una prueba útil cambia una variable y produce resultados distintos según la hipótesis; cambiar todo destruye esa comparación.

## Pregunta 2

**Respuesta: A. La identidad TLS y el servidor virtual elegido por nombre**

Probar por IP puede alterar SNI, selección de virtual host y validación de nombre, aunque el transporte conecte.

## Referencias

- **RFC1034**: [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html). Resolver, autoridad, caché y funciones DNS.
- **RFC2131**: [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html). Concesiones, cliente/servidor/relay DHCPv4.
- **RFC8415**: [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html). Funciones DHCPv6; no reemplazo de Router Discovery.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
