# RED-M12-L02 — Default route

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M12-L02","moduleId":"RED-M12","stageId":"RED-E03","objective":"Explicar el alcance de una ruta por defecto y su riesgo de agujero negro.","prerequisites":["RED-M12-L01"],"referenceIds":["FRR-STATIC","RFC4632"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M12-L02-Q01","RED-M12-L02-Q02"],"practiceId":"RED-M12-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M12-L02.md"} -->

## 1. Objetivo

Explicar el alcance de una ruta por defecto y su riesgo de agujero negro.

Prerrequisitos: [RED-M12-L01](../RED-E03/RED-M12-L01.md).

## 2. Comprende el mecanismo

La ruta por defecto IPv4 es 0.0.0.0/0 y la IPv6 ::/0. Coincide con cualquier destino de su familia, pero una coincidencia más específica instalada tiene prioridad para forwarding ordinario. Una default no conoce la accesibilidad de todos los destinos ni garantiza retorno. Dos routers que se envían mutuamente destinos desconocidos pueden producir un bucle hasta agotar TTL o Hop Limit. Para una salida redundante conviene comprobar algo más que la presencia de enlace si el objetivo es detectar fallos aguas arriba.

### Vocabulario de apoyo

- **RIB y FIB**: Tabla de decisiones de routing y estado utilizado para reenviar paquetes, respectivamente.
- **Next hop y LPM**: Siguiente salto y selección del prefijo coincidente más largo entre rutas instaladas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> R1: default→R2. R2: default→R1. Ninguno tiene ruta específica al destino de documentación 203.0.113.20.

Cada uno devuelve el paquete al otro bajo esas rutas; el TTL limita el bucle, pero no crea conectividad. Debe definirse una salida o descarte coherente.

## 4. Práctica individual

R1 añade 203.0.113.0/24 vía R3. Determina qué ruta usará para .20 y para 198.51.100.20.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué prefijo identifica la default IPv6?

- A. ::/0
- B. ::/128
- C. 2001:db8::/32 exclusivamente
- D. fe80::/64 siempre

### Pregunta 2

¿Qué caracteriza la topología inicial del ejemplo?

- A. Un posible bucle entre defaults
- B. Un NAT válido demostrado
- C. Una resolución DNS inversa
- D. Una autorización Zero Trust

## 6. Aplicación profesional

- SOC: Interpretar caminos aparentes en flows.
- Red Team autorizado: Delimitar rutas por las que pasa el tráfico del ensayo.
- Evidencia del módulo: Tablas, traceroute lab y justificación de selección.
- Criterio del módulo: Determina ida y retorno en IPv4/IPv6.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L06](../../05_RECURSOS/LABORATORIOS/RED-L06.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **FRR-STATIC**: [STATIC](https://docs.frrouting.org/en/latest/static.html). Rutas estáticas y siguiente salto.
- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
