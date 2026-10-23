# Soluciones — RED-M20-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Definir aplicaciones prioritarias, caudal/latencia permitidos y duración bajo pérdida de un uplink; verificar también recuperación y efectos en tráfico no prioritario.

### Criterios observables

- Define aplicaciones prioritarias y límites medibles durante el fallo.
- Incluye duración, recuperación e impacto en otras clases.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Capacidad remanente durante el fallo previsto**

La demanda debe caber también en la capacidad que permanece tras el fallo contemplado.

## Pregunta 2

**Respuesta: D. No, falta capacidad para ese pico**

Quedan 5 Gb/s para 7 Gb/s demandados: hay camino, pero no capacidad para sostener todo sin degradación.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **RFC7348**: [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html). Overlay Ethernet sobre infraestructura IP y contexto de VNI.
