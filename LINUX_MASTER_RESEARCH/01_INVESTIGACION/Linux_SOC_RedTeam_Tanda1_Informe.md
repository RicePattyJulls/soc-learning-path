---
title: "LINUX | SOC + RED TEAM"
subtitle: "Tanda 1 de 5 · Fundamentos, Bash y administración cotidiana"
author: "Dossier técnico de estudio y laboratorio"
date: "18 de octubre de 2026"
lang: es-ES
---

> **Objetivo:** construir una base Linux verificable para operar un host, comprender qué observa un analista SOC y qué superficie examina un operador Red Team autorizado. La prioridad es razonar sobre el sistema, no memorizar una lista de comandos.

**Alcance:** esta tanda desarrolla el primer bloque del documento original: *«Fundamentos de Linux, Bash y administración cotidiana»*. Introduce permisos, procesos y artefactos solo hasta el nivel necesario para la base común. **No sustituye** las tandas posteriores dedicadas a systemd, almacenamiento, redes/SSH, PAM/MAC, logging y auditoría, DFIR, contenedores y técnicas de laboratorio.

**Tipo de evidencia:** `[DOC]` = hecho contrastado con una referencia técnica al final; `[PRÁCTICA]` = procedimiento reproducible en un laboratorio; `[ANÁLISIS]` = interpretación operativa que depende del contexto. Fecha de comprobación de referencias: **18-10-2026**. Los comandos se orientan a GNU/Linux actual; la disponibilidad y el formato pueden variar por distribución, herramienta, permisos, montaje y configuración.

# 1. Mapa de aprendizaje y criterios de salida

Al terminar esta tanda debes ser capaz de:

1. Explicar qué es el *kernel*, qué es el espacio de usuario, qué es una distribución y qué papel desempeña una *shell*.
2. Identificar un host sin modificarlo: distribución, kernel, arquitectura, sesión, identidad efectiva, ubicación y entorno.
3. Navegar por el árbol de directorios y distinguir rutas, archivos, enlaces, metadatos y pseudo-sistemas de archivos.
4. Leer permisos Unix, entender usuario/grupo efectivo, *umask*, ACL y elevación administrativa sin equiparar `root` con una solución universal.
5. Leer procesos, árboles PPID/PID, descriptores y estados; decidir cuándo **no** interrumpir un proceso.
6. Construir comandos de Bash con comillas, redirecciones y tuberías correctas; interpretar códigos de salida y escribir pequeños scripts que no destruyan información.
7. Elaborar una **línea base reproducible** y comunicar hipótesis y límites de visibilidad desde SOC o Red Team autorizado.

**Estándar de aprobación:** 80/100 puntos en laboratorios, 75% en el cuestionario y cero fallos críticos de seguridad (borrado no autorizado, manipulación de un host ajeno, exposición de secretos, alteración de evidencia). Un resultado negativo de un comando **no equivale** a ausencia de actividad; también puede indicar permisos insuficientes o falta de cobertura.

| Dimensión | SOC / Blue Team | Red Team autorizado |
|---|---|---|
| Propósito | Identificar condiciones, triage y preservar contexto | Entender configuración y exposición, demostrar hallazgos en laboratorio |
| Pregunta central | «¿Qué ocurrió, dónde y con qué evidencia?» | «¿Qué configuración habilitaría este riesgo y cómo se demuestra sin dañar?» |
| Señal útil | Identidad, línea temporal, proceso, artefacto y alcance | Identidad real/efectiva, permisos, rutas ejecutables, configuraciones |
| Producto final | Informe de observaciones con límites y medidas | Hallazgo reproducible, impacto acotado, evidencia y remediación |

# 2. Anatomía de Linux: de la aplicación al kernel

## 2.1 Componentes y límites de confianza

**Linux** es estrictamente el kernel. En el uso cotidiano «un sistema Linux» suele significar el kernel más utilidades GNU u otras, librerías, init, shell, gestor de paquetes y servicios empaquetados como una distribución (Debian, Ubuntu, Fedora, Arch, Parrot, etc.). **Bash no es Linux**, es un intérprete de órdenes entre muchos posibles (dash, zsh, fish).

**Modelo operacional simplificado:**

```text
Usuario / analista / operador autorizado
         |
Terminal --> shell (bash) --> herramientas (ps, stat, grep, ...)
                           --> librerías (por ejemplo glibc)
                           --> llamadas al sistema
         |                         |
         +-------------------------v
                           KERNEL LINUX
                   procesos, memoria, VFS,
                   red, identidades, permisos
                                  |
                    hardware / dispositivos
```

Una llamada de sistema (*syscall*) cruza la frontera entre espacio de usuario y kernel; una utilidad es **un programa**, no una syscall en sí misma. Un proceso puede interactuar por interfaces como `openat`, `execve` o `read`. Un terminal gráfico, una sesión SSH, un contenedor y un servicio sin terminal no son el mismo entorno. **No atribuyas a Bash decisiones de acceso que aplica el kernel.** [DOC: F2, F3]

Conceptos de seguridad que conviene diferenciar desde el primer día:

- **Proceso:** instancia en ejecución con PID, contexto de identidad, recursos y entorno. Varias instancias pueden compartir el mismo nombre.
- **UID/GID reales y efectivos:** identifican a un usuario/grupo y participan en las decisiones de credenciales; consulta `id` y las credenciales del proceso, no solo el nombre mostrado en una herramienta. [F3]
- **Capabilities:** Linux divide parte del poder tradicional de `root` en capacidades separadas; los límites reales dependen también de namespaces y políticas. [F4]
- **Namespaces / cgroups:** mecanismos de aislamiento y control de recursos; estar «como root» dentro de un contenedor no implica ser root con los mismos poderes en el host.
- **Distribución:** determina ubicación de paquetes, versiones y valores por defecto. No supongas que un comando o fichero existe en todas.

## 2.2 Cuatro malentendidos peligrosos

1. `uname -r` revela la **versión del kernel cargado**, no la versión de la distribución ni la existencia de todas las mitigaciones; un parche puede haberse retroportado.
2. `whoami` identifica la identidad efectiva asociada al proceso; **no demuestra** quién inició realmente la sesión ni explica un cambio de identidad.
3. Un ejecutable llamado `sshd` **no prueba** que el proceso sea el binario legítimo del paquete; debe contrastarse ruta, ejecutable real, paquete, padre, cgroup y hashes si procede.
4. Un `ps` limpio **no prueba ausencia de compromiso**: es una instantánea y puede estar limitada por permisos, temporización o manipulación del entorno.

# 3. Reconocimiento seguro del host y línea base

**Primera regla:** antes de recolectar, establece **autorización**, alcance, hora y propósito. En un servidor de producción, privilegia operaciones de lectura y coordina cualquier cambio. Ejecuta la siguiente tabla en una VM propia; **no requiere `sudo`**.

