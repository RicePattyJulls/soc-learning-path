# Soluciones — RED-M28-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Corrupción real o problema físico merece investigación con hardware, medio y contadores. No reutilizar la explicación de offload sin reevaluar evidencia.

### Criterios observables

- Reabre hipótesis de corrupción real ante errores en ambos puntos y CRC.
- Pide contraste de hardware, medio y contadores sin conservar automáticamente la explicación anterior.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Offload que completa el cálculo después del punto de captura**

La NIC puede completar checksum tras la captura local; se necesita contraste antes de declarar corrupción en tránsito.

## Pregunta 2

**Respuesta: D. Un artefacto de observación local compatible con offload**

El mismo paquete aparece válido en otro punto: apoya un artefacto local compatible con offload.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC4120**: [RFC 4120: Kerberos Network Authentication Service V5](https://www.rfc-editor.org/rfc/rfc4120.html). Tickets, tiempo y separación de autenticación y acceso al recurso.
- **EV4769**: [4769: A Kerberos service ticket was requested](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769). Solicitud de ticket y resultado; nota de actualización de evento desde enero 2025.
- **SMB**: [SMB Security Enhancements](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security). Diferencia entre firma y cifrado; condiciones por versión.
