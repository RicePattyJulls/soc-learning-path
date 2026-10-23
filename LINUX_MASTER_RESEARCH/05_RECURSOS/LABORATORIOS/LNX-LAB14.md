# LNX-LAB14 — Inodos, hard links, symlinks y tiempos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Diferenciar **inodo**, **enlace duro** y **enlace simbólico**, registrando su `device:inode`, número de enlaces y marcas temporales, y explicar por qué `ctime` no es `crtime` (base documental: F45, F46).

## Competencia

Análisis de metadatos en un directorio temporal propio: demostrar que un enlace duro es el **mismo objeto** y que un symlink es una **ruta**, sin confundir tiempos ni atribuir autoría.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-13`. Requiere GNU coreutils (`stat`, `ln`, `readlink`, `sha256sum`) y una carpeta escribible en `$HOME`. No se requieren privilegios administrativos ni cambios de configuración.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-14`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.14.10`). No se usan IPs reales.
- Valores inventados de ejemplo (no de un host real): `stat` tipo `lab-a.txt inode=1234567 device=99 links=2 mtime=... ctime=...`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB14"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB14"`
2. Registra fecha y hora en **UTC**: `date -u -Is`

### Tarea (sobre datos sintéticos propios)

3. Crea un archivo base: `printf 'version uno\n' > "$HOME/linux-lab/LAB14/lab-a.txt"`
4. Crea un **enlace duro** al mismo objeto y un **enlace simbólico** a la ruta:
   `ln -- "$HOME/linux-lab/LAB14/lab-a.txt" "$HOME/linux-lab/LAB14/lab-a-hard.txt"; ln -s -- lab-a.txt "$HOME/linux-lab/LAB14/lab-a-sym.txt"`
5. Registra identidad del inodo y tiempos: `stat -c '%n inode=%i device=%d links=%h mtime=%y ctime=%z' "$HOME/linux-lab/LAB14"/lab-* > "$HOME/linux-lab/LAB14/lab14-stat.txt"`
6. Escribe a través del enlace duro y comprueba el reflejo: `printf 'version dos\n' >> "$HOME/linux-lab/LAB14/lab-a-hard.txt"; sha256sum "$HOME/linux-lab/LAB14/lab-a.txt" "$HOME/linux-lab/LAB14/lab-a-hard.txt" > "$HOME/linux-lab/LAB14/lab14-hashes.txt"`
7. Interpreta el symlink y la identidad del objeto: `readlink "$HOME/linux-lab/LAB14/lab-a-sym.txt"; stat -c '%d:%i %h %s %n' "$HOME/linux-lab/LAB14/lab-a.txt" "$HOME/linux-lab/LAB14/lab-a-hard.txt" >> "$HOME/linux-lab/LAB14/lab14-stat.txt"`
8. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB14/lab14-stat.txt" "$HOME/linux-lab/LAB14/lab14-hashes.txt"; } > "$HOME/linux-lab/LAB14/SHA256SUMS"`

> No sigas el symlink hacia destinos ajenos ni analices directorios de otros usuarios. No uses `sudo`.

### Verificación y limpieza

9. Confirma que los dos enlaces duros comparten `device:inode` y **mismo hash**, y que el symlink se distingue como ruta.
10. Redacta la explicación de por qué `ctime` (cambio de metadatos del inodo) **no** es `crtime` (creación, no siempre disponible) y formula **dos hipótesis forenses rivales** sobre un cambio de tiempo.
11. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB14/SHA256SUMS"`
12. **Borra solo los ficheros sintéticos** tras guardar la evidencia, comprobando el prefijo de ruta y sin comodines: `rm -- "$HOME/linux-lab/LAB14/lab-a-sym.txt" "$HOME/linux-lab/LAB14/lab-a-hard.txt" "$HOME/linux-lab/LAB14/lab-a.txt"`

## Evidencia a entregar

- Una **tabla** con `device:inode`, número de enlaces (`links`), hash y marcas temporales para el archivo, el enlace duro y el symlink.
- La **explicación** de por qué `ctime` no es `crtime`.
- **Dos hipótesis forenses rivales** sobre cambios de tiempo (con qué prueba se falsaría cada una).

## Criterios de aceptación

- Prueba de enlaces (5): los hard links comparten `device:inode` y hash, y el symlink se distingue correctamente.
- Interpretación de tiempos (4): se reconoce la relatividad de los timestamps y la falta de atribución.
- Límites y reversión (3): se declaran límites probatorios y el borrado apunta **exactamente** a `LAB14`.
- **Fallo crítico:** atribuir autoría a partir de timestamps, o seguir un symlink hacia un destino sensible. Aquí solo se examinan datos sintéticos propios.

## Autorización y límites

Actividad sobre un **directorio sintético propio** en `"$HOME/linux-lab/LAB14"`. **Prohibido** analizar directorios ajenos y seguir symlinks hacia destinos sensibles. No uses `sudo` ni borres fuera del directorio de trabajo. No publiques datos del host de laboratorio.

## Limpieza

Conserva `lab14-stat.txt`, `lab14-hashes.txt` y `SHA256SUMS` como evidencia. Elimina únicamente los ficheros sintéticos `lab-a*` dentro de `"$HOME/linux-lab/LAB14"`, verificando el prefijo de ruta antes de borrar y **sin comodines**.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
