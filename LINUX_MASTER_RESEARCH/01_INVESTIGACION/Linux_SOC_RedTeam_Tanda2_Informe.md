---
title: "LINUX | SOC + RED TEAM"
subtitle: "Tanda 2 de 5 · Arranque, systemd, servicios y gestión de paquetes"
author: "Dossier técnico de estudio y laboratorio"
date: "18 de octubre de 2026"
lang: es-ES
version: "2.0"
---

> **Propósito.** Entender cómo Linux pasa del firmware a los procesos del sistema, cómo systemd decide qué arranca y con qué privilegios, cómo se administran servicios y cómo el sistema de paquetes afecta la confianza del host. Interpretar lo mismo desde **operaciones**, **SOC/DFIR** y **Red Team autorizado**.

**Alcance exacto:** segundo bloque del documento original `linux(1).txt`: «Arranque, systemd, servicios y gestión de paquetes». Incluye prácticas defensivas y emulaciones inocuas en máquinas propias. **No reemplaza** las futuras tandas dedicadas a almacenamiento y recuperación, redes/SSH/firewall, PAM/SELinux/AppArmor, auditoría exhaustiva, contenedores y Red Team de escalada.

**Etiquetas:** `[DOC]` afirmación sustentada por fuentes numeradas; `[LAB]` acción reproducible en VM; `[SOC]` análisis de detección y evidencia; `[RT]` modelado de exposición en entorno autorizado; `[LÍMITE]` incertidumbre o restricción de visibilidad. Fuentes consultadas para este dossier en octubre de 2026; las manpages de versiones distintas **no** deben considerarse universales. Los ejemplos de paquete distinguen Debian/Parrot, Fedora/RHEL y Arch.

# 1. Resultados de aprendizaje y estándar de salida

Al terminar, deberías demostrar sin copiar una receta que puedes:

1. Dibujar y explicar firmware → cargador o EFI-stub → kernel → initramfs → raíz definitiva → PID 1 → unidades, señalando variantes.
2. Diagnosticar un arranque lento o fallido mediante **hipótesis verificables**, sin asumir que el último mensaje de consola es la causa.
3. Distinguir `start`, `enable`, `preset`, `mask`, `reload`, `daemon-reload` y `restart` con sus efectos y riesgos.
4. Identificar el origen **efectivo** de una unidad, sus *drop-ins*, dependencias, credenciales, orden, disparadores y proceso real.
5. Crear un servicio y un timer de **usuario** inocuos; registrar, verificar y desinstalar la prueba sin dejar persistencia.
6. Evaluar restricciones de ejecución y aplicar *hardening* contextual sin romper disponibilidad.
7. Rastrear paquete → repositorio → transacción → archivo → unidad/proceso y distinguir sus niveles de confianza.
8. Investigar un supuesto mecanismo de persistencia con evidencia positiva, hipótesis alternativas y recomendaciones.

**Aprobación:** 80/100 en laboratorios; ≥75 % en evaluación; cero errores críticos: tocar el arranque de producción sin ventana, desactivar protecciones de firma, instalar software de procedencia desconocida o borrar artefactos antes de preservarlos.

| Pregunta | Administrador | SOC | Red Team autorizado |
|---|---|---|---|
| ¿Por qué se inició este proceso? | Unidad, socket, timer, dependencia, sesión | Correlacionar configuración, eventos y padre/cgroup | Comprobar si existe superficie para ejecución persistente |
| ¿Quién puede modificarlo? | Propiedad, ACL, permisos, gestor de configuración | Priorizar unidades sensibles o alteradas | Validar permisos inseguros sin modificar recursos ajenos |
| ¿Qué cambió? | Paquete, despliegue, drop-in y reinicio | Línea temporal, procedencia, firma y telemetría | Demostrar hallazgo acotado, proponer remediación |
| ¿Qué confianza merece? | Verificación y despliegue autorizado | Evidencia acumulativa, no prueba absoluta | Reportar alcance real y límites, sin afirmaciones de compromiso |

# 2. Modelo de arranque: de la energía al servicio

## 2.1 Cadena principal y variantes [DOC: F01, F02]

```text
 [Encendido/reset]
        |
 [Firmware: BIOS o UEFI] ── política de arranque / dispositivos
        |
 [Cargador: GRUB, systemd-boot, otro] <─ o UEFI carga imagen EFI/kernel directamente
        |
 [Kernel Linux + argumentos + initramfs opcional]
        |
 [Drivers iniciales / root= / módulos / LUKS/LVM si existen]
        |
 [Cambiar al sistema de archivos raíz definitivo]
        |
 [PID 1: normalmente systemd en distribuciones examinadas]
        |
 [Targets + unidades: montajes, sockets, servicios, timers, sesiones]
        |
 [Servicios disponibles para usuarios y aplicaciones]
```

- El **firmware** inicializa lo imprescindible y elige la entrada de arranque. UEFI no equivale a *Secure Boot* ni exige GRUB.
- El **cargador** selecciona entrada/kernel, transmite parámetros e imagen inicial. `systemd-boot` opera en sistemas UEFI; muchas instalaciones siguen usando GRUB. Puede existir *Unified Kernel Image* (UKI) y otras rutas específicas.
- El **kernel** establece memoria, procesos, VFS, controladores e interfaces; carga/initramfs cuando corresponde.
- **initramfs** es un sistema de archivos inicial extraído por el kernel, donde se prepara el acceso a la raíz real (p. ej., cifrado, LVM, RAID, controladores). No es sinónimo exacto del mecanismo histórico `initrd` aunque el uso informal mezcle nombres.
- **PID 1** es el primer proceso de usuario del sistema final; no des por supuesto systemd en todos los Linux: contenedores, sistemas embebidos y otras distribuciones pueden usar otro `init`.
- El sistema inicia unidades de forma **paralela** cuando no hay dependencias de orden que lo impidan; una secuencia dibujada no significa ejecución estrictamente serial.

**Secure Boot: distinción crítica.** UEFI Secure Boot puede verificar etapas del arranque según claves/política, pero por sí solo no garantiza que todo archivo del rootfs, cada unidad o cada proceso sea confiable. La cobertura depende de la implementación, la cadena de firmas, el estado de bloqueo, medidas adicionales y configuración. Un hash de archivo tampoco demuestra que el equipo arrancó esa imagen.

## 2.2 Reconocimiento sin mutaciones [LAB]

```bash
cat /etc/os-release                         # Distro
uname -r                                    # Kernel en ejecución
ps -p 1 -o pid,comm,args                    # Proceso PID 1
readlink -f /proc/1/exe                     # Ejecutable real de PID 1, según acceso
cat /proc/cmdline                           # Parámetros de kernel actual
findmnt /                                   # Raíz efectiva
ls -ld /sys/firmware/efi 2>/dev/null || :  # Presencia de interfaz EFI, no prueba de confianza
systemctl --version                         # Solo si existe systemd
systemctl get-default                       # Target por defecto
systemd-analyze time                        # Si la funcionalidad está disponible
```

**Cómo interpretar**: `root=UUID=...` señala un selector de raíz, no prueba qué se montó finalmente: contrástalo con `findmnt /` y `lsblk -f`. `quiet` puede reducir mensajes de consola, sin implicar ausencia de eventos. Opciones como `init=`, `systemd.unit=` y parámetros de depuración pueden alterar el arranque; su riesgo depende del control físico/firmware, permisos y protección de arranque. No modifiques `/proc/cmdline`: su contenido refleja los parámetros actuales y se trata como lectura.

**Red Team autorizado:** revisar si una configuración de arranque habilita operaciones de recuperación no protegidas o un acceso fuera de la política es una **evaluación de control físico y de arranque**, no un permiso para saltar salvaguardas sobre infraestructura de terceros.

# 3. Arranque diagnosticado como línea temporal

## 3.1 ¿Dónde se perdió el tiempo? [DOC: F03, F04]

```bash
systemd-analyze time
systemd-analyze blame | head -30
systemd-analyze critical-chain
systemctl --failed
journalctl -b -p warning --no-pager
journalctl --list-boots
```

`time` informa tiempos estimados de distintas fases **cuando están disponibles**. `blame` lista duraciones de activación, no una suma cronológica; muchos servicios se inician en paralelo. Algunos tipos (`Type=simple`) no tienen una medición útil de duración de arranque. `critical-chain` muestra parte de la **cadena temporal de orden**: puede ocultar retrasos de trabajos en cola, activaciones por socket u operaciones que no tienen fase `activating`. [LÍMITE]

