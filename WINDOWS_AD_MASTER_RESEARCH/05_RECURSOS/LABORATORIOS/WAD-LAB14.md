# WAD-LAB14 — DC, System State y restauración no autoritativa

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-14**, compartido por las etapas `WAD-18` (bloque A) y `WAD-19` (bloque B). Es una operación de **alto impacto**: solo se ejecuta en una rama aislada y con respaldo recuperable.

## Objetivo

**Preparar** y **verificar** el respaldo del estado del sistema de un controlador (bloque A) y **ensayar** su restauración no autoritativa hasta comprobar que el controlador arranca, SYSVOL queda correcto y la replicación converge (bloque B).

## Competencia

Recuperación de controlador: distinguir el respaldo del estado del sistema de la copia completa, ejecutar una restauración no autoritativa en un entorno desechable y verificar la convergencia sin declarar integridad donde no se ha medido.

## Nivel y prerrequisitos

Avanzado. El bloque A requiere la etapa `WAD-18`; el bloque B, la etapa `WAD-19`. Esta guía corresponde al laboratorio de referencia LAB-14.

## Bloque A — Respaldo del estado del sistema (etapa WAD-18)

### Preparación A

- Dos controladores `DC01` y `DC02` en una **red virtual cerrada** y un **clon aislado** de la red de producción.
- Un almacenamiento de respaldo separado y una **instantánea** de cada controlador como red de seguridad.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de la replicación como **línea base**.

### Tarea A

1. **Crea** un respaldo del **estado del sistema** de `DC01` y guarda el **acta** con su identificador, su hora en UTC y el alcance.
2. Distingue por escrito qué incluye esa copia y qué **no** incluye frente a una copia de **servidor completo**.
3. **Verifica** que la copia es legible y está íntegra, y anota cómo se **custodia**.
4. Estima el **RTO** del escenario y **no** declares una recuperación probada mientras no se haya restaurado.

### Evidencia A

- El **acta** del respaldo con su identificador y su hora en UTC.
- La comparación entre **estado del sistema** y **servidor completo**.
- La comprobación de que la copia es legible y su nota de custodia.
- El **RTO** estimado y el límite declarado de la conclusión.

### Criterios A

- Distingue las dos clases de copia por su **alcance**, no por su tamaño.
- **Mide** y **verifica** la copia en lugar de suponerla.
- Reconoce que una copia sin prueba de restauración **no** demuestra recuperación.

## Bloque B — Restauración no autoritativa (etapa WAD-19)

### Preparación B

- La **rama restaurada** de `DC01` en una máquina virtual **desechable**, apartada de `DC02` y de la red de producción.
- La **contraseña de recuperación DSRM** custodiada y disponible solo para el ejercicio; su valor **no** se documenta.
- Confirmación de que existe un respaldo **recuperable** y que `DC02` está sano antes de empezar.

### Tarea B

1. **Inicia** `DC01` en el **modo de restauración de servicios de directorio** usando la credencial de recuperación custodiada.
2. **Aplica** la **restauración no autoritativa** del estado del sistema y deja que el controlador termine de arrancar.
3. Comprueba que el **controlador restaurado inicia** y que **SYSVOL** queda correcto.
4. **Verifica la convergencia** con `DC02` (controlador sano) mediante la comprobación de salud y el resumen de replicación, y anota el **RTO observado**.
5. Describe qué **divergencia** aparecería si se restaurara una instantánea sin completar la restauración no autoritativa.
6. Cierra con la **prueba negativa**: comprueba que una restauración de imagen manual o un **backup caducado** debe **rechazarse**.

### Evidencia B

- El **arranque** del controlador restaurado y el estado de **SYSVOL**.
- La comprobación de salud y el **resumen de replicación** posteriores, con el **RTO observado**.
- La identificación del **backup** usado y el motivo por el que se aceptó.
- La explicación de la **divergencia** que se evita y la prueba negativa.

### Criterios B

- Verifica **SYSVOL** y la **convergencia de replicación** tras restaurar, no solo el arranque.
- **No** restaura instantáneas en **ambos** controladores a la vez.
- **Nunca** ejecuta la operación fuera de la **rama aislada** ni sin respaldo recuperable.
- Demuestra la prueba **positiva** (el controlador converge) y la **negativa** (un backup caducado se rechaza).

## Autorización y límites

**Operación de alto impacto.** **No** se ejecuta sin **aislamiento** y sin un respaldo recuperable. El bloque B se realiza solo en máquinas **desechables**, con instructor, y **nunca** contra la red de producción.

## Limpieza

**Apaga** y **destruye** la rama restaurada después de exportar las evidencias. Confirma que `DC01` y `DC02` originales conservan su estado.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