| Pregunta | Comando | Interpretación y límite |
|---|---|---|
| ¿Qué distro? | `cat /etc/os-release` | Identifica la distribución declarada, no el kernel |
| ¿Qué kernel / arquitectura? | `uname -srmo` | Release, máquina y SO; posibles diferencias con versión del paquete |
| ¿Quién soy? | `id; whoami` | UID/GID y grupos; `whoami` no es auditoría de login |
| ¿Qué shell ejecuto? | `ps -p $$ -o pid,comm,args=` | Proceso de shell actual si se ejecuta desde Bash |
| ¿Cuál es el directorio? | `pwd -P; printf '%s\n' "$HOME"` | Ruta física y variable HOME pueden diferir |
| ¿En qué host? | `hostname; hostnamectl 2>/dev/null` | Herramienta y datos disponibles según init |
| ¿Qué hora veo? | `date -Is; date -u -Is` | Registrar offset y UTC para correlación posterior |
| ¿Hay límite de recursos? | `ulimit -a` | Límites de la sesión, no de todo el host |
| ¿Dónde está la orden? | `type -a ls; command -v bash` | Alias, función, builtin o ejecutable: no siempre el primero del PATH es fiable |

**Ejemplo de ficha base** (no rellenar con valores inventados):

```text
Host/VM: __________     Caso: __________
Autorización/alcance: __________
Hora local/UTC: __________ / __________
Distro: __________     Kernel: __________     Arq.: __________
UID/GID/grupos: __________     Shell: __________
Fuentes consultadas: /etc/os-release, uname, id, date ...
Limitaciones: sin privilegios / contenedor / comandos no instalados / ...
```

**SOC:** una línea base describe lo *esperado* para ese host. Una divergencia (nuevo usuario, shell poco habitual, binario desde `/tmp`, propietario cambiado) genera una **hipótesis**, no culpabilidad automática. **Red Team:** los mismos datos ayudan a comprender los límites de una cuenta en el alcance autorizado; documenta sin enumerar rutas privadas fuera del objetivo.

# 4. Árbol de archivos: FHS, rutas y metadatos

## 4.1 Rutas y jerarquía

En Linux hay **un árbol lógico** desde `/`. Distintas particiones, dispositivos o sistemas remotos pueden montarse en puntos del árbol. `.` es el directorio actual; `..` el padre; `~` se expande al home en Bash; las rutas son **sensibles a mayúsculas** en muchos sistemas de archivos, pero no todas las configuraciones se comportan igual.

La referencia FHS 3.0, publicada el **13 de octubre de 2026**, describe ubicaciones convencionales, **no garantiza** que cada distribución las implemente literalmente. Sistemas con `/usr` fusionado (*usrmerge*) pueden presentar `/bin` o `/sbin` como enlaces. [F1]

| Ruta | Papel típico | Relevancia defensiva/ofensiva autorizada |
|---|---|---|
| `/etc` | Configuración del host | Configuración efectiva, errores de permisos |
| `/usr/bin`, `/usr/sbin` | Comandos y utilidades | Resolución de ejecutables y procedencia |
| `/usr/local` | Software instalado localmente | Diferenciar administrado por paquetes de despliegue manual |
| `/var/log` | Logs cuando se guardan como ficheros | La evidencia puede estar en journald u otro destino |
| `/var/lib` | Estado variable de aplicaciones | Datos persistentes y controles de acceso |
| `/run` | Datos volátiles desde el arranque | Sockets/PID e indicadores de estado transitorio |
| `/tmp` | Temporales, con política de limpieza variable | Nunca inferir legitimidad solo por la ruta |
| `/var/tmp` | Temporales normalmente más persistentes | Diferencia de política frente a `/tmp` |
| `/proc` | Interfaz virtual del kernel / procesos | Vista dinámica, con visibilidad condicionada |
| `/sys` | Información de dispositivos/kernel | No tratar como archivos de texto convencionales |
| `/dev` | Nodos de dispositivo | Permisos y dispositivos, no ficheros normales |
| `/home`, `/root` | Directorios personales | Acceso depende de permisos y de política de la cuenta |
| `/opt`, `/srv` | Aplicaciones de terceros / servicios | Revisar propiedad, ejecución y configuración |

**Practica primero sobre rutas inocuas:**

```bash
pwd -P
ls -ld /etc /tmp /var/tmp /run /proc
readlink -f /bin   # solo informa de la ruta canónica si puede resolverse
stat /etc/passwd
file /bin/sh
```

`ls -l` es una vista **resumida**. Para el tipo, tamaño, propietarios, permisos y marcas temporales usa `stat`, y para resolver enlaces usa `readlink` cuando corresponda. `file` interpreta el contenido mediante heurísticas; no «certifica» que un binario sea legítimo. En entornos forenses, evita abrir o editar directamente la evidencia original sin un procedimiento de preservación.

## 4.2 Enlaces, inodos y marcas temporales

- **Inodo:** almacena metadatos del archivo y referencia al contenido según el sistema de archivos; el nombre pertenece a una entrada de directorio. Identificar un archivo solo por nombre puede ser insuficiente.
- **Enlace duro (*hard link*):** otro nombre para el mismo inodo en el mismo sistema de archivos; no suele permitirse para directorios.
- **Enlace simbólico:** archivo cuyo contenido refiere a una ruta; el destino puede no existir o cambiar. `ls -l` y `readlink` ayudan a interpretarlo.
- **`mtime`:** modificación de contenido; **`ctime`: cambio de estado del inodo** (no «creation time»); **`atime`: acceso** sujeto a políticas de montaje; **`btime`: creación solo si el sistema de archivos y la interfaz la exponen.** [F5]

```bash
# VM / laboratorio: no afecta al resto del sistema
mkdir -p "$HOME/linux-t1/links"
printf 'muestra\n' > "$HOME/linux-t1/links/base.txt"
ln "$HOME/linux-t1/links/base.txt" "$HOME/linux-t1/links/duro.txt"
ln -s base.txt "$HOME/linux-t1/links/simbolico.txt"
ls -li "$HOME/linux-t1/links"
stat "$HOME/linux-t1/links/base.txt"
readlink "$HOME/linux-t1/links/simbolico.txt"
```

**Qué esperar:** el archivo base y su enlace duro comparten número de inodo en el mismo sistema de archivos. El simbólico tiene inodo propio y contiene una referencia al nombre. Los tiempos pueden tener granularidad limitada y cambiar por operaciones del laboratorio. **No uses `ctime` como fecha de creación** en una cronología.

## 4.3 Buscar sin provocar daños

