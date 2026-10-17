# SOC Learning Path — Investigación Splunk consolidada
## Cierre de cobertura curricular documental (16/10/2026)

**Qué se ha terminado:** identificación y diseño curricular de las **11 regiones**, con **80 lecciones propuestas** (`R01–R03`: 18; `R04–R11`: 62), relaciones principales con tu documento de 13 capítulos SC-200, bloques de práctica, rúbricas, riesgos, priorización para SOC N1/N2 y referencias externas. El trabajo se ha dividido en **tres entregables de investigación** y un mapa JSON auxiliar.

**Qué NO se ha terminado:** implementación web Splunk; elaboración exhaustiva y validación experimental de cada una de las 80 lecciones; ejecución de consultas SPL en tu instancia; evaluación empírica sobre datos reales; comprobación de licencias ES/SOAR; inspección del código de la academia; integración del progreso. Todo ello está fuera de esta investigación documental. El trabajo posterior requerirá aprobación por fases.

## Archivos entregados (en el mismo directorio)

1. `SPLUNK_MASTER_RESEARCH_FASE1.md` — inventario de capítulos SC-200, primera matriz de correspondencias y propuesta de 11 regiones.
2. `SPLUNK_MASTER_RESEARCH_FASE2_BLOQUE1.md` — desarrollo de R01–R03, **18 lecciones**, **7 ejercicios diseñados** y **12 preguntas con respuestas**, sin ejecución real.
3. `SPLUNK_MASTER_RESEARCH_FASE3_R04_R11.md` — desarrollo de R04–R11, **62 lecciones**, casos de laboratorio propuestos, matriz KQL↔SPL, evaluación, auditoría crítica y **29 enlaces de referencia**.
4. `SPLUNK_CURRICULO_R01_R11.json` — extracto estructurado de 80 lecciones con IDs propuestos. **No** se ha importado en la academia. Es solo un índice máquina-legible para futuras etapas.

## Inventario completo de regiones y prioridades

| Región | Materia | Lecciones propuestas | Prioridad | Producto fundamental |
|---|---|---:|---|---|
| R01 | Arquitectura / Puerto de Splunk | 5 | P0 | Enterprise/Cloud |
| R02 | Ingesta / Río de Telemetría | 6 | P0 | Enterprise/Cloud |
| R03 | SPL inicial / Bosque | 7 | P0 | Enterprise/Cloud |
| R04 | SPL avanzado / Laboratorio | 8 | P0 | Enterprise/Cloud |
| R05 | Normalización/CIM | 7 | P0/P1 | Enterprise/Cloud + CIM cuando se use |
| R06 | Investigación SOC | 8 | P0 | Enterprise/Cloud (ES opcional) |
| R07 | Detection Engineering | 8 | P0/P1 | Enterprise/Cloud (ES opcional) |
| R08 | Threat Hunting | 8 | P1 | Enterprise/Cloud (ES opcional) |
| R09 | Enterprise Security | 8 | P1/P2 | **ES específico** |
| R10 | Administración avanzada | 8 | P2 | Enterprise/Cloud, según responsabilidades |
| R11 | Automatización y SOAR | 7 | P2 | Enterprise/Cloud + **SOAR opcional** |
| **Total** | | **80** | | |

## Decisiones curriculares que ya pueden aprobarse

- La ruta Splunk será **autónoma** y no una reproducción 1:1 del índice Microsoft.
- SC-200 será un **sistema de puentes conceptuales** (KQL/SPL, ingesta, incidentes, retención y detección), no un sustituto de documentación Splunk.
- Prioridad inmediata del estudiante: `R01→R02→R03→R04→R05 básico→R06→R07 básico`, con ramas separadas para hunting, ES, administración y SOAR.
- Los ejercicios usarán **datos sintéticos identificados**, campos verificados y consultas leídas/ejecutadas solo cuando exista permiso.
- Ninguna alerta aislada prueba compromiso; mantener estados `sospechoso`/`benigno con evidencia`/`inconcluso` según criterios reproducibles.
- **80 es número de lecciones diseñadas**, no total inmutable; la revisión pedagógica puede fusionar/dividir lecciones.

## Correspondencias: 13 capítulos SC-200 frente a las regiones Splunk

| Capítulo SC-200 | Regiones enlazables | Diferencia que se enseñará |
|---|---|---|
| 01 Licencias y onboarding | R01,R02,R09 | Licencia vs ingesta; ES es distinto de plataforma base |
| 02 Permisos y RBAC | R10,R11 | Azure/Unified RBAC ≠ Splunk roles/capabilities |
| 03 Protección de workloads | R02,R06,R08 | Recibir señales no convierte Splunk en EDR/XDR |
| 04 Ingesta | R02,R05 | DCR/AMA vs UF/HF/HEC, índices, sourcetypes |
| 05 Almacenamiento | R02,R05,R10 | Tiers de Sentinel ≠ buckets/retención de Splunk |
| 06 Threat Intelligence | R05,R08,R09 | IOC, lookups, contexto, ES cuando aplique |
| 07 Detección | R07,R09 | Analytics Rules vs scheduled alerts/ES detection |
| 08 Correlación/incidentes | R06,R07,R09 | Correlación a nivel SPL vs findings/queue ES |
| 09 Investigación | R04,R06,R09 | Pivotes con fuentes y entidades específicas |
| 10 Hunting | R06,R08 | Hipótesis, datos, falsabilidad y evidencias |
| 11 Respuesta/remediación | R06,R11 | Mecanismos Microsoft ≠ capacidades nativas Splunk |
| 12 Automatización | R07,R11 | Logic Apps vs alert actions, API y SOAR |
| 13 Tablas y KQL | R03,R04,R05,R06 | Tabla XDR/Sentinel ≠ índice/sourcetype/campo Splunk |

## Lo que requerirá evidencia local antes de publicar ejercicios como 'validados'

1. Captura de estructura de la academia actual e IDs persistentes (sin modificarla).
2. Inventario permitido de índices, sourcetypes, campos y ventanas temporales reales del laboratorio.
3. Confirmación de permisos, licencia, compatibilidad de versión y addons instalados.
4. Pruebas de cada consulta sobre fixtures y, posteriormente, en Splunk con datos permitidos; salidas y fallos documentados.
5. Casos benignos, sospechosos e inconclusos de referencia con respuestas esperadas.
6. Tests de usabilidad, progreso, evaluación y regresión de SC-200 una vez autorizada la integración.
7. Revisión oficial periódica de versiones, capacidades ES, opciones SPL2 y productos cloud.

## Semáforo de preparación

| Dimensión | Estado | Fundamento |
|---|---|---|
| Mapa curricular R01–R11 | **Preparado para revisión humana** | 80 lecciones con prerequisitos y foco |
| Fuentes documentales | **Suficiente para estructura general** | fuentes oficiales y contextos explícitos |
| Contenido final listo para enseñar de 80 lecciones | **No** | requiere desarrollo, revisión y ejercicios |
| Consultas SPL comprobadas en laboratorio | **No** | sin conexión/ejecución |
| Integración web/SC-200 ↔ Splunk | **No** | no autorizada ni ejecutada |
| Precisión educativa medida | **No** | necesita pruebas ciegas y baseline |

**Conclusión:** La **investigación curricular estructural** queda consolidada y es apta para una revisión antes del desarrollo. Sería engañoso decir que «Splunk completo y validado» está listo, pero **ya no falta diseñar las regiones**. Lo siguiente será investigar/validar en profundidad los contenidos de lecciones concretas, un bloque cada vez, durante la producción educativa.
