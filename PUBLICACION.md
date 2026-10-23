# Copia de publicación y GitHub Pages

Esta copia contiene código, los seis cursos (SC-200, Splunk, Redes, Windows + AD, Linux y Mundo SOC), el Repaso SOC, el simulador, contenido educativo preparado, pruebas y documentación. Se creó separadamente del proyecto de trabajo; no modifica su original.

Se excluyen secretos/archivos de credenciales, configuraciones de entorno, dependencias, cachés, temporales, respaldos, capturas, logs, resultados históricos de pruebas y las notas de trabajo internas de `references/`. Los catálogos de `src/generated/` y `src/<mundo>/generated/` y los payloads de `public/` se incluyen expresamente, aunque el .gitignore histórico los excluya para regeneración.

## Ejecutar la copia

Con Node.js 22.12 o posterior, instalar las dependencias del lockfile con `npm ci` y servir todos los módulos con:

```sh
npm run dev:pilot -- --port 5187 --strictPort
```

Abrir `http://127.0.0.1:5187/soc-learning-path/`. Para comprobar TypeScript y compilar los contenidos preparados sin invocar el prebuild que necesita el origen externo:

```sh
npm run build:pages
npm run preview
```

La previsualización está en `http://127.0.0.1:4174/soc-learning-path/`.

`npm run dev`, `npm test` y `npm run build` conservan sus prehooks originales: preparan SC-200 desde una fuente externa y regeneran Redes, Windows + AD, Linux y Mundo SOC desde `*_MASTER_RESEARCH/`. El repositorio no incorpora ese archivo ajeno al directorio del proyecto. `build:pages` utiliza los catálogos y payloads versionados de todos los mundos y del simulador; no regenera ni modifica sus revisiones. Las guardias y varios tests históricos necesitan respaldos de `output/`, excluidos deliberadamente de esta publicación. No se han desactivado esas pruebas ni se afirma que un clon sin dichos archivos pueda superar toda la batería. Las rutas documentales a evidencias locales omitidas son referencias históricas.

## Despliegue automático

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) instala con `npm ci`, ejecuta `build:pages` y publica únicamente `dist/`. Se ejecuta al subir cambios a `main` o manualmente desde Actions. En Settings → Pages, la fuente debe ser **GitHub Actions**. Usa el token temporal del workflow y OIDC; no requiere añadir secretos ni un token personal al repositorio. Las acciones están fijadas por SHA a las versiones de la [plantilla oficial de Vite](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy-github-pages.yaml).

URL: **https://ricepattyjulls.github.io/soc-learning-path/**

- SC-200: `#/ruta`.
- Splunk: `#/splunk/ruta`.
- Redes: `#/redes/ruta`.
- Windows + AD: `#/windows-ad/ruta`.
- Linux: `#/linux/ruta`.
- Mundo SOC: `#/soc/ruta`; Repaso SOC: `#/soc/repaso_soc`.
- Simulador: `#/simulador/microsoft` y `#/simulador/splunk`.

`vite.config.ts` fija `base: '/soc-learning-path/'`. Vite adapta el icono y los scripts de `index.html`, los estilos y los imports diferidos. Los lectores SC-200/Splunk, los recursos Splunk y los escenarios ya anteponen `import.meta.env.BASE_URL` a sus archivos locales. La navegación utiliza hashes, por lo que recargar una lección o un caso no requiere reglas de servidor ni un `404.html` de redirección.

El progreso sigue siendo local al navegador y al origen. La web de GitHub Pages empieza con su propio almacenamiento; no importa ni borra el progreso guardado en `127.0.0.1`. No hay sincronización ni restauración general automática. El despliegue no sustituye la revisión educativa, la accesibilidad manual ni los pendientes históricos documentados en el handoff.

Consultar `CLAUDE.md` y `docs/HANDOFF-IA.md` para la arquitectura y los límites. Los datos y ejemplos de credenciales del test de saneado son explícitamente ficticios; los hashes de versión/integridad no son credenciales. El escaneo de publicación se revisó antes de preparar el commit.
