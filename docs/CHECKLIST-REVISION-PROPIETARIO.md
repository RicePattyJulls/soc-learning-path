# Checklist · revisión del propietario (Linux y Windows + AD)

Preparada el 19/10/2026. Sirve para revisar con método las lecciones de los dos mundos y luego
cerrar la revisión con `scripts/owner-review.mjs`. Es tu hoja de trabajo: márcala a mano (`[ ]` → `[x]`).
Ningún generador ni guardia la lee.

## 1. Levantar el proyecto

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev          # regenera el contenido y sirve en http://127.0.0.1:5173/
```

Abre siempre `http://127.0.0.1:5173/` (no `localhost` ni otro puerto): así ves tu progreso de siempre.
Si solo quieres servir sin regenerar: `npm run dev:pilot -- --port 5173 --strictPort`.

## 2. Qué mirar en cada lección

Los cinco criterios del alcance declarado (`educationalReview.scope`):

1. **Claridad**: el texto se entiende a la primera y sin ambigüedades técnicas.
2. **Secuencia de conceptos**: no usa nada que no se haya explicado antes (revisa los prerrequisitos).
3. **Objetivo ↔ actividad**: las 2 preguntas y la práctica miden lo que promete el objetivo.
4. **Razonamiento de las respuestas**: la opción correcta es la correcta y la explicación lo justifica.
5. **Rúbrica documental**: la respuesta de referencia y la rúbrica de la práctica son coherentes y evaluables.

Además: los comandos y rutas son verosímiles (no se ejecutan: `practicalStatus: not_assessed`) y el
contenido sigue siendo sintético (IPs de documentación, sin datos reales).

Si corriges una lección, anota su id (p. ej. `LNX-01-L02`) en **Correcciones** de su etapa.

## 3. Cerrar la revisión (cuando hayas terminado un mundo)

```sh
node scripts/owner-review.mjs linux                          # diagnóstico: alcance y huella actuales
node scripts/owner-review.mjs linux --close --date AAAA-MM-DD  # sin correcciones
node scripts/owner-review.mjs linux --close --date AAAA-MM-DD --changes LNX-01-L02,LNX-07-L01  # con correcciones, tras editarlas
npm run prepare:linux && npm test
```

Igual con `windows-ad`. Si después cambias una lección, la revisión caduca y hay que cerrarla de nuevo.

## 4. Linux · 32 etapas · 96 lecciones

Huella de las lecciones al preparar esta lista: `bbd83c59938b871b99c1a89f0b472d17d6ba8c1abbba803551ef4dadb6274e12`. Si `owner-review.mjs linux` da otra,
el contenido cambió desde entonces.

