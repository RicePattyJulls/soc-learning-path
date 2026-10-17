# LAB04-B — Cronología y correlación sin join

**Región:** R04 · **Estado:** investigación offline diseñada; no se ha hecho query sobre Splunk.

**Datos:** `auth_events.csv` + `asset_inventory.csv` sintéticos.

## Problema

Investiga IP 203.0.113.9 entre 09:00 y 09:30 UTC. ¿Hay patrón de fallos repetidos hacia muchas cuentas? ¿El éxito de alice a 09:11 confirma compromiso? ¿Qué aporta el inventario?

## Actividades

1. Lista todos los eventos de la IP ordenados por `_time`, distinguiendo login correcto e incorrecto.
2. Construye una agregación por `src,user` con `count(eval(action="failure"))` y `count(eval(action="success"))`.
3. Consulta en CSV `asset_inventory.csv`: categoría `shared_proxy` para esa IP. Explica por qué ese contexto no exime de investigar.
4. Entrega informe SOC con tabla de evidencias, hipótesis principal, alternativa benigna y tres comprobaciones autorizadas (p. ej. registros proxy, MFA, identidades y dispositivo).
5. Identifica riesgos de asociación por IP y la diferencia entre correlación y causalidad.

## SPL ilustrativo

```spl
index=INDICE_AUTH sourcetype=SOURCETYPE_AUTH earliest=-24h
| stats count(eval(action="failure")) AS fallos count(eval(action="success")) AS exitos BY src user
```

**Salida orientativa:** alice tiene 2 fallos y 1 éxito en 203.0.113.9. No existe evidencia de secuestro de credenciales. El matching por user/IP en una muestra no garantiza que sean la misma sesión ni el mismo host tras NAT.

**Rúbrica:** exactitud / fuentes / sesgos / acciones seguras, un punto cada uno. No utilizar `join` si los datos de login ya están en un único flujo normalizado.
