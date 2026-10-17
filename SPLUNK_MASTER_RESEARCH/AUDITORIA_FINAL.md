# Auditoría final de Splunk — SOC Learning Path

Fecha: 16/10/2026. Proyecto examinado: `/home/tommy/Documentos/SOC_LEARNING_PATH`. Revisión del agente, sin revisión humana independiente ni acceso a Splunk.

## Dictamen

**Hay 80/80 lecciones redactadas y correctamente identificadas, pero no procede autorizar su integración directa.** Los verificadores offline pasan; existen errores de contenido y limitaciones de evaluación que esas comprobaciones no detectan. Además, una importación ingenua podría reemplazar derivados de SC-200 o mezclar sus desbloqueos y XP.

Resultado: **2 riesgos críticos de integración, 10 hallazgos importantes y 6 menores**, detallados abajo. Los críticos describen consecuencias de una implementación futura incorrecta; no son incidentes ocurridos durante esta auditoría.

Se ha creado únicamente este informe. No se han corregido lecciones, bancos, scripts, React ni SC-200; no se ha accedido al progreso personal, perfiles del navegador, credenciales o servicios de laboratorio. Sin ataques, reinicios, commits ni publicación.

## Alcance y método

Se revisaron `AGENTS.md`, `docs/RETOMAR.md`, `docs/V2.5-ACADEMIA.md`, `docs/V25-ESTADO.md`, el currículo JSON, la investigación previa y los cinco paquetes: README, índices, manifiestos, fuentes/límites, 80 lecciones, cinco bancos, cinco solucionarios, cinco rúbricas, 22 laboratorios, 20 CSV y diez verificadores Python. Se contrastaron también el generador, el contrato educativo, el catálogo, el mapa y la persistencia actuales.

Las rutas de los hallazgos son relativas a `SPLUNK_MASTER_RESEARCH/`, salvo las que comienzan por `src/`, `scripts/`, `tests/` o `docs/`, relativas al proyecto. Los números corresponden a líneas físicas de los archivos auditados.

Se ejecutaron contrastes adicionales en memoria: igualdad de conjuntos de IDs con el currículo; títulos y resultados curriculares presentes; tres actividades por lección; correspondencia de opciones, soluciones y explicaciones entre las representaciones; duplicados exactos; SHA-256; rutas relativas ascendentes; lectura de CSV y agrupación temporal con epoch UTC completo. No se añadieron scripts al proyecto.

El origen SC-200 se procesó mediante las pruebas existentes, que utilizan `parseDocument` y `sanitize`, las mismas funciones de `scripts/prepare-content.mjs`. Se comprobó la reconstrucción íntegra del Markdown saneado sin ejecutar la parte del preparador que borra y escribe derivados. No se volcaron valores ocultados por el saneado ni se inspeccionaron almacenes de secretos.

La skill `vercel-react-best-practices` orientó la revisión de carga diferida y almacenamiento versionado. Su uso se limitó a recomendaciones de arquitectura; no produjo cambios de aplicación.

## Cobertura real

### Lecciones frente al currículo canónico

Referencia: `03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json`.

| Región | IDs encontrados, ambos extremos incluidos | Esperadas / encontradas | MCQ / abiertas |
| --- | --- | ---: | ---: |
| R01 | SP-R01-L01 … SP-R01-L05 | 5 / 5 | 10 / 5 |
| R02 | SP-R02-L01 … SP-R02-L06 | 6 / 6 | 12 / 6 |
| R03 | SP-R03-L01 … SP-R03-L07 | 7 / 7 | 14 / 7 |
| R04 | SP-R04-L01 … SP-R04-L08 | 8 / 8 | 16 / 8 |
| R05 | SP-R05-L01 … SP-R05-L07 | 7 / 7 | 14 / 7 |
| R06 | SP-R06-L01 … SP-R06-L08 | 8 / 8 | 16 / 8 |
| R07 | SP-R07-L01 … SP-R07-L08 | 8 / 8 | 16 / 8 |
| R08 | SP-R08-L01 … SP-R08-L08 | 8 / 8 | 16 / 8 |
| R09 | SP-R09-L01 … SP-R09-L08 | 8 / 8 | 16 / 8 |
| R10 | SP-R10-L01 … SP-R10-L08 | 8 / 8 | 16 / 8 |
| R11 | SP-R11-L01 … SP-R11-L07 | 7 / 7 | 14 / 7 |
| **Total** | **80 IDs únicos** | **80 / 80** | **160 / 80** |

No hay IDs ausentes, adicionales o duplicados. Los 80 títulos coinciden literalmente con el currículo y los 80 resultados de aprendizaje figuran en sus lecciones. No hay colisión con los 76 IDs actuales de SC-200. Los 240 IDs de actividad son únicos y cada lección tiene Q01, Q02 y P01.

Se verificaron las 160 claves de respuesta tanto dentro de las lecciones como en los solucionarios. Las opciones, explicaciones y 80 respuestas abiertas coinciden con sus bancos. **Coincidir entre copias no demuestra que una respuesta sea correcta:** el error I02 está reproducido en las tres representaciones.

### Qué significa esa cobertura

| Dimensión | Evidencia disponible |
| --- | --- |
| Redacción e identidad curricular | 80/80 documentos; 480.137 bytes de Markdown de lección |
| Actividades editoriales | 240: 160 MCQ y 80 abiertas con respuesta orientativa |
| Prácticas | 22 laboratorios diseñados; no son 22 laboratorios ejecutados en producto |
| Datos | 20 CSV sintéticos, 152 filas de datos |
| Ejecución real SPL / ES / SOAR | **Ninguna en esta auditoría; los paquetes declaran no ejecutado** |
| Integración Splunk en React | **0/80**; sigue siendo material externo |
| Revisión humana independiente | No aportada; pendiente |
| Dominio de las 80 competencias | No demostrado por existencia de texto, MCQ o fixtures |

