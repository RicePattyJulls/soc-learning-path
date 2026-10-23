# RED-M21-L01 — ACL y orden

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M21-L01","moduleId":"RED-M21","stageId":"RED-E04","objective":"Evaluar una ACL ordenada con coincidencias y sentido de aplicación.","prerequisites":["RED-M09-L04","RED-M12-L04","RED-M17-L04","RED-M20-L04"],"referenceIds":["NIST-ZT","AWS-ACL","AZ-NSG"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M21-L01-Q01","RED-M21-L01-Q02"],"practiceId":"RED-M21-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M21-L01.md"} -->

## 1. Objetivo

Evaluar una ACL ordenada con coincidencias y sentido de aplicación.

Prerrequisitos: [RED-M09-L04](../RED-E02/RED-M09-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M17-L04](../RED-E03/RED-M17-L04.md), [RED-M20-L04](../RED-E04/RED-M20-L04.md).

## 2. Comprende el mecanismo

Una ACL compara campos de tráfico y aplica acciones según su semántica de plataforma, habitualmente siguiendo la primera regla coincidente. Orden, familia IP, interfaz y dirección importan tanto como el texto del permiso. Una regla general previa puede volver inefectiva otra específica posterior. Los grupos de objetos ayudan a expresar conjuntos, pero requieren resolver su contenido efectivo. Declara el tratamiento de lo no coincidente; un deny implícito de una plataforma no debe extrapolarse a todas sin comprobarlo.

### Vocabulario de apoyo

- **ACL y primera coincidencia**: Reglas de control cuya evaluación puede terminar al encontrar la primera aplicable.
- **Stateful y stateless**: Decisión con contexto de conversación y decisión sin ese seguimiento, respectivamente.
- **Egress y enforcement**: Tráfico de salida y punto donde se aplica efectivamente una decisión de acceso.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Lista docente evaluada de arriba abajo: 10 permitir todo desde usuarios; 20 denegar usuarios→DB TCP/5432.

La primera coincidencia permite el flujo antes de alcanzar la denegación. La intención escrita en la segunda regla no determina el resultado.

## 4. Práctica individual

Reordena la lista para denegar solo ese servicio y conservar otros flujos expresamente autorizados.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué puede volver inefectiva una regla específica?

- A. Elegir una familia IP explícita
- B. Documentar su objetivo
- C. Una coincidencia más general anterior con acción definitiva
- D. Probar contadores

### Pregunta 2

¿Qué hace la lista del ejemplo al flujo a DB?

- A. Lo cifra obligatoriamente
- B. Lo deniega siempre por la 20
- C. Lo permite por la regla 10
- D. Lo convierte en UDP

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
