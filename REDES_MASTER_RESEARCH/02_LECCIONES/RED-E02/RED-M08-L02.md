# RED-M08-L02 — Dominios de broadcast

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M08-L02","moduleId":"RED-M08","stageId":"RED-E02","objective":"Identificar qué limita un dominio de broadcast.","prerequisites":["RED-M08-L01"],"referenceIds":["BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M08-L02-Q01","RED-M08-L02-Q02"],"practiceId":"RED-M08-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M08-L02.md"} -->

## 1. Objetivo

Identificar qué limita un dominio de broadcast.

Prerrequisitos: [RED-M08-L01](../RED-E02/RED-M08-L01.md).

## 2. Comprende el mecanismo

Una VLAN define un dominio de broadcast de capa 2. Un broadcast de Ethernet se propaga por los puertos elegibles de esa VLAN, no cruza automáticamente un router hacia otra. En un enlace conmutado full duplex no se comparte un dominio de colisión como en Ethernet con hubs. Confundir broadcast y colisión conduce a diseños erróneos. La comunicación entre VLAN exige funciones de capa 3 y políticas asociadas; crear más VLAN no establece por sí solo un firewall efectivo.

### Vocabulario de apoyo

- **Tabla MAC**: Relación aprendida entre direcciones MAC, puertos y VLAN para conmutar tramas.
- **LLDP/CDP**: Protocolos que anuncian información de vecinos del enlace; CDP corresponde a Cisco.
- **Contador acumulativo**: Total desde su inicio o reinicio; para medir actividad reciente se comparan muestras.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Switch docente: p1,p2 en VLAN10; p3 en VLAN20. p1 emite una solicitud ARP broadcast.

La solicitud puede llegar a p2, no se entrega como ese mismo broadcast a p3. Un gateway puede permitir comunicación encaminada por una política independiente.

## 4. Práctica individual

Dos VLAN tienen routing completamente abierto. Explica qué segmentación existe y cuál no está demostrada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué delimita una VLAN?

- A. Un cifrado de extremo a extremo
- B. Un dominio de broadcast de capa 2
- C. Una única aplicación mundial
- D. La identidad de un usuario

### Pregunta 2

¿Quién recibe el ARP del ejemplo dentro del switch?

- A. Todos los puertos de todas las redes
- B. Solo servidores públicos
- C. p3 por pertenecer a VLAN20
- D. Los puertos elegibles de VLAN10, como p2

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
