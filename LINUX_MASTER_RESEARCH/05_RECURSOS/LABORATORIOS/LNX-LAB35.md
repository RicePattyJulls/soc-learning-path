# LNX-LAB35 — journal: canary, campos y retención

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Emitir un **evento canario sintético** con `logger`, recuperarlo por etiqueta y exportarlo en JSON para identificar `timestamp`, `boot_id`, `PID`, `UID` y `SYSLOG_IDENTIFIER`, y describir la **retención real** del journal en espacio y ventana observada, sin afirmar días garantizados ni vaciar el journal (base documental: F113, F114, F120, F122).

## Competencia

Verificación de un canal de registro **extremo a extremo**: el evento se emitió, se ingirió, se puede consultar y se puede exportar, o la brecha se documenta como **no cubierta**.

## Nivel y prerrequisitos

Básico. Conviene haber recorrido la etapa `LNX-28`. Requiere `systemd-journald`, `journalctl` y `logger`. No se requieren privilegios administrativos; algunas consultas de configuración pueden ser de solo lectura.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-35`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales.
- Canario de ejemplo: etiqueta `t5-lab-canary` y mensaje `CANARY_LNX_T5_PERSISTENCIA_SINTETICA`. Sin secretos, sin datos personales y sin datos de terceros.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB35"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB35"`.
2. Registra fecha **UTC**, `boot_id` y versión de journald: `date -u -Is; cat /proc/sys/kernel/random/boot_id; journalctl --version | head -2` → `"$HOME/linux-lab/LAB35/lab35-entorno.txt"`.
3. Anota la hora exacta **antes** de emitir el canario, para acotar la ventana de búsqueda: `date -u +%FT%TZ > "$HOME/linux-lab/LAB35/lab35-ventana.txt"`.

### Tarea (canario, campos y retención)

4. Emite **un solo** evento sintético etiquetado: `logger -t t5-lab-canary -- 'CANARY_LNX_T5_PERSISTENCIA_SINTETICA'`.
5. Recupera el evento por etiqueta y ventana: `journalctl -t t5-lab-canary --since '10 minutes ago' --no-pager` → `"$HOME/linux-lab/LAB35/lab35-canary.txt"`.
6. Exporta en JSON y verifica los **campos**: `journalctl -t t5-lab-canary --since '10 minutes ago' -o json --no-pager | head -c 5000` → `"$HOME/linux-lab/LAB35/lab35-canary.json"`. Identifica `__REALTIME_TIMESTAMP`, `_BOOT_ID`, `_PID`, `_UID`, `SYSLOG_IDENTIFIER` y `MESSAGE`, y marca los que **falten**.
7. Contrasta el `_BOOT_ID` del evento con el del paso 2 y comprueba que el `_PID` corresponde al proceso `logger` ya terminado, no a tu shell: `journalctl -t t5-lab-canary -o verbose --no-pager | head -40` → `"$HOME/linux-lab/LAB35/lab35-verbose.txt"`.
8. Mide la **retención observada**: `journalctl --disk-usage; journalctl --list-boots --no-pager` → `"$HOME/linux-lab/LAB35/lab35-retencion.txt"`.
9. Lee la **política efectiva** sin modificarla: `journalctl --header 2>/dev/null | head -20; grep -RHE '^[[:space:]]*(Storage|SystemMaxUse|SystemKeepFree|RateLimitIntervalSec|RateLimitBurst)=' /etc/systemd/journald.conf /etc/systemd/journald.conf.d 2>/dev/null` → `"$HOME/linux-lab/LAB35/lab35-politica.txt"`.
10. Explica la diferencia entre `Storage=persistent` (solicita persistencia si `/var/log` es utilizable), `SystemMaxUse` (límite de **espacio**) y una **ventana en días** (que depende de la tasa real de eventos, compresión y rotación) en `"$HOME/linux-lab/LAB35/lab35-limites.md"`.
11. Formula **una prueba negativa**: busca una etiqueta que no exista (`journalctl -t t5-lab-inexistente --since '10 minutes ago'`) y documenta que la ausencia de resultados **no** prueba que el sensor esté sano, solo que no hay coincidencia → `"$HOME/linux-lab/LAB35/lab35-negativa.txt"`.
12. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB35"/lab35-*.*; } > "$HOME/linux-lab/LAB35/SHA256SUMS"`.

> **No** uses `journalctl --vacuum-*`, **no** borres el journal, **no** generes una inundación de eventos y **no** insertes datos personales. Un evento por ejecución es suficiente.

### Verificación y limpieza

13. Confirma que el canario aparece con **hora, etiqueta y `boot_id`** cuando están presentes, o que la brecha está documentada como **no cubierta** con su causa probable (rate limit, `Storage=volatile`, rotación, filtro).
14. Verifica que la retención se expresa en **espacio y ventana observada**, nunca como «30 días garantizados».
15. Comprueba que `--disk-usage` y `--list-boots` son coherentes con la política leída y que no atribuyes a `journald` un evento que pudo entrar por otra vía syslog.
16. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB35/SHA256SUMS"`. **Limpieza**: no hay nada que revertir en el journal; el evento caduca por la política normal del laboratorio. Elimina solo copias temporales bajo `"$HOME/linux-lab/LAB35"` si no las conservas como evidencia.

## Evidencia a entregar

- El **canario encontrado** por etiqueta y ventana, o la **brecha documentada**.
- El **export JSON** con `timestamp`, etiqueta y `boot_id` cuando estén presentes.
- La **medición de retención** (`--disk-usage`, `--list-boots`) y la política efectiva leída.
- La **prueba negativa** con su interpretación.
- La **captura redigida** sin secretos, con hash y UTC.

## Criterios de aceptación

- Canario (3): emitido una vez, recuperado por etiqueta y ventana, con campos identificados.
- Campos y tiempo (2): `boot_id` y `timestamp` contrastados; campos ausentes declarados.
- Retención y límites (3): `Storage`/`SystemMaxUse` explicados como espacio y ventana observada, sin promesas en días.
- Evidencia y seguridad (2): hash, UTC y ausencia de datos personales; journal no vaciado.
- **Fallo crítico:** vaciar o borrar el journal, inundar el registro con eventos, insertar datos personales o afirmar «30 días garantizados» sin medición. Aquí el canario es único y sintético.

## Autorización y límites

Actividad de **emisión controlada y lectura** sobre una **VM propia**. **Prohibido** `journalctl --vacuum-*`, borrar archivos del journal, generar inundaciones de eventos e insertar datos personales o de terceros. El canario es un único evento identificable y sin valor sensible.

## Limpieza

No borres el journal ni uses `--vacuum`. El evento del canario caduca por la política de retención del laboratorio. Conserva `lab35-*.txt`, `lab35-*.json`, `lab35-*.md` y `SHA256SUMS` como evidencia; elimina solo copias temporales fuera de `"$HOME/linux-lab/LAB35"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
