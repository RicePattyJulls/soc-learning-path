---
title: "LINUX | SOC + RED TEAM"
subtitle: "Tanda 3 de 5 · Almacenamiento, sistemas de archivos, backups, restauración y recuperación"
author: "Dossier técnico de estudio y laboratorio"
date: "18 de octubre de 2026"
lang: es-ES
version: "3.0"
---

> **Propósito.** Investigar en profundidad cómo Linux identifica, organiza y protege datos en discos, volúmenes y sistemas de archivos; cómo respaldarlos y restaurarlos con pruebas; y cómo investigar fallos, manipulación o destrucción de datos desde SOC/DFIR y Red Team **autorizado**.

**Origen y alcance:** tercera tanda acordada, desarrollando el bloque «Almacenamiento, sistemas de archivos, backups, restauración y recuperación» de `linux(1).txt`. Presupone los fundamentos de Bash/administración (T1) y arranque/systemd (T2). No reemplaza las tandas de networking, controles de acceso y telemetría avanzada. Distribuciones objetivo: Debian/Parrot y, por contraste, RHEL/Fedora. Las opciones y el soporte varían por kernel, utilidades, distribución y tipo de sistema de archivos.

**Convención:** `[DOC:Fnn]` fuente verificable numerada; `[LAB]` ejercicios realizados **solo** en rutas/archivos temporales o máquinas propias; `[SOC]` visibilidad, hipótesis y evidencia; `[RT]` validación ofensiva inocua autorizada; `[LÍMITE]` qué no permite concluir el dato. Fecha de revisión: 2026-10-18. Los comandos ilustran conceptos; **no se han ejecutado en tus equipos**.

# 1. Objetivos comprobables y modelo mental

Al terminar debes ser capaz de:

1. Representar y diagnosticar el camino **disco/SSD/NVMe o backend virtual → partición → RAID/LUKS/LVM según topología → sistema de archivos → montaje VFS → ruta → proceso**; identificar variantes sin inventar capas.
2. Determinar qué ocupa espacio, qué recurso realmente está montado, si el límite es bloques, inodos, cuota o archivos borrados abiertos, y qué pruebas discriminan cada caso.
3. Distinguir ext4, XFS, Btrfs, tmpfs, NFS y overlayfs por propiedades, límites y herramientas de operación.
4. Explicar los metadatos: inodos, rutas, ACL/xattrs, marcas temporales, sparse files, hard links y enlaces simbólicos; interpretar sus límites forenses.
5. Diseñar copias con RPO/RTO, separación de privilegios, retención e inmutabilidad práctica; **restaurar** y verificar un conjunto de datos sin sobrescribir el original.
6. Decidir cuándo usar `tar`, `rsync`, restic o snapshots; demostrar que **RAID ≠ backup**, **snapshot ≠ backup independiente** y **hash ≠ cadena de custodia completa**.
7. Trazar un procedimiento seguro frente a errores de disco y corrupción sin lanzar `fsck`, `xfs_repair -L` o `btrfs check --repair` sobre datos irremplazables.
8. Construir hipótesis SOC para destrucción de datos, manipulación de ficheros, montajes inesperados, cambios en retención, fallos de backup y exposición de secretos.
9. Comunicar en un informe Red Team autorizado qué permisos o rutas permitirían modificar o borrar datos y copias **sin efectuar destrucción real**.

**Evaluación:** 100 puntos en 8 laboratorios, aprobado ≥80, cobertura obligatoria de recuperación/restauración y **cero fallos críticos** de seguridad operativa. Se suspenden prácticas que escriban en discos del host sin autorización, restauren sobre la fuente o borren evidencias.

## 1.1 Modelo de las capas y relación con la seguridad

```text
  aplicación / usuario          ruta /var/lib/app/registro.db
                 │
  VFS + mount namespace         permisos, ACL, flags, descriptor abierto
                 │
  ext4 / XFS / Btrfs / ...       inodos, directorios, journal/COW, checksums
                 │
  LVM LV, dm-crypt, md RAID     virtualización, cifrado y/o redundancia (opcionales)
                 │
  particiones GPT / MBR         tabla de particiones (opcional)
                 │
  bloque: /dev/nvme0n1, vda     kernel, controlador, hipervisor
                 │
  almacenamiento físico/remoto  SSD, RAID hardware, SAN, volumen cloud
```

**No es una pila fija.** Es válido un filesystem directamente sobre dispositivo, sobre loop file, sobre LUKS→LVM o LVM→LUKS, o un volumen remoto que no se presenta como bloque local. Tampoco hay garantía de que `/dev/sda` identifique siempre la misma unidad: renumeración, hotplug y multipath cambian las rutas. Para política de montaje se prefieren selectores persistentes (`UUID=`, `PARTUUID=`, `/dev/disk/by-id/...` cuando proceda), cuya unicidad también debe verificarse. [DOC:F01–F03]

| Elemento | Operaciones | Pregunta SOC | Pregunta RT autorizado |
|---|---|---|---|
| Bloque/partición | identificación, capacidad, salud | ¿Fallo físico, borrado lógico o cambio virtual? | ¿Existe exposición no prevista de dispositivo? |
| Mapeadores (LVM/LUKS/md) | volúmenes, cifrado, redundancia | ¿Se perdió un mapeo o se abrió fuera del plan? | ¿Quién puede operar/leer mapeadores y claves? |
| Sistema de archivos | consistencia y metadatos | ¿Qué cambió, cuándo y qué puede perderse? | ¿Permisos débiles en rutas críticas? |
| Montaje/namespace | rutas visibles y flags | ¿Ruta escondida por montaje, RO inesperado? | ¿Hay rutas montadas con privilegios inesperados? |
| Backup | repositorio y políticas | ¿Se suprimió la capacidad de recuperación? | ¿Alcance de permisos de borrado/alteración? |

# 2. Inventario: primero observar, después cambiar [DOC:F01–F04]

## 2.1 Comandos iniciales sin mutación intencionada

```bash
cat /etc/os-release
uname -r
lsblk -e 7 -o NAME,TYPE,SIZE,FSTYPE,UUID,MOUNTPOINTS
lsblk --json --tree -o NAME,TYPE,SIZE,FSTYPE,UUID,MOUNTPOINTS
findmnt -o TARGET,SOURCE,FSTYPE,OPTIONS
findmnt --target /var
findmnt --fstab --evaluate -o SOURCE,TARGET,FSTYPE,OPTIONS
blkid                          # A menudo requiere privilegios para datos completos
df -hT / /var /home
df -i / /var /home
stat -f -c '%T %a %f %b %i %c %s' /var
cat /proc/self/mountinfo
```

- `lsblk`: inventario de dispositivos, relaciones y propiedades; su formato de salida por defecto **no** es estable para scripts: fijar columnas y, si se necesita estructura, `--json --tree`. `MOUNTPOINTS` recoge múltiples puntos posibles; `MOUNTPOINT` muestra uno. [DOC:F01]
- `blkid` consulta firmas/identificadores, pero una etiqueta o UUID **no prueba integridad ni origen legítimo**. `findmnt` explica montajes efectivos y su origen, no el contenido de datos supuestamente presentes. [DOC:F02]
- `df -hT` mide bloques **según el filesystem**; `du` atribuye contenido accesible bajo un árbol. Pueden divergir por reserva de ext4, ficheros borrados todavía abiertos, montajes, cuotas, sparse files, reflinks/deduplicación, subvolúmenes, permisos y semántica del FS.
- `df -i` cuantifica inodos solo cuando la plataforma expone esta métrica; un `ENOSPC` puede ser agotamiento de inodos aun sobrando bloques, o restricciones de cuotas/capacidad virtual. En Btrfs no interpretes los contadores como equivalentes perfectos a ext4.
- `/proc/self/mountinfo` es la vista de **esta namespace de montaje**. Un servicio o contenedor puede ver otros montajes; al investigar, compara el contexto del proceso autorizado (`/proc/<PID>/mountinfo`) con la vista del analista.

**No confundir:** `lsblk` sin `-e 7` puede mostrar dispositivos loop legítimos de Snap/otras aplicaciones; no los marques maliciosos por nombre. No confundir volumen virtual con dispositivo físico ni deducir red/almacenamiento cloud por una etiqueta.

## 2.2 Método de triaje en cuatro preguntas

1. **¿Qué filesystem ve el proceso afectado?** Determina PID, mount namespace y ruta real: `findmnt --target /ruta`, `/proc/PID/mountinfo`.
2. **¿Qué falla?** `ENOSPC`, `EDQUOT`, `EROFS`, `EIO`, `ESTALE` y latencia no son equivalentes.
3. **¿Cuál es la capa responsable?** Bloque, mapeador, filesystem, permisos, aplicación, hipervisor o red.
4. **¿Qué evidencia necesito antes de arreglar?** estado y tiempo, copias/snapshot independientes, captura de logs (Tanda 4 de telemetría detallada pendiente en el itinerario), historial de cambios, alertas.

# 3. VFS, inodos, rutas y metadatos [DOC:F05–F06]

