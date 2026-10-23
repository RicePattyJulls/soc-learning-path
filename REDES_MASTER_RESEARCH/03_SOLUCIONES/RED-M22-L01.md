# Soluciones — RED-M22-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Restringir orígenes y autorización administrativa, además de separar rutas/servicios. La etiqueta gestión no impone por sí sola una frontera de acceso.

### Criterios observables

- Restringe orígenes de gestión.
- Añade autorización administrativa y revisa rutas/servicios efectivos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Reenviar tráfico**

El plano de datos reenvía; calcular rutas pertenece al control y administrar configuración a gestión.

## Pregunta 2

**Respuesta: C. El tráfico de usuarios sigue pasando**

Hay tráfico de usuarios pasando: la lentitud de SSH no acredita caída total del forwarding.

## Referencias

- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **COPP**: [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html). Clasificación y límites de tráfico dirigido o entregado al procesador; revisar capacidades y efectos por plataforma.
