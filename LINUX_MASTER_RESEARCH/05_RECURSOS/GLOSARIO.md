# Glosario de Linux

Términos de consulta. No hace falta memorizarlos antes de resolver una lección.

## Kernel, shell y capas

- **Kernel**: núcleo del sistema; administra memoria, procesos, ficheros, dispositivos y red.
- **Espacio de usuario**: conjunto de programas que no acceden al hardware ni a la memoria del kernel de forma directa.
- **Llamada al sistema (syscall)**: petición formal de un programa al kernel para obtener un servicio.
- **Shell**: intérprete de comandos; es un programa que lee lo que escribes y lanza otros programas.
- **Distribución**: conjunto de kernel, herramientas y gestor de paquetes empaquetado por un proyecto.
- **`/proc`**: sistema de ficheros virtual que expone procesos y estado del kernel como si fueran archivos.
- **`/sys`**: sistema de ficheros virtual que describe dispositivos y parámetros del kernel.
- **Estándar de jerarquía (FHS)**: convención que ordena qué se guarda en cada directorio del sistema.
- **`man`**: páginas de manual del sistema; documentación de referencia de comandos y llamadas.

## Sistema de archivos y metadatos

- **Ruta absoluta**: camino que parte de la raíz `/` y no depende del directorio actual.
- **Inodo (inode)**: estructura que guarda metadatos de un archivo: permisos, propietario, tamaño y bloques.
- **Metadato**: dato sobre un archivo que no es su contenido: fechas, permisos, enlaces y tipo.
- **Enlace duro**: nombre adicional que apunta al mismo inodo.
- **Enlace simbólico**: archivo especial que contiene la ruta hacia otro destino.
- **Punto de montaje**: directorio donde un sistema de ficheros se incorpora al árbol visible.
- **Sistema de archivos**: formato con el que se organizan los datos en un dispositivo (ext4, XFS, Btrfs).
- **`/etc`**: directorio de configuración del sistema y de los servicios.
- **`/var`**: directorio de datos variables como registros, colas y cachés.
- **Propietario**: identidad a la que pertenece un archivo y que puede cambiar sus permisos.

## Herramientas y flujos

- **Entrada estándar (stdin)**: canal de datos que un programa lee por defecto.
- **Salida estándar (stdout)**: canal de datos que un programa escribe como resultado normal.
- **Error estándar (stderr)**: canal separado donde un programa escribe sus mensajes de error.
- **Tubería (pipe)**: conexión que envía la salida de un programa a la entrada del siguiente.
- **Redirección**: desvío de un canal hacia un archivo o dispositivo.
- **Filtro**: programa que lee de la entrada, transforma y escribe en la salida (`grep`, `sort`, `awk`).
- **`find`**: herramienta que recorre el árbol de directorios según criterios dados.
- **`tar`**: herramienta que empaqueta y extrae colecciones de archivos en un solo contenedor.
- **Gestor de paquetes**: herramienta que instala, actualiza y retira software de la distribución.
- **Código de salida**: número que devuelve un programa al terminar para indicar si tuvo éxito.

## Identidades y permisos

- **Usuario**: identidad que ejecuta procesos y a la que pertenecen archivos y derechos.
- **UID**: número que identifica de forma interna a un usuario.
- **GID**: número que identifica de forma interna a un grupo.
- **Grupo**: conjunto de usuarios al que se pueden conceder permisos en común.
- **Cuenta de sistema**: cuenta reservada a servicios, sin inicio de sesión interactivo.
- **Autenticación**: comprobación de que una identidad es quien dice ser.
- **Autorización**: decisión sobre qué puede hacer una identidad ya autenticada.
- **`sudo`**: mecanismo para ejecutar comandos con los privilegios de otra identidad.
- **Usuario real y efectivo**: identidad de origen del proceso y la que el kernel usa para autorizar.
- **`umask`**: máscara que decide qué permisos no se conceden al crear archivos.

## Procesos y señales

- **Proceso**: programa en ejecución, con identidad, memoria y estado propios.
- **PID**: número que identifica a un proceso mientras está vivo.
- **PID padre (PPID)**: número del proceso que creó al proceso actual.
- **Proceso huérfano**: proceso cuyo padre terminó antes que él.
- **Proceso demonio (daemon)**: proceso en segundo plano que presta un servicio continuo.
- **Estado del proceso**: situación en que se encuentra (en ejecución, dormido, detenido, zombi).
- **Señal**: aviso corto que el kernel entrega a un proceso para indicarle algo.
- **SIGTERM**: señal que pide a un proceso terminar de forma ordenada.
- **SIGKILL**: señal que termina un proceso de inmediato, sin que pueda limpiar recursos.
- **`ps` / `top`**: herramientas que muestran los procesos activos y su consumo.

## Bash y scripting

- **Script**: archivo de texto con comandos que se ejecutan en secuencia.
- **Intérprete (shebang)**: primera línea que declara con qué programa ejecutar un script.
- **Variable**: nombre que guarda un valor dentro de la sesión o del script.
- **PATH**: variable que indica en qué directorios se buscan los comandos.
- **Comodín (glob)**: patrón como `*` o `?` que la shell expande a nombres de archivos.
- **Condicional (`if`)**: estructura que ejecuta un bloque solo si se cumple una prueba.
- **Bucle (`for` / `while`)**: estructura que repite un bloque sobre varios valores o mientras se cumpla una condición.
- **Función**: bloque de comandos con nombre que se puede invocar varias veces.
- **Argumento posicional**: valor pasado a un script (`$1`, `$2`) y accesible por su posición.
- **Ejecución en seco (dry-run)**: mostrar el efecto previsto sin aplicarlo.

