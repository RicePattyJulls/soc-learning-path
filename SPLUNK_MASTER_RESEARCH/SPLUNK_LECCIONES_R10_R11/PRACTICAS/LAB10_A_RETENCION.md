# LAB10-A — Retención y cobertura

**Asociación curricular:** R10-L04. **Datos:** `retention_plan.csv`. **Estado:** práctica offline sobre simulación sintética; no ejecutada en producto.

**Objetivo:** evaluar riesgo de capacidad con aritmética reproducible sin tocar `indexes.conf`.

1. Para cada fila calcula `capacity_gib / daily_gib` como días equivalentes del modelo simple.
2. Compara contra `target_days` y clasifica capacidad insuficiente o nominalmente suficiente.
3. Explica por qué límites de buckets, compresión, replicación y almacenamiento remoto impiden afirmar una retención exacta.
4. Añade un comentario sobre `archive_policy` y pérdida irreversible potencial.

**Resultado esperado:** `auth_training` 13,33 días (<30), `endpoint_training` 90 (>=60), `netflow_training` 20 (<45), `audit_training` 120 (>=90). Dos casos son insuficientes por este modelo. No es medición de Splunk.

**Seguridad:** ningún paso aplica cambios en Splunk/REST/SOAR/firewall/AD. Los valores son materiales pedagógicos, no evidencia de producción.