```bash
find "$HOME/linux-t1" -type f -name '*.txt' -print
find "$HOME/linux-t1" -type l -print
find "$HOME/linux-t1" -type f -mtime -2 -print
```

La expresión `-mtime -2` se mide en **periodos de 24 horas**, no «ayer y hoy» en el calendario; y no demuestra autoría del cambio. En árboles ajenos evita búsquedas amplias que saturen I/O o expongan datos sensibles; limita permisos y profundidad con una razón explícita. Nunca encadenes `find ... -delete` durante una investigación inicial.

# 5. Herramientas diarias, entrada/salida y composición

## 5.1 Caja de herramientas razonada

| Tarea | Comandos iniciales | Qué comprobar |
|---|---|---|
| Navegar | `pwd`, `cd`, `ls`, `find` | Ruta física, enlaces, permisos |
| Leer | `cat`, `less`, `head`, `tail` | Archivo correcto, codificación, tamaño |
| Identificar | `file`, `stat`, `readlink`, `sha256sum` | Formato, metadatos, hash; no atribución automática |
| Filtrar | `grep -F`, `grep -E`, `cut`, `sort`, `uniq` | Delimitadores, líneas duplicadas, orden previo |
| Transformar | `sed`, `awk`, `tr` | Diferencias entre texto y datos estructurados |
| Espacio | `df -h`, `du -sh`, `df -i` | Bloques, inodos, sistemas montados |
| Procesos | `ps`, `top`, `pgrep` | PID, PPID, usuario, instante de observación |
| Ayuda | `man`, `--help`, `help`, `type` | Versión e implementación específicas |

**Precaución:** no hagas un `cat` indiscriminado a gigabytes ni vuelques `/etc/shadow`, tokens o variables de entorno en reportes. `sha256sum` demuestra igualdad de contenido entre dos muestras bajo un procedimiento de integridad; **no demuestra origen seguro ni identidad del autor**.

## 5.2 Los tres descriptores estándar

Cada proceso convencional puede tener: **FD 0 = stdin**, **FD 1 = stdout** y **FD 2 = stderr**. La redirección cambia los destinos; una tubería pasa stdout de un programa a stdin del siguiente. [F2, F6]

```bash
printf 'ok\n' > "$HOME/linux-t1/salida.txt"   # stdout sobreescribe
printf 'otra\n' >> "$HOME/linux-t1/salida.txt" # agrega
ls /ruta-inexistente 2> "$HOME/linux-t1/error.txt"
ls /etc /ruta-inexistente > "$HOME/linux-t1/stdout.txt" \
    2> "$HOME/linux-t1/stderr.txt"
```

`2>&1` significa que **stderr pasa a donde apunta stdout en ese momento**. El orden importa:

```bash
comando > resultado.log 2>&1  # stdout y stderr al archivo
comando 2>&1 > resultado.log  # stderr conserva destino anterior de stdout
```

**No copies rutas genéricas hacia producción**: el operador `>` puede truncar un archivo existente. Para evidencia prefiere un nuevo directorio de caso y nombres irrepetibles, y conserva el resultado original sin editar.

## 5.3 Tuberías y errores de interpretación

```bash
printf 'ssh\ncron\nssh\n' | sort | uniq -c
printf 'alpha beta\n' | awk '{print $2}'
printf 'ERROR: demo\n' | grep -F 'ERROR'
```

- `uniq -c` cuenta **líneas adyacentes**; ordena antes si quieres agrupar todo.
- `grep` devuelve `0` si encuentra coincidencia, `1` si no hay coincidencia y valores mayores (habitualmente `2`) por error. Un «no match» puede ser normal.
- `ps | grep nombre` es una inspección frágil: puede incluir el propio `grep`, no siempre identifica el ejecutable real y omite procesos fugaces; prefiere `pgrep -a -f` en tareas de lectura y **confirma PID y contexto**.

## 5.4 Los comandos que parecen equivalentes y no lo son

| Comandos | Diferencia clave |
|---|---|
| `su - usuario` / `sudo comando` | Cambian identidad/entorno de forma distinta; revisa política y shell |
| `df` / `du` | Espacio del filesystem frente a tamaño accesible del árbol |
| `kill PID` / `kill -9 PID` | `SIGTERM` permite terminar limpiamente; `SIGKILL` no puede ser capturado |
| `command -v herramienta` / `which herramienta` | `command -v` es builtin disponible en shells estándar y conoce tipos de comando |
| `source ./x.sh` / `bash ./x.sh` | `source` actúa sobre la shell actual; `bash` inicia un proceso de shell |
| `grep -F` / `grep -E` | Texto literal frente a expresiones regulares extendidas |
| `ls -l` / `stat` | Vista abreviada frente a detalle de metadatos |

# 6. Identidades, permisos y mínimo privilegio

## 6.1 Usuarios y grupos

Las cuentas locales suelen representarse en `/etc/passwd`, y los verificadores de contraseña en `/etc/shadow` (no legible por usuarios comunes). Las cuentas también pueden venir de directorios o proveedores NSS; **listar `/etc/passwd` no siempre es listar todas las identidades utilizables**. [F7, F8]

```bash
id
id "$(id -un)"
getent passwd "$(id -un)"
getent group | head -n 10
umask
```

`getent` pregunta a la base configurada mediante NSS; permite razonar sobre cuentas locales y otros orígenes habilitados. El identificador **UID 0** significa superusuario dentro del contexto de nombres correspondiente, pero el poder concreto puede estar sujeto a mecanismos adicionales. La pertenencia a grupos sensibles es una observación que requiere política local para calificar riesgo.

## 6.2 Permisos de modo clásico

```text
-rwxr-x--- 1 alice soc ... informe.sh
 ^^^ ^^^ ^^^
  u   g   o      (owner / group / others)
```

- **`r`**: leer contenido del archivo; en un directorio permite listar nombres (bajo condiciones).
- **`w`**: modificar contenido del archivo; en un directorio habilita crear/eliminar/renombrar entradas si se tienen también los permisos necesarios.
- **`x`**: ejecutar archivo compatible; en un directorio significa **atravesar/buscar** por sus componentes.
- **`chmod 640 fichero`** → usuario `rw-`, grupo `r--`, otros `---`.
- **`chmod 750 directorio`** → usuario `rwx`, grupo `r-x`, otros `---`.
- **`umask`** elimina permisos de los modos solicitados al crear objetos; la creación típica solicita `0666` para archivos y `0777` para directorios, antes de aplicar la máscara y otros mecanismos. **`umask 027` no significa que todo archivo finalice en `750`.**

**Directorios son la trampa importante:** puede ser posible borrar un archivo que no puedes editar si tienes permisos sobre su directorio contenedor. Un `chmod` al archivo no basta para analizar quién puede quitar su entrada del árbol.

## 6.3 Bits especiales, ACL y capacidades

