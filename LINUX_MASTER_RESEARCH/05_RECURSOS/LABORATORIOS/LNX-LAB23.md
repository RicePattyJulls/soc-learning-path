# LNX-LAB23 — Topología aislada veth + dos network namespaces

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Construir un **banco de red aislado** con dos *network namespaces* conectados exclusivamente entre sí por un par `veth`, asignar direcciones de documentación, verificar la conectividad interna y comprobar el aislamiento respecto al host, incluyendo la **limpieza controlada** de solo los namespaces creados (base documental: F74, F75, F80, F71, F96, F97).

## Competencia

Creación y **demolición reversible** de namespaces de red, lectura de rutas dentro de cada namespace y demostración de que una escucha del host **no** incluye las de otra namespace.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-19` y tener `LNX-LAB21` (o una explicación equivalente). Requiere consola local de VM descartable, `iproute2`, `python3`, `curl` y permiso `CAP_NET_ADMIN` (`sudo`). **No** se ejecuta en un host productivo.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-23`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales ni salida a Internet.
- Topología de ejemplo (exclusiva de estas prácticas): namespaces `lnxlab-cli` y `lnxlab-srv`, veth `lnxc ↔ lnxs`, direcciones `192.0.2.1/24` y `192.0.2.2/24`.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB23"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB23"`
2. Registra fecha y hora en **UTC** y verifica que los nombres estén libres: `date -u -Is > "$HOME/linux-lab/LAB23/lab23-prep.txt"; ip netns list >> "$HOME/linux-lab/LAB23/lab23-prep.txt"`. **Si `lnxlab-cli` o `lnxlab-srv` ya existen, NO sobrescribir.**
3. Registra la salida del host **antes**: `ip -br link; ip -br addr; ss -lntup` → `"$HOME/linux-lab/LAB23/lab23-host-antes.txt"`

### Tarea (construcción y prueba)

4. Crea namespaces y veth **solo para el laboratorio**:
   `sudo ip netns add lnxlab-cli; sudo ip netns add lnxlab-srv; sudo ip link add lnxc type veth peer name lnxs; sudo ip link set lnxc netns lnxlab-cli; sudo ip link set lnxs netns lnxlab-srv`
5. Asigna direcciones y levanta interfaces:
   `sudo ip netns exec lnxlab-cli ip addr add 192.0.2.1/24 dev lnxc; sudo ip netns exec lnxlab-srv ip addr add 192.0.2.2/24 dev lnxs; sudo ip netns exec lnxlab-cli ip link set lo up; sudo ip netns exec lnxlab-srv ip link set lo up; sudo ip netns exec lnxlab-cli ip link set lnxc up; sudo ip netns exec lnxlab-srv ip link set lnxs up`
6. Demuestra la comunicación y la ruta dentro de la topología:
   `sudo ip netns exec lnxlab-cli ip -br addr; sudo ip netns exec lnxlab-srv ip -br addr; sudo ip netns exec lnxlab-cli ip route get 192.0.2.2; sudo ip netns exec lnxlab-cli ping -c 2 -W 1 192.0.2.2` → `"$HOME/linux-lab/LAB23/lab23-conectividad.txt"`
7. Comprueba el **aislamiento**: `sudo ip netns exec lnxlab-srv ss -lnt > "$HOME/linux-lab/LAB23/lab23-srv-listen.txt"; ss -lnt > "$HOME/linux-lab/LAB23/lab23-host-listen.txt"`. Levanta un servidor de prueba con datos ficticios en `lnxlab-srv` (`printf 'T4 LAB: DATOS FICTICIOS\n'` y `python3 -m http.server 8080 --bind 192.0.2.2`) y verifica que la escucha aparece en `lnxlab-srv` pero **no** en `ss` del host.
8. Explica por qué una vista del host no incluye todas las escuchas y guarda la comparación en `"$HOME/linux-lab/LAB23/lab23-aislamiento.md"`.
9. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB23"/lab23-*.*; } > "$HOME/linux-lab/LAB23/SHA256SUMS"`

> **No** asocies el veth a un bridge, NIC física, VPN ni host externo. **No** borres namespaces preexistentes ni uses `ip link del` con nombres genéricos.

### Verificación y limpieza

10. Confirma que `lnxlab-cli ↔ lnxlab-srv` funciona, que **no hay ruta exterior** y que la conectividad `host ↔ namespaces` por esa vía no existe.
11. Verifica que la limpieza afecta **solo** a las namespaces creadas: `sudo ip netns pids lnxlab-srv; sudo ip netns pids lnxlab-cli` y detén los procesos de forma controlada antes de eliminarlas.
12. **Rollback**: `sudo ip netns del lnxlab-cli; sudo ip netns del lnxlab-srv; ip netns list` (debe desaparecer `lnxlab-*` y conservarse cualquier namespace previo). Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB23/SHA256SUMS"`.

## Evidencia a entregar

- El **mapa de topología y rutas** (namespaces, veth y direcciones).
- El **ping** y su **hora UTC**.
- La **prueba de separación** de namespaces (escucha que no aparece en el host).
- La **salida de cleanup** (`ip netns list` tras el borrado).

## Criterios de aceptación

- Técnica (4): la conectividad `lnxlab-cli ↔ lnxlab-srv` funciona y la ruta interna es coherente.
- Interpretación y límites (2): se demuestra que la vista del host no incluye las escuchas de otra namespace.
- Evidencia (2): topología, ping y hora UTC presentes.
- Seguridad y reversión (2): la limpieza **no** afecta a otras namespaces ni al host.
- **Fallo crítico:** conectar el veth a un bridge/NIC real, sobrescribir namespaces existentes o borrar interfaces del host. Aquí todo es aislado y con rollback.

## Autorización y límites

Actividad sobre una VM **descartable** con namespaces **exclusivos** del laboratorio. **Prohibido** asociar el veth a una interfaz real, bridge, VPN o host externo, sobrescribir namespaces con nombres existentes y tocar la red de administración. Mantén consola local (no remota) para poder limpiar.

## Limpieza

Detén los procesos listados con `ip netns pids` y elimina **solo** `lnxlab-cli` y `lnxlab-srv` con `ip netns del`. Los veth asociados desaparecen al destruir sus namespaces sin referencias. Conserva `lab23-*.txt`, `lab23-*.md` y `SHA256SUMS` como evidencia.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
