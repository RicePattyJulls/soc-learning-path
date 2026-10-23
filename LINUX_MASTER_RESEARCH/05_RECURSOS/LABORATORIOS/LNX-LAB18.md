# LNX-LAB18 — Restic: versiones, check y doble restauración

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Inicializar un **repositorio restic local y sintético**, crear **dos versiones** de un dato, verificar integridad con `check` y **restaurar ambas versiones** a destinos aislados, cronometrando el RTO local (base documental: F57, F58, F59, F60, F61, F67).

## Competencia

Gestión de **versiones**, verificación de integridad y **doble restauración** sin exponer la contraseña ni usar `forget`/`prune`.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-16`. Requiere `restic` instalado, una **contraseña de práctica recuperable** y unos 20 MB libres. No se requieren privilegios administrativos.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-18`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.18.10`). No se usan IPs reales.
- Datos de ejemplo (no de un host real): `lab-registro.txt` con `v1` y luego `v2`; contraseña de práctica sintética; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB18"` con subdirectorios `source`, `restore-v1`, `restore-v2` y `repo`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio y sus subdirectorios: `mkdir -p "$HOME/linux-lab/LAB18"/{source,restore-v1,restore-v2}`
2. Registra fecha y hora en **UTC**: `date -u -Is`
3. Prepara una contraseña de práctica **sintética** y protégela (no es un secreto real):
   `printf 'lab-practica\n' > "$HOME/linux-lab/LAB18/lab-pass.txt"; chmod 600 "$HOME/linux-lab/LAB18/lab-pass.txt"` y exporta `RESTIC_PASSWORD_FILE="$HOME/linux-lab/LAB18/lab-pass.txt"`.
4. Inicializa el repositorio local: `restic -r "$HOME/linux-lab/LAB18/repo" init` (salida a `"$HOME/linux-lab/LAB18/lab18-init.txt"`).

### Tarea (repositorio sintético)

5. Crea la **versión 1** y registra el snapshot:
   `printf 'v1\n' > "$HOME/linux-lab/LAB18/source/lab-registro.txt"; restic -r "$HOME/linux-lab/LAB18/repo" backup "$HOME/linux-lab/LAB18/source" > "$HOME/linux-lab/LAB18/lab18-backup-v1.txt" 2>&1; restic -r "$HOME/linux-lab/LAB18/repo" snapshots > "$HOME/linux-lab/LAB18/lab18-snapshots.txt" 2>&1`
6. Modifica **solo** el dato sintético y crea la **versión 2**:
   `printf 'v2\n' > "$HOME/linux-lab/LAB18/source/lab-registro.txt"; restic -r "$HOME/linux-lab/LAB18/repo" backup "$HOME/linux-lab/LAB18/source" > "$HOME/linux-lab/LAB18/lab18-backup-v2.txt" 2>&1; restic -r "$HOME/linux-lab/LAB18/repo" snapshots >> "$HOME/linux-lab/LAB18/lab18-snapshots.txt" 2>&1`
7. Verifica la estructura y, opcionalmente, los datos: `restic -r "$HOME/linux-lab/LAB18/repo" check > "$HOME/linux-lab/LAB18/lab18-check.txt" 2>&1` y, si es factible, `restic -r "$HOME/linux-lab/LAB18/repo" check --read-data >> "$HOME/linux-lab/LAB18/lab18-check.txt" 2>&1`
8. **Restaura por ID** dos snapshots distintos a dos destinos, cronometrando el RTO local:
   `time restic -r "$HOME/linux-lab/LAB18/repo" restore <SNAPSHOT_ID_V1> --target "$HOME/linux-lab/LAB18/restore-v1"` y `time restic -r "$HOME/linux-lab/LAB18/repo" restore <SNAPSHOT_ID_V2> --target "$HOME/linux-lab/LAB18/restore-v2"`
9. Localiza y contrasta los archivos en la jerarquía de ruta absoluta reconstruida:
   `find "$HOME/linux-lab/LAB18/restore-v1" "$HOME/linux-lab/LAB18/restore-v2" -type f -name lab-registro.txt -print -exec cat {} \; > "$HOME/linux-lab/LAB18/lab18-contraste.txt" 2>&1`
10. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB18"/lab18-*.txt; } > "$HOME/linux-lab/LAB18/SHA256SUMS"`

> **No** uses `forget`/`prune`, no sobrescribas `source` y no incluyas la contraseña en capturas, historial, scripts compartidos o JSON.

### Verificación y limpieza

11. Confirma que hay **dos snapshots distintos** verificados y que el contenido **v1** y **v2** es correcto en rutas aisladas.
12. Documenta la **limitación** de `check` sin `--read-data`: verifica estructura y metadatos, pero no todos los bloques de datos.
13. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB18/SHA256SUMS"`
14. **Limpieza**: tras copiar la evidencia requerida, elimina **solo** el directorio temporal identificado (repositorio y datos sintéticos), comprobando el prefijo de ruta. **No** se borra el repo hasta completar la validación.

## Evidencia a entregar

- Los **dos IDs reales** de snapshot.
- La salida de **`check`** y, si es factible, de **`--read-data`**.
- Las **dos restauraciones físicas** y los archivos examinados.
- Un **informe** de contenido v1/v2, **RTO local cronometrado** y fallos observados.

## Criterios de aceptación

- Backups versionados (4): hay **dos snapshots distintos** y verificados.
- Restauraciones reales (8): el contenido **v1** y **v2** es correcto en rutas aisladas.
- Integridad y límites (4): se describe la limitación de `check` sin leer datos.
- Secreto y seguridad (2): no se usa `forget`/`prune` ni se revelan credenciales.
- **Fallo crítico:** revelar la contraseña del repositorio (en captura, historial, script compartido o JSON), usar `forget`/`prune` o sobrescribir el origen. Aquí solo hay datos sintéticos y una contraseña de práctica.

## Autorización y límites

Actividad sobre un **repositorio local nuevo** y datos sintéticos en `"$HOME/linux-lab/LAB18"`. **Prohibido** incluir la contraseña en capturas, historial, scripts compartidos o JSON, usar `forget`/`prune` y sobrescribir `source`. No hagas backup de datos reales ni de secretos. No publiques datos del host de laboratorio.

## Limpieza

**No** borres el repositorio hasta completar la validación. Una vez copiada la evidencia requerida, elimina **solo** el directorio temporal identificado (`"$HOME/linux-lab/LAB18"`), comprobando el prefijo de ruta, incluida la contraseña de práctica. Conserva `lab18-*.txt` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
