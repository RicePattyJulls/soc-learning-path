# Soluciones — RED-M28-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Separar ticket emitido, intento de conexión y acceso denegado. La autenticación previa puede ser correcta mientras falla la autorización del recurso.

### Criterios observables

- Separa ticket emitido e intento de conexión.
- Registra acceso denegado como autorización fallida pese a autenticación previa.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Acceso exitoso al recurso final**

Un ticket emitido no acredita que el recurso lo aceptara ni que autorizara la operación solicitada.

## Pregunta 2

**Respuesta: C. Resultado del acceso al recurso**

Falta evidencia del resultado en el recurso: flujo y ticket no equivalen a acceso exitoso.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **EV4769**: [4769: A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769). Solicitud de ticket y resultado; nota de actualización de evento desde enero 2025.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
