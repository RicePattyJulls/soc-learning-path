import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Owner editorial review for the Linux and Windows + AD worlds, with the same
// closure pattern as the SOC world: record + catalog declaration + generator
// guard. Without --close it only reports the current scope and lessons digest.
// With --close it writes the record the owner attests to; it never decides that
// a review happened. Run `npm run prepare:<world>` afterwards.
//
//   node scripts/owner-review.mjs linux
//   node scripts/owner-review.mjs linux --close --date 2026-10-20 [--changes LNX-01-L02,LNX-07-L01]
const worlds = { linux: 'LINUX_MASTER_RESEARCH', 'windows-ad': 'WINDOWS_AD_MASTER_RESEARCH' };
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const world = args[0];
const option = name => { const i = args.indexOf(name); return i === -1 ? undefined : args[i + 1]; };
if (!worlds[world]) throw new Error(`Mundo desconocido: ${world ?? '(ninguno)'}; usa ${Object.keys(worlds).join(' o ')}`);

const base = path.join(root, worlds[world]);
const sha = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const read = relative => readFile(path.join(base, relative), 'utf8');
const catalogPath = 'VALIDACION/CATALOGO-EDITORIAL.json';
const recordPath = 'VALIDACION/REVISION-PROPIETARIO.json';
const catalog = JSON.parse(await read(catalogPath));
const bank = JSON.parse(await read('04_ACTIVIDADES/BANCO-ACTIVIDADES.json'));
const sources = JSON.parse(await read('05_RECURSOS/FUENTES.json'));

// Same digest the generator checks: lesson hashes taken from the files on disk.
const lessons = [];
for (const lesson of catalog.lessons) lessons.push({ id: lesson.id, file: lesson.file, sha256: sha(await read(lesson.file)) });
const lessonsDigest = sha([...lessons].sort((a, b) => a.id.localeCompare(b.id)).map(item => `${item.id}=${item.sha256}`).join(':'));
const scope = { stages: catalog.stages.length, lessons: lessons.length, activities: bank.activities.length,
  labs: catalog.labFiles.length, sources: sources.sources.length };

if (!args.includes('--close')) {
  console.log(serialize({ world, educationalReview: catalog.educationalReview, scope, lessonsDigest }));
  process.exit(0);
}

const reviewedAt = option('--date');
if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt ?? '')) throw new Error('--close necesita --date AAAA-MM-DD');
const changedIds = (option('--changes') ?? '').split(',').filter(Boolean);
const changes = changedIds.map(id => {
  const lesson = lessons.find(item => item.id === id);
  if (!lesson) throw new Error(`Lección desconocida en --changes: ${id}`);
  return { id, file: lesson.file, sha256: lesson.sha256 };
});
const result = changes.length ? 'aprobado_con_correcciones' : 'aprobado_sin_cambios_en_la_fuente';
const record = {
  schemaVersion: 1, courseId: world, kind: 'owner_editorial_review', independent: false,
  reviewer: 'Propietario del proyecto', reviewedAt, scope,
  method: [
    `Lectura de las ${scope.lessons} lecciones servidas en ${scope.stages} etapas, con sus actividades y soluciones.`,
    'Comprobación de claridad, secuencia de conceptos, alineación objetivo-actividad, razonamiento de las respuestas y rúbricas.',
    'Revisión de la bibliografía y de los laboratorios enlazados.',
  ],
  result, changes,
  evidence: {
    lessonsDigest,
    lessonsDigestFormat: 'sha256 de «<id>=<sha256 de la lección>» unidos por «:», ordenados por id',
    sourceFilesUnchanged: changes.length === 0,
  },
  stillOpen: [
    { id: 'practical_status', detail: 'Los laboratorios no se han ejecutado en un entorno real: labsExecuted = false y practicalStatus = not_assessed.' },
    { id: 'independent_review', detail: 'La revisión es del propietario (independent = false). No sustituye a una revisión educativa independiente.' },
    { id: 'synthetic_content', detail: 'Todo el contenido es sintético de laboratorio.' },
  ],
};
catalog.educationalReview = { kind: record.kind, independent: false, status: 'owner_review_complete',
  reviewedAt, result, record: recordPath,
  scope: catalog.educationalReview?.scope };
await writeFile(path.join(base, recordPath), serialize(record));
await writeFile(path.join(base, catalogPath), serialize(catalog));
console.log(serialize({ world, written: [recordPath, catalogPath], result, lessonsDigest, next: `npm run prepare:${world}` }));
