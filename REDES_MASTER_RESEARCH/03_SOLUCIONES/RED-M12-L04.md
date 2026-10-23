# Soluciones — RED-M12-L04

Material de revisión: consultar después de resolver.

## Práctica individual

La red entrega la respuesta; revisar estado TCP y aplicación del cliente o intermediarios que puedan generar el RST. Conservar 5-tupla y secuencias.

### Criterios observables

- Reconoce que llegó SYN/ACK y ahora el cliente emite RST.
- Revisa estado TCP/proceso y posibles intermediarios, conservando 5-tupla y secuencias.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Una ruta y política de retorno utilizables**

Que un paquete use una salida no acredita que el destino tenga ruta o permiso de vuelta.

## Pregunta 2

**Respuesta: C. SYN recibido y SYN/ACK encaminado por una salida sin retorno adecuado**

SYN llega, pero la respuesta toma una salida sin ruta al cliente: la evidencia está en el retorno.

## Referencias

- **FRR-STATIC**: [STATIC](https://docs.frrouting.org/en/latest/static.html). Rutas estáticas y siguiente salto.
- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
