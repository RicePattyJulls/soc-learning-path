# Soluciones — RED-M34-L01

Material de revisión: consultar después de resolver.

## Práctica individual

No afirmar segmentación eficaz demostrada. Falta acreditar origen, servicio, ruta y punto de bloqueo; ambos podrían fallar por conectividad general.

### Criterios observables

- Evita declarar segmentación eficaz con dos timeouts sin corroboración.
- Pide evidencia de origen, servicio, ruta y punto de bloqueo.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Para comprobar que el método puede observar conectividad válida**

La prueba permitida comprueba que origen, servicio y método pueden observar comunicación válida.

## Pregunta 2

**Respuesta: C. Deny coincidente del control previsto**

El deny del flujo y tiempo esperados corrobora el punto de bloqueo; el nombre DB no lo hace.

## Referencias

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