VFS es la capa de abstracción del kernel para operaciones comunes (`open`, `stat`, `rename`, `unlink`, `fsync`), con semánticas particulares según backend. Un directorio asocia **nombre → objeto/inodo**; el inode guarda metadatos y referencias a bloques, no el nombre completo de archivo. El número de inode no identifica universalmente un archivo: debe combinarse con dispositivo/filesystem y contexto temporal; puede reutilizarse tras borrado.

```bash
namei -l /var/log               # Permisos de cada componente de ruta
stat -- /etc/passwd             # Device + Inode + Mode + Uid/Gid + tiempos
ls -li -- /etc/passwd
find /tmp -xdev -type f -links +1 -print 2>/dev/null
getfacl -p /tmp 2>/dev/null | head -25
getfattr -d -m '-' /tmp 2>/dev/null | head -25
lsattr -d /tmp 2>/dev/null       # FS/dependencia de soporte
```

**Tres enlaces distintos:**

- *Hard link*: dos nombres al **mismo inode** (normalmente mismo FS); modificar contenido visible por uno cambia lo visto por el otro. Borrar un nombre reduce `nlink` pero el contenido no se libera necesariamente mientras haya otro enlace o descriptor abierto.
- *Symlink*: archivo cuyo contenido es una ruta; puede apuntar fuera del árbol, quedar colgante o romper una expectativa de ruta. No persigas enlaces durante recuperación o empaquetado de un árbol no confiable sin definir una política.
- *Bind mount*: presenta un árbol en otra ruta, pero no es un enlace; cambia visibilidad y puede ocultar contenido previo del directorio de montaje. `findmnt`, `mountinfo`, `stat` y namespaces dan contexto.

**Tiempos (`stat`, GNU coreutils):** `mtime` modificación del contenido; `ctime` cambio de estado del inode (metadatos o datos), **no creación**; `atime` acceso, sujeto a `relatime`, `noatime`, cachés y plataforma; `birth/crtime` creación cuando soporte lo permite. `touch` permite alterar `mtime`/`atime` autorizadamente, y un host comprometido puede manipular más señales. `ctime` tampoco es un reloj forense inviolable: restauraciones, modificaciones de sistema y privilegios pueden degradar la inferencia. [DOC:F06]

**Borrado no igual a desaparición instantánea:** `unlink()` retira nombre, no necesariamente todas las referencias. `lsof +L1` puede localizar ficheros abiertos sin links accesibles, pero exige privilegios suficientes; el objeto puede desaparecer cuando se cierre el último descriptor. El éxito de recuperación de ficheros borrados es **incierto**, especialmente con COW, cifrado y SSD/TRIM.

## 3.1 Metadatos que `cp`, `tar`, `rsync` o backup pueden perder

| Metadato | Importancia | Comprobación |
|---|---|---|
| UID/GID y modo | autorización y exposición | `stat -c '%u:%g %a %n'` |
| ACL POSIX | permisos adicionales al modo | `getfacl -p` |
| xattrs | SELinux, IMA, capacidades, etiquetas | `getfattr -d -m -`; `getcap` si aplica |
| hard links | identidad compartida | `stat -c '%d:%i %h'` |
| tiempos | investigación y consistencia | `stat` antes/después |
| sparse files | espacio asignado vs tamaño lógico | `ls -lh`; `du -h`; `stat -c '%b %B %s'` |
| ownership de symlinks | seguridad de rutas | `stat -L` vs `stat` (seguir o no) |
| flags específicos | inmutable/apéndice, COW | `lsattr`; documentación FS |

**Conclusión operativa:** el hash SHA-256 del *contenido* puede coincidir y aun así diferir el estado de permisos o los xattrs. Una restauración útil prueba también **comportamiento de la aplicación**, no solo hashes.

# 4. Familias de sistemas de archivos y garantías [DOC:F07–F12]

| FS | Idea central | Fortaleza | Limitación operativa o forense |
|---|---|---|---|
| ext4 | inodos, extents, journal de metadatos por defecto | ubicuo y sólido | journal no es historial fiable de contenido ni copia |
| XFS | FS de journaling escalable, herramientas propias | buena capacidad/concurrencia | `fsck.xfs` no repara; `xfs_repair` requiere planificación |
| Btrfs | COW, subvolúmenes, checksums y send/receive | snapshots y verificación de bloques compatibles | `scrub` no sustituye `check`/backup; perfiles y NOCOW importan |
| tmpfs | memoria/swap (según configuración) | temporalidad y rapidez | volatilidad al reiniciar, uso de memoria, contenido no necesariamente solo RAM |
| NFS | FS remoto por red | datos compartidos | permisos, cachés, identidades, `ESTALE`, dependencia de servidor/red |
| overlayfs | combinación upper/lower, `copy_up`, whiteouts | imágenes y contenedores | borrado aparente puede ser whiteout; rutas en capas distintas |
| vfat/exFAT | compatibilidad y discos extraíbles | intercambio | semánticas de permisos/metadatos y journal distintas; no asumir ACL nativa POSIX |

## 4.1 ext4: journal, consistencia y límites de la evidencia

Ext4 dispone de modos `data=ordered` (habitual), `data=writeback` y `data=journal`. En `ordered`, en términos generales el journal cubre metadatos, con ordenación de datos antes de ciertos metadatos para reducir exposición tras caída; **no** garantiza el contenido exacto de toda escritura sin sincronización apropiada. `data=journal` registra también datos, a cambio de costes. El *journal* ayuda a restaurar consistencia estructural, **no es un backup ni un registro forense íntegro y perpetuo**. [DOC:F07]

```bash
findmnt -no SOURCE,FSTYPE,OPTIONS /
# Solo si la fuente es una partición ext4 real y una lectura es pertinente:
# sudo tune2fs -l /dev/DEVICE_LAB       # consultar; no ejecutar en dispositivo no validado
# sudo dumpe2fs -h /dev/DEVICE_LAB     # metadatos FS, puede requerir privilegios
```

**SOC:** errores `EXT4-fs error`, remount-ro, checksum de metadata y `I/O error` sugieren problemas a clasificar; **no** atribuir ataque por defecto. Correlacionar salud de disco, apagón, kernel, despliegues, cambios en `fstab` y eventos de backup.

## 4.2 XFS: diagnóstico diferente

XFS cuenta con journal de metadatos y capacidades de reparación particulares. El ejecutable `fsck.xfs` normalmente es un stub que termina sin comprobar/reparar; **`fsck -f` sobre cualquier tipo de FS no es un procedimiento universal**. Un chequeo de XFS con `xfs_repair -n` se planifica **desmontado**. Un log sucio requiere tratamiento específico y puede necesitar un montaje/desmontaje previo; `-L` descarta el log y puede causar pérdidas, por lo que es último recurso y no forma parte de esta práctica. [DOC:F08]

## 4.3 Btrfs: COW, checksum y snapshots

Btrfs incorpora checksums de datos (salvo modos/archivos sin checksumming) y metadatos; `btrfs scrub` valida bloques y puede reparar si existen réplicas válidas **y redundancia adecuada**. `scrub` **no** es `btrfs check`, **no** garantiza arreglar todo daño y un `scrub -r` no siempre implica cero escrituras sobre filesystem montado RW, según versión/condición documentada. Un archivo con `NOCOW` suele llevar `NODATASUM`: no afirmes integridad total del contenido de esos datos. [DOC:F09–F10]

```bash
# Consulta solamente si el punto realmente es btrfs:
findmnt -no FSTYPE /ruta
sudo btrfs filesystem usage -T /ruta      # Si btrfs-progs instalado
sudo btrfs subvolume list /ruta
sudo btrfs scrub status /ruta
# NO ejecutar 'btrfs check --repair' como rutina
```

Snapshots Btrfs son puntos de referencia **lógicos** basados en subvolúmenes; **no** capturan automáticamente todos los subvolúmenes anidados, ni un estado transaccional de bases de datos activas, ni son copia independiente del mismo dispositivo. Para replication `btrfs send`/`receive`, usar snapshots **read-only** adecuados y mantener las relaciones de snapshots de origen si se realiza envío incremental. [DOC:F11–F12]

## 4.4 Overlayfs y contenedores (anticipo de la Tanda 5)

`upperdir` tiene prioridad sobre `lowerdir`; si un archivo solo existe abajo y se modifica, puede producirse *copy-up*; si se elimina de la vista combinada, un *whiteout* puede ocultar el archivo del lower sin destruirlo. Un inventario forense sobre una capa aislada **no representa** todo lo que el proceso ve. Revisar configuración y `mountinfo` del namespace pertinente y respetar las variaciones de implementación. [DOC:F13]

# 5. Montajes, /etc/fstab, systemd y frontera de confianza [DOC:F02–F04,F14]

`/etc/fstab` contiene especificaciones de montaje persistentes que suelen traducirse en unidades generadas por systemd (cuando systemd gestiona arranque). Sus seis campos representan fuente, punto de montaje, tipo, opciones, dump y fsck-pass. `UUID=` apunta a la identidad de **filesystem**; `PARTUUID=` a la partición. `nofail` afecta al comportamiento ante ausencia/error, pero **no** significa montar en modo seguro ni validar el contenido. [DOC:F03]

