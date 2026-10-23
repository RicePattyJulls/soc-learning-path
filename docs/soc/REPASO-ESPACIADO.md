# Mundo SOC · Repaso espaciado

Modo de repaso del Mundo SOC (`#/soc/repaso`). No hay fases, rachas ni
desbloqueos: es una **cola derivada del progreso guardado**, sin estado de
sesión. Todo vive en la misma clave `soc-learning-path:soc:learning:v1`.

## Cuándo se programa un caso

Un caso entra en la cola **solo cuando su rúbrica está completa** (una banda
0/1/2 por cada criterio). Marcar criterios sueltos no programa nada.

La banda sale de la puntuación real del caso:

| Puntuación | Banda | Vuelve |
|---|---|---|
| ≥ 75 % | `good` | 1 → 3 → 7 → 16 → 35 días |
| ≥ 50 % y < 75 % | `partial` | mañana |
| < 50 % | `weak` | hoy |

Estados visibles asociados (`statusFor`): dominado · casi dominado · repasar.

## Reglas de reprogramación

`src/soc/schedule.ts` (`scheduleFrom`) es el único sitio donde se decide la
fecha. Un veredicto nuevo **solo reprograma si el caso ya toca o si empeora**:

- **Ya toca** (o nunca se programó): se recalcula.
- **Misma banda y aún no toca**: no se toca nada. Volver a marcar lo mismo el
  mismo día no estira el intervalo.
- **Banda mejor y aún no toca**: tampoco adelanta la fecha. Para subir de
  intervalo hay que dejar pasar el tiempo y resolver el caso de nuevo.
- **Banda peor y aún no toca**: sí lo devuelve antes (hoy o mañana).

Con eso, editar la rúbrica criterio a criterio no reescribe la fecha en cada
clic: los pasos intermedios (75 % → 50 % → 25 %) solo bajan cuando de verdad
empeoran el veredicto.

El intervalo de un acierto encadenado es `INTERVALS = [1, 3, 7, 16, 35]` días,
indexado por la racha (`streak`) y saturado en 35 días. `lapses` cuenta solo las
caídas desde una banda `good` a una peor, y no se cuenta dos veces.

## Cola y vistas

`src/soc/review.ts` deriva todo:

- `dueItems(store, now)`: casos con `review.due <= now`, ordenados del más
  atrasado al más reciente (empate por id).
- `upcomingItems(store, now)`: programados para después, ordenados por fecha.
- `upcomingByDay(items)`: agrupa los próximos por días restantes.
- `reviewOverview(store, now)`: vencidos, próximos, programados y sin programar.

`Review.tsx` pinta la cola de hoy, el botón **Empezar repaso** (abre el caso más
atrasado), el calendario de próximos y las reglas. Un caso resuelto sale de la
cola solo, así que «empezar repaso» siempre apunta al siguiente que toca. La
insignia del menú (`Repaso`) muestra cuántos tocan hoy. Al pie del caso y en
`#/soc/progreso` se enlaza la cola.

## Reiniciar no puede resucitar

`Reiniciar el caso` es un corte duro. `applyAction('reset')` limpia respuesta,
revelado, rúbrica y programación, y sella `record.resetAt = now`.

La fusión entre pestañas (`mergeStores` → `mergeRecord`) es monótona para no
perder avance, y por eso **un dato escrito en o antes de `resetAt` se descarta**
al fusionar (`after(stamp) = stamp > resetAt`). Sin esa regla, la copia antigua
del almacén resucitaba lo borrado y el botón parecía no hacer nada.

## Compatibilidad

`review` y `resetAt` son campos añadidos al registro de caso. `validateStore`
acepta progreso guardado sin ellos y lo normaliza (`emptySchedule()` y `0`), así
que el progreso anterior al modo repaso sigue siendo válido. No se cambió
`schemaVersion`.

## Comprobaciones

- `tests/soc.test.ts` (8 pruebas): programación por bandas, no inflar el
  intervalo, fallo contabilizado una vez, cola ordenada, tolerancia a progreso
  previo y el reinicio que gana a la fusión.
- `SOC/tools/soc-pass.mjs` (51 comprobaciones): cola vacía con próximo aviso,
  filtro desde la URL, veredicto flojo que entra en la cola hoy, insignia,
  «empezar repaso» y caso que sale de la cola al mejorar.
