# Soluciones — RED-M20-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Origen administrativo específico, servicio de gestión requerido, autenticación y registro, con ventana o condiciones pertinentes; no permitir toda la red de usuarios hacia toda la DMZ.

### Criterios observables

- Acota origen y servicio de administración.
- Incluye autenticación y registro con condiciones pertinentes.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Flujos y controles explícitos**

Los flujos y su enforcement permiten probar una zona; nombre o color no establecen permisos.

## Pregunta 2

**Respuesta: C. Web hacia DB por TCP/5432**

La matriz permite web→DB TCP/5432 y deniega web→usuarios; las otras opciones exceden lo definido.

## Referencias

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **RFC7348**: [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html). Overlay Ethernet sobre infraestructura IP y contexto de VNI.