### LNX-01 · Anatomía del sistema y límites de confianza

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-01](http://127.0.0.1:5173/#/linux/etapa/LNX-01)

- [ ] **LNX-01-L01** · De la aplicación al kernel — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-01-L01?fase=mision&paso=0)
- [ ] **LNX-01-L02** · Componentes y límites de confianza — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-01-L02?fase=mision&paso=0)
- [ ] **LNX-01-L03** · Cuatro malentendidos peligrosos — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-01-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-02 · Árbol de archivos: FHS, rutas y metadatos

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-02](http://127.0.0.1:5173/#/linux/etapa/LNX-02)

- [ ] **LNX-02-L01** · Rutas y jerarquía — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-02-L01?fase=mision&paso=0)
- [ ] **LNX-02-L02** · Enlaces, inodos y marcas temporales — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-02-L02?fase=mision&paso=0)
- [ ] **LNX-02-L03** · Buscar sin provocar daños — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-02-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-03 · Herramientas, entrada/salida y composición

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-03](http://127.0.0.1:5173/#/linux/etapa/LNX-03)

- [ ] **LNX-03-L01** · Caja de herramientas y tres descriptores — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-03-L01?fase=mision&paso=0)
- [ ] **LNX-03-L02** · Tuberías y errores de interpretación — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-03-L02?fase=mision&paso=0)
- [ ] **LNX-03-L03** · Comandos que parecen iguales y no lo son — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-03-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-04 · Identidades, permisos y mínimo privilegio

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-04](http://127.0.0.1:5173/#/linux/etapa/LNX-04)

- [ ] **LNX-04-L01** · Usuarios, grupos y modo clásico — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-04-L01?fase=mision&paso=0)
- [ ] **LNX-04-L02** · Bits especiales, ACL y capacidades — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-04-L02?fase=mision&paso=0)
- [ ] **LNX-04-L03** · Uso seguro de privilegios — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-04-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-05 · Procesos: observar antes de actuar

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-05](http://127.0.0.1:5173/#/linux/etapa/LNX-05)

- [ ] **LNX-05-L01** · Modelo de procesos — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-05-L01?fase=mision&paso=0)
- [ ] **LNX-05-L02** · `/proc`: fuente útil, no registro histórico — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-05-L02?fase=mision&paso=0)
- [ ] **LNX-05-L03** · Señales y respuesta controlada — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-05-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-06 · Bash y administración cotidiana

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-06](http://127.0.0.1:5173/#/linux/etapa/LNX-06)

- [ ] **LNX-06-L01** · Orden de evaluación, parámetros y entorno — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-06-L01?fase=mision&paso=0)
- [ ] **LNX-06-L02** · Globbing, separación y ficheros hostiles — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-06-L02?fase=mision&paso=0)
- [ ] **LNX-06-L03** · Scripts auditables y línea base — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-06-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-07 · Cadena de arranque y diagnóstico

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-07](http://127.0.0.1:5173/#/linux/etapa/LNX-07)

- [ ] **LNX-07-L01** · Cadena principal y variantes — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-07-L01?fase=mision&paso=0)
- [ ] **LNX-07-L02** · Reconocimiento sin mutaciones — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-07-L02?fase=mision&paso=0)
- [ ] **LNX-07-L03** · Hipótesis diferenciales — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-07-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-08 · systemd: unidades, estados y precedencia

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-08](http://127.0.0.1:5173/#/linux/etapa/LNX-08)

- [ ] **LNX-08-L01** · systemd no es `systemctl` — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-08-L01?fase=mision&paso=0)
- [ ] **LNX-08-L02** · Los tres estados que no confundir — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-08-L02?fase=mision&paso=0)
- [ ] **LNX-08-L03** · Operaciones y efectos diferenciados — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-08-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-09 · Archivos de unidad, drop-ins y procedencia

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-09](http://127.0.0.1:5173/#/linux/etapa/LNX-09)

- [ ] **LNX-09-L01** · Archivos, drop-ins y rutas — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-09-L01?fase=mision&paso=0)
- [ ] **LNX-09-L02** · Investigar la procedencia — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-09-L02?fase=mision&paso=0)
- [ ] **LNX-09-L03** · Precedencia y `daemon-reload` — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-09-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-10 · Tipos de unidad, persistencia y detección

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-10](http://127.0.0.1:5173/#/linux/etapa/LNX-10)

- [ ] **LNX-10-L01** · Servicios, sockets y timers — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-10-L01?fase=mision&paso=0)
- [ ] **LNX-10-L02** · Paths, usuarios y superficies a inventariar — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-10-L02?fase=mision&paso=0)
- [ ] **LNX-10-L03** · Qué NO inferir de un único indicio — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-10-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-11 · Paquetes y hardening del host

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-11](http://127.0.0.1:5173/#/linux/etapa/LNX-11)

- [ ] **LNX-11-L01** · APT/dpkg y DNF/RPM — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-11-L01?fase=mision&paso=0)
- [ ] **LNX-11-L02** · Arch/pacman y comparativa — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-11-L02?fase=mision&paso=0)
- [ ] **LNX-11-L03** · Controles, cambios y ventanas de parcheo — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-11-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-12 · Capas de almacenamiento y triaje

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-12](http://127.0.0.1:5173/#/linux/etapa/LNX-12)

- [ ] **LNX-12-L01** · Modelo de capas y seguridad — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-12-L01?fase=mision&paso=0)
- [ ] **LNX-12-L02** · Comandos iniciales sin mutación — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-12-L02?fase=mision&paso=0)
- [ ] **LNX-12-L03** · Triaje en cuatro preguntas — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-12-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-13 · Metadatos y herramientas de copia

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-13](http://127.0.0.1:5173/#/linux/etapa/LNX-13)

- [ ] **LNX-13-L01** · Metadatos que `cp`/`tar`/`rsync` pierden — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-13-L01?fase=mision&paso=0)
- [ ] **LNX-13-L02** · Inodos, enlaces y tiempos como evidencia — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-13-L02?fase=mision&paso=0)
- [ ] **LNX-13-L03** · Capacidad lógica: bloques, inodos, descriptores — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-13-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-14 · Sistemas de archivos

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-14](http://127.0.0.1:5173/#/linux/etapa/LNX-14)

- [ ] **LNX-14-L01** · ext4: journal y límites de evidencia — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-14-L01?fase=mision&paso=0)
- [ ] **LNX-14-L02** · XFS y Btrfs: diagnóstico, COW y snapshots — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-14-L02?fase=mision&paso=0)
- [ ] **LNX-14-L03** · Overlayfs y contenedores — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-14-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-15 · LVM, RAID y LUKS

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-15](http://127.0.0.1:5173/#/linux/etapa/LNX-15)

- [ ] **LNX-15-L01** · LVM: volúmenes y flexibilidad — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-15-L01?fase=mision&paso=0)
- [ ] **LNX-15-L02** · RAID ≠ backup — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-15-L02?fase=mision&paso=0)
- [ ] **LNX-15-L03** · LUKS/dm-crypt: confidencialidad ≠ integridad — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-15-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-16 · Respaldos: política, consistencia y herramientas

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-16](http://127.0.0.1:5173/#/linux/etapa/LNX-16)

- [ ] **LNX-16-L01** · RPO/RTO, consistencia y threat model — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-16-L01?fase=mision&paso=0)
- [ ] **LNX-16-L02** · `tar` y `rsync`: alcance y límites — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-16-L02?fase=mision&paso=0)
- [ ] **LNX-16-L03** · `restic`: repositorio cifrado y restauración — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-16-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-17 · Recuperación, evidencia y cadena de custodia

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-17](http://127.0.0.1:5173/#/linux/etapa/LNX-17)

- [ ] **LNX-17-L01** · Runbook de recuperación controlada — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-17-L01?fase=mision&paso=0)
- [ ] **LNX-17-L02** · Manifiesto verificable: hashes y metadatos — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-17-L02?fase=mision&paso=0)
- [ ] **LNX-17-L03** · Prioridades, anti-patrón `fsck` y custodia — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-17-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-18 · Capas de red y evidencia básica

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-18](http://127.0.0.1:5173/#/linux/etapa/LNX-18)

- [ ] **LNX-18-L01** · Capas y controles relacionados — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-18-L01?fase=mision&paso=0)
- [ ] **LNX-18-L02** · Evidencia básica con mínima exposición — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-18-L02?fase=mision&paso=0)
- [ ] **LNX-18-L03** · Inventario de red, rutas y DNS del host — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-18-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-19 · TCP, UDP, ICMP y dual stack

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-19](http://127.0.0.1:5173/#/linux/etapa/LNX-19)

- [ ] **LNX-19-L01** · TCP y estados de conexión — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-19-L01?fase=mision&paso=0)
- [ ] **LNX-19-L02** · UDP, ICMP y dual stack — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-19-L02?fase=mision&paso=0)
- [ ] **LNX-19-L03** · Sockets y procesos: LISTEN, ESTAB y límites — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-19-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-20 · SSH: identidad, claves y configuración

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-20](http://127.0.0.1:5173/#/linux/etapa/LNX-20)

- [ ] **LNX-20-L01** · Autenticación del servidor ≠ del usuario — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-20-L01?fase=mision&paso=0)
- [ ] **LNX-20-L02** · Configuración efectiva y prueba — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-20-L02?fase=mision&paso=0)
- [ ] **LNX-20-L03** · `authorized_keys` y acceso delimitado — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-20-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-21 · Túneles SSH y visibilidad

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-21](http://127.0.0.1:5173/#/linux/etapa/LNX-21)

- [ ] **LNX-21-L01** · Túnel SSH autorizado — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-21-L01?fase=mision&paso=0)
- [ ] **LNX-21-L02** · Qué ven los sensores — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-21-L02?fase=mision&paso=0)
- [ ] **LNX-21-L03** · Captura PCAP corta y custodia mínima — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-21-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-22 · nftables y contención de egreso

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-22](http://127.0.0.1:5173/#/linux/etapa/LNX-22)

- [ ] **LNX-22-L01** · Orden y efectos de las reglas — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-22-L01?fase=mision&paso=0)
- [ ] **LNX-22-L02** · Reglas de muestra en namespace de laboratorio — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-22-L02?fase=mision&paso=0)
- [ ] **LNX-22-L03** · Bloquear un destino no es contener el incidente — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-22-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-23 · Correlación SOC y diagnóstico de red

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-23](http://127.0.0.1:5173/#/linux/etapa/LNX-23)

- [ ] **LNX-23-L01** · Herramientas y campos para correlación — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-23-L01?fase=mision&paso=0)
- [ ] **LNX-23-L02** · DNS vs rutas vs TLS/IPv6 — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-23-L02?fase=mision&paso=0)
- [ ] **LNX-23-L03** · Casos: SSH, DNS y firewall — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-23-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-24 · Identidad y privilegios

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-24](http://127.0.0.1:5173/#/linux/etapa/LNX-24)

- [ ] **LNX-24-L01** · UID/GID real, efectivo, saved y filesystem — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-24-L01?fase=mision&paso=0)
- [ ] **LNX-24-L02** · SUID/SGID, sudoers y capabilities — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-24-L02?fase=mision&paso=0)
- [ ] **LNX-24-L03** · DAC/ACL/umask y rutas de acceso — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-24-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-25 · PAM y grupos de gestión

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-25](http://127.0.0.1:5173/#/linux/etapa/LNX-25)

- [ ] **LNX-25-L01** · Grupos de gestión y orden — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-25-L01?fase=mision&paso=0)
- [ ] **LNX-25-L02** · Auditoría de PAM sin cambiar políticas — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-25-L02?fase=mision&paso=0)
- [ ] **LNX-25-L03** · PAM/sudoers como superficie de identidad — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-25-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-26 · SELinux y AppArmor

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-26](http://127.0.0.1:5173/#/linux/etapa/LNX-26)

- [ ] **LNX-26-L01** · SELinux: investigar una denegación — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-26-L01?fase=mision&paso=0)
- [ ] **LNX-26-L02** · AppArmor: aprender sin desproteger — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-26-L02?fase=mision&paso=0)
- [ ] **LNX-26-L03** · Diagnóstico MAC sin inventar autoría — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-26-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-27 · Hardening y remediación

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-27](http://127.0.0.1:5173/#/linux/etapa/LNX-27)

- [ ] **LNX-27-L01** · Prioridad de remediación por contexto — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-27-L01?fase=mision&paso=0)
- [ ] **LNX-27-L02** · Controles recomendados con alcance explícito — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-27-L02?fase=mision&paso=0)
- [ ] **LNX-27-L03** · Presión de recursos y diagnóstico — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-27-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-28 · Logging: journald y rsyslog

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-28](http://127.0.0.1:5173/#/linux/etapa/LNX-28)

- [ ] **LNX-28-L01** · journald: estructurado, booteos y retención — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-28-L01?fase=mision&paso=0)
- [ ] **LNX-28-L02** · Rsyslog: pipeline, transporte y evidencia — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-28-L02?fase=mision&paso=0)
- [ ] **LNX-28-L03** · journal: canary, campos y retención — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-28-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-29 · Auditoría y triaje

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-29](http://127.0.0.1:5173/#/linux/etapa/LNX-29)

- [ ] **LNX-29-L01** · Audit: reglas, semántica y pérdida de eventos — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-29-L01?fase=mision&paso=0)
- [ ] **LNX-29-L02** · Primera intervención y registro de evidencia — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-29-L02?fase=mision&paso=0)
- [ ] **LNX-29-L03** · Runbooks y timeline de triaje — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-29-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-30 · Contenedores y Kubernetes

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-30](http://127.0.0.1:5173/#/linux/etapa/LNX-30)

- [ ] **LNX-30-L01** · Riesgos y auditoría defensiva — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-30-L01?fase=mision&paso=0)
- [ ] **LNX-30-L02** · Kubernetes: políticas y pruebas significativas — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-30-L02?fase=mision&paso=0)
- [ ] **LNX-30-L03** · Abuso de configuración (sin escape) — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-30-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-31 · Automatización, hallazgo y SOC/RT

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-31](http://127.0.0.1:5173/#/linux/etapa/LNX-31)

- [ ] **LNX-31-L01** · Automatización y Bash idempotente — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-31-L01?fase=mision&paso=0)
- [ ] **LNX-31-L02** · Metodología de diez pasos y hallazgo — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-31-L02?fase=mision&paso=0)
- [ ] **LNX-31-L03** · Diferencias de responsabilidad SOC / Red Team — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-31-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### LNX-32 · Evaluación integrada SOC/Red Team

