---
title: "LINUX | SOC + RED TEAM"
subtitle: "Tanda 5 de 5 · Identidad, hardening, auditoría, telemetría, contenedores y evaluación integrada"
author: "Dossier técnico de investigación y laboratorio"
date: "18 de octubre de 2026"
lang: es-ES
version: "5.0"
status: "investigación documental y guía de laboratorio; no ejecutada en la infraestructura del lector"
---

> **Objetivo.** Cerrar el temario original de `linux(1).txt` sin dejar fuera los bloques que quedaban tras las tandas 1–4: PAM, SELinux/AppArmor, mínimo privilegio, hardening, logs y auditoría, telemetría y respuesta SOC/DFIR, rendimiento, automatización segura, contenedores, Red Team autorizado y secuencia de aprendizaje. La cobertura es transversal: funcionamiento interno → observabilidad real → detección → respuesta → evaluación ofensiva controlada → remediación y retest.

**Trazabilidad.** Fuente original: `linux(1).txt`, once áreas. T1: fundamentos y Bash; T2: arranque, servicios y paquetes; T3: almacenamiento, backups y recuperación; T4: red, SSH y firewall. **Esta T5 integra las áreas restantes**, no es una continuación únicamente de PAM. El catálogo JSON asociado contiene rúbricas, 12 laboratorios y 40 preguntas; se debe utilizar conjuntamente con este documento. Investigación documental y ejercicios propuestos: **no** constituyen evidencia de que una prueba se haya realizado ni de un entorno específico.

**Concreción de entornos.** Ubuntu/Debian/Parrot suelen utilizar AppArmor; RHEL/Fedora suelen utilizar SELinux; servicios de autenticación, nombres de paquetes, versiones, reglas audit y syscalls difieren. Ejemplos de comandos son para una **VM desechable y autorizada**, salvo los explícitamente identificados como lectura. Para cambios sobre autenticación, sudo, LSM, agente de auditoría o Docker: consola de recuperación, snapshot probado, plan de rollback y ventana aprobada. No habilitar acceso externo ni cargar payloads ofensivos. Las técnicas RT se limitan a demostrar exposición con datos sintéticos; no a comprometer terceros.

**Leyenda:** `[SOC]` → telemetría y decisiones; `[RT]` → evaluación ofensiva bajo reglas de enfrentamiento (ROE); `[DOC:Sxx]` → enlace documental verificable de la sección 31; `[LAB]` → práctica; `[ALTO RIESGO]` → nunca aplicar en producción sin control de cambio. Los tiempos y porcentajes de laboratorios son **propuestas didácticas**, no métricas observadas.

# 1. Resultados de aprendizaje, alcance y criterio de aprobación

Al finalizar se debe poder:

1. Explicar UID real/efectivo, GID, SUID/SGID, ACL, capabilities, sudo y autenticación PAM; demostrar por qué DAC, MAC y política organizativa son capas distintas.
2. Leer una pila PAM sin confundir `auth`, `account`, `password`, `session`; detectar dependencias y riesgos de bloqueo antes de intervenir.
3. Diagnosticar denegaciones de SELinux/AppArmor con evidencia, corregir causa y verificar que la protección sigue activa.
4. Diseñar telemetría Linux ajustada a amenazas y costos; distinguir journald, rsyslog/syslog y auditd por garantías, semántica, retención y evasiones posibles.
5. Correlacionar proceso, identidad, objeto, evento audit, sesión, red y sistema de archivos; reconocer ausencia de registros como incertidumbre, no inocencia.
6. Reaccionar a un incidente preservando memoria/evidencia relevante antes de alterar el host cuando la urgencia y el impacto lo permiten.
7. Resolver problemas CPU/memoria/IO/FD/cgroups con hipótesis contrastables y sin desmontar controles de seguridad por comodidad.
8. Revisar contenedores, privilegios de daemon, sockets, namespaces/cgroups/LSM/seccomp y superficie de Kubernetes sin suponer aislamiento de VM.
9. Efectuar enumeración RT autorizada, levantar un hallazgo fundamentado, remediarlo y demostrar el resultado con pruebas positivas y negativas.
10. Entregar un expediente de investigación reproducible que indique observaciones, conclusiones, incertidumbre, impacto, responsables y retest.

**Evaluación:** 12 laboratorios, **100 puntos**. Umbral recomendado ≥80/100 **y ningún fallo crítico**; la prueba exige evidencias de funcionamiento y rollback. Fallo crítico: alterar PAM/sudo/firewall/audit del host de trabajo, romper acceso administrativo, intervenir objetivos sin autorización, destruir evidencia sin justificación, divulgar secretos o atribuir una acción maliciosa por un único indicador sin validación.

# 2. Arquitectura: decisiones de autorización y puntos de observación [DOC:S01–S06]

```text
  principal humano/servicio
        │ autenticación (SSH, login, sudo: PAM cuando aplica)
        ▼
  UID/GID/sesión ↔ políticas sudoers ↔ grupos/identidades/credenciales
        │
        ▼
  proceso (credenciales efectivas, capacidades, namespace, cgroup)
        │               │                   │
  DAC: propietario/mode/ACL   MAC: SELinux/AppArmor    syscall/seccomp/LSM
        │               │                   │
        └────────────── kernel ──────────────┘
                              │                  ┌── journald ↔ rsyslog
                       audit hooks/syscalls ─────┼── auditd
                              │                  └── eBPF/EDR/Falco/observabilidad
                       red/FS/servicios ───────────→ SIEM/control plane
```

El acceso exitoso requiere superar las restricciones aplicables. `root` puede superar algunas comprobaciones DAC, pero **no necesariamente** la política MAC/seccomp/namespace. PAM autentica o gobierna partes de la sesión en aplicaciones integradas; no es un firewall universal de ejecución. `auditd` y EDR monitorizan condiciones/configuraciones distintas; **no** existe un «registro de todos los comandos» automático por usar Linux. Un PID observado puede haberse reciclado; conservar boot ID, timestamp, parent PID, inicio de proceso, ejecutable y cgroup cuando estén disponibles.

**Preguntas diferenciadas:** ¿quién solicitó ejecutar?, ¿bajo qué identidad efectiva?, ¿qué permiso autorizó?, ¿qué objeto se tocó?, ¿qué control lo negó?, ¿qué sensor lo observó?, ¿qué parte aún no sabemos? Una operación legítima de software puede generar `execve`, denegaciones y descargas; una intrusión puede no producir el registro que esperamos.

# 3. Identidades, DAC, modos, ACL y privilegios [DOC:S03,S05,S06]

## 3.1 UID/GID real, efectivo, saved y filesystem

- `id -a`, `getent passwd USER`, `getent group GRUPO`: identidades resueltas por NSS; consultar ficheros `/etc/passwd` exclusivamente **no** refleja todas las identidades de LDAP/SSSD.
- Un proceso puede tener **RUID** y **EUID** distintos; la credencial usada por comprobaciones de acceso depende de la operación y del kernel. Linux expone también FSUID y FSGID.
- `stat -c '%n %U %G %a %A' RUTA`, `namei -l /ruta/a/recurso`: acceso requiere permisos sobre **cada directorio** del recorrido, no solo el archivo final.
- `umask`: resta permisos iniciales solicitados, no revoca permisos preexistentes.
- SUID en un **ejecutable**, SGID en ejecutables/directorios y sticky bit en directorios resuelven problemas diferentes; las ACL añaden entradas por usuario/grupo y una **máscara efectiva** que puede restringirlas.
- `getfacl ruta` y `getcap ruta` son complementarias a `ls -l`, no sustituibles. Capabilities de archivo en un binario no garantizan privilegios efectivos tras todo `execve` (bounding, no_new_privs, namespaces, otras restricciones).

```bash
# Lecturas seguras: las rutas que no existan mostrarán error normal
id
getent passwd "$(id -un)"
umask
stat -c '%n %U:%G %a %A' "$HOME"
namei -l "$HOME"  # comprobar el recorrido real
cat /proc/self/status | grep -E '^(Uid|Gid|Cap(Inh|Prm|Eff|Bnd|Amb)|NoNewPrivs):'
# Herramientas opcionales: getfacl, getcap
command -v getfacl >/dev/null && getfacl "$HOME"
```

### Laboratorio mental: `rw-r-----+` no revela toda la política

Un `+` suele indicar ACL extendida en `ls`. Para concluir acceso se necesita el ACL efectivo, máscara, travesía por directorios, usuario/grupo y controles MAC. **[SOC]** una lectura exitosa con SUID no prueba «root hizo la acción»; registrar identidad de invocación y contexto de proceso. **[RT]** documentar permisos excesivos como exposición; no ejecutar automáticamente ningún binario privilegiado encontrado.

## 3.2 SUID/SGID, sudoers y capabilities: criterios de riesgo

| Mecanismo | Qué permite | Riesgo y error común | Prueba defensiva |
|---|---|---|---|
| `sudo`/sudoers | Delegar comandos autorizados | Regla muy amplia, ruta a binario editable, argumentos/redirección inesperados, ausencia de revisión | `sudo -l` **del propio usuario**, `visudo -c` por admin, revisar ownership y logs |
| SUID | Ejecutar con identidad efectiva del dueño | Binario vulnerable o innecesario; ubicación anómala | Baseline de `find` en árbol **del lab**, metadatos, paquete de origen |
| SGID de directorio | Herencia de grupo en objetos nuevos | Escritura de datos por grupo equivocado | `stat`/`getfacl`, permisos de directorios superiores |
| Capabilities | Separar privilegios de root | `CAP_SYS_ADMIN` demasiado amplio, `CAP_DAC_READ_SEARCH` permite lecturas delicadas | `getcap -r /ruta/lab`, `getpcaps PID` cuando disponible |
| Políticas MAC | Restringen aun cuando DAC permite | Desactivar MAC como supuesto «arreglo» | Confirmar denegaciones y contexto/perfil |
| `no_new_privs` | Impide ganar privilegios adicionales a través de `execve` | No quita privilegios ya disponibles y no reemplaza los demás controles | `/proc/PID/status`, sandbox definido |

**[RT] Enumeración autorizada, sin explotación:**

```bash
id
sudo -n -l 2>&1 || true  # informa políticas o falta de autenticación, no fuerza contraseña
command -v getcap >/dev/null && getcap -r "$HOME" 2>/dev/null
find "$HOME" -xdev -type f \( -perm -4000 -o -perm -2000 \) -print 2>/dev/null
# En VM auditada, ampliar la búsqueda solo con permiso y límites de tiempo/recursos
```

**No usar listas de binarios explotables como automatismo de ataque**: distinguir configuraciones estándar de hallazgos reales, versionar package owner y separar «posible escalada» de «privilegio efectivamente obtenido». MITRE ATT&CK reconoce abuso de SUID/SGID como T1548.001 [DOC:S29]; no toda presencia de SUID es maliciosa.

# 4. Linux-PAM: pila, decisiones y superficie de fallos [DOC:S01,S02,S07]

PAM es una interfaz por la que **aplicaciones PAM-aware** consultan módulos. Una política en `/etc/pam.d/sshd`, `/etc/pam.d/sudo`, `/etc/pam.d/login` u otros ficheros determina las llamadas a módulos; puede existir una configuración del proveedor que se sobreescribe localmente. Cambiar PAM puede bloquear todos los inicios de sesión o generar bypass involuntario.

## 4.1 Grupos de gestión y orden

| Tipo | Propósito | Ejemplos de decisiones | Matiz |
|---|---|---|---|
| `auth` | Verificar identidad o credenciales | Contraseña, segundo factor, autenticación externa | Resultado depende del servicio y del control flag |
| `account` | Autorizar uso de cuenta en ese momento | Vigencia/expiración/limitaciones de acceso | Un usuario autenticado puede quedar denegado aquí |
| `password` | Administrar cambio de token | Política y actualización de contraseñas | No equivale a comprobar una contraseña para login |
| `session` | Apertura/cierre y recursos de sesión | Registro, límites, montaje de recursos | Puede ejecutar acciones al abrir/cerrar |

Control flags típicas: `required` registra fallo pero sigue evaluando la pila; `requisite` detiene ante fallo; `sufficient` puede retornar éxito si no hay fallos `required` previos; `optional` tiene efecto condicionado; `include` y `substack` introducen lógica adicional. **No se deben interpretar reglas aisladas** sin orden, ámbito y sintaxis extendida `[success=1 default=bad]`.

```text
# PSEUDOCONFIGURACIÓN DIDÁCTICA, NO INSTALAR EN /etc/pam.d
# tipo      control     módulo          parámetros
# auth      required    pam_unix.so     ...
# account   required    pam_unix.so     ...
# session   required    pam_limits.so   ...
```

`pam_exec.so` puede ejecutar comandos externos: una política de autenticación que invoca scripts es un punto de alto impacto, tanto legítimo como abusivo. No habilitar `expose_authtok`: hacerlo puede entregar credenciales al proceso hijo. Para revisión hay que verificar nombre/propietario del script, argumentos, control de escritura, entorno y gestión de secretos [DOC:S02]. El hecho de encontrar `pam_exec` **no prueba** persistencia maliciosa.

