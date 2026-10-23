# RED-M22-L04 — CoPP y administración fuera de banda

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M22-L04","moduleId":"RED-M22","stageId":"RED-E04","objective":"Diseñar protección del control y recuperación fuera de banda.","prerequisites":["RED-M22-L03"],"referenceIds":["RFC8907","RFC4253","NIST-TEST","COPP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M22-L04-Q01","RED-M22-L04-Q02"],"practiceId":"RED-M22-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M22-L04.md"} -->

## 1. Objetivo

Diseñar protección del control y recuperación fuera de banda.

Prerrequisitos: [RED-M22-L03](../RED-E04/RED-M22-L03.md).

## 2. Comprende el mecanismo

CoPP limita o clasifica tráfico dirigido al plano de control según capacidades de plataforma; no debe copiarse un límite sin conocer tráfico legítimo. Una política demasiado estricta puede romper routing o administración. Gestión fuera de banda ofrece un camino independiente, pero su independencia debe abarcar red, energía y acceso cuando esos son los fallos previstos. Mantén una vía de recuperación antes de editar controles que puedan expulsar al operador. La prueba debe incluir tráfico necesario y comportamiento ante exceso definido.

### Vocabulario de apoyo

- **AAA**: Autenticación de identidad, autorización de acciones y registro de uso o accounting.
- **CoPP**: Protección del tráfico dirigido al plano de control según capacidades de la plataforma.
- **Fuera de banda y rollback**: Camino de gestión independiente del fallo previsto y reversión comprobable de un cambio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cambio docente limita todo tráfico a la CPU por debajo del ritmo normal de Hellos; aparecen caídas de vecindad.

La protección está afectando operación legítima. Se necesita clasificación y umbrales compatibles con carga, con un rollback accesible.

## 4. Práctica individual

La red de gestión comparte el mismo uplink que se va a retirar. ¿Cumple la independencia requerida?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué tráfico trata típicamente CoPP?

- A. Solo sesiones SSH sin incluir ningún protocolo de routing
- B. Todo el tráfico de tránsito como equivalente al dirigido a la CPU
- C. Tráfico dirigido al plano de control según la plataforma
- D. Solo paquetes que salen de la CPU, ignorando los dirigidos a ella

### Pregunta 2

¿Qué problema presenta la gestión del ejercicio?

- A. Usa autenticación
- B. Registra acciones
- C. Tiene un nombre diferente
- D. Comparte el componente que se retirará

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
