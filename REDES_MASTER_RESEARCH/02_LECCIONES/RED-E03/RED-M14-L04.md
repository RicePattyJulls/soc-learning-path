# RED-M14-L04 — Diagnóstico y controles operativos

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M14-L04","moduleId":"RED-M14","stageId":"RED-E03","objective":"Diagnosticar BGP mediante capas de estado y pruebas de política.","prerequisites":["RED-M14-L03"],"referenceIds":["RFC4271","FRR-BGP","RFC7454"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M14-L04-Q01","RED-M14-L04-Q02"],"practiceId":"RED-M14-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M14-L04.md"} -->

## 1. Objetivo

Diagnosticar BGP mediante capas de estado y pruebas de política.

Prerrequisitos: [RED-M14-L03](../RED-E03/RED-M14-L03.md).

## 2. Comprende el mecanismo

Recorre conectividad y sesión, recepción, aceptación, selección, instalación y forwarding. Cada paso puede funcionar mientras otro falla. Para proteger la operación, registra límites de prefijos, familias habilitadas, cambios de política y anuncios a cada vecino. Evita resets completos cuando una comprobación menos disruptiva permita observar política según soporte. La verificación de routing necesita pruebas positivas y negativas: anunciar lo autorizado y demostrar que lo excluido no se exporta. Un solo ping no prueba la corrección de toda una política BGP.

### Vocabulario de apoyo

- **AS y BGP**: Sistema autónomo de routing y protocolo que intercambia alcanzabilidad y atributos entre sistemas.
- **Local preference y AS_PATH**: Preferencia de política interna y secuencia de AS del camino anunciado.
- **Comunidad y ROV**: Etiqueta interpretada por políticas y validación del origen mediante autorizaciones RPKI.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Después del cambio docente: vecino Established; prefijo esperado recibido y seleccionado; FIB apunta a next hop equivocado por resolución en otra tabla.

La investigación debe seguir la instalación y el contexto de resolución. La sesión establecida no refuta ese fallo posterior.

## 4. Práctica individual

Diseña una evidencia para comprobar que una default no se está exportando al vecino equivocado.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué viene después de seleccionar una ruta para demostrar entrega?

- A. Comprobar instalación y forwarding con next hop válido
- B. Cerrar toda sesión siempre
- C. Cambiar el AS al azar
- D. Ignorar el camino de retorno

### Pregunta 2

¿Qué falta si solo se hace ping a un destino permitido?

- A. Una prueba de que se intentó comunicar
- B. Un resultado de esa petición
- C. Evidencia de que los anuncios prohibidos quedan excluidos
- D. Una dirección destino utilizada

## 6. Aplicación profesional

- SOC: Leer decisiones de camino que afectan visibilidad.
- Red Team autorizado: Validar filtrado de prefijos en entorno aislado.
- Evidencia del módulo: RIB, anuncios, políticas y prueba antes/después.
- Criterio del módulo: No hay anuncios no autorizados; selección explicada.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L07](../../05_RECURSOS/LABORATORIOS/RED-L07.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC4271**: [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html). Sesiones, atributos y distribución de rutas BGP.
- **FRR-BGP**: [BGP](https://docs.frrouting.org/en/latest/bgp.html). Selección de rutas, políticas, comunidades y operación.
- **RFC7454**: [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html). Filtrado, límites y operación defensiva BGP.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
