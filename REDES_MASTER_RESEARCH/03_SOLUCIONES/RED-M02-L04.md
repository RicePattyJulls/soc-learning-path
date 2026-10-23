# Soluciones — RED-M02-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Revisar tabla ARP y asignación IP/MAC con inventario; contrastar VLAN del puerto y visibilidad del gateway. Registrar cambios temporales antes de afirmar una duplicidad.

### Criterios observables

- Contrasta asignaciones y respuestas IP/MAC con tiempo.
- Comprueba VLAN y presencia del gateway para distinguir hipótesis.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. El host considera local el destino por su /24 en vez del /25 previsto**

Con /24, .10 y .200 parecen vecinos locales; el /25 previsto separaría ambos destinos.

## Pregunta 2

**Respuesta: A. Corroboración de asignaciones y respuestas IP/MAC en el tiempo**

Una duplicidad exige contrastar asignación y respuestas en el tiempo; una máscara o tabla aislada no la demuestra.

## Referencias

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **RFC3021**: [RFC 3021: 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021.html). Excepción de capacidad para /31 en enlaces apropiados.
- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
