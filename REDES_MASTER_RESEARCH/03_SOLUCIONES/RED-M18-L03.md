# Soluciones — RED-M18-L03

Material de revisión: consultar después de resolver.

## Práctica individual

No. La visibilidad de traceroute depende del tratamiento de TTL y respuestas. Usar documentación del servicio y mediciones acordadas, no reconstruir una topología ficticia.

### Criterios observables

- Explica la dependencia de traceroute respecto a TTL y respuestas.
- Pide documentación o medidas acordadas sin inventar saltos del núcleo.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Etiquetas**

MPLS decide forwarding mediante etiquetas en su dominio; no usa una contraseña de aplicación como etiqueta.

## Pregunta 2

**Respuesta: D. Cifrado efectivo entre los extremos definidos por el requisito**

Separar clientes en una VPN MPLS no demuestra cifrado del payload; hay que verificar protección criptográfica.

## Referencias

- **RFC4301**: [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html). Arquitectura IPsec y política; no prueba de un túnel concreto.
- **RFC3031**: [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html). Etiquetas y arquitectura MPLS; no confidencialidad automática.
