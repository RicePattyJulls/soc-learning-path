# Soluciones — RED-M24-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Comparar hora fiable y período de validez del certificado. La causa puede ser el reloj del cliente, sin que la conectividad RF o la clave del AP estén defectuosas.

### Criterios observables

- Compara reloj fiable y período de validez.
- Distingue rechazo temporal del certificado de fallo RF o clave del AP.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. La confianza en la identidad del servidor de autenticación**

Validar el servidor contrasta su identidad con la esperada y reduce aceptar un impostor con el mismo SSID.

## Pregunta 2

**Respuesta: C. La identidad del certificado no coincide con la esperada**

El nombre del certificado difiere de la identidad prevista; desactivar validación escondería el defecto.

## Referencias

- **WLAN**: [IEEE 802.11 Working Group](https://www.ieee802.org/11/). Familia de estándares y alcance; no verificación del texto completo de todas las normas.
- **WPA3**: [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html). Modos WPA2/WPA3, PMF y soporte; requisitos de configuración de la familia descrita.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.