No se confunde la academia SC-200 terminada como entrega con cobertura educativa absoluta: el estado verificable conserva **13 capítulos, 76 lecturas, 719 pasos, 272 actividades y 74/76 lecturas con actividades revisadas**. Las dos introducciones pendientes siguen sin dominio fabricado.

## Verificadores y pruebas ejecutadas

Antes de ejecutar se inspeccionaron los diez scripts Python. Usan lectura local y cálculos con biblioteca estándar. R04–R05 y R06–R07 lanzan su propio verificador de fixtures mediante `subprocess`; se revisaron también esos hijos. No se detectaron conexiones, escrituras, instalación, ataques ni control de contenedores. Se ejecutaron con `PYTHONDONTWRITEBYTECODE=1` y `python3 -B`.

| Paquete | comprobar_paquete.py | Verificador de fixtures | SHA-256 adicionales comprobados |
| --- | --- | --- | ---: |
| SPLUNK_LECCIONES_R01_R03 | PASS: 18 lecciones, 54 actividades | PASS: autenticaciones por IP/bucket | 33 / 33 |
| SPLUNK_LECCIONES_R04_R05 | PASS: 15 lecciones, 45 actividades | PASS, invocado por el comprobador | 33 / 33 |
| SPLUNK_LECCIONES_R06_R07 | PASS: 16 lecciones, 48 actividades | PASS, invocado por el comprobador | 32 / 32 |
| SPLUNK_LECCIONES_R08_R09 | PASS: 16 lecciones, 48 actividades | PASS: seis CSV | 37 / 37 |
| SPLUNK_LECCIONES_R10_R11 | PASS: 15 lecciones, 45 actividades | PASS: seis CSV | 37 / 37 |
| **Total** | **5/5 PASS** | **5/5 PASS** | **172 / 172** |

Los 172 son entradas de los cinco `SHA256SUMS.txt`, no 172 evidencias independientes de corrección técnica. El comprobador R10–R11 informa además de 36 entradas de su mapa interno de hashes; no debe confundirse ese mapa con las 37 entradas de su lista SHA256.