## 4.2 Auditoría de PAM sin cambiar políticas

```bash
ls -ld /etc/pam.d /usr/lib/pam.d 2>/dev/null
ls -l /etc/pam.d 2>/dev/null | head -40
# SOLO LECTURA: puede mostrar nombres internos/identidad. No publicar configuración íntegra.
grep -RHE '^[[:space:]]*(auth|account|password|session)[[:space:]]' /etc/pam.d 2>/dev/null | head -80
# Auditar rutas específicas según gestor/distribución sin editar.
```

Procedimiento de intervención real: identificar distribución y herramienta de gestión (`authselect`, `pam-auth-update`, etc.) → snapshot probado y consola fuera de banda → backup y hash → revisar fichero efectivo e includes → probar con **sesión abierta de rescate** y cuenta de prueba → validar fallo y éxito → rollback versionado → comparar telemetría. Nunca cerrar la única sesión antes del test. Evitar `sed -i` sobre `/etc/pam.d/*` como receta genérica.

**[SOC]** autenticaciones fallidas, discrepancias de factor y cambios en PAM deben correlacionarse con `sshd`/sudo/journal, auditoría de escritura en rutas y tickets autorizados. **[RT]** verificar en un entorno de pruebas que la política no omite MFA, que rutas invocadas no son editables por usuarios no confiables y que los caminos de recuperación están definidos, **sin** alterar el PAM del host real.

# 5. SELinux, AppArmor y Linux Security Modules [DOC:S08–S11]

SELinux suele usar control basado en **etiquetas, tipos y dominios**; AppArmor se orienta a **perfiles de programa** con restricciones basadas principalmente en rutas/operaciones. Ambos son MAC sobre un kernel con LSM, complementando DAC. Una denegación no significa por sí misma «atacante»: puede ser incompatibilidad, archivo mal etiquetado o comportamiento legítimo nuevo.

| Dimensión | SELinux | AppArmor |
|---|---|---|
| Identificación de política | Contextos `usuario:rol:tipo:nivel` (en casos comunes) | Perfil asociado a ejecutable/actividad |
| Modo de diagnóstico | Enforcing, permissive, disabled | Enforce, complain, perfil sin confinar |
| Dónde observar | `getenforce`, `sestatus`, `ls -Z`, AVC/audit | `aa-status`, `journalctl -k`, DENIED de AppArmor |
| Qué no hacer | Desactivar SELinux para resolver un problema de etiqueta | Pasar todo a complain para «que funcione» |
| Corrección | Etiquetado/policy/boolean controlado, `restorecon` si procede | Modificar perfil mínimo y volver a enforce tras prueba |

```bash
# Lectura sin mutación; adaptativa a distribución:
[ -r /sys/kernel/security/lsm ] && cat /sys/kernel/security/lsm
command -v getenforce >/dev/null && getenforce
command -v sestatus >/dev/null && sestatus
command -v aa-status >/dev/null && sudo -n aa-status 2>&1 || true
# Es normal que una herramienta no exista en el sistema
```

## 5.1 SELinux: método de investigación de una denegación

1. Identificar acción exacta, service, UID, ruta, hora y reproduccibilidad sin cambiar política.
2. Verificar modo y contextos: `getenforce`, `ls -Z ruta`, `ps -eZ | grep servicio` (requieren instalación/configuración SELinux).
3. Buscar AVC por tiempo en audit: `sudo ausearch -m AVC,USER_AVC,SELINUX_ERR,USER_SELINUX_ERR -ts recent` [DOC:S09]. Si no hay registros, verificar audit/journal y si el evento se generó; `dontaudit` puede ocultar algunas denegaciones. **No interpretar ausencia como permiso.**
4. Decidir: ¿DAC? ¿contexto incorrecto? ¿ruta no estándar? ¿boolean autorizado? ¿política necesita extensión? Corregir raíz; **no** aceptar automáticamente toda sugerencia de `audit2allow`.
5. Retest funcional y negativo, buscar AVC posteriores, adjuntar cambios de contexto, regresión y hash de configuración.

**Ejemplo de diagnóstico documental (no mutar):**

```bash
getenforce 2>/dev/null || true
sudo -n ausearch -m AVC,USER_AVC -ts recent 2>/dev/null | head -80 || true
# restorecon -n -v /ruta/lab  # simular relabel si la herramienta está instalada
# El comando sin -n cambiaría etiquetas. Requiere plan específico y autorización.
```

## 5.2 AppArmor: sin convertir aprendizaje en desprotección

- `aa-status` muestra perfiles cargados y aplicación de modos; la ausencia de perfil no demuestra que el LSM esté desactivado globalmente.
- `aa-complain` permite algunas violaciones para observarlas; no es configuración recomendada de larga duración en producción.
- `aa-logprof` **puede escribir** perfiles y cargarlos; no es lectura pura. Se ejecuta únicamente en VM con snapshot y revisión humana.
- Una regla amplia `/** rwklm` puede solucionar un fallo aparente sacrificando contención. Revisar alcance real del perfil, biblioteca, nombre de binario y ubicaciones de datos.

```bash
command -v aa-status >/dev/null && aa-status 2>&1 | head -60 || true
journalctl -k --since '30 minutes ago' --no-pager 2>/dev/null | grep -i 'apparmor.*DENIED' | head -30 || true
# No ejecutar aa-complain / aa-enforce / aa-logprof en la máquina personal por un ejercicio.
```

# 6. Hardening práctico y arquitectura de mínimo privilegio [DOC:S03,S05,S11–S14]

Hardening no es activar una lista de `sysctl` sin análisis. Es diseñar controles por activo/amenaza, comprobar la configuración efectiva y demostrar que no se rompe el servicio ni se pierden registros. Prioridad: inventario y parcheo → identidad → superficie de servicios/red → privilegios → ejecución/aislamiento → auditoría → backup/restore → revisión continua.

| Control | Riesgo que reduce | Verificación observable | Efectos secundarios/advertencias |
|---|---|---|---|
| Inventario de paquetes y parcheo | Exposición a vulnerabilidades conocidas | Software y versión instalada, cronología de cambios, CVE aplicables | Parches pueden reiniciar servicios/kernel; prueba de compatibilidad |
| Revisar sudoers | Delegación excesiva | `sudo -l` y revisión de reglas por admin | Reglas `NOPASSWD` o editores sin restricción pueden expandir poder |
| Permisos de datos/secretos | Lectura/escritura indebida | `stat`, `getfacl`, ownership de directorios padres | La aplicación puede requerir una identidad de servicio |
| Gestión SSH y MFA | Acceso no autorizado | `sshd -T -C`, registros y sesiones de prueba | Bloqueo de acceso si se aplica sin alternativa |
| SELinux/AppArmor enforce | Abuso desde aplicación comprometida | Contexto/perfil y denegaciones verificadas | Ajustes por despliegue, no permitir todo |
| systemd sandbox | Superficie de escritura y capabilities | `systemd-analyze security SERVICIO`, `systemctl show` | Score es heurístico, no garantía; AppArmor/seccomp dependen del servicio |
| Auditoría de archivos críticos | Persistencia/tamper no observado | Eventos positivos/negativos audit; `auditctl -s` | Ruido, pérdida de eventos y consumo disco |
| Contenedor no privilegiado | Abuso de kernel/host/daemon | `docker inspect`, userns, seccomp y binds | Rootless no es invulnerable; daemon socket sigue sensible |
| Retención/forwarding de logs | Pérdida local/alteración | Config, eventos generados, recepción remota con ACK si aplica | Cifrado y tiempo correctos; UDP no asegura entrega |
| Backups inmutables/off-host | Borrado/cifrado de backups locales | Restore realmente ensayado, acceso segregado | Snapshots y RAID no son copia independiente |

Para servicios systemd de laboratorio (concepto; **no** desplegar sin pruebas):

```ini
# Fragmento ilustrativo de drop-in para servicio de prueba, no para sshd ni servicios críticos:
[Service]
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/servicio-lab
CapabilityBoundingSet=
RestrictSUIDSGID=yes
```

`ReadWritePaths` debe cubrir exactamente los destinos legítimos; `ProtectSystem=strict` y `ProtectHome` pueden romper servicios que escriben fuera de rutas declaradas. El hardening de systemd **no** sustituye un perfil MAC o seguridad de la aplicación. `systemd-analyze security` evalúa opciones de sandbox, no el conjunto de riesgos del sistema [DOC:S12].

## 6.1 Prioridad de remediación por contexto

- **Crítico:** secretos legibles por usuarios no autorizados, `sudo` con comando arbitrario no aprobado, socket del daemon rootful expuesto, directorio de plugin ejecutado como root editable por usuario no fiable, logging desactivado durante incidente.
- **Alto:** SUID/capabilities inesperadas en rutas de laboratorio con exposición demostrada, perfiles MAC fuera de enforce sin justificación, configuraciones modificadas sin trazabilidad.
- **Medio/contextual:** reglas muy ruidosas, políticas heredadas sin propietario, permisos de servicio más amplios de lo necesario.

La gravedad depende de **alcanzabilidad, identidad, contexto y controles compensatorios**; la puntuación de una checklist no se traduce automáticamente en explotabilidad.

# 7. Registro y auditoría: cuatro capas que no son equivalentes [DOC:S15–S21]

| Capa | Qué registra normalmente | Retención | Limitación crítica |
|---|---|---|---|
| journald | Eventos enviados al journal por servicios, kernel y fuentes integradas | RAM/persistente según `Storage`, límites, rotación | No instrumenta cada syscall por defecto; puede perder eventos |
| syslog/rsyslog | Mensajes syslog recibidos y reenviados desde fuentes configuradas | Reglas y rotación propias | Una línea de aplicación no es evidencia verificada por kernel |
| Linux Audit/auditd | Eventos de hooks de auditoría bajo reglas activas | Archivos/rotación de audit; forwarding opcional | Cobertura depende de reglas, backlog, pérdida, carga, permisos |
| eBPF/EDR/Falco | Eventos de kernel y metadata según programas/política | Agente + exportación/SIEM | Drops, kernel incompatibilidad, pérdida, tuning y permisos |

**[SOC]** comparar detecciones con cobertura. Ejemplo: `journalctl -u ssh` puede recuperar una denegación de login emitida por sshd, pero no ofrece automáticamente command-line de cada proceso posterior. `auditd` puede registrar `execve` según filtros, pero el evento `execve` no garantiza conocer qué ocurrió dentro de un script ni todos sus argumentos si faltan datos o fueron alterados. Un contenedor puede registrar en stdout sin aparecer en un archivo `/var/log/<aplicación>` del host.

## 7.1 journald: estructurado, booteos, retención y verificación

```bash
journalctl --list-boots --no-pager
journalctl -b -p warning --no-pager -n 40
journalctl --since '2026-10-18 00:00:00' --until '2026-10-18 23:59:59' --utc --no-pager -n 40
journalctl -o json --no-pager -n 3
journalctl --disk-usage
journalctl -b -u ssh.service --no-pager -n 30  # unidad puede ser sshd.service
# Verificación sintáctica del material del journal disponible; no equivale a integridad externa:
journalctl --verify --no-pager 2>&1 | head -30
```

Campos como `__REALTIME_TIMESTAMP`, `__MONOTONIC_TIMESTAMP`, `_BOOT_ID`, `_SYSTEMD_UNIT`, `_PID`, `_UID`, `SYSLOG_IDENTIFIER` e `MESSAGE` mejoran reconstrucción si están presentes. La **ausencia** de un campo no es señal de manipulación por sí sola; algunos proceden de origen no confiable (identificadores suministrados por aplicación), otros de metadatos añadidos por journal. `--verify` busca problemas estructurales y, cuando hay sellado y claves requeridas, puede mejorar comprobación; **sin un mecanismo de integridad independiente no acredita por sí solo autoría ni ausencia de manipulación**.

Configuración típica `/etc/systemd/journald.conf` + drop-ins:

```ini
# OPCIONES DOCUMENTALES; NO copiar sobre una configuración existente sin cambios aprobados.
[Journal]
Storage=persistent
SystemMaxUse=1G
SystemKeepFree=2G
RateLimitIntervalSec=30s
RateLimitBurst=10000
```

`Storage=persistent` solicita persistencia si `/var/log` es utilizable; no prueba que existan todos los booteos anteriores. `SystemMaxUse` es un límite de espacio, **no** de días garantizados. El rate limiting y la política de vaciado/rotación pueden dejar huecos. Antes de estimar retención calcular tasa real de eventos, compresión, fallos de disco, tráfico pico y ventana del SIEM [DOC:S15].

## 7.2 Rsyslog: pipeline, transporte y protección de evidencia

