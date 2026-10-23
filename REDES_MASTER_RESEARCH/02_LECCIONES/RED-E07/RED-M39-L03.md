# RED-M39-L03 — Telemetría comparativa

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M39-L03","moduleId":"RED-M39","stageId":"RED-E07","objective":"Combinar fuentes de red sin contar duplicados como confirmaciones.","prerequisites":["RED-M39-L02"],"referenceIds":["NIST-IR","WIRESHARK","RFC4594"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M39-L03-Q01","RED-M39-L03-Q02"],"practiceId":"RED-M39-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M39-L03.md"} -->

## 1. Objetivo

Combinar fuentes de red sin contar duplicados como confirmaciones.

Prerrequisitos: [RED-M39-L02](../RED-E07/RED-M39-L02.md).

## 2. Comprende el mecanismo

Assurance necesita comparar estado deseado, control, forwarding y servicio. Una métrica SNMP, flujo y captura pueden observar aspectos distintos; documenta su punto y dependencia. Dos tableros alimentados por el mismo colector no son dos observaciones independientes. El tiempo de ingestión puede desplazar una correlación aparente. Usa fuentes con cobertura conocida y resultados contrarios para probar hipótesis. Si una gráfica cambia al actualizar un parser, puede haber cambio de medida sin cambio de tráfico.

### Vocabulario de apoyo

- **SLI, SLO y SLA**: Indicador de servicio, objetivo operativo y compromiso contractual con términos específicos.
- **Assurance**: Contraste de intención, estado y experiencia de servicio mediante observaciones con cobertura conocida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: dos paneles muestran pico idéntico y ambos derivan del mismo stream; el contador del dispositivo no aumenta.

La coincidencia no es corroboración independiente. Debe investigarse duplicación/transformación y compatibilidad de métricas antes de afirmar un pico físico.

## 4. Práctica individual

Un PCAP de otro punto confirma más paquetes, pero no bytes equivalentes. Explica qué comparación falta.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué hace independientes a dos fuentes en esta evaluación?

- A. Consultar dos tablas derivadas del mismo mensaje original
- B. Tener paneles distintos aunque compartan la misma adquisición
- C. Duplicar el mismo stream hacia dos índices con nombres diferentes
- D. Origen y método de observación suficientemente distintos para la hipótesis

### Pregunta 2

¿Qué limita la doble gráfica del caso?

- A. Una está en otra pestaña
- B. Existe un contador del dispositivo
- C. Las dos usan tiempo
- D. Ambas dependen del mismo dato de entrada

## 6. Aplicación profesional

- SOC: Investigar degradación no necesariamente maliciosa.
- Red Team autorizado: Diferenciar prueba normal de degradación inducida.
- Evidencia del módulo: Hipótesis descartadas, baseline y resultado.
- Criterio del módulo: Aísla causa sin confundir coincidencia con causalidad.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L08](../../05_RECURSOS/LABORATORIOS/RED-L08.md)
- [Guía de laboratorio RED-L18](../../05_RECURSOS/LABORATORIOS/RED-L18.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **WIRESHARK**: [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html_chunked/). Filtros, captura, streams, metadatos y límites de observación.
- **RFC4594**: [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html). Clases, marcado y objetivos de QoS.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
