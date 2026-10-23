# Soluciones — RED-M03-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Comprobar provisión y acceso al resolver DNS, por ejemplo mediante RDNSS o DHCPv6 según configuración y soporte. Tener dirección y ruta no acredita resolución de nombres.

### Criterios observables

- Identifica la provisión del resolver como dependencia pendiente.
- Propone comprobar RDNSS o DHCPv6 según soporte y acceso al DNS.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. La posible duplicidad de una dirección**

DAD busca conflicto de dirección; no acredita quién está autorizado a anunciar el prefijo.

## Pregunta 2

**Respuesta: C. La detección de un conflicto durante DAD**

El conflicto detectado impide declarar éxito; /64 y hexadecimal no son fallos en este ejemplo.

## Referencias

- **RFC4291**: [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html). Formato, ámbitos y tipos de direcciones IPv6.
- **RFC8200**: [RFC 8200: Internet Protocol, Version 6](https://www.rfc-editor.org/rfc/rfc8200.html). Cabecera IPv6 y fragmentación por origen.
- **RFC4861**: [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861.html). Vecinos, routers y mensajes ICMPv6.
- **RFC4862**: [RFC 4862: IPv6 Stateless Address Autoconfiguration](https://www.rfc-editor.org/rfc/rfc4862.html). SLAAC y detección de direcciones duplicadas.
