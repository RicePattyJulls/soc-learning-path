# RED-M22-L01 — Planos de red

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M22-L01","moduleId":"RED-M22","stageId":"RED-E04","objective":"Separar planos de datos, control y gestión.","prerequisites":["RED-M06-L04","RED-M09-L04","RED-M12-L04"],"referenceIds":["RFC8907","RFC4253","NIST-TEST","COPP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M22-L01-Q01","RED-M22-L01-Q02"],"practiceId":"RED-M22-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M22-L01.md"} -->

## 1. Objetivo

Separar planos de datos, control y gestión.

Prerrequisitos: [RED-M06-L04](../RED-E01/RED-M06-L04.md), [RED-M09-L04](../RED-E02/RED-M09-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md).

## 2. Comprende el mecanismo

El plano de datos reenvía tráfico; el de control mantiene decisiones y protocolos; el de gestión administra y observa. Pueden compartir hardware y recursos aunque sus funciones difieran. Saturar paquetes dirigidos al equipo puede afectar su CPU sin agotar necesariamente capacidad de tránsito, según arquitectura. La protección requiere distinguir servicios de gestión de tráfico reenviado. Crear una VLAN de gestión ayuda a organizar caminos, pero su efectividad depende de rutas, ACL, identidad y canales administrativos.

### Vocabulario de apoyo

- **AAA**: Autenticación de identidad, autorización de acciones y registro de uso o accounting.
- **CoPP**: Protección del tráfico dirigido al plano de control según capacidades de la plataforma.
- **Fuera de banda y rollback**: Camino de gestión independiente del fallo previsto y reversión comprobable de un cambio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: tráfico de usuarios sigue pasando; acceso SSH al router se vuelve lento y CPU de control sube.

El síntoma no equivale a caída total del forwarding. Investigar paquetes punted al control, gestión y recursos del equipo según plataforma.

## 4. Práctica individual

El operador permite SSH a la IP de gestión desde todas las VLAN. ¿Qué parte del aislamiento falta?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué función caracteriza al plano de datos?

- A. Reenviar tráfico
- B. Administrar usuarios y configuración mediante el canal de gestión
- C. Calcular las rutas mediante protocolos de control
- D. Negociar vecindades de routing como función principal

### Pregunta 2

¿Qué observación evita declarar caída total?

- A. Que SSH tarde más en responder, sin probar forwarding
- B. CPU de control alta sin medir tránsito
- C. El tráfico de usuarios sigue pasando
- D. Que la interfaz de gestión siga configurada, sin observar paquetes

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
