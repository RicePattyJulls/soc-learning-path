# Validación de la V1

Comprobaciones ejecutadas el 15 de octubre de 2026. La instalación definitiva está en `/home/tommy/Documentos/SOC_LEARNING_PATH`, desde donde se han repetido las pruebas unitarias y se sirve la compilación al navegador.

## Resultados ejecutados

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| Origen real y completo | Compilador Markdown, prueba con el archivo original y verificación de reconstrucción | 13 capítulos, 76 lecturas, 154 encabezados; todo el Markdown saneado queda representado |
| Original sin modificar | SHA-256 antes y después del trabajo | `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89` |
| Jerarquías y código | Árbol Markdown y recorrido de todas las lecturas en Chromium | Subapartados y anclas conservados; 29 bloques de código renderizados y tablas presentes |
| Privacidad | Pruebas de saneado, inspección del catálogo y auditoría | Un correo oculto; ningún documento original copiado a `dist`; informes sin valores ocultos |
| Recursos del Markdown | Inventario del archivo completo | 69 enlaces externos conservados; ninguna imagen ni referencia de Obsidian; cero recursos pendientes |
| Instalación definitiva | Copia completa y comparación SHA-256 de 188 archivos, además de manifiestos y configuración | Proyecto instalado en `/home/tommy/Documentos/SOC_LEARNING_PATH`; cinco skills accesibles |
| Compilación | `npm run build` en la carpeta de preparación y comparación de la compilación copiada | TypeScript estricto y Vite completados; lector y biblioteca en archivos separados |
| Pruebas unitarias | `npm test` desde la ubicación definitiva | 13 de 13 pruebas superadas; preparación del contenido ejecutada también en el destino |
| Arranque de la web | Servidor estático de Python sobre `dist`, peticiones HTTP y navegación real de Chromium | Build servido y aplicación operativa en `127.0.0.1:5173` |
| Lectura y navegación | Arnés de Chromium sobre el build real | Se han abierto las 76 lecturas y utilizado índices, enlaces entre lecturas y anclas |
| Progreso persistente | Completar, recargar y volver a consultar XP | Finalización y puntuación conservadas; XP y bonus sin duplicados |
| Bloqueos y desbloqueos | Acceso por URL y finalización real de todas las lecturas de la primera etapa | Lecturas futuras bloqueadas; segunda etapa desbloqueada al terminar la primera |
| Búsqueda | Búsqueda sin acentos, coincidencias en el texto, filtro y estado vacío | Resultados y filtro por URL comprobados |
| Pantallas pequeñas | Vistas de 390 y 320 px de ancho | Ruta, lector, biblioteca y estadísticas sin desbordamiento horizontal de página; tablas con desplazamiento propio |
| Accesibilidad básica | Revisión del código y comprobaciones en Chromium | Nombres accesibles, navegación semántica, salto al contenido, foco en subapartados y jerarquía de encabezados comprobados |
| Movimiento reducido | Chromium con `--force-prefers-reduced-motion` | Preferencia detectada; confirmación sin transformación y transición solo de opacidad |
| Fallos de almacenamiento | JSON corrupto y `setItem` que lanza error en el navegador | Avisos visibles y lectura disponible |
| Controles de Splunk | Inspección del panel en el navegador | Solo reserva visual; cero enlaces o botones que simulen funcionalidades |
| Solicitudes externas de la aplicación | Recursos observados por el arnés en el navegador | Cero solicitudes externas detectadas; cero errores de página capturados |
| Skills solicitadas | Lectura de sus cinco `SKILL.md` y comprobación del enlace en el nuevo proyecto | Las cinco accesibles mediante `.agents/skills` |

El informe de la comprobación final sobre la instalación definitiva está en [`output/playwright/installed-native-results.json`](../output/playwright/installed-native-results.json). Contiene 12 grupos superados y 76 lecturas inspeccionadas. Las capturas de escritorio y móvil están en esa misma carpeta.

## Límites comprobados del entorno

- **Escritura durante la compilación:** el comando de copia ya autorizado permitió instalar el proyecto, pero `npm run build` dentro del destino recibe `EROFS` por el montaje restringido de esta sesión. La compilación completa se ejecutó en la carpeta de preparación; sus archivos se verificaron idénticos después de copiarlos. Esta limitación del entorno no impide servir la compilación instalada con Python.
- **Servidor de desarrollo:** `npm run dev` prepara el contenido correctamente, pero Vite recibe `listen EPERM` al abrir el puerto en esta sesión. El arranque y los recorridos comprobados usan el build de producción servido con Python; no se afirma haber validado aquí el servidor de desarrollo de Vite.
- **Playwright:** el CLI no estaba en caché y la red impedía descargarlo. La suite con `playwright-core` está preparada, pero la apertura de sockets de Node y el lanzamiento de Chromium desde ese proceso estaban restringidos. Esa suite no se declara superada. Se han ejecutado recorridos reales con Chromium directamente como alternativa.
- Las pruebas de móvil utilizan tamaños de viewport de Chromium, no dispositivos físicos. La revisión de accesibilidad es básica, no una auditoría completa con lector de pantalla. No se ha realizado un benchmark de FPS ni una medición de rendimiento en equipos de baja potencia.

## Repetir las comprobaciones

En un entorno habitual, con Chromium instalado:

```sh
npm test
npm run build
npm run test:browser
```

Para reproducir el arnés alternativo, después de compilar:

```sh
node scripts/prepare-native-check.mjs
python3 -m http.server 5173 --bind 127.0.0.1 --directory dist
```

Desde otra terminal:

```sh
soc_qa_profile="$(mktemp -d /tmp/soc-qa.XXXXXX)"
chromium --headless=new --no-sandbox --disable-gpu \
  --disable-background-networking --force-prefers-reduced-motion \
  --user-data-dir="$soc_qa_profile" --window-size=1440,1080 \
  --virtual-time-budget=90000 --dump-dom \
  'http://127.0.0.1:5173/__qa.html?reduced=1'
```

El documento resultante muestra `data-status="passed"` y el informe JSON dentro de `#results`. Usa un perfil temporal nuevo para partir de cero y evitar mezclar el progreso de prueba con el personal. El arnés cambia únicamente el almacenamiento del perfil de prueba. `npm run build` elimina del resultado los archivos temporales `__qa.html` y `__qa.js`; también se han retirado de la entrega final.

## Extensiones propuestas

El mapa ilustrado puede sustituir `Roadmap.tsx` conservando catálogo, estados y enlaces. Paisajes, personajes y movimiento adicional quedan fuera de esta V1. Las futuras equivalencias con Splunk necesitan contenido revisado: el panel actual no las inventa ni conecta ningún servicio.
