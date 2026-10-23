# RED-M23-L04 — Políticas NAC y excepciones

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M23-L04","moduleId":"RED-M23","stageId":"RED-E04","objective":"Diseñar excepciones NAC sin convertirlas en un bypass permanente.","prerequisites":["RED-M23-L03"],"referenceIds":["DAI","RFC3580","RFC8907","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M23-L04-Q01","RED-M23-L04-Q02"],"practiceId":"RED-M23-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M23-L04.md"} -->

## 1. Objetivo

Diseñar excepciones NAC sin convertirlas en un bypass permanente.

Prerrequisitos: [RED-M23-L03](../RED-E04/RED-M23-L03.md).

## 2. Comprende el mecanismo

Una política NAC combina identidad, tipo de equipo, postura y contexto según producto. Excepciones para impresoras o dispositivos sin supplicant necesitan alcance, propietario y revisión. MAB reconoce una MAC declarada, no aporta las garantías de un método criptográfico de autenticación. Definir comportamiento cuando falla AAA es una decisión de disponibilidad y riesgo: fail-open y fail-closed tienen consecuencias que deben ensayarse. Una VLAN de cuarentena necesita permitir los servicios de remediación y bloquear lo demás según el objetivo.

### Vocabulario de apoyo

- **Binding y DAI**: Relación autorizada de IP/MAC/puerto y validación de ARP contra información de confianza.
- **Supplicant y authenticator**: Extremo que solicita admisión 802.1X y equipo que controla el acceso.
- **NAC y MAB**: Política de admisión contextual y reconocimiento de una MAC declarada, con garantías distintas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Excepción docente: impresora identificada por MAC recibe acceso a servidores de impresión; regla actual le permite administrar switches.

El permiso excede la función de la excepción. Identificar por MAC no justifica acceso administrativo a infraestructura.

## 4. Práctica individual

El servidor NAC deja de responder. Define una prueba para comprobar la política de contingencia acordada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué garantía no proporciona MAB por sí solo?

- A. Un dato para la política
- B. Comparación de una MAC declarada
- C. Una forma de clasificación
- D. Autenticación criptográfica fuerte de la identidad

### Pregunta 2

¿Qué debe limitarse en la excepción del caso?

- A. El acceso a la función de impresión necesaria
- B. La longitud de los logs
- C. El horario del resolver ajeno
- D. Solo el nombre de la impresora

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
