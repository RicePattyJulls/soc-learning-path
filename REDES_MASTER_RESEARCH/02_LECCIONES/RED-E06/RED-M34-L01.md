# RED-M34-L01 — Casos permitidos/negados

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M34-L01","moduleId":"RED-M34","stageId":"RED-E06","objective":"Construir una matriz de acceso con controles positivos y negativos.","prerequisites":["RED-M23-L04","RED-M24-L04","RED-M33-L04"],"referenceIds":["NIST-TEST","NIST-ZT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M34-L01-Q01","RED-M34-L01-Q02"],"practiceId":"RED-M34-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M34-L01.md"} -->

## 1. Objetivo

Construir una matriz de acceso con controles positivos y negativos.

Prerrequisitos: [RED-M23-L04](../RED-E04/RED-M23-L04.md), [RED-M24-L04](../RED-E04/RED-M24-L04.md), [RED-M33-L04](../RED-E06/RED-M33-L04.md).

## 2. Comprende el mecanismo

Cada prueba de acceso necesita origen, destino, protocolo/puerto, condición de identidad si aplica, resultado esperado y evidencia. Un control positivo demuestra que el método puede observar un flujo permitido; uno negativo que detecta una denegación prevista. Si todos los intentos fallan, no puedes atribuir el éxito a segmentación sin verificar conectividad básica y servicios. Distingue permitido por política, observado en tránsito y aceptado por aplicación. Los ejercicios se resuelven sobre topologías y resultados sintéticos declarados.

### Vocabulario de apoyo

- **Control positivo y negativo**: Prueba que debe pasar y prueba que debe denegarse para contrastar el método y la política.
- **Incumplimiento e impacto**: Observación contraria a un requisito y consecuencia demostrada, limitada a la evidencia del ensayo.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Matriz docente: A→web:443 permitido responde; A→DB:5432 denegado; firewall registra deny coincidente al segundo flujo.

La prueba positiva valida parte del método y la negativa tiene corroboración del control. La conclusión aplica a esos flujos, no a todos los caminos posibles.

## 4. Práctica individual

Los dos flujos dan timeout y no hay logs. Explica qué conclusión debe evitarse.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Por qué incluir una prueba permitida?

- A. Para confirmar identidad humana sin otras fuentes
- B. Para eliminar la prueba negativa
- C. Para autorizar toda la red
- D. Para comprobar que el método puede observar conectividad válida

### Pregunta 2

¿Qué respalda la denegación del segundo flujo?

- A. Una regla planeada no aplicada
- B. El éxito de cualquier ping ajeno
- C. Deny coincidente del control previsto
- D. Solo la etiqueta DB

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
