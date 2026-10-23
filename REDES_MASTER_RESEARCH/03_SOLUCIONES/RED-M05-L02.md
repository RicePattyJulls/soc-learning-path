# Soluciones — RED-M05-L02

Material de revisión: consultar después de resolver.

## Práctica individual

La conmutación virtual puede mantener tráfico entre VMs dentro del host. Hace falta observar el switch virtual o interfaces apropiadas, con autorización y alcance definidos.

### Criterios observables

- Explica que tráfico entre VMs puede quedarse en el switch virtual.
- Propone observar interfaces o conmutación virtual apropiadas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. El tráfico que recibe o envía según el funcionamiento del switch**

Un puerto normal recibe tráfico según la conmutación; no ofrece una copia completa de los demás puertos.

## Pregunta 2

**Respuesta: C. Posible sobresuscripción y pérdida en la observación**

El espejo puede recibir más tráfico del que entrega: la pérdida de observación no equivale a pérdida en producción.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC8484**: [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html). DNS sobre HTTPS; evita asumir que toda resolución DNS usa UDP/TCP 53.
