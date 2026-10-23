# RED-M17-L02 — Tablas de estado

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M17-L02","moduleId":"RED-M17","stageId":"RED-E03","objective":"Interpretar estado de conexión y agotamiento de recursos NAT.","prerequisites":["RED-M17-L01"],"referenceIds":["RFC3022","RFC3704"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M17-L02-Q01","RED-M17-L02-Q02"],"practiceId":"RED-M17-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M17-L02.md"} -->

## 1. Objetivo

Interpretar estado de conexión y agotamiento de recursos NAT.

Prerrequisitos: [RED-M17-L01](../RED-E03/RED-M17-L01.md).

## 2. Comprende el mecanismo

Las traducciones dinámicas y controles stateful conservan estado durante tiempos definidos. Un paquete que llega después de caducar puede no corresponder ya a una entrada válida. El espacio de puertos y recursos de tabla es finito; muchas conexiones o temporizadores pueden agotarlo sin que fallen todas las rutas. Contadores de asignación, expiración y errores ayudan a diferenciar saturación de NAT, rechazo de firewall y caída remota. El estado debe interpretarse según protocolo y dirección.

### Vocabulario de apoyo

- **SNAT, DNAT y PAT**: Traducción del origen, del destino y de direcciones con distinción de puertos.
- **Proxy y backend**: Intermediario que atiende o reenvía peticiones y servicio situado detrás de él.
- **Asimetría**: Uso de caminos diferentes para los sentidos de una comunicación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Métrica docente: nuevas conexiones fallan; sesiones existentes continúan; tabla NAT al límite; aumenta contador de asignación fallida.

El patrón y el contador apoyan agotamiento de traducciones. Reiniciar clientes o cambiar DNS no aborda por sí solo el recurso agotado.

## 4. Práctica individual

Tras reducir una carga docente, disminuyen errores y vuelven nuevas conexiones. ¿Qué queda por verificar?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Por qué puede fallar una conexión nueva y no una existente?

- A. Las rutas solo se usan una vez
- B. DNS elimina todas las sesiones activas
- C. NAT autentica al primer usuario solamente
- D. La asignación de nuevo estado puede agotar recursos

### Pregunta 2

¿Qué evidencia apoya el diagnóstico del caso?

- A. Una tabla de rutas sin cambios, tomada como prueba de capacidad NAT ilimitada
- B. Un pico DNS sin errores de traducción correlacionados
- C. Que una sesión antigua siga funcionando, sin medir nuevas asignaciones
- D. Tabla al límite y contador de asignación fallida

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
