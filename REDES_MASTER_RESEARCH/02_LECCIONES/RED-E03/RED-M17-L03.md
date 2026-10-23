# RED-M17-L03 — Proxies y balanceadores

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M17-L03","moduleId":"RED-M17","stageId":"RED-E03","objective":"Diferenciar terminación de proxy y conexión de extremo a extremo.","prerequisites":["RED-M17-L02"],"referenceIds":["RFC3022","RFC3704"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M17-L03-Q01","RED-M17-L03-Q02"],"practiceId":"RED-M17-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M17-L03.md"} -->

## 1. Objetivo

Diferenciar terminación de proxy y conexión de extremo a extremo.

Prerrequisitos: [RED-M17-L02](../RED-E03/RED-M17-L02.md).

## 2. Comprende el mecanismo

Un proxy puede terminar una conexión y abrir otra hacia el backend; un balanceador puede trabajar en diferentes capas y modos. Por eso IP, puerto, secuencia TCP y negociación TLS pueden pertenecer a segmentos distintos de una misma transacción. Una cabecera que declara el cliente original es un dato de aplicación que exige una frontera de confianza: si el cliente puede falsificarla, no acredita identidad. Una comprobación de salud del balanceador tampoco garantiza que todos los backends sirvan toda operación de negocio.

### Vocabulario de apoyo

- **SNAT, DNAT y PAT**: Traducción del origen, del destino y de direcciones con distinción de puertos.
- **Proxy y backend**: Intermediario que atiende o reenvía peticiones y servicio situado detrás de él.
- **Asimetría**: Uso de caminos diferentes para los sentidos de una comunicación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: cliente→proxy con sesión TLS A; proxy→backend con sesión TLS B; backend registra IP del proxy.

El registro del backend no muestra necesariamente al cliente original. Correlacionar IDs de petición y logs del proxy evita equiparar ambas sesiones.

## 4. Práctica individual

Una petición incluye una cabecera de cliente original enviada directamente sin pasar por el proxy confiable. ¿Debe aceptarse como atribución?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué puede cambiar al atravesar un proxy que termina conexiones?

- A. La conexión y sus extremos de transporte
- B. El protocolo IP deja de existir
- C. La VLAN se convierte en usuario
- D. Toda petición queda autenticada por defecto

### Pregunta 2

¿A quién identifica la IP observada por el backend del ejemplo?

- A. A todos los clientes individualmente
- B. Al proxy como extremo de esa conexión
- C. Necesariamente al usuario original
- D. Al resolver DNS obligatoriamente

## 6. Aplicación profesional

- SOC: Construir pivotes temporales con NAT.
- Red Team autorizado: Validar una regla NAT de alcance delimitado.
- Evidencia del módulo: Tabla pre/post traducción con UTC y grado de confianza.
- Criterio del módulo: No atribuye persona solo por IP pública.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L09](../../05_RECURSOS/LABORATORIOS/RED-L09.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