```text
application/kernel → journal/syslog input → parser/metadata → reglas/filter
        → cola memoria/disco → acción local/forward TLS → receptor → índice SIEM
```

En entornos donde journald reenvía a syslog o rsyslog lee journal, evitar duplicados y comprobar **cómo** se hace la integración. Rsyslog puede reenviar por UDP, TCP o TLS; para enlaces remotos sensibles usar autenticación/cifrado, cola dimensionada y política de spool. TCP/TLS protege transporte, **no** garantiza que el evento original sea auténtico ni que el destino lo retenga. Para confirmación de recepción a nivel de mensaje estudiar RELP y capacidades del receptor [DOC:S17].

```bash
command -v rsyslogd >/dev/null && rsyslogd -N1 2>&1 | tail -20 || true  # validación sintáctica, no reinicia
systemctl status rsyslog --no-pager 2>/dev/null | head -30 || true
# No enviar datos reales a colectores no autorizados para probar forwarding.
```

## 7.3 Audit: reglas, semántica y pérdida de eventos

Audit dispone de reglas cargadas en kernel, `auditd` para escribir/distribuir y herramientas `auditctl`, `ausearch`, `aureport`, `augenrules`. En algunas configuraciones, iniciar audit tras el boot puede dejar procesos tempranos sin el contexto de auditoría deseado; revisar `audit=1` y parámetros de arranque según política. **Regla cargada ≠ evento garantizado**: kernel puede perder eventos por falta de recursos, los procesos pueden no coincidir con filtros y el disco puede agotarse.

```bash
# SOLO LECTURA; opciones pueden requerir root
sudo -n auditctl -s 2>/dev/null || true      # enabled, lost, backlog, etc.
sudo -n auditctl -l 2>/dev/null || true      # reglas efectivamente cargadas
sudo -n ausearch -m USER_AUTH,USER_ACCT -ts today -i 2>/dev/null | head -50 || true
sudo -n aureport --summary -i 2>/dev/null | head -40 || true
# Config persistente suele estar en /etc/audit/rules.d/.
```

### 7.3.1 Una regla conceptual de laboratorio

```bash
# EJEMPLO PARA ARCHIVO DE LAB, NUNCA /etc/shadow o todo el FS sin estudio de carga.
# Primero: test -f "$HOME/t5-lab/watch.txt"
# Después, en VM con audit activo y cambio autorizado:
# sudo auditctl -w "$HOME/t5-lab/watch.txt" -p wa -k t5_watch_lab
# ... modificar un archivo propio de prueba ...
# sudo ausearch -k t5_watch_lab -i
# Limpieza: sudo auditctl -W "$HOME/t5-lab/watch.txt" -p wa -k t5_watch_lab
```

Las opciones `-w` se mantienen por compatibilidad; la documentación actual recomienda expresiones de syscall/file-system orientadas a rendimiento para ciertos escenarios. La semántica varía entre kernels y filtros; el lab debe comprobar que la regla **realmente dispara**. `auditctl -D` elimina todas las reglas y **queda prohibido como limpieza**. En producción usar persistencia administrada, filtros limitados, control de cambios y seguimiento de `lost` y `backlog` [DOC:S18–S20].

### 7.3.2 Cómo leer un evento sin perder identidad

- Los registros `SYSCALL`, `EXECVE`, `CWD`, `PATH`, `PROCTITLE`, `USER_AUTH`, etc. pueden formar **un mismo evento** por `msg=audit(EPOCH:SERIAL)`; correlacionar serial y host/boot/time.
- `uid` es identidad real, `euid` efectiva, `auid` identidad de login que puede persistir durante elevación; `auid=4294967295` suele significar «unset» (valor depende representación).
- `success=yes` indica éxito de la operación auditada; **no** que la acción sea legítima. `exit=-13` suele corresponder a EACCES, pero hay que contextualizar syscall/arquitectura.
- `augenrules --load` puede alterar política; `-e 2` de audit inmoviliza reglas hasta reinicio en configuraciones correspondientes: nunca activar en laboratorio sin plan de recuperación.

# 8. Matriz de cobertura, coste y retención de telemetría [DOC:S15–S22]

| Pregunta SOC | Señal útil | Falta que impide concluir | Validación |
|---|---|---|---|
| ¿Se creó usuario local? | audit/FS `/etc/passwd` o `/etc/shadow`, gestión de identidades y sesiones | NSS remoto o evento sin identidad | comparar baseline, paquete/herramienta, ticket |
| ¿Se modificó sudoers? | audit FIM de `/etc/sudoers` y `/etc/sudoers.d/` | regla inexistente, log rotado | diff con permisos, `visudo -c`, autor |
| ¿Se cargó servicio nuevo? | systemd unit file + journal + audit FS | unidad transitoria, usuario, systemd templated | `systemctl list-unit-files`, scopes, cgroups y fecha |
| ¿Quién inició el proceso? | exec/process EDR, audit exec, PPID/UID/auid | exec no auditado o PID reciclado | árbol, binario/hash, ventana UTC |
| ¿Salió data del host? | flow/network telemetry + proceso + destino + bytes | NAT/proxy/TLS, cifra de app, bytes erróneos | correlacionar T4, app logs y almacenamiento |
| ¿Se alteraron logs? | auditoría de paths/log config, forwarded logs | atacante con root, lag de ingesta, rate limit | pruebas de sensor/canal externo |
| ¿Hubo denegación MAC? | AVC/AppArmor DENIED | `dontaudit`, sensor o política no cargada | reproducir con test y revisar modos |
| ¿Se ejecutó shell en contenedor? | runtime syscall eBPF y container.id | procesos dentro de namespaces sin correlación | distinguir `docker exec` legítimo y app entrypoint |
| ¿Se intentó escalar? | SUID/privileged exec/capability events + estado resultante | entorno normal con utilidades privilegiadas | EUID/UID, cadena de procesos, cambio permanente |

**Política recomendada (diseño, no ajuste universal):** conservar suficiente historia para el tiempo estimado de detección e investigación y los requisitos legales; dimensionar retención en eventos/día × bytes/evento × picos × índice/compresión × duplicados. Métricas de salud: ingesta esperada/recibida, eventos descartados, backlog audit, presión de almacenamiento, delay, discrepancia UTC/monotonic, cobertura de sesiones, porcentaje de hosts con agente sano, tasa de campos sin enriquecimiento.

**Contra la falsa completitud:** si se suprime una unidad o no se instaló audit, un tablero del SIEM puede verse normal. La monitorización de **salud del sensor** debe generar incidente por sí misma cuando la brecha supera umbrales acordados.

# 9. Colección forense y respuesta SOC sin destruir explicaciones [DOC:S21–S24]

## 9.1 Secuencia de primera intervención (adaptada a NIST SP 800-61r3)

1. **Triage:** alarma, contexto de negocio, impacto actual, sistema propietario, activos relacionados, hora UTC, alcance y capacidad de actuar.
2. **Decidir contención por riesgo:** si la exfiltración es activa, controlar egreso por perímetro/EDR/segmentación **sin** esperar colección completa; dejar evidencia mínima rápida si es factible. No retrasar mitigación ante daño inminente.
3. **Preservar datos volátiles mientras existan:** conexiones, procesos, FDs, árbol, sesiones, temporales relevantes, contenedores, estado de servicios; no matar PID antes de entender supervisor/cgroup si se dispone de tiempo.
4. **Adquirir artefactos duraderos:** journal, audit, logs de aplicación, cambios de configuración, herramientas EDR; **evitar** recopilar secretos sin necesidad/autoridad.
5. **Correlacionar:** identidad humana vs svc, proceso/parent, artefacto on-disk, TCP/NAT/egress, persistencia, ventanas temporales y eventos tras contención.
6. **Recuperación y retest:** rotación de credenciales, eliminación controlada de persistencia, parches, restauración, prueba de logs/detección, revisión de alcance y cierre técnico.

```bash
# Lectura de triaje con mínima mutación inherente a la observación
hostnamectl 2>/dev/null || hostname
printf 'UTC='; date -u +%FT%TZ
cat /proc/sys/kernel/random/boot_id
uptime
who 2>/dev/null || true
ps -eo pid,ppid,uid,euid,lstart,stat,comm,args --sort=pid | head -100
ss -tanup 2>/dev/null | head -80
findmnt -rno TARGET,SOURCE,FSTYPE,OPTIONS | head -60
systemctl --failed --no-pager 2>/dev/null || true
journalctl -b --since '15 minutes ago' --no-pager -n 100
```

Si se ejecuta en entorno comprometido, **no presumir fiabilidad del propio host**: binarios, `/proc`, agentes y relojes pueden ser manipulados. Captura desde hipervisor, EDR y red independientes cuando esté disponible y autorizado. Las herramientas de live-response pueden modificar atime, caches y memoria; registrar actividad del respondedor, programa/versión y orden. Cadena de custodia y legalidad dependen de la organización; no existe un «hash de RAM» útil sin adquisición consistente y proceso documentado.

## 9.2 Registro mínimo de evidencia

```text
case_id: IR-LINUX-YYYYMMDD-001
host_id/boot_id: ...
observador y autorización: ...
UTC_inicio / UTC_fin: ...
origen del tiempo y desfase conocido: ...
fuente: journal export / audit / snapshot / EDR / PCAP / FIM
comando/herramienta-versión: ...
archivo: ...        tamaño: ...        SHA-256: ...
adquisición: en vivo / snapshot / colector central
cambios hechos al investigar: ...
transferencias y custodios: ...
limitaciones: drops, logs ausentes, filtro, censura, root host no fiable, etc.
```

Ejemplo reproducible con **datos sintéticos**: `sha256sum evidencia.txt > evidencia.txt.sha256` se ejecuta **después de generar y congelar** el artefacto. El hash constata igualdad de bytes comparados, no autenticidad de la fuente ni exactitud de eventos.

## 9.3 Criterios para aislar sin inventar autoría

| Urgencia | Señal | Acción controlada | Lo que sigue abierto |
|---|---|---|---|
| Alta | bytes de salida anómalos sostenidos + datos sensibles + flujo identificado | egreso restrictivo o aislar workload preservando acceso IR | identidad atacante, técnica de acceso inicial |
| Media | servicio no inventariado + ejecución fuera de horario | verificar change-ticket, binario firmado/paquete y dueño | benignidad o abuso de servicio |
| Alta | cambios de PAM/sudoers sin autorización + session privilegiada | revocar credenciales/sesión con coordinación; evidencia de config | persistencia adicional, impacto transversal |
| Media | audit lost > 0, journald tasa limitada | abrir brecha de visibilidad; evaluar vías externas | eventos concretos ausentes; no imputar por hueco |

# 10. Detecciones SOC: hipótesis, consulta, validación y falsos positivos [DOC:S18–S24,S29]

Una detección no es solo un regex. Debe explicar **amenaza**, **prerrequisitos**, **evento mínimo**, **normalización**, **tuning**, **prueba positiva y negativa**, **FP/FN** y **respuesta**. Estas doce detecciones, identificadas `D05-01…D05-12`, se detallan en el JSON. Sintaxis siguiente: lógica conceptual, NO consultas validadas en una instancia concreta de Sentinel/Splunk/Falco.

| ID | Hipótesis | Telemetría mínima | Riesgo de interpretación |
|---|---|---|---|
| D05-01 | Modificación de PAM fuera de cambio | FIM/audit write sobre directorios pam, identidad | actualización de paquete, authselect |
| D05-02 | Cambio de sudoers y privilegio posterior | FIM + sudo logs + exec | admin aplica change-ticket |
| D05-03 | Nueva SUID/SGID en árbol anómalo | FIM/metadata + exec posterior | software legítimo en update |
| D05-04 | Nueva capability de archivo potente | baseline getcap + audit de atributos | deployment controlado |
| D05-05 | SELinux/AppArmor cambió de enforcement | control de política + audit/kernel | troubleshooting programado |
| D05-06 | Audit/journal/forwarder quedó inoperativo | heartbeat + config diff + logs/huecos | rotación o reinicio esperable |
| D05-07 | Actividad privilegiada tras autenticación inusual | login + sudo/exec + cambios FS | personal de guardia |
| D05-08 | Proceso ajeno escribe rutas críticas de persistencia | audit/FIM + proceso/parent/auid | gestores de paquetes |
| D05-09 | Shell interactiva o proceso inesperado en contenedor | syscall/EDR + container ID + exec | debug de operaciones |
| D05-10 | Cambio de configuración de daemon/container peligroso | API/docker events/config FIM | cambio de infraestructura |
| D05-11 | Presión IO/OOM coincide con alteración de logs | PSI/kernel + journal/audit lost | pico legítimo con sensor insuficiente |
| D05-12 | Evidencia de borrado local y salida de red anómala | FIM + flow + proceso | job de backup/retención |

