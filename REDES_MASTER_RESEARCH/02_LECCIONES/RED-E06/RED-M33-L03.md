# RED-M33-L03 — Verificación manual

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M33-L03","moduleId":"RED-M33","stageId":"RED-E06","objective":"Contrastar banners y resultados automáticos antes de declarar vulnerabilidad.","prerequisites":["RED-M33-L02"],"referenceIds":["NIST-TEST","ZEEK-CONN"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M33-L03-Q01","RED-M33-L03-Q02"],"practiceId":"RED-M33-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M33-L03.md"} -->

## 1. Objetivo

Contrastar banners y resultados automáticos antes de declarar vulnerabilidad.

Prerrequisitos: [RED-M33-L02](../RED-E06/RED-M33-L02.md).

## 2. Comprende el mecanismo

Un banner informa de lo que un servicio declara o expone; puede estar oculto, modificado, detrás de un proxy o no reflejar parches retroportados. Una herramienta que relaciona versión y vulnerabilidad propone una hipótesis, no confirma condiciones explotables o impacto. La verificación debe considerar componente real, configuración, mitigaciones y alcance autorizado. Separa servicio observado, configuración débil, vulnerabilidad aplicable y efecto demostrado. Una prueba manual de bajo impacto puede ser suficiente o revelar que falta evidencia.

### Vocabulario de apoyo

- **Enumeración y banner**: Obtención acotada de información de activos/servicios y dato que declara un servicio en una interacción.
- **Parche retroportado**: Corrección incorporada a una versión mantenida sin adoptar necesariamente el número de una versión posterior.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: banner dice versión antigua; inventario del paquete muestra parche retroportado; no se ha probado ninguna condición vulnerable.

No puede confirmarse vulnerabilidad únicamente por el banner. Debe contrastarse el paquete y el aviso del proveedor para ese mantenimiento.

## 4. Práctica individual

Un escáner marca posible debilidad y el servicio no presenta la opción requerida. Redacta el estado.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué acredita un banner de manera inmediata?

- A. Identidad humana del administrador
- B. Todos los parches reales aplicados
- C. Lo que el servicio declara en esa interacción
- D. Impacto de una explotación

### Pregunta 2

¿Qué exige el caso antes de confirmar vulnerabilidad?

- A. Usar solo la cadena de versión
- B. Contrastar parche y condiciones de aplicabilidad
- C. Declarar compromiso por antigüedad aparente
- D. Ignorar el inventario

## 6. Aplicación profesional

- SOC: Identificar actividad detectable y ruido.
- Red Team autorizado: Competencia central de reconocimiento controlado.
- Evidencia del módulo: Tabla activo-puerto-evidencia-hora y límites.
- Criterio del módulo: Sin objetivos externos y con mínimo tráfico.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L17](../../05_RECURSOS/LABORATORIOS/RED-L17.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **ZEEK-CONN**: [conn.log](https://docs.zeek.org/en/current/reference/logs/conn.html). Registros de conexión y límites; los fixtures del curso usan otro esquema declarado.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
