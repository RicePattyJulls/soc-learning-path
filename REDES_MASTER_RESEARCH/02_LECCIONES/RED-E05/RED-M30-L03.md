# RED-M30-L03 — Correlación con endpoint/identidad

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M30-L03","moduleId":"RED-M30","stageId":"RED-E05","objective":"Correlacionar red y endpoint con relaciones explícitas.","prerequisites":["RED-M30-L02"],"referenceIds":["CIM","DCR","NIST-IR"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M30-L03-Q01","RED-M30-L03-Q02"],"practiceId":"RED-M30-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M30-L03.md"} -->

## 1. Objetivo

Correlacionar red y endpoint con relaciones explícitas.

Prerrequisitos: [RED-M30-L02](../RED-E05/RED-M30-L02.md).

## 2. Comprende el mecanismo

Una conexión de red y un evento de proceso pueden relacionarse mediante host, tiempo, puertos e identificadores de la fuente. El PID puede reutilizarse y no es único para siempre; una IP también puede cambiar. Documenta claves, ventana, cardinalidad y efecto de duplicados antes de afirmar un proceso responsable. Una unión muchos a muchos puede multiplicar coincidencias sin aumentar observaciones originales. Incluye casos con datos ausentes y una explicación alternativa para distinguir coincidencia temporal de una cadena causal demostrada.

### Vocabulario de apoyo

- **Normalización y null**: Mapeo con semántica preservada y representación explícita de dato desconocido.
- **CIM, CEF y DCR**: Modelo de información de Splunk, formato de eventos y reglas Azure de recolección/transformación.
- **TP, FP, FN y TN**: Positivos correctos, alertas sobre benignos, positivos omitidos y benignos sin alerta respecto a etiquetas conocidas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Datos docentes: una conexión; tres procesos del mismo host dentro de una ventana de cinco minutos; sin puerto ni ID de proceso en la fuente de red.

La ventana produce candidatos, no una atribución exclusiva. Se necesita evidencia más específica o conservar incertidumbre.

## 4. Práctica individual

La unión genera nueve filas a partir de tres eventos duplicados. ¿Qué métrica evitarías usar como evidencia?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe documentarse en una correlación?

- A. Claves, ventana, cardinalidad y calidad de fuentes
- B. Una identidad fija por PID para siempre
- C. Que cercanía temporal implica causalidad
- D. Solo el número final de filas

### Pregunta 2

¿Qué produce la ventana del caso?

- A. Una atribución exclusiva automática
- B. Un usuario remoto identificado
- C. Tres candidatos, no proceso responsable demostrado
- D. Tres conexiones confirmadas

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
