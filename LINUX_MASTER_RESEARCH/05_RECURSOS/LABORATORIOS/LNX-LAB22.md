# LNX-LAB22 — Sockets y procesos: LISTEN, ESTAB y límites

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Levantar un servidor HTTP **efímero y controlado** con datos ficticios y observar sus sockets con `ss` **antes, durante y después** de una petición local, distinguiendo `LISTEN`, `ESTAB`, `CLOSE-WAIT` y `TIME-WAIT`, y relacionando el socket con su proceso sin extrapolar la ausencia de socket a la ausencia de incidente (base documental: F73, F95, F98, F100, F24).

## Competencia

Triaje de sockets por **instantáneas** con hora UTC: identificar puerto y estado, documentar el efecto de los privilegios sobre `ss -p` y explicar por qué un `LISTEN` no implica exposición ni atribución histórica.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-19` y tener `LNX-LAB21` (o una explicación equivalente). Requiere `ss`, `curl`, `python3` y, opcionalmente, `lsof`. No se levantan servicios reales externos ni se abren puertos privilegiados.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-22`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales.
- Página de ejemplo (no de un host real): `index.html` con el texto `T4 LAB: DATOS FICTICIOS`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB22"` con un subdirectorio `web`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio y la página ficticia: `mkdir -p "$HOME/linux-lab/LAB22/web"; printf 'T4 LAB: DATOS FICTICIOS\n' > "$HOME/linux-lab/LAB22/web/index.html"`
2. Registra fecha y hora en **UTC**: `date -u -Is > "$HOME/linux-lab/LAB22/lab22-cronologia.txt"`

### Tarea (escucha controlada y muestras)

3. **Antes** de arrancar, toma una muestra base: `ss -lntup > "$HOME/linux-lab/LAB22/lab22-ss-antes.txt"; ss -tanop >> "$HOME/linux-lab/LAB22/lab22-ss-antes.txt"`
4. Arranca el servidor efímero **solo en loopback**, en una terminal supervisada: `python3 -m http.server 8080 --bind localhost --directory "$HOME/linux-lab/LAB22/web"`
5. **Durante**: en otra terminal, lanza una petición local y captura estado: `curl --max-time 3 -s http://localhost:8080/ > /dev/null; ss -lntup > "$HOME/linux-lab/LAB22/lab22-ss-durante.txt"; ss -tanop >> "$HOME/linux-lab/LAB22/lab22-ss-durante.txt"`
6. Relaciona PID, servicio, puerto y dirección con `lsof -nP -iTCP -sTCP:LISTEN` **si está disponible** → `"$HOME/linux-lab/LAB22/lab22-listeners.txt"`; anota el efecto de los privilegios sobre `ss -p`.
7. Toma una segunda muestra con unos segundos de separación y observa la ventana en que la sesión efímera ya no aparece; anota hora UTC de cada muestra.
8. Explica por qué un puerto en `LISTEN` **no** implica exposición de Internet ni atribución histórica, y guárdalo en `"$HOME/linux-lab/LAB22/lab22-limites.md"`.
9. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB22"/lab22-*.*; } > "$HOME/linux-lab/LAB22/SHA256SUMS"`

> **No** levantes servicios externos, **no** uses puertos privilegiados del host y **no** alteres reglas de firewall. Todo ocurre en `localhost`.

### Verificación y limpieza

10. Confirma que identificas puerto y estado correctos en **dos muestras** y que la petición aparece como conexión establecida (`ESTAB`) mientras está viva.
11. Declara explícitamente el **efecto de los privilegios** sobre `ss -p` y por qué la ausencia de un socket en una instantánea **no** prueba ausencia de tráfico previo.
12. **Limpieza**: detén el servidor con `Ctrl+C`, comprueba que el proceso y el `LISTEN` desaparecen, revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB22/SHA256SUMS"`.

## Evidencia a entregar

- La **tabla de sockets** por momento (antes / durante / después) con hora UTC.
- El **PID/usuario/servicio** del listener (según privilegios disponibles).
- La **cronología UTC** de las muestras.
- Las **limitaciones** explicadas por escrito.

## Criterios de aceptación

- Técnica (4): identifica puerto/estado correcto en dos muestras y relaciona el listener con su proceso cuando es posible.
- Interpretación y límites (2): documenta el efecto de los privilegios y no extrapola ausencia de socket a ausencia de incidente.
- Evidencia (3): las tres instantáneas y la cronología UTC están presentes y con hash.
- **Fallo crítico:** afirmar que un `LISTEN` implica exposición pública, o que no ver un socket prueba que no hubo conexión. Aquí el servidor es efímero y de loopback.

## Autorización y límites

Actividad en una VM **propia** con un servidor HTTP efímero en `localhost` y datos ficticios. **Prohibido** levantar servicios externos, publicar en otras interfaces o alterar reglas del host. Si dispones de la topología de `LNX-LAB23`, puedes repetirlo dentro de la namespace de laboratorio. No uses `sudo` para escanear ni para tocar redes ajenas.

## Limpieza

Detén el servidor con `Ctrl+C` y verifica la desaparición del proceso y del socket. Conserva `lab22-*.txt`, `lab22-*.md` y `SHA256SUMS` como evidencia; elimina solo copias temporales fuera de `"$HOME/linux-lab/LAB22"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
