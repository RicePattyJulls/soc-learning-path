# LAB07-A — Ingeniería y pruebas de una regla de spraying

**Vinculación:** SP-R07-L01,L02,L03,L04,L05,L07 · **Duración:** 55–75 min.

## Problema
En el `auth_activity.csv` hay un patrón distribuido entre seis cuentas, actividad repetida de un solo servicio y un proxy. Se exige diseñar un **detector de candidatos**, NO confirmar un incidente ni desplegar una alerta.

## Pruebas
1. Detector ingenuo: ≥5 fallos de 4625 por IP en 15 minutos (sin cardinalidad de cuenta). ¿Qué cohorte benigna activa?
2. Detector revisado: ≥5 fallos **y** ≥5 usuarios distintos por src/bucket. Comprueba desde fixture.
3. Interpreta A021: ¿qué condición resultó verdadera con datos disponibles a 09:16 y qué devuelve una búsqueda posterior a 09:24?
4. Control benigno simulado: svc-batch no supera cinco cuentas aunque tenga cinco fallos. Proxy NAT (4 fallos/3 identidades) tampoco coincide, pero sigue inconcluso, no TN. La cohorte candidata es suspicious_unconfirmed y no aporta verdad de ataque para TP/FN o recall.
5. Caso sin user/host: especifica salida INCONCLUSO para la porción de datos no evaluable, no TN.
6. Diseña schedule + rango, trigger + throttling por separado y una política de regresión tras cambio de parser.

## SPL ilustrativo
```spl
index=IDX_WINDOWS sourcetype=ST_WINSEC EventCode=4625
| bin _time span=15m
| stats count AS fallos dc(user) AS usuarios values(event_id) AS ids BY src _time
| where fallos>=5 AND usuarios>=5
```

## Esperado
Con los 21 eventos completos, la IP 198.51.100.23 es el único candidato bajo la regla revisada (7 fallos, 6 cuentas). Una regla count>=5 también alerta en 203.0.113.15 (5 fallos de un único usuario), falso positivo respecto al ticket de mantenimiento sintético. Las IPs son reservadas.

## Limitaciones
No se evaluó ventana deslizante; los buckets discretos pueden fragmentar un ataque. Los nombres de campos son pedagógicos. Mantén CI/QA separado de instancia real. No crear saved search activa sin autorización.

## Rúbrica
Un punto cada uno: hipótesis+cobertura; cálculo completo; tests negativos+inconclusos; plan de tuning/despliegue seguro.
