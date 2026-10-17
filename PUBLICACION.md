# Copia privada de publicación

Esta copia contiene código, ambas academias, simulador, contenido educativo preparado, pruebas y documentación. Se creó separadamente del proyecto de trabajo; no modifica su original.

Se excluyen secretos/archivos de credenciales, configuraciones de entorno, dependencias, cachés, temporales, respaldos, capturas, logs y resultados históricos de pruebas. Los catálogos de `src/generated/` y los payloads de `public/` se incluyen expresamente, aunque el .gitignore histórico los excluya para regeneración.

## Ejecutar la copia

Tras instalar las dependencias del lockfile con `npm ci`, servir todos los módulos con:

```sh
npm run dev:pilot -- --port 5187 --strictPort
```

Para compilar los contenidos preparados sin invocar el prebuild que necesita el origen externo:

```sh
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/vite/bin/vite.js build
```

`npm run dev`, `npm test` y `npm run build` conservan sus prehooks originales: preparan SC-200 desde una fuente externa. El repositorio no incorpora ese archivo ajeno al directorio del proyecto. Las guardias y varios tests históricos necesitan respaldos de `output/`, excluidos deliberadamente de esta publicación. No se han desactivado esas pruebas ni se afirma que un clon sin dichos archivos pueda superar toda la batería. Las rutas documentales a evidencias locales omitidas son referencias históricas.

Consultar `CLAUDE.md` y `docs/HANDOFF-IA.md` para la arquitectura y los límites. Los datos y ejemplos de credenciales del test de saneado son explícitamente ficticios; los hashes de versión/integridad no son credenciales. El escaneo de publicación se revisó antes de preparar el commit.
