---
title: "LINUX | SOC + RED TEAM"
subtitle: "Tanda 4 de 5 · Red del host, SSH y firewalls"
author: "Dossier técnico de investigación y laboratorio"
date: "18 de octubre de 2026"
lang: es-ES
version: "4.0"
---

> **Objetivo de la tanda.** Comprender el tráfico que entra, sale y atraviesa un host Linux; investigar qué proceso establece conexiones y por qué; proteger el acceso SSH sin perder acceso administrativo; e interpretar/configurar un firewall en escenarios reproducibles. Cada asunto se aborda desde operación, detección SOC/DFIR y pruebas Red Team **autorizadas**, distinguiendo evidencia de inferencias.

**Trazabilidad del encargo:** cuarto bloque de la investigación en cinco tandas de `linux(1).txt`: «Red del host, SSH y firewalls». Se apoya en fundamentos de Linux/Bash (T1), systemd y servicios (T2), almacenamiento/preservación (T3). La T5 se reserva para PAM/SELinux/AppArmor, logs y auditoría profunda, telemetría avanzada, contenedores y evaluación integrada; aquí se introducen solo las piezas de esas áreas imprescindibles para investigar redes.

**Entorno de referencia:** Linux actual en Debian/Parrot/Ubuntu, con equivalencias relevantes a RHEL/Fedora. El soporte efectivo depende de versión de kernel, versión de iproute2/OpenSSH/nftables, gestor de red y privilegios. Los comandos son ejemplos didácticos; **no se han ejecutado en los sistemas del usuario**. En producción se usan procedimientos de cambio, copia de configuración, respaldo de conectividad y autorización explícita.

**Leyenda:** `[SOC]` señal y límites de observación; `[RT]` prueba de seguridad autorizada; `[DOC:Nxx]` fuentes verificables (sección 26); `[LAB]` ejecución en laboratorio; `[ALTO RIESGO]` nunca ejecutar fuera de entorno aislado sin plan de reversión. Los rangos `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32` son de documentación; `10.44.0.0/24` se emplea únicamente dentro de namespaces privados del ejemplo.

# 1. Resultados de aprendizaje y criterios profesionales

Al completar la tanda debes poder:

1. Identificar interfaces, direcciones, rutas, reglas de policy routing, resolución DNS, namespaces y la relación entre servicio y socket.
2. Explicar TCP/UDP/ICMP/ICMPv6, puertos origen/destino, estados TCP, NAT, conntrack, MTU y los límites de los diagnósticos desde un solo host.
3. Distinguir «servicio escuchando», «servicio expuesto», «flujo autorizado», «flujo establecido», «proceso observado» y «atribución al atacante»: son hipótesis diferentes.
4. Investigar conexiones salientes anómalas mediante un flujo de preservación, correlación de procesos, controles de egreso, telemetría y escalada sin precipitar un `kill` o borrar reglas.
5. Evaluar configuración **efectiva** de SSH y acceso por clave, verificar identidad del servidor y reconocer anomalías de autenticación y túneles autorizados/no autorizados.
6. Leer un `nft list ruleset`, entender cadenas/hooks/prioridades/estado y construir filtros en namespace aislado, con rollback.
7. Comparar firewalls nftables, iptables (nft/legacy), UFW, firewalld y controles de red cloud sin asumir equivalencia funcional.
8. Crear evidencia mínima reproducible (línea temporal, sockets, PCAP controlado, registros SSH/firewall, hashes, alcance y límites).
9. Ejecutar pruebas de Red Team en laboratorio para documentar exposición y movimientos de red **sin vulnerar redes de terceros**.
10. Formular detecciones SOC contrastables y validarlas con casos positivos/negativos, métricas y advertencias de falsos positivos.

**Evaluación T4:** 10 laboratorios y 100 puntos; objetivo ≥80, sin incumplimientos críticos; pruebas de conectividad, persistencia de acceso y conservación de evidencia obligatorias. No se aprueba un laboratorio de firewall que corta la sesión SSH de administración o modifica reglas del host real por accidente.

# 2. Modelo de red que evita conclusiones falsas [DOC:N01–N05]

```text
 proceso → API socket / fichero descriptor → namespace de red → TCP/UDP/IP
             │                                  │             │
             └── UID/PID/cgroup                 ├── ruta      ├── nftables hooks
                                                ├── DNS/NSS   ├── conntrack/NAT
                                                └── interfaz → NIC / veth / VPN
                                                                │
                                                      LAN/Internet/proxy/cloud
```

La dirección vista desde el host puede diferir de la observada por un proxy, balanceador, NAT, contenedor, overlay de VPN o egress gateway. `ss` examina sockets vivos en el contexto donde se ejecuta; **no** recupera sesiones ya terminadas ni prueba quién inició históricamente un flujo. Un IDS de red puede ver un paquete pero no el PID. `tcpdump` puede ver bytes y tiempos, pero no el contenido de SSH/TLS sin claves ni el origen humano del tráfico.

## 2.1 Capas y controles relacionados

| Capa/pieza | Ejemplo | Qué responde | Qué NO prueba |
|---|---|---|---|
| Enlace L2 | NIC, MAC, ARP/NDP, VLAN | ¿Dónde se encamina en el segmento? | Autor/identidad humana de un flujo |
| IP L3 | IPv4/IPv6, rutas, reglas | ¿Qué camino decide el kernel? | Entrega real extremo a extremo |
| Transporte L4 | TCP/UDP/ICMP | ¿Qué puertos, estado o mensajes? | Legitimidad de la aplicación |
| Aplicación L7 | SSH/HTTP/DNS/TLS | ¿Qué protocolo parece y cómo se autentica? | Que todo el tráfico use puertos convencionales |
| Proceso/usuario | PID, UID, cmdline, cgroup | ¿Qué proceso mantiene socket ahora? | Persistencia histórica / ausencia de ocultación |
| Política local | netfilter/nftables | ¿Permite/descarta un paquete que cruza sus hooks? | Política del router, security group o cloud |

**Ejemplo mental:** `0.0.0.0:22` significa escucha IPv4 en interfaces locales, no «visible desde Internet». Debe existir ruta y autorización efectiva a través de todos los filtros (host, red, cloud). `127.0.0.1:22` se restringe al loopback de la namespace, salvo contextos de proxy, reenvío o túnel que presenten el servicio desde otro lugar. `[SOC]` Un puerto 443 usado por un proceso inesperado merece revisión; el puerto por sí solo no identifica HTTPS.

# 3. Inventario inicial reproducible, sin cambios [DOC:N01–N04]

```bash
cat /etc/os-release
uname -r
ip -br link
ip -br -4 addr
ip -br -6 addr
ip -d link show
ip -4 route show table main
ip -6 route show table main
ip rule show
ip -4 route get 192.0.2.80
ip -6 route get 2001:db8::80
ss -lntup                 # procesos visibles según privilegios
ss -tanop                 # sockets TCP no limitados a LISTEN
ss -uanp                  # UDP (no interpreta una «sesión TCP»)
cat /proc/net/route
cat /etc/nsswitch.conf
readlink -f /etc/resolv.conf
cat /etc/resolv.conf
getent ahosts localhost
```

**Precauciones de interpretación:**

- `ip -br` es representación humana compacta; para análisis automatizado usa `ip -j address`, `ip -j route` cuando lo soporte la versión. Guarda stdout, stderr y versiones: `ip -V`, `ss -V`.
- `ip route get DIRECCIÓN` hace una consulta de encaminamiento **sin enviar paquetes** a esa dirección; la decisión depende también de origen, marca y reglas cuando se especifican. `ip route show main` no ve por sí sola todas las tablas de policy routing. [DOC:N01]
- Para IPv6, una dirección link-local `fe80::/10` necesita a menudo ámbito/interfaz (`%interfaz`) si se usa como destino. No concluyas que IPv6 está inactivo por ausencia de una dirección global; las direcciones de link-local y rutas requieren revisión.
- `ss -p` puede omitir procesos ajenos sin privilegios. Un socket visible puede cambiar o cerrarse entre dos comandos (*race*); tomar hora UTC y repetición controlada.
- No deduzcas que una dirección DNS de `/etc/resolv.conf` sea siempre un servidor remoto: `127.0.0.53` puede ser el *stub* de `systemd-resolved`. [DOC:N07]

