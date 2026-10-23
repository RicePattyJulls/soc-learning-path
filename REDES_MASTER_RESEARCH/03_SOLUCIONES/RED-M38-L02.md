# Soluciones — RED-M38-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Handlers/acciones auxiliares y criterio de cambio; registrar efectos sobre el servicio. Un diff vacío no prueba ausencia de acciones disruptivas.

### Criterios observables

- Revisa handlers y acciones auxiliares ante diff vacío.
- Registra reinicios e impacto, sin equiparar configuración sin cambios a servicio sin interrupción.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Reversibilidad garantizada**

Repetir con el mismo efecto no implica poder deshacerlo; reversibilidad es una propiedad diferente.

## Pregunta 2

**Respuesta: A. La interrupción causada por recrear la interfaz**

Recrear interfaz puede interrumpir sesiones aunque termine con la misma IP: mirar solo estado final omite impacto.

## Referencias

- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
