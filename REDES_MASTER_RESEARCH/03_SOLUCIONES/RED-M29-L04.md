# Soluciones — RED-M29-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Solicitar traducción NAT y datos de endpoint del intervalo y 5-tupla, con responsable y retención necesaria. Relacionar cada fuente solicitada con la pregunta que resolvería.

### Criterios observables

- Solicita NAT y endpoint para intervalo y 5-tupla concretos.
- Asigna responsable y retención, relacionando cada fuente con la pregunta pendiente.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Evidencia, límites y contradicciones pertinentes**

La confianza debe apoyarse en corroboración y límites de cada afirmación; un número sin calibración no la demuestra.

## Pregunta 2

**Respuesta: C. Contenido exfiltrado y usuario exacto confirmados**

Sin payload, NAT o endpoint no se identifica contenido ni usuario exacto a partir de la salida compartida.

## Referencias

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **ZEEK-DNS**: [dns.log](https://docs.zeek.org/en/current/reference/logs/dns.html). Registros DNS y significado de campos por versión.
- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
