# WAD-LAB13 — AD Recycle Bin y objeto eliminado

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-13**, de la etapa `WAD-19`. Habilitar la papelera de reciclaje es **irreversible**: ejecútala solo en un bosque descartable.

## Objetivo

**Habilitar** la papelera de reciclaje en un bosque **descartable**, **eliminar** objetos de prueba y **restaurarlos**, confirmando que conservan atributos y pertenencias. La meta es distinguir la recuperación granular de objeto de la restauración de un controlador.

## Competencia

Recuperación de objeto: habilitar la papelera, restaurar un objeto eliminado con sus pertenencias y decidir con evidencia cuándo esa vía ya no es posible.

## Nivel y prerrequisitos

Intermedio. Requiere la etapa `WAD-19` (`WAD-19-L01` a `WAD-19-L03`). Esta guía corresponde al laboratorio de referencia LAB-13.

## Preparación

- Un **bosque descartable** de laboratorio con un controlador `DC01` aislado de cualquier red de producción.
- Una **instantánea** del controlador creada antes de empezar y nombres **sintéticos** para todos los objetos.
- Usuarios y grupos de prueba, con pertenencias anotadas, para comparar antes y después.
- Registra fecha y hora en **UTC** y anota el **nivel funcional** del bosque como **línea base**.

## Tarea

1. **Habilita** la papelera de reciclaje y documenta que la acción es **irreversible** en el bosque.
2. **Registra el estado previo** de los objetos de prueba: atributos y **pertenencias**.
3. **Elimina** un objeto autorizado (un usuario o un grupo) y **observa** su estado tras el borrado.
4. **Restaura** el objeto desde la consola de administración o desde PowerShell y **confirma** que objeto y pertenencias vuelven a estar presentes.
5. **Mide** el **tiempo de recuperación** y anota la **identidad** con la que se ejecutó cada acción.
6. Comprueba la retención: explica qué ocurre cuando el objeto supera el periodo conservado.
7. Cierra con la **prueba negativa**: un objeto borrado **antes** de activar la papelera **no** se etiqueta como recuperable.

## Evidencia esperada

- Los **atributos** y las pertenencias del objeto antes y después de la restauración.
- El **tiempo de recuperación** y la **identidad** que la ejecutó.
- El **nivel funcional** del bosque y el momento en que se habilitó la papelera.
- La distinción entre un objeto **restaurado** y uno cuyo borrado ya **no** es recuperable por esa vía.

## Criterios verificables

- **Confirma** las pertenencias tras la restauración, no solo la presencia del objeto.
- Reconoce la **irreversibilidad** de habilitar la papelera y por qué solo se prueba en un bosque descartable.
- Demuestra la prueba **positiva** (el objeto vuelve con sus pertenencias) y la **negativa** (un borrado previo no es recuperable).
- **No** promete que se pueda «deshabilitar» la papelera como si fuera un cambio reversible.
- Registra hora en **UTC** y la **identidad** de cada acción.

## Autorización y límites

Todo el trabajo se realiza en un **bosque descartable** y aislado. **No** conectes el laboratorio a la red corporativa. **No** uses nombres ni datos de una organización real. Los datos son sintéticos.

## Limpieza

**Elimina** el bosque descartable completo al concluir y confirma que no queda ninguna relación con dominios reales.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
