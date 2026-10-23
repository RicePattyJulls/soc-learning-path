# RED-M03-L01 — Formato IPv6 y tipos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M03-L01","moduleId":"RED-M03","stageId":"RED-E01","objective":"Distinguir tipos de direcciones IPv6 y comprimirlas sin perder información.","prerequisites":["RED-M01-L04","RED-M02-L04"],"referenceIds":["RFC4291","RFC8200","RFC4861","RFC4862"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M03-L01-Q01","RED-M03-L01-Q02"],"practiceId":"RED-M03-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M03-L01.md"} -->

## 1. Objetivo

Distinguir tipos de direcciones IPv6 y comprimirlas sin perder información.

Prerrequisitos: [RED-M01-L04](../RED-E01/RED-M01-L04.md), [RED-M02-L04](../RED-E01/RED-M02-L04.md).

## 2. Comprende el mecanismo

IPv6 utiliza 128 bits expresados como ocho grupos hexadecimales. Se pueden omitir ceros iniciales y comprimir una única secuencia de grupos cero con ::; hacerlo dos veces sería ambiguo. Las direcciones link-local se utilizan en el enlace y no se encaminan como destinos globales. ULA permite direccionamiento local, sin implicar conectividad pública. Anycast usa una dirección unicast asignada a varios nodos y el routing selecciona un destino. No toda interfaz usa EUI-64: existen identificadores estables y temporales con otras propiedades de privacidad.

### Vocabulario de apoyo

- **Link-local**: Dirección IPv6 válida dentro del enlace, que requiere identificar ese ámbito.
- **ND, RA y DAD**: Neighbor Discovery agrupa funciones de vecindad; RA anuncia routers y DAD busca duplicidad de direcciones.
- **SLAAC**: Autoconfiguración de direcciones mediante información anunciada en el enlace.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Dirección docente: 2001:0db8:0000:0000:0000:0000:0000:0010. Forma comprimida: 2001:db8::10.

La compresión mantiene los mismos 128 bits. El prefijo 2001:db8::/32 se reserva para documentación; no representa un servidor público a consultar.

## 4. Práctica individual

Expande 2001:db8:1::5 y explica por qué fe80::1 necesita contexto de interfaz cuando hay varios enlaces.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuántas veces puede aparecer :: en una dirección válida?

- A. Una como máximo
- B. Ocho como máximo
- C. Dos siempre
- D. Una por cada interfaz

### Pregunta 2

¿Qué implica anycast?

- A. Varios nodos pueden compartir la dirección y el routing elige destino
- B. Un identificador EUI-64 obligatorio
- C. Cifrado obligatorio del contenido
- D. Un broadcast a todos los hosts

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
