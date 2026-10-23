# Soluciones — RED-M08-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Inundación de unicast desconocido en la VLAN por puertos elegibles, salvo entrada; las políticas concretas pueden limitarla. No se reenvía indiscriminadamente a todas las VLAN.

### Criterios observables

- Predice inundación de unicast desconocido solo en la VLAN.
- Excluye entrada y reconoce restricciones de forwarding o políticas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. De la MAC origen de la trama recibida**

La MAC origen permite aprender por dónde se alcanza al emisor; la MAC destino guía el reenvío.

## Pregunta 2

**Respuesta: B. Por p2 según su tabla MAC**

La tabla sitúa B en p2 dentro de VLAN10; no hace falta resolver DNS para esa decisión.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
