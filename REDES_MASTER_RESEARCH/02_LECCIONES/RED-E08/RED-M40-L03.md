# RED-M40-L03 — Seguridad/observabilidad

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M40-L03","moduleId":"RED-M40","stageId":"RED-E08","objective":"Diseñar seguridad y observabilidad como partes del camino.","prerequisites":["RED-M40-L02"],"referenceIds":["RFC4632","NIST-ZT","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M40-L03-Q01","RED-M40-L03-Q02"],"practiceId":"RED-M40-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M40-L03.md"} -->

## 1. Objetivo

Diseñar seguridad y observabilidad como partes del camino.

Prerrequisitos: [RED-M40-L02](../RED-E08/RED-M40-L02.md).

## 2. Comprende el mecanismo

El proyecto debe indicar política de acceso y fuentes que permitan evaluar su cumplimiento. Declara origen, destino, servicio, identidad aplicable, control y evento esperado. Separar gestión, invitados y servidores requiere algo más que VLAN distintas. Incluye IPv6, salida, retorno y recursos de observación para evitar un diseño seguro solo en el diagrama. Especifica qué registros son sintéticos y cómo se relacionan con el comportamiento esperado; no llamar PCAP a una tabla escrita a mano ni atribuirla a un sensor ejecutado.

### Vocabulario de apoyo

- **Requisito y supuesto**: Condición que debe satisfacerse y dato provisional que necesita comprobación.
- **RTO**: Objetivo de tiempo de recuperación para un servicio y fallo definidos, diferente de un resultado ya medido.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Matriz Empresa-Lab: invitado→gestión TCP/22 denegado; administrador autorizado→gestión TCP/22 permitido; ambos intentos deben quedar trazables.

Las dos pruebas verifican aislamiento y continuidad administrativa. El dato de deny debe corresponder al punto previsto y no solo a un timeout ambiguo.

## 4. Práctica individual

Define qué evidencia solicitarías para demostrar cobertura del mismo objetivo en IPv6.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué requiere una política verificable?

- A. Una lista de productos
- B. Flujo esperado, enforcement y evidencia de su resultado
- C. Un firewall dibujado sin rutas
- D. Solo nombres de zonas

### Pregunta 2

¿Por qué probar administrador permitido además de invitado denegado?

- A. Para detectar bloqueos que rompen la función legítima
- B. Para autorizar a todos los invitados
- C. Para probar todos los servicios de Internet
- D. Para eliminar el retest

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
