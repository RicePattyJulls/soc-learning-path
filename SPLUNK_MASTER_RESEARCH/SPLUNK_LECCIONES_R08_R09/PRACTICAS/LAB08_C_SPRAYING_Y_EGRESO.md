# LAB08-C — Hunting por autenticación distribuida y salida de red

**Lecciones:** SP-R08-L04/L05/L06. **Modo:** revisión offline de dos CSV. No se requiere ni toca red real.

## Dataset

- `fixtures/auth_activity.csv` contiene 12 filas S01–S07 y B01–B05. Direcciones IP de documentación, no IP de amenazas reales.
- `fixtures/net_egress.csv` contiene 4 flujos simulados con `bytes_out` y `destination_context` aportados explícitamente para el caso.

## Preguntas

1. Calcula fallos y `dc(user)` por origen; compara 198.51.100.33 vs 198.51.100.44.
2. Explica qué permite investigar S07 (éxito posterior) y qué no confirma (cuenta comprometida).
3. Compara salida de `backup-01` vs `finance-07`, separando volumen y contexto aprobado.
4. Define qué columnas adicionales serían necesarias para inferir exfiltración (proceso, protocolo, clasificación, proxy/DLP).
5. Elabora un handoff N1→N2 con observables, limitaciones, prioridad y medidas no disruptivas.

## Ejemplos SPL ilustrativos

```spl
index=IDX_AUTH sourcetype=ST_AUTH status="failure"
| stats count AS fallos dc(user) AS usuarios BY src
| where fallos>=5 AND usuarios>=5
```

```spl
index=IDX_NET sourcetype=ST_FLOW direction="outbound"
| stats sum(bytes_out) AS bytes_out BY src dest
| sort - bytes_out
```

No se han ejecutado en Splunk. `src`, `status`, `direction` y `bytes_out` dependen del mapeo.

## Respuestas esperadas

- Origen 198.51.100.33: 6 fallos / 6 identidades / 1 éxito separado.
- Origen 198.51.100.44: 5 fallos / 1 identidad. No encaja con umbral de spraying.
- Si discretizas por 15 minutos, B01–B04 producen 4/1 a las 11:00 y B05 produce 1/1 a las 11:15 UTC. El agregado global de este laboratorio no es el resultado por bucket de R08-L04; count>=5 por bucket tampoco seleccionaría ese control. La falta de coincidencia no prueba actividad benigna.
- `backup-01`: 865.000.000 bytes a destino autorizado (850M+15M).
- `finance-07`: 190.000.000 bytes a destino desconocido y 20.000.000 a portal aprobado.
- Ni éxito ni salida de red constituyen compromiso/exfiltración por sí solos.

Evidencia documental T1110.003 [D03] y T1021 [D04].
