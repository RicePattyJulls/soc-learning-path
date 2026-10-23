# RED-M11-L04 — Diagnóstico de cliente inalámbrico

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M11-L04","moduleId":"RED-M11","stageId":"RED-E02","objective":"Localizar el fallo WLAN por fase del acceso.","prerequisites":["RED-M11-L03"],"referenceIds":["WLAN","WPA3"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M11-L04-Q01","RED-M11-L04-Q02"],"practiceId":"RED-M11-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M11-L04.md"} -->

## 1. Objetivo

Localizar el fallo WLAN por fase del acceso.

Prerrequisitos: [RED-M11-L03](../RED-E02/RED-M11-L03.md).

## 2. Comprende el mecanismo

Separa descubrimiento del SSID, asociación, autenticación, asignación IP, resolución y aplicación. Un cliente asociado puede carecer de autorización o dirección utilizable. El punto de medición RF no equivale al del tráfico descifrado en una interfaz cableada. Para un diagnóstico útil reúne identidad del cliente docente, BSSID, banda/canal, hora, fase fallida y resultado de servidor de autenticación o DHCP. Las condiciones de radio no se validan con una captura sintética de Ethernet; esa captura solo permite practicar razonamiento sobre parte del proceso.

### Vocabulario de apoyo

- **SSID y BSSID**: Nombre de red WLAN y identificador de una instancia del servicio de radio.
- **RF, RSSI y SNR**: Radiofrecuencia, medida de señal recibida y relación entre señal y ruido.
- **Airtime y roaming**: Tiempo de uso del medio radio y transición de asociación entre BSSID.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: asociación correcta; EAP rechazado; no se inicia DHCP; servidor indica certificado de cliente vencido.

La evidencia sitúa el rechazo en autenticación. Cambiar máscara IPv4 no renueva un certificado ni autoriza al cliente.

## 4. Práctica individual

Ahora EAP acepta, DHCP entrega IP y falla solo DNS. Reformula la siguiente comprobación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no prueba estar asociado a un AP?

- A. Que el cliente eligió ese BSSID
- B. Que se completó una asociación
- C. Que existe una radio accesible
- D. Tener dirección y autorización de servicio correctas

### Pregunta 2

¿Qué explica el rechazo del ejemplo?

- A. El certificado de cliente vencido según el servidor
- B. Un canal BGP saturado
- C. Una máscara equivocada demostrada
- D. Una ruta por defecto ausente como causa primaria

## 6. Aplicación profesional

- SOC: Interpretar degradación inalámbrica.
- Red Team autorizado: Restringir pruebas a APs y clientes propios.
- Evidencia del módulo: Mapa RF simplificado y diagrama de decisión.
- Criterio del módulo: Identifica la capa causal sin atribuciones erróneas.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L11](../../05_RECURSOS/LABORATORIOS/RED-L11.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **WLAN**: [IEEE 802.11 Working Group](https://www.ieee802.org/11/). Familia de estándares y alcance; no verificación del texto completo de todas las normas.
- **WPA3**: [Configure and Verify Wi-Fi 6E WLAN Layer 2 Security](https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/220712-configure-and-verify-wi-fi-6e-wlan-layer.html). Modos WPA2/WPA3, PMF y soporte; requisitos de configuración de la familia descrita.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
