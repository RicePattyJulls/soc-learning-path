# RED-M15-L03 — VRF-Lite y PBR

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M15-L03","moduleId":"RED-M15","stageId":"RED-E03","objective":"Diferenciar separación por VRF y decisión de forwarding por política.","prerequisites":["RED-M15-L02"],"referenceIds":["FRR-MAP","RFC3704","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M15-L03-Q01","RED-M15-L03-Q02"],"practiceId":"RED-M15-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M15-L03.md"} -->

## 1. Objetivo

Diferenciar separación por VRF y decisión de forwarding por política.

Prerrequisitos: [RED-M15-L02](../RED-E03/RED-M15-L02.md).

## 2. Comprende el mecanismo

Una VRF mantiene un contexto de routing separado; puede permitir direcciones solapadas entre dominios con reglas explícitas para comunicar entre ellos. VRF-Lite no implica necesariamente MPLS en el equipo. PBR decide tratamiento de paquetes por criterios de política además del lookup ordinario, según implementación. Una VRF no cifra tráfico y PBR no garantiza que el siguiente salto alternativo tenga retorno. Revisar interfaz de entrada, tabla, route leaking y políticas es obligatorio para interpretar por qué se eligió una salida.

### Vocabulario de apoyo

- **Redistribución**: Importación de rutas entre fuentes o protocolos con políticas de conversión.
- **VRF y PBR**: Contexto independiente de routing y encaminamiento de paquetes mediante política.
- **uRPF**: Validación de origen basada en rutas, con modos que toleran de forma distinta la asimetría.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> VRF-A y VRF-B contienen 192.0.2.0/24. Solo A tiene ruta al servidor; una prueba se origina en B.

La coincidencia de prefijos no mezcla las tablas. El origen y VRF del intento explican por qué una ruta vista en A no resuelve B.

## 4. Práctica individual

Se añade leaking para un servicio entre VRF. Define qué no debe permitirse de forma implícita.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué separa una VRF?

- A. Toda onda de radio
- B. El contenido HTTP con cifrado obligatorio
- C. Los relojes de los servidores
- D. El contexto de routing

### Pregunta 2

¿Qué error evita el ejemplo?

- A. Usar una ruta de otra VRF como prueba de alcance en B
- B. Mantener tablas independientes
- C. Comprobar el camino de vuelta
- D. Leer la interfaz de origen

## 6. Aplicación profesional

- SOC: Explicar asimetría/telemetría por VRF.
- Red Team autorizado: Comprobar bypass de segmentación en lab.
- Evidencia del módulo: Política, tablas antes/después y criterio de reversión.
- Criterio del módulo: No hay bucles ni fuga tras corrección.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L07](../../05_RECURSOS/LABORATORIOS/RED-L07.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **FRR-MAP**: [Route Maps](https://docs.frrouting.org/en/latest/routemap.html). Condiciones, secuencias y acciones de route maps.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
