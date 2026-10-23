# LNX-LAB36 — Audit: regla efímera y pérdida de eventos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Medir la diferencia entre **regla configurada**, **regla activa**, **evento recibido** y **pérdida**, aplicando **una sola** regla de auditoría temporal sobre un archivo propio del laboratorio, provocando **un único** cambio, correlacionando el evento por `serial` y retirando exactamente esa regla, con `lost`/`backlog` registrados antes y después (base documental: F116, F117, F118, F119, F138).

## Competencia

Instrumentación mínima y reversible: distinguir cobertura declarada de cobertura efectiva, leer un evento completo (`uid`/`euid`/`auid`, `PATH`, `SYSCALL`) y demostrar la retirada limpia sin afectar reglas ajenas.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-29` y tener `LNX-LAB35` recomendado. Requiere una **VM desechable con `auditd`** y permiso explícito para tocar **una** regla efímera. Si `auditd` no existe, el laboratorio se resuelve con la **simulación documental** y se declara **no cubierto**.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-36`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales.
- Archivo vigilado: `"$HOME/linux-lab/LAB36/data/watch.txt"`, creado por ti, sin valor y sin relación con rutas del sistema.
- Clave de auditoría: `t5_watch_lab`. Regla única: `-w <ruta absoluta de watch.txt> -p wa -k t5_watch_lab`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB36"` con subdirectorio `data`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio y el archivo vigilado **antes** de aplicar la regla: `mkdir -p "$HOME/linux-lab/LAB36/data"; printf 'v0\n' > "$HOME/linux-lab/LAB36/data/watch.txt"`.
2. Registra fecha **UTC**, `boot_id`, versión y ruta absoluta resuelta: `date -u -Is; cat /proc/sys/kernel/random/boot_id; auditctl -v 2>/dev/null || true; readlink -f "$HOME/linux-lab/LAB36/data/watch.txt"` → `"$HOME/linux-lab/LAB36/lab36-entorno.txt"`.
3. Captura el **baseline** de auditoría: `sudo -n auditctl -s 2>&1; sudo -n auditctl -l 2>&1` → `"$HOME/linux-lab/LAB36/lab36-audit-pre.txt"`. Anota `enabled`, `lost`, `backlog` y `backlog_limit`.

### Tarea (regla única, evento único, retirada exacta)

4. Verifica que **no** existe ya una regla con la misma clave ni el mismo `-w`: `sudo -n auditctl -l 2>/dev/null | grep -F 't5_watch_lab' || echo 'sin regla previa'`.
5. Aplica **solo** la regla autorizada sobre el archivo propio: `sudo -n auditctl -w "$HOME/linux-lab/LAB36/data/watch.txt" -p wa -k t5_watch_lab` y confirma que quedó activa: `sudo -n auditctl -l | grep -F 't5_watch_lab'` → `"$HOME/linux-lab/LAB36/lab36-regla-post.txt"`.
6. Realiza **un único** cambio de contenido: `printf 'v1\n' >> "$HOME/linux-lab/LAB36/data/watch.txt"`.
7. Consulta el evento por clave: `sudo -n ausearch -k t5_watch_lab -i 2>&1 | tail -60` → `"$HOME/linux-lab/LAB36/lab36-evento.txt"`.
8. Inspecciona el evento completo por `serial` y verifica identidad y ruta: `sudo -n ausearch -k t5_watch_lab -i 2>&1 | grep -E 'type=|auid=|uid=|euid=|name=|key='` → `"$HOME/linux-lab/LAB36/lab36-campos.txt"`. Explica qué significa `auid=unset` (`4294967295`) cuando aparezca.
9. Prueba **negativa**: realiza una lectura del archivo (`cat`) y confirma que la regla `-p wa` **no** la registra; documenta que la cobertura es de escritura/atributos, no de lectura → `"$HOME/linux-lab/LAB36/lab36-negativa.txt"`.
10. **Retira exactamente la misma regla**: `sudo -n auditctl -W "$HOME/linux-lab/LAB36/data/watch.txt" -p wa -k t5_watch_lab` y verifica su ausencia: `sudo -n auditctl -l | grep -F 't5_watch_lab' || echo 'regla retirada'`.
11. Captura el **post** y compara `lost`/`backlog` y el conjunto de reglas ajenas: `sudo -n auditctl -s 2>&1; sudo -n auditctl -l 2>&1` → `"$HOME/linux-lab/LAB36/lab36-audit-post.txt"`.
12. Construye el **diff de reglas** pre/post y confirma que solo desapareció la tuya en `"$HOME/linux-lab/LAB36/lab36-diff.md"`.
13. Si `auditd` no está disponible o no hay autorización para reglas, **no lo simules como real**: escribe un evento sintético rotulado, declara «instrumentación no presente» y marca la cobertura como **no cubierta** → `"$HOME/linux-lab/LAB36/lab36-simulacion.md"`.
14. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB36"/lab36-*.*; } > "$HOME/linux-lab/LAB36/SHA256SUMS"`.

