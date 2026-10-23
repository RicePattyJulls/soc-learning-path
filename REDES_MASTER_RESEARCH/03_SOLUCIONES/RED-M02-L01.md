# Soluciones — RED-M02-L01

Material de revisión: consultar después de resolver.

## Práctica individual

La red es 192.0.2.128/26, broadcast .191; .126 pertenece al bloque anterior. El error de pertenencia puede provocar decisiones distintas sobre usar gateway o enlace local.

### Criterios observables

- Calcula red .128 y broadcast .191.
- Excluye .126 y explica la diferencia de pertenencia.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. 64**

Quedan seis bits: 2 elevado a 6 son 64 direcciones; 62 es la capacidad convencional de hosts.

## Pregunta 2

**Respuesta: A. 192.0.2.64/26**

Los bloques /26 comienzan cada 64 direcciones; .70 pertenece a .64–.127.

## Referencias

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **RFC3021**: [RFC 3021: 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021.html). Excepción de capacidad para /31 en enlaces apropiados.
- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
