# RED-M15-L01 — Rutas y filtrado

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M15-L01","moduleId":"RED-M15","stageId":"RED-E03","objective":"Distinguir filtrado de rutas y filtrado del tráfico reenviado.","prerequisites":["RED-M12-L04","RED-M13-L04","RED-M14-L04"],"referenceIds":["FRR-MAP","RFC3704","FRR-BGP"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M15-L01-Q01","RED-M15-L01-Q02"],"practiceId":"RED-M15-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M15-L01.md"} -->

## 1. Objetivo

Distinguir filtrado de rutas y filtrado del tráfico reenviado.

Prerrequisitos: [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M13-L04](../RED-E03/RED-M13-L04.md), [RED-M14-L04](../RED-E03/RED-M14-L04.md).

## 2. Comprende el mecanismo

Un filtro de prefijos modifica qué información de routing se acepta o anuncia. Una ACL o firewall puede filtrar paquetes del plano de datos sin retirar la ruta. Ambas acciones responden a políticas diferentes. Las listas de prefijos pueden distinguir longitud exacta y rangos de longitudes; permitir un /24 no significa necesariamente permitir todos sus /25 a /32. Comprueba semántica de la plataforma y dirección de aplicación. Un resultado de ruta ausente no permite afirmar que un firewall la bloqueó.

### Vocabulario de apoyo

- **Redistribución**: Importación de rutas entre fuentes o protocolos con políticas de conversión.
- **VRF y PBR**: Contexto independiente de routing y encaminamiento de paquetes mediante política.
- **uRPF**: Validación de origen basada en rutas, con modos que toleran de forma distinta la asimetría.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Política docente permite exactamente 192.0.2.0/24; vecino anuncia 192.0.2.0/25 y .128/25; ambos rechazados.

El filtro exacto no admite subprefijos. Si ese era el requisito, el rechazo es correcto; si no, debe ajustarse explícitamente el rango de longitudes.

## 4. Práctica individual

La ruta aparece instalada y el firewall deniega TCP/22. Clasifica ambos estados.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué modifica un filtro de rutas?

- A. El contenido de toda aplicación
- B. Información de routing aceptada o anunciada
- C. La hora del cliente
- D. La MAC de cada paquete obligatoriamente

### Pregunta 2

¿Por qué se rechazan los /25 del ejemplo?

- A. Un /25 no puede existir
- B. Toda ruta más específica siempre se acepta
- C. El permiso exige el /24 exacto
- D. El protocolo usa solo broadcast

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
