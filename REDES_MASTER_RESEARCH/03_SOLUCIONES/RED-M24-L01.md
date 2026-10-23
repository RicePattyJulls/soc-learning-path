# Soluciones — RED-M24-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Protege clases determinadas de gestión cuando se negocia; no evita interferencia física ni asegura disponibilidad absoluta del medio.

### Criterios observables

- Acota PMF a las tramas de gestión protegidas por el modo.
- Explica que no elimina interferencia física ni asegura disponibilidad absoluta.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Usar obligatoriamente el modo de 192 bits**

192 bits es un modo específico; no debe atribuirse automáticamente a todo perfil WPA3-Enterprise.

## Pregunta 2

**Respuesta: B. El modo realmente negociado por cada cliente**

El mismo SSID permite modos distintos en transición; se necesita conocer qué negoció cada cliente.

## Referencias

- **WLAN**: [IEEE 802.11 Working Group](https://www.ieee802.org/11/). Familia de estándares y alcance; no verificación del texto completo de todas las normas.
- **WPA3**: [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html). Modos WPA2/WPA3, PMF y soporte; requisitos de configuración de la familia descrita.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
