# Splunk V2.0 · Integración completa R01–R11

17/10/2026. La autorización de esta fase sustituye expresamente las prohibiciones históricas de ampliar R04–R11. **Implementadas las once regiones, 80 lecciones y 240 actividades originales. Validación offline aprobada; navegador y aceptación visual pendientes.** No se atribuye revisión pedagógica humana ni ejecución real de Splunk.

## Cobertura real

Los nombres nuevos proceden de `02_INVESTIGACION/SPLUNK_MASTER_RESEARCH_FASE3_R04_R11.md`; IDs, títulos y objetivos de las lecciones proceden del currículo canónico y de los cinco manifiestos corregidos `2026-10-16-r1`. No se volvió a investigar ni se redactaron lecciones.

| Región | Identidad existente | Lecciones | MCQ | Formativas | Actividades | Laboratorios |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| R01 | Puerto de Splunk | 5 | 10 | 5 | 15 | 1 |
| R02 | Río de Telemetría | 6 | 12 | 6 | 18 | 1 |
| R03 | Bosque SPL | 7 | 14 | 7 | 21 | 1 |
| R04 | Laboratorio SPL II | 8 | 16 | 8 | 24 | 2 |
| R05 | Valle de Normalización | 7 | 14 | 7 | 21 | 2 |
| R06 | Centro SOC | 8 | 16 | 8 | 24 | 2 |
| R07 | Fábrica de Detecciones | 8 | 16 | 8 | 24 | 2 |
| R08 | Cordillera Threat Hunting | 8 | 16 | 8 | 24 | 3 |
| R09 | Torre Enterprise Security | 8 | 16 | 8 | 24 | 2 |
| R10 | Fortaleza Administradora | 8 | 16 | 8 | 24 | 3 |
| R11 | Cumbre de Automatización | 7 | 14 | 7 | 21 | 3 |
| **Total** | **11 regiones** | **80** | **160** | **80** | **240** | **22** |

62 lecciones nuevas; las primeras 18 permanecen idénticas. 400 pasos de aprendizaje presentados en cinco etapas por lección. Los 20 CSV originales, 152 filas, están disponibles en recursos; R11 identifica además los dos CSV transversales de R06 por su namespace completo, sin confundirlos con el `auth_activity.csv` de R08. Los contratos por paquete pueden aparecer en las dos regiones que los comparten; no representan datasets adicionales.

## Importación y contenido

`prepare-splunk.mjs` amplía el adaptador existente. Contrasta los 80 IDs ordenados con el currículo, manifiestos/hashes, títulos, objetivos, namespaces, actividades/opciones y fuentes locales. No modifica fuentes editoriales, currículo, IDs ni revisiones editoriales. Mantiene exactamente la fórmula de revisión de las primeras 18 y rechaza una variación de sus metadatos/payloads antes de escribir.

La importación genera **94 archivos**: 80 payloads, once recursos, catálogo, índice e informe derivado. Sigue siendo bajo demanda y separada de SC-200. Los destinos están cerrados por ID; se rechazan rutas ascendentes, symlinks, IDs fuera del conjunto y archivos adicionales. No se limpian directorios. Las escrituras idénticas se omiten; staging/rename es por archivo, no una transacción conjunta entre directorios. Ante interrupción, volver a verificar y regenerar; no borrar carpetas.

Los originales tienen estructuras distintas que el lector no debe truncar:

- R01–R03: ocho secciones; sus cinco pasos y sus bytes derivados siguen idénticos.
- R04–R05: nueve secciones; pasos 1–5, actividades 6, ambos bloques de solucionario 7–8 y fuentes 9 conservados.
- R06–R07: ocho secciones; el bloque 6 de errores se incorpora íntegro al quinto paso. El solucionario incrustado en actividades 7 se extrae para consulta secundaria; nunca se muestra ese bloque de actividades como enseñanza durante un examen.
- R08–R11: nueve secciones; errores 6 íntegros dentro del quinto paso, actividades 7, solucionario 8 y fuentes 9.

La reconstrucción completa se verifica sobre los bloques originales saneados, en orden y sin duplicar/eliminar fragmentos. El lector conserva las cinco etapas: Tu misión, Aprende, Practica, Conecta ideas, Demuestra. P01 sigue siendo formativa; Q01/Q02 son la única evaluación teórica. Referencias, solucionarios, rúbricas, documentación de límites y fuente completa siguen accesibles fuera de intentos. Los enlaces oficiales existentes de Splunk, Microsoft y MITRE se conservan; no se hizo una nueva comprobación web de su vigencia.

