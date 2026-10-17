# Especificación de integración Splunk — diseño pendiente de implementación

Fecha: 16/10/2026. Entrada editorial: revisión `2026-10-16-r1`, 80 lecciones y 240 actividades. **Este documento no implementa React, generación, almacenamiento ni selector. El piloto requiere autorización posterior.**

## 1. Decisiones y límites

SC-200 conserva su experiencia y su motor: 13 capítulos, 76 lecturas, 719 pasos y 272 actividades, con dos introducciones sin dominio inventado. Splunk será una ruta independiente dentro de la misma aplicación local. Compartir componentes de presentación o funciones puras no implica compartir catálogo, prerrequisitos, progreso ni recompensas.

Decisiones educativas aprobadas: teoría con umbral del 80 %; abiertas formativas, sin calificación automática; teoría aprobada no acredita dominio práctico. No se conectan servicios, backend, autenticación, Splunk, ES, SOAR o HEC. Todos los códigos son material de lectura. No se construye un ejecutor SPL en el navegador.

La revisión independiente del contenido sigue pendiente. La aprobación de la auditoría no se registra como revisión humana de las 160 MCQ ni como práctica en producto. Las lecciones con asuntos sin evidencia mantienen un estado visible de revisión, sin rellenar hechos desconocidos.

## 2. C01: catálogo e importación independientes

| Elemento | SC-200 existente, preservado | Splunk propuesto, aún no creado |
| --- | --- | --- |
| Fuente | SC-200.md y sus actividades actuales | 80 Markdown, bancos y cinco manifiestos corregidos |
| Identidad | IDs actuales por documento/capítulo | SP-R01-L01…SP-R11-L07 y sus Q01/Q02/P01 |
| Catálogo | src/generated/catalog.json | src/generated/splunk/catalog.json |
| Índice de búsqueda | src/generated/search-index.json | src/generated/splunk/search-index.json |
| Payloads | public/content/ | public/splunk-content/ |
| Informe derivado | docs/CONTENIDO.md | docs/SPLUNK-CONTENIDO.md |
| Generación | scripts/prepare-content.mjs | Nuevo preparador específico, solo después de autorización |

El destino Splunk está fuera de `public/content`, que el preparador SC-200 limpia. No se redirige `SC200_SOURCE` a Markdown Splunk ni se concatena el curso para que el parser de SC-200 lo segmente por H1/H2. Cada manifiesto ya tiene `lesson_catalog` con ID, título, archivo, objetivo y actividades; esa es la unidad de importación.

Flujo propuesto:

1. Resolver una lista explícita de los cinco paquetes permitidos. Excluir respaldos e investigación histórica; no recorrer recursivamente toda SPLUNK_MASTER_RESEARCH en busca de lecciones.
2. Leer el currículo canónico sin escribirlo y comprobar su SHA-256. Contrastar exactamente sus 80 IDs/títulos con los cinco manifiestos; rechazar duplicados, ausentes, extras o rutas fuera del paquete.
3. Comprobar hashes de todos los archivos de entrada y revisiones editoriales. Resolver fuentes mediante `(source_namespace, source_ref)`, no con D01 como clave global.
4. Importar cada Markdown completo por ID. Segmentar únicamente sus pasos internos; no convertir los títulos H2 en lecciones nuevas. No convertir SP-Rxx-Lxx a slugs ni usar la posición como identidad.
5. Aplicar saneado y reconstrucción: conservar orden y texto autorizado de las secciones de enseñanza, código, actividades y soluciones en su representación correspondiente. Registrar fuente/hash/rangos y verificar que no se perdió o duplicó contenido.
6. Transformar actividades con validación explícita. No hacer un cast del banco editorial al tipo Education existente.
7. Generar archivos en staging del destino Splunk, verificar referencias, luego reemplazar solo la salida permitida de esa ruta. No borrar `public`, `public/content`, `src/generated` o un directorio calculado sin validar su destino exacto.
8. Comparar hashes SC-200 antes/después: cero cambios en sus fuentes, catálogo, payloads, revisiones y actividades. Si cambia alguno, abortar la aceptación del lote.

Los nombres anteriores son una especificación; no existen nuevos scripts del preparador de aplicación en esta fase. Los programas `SPLUNK_MASTER_RESEARCH/VALIDACION/sincronizar_editorial.py` y `regenerar_metadatos.py` únicamente mantienen los paquetes editoriales: no son importadores React.

## 3. Contrato de contenido y adaptación educativa

El catálogo Splunk contendrá `schemaVersion`, `courseId:'splunk'`, revisión, hash del currículo, regiones y metadatos de lecciones. Cada lección conserva ID, región, título canónico, ruta de payload, hash del Markdown, revisión educativa, objetivos, dependencias y estados de evidencia separados.

