# Soluciones — RED-M05-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Conservar hash del original y del derivado, filtro/selección, herramienta y versión, fecha y responsable. No reemplazar el original con el subconjunto exportado.

### Criterios observables

- Conserva hash y archivo original junto al derivado.
- Documenta selección, herramienta, versión, fecha y responsable.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Que coinciden los bytes comparados**

El hash compara bytes; no mide precisión del reloj, cobertura ni autenticidad del origen.

## Pregunta 2

**Respuesta: A. Truncamiento de lo conservado**

Se conservaron 96 de 1514 bytes: el paquete está truncado aunque el archivo no haya cambiado.

## Referencias

- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **CHECKSUM**: [Checksums](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html). Artefactos de checksum y offload.
- **RFC8484**: [RFC 8484: DNS Queries over HTTPS](https://www.rfc-editor.org/rfc/rfc8484.html). DNS sobre HTTPS; evita asumir que toda resolución DNS usa UDP/TCP 53.
