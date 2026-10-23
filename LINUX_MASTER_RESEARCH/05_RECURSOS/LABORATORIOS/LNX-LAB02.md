# LNX-LAB02 — Inodos, enlaces y permisos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Demostrar en una VM de laboratorio la relación entre **ruta, nombre, inodo y permisos**, distinguiendo enlace duro de enlace simbólico y explicando por qué cambia `ctime` tras un `chmod`.

## Competencia

Manipulación controlada y **no destructiva** dentro de un directorio propio: crear artefactos de prueba, leer metadatos y documentar el efecto observado.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-01` (lección `LNX-01-L01`). No se requieren privilegios; los cambios se limitan a archivos creados por ti en un directorio temporal.

## Material sintético

- VM de laboratorio aislada, cuenta sin privilegios `analista`, sin datos personales.
- Si se mencionan direcciones, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.2.20`). No se usan IPs reales.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB02"`. Todos los archivos nacen en este directorio de prueba.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado y entra en él: `mkdir -p "$HOME/linux-lab/LAB02"`
2. Registra fecha y hora en **UTC**: `date -u -Is` y guárdala como contexto de la evidencia.

### Tarea (entorno de laboratorio, no destructivo)

3. Crea un archivo de prueba con contenido sintético:
   `printf 'evidencia de prueba\n' > "$HOME/linux-lab/LAB02/original.txt"`
4. Crea un **enlace duro** al mismo dato:
   `ln "$HOME/linux-lab/LAB02/original.txt" "$HOME/linux-lab/LAB02/alias-duro.txt"`
5. Crea un **enlace simbólico** al mismo dato:
   `ln -s original.txt "$HOME/linux-lab/LAB02/alias-simbolico.txt"`
6. Lista nombres e **inodos** juntos: `ls -li "$HOME/linux-lab/LAB02"`
7. Lee los **metadatos** completos del original: `stat "$HOME/linux-lab/LAB02/original.txt"`
8. Aplica un permiso controlado al archivo de prueba: `chmod 640 "$HOME/linux-lab/LAB02/original.txt"`
9. Verifica el nuevo modo y observa de nuevo la marca de cambio: `stat -c '%a %A %n' "$HOME/linux-lab/LAB02/original.txt"` y `stat "$HOME/linux-lab/LAB02/original.txt"`
10. Guarda la transcripción de las salidas en la evidencia.

> Solo se ejecuta `chmod` sobre un archivo creado por ti en la VM. No cambies permisos de rutas del sistema ni de otros usuarios.

### Comprobaciones de lectura

11. Confirma que enlace duro y original comparten **inodo** y contador de enlaces, y que el simbólico muestra una **ruta destino** distinta de un inodo propio.
12. Interpreta las marcas de tiempo `mtime`, `ctime` y `atime` y su relación con `chmod`.

## Evidencia a entregar

- Transcripción (o captura) de `ls -li` y `stat` antes y después del `chmod`.
- Explicación de por qué cambia `ctime` tras `chmod` y por qué no cambia el inodo al cambiar el modo.
- Diferencia razonada entre **symlink** y **hardlink**, con el dato observado que la respalda.
- Relación entre permisos de **archivo** y permisos de **directorio** (por qué un directorio necesita permiso de ejecución para atravesarlo).

## Criterios de aceptación

- Reproducción (8): los artefactos se crean y las salidas se recogen en el directorio aislado.
- Interpretación (8): se distinguen inodo, nombre, enlace duro y simbólico con datos observados.
- Precauciones (4): se documenta que `chmod` solo tocó un archivo de prueba propio.
- No se usan privilegios ni se alteran rutas ajenas al directorio de laboratorio.

## Autorización y límites

Actividad **no destructiva** confinada a `"$HOME/linux-lab/LAB02"`. No apliques `chmod`, `chown`, `ln` ni `rm` sobre rutas del sistema. No uses `sudo`.

## Limpieza

El directorio de trabajo puede conservarse como evidencia. Si lo eliminas, hazlo **solo** bajo `"$HOME/linux-lab/LAB02"`, nunca sobre rutas globales.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
