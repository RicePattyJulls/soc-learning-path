# RED-M20-L04 — Alta disponibilidad y crecimiento

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M20-L04","moduleId":"RED-M20","stageId":"RED-E04","objective":"Dimensionar crecimiento y disponibilidad bajo fallos definidos.","prerequisites":["RED-M20-L03"],"referenceIds":["NIST-ZT","RFC7348"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M20-L04-Q01","RED-M20-L04-Q02"],"practiceId":"RED-M20-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M20-L04.md"} -->

## 1. Objetivo

Dimensionar crecimiento y disponibilidad bajo fallos definidos.

Prerrequisitos: [RED-M20-L03](../RED-E04/RED-M20-L03.md).

## 2. Comprende el mecanismo

Alta disponibilidad exige capacidad y operabilidad cuando falla una parte, no solo capacidad total en condiciones ideales. Considera puertos, enlaces, energía, tablas, licencias aplicables y habilidades del equipo. La capacidad restante tras un fallo puede ser menor que la demanda aunque haya caminos alternativos. Las fabrics y overlays añaden ventajas y dependencias; LISP o VXLAN son mecanismos concretos, no garantías universales de resiliencia. Documenta margen, crecimiento previsto y límites que disparan una revisión.

### Vocabulario de apoyo

- **Campus y núcleo colapsado**: Red de una sede y diseño que combina responsabilidades de distribución y núcleo.
- **DMZ y dominio de fallo**: Zona de funciones expuestas con política explícita y conjunto afectado por una dependencia común.
- **PDU**: Unidad que distribuye alimentación eléctrica a equipos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Demanda pico docente=7 Gb/s; dos uplinks de 5 Gb/s; capacidad normal=10 Gb/s; al fallar uno quedan 5.

Existe continuidad de camino, pero no capacidad para sostener todo el pico tras el fallo. Se necesita más capacidad o degradación priorizada aceptada.

## 4. Práctica individual

Propón un criterio de aceptación para esa degradación sin prometer servicio idéntico.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe evaluarse además de capacidad normal?

- A. Solo el número de caminos, suponiendo que cada uno sostiene el pico
- B. Capacidad remanente durante el fallo previsto
- C. Solo la velocidad nominal sin demanda de aplicaciones
- D. Solo la capacidad agregada con todos los enlaces activos

### Pregunta 2

¿Satisface 5 Gb/s remanentes una demanda de 7 sin degradación?

- A. Sí porque hay una ruta
- B. Sí por usar un agregado
- C. No porque IP no admite redundancia
- D. No, falta capacidad para ese pico

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
