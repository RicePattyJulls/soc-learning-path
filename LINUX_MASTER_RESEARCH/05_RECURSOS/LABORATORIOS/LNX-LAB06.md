# LNX-LAB06 — Reconstruir la cadena de arranque

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Reconstruir la **cadena de arranque** desde el firmware hasta el gestor de servicios, diferenciando cargador de arranque, kernel/initramfs y PID 1, y separando lo observado de lo inferido (base documental: F17, F18, F38).

## Competencia

Observación en **solo lectura** del proceso de arranque: recoger evidencia verificable de cada hito y explicar por qué un hash local no demuestra la integridad del host.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-07`. Requiere VM con systemd como PID 1, shell sin privilegios y herramientas `ps`/`findmnt` disponibles. No se requieren privilegios administrativos ni cambios de configuración.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-06`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.6.60`). No se usan IPs reales.
- Valores inventados de ejemplo (no de un host real): `boot_id` con forma de UUID `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` y `/proc/cmdline` tipo `BOOT_IMAGE=/vmlinuz root=/dev/mapper/labvg-root ro quiet`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB06"`.
- Snapshot de la VM recomendado antes de empezar. **No** se edita GRUB, la ESP, el firmware ni el initramfs.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB06"`
2. Registra fecha y hora en **UTC** y el identificador de arranque: `date -u -Is` y `cat /proc/sys/kernel/random/boot_id`

### Tarea (solo lectura)

3. Identifica el **gestor de servicios** como PID 1: `ps -p 1 -o pid,comm,args`
4. Registra la línea de comandos del kernel cargado: `cat /proc/cmdline`
5. Observa el **punto de montaje raíz** y su origen: `findmnt /`
6. Registra el **objetivo por defecto** del arranque: `systemctl get-default`
7. Mide el tiempo de arranque y la **cadena crítica**: `systemd-analyze time` y `systemd-analyze critical-chain`
8. Revisa unidades fallidas e historial de arranques: `systemctl --failed` y `journalctl --list-boots`
9. Consolida la observación directa y la cadena en dos archivos:
   `{ date -u -Is; cat /etc/os-release; uname -a; ps -p 1 -o pid,comm,args; cat /proc/cmdline; findmnt /; systemctl get-default; systemd-analyze time; systemctl --failed; } > "$HOME/linux-lab/LAB06/observaciones.txt" 2>&1` y `systemd-analyze critical-chain > "$HOME/linux-lab/LAB06/cadena.txt" 2>&1`
10. Calcula el **hash** de la evidencia: `sha256sum "$HOME/linux-lab/LAB06/"*.txt > "$HOME/linux-lab/LAB06/SHA256SUMS"`

> Ningún comando modifica el arranque. **No** edites GRUB, la ESP ni el initramfs, y no uses `sudo`.

### Verificación y limpieza

11. Comprueba que `observaciones.txt` y `cadena.txt` contienen al menos cinco **hitos** identificables (firmware inferido, cargador, kernel, initramfs, raíz y PID 1).
12. Marca en la matriz qué hitos son **hecho observado** y qué hitos son **inferencia** (por ejemplo, el firmware no se lee directamente desde el sistema en marcha).
13. Confirma que no se escribió nada fuera de `"$HOME/linux-lab/LAB06"` y deja constancia de que el hash solo protege la copia desde ese momento.

## Evidencia a entregar

- Un **diagrama** de la cadena de arranque con al menos cinco hitos, indicando cuáles son observados y cuáles inferidos.
- Los archivos `observaciones.txt`, `cadena.txt` y `SHA256SUMS` con la evidencia y sus hashes.
- Una **matriz** con cinco hechos, tres inferencias y al menos dos limitaciones.
- **Dos hipótesis de fallo** de arranque y la consulta reversible con que se comprobarían (sin aplicar cambios).

## Criterios de aceptación

- Distinción (6): el diagrama separa cargador de arranque de PID 1 y no los confunde.
- Interpretación (5): se explica qué aporta el **initramfs** frente a la **raíz**, y se distingue EFI/systemd-boot de GRUB como variantes del cargador.
- Límites (4): se declara que un hash local no garantiza la integridad del host ni la procedencia del binario.
- Originalidad (3): la matriz separa hecho, inferencia y faltante.
- **Fallo crítico:** editar GRUB, la ESP o el initramfs, o afirmar que un hash local prueba la integridad del host. Aquí solo se lee y se infiere.

## Autorización y límites

Actividad de **solo lectura** sobre la VM de laboratorio. **Prohibido** editar el bootloader, la partición de arranque EFI o el initramfs, y prohibido cambiar el objetivo por defecto. No uses `sudo` ni reinicies servicios. No publiques datos del host de laboratorio.

## Limpieza

Conserva `observaciones.txt`, `cadena.txt` y `SHA256SUMS` como evidencia. **No hay cambios de arranque que revertir**; elimina solo copias innecesarias dentro de `"$HOME/linux-lab/LAB06"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
