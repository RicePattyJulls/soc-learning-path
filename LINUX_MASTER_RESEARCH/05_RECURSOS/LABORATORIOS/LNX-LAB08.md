# LNX-LAB08 — Servicio y timer inocuos de usuario

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Crear y ejecutar un **servicio y un timer de usuario inocuos**, sin privilegios root ni red, que solo añaden una marca de tiempo UTC a un archivo propio, y demostrar activación, identidad y **limpieza reversible** (base documental: F21, F23, F25, F26, F27).

## Competencia

Manejo controlado y **reversible** del gestor de usuario: definir unidades aisladas, probarlas una vez, preservar la evidencia y retirar los artefactos sin dejar rastro.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-09`. Requiere VM propia, `systemctl --user` operativo y HOME escribible. No se requieren privilegios root y no se habilita `linger`.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-08`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.8.80`). No se usan IPs reales.
- Unidades de ejemplo de nombre `lab-marker.service` y `lab-marker.timer`; script de ejemplo `"$HOME/.local/libexec/lab-marker.sh"`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB08"`. El script escribe **solo** en `"$HOME/linux-lab/LAB08/actividad.log"`.

## Procedimiento por pasos

### Preparación

1. Crea los directorios de trabajo de usuario: `mkdir -p "$HOME/.local/libexec" "$HOME/.config/systemd/user" "$HOME/linux-lab/LAB08"`
2. Registra fecha y hora en **UTC**: `date -u -Is`

### Tarea (creación reversible y prueba única)

3. Crea el script inocuo, que solo añade marcas de tiempo UTC a un archivo local, con heredoc literal:
   `umask 077; printf '%s\n' '#!/bin/sh' 'printf "%s\n" "$(date -u -Is)" >> "$HOME/linux-lab/LAB08/actividad.log"' > "$HOME/.local/libexec/lab-marker.sh"` y luego `chmod 700 "$HOME/.local/libexec/lab-marker.sh"`
4. Define la unidad de usuario `lab-marker.service` con: `[Service]`, `Type=oneshot`, `ExecStart=%h/.local/libexec/lab-marker.sh`, `NoNewPrivileges=true` y `PrivateTmp=true`.
5. Define el timer de usuario `lab-marker.timer` con: `[Timer]`, `OnCalendar=hourly`, `Persistent=false`, `Unit=lab-marker.service` y `[Install] WantedBy=timers.target`.
6. **Valida** la sintaxis antes de activar: `systemd-analyze verify "$HOME/.config/systemd/user/lab-marker.service" "$HOME/.config/systemd/user/lab-marker.timer"`
7. Recarga el gestor de usuario y ejecuta una vez el servicio:
   `systemctl --user daemon-reload`
   `systemctl --user start lab-marker.service`
8. Habilita el timer y demuestra su origen:
   `systemctl --user enable --now lab-marker.timer`
   `systemctl --user list-timers --all | grep lab-marker || :`
   `journalctl --user -u lab-marker.service --no-pager`
   `cat "$HOME/linux-lab/LAB08/actividad.log"`
9. Registra la **identidad** de usuario que ejecuta el servicio: `id` y `systemctl --user show lab-marker.service -p User -p ExecStart -p TriggeredBy`

> El timer `hourly` puede dispararse de nuevo antes de la limpieza: retíralo en cuanto termines la prueba. Si `systemctl --user` no está disponible (contenedor o sesión sin bus de usuario), guarda el error, **no** fuerces `loginctl enable-linger` y documenta la limitación.

### Verificación y limpieza

10. Deshabilita y detén el timer y el servicio:
    `systemctl --user disable --now lab-marker.timer`
    `systemctl --user stop lab-marker.service || :`
11. **Preserva** las definiciones y sus hashes antes de borrar:
    `cp "$HOME/.config/systemd/user/lab-marker."{service,timer} "$HOME/linux-lab/LAB08/"`
    `sha256sum "$HOME/linux-lab/LAB08/"*.service "$HOME/linux-lab/LAB08/"*.timer > "$HOME/linux-lab/LAB08/SHA256SUMS-units"`
12. Elimina los tres archivos de laboratorio y recarga el gestor:
    `rm -- "$HOME/.config/systemd/user/lab-marker.service" "$HOME/.config/systemd/user/lab-marker.timer" "$HOME/.local/libexec/lab-marker.sh"`
    `systemctl --user daemon-reload`
13. Confirma que no quedan restos: `systemctl --user list-unit-files | grep lab-marker || :` y comprueba que el timer ya no aparece en `systemctl --user list-timers --all`.

## Evidencia a entregar

- Las definiciones `lab-marker.service` y `lab-marker.timer` **preservadas** en la carpeta de evidencia.
- El archivo `actividad.log` con al menos **una ejecución** registrada.
- La **identidad de usuario** documentada (UID del contexto que ejecuta).
- La prueba de deshabilitación, parada y **eliminación**, más el archivo `SHA256SUMS-units`.

## Criterios de aceptación

- Inocuidad (5): el script no usa red ni escalada de privilegios y escribe solo en el log propio.
- Conceptos (6): se distingue `start` de `enable` y se clasifica la activación por timer.
- Límite (4): se explica la limitación de persistencia tras cerrar sesión cuando no hay `linger`.
- Reversión (5): la limpieza queda validada y se obtienen los hashes.
- **Fallo crítico:** usar la red, `sudo`, `loginctl enable-linger` o dejar unidades, timers o scripts sin retirar. Todo el laboratorio es eliminable.

## Autorización y límites

Actividad **reversible** confinada a unidades de usuario propias bajo `"$HOME/.config/systemd/user"` y `"$HOME/linux-lab/LAB08"`. No actives `linger`, no cambies la configuración global ni uses sockets externos. No publiques datos del host de laboratorio. Emulación inocua y visible.

## Limpieza

Retira el timer (`disable --now`), detén el servicio, **preserva** las definiciones y hashes en `"$HOME/linux-lab/LAB08"`, elimina los tres archivos de laboratorio y ejecuta `systemctl --user daemon-reload`. No habilites `linger`. Confirma que el timer ya no está activo.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
