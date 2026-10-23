# RED-M29-L02 — Cronología UTC

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M29-L02","moduleId":"RED-M29","stageId":"RED-E05","objective":"Ordenar eventos con intervalos de incertidumbre.","prerequisites":["RED-M29-L01"],"referenceIds":["NIST-IR","ZEEK-DNS","RFC3022"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M29-L02-Q01","RED-M29-L02-Q02"],"practiceId":"RED-M29-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M29-L02.md"} -->

## 1. Objetivo

Ordenar eventos con intervalos de incertidumbre.

Prerrequisitos: [RED-M29-L01](../RED-E05/RED-M29-L01.md).

## 2. Comprende el mecanismo

Una cronología útil incluye hora original, normalización, hora de llegada y precisión disponible. Cuando los intervalos de dos eventos se solapan, puede no demostrarse un orden estricto. No corregir a mano las fechas para que encajen con una historia. Mantén hipótesis causal separada de proximidad temporal: que A preceda a B no demuestra que A lo causara. Los retrasos y datos recibidos tarde requieren conservar revisiones del análisis y justificar por qué cambia la conclusión.

### Vocabulario de apoyo

- **Hipótesis discriminante**: Explicación con una observación prevista que la distingue de otras alternativas.
- **Pivote y cardinalidad**: Clave para relacionar fuentes y número de correspondencias que produce esa relación.
- **Incertidumbre temporal**: Intervalo admisible de la hora real según resolución y precisión del reloj.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> A=10:00:00Z ±3 s; B=10:00:02Z ±3 s. Los intervalos se solapan.

No puede probarse que A antecediera a B solo con esos tiempos. La presentación ordenada por valor nominal no elimina la incertidumbre.

## 4. Práctica individual

Una tercera fuente fiable sitúa B a 10:00:10Z ±1 s. Reevalúa el orden respecto de A.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué implica solapamiento de intervalos temporales?

- A. Que existe causalidad segura
- B. Que los relojes son perfectos
- C. Puede no poder determinarse el orden estricto
- D. Que ambos eventos son duplicados

### Pregunta 2

¿Qué conserva una cronología revisada?

- A. El borrado de las fuentes tardías
- B. Solo la fecha que mejor encaja
- C. Una hora nueva inventada
- D. Datos originales y razón del cambio de interpretación

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
