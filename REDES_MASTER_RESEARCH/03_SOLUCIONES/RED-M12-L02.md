# Soluciones — RED-M12-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Para .20 usa el /24 hacia R3; para 198.51.100.20 sigue la default, si no hay otra ruta. Revisar también el camino de retorno.

### Criterios observables

- Selecciona /24 vía R3 para 203.0.113.20.
- Selecciona default para 198.51.100.20 bajo las rutas dadas y pide retorno.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. ::/0**

::/0 tiene cero bits de prefijo y coincide con cualquier destino IPv6; ::/128 es una dirección individual.

## Pregunta 2

**Respuesta: A. Un posible bucle entre defaults**

Las defaults se apuntan entre sí y no hay específica: el paquete puede circular hasta agotar TTL.

## Referencias

- **FRR-STATIC**: [STATIC](https://docs.frrouting.org/en/latest/static.html). Rutas estáticas y siguiente salto.
- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
