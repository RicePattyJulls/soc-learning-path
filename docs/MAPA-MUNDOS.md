# Mapa de los mundos

Este documento responde a una pregunta concreta: **dónde vive cada cosa** en el proyecto, mundo por
mundo, y qué se puede tocar sin romper nada.

Proyecto: academia SOC local (Vite + React) en `http://127.0.0.1:5173`.
Raíz: `/home/tommy/Documentos/SOC_LEARNING_PATH`.
Última revisión de este mapa: 19/10/2026 (conteos y estado de revisión verificados contra el disco).
Actualización 23/10/2026: `#/soc/repaso` pasa a modo lectura y se añade **Repaso SOC** (§3.6 y §3.8).

---

## 1. Los mundos (más el simulador)

Hay **seis cursos**, un **mundo de fichas** (Repaso SOC) y una **experiencia aparte** (el centro SOC):

| # | Mundo | Ruta en la app | Lecciones/casos | Etapas/regiones | Payloads | Clave de progreso |
|---|-------|----------------|-----------|-----------------|----------|-------------------|
| 1 | **SC-200** | `#/ruta`, `#/biblioteca` (sin prefijo) | 76 | 13 módulos (sin etapas) | `public/content` (76) | `soc-learning-path:learning:v2` |
| 2 | **Redes** | `#/redes/...` | 168 | 8 | `public/redes-content` (359) | `…:redes:learning:v1` |
| 3 | **Windows + AD** | `#/windows-ad/...` | 84 | 28 | `public/windows-ad-content` (193) | `…:windows-ad:learning:v1` |
| 4 | **Splunk** | `#/splunk/...` | 80 | 11 regiones | `public/splunk-content` (91) | `…:splunk:learning:v1` |
| 5 | **Linux** | `#/linux/...` | 96 | 32 | `public/linux-content` (235) | `…:linux:learning:v1` |
| 6 | **Mundo SOC** | `#/soc/...` | 40 casos (entrevista/triaje) | 8 bloques · 2 niveles | `public/soc-content` (80) | `…:soc:learning:v1` |
| 7 | **Repaso SOC** | `#/soc/repaso_soc` | 98 fichas (conceptos) | 4 bloques | ninguno: `src/repaso-soc/cards.ts` | `…:repaso-soc:v1` |
| — | **Simulador SOC** | `#/simulador/...` | — | 2 escenarios | `public/simulator-data` (5) | `…:simulator:` |

Las claves de `localStorage` son **independientes por mundo**: el progreso de uno no contamina a otro.

### 1.1 Estado de revisión y ejecución real

| Mundo | Revisión editorial declarada | Revisor · fecha | Qué falta |
|---|---|---|---|
| SC-200 | el catálogo no declara revisión; 74/76 lecturas con actividades | — (V2.5, trabajo del agente) | 2 introducciones en `PENDIENTE_REVISION` y la revisión humana |
| Redes | `author_self_review / completed_with_corrections` | Codex · 18/10/2026 | revisión independiente (`pending_independent_review`) |
| Windows + AD | `author_pilot_slice / draft_pending_owner_review` | opencode · 18/10/2026 | revisión del propietario y la independiente |
| Splunk | `humanReview: pending_independent_review` | — | revisión del propietario y la independiente |
| Linux | `author_pilot_slice / draft_pending_owner_review` | opencode · 19/10/2026 | revisión del propietario y la independiente |
| Mundo SOC | `owner_editorial_review / owner_review_complete` | Propietario · 19/10/2026 | revisión independiente y ejecución real de las consultas |
| Simulador | sin declaración | — | no aplica: es una experiencia, no contenido evaluable |

Dónde vive cada declaración:

- **Redes, Windows + AD, Linux y Mundo SOC**: `*_MASTER_RESEARCH/VALIDACION/CATALOGO-EDITORIAL.json`
  (el generador la copia al catálogo servido).
- **Splunk**: en el propio catálogo servido (`src/generated/splunk/catalog.json`).
- **SC-200**: no declara revisión en ningún catálogo; su estado educativo se sigue en
  `docs/V25-COBERTURA.json` y `scripts/v25/review-decisions.json`.
- **Ningún mundo certifica ejecución real**: donde se declara es `practicalStatus: not_assessed`
  (Redes, Windows + AD, Linux, SOC) o `splunkExecuted: false` (Splunk). SC-200 no declara ni una cosa
  ni la otra.
- La revisión del Mundo SOC se ata a los hashes de los casos: **si cambia un caso, la declaración
  caduca** y hay que rehacerla (`docs/soc/REVISION-PROPIETARIO.md`).
