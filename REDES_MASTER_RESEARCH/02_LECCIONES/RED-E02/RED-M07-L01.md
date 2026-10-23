# RED-M07-L01 — Resolución recursiva y caches

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M07-L01","moduleId":"RED-M07","stageId":"RED-E02","objective":"Interpretar resolución, autoridad y caché sin confundir sus respuestas.","prerequisites":["RED-M02-L04","RED-M03-L04","RED-M05-L04"],"referenceIds":["RFC1034","RFC2131","RFC8415","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M07-L01-Q01","RED-M07-L01-Q02"],"practiceId":"RED-M07-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M07-L01.md"} -->

## 1. Objetivo

Interpretar resolución, autoridad y caché sin confundir sus respuestas.

Prerrequisitos: [RED-M02-L04](../RED-E01/RED-M02-L04.md), [RED-M03-L04](../RED-E01/RED-M03-L04.md), [RED-M05-L04](../RED-E01/RED-M05-L04.md).

## 2. Comprende el mecanismo

El resolver recursivo busca respuestas en nombre del cliente y puede conservarlas durante su TTL; un servidor autoritativo responde por las zonas de su responsabilidad. A y AAAA indican direcciones; CNAME expresa un alias; MX refiere al correo; NS a servidores de una zona y PTR a resolución inversa. Un nombre puede tener respuestas distintas en vistas internas y externas. NXDOMAIN y timeout no significan lo mismo: uno es una respuesta sobre existencia y el otro ausencia de respuesta observada. El TTL no obliga a que todos los clientes renueven simultáneamente.

### Vocabulario de apoyo

- **Resolver y autoridad DNS**: El resolver consulta por el cliente; la autoridad responde por las zonas a su cargo.
- **DHCP y relay**: DHCP entrega configuración de red; el relay comunica la red cliente con un servidor en otra red.
- **TTL y offset**: TTL limita vigencia o recorrido según protocolo; offset es el desfase de un reloj frente a una referencia.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Zona docente: app.example.test A=192.0.2.20, TTL=300. Se cambia a .21; un resolver conserva .20 durante 120 s restantes.

El resolver puede responder con la entrada todavía válida de su caché. Consultar a la autoridad y comparar TTL permite diferenciar propagación por caché de una edición fallida.

## 4. Práctica individual

La vista interna responde con dirección privada y la externa con otra dirección. Define qué comprobar antes de declarar manipulación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué expresa un registro CNAME?

- A. Una máscara de interfaz
- B. La hora del cliente
- C. Un alias de otro nombre
- D. El gateway predeterminado

### Pregunta 2

¿Por qué puede seguir apareciendo .20?

- A. DNS nunca admite cambios
- B. El resolver es necesariamente malicioso
- C. La caché conserva una entrada cuyo TTL no ha vencido
- D. A y AAAA son el mismo tipo

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
