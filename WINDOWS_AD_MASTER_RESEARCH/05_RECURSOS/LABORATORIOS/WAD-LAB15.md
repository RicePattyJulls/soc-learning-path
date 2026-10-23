# WAD-LAB15 — Tabletop de desastre forestal

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-15**, de la etapa `WAD-20`. Es un **ejercicio documental**: no se ejecutan acciones de recuperación sobre ningún directorio.

## Objetivo

**Ejercitar** en mesa la recuperación de un bosque a partir de un desastre: **clasificar** las copias disponibles, **elegir** la confiable, **ordenar** la recuperación del primer controlador y del dominio y **reintroducir** los servicios en la secuencia correcta.

## Competencia

Planificación de recuperación forestal: decidir con los datos de un escenario dado, ordenar dependencias (DNS, roles de maestro de operaciones, RID, contraseñas, confianzas y autoridades de certificación) y documentar la decisión y sus límites sin tocar producción.

## Nivel y prerrequisitos

Avanzado. Requiere la etapa `WAD-20` (`WAD-20-L01` a `WAD-20-L03`). Esta guía corresponde al laboratorio de referencia LAB-15.

## Preparación

- **Diagramas** de un escenario sintético: dos dominios, tres controladores y una autoridad de certificación **ficticia**; **no** se exige ninguna máquina virtual.
- **Copias de distintas fechas** del escenario (una caducada, una válida y una de origen dudoso) para forzar la clasificación.
- Una lista de **funciones** (catálogo global, roles, DNS, confianzas, CA) y de **fallos** declarados del escenario.
- Credenciales **ficticias** para el ejercicio; ningún valor real y ningún dato de una organización.

## Tarea

1. **Clasifica** las copias disponibles y **elige** la **copia confiable**; explica por qué descartas las demás.
2. Redacta el plan para **aislar** la recuperación y evitar que un controlador restaurado se replique con uno no saneado.
3. **Ordena** la recuperación del **primer controlador** y del **dominio**: qué se recupera primero y qué después.
4. Comprueba que el orden contempla **DNS**, los **roles de maestro de operaciones**, el **RID**, las **contraseñas**, las **confianzas** y la **CA**, y cierra con la **validación** de servicio.
5. Decide la **limpieza de metadatos** y la **anulación de controladores** que no se reincorporan.
6. Escribe un **runbook de crisis** y un **árbol de decisión** con los puntos donde se para y se consulta.
7. Estima **RPO y RTO** por servicio y reparte responsabilidades con una tabla **RACI**.
8. Cierra con la **prueba negativa**: rechaza reintegrar un controlador **no saneado** y rechaza «restaurar todo» sin clasificar.

## Evidencia esperada

- La **clasificación** de las copias y la justificación de la elegida.
- El **runbook de crisis** y el **árbol de decisión** con sus puntos de parada.
- El **orden de dependencias** con DNS, roles, RID, contraseñas, confianzas y CA.
- La tabla **RACI** y los **RPO/RTO** estimados por servicio.
- El rechazo explícito de reintegrar un controlador no saneado.

## Criterios verificables

- El orden de recuperación **contempla** DNS, roles, RID, contraseñas, confianzas y CA, y termina en **validación**.
- **Distingue** restaurar un dominio de restaurar el bosque completo.
- **No** ejecuta desde el tabletop el restablecimiento de `krbtgt`, la toma de roles ni la limpieza de metadatos.
- Demuestra la prueba **positiva** (el orden cubre las dependencias) y la **negativa** (se rechaza reintegrar un controlador no saneado).
- Reconoce el **límite**: un ejercicio de mesa no acredita una recuperación ejecutada.

## Autorización y límites

Ejercicio **documental**: **no** se ejecutan comandos sobre ningún directorio. **No** uses nombres, direcciones ni datos de una organización real. Las credenciales del escenario son **ficticias** y se destruyen al terminar.

## Limpieza

No aplica: es un ejercicio documental. **Destruye** las credenciales ficticias y archiva el runbook con los datos sintéticos.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
