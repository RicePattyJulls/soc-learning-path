# PLAN DE INTEGRACIÓN — Mundo 5: Linux

Estado: **propuesta pre-aprobada** (derivada de las 5 tandas de `INFOCHATGPT/` + `01_FUENTES/`).
Objetivo: replicar el contrato de Windows + AD con **32 etapas × 3 lecciones = 96 lecciones**
y **42 laboratorios** (`LNX-LAB01..42`).

- courseId: `linux`
- prefijo de etapa: `LNX-NN` · lección: `LNX-NN-L0X` · lab: `LNX-LABNN`
- clave de progreso: `soc-learning-path:linux:learning:v1`
- ruta: `#/linux/...`

## Partición en bloques (cómo se autoriza y se construye)

| Bloque | Tema | Etapas | Tandas |
|--------|------|--------|--------|
| A | Fundamentos y administración cotidiana | LNX-01..06 (6) | Tanda 1 |
| B | Arranque, systemd y paquetes | LNX-07..11 (5) | Tanda 2 |
| C | Almacenamiento y recuperación | LNX-12..17 (6) | Tanda 3 |
| D | Red del host, SSH y firewalls | LNX-18..23 (6) | Tanda 4 |
| E | Identidad, MAC y telemetría | LNX-24..29 (6) | Tanda 5 (1..9) |
| F | Contenedores y evaluación integrada | LNX-30..32 (3) | Tanda 5 (10..12) |

## Etapas y lecciones

### Bloque A — Fundamentos y administración cotidiana
| Etapa | Título | L01 | L02 | L03 | Labs |
|-------|--------|-----|-----|-----|------|
| LNX-01 | Anatomía del sistema y límites de confianza | De la aplicación al kernel | Componentes y límites de confianza | Cuatro malentendidos peligrosos | LNX-LAB01 |
| LNX-02 | Árbol de archivos: FHS, rutas y metadatos | Rutas y jerarquía | Enlaces, inodos y marcas temporales | Buscar sin provocar daños | LNX-LAB02 |
| LNX-03 | Herramientas, entrada/salida y composición | Caja de herramientas y tres descriptores | Tuberías y errores de interpretación | Comandos que parecen iguales y no lo son | LNX-LAB03 |
| LNX-04 | Identidades, permisos y mínimo privilegio | Usuarios, grupos y modo clásico | Bits especiales, ACL y capacidades | Uso seguro de privilegios | LNX-LAB02 (bloque B) |
| LNX-05 | Procesos: observar antes de actuar | Modelo de procesos | `/proc`: fuente útil, no registro | Señales y respuesta controlada | LNX-LAB04 |
| LNX-06 | Bash y administración cotidiana | Orden de evaluación, parámetros y entorno | Globbing, separación y ficheros hostiles | Scripts auditables y línea base | LNX-LAB05 |

### Bloque B — Arranque, systemd y paquetes
| Etapa | Título | L01 | L02 | L03 | Labs |
|-------|--------|-----|-----|-----|------|
| LNX-07 | Cadena de arranque y diagnóstico | Cadena principal y variantes | Reconocimiento sin mutaciones | Hipótesis diferenciales | LNX-LAB06 |
| LNX-08 | systemd: unidades, estados y precedencia | systemd no es `systemctl` | Los tres estados que no confundir | Operaciones y efectos diferenciados | LNX-LAB07 |
| LNX-09 | Archivos de unidad, drop-ins y procedencia | Archivos, drop-ins y rutas | Investigar la procedencia | Precedencia y `daemon-reload` | LNX-LAB08 |
| LNX-10 | Tipos de unidad, persistencia y detección | Servicios, sockets y timers | Paths, usuarios y superficies a inventariar | Qué NO inferir de un único indicio | LNX-LAB09, LNX-LAB10 |
| LNX-11 | Paquetes y hardening del host | APT/dpkg y DNF/RPM | Arch/pacman y comparativa | Controles, cambios y ventanas de parcheo | LNX-LAB11, LNX-LAB12 |

