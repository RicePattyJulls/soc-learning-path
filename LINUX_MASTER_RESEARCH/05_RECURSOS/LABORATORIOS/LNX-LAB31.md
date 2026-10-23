# LNX-LAB31 — DAC/ACL/umask y rutas de acceso

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Explicar por qué un archivo puede ser legible por su propietario y no por otra identidad, separando **modo de archivo**, **permiso de travesía** en cada directorio del camino, **pertenencia a grupo**, **ACL con máscara efectiva** y **umask**, y demostrarlo con una prueba positiva y otra negativa o con la limitación declarada (base documental: F03, F04, F103, F104).

## Competencia

Inventario DAC reproducible con `stat`, `namei`, `umask` y `getfacl`, más una **tabla sujeto → directorios → archivo → ACL** que distingue el permiso nominal del permiso **efectivo**.

## Nivel y prerrequisitos

Básico. Conviene haber recorrido la etapa `LNX-24`. Requiere `coreutils`, `acl` (`getfacl`/`setfacl`, opcional) y, para la prueba negativa, una segunda identidad de laboratorio autorizada. No se requieren privilegios administrativos sobre el host real.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-31`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales.
- Datos de ejemplo (no de un host real): `private.txt` con contenido sintético, `acl-demo.txt` para la ACL y `lab-*` para el resto de artefactos.
- Segunda identidad opcional `labpeer`, creada **solo** dentro de la VM y solo si el ejercicio lo autoriza; si no existe, la prueba negativa se declara como **no ejecutada**.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB31"` con subdirectorios `data` y `acl`.

## Procedimiento por pasos

### Preparación

1. Crea el árbol aislado con umask restrictiva: `umask 077; mkdir -p "$HOME/linux-lab/LAB31"/{data,acl}` y registra la umask con `umask` y `umask -S`.
2. Registra fecha y hora en **UTC** y el entorno: `date -u -Is; id; uname -r; getent passwd "$(id -un)"` → `"$HOME/linux-lab/LAB31/lab31-entorno.txt"`.
3. Crea los datos sintéticos: `printf 'contenido sintético LAB31\n' > "$HOME/linux-lab/LAB31/data/private.txt"; printf 'acl sintética LAB31\n' > "$HOME/linux-lab/LAB31/acl/acl-demo.txt"; chmod 600 "$HOME/linux-lab/LAB31/data/private.txt"; chmod 700 "$HOME/linux-lab/LAB31/data"`.

### Tarea (inventario DAC y pruebas de acceso)

4. Captura metadatos y recorrido completo: `stat -c '%a %A %U:%G %n' "$HOME/linux-lab/LAB31/data/private.txt"; namei -l "$HOME/linux-lab/LAB31/data/private.txt"` → `"$HOME/linux-lab/LAB31/lab31-stat.txt"`.
5. Si `getfacl` está disponible, captura la ACL base y comprueba que **no** hay entradas extendidas: `command -v getfacl >/dev/null && getfacl "$HOME/linux-lab/LAB31/data/private.txt"` → `"$HOME/linux-lab/LAB31/lab31-acl-base.txt"`.
6. Añade una ACL para **la misma cuenta de laboratorio** sobre el archivo secundario, nunca sobre `private.txt`: `setfacl -m u:"$(id -un)":r-- "$HOME/linux-lab/LAB31/acl/acl-demo.txt"; getfacl "$HOME/linux-lab/LAB31/acl/acl-demo.txt"` → `"$HOME/linux-lab/LAB31/lab31-acl-demo.txt"`.
7. Fuerza la **máscara** a `---` sobre ese archivo secundario y vuelve a leer la ACL: `setfacl -m m::--- "$HOME/linux-lab/LAB31/acl/acl-demo.txt"; getfacl "$HOME/linux-lab/LAB31/acl/acl-demo.txt"`. Documenta la línea `#effective:` y por qué el permiso nominal ya no se aplica.
8. Prueba **positiva** como propietario: `test -r "$HOME/linux-lab/LAB31/data/private.txt" && echo 'positiva: lectura permitida al propietario'` → `"$HOME/linux-lab/LAB31/lab31-prueba-positiva.txt"`.
9. Prueba **negativa**: si existe `labpeer` autorizado, `sudo -u labpeer test -r "$HOME/linux-lab/LAB31/data/private.txt"; echo "exit=$?"` y repite sobre el archivo con ACL enmascarada. Si no existe segunda identidad, **no** la crees fuera de la VM: registra la limitación y apóyate en `namei -l` para razonar el recorrido → `"$HOME/linux-lab/LAB31/lab31-prueba-negativa.txt"`.
10. Construye la tabla **sujeto → directorios del camino → archivo → ACL/máscara** con una fila por sujeto y una columna de conclusión (`permitido`, `denegado`, `no evaluado`) en `"$HOME/linux-lab/LAB31/lab31-tabla.md"`.
11. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB31"/lab31-*.*; } > "$HOME/linux-lab/LAB31/SHA256SUMS"`.

