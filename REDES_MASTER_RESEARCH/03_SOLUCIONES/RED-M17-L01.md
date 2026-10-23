# Soluciones — RED-M17-L01

Material de revisión: consultar después de resolver.

## Práctica individual

La IP compartida omite el puerto y el contexto temporal necesarios para distinguir traducciones. Conservar la 5-tupla y registros de NAT.

### Criterios observables

- Conserva puertos y tiempo además de IP compartida.
- Explica por qué .5 por sí sola no distingue clientes.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. El destino del paquete**

DNAT traduce destino; no autentica la identidad ni modifica necesariamente contenido de aplicación.

## Pregunta 2

**Respuesta: D. El registro de traducción y su contexto temporal**

La observación externa necesita una traducción que relacione .5:40001 con el cliente en ese instante.

## Referencias

- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
