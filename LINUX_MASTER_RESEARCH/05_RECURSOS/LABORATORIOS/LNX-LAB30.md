# LNX-LAB30 — Correlación SOC, pruebas negativas y retest

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Diseñar y **validar detecciones SOC** sobre datos **sintéticos etiquetados**, construyendo tres fichas de detección, un conjunto de **casos positivos y negativos**, una **matriz TP/FP/TN/FN** con su latencia y un **retest**, cerrando con una hipótesis que permaneció sin resolver (base documental: F73, F79, F82, F83, F98, F100).

## Competencia

Validación de detección por **evidencia**: comparar sensor de host y sensor de red, incluir casos negativos y no promover una IP desconocida a prueba suficiente de malicia.

## Nivel y prerrequisitos

Avanzado. Conviene haber recorrido la etapa `LNX-23` y tener `LNX-LAB21`–`LNX-LAB29` recomendados. Requiere logs SSH/red de laboratorio o registros **sintéticos etiquetados**. **No** se ingieren datos no autorizados.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-30`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones de ejemplo pertenecen **solo** a rangos de documentación (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` y `2001:db8::/32`); no se usan IPs reales.
- Detecciones de ejemplo (no de producción): `T4-D01` (listener nuevo), `T4-D02` (egreso no inventariado) y `T4-D03` (SSH desde origen fuera de baseline); casos positivos/negativos claramente etiquetados.
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB30"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado: `mkdir -p "$HOME/linux-lab/LAB30"`
2. Registra fecha y hora en **UTC** y confirma que los datos son propios/sintéticos: `date -u -Is > "$HOME/linux-lab/LAB30/lab30-entorno.txt"`.

### Tarea (detecciones, casos y retest)

3. Selecciona **T4-D01, T4-D02 y T4-D03** (o justifica un cambio) y especifica para cada una: **hipótesis, fuente, campos mínimos, ventana, supuestos de normalidad y contramedida** → `"$HOME/linux-lab/LAB30/lab30-fichas.md"`.
4. Crea **casos positivos y negativos** sintéticos **etiquetados** (por ejemplo: backup legítimo vs egreso no autorizado; administrador vs conexión fuera de baseline; escucha prevista vs listener nuevo). Datos de ejemplo: `"$HOME/linux-lab/LAB30/lab30-dataset.txt"`.
5. Construye la **matriz TP/FP/TN/FN** con **limitaciones de cobertura** y una **métrica de latencia** (detección en segundos/minutos) → `"$HOME/linux-lab/LAB30/lab30-matriz.md"`.
6. Ejecuta las pruebas en el laboratorio, **ajusta la correlación** y repite el **retest** con cambios; registra ambos resultados → `"$HOME/linux-lab/LAB30/lab30-retest.md"`.
7. Compara **sensor de host** y **sensor de red**: qué ve cada uno y qué hueco queda (proceso/PID vs 5-tuple) → `"$HOME/linux-lab/LAB30/lab30-sensores.md"`.
8. Entrega el **informe de cobertura** y declara **una hipótesis que permaneció sin resolver** (por ejemplo, un flujo efímero no registrado) en `"$HOME/linux-lab/LAB30/lab30-informe.md"`.
9. Sella la evidencia: `{ date -u -Is; sha256sum "$HOME/linux-lab/LAB30"/lab30-*.*; } > "$HOME/linux-lab/LAB30/SHA256SUMS"`

> **No** envíes alertas a un SOC real ni cargues PCAP sensible. Los datos van **marcados como sintéticos**. Una **única señal** no confirma actividad maliciosa.

### Verificación y limpieza

10. Confirma que **no** promueves una IP desconocida como prueba suficiente de malicia y que incluyes al menos un **caso negativo** y un **retest**.
11. Verifica que **comparas** sensor de host y de red y que declaras las **fuentes ausentes** (huecos de telemetría/retención).
12. Revalida hashes: `sha256sum -c "$HOME/linux-lab/LAB30/SHA256SUMS"`. **No** se modifica producción; elimina datasets de prueba solo si no necesitas conservarlos.

## Evidencia a entregar

- Las **tres fichas de detección**.
- El **dataset sintético etiquetado**.
- La **matriz de confusión** (TP/FP/TN/FN) con latencia y cobertura.
- Los **resultados de retest** y la **lista de fuentes ausentes**.

## Criterios de aceptación

- Técnica (4): las detecciones tienen hipótesis, fuente, campos, ventana y contramedida verificables.
- Interpretación y límites (3): no promueve IP desconocida a prueba de malicia y compara sensor host y red.
- Evidencia (2): dataset etiquetado, matriz y retest con hash y UTC.
- Seguridad y reversión (1): no se ingiere ni comparte dato no autorizado y se declara una hipótesis sin resolver.
- **Fallo crítico:** promover una única señal o IP desconocida como prueba de malicia, u omitir casos negativos/retest. Aquí todo es sintético y etiquetado.

## Autorización y límites

Actividad **defensiva** sobre **datos propios/sintéticos** claramente etiquetados. **Prohibido** enviar alertas a un SOC real, cargar PCAP sensible y usar datos de terceros. Las técnicas `T1046`/`T1041`/`T1078` se citan como **modelos** de detección, sin actividad real.

## Limpieza

No se modifica producción. Conserva `lab30-*.md`, `lab30-dataset.txt` y `SHA256SUMS` como evidencia; elimina datasets de prueba solo si no necesitas conservarlos.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
