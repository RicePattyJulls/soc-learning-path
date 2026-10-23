# Soluciones — RED-M04-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Una limitación temporal de recepción o procesamiento es compatible con el comportamiento. Revisar buffers y aplicación antes de atribuirlo exclusivamente a congestión del enlace.

### Criterios observables

- Relaciona ventana positiva y continuación con una limitación temporal de recepción.
- Propone revisar buffers o aplicación antes de culpar exclusivamente al enlace.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. El SYN, que consume un número de secuencia**

El SYN consume una posición: la siguiente esperada es 101, aunque no haya datos HTTP.

## Pregunta 2

**Respuesta: A. El receptor no anuncia espacio disponible en ese momento**

La ventana anunciada informa capacidad del receptor; cero no demuestra caída física ni cambio de transporte.

## Referencias

- **RFC9293**: [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293.html). Bytes, handshake, secuencias, ventanas y estados TCP.
- **RFC1191**: [RFC 1191: Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191.html). PMTUD IPv4 y mensajes de error.
- **RFC8201**: [RFC 8201: Path MTU Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc8201.html). PMTU e ICMPv6 Packet Too Big.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.
