# LNX-LAB03 — Tuberías, stdout/stderr y código de salida

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Separar **stdout** y **stderr**, encadenar comandos con **tuberías** y leer el **código de salida**, evitando los errores de lectura más comunes en Bash.

## Competencia

Operación en **solo lectura** sobre datos sintéticos: redirigir flujos, comprobar el estado de una tubería y diagnosticar la diferencia entre un error de búsqueda y una ausencia de coincidencias.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-01` (lección `LNX-01-L01`). No se requieren privilegios.

## Material sintético

- VM de laboratorio aislada, cuenta sin privilegios `analista`, sin datos personales.
- Si se mencionan direcciones, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.3.30`). No se usan IPs reales.
- Datos de prueba sintéticos: un archivo `muestras.txt` con líneas inventadas como `10.60.1.10 admisible`, `10.60.2.20 admisible` y una línea sin la palabra buscada; ningún dato real.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB03"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB03"`
2. Registra fecha y hora en **UTC**: `date -u -Is`
3. Genera datos sintéticos:
   `printf '10.60.1.10 admisible\n10.60.2.20 admisible\n10.60.9.99 descartado\n' > "$HOME/linux-lab/LAB03/muestras.txt"`

### Tarea (solo lectura salvo la generación de muestras)

4. Ejecuta un comando que **escribe en las dos salidas** y sepáralas:
   `ls "$HOME/linux-lab/LAB03/muestras.txt" "$HOME/linux-lab/LAB03/no-existe.txt" > "$HOME/linux-lab/LAB03/stdout.txt" 2> "$HOME/linux-lab/LAB03/stderr.txt"`
5. Comprueba el **código de salida** del comando anterior de dos formas:
   `ls "$HOME/linux-lab/LAB03/no-existe.txt"; echo "codigo=$?"` y, con una ruta válida, `ls "$HOME/linux-lab/LAB03/muestras.txt"; echo "codigo=$?"`
6. Encadena con **tubería**: `grep 'admisible' "$HOME/linux-lab/LAB03/muestras.txt" | wc -l`
7. Provoca una **ausencia de coincidencias** y un **error de búsqueda**, y compara códigos:
   - Sin coincidencia: `grep 'inadmisible' "$HOME/linux-lab/LAB03/muestras.txt"; echo "codigo=$?"`
   - Error de ruta: `grep 'admisible' "$HOME/linux-lab/LAB03/no-existe.txt"; echo "codigo=$?"`
8. Observa el **código de una tubería** completa:
   `grep 'descartado' "$HOME/linux-lab/LAB03/muestras.txt" | wc -l; echo "codigo=$?"`
9. Documenta con qué opción de shell (`pipefail` o equivalente) cambiaría el criterio de éxito de la tubería, sin aplicarlo de forma permanente.

> Todos los comandos operan sobre archivos creados por ti. No modifiques archivos del sistema.

## Evidencia a entregar

- Los archivos `stdout.txt` y `stderr.txt` con la separación de flujos.
- El significado del **código de salida** de `ls` y de `grep` en cada caso observado.
- La diferencia razonada entre **error de búsqueda** y **«sin coincidencia»** de `grep`, con los códigos registrados.
- Una **mitigación** concreta para no confundir ambos casos al automatizar lectura de logs.

## Criterios de aceptación

- Separación (7): se distingue correctamente stdout de stderr en la evidencia.
- Diagnóstico (8): se interpretan los códigos de salida y se diferencia error de ausencia de coincidencia.
- Mitigación (5): se propone una comprobación de éxito aplicable a una tubería.
- La tubería no se usa para ejecutar nada destructivo y solo lee datos sintéticos.

## Autorización y límites

Actividad de **lectura** sobre datos sintéticos, con generación de archivos propios. No encadenes comandos con efectos sobre el sistema ni uses `sudo`. No publiques contenido que incluya credenciales.

## Limpieza

Conserva los archivos de evidencia. No hay cambios de sistema que revertir; elimina solo copias innecesarias dentro de `"$HOME/linux-lab/LAB03"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