**Ejemplo conceptual D05-02:** correlacionar escritura sobre `/etc/sudoers.d/` por actor fuera de change window con validación de `visudo` y, en ≤30 min, ejecución privilegiada inusual por esa cuenta. **Prueba positiva:** archivo inventado bajo `$HOME/t5-lab/etc-sudoers.d/` (no `/etc`) con evento simulado; **negativa:** mantenimiento autorizado con cambio aprobado. Sin sensor para escrituras a archivos reales no se debe etiquetar el caso como cubierto.

**Cobertura ATT&CK actual:** técnicas como T1548.001 ayudan a nombrar comportamientos; un mapeo MITRE no garantiza analítica operativa. Nótese que la página histórica de *Data Sources* está deprecada desde ATT&CK v18 (octubre 2025) [DOC:S30]; usar estrategias y analíticas actuales al diseñar reglas.

# 11. Rendimiento: separar avería de intrusión y medir correctamente [DOC:S25–S27]

La triada «CPU alto = malware», «memoria libre baja = fuga» y «load average alto = CPU saturado» lleva a diagnósticos erróneos. Linux usa memoria como cache, `loadavg` puede contar tareas en espera no interruptible, y contenedores pueden ver límites de cgroup distintos del host. Un host sano puede sufrir presión de IO con CPU desocupada; un ataque puede degradar la app **sin** afectar un promedio de cinco minutos.

| Síntoma | Medir primero | Diferenciar | Escalado seguro |
|---|---|---|---|
| CPU alta | `uptime`, `top`, `ps`, `mpstat` (si instalado) | user/sys/steal, throttling cgroup, proceso responsable | perf/eBPF profilado aprobado, no reiniciar por defecto |
| Memoria baja/OOM | `free -h`, `vmstat 1 3`, kernel OOM y `/proc/pressure/memory` | cache vs RSS vs swap vs límite contenedor | heap/profile por dueño, revisar límites y backing storage |
| Latencia IO | `iostat -xz 1 3`, `pidstat -d` y PSI IO | latency/queue/throughput, disco vs red FS | confirmar disco FS, controlador, proceso writer |
| FD agotados | `/proc/PID/limits`, contadores FD, `lsof` dirigido | `ulimit -n` vs fuga FD vs clientes | planificar limit settings + revisión app |
| Disco lleno | `df -hT`, `df -i`, `du -x` limitado | bloques, inodos, archivos eliminados abiertos | preservar hallazgos y modificar por cambio |
| Red lenta | `ss -ti`, `ip -s link`, `nstat`, `tcpdump` dirigido | retransmisión, MTU, DNS, drops | correlacionar T4 y verificar destino |
| Pod reinicia | `docker inspect`, `kubectl describe pod` (si aprobado) | OOMKilled, healthcheck, crash, rollout | comprobar cgroup/metrics y eventos de control plane |

```bash
# Chequeo no destructivo, sin agentes nuevos:
date -u +%FT%TZ
uptime
free -h
vmstat 1 3
ps -eo pid,ppid,stat,%cpu,%mem,comm --sort=-%cpu | head -15
for f in /proc/pressure/{cpu,memory,io}; do
  [ -r "$f" ] && { echo "## $f"; cat "$f"; }
done
cat /proc/loadavg
```

PSI (*Pressure Stall Information*) mide proporción de tiempo donde una o varias tareas esperan recursos; no sustituye perfiles de aplicación ni prueba causa criminal [DOC:S25]. `strace` y `perf` pueden modificar tiempos, exponer argumentos y datos, o requerir `ptrace` y privilegios; usar sesiones cortas, PID objetivo, redacción y autorización [DOC:S26]. En caso de OOM buscar mensajes de kernel y logs de aplicaciones para establecer **quién fue matado y por qué**; no atribuir al proceso con más RSS sin comparar la política de OOM/cgroup.

## 11.1 Runbooks por síntoma

**CPU alta a las 03:00:** (a) UTC/hostname/boot → (b) carga y presión CPU → (c) PID y árbol → (d) unidad/cgroup, exe/binario/hashes y fecha de despliegue → (e) actividad de red/IO y jobs autorizados → (f) incidente si la cadena es anómala y hay impacto/evidencia. El hecho de usar `python3`, `bash` o `/tmp` no implica ataque.

**Servicio no arranca por permisos:** (a) status/excepción → (b) DAC (`namei`, ACL) → (c) MAC AVC/denied → (d) sandbox systemd/binds/`ReadWritePaths` → (e) prueba reproducible en VM → (f) corrección mínima + regresión positiva/negativa. No `chmod -R 777`, no `setenforce 0` permanente.

**SIEM deja de recibir:** (a) ¿origen produce evento? → (b) journald/audit y pérdidas → (c) rsyslog queue y DNS/TLS → (d) red T4 → (e) ingesta/parsing/índice → (f) prueba canaria sintética; verificar end-to-end. Un `systemctl active` solo indica proceso de servicio, no canal funcionando.

# 12. Bash y automatización segura en producción [DOC:S26,S28]

La automatización SOC debe ser **idempotente, acotada y observable**. En Bash se deben tratar entradas, expansión de globs, espacios, errores de pipeline, ficheros temporales y señales. `set -euo pipefail` mejora el control de fallos en muchos scripts, **pero no convierte Bash en lenguaje seguro**: la semántica de `set -e` varía por contexto de condición, OR, funciones y subshell; diseñar tests explícitos.

Patrón mínimo de informe de inventario de solo lectura, usando directorio privado bajo `mktemp` y `trap`, sin borrar archivos ajenos:

```bash
#!/usr/bin/env bash
set -euo pipefail
umask 077
case_dir=$(mktemp -d "${TMPDIR:-/tmp}/t5-evidence.XXXXXXXX")
# El usuario elige después si conserva o destruye el directorio.
# No hay 'trap rm -rf': una evidencia no se borra automáticamente.
trap 'printf "Salida: %s\n" "$case_dir" >&2' EXIT
{
  date -u +%FT%TZ
  hostname
  cat /proc/sys/kernel/random/boot_id
  uname -r
  id
} > "$case_dir/host-context.txt"
ps -eo pid,ppid,uid,stat,comm --sort=pid > "$case_dir/processes.txt"
sha256sum "$case_dir"/*.txt > "$case_dir/SHA256SUMS"
printf 'Directorio de salida: %s\n' "$case_dir"
```

El directorio que imprime el script debe tratarse como sensible y conservarse o borrarse **mediante decisión explícita** según finalidad. Se ha diseñado para evitar `sudo`, no contactar red ni interactuar con PAM. Cuando se haga una herramienta industrial: introducir `--dry-run`, opciones `--scope`, `--case-id`, redacción de datos, logging separado de `stdout`, códigos de salida, manejo de interrupción, cuotas de ejecución y test unitario en CI.

## 12.1 Riesgos específicos de automatización

- **TOCTOU/symlink:** no escribir como root en rutas de `/tmp` elegidas por usuarios no fiables. `mktemp` evita algunas colisiones, pero la seguridad completa exige ownership y apertura adecuada.
- **Pipeline:** `grep PATTERN archivo` devuelve código 1 si no hay match; eso no prueba error de sistema. Controlar estados separados.
- **Inyección de shell:** no `eval` ni `bash -c` sobre texto importado de eventos; preferir arrays y llamadas directas de programa.
- **Carreras y mutación:** no usar `find / -exec chmod`, `kill -9` en lotes ni borrar logs automáticamente. Revisar primero y limitar el directorio.
- **Credenciales:** no almacenar contraseñas ni tokens en `env`, historial, parámetros de proceso o JSON de laboratorios. Variables de entorno pueden filtrarse a procesos privilegiados y a volcados; usar secret manager apropiado.
- **Rollback:** controlar efectos secundarios y reversión; un archivo de salida con nombre conocido **no** debe truncar evidencia existente.
- **Idempotencia:** repetir la prueba no debe modificar host de forma acumulativa ni producir eventos falsamente atribuidos a ataque.

# 13. Contenedores Linux: aislamiento, superficie y responsabilidad [DOC:S31–S37]

Un contenedor comparte kernel con el host (salvo arquitecturas con VM adicional), mientras que namespaces y cgroups proporcionan aislamiento/contabilidad de diferentes recursos. Seccomp filtra syscalls y LSM aplican restricciones de acceso. **Ninguno equivale a una frontera perfecta de seguridad**: su efectividad depende de runtime, versión de kernel, capacidades, montajes, privilegios, API y permisos del daemon.

```text
imagen (layers + manifest + firmas) → runtime → proceso de contenedor
  ├─ uid/gid mapping, namespaces pid/mnt/net/ipc/uts/user/cgroup
  ├─ cgroups (cpu/memory/pids/io)
  ├─ capabilities (limitar)
  ├─ LSM (AppArmor/SELinux) + seccomp + no_new_privs
  ├─ FS overlay + volúmenes/bind mounts (rutas host)
  ├─ redes/puertos/DNS
  └─ logs de stdout/stderr y eventos del runtime
                    ↓
             daemon/socket/control plane
```

## 13.1 Auditoría defensiva sin ejecutar imágenes desconocidas

```bash
# En VM con Docker preinstalado: todos son de inspección, salvo que tu wrapper tenga hooks.
docker context ls
docker info --format '{{json .SecurityOptions}}' 2>/dev/null || true
docker ps --no-trunc --format '{{.ID}} {{.Image}} {{.Names}} {{.Status}}' 2>/dev/null || true
# Para contenedor PROPIO existente de laboratorio:
# docker inspect --format '{{json .HostConfig.SecurityOpt}}' ID
# docker inspect --format '{{json .HostConfig.CapAdd}}' ID
# docker inspect --format '{{json .HostConfig.Privileged}}' ID
# docker inspect --format '{{json .Mounts}}' ID
# docker inspect --format '{{json .Config.User}}' ID
```

**Peligro del socket:** Docker advierte que controlar el daemon rootful puede permitir acceso muy potente al host, incluyendo montajes de rutas. Pertenecer al grupo `docker` no debe considerarse «permiso menor»; **evitar** mapear `/var/run/docker.sock` en aplicaciones sin justificación y medidas restrictivas [DOC:S31]. `rootless` ejecuta daemon y contenedores en contexto de usuario no root, con prerrequisitos y limitaciones reales [DOC:S32].

## 13.2 Controles recomendados, con alcance explícito

| Control | Criterio de aceptación | Punto ciego |
|---|---|---|
| Ejecutar como usuario no-root | UID distinto de 0 + capacidades mínimas + ownership funcional | UID interno no identifica automáticamente UID del host si hay userns |
| `no-new-privileges` | Config y prueba de no ganancia de privilegios | No elimina privilegios presentes |
| Limitar capabilities | `cap-drop=ALL` con add-back imprescindible | Algunas apps requieren capabilities concretas |
| Seccomp runtime/default | Perfil activo que bloquea syscalls innecesarias | Perfil genérico puede permitir exceso, no corrige app |
| SELinux/AppArmor aplicados | Perfil/contexto y prueba de restricción | Contexto de host puede ser distinto |
| Root FS read-only | La aplicación escribe solo en volúmenes temporales/datos necesarios | tmpfs/volúmenes siguen siendo superficies |
| Sin `--privileged`, hostPID, hostNetwork salvo excepción documentada | Config efectiva y aprobación | Montajes, device access o socket pueden seguir siendo potentes |
| Bind mounts mínimos, secretos externos | No exponer `/`, `/etc`, home completo ni token indiscriminado | Volúmenes pueden contener secretos y persistencia |
| Imágenes de origen verificable | digest, SBOM, análisis de vulnerabilidades, firma si disponible | Imagen limpia puede ejecutar app vulnerable |
| Egress, identidad y network policy | Controles probados del runtime/orquestador/red | NAT, DNS/proxy y policies de cluster pueden variar |

## 13.3 Kubernetes: políticas y pruebas realmente significativas

El **Pod Security Standards** define niveles `Privileged`, `Baseline` y `Restricted`; Restricted exige condiciones como ejecutar sin root, `allowPrivilegeEscalation: false`, seccomp adecuado y eliminar capabilities salvo excepciones enumeradas, con condiciones/versiones de sistema [DOC:S34]. **Enforcement** requiere configurar mecanismos apropiados (p. ej. Pod Security Admission), y el estándar no garantiza seguridad de host ni de red.

```yaml
# FRAGMENTO DIDÁCTICO de securityContext de un workload conocido y compatible:
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  seccompProfile:
    type: RuntimeDefault
  capabilities:
    drop: ["ALL"]
```

`runAsUser` debe ser compatible con la imagen y sus volúmenes. **No aplicar** por lotes a producción; estudiar `fsGroup`, initContainers, rootless runtime, volúmenes y policy actual. Para SOC, registrar audit del API/control-plane, admissions, workload revisions, image digests y contenedor real; logs de host no sustituyen eventos de Kubernetes.

## 13.4 Ejemplos de abuso de configuración, sin instrucciones de escape

