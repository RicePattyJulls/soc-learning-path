import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { ROOT, BACKUP, checkProtected, sha256 } from './splunk-integrity.mjs';
import { catalog } from '../src/splunk/data.ts';
import { emptySplunk, applySplunk, splunkStats } from '../src/splunk/progress.ts';

if (catalog.lessons.length !== 5 || catalog.regions.length !== 1) throw new Error('Informe histórico R01: conservar evidencias. Usa npm run validate:splunk:v11 para la ampliación.');
const out = path.join(ROOT, 'output/splunk-pilot-r01');
await mkdir(out, { recursive: true });
const read = async relative => JSON.parse(await readFile(path.join(ROOT, relative), 'utf8'));
async function bundle(directory) {
  const html = await readFile(path.join(ROOT, directory, 'index.html'), 'utf8');
  const entries = [...html.matchAll(/(?:src|href)="\.\/(assets\/[^" ]+\.(?:js|css))"/g)].map(m => m[1]);
  const assets = await Promise.all((await readdir(path.join(ROOT, directory, 'assets'))).filter(name => /\.(js|css)$/.test(name)).map(async name => {
    const bytes = await readFile(path.join(ROOT, directory, 'assets', name));
    return { name, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, initialHtmlEntry: entries.includes('assets/' + name) };
  }));
  const initial = assets.filter(a => a.initialHtmlEntry);
  return { directory, assets, initialBytes: initial.reduce((n,a) => n + a.bytes, 0), initialGzipBytes: initial.reduce((n,a) => n + a.gzipBytes, 0), scope: 'Entradas JS/CSS referenciadas por HTML. No mide tiempos, tareas largas, FPS ni descarga real.' };
}
const protectedResult = await checkProtected();
const baseline = await bundle('output/splunk-pilot-r01/baseline'), current = await bundle('dist');
const sourceInventory = await read(path.join(BACKUP, 'inventario.json'));
const review = [], publicFiles = [], sourceIds = new Set(), activityIds = new Set();
let store = emptySplunk(), now = 100;
for (const lesson of catalog.lessons) {
  const data = await read('public/' + lesson.file);
  const act = action => { store = applySplunk(store, catalog, lesson, data, action, ++now); };
  for (const stepId of lesson.stepIds) act({ type: 'seen', stepId });
  act({ type: 'summary' }); act({ type: 'start', attemptId: 'synthetic-' + lesson.id });
  for (const question of data.questions) act({ type: 'answer', questionId: question.id, optionId: question.solution });
  act({ type: 'finish' }); act({ type: 'formative' }); act({ type: 'review' });
  publicFiles.push({ id: lesson.id, sourceHash: lesson.sourceVersion, payloadHash: lesson.payloadHash, actualPayloadHash: sha256(await readFile(path.join(ROOT, 'public', lesson.file))) });
  review.push({ id: lesson.id, title: lesson.title, revision: lesson.revision, sourceFile: data.sourceFile, humanReview: 'pending_independent_review', reviewer: null, reviewedAt: null, approved: false, practicalValidation: 'not_executed', questions: data.questions.map(q => ({ id: q.id, prompt: q.prompt, options: q.options, solutionOptionId: q.solution, explanation: q.explanation, anchors: q.anchors, sourceRefs: q.sourceRefs, pending: ['Verificar corrección técnica contra producto/versión', 'Revisar distractores y pistas por longitud', 'Confirmar que las citas sustentan la respuesta', 'Aprobar uso educativo; no certificar práctica'] })), formative: data.formative.map(f => ({ id: f.id, prompt: f.prompt, referenceAnswer: f.referenceAnswer, rubric: f.rubric, autoGradable: false, pending: ['Revisar suficiencia y claridad de la rúbrica; sin nota automática'] })) });
}
const packages = [];
for (const suffix of ['R01_R03','R04_R05','R06_R07','R08_R09','R10_R11']) {
  const directory = `SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_${suffix}`;
  const manifest = await read(directory + '/VALIDACION/MANIFIESTO.json');
  for (const lesson of manifest.lesson_catalog) { sourceIds.add(lesson.id); for (const id of lesson.activity_ids) activityIds.add(id); }
  packages.push({ name: `SPLUNK_LECCIONES_${suffix}`, lessons: manifest.lesson_catalog.length, activities: manifest.lesson_catalog.reduce((n,l) => n + l.activity_ids.length,0), manifestHash: sha256(await readFile(path.join(ROOT,directory,'VALIDACION/MANIFIESTO.json'))) });
}
const initialCode = (await Promise.all(current.assets.filter(a => a.initialHtmlEntry && a.name.endsWith('.js')).map(a => readFile(path.join(ROOT,'dist/assets',a.name),'utf8')))).join('\n');
const allCode = (await Promise.all(current.assets.filter(a => a.name.endsWith('.js')).map(a => readFile(path.join(ROOT,'dist/assets',a.name),'utf8')))).join('\n');
const tap = await readFile(path.join(out,'unit.tap'),'utf8');
const units = Object.fromEntries(['tests','pass','fail','skipped'].map(key => [key, Number(tap.match(new RegExp(`^# ${key} (\\d+)$`, 'm'))?.[1] ?? NaN)]));
if (!Number.isFinite(units.tests) || units.fail !== 0) throw new Error('No se publica un informe offline aprobado sin pruebas unitarias completas');
const report = { date: new Date().toISOString(), status: 'offline_validated_browser_pending', unitTests: units, protection: protectedResult, backup: sourceInventory.backup, sourceCatalog: { lessons: sourceIds.size, activityIds: activityIds.size, packages }, imported: { lessons: catalog.lessons.length, questions: 10, formative: 5, files: publicFiles }, xpSynthetic: { ...splunkStats(store, catalog), note: 'Estado construido únicamente en memoria con respuestas sintéticas; no se lee LocalStorage.' }, bundles: { baseline, current, deltaInitialBytes: current.initialBytes - baseline.initialBytes, deltaInitialGzipBytes: current.initialGzipBytes - baseline.initialGzipBytes, other75LessonIdsInCompiledJs: /SP-R(?:0[2-9]|1[01])-L\d\d/.test(allCode), lessonPayloadTextInInitialEntry: initialCode.includes('Una investigación no empieza copiando') }, browser: { status: 'blocked', reason: 'Servidor local: listen EPERM. Chromium: setsockopt Operation not permitted. Chrome conectado: no disponible.', checksExecuted: 0, screenshots: [], responsive: 'pending', accessibilityAxe: 'pending', sc200EndToEnd: 'pending' }, humanReview: 'pending_independent_review', splunkReal: 'not_executed' };
await writeFile(path.join(out, 'revision-educativa.json'), JSON.stringify(review,null,2)+'\n');
await writeFile(path.join(out, 'resultados-offline.json'), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ protection: protectedResult, imported: report.imported.lessons, sourceIds: sourceIds.size, activityIds: activityIds.size, xp: report.xpSynthetic, deltaInitialBytes: report.bundles.deltaInitialBytes, deltaInitialGzipBytes: report.bundles.deltaInitialGzipBytes }));
