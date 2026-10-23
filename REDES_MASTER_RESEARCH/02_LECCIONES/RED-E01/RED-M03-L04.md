# RED-M03-L04 — IPv6 y control de acceso

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M03-L04","moduleId":"RED-M03","stageId":"RED-E01","objective":"Diseñar una comprobación de acceso que abarque ambas familias IP.","prerequisites":["RED-M03-L03"],"referenceIds":["RFC4291","RFC8200","RFC4861","RFC4862"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M03-L04-Q01","RED-M03-L04-Q02"],"practiceId":"RED-M03-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M03-L04.md"} -->

## 1. Objetivo

Diseñar una comprobación de acceso que abarque ambas familias IP.

Prerrequisitos: [RED-M03-L03](../RED-E01/RED-M03-L03.md).

## 2. Comprende el mecanismo

Doble pila significa que una aplicación puede seleccionar IPv4 o IPv6; proteger una familia no protege automáticamente la otra. Revisa rutas, exposición, resoluciones A/AAAA y políticas de entrada/salida por separado. ICMPv6 Packet Too Big participa en descubrir la MTU del camino; los routers IPv6 no fragmentan paquetes en tránsito como puede ocurrir en IPv4. Una política debe permitir el funcionamiento necesario sin aceptar anuncios de router de cualquier puerto. Los túneles y mecanismos de transición añaden encapsulación y otro punto de observación.

### Vocabulario de apoyo

- **Link-local**: Dirección IPv6 válida dentro del enlace, que requiere identificar ese ámbito.
- **ND, RA y DAD**: Neighbor Discovery agrupa funciones de vecindad; RA anuncia routers y DAD busca duplicidad de direcciones.
- **SLAAC**: Autoconfiguración de direcciones mediante información anunciada en el enlace.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Política docente: TCP/443 permitido en IPv4; IPv6 queda sin regla equivalente. DNS publica A y AAAA para el servicio.

Un cliente puede elegir AAAA y recibir un resultado distinto. Una prueba que solo use IPv4 no permite declarar la política globalmente aplicada.

## 4. Práctica individual

Define cuatro pruebas mínimas de conectividad permitida y denegada para un servicio dual stack.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué implica publicar A y AAAA?

- A. Que todas las ACL se copian automáticamente
- B. El servicio puede ser seleccionado por cualquiera de las dos familias
- C. Que IPv6 necesita ARP
- D. Que desaparece el routing

### Pregunta 2

¿Qué limita una prueba exclusivamente IPv4?

- A. No demuestra el comportamiento del acceso por IPv6
- B. Prueba siempre fragmentación IPv6
- C. Impide usar DNS por completo
- D. Demuestra equivalencia de ambos firewalls

## 6. Aplicación profesional

- SOC: Analizar telemetría IPv6 sin analogías falsas con ARP.
- Red Team autorizado: Verificar segmentación IPv6 en alcance aislado.
- Evidencia del módulo: Plan de prefijos dual stack, trazas y causa raíz.
- Criterio del módulo: Identifica dependencia ND/ICMPv6 y corrección.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L02](../../05_RECURSOS/LABORATORIOS/RED-L02.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4291**: [RFC 4291: IPv6 Addressing Architecture](https://www.rfc-editor.org/rfc/rfc4291.html). Formato, ámbitos y tipos de direcciones IPv6.
- **RFC8200**: [RFC 8200: Internet Protocol, Version 6](https://www.rfc-editor.org/rfc/rfc8200.html). Cabecera IPv6 y fragmentación por origen.
- **RFC4861**: [RFC 4861: Neighbor Discovery for IPv6](https://www.rfc-editor.org/rfc/rfc4861.html). Vecinos, routers y mensajes ICMPv6.
- **RFC4862**: [RFC 4862: IPv6 Stateless Address Autoconfiguration](https://www.rfc-editor.org/rfc/rfc4862.html). SLAAC y detección de direcciones duplicadas.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
