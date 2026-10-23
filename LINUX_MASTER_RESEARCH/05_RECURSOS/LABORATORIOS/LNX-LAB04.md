# LNX-LAB04 — Snapshot limitado de procesos y /proc

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Tomar un **snapshot de solo lectura** de un conjunto reducido de procesos, correlacionar shell, PID y PPID mediante `/proc` y explicar por qué un snapshot **no equivale a un historial**.

## Competencia

Observación no invasiva de procesos: leer estado y relaciones padre-hijo sin **detener, señalar ni modificar** ningún proceso.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-01` (lección `LNX-01-L01`). No se requieren privilegios; parte de `/proc` puede quedar oculta según los límites de la política de visibilidad.

## Material sintético

- VM de laboratorio aislada, cuenta sin privilegios `analista`, sin datos personales.
- Si se mencionan direcciones, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.4.40`). No se usan IPs reales.
- Procesos de ejemplo de solo lectura: la **shell actual** (`$$`), su **padre** (`$PPID`) y el proceso de la **tubería** que se lanza. Ninguno es real ni se ejecuta.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB04"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB04"`
2. Registra fecha y hora en **UTC** y el identificador de arranque como contexto temporal: `date -u -Is` y `head -c 32 /proc/sys/kernel/random/boot_id; echo`

### Tarea (solo lectura)

3. Anota la **shell actual** y su PID: `ps -p $$ -o pid,ppid,comm,args`
4. Anota el **padre** de la shell: `ps -p "$PPID" -o pid,ppid,comm,args`
5. Repite la lectura de forma reproducible con una tubería de solo lectura:
   `ps -eo pid,ppid,comm --sort=pid | grep -E "($$|$PPID)"`
6. Lee tres campos de `/proc/$$/status` y explica cada uno:
   - `grep -E '^(Name|Pid|PPid):' "/proc/$$/status"`
   - `grep -E '^(Uid|Gid):' "/proc/$$/status"`
   - `grep -E '^(State|Threads):' "/proc/$$/status"`
7. Observa la línea de **argumentos** del proceso de la shell: `tr '\0' ' ' < "/proc/$$/cmdline"; echo`
8. Enumera los **descriptores** abiertos por la shell: `ls -l "/proc/$$/fd"`
9. Consolida el snapshot limitado en un archivo: encadena los pasos anteriores (solo lectura) hacia `"$HOME/linux-lab/LAB04/procesos.txt"`.

> Ninguno de los comandos envía señales. **No** uses `kill`, `renice`, `systemctl` ni ningún cambio de estado. No leas `/proc` de procesos ajenos con fines intrusivos.

## Evidencia a entregar

- Un **árbol parcial de tres procesos** (shell, padre y el proceso de la tubería) con relación padre-hijo **comprobable** por PID/PPID.
- **Tres campos** de `/proc/$$/status` explicados (por ejemplo, `Name`, `PPid` y `Uid`).
- **Dos razones** por las que un snapshot no equivale a un historial (es instantáneo, y no registra eventos intermedios).
- Una nota de **límites**: qué procesos no se pudieron observar y por qué (visibilidad según la política del sistema).

## Criterios de aceptación

- Datos (6): el snapshot contiene PID, PPID, nombre y los campos de `/proc` con su interpretación.
- Interpretación (9): la relación padre-hijo es comprobable y no se confunde PID con nombre ni shell con kernel.
- Límites (5): se declaran al menos dos límites del snapshot frente a un historial.
- No se detiene, señala ni modifica ningún proceso.

## Autorización y límites

Actividad de **solo lectura**. No envíes señales ni cambies prioridades. No recojas datos de procesos de otros usuarios más allá de lo visible y necesario para el laboratorio. No publiques rutas ni variables con información sensible.

## Limpieza

Conserva `procesos.txt` como evidencia. No hay cambios de proceso que revertir; los procesos de la tubería terminan por sí solos.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
