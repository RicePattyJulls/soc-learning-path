# RED-M13-L04 — Sumarización y averías

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M13-L04","moduleId":"RED-M13","stageId":"RED-E03","objective":"Planificar áreas y sumarización sin ocultar fallos.","prerequisites":["RED-M13-L03"],"referenceIds":["FRR-OSPF","FRR-OSPF6"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M13-L04-Q01","RED-M13-L04-Q02"],"practiceId":"RED-M13-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M13-L04.md"} -->

## 1. Objetivo

Planificar áreas y sumarización sin ocultar fallos.

Prerrequisitos: [RED-M13-L03](../RED-E03/RED-M13-L03.md).

## 2. Comprende el mecanismo

La sumarización OSPF se realiza en lugares y contextos concretos, como ABR entre áreas o ASBR para rutas externas según soporte. No funciona como un filtro universal de LSAs dentro de una misma área. Un área stub restringe determinadas rutas externas; NSSA permite un tratamiento distinto de rutas introducidas en esa área mediante LSAs específicos. Antes de resumir, comprobar alineación, componentes y comportamiento para destinos ausentes. Un resumen anunciado no demuestra disponibilidad de todos sus subprefijos.

### Vocabulario de apoyo

- **LSA, LSDB y SPF**: Anuncio de estado de enlace, base de esos anuncios y cálculo de caminos de OSPF.
- **DR/BDR y DROther**: Roles de router designado, respaldo y otros routers en ciertos medios OSPF.
- **ABR y ASBR**: Router entre áreas y router que introduce rutas externas, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> ABR docente resume 192.0.2.0/24; solo permanece alcanzable .0/25 y desaparece .128/25.

El resumen todavía puede atraer tráfico a la mitad ausente. Debe existir un tratamiento controlado y pruebas de conectividad para componentes, no solo presencia del agregado.

## 4. Práctica individual

Una sede necesita redistribuir una ruta externa, pero se diseñó como stub. Explica qué revisar sin cambiar a ciegas el tipo de área.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué no debe asumirse sobre sumarización OSPF?

- A. Que filtra cualquier LSA arbitrariamente dentro de un área
- B. Que reduce entradas cuando está bien diseñada
- C. Que puede requerir un ABR o ASBR
- D. Que necesita un prefijo alineado

### Pregunta 2

¿Qué riesgo muestra el agregado del ejemplo?

- A. Atraer tráfico hacia un componente que ya no es alcanzable
- B. Cambiar la MAC de cada cliente
- C. Eliminar todas las rutas externas
- D. Crear DNS recursivo automáticamente

## 6. Aplicación profesional

- SOC: Contextualizar cambios de rutas/ventanas de evento.
- Red Team autorizado: Evaluar efectos de políticas OSPF solo en lab.
- Evidencia del módulo: Salida de adyacencia, LSDB y mapa de caminos.
- Criterio del módulo: Restituye anuncios y justifica raíz y política.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L06](../../05_RECURSOS/LABORATORIOS/RED-L06.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **FRR-OSPF**: [OSPFv2](https://docs.frrouting.org/en/latest/ospfd.html). Vecinos, LSDB, áreas, roles y operación OSPFv2.
- **FRR-OSPF6**: [OSPFv3](https://docs.frrouting.org/en/latest/ospf6d.html). Implementación OSPFv3 y familias soportadas según versión.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
