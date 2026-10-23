# Soluciones — RED-M36-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Capturar el error de validación pertinente, registrar fila y motivo sin datos sensibles y marcar el resultado inválido. No convertirlo en falso fuera de red como si fuera una IP válida.

### Criterios observables

- Captura el error y registra fila y motivo.
- Conserva estado inválido sin convertirlo en una dirección válida fuera de red.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Pertenencia de una dirección a un prefijo**

El operador compara dirección y red interpretadas por ipaddress; no hace un sondeo ni busca solo una subcadena.

## Pregunta 2

**Respuesta: C. True**

.70 pertenece al bloque .0–.255 de /24; el cálculo es local y devuelve True.

## Referencias

- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
- **PY-JSON**: [json — JSON encoder and decoder](https://docs.python.org/3/library/json.html). Parsing y errores; no evaluación de instrucciones.
- **RFC8259**: [RFC 8259: JavaScript Object Notation Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html). Sintaxis de JSON; distinta de un esquema de aplicación.
- **YAML**: [YAML specification 1.2.2](https://yaml.org/spec/1.2.2/). Sintaxis y diferencia de modelos de datos.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
