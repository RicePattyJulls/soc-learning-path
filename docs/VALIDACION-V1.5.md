# Validación de SOC Learning Path V1.5

## Qué se ha ejecutado

- Auditoría de V1 antes de implementar, con copia de sus metadatos como fixture de compatibilidad. La carpeta instalada permaneció en V1 durante las pruebas iniciales.
- `SOC_EDUCATION_PHASE=pilots npm run verify`: **28 pruebas aprobadas**, TypeScript estricto y compilación Vite correctos. Después, `node tests/e2e.mjs` ejecutó Playwright/Chromium sobre el build: **10 grupos aprobados**, los tres pilotos y sus **12 actividades** respondidas mal y bien. Informe: `output/playwright/v15-pilots-results.json`.
- Después de validar los pilotos, `npm run verify`: **28 pruebas aprobadas**, TypeScript y build correctos con **9 lecciones y 35 actividades revisadas**. `node tests/e2e.mjs`: **11 grupos aprobados**, las 35 actividades probadas mal y bien y los 76 originales y guías inspeccionados. Informe: `output/playwright/v15-full-results.json`.
- Chromium no registró errores de página ni peticiones externas. No se instalaron nuevas dependencias. Los avisos informativos de `use client` de Lucide no impiden compilar.

## Instalación definitiva comprobada

La versión comprobada está instalada en `/home/tommy/Documentos/SOC_LEARNING_PATH`. `npm test` ejecutado allí: **28 pruebas aprobadas**. Se compararon los archivos de código, scripts, tests y build con la copia preparada: ninguna diferencia ni archivo ausente. El `AGENTS.md` existente conserva su huella y no se ha sobrescrito.

`node tests/e2e.mjs --base-url http://127.0.0.1:5173/`, ejecutado desde ese directorio contra el servidor real: **11 grupos aprobados y 35 actividades verificadas**. El informe incluye directorio y URL comprobados. Se sirvió el build con Python en loopback, sin publicación. La copia local anterior de los archivos está en `/tmp/soc-learning-path-v1-backup` (temporal; no es una copia del LocalStorage del estudiante).

## Garantías comprobadas

Las pruebas de contenido comprueban los 13 capítulos y los 76 IDs/versiones de V1, la partición íntegra del Markdown saneado, las citas exactas de todas las preguntas, las soluciones y la presencia de los 29 bloques de código. Una cita que ya no existe hace fallar la preparación.

Las pruebas de lógica cubren requisitos, estados, intentos, corrección, premios únicos, 100 repeticiones sin XP ilimitado, revisiones educativas, fusión entre pestañas y almacenamiento corrupto. Una migración de toda V1 mantiene 76 finalizaciones y 3200 XP, sin inventar dominios. La escritura V1.5 nunca modifica ni borra la clave V1.

En el navegador se probaron apertura sin XP, estudio, corrección con explicación y fundamento, reintentos, resumen, evaluación fallida y aprobada, dominio, repaso, recarga, bonus y desbloqueo del segundo capítulo, exportación real de JSON, originales, búsqueda, filtros, teclado, movimiento reducido, pantallas de 320/390 px y almacenamiento no disponible. Los contextos de pruebas son aislados: no se usa ni borra el progreso del navegador del estudiante.

Las 76 lecturas completas y el primer paso guiado de cada una se inspeccionaron en el navegador. Las referencias y los 719 pasos se validaron en las pruebas de contenido; no se afirma haber pulsado manualmente cada uno de los 719 pasos. Todos los formatos evaluables sí se han ejercitado por sus controles reales.

## Reproducción

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run verify
npm run test:browser
```

Requiere Node 22.12+ y Chromium (`CHROMIUM_PATH` permite otra ruta). La suite abre su propio servidor y contextos temporales. Para usar una academia ya abierta: `node tests/e2e.mjs --base-url http://127.0.0.1:5173/`. `BROWSER_BASE_URL=http://127.0.0.1:5173/ node tests/e2e.mjs` permite verificar una instancia existente. Para aislar los tres pilotos: `SOC_EDUCATION_PHASE=pilots npm run verify`, seguido de la suite de navegador. Regresa a la versión completa con `npm run verify`.

El entorno de esta sesión permite compilar en `/tmp`; Vite no puede abrir su servidor de desarrollo aquí. Se entrega la compilación comprobada en el directorio solicitado y se sirve localmente con Python. Las instrucciones de arranque están en `README.md`. `docs/VALIDACION.md` y `tests/native-browser.js` documentan el arnés histórico de V1; la suite actual es `tests/e2e.mjs` → `tests/browser.mjs`.

## Límites y trabajo pendiente

67 lecturas tienen estudio guiado, sin práctica/evaluación pedagógica revisada. No se les concede dominio. La revisión semántica de nuevas actividades sigue siendo necesaria: verificar una cita no demuestra automáticamente la calidad didáctica de una pregunta. La exportación guarda una copia local; aún no hay una interfaz de importación. No se ha realizado una auditoría formal con lectores de pantalla ni una medición de rendimiento en hardware móvil físico. El movimiento usa transformaciones/opacidad breves y se ha comprobado con preferencia reducida en Chromium.

Splunk continúa reservado. No hay equivalencias, laboratorio, backend, autenticación ni publicación. `SC-200.md` conserva SHA-256 `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`.
