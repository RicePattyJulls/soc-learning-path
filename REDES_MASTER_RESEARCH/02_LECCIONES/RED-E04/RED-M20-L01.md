# RED-M20-L01 — Modelo jerárquico

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M20-L01","moduleId":"RED-M20","stageId":"RED-E04","objective":"Elegir una arquitectura de campus por requisitos y escala.","prerequisites":["RED-M09-L04","RED-M10-L04","RED-M12-L04","RED-M16-L04"],"referenceIds":["NIST-ZT","RFC7348"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M20-L01-Q01","RED-M20-L01-Q02"],"practiceId":"RED-M20-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M20-L01.md"} -->

## 1. Objetivo

Elegir una arquitectura de campus por requisitos y escala.

Prerrequisitos: [RED-M09-L04](../RED-E02/RED-M09-L04.md), [RED-M10-L04](../RED-E02/RED-M10-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M16-L04](../RED-E03/RED-M16-L04.md).

## 2. Comprende el mecanismo

Acceso conecta extremos; distribución agrega funciones y políticas; núcleo transporta entre bloques. Un campus pequeño puede combinar distribución y núcleo, pero eso no elimina sus responsabilidades. Spine-leaf responde a otros patrones de conectividad y crecimiento y no debe elegirse solo por parecer moderno. VXLAN encapsula redes sobre IP y requiere underlay operativo y una MTU adecuada; no equivale por sí solo a una política de acceso. Diseñar significa justificar flujos, límites operativos y complejidad que el equipo puede mantener.

### Vocabulario de apoyo

- **Campus y núcleo colapsado**: Red de una sede y diseño que combina responsabilidades de distribución y núcleo.
- **DMZ y dominio de fallo**: Zona de funciones expuestas con política explícita y conjunto afectado por una dependencia común.
- **PDU**: Unidad que distribuye alimentación eléctrica a equipos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: una sede, dos edificios, 120 extremos y equipo de operación pequeño; propuesta añade varias fabrics sin un requisito de escala identificado.

La complejidad no está justificada por la información disponible. Comparar un diseño de núcleo colapsado y sus límites permite una decisión proporcional.

## 4. Práctica individual

La sede crece a diez edificios. Enumera dos requisitos nuevos a obtener antes de reutilizar el diseño pequeño.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué función cumple la distribución?

- A. Eliminar el plano de control
- B. Sustituir la gestión de identidades
- C. Cifrar todas las aplicaciones por definición
- D. Agregar bloques de acceso y funciones de política según diseño

### Pregunta 2

¿Qué falta para justificar las fabrics del caso?

- A. Solo conocer la cantidad de switches sin los flujos ni disponibilidad requerida
- B. La disponibilidad de funciones avanzadas como justificación suficiente para activarlas todas
- C. Un requisito que compense su complejidad y coste operativo
- D. La preferencia del proveedor sin requisitos de operación o escala

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
