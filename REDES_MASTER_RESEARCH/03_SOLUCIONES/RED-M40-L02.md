# Soluciones — RED-M40-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Requiere al menos /25 convencional; el /24 actual ya está repartido. Revisar plan global, DHCP, gateways, routing, DNS y políticas con una migración y retorno controlados.

### Criterios observables

- Dimensiona invitados con al menos /25 y detecta que el /24 ya está repartido.
- Incluye plan global, DHCP, gateways, rutas y políticas con migración/retorno.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. 62**

Un /26 convencional tiene 64 direcciones y 62 de hosts, incluyendo las interfaces que deban reservarse.

## Pregunta 2

**Respuesta: C. Se supera la capacidad del /26 asignado**

Ochenta supera 62; no basta comparar con el tamaño de otro bloque ni esperar ampliación automática.

## Referencias

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
