# Soluciones — RED-M04-L04

Material de revisión: consultar después de resolver.

## Práctica individual

1400 menos 20 de IPv4 y 20 de TCP da 1360 bytes como referencia. Falta confirmar opciones, encapsulación y tamaño efectivo a lo largo del camino.

### Criterios observables

- Calcula 1400 − 20 − 20 = 1360 bytes.
- Declara los supuestos de cabeceras y la necesidad de confirmar encapsulación real.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Las cabeceras IP y TCP**

MSS cuenta datos TCP, sin las cabeceras IP y TCP; no representa el paquete completo.

## Pregunta 2

**Respuesta: C. No prueba el tránsito de paquetes grandes**

Un paquete pequeño puede pasar aunque uno grande falle; deben comprobarse MTU efectiva y mensajes de error.

## Referencias

- **RFC9293**: [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html). Bytes, handshake, secuencias, ventanas y estados TCP.
- **RFC1191**: [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html). PMTUD IPv4 y mensajes de error.
- **RFC8201**: [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html). PMTU e ICMPv6 Packet Too Big.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.
