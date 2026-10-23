# RED-M22-L03 — NTP, backup y control de cambios

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M22-L03","moduleId":"RED-M22","stageId":"RED-E04","objective":"Preparar backups de configuración y cambios comprobables.","prerequisites":["RED-M22-L02"],"referenceIds":["RFC8907","RFC4253","NIST-TEST","COPP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M22-L03-Q01","RED-M22-L03-Q02"],"practiceId":"RED-M22-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M22-L03.md"} -->

## 1. Objetivo

Preparar backups de configuración y cambios comprobables.

Prerrequisitos: [RED-M22-L02](../RED-E04/RED-M22-L02.md).

## 2. Comprende el mecanismo

Un backup debe poder identificarse, protegerse y restaurarse; guardarlo no demuestra recuperación. Las configuraciones pueden contener secretos y requieren almacenamiento y transporte adecuados, por ejemplo mecanismos protegidos con autenticación verificada. Registrar versión, hardware, dependencias y hora permite interpretar compatibilidad. Antes de aplicar un cambio, comparar configuración efectiva y deseada y prever cómo recuperar la gestión. NTP facilita trazabilidad, pero no sustituye un inventario de cambios y responsables.

### Vocabulario de apoyo

- **AAA**: Autenticación de identidad, autorización de acciones y registro de uso o accounting.
- **CoPP**: Protección del tráfico dirigido al plano de control según capacidades de la plataforma.
- **Fuera de banda y rollback**: Camino de gestión independiente del fallo previsto y reversión comprobable de un cambio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Archivo docente backup-A se recibe con hash correcto, pero corresponde a otra versión y faltan dependencias externas de certificados.

El hash acredita bytes, no restaurabilidad. Debe verificarse compatibilidad y disponibilidad segura de dependencias sin publicarlas en el material docente.

## 4. Práctica individual

Diseña una prueba de restauración de bajo impacto para una configuración revisada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no demuestra guardar un backup?

- A. Que existe una copia de bytes
- B. Que puede calcularse una huella
- C. Que hay un archivo almacenado
- D. Que pueda restaurarse con éxito

### Pregunta 2

¿Qué limita backup-A?

- A. Versión diferente y dependencias incompletas
- B. Un hash calculado correctamente
- C. Una transferencia registrada
- D. Un nombre identificable

## 6. Aplicación profesional

- SOC: Identificar acceso administrativo anómalo.
- Red Team autorizado: Validar exposición de plano de gestión.
- Evidencia del módulo: Inventario de interfaces, política, respaldo y evidencias.
- Criterio del módulo: Sólo admin aprobado y recuperación reproducible.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L05](../../05_RECURSOS/LABORATORIOS/RED-L05.md)
- [Guía de laboratorio RED-L10](../../05_RECURSOS/LABORATORIOS/RED-L10.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC4253**: [RFC 4253: The Secure Shell Transport Layer Protocol](https://www.rfc-editor.org/rfc/rfc4253.html). Transporte SSH y autenticación del servidor; no recomendación de suites históricas.
- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **COPP**: [Control Plane Policing — Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html). Clasificación y límites de tráfico dirigido o entregado al procesador; revisar capacidades y efectos por plataforma.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
