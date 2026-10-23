# LNX-LAB39 — Bash de evidencia privada, idempotente

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Construir y ejecutar un script Bash **idempotente** de captura de evidencia que, en cada ejecución, cree un directorio **nuevo y privado**, registre contexto UTC y `boot_id`, genere un manifiesto SHA-256 verificable y falle de forma controlada ante entradas inválidas, sin usar `sudo`, `eval`, clientes de red ni borrado automático (base documental: F02, F121, F122, F124).

## Competencia

Automatización de evidencia defendible: citar rutas con espacios, separar `stdout` de `stderr`, controlar códigos de salida, no sobrescribir evidencia previa y declarar los límites de lo capturado.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-31` y tener `LNX-LAB31` y `LNX-LAB37` recomendados. Requiere `bash` 4 o superior, `coreutils`, `mktemp`, `sha256sum` y `ps`. No se requieren privilegios administrativos.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-39`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales. Para loopback se escribe literalmente `localhost`.
- Entradas sintéticas con espacios en el nombre: `nota de caso.txt` y `otra-nota.txt`; ninguna contiene credenciales ni datos de terceros.
- Identificador de caso con plantilla no hexadecimal: `CASE-LNX-AAAAMMDD-NNN`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB39"` con subdirectorios `bin`, `datos`, `evidencia` y `registro`.

## Procedimiento por pasos

### Preparación

1. Crea el árbol aislado con umask restrictiva: `umask 077; mkdir -p "$HOME/linux-lab/LAB39"/{bin,datos,evidencia,registro}`.
2. Registra fecha **UTC**, `boot_id`, versión de Bash, identidad y umask: `date -u -Is; cat /proc/sys/kernel/random/boot_id; bash --version | head -1; id; umask` → `"$HOME/linux-lab/LAB39/registro/lab39-entorno.txt"`.
3. Crea las entradas sintéticas y fija su hash inicial: `printf 'nota sintética LAB39\n' > "$HOME/linux-lab/LAB39/datos/nota de caso.txt"; printf 'segunda nota sintética\n' > "$HOME/linux-lab/LAB39/datos/otra-nota.txt"; (cd "$HOME/linux-lab/LAB39/datos" && sha256sum ./* > ../registro/entrada-antes.sha256)`.
4. Escribe el script de captura en `"$HOME/linux-lab/LAB39/bin/lab39-captura.sh"` con este contenido (el modo se fija en el paso siguiente):

