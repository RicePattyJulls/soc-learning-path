# RED-M40-L01 — Requisitos y restricciones

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M40-L01","moduleId":"RED-M40","stageId":"RED-E08","objective":"Convertir necesidades de negocio en criterios verificables de red.","prerequisites":["RED-M14-L04","RED-M15-L04","RED-M20-L04","RED-M21-L04","RED-M23-L04","RED-M25-L04","RED-M38-L04","RED-M39-L04"],"referenceIds":["RFC4632","NIST-ZT","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M40-L01-Q01","RED-M40-L01-Q02"],"practiceId":"RED-M40-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M40-L01.md"} -->

## 1. Objetivo

Convertir necesidades de negocio en criterios verificables de red.

Prerrequisitos: [RED-M14-L04](../RED-E03/RED-M14-L04.md), [RED-M15-L04](../RED-E03/RED-M15-L04.md), [RED-M20-L04](../RED-E04/RED-M20-L04.md), [RED-M21-L04](../RED-E04/RED-M21-L04.md), [RED-M23-L04](../RED-E04/RED-M23-L04.md), [RED-M25-L04](../RED-E04/RED-M25-L04.md), [RED-M38-L04](../RED-E07/RED-M38-L04.md), [RED-M39-L04](../RED-E07/RED-M39-L04.md).

## 2. Comprende el mecanismo

El proyecto empresarial integra direccionamiento, redundancia, segmentación y operación. Primero separa requisitos, restricciones y supuestos: usuarios, sedes, servicios, disponibilidad, gestión, presupuesto y capacidad del laboratorio. Un requisito debe poder verificarse con evidencia y método. Reutiliza el caso común de empresa incluido en los recursos del paquete; es ficticio y no describe el host del estudiante. Si falta una tarifa, una característica o una medida, registra la incertidumbre en vez de inventarla. No confundir tener un catálogo Cisco con haber demostrado preparación certificable.

### Vocabulario de apoyo

- **Requisito y supuesto**: Condición que debe satisfacerse y dato provisional que necesita comprobación.
- **RTO**: Objetivo de tiempo de recuperación para un servicio y fallo definidos, diferente de un resultado ya medido.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso Empresa-Lab: 120 empleados, 60 invitados, 20 servidores; solo un /24 IPv4 para VLAN de usuarios/servicios/gestión; objetivo de recuperación web=5 s bajo fallo definido.

La demanda se transforma en capacidad y pruebas: dimensionar prefijos, definir flujos y explicar qué fallo cubre el objetivo temporal. El RTO docente no es una medición ya obtenida.

## 4. Práctica individual

Entrega tres requisitos medibles y dos supuestos que deban comprobarse antes de aprobar el diseño.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué caracteriza un requisito verificable?

- A. Promete toda disponibilidad sin fallo definido
- B. Solo usa la palabra robusto
- C. Tiene condición de aceptación y método de comprobación
- D. No admite ninguna evidencia

### Pregunta 2

¿Qué significa objetivo de recuperación de 5 s aquí?

- A. Un requisito a probar en un fallo definido
- B. Una garantía de todo incidente futuro
- C. Una recuperación ya medida
- D. La suma de todos los temporizadores

## 6. Aplicación profesional

- SOC: Definir cobertura de sensores realista.
- Red Team autorizado: Verificar controles de arquitectura.
- Evidencia del módulo: Topología, direccionamiento, políticas, pruebas, observabilidad.
- Criterio del módulo: Supera revisión de seguridad, diseño y recuperación.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)
- [Caso integrador Empresa-Lab](../../05_RECURSOS/EMPRESA-LAB.json)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