- **Linux y Windows + AD** tienen desde el 19/10/2026 la misma guardia que el Mundo SOC, todavía
  **sin declaración**: siguen en `draft_pending_owner_review` y no existe su `REVISION-PROPIETARIO.json`.
  `prepare-linux.mjs` y `prepare-windows-ad.mjs` fallan si el catálogo declara `owner_review_complete`
  sin registro, si el registro no coincide con el catálogo o con sus cambios, o si su
  `evidence.lessonsDigest` (SHA-256 de `«<id>=<sha256 de la lección>»` unidos por `:`, ordenados por id)
  no cuadra con las lecciones. `tests/owner-review.test.ts` comprueba ambos estados.
  - Diagnóstico (no escribe): `node scripts/owner-review.mjs linux` (o `windows-ad`) → alcance y digest.
  - Cierre, **solo tras revisar el propietario**: `node scripts/owner-review.mjs linux --close --date AAAA-MM-DD`
    (añade `--changes LNX-01-L02,LNX-07-L01` si corrigió lecciones, después de editarlas) y luego
    `npm run prepare:linux && npm test`. Respaldo previo en `output/owner-review-guard-2026-10-19/respaldo/`.
  Hoja de trabajo para revisar: `docs/CHECKLIST-REVISION-PROPIETARIO.md`.

---

## 2. Anatomía de un mundo (patrón repetido)

Cada mundo tiene **cuatro capas** y siempre en el mismo sitio:

```
<mundo>/                         ← código de la interfaz (React)
  generated/                     ← catálogo generado que consume la app
public/<mundo>-content/          ← payloads servidos (lecciones + respuestas + recursos)
<MUNDO>_MASTER_RESEARCH/         ← fuente editorial (solo lectura para la app)
docs/<mundo>/                    ← decisiones, validaciones y plan
scripts/prepare-<mundo>.mjs      ← generador (fuente → payloads)
scripts/*-integrity.mjs          ← guardias de integridad
```

### Flujo

```
MASTER_RESEARCH (markdown + JSON)
        │  npm run prepare:<mundo>
        ▼
public/<mundo>-content/  +  <mundo>/generated/catalog.json
        │  verificación SHA-256 en el cliente
        ▼
navegador (#/<mundo>/...)
```

La app **no lee** el máster: solo lee los payloads. El máster es la fuente de verdad editorial.

---

## 3. Dónde está cada mundo

### 3.1 SC-200 (curso base)

| Qué | Dónde |
|---|---|
| Interfaz | `src/App.tsx` (`Sc200App`) + `src/components/` |
| Catálogo | `src/generated/catalog.json`, `src/generated/search-index.json` |
| Payloads | `public/content/` (76 ficheros) |
| Fuente editorial | **fuera del repo**: `/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md` (o `SC200_SOURCE=…`) |
| Generador | `scripts/prepare-content.mjs` |
| Docs | `docs/CONTENIDO.md`, `docs/ARQUITECTURA.md`, `docs/content-audit.json`; cobertura educativa V2.5 en `docs/V25-COBERTURA.json` |
| Estado educativo | `scripts/v25/review-decisions.json` (decisiones de las dos introducciones pendientes) |

⚠️ **Particularidad**: es el único mundo sin carpeta `*_MASTER_RESEARCH` dentro del repo. Su fuente
está en el vault de Obsidian. Si esa ruta cambia, `npm run prepare:content` falla con un mensaje claro.

### 3.2 Redes

| Qué | Dónde |
|---|---|
| Interfaz | `src/redes/` |
| Catálogo | `src/redes/generated/` |
| Payloads | `public/redes-content/` (359 ficheros, 1,4 MB) |
| Fuente editorial | `REDES_MASTER_RESEARCH/` (383 ficheros, 4,1 MB) |
| Docs | `docs/redes/` (13 ficheros) |
| Generadores | `scripts/prepare-redes.mjs`, `scripts/prepare-redes-plan.mjs`, `scripts/author-redes-lessons.mjs` |
| Guardias/checks | `scripts/check-redes-lessons.mjs`, `scripts/check-redes-numerical.py`, `scripts/redes-reconciliation.mjs` |

### 3.3 Windows + AD

