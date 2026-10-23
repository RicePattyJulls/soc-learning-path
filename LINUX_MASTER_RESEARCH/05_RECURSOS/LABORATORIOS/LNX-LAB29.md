# LNX-LAB29 — Simulación de egreso sospechoso y contención reversible

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Simular una **alerta de egreso anómalo** con un flujo ficticio `lnxlab-cli → lnxlab-srv:8080`, decidir y aplicar una **contención proporcionada y reversible** (filtro de egreso en la namespace del cliente o aislamiento del servicio de laboratorio), preservar evidencia pre/post y demostrar la **reversión** con conectividad funcional recuperada (base documental: F86, F87, F88, F90, F91, F92).

## Competencia

Respuesta a incidentes **acotada**: elegir el punto de contención adecuado, medir antes/después, no equiparar bloquear una IP con erradicar una intrusión y documentar el rollback.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-22` y tener `LNX-LAB23` y `LNX-LAB24` (o una explicación equivalente). Requiere namespaces de laboratorio, `nftables` y un plan de ejercicio con autoridad definida. **No** se mueve ni se exfiltra ningún dato real.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-29`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales ni egreso a Internet.
- Flujo de ejemplo (no de un incidente real): `lnxlab-cli → lnxlab-srv:8080` con payload literal `T4 LAB`; host de ejemplo `lab-lnx-29`, destino ficticio `192.0.2.2`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB29"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB29"`
2. Registra fecha y hora en **UTC** y redacta la **alerta simulada** (hora, bytes ficticios, sensor, host y destino de laboratorio) en `"$HOME/linux-lab/LAB29/lab29-ticket.md"`; usa una plantilla de identificador no hexadecimal, p. ej. `lab-case-XXXXXXXX`.
3. Confirma que la topología de `LNX-LAB23` está activa y que el servidor sintético escucha en `192.0.2.2:8080`.

### Tarea (alerta → contención → evidencia)

4. Conserva un **snapshot pre-contención** sin datos secretos: `ss -tanop`, rutas y procesos de ambas namespaces, y reglas dentro de `lnxlab-srv` → `"$HOME/linux-lab/LAB29/lab29-pre.txt"`.
5. Genera el **flujo sintético** controlado: `sudo ip netns exec lnxlab-cli curl --max-time 3 -s --data 'T4 LAB' http://192.0.2.2:8080/ > /dev/null` y anota la hora UTC.
6. Elige la **contención proporcionada** según el alcance y justifícala: filtro de egreso **en la namespace del cliente** (recomendada) o aislamiento del servicio de laboratorio, **con plan de reversión**. Regístrala en `"$HOME/linux-lab/LAB29/lab29-decision.md"`.
7. Aplica la contención **solo** en el laboratorio (por ejemplo, una tabla `inet lnxlab29` con una regla `output` de denegación en `lnxlab-cli`) y verifica la caída del flujo sintético; anota contadores → `"$HOME/linux-lab/LAB29/lab29-post.txt"`.
8. Anota una **alternativa al bloqueo de IP**: si el actor cambia de destino, un control por segmento/identidad de carga o EDR es más resistente que una regla por IP. Guárdalo en `"$HOME/linux-lab/LAB29/lab29-alternativas.md"`.
9. Demuestra el **fin del flujo sintético** y la **ausencia de conectividad indebida** al host real, y captura la evidencia post-contención.
10. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB29"/lab29-*.*; } > "$HOME/linux-lab/LAB29/SHA256SUMS"`

> **Prohibido** matar procesos arbitrarios, borrar `cron`/servicios del host, mover datos reales o usar credenciales reales. Todo es **simulación** en namespaces propios.

### Verificación y limpieza

11. Confirma que la contención se aplicó **solo** al laboratorio y que **no** equiparas bloquear una IP con erradicar la intrusión; declara las **limitaciones del sensor**.
12. **Rollback**: elimina **solo** la regla o tabla creada para el ejercicio dentro de la namespace y verifica la **conectividad funcional recuperada** (el flujo de prueba vuelve a funcionar): `sudo ip netns exec lnxlab-cli curl --max-time 3 -s http://192.0.2.2:8080/ > /dev/null`.
13. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB29/SHA256SUMS"`.

## Evidencia a entregar

- El **ticket y la cronología** de la simulación.
- La **decisión de contención** y su justificación.
- La **evidencia pre/post** (sockets, rutas, procesos, reglas y contadores).
- El **plan de rollback** con su verificación.
- Las **limitaciones del sensor** declaradas.

## Criterios de aceptación

- Técnica (3): la contención se aplica **solo** al laboratorio y se verifica que el flujo anómalo cesa.
- Interpretación y límites (3): no se equipara bloquear una IP con erradicar la intrusión y se propone una alternativa al bloqueo por IP.
- Evidencia (2): ticket, cronología y evidencia pre/post con hash y UTC.
- Seguridad y reversión (2): el rollback restaura la conectividad funcional.
- **Fallo crítico:** matar procesos arbitrarios, borrar `cron`/servicios del host, mover datos reales o no revertir la contención. Aquí todo es ficticio y reversible.

## Autorización y límites

Actividad **Red Team autorizada** sobre un ejercicio **ficticio** en namespaces propios, con autoridad y playbook definidos. **Prohibido** matar procesos arbitrarios, borrar `cron`/`systemd` del host, usar credenciales o datos reales y generar exfiltración real. `T1041` se cita como **modelo**, sin tráfico fuera del laboratorio.

## Limpieza

Elimina **solo** la regla o tabla creada para el ejercicio en la namespace y verifica el flujo sintético tras la reversión. Conserva `lab29-*.txt`, `lab29-*.md` y `SHA256SUMS` como evidencia. La topología de `LNX-LAB23` se elimina en su propia limpieza.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
