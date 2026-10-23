# Soluciones — RED-M01-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Repetir medición bajo una carga comparable a la nocturna, documentando interfaz, tiempo y cambios. Una observación diurna sin carga no refuta un fallo dependiente del tráfico.

### Criterios observables

- Propone repetir con carga comparable a las copias nocturnas.
- Conserva interfaz, intervalo y cambios para comparar.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Cambiar varias variables simultáneamente**

Si se cambian varias variables, la mejora no permite aislar cuál produjo el efecto.

## Pregunta 2

**Respuesta: D. La sustitución se asocia a la desaparición observada de CRC**

Desaparecieron CRC durante diez minutos bajo la carga probada; la conclusión termina en esas condiciones.

## Referencias

- **RFC1122**: [RFC 1122: Requirements for Internet Hosts — Communication Layers](https://www.rfc-editor.org/rfc/rfc1122.html). Funciones de comunicación y separación de capas; no equivalencia rígida entre modelos.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
