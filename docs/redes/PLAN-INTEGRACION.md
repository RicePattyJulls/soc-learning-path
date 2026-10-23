# Mundo Redes: arquitectura para SOC Learning Path

18/10/2026. Alcance realizado: revisión de los artefactos entregados, consolidación curricular y diseño de su integración. Estado: arquitectura preparada; contenido de lecciones y mundo web pendientes de desarrollo.

**Estado posterior a este plan:** las 168 lecciones están redactadas, revisadas por el autor e integradas en la aplicación local. Consulta [INTEGRACION-LOCAL.md](INTEGRACION-LOCAL.md), [REVISION-EDUCATIVA.md](REVISION-EDUCATIVA.md) y el [índice del contenido](../../REDES_MASTER_RESEARCH/00_INDICE-LECCIONES.md). El resto de este documento conserva la propuesta y estados de la fase inicial.

## Resultado

La investigación se puede incorporar como **un tercer mundo educativo independiente**, junto a Microsoft Sentinel + Defender XDR y Splunk. El simulador continúa como área separada. Windows + AD y Linux conservan sus respectivos alcances futuros.

La base recibida permite definir el mapa, las dependencias y los objetivos, pero contiene **168 títulos propuestos**, no 168 lecciones desarrolladas. Tampoco trae datasets autoritativos o bancos de actividades completos para servir esas lecciones. Montar esos títulos como si fueran el curso terminado produciría nodos sin enseñanza ni evaluación verificable.

## Artefactos preparados

- [Catálogo propuesto](CATALOGO-PROPUESTO.json): 8 etapas, 42 módulos y 168 IDs de lección; prerrequisitos, objetivos de módulo, fuentes, adendas, laboratorios y cruces.
- [Etapas y lecciones](ETAPAS-Y-LECCIONES.md): inventario legible de los 168 títulos y sus agrupaciones.
- [Dependencias](DEPENDENCIAS.mmd): grafo Mermaid de los 42 módulos, organizado por etapa.
- [Validación estructural](VALIDACION-ESTRUCTURAL.json): hashes de fuentes, procedencia, resultados individuales y ajustes arquitectónicos.
- [Copia de investigación](../../REDES_MASTER_RESEARCH/README.md): 14 archivos preservados y comprobados frente a la carpeta proporcionada.

Se ejecutaron **75 comprobaciones estructurales/referenciales, 75 correctas**. Son comprobaciones locales de hashes, conteos, dependencias y enlaces propuestos. No son pruebas de navegador, de aprendizaje, de laboratorio ni una auditoría técnica completa de las fuentes externas.

## Traducción a la experiencia actual

**Mundo Redes → 8 mapas de etapa → nodos de lección → estudio, práctica y evaluación.**

Las 42 agrupaciones denominadas módulos por la investigación serán metadatos y secciones editoriales dentro de las etapas. No hace falta introducir una pantalla obligatoria de módulo entre el mapa y el lector.

| Etapa | Contenido | Módulos | Nodos propuestos |
| --- | --- | ---: | ---: |
| RED-E01 | Fundamentos, direccionamiento y lectura de tráfico | 6 | 24 |
| RED-E02 | Servicios, campus básico y redes inalámbricas | 5 | 20 |
| RED-E03 | Routing empresarial, WAN y rendimiento | 8 | 32 |
| RED-E04 | Arquitectura y seguridad de la red | 6 | 24 |
| RED-E05 | Observabilidad e investigación SOC | 6 | 24 |
| RED-E06 | Red Team de redes autorizado | 4 | 16 |
| RED-E07 | Automatización, cambio y operaciones | 4 | 16 |
| RED-E08 | Proyectos finales y defensa técnica | 3 | 12 |

El orden de etapas será el recorrido recomendado. Las dependencias determinarán qué lecciones se pueden estudiar, sin imponer como requisito toda una rama ajena. Por ejemplo, el módulo de alcance autorizado puede empezar tras sus fundamentos sin exigir que se complete previamente la especialización SOC entera.

El mapa más largo tendrá 32 nodos: requiere comprobar navegación, altura, tarjetas, foco y retorno al nodo en móvil. Se reutilizará la geometría adaptable existente y la medición de etiquetas; no se darán por válidas capturas de otros mundos para este número de nodos.

## Decisiones de arquitectura incorporadas

### IDs y dependencias

- Etapas: `RED-E01` a `RED-E08`.
- Módulos: se conservan `RED-M01` a `RED-M42`.
- Lecciones: `RED-M01-L01`, `RED-M01-L02`, etc. No colisionan con `RED-L01`, que en la investigación identifica un laboratorio.
- Laboratorios, casos y cruces: se conservan los IDs de investigación y su procedencia.
- Los cuatro títulos de cada módulo se enlazan en su orden propuesto; la primera lección requiere las últimas lecciones de sus módulos previos. Esta expansión a nivel de lección es **una decisión provisional de arquitectura**, no un grafo que ya viniera validado por el investigador.
- Las convalidaciones por diagnóstico requieren evidencia y una política propia; no se conceden por tener XP en Sentinel/Splunk.

### Correcciones T3 y T4

T2 se conserva como base de nombres y dependencias. Las correcciones de T3 se incorporan como requisitos editoriales a los 42 módulos; los diez módulos de especialización reciben también sus requisitos T4. Hay **52 registros de requisitos** vinculados a fuente y ubicación.

Esto resuelve que las adendas quedasen separadas de las fichas que se usarán para redactar. No afirma que sus cambios ya estén escritos, comprobados o aprobados en 168 lecciones: cada requisito permanece pendiente de desarrollo educativo.

