# Redes: contenido educativo redactado

18/10/2026. Autorización: preparar las lecciones antes de incorporarlas a la web.

**Estado posterior:** revisión educativa del autor completada con correcciones e integración en la aplicación local realizada. Consulta [INTEGRACION-LOCAL.md](INTEGRACION-LOCAL.md) y [REVISION-EDUCATIVA.md](REVISION-EDUCATIVA.md). Los estados de no integración recogidos abajo y en los artefactos editoriales describen la fase de redacción, anterior a la implementación web.

## Entrega

- **168 lecciones Markdown**, agrupadas en las 8 etapas y 42 módulos del catálogo.
- **336 preguntas de opción múltiple**, dos por lección, con cuatro opciones, orden determinista variado y respuesta razonada.
- **168 prácticas documentales** con respuesta de referencia y rúbrica, sin autocorrección de dominio práctico.
- **168 casos sintéticos resueltos**, diferentes entre sí y declarados como datos creados para enseñanza.
- **168 solucionarios separados** de las lecciones del estudiante.
- **20 guías de laboratorio** adaptadas de T5, con tareas, controles positivos/negativos, evidencias y restauración; conservan estado diseñado/no ejecutado.
- **77 referencias primarias** consultadas para redacción y revisión, con alcance y límites en el registro de fuentes.
- Glosario con **119 entradas de apoyo por módulo**, 336 justificaciones específicas y rúbricas concretas de las 168 prácticas.
- Recursos JSON docentes: caso integrador Empresa-Lab y fixture de 120 filas para métricas de detección, con solución del integrador separada.

Entrada: [00_INDICE-LECCIONES.md](../../REDES_MASTER_RESEARCH/00_INDICE-LECCIONES.md).

El total de secciones de aprendizaje suma 71.872 palabras, incluidos objetivos, vocabulario de consulta repetido por módulo, casos, enunciados, opciones y texto común de práctica. Ese conteo no acredita profundidad, tiempo de estudio ni dominio profesional.

## Organización y procedencia

| Carpeta | Contenido |
| --- | --- |
| `01_INVESTIGACION/` | Copia intacta del material entregado por el propietario |
| `02_LECCIONES/RED-E01/` a `RED-E08/` | Markdown de enseñanza y evaluación sin claves marcadas |
| `03_SOLUCIONES/` | Respuestas, justificaciones y solución del integrador |
| `04_ACTIVIDADES/` | Banco editorial con claves y rúbricas; no es un payload público del estudiante |
| `05_RECURSOS/` | Casos, fuentes, fixtures y guías de laboratorio |
| `VALIDACION/` | Catálogo editorial, hashes y trazabilidad de requisitos |

La redacción procede de los objetivos, títulos y adendas de la investigación y del contraste con documentación primaria. Los cálculos, casos y formulación pedagógica son elaboración nueva; no se han atribuido a capturas o ejecuciones reales.

Los originales T1–T7 permanecen intactos. Las 52 adendas tienen correspondencia con los módulos/lecciones para facilitar revisión, pero no se declara que todas estén técnicamente cerradas por esa asociación.

## Validación ejecutada

```sh
node scripts/check-redes-lessons.mjs
python3 -B scripts/check-redes-numerical.py
```

- **5.142/5.142 comprobaciones correctas:** inventarios, hashes, metadatos, Markdown, reconstrucción, dependencias, recursos locales, contratos de preguntas y rúbricas, entrega de revisión, separación de soluciones y anclas de enseñanza.
- El verificador también calcula la matriz de confusión del fixture, la variante con pérdida de telemetría y la corrección temporal del caso integrador.
- **16/16 comprobaciones numéricas independientes correctas:** subredes/VLSM, agregación, máscara incorrecta, expansión IPv6, selección de prefijo, capacidad del caso empresarial, MSS, PRI Syslog, tasas, pérdida y porcentaje del objetivo de servicio.
- Se comprobó que la copia de investigación y los catálogos SC-200/Splunk conservan las huellas registradas en la fase de arquitectura.

Informes: [VALIDACION-CONTENIDO.json](VALIDACION-CONTENIDO.json) y [VALIDACION-NUMERICA.json](VALIDACION-NUMERICA.json).

La lectura y corrección educativa del autor se documenta por separado en [REVISION-EDUCATIVA.md](REVISION-EDUCATIVA.md). Las comprobaciones automáticas no demuestran calidad semántica, eficacia de un laboratorio, calibración de evaluaciones o preparación para una certificación. El campo de revisión independiente conserva `pending_independent_review`. Las prácticas de análisis no conceden ejecución o dominio de configuración real.

## Conservación y siguiente fase

Los archivos en `scripts/redes-editorial/` son el material estructurado de autoría. `review.mjs` conserva las correcciones y criterios de la revisión educativa. `scripts/author-redes-lessons.mjs --write` reproduce la versión revisada y se detiene ante ediciones distintas; `--replace` puede sobrescribir revisiones y solo debe utilizarse después de revisarlas. El verificador no reescribe los Markdown.

La futura integración consumirá los Markdown como contenido educativo, con un adaptador que separe estudio, evaluación y soluciones. Los catálogos arquitectónicos originales conservan su condición de propuesta; `VALIDACION/CATALOGO-EDITORIAL.json` describe los archivos ya redactados y su procedencia.

No se modificó código servido por la academia, progreso ni mundos existentes. No se ejecutaron npm/build o navegador para esta entrega de contenido, ni se instalaron VMs, sensores o redes. La integración del Mundo Redes en la interfaz será la fase siguiente.
