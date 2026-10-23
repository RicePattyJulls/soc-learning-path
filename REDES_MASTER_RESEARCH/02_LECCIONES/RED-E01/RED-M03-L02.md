# RED-M03-L02 — ICMPv6, ND y RA

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M03-L02","moduleId":"RED-M03","stageId":"RED-E01","objective":"Relacionar Neighbor Discovery con resolución de vecinos y routers.","prerequisites":["RED-M03-L01"],"referenceIds":["RFC4291","RFC8200","RFC4861","RFC4862"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M03-L02-Q01","RED-M03-L02-Q02"],"practiceId":"RED-M03-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M03-L02.md"} -->

## 1. Objetivo

Relacionar Neighbor Discovery con resolución de vecinos y routers.

Prerrequisitos: [RED-M03-L01](../RED-E01/RED-M03-L01.md).

## 2. Comprende el mecanismo

Neighbor Discovery utiliza mensajes ICMPv6 para resolver vecinos, descubrir routers y mantener información de alcanzabilidad. NS y NA intervienen en la vecindad; RS y RA permiten solicitar y anunciar routers. Un RA puede anunciar prefijos y tiempos de vida; la información de router por defecto no se obtiene de DHCPv6 como si fuera una opción equivalente a DHCPv4. Bloquear indiscriminadamente ICMPv6 puede romper funciones necesarias. RA Guard es un control de acceso de enlace cuya disponibilidad y comportamiento dependen de la plataforma.

### Vocabulario de apoyo

- **Link-local**: Dirección IPv6 válida dentro del enlace, que requiere identificar ese ámbito.
- **ND, RA y DAD**: Neighbor Discovery agrupa funciones de vecindad; RA anuncia routers y DAD busca duplicidad de direcciones.
- **SLAAC**: Autoconfiguración de direcciones mediante información anunciada en el enlace.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: cliente recibe NA del vecino, pero no hay RA; tiene dirección global configurada manualmente y ninguna ruta por defecto.

La resolución de un vecino funciona, pero eso no crea una ruta por defecto. Revisar anuncios de router o routing explícito, sin atribuir toda la avería a DHCP.

## 4. Práctica individual

Añade un RA legítimo con lifetime 0 para el router. ¿Debes asumir que instala una ruta por defecto?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué mensajes anuncian routers IPv6?

- A. ACK de TCP
- B. Registros MX de DNS
- C. Respuestas ARP de IPv4
- D. RA de ICMPv6

### Pregunta 2

¿Qué falta en el cliente del ejemplo para salir del enlace?

- A. Un puerto TCP fijo de usuario
- B. Una ruta adecuada, incluida la ruta por defecto si procede
- C. Eliminar ICMPv6 por completo
- D. Cambiar hexadecimal por decimal

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
