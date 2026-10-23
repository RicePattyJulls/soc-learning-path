# Soluciones — RED-M13-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Un mecanismo de protección del plano de datos comprobado, como un túnel apropiado. Autenticar mensajes de routing no cifra automáticamente todos los paquetes reenviados.

### Criterios observables

- Identifica una protección del plano de datos adicional.
- Exige comprobar que esa protección cubra el tráfico de usuario previsto.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. La extensión y soporte de familia en la implementación concreta**

El soporte de familia y extensión depende de la implementación; el número de versión no lo acredita.

## Pregunta 2

**Respuesta: B. Cifrado de todo el tráfico de usuarios**

Autenticar routing protege mensajes de control, sin cifrar automáticamente los paquetes de usuarios.

## Referencias

- **FRR-OSPF**: [OSPFv2](https://docs.frrouting.org/en/latest/ospfd.html). Vecinos, LSDB, áreas, roles y operación OSPFv2.
- **FRR-OSPF6**: [OSPFv3](https://docs.frrouting.org/en/latest/ospf6d.html). Implementación OSPFv3 y familias soportadas según versión.
