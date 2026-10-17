# SOC Learning Path — entrada para Claude Code y otras IA

Proyecto local: `/home/tommy/Documentos/SOC_LEARNING_PATH`. Traspaso documental: **17 de octubre de 2026**. No necesitas las conversaciones anteriores para trabajar aquí.

## Leer antes de actuar

1. [AGENTS.md](AGENTS.md): instrucciones del repositorio y límites de la tarea.
2. [docs/HANDOFF-IA.md](docs/HANDOFF-IA.md): arquitectura real, estado, persistencia, fuentes y evidencias. Es el documento maestro de este traspaso.
3. [docs/GUIA-CAMBIOS-FUTUROS.md](docs/GUIA-CAMBIOS-FUTUROS.md): procedimientos, riesgos, pruebas y recuperación por tipo de cambio.
4. [docs/RETOMAR.md](docs/RETOMAR.md): índice de checkpoints e historial. Su aviso inicial distingue el estado vigente de las fases antiguas.
5. Lee el código implicado y los informes de la fase correspondiente. Comprueba fechas, hashes y alcance; un informe antiguo no prueba el estado de un código nuevo.

El README y `docs/ARQUITECTURA.md` conservan decisiones de etapas anteriores. Sus referencias a Splunk «próximamente» no describen la academia Splunk actual. No rehagas ese módulo por leer esos textos. El maestro identifica también mensajes históricos todavía presentes en la interfaz.

## Qué existe

SPA educativa SOC N1/N2 con React/TypeScript/Vite, recursos locales y tres áreas:

- **Microsoft SC-200:** 13 regiones, 76 lecturas, 719 pasos, 272 actividades; 74 lecturas con actividades y dos introducciones pendientes de evaluación.
- **Splunk SOC:** 11 regiones, 80 lecciones, 240 actividades; teoría autocorregida y prácticas formativas sin dominio práctico automático.
- **SOC Simulator V1:** motor común, cuatro investigaciones sintéticas Microsoft/Splunk, expediente y evaluación estructurada. No concede XP de las academias.

Sin backend, autenticación ni conexiones SIEM reales. Las rutas/progresos son independientes. El simulador pasó la ejecución automatizada Parrot `2026-10-17T06-59-48-681Z`; su revisión humana sigue pendiente. La paridad histórica del atlas Splunk a 320 px sigue abierta y es otra prueba.

## Dónde trabajar

| Necesidad | Entrada |
| --- | --- |
| Arranque y selección de módulo | `src/main.tsx`, `src/App.tsx`, `src/lib/router.ts` |
| Academia SC-200 | `src/components/`, `src/lib/`, `src/education.ts` |
| Academia Splunk | `src/splunk/` |
| Simulador | `src/simulator/` |
| Atlas, geometría e ilustraciones | `src/components/adventure/`, `src/lib/adventure.ts`, `src/lib/pilot-landscape.ts`, `src/lib/region-visuals.ts` |
| Fuentes y generadores | `scripts/`, `SPLUNK_MASTER_RESEARCH/`; fuente SC-200 externa, detallada en el maestro |
| Pruebas y evidencias | `tests/`, `output/` |

## Operaciones y validación

Leer archivos, buscar con `rg`, inspeccionar informes y calcular hashes son operaciones de diagnóstico. Antes de editar, identifica el alcance, haz respaldo y comprueba las guardias. No reinstales dependencias ni regeneres contenido como primer intento de solucionar un error visual.

Desde la raíz:

```sh
node scripts/simulator-integrity.mjs
npm run dev:pilot -- --port 5187 --strictPort
```

`dev:pilot` sirve la aplicación completa existente sin regenerar contenido; su nombre viene del piloto histórico. Para uso personal conserva el mismo navegador, perfil y origen habitual, normalmente `http://127.0.0.1:5173/`. Cambiar puerto o `localhost` por `127.0.0.1` cambia el almacenamiento visible.

Tras cambios de código autorizados:

```sh
npm test
npm run build
node scripts/simulator-integrity.mjs
```

`pretest`, `prebuild` y `predev` regeneran SC-200 desde la fuente externa. Comprueba antes su disponibilidad y los hashes de partida. Para validación registrada completa, consulta los orquestadores de la guía. No hay necesidad de repetir Playwright por cambiar solo documentación. Usa siempre una salida nueva para pruebas de navegador; algunos runners antiguos escriben por defecto en carpetas históricas.

## Proteger datos y continuidad

No borres LocalStorage personal ni uses un perfil personal para pruebas. Las cinco claves exactas, esquemas, revisiones, exportaciones y reglas de fusión están en [Persistencia](docs/HANDOFF-IA.md#persistencia-y-progreso). No unifiques los almacenes SC-200, Splunk y simulador. La aplicación exporta progreso, pero no tiene un flujo general de importación/restauración.

No edites a mano `src/generated/`, `public/content/`, `public/splunk-content/`, `public/simulator-data/` ni los informes derivados. No modifiques `SC-200.md`, las skills enlazadas ni otros proyectos. No cambies fuentes canónicas para arreglar presentación. No reescribas inventarios, resultados o capturas anteriores para aceptar un cambio. Los manifiestos de conciliación admiten únicamente rutas y hashes exactos autorizados.

Conserva `output/`: contiene evidencias y respaldos que las guardias necesitan. `.gitignore` excluye esa carpeta y varios derivados; un clon que solo conserve archivos versionados puede ser insuficiente para reconstruir o verificar el proyecto. Las skills son un enlace externo, no parte autónoma de esta academia.

## Cambios futuros

Los diseños actuales son la referencia de continuidad, **no una prohibición permanente de evolución**. Conserva por defecto paisajes y río R02. Una autorización explícita del usuario puede permitir rediseñar incluso toda la interfaz; delimita entonces los archivos, nuevas referencias visuales y regresiones necesarias, sin confundir ese permiso con una migración de progreso o de contenido.

Antes de programar: inspecciona el código real, no repitas investigaciones terminadas sin motivo y no reconstruyas módulos funcionales innecesariamente. Implementa solo lo solicitado. Respalda antes de cambios importantes; no hagas cambios destructivos sin autorización. Ejecuta pruebas del alcance, distingue ejecutadas de preparadas y no inventes resultados, capturas o aprobación humana. Documenta cada modificación importante y actualiza el checkpoint para el siguiente traspaso.

Este handoff no autoriza desarrollo, rediseños, backend, nuevas integraciones, commits ni publicación. La siguiente tarea debe proceder de una nueva instrucción del usuario.