```bash
findmnt --verify --verbose                    # Comprobación del fstab / tabla, según versión
findmnt --fstab -o SOURCE,TARGET,FSTYPE,OPTIONS
systemctl list-units --type=mount --all       # Si systemd
findmnt --target /tmp -o TARGET,SOURCE,FSTYPE,OPTIONS
findmnt -no OPTIONS /tmp
```

- `nodev` evita interpretar nodos de dispositivo de esa montura; `nosuid` impide el efecto SUID/SGID y determinadas capacidades de archivo en los términos documentados; `noexec` evita ejecución directa bajo ciertas condiciones, **no bloquea** interpretar un script mediante un intérprete ejecutable montado en otra ruta. Son mitigaciones complementarias, **no** fronteras de aislamiento autosuficientes. [DOC:F14]
- `ro` frente a `rw` importa, pero la vista puede variar en bind mounts, namespace, superblock y flags per-mount. `mount -o remount` es **mutante** y requiere control de impacto.
- Peligro clásico: montajes con directorio destino escribible por terceros, backups que siguen symlinks inesperados, directorios con ACL excesivas y exportaciones NFS con políticas demasiado amplias.

**Guía de cambio seguro de montaje (no ejecutarlo en producción por defecto):** (a) backup de `/etc/fstab`, (b) confirmar identidad del volumen y `blkid`, (c) validar sintaxis y disponibilidad, (d) probar en VM/snapshot y consola de recuperación, (e) desplegar bajo ventana, (f) verificar post-arranque el volumen real y permisos, (g) registrar rollback.

# 6. Volúmenes y mapeadores: GPT, LVM, RAID, LUKS

## 6.1 LVM [DOC:F15]

- **PV:** volumen físico gestionado por LVM, frecuentemente partición o dispositivo mapeado.
- **VG:** agrupación de capacidad física utilizable; **LV:** volumen lógico presentado al sistema de archivos.
- **Thin pool:** espacio asignado lógicamente; su saturación introduce riesgo operativo distinto al de un LV tradicional.
- **Snapshot LVM:** fotografía temporal que depende del origen y del almacenamiento subyacente; en snapshots clásicos, el área de COW puede agotarse e invalidarlos. **No equivale a backup off-host.**

```bash
sudo pvs -o pv_name,vg_name,pv_size,pv_free
sudo vgs -o vg_name,vg_size,vg_free
sudo lvs -a -o lv_name,vg_name,lv_attr,lv_size,origin,data_percent,metadata_percent
lsblk -o NAME,TYPE,SIZE,FSTYPE,MOUNTPOINTS
```

Si falta cualquiera de esos binarios, no significa que el host no tenga almacenamiento relevante: puede no tener LVM o el paquete correspondiente. **Nunca** ejecutes `pvcreate`, `vgremove`, `lvremove`, `lvconvert --merge` ni ampliaciones contra nombres inferidos.

## 6.2 RAID ≠ backup

RAID1/5/6/10 o equivalentes pueden aumentar tolerancia a cierto fallo de disco, según perfil y estado. **No** protegen de borrado lógico sincronizado, ransomware, errores de aplicación, corrupción propagada, permisos comprometidos, incendio ni todos los fallos simultáneos. Verifica tolerancia, degradación y *rebuild*; no atribuyas falsamente protección forense a una réplica síncrona.

```bash
cat /proc/mdstat                 # Si md RAID existe
command -v mdadm >/dev/null && sudo mdadm --detail --scan
lsblk -o NAME,TYPE,SIZE,FSTYPE,MOUNTPOINTS
```

## 6.3 LUKS / dm-crypt: confidencialidad no reemplaza integridad [DOC:F16–F17]

`dm-crypt` cifra bloques de forma transparente. LUKS proporciona formato/gestión de cabecera, claves y *keyslots*. Cifrar en reposo protege principalmente frente a ciertos escenarios de exposición de medio **apagado/bloqueado**; no impide que un proceso privilegiado vea datos con el volumen abierto, ni implica control de acceso a nivel aplicación. [DOC:F16]

```bash
lsblk -o NAME,TYPE,FSTYPE,MOUNTPOINTS
sudo cryptsetup status NOMBRE_MAPEO_LAB   # Solo si el mapeo existe
# sudo cryptsetup luksDump /dev/DEVICE_LAB  # Revela metadatos de cabecera, no clave
```

**Riesgo crítico de respaldo de cabecera:** `cryptsetup luksHeaderBackup` genera una copia binaria que contiene la cabecera y área de keyslots. Junto con una contraseña válida **en el momento del backup**, puede permitir acceso incluso si después se eliminó/cambió ese secreto. Custódiala como material altamente sensible, con acceso restringido y bajo una política de recuperación segura. **No** ejecutes `luksFormat`, `luksErase` ni `luksHeaderRestore` en discos reales durante el curso. [DOC:F17]

# 7. Capacidad, cuotas y rendimiento: árbol de decisión operativo

| Síntoma | Qué comprobar | Hipótesis posibles | Acción segura siguiente |
|---|---|---|---|
| `No space left on device` | `df -hT`, `df -i`, `findmnt` | bloques, inodos, cuota, thin pool | medir sin borrar y localizar ruta / política |
| `df` lleno, `du` pequeño | `lsof +L1`, namespaces, mounts | archivos borrados abiertos, ocultación por mount, reservas | atribuir PID y función; no cerrar servicio a ciegas |
| No se puede escribir | `findmnt`, `dmesg`/journal, `stat` | RO por fallo, permisos, cuota | preservar mensaje y separar causas |
| Gran uso de disco sin consumo alto | `iostat -xz 1` si existe, `pidstat -d`, métricas backend | latencia de almacenamiento, saturación IOPS, red | comprobar percentiles y baseline |
| Backup grande inesperado | snapshot, diferenciales, compresión, reflinks | datos cambiantes, contenido ya presente, tamaño lógico | comparar alcance y hashes |
| Archivo existe pero desaparece en proceso | namespace, bind/overlay, symlink | contexto de montaje distinto | inspeccionar ruta desde proceso correcto |

```bash
# Subárbol controlado: limita profundidad antes de rastrear todo /
du -xhd1 /var 2>/dev/null | sort -h
sudo lsof +L1 2>/dev/null | head -30  # Requiere lsof; salida puede incluir sensibles
# Inventario de ficheros grandes: priorizar rutas de datos autorizadas
find /var/tmp -xdev -type f -size +100M -printf '%s %p\n' 2>/dev/null | sort -n
```

**Nota:** `du -x` evita cruzar filesystems **según su identidad**, pero un reflink o directorio compartido puede crear complejidad de atribución. `sort -h` es GNU; scripts multi-plataforma exigen comprobar soporte. `lsof` hace observación de estado dinámico; su ejecución tiene costes y no garantiza snapshot atómico.

# 8. Estrategia de backup como diseño de recuperación [DOC:F18–F22]

**Definiciones no intercambiables:**

- **Backup:** copia recuperable con control de versiones y destino/privilegios apropiados, comprobable independientemente.
- **Snapshot:** captura lógica de un estado de datos en un volumen/FS/hipervisor; sirve para rollback o para conseguir punto de lectura, pero debe exportarse/protegerse para resistir pérdida o manipulación del origen.
- **Replication/sync:** replica estado; también puede replicar borrados/corrupción maliciosos.
- **Imagen forense:** adquisición para investigar, con documentación del método, integridad y custodia; no se confunde con backup restaurable de aplicación.

## 8.1 RPO / RTO / consistencia / threat model

| Pregunta de diseño | Ejemplo explícito, no valor normativo |
|---|---|
| RPO: ¿máxima pérdida temporal aceptable? | 1 h, 24 h: depende del negocio |
| RTO: ¿tiempo máximo hasta recuperar servicio? | 2 h, 48 h: requiere pruebas |
| ¿Qué restaurar? | ficheros, permisos, DB, claves, certificados, secretos, metadatos, configuración y dependencias |
| ¿Qué excluimos y por qué? | caché prescindible, ficheros regenerables; justificar exclusiones, no por omisión |
| ¿Dónde sobrevive un atacante con root? | idealmente **no** puede borrar todas las versiones fuera de host |
| ¿Quién puede recuperar? | operadores acotados, control dual para borrado, credenciales separadas |
| ¿Cómo validar? | restauración aislada + hash/metadatos + lectura aplicación + medición RTO/RPO |

El patrón «3-2-1» (tres copias, dos medios/tipos, una fuera de sitio) es una **heurística**; no reemplaza análisis de amenazas. Una copia off-host bajo **las mismas credenciales de borrado** que el host de producción puede fallar frente al mismo compromiso. Separar identidad de lectura/escritura/borrado y retención protegida es más importante que repetir números. Inmutabilidad real depende del mecanismo de destino y de quién tenga capacidad administrativa sobre él.

## 8.2 Consistencia: crash-consistent vs application-consistent

Copia en caliente de `db.sqlite`, InnoDB, PostgreSQL o archivos de VM puede producir un conjunto con páginas de instantes diferentes. Un snapshot de bloque representa, como mucho, un punto físico consistente en los términos de la plataforma; **no** implica consistencia transaccional de aplicaciones por sí mismo. Estrategias: funciones de backup de la base de datos, WAL/archiving, coordinación con fsfreeze/snapshots bajo procedimientos definidos y prueba de arranque/restauración. Evitar `kill -9` como «método de respaldo».

