# RED-M24-L04 — Visibilidad defensiva y errores RF

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M24-L04","moduleId":"RED-M24","stageId":"RED-E04","objective":"Combinar evidencia RF, autenticación y forwarding sin mezclarla.","prerequisites":["RED-M24-L03"],"referenceIds":["WLAN","WPA3","RFC9190"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M24-L04-Q01","RED-M24-L04-Q02"],"practiceId":"RED-M24-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M24-L04.md"} -->

## 1. Objetivo

Combinar evidencia RF, autenticación y forwarding sin mezclarla.

Prerrequisitos: [RED-M24-L03](../RED-E04/RED-M24-L03.md).

## 2. Comprende el mecanismo

La investigación WLAN necesita observaciones apropiadas para cada hipótesis: métricas de radio, asociación, autenticación, dirección y tráfico. Un puerto espejo cableado no muestra todos los eventos RF, y un adaptador en monitor tiene límites de canal, cifrado y posición. Una alerta de AP no autorizado requiere inventario y ubicación, no solo un SSID parecido. Conserva autorización y privacidad al diseñar pruebas radio. Los ejercicios sintéticos sirven para interpretar datos, no para demostrar que una antena real tenga cobertura medida.

### Vocabulario de apoyo

- **PMF**: Protección de determinadas tramas de gestión cuando está negociada y soportada.
- **EAP-TLS y RADIUS**: Método de autenticación basado en TLS y protocolo de comunicación con el backend AAA.
- **Modo de transición**: Perfil que permite combinaciones de compatibilidad; se verifica la negociación de cada cliente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: RSSI y SNR normales; RADIUS acepta; firewall registra deny tras asignación de un rol; aplicación falla.

La evidencia apunta a política posterior a autenticación, no a falta de cobertura. Correlacionar rol y flujo evita un cambio RF innecesario.

## 4. Práctica individual

El problema cambia a reintentos altos y caída de SNR sin rechazos de autenticación. Reformula una hipótesis.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no demuestra un espejo cableado?

- A. Un paquete observado en ese punto
- B. Tráfico que sí atraviesa ese enlace
- C. Toda la cobertura y actividad de radio
- D. Marcas temporales capturadas

### Pregunta 2

¿Qué evidencia pesa en el caso?

- A. La intensidad de señal como prueba suficiente de permiso de aplicación
- B. El deny del firewall después de aplicar el rol
- C. Que RADIUS acepte como prueba de todos los servicios permitidos
- D. La hipótesis de interferencia sin contrastarla con las medidas normales

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
