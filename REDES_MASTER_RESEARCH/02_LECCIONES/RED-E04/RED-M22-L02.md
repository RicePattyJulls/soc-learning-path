# RED-M22-L02 — AAA, SSH y roles

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M22-L02","moduleId":"RED-M22","stageId":"RED-E04","objective":"Definir AAA de administración con roles y recuperación controlada.","prerequisites":["RED-M22-L01"],"referenceIds":["RFC8907","RFC4253","NIST-TEST","COPP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M22-L02-Q01","RED-M22-L02-Q02"],"practiceId":"RED-M22-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M22-L02.md"} -->

## 1. Objetivo

Definir AAA de administración con roles y recuperación controlada.

Prerrequisitos: [RED-M22-L01](../RED-E04/RED-M22-L01.md).

## 2. Comprende el mecanismo

AAA separa autenticación, autorización y accounting. SSH protege un canal, pero no decide por sí solo si un usuario debe ejecutar cualquier comando. RADIUS y TACACS+ tienen usos y propiedades diferentes; proteger su transporte y disponibilidad exige revisar la implementación, no atribuir cifrado completo universal. Define roles mínimos y una recuperación administrativa controlada si el servicio central falla. MFA y certificados pueden aportar controles cuando la plataforma los soporta, con registro de acciones y gestión segura del material de autenticación.

### Vocabulario de apoyo

- **AAA**: Autenticación de identidad, autorización de acciones y registro de uso o accounting.
- **CoPP**: Protección del tráfico dirigido al plano de control según capacidades de la plataforma.
- **Fuera de banda y rollback**: Camino de gestión independiente del fallo previsto y reversión comprobable de un cambio.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Política docente: rol observador puede leer estado; rol operador puede aplicar cambios aprobados; ambos acceden mediante canal de gestión protegido.

El canal y la autorización son capas distintas. Un observador autenticado no debería heredar capacidad de cambiar rutas por usar SSH.

## 4. Práctica individual

El servicio AAA central falla. Define dos condiciones para un acceso de emergencia responsable.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué responde autorización en AAA?

- A. Solo quién solicita acceso
- B. Qué acciones puede realizar la identidad autenticada
- C. El tamaño de las tramas
- D. La longitud del prefijo

### Pregunta 2

¿Debe el observador cambiar rutas por tener SSH?

- A. No, porque ningún rol puede administrar mediante SSH
- B. Sí, porque autenticar la cuenta equivale a autorizar cualquier comando
- C. Sí, porque un canal cifrado concede permiso de configuración
- D. No, requiere autorización de su rol

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
