# RED-M11-L03 — Roaming

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M11-L03","moduleId":"RED-M11","stageId":"RED-E02","objective":"Explicar roaming y separar decisiones de cliente e infraestructura.","prerequisites":["RED-M11-L02"],"referenceIds":["WLAN","WPA3"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M11-L03-Q01","RED-M11-L03-Q02"],"practiceId":"RED-M11-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M11-L03.md"} -->

## 1. Objetivo

Explicar roaming y separar decisiones de cliente e infraestructura.

Prerrequisitos: [RED-M11-L02](../RED-E02/RED-M11-L02.md).

## 2. Comprende el mecanismo

El roaming cambia la asociación entre BSSID para mantener conectividad. La decisión depende en gran parte del cliente y de las funciones de asistencia disponibles; no todos reaccionan igual al mismo RSSI. Mecanismos 802.11k/v/r pueden asistir descubrimiento, transición o autenticación según soporte y configuración, pero no garantizan por sí solos una experiencia sin cortes. Si cambia también la subred, puede afectar direccionamiento y sesiones. Medir asociación, autenticación, DHCP y aplicación distingue una demora RF de una dependencia posterior.

### Vocabulario de apoyo

- **SSID y BSSID**: Nombre de red WLAN y identificador de una instancia del servicio de radio.
- **RF, RSSI y SNR**: Radiofrecuencia, medida de señal recibida y relación entre señal y ruido.
- **Airtime y roaming**: Tiempo de uso del medio radio y transición de asociación entre BSSID.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Traza docente: asociación a AP-B tarda 40 ms; autenticación completa a 80 ms; DHCP de otra subred tarda 3 s.

El mayor retraso observado es el cambio de configuración IP. Atribuir los tres segundos únicamente a la transición radio ignoraría evidencia de etapas.

## 4. Práctica individual

Un cliente permanece en AP-A con señal débil aunque AP-B está cerca. ¿Qué dos factores revisarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Quién influye fuertemente en la decisión de roaming?

- A. El servidor DHCP antes de cualquier decisión de asociación
- B. Únicamente el controlador, aunque el cliente no soporte asistencia
- C. El AP más cercano físicamente, con independencia de sus medidas
- D. El cliente inalámbrico

### Pregunta 2

¿Dónde está el mayor retraso del ejemplo?

- A. En 40 ms de asociación exclusivamente
- B. En DHCP tras cambiar de subred
- C. En un fallo de fibra demostrado
- D. En una consulta BGP no observada

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