### Recorrido de automatización corregido

El recorrido llamado `ruta_automatizacion_operaciones` en T2 llegaba a M39 y omitía M36, M37 y M38, donde se desarrolla la automatización explícita.

La propuesta usa como hitos **M38 y M39**, calcula su cierre de prerrequisitos e incorpora M25, M36, M37 y M38 al recorrido anterior. Queda en **25 módulos y 324 horas estimadas**, frente a los 21 módulos/258 horas del recorrido de origen. Los originales permanecen intactos y el cambio queda registrado.

El plan completo mantiene sus **592 horas estimadas**. Sus **275 horas estimadas de laboratorio ya están incluidas**; no se suman aparte. Las duraciones y umbrales de las rúbricas aún no están calibrados.

## Cómo se incorporará a la aplicación

| Responsabilidad | Ubicación o contrato propuesto |
| --- | --- |
| Entrada | `#/redes/ruta`; integración en `src/App.tsx` y `AcademySelector.tsx` |
| Mapa de etapa | `#/redes/etapa/RED-E01`, conservando retorno y foco al nodo |
| Lector | `#/redes/leccion/RED-M01-L01`, con estudio, práctica y evaluación |
| Componentes del mundo | `src/redes/`: aplicación, mapa, lector, recursos, contratos y adaptador de contenido |
| Markdown educativo | Paquetes nuevos dentro de `REDES_MASTER_RESEARCH/`, separados de `01_INVESTIGACION/` |
| Generación de contenido futuro | Un adaptador específico `scripts/prepare-redes.mjs`; el script actual `prepare-redes-plan.mjs` solo genera arquitectura documental |
| Salidas futuras | `src/generated/redes/` y `public/redes-content/`, regeneradas y sin edición manual |
| Progreso futuro | Clave independiente propuesta: `soc-learning-path:redes:learning:v1` |

Primitivas reutilizables revisadas: `mapLayout`, `fitMapLabels`, `useAdventureLayout`, paisajes/puentes y componentes de presentación. El mapa Splunk completo importa su propio catálogo, motor y URLs: se necesita un adaptador Redes, no montarlo con otro nombre.

El marco `LessonFrame` también contiene etiquetas Splunk fijas. La reutilización requiere parametrizar esas etiquetas conservando los valores actuales por defecto, o preparar un marco Redes equivalente. La decisión se comprobará contra las guardias antes de modificar código compartido.

Contenido, progreso y presentación tendrán responsabilidades separadas. Los cinco almacenes actuales, recompensas existentes y catálogos de los otros mundos no requieren migración para añadir Redes.

## Cruces con otros mundos

De los 29 cruces de T6:

- **6 con Microsoft y 5 con Splunk:** se identificaron candidatos con IDs y rutas que existen en los catálogos locales. Su existencia está comprobada; la cobertura precisa de cada concepto dentro del payload educativo sigue pendiente de revisión. Se registran como candidatos y no como enlaces ya activados.
- **5 con Windows/AD y 5 con Linux:** permanecen sin URL mientras no existan destinos educativos reales.
- **4 con el simulador:** requieren diseñar/adaptar casos y evidencias para su contrato actual; no se asume que tenga una API o un caso de red equivalente.
- **4 marcados PUR:** representan conexiones internas entre SOC y Red Team; no crean otro mundo ni otro almacén de progreso.

Las lecciones Redes enseñarán protocolos, topología, captura, flujos, sensores, segmentación y límites de la evidencia. Las consultas y funciones de Sentinel/Splunk se referenciarán en sus mundos cuando el destino esté confirmado. El catálogo propuesto conserva qué se aprende en cada lado.

## Trabajo necesario para tener lecciones utilizables

1. Redactar el primer paquete educativo a partir de los objetivos y adendas consolidadas: propuesta inicial **RED-M01–RED-M03**, 12 lecciones de fundamentos y direccionamiento con sus prerrequisitos completos.
2. Para cada lección, preparar objetivo propio medible, explicación, ejemplo trabajado, práctica, evidencia esperada, evaluación razonada, soluciones separadas y referencias con ubicación verificable.
3. Preparar fixtures sintéticos o evidencias revisadas para prácticas que se resuelvan dentro de la academia. Las prácticas documentales no concederán dominio de configuración o ejecución real.
4. Generar y comprobar el contenido saneado, reconstrucción, IDs y anclas de evaluación; mantener original e investigación como referencias.
5. Integrar selector, mapa, lector y progreso propio con ese primer paquete; comprobar guardias y regresión de los mundos existentes.
6. Ampliar las restantes etapas con el mismo contrato. Mantener visibles los estados de contenido escrito, revisado y pendiente.

Los 20 laboratorios de T5 siguen siendo diseños. Los aspectos de herramientas, evidencias, viabilidad y evaluación que T7 dejó abiertos se conservan en `openIssuesInherited`, sin presentarlos como resueltos por haber preparado la arquitectura. No se redistribuyeron imágenes ni se instaló o ejecutó infraestructura.

## Reproducción y estado de entrega

```sh
node scripts/prepare-redes-plan.mjs
```

El comando comprueba los artefactos antes de escribir y regenera solo los cuatro documentos derivados de arquitectura en esta carpeta. La propuesta manual de este archivo se conserva.

Durante este trabajo se copiaron las fuentes de investigación, se creó el generador documental y se generaron los artefactos citados. **No se ha añadido todavía una entrada Redes a la interfaz.** No se ejecutaron pruebas de aplicación o navegador porque no se modificó código servido por la academia; sí se ejecutaron las 75 comprobaciones del generador y la comparación de los 14 archivos contra sus originales.
