# SOC Learning Path · V2 visual

## Resultado

El atlas representa los 13 capítulos como regiones. Al pulsar una, se abre su paisaje con las lecturas como nodos; los 719 pasos permanecen en el lector de V1.5. Son 75 lecturas de capítulos y una apertura independiente, accesible desde el libro del campamento. Se mantienen 35 actividades revisadas y 67 lecturas pendientes de enriquecimiento; el mapa no cambia su cobertura.

Hay montañas con nieve y caras de roca, ciudad distante, praderas, árboles, río, flores, rocas, puente, camino trazado y plataformas elevadas. El robot y los cofres son SVG originales. Se utilizan seis temas de color en las 13 regiones y parches de terreno diferentes en el atlas. Los dibujos se generan localmente, con símbolos reutilizados, sin servicios de renderizado ni dependencias nuevas. Su licencia MIT está en `public/illustrations/LICENSE.md`; no incluye los apuntes ni la referencia del usuario.

## Comparación con la referencia

Se inspeccionó la imagen antes de programar. Se conserva su composición: cabecera azul con nivel/XP, robot en bienvenida oscura, progreso sobre el paisaje, camino de arena que une plataformas coloreadas, placas legibles y cofre al final; abajo aparecen nivel y logros reales. La referencia no se usa como fondo ni como interfaz superpuesta. La ilustración creada es SVG 2D, más plana que el render de referencia; reproduce los elementos de aventura sin prometer una copia literal ni escenarios 3D.

Primero se construyó solo Licencia y onboarding, con sus cuatro lecturas. Tras corregir solapamientos y el recorte del cofre en tableta, pasó cinco grupos de validación antes de activar el atlas nuevo y las otras regiones. La evidencia de esa puerta está en `output/playwright/v2-pilot-results.json`. Después se extendió el mismo `AdventureMap` a los 13 capítulos.

## Funcionalidad y compatibilidad

- Los nodos abren lecturas reales mediante sus IDs originales. Los bloqueados muestran requisitos y un enlace a la región que falta; entrar en su índice no desbloquea contenido.
- Se distingue disponible, en curso, completada, dominada y bloqueada mediante texto e iconos. Las lecciones dominadas muestran estrella; los nodos bloqueados conservan color y candado.
- Volver al mapa devuelve el foco y la vista al nodo correspondiente mediante `?nodo=ID`. El selector de regiones y el índice original siguen disponibles.
- Los cofres y las insignias enlazan al progreso existente. No conceden XP nuevos ni crean otro guardado. El motor y las claves V1/V2 de LocalStorage no han cambiado.
- `docs/v2-compatibility.json` verifica que el catálogo, los 76 payloads, las actividades, el compilador y los archivos del motor de progreso conservan sus huellas de V1.5. SC-200.md permanece intacto.

## Pruebas ejecutadas

- `npm run verify`: **32 pruebas aprobadas**, TypeScript estricto y build de producción correctos.
- `node tests/e2e.mjs --visual`: **10 grupos visuales aprobados**. Incluyen navegación por los 13 nodos de región y las 75 lecturas de capítulos, apertura independiente, vuelta al mismo nodo, finalización real, dominio obtenido mediante evaluación, conservación de V1, bloqueos, selector, tamaños 1440/1024/768/390/320, redimensión, títulos largos sin solapamiento, cofre dentro de la escena, teclado y movimiento reducido.
- `node tests/e2e.mjs`: **11 grupos de regresión V1.5 aprobados**, con las 35 actividades respondidas mal y bien, 76 originales, persistencia, migración, desbloqueos, XP acotados y exportación. La comprobación final contra la instalación definitiva se registra en los informes.

Informes: `output/playwright/v2-visual-results.json`, `v2-pilot-results.json` y `v15-full-results.json`. Las pruebas usan contextos temporales; no leen ni borran el LocalStorage personal del estudiante. No se registraron errores de página, consola ni peticiones externas en la suite visual.

## Rendimiento y accesibilidad

