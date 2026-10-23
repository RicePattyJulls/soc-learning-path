# RED-M38-L02 — Idempotencia

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M38-L02","moduleId":"RED-M38","stageId":"RED-E07","objective":"Distinguir operación idempotente y proceso seguro de repetición.","prerequisites":["RED-M38-L01"],"referenceIds":["ANSIBLE","GIT","RFC6241"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M38-L02-Q01","RED-M38-L02-Q02"],"practiceId":"RED-M38-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M38-L02.md"} -->

## 1. Objetivo

Distinguir operación idempotente y proceso seguro de repetición.

Prerrequisitos: [RED-M38-L01](../RED-E07/RED-M38-L01.md).

## 2. Comprende el mecanismo

Idempotencia significa que repetir una operación con el mismo estado deseado no cambia adicionalmente su efecto previsto. No equivale a que sea reversible ni a que nunca falle. Un proceso puede contener tareas idempotentes y aun así dejar un cambio parcial por error en otra etapa. Comprueba estado antes/después y condiciones de carrera. Eliminar y recrear un recurso en cada pasada puede terminar igual y producir interrupciones: la equivalencia final no basta para afirmar idempotencia operativa sin efectos adicionales.

### Vocabulario de apoyo

- **Precheck y canary**: Comprobación previa y despliegue inicial limitado que debe representar los riesgos relevantes.
- **Rollback**: Retorno controlado con disparador, alcance real, acceso y pruebas de recuperación definidos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Automatización docente elimina y recrea una interfaz en cada ejecución; termina con la misma IP, pero corta conexiones cada vez.

El estado final no revela el impacto repetido. La tarea debe converger sin recreación innecesaria si ese es su requisito operativo.

## 4. Práctica individual

La segunda ejecución no cambia configuración, pero reinicia el servicio igualmente. ¿Qué revisarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no implica idempotencia?

- A. Reversibilidad garantizada
- B. Mismo efecto previsto al repetir una operación idempotente
- C. Necesidad de definir estado deseado
- D. Posibilidad de comprobar convergencia

### Pregunta 2

¿Qué oculta mirar solo la IP final del caso?

- A. La interrupción causada por recrear la interfaz
- B. La existencia de esa IP
- C. La familia de direcciones usada
- D. La intención declarada

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
