# RED-M12-L03 — Longest-prefix match y AD

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M12-L03","moduleId":"RED-M12","stageId":"RED-E03","objective":"Separar selección de rutas y búsqueda por prefijo más largo.","prerequisites":["RED-M12-L02"],"referenceIds":["FRR-STATIC","RFC4632"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M12-L03-Q01","RED-M12-L03-Q02"],"practiceId":"RED-M12-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M12-L03.md"} -->

## 1. Objetivo

Separar selección de rutas y búsqueda por prefijo más largo.

Prerrequisitos: [RED-M12-L02](../RED-E03/RED-M12-L02.md).

## 2. Comprende el mecanismo

Los protocolos proponen rutas; preferencia administrativa y métricas contribuyen a elegir qué rutas se instalan para un prefijo, con reglas de implementación. El forwarding compara las rutas instaladas mediante longest-prefix match: gana la coincidencia más específica. No compares primero la distancia administrativa de un /8 y un /24 como si fueran candidatos al mismo prefijo. Las métricas de protocolos diferentes tampoco tienen una escala universal. Políticas, VRF o encaminamiento basado en política pueden cambiar el contexto de búsqueda.

### Vocabulario de apoyo

- **RIB y FIB**: Tabla de decisiones de routing y estado utilizado para reenviar paquetes, respectivamente.
- **Next hop y LPM**: Siguiente salto y selección del prefijo coincidente más largo entre rutas instaladas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> FIB docente: 0.0.0.0/0→A; 192.0.2.0/24→B; 192.0.2.128/25→C. Destino 192.0.2.130.

El /25 coincide y es más específico que /24 y /0; se elige C. La distancia de las rutas menos específicas no altera esa comparación de forwarding.

## 4. Práctica individual

Decide la salida para 192.0.2.20 y explica por qué no usa C.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué se compara en longest-prefix match?

- A. La longitud de los prefijos instalados que coinciden con el destino
- B. La métrica numéricamente menor entre protocolos sin convertir su significado
- C. La menor distancia administrativa entre todos los prefijos, aunque sean distintos
- D. El orden textual de todas las rutas, sin comprobar pertenencia del destino

### Pregunta 2

¿Cuál es la salida de .130?

- A. B porque /24 es menor número
- B. A siempre por ser default
- C. Todos los routers a la vez necesariamente
- D. C por el /25

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