## 8.3 Política mínima recomendada para un laboratorio o mini-SOC

1. Enumerar datos críticos, ruta, propietario, tamaño, sensibilidad y requerimiento RPO/RTO.
2. Seleccionar herramienta que soporte el tipo de datos/metadatos y pruebas de restauración.
3. Crear repositorio independiente cifrado; gestionar secretos sin dejarlos en scripts world-readable ni shell history.
4. Establecer ventanas y políticas de retención, **alertar** ante faltas de backup, fallos de verificación y cambios de configuración.
5. Realizar restauración en directorio o VM **aislados**, obtener manifiesto de hashes y validar la aplicación.
6. Registrar evidencia del ensayo, error real observado, tiempo de ejecución, responsable y acciones correctivas.

# 9. Herramientas de backup: comparativa operacional

| Herramienta | Qué ofrece | Qué no ofrece automáticamente | Uso adecuado |
|---|---|---|---|
| `tar` | archivo portable; listado/extraer; opciones para ACL/xattrs | versionado/retención/inmutabilidad/cifrado integrados de repositorio | exportar conjunto fijo y evidencias seleccionadas |
| `rsync` | copia y sincronización incremental, filtros, transporte SSH | retención de múltiples versiones salvo arquitectura aparte; `--delete` arriesga borrar destino | espejo controlado, traslado de datos |
| `restic` | snapshots, cifrado, deduplicación, verificación y restauración | seguridad contra borrado por misma credencial de control del repositorio; aplicación consistente por sí sola | backup versionado en repositorio separado |
| Snapshot LVM/Btrfs | punto de vista coherente de FS según implementación | copia física fuera del host, consistencia de DB, retención protegida | rollback acotado, punto origen para respaldo |
| Herramienta nativa DB | consistencia lógica/física de motor | por sí sola cubrir OS, claves, permisos, configuración | PostgreSQL/MySQL/SQLite conforme a motor |

## 9.1 `tar`: respaldo de árbol sintético [DOC:F22]

```bash
LAB="$(mktemp -d -t linux-t3-XXXXXX)"
mkdir -p -- "$LAB/source" "$LAB/restore" "$LAB/archives"
printf 'ticket 001: control de laboratorio\n' > "$LAB/source/tickets.txt"
printf 'config=1\n' > "$LAB/source/app.conf"
# GNU tar. No incluyas una ruta arbitraria ni extraigas sobre /.
tar -C "$LAB/source" --create --file "$LAB/archives/base.tar" .
tar --list --file "$LAB/archives/base.tar"
tar -C "$LAB/restore" --extract --file "$LAB/archives/base.tar"
sha256sum "$LAB/source/tickets.txt" "$LAB/restore/tickets.txt"
printf 'LAB=%s\n' "$LAB"
```

**Metadatos:** GNU tar dispone de `--acls --xattrs --selinux --numeric-owner` dependiendo de plataforma/herramientas; capturar xattrs **sin** garantizar restauración en un FS destino compatible puede ser engañoso. Al restaurar un archivo de **procedencia no confiable**, no extraer con root sobre un árbol valioso; inspeccionar nombres, enlaces y tipos, usar usuario sin privilegios y ruta aislada. `tar` almacena nombres de fichero, no necesariamente verifica por sí mismo la autenticidad del emisor. `--listed-incremental` requiere entender una cadena consistente y **puede eliminar ficheros en destino** durante la restauración incremental: prohibido ensayarlo sobre datos personales o productivos. [DOC:F22]

## 9.2 `rsync`: espejo **no** versionado por defecto [DOC:F28]

```bash
# Usa el LAB previo, sin --delete
mkdir -p -- "$LAB/mirror"
rsync -aHAX --itemize-changes --dry-run -- "$LAB/source/" "$LAB/mirror/"
rsync -aHAX --itemize-changes -- "$LAB/source/" "$LAB/mirror/"
rsync -aHAX --checksum --dry-run --itemize-changes -- "$LAB/source/" "$LAB/mirror/"
```

- `-a` significa *archive* (aproximadamente recursión, enlaces, permisos, tiempos, grupo, propietario, dispositivos/especiales según acceso), **no incluye por sí solo** ACL (`-A`), xattrs (`-X`) ni hardlinks (`-H`). En copias sin root puede no restaurar propietarios o atributos privilegiados; revisar mensajes/códigos de salida.
- `--dry-run` muestra plan de cambios, pero no autoriza automáticamente el posterior comando: el árbol puede cambiar entre inspección y ejecución.
- `--delete` puede replicar eliminación accidental o maliciosa del origen al destino; usar políticas de exclusión, versionado de destino y aprobación separada. Evitarlo en todos los laboratorios de este dossier.
- **Barra final:** `source/` copia **contenido** a destino; `source` puede crear el directorio `source` dentro del destino. Comprobar con un árbol sintético antes de producción.
- Symlinks de un origen no confiable exigen tratamiento explícito; preferir destino aislado y considerar opciones como `--safe-links`/`--munge-links` en función del objetivo. [DOC:F28]

## 9.3 `restic`: repositorio cifrado, comprobación y restauración [DOC:F18–F21]

**Requisito:** binario `restic` instalado. El laboratorio usa **solo un repositorio local temporal** con datos inventados. La contraseña será introducida interactivamente para evitar exponerla en comandos o ficheros sin protección. La contraseña debe poder recuperarse por procedimientos autorizados; sin ella, un repositorio cifrado no sirve de recuperación.

```bash
# Inicializa las variables en un shell controlado:
LAB="$(mktemp -d -t linux-t3-restic-XXXXXX)"
mkdir -p "$LAB/source" "$LAB/restore"
printf 'registro controlado v1\n' > "$LAB/source/registro.txt"
restic -r "$LAB/repo" init           # contraseña interactiva
restic -r "$LAB/repo" backup "$LAB/source"
restic -r "$LAB/repo" snapshots
restic -r "$LAB/repo" check          # comprueba estructura básica de repositorio
# Para verificar bloques de contenido también, consultar `restic check --read-data` o --read-data-subset
printf 'registro controlado v2\n' > "$LAB/source/registro.txt"
restic -r "$LAB/repo" backup "$LAB/source"
restic -r "$LAB/repo" snapshots
restic -r "$LAB/repo" restore latest --target "$LAB/restore"
find "$LAB/restore" -type f -print
```

**Importante sobre rutas de restauración:** con respaldo de ruta absoluta, restic reconstruye la jerarquía bajo el `--target` (p. ej. `LAB/restore/tmp/.../source/registro.txt`). **No** asumas que queda inmediatamente en `$LAB/restore/registro.txt`. Determina ruta usando `find` y consulta `restic ls latest` antes de aplicar una comparación de contenido. Para pruebas de la versión anterior, identifica un *snapshot ID* anterior de `restic snapshots`; `latest` normalmente apunta al segundo. [DOC:F19]

`restic check` sin opciones valida la integridad estructural del repositorio; no equipararlo a leer y verificar todos los datos. Consulta `restic check --read-data` o muestreo (`--read-data-subset`) según ventana y repositorio y registra exactamente qué validaste. `restic forget` aplica políticas de retención y `prune` elimina material no referenciado: **ambos requieren controles**; no aparecen como acciones del laboratorio. [DOC:F20–F21]

**Modelo de credenciales:** claves de cifrado recuperables por operador no deben estar almacenadas junto al repositorio de manera que un atacante con acceso al mismo host tenga ambas. Un repositorio remoto por SFTP o cloud no garantiza retención protegida si el principal tiene permiso para eliminarlo todo. Un supuesto «append-only» solo es real bajo enforcement externo y sin facultad de borrado para la identidad comprometida.

# 10. Restaurar significa volver a operar, no solo copiar bytes

## 10.1 Runbook de recuperación controlada

**Preparación (antes del incidente)**

1. Identificar activo, ruta, dependencias, claves y propietarios, sensibilidad y versiones/entornos soportados.
2. Fijar RPO/RTO, último éxito, repositorio y documentación de recuperación accesible fuera de host.
3. Ensayar copia en sistema separado; **no** elegir el único backup para pruebas destructivas.
4. Asegurar mínimo privilegio de restauración y segregación de credenciales.

**Durante incidente**

1. Registrar alerta y decidir contención con equipo responsable: ¿corrupción física, error lógico, acción maliciosa o fallo de aplicación?
2. Preservar evidencia previa al cambio: estado del host, snapshots/medios, logs disponibles, lista de montajes, eventos de backup, hashes y línea temporal. **No** convertir un restore en borrado de rastros.
3. Confirmar copia **preincidente** y que no incluya el mismo estado malicioso. El backup más reciente puede contener corrupción o artefactos implantados.
4. Restaurar en entorno aislado, con controles de red/acceso para evitar reactivar un servicio comprometido.
5. Validar contenido, ACL/propietarios, secretos, integridad DB, pruebas funcionales y resultados observables.
6. Aprobar cutover, comunicar RPO real, verificar accesos y alertas, registrar responsable y evidencias del ensayo.

