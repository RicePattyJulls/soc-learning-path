# LNX-LAB13 — Inventario, topología y contexto de montaje

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Levantar un **inventario reproducible** de la topología de almacenamiento (`dispositivo → mapeador → filesystem → punto de montaje`) y registrar el **contexto de montaje** de dos rutas, separando lo observado de lo inferido (base documental: F41, F42, F43, F44, F69).

## Competencia

Observación en **solo lectura** de las capas de almacenamiento: mapear dos rutas hasta su origen, sellar la evidencia con hash y explicar los límites de `mountinfo` del proceso actual.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-12`. Requiere VM propia con `lsblk`, `findmnt`, `df` y `sha256sum`, y una carpeta escribible en `$HOME`. No se requieren privilegios administrativos ni cambios de particiones, montajes o `fstab`.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-13`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.13.10`). No se usan IPs reales.
- Valores inventados de ejemplo (no de un host real): identificador de dispositivo con forma de plantilla `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB13"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB13"`
2. Registra fecha y hora en **UTC** e identifica el entorno: `date -u -Is; uname -sr; cat /etc/os-release; id`

### Tarea (solo lectura)

3. Guarda el **inventario de dispositivos y capas**: `lsblk -o NAME,TYPE,SIZE,FSTYPE,UUID,MOUNTPOINTS > "$HOME/linux-lab/LAB13/lsblk.txt"`
4. Documenta los **montajes efectivos**: `findmnt -o TARGET,SOURCE,FSTYPE,OPTIONS > "$HOME/linux-lab/LAB13/mounts.txt"`
5. Mide **bloques e inodos**: `df -hT > "$HOME/linux-lab/LAB13/df.txt"` y `df -i > "$HOME/linux-lab/LAB13/inodes.txt"`
6. Registra el **contexto de montaje** de dos rutas propias, p. ej. `$HOME` y `/tmp`: `findmnt --target "$HOME"; findmnt --target /tmp`
7. Observa el `mountinfo` del proceso actual y anota su limitación: `cat /proc/self/mountinfo > "$HOME/linux-lab/LAB13/mountinfo-self.txt"`
8. Sella los artefactos con hash, **sin incluir el manifiesto a sí mismo**:
   `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB13/lsblk.txt" "$HOME/linux-lab/LAB13/mounts.txt" "$HOME/linux-lab/LAB13/df.txt" "$HOME/linux-lab/LAB13/inodes.txt" "$HOME/linux-lab/LAB13/mountinfo-self.txt"; } > "$HOME/linux-lab/LAB13/SHA256SUMS"`

> Todos los comandos son de lectura. No uses `sudo`, no edites `fstab` y no cambies particiones ni montajes.

### Verificación y limpieza

9. Revalida la integridad de los artefactos: `sha256sum -c "$HOME/linux-lab/LAB13/SHA256SUMS"`
10. Construye el `mapa-capacidad.md` para **dos rutas** y marca cada dato como **observado** o **inferido** (p. ej., la capa de mapeador puede no verse desde la ruta).
11. Confirma que no se escribió nada fuera de `"$HOME/linux-lab/LAB13"` y deja constancia de las **fuentes ausentes** (p. ej., un dispositivo no visible sin privilegios).

## Evidencia a entregar

- `mapa-capacidad.md`: jerarquía `dispositivo → mapeador → filesystem → punto de montaje → proceso` para dos rutas.
- Las **cuatro salidas** `lsblk.txt`, `mounts.txt`, `df.txt`, `inodes.txt` con fecha, versión y hash, más `mountinfo-self.txt` y `SHA256SUMS`.
- Una **nota** sobre diferencias de namespace y fuentes ausentes.

## Criterios de aceptación

- Inventario correcto (4): el mapeo de al menos dos rutas es coherente con las salidas.
- Interpretación de capas (3): se distingue **dispositivo**, **filesystem**, **punto de montaje** y **UUID**, y no se confunde overlay/loop legítimo con amenaza.
- Integridad y límites (3): el hash revalida y se explica la limitación de `mountinfo` del proceso actual.
- **Fallo crítico:** tratar un loop u overlay legítimo como amenaza, o modificar `fstab`/particiones/montajes. Aquí solo se lee y se infiere.

## Autorización y límites

Actividad de **solo lectura**. **Prohibido** cambiar particiones, montajes o `/etc/fstab`, y prohibido usar `sudo`. No publiques UUID, rutas de negocio ni datos sensibles del host de laboratorio. No se realiza ningún cambio que requiera reversión.

## Limpieza

Conserva `lsblk.txt`, `mounts.txt`, `df.txt`, `inodes.txt`, `mountinfo-self.txt`, `SHA256SUMS` y `mapa-capacidad.md` como evidencia. **No hay cambios que revertir**; elimina solo copias innecesarias fuera de `"$HOME/linux-lab/LAB13"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
