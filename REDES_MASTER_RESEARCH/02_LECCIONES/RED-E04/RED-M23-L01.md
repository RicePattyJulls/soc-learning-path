# RED-M23-L01 — Port security y DHCP snooping

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M23-L01","moduleId":"RED-M23","stageId":"RED-E04","objective":"Relacionar controles de puerto y validación de DHCP.","prerequisites":["RED-M07-L04","RED-M09-L04","RED-M22-L04"],"referenceIds":["DAI","RFC3580","RFC8907","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M23-L01-Q01","RED-M23-L01-Q02"],"practiceId":"RED-M23-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M23-L01.md"} -->

## 1. Objetivo

Relacionar controles de puerto y validación de DHCP.

Prerrequisitos: [RED-M07-L04](../RED-E02/RED-M07-L04.md), [RED-M09-L04](../RED-E02/RED-M09-L04.md), [RED-M22-L04](../RED-E04/RED-M22-L04.md).

## 2. Comprende el mecanismo

Port security puede restringir MAC aprendidas y acciones ante exceso, pero una MAC no es una identidad fuerte. DHCP snooping distingue puertos confiables para respuestas de servidor y puede construir bindings de concesión. Configurar confianza en un puerto de usuario puede dejar pasar respuestas no autorizadas. Estos controles necesitan diseño para teléfonos, AP e hipervisores que concentran varios extremos. Registra qué ocurre al reiniciar, renovar concesión o mover un equipo; una función habilitada sin bindings adecuados puede bloquear uso legítimo.

### Vocabulario de apoyo

- **Binding y DAI**: Relación autorizada de IP/MAC/puerto y validación de ARP contra información de confianza.
- **Supplicant y authenticator**: Extremo que solicita admisión 802.1X y equipo que controla el acceso.
- **NAC y MAB**: Política de admisión contextual y reconocimiento de una MAC declarada, con garantías distintas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Topología docente: servidor DHCP por uplink; puerto de usuario p9 marcado trusted sin justificación; desde allí entra una oferta ajena.

La frontera de confianza está mal ubicada. El control no puede distinguir correctamente si el diseño confía en el puerto que recibe la respuesta no autorizada.

## 4. Práctica individual

Un puerto conecta un AP con varios clientes. ¿Por qué un límite de una MAC podría ser incorrecto?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no demuestra una MAC permitida?

- A. Identidad humana autenticada
- B. Un dato de capa 2
- C. Posible aprendizaje del puerto
- D. Coincidencia con esa dirección

### Pregunta 2

¿Qué debe corregirse en p9?

- A. La confianza DHCP injustificada del puerto de usuario
- B. El nombre del scope exclusivamente
- C. La versión de HTTP del cliente
- D. La existencia de un uplink

## 6. Aplicación profesional

- SOC: Investigar rechazados y posibles falsos positivos.
- Red Team autorizado: Comprobar control L2 con mínimo tráfico controlado.
- Evidencia del módulo: Estados de puerto, logs de auth y matriz de excepciones.
- Criterio del módulo: Cliente autorizado entra; rechazado no; logs explican.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L10](../../05_RECURSOS/LABORATORIOS/RED-L10.md)
- [Guía de laboratorio RED-L11](../../05_RECURSOS/LABORATORIOS/RED-L11.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **DAI**: [Troubleshoot DAI and IP Source Guard in Catalyst Switches](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html). Bindings, hosts estáticos y dependencias de los controles L2.
- **RFC3580**: [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580.html). Roles y relación entre admisión y backend AAA.
- **RFC8907**: [RFC 8907: The TACACS+ Protocol](https://www.rfc-editor.org/rfc/rfc8907.html). AAA de administración y límites de protección del protocolo.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
