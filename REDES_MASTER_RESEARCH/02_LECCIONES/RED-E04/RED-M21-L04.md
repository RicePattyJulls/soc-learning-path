# RED-M21-L04 — Microsegmentación/Zero Trust

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M21-L04","moduleId":"RED-M21","stageId":"RED-E04","objective":"Relacionar segmentación e identidad sin reducir Zero Trust a VLAN.","prerequisites":["RED-M21-L03"],"referenceIds":["NIST-ZT","AWS-ACL","AZ-NSG"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M21-L04-Q01","RED-M21-L04-Q02"],"practiceId":"RED-M21-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M21-L04.md"} -->

## 1. Objetivo

Relacionar segmentación e identidad sin reducir Zero Trust a VLAN.

Prerrequisitos: [RED-M21-L03](../RED-E04/RED-M21-L03.md).

## 2. Comprende el mecanismo

Zero Trust considera el acceso a recursos mediante decisiones basadas en contexto y políticas; estar dentro de una red no concede confianza ilimitada. Microsegmentar puede acotar comunicaciones entre cargas, pero no autentica por sí solo la operación de negocio. Separa identidad de usuario/dispositivo, estado, servicio y punto de enforcement. Las etiquetas de grupo o red requieren procedencia confiable. Un diseño útil especifica quién puede hacer qué, con qué evidencia y cómo se revisa la decisión cuando cambia el contexto.

### Vocabulario de apoyo

- **ACL y primera coincidencia**: Reglas de control cuya evaluación puede terminar al encontrar la primera aplicable.
- **Stateful y stateless**: Decisión con contexto de conversación y decisión sin ese seguimiento, respectivamente.
- **Egress y enforcement**: Tráfico de salida y punto donde se aplica efectivamente una decisión de acceso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: un equipo autenticado entra a VLAN empleados; desde allí todas las cuentas pueden administrar la base de datos.

La admisión de red no justifica autorización administrativa global. Faltan decisiones de acceso al recurso y separación de privilegios.

## 4. Práctica individual

Define una prueba negativa para un usuario válido sin rol de administrador.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

Además de pertenecer a la VLAN de empleados, ¿qué debe verificarse para administrar la DB?

- A. Solo que el gateway responda a ping
- B. Solo completar una conexión de transporte al servicio
- C. Solo disponer de cualquier dirección de la VLAN
- D. Autorización de la identidad para esa operación sobre el recurso

### Pregunta 2

¿Qué falta en la autorización del caso?

- A. Un nombre de VLAN más seguro
- B. Aumentar el tamaño del prefijo
- C. Eliminar todas las identidades
- D. Separar acceso al recurso según rol y operación

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
