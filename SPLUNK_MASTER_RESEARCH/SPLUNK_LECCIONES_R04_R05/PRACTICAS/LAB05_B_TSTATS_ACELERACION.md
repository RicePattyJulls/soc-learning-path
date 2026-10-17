# LAB05-B — ¿Qué se pierde con summariesonly=true?

**Región:** R05 · **Estado:** simulación de cobertura, no benchmark ni consulta ejecutada.

## Datos

`acceleration_coverage.csv` contiene tres ventanas: 09:00 (9 eventos resumidos de 9), 09:15 (0/4 resumidos), 09:30 (3/6 resumidos). No representa un modelo realmente acelerado.

## Reto

1. Calcula eventos fuente totales, incluidos en el resumen y no incluidos.
2. Explica qué respondería conceptualmente una consulta restringida a summaries de esos datos.
3. Justifica por qué una detección con resumen parcial puede infracontar.
4. Diseña qué comprobarías en una instancia real: modelo activo, aceleración, summaries, rango, índices, roles, restricciones, Job Inspector, diferencias por cambio de modelos.
5. Diferencia `tstats` sobre campos indexados y `tstats ... FROM datamodel=...`.

## SPL ilustrativo condicionado al modelo

```spl
| tstats summariesonly=true count AS eventos FROM datamodel=Authentication.Authentication BY Authentication.action
```

El nombre de dataset/constraints debe verificarse en la versión real; un resultado vacío no demuestra ausencia de ataques. No activar aceleración sin autorización.

## Solución

Suma: `9+4+6=19` eventos fuente; `9+0+3=12` resumidos; **7 no resumidos**. El CSV no mide latencia ni confirma disponibilidad del modelo en Splunk.

Rúbrica /4: cifras correctas; riesgo de falsos negativos; límites/condiciones; plan seguro de verificación.
