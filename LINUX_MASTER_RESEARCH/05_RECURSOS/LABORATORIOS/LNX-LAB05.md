# LNX-LAB05 — Script de línea base, validación y entrega

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Operacionalizar un script de **línea base** (`linux_base.sh`) que registre estado con comandos de solo lectura, valide sus **códigos de retorno**, agregue un **hash** de la evidencia y documente sus limitaciones en un informe de entrega.

## Competencia

Automatización defensiva y reproducible: empaquetar lecturas de estado, verificar que el script tuvo éxito y entregar evidencia íntegra y trazable.

## Nivel y prerrequisitos

Integrador. Conviene haber recorrido los laboratorios `LNX-LAB01` a `LNX-LAB04`. No se requieren privilegios; el script se ejecuta **sin `sudo`** y escribe solo en el directorio propio.

## Material sintético

- VM de laboratorio aislada, cuenta sin privilegios `analista`, sin datos personales.
- Si se mencionan direcciones, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.5.50` para un host de referencia ficticio). No se usan IPs reales.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB05"`; el script y su salida viven aquí.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado y entra en el contexto de trabajo: `mkdir -p "$HOME/linux-lab/LAB05"`
2. Registra fecha y hora en **UTC**: `date -u -Is`

### Tarea (script de solo lectura)

3. Crea el script `"$HOME/linux-lab/LAB05/linux_base.sh"` con cabecera y modo estricto, por ejemplo:
   `printf '%s\n' '#!/usr/bin/env bash' 'set -euo pipefail' '# Línea base de solo lectura — datos sintéticos' > "$HOME/linux-lab/LAB05/linux_base.sh"`
4. Añade al script, con comandos de **solo lectura**, los cinco bloques de la línea base:
   - identidad: `date -u -Is`; `id`; `cat /etc/os-release`
   - kernel/entorno: `uname -srmo`; `printf 'PATH=%s\n' "$PATH"`
   - procesos (snapshot): `ps -eo pid,ppid,comm --sort=pid`
   - ficheros/enlaces seguros: `ls -li "$HOME/linux-lab/LAB05"` y `stat -c '%a %A %n' "$HOME/linux-lab/LAB05"`
   - red local sintética (si aplica): `ip -brief address` (solo lectura)
5. Da permisos de ejecución solo a tu copia: `chmod +x "$HOME/linux-lab/LAB05/linux_base.sh"`
6. Ejecuta el script y captura su salida y su **código de retorno**:
   `"$HOME/linux-lab/LAB05/linux_base.sh" > "$HOME/linux-lab/LAB05/base.txt" 2> "$HOME/linux-lab/LAB05/base.err"; echo "codigo=$?"`
7. **Valida** los códigos de retorno de los componentes clave (identidad, kernel, procesos y red) invocándolos por separado y comprobando `$?` tras cada uno.
8. Calcula el **hash** de la evidencia: `sha256sum "$HOME/linux-lab/LAB05/base.txt" > "$HOME/linux-lab/LAB05/SHA256SUMS"`
9. Comprueba que la evidencia no contiene secretos: revisa `base.txt` y `base.err` y retira cualquier variable sensible antes de entregar.

> El script solo **lee** estado. No incluye `sudo`, ni cambios de configuración, ni señales a procesos, ni escrituras fuera de `"$HOME/linux-lab/LAB05"`.

## Evidencia a entregar

- El script `linux_base.sh` con su cabecera `set -euo pipefail`.
- La salida `base.txt` y los errores `base.err`, con el **código de retorno** registrado.
- El archivo `SHA256SUMS` con el **hash** de la evidencia.
- Un **informe** breve de entrega con: qué se registró, qué códigos de retorno se observaron y **dos limitaciones** del script (por ejemplo, es un snapshot puntual y depende del entorno y permisos del host).

## Criterios de aceptación

- Ejecución (8): el script corre sin privilegios y produce `base.txt`.
- Códigos de retorno (5): se registran y se interpretan los códigos de los componentes clave.
- Hash y limitaciones (5): la evidencia lleva `SHA256SUMS` y se declaran al menos dos limitaciones.
- Informe (7): el informe es coherente, distingue observado de inferido y no incluye datos sensibles.
- No se detecta ninguna escritura fuera del directorio propio ni uso de `sudo`.

## Autorización y límites

Actividad **no destructiva** de solo lectura, limitada a `"$HOME/linux-lab/LAB05"`. No uses `sudo`, no modifiques servicios ni ajustes del sistema y no publiques el contenido de la evidencia si contiene información del host. Un hash local **no** demuestra por sí solo integridad frente a terceros: solo verifica que el archivo no cambió desde que se calculó.

## Limpieza

Conserva el script, `base.txt`, `base.err` y `SHA256SUMS` como evidencia. No hay cambios de sistema que revertir; elimina únicamente copias redundantes dentro de `"$HOME/linux-lab/LAB05"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