Etapa: [http://127.0.0.1:5173/#/linux/etapa/LNX-32](http://127.0.0.1:5173/#/linux/etapa/LNX-32)

- [ ] **LNX-32-L01** · Inspección de seguridad de contenedor propio — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-32-L01?fase=mision&paso=0)
- [ ] **LNX-32-L02** · Purple Team: detección — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-32-L02?fase=mision&paso=0)
- [ ] **LNX-32-L03** · Purple Team: retest extremo a extremo — [abrir](http://127.0.0.1:5173/#/linux/leccion/LNX-32-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### Cierre de Linux

- [ ] Todas las etapas de Linux marcadas
- [ ] `node scripts/owner-review.mjs linux --close --date …` ejecutado
- [ ] `npm run prepare:linux && npm test` en verde

## 5. Windows + AD · 28 etapas · 84 lecciones

Huella de las lecciones al preparar esta lista: `a7bfff030a6da77f48639cd916e6ac94ab40d9d046d4718af172377dc70a8370`. Si `owner-review.mjs windows-ad` da otra,
el contenido cambió desde entonces.

### WAD-01 · Plataformas, ediciones y arranque

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-01](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-01)

- [ ] **WAD-01-L01** · Ediciones y ciclo de vida — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-01-L01?fase=mision&paso=0)
- [ ] **WAD-01-L02** · UEFI, BCD, arranque y servicios base — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-01-L02?fase=mision&paso=0)
- [ ] **WAD-01-L03** · Inventario reproducible — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-01-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-02 · Arquitectura, procesos, servicios y registro

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-02](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-02)

