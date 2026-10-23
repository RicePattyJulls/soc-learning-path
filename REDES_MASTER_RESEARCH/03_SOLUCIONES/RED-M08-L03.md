# Soluciones — RED-M08-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Contrastar inventario y responsable del puerto, antigüedad del anuncio y eventos de enlace. Investigar sin tratar una cadena de texto recibida como identidad verificada.

### Criterios observables

- Contrasta inventario y responsable del puerto.
- Comprueba antigüedad del anuncio y eventos antes de aislar.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Información anunciada por vecinos de enlace**

LLDP declara datos de un vecino; autorización, credenciales y seguridad requieren otras comprobaciones.

## Pregunta 2

**Respuesta: C. Contraste con el inventario y cambio aprobado**

Solo el contraste con inventario y cambios aprobados establece si el AP está admitido; su anuncio no basta.

## Referencias

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.
