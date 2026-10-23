# Soluciones — RED-M24-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Dirección/gateway y continuidad de sesiones tras el cambio de subred, con tiempos de DHCP y aplicación; no declarar roaming transparente solo por mantener el SSID.

### Criterios observables

- Mide dirección/gateway y tiempos de DHCP tras cambiar subred.
- Comprueba continuidad de aplicación en lugar de inferirla del SSID.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. La política y conectividad efectivas de cada AP**

Un nombre WLAN común no acredita política o camino idénticos; esos estados deben comprobarse por AP.

## Pregunta 2

**Respuesta: A. El transporte de VLAN30 por el trunk**

VLAN30 no pasa por el trunk de B, aunque la autenticación la asigne correctamente.

## Referencias

- **WLAN**: [IEEE 802.11 Working Group](https://www.ieee802.org/11/). Familia de estándares y alcance; no verificación del texto completo de todas las normas.
- **WPA3**: [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html). Modos WPA2/WPA3, PMF y soporte; requisitos de configuración de la familia descrita.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
