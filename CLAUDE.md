# SOC Learning Path — entrada para Claude Code y otras IA

Proyecto local: `/home/tommy/Documentos/SOC_LEARNING_PATH`. Traspaso documental original: **17 de octubre de 2026**; **actualizado el 19 de octubre de 2026** (seis mundos y Mundo SOC). No necesitas las conversaciones anteriores para trabajar aquí.

## Leer antes de actuar

1. [docs/MAPA-MUNDOS.md](docs/MAPA-MUNDOS.md): **dónde vive cada cosa** hoy — secciones, payloads, generadores y estado de revisión de los seis mundos. Es el inventario vigente; contrasta sus conteos con el disco.
2. [AGENTS.md](AGENTS.md): instrucciones del repositorio y límites de la tarea.
3. [docs/HANDOFF-IA.md](docs/HANDOFF-IA.md): arquitectura real, estado, persistencia, fuentes y evidencias. Su cabecera es del 17/10 y describe tres áreas; su actualización y el mapa cubren lo posterior.
4. [docs/GUIA-CAMBIOS-FUTUROS.md](docs/GUIA-CAMBIOS-FUTUROS.md): procedimientos, riesgos, pruebas y recuperación por tipo de cambio.
5. [docs/RETOMAR.md](docs/RETOMAR.md): checkpoints e historial, del más reciente al más antiguo.
6. Lee el código implicado y los informes de la fase correspondiente. Comprueba fechas, hashes y alcance; un informe antiguo no prueba el estado de un código nuevo.

El README y `docs/ARQUITECTURA.md` conservan decisiones de etapas anteriores. Sus referencias a Splunk «próximamente» no describen la academia Splunk actual. Los textos del 17/10 (HANDOFF-IA, RETOMAR, AGENTS) hablan de tres áreas y **no listan** Redes, Windows + AD, Linux ni el Mundo SOC: para esos mandan el mapa y este documento.

## Qué existe

SPA educativa SOC local (React/TypeScript/Vite, sin backend, autenticación ni SIEM reales) con **seis cursos** y un **simulador** aparte. Cada mundo tiene ruta, payloads y clave de progreso propias; no se mezclan.

| Mundo | Ruta | Contenido | Payloads |
| --- | --- | --- | --- |
| SC-200 | `#/ruta`, `#/biblioteca` | 13 módulos, 76 lecturas, 719 pasos, 272 actividades | `public/content` |
| Redes | `#/redes/...` | 8 etapas, 168 lecciones | `public/redes-content` |
| Windows + AD | `#/windows-ad/...` | 28 etapas, 84 lecciones | `public/windows-ad-content` |
| Splunk | `#/splunk/...` | 11 regiones, 80 lecciones, 240 actividades | `public/splunk-content` |
| Linux | `#/linux/...` | 32 etapas, 96 lecciones | `public/linux-content` |
| Mundo SOC | `#/soc/...` | 8 bloques, 40 casos de entrevista/triaje | `public/soc-content` |
| Repaso SOC | `#/soc/repaso_soc` | 4 bloques, 98 fichas de conceptos | ninguno (`src/repaso-soc/cards.ts`) |
| Simulador | `#/simulador/...` | 2 plataformas, 4 investigaciones | `public/simulator-data` |

El **Mundo SOC** no es un curso por fases: es un entrenador de casos. Se responde en texto libre, se revela la respuesta modelo (KQL/SPL) y se autoevalúa con rúbrica. Tiene tablero filtrable y progreso propio. Desde el 23/10/2026 `#/soc/repaso` es **modo lectura** de las 40 respuestas modelo (sin fechas); la programación sigue en `review.ts`. Las rutas son `#/soc/ruta`, `#/soc/caso/<id>`, `#/soc/repaso`, `#/soc/fuentes` y `#/soc/progreso`.

Todo el contenido es **sintético de laboratorio** y **ningún mundo acredita ejecución real** (consulta KQL/SPL no ejecutada). Ninguna revisión educativa es independiente todavía. El estado por mundo está en [MAPA-MUNDOS §1.1](docs/MAPA-MUNDOS.md); el Mundo SOC tiene la **revisión del propietario cerrada** (19/10/2026), atada a los hashes de sus casos.

## Dónde trabajar

| Necesidad | Entrada |
| --- | --- |
| Arranque y selección de módulo | `src/main.tsx`, `src/App.tsx`, `src/lib/router.ts` |
| Academia SC-200 | `src/components/`, `src/lib/`, `src/education.ts` |
| Academia Redes | `src/redes/` |
| Academia Windows + AD | `src/windows-ad/` |
| Academia Linux | `src/linux/` |
| Academia Splunk | `src/splunk/` |
| Mundo SOC (casos y repaso) | `src/soc/` |
| Repaso SOC (fichas) | `src/repaso-soc/`; detalle en [MAPA-MUNDOS §3.8](docs/MAPA-MUNDOS.md) |
| Simulador | `src/simulator/` |
| Fuentes y generadores | `scripts/*.mjs`, `*_MASTER_RESEARCH/`; fuente SC-200 externa, detallada en el maestro |
| Pruebas y evidencias | `tests/`, `output/` |

## Operaciones y validación

Leer archivos, buscar con `rg`, inspeccionar informes y calcular hashes son operaciones de diagnóstico. Antes de editar, identifica el alcance, haz respaldo y comprueba las guardias. No reinstales dependencias ni regeneres contenido como primer intento de solucionar un error visual.

