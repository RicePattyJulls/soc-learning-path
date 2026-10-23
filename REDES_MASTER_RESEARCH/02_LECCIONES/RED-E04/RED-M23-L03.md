# RED-M23-L03 — 802.1X y RADIUS/TACACS+

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M23-L03","moduleId":"RED-M23","stageId":"RED-E04","objective":"Distinguir los participantes 802.1X y el papel de AAA.","prerequisites":["RED-M23-L02"],"referenceIds":["DAI","RFC3580","RFC8907","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M23-L03-Q01","RED-M23-L03-Q02"],"practiceId":"RED-M23-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M23-L03.md"} -->

## 1. Objetivo

Distinguir los participantes 802.1X y el papel de AAA.

Prerrequisitos: [RED-M23-L02](../RED-E04/RED-M23-L02.md).

## 2. Comprende el mecanismo

802.1X controla admisión con supplicant, authenticator y servidor de autenticación, normalmente usando EAP y un backend RADIUS. El switch o AP no tiene que ser quien valide por sí solo todos los métodos de identidad. TACACS+ se asocia frecuentemente a administración de dispositivos y no debe reemplazar conceptualmente a RADIUS como si todo flujo fuera idéntico. EAP-TLS requiere confianza y validación de certificados apropiadas. MACsec protege un enlace cuando está implementado y configurado; no sustituye autorización de aplicación.

### Vocabulario de apoyo

- **Binding y DAI**: Relación autorizada de IP/MAC/puerto y validación de ARP contra información de confianza.
- **Supplicant y authenticator**: Extremo que solicita admisión 802.1X y equipo que controla el acceso.
- **NAC y MAB**: Política de admisión contextual y reconocimiento de una MAC declarada, con garantías distintas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: cliente entrega EAP al switch; switch consulta RADIUS; servidor acepta identidad pero asigna rol restringido.

Autenticación aceptada y acceso limitado son compatibles. El authenticator debe aplicar el resultado autorizado, no convertir todo Accept en permiso universal.

## 4. Práctica individual

Identifica el componente que debe aplicar una VLAN o política devuelta al switch en el caso.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué componente representa al extremo que solicita acceso?

- A. El supplicant
- B. El ASBR necesariamente
- C. El servidor MX
- D. El reflector BGP

### Pregunta 2

¿Qué implica Accept con rol restringido?

- A. Identidad aceptada con autorización limitada
- B. Ausencia de políticas
- C. Acceso ilimitado por definición
- D. Todas las VLAN cifradas

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