### Bloque C — Almacenamiento y recuperación
| Etapa | Título | L01 | L02 | L03 | Labs |
|-------|--------|-----|-----|-----|------|
| LNX-12 | Capas de almacenamiento y triaje | Modelo de capas y seguridad | Comandos iniciales sin mutación | Triaje en cuatro preguntas | LNX-LAB13 |
| LNX-13 | Metadatos y herramientas de copia | Metadatos que `cp`/`tar`/`rsync` pierden | Inodos, enlaces y tiempos como evidencia | Capacidad lógica: bloques, inodos, descriptores | LNX-LAB14, LNX-LAB15 |
| LNX-14 | Sistemas de archivos | ext4: journal y límites de evidencia | XFS y Btrfs: diagnóstico, COW y snapshots | Overlayfs y contenedores | LNX-LAB16 |
| LNX-15 | LVM, RAID y LUKS | LVM: volúmenes y flexibilidad | RAID ≠ backup | LUKS/dm-crypt: confidencialidad ≠ integridad | LNX-LAB16 (bloque B) |
| LNX-16 | Respaldos: política, consistencia y herramientas | RPO/RTO, consistencia y threat model | `tar` y `rsync`: alcance y límites | `restic`: repositorio cifrado y restauración | LNX-LAB17, LNX-LAB18 |
| LNX-17 | Recuperación, evidencia y cadena de custodia | Runbook de recuperación controlada | Manifiesto verificable: hashes y metadatos | Prioridades, anti-patrón `fsck` y custodia | LNX-LAB19, LNX-LAB20 |

### Bloque D — Red del host, SSH y firewalls
| Etapa | Título | L01 | L02 | L03 | Labs |
|-------|--------|-----|-----|-----|------|
| LNX-18 | Capas de red y evidencia básica | Capas y controles relacionados | Evidencia básica con mínima exposición | Inventario de red, rutas y DNS del host | LNX-LAB21 |
| LNX-19 | TCP, UDP, ICMP y dual stack | TCP y estados de conexión | UDP, ICMP y dual stack | Sockets y procesos: LISTEN, ESTAB y límites | LNX-LAB22, LNX-LAB23 |
| LNX-20 | SSH: identidad, claves y configuración | Autenticación del servidor ≠ del usuario | Configuración efectiva y prueba | `authorized_keys` y acceso delimitado | LNX-LAB25 |
| LNX-21 | Túneles SSH y visibilidad | Túnel SSH autorizado | Qué ven los sensores | Captura PCAP corta y custodia mínima | LNX-LAB26, LNX-LAB27 |
| LNX-22 | nftables y contención de egreso | Orden y efectos de las reglas | Reglas de muestra en namespace de laboratorio | Bloquear un destino no es contener el incidente | LNX-LAB24, LNX-LAB29 |
| LNX-23 | Correlación SOC y diagnóstico de red | Herramientas y campos para correlación | DNS vs rutas vs TLS/IPv6 | Casos: SSH, DNS y firewall | LNX-LAB28, LNX-LAB30 |

### Bloque E — Identidad, MAC y telemetría
| Etapa | Título | L01 | L02 | L03 | Labs |
|-------|--------|-----|-----|-----|------|
| LNX-24 | Identidad y privilegios | UID/GID real, efectivo, saved y filesystem | SUID/SGID, sudoers y capabilities | DAC/ACL/umask y rutas de acceso | LNX-LAB31, LNX-LAB33 |
| LNX-25 | PAM y grupos de gestión | Grupos de gestión y orden | Auditoría de PAM sin cambiar políticas | PAM/sudoers como superficie de identidad | LNX-LAB32 |
| LNX-26 | SELinux y AppArmor | SELinux: investigar una denegación | AppArmor: aprender sin desproteger | Diagnóstico MAC sin inventar autoría | LNX-LAB34 |
| LNX-27 | Hardening y remediación | Prioridad de remediación por contexto | Controles recomendados con alcance explícito | Presión de recursos y diagnóstico | LNX-LAB38 |
| LNX-28 | Logging: journald y rsyslog | journald: estructurado, booteos y retención | Rsyslog: pipeline, transporte y evidencia | journal: canary, campos y retención | LNX-LAB35 |
| LNX-29 | Auditoría y triaje | Audit: reglas, semántica y pérdida de eventos | Primera intervención y registro de evidencia | Runbooks y timeline de triaje | LNX-LAB36, LNX-LAB37 |

