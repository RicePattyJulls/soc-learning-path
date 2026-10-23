# Soluciones — RED-M22-L04

Material de revisión: consultar después de resolver.

## Práctica individual

No para ese fallo: perdería el camino administrativo junto con el uplink. Definir una alternativa independiente y verificarla antes de la intervención.

### Criterios observables

- Identifica dependencia compartida del uplink.
- Define y verifica un camino de recuperación independiente antes de intervenir.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Tráfico dirigido al plano de control según la plataforma**

CoPP atiende tráfico destinado al control, no necesariamente todo tránsito; clasificar mal puede afectar routing legítimo.

## Pregunta 2

**Respuesta: D. Comparte el componente que se retirará**

La gestión comparte el uplink que se retira: no ofrece recuperación independiente frente a ese fallo.

## Referencias

- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **COPP**: [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html). Clasificación y límites de tráfico dirigido o entregado al procesador; revisar capacidades y efectos por plataforma.
