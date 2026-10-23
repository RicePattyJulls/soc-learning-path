# RED-M27-L03 — IDS/IPS firmas y anomalías

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M27-L03","moduleId":"RED-M27","stageId":"RED-E05","objective":"Separar alerta IDS y prevención IPS con evidencia de acción.","prerequisites":["RED-M27-L02"],"referenceIds":["RFC7011","ZEEK-CONN","SURICATA"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M27-L03-Q01","RED-M27-L03-Q02"],"practiceId":"RED-M27-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M27-L03.md"} -->

## 1. Objetivo

Separar alerta IDS y prevención IPS con evidencia de acción.

Prerrequisitos: [RED-M27-L02](../RED-E05/RED-M27-L02.md).

## 2. Comprende el mecanismo

Un IDS observa y alerta; un IPS puede aplicar prevención cuando está en el camino y configurado para ello. Una firma coincide con un patrón bajo un contexto, no prueba automáticamente explotación o impacto. Modos de despliegue, reglas, bypass y acciones efectivas cambian la conclusión. Registros como EVE de Suricata incluyen tipos y campos que dependen del evento y configuración; no interpretar toda alerta como un drop. Verifica tráfico permitido/denegado y el servicio antes de atribuir prevención.

### Vocabulario de apoyo

- **IPFIX y plantilla**: Exportación de información de flujos y esquema de campos válido en un contexto de observación.
- **IDS, IPS y NDR**: Detección, prevención y análisis de comportamientos de red, con funciones dependientes del despliegue.
- **Muestreo**: Selección de parte de las observaciones; requiere declarar método y límites de estimación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: sensor pasivo genera alert; servidor registra petición procesada; no existe acción drop en el control.

La evidencia muestra detección, no bloqueo. Que el mensaje tenga alta prioridad no convierte al sensor fuera de banda en un control preventivo.

## 4. Práctica individual

Tras poner un control inline, la alerta indica drop pero el servicio devuelve respuesta. ¿Qué contraste falta?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué distingue un IPS operativo de un IDS pasivo?

- A. No necesita reglas
- B. Puede aplicar prevención en el camino según configuración
- C. Toda alerta siempre confirma compromiso
- D. Siempre descifra TLS

### Pregunta 2

¿Qué demuestran los datos del caso?

- A. Detección sin bloqueo demostrado
- B. Bloqueo de toda petición
- C. Explotación confirmada
- D. Ausencia de actividad en el servidor

## 6. Aplicación profesional

- SOC: Construir evidencia multi-sensor.
- Red Team autorizado: Probar alerta bajo tráfico controlado.
- Evidencia del módulo: Tabla de eventos, sesgos y corroboración necesaria.
- Criterio del módulo: No confunde una alerta con incidente probado.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L14](../../05_RECURSOS/LABORATORIOS/RED-L14.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC7011**: [RFC 7011: IP Flow Information Export Protocol](https://www.rfc-editor.org/rfc/rfc7011.html). Plantillas, dominios de observación y exportación de flujos.
- **ZEEK-CONN**: [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html). Registros de conexión y límites; los fixtures del curso usan otro esquema declarado.
- **SURICATA**: [EVE JSON Output](https://docs.suricata.io/en/latest/output/eve/eve-json-output.html). Tipos de evento y acciones; documentación latest consultada, no imagen elegida para ejecutar.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