## Arranque y firmware

- **Firmware**: software inicial del equipo (BIOS o UEFI) que prepara el hardware y elige de dónde arrancar.
- **Cargador de arranque**: programa que selecciona la entrada, pasa parámetros y entrega el control al kernel.
- **initramfs**: sistema de archivos inicial en memoria que prepara el acceso a la raíz real antes de montarla.
- **PID 1**: primer proceso de usuario del sistema final; origen de las unidades en un sistema con systemd.
- **Target**: unidad que agrupa y sincroniza un estado deseado del sistema.
- **Secure Boot**: verificación de las etapas de arranque según las claves y la política del firmware.
- **Reconocimiento de solo lectura**: consulta que observa el estado sin alterar configuración ni arranque.
- **`/proc/cmdline`**: parámetros con los que el kernel arrancó; se leen, no se editan.
- **`root=`**: parámetro que pide una raíz concreta; no demuestra cuál se montó al final.
- **Montaje efectivo**: raíz realmente montada, que se contrasta con la solicitada.
- **Operación mutante**: acción que puede cambiar la próxima entrada de arranque.
- **Hipótesis diferencial**: explicación que se distingue de otras mediante una comprobación concreta.
- **Comprobación no disruptiva**: lectura que descarta hipótesis sin cambiar el estado del sistema.
- **Cadena temporal**: orden temporal entre unidades durante el arranque, con sus límites de precisión.
- **Unidad fallida**: unidad que terminó en estado de fallo; puede no ser la causa raíz.
- **Cobertura**: qué hechos quedan registrados; lo no cubierto es una brecha, no una prueba.
- **Retención de registros**: conservación de los registros; su ausencia explica «no veo nada».

## systemd y unidades

- **systemd**: gestor de unidades; suele ser PID 1 y también puede gestionar unidades de usuario.
- **`systemctl`**: cliente que consulta y controla unidades hablando con el gestor.
- **Unidad**: recurso con definición y estado (`.service`, `.socket`, `.timer`, `.path`, …).
- **D-Bus**: bus de mensajes por el que el cliente se comunica con el gestor.
- **Scope**: unidad que agrupa procesos creados fuera de la secuencia normal de unidades.
- **LoadState**: indica si el gestor pudo localizar e interpretar la definición de la unidad.
- **ActiveState**: actividad actual de la unidad (activa, inactiva, en fallo).
- **SubState**: matiz concreto dentro del estado de actividad.
- **UnitFileState**: estado de habilitación según los enlaces de instalación.
- **Habilitación**: preparación para un disparo futuro; no implica ejecución presente.
- **`start` / `stop`**: cambian el estado de actividad ahora, sin tocar la habilitación.
- **`enable` / `disable`**: crean o retiran enlaces de habilitación para el siguiente arranque.
- **`mask`**: impide la activación normal del nombre; no detiene un proceso ya activo.
- **`reload`**: pide al servicio releer su configuración, si lo soporta.
- **`daemon-reload`**: PID 1 relee unidades y generadores; no reinicia servicios.
- **`reset-failed`**: limpia estados y contadores de fallo, sin corregir la causa.
- **Fragmento**: archivo que aporta directivas a la definición de una unidad.
- **Drop-in**: fragmento en `unidad.service.d/` que añade o sobrescribe sin sustituir el archivo base.
- **Ruta de unidad**: ubicación donde systemd busca definiciones, con distinta precedencia.
- **Generador**: programa que escribe unidades efímeras al arrancar o al recargar.
- **Unidad transitoria**: unidad creada al vuelo, sin archivo persistente.
- **Definición efectiva**: archivo base más los drop-ins realmente aplicados a la unidad.
- **Precedencia**: regla que resuelve qué fragmento gana al definir una directiva.
- **Definición en disco**: lo que dicen los archivos de unidad en este momento.
- **Definición cargada**: lo que el gestor tiene cargado y aplica.
- **Desincronización**: diferencia entre disco y gestor hasta que se recarga.
- **Activación por socket**: el gestor escucha y arranca el servicio cuando llega demanda.
- **Timer**: unidad que programa la activación de otra, por defecto la `.service` homónima.
- **Reloj real frente a monotónico**: calendario de hora real frente a cuenta relativa a un evento.
- **`Persistent`**: opción de calendario que permite recuperar activaciones perdidas con el sistema apagado.
- **`.path`**: unidad que activa otra cuando se cumple una condición sobre una ruta.
- **Gestor de sistema frente a gestor de usuario**: instancias distintas que administran unidades distintas.
- **`Linger`**: permite al gestor de usuario continuar activo sin una sesión interactiva.

## Paquetes y hardening

