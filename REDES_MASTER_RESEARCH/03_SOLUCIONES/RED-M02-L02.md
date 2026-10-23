# Soluciones — RED-M02-L02

Material de revisión: consultar después de resolver.

## Práctica individual

B requiere /26; .64/26 abarcaría .64–.127 y solaparía C. Reubicar C o B mediante un cambio planificado y revisar rutas, DHCP y ACL.

### Criterios observables

- Dimensiona B con /26 para 40 hosts.
- Detecta el solapamiento y propone reubicación y actualización de dependencias.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Asignar rangos solapados**

Los prefijos distintos son precisamente VLSM; el defecto es que dos asignaciones ocupen las mismas direcciones.

## Pregunta 2

**Respuesta: D. Incluye el rango asignado a C**

El /26 .64–.127 contiene C, que ocupa .96–.111; ampliar exige revisar ambas asignaciones.

## Referencias

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **RFC3021**: [RFC 3021: 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021.html). Excepción de capacidad para /31 en enlaces apropiados.
- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
