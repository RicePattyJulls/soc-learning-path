# RED-M34-L02 — Pruebas L2 y L3

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M34-L02","moduleId":"RED-M34","stageId":"RED-E06","objective":"Separar políticas L2/L3 y probar la ruta de enforcement.","prerequisites":["RED-M34-L01"],"referenceIds":["NIST-TEST","NIST-ZT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M34-L02-Q01","RED-M34-L02-Q02"],"practiceId":"RED-M34-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M34-L02.md"} -->

## 1. Objetivo

Separar políticas L2/L3 y probar la ruta de enforcement.

Prerrequisitos: [RED-M34-L01](../RED-E06/RED-M34-L01.md).

## 2. Comprende el mecanismo

Un control L2 puede actuar en el puerto o VLAN; uno L3/L4 sobre direcciones y servicios; otros añaden identidad o aplicación. La misma falta de respuesta puede deberse a VLAN, routing, firewall o servicio inactivo. Sigue el punto de enforcement real y los contadores de la regla pertinente. Una ruta alternativa puede eludir el control previsto. Probar L2 no requiere introducir ataques de envenenamiento ni provocar una tormenta: en esta fase se comparan estados y resultados docentes.

### Vocabulario de apoyo

- **Control positivo y negativo**: Prueba que debe pasar y prueba que debe denegarse para contrastar el método y la política.
- **Incumplimiento e impacto**: Observación contraria a un requisito y consecuencia demostrada, limitada a la evidencia del ensayo.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: flujo prohibido alcanza servidor; firewall esperado no registra paso; ruta del origen usa otro gateway sin ese firewall.

El ensayo revela un camino que evita el punto de control. No demuestra que la regla interna del firewall haya permitido el flujo.

## 4. Práctica individual

Corrige el diseño y propone una repetición que compruebe el camino y la decisión.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe observarse además del resultado final?

- A. Solo la dirección de destino, sin la ruta seleccionada
- B. Solo la pertenencia del origen a una VLAN, sin contadores del control
- C. El punto de enforcement y camino efectivos
- D. Solo que la regla exista en configuración, sin saber si el flujo la cruza

### Pregunta 2

¿Qué problema demuestra el caso?

- A. Un camino que evita el firewall previsto
- B. Una regla de ese firewall permitiendo con certeza
- C. Una ausencia total de routing
- D. Un servidor inactivo

## 6. Aplicación profesional

- SOC: Observar los eventos generados por las pruebas.
- Red Team autorizado: Competencia central de validación de controles.
- Evidencia del módulo: Matriz expected/observed y corroboración de logs.
- Criterio del módulo: Valida al menos dos controles con pruebas reversibles.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L17](../../05_RECURSOS/LABORATORIOS/RED-L17.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
