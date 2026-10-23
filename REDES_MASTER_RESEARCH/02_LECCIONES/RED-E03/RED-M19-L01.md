# RED-M19-L01 — Latencia/jitter/pérdida

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M19-L01","moduleId":"RED-M19","stageId":"RED-E03","objective":"Calcular pérdida y distinguir latencia de variación temporal.","prerequisites":["RED-M04-L04","RED-M12-L04","RED-M18-L04"],"referenceIds":["RFC4594","RFC3376"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M19-L01-Q01","RED-M19-L01-Q02"],"practiceId":"RED-M19-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M19-L01.md"} -->

## 1. Objetivo

Calcular pérdida y distinguir latencia de variación temporal.

Prerrequisitos: [RED-M04-L04](../RED-E01/RED-M04-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M18-L04](../RED-E03/RED-M18-L04.md).

## 2. Comprende el mecanismo

Latencia mide demora; jitter describe variación de demora según la definición utilizada. Pérdida es una proporción respecto a una población e intervalo. RTT no equivale a demora unidireccional y no debe dividirse por dos sin justificar simetría y sincronización. Promedios pueden ocultar colas largas y picos; conserva percentiles, muestras y carga. Una prueba ICMP puede tener tratamiento distinto al tráfico de voz, por lo que medir un ping no valida automáticamente calidad de todas las aplicaciones.

### Vocabulario de apoyo

- **RTT y percentil**: Tiempo de ida y vuelta y valor bajo el que cae una proporción de las muestras.
- **DSCP, policing y shaping**: Marcado de clase, tratamiento del excedente y ajuste de perfil mediante cola.
- **IGMP/MLD y PIM**: Señalización de pertenencia multicast IPv4/IPv6 y familia de protocolos de routing multicast.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Muestra docente: 1000 paquetes enviados, 20 no recibidos; RTT mediano=10 ms, p95=80 ms.

La pérdida observada es 2%. La mediana baja convive con una cola de demoras que puede afectar la aplicación; no resumir todo como 10 ms.

## 4. Práctica individual

Otro informe da 20 pérdidas sin denominador. Explica qué dato impide comparar ambos enlaces.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuánto es 20 de 1000?

- A. 0,02 %
- B. 20 %
- C. 2 %
- D. 200 %

### Pregunta 2

¿Qué advierte p95=80 ms frente a mediana=10 ms?

- A. Existen demoras altas que el valor central no resume
- B. La demora unidireccional es exactamente 5 ms
- C. No hubo pérdida
- D. Todos los paquetes tardan 80 ms

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
