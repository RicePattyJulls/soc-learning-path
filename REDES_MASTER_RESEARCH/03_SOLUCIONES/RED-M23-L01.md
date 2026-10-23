# Soluciones — RED-M23-L01

Material de revisión: consultar después de resolver.

## Práctica individual

El patrón de forwarding del AP puede presentar varias MAC legítimas según modo. Dimensionar el control con topología efectiva y no tratar todo agregado como un PC.

### Criterios observables

- Comprueba modo del AP y MAC legítimas que presenta.
- Dimensiona el límite según forwarding real sin suponer un único PC.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Identidad humana autenticada**

Coincidir con una MAC no autentica a una persona; puede ser solo un dato declarado de enlace.

## Pregunta 2

**Respuesta: A. La confianza DHCP injustificada del puerto de usuario**

p9 recibe ofertas ajenas porque se confió injustificadamente en ese puerto de usuario.

## Referencias

- **DAI**: [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html). Bindings, hosts estáticos y dependencias de los controles L2.
- **RFC3580**: [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html). Roles y relación entre admisión y backend AAA.
- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