- [ ] **WAD-02-L01** · User mode/kernel mode y procesos — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-02-L01?fase=mision&paso=0)
- [ ] **WAD-02-L02** · Servicios, tareas y dependencias — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-02-L02?fase=mision&paso=0)
- [ ] **WAD-02-L03** · Registro, WMI y cambios reversibles — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-02-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-03 · Identidad local, tokens y seguridad

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-03](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-03)

- [ ] **WAD-03-L01** · SAM y LSA: identidades locales — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-03-L01?fase=mision&paso=0)
- [ ] **WAD-03-L02** · SID, token, privilegios y UAC — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-03-L02?fase=mision&paso=0)
- [ ] **WAD-03-L03** · ACE/DACL/SACL e integridad — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-03-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-04 · Archivos, NTFS, SMB y propietarios

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-04](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-04)

- [ ] **WAD-04-L01** · NTFS, herencia y propietario — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-04-L01?fase=mision&paso=0)
- [ ] **WAD-04-L02** · Permiso efectivo con share SMB — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-04-L02?fase=mision&paso=0)
- [ ] **WAD-04-L03** · Auditoría de acceso y restauración — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-04-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-05 · PowerShell para operación segura

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-05](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-05)

- [ ] **WAD-05-L01** · Objetos, pipeline y help — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-05-L01?fase=mision&paso=0)
- [ ] **WAD-05-L02** · CIM y administración remota autorizada — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-05-L02?fase=mision&paso=0)
- [ ] **WAD-05-L03** · Idempotencia, logging y recuperación — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-05-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-06 · Red de host y acceso remoto

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-06](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-06)

