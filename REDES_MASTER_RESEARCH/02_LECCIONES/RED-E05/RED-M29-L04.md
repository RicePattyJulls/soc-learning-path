# RED-M29-L04 — Alcance y niveles de certeza

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M29-L04","moduleId":"RED-M29","stageId":"RED-E05","objective":"Comunicar alcance, confianza y datos ausentes.","prerequisites":["RED-M29-L03"],"referenceIds":["NIST-IR","ZEEK-DNS","RFC3022"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M29-L04-Q01","RED-M29-L04-Q02"],"practiceId":"RED-M29-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M29-L04.md"} -->

## 1. Objetivo

Comunicar alcance, confianza y datos ausentes.

Prerrequisitos: [RED-M29-L03](../RED-E05/RED-M29-L03.md).

## 2. Comprende el mecanismo

El alcance de una investigación es el conjunto observado y las relaciones justificadas, no todos los dispositivos que podrían existir. Expresa confianza por afirmación, indicando corroboración, contradicciones y fuentes ausentes. Un resultado inconcluso puede ser correcto si los datos no permiten decidir. Escalar debe incluir pregunta pendiente, impacto potencial y adquisición concreta que podría resolverla. Evita presentar una puntuación inventada como probabilidad estadística calibrada. La cobertura del sensor delimita qué ausencias son interpretables.

### Vocabulario de apoyo

- **Hipótesis discriminante**: Explicación con una observación prevista que la distingue de otras alternativas.
- **Pivote y cardinalidad**: Clave para relacionar fuentes y número de correspondencias que produce esa relación.
- **Incertidumbre temporal**: Intervalo admisible de la hora real según resolución y precisión del reloj.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: flujo de salida observado; origen compartido; sensor no ve payload ni logs NAT; endpoint no disponible.

Puede describirse la salida, pero no atribuir contenido o usuario con confianza alta. El informe debe explicar exactamente esa limitación y su impacto.

## 4. Práctica individual

Redacta una solicitud de escalado que permita avanzar en vez de pedir todos los logs sin criterio.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe acompañar una afirmación de confianza?

- A. Solo el número de alertas
- B. El cargo de quien la escribió
- C. Evidencia, límites y contradicciones pertinentes
- D. Una probabilidad no calibrada

### Pregunta 2

¿Qué no puede afirmarse con el caso?

- A. Que se observó un flujo de salida
- B. Que falta NAT
- C. Contenido exfiltrado y usuario exacto confirmados
- D. Que la atribución necesita más evidencia

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