Las métricas incluyen FCP, CLS, tareas largas, nodos DOM y recursos. Se probaron móviles emulados de 320/390 px con CPU ralentizada 4×; las cifras son de laboratorio local, no de hardware móvil físico. El informe conserva los valores de cada ejecución. No se utilizan filtros SVG, motores 3D, imágenes remotas ni bucles de animación. Solo se monta el paisaje de la vista activa; el paisaje está memoizado y las ilustraciones usan símbolos SVG.

Las transiciones de hover actúan sobre contenedores HTML, con transformaciones de 150 ms y la curva existente. Movimiento reducido elimina esos desplazamientos. Se conservan controles HTML nativos, foco visible, objetivos de al menos 44 px, textos de estado sobre placas claras y navegación sin arrastrar. Los títulos completos determinan el espacio necesario: un efecto agrupa las mediciones de las placas y alarga el camino cuando hace falta, sin lecturas de layout durante render.

## Instalación definitiva verificada

La versión 0.2.0 está instalada en `/home/tommy/Documentos/SOC_LEARNING_PATH`. Allí se ejecutó `npm test` (32 aprobadas), y ambas suites contra `http://127.0.0.1:5173/`: 10 grupos visuales y 11 educativos aprobados. Se compararon código, tests y build con la copia preparada: ningún archivo ausente ni diferente. El `AGENTS.md` existente no se modificó. El build se compiló en `/tmp` por las restricciones de escritura del entorno; la instancia comprobada sirve esos mismos archivos desde el directorio definitivo.

Última ejecución visual: `2026-10-15T22:55:45.921Z`. Las cifras siguientes corresponden a esa ejecución local; las variantes CPU4 usaron ralentización 4×. Hay tareas largas de arranque registradas en el JSON: estas cifras no son una garantía de FPS ni una auditoría en móvil físico.

| Escena / entorno | FCP | CLS | Elementos DOM |
| --- | ---: | ---: | ---: |
| region-desktop | 380 ms | 0 | 650 |
| region-320-cpu4 | 664 ms | 0 | 628 |
| region-390-cpu4 | 636 ms | 0 | 615 |
| region-768-cpu1 | 248 ms | 0 | 723 |
| atlas-desktop | 284 ms | 0 | 1016 |
| atlas-mobile | 240 ms | 0 | 1221 |

La copia anterior de los archivos está en `/tmp/soc-learning-path-v15-before-v2` (temporal; no contiene una copia del LocalStorage personal). La exportación del progreso del estudiante sigue disponible en Mi progreso.

## Abrir y reproducir

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev
```

O sirve la compilación entregada:

```sh
python3 -m http.server 5173 --bind 127.0.0.1 --directory dist
```

Abre `http://127.0.0.1:5173/`. Mantén dirección y puerto para conservar el mismo almacenamiento. Si el servidor ya está abierto, no inicies otro en ese puerto.

```sh
npm test
npm run build
npm run test:browser
npm run test:visual
node tests/e2e.mjs --visual --base-url http://127.0.0.1:5173/
```

## Límites y siguiente fase

El diseño usa ilustraciones 2D reutilizables, no trece paisajes pintados individualmente. Sigue pendiente una auditoría con lectores de pantalla, Safari/Firefox y teléfonos físicos. Las 67 lecturas pendientes mantienen ese estado; esta fase no añade preguntas ni equivalencias de Splunk. La próxima fase puede enriquecerlas por lotes y ampliar la variedad de escenarios, manteniendo el contrato `MapStation` para futuras rutas de Splunk, Redes, Windows o Linux.


## Cierre de sesión · 16/10/2026

Se repitieron compilación, 32 pruebas unitarias y las suites completas (10 grupos visuales y 11 educativos), todos aprobados. Se verificó que el build coincide con la instalación y que el código, el diseño y los datos educativos permanecen intactos. El servidor temporal de 5173 está detenido. Los problemas, límites e instrucciones de reanudación están en [RETOMAR.md](RETOMAR.md); los informes finales están archivados en `output/cierre-2026-10-16/`. No se realizaron commits ni publicaciones.