Payload propuesto por lección: ID/ruta, versión de fuente, bloques de enseñanza con citas verificables, MCQ de teoría, prácticas formativas, solucionario separado para consulta y referencias de datasets. El nombre del archivo puede incluir ID y hashes para invalidar caché; su identidad persistente sigue siendo el ID, no la URL del payload.

| Banco editorial 1.1 | Adaptación prevista |
| --- | --- |
| id / lesson_id / region_id | Se conservan literalmente |
| question | prompt |
| options + option_ids | Opciones con ID estable y texto, sin usar A/B/C/D como identidad |
| solution_option_id | Solución teórica por ID, independiente del orden mostrado |
| multiple_choice | Pregunta de elección única de teoría |
| open_practice / rubric / reference_answer | Actividad formativa consultable; sin función grade, solución booleana o premio práctico |
| source_namespace / source_refs | Referencias oficiales acotadas al paquete, con producto y versión |
| source_sc | Puente conceptual aparte; no importar una equivalencia técnica ni progreso |
| editorial_revision | Entrada de la revisión educativa, distinta de la identidad de la actividad |
| auto_gradable / human_review_status | Política y estado de revisión; no declarar aprobada por un PASS estructural |

La futura referencia local necesita archivo de fuente, hash, líneas y cita literal que sustente la pregunta. Las referencias bibliográficas actuales no sustituyen esas anclas. El piloto debe definirlas y comprobarlas contra la enseñanza anterior a las respuestas; no citar una solución como única prueba de su propia corrección.

Se separarán enseñanza, actividad y solucionario para evitar mostrar la respuesta durante el examen. Esa separación es de presentación/derivados, no eliminación de texto de la fuente editorial. El usuario podrá consultar la lección completa con sus soluciones fuera de evaluación.

Las dos MCQ existentes por lección forman un banco teórico pequeño, no dos fases distintas inventadas. Propuesta para el piloto: ambas se utilizan en la evaluación teórica y en repaso posterior; P01 es la práctica formativa. No duplicar Q01/Q02 como supuestas preguntas nuevas de práctica y examen. Indicar que con dos preguntas el mínimo entero del 80 % son dos aciertos. No afirmar evaluación ciega ni competencia profesional por ese resultado.

No se exige una respuesta libre correcta como requisito para desbloquear o cobrar XP. Se puede registrar que se abrió la práctica o consultó la rúbrica, con un nombre como `formativeSeen`; eso acredita interacción, no calidad de la respuesta. Un futuro proceso de dominio práctico necesita otra autorización, criterios y revisión: queda fuera de esta V1.

## 4. C02: progreso, XP y desbloqueos separados

| Ámbito | SC-200 | Splunk propuesto |
| --- | --- | --- |
| Clave legacy | soc-learning-path:progress:v1 | No se lee ni migra |
| Clave interactiva | soc-learning-path:learning:v2 | soc-learning-path:splunk:learning:v1 |
| Esquema | LearningStore v2 actual | Nuevo esquema v1 con courseId splunk |
| Última posición | lastLesson actual | lastLesson/region propias de Splunk |
| Respuestas/revisiones | Historial actual intacto | Historial por ID y revisión Splunk |
| Premios/XP/nivel | Reglas existentes, sin cambios | Ledger y estadísticas exclusivamente Splunk |
| Desbloqueos | Secuencia SC-200 existente | Grafo de prerrequisitos Splunk |
| Exportación | Formato y contenido actuales | Formato propio, versionado y con courseId |

Las claves nuevas son propuestas, no claves creadas. No se migra ni copia progreso SC-200 a Splunk. Tampoco se añade `splunk` dentro de la clave interactiva existente. Completar SC-200 no regala XP o lecturas Splunk, y viceversa. No se calcula un nivel global entre cursos.

El esquema Splunk debe separar al menos `studyCompleted`, `theoryAttempts`, `theoryPassed`, `formativeSeen` y `practicalStatus:'not_assessed'`. No convertir theoryPassed en el booleano mastered de SC-200. Historial por revisión y ledger de recompensas por ID estable impiden perder intentos o cobrar de nuevo por cambiar una opción/editorial.

Primera respuesta por pregunta e intento, estudio y resumen previos, y reintento explícito después de fallar. La fórmula teórica usa `right >= ceil(0.8 * total)` con total positivo; no redondear una proporción inferior a 80 para aprobar. SC-200 conserva exactamente su comportamiento anterior: cualquier reutilización de funciones debe mantener la semántica de esa ruta y sus pruebas.