Los bits **setuid**, **setgid** y **sticky** modifican semánticas de ejecución o directorios. En directorios con *sticky bit* (habitualmente `/tmp`), la eliminación/renombrado por otros usuarios se restringe bajo reglas del kernel, aunque el directorio tenga escritura global. Las **ACL** permiten concesiones más expresivas que tres clases de permiso; para inspeccionarlas: `getfacl fichero` cuando esté instalado. **Las capabilities** conceden capacidades concretas a procesos o ejecutables, no necesariamente todos los privilegios de root. [F4, F9]

```bash
ls -ld /tmp
stat -c '%a %A %U:%G %n' /tmp
command -v getfacl >/dev/null && getfacl "$HOME/linux-t1/links/base.txt"
```

**No se incluyen técnicas de abuso o escalada en un servidor real en esta tanda.** La revisión de SUID/SGID, ACL, capabilities y políticas MAC tendrá su procedimiento especializado en la tanda de controles y laboratorios autorizados.

## 6.4 Uso seguro de privilegios

En entornos reales, la pregunta no es «¿puedo usar sudo?», sino «¿necesito este privilegio para esta lectura/cambio y cómo quedará justificado?». Buenas prácticas: acciones puntuales, cuenta nominativa, política revisada, sin ejecutar scripts desconocidos como root y sin alterar evidencia. `sudo -l` puede mostrar reglas de la cuenta según la política y autenticación; no extrapoles permisos por pertenecer a un grupo cuyo nombre *parece* administrativo.

**Error clásico:** `sudo echo texto > /etc/archivo` no eleva la redirección `>` de la shell actual. Tampoco es motivo para modificar un fichero crítico sin copia, aprobación, prueba y plan de vuelta atrás.

# 7. Procesos: observar antes de actuar

## 7.1 Modelo de procesos

Un proceso tiene PID, PID padre (*PPID*), identidad, línea de ejecución, estado, ficheros abiertos y referencias al resto del sistema. No todo proceso nace con una shell interactiva ni todo proceso que existe abre un puerto. Los procesos pueden crearse/terminar entre dos comandos; **PID reutilizados** son un riesgo en automatizaciones basadas solo en PID.

```bash
ps -eo pid,ppid,user,stat,etime,comm,args --sort=pid | head -n 25
ps -p $$ -o pid,ppid,user,stat,etime,comm,args
pgrep -a -f '[s]shd'  # ejemplo: podría no existir sshd
```

- `comm` es un nombre abreviado del comando y puede truncarse.
- `args` y `/proc/PID/cmdline` representan argumentos visibles según las condiciones; nombres y líneas pueden modificarse o ser engañosos.
- `ETIME` es duración de ejecución, no fecha inequívoca de inicio; para cronología correlaciona varias fuentes.
- `STAT`: letras de estado (por ejemplo `R`, `S`, `D`, `Z`) con matices documentados; un proceso `D` no debe tratarse automáticamente como malicioso.

## 7.2 `/proc`: fuente útil, pero no un registro histórico

`/proc` es un pseudo-filesystem dinámico. `/proc/PID/status`, `/proc/PID/fd`, `/proc/PID/cmdline` y `/proc/PID/exe` exponen distintas vistas **si el proceso existe y tienes permiso**. Montajes con `hidepid`, namespaces o políticas de seguridad pueden restringir acceso. `/proc/PID/environ` **no garantiza reflejar cambios del entorno posteriores a `execve`**: documentado expresamente. [F10, F11, F12]

```bash
PID=$$
printf 'PID de esta shell: %s\n' "$PID"
sed -n '1,35p' "/proc/$PID/status"
readlink "/proc/$PID/exe"
ls -l "/proc/$PID/fd" 2>/dev/null | head -n 12
```

**Atención:** `/proc/PID/environ`, `cmdline` y descriptores pueden mostrar tokens, contraseñas en argumentos o secretos de aplicaciones. No los vuelques a un informe por defecto ni asumas que su lectura es inocua desde privacidad.

## 7.3 Señales y respuesta controlada

`SIGTERM` solicita terminación, permite normalmente gestión por el proceso; `SIGKILL` la impone y no puede ser capturada, pero **ninguno de los dos conserva por sí solo evidencia ni repara la causa raíz**. Antes de actuar: determinar PID correcto, servicio y dependencias, posible impacto, medidas de contención preferibles, aprobación, plan de recuperación y retención de datos volátiles. [F13]

Escenario típico SOC: «un proceso consume CPU y aparece en el árbol con un binario desde un directorio temporal». Acción correcta inicial: **documentar qué se observó, confirmar propietario, ruta del ejecutable y relación padre-hijo**, comprobar eventos y conexiones con procedimientos autorizados. No ejecutar `kill -9` como reacción automática. La investigación de conexiones/red y contención corresponde a tandas posteriores.

# 8. Bash: modelo mental de evaluación

## 8.1 Orden conceptual de trabajo de la shell

Bash interpreta sintaxis, construye comandos y aplica diferentes expansiones antes de ejecutar. Por eso **la misma palabra visual puede convertirse en varios argumentos** si se omiten comillas. Consulta la descripción exacta de expansiones y excepciones en el manual de GNU Bash. [F2]

```bash
nombre='reporte final.txt'
printf '<%s>\n' $nombre     # dos argumentos: reporte, final.txt
printf '<%s>\n' "$nombre"   # un argumento
printf '<%s>\n' '$nombre'   # texto literal $nombre
```

**Regla conservadora:** entrecomilla las expansiones de variables que representen rutas, entradas y nombres: `"$var"`, `"${arr[@]}"`, `"$(comando)"` cuando corresponda. En Bash, las comillas dobles permiten expansión sin separación de palabras ni globbing usuales; las simples preservan el texto literal. Recuerda que reglas especiales aplican en expresiones aritméticas, `[[ ... ]]` y asignaciones.

## 8.2 Parámetros y entorno

```bash
nombre='informe.txt'
printf '%s\n' "${nombre%.txt}"   # quita sufijo literal/patrón
printf '%s\n' "${nombre:-predeterminado}"
printf '%s\n' "${#nombre}"     # longitud
export LC_ALL=C                    # útil para salida estable en algunos análisis
printf 'shell=%s\n' "$SHELL"
```

La variable `$SHELL` suele indicar la shell de login configurada, **no asegura ser el ejecutable actual**. `PATH` determina cómo la shell busca ejecutables cuando no se da ruta; cambiarlo puede seleccionar binarios inesperados. `HOME`, `LANG`, `LC_*`, `TMPDIR` y variables de aplicaciones alteran el comportamiento de programas. En un triage, registra solo los valores que necesitas y **nunca exportes un `env` completo** si contiene credenciales.