| Qué | Dónde |
|---|---|
| Interfaz | `src/windows-ad/` |
| Catálogo | `src/windows-ad/generated/` |
| Payloads | `public/windows-ad-content/` (193 ficheros, 1,2 MB) |
| Fuente editorial | `WINDOWS_AD_MASTER_RESEARCH/` (205 ficheros, 2,3 MB) |
| Docs | `docs/windows-ad/` (4 ficheros, incluido `INVENTARIO-REVISION.json`) |
| Generadores | `scripts/build-windows-ad-manifest.mjs`, `scripts/prepare-windows-ad.mjs` |
| Guardias | `scripts/windows-ad-reconciliation.mjs`, `scripts/windows-ad-transform.mjs` |

### 3.4 Splunk

| Qué | Dónde |
|---|---|
| Interfaz | `src/splunk/` (`SplunkApp`, `SplunkReader`, `SplunkMap`, `PremiumWorld`) |
| Catálogo | `src/generated/splunk/catalog.json`, `src/generated/splunk/search-index.json` |
| Payloads | `public/splunk-content/` (91 ficheros, 2,1 MB) |
| Fuente editorial | `SPLUNK_MASTER_RESEARCH/` (206 ficheros, 4,3 MB) |
| Generador | `scripts/prepare-splunk.mjs` |
| Docs | ficheros `docs/SPLUNK-*.md` (están sueltos en `docs/`, no en subcarpeta) |
| Guardias | `scripts/splunk-integrity.mjs` y las cadenas `splunk-v11/v12/v121/v122/v20` |

⚠️ **Particularidad**: es el mundo con más documentación histórica suelta en `docs/` (8 ficheros
`SPLUNK-*`). No es un error, pero es lo primero que conviene ordenar si se busca limpieza visual.

### 3.5 Linux (Mundo 5)

| Qué | Dónde |
|---|---|
| Interfaz | `src/linux/` |
| Catálogo | `src/linux/generated/catalog.json` |
| Payloads | `public/linux-content/` (235 ficheros, 1,5 MB) |
| Fuente editorial | `LINUX_MASTER_RESEARCH/` (249 ficheros, 2,5 MB) |
| Docs | `docs/linux/` (3 ficheros: plan, conciliación, validación web) |
| Generador | `scripts/build-linux-manifest.mjs`, `scripts/prepare-linux.mjs` |
| Guardias | `scripts/linux-reconciliation.mjs` + las 7 guardias encadenadas |

Dentro de `LINUX_MASTER_RESEARCH/`:

```
01_INVESTIGACION/   ← 5 tandas de investigación (fuentes, matrices, runbooks)
02_LECCIONES/       ← 96 lecciones (LNX-01 … LNX-32)
03_SOLUCIONES/      ← 96 soluciones (editoriales; el generador no las lee)
04_ACTIVIDADES/     ← BANCO-ACTIVIDADES.json (288 actividades)
05_RECURSOS/        ← GLOSARIO.md, FUENTES.json, LABORATORIOS/LNX-LAB01..42
VALIDACION/         ← CATALOGO-EDITORIAL.json, MANIFIESTO-EDITORIAL.json
```

### 3.6 Mundo SOC (Mundo 6, entrenador de entrevista)

| Qué | Dónde |
|---|---|
| Interfaz | `src/soc/` (`SocApp`, `CaseBoard`, `CaseReader`, `Review`, `Journal`, `Sources`) |
| Catálogo | `src/soc/generated/catalog.json` |
| Payloads | `public/soc-content/` (80 ficheros, 0,6 MB: 40 casos + 40 respuestas modelo) |
| Fuente editorial | `SOC_MASTER_RESEARCH/` (61 ficheros, 1,8 MB) |
| Docs | `docs/soc/` (5 ficheros: plan, repaso espaciado, revisión del propietario, conciliación, validación web) |
| Generador | `scripts/build-soc-manifest.mjs`, `scripts/prepare-soc.mjs` |
| Guardias | `scripts/soc-reconciliation.mjs` + las 7 guardias encadenadas |

Dentro de `SOC_MASTER_RESEARCH/`:

```
01_FUENTE/      ← 16 originales (8 JSON + 8 MD de las tandas de PREGUNTAS_SOC)
02_CASOS/       ← 40 casos normalizados (N1-01 … N2-20)
03_RECURSOS/    ← FUENTES.json (84 referencias), MITRE.json (78 técnicas)
VALIDACION/     ← CATALOGO-EDITORIAL.json, MANIFIESTO-EDITORIAL.json (60 hashes),
                  REVISION-PROPIETARIO.json (registro de la revisión del propietario)
```

No tiene lecciones ni fases: cada caso se responde en texto libre, se revela la
respuesta modelo con KQL/SPL/contención y se autoevalúa con la rúbrica. Rutas:
`#/soc/ruta` (tablero), `#/soc/caso/<id>`, `#/soc/repaso` y `#/soc/progreso`.

