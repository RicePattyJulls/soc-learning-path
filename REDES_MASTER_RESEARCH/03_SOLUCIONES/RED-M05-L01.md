# Soluciones — RED-M05-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Delimitar host/interfaz y protocolos necesarios en un filtro de captura compatible; verificarlo con tráfico docente conocido. Conservar alcance, expresión y contadores de pérdida.

### Criterios observables

- Delimita host, interfaz y protocolos necesarios en la adquisición.
- Verifica el filtro con tráfico conocido y conserva expresión y pérdidas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. El de captura**

El filtro de captura decide qué se guarda; cambiar después la vista no recupera lo descartado.

## Pregunta 2

**Respuesta: D. El filtro de captura tcp port 443 las excluyó**

TCP/443 excluye el intercambio DNS convencional UDP/TCP 53 planteado; no demuestra ausencia de resolución.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC8484**: [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html). DNS sobre HTTPS; evita asumir que toda resolución DNS usa UDP/TCP 53.
