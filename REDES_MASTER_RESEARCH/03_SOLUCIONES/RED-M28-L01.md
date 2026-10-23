# Soluciones — RED-M28-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Seleccionar ip.src == 192.0.2.10 y tcp.dstport == 443 con operadores del filtro visual; conservar otra vista de respuestas para no perder el contexto.

### Criterios observables

- Selecciona ip.src y tcp.dstport con lenguaje de visualización.
- Conserva una vista de respuestas para no perder contexto.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Coincidencia del puerto TCP en cualquiera de los extremos**

tcp.port compara origen o destino TCP; para solo destino se necesita tcp.dstport.

## Pregunta 2

**Respuesta: D. Una conversación en el contexto del archivo analizado**

tcp.stream depende del archivo y análisis; no es identidad permanente de dispositivo o usuario.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **EV4769**: [4769: A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769). Solicitud de ticket y resultado; nota de actualización de evento desde enero 2025.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
