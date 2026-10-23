# LNX-LAB11 — Triage de persistencia simulada

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Realizar el **triage SOC** de una persistencia de usuario propia, visible e inocua (`lab-marker` de `LNX-LAB08`/`LNX-LAB09`), construyendo la cronología, separando evidencia de hipótesis y distinguiendo **cobertura ausente** de evasión (base documental: F20, F26, F27).

## Competencia

Análisis defensivo en **solo lectura**: correlacionar creación, habilitación y ejecución de artefactos, atribuir con evidencia y declarar «no medido» cuando no existe sensor.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-11`. Requiere VM propia, la evidencia de `LNX-LAB08` y `LNX-LAB09`, autorización explícita del entorno y logs o capturas de la sesión disponibles. No se usan payloads, ninguna evasión, descarga, exfiltración ni privilegio root.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-11`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.11.110`). No se usan IPs reales.
- Artefactos didácticos de ejemplo: `lab-marker.service` y `lab-marker.timer` (emulación propia y autorizada); si ya se limpiaron, se usan las copias preservadas y se declara qué no puede observarse.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB11"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio de evidencia: `mkdir -p "$HOME/linux-lab/LAB11"`
2. Registra fecha y hora en **UTC** y confirma la **autorización** del entorno: `date -u -Is`

### Tarea (triage de solo lectura)

3. **Consolida la cronología** de los artefactos de usuario:
   `stat "$HOME/.config/systemd/user/lab-marker.service"`
   `stat "$HOME/.config/systemd/user/lab-marker.timer"`
   `journalctl --user -u lab-marker.service --no-pager`
   (si ya limpiaste, usa las copias de `LNX-LAB08` y declara qué no puede observarse)
4. **Comprueba identidad y disparadores**:
   `systemctl --user show lab-marker.service -p User -p ExecStart -p TriggeredBy`
   `systemctl --user list-timers --all`
   `loginctl show-user "$USER" -p Linger` (consultar, **no** cambiar)
5. **Construye detecciones conceptuales**: correlaciona la creación de la unidad, la habilitación del timer y la ejecución; señala si FIM, `auditd` o EDR no estaban configurados en el laboratorio.
6. **Emite el informe SOC** y define el retest usando la plantilla de evidencia, documentando la retirada de artefactos.

> La emulación es propia, visible e inocua. **Ninguna** evasión, descarga, exfiltración ni elevación a root. **No** llames malicioso a un artefacto por su nombre o ruta.

### Verificación y limpieza

7. **Confirma la limpieza**: el timer está deshabilitado, el servicio detenido y las unidades de usuario retiradas.
8. Vuelve a listar la unidad y el timer para demostrar la ausencia de artefactos: `systemctl --user list-unit-files | grep lab-marker || :` y `systemctl --user list-timers --all`.
9. Si el sensor no existía, declara **«no medido»**, nunca «evadido», y cierra el caso.

## Evidencia a entregar

- Un **resumen** de 150 palabras como máximo con el veredicto (emulación autorizada).
- **Ocho evidencias numeradas** procedentes de `stat`, `systemctl`, `journalctl`, hashes y el archivo de actividad.
- **Dos hipótesis alternativas** y **tres mitigaciones** (permisos, inventario/política y detección).
- Una **matriz de cobertura** observado / no medido y un **plan de retest**.
- La confirmación de la retirada de los artefactos.

## Criterios de aceptación

- Atribución (6): la atribución y la causalidad se basan en evidencia y no en suposiciones.
- Alcance (5): **no** se asume persistencia de root; se explica por qué no hubo elevación ni evasión.
- Cobertura (5): se distingue cobertura ausente («no medido») de evasión, y se confirma la limpieza.
- Informe (4): el resumen, las hipótesis y las mitigaciones son coherentes y no incluyen datos sensibles.
- **Fallo crítico:** usar payloads, ocultación, conexiones externas o elevación, o llamar malicioso a un artefacto por su nombre o ruta.

## Autorización y límites

Emulación **propia, visible e inocua**, solo sobre el host de laboratorio y con autorización explícita del entorno. **Prohibido** cualquier mecanismo de evasión, descarga, exfiltración o privilegio root. No habilites `linger` ni cambies políticas del equipo. No publiques datos del host de laboratorio.

## Limpieza

Desactiva el timer, detén el servicio, **preserva** y retira las unidades de usuario y vuelve a listar la unidad y el timer para confirmar que no quedan artefactos. Cierra el caso con la evidencia preservada en `"$HOME/linux-lab/LAB11"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
