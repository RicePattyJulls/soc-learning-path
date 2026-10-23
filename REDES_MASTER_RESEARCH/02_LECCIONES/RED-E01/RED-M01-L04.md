# RED-M01-L04 — Errores y límites del modelo

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M01-L04","moduleId":"RED-M01","stageId":"RED-E01","objective":"Separar observación, hipótesis y prueba de causa raíz.","prerequisites":["RED-M01-L03"],"referenceIds":["RFC1122","BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M01-L04-Q01","RED-M01-L04-Q02"],"practiceId":"RED-M01-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M01-L04.md"} -->

## 1. Objetivo

Separar observación, hipótesis y prueba de causa raíz.

Prerrequisitos: [RED-M01-L03](../RED-E01/RED-M01-L03.md).

## 2. Comprende el mecanismo

Un contador es una observación situada en una interfaz y un intervalo. Una hipótesis explica esa observación; la causa raíz requiere pruebas que discriminen explicaciones alternativas. Un aumento de retransmisiones puede deberse a pérdidas, reordenación o al punto de captura. Un modelo por capas ayuda a ordenar preguntas, pero un firewall puede bloquear red o transporte con una política de aplicación. Recoger estado antes y después permite comparar; cambiar simultáneamente cable, MTU y reglas impide atribuir la mejora a una modificación concreta.

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

> Cambio docente A: solo se sustituye el cable; mismo puerto y carga. CRC antes=100/min; después=0/min durante 10 min.

La comparación apoya al cable como causa o componente asociado, con el límite del intervalo y la carga probados. No demuestra que todos los caminos o condiciones estén sanos.

## 4. Práctica individual

Diseña una segunda comprobación si el fallo solo aparece durante copias nocturnas.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué dificulta identificar la causa de una mejora?

- A. Registrar el intervalo de medida
- B. Conservar contadores antes del cambio
- C. Cambiar varias variables simultáneamente
- D. Repetir una carga comparable

### Pregunta 2

¿Qué concluye el ejemplo con mayor rigor?

- A. La aplicación quedó certificada
- B. Los CRC identifican siempre al atacante
- C. Toda la red está validada para siempre
- D. La sustitución se asocia a la desaparición observada de CRC

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