### Bloque F — Contenedores y evaluación integrada
| Etapa | Título | L01 | L02 | L03 | Labs |
|-------|--------|-----|-----|-----|------|
| LNX-30 | Contenedores y Kubernetes | Riesgos y auditoría defensiva | Kubernetes: políticas y pruebas significativas | Abuso de configuración (sin escape) | LNX-LAB40 |
| LNX-31 | Automatización, hallazgo y SOC/RT | Automatización y Bash idempotente | Metodología de diez pasos y hallazgo | Diferencias de responsabilidad SOC / Red Team | LNX-LAB39, LNX-LAB41 |
| LNX-32 | Evaluación integrada SOC/Red Team | Inspección de seguridad de contenedor propio | Purple Team: detección | Purple Team: retest extremo a extremo | LNX-LAB42 |

## Mapa de laboratorios (42, 1:1 por orden de tanda)

| Lab | Origen | Tema |
|-----|--------|------|
| LNX-LAB01 | T1-LAB-1 | Identidad, límites y ficha base |
| LNX-LAB02 | T1-LAB-2 | Inodos, enlaces y permisos |
| LNX-LAB03 | T1-LAB-3 | Tuberías, stdout/stderr y código de salida |
| LNX-LAB04 | T1-LAB-4 | Snapshot limitado de procesos y `/proc` |
| LNX-LAB05 | T1-LAB-5 | Script de línea base, validación y entrega |
| LNX-LAB06 | T2 L01 | Reconstruir la cadena de arranque |
| LNX-LAB07 | T2 L02 | Estados, precedencia y dependencias |
| LNX-LAB08 | T2 L03 | Servicio y timer inocuos de usuario |
| LNX-LAB09 | T2 L04 | Drop-ins, precedencia y daemon-reload |
| LNX-LAB10 | T2 L05 | Propiedad e integridad local de paquetes |
| LNX-LAB11 | T2 L06 | Triage de persistencia simulada |
| LNX-LAB12 | T2 L07 | Hardening con análisis de compatibilidad |
| LNX-LAB13 | LAB-3.1 | Inventario, topología y contexto de montaje |
| LNX-LAB14 | LAB-3.2 | Inodos, hard links, symlinks y tiempos |
| LNX-LAB15 | LAB-3.3 | Diagnóstico de capacidad y archivo desvinculado |
| LNX-LAB16 | LAB-3.4 | Imagen ext4 autocontenida y validación offline |
| LNX-LAB17 | LAB-3.5 | Tar y rsync: restauración y metadatos |
| LNX-LAB18 | LAB-3.6 | Restic: versiones, check y doble restauración |
| LNX-LAB19 | LAB-3.7 | SOC: triaje de FS en solo lectura y backup fallido |
| LNX-LAB20 | LAB-3.8 | Red Team autorizado: permisos de backups y retest canary |
| LNX-LAB21 | T4-L01 | Inventario de red, rutas y DNS del host |
| LNX-LAB22 | T4-L02 | Sockets y procesos: LISTEN, ESTAB y límites |
| LNX-LAB23 | T4-L03 | Topología aislada veth + dos network namespaces |
| LNX-LAB24 | T4-L04 | nftables stateful en namespace: allow/deny/rollback |
| LNX-LAB25 | T4-L05 | SSH: identidad, claves y configuración efectiva |
| LNX-LAB26 | T4-L06 | Túnel SSH autorizado: comprender qué ven sensores |
| LNX-LAB27 | T4-L07 | Captura PCAP corta y custodia mínima |
| LNX-LAB28 | T4-L08 | Diagnóstico DNS vs rutas vs TLS/IPv6 |
| LNX-LAB29 | T4-L09 | Simulación de egreso sospechoso y contención reversible |
| LNX-LAB30 | T4-L10 | Correlación SOC, pruebas negativas y retest |
| LNX-LAB31 | T5-L01 | DAC/ACL/umask y rutas de acceso |
| LNX-LAB32 | T5-L02 | PAM/sudoers y superficies de identidad |
| LNX-LAB33 | T5-L03 | SUID/SGID y capabilities sin escalada |
| LNX-LAB34 | T5-L04 | MAC SELinux/AppArmor: identificar y diagnosticar |
| LNX-LAB35 | T5-L05 | journal: canary, campos y retención |
| LNX-LAB36 | T5-L06 | Audit: regla efímera y pérdida de eventos |
| LNX-LAB37 | T5-L07 | Triage SOC, timeline y cadena de custodia |
| LNX-LAB38 | T5-L08 | PSI y rendimiento sin DoS |
| LNX-LAB39 | T5-L09 | Bash de evidencia privada, idempotente |
| LNX-LAB40 | T5-L10 | Seguridad de contenedores: inspección |
| LNX-LAB41 | T5-L11 | Red Team: enumeración y hallazgo no destructivo |
| LNX-LAB42 | T5-L12 | Purple Team final: detección y retest |