## 3.1 Evidencia básica con mínima exposición

```bash
mkdir -p "$HOME/t4-evidencia"
OUT="$HOME/t4-evidencia"
date --utc --iso-8601=seconds | tee "$OUT/fecha-utc.txt"
ip -j address show > "$OUT/interfaces.json"
ip -j route show table all > "$OUT/rutas.json"
ip rule show > "$OUT/reglas-routing.txt"
ss -H -lntup > "$OUT/listeners.txt" 2> "$OUT/listeners.stderr"
ss -H -tanop > "$OUT/tcp.txt" 2> "$OUT/tcp.stderr"
sha256sum "$OUT"/* > "$OUT/sha256-inicial.txt"
```

Este paquete **no** representa una adquisición forense íntegra y no es atómico: puede haber cambios durante la recogida; el archivo de hashes tampoco se incluye a sí mismo ni garantiza custodia. Registra NTP/reloj, permisos, operador, sistema y motivo. Revisa y restringe información sensible: IP privadas, nombres de host, rutas o usuarios.

# 4. Interfaces, direcciones, ARP/NDP y problemas L2 [DOC:N01,N05]

`ip link` maneja la interfaz; `ip addr` vincula direcciones; `ip neigh` observa la caché de vecinos IPv4 (ARP) e IPv6 (NDP). `LOWER_UP` significa estado de portadora informado, no disponibilidad de aplicación. Un enlace puede estar `UP` y seguir sin DHCP, DNS o salida.

```bash
ip -s link show dev lo
ip neigh show
ip -6 neigh show
ip -d addr show
cat /sys/class/net/lo/mtu
# Sólo si están disponibles:
ethtool -i INTERFAZ_AUDITADA
ethtool INTERFAZ_AUDITADA
```

Causas típicas de fallo local: interfaz deshabilitada; gateway fuera de prefijo; ARP/NDP incompleto; VLAN mal etiquetada; DNS inaccesible; MTU incorrecta; puerta de enlace por VPN; dirección duplicada; filtro de egress; proxy distinto por aplicación.

[SOC] Un cambio súbito de MAC/gateway puede explicarse por un failover legítimo, bridge, DHCP, VPN o manipulación. Se necesitan línea base, histórico DHCP/NM, eventos de hipervisor/switch y pruebas cruzadas. [RT] En laboratorio registra si una interfaz de administración está en el segmento esperado y si la ruta para servicios internos sale por la interfaz autorizada; evita suplantación o pruebas activas en redes ajenas.

# 5. Rutas, policy routing y asimetría [DOC:N01,N12]

```bash
ip -4 route show table all
ip -6 route show table all
ip rule list
ip -4 route get 198.51.100.10
ip -4 route get 198.51.100.10 from 192.0.2.20 2>/dev/null
sysctl net.ipv4.conf.all.rp_filter
sysctl net.ipv4.conf.default.rp_filter
```

Una política `ip rule` puede seleccionar otra tabla por origen, marca, interfaz o VRF. **Ruta de salida** ≠ **ruta simétrica de retorno**. `rp_filter=1` (estricto) puede descartar paquetes en topologías asimétricas; `rp_filter=2` (laxo) es una opción a evaluar en esos escenarios, no un mandato universal. El valor efectivo depende de la combinación `all`/interfaz documentada por el kernel. Cambiar `rp_filter` indiscriminadamente para «arreglar» conectividad puede desactivar protecciones y ocultar problemas. [DOC:N12]

**Triaje de VPN/Mesh/overlay:** compara rutas antes/después, DNS por interfaz, tabla de policy routing, MTU, mark y servicio asociado, sin asumir que la IP visible corresponde a salida directa por la NIC física. El firewall puede actuar sobre interfaz túnel y físico en momentos diferentes del recorrido.

# 6. TCP, UDP, ICMP e ICMPv6: interpretación de síntomas

## 6.1 TCP

```text
cliente        servidor
SYN         ->
            <- SYN,ACK
ACK         ->    conexión establecida
DATOS/ACK   <->
FIN/RST     <->    cierre según caso
```

Estados útiles en `ss`: `LISTEN`, `SYN-SENT`, `SYN-RECV`, `ESTAB`, `FIN-WAIT-1/2`, `CLOSE-WAIT`, `TIME-WAIT`. `CLOSE-WAIT` persistente suele apuntar a aplicación que no cierra su lado; `TIME-WAIT` puede ser normal en servidores de alta concurrencia. `RST` puede provenir del destino o de otro elemento que interviene; un timeout también puede ser filtrado, pérdida o ruta inexistente.

**Colas y recursos:** `ss -lnt` muestra `Recv-Q/Send-Q`, pero su significado para `LISTEN` difiere del de sockets establecidos. No confundir cola con «gigabytes exfiltrados». `ss -tin` proporciona temporizadores y estadísticas TCP según soporte. `SYN cookies` constituyen una medida de respaldo en saturación; el kernel advierte que no reemplaza dimensionar adecuadamente la carga legítima. [DOC:N12]

## 6.2 UDP, ICMP y dual stack

- UDP no ofrece el estado de conexión de TCP; un `ss -uanp` no prueba ausencia de flujos previos. DNS/QUIC y otros protocolos pueden usar UDP.
- ICMP no es «tráfico prescindible»: errores como *fragmentation needed* / *Packet Too Big* participan en Path MTU Discovery; bloquearlos a ciegas rompe conectividad.
- En IPv6, NDP y la autoconfiguración usan ICMPv6: bloquear todo ICMPv6 puede dejar segmentos inoperativos. Un filtro debe contemplar IPv4 y IPv6, no solo `ip saddr` o una regla en familia `ip`.
- Un `ping` fallido **no** implica que TCP/443 sea inaccesible: el host puede ignorar eco ICMP.

**Diferencias prácticas entre fallos de conexión:**

| Síntoma | Hipótesis competidoras | Comprobación siguiente |
|---|---|---|
| `Connection refused` | No escucha; RST del host/intermedio | `ss -lntup`, PCAP en ambos extremos, proxy |
| `Connection timed out` | Drop, ruta, retorno, pérdida, congestión | `ip route get`, `tcpdump` en el segmento autorizado |
| `No route to host` | FIB, rechazo de red o vecino | rutas, vecinos, ICMP, policy routing |
| Resuelve DNS pero HTTP falla | TLS, proxy, SNI, puerto, aplicación | `curl -v --connect-timeout`, certificado, proxy |
| IPv4 funciona, IPv6 no | AAAA, RA, DNS por interfaz, firewall v6 | `getent ahosts`, `ip -6 route`, `curl -4/-6` |
| Transferencia se estanca | MTU/PMTUD, ventana TCP, QoS, app | capturas de ambos extremos, retransmisiones |

# 7. DNS: aplicación, NSS, stub y fugas [DOC:N07,N08]

La resolución en Linux puede implicar `/etc/hosts`, NSS (`/etc/nsswitch.conf`), `systemd-resolved`, DNS de NetworkManager, resolvers de bibliotecas y configuración de cada aplicación. `dig` consulta DNS con su propia lógica; `getent ahosts` sigue resolución de nombres del sistema. Si `curl` funciona y `dig` no (o viceversa), puede ser una divergencia de ruta de resolución, no una paradoja.

```bash
getent ahosts localhost
getent hosts localhost
resolvectl status            # si systemd-resolved está disponible
resolvectl query localhost
nmcli device show            # si NetworkManager está activo
cat /etc/hosts
cat /etc/nsswitch.conf
readlink -f /etc/resolv.conf
# Ejemplos solo con DNS autorizado o nombre de laboratorio:
dig +short nombre.lab.local @SERVIDOR_DNS_LAB
```

**Interpretación SOC:** volumen de consultas, familias de nombres, NXDOMAIN, respuestas cambiantes, diferencias en servidores usados por interfaz, aplicaciones que usan DNS-over-HTTPS o proxy. El nombre consultado por un proceso **no** demuestra conexión posterior a su IP; la caché, CDN, proxy y reintentos cambian la correspondencia. Un resolver corporativo no verá necesariamente consultas en DoH/TLS. **Privacidad:** nombres DNS pueden revelar proyectos internos, identidad de usuario o información sensible; minimizar al recolectar.