- **Paquete**: unidad instalable con metadatos y contenido propio.
- **Repositorio**: origen de paquetes y metadatos firmados según una política.
- **`apt-secure`**: validación de firmas de metadatos de repositorio y de los hashes asociados.
- **`dpkg-query`**: consulta de propiedad y versión de archivos en la base local de dpkg.
- **`rpm -V`**: verificación de atributos de archivos contra la base local de RPM.
- **Transacción**: operación del gestor registrada en un historial (por ejemplo, `dnf history`).
- **pacman**: gestor de paquetes de Arch y derivados.
- **`-Qo` / `-Qkk` / `-Qm`**: consultas de pacman: qué paquete posee una ruta, verificación amplia de archivos y paquetes ausentes de los repositorios.
- **Actualización parcial**: sincronizar bases sin actualizar el sistema de forma coherente.
- **Cadena de suministro**: origen y verificación de los artefactos desplegados en el host.
- **Endurecimiento**: reducir privilegio y exposición de una unidad sin romper su función.
- **`NoNewPrivileges`**: impide adquirir privilegios nuevos, sin retirar los ya concedidos.
- **`CapabilityBoundingSet`**: recorte del conjunto de capacidades que puede usar el proceso.
- **Puntuación heurística**: valor comparativo de exposición de configuración; no es una prueba de seguridad.
- **Ventana de parcheo**: periodo aprobado para aplicar cambios con verificación y retorno.
- **Reinicio pendiente**: cambio aplicado que aún no surte efecto en el proceso o kernel en ejecución.

## Almacenamiento y capas

- **Capa de almacenamiento**: cada nivel del camino entre el dato y el medio (bloque, mapeador, sistema de archivos, montaje).
- **Mapeador**: capa que presenta un dispositivo virtual sobre otros (RAID, LUKS, LVM).
- **VFS**: abstracción del kernel que ofrece operaciones comunes sobre distintos sistemas de archivos.
- **Montaje**: asociación de un sistema de archivos con un punto de la jerarquía de rutas.
- **Selector persistente**: referencia estable a un volumen (`UUID=`, `PARTUUID=`, `by-id`) frente al nombre cambiante de dispositivo.
- **Namespace de montaje**: vista de la tabla de montajes propia de un conjunto de procesos.
- **Consulta de solo lectura**: comando que observa estado sin modificarlo.
- **Mutación**: operación que altera dispositivos, montajes o datos (montar, crear, reparar).
- **`lsblk`**: inventario de dispositivos de bloque y sus relaciones.
- **`findmnt`**: explicación del montaje efectivo de una ruta y su origen.
- **Divergencia `df`/`du`**: diferencia de medición entre bloques del sistema de archivos y contenido accesible.
- **Triaje**: clasificación ordenada de un fallo antes de intervenir.
- **`ENOSPC`**: error de falta de espacio, que puede ser de bloques o de inodos.
- **`EDQUOT`**: error de cuota de disco agotada, distinto de la falta de espacio.
- **`EROFS`**: error por sistema de archivos montado o degradado a solo lectura.

## Sistemas de archivos, metadatos y cifrado

- **ACL**: lista de control de acceso, permisos adicionales al modo clásico.
- **xattr**: atributo extendido asociado al archivo (etiquetas, capacidades, integridad).
- **Hard link**: segundo nombre que comparte el mismo objeto o inodo.
- **`--numeric-owner`**: opción de `tar` que conserva identificadores numéricos de propietario y grupo.
- **Fichero disperso**: archivo cuyo tamaño lógico supera los bloques realmente asignados.
- **`mtime`**: marca de última modificación del contenido.
- **`ctime`**: marca de último cambio de estado del inodo; no es la fecha de creación.
- **Descriptor abierto**: referencia que mantiene vivo un objeto aunque se retire su nombre.
- **Bloque**: unidad de asignación de datos en el sistema de archivos.
- **Cuota**: límite de uso de espacio o inodos para una identidad o grupo.
- **Reclaim de espacio**: recuperación de capacidad al cerrar el último descriptor o liberar referencias.
- **Journal**: región del sistema de archivos donde se anotan cambios para recuperar consistencia.
- **`data=ordered`**: modo que cubre metadatos y ordena datos antes de ciertos metadatos.
- **Consistencia estructural**: coherencia de la estructura del sistema de archivos, no del contenido exacto.
- **Remontaje a solo lectura**: paso a modo `ro` tras detectar un fallo, para evitar más daño.
- **Checksum de metadatos**: suma que permite detectar corrupción en estructuras del sistema de archivos.
- **Chequeo de examen**: comprobación de solo lectura que informa sin reparar.
- **COW (copia en escritura)**: técnica que escribe datos nuevos en lugar de sobrescribir los existentes.
- **`scrub` (Btrfs)**: verificación de bloques con suma de comprobación y posible reparación desde réplicas.
- **Chequeo estructural**: examen de la coherencia del sistema de archivos, distinto de la verificación de bloques.
- **Subvolumen**: división administrable dentro de un Btrfs, base de los snapshots.
- **Snapshot lógico**: referencia a un estado de datos que comparte bloques con su origen.
- **NOCOW**: modo que desactiva la copia en escritura y suele desactivar también la suma de datos.
- **overlayfs**: sistema de archivos que combina capas en una vista única.
- **Capa superior (upper)**: capa de escritura que tiene prioridad en la vista combinada.
- **Capa inferior (lower)**: capa normalmente de solo lectura, compartida por varias instancias.
- **Copy-up**: copia de un archivo de la capa inferior a la superior al modificarlo.
- **Whiteout**: marca que oculta un archivo inferior sin destruirlo.
- **fs-verity**: integridad por archivo basada en verificación criptográfica, distinta de un respaldo.
- **PV (volumen físico)**: almacenamiento bajo control de LVM, normalmente una partición o mapeo.
- **VG (grupo de volúmenes)**: depósito común de capacidad formado por uno o varios PV.
- **LV (volumen lógico)**: porción del VG que se presenta al sistema de archivos.
- **Thin pool**: depósito que reparte capacidad de forma diferida y admite sobreaprovisionamiento.
- **Snapshot LVM**: captura lógica dependiente del origen y de un área de escritura diferencial.
- **Área COW**: región donde el snapshot registra los cambios respecto al origen.
- **RAID**: combinación de discos para tolerancia a fallos o rendimiento según el nivel.
- **Espejo (RAID1)**: réplica del mismo contenido en dos o más discos.
- **Paridad (RAID5/6)**: información de redundancia distribuida que permite reconstruir un miembro.
- **RAID degradado**: conjunto al que le falta un miembro y que puede perder tolerancia.
- **Réplica**: copia sincronizada del estado actual, no un historial de versiones.
- **dm-crypt**: mapeador del kernel que cifra y descifra bloques de forma transparente.
- **LUKS**: formato de cabecera que gestiona claves y keyslots de un volumen cifrado.
- **Confidencialidad en reposo**: propiedad de no ser legible sin la clave con el medio apagado o bloqueado.
- **Integridad**: propiedad de detectar alteraciones; distinta de mantener el contenido en secreto.
- **Keyslot**: ranura de cabecera que guarda una clave derivada para desbloquear el volumen.
- **Cabecera LUKS**: estructura que, respaldada, puede permitir el acceso histórico al volumen.

