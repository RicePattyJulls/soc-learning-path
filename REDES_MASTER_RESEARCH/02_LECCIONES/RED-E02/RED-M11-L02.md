# RED-M11-L02 — Interferencia y capacidad

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M11-L02","moduleId":"RED-M11","stageId":"RED-E02","objective":"Distinguir señal fuerte de calidad y capacidad de radio.","prerequisites":["RED-M11-L01"],"referenceIds":["WLAN","WPA3"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M11-L02-Q01","RED-M11-L02-Q02"],"practiceId":"RED-M11-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M11-L02.md"} -->

## 1. Objetivo

Distinguir señal fuerte de calidad y capacidad de radio.

Prerrequisitos: [RED-M11-L01](../RED-E02/RED-M11-L01.md).

## 2. Comprende el mecanismo

RSSI expresa una medida de señal recibida con interpretación dependiente de equipo; SNR compara señal y ruido. Una señal fuerte puede convivir con interferencia, reintentos y saturación del airtime. En un medio compartido importa cuánto tiempo ocupa cada transmisión, no solo cuántos usuarios están asociados. La tasa PHY anunciada no equivale al caudal útil de aplicación. Usa mediciones por ubicación, dirección y carga, incluyendo errores y utilización de canal, antes de recomendar más potencia o más AP.

### Vocabulario de apoyo

- **SSID y BSSID**: Nombre de red WLAN y identificador de una instancia del servicio de radio.
- **RF, RSSI y SNR**: Radiofrecuencia, medida de señal recibida y relación entre señal y ruido.
- **Airtime y roaming**: Tiempo de uso del medio radio y transición de asociación entre BSSID.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Medida docente: RSSI adecuado; canal ocupado 90%; muchos reintentos; caudal cae al aumentar clientes.

La ocupación y los reintentos sostienen una hipótesis de contención/interferencia. Subir potencia sin revisar planificación puede agravar la competencia.

## 4. Práctica individual

El canal está poco ocupado pero el SNR cae en una habitación concreta. ¿Cómo ajustarías la investigación?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no garantiza un RSSI alto?

- A. Buen caudal útil y ausencia de interferencia
- B. Que se recibió señal
- C. La posibilidad de medir señal
- D. La presencia de una radio

### Pregunta 2

¿Qué refuerza la hipótesis de contención del caso?

- A. Alta ocupación de canal y reintentos bajo carga
- B. La tasa PHY anunciada como equivalente al caudal útil
- C. El enlace Ethernet del AP activo, sin métricas de radio
- D. RSSI alto como prueba suficiente de ausencia de competencia

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