Comandos ejecutados desde la raíz del proyecto, con `<paquete>` sustituido por cada uno de los cinco nombres de la tabla:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B SPLUNK_MASTER_RESEARCH/<paquete>/VALIDACION/comprobar_paquete.py
```

Para R01–R03 se ejecutó además `PRACTICAS/scripts/verificar_fixture.py`; para R08–R09 y R10–R11, `PRACTICAS/scripts/verificar_fixtures.py`. En R04–R05 y R06–R07 ese segundo script se ejecutó como hijo del comprobador.

| Comprobación de SC-200 actual | Resultado y alcance |
| --- | --- |
| `npm --ignore-scripts test` | **42/42 PASS**, cero fallos. Se omitió deliberadamente `pretest`, que regenera archivos. Incluye reconstrucción/saneado, IDs, versiones, actividades, 80%, premios únicos, migración, revisiones y fusión entre pestañas con almacenamiento simulado. |
| `node_modules/.bin/tsc --noEmit --incremental false` | PASS, TypeScript estricto sin emitir archivos. |
| Vite programático con `configFile:false`, `base:'./'`, plugin Tailwind y `build:{write:false,emptyOutDir:false}` | PASS: siete salidas, 1.005.076 bytes sin comprimir, calculadas en memoria. No es una medida de descarga inicial ni benchmark. |
| `npm run build` convencional | **No ejecutado**: su `prebuild` regenera contenido y su build escribe artefactos. Las comprobaciones anteriores cubren tipos y empaquetado sin hacerlo. |
| Navegador / axe / perfiles de progreso | **No ejecutados en esta auditoría**. Existen pruebas e informes V2.5 previos; no se presentan como nuevas ejecuciones. |
| Splunk, REST, ES, SOAR, HEC y CLI Splunk | **No ejecutados ni consultados localmente**. |

No se ejecutaron `prepare:content`, `predev`, `pretest`, `prebuild` ni scripts de entrega que puedan regenerar informes. Los resultados offline no validan sintaxis contra el parser SPL, extracciones Windows, permisos efectivos, rendimiento, licencias o funcionamiento de ES/SOAR.

## Hallazgos críticos: bloquean un diseño de integración inseguro

### C01 — El preparador actual reemplaza la salida de SC-200

Archivos: `scripts/prepare-content.mjs:9`, `:17`, `:24`, `:31` y `:32`; `scripts/content.mjs:64` y `:85`.

El generador acepta una única fuente SC-200, borra recursivamente `public/content` y vuelve a escribir un catálogo único. Apuntar `SC200_SOURCE` a una concatenación de las lecciones Splunk reemplazaría los derivados actuales. Además, el parser identifica capítulos H1 y lecturas H2 y genera IDs a partir de títulos: no preservaría por sí mismo los IDs editoriales `SP-Rxx-Lxx` ni la unidad de las 80 lecciones.

Condición de cierre: importador explícito por manifiesto/ID y destinos independientes, sin sustituir el pipeline ni los artefactos de SC-200. Mantener saneado y comprobación de reconstrucción de cada fuente. No editar derivados a mano.

### C02 — Un solo catálogo y almacén mezclarían requisitos, estadísticas y XP

Archivos: `src/lib/catalog.ts:5`; `src/lib/progress.ts:21` y `:46`; `src/lib/learning.ts:28`, `:41` y `:64`; `src/lib/useProgress.ts:2`; `src/lib/adventure-catalog.ts:7`.

Los desbloqueos son acumulativos sobre el array de capítulos recibido. Añadir R01 después del capítulo 13 exigiría completar SC-200 para entrar en Splunk; intercalar regiones añadiría requisitos a SC-200. El porcentaje usa el número de lecciones del catálogo recibido y `totalXP` suma todos los premios del almacén. Compartir ese almacén podría aumentar XP/niveles de SC-200 con premios Splunk aunque sus lecturas no cambiasen.

Condición de cierre: contexto de ruta que seleccione catálogo, prerrequisitos y almacenamiento independientes; funciones puras compartidas cuando sea viable. No hay que copiar toda la lógica ni renombrar IDs existentes. Abrir o estudiar Splunk debe dejar intactos los registros y valores de SC-200.

## Hallazgos importantes

### I01 — REST: se generaliza indebidamente el prefijo v2

Archivo: `SPLUNK_LECCIONES_R10_R11/R11_AUTOMATIZACION_SOAR/SP-R11-L02.md:11`, `:13`, `:36`, `:37` y `:46`.

Se presentan creación y consulta de estado bajo `/services/search/v2/jobs` y `/services/search/v2/jobs/{sid}`. La referencia 10.2 citada documenta creación mediante `POST /services/search/jobs`, estado mediante `GET /services/search/jobs/{sid}` y resultados mediante `/services/search/v2/jobs/{sid}/results`. La migración a v2 afecta endpoints concretos; no autoriza cambiar todos los prefijos ni considerar obsoleta toda ruta sin v2. [Referencia oficial contrastada](https://help.splunk.com/en/splunk-enterprise/rest-api-reference/10.2/search-endpoints/search-endpoint-descriptions).

Es una discrepancia documental confirmada; no se probó un HTTP 404 ni la API de una instalación. Revisar texto y ejemplo antes de enseñar ese contrato.

### I02 — P01 de exfiltración omite parte del tráfico del CSV

Archivos: `SPLUNK_LECCIONES_R08_R09/R08_THREAT_HUNTING/SP-R08-L06.md:79`; `SPLUNK_LECCIONES_R08_R09/ACTIVIDADES/BANCO_ACTIVIDADES_R08_R09.json:423`; `SPLUNK_LECCIONES_R08_R09/ACTIVIDADES/SOLUCIONARIO.md:57`.

La respuesta dice que backup-01 envía 850 MB. `PRACTICAS/fixtures/net_egress.csv:2` y `:5`, dentro del mismo paquete, contienen 850.000.000 + 15.000.000 bytes al mismo destino: **865 MB decimales**. Finance-07 envía **190 MB al destino desconocido y 20 MB al portal aprobado**, total 210 MB. Decir 190 MB a destino desconocido es correcto; sería incorrecto usarlo como total del host.

El laboratorio `SPLUNK_LECCIONES_R08_R09/PRACTICAS/LAB08_C_SPRAYING_Y_EGRESO.md:38` sí explica ambos flujos y el verificador obtiene totales 865/210. Corregir coordinadamente las tres copias de la respuesta cuando se autorice; el hash actual solo preserva el error.

### I03 — Se confunde no coincidencia del detector con negativo de referencia

Archivo: `SPLUNK_LECCIONES_R06_R07/R07_DETECTION_ENGINEERING/SP-R07-L04.md:24`. Contraste: `SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/auth_activity.csv:15` a `:18`.

El procedimiento manda marcar «negativo NAT compartido» porque no alcanza cinco cuentas. Esas filas están etiquetadas `inconclusive`, y la propia lección exige verdad de referencia para TP/FP/FN/TN. No superar un umbral solo demuestra ausencia de coincidencia; no convierte un caso desconocido en TN ni demuestra benignidad del NAT.

Debe distinguirse la salida esperada de la regla de la clasificación real del caso. Aclarar si se pretende un negativo algorítmico o un control benigno con verdad documentada antes de calcular precisión/recall.

### I04 — Sesgo de respuestas y distractores débiles

Archivos: los cinco `ACTIVIDADES/BANCO_ACTIVIDADES_*.json`; ejemplos en `SPLUNK_LECCIONES_R06_R07/ACTIVIDADES/BANCO_ACTIVIDADES_R06_R07.json:13` y `SPLUNK_LECCIONES_R08_R09/ACTIVIDADES/BANCO_ACTIVIDADES_R08_R09.json:13`.

Distribución editorial de las 160 respuestas: **A=19, B=113, C=28, D=0**. Elegir B en los documentos da 15/16 en R06, 14/16 en R09 y 12/14 en R05: supera el 80% sin demostrar conocimiento. Varias alternativas falsas son atribuciones absolutas o acciones evidentemente ajenas a la pregunta, por ejemplo desactivar auditoría.

La aplicación actual ya reordena opciones (`src/components/QuestionCard.tsx:13`); por tanto, no se afirma que ese atajo funcione en una futura pantalla React. El sesgo sigue afectando al material estático y no resuelve la calidad de los distractores. Revisión pedagógica por conceptos, sin cambiar IDs de actividad y con IDs estables de opción en el adaptador.

### I05 — El banco editorial no satisface el contrato educativo de React

Archivos: `src/education.ts:1`, `:7` y `:13`; `scripts/education.mjs:60`; `src/lib/learning.ts:86`. Ejemplo de banco: `SPLUNK_LECCIONES_R01_R03/ACTIVIDADES/BANCO_ACTIVIDADES_R01_R03.json:7`.

El banco usa `question`, opciones como strings, `correct_index`, `multiple_choice/open_practice`, dificultades editoriales y referencias bibliográficas. React exige `prompt`, opciones con ID, `solution:string[]`, fase `practice/assessment`, tipos cerrados, referencias con cita/líneas/versión y metadatos de estudio/revisión. No basta con convertir nombres ni con forzar tipos TypeScript.

Las **80 abiertas son no autocorregibles** según los propios paquetes. El motor actual no admite texto libre evaluado por rúbrica. R01 propone 4/5 combinando test y práctica (`SPLUNK_LECCIONES_R01_R03/ACTIVIDADES/RUBRICA.md:7`); R04–R07 añaden condiciones de práctica humana. Eso no equivale al 80% del motor actual.

Se requiere decidir fases y significado de dominio Splunk. Una primera versión puede ofrecer abiertas como práctica formativa sin XP ni aprobación automática; no debe afirmar que con ello satisface el dominio práctico editorial. No reutilizar las dos MCQ en ambas fases sin explicitar el alcance y revisar la suficiencia de evaluación.

### I06 — Faltan contratos ejecutables de mapeo de datasets a SPL

Archivos: `SPLUNK_LECCIONES_R08_R09/PRACTICAS/fixtures/tgs_requests.csv:1`, `replication_events.csv:1` y `ti_indicators.csv:1`; `SPLUNK_LECCIONES_R08_R09/R09_ENTERPRISE_SECURITY/SP-R09-L07.md:36`.

TGS usa `event_id`, `service`, `encryption` y `event_time_utc`, mientras el SPL utiliza `EventCode`, `ServiceName`, `TicketEncryptionType` y `_time`. Replicación usa `event_id=4662`, no `EventCode`. TI ofrece `value`, `confidence_note` y `expires_at_utc`, mientras el lookup ilustrativo solicita `ip`, `confidence` y `expires_at`. No hay definición de ese lookup ni transformación equivalente entregada.

Las advertencias reconocen parte de estas diferencias; no son consultas declaradas operativas. Aun así, no existe paridad reproducible CSV→SPL. El ejemplo TI tampoco filtra vigencia: `isnotnull(confidence)` por sí solo no descarta un indicador caducado. Puede enseñar enriquecimiento, pero no producir la salida «solo vigentes» del laboratorio sin pasos adicionales.

No se puede simular `_indextime` histórico importando sin más `indexed_at_utc`: el primero representa indexación real. Un replay futuro debe separar tiempo sintético, tiempo de evento y metadatos reales. Versionar el contrato por dataset y verificarlo antes de declarar paridad.

### I07 — Los verificadores son útiles, pero su cobertura semántica es insuficiente

Archivos y límites concretos:

- `SPLUNK_LECCIONES_R01_R03/VALIDACION/comprobar_paquete.py:9`: comprueba contra su manifiesto; no abre el currículo canónico ni verifica SHA256. La auditoría adicional sí comprobó ambos.
- Los cinco `VALIDACION/comprobar_paquete.py` contrastan principalmente manifiestos/bancos locales; ninguno demuestra equivalencia técnica con Splunk ni corrección por fuente. La igualdad con el currículo se comprobó aparte.
- `SPLUNK_LECCIONES_R06_R07/PRACTICAS/scripts/verificar_fixtures.py:34`: la clave usa solo `minute//15`, sin hora ni fecha. En el fixture de una sola hora no falla; con varias horas/días mezclaría buckets distintos. El contraste adicional de esta auditoría utilizó epoch UTC completo.
- `SPLUNK_LECCIONES_R04_R05/PRACTICAS/scripts/verificar_fixtures.py:26`: enumerar siete filas y compararlo con 1…7 no prueba un acumulado por entidad ni la corrección de `streamstats`.
- `SPLUNK_LECCIONES_R08_R09/PRACTICAS/scripts/verificar_fixtures.py:33`: suma fallos por IP sin buckets; `:40` comprueba totales de red, pero no su concordancia con P01. Por eso pasan I02 e I10.
- `SPLUNK_LECCIONES_R10_R11/PRACTICAS/scripts/verificar_fixtures.py:25` y `:36`: comprueba etiquetas esperadas y agrupaciones del CSV. No ejecuta una política de autorización ni una máquina de estados idempotente; no prueba prevención efectiva de duplicados.

