# RED-M24-L02 — RADIUS/802.1X

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M24-L02","moduleId":"RED-M24","stageId":"RED-E04","objective":"Diagnosticar EAP-TLS mediante confianza, identidad y tiempo.","prerequisites":["RED-M24-L01"],"referenceIds":["WLAN","WPA3","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M24-L02-Q01","RED-M24-L02-Q02"],"practiceId":"RED-M24-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M24-L02.md"} -->

## 1. Objetivo

Diagnosticar EAP-TLS mediante confianza, identidad y tiempo.

Prerrequisitos: [RED-M24-L01](../RED-E04/RED-M24-L01.md).

## 2. Comprende el mecanismo

En EAP-TLS los certificados y su validación contribuyen a autenticar participantes según el diseño. Verificar el servidor evita aceptar un impostor solo por anunciar el mismo SSID. Validez temporal, cadena de confianza, identidad esperada y política del método pueden causar rechazos diferentes. RADIUS transporta resultados de autenticación/autorización entre componentes, pero su Access-Accept no garantiza que el AP haya aplicado correctamente el rol. Conservar errores específicos y tiempo es más útil que desactivar validación como arreglo general.

### Vocabulario de apoyo

- **PMF**: Protección de determinadas tramas de gestión cuando está negociada y soportada.
- **EAP-TLS y RADIUS**: Método de autenticación basado en TLS y protocolo de comunicación con el backend AAA.
- **Modo de transición**: Perfil que permite combinaciones de compatibilidad; se verifica la negociación de cada cliente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: AP accesible; cliente rechaza el nombre del servidor EAP; certificado válido para otra identidad.

La validación de identidad está detectando una incoherencia. Revisar configuración y certificado previsto, no instruir al usuario a confiar ciegamente.

## 4. Práctica individual

El certificado es correcto y el reloj del cliente está un año adelantado. Explica la siguiente comprobación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué protege validar el servidor EAP?

- A. El espacio de disco del cliente
- B. La capacidad RF automáticamente
- C. Una ruta BGP completa
- D. La confianza en la identidad del servidor de autenticación

### Pregunta 2

¿Qué explica el rechazo del caso?

- A. Un cable de consola desconectado necesariamente
- B. El AP nunca anunció el SSID
- C. La identidad del certificado no coincide con la esperada
- D. DHCP agotado demostrado

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