[RT] En alcance autorizado, verificar si una máquina consulta un resolver inesperado puede documentar fuga por configuración incorrecta. Evita pruebas de exfiltración; sustituye contenido por identificadores inertes.

# 8. Servicios escuchando, socket activation y namespaces [DOC:N03,N04,N09]

```bash
ss -lntup
ss -ltnp '( sport = :22 )'
systemctl list-sockets --all
systemctl list-units --type=service --state=running
sudo lsof -nP -iTCP -sTCP:LISTEN   # opcional
lsns -t net
readlink /proc/self/ns/net
```

`systemd.socket` puede poseer una escucha y activar un servicio bajo demanda. `ss` podría atribuir el socket a `systemd` o mostrar varios titulares de descriptor. Consultar el servicio asociado en `systemctl list-sockets` y su configuración puede ser más útil que etiquetar el PID 1 como sospechoso. Un servidor puede escuchar en namespace de contenedor y publicarse vía proxy/NAT sobre el host: inspecciona el espacio de red correcto con herramientas legítimas (`ip netns exec` en namespaces creados para el lab, `nsenter -t PID -n` en producción **solo si autorizado**). [DOC:N04]

**Regla de oro:** «No sale en `ss` del host» no implica «no existe escucha» ni «no hubo conexión». Consultar namespace, servicio proxy, contenedor, socket activation y observabilidad histórica.

# 9. SSH: arquitectura, identidad y flujo de confianza [DOC:N13–N17]

SSH transporta sesión cifrada autenticada, negociación criptográfica, autenticación de usuario y canales (shell, exec, subsistemas, forwarding). La confidencialidad de SSH depende también de **verificar la identidad del servidor**, proteger claves privadas y controlar privilegios del servidor.

## 9.1 Autenticación del servidor ≠ autenticación del usuario

- **Host key**: el cliente verifica que está hablando con el servidor esperado mediante confianza preexistente o validación externa del fingerprint/certificado. Un mensaje de cambio de clave puede significar reinstalación, balanceador, rotación legítima o ataque; no debe aceptarse automáticamente.
- **User key**: la clave pública autorizada en `authorized_keys` permite autenticar a un usuario según política SSH y cuenta. El permiso del usuario en el sistema sigue aplicando; una clave no vuelve la sesión «segura» por definición.
- **Password/MFA**: la exigencia real depende de `AuthenticationMethods`, métodos activados, PAM y eventual IdP; desactivar `PasswordAuthentication` no garantiza por sí solo que toda autenticación mediante contraseña sea imposible si hay `KbdInteractiveAuthentication` + PAM habilitado. [DOC:N13]

```bash
ssh -V
ssh -G host-lab.example | sed -n '1,50p'    # configuración cliente EFECTIVA
ssh-keygen -lf /ruta/ssh_host_ed25519_key.pub # fingerprint de copia autorizada
ssh-keygen -t ed25519 -a 64 -f "$HOME/.ssh/id_ed25519_t4_lab" -C 't4-lab'
chmod 700 "$HOME/.ssh"
chmod 600 "$HOME/.ssh/id_ed25519_t4_lab"
# Clave pública a distribuir en SERVIDOR DE LABORATORIO, no en hosts ajenos:
cat "$HOME/.ssh/id_ed25519_t4_lab.pub"
```

**No hagas:** `StrictHostKeyChecking=no` como solución genérica, `ssh-keyscan host >> known_hosts` sin comprobar fingerprint por canal confiable, guardar claves privadas en repositorios, imprimirlas en logs, reutilizar credenciales entre laboratorios y producción.

## 9.2 Servidor: configuración real y test [DOC:N13,N14]

```bash
# Sólo lectura en servidor autorizado:
sudo sshd -t
sudo sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication|authenticationmethods|allowtcpforwarding|x11forwarding|permitopen|permitlisten|loglevel|port|listenaddress) '
sudo sshd -T -C user=adminlab,host=lab.local,addr=192.0.2.10,laddr=192.0.2.20,lport=22
sudo ss -lntp '( sport = :22 )'
systemctl status ssh sshd --no-pager 2>/dev/null
```

`sshd -t` comprueba sintaxis/llaves; `sshd -T` imprime configuración efectiva; `-C` evalúa reglas `Match` que dependan de parámetros de conexión. `sshd -T` **sin `-C` no sustituye probar los Match de todos los usuarios y orígenes**, y las opciones soportadas varían por versión. Algunas distros cargan `/etc/ssh/sshd_config.d/*.conf` mediante `Include`, con reglas de precedencia: validar configuración efectiva, no el último archivo que se leyó. [DOC:N14]

**Baselines a justificar, no copiar ciegamente:**

| Decisión | Recomendación condicional | Riesgo de mala aplicación |
|---|---|---|
| `PermitRootLogin no` | Deshabilitar login remoto root si hay administración alternativa | Bloqueo de rescate o automatismos no migrados |
| `PubkeyAuthentication yes` | Claves gestionadas, passphrase/agent protegidos | Llave privada robada, permisos excesivos |
| `PasswordAuthentication no` | Tras verificar acceso alternativo y método interactivo/PAM | Cortar acceso legítimo si la clave falla |
| `KbdInteractiveAuthentication` | Verificar junto con PAM/MFA | Abrir ruta de contraseña sin pretenderlo |
| `AllowUsers` / `AllowGroups` | Reducir superficie a identidades autorizadas | Reglas `Match`/orígenes mal especificados |
| `AllowTcpForwarding` y `PermitOpen` | Restringir túneles según necesidad | Romper operaciones que dependen de túneles |
| `X11Forwarding no` | Deshabilitar donde no se usa | Fallos en usuarios que sí necesitan X11 |
| `LogLevel` apropiado | Calidad forense vs datos expuestos | Demasiado detalle/ruido o poca auditabilidad |

**Procedimiento de cambio seguro:** consola OOB/consola de hipervisor o segunda sesión abierta; backup y checksum; validación `sshd -t` + `-T -C`; `systemctl reload ssh(d)` según distro; sesión nueva en paralelo desde origen permitido; solo entonces cerrar la previa y registrar rollback. Nunca efectuar cambios de SSH y firewall simultáneos sin pruebas intermedias.

## 9.3 `authorized_keys` y acceso delimitado

Un archivo `~/.ssh/authorized_keys` puede contener restricciones como `from=`, `command=`, `no-pty`, `restrict`, `permitopen=` según la versión/configuración. Un `from=` depende de la procedencia observada por el servidor, que puede ser un NAT/proxy esperado; un `command=` impuesto no elimina otros riesgos si persisten forwarding, permisos de ficheros o binarios invocados. La mitigación real integra mínimo privilegio, shell, permisos, sudo, segmentación y gestión de claves. [DOC:N15]

**Indicadores SOC de acceso SSH a revisar en conjunto:** origen, cuenta, horario, método de autenticación, éxito/fracaso, huella de clave cuando haya registro, session id, TTY, proceso hijo, `sudo`, fichero `authorized_keys` modificado, nuevas listen/forward y flujos posteriores. No diagnosticar compromiso basándose solo en número de intentos: inventariar bastiones, escáneres autorizados, jump hosts y cambios de IP/VPN.

# 10. Túneles SSH: uso legítimo, abuso posible y visibilidad [DOC:N13,N16]

| Modalidad | Intención legítima | Señal y límite SOC |
|---|---|---|
| `ssh -L puerto_local:destino:puerto user@bastion` | Administrar servicio interno desde estación autorizada | Un puerto de escucha local y flujo SSH al bastión; destino final puede no figurar en red externa |
| `ssh -R puerto_remoto:destino:puerto user@bastion` | Exponer temporalmente servicio aprobado desde bastión | Reenvío remoto con implicación de `GatewayPorts`/`PermitListen` |
| `ssh -D puerto_local user@bastion` | Proxy SOCKS controlado de pruebas | Clientes locales conectan a SOCKS; salto final ocurre desde servidor |
| `ssh -J bastion user@destino` | Jump host auditado | Cadena de conexiones e identidad de hosts a verificar |
| `sftp` / `scp` | Transferencia segura | El canal SSH puede transferir ficheros; volumen y destino necesitan métricas adicionales |

