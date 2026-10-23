# LNX-LAB07 — Estados, precedencia y dependencias

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Explicar el comportamiento de una unidad ya instalada **sin alterarla**: diferenciar estado de ejecución de estado de habilitación, localizar la **definición efectiva** y leer sus relaciones de dependencia (base documental: F21, F22).

## Competencia

Diagnóstico en **solo lectura** de systemd: distinguir `active` de `enabled`, reconocer la precedencia que decide la configuración cargada y no confundir orden de arranque con activación.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-08`. Requiere VM con systemd y una unidad existente elegida con `systemctl list-unit-files --type=service`. No se requieren privilegios ni cambios de configuración.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-07`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.7.70`). No se usan IPs reales.
- Unidad de ejemplo: un servicio **existente** en la VM (tipo `lab-observado.service`); se documenta con su nombre real observado, nunca inventado.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB07"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB07"`
2. Registra fecha y hora en **UTC**: `date -u -Is`
3. Enumera las unidades disponibles y **elige una existente**: `systemctl list-unit-files --type=service` (por ejemplo, `cron.service` o `ssh.service` **solo si existe**)

### Tarea (solo lectura)

4. Observa el estado con detalle: `systemctl status UNIDAD.service --no-pager`
5. Compara ejecución y habilitación: `systemctl is-active UNIDAD.service || :` y `systemctl is-enabled UNIDAD.service || :`
6. Lee los cuatro estados juntos: `systemctl show UNIDAD.service -p LoadState -p ActiveState -p SubState -p UnitFileState`
7. Resuelve el **origen efectivo**: `systemctl cat UNIDAD.service`
8. Registra rutas y origen de los valores clave: `systemctl show UNIDAD.service -p FragmentPath -p DropInPaths -p ExecStart -p User -p TriggeredBy`
9. Inspecciona las relaciones en ambos sentidos: `systemctl list-dependencies UNIDAD.service` y `systemctl list-dependencies --reverse UNIDAD.service`
10. Consolida los hechos observados en la evidencia: guarda las salidas anteriores en `"$HOME/linux-lab/LAB07/unidad.txt"`.

> Todos los comandos son de consulta. **No** uses `start`, `stop`, `restart`, `enable`, `disable`, `mask` ni `sudo`; no se cambia el estado de ningún servicio.

### Verificación y limpieza

11. Confirma que no se alteró ningún estado: vuelve a comprobar `systemctl is-active UNIDAD.service` y `systemctl is-enabled UNIDAD.service` y anota que coinciden con lo observado antes.
12. Documenta si existe más de un mecanismo de activación no evidente (`TriggeredBy`, sockets, timers o paths) y qué **no** puede probarse sin mutar el sistema.
13. Deja constancia de que el laboratorio no requirió reversión.

## Evidencia a entregar

- Un **informe corto** con diez hechos observables y tres límites de la observación.
- La diferencia razonada entre `Wants`, `Requires` y `After`, con el dato observado que la respalda.
- `FragmentPath` y `DropInPaths` documentados, explicando cuál es la **definición efectiva**.

## Criterios de aceptación

- Estados (6): no se confunde `enabled` con `active` ni se interpreta `After` como dependencia de activación.
- Precedencia (6): se localiza la definición efectiva de la unidad y sus drop-ins.
- Relaciones (5): se distinguen las dependencias de requerimiento y de orden, directas e inversas.
- Límites (3): se declaran al menos tres límites sin haber mutado el sistema.
- **Fallo crítico:** ejecutar `start`, `stop`, `restart`, `enable`, `disable` o `mask` sobre cualquier unidad del host. Aquí todo es consulta.

## Autorización y límites

Actividad de **solo lectura**. No pares ni reinicies servicios, no habilites ni deshabilites unidades y no uses `sudo`. Documenta solo la unidad investigada y no publiques datos del host de laboratorio.

## Limpieza

Ninguna mutación que revertir; conserva `unidad.txt` como evidencia. Si lo eliminas, hazlo **solo** bajo `"$HOME/linux-lab/LAB07"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
