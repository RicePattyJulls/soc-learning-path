# RED-M27-L04 — NDR y falsos positivos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M27-L04","moduleId":"RED-M27","stageId":"RED-E05","objective":"Contrastar una anomalía NDR con contexto y explicación rival.","prerequisites":["RED-M27-L03"],"referenceIds":["RFC7011","ZEEK-CONN","SURICATA"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M27-L04-Q01","RED-M27-L04-Q02"],"practiceId":"RED-M27-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M27-L04.md"} -->

## 1. Objetivo

Contrastar una anomalía NDR con contexto y explicación rival.

Prerrequisitos: [RED-M27-L03](../RED-E05/RED-M27-L03.md).

## 2. Comprende el mecanismo

NDR combina observaciones y análisis de red para identificar comportamientos relevantes según producto. Una anomalía mide diferencia respecto a un modelo, no intención maliciosa. Cambios de negocio, backups, actualizaciones y pruebas pueden producir novedad legítima. Prioriza por activo, exposición, confianza y consecuencias, incluyendo cobertura del sensor. La explicación rival debe poder contrastarse con datos concretos; escribir podría ser benigno sin identificar qué evidencia lo aclararía no completa una investigación.

### Vocabulario de apoyo

- **IPFIX y plantilla**: Exportación de información de flujos y esquema de campos válido en un contexto de observación.
- **IDS, IPS y NDR**: Detección, prevención y análisis de comportamientos de red, con funciones dependientes del despliegue.
- **Muestreo**: Selección de parte de las observaciones; requiere declarar método y límites de estimación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Alerta docente: primer contacto nocturno a un destino nuevo; inventario registra una actualización planificada pero no confirma qué proceso la ejecutó.

Existe una hipótesis benigna plausible y una incertidumbre de atribución. Verificar proceso, firma/paquete y ventana aporta más que cerrar solo por el calendario.

## 4. Práctica individual

El endpoint muestra un proceso distinto al actualizador autorizado. Explica cómo cambia la prioridad.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué expresa una anomalía por sí sola?

- A. Intención maliciosa demostrada
- B. Acceso administrativo confirmado
- C. Diferencia respecto al comportamiento modelado
- D. Validez de todos los sensores

### Pregunta 2

¿Qué falta para corroborar la actualización del caso?

- A. Asumir que cualquier evento nocturno es benigno
- B. Cambiar el horario de la alerta
- C. Relacionar el proceso y actividad con el cambio autorizado
- D. Eliminar todos los destinos nuevos

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
