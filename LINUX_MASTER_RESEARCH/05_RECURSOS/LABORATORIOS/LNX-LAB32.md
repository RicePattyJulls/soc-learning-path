# LNX-LAB32 — PAM/sudoers y superficies de identidad

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Inspeccionar en **solo lectura** la pila PAM y la delegación de `sudoers` de una VM de laboratorio, reconstruir el orden `auth/account/password/session`, escribir una **pseudoconfiguración ficticia** bajo el directorio del laboratorio y enumerar cuatro riesgos contextualizados con su plan de cambio, rescate y retest, **sin editar** `/etc/pam.d` ni `/etc/sudoers` (base documental: F101, F102, F103, F105, F137).

## Competencia

Lectura crítica de superficies de identidad: distinguir **regla escrita** de **regla efectiva**, explicar `required/requisite/sufficient/include/substack`, y reconocer que un `pam_exec` o un editor escribible pueden ampliar la delegación sin que exista un fallo de contraseña.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-25`. Requiere `sudo` (para `sudo -n -l`, que puede fallar legítimamente), `grep`, `sha256sum` y acceso de lectura a `/etc/pam.d`. **No** se requieren privilegios de edición ni se modifica la autenticación del sistema.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-32`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`). No se usan IPs reales.
- Servicios PAM de ejemplo (nombres ficticios, no rutas reales): `lab-login`, `lab-sudo`, `lab-sshd`.
- Configuración ficticia: `"$HOME/linux-lab/LAB32/config/pam.d-laboratorio"` y `"$HOME/linux-lab/LAB32/config/sudoers-laboratorio"`. **Nunca** se copian sobre `/etc`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB32"` con subdirectorio `config`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB32/config"`.
2. Registra fecha **UTC**, identidad y política efectiva propia: `date -u -Is; id; sudo -n -l 2>&1 || true` → `"$HOME/linux-lab/LAB32/lab32-entorno.txt"`. Un error de `sudo -n -l` es un **resultado esperado** si la cuenta no tiene reglas o requiere contraseña; se documenta, no se fuerza.
3. Inventaría **nombres** de servicios PAM y sus metadatos, sin publicar el contenido íntegro: `ls -l /etc/pam.d 2>/dev/null | head -40; ls -ld /etc/pam.d /usr/lib/pam.d 2>/dev/null` → `"$HOME/linux-lab/LAB32/lab32-pam-inventario.txt"`.

### Tarea (pila PAM y delegación)

4. Extrae **solo** las líneas de tipo de control de tres servicios concretos (por ejemplo `login`, `sudo`, `sshd` si existen): `grep -HE '^[[:space:]]*(auth|account|password|session)[[:space:]]' /etc/pam.d/login /etc/pam.d/sudo /etc/pam.d/sshd 2>/dev/null` → `"$HOME/linux-lab/LAB32/lab32-pam-lineas.txt"`.
5. Dibuja la **pila por tipo** (`auth → account → password → session`) indicando qué decide cada grupo y en qué punto un usuario autenticado puede quedar **denegado** por `account`. Guárdalo en `"$HOME/linux-lab/LAB32/lab32-pila.md"`.
6. Escribe la **pseudoconfiguración didáctica** (comentada, no instalable) con un servicio ficticio `lab-login` que use `required`, `requisite`, `sufficient` e `include`, y una variante con `pam_exec` marcada como **alto impacto** → `"$HOME/linux-lab/LAB32/config/pam.d-laboratorio"`.
7. Escribe una regla `sudoers` sintética con `NOPASSWD` sobre un comando de laboratorio y analiza si un **editor o script escribible** por el usuario amplía la delegación (por ejemplo, un `vi` sin restricción de argumentos). No la instales → `"$HOME/linux-lab/LAB32/config/sudoers-laboratorio"`.
8. Enumera **cuatro riesgos contextualizados**: (a) regla `NOPASSWD` demasiado amplia, (b) `pam_exec` invocando un script escribible, (c) `sufficient` que corta la pila antes del segundo factor, (d) `include`/`substack` que arrastra una política no revisada. Para cada uno: activo afectado, precondición, efecto observable y control mínimo → `"$HOME/linux-lab/LAB32/lab32-riesgos.md"`.
9. Redacta el **plan de cambio con rescate**: snapshot y hash del fichero efectivo, consola fuera de banda o sesión de rescate abierta, cuenta de prueba, validación de **éxito** y de **fallo** de autenticación, rollback versionado y comparación de telemetría → `"$HOME/linux-lab/LAB32/lab32-plan-rollback.md"`.
10. Identifica **tres fuentes** para detectar un cambio real de PAM o sudoers: auditoría/FIM de escritura sobre las rutas de política, registros de `sudo`/`sshd` en journal, y diferencia de hash frente a la versión del paquete. Anótalas con su límite → `"$HOME/linux-lab/LAB32/lab32-deteccion.md"`.
11. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB32"/lab32-*.* "$HOME/linux-lab/LAB32"/config/*; } > "$HOME/linux-lab/LAB32/SHA256SUMS"`.

