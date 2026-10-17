# SOC Learning Path — Splunk R08–R09 | Threat Hunting y Enterprise Security

**Entrega:** 2026-10-16. **Estado:** 16 lecciones (8+8) preparadas **para revisión humana**, NO integradas en React, NO ejecutadas en Splunk ni ES reales.

## Contenido

- R08 — Threat Hunting: 8 lecciones con hipótesis, eventos 4769/4662, spraying, lateral movement, exfiltración, matriz MITRE y transformación a detección.
- R09 — Enterprise Security: 8 lecciones; event-based/finding-based detections, findings, scoring RBA, Mission Control, investigaciones, TI y SOAR.
- 48 actividades: 32 preguntas MCQ con respuestas justificadas y 16 prácticas abiertas con rúbricas; **pendientes de revisión humana**.
- 5 laboratorios offline con respuestas esperadas; 6 archivos CSV sintéticos; verificador de datos y verificador de integridad.
- Identificadores `SP-R08-L01`…`SP-R09-L08` iguales al currículo original; IDs de actividades `SP-Rxx-Lxx-Q01/Q02/P01`.

## Instalación en Parrot OS

Desde `~/Documentos/SOC_LEARNING_PATH/SPLUNK_MASTER_RESEARCH`:

```bash
7z x ~/Descargas/SPLUNK_LECCIONES_R08_R09.zip
```

Quedará `SPLUNK_LECCIONES_R08_R09/` junto a tus tres bloques anteriores; el ZIP contiene esa carpeta raíz y no reemplaza ficheros de investigación.

## Orden de estudio

1. `R08_THREAT_HUNTING/INDICE.md` y laboratorios LAB08-A/B/C.
2. `R09_ENTERPRISE_SECURITY/INDICE.md` y laboratorios LAB09-A/B.
3. `ACTIVIDADES/BANCO_ACTIVIDADES_R08_R09.json`, `SOLUCIONARIO.md`, `RUBRICA.md`.
4. `VALIDACION/FUENTES_Y_LIMITES.md`, pruebas offline y fuentes.

## Verificación sin red ni instancia Splunk

```bash
python3 SPLUNK_LECCIONES_R08_R09/PRACTICAS/scripts/verificar_fixtures.py
python3 SPLUNK_LECCIONES_R08_R09/VALIDACION/comprobar_paquete.py
```

### Seguridad y alcance

Solo documentos/CSV/Python de lectura. No importa datos en Splunk; no ejecuta búsquedas productivas, ataques, cambios en AD, SOAR ni APIs. Los ejemplos SPL son para estudiar y **no han sido ejecutados**; los datos `IDX_*` y `ST_*` no son índices/sourcetypes descubiertos. RBA del CSV no representa fórmula interna de ES 8.7. Todo material educativo debe revisarse técnicamente antes de integración.

**Siguiente bloque:** R10–R11 (administración y automatización/SOAR), tras revisión del presente material. Codex puede permanecer cerrado.

## Corrección editorial r1

16/10/2026: IDs originales conservados; MCQ con distractores revisados y opciones con identidad estable, distribuidas sin posición dominante por región. Teoría: umbral 80 %. Abiertas: formativas, sin calificación automática. Aprobar teoría no acredita dominio práctico. Revisión humana independiente pendiente.

VALIDACION/DATASETS.json fija archivos, columnas, horas y mapeos de diseño; no importa CSV ni configura Splunk. Los verificadores requieren conservar el directorio padre con currículo y VALIDACION compartida. Ejecutar con python3 -B. El comprobador llama al test de fixtures local y comprueba sincronización/hashes.

La nueva política sustituye umbrales de dominio práctico editoriales anteriores: no existe autocorrección de P01. Ver ../CORRECCIONES_FINALES.md y ../PLAN_INTEGRACION.md. No se ha integrado React ni ejecutado Splunk/ES/SOAR.
