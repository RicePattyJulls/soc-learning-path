# RED-M23-L02 — DAI/IP Source Guard

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M23-L02","moduleId":"RED-M23","stageId":"RED-E04","objective":"Evaluar dependencias de DAI, IP Source Guard y protección IPv6.","prerequisites":["RED-M23-L01"],"referenceIds":["DAI","RFC3580","RFC8907","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M23-L02-Q01","RED-M23-L02-Q02"],"practiceId":"RED-M23-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M23-L02.md"} -->

## 1. Objetivo

Evaluar dependencias de DAI, IP Source Guard y protección IPv6.

Prerrequisitos: [RED-M23-L01](../RED-E04/RED-M23-L01.md).

## 2. Comprende el mecanismo

DAI inspecciona ARP contra información autorizada; IP Source Guard puede filtrar por bindings de IP/MAC/puerto según soporte. Clientes estáticos necesitan tratamiento específico si no aparecen en bindings DHCP. No son mecanismos intercambiables con protección de RA en IPv6. RA Guard limita anuncios de router en puertos pertinentes; sus capacidades frente a formatos y extensiones requieren revisar implementación. Storm control atiende tasas de tráfico de ciertos tipos, no autentica por sí mismo ARP o RA.

### Vocabulario de apoyo

- **Binding y DAI**: Relación autorizada de IP/MAC/puerto y validación de ARP contra información de confianza.
- **Supplicant y authenticator**: Extremo que solicita admisión 802.1X y equipo que controla el acceso.
- **NAC y MAB**: Política de admisión contextual y reconocimiento de una MAC declarada, con garantías distintas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cliente estático autorizado no tiene binding; DAI rechaza su ARP en el puerto protegido; inventario confirma asignación.

La ausencia en la base de validación puede explicar el falso bloqueo. Resolver excepciones controladas sin declarar que todo ARP del cliente es malicioso.

## 4. Práctica individual

Se activa DAI y queda IPv6 con anuncios RA no controlados. ¿Qué cobertura no debe declararse?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué información puede necesitar DAI?

- A. Solo la tabla MAC aprendida como autorización de toda relación IP/MAC
- B. Solo la ruta por defecto del cliente para autenticar ARP
- C. Bindings o reglas autorizadas para validar ARP
- D. Únicamente el total de broadcasts, sin base de asignaciones

### Pregunta 2

¿Qué causa alternativa explica el bloqueo estático?

- A. Falta de binding compatible con la política
- B. Un ataque confirmado automáticamente
- C. Una ventana TCP cero
- D. El uso de IPv4 demuestra fallo físico

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
