# Auditoría previa a V1.5

## Base conservada

- React 19 + TypeScript estricto + Vite, Tailwind y Lucide; sin backend ni autenticación.
- `scripts/content.mjs` recorre todo el archivo con remark/GFM, sanea datos y divide H1/H2 conservando el Markdown por intervalos. La reconstrucción exacta es obligatoria.
- Catálogo: 13 capítulos, 76 lecturas, 154 encabezados y 29 bloques de código. El origen no se modifica. IDs y versiones se han fijado en `tests/fixtures/v1-catalog.json` como prueba de compatibilidad.
- Navegación por hash con enlaces de capítulo, lectura y subapartado; búsqueda por texto; mapa independiente del lector; original Markdown seguro y panel Splunk reservado.
- V1: 25 XP por lectura marcada, 100 por capítulo, un nivel cada 250 XP. El desbloqueo exige completar todos los capítulos anteriores. No existe dominio evaluado.
- El guardado V1 usa `soc-learning-path:progress:v1`, con IDs/versiones y última lectura. La V1 lo reescribe al cargar. V1.5 debe leerlo sin modificarlo y guardar sus datos en otra clave.
- Pruebas existentes: contenido real, partición/saneado, IDs, código, progreso y XP; suites de navegador sobre producción. Las expectativas del antiguo botón de lectura deben evolucionar junto al nuevo flujo, conservando sus garantías de persistencia, bloqueos, originales, accesibilidad y móvil.

## Evolución prevista

1. Conservar el compilador y el lector, añadir un modelo educativo por datos y un generador de pasos a partir del árbol Markdown.
2. Validar tres pilotos: Licencia y onboarding (teoría), Modelos y scopes (comparación) y Tabla (procedimiento de ingesta).
3. Extender los pasos a las 76 lecturas. Incorporar actividades adicionales solo con referencias comprobadas; marcar honestamente las lecturas pendientes de enriquecimiento.
4. Mantener los IDs y el guardado V1 intactos. Las finalizaciones anteriores siguen contando como completadas y conservan XP/desbloqueos; no se convierten automáticamente en dominio.
5. Separar completada de dominada, guardar intentos y errores, y limitar cada recompensa a una concesión por lección y tipo de logro. Los XP de V1 actúan como suelo por lectura y por capítulo.

## Dirección de interfaz

Se mantienen azul #12294F, tinta #172D51, niebla #F3F6FC, violeta #7546D7, verde #0B886C y oro #EABB53. La tarjeta central enseña una actividad cada vez; un índice de fases y una barra muestran el recorrido. El panel Splunk permanece reservado. La navegación será accesible por teclado; el feedback breve respetará movimiento reducido. El modo original seguirá disponible por URL.
