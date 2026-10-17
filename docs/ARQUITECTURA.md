# Arquitectura y dirección visual

## Decisiones de la V1

La ruta es la vista principal. Su secuencia procede del documento y sus nodos conducen al índice de cada capítulo. La biblioteca, el lector y el progreso son vistas independientes enlazadas mediante URL. No hay autenticación, backend, base de datos ni servicios externos de la aplicación.

Paleta: azul cabecera `#12294F`, tinta `#172D51`, niebla `#F3F6FC`, violeta de avance `#7546D7`, verde de crecimiento `#0B886C` y oro de recompensa `#EABB53`. La tipografía usa familias disponibles localmente; no se solicitan fuentes remotas. El texto largo tiene una anchura de lectura limitada; las tablas y consultas se desplazan dentro de su contenedor.

Distribución de escritorio:

```text
Cabecera: marca | Ruta · Biblioteca · Mi progreso | nivel
Bienvenida y acción de continuar | progreso general
Ruta de nodos sinuosa            | perfil, próxima lectura y logros

Lector:
índice | Microsoft SC-200: apuntes | Splunk: próximo horizonte
```

En móvil, la ruta se vuelve vertical y el lector apila el contenido SC-200 y el panel reservado para Splunk. Los nodos mantienen la numeración real de las etapas. La V1 evita paisajes, personajes y escenas complejas; la identidad se concentra en la ruta y los medallones.

## Contenido

`scripts/content.mjs` usa `remark-parse` y GFM. Lee el documento completo, sanea datos, descubre encabezados fuera de bloques de código y divide intervalos contiguos. Una comprobación de reconstrucción detecta pérdida o duplicación de cualquier fragmento del Markdown saneado.

`prepare-content.mjs` genera un catálogo con metadatos, un índice de búsqueda separado y un JSON por lectura. Títulos y niveles proceden de la fuente. Los IDs derivan del capítulo y el título; la huella de cada lectura identifica cambios de contenido. Los títulos repetidos reciben un sufijo de ocurrencia.

El lector interpreta Markdown seguro, tablas y código; no ejecuta HTML arbitrario. Los encabezados conservan su relación jerárquica y reciben IDs para navegación. Las referencias no verificadas se muestran como pendientes.

## Progreso

Las funciones puras de `src/lib/progress.ts` validan los datos y calculan estados y XP. Los capítulos anteriores son prerrequisitos acumulativos. Los XP se derivan de las lecturas completadas: no se guarda una puntuación mutable que pueda duplicarse al pulsar dos veces.

El esquema de `localStorage` guarda `{schemaVersion, completed: {id: version}, lastLesson}`. Las versiones antiguas se descartan al leer, y los cálculos siempre comparan la versión vigente. El evento `storage` sincroniza otras pestañas del mismo origen. No se guarda contenido del documento ni credenciales.

## Ampliar el mapa sin reconstruir el lector

`Roadmap.tsx` consume el catálogo y los estados calculados; no controla ni interpreta el contenido. Puede sustituirse por un componente de mapa ilustrado usando los mismos IDs, estados y enlaces `chapterUrl`/`lessonUrl`. Las posiciones, escenarios, personajes y recompensas visuales serán metadatos de presentación adicionales, separados de las explicaciones técnicas.

El panel de Splunk está aislado en el lector y carece de acciones simuladas. En una fase posterior puede recibir contenido revisado asociado a cada ID, manteniendo intacta la representación de SC-200. No existen equivalencias KQL/SPL en esta entrega.

## Movimiento y rendimiento

El feedback de finalización es una interacción ocasional con propósito de confirmar el avance. Se implementa mediante transiciones CSS de opacidad y transformación, de 200 ms, con `cubic-bezier(0.23, 1, 0.32, 1)`. La barra de progreso utiliza una escala horizontal; el estado reducido cambia sin desplazamiento animado. El hover se limita a dispositivos con puntero preciso. No se ha añadido Motion porque estas transiciones no necesitan otra dependencia.

React carga el lector y la biblioteca mediante `lazy`. El índice completo de búsqueda se carga con la biblioteca y las lecturas se solicitan individualmente; la caché en memoria conserva como máximo ocho. Las listas de resultados usan `content-visibility`. No hay animaciones continuas ni mediciones de layout durante el render.

