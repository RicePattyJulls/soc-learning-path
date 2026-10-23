# Soluciones — RED-M01-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Se resuelve la MAC de 192.0.2.30 por ARP y se envía directamente por el enlace, sujeto a las políticas locales; no hace falta atravesar el gateway.

### Criterios observables

- Resuelve por ARP la MAC de .30.
- Explica el envío directo en el enlace compartido.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. La del gateway local**

El destino IP sigue remoto, pero la trama del primer enlace se dirige al router local.

## Pregunta 2

**Respuesta: D. La cabecera de enlace**

Cada router sustituye la envoltura de enlace para el siguiente tramo; no tiene que modificar el contenido de aplicación.

## Referencias

- **RFC1122**: [RFC 1122: Requirements for Internet Hosts — Communication Layers](https://www.rfc-editor.org/rfc/rfc1122.html). Funciones de comunicación y separación de capas; no equivalencia rígida entre modelos.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