## Fuentes
Registro unificado en `FUENTES-LINUX.json`: **139 fuentes**, deduplicadas por URL desde las
5 tandas (146 referencias crudas), **todas verificadas HTTP 200** el 2026-10-19.
Cada entrada conserva `tandas` y `rawIds` para trazabilidad.

## Pendiente de decisión del propietario
1. Aprobar (o ajustar) el reparto de 32 etapas / 96 lecciones de arriba.
2. Autorizar el registro del mundo en el shell (Fase 0: `src/App.tsx`,
   `src/components/AcademySelector.tsx`, `package.json` y las 4 guardias históricas),
   con su `docs/linux/CONCILIACION-INTEGRACION.json`.

## Estado de ejecución (2026-10-19)

Aprobado por el propietario y ejecutado por bloques. Reproduce el contrato de Windows + AD sin
compartir contenido, JSON ni progreso con los demás mundos.

- **Mundo**: `courseId: linux` · ruta `#/linux` · clave de progreso
  `soc-learning-path:linux:learning:v1` · lecciones `LNX-NN-L0X`.
- **Autorización**: `docs/linux/CONCILIACION-INTEGRACION.json` (con `manifestSHA` fijado en
  `scripts/linux-reconciliation.mjs`), reconocida por las 4 guardias históricas.

### Bloque A — Fundamentos y administración cotidiana (LNX-01..06)
18 lecciones, 36 preguntas, 5 laboratorios.

### Bloque B — Arranque, systemd y paquetes (LNX-07..11)
15 lecciones, 30 preguntas, 7 laboratorios (`LNX-LAB06..12`).

### Bloque C — Almacenamiento y recuperación (LNX-12..17)
18 lecciones, 36 preguntas, 8 laboratorios (`LNX-LAB13..20`).

### Bloque D — Red del host, SSH y firewalls (LNX-18..23)
18 lecciones, 36 preguntas, 10 laboratorios (`LNX-LAB21..30`).

### Bloque E — Identidad, MAC y telemetría (LNX-24..29)
18 lecciones, 36 preguntas, 8 laboratorios (`LNX-LAB31..38`).

### Bloque F — Contenedores y evaluación integrada (LNX-30..32)
9 lecciones, 18 preguntas, 4 laboratorios (`LNX-LAB39..42`).

### Acumulado final (Bloques A–F — mundo completo)
- **Generación**: `npm run prepare:linux` → **96 lecciones, 32 etapas, 192 preguntas, 43 recursos**,
  `solutionsSeparated: true`, **96/96 reconstrucciones verificadas**, 0 redacciones.
- **Puerta local**: `npx tsc -b` limpio · 7 guardias OK · `npm test` **118/118**.
- **Navegador (127.0.0.1:5173)**: 51/51 comprobaciones, 96/96 lecciones aprobadas 2/2,
  32/32 etapas al 100 %, glosario (479 términos) y laboratorios `LNX-LAB01..42` presentes,
  vistas fuente/referencias en las 96 lecciones, **0 errores de consola**.
- **Integridad web**: 235/235 payloads servidos == referenciados (sin huérfanos), hashes SHA-256
  verificados en cliente (`docs/linux/VALIDACION-WEB-CONTENIDO.json`).
- **Calidad de evaluación**: 0 lecciones con el patrón predecible `Q2 = Q1 + 2`; letras correctas
  equilibradas (A 48 · B 47 · C 49 · D 48) y sin desajustes lección↔solución.

Estado: **mundo Linux completo** según el reparto aprobado (32 etapas × 3 = 96 lecciones, 42
laboratorios). Pendiente **solo** la revisión editorial independiente del propietario.
