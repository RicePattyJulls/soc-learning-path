# Soluciones — RED-M03-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Probar servicio autorizado en IPv4 e IPv6 y servicio prohibido en ambas familias. Registrar ruta, origen y decisión efectiva del control, incluyendo errores ICMPv6 pertinentes.

### Criterios observables

- Incluye permiso y denegación en cada familia: cuatro pruebas.
- Registra origen, ruta y decisión del control para cada resultado.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. El servicio puede ser seleccionado por cualquiera de las dos familias**

A ofrece IPv4 y AAAA IPv6; la selección puede conducir a políticas y caminos distintos.

## Pregunta 2

**Respuesta: A. No demuestra el comportamiento del acceso por IPv6**

Probar una familia aporta evidencia de ese camino, sin verificar las reglas ni la ruta de la otra.

## Referencias

- **RFC4291**: [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html). Formato, ámbitos y tipos de direcciones IPv6.
- **RFC8200**: [RFC 8200: Internet Protocol, Version 6](https://www.rfc-editor.org/rfc/rfc8200.html). Cabecera IPv6 y fragmentación por origen.
- **RFC4861**: [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861.html). Vecinos, routers y mensajes ICMPv6.
- **RFC4862**: [RFC 4862: IPv6 Stateless Address Autoconfiguration](https://www.rfc-editor.org/rfc/rfc4862.html). SLAAC y detección de direcciones duplicadas.