Ampliar pruebas de resultados derivados, fronteras, datos vacíos, duplicados y coherencia con solucionarios. Mantener su etiqueta offline. El PASS observado es correcto para las aserciones existentes; su alcance es el que debe acotarse.

### I08 — Trazabilidad bibliográfica demasiado amplia para algunas respuestas

Archivos: `SPLUNK_LECCIONES_R01_R03/R01_FUNDAMENTOS/SP-R01-L01.md:86` y `:87`; `SPLUNK_LECCIONES_R01_R03/ACTIVIDADES/BANCO_ACTIVIDADES_R01_R03.json:22`.

Q01 evalúa Mission Control de ES, pero las referencias asignadas A1/A2 son indexadores y escalado de componentes. No es evidencia específica suficiente para ese punto de producto. Debe enlazarse documentación de ES/Mission Control que sostenga la afirmación y fijar el contexto de versión.

Los códigos de referencia existen en los catálogos locales, pero esa comprobación no certifica que respalden cada oración. Además, D01 significa documentos distintos en R06–R07, R08–R09 y R10–R11: mantener ámbito por paquete al resolver fuentes. No unir todos los D01 en una tabla global.

Se resolvieron únicamente dudas documentales concretas, sin comprobar masivamente todas las URLs. La ruta CIM 8.7 de S09 en R04–R05 **sí devolvió el artículo esperado**; no se marca errónea por mezclar versiones. [Página oficial comprobada](https://help.splunk.com/en/splunk-enterprise/common-information-model/8.7/data-models/how-to-use-the-cim-data-model-reference-tables).

También se contrastó D13 de R06–R07: la detección oficial `8b1297bc…` trata solicitudes donde coinciden cuenta y servicio, en contexto de escalada, y **no debe atribuirse como regla Kerberoasting**. El paquete ya advierte correctamente esa diferencia; se conserva como acierto. [Detección oficial](https://research.splunk.com/endpoint/8b1297bc-6204-11ec-b7c4-acde48001122/).

### I09 — El caso final cambia el papel de una IP sin declarar otro escenario

Archivos: `SPLUNK_LECCIONES_R10_R11/R11_AUTOMATIZACION_SOAR/SP-R11-L05.md:47` y `SPLUNK_LECCIONES_R10_R11/R11_AUTOMATIZACION_SOAR/SP-R11-L07.md:47`; `SPLUNK_LECCIONES_R10_R11/PRACTICAS/LAB11_C_PROYECTO_FINAL.md:3`.

R11 llama proxy compartido a 203.0.113.15 y remite a lecturas R06–R09. En `SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/authorized_context.csv:2`, esa IP representa mantenimiento de svc-batch/app02; el proxy documentado está en `:4`, 192.0.2.44. Puede ser un escenario nuevo legítimo, pero no está identificado como tal ni existe un nuevo inventario que lo establezca.

La SPL final exige al menos tres usuarios (`SPLUNK_LECCIONES_R10_R11/R11_AUTOMATIZACION_SOAR/SP-R11-L07.md:39`); la cohorte .15 del fixture R06 tiene cinco fallos de **una** cuenta y no cumple. El paquete R10–R11 no aporta un CSV de autenticación propio. Especificar dataset, escenario, control benigno y caso candidato antes de calificar el proyecto transversal.

### I10 — Recuentos globales no equivalen a recuentos por bucket o corte de ingesta

Archivos: `SPLUNK_LECCIONES_R08_R09/PRACTICAS/fixtures/auth_activity.csv:9` a `:13`; `SPLUNK_LECCIONES_R08_R09/R08_THREAT_HUNTING/SP-R08-L04.md:36`; `SPLUNK_LECCIONES_R06_R07/R06_CENTRO_SOC/SP-R06-L01.md:32`.

En R08, B01–B05 suman cinco fallos globales de paula. Con buckets UTC de 15 minutos, **cuatro** caen a las 11:00 y **uno** a las 11:15; no existe un bucket de cinco. El verificador suma por IP y no detecta esa diferencia. La regla multiusuario sigue descartando ese origen, pero no debe usarse «cinco fallos» como resultado por bucket ni como FP de una regla `count>=5` discretizada. El laboratorio LAB08-C usa correctamente un agregado global: debe conservarse esa distinción.

En R06, la búsqueda de L01 limita `_time` a 09:00–09:15 y no codifica corte histórico de indexación: ejecutada después de llegar A021 contemplaría **siete**, no seis fallos. Las seis observaciones de la alerta simulada son válidas al corte 09:16, como explica LAB06-A. Fijar explícitamente ese snapshot en las instrucciones y resultados; no presentar el mismo conjunto como si ambas lecturas debieran coincidir siempre.

## Hallazgos menores

| ID | Archivo y línea | Hallazgo y tratamiento propuesto |
| --- | --- | --- |
| M01 | `SPLUNK_LECCIONES_R01_R03/R03_SPL_BASICO/SP-R03-L05.md:17` | Se dice que `dc(user)` «estima». La documentación diferencia `dc/distinct_count`, que cuenta valores distintos, de `estdc`, estimada. Ajustar el término; no trasladar automáticamente la aproximación de KQL `dcount`. [Referencia oficial](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.2/statistical-and-charting-functions/aggregate-functions). |
| M02 | `SPLUNK_LECCIONES_R04_R05/R04_SPL_AVANZADO/SP-R04-L04.md:41` | El caso dice siete fallos válidos y uno adicional vacío: implica ocho. El primer bucket utilizado por la práctica tiene siete **en total**, uno vacío. Puede ser otro escenario hipotético, pero debe indicarse para evitar una contradicción aparente con P01 y el CSV. |
| M03 | `SPLUNK_LECCIONES_R06_R07/VALIDACION/FUENTES_Y_LIMITES.md:34` | Las tres rutas `../01_…`, `../03_…`, `../02_…` desde VALIDACION no resuelven; necesitan dos niveles de subida para alcanzar la raíz de investigación. Son referencias en código inline, aunque no enlaces Markdown activos. |
| M04 | `SPLUNK_LECCIONES_R06_R07/R07_DETECTION_ENGINEERING/SP-R07-L03.md:80`; `SPLUNK_LECCIONES_R06_R07/ACTIVIDADES/BANCO_ACTIVIDADES_R06_R07.json:807`; `SPLUNK_LECCIONES_R06_R07/ACTIVIDADES/SOLUCIONARIO.md:58` | Queda el apunte editorial «Windows/473? No inventar ID adicionales». No es una referencia técnica válida; resolver o retirar tras autorización en las tres copias. |
| M05 | `README_PRIMERO.md:14` y `:17`; `02_INVESTIGACION/SPLUNK_MASTER_RESEARCH_FASE1.md:122` | La portada conserva el estado anterior a los cinco paquetes; la fase inicial propone IDs `splunk:r01:…` diferentes a los SP-Rxx posteriores. Conservar como historia, pero señalar qué inventario y convención son canónicos para que no se creen duplicados futuros. |
| M06 | `SPLUNK_LECCIONES_R10_R11/ACTIVIDADES/BANCO_ACTIVIDADES_R10_R11.json:5`, frente a los otros cuatro bancos `:5` | Usa `grading_policy`, mientras los otros usan `graded_policy`. Normalizar mediante contrato explícito; no ignorar silenciosamente la política al importar. |

## Duplicados y coherencia entre datasets, consultas y resultados

No hay lecciones idénticas completas ni preguntas, explicaciones de MCQ o respuestas abiertas exactamente duplicadas entre los cinco bancos. Esto es comparación literal, no garantía de ausencia de paráfrasis o redundancia pedagógica.

En los bloques de lección identificados como búsquedas SPL hay 66 fragmentos y 64 textos distintos. Se repiten exactamente R03-L06/L07 y R05-L06/L07. La repetición encaja con progresión concepto→caso y aceleración→diseño; no justifica eliminar IDs. También se repiten temas de spraying, límites de producto y corroboración de evidencia a lo largo de regiones. Revisión humana debe decidir si la dificultad y la tarea nueva justifican cada repetición.

| Paquete / dataset o caso | Resultado offline confirmado | Límite o discrepancia |
| --- | --- | --- |
| R01–R03 / auth_sintetico.csv | 10 filas; .9 a 09:00: 6 fallos/5 identidades; 09:15: 1/1; otros grupos 1/1 y 1/0 | Mapear timestamp_utc a tiempo de evento; vacío no debe contarse como identidad. |
| R04–R05 / auth_events.csv | 12 filas, 10 fallos; .9: 7/5 en primer bucket, 2/2 en segundo; 9 fallos/6 identidades no vacías en total | El evento vacío ya forma parte de los siete; M02. |
| R04–R05 / auth_raw.csv y asset_inventory.csv | 6 registros crudos; 5 login, 4 con IP, 5 con identidad; proceso 4688 excluido; inventario de 2 activos | No demuestra tags, constraints ni cumplimiento CIM real. |
| R04–R05 / acceleration_coverage.csv | 3 filas, 19 eventos fuente, 12 resumidos, 7 no resumidos | No ejecuta tstats ni mide backfill. El LAB04-A histórico de FASE3 tenía 3 fallos/2 usuarios y no supera cinco; el paquete posterior usa otra fixture y explica la corrección. |
| R06–R07 / auth_activity.csv y authorized_context.csv | 21 autenticaciones y 3 contextos; candidato 6/6 a 09:16, 7/6 retrospectivo; mantenimiento 5/1; NAT 4/3 | I03 e I10; los datos etiquetan incertidumbre, no ataque comprobado. |
| R06–R07 / kerberos_tgs.csv | 16 solicitudes; cohortes 6/6 servicios RC4, 5/1 RC4 autorizado, 4/4 AES y 1 sin cifrado | ServiceName sintético no demuestra SPN real; sin ground truth de ataque no calcular FN como certeza. |
| R08–R09 / tgs_requests.csv | 16 filas; temp.user 6/6 servicios, backup 5/1, audit.user 4/4, helpdesk 1/sin cifrado | LAB08-A usa 30m y la lección 15m: el candidato positivo coincide en este fixture; las ventanas no son intercambiables en general. |
| R08–R09 / replication_events.csv | 8 operaciones sintéticas, 5 con autorización descrita y 3 desde WKST-17 no inventariado | operation_kind es una etiqueta inventada; no parser de Properties/GUID de 4662. |
| R08–R09 / auth_activity.csv | 12 filas; .33: 6 fallos/6 cuentas y 1 éxito; .44: 5/1 global, 4/1 y 1/1 por buckets | I10; un único éxito y un único host en el archivo no ejercitan una transición positiva entre hosts ni persistencia. |
| R08–R09 / net_egress.csv | 4 flujos: backup 865 MB; finance 210 MB, separados en 190 desconocidos y 20 aprobados | I02. |
| R08–R09 / synthetic_es_findings.csv | 8 registros: alice 75/3; backup 36/2; bob 22/1; charlie 15/1; proxy 20/1 | Solo 3 filas tienen finding_type=finding; las otras 5 son intermediate_finding sintéticos. No son ocho findings visibles comprobados en analyst queue. La suma no reproduce el scoring ES. |
| R08–R09 / ti_indicators.csv | 3 indicadores; I01 e I03 vigentes al 16/10/2026; I02 caducado | I06; fecha de referencia fija, no reloj del entorno. |
| R10–R11 / retention_plan.csv | 4 planes; días equivalentes 13,33; 90; 20; 120. Insuficientes auth_training y netflow_training | Modelo capacidad/ingesta; no retención medida ni comportamiento de buckets comprobado. |
| R10–R11 / ingestion_diagnosis.csv | 4 casos; DC02 lag 1800s; DC03 acceso denegado; APP01 posible duplicación | Etiquetas sintéticas, no diagnóstico confirmado del laboratorio. |
| R10–R11 / search_jobs.csv | 3 variantes; A/B comparten marcador de salida; B reduce scan 88% y tiempo ficticio 83,33%; C cambia resultado | SAME-A-B es un rótulo, no hash criptográfico ni equivalencia demostrada en Splunk. |
| R10–R11 / api_job_lifecycle.csv | 4 casos editoriales: lectura, expirado, denegado, count=0 rechazado por política | No prueba endpoint, RBAC o expiración real; I01/I07. |
| R10–R11 / soar_actions.csv y automation_runs.csv | 5 intenciones y 8 intentos; 1 applied, replay, unknown, forbidden, transient, complete, pending e invalid; 6 claves distintas | No prueba aprobación efectiva, idempotencia transaccional ni compensación; I07. |

Los índices/sourcetypes en mayúsculas son marcadores. Las fechas de los fixtures son fijas y `earliest=-24h` o `-1h` dependen de cuándo se ejecuten. La equivalencia futura debe fijar rango absoluto, zona, población, campos vacíos, clave de agrupación y corte de disponibilidad de datos. Nada de lo anterior certifica las 66 búsquedas como sintáctica u operacionalmente válidas en Splunk.

## Compatibilidad y preservación de SC-200

La geometría del mapa admite cantidades distintas de nodos y la aplicación ya separa varias funciones puras de contenido/progreso/presentación. Es una base reutilizable. No existe todavía un selector funcional de rutas educativas independientes: `sc200Adventure`, catálogos importados globalmente, visuales por IDs de capítulo y mensajes como «trece regiones» están ligados a SC-200 (`src/lib/adventure-catalog.ts:7`, `src/lib/region-visuals.ts:20`, `src/components/LearningReader.tsx:72`). Cambiar únicamente el título del mapa sería insuficiente.

Preservar como invariantes:

1. **Identidad:** los 13 IDs de capítulo, 76 IDs de lectura y versiones, 719 IDs de paso y 272 actividades SC-200. Mantener también revisiones educativas y enlaces de compatibilidad V2.4; no recalcularlos por introducir Splunk.
2. **Almacenamiento:** `soc-learning-path:progress:v1` y `soc-learning-path:learning:v2` conservan claves y esquema. El guardado actual no escribe ni borra la clave legacy y protege datos corruptos (`src/lib/learning-storage.ts:5`, `:15`, `:26`). No leer/migrar esas claves para inicializar Splunk.
3. **Registros:** conservar `legacy`, `records[id][revision]`, pasos vistos, cursor, resumen, respuestas, primera respuesta por intento, errores, historial, premios, premios de capítulo y lastLesson SC-200. La ruta Splunk necesita su propia última posición.
4. **XP:** recompensas actuales 5/5/5/15/15/5, bonus de capítulo 100, nivel cada 250 y suelo legacy de 25 por lectura. Mantener premios únicos por ID, también tras recarga, revisión, repaso y fusión entre pestañas. No aumentar XP por abrir Splunk o cambiar de ruta.
5. **Evaluación:** 80%, estudio/práctica/resumen previos, primera respuesta por intento y distinción completado/dominado. Las dos lecturas SC-200 sin actividades no deben adquirir dominio al importar otro curso.
6. **Origen y exportación:** mantener mismo protocolo/host/puerto y perfil para conservar almacenamiento del usuario; cambiar el hash de navegación no cambia origen. Conservar formato y contenido de exportación SC-200; una exportación Splunk debe identificar su ruta y esquema.

Recomendación inicial: un almacén propio como `soc-learning-path:splunk:learning:v2`, con catálogo y prerrequisitos propios; mantener el motor puro compartido mediante adaptadores. El nombre es una propuesta pendiente de aprobación, no una clave creada. Un XP global entre cursos requeriría decisión específica; el plan base mantiene estadísticas separadas.

Mantener payloads por lección y carga diferida. No importar las 80 lecciones, los cinco bancos y los CSV dentro del bundle inicial. Conservar la caché acotada y la validación de versión de `src/components/Reader.tsx:29`. Las referencias SC-200↔Splunk deben vivir en una tabla conceptual aparte, sin marcar completadas lecturas de un curso por estudiar el otro.

El saneado actual oculta IPs, correos y GUID además de credenciales (`scripts/content.mjs:15`). Su reutilización literal sobre fixtures sintéticos podría ocultar columnas necesarias para ejercicios. La futura política debe distinguir fixtures sintéticos declarados de datos sensibles reales, sin desactivar protección de secretos ni modificar SC-200. Mantener hashes de fuente y representación saneada y reconstrucción sin pérdida del texto autorizado.

## Dudas que requieren revisión humana

- ¿Qué significa «dominar Splunk»: conceptos autocorregibles, calidad de investigación revisada o ejecución real? Aprobar dos MCQ no acredita escribir SPL ni investigar casos. Resolver I05 antes de asignar premios.
- ¿Quién revisa las 80 prácticas abiertas y registra la revisión? No existe ese flujo en la V1 local. No incorporar backend, cuentas ni servicios para resolverlo implícitamente.
- ¿El caso .15 de R11 pretende otro universo sintético o reutiliza R06? Fijar inventario y escenario; no corregir una IP por suposición.
- ¿El NAT de R07-L04 es un caso benigno conocido o inconcluso? Su etiqueta actual obliga a no tratarlo como TN de una matriz de verdad.
- ¿Se quiere una ruta lineal o ramas? La investigación permite administración/automatización y ES opcional; el mecanismo actual exige todos los capítulos anteriores. Los prerrequisitos deben decidirse por ruta y producto.
- ¿Qué versión/dialecto/productos se tomarán como referencia? Los paquetes mezclan Enterprise 9.x/10.x, CIM y ES de diversas versiones y SOAR Cloud. Las URLs consultadas no inventarían la instalación ni su licencia.
- ¿Son suficientes los ejemplos de movimiento lateral/persistencia y los ejercicios de SPL avanzado? Existen tareas conceptuales, pero faltan fixtures positivos para algunas competencias. Una revisión de dificultad debe evaluar esto sin exigir ataques.
- ¿Se revisarán fuentes externas afirmación por afirmación y distractores por un especialista? Esta auditoría del agente no sustituye esa revisión ni mide aprendizaje de alumnos.

## Plan de integración por fases — propuesta, no ejecutada

### Fase 0 — Autorizar alcance y congelar la referencia

Aprobar este informe y decidir tratamiento de hallazgos. Preparar en una fase autorizada respaldo del código/derivados e inventario de IDs, versiones, revisiones y hashes; exportar progreso solo con el usuario y sin exponerlo. Fijar estadísticas SC-200 como referencia. Elegir ruta, política de dominio y alcance estrictamente local. Este informe no autoriza ninguna corrección por sí mismo.

### Fase 1 — Cerrar contenido y pruebas offline

Corregir los hallazgos aceptados en fuentes editoriales, bancos y solucionarios conjuntamente, manteniendo los 80 IDs y 240 IDs de actividad. Resolver los casos ambiguos con revisor. Definir diccionarios por CSV, ventanas/cortes y resultados por grupo. Ampliar verificadores según I07; regenerar manifiestos/hashes tras las correcciones autorizadas. Revisar pedagógicamente distractores, respuestas y dominio.

Salida: paquete editorial consistente y etiquetado «revisado / verificado offline» por su alcance. No «probado en Splunk».

### Fase 2 — Especificar e implementar el adaptador aislado

Con autorización posterior, definir registro de rutas `sc-200`/`splunk`, contratos de catálogo y educación, destinos derivados independientes, claves de almacenamiento y URLs que conserven las existentes. Validar opciones con ID, fases, citas, rangos y revisiones deterministas. Importar lecciones por ID del currículo; no por posición ni títulos convertidos a slug. Excluir soluciones de la presentación previa a evaluación sin perderlas como fuente/solucionario.

Mantener módulos puros compartidos y adaptadores de catálogo/almacenamiento/presentación separados. No ejecutar efectos externos desde un bloque SPL, enlace o actividad. Las abiertas permanecen formativas salvo política humana explícita compatible con la V1.

### Fase 3 — Piloto local de 3–5 lecciones

Elegir fundamentos, una búsqueda básica, una práctica con fixture y una distinción de producto. Probar ruta Splunk sin completar SC-200; volver a SC-200 y comprobar igualdad del progreso previo. Añadir pruebas pertinentes de carga bajo demanda, citas, fallos de contenido, completado/dominio, 80%, premios únicos, datos corruptos y aislamiento entre pestañas/rutas.

Ejecutar las pruebas de navegador en perfiles y origen de prueba aislados: teclado, foco de retorno, Atrás/Escape, movimiento reducido y 320/390/1440 px. Ningún escenario debe usar el perfil o LocalStorage personal. Comparar capturas, accesibilidad y carga inicial con la referencia SC-200.

### Fase 4 — Ampliar por paquetes con puertas de regresión

Incorporar R01–R03, R04–R05 y R06–R07 por lotes; después R08–R09 y R10–R11 con dependencias de producto visibles. No exigir ES/SOAR instalados para estudiar teoría. Tras cada lote, validar contenidos, aislamiento y pruebas afectadas; ejecutar la batería completa antes de dar por cerrada la integración. Mantener rollback del código y derivados sin borrar progreso.

### Fase 5 — Validación real de producto, opcional y separada

Solo con autorización específica e inventario permitido, preparar laboratorio no productivo con datos sintéticos y versiones conocidas. Verificar mapeos, rangos, roles y salida real de cada consulta seleccionada contra el resultado offline. Registrar versión, dialecto, configuración pertinente, consulta, fuente/hash de datos, SID si procede, resultados y límites. Para ES/SOAR exigir evidencia de esos productos; una prueba de Enterprise no valida sus flujos.

No se necesitan ataques para contrastar estas búsquedas con fixtures. Acciones disruptivas, webhooks o integraciones reales no forman parte de la integración educativa V1. Publicación o despliegue externo seguirían requiriendo su propio alcance autorizado.

## Criterios para autorizar la integración

La autorización debe ser gradual. Para autorizar un **piloto local educativo** hacen falta:

- Aceptación explícita del alcance y de la política de dominio/abiertas, sin cambiar SC-200 ni añadir backend, autenticación, cloud o integraciones externas.
- Cierre de C01/C02 en el diseño revisable y de los hallazgos importantes que afecten al piloto. Registrar los diferidos y evitar habilitar lecciones afectadas como evaluaciones aprobadas.
- Igualdad canónica 80/80 IDs y 240 IDs de actividad, sin colisiones; contratos de contenido y progreso comprobables; fuente, versión, cita y nivel de evidencia por actividad.
- Resultados esperados sin contradicciones en las lecciones habilitadas; pruebas por bucket/corte/destino y casos insuficientes separados de negativos.
- Revisión técnica/pedagógica humana documentada del material que se vaya a evaluar; hashes nuevos después de cambios autorizados.
- Preservación de los 13 capítulos, 76 lecturas, 719 pasos, 272 actividades, revisiones y premios SC-200; pruebas con fixtures de progreso verifican igualdad antes/después y ninguna escritura de las claves SC-200 por acciones Splunk.
- Tests unitarios y TypeScript/build de la versión integrada, más pruebas de navegador realmente ejecutadas para el piloto y la regresión afectada. Informar por separado lo preparado, ejecutado, fallido y pendiente.
- Accesibilidad, foco visible, movimiento reducido, diseño de 320 px y carga bajo demanda; sin prometer rendimiento por una compilación.
- Rollback ensayable que quite la funcionalidad nueva sin eliminar ni reescribir progreso SC-200.

Para autorizar **toda la ruta**, estos criterios deben cubrir todos los lotes y los hallazgos importantes deben estar resueltos o sustituidos por decisiones explícitas con alcance visible. Para usar la etiqueta **«probado en Splunk»**, además hacen falta las ejecuciones y evidencias de Fase 5 para cada consulta o flujo que reciba esa etiqueta. Puede existir una academia documental/offline honesta sin esa etiqueta; no puede presentarse como validación real.

## Referencia de integridad y cierre

- SHA-256 del currículo auditado: `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933`.
- SourceHash SC-200 del catálogo actual, confirmado por las pruebas de fuente: `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`.
- Comparación final de SHA-256 contra el inventario inicial: **379 archivos de contenido, código, pruebas y documentación sin cambios, sin altas ni bajas en ese conjunto**. El único entregable nuevo, este informe, queda fuera de esa comparación. No se usó Git: la carpeta no se reconoce como repositorio Git en este entorno.

**Estado final: auditoría entregada; integración no autorizada ni implementada. Esperar autorización del usuario antes de modificar material o integrar Splunk.**