## Respaldos y recuperación

- **Backup**: copia recuperable, versionada e independiente del origen.
- **RPO**: máxima pérdida temporal de datos aceptable; acota la antigüedad admisible de la copia.
- **RTO**: tiempo máximo aceptable hasta recuperar el servicio.
- **Consistencia crash-consistent**: conjunto coherente a nivel físico, sin garantía transaccional.
- **Consistencia application-consistent**: conjunto coherente para el motor de la aplicación.
- **Modelo de amenazas**: qué adversario o fallo debe resistir la copia y con qué privilegios.
- **3-2-1**: heurística de copias (tres, dos medios, una fuera de sitio), no un análisis de amenazas.
- **`rsync`**: sincroniza un origen con un destino transfiriendo solo lo que cambió.
- **Modo archive (`-a`)**: conjunto de opciones de `rsync` que no incluye ACL, xattrs ni hard links.
- **Barra final**: distingue copiar el contenido de un directorio o crear el directorio dentro del destino.
- **`--delete`**: elimina en el destino lo que ya no existe en el origen, replicando borrados.
- **xattrs/ACL**: metadatos extendidos que pueden perderse si la herramienta o el destino no los soportan.
- **Snapshot**: vista identificable de un conjunto de datos en un momento, restaurable por separado.
- **Deduplicación**: reutilización de bloques ya almacenados para no repetir contenido.
- **`check`**: verificación de integridad estructural del repositorio, no lectura de todo el contenido.
- **`forget`/`prune`**: retención de snapshots y eliminación de material no referenciado.
- **Retención**: política que decide cuántos snapshots y versiones se conservan.
- **Runbook**: procedimiento escrito y ordenado para ejecutar una recuperación.
- **Preservación**: fijar el estado y las fuentes de evidencia antes de modificarlos.
- **Contención**: limitar el alcance de un incidente antes de restaurar.
- **Copia preincidente**: versión anterior al fallo, sin la corrupción o los artefactos posteriores.
- **Restauración aislada**: recuperar en un entorno separado antes de tocar producción.
- **RTO/RPO reales**: tiempos medidos en el ensayo, no los objetivos declarados.
- **Manifiesto**: listado de hashes y metadatos para comprobar un estado de referencia.
- **Hash criptográfico**: resumen del contenido; detecta cambios en los bytes medidos.
- **Estado intermedio**: hash de un archivo que cambió durante su cálculo.
- **Integridad por archivo**: verificación criptográfica de que un archivo no cambió, distinta de un respaldo.
- **Prioridad de recuperación**: orden de objetivos (contener, preservar, restaurar, verificar) declarado antes de actuar.
- **Anti-patrón**: práctica que parece útil pero empeora el problema en el contexto dado.
- **`fsck`**: comprobación y reparación de un sistema de archivos; puede modificar el estado.
- **Imagen del medio**: copia fiel sobre la que se analiza, dejando el original intacto.
- **Cadena de custodia**: registro de quién, cuándo y cómo manipuló una evidencia.
- **Canary**: elemento señuelo cuyo cambio delata una manipulación.

## Red del host: capas, rutas y sockets

