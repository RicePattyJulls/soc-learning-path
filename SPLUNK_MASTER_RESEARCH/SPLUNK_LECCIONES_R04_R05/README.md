# SOC Learning Path — Splunk R04–R05 (SPL II y CIM)

**Entrega:** 2026-10-16 · **Estado:** 15 lecciones redactadas **para revisión**. **No integrada en React ni validada contra instancia real Splunk**. No sustituye tu carpeta `SPLUNK_MASTER_RESEARCH` ni altera SC-200.

## Contenido verificado en el paquete

- **R04:** 8 lecciones `SP-R04-L01`…`L08`: stats/eventstats/streamstats; bin/timechart; cardinalidad; correlación; eficiencia; regex/multivalue; investigación SOC.
- **R05:** 7 lecciones `SP-R05-L01`…`L07`: extracciones/aliases; lookups; Common Information Model; data models; auditoría CIM; tstats y aceleración; rendimiento.
- **45 actividades diseñadas:** 30 preguntas de opción múltiple con soluciones + 15 prácticas abiertas con rúbrica y respuesta modelo.
- **4 laboratorios guiados:** stats por ventana (corrige la incoherencia LAB04-A anterior), cronología, normalización CIM, cobertura de summaries.
- **4 CSV sintéticos y 1 script Python de validación offline**, además de banco JSON, solucionario, referencias y manifiesto.

## Cómo colocarlo en Parrot OS

Desde `~/Documentos/SOC_LEARNING_PATH/SPLUNK_MASTER_RESEARCH/`, extrae el ZIP para crear `SPLUNK_LECCIONES_R04_R05/` como carpeta **hermana** de `SPLUNK_LECCIONES_R01_R03/`:

```bash
7z x ~/Descargas/SPLUNK_LECCIONES_R04_R05.zip
```

Abre `R04_SPL_AVANZADO/INDICE.md`, después `R05_CIM_NORMALIZACION/INDICE.md` y prácticas. **No ejecutar SPL sobre producción ni importar CSV sin permisos y planificación.** Los CSV son simulados.

## Verificación local (sin Splunk)

```bash
python3 SPLUNK_LECCIONES_R04_R05/PRACTICAS/scripts/verificar_fixtures.py
python3 SPLUNK_LECCIONES_R04_R05/VALIDACION/comprobar_paquete.py
```

## Trazabilidad y compatibilidad

Los 15 IDs y títulos son exactamente los del currículo original `03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json`; el paquete anterior R01–R03 contenía 18 lecciones. No hay renumeración. Los nuevos IDs de actividades siguen `SP-Rxx-Lxx-Q01/Q02/P01` y no colisionan con R01–R03. **La compatibilidad con el modelo de progreso de la app debe examinarla Codex antes de integrar**; no hay cambios a localStorage/XP/evaluación.

La etiqueta `VALIDADA OFFLINE` solo describe cálculos sobre CSV con Python, **no la sintaxis SPL ejecutada**. Las consultas se proponen bajo supuestos explícitos, no se han comprobado en Splunk real. La revisión de un experto pedagógico/técnico sigue pendiente antes de autopublicar ejercicios.

## Fuentes

Documentos de investigación originales en `02_INVESTIGACION`, SC-200 en `01_FUENTE_ORIGINAL`, currículo en `03_CURRICULO`, y catálogo de documentación oficial en `VALIDACION/FUENTES_Y_LIMITES.md`.

**Próximo bloque:** R06–R07 (SOC, detección). Codex puede permanecer cerrado mientras se preparan contenidos; aún no hay importación a React.

## Corrección editorial r1

16/10/2026: IDs originales conservados; MCQ con distractores revisados y opciones con identidad estable, distribuidas sin posición dominante por región. Teoría: umbral 80 %. Abiertas: formativas, sin calificación automática. Aprobar teoría no acredita dominio práctico. Revisión humana independiente pendiente.

VALIDACION/DATASETS.json fija archivos, columnas, horas y mapeos de diseño; no importa CSV ni configura Splunk. Los verificadores requieren conservar el directorio padre con currículo y VALIDACION compartida. Ejecutar con python3 -B. El comprobador llama al test de fixtures local y comprueba sincronización/hashes.

La nueva política sustituye umbrales de dominio práctico editoriales anteriores: no existe autocorrección de P01. Ver ../CORRECCIONES_FINALES.md y ../PLAN_INTEGRACION.md. No se ha integrado React ni ejecutado Splunk/ES/SOAR.