`journalctl -b -1` consulta el arranque anterior **solo si existe y se conservó** en el journal. `--list-boots` permite comprobar disponibilidad; los reinicios y la rotación pueden eliminar datos. La ausencia de errores en `--failed` no demuestra que el sistema esté sano: hay fallos de aplicación con unidad `active`, fallos previos resueltos o servicios no gestionados por systemd.

## 3.2 Hipótesis diferenciales: síntomas ≠ causa

| Síntoma | Hipótesis | Comprobación no disruptiva | Decisión |
|---|---|---|---|
| Tarda en abrir sesión | espera red, disco, dependencia | `critical-chain`; logs de unidad | correlacionar instante y bloqueo real |
| Kernel panic antes de PID 1 | fallo kernel, root, initramfs o hardware | consola, parámetros, imagen conocida | recuperar desde snapshot, no reinstalar a ciegas |
| `emergency.target` | raíz/montaje requerido falla | `findmnt`, journal, `systemctl status ...mount` | documentar; no corregir `fstab` sin validar |
| Servicio `failed` tras parche | cambio de ABI, permisos, config | `systemctl cat`, `journalctl -u`, transacción | comparar previo/posterior; plan de reversión |
| Servicios activos, aplicación caída | readiness mal definida o dependencia externa | `ss`, salud app, logs, cgroup | evitar `restart` indiscriminado |
| Arranca viejo kernel | entrada de boot distinta, rollback pendiente | `uname -r`, listado de imágenes, policy | comprobar gestor concreto y mantenimiento |

**Regla:** no ejecutes `update-grub`, `grub-install`, `update-initramfs -u`, `dracut -f`, `grubby` ni `bootctl install` como parte de la **observación**; son operaciones que pueden cambiar la siguiente entrada de arranque. Son remedios condicionados a distribución, gestor, respaldo, consola y plan de vuelta atrás.

# 4. systemd: gestor, unidades, cgroups y estados

## 4.1 systemd no es `systemctl`

- `systemd` suele ser el gestor PID 1 y también puede gestionar instancias **por usuario**.
- `systemctl` es un cliente de consulta/control; habla con el gestor, normalmente sobre D-Bus.
- Una **unidad** es un recurso con definición y estado: `.service`, `.socket`, `.timer`, `.target`, `.mount`, `.automount`, `.path`, `.slice`, `.scope`, `.swap`, `.device` y otras.
- Un `.target` agrupa/sincroniza el estado deseado; no es un «servicio especial» que ejecute comandos arbitrarios.
- Una `.slice` estructura recursos/cgroups; una `.scope` agrupa procesos creados fuera de la secuencia normal de unidades; `.service` suele controlar procesos persistentes o de ejecución única.

## 4.2 Los tres estados que jamás debes confundir [DOC: F05]

```bash
systemctl status ssh.service            # Nombre Debian/Ubuntu típico: puede ser sshd.service en otras
systemctl is-active ssh.service         # Estado actual (active, inactive, failed, ...)
systemctl is-enabled ssh.service        # Estado de unidad para habilitación (enabled, disabled, static, ...)
systemctl show ssh.service -p LoadState -p ActiveState -p SubState -p UnitFileState
systemctl list-units --type=service --all
systemctl list-unit-files --type=service
```

**LoadState** indica si systemd pudo localizar/interpretar la definición; **ActiveState/SubState** describen actividad actual; **UnitFileState** caracteriza enlaces/habilitación. `enabled` **no significa** ejecutándose; `active` **no significa** programado para iniciar en cada boot; `static` no implica inactividad ni amenaza. Un servicio puede ser activado por socket, timer, dependencia o manualmente.

## 4.3 Operaciones y efectos diferenciados [DOC: F05]

| Operación | Qué cambia | Riesgo / detalle |
|---|---|---|
| `status`, `show`, `cat` | observación | `status` ofrece fragmento de logs, no historia íntegra |
| `start` | estado **ahora** | no habilita próximo arranque |
| `stop` | detención **ahora** | socket/timer u otra unidad puede reactivarlo |
| `enable` | enlaces de instalación para disparo futuro | no arranca salvo `--now`; algunos son static |
| `disable` | elimina enlaces de habilitación | no detiene salvo `--now`; otros disparos siguen posibles |
| `mask` | impide activación normal del nombre enmascarado | típicamente enlace a `/dev/null`; puede dejar un proceso ya activo |
| `unmask` | elimina enmascaramiento | no habilita ni arranca automáticamente |
| `restart` | parada/inicio | corte de servicio y efectos de dependencias |
| `reload` | pide al **servicio** releer su config si lo soporta | no todos lo soportan ni tienen mismo efecto |
| `daemon-reload` | PID 1 vuelve a leer unidades/generadores | **no** reinicia por sí solo servicios en marcha |
| `reset-failed` | limpia estados y contadores de fallo | no arregla la causa ni limpia evidencia ya exportada |
| `preset` | aplica política de habilitación del proveedor | posible cambio masivo si mal empleado |

Si modificas un archivo de unidad, primero valida (`systemd-analyze verify`) y usa `daemon-reload` para cargar definición; después, si **corresponde a la ventana aprobada**, reinicia la unidad. Diferencia expresamente **cargar definición nueva** y **hacer que el proceso use esa definición**.

# 5. Origen efectivo, rutas y resolución de unidades

## 5.1 Archivos, *drop-ins* y rutas [DOC: F06]

Rutas **frecuentes**, no exhaustivas:

- Administrador del sistema: `/etc/systemd/system/`.
- Definiciones temporales/runtime: `/run/systemd/system/`.
- Distribución/paquetes: `/usr/lib/systemd/system/` (en algunas distribuciones `/lib/systemd/system/`, potencialmente enlazado a `/usr/lib`).
- Usuario: `~/.config/systemd/user/`, ubicaciones del gestor de usuario en `/etc/systemd/user/`, `/usr/lib/systemd/user/` y runtime.
- *Drop-ins*: `unidad.service.d/*.conf` bajo las rutas aplicables. La configuración **efectiva** se obtiene fusionando fragmento y sobrescrituras según precedencia y orden.
- Generadores: pueden escribir unidades efímeras en `/run/systemd/generator*`, no necesariamente presentes en `/etc`.

**No deduzcas precedencia simplemente del orden de un `ls`**; consulta la documentación de la versión instalada y la composición efectiva de la unidad. Un archivo extraño en `/etc/systemd/system/` puede ser una personalización legítima y un archivo del paquete en `/usr/lib` puede haber sido sustituido en disco.

```bash
systemctl cat NOMBRE.service
systemctl show NOMBRE.service -p FragmentPath -p DropInPaths -p SourcePath
systemctl show NOMBRE.service -p ExecStart -p User -p Group -p DynamicUser
systemctl list-unit-files --state=enabled
systemd-analyze unit-paths             # Comprobar soporte en versión instalada
stat -c '%n | %U:%G | %a | %y' /etc/systemd/system/NOMBRE.service
```

`systemctl cat` indica la combinación de archivos **en disco** que se leen para la definición, pero puede existir discrepancia temporal entre archivo en disco y la definición que el gestor ha cargado si faltó `daemon-reload`. Contrasta `NeedDaemonReload` y parámetros `show`. `ExecStart` en `show` refleja propiedades del gestor, no necesariamente procesos que aún se estén ejecutando bajo la misma configuración.

## 5.2 Investigar la procedencia de un archivo [SOC]

1. Localiza el ejecutable y el archivo de configuración **efectivo**; registra ruta real (`readlink -f`), dueño, permisos, mtime/ctime y hash en copia preservada cuando sea viable.
2. Identifica el paquete propietario (`dpkg -S /ruta`, `rpm -qf /ruta`, `pacman -Qo /ruta`) si la ruta está registrada.
3. Comprueba si hay *drop-in* o variables de entorno (`Environment=`, `EnvironmentFile=`) que cambian la interpretación.
4. Contrasta transacción de paquete, despliegue y mantenimiento autorizado; captura responsable y horario.
5. Correlaciona con ejecución de unidad, creación de proceso, conexiones e identidad.

