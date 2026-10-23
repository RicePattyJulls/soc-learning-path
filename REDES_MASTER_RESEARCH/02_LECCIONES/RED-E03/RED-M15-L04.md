# RED-M15-L04 — uRPF, EIGRP/IS-IS comparados

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M15-L04","moduleId":"RED-M15","stageId":"RED-E03","objective":"Evaluar uRPF y comparar protocolos sin mezclarlos.","prerequisites":["RED-M15-L03"],"referenceIds":["FRR-MAP","RFC3704","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M15-L04-Q01","RED-M15-L04-Q02"],"practiceId":"RED-M15-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M15-L04.md"} -->

## 1. Objetivo

Evaluar uRPF y comparar protocolos sin mezclarlos.

Prerrequisitos: [RED-M15-L03](../RED-E03/RED-M15-L03.md).

## 2. Comprende el mecanismo

uRPF contrasta la dirección de origen con información de routing. En modo estricto puede exigir que la mejor ruta de retorno use la interfaz de entrada; eso puede rechazar tráfico legítimo en topologías asimétricas. Modos menos estrictos tienen otros compromisos y no equivalen a autenticación de usuario. EIGRP usa mecanismos de vector distancia avanzado y métricas propias; IS-IS es estado de enlace con su organización de niveles. Sus métricas no deben compararse numéricamente con las de OSPF como escala universal.

### Vocabulario de apoyo

- **Redistribución**: Importación de rutas entre fuentes o protocolos con políticas de conversión.
- **VRF y PBR**: Contexto independiente de routing y encaminamiento de paquetes mediante política.
- **uRPF**: Validación de origen basada en rutas, con modos que toleran de forma distinta la asimetría.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Paquete docente entra por WAN-B; mejor ruta de vuelta al origen usa WAN-A; uRPF estricto en B lo rechaza.

El rechazo es compatible con asimetría legítima. Revisar diseño y modo de validación antes de afirmar falsificación de origen.

## 4. Práctica individual

La misma red necesita control anti-spoofing sin romper multihoming asimétrico. ¿Qué evidencia y decisión documentarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué puede romper uRPF estricto?

- A. La creación de tablas MAC
- B. Solo conexiones cifradas
- C. Toda dirección IPv4 por definición
- D. Tráfico legítimo con routing asimétrico

### Pregunta 2

¿Qué no debe concluirse del rechazo del ejemplo?

- A. Que el control registró un rechazo
- B. Que existe spoofing confirmado sin contrastar la asimetría
- C. Que debe revisarse el diseño
- D. Que hay interfaces de ida y vuelta distintas

## 6. Aplicación profesional

- SOC: Explicar asimetría/telemetría por VRF.
- Red Team autorizado: Comprobar bypass de segmentación en lab.
- Evidencia del módulo: Política, tablas antes/después y criterio de reversión.
- Criterio del módulo: No hay bucles ni fuga tras corrección.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L07](../../05_RECURSOS/LABORATORIOS/RED-L07.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