```bash
#!/usr/bin/env bash
set -euo pipefail
umask 077

uso() {
  printf 'uso: %s --case-id CASE-LNX-AAAAMMDD-NNN --input DIR --out DIR\n' "${0##*/}" >&2
}

case_id=""
input_dir=""
out_root=""

while [ "$#" -gt 0 ]; do
  case "$1" in
    --case-id)
      [ "$#" -ge 2 ] || { uso; exit 2; }
      case_id="$2"; shift 2 ;;
    --input)
      [ "$#" -ge 2 ] || { uso; exit 2; }
      input_dir="$2"; shift 2 ;;
    --out)
      [ "$#" -ge 2 ] || { uso; exit 2; }
      out_root="$2"; shift 2 ;;
    -h|--help) uso; exit 0 ;;
    *) printf 'argumento no reconocido: %s\n' "$1" >&2; uso; exit 2 ;;
  esac
done

if [ -z "$case_id" ] || [ -z "$input_dir" ] || [ -z "$out_root" ]; then
  uso
  exit 2
fi

case "$case_id" in
  CASE-LNX-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]-[0-9][0-9][0-9]) ;;
  *) printf 'case-id inválido; use CASE-LNX-AAAAMMDD-NNN\n' >&2; exit 2 ;;
esac

[ -d "$input_dir" ] && [ -r "$input_dir" ] || { printf 'entrada no legible\n' >&2; exit 3; }
[ -d "$out_root" ] && [ -w "$out_root" ] || { printf 'salida no escribible\n' >&2; exit 3; }

case_dir=$(mktemp -d "$out_root/evidencia.XXXXXXXX") || { printf 'no se pudo crear el directorio\n' >&2; exit 4; }
trap 'printf "Salida: %s\n" "$case_dir" >&2' EXIT

{
  printf 'case_id=%s\n' "$case_id"
  printf 'inicio_utc=%s\n' "$(date -u +%FT%TZ)"
  printf 'host=%s\n' "$(hostname)"
  printf 'boot_id=%s\n' "$(cat /proc/sys/kernel/random/boot_id)"
  printf 'kernel=%s\n' "$(uname -r)"
  printf 'identidad=%s\n' "$(id)"
  printf 'umask=%s\n' "$(umask)"
} > "$case_dir/contexto.txt"

ps -eo pid,ppid,uid,stat,comm --sort=pid > "$case_dir/procesos.txt"

{
  printf 'Captura de solo lectura sobre datos sintéticos.\n'
  printf 'No incluye memoria, secretos, credenciales ni datos de otras cuentas.\n'
  printf 'Los tiempos son locales del host y no sustituyen la hora de un SIEM.\n'
} > "$case_dir/limitaciones.txt"

(
  cd "$input_dir"
  find . -maxdepth 1 -type f -print0 | sort -z | xargs -0 sha256sum
) > "$case_dir/entrada.sha256"

(
  cd "$case_dir"
  find . -maxdepth 1 -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS
)

printf '%s\n' "$case_dir"
```

5. Comprueba sintaxis y revisa el script antes de ejecutarlo: `chmod 700 "$HOME/linux-lab/LAB39/bin/lab39-captura.sh"; bash -n "$HOME/linux-lab/LAB39/bin/lab39-captura.sh"; grep -nE '\b(sudo|eval|curl|wget|ssh|nc|socat)\b' "$HOME/linux-lab/LAB39/bin/lab39-captura.sh" || true` → `"$HOME/linux-lab/LAB39/registro/lab39-revision.txt"`.

### Tarea (captura, idempotencia y errores controlados)

