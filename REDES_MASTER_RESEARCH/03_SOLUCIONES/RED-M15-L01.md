# Soluciones — RED-M15-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Routing conoce una salida, pero la política del plano de datos bloquea ese servicio. No son estados contradictorios ni hay que borrar la ruta para explicar el deny.

### Criterios observables

- Clasifica ruta instalada como estado de routing.
- Clasifica deny TCP/22 como decisión del plano de datos, sin contradicción.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Información de routing aceptada o anunciada**

Un filtro de rutas controla información aceptada o anunciada; una ACL de datos controla paquetes.

## Pregunta 2

**Respuesta: C. El permiso exige el /24 exacto**

Permitir exactamente /24 no incluye /25 salvo que la política declare un rango de longitudes.

## Referencias

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