- **Capa (L2/L3/L4/L7)**: nivel de abstracción de red con su propia pregunta y sus propios límites.
- **Ruta**: decisión del kernel sobre el camino de salida de un paquete.
- **Policy routing**: selección de una tabla de rutas por origen, marca, interfaz o VRF.
- **Namespace de red**: espacio de red aislado con sus propias interfaces, rutas y sockets.
- **`0.0.0.0`**: dirección comodín que representa todas las interfaces locales IPv4.
- **Evidencia básica**: paquete mínimo y ordenado de interfaces, rutas, sockets y resolutores.
- **Mínima exposición**: recoger lo necesario y revisar los datos sensibles antes de compartirlos.
- **No atómica**: la recogida no captura un instante único; el estado cambia entre comandos.
- **Hora UTC**: referencia temporal común para ordenar observaciones de varios hosts.
- **Rango de documentación**: bloque de direcciones reservado para ejemplos (RFC 5737/3849).
- **Inventario de red**: conjunto de interfaces, direcciones, rutas y resolutores de un host.
- **`ip route get`**: consulta de la decisión de encaminamiento sin enviar paquetes.
- **Link-local**: dirección IPv6 de ámbito local (`fe80::/10`) que suele requerir interfaz.
- **Stub resolver**: resolver local en loopback que reenvía consultas a otros servidores.
- **NSS**: orden de fuentes de resolución de nombres definido en `nsswitch.conf`.
- **Handshake TCP**: intercambio SYN / SYN,ACK / ACK que establece la conexión.
- **ESTAB**: estado de conexión establecida entre dos extremos.
- **CLOSE-WAIT**: estado que indica que la aplicación local no cerró su lado.
- **TIME-WAIT**: espera tras el cierre, normal en alta concurrencia.
- **RST**: reinicio que puede originarse en el destino o en un intermediario.
- **Estado conntrack**: seguimiento de un flujo por el kernel, sin evaluar legitimidad.
- **UDP**: transporte sin conexión ni acuses, a diferencia de TCP.
- **ICMP / ICMPv6**: protocolos de control y error; participan en PMTUD y NDP.
- **PMTUD**: descubrimiento de la MTU de ruta mediante mensajes de error.
- **Dual stack**: coexistencia de IPv4 e IPv6 en el mismo host.
- **NDP**: descubrimiento de vecinos IPv6 basado en ICMPv6.
- **MTU**: tamaño máximo de unidad de transmisión en un enlace.
- **Socket**: extremo de comunicación entre un proceso y la red.
- **LISTEN**: estado de un socket que espera conexiones entrantes.
- **systemd.socket**: unidad que posee una escucha y puede activar un servicio.
- **Socket activation**: crear la escucha en systemd y activar el servicio bajo demanda.

## SSH, túneles y observación

- **Host key**: clave que identifica al servidor ante el cliente.
- **User key**: clave pública de usuario autorizada en `authorized_keys`.
- **`known_hosts`**: almacén de claves de servidores ya conocidos por el cliente.
- **Fingerprint**: huella que se compara por un canal fiable e independiente.
- **`AuthenticationMethods`**: métodos que `sshd` exige para autenticar a un usuario.
- **MFA**: segundo factor que, junto con la clave, endurece el acceso.
- **Configuración efectiva**: resultado tras incluir fragmentos, precedencias y reglas `Match`.
- **`sshd -t`**: comprobación de sintaxis y llaves sin arrancar el servicio.
- **`sshd -T`**: impresión de la configuración efectiva del servidor.
- **`sshd -T -C`**: evaluación de `Match` según parámetros de conexión.
- **`Include`**: directiva que carga fragmentos de configuración con precedencia.
- **Consola OOB**: acceso fuera de banda para no perder el control del host.
- **`authorized_keys`**: fichero por usuario con claves públicas y restricciones.
- **`from=`**: restricción por la dirección de origen observada por el servidor.
- **`command=`**: comando impuesto al autenticar con esa clave.
- **`restrict`**: opción que desactiva funciones opcionales (pty, forwarding, etc.).
- **`permitopen=`**: lista blanca de destinos de reenvío permitidos.
- **Mínimo privilegio**: integrar shell, permisos, `sudo` y segmentación para acotar el acceso.
- **Reenvío local (`-L`)**: socket en escucha en el cliente que reenvía hacia el destino a través del bastión.
- **Reenvío remoto (`-R`)**: socket en escucha en el servidor que reenvía hacia el cliente.
- **SOCKS dinámico (`-D`)**: proxy que el cliente SSH publica localmente.
- **Jump host (`-J`)**: encadenado de saltos SSH sin publicar un puerto.
- **`AllowTcpForwarding`**: directiva del servidor que habilita o restringe reenvíos.
- **`PermitOpen`**: lista de destinos de reenvío admitidos por el servidor.
- **Sensor**: punto de observación con una vista parcial del mismo flujo.
- **5-tupla**: origen, destino, puerto origen, puerto destino y protocolo de un flujo.
- **Instantánea**: lectura del estado actual, no un histórico de cambios.
- **Atribución**: relacionar un flujo con un proceso, usuario o causa.
- **Offloading**: procesamiento de red que puede alterar lo que se captura.
- **Terminación de TLS**: punto donde se descifra el tráfico y otro sensor lo ve claro.
- **Cobertura del sensor**: alcance real de lo que un sensor llega a registrar.
- **BPF**: filtro de captura que acota el tráfico por host, puerto o protocolo.
- **Snaplen (`-s`)**: bytes máximos copiados por paquete.
- **Límite `-c`**: número máximo de paquetes que se capturan.
- **Interfaz veth**: interfaz virtual que une namespaces en el laboratorio.
- **SHA-256**: huella que apoya el control de integridad de la captura.
- **Custodia mínima**: metadatos que hacen trazable y utilizable una captura.
- **Lectura con `-r`**: revisar un PCAP sin enviar paquetes de nuevo.

## Firewalls, contención y correlación