6. Ejecuta la **primera captura** con el identificador `CASE-LNX-20261019-001`, separando salida y errores: `set +e; "$HOME/linux-lab/LAB39/bin/lab39-captura.sh" --case-id CASE-LNX-20261019-001 --input "$HOME/linux-lab/LAB39/datos" --out "$HOME/linux-lab/LAB39/evidencia" > "$HOME/linux-lab/LAB39/registro/ejecucion-1.out" 2> "$HOME/linux-lab/LAB39/registro/ejecucion-1.err"; rc1=$?; set -e; printf 'exit_1=%s\n' "$rc1" >> "$HOME/linux-lab/LAB39/registro/codigos.txt"`.
7. Ejecuta la **segunda captura** con el **mismo** identificador y el mismo destino: `set +e; "$HOME/linux-lab/LAB39/bin/lab39-captura.sh" --case-id CASE-LNX-20261019-001 --input "$HOME/linux-lab/LAB39/datos" --out "$HOME/linux-lab/LAB39/evidencia" > "$HOME/linux-lab/LAB39/registro/ejecucion-2.out" 2> "$HOME/linux-lab/LAB39/registro/ejecucion-2.err"; rc2=$?; set -e; printf 'exit_2=%s\n' "$rc2" >> "$HOME/linux-lab/LAB39/registro/codigos.txt"`.
8. Repite con una ruta de salida que contenga espacios: `mkdir -p "$HOME/linux-lab/LAB39/evidencia/salida con espacios"; "$HOME/linux-lab/LAB39/bin/lab39-captura.sh" --case-id CASE-LNX-20261019-001 --input "$HOME/linux-lab/LAB39/datos" --out "$HOME/linux-lab/LAB39/evidencia/salida con espacios" > "$HOME/linux-lab/LAB39/registro/ejecucion-3.out" 2> "$HOME/linux-lab/LAB39/registro/ejecucion-3.err"`.
9. Prueba el **error controlado** con un identificador inválido (los espacios son intencionales y van entre comillas simples): `antes=$(find "$HOME/linux-lab/LAB39/evidencia" -mindepth 1 -maxdepth 1 -type d | wc -l); set +e; "$HOME/linux-lab/LAB39/bin/lab39-captura.sh" --case-id 'CASE CON ESPACIOS' --input "$HOME/linux-lab/LAB39/datos" --out "$HOME/linux-lab/LAB39/evidencia" > /dev/null 2> "$HOME/linux-lab/LAB39/registro/error-case-id.err"; rc_invalid=$?; set -e; despues=$(find "$HOME/linux-lab/LAB39/evidencia" -mindepth 1 -maxdepth 1 -type d | wc -l); printf 'rc_invalid=%s antes=%s despues=%s\n' "$rc_invalid" "$antes" "$despues" > "$HOME/linux-lab/LAB39/registro/error-case-id.txt"`.
10. Prueba el **error controlado** de destino inexistente: `set +e; "$HOME/linux-lab/LAB39/bin/lab39-captura.sh" --case-id CASE-LNX-20261019-002 --input "$HOME/linux-lab/LAB39/datos" --out "$HOME/linux-lab/LAB39/evidencia/no-existe" > /dev/null 2> "$HOME/linux-lab/LAB39/registro/error-destino.err"; rc_destino=$?; set -e; printf 'rc_destino=%s\n' "$rc_destino" >> "$HOME/linux-lab/LAB39/registro/codigos.txt"`.
11. Verifica cada manifiesto **desde dentro** de su directorio: `for d in "$HOME/linux-lab/LAB39/evidencia"/evidencia.* "$HOME/linux-lab/LAB39/evidencia/salida con espacios"/evidencia.*; do [ -d "$d" ] || continue; printf '== %s\n' "$d"; (cd "$d" && sha256sum -c SHA256SUMS); done > "$HOME/linux-lab/LAB39/registro/verificacion-hashes.txt"`.
12. Registra permisos y propietario de directorios y archivos: `find "$HOME/linux-lab/LAB39/evidencia" -maxdepth 3 -printf '%m %u:%g %p\n' > "$HOME/linux-lab/LAB39/registro/permisos.txt"`.
13. Revisa que la evidencia no contenga secretos: `if grep -RInE '(password|passwd|token|secret)[[:space:]]*=' "$HOME/linux-lab/LAB39/evidencia"; then printf 'revisar coincidencias\n'; else printf 'sin coincidencias de secretos en la evidencia\n'; fi > "$HOME/linux-lab/LAB39/registro/privacidad.txt"`.
14. Comprueba que las entradas no cambiaron y que no se crearon cuentas ni unidades: `(cd "$HOME/linux-lab/LAB39/datos" && sha256sum -c ../registro/entrada-antes.sha256) > "$HOME/linux-lab/LAB39/registro/entrada-despues.txt"; id > "$HOME/linux-lab/LAB39/registro/id-despues.txt"; printf 'unidades de usuario: '; systemctl --user list-units --type=service --no-pager 2>/dev/null | wc -l >> "$HOME/linux-lab/LAB39/registro/id-despues.txt"`.
15. Redacta las **limitaciones** y la decisión de retención: qué se observó, qué no (sin memoria, sin tráfico, sin datos privilegiados, un solo host, hora local) y cuánto se conserva. Justifica la retención con el marco de gestión de logs de NIST SP 800-92 (F122) y la preparación de respuesta de NIST SP 800-61r3 (F121) → `"$HOME/linux-lab/LAB39/registro/lab39-limitaciones.md"`.

> **No** uses `sudo`, `eval` ni `bash -c` sobre la entrada, **no** borres evidencia de forma automática y **no** sobrescribas una captura existente. Todo ocurre bajo `"$HOME/linux-lab/LAB39"`.

