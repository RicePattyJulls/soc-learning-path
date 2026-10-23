# LNX-LAB33 — SUID/SGID y capabilities sin escalada

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Construir un **baseline de metadatos** de permisos especiales y capabilities sobre archivos propios del laboratorio, explicar por qué el bit SGID en un fichero no ejecutable **no** produce privilegio efectivo, y comparar un hallazgo hipotético contra dueño, tipo de archivo, ejecutabilidad, opciones de montaje (`nosuid`) y LSM, **sin ejecutar ninguna escalada** (base documental: F03, F04, F126, F135).

## Competencia

Lectura de privilegio en dos capas: **metadatos del archivo** frente a **credenciales y capabilities del proceso**, con la distinción explícita entre RUID/EUID y entre capability de archivo, heredada y efectiva.

## Nivel y prerrequisitos

Básico. Conviene haber recorrido la etapa `LNX-24`. Requiere `coreutils`, `find` y, opcionalmente, `getcap`/`getpcaps` (`libcap`). No se requieren privilegios administrativos y **no** se crean binarios SUID root.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-33`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales.
- Datos de ejemplo (no de un host real): `special.txt` (texto no ejecutable con SGID), `special-dir/` (directorio SGID de práctica) y `lab-*` para el resto de artefactos.
- Hallazgo hipotético **etiquetado como hipotético**: un binario `lab-helper` con SUID que solo aparecería en un escenario narrado; no se crea ni se ejecuta.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB33"` con subdirectorio `data`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB33/data"`.
2. Registra fecha **UTC**, identidad y umask: `date -u -Is; id; umask` → `"$HOME/linux-lab/LAB33/lab33-entorno.txt"`.
3. Crea el archivo de práctica: `printf 'prueba sgid no ejecutable LAB33\n' > "$HOME/linux-lab/LAB33/data/special.txt"; chmod 2640 "$HOME/linux-lab/LAB33/data/special.txt"; mkdir -p "$HOME/linux-lab/LAB33/data/special-dir"; chmod 2770 "$HOME/linux-lab/LAB33/data/special-dir"`.

### Tarea (baseline y comparación)

4. Captura los metadatos y el tipo real del archivo: `stat -c '%a %A %U:%G %n' "$HOME/linux-lab/LAB33/data/special.txt" "$HOME/linux-lab/LAB33/data/special-dir"; file "$HOME/linux-lab/LAB33/data/special.txt"` → `"$HOME/linux-lab/LAB33/lab33-stat.txt"`.
5. Comprueba la **ejecutabilidad** y explica por qué SGID en un fichero de texto no cambia el GID efectivo de ningún proceso: no hay `execve` que active el bit. `test -x "$HOME/linux-lab/LAB33/data/special.txt"; echo "ejecutable=$?"` → `"$HOME/linux-lab/LAB33/lab33-ejecutabilidad.txt"`.
6. Registra las **credenciales del propio proceso**: `cat /proc/self/status | grep -E '^(Uid|Gid|Cap(Inh|Prm|Eff|Bnd|Amb)|NoNewPrivs):'` → `"$HOME/linux-lab/LAB33/lab33-proceso.txt"`.
7. Consulta capabilities de archivo **solo** dentro del árbol del laboratorio: `command -v getcap >/dev/null && getcap -r "$HOME/linux-lab/LAB33" 2>/dev/null || echo 'getcap no disponible o sin resultados'` → `"$HOME/linux-lab/LAB33/lab33-getcap.txt"`.
8. Haz un inventario acotado de SUID/SGID **en el árbol propio**, con límite de profundidad y sin recorrer el disco completo: `find "$HOME/linux-lab/LAB33" -xdev -type f \( -perm -4000 -o -perm -2000 \) -print 2>/dev/null` → `"$HOME/linux-lab/LAB33/lab33-find.txt"`.
9. Registra las **opciones de montaje** del sistema de archivos donde vive el laboratorio, porque `nosuid` anula el efecto del bit: `findmnt -T "$HOME/linux-lab/LAB33" -no TARGET,SOURCE,FSTYPE,OPTIONS` → `"$HOME/linux-lab/LAB33/lab33-montaje.txt"`.
10. Redacta el **hallazgo hipotético** `lab-helper` (SUID, dueño `root`, ruta no estándar) y evalúalo con la checklist: ¿es ejecutable?, ¿el montaje permite SUID?, ¿el dueño es privilegiado?, ¿hay LSM o `no_new_privs` en el contexto?, ¿consta en un paquete? Marca cada casilla como `sí`, `no` o `no evaluado` → `"$HOME/linux-lab/LAB33/lab33-hipotesis.md"`.
11. Propón el **control mínimo** (retirar el bit, revisar el paquete de origen, restringir el directorio, revisar la unidad que lo invoca) y un **retest conceptual**: qué se volvería a medir y qué resultado esperarías. **No** lo apliques sobre binarios del sistema → `"$HOME/linux-lab/LAB33/lab33-control.md"`.
12. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB33"/lab33-*.*; } > "$HOME/linux-lab/LAB33/SHA256SUMS"`.

> **No** crees binarios SUID root, **no** ejecutes binarios sospechosos y **no** recorras el disco de producción. El hallazgo hipotético se analiza en papel; no se materializa.

### Verificación y limpieza

13. Confirma que demuestras la **ausencia de escalada** en `special.txt` por tipo de archivo y falta de ejecución, no por una suposición.
14. Verifica que separas SUID (identidad efectiva del dueño), SGID de fichero (GID efectivo), SGID de directorio (herencia de grupo) y capabilities (privilegio granular).
15. Restaura los permisos normales del material de práctica: `chmod 0640 "$HOME/linux-lab/LAB33/data/special.txt"; chmod 0750 "$HOME/linux-lab/LAB33/data/special-dir"`.
16. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB33/SHA256SUMS"` y **limpieza**: elimina solo el contenido sintético bajo `"$HOME/linux-lab/LAB33"`, comprobando el prefijo de ruta.

## Evidencia a entregar

- El **baseline de metadatos** (`stat`, `file`, `find` acotado, opciones de montaje).
- La **diferencia UID/GID real frente a efectivo** y las capabilities del proceso.
- El **hallazgo hipotético** claramente rotulado como tal, con checklist de evaluación.
- El **control mínimo** y el **retest conceptual**.
- **Hash** y fecha en UTC.

## Criterios de aceptación

- Baseline (3): metadatos, tipo de archivo y montaje documentados con comandos reproducibles.
- Privilegio efectivo (3): se explica RUID/EUID y por qué un bit sin `execve` no otorga nada.
- Hallazgo hipotético (2): rotulado como hipotético y evaluado con checklist, sin ejecución.
- Control y reversión (2): control mínimo razonado, permisos restaurados y hash verificado.
- **Fallo crítico:** crear un binario SUID root, ejecutar un binario sospechoso o afirmar que existe escalada real sin cadena de ejecución observada. Aquí solo se leen metadatos.

## Autorización y límites

Actividad de **observación** sobre archivos **propios** en una VM desechable. **Prohibido** crear binarios SUID root, ejecutar binarios no confiables, usar listas de exploits y recorrer el disco de producción. `T1548.001` y `T1548.003` se citan como **modelos** de riesgo, no como procedimientos a ejecutar.

## Limpieza

No borres nada antes de obtener la evidencia. Tras validarla, restaura los permisos de `special.txt` y `special-dir` y elimina **solo** el contenido sintético dentro de `"$HOME/linux-lab/LAB33"`, comprobando el prefijo de ruta. Conserva `lab33-*.txt`, `lab33-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