**Después del incidente:** rotar credenciales y reparar causa raíz según evaluación; retener evidencias bajo política; medir RTO/RPO realmente obtenidos; actualizar documentación y detecciones. No aceptar «`restic check` OK» como sustituto de restore.

## 10.2 Manifiesto verificable: hashes y metadatos

```bash
# Sobre directorio de laboratorio que no cambia durante el cálculo:
(cd "$LAB/source" && find . -type f -print0 | LC_ALL=C sort -z | xargs -0 -r sha256sum) \
  > "$LAB/source.sha256"
(cd "$LAB/source" && find . -type f -printf '%P\t%u\t%g\t%m\t%T@\n' | LC_ALL=C sort) \
  > "$LAB/source-metadata.tsv"
sha256sum "$LAB/source.sha256" "$LAB/source-metadata.tsv"
```

**Advertencia de precisión:** un hash list hecho con `sha256sum` y nombres de archivo puede tener problemas de comparación si hay saltos de línea o bytes especiales en nombres, salvo formato NUL y parseo compatible. Este ejemplo se limita a datos sintéticos cuyos nombres son simples. Para adquisición forense adversarial, usar herramientas probadas, manifiestos a prueba de ambigüedad y preservar bytes originales de nombres. Un fichero cambia mientras es hasheado: un hash podría ser de estado intermedio. Tampoco demuestra por sí solo que el sistema **no** esté comprometido.

# 11. Recuperación tras corrupción y dispositivos con errores [DOC:F08–F10,F23,F29]

## 11.1 Prioridades según la naturaleza del incidente

| Situación | Riesgo principal | Medida prioritaria |
|---|---|---|
| Error de aplicación (config/DB) | sobrescribir datos lógicos válidos | identificar backup consistente y ruta de validación |
| FS con corrupción | reparación escribe y puede perder rastros/datos | detener mutaciones, clonar/obtener imagen según protocolo, plan de reparación |
| Disco físico con I/O errors | cada reintento degrada el medio | minimizar lecturas no esenciales, experto/herramienta de adquisición y copia sana |
| Borrado lógico accidental | actividad normal reutiliza bloques | controlar escrituras, preservar imagen/backup, restauración controlada |
| Ransomware o sabotaje | reinfección y destrucción de copias | aislar conforme a IR, validar fuente, credenciales y estado anterior al ataque |
| Pérdida cabecera LUKS | inaccesibilidad de datos | verificar existencia de backup seguro de cabecera y claves; escalado especializado |

En forense y respuesta, NIST SP 800-86 describe principios de identificación, adquisición, examen, análisis y presentación; **no** autoriza tocar sistemas ni sustituye políticas de custodia/privacidad locales. [DOC:F23]

## 11.2 El anti-patrón `fsck` universal

- ext2/3/4: `e2fsck` posee opciones de **solo examen**, por ejemplo `-n` para responder no y abrir de modo read-only en el contexto documentado; **no** ejecutar sobre un filesystem montado y mutable esperando resultados fiables. Para recuperación real, primero evaluar medios, imagen y procedimiento oficial. [DOC:F30]
- XFS: `xfs_repair -n` permite examen no mutante sobre FS desmontado; `fsck.xfs` no es una prueba de salud. `xfs_repair -L` **borra log** y puede causar pérdida de metadatos: queda expresamente fuera del laboratorio. [DOC:F08]
- Btrfs: `btrfs check --readonly` como lectura estructural en copia/volumen apropiado; **`--repair` solo bajo guía experta y backup**. `scrub` es validación de checksums y posibles reparaciones sobre réplicas válidas, no fsck universal. [DOC:F09–F10]
- LUKS: nada de `luksFormat`, `luksHeaderRestore` o pruebas improvisadas contra el disco fuente. Recuperación de claves y cabeceras bajo supervisión.

**Interpretación SOC:** mensajes del kernel como `Buffer I/O error`, `EXT4-fs warning/error`, `XFS ... metadata CRC`, `BTRFS ... checksum` son evidencia técnica, **no** prueba de sabotaje. Se necesitan secuencias temporales, acceso, telemetría de proceso, cambios de permisos y contexto de disco/aplicación.

## 11.3 Procedimiento seguro de simulación

En laboratorio, crea un archivo imagen, colócale un FS **solo dentro de ese archivo**, y desmóntalo antes del chequeo. **Jamás** copies el ejemplo sustituyendo la ruta por `/dev/sda`, `/dev/nvme0n1` o una partición real. Preferimos `mkfs.ext4 -F /ruta/archivo.img` solo con ruta creada por el ejercicio; no es seguro contra una variable equivocada. Por eso el catálogo usa validación explícita de ruta y un preflight.

```bash
# Ejemplo aislado sin montaje ni root; mkfs.ext4 soporta archivo regular con -F.
LAB="$(mktemp -d -t linux-t3-fs-XXXXXX)"
IMG="$LAB/ext4-lab.img"
truncate -s 96M -- "$IMG"
case "$IMG" in "$LAB"/*) :;; *) printf 'Ruta fuera de LAB\n' >&2; exit 1;; esac
[ -f "$IMG" ] && [ ! -L "$IMG" ] || exit 1
mkfs.ext4 -F -q -- "$IMG"        # CREA FS SOLO EN EL FICHERO TEMPORAL
# La imagen está desmontada; examinar sin modificar:
e2fsck -fn "$IMG" || test "$?" -eq 1
# 0 = sin errores; 1 indica correcciones realizadas en ejecución normal,
# PERO aquí -n no corrige: tratar otros códigos / hallazgos en informe.
```

**Límite:** `e2fsck` puede devolver estado distinto según condiciones y herramientas; la línea de ejemplo tolera `1` para mostrar el patrón, **pero un laboratorio bien evaluado registra el código original** (véase catálogo). Si no hay herramientas instaladas, registrar *skipped* con causa y seguir un escenario conceptual; no descargar binarios desconocidos.

# 12. SOC/DFIR: preservar antes de intervenir

## 12.1 Triada de evidencia y confianza

1. **Estado actual**: montajes, rutas, propietarios, ACL/xattrs, hashes, espacio, inodos, procesos con archivos abiertos, mapeadores y alertas. Cambiante por definición.
2. **Historia**: logs de sistema/servicio, auditoría local si estaba habilitada, logs de backup y cloud/control plane, inventario de cambios y tickets. No asumir existencia o integridad.
3. **Comparación confiable**: baseline firmado/controlado fuera del host, snapshots anteriores, backups de solo lectura, inventario de paquetes, datos de almacenamiento. El baseline pudo estar comprometido si se generó tras intrusión.

Las salidas de `stat`, `findmnt` o `sha256sum` muestran observaciones, pero **no** acreditan quién efectuó el cambio. `atime` y marcas de tiempo pueden no ser fiables; un historial de journal circular o incompleto no demuestra que algo nunca ocurrió. La investigación avanzada de journald/rsyslog/auditd/EDR se reserva a la siguiente tanda de telemetría del itinerario; aquí se indican fuentes relacionadas, no promesas de cobertura.

## 12.2 Modelo mínimo de cadena de custodia

| Campo | Ejemplo ficticio | Interpretación |
|---|---|---|
| Case ID | `LAB-T3-IR-001` | relación con autorización/ticket |
| Host / fuente | `vm-lab01`, imagen `disk-lab.img` | identidad verificada, no suposición |
| Hora UTC | `2026-10-18T10:00:00Z` | registrar offset y sincronización |
| Operador / herramienta | usuario, versión, comando y parámetros | reproducibilidad |
| Tipo de adquisición | copia de fichero, snapshot, imagen offline | límites de completitud |
| Hash | SHA-256 de artefacto resultante | integridad durante transmisión, no verdad histórica |
| Custodia / acceso | ubicación, responsables, movimientos | integridad procedimental |
| Impacto | accesos a datos, procesos detenidos, modificaciones | transparencia y legalidad |

**Orden de actuación:** incident response puede requerir detener una acción destructiva con prioridad sobre adquisición exhaustiva; registrar el compromiso entre disponibilidad y preservación. No aplicar una «jerarquía de volatilidad» de forma mecánica sin valorar riesgo y política.

# 13. Detecciones SOC: hipótesis, señal, confirmación y límites

Las siguientes son **ideas de detección condicionadas a fuentes reales**. No son reglas listas para un SIEM; los nombres exactos de campos y eventos dependen de auditd, EDR, eBPF, syslog, cloud, versión y configuración. **No afirmar cobertura por el mero hecho de tener Linux.**

