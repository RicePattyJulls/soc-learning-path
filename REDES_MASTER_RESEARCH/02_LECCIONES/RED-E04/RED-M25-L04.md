# RED-M25-L04 — Telemetría y costes estimados pendientes

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M25-L04","moduleId":"RED-M25","stageId":"RED-E04","objective":"Planificar observabilidad y costes sin prometer una captura completa gratuita.","prerequisites":["RED-M25-L03"],"referenceIds":["AWS-ACL","AZ-NSG","AWS-FLOW","AZ-FLOW"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M25-L04-Q01","RED-M25-L04-Q02"],"practiceId":"RED-M25-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M25-L04.md"} -->

## 1. Objetivo

Planificar observabilidad y costes sin prometer una captura completa gratuita.

Prerrequisitos: [RED-M25-L03](../RED-E04/RED-M25-L03.md).

## 2. Comprende el mecanismo

Los flow logs cloud registran metadatos bajo contratos específicos; no son PCAP completos ni incluyen necesariamente todo el tráfico. Disponibilidad, campos, agregación, exclusiones y destinos dependen del servicio y versión. Recoger, transportar, almacenar y consultar datos puede tener costes distintos; no deducir coste cero de que una función exista. Los productos pueden cambiar: verificar la opción vigente antes de desplegar y conservar su fecha. En una propuesta offline basta diseñar un dataset sintético sin activar facturación ni infraestructura real.

### Vocabulario de apoyo

- **VPC y VNet**: Recursos de red virtual de AWS y Azure con contratos y controles propios.
- **Security group, NACL y NSG**: Controles concretos de AWS o Azure; no se presume que compartan evaluación o estado.
- **Peering y flow logs**: Interconexión de redes y registros de metadatos de tráfico con cobertura definida por producto.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Presupuesto docente: 10 GB/día de registros; retención 30 días; no se conocen tarifas ni compresión ni costes de consulta.

El volumen bruto orientativo es 300 GB antes de transformaciones. No puede calcularse precio final ni garantizar cobertura completa con esos datos.

## 4. Práctica individual

Define cuatro elementos para estimar el coste antes de activar logs.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no son normalmente los flow logs?

- A. Datos que requieren retención definida
- B. Una fuente con límites
- C. Una captura completa del payload de todos los paquetes
- D. Metadatos de tráfico según producto

### Pregunta 2

¿Qué volumen bruto resulta de 10 GB diarios por 30 días?

- A. Un precio exacto de cero euros
- B. 10 GB en total
- C. 300 GB
- D. 30 GB

## 6. Aplicación profesional

- SOC: Analizar fuentes cloud con procedencia explícita.
- Red Team autorizado: Validar acceso remoto sin desplegar infraestructura real.
- Evidencia del módulo: Plano y controles por proveedor etiquetados; supuestos de coste.
- Criterio del módulo: Identifica rutas y puntos de inspección; no presupone equivalencias.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L12](../../05_RECURSOS/LABORATORIOS/RED-L12.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **AWS-ACL**: [Control subnet traffic with network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html). Semántica stateless y reglas de NACL.
- **AZ-NSG**: [Azure network security groups overview](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview). Semántica stateful y prioridades de NSG.
- **AWS-FLOW**: [Logging IP traffic using VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html). Cobertura y límites de registros de flujo; no PCAP.
- **AZ-FLOW**: [Virtual Network Flow Logs](https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview). Producto de registro de flujo y alcance por servicio.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