## 8.3 Globbing, separación y ficheros hostiles

```bash
# Bien: preserva nombre con espacios y evita opción accidental si comienza por '-'
rm -- "$HOME/linux-t1/archivo temporal.txt"    # solo en laboratorio si existe

# Mal: no copiar; se interpreta mediante splitting y globbing
# rm $ruta
```

El separador `--` termina el análisis de opciones en utilidades que lo admiten, pero **no todas las órdenes lo soportan**. Los archivos pueden contener espacios, saltos de línea y caracteres especiales; casi cualquier byte salvo NUL y `/` dentro de un componente de ruta. Para iterar de forma robusta sobre nombres arbitrarios, utiliza separación NUL:

```bash
find "$HOME/linux-t1" -type f -print0 |
  while IFS= read -r -d '' archivo; do
    printf 'Archivo: %q\n' "$archivo"
  done
```

Este ejemplo es **Bash**, no `sh` POSIX: `read -d ''` es una extensión de Bash. Evita hacer `for f in $(find ...)`, porque rompe nombres con espacios y saltos de línea.

## 8.4 Estructuras, códigos de salida y tuberías

```bash
if grep -Fq 'alerta' "$HOME/linux-t1/salida.txt"; then
    printf 'Coincidencia encontrada\n'
else
    rc=$?
    if (( rc == 1 )); then
        printf 'Sin coincidencia\n'
    else
        printf 'Error de lectura (código %s)\n' "$rc" >&2
    fi
fi
```

En un pipeline tradicional el estado es el de la **última orden**, salvo opciones como `pipefail`. Los códigos `126` (orden encontrada pero no ejecutable) y `127` (no encontrada) son relevantes en la semántica POSIX. [F14]

```bash
false | true
printf 'Estado sin pipefail: %s\n' "$?"     # normalmente 0
set -o pipefail
false | true
printf 'Estado con pipefail: %s\n' "$?"     # no 0
set +o pipefail
```

**Cuidado con `set -e`:** no es manejo de errores universal; su conducta cambia en ciertas posiciones (`if`, `&&`, `||`, partes de pipeline, subshell y funciones). El tratamiento explícito de errores y pruebas de casos negativos sigue siendo necesario.

## 8.5 Scripts que puedan auditarse

Requisitos de un script profesional de solo lectura:

- Declara intérprete, objetivo, alcance, entradas, salidas, dependencias y efecto lateral previsto.
- Evita rutas implícitas; no aceptes una ruta arbitraria sin validación y comprobaciones.
- Usa `mktemp -d`, `umask 077` y `trap` para temporales **creados por el propio script**; nunca borres una ruta no controlada.
- Revisa status de comandos; trata «no hay coincidencias» distinto de «no pude leer».
- No actives `set -x` en torno a secretos (imprime comandos expandidos).
- Registra zona horaria, distro, versión de herramientas y límites de privilegios.
- Antes de modificar algo, implementa *dry run*, confirmación, copia y rollback, si procede; en esta tanda solo hacemos lectura.

# 9. Administración cotidiana: procedimiento, no improvisación

## 9.1 Inspección diaria de bajo impacto

Sigue el siguiente orden en una **VM de laboratorio** o bajo procedimiento del equipo:

1. **Contexto:** hostname, distro, kernel, hora y usuario actual.
2. **Capacidad:** `df -h`, `df -i`, `free -h`, `uptime`; los números aislados requieren tendencia y umbrales locales.
3. **Procesos:** `ps -eo ...`; buscar anomalías con criterios documentados.
4. **Persistencia aparente:** ubicar configuración y directorios relevantes, **sin modificar**; el detalle de servicios, systemd y tareas programadas se aborda después.
5. **Integridad práctica:** confirmar nombre, ruta, propietario, permisos, formato, hash cuando exista línea base fiable.
6. **Registro:** anotar qué comandos se usaron, a qué hora y con qué privilegio, incluida cualquier salida «permiso denegado».

```bash
date -u -Is
uptime
free -h
df -h
df -i
ps -eo pid,ppid,user,stat,etime,comm --sort=pid | head -n 30
```

**Riesgos de interpretar datos aislados:** un porcentaje alto de RAM utilizada puede incluir caché recuperable; una carga alta no equivale necesariamente a CPU saturada; un filesystem lleno puede corresponder a bloques o inodos agotados. Triage de rendimiento y almacenamiento se desarrolla más adelante.

## 9.2 Escalado y cambios

**Leer** (`stat`, `id`, `ps`) ≠ **cambiar** (`chmod`, `useradd`, `kill`, reiniciar). Un SOC puede necesitar preservar datos antes de una acción correctiva y escalar a un administrador. Un Red Team puede demostrar un fallo sin alterar la configuración de terceros. Cambios admisibles: sujetos a autorización, ventana, respaldo, aprobación, registro y validación posterior. Evita ejecutar `curl ... | bash` y evita usar un comando de Internet no revisado con privilegios.

# 10. Dos guiones útiles: recopilación y validación

## 10.1 Script A — `linux_base.sh` (solo lectura)

Propósito: crear en un directorio **nuevo** un conjunto acotado de resultados que sirve como línea base de una VM. No incluye contraseñas, tokens, `/proc/*/environ` ni logs masivos. Sigue siendo posible que la salida contenga **datos identificativos** (hostname, nombres de cuenta o líneas de comando): conservar localmente y revisar antes de compartir.

```bash
#!/usr/bin/env bash
set -u
set -o pipefail
umask 077

if (( $# != 1 )); then
  printf 'Uso: %s DIRECTORIO_PADRE\n' "$0" >&2
  exit 64
fi
parent=$1
if [[ ! -d $parent || ! -w $parent ]]; then
  printf 'El directorio padre no existe o no es escribible\n' >&2
  exit 73
fi

# Directorio único bajo un destino existente y autorizado.
out=$(mktemp -d -- "$parent/linux-t1-XXXXXXXX") || exit 73
printf 'Salida: %s\n' "$out"

run() {
  local label=$1
  shift
  {
    printf 'Comando:'
    printf ' %q' "$@"
    printf '\nHora UTC: '
    date -u -Is
    "$@"
  } > "$out/$label.txt" 2>&1
  local rc=$?
  printf '%s\t%s\n' "$label" "$rc" >> "$out/estados.tsv"
}

run fecha date -u -Is
run host uname -srmo
run distribucion cat /etc/os-release
run identidad id
run volumen df -h
run inodos df -i
run memoria free -h
run procesos ps -eo pid,ppid,user,stat,etime,comm --sort=pid

# No exportar sin revisión: pueden aparecer cuentas, nombres de host y PID.
( cd "$out" && sha256sum -- *.txt > SHA256SUMS.txt )
printf 'Finalizado. Revisa %s antes de compartir.\n' "$out"
```

