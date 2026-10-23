# Soluciones — RED-M15-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Filtro explícito por prefijos autorizados y marcas de procedencia para impedir reentrada, con pruebas de retirada y retorno. Revisar métricas y rutas alternativas.

### Criterios observables

- Limita prefijos a los requeridos.
- Usa marcas y filtros para impedir reentrada, probando retirada y retorno.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. La realimentación de rutas**

Varios cruces bidireccionales pueden reintroducir rutas; hacen falta reglas de origen y prevención de reentrada.

## Pregunta 2

**Respuesta: B. La procedencia de la ruta y su tratamiento al cruzar dominios**

La procedencia permite reconocer una ruta que vuelve a su dominio; una etiqueta sin tratamiento no evita nada.

## Referencias

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