Desde el 23/10/2026 `#/soc/repaso` es **modo lectura**: lista los 40 casos por bloque y, al
abrir uno, muestra pregunta, respuesta modelo, plan, hipótesis, evidencias, contención,
escalado, falsos positivos, KQL/SPL y MITRE, sin responder ni autoevaluarse. Ya no muestra
fechas ni el contador de la pestaña. La lógica de programación (`src/soc/review.ts`,
`schedule.ts`) y el progreso guardado siguen intactos: el lector de casos la usa. No se
tocó ningún caso, así que la revisión del propietario sigue vigente.

También desde el 23/10/2026 el **lector de casos** (`#/soc/caso/<id>`, `CaseReader.tsx`) muestra la
respuesta modelo y todo su detalle directamente: sin cuadro de respuesta, botón de revelar ni
rúbrica. Solo registra la visita. El tablero ya no muestra estados ni filtro por estado, la cabecera no
muestra el contador «dominados» y la pestaña «Mi progreso» salió del menú (la ruta
`#/soc/progreso` sigue existiendo para exportar). El progreso guardado anterior se conserva sin migrar.

Revisión editorial del propietario **completada el 19/10/2026 sin cambios en la
fuente**; revisión independiente y ejecución real de los comandos siguen
pendientes. Detalle en `docs/soc/REVISION-PROPIETARIO.md`.

### 3.8 Repaso SOC (fichas para memorizar)

| Qué | Dónde |
|---|---|
| Interfaz | `src/repaso-soc/` (`RepasoSocApp`, `progress.ts`, `repaso-soc.css`; reutiliza `src/soc/soc.css`) |
| Contenido | `src/repaso-soc/cards.ts` (98 fichas: Sentinel 29, XDR 16, Splunk 23, Método 30), redactado a mano |
| Payloads / generador | ninguno: el contenido va en el bundle; no hay `prepare:*` ni cambios en `package.json` |
| Ruta | `#/soc/repaso_soc` (`?bloque=sentinel|xdr|splunk|metodo`); el dispatcher lo resuelve antes que el Mundo SOC |
| Progreso | `soc-learning-path:repaso-soc:v1` → `{ schemaVersion: 1, known: [ids] }`, solo «Me la sé» |
| Docs | `docs/repaso-soc/` (README y conciliación) |
| Guardias | `scripts/repaso-soc-reconciliation.mjs` (fija el SHA de su conciliación) + las 7 guardias encadenadas |
| Pruebas | `tests/repaso-soc.test.ts` |

Cada ficha tiene concepto, uso y, a veces, un ejemplo KQL/SPL **no ejecutado**. Sin licencias ni
precios. Revisión: ninguna todavía (ni del propietario ni independiente).

### 3.7 Simulador SOC (experiencia aparte)

| Qué | Dónde |
|---|---|
| Interfaz | `src/simulator/` |
| Datos | `public/simulator-data/` (5 ficheros) |
| Docs | `docs/SOC-SIMULATOR-V1.md` |
| Generador | `scripts/prepare-simulator.mjs` |
| Guardias | `scripts/simulator-integrity.mjs`, `scripts/simulator-reconciliation.mjs` |

---

## 4. Capa compartida (no es de ningún mundo)

| Qué | Dónde |
|---|---|
| Estilos globales | `src/styles.css`, `src/tokens.css`, `src/world.css`, `src/academies.css`, `src/adventure.css`, `src/experience.css`, `src/premium.css`, `src/full-width.css` |
| Lógica común | `src/lib/` (13 ficheros: router, progreso, catálogo, aprendizaje, presentación) |
| Componentes comunes | `src/components/` (23 ficheros) |
| Utilidades de contenido | `scripts/content.mjs` (parseo, hash, saneado), `scripts/education.mjs` |
| Tests | `tests/`: 18 unitarios `.test.ts` + 25 guiones de navegador `.mjs` |
| Build | `dist/` (artefacto), `tsconfig.tsbuildinfo` (caché) |

---

## 5. Qué es fuente y qué es artefacto