Se han aplicado las skills `frontend-design`, `animate`, `vercel-react-best-practices`, `web-design-guidelines` y `playwright`. El CLI de Playwright no estaba en caché y el acceso de red estaba bloqueado; se ha conservado una suite con `playwright-core` y se han ejecutado comprobaciones reales con Chromium como alternativa.


## Extensión educativa V1.5

- `scripts/education.mjs` transforma el árbol Markdown en pasos reutilizables: explicación, comparación, procedimiento, código y concepto destacado. Conserva las referencias y el contexto, sin fabricar preguntas automáticamente.
- `scripts/activities.mjs` contiene las misiones, síntesis y actividades revisadas, separadas de React. Cada respuesta tiene citas exactas: si el origen deja de respaldarlas, la preparación falla.
- Cada JSON de lectura contiene el original saneado y `education`. El catálogo solo incluye IDs, revisión y metadatos ligeros; los payloads y React Markdown se cargan bajo demanda. El lector conserva una caché de ocho lecturas.
- `src/education.ts` define el contrato. `LearningReader` organiza fases y pasos; `QuestionCard` renderiza cinco formatos sin componentes por lectura; `Review` presenta errores y dominio pendiente. `Reader` sigue mostrando el original completo.
- `src/lib/learning.ts` implementa corrección, requisitos, intentos y premios únicos mediante funciones puras. `learning-storage.ts` migra de forma aditiva y preserva la clave V1. `useProgress` persiste y fusiona pestañas, además de exportar copias locales.
- El mapa depende del catálogo y del estado de aprendizaje, no del JSX de cada actividad. Puede sustituirse por un escenario ilustrado sin cambiar contenido, IDs, evaluación o guardado. El panel Splunk es un espacio reservado.
- Las transiciones de las tarjetas usan CSS para opacidad y transformaciones breves. No hay nuevas dependencias; movimiento reducido elimina el desplazamiento. Los procedimientos se ordenan con botones accesibles por teclado, sin exigir arrastrar.


## Atlas y regiones V2

`AdventureMap` recibe estaciones genéricas (`id`, título, enlace, estado, detalle y recompensa visible), un tema decorativo y un nodo al que devolver el foco. No importa LocalStorage ni corrige respuestas. `adventure-catalog.ts` traduce el catálogo/progreso existente a esos datos mediante las funciones de V1.5; no guarda ni concede XP.

`adventure.ts` calcula geometría para móvil, tableta y escritorio; no conoce títulos ni IDs técnicos. `Artwork.tsx` dibuja paisaje, robot y cofre mediante SVG locales y símbolos reutilizados. `Landscape` está memoizado y el layout solo cambia cuando cambian cantidad, modo o tipo de mapa. El capítulo usa `RegionMap` y el atlas usa `Roadmap`; ambos comparten el renderer.

Los dibujos se superponen en capas: cielo y montañas, terreno y río, vegetación y rocas, camino SVG real, nodos HTML con foco, y paneles de progreso. El mapa muestra capítulos o lecturas, nunca los 719 pasos. Enlaces por hash conservan los IDs; `?nodo=ID` permite regresar al punto correspondiente con foco y desplazamiento instantáneo. No se guarda una cámara en otra clave de progreso.

Para otra ruta, proporciona su catálogo y un adaptador a `MapStation[]`; puedes reutilizar geometría, paisaje, plataformas, foco y navegación. `AdventureRoute` describe la ruta; la única habilitada en V2 es SC-200. Agregar una ruta futura requiere su contenido y navegación, no rehacer el mapa ni mezclar progreso actual.

Las transiciones de interacción usan HTML alrededor de los SVG (transform 150 ms con `--ease-out`); no se anima el paisaje ni hay bucles de fondo. La preferencia de movimiento reducido elimina el desplazamiento de hover. Las ilustraciones originales tienen licencia propia en `public/illustrations/LICENSE.md`, sin incluir la referencia ni los apuntes.

Los nombres originales pueden ocupar varias líneas. `useAdventureLayout` mide las placas después del layout, agrupa lecturas por fila y llama a la función pura `fitMapLabels` para alargar únicamente los tramos que lo necesitan. Las lecturas de dimensiones están agrupadas en un efecto, nunca en render; no se recortan títulos. Un ResizeObserver comprueba cambios de tamaño y se desconecta al salir del mapa. La firma de ancho/alturas evita actualizaciones repetidas. El cofre se sitúa después de la última placa y dentro de la escena.
