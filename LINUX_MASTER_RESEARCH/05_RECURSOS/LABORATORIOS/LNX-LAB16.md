# LNX-LAB16 — Imagen ext4 autocontenida y validación offline

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Crear un **sistema de archivos de prueba** dentro de una **imagen de fichero propia**, ejercitarlo de forma controlada y **validarlo offline** con `e2fsck -fn`, comparando conceptualmente con XFS y Btrfs (base documental: F47, F48, F49, F50, F51, F52, F53, F62, F69).

## Competencia

Montaje **reversible sobre una imagen de archivo** (nunca sobre un dispositivo real), chequeo en **modo no-reparación** e interpretación honesta del código de salida.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido las etapas `LNX-14` y `LNX-15`. Requiere `truncate`, `mkfs.ext4`, `e2fsck`, `mount`, `file`, `stat` y unos 96 MiB libres en `$HOME`. Requiere privilegios administrativos **solo** para montar la imagen de archivo con `loop`; nunca se actúa sobre `/dev/*`.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-16`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.16.10`). No se usan IPs reales.
- Imagen de archivo sintética `lab-ext4.img` de 96 MiB y contenido de ejemplo `lab-canario.txt` con texto `canario`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB16"` con punto de montaje `"$HOME/linux-lab/LAB16/mnt"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio de trabajo y el punto de montaje: `mkdir -p "$HOME/linux-lab/LAB16/mnt"`
2. Registra fecha y hora en **UTC**: `date -u -Is`

### Tarea (sobre imagen de fichero propia)

3. Crea la **imagen dispersa** (un archivo regular, no un dispositivo): `truncate -s 96M -- "$HOME/linux-lab/LAB16/lab-ext4.img"`
4. **Preflight** de la única diana antes de formatear (prefijo correcto, tipo regular y **no** symlink):
   `case "$HOME/linux-lab/LAB16/lab-ext4.img" in "$HOME/linux-lab/LAB16"/*) :;; *) exit 1;; esac; test -f "$HOME/linux-lab/LAB16/lab-ext4.img" && test ! -L "$HOME/linux-lab/LAB16/lab-ext4.img" && echo preflight_ok`
   y confirma el tipo: `file "$HOME/linux-lab/LAB16/lab-ext4.img"; stat -c '%F %s %n' "$HOME/linux-lab/LAB16/lab-ext4.img"`
5. Formatea **SOLO el archivo**: `mkfs.ext4 -F -q -- "$HOME/linux-lab/LAB16/lab-ext4.img"` (guarda su salida en `"$HOME/linux-lab/LAB16/lab16-mkfs.txt"`).
6. Monta la imagen de archivo vía `loop` para añadir datos sintéticos, escríbelos y desmonta:
   `sudo mount -o loop "$HOME/linux-lab/LAB16/lab-ext4.img" "$HOME/linux-lab/LAB16/mnt"` → `printf 'canario\n' | sudo tee "$HOME/linux-lab/LAB16/mnt/lab-canario.txt"` → `sync` → `sudo umount "$HOME/linux-lab/LAB16/mnt"`
7. Verifica el **desmontaje limpio**: `findmnt "$HOME/linux-lab/LAB16/mnt"; losetup -a` (no debe quedar unidad de loop asociada).
8. Con la imagen **desmontada**, examínala offline en modo **no-reparación**:
   `e2fsck -fn -- "$HOME/linux-lab/LAB16/lab-ext4.img" > "$HOME/linux-lab/LAB16/lab16-e2fsck.txt" 2>&1; printf 'e2fsck_rc=%s\n' "$?" | tee -a "$HOME/linux-lab/LAB16/lab16-e2fsck.txt"`
9. Sella la evidencia y la imagen: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB16/lab16-mkfs.txt" "$HOME/linux-lab/LAB16/lab16-e2fsck.txt" "$HOME/linux-lab/LAB16/lab-ext4.img"; } > "$HOME/linux-lab/LAB16/SHA256SUMS"`

> El examen `e2fsck` se ejecuta **siempre** con la imagen desmontada. **Nunca** se llama a `mkfs` ni a `e2fsck` sobre `/dev/*`.

### Verificación y limpieza

10. Interpreta `e2fsck_rc` (0 = sin errores) sin enmascarar el código y explica cada **capa** del ejemplo (archivo → `loop` → ext4 → punto de montaje).
11. Compara conceptualmente con XFS (`xfs_repair -n`) y Btrfs (`btrfs check --readonly`) **sin ejecutarlos** sobre el host real.
12. **Limpieza**: comprueba que no queda nada montado (`findmnt "$HOME/linux-lab/LAB16/mnt"`), libera cualquier unidad de loop propia (`losetup -a`, y si procede `sudo losetup -d <LOOP>`) y luego borra la imagen exacta: `rm -- "$HOME/linux-lab/LAB16/lab-ext4.img"`.

## Evidencia a entregar

- La **salida de creación** del FS (`lab16-mkfs.txt`), usando solo el archivo y **sin `/dev`**.
- La **ruta validada**, el tipo de archivo y el tamaño (salida de `file`/`stat`).
- El **código real de salida** de `e2fsck -fn` y su interpretación.
- Una **comparación conceptual** con el procedimiento XFS/Btrfs.

## Criterios de aceptación

- Preflight seguro (5): la única diana fue un **archivo regular** en el directorio de trabajo, comprobado como no-symlink.
- Ejecución y código (4): `e2fsck` corrió **sin reparar** y con la imagen **desmontada**, y el código de salida se captura sin enmascarar.
- Interpretación (3): se explica por qué no debe replicarse esto contra el host real ni contra un dispositivo montado.
- **Fallo crítico:** ejecutar `mkfs.ext4` (o un `e2fsck` de reparación) sobre un dispositivo de bloque `/dev/*` o sobre un FS montado. Aquí la única diana es un archivo propio.

## Autorización y límites

Actividad sobre una **imagen de archivo propia** en `"$HOME/linux-lab/LAB16"`. **Prohibido** `mkfs`/`fsck` sobre `/dev/*`, sobre particiones o sobre volúmenes reales, y **prohibido** montar la imagen durante el examen de `e2fsck`. Comprueba el prefijo de ruta y que no sea symlink antes de formatear. No publiques datos del host de laboratorio.

## Limpieza

Conserva `lab16-mkfs.txt`, `lab16-e2fsck.txt` y `SHA256SUMS` como evidencia; la imagen puede conservarse para el informe **opcional**. Tras la validación, desmonta cualquier montaje, libera unidades de loop propias y borra el fichero imagen exacto y el directorio temporal propio, **sin comodines**.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
