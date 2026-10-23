# RED-M24-L03 — SSID-VLAN y roaming

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M24-L03","moduleId":"RED-M24","stageId":"RED-E04","objective":"Seguir mapeos SSID, rol y VLAN durante un roaming.","prerequisites":["RED-M24-L02"],"referenceIds":["WLAN","WPA3","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M24-L03-Q01","RED-M24-L03-Q02"],"practiceId":"RED-M24-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M24-L03.md"} -->

## 1. Objetivo

Seguir mapeos SSID, rol y VLAN durante un roaming.

Prerrequisitos: [RED-M24-L02](../RED-E04/RED-M24-L02.md).

## 2. Comprende el mecanismo

Un SSID puede mapearse a VLAN o roles de forma estática o dinámica según el sistema. El mismo nombre anunciado por varios AP no garantiza idéntico backend o política. Durante roaming, cambios de VLAN/subred pueden afectar dirección y sesiones; la movilidad asistida requiere soporte coherente. Compara configuración del AP/controlador, autorización y estado efectivo del cliente antes/después. Un Access-Accept a una VLAN inexistente en el trunk produce un problema distinto de una autenticación rechazada.

### Vocabulario de apoyo

- **PMF**: Protección de determinadas tramas de gestión cuando está negociada y soportada.
- **EAP-TLS y RADIUS**: Método de autenticación basado en TLS y protocolo de comunicación con el backend AAA.
- **Modo de transición**: Perfil que permite combinaciones de compatibilidad; se verifica la negociación de cada cliente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> AP-A y AP-B anuncian el mismo SSID; autorización asigna VLAN30; trunk de AP-B no transporta VLAN30.

El cliente puede autenticarse y perder conectividad al moverse a B. El defecto observable está en el transporte de la VLAN autorizada.

## 4. Práctica individual

VLAN30 está permitida, pero AP-B usa otro ámbito de direccionamiento. Define el impacto que medirías.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe comprobarse además del SSID común al comparar el acceso de AP-A y AP-B?

- A. Solo que el cliente haya visto ambos anuncios
- B. Solo que ambas radios estén encendidas
- C. Solo que coincida el texto anunciado del SSID
- D. La política y conectividad efectivas de cada AP

### Pregunta 2

¿Qué falla en AP-B del ejemplo?

- A. El transporte de VLAN30 por el trunk
- B. La existencia del servidor RADIUS
- C. La resolución AAAA obligatoriamente
- D. La contraseña de todos los usuarios con certeza

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
