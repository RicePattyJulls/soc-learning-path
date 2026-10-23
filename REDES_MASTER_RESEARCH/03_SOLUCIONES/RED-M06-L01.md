# Soluciones — RED-M06-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Comparar nombre solicitado, cadena de confianza, reloj y políticas de ambos clientes; registrar el error exacto. No concluir que un timeout y un error de identidad son equivalentes.

### Criterios observables

- Compara nombre, cadena de confianza y reloj en ambos clientes.
- Conserva el error exacto y distingue confianza TLS de timeout de transporte.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Su correspondencia con la identidad de servidor solicitada**

La comprobación del nombre relaciona certificado e identidad solicitada, sin medir capacidad del enlace ni credenciales humanas.

## Pregunta 2

**Respuesta: B. HTTP/3 sobre QUIC/UDP**

HTTP/3 funciona sobre QUIC/UDP; un filtro exclusivo de TCP no incluye ese transporte.

## Referencias

- **RFC8446**: [RFC 8446: Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html). Protección TLS y límites de observación pasiva.
- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.
