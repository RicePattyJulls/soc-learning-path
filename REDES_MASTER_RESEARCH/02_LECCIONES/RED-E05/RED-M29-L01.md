# RED-M29-L01 — Hipótesis versus hecho

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M29-L01","moduleId":"RED-M29","stageId":"RED-E05","objective":"Separar hechos, hipótesis y afirmaciones que la evidencia no permite.","prerequisites":["RED-M26-L04","RED-M27-L04","RED-M28-L04"],"referenceIds":["NIST-IR","ZEEK-DNS","RFC3022"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M29-L01-Q01","RED-M29-L01-Q02"],"practiceId":"RED-M29-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M29-L01.md"} -->

## 1. Objetivo

Separar hechos, hipótesis y afirmaciones que la evidencia no permite.

Prerrequisitos: [RED-M26-L04](../RED-E05/RED-M26-L04.md), [RED-M27-L04](../RED-E05/RED-M27-L04.md), [RED-M28-L04](../RED-E05/RED-M28-L04.md).

## 2. Comprende el mecanismo

Un hecho registra qué observó una fuente con sus límites; una hipótesis propone una explicación contrastable. La alerta es una entrada de investigación, no una conclusión. Formula al menos una alternativa benigna y especifica qué resultado la apoyaría o debilitaría. Una hipótesis de túnel DNS necesita más que nombres largos: aplicación, frecuencia, destino y endpoint pueden cambiar la interpretación. Es válido terminar con incertidumbre y un plan de adquisición concreto cuando no existe evidencia suficiente para resolverla.

### Vocabulario de apoyo

- **Hipótesis discriminante**: Explicación con una observación prevista que la distingue de otras alternativas.
- **Pivote y cardinalidad**: Clave para relacionar fuentes y número de correspondencias que produce esa relación.
- **Incertidumbre temporal**: Intervalo admisible de la hora real según resolución y precisión del reloj.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Hecho docente: 200 consultas a nombres largos. Hipótesis A=telemetría legítima; B=canal no autorizado; proceso no identificado.

La longitud y cantidad justifican investigar, pero no seleccionan por sí solas B. El proceso y su autorización son pruebas discriminantes.

## 4. Práctica individual

Diseña una observación que podría refutar la explicación benigna de telemetría aprobada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué hace contrastable una hipótesis?

- A. Eliminar alternativas
- B. Asignar severidad máxima siempre
- C. Repetir el nombre de la alerta
- D. Definir evidencia que podría apoyarla o debilitarla

### Pregunta 2

¿Qué no demuestra el hecho del caso por sí solo?

- A. Consultas largas observadas
- B. Un túnel DNS no autorizado confirmado
- C. Necesidad de contexto adicional
- D. Cantidad registrada por la fuente

## 6. Aplicación profesional

- SOC: Competencia central de investigación.
- Red Team autorizado: Formular prueba adicional mínima y autorizada.
- Evidencia del módulo: Timeline, alternativas, alcance y solicitud de datos.
- Criterio del módulo: Decisión reproducible basada en evidencias.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L15](../../05_RECURSOS/LABORATORIOS/RED-L15.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **ZEEK-DNS**: [dns.log](https://docs.zeek.org/en/current/reference/logs/dns.html). Registros DNS y significado de campos por versión.
- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
