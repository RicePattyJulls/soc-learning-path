# RED-M27-L01 — 5-tupla y plantillas IPFIX

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M27-L01","moduleId":"RED-M27","stageId":"RED-E05","objective":"Interpretar un flujo y sus requisitos de plantilla.","prerequisites":["RED-M17-L04","RED-M21-L04","RED-M26-L04"],"referenceIds":["RFC7011","ZEEK-CONN","SURICATA"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M27-L01-Q01","RED-M27-L01-Q02"],"practiceId":"RED-M27-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M27-L01.md"} -->

## 1. Objetivo

Interpretar un flujo y sus requisitos de plantilla.

Prerrequisitos: [RED-M17-L04](../RED-E03/RED-M17-L04.md), [RED-M21-L04](../RED-E04/RED-M21-L04.md), [RED-M26-L04](../RED-E05/RED-M26-L04.md).

## 2. Comprende el mecanismo

La 5-tupla combina IP origen/destino, puertos origen/destino y protocolo de transporte cuando son aplicables. Un registro de flujo resume observaciones y no equivale a una sesión de aplicación completa. En IPFIX las plantillas describen campos; el colector debe interpretarlas en el contexto del exportador y dominio de observación. Recibir datos sin la plantilla adecuada puede impedir decodificar correctamente. Contadores y tiempos representan lo observado según expiración, muestreo y política, no el contenido de todos los paquetes.

### Vocabulario de apoyo

- **IPFIX y plantilla**: Exportación de información de flujos y esquema de campos válido en un contexto de observación.
- **IDS, IPS y NDR**: Detección, prevención y análisis de comportamientos de red, con funciones dependientes del despliegue.
- **Muestreo**: Selección de parte de las observaciones; requiere declarar método y límites de estimación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Registro sintético: TCP 192.0.2.10:51000→198.51.100.20:443, bytes=2000; collector no tiene plantilla T256 del exportador A.

La tupla docente es interpretable porque se declara explícitamente aquí; un bloque IPFIX real sin su plantilla no debe decodificarse adivinando offsets.

## 4. Práctica individual

Dos exportadores usan template ID 256 con campos diferentes. ¿Qué clave de contexto conservarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no contiene necesariamente un flujo?

- A. Un período de observación
- B. Direcciones observadas
- C. Contadores según el exportador
- D. El payload completo de los paquetes

### Pregunta 2

¿Por qué no basta template ID 256?

- A. IPFIX no tiene campos
- B. Su significado depende del contexto del exportador y observación
- C. El puerto 256 autentica al colector
- D. Todas las plantillas siempre son idénticas

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