- **Netfilter**: mecanismo del kernel que intercepta paquetes en su recorrido.
- **Cadena base**: cadena registrada en un hook con `type`, `priority` y `policy`.
- **Hook**: punto del recorrido del paquete donde se evalúa una cadena.
- **Prioridad**: número que ordena las cadenas de un mismo hook; menor se evalúa antes.
- **`policy`**: decisión por defecto de una cadena base cuando ninguna regla decide.
- **conntrack**: registro de estado de los flujos que usa el filtrado stateful.
- **`nft -c -f`**: comprobación de sintaxis de un archivo de reglas sin aplicarlo.
- **`counter`**: contador asociado a una regla para medir coincidencias.
- **Rollback**: revertir un cambio de forma controlada y acotada.
- **`policy drop`**: decisión por defecto que descarta lo no permitido explícitamente.
- **Aislamiento**: ausencia de ruta hacia redes externas o de terceros.
- **Egress deny**: regla que bloquea tráfico de salida en un punto de control.
- **Segmento o identidad de workload**: agrupación que resiste mejor el cambio de IP.
- **Evidencia volátil**: datos que se pierden al reiniciar o al terminar procesos.
- **Cron/timer**: mecanismo de persistencia que un borrado apresurado destruye.
- **Verificación de contención**: comprobar que el flujo cesó y no se desplazó.
- **Canal alternativo**: otra vía (IPv6, DNS, otro puerto) que evita el bloqueo.
- **Correlación**: cruzar campos de varias fuentes para sostener una conclusión.
- **Atribución al proceso**: relacionar un flujo con un PID, usuario o ejecutable.
- **TTL**: tiempo de vida de un registro DNS en caché.
- **Contador de firewall**: cuenta de coincidencias de una regla, sin payload.
- **Telemetría EDR/eBPF**: eventos de proceso y sistema según la cobertura del sensor.
- **Falso positivo**: coincidencia legítima que dispara una detección.
- **`getent ahosts`**: consulta que sigue la resolución de nombres del sistema.
- **`dig`**: herramienta que consulta DNS con su propia lógica.
- **SNI**: nombre de servidor que el cliente presenta al iniciar TLS.
- **Orden de verificación**: secuencia de comprobaciones por capas del flujo.
- **Listener**: servicio que escucha en un puerto, visible con `ss`.
- **Registro de autenticación**: evidencia de intentos y sesiones de SSH.
- **Hipótesis competidora**: explicación alternativa que debe descartarse.
- **Prueba negativa**: confirmar que lo denegado efectivamente se bloquea.
- **Retest**: repetir la prueba tras el cambio para confirmar el efecto.
- **Gestor de firewall**: componente que persiste la política (nft, UFW, firewalld).

## Identidad, privilegios y control de acceso

- **RUID**: identidad real del proceso; suele identificar la sesión de origen.
- **EUID**: identidad efectiva; el kernel la usa para la mayoría de comprobaciones de privilegio.
- **Saved set-user-ID**: copia de la EUID anterior que permite subir y bajar identidad tras `execve`.
- **FSUID**: identidad usada específicamente para comprobar acceso a archivos.
- **Credencial**: conjunto de identidades y grupos asociados a un proceso.
- **`NoNewPrivs`**: indicador que impide ganar privilegios adicionales mediante `execve`.
- **SUID**: bit que hace adoptar la EUID del propietario del ejecutable.
- **SGID**: bit que adopta el GID del propietario o impone herencia de grupo en un directorio.
- **Capability**: privilegio nombrado y acotado, separado de la identidad de root.
- **Bounding set**: conjunto máximo de capabilities que un proceso puede llegar a tener.
- **`no_new_privs`**: restricción que impide ganar privilegios mediante `execve`.
- **`sudo -l`**: consulta de la delegación que se aplica al propio usuario.
- **`nosuid`**: opción de montaje que anula el efecto de los bits SUID y SGID.
- **DAC**: control de acceso basado en propietario, grupo y permisos del objeto.
- **Travesía**: permiso `x` necesario en cada directorio del camino.
- **Máscara ACL**: límite efectivo de las entradas nombradas y del grupo propietario.
- **Grupo suplementario**: grupo adicional del proceso que amplía la pertenencia evaluada.
- **Clase de permiso**: propietario, grupo o resto; el kernel aplica una sola.
- **PAM**: interfaz de autenticación modular usada por aplicaciones que la integran.
- **Grupo de gestión**: `auth`, `account`, `password` o `session`; cada uno responde a una pregunta distinta.
- **Control flag**: palabra que define cómo afecta el resultado de un módulo a la pila.
- **`requisite`**: control que detiene la evaluación ante un fallo.
- **`sufficient`**: control que puede conceder éxito si no hay fallos `required` previos.
- **`substack`**: inclusión de otra pila con su propio ámbito de evaluación.
- **Sintaxis extendida**: forma `[success=N default=bad]` que altera el flujo de la pila.
- **Solo lectura**: inspección que no modifica ficheros ni recarga políticas.
- **Ruta efectiva**: fichero de configuración que realmente se aplica tras la precedencia.
- **`pam_exec`**: módulo que ejecuta un comando externo durante la pila.
- **`expose_authtok`**: opción que entrega el token de autenticación al proceso invocado.
- **Riesgo de bloqueo**: posibilidad de dejar sin acceso a todas las cuentas.
- **Superficie de identidad**: conjunto de políticas que deciden autenticación, autorización y ejecución privilegiada.
- **Regla efectiva**: resultado de aplicar todas las fuentes y el orden de sudoers.
- **`include_dir`**: directorio cuyas reglas se incorporan a la política principal.
- **`NOPASSWD`**: etiqueta que autoriza sin solicitar contraseña.
- **`NOEXEC`**: restricción que impide ejecutar binarios hijos desde el comando delegado.
- **No observado**: ausencia de evento que no equivale a ausencia de acción.
- **Identidad de login**: cuenta que inició la sesión, distinta de la identidad efectiva del proceso.

## MAC, hardening y recursos