| ID | Hipótesis | Señal mínima sugerida | Confirmación / falsos positivos | ATT&CK |
|---|---|---|---|---|
| D3-01 | borrado de datos críticos fuera de ventana | EDR/auditd de escritura/unlink + ruta y usuario | mantenimiento planificado, rotación, proceso legítimo | T1485 / T1070.004 |
| D3-02 | eliminación o degradación de backups | eventos de repositorio/retención + cuenta + cambio inusual | limpieza autorizada, expiración conocida | T1490 |
| D3-03 | alteración de ficheros de negocio | FIM/cambio inesperado + proceso/identidad | actualizaciones, flujos ETL normales | T1565.001 |
| D3-04 | aparición de montaje externo o sustitución de ruta | mountinfo/cambios de config + origen/ruta | operación de sistema/VM/containers legítima | Contextual; no mapear una técnica por sí sola |
| D3-05 | remount RO o corrupción de FS | mensajes kernel + métricas de I/O | hardware, fallo cloud, apagón, bug | No atribuir ATT&CK por solo síntoma |
| D3-06 | fallo de backup silencioso | último éxito / tamaño / `check` / restore test fuera de umbral | cambios de horario, exclusiones, red, cuota | Control de resiliencia, no conducta atacante por defecto |
| D3-07 | acceso no autorizado a cabeceras LUKS o claves backup | acceso controlado a secretos + identidad + ruta | backup aprobado/rotación, mantenimiento | Depende de objetivo y telemetría |
| D3-08 | cuota/inodos/espacio anómalos por creación masiva | tasa de creación + consumo + proceso + baseline | indexadores, ETL, builds, contenedores | Condicional, análisis de impacto |

MITRE documenta separadamente **T1485 Data Destruction**, **T1490 Inhibit System Recovery**, **T1565.001 Stored Data Manipulation** y **T1070.004 File Deletion**. Un cambio benigno de configuración **no** basta para etiquetar la técnica. [DOC:F24–F27]

### 13.1 Ejemplo de lógica expresada sin atarla a un producto

```text
IF protected_path_changed AND not approved_change_window
   AND actor_not_in_authorized_maintenance_set
THEN produce triage candidate
ADD process tree + account + host + pathname + event_time + mount context
ENRICH with change tickets + backup status + baseline hashes
DO NOT auto-delete files, auto-kill processes or auto-restore based only on this signal
```

**Prerequisitos reales:** sensor que observa la operación, granularidad de ruta, tiempo consistente, política de exclusiones, retención suficiente, acceso a ticket/change window. Auditd puede vigilar rutas seleccionadas, pero una regla mal dimensionada tiene carga operativa; **no** habilitar vigilancia masiva sin diseño de rendimiento. Una alerta basada en `mtime` no tiene el mismo valor que un registro confiable de proceso+syscall.

# 14. Red Team autorizado: evaluación de exposición del almacenamiento

El objetivo es **mostrar el riesgo sin destruir datos, deshabilitar defensas ni sabotear backups**. Para cada hallazgo: ruta o recurso explícitamente autorizado, permisos, identidad efectiva, supuesto impacto, evidencia inocua, recomendación y retest. No ampliar el alcance a volúmenes compartidos fuera de la autorización.

**Tareas legítimas de evaluación:**

- Inventariar volúmenes y montajes visibles al usuario de prueba (`lsblk`, `findmnt`, `stat`, `namei`).
- Verificar con `test -r`, `test -w`, `getfacl` si una identidad tiene acceso **previsto o indebido** a directorios de backup y configuración. No leer secretos ni copiar información de clientes para «demostrar» permiso.
- Evaluar si un repositorio de backup permite lectura, creación y **borrado** bajo la misma identidad, usando **permisos y políticas declaradas** o un objeto sintético con autorización explícita; nunca borrar snapshots reales.
- Identificar symlinks/bind mounts en rutas críticas que puedan conducir a directorios no previstos, documentando la cadena sin usarla para sobreescritura.
- Revisar aislamiento de claves LUKS, archivos de contraseña de backup, roles de operador y alarmas de borrado; no intentar exfiltrar las claves.
- Comprobar en laboratorio el comportamiento del sistema frente a un cambio benigno de fichero «canary» y medir si aparece en telemetría/FIM.

**No incluido en estos laboratorios:** ransomware, cifrado masivo, borrado indiscriminado, alteración real de snapshots o volúmenes de terceros, escalada de privilegios fuera del alcance ni mecanismos de evasión destructivos. Los procedimientos de enumeración/escalada se retomarán en la Tanda 5 en contexto de laboratorio.

## 14.1 Informe de hallazgo de ejemplo

> **RT-T3-01 — Directorio de repositorio con acceso de escritura excesivo (SIMULADO).** El rol `lab-operator`, inicialmente destinado a generar copias, puede crear y modificar objetos bajo `~/linux-t3-test/backups`, y el diseño de la política no distingue permisos de subida y borrado. **No se ha probado el borrado de snapshots de negocio.** Impacto potencial: una identidad comprometida podría reducir la recuperabilidad. Evidencia: ACL/mode, identidad, configuración de repositorio y una prueba sobre `canary.txt` sintético. Recomendación: destino off-host, separación de principal de escritura/retención, revisión de ACL y prueba de restauración. Retest: `lab-operator` puede **subir** conforme a política pero no eliminar versiones protegidas; se audita una denegación deliberada en recurso de laboratorio.

# 15. Laboratorios prácticos reproducibles (8 ejercicios, 100 puntos)

**Política para los ocho:** VM o sesión propia, rutas temporales bajo `$HOME` o `mktemp`, usuario no root para creación de datos. Nunca usar discos `/dev/sd*` ni NVMe reales como objetivos de escritura. Si una herramienta no existe, registrar prerequisito ausente y emplear ruta alternativa documental; eso no equivale a declarar prueba «superada». Las pruebas que usan `sudo` son **solo de observación autorizada**. Para cada laboratorio entregar: comandos exactos, salidas relevantes sin secretos, hipótesis, interpretación, límites, SHA-256 de evidencia si aplica, rollback y hora/versión.

## LAB-3.1 — Inventario de almacenamiento y montaje (10 pt, 35–50 min)

**Meta:** construir mapa capa→ruta en una VM, detectar un montaje diferente a lo esperado.

```bash
mkdir -p "$HOME/linux-t3-evidencia"
lsblk -o NAME,TYPE,SIZE,FSTYPE,UUID,MOUNTPOINTS > "$HOME/linux-t3-evidencia/lsblk.txt"
findmnt -o TARGET,SOURCE,FSTYPE,OPTIONS > "$HOME/linux-t3-evidencia/mounts.txt"
df -hT > "$HOME/linux-t3-evidencia/df.txt"
df -i > "$HOME/linux-t3-evidencia/inodes.txt"
sha256sum "$HOME"/linux-t3-evidencia/*.txt > "$HOME/linux-t3-evidencia/SHA256SUMS"
```

**Pruebas/criterio:** explica al menos dos rutas (`/`, `/tmp` o `/var`), diferencia SOURCE vs target y por qué la presencia de loop/overlay no es maliciosa. Marcar **no disponible** lo que no aparezca: no inventar VG/LUKS. Entrega `mapa-capacidad.md` y manifiesto.

## LAB-3.2 — Inodo, enlace, tiempos y evidencia (12 pt, 45–60 min)

```bash
LAB="$(mktemp -d -t linux-t3-inode-XXXXXX)"; printf '%s\n' "$LAB"
printf 'versión uno\n' > "$LAB/a.txt"
ln -- "$LAB/a.txt" "$LAB/a-hard.txt"
ln -s -- a.txt "$LAB/a-sym.txt"
stat -c '%n inode=%i device=%d links=%h mtime=%y ctime=%z' "$LAB"/*
sha256sum "$LAB/a.txt" "$LAB/a-hard.txt"
printf 'versión dos\n' >> "$LAB/a-hard.txt"
stat -c '%n inode=%i links=%h size=%s' "$LAB/a.txt" "$LAB/a-hard.txt"
readlink "$LAB/a-sym.txt"
```

**Prueba:** dos hard links comparten `(dev,inode)` y contenido; symlink **no** tiene por qué compartir inode. Explica por qué `ctime` no es creación y por qué el timestamp no atribuye usuario. **Rollback:** no ejecutar `rm -rf` sobre rutas no validadas; eliminar solo directorio exacto devuelto por `mktemp` tras comprobar contenido.

## LAB-3.3 — Agotamiento lógico: bloques, inodos y descriptores (12 pt, 40–60 min)

En un directorio sintético crea pequeños archivos, calcula `du`/`df` y **razona**, sin llenar el disco, cómo se manifestaría una cuota/inodos agotados. Para demostrar archivo borrado pero abierto usa un proceso de Python controlado y aislado (no root):

```bash
python3 - <<'PY'
import os, tempfile
fd, path = tempfile.mkstemp(prefix='linux-t3-unlinked-')
os.write(fd, b'canario\n')
print('before unlink:', path, 'inode', os.fstat(fd).st_ino)
os.unlink(path)
print('after unlink: exists?', os.path.exists(path), 'open fd bytes', os.fstat(fd).st_size)
os.close(fd)
print('fd closed; inode may now be reclaimable')
PY
```

**Prueba:** explica cómo puede existir un descriptor válido pese a eliminarse nombre y cuándo se recupera capacidad; no proyectar el volumen de unos bytes al fenómeno de GB en producción. Instrumentar `lsof` solo si está disponible, sin interferir con servicios.

## LAB-3.4 — Ext4 en imagen de archivo, comprobación offline (12 pt, 45–70 min)