**Cuidado:** `dpkg -S` y los equivalentes consultan base de datos; que una ruta esté registrada **no prueba** que su contenido actual coincida con el paquete original. Que la ruta **no** esté registrada tampoco demuestra malicia: software propio, `/usr/local`, instaladores manuales y contenedores pueden ser válidos.

# 6. Dependencias: querer no es ordenar

La diferencia central [DOC: F06]:

- `Wants=B.service`: dependencia débil; intenta activar B, pero el fracaso de B no siempre impide A.
- `Requires=B.service`: requisito más fuerte en transacciones de arranque, pero no sustituye las reglas de orden; el comportamiento de fallos depende también de orden y estados.
- `After=B.service`: **orden**, solo cuando ambas participan en la transacción. **No arranca B por sí sola**.
- `Before=B.service`: inverso de `After`.
- `BindsTo=`: vínculo más estrecho con disponibilidad de otra unidad; úsalo cuando el diseño lo requiera.
- `PartOf=`: propaga ciertas acciones de detención/reinicio, pero no «importa» todas las dependencias.
- `ConditionPathExists=`: una condición fallida puede **saltar** una unidad sin clasificarla como `failed`; no es señal definitiva de ataque.
- `After=network.target` no asegura conectividad IP funcional. `network-online.target` depende de un servicio de espera y de su definición de «online»; también puede no garantizar acceso a una API externa.

**Ejemplo lógico (no cambiar producción):**

```ini
[Unit]
Description=Ejemplo de dependencia
Wants=network-online.target
After=network-online.target
[Service]
Type=oneshot
ExecStart=/usr/bin/true
```

El ejemplo **solicita** que se considere el target y espera su orden de activación, pero no valida DNS, TLS ni disponibilidad de la aplicación remota. Confirma `/usr/bin/true` en el host si conviertes el ejemplo en unidad real.

```bash
systemctl list-dependencies NOMBRE.service
systemctl list-dependencies --reverse NOMBRE.service
systemctl show NOMBRE.service -p Wants -p Requires -p After -p Before
systemd-analyze critical-chain NOMBRE.service
```

# 7. Anatomía de una unidad `.service`

```ini
[Unit]
Description=Ejemplo didáctico; no instalar sin adaptar
After=local-fs.target

[Service]
Type=exec
User=USUARIO_DE_SERVICIO
Group=GRUPO_DE_SERVICIO
WorkingDirectory=/opt/ejemplo
ExecStart=/usr/local/bin/ejemplo --foreground
Restart=on-failure
RestartSec=5s
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**No es una unidad lista para instalar:** usuario, grupo, directorio y ejecutable son placeholders. El archivo `[Install]` define cómo habilitar; **no** determina por sí mismo cuándo se ejecuta un proceso. `User=` y `Group=` pueden condicionar permisos; `ExecStart=` determina el programa y parámetros sin ejecutar una shell a menos que se solicite explícitamente. Systemd aplica su sintaxis propia de tokens, especificadores y expansión de variables: no supongas que `&&`, tuberías o redirecciones se interpretan como en Bash. [DOC: F07]

## 7.1 Directivas de ejecución críticas

| Directiva | Función | Qué mirar en incidentes |
|---|---|---|
| `ExecStart=` | programa principal | ruta, args, cuenta, binario real, hashes |
| `ExecStartPre=` | preparación previa | comandos adicionales que se ejecutarían con cada arranque |
| `ExecStartPost=` | paso posterior | cambios y ejecución condicionada por readiness |
| `ExecReload=` | recarga de config | ejecución al pedir reload; semántica del servicio |
| `ExecStop=`/`ExecStopPost=` | parada/limpieza | acciones al detener, investigar mutación o borrado |
| `Environment=`/`EnvironmentFile=` | variables que llegan al proceso | fuentes editables, configuraciones sensibles, **no revelar secretos** |
| `WorkingDirectory=` | cwd del proceso | rutas con escritura no autorizada |
| `User=`/`Group=` | identidad del servicio | root por defecto en servicios del sistema si no se restringe |
| `RootDirectory=`/`RootImage=` | raíz alternativa | visibilidad de archivos y aislamiento relativo |
| `RuntimeDirectory=`/`StateDirectory=` | directorios gestionados | evitar `chmod 777` y creación manual insegura |

## 7.2 Tipos y noción de «listo» [DOC: F07]

- `Type=simple`: systemd considera iniciado con semántica temprana, lo cual **no garantiza** que la app esté lista para clientes.
- `Type=exec`: espera éxito de la invocación de `execve` para confirmar lanzamiento, no una prueba de salud de la aplicación.
- `Type=notify`: el servicio compatible informa disponibilidad, típicamente vía `sd_notify`/`READY=1`.
- `Type=forking`: software tradicional que se bifurca; gestionar PID principal puede ser más difícil; evitar si una app moderna puede ejecutarse en foreground.
- `Type=oneshot`: tarea corta cuyo proceso normalmente termina; puede presentarse `inactive (dead)` habiendo tenido éxito.
- `Type=dbus`: readiness asociada a la adquisición del nombre bus configurado.

`Restart=always` no es una política universal: puede convertir fallos en bucles, saturar logs e impedir investigar. Considera `StartLimitIntervalSec=` y `StartLimitBurst=` (la ubicación concreta de estas directivas depende de la versión). Alertar por cualquier `RestartCount > 0` produce falsos positivos sin línea base.

# 8. Activación no evidente: sockets, timers, paths y sesiones

## 8.1 Sockets [DOC: F08]

En *socket activation*, el gestor escucha en un socket (`.socket`) y puede iniciar o activar el servicio relacionado cuando aparece demanda. Esto separa el socket en escucha del proceso de negocio.

```bash
systemctl list-sockets --all
systemctl status NOMBRE.socket
systemctl show NOMBRE.socket -p Listen -p Triggers
systemctl show NOMBRE.service -p TriggeredBy
ss -lntup              # Algunos detalles requieren privilegio; relación PID/socket es una foto
```

Que `NOMBRE.service` esté `inactive` no demuestra puerto cerrado si `NOMBRE.socket` sigue `active`. Inversamente un proceso puede abrir su propio puerto sin `.socket`.

## 8.2 Timers [DOC: F09]

Un `.timer` programa la activación de una unidad, por defecto una `.service` de nombre correspondiente; `Unit=` permite otros objetivos compatibles. `OnCalendar=` usa calendario de reloj real; `OnBootSec=` y `OnUnitActiveSec=` usan temporización monotónica respecto al evento indicado. `Persistent=true` aplica a calendarios y permite cierta recuperación de activaciones perdidas después de inactividad, pero no garantiza reconstruir **cada** ocurrencia perdida.

```bash
systemctl list-timers --all
systemctl cat NOMBRE.timer
systemctl show NOMBRE.timer -p NextElapseUSecRealtime -p LastTriggerUSec
systemd-analyze calendar 'hourly'
```

**Alerta SOC:** una tarea periódica desconocida puede ser legítima (copias de seguridad, rotación, agentes, actualizadores). El contenido del `.service`, identidad, cambios recientes y justificación operativa pesan más que su mera presencia. MITRE lo recoge como T1053.006.

## 8.3 Paths y usuarios

- `.path` puede activar unidades por cambios/condiciones en rutas; su existencia amplía la superficie de ejecución.
- `systemctl --user` consulta un gestor distinto al de PID 1: puede haber servicios persistentes de usuario en `~/.config/systemd/user/`.
- `loginctl show-user USUARIO -p Linger` permite verificar si un gestor de usuario puede continuar sin sesión interactiva activa; no asumas que está habilitado.
- `systemd-run` puede crear **unidades transitorias** que no tienen por qué aparecer como un `.service` persistente en `/etc`.

**SOC:** para atribuir ejecución, correlaciona unidad/cgroup con UID, *journal*, procesos, filesystem y auditoría; el nombre del padre `systemd` por sí solo es insuficiente.

# 9. Modelo de amenaza: persistencia mediante systemd

MITRE ATT&CK T1543.002 describe abuso de creación/modificación de servicios, y T1053.006 abuso de timers. El modelo sirve **para detección, validación controlada y corrección**, no para instalar persistencia no autorizada. [DOC: F10, F11]

## 9.1 Superficies a inventariar

1. Archivos `.service`, `.timer`, `.socket`, `.path` nuevos o alterados.
2. *Drop-ins* que redefinen `ExecStart=`, identidad o rutas sin que el archivo base cambie.
3. Unidades de usuario y sesiones con *lingering*.
4. Activación efímera (`systemd-run`) y generadores que crean unidades durante boot o `daemon-reload`.
5. Rutas de ejecutables con permisos de escritura inadecuados; scripts llamados desde `ExecStartPre/Post`.
6. Enlaces `.wants/`, aliases y unidades habilitadas que no estaban en baseline.
7. Dependencias que sorprenden: *socket activation*, timer, servicio distinto al que su nombre sugiere.

**Escenario de prueba inocuo:** un usuario crea `socdemo.service` en **su propia cuenta** con un script que solo añade una hora a un archivo de su HOME. Blue Team observa artefacto, activación y limpieza. Red Team solo demuestra que la persistencia **de usuario** sería posible bajo esa cuenta; no afirma privilegio root ni ejecución tras cierre de sesión si *lingering* no está habilitado.

## 9.2 Qué NO inferir de un único indicio

- `systemctl enable` en registros → **no implica compromiso** ni que el servicio haya arrancado.
- `FragmentPath=/etc/...` → personalizado, no necesariamente hostil.
- `ExecStart=/bin/sh -c ...` → puede ser un patrón de mantenimiento discutible, no prueba por sí solo payload malicioso.
- nombre que imita servicio legítimo → anomalía que exige comparación, no atribución automática.
- un mtime reciente → puede venir de parcheo, despliegue, restauración o manipulación; correlaciona y considera reloj.
- logs ausentes → retención, recolección incompleta, journald volátil o evasión, entre otras hipótesis.

# 10. Procedimiento SOC: triage de un servicio sospechoso

**Caso:** alerta de creación de `inventario-sync.service` fuera de ventana aprobada. **No ejecutes ni reinicies esa unidad para «ver qué hace».**

### Etapa A — preservar contexto y establecer visibilidad

```bash
hostnamectl
id
cat /proc/sys/kernel/random/boot_id
uptime -s
systemctl status inventario-sync.service --no-pager --full
systemctl show inventario-sync.service \
  -p FragmentPath -p DropInPaths -p UnitFileState -p ActiveState -p MainPID \
  -p ExecStart -p User -p Group -p TriggeredBy -p NeedDaemonReload
