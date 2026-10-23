# Soluciones — RED-M37-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Comprobar módulo/revisión y capacidades, validar payload contra el contrato aplicable y bloquear el cambio incompatible con un mensaje claro.

### Criterios observables

- Comprueba módulo, revisión y capacidades.
- Valida payload y bloquea la operación incompatible con error claro.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Un modelo de datos**

YANG describe datos; no es el protocolo de transporte ni un mecanismo de cifrado.

## Pregunta 2

**Respuesta: D. Depende de capacidades no anunciadas**

El dispositivo no anuncia candidate ni confirmed-commit: el plan exige capacidades ausentes.

## Referencias

- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
- **RFC7950**: [RFC 7950: The YANG 1.1 Data Modeling Language](https://www.rfc-editor.org/rfc/rfc7950.html). Modelos, tipos y revisiones YANG.
- **RFC8040**: [RFC 8040: RESTCONF Protocol](https://www.rfc-editor.org/rfc/rfc8040.html). Recursos modelados mediante HTTP.
- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
