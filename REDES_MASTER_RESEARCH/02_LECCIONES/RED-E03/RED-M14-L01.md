# RED-M14-L01 — Sesiones eBGP/iBGP

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M14-L01","moduleId":"RED-M14","stageId":"RED-E03","objective":"Separar sesión BGP de intercambio y uso de prefijos.","prerequisites":["RED-M12-L04","RED-M13-L04"],"referenceIds":["RFC4271","FRR-BGP","RFC7454"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M14-L01-Q01","RED-M14-L01-Q02"],"practiceId":"RED-M14-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M14-L01.md"} -->

## 1. Objetivo

Separar sesión BGP de intercambio y uso de prefijos.

Prerrequisitos: [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M13-L04](../RED-E03/RED-M13-L04.md).

## 2. Comprende el mecanismo

BGP intercambia alcanzabilidad y atributos entre sistemas; eBGP conecta AS diferentes e iBGP comunica dentro del mismo AS. Una sesión Established indica que se completó su establecimiento, no que se aceptaron rutas ni que sus next hops sean alcanzables. iBGP tiene reglas de propagación que requieren una topología apropiada, como malla o reflectores; añadir un vecino no elimina esas reglas. Un reflector reduce sesiones, pero añade decisiones de diseño y no debe confundirse con un gateway de datos obligatorio.

### Vocabulario de apoyo

- **AS y BGP**: Sistema autónomo de routing y protocolo que intercambia alcanzabilidad y atributos entre sistemas.
- **Local preference y AS_PATH**: Preferencia de política interna y secuencia de AS del camino anunciado.
- **Comunidad y ROV**: Etiqueta interpretada por políticas y validación del origen mediante autorizaciones RPKI.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Sesión docente AS65010-AS65020=Established; prefijos recibidos=10; aceptados por política=0.

El transporte y sesión funcionan, pero la política impide instalar esas rutas. Reabrir TCP/179 no resolvería la ausencia observada de prefijos aceptados.

## 4. Práctica individual

Se aceptan prefijos, pero el next hop es inalcanzable. ¿Por qué todavía puede fallar el tráfico?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué distingue eBGP de iBGP?

- A. Ser IPv4 frente a IPv6 necesariamente
- B. Tener cifrado de usuario frente a no tenerlo
- C. La relación entre AS diferentes o el mismo AS
- D. Usar siempre UDP frente a TCP

### Pregunta 2

¿Qué explica cero prefijos aceptados en el ejemplo?

- A. La ausencia de todos los mensajes BGP
- B. Un error obligatorio de ARP en cada host
- C. La política aplicada a rutas recibidas
- D. Un handshake TCP inexistente demostrado

## 6. Aplicación profesional

- SOC: Leer decisiones de camino que afectan visibilidad.
- Red Team autorizado: Validar filtrado de prefijos en entorno aislado.
- Evidencia del módulo: RIB, anuncios, políticas y prueba antes/después.
- Criterio del módulo: No hay anuncios no autorizados; selección explicada.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L07](../../05_RECURSOS/LABORATORIOS/RED-L07.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
