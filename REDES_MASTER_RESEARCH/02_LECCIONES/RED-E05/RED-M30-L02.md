# RED-M30-L02 — Normalización CIM/CEF/DCR

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M30-L02","moduleId":"RED-M30","stageId":"RED-E05","objective":"Distinguir modelo, formato y política de recolección.","prerequisites":["RED-M30-L01"],"referenceIds":["CIM","DCR","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M30-L02-Q01","RED-M30-L02-Q02"],"practiceId":"RED-M30-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M30-L02.md"} -->

## 1. Objetivo

Distinguir modelo, formato y política de recolección.

Prerrequisitos: [RED-M30-L01](../RED-E05/RED-M30-L01.md).

## 2. Comprende el mecanismo

CIM es un modelo de información de Splunk; CEF es un formato de eventos; una DCR de Azure configura aspectos de recolección/transformación. No son esquemas equivalentes que permitan traducir cualquier campo uno a uno. La presencia de un sourcetype o una etiqueta no prueba conformidad con un modelo. Define un contrato neutral para el ejercicio y conserva el mapeo específico como referencia de cada producto. Los detalles de consulta pertenecen a sus lecciones de plataforma y no deben inventarse para completar una tabla de redes.

### Vocabulario de apoyo

- **Normalización y null**: Mapeo con semántica preservada y representación explícita de dato desconocido.
- **CIM, CEF y DCR**: Modelo de información de Splunk, formato de eventos y reglas Azure de recolección/transformación.
- **TP, FP, FN y TN**: Positivos correctos, alertas sobre benignos, positivos omitidos y benignos sin alerta respecto a etiquetas conocidas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: un evento CEF llega mediante una ruta de ingestión; el informe afirma que por ello cumple automáticamente CIM Network Traffic.

El transporte y formato no demuestran conformidad de campos y significado con otro modelo. Hace falta un mapeo validado y evidencia de sus límites.

## 4. Práctica individual

Un registro no tiene puerto origen. ¿Cómo evitarías una equivalencia falsa al mapear a un contrato de flujo?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué describe mejor una DCR?

- A. Una política de recolección o transformación de datos en su contexto
- B. Una identidad de usuario
- C. Un formato Ethernet
- D. Un sinónimo universal de CIM

### Pregunta 2

¿Qué falta en la afirmación del ejemplo?

- A. Usar otro puerto DNS
- B. Solo renombrar el archivo
- C. Eliminar el evento original
- D. Validación del mapeo y de la semántica de campos

## 6. Aplicación profesional

- SOC: Diseñar casos SOC Sentinel/Splunk.
- Red Team autorizado: Verificar detectabilidad de actividad permitida.
- Evidencia del módulo: Esquema, conjunto de pruebas, casos FP/FN, resultados.
- Criterio del módulo: Reproducible en datasets declarados; sin inventar KQL/SPL.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L16](../../05_RECURSOS/LABORATORIOS/RED-L16.md)
- [Guía de laboratorio RED-L20](../../05_RECURSOS/LABORATORIOS/RED-L20.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **CIM**: [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model). Modelo y normalización; etiqueta no demuestra conformidad.
- **DCR**: [Data collection rules in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview). Recolección y transformación; DCR no se equipara a un modelo CIM.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