- Contenedor privilegiado aprobado temporalmente que queda como servicio permanente: evidencia en configuración del runtime, propietario y change-ticket; **no** realizar escape.
- Imagen con shell administrativa que aparece inesperadamente en despliegue inmutable: investigar `execve`, `container.id`, identidad API y motivos de operación; no concluir ataque solo por `sh`.
- Montaje de socket Docker: tratar como delegación de control sensible y no como simple acceso a archivo.
- Credenciales de cloud montadas en contenedor: inventariar exposición con datos sintéticos y rotación documentada; **no** extraer tokens reales.

# 14. Red Team autorizado: modelo de trabajo centrado en evidencia [DOC:S29,S38]

**ROE obligatorio:** propietario, objetivos, cuentas, duración, ventana, límites de carga, canales de notificación, registro de operaciones, artefactos permitidos, rollback, condición de parada y custodia. Las demostraciones de esta tanda **no** explotan CVE ni roban credenciales; buscan fallos de configuración y detección probados en sistemas de laboratorio.

## 14.1 Metodología de diez pasos

1. **Pre-engagement.** Identificar sistemas y delimitación; revisar prohibición de explotación kernel, persistencia fuera del lab, DoS y datos sensibles.
2. **Baseline.** Capturar host, kernel, distro, UID, contenedor/VM, LSM, auditoría y servicios antes de tocar nada.
3. **Enumeración local.** Usuarios/grupos, sudoers propios, SUID/SGID/capabilities, procesos/servicios, rutas editables, fstab, contenedores, socket y secretos **sintéticos**.
4. **Hipótesis verificables.** «el grupo `analista-lab` puede editar script ejecutado bajo cuenta `svc-lab`»; no reportar «root disponible» sin ruta/impacto demostrados.
5. **Prueba de concepto inocua.** Escribir marcador en un directorio del laboratorio, con cuenta de bajo privilegio y sin ejecutar código privilegiado ajeno.
6. **Observabilidad.** Registrar qué ve audit/journal/EDR/SIEM; medir event loss, retrasos, redacción y campos ausentes.
7. **Evaluación de impacto.** Separar acceso potencial, explotación efectiva, confidencialidad/integridad/disponibilidad y alcance.
8. **Remediación mínima.** Ownership, permisos, definición explícita de servicio, capabilities, policy MAC o ajustes de controles adecuados.
9. **Retest positivo/negativo.** Comprobar función legítima **y** bloqueo del abuso simulado, sin depender de una sola señal.
10. **Informe reproducible.** Paso, fuente, hash de archivo, timestamps, equipo, resultado, incertidumbre, severidad contextual y contraprueba.

## 14.2 Ejemplo de hallazgo con alcance seguro

**Hallazgo ilustrativo RT-LNX-005:** «Script de mantenimiento del LAB ejecutado como servicio privilegiado puede modificarse por cuenta no administradora». **Prueba segura:** construir dos cuentas solo en **VM desechable** si está autorizado, o simular ownership con directorios locales propios; demostrar **permiso de escritura y ruta de invocación a nivel documental**, sin ejecutar payload que eleve privilegios. **No se considera compromiso confirmado** salvo que una prueba aprobada y controlada documente el cambio real de identidad. **Control propuesto:** mover script a ubicación root-owned, negar escritura a usuarios no confiables, ejecutar con identidad dedicada, restringir capabilities, atestiguar el artefacto en CI y activar FIM/audit. **Retest:** app legítima sigue funcionando; usuario no autorizado ya no escribe; detección registra intento o denegación cuando sensor lo soporta.

## 14.3 Diferencias de responsabilidad SOC / RT

- **RT:** evidencia una ruta factible dentro de ROE; el alcance demuestra un fallo sin ampliar impacto.
- **SOC:** establece línea temporal, hipótesis y límites, evita atribución precipitada, contiene e investiga alcance adicional.
- **Colaboración Purple Team:** acuerda señal mínima y caso negativo, simula benignamente el comportamiento, ajusta consulta y mide detección end-to-end.

# 15. Laboratorio base y reglas de ejecución [LAB]

**Entorno recomendado:** 1 VM Debian/Ubuntu/Parrot **desechable** y 1 VM Fedora/RHEL compatible **opcional** para contraste SELinux, ambas con snapshot probado y sin información personal. Usuario sin privilegios y `sudo` solo para lecturas autorizadas o regla audit temporal en VM. No montar volúmenes reales ni secretos; no usar host de trabajo como laboratorio. Recursos orientativos: 2 vCPU, 4 GB RAM, 25 GB disco por VM (ajustar distro); el laboratorio de contenedores es opcional si runtime no está instalado.

**Preparación no privilegiada:**

```bash
umask 077
LAB=$(mktemp -d "${TMPDIR:-/tmp}/linux-t5.XXXXXXXX")
mkdir -p "$LAB"/{data,evidence,config,simulated-logs,rootfs}
printf 't5 test document\n' > "$LAB/data/watch.txt"
date -u +%FT%TZ > "$LAB/evidence/start-utc.txt"
printf 'LAB=%s\n' "$LAB"
# Conservar la variable LAB en la misma sesión. No asumir que persiste al reconectar.
```

**Pausa segura:** si un comando requiere escribir `/etc`, `chown root`, modificar política audit/PAM, instalar agentes de kernel, usar `--privileged` o detener logs, **sustituirlo por simulación local** salvo que exista un laboratorio explícitamente preparado, acceso de rescate y autorización. Una observación de `Permission denied` al leer datos sensibles es funcionamiento esperado del mínimo privilegio, no motivo para ignorar protección.

**Evidencias por lab:** `README-<ID>.md` (alcance, fecha, host/boot), `pre.txt`, `steps.txt`, `post.txt`, hashes, datos sintéticos y tabla: esperado/observado/FP/FN/rollback. Solo incluir capturas de logs necesarias y redactadas.

# 16. Catálogo de 12 laboratorios evaluables — 100 puntos

> En el JSON los doce ejercicios aparecen como objetos `labs`, con duración, prerrequisitos, procedimiento, métricas, rúbrica, controles, remediación, retest y limpieza. Lo siguiente es el procedimiento de lectura humana, con salidas esperadas **condicionales**, ya que no se ejecuta ninguna práctica sobre la VM del usuario.

## LAB T5-L01 — DAC/ACL/umask y rutas de acceso (8 pt, 45–60 min)

**Objetivo.** Explicar por qué un archivo puede ser legible por propietario y no por otra identidad; distinguir file mode, recorrido, grupo, ACL y umask.

**Pasos:** crear en `$LAB/data` archivo 0600 y directorio 0700; inspeccionar `stat`, `namei`, `umask`; si están instalados `setfacl/getfacl`, añadir ACL para **el mismo usuario de laboratorio** sobre un archivo secundario y observar máscara en salida. No crear cuentas ni abrir permisos globalmente por comodidad.

```bash
printf 'contenido sintético\n' > "$LAB/data/private.txt"
chmod 600 "$LAB/data/private.txt"
chmod 700 "$LAB/data"
stat -c '%a %U %G %n' "$LAB/data/private.txt"
namei -l "$LAB/data/private.txt"
command -v getfacl >/dev/null && getfacl "$LAB/data/private.txt"
```

**Aceptación:** diagrama DAC correcto; comparativa de una prueba positiva y otra negativa con identidades del LAB cuando exista segunda cuenta, **sin** leer secretos ajenos. **Entregable:** tabla de permisos, ACL y contexto. **Rollback:** solo quitar ACL del fichero propio si se creó; conservar evidencia y retirar árbol manualmente cuando proceda. **[RT]** reportar exceso real, no hipotético.

## LAB T5-L02 — sudoers/PAM y superficies de identidad (8 pt, 45–70 min)

**Objetivo.** Inspección segura sin editar `/etc/pam.d` ni sudoers reales. Capturar `id`, `sudo -n -l` (puede fallar legítimamente), relaciones include de PAM, hash de fichero **copiado** del laboratorio sin material sensible.

**Pasos:** (1) listar nombres de servicios PAM de la VM; (2) interpretar `auth/account/password/session`; (3) revisar metadatos de scripts **ficticios** bajo `$LAB/config`; (4) crear ejemplo de regla sudoers sintética y analizar si un editor o script escribible amplía la delegación. No activar la regla, no invocar `pam_exec`.

**Aceptación:** identificar al menos 4 fallos posibles, un plan de cambio con rescate y un caso donde usuario autenticado queda bloqueado por account. **Entregable:** diagrama de pila, amenazas, checklist de rollback y propuesta de configuración mínima no aplicada. **[SOC]** tres fuentes para corroborar modificación real de PAM.

## LAB T5-L03 — SUID, SGID y capabilities sin escalada (8 pt, 45–60 min)

**Objetivo.** Distinguir permisos especiales de privilegio efectivo y elaborar baseline. En archivo de texto propio no ejecutable, establecer en VM de lab permiso 2640 y registrar aspecto SGID; el bit SUID en archivo de texto o script **no** debe interpretarse como escalada funcional en Linux.

```bash
printf 'prueba sgid no ejecutable\n' > "$LAB/data/special.txt"
chmod 2640 "$LAB/data/special.txt"
stat -c '%a %A %U:%G %n' "$LAB/data/special.txt"
command -v getcap >/dev/null && getcap -r "$LAB" 2>/dev/null || true
cat /proc/self/status | grep -E '^(Uid|Gid|Cap(Eff|Bnd|Amb)|NoNewPrivs):'
```

**Aceptación:** demostrar que metadatos del archivo no implican ejecución privilegiada; explicar por qué capabilities/flags necesitan contexto de proceso y binario. **Entregable:** baseline comparado y exposición corregible ficticia. **Rollback:** permisos normales en archivo LAB. **[RT]** no ejecutar binarios sospechosos ni construir SUID root.

## LAB T5-L04 — Diagnóstico MAC SELinux/AppArmor (8 pt, 45–75 min)

**Objetivo.** Identificar LSM real y ruta de evidencia. Con Ubuntu/Parrot: `aa-status` y mensajes de kernel; con Fedora/RHEL: `getenforce`, `sestatus`, `ls -Z`, auditoría AVC. Si no existe MAC, **documentar carencia** y usar un ejemplo de registro **sintético**, claramente marcado como tal.

**Aceptación:** distinguir causa DAC, MAC y systemd sandbox; planear una corrección mínima y test positivo/negativo sin desactivar política. **Entregable:** árbol de decisión, ejemplo de evento (anonimizado) e hipótesis descartadas. **Rollback:** ninguno; lab de solo lectura.

## LAB T5-L05 — journald estructurado, tags y retención (8 pt, 45–65 min)

**Objetivo.** Generar evento sintético y recuperarlo con tiempo, boot y fields. `logger` puede usar syslog/journal distinto según host; validar ingreso real y **marcar como no cubierto** si no aparece.

```bash
TAG="t5-lab-$(id -u)"
logger -t "$TAG" -- "CANARY_LNX_T5_PERSISTENCIA_SINTETICA"
journalctl -t "$TAG" --since '10 minutes ago' -o json --no-pager | head -c 5000
journalctl --disk-usage
journalctl --list-boots --no-pager
```

**Aceptación:** export de evento con timestamp y boot ID cuando presentes, explicación del límite `Storage`/`SystemMaxUse`, retención expresada en **espacio/ventana observada**, nunca «30 días garantizados». **Rollback:** no vaciar el journal; evento expira por política del LAB.

## LAB T5-L06 — Auditoría de cambios: regla efímera o sustituto sintético (10 pt, 60–90 min)

**Objetivo.** Medir diferencia entre regla configurada, regla activa, evento recibido y pérdida. En **VM con auditd y autorización**, aplicar únicamente la regla de `$LAB/data/watch.txt` descrita en §7.3.1; registrar salida `auditctl -s`, crear un único cambio de archivo, consultar `ausearch -k t5_watch_lab`, eliminar **esa misma** regla, verificar su ausencia. Si audit no existe, documentar «instrumentación no presente» y correlacionar un evento sintético sin afirmar captura real.

**Aceptación:** señal positiva **y negativa**, `lost` antes/después, correlación serial de registros, retirada controlada de la regla, sin `auditctl -D`. **Entregable:** diff de policy, evento y límites. **Fallo crítico:** tocar rutas de auditoría de producción o usar `auditctl -e 2` sin aprobación.

## LAB T5-L07 — Timeline de triaje SOC y cadena de custodia (10 pt, 70–100 min)

**Objetivo.** Crear timeline desde canary journald, PID/sesión del lab, un archivo de datos sintéticos modificado y evidencia T4 de flujo **simulado/documental**. Cada evento debe declarar observación vs inferencia y fuente de tiempo.

**Pasos:** registrar UTC y boot, obtener metadatos, congelar ficheros del expediente, sha256, simular alerta de proceso desconocido, documentar qué se necesitaría para atribuir egress. No exfiltrar datos ni lanzar conexiones externas.

