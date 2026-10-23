# RED-M13-L03 — OSPFv2/v3 y autenticación aplicable

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M13-L03","moduleId":"RED-M13","stageId":"RED-E03","objective":"Distinguir versión, familia de direcciones y protección de OSPF.","prerequisites":["RED-M13-L02"],"referenceIds":["FRR-OSPF","FRR-OSPF6"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M13-L03-Q01","RED-M13-L03-Q02"],"practiceId":"RED-M13-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M13-L03.md"} -->

## 1. Objetivo

Distinguir versión, familia de direcciones y protección de OSPF.

Prerrequisitos: [RED-M13-L02](../RED-E03/RED-M13-L02.md).

## 2. Comprende el mecanismo

OSPFv2 se asocia al routing IPv4; OSPFv3 se diseñó para IPv6 y puede admitir otras familias mediante extensiones y soporte concreto. No supongas que toda implementación v3 habilita IPv4 con la misma sintaxis. OSPFv3 utiliza funciones y direccionamiento de enlace diferentes de v2. La autenticación puede depender de mecanismos definidos por versión, extensiones y plataforma: no basta copiar una clave de un tutorial v2. Documenta versión, familia, transporte y mecanismo aplicado sin confundir autenticación del protocolo con cifrado del tráfico de usuarios.

### Vocabulario de apoyo

- **LSA, LSDB y SPF**: Anuncio de estado de enlace, base de esos anuncios y cálculo de caminos de OSPF.
- **DR/BDR y DROther**: Roles de router designado, respaldo y otros routers en ciertos medios OSPF.
- **ABR y ASBR**: Router entre áreas y router que introduce rutas externas, respectivamente.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Inventario docente: router admite OSPFv3 para IPv6; no declara soporte de la familia IPv4 en esa versión instalada.

No puede exigirse una configuración IPv4 sobre v3 por similitud de nombres. La elección requiere soporte documentado y un diseño compatible.

## 4. Práctica individual

Autenticar vecinos OSPF funciona. ¿Qué evidencia faltaría para decir que los datos del usuario están cifrados?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué debe verificarse antes de usar IPv4 sobre OSPFv3?

- A. La extensión y soporte de familia en la implementación concreta
- B. Solo que el hardware tenga una interfaz con dirección IPv4
- C. Copiar sintaxis OSPFv2 sin revisar capacidades de v3
- D. Solo que OSPFv3 ya funcione para IPv6 en ese equipo

### Pregunta 2

¿Qué no demuestra autenticar OSPF?

- A. Que existe una política de claves
- B. Cifrado de todo el tráfico de usuarios
- C. Que debe haber compatibilidad entre vecinos
- D. Que se configuró una protección del protocolo

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
