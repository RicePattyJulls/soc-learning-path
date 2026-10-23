# Soluciones — RED-M15-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Rutas legítimas de entrada/retorno, prefijos esperados y capacidades de validación de la plataforma; elegir el control adecuado y probar orígenes válidos e inválidos.

### Criterios observables

- Documenta rutas legítimas y prefijos de entrada esperados.
- Selecciona validación compatible con multihoming y prueba orígenes válidos e inválidos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Tráfico legítimo con routing asimétrico**

El modo estricto puede rechazar entrada por B si la mejor ruta de vuelta usa A, aun siendo tráfico legítimo.

## Pregunta 2

**Respuesta: B. Que existe spoofing confirmado sin contrastar la asimetría**

La asimetría observada explica un rechazo posible; no basta para declarar origen falsificado.

## Referencias

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
