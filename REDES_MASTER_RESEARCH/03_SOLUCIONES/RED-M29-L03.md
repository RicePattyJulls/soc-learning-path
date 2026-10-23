# Soluciones — RED-M29-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Conexión atribuible a B en ese momento con corroboración de traducción y endpoint; identidad humana e intención siguen requiriendo su propio soporte.

### Criterios observables

- Relaciona conexión con B mediante endpoint y traducción del puerto.
- Mantiene separadas identidad humana e intención no demostradas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Concesión de dirección a un cliente durante un período**

DHCP relaciona una concesión con un cliente y período; no identifica intención humana o proceso.

## Pregunta 2

**Respuesta: D. La ventana temporal abarca reasignaciones**

La ventana cubre asignaciones a A y B: elegir la primera no resuelve esa ambigüedad.

## Referencias

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **ZEEK-DNS**: [dns.log](https://docs.zeek.org/en/current/reference/logs/dns.html). Registros DNS y significado de campos por versión.
- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
