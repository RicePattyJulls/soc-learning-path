# Soluciones — RED-M39-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Medir resolución y consulta desde el cliente con tiempo y resolver explícitos, comparándola con petición que preserve la semántica por nombre. Si DNS responde rápido durante el fallo, investigar otras fases.

### Criterios observables

- Mide resolución desde cliente con tiempo y resolver explícitos.
- Conserva semántica por nombre y contempla DNS rápido durante el fallo como evidencia contraria.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Como propuesta a verificar por fuente, versión, efecto y recuperación**

Una propuesta de IA necesita contraste documental y operativo; no acredita ejecución ni otorga permiso.

## Pregunta 2

**Respuesta: B. La demora de resolución DNS**

La medida identifica cinco segundos en DNS con RTT estable: esa dependencia merece una prueba discriminante.

## Referencias

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **RFC4594**: [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html). Clases, marcado y objetivos de QoS.