**Ejecución de laboratorio:**

```bash
mkdir -p "$HOME/linux-t1/recopilaciones"
chmod 700 "$HOME/linux-t1/recopilaciones"
# Guardar el script como: $HOME/linux-t1/linux_base.sh
bash -n "$HOME/linux-t1/linux_base.sh"  # solo verifica sintaxis
bash "$HOME/linux-t1/linux_base.sh" "$HOME/linux-t1/recopilaciones"
```

**Límites explícitos:** (a) crea archivos y por ello puede cambiar metadatos del sistema; (b) requiere `mktemp`, herramientas GNU habituales y shell Bash; (c) no obtiene telemetría histórica ni garantiza integridad frente a host comprometido; (d) no firma criptográficamente el manifiesto ni asegura cadena de custodia; (e) incluye un timestamp por comando y códigos de error, no atomicidad entre lecturas. Es un ejercicio de ingeniería básica, **no** una solución DFIR de producción.

## 10.2 Script B — validación de un archivo conocido

Para un *artefacto de laboratorio* cuyo hash esperado proviene de una fuente confiable:

```bash
archivo="$HOME/linux-t1/links/base.txt"
if [[ -f "$archivo" ]]; then
  stat -- "$archivo"
  sha256sum -- "$archivo"
else
  printf 'No es archivo regular\n' >&2
fi
```

La comparación entre hashes requiere una referencia fiable y debe considerar cambios legítimos, ruta, permisos y obtención. **No reemplaza** firmas de proveedor ni comprobación de paquetes. En producción, leer un archivo puede alterar `atime` dependiendo del montaje y herramientas; documentación de preservación pertenece a DFIR.

# 11. Matriz SOC + Red Team: observación → hipótesis → comprobación

| Observación de laboratorio | Perspectiva SOC | Perspectiva Red Team autorizada | Advertencia |
|---|---|---|---|
| Ejecutable no esperado en `/tmp` | Determinar si hay proceso activo, procedencia y contexto | Revisar política de ejecución desde temporales | La ruta sola no prueba malware |
| Usuario en grupo administrativo | Contrastar alta con ticket, responsable y política | Registrar superficie de permisos en alcance | Nombre de grupo ≠ permiso garantizado |
| `ctime` reciente | Ver si hubo cambio de metadatos y otras fuentes | Comprobar configuración/cambio reproducible | `ctime` no es creación |
| Proceso con PPID inusual | Reconstruir árbol, ejecutar lectura y correlacionar | Documentar cadena de ejecución propia | PPID puede cambiar al morir el padre |
| PATH con ruta de escritura por usuario | Investigar configuración e impacto en ejecución | Demostrar resolución segura de comandos en VM | No manipular PATH ajeno |
| Permisos `777` en directorio de trabajo | Revisar propietarios, sticky bit y exposición real | Evaluar si la escritura habilita riesgo reproducible | Permisos sin contexto pueden ser normales |
| Comando no encontrado (`127`) | Distinguir error operativo de señal de intrusión | Ajustar enumeración a herramientas disponibles | Nunca asumir que «no existe el proceso» |
| `/proc/PID` inaccesible | Registrar limitación de visibilidad | Reconocer restricciones de aislamiento/permisos | Un permiso denegado no demuestra ocultación |

**Modelo mínimo de informe:** (1) hecho observado, (2) comando y salida seleccionada, (3) hora y host, (4) interpretación tentativa, (5) hipótesis alternativas, (6) validación pendiente, (7) medida recomendada, (8) condiciones de retest. No mezclar «evidencia» con «conclusión».

# 12. Laboratorios guiados y criterios de aceptación

**Entorno recomendado:** una VM Linux dedicada con snapshot inicial y usuario sin privilegios; idealmente Debian/Ubuntu y, opcionalmente, Parrot para comparar. No uses cuentas ni sistemas de otras personas. Crea `~/linux-t1`; todo lo que generen los ejercicios se limita a ese árbol salvo comandos de lectura del host. Los resultados esperados son **criterios**, no transcripciones inventadas.

## Lab 1 — Identidad, límites y ficha base · 15 puntos

**Objetivo:** clasificar kernel, distribución, identidad y entorno sin confundir los conceptos.

```bash
mkdir -p "$HOME/linux-t1"
{
  date -u -Is
  cat /etc/os-release
  uname -srmo
  id
  ps -p $$ -o pid,ppid,comm,args
  printf 'PATH=%s\n' "$PATH"
} > "$HOME/linux-t1/lab1-ficha.txt"
```

**Entregable:** ficha con cinco campos clave, un párrafo diferenciando distro/kernel/shell y dos limitaciones detectadas. **Criterios (15):** identificación 5; contexto temporal 3; distinciones 4; límites 3. **Fallo crítico:** publicar una salida de entorno con credenciales; aquí solo se registra `PATH`.

## Lab 2 — Inodos, enlaces y permisos · 20 puntos

**Objetivo:** demostrar en VM relación entre ruta, nombre, inodo y permisos.

```bash
mkdir -p "$HOME/linux-t1/lab2"
printf 'evidencia de prueba\n' > "$HOME/linux-t1/lab2/original.txt"
ln "$HOME/linux-t1/lab2/original.txt" "$HOME/linux-t1/lab2/alias-duro.txt"
ln -s original.txt "$HOME/linux-t1/lab2/alias-simbolico.txt"
ls -li "$HOME/linux-t1/lab2"
stat "$HOME/linux-t1/lab2/original.txt"
chmod 640 "$HOME/linux-t1/lab2/original.txt"
stat -c '%a %A %n' "$HOME/linux-t1/lab2/original.txt"
```

**Entregable:** captura o transcripción de inodos, explicación de por qué cambia `ctime` tras `chmod`, diferencia entre symlink/hardlink y relación de permisos de archivo/directorio. **Criterios (20):** reproducción 8; interpretación 8; precauciones 4. **Nota:** `chmod` solo se hace a un archivo creado en la VM.

## Lab 3 — Tuberías, stdout/stderr y código de salida · 20 puntos

**Objetivo:** evitar los errores de lectura más comunes en Bash.

```bash
mkdir -p "$HOME/linux-t1/lab3"
printf 'ssh\ncron\nssh\n' > "$HOME/linux-t1/lab3/datos.txt"
sort "$HOME/linux-t1/lab3/datos.txt" | uniq -c
ls "$HOME/linux-t1/lab3" /ruta-ficticia \
  > "$HOME/linux-t1/lab3/out.txt" \
  2> "$HOME/linux-t1/lab3/err.txt"
rc=$?
printf 'rc=%s\n' "$rc"
grep -Fq 'ausente' "$HOME/linux-t1/lab3/datos.txt"
printf 'grep sin coincidencia: rc=%s\n' "$?"
```