**Aceptación:** cronología de al menos 6 hechos sustentados, 3 hipótesis alternativas, decisiones de contención justificadas, limitaciones explicadas y hash reproducible. **Entrega:** expediente IR con medidas inmediatas y plan de recuperación. **[SOC]** evitar «no hay login en GUI por tanto no hay proceso».

## LAB T5-L08 — Presión de recursos y diagnóstico (8 pt, 45–70 min)

**Objetivo.** Baseline `uptime/free/vmstat/PSI` y análisis de una ejecución benigna corta. No usar `stress --cpu N` arbitrario ni llenar FS. Tomar tres lecturas y describir si hay presión observada.

```bash
for i in 1 2 3; do
  date -u +%FT%TZ
  cat /proc/pressure/{cpu,memory,io} 2>/dev/null || true
  sleep 1
done
ps -eo pid,stat,%cpu,%mem,comm --sort=-%cpu | head -15
```

**Aceptación:** interpretar PSI `some/full`, loadavg vs CPU y un falso positivo benigno; no atribuir alto load a malware. **Entregable:** runbook de diagnóstico y umbrales que requieren calibración.

## LAB T5-L09 — Automatización Bash y expediente íntegro (8 pt, 50–70 min)

**Objetivo.** Ejecutar script de §12 en cuenta normal y confirmar salida privada, no sobrescritura, hash reproducible, código de salida, error de comando opcional y archivo de limitaciones. Probar rutas con espacios en un directorio de LAB, no en `/etc`.

**Aceptación:** script ejecutado dos veces produce carpetas distintas y permisos restringidos; no secrets; trazabilidad de UTC/boot; `sha256sum -c SHA256SUMS` dentro de carpeta conserva integridad tras generación (ejecución contextual correcta). **Rollback:** decidir retención y eliminar exclusivamente directorios creados identificados.

## LAB T5-L10 — Inspección de seguridad de contenedor propio (8 pt, 55–85 min)

**Objetivo.** Si Docker/Podman está instalado en VM desechable, inspeccionar **solo** contenedor de laboratorio preaprobado: UID efectivo, privileges, capabilities, mounts, seccomp, límites, namespaces y logs. Si no hay runtime, usar manifiesto YAML ficticio offline y marcar el alcance como documental.

**Aceptación:** identificar al menos 4 diferencias entre `user=root`, daemon rootful, rootless y namespace; no ejecutar imagen no verificada ni montar socket host. **Entrega:** matriz riesgo/control/test/retest. **Reversión:** solo detener/eliminar el contenedor creado para la práctica **si se creó bajo su control**.

## LAB T5-L11 — Enumeración RT autorizada y hallazgo de configuración (8 pt, 60–85 min)

**Objetivo.** Sin explotación: inventariar capacidades, permisos, rutas de ejecución editables, grupos, servicios y configuraciones simuladas con propietarios propios. Diseñar un hallazgo de permisos sobre script de mantenimiento de `svc-lab` **sin** ejecutarlo como root.

**Aceptación:** ROE explícito; reproducibilidad, evidencia de permiso, impacto posible claramente distinguido de compromiso, corrección propuesta y test negativo. **Entregable:** ficha RT de 1–2 páginas y correlativo SOC. **Fallo crítico:** lograr privilegios en sistema distinto del lab, leer secretos reales o desplegar persistencia.

## LAB T5-L12 — Purple Team: prueba final y retest extremo a extremo (8 pt, 90–120 min)

**Objetivo.** Combinar: un evento sintético de PAM/sudoers bajo árbol del lab, aviso de cambio de configuración, canary journal, tabla de detección D05-02, incidente de rendimiento benigno y contenedor inseguro **ficticio**. Ejecutar una secuencia de test positivo/negativo y producir informe SOC + hallazgo RT enlazados.

**Aceptación:** (a) declarar claramente cuáles eventos fueron observados y cuáles simulados, (b) mapear al menos 5 fuentes/sensores, (c) calcular latencia solo si medida realmente, (d) remediación que mantiene servicio funcional, (e) prueba negativa, (f) lista de huecos. **Entrega:** dossier final y recomendaciones priorizadas.

## 16.1 Rúbrica general y distribución

| LAB | Puntos | Habilidad dominante |
|---|---:|---|
| T5-L01 | 8 | DAC/ACL |
| T5-L02 | 8 | PAM/sudoers |
| T5-L03 | 8 | SUID/capabilities |
| T5-L04 | 8 | MAC y diagnóstico |
| T5-L05 | 8 | journald |
| T5-L06 | 10 | auditd |
| T5-L07 | 10 | DFIR |
| T5-L08 | 8 | rendimiento |
| T5-L09 | 8 | scripting seguro |
| T5-L10 | 8 | contenedores |
| T5-L11 | 8 | Red Team autorizado |
| T5-L12 | 8 | Purple Team/retest |
| **Total** | **100** | **Cobertura integral** |

**Rubricación transversal por LAB:** 25 % preparación/ROE, 30 % calidad de evidencia, 25 % explicación técnica/detección, 20 % rollback/retest; redondeo al punto entero, ajustar en JSON para que el total de cada laboratio sea exactamente sus puntos. Un acierto de comando sin hipótesis ni verificación no supera el estándar.

# 17. Casos de entrevista y operación — solución razonada

## Caso A. «El servidor deja de registrar y su tráfico saliente crece»

**Lo que sabemos:** ventana de pérdida de telemetry + egreso. **Lo que no sabemos:** autor, proceso responsable, datos, por qué fallaron sensores. **Primeros 60 segundos (orientativo, sin automatismo universal):** abrir incidente, usar sensores independientes/perimetrales para identificar flujo, aplicar contención dirigida si el daño continúa, pedir snapshot/live-response mínimo cuando sea posible. Buscar estado audit, buffer perdidos, rsyslog queues, journal rate-limit, espacio, cambios de service/timer, redirección proxy y cambios de identidad. No asumir que `ss -tulnp` mostrará conexiones salientes: esa opción lista **listeners** TCP/UDP; usar `ss -tanup` y sensores de red para flujos activos [T4]. No basar respuesta en un `kill PID` a ciegas.

## Caso B. «Falla SSH pero el usuario aparece en getent passwd»

Separar autenticar y autorizar: host key/red/T4, sshd config efectivo, PAM `auth` vs `account`, expiración/SSSD, derechos del home y `authorized_keys`, SELinux/AppArmor y journald. Un usuario existente en NSS no garantiza acceso. Aplicar cambios únicamente con sesión de rescate y retest.

## Caso C. «Un AVC aparece tras mover directorio web»

Comparar rutas, contexto actual/esperado, ruta de contenido, owner DAC y unidad systemd. `restorecon -n` evalúa etiquetado potencial; corregir solo si el contexto esperado ha sido aprobado, sin `setenforce 0`. Puede haber una denegación legítima que se debe mantener.

## Caso D. «Audit lleva una hora sin eventos»

¿Está el servicio arriba? ¿reglas? ¿agente sano? ¿fuente de eventos? ¿backlog/lost? ¿capacidad del disco/rotación? ¿cambio de reloj? ¿collector/SIEM desfasado? Producir canary controlado y confirmar su recepción hasta destino; un silencio sin canary es **visibilidad insuficiente**, no «host limpio».

## Caso E. «Imagen Docker verificada, pero proceso de contenedor accede al host»

La firma/scan verifica una propiedad de imagen o supply chain; no neutraliza un bind mount excesivo, `--privileged`, socket del daemon ni vulnerabilidades de runtime. Revisar configuración real, proceso, capabilities, userns y control plane. No demostrar escape sobre activos reales.

## Caso F. «Host con 95 % de memoria usada, CPU baja y latencia alta»

Diferenciar cache frente a memoria disponible, PSI, swap, OOM, IO saturation y cgroups. La app puede bloquearse por disco o page faults; más RAM o matar al proceso no constituye hipótesis inicial suficientemente probada.

## Caso G. «Se detectó `chmod u+s` en un fichero de usuario»

Comprobar propietario, tipo de fichero, FS `nosuid`, ejecutabilidad, ruta, versión de software y contexto de proceso. Si no es binario ejecutable privilegiado, el bit puede ser inocuo para elevación. Correlacionar cambio con actor y ejecuciones posteriores; no reportar escalada lograda sin observarla.

## Caso H. «Se abrió una shell dentro de un pod a las 04:10»

Verificar auditoría del API, actor `kubectl exec` o runtime, ventana de mantenimiento, imagen, UID, sistema de deployment y comandos con metadata autorizada. Las shells pueden ser depuración válida; ausencia de API evento cuando hay `nsenter` u otros caminos puede explicar discrepancia. Nunca concluir compromiso solo por `bash`.

# 18. Plantilla de informe SOC/IR (entregable)

```markdown
# Caso IR-LINUX-XXX — [título]
**Estado / prioridad:**
**Ámbito y autoridad:**
**Inicio incidente UTC / inicio adquisición UTC:**
**Activo / función / entorno / boot_id:**

## Qué se observó realmente
- Evento A [fuente, timestamp, ID, artefacto, hash]
- Evento B ...

## Hipótesis y contraste
- H1: [evidencia favorable, contraria, incertidumbre]
- H2: ...

## Exposición e impacto
- Confirmado:
- Posible/no confirmado:

## Respuesta y seguimiento
- Contención: [qué cambió, quién aprobó, impacto y rollback]
- Recolección: [herramienta versión, alcance, cadena de custodia]
- Erradicación/restauración: ...

## Detección y pruebas
- Sensores activos / faltantes / dropped events:
- Test positivo / test negativo / tiempo de ingesta medido:

## Limitaciones y conclusión
- [Ninguna ausencia de log se presenta como prueba de ausencia de acción.]
```

# 19. Plantilla de hallazgo Red Team / Purple Team

```markdown
# RT-LNX-XXX — [riesgo de configuración]
**ROE y propietario:**
**Activo de laboratorio / cuenta / fecha UTC:**
**Configuración observada (con hash):**
**Prerequisitos demostrados:**
**Impacto efectivamente reproducido:**
**Impacto hipotético aún no demostrado:**
**Pasos mínimos de verificación no destructivos:**
**Telemetría que SOC debería ver:**
**Cambios de remediación y responsable:**
**Retest positivo (legítimo funciona):**
**Retest negativo (comportamiento inseguro bloqueado):**
**Riesgo residual / límites de alcance:**
```

# 20. Examen final: 40 preguntas de razonamiento

1. Diferencia RUID, EUID, FSUID y `auid` en la atribución de una operación.
2. ¿Por qué `getent passwd` puede ser más completo que leer `/etc/passwd`?
3. ¿Por qué ver `+` en permisos obliga a consultar `getfacl`?
4. ¿Cuándo un directorio padre puede bloquear lectura de archivo que tiene `0644`?
5. Diferencia SUID binario, SGID directorio y sticky bit.
6. ¿Por qué tener `CAP_NET_BIND_SERVICE` no equivale a ser root?
7. ¿Qué implica `CAP_SYS_ADMIN` y por qué restringirla especialmente?
8. ¿En qué escenarios `sudo -l` no basta para concluir una elevación explotable?
9. Distingue control `required`, `requisite`, `sufficient`, `optional` en PAM.
10. ¿Por qué `account` PAM puede denegar un login tras autenticar correctamente?
11. ¿Qué riesgo presenta `pam_exec` cuando el script es editable o recibe input no confiable?
12. ¿Cómo cambiar PAM en producción sin perder acceso administrativo?
13. Diferencias DAC vs MAC con un ejemplo en que DAC permita y MAC niegue.
14. ¿Por qué AVC no prueba ataque y ausencia de AVC no prueba permiso?
15. ¿Qué es un contexto/tipo SELinux y por qué mover una ruta puede alterar acceso?
16. ¿Qué hace AppArmor complain en relación con enforce y por qué no deja el mismo riesgo?
17. ¿Por qué `aa-logprof` no debe considerarse una lectura sin mutación?
18. ¿Qué problema resuelve `ReadWritePaths` en un servicio con `ProtectSystem=strict`?
19. Explica por qué `systemd-analyze security` no certifica que una unidad sea segura.
20. Diferencias funcionales entre journald, rsyslog y auditd.
21. ¿Qué dice `_BOOT_ID` y por qué es importante tras un reboot?
22. ¿Qué garantiza `SystemMaxUse` y qué no garantiza de la retención?
23. ¿Por qué `journalctl --verify` no demuestra por sí solo ausencia de manipulación?
24. ¿Cómo relacionas `SYSCALL`, `EXECVE`, `PATH` con serial de audit?
25. ¿Para qué sirve `auid` en una operación ejecutada con sudo y qué límite tiene?
26. ¿Qué significan `lost` y `backlog` en la evaluación de cobertura de audit?
27. ¿Por qué `auditctl -D` es inaceptable como limpieza de un laboratorio compartido?
28. ¿Qué diferencia hay entre un log generado y un evento indexado en el SIEM?
29. Identifica dos falsas inferencias en «no hay login registrado, no hubo intrusión».
30. ¿Qué preservarías antes de hacer `kill` durante una exfiltración y cuándo priorizarías contención inmediata?
31. ¿Cómo interpretas CPU pressure `some` y por qué no diagnostica malware?
32. ¿Cómo puede load average ser alto con CPU porcentualmente baja?
33. ¿Qué daño puede causar instrumentación indiscriminada con `strace`?
34. ¿Cómo haces que un script de recogida de evidencia no borre ni sobrescriba artefactos?
35. Diferencia un contenedor y una VM respecto a kernel y superficie de ataque.
36. ¿Por qué el socket Docker de daemon rootful equivale a un permiso sensible sobre host?
37. ¿Qué diferencia hay entre daemon rootless, usuario del contenedor y `runAsNonRoot`?
38. ¿Qué exigen seccomp, capabilities y Pod Security Restricted de forma no redundante?
39. ¿Cómo demostrarías responsablemente un hallazgo de script de mantenimiento escribible?
40. ¿Qué condiciones han de cumplirse antes de declarar que un retest cerró una vulnerabilidad y que SOC la detecta?

