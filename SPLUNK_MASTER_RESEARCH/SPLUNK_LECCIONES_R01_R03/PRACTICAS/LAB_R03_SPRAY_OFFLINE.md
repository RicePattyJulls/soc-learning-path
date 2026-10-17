# LAB-R03 — Mini-hunting offline de autenticaciones

**Tipo:** fixture sintética + Python estándar, sin conexión a Splunk.

## Datos

`fixtures/auth_sintetico.csv`. IPs 203.0.113.9, 198.51.100.20 y 192.0.2.25 son rangos de documentación. Usuarios `example.test` son sintéticos; no provienen de tu laboratorio.

## Encargo

1. Filtra `action=failure` en ventana de 15 minutos por timestamp UTC.
2. Agrupa por `src` y bucket temporal; cuenta eventos y usuarios distintos no vacíos.
3. Marca como patrón que merece investigación los grupos con **al menos cinco usuarios distintos**.
4. Explica qué cambia si usas conteo diario en vez de buckets de 15 minutos.
5. Separa: hechos, hipótesis, datos faltantes y próxima comprobación autorizada.
6. Diseña equivalente SPL sobre una fuente cuyos campos `action`, `user`, `src` estén confirmados.

## SPL ilustrativo — NO probado en Splunk

```spl
index=INDICE_AUTH action=failure earliest=-24h
| bin _time span=15m
| stats count AS intentos dc(user) AS cuentas by src _time
| where cuentas>=5
```

Este SPL es **orientativo**: nuestro CSV usa `timestamp_utc`, que Splunk deberá mapear correctamente a `_time` al ingerirlo. No ingieras ni configures el laboratorio sin permiso.

## Resultado esperado del fixture

- 203.0.113.9, 09:00–09:14 UTC: 6 eventos de fallo, 5 cuentas únicas → patrón de sospecha; **no** ataque confirmado.
- 198.51.100.20, 09:00–09:14 UTC: 1 fallo, 1 cuenta → no alcanza umbral.
- 192.0.2.25, 09:00–09:14 UTC: 1 fallo sin identidad → no alcanza umbral ni demuestra cobertura de usuario.
- 203.0.113.9, 09:15–09:29 UTC: 1 fallo, 1 cuenta → otro bucket, no se mezcla con el primero.

## Pautas para revisar

Una regla puede clasificar un patrón como sospechoso. Validación real requerirá observar un índice real y comprobar nulos, esquema, alertas posteriores, sesgos por NAT/VPN, baseline y relojes. La prueba offline confirma conteos de una fixture; NO valida el SPL.

## Ejecución de prueba offline opcional

Desde esta carpeta: `python3 scripts/verificar_fixture.py`.
