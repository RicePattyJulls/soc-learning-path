# Soluciones — RED-M38-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Reversión de configuración comprobada, recuperación de servicio pendiente. Investigar dependencias, sesiones y cambios externos con evidencias antes de cerrar.

### Criterios observables

- Declara configuración revertida y servicio aún pendiente.
- Investiga dependencias, sesiones y cambios externos antes de cerrar recuperación.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Cambios realmente aplicados y estado previo de cada activo**

El rollback debe seguir cambios efectivos y estado previo por activo, no una lista sin estados de ejecución.

## Pregunta 2

**Respuesta: B. Modificar un activo que no había cambiado con un estado ajeno**

C no cambió; restaurar un backup ajeno introduciría una modificación nueva durante la reversión.

## Referencias

- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
