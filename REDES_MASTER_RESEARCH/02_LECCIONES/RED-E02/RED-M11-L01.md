# RED-M11-L01 — 802.11, bandas y canales

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M11-L01","moduleId":"RED-M11","stageId":"RED-E02","objective":"Relacionar banda, canal y ancho con compatibilidad y capacidad.","prerequisites":["RED-M02-L04","RED-M03-L04","RED-M07-L04"],"referenceIds":["WLAN","WPA3"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M11-L01-Q01","RED-M11-L01-Q02"],"practiceId":"RED-M11-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M11-L01.md"} -->

## 1. Objetivo

Relacionar banda, canal y ancho con compatibilidad y capacidad.

Prerrequisitos: [RED-M02-L04](../RED-E01/RED-M02-L04.md), [RED-M03-L04](../RED-E01/RED-M03-L04.md), [RED-M07-L04](../RED-E02/RED-M07-L04.md).

## 2. Comprende el mecanismo

802.11 define tecnologías WLAN; bandas, canales y potencias utilizables dependen del país, equipo y configuración. El ancho de canal aumenta recursos espectrales consumidos y no garantiza más capacidad útil cuando hay competencia. SSID identifica una red anunciada; BSSID identifica una instancia de servicio, normalmente asociada a una radio. Un cliente debe soportar la banda y mecanismos de seguridad. No transferir una planificación de 2,4 GHz directamente a 5 o 6 GHz sin revisar canales, regulación y capacidades.

### Vocabulario de apoyo

- **SSID y BSSID**: Nombre de red WLAN y identificador de una instancia del servicio de radio.
- **RF, RSSI y SNR**: Radiofrecuencia, medida de señal recibida y relación entre señal y ruido.
- **Airtime y roaming**: Tiempo de uso del medio radio y transición de asociación entre BSSID.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Diseño docente: AP solo anuncia el SSID en una banda que el adaptador del cliente no soporta; Ethernet del AP funciona.

La conectividad cableada del AP no prueba compatibilidad de radio del cliente. Revisar banda y capacidades explica por qué no ve el anuncio esperado.

## 4. Práctica individual

Dos AP cercanos usan canales muy anchos que se solapan. Propón un cambio a estudiar y cómo medirlo.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué identifica el SSID?

- A. El servidor NTP
- B. Una red WLAN anunciada
- C. Una dirección de routing
- D. La MAC de todos los clientes

### Pregunta 2

¿Qué explica no ver la red en el ejemplo?

- A. La ausencia de una ruta BGP pública
- B. Un TTL DNS necesariamente agotado
- C. El enlace cableado del AP garantiza toda compatibilidad
- D. La banda anunciada no es compatible con el cliente

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