## 20.1 Guía de respuestas razonadas (criterios de corrección)

| Nº | Núcleo de respuesta esperado |
|---|---|
| 1 | Real, efectiva, filesystem y audit login UID describen propiedades distintas; la atribución exige continuidad de sesión y contexto. |
| 2 | NSS puede usar directorio remoto, SSSD u otras fuentes. |
| 3 | ACL extendida y máscara efectiva pueden alterar permisos visibles. |
| 4 | Falta de permiso `x` de búsqueda/travesía en cualquier padre. |
| 5 | Cambio de identidad en ejecución, grupo heredado y protección de borrado en directorio compartido. |
| 6 | Es una capacidad delimitada, sujeta a bounding, LSM y otros controles. |
| 7 | Amplia superficie de operaciones administrativas del kernel; no es capacidad mínima. |
| 8 | Policy efectiva, argumentos, binario, owner, shell escapes, contexto y controles compensatorios. |
| 9 | Acumulación de fallos, salida inmediata, posible éxito que termina pila y efecto condicionado. |
| 10 | Account verifica elegibilidad/vigencia independientemente de credencial. |
| 11 | Ejecución bajo identidad de servicio y entrada/entorno controlables, con riesgo de credenciales. |
| 12 | Snapshot, out-of-band, sesión mantenida, aprobación, validación y rollback. |
| 13 | Política obligatoria niega acceso aunque propietario/ACL lo permita. |
| 14 | Desconfiguración legítima y registros ausentes, `dontaudit`, filtrado u otras limitaciones. |
| 15 | Etiquetas y reglas por dominio/tipo pueden depender de contexto esperado de ruta. |
| 16 | Complain permite y registra ciertas violaciones; enforce bloquea según perfil. |
| 17 | Puede sugerir, guardar y cargar cambios de política. |
| 18 | Declara rutas de escritura necesarias para servicio restringido sin abrir sistema entero. |
| 19 | Revisa configuración de sandbox, no amenazas completas/servicio real. |
| 20 | Journal estructurado de mensajes, pipeline syslog y auditoría de operaciones bajo reglas. |
| 21 | Identificador de arranque; distingue ciclos con PIDs y monotonic time reciclados. |
| 22 | Espacio local máximo condicionado, no ventana temporal fija ni entrega remota. |
| 23 | Comprobación local no autentica fuentes ni representa sellado externo garantizado. |
| 24 | Eventos de auditoría agrupan registros por serial/host/tiempo. |
| 25 | Identidad de login puede sobrevivir elevación; puede estar unset y manipulable por root/host comprometido. |
| 26 | Pérdida de eventos y profundidad de cola; monitorizar tasas y anomalías. |
| 27 | Elimina reglas ajenas y rompe cobertura/compliance; limpiar una sola regla de LAB. |
| 28 | Pipeline: source→agente→cola→red→parse→index; cada tramo puede fallar. |
| 29 | Persistencia sin login nuevo y ausencia de instrumentación/retención; más hipótesis válidas. |
| 30 | Sockets/procesos/FDs/memoria si factible; si el daño continúa, contención proporcional sin demora imprudente. |
| 31 | Tiempo de espera por contención; causa puede ser carga legítima u otras limitaciones. |
| 32 | Tareas bloqueadas por IO contribuyen a carga; CPU puede esperar. |
| 33 | Overhead, timing, ptrace y captura de datos o secretos. |
| 34 | `mktemp`/umask, no sobreescritura, validación, hashes y política de retención explícita. |
| 35 | Contenedor común comparte kernel; VM tiene guest kernel y hypervisor, aislamiento distinto. |
| 36 | Control de daemon puede conceder montajes/ejecución potente en host, según política. |
| 37 | Daemon rootless protege daemon en userns; usuario de proceso y política K8s son otras dimensiones. |
| 38 | Syscalls, privilegios de kernel y conjunto de política de pod/restricciones de ejecución. |
| 39 | ROE, permisión observable, PoC inocua, efecto demostrado frente a hipotético, solución y test. |
| 40 | Aprobación, configuración corregida, funcionalidad conservada, abuso bloqueado, registro observado, FP/FN y gaps claros. |

# 21. Secuencia de aprendizaje y dependencias para las cinco tandas

La ruta **no obliga** a dominar exploit development para SOC N1/N2; exige saber qué información revela cada artefacto, investigar y documentar por qué una conclusión es válida. Red Team necesita el mismo modelo interno pero su evaluación de exposición se concentra en identidad, ejecución, privilegios, alcance y prueba responsable.

| Etapa sugerida | Prerrequisitos | Demostrable | Error a evitar |
|---|---|---|---|
| 1. Terminal/servicios (T1–T2) | VM Linux, shell | navegación, permisos, systemd, paquetes | memorizar comandos sin explicar contexto |
| 2. Filesystem/backups (T3) | T1 | inodos, metadatos, restauración | confundir snapshot con backup |
| 3. Red/SSH/firewall (T4) | T1–T2 | socket→proceso→red→política | tratar `ss -tulnp` como listado de todas las conexiones |
| 4. Identity/MAC (T5 §3–6) | T1–T2 | DAC/PAM/LSM, riesgos y retest | «arreglar» con chmod 777 o SELinux off |
| 5. Telemetría DFIR (T5 §7–10) | T2–T4 | audit, logs, timeline, cobertura | creer que ausencia de log exonera |
| 6. Operaciones/containers (T5 §11–13) | T1–T5 | PSI, automatización, config runtime | contenedor = VM; rootless = invulnerable |
| 7. Purple Team (T5 §14–20) | todas | ROE → PoC inocua → detection → retest | confundir posibilidad con compromiso |

**Cadencia orientativa, no requisito:** 6–8 semanas de trabajo práctico (4–6 h/semana) para repasar base y laboratorios si ya administras Linux, o más para empezar de cero. La aprobación debe basarse en laboratorios y razonamiento, no en horas acumuladas.

# 22. Mapa de competencias SOC N1/N2 y Red Team

| Competencia | SOC N1 | SOC N2/DFIR | Red Team autorizado |
|---|---|---|---|
| UID, procesos, permisos | reconocer anomalía y escalar | reconstruir identidad/exec y limitaciones | encontrar exposición sin explotar por defecto |
| PAM, sudoers, LSM | leer alertas y cambios | validar policy, containment y remediación | buscar controles ineficaces dentro de ROE |
| journald/rsyslog/auditd | consultas, triage, evidencia mínima | diseñar cobertura, tuning, correlation | emular cambios benignos para test detección |
| Discos y restauración | identificar pérdida y urgencia | recuperar artefactos y continuidad | revisar exposición e integridad de backup |
| Networking host | sockets/SSH, evidencia egreso | flows, PCAP, NAT, containment | verificar reachability autorizada |
| Contenedores | reconocer contexto de alerta | runtime, control plane y forensic boundaries | auditar config e identidad sin escape |
| Reporting | ticket fact-based y prioridad | timeline, custodia, impacto, gap analysis | finding reproducible + retest |

# 23. Detecciones de baja fidelidad: catálogo de errores frecuentes

1. **«`chmod +s` siempre es escalada»**: metadatos, dueño, exec, mount `nosuid`, LSM, versión y acción posteriores importan.
2. **«`pam_exec` en PAM significa malware»**: herramienta legítima pero sensible; revisar permiso, origen y change-ticket.
3. **«`setenforce 0` arregla el error»**: oculta una clase de restricción; no demuestra que el problema de acceso sea corregido.
4. **«Audit activo registra todo»**: depende de reglas, filtros, arch, event loss y arranque.
5. **«`journalctl --verify` firma todos los eventos»**: la comprobación de archivos no autentica contenido por sí misma.
6. **«No hay proceso en `ps`, no existió»**: la salida es una instantánea.
7. **«El sensor tiene proceso activo, recibe logs»**: health end-to-end se prueba con canary.
8. **«Se cambió la imagen y cerramos el hallazgo de contenedor»**: socket, montajes, rootless y policy siguen relevantes.
9. **«Alta CPU significa coin miner»**: correlacionar ejecución, red, cron, workload y cambios.
10. **«Hay una cuenta sospechosa en `/etc/passwd`»**: verificar NSS, autor de cambio, sistema de provisión y ticket.
11. **«Dado un hash SHA256, el evento es cierto»**: el hash garantiza integridad de bytes de la muestra, no veracidad de origen.
12. **«Se ejecutó la PoC en LAB, está detectado en SIEM real»**: distinguir simulación local de instrumentación/alerta desplegada.

# 24. Política mínima de logging viable para un mini-SOC Linux

**No es benchmark ni recomendación universal; es un diseño de laboratorio.**

- Inventario único por host: hostname, machine-id (proteger si se comparte), boot_id, entorno, versiones, dueño, sensibilidad, tiempo UTC/sincronización.
- Garantizar fuentes básicas: autenticación SSH/sudo, servicios críticos, errores kernel/systemd, cambios críticos de identidades/archivos, health de audit y forwarders.
- Probar cobertura de eventos cada despliegue importante: canary journald, regla audit específica en un **host test**, flujo de `omfwd` TLS si se ha configurado, ingestión end-to-end y retención real.
- Señales contenedor si corresponde: creación/exec, permisos, mounts, API audit, imagen/digest y cambios de securityContext.
- Separar métricas técnicas (eventos perdidos, cola, bytes, CPU/IO) de alertas de seguridad. Un `lost` alto puede preceder a una falsa ausencia de actividad.
- Versionar detecciones: ID, hipótesis, fields, consultas reales por plataforma, propietario, umbral, caso positivo/negativo, FP, FN, evidencia de test y fecha.
- Protección de datos: minimizar argumentos, payloads y secretos, controlar acceso RBAC, definir retención legal, cifrado y proceso de borrado aprobado.

## 24.1 Ejemplo de mapeo conceptual hacia SIEM

| Campo genérico | Linux Audit | journald/syslog | EDR/runtime |
|---|---|---|---|
| `host.id` | nodo/agente/contexto | `_MACHINE_ID` si está presente | machine identity |
| `event.time` | timestamp `msg=audit(...)` | `__REALTIME_TIMESTAMP` y/o timestamp parseado | timestamp agente + clock source |
| `user.id` | `uid`, `euid`, `auid` (no equivalentes) | campos `_UID` cuando disponibles | uid/euid actor |
| `process.pid` | `pid`, `ppid` si evento incluye | `_PID` en eventos con metadata | PID + start time/container ID |
| `process.command_line` | `EXECVE`/`PROCTITLE` bajo cobertura | línea emitida por app no basta | syscall/agent capture con limitaciones |
| `file.path` | `PATH` | mensaje de app | FIM/EDR |
| `event.outcome` | `success=yes/no` para syscall | inferir solo si message lo define | field outcome del sensor |

**No aplicar mapeos 1:1** a ECS/OCSF/Sentinel sin validar esquemas reales y fuente: `auid` no es igual a user autenticado de aplicación; `_PID` de aplicación puede ser de sender pero no garantiza principal humano; algunos campos de syslog están bajo control del emisor.

# 25. Modelo de madurez: cómo saber si ya dominas Linux para SOC + RT

| Nivel | Observación reproducible | Criterio para avanzar |
|---|---|---|
| 0 — Comandos | reconoce `ps`,`ss`,`journalctl`, permisos | explica salida en vez de copiarla |
| 1 — Diagnóstico | correlaciona proceso, servicio, FS, red, identidad | produce hipótesis y prueba negativa |
| 2 — Telemetría | identifica cobertura real y fuentes perdidas | canary end-to-end documentado |
| 3 — Respuesta | conserva evidencia, decide contención, remedia | timeline e impacto sustentados |
| 4 — Purple Team | emula abuso inocuo dentro de ROE | red-team finding + alerta observada + retest |
| 5 — Operación | mantiene hardening/monitoreo/backup con control de cambio | regresión medible y rollback probado |

