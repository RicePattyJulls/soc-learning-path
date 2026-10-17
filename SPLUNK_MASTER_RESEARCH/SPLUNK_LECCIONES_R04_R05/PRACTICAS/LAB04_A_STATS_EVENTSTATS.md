# LAB04-A — Contar vs conservar eventos (corregido)

**Región:** R04 · **Estado:** solución calculada offline; SPL propuesto NO ejecutado en Splunk. **Dataset:** `fixtures/auth_events.csv` (sintético, 12 filas).

## Propósito

Resolver la incoherencia del LAB04-A de la investigación original, **sin modificar el original**. Antes: 3 fallos para 2 usuarios con umbral de 5 cuentas, por lo que la consulta no podía disparar. Ahora la fixture incluye 7 fallos de la IP 203.0.113.9 para 5 identidades no vacías en 09:00–09:14 UTC, y 2 fallos adicionales en 09:15–09:29.

## Pasos

1. Identifica los eventos `action=failure`.
2. Calcula `stats count` y `dc(user)` por IP/bucket de 15 minutos.
3. Calcula el total por IP y diferencia ese número del primer bucket.
4. Describe qué conservaría `eventstats` para pivotar.
5. Explica si una IP compartida confirma un ataque (NO).

## SPL clásico ilustrativo

```spl
index=INDICE_AUTH sourcetype=SOURCETYPE_AUTH action=failure earliest=-24h
| eval user=if(isnull(user) OR len(trim(user))=0,null(),user)
| bin _time span=15m
| stats count AS fallos dc(user) AS cuentas BY src _time
| where cuentas>=5
```

**Importante:** `INDICE_AUTH` es un marcador; el dataset de fecha 2026-10-16 no entrará necesariamente en `earliest=-24h` al ejecutar otro día. No ejecutes placeholders; define el periodo absoluto y la fuente reales. Asegura que la extracción vacía no se cuente como identidad.

## Solución numérica y rúbrica

- Primer bucket 203.0.113.9 (09:00 UTC): 7 fallos, 5 usuarios no vacíos, 1 evento con user faltante.
- Segundo bucket misma IP (09:15 UTC): 2 fallos, 2 usuarios.
- Hay **1 bucket** con `dc(user)>=5`.
- En toda la fixture: 12 eventos, 10 fallos, incluyendo un éxito de alice a 09:11 y otro de svc_backup a 09:09.

Rúbrica /4: 1 por filtros; 1 por números; 1 por distinguir stats/eventstats; 1 por incertidumbre de seguridad. Ejecuta `python3 PRACTICAS/scripts/verificar_fixtures.py` desde el directorio de paquete para comprobar números offline.
