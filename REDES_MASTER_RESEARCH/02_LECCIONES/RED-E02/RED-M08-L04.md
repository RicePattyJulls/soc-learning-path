# RED-M08-L04 — Errores de puertos y documentación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M08-L04","moduleId":"RED-M08","stageId":"RED-E02","objective":"Interpretar contadores con intervalos y contexto de puerto.","prerequisites":["RED-M08-L03"],"referenceIds":["BRIDGE","PHY","POE"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M08-L04-Q01","RED-M08-L04-Q02"],"practiceId":"RED-M08-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M08-L04.md"} -->

## 1. Objetivo

Interpretar contadores con intervalos y contexto de puerto.

Prerrequisitos: [RED-M08-L03](../RED-E02/RED-M08-L03.md).

## 2. Comprende el mecanismo

Contadores acumulativos requieren comparar diferencias durante intervalos conocidos. Un total alto puede corresponder a meses sin incidentes recientes. Errores CRC, descartes por cola, cambios de enlace y saturación no son métricas equivalentes. Registra velocidad, dúplex, óptica/cobre, potencia cuando aplique y función del puerto. Un hipervisor o AP puede concentrar muchos clientes y no debe documentarse como un único usuario por tener una MAC de gestión. Evita poner a cero contadores sin preservar el estado anterior.

### Vocabulario de apoyo

- **Tabla MAC**: Relación aprendida entre direcciones MAC, puertos y VLAN para conmutar tramas.
- **LLDP/CDP**: Protocolos que anuncian información de vecinos del enlace; CDP corresponde a Cisco.
- **Contador acumulativo**: Total desde su inicio o reinicio; para medir actividad reciente se comparan muestras.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> p8: descartes totales=10000; muestra 1 a 10:00=10000; muestra 2 a 10:05=10000; sin errores nuevos.

El total no creció en el intervalo. No permite atribuir el incidente actual a descartes recientes en ese puerto.

## 4. Práctica individual

El contador pasa de 10000 a 13000 en 60 s. Calcula la tasa y especifica dos datos que faltan para medir impacto.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué se necesita para calcular una tasa?

- A. Un solo total acumulado y la velocidad nominal del puerto
- B. Diferencia del contador y duración del intervalo
- C. Solo la duración del incidente, sin muestras del contador
- D. Dos contadores de interfaces distintas sin hora de muestra

### Pregunta 2

¿Qué concluyes de las dos muestras iguales?

- A. El puerto está físicamente desconectado
- B. No hubo incremento observado de ese contador entre muestras
- C. El servidor no puede fallar
- D. Nunca hubo descartes en el equipo

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
