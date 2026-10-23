# WAD-LAB01 — Inventario, baseline y árbol de procesos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

Registrar el estado de un host Windows y describir su árbol de procesos y servicios **con evidencia**, distinguiendo datos observados de inferencias y demostrando la reversión de cualquier cambio controlado.

## Competencia

Operación en solo lectura: leer estado, documentarlo y, cuando un cambio sea imprescindible, aplicarlo de forma reversible.

## Nivel y prerrequisitos

Fundamentos. Conviene haber recorrido la etapa `WAD-01` (lecciones `WAD-01-L01` a `WAD-01-L03`) y la etapa `WAD-02` (lecciones `WAD-02-L01` a `WAD-02-L03`). El bloque A se apoya en `WAD-01`; el bloque B, en `WAD-02`.

## Bloque A — Inventario y baseline (etapas WAD-01 y WAD-02)

### Preparación A

- Un host Windows propio o una máquina virtual de laboratorio aislada.
- Cuenta con permiso de lectura de información del sistema. **No** se requieren cambios de configuración.
- Registra fecha y hora en **UTC** al empezar.

### Tarea A

1. Anota nombre de host, producto, `CurrentBuild`, `UBR` y `DisplayVersion`.
2. Lista actualizaciones aplicadas y la arquitectura del sistema.
3. Lee el estado de la cadena de arranque (modo de arranque y almacén BCD) **solo lectura**.
4. Enumera sesiones activas y, si procede, software instalado con su versión.
5. Guarda la salida en un archivo con el nombre del host y la marca de tiempo.

### Evidencia A

Ficha de host con los campos anteriores, la salida guardada y una nota de **límites**: qué no se pudo observar y por qué.

### Criterios A

- Los datos mínimos están presentes y son coherentes entre sí.
- La lectura del arranque no modificó configuración.
- La conclusión distingue lo observado de lo inferido.

## Bloque B — Árbol proceso-servicio y reversión (etapa WAD-02)

### Preparación B

- La misma máquina virtual del bloque A, idealmente con una **instantánea** creada antes de empezar.
- Solo lectura para las tareas 1 a 4. La tarea 5 exige un cambio controlado y su reversión.
- Registra de nuevo fecha y hora en **UTC**.

### Tarea B (solo lectura)

1. Construye un **árbol de procesos** del host: para cada proceso relevante anota nombre, ruta, PID, cuenta, sesión y hora de inicio.
2. Elige **cinco servicios** y registra, para cada uno, tipo de inicio, cuenta, ruta del binario y dependencias declaradas.
3. Señala al menos una **dependencia** observable entre servicios o controladores y explica qué pasaría si la dependencia no arranca.
4. Justifica por qué un **proceso conocido no demuestra legitimidad**: elige un proceso de nombre familiar y explica qué datos adicionales harían falta.

### Tarea B (cambio controlado y reversión)

5. En la máquina virtual, aplica **un** cambio reversible y de bajo impacto (por ejemplo, crear una tarea programada sintética de solo lectura y luego eliminarla). Antes de aplicarlo, registra el estado inicial; después, verifica el efecto, revierte aplicando la reversión definida y re-verifica que el estado coincide con el inicial.

### Evidencia B

- El árbol proceso-servicio con los datos observados.
- La nota de dependencia y la justificación de legitimidad.
- La secuencia del cambio reversible: estado inicial, cambio, verificación, reversión y re-verificación.

### Criterios B

- Diferencia **proceso** de **servicio** y no confunde el PID del anfitrión con el servicio.
- Demuestra al menos una **dependencia** con datos observados.
- Documenta la **reversión** del cambio y confirma el retorno al estado inicial.
- Reconoce los límites: qué quedó inferido y qué no se pudo observar.

## Autorización y límites

Actividades de solo lectura salvo la tarea B.5, que debe ejecutarse **solo** en un sistema propio o en una máquina virtual aislada con instantánea. No cambies BCD, firmware, TPM ni BitLocker. No extraigas ni publiques claves de recuperación ni material sensible del registro; evita exportar ramas completas.

## Limpieza

Revierte el cambio de la tarea B.5 y confirma el estado inicial (o recupera la instantánea). Conserva la salida como evidencia y elimina copias innecesarias.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