**Entregable:** archivos stdout/stderr, significado del código de `ls` y diferencia entre error de búsqueda y «sin coincidencia» de `grep`. **Criterios (20):** separación 7; diagnóstico 8; mitigación 5.

## Lab 4 — Snapshot limitado de procesos y `/proc` · 20 puntos

**Objetivo:** correlacionar shell, PID y PPID sin detener procesos.

```bash
ps -p $$ -o pid,ppid,user,stat,etime,comm,args
sed -n '1,30p' "/proc/$$/status"
readlink "/proc/$$/exe"
ps -eo pid,ppid,comm,args --sort=pid | head -n 15
```

**Entregable:** árbol parcial de tres procesos con relación padre-hijo comprobable, tres campos de `/proc/$$/status` explicados y dos razones por las que un snapshot no equivale a historial. **Criterios (20):** datos 6; interpretación 9; límites 5. **No** consultar entornos de otros procesos con credenciales.

## Lab 5 — Script de línea base, validación y entrega · 25 puntos

**Objetivo:** operacionalizar `linux_base.sh` sin privilegios.

1. Copia el Script A a `~/linux-t1/linux_base.sh`; revisa el código antes de ejecutarlo.
2. Ejecuta `bash -n` y confirma que no hay error de sintaxis.
3. Ejecútalo sobre un directorio autorizado. Inspecciona `estados.tsv` y detecta comandos con salida no satisfactoria.
4. Comprueba **integridad posterior** con `sha256sum -c SHA256SUMS.txt` **desde dentro del directorio de salida**. Si no aparecen fallos, explica exactamente qué garantiza y qué no garantiza esa comprobación.
5. Presenta informe de 1 página con evidencias seleccionadas, límites y siguiente paso recomendado para un SOC.

**Criterios (25):** ejecución 8; códigos de retorno 5; hash y limitaciones 5; informe 7. **No** asumir que los hashes son prueba forense completa.

## 12.1 Rúbrica transversal (100 puntos)

| Evidencia | Puntos | No cumple cuando… |
|---|---:|---|
| Lab 1: contexto e identidad | 15 | Confunde kernel, distro y shell |
| Lab 2: archivos/permisos | 20 | Confunde `ctime` con creación o enlace duro con simbólico |
| Lab 3: Bash y errores | 20 | Interpreta grep rc=1 como fallo del sistema |
| Lab 4: procesos | 20 | Presenta un snapshot como historial o mata procesos |
| Lab 5: script y evaluación | 25 | No revisa estados o publica sin censurar datos |
| **Total** | **100** | **Aprobado: ≥80, sin fallos críticos** |

# 13. Mini-caso de entrevista SOC y caso espejo Red Team

**Situación ficticia de una VM autorizada:** el inventario muestra un proceso `python3` que se ejecuta desde `/home/lab/`, heredado de una shell interactiva, y un directorio compartido con permisos amplios. Un analista recibe una alerta genérica «actividad inusual de proceso».

**Respuesta SOC esperada:**

1. Fijar host, fecha UTC, fuente de alerta e identidad de análisis.
2. Verificar existencia del PID y recoger información contextual **de lectura** (`ps`, `/proc/PID/status`, ejecutable y ficheros pertinentes si existe autorización).
3. Confrontar el binario/argumentos con línea base, propietario, cronología, configuración y actividad de red **en la fase especializada**, sin extrapolar de un nombre de proceso.
4. Formular al menos dos hipótesis: tarea legítima de laboratorio, o ejecución no autorizada. Anotar pruebas que distinguen ambas.
5. Coordinar preservación y respuesta según playbook; ni `kill` ni `chmod` automáticos.

**Respuesta Red Team autorizada:** documentar identidad y permisos **dentro del laboratorio**, confirmar si el directorio permite a otra cuenta modificar entradas, probar con archivos propios inocuos, describir el impacto realista y entregar remediación y retest. **No** modificar binarios de terceros, provocar interrupciones ni confundir «puedo crear archivo» con «puedo ejecutar cualquier comando como root».

**Qué se evalúa en entrevista:** razonamiento causal, diferencia entre observación/hipótesis/conclusión, límites de la prueba, decisiones reversibles, seguridad de operación y una explicación oral de 60–90 segundos.

# 14. Evaluación de conocimientos (24 preguntas)

**Instrucciones:** responde sin consultar la tabla de respuestas; justifica las preguntas de escenario con una sola frase técnica. Las respuestas están en la siguiente sección para autocorrección.

1. ¿Qué parte del sistema es «Linux» en sentido estricto?
2. ¿Bash forma parte del kernel?
3. ¿Por qué `uname -r` no demuestra por sí solo que existe una vulnerabilidad?
4. ¿Qué diferencia existe entre UID real y efectivo?
5. ¿Cuál es el propósito general de `/etc` y `/var/lib`?
6. ¿Qué cambia un enlace duro frente a un enlace simbólico?
7. ¿Qué indica `ctime` y qué **no** indica?
8. ¿Por qué la lectura de `atime` puede ser equívoca?
9. ¿Qué significa la `x` en permisos de un directorio?
10. ¿Cuáles son las tres clases `u/g/o`?
11. ¿Por qué `chmod 777` no es una solución genérica a «Permission denied»?
12. ¿Qué añade una ACL al modelo clásico?
13. ¿Qué puedes concluir si `/proc/1234/status` devuelve acceso denegado?
14. ¿Qué significa un PPID y qué cautela requiere?
15. ¿Qué diferencia operacional existe entre `SIGTERM` y `SIGKILL`?
16. ¿Por qué `grep` con código 1 no indica siempre un error?
17. ¿Qué hace `2>&1`, y por qué importa su orden?
18. ¿Cuál es el riesgo de `for x in $(find ...)`?
19. ¿Qué cambia `set -o pipefail`?
20. ¿Qué precaución se debe tomar antes de habilitar `set -x`?
21. ¿Qué diferencia hay entre `source script.sh` y `bash script.sh`?
22. ¿Es suficiente un hash SHA-256 sin origen confiable para atribuir legitimidad?
23. En un host con proceso «sospechoso», ¿cuál es el primer paso antes de `kill`?
24. ¿Qué tres elementos mínimos deben acompañar una evidencia SOC?

## 14.1 Respuestas razonadas