| Tipo | Ejemplos | ¿Se puede borrar? |
|---|---|---|
| **Fuente editorial** | `*_MASTER_RESEARCH/` (incluye el catálogo editorial y el registro de revisión), `SC-200.md` externo | **No**. Es la verdad del contenido. |
| **Generado** | `public/*-content/`, `*/generated/*.json` | Sí: se regenera con `npm run prepare:*`. |
| **Build** | `dist/`, `tsconfig.tsbuildinfo` | Sí. |
| **Histórico** | `output/` (handoffs y auditorías) | Se puede archivar; no lo usa la app. |
| **Docs** | `docs/**` | No borrar sin revisar referencias. |
| **Autorización de cambios** | `docs/<mundo>/CONCILIACION-INTEGRACION.json` | **No**: su hash está fijado en `scripts/<mundo>-reconciliation.mjs`. |

---

## 6. Reglas para mantenerlo ordenado

1. **No mover carpetas.** Las guardias (`scripts/*-integrity.mjs`) fijan rutas y hashes. Mover
   `public/*-content` o `*_MASTER_RESEARCH` rompe la build aunque el contenido sea correcto.
2. **Un mundo, un prefijo.** Todo lo de un mundo empieza por su nombre: `redes`, `windows-ad`,
   `splunk`, `linux`, `soc`.
3. **No mezclar payloads.** Cada mundo sirve solo desde su carpeta; el generador no debe escribir en
   la de otro.
4. **Regenerar, no editar a mano** lo que está en `public/` o en `*/generated/`.
5. **Cambios en la fuente editorial = revisión caducada.** El generador de SOC rechaza la
   declaración del propietario si su `casesDigest` no coincide con los casos publicados.
6. **Antes de cerrar un cambio**: `npm run prepare:<mundo>` → `npx tsc -b` → guardias → `npm test`.
7. **Si tocas un fichero protegido, re-pin del inventario.** Cuatro mundos fijan el SHA-256 de su
   `docs/<mundo>/CONCILIACION-INTEGRACION.json` dentro de su guardia
   (`redes`, `windows-ad`, `linux`, `soc`, `repaso-soc`-reconciliation). Cualquier edición autorizada a un fichero
   protegido obliga a actualizar el inventario y volver a fijar ese hash; si no, la guardia falla.
8. **Los ficheros de solución son editoriales**: en Linux/Redes/Windows no los lee el generador; el
   banco de actividades es el que alimenta las respuestas.

### Comandos por mundo

```bash
npm run prepare:content      # SC-200 (requiere SC-200.md)
npm run prepare:redes        # Redes
npm run prepare:windows-ad   # Windows + AD
npm run prepare:splunk       # Splunk
npm run prepare:linux        # Linux
npm run prepare:soc          # Mundo SOC
npm run dev                  # sirve todo en 127.0.0.1:5173
```

`predev` y `pretest` ya ejecutan los cinco `prepare:*` del repo (SC-200, Redes, Windows+AD, Linux, Mundo SOC).
Splunk se regenera aparte con `prepare:splunk`.

---

## 7. Orden recomendado (si se quiere limpiar)

Sin mover nada que la app necesite:

1. **Documentación**: agrupar los 8 `docs/SPLUNK-*.md` en `docs/splunk/` (solo markdown; no lo sirve
   la app). Requiere actualizar los enlaces internos que los citen.
2. **Histórico**: mover `output/` a `output/_archivo/` o fuera del repo. No afecta a la build.
3. **Mapa único**: este documento como índice; el resto de docs, enlazados desde aquí.
4. **No tocar**: `public/*-content`, `*/generated`, `*_MASTER_RESEARCH`, `scripts/*-integrity.mjs`,
   `docs/<mundo>/CONCILIACION-INTEGRACION.json`.

---

## 8. Verificación rápida del mapa

```bash
# Rutas y conteos
ls src/{redes,windows-ad,linux,splunk,soc,repaso-soc,simulator}
ls public/*-content
ls -d *_MASTER_RESEARCH

# Que cada mundo genera y valida (los seis)
npm run prepare:linux && npm run prepare:soc && npx tsc -b && npm test

# Que lo servido coincide con lo referenciado (sin huérfanos ni faltantes)
# Ejemplo con el Mundo SOC; en los demás mundos, el catálogo lista `lessons`.
python3 - <<'PY'
import json, os
mundo = 'soc'
c = json.load(open(f'src/{mundo}/generated/catalog.json'))
ref = {x['file'] for x in c['cases']} | {x['answersFile'] for x in c['cases']}
served = {f'{mundo}-content/{f}' for f in os.listdir(f'public/{mundo}-content')}
print(mundo, 'referenciados', len(ref), 'servidos', len(served),
      'huérfanos', len(served - ref), 'faltan', len(ref - served))
PY

# Guardias encadenadas
node scripts/splunk-integrity.mjs && node scripts/simulator-integrity.mjs && node scripts/soc-reconciliation.mjs
```