> **No** cambies permisos de directorios ajenos, **no** intentes leer datos de otras cuentas y **no** abras permisos globales (`777`) «para que funcione». Todo ocurre bajo `"$HOME/linux-lab/LAB31"`.

### Verificación y limpieza

12. Confirma que distingues los cuatro controles: modo del archivo, travesía de directorios, grupo y ACL con máscara. Un `600` sobre un archivo dentro de un directorio `700` sigue siendo inaccesible para terceros por la **travesía**, no por el modo del archivo.
13. Verifica que la prueba negativa existe **o** que su ausencia está explicada como limitación, y que ninguna conclusión se apoya en una lectura no realizada.
14. Retira la ACL sintética y devuelve el archivo secundario a su modo original: `setfacl -b "$HOME/linux-lab/LAB31/acl/acl-demo.txt" 2>/dev/null; chmod 600 "$HOME/linux-lab/LAB31/acl/acl-demo.txt"`.
15. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB31/SHA256SUMS"` y **limpieza**: elimina solo el contenido sintético dentro de `"$HOME/linux-lab/LAB31"`, comprobando el prefijo de ruta y sin comodines sobre el origen.

## Evidencia a entregar

- El **inventario** de ownership, modo y ACL (`stat`, `namei`, `getfacl`).
- La **tabla de permisos** sujeto → directorios → archivo → ACL/máscara con conclusión por fila.
- La **prueba positiva** y la **prueba negativa** (o la limitación por falta de segunda identidad, explicada).
- La **explicación de la máscara ACL** y del **permiso de travesía**.
- **Hash** y fecha en UTC.

## Criterios de aceptación

- Inventario DAC (3): metadatos completos y recorrido de directorios documentado.
- ACL y máscara (3): se explica por qué `#effective` recorta el permiso nominal y se demuestra en el archivo secundario.
- Pruebas de acceso (2): positiva real y negativa real o limitación declarada, sin leer secretos ajenos.
- Evidencia y reversión (2): hash, UTC y ACL retirada del archivo de práctica.
- **Fallo crítico:** leer o intentar leer datos de otra cuenta, abrir permisos globalmente para «resolver» el ejercicio o crear cuentas fuera de la VM. Aquí todo es propio y sintético.

## Autorización y límites

Actividad sobre **datos sintéticos propios** en `"$HOME/linux-lab/LAB31"`. **Prohibido** modificar directorios ajenos, leer datos de otros usuarios y crear cuentas fuera de la VM. La segunda identidad, si se usa, es una cuenta de laboratorio creada y eliminada dentro de la VM desechable. No uses `sudo` sobre rutas del host real.

## Limpieza

No borres nada antes de obtener la evidencia. Tras validarla, retira la ACL del archivo secundario, restaura su modo `600` y elimina **solo** el contenido sintético dentro de `"$HOME/linux-lab/LAB31"`, comprobando el prefijo de ruta. Conserva `lab31-*.txt`, `lab31-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
