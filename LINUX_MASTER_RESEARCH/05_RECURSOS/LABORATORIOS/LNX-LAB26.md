# LNX-LAB26 — Túnel SSH autorizado: comprender qué ven sensores

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Construir un **túnel `ssh -L` de laboratorio** entre un cliente y un bastión propios, con un servicio HTTP sintético al final, y documentar **qué observa cada sensor** (cliente, red y bastión): qué queda cifrado, qué puerto local aparece y qué destino final **no** se ve desde fuera (base documental: F82, F83, F84, F85, F95).

## Competencia

Comprensión de la **visibilidad** de un reenvío: separar el flujo SSH cifrado del HTTP de laboratorio al final del túnel, registrar el listener local y el proceso `ssh`, y **no** etiquetar un túnel como malicioso por sí mismo.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-21` y tener `LNX-LAB25` (o una explicación equivalente). Requiere dos VM de laboratorio (o un bastión propio), un servicio HTTP de prueba con datos inertes y consola local. **No** se usa SSH de trabajo ni bastiones empresariales.

## Material sintético

- VM de laboratorio aisladas con nombre de ejemplo `lab-lnx-26` (cliente) y `lab-lnx-26b` (bastión), cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales.
- Arquitectura de ejemplo (no de una red real): cliente `192.0.2.30` → bastión `192.0.2.10` → HTTP sintético `192.0.2.2:8080` con contenido `T4 LAB: DATOS FICTICIOS`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB26"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB26"`
2. Define y registra la **arquitectura y la aprobación explícita** del ejercicio (cliente ↔ bastión ↔ HTTP de laboratorio) y la hora UTC: `date -u -Is > "$HOME/linux-lab/LAB26/lab26-aprobacion.txt"`
3. Prepara el servicio HTTP sintético en el extremo interior con datos inertes: `printf 'T4 LAB: DATOS FICTICIOS\n' > /tmp/lnxlab-web/index.html` y sirve en `192.0.2.2:8080` (puerto **no privilegiado**).

### Tarea (túnel supervisado)

4. Crea el túnel `ssh -L` **bajo supervisión**, usando puertos no privilegiados y **sin** `GatewayPorts`:
   `ssh -N -L localhost:8080:192.0.2.2:8080 analista@192.0.2.10` (en una terminal dedicada).
5. Desde el cliente, accede al recurso sintético y registra el **listener local** y el proceso `ssh`:
   `curl --max-time 3 -s http://localhost:8080/; ss -lntp '( sport = :8080 )' > "$HOME/linux-lab/LAB26/lab26-listener-cli.txt"; pgrep -a ssh >> "$HOME/linux-lab/LAB26/lab26-listener-cli.txt"`
6. Observa el **flujo cifrado** hacia el bastión y qué **no** muestra cada punto: `ss -tanop > "$HOME/linux-lab/LAB26/lab26-flujo.txt"`.
7. Contrasta los registros: revisa el log de `sshd` del bastión (usuario, método, origen, sesión) y anota lo que **no** aparece (`journalctl -u ssh -u sshd --since '5 min ago' --no-pager` → `"$HOME/linux-lab/LAB26/lab26-logs-bastion.txt"`). Redacta cualquier dato sensible.
8. Construye la **tabla de visibilidad por sensor** (cliente / red externa / bastión / aplicación final) en `"$HOME/linux-lab/LAB26/lab26-visibilidad.md"`: quién ve el listener, quién ve solo el flujo SSH y quién necesita visión del bastión para conocer el destino interior.
9. Explica por qué ver `ssh -L` en una línea de comandos **no** prueba intención maliciosa, en `"$HOME/linux-lab/LAB26/lab26-interpretacion.md"`.
10. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB26"/lab26-*.*; } > "$HOME/linux-lab/LAB26/SHA256SUMS"`

> **No** reutilices SSH de trabajo, **no** abras reenvíos hacia redes públicas y **no** uses el túnel para eludir controles. Todo ocurre entre máquinas propias del laboratorio.

### Verificación y limpieza

11. Confirma que **no** hay tráfico hacia terceros y que distingues el flujo SSH cifrado del HTTP de laboratorio al final del túnel.
12. **Cierre controlado**: detén el cliente SSH/túnel y comprueba la desaparición del listener y del proceso en ambos extremos: `ss -lntp '( sport = :8080 )'; pgrep -a ssh`.
13. Retira el listener HTTP si lo creaste y revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB26/SHA256SUMS"`.

## Evidencia a entregar

- El **diagrama de salto** (cliente ↔ bastión ↔ servicio).
- **Logs SSH** seleccionados y redactados.
- La salida de **`ss`/PCAP** con redacción de datos sensibles.
- La **tabla de visibilidad por sensor** y la **comprobación de cierre**.

## Criterios de aceptación

- Técnica (4): el túnel funciona y se distingue el flujo SSH cifrado del HTTP de laboratorio al final.
- Interpretación y límites (3): no se etiqueta como malicioso un túnel por sí mismo y se declara qué **no** ve cada sensor.
- Evidencia (2): diagrama, logs seleccionados y tabla de visibilidad con hash y UTC.
- Seguridad y reversión (1): no hay tráfico a terceros y el cierre se verifica.
- **Fallo crítico:** abrir reenvíos hacia redes públicas, reutilizar un bastión empresarial o usar el túnel para eludir controles. Aquí todo es infraestructura propia de laboratorio.

## Autorización y límites

Actividad **Red Team autorizada** sobre **infraestructura propia** con cuentas y servicios de laboratorio. **Prohibido** usar SSH de trabajo, bastiones empresariales, redes externas y técnicas de ocultación. `T1572` se cita como **modelo** de observación, sin uso evasivo.

## Limpieza

Cierra el cliente SSH y el túnel de forma controlada, comprueba `ss`/procesos en ambos extremos y retira el listener HTTP de prueba. Conserva `lab26-*.txt`, `lab26-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
