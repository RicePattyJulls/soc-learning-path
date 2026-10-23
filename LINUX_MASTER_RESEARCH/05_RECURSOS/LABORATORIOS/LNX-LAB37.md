# LNX-LAB37 — Triage SOC, timeline y cadena de custodia

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Construir un **expediente de triaje** con una **línea de tiempo de al menos seis hechos** sustentados en fuente primaria, tres **hipótesis alternativas** con evidencia a favor y en contra, una **decisión de contención proporcional** y una **cadena de custodia** con SHA-256 reproducible, distinguiendo en cada fila **observación** de **inferencia** (base documental: F116, F117, F118, F121, F122).

## Competencia

Triaje ordenado y defendible: fijar hora UTC y `boot_id`, preservar antes de tocar, declarar la fuente de cada dato y sus límites, y no convertir una coincidencia temporal en atribución.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-29` y tener `LNX-LAB35` y `LNX-LAB36` recomendados. Requiere `journalctl`, `ps`, `ss`, `sha256sum` y datos sintéticos propios. **No** se requiere acceso a producción ni a datos de terceros.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-37`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales. Para loopback se escribe literalmente `localhost`.
- Escenario narrado (no ejecutado): `lab-agent` aparece en el árbol de procesos durante la ventana, y un archivo `lab-datos.txt` cambia de tamaño. Ambos son **sintéticos** y creados por ti.
- Identificador de caso con plantilla no hexadecimal: `IR-LINUX-YYYYMMDD-001`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB37"` con subdirectorios `data`, `expediente` y `transferencias`.

## Procedimiento por pasos

### Preparación

1. Crea el árbol y el dato sintético: `mkdir -p "$HOME/linux-lab/LAB37"/{data,expediente,transferencias}; printf 'v0 dato sintético LAB37\n' > "$HOME/linux-lab/LAB37/data/lab-datos.txt"`.
2. Registra la **autoridad y el alcance** del ejercicio: quién autoriza, sobre qué host, con qué límites y hasta cuándo → `"$HOME/linux-lab/LAB37/expediente/lab37-autorizacion.md"`.
3. Fija **hora UTC**, `boot_id`, hostname y zona: `date -u -Is; cat /proc/sys/kernel/random/boot_id; hostname; timedatectl 2>/dev/null | head -5` → `"$HOME/linux-lab/LAB37/expediente/lab37-tiempo.txt"`.

### Tarea (hechos, hipótesis y custodia)

4. Emite **un** canario de journal etiquetado y anota su hora: `logger -t t5-lab-triage -- 'CANARY_LNX_T5_TRIAGE_SINTETICO'; date -u +%FT%TZ` → `"$HOME/linux-lab/LAB37/expediente/lab37-canary.txt"`.
5. Provoca **un único** cambio del dato propio, anotando hora antes y después: `date -u +%FT%TZ; printf 'v1 cambio controlado\n' >> "$HOME/linux-lab/LAB37/data/lab-datos.txt"; date -u +%FT%TZ` → `"$HOME/linux-lab/LAB37/expediente/lab37-cambio.txt"`.
6. Inventaría procesos y sockets con **lecturas acotadas**, sin `kill` y sin tracing: `ps -eo pid,ppid,uid,euid,lstart,stat,comm --sort=pid | head -60; ss -tanup 2>/dev/null | head -40` → `"$HOME/linux-lab/LAB37/expediente/lab37-procesos.txt"`.
7. Recupera el contexto de la ventana desde journal: `journalctl --since '15 minutes ago' --no-pager -n 120` → `"$HOME/linux-lab/LAB37/expediente/lab37-journal.txt"`.
8. Construye la **timeline de seis hechos** con columnas: `UTC | fuente primaria | hecho observado | inferencia (sí/no) | confianza | límite`. Al menos un hecho debe ser negativo (algo que **no** se observó) → `"$HOME/linux-lab/LAB37/expediente/lab37-timeline.md"`.
9. Formula **tres hipótesis alternativas** (por ejemplo: proceso legítimo de mantenimiento, cambio autorizado por el dueño, actividad anómala no atribuida) con evidencia **a favor**, **en contra** y el dato que falta para decidir → `"$HOME/linux-lab/LAB37/expediente/lab37-hipotesis.md"`.
10. Elige una **contención proporcional** y justifica el **orden de preservación**: qué se aísla, qué se mantiene para investigación, qué impacto tiene y qué aprobación requiere. Incluye la opción de **no contener todavía** si el impacto no lo justifica → `"$HOME/linux-lab/LAB37/expediente/lab37-contencion.md"`.
11. Redacta el **plan de recuperación**: causa raíz a confirmar, cambio aprobado, verificación de función legítima y **retest negativo simulado** (la detección vuelve a disparar con un caso sintético) → `"$HOME/linux-lab/LAB37/expediente/lab37-recuperacion.md"`.
12. **Congela el expediente**: calcula SHA-256 de cada artefacto y guárdalos en un manifiesto separado: `sha256sum "$HOME/linux-lab/LAB37"/expediente/* > "$HOME/linux-lab/LAB37/expediente/lab37-manifiesto.sha256"`.
13. Registra la **cadena de custodia**: quién recolectó, con qué herramienta y versión, en qué orden, qué cambios hizo al observar, y cada transferencia con hora UTC y receptor → `"$HOME/linux-lab/LAB37/transferencias/lab37-custodia.md"`.
14. Sella la evidencia completa: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB37"/expediente/* "$HOME/linux-lab/LAB37"/transferencias/*; } > "$HOME/linux-lab/LAB37/SHA256SUMS"`.

