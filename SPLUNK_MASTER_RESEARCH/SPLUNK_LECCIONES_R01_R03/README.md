# SPLUNK LECCIONES R01–R03 — Paquete educativo independiente

**Fecha:** 2026-10-16  
**Estado:** 18 lecciones **redactadas para revisión**, no integradas ni probadas en Splunk real.  
**Fuente:** conserva `SPLUNK_MASTER_RESEARCH` como directorio padre. Este paquete añade contenido, no reemplaza sus archivos.

## Qué incluye

- **18 archivos Markdown de lección**, usando exactamente los IDs y títulos R01–R03 del JSON curricular original (5+6+7).
- **54 actividades nuevas**: 36 preguntas de opción múltiple con solución explicada y 18 prácticas abiertas con respuesta orientativa y rúbrica (3 por lección).
- **3 laboratorios diseñados**, de los cuales el tercero incluye CSV sintético y verificador Python offline.
- Banco JSON para futura adaptación, índice y solucionario, rúbrica editorial, fuentes y manifiesto de cobertura.

## Instalación: no modifica el proyecto

Extrae el ZIP dentro de `~/Documentos/SOC_LEARNING_PATH/SPLUNK_MASTER_RESEARCH/`.
Quedará el directorio `SPLUNK_LECCIONES_R01_R03/` junto a `01_FUENTE_ORIGINAL`, `02_INVESTIGACION` y `03_CURRICULO`.

## Inicio recomendado

1. `R01_FUNDAMENTOS/INDICE.md` (5 lecciones).
2. `PRACTICAS/LAB_R01_ARQUITECTURA.md`.
3. `R02_INGESTA/INDICE.md` y laboratorio R02.
4. `R03_SPL_BASICO/INDICE.md` y laboratorio R03.
5. Consultar el solucionario **después** de responder y usar la rúbrica abierta.

## Verificación offline

```bash
python3 SPLUNK_LECCIONES_R01_R03/VALIDACION/comprobar_paquete.py
python3 SPLUNK_LECCIONES_R01_R03/PRACTICAS/scripts/verificar_fixture.py
```

## Lo que NO es

No es una app React ni un instalador ni un dump de un Splunk real. No cambia V2.5, XP, localStorage ni progreso. Los IDs `SP-Rxx-Lxx` son estables dentro de este material, pero hay que comprobar su compatibilidad con el contrato educativo del repositorio antes de importarlos. Las MCQ requieren revisión técnica/pedagógica independiente; las prácticas abiertas **no son autocorregibles** por texto literal.

## Fuente y veracidad

Los ejemplos provienen de documentación oficial y del corpus anterior. La única ejecución de pruebas aquí es sobre CSV sintético local, no sobre Splunk. Consulta `VALIDACION/FUENTES_Y_LIMITES.md` y el manifiesto. Los ficheros anteriores del proyecto no se alteraron.

## Corrección editorial r1

16/10/2026: IDs originales conservados; MCQ con distractores revisados y opciones con identidad estable, distribuidas sin posición dominante por región. Teoría: umbral 80 %. Abiertas: formativas, sin calificación automática. Aprobar teoría no acredita dominio práctico. Revisión humana independiente pendiente.

VALIDACION/DATASETS.json fija archivos, columnas, horas y mapeos de diseño; no importa CSV ni configura Splunk. Los verificadores requieren conservar el directorio padre con currículo y VALIDACION compartida. Ejecutar con python3 -B. El comprobador llama al test de fixtures local y comprueba sincronización/hashes.

La nueva política sustituye umbrales de dominio práctico editoriales anteriores: no existe autocorrección de P01. Ver ../CORRECCIONES_FINALES.md y ../PLAN_INTEGRACION.md. No se ha integrado React ni ejecutado Splunk/ES/SOAR.
