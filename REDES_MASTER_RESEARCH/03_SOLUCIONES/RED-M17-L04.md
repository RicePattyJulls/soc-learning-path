# Soluciones — RED-M17-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Posible retorno asimétrico. Revisar rutas y correlacionar 5-tupla/tiempo en ambos dispositivos; no declarar pérdida del SYN/ACK porque no aparece en A.

### Criterios observables

- Propone asimetría como hipótesis.
- Correlaciona rutas, 5-tupla y tiempo en A y B.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Traducción y tiempo con precisión suficiente**

Puertos y tiempo permiten unir traducción y evento; una IP de salida de todo un día deja múltiples candidatos.

## Pregunta 2

**Respuesta: A. Asimetría del camino**

Ver sentidos en equipos distintos admite retorno asimétrico; no implica ausencia del SYN/ACK.

## Referencias

- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
