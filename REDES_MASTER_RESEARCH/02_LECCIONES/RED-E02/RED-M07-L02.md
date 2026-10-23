# RED-M07-L02 — DHCPv4 y DHCPv6/SLAAC

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M07-L02","moduleId":"RED-M07","stageId":"RED-E02","objective":"Separar cliente, relay, servidor y opciones de direccionamiento.","prerequisites":["RED-M07-L01"],"referenceIds":["RFC1034","RFC2131","RFC8415","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M07-L02-Q01","RED-M07-L02-Q02"],"practiceId":"RED-M07-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M07-L02.md"} -->

## 1. Objetivo

Separar cliente, relay, servidor y opciones de direccionamiento.

Prerrequisitos: [RED-M07-L01](../RED-E02/RED-M07-L01.md).

## 2. Comprende el mecanismo

En DHCPv4 el intercambio habitual Discover, Offer, Request y ACK permite negociar una concesión; los mensajes broadcast no cruzan routers ordinariamente sin ayuda de un relay. El relay comunica el contexto de la red cliente al servidor para seleccionar el ámbito pertinente. Concesión, máscara, router y DNS deben contrastarse con el diseño. En IPv6, DHCPv6 y SLAAC tienen funciones distintas y el descubrimiento de router depende de RA. Un ACK de DHCP no verifica que las opciones entregadas sean correctas para la VLAN.

### Vocabulario de apoyo

- **Resolver y autoridad DNS**: El resolver consulta por el cliente; la autoridad responde por las zonas a su cargo.
- **DHCP y relay**: DHCP entrega configuración de red; el relay comunica la red cliente con un servidor en otra red.
- **TTL y offset**: TTL limita vigencia o recorrido según protocolo; offset es el desfase de un reloj frente a una referencia.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> VLAN20=198.51.100.0/24; relay anuncia contexto VLAN10; servidor ofrece 192.0.2.50/24 con gateway 192.0.2.1.

La concesión es válida para otro ámbito y no resuelve la conectividad de VLAN20. La correlación relay/ámbito explica mejor el resultado que asignar direcciones arbitrarias.

## 4. Práctica individual

La dirección es correcta, pero el DNS entregado es de un segmento inaccesible. ¿Qué parte de la concesión revisarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Para qué sirve el relay DHCPv4?

- A. Cifrar cualquier paquete automáticamente
- B. Transportar solicitudes entre la red cliente y un servidor en otra red
- C. Eliminar todas las opciones
- D. Convertir DHCP en Kerberos

### Pregunta 2

¿Qué error explica la dirección ofrecida?

- A. El contexto de relay apunta al ámbito de otra VLAN
- B. El hostname obliga por sí solo a ignorar el contexto de red indicado
- C. La opción DNS transforma automáticamente el ámbito del relay
- D. La duración de la concesión por sí sola determina otra subred

## 6. Aplicación profesional

- SOC: Investigar DNS anómalo con baseline.
- Red Team autorizado: Verificar que servicios de pruebas no salen del lab.
- Evidencia del módulo: Trazas de consultas, leases, cronología y causa.
- Criterio del módulo: Recupera los tres servicios y verifica hora.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L03](../../05_RECURSOS/LABORATORIOS/RED-L03.md)
- [Guía de laboratorio RED-L05](../../05_RECURSOS/LABORATORIOS/RED-L05.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC1034**: [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html). Resolver, autoridad, caché y funciones DNS.
- **RFC2131**: [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html). Concesiones, cliente/servidor/relay DHCPv4.
- **RFC8415**: [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html). Funciones DHCPv6; no reemplazo de Router Discovery.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
