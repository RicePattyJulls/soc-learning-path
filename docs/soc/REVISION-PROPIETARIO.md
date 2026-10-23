# Mundo SOC · Revisión editorial del propietario

Cierre de la revisión editorial del banco de casos SOC. El registro
autoritativo, con la evidencia, está en la fuente editorial:

- `SOC_MASTER_RESEARCH/VALIDACION/REVISION-PROPIETARIO.json` — registro completo
  (alcance, método, resultado, evidencia y pendientes).
- `SOC_MASTER_RESEARCH/VALIDACION/CATALOGO-EDITORIAL.json` — declara
  `editorialStatus: synthetic_owner_reviewed` y el bloque `educationalReview`.

## Resultado

| Campo | Valor |
|---|---|
| Revisor | Propietario del proyecto (`independent: false`) |
| Fecha | 19/10/2026 |
| Resultado | `aprobado_sin_cambios_en_la_fuente` (0 cambios) |
| Estado editorial | `synthetic_owner_reviewed` |
| Estado educativo | `owner_editorial_review / owner_review_complete` |
| Alcance | 40 casos · 8 bloques · 2 niveles · 161 consultas · 347 pasos · 213 criterios · 84 fuentes · 78 técnicas ATT&CK · 59 archivos |

Se revisó el banco tal y como se sirve en el Mundo SOC: escenario, pregunta,
respuesta modelo, plan de pasos, evidencia, KQL/SPL, contención, rúbrica,
bibliografía y técnicas enlazadas. No hubo correcciones que aplicar, así que
ningún archivo de la fuente cambió: los 59 hashes del
`MANIFIESTO-EDITORIAL.json` seguían intactos después de la revisión.

## Evidencia y guardia

La declaración no vale por sí sola. Dos ataduras la verifican:

- `evidence.casesDigest` =
  `9818228e3719538dc30eef68a87fa0db9a49c40df0c4681619d0d22bdf229553`
  (SHA-256 de `«<id>=<sha256 del caso>»` unidos por `:`, ordenados por id) y
  `evidence.sourceFilesUnchanged: true`.
- `npm run prepare:soc` **falla** si el catálogo declara la revisión del
  propietario y el registro no está en el manifiesto, declara cambios o su
  `casesDigest` no coincide con los casos publicados.
- `tests/soc.test.ts` recalcula ese digest desde el catálogo servido y comprueba
  que el registro, el catálogo editorial y la web dicen lo mismo.

Consecuencia práctica: **si se toca cualquier caso, la declaración caduca**. Hay
que rehacer la revisión y actualizar el registro (resultado, cambios y digests).

## Sigue pendiente

- Revisión educativa **independiente** (`independent: false`).
- Ejecución real: `commandsExecuted: false`, `practicalStatus: not_assessed`. Las
  consultas KQL/SPL no se han probado contra Sentinel ni Splunk; hay que validar
  ingesta, esquema, campos y permisos en el entorno propio.
- Todo el contenido es sintético de laboratorio; así se declara en la página de
  fuentes del Mundo SOC.

## Cómo rehacerla si el contenido cambia

```bash
node SOC/tools/soc-import.mjs      # solo si cambian los originales de PREGUNTAS_SOC
npm run prepare:soc                # regenera catálogo, manifiesto y payloads
npx tsc -b && npm test             # el digest de la revisión debe volver a cuadrar
node /ruta/SOC/tools/soc-pass.mjs  # pasada de navegador
```
