# RED-M40-L04 — Pruebas y documentación

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M40-L04","moduleId":"RED-M40","stageId":"RED-E08","objective":"Defender pruebas, documentación y límites del proyecto.","prerequisites":["RED-M40-L03"],"referenceIds":["RFC4632","NIST-ZT","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M40-L04-Q01","RED-M40-L04-Q02"],"practiceId":"RED-M40-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M40-L04.md"} -->

## 1. Objetivo

Defender pruebas, documentación y límites del proyecto.

Prerrequisitos: [RED-M40-L03](../RED-E08/RED-M40-L03.md).

## 2. Comprende el mecanismo

Entrega diagramas físico/lógico, direccionamiento, matriz de flujos, decisiones de routing, gestión, configuración revisada, pruebas y recuperación. Identifica funciones realmente ejecutadas y decisiones solo diseñadas. Si el entorno no puede implementar una característica, aporta una alternativa docente y declara que no acredita su ejecución. Las pruebas deben incluir fallo, retorno, casos permitidos/denegados y capacidad bajo contingencia. Un índice de documentos o un hash correcto no sustituye resultados observados y una explicación causal.

### Vocabulario de apoyo

- **Requisito y supuesto**: Condición que debe satisfacerse y dato provisional que necesita comprobación.
- **RTO**: Objetivo de tiempo de recuperación para un servicio y fallo definidos, diferente de un resultado ya medido.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Entrega docente: diagrama y configuraciones; no hay resultados de fallo ni pruebas negativas; portada afirma validación integral.

Los documentos permiten revisión de diseño, pero no sostienen validación integral. El estado de cada criterio debe ajustarse a su evidencia.

## 4. Práctica individual

Construye una tabla de cinco criterios con columnas diseñado, ejecutado, resultado y evidencia.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe distinguir el expediente del proyecto?

- A. El mayor porcentaje posible
- B. Una portada como prueba
- C. Solo la cantidad de archivos
- D. Diseño, ejecución y validación por criterio

### Pregunta 2

¿Qué falta para la validación integral alegada?

- A. Eliminar la matriz de criterios
- B. Una copia del mismo diagrama
- C. Resultados de fallo y pruebas negativas, entre otras evidencias
- D. Un título más largo

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
