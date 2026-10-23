# Soluciones — RED-M36-L04

Material de revisión: consultar después de resolver.

## Práctica individual

La operación podría haberse aplicado aunque no se recibiera respuesta. Consultar estado o usar mecanismos de idempotencia soportados antes de repetir una creación.

### Criterios observables

- Reconoce que una creación pudo aplicarse antes del timeout.
- Consulta estado o usa idempotencia soportada antes de repetir.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Resultado no obtenido dentro del plazo**

Timeout informa que no se obtuvo resultado en plazo; no demuestra vacío, inexistencia o estado correcto.

## Pregunta 2

**Respuesta: C. Un éxito, un resultado no obtenido y un inválido**

A válido, B sin resultado y C inválido son tres estados diferentes, aunque el proceso termine.

## Referencias

- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
- **PY-JSON**: [json — JSON encoder and decoder](https://docs.python.org/3/library/json.html). Parsing y errores; no evaluación de instrucciones.
- **RFC8259**: [RFC 8259: JavaScript Object Notation Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html). Sintaxis de JSON; distinta de un esquema de aplicación.
- **YAML**: [YAML specification 1.2.2](https://yaml.org/spec/1.2.2/). Sintaxis y diferencia de modelos de datos.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