**Importante:** ver `ssh -L` en una línea de comandos no prueba intención maliciosa; `sshd` puede permitir forwarding legítimo y la observabilidad no siempre incluye el destino real. Deshabilitar `AllowTcpForwarding` en `sshd_config` **no impide que un usuario con shell ejecute software propio de forwarding**, según la advertencia explícita de OpenSSH. Política completa = permisos + segmentación + control de egress + logging coherente. [DOC:N13]

[RT] Ejercicio de túnel autorizado: únicamente con bastión de laboratorio, credenciales de laboratorio y servicio local de prueba; medir qué ve cada sensor, qué queda cifrado y qué política autoriza el flujo. No se incluyen instrucciones para ocultarse o eludir controles empresariales.

# 11. nftables/Netfilter: flujo de decisión [DOC:N18–N22]

**Netfilter** es el mecanismo del kernel; **nftables** es la infraestructura y sintaxis moderna para definir reglas. Tablas contienen cadenas; una cadena *base* se registra con `type`, `hook`, `priority` y `policy`. Las cadenas normales no observan tráfico salvo salto desde otra cadena. Familias: `inet` (IPv4+IPv6), `ip` (IPv4), `ip6` (IPv6), `bridge`, `netdev`, otras según soporte.

```text
             paquete entrante
                     │
               ingress* → prerouting
                              │
                      decisión de ruta
                        /           \
                 local input        forward  → postrouting → salida
                    │
                 proceso
                    │
              local output → postrouting → salida

* ingress tiene límites/semántica propias según familia y versión.
```

## 11.1 Orden y efectos importantes

- `priority`: número menor se evalúa antes **dentro del mismo hook**. Las cadenas base pueden coexistir; a misma prioridad el orden relativo no está garantizado.
- `accept` en una cadena base no necesariamente significa autorización final: una cadena posterior en el mismo hook todavía puede hacer `drop`; `drop` sí termina el procesamiento del paquete en ese recorrido.
- `type nat` no se usa para filtrar tráfico general; evalúa el primer paquete que establece asociación NAT, mientras los posteriores siguen el estado/conntrack.
- Política `drop` sin reglas de loopback/ICMPv6/establecidas/SSH aprobadas puede interrumpir conectividad. La regla que «funciona» en VM sola puede fallar con Docker, VPN, firewall corporativo o cloud.
- `ct state established,related` compara estado de seguimiento del flujo, no usuario confiable, ni benignidad del paquete.

```bash
sudo nft list tables
sudo nft -a -nn list ruleset
sudo nft -j list ruleset > /tmp/t4-ruleset.json
# Validación sintáctica de archivo, SIN aplicar reglas:
sudo nft -c -f /ruta/a/reglas-de-laboratorio.nft
```

No ejecutar `nft flush ruleset` en el host para «limpiar», ni cargar una tabla completa sin saber qué otro gestor la mantiene. `nft list ruleset` es una **instantánea del estado**; puede haber cambios dinámicos de sets y reglas. Compara con archivos declarativos y logs del gestor que realmente persiste la política.

## 11.2 Reglas de muestra para namespace de LABORATORIO (sin aplicar al host)

Este ejemplo es deliberadamente **solo una cadena `input` dentro de `t4srv`**, sin regla de `output`, para aislar evaluación de entrada; la segunda máquina virtual de red no tiene ruta al Internet real. Para un filtro real faltan requisitos de segmentación, administración, ICMPv6 y políticas de otras cadenas.

```nft
# Archivo: /tmp/t4-input-lab.nft  (SOLO ejecutar con `ip netns exec t4srv`)
add table inet t4lab
add chain inet t4lab input { type filter hook input priority 0; policy drop; }
add rule inet t4lab input iifname "lo" accept
add rule inet t4lab input ct state established,related accept
add rule inet t4lab input ip protocol icmp accept
add rule inet t4lab input ip saddr 10.44.0.1 tcp dport 8080 counter accept
add rule inet t4lab input counter drop
```

**Semántica:** `10.44.0.1` está en un segmento virtual privado creado para el lab; `8080` aloja un servidor HTTP inofensivo; no se pretende que esta sea una política completa dual stack. Comprueba `sudo ip netns exec t4srv nft -c -f /tmp/t4-input-lab.nft` antes de aplicarla y repite `nft -a list ruleset` **dentro de la namespace**. Si también existen cadenas base de otros gestores dentro del namespace, la admisión final depende de todas ellas.

# 12. Stateful firewall, conntrack y NAT [DOC:N20–N23]

`conntrack` mantiene estado de flujos que usa filtrado stateful y NAT, con límites de memoria/capacidad y timeouts. Un NAT conserva traducciones para que las respuestas puedan regresar; **NAT no es un control de autorización suficiente**. Ejemplos de observación, no mutación:

```bash
# Según paquete/permisos/carga, puede no estar disponible:
sudo conntrack -L 2>/dev/null | head -30
sysctl net.netfilter.nf_conntrack_count 2>/dev/null
sysctl net.netfilter.nf_conntrack_max 2>/dev/null
sudo nft -a -nn list ruleset | grep -Ei 'masquerade|snat|dnat|ct state'
```

Un flujo `ESTABLISHED` con muchos bytes es relevante, pero puede ser backup, replicación, descargas o transferencia empresarial. Para atribución necesitarás correlacionar PID/cgroup/usuario y contexto de aplicación, volumen real desde fuente fiable, certificado/HTTP si lícito, destino y horarios. Una tabla conntrack llena puede generar pérdidas de nuevas conexiones y aparentar ataque cuando hay alta concurrencia legítima. **No borrar conntrack globalmente** para «resetear» sin entender impacto.

# 13. UFW, firewalld, iptables: gestores y compatibilidad [DOC:N24–N26]

| Herramienta | Qué es | Inspección recomendada | Advertencia |
|---|---|---|---|
| `nft` / nftables | Interfaz y reglas nativas nf_tables | `nft -a list ruleset` | Ver todas las tablas/familias/hooks |
| `iptables-nft` | Compatibilidad iptables sobre backend nft | `iptables -V`, `iptables-save` | No asumir identidad de sintaxis o reglas entre frontends |
| `iptables-legacy` | Backend heredado independiente | `iptables -V`; herramientas legacy correspondientes | Reglas legacy y nft pueden coexistir: auditar ambas |
| UFW | Gestor simplificado, común en Ubuntu | `ufw status verbose` | Su estado no describe necesariamente reglas ajenas al gestor |
| firewalld | Gestor por zonas, políticas, servicios y runtime/permanent | `firewall-cmd --state`, `--get-active-zones`, `--list-all` | La zona de interfaz y la persistencia importan |
| Cloud SG/NACL | Controles fuera de Linux | Consola/CLI de plataforma autorizada | Un `accept` en host no supera un drop cloud |

```bash
command -v ufw && sudo ufw status verbose
command -v firewall-cmd && sudo firewall-cmd --get-active-zones
command -v firewall-cmd && sudo firewall-cmd --list-all
command -v iptables && sudo iptables -V
command -v iptables-save && sudo iptables-save
command -v ip6tables-save && sudo ip6tables-save
```

**Cambios seguros:** identifica **un propietario** de la política (`nftables.service`, UFW, firewalld, plataforma de automatización), exporta reglas, valida cambios declarativos, define acceso de emergencia OOB y rollback temporizado, prueba IPv4 **y** IPv6 desde estación autorizada. Si se gestiona por Ansible/IaC o política cloud, haz el cambio en su fuente de verdad; de otro modo podría revertirse en minutos.

**Ejemplo conceptual UFW, NO aplicable sin plan:** `ufw allow from DIRECCION_GESTION to any port 22 proto tcp`. Antes de usarlo, confirmar que el servicio SSH escucha, que esa IP representa la de origen a ojos del servidor y que no hay un proxy/bastión diferente. En firewalld, distinguir cambios `--permanent` de runtime: una recarga puede cambiar el estado que ve el analista. [DOC:N24–N26]

# 14. Política de egreso, bloqueo de IP y respuesta a exfiltración

Ante «el servidor está enviando datos a una IP desconocida y queda un minuto», **no hay una receta universal de 60 segundos**. La seguridad del dato y la cadena de respuesta exigen aplicar un control de contención fiable desde el lugar adecuado, con comunicaciones y autoridad predefinidas.

