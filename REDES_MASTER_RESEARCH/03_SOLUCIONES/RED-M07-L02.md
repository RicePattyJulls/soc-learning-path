# Soluciones — RED-M07-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Revisar opciones del ámbito y accesibilidad prevista del resolver. El ACK solo confirma la concesión, no todas las dependencias del servicio.

### Criterios observables

- Identifica la opción DNS del ámbito a revisar.
- Comprueba la accesibilidad prevista del resolver además de recibir ACK.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Transportar solicitudes entre la red cliente y un servidor en otra red**

El relay permite alcanzar el servidor desde otra red y aporta contexto para seleccionar el ámbito.

## Pregunta 2

**Respuesta: A. El contexto de relay apunta al ámbito de otra VLAN**

El servidor seleccionó el ámbito señalado por el relay; entregar una opción DNS no explica elegir otra subred.

## Referencias

- **RFC1034**: [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html). Resolver, autoridad, caché y funciones DNS.
- **RFC2131**: [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html). Concesiones, cliente/servidor/relay DHCPv4.
- **RFC8415**: [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html). Funciones DHCPv6; no reemplazo de Router Discovery.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
