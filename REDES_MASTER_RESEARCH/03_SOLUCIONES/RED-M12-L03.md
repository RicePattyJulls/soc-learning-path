# Soluciones — RED-M12-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Usa B por el /24. .20 no pertenece a .128/25, así que esa entrada más específica no coincide con el destino.

### Criterios observables

- Selecciona B para .20 mediante la ruta 192.0.2.0/24.
- Demuestra que .20 no pertenece a .128/25.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. La longitud de los prefijos instalados que coinciden con el destino**

LPM compara especificidad entre prefijos que sí coinciden; no compara nombres o métricas de protocolos distintos.

## Pregunta 2

**Respuesta: D. C por el /25**

.130 pertenece a .128/25: C es la coincidencia más específica instalada.

## Referencias

- **FRR-STATIC**: [STATIC](https://docs.frrouting.org/en/latest/static.html). Rutas estáticas y siguiente salto.
- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
