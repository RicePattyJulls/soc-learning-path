# Soluciones — RED-M38-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Validar ruta de gestión durante cada fase y existencia de camino alternativo probado o mecanismo de rollback soportado. No aceptar el plan solo por ser sintácticamente válido.

### Criterios observables

- Comprueba ruta de gestión durante todas las fases.
- Exige camino alternativo probado o mecanismo soportado de recuperación.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Que el cambio preserve el servicio y la gestión**

Un diff expresa cambios propuestos; la continuidad de servicio y gestión necesita evaluación del efecto.

## Pregunta 2

**Respuesta: B. Pérdida de la única ruta de gestión durante la secuencia**

Eliminar primero la única ruta administrativa puede cortar el propio canal necesario para terminar o revertir.

## Referencias

- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
