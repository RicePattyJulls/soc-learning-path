# Soluciones — RED-M41-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Se confirmó un permiso registrado por el firewall contrario a la política por orden de reglas. El acceso efectivo al servicio y la autenticación quedan sin demostrar. Comprobar rol/identidad y caminos alternativos para acotar la corrección y su retest.

### Criterios observables

- Identifica el permiso registrado contrario a política por orden de reglas.
- Mantiene pendiente alcance de conexión y contrasta rol o caminos alternativos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. El permiso general se evalúa antes de la denegación específica**

El registro identifica R10 y la lista la evalúa antes que R20: ese orden respalda el permiso contrario a política.

## Pregunta 2

**Respuesta: D. Control administrativo del equipo sin evidencia de autenticación**

Permitir en el firewall no demuestra autenticación ni ejecución administrativa en el recurso final.

## Referencias

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
