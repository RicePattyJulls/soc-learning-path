# RED-M18-L03 — MPLS como servicio

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M18-L03","moduleId":"RED-M18","stageId":"RED-E03","objective":"Entender MPLS como servicio sin equipararlo a cifrado.","prerequisites":["RED-M18-L02"],"referenceIds":["RFC4301","RFC3031"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M18-L03-Q01","RED-M18-L03-Q02"],"practiceId":"RED-M18-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M18-L03.md"} -->

## 1. Objetivo

Entender MPLS como servicio sin equipararlo a cifrado.

Prerrequisitos: [RED-M18-L02](../RED-E03/RED-M18-L02.md).

## 2. Comprende el mecanismo

MPLS utiliza etiquetas y decisiones de forwarding en un dominio. En un servicio VPN del proveedor, contextos de routing y señalización pueden separar clientes, pero esa separación no implica cifrar su contenido. El cliente debe conocer qué entrega el operador: prefijos, clases, redundancia, acceso y visibilidad. La etiqueta de un tramo no es una identidad universal de usuario. Un servicio empresarial puede requerir cifrado adicional, verificación de rutas y pruebas de MTU aunque el transporte esté gestionado.

### Vocabulario de apoyo

- **Underlay y overlay**: Transporte base y conectividad lógica construida sobre él.
- **GRE, IKE y ESP**: Encapsulación de túnel, negociación de asociaciones y transporte protegido de IPsec.
- **SLA y jitter**: Condiciones contractuales de servicio y variación de demora según el método de medida.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Requisito docente: datos confidenciales entre sedes; proveedor ofrece MPLS VPN sin afirmar cifrado del payload.

La separación de clientes no satisface por sí sola el requisito de confidencialidad frente al transporte. Hace falta definir protección y confianza adicionales.

## 4. Práctica individual

El proveedor oculta saltos del núcleo en traceroute. ¿Demuestra eso ausencia de routers intermedios?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué usa MPLS para forwarding en su dominio?

- A. El nombre DNS completo de cada aplicación como etiqueta universal
- B. Solo las direcciones MAC del cliente a través de todo el núcleo
- C. Etiquetas
- D. La identidad autenticada del usuario final como criterio obligatorio de cada salto

### Pregunta 2

¿Qué falta verificar para que el payload quede cifrado frente al transporte del caso?

- A. Solo ocultar los saltos del núcleo en traceroute
- B. Solo que el servicio se denomine MPLS VPN
- C. Solo separación de tablas de routing del proveedor
- D. Cifrado efectivo entre los extremos definidos por el requisito

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
