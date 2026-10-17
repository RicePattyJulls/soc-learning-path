# LAB11-B — Gate de aprobación e idempotencia

**Asociación curricular:** R11-L05/L06. **Datos:** `soar_actions.csv + automation_runs.csv`. **Estado:** práctica offline sobre simulación sintética; no ejecutada en producto.

**Objetivo:** separar consulta, mutación, aprobación y reintento seguro.

1. ACT02 y ACT04 sin aprobación deben denegarse.
2. ACT03 está marcado approved=yes, pero aún necesita comprobar contexto NAT/proxy, expiración e impacto: no se ejecuta.
3. RUN01+RUN02 comparten clave: se cuenta un solo efecto sintético confirmado; RUN03 queda unknown.
4. RUN04 (forbidden) y RUN08 (invalid) no se reintentan; RUN05 read transient podría reintentarse acotadamente (RUN06 success).

**Resultado esperado:** 1 clave aplicada sintética, 1 replay, 1 unknown, 1 forbidden, 1 transient lectura, 1 lectura completada, 1 pending y 1 invalid. No se ha realizado contención real.

**Seguridad:** ningún paso aplica cambios en Splunk/REST/SOAR/firewall/AD. Los valores son materiales pedagógicos, no evidencia de producción.
