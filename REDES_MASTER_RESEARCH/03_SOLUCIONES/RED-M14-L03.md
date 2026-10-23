# Soluciones — RED-M14-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Interpretación y cumplimiento de la comunidad por los equipos y políticas aplicables. La etiqueta necesita tratamiento correcto y comprobación de anuncios efectivos.

### Criterios observables

- Comprueba tratamiento de no-export por políticas y equipos.
- Observa anuncios efectivos en lugar de confiar solo en la etiqueta.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. La legitimidad de cada prefijo**

Limitar cantidad no decide si cada ruta está autorizada; un conjunto pequeño también puede contener prefijos ilegítimos.

## Pregunta 2

**Respuesta: D. Exportar rutas fuera del prefijo autorizado**

El contrato permite solo el /24 propio; exportar default y rutas ajenas excede ese permiso.

## Referencias

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.
