# LNX-LAB20 — Red Team autorizado: permisos de backups y retest canary

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Evaluar, en un árbol **sintético y autorizado**, los permisos efectivos de un directorio de backups y diseñar un **retest canary** con identidad segregada, midiendo **impacto demostrado** frente a potencial (base documental: F45, F61, F64, F67, F69, F70).

## Competencia

Observación de permisos con `namei`/`stat`/`getfacl`, delimitación del hallazgo a la evidencia alcanzada y diseño de control y retest con **denegación auditable**.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-17`. Requiere `bash`, `stat`/`getfacl` (si existe) y un **ambiente autorizado**. No se elevan privilegios ni se deshabilitan protecciones.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-20`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.20.10`). No se usan IPs reales.
- Árbol de ejemplo (no de un host real): `data`, `backup` y `secret-mock`, con el canary `lab-canary.txt` de contenido `canary`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB20"`.

## Procedimiento por pasos

### Preparación

1. Crea los árboles inocuos: `mkdir -p "$HOME/linux-lab/LAB20"/{data,backup,secret-mock}`
2. Registra fecha y hora en **UTC** y el identificador de autorización: `date -u -Is; printf 'authorization_ticket=lab-ticket-3.8\n' > "$HOME/linux-lab/LAB20/lab20-auth.txt"`
3. Coloca el canary explícito: `printf 'canary\n' > "$HOME/linux-lab/LAB20/backup/lab-canary.txt"`

### Tarea (evaluación autorizada)

4. Observa la identidad real y los permisos del árbol:
   `id; namei -l "$HOME/linux-lab/LAB20/backup/lab-canary.txt"; stat -c '%a %U:%G %n' "$HOME/linux-lab/LAB20" "$HOME/linux-lab/LAB20/backup" "$HOME/linux-lab/LAB20/backup/lab-canary.txt" > "$HOME/linux-lab/LAB20/lab20-permisos.txt"`
5. Comprueba el acceso con `test -r`/`test -w` **sin** tocar contenido sensible:
   `test -r "$HOME/linux-lab/LAB20/backup/lab-canary.txt" && echo can_read; test -w "$HOME/linux-lab/LAB20/backup" && echo can_write` (salida a `"$HOME/linux-lab/LAB20/lab20-test.txt"`).
6. Describe el **riesgo real** y la **limitación** de usar el mismo usuario creador: el `test -w` del usuario actual **no** prueba la política para otro rol.
7. Redacta el **hallazgo** (impacto demostrado frente a potencial) en `"$HOME/linux-lab/LAB20/lab20-hallazgo.md"`.
8. Define el **retest**: control externo con una identidad de copia **sin permiso de borrado**, probando el borrado **solo** del canary explícitamente acordado si existe autorización, y exigiendo un **evento de denegación auditable**. Documenta las condiciones precisas en `"$HOME/linux-lab/LAB20/lab20-retest.md"`.
9. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB20"/lab20-*.txt "$HOME/linux-lab/LAB20"/lab20-*.md; } > "$HOME/linux-lab/LAB20/SHA256SUMS"`

> **No** copies secretos reales, **no** accedas a datos de terceros y **no** borres snapshots ni repositorios reales. Protona el borrado **solo** del canary acordado y con autorización.

### Verificación y limpieza

10. Confirma que el hallazgo se limita a la **evidencia alcanzada** y que no confunde `test -w` del usuario actual con una prueba de política para otro rol.
11. Declara honestamente la ausencia de permiso o de sensor si no puede comprobarse.
12. **Limpieza**: conserva el canary hasta el retest y elimina **únicamente** `LAB20` si se autoriza, comprobando el prefijo de ruta y **sin comodines**; revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB20/SHA256SUMS"`.

## Evidencia a entregar

- Un **mapa de permisos** de las tres rutas sintéticas.
- El **hallazgo** con **impacto demostrado** frente a potencial.
- Una **recomendación** de separar roles y de mantener el repositorio **off-host**.
- El **retest canary** con condiciones precisas y la **evidencia de auditoría** requerida.

## Criterios de aceptación

- Evidencia y límites (5): no se confunde `test -w` del usuario actual con prueba de política para otro rol.
- Control y retest (5): el retest protege versiones reales y **registra la denegación**.
- Seguridad (2): el hallazgo se limita a la evidencia alcanzada y la ausencia de permiso o sensor se reporta honestamente.
- **Fallo crítico:** confundir `test -w` del usuario actual con una prueba de política para otro rol, o borrar snapshots/repositorios/secretos reales. Aquí todo es sintético y el borrado solo toca el canary acordado.

## Autorización y límites

Actividad **Red Team autorizada** sobre un directorio **sintético** en `"$HOME/linux-lab/LAB20"`. **Prohibido** copiar secretos reales, acceder a datos de terceros, borrar snapshots o repositorios reales y elevar privilegios o deshabilitar protecciones. Probar el borrado **solo** del canary explícitamente acordado y con autorización. `T1490` se cita como **modelo**, sin acción destructiva.

## Limpieza

Conserva el canary hasta completar el retest. Elimina **únicamente** `"$HOME/linux-lab/LAB20"` si se autoriza, comprobando el prefijo de ruta y **sin comodines**. Conserva `lab20-*.txt`, `lab20-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
