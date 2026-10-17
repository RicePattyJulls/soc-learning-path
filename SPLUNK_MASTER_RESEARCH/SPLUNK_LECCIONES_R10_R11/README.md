# SOC Learning Path — Splunk R10–R11 | Administración y SOAR

**Fecha:** 16 de octubre de 2026. **Estado:** 15 lecciones (8+7) completas como **borradores editoriales**; pendientes de revisión humana, de ejecución en Splunk/SOAR y de integración en React.

## Contenido

- **R10 — Administración:** precedencia `btool`, RBAC, TLS, buckets/retención, diagnóstico de ingesta, Job Inspector, clusters y recuperación.
- **R11 — Automatización:** alert actions, REST Search v2, webhooks, playbooks SOAR, gate de aprobación, idempotencia y proyecto SOC final.
- **45 actividades:** 30 preguntas de opción múltiple justificadas + 15 prácticas abiertas con respuestas y rúbricas.
- **6 laboratorios offline**, **6 CSV sintéticos** y verificador Python sin conexiones, más verificador de integridad.
- IDs `SP-R10-L01`…`SP-R11-L07` idénticos al currículo original; actividades `SP-Rxx-Lxx-Q01/Q02/P01` no colisionan con R01–R09.

## Instalación en Parrot OS

Situado en `~/Documentos/SOC_LEARNING_PATH/SPLUNK_MASTER_RESEARCH`:

```bash
7z x ~/Descargas/SPLUNK_LECCIONES_R10_R11.zip
```

Crea `SPLUNK_LECCIONES_R10_R11/`, sin alterar otras carpetas.

## Orden de estudio

1. `R10_ADMINISTRACION/INDICE.md` y LAB10-A/B/C.
2. `R11_AUTOMATIZACION_SOAR/INDICE.md` y LAB11-A/B/C.
3. `ACTIVIDADES/BANCO_ACTIVIDADES_R10_R11.json`, `SOLUCIONARIO.md` y `RUBRICA.md`.
4. `VALIDACION/FUENTES_Y_LIMITES.md` y su bibliografía.

## Validar material offline

```bash
python3 SPLUNK_LECCIONES_R10_R11/PRACTICAS/scripts/verificar_fixtures.py
python3 SPLUNK_LECCIONES_R10_R11/VALIDACION/comprobar_paquete.py
```

Estos programas solo leen archivos CSV/JSON/Markdown locales. **NO arrancan Splunk, SOAR, REST, navegador, servicios ni laboratorios.**

## Estado al cerrar los cinco paquetes

R01–R03 = 18 lecciones; R04–R05 = 15; R06–R07 = 16; R08–R09 = 16; **R10–R11 = 15**. **Total 80/80 lecciones redactadas editorialmente**. Esto NO significa 80 lecciones verificadas en Splunk o listas para integración automática.

**Próximo paso recomendado:** auditoría cruzada de los cinco paquetes (IDs únicos, precisión de fuentes, calidad de ejercicios, soluciones, cobertura), y luego una integración controlada en la academia SC-200 terminada por Codex, sin alterar su progreso. Actualmente Codex puede permanecer cerrado.

## Corrección editorial r1

16/10/2026: IDs originales conservados; MCQ con distractores revisados y opciones con identidad estable, distribuidas sin posición dominante por región. Teoría: umbral 80 %. Abiertas: formativas, sin calificación automática. Aprobar teoría no acredita dominio práctico. Revisión humana independiente pendiente.

VALIDACION/DATASETS.json fija archivos, columnas, horas y mapeos de diseño; no importa CSV ni configura Splunk. Los verificadores requieren conservar el directorio padre con currículo y VALIDACION compartida. Ejecutar con python3 -B. El comprobador llama al test de fixtures local y comprueba sincronización/hashes.

La nueva política sustituye umbrales de dominio práctico editoriales anteriores: no existe autocorrección de P01. Ver ../CORRECCIONES_FINALES.md y ../PLAN_INTEGRACION.md. No se ha integrado React ni ejecutado Splunk/ES/SOAR.