Ejecuta **solamente** el patrón de la sección 11.3 y registra: ruta validada, tamaño, salida de `file`/`dumpe2fs -h` si existe, código de `e2fsck -fn`, interpretación. **Se prohíbe** crear filesystem sobre un dispositivo de bloque y **se prohíbe** corromper un medio real. Para desafío extra, explica por qué `e2fsck` de un FS montado puede no dar resultado consistente.

## LAB-3.5 — Copia `tar` + `rsync`, metadatos y restore aislado (12 pt, 50–70 min)

Construye `source` con dos archivos, hard link y symlink controlado. Ejecuta la sección 9.1 y un `rsync -aHAX --dry-run` hacia rutas bajo el mismo `$LAB`; luego copia sin `--delete`. Comparar `sha256sum`, `stat`, `getfacl`/xattrs según disponibilidad. Documenta cuáles atributos se conservaron y cuáles no **con pruebas**, no con suposiciones. Debes explicar barra final de rsync y el riesgo de `--delete`.

## LAB-3.6 — Restic: dos versiones y restauración de cada una (18 pt, 75–100 min)

Seguir la sección 9.3. Registra IDs de los dos snapshots, restaura el más reciente a destino aislado A y **uno anterior identificado** a destino aislado B; compara el contenido; ejecuta `restic check`. Bonus: verificar lectura de datos con `restic check --read-data` sobre repositorio pequeño y medir duración. La práctica **no** solicita `forget`, `prune` ni exponer contraseña. Aprobado solo con archivos restaurados y prueba de contenido para **ambas** versiones; listar snapshots no basta.

## LAB-3.7 — Triage SOC: corrupción, borrado, backup ausente (12 pt, 50–75 min)

**Caso sintético:** la aplicación no puede escribir y el disco aparentemente tiene espacio; el backup de las 02:00 no produjo snapshot, y aparece un cambio de configuración fuera de ventana. Plantea **tres hipótesis rivales**: cuota/inodos, error RO/I/O, fallo de autorización/conector de backup. Especifica fuentes para confirmar/refutar, grado de certeza y acciones que **no** harías (reinicio o reparación prematura, borrado de logs, restauración sobre evidencia). Matriz mínima de 8 pruebas con resultado esperado y vacío de cobertura.

## LAB-3.8 — Red Team autorizado y retest de controles de backup (12 pt, 45–60 min)

Bajo `$LAB`, crea árbol `data/`, `backup/`, `secret-mock/` (sin secretos reales). Configura permisos distintos para un usuario de prueba o, sin poder modificar cuentas, razona usando `stat`/`getfacl` y compara `test -r/-w` del usuario actual. Produce un hallazgo **solo si hay exposición realmente demostrada**; de lo contrario informa «no observado en alcance». Propón retest con canary, acceso mínimo y separación de borrado/creación. Nunca leer `secret-mock/` de otras cuentas ni borrar snapshots reales.

### 15.1 Matriz de puntuación

| Laboratorio | Puntos | Evidencia mínima |
|---|---:|---|
| 3.1 Inventario | 10 | mapa + comandos + interpretación |
| 3.2 Metadatos | 12 | inode/timestamps + explicación |
| 3.3 Espacio y unlink | 12 | prueba inofensiva + árbol diagnóstico |
| 3.4 FS offline | 12 | imagen temporal + chequeo y código de salida |
| 3.5 tar/rsync | 12 | copia restaurada + atributos |
| 3.6 restic | 18 | dos restores de versiones + check |
| 3.7 Triage SOC | 12 | hipótesis rivales + evidencia y vacíos |
| 3.8 Red Team/retest | 12 | hallazgo acotado y control validable |
| **Total** | **100** | **≥80 para aprobar; 3.6 y 3.7 obligatorios** |

# 16. Casos integradores de entrevista y operación

## Caso A — «`df` al 98 %, `du` al 34 %»

**Hipótesis:** archivos sin nombre abiertos por procesos, montajes que ocultan directorios, reservas de FS, deduplicación/COW/cuotas y errores de medición. **Recorrido:** `findmnt /var`, `df -hT /var`, `du -xhd1 /var`, `lsof +L1` con privilegios acordados, análisis de namespaces/servicios. **No hacer:** borrar al azar `/var/log` o reiniciar servicios sin entender qué archivo retienen. **Respuesta SOC:** documentar proceso afectado, capacidad recuperable, origen, justificación y estado anterior/posterior.

## Caso B — «Restic informó `backup successful` pero no se puede recuperar la BD»

**Hipótesis:** backup de archivos inconsistentes en caliente, clave ausente, snapshot equivocado, exclusión de DB, permisos restaurados incorrectos, corrupción de repositorio. **Prueba:** snapshot ID, `restic check` y, sobre todo, restore aislado y arranque de DB mediante método nativo. **Hallazgo:** éxito de transferencia no prueba consistencia de aplicación. Ajustar política de backup específico para motor y ensayo periódico.

## Caso C — «El atacante pudo borrar todas las copias locales»

**Hipótesis:** cuenta del servicio de backup poseía permisos de destrucción y repositorio estaba en el mismo dominio de administración. **Evaluación RT segura:** analizar ACL/roles y crear/borrar únicamente canary autorizado bajo raíz de pruebas. **Respuesta:** off-host con política de protección de borrado, identidades separadas, auditoría y alertas de cambios; validación mediante denegaciones controladas. ATT&CK T1490 solo si hay evidencia de acción adversaria. [DOC:F24]

## Caso D — «XFS acusa corrupción tras reinicio brusco»

**Hipótesis:** log sucio, daño estructural, backend defectuoso, fallo de virtualización. **Prueba:** preservar mensajes/estado y consultar procedimiento XFS; evaluación con imagen o copia; `xfs_repair -n` desmontado cuando proceda. **No hacer:** `xfs_repair -L` automático; puede descartar transacciones y provocar pérdida. [DOC:F08]

## Caso E — «Un archivo borrado sigue viéndose dentro del contenedor»

**Hipótesis:** otro namespace, otro montaje o capa de overlay distinta, no necessarily malware. **Prueba:** PID real y `/proc/PID/mountinfo`, identificación del FS, layers y descriptores. **No hacer:** concluir persistencia ofensiva sin revisar semántica de overlay/copy-up/whiteout. [DOC:F13]

# 17. Preguntas de evaluación (30) y guía de corrección

1. ¿Por qué `/dev/sda` no es identidad persistente?
2. ¿Diferencias entre UUID de filesystem y PARTUUID?
3. ¿Qué aporta `findmnt` frente a `lsblk`?
4. ¿Qué significa tener dos mount namespaces?
5. ¿Por qué no concluye «disco libre» solo `df -h`?
6. ¿Qué produce un `ENOSPC` aun con bloques disponibles?
7. ¿Qué diferencia hay entre hard link y symlink?
8. ¿Qué guarda un inode y qué no guarda?
9. ¿Por qué `ctime` no es creación?
10. ¿Por qué puede existir un archivo desvinculado con un descriptor abierto?
11. ¿Qué conserva SHA-256 y qué no conserva del estado?
12. ¿Cómo se diferencia un snapshot de un backup?
13. ¿Por qué RAID1 no protege contra borrado malicioso?
14. ¿Qué cubre el journal ext4 por defecto?
15. ¿Cuál es el papel de `fsync` ante cortes de energía?
16. ¿Por qué `fsck.xfs` no basta para certificar integridad?
17. ¿Cuándo `btrfs scrub` puede reparar y cuándo no?
18. ¿Qué implica `NOCOW/NODATASUM` para integridad?
19. ¿Cómo afecta un whiteout de overlayfs a la interpretación de «borrado»?
20. ¿Qué aporta y qué NO aporta LUKS a un host arrancado y desbloqueado?
21. ¿Por qué proteger copias de cabecera LUKS como secretos críticos?
22. ¿Qué opciones de `rsync` NO están en `-a`?
23. ¿Por qué `--delete` debe restringirse especialmente?
24. ¿Por qué `restic check` a secas no prueba el contenido de todos los bloques?
25. ¿Por qué dos snapshots visibles no bastan para afirmar restaurabilidad?
26. ¿Qué distingue `RPO` de `RTO`?
27. ¿Por qué una copia caliente de base de datos puede no restaurar?
28. ¿Qué tres fuentes mínimas usarías para atribuir borrado?
29. ¿Qué se pierde al «arreglar» un filesystem antes de preservar estado?
30. ¿Cuál es el criterio de aceptación de un retest de permisos en backups?

**Clave de corrección abreviada:**

