# Soluciones — RED-M42-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Verificar conexión/servicio de ida y vuelta y flujo denegado de control; no cerrar si falta retorno observado, persiste fallo de aplicación o se rompe acceso legítimo.

### Criterios observables

- Verifica servicio de ida/vuelta y un flujo denegado de control.
- No cierra ante fallo de aplicación, retorno ausente o regresión de acceso legítimo.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Resolver una causa nueva con pruebas justificadas**

Resolver un caso nuevo con pruebas justificadas demuestra transferencia mejor que repetir comandos o sumar XP.

## Pregunta 2

**Respuesta: D. Retorno por gateway incorrecto**

SYN llega y respuesta sale al gateway equivocado: los datos respaldan investigar retorno.

## Referencias

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
