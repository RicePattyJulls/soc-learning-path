# RED-M19-L03 — Multicast conceptos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M19-L03","moduleId":"RED-M19","stageId":"RED-E03","objective":"Distinguir pertenencia multicast y construcción del camino.","prerequisites":["RED-M19-L02"],"referenceIds":["RFC4594","RFC3376"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M19-L03-Q01","RED-M19-L03-Q02"],"practiceId":"RED-M19-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M19-L03.md"} -->

## 1. Objetivo

Distinguir pertenencia multicast y construcción del camino.

Prerrequisitos: [RED-M19-L02](../RED-E03/RED-M19-L02.md).

## 2. Comprende el mecanismo

Multicast distribuye tráfico hacia receptores de un grupo. IGMP comunica pertenencia en IPv4; en IPv6 esa función se apoya en MLD. El routing multicast, por ejemplo PIM según modo, construye distribución entre redes; no lo sustituye una tabla de unicast cualquiera. RPF comprueba coherencia del camino de llegada respecto al origen y no es idéntico a uRPF de anti-spoofing. SSM identifica combinaciones de origen y grupo; IGMP snooping puede limitar inundación L2 con dependencias de querier y soporte.

### Vocabulario de apoyo

- **RTT y percentil**: Tiempo de ida y vuelta y valor bajo el que cae una proporción de las muestras.
- **DSCP, policing y shaping**: Marcado de clase, tratamiento del excedente y ajuste de perfil mediante cola.
- **IGMP/MLD y PIM**: Señalización de pertenencia multicast IPv4/IPv6 y familia de protocolos de routing multicast.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: receptor se une al grupo; el switch conoce membresía; el router carece de camino multicast hacia el origen.

La pertenencia local no garantiza que los datos atraviesen redes. Separar control de membresía y construcción del árbol evita culpar solo al cliente.

## 4. Práctica individual

Los receptores de una VLAN funcionan y los de otra no. Define dos estados de red que compararías.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué comunica IGMP?

- A. Asignación de usuarios a roles
- B. Todas las rutas BGP
- C. Claves de cifrado Wi-Fi
- D. Pertenencia a grupos multicast IPv4

### Pregunta 2

¿Qué falta en el caso para entrega entre redes?

- A. Un camino multicast adecuado desde el origen
- B. Solo una entrada ARP del receptor, sin estado multicast
- C. Solo la ruta unicast del receptor, sin distribución multicast
- D. Repetir el join local como prueba suficiente de entrega entre redes

## 6. Aplicación profesional

- SOC: Diferenciar congestión de actividad maliciosa.
- Red Team autorizado: Evaluar impacto de cambios en pruebas de servicio.
- Evidencia del módulo: Métricas con baseline, hipótesis y prioridades.
- Criterio del módulo: Conecta síntomas con medida y límites.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L08](../../05_RECURSOS/LABORATORIOS/RED-L08.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4594**: [RFC 4594: Configuration Guidelines for DiffServ Service Classes](https://www.rfc-editor.org/rfc/rfc4594.html). Clases, marcado y objetivos de QoS.
- **RFC3376**: [RFC 3376: Internet Group Management Protocol Version 3](https://www.rfc-editor.org/rfc/rfc3376.html). Pertenencia multicast IPv4 y selección de origen.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
