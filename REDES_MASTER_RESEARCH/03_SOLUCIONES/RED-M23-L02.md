# Soluciones — RED-M23-L02

Material de revisión: consultar después de resolver.

## Práctica individual

No se ha demostrado protección equivalente de IPv6. Diseñar controles pertinentes para RA/ND y probarlos por separado según soporte.

### Criterios observables

- Declara que DAI no acredita protección IPv6.
- Diseña controles RA/ND pertinentes y pruebas separadas según soporte.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Bindings o reglas autorizadas para validar ARP**

DAI requiere una base autorizada para contrastar ARP; clientes estáticos pueden necesitar reglas específicas.

## Pregunta 2

**Respuesta: A. Falta de binding compatible con la política**

No tener binding explica el bloqueo del cliente autorizado sin demostrar ARP malicioso.

## Referencias

- **DAI**: [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html). Bindings, hosts estáticos y dependencias de los controles L2.
- **RFC3580**: [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html). Roles y relación entre admisión y backend AAA.
- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