Valores propuestos para discutir al aprobar el piloto: estudio 5 XP, resumen 5, teoría aprobada 15, repaso 5, máximo 30 por lección. P01 y una supuesta práctica aprobada conceden 0. Bonus de región 100 al completar estudio y teoría de sus lecciones; nivel cada 250 XP del ledger Splunk. Son parámetros de diseño, no premios concedidos ni una modificación de los valores SC-200. El texto de premios y cofres debe decir teoría/estudio, no dominio práctico.

El guardado debe validar courseId/esquema, fusionar avances de la misma ruta de forma monotónica y respetar datos corruptos sin sobrescribirlos. Los intentos terminados no se recalifican con una revisión nueva; se conserva la versión original y el contenido actualizado exige su propia evaluación teórica. Los premios siguen siendo únicos por lección/tipo, no por cada revisión.

El hook SC-200 actual se monta globalmente y puede guardar al cargar. En la implementación futura, cada subárbol de curso debe montar solo su persistencia cuando está activo. Abrir Splunk no debe inicializar, migrar o guardar claves SC-200 como efecto lateral. No basta con cambiar el argumento del cálculo de XP.

Eventos `storage`: atender exclusivamente las claves de la ruta montada; conservar las fusiones entre pestañas SC-200. Un cambio de preferencia del selector no es progreso. Errores de cuota o JSON corrupto permiten estudio en memoria y exportación sin borrar el original. No hay restablecimiento automático de otra ruta.

## 5. Prerrequisitos y navegación

El currículo canónico fija IDs/títulos/objetivos, no un grafo machine-readable completo. El grafo siguiente es una propuesta extraída de las dependencias documentales y debe aprobarse con la integración; no se escribe dentro del currículo protegido:

| Región | Dependencias propuestas |
| --- | --- |
| R01 | Ninguna |
| R02 | R01 |
| R03 | R02 |
| R04 | R03 |
| R05 | R04; conocimientos de R02 |
| R06 | R03/R04 y fundamentos R05 |
| R07 | R06 y R04 |
| R08 | R06/R07 |
| R09 | R06/R07; estudio conceptual accesible sin ES |
| R10 | R02/R05, sin forzar R08 o licencia ES |
| R11 | R07/R10 y conceptos de R09, sin exigir producto real |

La granularidad exacta de «fundamentos» y «conceptos» necesita IDs explícitos de lecciones en la fase de piloto/ampliación. No convertir esas etiquetas en requisitos ocultos. Hasta aprobar esa tabla de IDs, no anunciar como terminado el grafo completo ni inventar qué lecturas son suficientes. La ruta inicial R01 puede pilotarse sin resolver aún las ramas avanzadas.

El algoritmo de desbloqueos recibe exclusivamente el catálogo/grafo Splunk. No usa `chapters.slice(0,index)` sobre una mezcla de 24 regiones. Las condiciones de acceso de una lectura también se comprueban al abrir su URL, no solo al dibujar el nodo. ES/SOAR condicionan la eventual práctica real, no el acceso al texto conceptual/offline.

Las URLs existentes `#/ruta`, `#/capitulo/:id` y `#/leccion/:id` siguen resolviendo SC-200. Rutas propuestas: `#/splunk/ruta`, `#/splunk/region/SP-R01` y `#/splunk/leccion/SP-R01-L01`. El resolver declara explícitamente el curso y evita búsquedas ambiguas entre dos mapas. No se cambia origen, puerto, protocolo ni perfil para añadir el selector.

El selector visible SC-200/Splunk mantiene accesibilidad, Atrás, enlaces directos y retorno al nodo con foco. Al seleccionar Splunk muestra su resumen y última posición propia; volver a SC-200 recupera su contexto. Si se recuerda el selector, usar una preferencia UI independiente, sin tocar lastLesson del otro curso. Un enlace histórico SC-200 prevalece sobre esa preferencia.

## 6. Presentación, carga y saneado

La interfaz SC-200 debe conservar textos, regiones premium, navegación, biblioteca, lector original/guiado, repaso, estadísticas, exportación, movimiento y manejo del foco. Sus mensajes de trece regiones siguen siendo ciertos para esa ruta. No reemplazarlos globalmente por cantidades Splunk.

La geometría reutilizable puede recibir un modelo de mapa Splunk, pero el adaptador de datos y las configuraciones visuales serán propios. Un mapa nuevo no debe marcar nodos «dominados» por teoría ni derivar premios desde animaciones. Render y persistencia siguen separados.

Carga: registro ligero de rutas; import dinámico del catálogo y vistas Splunk al seleccionarlo; payload por lección bajo demanda. No importar Markdown completo, cinco bancos, CSV o investigación al bundle inicial SC-200. La biblioteca Splunk carga su índice al abrirse. La caché lleva courseId+lessonId+revisión, es acotada y verifica versión; se cancelan peticiones al navegar. La persistencia guarda IDs/estado, no texto del curso.

