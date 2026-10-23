# RED-M19-L02 — Colas y marking

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M19-L02","moduleId":"RED-M19","stageId":"RED-E03","objective":"Comparar clasificación, marcado, policing y shaping.","prerequisites":["RED-M19-L01"],"referenceIds":["RFC4594","RFC3376"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M19-L02-Q01","RED-M19-L02-Q02"],"practiceId":"RED-M19-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M19-L02.md"} -->

## 1. Objetivo

Comparar clasificación, marcado, policing y shaping.

Prerrequisitos: [RED-M19-L01](../RED-E03/RED-M19-L01.md).

## 2. Comprende el mecanismo

La clasificación identifica tráfico; el marcado, por ejemplo DSCP, comunica una clase; la cola y planificación aplican tratamiento bajo congestión. Marcar no reserva ancho de banda por sí solo. Policing suele descartar o remarcar excedentes según su política; shaping retrasa tráfico mediante buffers para ajustarlo a un perfil. El resultado depende de capacidades, tasas, ráfagas y punto de confianza. Aceptar cualquier DSCP que envía un cliente permite que se autoproclame prioritario sin autorización.

### Vocabulario de apoyo

- **RTT y percentil**: Tiempo de ida y vuelta y valor bajo el que cae una proporción de las muestras.
- **DSCP, policing y shaping**: Marcado de clase, tratamiento del excedente y ajuste de perfil mediante cola.
- **IGMP/MLD y PIM**: Señalización de pertenencia multicast IPv4/IPv6 y familia de protocolos de routing multicast.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: salida de 100 Mb/s hacia servicio de 50 Mb/s; ráfagas superan perfil; shaping a 50 reduce descartes aguas abajo y añade cola.

El shaping puede suavizar tráfico con coste de demora. No crea capacidad ni garantiza que todo paquete llegue sin pérdida.

## 4. Práctica individual

Un usuario marca toda descarga como voz. ¿Qué frontera de confianza y evidencia revisarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué hace normalmente shaping con excedentes?

- A. Descifra TLS
- B. Crea ancho de banda infinito
- C. Los retrasa en una cola dentro de sus límites
- D. Autentica usuarios

### Pregunta 2

¿Qué coste puede introducir el shaping del caso?

- A. Duplicación del contrato del proveedor
- B. Cambio obligatorio de IPv4 a IPv6
- C. Ausencia de toda clasificación
- D. Mayor demora por cola

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
