# Soluciones — RED-M06-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Verificar la huella nueva por un canal confiable y el cambio registrado antes de actualizar la confianza. No aceptar cualquier clave únicamente porque la IP coincide.

### Criterios observables

- Verifica la huella nueva por canal confiable y cambio autorizado.
- Actualiza la confianza solo tras contrastar la identidad del host.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Que un usuario concreto esté autorizado**

Responder al transporte confirma alcance en esa prueba, pero no concede permiso a una cuenta concreta.

## Pregunta 2

**Respuesta: D. Autenticación de usuario**

Permission denied tras establecer SSH sitúa la prueba en autenticación, no en la comprobación física.

## Referencias

- **RFC8446**: [RFC 8446: Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html). Protección TLS y límites de observación pasiva.
- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
- **RFC9000**: [RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport](https://www.rfc-editor.org/rfc/rfc9000.html). Transporte sobre UDP y límites de inferir fiabilidad desde UDP solo.