- **MAC**: control de acceso obligatorio que se aplica además del DAC.
- **AVC**: evento de denegación de acceso de SELinux.
- **Contexto**: etiqueta `usuario:rol:tipo:nivel` de un proceso u objeto.
- **Dominio**: tipo asociado a un proceso en ejecución.
- **`Permissive`**: modo que registra denegaciones sin bloquearlas.
- **`dontaudit`**: regla que suprime del registro ciertas denegaciones.
- **`audit2allow`**: herramienta que propone reglas a partir de eventos; no decide la causa.
- **Perfil**: conjunto de reglas que confina un ejecutable en AppArmor.
- **`enforce`**: modo que bloquea las operaciones no permitidas.
- **`complain`**: modo que registra sin bloquear; útil para observar, no como estado final.
- **`aa-status`**: herramienta que muestra perfiles cargados, modos y procesos confinados.
- **`DENIED`**: marca de denegación de AppArmor en el journal del kernel.
- **`aa-logprof`**: herramienta que puede escribir perfiles; no es solo lectura.
- **Confinamiento**: aplicación efectiva de un perfil a un proceso.
- **Diagnóstico diferencial**: descartar capas candidatas antes de atribuir una causa.
- **Sandbox de unidad**: restricciones de systemd que limitan rutas, privilegios o visibilidad.
- **`ProtectHome`**: opción que oculta los directorios de usuario al servicio.
- **`ReadWritePaths`**: lista de rutas escribibles permitidas bajo un sandbox estricto.
- **Causa técnica**: mecanismo que produjo el fallo, sin juicio sobre intención.
- **Autoría**: atribución de una acción a una persona o proceso, que exige evidencia adicional.
- **Evento negativo**: ausencia de registro que no prueba ausencia de acción.
- **Severidad contextual**: prioridad calculada con el entorno real, no solo con la desviación respecto de una referencia.
- **Alcanzabilidad**: capacidad efectiva de una identidad o red para llegar al recurso.
- **Identidad mínima**: menor privilegio necesario para aprovechar un hallazgo.
- **Control compensatorio**: medida que reduce el riesgo sin eliminar la causa.
- **Ventana de cambio**: periodo autorizado para aplicar una modificación con reversión prevista.
- **Riesgo de la remediación**: posibilidad de romper el servicio al corregir el hallazgo.
- **Propietario del activo**: responsable de decidir y validar el cambio.
- **Alcance**: hosts, unidades y rutas donde aplica un control, con exclusiones justificadas.
- **Verificación observable**: prueba repetible de que el control está activo y el servicio sigue funcionando.
- **Efecto secundario**: consecuencia operativa conocida de aplicar el control.
- **Reversión**: procedimiento documentado para volver al estado anterior.
- **Excepción**: host o servicio excluido con motivo y propietario.
- **Evidencia de cierre**: registro del cambio, su resultado y quién lo validó.
- **PSI**: información de presión que mide tiempo de espera por CPU, memoria o IO.
- **`some` / `full`**: al menos una tarea detenida / todas las tareas ejecutables detenidas.
- **`loadavg`**: media de tareas ejecutables y bloqueadas, no un porcentaje de CPU.
- **`available`**: memoria estimada recuperable, incluida caché, no memoria libre bruta.
- **OOM killer**: mecanismo del kernel que termina procesos bajo presión de memoria.
- **cgroup v2**: jerarquía que aplica límites de CPU, memoria e IO a un grupo de procesos.
- **`memory.events`**: contadores de eventos de un cgroup, incluidos `oom` y `oom_kill`.

## Logging, auditoría y triaje

- **Entrada de journal**: registro con mensaje y campos de metadatos, no una línea de texto plano.
- **`_BOOT_ID`**: identificador del arranque al que pertenece una entrada.
- **Campo con prefijo `_`**: metadato añadido por journald desde el sistema.
- **Campo sin prefijo**: dato declarado por la aplicación emisora, no verificado.
- **`Storage`**: política de almacenamiento del journal (`volatile`, `persistent`, `auto`).
- **`SystemMaxUse`**: límite de espacio del journal, no de días de retención.
- **Rate limit**: límite de mensajes por intervalo que puede descartar entradas.
- **Pipeline**: secuencia entrada, parseo, reglas y acciones de rsyslog.
- **`omfwd`**: módulo de salida que reenvía mensajes a un destino remoto.
- **TCP/TLS**: transporte con conexión y, en TLS, cifrado y autenticación del canal.
- **RELP**: protocolo con confirmación a nivel de mensaje entre emisor y receptor.
- **Cola en disco**: buffer persistente que sobrevive a reinicios y consume espacio.
- **Mensaje canario**: evento sintético conocido usado para verificar el recorrido completo.
- **Identificador de prueba**: cadena única que permite localizar el canario sin ambigüedad.
- **Ventana observable**: periodo para el que se estima que existen entradas conservadas.
- **`MaxRetentionSec`**: política que puede descartar entradas por antigüedad.
- **Tasa de eventos**: entradas por unidad de tiempo en una ventana concreta.
- **Pico**: ráfaga que supera la media y consume el límite de espacio antes de lo previsto.
- **Verificación estructural**: comprobación de coherencia interna, no de autenticidad.
- **Regla de audit**: filtro cargado en el kernel que decide qué operaciones se registran.
- **`auditctl -l`**: lista las reglas efectivamente cargadas.
- **`auditctl -s`**: muestra estado, backlog y contadores de pérdida.
- **`auid`**: identidad de login, que puede persistir tras elevar privilegios.
- **Serial de evento**: par época:serial que agrupa los registros de una misma operación.
- **`lost`**: contador de eventos que no se pudieron registrar.
- **`-e 2`**: modo que inmoviliza las reglas hasta el siguiente reinicio.
- **Artefacto duradero**: fichero o registro que sobrevive al reinicio y se puede copiar.
- **Hash de evidencia**: huella que constata igualdad de bytes, no autenticidad.
- **Orden de volatilidad**: criterio que prioriza lo que se pierde antes.
- **Timeline**: orden correlacionado de eventos con hora, fuente y evidencia.
- **Hueco de telemetría**: periodo o fuente sin registro, que debe declararse.
- **Causalidad**: relación de causa sostenida con mecanismo y alternativas descartadas.
- **Criterio de parada**: condición que indica que el paso o el triaje puede cerrarse.
- **Revisión posterior**: análisis de qué faltó y qué mejorar tras el cierre.

