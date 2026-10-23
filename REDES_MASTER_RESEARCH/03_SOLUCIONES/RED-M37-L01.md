# Soluciones — RED-M37-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Permisos, alcance del recurso y contrato del endpoint. Una denegación de autorización no es, por sí sola, un fallo de negociación TLS.

### Criterios observables

- Comprueba permisos y alcance del recurso ante 403.
- Interpreta contrato del endpoint sin atribuirlo automáticamente a TLS.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Aceptación con procesamiento aún pendiente**

202 acepta procesamiento sin prometer que ya terminó; se consulta el estado según el contrato de la API.

## Pregunta 2

**Respuesta: D. La tarea todavía no se declara completada**

Pending declara trabajo pendiente; no acredita finalización ni validación de configuración.

## Referencias

- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
- **RFC7950**: [RFC 7950: The YANG 1.1 Data Modeling Language](https://www.rfc-editor.org/rfc/rfc7950.html). Modelos, tipos y revisiones YANG.
- **RFC8040**: [RFC 8040: RESTCONF Protocol](https://www.rfc-editor.org/rfc/rfc8040.html). Recursos modelados mediante HTTP.
- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
