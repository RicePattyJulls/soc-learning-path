# Mundo SOC · Plan de integración y estado

Sexto mundo de la academia local. No es una academia por fases: es un
**entrenador de casos** donde el usuario responde con sus palabras, revela la
respuesta modelo y se autoevalúa.

## Autorización y alcance

- Petición del propietario (19/10/2026): integrar el banco `PREGUNTAS_SOC` en su
  web local como un mundo nuevo.
- Alcance: enrutador (`#/soc`), selector de academias, comando local
  `prepare:soc` y reconocimiento exacto en las guardias históricas.
- Sin cambios en motores, contenido o progreso de los otros mundos.

## Fuente editorial

`SOC_MASTER_RESEARCH/`

```
01_FUENTE/                 16 archivos originales (8 JSON + 8 MD), intactos
02_CASOS/N1-01.json …     40 casos normalizados
03_RECURSOS/FUENTES.json   84 referencias (bibliografía general + por caso)
03_RECURSOS/MITRE.json     78 técnicas ATT&CK usadas por los casos
VALIDACION/CATALOGO-EDITORIAL.json
VALIDACION/MANIFIESTO-EDITORIAL.json   59 archivos con su hash SHA-256
```

Importación: `SOC/tools/soc-import.mjs` (fuera del repo de la web). Normaliza:

- `comandos[].comando` (algunas tandas usaban `codigo`);
- `kql/spl[].limitaciones` (algunas tandas usaban `limites`);
- direcciones privadas `10.x` → rango sintético declarado `10.60.x.y`;
- nivel y tanda derivados del id/archivo, no del texto del JSON.

## Generación

`npm run prepare:soc` = `build-soc-manifest.mjs` + `prepare-soc.mjs`.

- Verifica cada fuente contra el manifiesto antes de leerla.
- Saneado con lista de permitidos explícita (dominios `.example` de RFC 2606,
  rangos RFC 5737, `0.0.0.0`, `127.0.0.1`, `10.60.0.0/16`, los tres GUID públicos
  de replicación de AD, la clave de ejemplo de AWS y `C:\Users\Public`), con
  **0 redacciones** y sin alterar ni un carácter.
- Separa el **contenido del estudiante** (escenario, pregunta, objetivo) de la
  **respuesta modelo** (`.answers.json`).
- Salida: 40 payloads + 40 respuestas + `src/soc/generated/catalog.json`.

## Interfaz

| Ruta | Qué es |
|---|---|
| `#/soc/ruta` | Tablero de los 40 casos con filtros por nivel, bloque, estado y texto |
| `#/soc/caso/<id>` | Caso: escenario → tu respuesta → revelar → autoevaluación |
| `#/soc/repaso` | Cola de repaso espaciado: lo que toca hoy y lo que viene después |
| `#/soc/fuentes` | Bibliografía por dominio y por caso |
| `#/soc/progreso` | Resumen, bloques y exportación del progreso |

- Clave propia: `soc-learning-path:soc:learning:v1`.
- Autoguardado del borrador (500 ms) y verificación SHA-256 del payload y de la
  respuesta antes de mostrar cualquier cosa.
- Estados: pendiente · en curso · repasar · casi dominado · dominado. Sin XP, sin
  rachas y **sin desbloqueos**.
- Autoevaluación con la rúbrica del propio caso (0/1/2 por criterio) → el estado
  se calcula sobre la puntuación real.
- **Repaso espaciado** (`docs/soc/REPASO-ESPACIADO.md`): completar la rúbrica
  programa el caso (hoy / mañana / 1→3→7→16→35 días) y la cola se deriva del
  progreso guardado, sin estado de sesión.
- `#/soc/ruta?estado=repasar` abre el tablero ya filtrado (atajo «Practicar sin
  programar» de la cola).
- `Reiniciar el caso` es un corte duro: al fusionar con otra pestaña o con la
  copia guardada, nada de lo anterior al reinicio puede resucitar (`resetAt`).

## Fases

| Fase | Contenido | Estado |
|---|---|---|
| 1 | Fuente editorial: 40 casos, catálogo, manifiesto | Completada |
| 2 | Generador: saneado, separación de respuestas, payloads | Completada |
| 3 | Interfaz: tablero, caso interactivo, fuentes, progreso | Completada |
| 4 | Integración: `#/soc`, selector, `prepare:soc`, guardias | Completada |
| 5 | Verificación: unitarias, guardias, navegador e integridad | Completada |
| 6 | Repaso espaciado: programación por caso, cola y rutas | Completada |
| 7 | Revisión editorial del propietario: declaración y guardia del generador | Completada |

## Verificación

```bash
npm run prepare:soc      # 40 casos · 0 redacciones · 40/40 verificaciones
npx tsc -b               # limpio
node scripts/splunk-integrity.mjs && node scripts/simulator-integrity.mjs
npm test                 # 127/127 (incluye 9 pruebas en tests/soc.test.ts)
node /path/SOC/tools/soc-pass.mjs   # pasada de navegador
```

Resultados de cierre:

- Generación: **40 casos · 8 bloques · 2 niveles · 161 consultas · 84 fuentes**,
  0 redacciones, 40/40 reconstrucciones.
- Integridad: **80 servidos == 80 referenciados**, 0 huérfanos, 0 faltantes.
- Guardias: 7/7 en verde con la extensión autorizada.
- Navegador: **52/52 comprobaciones**, los 40 casos abren y verifican, 0 errores
  de consola, 0 desbordamiento en móvil (tablero, caso, repaso, progreso y
  fuentes).

## Revisión editorial

- **Propietario (19/10/2026)**: revisión completada y **aprobada sin cambios en
  la fuente**. El catálogo se publica como `synthetic_owner_reviewed` y el estado
  educativo es `owner_editorial_review / owner_review_complete`
  (`independent: false`). Registro y evidencia en
  `SOC_MASTER_RESEARCH/VALIDACION/REVISION-PROPIETARIO.json` y en
  [REVISION-PROPIETARIO.md](REVISION-PROPIETARIO.md).
- El generador no acepta la declaración sin su registro: exige que el archivo
  esté en el manifiesto, que declare cero cambios y que su `casesDigest` coincida
  con los 40 casos publicados. Si el contenido cambia, hay que volver a
  revisarlo.
- **Revisión independiente**: pendiente (`independent: false`). Una revisión del
  propietario no sustituye a una revisión educativa independiente ni certifica
  licencias o cuotas.

## Lo que queda

- **Ejecución real**: los comandos no se han ejecutado en ningún equipo
  (`commandsExecuted: false`, `practicalStatus: not_assessed`) y las consultas
  KQL/SPL no se han probado contra Microsoft Sentinel ni Splunk: hay que validar
  ingesta, esquema, campos y permisos en el entorno propio.
- Todo el contenido es sintético de laboratorio y así se declara en la interfaz
  (página de fuentes).
