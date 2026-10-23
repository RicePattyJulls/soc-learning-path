# Soluciones — RED-M37-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Apoya idempotencia para ese estado y escenario probado, no para toda versión o entrada. Verificar funcionamiento y ausencia de cambios fuera del alcance.

### Criterios observables

- Limita la evidencia a esa versión, entrada y estado probados.
- Comprueba funcionamiento y ausencia de cambios ajenos al alcance.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Reaplicar el mismo estado no produce nuevos cambios innecesarios**

La repetición debe mantener el estado previsto sin añadir cambios innecesarios; usar Ansible no lo garantiza.

## Pregunta 2

**Respuesta: B. Vuelve a añadir una línea ya deseada**

Añadir de nuevo la línea muestra una acción repetida que no converge respecto al estado deseado.

## Referencias

- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
- **RFC7950**: [RFC 7950: The YANG 1.1 Data Modeling Language](https://www.rfc-editor.org/rfc/rfc7950.html). Modelos, tipos y revisiones YANG.
- **RFC8040**: [RFC 8040: RESTCONF Protocol](https://www.rfc-editor.org/rfc/rfc8040.html). Recursos modelados mediante HTTP.
- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