> **No** edites `/etc/pam.d`, `/etc/pam.conf` ni `/etc/sudoers*`. **No** ejecutes `pam_exec` de prueba. **No** cierres la única sesión administrativa. Toda la configuración de este laboratorio vive bajo `"$HOME/linux-lab/LAB32/config"`.

### Verificación y limpieza

12. Confirma que cada afirmación sobre la pila se apoya en una línea **leída** y que distingues el fichero de vendor del fichero local efectivo cuando existan ambos.
13. Verifica que el plan de rollback cubre **éxito y fallo** de autenticación y que existe una vía de rescate antes de cualquier cambio.
14. Comprueba que **no** se ha modificado ninguna política real: `sha256sum /etc/pam.d/* /etc/sudoers 2>/dev/null` comparado con la captura inicial, si la hubo.
15. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB32/SHA256SUMS"` y **limpieza**: elimina solo los ficheros sintéticos bajo `"$HOME/linux-lab/LAB32"`, comprobando el prefijo de ruta. No hay cambios de autenticación que revertir.

## Evidencia a entregar

- El **diagrama de la pila PAM** por tipo y servicio.
- Los **cuatro riesgos contextualizados** con control mínimo.
- El **plan de rollback** con prueba de éxito y de fallo de autenticación.
- Las **tres fuentes** de detección de cambios PAM/sudoers con sus límites.
- La **pseudoconfiguración** claramente marcada como no instalable, con hash y UTC.

## Criterios de aceptación

- Pila PAM (3): orden y semántica de `required/requisite/sufficient/include/substack` correctos y aplicados a un caso de denegación en `account`.
- Riesgos y sudoers (3): cuatro riesgos reales, incluida la ampliación por editor/script escribible, sin afirmar explotación.
- Rollback y detección (2): plan con rescate, prueba positiva/negativa y tres fuentes con límites.
- Evidencia (2): hash, UTC y confirmación de que las políticas reales no cambiaron.
- **Fallo crítico:** editar `/etc/pam.d` o `sudoers` reales, ejecutar `pam_exec` de prueba o cerrar la sesión de administración. Aquí todo es lectura y configuración ficticia.

## Autorización y límites

Actividad de **solo lectura** sobre la política de identidad de una **VM desechable**. **Prohibido** editar `/etc/pam.d`, `/etc/pam.conf` o `/etc/sudoers*`, ejecutar `pam_exec` de prueba, activar la regla sintética y tocar la autenticación del host real. La pseudoconfiguración es material docente: no se instala ni se valida contra el sistema.

## Limpieza

No hay cambios de autenticación que revertir. Conserva `lab32-*.md`, `lab32-*.txt`, `config/*` y `SHA256SUMS` como evidencia; elimina solo copias temporales fuera de `"$HOME/linux-lab/LAB32"`. Si capturaste metadatos de políticas reales, redáctalos antes de compartirlos.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
