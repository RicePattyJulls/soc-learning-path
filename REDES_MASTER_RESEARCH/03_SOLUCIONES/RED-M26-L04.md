# Soluciones — RED-M26-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Existe un hueco de observación de esa fuente; no puede afirmarse ausencia de actividad durante esos 30 minutos. Identificar buffers, disponibilidad y retención para recuperar o acotar.

### Criterios observables

- Declara hueco de observación de treinta minutos.
- Pide estado de sensor, buffers y retención sin afirmar ausencia de actividad.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Texto del mensaje idéntico**

Sucesos distintos pueden tener el mismo texto; deduplicar necesita procedencia y una clave justificada.

## Pregunta 2

**Respuesta: C. Conservarlo como evento distinto salvo evidencia contraria**

ID48 difiere en identidad y tiempo; no debe borrarse solo por repetir el texto.

## Referencias

- **RFC5424**: [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424.html). Cabecera y fórmula facility/severity de PRI.
- **RFC3414**: [RFC 3414: User-based Security Model for SNMPv3](https://www.rfc-editor.org/rfc/rfc3414.html). Niveles de seguridad; suites del RFC histórico no se recomiendan automáticamente.
- **RFC3416**: [RFC 3416: Protocol Operations for SNMP](https://www.rfc-editor.org/rfc/rfc3416.html). Polling y operaciones de notificación.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.