- [ ] **WAD-06-L01** · DNS cliente y conectividad — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-06-L01?fase=mision&paso=0)
- [ ] **WAD-06-L02** · Firewall, SMB, RDP y WinRM — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-06-L02?fase=mision&paso=0)
- [ ] **WAD-06-L03** · Diagnóstico por hipótesis — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-06-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-07 · Hardening, auditoría y fallo de host

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-07](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-07)

- [ ] **WAD-07-L01** · Auditoría local y eventos — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-07-L01?fase=mision&paso=0)
- [ ] **WAD-07-L02** · Controles Defender/PowerShell — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-07-L02?fase=mision&paso=0)
- [ ] **WAD-07-L03** · Investigación breve y respuesta segura — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-07-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-08 · Directorio, objetos y límites de confianza

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-08](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-08)

- [ ] **WAD-08-L01** · Bosque, dominio, OU y particiones — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-08-L01?fase=mision&paso=0)
- [ ] **WAD-08-L02** · Esquema, LDAP y GC — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-08-L02?fase=mision&paso=0)
- [ ] **WAD-08-L03** · Rol de AD DS frente a Entra ID — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-08-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-09 · DC, DNS, hora y equipos unidos

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-09](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-09)

- [ ] **WAD-09-L01** · Instalación y promoción aislada — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-09-L01?fase=mision&paso=0)
- [ ] **WAD-09-L02** · DNS SRV, DC Locator y tiempo — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-09-L02?fase=mision&paso=0)
- [ ] **WAD-09-L03** · Comprobaciones cliente/DC — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-09-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-10 · LDAP, ciclo de identidad y ACL

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-10](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-10)

