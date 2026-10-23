# Mundo Redes: fuentes de investigación

## Contenido redactado

Ya existe el [índice de las 168 lecciones](00_INDICE-LECCIONES.md), organizado en 8 etapas. Cada una incluye objetivo, explicación, caso sintético resuelto, práctica individual, dos preguntas y referencias. Los solucionarios están separados en `03_SOLUCIONES/`.

El paquete contiene 336 preguntas, 168 prácticas documentales, 168 casos sintéticos y 20 guías de laboratorio adaptadas de la investigación. **Revisión educativa del autor completada**: 45 preguntas corregidas, justificaciones específicas, rúbricas concretas y glosario de apoyo. La revisión independiente mantiene estado separado y los laboratorios no se han ejecutado. **El mundo ya está integrado en la aplicación local**: [detalle y puesta en marcha](../docs/redes/INTEGRACION-LOCAL.md).

Detalle: [REVISION-EDUCATIVA.md](../docs/redes/REVISION-EDUCATIVA.md). Registro por lección: [VALIDACION/REVISION-EDUCATIVA.json](VALIDACION/REVISION-EDUCATIVA.json).

Comprobar el paquete sin modificar las lecciones:

```sh
node scripts/check-redes-lessons.mjs
python3 -B scripts/check-redes-numerical.py
```

Resultados y límites: [CONTENIDO-REDACTADO.md](../docs/redes/CONTENIDO-REDACTADO.md). El futuro adaptador web debe leer los Markdown y separar el material de evaluación de sus respuestas.

## Investigación conservada

`01_INVESTIGACION/` conserva una copia literal de los 14 archivos proporcionados en:

`/home/tommy/Desktop/IMPLEMENTAR_REDES_LINUX_WIN_EN_MI_WEB_ESTILO_DUOLINGO/redes`

La copia se verificó byte a byte mediante SHA-256 contra esa carpeta el 18/10/2026. Los originales y sus propuestas no se han reescrito.

La integración arquitectónica está en [docs/redes/PLAN-INTEGRACION.md](../docs/redes/PLAN-INTEGRACION.md). Las correcciones T3/T4 se conservan como requisitos editoriales del catálogo propuesto. Su trazabilidad hacia los borradores está en `VALIDACION/REQUISITOS-EDITORIALES.json`; esa asociación no acredita cierre técnico automático.

Regenerar únicamente los artefactos de arquitectura:

```sh
node scripts/prepare-redes-plan.mjs
```

El script lee esta copia y los catálogos actuales SC-200/Splunk. Comprueba procedencia, IDs, dependencias, inventarios y candidatos de referencia; genera solo `docs/redes/`. No publica ni genera contenido en la aplicación y no modifica progreso, fuentes o mundos existentes. Se detiene si falla una comprobación estructural.

Los estados, fuentes y conclusiones técnicas de ChatGPT mantienen su procedencia. La validación local de estructura no vuelve a verificar afirmaciones externas, licencias, versiones, hardware o funcionamiento de laboratorios.
