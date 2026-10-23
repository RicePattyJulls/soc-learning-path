# RED-M17-L01 — SNAT/DNAT/PAT

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M17-L01","moduleId":"RED-M17","stageId":"RED-E03","objective":"Seguir una traducción de direcciones y puertos por sentido.","prerequisites":["RED-M04-L04","RED-M07-L04","RED-M12-L04"],"referenceIds":["RFC3022","RFC3704"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M17-L01-Q01","RED-M17-L01-Q02"],"practiceId":"RED-M17-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M17-L01.md"} -->

## 1. Objetivo

Seguir una traducción de direcciones y puertos por sentido.

Prerrequisitos: [RED-M04-L04](../RED-E01/RED-M04-L04.md), [RED-M07-L04](../RED-E02/RED-M07-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md).

## 2. Comprende el mecanismo

SNAT modifica el origen; DNAT el destino; PAT distingue traducciones usando puertos además de direcciones. La traducción puede ocurrir en distintos puntos y su orden respecto a filtrado depende de plataforma. NAT no autentica usuarios y no reemplaza una política de seguridad. Para reconstruir una conversación se necesitan los extremos originales y traducidos, protocolo, puertos y tiempo. Varias conexiones simultáneas pueden compartir una IP de salida y seguir siendo sesiones distintas.

### Vocabulario de apoyo

- **SNAT, DNAT y PAT**: Traducción del origen, del destino y de direcciones con distinción de puertos.
- **Proxy y backend**: Intermediario que atiende o reenvía peticiones y servicio situado detrás de él.
- **Asimetría**: Uso de caminos diferentes para los sentidos de una comunicación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Tabla sintética: TCP 192.0.2.10:51000 → 203.0.113.5:40001 → 198.51.100.20:443.

El observador externo ve el origen traducido .5:40001. Para atribuir a .10 hace falta la relación de traducción correspondiente al tiempo de la conexión.

## 4. Práctica individual

Otro host usa .5:40002 al mismo destino. Explica por qué buscar solo .5 en un informe no distingue ambos.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué modifica DNAT?

- A. La hora del evento siempre
- B. El destino del paquete
- C. El contenido de toda aplicación
- D. La identidad del usuario

### Pregunta 2

¿Qué falta para atribuir .5:40001 al cliente?

- A. Una etiqueta VLAN inventada
- B. El TTL DNS de otro nombre
- C. Solo la ubicación del servidor
- D. El registro de traducción y su contexto temporal

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
