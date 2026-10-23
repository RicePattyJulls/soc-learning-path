# RED-M38-L03 — Canary/despliegue gradual

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M38-L03","moduleId":"RED-M38","stageId":"RED-E07","objective":"Diseñar un despliegue gradual con muestra y criterios de avance.","prerequisites":["RED-M38-L02"],"referenceIds":["ANSIBLE","GIT","RFC6241"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M38-L03-Q01","RED-M38-L03-Q02"],"practiceId":"RED-M38-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M38-L03.md"} -->

## 1. Objetivo

Diseñar un despliegue gradual con muestra y criterios de avance.

Prerrequisitos: [RED-M38-L02](../RED-E07/RED-M38-L02.md).

## 2. Comprende el mecanismo

Un canary aplica un cambio a una fracción controlada antes de extenderlo. Debe ser representativo de los riesgos, con observadores y criterios medibles de avance o parada. Elegir solo el equipo menos parecido a producción puede generar confianza falsa. Considera versiones, roles, tamaños y dependencias para la selección. Una métrica global puede ocultar la degradación de un segmento pequeño; combina servicio, control y gestión. La automatización debe conservar qué activos cambiaron y cuáles no para no confundir un despliegue parcial con completado.

### Vocabulario de apoyo

- **Precheck y canary**: Comprobación previa y despliegue inicial limitado que debe representar los riesgos relevantes.
- **Rollback**: Retorno controlado con disparador, alcance real, acceso y pruebas de recuperación definidos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Plan docente: cambiar 100 dispositivos; canary de un solo modelo/version A, pero 60 equipos restantes usan versión B con otra sintaxis.

La muestra no cubre el riesgo de compatibilidad de B. Hace falta un grupo representativo o validación específica antes de extender.

## 4. Práctica individual

Dos canaries pasan tráfico pero pierden acceso de gestión. ¿Debe avanzar el lote?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe representar un canary?

- A. Un permiso para omitir rollback
- B. Únicamente el promedio histórico
- C. Solo la máquina más cómoda
- D. Riesgos y variantes relevantes del despliegue

### Pregunta 2

¿Qué riesgo deja sin cubrir la muestra del caso?

- A. La posibilidad de contar equipos
- B. Compatibilidad de los equipos con versión B
- C. El nombre de los cien dispositivos
- D. La existencia de versión A

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
