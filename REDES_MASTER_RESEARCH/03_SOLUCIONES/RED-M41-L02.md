# Soluciones — RED-M41-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Conservar ambas horas y declarar demora no separable del error de reloj hasta obtener una referencia; no trasladar el offset de otro sensor sin evidencia.

### Criterios observables

- Conserva horas originales si falta offset.
- Declara demora no separable de error de reloj sin trasladar offsets de otra fuente.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. 10:00:00Z**

El reloj adelanta dos segundos: se resta +2 s a 10:00:02Z y resulta 10:00:00Z.

## Pregunta 2

**Respuesta: A. 5 segundos**

Recepción 10:00:05Z menos evento corregido 10:00:00Z da 5 s; usar hora cruda mezclaría desfase y transporte.

## Referencias

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
