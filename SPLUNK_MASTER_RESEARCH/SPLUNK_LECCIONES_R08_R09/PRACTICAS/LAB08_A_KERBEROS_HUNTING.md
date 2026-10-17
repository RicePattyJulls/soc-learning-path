# LAB08-A — Hunting de solicitudes Kerberos: ¿qué es señal y qué es prueba?

**Lecciones:** SP-R08-L01/L02/L07/L08. **Modo:** papel + CSV sintético (offline); búsqueda Splunk de solo lectura hipotética. **Sin explotación ni extracción de tickets.**

## Contrato del dataset

`fixtures/tgs_requests.csv` contiene 16 filas K01–K16 con IDs, UTC, user, src, service, encryption, authorization_context y event_id. `service` son etiquetas inventadas; **no equivalen a SPN completo ni a `ServiceName` de Windows**. La etiqueta `authorization_context` sirve para ejercicios, no se infiere del 4769.

## Misión

1. Escribe una hipótesis falsable sobre diversidad de servicios con una explicación alternativa inocente.
2. Agrupa por `user`; calcula `count` y `dc(service)`. Compara RC4 (`0x17`), AES (`0x12`) y campo vacío.
3. Prueba la regla didáctica «tgs≥5 AND servicios≥4» con ventana total del archivo (09:01–09:25 UTC). No la declares regla de producción.
4. Examina si `svc-backup` cumple o no la condición y por qué importa un inventario autorizado.
5. Redacta siguiente paso SOC y datos adicionales para verificar hipótesis (origen/endpoint/DC, baseline y esquema).

## SPL ilustrativo (no validado en Splunk)

```spl
index=IDX_WINDOWS sourcetype=ST_WINSEC EventCode=4769
| bin _time span=30m
| stats count AS tgs dc(ServiceName) AS servicios values(TicketEncryptionType) AS cifrados BY user _time
| where tgs>=5 AND servicios>=4
```

Los nombres `ServiceName` y `TicketEncryptionType` deben comprobarse en eventos reales; la búsqueda **no se prueba** con CSV ni es paridad directa con su campo `service`. La media hora se usa para mantener el ejemplo temporal completo y no es ajuste recomendado. `_time` requiere parsing UTC al importar.

## Resultados esperados del CSV

- `temp.user`: 6 filas, 6 servicios, 0x17 → candidata didáctica.
- `svc-backup`: 5 filas, 1 servicio, 0x17, contexto aprobado → negativo bajo la condición.
- `audit.user`: 4 filas, 4 servicios, 0x12 → fuera del umbral de 5.
- `helpdesk.user`: 1 fila, cifrado vacío → sin información de cifrado.

**Conclusión válida:** priorizar la primera cohorte para indagación; **no** concluir Kerberoasting real ni cracking. Basado en MITRE T1558.003 [D01] y MS 4769 [D06].

## Evaluación (0–4)

Suma, diversidad, controles benignos, límites de la fuente. Se invalida atribución sin corroboración.