## 14.1 Principio: bloquear un destino no equivale a contener el incidente

- **Bloquear IP remota:** puede parar **ese** flujo hacia **esa** IP en ese punto de control, pero no impide que el actor use otra IP, IPv6, DNS, otro protocolo, otro host, proxy o credenciales ya robadas.
- **Bloquear puerto 443:** puede frenar servicios críticos y no resuelve exfiltración por otros puertos.
- **Matar PID:** puede interrumpir transferencia observada, pero perder evidencia volátil o forzar otro proceso a reintentar; además, el PID puede ser componente legítimo (agente backup/proxy) comprometido o abusado.
- **Borrar `crontab`:** es mutación potencialmente destructiva de evidencia y no cubre timers systemd, servicios, agentes ni persistencias de otras capas.
- **Desconectar NIC/host:** puede ser la mejor contención en ciertos entornos, pero arriesga pérdida de evidencia volátil, acceso remoto y disponibilidad. Se decide según autoridad, criticidad y plan IR.

## 14.2 Árbol de decisión operativo (SOC/IR)

1. **Confirmar alertas y alcance:** host, activo, origen y destino, servicio, volumen medido, hora y sensor, criticidad y riesgo de propagación; no asumir que el dashboard refleja todos los flujos.
2. **Declarar incidente y escalar:** playbook, responsable y autorización de contención. En un incidente grave con señales inequívocas, priorizar un control eficaz según procedimiento preaprobado, no una investigación completa antes de actuar.
3. **Contener en el punto apropiado:** aislamiento EDR/NAC/hipervisor o egress deny en firewall perimetral, cloud SG/NACL, proxy o segmentación de red, teniendo en cuenta comunicaciones de respuesta que deben mantenerse.
4. **Capturar mínimo volátil si es seguro y no retrasa contención:** UTC, `ss -tanop`, rutas/interfaces, procesos, relaciones PPID, journald, reglas efectivas, contadores del sensor, capturas limitadas. Si contención debe ser inmediata, registrar esa prioridad y recoger después.
5. **Analizar por hipótesis:** backup autorizado, actualizaciones, transferencia de datos legítima, C2/exfiltración, credenciales de nube comprometidas, contenedor, túnel.
6. **Probar que la contención funciona:** desde dos niveles (host + red/EDR), tasa de bytes/salidas y endpoints alternos; verificar que no se traslada a IPv6/otro proceso/otra máquina.
7. **Recuperación y cierre:** erradicar vector, rotar credenciales comprometidas, hardening, reabrir únicamente flujos permitidos, mantener vigilancia y evidencia preservada.

**Ejemplo de control perimetral:** una regla de egress *deny* sobre el **segmento o identidad de workload** puede ser más resistente al cambio de IP que una regla local por IP concreta, siempre que coincida con el camino real del tráfico, cubra IPv4/IPv6 y excepciones, y no destruya disponibilidad crítica. No existe un control mágico que contenga absolutamente todos los canales sin diseñar límites de red y privilegios.

# 15. Captura de tráfico y límites forenses [DOC:N10,N27]

```bash
# Capturar EN LAB, en interfaz veth de la namespace, durante pocos segundos:
sudo ip netns exec t4srv tcpdump -i t4s -nn -s 128 \
  -c 25 -w /tmp/t4-lab.pcap 'host 10.44.0.1 and tcp port 8080'
sha256sum /tmp/t4-lab.pcap
# Leer sin enviar paquetes:
tcpdump -nn -r /tmp/t4-lab.pcap
```

`-s 128` limita bytes por paquete para minimizar payload, pero **no garantiza ausencia de datos personales**; las cabeceras contienen IP, puertos, metadatos y eventualmente parte de la carga. `-c` limita cantidad. Si el sensor está después de offloading, NAT, TLS termination o túnel, la captura cambia radicalmente. Un `tcpdump` en un solo punto puede perder paquetes por buffer/saturación; comprueba contadores de captura y timestamps. PCAP no prueba por sí solo el PID del proceso.

**Custodia mínima:** autorización, finalidad, intervalo UTC, zona horaria del sistema, interfaz, namespace, filtro BPF, tamaño/snaplen, nombre del analista, archivo inmutable o controlado, SHA-256 y repositorio restringido. No captures passwords, tokens o tráfico de terceros sin fundamento y permisos explícitos. [DOC:N10]

## 15.1 Herramientas y campos para correlación

| Fuente | Campos/uso | Principal limitación |
|---|---|---|
| `ss` | protocolo, IPs/puertos, estado, PID si permitido | Snapshot efímera, procesos ocultos sin privilegios |
| PCAP | 5-tuple, tiempos, flags, tamaños, handshake | Atribución al proceso, cifrado, pérdida/captura parcial |
| DNS | query, answer, TTL, resolver, interfaz | Caché/DoH/proxy; consulta no equivale a conexión |
| SSH journal/auth.log | usuario, método, origen, estado, sesión | Retención/config, autenticación no prueba propósito |
| nft/conntrack | decisiones/counters/estado cuando habilitados | Logging no siempre activado, NAT cambia visión |
| EDR/eBPF audit | PID, ejecutable, usuario/cgroup, eventos | Requiere sensor, política y cobertura verificada |
| FW/SG/cloud/VPC flow | flujos agregados y controles de perímetro | Frecuentemente no incluye proceso ni payload |

# 16. SSH y firewall: registros SOC y semántica [DOC:N13,N24]

```bash
# Rutas y unidades dependen de la distribución:
journalctl -u ssh -u sshd --since '1 hour ago' --no-pager
sudo grep -Ei '(Accepted|Failed|Invalid user|Disconnected)' /var/log/auth.log 2>/dev/null | tail -50
sudo grep -Ei '(Accepted|Failed|Invalid user|Disconnected)' /var/log/secure 2>/dev/null | tail -50
sudo nft -nn -a list ruleset
```

En Debian/Ubuntu se puede registrar en `/var/log/auth.log` según syslog/rsyslog, y en RHEL es común `/var/log/secure`; pueden faltar por diseño, estar rotados, usar journald exclusivamente o centralizarse. El formato de líneas OpenSSH cambia por versión/LogLevel. Un evento `Accepted publickey` es evidencia de **autenticación aceptada** si la fuente es íntegra, no prueba ausencia de abuso de esa cuenta. `Failed password` repetido puede corresponder a contraseña incorrecta, bot o pentest autorizado. [SOC] Correlacionar con inventario de VPN/bastiones, intentos por usuario/origen, MFA donde aplique, sesión iniciada, comandos (con sensor adecuado) y egress posterior.

# 17. Detecciones SOC con hipótesis, datos, prueba y límites

> Los identificadores `T4-Dxx` enlazan directamente con el JSON. Son **diseños de detección**, no reglas de producción ni resultados de medición. Antes de convertir a SIEM (Splunk/Sentinel), mapear a esquema real y ensayar cobertura.

| ID | Hipótesis / disparador de alto nivel | Correlación obligatoria | Posibles falsos positivos |
|---|---|---|---|
| T4-D01 | Listener nuevo en interfaz no prevista o puerto sensible | Baseline host/namespace, servicio, PID, cambio aprobado | Deploy, socket activation, sidecar |
| T4-D02 | Host establece flujo de egreso a destino no inventariado | Proceso/usuario, bytes, DNS, política, ventana | Backup, CDN, telemetría, actualizaciones |
| T4-D03 | SSH exitoso desde origen raro o cuenta no habitual | Métodos, usuario, VPN, MFA, sesiones previas | Viaje, VPN, jump host, rotación |
| T4-D04 | Ráfaga de SSH fallido seguida de autenticación aceptada | Método, user, IP/proxy, número de hosts | Prueba autorizada, IP NAT compartida |
| T4-D05 | Cambio en `authorized_keys` + nueva conexión | Identidad, responsable de despliegue, commit, origen | Rotación autorizada de claves |
| T4-D06 | Reglas nft/firewalld reducen protección o deshabilitan logging | Drift declarativo, actor, ticket, tiempo | Emergencia aprobada, upgrade |
| T4-D07 | Host inicia SSH a bastión/destino no habitual y aparece listener local | Proceso, línea de comandos, destino, jump hosts | Port forward administrativo legítimo |
| T4-D08 | DNS atípico + conexión nueva + volumen anómalo | Consultas, destino, sensor de bytes, app | CDN, migraciones, pruebas |
| T4-D09 | Ruta/servidor DNS cambia fuera de cambio aprobado | NM/resolved, VPN, DHCP, servicio, kernel | Activación VPN, failover DHCP |
| T4-D10 | Contadores de caída/conntrack crecen con incidencia de red | Interfaces, reglas, recursos, logs, volumen normal | Carga legítima, escaneo aprobado |