Se conserva el saneado de credenciales/datos ajenos. En las lecciones nuevas se retienen exclusivamente las IP de documentación RFC 5737; no se añade una excepción para direcciones privadas o arbitrarias. Los CSV sintéticos se publican byte a byte exclusivamente tras comprobar su ruta/hash completo contra su contrato y manifiesto protegidos. No hay ejecutor SPL, ingesta, REST, alert actions ni SOAR operativo.

## Prerrequisitos resueltos

El JSON canónico **no contiene un grafo completo machine-readable**. Se expanden las referencias de región de los preámbulos editoriales a los IDs canónicos reales; no se deduce la dependencia por posición en el atlas. El importador rechaza un preámbulo desconocido en vez de dejar la lección abierta silenciosamente.

| Región nueva | Regiones referidas por el preámbulo y expandidas a IDs |
| --- | --- |
| R04 | R03 |
| R05 | R02 y R04 |
| R06 | R01–R05 |
| R07 | R01–R06 |
| R08 | R01–R07 |
| R09 | R01–R07 y R08 para agrupación/escalado |
| R10 | R01–R05; «revisar R06–R07» se conserva como recomendación, sin bloquear por ella |
| R11 | R07, R09 conceptual y R10 |

Los rangos se aplican conservadoramente a todas las lecciones de la región. En particular, «según tema» de R08/R09 no identifica un subconjunto de IDs: esta implementación exige el rango documental completo y, para R09, R08 completo. Es una decisión de adaptación explícita pendiente de revisión educativa; **no se presenta como un grafo granular establecido por el JSON canónico**. No se inventan cuáles son «fundamentos» suficientes, no hay secuencia interior adicional entre las lecciones nuevas y no se exige licencia ni práctica en producto. R10 abre desde R05 sin obligar a cursar R08/R09; R11 conserva sus tres referencias documentales. R01–R03 mantienen literalmente sus arrays previos.

Los arrays efectivos figuran en `src/generated/splunk/catalog.json` y `docs/SPLUNK-CONTENIDO.md`. Estudio y teoría de cada ID previo son comprobados por el motor existente, también al abrir URL directa. El atlas permite explorar una región bloqueada sin otorgar acceso a sus lecciones.

## Presentación y dos defectos del lector

Se reutilizan `useAdventureLayout`, `PremiumLandscape`, símbolos/landmarks, caminos, puentes, nodos elevados, cofres, botones, medidas responsive y microinteracciones existentes. Las ocho configuraciones nuevas reciben metadatos paisajísticos puros del sistema SC-200 con identidad Splunk. **No se cambia ningún componente, CSS ni comportamiento SC-200.**

Las tres entradas originales de `world-model.ts`, su paleta y el renderizador `PremiumWorld`, `RegionScene`, geometría y CSS de mapas están protegidos. El río R02, sus puentes y fondo mantienen exactamente su configuración y código. Solo cambia el texto descriptivo del atlas general para reflejar once regiones; no se redibuja un paisaje anterior.

El lector conserva el `LessonFrame` ya compartido y las mismas tres columnas/cinco botones SC-200. No se construyó otro lector. Las correcciones del checkpoint anterior permanecen:

- **Paso 1 → 4:** reanudar con 1–3 estudiados elige correctamente el primer paso pendiente, 4. Entrar manualmente en Aprende, seleccionar un paso, continuar o volver atrás son intenciones independientes. `paso` válido prevalece; Continuar avanza al siguiente número. No hay cursor nuevo en persistencia ni reinicio del conjunto `seen`.
- **Títulos duplicados:** el encabezado externo aparece una vez; el renderizador omite únicamente el H2 inicial del bloque cuando ese título ya está presentado. Markdown original intacto; encabezados interiores y código conservados. La prueba recorre los 400 pasos de las 80 lecciones.

Se actualizan los mensajes obsoletos «solo 18», «R04–R11 no incorporadas», la bitácora y versión de interfaz. La condición experimental y revisión independiente pendiente siguen visibles.

## Protección, progreso y XP

[Respaldo previo verificable](../output/splunk-v20/respaldo/inventario.json): **281 copias**; SHA del mapa de copias `c2ab7acdf5b5e45cb4de95c0a5ca4769514a7010699b974ca17f84f33ec756b8`. Incluye fuentes/configuración/pruebas/documentación/derivados actuales; no perfiles, LocalStorage, secretos ni archivos de entorno. Además se protegen **324 archivos** de investigación/evidencia. No se reescriben respaldos o inventarios históricos.

SC-200 permanece en **13 regiones / 76 lecturas / 719 pasos / 272 actividades**, con fuente SHA-256 `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`. Currículo Splunk SHA-256 `f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933`, sin cambios.

