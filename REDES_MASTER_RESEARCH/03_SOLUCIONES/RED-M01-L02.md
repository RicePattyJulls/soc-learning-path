# Soluciones — RED-M01-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Presupuesto PoE del puerto y del switch, consumo solicitado/entregado y registros de alimentación. Cambiar VLAN no corrige una insuficiencia eléctrica demostrada.

### Criterios observables

- Pide potencia solicitada y entregada, por puerto y total.
- Relaciona el reinicio con alimentación sin atribuirlo a VLAN sin evidencia.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Enviar y recibir simultáneamente**

Full duplex permite ambos sentidos simultáneamente; no altera el contrato de acceso ni el presupuesto eléctrico.

## Pregunta 2

**Respuesta: A. 25 W requeridos frente a 15 W disponibles**

Faltan 10 W respecto a lo solicitado; coincidir en velocidad no compensa esa insuficiencia.

## Referencias

- **RFC1122**: [RFC 1122: Requirements for Internet Hosts — Communication Layers](https://www.rfc-editor.org/rfc/rfc1122.html). Funciones de comunicación y separación de capas; no equivalencia rígida entre modelos.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
