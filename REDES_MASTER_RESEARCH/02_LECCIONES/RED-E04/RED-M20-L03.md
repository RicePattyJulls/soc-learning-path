# RED-M20-L03 — Zonas y DMZ

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M20-L03","moduleId":"RED-M20","stageId":"RED-E04","objective":"Definir zonas por función y flujos, no por etiquetas decorativas.","prerequisites":["RED-M20-L02"],"referenceIds":["NIST-ZT","RFC7348"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M20-L03-Q01","RED-M20-L03-Q02"],"practiceId":"RED-M20-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M20-L03.md"} -->

## 1. Objetivo

Definir zonas por función y flujos, no por etiquetas decorativas.

Prerrequisitos: [RED-M20-L02](../RED-E04/RED-M20-L02.md).

## 2. Comprende el mecanismo

Una zona reúne activos con requisitos de confianza y comunicación. Una DMZ aloja funciones expuestas bajo políticas explícitas; no es segura simplemente por llamarse DMZ. Define matriz origen, destino, servicio y justificación, incluida administración y salida. El servidor publicado puede necesitar consultar una base de datos sin recibir acceso a toda la red interna. Zonas, routing y controles deben alinearse; una ruta más específica o una interfaz alternativa puede crear un camino que evite el control previsto.

### Vocabulario de apoyo

- **Campus y núcleo colapsado**: Red de una sede y diseño que combina responsabilidades de distribución y núcleo.
- **DMZ y dominio de fallo**: Zona de funciones expuestas con política explícita y conjunto afectado por una dependencia común.
- **PDU**: Unidad que distribuye alimentación eléctrica a equipos.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Matriz docente: Internet→web TCP/443 permitido; web→DB TCP/5432 permitido; web→usuarios cualquier servicio denegado.

El diseño permite las dependencias necesarias y limita movimiento hacia usuarios. Debe comprobarse que no exista otra ruta sin la política correspondiente.

## 4. Práctica individual

El equipo de soporte necesita administración de web. Propón una excepción acotada.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué convierte una zona en una decisión de seguridad verificable?

- A. Asignar el nombre DMZ sin revisar rutas alternativas
- B. Flujos y controles explícitos
- C. Separar VLAN aunque todo routing entre ellas permanezca abierto
- D. Usar prefijos distintos como sustituto de una matriz de servicios

### Pregunta 2

¿Qué flujo está permitido en el ejemplo?

- A. Internet hacia administración sin límites
- B. Web hacia todos los usuarios
- C. Web hacia DB por TCP/5432
- D. DB hacia toda red sin política

## 6. Aplicación profesional

- SOC: Definir sensores y puntos de correlación.
- Red Team autorizado: Delimitar superficies y rutas críticas.
- Evidencia del módulo: Diagrama L2/L3, matriz de tráfico y riesgos.
- Criterio del módulo: Sin solapamientos, SPOF explícitos y ruta de administración.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L10](../../05_RECURSOS/LABORATORIOS/RED-L10.md)
- [Guía de laboratorio RED-L12](../../05_RECURSOS/LABORATORIOS/RED-L12.md)
- [Guía de laboratorio RED-L19](../../05_RECURSOS/LABORATORIOS/RED-L19.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
- **RFC7348**: [RFC 7348: Virtual eXtensible Local Area Network](https://www.rfc-editor.org/rfc/rfc7348.html). Overlay Ethernet sobre infraestructura IP y contexto de VNI.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
