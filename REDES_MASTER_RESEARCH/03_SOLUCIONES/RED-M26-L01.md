# Soluciones — RED-M26-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Conservar hostname original y entidad de transporte en campos separados, con mensaje crudo y versión de transformación. No atribuir la sesión al forwarder como host origen automáticamente.

### Criterios observables

- Separa hostname original de la entidad de transporte.
- Conserva mensaje crudo y versión de transformación para no atribuir al forwarder.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. 6**

134 = 16 × 8 + 6: facility 16 y severity 6, sin equivalencia automática a malicia.

## Pregunta 2

**Respuesta: D. Una decisión registrada cuyo contexto aún debe investigarse**

Denied registra una decisión; su nivel informativo no demuestra benignidad, compromiso o autorización.

## Referencias

- **RFC5424**: [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424.html). Cabecera y fórmula facility/severity de PRI.
- **RFC3414**: [RFC 3414: User-based Security Model for SNMPv3](https://www.rfc-editor.org/rfc/rfc3414.html). Niveles de seguridad; suites del RFC histórico no se recomiendan automáticamente.
- **RFC3416**: [RFC 3416: Protocol Operations for SNMP](https://www.rfc-editor.org/rfc/rfc3416.html). Polling y operaciones de notificación.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
