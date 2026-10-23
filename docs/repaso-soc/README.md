# Repaso SOC

Mundo de fichas para leer y memorizar antes de una entrevista SOC. Creado el 23/10/2026 a
petición del propietario. No tiene preguntas ni casos: eso vive en el Mundo SOC.

- **Ruta:** `#/soc/repaso_soc`, con `?bloque=sentinel|xdr|splunk|metodo`. Pestaña propia en el
  selector, justo después de «Mundo SOC».
- **Contenido:** `src/repaso-soc/cards.ts`. 98 fichas en 4 bloques (Sentinel 29, Defender XDR 16,
  Splunk 23, Método SOC 30). Cada una tiene concepto y uso; algunas, un ejemplo KQL/SPL.
  Fuera de alcance: licencias, precios y administración.
- **Progreso:** `soc-learning-path:repaso-soc:v1` → `{ schemaVersion: 1, known: [ids] }`. Solo
  guarda qué fichas marcaste con «Me la sé». Ids desconocidos o datos corruptos se descartan.
- **Estado:** redactado por el agente; sin revisión del propietario ni independiente. Las
  consultas son ejemplos **no ejecutados**.

## Integración y guardias

`src/App.tsx` y `src/components/AcademySelector.tsx` cambian solo por los reemplazos exactos de
`withRepasoSocDispatcher` y `withRepasoSocSelector` (`scripts/repaso-soc-reconciliation.mjs`).
`CONCILIACION-INTEGRACION.json` autoriza esos dos ficheros y las cuatro guardias que ahora
reconocen el cambio (`simulator-integrity`, `splunk-v20-integrity`, `splunk-v20-reconciliation`,
`splunk-checkpoint-reconciliation`). Su SHA-256 está fijado en el script. Ejecutar
`node scripts/repaso-soc-reconciliation.mjs` comprueba que cada fichero está en su hash `after`.

Respaldo previo y capturas: `output/repaso-soc-2026-10-23/` (`respaldo/`, `sha256-antes.txt`,
`capturas/`).

## Cambio relacionado en el Mundo SOC

`#/soc/repaso` (`src/soc/Review.tsx`) pasó a modo lectura de las 40 respuestas modelo, sin
fechas ni contador en la pestaña. No se tocó ningún caso ni el esquema de progreso, así que la
revisión del propietario sigue vigente.
