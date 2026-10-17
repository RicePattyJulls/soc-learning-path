# LAB06-B — Cronología y retraso de indexación

**Vinculación:** SP-R06-L03,L04,L08 · **Duración:** 25–40 min · **Offline**.

## Objetivo
Construir una cronología de A001, A004, A007, A021 comparando tiempo del evento y de ingesta. A021 es intencionadamente tardío. No confundir zona local con UTC.

## Procedimiento
1. Selecciona A001/A004/A007/A021 en `auth_activity.csv`.
2. Convierte ISO-8601 UTC a instantes y calcula `delay = indexed_at_utc - event_time_utc` en segundos.
3. Ordena por tiempo del evento con desempate `event_id` y, después, por hora de ingesta.
4. Argumenta cómo se perdería A021 en un schedule 09:16 que busca sólo hechos ya indexados.
5. Propón solapamiento, deduplicación de IDs y seguimiento del delay por host; no inventes latencia real Splunk.

## SPL ilustrativo
```spl
index=IDX_WINDOWS sourcetype=ST_WINSEC
| eval ingest_delay_sec=_indextime-_time
| table _time _indextime ingest_delay_sec host EventCode
```

## Solución docente
A001: 10 s; A004: 10 s; A007: 12 s; A021: 1200 s. Por ocurrencia A021 y A004 comparten 09:04:00; ordenar por `event_id` para desempatar, aunque A021 es el último en llegar. En dataset retrospectivo del origen hay 7 fallos sospechosos; en el corte previo hay 6.

## Rúbrica
4 criterios: tiempos correctos; orden con empates; impacto en schedule; estrategia segura de cobertura. Cada uno 1 punto.
