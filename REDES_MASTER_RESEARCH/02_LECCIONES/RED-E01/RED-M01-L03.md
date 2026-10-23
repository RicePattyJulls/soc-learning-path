# RED-M01-L03 — Encapsulación y Ethernet

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M01-L03","moduleId":"RED-M01","stageId":"RED-E01","objective":"Seguir la encapsulación y separar direcciones de enlace y de red.","prerequisites":["RED-M01-L02"],"referenceIds":["RFC1122","BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M01-L03-Q01","RED-M01-L03-Q02"],"practiceId":"RED-M01-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M01-L03.md"} -->

## 1. Objetivo

Seguir la encapsulación y separar direcciones de enlace y de red.

Prerrequisitos: [RED-M01-L02](../RED-E01/RED-M01-L02.md).

## 2. Comprende el mecanismo

La aplicación produce datos que el transporte encapsula; IP añade direcciones de red y Ethernet direcciones del siguiente salto local. Para enviar a otra subred, un host normalmente usa la MAC de su gateway, no la MAC del servidor remoto. Cada router retira la cabecera de enlace recibida y construye otra para su enlace de salida. Las direcciones IP pueden conservarse durante el encaminamiento sin NAT, mientras cambia el TTL. ARP resuelve vecinos IPv4 del enlace; Neighbor Discovery cumple funciones de vecindad en IPv6.

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

> Host 192.0.2.10/24; gateway 192.0.2.1; servidor 198.51.100.20; MAC gateway=02:00:00:00:00:01; sin NAT.

El paquete IP mantiene destino 198.51.100.20 y sale en una trama destinada a la MAC del gateway. La MAC remota no es necesaria para el primer salto.

## 4. Práctica individual

Si el destino cambia a 192.0.2.30 y ambos hosts comparten enlace, determina qué dirección resolver y qué cambia.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué MAC usa el primer salto remoto del ejemplo?

- A. La del servidor remoto necesariamente
- B. La del gateway local
- C. La MAC de todos los routers
- D. La del resolver DNS

### Pregunta 2

¿Qué cambia normalmente en cada salto encaminado?

- A. La identidad del usuario
- B. El contenido HTTP necesariamente
- C. El puerto TCP de origen siempre
- D. La cabecera de enlace

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