> **No** exfiltres datos, **no** mates procesos a ciegas, **no** publiques tokens ni nombres reales. Si un hecho no se observó, se escribe «no observado» y se explica por qué; no se rellena con una suposición.

### Verificación y limpieza

15. Confirma que cada fila de la timeline cita una **fuente primaria** concreta (journal, `ps`, `ss`, `stat`) y que las inferencias están marcadas como tales.
16. Verifica que las tres hipótesis tienen evidencia **en contra** y que al menos una sigue **abierta**; una hipótesis sin dato de falsación no es una hipótesis.
17. Comprueba que la contención elegida es proporcional al impacto declarado y que el orden de preservación no destruye evidencia volátil.
18. Revalida el manifiesto: `sha256sum -c "$HOME/linux-lab/LAB37/expediente/lab37-manifiesto.sha256"` y después `sha256sum -c "$HOME/linux-lab/LAB37/SHA256SUMS"`.
19. **Limpieza**: no hay cambios de host aparte de tus artefactos propios. Decide la retención del expediente y elimina solo el contenido sintético bajo `"$HOME/linux-lab/LAB37"` cuando ya no lo necesites, comprobando el prefijo de ruta.

## Evidencia a entregar

- La **timeline de seis hechos** con fuente, observación/inferencia, confianza y límite.
- Las **tres hipótesis** con evidencia a favor, en contra y dato faltante.
- Los **metadatos** UTC, `boot_id` y autorización.
- El **manifiesto SHA-256** reproducible y la **cadena de custodia** con transferencias.
- El **plan de contención, impacto y recuperación**.

## Criterios de aceptación

- Timeline (3): seis hechos sustentados, con fuente primaria y distinción observación/inferencia.
- Hipótesis (3): tres alternativas con evidencia en contra y al menos una abierta.
- Custodia (2): manifiesto verificable, UTC/`boot_id` y transferencias registradas.
- Contención y recuperación (2): decisión proporcional, impacto declarado y retest negativo.
- **Fallo crítico:** afirmar autoría o exfiltración sin evidencia, matar un PID sin analizar su árbol, o presentar una inferencia como observación. Aquí todo es sintético y propio.

## Autorización y límites

Actividad **defensiva** sobre una **VM propia** y datos **sintéticos**. **Prohibido** exfiltrar datos, lanzar conexiones externas, matar procesos a ciegas y publicar tokens, nombres reales o datos privados. La contención es una **decisión documentada**, no una acción ejecutada sobre infraestructura real. NIST SP 800-61r3 se usa como **marco**, sin reproducir procedimientos de producción.

## Limpieza

No hay cambios de host que revertir aparte de tus artefactos propios. Conserva `expediente/`, `transferencias/` y `SHA256SUMS` como evidencia; elimina solo el contenido sintético bajo `"$HOME/linux-lab/LAB37"` cuando decidas cerrar el caso, comprobando el prefijo de ruta. Redacta rutas y nombres internos antes de compartir.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
