# RED-M33-L01 — Inventario y descubrimiento

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M33-L01","moduleId":"RED-M33","stageId":"RED-E06","objective":"Construir un inventario inicial con confianza y procedencia.","prerequisites":["RED-M07-L04","RED-M12-L04","RED-M32-L04"],"referenceIds":["NIST-TEST","ZEEK-CONN"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M33-L01-Q01","RED-M33-L01-Q02"],"practiceId":"RED-M33-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M33-L01.md"} -->

## 1. Objetivo

Construir un inventario inicial con confianza y procedencia.

Prerrequisitos: [RED-M07-L04](../RED-E02/RED-M07-L04.md), [RED-M12-L04](../RED-E03/RED-M12-L04.md), [RED-M32-L04](../RED-E06/RED-M32-L04.md).

## 2. Comprende el mecanismo

Comienza por documentación, asignaciones, tablas y datos disponibles antes de añadir tráfico activo. Diferencia activo esperado, observado y confirmado. Una IP no identifica de forma permanente un equipo; NAT, DHCP, virtualización y balanceadores complican esa relación. Registra fuente, instante y confianza de cada atributo. Un inventario debe poder conservar discrepancias para investigación, no resolverlas borrando el dato que contradice el diagrama. Los datos sintéticos de este ejercicio no representan una red real descubierta.

### Vocabulario de apoyo

- **Enumeración y banner**: Obtención acotada de información de activos/servicios y dato que declara un servicio en una interacción.
- **Parche retroportado**: Corrección incorporada a una versión mantenida sin adoptar necesariamente el número de una versión posterior.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Inventario docente dice host A en .10; DHCP indica reasignación a B; observación de red solo muestra .10 y hora incierta.

Hay una discrepancia de identidad dependiente del tiempo. Conservar ambas fuentes impide atribuir automáticamente la observación a A.

## 4. Práctica individual

Diseña una ficha de inventario que permita resolver esa discrepancia cuando llegue un registro nuevo.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe acompañar un atributo de inventario?

- A. Una IP válida para siempre
- B. Una eliminación de datos contradictorios
- C. Solo un nombre definitivo
- D. Fuente, instante y confianza

### Pregunta 2

¿Qué estado tiene la identidad del caso?

- A. Pendiente de resolver según el contexto temporal
- B. B como usuario humano demostrado
- C. A confirmado solo por el diagrama
- D. Imposible de investigar aunque haya nuevas fuentes

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
