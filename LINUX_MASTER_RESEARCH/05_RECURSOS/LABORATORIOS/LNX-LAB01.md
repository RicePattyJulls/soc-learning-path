# LNX-LAB01 — Identidad, límites y ficha base

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Registrar la identidad, el entorno y los límites de un host Linux en una **ficha reproducible**, diferenciando distribución, kernel y shell, y declarando qué no se pudo observar.

## Competencia

Operación en **solo lectura**: leer el estado del sistema, documentarlo con evidencia y distinguir lo observado de lo inferido.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `LNX-01` (lección `LNX-01-L01`). No se requieren privilegios administrativos ni cambios de configuración.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-01`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.1.10`). No se usan IPs reales.
- Ficha de ejemplo (valores inventados, no de un host real): `PRETTY_NAME="Distro de Laboratorio"`, `uname` tipo `Linux lab-lnx-01 6.x x86_64 GNU/Linux`, `id` tipo `uid=1000(analista) gid=1000(analista) groups=1000(analista)`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB01"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB01"`
2. Registra fecha y hora en **UTC** al empezar: `date -u -Is`

### Tarea (solo lectura)

3. Identifica la **distribución**: `cat /etc/os-release`
4. Identifica el **kernel** y la arquitectura: `uname -srmo`
5. Registra la **identidad efectiva** del usuario actual: `id`
6. Observa el **proceso de la shell** en uso: `ps -p $$ -o pid,ppid,comm,args`
7. Registra un entorno mínimo (solo `PATH`, sin variables con secretos): `printf 'PATH=%s\n' "$PATH"`
8. Consolida los cinco campos clave en la ficha, con la marca de tiempo:
   `{ date -u -Is; cat /etc/os-release; uname -srmo; id; ps -p $$ -o pid,ppid,comm,args; printf 'PATH=%s\n' "$PATH"; } > "$HOME/linux-lab/LAB01/lab1-ficha.txt"`

> Todos los comandos son de lectura. No uses `sudo` y no modifiques ningún ajuste del host.

## Evidencia a entregar

- La ficha guardada `lab1-ficha.txt` con: distribución, kernel/arquitectura, identidad, proceso de la shell y `PATH`.
- Un **párrafo** que diferencie distribución, kernel y shell sin confundirlos.
- **Dos limitaciones** detectadas: qué no se pudo observar y por qué (por ejemplo, qué información depende de privilegios).

## Criterios de aceptación

- Identificación (5): los cinco campos clave están presentes y son coherentes entre sí.
- Contexto temporal (3): la ficha lleva marca de tiempo en UTC.
- Distinciones (4): el párrafo separa correctamente distribución, kernel y shell.
- Límites (3): se declaran al menos dos limitaciones concretas.
- **Fallo crítico:** publicar una salida de entorno con credenciales. Aquí solo se registra `PATH`.

## Autorización y límites

Actividad de **solo lectura**. No ejecutes con `sudo`, no exportes variables con secretos y no publiques datos del host de laboratorio. No se realiza ningún cambio que requiera reversión.

## Limpieza

Conserva `lab1-ficha.txt` como evidencia. No hay cambios que revertir; elimina cualquier copia innecesaria fuera del directorio de trabajo.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