**Patrón de evaluación:** precisión = TP/(TP+FP); recall/TPR = TP/(TP+FN). No declare detección «100 %» sin verdad terreno y cobertura; mide latencia de alerta, horas sin telemetría, sesgo de conexiones efímeras, deduplicación por NAT e intensidad de tráfico legítimo. Conviene probar positivos, negativos y variantes de IP/IPv6/proxy.

# 18. Protocolo Red Team autorizado: evaluar red sin interrumpir servicio

El Red Team de esta tanda se limita a **alcance explícito, objetivos del lab y validación de exposición**. No escanees redes externas o corporativas fuera de autorización. Debes poder responder:

1. ¿Qué interfaces, rutas y puertos locales son alcanzables desde el segmento de pruebas? Verificar desde ambos extremos, no inferirlo de `ss`.
2. ¿Qué rol tiene cada puerta de acceso? Identificar bastión, orígenes permitidos y si SSH pide clave y/o MFA.
3. ¿Existe servicio inesperado publicado por proxy, túnel o namespace? Mantener actividad inocua y medir señales defensivas.
4. ¿El firewall protege entrada **y** egreso según el requisito? Probar puerto permitido y denegado con servicio controlado, registrar contadores y resultado.
5. ¿Es posible confundir autenticación de un host? Demostrar que el cliente **rechaza** host key no validada sin interceptar usuarios reales.
6. ¿La telemetría distingue una transferencia administrativa de un flujo no autorizado? Usar contenido sintético y medir volumen.

**Evidencia esperada:** plan y ROE (*rules of engagement*), topología de lab, rutas, puertos, fecha UTC, capturas o logs mínimos, condiciones del sensor, impacto nulo, hallazgo con causa raíz, remediación y retest. Un hallazgo sin prueba reproducible es una hipótesis, no una vulnerabilidad confirmada.

# 19. Laboratorio base aislado con dos network namespaces [DOC:N04,N05]

**Requisitos:** VM Linux *descartable* con acceso de consola, `sudo`, `iproute2`, `python3`, `curl`; opcional `nftables`, `tcpdump`. El kernel/hipervisor debe permitir crear namespaces; en contenedores gestionados puede faltar `CAP_NET_ADMIN`. **No ejecutar en producción.** No conectar ninguna veth a bridge, NIC física, VPN ni host externo.

## 19.1 Construcción segura y limpieza

```bash
# Crear desde consola en VM de laboratorio. Los nombres t4cli/t4srv
# son exclusivos de estas prácticas. Si ya existen, NO sobrescribir.
sudo ip netns add t4cli
sudo ip netns add t4srv
sudo ip link add t4c type veth peer name t4s
sudo ip link set t4c netns t4cli
sudo ip link set t4s netns t4srv
sudo ip netns exec t4cli ip addr add 10.44.0.1/24 dev t4c
sudo ip netns exec t4srv ip addr add 10.44.0.2/24 dev t4s
sudo ip netns exec t4cli ip link set lo up
sudo ip netns exec t4srv ip link set lo up
sudo ip netns exec t4cli ip link set t4c up
sudo ip netns exec t4srv ip link set t4s up
sudo ip netns exec t4cli ip -br addr
sudo ip netns exec t4srv ip -br addr
sudo ip netns exec t4cli ip route get 10.44.0.2
sudo ip netns exec t4cli ping -c 2 -W 1 10.44.0.2
```

**Servidor de prueba:** crear el contenido en la VM de lab, no usar datos privados:

```bash
mkdir -p /tmp/t4-web
printf 'T4 LAB: DATOS FICTICIOS\n' > /tmp/t4-web/index.html
# Lanzar en una segunda terminal, no en segundo plano sin supervisión:
sudo ip netns exec t4srv python3 -m http.server 8080 \
  --bind 10.44.0.2 --directory /tmp/t4-web
# Desde otra terminal:
sudo ip netns exec t4cli curl --max-time 3 -v http://10.44.0.2:8080/
```

**Limpieza:** detener servidor con Ctrl+C; **antes** de eliminar namespaces, terminar procesos restantes dentro de ellos de forma controlada; `sudo ip netns pids t4srv` / `sudo ip netns pids t4cli`. Después: `sudo ip netns del t4cli` y `sudo ip netns del t4srv`; las interfaces veth asociadas desaparecen al destruir sus namespaces cuando no haya referencias. Verifica `ip netns list`. **No** usar `ip link del` con nombres genéricos en el host real; no borrar ningún namespace preexistente.

## 19.2 Aplicación y reversión de nftables en el namespace

Usar el archivo de la sección 11.2 después de confirmar que el namespace existe y está aislado:

```bash
sudo ip netns exec t4srv nft -c -f /tmp/t4-input-lab.nft
sudo ip netns exec t4srv nft -f /tmp/t4-input-lab.nft
sudo ip netns exec t4srv nft -a list ruleset
sudo ip netns exec t4cli curl --max-time 3 http://10.44.0.2:8080/
# Rollback SOLO de la tabla creada en el namespace (no del host):
sudo ip netns exec t4srv nft delete table inet t4lab
```

**Cuidado:** no volver a cargar el archivo `add table` sobre la misma tabla existente: obtendrás un error; revertir y reproducir de forma limpia. `policy drop` afecta también ICMP de prueba si no está explícitamente permitido, aunque HTTP/8080 se acepte. Que `curl` funcione no garantiza que todos los protocolos permitidos en un host corporativo estén contemplados.

# 20. Catálogo de 10 laboratorios evaluables

Los detalles, matrices, preguntas y evidencias estructuradas están también en `Linux_SOC_RedTeam_Tanda4_Catalogo.json`. **Peso total: 100 puntos**.

| ID | Práctica | Puntos | Infraestructura | Criterio de aceptación principal |
|---|---|---:|---|---|
| T4-L01 | Inventario de IP/rutas/DNS y contexto | 8 | VM aislada | Inventario reproducible, hipótesis vs hechos |
| T4-L02 | Diagnóstico TCP/UDP + servicios | 10 | VM y namespace | Demostrar LISTEN/ESTAB, PID y límites |
| T4-L03 | Dos namespaces, veth y rutas | 10 | VM con CAP_NET_ADMIN | Comunicación interna y cleanup sin impacto |
| T4-L04 | Política nftables con rollback | 14 | namespaces T4 | HTTP permitido, prueba denegada y contadores |
| T4-L05 | Configuración efectiva SSH + claves | 10 | Servidor SSH de laboratorio | `sshd -t`, `-T -C`, fingerprints y acceso alternativo |
| T4-L06 | Túnel SSH aprobado y evidencias SOC | 10 | 2 VM/bastión de lab | Distinguir flujo externo y servicio reenviado |
| T4-L07 | Captura PCAP mínima y custodia | 10 | veth T4 | BPF correcto, SHA-256, limitaciones descritas |
| T4-L08 | DNS vs red/IPv4/IPv6: diagnóstico | 8 | VM aislada | Árbol de fallos y falsación de hipótesis |
| T4-L09 | Simulación de anomalía de egreso | 10 | VM y datos ficticios | Decisión IR, evidencia previa/poscontención |
| T4-L10 | Correlación SOC y retest defensivo | 10 | logs sintéticos + lab | 3 detecciones con positivos/negativos |

Los laboratorios T4-L03/L04/L07 comparten un mismo entorno, pero las rúbricas puntúan habilidades distintas. T4-L05/L06 **no** deben ejecutarse en un SSH de acceso remoto real sin consola OOB o rollback probado. En T4-L09 se usa un destino y dataset ficticios del propio lab, no se solicita generar tráfico real de exfiltración.

# 21. Runbooks de troubleshooting por síntoma (orden de verificación)

## 21.1 «No puedo conectarme por SSH»

