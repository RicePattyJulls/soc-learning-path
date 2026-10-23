# RED-M13-L02 — Estados, LSDB y SPF

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M13-L02","moduleId":"RED-M13","stageId":"RED-E03","objective":"Seguir la sincronización de LSDB y el cálculo SPF.","prerequisites":["RED-M13-L01"],"referenceIds":["FRR-OSPF","FRR-OSPF6"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M13-L02-Q01","RED-M13-L02-Q02"],"practiceId":"RED-M13-L02-P01","solutionsFile":"03_SOLUCIONES/RED-M13-L02.md"} -->

## 1. Objetivo

Seguir la sincronización de LSDB y el cálculo SPF.

Prerrequisitos: [RED-M13-L01](../RED-E03/RED-M13-L01.md).

## 2. Comprende el mecanismo

OSPF intercambia LSAs para construir una base de estado de enlace con alcance definido. SPF calcula caminos a partir de esa información; LSDB, RIB y FIB son estados relacionados pero distintos. Estados ExStart y Exchange participan en la negociación e intercambio de descripciones; incompatibilidades como MTU pueden impedir progresar. Un LSA de red, uno de router y un anuncio externo no tienen la misma función. No corregir una adyacencia atascada desactivando comprobaciones sin contrastar el defecto que las provoca.

### Vocabulario de apoyo

- **LSA, LSDB y SPF**: Anuncio de estado de enlace, base de esos anuncios y cálculo de caminos de OSPF.
- **DR/BDR y DROther**: Roles de router designado, respaldo y otros routers en ciertos medios OSPF.
- **ABR y ASBR**: Router entre áreas y router que introduce rutas externas, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Enlace docente: R1 MTU=1500; R2 MTU=1400; vecinos repiten ExStart/Exchange; Hellos se reciben.

La recepción de Hellos no asegura sincronización. La MTU desigual es una hipótesis concreta que debe compararse con registros y configuración del enlace.

## 4. Práctica individual

Los vecinos están Full pero falta una ruta. ¿Qué tres niveles de estado revisarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué calcula SPF a partir de la información de enlace?

- A. Contraseñas de los vecinos
- B. Una política NAT obligatoria
- C. Direcciones MAC públicas
- D. Caminos de menor coste según el modelo OSPF

### Pregunta 2

¿Qué parámetro difiere en el caso?

- A. El nombre de un usuario
- B. La versión de HTTP
- C. La MTU
- D. El resolver inverso del cliente

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
