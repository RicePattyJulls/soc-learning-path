# LNX-LAB21 — Inventario de red, rutas y DNS del host

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Levantar un **inventario reproducible y pasivo** de interfaces, direcciones IPv4/IPv6, rutas, reglas de enrutamiento por política y resolución de nombres de un host de laboratorio, sin enviar tráfico a destinos externos y sin modificar la configuración (base documental: F71, F72, F76, F77, F78, F80, F81, F96, F97).

## Competencia

Inventario de red de **solo lectura** con evidencia por hash, distinguiendo la **decisión de ruta** de la **entrega real** y la **dirección en escucha** de la **exposición externa**.

## Nivel y prerrequisitos

Básico. Conviene haber recorrido la etapa `LNX-18`. Requiere `iproute2` (`ip`), `ss`, `getent` y, opcionalmente, `resolvectl`. No se requieren privilegios administrativos.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-21`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales.
- Datos de ejemplo (no de un host real): interfaces, rutas y nombres `lab-*`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB21"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB21"`
2. Registra UTC, distro y versiones: `date -u -Is; cat /etc/os-release; uname -r; ip -V; ss -V` (salida a `"$HOME/linux-lab/LAB21/lab21-entorno.txt"`)

### Tarea (inventario pasivo)

3. Captura interfaces y direcciones: `ip -br link; ip -br -4 addr; ip -br -6 addr; ip -j address` → `"$HOME/linux-lab/LAB21/lab21-interfaces.json"`
4. Captura rutas y reglas: `ip -j route show table all; ip rule` → `"$HOME/linux-lab/LAB21/lab21-rutas.json"`
5. Consulta decisiones de ruta **sin enviar paquetes**: `ip route get 192.0.2.80; ip route get 198.51.100.10; ip -6 route get 2001:db8::80` → `"$HOME/linux-lab/LAB21/lab21-routeget.txt"`
6. Compara resolución de nombres: `cat /etc/nsswitch.conf; readlink -f /etc/resolv.conf; cat /etc/resolv.conf; getent ahosts localhost; resolvectl status 2>/dev/null` → `"$HOME/linux-lab/LAB21/lab21-dns.txt"`
7. Dibuja el camino `proceso → socket → namespace → ruta → interfaz → destino` y marca los datos **desconocidos** en `"$HOME/linux-lab/LAB21/lab21-camino.md"`
8. Formula **3 hipótesis** y su prueba de falsación en `"$HOME/linux-lab/LAB21/lab21-hipotesis.md"`
9. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB21"/lab21-*.*; } > "$HOME/linux-lab/LAB21/SHA256SUMS"`

> `ip route get` es una consulta de encaminamiento: **no** manda paquetes. **No** cambies interfaces ni rutas del host.

### Verificación y limpieza

10. Confirma que **no** confundes una **dirección en escucha** con **exposición externa**, ni la **decisión de ruta** con la **entrega extremo a extremo**.
11. Comprueba que el resolver de `/etc/resolv.conf` no se atribuye sin validar (un stub local `localhost` puede ser `systemd-resolved`, no un servidor remoto).
12. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB21/SHA256SUMS"`. Como es inventario pasivo, **no hay cambios que revertir**.

## Evidencia a entregar

- El **inventario** en JSON/TXT (interfaces, direcciones, rutas y reglas).
- La **tabla interfaz/ruta/DNS** junto con el camino de decisión.
- **3 hipótesis** con su prueba de falsación.
- **Hash** y fecha en UTC.

## Criterios de aceptación

- Inventario (3): reproducible y con versiones registradas.
- Interpretación y límites (3): no confunde dirección escuchada con exposición externa, ni ruta con entrega, ni resolver local con servidor remoto.
- Evidencia (2): hash y hora UTC presentes.
- **Fallo crítico:** afirmar que existe exposición externa o entrega real sin prueba desde un origen autorizado, o modificar interfaces/rutas del host. Aquí todo es solo lectura.

## Autorización y límites

Actividad de **solo lectura** sobre una VM propia de laboratorio. **Prohibido** cambiar interfaces o rutas del host de conectividad real y consultar destinos externos. Usa rangos de documentación como destino de `ip route get`, que **no** envía paquetes. No uses `sudo` ni toques redes ajenas.

## Limpieza

No hay cambios en el host que revertir. Conserva `lab21-*.json`, `lab21-*.txt`, `lab21-*.md` y `SHA256SUMS` como evidencia; elimina solo copias temporales fuera de `"$HOME/linux-lab/LAB21"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
