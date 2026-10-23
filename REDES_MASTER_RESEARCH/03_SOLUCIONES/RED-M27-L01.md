# Soluciones — RED-M27-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Exportador, dominio de observación y vigencia de plantilla según protocolo/sesión. El número 256 aislado no identifica un esquema universal.

### Criterios observables

- Conserva exportador y dominio de observación.
- Registra vigencia/contexto de plantilla en lugar de tratar 256 como esquema global.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. El payload completo de los paquetes**

Un flujo resume metadatos y contadores; no tiene que incluir payload o toda una sesión de aplicación.

## Pregunta 2

**Respuesta: B. Su significado depende del contexto del exportador y observación**

El ID se interpreta con exportador, dominio y vigencia; diferentes contextos pueden usar el mismo número.

## Referencias

- **RFC7011**: [RFC 7011: IP Flow Information Export Protocol](https://www.rfc-editor.org/rfc/rfc7011.html). Plantillas, dominios de observación y exportación de flujos.
- **ZEEK-CONN**: [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html). Registros de conexión y límites; los fixtures del curso usan otro esquema declarado.
- **SURICATA**: [EVE JSON Output](https://docs.suricata.io/en/latest/output/eve/eve-json-output.html). Tipos de evento y acciones; documentación latest consultada, no imagen elegida para ejecutar.