1. Renumeración y topología; preferir identificadores verificados. 2. Identidad de filesystem vs tabla de particiones. 3. Mounts efectivos vs dispositivos. 4. Rutas/montajes visibles por proceso distintos. 5. No muestra inodos/cuotas/ficheros abiertos/bloque reservado. 6. Inodos, cuota, thin pool, límites según FS. 7. Mismo inode vs archivo ruta. 8. Metadatos y punteros, no ruta completa. 9. Cambio del inode. 10. Link count puede ser 0 sin cerrar FD. 11. Contenido exacto medido, no ACL/historia/autor. 12. Copia independiente recuperable vs referencia del mismo FS/volumen. 13. Replicación del borrado. 14. Fundamentalmente metadatos en `data=ordered` habitual. 15. Solicita persistencia explícita, según garantías dispositivo/FS. 16. Stub; herramienta adecuada es XFS de chequeo/reparación. 17. Réplica buena + checksums, no daño general. 18. Datos NODATASUM no verificados por checksum. 19. Oculta archivo lower en capa merged. 20. Confidencialidad en reposo, no controla procesos con volumen abierto. 21. Conserva material de cabecera/keyslots y riesgo asociado a passphrase histórica. 22. `-H -A -X`. 23. Sincroniza borrados en destino. 24. Verificación estructural != lectura total, usar `--read-data` y restore. 25. Deben probarse restores y contenido. 26. Pérdida temporal vs tiempo de recuperación. 27. Inconsistencia de transacciones/páginas. 28. evento de archivo/proceso, identidad/cambio aprobado, baseline/backup independientes. 29. Metadatos, tiempos, logs, bloques y contexto. 30. Roles con solo privilegio requerido, prueba canary y evento registrado.

# 18. Plantilla de entrega SOC + Red Team

```text
CASO:                  LAB-T3-...
SISTEMA / FS:          distro, kernel, tipo FS, capas de montaje
AUTORIZACIÓN:          ticket, rango, identidad, fecha
RIESGO PRINCIPAL:      confidencialidad | integridad | disponibilidad
BASELINE:              qué sabemos antes del cambio y cómo lo verificamos
OBSERVACIONES:         evidencia directa, horas UTC, herramientas/versiones
HIPÓTESIS ALTERNATIVAS: 2 o más causas compatibles
LÍMITES:               ausencia de auditd, cambios de namespace, permisos, etc.
IMPACTO:               demostrado / potencial / desconocido
ACCIONES:              preservación, contención, backup, restore, controles
RETEST:                comportamiento reproducible y criterios de aprobación
HASHES/CUSTODIA:       manifiestos y responsables
RESULTADO FINAL:       confirmado, refutado, no concluyente, no evaluado
```

# 19. Guía rápida de decisiones

```text
No puedes escribir
├── EROFS → hallar por qué FS es RO; preservar I/O/journal; no remount RW a ciegas
├── EDQUOT → cuota; comprobar usuario/grupo/proyecto y política
├── ENOSPC → df bloques/inodos + LVM thin + archivos sin link + mount context
├── EACCES/EPERM → permisos, ACL, políticas MAC y servicio (Tanda 4/5)
└── EIO/ESTALE → capa bloque/red/FS, evidencia y escalado especializado

Datos desaparecieron
├── ¿Ruta y namespace correctos? → findmnt + mountinfo
├── ¿Symlink/bind/overlay? → comprobar origen / lower / upper
├── ¿Borrado lógico? → fuentes de proceso/audit si disponibles y backup histórico
└── ¿Cifrado/corrupción? → preservar antes de reparar, verificar estado preincidente

Backup existe pero no sirve
├── Claves y credenciales recuperables por flujo autorizado
├── Versión correcta preincidente
├── Estructura/datos verificables + restore aislado
├── Metadatos y consistencia aplicación
└── Tiempo RTO y pérdida RPO realmente medidos
```

# 20. Fuentes primarias y documentación consultada

Las referencias `[DOC:Fnn]` señalan documentación oficial o textos normativos de sus autores/organizaciones. **Ninguna fuente única sustituye** la página de manual del binario exacto instalado en la VM. En especial, NIST SP 800-86 (2006) es una referencia de procedimiento, no una afirmación de vigencia de todo detalle técnico en 2026.

- **F01 — util-linux `lsblk(8)`**: <https://man7.org/linux/man-pages/man8/lsblk.8.html>
- **F02 — util-linux `findmnt(8)`**: <https://man7.org/linux/man-pages/man8/findmnt.8.html>
- **F03 — util-linux `fstab(5)`**: <https://man7.org/linux/man-pages/man5/fstab.5.html>
- **F04 — util-linux `mount(8)`**: <https://man7.org/linux/man-pages/man8/mount.8.html>
- **F05 — Linux `stat(2)` y semántica de metadatos**: <https://man7.org/linux/man-pages/man2/stat.2.html>
- **F06 — GNU coreutils, manual `stat`**: <https://www.gnu.org/software/coreutils/manual/html_node/stat-invocation.html>
- **F07 — kernel Linux: administración ext4 y modos de journal**: <https://cdn.kernel.org/doc/html/latest/admin-guide/ext4.html>
- **F08 — Red Hat Enterprise Linux 9: checking/repairing ext y XFS**: <https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/checking-and-repairing-a-file-system__managing-file-systems>
- **F09 — Btrfs: `btrfs scrub`**: <https://btrfs.readthedocs.io/en/latest/btrfs-scrub.html>
- **F10 — Btrfs: `btrfs check` y advertencias**: <https://btrfs.readthedocs.io/en/latest/btrfs-check.html>
- **F11 — Btrfs: subvolúmenes y snapshots**: <https://btrfs.readthedocs.io/en/latest/btrfs-subvolume.html>
- **F12 — Btrfs: `send` y replicación**: <https://btrfs.readthedocs.io/en/latest/btrfs-send.html>
- **F13 — Linux kernel: OverlayFS, copy-up, whiteouts y permisos**: <https://docs.kernel.org/filesystems/overlayfs.html>
- **F14 — util-linux `mount(8)`: `nodev/nosuid/noexec`**: <https://man7.org/linux/man-pages/man8/mount.8.html>
- **F15 — Red Hat Enterprise Linux 9: LVM y snapshots**: <https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_managing_logical_volumes/advanced-logical-volume-management_configuring-and-managing-logical-volumes>
- **F16 — kernel Linux: dm-crypt**: <https://docs.kernel.org/admin-guide/device-mapper/dm-crypt.html>
- **F17 — cryptsetup `luksHeaderBackup(8)`**: <https://man7.org/linux/man-pages/man8/cryptsetup-luksheaderbackup.8.html>
- **F18 — restic: backing up**: <https://restic.readthedocs.io/en/stable/040_backup.html>
- **F19 — restic: restoring from backup**: <https://restic.readthedocs.io/en/stable/050_restore.html>
- **F20 — restic: working with repositories, `check`**: <https://restic.readthedocs.io/en/stable/045_working_with_repos.html>
- **F21 — restic: forget, prune y retención**: <https://restic.readthedocs.io/en/stable/060_forget.html>
- **F22 — GNU tar manual, backups e incrementales**: <https://www.gnu.org/software/tar/manual/tar.html>
- **F23 — NIST SP 800-86, Guide to Integrating Forensic Techniques into Incident Response (2006)**: <https://csrc.nist.gov/pubs/sp/800/86/final>
- **F24 — MITRE ATT&CK, T1490 Inhibit System Recovery**: <https://attack.mitre.org/techniques/T1490/>
- **F25 — MITRE ATT&CK, T1485 Data Destruction**: <https://attack.mitre.org/techniques/T1485/>
- **F26 — MITRE ATT&CK, T1565.001 Stored Data Manipulation**: <https://attack.mitre.org/techniques/T1565/001/>
- **F27 — MITRE ATT&CK, T1070.004 File Deletion**: <https://attack.mitre.org/techniques/T1070/004/>
- **F28 — rsync: manual oficial y modelo de seguridad**: <https://download.samba.org/pub/rsync/rsync.1>
- **F29 — Btrfs: comprobación y recuperación**: <https://btrfs.readthedocs.io/en/latest/btrfs-check.html>
- **F30 — e2fsprogs: `e2fsck(8)`**: <https://man7.org/linux/man-pages/man8/e2fsck.8.html>
- **F31 — util-linux: `losetup(8)` y riesgos de loop**: <https://man7.org/linux/man-pages/man8/losetup.8.html>
- **F32 — kernel Linux: fs-verity (integridad por archivo, distinta de backup)**: <https://docs.kernel.org/filesystems/fsverity.html>

# 21. Limitaciones, exclusiones y continuación

- La investigación se apoya en documentación de herramientas upstream; **no se ha comprobado el hardware ni configuraciones de tu Parrot OS**. Comandos de ejemplo pueden requerir instalar paquetes o permisos extra.
- Los procedimientos `tar`, `rsync`, `restic` y `e2fsck` son **lab sintético** y requieren ejecución para poder afirmar resultados; no se asignan éxitos ficticios.
- No son ejercicios de respuesta a incidentes en producción. La cadena de custodia y privacidad exige políticas y aprobación del entorno concreto.
- *No* se ha desarrollado aún el componente completo de redes/SSH/firewalls, PAM/SELinux/AppArmor, auditd/journald ni contenedores más allá de su intersección con almacenamiento.
- **Siguiente tanda (4/5):** redes del host, SSH, firewalls, control de acceso/hardening y sus evidencias defensivas según el reparto convenido; Tanda 5 consolidará SOC, telemetría, automatización, Red Team y evaluación. La secuencia puede ajustarse para respetar los 11 temas originales sin dejar bloques fuera.

**Criterio final:** si puedes entregar `restore` real comprobado en un destino aislado, explicar las garantías exactas de cada capa y diferenciar observación, inferencia y prueba, has aprendido almacenamiento Linux como lo requiere un equipo SOC o una revisión Red Team; una lista de comandos por sí sola no basta.
