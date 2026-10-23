# Soluciones — RED-M15-L03

Material de revisión: consultar después de resolver.

## Práctica individual

No abrir todos los prefijos ni asumir autorización de todos los puertos. Especificar rutas, retorno y política de servicio con prueba positiva y negativa.

### Criterios observables

- Acota rutas y servicios del leaking.
- Comprueba retorno y permisos con prueba positiva y negativa.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. El contexto de routing**

La VRF separa búsquedas de rutas; no cifra automáticamente el payload ni separa el espectro radio.

## Pregunta 2

**Respuesta: A. Usar una ruta de otra VRF como prueba de alcance en B**

La ruta pertenece a A: una prueba originada en B necesita sus propias rutas o leaking explícito.

## Referencias

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
