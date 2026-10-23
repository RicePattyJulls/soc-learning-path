# RED-M20-L02 — Dominios de fallo

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M20-L02","moduleId":"RED-M20","stageId":"RED-E04","objective":"Identificar dependencias que producen fallos comunes.","prerequisites":["RED-M20-L01"],"referenceIds":["NIST-ZT","RFC7348"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M20-L02-Q01","RED-M20-L02-Q02"],"practiceId":"RED-M20-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M20-L02.md"} -->

## 1. Objetivo

Identificar dependencias que producen fallos comunes.

Prerrequisitos: [RED-M20-L01](../RED-E04/RED-M20-L01.md).

## 2. Comprende el mecanismo

Un dominio de fallo agrupa componentes afectados por un mismo incidente. Dos enlaces pueden compartir alimentación, conducto, switch o plano de gestión. Analizar dependencias físicas y lógicas evita contar redundancia aparente. Documenta qué servicios sobreviven a perder un componente y cuáles comparten una dependencia crítica. La segmentación limita propagación de ciertos problemas, pero no elimina un fallo de una fuente de energía común. Una matriz de fallo debe incluir detección, impacto y forma de recuperación.

### Vocabulario de apoyo

- **Campus y núcleo colapsado**: Red de una sede y diseño que combina responsabilidades de distribución y núcleo.
- **DMZ y dominio de fallo**: Zona de funciones expuestas con política explícita y conjunto afectado por una dependencia común.
- **PDU**: Unidad que distribuye alimentación eléctrica a equipos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Diseño docente: dos switches de acceso conectados a dos equipos de distribución, pero todos usan una sola PDU sin respaldo.

La topología tiene caminos redundantes, pero la alimentación es un dominio compartido que puede anularlos simultáneamente.

## 4. Práctica individual

Añade una segunda PDU. ¿Qué comprobarías para no declarar independencia solo por disponer de dos cajas?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué caracteriza un fallo común?

- A. Una dependencia compartida afecta varios componentes
- B. El uso de tablas MAC
- C. Una red con dos prefijos
- D. Dos nombres de equipo distintos

### Pregunta 2

¿Qué dependencia compartida está demostrada?

- A. La independencia eléctrica inferida de los enlaces redundantes
- B. La pérdida obligatoria de routing por usar dos distribuciones
- C. La PDU única
- D. Dos circuitos de energía separados que no se han documentado

## 6. Aplicación profesional

- SOC: Definir sensores y puntos de correlación.
- Red Team autorizado: Delimitar superficies y rutas críticas.
- Evidencia del módulo: Diagrama L2/L3, matriz de tráfico y riesgos.
- Criterio del módulo: Sin solapamientos, SPOF explícitos y ruta de administración.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L10](../../05_RECURSOS/LABORATORIOS/RED-L10.md)
- [Guía de laboratorio RED-L12](../../05_RECURSOS/LABORATORIOS/RED-L12.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **RFC7348**: [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html). Overlay Ethernet sobre infraestructura IP y contexto de VNI.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
