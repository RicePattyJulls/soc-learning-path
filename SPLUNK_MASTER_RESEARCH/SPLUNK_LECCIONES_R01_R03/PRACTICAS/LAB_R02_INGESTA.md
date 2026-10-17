# LAB-R02 — Auditoría de ingesta con datos inventados

**Tipo:** análisis teórico y diagnóstico; no modifica Splunk.

## Escenario

Un Windows envía un 4625 con timestamp del día anterior. Otro evento llega con sourcetype equivocado. Un analista dice que el panel de fallos está vacío.

## Encargo

1. Separa fuente, input, parsing, indexado, extracción search-time y permisos.
2. Explica qué síntomas se producen si `_time` está fuera de la ventana.
3. Indica dónde se modificaría la fase de parsing de eventos **futuros** en topologías UF→indexer y UF→HF→indexer.
4. Distingue corrección de sourcetype de la extracción de un campo.
5. Diseña verificación de solo lectura para cada hipótesis.

## Solución de referencia

Primero comprobar si el evento se genera; después receptor, índice/sourcetype reales, `_time` y `_indextime`, permisos y extracción. Con UF→indexer, el indexer habitualmente es primer parser; con UF→HF→indexer el HF puede serlo. Una modificación index-time no reescribe datos históricos. No ejecutar cambios ni reinicios.

## Criterio de éxito

Al menos tres causas alternativas plausibles y una comprobación por causa, sin afirmar que un panel vacío equivale a seguridad.
