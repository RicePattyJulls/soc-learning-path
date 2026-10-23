# Soluciones — RED-M18-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Una protección criptográfica efectiva, por ejemplo IPsec correctamente aplicada al tráfico previsto. GRE por sí solo no oculta payload.

### Criterios observables

- Identifica protección criptográfica adicional sobre GRE.
- Comprueba que cubra efectivamente el tráfico previsto.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Cifrado**

GRE añade encapsulación sin cifrar por sí mismo; la confidencialidad necesita protección adicional.

## Pregunta 2

**Respuesta: D. Que el tráfico esperado circule correctamente en ambos sentidos**

La SA demuestra negociación, pero no selectores, rutas y retorno correctos del tráfico de datos.

## Referencias

- **RFC4301**: [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html). Arquitectura IPsec y política; no prueba de un túnel concreto.
- **RFC3031**: [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html). Etiquetas y arquitectura MPLS; no confidencialidad automática.
