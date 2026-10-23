# LNX-LAB28 — Diagnóstico DNS vs rutas vs TLS/IPv6

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Separar, con evidencia, un fallo de **resolución de nombres**, un fallo de **ruta/conectividad**, un fallo de **negociación TLS** y una diferencia **IPv4/IPv6**, construyendo un **árbol de decisión** y refutando el supuesto de que «ping fallido = servicio caído» (base documental: F77, F78, F71, F76, F98, F99).

## Competencia

Diagnóstico por **capas**: distinguir resolución, conexión, TLS y aplicación, sin atribuir la ausencia de `resolvectl` a un DNS averiado y demostrando criterio dual-stack sin desactivar IPv6.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-23` y tener `LNX-LAB21` (o una explicación equivalente). Requiere `getent`, `curl` y, opcionalmente, `resolvectl`. No se cambia `resolv.conf` ni se consultan dominios sensibles.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-28`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales.
- Nombres y destinos de ejemplo (no de un entorno real): `localhost`, `lab-svc.lab.local`, `192.0.2.2` y `2001:db8::2`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB28"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB28"`
2. Registra fecha y hora en **UTC** y el entorno: `date -u -Is; cat /etc/nsswitch.conf; readlink -f /etc/resolv.conf` → `"$HOME/linux-lab/LAB28/lab28-entorno.txt"`

### Tarea (comparaciones por capa)

3. Compara resolución de nombres: `getent ahosts localhost; getent hosts localhost; resolvectl query localhost 2>/dev/null` → `"$HOME/linux-lab/LAB28/lab28-dns.txt"`. Recuerda que `getent`, `resolvectl` y `dig` pueden diferir por NSS, `/etc/hosts` y resolución por interfaz.
4. Compara decisiones de ruta IPv4 e IPv6 **sin enviar paquetes**: `ip -4 route get 192.0.2.2; ip -6 route get 2001:db8::2` → `"$HOME/linux-lab/LAB28/lab28-rutas.txt"`. Marca la **ausencia de ruta** como hallazgo de configuración del laboratorio, no como fallo del servicio.
5. Verifica la **conexión y la capa de aplicación** con tope de tiempo, por nombre y por IP: `curl --max-time 3 -sv http://localhost:8080/ 2>&1; curl --max-time 3 -sv http://192.0.2.2:8080/ 2>&1` → `"$HOME/linux-lab/LAB28/lab28-curl.txt"`. Anota si el fallo ocurre en **DNS**, **conexión**, **TLS** o **aplicación**.
6. Refuta tres **supuestos falsos**, al menos: (a) «`ping` falló, luego el servicio está caído», (b) «no hay `resolvectl`, luego el DNS está averiado», (c) «IPv4 funciona, luego no hace falta mirar IPv6». Guárdalos con su contraejemplo en `"$HOME/linux-lab/LAB28/lab28-supuestos.md"`.
7. Redacta el **árbol de decisión** (resolución → ruta → conexión → TLS → aplicación) en `"$HOME/linux-lab/LAB28/lab28-arbol.md"`.
8. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB28"/lab28-*.*; } > "$HOME/linux-lab/LAB28/SHA256SUMS"`

> Laboratorio **pasivo**: **no** cambies `resolv.conf` para «probar en vivo» sin snapshot y **no** generes DNS hacia servicios públicos.

### Verificación y limpieza

9. Confirma que **separas** resolución de conectividad y de negociación TLS, y que no infieres que la ausencia de `resolvectl` significa DNS averiado.
10. Comprueba que demuestras **criterio IPv4/IPv6** sin desactivar IPv6 y que la consulta DNS a un nombre **no** se presenta como prueba de conexión a su IP.
11. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB28/SHA256SUMS"`. Como es pasivo, **no hay cambios que revertir** (cierra solo el servicio de prueba si lo abriste).

## Evidencia a entregar

- La **matriz de comandos/resultados** por capa.
- El **árbol diagnóstico**.
- Los **tres falsos supuestos** descartados con contraejemplo.
- La **fecha y el entorno**.

## Criterios de aceptación

- Técnica (3): la matriz separa resolución, conectividad, TLS y aplicación.
- Interpretación y límites (3): no infiere que la ausencia de `resolvectl` implica DNS averiado y demuestra criterio IPv4/IPv6.
- Evidencia (2): fecha, entorno y hash presentes.
- **Fallo crítico:** deshabilitar IPv6 o DNSSEC globalmente para «diagnosticar», o afirmar que un `ping` fallido prueba que el servicio está caído. Aquí todo es pasivo y local.

## Autorización y límites

Actividad **pasiva** en una VM aislada con destinos de laboratorio. **Prohibido** cambiar `resolv.conf` sin snapshot, desactivar IPv6/DNSSEC globalmente y consultar dominios sensibles. No uses `sudo` ni toques redes ajenas.

## Limpieza

No hay cambios de configuración que revertir. Cierra el servicio de prueba si lo abriste y conserva `lab28-*.txt`, `lab28-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
