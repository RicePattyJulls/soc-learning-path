import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { sanitize } from './content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'REDES_MASTER_RESEARCH');
const sha = value => createHash('sha256').update(value).digest('hex');
const readJson = async file => JSON.parse(await readFile(path.join(base, file), 'utf8'));
const checks = [];
const check = (id, passed, detail = '') => checks.push({ id, passed: Boolean(passed), detail });
const manifest = await readJson('VALIDACION/MANIFIESTO-EDITORIAL.json');
const catalog = await readJson('VALIDACION/CATALOGO-EDITORIAL.json');
const bank = await readJson('04_ACTIVIDADES/BANCO-ACTIVIDADES.json');
const cases = await readJson('05_RECURSOS/CASOS-DOCENTES.json');
const sources = await readJson('05_RECURSOS/FUENTES.json');
const educationalReview = await readJson('VALIDACION/REVISION-EDUCATIVA.json');
const planBytes = await readFile(path.join(root, 'docs/redes/CATALOGO-PROPUESTO.json'));
const plan = JSON.parse(planBytes);
const allText = new Map();
for (const [file, expected] of Object.entries(manifest.hashes)) {
  const data = await readFile(path.join(base, file));
  allText.set(file, data.toString('utf8'));
  check(`hash:${file}`, sha(data) === expected);
}
for (const entry of manifest.authoringSources) check(`authoring_source:${entry.file}`, sha(await readFile(path.join(root, entry.file))) === entry.sha256);
check('plan_revision', sha(planBytes) === catalog.planSha256 && manifest.planSha256 === catalog.planSha256);
check('lesson_ids_match_plan', JSON.stringify(catalog.lessons.map(l => l.id)) === JSON.stringify(plan.lessons.map(l => l.id)));
check('counts', catalog.lessons.length === 168 && bank.activities.length === 504 && cases.cases.length === 168 && catalog.stages.length === 8);
check('unique_activity_ids', new Set(bank.activities.map(a => a.id)).size === 504);
check('unique_question_prompts', new Set(bank.activities.filter(a => a.type === 'multiple_choice').map(a => a.prompt)).size === 336);
check('unique_teaching_text', new Set(catalog.lessons.map(l => l.theoryFingerprint)).size === 168);
check('unique_examples', new Set(catalog.lessons.map(l => l.exampleFingerprint)).size === 168);
check('educational_review_scope', educationalReview.kind === 'author_self_review' && educationalReview.independent === false && educationalReview.status === 'completed_with_corrections' && educationalReview.lessonReviews.length === 168 && new Set(educationalReview.lessonReviews.map(r => r.lessonId)).size === 168);
check('question_feedback_is_specific', new Set(bank.activities.filter(a => a.type === 'multiple_choice').map(a => a.explanation)).size === 336 && bank.activities.filter(a => a.type === 'multiple_choice').every(a => !a.explanation.includes('Aplicación al caso:')));
check('question_edit_inventory', educationalReview.questionChanges.length === 45 && new Set(educationalReview.questionChanges.map(q => q.id)).size === 45 && educationalReview.questionChanges.every(q => bank.activities.some(a => a.id === q.id && a.type === 'multiple_choice')));
check('source_ids_unique', new Set(sources.sources.map(s => s.id)).size === sources.sources.length);
check('source_urls_primary_https', sources.sources.every(s => {
  const u = new URL(s.url);
  return u.protocol === 'https:' && ['www.rfc-editor.org', 'docs.frrouting.org', 'docs.kernel.org', 'www.cisco.com', 'www.ieee802.org', 'www.wireshark.org', 'docs.zeek.org', 'docs.suricata.io', 'csrc.nist.gov', 'docs.aws.amazon.com', 'learn.microsoft.com', 'help.splunk.com', 'docs.python.org', 'yaml.org', 'git-scm.com', 'docs.ansible.com'].includes(u.hostname);
}));
const parser = unified().use(remarkParse).use(remarkGfm);
const expectedSections = ['1. Objetivo', '2. Comprende el mecanismo', '3. Caso resuelto', '4. Práctica individual', '5. Evalúa lo aprendido', '6. Aplicación profesional', '7. Referencias y ampliación'];
const dependencies = new Map();
const minWords = Math.min(...catalog.lessons.map(l => l.learningWordCount));
for (const lesson of catalog.lessons) {
  const text = allText.get(lesson.file);
  const original = plan.lessons.find(l => l.id === lesson.id);
  const metadataMatch = /<!-- redes-meta (.+) -->/.exec(text);
  const metadata = metadataMatch ? JSON.parse(metadataMatch[1]) : null;
  const tree = parser.parse(text);
  const headings = [], links = [], html = [], fences = [];
  visit(tree, 'heading', node => { headings.push({ depth: node.depth, text: node.children.map(c => c.value || '').join('') }); });
  visit(tree, 'link', node => { links.push(node.url); });
  visit(tree, 'html', node => { html.push(node.value); });
  visit(tree, 'code', node => { fences.push(node); });
  const chunks = [...text.matchAll(/^## (.+)$/gm)];
  const reconstructed = text.slice(0, chunks[0].index) + chunks.map((m, i) => text.slice(m.index, chunks[i + 1]?.index ?? text.length)).join('');
  check(`${lesson.id}:metadata`, metadata?.id === lesson.id && metadata.courseId === 'redes' && metadata.examplesSynthetic === true && metadata.humanReview === 'pending_independent_review' && metadata.practicalStatus === 'not_assessed');
  check(`${lesson.id}:title`, headings.filter(h => h.depth === 1).length === 1 && headings[0].text === `${lesson.id} — ${original.title}`);
  check(`${lesson.id}:sections`, JSON.stringify(headings.filter(h => h.depth === 2).map(h => h.text)) === JSON.stringify(expectedSections));
  check(`${lesson.id}:reconstruction`, reconstructed === text && sha(text) === lesson.sha256);
  check(`${lesson.id}:objectives_and_dependencies`, text.includes(lesson.objective) && JSON.stringify(lesson.prerequisites) === JSON.stringify(original.prerequisites) && JSON.stringify(metadata.prerequisites) === JSON.stringify(lesson.prerequisites));
  check(`${lesson.id}:no_raw_html`, html.length === 1 && html[0] === metadataMatch[0] && fences.every(f => !/<script\b/i.test(f.value)));
  check(`${lesson.id}:not_placeholder`, lesson.learningWordCount >= 220 && !/\b(?:TODO|TBD|LOREM IPSUM)\b/.test(text));
  check(`${lesson.id}:solution_separation`, lesson.solutionFile.startsWith('03_SOLUCIONES/') && !text.includes('**Respuesta:') && !text.includes('correctOptionId') && allText.get(lesson.solutionFile)?.includes('## Práctica individual'));
  check(`${lesson.id}:references`, lesson.referenceIds.every(id => sources.sources.some(s => s.id === id) && text.includes(`**${id}**`)));
  let localLinksExist = true;
  for (const link of links.filter(l => !/^(https?:|#)/.test(l))) {
    const target = path.resolve(base, path.dirname(lesson.file), link);
    if (!target.startsWith(base + path.sep)) { localLinksExist = false; continue; }
    try { await readFile(target); } catch { localLinksExist = false; }
  }
  check(`${lesson.id}:local_resource_links`, localLinksExist);
  const addresses = [...new Set(text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [])];
  let protectedText = text;
  let addressesValid = true;
  addresses.forEach((ip, i) => {
    const doc = /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/.test(ip) && ip.split('.').every(n => +n <= 255);
    const special = ip === '0.0.0.0' || lesson.id === 'RED-M36-L01' && ip === '999.0.2.70' || lesson.id === 'RED-M36-L03' && ip === '999.0.2.1';
    if (!doc && !special) addressesValid = false;
    protectedText = protectedText.replaceAll(ip, `REDES_DOC_VALIDATED_IP_${i}_END`);
  });
  check(`${lesson.id}:sanitization`, addressesValid && sanitize(protectedText).redactions.length === 0);
  const items = bank.activities.filter(a => a.lessonId === lesson.id);
  const questions = items.filter(a => a.type === 'multiple_choice');
  const practices = items.filter(a => a.type === 'open_practice');
  const reviewed = educationalReview.lessonReviews.find(r => r.lessonId === lesson.id);
  check(`${lesson.id}:educational_review_provenance`, reviewed?.sourceHash === lesson.sha256 && metadata.educationalReview?.kind === 'author_self_review' && metadata.educationalReview?.independent === false && metadata.educationalReview?.status === 'completed_with_corrections' && JSON.stringify(reviewed.feedbackReviewed) === JSON.stringify(lesson.questionIds));
  check(`${lesson.id}:prerequisites_precede_lesson`, lesson.prerequisites.every(id => plan.lessons.findIndex(l => l.id === id) < plan.lessons.findIndex(l => l.id === lesson.id)));
  check(`${lesson.id}:vocabulary_support`, text.includes('### Vocabulario de apoyo') && links.includes('../../05_RECURSOS/GLOSARIO.md'));
  check(`${lesson.id}:activity_inventory`, items.length === 3 && questions.length === 2 && practices.length === 1 && JSON.stringify(questions.map(q => q.id)) === JSON.stringify(lesson.questionIds));
  for (const question of questions) {
    const correct = question.options.filter(o => o.id === question.correctOptionId);
    check(`${question.id}:answer_contract`, question.autoGradable === true && question.options.length === 4 && new Set(question.options.map(o => o.id)).size === 4 && new Set(question.options.map(o => o.text)).size === 4 && correct.length === 1 && correct[0].text === question.correctAnswer && question.explanation.includes(question.correctAnswer));
    check(`${question.id}:student_question`, text.includes(question.prompt) && question.options.every(o => text.includes(`- ${o.id}. ${o.text}`)));
    check(`${question.id}:teaching_anchors`, question.anchors.length >= 2 && question.anchors.every(a => a.file === lesson.file && a.sourceHash === lesson.sha256 && text.split('\n').slice(a.line - 1, a.endLine).join('\n').trimEnd() === a.quote && a.endLine < text.slice(0, text.indexOf('## 5. Evalúa')).split('\n').length));
    check(`${question.id}:solution_key`, allText.get(lesson.solutionFile).includes(`**Respuesta: ${question.correctOptionId}. ${question.correctAnswer}**`));
    const specificFeedback = question.explanation.split('\n\n').slice(1).join('\n\n');
    check(`${question.id}:specific_feedback`, specificFeedback.length >= 45 && allText.get(lesson.solutionFile).includes(specificFeedback) && !specificFeedback.includes('## 2.') && question.educationalReview?.kind === 'author_self_review');
  }
  check(`${lesson.id}:practice_contract`, practices.length === 1 && practices[0].autoGradable === false && practices[0].practicalMasteryEligible === false && practices[0].referenceAnswer.length >= 25 && practices[0].rubric.length === 3 && allText.get(lesson.solutionFile).includes(practices[0].referenceAnswer));
  const studentPractice = text.slice(text.indexOf('## 4. Práctica individual'), text.indexOf('## 5. Evalúa lo aprendido'));
  check(`${lesson.id}:specific_private_rubric`, reviewed?.practiceCriteria.length === 2 && reviewed.practiceCriteria.every(criterion => practices[0].rubric.some(r => r.evidence === criterion) && allText.get(lesson.solutionFile).includes(criterion)) && !studentPractice.includes(practices[0].referenceAnswer) && !studentPractice.includes('### Criterios observables') && !studentPractice.includes('### Qué debe mostrar tu respuesta'));
  check(`${lesson.id}:case_contract`, cases.cases.some(c => c.lessonId === lesson.id && c.synthetic && c.acquisition === 'authored_not_captured' && text.includes(c.data)));
  dependencies.set(lesson.id, lesson.prerequisites);
}
const visited = new Set(), visiting = new Set();
let acyclic = true;
function visitDependency(id) {
  if (visited.has(id)) return;
  if (visiting.has(id) || !dependencies.has(id)) { acyclic = false; return; }
  visiting.add(id); dependencies.get(id).forEach(visitDependency); visiting.delete(id); visited.add(id);
}
[...dependencies.keys()].forEach(visitDependency);
check('lesson_dependency_graph', acyclic && visited.size === 168);
check('stage_membership', catalog.stages.every(s => s.lessonIds.every(id => catalog.lessons.some(l => l.id === id && l.stageId === s.id))) && catalog.stages.flatMap(s => s.lessonIds).length === 168);
check('no_runtime_integration_claim', catalog.invariants.appIntegrated === false && catalog.invariants.labsExecutedByThisWork === 0 && bank.policy.practicalAutoGrading === false && bank.policy.theoryMasteryThreshold === null);
for (const lab of catalog.labFiles) {
  const text = allText.get(lab.file);
  check(`${lab.id}:lab_guide`, text?.includes('no ejecutada') && text.includes('## Restauración') && text.includes('## Pruebas positivas') && text.includes('## Controles negativos') && text.includes('## Evidencias y evaluación'));
}
const fixture = await readJson('05_RECURSOS/DETECCION-120.json');
const metrics = variant => fixture.rows.reduce((r, row) => {
  const alert = row.ruleAlerts && !(variant && row.telemetryLostInVariant);
  r[row.actualPositive ? alert ? 'tp' : 'fn' : alert ? 'fp' : 'tn']++;
  return r;
}, { tp: 0, fn: 0, fp: 0, tn: 0 });
const normal = metrics(false), degraded = metrics(true);
check('golden_detection_metrics', normal.tp === 15 && normal.fn === 5 && normal.fp === 10 && normal.tn === 90 && normal.fp / (normal.fp + normal.tn) === .1 && normal.fn / (normal.tp + normal.fn) === .25 && normal.tp / (normal.tp + normal.fp) === .6);
check('golden_telemetry_loss', degraded.tp === 10 && degraded.fn === 10 && degraded.fn / (degraded.tp + degraded.fn) === .5);
const company = await readJson('05_RECURSOS/EMPRESA-LAB.json');
const companyAnswer = await readJson('03_SOLUCIONES/EMPRESA-LAB-SOLUCION.json');
const event = company.beforeEvidence.find(e => e.id === 'P1-FW');
const collector = company.beforeEvidence.find(e => e.id === 'P1-COLLECTOR');
const correctedTime = new Date(Date.parse(event.timestamp) - event.clockOffsetSeconds * 1000).toISOString();
check('golden_event_time', Date.parse(correctedTime) === Date.parse(companyAnswer.correctedEventTime) && (Date.parse(collector.receivedAt) - Date.parse(correctedTime)) / 1000 === companyAnswer.collectorDelaySeconds);
const lessonText = id => allText.get(catalog.lessons.find(l => l.id === id).file);
const companyInvestigation = lessonText('RED-M41-L03');
check('company_fixture_no_invented_service_response', !company.beforeEvidence.some(e => 'serviceResponse' in e || 'authenticationResult' in e) && companyInvestigation.includes('El fixture no incluye respuesta del servicio ni resultado de autenticación') && !companyInvestigation.includes('recibe respuesta de servicio') && bank.activities.find(a => a.id === 'RED-M41-L03-P01').referenceAnswer.includes('quedan sin demostrar'));
check('kerberos_request_result_explicit', lessonText('RED-M28-L03').includes('Status=0x0 (éxito)') && lessonText('RED-M28-L03').includes('sin su resultado también puede representar un fallo'));
check('dns_capture_scope_explicit', lessonText('RED-M05-L01').includes('UDP/TCP 53') && lessonText('RED-M05-L01').includes('DNS cifrado puede utilizar otros transportes') && bank.activities.find(a => a.id === 'RED-M05-L01-Q02').prompt.includes('convencionales'));

// Original research and existing learning catalogs must remain byte-identical
// to the architectural review that preceded content authoring.
const baseline = JSON.parse(await readFile(path.join(root, 'docs/redes/VALIDACION-ESTRUCTURAL.json')));
for (const file of baseline.sourceManifest) check(`original_research:${file.file}`, sha(await readFile(path.join(base, '01_INVESTIGACION', file.file))) === file.sha256);
check('sc200_catalog_preserved', sha(await readFile(path.join(root, 'src/generated/catalog.json'))) === baseline.existingCatalogHashes.sc200);
check('splunk_catalog_preserved', sha(await readFile(path.join(root, 'src/generated/splunk/catalog.json'))) === baseline.existingCatalogHashes.splunk);
const stageCounts = await Promise.all(catalog.stages.map(async s => ({ stage: s.id, count: (await readdir(path.join(base, '02_LECCIONES', s.id))).filter(n => n.endsWith('.md')).length, expected: s.lessonIds.length })));
check('no_extra_or_missing_lesson_files', stageCounts.every(c => c.count === c.expected));
const report = { schemaVersion: 1, scope: 'Offline editorial structure, provenance, educational review delivery contracts, source anchors and selected numerical fixtures. These automated checks do not prove semantic quality, technical certification, browser behavior or lab execution.',
  totals: { lessons: catalog.lessons.length, questions: 336, practices: 168, lessonCases: cases.cases.length, labGuidesDesigned: catalog.labFiles.length,
    learningWords: catalog.lessons.reduce((n, l) => n + l.learningWordCount, 0), minimumLearningWordsPerLesson: minWords,
    checksPassed: checks.filter(c => c.passed).length, checksTotal: checks.length },
  metricsFixture: { normal, degraded }, educationalReview: { kind: educationalReview.kind, status: educationalReview.status, independent: false }, humanReview: 'pending_independent_review', appIntegrated: false, labsExecuted: 0, checks };
const target = path.join(root, 'docs/redes/VALIDACION-CONTENIDO.json');
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report.totals, failed: checks.filter(c => !c.passed) }, null, 2));
if (checks.some(c => !c.passed)) process.exitCode = 1;