**Pregunta de cierre:** «¿Puedo afirmar con pruebas qué ocurrió, por qué fue posible, cómo lo habría detectado, qué se contuvo, qué sigue desconocido y cómo verificaré que no reaparezca?» Si no, queda trabajo aunque todos los comandos produzcan salida.

# 26. Matriz rápida de decisión ante un host con señales contradictorias

```text
¿Daño activo o riesgo inmediato?
 ├─ Sí → evaluar contención proporcional YA + evidencia mínima y trazabilidad
 └─ No → preservar estado + ampliar telemetría sin alterar la causa
          │
          ├─ ¿Identidad y permisos claros?
          │    ├─ Sí → mapear cuenta, sesión, EUID, policy efectiva
          │    └─ No → NSS/PAM/sudoers/capabilities/LSM, huecos instrumentación
          │
          ├─ ¿Observación de proceso/red confiable?
          │    ├─ Sí → correlacionar hora, PID+start/boot, cgroup, socket, FS
          │    └─ No → sensores externos, audit rules, métricas de loss
          │
          ├─ ¿Persistencia o cambio de configuración?
          │    ├─ Sí → baseline y artefactos T2/T3/T5; responsable/cambio
          │    └─ No → hipótesis alternativas, muestras temporales limitadas
          │
          └─ ¿Restaurado y detectado?
               ├─ Sí → test positivo + test negativo + health + custodia
               └─ No → mantener caso abierto y declarar incertidumbre
```

# 27. Comparativas esenciales para examen/entrevista

| Concepto A | Concepto B | Diferencia operativa |
|---|---|---|
| Autenticación | Autorización | Identidad probada vs derecho para esa acción en ese momento |
| `uid` | `auid` | Credencial real presente vs identidad de login audit cuando definida |
| DAC | MAC | Permisos asignados por propietarios/ACL vs política obligatoria del sistema |
| SUID | sudo | Bit sobre ejecutable vs delegación de comando bajo política |
| journald | Audit | Mensajes estructurados/servicio vs registros de auditoría bajo reglas |
| Retención local | Retención en SIEM | Copia en host vs almacenamiento indexado fuera del host |
| Health agent | Cobertura sensor | Proceso vivo vs evento realmente observado/transportado |
| Docker daemon | Proceso contenedor | Control plane con capacidades host vs workload aislado |
| Docker rootless | Kubernetes runAsNonRoot | Daemon sin privilegios root vs UID de proceso en pod |
| Snapshot | Backup segregado | Estado punto en tiempo vs recuperación independiente de dominio de fallo |
| Rate limit journal | Audit lost | Políticas distintas de pérdida/supresión de registro |
| Hallazgo potencial | Compromiso observado | Ruta posible fundamentada vs acción efectiva y evidencia |

# 28. Límites y exclusiones

1. Los comandos no han sido ejecutados en el host del lector ni en la nube/SIEM del lector. Los resultados son **hipótesis verificables**, no hallazgos de su infraestructura.
2. Distribuciones y versiones de PAM, audit, systemd, AppArmor, SELinux, Docker, Kubernetes y otros pueden cambiar semántica y salida. La documentación del fabricante/versión instalada manda sobre ejemplos.
3. Esta tanda **no** cubre rootkits avanzados, malware kernel, análisis de memoria por adquisición forense, exploit development de kernel, evasión de EDR ni penetración de sistemas ajenos: esos temas requieren laboratorios y autorizaciones independientes.
4. No incluye comandos de robo de credenciales, desactivación encubierta de sensores, escape de contenedor ni payload para obtener root. El dominio RT se mide por calidad de evidencia y diseño de pruebas autorizadas, no por peligrosidad de la acción.
5. La cadena de custodia propuesta es una plantilla técnica, no dictamen legal; adaptar a procedimientos y jurisdicción.
6. Los pesos, horas, puntajes y perfiles son **didácticos**, no normas oficiales, contratos SLA ni benchmarks certificados.
7. Todas las referencias se consultaron como documentación técnica pública al 18-10-2026. Enlaces upstream con contenido dinámico pueden actualizarse; se identifica el proveedor y el concepto soportado.
8. El esquema JSON es un catálogo de aprendizaje asociado; **no** es detección lista para importar a Sentinel/Splunk ni pipeline de forense sin revisión.

# 29. Lista de verificación para cerrar la tanda

- [ ] L01: puedes reconstruir acceso DAC/ACL/umask con permisos efectivos.
- [ ] L02: puedes leer PAM, auditar sudo y diseñar cambios sin bloqueo.
- [ ] L03: no confundes bit SUID/capability con compromiso efectivo.
- [ ] L04: puedes separar DAC/MAC/sandbox al resolver una denegación.
- [ ] L05: obtienes un canary y entiendes retención real de journald.
- [ ] L06: compruebas que una regla audit produce un evento y mides pérdida.
- [ ] L07: redactas timeline SOC con hashes y grados de certeza.
- [ ] L08: distingues CPU, PSI, IO y OOM con métricas adecuadas.
- [ ] L09: recoges evidencia con Bash sin sobrescribir artefactos ni secretos.
- [ ] L10: identificas superficies de riesgo de daemon y runtime.
- [ ] L11: documentas un hallazgo Red Team inocuo con ROE y contraprueba.
- [ ] L12: cierras un escenario Purple Team con test positivo/negativo.
- [ ] 40 preguntas: respondes con razonamiento y no con definiciones aisladas.
- [ ] Auditoría del expediente: todas las conclusiones citan evidencia y límites.

# 30. Fuentes primarias: cómo se citan en este informe

Cada `[DOC:Sxx]` remite al repertorio inmediatamente siguiente. Las URLs se ofrecen como **referencias consultables**, no como evidencias de que se haya ejecutado un comando. Se han priorizado manuales Linux-PAM/man7, systemd, kernel.org, documentación de Ubuntu/Red Hat, rsyslog, Docker/Kubernetes, Falco, MITRE ATT&CK y NIST. Algunas fuentes abarcan versión o componente concreto y deben validarse frente a la VM de práctica.

# 31. Referencias técnicas y normativas

| ID | Documento oficial/técnico | URL | Respaldan |
|---|---|---|---|
| S01 | Linux-PAM pam.d(5) | https://man7.org/linux/man-pages/man5/pam.d.5.html | Sintaxis, grupos y pilas PAM |
| S02 | Linux-PAM pam_exec(8) | https://man7.org/linux/man-pages/man8/pam_exec.8.html | Comando externo, entorno, credenciales |
| S03 | Linux capabilities(7) | https://man7.org/linux/man-pages/man7/capabilities.7.html | Capabilities, bounding/ambient, execve |
| S04 | Linux credentials(7) | https://man7.org/linux/man-pages/man7/credentials.7.html | UID/GID y credenciales proceso |
| S05 | sudoers(5) | https://man7.org/linux/man-pages/man5/sudoers.5.html | Delegación sudo, NOEXEC, límites |
| S06 | ACL(5) | https://man7.org/linux/man-pages/man5/acl.5.html | ACL, máscara efectiva, DAC |
| S07 | Linux-PAM pam.conf(5) | https://man7.org/linux/man-pages/man5/pam.conf.5.html | Precedencia vendor y config servicio |
| S08 | Linux Kernel: LSM usage | https://cdn.kernel.org/doc/html/latest/admin-guide/LSM/index.html | MAC y LSM activos |
| S09 | Red Hat RHEL 9 Using SELinux | https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/pdf/using_selinux/troubleshooting-problems-related-to-selinux_using-selinux | AVC, contexto, troubleshooting |
| S10 | Ubuntu Server: AppArmor | https://ubuntu.com/server/docs/how-to/security/apparmor/ | Enforce/complain, aa-status, perfiles |
| S11 | Linux Kernel: Yama | https://docs.kernel.org/admin-guide/LSM/Yama.html | ptrace_scope, límites de observación |
| S12 | systemd.exec(5) | https://man7.org/linux/man-pages/man5/systemd.exec.5.html | Sandboxing de servicios |
| S13 | Linux Kernel: Seccomp BPF | https://docs.kernel.org/userspace-api/seccomp_filter.html | Restringir syscalls, límites |
| S14 | RHEL 9 Security hardening | https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html-single/security_hardening/index | Hardening y Audit persistente |
| S15 | journald.conf(5) | https://man7.org/linux/man-pages/man5/journald.conf.5.html | Storage, rate limits, uso espacio |
| S16 | journalctl(1) | https://man7.org/linux/man-pages/man1/journalctl.1.html | Consultas, exportación, verify |
| S17 | Rsyslog omfwd | https://docs.rsyslog.com/doc/configuration/modules/omfwd.html | Cola y forwarding TCP/TLS |
| S18 | auditd(8) | https://man7.org/linux/man-pages/man8/auditd.8.html | Daemon, fuentes, reglas persistentes |
| S19 | auditctl(8) | https://man7.org/linux/man-pages/man8/auditctl.8.html | Estado, auditoría, pérdida, reglas |
| S20 | ausearch(8) | https://man7.org/linux/man-pages/man8/ausearch.8.html | Correlación/consulta de registros audit |
| S21 | RHEL 9: auditing the system | https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/security_hardening/auditing-the-system_security-hardening | Reglas, retención, límites |
| S22 | syslog protocol RFC 5424 | https://www.rfc-editor.org/rfc/rfc5424 | Formato syslog y campos |
| S23 | NIST SP 800-61 Rev.3 (2025) | https://csrc.nist.gov/pubs/sp/800/61/r3/final | Preparación, respuesta, recuperación |
| S24 | NIST SP 800-92 (log management) | https://csrc.nist.gov/pubs/sp/800/92/final | Administración y protección de logs |
| S25 | Linux Kernel: Pressure Stall Information | https://docs.kernel.org/accounting/psi.html | Pressure CPU/memory/IO |
| S26 | strace(1) | https://man7.org/linux/man-pages/man1/strace.1.html | Trazas syscall, carga, seguridad |
| S27 | proc_pressure(5) | https://docs.kernel.org/accounting/psi.html#pressure-interface | Interfaz PSI en /proc |
| S28 | GNU Bash manual | https://www.gnu.org/software/bash/manual/bash.html | quoting, trap, errexit, pipelines |
| S29 | MITRE ATT&CK T1548.001 | https://attack.mitre.org/techniques/T1548/001/ | SUID/SGID y mitigación |
| S30 | MITRE ATT&CK Data Sources (deprecated) | https://attack.mitre.org/datasources/ | Advertencia de v18 2025 |
| S31 | Docker Engine security | https://docs.docker.com/engine/security/ | Socket/daemon y binds |
| S32 | Docker rootless mode | https://docs.docker.com/engine/security/rootless/ | User namespace y daemon no root |
| S33 | Docker seccomp profiles | https://docs.docker.com/engine/security/seccomp/ | Filtro de syscalls |
| S34 | Kubernetes Pod Security Standards | https://kubernetes.io/docs/concepts/security/pod-security-standards/ | Restricted/Baseline, capabilities |
| S35 | Falco official project | https://github.com/falcosecurity/falco | Runtime security y eventos kernel |
| S36 | Docker resource constraints | https://docs.docker.com/engine/containers/resource_constraints/ | CPU/memory y límites contenedor |
| S37 | Linux Kernel: cgroup v2 | https://docs.kernel.org/admin-guide/cgroup-v2.html | Recursos/cgroups |
| S38 | MITRE ATT&CK T1548.003 | https://attack.mitre.org/techniques/T1548/003/ | Sudo y abusos de elevación |
| S39 | systemd-analyze(1) | https://man7.org/linux/man-pages/man1/systemd-analyze.1.html | security/análisis de unidades |
| S40 | Red Hat: policy SELinux y diagnósticos | https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_selinux/troubleshooting-problems-related-to-selinux | AVC e identificación de denegaciones |
| S41 | audit.rules(7) | https://man7.org/linux/man-pages/man7/audit.rules.7.html | Sintaxis/persistencia de audit |
| S42 | Docker inspect | https://docs.docker.com/reference/cli/docker/inspect/ | Inspección de contenedor y seguridad |

# 32. Cierre del programa completo de cinco tandas

**Entregado el marco de aprendizaje:**

1. **T1:** fundamentos Linux, Bash y administración cotidiana.
2. **T2:** arranque, systemd, servicios y paquetes.
3. **T3:** almacenamiento, sistemas de archivos, backups, restauración y recuperación.
4. **T4:** red del host, SSH y firewalls.
5. **T5:** identidad, PAM/MAC, hardening, auditoría, telemetría SOC, respuesta DFIR, rendimiento, automatización, contenedores y Red Team/Purple Team autorizado.

**Límite preciso del cierre:** se ha completado la **investigación documental y el diseño de laboratorios/evaluación**. La competencia práctica y la cobertura de un SIEM concreto solo pueden acreditarse ejecutando y revisando los ejercicios en un entorno controlado. El JSON acompaña este informe para convertir el contenido en rúbricas, detecciones y criterios de aceptación.
