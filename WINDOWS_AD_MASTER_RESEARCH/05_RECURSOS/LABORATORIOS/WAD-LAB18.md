# WAD-LAB18 — Sysmon / WEF: visibilidad y huecos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-18**, de tipo soc, de la etapa `WAD-26`. **No** se aplica recolección de datos personales y todo se revierte en una máquina desechable.

## Objetivo

**Diseñar** los sensores de un puesto y el **reenvío** de eventos hacia un recopilador, y **demostrar** con evidencia qué queda visible y qué **huecos** existen, sin prometer cobertura que no se ha probado.

## Competencia

Recolección y visibilidad: configurar Sysmon con filtros, montar el reenvío (WEF/WEC) y verificar en destino que un evento llega con su origen e intervalo, reconociendo los límites por permisos o filtrado.

## Nivel y prerrequisitos

Avanzado. Requiere la etapa `WAD-26` (`WAD-26-L01` a `WAD-26-L03`). Esta guía corresponde al laboratorio de referencia LAB-18.

## Preparación

- Un puesto `Win11` y un **servidor recopilador** en una **red virtual cerrada**; **no** se conecta a la red corporativa.
- Una **configuración mínima** de recolección y una **fuente de evento inocuo** aprobadas de antemano.
- Los registros se **protegen** y **no** se recogen datos personales.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de la recolección como **línea base**.

## Tarea

1. **Instala y configura** un sensor (Sysmon) con **filtros** mínimos y documenta qué cubre y qué deja fuera.
2. **Crea una suscripción** de reenvío de eventos (**WEF/WEC**) entre el puesto y el recopilador, y comprueba el **transporte**.
3. **Genera un evento inocuo** en el origen y **demuestra** que aparece en el **destino** con su origen y su intervalo verificables.
4. **Registra** el evento **original** y el **reenviado**, con hora en **UTC** y una nota de **integridad**.
5. **Introduce un filtro deliberado** y comprueba que el evento deja de llegar: esto demuestra un **límite de visibilidad**, **no** la ausencia de la acción.
6. Lista los **huecos** por permisos o filtrado y explica su causa.
7. Cierra con la **prueba negativa**: un evento ausente **no** se declara como acción no ocurrida.

## Evidencia esperada

- La **configuración del sensor** con sus filtros y su alcance.
- La **suscripción** de reenvío y la solicitud de comprobación del transporte.
- El evento **original** y el **reenviado**, con hora en **UTC** y nota de integridad.
- El **hueco** demostrado por filtrado y su interpretación correcta.

## Criterios verificables

- **Demuestra** en destino el evento generado en origen, con origen e intervalo verificables.
- Distingue un **límite de visibilidad** de la **ausencia de una acción**.
- **No** promete cobertura sin prueba ni **extrapola** un evento aislado.
- Demuestra la prueba **positiva** (evento llega) y la **negativa** (el filtrado oculta; no prueba que no ocurrió).
- **No** recoge datos personales y registra hora en **UTC**.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y en una máquina **desechable**. **No** se recogen datos personales. **No** uses nombres ni datos de una organización real.

## Limpieza

**Revierte** las suscripciones y los sensores en la máquina desechable y confirma que el estado coincide con la línea base.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