## Contenedores y Kubernetes

- **Daemon (runtime)**: servicio que crea y gestiona contenedores; su modo rootful o rootless cambia el alcance de su poder.
- **Rootless**: ejecución del daemon y de los contenedores bajo un usuario no root, con límites y prerrequisitos propios.
- **Seccomp**: filtro que restringe las llamadas al sistema disponibles para un proceso.
- **Namespace**: vista aislada de un recurso (PID, red, montajes, usuario) que no constituye por sí sola una frontera de seguridad.
- **Inspección pasiva**: lectura de configuración y estado sin ejecutar acciones que amplíen el impacto.
- **Pod Security Standards**: niveles `Privileged`, `Baseline` y `Restricted` que describen configuraciones admitidas.
- **Pod Security Admission**: mecanismo de admisión que aplica esos niveles por namespace y por modo.
- **Modo de enforcement**: `enforce` bloquea, mientras que `audit` y `warn` solo registran o advierten.
- **securityContext**: bloque del manifiesto que fija identidad, privilegios, seccomp y capabilities del pod o contenedor.
- **Exención**: regla que excluye ciertos usuarios, namespaces o pods de la política de admisión.
- **allowPrivilegeEscalation**: campo que impide ganar privilegios adicionales durante la ejecución.
- **Abuso de configuración**: uso de una capacidad del runtime más allá de lo necesario o de lo aprobado, sin explotar una vulnerabilidad nueva.
- **Exposición**: capacidad potencial verificada en la configuración, todavía sin efecto observado.
- **Compromiso**: efecto producido y evidenciado dentro del alcance autorizado.
- **Línea base**: configuración de referencia contra la que se compara el estado actual.
- **Remediación**: cambio que elimina o reduce la causa de la exposición.
- **Retest negativo**: comprobación de que la configuración insegura ya no se admite.
- **Límite de recursos**: cuota de CPU, memoria o procesos aplicada mediante cgroups.

## Automatización y método de evaluación

- **Idempotencia**: propiedad de repetir una operación sin acumular efectos ni alterar el estado esperado.
- **TOCTOU**: condición de carrera entre la comprobación de un recurso y su uso posterior.
- **`pipefail`**: opción que hace que una tubería devuelva el fallo de cualquiera de sus componentes.
- **Prueba de humo**: ejecución mínima que comprueba que el flujo principal responde.
- **`--dry-run`**: modo que muestra lo que se haría sin aplicar cambios.
- **Redacción**: sustitución de datos sensibles antes de registrar o compartir una salida.
- **Evidencia preservada**: conjunto que se conserva sin truncar, con hash y contexto de captura.
- **ROE (reglas de enfrentamiento)**: acuerdo que fija alcance, límites, ventana y condiciones de parada de una prueba.
- **Enumeración**: inventario de identidades, permisos, servicios y rutas dentro del alcance autorizado.
- **Hipótesis verificable**: afirmación concreta que puede contrastarse con evidencia y que nombra una ruta y un efecto.
- **Prueba de concepto inocua**: demostración mínima que no amplía el impacto ni ejecuta privilegios ajenos.
- **Retest positivo y negativo**: comprobación de que la función legítima sigue y de que el abuso simulado ya no ocurre.
- **Deconflicción**: coordinación previa que permite distinguir actividad autorizada de actividad no autorizada.
- **Producto del SOC**: registro de incidente con hechos, hipótesis, decisiones y límites.
- **Producto del Red Team**: hallazgo con ruta, evidencia, impacto condicionado y remediación.

## Purple Team y cierre

- **Purple Team**: colaboración entre ataque y defensa para medir detección y remediación de extremo a extremo.
- **Caso negativo**: prueba de que una conducta legítima o inocua no genera la alerta esperada.
- **Hipótesis de detección**: afirmación de que una conducta produce eventos observables y una alerta útil.
- **Evento sintético**: estímulo benigno, etiquetado y reproducible que imita el patrón a detectar.
- **Caso positivo**: prueba de que la conducta esperada genera la alerta.
- **Enriquecimiento**: incorporación de contexto como identidad, imagen, contenedor o host al evento.
- **Fidelidad**: grado en que el estímulo reproduce la conducta relevante sin ampliar el impacto.
- **Retest extremo a extremo**: repetición completa del escenario que compara función, abuso y detección antes y después.
- **Prueba positiva**: comprobación de que la función legítima sigue operando tras la remediación.
- **Regresión**: efecto secundario no previsto que rompe una función o un control existente.
- **Riesgo residual**: riesgo que permanece después de la remediación y que debe aceptarse o revisarse.
- **Cierre documentado**: decisión con evidencia, propietario, fecha y límites declarados.
- **Evaluación integrada**: caso final que conecta identidad, hardening, auditoría, contenedores, método y detección.
