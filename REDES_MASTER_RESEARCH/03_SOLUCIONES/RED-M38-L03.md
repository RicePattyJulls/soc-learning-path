# Soluciones — RED-M38-L03

Material de revisión: consultar después de resolver.

## Práctica individual

No si gestión es criterio requerido. Detener, recuperar y analizar; no usar una métrica de tráfico como sustituto del conjunto de condiciones de éxito.

### Criterios observables

- Detiene el lote al fallar gestión requerida.
- Recupera y analiza aunque el tráfico de usuarios todavía pase.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Riesgos y variantes relevantes del despliegue**

El canary debe cubrir variantes y riesgos; escoger solo el equipo cómodo puede dejar incompatibilidades sin evaluar.

## Pregunta 2

**Respuesta: B. Compatibilidad de los equipos con versión B**

La versión B de sesenta equipos no está representada por el canary A.

## Referencias

- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
