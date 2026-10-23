# RED-M38-L01 — Pre-checks y diffs

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M38-L01","moduleId":"RED-M38","stageId":"RED-E07","objective":"Definir prechecks y revisar un diff contra requisitos.","prerequisites":["RED-M21-L04","RED-M25-L04","RED-M36-L04","RED-M37-L04"],"referenceIds":["ANSIBLE","GIT","RFC6241"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M38-L01-Q01","RED-M38-L01-Q02"],"practiceId":"RED-M38-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M38-L01.md"} -->

## 1. Objetivo

Definir prechecks y revisar un diff contra requisitos.

Prerrequisitos: [RED-M21-L04](../RED-E04/RED-M21-L04.md), [RED-M25-L04](../RED-E04/RED-M25-L04.md), [RED-M36-L04](../RED-E07/RED-M36-L04.md), [RED-M37-L04](../RED-E07/RED-M37-L04.md).

## 2. Comprende el mecanismo

Un precheck comprueba condiciones que hacen viable o seguro el cambio: estado inicial, capacidad, acceso, dependencias y respaldo. Un diff compara intención y configuración, pero debe leerse con contexto de orden, objetos y valores predeterminados. No eliminar líneas aparentemente redundantes sin conocer su efecto. El plan debe describir objetivo, alcance, éxito, parada y rollback. Las transferencias de configuración requieren canal y autenticación protegidos; tener un backup local no garantiza que sea accesible cuando se pierde la gestión.

### Vocabulario de apoyo

- **Precheck y canary**: Comprobación previa y despliegue inicial limitado que debe representar los riesgos relevantes.
- **Rollback**: Retorno controlado con disparador, alcance real, acceso y pruebas de recuperación definidos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Diff docente elimina la única ruta hacia el servidor de gestión antes de instalar el reemplazo; el plan no contempla acceso alternativo.

El cambio puede cortar el canal necesario para terminar o revertir. La secuencia y recuperación son requisitos previos, no detalles posteriores.

## 4. Práctica individual

Propón un precheck que bloquee ese plan antes de aplicarlo.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no demuestra un diff válido?

- A. Que hay una intención registrada
- B. Qué texto se propone cambiar
- C. Que el cambio preserve el servicio y la gestión
- D. Una diferencia entre versiones

### Pregunta 2

¿Qué riesgo contiene el diff del caso?

- A. Una mejora de observabilidad demostrada
- B. Pérdida de la única ruta de gestión durante la secuencia
- C. Un cambio de nombre sin efecto
- D. Mayor claridad de documentación

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
