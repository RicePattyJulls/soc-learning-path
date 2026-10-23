# RED-M39-L04 — Diagnóstico transversal

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M39-L04","moduleId":"RED-M39","stageId":"RED-E07","objective":"Diagnosticar hipótesis multicapas y revisar sugerencias de IA.","prerequisites":["RED-M39-L03"],"referenceIds":["NIST-IR","WIRESHARK","RFC4594"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M39-L04-Q01","RED-M39-L04-Q02"],"practiceId":"RED-M39-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M39-L04.md"} -->

## 1. Objetivo

Diagnosticar hipótesis multicapas y revisar sugerencias de IA.

Prerrequisitos: [RED-M39-L03](../RED-E07/RED-M39-L03.md).

## 2. Comprende el mecanismo

Un método de diagnóstico explicita síntoma, alcance, estado previo, hipótesis, prueba discriminante y resultado. Cambiar una cosa por vez mejora atribución, salvo decisiones de emergencia documentadas. Una sugerencia de IA es una propuesta que requiere verificar versión, capacidades, efecto y rollback; una explicación convincente no demuestra que un comando exista o sea adecuado. No entregar secretos o datos ajenos al contexto autorizado. El cierre identifica causa respaldada y condiciones de recurrencia, no solo que dejó de fallar.

### Vocabulario de apoyo

- **SLI, SLO y SLA**: Indicador de servicio, objetivo operativo y compromiso contractual con términos específicos.
- **Assurance**: Contraste de intención, estado y experiencia de servicio mediante observaciones con cobertura conocida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Sugerencia docente: desactivar firewall para corregir lentitud; evidencia real muestra RTT estable y consultas DNS que tardan 5 s.

La recomendación no se apoya en la evidencia disponible. Contrastar resolución y dependencias es una prueba más discriminante y menos amplia.

## 4. Práctica individual

Formula una prueba que podría refutar la hipótesis de DNS lento.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cómo debe tratarse un comando sugerido por IA?

- A. Como sustituto de datos observados
- B. Como permiso para cualquier cambio
- C. Como propuesta a verificar por fuente, versión, efecto y recuperación
- D. Como evidencia de ejecución exitosa

### Pregunta 2

¿Qué dependencia merece contraste en el caso?

- A. El ancho de canal Wi-Fi sin evidencia
- B. La demora de resolución DNS
- C. Una tabla BGP caída demostrada
- D. Un firewall culpable por ser un control

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
