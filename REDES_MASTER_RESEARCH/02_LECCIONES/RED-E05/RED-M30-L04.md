# RED-M30-L04 — Ruido, FPR/FNR y ATT&CK

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M30-L04","moduleId":"RED-M30","stageId":"RED-E05","objective":"Calcular métricas de detección con denominadores correctos.","prerequisites":["RED-M30-L03"],"referenceIds":["CIM","DCR","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M30-L04-Q01","RED-M30-L04-Q02"],"practiceId":"RED-M30-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M30-L04.md"} -->

## 1. Objetivo

Calcular métricas de detección con denominadores correctos.

Prerrequisitos: [RED-M30-L03](../RED-E05/RED-M30-L03.md).

## 2. Comprende el mecanismo

Un verdadero positivo detecta un caso realmente positivo del dataset; falso positivo alerta sobre uno benigno y falso negativo omite uno positivo. FPR usa benignos como denominador; FNR usa positivos reales; precisión usa todas las alertas positivas. No intercambiarlos ni extrapolarlos a producción sin una población representativa. El dataset necesita ground truth y casos benignos parecidos, negativos y degradación de telemetría. Asignar una técnica ATT&CK documenta una hipótesis de cobertura, no demuestra eficacia ni compromiso.

### Vocabulario de apoyo

- **Normalización y null**: Mapeo con semántica preservada y representación explícita de dato desconocido.
- **CIM, CEF y DCR**: Modelo de información de Splunk, formato de eventos y reglas Azure de recolección/transformación.
- **TP, FP, FN y TN**: Positivos correctos, alertas sobre benignos, positivos omitidos y benignos sin alerta respecto a etiquetas conocidas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Fixture docente: 20 positivos reales y 100 benignos; TP=15, FN=5, FP=10, TN=90.

FPR=10/100=10%; FNR=5/20=25%; precisión=15/25=60%. Son propiedades de este fixture con esas etiquetas y umbral.

## 4. Práctica individual

Se pierden logs de cinco positivos antes detectados. Manteniendo el resto, recalcula TP, FN y FNR.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuál es el denominador de FPR?

- A. Todos los positivos reales
- B. Todos los benignos reales evaluados
- C. Solo las alertas
- D. El total de técnicas ATT&CK

### Pregunta 2

¿Cuál es la precisión del fixture?

- A. 90 %
- B. 10 %
- C. 60 %
- D. 25 %

## 6. Aplicación profesional

- SOC: Diseñar casos SOC Sentinel/Splunk.
- Red Team autorizado: Verificar detectabilidad de actividad permitida.
- Evidencia del módulo: Esquema, conjunto de pruebas, casos FP/FN, resultados.
- Criterio del módulo: Reproducible en datasets declarados; sin inventar KQL/SPL.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L16](../../05_RECURSOS/LABORATORIOS/RED-L16.md)
- [Guía de laboratorio RED-L20](../../05_RECURSOS/LABORATORIOS/RED-L20.md)
- [Dataset sintético para calcular métricas](../../05_RECURSOS/DETECCION-120.json)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **CIM**: [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model). Modelo y normalización; etiqueta no demuestra conformidad.
- **DCR**: [Data collection rules in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview). Recolección y transformación; DCR no se equipara a un modelo CIM.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
