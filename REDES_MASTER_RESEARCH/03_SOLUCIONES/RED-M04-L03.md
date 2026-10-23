# Soluciones — RED-M04-L03

Material de revisión: consultar después de resolver.

## Práctica individual

El inicio tardío impide reconstruir todo el estado. Repetir una captura autorizada desde el principio y, si es necesario, en ambos extremos; no culpar automáticamente a un ataque.

### Criterios observables

- Explica el estado ausente al comenzar tarde la captura.
- Propone repetir desde el inicio y ampliar puntos de observación si procede.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Corroborar con estado y registros del extremo o intermediario**

La dirección del paquete no identifica inequívocamente al proceso emisor; hace falta corroboración de estado y registros.

## Pregunta 2

**Respuesta: D. Un registro reject coincidente en tiempo y 5-tupla**

Tiempo y 5-tupla ligan el reject al intento observado; registros de otros hosts o fechas no lo hacen.

## Referencias

- **RFC9293**: [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html). Bytes, handshake, secuencias, ventanas y estados TCP.
- **RFC1191**: [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html). PMTUD IPv4 y mensajes de error.
- **RFC8201**: [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html). PMTU e ICMPv6 Packet Too Big.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.
