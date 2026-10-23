# LNX-LAB38 — PSI y rendimiento sin DoS

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Tomar **tres muestras** de `loadavg`, memoria, `vmstat` y **PSI** (`/proc/pressure/{cpu,memory,io}`) con hora UTC, interpretar `some`/`full`, relacionar la carga con estados de espera no interruptible y proponer umbrales **solo después de un baseline**, sin generar carga indiscriminada ni llenar disco o memoria (base documental: F123, F124, F125, F133, F134, F136).

## Competencia

Diagnóstico de rendimiento **no destructivo**: separar `loadavg` de uso de CPU, presión de memoria de memoria libre, y latencia de E/S de CPU ociosa, declarando qué no se puede concluir con una serie corta.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-27`. Requiere `procps` (`uptime`, `free`, `vmstat`, `ps`), lectura de `/proc/pressure` y, opcionalmente, `systemd-analyze` para el arranque. No se requieren privilegios administrativos.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-38`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales.
- Carga de ejemplo **acotada y temporal**: una sola tarea `sleep` de corta duración o un `dd` pequeño sobre el directorio del laboratorio, con límite de bytes y de segundos. Nunca `stress --cpu N` arbitrario.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB38"` con subdirectorio `carga`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB38/carga"`.
2. Registra fecha **UTC**, kernel, CPUs y `boot_id`: `date -u -Is; uname -r; nproc; cat /proc/sys/kernel/random/boot_id` → `"$HOME/linux-lab/LAB38/lab38-entorno.txt"`.
3. Comprueba disponibilidad de PSI: `for f in /proc/pressure/cpu /proc/pressure/memory /proc/pressure/io; do [ -r "$f" ] && echo "OK $f" || echo "SIN LECTURA $f"; done` → `"$HOME/linux-lab/LAB38/lab38-psi-disponible.txt"`. Si falta, declara la métrica como **no cubierta**.

### Tarea (tres muestras y análisis)

4. Toma la **muestra 1** con contexto completo: `date -u +%FT%TZ; uptime; free -h; vmstat 1 3; cat /proc/loadavg; cat /proc/pressure/{cpu,memory,io} 2>/dev/null` → `"$HOME/linux-lab/LAB38/lab38-muestra-1.txt"`.
5. Toma la **muestra 2** en reposo, esperando al menos 10 segundos: repite el bloque anterior y guárdalo en `"$HOME/linux-lab/LAB38/lab38-muestra-2.txt"`.
6. Aplica una **carga acotada y temporal** (una sola tarea, con límite explícito): `timeout 5s dd if=/dev/zero of="$HOME/linux-lab/LAB38/carga/lab38-buffer.bin" bs=1M count=16 status=none` y anota hora de inicio y fin.
7. Toma la **muestra 3** inmediatamente después de la carga: `date -u +%FT%TZ; uptime; free -h; cat /proc/loadavg; cat /proc/pressure/{cpu,memory,io} 2>/dev/null` → `"$HOME/linux-lab/LAB38/lab38-muestra-3.txt"`.
8. Identifica los **procesos dominantes** con lectura, sin matar ni trazar: `ps -eo pid,ppid,stat,%cpu,%mem,comm --sort=-%cpu | head -15` → `"$HOME/linux-lab/LAB38/lab38-procesos.txt"`.
9. Interpreta PSI: `some` = al menos una tarea esperó; `full` = **todas** las tareas ejecutables estuvieron bloqueadas. Distingue `cpu` (rara vez tiene `full`), `memory` (reclaim/swap) e `io` (espera de disco) → `"$HOME/linux-lab/LAB38/lab38-interpretacion.md"`.
10. Explica al menos **un falso positivo** (por ejemplo, `loadavg` alto por procesos en espera no interruptible con CPU ociosa, o memoria «libre» baja por caché) y **una condición sin cobertura** (por ejemplo, contenedor con límite de cgroup distinto del host, o un pico más corto que el intervalo de muestreo) → `"$HOME/linux-lab/LAB38/lab38-limites.md"`.
11. Propón **umbrales candidatos** solo a partir de lo observado, indicando que requieren calibración con una serie más larga y con el baseline del servicio: PSI `some` sostenido, `full` creciente, swap en uso y `loadavg` frente a `nproc` → `"$HOME/linux-lab/LAB38/lab38-umbrales.md"`.
12. Redacta un **runbook corto** de diagnóstico por síntoma (CPU alta, memoria baja/OOM, latencia de E/S) con el orden: UTC/host/boot → presión → PID y cgroup → unidad/binario → cambios recientes → ¿incidente? → `"$HOME/linux-lab/LAB38/lab38-runbook.md"`.
13. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB38"/lab38-*.*; } > "$HOME/linux-lab/LAB38/SHA256SUMS"`.

> **No** uses `stress` indiscriminado, **no** llenes el sistema de archivos ni la memoria, **no** hagas `perf`/`strace` de procesos de terceros. La carga es **una** tarea, con `timeout` y límite de bytes.

### Verificación y limpieza

14. Confirma que las tres muestras tienen hora UTC y que la comparación reposo/carga es honesta: si no hubo cambio medible, se declara **sin presión observada**, no se inventa.
15. Verifica que distingues `loadavg` de uso de CPU y que no atribuyes presión a malware sin cadena de proceso, unidad y cambios recientes.
16. Comprueba que los umbrales propuestos están marcados como **candidatos** y que la serie es demasiado corta para fijarlos como definitivos.
17. **Limpieza**: elimina el archivo de carga y cualquier proceso residual: `rm -f "$HOME/linux-lab/LAB38/carga/lab38-buffer.bin"; pgrep -af 'dd if=/dev/zero' || true`. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB38/SHA256SUMS"`. Como es **solo lectura** salvo el archivo propio, no hay rollback adicional.

## Evidencia a entregar

- La **serie corta** de tres muestras con hora UTC.
- La **interpretación** de `some`/`full`, IO y `loadavg`.
- La **hipótesis de cuello de botella** con sus límites y un falso positivo declarado.
- Los **umbrales candidatos** que requieren calibración.
- El **runbook** por síntoma, con hash y UTC.

## Criterios de aceptación

- Serie y contexto (3): tres muestras con UTC, `nproc`, `boot_id` y disponibilidad de PSI declarada.
- Interpretación (3): `some`/`full`, memoria y IO correctamente explicados; `loadavg` no confundido con CPU.
- Límites (2): al menos un falso positivo y una condición sin cobertura.
- Seguridad y reversión (2): carga acotada con `timeout`, sin llenar disco/memoria, artefacto eliminado y hash verificado.
- **Fallo crítico:** generar carga indiscriminada, llenar el sistema de archivos o la memoria, o atribuir un `loadavg` alto a malware sin cadena de proceso y cambios recientes. Aquí la carga es mínima y temporal.

## Autorización y límites

Actividad de **medición** sobre una **VM propia**. **Prohibido** `stress` indiscriminado, llenar disco o memoria, `perf`/`strace` de procesos de terceros y modificar límites de cgroup del host. La carga es una sola tarea con `timeout` y tamaño acotado. Los umbrales son **candidatos**: no se aplican como política sin baseline.

## Limpieza

Elimina el archivo de carga (`lab38-buffer.bin`) y comprueba que no quedan procesos `dd` residuales. Conserva `lab38-*.txt`, `lab38-*.md` y `SHA256SUMS` como evidencia; elimina solo copias temporales fuera de `"$HOME/linux-lab/LAB38"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
