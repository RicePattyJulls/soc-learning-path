# Soluciones — RED-M16-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Correlacionar carga, temporizadores efectivos y pérdidas de control con la estabilidad del forwarding. Ajustar a capacidades medidas antes de concluir avería física intermitente.

### Criterios observables

- Correlaciona CPU, temporizadores y pérdida de control.
- Comprueba forwarding bajo carga antes de atribuir fallo físico.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Calcular la ruta alternativa completa**

BFD detecta y comunica continuidad; otro mecanismo decide y aplica la ruta alternativa.

## Pregunta 2

**Respuesta: C. A las 10:00:02.000**

La aplicación vuelve a responder a las 10:00:02.000; BFD down y cambio FIB son hitos anteriores.

## Referencias

- **RFC9568**: [RFC 9568: Virtual Router Redundancy Protocol Version 3](https://www.rfc-editor.org/rfc/rfc9568.html). Gateway virtual y redundancia IPv4/IPv6.
- **RFC5880**: [RFC 5880: Bidirectional Forwarding Detection](https://www.rfc-editor.org/rfc/rfc5880.html). Detección de continuidad; no cálculo de ruta.
- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