- [ ] **WAD-10-L01** · LDAP y atributos consultables — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-10-L01?fase=mision&paso=0)
- [ ] **WAD-10-L02** · Usuarios, grupos, ciclo de vida — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-10-L02?fase=mision&paso=0)
- [ ] **WAD-10-L03** · Delegación mínima y acceso efectivo — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-10-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-11 · Kerberos, NTLM, SPN y cuentas servicio

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-11](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-11)

- [ ] **WAD-11-L01** · TGT/TGS y SPN — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-11-L01?fase=mision&paso=0)
- [ ] **WAD-11-L02** · NTLM y fallbacks medidos — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-11-L02?fase=mision&paso=0)
- [ ] **WAD-11-L03** · Servicios y gMSA — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-11-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-12 · GPO, SYSVOL y precedencia

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-12](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-12)

- [ ] **WAD-12-L01** · GPO scope, orden y herencia — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-12-L01?fase=mision&paso=0)
- [ ] **WAD-12-L02** · Filtros y RSOP/gpresult — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-12-L02?fase=mision&paso=0)
- [ ] **WAD-12-L03** · SYSVOL, políticas y cambio inocuo — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-12-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-13 · Replicación, FSMO y GC

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-13](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-13)

- [ ] **WAD-13-L01** · Topología y vectores de replicación — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-13-L01?fase=mision&paso=0)
- [ ] **WAD-13-L02** · FSMO y GC — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-13-L02?fase=mision&paso=0)
- [ ] **WAD-13-L03** · dcdiag/repadmin y fallos seguros — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-13-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-14 · Trusts y segmentación entre dominios

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-14](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-14)

- [ ] **WAD-14-L01** · Dirección/transitividad de trust — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-14-L01?fase=mision&paso=0)
- [ ] **WAD-14-L02** · Autenticación selectiva y SID filtering — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-14-L02?fase=mision&paso=0)
- [ ] **WAD-14-L03** · Mapa de rutas de control — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-14-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-15 · Tier 0, LAPS y cuentas privilegiadas

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-15](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-15)

- [ ] **WAD-15-L01** · Tier 0 y separación de identidades — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-15-L01?fase=mision&paso=0)
- [ ] **WAD-15-L02** · Control delegación y rutas administrativas — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-15-L02?fase=mision&paso=0)
- [ ] **WAD-15-L03** · Windows LAPS/DSRM y custodia — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-15-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-16 · AD CS, PKI y control de certificados

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-16](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-16)

- [ ] **WAD-16-L01** · CA, EKU y ciclo de certificados — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-16-L01?fase=mision&paso=0)
- [ ] **WAD-16-L02** · Plantillas, inscripción y controles — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-16-L02?fase=mision&paso=0)
- [ ] **WAD-16-L03** · CRL/AIA y continuidad PKI — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-16-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-17 · Troubleshooting integral AD

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-17](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-17)

- [ ] **WAD-17-L01** · Hipótesis DNS, autenticación y tiempo — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-17-L01?fase=mision&paso=0)
- [ ] **WAD-17-L02** · Replicación/GPO y causa raíz — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-17-L02?fase=mision&paso=0)
- [ ] **WAD-17-L03** · Impacto operacional y evidencias — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-17-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-18 · Continuidad: amenazas, RPO/RTO y backups

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-18](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-18)

- [ ] **WAD-18-L01** · BIA y dependencias de identidad — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-18-L01?fase=mision&paso=0)
- [ ] **WAD-18-L02** · RPO/RTO, frecuencia y copia confiable — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-18-L02?fase=mision&paso=0)
- [ ] **WAD-18-L03** · System State, full/BMR y test — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-18-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-19 · Recuperación de objeto y DC

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-19](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-19)

- [ ] **WAD-19-L01** · AD Recycle Bin y borrados — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-19-L01?fase=mision&paso=0)
- [ ] **WAD-19-L02** · DSRM y restauración no autoritativa — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-19-L02?fase=mision&paso=0)
- [ ] **WAD-19-L03** · Criterios de restauración y replicación — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-19-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-20 · Bosque, SYSVOL, PKI y reintegración

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-20](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-20)

