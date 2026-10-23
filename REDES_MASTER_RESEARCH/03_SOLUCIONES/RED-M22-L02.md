# Soluciones — RED-M22-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Identidad de emergencia limitada y custodiada, y registro/revisión del uso con restauración de controles. No habilitar acceso anónimo por comodidad.

### Criterios observables

- Define identidad de emergencia custodiada y limitada.
- Registra y revisa su uso y restaura controles centrales.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Qué acciones puede realizar la identidad autenticada**

Autorizar decide acciones permitidas después de identificar; autenticación responde quién es la identidad.

## Pregunta 2

**Respuesta: D. No, requiere autorización de su rol**

SSH protege el canal, pero el rol observador no incluye modificar rutas.

## Referencias

- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **COPP**: [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html). Clasificación y límites de tráfico dirigido o entregado al procesador; revisar capacidades y efectos por plataforma.
