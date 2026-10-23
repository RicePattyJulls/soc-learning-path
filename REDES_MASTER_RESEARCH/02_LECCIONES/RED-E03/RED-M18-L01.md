# RED-M18-L01 — WAN y proveedores

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M18-L01","moduleId":"RED-M18","stageId":"RED-E03","objective":"Definir responsabilidades y dependencias de una WAN.","prerequisites":["RED-M12-L04","RED-M17-L04"],"referenceIds":["RFC4301","RFC3031"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M18-L01-Q01","RED-M18-L01-Q02"],"practiceId":"RED-M18-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M18-L01.md"} -->

## 1. Objetivo

Definir responsabilidades y dependencias de una WAN.

Prerrequisitos: [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M17-L04](../RED-E03/RED-M17-L04.md).

## 2. Comprende el mecanismo

Una WAN conecta ubicaciones mediante servicios con capacidades y responsabilidades específicas. El enlace de acceso, red del proveedor, equipo del cliente y aplicación son dominios diferentes. Un SLA describe condiciones contractuales de medida; no equivale a una experiencia demostrada para cualquier flujo. Compartir proveedor, conducto o alimentación puede introducir un fallo común aunque existan dos enlaces lógicos. Documentar demarcación, MTU, direccionamiento, routing, gestión y escalado permite diagnosticar sin trasladar toda avería al operador.

### Vocabulario de apoyo

- **Underlay y overlay**: Transporte base y conectividad lógica construida sobre él.
- **GRE, IKE y ESP**: Encapsulación de túnel, negociación de asociaciones y transporte protegido de IPsec.
- **SLA y jitter**: Condiciones contractuales de servicio y variación de demora según el método de medida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Diseño docente: dos circuitos WAN de operadores distintos entran por el mismo conducto físico del edificio.

Hay diversidad comercial, pero un corte del conducto puede afectar ambos. La independencia física debe comprobarse y no inferirse por facturas diferentes.

## 4. Práctica individual

El acceso responde y falla el destino remoto. Define qué datos entregarías al proveedor para una investigación útil.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no garantiza contratar dos operadores?

- A. Disponer de dos servicios declarados
- B. Tener dos contratos distintos
- C. Poder definir responsables
- D. Independencia de todos los dominios físicos de fallo

### Pregunta 2

¿Cuál es el fallo común del ejemplo?

- A. Un prefijo /24 docente
- B. El uso de protocolos diferentes
- C. La existencia de un inventario
- D. El conducto físico compartido

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
