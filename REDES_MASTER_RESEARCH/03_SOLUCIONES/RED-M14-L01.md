# Soluciones — RED-M14-L01

Material de revisión: consultar después de resolver.

## Práctica individual

La ruta necesita un next hop resoluble y forwarding correcto. Revisar resolución en el contexto de routing, sin equiparar aceptación BGP a entrega de aplicación.

### Criterios observables

- Comprueba resolución del next hop y forwarding.
- Distingue aceptación del prefijo de entrega de datos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. La relación entre AS diferentes o el mismo AS**

eBGP conecta AS distintos e iBGP opera dentro del mismo AS; la familia IP no define esa diferencia.

## Pregunta 2

**Respuesta: C. La política aplicada a rutas recibidas**

Se reciben diez prefijos y se aceptan cero: la política filtra tras establecer la sesión.

## Referencias

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.
