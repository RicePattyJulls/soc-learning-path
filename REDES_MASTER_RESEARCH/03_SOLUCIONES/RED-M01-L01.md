# Soluciones — RED-M01-L01

Material de revisión: consultar después de resolver.

## Práctica individual

La aplicación responde sobre una conexión disponible. Revisar identidad, autorización y registros de esa operación; el 200 no demuestra que toda acción de negocio tenga éxito.

### Criterios observables

- Identifica la respuesta de aplicación disponible.
- Propone revisar identidad, autorización o registros de la operación.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Un flujo de bytes**

TCP entrega bytes ordenados; las tramas pertenecen al enlace e ICMP es un protocolo distinto.

## Pregunta 2

**Respuesta: D. Una respuesta de aplicación para esa petición**

El 503 es una respuesta HTTP: no identifica la causa interna ni garantiza acceso a todos los usuarios.

## Referencias

- **RFC1122**: [RFC 1122: Requirements for Internet Hosts — Communication Layers](https://www.rfc-editor.org/rfc/rfc1122.html). Funciones de comunicación y separación de capas; no equivalencia rígida entre modelos.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
