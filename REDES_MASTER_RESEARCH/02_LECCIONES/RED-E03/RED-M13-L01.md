# RED-M13-L01 — Vecinos y áreas

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M13-L01","moduleId":"RED-M13","stageId":"RED-E03","objective":"Identificar requisitos de vecindad y papel de las áreas OSPF.","prerequisites":["RED-M12-L04"],"referenceIds":["FRR-OSPF","FRR-OSPF6"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M13-L01-Q01","RED-M13-L01-Q02"],"practiceId":"RED-M13-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M13-L01.md"} -->

## 1. Objetivo

Identificar requisitos de vecindad y papel de las áreas OSPF.

Prerrequisitos: [RED-M12-L04](../RED-E03/RED-M12-L04.md).

## 2. Comprende el mecanismo

OSPF distribuye información de estado de enlace dentro de su organización de áreas. Vecindad y adyacencia completa no son siempre equivalentes: en redes broadcast, DR y BDR reducen el conjunto de adyacencias necesarias; dos routers DROther pueden quedarse en 2-Way de forma normal. Tipo de red, área, temporizadores, autenticación y parámetros pertinentes deben ser compatibles. Área 0 es el backbone y los ABR conectan áreas con él en el diseño normal. Un ASBR introduce información externa; no es sinónimo de ABR.

### Vocabulario de apoyo

- **LSA, LSDB y SPF**: Anuncio de estado de enlace, base de esos anuncios y cálculo de caminos de OSPF.
- **DR/BDR y DROther**: Roles de router designado, respaldo y otros routers en ciertos medios OSPF.
- **ABR y ASBR**: Router entre áreas y router que introduce rutas externas, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Red broadcast docente: R1=DR, R2=BDR, R3 y R4=DROther; R3-R4=2-Way y ambos tienen Full con DR/BDR.

2-Way entre los dos DROther es compatible con funcionamiento normal. Forzar resets para alcanzar Full entre todos desconoce el tipo de red.

## 4. Práctica individual

R5 no supera Init. Propón comprobar bidireccionalidad y dos parámetros de compatibilidad.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué función tiene un ABR?

- A. Asignar toda concesión DHCP
- B. Autenticar aplicaciones HTTP
- C. Conectar áreas OSPF según la arquitectura del protocolo
- D. Traducir siempre direcciones NAT

### Pregunta 2

¿Es anómalo necesariamente R3-R4 en 2-Way?

- A. Sí, todos deben ser Full entre sí
- B. No porque OSPF no tiene adyacencias
- C. No, es normal entre DROther en ese medio broadcast
- D. Sí, demuestra un cable roto

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
