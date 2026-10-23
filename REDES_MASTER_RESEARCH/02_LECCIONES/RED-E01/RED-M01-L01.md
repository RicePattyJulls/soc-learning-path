# RED-M01-L01 — OSI frente a TCP/IP

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M01-L01","moduleId":"RED-M01","stageId":"RED-E01","objective":"Localizar una avería por función, sin confundir una capa con una causa.","prerequisites":[],"referenceIds":["RFC1122","BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M01-L01-Q01","RED-M01-L01-Q02"],"practiceId":"RED-M01-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M01-L01.md"} -->

## 1. Objetivo

Localizar una avería por función, sin confundir una capa con una causa.

Prerrequisitos: ninguno; puedes comenzar desde cero.

## 2. Comprende el mecanismo

OSI describe siete funciones: física, enlace, red, transporte, sesión, presentación y aplicación. TCP/IP agrupa funciones de otra forma: acceso al medio, Internet, transporte y aplicación. Son modelos para razonar, no siete dispositivos que cada paquete deba atravesar. Ethernet entrega tramas en un enlace; IP permite encaminarlas entre redes; TCP entrega un flujo de bytes a un proceso. Una aplicación puede fallar aunque sus capas inferiores funcionen. Un ping utiliza ICMP, no prueba por sí solo el establecimiento de TCP ni una respuesta HTTP.

### Vocabulario de apoyo

- **Host**: Equipo conectado que origina o recibe comunicaciones.
- **Gateway**: Router que el host utiliza como siguiente salto hacia otras redes.
- **IP y MAC**: IP identifica un extremo en el encaminamiento; MAC se utiliza en el enlace local.
- **DNS y HTTP**: DNS consulta información de nombres; HTTP intercambia peticiones y respuestas de aplicación.
- **Puerto y servicio**: El puerto identifica un extremo de transporte; el servicio es la función ofrecida por una aplicación.
- **CRC y PoE**: CRC permite detectar corrupción en tramas; PoE suministra energía por un enlace Ethernet compatible.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso sintético: enlace=activo; ping al gateway=respuesta; conexión TCP/443=establecida; respuesta HTTP=503.

El 503 aporta una respuesta de aplicación. Hay conectividad suficiente para ese intercambio; revisar el servicio o su intermediario es más informativo que cambiar el cable por intuición.

## 4. Práctica individual

El mismo servidor devuelve HTTP 200 pero la página informa un error de permisos. Identifica la función que sí funciona y una comprobación pertinente.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué entrega TCP a una aplicación?

- A. Tramas Ethernet a todos los puertos
- B. Direcciones MAC nuevas
- C. Un flujo de bytes
- D. Solo mensajes ICMP

### Pregunta 2

¿Qué acredita el HTTP 503 observado?

- A. La causa exacta del fallo interno
- B. Un cable físicamente desconectado
- C. Que todos los usuarios tienen acceso
- D. Una respuesta de aplicación para esa petición

## 6. Aplicación profesional

- SOC: Identificar causas de desconexión.
- Red Team autorizado: Distinguir exposición de conectividad real.
- Evidencia del módulo: Diagrama, síntomas, pruebas y causa raíz.
- Criterio del módulo: Identifica correctamente capa, evidencia y corrección.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L01](../../05_RECURSOS/LABORATORIOS/RED-L01.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC1122**: [RFC 1122: Requirements for Internet Hosts — Communication Layers](https://www.rfc-editor.org/rfc/rfc1122.html). Funciones de comunicación y separación de capas; no equivalencia rígida entre modelos.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