`progress.ts`, `useSplunk.ts`, `data.ts` permanecen byte a byte. Misma clave `soc-learning-path:splunk:learning:v1`, esquema 1; sin migración, borrado ni lectura del progreso personal. Las pruebas cargan un guardado sintético construido con el catálogo anterior: conserva 840 XP, intentos, revisiones, ledger, última posición y todos los registros anteriores; ampliar el catálogo por sí solo no concede XP. Los registros antiguos siguen iguales al completar R04–R11.

Reglas intactas: estudio 5 + resumen 5 + teoría 15 + repaso 5 = máximo **30 XP provisionales por lección**; 100 por región tras estudio/teoría. Para 80/11, el máximo aritmético pasa a **3500 XP provisionales**, sin cambiar valores del motor. Teoría exige 2/2 al 80 %; 1/2 falla. P01 consultada concede cero XP y nunca queda aprobada automáticamente. Cero XP definitivos y `practicalStatus:not_assessed`, incluso al terminar las 80 teorías. Repetir/revisar/recargar no duplica premios.

Las guardias históricas conservan sus comprobaciones y respaldos. `splunk-v20-reconciliation.mjs` reconoce exclusivamente triples **ruta + SHA histórico + SHA final**, en un manifiesto fijado por hash, para la ampliación expresamente autorizada. No hay exclusión global de contenidos, documentación o scripts. Los conjuntos de derivados ampliados son exactos. `splunk-v20-integrity.mjs` verifica además generación determinista, todos los derivados actuales, primeras 18 completas y prohíbe admitir cambios SC-200/motores/renderizadores originales aunque apareciesen en una lista de cambios. Las pruebas negativas de rutas, hashes, estado futuro y examen siguen activas.

## Archivos afectados

- Importador ampliado: `scripts/prepare-splunk.mjs`; nuevo adaptador de fuentes/recursos/prerrequisitos `scripts/splunk-v20-sources.mjs`.
- Presentación Splunk: `world-model.ts` (solo ocho entradas/metadatos nuevos), `Resources.tsx`/`types.ts` (colecciones documentales sintéticas), `SplunkMarkdown.tsx` (dominios oficiales ya citados), `SplunkMap.tsx`, `SplunkReader.tsx`, `SplunkApp.tsx` (textos de cobertura actualizados).
- Derivados mediante generador: catálogo, índice, 62 payloads nuevos, ocho recursos nuevos e informe `docs/SPLUNK-CONTENIDO.md`. Los 18 payloads/tres recursos anteriores no cambian.
- Guardias históricas: integración de la conciliación exacta V2.0; nuevas guardia, conciliación y orquestador `validate-splunk-v20.mjs`. Manifiesto de diferencias: `output/splunk-v20/cambios-autorizados.json`.
- Pruebas anteriores adaptadas al conjunto autorizado 80/240, manteniendo regresiones explícitas 18/54/840 y rechazo de futuro fuera del conjunto (R12 sustituye a R04 como fixture inválido). Nueva `tests/splunk-v20.test.ts` y suite de navegador V2.0. Premium/paridad conservan aserciones; solo cantidades de cobertura cambian.
- Esta entrega y `docs/RETOMAR.md`. Inventario completo verificable en el informe final de integridad/cierre.

## Pruebas ejecutadas y pendientes

Informes con comandos/códigos/stdout/stderr: [última validación offline](../output/splunk-v20/ultima-offline.json), [último intento de navegador](../output/splunk-v20/ultima-browser.json). Cada ejecución usa un directorio fechado propio. El orquestador usa descriptores de archivo; no interpreta logs vacíos como pruebas aprobadas.

| Comprobación | Resultado |
| --- | --- |
| TypeScript estricto | PASS offline |
| `npm test` | **98/98 PASS**, cero fallos/omisiones; incluye 42 SC-200, regresiones anteriores y diez pruebas V2.0 |
| `npm run build` | PASS; prehooks reconstruyen SC-200 y guardias confirman derivados idénticos |
| Generación determinista | PASS, 80 IDs / 240 actividades / 94 salidas; dos builds iguales y destinos aislados |
| Cinco paquetes editoriales | PASS offline, los cinco códigos 0; 20 CSV originales íntegros |
| Regresiones editoriales | 47/47 seleccionadas PASS; se mantiene la exclusión explícita histórica del snapshot anterior al piloto; **no se afirma 48/48** |
| Integridad SC-200, fuentes, primeras 18, respaldos | PASS por hashes, metadatos, conjuntos y regeneración; guardias antes/después |
| Progreso previo, desbloqueos 11 regiones, 3500 XP únicos | PASS en motor/almacenamiento sintético; sin progreso personal |
| Cinco etapas/pasos, títulos únicos, soluciones ocultas | PASS unitario/render estático para las 80; interacción real pendiente |
| Playwright `paridad-dom` repetido | **BLOQUEADO al lanzar Chromium**, código 1, cero páginas/capturas nuevas |
| Vite agente | **BLOQUEADO `listen EPERM`** en 127.0.0.1:5187, código 1 |
| Navegación directa/entre regiones, cinco etapas/pasos en navegador | Preparado, **no ejecutado** tras bloqueo de Chromium |
| Responsive/axe, foco, zoom, reduced motion, regresión visual SC-200 | Preparado, **pendiente de ejecución/observación**; no PASS visual |
| Splunk/ES/SOAR real y revisión humana independiente | No ejecutados / pendientes; no acreditados por esta fase |

