# Soluciones — RED-M27-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Correlacionar flujo, instante, sentido y acción efectiva, además de posibles reintentos o otro camino. No concluir prevención completa leyendo una palabra aislada.

### Criterios observables

- Correlaciona flujo, instante, sentido y acción.
- Contrasta reintentos y rutas alternativas antes de afirmar prevención completa.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Puede aplicar prevención en el camino según configuración**

Prevenir requiere estar en el camino y aplicar una acción efectiva; alertar desde fuera de banda no bloquea.

## Pregunta 2

**Respuesta: A. Detección sin bloqueo demostrado**

Hay alert y procesamiento del servidor, sin drop corroborado: solo se demuestra detección.

## Referencias

- **RFC7011**: [RFC 7011: IP Flow Information Export Protocol](https://www.rfc-editor.org/rfc/rfc7011.html). Plantillas, dominios de observación y exportación de flujos.
- **ZEEK-CONN**: [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html). Registros de conexión y límites; los fixtures del curso usan otro esquema declarado.
- **SURICATA**: [EVE JSON Output](https://docs.suricata.io/en/latest/output/eve/eve-json-output.html). Tipos de evento y acciones; documentación latest consultada, no imagen elegida para ejecutar.
