# RED-M30-L01 — Campos y procedencia

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M30-L01","moduleId":"RED-M30","stageId":"RED-E05","objective":"Diseñar un contrato de campos que conserve significado y origen.","prerequisites":["RED-M26-L04","RED-M27-L04","RED-M29-L04"],"referenceIds":["CIM","DCR","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M30-L01-Q01","RED-M30-L01-Q02"],"practiceId":"RED-M30-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M30-L01.md"} -->

## 1. Objetivo

Diseñar un contrato de campos que conserve significado y origen.

Prerrequisitos: [RED-M26-L04](../RED-E05/RED-M26-L04.md), [RED-M27-L04](../RED-E05/RED-M27-L04.md), [RED-M29-L04](../RED-E05/RED-M29-L04.md).

## 2. Comprende el mecanismo

Normalizar facilita comparar datos, pero no autoriza a convertir ausencia en un valor conocido. Distingue IP observada antes o después de NAT, hora de evento o ingestión, bytes de un sentido o suma y acción solicitada o aplicada. Conserva campo original, parser, versión, zona y unidad. Un campo canónico propio es una decisión editorial, no un estándar oficial por llamarse source_ip. Los valores desconocidos deben poder representarse sin inventar identidad o resultado.

### Vocabulario de apoyo

- **Normalización y null**: Mapeo con semántica preservada y representación explícita de dato desconocido.
- **CIM, CEF y DCR**: Modelo de información de Splunk, formato de eventos y reglas Azure de recolección/transformación.
- **TP, FP, FN y TN**: Positivos correctos, alertas sobre benignos, positivos omitidos y benignos sin alerta respecto a etiquetas conocidas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Registro docente A: bytes_out=1000; registro B: bytes_total=1000. Ambos se mapean erróneamente a bytes_out.

El mapeo altera semántica: el segundo no expresa necesariamente bytes de salida. Una comparación posterior daría precisión aparente con significado diferente.

## 4. Práctica individual

Un parser convierte action ausente en allowed. Explica el defecto y su corrección.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe preservarse además del nombre canónico?

- A. Solo el valor numérico, aunque cambie la unidad
- B. Solo el nombre del campo y su formato de texto
- C. Significado, unidad, origen y transformación
- D. Un valor allowed predeterminado cuando la acción no existe

### Pregunta 2

¿Qué problema muestra el mapeo de bytes?

- A. Elimina necesidad de unidades
- B. Acredita una transferencia completa
- C. Confunde total con un sentido del tráfico
- D. Demuestra duplicación exacta de paquetes

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
