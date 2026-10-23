# RED-M12-L04 — Diagnóstico de camino ida/vuelta

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M12-L04","moduleId":"RED-M12","stageId":"RED-E03","objective":"Demostrar ida y retorno usando observaciones de ambos extremos.","prerequisites":["RED-M12-L03"],"referenceIds":["FRR-STATIC","RFC4632"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M12-L04-Q01","RED-M12-L04-Q02"],"practiceId":"RED-M12-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M12-L04.md"} -->

## 1. Objetivo

Demostrar ida y retorno usando observaciones de ambos extremos.

Prerrequisitos: [RED-M12-L03](../RED-E03/RED-M12-L03.md).

## 2. Comprende el mecanismo

Una petición y su respuesta pueden recorrer caminos diferentes. La existencia de la ruta de ida no instala automáticamente la de vuelta; también pueden intervenir políticas, NAT y filtros dependientes de estado. Traceroute muestra respuestas bajo un método concreto, no una prueba completa de todos los saltos ni de todos los protocolos. Un asterisco puede significar filtrado o falta de respuesta, no pérdida del tráfico de aplicación. Recoge direcciones efectivas, ruta seleccionada y observación del intento en origen y destino.

### Vocabulario de apoyo

- **RIB y FIB**: Tabla de decisiones de routing y estado utilizado para reenviar paquetes, respectivamente.
- **Next hop y LPM**: Siguiente salto y selección del prefijo coincidente más largo entre rutas instaladas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cliente 192.0.2.10 envía SYN; servidor 198.51.100.20 lo recibe y devuelve SYN/ACK por una default que lleva a otro segmento sin ruta al cliente.

La evidencia localiza un problema de retorno. Un firewall del cliente no debe darse por culpable sin observar dónde se interrumpe esa respuesta.

## 4. Práctica individual

El retorno llega al cliente, que envía RST. ¿Qué cambia en el diagnóstico?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

Tras observar un paquete enviado hacia el servidor, ¿qué falta comprobar para una conversación completa?

- A. Que existió alguna decisión de salida para ese paquete ya enviado
- B. Una ruta y política de retorno utilizables
- C. Que el origen llegó a enviar ese paquete observado
- D. Que el paquete llevaba una dirección destino

### Pregunta 2

¿Qué evidencia sitúa el problema del caso?

- A. Una consulta MX
- B. Un cambio de nombre del servidor
- C. SYN recibido y SYN/ACK encaminado por una salida sin retorno adecuado
- D. Un asterisco aislado de otra traza

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
