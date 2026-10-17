# LAB10-C — Comparación de búsquedas

**Asociación curricular:** R10-L06. **Datos:** `search_jobs.csv`. **Estado:** práctica offline sobre simulación sintética; no ejecutada en producto.

**Objetivo:** comparar solo variantes con salida comparable.

1. Calcula reducción de `scan_count` y `elapsed_sec` de B contra A.
2. Verifica que `output_hash` y `result_count` coinciden antes de declarar equivalencia en el fixture.
3. Explica por qué C no es un éxito aunque sea la más rápida.
4. Diseña qué propiedades adicionales revisarías en Search Job Inspector real.

**Resultado esperado:** reducción de eventos escaneados del 88 %, tiempo ficticio 83,33 %. C tiene resultado distinto: **optimización no comparable**. Ninguna cifra proviene del Job Inspector real.

**Seguridad:** ningún paso aplica cambios en Splunk/REST/SOAR/firewall/AD. Los valores son materiales pedagógicos, no evidencia de producción.
