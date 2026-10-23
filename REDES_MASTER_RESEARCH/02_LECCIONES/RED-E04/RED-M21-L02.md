# RED-M21-L02 — Stateful vs stateless

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M21-L02","moduleId":"RED-M21","stageId":"RED-E04","objective":"Distinguir permiso estático y seguimiento de conexión.","prerequisites":["RED-M21-L01"],"referenceIds":["NIST-ZT","AWS-ACL","AZ-NSG"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M21-L02-Q01","RED-M21-L02-Q02"],"practiceId":"RED-M21-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M21-L02.md"} -->

## 1. Objetivo

Distinguir permiso estático y seguimiento de conexión.

Prerrequisitos: [RED-M21-L01](../RED-E04/RED-M21-L01.md).

## 2. Comprende el mecanismo

Un filtro stateless decide usando el paquete sin mantener necesariamente contexto de conexión. Un firewall stateful puede relacionar respuestas con estado previo, aunque el comportamiento depende de protocolo, temporizadores y configuración. No significa que cualquier paquete con ACK sea legítimo. Asimetría, caducidad y cambios de ruta pueden afectar ese estado. En controles stateless, el retorno suele requerir reglas explícitas que contemplen puertos de cliente; copiar permisos de un security group stateful a una ACL stateless puede bloquear respuestas.

### Vocabulario de apoyo

- **ACL y primera coincidencia**: Reglas de control cuya evaluación puede terminar al encontrar la primera aplicable.
- **Stateful y stateless**: Decisión con contexto de conversación y decisión sin ese seguimiento, respectivamente.
- **Egress y enforcement**: Tráfico de salida y punto donde se aplica efectivamente una decisión de acceso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: filtro stateless permite cliente→servidor TCP/443 y deniega servidor→puerto efímero del cliente.

La petición puede salir y la respuesta quedar bloqueada. No es un fallo demostrado del servidor ni de la ruta de ida.

## 4. Práctica individual

El control cambia a stateful y mantiene sesiones existentes al editar reglas según su implementación. ¿Qué comprobación falta?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué añade seguimiento stateful?

- A. Contexto de conversaciones según su implementación
- B. Cifrado obligatorio
- C. Sustitución del routing
- D. Confianza absoluta en cualquier bit ACK

### Pregunta 2

¿Por qué falla el retorno del ejemplo?

- A. Su regla stateless no permite el puerto de respuesta del cliente
- B. No existen puertos efímeros
- C. El servidor nunca recibió la petición
- D. HTTPS siempre usa el puerto origen 443 del cliente

## 6. Aplicación profesional

- SOC: Vincular evento deny/allow a investigación.
- Red Team autorizado: Prueba mínima de aislamiento en lab autorizado.
- Evidencia del módulo: Matriz allow/deny, capturas, config y retest.
- Criterio del módulo: Flujos esperados pasan y no esperados se bloquean.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L10](../../05_RECURSOS/LABORATORIOS/RED-L10.md)
- [Guía de laboratorio RED-L12](../../05_RECURSOS/LABORATORIOS/RED-L12.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
