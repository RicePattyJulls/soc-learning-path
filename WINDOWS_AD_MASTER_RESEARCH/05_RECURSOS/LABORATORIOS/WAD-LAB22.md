# WAD-LAB22 — Ensayo real de recuperación forestal

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **EXT-02**, avanzado y **opcional**, de la etapa `WAD-20`. Es un **ensayo** en un bosque descartable: **nunca** sobre un bosque con datos que importen.

## Objetivo

**Ensayo real** (en un bosque descartable y aislado) de la recuperación de un bosque desde una copia confiable hasta un controlador funcional: aislar, restaurar el primer controlador, recuperar sus servicios y **validar** que el bosque vuelve a autenticar.

## Competencia

Recuperación forestal ejecutada de principio a fin: elegir la copia confiable, aislar la recuperación, ordenar las dependencias y validar el servicio sin declarar éxito donde no se ha medido.

## Nivel y prerrequisitos

Avanzado y **opcional**. Requiere la etapa `WAD-20` (`WAD-20-L01` a `WAD-20-L03`). Esta guía corresponde al laboratorio de referencia EXT-02.

## Preparación

- Un **bosque descartable** de laboratorio (uno o dos dominios) con al menos un controlador, **aislado** de cualquier red de producción.
- **Copias confiables** del escenario (alguna caducada y alguna válida) y una **instantánea** de las máquinas como red de seguridad.
- Un almacenamiento de respaldo separado y una identidad de recuperación **custodiada**; su valor **no** se documenta.
- Registra fecha y hora en **UTC** y anota el **estado inicial** del bosque como **línea base**.

## Tarea

1. **Clasifica** las copias y **elige la confiable**; explica por qué descartas las demás.
2. **Aísla** la recuperación para evitar que un controlador restaurado se replique con uno no saneado.
3. **Restaura** el primer controlador desde la copia elegida y ponlo en servicio en **aislamiento**.
4. **Recupera las dependencias** en orden: **DNS**, roles de **maestro de operaciones**, **RID** y contraseñas de cuentas críticas.
5. **Verifica SYSVOL** y, cuando corresponda, la secuencia de **confianzas** con el segundo dominio.
6. Decide la **limpieza de metadatos** de los controladores que no se reincorporan.
7. **Valida el servicio**: el bosque vuelve a autenticar y las directivas se aplican. **Mide** el **RTO observado**.
8. Cierra con la **prueba negativa**: **no** reincorporar un controlador **no saneado** ni «restaurar todo» sin clasificar.

## Evidencia esperada

- La **clasificación** de las copias y la justificación de la elegida.
- El orden de recuperación con **DNS**, roles, RID, contraseñas, SYSVOL y confianzas.
- La verificación de **servicio** (autenticación y directivas) y el **RTO observado**.
- La decisión de **limpieza de metadatos** y la prueba negativa sobre un controlador no saneado.

## Criterios verificables

- **Mide** y **valida** el servicio tras recuperar, no solo el arranque del controlador.
- **No** conecta el controlador restaurado a la red de producción durante el ensayo.
- Demuestra la prueba **positiva** (el bosque vuelve a autenticar) y la **negativa** (no se reincorpora un controlador no saneado).
- Reconoce el **límite**: es un ensayo en un bosque descartable y no acredita una recuperación de producción.

## Autorización y límites

**Ensayo** sobre un bosque **descartable** y **aislado**. Las operaciones de alto impacto —restauración, toma de roles y limpieza de metadatos— se ejecutan **solo** aquí. **No** uses nombres ni datos de una organización real.

## Limpieza

**Destruye** el bosque de ensayo tras exportar las evidencias y confirma que ninguna máquina restaurada quedó conectada a una red real.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
