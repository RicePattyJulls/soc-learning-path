# RED-M01-L02 — Medios, interfaces y velocidad/dúplex

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M01-L02","moduleId":"RED-M01","stageId":"RED-E01","objective":"Distinguir portadora física, negociación y capacidad del medio.","prerequisites":["RED-M01-L01"],"referenceIds":["RFC1122","BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M01-L02-Q01","RED-M01-L02-Q02"],"practiceId":"RED-M01-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M01-L02.md"} -->

## 1. Objetivo

Distinguir portadora física, negociación y capacidad del medio.

Prerrequisitos: [RED-M01-L01](../RED-E01/RED-M01-L01.md).

## 2. Comprende el mecanismo

Un enlace activo indica que las interfaces han detectado condiciones para comunicar, no que todo el trayecto sea saludable. El cobre y la fibra tienen requisitos de distancia, categoría, óptica y conectores distintos. La velocidad negociada y el modo dúplex deben ser compatibles en ambos extremos; full duplex permite transmitir y recibir simultáneamente. Los errores CRC sugieren corrupción observada, pero no identifican por sí solos cable, transceptor o receptor. PoE requiere compatibilidad eléctrica y presupuesto de potencia; que exista enlace de datos no garantiza energía suficiente para un punto de acceso.

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

> Inventario sintético: puerto A=1 Gb/s full; puerto B=1 Gb/s full; CRC sube 800 en 5 min; AP requiere 25 W; potencia disponible=15 W.

La negociación coincide, pero faltan recursos eléctricos para ese AP y hay errores que investigar por separado. Comparar contadores y especificaciones evita reducir ambos síntomas a una sola causa.

## 4. Práctica individual

Un AP se reinicia al encender su segunda radio y no aumentan los CRC. ¿Qué evidencia adicional pedirías antes de cambiar la VLAN?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué permite full duplex?

- A. Garantizar energía PoE
- B. Enviar y recibir simultáneamente
- C. Eliminar todos los CRC
- D. Duplicar automáticamente la velocidad contratada

### Pregunta 2

¿Qué dato explica el déficit del ejemplo?

- A. 25 W requeridos frente a 15 W disponibles
- B. La pertenencia a una VLAN
- C. La coincidencia de 1 Gb/s
- D. El nombre de la interfaz

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
