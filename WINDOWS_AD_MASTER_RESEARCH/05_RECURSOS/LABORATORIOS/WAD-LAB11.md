# WAD-LAB11 — Diagnóstico de AD por fallos sembrados

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

**Investigar** fallos inocuos sembrados a propósito en un dominio de laboratorio, ordenando **hipótesis** y usando herramientas de **solo lectura** antes de cambiar nada. El cierre demuestra el diagnóstico diferencial, la corrección mínima de una causa y una prueba de **regresión** contra la línea base.

## Competencia

Diagnóstico integral: ordenar hipótesis de DNS, autenticación, hora, replicación y directiva, confirmar o descartar cada una con evidencia y corregir sin cambios indiscriminados.

## Nivel y prerrequisitos

Intermedio. Requiere la etapa `WAD-17` (`WAD-17-L01` a `WAD-17-L03`). Esta guía corresponde al laboratorio de referencia LAB-11.

## Preparación

- Dos controladores `DC01` y `DC02` y un equipo miembro `Win11` en una **red virtual cerrada**, en el dominio `ad.lab.test`.
- **Tres fallos inocuos** sembrados por indicación previa (por ejemplo: resolución de nombres en el cliente, desviación de hora y alcance de una directiva de grupo). Ninguno debe ser destructivo.
- Una **instantánea** de cada máquina creada antes de empezar y la **línea base** de los equipos registrada.
- Registra fecha y hora en **UTC** y anota el **síntoma** observado en cada equipo.

## Tarea

1. Registra la **línea base** y el **síntoma** de cada equipo antes de tocar nada.
2. Ordena las **hipótesis** posibles (DNS, autenticación, hora, replicación y directiva) y, para cada una, define la prueba que la **confirma** y la que la **descarta**.
3. Investiga con herramientas de **solo lectura** y anota el resultado antes de cambiar la configuración.
4. **Descarta** al menos una hipótesis y documenta por qué no se sostiene con los datos.
5. Corrige **un** cambio sembrado por vez y verifica su efecto antes de pasar al siguiente.
6. Recupera la **autenticación** o el **alcance de la directiva** de la unidad organizativa objetivo.
7. Ejecuta una **prueba de regresión** contra la línea base y confirma que el estado inicial queda restaurado.
8. **Nunca** pruebes correcciones destructivas sobre un DNS productivo; aquí todo es de laboratorio y de lectura antes de escribir.

## Evidencia esperada

- La **bitácora** de la investigación con hora en **UTC**: hipótesis, prueba, resultado.
- El **diagnóstico diferencial**: la hipótesis confirmada y la descartada.
- La corrección mínima por causa y su verificación.
- La **prueba de regresión** contra la línea base.

## Criterios verificables

- Investiga con **solo lectura** antes de cualquier cambio.
- Distingue la hipótesis **confirmada** de la **descartada** y no fuerza la conclusión.
- Corrige **una** causa por vez y verifica cada efecto.
- Demuestra la prueba **positiva** (se recupera autenticación o directiva) y la **negativa** (la hipótesis refutada no provoca cambios).
- Documenta con hora en **UTC** y reconoce qué no se pudo observar.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre el dominio de laboratorio. **Nunca** pruebes correcciones destructivas en un DNS productivo. **No** uses nombres ni datos de una organización real. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

**Revierte** los tres cambios sembrados, confirma que el estado coincide con la **línea base** y elimina los objetos de prueba creados durante la investigación.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
