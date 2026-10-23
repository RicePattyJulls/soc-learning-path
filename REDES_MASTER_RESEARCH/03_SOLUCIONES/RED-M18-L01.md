# Soluciones — RED-M18-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Origen/destino, tiempo UTC, método, rutas observadas, pérdida/latencia y delimitación del tramo. Separar pruebas del acceso local y del servicio extremo a extremo.

### Criterios observables

- Entrega extremos, UTC, método y resultados de pérdida/latencia.
- Delimita acceso local frente a servicio remoto y rutas observadas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Independencia de todos los dominios físicos de fallo**

Dos contratos no prueban diversidad de conducto, alimentación o acceso: esos dominios deben comprobarse.

## Pregunta 2

**Respuesta: D. El conducto físico compartido**

Un corte del conducto compartido puede afectar ambos circuitos, aunque haya operadores diferentes.

## Referencias

- **RFC4301**: [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html). Arquitectura IPsec y política; no prueba de un túnel concreto.
- **RFC3031**: [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html). Etiquetas y arquitectura MPLS; no confidencialidad automática.
