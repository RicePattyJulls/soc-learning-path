# Mundo Redes: integración en la academia local

18/10/2026. Implementación local realizada por autorización del propietario. La aplicación incorpora Redes como tercer mundo educativo, con entrada desde el selector.

## Abrir

Desde una terminal del equipo:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run start
```

Deja esa terminal abierta. URL: **http://127.0.0.1:5173/#/redes/ruta**.

El servidor no quedó arrancado desde esta sesión: el entorno rechazó abrir `127.0.0.1:5173` (`listen EPERM`) y también rechazó la solicitud de ejecutar el arranque con permisos ampliados. Se pidió al propietario arrancarlo desde su terminal mientras continuaban las comprobaciones. La URL anterior corresponde al servidor configurado; no se presenta como una respuesta HTTP verificada desde esta sesión.

No se publicó ni configuró GitHub Pages.

## Experiencia integrada

- **Atlas de ocho etapas**, paisajes SVG locales, caminos, puentes, nodos, estados y progreso. Cada etapa presenta sus lecciones: 24, 20, 32, 24, 24, 16, 16 y 12.
- **168 lecciones** con lector en cinco secciones: Tu misión, Aprende, Practica, Conecta ideas y Demuestra. Mantiene tres pasos de estudio en Aprende, respuesta escrita en Practica y dos preguntas en Demuestra. La ruta utiliza las dependencias editoriales; las etapas bloqueadas se pueden explorar y los nodos explican sus requisitos.
- **Prácticas guardadas** y comparación con solución después de responder. No se autocorrigen como dominio de configuración real.
- **Evaluación de teoría:** requiere estudiar y guardar la práctica; ambas preguntas correctas para aprobar. Los intentos y elecciones se conservan al recargar. Las explicaciones se cargan aparte y se muestran después de entregar.
- **XP sin duplicación:** 5 por estudio y 15 por teoría, hasta 20 por lección. Leer no acredita ejecución de laboratorio. Una nueva revisión conserva historial previo sin trasladar automáticamente su dominio.
- **Mi progreso:** detalle por etapa, historial de intentos y exportación JSON del Mundo Redes.
- **23 recursos:** glosario, 20 guías de laboratorio y dos datasets sintéticos. Las guías siguen siendo diseños por ejecutar.
- Navegación con teclado, diálogo nativo de requisitos, enlaces de retorno al nodo, foco visible, movimiento reducido y reglas adaptables para 320 px. La geometría medida procede de las primitivas existentes; su resultado visual en navegador aún requiere ejecución.

## Contenido y componentes

| Responsabilidad | Archivos |
| --- | --- |
| Adaptador Markdown, saneado y reconstrucción | `scripts/prepare-redes.mjs` |
| Catálogo generado | `src/redes/generated/catalog.json` |
| Lecciones y soluciones separadas | `public/redes-content/` |
| Estado educativo y persistencia | `src/redes/progress.ts`, `hooks.ts`, `types.ts` |
| Presentación | `RedesApp.tsx`, `Map.tsx`, `Reader.tsx`, `LessonFrame.tsx`, `reader-presentation.ts`, `Resources.tsx`, `Markdown.tsx`, `redes.css`, `reader.css` dentro de `src/redes/` |
| Entrada compartida | `src/App.tsx`, `src/components/AcademySelector.tsx` |
| Pruebas de contrato y progreso | `tests/redes.test.ts` |
| Prueba de navegador preparada | `tests/redes-browser.mjs` |

El catálogo se generó dentro de `src/redes/generated/`, ajustando la propuesta original `src/generated/redes/`. Así se conserva el conjunto cerrado de derivados históricos sin añadir excepciones de directorio a sus guardias. La aplicación carga Redes, lector y recursos mediante imports diferidos.

El adaptador verifica hashes editoriales, lee íntegramente cada Markdown y comprueba su reconstrucción en siete secciones. Las tres pantallas de estudio, práctica y evaluación se derivan de esas secciones. El payload de estudio no contiene claves, respuesta de referencia o rúbrica de solución. Los solucionarios se sirven como archivos separados y se solicitan al contrastar o entregar; esta separación es de presentación en una aplicación estática, sin autenticación de examen en un servidor.

Regenerar solo los derivados web de Redes:

```sh
npm run prepare:redes
```

`predev`, `pretest` y `prebuild` regeneran SC-200 y Redes. El adaptador no reescribe la investigación o los Markdown de enseñanza, y no altera Splunk ni los datos del simulador. [Informe de conversión](VALIDACION-WEB-CONTENIDO.json): 168 reconstrucciones verificadas, 336 preguntas y 360 archivos derivados.

## Progreso e integridad histórica

Clave propia: `soc-learning-path:redes:learning:v1`. El motor de Redes solo lee/escribe esa clave y sincroniza pestañas; ante un almacén desconocido o corrupto conserva el original y permite continuar en memoria. No migra claves de los otros mundos.

El respaldo previo conserva 370 archivos e inventario SHA-256 en `output/redes-local-integration/20261018-173357/`. Se conservaron el subárbol `Sc200App`, catálogos, lecciones, motores, progreso, mapas y paisajes de los mundos existentes. El selector elimina además la etiqueta desactualizada «R01–R03» de Splunk.

Las guardias históricas reconocen esta extensión mediante [CONCILIACION-INTEGRACION.json](CONCILIACION-INTEGRACION.json), fijado por hash en `scripts/redes-reconciliation.mjs`. Las excepciones enumeran ruta y hashes anteriores/finales concretos para dispatcher, selector, comandos npm y tres puntos de conciliación de guardias. No se modificaron inventarios históricos ni se concedieron excepciones a motores o contenidos existentes. El verificador del simulador sigue comparando extensiones literales del dispatcher y selector.

## Comprobaciones

Registro: [VALIDACION-INTEGRACION-LOCAL.json](VALIDACION-INTEGRACION-LOCAL.json). Se verificaron 370 archivos del respaldo y 204 archivos de los mundos existentes permanecen idénticos byte a byte. Los logs completos están en `output/redes-local-integration/validacion/`.

- `npm test`: **118/118 correctas**, incluidos los siete casos de Redes, regresión de mundos anteriores, integridad histórica y generación determinista.
- `npm run build`: TypeScript estricto y Vite correctos; se genera la academia local completa.
- `node scripts/check-redes-lessons.mjs`: **5.142/5.142 correctas**.
- `python3 -B scripts/check-redes-numerical.py`: **16/16 correctas**.

Las pruebas de Redes recorren las 168 lecciones en el motor, verifican desbloqueos, 1/2 frente a 2/2 respuestas, premios únicos, intentos inmutables, conservación de datos desconocidos, separación de soluciones, Markdown sin HTML activo y representación del atlas/etapa más larga.

**Navegador: preparado, sin ejecución completa.** El arranque normal de Chromium también fue bloqueado (`setsockopt: Operation not permitted`); el conector de Chrome no encontró un navegador con DevTools activo. No se produjeron capturas ni se declara revisión visual o prueba interactiva superada. Desde una terminal con el servidor y permisos normales, puede ejecutarse:

```sh
node tests/redes-browser.mjs
```

Ese guion usa un perfil aislado y comprueba atlas, 32 nodos, ventanas de 320/768/1440 px, superposición de tarjetas, requisitos, retorno/foco, práctica, recarga, evaluación, recursos y vuelta desde Splunk. Guarda sus propios resultados y capturas en `output/playwright/redes-local/`. La comprobación numérica y de estado no sustituye esta prueba de navegador.

## Formato del lector de Splunk aplicado a Redes

18/10/2026. El mapa abre ahora la sección **Tu misión**. Se reutiliza el lenguaje visual de la academia: contenido centrado, cinco botones laterales violetas, tarjeta con borde superior turquesa, bitácora a la derecha y acceso a la fuente editorial completa. La cabecera de Redes utiliza el fondo azul de la academia. El diseño dispone de reglas específicas para móvil y movimiento reducido.

Las cinco secciones son navegación de presentación; se conservan los tres pasos de estudio, revisiones, requisitos, respuestas, intentos y premios existentes. Los textos proceden del contenido generado. Aprende evita repetir el objetivo y el encabezado que ya muestra la tarjeta. Conecta ideas reúne la aplicación profesional y la respuesta personal guardada.

Comprobaciones tras el cambio: `npm test`, **118/118 correctas**; `npm run build`, correcto. Comprobación adicional mediante renderizado de React en servidor: las siete vistas (cinco secciones, fuente y referencias), y las introducciones/contenido de aprendizaje de las 168 lecciones. El guion de navegador se adaptó al recorrido nuevo, pero continúa pendiente de ejecución; no se declara validación visual en navegador.

Respaldo anterior al cambio: `output/redes-reader-format/20261018-180533/`. Logs de esta comprobación: `output/redes-reader-format/validacion/`.
