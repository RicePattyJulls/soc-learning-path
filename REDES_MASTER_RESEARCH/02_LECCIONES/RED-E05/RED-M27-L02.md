# RED-M27-L02 — Muestreo y asimetría

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M27-L02","moduleId":"RED-M27","stageId":"RED-E05","objective":"Evaluar qué puede inferirse de una fuente muestreada o unidireccional.","prerequisites":["RED-M27-L01"],"referenceIds":["RFC7011","ZEEK-CONN","SURICATA"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M27-L02-Q01","RED-M27-L02-Q02"],"practiceId":"RED-M27-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M27-L02.md"} -->

## 1. Objetivo

Evaluar qué puede inferirse de una fuente muestreada o unidireccional.

Prerrequisitos: [RED-M27-L01](../RED-E05/RED-M27-L01.md).

## 2. Comprende el mecanismo

El muestreo reduce el volumen observado y cambia la interpretación de conteos. Multiplicar por una tasa puede ser una estimación bajo supuestos, no una reconstrucción de paquetes ni de eventos raros. Un sensor que ve un solo sentido puede registrar intentos sin respuestas aunque estas existan por otra ruta. Documenta dirección, punto, tasa y algoritmo de muestreo. Las capturas por SPAN/RSPAN/ERSPAN también tienen límites de carga y cobertura: varios nombres de sensores no prueban independencia si comparten la misma fuente.

### Vocabulario de apoyo

- **IPFIX y plantilla**: Exportación de información de flujos y esquema de campos válido en un contexto de observación.
- **IDS, IPS y NDR**: Detección, prevención y análisis de comportamientos de red, con funciones dependientes del despliegue.
- **Muestreo**: Selección de parte de las observaciones; requiere declarar método y límites de estimación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Fuente docente muestrea 1 de cada 100 paquetes y registra 3 coincidencias de una condición; no se conoce distribución temporal.

No pueden afirmarse exactamente 300 eventos. La estimación necesita hipótesis de muestreo y una incertidumbre apropiada.

## 4. Práctica individual

Dos alertas proceden del mismo espejo saturado. ¿Aportan dos confirmaciones independientes de pérdida en producción?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué es multiplicar tres observaciones por cien aquí?

- A. Una estimación con supuestos, no un conteo exacto reconstruido
- B. Un descifrado de payload
- C. Una identificación de usuarios
- D. Una prueba de 300 eventos exactos

### Pregunta 2

¿Qué limita las dos alertas del ejercicio?

- A. Usar el mismo idioma
- B. Tener nombres distintos
- C. Presentar una hora UTC
- D. La fuente de adquisición compartida

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