No hay capturas comparativas nuevas. Los pares SC-200/Splunk a igual resolución, galerías y matrices DOM los producirá el runner en Parrot. Su ausencia no se sustituye por imágenes sintéticas o capturas históricas. La suite nueva prepara lector a **320/390/768/1440/1920**, atlas además a **1024/2560** por `paridad-dom`; controles/nodos, textos extensos, cinco pasos en orden, fuente/soluciones bloqueadas, recarga, teclado, aislamiento multiventana, 80 teorías y regiones/recursos completos. Se conserva la suite dirigida de reanudación/manual/retorno del lector.

## Fallo real histórico de paridad y accesibilidad

La ejecución original [Parrot V1.2.1](../output/playwright/splunk-v121/2026-10-16T22-21-56-027Z/ejecucion.json) **sí abrió Chromium 148**, devolviendo `paridad-dom:1`. Falló `near(master.progress.width,adapted.progress.width,'Panel')`, tolerancia 1 px, a **320 px**: **282.59375 frente a 295.203125**, delta **12.609375**. Atlas exterior 304 y nodos equivalentes; el ancho intrínseco de textos/estadísticas expande la rejilla del panel. Es un defecto del **atlas**, no del lector, y no un EPERM. Se conservan captura/matriz/logs originales y el diagnóstico reproducible.

**Sigue abierto.** No se cambian los mapas R01–R03 ni se relaja/omite esa aserción para aceptar la ampliación. El intento V2.0 queda en `blocked_browser_launch` antes de medir; no demuestra que ese fallo haya desaparecido. El runner ejecuta paridad y lector como grupos independientes cuando Chromium está disponible: un fallo de atlas no debe ocultar resultados del lector ni convertirse en PASS global.

También se conserva el diagnóstico V1.1: recursos R03 a 320 px fallaron contraste de `.language-spl` y foco del `pre` desplazable. Sus correcciones de color/foco siguen intactas y axe exige `violations=[]`. Las 50 vistas axe sin violaciones de la corrida V1.2.1 son evidencia histórica parcial, no validación V2.0. Los `incomplete`, contraste manual sobre paisajes, zoom, tacto y lectores de pantalla requieren revisión; no se declara conformidad WCAG completa.

## Continuar en Parrot OS

Sin dependencias nuevas, sudo ni cambios globales. Mantener el origen/perfil habitual para uso personal; estos runners crean contextos sintéticos aislados, nunca leen el perfil personal.

Verificación offline:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/splunk-v20-integrity.mjs
node scripts/validate-splunk-v20.mjs
```

Terminal A:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
npm run dev:pilot -- --port 5187 --strictPort
```

Terminal B:

```sh
cd /home/tommy/Documentos/SOC_LEARNING_PATH
node scripts/validate-splunk-v20.mjs --browser --base-url http://127.0.0.1:5187/
```

El orquestador intenta `paridad-dom`, la integración de 80 lecciones/mapas/recursos, la prueba dirigida de cinco pasos y las tres regresiones SC-200; conserva resultados independientes y falla si cualquiera falla. Ante un bloqueo de lanzamiento no repite el mismo Chromium. Si solo se quiere el defecto del lector:

```sh
node tests/splunk-reader-fixes-browser.mjs --base-url http://127.0.0.1:5187/
```

Consultar `output/splunk-v20/ultima-browser.json`, sus informes por suite, `matriz.md`, `index.html`, capturas e `incomplete`. Revisar visualmente ambos lectores y cada región a igual resolución. Rutas: `#/ruta` (SC-200), `#/splunk/ruta`, `#/splunk/region/SP-R04`…`SP-R11`, `#/splunk/leccion/SP-R11-L07?fase=mision`, `#/splunk/recursos/SP-R11`. Una lección bloqueada debe mostrar sus requisitos, no abrir su contenido por URL.

Riesgos pendientes: granularidad educativa del grafo, revisión humana de preguntas/anclas/rúbricas, sensibilidad a textos extensos/zoom, fallo conocido del panel 320 y aceptación visual de los ocho paisajes nuevos. La integración está completa en código y datos; **no se declara la academia aprobada pedagógicamente ni visualmente validada**. Sin commits, publicación, backend, ataques ni servicios Splunk. Detenerse tras esta fase.
