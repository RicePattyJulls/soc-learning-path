# Soluciones — RED-M11-L04

Material de revisión: consultar después de resolver.

## Práctica individual

Revisar resolver entregado, acceso a DNS y respuesta al nombre requerido. No reiniciar autenticación sin evidencia de que esa fase vuelva a fallar.

### Criterios observables

- Verifica resolver entregado y acceso/respuesta DNS.
- Sitúa el nuevo fallo después de las fases ya superadas.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Tener dirección y autorización de servicio correctas**

Asociación es solo una fase: pueden faltar autenticación, dirección, resolución o permiso al servicio.

## Pregunta 2

**Respuesta: A. El certificado de cliente vencido según el servidor**

El servidor informa certificado vencido al rechazar EAP; el fallo está antes de DHCP.

## Referencias

- **WLAN**: [IEEE 802.11 Working Group](https://www.ieee802.org/11/). Familia de estándares y alcance; no verificación del texto completo de todas las normas.
- **WPA3**: [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html). Modos WPA2/WPA3, PMF y soporte; requisitos de configuración de la familia descrita.
