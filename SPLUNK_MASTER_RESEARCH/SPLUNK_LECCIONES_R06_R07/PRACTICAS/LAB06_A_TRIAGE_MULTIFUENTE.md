# LAB06-A — Triage SOC N1 multifuentе y handoff

**Vinculación:** SP-R06-L01,L02,L03,L05,L06,L07,L08 · **Duración sugerida:** 55–80 min · **Clasificación:** offline, sin Splunk.

## Objetivo
A partir de `fixtures/auth_activity.csv` y `fixtures/authorized_context.csv`, distinguir una **alerta compatible con password spraying** de una tarea documentada y de un proxy NAT; producir un informe que otro analista pueda reproducir. Todo el material usa IPs reservadas y usuarios ficticios. Las etiquetas de fixture describen *intención didáctica*, no compromiso verificado.

## Datos y contrato
Campos de autenticación: `event_id`, `event_time_utc`, `indexed_at_utc`, `EventCode`, `user`, `src`, `host`, `dest`, `LogonType`, `scenario`, `fixture_label`. `host` es el emisor del evento en este CSV; **no** se debe asumir que el cliente IP sea ese host. Un 4624 significa éxito de logon en `host`, no éxito del atacante.

## Trabajo del analista
1. No leas primero la sección Solución. Reconstruye 09:00–09:15Z por `src`, sólo eventos `4625`, `dc(user)` y IDs originales.
2. Triage 198.51.100.23: seis fallos distintos y posterior éxito para bob. Identifica las preguntas de MFA, propietario de la IP, equipo cliente, recuento por cuenta y visibilidad posterior.
3. Triage 203.0.113.15: cinco fallos de svc-batch y un éxito. Comprueba ticket sintético CHG-TEST-104; define una excepción estrecha si correspondiera y una fecha de caducidad.
4. Triage 192.0.2.44: cuatro fallos con tres identidades; ¿por qué una IP proxy no identifica un único origen real?
5. Analiza A021: registra el retraso y explica por qué el corte de resultados a 09:16 difiere del posterior a 09:24.
6. Entrega informe: ID, ventana UTC, búsqueda/SPL ilustrativo, fuentes/cobertura, hechos con IDs, hipótesis y explicación rival, severidad + confianza, siguiente paso y dueño/revisor.

## SPL ilustrativo (no ejecutado)
```spl
index=IDX_WINDOWS sourcetype=ST_WINSEC EventCode=4625
| bin _time span=15m
| stats count AS fallos dc(user) AS identidades values(event_id) AS eventos BY src _time
| where fallos>=5 AND identidades>=5
```
Requiere normalización real de user/src y tiempo. No correr producción ni atribuir el evento del CSV a Windows real.

## Solución docente — leer después
Al corte de 09:16 hay 6 fallos / 6 usuarios desde 198.51.100.23 (A001–A006) y éxito A007 para bob. A021 añade un séptimo fallo retrospectivo, ocurre 09:04 pero entra 09:24. 203.0.113.15 genera 5 fallos / 1 cuenta (A008–A012) con contexto autorizado simulado; 192.0.2.44 genera 4 fallos / 3 usuarios. Clasificación SOC de la primera cohorte: sospecha a investigar, **no ataque probado**; otras cohortes requieren contraste, no cierre ciego.

## Rúbrica (0–4)
1 punto por hechos verificables y recuentos correctos; 1 por manejo de evidencia/retardo y cobertura; 1 por hipótesis benigna/adversaria y severidad; 1 por búsqueda reproducible y propuesta segura. Umbral formativo orientativo: 3/4 y ningún error crítico de atribución.
