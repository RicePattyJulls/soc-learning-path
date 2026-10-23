# Soluciones — RED-M08-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Separación de dominios de broadcast, pero no aislamiento efectivo de flujos L3. Hace falta política y verificación de tráfico permitido y denegado.

### Criterios observables

- Identifica separación de broadcast.
- Señala que routing abierto no demuestra aislamiento de flujos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Un dominio de broadcast de capa 2**

La VLAN separa broadcast L2; no autentica usuarios ni impone cifrado o reglas L3 por sí sola.

## Pregunta 2

**Respuesta: D. Los puertos elegibles de VLAN10, como p2**

p2 comparte VLAN10; p3 está en VLAN20 y no recibe ese mismo broadcast por routing ordinario.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
