# RED-M19-L04 — Baselines de voz/vídeo

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M19-L04","moduleId":"RED-M19","stageId":"RED-E03","objective":"Definir una línea base de calidad con carga y población comparables.","prerequisites":["RED-M19-L03"],"referenceIds":["RFC4594","RFC3376"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M19-L04-Q01","RED-M19-L04-Q02"],"practiceId":"RED-M19-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M19-L04.md"} -->

## 1. Objetivo

Definir una línea base de calidad con carga y población comparables.

Prerrequisitos: [RED-M19-L03](../RED-E03/RED-M19-L03.md).

## 2. Comprende el mecanismo

Una línea base describe comportamiento en un contexto, no un umbral mágico universal. Para voz y vídeo considera caudal, pérdida, jitter, latencia y distribución temporal bajo una carga representativa. Las necesidades dependen del códec, buffering y aplicación. Distingue una métrica de red, un SLO elegido y experiencia del usuario. Cambiar varias políticas de QoS simultáneamente impide atribuir una mejora; conservar pruebas antes/después y efectos en clases no prioritarias evita optimizar una aplicación degradando todas las demás.

### Vocabulario de apoyo

- **RTT y percentil**: Tiempo de ida y vuelta y valor bajo el que cae una proporción de las muestras.
- **DSCP, policing y shaping**: Marcado de clase, tratamiento del excedente y ajuste de perfil mediante cola.
- **IGMP/MLD y PIM**: Señalización de pertenencia multicast IPv4/IPv6 y familia de protocolos de routing multicast.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Antes docente: 10 llamadas con pérdida 1%. Después: 2 llamadas con pérdida 0%. Se cambiaron ancho y cola.

Población y configuración cambiaron juntas; no se puede adjudicar la mejora a la cola sin una comparación controlada.

## 4. Práctica individual

Diseña una repetición que permita evaluar la cola y su impacto en transferencias no prioritarias.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe acompañar una línea base?

- A. Un umbral copiado de otra red sin describir el método
- B. El mayor caudal de cualquier prueba histórica de otra aplicación
- C. Solo la media de latencia, sin población ni ventana
- D. Contexto, carga, población y método

### Pregunta 2

¿Qué impide atribuir la mejora del caso a la cola?

- A. Había tráfico de voz
- B. Se guardaron tiempos
- C. Se midió pérdida
- D. Cambiaron simultáneamente carga y configuración

## 6. Aplicación profesional

- SOC: Diferenciar congestión de actividad maliciosa.
- Red Team autorizado: Evaluar impacto de cambios en pruebas de servicio.
- Evidencia del módulo: Métricas con baseline, hipótesis y prioridades.
- Criterio del módulo: Conecta síntomas con medida y límites.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L08](../../05_RECURSOS/LABORATORIOS/RED-L08.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4594**: [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html). Clases, marcado y objetivos de QoS.
- **RFC3376**: [RFC 3376: Internet Group Management Protocol Version 3](https://www.rfc-editor.org/rfc/rfc3376.html). Pertenencia multicast IPv4 y selección de origen.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
