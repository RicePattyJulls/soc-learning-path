# LNX-LAB25 — SSH: identidad, claves y configuración efectiva

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Distinguir la **host key** del servidor de la **user key** del analista, generar una clave de laboratorio con passphrase, verificar el fingerprint del servidor por un canal independiente y leer la **configuración SSH efectiva** con `sshd -t`, `sshd -T` y `sshd -T -C`, comprobando el acceso autorizado y el rollback (base documental: F82, F83, F84, F85).

## Competencia

Auditoría de identidad y configuración SSH de **laboratorio**: separar autenticación del servidor y del usuario, reconocer la coexistencia de password y keyboard-interactive/PAM y conservar acceso seguro durante el cambio.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-20` y tener `LNX-LAB19` (o una explicación equivalente). Requiere un **servidor SSH de VM descartable**, un cliente de laboratorio, consola OOB o snapshot accesible y `systemd`. No se endurece ningún SSH remoto real.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-25` (servidor), cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales ni SSH de trabajo.
- Identificadores de ejemplo (no de un host real): usuario `analista`, host `lab-lnx-25` y clave de laboratorio `id_ed25519_t4_lab`; rutas y ficheros `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB25"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB25"`
2. Registra fecha y hora en **UTC** y versiones: `date -u -Is; ssh -V 2>&1` → `"$HOME/linux-lab/LAB25/lab25-entorno.txt"`
3. Asegura el **camino de rescate** antes de tocar nada: confirma consola OOB o snapshot y toma un **backup** de la configuración: `cp /etc/ssh/sshd_config "$HOME/linux-lab/LAB25/lab25-sshd_config.bak"` (solo lectura/administración de tu propia VM).

### Tarea (identidad, claves y configuración efectiva)

4. Genera la **clave de laboratorio** con passphrase ficticia y protege permisos:
   `ssh-keygen -t ed25519 -a 64 -f "$HOME/.ssh/id_ed25519_t4_lab" -C 't4-lab'; chmod 700 "$HOME/.ssh"; chmod 600 "$HOME/.ssh/id_ed25519_t4_lab"`
5. Obtén el **fingerprint** de la host key por un canal **independiente** del servidor de laboratorio (consola/snapshot) y **no** uses `StrictHostKeyChecking=no`:
   `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` en el servidor → `"$HOME/linux-lab/LAB25/lab25-fingerprint.txt"`. Una clave de `ssh-keyscan` **no** certifica por sí sola la identidad del servidor.
6. Lee la **configuración efectiva** (solo lectura en el servidor autorizado):
   `sudo sshd -t; sudo sshd -T | grep -Ei '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication|authenticationmethods|allowusers|allowgroups|allowtcpforwarding|permitopen|loglevel|port|listenaddress) ' > "$HOME/linux-lab/LAB25/lab25-sshd-T.txt"`
7. Evalúa una conexión hipotética del laboratorio con `Match`: `sudo sshd -T -C user=analista,host=lab-lnx-25,addr=192.0.2.30,laddr=192.0.2.20,lport=22 > "$HOME/linux-lab/LAB25/lab25-sshd-T-C.txt"`. Nota que `sshd -T` sin `-C` **no** sustituye probar todos los `Match`.
8. Prueba una **sesión nueva** manteniendo la existente (autorizadas): `ssh -i "$HOME/.ssh/id_ed25519_t4_lab" analista@192.0.2.20 true` → anota método de autenticación → `"$HOME/linux-lab/LAB25/lab25-login.txt"`.
9. Documenta la política **declarativa vs efectiva** (`PermitRootLogin`, `PasswordAuthentication`, `KbdInteractiveAuthentication`, `AllowUsers`/`AllowGroups`, `AllowTcpForwarding`) y explica por qué desactivar `PasswordAuthentication` **no** demuestra por sí solo ausencia de acceso con contraseña si quedan keyboard-interactive + PAM, en `"$HOME/linux-lab/LAB25/lab25-matriz.md"`.
10. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB25"/lab25-*.*; } > "$HOME/linux-lab/LAB25/SHA256SUMS"`

> **Nunca** compartas la clave privada, la passphrase ni un `sshd_config` completo. **No** modifiques `sshd` sin consola OOB verificada ni cambies SSH y firewall a la vez.

### Verificación y limpieza

11. Confirma que distingues **host key** de **user key**, que el fingerprint se verificó por canal independiente y que la sesión nueva funcionó sin cerrar la previa.
12. **Rollback y rotación**: si alteraste `sshd_config`, restaura el backup, valida `sshd -t` y recarga el servicio según distro; retira **solo** la clave de prueba de `authorized_keys` y rota la clave de laboratorio.
13. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB25/SHA256SUMS"`. No se entrega ningún archivo de clave privada.

## Evidencia a entregar

- La **matriz de configuración** declarativa frente a efectiva.
- El **fingerprint** verificado por canal independiente.
- La **prueba de login autorizado** (nueva sesión con la previa abierta).
- El **plan de rescate** (consola OOB/snapshot) y el rollback.
- La entrega **sin** archivos de clave privada.

## Criterios de aceptación

- Técnica (4): se distingue host key de user key y se usa `sshd -T -C` con `Match`, conservando el acceso.
- Interpretación y límites (3): se reconoce la coexistencia de password y keyboard-interactive/PAM.
- Evidencia (2): fingerprint verificado y prueba de login con hash y UTC.
- Seguridad y reversión (1): existe plan de rescate y rollback documentado.
- **Fallo crítico:** usar `StrictHostKeyChecking=no` como solución, confiar en `ssh-keyscan` sin verificación independiente, o cortar el acceso SSH sin vía de rescate. Aquí hay consola OOB y snapshot.

## Autorización y límites

Actividad sobre **SSH de VM descartable** propia, con consola OOB verificada. **Prohibido** compartir clave privada, passphrase o configuración sensible completa, endurecer un servidor remoto real y reutilizar credenciales de laboratorio en producción. Se entrega **solo** la clave pública.

## Limpieza

Restaura el backup de `sshd_config` si lo alteraste, valida `sshd -t`, recarga el servicio y comprueba la sesión. Retira **solo** la clave de prueba de `authorized_keys` y rota la clave del laboratorio. Conserva `lab25-*.txt`, `lab25-*.md`, el backup y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
