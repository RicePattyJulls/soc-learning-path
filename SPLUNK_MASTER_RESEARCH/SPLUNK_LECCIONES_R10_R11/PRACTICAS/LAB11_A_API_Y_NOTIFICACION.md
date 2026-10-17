# LAB11-A — API REST y webhook de aviso

**Asociación curricular:** R11-L02/L03. **Datos:** `api_job_lifecycle.csv`. **Estado:** práctica offline sobre simulación sintética; no ejecutada en producto.

**Objetivo:** diseñar cliente REST limitado sin invocar la API.

1. Clasifica las cuatro filas: éxito autorizado, job expirado, rol no autorizado y solicitud ilimitada.
2. Anota ruta conceptual `/services/search/v2/jobs/{sid}/results`, count máximo y TLS verificado.
3. Diseña payload mínimo de webhook con alerta, severidad y enlace interno; omite `_raw`, tokens y PII.

**Resultado esperado:** API01 se podría leer (si existe permiso real), API02 se reporta expirado, API03 se deniega, API04 rechaza `count=0` por la política didáctica. **Nada ha llamado a REST ni entregado webhooks.**

**Seguridad:** ningún paso aplica cambios en Splunk/REST/SOAR/firewall/AD. Los valores son materiales pedagógicos, no evidencia de producción.
