# LNX-LAB15 — Diagnóstico de capacidad y archivo desvinculado

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Diagnosticar señales de **capacidad** (bloques, inodos y montaje) y demostrar que un **descriptor abierto sobrevive al `unlink`**, construyendo un árbol de decisión entre `ENOSPC`, `EDQUOT` y `EROFS` (base documental: F42, F43, F45, F46, F54, F69).

## Competencia

Experimento controlado con Python sobre un archivo temporal propio, sin saturar recursos reales, y plan de diagnóstico diferenciado por causa.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-13`. Requiere Python 3, `lsblk`/`findmnt`/`df` y, opcionalmente, `lsof`. No se requieren privilegios administrativos ni cambios de configuración.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-15`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.15.10`). No se usan IPs reales.
- Valores inventados de ejemplo (no de un host real): fichero temporal de pocos bytes `lab-unlinked-XXXX` con contenido `canario`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB15"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB15"`
2. Registra fecha y hora en **UTC**: `date -u -Is`

### Tarea (experimento controlado)

3. Compara las señales de capacidad, inodos y montaje sobre el directorio de trabajo:
   `{ date -u -Is; df -hT "$HOME/linux-lab/LAB15"; df -i "$HOME/linux-lab/LAB15"; findmnt --target "$HOME/linux-lab/LAB15"; } > "$HOME/linux-lab/LAB15/lab15-capacidad.txt"`
4. Emula un **descriptor de archivo sin nombre** (sin privilegios y con datos mínimos):
   ```
   python3 - <<'EOF'
   import os, tempfile
   fd, p = tempfile.mkstemp(prefix="lab-unlinked-", dir=os.path.expanduser("~/linux-lab/LAB15"))
   os.write(fd, b"canario\n")
   print("before", p, os.fstat(fd).st_ino)
   os.unlink(p)
   print("after", os.path.exists(p), os.fstat(fd).st_size)
   os.close(fd)
   EOF
   ```
5. Guarda la salida del experimento en `"$HOME/linux-lab/LAB15/lab15-fd.txt"`.
6. Propone un **plan diferenciador** para `ENOSPC` (bloques), `EDQUOT` (cuota) y `EROFS` (FS de solo lectura) y guárdalo en `"$HOME/linux-lab/LAB15/arbol-decision.md"`.
7. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB15/lab15-capacidad.txt" "$HOME/linux-lab/LAB15/lab15-fd.txt" "$HOME/linux-lab/LAB15/arbol-decision.md"; } > "$HOME/linux-lab/LAB15/SHA256SUMS"`

> El archivo es de **pocos bytes**: no agotes bloques, inodos, swap ni cuotas reales.

### Verificación y limpieza

8. Confirma que el `fd` sigue vivo tras el `unlink` (`after False <tamaño>`) y que el script **cerró** el descriptor y eliminó su único nombre: `find "$HOME/linux-lab/LAB15" -name 'lab-unlinked-*' -print`
9. Vuelve a medir la capacidad y comprueba que **no** cambió: `df -hT "$HOME/linux-lab/LAB15"; df -i "$HOME/linux-lab/LAB15"`
10. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB15/SHA256SUMS"` y deja constancia de que `du` y `df` pueden no coincidir.

## Evidencia a entregar

- La **evidencia del descriptor abierto** tras el `unlink` (salida antes/después), sin tocar datos reales.
- El **árbol de decisión** `ENOSPC` frente a `EDQUOT`/`EROFS`.
- Una **advertencia** sobre los límites de `du` frente a `df`.

## Criterios de aceptación

- Experimento controlado (5): se demuestra el `file descriptor` vivo tras `unlink` sin tocar datos reales ni saturar recursos.
- Diagnóstico (5): se diferencian al menos **tres mecanismos** de saturación (bloques, inodos/cuota y solo lectura).
- Seguridad operativa (2): se rechaza borrar `/var/log`, reiniciar o cerrar ficheros de producción como primer paso.
- **Fallo crítico:** agotar bloques, inodos, swap o cuotas reales, o cerrar ficheros de procesos de producción. Aquí el experimento es de pocos bytes y sobre un archivo propio.

## Autorización y límites

Actividad de **propósito controlado** sobre `"$HOME/linux-lab/LAB15"`. **Prohibido** agotar bloques, inodos, swap o cuotas reales y cerrar ficheros de procesos de producción. No uses `sudo` y no toques `/var/log` ni servicios. No publiques datos del host de laboratorio.

## Limpieza

El script cierra su descriptor y elimina su único nombre; **no hay recursos especiales que restaurar**. Conserva `lab15-capacidad.txt`, `lab15-fd.txt`, `arbol-decision.md` y `SHA256SUMS` como evidencia y elimina cualquier copia innecesaria fuera de `"$HOME/linux-lab/LAB15"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