1. Confirmar ruta/origen y puerto **desde el cliente** (`ssh -vvv` con log restringido; nunca subir logs con claves/credenciales).
2. Comprobar listener en **servidor** (`ss`, systemd socket/servicio, puerto y bind/IPv6).
3. Comprobar reglas de host, zonas, cloud, firewall de red y NAT en ese orden lógico de flujo.
4. Revisar logs de rechazo de conexión y autenticación: una denegación TCP **no** es un fallo de contraseña.
5. Comprobar host key y método efectivo SSH (`sshd -t`, `-T -C`), permisos de `.ssh`, cuenta, PAM y herramientas externas.
6. Probar recuperación desde consola/OOB y documentar cambio.

## 21.2 «DNS responde pero la aplicación no»

1. Comparar `getent ahosts HOST` frente a `resolvectl query HOST`, si aplica.
2. Identificar dirección realmente elegida por cliente (IPv4/IPv6), proxy y SNI.
3. `ip route get` hacia esa dirección desde namespace correcta.
4. Verificar SYN/SYN-ACK/RST o tráfico UDP aplicable, con PCAP controlado si autorizado.
5. Separar error TCP de error TLS/certificado, HTTP o permisos en aplicación.

## 21.3 «Conexiones salen aunque el firewall parece bloquearlas»

1. ¿Inspeccionaste todas las familias, hooks, chains y managers, incluido output?
2. ¿Hay namespace/contenedor, proxy, VPN, bypass por ruta u offload?
3. ¿La regla se aplica a **entrada** cuando el flujo es **saliente**? ¿La dirección es la vista *antes* o *después* de NAT?
4. ¿Los contadores cambian durante una prueba controlada? ¿Existen flujos preexistentes u otras cadenas posteriores?
5. ¿Hay control fuera del host en cloud/SASE/SWG? Contrastar con logs de red.

# 22. Errores habituales de examen y de producción

1. «`ss -tulnp` me muestra todos los ataques»: solo sockets actuales visibles en la namespace y con los privilegios de consulta.
2. «Puerto 22 abierto significa exposición pública»: faltan ruta/filtros y origen de prueba.
3. «Cambio la IP del atacante y se acabó el riesgo»: puede cambiar destino o ruta, usar otro host o credenciales.
4. «`kill -9 PID` es contención definitiva»: elimina un proceso, no necesariamente persistencia, canal, credenciales o evidencia.
5. «Todo tráfico HTTPS es seguro»: TLS protege transporte, no legitimidad de destino/acción.
6. «`ct established` es tráfico confiable»: describe seguimiento, no evaluación de amenazas.
7. «`accept` gana frente a todas las cadenas»: no necesariamente en base chains posteriores del mismo hook.
8. «UFW/firewalld es equivalente a `nft list ruleset`»: el gestor puede representar solo su propio estado declarativo.
9. «Bloquear ICMP/ICMPv6 entero endurece redes»: rompe diagnósticos, PMTUD y funciones IPv6.
10. «Hice `sshd -t`, por tanto las reglas `Match` están bien»: falta `sshd -T -C` y pruebas de acceso reales.
11. «`ssh-keyscan` verifica identidad por sí solo»: recoge clave observada, no establece confianza independiente.
12. «El PCAP demuestra qué usuario exfiltró»: no identifica usuario/PID sin otra evidencia fiable.
13. «`dig` coincide siempre con la resolución de `getent`»: NSS y resolución de aplicaciones pueden diferir.
14. «Como no veo salida en IPv4, el servidor está aislado»: auditar IPv6, VPN, proxy, namespaces y otros sistemas.
15. «No hubo alertas = no hubo eventos»: depende de sensor, cobertura, retención, silencios y umbrales.

# 23. Cuestionario de 30 preguntas — nivel SOC N1/N2 + RT

**Fundamentos y diagnóstico (Q01–Q10)**

1. Q01: ¿Por qué una IP que escucha en `0.0.0.0` no demuestra exposición en Internet?
2. Q02: ¿Qué cambia entre `ip route show table main` e `ip route get DEST`?
3. Q03: ¿Cómo diagnosticarías IPv4 correcto e IPv6 fallando sin desactivar IPv6?
4. Q04: ¿Qué distingue `LISTEN`, `ESTAB`, `CLOSE-WAIT` y `TIME-WAIT`?
5. Q05: ¿Qué dos mecanismos explican que `ss` del host no muestre un servicio accesible?
6. Q06: ¿Por qué una consulta DNS no prueba conexión a la IP resuelta?
7. Q07: ¿En qué situaciones `getent`, `resolvectl` y `dig` darían resultados diferentes?
8. Q08: ¿Qué cuatro causas permiten un timeout aun cuando un servicio está escuchando?
9. Q09: ¿Qué evidencia diferencia una ruta asimétrica de un filtro stateful?
10. Q10: ¿Qué implicaciones tiene la MTU para tráfico encapsulado y PMTUD?

**SSH y política (Q11–Q20)**

11. Q11: ¿Qué diferencia hay entre host key y user key?
12. Q12: ¿Por qué `ssh-keyscan` no basta para validar host keys?
13. Q13: ¿Qué aportan `sshd -t`, `sshd -T` y `sshd -T -C` respectivamente?
14. Q14: ¿Por qué desactivar `PasswordAuthentication` no demuestra automáticamente ausencia de acceso con contraseña?
15. Q15: ¿Qué evidencias relacionarías con una clave nueva en `authorized_keys`?
16. Q16: ¿Qué puede mostrar el sensor sobre un túnel `ssh -L` y qué permanece opaco?
17. Q17: ¿Qué diferencia hay entre cadena nft base y cadena regular?
18. Q18: ¿Por qué `accept` en una cadena no siempre permite el flujo completo?
19. Q19: ¿Por qué NAT no es una política de autorización?
20. Q20: ¿Cómo detectarías el gestor real de firewall antes de hacer cambios?

**Incidentes, forense y ejercicios (Q21–Q30)**

21. Q21: ¿Qué medirías antes y después de contener un flujo anómalo?
22. Q22: ¿Cuándo preferirías un control de egress por segmento/workload frente a IP puntual?
23. Q23: ¿Por qué `kill -9` puede degradar una investigación?
24. Q24: ¿Qué distingue un contador nft de un registro de red persistente?
25. Q25: ¿Qué metadata mínima debe acompañar un PCAP para que sea utilizable?
26. Q26: ¿Qué riesgos de privacidad persisten con `tcpdump -s 128`?
27. Q27: ¿Cómo demostrarías que una regla se aplica solo al namespace del laboratorio?
28. Q28: ¿Cómo elaborarías falso positivo y falso negativo para T4-D02?
29. Q29: ¿Qué pruebas exigirías antes de anunciar «SSH seguro» en una VM?
30. Q30: ¿Qué diferencias esperas entre tráfico observado en el host y en el firewall perimetral detrás de NAT?

**Criterio de autocorrección:** responder en 2–5 frases cada pregunta con concepto, comando o evidencia, interpretación y límite. Para preguntas 21–30, proponer además un test que pudiera **refutar** tu hipótesis.

# 24. Caso integral trabajado: «salida masiva inesperada a las 03:00»

**Escenario ficticio y delimitado:** en una VM de lab, a las 03:00 UTC un sensor declara 4 GB hacia `203.0.113.50:443`; al entrar al host no aparece usuario interactivo nuevo en panel. Lo que sabemos: sensor reporta bytes; aún **no** conocemos si son backup, proceso legítimo, túnel, malware o error de medición.

### Primera respuesta propuesta

**T+0–30 s** — levantar severidad según impacto/dato y pedir o ejecutar aislamiento **ya autorizado** en red/EDR. Confirmar quién mide bytes y si `203.0.113.50` identifica el destino antes de NAT; abrir incidente. Capturar hora, host y evidencia del sensor. No usar SSH activo como prueba de «nadie conectado»; procesos y tokens de servicio pueden originar tráfico sin login interactivo.

**T+30–60 s** — si la política de emergencia lo permite, contener egress de workload/segmento afectado sin cortar innecesariamente rutas de IR. Verificar que desciendan bytes de salida; vigilar IPv6, proxy, otro destino y otros nodos. Si el playbook privilegia aislamiento total por riesgo de fuga, usarlo y anotar pérdida esperada de evidencia en memoria.

