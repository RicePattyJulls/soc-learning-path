# WAD-LAB21 — SYSVOL DFSR autoritativo versus no autoritativo

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **EXT-01**, avanzado y **opcional**, de la etapa `WAD-20`.

## Objetivo

**Comparar** la recuperación **autoritativa** y la **no autoritativa** de SYSVOL replicado por DFSR: cuándo se deja converger desde las demás réplicas y cuándo se fija una copia válida, y cómo se comprueba después que el contenido es el correcto.

## Competencia

Recuperación de SYSVOL: distinguir la opción que deja decidir a la replicación de la que impone una copia, y verificar la convergencia sin declarar integridad donde no se ha medido.

## Nivel y prerrequisitos

Avanzado y **opcional**. Requiere la etapa `WAD-20` (`WAD-20-L01` a `WAD-20-L03`). Esta guía corresponde al laboratorio de referencia EXT-01.

## Preparación

- Dos controladores `DC01` y `DC02` en una **red virtual cerrada**, con **SYSVOL replicado por DFSR** y el servicio de replicación en estado saludable.
- Una **instantánea** de cada controlador creada antes de empezar y una **carpeta señuelo** con datos sintéticos.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de SYSVOL como **línea base**.

## Tarea

1. **Registra la línea base** del estado de SYSVOL y de la replicación con herramientas de **solo lectura**.
2. **Provoca una discrepancia acotada** en el laboratorio: un cambio en un controlador que no se replica, sin borrar SYSVOL ni tocar la directiva de producción.
3. **Aplica la opción no autoritativa**: deja que la replicación actualice el contenido desde las demás réplicas y **mide** el tiempo de convergencia.
4. Estudia la **opción autoritativa**: describe cuándo se fija una copia como **válida** y por qué se aplica en **un solo** controlador.
5. **Verifica** que el contenido de SYSVOL converge y que las directivas siguen aplicándose, con hora en **UTC**.
6. Formula la **hipótesis** que explica lo observado, la prueba que la confirma y la que la descarta.
7. Cierra con la **prueba negativa**: comprueba que **no** se aplica la opción autoritativa en **ambos** controladores a la vez.

## Evidencia esperada

- El **estado inicial** de SYSVOL y de la replicación.
- La **línea temporal** de convergencia del caso no autoritativo.
- El criterio de cuándo usar la opción **autoritativa** y en cuántos controladores.
- La verificación de **SYSVOL** y de las directivas tras la recuperación.
- La prueba negativa sobre la opción autoritativa en ambos controladores.

## Criterios verificables

- Distingue la opción **autoritativa** de la **no autoritativa** por **quién decide** el contenido.
- **Mide** la convergencia en lugar de suponerla y registra hora en **UTC**.
- **Nunca** aplica la opción autoritativa en **ambos** controladores a la vez.
- Demuestra la prueba **positiva** (converge y las directivas se aplican) y la **negativa** (no se fuerza la copia en los dos).
- Reconoce el **límite**: la prueba es sobre `ad.lab.test` y no acredita una recuperación real.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre el dominio de laboratorio. **No** conectes el laboratorio a la red corporativa. **No** uses nombres ni datos de una organización real.

## Limpieza

Restablece SYSVOL al estado de la línea base (o recupera las instantáneas) y elimina la carpeta señuelo creada para la prueba.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
