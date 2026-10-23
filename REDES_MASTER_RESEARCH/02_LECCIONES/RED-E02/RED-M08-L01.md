# RED-M08-L01 — Aprendizaje MAC y ARP

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M08-L01","moduleId":"RED-M08","stageId":"RED-E02","objective":"Relacionar la tabla MAC con la tabla ARP sin intercambiar sus funciones.","prerequisites":["RED-M01-L04","RED-M02-L04"],"referenceIds":["BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M08-L01-Q01","RED-M08-L01-Q02"],"practiceId":"RED-M08-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M08-L01.md"} -->

## 1. Objetivo

Relacionar la tabla MAC con la tabla ARP sin intercambiar sus funciones.

Prerrequisitos: [RED-M01-L04](../RED-E01/RED-M01-L04.md), [RED-M02-L04](../RED-E01/RED-M02-L04.md).

## 2. Comprende el mecanismo

Un switch aprende normalmente la MAC de origen y su puerto dentro de una VLAN. Usa la MAC destino para reenviar; si es desconocida puede inundar los puertos pertinentes de esa VLAN salvo el de entrada. ARP relaciona una dirección IPv4 de vecino con una MAC; no es una tabla de todos los puertos del campus. Las entradas pueden caducar y el movimiento de una MAC requiere contexto de movilidad, redundancia o posible error. Ver una MAC no atribuye por sí solo identidad humana.

### Vocabulario de apoyo

- **Tabla MAC**: Relación aprendida entre direcciones MAC, puertos y VLAN para conmutar tramas.
- **LLDP/CDP**: Protocolos que anuncian información de vecinos del enlace; CDP corresponde a Cisco.
- **Contador acumulativo**: Total desde su inicio o reinicio; para medir actividad reciente se comparan muestras.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Tabla docente VLAN10: MAC A→p1, MAC B→p2. Entra por p1 una trama A→B.

El destino conocido B permite reenviar por p2. Para esta decisión el switch no necesita resolver el nombre DNS del host.

## 4. Práctica individual

B desaparece de la tabla por caducidad. Predice el tratamiento habitual de una nueva trama hacia B.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿De qué dirección aprende normalmente el switch?

- A. De la contraseña del cliente
- B. De la MAC origen de la trama recibida
- C. Del registro MX
- D. Del puerto TCP destino

### Pregunta 2

¿Por dónde reenvía la trama A→B del ejemplo?

- A. Por otra VLAN al azar
- B. Por p2 según su tabla MAC
- C. Solo por el servidor DNS
- D. Por todos los routers siempre

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
