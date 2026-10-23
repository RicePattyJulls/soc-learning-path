# RED-M21-L03 — DMZ y egress

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M21-L03","moduleId":"RED-M21","stageId":"RED-E04","objective":"Definir una política de salida verificable para una DMZ.","prerequisites":["RED-M21-L02"],"referenceIds":["NIST-ZT","AWS-ACL","AZ-NSG"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M21-L03-Q01","RED-M21-L03-Q02"],"practiceId":"RED-M21-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M21-L03.md"} -->

## 1. Objetivo

Definir una política de salida verificable para una DMZ.

Prerrequisitos: [RED-M21-L02](../RED-E04/RED-M21-L02.md).

## 2. Comprende el mecanismo

Filtrar entrada no limita automáticamente las conexiones originadas por un servidor. Egress define destinos, servicios y caminos de salida que una función necesita. Debe contemplar DNS, tiempo, actualizaciones y dependencias, evitando un permiso global para solucionar un síntoma. El control por nombre requiere entender resolución, IP compartida y cambios de servicio; no equivale a identidad infalible de aplicación. Registra lo permitido y denegado, su justificación y el mecanismo de verificación en ambos sentidos.

### Vocabulario de apoyo

- **ACL y primera coincidencia**: Reglas de control cuya evaluación puede terminar al encontrar la primera aplicable.
- **Stateful y stateless**: Decisión con contexto de conversación y decisión sin ese seguimiento, respectivamente.
- **Egress y enforcement**: Tráfico de salida y punto donde se aplica efectivamente una decisión de acceso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Servidor web docente necesita DB interna y resolver autorizado; política actual permite cualquier salida a cualquier red.

El permiso excede la necesidad descrita. Una política acotada reduce caminos posibles sin asumir que la aplicación deje de necesitar servicios auxiliares.

## 4. Práctica individual

Tras acotar salida falla actualización. Diseña una investigación antes de añadir allow any.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué controla egress?

- A. El formato del certificado
- B. La cantidad de usuarios de AD
- C. Comunicación de salida según una política
- D. Solo tráfico dirigido desde Internet

### Pregunta 2

¿Qué demuestra allow any en el caso?

- A. Que todas las dependencias son seguras
- B. Un alcance de salida mayor que el requisito descrito
- C. Que DNS no se usa
- D. Que el servidor está comprometido necesariamente

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
