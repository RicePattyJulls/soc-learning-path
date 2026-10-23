# LNX-LAB17 — Tar y rsync: restauración y metadatos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Crear un archivo `tar`, extraerlo a un **destino aislado** y contrastarlo con `rsync` (dry run y copia) preservando **hard links, symlinks y metadatos**, distinguiendo `-a` de `-HAX` y el efecto de la barra final (base documental: F45, F46, F57, F58, F59, F60, F61, F67).

## Competencia

Copia y **restauración aislada** con verificación por hash, explicando qué atributos quedaron **no evaluados** y por qué la barra final de `source/` cambia el resultado.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-16`. Requiere `tar` GNU, `rsync`, `sha256sum` y, opcionalmente, `getfacl`. No se requieren privilegios administrativos.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-17`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.17.10`). No se usan IPs reales.
- Datos de ejemplo (no de un host real): `lab-a.txt` con `v1`, enlace duro `lab-b.txt` y enlace simbólico `lab-l.txt`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB17"` con subdirectorios `source`, `archives`, `restore` y `mirror`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio y sus subdirectorios: `mkdir -p "$HOME/linux-lab/LAB17"/{source,archives,restore,mirror}`
2. Registra fecha y hora en **UTC**: `date -u -Is`
3. Prepara los datos sintéticos:
   `printf 'v1\n' > "$HOME/linux-lab/LAB17/source/lab-a.txt"; ln "$HOME/linux-lab/LAB17/source/lab-a.txt" "$HOME/linux-lab/LAB17/source/lab-b.txt"; ln -s lab-a.txt "$HOME/linux-lab/LAB17/source/lab-l.txt"`

### Tarea (copia y restauración controladas)

4. Crea y lista el archivo: `tar -C "$HOME/linux-lab/LAB17/source" -cf "$HOME/linux-lab/LAB17/archives/lab-base.tar" . ; tar -tf "$HOME/linux-lab/LAB17/archives/lab-base.tar" > "$HOME/linux-lab/LAB17/lab17-tar-list.txt"`
5. Extrae a un **destino aislado** y valida: `tar -C "$HOME/linux-lab/LAB17/restore" -xf "$HOME/linux-lab/LAB17/archives/lab-base.tar"; sha256sum "$HOME/linux-lab/LAB17/source/lab-a.txt" "$HOME/linux-lab/LAB17/restore/lab-a.txt" > "$HOME/linux-lab/LAB17/lab17-restore-hash.txt"`
6. Revisa los cambios propuestos por `rsync` **sin** `--delete`: `rsync -aHAX --dry-run --itemize-changes -- "$HOME/linux-lab/LAB17/source/" "$HOME/linux-lab/LAB17/mirror/" > "$HOME/linux-lab/LAB17/lab17-rsync-dry.txt"`
7. Copia y compara contenido/metadatos: `rsync -aHAX --itemize-changes -- "$HOME/linux-lab/LAB17/source/" "$HOME/linux-lab/LAB17/mirror/" > "$HOME/linux-lab/LAB17/lab17-rsync-run.txt"; stat -c '%d:%i %h %a %n' "$HOME/linux-lab/LAB17/source"/* "$HOME/linux-lab/LAB17/mirror"/* > "$HOME/linux-lab/LAB17/lab17-stat.txt"`
8. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB17/lab17-tar-list.txt" "$HOME/linux-lab/LAB17/lab17-restore-hash.txt" "$HOME/linux-lab/LAB17/lab17-rsync-dry.txt" "$HOME/linux-lab/LAB17/lab17-rsync-run.txt" "$HOME/linux-lab/LAB17/lab17-stat.txt"; } > "$HOME/linux-lab/LAB17/SHA256SUMS"`

> **No** uses `rsync --delete`, no extraigas archivos desconocidos como root y **no** restaures sobre el origen.

### Verificación y limpieza

9. Comprueba que el hash de la restauración coincide, que los hard links conservan `device:inode` y que el symlink se distingue como ruta.
10. Documenta las **diferencias reales** de ACL/xattrs/permisos si hay soporte (`getfacl`) y marca como **no evaluados** los atributos que no puedan comprobarse.
11. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB17/SHA256SUMS"`
12. **Limpieza**: tras obtener la evidencia, elimina **solo** el contenido sintético dentro de `"$HOME/linux-lab/LAB17"`, comprobando el prefijo de ruta y **sin comodines** sobre el origen.

## Evidencia a entregar

- El **listado de `tar`** y la **restauración fuera del origen** con hash coincidente.
- El **dry run de `rsync`** y su ejecución **sin `--delete`**.
- La **comparación** de hashes, hard links y symlinks.
- Las **diferencias reales** de ACL/xattrs/permisos si hay soporte (o su declaración como no evaluadas).

## Criterios de aceptación

- Backup y restauración (5): extracción aislada con hash coincidente y hard links preservados.
- Rsync y seguridad (4): se distingue `-a` de `-HAX`, se explica el **efecto de la barra final** en `source/` y no se usa `--delete`.
- Metadatos (3): se reportan como **no evaluados** los atributos que no puedan comprobarse.
- **Fallo crítico:** usar `rsync --delete` sobre el origen, extraer un archivo desconocido como root o restaurar sobre el origen. Aquí la restauración va a un destino aislado.

## Autorización y límites

Actividad sobre datos **sintéticos propios** en `"$HOME/linux-lab/LAB17"`. **Prohibido** usar `--delete`, extraer archivos desconocidos como root y restaurar sobre el origen; desconfía de symlinks en orígenes no confiables. No uses `sudo` ni toques datos ajenos.

## Limpieza

No borres nada antes de obtener la evidencia. Tras validarla, elimina **solo** el contenido sintético dentro de `"$HOME/linux-lab/LAB17"`, comprobando el prefijo de ruta y evitando comodines sobre el origen. Conserva `lab17-*.txt` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