**Después de contener** — obtener inventario de conexiones/procesos, cgroups, `journalctl`, reglas nft, crons/timers (T2), logs SSH y secuencia de cambios; preservar antes de corregir. Preguntar por tareas de backup y despliegues; comprobar hash, ruta y firmante del binario identificado. Crear hipótesis y compararlas contra retención real de EDR/red.

### Tabla de conclusiones correctas

| Observación | Se puede decir | No se puede decir |
|---|---|---|
| Firewall ve 4 GB salientes | Alto volumen hacia un destino según contador/sensor | Que se extrajeron exactamente 4 GB de datos sensibles |
| `ss` ya no lista la sesión | No está visible en ese instante/namespace | Que no hubo tráfico o que el actor se fue |
| PID de proceso legítimo hizo conexión | Ese proceso aparenta estar asociado al socket | Que nadie abusó de ese proceso/credenciales |
| IP bloqueada y baja volumen | Medida eficaz para ruta medida en esa ventana | Erradicación total de la amenaza |
| PCAP muestra TLS cifrado | 5-tuple, tiempos y bytes observables | Contenido o intención sin evidencia adicional |

**Salida profesional:** incidente con cronología, riesgo de negocio, origen de datos, grado de confianza, medidas, impacto, hipótesis abiertas, propietarios de remediación y métricas de vigilancia posterior.

# 25. Prerrequisitos y conexión con la Tanda 5

Antes de abordar T5 debes manejar `journalctl`, servicio systemd, permisos, Bash, estados de procesos, `ip`, `ss`, DNS, SSH y nftables en VM aislada. La siguiente tanda integrará **PAM, SELinux/AppArmor, hardening y mínimo privilegio; journald/syslog/auditd y telemetría de investigación SOC; rendimiento/troubleshooting, automatización, contenedores y Red Team en laboratorio**, más el itinerario y evaluación final. No confundir las introducciones a logging de este informe con una cobertura completa de auditd o DFIR de memoria.

**Secuencia sugerida en esta tanda:** día 1 modelos y rutas → día 2 sockets/DNS → día 3 SSH → día 4 nftables → día 5 captura/IR → día 6 laboratorios y retest. Evaluación se basa en evidencia, no en completar comandos a ciegas.

# 26. Documentación oficial, manuales y referencias

URLs verificadas para fundamentar conceptos; el comportamiento específico ha de contrastarse con `man` y versiones de la VM empleada. Referencia **por identificador** en el cuerpo; fuentes consultadas el 2026-10-18. Documentación oficial o primaria cuando está disponible.

| ID | Recurso | URL | Uso principal |
|---|---|---|---|
| N01 | ip-route(8) — iproute2/man7 | https://man7.org/linux/man-pages/man8/ip-route.8.html | Rutas, `route get`, política |
| N02 | ip-address(8) — iproute2/man7 | https://man7.org/linux/man-pages/man8/ip-address.8.html | Inventario de direcciones |
| N03 | ss(8) — iproute2/man7 | https://man7.org/linux/man-pages/man8/ss.8.html | Sockets y límites |
| N04 | network_namespaces(7) — man7 | https://man7.org/linux/man-pages/man7/network_namespaces.7.html | Namespace de red |
| N05 | ip-netns(8) — iproute2/man7 | https://man7.org/linux/man-pages/man8/ip-netns.8.html | Laboratorio namespaces |
| N06 | ip-rule(8) — man7 | https://man7.org/linux/man-pages/man8/ip-rule.8.html | Policy routing |
| N07 | resolvectl — systemd | https://www.freedesktop.org/software/systemd/man/257/resolvectl.html | DNS de systemd-resolved |
| N08 | systemd-resolved.service — systemd | https://www.freedesktop.org/software/systemd/man/257/systemd-resolved.service.html | Stub y resolución |
| N09 | systemd.socket — systemd | https://www.freedesktop.org/software/systemd/man/257/systemd.socket.html | Socket activation |
| N10 | tcpdump(8) — manual | https://man7.org/linux/man-pages/man8/tcpdump.8.html | Captura y snaplen |
| N11 | ip-link(8) — iproute2 | https://man7.org/linux/man-pages/man8/ip-link.8.html | Interfaces |
| N12 | IP sysctl — Linux kernel | https://docs.kernel.org/networking/ip-sysctl.html | rp_filter, PMTUD, TCP |
| N13 | sshd_config(5) — OpenSSH/OpenBSD | https://man.openbsd.org/sshd_config.5 | SSH, autenticación, forwarding |
| N14 | sshd(8) — OpenSSH/OpenBSD | https://man.openbsd.org/sshd.8 | -t, -T, -C |
| N15 | authorized_keys / sshd(8) — OpenSSH | https://man.openbsd.org/sshd.8 | Restricciones de claves |
| N16 | ssh(1) — OpenSSH/OpenBSD | https://man.openbsd.org/ssh.1 | L/R/D/J, host checks |
| N17 | ssh_config(5) — OpenSSH/OpenBSD | https://man.openbsd.org/ssh_config.5 | Configuración cliente |
| N18 | Quick reference — nftables wiki | https://wiki.nftables.org/wiki-nftables/index.php/Quick_reference-nftables_in_10_minutes | Familias, tablas, reglas |
| N19 | Configuring chains — nftables wiki | https://wiki.nftables.org/wiki-nftables/index.php/Configuring_chains | Hooks, priority y accept |
| N20 | Netfilter hooks — nftables wiki | https://wiki.nftables.org/wiki-nftables/index.php/Netfilter_hooks | Recorrido del paquete |
| N21 | Sets — nftables wiki | https://wiki.nftables.org/wiki-nftables/index.php/Sets | Listas dinámicas |
| N22 | nft(8) — netfilter manual | https://netfilter.org/projects/nftables/manpage.html | CLI, reglas, checks |
| N23 | conntrack — Netfilter | https://conntrack-tools.netfilter.org/ | Seguimiento de conexiones |
| N24 | Firewall — Ubuntu Server | https://documentation.ubuntu.com/server/how-to/security/firewalls/index.html | UFW y cautelas |
| N25 | firewalld — RHEL 9 | https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_firewalls_and_packet_filters/using-and-configuring-firewalld_firewall-packet-filters | Zonas, runtime/permanente |
| N26 | Ubuntu Security — Linux Firewall | https://documentation.ubuntu.com/security/security-features/network/firewall/ | iptables/nftables/ufw |
| N27 | Wireshark — referencia TCP | https://www.wireshark.org/docs/dfref/t/tcp.html | Interpretar retransmisiones |
| N28 | RFC 5737 — IPv4 documentación | https://www.rfc-editor.org/rfc/rfc5737 | Direcciones de ejemplos |
| N29 | RFC 3849 — IPv6 documentación | https://www.rfc-editor.org/rfc/rfc3849 | Ejemplos IPv6 |
| N30 | RFC 8200 — IPv6 | https://www.rfc-editor.org/rfc/rfc8200 | Semántica IPv6 |
| N31 | RFC 8446 — TLS 1.3 | https://www.rfc-editor.org/rfc/rfc8446 | Observabilidad limitada de cifrado |
| N32 | tcp(7) — man7 | https://man7.org/linux/man-pages/man7/tcp.7.html | Estados/semántica de TCP |

# 27. Hoja de entrega y trazabilidad

**Archivo principal:** `Linux_SOC_RedTeam_Tanda4_Informe.md`.

**Archivo estructurado:** `Linux_SOC_RedTeam_Tanda4_Catalogo.json` (10 labs, 30 preguntas, 10 detecciones SOC, rúbricas, riesgos y referencias). Incluye campos de prerrequisitos, preparación, pasos, comprobaciones, evidencia, interpretación SOC, perspectiva RT autorizada, rollback, errores críticos y puntuación. Los materiales están concebidos para leerse juntos: el JSON **no** es un catálogo de exploits ni instrucciones para operar fuera del lab.

**Cierre técnico:** un host con red «funcionando» no está necesariamente bien protegido, y un firewall «activo» no indica qué flujos controla. El criterio profesional es poder **reconstruir decisiones de ruta, proceso y política**, contrastarlas con evidencias independientes y contener sin borrar la explicación de lo ocurrido.
