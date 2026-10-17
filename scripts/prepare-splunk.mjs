import { readFile, mkdir, rename, writeFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sanitize } from './content.mjs';
import { ROOT, sha256, checkProtected } from './splunk-integrity.mjs';
import { checkV11Protected } from './splunk-v11-integrity.mjs';
import { additionalRegions, newPrerequisites, additionalResource, documentationIPs } from './splunk-v20-sources.mjs';

export const PILOT_IDS = Array.from({ length: 5 }, (_, i) => `SP-R01-L0${i + 1}`);
export const LEGACY_IDS = [...PILOT_IDS, ...Array.from({ length: 6 }, (_, i) => `SP-R02-L0${i + 1}`), ...Array.from({ length: 7 }, (_, i) => `SP-R03-L0${i + 1}`)];
export const IMPORT_IDS = [5,6,7,8,7,8,8,8,8,8,7].flatMap((count, r) => Array.from({length:count}, (_, l) => `SP-R${String(r+1).padStart(2,'0')}-L${String(l+1).padStart(2,'0')}`));
export const REGIONS = [
  { id: 'SP-R01', title: 'Puerto de Splunk', theme: 'harbor', description: 'Los fundamentos antes de zarpar.', lab: 'LAB_R01_ARQUITECTURA.md' },
  { id: 'SP-R02', title: 'Río de Telemetría', theme: 'river', description: 'Sigue cada evento desde su origen.', lab: 'LAB_R02_INGESTA.md' },
  { id: 'SP-R03', title: 'Bosque SPL', theme: 'forest', description: 'De la pregunta a una evidencia con límites.', lab: 'LAB_R03_SPRAY_OFFLINE.md' },
  ...additionalRegions,
];
const PACKAGES = ['R01_R03', 'R04_R05', 'R06_R07', 'R08_R09', 'R10_R11'].map(s => `SPLUNK_LECCIONES_${s}`);
const RESEARCH = 'SPLUNK_MASTER_RESEARCH';
const CURRICULUM = `${RESEARCH}/03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json`;
const CANONICAL_SHA = 'f65ea0c900077caaa680b3ecee1c8f1ccec48d8d1fad689f1ed0bfa301a4d933';
export function allowedDestination(file) {
  return IMPORT_IDS.some(id => file === `public/splunk-content/${id}.json`)
    || REGIONS.some(r => r.id !== 'SP-R01' && file === `public/splunk-content/resources-${r.id}.json`)
    || ['public/splunk-content/resources.json', 'src/generated/splunk/catalog.json', 'src/generated/splunk/search-index.json', 'docs/SPLUNK-CONTENIDO.md'].includes(file);
}
export async function safePath(root, relative) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).some(p => p === '..' || p === '') || relative.includes('\\')) throw new Error(`Ruta no permitida: ${relative}`);
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    try { if ((await lstat(current)).isSymbolicLink()) throw new Error(`Enlace no permitido: ${relative}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return current;
}
const json = async (root, relative) => JSON.parse(await readFile(await safePath(root, relative), 'utf8'));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };

// Exception only for integrity-checked R03 teaching about this published fixture.
// Other addresses, credentials, tokens and personal data still use the SC sanitizer.
export function sanitizeSplunk(source, documentationIPs = []) {
  ensure(!source.includes('SPLUNKDOCIPPLACEHOLDER'), 'Marcador reservado en la fuente');
  let protectedText = source;
  documentationIPs.forEach((ip, i) => { protectedText = protectedText.replaceAll(ip, `SPLUNKDOCIPPLACEHOLDER${i}END`); });
  const result = sanitize(protectedText);
  documentationIPs.forEach((ip, i) => { result.text = result.text.replaceAll(`SPLUNKDOCIPPLACEHOLDER${i}END`, ip); });
  return result;
}
export function splitLesson(original, id) {
  const { text, redactions } = sanitizeSplunk(original, id === 'SP-R03-L07' ? ['203.0.113.9'] : IMPORT_IDS.includes(id)&&!LEGACY_IDS.includes(id)?documentationIPs(original):[]);
  const matches = [...text.matchAll(/^## ([1-9])\. .+$/gm)];
  const legacy = LEGACY_IDS.includes(id);
  const expected = legacy || /^SP-R0[67]-/.test(id) ? '12345678' : '123456789';
  ensure(matches.map(m => m[1]).join('') === expected, `${id}: secciones inesperadas`);
  const chunks = [text.slice(0, matches[0].index), ...matches.map((m, i) => text.slice(m.index, matches[i + 1]?.index ?? text.length))];
  ensure(chunks.join('') === text, `${id}: reconstrucción incompleta`);
  const sections = matches.map((m, i) => ({ id: `${id}-S0${i + 1}`, title: m[0].slice(3), markdown: chunks[i + 1], line: text.slice(0, m.index).split('\n').length, endLine: text.slice(0, matches[i + 1]?.index ?? text.length).trimEnd().split('\n').length }));
  const activityIndex = legacy || /^SP-R0[45]-/.test(id) ? 5 : 6;
  const activitySection = sections[activityIndex];
  ensure(/Actividades/.test(activitySection.title), `${id}: actividades sin delimitar`);
  const teachingSections = sections.slice(0,5);
  if (activityIndex === 6) teachingSections[4] = {...teachingSections[4], markdown:sections[4].markdown+sections[5].markdown, endLine:sections[5].endLine};
  const referencesSection = sections.at(-1);
  const solutionsMarkdown = /^SP-R0[67]-/.test(id) ? activitySection.markdown.slice(activitySection.markdown.indexOf('### Solucionario con razonamiento')) : sections.slice(activityIndex+1,-1).map(s=>s.markdown).join('');
  ensure(solutionsMarkdown.includes('Solucionario'), `${id}: falta solucionario`);
  return { text, preamble: chunks[0], sections, teachingSections, activitySection, referencesSection, solutionsMarkdown, redactions };
}
function adaptActivity(activity, lesson, source, refs) {
  ensure(activity.source_namespace === lesson.namespace && activity.lesson_id === lesson.id && activity.region_id === lesson.id.slice(0, 6), `${activity.id}: ámbito incorrecto`);
  ensure(activity.human_review_status === 'pending_independent_review' && activity.practical_mastery_eligible === false && activity.splunk_executed === false, `${activity.id}: evidencia incompatible`);
  ensure(activity.source_refs.every(id => refs.some(ref => ref.id === id)), `${activity.id}: referencia sin resolver`);
  const clean = text => LEGACY_IDS.includes(lesson.id) ? sanitize(text).text : sanitizeSplunk(text,documentationIPs(text)).text;
  const common = { id: activity.id, lessonId: lesson.id, prompt: clean(activity.question), sourceRefs: activity.source_refs.map(id => `${activity.source_namespace}:${id}`), humanReview: activity.human_review_status };
  if (activity.type === 'open_practice') {
    ensure(activity.auto_gradable === false && activity.assessment_role === 'formative_only', `${activity.id}: abierta calificable`);
    return { ...common, type: 'formative', autoGradable: false, rubric: activity.rubric.map(clean), referenceAnswer: sanitizeSplunk(activity.reference_answer, lesson.id === 'SP-R03-L07' ? ['203.0.113.9'] : LEGACY_IDS.includes(lesson.id)?[]:documentationIPs(activity.reference_answer)).text };
  }
  ensure(activity.type === 'multiple_choice' && activity.auto_gradable === true && activity.options.length === 4 && activity.option_ids.length === 4, `${activity.id}: contrato MCQ`);
  ensure(new Set(activity.option_ids).size === 4 && activity.options[activity.correct_index] === activity.correct_answer && activity.option_ids[activity.correct_index] === activity.solution_option_id, `${activity.id}: clave desincronizada`);
  // Exact local anchors from teaching, never from the answer key. Both the
  // conceptual paragraph and the guided case remain available for human review.
  const anchors = [source.sections[1], source.sections[3]].map(section => ({ file: lesson.file, sourceHash: sha256(source.text), line: section.line, endLine: section.endLine, quote: section.markdown }));
  for (const anchor of anchors) ensure(source.text.split('\n').slice(anchor.line - 1, anchor.endLine).join('\n').trimEnd() === anchor.quote.trimEnd() && anchor.endLine < source.activitySection.line, `${activity.id}: cita no respaldada`);
  return { ...common, type: 'choice', autoGradable: true, options: activity.options.map((text, i) => ({ id: activity.option_ids[i], text: clean(text) })), solution: activity.solution_option_id, explanation: clean(activity.explanation), anchors };
}

export async function buildSplunk(root = ROOT, requestedIds = IMPORT_IDS) {
  ensure(JSON.stringify(requestedIds) === JSON.stringify(IMPORT_IDS), 'Solo se autoriza el lote exacto R01–R11 de 80 lecciones');
  const canonicalBytes = await readFile(await safePath(root, CURRICULUM));
  ensure(sha256(canonicalBytes) === CANONICAL_SHA, 'Currículo canónico modificado');
  const canonical = JSON.parse(canonicalBytes).regions.flatMap(r => r.lessons);
  const entries = [], manifests = [];
  for (const name of PACKAGES) {
    const pkg = `${RESEARCH}/${name}`;
    const manifest = await json(root, `${pkg}/VALIDACION/MANIFIESTO.json`);
    ensure(manifest.canonical_curriculum_sha256 === CANONICAL_SHA && manifest.editorial_schema_version === '1.1', `${name}: manifiesto incompatible`);
    for (const [file, expected] of Object.entries(manifest.sha256_by_path)) ensure(sha256(await readFile(await safePath(root, `${pkg}/${file}`))) === expected, `${name}/${file}: hash incorrecto`);
    const sums = await readFile(await safePath(root, `${pkg}/VALIDACION/SHA256SUMS.txt`), 'utf8');
    for (const line of sums.trim().split('\n')) {
      const match = line.match(/^([a-f0-9]{64})\s+\*?(.+)$/);
      ensure(match && sha256(await readFile(await safePath(root, `${pkg}/${match[2]}`))) === match[1], `${name}: SHA256SUMS incorrecto`);
    }
    for (const lesson of manifest.lesson_catalog) entries.push({ ...lesson, namespace: name });
    manifests.push({ package: name, hash: sha256(await readFile(await safePath(root, `${pkg}/VALIDACION/MANIFIESTO.json`))), revision: manifest.editorial_revision });
  }
  ensure(entries.length === 80 && new Set(entries.map(e => e.id)).size === 80, 'Inventario de 80 IDs inválido');
  for (const entry of entries) {
    const c = canonical.find(l => l.id === entry.id);
    ensure(c && c.title === entry.title && c.learning_outcome === entry.learning_outcome, `${entry.id}: desacuerdo con currículo`);
  }
  const pkg = `${RESEARCH}/${PACKAGES[0]}`;
  const banks = new Map();
  for (const name of PACKAGES) {
    const bank = await json(root, `${RESEARCH}/${name}/ACTIVIDADES/BANCO_ACTIVIDADES_${name.slice('SPLUNK_LECCIONES_'.length)}.json`);
    ensure(bank.schema_version === '1.1' && bank.assessment_policy.theory_pass_percent === 80, 'Política editorial inválida');
    banks.set(name, bank);
  }
  const payloads = [], lessons = [];
  for (const id of IMPORT_IDS) {
    const entry = entries.find(l => l.id === id);
    const pkg = `${RESEARCH}/${entry.namespace}`, bank = banks.get(entry.namespace);
    const original = await readFile(await safePath(root, `${pkg}/${entry.file}`), 'utf8');
    ensure(original.startsWith(`# ${id} — ${entry.title}\n`), `${id}: encabezado incorrecto`);
    const source = splitLesson(original, id);
    const references = [];
    for (const line of source.referencesSection.markdown.split('\n')) {
      const match = line.match(/^- \*\*(?:\[([^\]]+)\][^*]*|([A-Z]\d+):)\*\*.*?(https:\/\/\S+)/);
      if (match) references.push({id:match[1]||match[2],key:`${entry.namespace}:${match[1]||match[2]}`,url:match[3]});
    }
    ensure(references.length>0 && references.every(r => ['help.splunk.com','learn.microsoft.com','attack.mitre.org','www.microsoft.com','research.splunk.com'].includes(new URL(r.url).hostname)), `${id}: referencia externa no autorizada`);
    const activities = bank.activities.filter(a => a.lesson_id === id);
    ensure(activities.length === 3 && JSON.stringify(activities.map(a => a.id).sort()) === JSON.stringify([...entry.activity_ids].sort()), `${id}: IDs de actividad incorrectos`);
    const adapted = activities.map(a => adaptActivity(a, entry, source, references));
    const questions = adapted.filter(a => a.type === 'choice'), formative = adapted.filter(a => a.type === 'formative');
    ensure(questions.length === 2 && formative.length === 1, `${id}: cobertura inesperada`);
    const prerequisiteLine = original.match(/\*\*Prerrequisitos orientativos:\*\* (.+)/)?.[1] || '';
    const prerequisites = LEGACY_IDS.includes(id) ? [...new Set([
      ...(prerequisiteLine.match(/SP-R\d\d-L\d\d/g) || []),
      ...(prerequisiteLine.includes('SP-R01 completo') || prerequisiteLine.includes('SP-R01 y SP-R02 completos') ? PILOT_IDS : []),
      ...(prerequisiteLine.includes('SP-R01 y SP-R02 completos') ? IMPORT_IDS.filter(p => p.startsWith('SP-R02-')) : []),
    ])] : newPrerequisites(original, id, IMPORT_IDS);
    ensure(prerequisites.every(p => IMPORT_IDS.includes(p) && IMPORT_IDS.indexOf(p) < IMPORT_IDS.indexOf(id)), `${id}: dependencia fuera del lote o ciclo`);
    const revision = sha256(JSON.stringify({ adapter: 1, original, activities, references })).slice(0, 24);
    const payload = { schemaVersion: 1, courseId: 'splunk', id, title: entry.title, revision, sourceVersion: sha256(original), sanitizedHash: sha256(source.text), sourceFile: `${pkg}/${entry.file}`, editorialRevision: bank.editorial_revision, humanReview: 'pending_independent_review', splunkExecuted: false, practicalStatus: 'not_assessed', objective: entry.learning_outcome, preamble: source.preamble, sections: source.teachingSections, questions, formative, solutionsMarkdown: source.solutionsMarkdown, referencesMarkdown: source.referencesSection.markdown, originalMarkdown: source.text, reconstruction: { verified: true, sections: source.sections.length, redactions: source.redactions }, references };
    const serialized = JSON.stringify(payload, null, 2) + '\n';
    const file = `splunk-content/${id}.json`;
    payloads.push([`public/${file}`, serialized]);
    lessons.push({ id, title: entry.title, regionId: id.slice(0, 6), objective: entry.learning_outcome, prerequisites, revision, sourceVersion: payload.sourceVersion, payloadHash: sha256(serialized), file, humanReview: payload.humanReview, stepIds: payload.sections.map(s => s.id), questionIds: questions.map(q => q.id), formativeIds: formative.map(a => a.id) });
  }
  const lab = sanitize(await readFile(await safePath(root, `${pkg}/PRACTICAS/LAB_R01_ARQUITECTURA.md`), 'utf8')).text;
  const datasets = await json(root, `${pkg}/VALIDACION/DATASETS.json`);
  const resourcesText = JSON.stringify({ courseId: 'splunk', regionId: 'SP-R01', lab, datasets, note: 'Contrato documental del paquete. R01 no importa los CSV ni las lecciones R02/R03.' }, null, 2) + '\n';
  const resourceOutputs = [['public/splunk-content/resources.json', resourcesText]];
  const regions = [];
  for (const region of REGIONS) {
    let text = resourcesText;
    const resourceFile = region.id === 'SP-R01' ? 'splunk-content/resources.json' : `splunk-content/resources-${region.id}.json`;
    if (additionalRegions.some(r => r.id === region.id)) {
      const name = entries.find(e => e.id.startsWith(region.id + '-')).namespace;
      text = JSON.stringify(await additionalResource(root, `${RESEARCH}/${name}`, region, {json, safePath, sanitizeSplunk, sha256, ensure}), null, 2) + '\n';
      resourceOutputs.push([`public/${resourceFile}`, text]);
    } else if (region.id !== 'SP-R01') {
      const labSource = await readFile(await safePath(root, `${pkg}/PRACTICAS/${region.lab}`), 'utf8');
      const resource = { courseId: 'splunk', regionId: region.id, lab: sanitizeSplunk(labSource, region.id === 'SP-R03' ? ['203.0.113.9', '198.51.100.20', '192.0.2.25'] : []).text, datasets, note: 'Material sintético y documental, sin ingesta, envío HTTP ni ejecución SPL. La ventana relativa es ilustrativa; los conteos pertenecen al CSV fechado en UTC.' };
      if (region.id === 'SP-R03') {
        const fixture = await readFile(await safePath(root, `${pkg}/PRACTICAS/fixtures/auth_sintetico.csv`), 'utf8');
        ensure(sha256(fixture) === 'f9674d6c79e8d027034e75e398801ccddda369fd4fe817e4c54520fc8b9a79ab', 'Fixture R03 no autorizada');
        // Full byte/hash allowlist, not a global exception for CSV, addresses or emails.
        const ips = ['203.0.113.9', '198.51.100.20', '192.0.2.25'];
        const sanitized = sanitizeSplunk(fixture.replaceAll('@example.test', ' AT_EXAMPLE_TEST'), ips).text.replaceAll(' AT_EXAMPLE_TEST', '@example.test');
        ensure(sanitized === fixture, 'Fixture sintética no reconstruible');
        resource.fixture = { file: 'auth_sintetico.csv', sha256: sha256(fixture), text: fixture, synthetic: true };
      }
      text = JSON.stringify(resource, null, 2) + '\n';
      resourceOutputs.push([`public/${resourceFile}`, text]);
    }
    regions.push({ id: region.id, title: region.title, lessonIds: IMPORT_IDS.filter(id => id.startsWith(region.id + '-')), theme: region.theme, description: region.description, resourceFile, resourcesHash: sha256(text) });
  }
  const catalog = { schemaVersion: 1, courseId: 'splunk', pilot: false, curriculumHash: CANONICAL_SHA, editorialRevision: banks.get(PACKAGES[0]).editorial_revision, humanReview: 'pending_independent_review', rewardMode: 'provisional_only', manifests, resourcesHash: sha256(resourcesText), regions, lessons };
  const outputs = [...payloads, ...resourceOutputs, ['src/generated/splunk/search-index.json', JSON.stringify(lessons.map(l => ({ id: l.id, title: l.title, objective: l.objective })), null, 2) + '\n'], ['docs/SPLUNK-CONTENIDO.md', `# Splunk: contenido derivado V2.0\n\nGenerado por scripts/prepare-splunk.mjs. 80/80 lecciones; 160 MCQ y 80 abiertas formativas. Revisión humana pendiente; SPL no ejecutado.\n\n${lessons.map(l => `- ${l.id}: ${l.title}; revisión ${l.revision}; fuente ${l.sourceVersion}; requisitos: ${l.prerequisites.join(', ') || 'ninguno'}`).join('\n')}\n\nReconstrucción íntegra saneada y citas locales verificadas. Sin modificación de originales o derivados SC-200.\n`], ['src/generated/splunk/catalog.json', JSON.stringify(catalog, null, 2) + '\n']];
  ensure(outputs.every(([file]) => allowedDestination(file)), 'Salida fuera de destinos autorizados');
  return { catalog, outputs };
}
export async function generateSplunk(root = ROOT, requestedIds = IMPORT_IDS) {
  const before = await checkProtected(root);
  await checkV11Protected(root);
  const result = await buildSplunk(root, requestedIds);
  const baseline = await json(root, 'output/splunk-v11/respaldo/inventario.json');
  for (const lesson of baseline.r01.lessons) {
    ensure(JSON.stringify(result.catalog.lessons.find(l => l.id === lesson.id)) === JSON.stringify(lesson), `DETENER: cambio de revisión/IDs R01 ${lesson.id}`);
    ensure(sha256(result.outputs.find(([file]) => file === `public/${lesson.file}`)[1]) === lesson.payloadHash, `DETENER: payload R01 ${lesson.id}`);
  }
  const legacy = await json(root, 'output/splunk-v20/respaldo/inventario.json');
  for (const lesson of legacy.catalog.lessons) {
    ensure(JSON.stringify(result.catalog.lessons.find(l => l.id === lesson.id)) === JSON.stringify(lesson), `DETENER: metadatos R01–R03 ${lesson.id}`);
    ensure(sha256(result.outputs.find(([file]) => file === `public/${lesson.file}`)[1]) === lesson.payloadHash, `DETENER: payload R01–R03 ${lesson.id}`);
  }
  for (const region of legacy.catalog.regions) ensure(JSON.stringify(result.catalog.regions.find(r => r.id === region.id)) === JSON.stringify(region), `DETENER: recurso/región ${region.id}`);
  // Validate every destination before the first write. Never clear directories.
  for (const [file] of result.outputs) await safePath(root, file);
  for (const [file, content] of result.outputs) {
    const target = await safePath(root, file);
    try { if (await readFile(target, 'utf8') === content) continue; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await mkdir(path.dirname(target), { recursive: true });
    const temporary = target + '.splunk-staging';
    await safePath(root, path.relative(root, temporary));
    await writeFile(temporary, content, { flag: 'wx' });
    await rename(temporary, target);
  }
  const after = await checkProtected(root);
  await checkV11Protected(root);
  return { lessons: result.catalog.lessons.length, activities: result.catalog.lessons.reduce((n, l) => n + l.questionIds.length + l.formativeIds.length, 0), outputFiles: result.outputs.length, protectedBefore: before.checked, protectedAfter: after.checked, changes: 0 };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ensure(process.argv.length === 2, 'Sin overrides de fuente, IDs ni destinos en este piloto');
  console.log(JSON.stringify(await generateSplunk()));
}
