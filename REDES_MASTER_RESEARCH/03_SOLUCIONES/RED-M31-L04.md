# Soluciones — RED-M31-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Pruebas de usuarios autorizados y denegación esperada; sensor enviando evidencia con cobertura; configuración/contención temporal revisada y retorno documentado.

### Criterios observables

- Incluye pruebas de acceso permitido y denegado.
- Restaura sensor y revisa contención temporal/configuración con retorno documentado.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Pruebas de servicio, acceso legítimo, controles y observabilidad requeridos**

Cerrar requiere probar servicio, acceso legítimo y controles; una alerta ausente no verifica esas condiciones.

## Pregunta 2

**Respuesta: C. Acceso legítimo y observabilidad restaurados**

HTTP responde, pero faltan acceso válido y sensor: la recuperación sigue parcial.

## Referencias

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
