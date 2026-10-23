# LNX-LAB09 — Drop-ins, precedencia y daemon-reload

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Comprender la diferencia entre **fragmento base, drop-in y configuración cargada**: añadir un override aislado a una unidad de usuario didáctica, demostrar la **precedencia**, observar `NeedDaemonReload` y ejecutar un **rollback** verificado (base documental: F22, F28).

## Competencia

Gestión reversible de configuración de systemd: predecir el valor efectivo antes de cargarlo, comprobar el efecto de `daemon-reload` y retirar el cambio sin tocar unidades productivas.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-10`. Requiere VM propia, una definición inocua de usuario (conservada o recreada de `LNX-LAB08`) y `systemctl --user` operativo. No se requieren privilegios root.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-09`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.9.90`). No se usan IPs reales.
- Unidad didáctica de ejemplo `lab-marker.service` (recreada o conservada de `LNX-LAB08`); override de ejemplo `50-lab-hardening.conf`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB09"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio de evidencia y el directorio de drop-ins de la unidad didáctica:
   `mkdir -p "$HOME/linux-lab/LAB09" "$HOME/.config/systemd/user/lab-marker.service.d"`
2. Registra fecha y hora en **UTC**: `date -u -Is`

### Tarea (override reversible sobre una unidad de usuario)

3. Crea el override aislado `50-lab-hardening.conf` con tres controles de ejemplo:
   `[Service]`, `NoNewPrivileges=true`, `PrivateTmp=true`, `ProtectHome=read-only`
4. Observa **antes** de cargar la configuración: `systemctl --user cat lab-marker.service` y `systemctl --user show lab-marker.service -p DropInPaths -p NeedDaemonReload`
5. Anota el valor de `NeedDaemonReload` y explica qué significa antes de recargar.
6. Carga la configuración y revisa el valor efectivo: `systemctl --user daemon-reload` y luego `systemctl --user show lab-marker.service -p ProtectHome -p DropInPaths -p NeedDaemonReload`
7. **Predice** el impacto antes de ejecutar: `ProtectHome=read-only` puede impedir que el script escriba su marca en el log del laboratorio. Documenta el efecto esperado y **no** ejecutes el servicio hasta haberlo previsto en la VM.

> Modifica **exclusivamente** la unidad didáctica de usuario. Nunca apliques drop-ins a servicios de producción. Guarda una copia de seguridad antes de cualquier cambio.

### Verificación y limpieza

8. Confirma que `DropInPaths` lista el override recién añadido y que el valor de `ProtectHome` proviene de él.
9. **Rollback**: preserva el override y su hash — `cp "$HOME/.config/systemd/user/lab-marker.service.d/50-lab-hardening.conf" "$HOME/linux-lab/LAB09/"` y `sha256sum "$HOME/linux-lab/LAB09/50-lab-hardening.conf" > "$HOME/linux-lab/LAB09/SHA256SUMS-override"`
10. Elimina **solo** el override creado: `rm -- "$HOME/.config/systemd/user/lab-marker.service.d/50-lab-hardening.conf"` y ejecuta `systemctl --user daemon-reload`
11. Comprueba que el valor efectivo volvió al del fragmento base: `systemctl --user show lab-marker.service -p ProtectHome -p DropInPaths -p NeedDaemonReload`.

## Evidencia a entregar

- Un **diff conceptual** entre el fragmento base y la configuración efectiva con el override.
- La evidencia de `NeedDaemonReload` y de la **propiedad cargada** (`DropInPaths`, valor efectivo).
- El análisis de por qué el sandbox (`ProtectHome=read-only`) puede impedir escrituras legítimas en el HOME.
- La **prueba de rollback** con el valor restaurado y el hash del override.

## Criterios de aceptación

- Precedencia (7): se explica cómo el drop-in modifica el fragmento base y se demuestra con el valor leído.
- Reload (5): no se confunde `daemon-reload` con `restart` ni con volver a ejecutar la unidad.
- Compatibilidad (5): se prevé el efecto del sandbox sobre el HOME antes de ejecutar.
- Rollback (5): el cambio se deshace por completo y queda documentado.
- **Fallo crítico:** aplicar el override a una unidad productiva o interpretar `daemon-reload` como un reinicio del servicio.

## Autorización y límites

Actividad **reversible** limitada a la unidad didáctica de usuario `lab-marker.service` y su directorio `.service.d`. No toques unidades productivas, no uses `sudo` y no cambies la configuración global. Prevé el impacto antes de ejecutar y conserva copia/rollback.

## Limpieza

Preserva el hash del drop-in, **elimina solo** `50-lab-hardening.conf`, ejecuta `systemctl --user daemon-reload` y verifica el estado final del valor efectivo. Deja la unidad didáctica como estaba antes del override.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
