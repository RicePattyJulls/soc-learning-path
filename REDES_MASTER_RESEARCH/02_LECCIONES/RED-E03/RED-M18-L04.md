# RED-M18-L04 — SD-WAN y políticas

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M18-L04","moduleId":"RED-M18","stageId":"RED-E03","objective":"Separar underlay, overlay y decisiones de política SD-WAN.","prerequisites":["RED-M18-L03"],"referenceIds":["RFC4301","RFC3031"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M18-L04-Q01","RED-M18-L04-Q02"],"practiceId":"RED-M18-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M18-L04.md"} -->

## 1. Objetivo

Separar underlay, overlay y decisiones de política SD-WAN.

Prerrequisitos: [RED-M18-L03](../RED-E03/RED-M18-L03.md).

## 2. Comprende el mecanismo

El underlay proporciona conectividad de transporte; el overlay construye conectividad lógica sobre él. SD-WAN añade control y políticas de selección de caminos, con funciones concretas según solución. Un controlador accesible no demuestra que cada túnel de datos esté sano. La política puede considerar pérdida, latencia y jitter para dirigir una aplicación, pero necesita mediciones válidas y umbrales que eviten oscilación. Dos túneles sobre el mismo acceso no eliminan su dependencia física común. DMVPN es otra tecnología de diseño y no sinónimo general de SD-WAN.

### Vocabulario de apoyo

- **Underlay y overlay**: Transporte base y conectividad lógica construida sobre él.
- **GRE, IKE y ESP**: Encapsulación de túnel, negociación de asociaciones y transporte protegido de IPsec.
- **SLA y jitter**: Condiciones contractuales de servicio y variación de demora según el método de medida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Política docente: voz usa enlace A si jitter<20 ms; medición sube a 50 ms; enlace B está disponible con 10 ms.

La intención es seleccionar B conforme a la política, si sus otras condiciones se cumplen. Debe observarse el flujo efectivo y retorno, no solo el panel de control.

## 4. Práctica individual

Ambos overlays caen al desconectar un único cable WAN. Identifica el dominio de fallo compartido.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué función cumple el underlay?

- A. Producir una única VLAN obligatoria
- B. Sustituir todas las políticas
- C. Garantizar identidad de todos los usuarios
- D. Dar conectividad de transporte al overlay

### Pregunta 2

¿Qué camino pretende usar la política del caso?

- A. El controlador como payload necesariamente
- B. A siempre por su nombre
- C. Ninguno porque voz no usa red
- D. B por cumplir mejor el umbral de jitter dado

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
