# Soluciones — RED-M18-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Comparten underlay físico. La redundancia lógica no sobrevivirá a ese acceso sin una vía de transporte independiente comprobada.

### Criterios observables

- Identifica cable y acceso físico como dependencia común.
- Explica que dos overlays no aportan independencia de ese underlay.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Dar conectividad de transporte al overlay**

El underlay proporciona el transporte sobre el que funciona el overlay; no reemplaza políticas de seguridad.

## Pregunta 2

**Respuesta: D. B por cumplir mejor el umbral de jitter dado**

B tiene jitter 10 ms frente a 50 ms de A; satisface el umbral dado si las otras condiciones se cumplen.

## Referencias

- **RFC4301**: [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html). Arquitectura IPsec y política; no prueba de un túnel concreto.
- **RFC3031**: [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html). Etiquetas y arquitectura MPLS; no confidencialidad automática.
