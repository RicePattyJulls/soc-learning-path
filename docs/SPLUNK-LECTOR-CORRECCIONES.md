# Correcciones puntuales del lector Splunk

17/10/2026. Exclusivamente navegación de pasos y título repetido. Sin cambios de diseño, SC-200, mapas, río R02, contenidos, motores educativos, XP o persistencia.

## Diagnóstico y correcciones

**Reanudación y navegación eran dos intenciones mezcladas.** `go('estudio')` elegía siempre el primer apartado no estudiado: con 1–3 vistos, elegía el 4. Lo hacía también al pulsar Aprende o regresar desde otra etapa, aunque se estuviera revisando el paso 1. El botón de avance de un apartado ya utilizaba el índice visible + 1; no contiene una rama que pase directamente de 1 a 4.

Ahora:

- La entrada sin paso explícito puede reanudar el primer pendiente. Tu misión anuncia el destino del CTA «Continuar aprendiendo»; con tres estudiados, el 4.
- Una selección explícita `paso=1…5` siempre prevalece sobre el progreso.
- Aprende conserva el último paso seleccionado en esa lección durante la sesión; si no hay selección previa, empieza por el 1. El CTA de reanudación es una acción explícita distinta.
- Continuar recorre 1 → 2 → 3 → 4 → 5, incluso al releer apartados ya estudiados. Anterior, índice, regreso desde otras etapas y recarga de una URL explícita conservan el contexto y los pasos vistos.
- El recuerdo de selección es un `ref` del lector, sin campos, claves ni migraciones de almacenamiento nuevos. Reutiliza el patrón SC-200 de seleccionar un índice y avanzar desde el índice visible, con foco en el encabezado.

**El título estaba representado dos veces:** `<h2>{section.title}</h2>` y el primer encabezado del Markdown. Se conserva el `<h2>` de la tarjeta, su estilo y foco; `SplunkMarkdown` recibe una opción local que omite exclusivamente ese primer nodo de encabezado al renderizar la sección. El texto Markdown original se pasa íntegro, sin recortarlo ni editarlo. Subtítulos, código, tablas, fuente completa, resumen y recursos mantienen su representación normal.

## Verificación

- Respaldo previo: [inventario verificable](../output/splunk-reader-fixes/respaldo/inventario.json), 278 copias. Protege adicionalmente 478 archivos de código/datos y paquetes previos frente al inicio de esta corrección.
- TypeScript, unitarias y build: resultados finales en el [informe offline](../output/splunk-v122/ultima-offline.json). **88/88 pruebas**, con comprobaciones dirigidas de selección explícita frente a reanudación, título único en las 90 secciones y conservación del Markdown/cuerpo completo.
- Las guardias históricas siguen activas; se actualizan únicamente los pares exactos de hashes de las dos presentaciones autorizadas. No se editan inventarios anteriores ni se excluyen contenidos o motores.
- El cierre [cierre.json](../output/splunk-reader-fixes/cierre.json) registra hashes, copias, archivos afectados y resultados.

**Navegador pendiente, sin PASS atribuido.** Vite devolvió `listen EPERM`. El conector de Chrome no encontró un navegador. La ejecución real del runner Playwright terminó `blocked_browser_launch` por `setsockopt: Operation not permitted`/SIGTRAP, antes de cualquier escenario. [Resultado del intento](../output/playwright/splunk-reader-fixes/2026-10-16T22-51-01-730Z/resultados.json). No se repite el mismo arranque bloqueado ni se solicitan permisos globales.

La prueba dirigida preparada cubre, a 390 y 1440 px, las cinco etapas y cinco pasos con un perfil nuevo y otro sintético con 1–3 estudiados: avance consecutivo, Aprende sin salto, retorno desde otras etapas, reanudación explícita al 4, Anterior, índice, recarga, título único y conservación de estudio/XP existentes. Nunca usa el perfil personal.

## Ejecutar solo esta comprobación en Parrot

Terminal A:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node tests/splunk-reader-fixes-browser.mjs --base-url http://127.0.0.1:5187/
```

Revisar el nuevo `output/playwright/splunk-reader-fixes/<fecha>/resultados.json` y sus capturas. Un resultado bloqueado o fallido no valida navegación. Esta prueba no ejecuta la suite del atlas ni requiere tocar sus defectos pendientes.

Corrección detenida aquí, sin commits ni publicación.