Generar cada mundo y arrancar:

```sh
npm run prepare:content && npm run prepare:redes && npm run prepare:windows-ad && npm run prepare:linux && npm run prepare:soc
npm run dev                       # http://127.0.0.1:5173
npm run dev:pilot -- --port 5187 --strictPort   # sirve sin regenerar contenido
```

`predev`, `pretest` y `prebuild` ejecutan los cinco `prepare:*` del repo. Splunk se regenera aparte con `npm run prepare:splunk`. Para uso personal conserva el mismo navegador, perfil y origen (`http://127.0.0.1:5173/`): cambiar puerto o `localhost` por `127.0.0.1` cambia el almacenamiento visible.

Tras cambios autorizados, las 15 guardias encadenadas, TypeScript y las pruebas:

```sh
node scripts/{linux,redes,soc,windows-ad,repaso-soc}-reconciliation.mjs
node scripts/{simulator,splunk,splunk-v11,splunk-v12,splunk-v121,splunk-v122,splunk-v20}-integrity.mjs
node scripts/{simulator,splunk-checkpoint,splunk-v20}-reconciliation.mjs
npx tsc -b && npm test && npm run build
```

Usa siempre una salida nueva para pruebas de navegador; algunos runners antiguos escriben por defecto en carpetas históricas. Distingue pruebas preparadas de pruebas ejecutadas y no inventes resultados, capturas ni aprobación humana.

## Proteger datos y continuidad

No borres LocalStorage personal ni uses un perfil personal para pruebas. Las claves, esquemas, revisiones, exportaciones y reglas de fusión están en [Persistencia](docs/HANDOFF-IA.md#persistencia-y-progreso). No unifiques los almacenes: cada mundo —y cada plataforma del simulador— tiene la suya.

No edites a mano `src/generated/`, `public/*-content/`, `public/simulator-data/` ni los informes derivados: regenéralos. No modifiques `SC-200.md`, las skills enlazadas ni otros proyectos. No reescribas inventarios, resultados o capturas anteriores para aceptar un cambio.

**Ficheros con hash conciliado** (cambiarlos exige actualizar la guardia o el manifiesto, no basta con editar el texto):

- `docs/RETOMAR.md` y `AGENTS.md` figuran en los inventarios de respaldo (`output/*/respaldo/inventario.json`). RETOMAR se actualiza por la vía sancionada (`docs/HANDOFF-CONCILIACION-SIMULATOR.json` + el `MANIFEST_SHA` de `scripts/simulator-reconciliation.mjs`); esos inventarios **no se reescriben**.
- Cinco mundos fijan el SHA-256 de su `docs/<mundo>/CONCILIACION-INTEGRACION.json` (`redes`, `windows-ad`, `linux`, `soc`, `repaso-soc`): cualquier edición autorizada de un fichero protegido obliga a re-fijar ese hash. El último eslabón es `repaso-soc`: un nuevo cambio en `App.tsx`, el selector o esas guardias debe partir de sus hashes `after`.
- Si cambia un caso del Mundo SOC, su revisión del propietario **caduca**: hay que rehacerla (`docs/soc/REVISION-PROPIETARIO.md`).
- **Linux y Windows + AD** tienen la misma guardia (`prepare-linux.mjs`, `prepare-windows-ad.mjs`) pero siguen en `draft_pending_owner_review`, sin registro. Se cierran solo tras la revisión humana: `node scripts/owner-review.mjs <linux|windows-ad> --close --date AAAA-MM-DD` (hoja de trabajo: `docs/CHECKLIST-REVISION-PROPIETARIO.md`). Si cambia una lección después, la revisión caduca.
- Cambiar `docs/RETOMAR.md` por la vía sancionada exige añadir su hash anterior a `before` y el nuevo a `after` en `docs/HANDOFF-CONCILIACION-SIMULATOR.json`, y re-fijar `MANIFEST_SHA` en `scripts/simulator-reconciliation.mjs` (hecho el 19/10/2026; respaldo en `output/owner-review-guard-2026-10-19/respaldo/`).

Conserva `output/`: contiene evidencias y respaldos que las guardias necesitan (las capturas históricas de `output/playwright/` están en `output/archivo-capturas-historicas.tar.zst`). `.gitignore` excluye esa carpeta y varios derivados; un clon que solo conserve archivos versionados puede ser insuficiente para reconstruir o verificar el proyecto. **En la raíz hay un `.git` que no es un repositorio utilizable**: no hay commits; todo vive en disco.

## Cambios futuros

Los diseños actuales son la referencia de continuidad, **no una prohibición permanente de evolución**. Conserva por defecto paisajes y río R02. Una autorización explícita del usuario puede permitir rediseñar incluso toda la interfaz; delimita entonces los archivos, nuevas referencias visuales y regresiones necesarias, sin confundir ese permiso con una migración de progreso o de contenido.

Antes de programar: inspecciona el código real, no repitas investigaciones terminadas sin motivo y no reconstruyas módulos funcionales innecesariamente. Implementa solo lo solicitado. Respalda antes de cambios importantes; no hagas cambios destructivos sin autorización. Ejecuta pruebas del alcance, distingue ejecutadas de preparadas y no inventes resultados, capturas o aprobación humana. Documenta cada modificación importante y actualiza el checkpoint para el siguiente traspaso.

Este handoff no autoriza desarrollo, rediseños, backend, nuevas integraciones, commits ni publicación. La siguiente tarea debe proceder de una nueva instrucción del usuario.
