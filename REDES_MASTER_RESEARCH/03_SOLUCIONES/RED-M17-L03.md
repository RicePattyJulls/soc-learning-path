# Soluciones — RED-M17-L03

Material de revisión: consultar después de resolver.

## Práctica individual

No automáticamente; comprobar origen y política que sobrescribe/valida esa cabecera. Una cadena aportada por un cliente no es una prueba de identidad.

### Criterios observables

- Rechaza atribución automática por una cabecera suministrada directamente.
- Comprueba origen confiable y política que valida o sobrescribe la cabecera.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. La conexión y sus extremos de transporte**

Al terminar una conexión y abrir otra cambian sus extremos y estado TCP/TLS; no hay identidad automática de usuario.

## Pregunta 2

**Respuesta: B. Al proxy como extremo de esa conexión**

El backend ve el extremo proxy en esa conexión; atribuir al usuario requiere correlación adicional.

## Referencias

- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
