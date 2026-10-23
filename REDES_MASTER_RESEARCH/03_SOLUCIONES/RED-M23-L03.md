# Soluciones — RED-M23-L03

Material de revisión: consultar después de resolver.

## Práctica individual

El authenticator/enforcement del acceso debe aplicar la autorización soportada; comprobar estado efectivo y no solo el resultado registrado en RADIUS.

### Criterios observables

- Identifica al authenticator o punto de enforcement.
- Comprueba VLAN o política efectiva además del log RADIUS.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. El supplicant**

El supplicant es el extremo que solicita acceso; el authenticator aplica admisión y el servidor valida el método.

## Pregunta 2

**Respuesta: A. Identidad aceptada con autorización limitada**

Accept puede acompañarse de rol limitado; identidad aceptada y autorización restringida son compatibles.

## Referencias

- **DAI**: [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html). Bindings, hosts estáticos y dependencias de los controles L2.
- **RFC3580**: [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html). Roles y relación entre admisión y backend AAA.
- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
