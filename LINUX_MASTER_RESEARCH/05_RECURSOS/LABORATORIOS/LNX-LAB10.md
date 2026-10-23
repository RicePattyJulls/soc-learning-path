# LNX-LAB10 — Propiedad e integridad local de paquetes

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Resolver la cadena **archivo → paquete → versión → origen → verificación local** sin instalar, eliminar ni actualizar nada, distinguiendo la firma del repositorio de la verificación del estado actual (base documental: F29–F35).

## Competencia

Auditoría en **solo lectura** de paquetes: identificar qué paquete posee una ruta, qué versión está instalada, de qué fuente proviene y qué límites tiene la verificación local.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-10`. Requiere VM Debian/Parrot o Fedora/RHEL o Arch, un paquete `bash` instalado y las herramientas del gestor ya disponibles. No se requieren privilegios.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-10`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.10.100`). No se usan IPs reales.
- Paquete de ejemplo `bash` y ruta de ejemplo `/usr/bin/bash`; versiones inventadas del tipo `5.x-labs1`. Nada se instala ni se descarga.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB10"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB10"`
2. Registra fecha y hora en **UTC** y la **familia del gestor**: `date -u -Is` y `cat /etc/os-release`, seguido de `command -v dpkg-query || command -v rpm || command -v pacman`

### Tarea (solo lectura)

3. Consulta el **paquete y su versión** según la familia:
   - Debian/Parrot: `dpkg-query -W -f='${Package}\t${Version}\t${Status}\n' bash`
   - Fedora/RHEL: `rpm -q bash`
   - Arch: `pacman -Q bash`
4. Consulta el **propietario** de la ruta:
   - Debian/Parrot: `dpkg-query -S /usr/bin/bash`
   - Fedora/RHEL: `rpm -qf /usr/bin/bash`
   - Arch: `pacman -Qo /usr/bin/bash`
5. **Verifica** contra los metadatos locales:
   - Debian/Parrot: `dpkg -V bash`
   - Fedora/RHEL: `rpm -V bash`
   - Arch: `pacman -Qkk bash`
6. Revisa **origen y cambios**:
   - Debian/Parrot: `apt-cache policy bash` y `ls -l /var/log/apt/history.log* /var/log/dpkg.log* 2>/dev/null`
   - Fedora/RHEL: `dnf history` y `ls -l /etc/yum.repos.d/`
   - Arch: `pacman -Qi bash` y `ls -l /var/log/pacman.log`
7. Consolida las salidas en `"$HOME/linux-lab/LAB10/"` (`policy.txt`, `owner.txt`, `version.txt`, `verify.txt`).

> Todos los comandos son de consulta. **No** instales, actualices, elimines ni reinstales paquetes, no desactives comprobaciones de firma y no modifiques repositorios.

### Verificación y limpieza

8. Interpreta la salida de verificación: explica qué significa una **salida vacía** y por qué **no** prueba por sí sola la ausencia de compromiso.
9. Distingue lo que comprueba la **firma del repositorio** (procedencia de la descarga) de lo que compara la **verificación local** (estado actual de los archivos instalados).
10. Confirma que no se modificó ningún paquete ni repositorio y documenta qué rutas **no** cubre este paquete.

## Evidencia a entregar

- Una **tabla** rutas / propietario / versión / repositorio.
- La salida de **verificación** y sus límites, incluida la interpretación de la salida vacía.
- La diferenciación entre **firma de repositorio** y **verificación de estado actual**.
- **Dos recomendaciones** de operación de parches (por ejemplo, ventanas controladas y reinicio planificado).

## Criterios de aceptación

- Consulta (6): la tabla es coherente y usa la herramienta correcta de la familia detectada.
- Límites (6): no se afirma origen criptográfico por un mero `dpkg -S`/`rpm -qf`/`pacman -Qo`; se explican los límites de los metadatos locales.
- Interpretación (5): se distingue firma de repositorio de verificación de estado y el significado de la salida vacía.
- Recomendaciones (3): las dos propuestas de parche son concretas y no destructivas.
- **Fallo crítico:** instalar, actualizar o eliminar paquetes, desactivar comprobaciones de firma o concluir «sin compromiso» a partir de una salida vacía.

## Autorización y límites

Actividad de **solo lectura**. **Prohibido** instalar, eliminar o actualizar paquetes, desactivar la verificación de firmas y alterar repositorios. Solo se crean archivos de evidencia del laboratorio. No publiques datos del host de laboratorio.

## Limpieza

Solo se crean archivos de evidencia del laboratorio; **no hay mutación de paquetes** que revertir. Conserva las salidas en `"$HOME/linux-lab/LAB10"` y elimina únicamente copias redundantes dentro de ese directorio.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