Se aplican Markdown seguro y enlaces explícitos. No ejecutar código cercado ni interpretar HTML como una acción. Los enlaces del corpus se traducen mediante una lista de recursos educativos permitidos; un vínculo a SC-200 no expone el archivo original sin saneado.

El saneado SC-200 queda idéntico. Para Splunk, los CSV sintéticos declarados pueden necesitar IPs RFC 5737 e identidades example.test: cualquier excepción se limita a archivo/hash/columna aprobados y a datos de documentación, nunca a tokens, claves privadas o datos reales. GUID didácticos no se usan como excepción global a identificadores. Guardar hash de fuente y representación saneada y probar reconstrucción.

Los contratos DATASETS.json y normalize_fixture prueban mapeos en memoria. No equivalen a configurar timestamps, aliases o lookups reales. `_indextime` no se fabrica a partir de indexed_at_utc; el campo de simulación es fixture_index_epoch. Mantener etiquetas diferenciadas de documento, cálculo offline y ejecución real.

Esta separación de carga y almacenamiento versionado recoge la revisión con la skill vercel-react-best-practices. No exige nuevas dependencias ni altera archivos React en esta fase.

## 7. Piloto de 3–5 lecciones y criterios de aceptación

Propuesta concreta: SP-R01-L01 a SP-R01-L05; puede comenzar con las tres primeras. Permite comprobar productos, arquitectura, metadatos, lectura de SPL, MCQ, práctica formativa y citas sin saltarse dependencias previas. Las lecciones con CSV de regiones posteriores se prueban offline ahora y se incorporarán en un lote posterior, después de aprobar sus prerrequisitos. El piloto no pretende demostrar cobertura de las once regiones.

Antes de autorizarlo: revisar humanamente las preguntas y citas de las 3–5 lecciones elegidas, aprobar los parámetros de XP propuestos o ajustarlos y fijar el conjunto exacto del piloto. Estos son pendientes concretos, no una petición para repetir el diagnóstico.

Durante el piloto usar fixtures de progreso, un origen de prueba y perfiles temporales. No abrir ni exportar el perfil/progreso personal por iniciativa del agente. Puertas de aceptación:

- Igualdad exacta antes/después de los 13/76/719/272 IDs y de versiones/revisiones/payloads SC-200. Sin cambios en el currículo canónico ni Markdown original.
- Mismos XP, nivel, bonus, últimas posiciones e historial de SC-200 en casos vacío, parcial, completo legacy, V2.4/V2.5 y corrupto; antes de abrir Splunk, después, tras recarga, entre pestañas y al exportar.
- Un spy de almacenamiento confirma cero lecturas de migración y cero escrituras SC-200 por acciones Splunk. El selector no concede XP ni finalización. Volver a SC-200 no importa registros Splunk.
- IDs estables de pregunta/opción, primera respuesta por intento, umbral exacto, intento vacío rechazado, teoría separada de práctica, repetición sin XP ilimitado y revisiones sin pérdida del historial.
- Catálogo/payload faltante o hash/revisión incorrecta muestran error recuperable, no una lección de otra ruta. Verificar carga diferida en la red y cancelación de peticiones.
- Navegador a 320/390/768/1440 px, foco visible y de retorno al nodo, teclado/Escape/Atrás, movimiento reducido y pantallas de error. Axe y pruebas de accesibilidad realmente ejecutadas; no solo preparadas.
- Presupuesto de rendimiento comparado con la referencia actual: medir JS/CSS inicial, carga diferida y tareas largas; no afirmar FPS por una compilación.
- `npm test`, TypeScript/build y pruebas de navegador de la versión integrada, con resultados y limitaciones publicados. La generación de esa fase debe demostrar aislamiento de destinos antes de activarla.

## 8. Ampliación y rollback

Orden: piloto R01; R01–R03; R04–R05; R06–R07; después R08–R09 y R10–R11. Cada lote tiene referencias humanas revisadas, contratos, tests y etiquetas de evidencia. No repetir la investigación general ni habilitar evaluaciones afectadas por un pendiente no resuelto.

Rollback propuesto: desactivar la ruta mediante configuración de despliegue local y recuperar código/derivados compatibles; conservar ambos almacenes. No borrar claves ni restaurar automáticamente un progreso antiguo que sobrescriba avances recientes. Si la estructura de un almacén no es legible por una versión, bloquear su escritura y permitir exportación; no reinterpretarlo como progreso vacío.

La validación real en Splunk será otra autorización con versiones, datos y permisos definidos. Ningún PASS de esta entrega da licencia para conectarse, ingerir CSV, crear jobs, alertas o playbooks. C01/C02 quedan **resueltos como diseño propuesto y comprobable**, con implementación y regresión del piloto pendientes.

**Punto de parada: esperar autorización del usuario para el piloto React.**
