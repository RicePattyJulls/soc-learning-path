# Soluciones — RED-M19-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Clasificación/remarcado en el borde autorizado y contadores por clase. La etiqueta recibida no debe ser prueba suficiente de prioridad legítima.

### Criterios observables

- Define clasificación o remarcado en el borde confiable.
- Comprueba contadores por clase sin aceptar DSCP del usuario como autorización.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Los retrasa en una cola dentro de sus límites**

Shaping usa buffers para retrasar dentro del perfil y sus límites; no crea capacidad adicional.

## Pregunta 2

**Respuesta: D. Mayor demora por cola**

Retener paquetes introduce demora de cola, aunque reduzca descartes en el tramo siguiente.

## Referencias

- **RFC4594**: [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html). Clases, marcado y objetivos de QoS.
- **RFC3376**: [RFC 3376: Internet Group Management Protocol Version 3](https://www.rfc-editor.org/rfc/rfc3376.html). Pertenencia multicast IPv4 y selección de origen.
