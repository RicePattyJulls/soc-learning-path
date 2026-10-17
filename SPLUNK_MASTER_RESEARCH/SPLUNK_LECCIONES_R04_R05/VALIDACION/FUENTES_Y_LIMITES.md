# Fuentes oficiales y límites de evidencia

**Consulta documental:** 2026-10-16. Publicaciones en el portal oficial de Splunk, versión indicada por cada URL. Los productos y las versiones del laboratorio local no fueron inspeccionados.

## Bibliografía por ID

- **S01 — Estadísticas: stats, eventstats, streamstats:** https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.0/calculate-statistics/use-the-stats-command-and-functions
- **S02 — streamstats (SPL clásico):** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.0/search-commands/streamstats
- **S03 — bin y ventanas discretas:** https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.0/search-commands/bin
- **S04 — join y límites documentados:** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/join
- **S05 — Job Inspector:** https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.0/manage-jobs/manage-search-jobs
- **S06 — rex (SPL clásico):** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.0/search-commands/rex
- **S07 — mvexpand (SPL clásico):** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.4/search-commands/mvexpand
- **S08 — Authentication CIM: campos y tags:** https://help.splunk.com/en/splunk-enterprise/common-information-model/6.0/data-models/authentication
- **S09 — CIM referencia: restricciones, tags y campos:** https://help.splunk.com/en/splunk-enterprise/common-information-model/8.7/data-models/how-to-use-the-cim-data-model-reference-tables
- **S10 — Validación CIM:** https://help.splunk.com/en/splunk-enterprise/common-information-model/6.3/using-the-common-information-model/use-the-cim-to-validate-your-data
- **S11 — tstats (SPL clásico):** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.2/search-commands/tstats
- **S12 — Aceleración de data models:** https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/9.1/use-data-summaries-to-accelerate-searches/accelerate-data-models
- **S13 — Lookups: definiciones y operaciones:** https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-lookups-in-splunk-web/about-lookups
- **S14 — lookup clásico, OUTPUT y OUTPUTNEW:** https://help.splunk.com/en/splunk-cloud-platform/search/search-reference/10.6/search-commands/lookup
- **S15 — Data models (comando y estructura):** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.0/search-commands/datamodel
- **S16 — Search job inspector avanzado:** https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.2/manage-jobs/view-search-job-properties
- **S17 — CIM Add-on: compatibilidad/versiones:** https://help.splunk.com/en/data-management/common-information-model/6.3/introduction/release-notes-for-the-splunk-common-information-model-add-on

## Precauciones que cambian el resultado

- **SPL clásico vs SPL2:** en este bloque predomina SPL clásico. No asumir que las variantes de SPL2 comparten la misma sintaxis en todos los despliegues.
- **Lab sin ejecutar:** no se conoce índice, sourcetype, extractores, permisos ni CIM instalado; los SPL ilustrativos no cuentan como consultas probadas.
- **Calendario:** fixtures fechadas 2026-10-16, por lo que `earliest=-24h` solo es un ejemplo estructural. Usar periodos correctos antes de probar en una instancia autorizada.
- **Seguridad:** no hay `outputlookup`, `collect`, `delete`, `map`, `script`, endpoints externos ni cambios de configuración. Abrir el CSV con Python es offline.
- **CIM:** los archivos de documentación de versiones CIM distintas pueden variar en datasets/campos. Revalidar against install/version/allowlist.
- **Resumen acelerado:** cifras 19/12/7 son de un fixture, no medición de Splunk ni estimación del rendimiento real.
- **LAB04-A corregido:** la fuente previa tenía tres fallos/dos usuarios pero umbral cinco. Este paquete separa esos antecedentes de la nueva fixture de siete fallos/cinco usuarios.

## Trazabilidad al corpus local

- `../../02_INVESTIGACION/SPLUNK_MASTER_RESEARCH_FASE3_R04_R11.md` — diseño y advertencias de R04/R05.
- `../../03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json` — 15 ID/títulos/resultados originales.
- `../../01_FUENTE_ORIGINAL/SC-200.md` — capítulos 04/05/06/07/08/09/10/13 como puentes temáticos, no equivalencias de producto.

## Revisión aún necesaria

QA técnica de preguntas y SPL por un humano, prueba de portabilidad en Splunk de versión conocida, prueba de consultas reales con datos autorizados, accesibilidad y adaptación del contrato de actividades antes de React.
