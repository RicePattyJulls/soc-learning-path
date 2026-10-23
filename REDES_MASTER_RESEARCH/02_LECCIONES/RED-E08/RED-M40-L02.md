# RED-M40-L02 — Diseño L2/L3 y acceso

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M40-L02","moduleId":"RED-M40","stageId":"RED-E08","objective":"Entregar un diseño L2/L3 completo con prefijos y caminos.","prerequisites":["RED-M40-L01"],"referenceIds":["RFC4632","NIST-ZT","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M40-L02-Q01","RED-M40-L02-Q02"],"practiceId":"RED-M40-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M40-L02.md"} -->

## 1. Objetivo

Entregar un diseño L2/L3 completo con prefijos y caminos.

Prerrequisitos: [RED-M40-L01](../RED-E08/RED-M40-L01.md).

## 2. Comprende el mecanismo

Documenta VLAN, prefijos IPv4/IPv6, gateway, trunk, root/instancias cuando aplique y routing entre dominios. Justifica rutas estáticas o protocolos elegidos por escala y necesidad. El proyecto puede comparar VRF, BGP e IPv6 mediante un diseño o laboratorio compatible; no exige simular funciones que la herramienta no soporta. Una red por VLAN necesita capacidad para hosts e interfaces, y un mapa bonito no detecta solapamientos. Conserva ida y retorno y los puntos donde se aplican políticas.

### Vocabulario de apoyo

- **Requisito y supuesto**: Condición que debe satisfacerse y dato provisional que necesita comprobación.
- **RTO**: Objetivo de tiempo de recuperación para un servicio y fallo definidos, diferente de un resultado ya medido.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Asignación docente /24: empleados=.0/25; invitados=.128/26; servidores=.192/27; gestión=.224/27. Las capacidades convencionales son 126,62,30,30.

Los bloques están alineados y no se solapan. Satisfacen los conteos básicos del caso, pero las reservas/gateways y crecimiento deben documentarse.

## 4. Práctica individual

Invitados crece a 80 equipos. Explica por qué el /26 ya no basta y qué artefactos deben revisarse al migrar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Cuántos hosts convencionales admite el /26 del caso?

- A. 30
- B. 62
- C. 126
- D. 64 utilizables siempre

### Pregunta 2

¿Qué ocurre al pedir 80 invitados?

- A. IPv4 amplía automáticamente la subred
- B. Cabe sin cambios porque 80 es menor que 128
- C. Se supera la capacidad del /26 asignado
- D. La VLAN elimina necesidad de direcciones

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
