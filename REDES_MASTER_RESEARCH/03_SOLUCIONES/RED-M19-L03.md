# Soluciones — RED-M19-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Membresía/querier de cada segmento y estado multicast/RPF entre ellos. Conservar origen, grupo, interfaz e intervalo para no mezclar sesiones distintas.

### Criterios observables

- Compara membresía y querier en ambas VLAN.
- Compara estado multicast/RPF con origen, grupo e interfaz.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Pertenencia a grupos multicast IPv4**

IGMP comunica pertenencia de receptores IPv4; no crea por sí solo todo el camino entre redes.

## Pregunta 2

**Respuesta: A. Un camino multicast adecuado desde el origen**

Existe membresía local, pero falta distribución multicast desde el origen hasta la red receptora.

## Referencias

- **RFC4594**: [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html). Clases, marcado y objetivos de QoS.
- **RFC3376**: [RFC 3376: Internet Group Management Protocol Version 3](https://www.rfc-editor.org/rfc/rfc3376.html). Pertenencia multicast IPv4 y selección de origen.