### Verificación y limpieza

16. Confirma que existen **al menos tres directorios distintos** con el mismo `case_id`, que ninguno sobrescribió al anterior y que la ruta con espacios también generó su propio directorio. Un `mktemp` correcto no reutiliza nombres.
17. Comprueba que los códigos de salida son los esperados (`0` en las capturas válidas, `2` con identificador inválido, `3` con destino inexistente) y que el error de identificador **no** creó directorio.
18. Revisa que el script no contiene `sudo`, `eval`, clientes de red ni borrado dentro de un `trap`; si aparece cualquiera, corrígelo antes de continuar.
19. Sella la evidencia completa: `(cd "$HOME/linux-lab/LAB39" && find . -type f ! -name SHA256SUMS -print0 | sort -z | xargs -0 sha256sum > SHA256SUMS); (cd "$HOME/linux-lab/LAB39" && sha256sum -c SHA256SUMS)`.
20. **Limpieza explícita:** lista los directorios creados y borra solo los que decidas descartar, comprobando el prefijo de ruta. Usa una comprobación como `d="$HOME/linux-lab/LAB39/evidencia/evidencia.XXXXXXXX"; case "$d" in "$HOME/linux-lab/LAB39"/*) printf 'revisar antes de borrar: %s\n' "$d" ;; *) printf 'ruta fuera del LAB: se aborta\n' >&2 ;; esac`. No borres evidencia de forma automática ni con comodines sobre el origen.

## Evidencia a entregar

- El **script** `lab39-captura.sh` y su revisión estática (`bash -n`, búsqueda de `sudo`/`eval`/red).
- Dos o más **directorios de captura distintos** para el mismo `case_id`, incluido uno con espacios en la ruta.
- El **manifiesto SHA-256** de cada captura y la verificación `sha256sum -c`, más el manifiesto externo del LAB.
- Los **códigos de salida** y los errores controlados, con la prueba de que el identificador inválido no creó artefactos.
- La **tabla de permisos** (700/600 esperados), la revisión de secretos y el archivo de **limitaciones y retención**.

## Criterios de aceptación

- Script e idempotencia (3): capturas distintas con el mismo caso, sin sobrescritura, ruta con espacios resuelta y permisos privados.
- Integridad (2): `SHA256SUMS` verificable dentro de cada captura y manifiesto externo reproducible.
- Errores y quoting (3): identificador inválido y destino inexistente con código distinto de cero y sin artefactos; sin `eval` ni `bash -c` sobre entrada.
- Privacidad y límites (2): sin secretos, sin mutación del host, limitaciones escritas y decisión de retención explícita.
- **Fallo crítico:** usar `sudo`, `eval` o `bash -c` sobre datos de entrada, borrar evidencia automáticamente, sobrescribir una captura existente, recoger secretos reales o ejecutar fuera del árbol del LAB.

## Autorización y límites

Actividad sobre una **VM propia**, datos **sintéticos** y el árbol `"$HOME/linux-lab/LAB39"`. **Prohibido** usar privilegios administrativos, leer datos de otras cuentas, contactar servicios de red, escribir fuera del LAB y automatizar el borrado de evidencia. El script es de **captura pasiva**: no traza procesos, no lee memoria y no modifica el sistema. No se usa `strace`: una traza de syscalls puede añadir carga y exige autorización específica; este laboratorio se limita a metadatos (F124). La ejecución se documenta como real o no ejecutada, sin presentar resultados supuestos.

## Limpieza

No borres nada antes de validar los hashes. Conserva al menos una captura completa, los códigos de salida, el manifiesto externo y las limitaciones. Elimina solo directorios identificados y creados por este laboratorio, comprobando el prefijo de ruta y sin usar comodines amplios. Los archivos de entrada sintéticos pueden permanecer hasta que cierres el caso.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
