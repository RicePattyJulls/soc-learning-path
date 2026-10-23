# RED-M07-L03 — Sincronía y UTC

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M07-L03","moduleId":"RED-M07","stageId":"RED-E02","objective":"Construir una cronología con zona horaria, offset e incertidumbre.","prerequisites":["RED-M07-L02"],"referenceIds":["RFC1034","RFC2131","RFC8415","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M07-L03-Q01","RED-M07-L03-Q02"],"practiceId":"RED-M07-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M07-L03.md"} -->

## 1. Objetivo

Construir una cronología con zona horaria, offset e incertidumbre.

Prerrequisitos: [RED-M07-L02](../RED-E02/RED-M07-L02.md).

## 2. Comprende el mecanismo

UTC es una referencia temporal; NTP estima diferencias de reloj y retraso para sincronizar sistemas. Convertir una zona horaria no corrige un reloj físicamente adelantado. La hora del evento, la del dispositivo que lo envía y la de recepción pueden diferir. Registrar offset estimado, fuente y tolerancia evita ordenar con falsa precisión sucesos cercanos. PTP puede atender necesidades distintas de precisión con requisitos de plataforma; no se obtiene precisión demostrada solo por nombrarlo. La sincronización también afecta autenticación, certificados y correlación de evidencias.

### Vocabulario de apoyo

- **Resolver y autoridad DNS**: El resolver consulta por el cliente; la autoridad responde por las zonas a su cargo.
- **DHCP y relay**: DHCP entrega configuración de red; el relay comunica la red cliente con un servidor en otra red.
- **TTL y offset**: TTL limita vigencia o recorrido según protocolo; offset es el desfase de un reloj frente a una referencia.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Sensor A: 10:00:05Z, offset estimado +5 s. Sensor B: 10:00:01Z, offset 0 ±2 s.

A corresponde aproximadamente a 10:00:00Z tras corregir offset. La incertidumbre de B puede impedir afirmar el orden estricto de los dos sucesos.

## 4. Práctica individual

Un colector recibe a las 10:05Z un evento fechado 10:00Z. Ofrece dos explicaciones que requieren evidencia distinta.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no corrige convertir una zona horaria?

- A. La representación local de una fecha
- B. El sufijo de zona
- C. El formato de una hora
- D. Un reloj adelantado respecto a la referencia

### Pregunta 2

¿Cuál es la hora corregida aproximada de A?

- A. 10:05:00Z
- B. 10:00:10Z
- C. No existe por usar UTC
- D. 10:00:00Z

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
