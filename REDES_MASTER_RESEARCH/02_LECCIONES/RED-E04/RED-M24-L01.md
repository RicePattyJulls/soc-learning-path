# RED-M24-L01 — WPA2/WPA3 y PMF

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M24-L01","moduleId":"RED-M24","stageId":"RED-E04","objective":"Interpretar WPA2/WPA3, perfiles y protección de gestión.","prerequisites":["RED-M11-L04","RED-M21-L04","RED-M23-L04"],"referenceIds":["WLAN","WPA3","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M24-L01-Q01","RED-M24-L01-Q02"],"practiceId":"RED-M24-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M24-L01.md"} -->

## 1. Objetivo

Interpretar WPA2/WPA3, perfiles y protección de gestión.

Prerrequisitos: [RED-M11-L04](../RED-E02/RED-M11-L04.md), [RED-M21-L04](../RED-E04/RED-M21-L04.md), [RED-M23-L04](../RED-E04/RED-M23-L04.md).

## 2. Comprende el mecanismo

La seguridad WLAN depende del modo negociado, capacidades de AP/cliente y configuración. WPA3-Personal y Enterprise no son el mismo método de autenticación; Enterprise incluye perfiles y un modo de 192 bits que no debe confundirse con todo WPA3-Enterprise. PMF protege determinadas tramas de gestión, no elimina interferencia de radio ni protege cada tipo de trama sin distinción. Los modos de transición cambian compatibilidad y garantías por conexión. Revisar el estado efectivo del cliente, no solo la etiqueta del SSID.

### Vocabulario de apoyo

- **PMF**: Protección de determinadas tramas de gestión cuando está negociada y soportada.
- **EAP-TLS y RADIUS**: Método de autenticación basado en TLS y protocolo de comunicación con el backend AAA.
- **Modo de transición**: Perfil que permite combinaciones de compatibilidad; se verifica la negociación de cada cliente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Inventario docente: SSID en transición; cliente A conecta con modo antiguo permitido; cliente B negocia WPA3 con PMF.

Los dos clientes no tienen necesariamente las mismas garantías aunque vean el mismo nombre de red. La configuración permite negociaciones distintas.

## 4. Práctica individual

Un informe afirma que PMF evita todo bloqueo de radio. Corrige el alcance de esa afirmación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no implica todo WPA3-Enterprise?

- A. Un perfil de seguridad empresarial
- B. Usar obligatoriamente el modo de 192 bits
- C. Configuración de autenticación
- D. Necesidad de compatibilidad del cliente

### Pregunta 2

¿Qué debe compararse en el caso?

- A. Solo que ambos clientes hayan recibido una dirección DHCP
- B. El modo realmente negociado por cada cliente
- C. Solo el perfil anunciado por el SSID, sin estado de los clientes
- D. Solo el modelo del AP, sin comprobar negociación

## 6. Aplicación profesional

- SOC: Correlacionar autenticación y tráfico WLAN.
- Red Team autorizado: Pruebas únicamente en equipos propios.
- Evidencia del módulo: Flujo 802.1X, logs y topología SSID-VLAN.
- Criterio del módulo: Distingue fallo RF, auth y direccionamiento.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L11](../../05_RECURSOS/LABORATORIOS/RED-L11.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **WLAN**: [IEEE 802.11 Working Group](https://www.ieee802.org/11/). Familia de estándares y alcance; no verificación del texto completo de todas las normas.
- **WPA3**: [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html). Modos WPA2/WPA3, PMF y soporte; requisitos de configuración de la familia descrita.
- **RFC9190**: [RFC 9190: EAP-TLS 1.3](https://www.rfc-editor.org/rfc/rfc9190.html). Identidad, confianza y certificados en EAP-TLS.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
