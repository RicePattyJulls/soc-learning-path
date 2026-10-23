# RED-M37-L01 — REST y autenticación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M37-L01","moduleId":"RED-M37","stageId":"RED-E07","objective":"Interpretar operaciones REST y proteger autenticación de API.","prerequisites":["RED-M22-L04","RED-M26-L04","RED-M36-L04"],"referenceIds":["RFC9110","RFC6241","RFC7950","RFC8040","ANSIBLE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M37-L01-Q01","RED-M37-L01-Q02"],"practiceId":"RED-M37-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M37-L01.md"} -->

## 1. Objetivo

Interpretar operaciones REST y proteger autenticación de API.

Prerrequisitos: [RED-M22-L04](../RED-E04/RED-M22-L04.md), [RED-M26-L04](../RED-E05/RED-M26-L04.md), [RED-M36-L04](../RED-E07/RED-M36-L04.md).

## 2. Comprende el mecanismo

HTTP define semántica de métodos y códigos; una API añade su contrato de recursos. GET recupera una representación según diseño, POST puede crear o iniciar acciones y PUT suele expresar una sustitución del estado del recurso; no intercambiar métodos por intuición. Autenticación, autorización, validación TLS y límites de tasa siguen siendo necesarios. Un código 202 puede indicar aceptación para procesamiento posterior, no tarea terminada. No incluir tokens reales en URLs, repositorios ni ejemplos docentes.

### Vocabulario de apoyo

- **API REST y HTTP 202**: Interfaz de recursos con contrato propio y aceptación que puede dejar procesamiento pendiente.
- **YANG, NETCONF y RESTCONF**: Modelado de datos y protocolos de operación sobre datos modelados, con capacidades específicas.
- **Idempotencia**: Propiedad de repetir una operación sin producir efectos adicionales respecto al estado previsto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Respuesta sintética: POST a una tarea autorizada devuelve 202 y un identificador; consulta posterior informa pending.

Se aceptó trabajo, pero todavía no hay resultado aplicado. El cliente debe seguir el contrato de estado y verificar finalización.

## 4. Práctica individual

La API devuelve 403 a una cuenta autenticada. ¿Qué comprobarías antes de cambiar el canal TLS?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué puede indicar HTTP 202?

- A. Fallo de cable necesariamente
- B. Creación de una dirección MAC
- C. Cambio finalizado y verificado siempre
- D. Aceptación con procesamiento aún pendiente

### Pregunta 2

¿Qué estado demuestra pending en el caso?

- A. El recurso no existe con certeza
- B. La configuración ya está validada
- C. El certificado fue rechazado
- D. La tarea todavía no se declara completada

## 6. Aplicación profesional

- SOC: Recuperar configuraciones para contexto.
- Red Team autorizado: Comparar configuraciones esperadas y reales.
- Evidencia del módulo: Esquema, plan, secretos excluidos, resultado esperado.
- Criterio del módulo: Comportamiento predecible con fallos controlados.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L18](../../05_RECURSOS/LABORATORIOS/RED-L18.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC9110**: [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Métodos, respuestas y significado de 202/403.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.
- **RFC7950**: [RFC 7950: The YANG 1.1 Data Modeling Language](https://www.rfc-editor.org/rfc/rfc7950.html). Modelos, tipos y revisiones YANG.
- **RFC8040**: [RFC 8040: RESTCONF Protocol](https://www.rfc-editor.org/rfc/rfc8040.html). Recursos modelados mediante HTTP.
- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
