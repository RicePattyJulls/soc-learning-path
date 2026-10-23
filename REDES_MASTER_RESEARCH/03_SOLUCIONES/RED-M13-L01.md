# Soluciones — RED-M13-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Revisar recepción de Hellos y presencia del propio router en ellos; área y temporizadores/autenticación. Distinguir ese estado de un 2-Way normal.

### Criterios observables

- Comprueba bidireccionalidad mediante Hellos.
- Compara área y temporizadores o autenticación para el vecino en Init.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Conectar áreas OSPF según la arquitectura del protocolo**

ABR enlaza áreas OSPF en su arquitectura; no asigna DHCP ni hace NAT por definición.

## Pregunta 2

**Respuesta: C. No, es normal entre DROther en ese medio broadcast**

Entre dos DROther del medio broadcast no se exige Full; Full con DR/BDR es coherente con el diseño.

## Referencias

- **FRR-OSPF**: [OSPFv2](https://docs.frrouting.org/en/latest/ospfd.html). Vecinos, LSDB, áreas, roles y operación OSPFv2.
- **FRR-OSPF6**: [OSPFv3](https://docs.frrouting.org/en/latest/ospf6d.html). Implementación OSPFv3 y familias soportadas según versión.
