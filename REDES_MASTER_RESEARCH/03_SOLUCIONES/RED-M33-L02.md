# Soluciones — RED-M33-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Registro o contador coincidente de deny en el control previsto, junto con confirmación de que el origen envió la prueba y el servicio/camino estaban definidos.

### Criterios observables

- Pide deny o contador coincidente del control previsto.
- Contrasta envío desde origen y definición de servicio/camino.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Probar los flujos concretos autorizados para la pregunta**

Probar flujos concretos responde la pregunta sin ampliar destinos o tasa innecesariamente.

## Pregunta 2

**Respuesta: D. La causa exacta del silencio por sí solo**

El timeout describe falta de respuesta en plazo, sin localizar por sí mismo el control o causa.

## Referencias

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **ZEEK-CONN**: [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html). Registros de conexión y límites; los fixtures del curso usan otro esquema declarado.
