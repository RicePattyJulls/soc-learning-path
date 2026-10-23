# RED-M34-L03 — Wi-Fi y policy

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M34-L03","moduleId":"RED-M34","stageId":"RED-E06","objective":"Evaluar políticas de acceso WLAN/NAC sin confundir autenticación y autorización.","prerequisites":["RED-M34-L02"],"referenceIds":["NIST-TEST","NIST-ZT"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M34-L03-Q01","RED-M34-L03-Q02"],"practiceId":"RED-M34-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M34-L03.md"} -->

## 1. Objetivo

Evaluar políticas de acceso WLAN/NAC sin confundir autenticación y autorización.

Prerrequisitos: [RED-M34-L02](../RED-E06/RED-M34-L02.md).

## 2. Comprende el mecanismo

Para un control Wi-Fi o NAC define la identidad o tipo de equipo, método, postura, rol y servicios esperados. Acceder al SSID o recibir un Accept no demuestra que se aplicó la VLAN o regla correcta. Prueba un usuario permitido, otro con permisos limitados y una condición de fallo acordada; no usar identidades ajenas. La postura y el fallback son comportamientos de producto que requieren evidencia de su configuración y resultado. Las pruebas de radio necesitan permisos y aislamiento propios, distintos de un ejercicio documental.

### Vocabulario de apoyo

- **Control positivo y negativo**: Prueba que debe pasar y prueba que debe denegarse para contrastar el método y la política.
- **Incumplimiento e impacto**: Observación contraria a un requisito y consecuencia demostrada, limitada a la evidencia del ensayo.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: usuario invitado autentica; rol asignado permite Internet, pero también administración de switches, que la matriz prohíbe.

La autenticación no es el defecto: la autorización efectiva excede el rol. El informe debe identificar el flujo que viola política y el enforcement responsable.

## 4. Práctica individual

El usuario de empleados accede a gestión y el invitado no. Define qué dato evita confundir ambos ensayos.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe probarse después de autenticar?

- A. Solo que el SSID tenga nombre
- B. La sustitución de todas las ACL
- C. Autorización efectiva de los servicios según el rol
- D. Que cualquier recurso esté abierto

### Pregunta 2

¿Dónde está el defecto del invitado?

- A. En el hecho de usar Internet autorizado
- B. En haber autenticado correctamente
- C. En no existir un usuario de empleados
- D. En la autorización que permite gestión no prevista

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