> **Prohibido** `auditctl -D`, `auditctl -e 2`, escribir en `/etc/audit` o reiniciar `auditd`. **No** instrumentes rutas críticas ni la raíz del sistema. La regla vive solo mientras dura la tarea y se retira con `-W` sobre la **misma** expresión.

### Verificación y limpieza

15. Confirma que el evento positivo existe y correlaciona `SYSCALL`, `PATH` y `CWD` por el mismo `serial`, y que la prueba negativa es coherente con `-p wa`.
16. Verifica que `lost` y `backlog` no empeoraron de forma atribuible a tu regla y que las reglas ajenas están intactas.
17. Comprueba que la regla fue retirada y que `auditctl -l` no la muestra; si hubo simulación, verifica que está rotulada como tal.
18. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB36/SHA256SUMS"` y **limpieza**: elimina solo el contenido sintético bajo `"$HOME/linux-lab/LAB36"`, comprobando el prefijo de ruta.

## Evidencia a entregar

- El **diff de reglas** pre/post (`auditctl -l`).
- El **evento positivo** correlacionado por `serial`, y la **prueba negativa** o la falta de cobertura declarada.
- Los valores de **`lost` y `backlog`** antes y después.
- La **retirada** de la regla con confirmación de que las demás siguen intactas.
- **Hash** y fecha en UTC.

## Criterios de aceptación

- Instrumentación (3): regla única, sobre archivo propio, con clave y baseline documentados.
- Evento y lectura (3): evento positivo con `serial`, identidad (`uid`/`euid`/`auid`) y `PATH`; negativa coherente con `-p wa`.
- Pérdida y límites (2): `lost`/`backlog` antes y después, con interpretación de que «regla cargada» no garantiza «evento recibido».
- Reversión (2): regla retirada con `-W` sobre la misma expresión, sin tocar otras reglas ni reiniciar el servicio.
- **Fallo crítico:** usar `auditctl -D`, `auditctl -e 2`, escribir en `/etc/audit`, reiniciar `auditd` o instrumentar rutas de producción. Aquí solo se vigila un archivo propio.

## Autorización y límites

Actividad sobre una **VM desechable** con `auditd` y **permiso explícito** para una regla efímera. **Prohibido** `auditctl -D`, `auditctl -e 2`, modificar `/etc/audit` o reiniciar `auditd`, instrumentar rutas críticas o toda la raíz. La regla se retira con `-W` sobre la misma expresión y se verifica la ausencia. Sin `auditd` o sin autorización, se declara **no cubierto** y se usa un evento sintético rotulado.

## Limpieza

No borres nada antes de obtener la evidencia. Tras validarla, confirma que la regla fue retirada y elimina **solo** el contenido sintético dentro de `"$HOME/linux-lab/LAB36"`, comprobando el prefijo de ruta. Conserva `lab36-*.txt`, `lab36-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
