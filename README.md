# SOC Learning Path · V2.5

Versión **0.2.5**. Las **13 regiones tienen paisajes premium diferenciados**: terreno, horizonte, vegetación, arquitectura y agua compartidos mediante configuración visual. Se conserva el atlas panorámico y el recorrido vertical móvil. La navegación mantiene selector persistente, estados claros, retorno al nodo con el historial del navegador y feedback breve de navegación, actividades y recompensas reales.

Consulta [el estado para retomar](docs/RETOMAR.md), [la entrega educativa V2.5](docs/V2.5-ACADEMIA.md), [Premium World](docs/V2.3-PREMIUM-WORLD.md) y [Premium Experience](docs/V2.4-PREMIUM-EXPERIENCE.md). Conserva 13 capítulos, 76 lecturas y 719 pasos. Hay **74 lecturas con 272 actividades**: 35 originales intactas y 237 nuevas. Se enriquecen 65 de las 67 lecturas pendientes; las introducciones de workloads y KQL quedan pendientes de revisión por falta de desarrollo técnico propio evaluable. **No se declara cobertura educativa completa.** La revisión semántica es del agente contra SC-200.md, no humana ni independiente. Capturas actuales: `output/playwright/v25-final/index.html`; comparación histórica: `output/playwright/v24-premium-world/index.html`.

El selector de región está antes del atlas; cada región tiene selección directa y enlaces anterior/siguiente. Las regiones bloqueadas permiten ver su mapa e índice, conservando los prerrequisitos de lectura. El retorno del lector sigue restaurando foco y posición en el nodo correspondiente.


## Recorrer el mapa

1. En **Ruta**, pulsa una región del atlas para acercarte a su paisaje.
2. Dentro de la región, pulsa un nodo de lectura. El candado explica los requisitos de las regiones que aún no están disponibles.
3. Estudia y practica. **Volver al mapa de la región** devuelve el foco y la vista al nodo de esa lectura.
4. Regresa al atlas con **Volver al mapa del mundo**. También puedes elegir un capítulo con el selector de regiones.

Hay 75 lecturas dentro de los 13 capítulos y una apertura independiente, accesible desde el libro del campamento. Los cofres y las insignias enlazan al progreso real; no conceden premios adicionales. Los colores de región son decorativos: los textos y las marcas muestran el estado educativo.

La piloto se conserva como referencia de acabado. Los nuevos biomas se componen con capas y símbolos SVG locales reutilizados, sin motores 3D ni nuevas dependencias. La documentación V2 conserva el origen del mapa y su compatibilidad: [docs/V2-VISUAL.md](docs/V2-VISUAL.md) y [docs/v2-compatibility.json](docs/v2-compatibility.json).

## Aprender y practicar

1. En **Ruta**, abre una etapa disponible. **Empezar mi aventura** lleva a la primera lección interactiva disponible; los demás apartados siguen en el índice.
2. Recorre **Aprende** y confirma cada paso. Las tablas se presentan como tarjetas; puedes desplegar el contexto completo.
3. En las lecciones con actividades revisadas, responde en **Practica**. Equivocarte muestra la explicación y su cita; puedes intentarlo de nuevo.
4. Finaliza **Conecta ideas** para completar la lección. **Demuestra** evalúa la comprensión: necesitas un 80%. La primera respuesta cuenta en cada intento.
5. Consulta **Repaso** para revisar errores y lecciones pendientes de dominio. En **Mi progreso** puedes exportar una copia local del avance.

**Ver mis apuntes originales** abre la lectura completa, sin transformaciones educativas adicionales, conservando el saneado de privacidad de V1. Abrirla no concede XP.