1. El kernel. 2. No; es intérprete en espacio de usuario. 3. Puede haber parches retroportados y mitigaciones; requiere contexto concreto. 4. Representan aspectos de la identidad de un proceso; el efectivo suele afectar comprobaciones de privilegios. 5. Configuración del host / estado variable de aplicaciones. 6. Mismo inodo vs archivo con ruta de destino. 7. Cambio de metadatos/estado del inodo; no fecha de creación. 8. Políticas `relatime`/`noatime` y otras condiciones. 9. Travesía/búsqueda. 10. Propietario/grupo/otros. 11. Amplía exposición sin conocer el requisito de acceso. 12. Permisos adicionales más detallados. 13. Falta visibilidad por permisos, política, namespace u otros factores; no implica rootkit. 14. PID del padre observado; puede cambiar por salida del padre y carrera temporal. 15. Petición gestionable vs terminación no capturable. 16. `grep` rc=1 indica ausencia de coincidencia. 17. Redirige stderr al destino actual de stdout; el orden afecta el destino final. 18. Rompe nombres con espacios/saltos de línea y puede generar errores de argumentos. 19. Hace que errores de órdenes anteriores influyan en el estado de pipeline conforme a sus reglas. 20. Evitar mostrar secretos expandidos. 21. Modifica la shell actual vs ejecutar en una nueva shell. 22. No; el hash requiere referencia confiable. 23. Validar PID, impacto, evidencia, autorización y playbook. 24. Contexto temporal/host, fuente/comando y limitaciones/interpretación.

**Autocalificación sugerida:** 1 punto por respuesta precisa; 0,5 por parcialmente correcta y 0 en caso incorrecto. Mínimo de consolidación: **18/24 (75%)**; revisar cualquier pregunta de seguridad antes de pasar de tanda.

# 15. Hoja de consulta rápida

| Necesito… | Primero | Evita concluir… |
|---|---|---|
| Saber distro/kernel | `cat /etc/os-release`, `uname -r` | Que una versión prueba vulnerabilidad |
| Validar cuenta/grupos | `id`, `getent` | Que una etiqueta de grupo prueba privilegios |
| Resolver ruta | `pwd -P`, `readlink -f`, `stat` | Que nombre/ruta equivale a contenido legítimo |
| Revisar permisos | `stat -c '%a %A %U:%G %n'`, `getfacl` | Que `ls -l` siempre muestra toda la política |
| Observar proceso | `ps`, `pgrep`, `/proc/PID` | Que una instantánea es un historial |
| Ver origen de comando | `type -a`, `command -v` | Que el nombre invoca el binario esperado |
| Procesar nombres arbitrarios | `find -print0` + `read -d ''` en Bash | Que el espacio es separador seguro |
| Proteger script básico | Comillas, validación, `umask`, códigos de salida | Que `set -e` resuelve todos los fallos |
| Preservar hallazgo | Fecha UTC, host, fuente, hash con referencia | Que un hash prueba cadena de custodia |
| Investigar sin perjudicar | Lectura acotada, aprobación, hipótesis | Que «parece malicioso» justifica terminarlo |

# 16. Fuentes contrastadas y trazabilidad

**Método:** referencias primarias de GNU, POSIX/Open Group, FHS y Linux man-pages. Las entradas no equivalen a una certificación de comandos en todas las distros. Las tareas de laboratorio, rúbricas y mini-casos son propuestas originales basadas en ese marco, no ejemplos oficiales publicados por dichas organizaciones.

| ID | Referencia oficial / técnica | Qué fundamenta |
|---|---|---|
| F1 | **Filesystem Hierarchy Standard 3.0 (13-10-2026)** — https://specifications.freedesktop.org/fhs/latest/ | Organización de directorios y carácter convencional |
| F2 | **GNU Bash Reference Manual** — https://www.gnu.org/software/bash/manual/bash.html | Shell, quoting, expansión, redirecciones, scripts y opciones |
| F3 | **Linux credentials(7)** — https://man7.org/linux/man-pages/man7/credentials.7.html | Identidades reales/efectivas y credenciales |
| F4 | **Linux capabilities(7)** — https://man7.org/linux/man-pages/man7/capabilities.7.html | Modelo moderno de privilegios de kernel |
| F5 | **Linux inode(7)** — https://man7.org/linux/man-pages/man7/inode.7.html | Inodos, metadatos, `ctime`, `mtime`, `atime`, `btime` |
| F6 | **Linux proc_pid_fd(5)** — https://man7.org/linux/man-pages/man5/proc_pid_fd.5.html | Descriptores de proceso y `/proc/PID/fd` |
| F7 | **Linux passwd(5)** — https://man7.org/linux/man-pages/man5/passwd.5.html | Cuentas y estructura de `/etc/passwd` |
| F8 | **Linux shadow(5)** — https://man7.org/linux/man-pages/man5/shadow.5.html | Verificadores de contraseña y protección del fichero |
| F9 | **Linux getfacl(1)** — https://man7.org/linux/man-pages/man1/getfacl.1.html | Listas de control de acceso |
| F10 | **Linux proc(5)** — https://man7.org/linux/man-pages/man5/procfs.5.html | Pseudo-fs `/proc`, políticas de visibilidad |
| F11 | **Linux proc_pid(5)** — https://man7.org/linux/man-pages/man5/proc_pid.5.html | Directorios PID |
| F12 | **Linux proc_pid_environ(5)** — https://man7.org/linux/man-pages/man5/proc_pid_environ.5.html | Naturaleza inicial de `environ` y límites |
| F13 | **Linux signal(7)** — https://man7.org/linux/man-pages/man7/signal.7.html | Terminación y señales |
| F14 | **POSIX.1-2024, Shell Command Language** — https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html | Semántica de shell, pipelines y estados |
| F15 | **Linux ps(1)** — https://man7.org/linux/man-pages/man1/ps.1.html | Vista instantánea y columnas de proceso |
| F16 | **Linux find(1)** — https://man7.org/linux/man-pages/man1/find.1.html | Predicados de búsqueda y límites |

**Auditoría intelectual:** [DOC] referencias F1–F16 contrastadas para los principios indicados; [PRÁCTICA] los comandos y scripts se han diseñado para Linux y requieren ejecutar los laboratorios antes de afirmar sus salidas en un host particular; [ANÁLISIS] matrices SOC/Red Team y rubricas son un marco pedagógico y deben adaptarse a la política de cada organización.

# 17. Próxima tanda y frontera de contenidos

**Esta entrega cierra fundamentos, Bash y administración cotidiana (T1/5).** La segunda tanda profundizará en **arranque, systemd, unidades, servicios y gestión de paquetes**, así como su utilidad ofensiva/defensiva autorizada. La tercera desarrollará almacenamiento, sistemas de archivos, copias y recuperación; los demás bloques seguirán en tandas 4 y 5. No confundas esta introducción a procesos/permisos con cobertura completa de persistencia, hardening, auditoría y respuesta ante incidentes.

**Checklist de cierre:** ficha del host completada; cinco labs corregidos; 18/24 en evaluación; informe con observación/hipótesis/limitaciones; ninguna acción no autorizada en el sistema.
