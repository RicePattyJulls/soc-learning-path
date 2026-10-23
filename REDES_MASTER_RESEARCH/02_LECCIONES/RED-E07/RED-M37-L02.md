# RED-M37-L02 — YANG/NETCONF/RESTCONF

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M37-L02","moduleId":"RED-M37","stageId":"RED-E07","objective":"Relacionar modelos YANG con protocolos NETCONF y RESTCONF.","prerequisites":["RED-M37-L01"],"referenceIds":["RFC9110","RFC6241","RFC7950","RFC8040","ANSIBLE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M37-L02-Q01","RED-M37-L02-Q02"],"practiceId":"RED-M37-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M37-L02.md"} -->

## 1. Objetivo

Relacionar modelos YANG con protocolos NETCONF y RESTCONF.

Prerrequisitos: [RED-M37-L01](../RED-E07/RED-M37-L01.md).

## 2. Comprende el mecanismo

YANG describe modelos de datos; NETCONF y RESTCONF permiten operaciones sobre datos modelados mediante protocolos y capacidades concretos. NETCONF puede anunciar datastores y funciones opcionales, como candidate o confirmed commit; no toda implementación soporta todas. RESTCONF usa HTTP y representaciones definidas, pero no es solo una CLI transportada por web. Consultar capacidades y modelo/revisión permite construir operaciones válidas. Validar esquema no demuestra que el cambio preserve conectividad de negocio.

### Vocabulario de apoyo

- **API REST y HTTP 202**: Interfaz de recursos con contrato propio y aceptación que puede dejar procesamiento pendiente.
- **YANG, NETCONF y RESTCONF**: Modelado de datos y protocolos de operación sobre datos modelados, con capacidades específicas.
- **Idempotencia**: Propiedad de repetir una operación sin producir efectos adicionales respecto al estado previsto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Dispositivo docente anuncia running pero no candidate ni confirmed-commit. El plan exige esas dos capacidades.

El plan no es compatible con lo anunciado. Debe adaptarse o elegirse una plataforma que soporte las funciones requeridas, no simular éxito.

## 4. Práctica individual

Un modelo cambia nombre o tipo de un campo en otra revisión. Define el precheck de la automatización.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué describe YANG?

- A. Un cifrado de radio
- B. Un modelo de datos
- C. Una contraseña de API
- D. Una tabla MAC obligatoria

### Pregunta 2

¿Qué falla en el plan del caso?

- A. Tiene un objetivo de cambio definido
- B. Comprueba el datastore
- C. Usa datos estructurados
- D. Depende de capacidades no anunciadas

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
