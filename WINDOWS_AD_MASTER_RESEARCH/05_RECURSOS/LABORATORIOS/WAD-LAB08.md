# WAD-LAB08 — Replicación de dos DC sin sabotaje

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

**Observar** cómo se replica el directorio entre dos controladores, **medir** la convergencia de un cambio y **simular** una caída de enlace de prueba sin sabotear la topología ni forzar roles. La meta es describir el estado con evidencia y distinguir un retraso acotado de un fallo real.

## Competencia

Diagnóstico de replicación: describir la topología y el estado de los controladores con herramientas de lectura, medir el efecto de un cambio y reconocer los límites de la conclusión antes de tocar la configuración.

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-13` (`WAD-13-L01` a `WAD-13-L03`). Esta guía corresponde al laboratorio de referencia LAB-08.

## Preparación

- Dos máquinas virtuales en una **red virtual cerrada**: `DC01`, ya promovido como controlador, y `DC02`, que se promoverá como réplica del mismo dominio `ad.lab.test`.
- Una **instantánea** de cada controlador creada antes de empezar y nombres **sintéticos** para todos los objetos.
- Direcciones de **documentación** para el escenario; ninguna dirección real de una organización.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de la replicación como **línea base**.

## Tarea

1. Promueve `DC02` como **controlador de dominio adicional** del dominio de laboratorio y documenta la configuración resultante: dominio, sitio y nivel funcional.
2. Registra la **línea base** del estado de replicación con herramientas de **solo lectura** (resumen de replicación y comprobación de salud de los controladores) y anótala.
3. Crea **objetos señuelo** en `DC01` y **mide** el tiempo hasta que aparecen en `DC02`; repite en sentido contrario.
4. **Simula una caída de enlace de prueba** aislando el enlace virtual entre los dos controladores. **No** fuerces roles de maestro de operaciones ni restaures instantáneas en ambos a la vez.
5. Mientras el enlace está caído, comprueba cómo se **acumulan** los cambios y anota el estado de cada controlador.
6. **Restablece** el enlace y mide la **convergencia**: los cambios deben propagarse sin intervención.
7. Formula la **hipótesis** que explica lo observado, la prueba que la confirma y la que la descarta. Distingue explícitamente un **retraso aislado** de una supuesta **corrupción**: un retraso no se concluye como corrupción.
8. Cierra con una regla operativa: qué se lee, qué se mide y qué **nunca** se hace ante un síntoma de replicación.

## Evidencia esperada

- La configuración del segundo controlador: dominio, sitio y nivel funcional.
- El resumen de replicación y la comprobación de salud, antes y después.
- La **línea temporal** de convergencia con el tiempo medido en cada sentido.
- El comportamiento durante el aislamiento y la convergencia al restablecer el enlace.
- La hipótesis, su prueba y su descarte, separando retraso de corrupción.
- La regla operativa de lectura y medida, sin cambios destructivos.

## Criterios verificables

- **Mide** la convergencia en lugar de suponerla y registra hora en **UTC**.
- **Nunca** fuerza los roles de maestro de operaciones ni sabotea la topología.
- **No** restaura instantáneas en ambos controladores a la vez.
- Distingue un **retraso aislado** de una **corrupción** y no concluye de más.
- Demuestra la prueba **positiva** (converge al restablecer) y la **negativa** (durante el aislamiento no se concluye corrupción).

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre el dominio de laboratorio. **No** conectes el laboratorio a la red corporativa. **No** uses nombres ni datos de una organización real. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

Restablece el enlace, confirma que los dos controladores **convergen** y que el estado coincide con la línea base (o recupera las instantáneas). Elimina los objetos señuelo creados para la medición.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
