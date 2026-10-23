# Soluciones — RED-M40-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Direcciones y política IPv6 efectivas, intentos equivalentes y decisión del control con ruta/tiempo. Un deny IPv4 no demuestra cobertura de la otra familia.

### Criterios observables

- Define direcciones y política IPv6.
- Pide intentos equivalentes con ruta, tiempo y decisión del control.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Flujo esperado, enforcement y evidencia de su resultado**

Un flujo esperado necesita control y evidencia efectiva; dibujar el firewall no demuestra que lo atraviese.

## Pregunta 2

**Respuesta: A. Para detectar bloqueos que rompen la función legítima**

La prueba administrativa detecta regresiones que una única denegación a invitados dejaría ocultas.

## Referencias

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
