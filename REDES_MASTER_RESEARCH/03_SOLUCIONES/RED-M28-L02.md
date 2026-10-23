# Soluciones — RED-M28-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Por tiempo, extremos y contexto de conexiones/proxy, conservando el ID y límites de transformación. No asumir correspondencia exacta 1:1 entre conexiones de ambos lados.

### Criterios observables

- Correlaciona request ID, tiempos y conexiones del proxy.
- Reconoce que las conexiones a ambos lados no tienen correspondencia obligatoria uno a uno.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Datos que no están disponibles en la captura**

Follow stream utiliza lo capturado; no repone paquetes ausentes ni descifra por sí solo contenido no disponible.

## Pregunta 2

**Respuesta: D. El contenido HTTP y la URL completa**

TLS y volumen están observados, pero no el HTTP ni la URL completa del intercambio.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **EV4769**: [4769: A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769). Solicitud de ticket y resultado; nota de actualización de evento desde enero 2025.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
