# Soluciones — RED-M02-L03

Material de revisión: consultar después de resolver.

## Práctica individual

198.51.100.0/25 cubre .0–.127. Debe confirmarse que el equipo que lo anuncia puede alcanzar ambos componentes o descartar de forma controlada destinos ausentes.

### Criterios observables

- Obtiene 198.51.100.0/25 y final .127.
- Condiciona el anuncio a alcanzar componentes o descartar destinos ausentes de forma controlada.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Su alineación y las rutas que realmente cubre**

Un agregado debe comenzar en un límite válido y no anunciar inadvertidamente destinos sin ruta.

## Pregunta 2

**Respuesta: A. 192.0.2.0/24**

Los dos /25 consecutivos y alineados cubren .0–.255, exactamente el /24 .0.

## Referencias

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **RFC3021**: [RFC 3021: 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021.html). Excepción de capacidad para /31 en enlaces apropiados.
- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
