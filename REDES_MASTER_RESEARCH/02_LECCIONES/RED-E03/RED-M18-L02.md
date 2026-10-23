# RED-M18-L02 — IPsec/TLS y GRE

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M18-L02","moduleId":"RED-M18","stageId":"RED-E03","objective":"Comparar protección de túnel, establecimiento y encapsulación.","prerequisites":["RED-M18-L01"],"referenceIds":["RFC4301","RFC3031"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M18-L02-Q01","RED-M18-L02-Q02"],"practiceId":"RED-M18-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M18-L02.md"} -->

## 1. Objetivo

Comparar protección de túnel, establecimiento y encapsulación.

Prerrequisitos: [RED-M18-L01](../RED-E03/RED-M18-L01.md).

## 2. Comprende el mecanismo

GRE encapsula tráfico y no aporta por sí solo cifrado. IPsec define protección a nivel IP; IKEv2 negocia parámetros y asociaciones, y ESP transporta tráfico protegido según el modo. Una SA establecida no demuestra que selectores, rutas y retorno permitan el tráfico previsto. VPN basadas en TLS tienen otro contexto de aplicación y plataforma. Cada cabecera consume espacio: MTU y MSS deben contemplar el túnel. No confundir que un túnel esté activo con autorización ilimitada entre sus redes.

### Vocabulario de apoyo

- **Underlay y overlay**: Transporte base y conectividad lógica construida sobre él.
- **GRE, IKE y ESP**: Encapsulación de túnel, negociación de asociaciones y transporte protegido de IPsec.
- **SLA y jitter**: Condiciones contractuales de servicio y variación de demora según el método de medida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: IKE SA activa; contador ESP de salida aumenta; entrada=0; prefijo remoto solo tiene ruta de ida.

Existe negociación y salida, pero no evidencia de retorno protegido. Revisar camino remoto, selectores y políticas antes de regenerar claves sin motivo.

## 4. Práctica individual

Se necesita confidencialidad sobre un túnel GRE. Explica qué condición adicional comprobar.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no proporciona GRE por sí solo?

- A. Un encabezado adicional
- B. Encapsulación
- C. Cifrado
- D. Un contexto de túnel

### Pregunta 2

¿Qué no acredita IKE SA activa en el caso?

- A. Que existe estado de control
- B. Que se acordaron parámetros de esa SA
- C. Que hubo negociación IKE
- D. Que el tráfico esperado circule correctamente en ambos sentidos

## 6. Aplicación profesional

- SOC: Investigar cambios de origen y túnel.
- Red Team autorizado: Identificar exposición de management/WAN lab.
- Evidencia del módulo: Diseño, dependencia de rutas y plan de diagnóstico.
- Criterio del módulo: Explica seguridad/cifrado y rutas sin falsas garantías.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L09](../../05_RECURSOS/LABORATORIOS/RED-L09.md)
- [Guía de laboratorio RED-L12](../../05_RECURSOS/LABORATORIOS/RED-L12.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4301**: [RFC 4301: Security Architecture for the Internet Protocol](https://www.rfc-editor.org/rfc/rfc4301.html). Arquitectura IPsec y política; no prueba de un túnel concreto.
- **RFC3031**: [RFC 3031: Multiprotocol Label Switching Architecture](https://www.rfc-editor.org/rfc/rfc3031.html). Etiquetas y arquitectura MPLS; no confidencialidad automática.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
