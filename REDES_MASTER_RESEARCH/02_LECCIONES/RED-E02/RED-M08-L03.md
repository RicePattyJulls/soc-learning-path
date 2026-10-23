# RED-M08-L03 — LLDP y CDP

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M08-L03","moduleId":"RED-M08","stageId":"RED-E02","objective":"Usar descubrimiento de vecinos como inventario situado, no como prueba de autorización.","prerequisites":["RED-M08-L02"],"referenceIds":["BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M08-L03-Q01","RED-M08-L03-Q02"],"practiceId":"RED-M08-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M08-L03.md"} -->

## 1. Objetivo

Usar descubrimiento de vecinos como inventario situado, no como prueba de autorización.

Prerrequisitos: [RED-M08-L02](../RED-E02/RED-M08-L02.md).

## 2. Comprende el mecanismo

LLDP anuncia información de vecinos de enlace; CDP es un protocolo de descubrimiento de Cisco. El contenido y alcance dependen de configuración y plataforma. Una tabla de vecinos ayuda a identificar puerto remoto, capacidades y conexión física, pero puede estar incompleta, caducada o contener información declarada. No demuestra que el dispositivo esté autorizado ni que su software sea seguro. En bordes con teléfonos, puntos de acceso o hipervisores, un puerto puede representar varias funciones y necesidades de energía.

### Vocabulario de apoyo

- **Tabla MAC**: Relación aprendida entre direcciones MAC, puertos y VLAN para conmutar tramas.
- **LLDP/CDP**: Protocolos que anuncian información de vecinos del enlace; CDP corresponde a Cisco.
- **Contador acumulativo**: Total desde su inicio o reinicio; para medir actividad reciente se comparan muestras.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Inventario docente: p4 anuncia AP-A por LLDP; controlador registra AP-A; presupuesto PoE permite su demanda.

Tres fuentes coherentes apoyan la identificación y viabilidad del puerto. La autorización se contrasta con el inventario aprobado, no solo con el nombre anunciado.

## 4. Práctica individual

LLDP muestra un switch desconocido en un puerto de usuario. Define una comprobación de bajo impacto antes de aislarlo.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué aporta LLDP?

- A. Una prueba automática de autorización
- B. Credenciales autenticadas de todos los usuarios
- C. Descifrado de TLS
- D. Información anunciada por vecinos de enlace

### Pregunta 2

¿Qué falta para autorizar al AP solo por su anuncio?

- A. Que su puerto haya negociado la velocidad prevista
- B. Que el nombre anunciado coincida con el SSID esperado
- C. Contraste con el inventario y cambio aprobado
- D. Que haya potencia PoE suficiente para encenderlo

## 6. Aplicación profesional

- SOC: Ubicar punto de captura y equipo probable.
- Red Team autorizado: Inventario de activos dentro de alcance.
- Evidencia del módulo: Plano de puertos, MAC y rutas L2.
- Criterio del módulo: Mapa consistente con evidencias L2.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L04](../../05_RECURSOS/LABORATORIOS/RED-L04.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **PHY**: [Troubleshoot Switch Port and Interface Problems](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html). Dúplex, CRC, contadores y diagnóstico de interfaces; procedimientos dependientes de familia.
- **POE**: [Troubleshoot Power over Ethernet on Catalyst 9000](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-9200-series-switches/215636-troubleshooting-power-over-ethernet-poe.html). Demanda de potencia, presupuesto y diagnóstico PoE.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