- [ ] **WAD-20-L01** · Recuperación forestal en aislamiento — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-20-L01?fase=mision&paso=0)
- [ ] **WAD-20-L02** · SYSVOL/DFSR y cuentas críticas — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-20-L02?fase=mision&paso=0)
- [ ] **WAD-20-L03** · CA, DNS, trusts y pruebas de servicio — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-20-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-21 · ROE y descubrimiento Red Team

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-21](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-21)

- [ ] **WAD-21-L01** · Autorización, alcance y parada — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-21-L01?fase=mision&paso=0)
- [ ] **WAD-21-L02** · Inventario AD seguro — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-21-L02?fase=mision&paso=0)
- [ ] **WAD-21-L03** · Calidad de evidencia y minimización — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-21-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-22 · Rutas de control y misconfiguraciones

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-22](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-22)

- [ ] **WAD-22-L01** · ACL/delegación y rutas posibles — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-22-L01?fase=mision&paso=0)
- [ ] **WAD-22-L02** · SPN/NTLM/trust con lectura prudente — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-22-L02?fase=mision&paso=0)
- [ ] **WAD-22-L03** · AD CS y evidencias de configuración — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-22-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-23 · Validación mínima, remediación y retest

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-23](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-23)

- [ ] **WAD-23-L01** · Controles de movimiento remoto autorizado — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-23-L01?fase=mision&paso=0)
- [ ] **WAD-23-L02** · Prueba inocua y ventanas controladas — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-23-L02?fase=mision&paso=0)
- [ ] **WAD-23-L03** · Informe, remediación, retest — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-23-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-24 · Fuentes SOC y política de auditoría

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-24](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-24)

- [ ] **WAD-24-L01** · Security, System, Directory Service — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-24-L01?fase=mision&paso=0)
- [ ] **WAD-24-L02** · Subcategorías de auditoría y SACL — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-24-L02?fase=mision&paso=0)
- [ ] **WAD-24-L03** · Cobertura efectiva y pérdida — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-24-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-25 · Autenticación, procesos y PowerShell en SOC

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-25](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-25)

- [ ] **WAD-25-L01** · Evento de identidad y contexto — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-25-L01?fase=mision&paso=0)
- [ ] **WAD-25-L02** · Procesos/servicios y líneas de tiempo — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-25-L02?fase=mision&paso=0)
- [ ] **WAD-25-L03** · PowerShell Logging y límites — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-25-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-26 · Sysmon, WEF y preservación

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-26](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-26)

- [ ] **WAD-26-L01** · Capacidades y filtros de Sysmon — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-26-L01?fase=mision&paso=0)
- [ ] **WAD-26-L02** · WEF/WEC, canal y transporte — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-26-L02?fase=mision&paso=0)
- [ ] **WAD-26-L03** · UTC, retención, cadena de custodia — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-26-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-27 · SOC contextual y Purple Team

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-27](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-27)

- [ ] **WAD-27-L01** · Hipótesis y falsos positivos — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-27-L01?fase=mision&paso=0)
- [ ] **WAD-27-L02** · Acción controlada→evento→respuesta — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-27-L02?fase=mision&paso=0)
- [ ] **WAD-27-L03** · Medición de cobertura y reducción de ruido — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-27-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### WAD-28 · Proyecto final: operar, auditar y recuperar

Etapa: [http://127.0.0.1:5173/#/windows-ad/etapa/WAD-28](http://127.0.0.1:5173/#/windows-ad/etapa/WAD-28)

- [ ] **WAD-28-L01** · Cambios de identidad aprobados — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-28-L01?fase=mision&paso=0)
- [ ] **WAD-28-L02** · Hallazgo autorizado y respuesta local — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-28-L02?fase=mision&paso=0)
- [ ] **WAD-28-L03** · Backup, recuperación, retest y defensa oral — [abrir](http://127.0.0.1:5173/#/windows-ad/leccion/WAD-28-L03?fase=mision&paso=0)
- [ ] Criterios 1–5 revisados en las lecciones de la etapa

Correcciones: _ninguna_

### Cierre de Windows + AD

- [ ] Todas las etapas de Windows + AD marcadas
- [ ] `node scripts/owner-review.mjs windows-ad --close --date …` ejecutado
- [ ] `npm run prepare:windows-ad && npm test` en verde
