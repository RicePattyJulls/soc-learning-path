# RED-M15-L02 — Redistribución y route maps

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M15-L02","moduleId":"RED-M15","stageId":"RED-E03","objective":"Prevenir realimentación al redistribuir rutas entre dominios.","prerequisites":["RED-M15-L01"],"referenceIds":["FRR-MAP","RFC3704","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M15-L02-Q01","RED-M15-L02-Q02"],"practiceId":"RED-M15-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M15-L02.md"} -->

## 1. Objetivo

Prevenir realimentación al redistribuir rutas entre dominios.

Prerrequisitos: [RED-M15-L01](../RED-E03/RED-M15-L01.md).

## 2. Comprende el mecanismo

Redistribuir importa información de un protocolo o fuente a otra. Las métricas y categorías no son directamente equivalentes y requieren reglas de conversión. Con varios puntos de redistribución, una ruta puede volver a su dominio de origen y crear realimentación o caminos inesperados. Etiquetas, filtros y diseño unidireccional controlado ayudan a evitarlo, pero deben verificarse por plataforma. Una route map relaciona condiciones y acciones con secuencias y tratamiento de lo no coincidente; no suponer permiso implícito universal.

### Vocabulario de apoyo

- **Redistribución**: Importación de rutas entre fuentes o protocolos con políticas de conversión.
- **VRF y PBR**: Contexto independiente de routing y encaminamiento de paquetes mediante política.
- **uRPF**: Validación de origen basada en rutas, con modos que toleran de forma distinta la asimetría.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> R1 y R2 redistribuyen mutuamente OSPF y otro dominio sin etiquetas. Un prefijo reaparece como externo en su dominio de origen.

La reintroducción observada es compatible con realimentación. Documentar origen, puntos de cruce y tratamiento de etiquetas permite diseñar un bloqueo concreto.

## 4. Práctica individual

Propón dos controles que mantengan solo los prefijos requeridos al redistribuir.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué riesgo aumenta con redistribución bidireccional múltiple?

- A. La realimentación de rutas
- B. La eliminación de todo bucle por definición
- C. La desaparición de métricas
- D. La autenticación automática de usuarios

### Pregunta 2

¿Qué dato debe conservarse para prevenir reentrada?

- A. Solo la métrica convertida, sin procedencia del prefijo
- B. La procedencia de la ruta y su tratamiento al cruzar dominios
- C. El número de vecinos, sin identificar puntos de redistribución
- D. Solo la presencia del prefijo en la FIB de salida

## 6. Aplicación profesional

- SOC: Explicar asimetría/telemetría por VRF.
- Red Team autorizado: Comprobar bypass de segmentación en lab.
- Evidencia del módulo: Política, tablas antes/después y criterio de reversión.
- Criterio del módulo: No hay bucles ni fuga tras corrección.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L07](../../05_RECURSOS/LABORATORIOS/RED-L07.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
