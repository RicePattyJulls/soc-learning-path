# RED-M38-L04 — Rollback y auditoría

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M38-L04","moduleId":"RED-M38","stageId":"RED-E07","objective":"Definir rollback con precondiciones y verificación de recuperación.","prerequisites":["RED-M38-L03"],"referenceIds":["ANSIBLE","GIT","RFC6241"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M38-L04-Q01","RED-M38-L04-Q02"],"practiceId":"RED-M38-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M38-L04.md"} -->

## 1. Objetivo

Definir rollback con precondiciones y verificación de recuperación.

Prerrequisitos: [RED-M38-L03](../RED-E07/RED-M38-L03.md).

## 2. Comprende el mecanismo

Rollback devuelve un estado controlado, pero no toda operación es reversible ni una configuración anterior sigue siendo válida tras cambios externos. Define disparador, responsable, método, acceso, dependencias y pruebas de retorno. Diferencia reversión de configuración y recuperación del servicio: sesiones o datos pueden requerir pasos adicionales. Mantén una bitácora de qué se aplicó realmente para no revertir activos que nunca cambiaron. Un informe debe señalar cualquier desvío respecto al estado inicial y los riesgos residuales.

### Vocabulario de apoyo

- **Precheck y canary**: Comprobación previa y despliegue inicial limitado que debe representar los riesgos relevantes.
- **Rollback**: Retorno controlado con disparador, alcance real, acceso y pruebas de recuperación definidos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Lote docente: A y B cambiados; C falló antes de aplicar. Rollback propuesto restaura A/B/C con un backup genérico distinto del estado de C.

Incluir C puede introducir una modificación nueva no necesaria. La reversión debe usar el estado y alcance real de cada activo.

## 4. Práctica individual

Tras rollback, configuración coincide y la aplicación sigue sin responder. Define el estado del cierre.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe guiar el alcance de rollback?

- A. Todos los equipos por tener nombres parecidos
- B. La lista completa sin estados de ejecución
- C. Cambios realmente aplicados y estado previo de cada activo
- D. Solo un archivo genérico

### Pregunta 2

¿Qué riesgo introduce restaurar C en el caso?

- A. Conservar su configuración previa
- B. Modificar un activo que no había cambiado con un estado ajeno
- C. Distinguir fases del lote
- D. Registrar un error antes de aplicar

## 6. Aplicación profesional

- SOC: Asegurar continuidad de fuentes de eventos.
- Red Team autorizado: Retest de controles tras actualización.
- Evidencia del módulo: Playbook conceptual, test previo/post y rollback documentado.
- Criterio del módulo: Valida estado antes/después y camino de gestión.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L18](../../05_RECURSOS/LABORATORIOS/RED-L18.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **ANSIBLE**: [Ansible Network Examples](https://docs.ansible.com/projects/ansible/latest/network/user_guide/network_best_practices_2.5.html). Inventario, tareas y prácticas de automatización; verificar contrato de cada módulo.
- **GIT**: [git diff](https://git-scm.com/docs/git-diff). Comparar cambios; la comparación no demuestra corrección operativa.
- **RFC6241**: [RFC 6241: Network Configuration Protocol NETCONF](https://www.rfc-editor.org/rfc/rfc6241.html). Capacidades y operaciones NETCONF; opcionales no universales.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
