# Soluciones — RED-M34-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Identidad/rol, hora, dispositivo, origen y flujo por intento, con políticas aplicadas. No unir resultados de usuarios distintos como si fueran una única sesión.

### Criterios observables

- Registra identidad/rol, dispositivo y hora por intento.
- Relaciona cada flujo con su política sin mezclar resultados de sesiones distintas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Autorización efectiva de los servicios según el rol**

Después de autenticar se verifica qué recursos permite realmente el rol; Accept no valida toda autorización.

## Pregunta 2

**Respuesta: D. En la autorización que permite gestión no prevista**

El invitado recibe acceso de gestión que la matriz prohíbe: el defecto está en autorización efectiva.

## Referencias

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
