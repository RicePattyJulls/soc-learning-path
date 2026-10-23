# RED-M39-L01 — Baselines

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M39-L01","moduleId":"RED-M39","stageId":"RED-E07","objective":"Elegir líneas base comparables y detectar cambios relevantes.","prerequisites":["RED-M16-L04","RED-M19-L04","RED-M26-L04","RED-M27-L04"],"referenceIds":["NIST-IR","WIRESHARK","RFC4594"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M39-L01-Q01","RED-M39-L01-Q02"],"practiceId":"RED-M39-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M39-L01.md"} -->

## 1. Objetivo

Elegir líneas base comparables y detectar cambios relevantes.

Prerrequisitos: [RED-M16-L04](../RED-E03/RED-M16-L04.md), [RED-M19-L04](../RED-E03/RED-M19-L04.md), [RED-M26-L04](../RED-E05/RED-M26-L04.md), [RED-M27-L04](../RED-E05/RED-M27-L04.md).

## 2. Comprende el mecanismo

Una baseline necesita servicio, población, intervalo, carga y método. Un promedio único puede esconder saturación o variabilidad; usa distribución y percentiles cuando aporten información. Comparar un lunes laboral con una madrugada vacía no aísla un cambio de infraestructura. La detección de tendencia exige calidad temporal, unidades y reinicios de contadores conocidos. Una anomalía respecto al baseline requiere investigar si cambió la demanda, el método o el sistema antes de asignarle causa.

### Vocabulario de apoyo

- **SLI, SLO y SLA**: Indicador de servicio, objetivo operativo y compromiso contractual con términos específicos.
- **Assurance**: Contraste de intención, estado y experiencia de servicio mediante observaciones con cobertura conocida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Baseline docente: RTT p95=20 ms bajo 100 usuarios; nuevo resultado=60 ms bajo 800 usuarios y otra ruta.

La diferencia existe, pero carga y camino también cambiaron. No permite atribuirla exclusivamente a un ajuste de cola.

## 4. Práctica individual

Diseña una comparación que pueda evaluar ese ajuste con menos confusores.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué necesita una baseline para ser interpretable?

- A. Contexto y método de medida
- B. La promesa de estabilidad permanente
- C. Solo una media
- D. Un número sin unidad

### Pregunta 2

¿Qué impide atribución causal única en el ejemplo?

- A. Usar p95
- B. Tener usuarios
- C. Conservar dos observaciones
- D. Cambios simultáneos de carga y ruta

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
