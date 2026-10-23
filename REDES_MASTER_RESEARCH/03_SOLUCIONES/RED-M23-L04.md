# Soluciones — RED-M23-L04

Material de revisión: consultar después de resolver.

## Práctica individual

En un escenario aislado verificar dispositivo conocido, desconocido y administrador, con alcance/servicios esperados y registro del fallback. No improvisar acceso global durante el fallo.

### Criterios observables

- Prueba dispositivos conocido, desconocido y administrador en entorno aislado.
- Compara servicios esperados y registra el fallback acordado.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Autenticación criptográfica fuerte de la identidad**

MAB usa una MAC declarada y no proporciona por sí solo prueba criptográfica fuerte de identidad.

## Pregunta 2

**Respuesta: A. El acceso a la función de impresión necesaria**

La excepción debe acotarse a impresión; administrar switches excede la función descrita.

## Referencias

- **DAI**: [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html). Bindings, hosts estáticos y dependencias de los controles L2.
- **RFC3580**: [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html). Roles y relación entre admisión y backend AAA.
- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