Ejemplo: [Licencia y onboarding](http://127.0.0.1:5173/#/leccion/capitulo-1-licencia-y-onboarding%2F1-licencia-y-onboarding-1). Su misión, práctica y evaluación están respaldadas por el apartado original. La cobertura detallada está en [docs/V1.5.md](docs/V1.5.md) y [docs/education-coverage.json](docs/education-coverage.json).

## Abrir la academia

Requisitos: Node.js 22.12 o posterior y npm. Las dependencias ya están instaladas en esta entrega.

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev
```

Abre **http://127.0.0.1:5173**. En una instalación nueva, ejecuta primero `npm ci`. El contenido se prepara automáticamente antes de desarrollo y compilación.

También puedes servir la compilación ya preparada con Python 3:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
python3 -m http.server 5173 --bind 127.0.0.1 --directory dist
```

Usa el mismo navegador, dirección y puerto para recuperar tu progreso. `localhost`, `127.0.0.1` y otros puertos tienen almacenamientos diferentes. No abras `dist/index.html` mediante `file://`: el lector carga archivos JSON locales mediante HTTP.

Las pruebas de esta entrega sirven `dist` con Python y utilizan contextos de navegador aislados. Si el puerto 5173 ya está ocupado por esa vista previa, detén ese servidor antes de iniciar otro en el mismo puerto.

## Ubicación del proyecto

La instalación definitiva está en **`/home/tommy/Documentos/SOC_LEARNING_PATH`**, con código, dependencias, contenido generado, compilación y resultados de pruebas. No necesita la copia de preparación de `/tmp` para ejecutarse.

El directorio original de SC-200 solo se utiliza para leer `SC-200.md` y las skills enlazadas. El archivo original conserva su SHA-256 y no se ha modificado ningún otro proyecto. Las pruebas unitarias también se han ejecutado desde la ubicación definitiva.

## De dónde sale la ruta

Origen por defecto, leído sin escribirlo:

```text
/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md
```

La versión actual produce **13 capítulos, 76 lecturas y 154 encabezados**, con 29 bloques de código. El compilador recorre el documento completo mediante un árbol Markdown:

- Cada `#` crea un capítulo, conservando título y orden.
- Cada `##` crea una lectura. Los niveles inferiores conservan su jerarquía y tienen enlaces a sus subapartados.
- El texto inicial de un capítulo se conserva como lectura con el título del propio capítulo. Los capítulos sin `##` se leen completos.
- El texto anterior al primer capítulo aparece como “Apertura del documento”: es una etiqueta de navegación, no un capítulo técnico inventado.

Las lecturas concatenadas deben coincidir exactamente con el Markdown saneado; la preparación falla si hay pérdidas o duplicaciones. Cada lectura conserva líneas de origen y una huella SHA-256. El inventario generado está en [docs/CONTENIDO.md](docs/CONTENIDO.md) y la auditoría en [docs/content-audit.json](docs/content-audit.json).

Para utilizar otro archivo o regenerar después de editar tus apuntes:

```sh
SC200_SOURCE=/ruta/SC-200.md npm run build
```

Si no existe el archivo, el proceso se detiene. Nunca se escribe en el origen ni se consultan fuentes externas para completar las explicaciones.

## Progreso y gamificación

Todas las lecturas de la primera etapa están disponibles. Al completarlas se desbloquea la siguiente; las etapas bloqueadas permiten ver su índice. La lectura de apertura es independiente.

Los estados son **no iniciada**, **en curso**, **completada** y **dominada**. Completar el estudio no implica dominarlo. Las 76 lecturas tienen estudio guiado; solo las lecciones con práctica y evaluación revisadas permiten demostrar dominio.

Los premios son únicos por lección: estudiar todos los pasos **5 XP**, resolver toda la práctica **5 XP**, finalizar el resumen **5 XP**, aprobar **15 XP**, demostrar dominio **15 XP** y repasar correctamente **5 XP**. Máximo **50 XP** en una lección con actividades y **10 XP** en estudio guiado. Cada capítulo terminado aporta **100 XP** una sola vez; cada **250 XP** subes de nivel. Abrir, repetir o recargar no multiplica premios.

La clave V1 `soc-learning-path:progress:v1` se lee pero **nunca se escribe ni se borra**. Sus finalizaciones, desbloqueos y XP se conservan como mínimo histórico de 25 XP por lectura; no se suman dos veces a los nuevos premios. V1.5 utiliza `soc-learning-path:learning:v2`, con pasos, respuestas, intentos y revisiones. Conserva el historial al cambiar una lección; demostrar dominio en una nueva revisión requiere evaluarse de nuevo. Los datos corruptos no se sustituyen automáticamente. Hay avisos y exportación del avance en memoria si el almacenamiento falla.

## Privacidad y referencias

La copia generada oculta patrones de credenciales, tokens, correos, identificadores y direcciones personales. La versión actual contiene un correo que se ha sustituido por un marcador. Los informes registran categoría y línea, nunca el valor oculto. Revisa las reglas si introduces nuevos tipos de información sensible.

No se copia el archivo original, archivos vecinos ni recursos sin verificar a `public/`. Los 69 enlaces externos se conservan y se abren solo al pulsarlos. En esta fuente no hay imágenes ni enlaces de Obsidian. Si aparecen en futuras versiones, se registrarán como pendientes; no se descargarán automáticamente. El HTML de los apuntes no se ejecuta; únicamente se interpretan saltos `<br>`.

## Comprobaciones

```sh
npm test                  # Contenido real, partición, saneado, versiones, bloqueos y XP
npm run build             # Preparación, TypeScript estricto y compilación de producción
npm run test:browser      # Regresión educativa V1.5 con Chromium local
npm run test:visual       # Atlas, 13 regiones, nodos, móvil y teclado
npm run test:premium      # Regresión heredada de geometría y navegación
node tests/e2e.mjs --world --base-url http://127.0.0.1:5173/
node tests/e2e.mjs --experience --base-url http://127.0.0.1:5173/
node tests/e2e.mjs --full-width --base-url http://127.0.0.1:5173/
```

`CHROMIUM_PATH` permite indicar otro ejecutable. La suite de navegador sirve el build en un puerto libre. También admite `BROWSER_BASE_URL` para usar un servidor existente y `BROWSER_CDP_URL` para un Chromium de pruebas ya arrancado.

Los resultados actuales están en `output/playwright/v25-final/` y [docs/V2.5-ACADEMIA.md](docs/V2.5-ACADEMIA.md). Las suites específicas usan una instancia local mediante `--base-url`; `--output-dir output/playwright/...` permite aislar informes. Se conservan los documentos y resultados históricos V1/V1.5/V2/V2.1/V2.2/V2.3/V2.4; sus cifras de cobertura describen esas versiones.

## Organización y siguientes fases

`scripts/` transforma los apuntes; `src/lib/` contiene catálogo, navegación y progreso; `src/components/` contiene las vistas; `public/content/` contiene exclusivamente lecturas saneadas. El lector y el índice de búsqueda se cargan bajo demanda.

Las cinco skills solicitadas están accesibles mediante `.agents/skills`, un enlace al directorio instalado original. No se han copiado ni modificado sus archivos. Las decisiones de diseño y extensión están en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

Pendientes: revisión educativa de las dos introducciones indicadas, revisión manual con lectores de pantalla, Safari/Firefox y móviles físicos e importación de progreso. Splunk sigue sin implementar; la academia conserva su panel reservado. No se modifica SC-200.md ni se añaden equivalencias, laboratorios o conexiones externas.
