# Soluciones — RED-M20-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Flujos/capacidad entre edificios y requisitos de disponibilidad/gestión, además de presupuesto y crecimiento. El número de equipos por sí solo no determina toda la arquitectura.

### Criterios observables

- Obtiene flujos y demanda entre edificios.
- Obtiene disponibilidad y capacidad operativa/gestión antes de escalar la arquitectura.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Agregar bloques de acceso y funciones de política según diseño**

La distribución agrega acceso y políticas según diseño; no elimina el control ni autentica automáticamente aplicaciones.

## Pregunta 2

**Respuesta: C. Un requisito que compense su complejidad y coste operativo**

Se necesita una necesidad medible que justifique coste y complejidad, no añadir fabrics por denominación.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **RFC7348**: [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html). Overlay Ethernet sobre infraestructura IP y contexto de VNI.
