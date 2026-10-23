# Soluciones — RED-M26-L02

Material de revisión: consultar después de resolver.

## Práctica individual

No puede afirmarse autenticación o confidencialidad del mensaje por ese nivel. Pedir nivel y algoritmos efectivos, control de acceso y política de gestión.

### Criterios observables

- Niega autenticación y privacidad en noAuthNoPriv.
- Pide nivel, algoritmos efectivos y control de acceso de gestión.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Puede omitir cambios ocurridos entre muestras**

Las consultas solo describen sus instantes; un cambio breve puede ocurrir y revertirse entre ambas.

## Pregunta 2

**Respuesta: B. El registro down/up intermedio**

El registro down/up contradice disponibilidad continua aunque las dos muestras sean up.

## Referencias

- **RFC5424**: [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424.html). Cabecera y fórmula facility/severity de PRI.
- **RFC3414**: [RFC 3414: User-based Security Model for SNMPv3](https://www.rfc-editor.org/rfc/rfc3414.html). Niveles de seguridad; suites del RFC histórico no se recomiendan automáticamente.
- **RFC3416**: [RFC 3416: Protocol Operations for SNMP](https://www.rfc-editor.org/rfc/rfc3416.html). Polling y operaciones de notificación.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
