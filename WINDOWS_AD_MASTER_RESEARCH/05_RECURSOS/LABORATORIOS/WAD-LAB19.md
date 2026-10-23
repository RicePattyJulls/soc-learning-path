# WAD-LAB19 — Purple: GPO, evidencia y retest

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-19**, de integración. El **bloque A** (hallazgo, corrección y retest) pertenece a la etapa `WAD-23` y el **bloque B** (ciclo púrpura completo con SOC contextual) a la etapa `WAD-27`. **No** se tocan administradores reales ni se ocultan cambios.

## Objetivo

**Identificar** una delegación excesiva en un laboratorio, **corregirla** con un cambio autorizado y **verificar** que el acceso queda revocado y que el evento útil de auditoría se preserva, en un ciclo que mezcla la mirada ofensiva y la defensiva.

## Competencia

Ciclo púrpura: conectar un hallazgo con su corrección y su comprobación, distinguir la ausencia de detección de la falta de auditoría y cerrar con evidencia antes y después.

## Nivel y prerrequisitos

Avanzado. El bloque A requiere la etapa `WAD-23` (`WAD-23-L01` a `WAD-23-L03`) y el bloque B, la etapa `WAD-27` (`WAD-27-L01` a `WAD-27-L03`). Esta guía corresponde al laboratorio de referencia LAB-19.

## Bloque A — Hallazgo, corrección y retest (etapa WAD-23)

### Preparación A

- Un laboratorio **aislado** con `DC01`, un puesto `Win11` y registro local o reenvío de eventos a un recopilador.
- Una **GPO inocua** preparada para el ejercicio y un **guion de cambio autorizado** con su ventana.
- Reglas de enfrentamiento y **criterio de parada** escritos; identidades de prueba con nombres sintéticos.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de la delegación como **línea base**.

### Tarea A

1. **Identifica** una **delegación excesiva** sobre un objeto señuelo y descríbela con su ruta de control y su grado de certeza.
2. **Diseña** una prueba **inocua**, acotada y reversible, dentro de la **ventana** autorizada, sin dejar persistencia (servicios, tareas ni cuentas nuevas).
3. **Corrige** la delegación con el cambio autorizado y documenta la acción y su hora.
4. **Verifica** que el acceso queda **revocado** para la identidad de prueba.
5. Comprueba en el lado defensivo que el **evento útil** se genera y se preserva; si **falta auditoría**, explícalo como causa de la ausencia de detección, en lugar de afirmar que no hubo actividad.
6. **Retesta** con la misma prueba inocua y comprueba la **ausencia de regresión** en lo que ya funcionaba.
7. Redacta el **informe**: hallazgo, evidencia antes y después, impacto, mitigación y resultado del retest.

### Evidencia A

- El **hallazgo** con su ruta de control y su grado de certeza.
- La **evidencia antes y después** con hora en UTC.
- La **corrección** aplicada y el evento de auditoría observado (o la explicación de su ausencia).
- El **informe** con el resultado del **retest** y la ausencia de regresión.

### Criterios A

- **No** afirma detección si **falta auditoría**; explica la causa de la ausencia.
- **No** usa un cambio destructivo: la prueba es **inocua** y en **ventana controlada**.
- Demuestra la prueba **positiva** (acceso revocado y evento preservado) y la **negativa** (sin auditoría no se concluye detección).
- **No** toca administradores reales ni oculta cambios; documenta todo con hora en **UTC**.

## Bloque B — Ciclo púrpura completo (etapa WAD-27)

### Preparación B

- El resultado del bloque A y el laboratorio **aislado** con `DC01`, un puesto `Win11` y el reenvío de eventos al recopilador.
- Un **catálogo de hipótesis**: actividad esperada → técnica → evento esperado → control que debería detectarla.
- Reglas de enfrentamiento y **ventana** escritos; identidades sintéticas; hora en **UTC** y **línea base**.

### Tarea B

1. Formula una **hipótesis comprobable** sobre la actividad del bloque A y anota qué evidencia la confirmaría y qué la descartaría.
2. Encadena **acción controlada → evento → respuesta esperada** y sitúa el eslabón que falla cuando no aparece el evento.
3. Descarta **falsos positivos** con una **prueba inocua** y reproducible, sin afirmar compromiso.
4. Mide la **cobertura** con una **matriz** de técnicas frente a lo realmente probado y marca cada hueco.
5. **Reduce el ruido** ajustando o excluyendo con cuidado, y **verifica** cada exclusión para no crear un punto ciego.
6. **No inventes** alertas del SIEM: cada casilla se apoya en evidencia **reproducible**.
7. Cierra con la **prueba negativa**: un control que no detecta se declara **hueco**, explicando su causa.

### Evidencia B

- La **matriz púrpura** con prueba positiva y negativa por técnica.
- Las **hipótesis** con la evidencia que las confirma o las descarta.
- Las **exclusiones** aplicadas y su verificación.
- La explicación de **límites** y de todo hueco no cubierto.

### Criterios B

- **No** declara detección sin un **evento reproducible**.
- Distingue el control que **impide**, el que **detecta** y la actividad **no observada**.
- Demuestra la prueba **positiva** (control que detecta) y la **negativa** (hueco declarado, no oculto).
- **No** inventa alertas y **no** oculta exclusiones; documenta todo en **UTC**.

## Autorización y límites

Todo se ejecuta en un laboratorio **aislado** y con **cambio autorizado**. **No** se tocan administradores reales, **no** se ocultan cambios y **no** se deja persistencia. **No** uses nombres ni datos de una organización real.

## Limpieza

**Revierte** todos los cambios del ejercicio y ejecuta las **pruebas de regresión** acordadas. Confirma que el estado coincide con la línea base.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
