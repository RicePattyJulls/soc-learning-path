# Soluciones — RED-M22-L03

Material de revisión: consultar después de resolver.

## Práctica individual

Usar un entorno aislado compatible, comprobar funciones y acceso administrativo, registrar diferencias y retorno al estado inicial. Conservar evidencias sin secretos.

### Criterios observables

- Usa entorno aislado compatible y verifica funciones y gestión.
- Conserva diferencias y evidencia sin secretos y retorna al estado inicial.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: D. Que pueda restaurarse con éxito**

Almacenar bytes no demuestra compatibilidad, dependencias completas ni recuperación exitosa.

## Pregunta 2

**Respuesta: A. Versión diferente y dependencias incompletas**

La versión distinta y certificados ausentes limitan restauración, aunque la copia tenga un hash correcto.

## Referencias

- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **COPP**: [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html). Clasificación y límites de tráfico dirigido o entregado al procesador; revisar capacidades y efectos por plataforma.