systemctl cat inventario-sync.service
```

La recopilación en vivo altera algo de estado (acceso a ficheros, memoria/cachés) y no es forense de solo lectura a nivel físico. Para host crítico, coordina EDR/IR y prioriza preservación de evidencia fuera del host.

### Etapa B — relacionar procesos, disparadores y tiempo

```bash
systemctl list-timers --all
systemctl list-sockets --all
systemctl list-dependencies --reverse inventario-sync.service
journalctl -u inventario-sync.service --since '2026-10-17 00:00:00' --no-pager
# Si MainPID > 0 y sigue vivo:
ps -p PID_REAL -o pid,ppid,user,lstart,args
cat /proc/PID_REAL/cgroup
readlink -f /proc/PID_REAL/exe
```

`PID_REAL` debe sustituirse por PID encontrado; puede haber reutilización de PID. `journalctl -u` filtra mensajes asociados a unidad de la forma que permite *journald*, **no captura** necesariamente todos los syscalls, ficheros ni comunicaciones. Si importa el aislamiento de la prueba, recopila con capacidad de auditoría/EDR autorizada, tema profundizado en tanda posterior.

### Etapa C — resolver binario y cadena de suministro

```bash
# Solo después de conocer la ruta EXACTA y sin evaluar scripts arbitrarios:
readlink -f /RUTA/REAL/AL/BINARIO
stat /RUTA/REAL/AL/BINARIO
sha256sum /RUTA/REAL/AL/BINARIO
# Debian/Parrot
command -v dpkg-query && dpkg-query -S /RUTA/REAL/AL/BINARIO
# Fedora/RHEL
command -v rpm && rpm -qf /RUTA/REAL/AL/BINARIO
# Arch
command -v pacman && pacman -Qo /RUTA/REAL/AL/BINARIO
```

**Aporta**: paquete dueño si existe, hash observado, propietario, cambio temporal, fuente del paquete y cambio administrativo. **No aporta automáticamente**: procedencia criptográfica del ejecutable actual ni integridad de memoria. Para preservar, exporta a destino aprobado, anota `sha256`, zona horaria, boot ID, privilegio usado y cadena de custodia. Evita divulgar tokens/secretos si `EnvironmentFile` es sensible.

### Etapa D — decidir contención proporcional

Antes de `stop`, `disable` o `mask`: confirmar criticidad, autorización, continuidad de negocio, dependencias, mecanismo de reactivación y recuperación. Si hay exfiltración activa, el procedimiento de contención puede priorizar aislar conectividad **desde la plataforma de respuesta** según playbook, preservando evidencia volátil cuando sea compatible con el riesgo; cortar un PID a ciegas no asegura contención ni identifica causa raíz.

# 11. Telemetría mínima útil y carencias

| Fuente | Observa | No garantiza |
|---|---|---|
| `journalctl -b`, `-u`, `_PID=` | eventos del gestor/app enviados al journal | ejecución detallada de cada comando ni retención histórica |
| `systemctl show/cat` | definición y estado observado | que sea legítima, que el proceso nunca cambió |
| ficheros de unidades + `stat` | estado actual y timestamps de FS | autor exacto, contenido anterior sin respaldos |
| historial APT/DNF/pacman | transacciones registradas | cambios manuales, integridad del propio log tras compromiso |
| `auditd`/eBPF/EDR configurados | eventos de escritura/exec relevantes, según reglas | cobertura retroactiva si no existía la captura |
| inventario de cambios/CMDB | intención y aprobaciones | que la ejecución real haya seguido exactamente el plan |
| hashes + repositorios + firma | comparación e identidad de artefactos | inmunidad frente a claves comprometidas o modificaciones en memoria |

**Campos recomendados para SIEM:** hostname estable, boot ID, tiempo UTC, UID/AUID cuando lo provea la fuente, unit name, unit path, drop-in path, operación, PID/PPID, exe, argv cuando esté disponible y permitido, hash, origen de despliegue, ID de ticket y fiabilidad de la observación. Cuidado con `argv` y entornos: pueden contener secretos.

## 11.1 Hipótesis de detección (lógica conceptual, no regla lista para producción)

**D01 — Nueva unidad de sistema:** cambio inesperado en `/etc/systemd/system/**/*.service` fuera del deployment autorizado + posterior activación/ejecución. Sube prioridad si ruta de ejecutable en directorio de usuario o temporal, usuario inesperado, o nombre parecido a unidad existente.

**D02 — Drop-in que cambia ejecución:** escritura en `*.service.d/*.conf` + diferencias materiales en `ExecStart`, `ExecStartPre/Post`, `User`, `EnvironmentFile` + `daemon-reload`/restart. Correlación negativa: despliegue firmado/previsto.

**D03 — Timer desconocido:** `.timer` nuevo + habilitación + disparo de `.service` nuevo + ejecución en identidad sensible. Evita regla basada solo en `systemctl list-timers`.

**D04 — Paquete no conforme:** modificación de archivo propiedad de paquete + verificación inconsistente + ausencia de transacción autorizada. Excepciones por conffiles/customizaciones: clasificar tipo de archivo.

**D05 — Alteración de repositorio:** escritura en `sources.list.d`, `*.repo`, keyrings o política de firma; revisar impacto antes de afirmar riesgo, porque las migraciones/rekeys son frecuentes.

**Alimentación SIEM:** estas detecciones necesitan FIM/auditd/eBPF o inventarios históricos; `journalctl` por sí mismo no emite necesariamente eventos suficientes para cada modificación de archivo. Si no hay sensor, el caso es **brecha de cobertura**, no una detección fallida atribuible al analista.

# 12. Seguridad de unidades: minimizar impacto sin vender «sandbox perfecto»

La guía `systemd.exec` define mecanismos de credenciales, capacidades, namespaces y sandbox; su eficacia depende de kernel, soporte y compatibilidad de la aplicación. [DOC: F12]

| Control | Intención | Limitación / verificación |
|---|---|---|
| `User=` y `Group=` | evitar root cuando no se requiere | recursos y permisos de la app |
| `DynamicUser=yes` | identidad de vida limitada | encaje con estado persistente e interfaces |
| `NoNewPrivileges=yes` | impedir adquirir privilegios nuevos por `execve` | no anula privilegios ya concedidos ni políticas externas |
| `CapabilityBoundingSet=` | recortar capacidades Linux | requiere entender cuáles usa la app |
| `AmbientCapabilities=` | conceder capacidades puntuales si procede | puede ampliar exposición: justificar y medir |
| `ProtectSystem=strict` | jerarquía casi toda en solo lectura para unidad | excepciones `ReadWritePaths`/`StateDirectory`; montajes/namespaces |
| `ProtectHome=yes` | restringir acceso a homes | falla funcional si la app requiere leerlos |
| `PrivateTmp=yes` | espacio temporal separado | no equivale a aislamiento general ni antivirus |
| `PrivateDevices=yes` | reducir exposición a dispositivos | algunas apps requieren dispositivos específicos |
| `ProtectKernelTunables=yes` | restringir acceso a parámetros del kernel | alcance real depende de la plataforma |
| `RestrictAddressFamilies=` | filtrar familias de sockets | revisar necesidad de Unix/INET y compatibilidad |
| `SystemCallFilter=` | limitar syscalls permitidas | requiere pruebas representativas; puede romper librerías |
| `RestrictSUIDSGID=yes` | restringir SUID/SGID | revisar uso legítimo y versión |

**Plan de endurecimiento:** inventario de funciones y dependencias → perfil mínimo compatible → añadir 1–2 restricciones por iteración → prueba funcional, disponibilidad, latencia y logs → rollback documentado. No se debe introducir un bloque de 20 directivas aleatorias en servicios de producción.

```bash
systemd-analyze security NOMBRE.service
systemd-analyze verify /RUTA/DE/UNIDAD.service
systemctl show NOMBRE.service -p User -p NoNewPrivileges -p PrivateTmp -p ProtectSystem
```

`systemd-analyze security` ofrece una puntuación basada en configuración/heurística; **no** es un pentest, verificador de ausencia de CVEs ni prueba de que el aislamiento funcione bajo todos los mecanismos de un contenedor. Su lectura es comparativa y contextual.

# 13. Gestión de paquetes = control de cambios y confianza

Paquete ≠ repositorio ≠ gestor ≠ proceso. El gestor resuelve dependencias y gestiona transacciones; la confianza depende de origen, metadata, claves, política, integridad y configuración local. Los *maintainer scripts*, scriptlets y hooks pueden ejecutar acciones durante instalación, actualización o retirada, por eso `apt install`, `dnf upgrade` o `pacman -Syu` son **cambios de sistema**, no consultas de lectura. [DOC: F13–F18]

## 13.1 Debian, Ubuntu y Parrot: APT y dpkg

- **APT** resuelve metadatos, versiones, orígenes y dependencias.
- **dpkg** registra e instala paquetes `.deb`; `dpkg-query` permite inventario y propiedad de rutas.
- **apt-secure** valida firmas de metadatos de repositorios/Release y hashes asociados, según política configurada. **No** equivale a una firma individual del archivo `.deb` ni a demostrar que todo archivo instalado permanece inalterado.
- Configuración de repositorios en `/etc/apt/sources.list` y `/etc/apt/sources.list.d/`; opciones `Signed-By` restringen claves aceptables por origen. No uses `trusted=yes` o `Acquire::AllowInsecureRepositories` como remedio genérico.
- `apt-key` es una vía heredada/desaconsejada en escenarios modernos; preferir ámbitos de confianza explícitos según la versión de APT y la documentación de distribución.

**Lecturas sin instalación** (algunos registros requieren `sudo`):

```bash
apt-cache policy bash
apt list --installed 2>/dev/null | head
apt-mark showhold
# Evita depender de la salida de apt list en scripts: interfaz no estable.
dpkg-query -W -f='${Package}\t${Version}\t${Status}\n' bash
dpkg-query -S /usr/bin/bash
dpkg -V bash                                  # Verificación local; no firma de estado actual
ls -l /var/log/apt/history.log* /var/log/dpkg.log* 2>/dev/null
ls -l /etc/apt/sources.list /etc/apt/sources.list.d/ 2>/dev/null
```

**Cambios controlados, solo con ventana:** `sudo apt update` cambia índices/cache locales; `sudo apt upgrade` aplica transacciones; `sudo apt full-upgrade` puede añadir/eliminar paquetes; `apt install` instala, potencialmente dispara scripts y activa servicios. `apt-get -s upgrade` **simula** decisiones en las condiciones actuales de repositorios locales, no promete exactamente el resultado futuro.

**Investigación SOC:** si se modificó `/etc/apt/sources.list.d/tercero.sources`, identifica URI, tipo, codename, componentes, `Signed-By`, dueño, quién lo aprobó, hora y paquete que efectivamente se descargó. No ejecutes `apt update` como primera acción forense: altera índices y metadatos locales.

## 13.2 Fedora y RHEL: DNF/DNF5 y RPM

```bash
rpm -q bash
rpm -qf /usr/bin/bash
rpm -V bash                            # Verifica atributos según RPM DB; interpretar excepciones
dnf --version                          # En entornos antiguos puede ser DNF4
dnf history                            # Comprueba sintaxis local
# Entornos con dnf5:
dnf5 history list
dnf5 history info last
```

Los cambios de CLI, transacciones y flags varían entre DNF4 y DNF5; la salida de `dnf5 history ... --json` puede usarse para automatizar según su documentación, pero no asumas que `dnf` es alias idéntico en todas las versiones. Los archivos `.repo` suelen estar en `/etc/yum.repos.d/`; política de firmas depende de `gpgcheck`, repositorios, metadatos y keyrings. Consultar `rpm -V` compara contra base local, **que puede ser alterada** en un sistema ya comprometido.

## 13.3 Arch y derivados: pacman

```bash
pacman -Q bash
pacman -Qo /usr/bin/bash
pacman -Qkk bash                       # comprobación amplia de metadatos si existen
pacman -Qm                             # paquetes no presentes en repos sincronizados
pacman -Qi bash
ls -l /var/log/pacman.log
```

`pacman -Qkk` puede detectar ausencias/discrepancias de metadatos pero no sustituye a la verificación criptográfica de un origen externo confiable. Repos y firmas están asociados a `/etc/pacman.conf` y la infraestructura de llaves; `pacman -Syu` actualiza el sistema de forma transaccional según repositorios configurados. **Evita `pacman -Sy` seguido mucho después de instalar paquetes de forma parcial**: mezclar bases y binarios puede provocar problemas de consistencia. [DOC: F18]

## 13.4 Comparativa rápida

| Pregunta | Debian/Parrot | Fedora/RHEL | Arch |
|---|---|---|---|
| ¿Qué versión tengo? | `dpkg-query -W bash` | `rpm -q bash` | `pacman -Q bash` |
| ¿De quién es esta ruta? | `dpkg -S /usr/bin/bash` | `rpm -qf /usr/bin/bash` | `pacman -Qo /usr/bin/bash` |
| ¿Integridad local? | `dpkg -V bash` | `rpm -V bash` | `pacman -Qkk bash` |
| ¿De dónde vendría? | `apt-cache policy bash` | `dnf info bash` / repos | `pacman -Si bash` |
| ¿Qué transacciones? | logs APT + dpkg | `dnf[5] history` | `/var/log/pacman.log` |
| ¿Repos? | `sources.list`, `.sources` | `*.repo` | `pacman.conf` |

**Límite técnico fundamental:** la verificación local se realiza contra metadatos almacenados por el **propio host** y puede dar falsos positivos (configuración editada legítimamente) o falsos negativos (archivos no rastreados, cambios solo en memoria, sensor manipulado). En un compromiso confirmado, valida desde una referencia externa de confianza y preserva adquisición apropiada.

# 14. Seguridad de la cadena de suministro en operación cotidiana

## 14.1 Qué protege cada control

1. **Firma del repositorio/paquete:** dificulta sustitución sin clave confiada; no garantiza que el proveedor nunca se comprometa.
2. **TLS:** protege transporte hacia el extremo autenticado; no sustituye validación de repositorios ni decisiones de confianza.
3. **Verificación de archivos instalados:** detecta ciertas diferencias respecto a base local, no prueba ausencia de ejecución maliciosa.
4. **SBOM/inventario:** permite saber componentes/versión declarada; no demuestra que estén parchados o activos.
5. **Política de cambios y repos permitidos:** reduce instalación oportunista; requiere auditoría de excepciones.
6. **Controles de reinicio y actualización:** un paquete instalado no implica servicio reloaded, reiniciado o kernel cargado actualizado.

## 14.2 Cambios inesperados: flujo de respuesta

| Hallazgo | Qué preguntar | Evidencia complementaria |
|---|---|---|
| repo nuevo | ¿quién lo agregó?, ¿qué llave se usa? | diff de config, ticket, logs auth/audit |
| downgrade | ¿rollback aprobado o manipulación? | historial de transacciones, seguridad del parche |
| checksum extraño | ¿config editada? ¿archivo binario? | base externa, propietario, mtime, despliegues |
| package postinstall instala servicio | ¿es comportamiento previsto? | listado de ficheros/scriptlet, changelog, política |
| reboot pendiente | ¿kernel cargado viejo? | `uname -r`, paquetes kernel, release notes |
| agente sigue viejo | ¿proceso aún usa binario/módulo anterior? | PID, libs/mappings, restart policy; cuidado disponibilidad |

## 14.3 Parches y reinicios: ventanas controladas

Actualizaciones de una biblioteca compartida pueden dejar procesos con código viejo en memoria hasta su reinicio. Distros y herramientas gestionan esto de manera distinta; Ubuntu documenta interacciones de `unattended-upgrades` con `needrestart`, incluido comportamiento desde Ubuntu 24.04 LTS. **Nunca asumas que un update aplicado implica que todos los procesos o kernels están actualizados en ejecución**. [DOC: F19]

Pasos responsables: inventario → advisory/CVE y severidad real → impacto y dependencias → snapshot/backup comprobado → ventana y responsables → prueba en staging → actualización → verificación de servicio y reboot si corresponde → evidencias + plan de retorno.

# 15. Runbooks prácticos, no destructivos

## Runbook R1: fallo al iniciar un servicio

1. `systemctl status UNIDAD --no-pager --full` (qué estado/causa informa).
2. `systemctl cat UNIDAD`; `systemctl show UNIDAD -p ExecStart -p User -p WorkingDirectory -p NeedDaemonReload` (qué se *espera* ejecutar).
3. `journalctl -b -u UNIDAD --no-pager` (errores de unidad/servicio disponibles).
4. `systemctl list-dependencies UNIDAD`, `systemd-analyze critical-chain UNIDAD` (orden y requisitos).
5. Verificar ruta, permiso, recurso, puerto, configuración sin exponer secretos.
6. Comparar cambios (paquetes, drop-ins, repos, cambios en credenciales) y confirmar hipótesis.
7. En laboratorio o ventana aprobada, aplicar una corrección reversible, medir salud y documentar.

## Runbook R2: «unidad habilitada que nadie reconoce»

1. Inventariar nombre, `FragmentPath`, *drop-ins*, UnitFileState, rutas de activación.
2. Preservar ficheros/metadata/hash, configuración efectiva y logs sin arrancarla.
3. Verificar propietario de paquete, ruta ejecutable real y permisos de escritura en la cadena.
4. Correlacionar cronología con repos, parcheo y despliegues.
5. Determinar legitimidad (responsable de servicio y aprobación), riesgo y cobertura incompleta.
6. Autorizar contención/remediación con rollback y comprobar que no quedan otros disparadores.

## Runbook R3: «actualicé, pero sigo vulnerable»

1. Registrar CVE/advisory y versiones afectadas de **la distribución**, no solo la versión upstream.
2. Consultar estado de paquete, revisión/epoch y backports; un número de versión antiguo **no** implica necesariamente vulnerable.
3. Identificar binario cargado/servicio/reboot pendiente.
4. Verificar indicadores después de reinicio controlado.
5. Registrar evidencia, fecha, propietario y excepción, si aplica.

# 16. Laboratorio 1 — mapa de arranque verificable (solo lectura)

**Objetivo:** diferenciar evidencia directa e inferencia en la ruta de arranque.

**Entorno:** VM GNU/Linux con systemd como PID 1, snapshot recomendado. Sin sudo para la mayor parte. Duración 35–50 minutos.

```bash
mkdir -p "$HOME/soc-t2/L01"
{
  date -u -Is
  cat /etc/os-release
  uname -a
  ps -p 1 -o pid,comm,args
  cat /proc/cmdline
  findmnt /
  systemctl get-default
  systemd-analyze time
  systemctl --failed
} > "$HOME/soc-t2/L01/observaciones.txt" 2>&1
systemd-analyze critical-chain > "$HOME/soc-t2/L01/cadena.txt" 2>&1
sha256sum "$HOME/soc-t2/L01/"*.txt > "$HOME/soc-t2/L01/SHA256SUMS"
```

**Entregables:** diagrama real con al menos cinco hitos; matriz «hecho visto / inferencia / faltante»; dos posibles fallos de arranque y comprobación reversible. **No** edites GRUB, ESP ni initramfs.

**Nota técnica:** los hashes entregados validan estas copias desde ese momento, no su procedencia original ni la integridad del host.

# 17. Laboratorio 2 — estados, dependencias y origen efectivo

**Objetivo:** explicar comportamiento de un servicio instalado sin alterarlo.

**Precondición:** escoger una unidad existente (ej. `cron.service`, `ssh.service`, `NetworkManager.service` **solo si existe**). Ejecutar:

```bash
UNIDAD=cron.service  # Reemplaza tras systemctl list-unit-files --type=service
systemctl status "$UNIDAD" --no-pager
systemctl is-active "$UNIDAD" || :
systemctl is-enabled "$UNIDAD" || :
systemctl cat "$UNIDAD"
systemctl show "$UNIDAD" -p FragmentPath -p DropInPaths -p ActiveState \
   -p SubState -p UnitFileState -p ExecStart -p User -p TriggeredBy
systemctl list-dependencies "$UNIDAD"
systemctl list-dependencies --reverse "$UNIDAD"
```

**Cuestionario:** ¿está activa? ¿está habilitada? ¿puede activarse sin estar habilitada? ¿hay drop-ins? ¿quién administra el binario? ¿dónde ves una suposición que no puedes probar?

**Criterio:** un informe de ≤2 páginas con 10 hechos observables, 3 límites y cero cambios de estado.

# 18. Laboratorio 3 — servicio y timer de USUARIO inocuos

**Objetivo:** probar ejecución programada sin privilegio root, conocer activación y limpieza. **Requisito**: sesión con `systemctl --user` operativa; en VM sin bus de usuario/WSL/contenedor sin systemd, **no fuerces `loginctl enable-linger`**; documenta limitación y simula con archivos aislados.

**1) Crear script benigno:**

```bash
mkdir -p "$HOME/.local/libexec" "$HOME/.config/systemd/user" "$HOME/soc-t2/L03"
cat > "$HOME/.local/libexec/soc-t2-marker.sh" <<'SH'
#!/bin/sh
umask 077
printf '%s\n' "$(date -u -Is)" >> "$HOME/soc-t2/L03/actividad.log"
SH
chmod 700 "$HOME/.local/libexec/soc-t2-marker.sh"
```

**2) Crear unidad y timer (en el HOME de la cuenta actual):**

```bash
cat > "$HOME/.config/systemd/user/soc-t2-marker.service" <<'UNIT'
[Unit]
Description=Laboratorio SOC T2: marca local sin red
[Service]
Type=oneshot
ExecStart=%h/.local/libexec/soc-t2-marker.sh
NoNewPrivileges=true
PrivateTmp=true
UNIT

cat > "$HOME/.config/systemd/user/soc-t2-marker.timer" <<'UNIT'
[Unit]
Description=Laboratorio SOC T2: temporizador de marca
[Timer]
OnCalendar=hourly
Persistent=false
Unit=soc-t2-marker.service
[Install]
WantedBy=timers.target
UNIT
```

**3) Validar, ejecutar una vez e inventariar:**

```bash
systemd-analyze verify "$HOME/.config/systemd/user/soc-t2-marker.service" \
 "$HOME/.config/systemd/user/soc-t2-marker.timer"
systemctl --user daemon-reload
systemctl --user start soc-t2-marker.service
systemctl --user enable --now soc-t2-marker.timer
systemctl --user status soc-t2-marker.service --no-pager
systemctl --user list-timers --all | grep soc-t2 || :
systemctl --user cat soc-t2-marker.service
journalctl --user -u soc-t2-marker.service --no-pager
cat "$HOME/soc-t2/L03/actividad.log"
```

**Cuidado:** el timer `hourly` puede dispararse de nuevo antes de limpieza según horario. Si `systemctl --user` falla, guarda el error; no cambies políticas del equipo ni el *linger* por la práctica.

**4) Desinstalar sin perder evidencia:**

```bash
systemctl --user disable --now soc-t2-marker.timer
systemctl --user stop soc-t2-marker.service || :
# Preserva unidades, logs, comandos y hashes en ~/soc-t2/L03 antes de borrar.
cp "$HOME/.config/systemd/user/soc-t2-marker."{service,timer} "$HOME/soc-t2/L03/"
sha256sum "$HOME/soc-t2/L03/"*.service "$HOME/soc-t2/L03/"*.timer \
  > "$HOME/soc-t2/L03/SHA256SUMS-units"
rm -- "$HOME/.config/systemd/user/soc-t2-marker.service" \
       "$HOME/.config/systemd/user/soc-t2-marker.timer" \
       "$HOME/.local/libexec/soc-t2-marker.sh"
systemctl --user daemon-reload
systemctl --user list-unit-files | grep soc-t2 || :
```

**Observación SOC:** clasifica ejecución puntual vs habilitación vs activación por timer y demuestra que el contexto es **UID de usuario**. **RT autorizado:** explica por qué esto no demuestra automáticamente elevación ni persistencia cuando el gestor de usuario no se mantiene fuera de sesión.

# 19. Laboratorio 4 — detección de *drop-in* y configuración efectiva (sin root)

**Objetivo:** comprender diferencia entre fragmento base, *drop-in* y proceso cargado. Trabajar sobre el nombre `soc-t2-marker` del L03 **antes de su limpieza** o volver a crear la unidad en VM.

```bash
mkdir -p "$HOME/.config/systemd/user/soc-t2-marker.service.d"
cat > "$HOME/.config/systemd/user/soc-t2-marker.service.d/50-lab-hardening.conf" <<'UNIT'
[Service]
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=read-only
UNIT

systemctl --user cat soc-t2-marker.service
systemctl --user show soc-t2-marker.service -p DropInPaths -p NeedDaemonReload
systemctl --user daemon-reload
systemctl --user show soc-t2-marker.service -p DropInPaths -p NeedDaemonReload -p ProtectHome
```

**Nota:** las opciones de sandbox en gestores de usuario pueden estar limitadas por permisos de namespaces/plataforma; `ProtectHome=read-only` es ilustrativo y podría interferir con la escritura del script según el entorno. **No ejecutes el servicio tras añadir este control sin predecir el efecto y probarlo en la VM**. Para limpiar, preserva antes el `.conf`, bórralo y vuelve a ejecutar `daemon-reload`; nunca lo apliques a servicios de producción.

**Debes entregar:** diff conceptual base/effective, justificación de la precedencia, prueba de valor leído después de reload, explicación de compatibilidad y rollback.

# 20. Laboratorio 5 — triage de paquetes y confianza

**Objetivo:** resolver la cadena archivo → paquete → versión → fuente → verificación local → modificaciones justificadas.

**Debian/Parrot:**

```bash
mkdir -p "$HOME/soc-t2/L05"
apt-cache policy bash | tee "$HOME/soc-t2/L05/policy.txt"
dpkg-query -S /usr/bin/bash | tee "$HOME/soc-t2/L05/owner.txt"
dpkg-query -W -f='${Package}\t${Version}\t${Status}\n' bash \
  | tee "$HOME/soc-t2/L05/version.txt"
dpkg -V bash > "$HOME/soc-t2/L05/verify.txt" 2>&1 || :
```

**Fedora/RHEL:** `rpm -q bash`, `rpm -qf /usr/bin/bash`, `rpm -V bash`, `dnf history` o `dnf5 history list`; documenta DNF4/DNF5 observado.

**Arch:** `pacman -Q bash`, `pacman -Qo /usr/bin/bash`, `pacman -Qkk bash`, `pacman -Qi bash`.

**Preguntas obligatorias:** ¿qué hace exactamente la firma? ¿qué compara el verificador local? ¿qué significa salida vacía? ¿qué rutas **no** cubre este paquete? ¿cómo cambiaría tu conclusión si root está comprometido? **No instalar/actualizar/desinstalar paquetes** en esta práctica.

# 21. Laboratorio 6 — caso SOC+RT: persistencia BENIGNA y línea temporal

**Escenario:** un detector informa de «nuevo servicio de usuario, posible T1543.002/T1053.006». El propio estudiante creó `soc-t2-marker` en L03. **No se emplean payloads, ocultación, conexiones externas ni elevación.**

**Trabajo Blue Team:**

1. Construir cronología: creación del `.service`, del `.timer`, `daemon-reload`, ejecución puntual, habilitación del timer y limpieza.
2. Guardar salida de `systemctl --user cat/show/status`, `journalctl --user`, `stat`, hashes y fichero de actividad.
3. Separar evidencia positiva de hipótesis: quién posee la ruta, UID, por qué se ejecutó, cómo podría volver a ejecutarse, si el *linger* está activo (consultar, no cambiar).
4. Emitir veredicto: **emulación autorizada**, con señales que un SIEM hipotético sí/no captaría en función de sensor.

**Trabajo Red Team autorizado:** documentar condiciones necesarias para persistencia de usuario; controles para prevención (permisos, inventario, política) y detección (FIM, audit/EDR + eventos de activación); explicar por qué no fue root ni evasión.

**Informe mínimo:** resumen de 150 palabras, 8 evidencias numeradas, 2 hipótesis alternativas, 3 mitigaciones, 1 matriz de cobertura, retest y retirada de artefactos. Si el sensor no existe, declara **«no medido»**, no «evadido».

# 22. Laboratorio 7 — hardening razonado y rollback

**Objetivo:** revisar la unidad didáctica y diseñar dos perfiles de seguridad sin tocar servicios críticos.

**Perfil A (mínimo):** `User` no privilegiado, `NoNewPrivileges`, `PrivateTmp` y permisos de archivos justificados. **Perfil B (aislamiento adicional):** evaluar `ProtectSystem`, `ProtectHome`, `CapabilityBoundingSet` y acceso de red conforme a requisitos **reales** del programa. Una directiva que rompa escritura legítima debe rechazarse o tener excepción específica.

**Acciones:**

```bash
systemd-analyze security --help | head -35
systemd-analyze verify "$HOME/.config/systemd/user/soc-t2-marker.service"
# No confiar en un número de exposición sin verificar compatibilidad funcional.
```

**Entregables:** tabla `control | amenaza | dependencia | evidencia | coste operativo | rollback`, prueba de funcionamiento o explicación documentada de impedimento técnico; propuesta de habilitación por cambio controlado.

# 23. Evaluación: preguntas de razonamiento

Responde con argumentos y, cuando aplique, comandos **de consulta**; no se aprueba con definiciones memorizadas.

1. ¿Puede UEFI iniciar un kernel sin GRUB? ¿Bajo qué condiciones generales?
2. ¿Qué hace initramfs y por qué dos distros pueden construirlo diferente?
3. ¿Qué evidencia distingue kernel cargado de kernel instalado más reciente?
4. ¿Por qué `systemd-analyze blame` no equivale a «servicio culpable»?
5. ¿Qué compruebas antes de usar `journalctl -b -1`?
6. ¿En qué se diferencian `enabled`, `active`, `static` y `masked`?
7. ¿Por qué `After=postgresql.service` no hace que arranque PostgreSQL?
8. ¿Qué significa que `Requires=` y `After=` se utilicen juntos?
9. ¿Puede un `.socket` arrancar un servicio deshabilitado? Razona un caso.
10. ¿Cuándo un `Type=oneshot` puede aparecer `inactive` sin error?
11. ¿Qué cambia `daemon-reload` y qué **no** hace?
12. ¿Por qué no editar directamente una unidad del proveedor bajo `/usr/lib`?
13. ¿Cuál es el valor probatorio de `systemctl cat` frente al proceso ya en ejecución?
14. ¿Qué es un *drop-in* y por qué es central en SOC?
15. ¿Qué papel cumplen `ExecStartPre/Post` en una investigación?
16. ¿Qué diferencia hay entre servicio de sistema y servicio de usuario?
17. ¿Qué evidencia necesitas para afirmar persistencia efectiva tras logout?
18. ¿Qué es un generador de systemd y por qué escapa a un `find /etc/...`?
19. ¿Por qué no basta mirar `systemctl --failed` para declarar un host sano?
20. ¿Qué hace `Persistent=` en un `.timer` de `OnCalendar`?
21. ¿Cómo distinguir un servicio mal configurado de uno malicioso sin sesgo?
22. ¿Por qué la firma de APT y `dpkg -V` prueban cosas distintas?
23. ¿Qué revela `rpm -qf /ruta` y qué no puede demostrar?
24. ¿Qué limitaciones tiene `pacman -Qkk`?
25. ¿Cómo buscarías cambios de repositorio sin ejecutar una actualización?
26. ¿Qué significa actualización instalada pero proceso antiguo cargado?
27. ¿Por qué `ProtectSystem=strict` podría romper una aplicación?
28. ¿La puntuación `systemd-analyze security` certifica seguridad real?
29. ¿Por qué matar el PID puede empeorar el triage o permitir reactivación?
30. ¿Qué fuentes y campos mínimos pedirías para detectar T1543.002?

**Clave orientativa:** el catálogo JSON contiene resultados esperados/criterios, no soluciones rígidas. Las respuestas excelentes citan limitaciones, casos excepcionales y efectos secundarios.

# 24. Rúbrica de evaluación (100 puntos)

| Dimensión | Puntos | Evidencia de aprobación |
|---|---:|---|
| Arranque y causalidad (L01) | 15 | cadena real y límites claros |
| Estados/dependencias/unidades (L02) | 15 | estados correctamente diferenciados |
| Servicio/timer reversible (L03) | 20 | funcionamiento y limpieza demostrados |
| Drop-ins y configuración (L04) | 10 | precedencia y cambio seguro |
| Cadena de paquetes (L05) | 15 | procedencia y verificación con límites |
| Triage SOC/RT (L06) | 20 | hipótesis, evidencias y cobertura |
| Hardening con rollback (L07) | 5 | control justificado y no disruptivo |
| **Total** | **100** | **≥80 para superar** |

**Fallo crítico automático:** modificación no autorizada del firmware/bootloader o servicios de producción, deshabilitar verificación de paquetes, exfiltración, persistencia oculta o borrado de evidencia antes de preservarla. En tareas con privilegios, no se ejecuta ninguna modificación fuera de VM/scope autorizado.

# 25. Lista operativa para una entrevista SOC o Red Team junior

**Caso de 60 segundos:** «Servidor tras reinicio ejecuta un proceso que no aparece en CMDB».

Respuesta profesional: *“Identifico hostname/boot ID/hora y el PID/cgroup, consulto unidad efectiva y posibles socket/timer/user units, preservo artefactos/logs y relaciono ruta ejecutable con paquete y cambio aprobado. Primero determinamos alcance y criticidad; no mato el PID ni toco la unidad sin confirmar contención y mecanismo de reactivación. Escalo si hay indicadores convergentes, declaro límites del sensor y propongo retest y hardening específico.”*

**Errores eliminatorios:** `enable = start`; `After = Requires`; «firma APT prueba binario intacto»; «PID 1 systemd siempre»; «journalctl no tiene entradas, así que no hubo ataque»; «un servicio activo en root implica exploit»; «`mask` elimina el malware».

**Conexión con la Tanda 3:** el siguiente bloque investigará almacenamiento, FS, backups y recuperación: necesario para entender `/boot`, ESP, rootfs, montajes, snapshots, integridad y preservación real.

# 26. Referencias verificables

Estas referencias fundamentan conceptos, sintaxis y modelos. Siempre contrastar con `man` local y el software instalado. Los enlaces no son una garantía de la versión concreta del host.

- **F01** — systemd, *Bootup process* (secuencia firmware → loader/kernel → initrd → system manager). https://www.freedesktop.org/software/systemd/man/257/bootup.html
- **F02** — systemd, *systemd-boot / UEFI boot manager*. https://www.freedesktop.org/software/systemd/man/257/systemd-boot.html
- **F03** — systemd, *systemd-analyze*: `blame`, `critical-chain`, `security`, `verify`. https://www.freedesktop.org/software/systemd/man/257/systemd-analyze.html
- **F04** — systemd, *journalctl*: filtros, arranques, retención. https://www.freedesktop.org/software/systemd/man/257/journalctl.html
- **F05** — systemd, *systemctl*: estado, enable/disable, mask, daemon-reload. https://www.freedesktop.org/software/systemd/man/257/systemctl.html
- **F06** — systemd, *systemd.unit*: rutas, ficheros, dependencies y `After=`. https://www.freedesktop.org/software/systemd/man/257/systemd.unit.html
- **F07** — systemd, *systemd.service*: `ExecStart`, tipos, reinicio, start/stop. https://www.freedesktop.org/software/systemd/man/257/systemd.service.html
- **F08** — systemd, *systemd.socket*: activation, `ListenStream`, `Accept`. https://www.freedesktop.org/software/systemd/man/257/systemd.socket.html
- **F09** — systemd, *systemd.timer*: calendarios, monotonía, persistencia. https://www.freedesktop.org/software/systemd/man/257/systemd.timer.html
- **F10** — MITRE ATT&CK **T1543.002**, Systemd Service: abuso por adversarios y detección. https://attack.mitre.org/techniques/T1543/002/
- **F11** — MITRE ATT&CK **T1053.006**, Systemd Timers: cronogramas de ejecución. https://attack.mitre.org/techniques/T1053/006/
- **F12** — systemd, *systemd.exec*: credenciales, filesystem y sandbox. https://www.freedesktop.org/software/systemd/man/257/systemd.exec.html
- **F13** — Debian, *apt-secure*: qué autentica APT. https://manpages.debian.org/trixie/apt/apt-secure.8.en.html
- **F14** — Debian, *sources.list*: entradas deb822 y `Signed-By`. https://manpages.debian.org/trixie/apt/sources.list.5.en.html
- **F15** — Debian, *dpkg*: verificar, instalar y estado de paquetes. https://manpages.debian.org/trixie/dpkg/dpkg.1.en.html
- **F16** — DNF5, *history*: transacciones / JSON. https://dnf5.readthedocs.io/en/stable/commands/history.8.html
- **F17** — RPM, *RPM manual*: consultas y comprobación. https://rpm.org/docs/4.20.x/man/rpm.8.html
- **F18** — Arch Linux, *pacman(8)*: query/owner/check y política de actualización. https://man.archlinux.org/man/pacman.8.en
- **F19** — Ubuntu Server, *Automatic updates*: reinicios de servicios y `needrestart`. https://ubuntu.com/server/docs/how-to/software/automatic-updates/
- **F20** — systemd, *systemd.generator*: unidades generadas en `/run`. https://www.freedesktop.org/software/systemd/man/257/systemd.generator.html
- **F21** — systemd, *systemd.special*: targets y sincronización. https://www.freedesktop.org/software/systemd/man/257/systemd.special.html
- **F22** — Linux Kernel, *Using the initial RAM disk* (histórico; distinguir de initramfs moderno). https://docs.kernel.org/admin-guide/initrd.html
- **F23** — systemd, *systemd-run*: unidades transitorias. https://www.freedesktop.org/software/systemd/man/257/systemd-run.html
- **F24** — systemd, *systemd.path*: activación por rutas. https://www.freedesktop.org/software/systemd/man/latest/systemd.path.html

# 27. Anexo: plantilla de evidencia y retest

```text
ID de caso:
Alcance / propietario / autorización:
Host / sistema / versión / gestor init:
Zona horaria / UTC / Boot ID:
Síntoma declarado:
Cambios recientes aprobados:
Hipótesis H1/H2/H3:
Unidades activas y estado / habilitación:
FragmentPath / DropInPaths / generador / usuario:
Ejecutable real / paquete dueño / versión / fuente:
Hashes + método de obtención:
Eventos del journal / de FIM / de auditoría disponibles:
Eventos que NO podemos observar y por qué:
Impacto observado vs impacto hipotético:
Plan de contención y autorizador:
Remediación:
Prueba posterior / regresión:
Rollback y limpieza:
Adjuntos con hashes:
Conclusión + grado de confianza:
```

**Fin de la Tanda 2 de 5.** El JSON adjunto modela laboratorios, rúbricas, preguntas, hipótesis de detección y referencias con identificadores estables para aprendizaje y automatización local.
