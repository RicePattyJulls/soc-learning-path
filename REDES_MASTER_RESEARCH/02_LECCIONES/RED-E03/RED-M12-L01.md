# RED-M12-L01 — Conectadas y estáticas

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M12-L01","moduleId":"RED-M12","stageId":"RED-E03","objective":"Interpretar rutas conectadas y estáticas, incluido su siguiente salto.","prerequisites":["RED-M02-L04","RED-M03-L04","RED-M09-L04"],"referenceIds":["FRR-STATIC","RFC4632"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M12-L01-Q01","RED-M12-L01-Q02"],"practiceId":"RED-M12-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M12-L01.md"} -->

## 1. Objetivo

Interpretar rutas conectadas y estáticas, incluido su siguiente salto.

Prerrequisitos: [RED-M02-L04](../RED-E01/RED-M02-L04.md), [RED-M03-L04](../RED-E01/RED-M03-L04.md), [RED-M09-L04](../RED-E02/RED-M09-L04.md).

## 2. Comprende el mecanismo

Una ruta conectada deriva de una interfaz y su prefijo cuando se cumplen condiciones de estado. Una estática expresa una decisión configurada y puede necesitar resolver recursivamente su siguiente salto. Que una ruta aparezca en configuración no garantiza que esté instalada o que el vecino responda. Distingue configuración, tabla de routing y tabla de forwarding. Una ruta de host /32 o /128 selecciona una dirección específica. Las rutas flotantes usan una preferencia menos favorable para actuar como alternativa cuando deja de existir la preferida, según plataforma.

### Vocabulario de apoyo

- **RIB y FIB**: Tabla de decisiones de routing y estado utilizado para reenviar paquetes, respectivamente.
- **Next hop y LPM**: Siguiente salto y selección del prefijo coincidente más largo entre rutas instaladas.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Tabla docente: 192.0.2.0/24 conectada; estática 198.51.100.0/24 vía 192.0.2.1; vecino .1 alcanzable.

La estática puede resolver su siguiente salto mediante la conectada. Para entregar tráfico todavía hay que comprobar forwarding y retorno desde el destino.

## 4. Práctica individual

La interfaz hacia .1 cae. Explica por qué conservar la línea de configuración no prueba que esa ruta siga operativa.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué expresa una ruta estática configurada?

- A. Una concesión DHCP necesariamente
- B. Conectividad de aplicación garantizada
- C. Una decisión administrativa de encaminamiento
- D. La autenticación de todo destino

### Pregunta 2

¿Qué permite resolver .1 en el caso?

- A. La regla de una ventana TCP
- B. Una MAC de otra sede
- C. El registro MX del destino
- D. La red conectada 192.0.2.0/24

## 6. Aplicación profesional

- SOC: Interpretar caminos aparentes en flows.
- Red Team autorizado: Delimitar rutas por las que pasa el tráfico del ensayo.
- Evidencia del módulo: Tablas, traceroute lab y justificación de selección.
- Criterio del módulo: Determina ida y retorno en IPv4/IPv6.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L06](../../05_RECURSOS/LABORATORIOS/RED-L06.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **FRR-STATIC**: [STATIC](https://docs.frrouting.org/en/latest/static.html). Rutas estáticas y siguiente salto.
- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
