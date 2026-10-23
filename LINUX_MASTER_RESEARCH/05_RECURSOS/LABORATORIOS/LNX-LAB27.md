# LNX-LAB27 — Captura PCAP corta y custodia mínima

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Realizar una **captura PCAP corta, propia y declarada** sobre el veth de la namespace `lnxlab-srv`, con un filtro BPF ajustado, snaplen reducido y límite de paquetes, documentar el **hash** y una **nota de custodia mínima** (hora, quién, para qué) y declarar los límites de lo observable (base documental: F79, F95, F99).

## Competencia

Adquisición delimitada de tráfico: correspondencia entre metadatos y hash, lectura del PCAP sin modificarlo, y distinción entre lo que prueba la captura (5-tuple, flags, tiempos) y lo que **no** prueba (usuario, PID, intención).

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-21` y tener `LNX-LAB23` (namespaces `lnxlab-cli`/`lnxlab-srv`). Requiere `tcpdump` en la VM o `sudo`, y datos sintéticos. **No** se captura tráfico ajeno ni de terceros.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-27`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales.
- Captura de ejemplo acotada: interfaz `lnxs` de la namespace `lnxlab-srv`, filtro `host 192.0.2.1 and tcp port 8080`, snaplen `128`, límite `25` paquetes.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB27"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB27"`
2. Anota fecha **UTC**, interfaz y namespace, y registra el **comando exacto** de captura: `date -u -Is; ip netns list` → `"$HOME/linux-lab/LAB27/lab27-bitacora.txt"`
3. Confirma que la topología de `LNX-LAB23` está activa y que el servidor HTTP sintético escucha en `192.0.2.2:8080`.

### Tarea (captura corta y declarada)

4. Captura **solo** el veth autorizado, hasta 25 paquetes:
   `sudo ip netns exec lnxlab-srv tcpdump -i lnxs -nn -s 128 -c 25 -w "$HOME/linux-lab/LAB27/lab27-captura.pcap" 'host 192.0.2.1 and tcp port 8080'` (en una terminal dedicada).
5. Genera **peticiones HTTP inocuas** dentro del laboratorio mientras captura: `sudo ip netns exec lnxlab-cli curl --max-time 3 -s http://192.0.2.2:8080/ > /dev/null`.
6. Calcula el **sha256** y consérvalo **separado** del archivo original: `sha256sum "$HOME/linux-lab/LAB27/lab27-captura.pcap" > "$HOME/linux-lab/LAB27/lab27-captura.sha256"`
7. Redacta la **nota de custodia mínima** (hora UTC, analista, finalidad, interfaz, namespace, filtro BPF, snaplen, límite, ubicación restringida) en `"$HOME/linux-lab/LAB27/lab27-custodia.md"`. Usa una plantilla no hexadecimal para identificadores, p. ej. `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`.
8. Lee el PCAP **sin modificarlo** e identifica `SYN`, `SYN/ACK`, `ACK` y `FIN/RST` cuando estén capturados: `tcpdump -nn -r "$HOME/linux-lab/LAB27/lab27-captura.pcap" > "$HOME/linux-lab/LAB27/lab27-lectura.txt"`
9. Construye la **tabla de 5-tuple y flags** y declara los **límites**: posibles paquetes perdidos o truncados, ausencia de PID/identidad y de payload (snaplen 128) → `"$HOME/linux-lab/LAB27/lab27-limites.md"`.
10. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB27"/lab27-*.*; } > "$HOME/linux-lab/LAB27/SHA256SUMS"`

> Captura **corta, propia y declarada**. Un snaplen de 128 aún puede recoger datos sensibles: protege el PCAP y **no** captures tráfico de terceros.

### Verificación y limpieza

11. Confirma que la captura procede **solo** del veth autorizado y que hash y metadatos concuerdan.
12. Verifica que **no** haces afirmaciones de usuario/intención sin evidencia adicional (el PCAP no identifica PID ni usuario).
13. **Limpieza**: detén `tcpdump` por `-c` o con `Ctrl+C`; conserva el PCAP en una carpeta de acceso limitado o retíralo según la política del laboratorio; revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB27/SHA256SUMS"`.

## Evidencia a entregar

- El **PCAP restringido** de laboratorio.
- La **bitácora de adquisición** y la **nota de custodia mínima**.
- El **SHA-256** del artefacto.
- La **tabla de 5-tuple y flags** y la **declaración de límites**.

## Criterios de aceptación

- Técnica (4): el filtro BPF y el snaplen son correctos y la captura es de la veth autorizada.
- Interpretación y límites (2): se declara lo que el PCAP **no** prueba (usuario/PID/intención).
- Evidencia (3): hash y metadatos de custodia concuerdan con la captura.
- Seguridad y reversión (1): no se captura tráfico ajeno y el PCAP se protege.
- **Fallo crítico:** capturar tráfico fuera de la veth propia o de redes ajenas, o afirmar que el PCAP demuestra qué usuario exfiltró. Aquí todo es propio, corto y declarado.

## Autorización y límites

Actividad de **captura delimitada** sobre **datos de prueba propios** con permiso y finalidad declaradas. **Prohibido** capturar datos de terceros, publicar el PCAP o compartirlo sin custodia. Un snaplen reducido **no** garantiza ausencia de datos sensibles. `T1040` se cita como **modelo**, sin intercepción de redes ajenas.

## Limpieza

Detén `tcpdump` con `-c`/`Ctrl+C` y retira o restringe el PCAP según política. Conserva `lab27-*.pcap`, `lab27-*.sha256`, `lab27-*.txt`, `lab27-*.md` y `SHA256SUMS` como evidencia en una carpeta de acceso limitado.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
