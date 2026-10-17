# LAB10-B — Ingesta y cobertura

**Asociación curricular:** R10-L05. **Datos:** `ingestion_diagnosis.csv`. **Estado:** práctica offline sobre simulación sintética; no ejecutada en producto.

**Objetivo:** distinguir causa probable, ambigüedad y permisos sin modificar fuentes.

1. Separa señal de retraso, posible duplicación y ausencia por RBAC.
2. Determina qué verificación no destructiva pedirías para cada host.
3. Define cuándo quedaría prohibido declarar «no hay datos».

**Resultado esperado:** ING01 muestra telemetría reciente; ING02 tiene lag sintético de 1800 s; ING03 es indeterminado por `search_access=denied`; ING04 sugiere inputs duplicados (`duplicate_factor=2`), no diagnóstico confirmado.

**Seguridad:** ningún paso aplica cambios en Splunk/REST/SOAR/firewall/AD. Los valores son materiales pedagógicos, no evidencia de producción.
