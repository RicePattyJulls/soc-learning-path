# RED-M39-L02 — SLA, pérdida y jitter

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M39-L02","moduleId":"RED-M39","stageId":"RED-E07","objective":"Separar SLA, SLO e indicadores de funcionamiento.","prerequisites":["RED-M39-L01"],"referenceIds":["NIST-IR","WIRESHARK","RFC4594"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M39-L02-Q01","RED-M39-L02-Q02"],"practiceId":"RED-M39-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M39-L02.md"} -->

## 1. Objetivo

Separar SLA, SLO e indicadores de funcionamiento.

Prerrequisitos: [RED-M39-L01](../RED-E07/RED-M39-L01.md).

## 2. Comprende el mecanismo

Un indicador mide comportamiento; un SLO fija un objetivo operativo para ese indicador y período. Un SLA recoge compromisos contractuales según sus términos; no se deduce de cualquier panel técnico. Definir disponibilidad exige numerador, denominador, ventanas y exclusiones. Las sondas sintéticas, incluidas funciones tipo IP SLA según plataforma, representan su tráfico, no toda experiencia del usuario. Medir pérdida, jitter o transacciones necesita especificar puntos y método antes de evaluar cumplimiento.

### Vocabulario de apoyo

- **SLI, SLO y SLA**: Indicador de servicio, objetivo operativo y compromiso contractual con términos específicos.
- **Assurance**: Contraste de intención, estado y experiencia de servicio mediante observaciones con cobertura conocida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Objetivo docente: 99,9% de pruebas exitosas en 10000 transacciones; resultados=9980 éxitos y 20 fallos, sin exclusiones.

9980/10000=99,8%, por debajo del objetivo declarado. El cálculo no constituye automáticamente una evaluación contractual de un SLA real.

## 4. Práctica individual

Otro informe excluye fallos sin registrar por qué. ¿Qué debe aclarar antes de compararse?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué expresa un SLO?

- A. Un objetivo operativo definido para un indicador
- B. El número de puertos del router
- C. Cualquier contrato legal por defecto
- D. Una prueba única de ping

### Pregunta 2

¿Cumple 99,8% un objetivo de 99,9% sin exclusiones?

- A. Sí porque hubo muchos éxitos
- B. No
- C. Sí por superar 99%
- D. No puede calcularse ningún porcentaje

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
