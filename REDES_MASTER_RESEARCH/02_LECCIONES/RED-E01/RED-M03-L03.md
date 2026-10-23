# RED-M03-L03 — SLAAC, DAD y DHCPv6

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M03-L03","moduleId":"RED-M03","stageId":"RED-E01","objective":"Separar creación de dirección, detección de duplicados y configuración adicional.","prerequisites":["RED-M03-L02"],"referenceIds":["RFC4291","RFC8200","RFC4861","RFC4862"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M03-L03-Q01","RED-M03-L03-Q02"],"practiceId":"RED-M03-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M03-L03.md"} -->

## 1. Objetivo

Separar creación de dirección, detección de duplicados y configuración adicional.

Prerrequisitos: [RED-M03-L02](../RED-E01/RED-M03-L02.md).

## 2. Comprende el mecanismo

SLAAC forma direcciones a partir de información anunciada y mecanismos del host; para los enlaces habituales se utiliza un prefijo /64 apropiado. DAD comprueba duplicidad antes de usar una dirección en condiciones normales, pero no autentica al dueño del prefijo. DHCPv6 puede asignar direcciones o información adicional según el modo y la implementación; no sustituye la función de RA para descubrir routers. Los flags A, M y O tienen funciones diferentes y no deben reducirse a una regla universal idéntica para todos los clientes.

### Vocabulario de apoyo

- **Link-local**: Dirección IPv6 válida dentro del enlace, que requiere identificar ese ámbito.
- **ND, RA y DAD**: Neighbor Discovery agrupa funciones de vecindad; RA anuncia routers y DAD busca duplicidad de direcciones.
- **SLAAC**: Autoconfiguración de direcciones mediante información anunciada en el enlace.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> RA docente: prefijo 2001:db8:10::/64, A=1; cliente forma dirección y DAD detecta otra respuesta para esa dirección.

La configuración automática no debe considerar utilizable esa dirección duplicada. Hay que revisar el conflicto y el estado final, no registrar la mera recepción del RA como éxito completo.

## 4. Práctica individual

El cliente tiene dirección única y gateway, pero no puede resolver nombres. Identifica qué parte del proceso debes comprobar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué comprueba DAD?

- A. El contenido de una sesión TLS
- B. La licencia del servidor DHCP
- C. La identidad de todos los routers
- D. La posible duplicidad de una dirección

### Pregunta 2

¿Qué resultado impide declarar utilizable la dirección del ejemplo?

- A. El uso de /64 en el RA
- B. La existencia de un resolver DNS
- C. La detección de un conflicto durante DAD
- D. La notación hexadecimal

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
