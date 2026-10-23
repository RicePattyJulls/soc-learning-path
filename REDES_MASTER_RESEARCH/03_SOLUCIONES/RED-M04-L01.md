# Soluciones — RED-M04-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Captura o registro del lado del resolver, con coincidencia de consulta y tiempo; corroborar firewall/ruta. El único punto del cliente no diferencia por sí solo ambas causas.

### Criterios observables

- Pide evidencia del resolver que identifique consulta y tiempo.
- Contrasta ruta y firewall sin decidir desde una captura unilateral.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Datagramas**

UDP conserva límites de datagramas; orden, retransmisión o autenticación requieren otros mecanismos.

## Pregunta 2

**Respuesta: B. No se observó una respuesta en ese punto e intervalo**

Una observación sin respuesta no distingue filtrado, pérdida, servicio ausente o captura incompleta.

## Referencias

- **RFC9293**: [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html). Bytes, handshake, secuencias, ventanas y estados TCP.
- **RFC1191**: [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html). PMTUD IPv4 y mensajes de error.
- **RFC8201**: [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html). PMTU e ICMPv6 Packet Too Big.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.
