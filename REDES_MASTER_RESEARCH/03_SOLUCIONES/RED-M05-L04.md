# Soluciones — RED-M05-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Telemetría del endpoint o registros de aplicación con proceso, tiempo y conexión. El PCAP de red por sí solo no incluye necesariamente esa atribución de proceso.

### Criterios observables

- Pide telemetría de proceso o aplicación vinculada a la conexión.
- Justifica por qué el PCAP por sí solo no discrimina los procesos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Una respuesta a una consulta, no prueba de uso posterior**

La respuesta DNS contiene información, pero no evidencia por sí sola su uso por una aplicación.

## Pregunta 2

**Respuesta: A. Evidencia adicional del contenido de aplicación**

Sin contenido de aplicación o fuente equivalente no se obtiene la URL completa de esa sesión cifrada.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC8484**: [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html). DNS sobre HTTPS; evita asumir que toda resolución DNS usa UDP/TCP 53.
