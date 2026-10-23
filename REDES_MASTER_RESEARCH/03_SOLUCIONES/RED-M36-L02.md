# Soluciones — RED-M36-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Tipos, campos permitidos, rango MTU aplicable y prefijos parseables/no solapados según diseño. Tratar todo como datos, con mensajes de error identificables.

### Criterios observables

- Valida campos/tipos y rango de MTU aplicable.
- Interpreta prefijos y solapamientos según diseño, sin ejecutar datos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Cumplimiento de todos los requisitos del esquema**

Parsear acredita sintaxis aceptada, no todos los campos, tipos o rangos requeridos por el esquema.

## Pregunta 2

**Respuesta: C. Es una cadena y el esquema exige entero**

"20" es una cadena JSON; el esquema del caso pide el entero 20.

## Referencias

- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
- **PY-JSON**: [json — JSON encoder and decoder](https://docs.python.org/3/library/json.html). Parsing y errores; no evaluación de instrucciones.
- **RFC8259**: [RFC 8259: JavaScript Object Notation Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html). Sintaxis de JSON; distinta de un esquema de aplicación.
- **YAML**: [YAML specification 1.2.2](https://yaml.org/spec/1.2.2/). Sintaxis y diferencia de modelos de datos.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
