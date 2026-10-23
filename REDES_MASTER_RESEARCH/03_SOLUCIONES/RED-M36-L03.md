# Soluciones — RED-M36-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Red contenida dentro de otra debe solapar; redes adyacentes sin direcciones comunes no. Conservar resultado esperado independiente y probar errores de prefijo.

### Criterios observables

- Incluye red contenida que debe solapar.
- Incluye redes adyacentes sin direcciones comunes con resultado independiente.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Una comparación de cambios, no garantía de corrección**

El diff muestra cambios de texto, sin ejecutar dispositivos o comprobar corrección funcional.

## Pregunta 2

**Respuesta: D. Rechazo de una entrada IPv4 inválida**

999 excede el rango de un octeto IPv4: el caso verifica rechazo de entrada inválida.

## Referencias

- **PY-IP**: [ipaddress — IPv4/IPv6 manipulation library](https://docs.python.org/3/library/ipaddress.html). Tipos, redes y errores de validación; solo operaciones offline.
- **PY-JSON**: [json — JSON encoder and decoder](https://docs.python.org/3/library/json.html). Parsing y errores; no evaluación de instrucciones.
- **RFC8259**: [RFC 8259: JavaScript Object Notation Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html). Sintaxis de JSON; distinta de un esquema de aplicación.
- **YAML**: [YAML specification 1.2.2](https://yaml.org/spec/1.2.2/). Sintaxis y diferencia de modelos de datos.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
