# Soluciones — RED-M37-L04

Material de revisión: consultar después de resolver.

## Práctica individual

ID de tarea, identidad lógica, activo, versión de intención, estado por etapa y evidencia de verificación; excluir tokens y valores sensibles del diff y error.

### Criterios observables

- Registra tarea, identidad lógica, activo y versión de intención.
- Distingue estado por etapa y verificación, redactando diff y errores sensibles.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. El valor real de credenciales o tokens**

Credenciales y tokens reales se excluyen; ID, activo y estado sí aportan trazabilidad sin revelar autenticación.

## Pregunta 2

**Respuesta: A. Corresponde a otra operación de consulta**

El 200 procede de una consulta distinta: no informa del resultado del cambio que se pretende acreditar.

## Referencias

- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
- **RFC7950**: [RFC 7950: The YANG 1.1 Data Modeling Language](https://www.rfc-editor.org/rfc/rfc7950.html). Modelos, tipos y revisiones YANG.
- **RFC8040**: [RFC 8040: RESTCONF Protocol](https://www.rfc-editor.org/rfc/rfc8040.html). Recursos modelados mediante HTTP.
- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
